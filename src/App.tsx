import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BetTargetType,
  ColorType,
  GameMode,
  Language,
  RoundResult,
  SizeType,
  UserBet,
  UserWallet,
} from './types';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { PeriodCountdownCard } from './components/PeriodCountdownCard';
import { BettingBoard } from './components/BettingBoard';
import { BetModal } from './components/BetModal';
import { ResultModal } from './components/ResultModal';
import { HistoryAndTrends } from './components/HistoryAndTrends';
import { RechargeModal } from './components/RechargeModal';
import { RulesModal } from './components/RulesModal';
import { Lucky3DSphere } from './components/Lucky3DSphere';
import { ColorReductionGame } from './components/ColorReductionGame';
import { VIPTicker } from './components/VIPTicker';
import {
  calculateBetResult,
  formatCurrency,
  generateInitialHistory,
  generatePeriodId,
  generateRandomResult,
} from './utils/gameLogic';
import { sound } from './utils/sound';
import { Sparkles, Dices, Sliders } from 'lucide-react';
import { translations } from './utils/translations';

const STORAGE_KEYS = {
  WALLET: 'color_pred_wallet_v1',
  HISTORY: 'color_pred_history_v1',
  BETS: 'color_pred_bets_v1',
  LANG: 'color_pred_lang_v1',
  SOUND: 'color_pred_sound_v1',
};

