import React, { useState } from 'react';
import {
  Wallet,
  Zap,
  QrCode,
  CheckCircle2,
  Copy,
  Clock,
  ShieldCheck,
  CreditCard,
  Building2,
  Gift,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Language, UserWallet, DepositRecord } from '../types';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface DepositPageProps {
  wallet: UserWallet;
  deposits: DepositRecord[];
  onAddFunds: (amount: number, method: 'upi' | 'paytm' | 'phonepe' | 'gpay' | 'bank' | 'usdt') => void;
  language: Language;
}

const PRESET_AMOUNTS = [100, 300, 500, 1000, 2000, 5000, 10000, 50000];

export const DepositPage: React.FC<DepositPageProps> = ({
  wallet,
  deposits,
  onAddFunds,
  language,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentChannel, setPaymentChannel] = useState<'upi' | 'phonepe' | 'paytm' | 'gpay' | 'bank'>('upi');
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [enteredUtr, setEnteredUtr] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const finalAmount = customAmount ? Math.max(100, parseInt(customAmount) || 0) : selectedAmount;
  const bonusAmount = Math.floor(finalAmount * 0.1); // +10% bonus

  const handleSelectAmount = (amt: number) => {
    sound.playChip();
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleProceedDeposit = () => {
    sound.playClick();
    setShowQRModal(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    sound.playChip();

    setTimeout(() => {
      setIsProcessing(false);
      setShowQRModal(false);
      sound.playWin();

      // Credit wallet
      onAddFunds(finalAmount + bonusAmount, paymentChannel);
      setSuccessToast(
        language === 'hi'
          ? `₹${(finalAmount + bonusAmount).toLocaleString('en-IN')} सफलतापूर्वक वॉलेट में क्रेडिट हो गए! (+10% बोनस शामिल)`
          : `₹${(finalAmount + bonusAmount).toLocaleString('en-IN')} successfully credited to wallet! (+10% Bonus included)`
      );

      setTimeout(() => setSuccessToast(null), 4000);
    }, 1200);
  };

  const copyUpiId = () => {
    navigator.clipboard?.writeText('royalplay.colorpred@icici');
    setCopiedUpi(true);
    sound.playClick();
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div id="page-deposit" className="space-y-5 animate-fadeIn">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-emerald-950/50">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Balance & Bonus Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Wallet className="w-4 h-4" />
              <span>{language === 'hi' ? 'वर्तमान डेमो वॉलेट बैलेंस' : 'Current Demo Wallet Balance'}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
              {formatCurrency(wallet.balance)}
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-amber-300">
                {language === 'hi' ? '+10% त्वरित जमा बोनस' : '+10% Instant Deposit Bonus'}
              </div>
              <div className="text-[11px] text-slate-400">
                {language === 'hi'
                  ? 'प्रत्येक रिचार्ज पर स्वचालित 10% अतिरिक्त फंड पाएं'
                  : 'Get automated 10% extra funds on every recharge'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Channel Selection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{language === 'hi' ? 'भुगतान माध्यम चुनें' : 'Select Payment Method'}</span>
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            0% Fee Instant
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'upi', name: 'UPI Fast QR', icon: QrCode, badge: 'Fastest' },
            { id: 'phonepe', name: 'PhonePe UPI', icon: CreditCard },
            { id: 'paytm', name: 'Paytm Wallet/UPI', icon: Wallet },
            { id: 'bank', name: 'IMPS Bank', icon: Building2 },
          ].map((ch) => {
            const Icon = ch.icon;
            const isSelected = paymentChannel === ch.id;
            return (
              <button
                key={ch.id}
                id={`btn-channel-${ch.id}`}
                onClick={() => {
                  sound.playChip();
                  setPaymentChannel(ch.id as any);
                }}
                className={`relative p-3.5 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {ch.badge && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                    {ch.badge}
                  </span>
                )}
                <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold leading-tight">{ch.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Amount Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-between">
          <span>{language === 'hi' ? 'जमा राशि चुनें' : 'Select Deposit Amount'}</span>
          <span className="text-xs font-normal text-slate-400">
            Min: ₹100 | Max: ₹1,00,000
          </span>
        </h3>

        {/* Preset Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_AMOUNTS.map((amt) => {
            const isSelected = selectedAmount === amt && !customAmount;
            return (
              <button
                key={amt}
                id={`btn-deposit-chip-${amt}`}
                onClick={() => handleSelectAmount(amt)}
                className={`py-3 px-4 rounded-2xl border font-mono font-bold text-sm transition-all active:scale-95 flex items-center justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>₹{amt.toLocaleString('en-IN')}</span>
                <span className="text-[10px] font-sans text-amber-300 font-semibold">+₹{amt * 0.1}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            {language === 'hi' ? 'या अन्य राशि दर्ज करें (₹)' : 'Or enter custom amount (₹)'}
          </label>
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 focus-within:border-emerald-500 transition-colors">
            <span className="text-sm font-mono font-bold text-slate-400 mr-2">₹</span>
            <input
              id="input-custom-deposit"
              type="number"
              min="100"
              max="100000"
              step="100"
              placeholder="e.g. 7500"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full bg-transparent text-sm sm:text-base font-mono font-bold text-white placeholder:text-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>{language === 'hi' ? 'जमा राशि:' : 'Deposit Amount:'}</span>
            <span className="font-mono text-white font-bold">₹{finalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-amber-400">
            <span>{language === 'hi' ? '10% बोनस फंड:' : '10% Bonus Funds:'}</span>
            <span className="font-mono font-bold">+₹{bonusAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
            <span>{language === 'hi' ? 'कुल प्राप्त राशि:' : 'Total Credits Received:'}</span>
            <span className="font-mono text-emerald-400 text-base">
              ₹{(finalAmount + bonusAmount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          id="btn-proceed-deposit"
          onClick={handleProceedDeposit}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>{language === 'hi' ? 'जमा करने के लिए आगे बढ़ें' : 'Proceed to Add Funds'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Interactive Gateway / QR Code Modal Simulator */}
      {showQRModal && (
        <div
          id="deposit-qr-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">
                  {language === 'hi' ? 'सुरक्षित भुगतान गेटवे (सिम्युलेटर)' : 'Secure Payment Gateway'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'hi' ? 'UPI QR कोड स्कैन करें या तुरंत क्रेडिट करें' : 'Scan UPI QR code or click Instant Credit'}
                </p>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* QR Simulation Box */}
            <div className="bg-white p-4 rounded-2xl mx-auto w-48 h-48 flex flex-col items-center justify-center shadow-lg relative">
              {/* Simulated QR Pattern */}
              <div className="grid grid-cols-6 gap-1 w-36 h-36 p-1 bg-slate-100 rounded-lg">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[2px] ${
                      (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                        ? 'bg-slate-900'
                        : i % 5 === 0
                        ? 'bg-emerald-600'
                        : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-800 mt-1">UPI Dynamic QR</span>
            </div>

            {/* UPI ID Copy */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300">royalplay.colorpred@icici</span>
              <button
                onClick={copyUpiId}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-1 bg-emerald-500/10 rounded-lg"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Simulated instant pay button */}
            <button
              id="btn-instant-confirm-deposit"
              disabled={isProcessing}
              onClick={handleConfirmPayment}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-lg hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'hi' ? 'भुगतान सत्यापित हो रहा है...' : 'Verifying simulated payment...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                  <span>
                    {language === 'hi'
                      ? `तुरंत ₹${(finalAmount + bonusAmount).toLocaleString('en-IN')} क्रेडिट करें`
                      : `Instant Credit ₹${(finalAmount + bonusAmount).toLocaleString('en-IN')}`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Recent Deposit Records */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>{language === 'hi' ? 'हालिया जमा रिकॉर्ड (Deposit Records)' : 'Recent Deposit Records'}</span>
        </h3>

        <div className="space-y-2">
          {deposits.map((dep) => (
            <div
              key={dep.id}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-bold text-white">
                  <span className="uppercase">{dep.method}</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Bonus +₹{dep.bonus}</span>
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  UTR: {dep.utr} • {new Date(dep.timestamp).toLocaleTimeString()}
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-emerald-400 text-sm">
                  +₹{dep.amount.toLocaleString('en-IN')}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Success
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
