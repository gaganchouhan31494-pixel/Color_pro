import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Zap,
  RotateCcw,
  Trophy,
  Sliders,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { Language, UserWallet } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

export interface ReductionColorItem {
  id: string;
  nameEn: string;
  nameHi: string;
  hex: string;
  category: 'warm' | 'cool';
  multiplier: number;
}

const REDUCTION_COLORS: ReductionColorItem[] = [
  { id: 'emerald', nameEn: 'Emerald Green', nameHi: 'पन्ना हरा', hex: '#10b981', category: 'cool', multiplier: 5.5 },
  { id: 'ruby', nameEn: 'Ruby Red', nameHi: 'माणिक लाल', hex: '#f43f5e', category: 'warm', multiplier: 5.5 },
  { id: 'amethyst', nameEn: 'Amethyst Violet', nameHi: 'जामुनी बैंगनी', hex: '#8b5cf6', category: 'warm', multiplier: 5.5 },
  { id: 'sapphire', nameEn: 'Sapphire Blue', nameHi: 'नीलम नीला', hex: '#3b82f6', category: 'cool', multiplier: 5.5 },
  { id: 'amber', nameEn: 'Amber Gold', nameHi: 'सुनहरा पीला', hex: '#f59e0b', category: 'warm', multiplier: 5.5 },
  { id: 'cyan', nameEn: 'Neon Cyan', nameHi: 'नियॉन आसमानी', hex: '#06b6d4', category: 'cool', multiplier: 5.5 },
];

interface ColorReductionGameProps {
  wallet: UserWallet;
  language: Language;
  onUpdateWallet: (newWallet: UserWallet) => void;
}

interface ReductionBet {
  colorId: string;
  betType: 'survivor' | 'first_out' | 'warm' | 'cool';
  amount: number;
}

