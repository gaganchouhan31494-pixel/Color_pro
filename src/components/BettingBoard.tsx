import React, { useState } from 'react';
import { Lock, Sparkles, Flame } from 'lucide-react';
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
  const [filterColor, setFilterColor] = useState<'all' | 'green' | 'red' | 'violet'>('all');

  const handleSelect = (targetType: BetTargetType, payload: { color?: ColorType; number?: number; size?: SizeType }) => {
    if (isLocked) return;
    sound.playClick();
    onOpenBetModal(targetType, payload);
  };

  return (
    <div className="relative bg-zinc-950/95 border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl">
      {/* Locked Overlay for final 5 seconds */}
      {isLocked && (
        <div className="absolute inset-0 z-30 bg-black/92 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 animate-fadeIn text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center mb-3 shadow-xl shadow-rose-500/30 animate-pulse">
            <Lock className="w-8 h-8 text-rose-400 animate-bounce" />
          </div>
          <div className="text-4xl sm:text-5xl font-black text-rose-400 font-mono mb-1 tracking-tight animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.7)]">
            00:0{remainingSeconds}
          </div>
          <h3 className="text-base font-black text-white mb-0.5 uppercase tracking-wide">
            {t.bettingClosed}
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs font-medium">
            {t.locked}
          </p>
        </div>
      )}

      {/* SECTION 1: 3D ACTION BUTTONS FOR MAIN COLORS (GREEN, VIOLET, RED) */}
      <div className="mb-5 sm:mb-6">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hi' ? '3D कलर बेटिंग' : '3D Color Selection'}</span>
          </span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
            {language === 'hi' ? 'टच करके 3D दबाएं' : 'Tactile 3D Press'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {/* 3D Green Button */}
          <button
            id="btn-join-green"
            onClick={() => handleSelect('color', { color: 'green' })}
            disabled={isLocked}
            className="group relative select-none rounded-2xl bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 text-white p-3.5 sm:p-4 shadow-[0_8px_0_#064e3b] hover:shadow-[0_10px_0_#064e3b] active:shadow-[0_2px_0_#064e3b] active:translate-y-[6px] transition-all duration-100 ease-out border-t-2 border-emerald-300/60 border-x border-emerald-500/50 flex flex-col items-center justify-center text-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Top glass specular highlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-2xl" />

            <div className="relative z-10 text-[11px] font-black uppercase tracking-wider text-emerald-100 drop-shadow-sm mb-0.5">
              {language === 'hi' ? 'हरा (Green)' : 'Green'}
            </div>
            <div className="relative z-10 text-base sm:text-lg font-black tracking-tight drop-shadow-md">
              {t.joinGreen}
            </div>
            <span className="relative z-10 mt-1.5 inline-block text-[10px] font-black bg-emerald-950/90 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/40 shadow-inner">
              2.0x / 1.5x
            </span>
          </button>

          {/* 3D Violet Button */}
          <button
            id="btn-join-violet"
            onClick={() => handleSelect('color', { color: 'violet' })}
            disabled={isLocked}
            className="group relative select-none rounded-2xl bg-gradient-to-b from-purple-500 via-purple-600 to-indigo-800 text-white p-3.5 sm:p-4 shadow-[0_8px_0_#3b0764] hover:shadow-[0_10px_0_#3b0764] active:shadow-[0_2px_0_#3b0764] active:translate-y-[6px] transition-all duration-100 ease-out border-t-2 border-purple-300/60 border-x border-purple-500/50 flex flex-col items-center justify-center text-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Top glass specular highlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-2xl" />

            <div className="relative z-10 text-[11px] font-black uppercase tracking-wider text-purple-100 drop-shadow-sm mb-0.5">
              {language === 'hi' ? 'बैंगनी (Violet)' : 'Violet'}
            </div>
            <div className="relative z-10 text-base sm:text-lg font-black tracking-tight flex items-center gap-1 drop-shadow-md">
              <span>{t.joinViolet}</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <span className="relative z-10 mt-1.5 inline-block text-[10px] font-black bg-purple-950/90 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/50 shadow-inner">
              4.5x Bumper
            </span>
          </button>

          {/* 3D Red Button */}
          <button
            id="btn-join-red"
            onClick={() => handleSelect('color', { color: 'red' })}
            disabled={isLocked}
            className="group relative select-none rounded-2xl bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700 text-white p-3.5 sm:p-4 shadow-[0_8px_0_#881337] hover:shadow-[0_10px_0_#881337] active:shadow-[0_2px_0_#881337] active:translate-y-[6px] transition-all duration-100 ease-out border-t-2 border-rose-300/60 border-x border-rose-500/50 flex flex-col items-center justify-center text-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Top glass specular highlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-2xl" />

            <div className="relative z-10 text-[11px] font-black uppercase tracking-wider text-rose-100 drop-shadow-sm mb-0.5">
              {language === 'hi' ? 'लाल (Red)' : 'Red'}
            </div>
            <div className="relative z-10 text-base sm:text-lg font-black tracking-tight drop-shadow-md">
              {t.joinRed}
            </div>
            <span className="relative z-10 mt-1.5 inline-block text-[10px] font-black bg-rose-950/90 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-400/40 shadow-inner">
              2.0x / 1.5x
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 2: 3D NUMBER BUTTONS (0 - 9) - 9x PAYOUT WITH REAL COLOR PILLS */}
      <div className="mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-300">
              {t.selectNumber}
            </span>
            <span className="text-xs font-black text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
              9.0x {t.payout}
            </span>
          </div>

          {/* Quick Color Filter Tabs (helps user see Green vs Red vs Dual numbers) */}
          <div className="flex items-center gap-1 bg-black/50 border border-white/10 p-0.5 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFilterColor('all')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                filterColor === 'all' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All (0-9)
            </button>
            <button
              onClick={() => setFilterColor('green')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                filterColor === 'green' ? 'bg-emerald-500 text-white shadow-sm' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Green (1,3,7,9)
            </button>
            <button
              onClick={() => setFilterColor('red')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                filterColor === 'red' ? 'bg-rose-500 text-white shadow-sm' : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
              Red (2,4,6,8)
            </button>
            <button
              onClick={() => setFilterColor('violet')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                filterColor === 'violet' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-400 hover:text-purple-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
              0, 5
            </button>
          </div>
        </div>

        {/* 3D Number Buttons Grid: 10 true 3D arcade buttons */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const isDualRed = num === 0;
            const isDualGreen = num === 5;
            const isGreen = [1, 3, 7, 9].includes(num);
            const isRed = [2, 4, 6, 8].includes(num);

            // Filter dimming
            const isDimmed =
              (filterColor === 'green' && !isGreen) ||
              (filterColor === 'red' && !isRed) ||
              (filterColor === 'violet' && !isDualRed && !isDualGreen);

            // Styling variables for 3D extrusion
            let buttonBg = 'bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700';
            let shadow3D = 'shadow-[0_6px_0_#881337] hover:shadow-[0_8px_0_#881337] active:shadow-[0_1px_0_#881337]';
            let borderHighlight = 'border-t-2 border-rose-300/70 border-x border-rose-500/50';
            let colorLabel = 'Red';
            let colorDotBg = 'bg-rose-400';

            if (isGreen) {
              buttonBg = 'bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700';
              shadow3D = 'shadow-[0_6px_0_#064e3b] hover:shadow-[0_8px_0_#064e3b] active:shadow-[0_1px_0_#064e3b]';
              borderHighlight = 'border-t-2 border-emerald-300/70 border-x border-emerald-500/50';
              colorLabel = 'Green';
              colorDotBg = 'bg-emerald-400';
            } else if (isDualRed) {
              buttonBg = 'bg-slate-900';
              shadow3D = 'shadow-[0_6px_0_#4c0519] hover:shadow-[0_8px_0_#4c0519] active:shadow-[0_1px_0_#4c0519]';
              borderHighlight = 'border-t-2 border-rose-300/60 border-x border-purple-500/40';
              colorLabel = 'Red+V';
              colorDotBg = 'bg-gradient-to-r from-rose-500 to-purple-500';
            } else if (isDualGreen) {
              buttonBg = 'bg-slate-900';
              shadow3D = 'shadow-[0_6px_0_#064e3b] hover:shadow-[0_8px_0_#064e3b] active:shadow-[0_1px_0_#064e3b]';
              borderHighlight = 'border-t-2 border-emerald-300/60 border-x border-purple-500/40';
              colorLabel = 'Grn+V';
              colorDotBg = 'bg-gradient-to-r from-emerald-500 to-purple-500';
            }

            return (
              <button
                key={num}
                id={`btn-number-${num}`}
                onClick={() => handleSelect('number', { number: num })}
                disabled={isLocked}
                className={`relative select-none h-16 rounded-2xl flex flex-col items-center justify-between p-1.5 transition-all duration-100 ease-out active:translate-y-[5px] overflow-hidden group ${buttonBg} ${shadow3D} ${borderHighlight} ${
                  isDimmed ? 'opacity-30 grayscale-[60%]' : 'opacity-100'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {/* 3D Top Bevel Specular Sheen */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-xl z-20" />

                {/* Dual Split Background for #0 and #5 */}
                {isDualRed && (
                  <div className="absolute inset-0 flex z-0">
                    <div className="w-1/2 h-full bg-gradient-to-b from-rose-500 via-rose-600 to-rose-800 border-r border-white/25" />
                    <div className="w-1/2 h-full bg-gradient-to-b from-purple-500 via-purple-600 to-indigo-900" />
                  </div>
                )}
                {isDualGreen && (
                  <div className="absolute inset-0 flex z-0">
                    <div className="w-1/2 h-full bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-800 border-r border-white/25" />
                    <div className="w-1/2 h-full bg-gradient-to-b from-purple-500 via-purple-600 to-indigo-900" />
                  </div>
                )}

                {/* Top Badge: Color Gem / Label */}
                <div className="relative z-10 flex items-center gap-1 w-full justify-center">
                  <span className={`w-2 h-2 rounded-full ring-1 ring-white/50 ${colorDotBg}`} />
                  <span className="text-[9px] font-black uppercase text-white/90 drop-shadow-sm tracking-wider font-mono">
                    {colorLabel}
                  </span>
                </div>

                {/* Big 3D Bold Number */}
                <div className="relative z-10 text-2xl font-black font-mono text-white drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)] -my-1">
                  {num}
                </div>

                {/* Bottom Pill: Big / Small Indicator */}
                <div className="relative z-10">
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full shadow-inner ${
                    num >= 5
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      : 'bg-zinc-950/80 text-zinc-300 border border-white/20'
                  }`}>
                    {num >= 5 ? 'Big' : 'Small'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: 3D BIG & SMALL BUTTONS (2.0x Payout) */}
      <div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* 3D Big Button (5-9) */}
          <button
            id="btn-select-big"
            onClick={() => handleSelect('size', { size: 'big' })}
            disabled={isLocked}
            className="group relative select-none rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-zinc-950 p-3.5 sm:p-4 shadow-[0_8px_0_#78350f] hover:shadow-[0_10px_0_#78350f] active:shadow-[0_2px_0_#78350f] active:translate-y-[6px] transition-all duration-100 ease-out border-t-2 border-amber-200/80 border-x border-amber-500 flex items-center justify-between px-4 sm:px-5 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Top glass specular highlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-2xl" />

            <div className="text-left relative z-10">
              <div className="text-base sm:text-lg font-black tracking-tight text-zinc-950">
                {t.big} (5 - 9)
              </div>
              <div className="text-[11px] text-amber-950 font-extrabold">
                5, 6, 7, 8, 9
              </div>
            </div>
            <span className="relative z-10 text-xs font-black bg-zinc-950 text-amber-300 px-3 py-1 rounded-xl border border-amber-400/60 shadow-lg font-mono">
              2.0x
            </span>
          </button>

          {/* 3D Small Button (0-4) */}
          <button
            id="btn-select-small"
            onClick={() => handleSelect('size', { size: 'small' })}
            disabled={isLocked}
            className="group relative select-none rounded-2xl bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 text-white p-3.5 sm:p-4 shadow-[0_8px_0_#18181b] hover:shadow-[0_10px_0_#18181b] active:shadow-[0_2px_0_#18181b] active:translate-y-[6px] transition-all duration-100 ease-out border-t-2 border-zinc-400/60 border-x border-zinc-700 flex items-center justify-between px-4 sm:px-5 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Top glass specular highlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-2xl" />

            <div className="text-left relative z-10">
              <div className="text-base sm:text-lg font-black tracking-tight text-white drop-shadow-sm">
                {t.small} (0 - 4)
              </div>
              <div className="text-[11px] text-zinc-400 font-bold">
                0, 1, 2, 3, 4
              </div>
            </div>
            <span className="relative z-10 text-xs font-black bg-white text-zinc-950 px-3 py-1 rounded-xl border border-white/40 shadow-lg font-mono">
              2.0x
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
