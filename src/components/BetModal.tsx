import React, { useState } from 'react';
import { X, Check, Minus, Plus, AlertCircle, Coins } from 'lucide-react';
import { BetTargetType, ColorType, Language, SizeType, UserWallet } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: BetTargetType;
  selectedColor?: ColorType;
  selectedNumber?: number;
  selectedSize?: SizeType;
  wallet: UserWallet;
  language: Language;
  onConfirmBet: (amount: number, multiplier: number) => void;
}

export const BetModal: React.FC<BetModalProps> = ({
  isOpen,
  onClose,
  targetType,
  selectedColor,
  selectedNumber,
  selectedSize,
  wallet,
  language,
  onConfirmBet,
}) => {
  const t = translations[language];

  const contractOptions = [10, 50, 100, 500, 1000, 5000];
  const multiplierOptions = [1, 2, 5, 10, 20, 50, 100];

  const [baseAmount, setBaseAmount] = useState<number>(10);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalBet = baseAmount * multiplier;
  const hasEnoughFunds = wallet.balance >= totalBet;

  const handleBaseChange = (amt: number) => {
    sound.playChip();
    setBaseAmount(amt);
    setErrorMsg(null);
  };

  const handleMultiplierChange = (m: number) => {
    sound.playClick();
    setMultiplier(m);
    setErrorMsg(null);
  };

  const handleStepMultiplier = (delta: number) => {
    sound.playClick();
    setMultiplier((prev) => Math.max(1, prev + delta));
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasEnoughFunds) {
      sound.playLoss();
      setErrorMsg(t.insufficientFunds);
      return;
    }
    sound.playChip();
    onConfirmBet(baseAmount, multiplier);
    onClose();
  };

  // Label and styling based on target
  let headerTitle = '';
  let headerBg = 'bg-slate-800';
  let badgeText = '';

  if (targetType === 'color' && selectedColor) {
    if (selectedColor === 'green') {
      headerTitle = language === 'hi' ? 'हरा (Green)' : 'Join Green';
      headerBg = 'bg-gradient-to-r from-emerald-600 to-emerald-700';
      badgeText = '2.0x / 1.5x';
    } else if (selectedColor === 'red') {
      headerTitle = language === 'hi' ? 'लाल (Red)' : 'Join Red';
      headerBg = 'bg-gradient-to-r from-rose-600 to-rose-700';
      badgeText = '2.0x / 1.5x';
    } else {
      headerTitle = language === 'hi' ? 'बैंगनी (Violet)' : 'Join Violet';
      headerBg = 'bg-gradient-to-r from-purple-600 to-violet-700';
      badgeText = '4.5x Bumper';
    }
  } else if (targetType === 'number' && selectedNumber !== undefined) {
    headerTitle = `${language === 'hi' ? 'नंबर' : 'Number'} ${selectedNumber}`;
    headerBg = 'bg-gradient-to-r from-indigo-600 to-violet-700';
    badgeText = '9.0x Payout';
  } else if (targetType === 'size' && selectedSize) {
    if (selectedSize === 'big') {
      headerTitle = `${language === 'hi' ? 'बड़ा' : 'Big'} (5-9)`;
      headerBg = 'bg-gradient-to-r from-amber-600 to-orange-600';
      badgeText = '2.0x Payout';
    } else {
      headerTitle = `${language === 'hi' ? 'छोटा' : 'Small'} (0-4)`;
      headerBg = 'bg-gradient-to-r from-cyan-600 to-blue-600';
      badgeText = '2.0x Payout';
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Modal Top Banner */}
        <div className={`${headerBg} p-4 text-white flex items-center justify-between`}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {t.betDetails}
            </div>
            <div className="text-xl font-black flex items-center gap-2">
              <span>{headerTitle}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/30 border border-white/20">
                {badgeText}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {/* Wallet balance display */}
          <div className="flex items-center justify-between bg-slate-800/80 rounded-xl px-3.5 py-2.5 border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{t.walletBalance}:</span>
            </span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {formatCurrency(wallet.balance)}
            </span>
          </div>

          {/* Contract Money selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {t.contractMoney} (₹)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {contractOptions.map((amt) => {
                const isSelected = baseAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleBaseChange(amt)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 scale-[1.02]'
                        : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    ₹{amt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multipliers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t.multiplier}
              </label>
              {/* Stepper buttons */}
              <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => handleStepMultiplier(-1)}
                  disabled={multiplier <= 1}
                  className="w-7 h-7 rounded bg-slate-700 text-slate-200 flex items-center justify-center hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-white">
                  {multiplier}
                </span>
                <button
                  type="button"
                  onClick={() => handleStepMultiplier(1)}
                  className="w-7 h-7 rounded bg-slate-700 text-slate-200 flex items-center justify-center hover:bg-slate-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {multiplierOptions.map((m) => {
                const isSelected = multiplier === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMultiplierChange(m)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    x{m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total Contract Money calculation */}
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">
                {t.totalContract}:
              </span>
              <span className="font-mono text-2xl font-black text-amber-400">
                {formatCurrency(totalBet)}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>₹{baseAmount} × {multiplier}</span>
              <span>
                {hasEnoughFunds ? (
                  <span className="text-emerald-400 font-medium">✓ Sufficient balance</span>
                ) : (
                  <span className="text-rose-400 font-medium">✕ Insufficient funds</span>
                )}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-rose-500/20 border border-rose-500/40 rounded-xl p-3 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id="btn-bet-cancel"
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 text-sm font-semibold transition-colors"
            >
              {t.cancel}
            </button>
            <button
              id="btn-bet-confirm"
              type="submit"
              disabled={!hasEnoughFunds}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{t.confirm}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
