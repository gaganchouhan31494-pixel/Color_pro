import React from 'react';
import { Headphones, Send, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { Language, ThemeConfig } from '../types';

interface SupportPageProps {
  language: Language;
  theme: ThemeConfig;
}

export const SupportPage: React.FC<SupportPageProps> = ({ language, theme }) => {
  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  return (
    <div id="support-page-container" className="space-y-4 animate-fadeIn">
      <div
        className={`rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-2 ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/90 border-white/15'
        }`}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-black">
          <Headphones className="w-4 h-4" />
          <span>{isHi ? '24/7 समर्पित वीआईपी हेल्पलाइन' : '24/7 Dedicated Support'}</span>
        </div>
        <h2 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {isHi ? 'ग्राहक सेवा व सहायता केंद्र' : 'VIP Helpdesk & Telegram Assistance'}
        </h2>
        <p className="text-xs text-zinc-400 max-w-xl">
          {isHi
            ? 'रिचार्ज, निकासी या ट्रेडिंग से संबंधित किसी भी सहायता के लिए हमारे आधिकारिक एजेंट से तुरंत संपर्क करें।'
            : 'Get instant live support for deposits, withdrawals, or game assistance directly via Telegram or Live Chat.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Telegram Channel */}
        <div
          className={`p-5 rounded-3xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-zinc-950/80 border-white/10'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
          <h4 className="font-black text-base text-white">Official Telegram Channel</h4>
          <p className="text-xs text-zinc-400">
            {isHi ? 'दैनिक भविष्यवाणी संकेत और आधिकारिक उपहार कोड प्राप्त करें।' : 'Daily prediction tips, signals, and gift codes.'}
          </p>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-black text-xs shadow transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Join @ColorVIP998</span>
          </a>
        </div>

        {/* Live 24/7 Chat */}
        <div
          className={`p-5 rounded-3xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-zinc-950/80 border-white/10'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h4 className="font-black text-base text-white">Live Customer Care</h4>
          <p className="text-xs text-zinc-400">
            {isHi ? 'हमारे प्रशिक्षित सहायता एजेंट से सीधे बात करें।' : 'Chat directly with our verified support specialists.'}
          </p>
          <button
            onClick={() => alert(isHi ? 'सहायता एजेंट सक्रिय है। कृपया प्रतीक्षा करें...' : 'Connecting to Live Support Agent...')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs shadow transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Start Live Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
