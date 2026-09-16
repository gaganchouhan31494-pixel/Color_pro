import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AppPage,
  BetTargetType,
  ColorThemeId,
  ColorType,
  DepositRecord,
  GameMode,
  Language,
  ReferralData,
  RoundResult,
  SizeType,
  UserAccount,
  UserBet,
  UserWallet,
  WithdrawRecord,
  ThemeMode,
} from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AuthModal } from './components/AuthModal';
import { DepositPage } from './components/DepositPage';
import { WithdrawPage } from './components/WithdrawPage';
import { TransactionsView } from './components/TransactionsView';
import { ReferPage } from './components/ReferPage';
import { ProofPage } from './components/ProofPage';
import { SupportPage } from './components/SupportPage';
import { AboutPage } from './components/AboutPage';
import { ProfilePage } from './components/ProfilePage';
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
import { Hero3DBanner } from './components/Hero3DBanner';
import { MobileDrawer } from './components/MobileDrawer';
import { ThemeModal } from './components/ThemeModal';
import { LiveBetsFeed } from './components/LiveBetsFeed';
import { COLOR_THEMES } from './utils/themeConfig';
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
import {
  INITIAL_USER,
  INITIAL_DEPOSITS,
  INITIAL_WITHDRAWALS,
  INITIAL_REFERRAL_DATA,
} from './utils/dummyData';

const STORAGE_KEYS = {
  WALLET: 'color_pred_wallet_v2',
  HISTORY: 'color_pred_history_v2',
  BETS: 'color_pred_bets_v2',
  LANG: 'color_pred_lang_v2',
  SOUND: 'color_pred_sound_v2',
  USER: 'color_pred_user_v2',
  DEPOSITS: 'color_pred_deposits_v2',
  WITHDRAWALS: 'color_pred_withdrawals_v2',
  REFERRAL: 'color_pred_referral_v2',
};

