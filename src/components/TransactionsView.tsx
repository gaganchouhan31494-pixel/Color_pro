import React, { useState } from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Copy,
  Receipt,
  ShieldCheck,
  Trophy,
  Gamepad2,
  Coins,
  RefreshCw,
  Wallet,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
} from 'lucide-react';
import {
  Language,
  DepositRecord,
  WithdrawRecord,
  UserBet,
  UserWallet,
  ThemeConfig,
} from '../types';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';
import { ASSETS_3D } from '../utils/assets3d';

interface TransactionsViewProps {
  wallet: UserWallet;
  deposits: DepositRecord[];
  withdrawals: WithdrawRecord[];
  userBets: UserBet[];
  language: Language;
  theme: ThemeConfig;
  onNavigateDeposit: () => void;
  onNavigateWithdraw: () => void;
}

type FilterTab = 'all' | 'deposits' | 'withdrawals' | 'bets';

interface UnifiedTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'bet_win' | 'bet_loss';
  title: string;
  titleHi: string;
  amount: number;
  isCredit: boolean;
  status: 'completed' | 'processing' | 'failed' | 'pending';
  timestamp: number;
  utrOrHash: string;
  methodLabel: string;
  bonusOrFee?: string;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  wallet,
  deposits,
  withdrawals,
  userBets,
  language,
  theme,
  onNavigateDeposit,
  onNavigateWithdraw,
}) => {
  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<UnifiedTransaction | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Combine and normalize all transactions
  const unifiedList: UnifiedTransaction[] = [
    ...deposits.map((d) => ({
      id: d.id,
      type: 'deposit' as const,
      title: `${d.method.toUpperCase()} Deposit`,
      titleHi: `${d.method.toUpperCase()} जमा राशि`,
      amount: d.amount + (d.bonus || 0),
      isCredit: true,
      status: d.status as 'completed' | 'processing' | 'failed',
      timestamp: d.timestamp,
      utrOrHash: d.utr,
      methodLabel: d.method.toUpperCase(),
      bonusOrFee: d.bonus ? `+₹${d.bonus} Bonus` : undefined,
    })),
    ...withdrawals.map((w) => ({
      id: w.id,
      type: 'withdraw' as const,
      title: `${w.payoutMethod.toUpperCase()} Withdrawal`,
      titleHi: `${w.payoutMethod.toUpperCase()} बैंक निकासी`,
      amount: w.amount,
      isCredit: false,
      status: (w.status === 'completed' ? 'completed' : 'processing') as 'completed' | 'processing',
      timestamp: w.timestamp,
      utrOrHash: w.utr,
      methodLabel: `${w.payoutMethod.toUpperCase()} → ${w.targetAddress}`,
      bonusOrFee: w.fee ? `-₹${w.fee} Fee` : '0% Fee Promo',
    })),
    ...userBets
      .filter((b) => b.status === 'won' || b.status === 'lost')
      .map((b) => {
        const isWon = b.status === 'won';
        return {
          id: b.id,
          type: (isWon ? 'bet_win' : 'bet_loss') as 'bet_win' | 'bet_loss',
          title: isWon
            ? `${b.gameMode.toUpperCase()} Round Win (${b.multiplier}x)`
            : `${b.gameMode.toUpperCase()} Round Bet`,
          titleHi: isWon
            ? `${b.gameMode.toUpperCase()} राउंड जीत (${b.multiplier}x)`
            : `${b.gameMode.toUpperCase()} राउंड दांव`,
          amount: isWon ? (b.winAmount || b.amount * b.multiplier) : b.amount,
          isCredit: isWon,
          status: 'completed' as const,
          timestamp: b.createdAt,
          utrOrHash: `ROUND#${b.period.slice(-8)}`,
          methodLabel: `${b.gameMode.toUpperCase()} • ${b.targetType.toUpperCase()}`,
        };
      }),
  ].sort((a, b) => b.timestamp - a.timestamp);

  // Filter based on selected tab and search
  const filteredList = unifiedList.filter((txn) => {
    if (activeTab === 'deposits' && txn.type !== 'deposit') return false;
    if (activeTab === 'withdrawals' && txn.type !== 'withdraw') return false;
    if (activeTab === 'bets' && txn.type !== 'bet_win' && txn.type !== 'bet_loss') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        txn.id.toLowerCase().includes(q) ||
        txn.utrOrHash.toLowerCase().includes(q) ||
        txn.title.toLowerCase().includes(q) ||
        txn.titleHi.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    sound.playClick();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="transactions-center" className="space-y-4 sm:space-y-5 animate-fadeIn">
      {/* 3D Bank Vault Banner & Summary Card */}
      <div
        className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 border ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-300 shadow-xl'
            : 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border-white/15 shadow-2xl'
        }`}
      >
        {/* 3D Visual Asset in background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none overflow-hidden hidden sm:block">
          <img
            src={ASSETS_3D.goldCoinsVault}
            alt="3D Vault"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover mix-blend-screen"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-500 font-bold text-[11px] font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHi ? '100% वेरिफाइड लेजर • SHA-256' : '100% Verified Ledger • Real-time'}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isHi ? 'खाता लेन-देन इतिहास (Transactions)' : 'Wallet Transaction Center'}
            </h2>
            <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              {isHi
                ? 'आपके सभी डिपॉजिट, इंस्टेंट विड्रॉल, गेम दांव व जीत का पूरा पारदर्शी विवरण।'
                : 'Complete and transparent logs of all your deposits, instant payouts, and game winnings.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateDeposit}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all"
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>{isHi ? '+ जमा करें' : '+ Deposit'}</span>
            </button>
            <button
              onClick={onNavigateWithdraw}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-xs border shadow active:scale-95 transition-all ${
                isLight
                  ? 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white border-white/20'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4 text-purple-400" />
              <span>{isHi ? 'निकासी' : 'Withdraw'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-white/10">
          <div className={`p-3 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-zinc-900/80 border border-white/10'}`}>
            <div className="text-[10px] sm:text-xs font-bold uppercase text-zinc-500">
              {isHi ? 'कुल उपलब्ध बैलेंस' : 'Current Balance'}
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-amber-500 mt-0.5">
              {formatCurrency(wallet.balance)}
            </div>
          </div>

          <div className={`p-3 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-zinc-900/80 border border-white/10'}`}>
            <div className="text-[10px] sm:text-xs font-bold uppercase text-zinc-500">
              {isHi ? 'कुल प्राप्त जीत' : 'Total Winnings'}
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-emerald-500 mt-0.5">
              +{formatCurrency(wallet.totalWon)}
            </div>
          </div>

          <div className={`p-3 rounded-2xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-zinc-900/80 border border-white/10'}`}>
            <div className="text-[10px] sm:text-xs font-bold uppercase text-zinc-500">
              {isHi ? 'सफल विड्रॉल' : 'Withdrawn'}
            </div>
            <div className={`text-sm sm:text-base font-black font-mono ${isLight ? 'text-slate-800' : 'text-zinc-200'} mt-0.5`}>
              {formatCurrency(wallet.totalWithdrawn)}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* 4 Filter Pills with 3D tactile feel */}
        <div className={`flex items-center p-1 rounded-2xl border ${isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-zinc-950 border-white/15'}`}>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
              activeTab === 'all'
                ? isLight
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-white text-zinc-950 shadow'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isHi ? 'सभी (All)' : 'All'}
          </button>
          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
              activeTab === 'deposits'
                ? isLight
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-emerald-500 text-slate-950 shadow'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isHi ? 'जमा (Deposit)' : 'Deposits'}
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
              activeTab === 'withdrawals'
                ? isLight
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-purple-500 text-white shadow'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isHi ? 'निकासी (Withdraw)' : 'Withdrawals'}
          </button>
          <button
            onClick={() => setActiveTab('bets')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
              activeTab === 'bets'
                ? isLight
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-amber-400 text-slate-950 shadow'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isHi ? 'गेम दांव (Bets)' : 'Game Bets'}
          </button>
        </div>

        {/* Search input */}
        <div className={`relative flex items-center min-w-[220px] rounded-2xl border px-3 py-1.5 ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950 border-white/15'
        }`}>
          <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHi ? 'UTR / ID खोजें...' : 'Search UTR / ID...'}
            className={`w-full bg-transparent text-xs font-mono focus:outline-none ${
              isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-zinc-500'
            }`}
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filteredList.length === 0 ? (
          <div className={`p-8 rounded-3xl text-center border ${isLight ? 'bg-white border-slate-200' : 'bg-zinc-950 border-white/10'}`}>
            <Receipt className="w-10 h-10 mx-auto text-zinc-500 mb-2 opacity-60" />
            <p className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
              {isHi ? 'कोई लेन-देन नहीं मिला' : 'No transactions found'}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {isHi ? 'चयनित फ़िल्टर के अनुसार कोई रिकॉर्ड उपलब्ध नहीं है।' : 'No records match the current filter.'}
            </p>
          </div>
        ) : (
          filteredList.map((txn) => {
            let Icon = ArrowDownCircle;
            let iconColor = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
            if (txn.type === 'withdraw') {
              Icon = ArrowUpCircle;
              iconColor = 'text-purple-400 bg-purple-500/15 border-purple-500/30';
            } else if (txn.type === 'bet_win') {
              Icon = Trophy;
              iconColor = 'text-amber-400 bg-amber-500/15 border-amber-500/30';
            } else if (txn.type === 'bet_loss') {
              Icon = Gamepad2;
              iconColor = 'text-zinc-400 bg-zinc-800 border-zinc-700';
            }

            return (
              <div
                key={txn.id}
                onClick={() => setSelectedTxn(txn)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] flex items-center justify-between gap-3 ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                    : 'bg-zinc-950/90 hover:bg-zinc-900 border-white/10'
                }`}
              >
                {/* Left: Icon and Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center flex-shrink-0 ${iconColor} shadow-md`}>
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs sm:text-sm font-black truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {isHi ? txn.titleHi : txn.title}
                      </span>
                      {txn.bonusOrFee && (
                        <span className="text-[9px] font-mono font-bold bg-amber-400/20 text-amber-500 border border-amber-400/30 px-1.5 py-0.2 rounded-md">
                          {txn.bonusOrFee}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5">
                      <span>{new Date(txn.timestamp).toLocaleString('en-IN', { hour12: true, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="truncate">Ref: {txn.utrOrHash}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount and Status */}
                <div className="text-right flex-shrink-0">
                  <div className={`font-mono text-sm sm:text-base font-black ${
                    txn.isCredit ? 'text-emerald-500' : isLight ? 'text-slate-900' : 'text-zinc-200'
                  }`}>
                    {txn.isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                  </div>

                  <div className="mt-1 flex items-center justify-end gap-1">
                    {txn.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isHi ? 'सफल' : 'Settled'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>{isHi ? 'प्रक्रिया में' : 'Processing'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div
          id="txn-modal-overlay"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedTxn(null)}
        >
          <div
            id="txn-modal-box"
            className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl space-y-4 animate-slideUp ${
              isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-white/20 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-500" />
                <span className="font-black text-sm">{isHi ? 'लेन-देन विवरण रसीद' : 'Transaction Receipt'}</span>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-zinc-800"
              >
                ✕
              </button>
            </div>

            {/* Amount Big Display */}
            <div className="text-center py-2 space-y-1">
              <div className="text-xs text-zinc-500 font-bold uppercase">{isHi ? 'कुल लेन-देन राशि' : 'Transaction Amount'}</div>
              <div className={`text-2xl sm:text-3xl font-mono font-black ${
                selectedTxn.isCredit ? 'text-emerald-500' : isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {selectedTxn.isCredit ? '+' : '-'}{formatCurrency(selectedTxn.amount)}
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Verified Blockchain Hash</span>
              </span>
            </div>

            {/* Receipt Table Details */}
            <div className={`rounded-2xl p-3.5 space-y-2 text-xs font-mono border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-white/10'
            }`}>
              <div className="flex justify-between">
                <span className="text-zinc-500">Txn ID:</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{selectedTxn.id}</span>
                  <button
                    onClick={() => handleCopy(selectedTxn.id, 'id')}
                    className="text-zinc-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {copiedId === 'id' && <span className="text-[9px] text-emerald-400">Copied!</span>}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">UTR / Ref:</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-amber-500">{selectedTxn.utrOrHash}</span>
                  <button
                    onClick={() => handleCopy(selectedTxn.utrOrHash, 'utr')}
                    className="text-zinc-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {copiedId === 'utr' && <span className="text-[9px] text-emerald-400">Copied!</span>}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">{isHi ? 'प्रकार:' : 'Type:'}</span>
                <span className="font-bold">{selectedTxn.methodLabel}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">{isHi ? 'दिनांक व समय:' : 'Date & Time:'}</span>
                <span>{new Date(selectedTxn.timestamp).toLocaleString()}</span>
              </div>

              <div className="flex justify-between border-t border-white/10 pt-2 font-bold">
                <span className="text-zinc-500">{isHi ? 'स्थिति:' : 'Status:'}</span>
                <span className="text-emerald-500 uppercase">{selectedTxn.status}</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setSelectedTxn(null);
              }}
              className="w-full py-2.5 rounded-2xl bg-zinc-900 border border-white/15 text-white font-bold text-xs hover:bg-zinc-800 transition-all active:scale-95"
            >
              {isHi ? 'बंद करें (Close)' : 'Close Receipt'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
