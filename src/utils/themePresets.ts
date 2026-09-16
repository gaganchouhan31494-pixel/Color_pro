import { ThemeColor } from '../types';

export interface ThemeConfig {
  id: ThemeColor;
  name: string;
  nameHi: string;
  hex: string;
  glowColor: string;
  cardGlass: string;
  accentText: string;
  borderAccent: string;
  primaryBtn: string;
  primaryBtnHover: string;
  badgeBg: string;
  radialGradient: string;
}

export const THEME_CONFIGS: Record<ThemeColor, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Matrix',
    nameHi: 'एमराल्ड जेड (हरा)',
    hex: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    cardGlass: 'bg-slate-900/40 backdrop-blur-xl border-white/10 hover:border-emerald-500/30',
    accentText: 'text-emerald-400',
    borderAccent: 'border-emerald-500/40',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25',
    primaryBtnHover: 'hover:bg-emerald-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    radialGradient: 'from-emerald-950/40 via-slate-950 to-slate-950',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Cyber Sapphire',
    nameHi: 'साइबर सफायर (नीला)',
    hex: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.18)',
    cardGlass: 'bg-slate-900/40 backdrop-blur-xl border-white/10 hover:border-cyan-500/30',
    accentText: 'text-cyan-400',
    borderAccent: 'border-cyan-500/40',
    primaryBtn: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/25',
    primaryBtnHover: 'hover:bg-cyan-500',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    radialGradient: 'from-cyan-950/40 via-slate-950 to-slate-950',
  },
  amber: {
    id: 'amber',
    name: 'Imperial Gold',
    nameHi: 'इंपीरियल गोल्ड (स्वर्ण)',
    hex: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.18)',
    cardGlass: 'bg-slate-900/40 backdrop-blur-xl border-white/10 hover:border-amber-500/30',
    accentText: 'text-amber-400',
    borderAccent: 'border-amber-500/40',
    primaryBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/25',
    primaryBtnHover: 'hover:bg-amber-500',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    radialGradient: 'from-amber-950/40 via-slate-950 to-slate-950',
  },
  purple: {
    id: 'purple',
    name: 'Neon Amethyst',
    nameHi: 'नियॉन एमेथिस्ट (बैंगनी)',
    hex: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.18)',
    cardGlass: 'bg-slate-900/40 backdrop-blur-xl border-white/10 hover:border-purple-500/30',
    accentText: 'text-purple-400',
    borderAccent: 'border-purple-500/40',
    primaryBtn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25',
    primaryBtnHover: 'hover:bg-purple-500',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    radialGradient: 'from-purple-950/40 via-slate-950 to-slate-950',
  },
  crimson: {
    id: 'crimson',
    name: 'Ruby Crimson',
    nameHi: 'रूबी क्रिम्सन (लाल)',
    hex: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.18)',
    cardGlass: 'bg-slate-900/40 backdrop-blur-xl border-white/10 hover:border-rose-500/30',
    accentText: 'text-rose-400',
    borderAccent: 'border-rose-500/40',
    primaryBtn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25',
    primaryBtnHover: 'hover:bg-rose-500',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    radialGradient: 'from-rose-950/40 via-slate-950 to-slate-950',
  },
};
