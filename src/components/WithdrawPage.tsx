import React, { useState } from 'react';
import {
  ArrowDownCircle,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  Send,
  PlusCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Language, UserWallet, WithdrawRecord, BankAccount, ThemeMode } from '../types';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';
import { ASSETS_3D } from '../utils/assets3d';

interface WithdrawPageProps {
  wallet: UserWallet;
  withdrawals: WithdrawRecord[];
  bankDetails?: BankAccount;
  onUpdateBankDetails: (details: BankAccount) => void;
  onRequestWithdrawal: (amount: number, method: 'bank' | 'upi', targetAddress: string) => boolean;
  language: Language;
  themeMode?: ThemeMode;
  onNavigateTransactions?: () => void;
}

export const WithdrawPage: React.FC<WithdrawPageProps> = ({
  wallet,
  withdrawals,
  bankDetails,
  onUpdateBankDetails,
  onRequestWithdrawal,
  language,
  themeMode = 'dark',
  onNavigateTransactions,
}) => {
  const isLight = themeMode === 'light';
  const [withdrawAmount, setWithdrawAmount] = useState<string>('1500');
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'upi'>('bank');
  const [isEditingBank, setIsEditingBank] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Bank Form State
  const [holderName, setHolderName] = useState(bankDetails?.accountHolderName || 'Rahul Sharma');
  const [bankName, setBankName] = useState(bankDetails?.bankName || 'State Bank of India');
  const [accNumber, setAccNumber] = useState(bankDetails?.accountNumber || '482910482910');
  const [ifsc, setIfsc] = useState(bankDetails?.ifscCode || 'SBIN0001423');
  const [upiId, setUpiId] = useState(bankDetails?.upiId || 'rahul.sharma@okhdfcbank');

  const amountNum = parseFloat(withdrawAmount) || 0;
  const minWithdrawal = 300;
  const maxWithdrawal = 50000;
  const feePercent = 0; // 0% fee promo
  const feeAmount = Math.floor(amountNum * (feePercent / 100));
  const finalPayout = Math.max(0, amountNum - feeAmount);

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playChip();
    onUpdateBankDetails({
      accountHolderName: holderName,
      bankName: bankName,
      accountNumber: accNumber,
      ifscCode: ifsc.toUpperCase(),
      upiId: upiId,
    });
    setIsEditingBank(false);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (amountNum < minWithdrawal) {
      setErrorMsg(
        language === 'hi'
          ? `न्यूनतम निकासी राशि ₹${minWithdrawal} है`
          : `Minimum withdrawal amount is ₹${minWithdrawal}`
      );
      return;
    }

    if (amountNum > maxWithdrawal) {
      setErrorMsg(
        language === 'hi'
          ? `अधिकतम एकल निकासी सीमा ₹${maxWithdrawal.toLocaleString('en-IN')} है`
          : `Maximum single withdrawal limit is ₹${maxWithdrawal.toLocaleString('en-IN')}`
      );
      return;
    }

    if (amountNum > wallet.balance) {
      setErrorMsg(
        language === 'hi'
          ? 'वॉलेट में अपर्याप्त बैलेंस है!'
          : 'Insufficient wallet balance for withdrawal!'
      );
      return;
    }

    setIsSubmitting(true);
    sound.playChip();

    setTimeout(() => {
      setIsSubmitting(false);
      const target = payoutMethod === 'bank' ? `${bankName} (${accNumber.slice(-4)})` : upiId;
      const ok = onRequestWithdrawal(amountNum, payoutMethod, target);

      if (ok) {
        sound.playWin();
        setSuccessMsg(
          language === 'hi'
            ? `₹${amountNum.toLocaleString('en-IN')} की निकासी प्रक्रियाधीन है! बैंक यूटीआर शीघ्र अपडेट होगा।`
            : `Withdrawal of ₹${amountNum.toLocaleString('en-IN')} is processing! UTR will arrive shortly.`
        );
        setTimeout(() => setSuccessMsg(null), 5000);
      }
    }, 900);
  };

  return (
    <div id="page-withdraw" className="space-y-5 animate-fadeIn">
      {/* Toast Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-sm flex items-center gap-2.5 shadow-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Balance Summary Card with 3D Bank Vault Asset */}
      <div className={`rounded-3xl border p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
        isLight
          ? 'bg-gradient-to-br from-indigo-50 via-white to-indigo-100/50 border-indigo-200 shadow-indigo-900/5'
          : 'bg-gradient-to-br from-indigo-950/80 via-zinc-900 to-zinc-950 border-indigo-500/30 shadow-indigo-950/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1 bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-lg flex items-center justify-center">
            <img
              src={ASSETS_3D.bankVault3D}
              alt="3D Bank Vault"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-0.5 ${
              isLight ? 'text-indigo-700' : 'text-indigo-400'
            }`}>
              <ArrowDownCircle className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'निकासी योग्य बैलेंस' : 'Withdrawable Demo Balance'}</span>
            </div>
            <div className={`text-2xl sm:text-4xl font-mono font-black tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {formatCurrency(wallet.balance)}
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-3 border rounded-2xl p-3 text-xs ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-zinc-950/80 border-white/10'
        }`}>
          <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
          <div>
            <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {language === 'hi' ? '24/7 तत्काल निकासी' : '24/7 Instant Settlement'}
            </div>
            <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              {language === 'hi' ? '0% अतिरिक्त शुल्क • IMPS/UPI ट्रांसफर' : '0% Processing Fee • IMPS / UPI'}
            </div>
          </div>
        </div>
      </div>

      {/* Bank & UPI Details Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>{language === 'hi' ? 'बैंक खाता एवं UPI विवरण' : 'Linked Bank & UPI Account'}</span>
          </h3>

          <button
            id="btn-toggle-edit-bank"
            onClick={() => setIsEditingBank(!isEditingBank)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1"
          >
            {isEditingBank
              ? language === 'hi'
                ? 'रद्द करें'
                : 'Cancel'
              : language === 'hi'
              ? 'बदलें / संपादित करें'
              : 'Modify / Bind'}
          </button>
        </div>

        {!isEditingBank ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {language === 'hi' ? 'बैंक खाता (IMPS)' : 'Bank Account (IMPS)'}
              </span>
              <div className="font-bold text-white text-sm">{bankDetails?.bankName || 'State Bank of India'}</div>
              <div className="font-mono text-xs text-slate-300">
                A/C: {bankDetails?.accountNumber || '••••••••6721'}
              </div>
              <div className="text-[11px] text-slate-400">
                IFSC: {bankDetails?.ifscCode || 'SBIN0001423'} • {bankDetails?.accountHolderName || 'Rahul Sharma'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {language === 'hi' ? 'UPI आईडी (Instant VPA)' : 'UPI ID (Instant VPA)'}
              </span>
              <div className="font-mono font-bold text-emerald-400 text-sm">
                {bankDetails?.upiId || 'rahul.sharma@okhdfcbank'}
              </div>
              <div className="text-[11px] text-slate-400">
                {language === 'hi' ? 'Paytm, PhonePe, GPay समर्थित' : 'Supports PhonePe, GPay, Paytm'}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveBank} className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accNumber}
                  onChange={(e) => setAccNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">UPI ID (e.g. mobile@upi)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all"
            >
              Save Bank Info
            </button>
          </form>
        )}
      </div>

      {/* Withdrawal Form */}
      <form
        onSubmit={handleWithdrawSubmit}
        className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4"
      >
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-between">
          <span>{language === 'hi' ? 'निकासी राशि दर्ज करें' : 'Enter Withdrawal Amount'}</span>
          <span className="text-xs text-slate-400">Min: ₹300 | Max: ₹50,000</span>
        </h3>

        {/* Method selector */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPayoutMethod('bank')}
            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              payoutMethod === 'bank'
                ? 'bg-indigo-950/60 border-indigo-500 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Bank Account</span>
          </button>
          <button
            type="button"
            onClick={() => setPayoutMethod('upi')}
            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              payoutMethod === 'upi'
                ? 'bg-emerald-950/60 border-emerald-500 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>UPI Instant</span>
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
            <span className="text-sm font-mono font-bold text-slate-400 mr-2">₹</span>
            <input
              id="input-withdraw-amount"
              type="number"
              min={minWithdrawal}
              max={maxWithdrawal}
              step="100"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-transparent text-lg font-mono font-bold text-white placeholder:text-slate-600 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setWithdrawAmount(Math.floor(wallet.balance).toString())}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
            >
              All
            </button>
          </div>
        </div>

        {/* Calculation summary */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>{language === 'hi' ? 'निकासी राशि:' : 'Requested Amount:'}</span>
            <span className="font-mono text-white">₹{amountNum.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>{language === 'hi' ? 'सर्विस चार्ज (0% Promo):' : 'Service Fee (0% Promo):'}</span>
            <span className="font-mono text-emerald-400">₹0</span>
          </div>
          <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold text-white">
            <span>{language === 'hi' ? 'प्राप्त होने वाली राशि:' : 'Estimated Payout:'}</span>
            <span className="font-mono text-emerald-400 text-sm">₹{finalPayout.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button
          id="btn-submit-withdraw"
          type="submit"
          disabled={isSubmitting || amountNum <= 0}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{language === 'hi' ? 'निकासी भेजी जा रही है...' : 'Processing Withdrawal...'}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{language === 'hi' ? 'निकासी के लिए अनुरोध करें' : 'Request Instant Payout'}</span>
            </>
          )}
        </button>
      </form>

      {/* Withdrawal History */}
      <div className={`border rounded-3xl p-5 shadow-lg space-y-3 transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-zinc-900/90 border-white/10'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-bold flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{language === 'hi' ? 'हालिया निकासी रिकॉर्ड' : 'Withdrawal Records'}</span>
          </h3>
          {onNavigateTransactions && (
            <button
              onClick={onNavigateTransactions}
              className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          {withdrawals.map((w) => (
            <div
              key={w.id}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="uppercase">{w.payoutMethod}</span>
                  <span className="text-slate-400 text-[11px]">→ {w.targetAddress}</span>
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  UTR: {w.utr} • {new Date(w.timestamp).toLocaleTimeString()}
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-white text-sm">
                  -₹{w.amount.toLocaleString('en-IN')}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  {w.status === 'completed' ? 'Settled' : 'Processing'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
