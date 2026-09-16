import React from 'react';
import { X, HelpCircle, Trophy, Sparkles, AlertCircle } from 'lucide-react';
import { Language, ThemeConfig } from '../types';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  theme: ThemeConfig;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
}) => {
  if (!isOpen) return null;

  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  return (
    <div
      id="rules-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-3xl border p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all max-h-[88vh] overflow-y-auto ${
          isLight
            ? 'bg-white border-slate-300 text-slate-900'
            : 'bg-zinc-950 border-white/20 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-base sm:text-lg">
              {isHi ? 'कलर ट्रेडिंग नियम व गुणांक' : 'Color Trading Rules & Multipliers'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs sm:text-sm">
          {/* Green Rule */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
            <div className="font-black text-emerald-400 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{isHi ? 'हरा (JOIN GREEN) - 2X या 1.5X' : 'JOIN GREEN - 2X or 1.5X'}</span>
            </div>
            <p className="text-zinc-300">
              {isHi
                ? 'यदि परिणाम 1, 3, 7, 9 आता है, तो आपको 2 गुना (2X) राशि मिलती है। यदि परिणाम 5 (हरा + बैंगनी) आता है, तो 1.5 गुना मिलता है।'
                : 'If outcome is 1, 3, 7, 9, you receive 2X your bet. If outcome is 5 (Green + Violet split), you receive 1.5X.'}
            </p>
          </div>

          {/* Red Rule */}
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-1">
            <div className="font-black text-rose-400 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{isHi ? 'लाल (JOIN RED) - 2X या 1.5X' : 'JOIN RED - 2X or 1.5X'}</span>
            </div>
            <p className="text-zinc-300">
              {isHi
                ? 'यदि परिणाम 2, 4, 6, 8 आता है, तो आपको 2 गुना (2X) राशि मिलती है। यदि परिणाम 0 (लाल + बैंगनी) आता है, तो 1.5 गुना मिलता है।'
                : 'If outcome is 2, 4, 6, 8, you receive 2X your bet. If outcome is 0 (Red + Violet split), you receive 1.5X.'}
            </p>
          </div>

          {/* Violet Rule */}
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-1">
            <div className="font-black text-purple-400 text-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>{isHi ? 'बैंगनी (JOIN VIOLET) - 4.5X जैकपॉट' : 'JOIN VIOLET - 4.5X Jackpot'}</span>
            </div>
            <p className="text-zinc-300">
              {isHi
                ? 'यदि परिणाम 0 या 5 आता है, तो आपको 4.5 गुना (4.5X) भारी मुनाफा मिलता है।'
                : 'If outcome is 0 or 5, you hit the jackpot and receive 4.5X payout.'}
            </p>
          </div>

          {/* Number Rule */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
            <div className="font-black text-amber-400 text-sm flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{isHi ? 'संख्या (NUMBERS 0 - 9) - 9X मेगा विन' : 'NUMBERS (0-9) - 9X Mega Win'}</span>
            </div>
            <p className="text-zinc-300">
              {isHi
                ? 'यदि आपकी चुनी हुई संख्या सटीक परिणाम से मेल खाती है, तो आपको सीधा 9 गुना (9X) मुनाफा मिलता है (उदा. ₹100 पर ₹900)।'
                : 'Exact single number match pays a massive 9X multiplier (e.g. ₹100 gives ₹900).'}
            </p>
          </div>

          {/* Big / Small Rule */}
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 space-y-1">
            <div className="font-black text-cyan-400 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{isHi ? 'बड़ा / छोटा (BIG / SMALL) - 2X' : 'BIG / SMALL - 2X'}</span>
            </div>
            <p className="text-zinc-300">
              {isHi
                ? 'छोटा (Small): 0, 1, 2, 3, 4 | बड़ा (Big): 5, 6, 7, 8, 9। दोनों पर 2 गुना (2X) लाभ मिलता है।'
                : 'Small covers numbers 0-4, Big covers numbers 5-9. Both pay 2X upon winning.'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm shadow transition-all active:scale-95"
        >
          {isHi ? 'समझ गया (Close)' : 'I Understand'}
        </button>
      </div>
    </div>
  );
};
