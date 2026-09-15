import React from 'react';
import { X, PlusCircle, RotateCcw, ShieldAlert, Coins } from 'lucide-react';
import { Language, UserWallet } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  language: Language;
  onAddFunds: (amount: number) => void;
  onResetWallet: () => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  wallet,
  language,
  onAddFunds,
  onResetWallet,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  const handleAdd = (amt: number) => {
    sound.playChip();
    onAddFunds(amt);
    onClose();
  };

  const handleReset = () => {
    sound.playClick();
    onResetWallet();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">{t.recharge}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-slate-700/80 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Current Balance */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-xs text-slate-400 font-medium">
              {t.walletBalance}
            </span>
            <div className="font-mono text-2xl font-black text-amber-400 mt-0.5">
              {formatCurrency(wallet.balance)}
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center">
            {language === 'hi'
              ? 'यह एक सुरक्षित डेमो वॉलेट है। आप जब चाहें फ्री में फंड जोड़ सकते हैं!'
              : 'This is a free simulation demo wallet. Add funds or reset anytime!'}
          </div>

          {/* Quick Add Options */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleAdd(1000)}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-400 font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ ₹1,000</span>
            </button>

            <button
              onClick={() => handleAdd(5000)}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-400 font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ ₹5,000</span>
            </button>

            <button
              onClick={() => handleAdd(10000)}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-400 font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm col-span-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ ₹10,000 (Popular)</span>
            </button>
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={handleReset}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetBalance}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
