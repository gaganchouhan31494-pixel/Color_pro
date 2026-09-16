import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  FileText,
  Building2,
  CheckCircle2,
  X,
  CreditCard,
  Percent,
  Smartphone,
  Zap,
  Search,
  Copy,
  Check,
  Printer,
  Sparkles,
  ChevronRight,
  Radio,
  Signal,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { TransactionRecord, Member, PlanSettings } from '../types';
import { formatCurrency } from '../utils/mlmEngine';
import { OfficialStampBadge } from './OfficialStampBadge';

interface WalletStatementsViewProps {
  member: Member;
  transactions: TransactionRecord[];
  onWithdraw: (amount: number, method: string, accountDetail: string) => void;
  onRecharge?: (amount: number, mobileNumber: string, operator: string, planName: string) => void;
  settings: PlanSettings;
  lang: 'en' | 'hi';
}

interface RechargePlan {
  amount: number;
  validity: string;
  data: string;
  tag?: string;
  descriptionHi: string;
  descriptionEn: string;
}

const POPULAR_RECHARGE_PLANS: RechargePlan[] = [
  {
    amount: 199,
    validity: '24 Days',
    data: '1.5 GB/Day',
    descriptionHi: '24 दिन • 1.5GB/दिन डेटा + अनलिमिटेड वॉइस कॉलिंग',
    descriptionEn: '24 Days • 1.5GB/Day Data + Unlimited Calls',
  },
  {
    amount: 299,
    validity: '28 Days',
    data: '1.5 GB/Day + 5G',
    tag: 'MOST POPULAR',
    descriptionHi: '28 दिन • अनलिमिटेड 5G डेटा + 100 SMS/दिन',
    descriptionEn: '28 Days • Unlimited True 5G + 100 SMS/Day',
  },
  {
    amount: 719,
    validity: '84 Days',
    data: '1.5 GB/Day (3 Mo)',
    tag: 'BEST VALUE',
    descriptionHi: '84 दिन (3 माह) • 1.5GB/दिन + अनलिमिटेड कॉलिंग',
    descriptionEn: '84 Days (3 Months) • 1.5GB/Day + Hotstar Benefit',
  },
  {
    amount: 2999,
    validity: '365 Days',
    data: '2.5 GB/Day (Annual)',
    tag: 'ANNUAL VIP',
    descriptionHi: '365 दिन (वार्षिक) • 2.5GB/दिन + OTT सब्सक्रिप्शन',
    descriptionEn: '365 Days (Annual) • 2.5GB/Day High Speed 5G',
  },
];

const OPERATORS = [
  {
    id: 'Jio',
    name: 'Reliance Jio 5G',
    color: 'from-blue-600 to-indigo-700',
    border: 'border-blue-500/40',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    accentHex: '#3b82f6',
  },
  {
    id: 'Airtel',
    name: 'Airtel 5G Plus',
    color: 'from-red-600 to-rose-700',
    border: 'border-red-500/40',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    accentHex: '#ef4444',
  },
  {
    id: 'Vi',
    name: 'Vi (Vodafone Idea)',
    color: 'from-amber-600 to-orange-700',
    border: 'border-amber-500/40',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    accentHex: '#f59e0b',
  },
  {
    id: 'BSNL',
    name: 'BSNL 4G Connect',
    color: 'from-emerald-600 to-teal-700',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    accentHex: '#10b981',
  },
];

