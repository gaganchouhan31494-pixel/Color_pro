import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Gamepad2,
  CheckCircle2,
  Clock,
  Copy,
  Sparkles,
  Download,
} from 'lucide-react';
import { DepositRecord, Language, ThemeConfig, UserBet, WithdrawRecord } from '../types';
import { ASSETS_3D } from '../utils/assets3d';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface TransactionsViewProps {
  deposits: DepositRecord[];
  withdrawals: WithdrawRecord[];
  bets: UserBet[];
  language: Language;
  theme: ThemeConfig;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  deposits,
  withdrawals,
  bets,
  language,
  theme,
  onOpenDeposit,
  onOpenWithdraw,
}) => {
  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'withdrawals' | 'bets'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(text);
    sound.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Compile universal transaction list
  type UnifiedTx = {
    id: string;
    type: 'deposit' | 'withdraw' | 'bet';
    title: string;
    subtitle: string;
    amount: number;
    fee?: number;
    status: 'completed' | 'processing' | 'won' | 'lost' | 'pending';
    timestamp: number;
    reference: string;
  };

  const allTx: UnifiedTx[] = [
    ...deposits.map((d) => ({
      id: d.id,
      type: 'deposit' as const,
      title: isHi ? 'इंस्टेंट रिचार्ज' : 'Instant Deposit',
      subtitle: `${d.method} • UTR: ${d.utr}`,
      amount: d.amount,
      status: d.status,
      timestamp: d.timestamp,
      reference: d.utr,
    })),
    ...withdrawals.map((w) => ({
      id: w.id,
      type: 'withdraw' as const,
      title: isHi ? 'बैंक निकासी' : 'Bank Withdrawal',
      subtitle: `${w.targetAddress} • UTR: ${w.utr}`,
      amount: -w.amount,
      fee: w.fee,
      status: w.status,
      timestamp: w.timestamp,
      reference: w.utr,
    })),
    ...bets.map((b) => ({
      id: b.id,
      type: 'bet' as const,
      title: `${isHi ? 'कलर ट्रेड दांव' : 'Color Trade Bet'} (${b.targetType.toUpperCase()}: ${b.targetValue})`,
      subtitle: `Round: ${b.period} • ${b.multiplier}X Multiplier`,
      amount: b.status === 'won' ? (b.winAmount || b.totalAmount * 2) - b.totalAmount : -b.totalAmount,
      status: b.status,
      timestamp: b.createdAt,
      reference: b.period,
    })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  const filteredTx = allTx.filter((tx) => {
    if (activeTab === 'deposits' && tx.type !== 'deposit') return false;
    if (activeTab === 'withdrawals' && tx.type !== 'withdraw') return false;
    if (activeTab === 'bets' && tx.type !== 'bet') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.id.toLowerCase().includes(q) ||
        tx.reference.toLowerCase().includes(q) ||
        tx.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate totals
  const totalRecharge = deposits.reduce((acc, d) => acc + d.amount, 0);
  const totalWithdrawn = withdrawals.reduce((acc, w) => acc + w.amount, 0);
  const totalBetVolume = bets.reduce((acc, b) => acc + b.totalAmount, 0);

  return (
    <div id="transactions-view-page" className="space-y-4 animate-fadeIn">
      {/* 1. 3D HERO BANNER FOR TRANSACTIONS (As requested by user: "इसमें 3D इमेज की इमेज यूज करो जिससे ये अच्छा लगे") */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 ${
          isLight
            ? 'bg-gradient-to-r from-amber-500/10 via-white to-emerald-500/10 border-slate-300'
            : 'bg-zinc-950/90 border-white/15'
        }`}
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-500 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHi ? '3D सुरक्षित डिजिटल लेजर' : '3D Secure Digital Ledger'}</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {isHi ? 'ऑल ट्रांजैक्शंस व वित्तीय विवरण' : 'Financial Statement & Transactions'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-medium">
            {isHi
              ? 'आपके सभी रिचार्ज, पेआउट और बेटिंग का पारदर्शी 100% वेरिफाइड रिकॉर्ड।'
              : 'Real-time verified history of deposits, instant bank withdrawals, and winning payouts.'}
          </p>
        </div>

        {/* 3D Gold Coins Vault Graphic Renders */}
        <div className="relative shrink-0 flex items-center gap-3">
          <img
            src={ASSETS_3D.goldCoinsVault}
            alt="3D Gold Coins Vault"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-400/50 shadow-2xl shadow-amber-500/20 hover:scale-105 transition-transform"
          />
          <img
            src={ASSETS_3D.bankVault3D}
            alt="3D Bank Vault"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-400/50 shadow-2xl shadow-emerald-500/20 hidden xs:block hover:scale-105 transition-transform -ml-6 mt-4"
          />
        </div>
      </div>

      {/* 2. STATS SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Total Recharge */}
        <div
          className={`p-3 sm:p-4 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950/80 border-white/10'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-500 uppercase">
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>{isHi ? 'कुल रिचार्ज' : 'Total Recharged'}</span>
          </div>
          <div className="text-sm sm:text-lg font-black font-mono mt-1 text-emerald-400">
            {formatCurrency(totalRecharge)}
          </div>
        </div>

        {/* Total Withdrawn */}
        <div
          className={`p-3 sm:p-4 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950/80 border-white/10'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-amber-500 uppercase">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{isHi ? 'कुल निकासी' : 'Total Withdrawn'}</span>
          </div>
          <div className="text-sm sm:text-lg font-black font-mono mt-1 text-amber-400">
            {formatCurrency(totalWithdrawn)}
          </div>
        </div>

        {/* Bet Turnover */}
        <div
          className={`p-3 sm:p-4 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950/80 border-white/10'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-indigo-400 uppercase">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{isHi ? 'टोटल टर्नओवर' : 'Bet Turnover'}</span>
          </div>
          <div className="text-sm sm:text-lg font-black font-mono mt-1 text-indigo-400">
            {formatCurrency(totalBetVolume)}
          </div>
        </div>
      </div>

      {/* 3. FILTER TABS & SEARCH BAR */}
      <div
        className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
          isLight ? 'bg-white border-slate-200' : 'bg-zinc-950/90 border-white/10'
        }`}
      >
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap active:scale-95 ${
              activeTab === 'all'
                ? isLight
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isHi ? 'सभी' : 'All'} ({allTx.length})
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('deposits');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap active:scale-95 ${
              activeTab === 'deposits'
                ? isLight
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isHi ? 'जमा (Deposits)' : 'Deposits'}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('withdrawals');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap active:scale-95 ${
              activeTab === 'withdrawals'
                ? isLight
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isHi ? 'निकासी (Withdrawals)' : 'Withdrawals'}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('bets');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap active:scale-95 ${
              activeTab === 'bets'
                ? isLight
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isHi ? 'गेम दांव (Bets)' : 'Game Bets'}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHi ? 'UTR या राउंड आईडी से खोजें...' : 'Search UTR / ID...'}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* 4. TRANSACTION ITEMS LIST */}
      <div className="space-y-2">
        {filteredTx.length === 0 ? (
          <div
            className={`p-10 rounded-3xl border text-center space-y-2 ${
              isLight ? 'bg-white border-slate-200' : 'bg-zinc-950/80 border-white/10'
            }`}
          >
            <Receipt className="w-10 h-10 text-zinc-600 mx-auto" />
            <div className="font-bold text-zinc-400 text-sm">
              {isHi ? 'कोई लेन-देन नहीं मिला' : 'No transactions found'}
            </div>
          </div>
        ) : (
          filteredTx.map((tx) => {
            const isDeposit = tx.type === 'deposit';
            const isWithdraw = tx.type === 'withdraw';
            const isBet = tx.type === 'bet';

            return (
              <div
                key={tx.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all hover:scale-[1.005] ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                    : 'bg-zinc-950/80 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Icon & Description */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                        isDeposit
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isWithdraw
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}
                    >
                      {isDeposit ? (
                        <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                      ) : isWithdraw ? (
                        <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <Gamepad2 className="w-5 h-5 stroke-[2.5]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-black text-xs sm:text-sm text-white truncate flex items-center gap-2">
                        <span>{tx.title}</span>
                        <span
                          className={`text-[9px] px-2 py-0.2 rounded-full font-mono font-black uppercase ${
                            tx.status === 'completed' || tx.status === 'won'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : tx.status === 'lost'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate flex items-center gap-1.5">
                        <span>{tx.subtitle}</span>
                        <button
                          onClick={() => handleCopy(tx.reference)}
                          className="hover:text-white transition-colors"
                          title="Copy reference"
                        >
                          <Copy className="w-3 h-3 text-zinc-500" />
                        </button>
                        {copiedId === tx.reference && (
                          <span className="text-[9px] text-emerald-400 font-bold">COPIED!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Timestamp */}
                  <div className="text-right shrink-0">
                    <div
                      className={`text-sm sm:text-base font-black font-mono ${
                        tx.amount > 0
                          ? 'text-emerald-400'
                          : tx.amount < 0
                          ? 'text-rose-400'
                          : 'text-zinc-300'
                      }`}
                    >
                      {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      {new Date(tx.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
