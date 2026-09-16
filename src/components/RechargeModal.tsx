import React, { useState } from 'react';
import {
  X,
  Wallet,
  Sparkles,
  QrCode,
  Copy,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Language, ThemeConfig } from '../types';
import { ASSETS_3D } from '../utils/assets3d';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, bonus: number, method: string, utr: string) => void;
  language: Language;
  theme: ThemeConfig;
}

const PRESET_AMOUNTS = [300, 500, 1000, 2000, 5000, 10000];

export const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  onDeposit,
  language,
  theme,
}) => {
  if (!isOpen) return null;

  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi_fast' | 'paytm' | 'gpay'>('upi_fast');
  const [step, setStep] = useState<'select' | 'pay'>('select');
  const [utrInput, setUtrInput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const amountToPay = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const bonus = Math.floor(amountToPay * 0.1); // 10% instant deposit bonus
  const totalCredited = amountToPay + bonus;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText('payvip998@okhdfcbank');
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleProceed = () => {
    if (amountToPay < 100) return;
    sound.playClick();
    setStep('pay');
  };

  const handleConfirmPayment = () => {
    const finalUtr = utrInput.trim() || `UTR${Date.now().toString().slice(-8)}`;
    sound.playWin();
    onDeposit(amountToPay, bonus, paymentMethod.toUpperCase(), finalUtr);
    onClose();
  };

  return (
    <div
      id="recharge-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl border shadow-2xl relative overflow-hidden transition-all animate-slideUp max-h-[92vh] flex flex-col ${
          isLight
            ? 'bg-white border-slate-300 text-slate-900'
            : 'bg-zinc-950 border-white/20 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">
                {isHi ? 'वॉलेट रिचार्ज (+10% बोनस)' : 'Instant Recharge (+10% Bonus)'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isHi ? 'यूपीआई / पेटीएम / जीपे तुरंत बैलेंस लोड' : 'Instant UPI / QR Code deposit'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {step === 'select' ? (
            <>
              {/* 3D Visual Asset Card */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-400/30 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-500">
                    <Sparkles className="w-4 h-4" />
                    <span>{isHi ? 'वीआईपी 10% वेलकम बोनस' : 'VIP 10% Deposit Bonus'}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {isHi ? 'हर रिचार्ज पर अतिरिक्त 10% फ्री क्रेडिट मिलेगा!' : 'Get 10% additional bonus chips credited instantly!'}
                  </p>
                </div>
                <img
                  src={ASSETS_3D.vipGoldChips}
                  alt="3D Gold Chips"
                  className="w-14 h-14 rounded-xl object-cover border border-amber-400/50 shadow-md shrink-0"
                />
              </div>

              {/* Amount Presets */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-400">
                  {isHi ? 'राशि चुनें (Select Amount)' : 'Choose Amount'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = selectedAmount === amt && !customAmount;
                    return (
                      <button
                        key={amt}
                        onClick={() => {
                          sound.playClick();
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2.5 rounded-xl font-mono font-black text-sm border transition-all active:scale-95 flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-md ring-2 ring-amber-400'
                            : isLight
                            ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                            : 'bg-zinc-900 text-zinc-200 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <span>₹{amt}</span>
                        <span className="text-[9px] text-emerald-600 sm:text-emerald-400 font-sans font-bold">
                          +₹{Math.floor(amt * 0.1)} बोनस
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-zinc-400">
                  {isHi ? 'या अन्य राशि दर्ज करें' : 'Or enter custom amount'}
                </span>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-black text-amber-500 text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Min ₹100 - Max ₹50,000"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Recharge Amount:</span>
                  <span className="text-white font-bold">{formatCurrency(amountToPay)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>10% Extra Bonus:</span>
                  <span className="font-bold">+{formatCurrency(bonus)}</span>
                </div>
                <div className="pt-1.5 border-t border-white/10 flex justify-between text-amber-400 font-black text-sm">
                  <span>Total Wallet Credit:</span>
                  <span>{formatCurrency(totalCredited)}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceed}
                disabled={amountToPay < 100}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-black text-sm shadow-[0_6px_0_#78350f] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isHi ? 'भुगतान आगे बढ़ाएं' : 'Proceed to Pay'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </>
          ) : (
            <>
              {/* Payment Step */}
              <div className="text-center space-y-3">
                <div className="w-40 h-40 mx-auto rounded-2xl bg-white p-3 shadow-xl flex items-center justify-center border-2 border-amber-400">
                  <div className="text-center text-zinc-950">
                    <QrCode className="w-24 h-24 mx-auto text-zinc-900" />
                    <span className="text-[10px] font-black font-mono">UPI QR CODE SCAN</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between">
                  <div className="text-left font-mono">
                    <div className="text-[10px] text-zinc-500">OFFICIAL UPI ID:</div>
                    <div className="text-xs font-bold text-amber-400">payvip998@okhdfcbank</div>
                  </div>
                  <button
                    onClick={handleCopyUpi}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-1 active:scale-95 shadow"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'COPIED!' : 'COPY'}</span>
                  </button>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-zinc-400">
                    {isHi ? '12 अंकों का UTR / Transaction No. दर्ज करें:' : 'Enter 12-digit UTR No:'}
                  </label>
                  <input
                    type="text"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value)}
                    placeholder="e.g. 425983719201"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  onClick={handleConfirmPayment}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-sm shadow-[0_6px_0_#065f46] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  <span>{isHi ? 'भुगतान पूर्ण (Confirm Deposit)' : 'Submit & Add Money'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
