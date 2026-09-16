import React, { useState } from 'react';
import {
  ArrowDownCircle,
  Building2,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { BankAccount, Language, ThemeConfig, UserWallet, WithdrawRecord } from '../types';
import { ASSETS_3D } from '../utils/assets3d';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface WithdrawPageProps {
  wallet: UserWallet;
  bankAccount: BankAccount;
  onUpdateBankAccount: (account: BankAccount) => void;
  onWithdraw: (record: WithdrawRecord) => void;
  language: Language;
  theme: ThemeConfig;
}

export const WithdrawPage: React.FC<WithdrawPageProps> = ({
  wallet,
  bankAccount,
  onUpdateBankAccount,
  onWithdraw,
  language,
  theme,
}) => {
  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  const [amount, setAmount] = useState<string>('500');
  const [method, setMethod] = useState<'bank' | 'upi'>('bank');
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [formBank, setFormBank] = useState<BankAccount>(bankAccount);
  const [isSuccess, setIsSuccess] = useState(false);

  const withdrawAmount = parseInt(amount, 10) || 0;
  const isOverBalance = withdrawAmount > wallet.balance;
  const isBelowMin = withdrawAmount < 300;

  const handleWithdraw = () => {
    if (isOverBalance || isBelowMin) return;
    sound.playWin();

    const record: WithdrawRecord = {
      id: `WDR-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: withdrawAmount,
      fee: 0,
      payoutMethod: method,
      targetAddress: method === 'bank' ? `${bankAccount.bankName} •••• ${bankAccount.accountNumber.slice(-4)}` : bankAccount.upiId,
      utr: `UTR${Date.now().toString().slice(-10)}`,
      status: 'completed',
      timestamp: Date.now(),
    };

    onWithdraw(record);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onUpdateBankAccount(formBank);
    setIsEditingBank(false);
  };

  return (
    <div id="withdraw-page-container" className="space-y-4 animate-fadeIn">
      {/* 1. 3D Banner */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/90 border-white/15'
        }`}
      >
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHi ? '24/7 ऑटोमेटेड पेआउट' : '24/7 Instant IMPS Payout'}</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {isHi ? 'बैंक निकासी (Withdraw Funds)' : 'Fast Bank Withdrawal'}
          </h2>
          <p className="text-xs text-zinc-400 max-w-md">
            {isHi
              ? 'बिना किसी रुकावट के अपने बैंक खाते या यूपीआई आईडी में 5 मिनट के भीतर तुरंत पैसा ट्रांसफर करें।'
              : 'Direct IMPS bank transfer and UPI payout settled in under 5 minutes with 0% fee.'}
          </p>
        </div>

        <img
          src={ASSETS_3D.bankVault3D}
          alt="3D Bank Vault"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-400/50 shadow-xl shrink-0"
        />
      </div>

      {/* Success Notification */}
      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 font-bold text-sm flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>{isHi ? 'निकासी सफलतापूर्वक भेजी गई! बैंक में 5 मिनट में जमा होगी।' : 'Withdrawal sent successfully! Arriving in 5 mins.'}</span>
        </div>
      )}

      {/* 2. Form & Balance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Input & Method */}
        <div
          className={`p-4 sm:p-5 rounded-3xl border space-y-4 ${
            isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/90 border-white/15'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-400">
              {isHi ? 'निकासी राशि दर्ज करें:' : 'Withdrawal Amount:'}
            </span>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-black text-amber-500 text-lg">
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Min ₹300"
                className="w-full pl-8 pr-3 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-white font-mono font-bold text-lg focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex justify-between text-[11px] text-zinc-400 pt-1">
              <span>{isHi ? 'न्यूनतम: ₹300' : 'Minimum: ₹300'}</span>
              <span>
                {isHi ? 'उपलब्ध:' : 'Available:'} <strong className="text-amber-500 font-mono">{formatCurrency(wallet.balance)}</strong>
              </span>
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="grid grid-cols-4 gap-2">
            {[500, 1000, 2000, 5000].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono font-bold text-zinc-300 hover:text-white hover:border-amber-400 active:scale-95"
              >
                ₹{v}
              </button>
            ))}
          </div>

          {/* Method Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-zinc-400">
              {isHi ? 'भुगतान विधि चुनें:' : 'Payout Method:'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMethod('bank')}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all active:scale-95 ${
                  method === 'bank'
                    ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow font-black'
                    : 'bg-zinc-900 text-zinc-400 border-white/10'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span className="text-xs">{isHi ? 'बैंक खाता (IMPS)' : 'Bank IMPS'}</span>
              </button>

              <button
                onClick={() => setMethod('upi')}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all active:scale-95 ${
                  method === 'upi'
                    ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow font-black'
                    : 'bg-zinc-900 text-zinc-400 border-white/10'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs">{isHi ? 'यूपीआई (UPI)' : 'Instant UPI'}</span>
              </button>
            </div>
          </div>

          {/* Withdraw Submit Button */}
          <button
            onClick={handleWithdraw}
            disabled={isOverBalance || isBelowMin}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-sm shadow-[0_6px_0_#065f46] active:translate-y-1 active:shadow-none transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <ArrowDownCircle className="w-5 h-5 stroke-[2.5]" />
            <span>
              {isOverBalance
                ? isHi ? 'पर्याप्त बैलेंस नहीं है' : 'Insufficient Balance'
                : isBelowMin
                ? isHi ? 'न्यूनतम निकासी ₹300 है' : 'Minimum is ₹300'
                : isHi ? `निकासी करें (Withdraw ${formatCurrency(withdrawAmount)})` : `Withdraw ${formatCurrency(withdrawAmount)}`}
            </span>
          </button>
        </div>

        {/* Right: Bank Account Details Card */}
        <div
          className={`p-4 sm:p-5 rounded-3xl border space-y-4 ${
            isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/90 border-white/15'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{isHi ? 'लिंक्ड बैंक खाता व यूपीआई' : 'Linked Payout Account'}</span>
            </h4>
            <button
              onClick={() => setIsEditingBank(!isEditingBank)}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              {isEditingBank ? (isHi ? 'रद्द करें' : 'Cancel') : (isHi ? 'संपादित करें' : 'Edit')}
            </button>
          </div>

          {isEditingBank ? (
            <form onSubmit={handleSaveBank} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Account Holder Name:</label>
                <input
                  type="text"
                  value={formBank.accountName}
                  onChange={(e) => setFormBank({ ...formBank, accountName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Bank Account Number:</label>
                <input
                  type="text"
                  value={formBank.accountNumber}
                  onChange={(e) => setFormBank({ ...formBank, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">IFSC Code:</label>
                <input
                  type="text"
                  value={formBank.ifscCode}
                  onChange={(e) => setFormBank({ ...formBank, ifscCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">UPI ID (VPA):</label>
                <input
                  type="text"
                  value={formBank.upiId}
                  onChange={(e) => setFormBank({ ...formBank, upiId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono font-bold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-black shadow active:scale-95"
              >
                {isHi ? 'सहेजें (Save Account)' : 'Save Details'}
              </button>
            </form>
          ) : (
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Name:</span>
                  <span className="text-white font-bold">{bankAccount.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Bank:</span>
                  <span className="text-white font-bold">{bankAccount.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Account:</span>
                  <span className="text-white font-bold">•••• •••• {bankAccount.accountNumber.slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">IFSC:</span>
                  <span className="text-white font-bold">{bankAccount.ifscCode}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-amber-400">
                  <span>UPI ID:</span>
                  <span className="font-bold">{bankAccount.upiId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-sans">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{isHi ? '256-बिट बैंक लेवल सुरक्षा एन्क्रिप्शन' : '256-bit bank-grade encryption'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