export const WalletStatementsView: React.FC<WalletStatementsViewProps> = ({
  member,
  transactions,
  onWithdraw,
  onRecharge,
  settings,
  lang,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedTxnId, setCopiedTxnId] = useState<string | null>(null);

  // Modals state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [payoutMethod, setPayoutMethod] = useState<'BANK' | 'UPI'>('UPI');
  const [accountDetail, setAccountDetail] = useState('');
  const [selectedInvoiceTxn, setSelectedInvoiceTxn] = useState<TransactionRecord | null>(null);

  // Mobile Recharge state
  const [selectedOperator, setSelectedOperator] = useState('Jio');
  const [mobileNumber, setMobileNumber] = useState(member.phone.replace(/[^0-9]/g, '').slice(-10) || '9876543210');
  const [rechargeAmount, setRechargeAmount] = useState<number>(299);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<string>('28 Days • 1.5 GB/Day Unlimited');
  const [isRecharging, setIsRecharging] = useState(false);
  const [lastRechargeReceipt, setLastRechargeReceipt] = useState<{
    txnId: string;
    mobile: string;
    operator: string;
    amount: number;
    cashback: number;
    plan: string;
    date: string;
  } | null>(null);

  // Compute totals
  const totalCredited = transactions
    .filter((t) => t.isCredit && t.status === 'COMPLETED')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDebited = transactions
    .filter((t) => !t.isCredit && t.status === 'COMPLETED')
    .reduce((acc, t) => acc + t.amount, 0);

  const availableBalance = Math.max(0, totalCredited - totalDebited);

  // Filtered transactions
  const filteredTxns = transactions.filter((t) => {
    // Type Filter
    if (filterType === 'CREDIT' && !t.isCredit) return false;
    if (filterType === 'DEBIT' && t.isCredit) return false;
    if (filterType === 'PAIR_MATCHING' && t.type !== 'PAIR_MATCHING') return false;
    if (filterType === 'DIRECT' && t.type !== 'DIRECT') return false;
    if (filterType === 'WITHDRAWAL' && t.type !== 'WITHDRAWAL') return false;
    if (filterType === 'MOBILE_RECHARGE' && t.type !== 'MOBILE_RECHARGE') return false;
    if (filterType === 'ROI' && t.type !== 'DAILY_ROI' && t.type !== 'LEVEL_ROI' && t.type !== 'ROYALTY') return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q) || t.titleHi.toLowerCase().includes(q);
      const matchNotes = t.notes.toLowerCase().includes(q);
      const matchAmount = t.amount.toString().includes(q);
      if (!matchId && !matchTitle && !matchNotes && !matchAmount) return false;
    }

    return true;
  });

  const handleCopyTxnId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedTxnId(id);
    setTimeout(() => setCopiedTxnId(null), 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount < settings.minWithdrawal || withdrawAmount > availableBalance) return;
    onWithdraw(
      withdrawAmount,
      payoutMethod,
      accountDetail || (payoutMethod === 'UPI' ? `${member.phone.replace(/[^0-9]/g, '')}@upi` : 'HDFC0001234')
    );
    setIsWithdrawModalOpen(false);
    setAccountDetail('');
  };

  const handleExecuteRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : rechargeAmount;
    if (!mobileNumber || mobileNumber.length < 10) return;
    if (finalAmount <= 0 || finalAmount > availableBalance) return;

    setIsRecharging(true);
    setTimeout(() => {
      setIsRecharging(false);
      const cashback = Math.max(1, Math.round(finalAmount * 0.02));
      const txnId = `RCH-${Math.floor(100000 + Math.random() * 900000)}`;
      const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      if (onRecharge) {
        onRecharge(finalAmount, mobileNumber, selectedOperator, selectedPlanDetails);
      }

      setLastRechargeReceipt({
        txnId,
        mobile: mobileNumber,
        operator: selectedOperator,
        amount: finalAmount,
        cashback,
        plan: selectedPlanDetails,
        date: dateStr,
      });
      setCustomAmount('');
    }, 600);
  };

  // Helper for category icon
  const getTxnIcon = (type: string, isCredit: boolean) => {
    if (type === 'MOBILE_RECHARGE') {
      return <Smartphone className={`w-4 h-4 ${isCredit ? 'text-emerald-400' : 'text-indigo-400'}`} />;
    }
    if (type === 'WITHDRAWAL') {
      return <Building2 className="w-4 h-4 text-rose-400" />;
    }
    if (type === 'PAIR_MATCHING') {
      return <Zap className="w-4 h-4 text-emerald-400" />;
    }
    if (type === 'DIRECT') {
      return <ArrowDownLeft className="w-4 h-4 text-cyan-400" />;
    }
    return isCredit ? (
      <Sparkles className="w-4 h-4 text-amber-400" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-rose-400" />
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 sm:pb-8">
      {/* Top Header: Title & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <span>{lang === 'hi' ? 'पेआउट वॉलेट एवं ट्रांजैक्शन खाता' : 'Payout Wallet & Transactions'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'hi'
              ? 'मोबाइल रिचार्ज, तत्काल बैंक निकासी और 100% पारदर्शी खाता बही'
              : 'Instant mobile recharge, bank withdrawals, and transparent audit ledger'}
          </p>
        </div>

        {/* Live Balance Pill */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-emerald-500/30 px-4 py-2 rounded-2xl shadow-lg self-start sm:self-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs text-slate-300">{lang === 'hi' ? 'नेट उपलब्ध:' : 'Net Available:'}</span>
          <span className="text-base sm:text-lg font-mono font-black text-emerald-400">
            {formatCurrency(availableBalance)}
          </span>
        </div>
      </div>

      {/* 4 Summary Balance Cards (Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Available Wallet (With High Contrast Gradient) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-900/50 via-slate-900/90 to-slate-950 border border-emerald-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{lang === 'hi' ? 'उपलब्ध पेआउट वॉलेट' : 'Available Wallet Balance'}</span>
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
              {formatCurrency(availableBalance)}
            </h2>
            <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'निकासी व रिचार्ज हेतु सक्रिय' : 'Ready for Payout & Recharge'}</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/20">
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              disabled={availableBalance < settings.minWithdrawal}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all min-h-[44px]"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{lang === 'hi' ? 'बैंक निकासी करें' : 'Withdraw to Bank'}</span>
            </button>
          </div>
        </div>

        {/* 2. Total Lifetime Credits */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{lang === 'hi' ? 'कुल संचित कमाई' : 'Total Lifetime Credits'}</span>
              <ArrowDownLeft className="w-4 h-4 text-cyan-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
              {formatCurrency(totalCredited)}
            </h2>
            <p className="text-[11px] text-cyan-400 mt-1">
              {lang === 'hi' ? 'सभी 7 इनकम स्रोतों से अर्जित' : 'Across all 7 earning streams'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>{lang === 'hi' ? 'क्रेडिट लेन-देन:' : 'Credit Txns:'}</span>
            <span className="font-mono font-bold text-slate-200">
              {transactions.filter((t) => t.isCredit).length} Entries
            </span>
          </div>
        </div>

        {/* 3. Total Debited / Withdrawn */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{lang === 'hi' ? 'निकासी व रिचार्ज खर्च' : 'Total Debits / Withdrawals'}</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
              {formatCurrency(totalDebited)}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">
              {lang === 'hi' ? 'बैंक ट्रांसफर + रिचार्ज' : 'Bank IMPS + Mobile Recharge'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>{lang === 'hi' ? 'डेबिट लेन-देन:' : 'Debit Txns:'}</span>
            <span className="font-mono font-bold text-slate-200">
              {transactions.filter((t) => !t.isCredit).length} Entries
            </span>
          </div>
        </div>

        {/* 4. Statutory TDS & Admin */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{lang === 'hi' ? 'TDS व एडमिन (5%+5%)' : 'TDS & Admin (5% + 5%)'}</span>
              <Percent className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {formatCurrency(Math.round(totalCredited * 0.1))}
            </h2>
            <p className="text-[11px] text-amber-400/80 mt-1">
              {lang === 'hi' ? '100% भारत सरकार टैक्स कंप्लेंट' : 'Govt. Direct Selling Norms'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>{lang === 'hi' ? 'पैन स्टेटस:' : 'PAN Status:'}</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE RECHARGE SECTION WITH SOLVED & PRISTINE GRADIENTS */}
      {/* ========================================================= */}
      <div className="relative rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-950/90 border border-indigo-500/30 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Subtle Ambient Decorative Glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {lang === 'hi' ? 'मोबाइल रिचार्ज व उपयोगिता सेवा' : 'Mobile Recharge & Utility Service'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ⚡ 2% Cashback
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {lang === 'hi'
                  ? 'वॉलेट बैलेंस से बिना अतिरिक्त शुल्क तुरंत रिचार्ज करें और 2% कमीशन पाएं'
                  : 'Recharge prepaid numbers directly with wallet balance & earn 2% instant cashback'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-950/70 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
            <Signal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">{lang === 'hi' ? 'वॉलेट शेष:' : 'Wallet:'}</span>
            <span className="font-mono font-bold text-white">{formatCurrency(availableBalance)}</span>
          </div>
        </div>

        <form onSubmit={handleExecuteRecharge} className="space-y-5">
          {/* Step 1: Select Operator */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              1. {lang === 'hi' ? 'टेलीकॉम ऑपरेटर चुनें (Select Operator):' : 'Select Telecom Operator:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {OPERATORS.map((op) => {
                const isSelected = selectedOperator === op.id;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setSelectedOperator(op.id)}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 min-h-[44px] ${
                      isSelected
                        ? `bg-slate-800/90 ${op.border} shadow-lg ring-2 ring-indigo-500/40 text-white`
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: op.accentHex }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-white">{op.name}</div>
                      <div className="text-[10px] text-slate-400">Prepaid 5G</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Mobile Number & Circle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                2. {lang === 'hi' ? '10-अंकों का मोबाइल नंबर दर्ज करें:' : 'Enter 10-Digit Mobile Number:'}
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <span className="font-bold text-white">+91</span>
                  <span className="text-slate-600">|</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="9876543210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-16 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[44px]"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {lang === 'hi' ? 'सर्किल: दिल्ली-एनसीआर / यूपी ईस्ट (ऑटो डिटेक्टेड)' : 'Circle: All India / Auto-detected'}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {lang === 'hi' ? 'कस्टम राशि (₹) दर्ज करें:' : 'Or Custom Amount (₹):'}
              </label>
              <input
                type="number"
                min="10"
                max={availableBalance}
                placeholder="₹199, ₹299..."
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  if (e.target.value) {
                    setSelectedPlanDetails(`Custom Top-up ₹${e.target.value}`);
                  }
                }}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 min-h-[44px]"
              />
            </div>
          </div>

          {/* Step 3: Popular Plans Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300">
                3. {lang === 'hi' ? 'लोकप्रिय रिचार्ज प्लान्स चुनें (Popular Plans):' : 'Select Popular Recharge Plan:'}
              </label>
              <span className="text-[11px] text-indigo-400 font-medium">
                {lang === 'hi' ? 'सभी प्लान्स में 2% कैशबैक मान्य' : '2% Instant Cashback on All'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {POPULAR_RECHARGE_PLANS.map((plan) => {
                const isSelected = !customAmount && rechargeAmount === plan.amount;
                return (
                  <div
                    key={plan.amount}
                    onClick={() => {
                      setRechargeAmount(plan.amount);
                      setCustomAmount('');
                      setSelectedPlanDetails(`${plan.validity} • ${plan.data}`);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-400 shadow-xl ring-2 ring-indigo-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {plan.tag && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-500 text-white uppercase tracking-wider">
                        {plan.tag}
                      </span>
                    )}

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-white font-mono">₹{plan.amount}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">/ {plan.validity}</span>
                      </div>
                      <div className="text-xs font-bold text-indigo-300 mt-1">{plan.data}</div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        {lang === 'hi' ? plan.descriptionHi : plan.descriptionEn}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-bold">
                        +₹{Math.max(1, Math.round(plan.amount * 0.02))} {lang === 'hi' ? 'कैशबैक' : 'Cashback'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Choose'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row: Summary + Instant Recharge Button */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="text-slate-300">
                  {lang === 'hi' ? 'कुल देय राशि (वॉलेट से):' : 'Net Deduction from Wallet:'}{' '}
                  <span className="font-mono font-black text-white text-sm">
                    ₹{customAmount ? Number(customAmount) : rechargeAmount}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  ⚡ 2% MLM कैशबैक बोनस: +₹
                  {Math.max(1, Math.round((customAmount ? Number(customAmount) : rechargeAmount) * 0.02))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                isRecharging ||
                !mobileNumber ||
                mobileNumber.length < 10 ||
                (customAmount ? Number(customAmount) : rechargeAmount) > availableBalance ||
                (customAmount ? Number(customAmount) : rechargeAmount) <= 0
              }
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all min-h-[46px] shrink-0"
            >
              {isRecharging ? (
                <span>{lang === 'hi' ? 'रिचार्ज प्रोसेस हो रहा है...' : 'Processing Recharge...'}</span>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>
                    {lang === 'hi'
                      ? `तुरंत रिचार्ज करें (₹${customAmount ? Number(customAmount) : rechargeAmount})`
                      : `Recharge Now (₹${customAmount ? Number(customAmount) : rechargeAmount})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================= */}
      {/* TRANSACTIONS SECTION: REDESIGNED WITH DUAL RESPONSIVE VIEW */}
      {/* ========================================================= */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
        {/* Header with Search & Filter Bar */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span>{lang === 'hi' ? 'खाता बही एवं लेन-देन विवरण' : 'Ledger & Commission Transactions'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'hi'
                  ? 'प्रत्येक बाइनरी मैचिंग, डायरेक्ट बोनस, मोबाइल रिचार्ज और पेआउट स्लिप'
                  : 'Complete record of binary matchings, direct sponsor bonuses, withdrawals & recharges'}
              </p>
            </div>

            {/* Quick Count Badge */}
            <div className="text-xs font-medium text-slate-400 self-start sm:self-auto">
              <span>Showing </span>
              <span className="font-mono font-bold text-white">{filteredTxns.length}</span>
              <span> of {transactions.length} entries</span>
            </div>
          </div>

          {/* Search Box + Category Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'hi' ? 'Txn ID, विवरण या राशि से खोजें...' : 'Search by Txn ID, notes, amount...'}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-[40px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Scrollable Filter Pills (Never Wraps or Hides Buttons) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { id: 'ALL', labelHi: 'सभी', labelEn: 'All' },
                { id: 'PAIR_MATCHING', labelHi: 'बाइनरी मैचिंग', labelEn: 'Binary' },
                { id: 'DIRECT', labelHi: 'डायरेक्ट', labelEn: 'Direct' },
                { id: 'MOBILE_RECHARGE', labelHi: 'रिचार्ज', labelEn: 'Recharges' },
                { id: 'WITHDRAWAL', labelHi: 'निकासी', labelEn: 'Withdrawals' },
                { id: 'CREDIT', labelHi: 'क्रेडिट (+)', labelEn: 'Credits' },
                { id: 'DEBIT', labelHi: 'डेबिट (-)', labelEn: 'Debits' },
              ].map((f) => {
                const isActive = filterType === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[38px] flex items-center gap-1 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <span>{lang === 'hi' ? f.labelHi : f.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 1. MOBILE RESPONSIVE CARD VIEW (sm:hidden)                    */}
        {/* SOLVES ALL HIDDEN BUTTON ISSUES: EACH CARD SHOWS ACTION BUTTONS */}
        {/* ------------------------------------------------------------- */}
        <div className="sm:hidden space-y-3">
          {filteredTxns.length === 0 ? (
            <div className="py-10 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
              <Receipt className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-xs">{lang === 'hi' ? 'कोई लेन-देन नहीं मिला' : 'No transactions found'}</p>
            </div>
          ) : (
            filteredTxns.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 shadow-md"
              >
                {/* Card Header: Icon, Category & Amount */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        t.isCredit ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                      }`}
                    >
                      {getTxnIcon(t.type, t.isCredit)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-white truncate">{t.id}</span>
                        <button
                          onClick={() => handleCopyTxnId(t.id)}
                          className="text-slate-400 hover:text-white p-0.5"
                          title="Copy ID"
                        >
                          {copiedTxnId === t.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {t.date}
                      </span>
                    </div>
                  </div>

                  {/* Amount with colored sign */}
                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono font-black text-base sm:text-lg block ${
                        t.isCredit ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {t.isCredit ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </span>
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        t.isCredit
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {t.isCredit ? 'CREDIT' : 'DEBIT'}
                    </span>
                  </div>
                </div>

                {/* Description & Calculation Notes */}
                <div className="text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="font-semibold text-slate-200">{lang === 'hi' ? t.titleHi : t.title}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{t.notes}</p>
                </div>

                {/* Dedicated Action Row with High Visibility Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.status}</span>
                  </div>

                  <button
                    onClick={() => setSelectedInvoiceTxn(t)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 shadow-sm min-h-[42px]"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'hi' ? 'स्लिप देखें (Slip)' : 'View Receipt Slip'}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. DESKTOP LEDGER TABLE VIEW (hidden sm:block)                */}
        {/* ------------------------------------------------------------- */}
        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3.5">Txn ID / Date</th>
                <th className="py-3 px-3.5">Type</th>
                <th className="py-3 px-3.5">Description & Calculation</th>
                <th className="py-3 px-3.5 text-right">Amount</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right">Receipt / Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    <Receipt className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    {lang === 'hi' ? 'कोई लेन-देन नहीं मिला' : 'No transactions found'}
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white">{t.id}</span>
                        <button
                          onClick={() => handleCopyTxnId(t.id)}
                          className="text-slate-400 hover:text-white p-0.5"
                          title="Copy ID"
                        >
                          {copiedTxnId === t.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {t.date}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          t.isCredit
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {getTxnIcon(t.type, t.isCredit)}
                        <span>{t.isCredit ? 'CREDIT' : 'DEBIT'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5">
                      <p className="font-semibold text-slate-200">{lang === 'hi' ? t.titleHi : t.title}</p>
                      <p className="text-[10px] text-slate-400 leading-snug mt-0.5">{t.notes}</p>
                    </td>
                    <td className="py-3.5 px-3.5 text-right font-mono font-bold text-sm whitespace-nowrap">
                      <span className={t.isCredit ? 'text-emerald-400' : 'text-rose-400'}>
                        {t.isCredit ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInvoiceTxn(t)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 border border-slate-700 shadow-sm transition-colors"
                        title="View Payout Slip"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'hi' ? 'स्लिप देखें' : 'View Slip'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* WITHDRAWAL MODAL WITH FULL BUTTON VISIBILITY ASSURANCE    */}
      {/* ========================================================= */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'hi' ? 'बैंक / UPI निकासी अनुरोध' : 'Request Payout Withdrawal'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'hi'
                      ? `उपलब्ध: ${formatCurrency(availableBalance)}`
                      : `Available: ${formatCurrency(availableBalance)}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleWithdrawSubmit} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {lang === 'hi' ? 'निकासी राशि (₹) *' : 'Withdrawal Amount (₹) *'}
                </label>
                <input
                  type="number"
                  min={settings.minWithdrawal}
                  max={availableBalance}
                  step="100"
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 min-h-[44px]"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Min: {formatCurrency(settings.minWithdrawal)}</span>
                  <span>Max: {formatCurrency(availableBalance)}</span>
                </div>
              </div>

              {/* Method */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {lang === 'hi' ? 'भुगतान विधि चुनें:' : 'Select Payout Channel:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('UPI')}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px] ${
                      payoutMethod === 'UPI'
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400 shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>UPI (GPay / PhonePe)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('BANK')}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px] ${
                      payoutMethod === 'BANK'
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400 shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Bank IMPS / NEFT</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {payoutMethod === 'UPI' ? 'UPI ID (VPA)' : 'Bank Account Number & IFSC'}
                </label>
                <input
                  type="text"
                  placeholder={
                    payoutMethod === 'UPI'
                      ? 'mobile@upi or username@okaxis'
                      : 'A/C 1234567890, IFSC: HDFC0001234'
                  }
                  value={accountDetail}
                  onChange={(e) => setAccountDetail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 min-h-[44px]"
                />
              </div>

              {/* Deductions Preview */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Withdrawal:</span>
                  <span className="font-mono text-white">{formatCurrency(withdrawAmount)}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>TDS ({settings.tdsPercent}% Govt. Sec 194H):</span>
                  <span className="font-mono">-{formatCurrency((withdrawAmount * settings.tdsPercent) / 100)}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Admin & Platform Maintenance ({settings.adminPercent}%):</span>
                  <span className="font-mono">-{formatCurrency((withdrawAmount * settings.adminPercent) / 100)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-emerald-400 text-xs">
                  <span>Net Credited to Bank Account:</span>
                  <span className="font-mono text-sm">
                    {formatCurrency(withdrawAmount - withdrawAmount * 0.1)}
                  </span>
                </div>
              </div>

              {/* Sticky Submit Button (Never Hidden) */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all min-h-[46px] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'तत्काल भुगतान स्वीकृत करें' : 'Confirm & Process Withdrawal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* RECHARGE SUCCESS SLIP MODAL                               */}
      {/* ========================================================= */}
      {lastRechargeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setLastRechargeReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center border-b border-slate-800 pb-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-white">
                {lang === 'hi' ? 'रिचार्ज सफलतापूर्वक संपन्न हुआ!' : 'Recharge Successful!'}
              </h3>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                Operator Ref: {lastRechargeReceipt.operator.toUpperCase()}-
                {Math.floor(10000000 + Math.random() * 90000000)}
              </p>
            </div>

            <div className="space-y-2.5 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Mobile Number:</span>
                <span className="font-mono font-bold text-white">+91 {lastRechargeReceipt.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Operator & Circle:</span>
                <span className="font-bold text-indigo-400">{lastRechargeReceipt.operator} (Prepaid 5G)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan Details:</span>
                <span className="text-slate-200 text-right">{lastRechargeReceipt.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recharge Amount:</span>
                <span className="font-mono font-bold text-white">₹{lastRechargeReceipt.amount}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-emerald-400 font-bold">
                <span>Instant Cashback Credited:</span>
                <span className="font-mono">+₹{lastRechargeReceipt.cashback} (2%)</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'hi' ? 'प्रिंट रसीद' : 'Print Slip'}</span>
              </button>
              <button
                onClick={() => setLastRechargeReceipt(null)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold min-h-[44px]"
              >
                {lang === 'hi' ? 'पूर्ण करें' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PAYOUT SLIP / COMMISSION INVOICE MODAL                    */}
      {/* ========================================================= */}
      {selectedInvoiceTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoiceTxn(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slip Header */}
            <div className="text-center border-b border-slate-800 pb-4 mb-4">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                {settings.companyName}
              </h2>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                Official Commission Payout Statement & Advice Slip
              </p>
              <span className="text-[10px] text-slate-400">
                GSTIN: 07AAACA1234A1Z9 | MCA Direct Selling Guidelines Compliant
              </span>
            </div>

            {/* Member Details */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-2xl border border-slate-800 mb-4">
              <div>
                <span className="text-slate-500 block">Distributor Name:</span>
                <span className="font-bold text-white">{member.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Member ID:</span>
                <span className="font-mono font-bold text-emerald-400">{member.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Rank / Package:</span>
                <span className="font-semibold text-white">{member.rank} ({member.packageName})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Payout Date:</span>
                <span className="text-white">{selectedInvoiceTxn.date}</span>
              </div>
            </div>

            {/* Item Breakdown */}
            <div className="space-y-2 text-xs divide-y divide-slate-800">
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-white font-bold">{selectedInvoiceTxn.id}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Income Category:</span>
                <span className="font-bold text-emerald-400">{selectedInvoiceTxn.title}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Calculation Notes:</span>
                <span className="text-slate-300 text-right max-w-xs">{selectedInvoiceTxn.notes}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold">
                <span className="text-white">Gross Amount:</span>
                <span className="font-mono text-emerald-400">
                  {formatCurrency(selectedInvoiceTxn.amount)}
                </span>
              </div>
              {selectedInvoiceTxn.isCredit && selectedInvoiceTxn.type !== 'MOBILE_RECHARGE' && (
                <>
                  <div className="flex justify-between pt-2 text-rose-400">
                    <span>Statutory TDS Deduction (5%):</span>
                    <span className="font-mono">-{formatCurrency(selectedInvoiceTxn.amount * 0.05)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-rose-400">
                    <span>Platform Admin Maintenance (5%):</span>
                    <span className="font-mono">-{formatCurrency(selectedInvoiceTxn.amount * 0.05)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-base font-black text-white">
                    <span>Net Paid Amount:</span>
                    <span className="font-mono text-emerald-400">
                      {formatCurrency(selectedInvoiceTxn.amount * 0.9)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Official Stamp in Receipt */}
            <div className="my-4 flex items-center justify-center">
              <OfficialStampBadge variant="MCA" size="sm" />
            </div>

            <div className="pt-3 border-t border-slate-800 text-center flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'hi' ? 'प्रिंट रसीद' : 'Print Slip'}</span>
              </button>
              <button
                onClick={() => setSelectedInvoiceTxn(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold min-h-[44px]"
              >
                {lang === 'hi' ? 'बंद करें' : 'Close Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
