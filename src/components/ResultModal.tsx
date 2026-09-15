import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Trophy, Frown, CheckCircle, ArrowRight } from 'lucide-react';
import { Language, RoundResult, UserBet } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RoundResult | null;
  roundBets: UserBet[];
  language: Language;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  result,
  roundBets,
  language,
}) => {
  const t = translations[language];

  const totalWon = roundBets.reduce((acc, b) => acc + (b.winAmount || 0), 0);
  const totalBetAmount = roundBets.reduce((acc, b) => acc + b.totalBet, 0);
  const isNetWin = totalWon > 0;
  const hadBets = roundBets.length > 0;

  useEffect(() => {
    if (isOpen && result) {
      if (isNetWin) {
        sound.playWin();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#a855f7', '#ef4444', '#f59e0b'],
          });
        } catch {
          // ignore
        }
      } else if (hadBets) {
        sound.playLoss();
      }
    }
  }, [isOpen, result, isNetWin, hadBets]);

  if (!isOpen || !result) return null;

  const isDualRed = result.number === 0;
  const isDualGreen = result.number === 5;
  const isGreen = result.colors.includes('green') && !isDualGreen;

  let colorBadgeBg = 'bg-rose-600';
  let colorName = 'Red';
  if (isDualRed) {
    colorBadgeBg = 'bg-gradient-to-r from-rose-600 to-purple-600';
    colorName = 'Red + Violet';
  } else if (isDualGreen) {
    colorBadgeBg = 'bg-gradient-to-r from-emerald-600 to-purple-600';
    colorName = 'Green + Violet';
  } else if (isGreen) {
    colorBadgeBg = 'bg-emerald-600';
    colorName = 'Green';
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp">
        {/* Top Status Header */}
        <div className={`p-5 text-center relative ${
          isNetWin 
            ? 'bg-gradient-to-b from-emerald-600/30 via-emerald-950/30 to-slate-900 border-b border-emerald-500/20' 
            : hadBets
            ? 'bg-gradient-to-b from-rose-600/25 via-rose-950/30 to-slate-900 border-b border-rose-500/20'
            : 'bg-gradient-to-b from-indigo-600/25 via-slate-900 to-slate-900 border-b border-slate-800'
        }`}>
          <button
            id="btn-result-x"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex p-3 rounded-2xl mb-2.5 shadow-lg border border-white/10" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
            {isNetWin ? (
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            ) : hadBets ? (
              <Frown className="w-8 h-8 text-rose-400" />
            ) : (
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            )}
          </div>

          <h2 className="text-lg font-black text-white">
            {isNetWin ? t.congrats : hadBets ? t.badLuck : t.roundResultAnnounced}
          </h2>

          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {t.period}: {result.period}
          </p>
        </div>

        {/* Drawn Result Presentation */}
        <div className="p-5 flex flex-col items-center">
          {/* Big Number Circle */}
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl font-black font-mono text-white shadow-2xl mb-3 border-2 border-white/20 relative overflow-hidden ${colorBadgeBg}`}>
            <span className="relative z-10 drop-shadow-lg">{result.number}</span>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] pointer-events-none" />
          </div>

          {/* Color & Size Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${colorBadgeBg}`}>
              {colorName}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-slate-200 uppercase font-mono">
              {result.size === 'big' ? `${t.big} (5-9)` : `${t.small} (0-4)`}
            </span>
          </div>

          {/* User's bet outcome summary */}
          {hadBets ? (
            <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{language === 'hi' ? 'आपका कुल दांव' : 'Total Bet'}:</span>
                <span className="font-mono text-slate-200">
                  {formatCurrency(totalBetAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold pt-1.5 border-t border-slate-700/60">
                <span className={isNetWin ? 'text-emerald-400' : 'text-rose-400'}>
                  {isNetWin ? (language === 'hi' ? 'कुल जीत' : 'Payout Won') : (language === 'hi' ? 'हार' : 'Loss')}:
                </span>
                <span className={`font-mono text-base ${isNetWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isNetWin ? `+${formatCurrency(totalWon)}` : `-${formatCurrency(totalBetAmount)}`}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full bg-slate-800/40 rounded-xl p-3 text-center text-xs text-slate-400 mb-4 border border-slate-800">
              {language === 'hi' ? 'आपने इस राउंड में कोई दांव नहीं लगाया था।' : 'You did not place any bets this round.'}
            </div>
          )}

          {/* Close button */}
          <button
            id="btn-result-close"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>{language === 'hi' ? 'जारी रखें' : 'Continue Playing'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
