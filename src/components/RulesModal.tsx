import React from 'react';
import { X, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">{t.howToPlayTitle}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Green (हरा) - 2x / 1.5x</span>
            </div>
            <p className="text-xs text-slate-300">
              {t.rule1}
            </p>
          </div>

          <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold mb-1">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>Red (लाल) - 2x / 1.5x</span>
            </div>
            <p className="text-xs text-slate-300">
              {t.rule2}
            </p>
          </div>

          <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-purple-400 font-bold mb-1">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Violet (बैंगनी) - 4.5x Payout</span>
            </div>
            <p className="text-xs text-slate-300">
              {t.rule3}
            </p>
          </div>

          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span>Exact Number (0 - 9) - 9.0x Payout</span>
            </div>
            <p className="text-xs text-slate-300">
              {t.rule4}
            </p>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Big (5-9) & Small (0-4) - 2.0x Payout</span>
            </div>
            <p className="text-xs text-slate-300">
              {t.rule5}
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'विशेष दोहरे रंग (Dual Colors)' : 'Special Dual Colors'}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">0 (Red + Violet):</strong> {language === 'hi' ? 'लाल और बैंगनी दोनों का संयोजन।' : 'Combination of Red and Violet.'}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">5 (Green + Violet):</strong> {language === 'hi' ? 'हरा और बैंगनी दोनों का संयोजन।' : 'Combination of Green and Violet.'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/60 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-650 text-white font-semibold text-xs transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
