import React, { useState, useEffect, useRef } from 'react';
import {
  AppPage,
  BankAccount,
  BetColor,
  BetTargetType,
  ColorThemeId,
  DepositRecord,
  GameMode,
  GameResult,
  Language,
  ThemeConfig,
  ThemeMode,
  UserAccount,
  UserBet,
  UserWallet,
  WithdrawRecord,
} from './types';
import { COLOR_THEMES } from './utils/themeConfig';
import { INITIAL_DEPOSITS, INITIAL_RESULTS, INITIAL_WITHDRAWALS } from './utils/dummyData';
import { calculateOutcome, evaluateBet, generatePeriodId, formatCurrency } from './utils/gameLogic';
import { sound } from './utils/sound';

// Components
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { VIPTicker } from './components/VIPTicker';
import { PeriodCountdownCard } from './components/PeriodCountdownCard';
import { BettingBoard } from './components/BettingBoard';
import { BetModal } from './components/BetModal';
import { HistoryAndTrends } from './components/HistoryAndTrends';
import { TransactionsView } from './components/TransactionsView';
import { RechargeModal } from './components/RechargeModal';
import { WithdrawPage } from './components/WithdrawPage';
import { RulesModal } from './components/RulesModal';
import { ResultModal } from './components/ResultModal';
import { ThemeModal } from './components/ThemeModal';
import { MobileDrawer } from './components/MobileDrawer';
import { ReferPage } from './components/ReferPage';
import { ProofPage } from './components/ProofPage';
import { SupportPage } from './components/SupportPage';
import { ProfilePage } from './components/ProfilePage';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  // Global Settings & Preferences
  const [themeId, setThemeId] = useState<ColorThemeId>('monochrome');
  const [language, setLanguage] = useState<Language>('hi'); // Default Hindi as preferred by user
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<AppPage>('game');

  // User State & Wallet
  const [wallet, setWallet] = useState<UserWallet>({
    balance: 10000, // ₹10,000 instant demo testing balance
    totalWon: 4500,
    totalWithdrawn: 2500,
    totalRecharged: 1500,
  });

  const [user, setUser] = useState<UserAccount>({
    id: 'USR-889102',
    username: 'VIP_Player99',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    vipLevel: 1,
    isLoggedIn: true,
  });

  const [bankAccount, setBankAccount] = useState<BankAccount>({
    accountName: 'VIP Player',
    accountNumber: '50100491823901',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank Ltd.',
    upiId: 'vipplayer99@oksbi',
  });

  // Game Engine State
  const [gameMode, setGameMode] = useState<GameMode>('parity');
  const [periodId, setPeriodId] = useState<string>(() => generatePeriodId('parity'));
  const [countdown, setCountdown] = useState<number>(30); // 30s parity cycle
  const [duration, setDuration] = useState<number>(30);
  const [results, setResults] = useState<GameResult[]>(INITIAL_RESULTS);
  const [userBets, setUserBets] = useState<UserBet[]>([]);

  // Financial records
  const [deposits, setDeposits] = useState<DepositRecord[]>(INITIAL_DEPOSITS);
  const [withdrawals, setWithdrawals] = useState<WithdrawRecord[]>(INITIAL_WITHDRAWALS);

  // Modals & Drawers
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [activeBetSelection, setActiveBetSelection] = useState<{
    type: BetTargetType;
    value: string;
    multiplier: number;
  } | null>(null);

  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [latestResultModal, setLatestResultModal] = useState<GameResult | null>(null);

  const currentTheme = COLOR_THEMES[themeId] || COLOR_THEMES.monochrome;

  // Sound sync
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Handle direct 1-click Light / Dark Mode toggle
  const handleToggleThemeMode = () => {
    sound.playClick();
    if (currentTheme.mode === 'dark') {
      setThemeId('platinumLight');
    } else {
      setThemeId('monochrome');
    }
  };

  // Change Game Mode (Parity 30s, Sapre 1m, Bcone 3m, Emerd 5m)
  const handleSelectGameMode = (mode: GameMode) => {
    setGameMode(mode);
    const newDur = mode === 'parity' ? 30 : mode === 'sapre' ? 60 : mode === 'bcone' ? 180 : 300;
    setDuration(newDur);
    setCountdown(newDur);
    setPeriodId(generatePeriodId(mode));
  };

  // Sound tick for countdown
  const countdownRef = useRef(countdown);
  countdownRef.current = countdown;

  // Countdown timer clock loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Time expired! Reveal new outcome
          const newNumber = Math.floor(Math.random() * 10);
          const outcome = calculateOutcome(newNumber);
          const newResult: GameResult = {
            period: periodId,
            number: newNumber,
            color: outcome.color,
            colors: outcome.colors,
            size: outcome.size,
            hash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
            timestamp: Date.now(),
          };

          // Evaluate user's pending bets for this period
          let roundWin = 0;
          let hasBetsInRound = false;

          setUserBets((prevBets) => {
            return prevBets.map((b) => {
              if (b.period === periodId && b.status === 'pending') {
                hasBetsInRound = true;
                const { won, winAmount } = evaluateBet(b, newResult);
                if (won) roundWin += winAmount;
                return {
                  ...b,
                  status: won ? 'won' : 'lost',
                  winAmount,
                };
              }
              return b;
            });
          });

          // Update wallet if user won
          if (roundWin > 0) {
            setWallet((w) => ({
              ...w,
              balance: w.balance + roundWin,
              totalWon: w.totalWon + roundWin,
            }));
            sound.playWin();
          } else if (hasBetsInRound) {
            sound.playLoss();
          }

          // Show result modal if user participated in this round
          if (hasBetsInRound) {
            setLatestResultModal(newResult);
          }

          // Add to results history
          setResults((prev) => [newResult, ...prev.slice(0, 49)]);

          // Start next period
          setPeriodId(generatePeriodId(gameMode, Date.now() + 1000));
          return duration;
        }

        if (prev <= 6 && prev > 1) {
          sound.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [periodId, gameMode, duration]);

  // Open Bet Placement Modal
  const handleOpenBet = (type: BetTargetType, value: string, multiplier: number) => {
    setActiveBetSelection({ type, value, multiplier });
    setIsBetModalOpen(true);
  };

  // Confirm Place Bet (Called by BetModal)
  const handleConfirmBet = (amount: number, multiplier: number, total: number) => {
    if (!activeBetSelection) return;

    if (total > wallet.balance) {
      setIsRechargeOpen(true);
      return;
    }

    // Deduct from balance
    setWallet((w) => ({
      ...w,
      balance: w.balance - total,
    }));

    const newBet: UserBet = {
      id: `BET-${Date.now().toString().slice(-6)}`,
      period: periodId,
      gameMode,
      targetType: activeBetSelection.type,
      targetValue: activeBetSelection.value,
      amount,
      multiplier,
      totalAmount: total,
      status: 'pending',
      createdAt: Date.now(),
    };

    setUserBets((prev) => [newBet, ...prev]);
  };

  // Handle Deposit Success
  const handleDepositSuccess = (
    amount: number,
    bonus: number,
    method: string,
    utr: string
  ) => {
    const totalCredit = amount + bonus;
    setWallet((w) => ({
      ...w,
      balance: w.balance + totalCredit,
      totalRecharged: w.totalRecharged + amount,
    }));

    const newRecord: DepositRecord = {
      id: `DEP-${Math.floor(1000 + Math.random() * 9000)}`,
      amount,
      bonus,
      method,
      utr,
      status: 'completed',
      timestamp: Date.now(),
    };

    setDeposits((prev) => [newRecord, ...prev]);
  };

  // Handle Withdrawal Success
  const handleWithdrawSuccess = (record: WithdrawRecord) => {
    setWallet((w) => ({
      ...w,
      balance: w.balance - record.amount,
      totalWithdrawn: w.totalWithdrawn + record.amount,
    }));

    setWithdrawals((prev) => [record, ...prev]);
  };

  // Reset demo wallet
  const handleResetWallet = () => {
    setWallet({
      balance: 10000,
      totalWon: 4500,
      totalWithdrawn: 2500,
      totalRecharged: 1500,
    });
  };

  const isLight = currentTheme.mode === 'light';

  return (
    <div
      id="app-root-container"
      className={`min-h-screen transition-colors duration-200 ${currentTheme.bgClass} ${
        isLight ? 'text-slate-900' : 'text-slate-100'
      }`}
    >
      {/* 1. Universal Sticky Header */}
      <Header
        wallet={wallet}
        user={user}
        language={language}
        soundEnabled={soundEnabled}
        themeMode={currentTheme.mode}
        onToggleThemeMode={handleToggleThemeMode}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onToggleLanguage={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        onOpenRecharge={() => setIsRechargeOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSelectPage={(p) => setActivePage(p)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-4 pb-24 md:pb-12">
        {/* 2. Top Navigation Tabs Bar */}
        <Navigation
          activePage={activePage}
          onSelectPage={(p) => setActivePage(p)}
          language={language}
          isLoggedIn={user.isLoggedIn}
          themeMode={currentTheme.mode}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />

        {/* 3. Live Ticker Banner */}
        <VIPTicker theme={currentTheme} />

        {/* 4. Page View Router */}
        {activePage === 'game' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Countdown & Period ID Card */}
            <PeriodCountdownCard
              currentMode={gameMode}
              onSelectMode={handleSelectGameMode}
              periodId={periodId}
              countdown={countdown}
              duration={duration}
              language={language}
              theme={currentTheme}
            />

            {/* The Tactile 3D Betting Board */}
            <BettingBoard
              onSelectBet={handleOpenBet}
              disabled={countdown <= 5}
              language={language}
              theme={currentTheme}
              userBalance={wallet.balance}
            />

            {/* Game History, Records & Trends */}
            <HistoryAndTrends
              results={results}
              userBets={userBets}
              language={language}
              theme={currentTheme}
            />
          </div>
        )}

        {activePage === 'deposit' && (
          <div className="p-4 sm:p-6 rounded-3xl bg-zinc-950/80 border border-white/10 text-center space-y-4">
            <h2 className="text-xl font-black text-white">Instant Wallet Recharge</h2>
            <p className="text-xs text-zinc-400">
              Get an instant +10% cash bonus credited directly to your gaming balance.
            </p>
            <button
              onClick={() => setIsRechargeOpen(true)}
              className="px-6 py-3 rounded-2xl bg-amber-400 text-zinc-950 font-black text-sm shadow active:scale-95 transition-transform"
            >
              Open Recharge Gateway (+10% Bonus)
            </button>
          </div>
        )}

        {activePage === 'withdraw' && (
          <WithdrawPage
            wallet={wallet}
            bankAccount={bankAccount}
            onUpdateBankAccount={(acc) => setBankAccount(acc)}
            onWithdraw={handleWithdrawSuccess}
            language={language}
            theme={currentTheme}
          />
        )}

        {activePage === 'transactions' && (
          <TransactionsView
            deposits={deposits}
            withdrawals={withdrawals}
            bets={userBets}
            language={language}
            theme={currentTheme}
            onOpenDeposit={() => setIsRechargeOpen(true)}
            onOpenWithdraw={() => setActivePage('withdraw')}
          />
        )}

        {activePage === 'refer' && (
          <ReferPage language={language} theme={currentTheme} />
        )}

        {activePage === 'proof' && (
          <ProofPage language={language} theme={currentTheme} />
        )}

        {activePage === 'support' && (
          <SupportPage language={language} theme={currentTheme} />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            user={user}
            wallet={wallet}
            bankAccount={bankAccount}
            language={language}
            theme={currentTheme}
            onResetWallet={handleResetWallet}
            onOpenDeposit={() => setIsRechargeOpen(true)}
            onOpenWithdraw={() => setActivePage('withdraw')}
          />
        )}
      </main>

      {/* 5. Modals & Overlays */}
      {/* Bet Modal (THE CORE "बैट लगाने वाला बटन" REQUIREMENT) */}
      {activeBetSelection && (
        <BetModal
          isOpen={isBetModalOpen}
          onClose={() => setIsBetModalOpen(false)}
          targetType={activeBetSelection.type}
          targetValue={activeBetSelection.value}
          multiplier={activeBetSelection.multiplier}
          userBalance={wallet.balance}
          onConfirmBet={handleConfirmBet}
          onOpenRecharge={() => {
            setIsBetModalOpen(false);
            setIsRechargeOpen(true);
          }}
          language={language}
          theme={currentTheme}
        />
      )}

      {/* Recharge Modal */}
      <RechargeModal
        isOpen={isRechargeOpen}
        onClose={() => setIsRechargeOpen(false)}
        onDeposit={handleDepositSuccess}
        language={language}
        theme={currentTheme}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        language={language}
        theme={currentTheme}
      />

      {/* Color Themes Customizer Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={themeId}
        onSelectTheme={(tId) => setThemeId(tId)}
        language={language}
      />

      {/* Mobile Drawer (Menu) */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activePage={activePage}
        onSelectPage={(p) => setActivePage(p)}
        user={user}
        wallet={wallet}
        language={language}
        soundEnabled={soundEnabled}
        themeMode={currentTheme.mode}
        onToggleThemeMode={handleToggleThemeMode}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onToggleLanguage={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onResetWallet={handleResetWallet}
      />

      {/* Round Result Modal */}
      <ResultModal
        isOpen={Boolean(latestResultModal)}
        onClose={() => setLatestResultModal(null)}
        result={latestResultModal}
        userBets={userBets}
        language={language}
        theme={currentTheme}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(u) => setUser(u)}
        language={language}
        theme={currentTheme}
      />
    </div>
  );
};

export default App;
