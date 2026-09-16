import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Frown, CheckCircle, ArrowRight, Sparkles, Coins, Flame } from 'lucide-react';
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

  // Animated counter for winning payout
  const [displayAmount, setDisplayAmount] = useState<number>(0);

  useEffect(() => {
    if (isOpen && result) {
      if (isNetWin) {
        sound.playWin();

        // 3D Multi-stage Confetti Cannons
        try {
          // Left blast
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0.1, y: 0.6 },
            colors: ['#fbbf24', '#10b981', '#ffffff', '#f59e0b'],
          });
          // Right blast
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 0.9, y: 0.6 },
            colors: ['#fbbf24', '#ec4899', '#ffffff', '#10b981'],
          });
          // Center gold explosion after 200ms
          setTimeout(() => {
            confetti({
              particleCount: 90,
              spread: 100,
              origin: { y: 0.5 },
              colors: ['#ffd700', '#ffffff', '#f59e0b', '#22c55e'],
            });
          }, 250);
        } catch {
          // ignore
        }

        // Count-up animation
        let start = 0;
        const duration = 800;
        const startTime = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          setDisplayAmount(Math.floor(progress * totalWon));
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            setDisplayAmount(totalWon);
          }
        };
        requestAnimationFrame(step);
      } else if (hadBets) {
        sound.playLoss();
        setDisplayAmount(totalWon);
      }
    } else {
      setDisplayAmount(0);
    }
  }, [isOpen, result, isNetWin, hadBets, totalWon]);

  if (!isOpen || !result) return null;

  const isDualRed = result.number === 0;
  const isDualGreen = result.number === 5;
  const isGreen = result.colors.includes('green') && !isDualGreen;

  let colorBadgeBg = 'bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.6)]';
  let colorName = language === 'hi' ? 'लाल (Red)' : 'Red';
  if (isDualRed) {
    colorBadgeBg = 'bg-gradient-to-r from-rose-600 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.6)]';
    colorName = language === 'hi' ? 'लाल + बैंगनी' : 'Red + Violet';
  } else if (isDualGreen) {
    colorBadgeBg = 'bg-gradient-to-r from-emerald-600 to-purple-600 shadow-[0_0_20px_rgba(16,185,129,0.6)]';
    colorName = language === 'hi' ? 'हरा + बैंगनी' : 'Green + Violet';
  } else if (isGreen) {
    colorBadgeBg = 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.6)]';
    colorName = language === 'hi' ? 'हरा (Green)' : 'Green';
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
        {/* 3D Motion Card Container with Perspective and Spring Physics */}
        <motion.div
          initial={{ scale: 0.65, rotateX: 25, y: 40, opacity: 0 }}
          animate={{ scale: 1, rotateX: 0, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, rotateX: -20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm bg-zinc-950 border border-white/20 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
          style={{ perspective: 1000 }}
        >
          {/* Ambient celebration aura glow */}
          <div className={`absolute -top-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none ${
            isNetWin ? 'bg-amber-400' : hadBets ? 'bg-rose-600' : 'bg-white'
          }`} />
          <div className={`absolute -bottom-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none ${
            isNetWin ? 'bg-emerald-500' : hadBets ? 'bg-zinc-700' : 'bg-zinc-800'
          }`} />

          {/* Close button */}
          <button
            id="btn-result-close-x"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>

          {/* TOP 3D CELEBRATION HEADER */}
          <div className="p-6 text-center relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
            {isNetWin ? (
              <div className="flex flex-col items-center">
                {/* 3D Spinning Golden Trophy / Coins Animation */}
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-1 shadow-[0_10px_25px_rgba(245,158,11,0.5)] border border-amber-300 animate-float3D flex items-center justify-center">
                    <Trophy className="w-11 h-11 text-zinc-950 stroke-[2.5]" />
                    <Sparkles className="w-5 h-5 text-white absolute -top-2 -right-2 animate-bounce" />
                    <Coins className="w-5 h-5 text-amber-900 absolute -bottom-1 -left-1 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest mb-1.5 shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>{language === 'hi' ? 'शानदार जीत!' : 'BIG WINNER!'}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                  {t.congrats}
                </h2>
              </div>
            ) : hadBets ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-2.5 shadow-lg shadow-rose-950">
                  <Frown className="w-9 h-9 text-rose-400" />
                </div>
                <h2 className="text-xl font-black text-white">
                  {t.badLuck}
                </h2>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-2.5 shadow-lg">
                  <CheckCircle className="w-9 h-9 text-white" />
                </div>
                <h2 className="text-xl font-black text-white">
                  {t.roundResultAnnounced}
                </h2>
              </div>
            )}

            <p className="text-xs text-zinc-400 font-mono mt-1 font-semibold">
              {t.period}: <span className="text-white font-bold">{result.period}</span>
            </p>
          </div>

          {/* DRAWN RESULT BALL PRESENTATION */}
          <div className="p-6 flex flex-col items-center">
            {/* 3D Realistic Winning Sphere / Cube */}
            <div className="relative mb-4">
              <div className={`w-28 h-28 rounded-3xl flex items-center justify-center text-6xl font-black font-mono text-white shadow-2xl border-4 border-white/30 relative overflow-hidden ${colorBadgeBg}`}>
                {/* 3D Glass convex highlight */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-2xl" />
                <span className="relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">{result.number}</span>
              </div>
            </div>

            {/* Color & Size Badges */}
            <div className="flex items-center gap-2 mb-5">
              <span className={`px-3.5 py-1 rounded-full text-xs font-black text-white uppercase tracking-wider ${colorBadgeBg}`}>
                {colorName}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-zinc-900 border border-white/20 text-white uppercase font-mono tracking-wider">
                {result.size === 'big' ? `${t.big} (5-9)` : `${t.small} (0-4)`}
              </span>
            </div>

            {/* PAYOUT BREAKDOWN CARD */}
            {hadBets ? (
              <div className="w-full bg-zinc-900/90 border border-white/15 rounded-2xl p-4 mb-5 shadow-inner">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-medium">
                  <span>{language === 'hi' ? 'राउंड में कुल दांव' : 'Total Bet Placed'}:</span>
                  <span className="font-mono text-white font-bold">
                    {formatCurrency(totalBetAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className={`text-sm font-black uppercase tracking-wide ${isNetWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isNetWin ? (language === 'hi' ? 'कुल पे-आउट' : 'Payout Won') : (language === 'hi' ? 'राउंड लॉस' : 'Round Loss')}:
                  </span>
                  <span className={`font-mono text-xl font-black ${isNetWin ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-rose-400'}`}>
                    {isNetWin ? `+${formatCurrency(displayAmount)}` : `-${formatCurrency(totalBetAmount)}`}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-3 text-center text-xs text-zinc-400 mb-5 font-medium">
                {language === 'hi' ? 'आपने इस राउंड में कोई दांव नहीं लगाया था।' : 'You did not place any bets this round.'}
              </div>
            )}

            {/* 3D ACTION BUTTON TO CONTINUE */}
            <button
              id="btn-result-continue"
              onClick={onClose}
              className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm tracking-wide transition-all duration-100 ease-out active:translate-y-[4px] flex items-center justify-center gap-2 shadow-xl ${
                isNetWin
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-zinc-950 shadow-[0_6px_0_#b45309] hover:shadow-[0_8px_0_#b45309] active:shadow-[0_1px_0_#b45309] border-t border-amber-200'
                  : 'bg-white text-zinc-950 shadow-[0_6px_0_#a1a1aa] hover:shadow-[0_8px_0_#a1a1aa] active:shadow-[0_1px_0_#a1a1aa] border-t border-white'
              }`}
            >
              <span>{isNetWin ? (language === 'hi' ? 'जीत कलेक्ट करें & खेलें' : 'Claim Payout & Play Next') : (language === 'hi' ? 'अगला राउंड खेलें' : 'Continue Playing')}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
