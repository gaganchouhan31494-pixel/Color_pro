import React from 'react';
import { Timer, AlertTriangle, ShieldCheck } from 'lucide-react';
import { GameMode, Language, RoundResult } from '../types';
import { translations } from '../utils/translations';

interface PeriodCountdownCardProps {
  period: string;
  remainingSeconds: number;
  totalRoundSeconds: number;
  recentResults: RoundResult[];
  language: Language;
}

export const PeriodCountdownCard: React.FC<PeriodCountdownCardProps> = ({
  period,
  remainingSeconds,
  recentResults,
  language,
}) => {
  const t = translations[language];
  const isLocked = remainingSeconds <= 5;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 ${
        isLocked ? 'bg-rose-500' : 'bg-emerald-500'
      }`} />

      {/* Top row: Period ID & Countdown Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Period Details */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.period}</span>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{period}</span>
          </div>
        </div>

        {/* Digital Countdown Timer */}
        <div className="flex flex-col items-start sm:items-end">
          <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider mb-1 text-slate-400">
            <Timer className={`w-3.5 h-3.5 ${isLocked ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <span className={isLocked ? 'text-rose-400 font-bold' : 'text-slate-300'}>{t.countDown}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            {/* Minutes */}
            <div className="flex gap-1">
              <span className={`w-8 h-10 sm:w-9 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black shadow-inner border ${
                isLocked 
                  ? 'bg-rose-950/80 border-rose-700/50 text-rose-300' 
                  : 'bg-slate-800 border-slate-700 text-white'
              }`}>
                {mStr[0]}
              </span>
              <span className={`w-8 h-10 sm:w-9 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black shadow-inner border ${
                isLocked 
                  ? 'bg-rose-950/80 border-rose-700/50 text-rose-300' 
                  : 'bg-slate-800 border-slate-700 text-white'
              }`}>
                {mStr[1]}
              </span>
            </div>

            <span className={`text-2xl font-bold ${isLocked ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`}>:</span>

            {/* Seconds */}
            <div className="flex gap-1">
              <span className={`w-8 h-10 sm:w-9 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black shadow-inner border ${
                isLocked 
                  ? 'bg-rose-950/80 border-rose-700/50 text-rose-300 animate-pulse' 
                  : 'bg-slate-800 border-slate-700 text-white'
              }`}>
                {sStr[0]}
              </span>
              <span className={`w-8 h-10 sm:w-9 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black shadow-inner border ${
                isLocked 
                  ? 'bg-rose-950/80 border-rose-700/50 text-rose-300 animate-pulse' 
                  : 'bg-slate-800 border-slate-700 text-white'
              }`}>
                {sStr[1]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lock alert notice if <= 5 seconds */}
      {isLocked && (
        <div className="mt-3.5 bg-rose-500/15 border border-rose-500/40 rounded-xl px-3 py-2 flex items-center gap-2 text-rose-300 text-xs font-medium animate-pulse">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{t.locked}</span>
        </div>
      )}

      {/* Recent 5 Draws Quick Glance */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          {t.lastDraw}:
        </span>
        <div className="flex items-center gap-2">
          {recentResults.slice(0, 6).map((res) => {
            const isDualRed = res.number === 0;
            const isDualGreen = res.number === 5;
            const isGreen = res.colors.includes('green') && !isDualGreen;
            const isRed = res.colors.includes('red') && !isDualRed;

            return (
              <div
                key={res.id}
                className="flex items-center gap-1 bg-slate-800/60 border border-slate-700/60 rounded-lg px-2 py-1"
                title={`Period ${res.period}: ${res.number} (${res.size})`}
              >
                {/* Visual colored circle */}
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm overflow-hidden relative">
                  {isDualRed ? (
                    <div className="w-full h-full bg-gradient-to-r from-rose-600 via-purple-600 to-purple-600 flex items-center justify-center">
                      {res.number}
                    </div>
                  ) : isDualGreen ? (
                    <div className="w-full h-full bg-gradient-to-r from-emerald-600 via-purple-600 to-purple-600 flex items-center justify-center">
                      {res.number}
                    </div>
                  ) : isGreen ? (
                    <div className="w-full h-full bg-emerald-600 flex items-center justify-center">
                      {res.number}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-rose-600 flex items-center justify-center">
                      {res.number}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  {res.size === 'big' ? 'B' : 'S'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
