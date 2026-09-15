import React from 'react';
import { Clock, Zap } from 'lucide-react';
import { GameMode, Language } from '../types';
import { translations } from '../utils/translations';

interface ModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  language: Language;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  language,
}) => {
  const t = translations[language];

  const modes: { id: GameMode; label: string; desc: string; isFast?: boolean }[] = [
    { id: '30s', label: t.winGo30s, desc: '30s', isFast: true },
    { id: '1m', label: t.winGo1m, desc: '60s' },
    { id: '3m', label: t.winGo3m, desc: '180s' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 flex gap-1.5 shadow-md">
      {modes.map((mode) => {
        const isActive = currentMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all relative overflow-hidden ${
              isActive
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-600/25 border border-emerald-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            {mode.isFast ? (
              <Zap className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
            ) : (
              <Clock className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`} />
            )}
            <span className="tracking-tight">{mode.label}</span>
            {mode.isFast && (
              <span className="hidden sm:inline-block text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded font-mono font-bold uppercase">
                HOT
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