export default function App() {
  // 1. Language state (defaults to Hindi as requested by the user prompt, with seamless English toggle)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      return (saved === 'en' || saved === 'hi') ? saved : 'hi';
    } catch {
      return 'hi';
    }
  });

  const t = translations[language];

  // 2. Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // 3. User Wallet
  const [wallet, setWallet] = useState<UserWallet>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WALLET);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      balance: 10000,
      totalWon: 0,
      totalLost: 0,
      totalBetsPlaced: 0,
    };
  });

  // 4. Game Mode (30s fast mode by default)
  const [gameMode, setGameMode] = useState<GameMode>('30s');
  // Top-level game selector: 'wingo' (Color Prediction) or 'reduction' (Color Reduction Game)
  const [activeGameTab, setActiveGameTab] = useState<'wingo' | 'reduction'>('wingo');
  // 3D Lucky Sphere toggle
  const [show3DStage, setShow3DStage] = useState<boolean>(true);

  // 5. History records
  const [history, setHistory] = useState<Record<GameMode, RoundResult[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      '30s': generateInitialHistory('30s', 25),
      '1m': generateInitialHistory('1m', 25),
      '3m': generateInitialHistory('3m', 20),
    };
  });

  // 6. User Bets
  const [userBets, setUserBets] = useState<UserBet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BETS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // 7. Modals state
  const [betModalData, setBetModalData] = useState<{
    isOpen: boolean;
    targetType: BetTargetType;
    selectedColor?: ColorType;
    selectedNumber?: number;
    selectedSize?: SizeType;
  }>({
    isOpen: false,
    targetType: 'color',
  });

  const [resultModalData, setResultModalData] = useState<{
    isOpen: boolean;
    result: RoundResult | null;
    roundBets: UserBet[];
  }>({
    isOpen: false,
    result: null,
    roundBets: [],
  });

  const [rechargeModalOpen, setRechargeModalOpen] = useState<boolean>(false);
  const [rulesModalOpen, setRulesModalOpen] = useState<boolean>(false);

  // 8. Clock & Period Timer Management
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30);
  const [currentPeriod, setCurrentPeriod] = useState<string>(() => generatePeriodId('30s'));

  // Track sound on changes
  useEffect(() => {
    sound.enabled = soundEnabled;
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, String(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  // Persist wallet
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
    } catch {
      // ignore
    }
  }, [wallet]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Persist bets
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BETS, JSON.stringify(userBets));
    } catch {
      // ignore
    }
  }, [userBets]);

  // Persist language
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, language);
    } catch {
      // ignore
    }
  }, [language]);

  const totalRoundSeconds = gameMode === '30s' ? 30 : gameMode === '1m' ? 60 : 180;

  // Settle round handler
  const settleRound = useCallback((periodToSettle: string, mode: GameMode) => {
    // 1. Generate new round result
    const newResult = generateRandomResult(periodToSettle, mode);

    // 2. Add to history
    setHistory((prev) => ({
      ...prev,
      [mode]: [newResult, ...prev[mode].slice(0, 49)],
    }));

    // 3. Settle any pending bets for this period and mode
    let roundWinnings = 0;
    let roundLosses = 0;
    const settledPeriodBets: UserBet[] = [];

    setUserBets((prevBets) =>
      prevBets.map((bet) => {
        if (bet.period === periodToSettle && bet.gameMode === mode && bet.status === 'pending') {
          const { status, winAmount } = calculateBetResult(bet, newResult);
          const settledBet: UserBet = {
            ...bet,
            status,
            winAmount,
            roundResult: newResult,
          };
          settledPeriodBets.push(settledBet);
          if (status === 'won') {
            roundWinnings += winAmount;
          } else {
            roundLosses += bet.totalBet;
          }
          return settledBet;
        }
        return bet;
      })
    );

    // 4. Update wallet balance if there are winnings
    if (roundWinnings > 0 || roundLosses > 0) {
      setWallet((w) => ({
        ...w,
        balance: w.balance + roundWinnings,
        totalWon: w.totalWon + roundWinnings,
        totalLost: w.totalLost + roundLosses,
      }));
    }

    // 5. Open results popup
    setResultModalData({
      isOpen: true,
      result: newResult,
      roundBets: settledPeriodBets,
    });
  }, []);

  // Timer loop
  const lastSettledPeriodRef = useRef<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentSec = now.getSeconds();
      const currentMs = now.getMilliseconds();
      const intervalSec = gameMode === '30s' ? 30 : gameMode === '1m' ? 60 : 180;

      const totalSec = now.getHours() * 3600 + now.getMinutes() * 60 + currentSec;
      const mod = totalSec % intervalSec;
      const left = intervalSec - mod;

      setRemainingSeconds(left);

      const period = generatePeriodId(gameMode);
      setCurrentPeriod(period);

      // Play tick audio when countdown is 5, 4, 3, 2, 1
      if (left <= 5 && left > 0 && currentMs < 200) {
        sound.playTick(left <= 3);
      }

      // When reaching zero, check if we need to settle
      if (left === intervalSec || left === 0) {
        const prevPeriod = generatePeriodId(gameMode, -1);
        if (lastSettledPeriodRef.current !== prevPeriod) {
          lastSettledPeriodRef.current = prevPeriod;
          settleRound(prevPeriod, gameMode);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 500);
    return () => clearInterval(interval);
  }, [gameMode, settleRound]);

  // Handler to place a bet
  const handleConfirmBet = (amount: number, multiplier: number) => {
    const totalBet = amount * multiplier;
    if (wallet.balance < totalBet) return;

    // Deduct contract money immediately from wallet
    setWallet((w) => ({
      ...w,
      balance: w.balance - totalBet,
      totalBetsPlaced: w.totalBetsPlaced + 1,
    }));

    const newBet: UserBet = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      period: currentPeriod,
      gameMode,
      targetType: betModalData.targetType,
      selectedColor: betModalData.selectedColor,
      selectedNumber: betModalData.selectedNumber,
      selectedSize: betModalData.selectedSize,
      amount,
      multiplier,
      totalBet,
      status: 'pending',
      createdAt: Date.now(),
    };

    setUserBets((prev) => [newBet, ...prev]);
  };

  // Fund helpers
  const handleAddFunds = (amount: number) => {
    setWallet((w) => ({
      ...w,
      balance: w.balance + amount,
    }));
  };

  const handleResetWallet = () => {
    setWallet({
      balance: 10000,
      totalWon: 0,
      totalLost: 0,
      totalBetsPlaced: 0,
    });
  };

  const currentModeHistory = history[gameMode] || [];
  const currentModeBets = userBets.filter((b) => b.gameMode === gameMode);
  const isLocked = remainingSeconds <= 5;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white pb-12">
      {/* Top Header */}
      <Header
        wallet={wallet}
        language={language}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
        onOpenRecharge={() => setRechargeModalOpen(true)}
        onOpenRules={() => setRulesModalOpen(true)}
        onResetBalance={handleResetWallet}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-4 sm:space-y-5">
        {/* VIP Live Winners Ticker */}
        <VIPTicker language={language} />

        {/* Top Game Switcher Tabs: Win Go vs Color Reduction */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-md">
          <button
            id="tab-select-wingo"
            onClick={() => setActiveGameTab('wingo')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeGameTab === 'wingo'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Dices className="w-4 h-4 text-emerald-300" />
            <span>{t.modeWinGo}</span>
          </button>

          <button
            id="tab-select-reduction"
            onClick={() => setActiveGameTab('reduction')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeGameTab === 'reduction'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-indigo-300" />
            <span>{t.modeColorReduction}</span>
            <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold uppercase hidden sm:inline-block">
              NEW
            </span>
          </button>
        </div>

        {activeGameTab === 'wingo' ? (
          <>
            {/* Game Mode Selector (30s / 1m / 3m) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex-1">
                <ModeSelector
                  currentMode={gameMode}
                  onSelectMode={(mode) => setGameMode(mode)}
                  language={language}
                />
              </div>
              <button
                id="btn-toggle-3d-sphere"
                onClick={() => setShow3DStage((v) => !v)}
                className={`self-end sm:self-auto px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  show3DStage
                    ? 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.toggle3DView}</span>
              </button>
            </div>

            {/* Responsive Bento Section: 3D Lucky Sphere & Countdown Card */}
            <div className={`grid gap-4 ${show3DStage ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
              {/* Period & Countdown Card */}
              <div className={show3DStage ? 'lg:col-span-6' : 'col-span-1'}>
                <PeriodCountdownCard
                  period={currentPeriod}
                  remainingSeconds={remainingSeconds}
                  totalRoundSeconds={totalRoundSeconds}
                  recentResults={currentModeHistory}
                  language={language}
                />
              </div>

              {/* 3D Interactive Lucky Sphere */}
              {show3DStage && (
                <div className="lg:col-span-6">
                  <Lucky3DSphere
                    remainingSeconds={remainingSeconds}
                    isLocked={isLocked}
                    lastResult={currentModeHistory[0]}
                    language={language}
                    onSelectColor={(color) => {
                      setBetModalData({
                        isOpen: true,
                        targetType: 'color',
                        selectedColor: color,
                      });
                    }}
                  />
                </div>
              )}
            </div>

            {/* Core Betting Board (Green/Violet/Red, 0-9, Big/Small) */}
            <BettingBoard
              isLocked={isLocked}
              remainingSeconds={remainingSeconds}
              language={language}
              onOpenBetModal={(targetType, payload) => {
                setBetModalData({
                  isOpen: true,
                  targetType,
                  ...payload,
                });
              }}
            />

            {/* History, Trend Chart, User Bets & Rules */}
            <HistoryAndTrends
              history={currentModeHistory}
              userBets={currentModeBets}
              gameMode={gameMode}
              language={language}
            />
          </>
        ) : (
          /* Color Reduction Game Section */
          <div className="space-y-5">
            <ColorReductionGame
              wallet={wallet}
              language={language}
              onUpdateWallet={(newWallet) => setWallet(newWallet)}
            />

            {/* History and Trends also visible */}
            <HistoryAndTrends
              history={currentModeHistory}
              userBets={currentModeBets}
              gameMode={gameMode}
              language={language}
            />
          </div>
        )}
      </main>

      {/* Mobile Sticky Quick Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="text-left">
            <div className="text-[10px] text-slate-400 font-medium leading-tight">
              {activeGameTab === 'wingo' ? `${gameMode.toUpperCase()} Round` : 'Reduction'}
            </div>
            <div className="text-xs font-mono font-bold text-amber-300">
              {formatCurrency(wallet.balance)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-medium leading-tight">
              {t.countDown}
            </div>
            <div className={`text-xs font-mono font-bold ${isLocked ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {remainingSeconds}s
            </div>
          </div>
          <button
            id="btn-mobile-quick-recharge"
            onClick={() => setRechargeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow active:scale-95"
          >
            + ₹ Fund
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="max-w-4xl mx-auto px-4 text-center text-xs text-slate-500 mt-4">
        <p className="flex items-center justify-center gap-1.5 flex-wrap">
          <span>{language === 'hi' ? 'कलर प्रेडिक्शन गेम सिमुलेटर' : 'Color Prediction Game Simulator'}</span>
          <span>•</span>
          <span className="text-emerald-500 font-medium">100% Free Demo Mode</span>
          <span>•</span>
          <span>{language === 'hi' ? 'सुरक्षित और निष्पक्ष गेमिंग' : 'Fair & Transparent Odds'}</span>
        </p>
      </footer>

      {/* Bet Placement Modal */}
      <BetModal
        isOpen={betModalData.isOpen}
        onClose={() => setBetModalData((prev) => ({ ...prev, isOpen: false }))}
        targetType={betModalData.targetType}
        selectedColor={betModalData.selectedColor}
        selectedNumber={betModalData.selectedNumber}
        selectedSize={betModalData.selectedSize}
        wallet={wallet}
        language={language}
        onConfirmBet={handleConfirmBet}
      />

      {/* Result Announcement Modal */}
      <ResultModal
        isOpen={resultModalData.isOpen}
        onClose={() => setResultModalData((prev) => ({ ...prev, isOpen: false }))}
        result={resultModalData.result}
        roundBets={resultModalData.roundBets}
        language={language}
      />

      {/* Demo Funds Recharge Modal */}
      <RechargeModal
        isOpen={rechargeModalOpen}
        onClose={() => setRechargeModalOpen(false)}
        wallet={wallet}
        language={language}
        onAddFunds={handleAddFunds}
        onResetWallet={handleResetWallet}
      />

      {/* Rules Guide Modal */}
      <RulesModal
        isOpen={rulesModalOpen}
        onClose={() => setRulesModalOpen(false)}
        language={language}
      />
    </div>
  );
}
