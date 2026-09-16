import React from 'react';
import {
  User,
  Shield,
  Award,
  Wallet,
  ArrowDownCircle,
  RotateCcw,
  Sparkles,
  Smartphone,
  Lock,
  LogOut,
} from 'lucide-react';
import { BankAccount, Language, ThemeConfig, UserAccount, UserWallet } from '../types';
import { ASSETS_3D } from '../utils/assets3d';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface ProfilePageProps {
  user: UserAccount;
  wallet: UserWallet;
  bankAccount: BankAccount;
  language: Language;
  theme: ThemeConfig;
  onResetWallet: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  wallet,
  bankAccount,
  language,
  theme,
  onResetWallet,
  onOpenDeposit,
  onOpenWithdraw,
}) => {
  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  return (
    <div id="profile-page-container" className="space-y-4 animate-fadeIn">
      {/* 1. Profile Header Card */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/90 border-white/15'
        }`}
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-16 h-16 rounded-3xl object-cover border-2 border-amber-400 shadow-xl"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className={`text-lg sm:text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {user.username}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 font-black text-xs font-mono">
                VIP {user.vipLevel}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{user.phone}</p>
          </div>
        </div>

        {/* Quick Deposit / Withdraw Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDeposit}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 text-zinc-950 font-black text-xs shadow active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Wallet className="w-4 h-4" />
            <span>{isHi ? 'रिचार्ज (+10%)' : 'Deposit'}</span>
          </button>
          <button
            onClick={onOpenWithdraw}
            className="px-4 py-2.5 rounded-2xl bg-zinc-900 text-white border border-white/15 font-black text-xs shadow active:scale-95 transition-all flex items-center gap-1.5 hover:bg-zinc-800"
          >
            <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
            <span>{isHi ? 'निकासी' : 'Withdraw'}</span>
          </button>
        </div>
      </div>

      {/* 2. Wallet Financial Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Total Won</span>
          <div className="text-base font-black font-mono text-emerald-400">
            {formatCurrency(wallet.totalWon)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Current Balance</span>
          <div className="text-base font-black font-mono text-amber-400">
            {formatCurrency(wallet.balance)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Total Recharged</span>
          <div className="text-base font-black font-mono text-cyan-400">
            {formatCurrency(wallet.totalRecharged)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Total Withdrawn</span>
          <div className="text-base font-black font-mono text-purple-400">
            {formatCurrency(wallet.totalWithdrawn)}
          </div>
        </div>
      </div>

      {/* 3. Account Actions & Demo Reload */}
      <div
        className={`p-5 rounded-3xl border space-y-3 ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/90 border-white/15'
        }`}
      >
        <h4 className="font-black text-sm text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{isHi ? 'खाता नियंत्रण व टूल्स' : 'Account Controls & Tools'}</span>
        </h4>

        <div className="space-y-2 text-xs">
          <button
            onClick={() => {
              sound.playWin();
              onResetWallet();
            }}
            className="w-full p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 flex items-center justify-between text-white font-bold transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>{isHi ? 'डेमो बैलेंस रीसेट (₹10,000 रिफिल करें)' : 'Reload Demo Balance to ₹10,000'}</span>
            </div>
            <span className="text-[10px] text-amber-400 font-mono font-black">RELOAD</span>
          </button>

          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between text-zinc-300">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? 'दो-चरणीय सुरक्षा व एन्क्रिप्शन' : '2-Factor Security Protection'}</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
