import React, { useState } from 'react';
import { X, Lock, Smartphone, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Language, ThemeConfig, UserAccount } from '../types';
import { sound } from '../utils/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserAccount) => void;
  language: Language;
  theme: ThemeConfig;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  language,
  theme,
}) => {
  if (!isOpen) return null;

  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';

  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWin();

    const mockUser: UserAccount = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      username: `VIP_${phone.slice(-4)}`,
      phone: `+91 ${phone}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      vipLevel: 1,
      isLoggedIn: true,
    };

    onLogin(mockUser);
    onClose();
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm rounded-3xl border p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all text-white ${
          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-950 border-white/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg">
              {tab === 'login' ? (isHi ? 'खाता लॉगिन' : 'VIP Login') : (isHi ? 'नया खाता बनाएं' : 'VIP Register')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-900 rounded-xl my-4 text-xs font-bold font-mono">
          <button
            onClick={() => setTab('login')}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'login' ? 'bg-amber-400 text-zinc-950 shadow' : 'text-zinc-400'
            }`}
          >
            {isHi ? 'लॉगिन' : 'LOGIN'}
          </button>
          <button
            onClick={() => setTab('register')}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'register' ? 'bg-amber-400 text-zinc-950 shadow' : 'text-zinc-400'
            }`}
          >
            {isHi ? 'रजिस्टर' : 'REGISTER'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-400 font-bold mb-1">
              {isHi ? 'मोबाइल नंबर:' : 'Mobile Number:'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="w-full pl-12 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-bold mb-1">
              {isHi ? 'पासवर्ड:' : 'Password:'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm shadow transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            <span>{tab === 'login' ? (isHi ? 'लॉगिन करें' : 'Login Now') : (isHi ? 'रजिस्टर करें' : 'Create Account')}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>
      </div>
    </div>
  );
};
