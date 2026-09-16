import React, { useState } from 'react';
import { Palette, Check, X, Sparkles, Sun, Moon, Layers } from 'lucide-react';
import { ColorThemeId, Language } from '../types';
import { COLOR_THEMES } from '../utils/themeConfig';
import { sound } from '../utils/sound';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ColorThemeId;
  onSelectTheme: (theme: ColorThemeId) => void;
  language: Language;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  language,
}) => {
  if (!isOpen) return null;

  const [activeFilter, setActiveFilter] = useState<'all' | 'dark' | 'light'>('all');
  const isHi = language === 'hi';
  const allThemes = Object.values(COLOR_THEMES);

  const filteredThemes = allThemes.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.mode === activeFilter;
  });

  const handleSelect = (id: ColorThemeId) => {
    sound.playClick();
    onSelectTheme(id);
  };

  return (
    <div
      id="theme-selector-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="theme-selector-modal-card"
        className="w-full max-w-lg bg-zinc-950 border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background ambient lighting */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-indigo-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Palette className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>{isHi ? 'कलर थीम कस्टमाइज़र' : 'Color & Theme Customizer'}</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-zinc-400">
                {isHi ? 'डार्क या लाइट थीम और पसंदीदा रंग चुनें' : 'Choose Dark or Light themes with custom colors'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-theme-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Category Filter (All / Dark / Light) */}
        <div className="pt-3 pb-1 flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setActiveFilter('all');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-zinc-950 shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isHi ? 'सभी' : 'All'} ({allThemes.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveFilter('dark');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeFilter === 'dark'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isHi ? 'डार्क थीम' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveFilter('light');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeFilter === 'light'
                ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>{isHi ? 'लाइट थीम' : 'Light Mode'}</span>
          </button>
        </div>

        {/* Theme List with scroll */}
        <div className="py-3 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {filteredThemes.map((theme) => {
            const isSelected = theme.id === currentTheme;
            return (
              <div
                key={theme.id}
                id={`theme-card-${theme.id}`}
                onClick={() => handleSelect(theme.id)}
                className={`group relative cursor-pointer rounded-2xl border p-3 sm:p-3.5 transition-all active:scale-[0.99] ${
                  isSelected
                    ? 'border-amber-400 bg-zinc-900/90 shadow-xl shadow-amber-400/10'
                    : 'border-white/10 bg-zinc-900/40 hover:border-white/20 hover:bg-zinc-900/70'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm sm:text-base text-white">
                        {isHi ? theme.nameHi : theme.name}
                      </span>
                      {theme.mode === 'light' ? (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded-full">
                          <Sun className="w-2.5 h-2.5" />
                          {isHi ? 'लाइट' : 'Light'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded-full">
                          <Moon className="w-2.5 h-2.5" />
                          {isHi ? 'डार्क' : 'Dark'}
                        </span>
                      )}
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-full shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                          {isHi ? 'सक्रिय' : 'Active'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">
                      {isHi ? theme.descriptionHi : theme.description}
                    </p>
                  </div>

                  {/* Swatch Preview Circles */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-zinc-950 p-1.5 rounded-xl border border-white/10">
                    {theme.previewColors.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-sm border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <span>{isHi ? 'थीम तुरंत लागू हो जाती है' : 'Theme applied instantly'}</span>
          <button
            id="btn-confirm-theme"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs shadow-md transition-all active:scale-95"
          >
            {isHi ? 'पूर्ण' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
