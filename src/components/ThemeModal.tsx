import React from 'react';
import { Palette, Check, X, Sparkles } from 'lucide-react';
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

  const isHi = language === 'hi';
  const themes = Object.values(COLOR_THEMES);

  const handleSelect = (id: ColorThemeId) => {
    sound.playClick();
    onSelectTheme(id);
  };

  return (
    <div
      id="theme-selector-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="theme-selector-modal-card"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background ambient lighting */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-purple-500 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Palette className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{isHi ? 'कलर थीम कस्टमाइज़र' : 'Select Visual Color Theme'}</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400">
                {isHi ? 'अपनी पसंद का लक्ज़री कसीनो लुक चुनें' : 'Choose your favorite high-contrast luxury styling'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-theme-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme List */}
        <div className="py-4 space-y-3">
          {themes.map((theme) => {
            const isSelected = theme.id === currentTheme;
            return (
              <div
                key={theme.id}
                id={`theme-card-${theme.id}`}
                onClick={() => handleSelect(theme.id)}
                className={`group relative cursor-pointer rounded-2xl border p-3.5 sm:p-4 transition-all active:scale-[0.99] ${
                  isSelected
                    ? 'border-amber-400 bg-slate-800/90 shadow-xl shadow-amber-400/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-white">
                        {isHi ? theme.nameHi : theme.name}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                          {isHi ? 'सक्रिय' : 'Active'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isHi ? theme.descriptionHi : theme.description}
                    </p>
                  </div>

                  {/* Swatch Preview Circles */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
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
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{isHi ? 'सभी गेम्स व एनिमेशन पर तुरंत लागू' : 'Applies across all pages instantly'}</span>
          <button
            id="btn-confirm-theme"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
          >
            {isHi ? 'हो गया' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