export default function App() {
  // 1. Current Active Page
  const [activePage, setActivePage] = useState<AppPage>('game');

  // 2. Language state (defaults to Hindi as requested by the user prompt, with seamless English toggle)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      return (saved === 'en' || saved === 'hi') ? saved : 'hi';
    } catch {
      return 'hi';
    }
  });

  const t = translations[language];

  // 3. User Authentication State
  const [user, setUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_USER;
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // 4. Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // 5. User Wallet
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
      totalDeposited: 15000,
      totalWithdrawn: 14500,
    };
  });

  // 6. Deposit and Withdrawal History Records
  const [deposits, setDeposits] = useState<DepositRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEPOSITS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_DEPOSITS;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_WITHDRAWALS;
  });

  // 7. Referral Commission Data
  const [referralData, setReferralData] = useState<ReferralData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REFERRAL);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REFERRAL_DATA;
  });

  // 8. Game Mode (30s fast mode by default)
  const [gameMode, setGameMode] = useState<GameMode>('30s');
  // Top-level game selector: 'wingo' (Color Prediction) or 'reduction' (Color Reduction Game)
  const [activeGameTab, setActiveGameTab] = useState<'wingo' | 'reduction'>('wingo');
  // 3D Lucky Sphere toggle
  const [show3DStage, setShow3DStage] = useState<boolean>(true);

  // 9. History records
  const [history, setHistory] = useState<Record<GameMode, RoundResult[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      '30s': generateInitialHistory('30s', 35),
      '1m': generateInitialHistory('1m', 35),
      '3m': generateInitialHistory('3m', 30),
    };
  });

  // 10. User Bets
  const [userBets, setUserBets] = useState<UserBet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BETS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // 11. Modals state
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [themeModalOpen, setThemeModalOpen] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<ColorThemeId>(() => {
    try {
      const saved = localStorage.getItem('color_game_theme');
      if (saved && Object.keys(COLOR_THEMES).includes(saved)) {
        return saved as ColorThemeId;
      }
    } catch {
      // ignore
    }
    return 'monochrome';
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const savedMode = localStorage.getItem('color_game_mode');
      if (savedMode === 'light' || savedMode === 'dark') return savedMode as ThemeMode;
    } catch {
      // ignore
    }
    return 'dark';
  });

  // Toggle between Light and Dark modes
  const handleToggleThemeMode = useCallback(() => {
    sound.playClick();
    setThemeMode((prevMode) => {
      const nextMode: ThemeMode = prevMode === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('color_game_mode', nextMode);
      } catch {
        // ignore
      }
      if (nextMode === 'light') {
        setCurrentTheme('pearlWhite');
      } else {
        setCurrentTheme('monochrome');
      }
      return nextMode;
    });
  }, []);

  const handleSelectTheme = (themeId: ColorThemeId) => {
    sound.playClick();
    setCurrentTheme(themeId);
    const cfg = COLOR_THEMES[themeId];
    if (cfg) {
      setThemeMode(cfg.mode);
      try {
        localStorage.setItem('color_game_mode', cfg.mode);
      } catch {
        // ignore
      }
    }
  };

  // Persist active color theme
  useEffect(() => {
    try {
      localStorage.setItem('color_game_theme', currentTheme);
    } catch {
      // ignore
    }
  }, [currentTheme]);

  // 12. Clock & Period Timer Management
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

  // Persist user
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  // Persist deposits
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(deposits));
    } catch {
      // ignore
    }
  }, [deposits]);

  // Persist withdrawals
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
    } catch {
      // ignore
    }
  }, [withdrawals]);

  // Persist referral
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REFERRAL, JSON.stringify(referralData));
    } catch {
      // ignore
    }
  }, [referralData]);

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
    const newResult = generateRandomResult(periodToSettle, mode);

    setHistory((prev) => ({
      ...prev,
      [mode]: [newResult, ...prev[mode].slice(0, 49)],
    }));

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

    if (roundWinnings > 0 || roundLosses > 0) {
      setWallet((w) => ({
        ...w,
        balance: w.balance + roundWinnings,
        totalWon: w.totalWon + roundWinnings,
        totalLost: w.totalLost + roundLosses,
      }));
    }

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

      if (left <= 5 && left > 0 && currentMs < 200) {
        sound.playTick(left <= 3);
      }

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

  // Fund handlers for Deposit Page
  const handleDepositSuccess = (amount: number, method: 'upi' | 'paytm' | 'phonepe' | 'gpay' | 'bank' | 'usdt') => {
    // 10% instant deposit bonus
    const bonus = Math.round(amount * 0.1);
    const totalAdded = amount + bonus;

    setWallet((w) => ({
      ...w,
      balance: w.balance + totalAdded,
      totalDeposited: (w.totalDeposited || 0) + totalAdded,
    }));

    const newRecord: DepositRecord = {
      id: 'dep-' + Date.now(),
      amount,
      bonus,
      method,
      status: 'completed',
      utr: '948' + Math.floor(100000000 + Math.random() * 900000000),
      timestamp: Date.now(),
    };

    setDeposits((prev) => [newRecord, ...prev]);
  };

  // Withdrawal handler for Withdraw Page
  const handleWithdrawalRequest = (amount: number, method: 'bank' | 'upi', targetAddress: string): boolean => {
    if (wallet.balance < amount) return false;
    setWallet((w) => ({
      ...w,
      balance: w.balance - amount,
      totalWithdrawn: (w.totalWithdrawn || 0) + amount,
    }));

    const newRecord: WithdrawRecord = {
      id: 'wd-' + Date.now(),
      amount,
      fee: 0,
      payoutMethod: method,
      targetAddress,
      status: 'completed',
      utr: '948' + Math.floor(100000000 + Math.random() * 900000000),
      timestamp: Date.now(),
    };

    setWithdrawals((prev) => [newRecord, ...prev]);
    return true;
  };

  // Referral Claim Commission handler
  const handleClaimCommission = (amount: number) => {
    setWallet((w) => ({
      ...w,
      balance: w.balance + amount,
      totalWon: w.totalWon + amount,
    }));

    setReferralData((prev) => ({
      ...prev,
      unclaimedCommission: 0,
      totalCommission: prev.totalCommission + amount,
    }));
  };

  // Direct demo recharge modal helper
  const handleAddFundsDirect = (amount: number) => {
    handleDepositSuccess(amount, 'upi');
  };

  const handleResetWallet = () => {
    setWallet({
      balance: 10000,
      totalWon: 0,
      totalLost: 0,
      totalBetsPlaced: 0,
      totalDeposited: 15000,
      totalWithdrawn: 14500,
    });
  };

  // Auth handler
  const handleAuthSuccess = (phone: string, username: string) => {
    setUser({
      id: 'UID' + Math.floor(100000 + Math.random() * 900000),
      username,
      phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isLoggedIn: true,
      vipLevel: 3,
      registrationDate: new Date().toLocaleDateString('en-IN'),
      bankDetails: {
        bankName: 'State Bank of India',
        accountNumber: '••••6721',
        ifsc: 'SBIN0001245',
        accountHolder: username,
        upiId: `${username.toLowerCase()}@okhdfc`,
      },
    });
  };

  const handleLogout = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    sound.playClick();
  };

  const currentModeHistory = history[gameMode] || [];
  const currentModeBets = userBets.filter((b) => b.gameMode === gameMode);
  const isLocked = remainingSeconds <= 5;
  const activeTheme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;

  return (
    <div className={`min-h-screen ${activeTheme.bgClass} text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white pb-32 sm:pb-16 relative overflow-x-hidden transition-colors duration-500`}>
      {/* Dynamic Ambient Background Glows */}
      <div className={`fixed -top-40 -left-40 w-96 h-96 ${activeTheme.ambientGlow1} rounded-full blur-[140px] pointer-events-none transition-all duration-700 z-0`} />
      <div className={`fixed top-1/3 -right-40 w-96 h-96 ${activeTheme.ambientGlow2} rounded-full blur-[140px] pointer-events-none transition-all duration-700 z-0`} />

      {/* Top Sticky Header */}
      <Header
        wallet={wallet}
        user={user}
        language={language}
        soundEnabled={soundEnabled}
        themeMode={themeMode}
        onToggleThemeMode={handleToggleThemeMode}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
        onOpenRecharge={() => setActivePage('deposit')}
        onOpenRules={() => setRulesModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSelectPage={(page) => setActivePage(page)}
        onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        onOpenThemeModal={() => setThemeModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-4 sm:space-y-5 relative z-10">
        {/* Navigation Bar for Desktop & Mobile */}
        <Navigation
          activePage={activePage}
          onSelectPage={(page) => {
            sound.playClick();
            setActivePage(page);
          }}
          language={language}
          isLoggedIn={user.isLoggedIn}
          themeMode={themeMode}
        />

        {/* PAGE 1: Core Color Prediction & Reduction Game */}
        {activePage === 'game' && (
          <div className="space-y-4 sm:space-y-5 animate-fadeIn">
            {/* VIP Live Winners Ticker */}
            <VIPTicker language={language} />

            {/* 3D Luxury Casino Hero Showcase Banner */}
            <Hero3DBanner
              language={language}
              onOpenDeposit={() => setActivePage('deposit')}
              onOpenRules={() => setRulesModalOpen(true)}
              onSelectGameTab={(tab) => setActiveGameTab(tab)}
            />

            {/* Top Game Switcher Tabs with Quick Theme Selector Badge */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-md backdrop-blur-md">
                <button
                  id="tab-select-wingo"
                  onClick={() => setActiveGameTab('wingo')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeGameTab === 'wingo'
                      ? activeTheme.activeTabClass
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

              {/* Quick Theme Badge Button on Game Page */}
              <button
                id="btn-quick-theme-toggle"
                onClick={() => setThemeModalOpen(true)}
                className="flex items-center justify-between sm:justify-center gap-2 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-300 transition-all shadow-md group"
                title="Change Theme / कलर थीम बदलें"
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {activeTheme.previewColors.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-slate-900"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">
                    {language === 'hi' ? activeTheme.nameHi.split(' ')[0] : activeTheme.name}
                  </span>
                </div>
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded-md">
                  {language === 'hi' ? 'थीम बदलें' : 'Theme'}
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

                {/* Real-time Live Players Bets Feed (Rich Dummy Data & Pool) */}
                <LiveBetsFeed language={language} />

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

                <HistoryAndTrends
                  history={currentModeHistory}
                  userBets={currentModeBets}
                  gameMode={gameMode}
                  language={language}
                />
              </div>
            )}
          </div>
        )}

        {/* PAGE 2: Deposit Page */}
        {activePage === 'deposit' && (
          <DepositPage
            wallet={wallet}
            language={language}
            deposits={deposits}
            onAddFunds={handleDepositSuccess}
            themeMode={themeMode}
            onNavigateTransactions={() => setActivePage('transactions')}
          />
        )}

        {/* PAGE 3: Withdraw Page */}
        {activePage === 'withdraw' && (
          <WithdrawPage
            wallet={wallet}
            withdrawals={withdrawals}
            bankDetails={user.bankDetails}
            onUpdateBankDetails={(details) => {
              setUser((prev) => ({ ...prev, bankDetails: details }));
            }}
            onRequestWithdrawal={handleWithdrawalRequest}
            language={language}
            themeMode={themeMode}
            onNavigateTransactions={() => setActivePage('transactions')}
          />
        )}

        {/* PAGE: Transactions Center */}
        {activePage === 'transactions' && (
          <TransactionsView
            wallet={wallet}
            deposits={deposits}
            withdrawals={withdrawals}
            userBets={userBets}
            language={language}
            theme={activeTheme}
            onNavigateDeposit={() => setActivePage('deposit')}
            onNavigateWithdraw={() => setActivePage('withdraw')}
          />
        )}

        {/* PAGE 4: Refer & Earn Page */}
        {activePage === 'refer' && (
          <ReferPage
            referralData={referralData}
            onClaimCommission={handleClaimCommission}
            language={language}
          />
        )}

        {/* PAGE 5: Verified Payment Proofs */}
        {activePage === 'proof' && (
          <ProofPage language={language} />
        )}

        {/* PAGE 6: 24/7 Connect / Support */}
        {activePage === 'support' && (
          <SupportPage language={language} />
        )}

        {/* PAGE 7: About Platform & Provably Fair */}
        {activePage === 'about' && (
          <AboutPage language={language} />
        )}

        {/* PAGE 8: Profile & VIP Dashboard */}
        {activePage === 'profile' && (
          <ProfilePage
            user={user}
            wallet={wallet}
            language={language}
            onSelectPage={(page) => setActivePage(page)}
            onLogout={handleLogout}
            onToggleSound={() => setSoundEnabled((v) => !v)}
            soundEnabled={soundEnabled}
            onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
            onOpenThemeModal={() => setThemeModalOpen(true)}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="max-w-4xl mx-auto px-4 text-center text-xs text-slate-500 mt-6 hidden sm:block">
        <p className="flex items-center justify-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-400">
            {language === 'hi' ? 'कलर प्रेडिक्शन गेम प्लेटफॉर्म' : 'VIP Color Prediction Game Platform'}
          </span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">100% Provably Fair SHA-256</span>
          <span>•</span>
          <span>{language === 'hi' ? '24/7 ऑटोमेटेड पेआउट और सपोर्ट' : '24/7 Instant Payouts & Support'}</span>
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
        onAddFunds={handleAddFundsDirect}
        onResetWallet={handleResetWallet}
      />

      {/* Rules Guide Modal */}
      <RulesModal
        isOpen={rulesModalOpen}
        onClose={() => setRulesModalOpen(false)}
        language={language}
      />

      {/* Login & Register Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        language={language}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Mobile Drawer (Smooth Slide-out Menu) */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        activePage={activePage}
        onSelectPage={(page) => {
          sound.playClick();
          setActivePage(page);
        }}
        user={user}
        wallet={wallet}
        language={language}
        soundEnabled={soundEnabled}
        themeMode={themeMode}
        onToggleThemeMode={handleToggleThemeMode}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
        onOpenRules={() => setRulesModalOpen(true)}
        onResetWallet={handleResetWallet}
        onOpenThemeModal={() => setThemeModalOpen(true)}
      />

      {/* Theme Customizer Modal */}
      <ThemeModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        language={language}
      />
    </div>
  );
}

