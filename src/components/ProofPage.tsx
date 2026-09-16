import React from 'react';
import { ShieldCheck, CheckCircle2, Award, ExternalLink, Sparkles } from 'lucide-react';
import { Language, ThemeConfig } from '../types';
import { formatCurrency } from '../utils/gameLogic';

interface ProofPageProps {
  language: Language;
  theme: ThemeConfig;
}

const LIVE_WITHDRAW_PROOFS = [
  { user: 'Vikram_S', amount: 15400, bank: 'State Bank of India', utr: 'UTR491820491028', time: '2 mins ago' },
  { user: 'Rahul_99', amount: 4800, bank: 'HDFC Bank', utr: 'UTR491820491192', time: '5 mins ago' },
  { user: 'Pooja_Sharma', amount: 25000, bank: 'ICICI Bank', utr: 'UTR491820491384', time: '8 mins ago' },
  { user: 'Deepak_Pro', amount: 9200, bank: 'Paytm Payments Bank', utr: 'UTR491820491501', time: '12 mins ago' },
  { user: 'Aman_VIP', amount: 50000, bank: 'Axis Bank', utr: 'UTR491820491883', time: '16 mins ago' },
];

export const ProofPage: React.FC<ProofPageProps> = ({ language, theme }) => {
  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  return (
    <div id="proof-page-container" className="space-y-4 animate-fadeIn">
      <div
        className={`rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-2 ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/90 border-white/15'
        }`}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
          <ShieldCheck className="w-4 h-4" />
          <span>{isHi ? '100% सत्यता व भुगतान प्रमाण' : '100% Verified Payout Ledger'}</span>
        </div>
        <h2 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {isHi ? 'लाइव बैंक निकासी प्रमाण' : 'Real-time Live Payout Proofs'}
        </h2>
        <p className="text-xs text-zinc-400 max-w-xl">
          {isHi
            ? 'हमारे सभी खिलाड़ियों को सीधे उनके बैंक खाते में सुरक्षित IMPS ट्रांसफर के जरिए तुरंत भुगतान किया जाता है।'
            : 'All withdrawals are settled instantaneously to bank accounts with verified IMPS banking UTR numbers.'}
        </p>
      </div>

      <div className="space-y-2">
        {LIVE_WITHDRAW_PROOFS.map((p, i) => (
          <div
            key={i}
            className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-zinc-950/80 border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                  <span>{p.user}</span>
                  <span className="text-[10px] text-zinc-400 font-normal">({p.bank})</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                  UTR: {p.utr} • {p.time}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm sm:text-base font-black font-mono text-emerald-400">
                +{formatCurrency(p.amount)}
              </div>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.2 rounded-full font-bold uppercase">
                SUCCESS
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
