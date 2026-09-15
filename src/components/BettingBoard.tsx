import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { BetTargetType, ColorType, Language, SizeType } from '../types';
import { translations } from '../utils/translations';
import { sound } from '../utils/sound';

interface BettingBoardProps {
  isLocked: boolean;
  remainingSeconds: number;
  language: Language;
  onOpenBetModal: (targetType: BetTargetType, payload: { color?: ColorType; number?: number; size?: SizeType }) => void;
}

export const BettingBoard: React.FC<BettingBoardProps> = ({
  isLocked,
  remainingSeconds,
  language,
  onOpenBetModal,
}) => {
  const t = translations[language];

  const handleSelect = (targetType: BetTargetType, payload: { color?: ColorType; number?: number; size?: SizeType }) => {
    if (isLocked) return;
    sound.playClick();
    onOpenBetModal(targetType, payload);
  };

  return (
    <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
      {/* Locked Overlay for final 5 seconds */}
      {isLocked && (
        <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 animate-fadeIn text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-3 shadow-lg shadow-rose-500/20">
            <Lock className="w-8 h-8 text-rose-400 animate-bounce" />
          </div>
          <div className="text-4xl font-black text-rose-400 font-mono mb-1 tracking-tight animate-pulse">
            00:0{remainingSeconds}
          </div>
          <h3 className="text-base font-bold text-white mb-0.5">
            {t.bettingClosed}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs">
            {t.locked}
          </p>
        </div>
      )}

      {/* Row 1: The Three Main Color Action Buttons */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-4 sm:mb-5">
        {/* Join Green */}
        <button
          id="btn-join-green"
          onClick={() => handleSelect('color', { color: 'green' })}
          disabled={isLocked}
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white rounded-2xl p-3 sm:p-4 shadow-lg shadow-emerald-600/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-400/30 flex flex-col items-center justify-center text-center"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-0.5">
            {language === 'hi' ? 'हरा' : 'Green'}
          </div>
          <div className="text-sm sm:text-base font-black tracking-tight">
            {t.joinGreen}
          </div>
          <span className="mt-1.5 inline-block text-[10px] font-bold bg-black/30 backdrop-blur-xs text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-300/30">
            2.0x / 1.5x
          </span>
        </button>

        {/* Join Violet */}
        <button
          id="btn-join-violet"
          onClick={() => handleSelect('color', { color: 'violet' })}
          disabled={isLocked}
          className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-violet-800 hover:from-purple-500 hover:to-violet-700 text-white rounded-2xl p-3 sm:p-4 shadow-lg shadow-purple-600/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30 flex flex-col items-center justify-center text-center"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-100 mb-0.5">
            {language === 'hi' ? 'बैंगनी' : 'Violet'}
          </div>
          <div className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1">
            <span>{t.joinViolet}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          </div>
          <span className="mt-1.5 inline-block text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40">
            4.5x Bumper
          </span>
        </button>

        {/* Join Red */}
        <button
          id="btn-join-red"
          onClick={() => handleSelect('color', { color: 'red' })}
          disabled={isLocked}
          className="group relative overflow-hidden bg-gradient-to-br from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white rounded-2xl p-3 sm:p-4 shadow-lg shadow-rose-600/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-rose-400/30 flex flex-col items-center justify-center text-center"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-100 mb-0.5">
            {language === 'hi' ? 'लाल' : 'Red'}
          </div>
          <div className="text-sm sm:text-base font-black tracking-tight">
            {t.joinRed}
          </div>
          <span className="mt-1.5 inline-block text-[10px] font-bold bg-black/30 backdrop-blur-xs text-rose-200 px-2 py-0.5 rounded-full border border-rose-300/30">
            2.0x / 1.5x
          </span>
        </button>
      </div>

      {/* Row 2: Number Grid (0 to 9) - 9x Payout */}
      <div className="mb-4 sm:mb-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <span>{t.selectNumber}</span>
            <span className="text-amber-400 text-[11px] font-bold">(0 - 9)</span>
          </span>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
            9.0x {t.payout}
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const isDualRed = num === 0;
            const isDualGreen = num === 5;
            const isGreen = [1, 3, 7, 9].includes(num);

            let bgClass = 'bg-slate-800 text-white hover:bg-slate-700';
            if (isGreen) {
              bgClass = 'bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-emerald-900/30';
            } else if (!isDualRed && !isDualGreen) {
              bgClass = 'bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-900/30';
            }

            return (
              <button
                key={num}
                id={`btn-number-${num}`}
                onClick={() => handleSelect('number', { number: num })}
                disabled={isLocked}
                className={`relative h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-xl transition-all transform active:scale-90 shadow-md border border-white/10 ${bgClass} overflow-hidden disabled:opacity-50`}
              >
                {/* Custom dual split colors for 0 (Red+Violet) and 5 (Green+Violet) */}
                {isDualRed && (
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 50% to-purple-600 50% opacity-95" />
                )}
                {isDualGreen && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 50% to-purple-600 50% opacity-95" />
                )}
                <span className="relative z-10 text-white drop-shadow-md">
                  {num}
                </span>
                <span className="relative z-10 text-[9px] font-sans font-semibold text-white/80 leading-none">
                  {num >= 5 ? 'Big' : 'Small'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Big / Small options */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Big Button (5-9) */}
        <button
          id="btn-select-big"
          onClick={() => handleSelect('size', { size: 'big' })}
          disabled={isLocked}
          className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl p-3.5 shadow-lg shadow-orange-700/20 border border-amber-400/30 flex items-center justify-between px-4 transition-all active:scale-95 disabled:opacity-50"
        >
          <div className="text-left">
            <div className="text-sm sm:text-base font-black tracking-tight">
              {t.big} (5 - 9)
            </div>
            <div className="text-[11px] text-amber-200 font-medium">
              5, 6, 7, 8, 9
            </div>
          </div>
          <span className="text-xs font-black bg-black/30 backdrop-blur-xs text-amber-200 px-2 py-1 rounded-lg border border-amber-300/30">
            2.0x
          </span>
        </button>

        {/* Small Button (0-4) */}
        <button
          id="btn-select-small"
          onClick={() => handleSelect('size', { size: 'small' })}
          disabled={isLocked}
          className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl p-3.5 shadow-lg shadow-blue-700/20 border border-cyan-400/30 flex items-center justify-between px-4 transition-all active:scale-95 disabled:opacity-50"
        >
          <div className="text-left">
            <div className="text-sm sm:text-base font-black tracking-tight">
              {t.small} (0 - 4)
            </div>
            <div className="text-[11px] text-cyan-200 font-medium">
              0, 1, 2, 3, 4
            </div>
          </div>
          <span className="text-xs font-black bg-black/30 backdrop-blur-xs text-cyan-200 px-2 py-1 rounded-lg border border-cyan-300/30">
            2.0x
          </span>
        </button>
      </div>
    </div>
  );
};
