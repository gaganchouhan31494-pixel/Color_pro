import React from 'react';
import { Clock, Copy, Sparkles, Volume2, ShieldCheck } from 'lucide-react';
import { GameMode, Language, ThemeConfig } from '../types';
import { sound } from '../utils/sound';

interface PeriodCountdownCardProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  periodId: string;
  countdown: number;
  duration: number;
  language: Language;
  theme: ThemeConfig;
}

const MODES: { id: GameMode; label: string; time: string }[] = [
  { id: 'parity', label: 'Parity', time: '30s' },
  { id: 'sapre', label: 'Sapre', time: '1m' },
  { id: 'bcone', label: 'Bcone', time: '3m' },
  { id: 'emerd', label: 'Emerd', time: '5m' },
];

export const PeriodCountdownCard: React.FC<PeriodCountdownCardProps> = ({
  currentMode,
  onSelectMode,
  periodId,
  countdown,
  duration,
  language,
  theme,
}) => {
  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  const isLastFive = countdown <= 5;

  const handleCopy = () => {
    navigator.clipboard?.writeText(periodId);
    sound.playClick();
  };

  // Format countdown into MM:SS
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div
      id="period-countdown-card"
      className={`rounded-3xl p-4 sm:p-5 border shadow-xl transition-all ${
        isLight
          ? 'bg-white border-slate-300'
          : 'bg-zinc-950/90 border-white/15'
      }`}
    >
      {/* 1. Mode Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900/60 border border-white/10 overflow-x-auto scrollbar-none mb-4">
        {MODES.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                sound.playClick();
                onSelectMode(m.id);
              }}
              className={`flex-1 min-w-[75px] py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 active:scale-95 border ${
                isActive
                  ? isLight
                    ? 'bg-slate-900 text-white shadow border-slate-900'
                    : 'bg-white text-zinc-950 shadow-md border-white'
                  : 'text-zinc-400 hover:text-white border-transparent'
              }`}
            >
              <span>{m.label}</span>
              <span className="text-[10px] opacity-70 font-mono">({m.time})</span>
            </button>
          );
        })}
      </div>

      {/* 2. Period ID & Countdown Timer Display */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Period Details */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold">{isHi ? 'वर्तमान राउंड आईडी:' : 'Active Period:'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-base sm:text-xl font-black font-mono tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {periodId}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors active:scale-90"
              title="Copy Period ID"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isHi ? 'प्रूवेन फेयर अल्गोरिदम' : 'Provably Fair RNG'}</span>
          </div>
        </div>

        {/* Right: Countdown Clock Display */}
        <div className="text-right flex flex-col items-end">
          <span className="text-[11px] font-bold text-zinc-400 mb-0.5">
            {isHi ? 'उलटी गिनती (Left)' : 'Count Down'}
          </span>
          <div
            className={`px-3.5 py-1.5 rounded-2xl border font-mono font-black text-xl sm:text-2xl tracking-widest transition-all ${
              isLastFive
                ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse shadow-lg shadow-rose-500/30'
                : isLight
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-zinc-900 border-white/20 text-amber-400'
            }`}
          >
            {timeFormatted}
          </div>
          <span className="text-[9px] text-zinc-500 font-mono mt-0.5">
            {isLastFive ? (isHi ? '🔒 बैटिंग बंद है' : '🔒 Bets Locked') : (isHi ? '🟢 बैटिंग चालू है' : '🟢 Open for Bets')}
          </span>
        </div>
      </div>
    </div>
  );
};
