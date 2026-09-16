import React, { useState } from 'react';
import {
  User,
  Shield,
  Wallet,
  ArrowDownCircle,
  Copy,
  LogOut,
  Building2,
  Users2,
  Headphones,
  Info,
  CheckCircle2,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  Globe,
  Lock,
  ChevronRight,
  Palette,
} from 'lucide-react';
import { AppPage, Language, UserAccount, UserWallet } from '../types';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface ProfilePageProps {
  user: UserAccount;
  wallet: UserWallet;
  language: Language;
  onSelectPage: (page: AppPage) => void;
  onLogout: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
  onToggleLanguage: () => void;
  onOpenThemeModal?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  wallet,
  language,
  onSelectPage,
  onLogout,
  onToggleSound,
  soundEnabled,
  onToggleLanguage,
  onOpenThemeModal,
}) => {
  const [copiedUid, setCopiedUid] = useState(false);

  const copyUid = () => {
    navigator.clipboard?.writeText(user.id);
    setCopiedUid(true);
    sound.playClick();
    setTimeout(() => setCopiedUid(false), 2000);
  };

  return (
    <div id="page-profile" className="space-y-5 animate-fadeIn">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar with VIP badge */}
            <div className="relative">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
              />
              <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900 shadow">
                VIP {user.vipLevel}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">{user.username}</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Active Member
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1 font-mono">
                  <span>UID: {user.id}</span>
                  <button
                    onClick={copyUid}
                    className="p-1 hover:text-white text-slate-500 transition-colors"
                    title="Copy UID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedUid && <span className="text-[10px] text-emerald-400">Copied!</span>}
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                📱 +91 {user.phone.slice(0, 2)}••••{user.phone.slice(-4)}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex sm:flex-col gap-2">
            <button
              onClick={() => onSelectPage('deposit')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md hover:from-emerald-500 hover:to-teal-500 flex items-center justify-center gap-1.5"
            >
              <Wallet className="w-4 h-4" />
              <span>{language === 'hi' ? 'डिपॉजिट करें' : 'Deposit Funds'}</span>
            </button>
            <button
              onClick={() => onSelectPage('withdraw')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>{language === 'hi' ? 'विड्रॉ करें' : 'Withdraw'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wallet & Betting Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <div className="text-[11px] text-slate-400 uppercase font-bold">
            {language === 'hi' ? 'वॉलेट बैलेंस' : 'Total Balance'}
          </div>
          <div className="text-lg sm:text-xl font-mono font-black text-amber-400">
            {formatCurrency(wallet.balance)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <div className="text-[11px] text-slate-400 uppercase font-bold">
            {language === 'hi' ? 'कुल जीत' : 'Total Won'}
          </div>
          <div className="text-lg sm:text-xl font-mono font-black text-emerald-400">
            {formatCurrency(wallet.totalWon)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <div className="text-[11px] text-slate-400 uppercase font-bold">
            {language === 'hi' ? 'कुल दांव' : 'Bets Placed'}
          </div>
          <div className="text-lg sm:text-xl font-mono font-black text-indigo-400">
            {wallet.totalBetsPlaced}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <div className="text-[11px] text-slate-400 uppercase font-bold">
            {language === 'hi' ? 'वीआईपी स्तर' : 'VIP Tier'}
          </div>
          <div className="text-lg sm:text-xl font-mono font-black text-purple-400">
            VIP {user.vipLevel} Gold
          </div>
        </div>
      </div>

      {/* Linked Bank Summary */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {user.bankDetails?.bankName || 'State Bank of India'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              A/C: {user.bankDetails?.accountNumber || '••••6721'} • UPI: {user.bankDetails?.upiId || 'rahul@okhdfc'}
            </div>
          </div>
        </div>
        <button
          onClick={() => onSelectPage('withdraw')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
        >
          {language === 'hi' ? 'प्रबंधित करें' : 'Manage'}
        </button>
      </div>

      {/* Settings & Options List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 shadow-lg divide-y divide-slate-800/80">
        {/* Refer & Earn */}
        <button
          onClick={() => onSelectPage('refer')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-800/40 rounded-2xl transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">
              {language === 'hi' ? 'रेफर और कमीशन (Refer & Earn)' : 'Refer & Agent Center'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Live Proofs */}
        <button
          onClick={() => onSelectPage('proof')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-800/40 rounded-2xl transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">
              {language === 'hi' ? 'लाइव विड्रॉल प्रूफ (Payment Slips)' : 'Live Verified Payout Proofs'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Support */}
        <button
          onClick={() => onSelectPage('support')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-800/40 rounded-2xl transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">
              {language === 'hi' ? '24/7 कस्टमर सपोर्ट (Live Connect)' : '24/7 Customer Support & Connect'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* About */}
        <button
          onClick={() => onSelectPage('about')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-800/40 rounded-2xl transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">
              {language === 'hi' ? 'हमारे बारे में (About Provably Fair)' : 'About Us & Certifications'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Theme customization */}
        {onOpenThemeModal && (
          <button
            id="profile-btn-theme"
            onClick={onOpenThemeModal}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-800/40 rounded-2xl transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">
                  {language === 'hi' ? 'कलर थीम (Casino Visual Theme)' : 'Visual Color Theme'}
                </span>
                <span className="text-[10px] text-amber-400">
                  {language === 'hi' ? 'Emerald, Cyber Neon, Gold, Ruby' : 'Emerald, Cyber Neon, Royal Gold, Ruby'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
                {language === 'hi' ? 'बदलें' : 'Change'}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </button>
        )}

        {/* Language switch */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Language / भाषा</span>
          </div>
          <button
            onClick={onToggleLanguage}
            className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl"
          >
            {language === 'hi' ? '🇮🇳 हिन्दी (बदलें)' : '🇬🇧 English (Change)'}
          </button>
        </div>

        {/* Sound toggle */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </div>
            <span className="text-xs font-bold text-white">
              {language === 'hi' ? 'ध्वनि प्रभाव (Sound Effects)' : 'Sound Effects'}
            </span>
          </div>
          <button
            onClick={onToggleSound}
            className={`text-xs font-bold px-3 py-1 rounded-xl border ${
              soundEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button
        id="btn-profile-logout"
        onClick={onLogout}
        className="w-full py-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow"
      >
        <LogOut className="w-4 h-4" />
        <span>{language === 'hi' ? 'लॉगआउट करें (Sign Out)' : 'Log Out Account'}</span>
      </button>
    </div>
  );
};
