import React from 'react';
import { Trophy, Sparkles, X, ArrowRight, Frown } from 'lucide-react';
import { GameResult, Language, ThemeConfig, UserBet } from '../types';
import { formatCurrency } from '../utils/gameLogic';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: GameResult | null;
  userBets: UserBet[];
  language: Language;
  theme: ThemeConfig;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  result,
  userBets,
  language,
  theme,
}) => {
  if (!isOpen || !result) return null;

  const isHi = language === 'hi';
  const matchingBets = userBets.filter((b) => b.period === result.period);
  const totalWon = matchingBets
    .filter((b) => b.status === 'won')
    .reduce((acc, b) => acc + (b.winAmount || 0), 0);
  const hasWon = totalWon > 0;

  return (
    <div
      id="result-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-white/20 p-5 shadow-2xl text-center relative overflow-hidden text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl pointer-events-none ${
            hasWon ? 'bg-amber-400/30' : 'bg-rose-500/20'
          }`}
        />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Heading */}
        <div className="pt-2 mb-3">
          {hasWon ? (
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 p-1 shadow-lg shadow-amber-500/30 flex items-center justify-center text-zinc-950 mb-2 animate-bounce">
              <Trophy className="w-9 h-9 stroke-[2.5]" />
            </div>
          ) : (
            <div className="w-16 h-16 mx-auto rounded-3xl bg-zinc-900 border border-white/10 p-1 flex items-center justify-center text-zinc-400 mb-2">
              <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
          )}

          <h3 className="font-black text-xl">
            {hasWon
              ? isHi ? 'बधाई हो! आप जीत गए!' : 'Congratulations! You Won!'
              : isHi ? 'राउंड का परिणाम घोषित' : 'Round Result Revealed'}
          </h3>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Period: {result.period}
          </p>
        </div>

        {/* Result Ball */}
        <div className="my-4 p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-around">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Lucky Number</span>
            <span className="text-2xl font-black font-mono text-white">{result.number}</span>
          </div>

          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Size</span>
            <span className="text-xs font-black uppercase px-2 py-0.5 rounded-md bg-zinc-800 text-amber-400 font-mono">
              {result.size}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Colors</span>
            <div className="flex items-center gap-1 justify-end mt-0.5">
              {result.colors.map((c, i) => (
                <span
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    c === 'green' ? 'bg-emerald-500' : c === 'red' ? 'bg-rose-500' : 'bg-purple-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Win / Loss Amount Card */}
        {matchingBets.length > 0 && (
          <div className="mb-4">
            {hasWon ? (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono font-black text-xl">
                +{formatCurrency(totalWon)}
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-zinc-900 text-zinc-400 text-xs font-medium">
                {isHi ? 'अगले राउंड में आपका भाग्य चमकेगा!' : 'Better luck in the next round!'}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm shadow transition-all active:scale-95"
        >
          {isHi ? 'जारी रखें (Continue)' : 'Continue Playing'}
        </button>
      </div>
    </div>
  );
};