export const ColorReductionGame: React.FC<ColorReductionGameProps> = ({
  wallet,
  language,
  onUpdateWallet,
}) => {
  const t = translations[language];

  // Game cycle states
  const [roundNumber, setRoundNumber] = useState<number>(() => Math.floor(1000 + Math.random() * 9000));
  const [timer, setTimer] = useState<number>(20);
  const [isEliminating, setIsEliminating] = useState<boolean>(false);
  const [activeColors, setActiveColors] = useState<string[]>(REDUCTION_COLORS.map((c) => c.id));
  const [eliminatedOrder, setEliminatedOrder] = useState<string[]>([]);
  const [survivor, setSurvivor] = useState<ReductionColorItem | null>(null);

  // Betting states
  const [selectedBetColor, setSelectedBetColor] = useState<string>('emerald');
  const [selectedBetType, setSelectedBetType] = useState<'survivor' | 'first_out' | 'warm' | 'cool'>('survivor');
  const [chipAmount, setChipAmount] = useState<number>(100);
  const [currentBets, setCurrentBets] = useState<ReductionBet[]>([]);
  const [lastWinAlert, setLastWinAlert] = useState<string | null>(null);

  // Interactive Color Reduction Palette Lab state
  const [paletteSteps, setPaletteSteps] = useState<number>(4);
  const [pickedSampleColor, setPickedSampleColor] = useState<string>('#10b981');

  // Timer loop for Color Reduction cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          triggerEliminationSequence();
          return 20;
        }
        if (prev <= 5) {
          sound.playTick(prev <= 3);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentBets, wallet]);

  // Elimination / Color Reduction simulation
  const triggerEliminationSequence = () => {
    setIsEliminating(true);
    sound.playClick();

    // Shuffle colors to determine elimination sequence
    const shuffled = [...REDUCTION_COLORS].sort(() => Math.random() - 0.5);
    const order: string[] = [];
    let remaining = [...REDUCTION_COLORS.map((c) => c.id)];

    // Progressively reduce colors one by one
    shuffled.forEach((color, idx) => {
      setTimeout(() => {
        if (idx < shuffled.length - 1) {
          order.push(color.id);
          setEliminatedOrder([...order]);
          remaining = remaining.filter((id) => id !== color.id);
          setActiveColors([...remaining]);
          sound.playTick(true);
        } else {
          // Final Survivor!
          setSurvivor(color);
          setIsEliminating(false);
          setRoundNumber((r) => r + 1);
          sound.playWin();

          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });

          // Check bets
          checkWinnings(color, order[0]);

          // Reset round after 4s
          setTimeout(() => {
            setActiveColors(REDUCTION_COLORS.map((c) => c.id));
            setEliminatedOrder([]);
            setSurvivor(null);
            setCurrentBets([]);
            setLastWinAlert(null);
          }, 4000);
        }
      }, idx * 600);
    });
  };

  const checkWinnings = (winner: ReductionColorItem, firstOutId: string) => {
    let totalWon = 0;
    currentBets.forEach((b) => {
      if (b.betType === 'survivor' && b.colorId === winner.id) {
        totalWon += b.amount * 5.5;
      } else if (b.betType === 'first_out' && b.colorId === firstOutId) {
        totalWon += b.amount * 5.0;
      } else if (b.betType === 'warm' && winner.category === 'warm') {
        totalWon += b.amount * 2.0;
      } else if (b.betType === 'cool' && winner.category === 'cool') {
        totalWon += b.amount * 2.0;
      }
    });

    if (totalWon > 0) {
      onUpdateWallet({
        ...wallet,
        balance: wallet.balance + totalWon,
        totalWon: wallet.totalWon + totalWon,
      });
      setLastWinAlert(
        language === 'hi'
          ? `🎉 बधाई! आपने ₹${totalWon.toLocaleString('en-IN')} जीते!`
          : `🎉 Congratulations! You won ₹${totalWon.toLocaleString('en-IN')}!`
      );
    }
  };

  const handlePlaceReductionBet = () => {
    if (wallet.balance < chipAmount) {
      alert(t.insufficientFunds);
      return;
    }
    if (isEliminating || timer <= 4) {
      return;
    }

    sound.playChip();
    onUpdateWallet({
      ...wallet,
      balance: wallet.balance - chipAmount,
      totalBetsPlaced: wallet.totalBetsPlaced + 1,
    });

    setCurrentBets((prev) => [
      ...prev,
      {
        colorId: selectedBetColor,
        betType: selectedBetType,
        amount: chipAmount,
      },
    ]);
  };

  return (
    <div id="color-reduction-game-section" className="space-y-4">
      {/* Reduction Arena Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                <Sliders className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {t.colorReductionGameTitle}
              </h2>
              <span className="text-xs font-mono font-bold bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/40">
                R-{roundNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.reductionDesc}
            </p>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-slate-400">{t.countDown}:</span>
              <span className={`font-mono text-lg font-bold ${timer <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                {timer}s
              </span>
            </div>
          </div>
        </div>

        {/* Win alert banner if won */}
        {lastWinAlert && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{lastWinAlert}</span>
          </div>
        )}

        {/* Live Color Reduction Elimination Chamber */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isEliminating ? t.eliminationInProgress : `${activeColors.length} Colors in Spectrum`}</span>
            </span>
            {survivor && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{t.winnerSurvivingColor}: {language === 'hi' ? survivor.nameHi : survivor.nameEn}</span>
              </span>
            )}
          </div>

          {/* 6 Color Reduction Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {REDUCTION_COLORS.map((col) => {
              const isAlive = activeColors.includes(col.id);
              const isSurvivor = survivor?.id === col.id;
              const isSelected = selectedBetColor === col.id;

              return (
                <button
                  key={col.id}
                  id={`btn-reduction-color-${col.id}`}
                  onClick={() => !isEliminating && setSelectedBetColor(col.id)}
                  disabled={isEliminating || timer <= 4}
                  className={`relative p-3 rounded-2xl border transition-all flex flex-col items-center text-center group ${
                    isSurvivor
                      ? 'ring-2 ring-amber-400 scale-105 shadow-lg shadow-amber-500/30'
                      : isAlive
                      ? isSelected
                        ? 'border-indigo-400 bg-slate-800 shadow-md'
                        : 'border-slate-700/80 bg-slate-900/90 hover:bg-slate-850'
                      : 'border-slate-850 bg-slate-900/30 opacity-30 grayscale cursor-not-allowed'
                  }`}
                >
                  {/* 3D Glossy Color Orb */}
                  <div
                    className="w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-transform group-hover:scale-110 relative"
                    style={{
                      backgroundColor: col.hex,
                      boxShadow: isAlive ? `0 0 15px ${col.hex}55` : 'none',
                    }}
                  >
                    <div className="w-3.5 h-2 rounded-full bg-white/50 absolute top-1.5 left-2 rotate-[-20deg]" />
                    {isSurvivor && <Trophy className="w-5 h-5 text-slate-950" />}
                  </div>

                  <span className="text-xs font-bold text-white mt-2">
                    {language === 'hi' ? col.nameHi : col.nameEn}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-semibold">
                    {col.multiplier}x
                  </span>

                  {/* Status chip */}
                  {!isAlive && (
                    <span className="absolute top-1 right-1 text-[9px] font-bold text-rose-400 bg-rose-950/80 px-1 rounded">
                      OUT
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reduction Bet Placement Controls */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Bet Types */}
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            <button
              id="btn-bettype-survivor"
              onClick={() => setSelectedBetType('survivor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedBetType === 'survivor'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.survivorColor}
            </button>
            <button
              id="btn-bettype-firstout"
              onClick={() => setSelectedBetType('first_out')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedBetType === 'first_out'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.firstEliminated}
            </button>
            <button
              id="btn-bettype-warm"
              onClick={() => setSelectedBetType('warm')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedBetType === 'warm'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.warmSpectrum}
            </button>
            <button
              id="btn-bettype-cool"
              onClick={() => setSelectedBetType('cool')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedBetType === 'cool'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.coolSpectrum}
            </button>
          </div>

          {/* Chip and Confirm button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              {[50, 100, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  id={`btn-reduction-chip-${amt}`}
                  onClick={() => setChipAmount(amt)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    chipAmount === amt
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button
              id="btn-confirm-reduction-bet"
              onClick={handlePlaceReductionBet}
              disabled={isEliminating || timer <= 4}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {t.confirm} (₹{chipAmount})
            </button>
          </div>
        </div>

        {/* Current Round Placed Bets Pill List */}
        {currentBets.length > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 font-semibold">{t.tabMyBets}:</span>
            {currentBets.map((b, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1"
              >
                <span className="capitalize text-amber-400 font-bold">{b.colorId}</span>
                <span className="text-slate-400">({b.betType})</span>
                <span className="font-mono text-emerald-400">₹{b.amount}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Color Reduction Palette Lab (Visual Utility & Learning) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              {t.colorPaletteTool}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {paletteSteps} Levels Quantization
          </span>
        </div>

        {/* Color slider */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            id="input-palette-reduction-slider"
            type="range"
            min="1"
            max="8"
            value={paletteSteps}
            onChange={(e) => setPaletteSteps(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {REDUCTION_COLORS.slice(0, paletteSteps).map((c) => (
              <div
                key={c.id}
                className="w-7 h-7 rounded-lg shadow cursor-pointer border border-white/20 transition-transform hover:scale-110"
                style={{ backgroundColor: c.hex }}
                title={c.nameEn}
                onClick={() => setPickedSampleColor(c.hex)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
