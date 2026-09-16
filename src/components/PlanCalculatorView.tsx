import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Percent,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { PACKAGES, DEFAULT_PLAN_SETTINGS } from '../data/mlmData';
import { calculatePlanSimulation, formatCurrency } from '../utils/mlmEngine';
import { Package } from '../types';

interface PlanCalculatorViewProps {
  lang: 'en' | 'hi';
}

export const PlanCalculatorView: React.FC<PlanCalculatorViewProps> = ({ lang }) => {
  const [leftBV, setLeftBV] = useState<number>(40000);
  const [rightBV, setRightBV] = useState<number>(30000);
  const [selectedPkgId, setSelectedPkgId] = useState<string>(PACKAGES[2].id); // Silver Pro default
  const [directLeft, setDirectLeft] = useState<number>(2);
  const [directRight, setDirectRight] = useState<number>(2);
  const [directPkgPrice, setDirectPkgPrice] = useState<number>(6000);

  const selectedPackage: Package = useMemo(() => {
    return PACKAGES.find((p) => p.id === selectedPkgId) || PACKAGES[2];
  }, [selectedPkgId]);

  const simulation = useMemo(() => {
    return calculatePlanSimulation(
      leftBV,
      rightBV,
      selectedPackage,
      directLeft,
      directRight,
      directPkgPrice,
      DEFAULT_PLAN_SETTINGS
    );
  }, [leftBV, rightBV, selectedPackage, directLeft, directRight, directPkgPrice]);

  // Presets
  const applyPreset = (l: number, r: number, pkgIndex: number, dl: number, dr: number) => {
    setLeftBV(l);
    setRightBV(r);
    setSelectedPkgId(PACKAGES[pkgIndex].id);
    setDirectLeft(dl);
    setDirectRight(dr);
    setDirectPkgPrice(PACKAGES[pkgIndex].price);
  };

  const isCapped = simulation.flushedIncome > 0;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {lang === 'hi' ? 'बाइनरी पेयर मैचिंग व इनकम कैलकुलेटर' : 'Binary Income & Pair Calculator'}
            </h1>
            <p className="text-xs text-slate-400">
              {lang === 'hi'
                ? 'लेफ्ट व राइट बिजनेस वॉल्यूम दर्ज करें और तुरंत पेआउट, कैपिंग व कैरी-फॉरवर्ड देखें'
                : 'Simulate business volume, direct referrals, and package limits in real time'}
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset(10000, 10000, 0, 1, 1)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            {lang === 'hi' ? '10k : 10k (स्टार्टर)' : '10k:10k Starter'}
          </button>
          <button
            onClick={() => applyPreset(50000, 30000, 2, 2, 2)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            {lang === 'hi' ? '50k : 30k (सिल्वर)' : '50k:30k Silver'}
          </button>
          <button
            onClick={() => applyPreset(150000, 100000, 3, 3, 2)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            {lang === 'hi' ? '1.5L : 1L (गोल्ड)' : '1.5L:1L Gold'}
          </button>
          <button
            onClick={() => applyPreset(500000, 450000, 4, 5, 5)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            {lang === 'hi' ? '5L : 4.5L (डायमंड VIP)' : '5L:4.5L Diamond VIP'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Sliders & Selectors */}
        <div className="lg:col-span-6 space-y-6">
          {/* Package Selection Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'hi' ? 'आपका सक्रिय पैकेज' : 'Your Activation Package'}</span>
              </label>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {selectedPackage.name} ({formatCurrency(selectedPackage.price)})
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {PACKAGES.map((p) => {
                const isSelected = p.id === selectedPkgId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPkgId(p.id)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-[11px] font-bold truncate">{lang === 'hi' ? p.nameHi : p.name}</p>
                    <p className="text-xs font-mono font-extrabold text-emerald-400 mt-0.5">
                      {formatCurrency(p.price)}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Cap: {formatCurrency(p.dailyCapping)}/d
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Volume Inputs */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {lang === 'hi' ? 'दोनों लेग्स का बिजनेस वॉल्यूम (BV)' : 'Leg Business Volumes (BV)'}
            </h3>

            {/* Left Leg Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  {lang === 'hi' ? 'लेफ्ट लेग वॉल्यूम (Team A)' : 'Left Leg Volume (Team A)'}
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={leftBV}
                    onChange={(e) => setLeftBV(Math.max(0, Number(e.target.value) || 0))}
                    className="w-28 px-2 py-1 text-right text-xs font-mono font-bold bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-xs font-mono text-slate-400">BV</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={leftBV}
                onChange={(e) => setLeftBV(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 BV</span>
                <span>1,00,000 BV</span>
                <span>2,00,000 BV</span>
              </div>
            </div>

            {/* Right Leg Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  {lang === 'hi' ? 'राइट लेग वॉल्यूम (Team B)' : 'Right Leg Volume (Team B)'}
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={rightBV}
                    onChange={(e) => setRightBV(Math.max(0, Number(e.target.value) || 0))}
                    className="w-28 px-2 py-1 text-right text-xs font-mono font-bold bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs font-mono text-slate-400">BV</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={rightBV}
                onChange={(e) => setRightBV(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 BV</span>
                <span>1,00,000 BV</span>
                <span>2,00,000 BV</span>
              </div>
            </div>
          </div>

          {/* Direct Referral Settings */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {lang === 'hi' ? 'डायरेक्ट स्पॉन्सर सिमुलेशन' : 'Direct Referral Simulation'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {lang === 'hi' ? 'लेफ्ट डायरेक्ट्स संख्या' : 'Left Directs Count'}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDirectLeft(Math.max(0, directLeft - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-white text-sm">
                    {directLeft}
                  </span>
                  <button
                    onClick={() => setDirectLeft(directLeft + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {lang === 'hi' ? 'राइट डायरेक्ट्स संख्या' : 'Right Directs Count'}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDirectRight(Math.max(0, directRight - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-white text-sm">
                    {directRight}
                  </span>
                  <button
                    onClick={() => setDirectRight(directRight + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {lang === 'hi' ? 'डायरेक्ट पैकेज मूल्य:' : 'Avg Package Size:'}
              </span>
              <select
                value={directPkgPrice}
                onChange={(e) => setDirectPkgPrice(Number(e.target.value))}
                className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none"
              >
                <option value={1000}>Starter (₹1,000)</option>
                <option value={3000}>Bronze (₹3,000)</option>
                <option value={6000}>Silver Pro (₹6,000)</option>
                <option value={12000}>Gold Elite (₹12,000)</option>
                <option value={25000}>Diamond VIP (₹25,000)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Live Payout Calculation Report */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main Net Payout Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'hi' ? 'शुद्ध बैंक पेआउट' : 'Net Bank Payout (After TDS & Admin)'}
                </span>
                <h2 className="text-3xl font-black text-emerald-400 mt-1 font-mono">
                  {formatCurrency(simulation.netPayable)}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">{lang === 'hi' ? 'सकल कमाई (Gross)' : 'Gross Earnings'}</span>
                <span className="text-sm font-bold text-white font-mono">
                  {formatCurrency(simulation.grossTotal)}
                </span>
              </div>
            </div>

            {/* Binary Matching Visual Gauge */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">
                  {lang === 'hi' ? '1:1 बाइनरी मैचिंग स्थिति' : '1:1 Matching Status'}
                </span>
                <span className="font-mono font-bold text-white">
                  {simulation.matchedBV.toLocaleString()} BV Matched
                </span>
              </div>

              {/* Progress bar visual */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{
                    width: `${
                      leftBV + rightBV === 0
                        ? 50
                        : Math.round((leftBV / (leftBV + rightBV)) * 100)
                    }%`,
                  }}
                  className="bg-blue-500 h-full"
                  title={`Left: ${leftBV} BV`}
                ></div>
                <div
                  style={{
                    width: `${
                      leftBV + rightBV === 0
                        ? 50
                        : Math.round((rightBV / (leftBV + rightBV)) * 100)
                    }%`,
                  }}
                  className="bg-emerald-500 h-full"
                  title={`Right: ${rightBV} BV`}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-blue-400 font-mono">L: {leftBV.toLocaleString()} BV</span>
                <span className="text-emerald-400 font-mono">R: {rightBV.toLocaleString()} BV</span>
              </div>

              {/* Carry Forward Notice */}
              {simulation.carryForwardLeg !== 'NONE' && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {lang === 'hi' ? 'कैरी फॉरवर्ड (Carry Forward):' : 'Next Day Carry Forward:'}
                  </span>
                  <span className="font-mono font-bold text-cyan-300">
                    +{simulation.carryForwardBV.toLocaleString()} BV ({simulation.carryForwardLeg} Leg)
                  </span>
                </div>
              )}
            </div>

            {/* Capping status banner */}
            {isCapped ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <div>
                  <p className="font-bold">
                    {lang === 'hi' ? 'डेली कैपिंग सीमा लागू!' : 'Daily Capping Limit Reached!'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'hi'
                      ? `पैकेज सीमा ${formatCurrency(simulation.cappingLimit)}/दिन है। ${formatCurrency(simulation.flushedIncome)} फ्लश हुआ। उच्च पैकेज पर अपग्रेड करें।`
                      : `Max daily cap is ${formatCurrency(simulation.cappingLimit)}. ${formatCurrency(simulation.flushedIncome)} is capped. Upgrade to higher package.`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {lang === 'hi'
                    ? `कैपिंग सुरक्षित: ${formatCurrency(simulation.cappingLimit)}/दिन सीमा के भीतर`
                    : `Well within daily cap limit of ${formatCurrency(simulation.cappingLimit)}/day`}
                </span>
              </div>
            )}

            {/* Detailed Line Item Table */}
            <div className="space-y-2 text-xs divide-y divide-slate-800/80">
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">
                  1. {lang === 'hi' ? 'डायरेक्ट स्पॉन्सर इनकम' : 'Direct Referral Income'} ({selectedPackage.directBonusPercent}%)
                </span>
                <span className="font-mono font-bold text-white">
                  +{formatCurrency(simulation.directIncome)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">
                  2. {lang === 'hi' ? '1:1 बाइनरी पेयर इनकम' : '1:1 Binary Pair Income'} ({selectedPackage.pairMatchingPercent}%)
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  +{formatCurrency(simulation.payablePairIncome)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">
                  3. {lang === 'hi' ? 'जनरेशन लेवल बोनस (अनुमानित)' : 'Generation Level Bonus (Est.)'}
                </span>
                <span className="font-mono font-bold text-purple-300">
                  +{formatCurrency(simulation.levelIncomeEst)}
                </span>
              </div>

              {simulation.royaltyPoolEst > 0 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">
                    4. {lang === 'hi' ? 'ग्लोबल रॉयल्टी पूल हिस्सा' : 'Global Royalty Pool Share'}
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    +{formatCurrency(simulation.royaltyPoolEst)}
                  </span>
                </div>
              )}

              {/* Deductions */}
              <div className="flex items-center justify-between pt-2 text-rose-400/90">
                <span>
                  - TDS ({DEFAULT_PLAN_SETTINGS.tdsPercent}%)
                </span>
                <span className="font-mono">
                  -{formatCurrency(simulation.tdsAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 text-rose-400/90">
                <span>
                  - Admin Charges ({DEFAULT_PLAN_SETTINGS.adminPercent}%)
                </span>
                <span className="font-mono">
                  -{formatCurrency(simulation.adminAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
