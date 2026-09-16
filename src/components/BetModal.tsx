import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  Trophy,
  AlertCircle,
  ShieldCheck,
  Coins,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { BetTargetType, Language, ThemeConfig } from '../types';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: BetTargetType;
  targetValue: string;
  multiplier: number;
  userBalance: number;
  onConfirmBet: (amount: number, mult: number, total: number) => void;
  onOpenRecharge: () => void;
  language: Language;
  theme: ThemeConfig;
}

const BASE_CHIPS = [10, 50, 100, 500, 1000, 5000];
const MULTIPLIERS = [1, 5, 10, 20, 50, 100];

export const BetModal: React.FC<BetModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetValue,
  multiplier,
  userBalance,
  onConfirmBet,
  onOpenRecharge,
  language,
  theme,
}) => {
  if (!isOpen) return null;

  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  const [baseAmount, setBaseAmount] = useState<number>(10);
  const [qtyMultiplier, setQtyMultiplier] = useState<number>(1);
  const [agreed, setAgreed] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const totalAmount = baseAmount * qtyMultiplier;
  const isInsufficient = totalAmount > userBalance;
  const estimatedPayout = Math.floor(totalAmount * multiplier);

  // Derive target label & badge colors
  let targetTitle = targetValue.toUpperCase();
  let badgeColor = 'bg-emerald-500 text-white shadow-emerald-500/30';
  let buttonGradient = 'from-emerald-400 via-emerald-500 to-emerald-700';
  let buttonShadow = '#065f46';

  if (targetType === 'color') {
    if (targetValue === 'violet') {
      targetTitle = isHi ? 'बैंगनी (VIOLET)' : 'VIOLET';
      badgeColor = 'bg-purple-600 text-white shadow-purple-600/30';
      buttonGradient = 'from-purple-500 via-purple-600 to-indigo-800';
      buttonShadow = '#4c1d95';
    } else if (targetValue === 'red') {
      targetTitle = isHi ? 'लाल (RED)' : 'RED';
      badgeColor = 'bg-rose-500 text-white shadow-rose-500/30';
      buttonGradient = 'from-rose-500 via-rose-600 to-rose-800';
      buttonShadow = '#881337';
    } else {
      targetTitle = isHi ? 'हरा (GREEN)' : 'GREEN';
    }
  } else if (targetType === 'number') {
    targetTitle = `${isHi ? 'संख्या' : 'NUMBER'} ${targetValue}`;
    badgeColor = 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 shadow-amber-500/30';
    buttonGradient = 'from-amber-400 via-amber-500 to-amber-600';
    buttonShadow = '#78350f';
  } else if (targetType === 'size') {
    targetTitle = targetValue === 'big' ? (isHi ? 'बड़ा (BIG 5-9)' : 'BIG (5-9)') : (isHi ? 'छोटा (SMALL 0-4)' : 'SMALL (0-4)');
    badgeColor = targetValue === 'big' ? 'bg-amber-500 text-zinc-950' : 'bg-cyan-500 text-white';
    buttonGradient = targetValue === 'big' ? 'from-amber-400 via-amber-500 to-amber-600' : 'from-cyan-400 via-cyan-500 to-blue-600';
    buttonShadow = targetValue === 'big' ? '#78350f' : '#1e3a8a';
  }

  const handleChipClick = (amount: number) => {
    sound.playChip();
    setBaseAmount(amount);
  };

  const handleMultiplierClick = (m: number) => {
    sound.playClick();
    setQtyMultiplier(m);
  };

  const handleStep = (delta: number) => {
    sound.playClick();
    setQtyMultiplier((prev) => Math.max(1, prev + delta));
  };

  const handleMax = () => {
    sound.playClick();
    if (userBalance >= baseAmount) {
      const maxPossible = Math.max(1, Math.floor(userBalance / baseAmount));
      setQtyMultiplier(maxPossible);
    }
  };

  const handleSubmitBet = () => {
    if (isInsufficient) {
      sound.playClick();
      onOpenRecharge();
      return;
    }
    if (!agreed) return;

    setIsSubmitting(true);
    sound.playBet();

    setTimeout(() => {
      onConfirmBet(baseAmount, qtyMultiplier, totalAmount);
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <div
      id="bet-placement-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="bet-modal-box"
        className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl border shadow-2xl relative overflow-hidden transition-all animate-slideUp max-h-[92vh] flex flex-col ${
          isLight
            ? 'bg-white border-slate-300 text-slate-900'
            : 'bg-zinc-950 border-white/20 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono shadow-md ${badgeColor}`}>
              {targetTitle}
            </span>
            <span className="text-xs font-bold text-amber-500 font-mono bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30">
              {multiplier}X {isHi ? 'ऑड्स' : 'Payout'}
            </span>
          </div>
          <button
            id="btn-close-bet-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* 1. Fast Chip Selector (10, 50, 100, 500, 1000, 5000) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
              <span>{isHi ? 'मूल दांव राशि चुनें (Contract Money)' : 'Select Base Chip'}</span>
              <span className="font-mono text-amber-500 font-black">₹{baseAmount}</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {BASE_CHIPS.map((chip) => {
                const isSelected = baseAmount === chip;
                return (
                  <button
                    key={chip}
                    id={`chip-btn-${chip}`}
                    onClick={() => handleChipClick(chip)}
                    className={`py-2 px-1 rounded-xl text-xs font-black font-mono transition-all active:scale-90 border flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-md shadow-amber-400/30 scale-105 ring-2 ring-amber-400'
                        : isLight
                        ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                        : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-white/30 hover:bg-zinc-800'
                    }`}
                  >
                    <span>₹{chip >= 1000 ? `${chip / 1000}k` : chip}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Multiplier Stepper (- / +) and Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
              <span>{isHi ? 'गुणांक (Multiplier / Quantity)' : 'Quantity Multiplier'}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleMax}
                  className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-500 border border-amber-400/30 text-[10px] font-mono font-black active:scale-95"
                >
                  MAX
                </button>
                <button
                  onClick={() => setQtyMultiplier(1)}
                  className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-mono font-bold active:scale-95"
                >
                  {isHi ? 'रीसेट' : 'RESET'}
                </button>
              </div>
            </div>

            {/* Stepper Bar */}
            <div className="flex items-center gap-2">
              <button
                id="btn-decrement-multiplier"
                onClick={() => handleStep(-1)}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black flex items-center justify-center active:scale-90 border border-white/10 shrink-0"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex-1 h-10 rounded-xl bg-zinc-900/90 border border-white/15 flex items-center justify-center font-mono font-black text-base text-amber-400">
                X{qtyMultiplier}
              </div>

              <button
                id="btn-increment-multiplier"
                onClick={() => handleStep(1)}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black flex items-center justify-center active:scale-90 border border-white/10 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Multiplier Pills (1, 5, 10, 20, 50, 100) */}
            <div className="grid grid-cols-6 gap-1.5 pt-1">
              {MULTIPLIERS.map((m) => {
                const isSelected = qtyMultiplier === m;
                return (
                  <button
                    key={m}
                    onClick={() => handleMultiplierClick(m)}
                    className={`py-1.5 rounded-lg text-[11px] font-mono font-black transition-all active:scale-95 border ${
                      isSelected
                        ? 'bg-white text-zinc-950 border-white shadow-sm'
                        : isLight
                        ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        : 'bg-zinc-900/60 text-zinc-400 border-white/10 hover:text-white'
                    }`}
                  >
                    X{m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Calculations Summary Card (Total Bet & Potential Payout) */}
          <div
            className={`p-3.5 rounded-2xl border space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/80 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">
                {isHi ? 'कुल दांव राशि (Total Bet)' : 'Total Bet Amount'}
              </span>
              <span className="font-mono font-black text-sm text-amber-500">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">
                {isHi ? 'उपलब्ध बैलेंस (Wallet Balance)' : 'Wallet Balance'}
              </span>
              <span
                className={`font-mono font-bold ${
                  isInsufficient ? 'text-rose-500' : isLight ? 'text-slate-800' : 'text-zinc-300'
                }`}
              >
                {formatCurrency(userBalance)}
              </span>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-emerald-400">
                  {isHi ? 'संभावित जीत राशि' : 'Potential Winnings'}
                </span>
              </div>
              <span className="font-mono font-black text-base text-emerald-400">
                +{formatCurrency(estimatedPayout)}
              </span>
            </div>
          </div>

          {/* Low Balance Warning */}
          {isInsufficient && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between gap-2 text-rose-300 text-xs animate-shake">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{isHi ? 'वॉलेट में बैलेंस कम है!' : 'Insufficient wallet balance!'}</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenRecharge();
                }}
                className="px-2.5 py-1 rounded-xl bg-rose-500 text-white font-black text-[11px] shadow hover:bg-rose-400 active:scale-95 whitespace-nowrap"
              >
                {isHi ? '+ रिचार्ज करें' : '+ Deposit'}
              </button>
            </div>
          )}

          {/* Agreement Checkbox */}
          <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-900 border-white/20 cursor-pointer"
            />
            <span>{isHi ? 'मैं ट्रेडिंग व गेमिंग नियमों से सहमत हूँ' : 'I agree to the Presale & Color Trading Rules'}</span>
          </label>
        </div>

        {/* 4. THE HIGH-IMPACT TACTILE 3D BET PLACING BUTTON (इम्प्रूव्ड बैट बटन) */}
        <div className="p-4 sm:p-5 pt-2 border-t border-white/10 shrink-0 bg-black/20">
          <button
            id="btn-confirm-place-bet"
            onClick={handleSubmitBet}
            disabled={isSubmitting || !agreed}
            style={{
              boxShadow: isInsufficient
                ? '0 6px 0 #991b1b, 0 10px 25px rgba(239,68,68,0.4)'
                : `0 6px 0 ${buttonShadow}, 0 12px 25px rgba(0,0,0,0.5)`,
            }}
            className={`w-full py-3.5 sm:py-4 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-between text-white cursor-pointer select-none transition-all active:translate-y-1.5 active:shadow-none relative overflow-hidden group ${
              isInsufficient
                ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700'
                : `bg-gradient-to-r ${buttonGradient}`
            }`}
          >
            {/* Shimmer Light Sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            {/* Left: Action label */}
            <div className="flex items-center gap-2 relative z-10">
              <Zap className="w-5 h-5 fill-white" />
              <span>
                {isInsufficient
                  ? isHi ? 'रिचार्ज करके बैट लगाएं' : 'Deposit & Bet'
                  : isHi ? 'बैट लगाएं (Confirm Bet)' : 'Confirm Bet'}
              </span>
            </div>

            {/* Right: Amount pill with arrow */}
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-xl border border-white/20 relative z-10 font-mono text-sm sm:text-base font-black">
              <span>{formatCurrency(totalAmount)}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
