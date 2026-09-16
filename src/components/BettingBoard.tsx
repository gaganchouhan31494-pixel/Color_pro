import React from 'react';
import { Sparkles, Trophy, Flame, ChevronRight } from 'lucide-react';
import { BetColor, BetTargetType, Language, ThemeConfig } from '../types';
import { sound } from '../utils/sound';

interface BettingBoardProps {
  onSelectBet: (type: BetTargetType, value: string, multiplier: number) => void;
  disabled?: boolean;
  language: Language;
  theme: ThemeConfig;
  userBalance: number;
}

export const BettingBoard: React.FC<BettingBoardProps> = ({
  onSelectBet,
  disabled = false,
  language,
  theme,
  userBalance,
}) => {
  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  const handleColorClick = (color: BetColor, mult: number) => {
    if (disabled) return;
    sound.playChip();
    onSelectBet('color', color, mult);
  };

  const handleNumberClick = (num: number) => {
    if (disabled) return;
    sound.playChip();
    onSelectBet('number', String(num), 9);
  };

  const handleSizeClick = (size: 'big' | 'small') => {
    if (disabled) return;
    sound.playChip();
    onSelectBet('size', size, 2);
  };

  return (
    <div
      id="betting-board-container"
      className={`rounded-3xl p-4 sm:p-5 border shadow-2xl transition-all relative overflow-hidden ${
        isLight
          ? 'bg-white border-slate-300 shadow-slate-200/50'
          : 'bg-zinc-950/90 border-white/15'
      }`}
    >
      {/* Disabled Overlay during countdown freeze (last 5s) */}
      {disabled && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 rounded-3xl animate-fadeIn">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 font-mono font-black text-sm sm:text-base flex items-center gap-2 animate-pulse shadow-lg">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>{isHi ? 'राउंड लॉक है • परिणाम आ रहा है...' : 'Round Locked • Revealing Result...'}</span>
          </div>
        </div>
      )}

      {/* Header bar with odds explanation */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className={`text-xs sm:text-sm font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {isHi ? 'लाइव बैटिंग बोर्ड (Live Betting Board)' : 'Live Betting Board'}
          </span>
        </div>
        <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-500 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
          {isHi ? 'अधिकतम 9X मुनाफा' : 'Up to 9X Payout'}
        </span>
      </div>

      {/* 1. PRIMARY COLOR BUTTONS (Green 2X, Violet 4.5X, Red 2X) with 3D tactile depth */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 mb-4">
        {/* GREEN (2X) */}
        <button
          id="btn-bet-green"
          onClick={() => handleColorClick('green', 2)}
          disabled={disabled}
          className="group relative h-16 sm:h-20 rounded-2xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-700 p-0.5 shadow-[0_6px_0_#065f46,0_12px_20px_rgba(16,185,129,0.35)] active:translate-y-1.5 active:shadow-[0_1px_0_#065f46] transition-all cursor-pointer select-none overflow-hidden"
        >
          <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-emerald-500 to-emerald-600 flex flex-col items-center justify-center p-1 text-white relative">
            <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-full border border-white/20 mb-0.5">
              2.0X
            </span>
            <span className="text-xs sm:text-base font-black tracking-tight drop-shadow">
              {isHi ? 'हरा (Green)' : 'Join Green'}
            </span>
            <span className="text-[8px] sm:text-[9px] text-emerald-100/90 font-medium">
              1, 3, 7, 9, (5)
            </span>
          </div>
        </button>

        {/* VIOLET (4.5X) - Highlighted with VIP crown */}
        <button
          id="btn-bet-violet"
          onClick={() => handleColorClick('violet', 4.5)}
          disabled={disabled}
          className="group relative h-16 sm:h-20 rounded-2xl bg-gradient-to-b from-purple-400 via-purple-600 to-indigo-800 p-0.5 shadow-[0_6px_0_#4c1d95,0_12px_20px_rgba(147,51,234,0.35)] active:translate-y-1.5 active:shadow-[0_1px_0_#4c1d95] transition-all cursor-pointer select-none overflow-hidden"
        >
          <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-purple-600 to-indigo-700 flex flex-col items-center justify-center p-1 text-white relative">
            <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-full shadow-sm mb-0.5 font-bold">
              4.5X VIP
            </span>
            <span className="text-xs sm:text-base font-black tracking-tight drop-shadow">
              {isHi ? 'बैंगनी (Violet)' : 'Join Violet'}
            </span>
            <span className="text-[8px] sm:text-[9px] text-purple-200/90 font-medium">
              0, 5 (Mega Hit)
            </span>
          </div>
        </button>

        {/* RED (2X) */}
        <button
          id="btn-bet-red"
          onClick={() => handleColorClick('red', 2)}
          disabled={disabled}
          className="group relative h-16 sm:h-20 rounded-2xl bg-gradient-to-b from-rose-400 via-rose-500 to-rose-700 p-0.5 shadow-[0_6px_0_#881337,0_12px_20px_rgba(244,63,94,0.35)] active:translate-y-1.5 active:shadow-[0_1px_0_#881337] transition-all cursor-pointer select-none overflow-hidden"
        >
          <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-rose-500 to-rose-600 flex flex-col items-center justify-center p-1 text-white relative">
            <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-full border border-white/20 mb-0.5">
              2.0X
            </span>
            <span className="text-xs sm:text-base font-black tracking-tight drop-shadow">
              {isHi ? 'लाल (Red)' : 'Join Red'}
            </span>
            <span className="text-[8px] sm:text-[9px] text-rose-100/90 font-medium">
              2, 4, 6, 8, (0)
            </span>
          </div>
        </button>
      </div>

      {/* 2. NUMBER MATRIX (0 to 9) - 3D Casino Chips with exact color split & 9X label */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-[11px] font-bold px-1 text-zinc-400">
          <span>{isHi ? 'संख्या चुनें (Numbers 0 - 9)' : 'Pick Lucky Number'}</span>
          <span className="text-amber-500 font-mono font-black">{isHi ? '9X जैकपॉट' : '9X Jackpot'}</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2">
          {Array.from({ length: 10 }).map((_, num) => {
            // Determine styling
            let bgClass = 'bg-gradient-to-b from-rose-500 to-rose-700';
            let shadowColor = '#881337';
            if (num === 0) {
              bgClass = 'bg-gradient-to-r from-rose-600 via-purple-600 to-purple-700';
              shadowColor = '#4c1d95';
            } else if (num === 5) {
              bgClass = 'bg-gradient-to-r from-emerald-600 via-purple-600 to-purple-700';
              shadowColor = '#065f46';
            } else if ([1, 3, 7, 9].includes(num)) {
              bgClass = 'bg-gradient-to-b from-emerald-500 to-emerald-700';
              shadowColor = '#065f46';
            }

            return (
              <button
                key={num}
                id={`btn-number-${num}`}
                onClick={() => handleNumberClick(num)}
                disabled={disabled}
                style={{ boxShadow: `0 4px 0 ${shadowColor}, 0 6px 12px rgba(0,0,0,0.3)` }}
                className={`relative aspect-square rounded-2xl ${bgClass} text-white font-mono font-black text-lg sm:text-xl flex flex-col items-center justify-center p-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer border border-white/20 select-none group`}
              >
                <span>{num}</span>
                <span className="text-[8px] font-sans font-black tracking-tighter opacity-80 group-hover:opacity-100">
                  9X
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BIG / SMALL DUAL SELECTOR (2X Payout) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
        {/* BIG (5-9) */}
        <button
          id="btn-bet-big"
          onClick={() => handleSizeClick('big')}
          disabled={disabled}
          className="relative h-13 sm:h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-0.5 shadow-[0_5px_0_#78350f,0_8px_16px_rgba(245,158,11,0.3)] active:translate-y-1 active:shadow-[0_1px_0_#78350f] transition-all cursor-pointer flex items-center justify-between px-4 text-zinc-950 select-none"
        >
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 fill-zinc-950" />
            <div className="text-left leading-tight">
              <span className="block font-black text-xs sm:text-sm uppercase">
                {isHi ? 'बड़ा (Big)' : 'Big'}
              </span>
              <span className="text-[10px] font-bold opacity-80">5, 6, 7, 8, 9</span>
            </div>
          </div>
          <span className="font-mono font-black text-xs bg-zinc-950 text-amber-400 px-2 py-0.5 rounded-lg">
            2.0X
          </span>
        </button>

        {/* SMALL (0-4) */}
        <button
          id="btn-bet-small"
          onClick={() => handleSizeClick('small')}
          disabled={disabled}
          className="relative h-13 sm:h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-0.5 shadow-[0_5px_0_#1e3a8a,0_8px_16px_rgba(6,182,212,0.3)] active:translate-y-1 active:shadow-[0_1px_0_#1e3a8a] transition-all cursor-pointer flex items-center justify-between px-4 text-white select-none"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-200" />
            <div className="text-left leading-tight">
              <span className="block font-black text-xs sm:text-sm uppercase">
                {isHi ? 'छोटा (Small)' : 'Small'}
              </span>
              <span className="text-[10px] font-bold opacity-80">0, 1, 2, 3, 4</span>
            </div>
          </div>
          <span className="font-mono font-black text-xs bg-white text-blue-900 px-2 py-0.5 rounded-lg">
            2.0X
          </span>
        </button>
      </div>
    </div>
  );
};
