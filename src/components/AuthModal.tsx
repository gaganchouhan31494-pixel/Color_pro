import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Zap,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { sound } from '../utils/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('pass1234');
  const [confirmPassword, setConfirmPassword] = useState('pass1234');
  const [inviteCode, setInviteCode] = useState('WIN7799');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (phone.length < 10) {
      setErrorMsg(language === 'hi' ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit phone number');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए' : 'Password must be at least 6 characters');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setErrorMsg(language === 'hi' ? 'पासवर्ड मेल नहीं खा रहे हैं' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    sound.playChip();

    setTimeout(() => {
      setLoading(false);
      sound.playWin();

      const newUser: UserAccount = {
        id: 'UID' + Math.floor(200000 + Math.random() * 700000),
        phone: phone,
        username: `Player_${phone.slice(-4)}`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        vipLevel: 2,
        inviteCode: 'WIN' + Math.floor(1000 + Math.random() * 9000),
        invitedBy: inviteCode || undefined,
        isLoggedIn: true,
        createdAt: Date.now(),
        bankDetails: {
          accountHolderName: 'Player ' + phone.slice(-4),
          bankName: 'State Bank of India',
          accountNumber: '••••••••' + phone.slice(-4),
          ifscCode: 'SBIN0002100',
          upiId: `${phone}@paytm`,
        },
      };

      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  const handleDemoQuickLogin = () => {
    sound.playChip();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      sound.playWin();

      const demoUser: UserAccount = {
        id: 'UID883921',
        phone: '9876543210',
        username: 'RoyalWinner_VIP',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        vipLevel: 3,
        inviteCode: 'WIN7799',
        isLoggedIn: true,
        createdAt: Date.now() - 86400000 * 10,
        bankDetails: {
          accountHolderName: 'Rahul Sharma',
          bankName: 'State Bank of India',
          accountNumber: '••••••••6721',
          ifscCode: 'SBIN0001423',
          upiId: 'rahul.sharma@okhdfcbank',
        },
      };

      onLoginSuccess(demoUser);
      onClose();
    }, 400);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-slate-100">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="btn-close-auth"
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {language === 'hi' ? 'कलर प्रेडिक्शन प्लेटफॉर्म' : 'Color Prediction Arena'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'hi'
              ? 'सुरक्षित लॉगिन करें या नया खाता बनाएं (डेमो बैलेंस उपलब्ध)'
              : 'Login securely or register a new account (₹10,000 Demo balance)'}
          </p>
        </div>

        {/* Tabs: Login vs Register */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-5">
          <button
            id="tab-auth-login"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{language === 'hi' ? 'लॉगिन (Login)' : 'Login'}</span>
          </button>
          <button
            id="tab-auth-register"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === 'hi' ? 'रजिस्टर (Register)' : 'Register'}</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Phone Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'hi' ? 'मोबाइल नंबर (Phone Number)' : 'Mobile Number'}
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-emerald-500 transition-colors">
              <span className="text-xs font-mono font-bold text-slate-400 border-r border-slate-800 pr-2 mr-2">
                +91
              </span>
              <Phone className="w-4 h-4 text-slate-500 mr-2" />
              <input
                id="input-auth-phone"
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                className="w-full bg-transparent text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'hi' ? 'पासवर्ड (Password)' : 'Password'}
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-emerald-500 transition-colors">
              <Lock className="w-4 h-4 text-slate-500 mr-2" />
              <input
                id="input-auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Additional fields for Register */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {language === 'hi' ? 'पासवर्ड दोबारा दर्ज करें' : 'Confirm Password'}
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-emerald-500 transition-colors">
                  <Lock className="w-4 h-4 text-slate-500 mr-2" />
                  <input
                    id="input-auth-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {language === 'hi' ? 'इनविटेशन कोड (Invite Code - ऐच्छिक)' : 'Invitation Code (Optional)'}
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-emerald-500 transition-colors">
                  <Sparkles className="w-4 h-4 text-amber-500 mr-2" />
                  <input
                    id="input-auth-invite-code"
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="WIN7799"
                    className="w-full bg-transparent text-sm font-mono text-amber-300 placeholder:text-slate-600 focus:outline-none uppercase"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            id="btn-auth-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>{language === 'hi' ? 'लॉगिन करें' : 'Log In'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{language === 'hi' ? 'खाता बनाएं' : 'Register Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Demo One-Click Access Button */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
          <button
            id="btn-auth-demo-quick"
            type="button"
            onClick={handleDemoQuickLogin}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-amber-300 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>
              {language === 'hi'
                ? '⚡ 1-क्लिक डेमो लॉगिन (₹10,000 डमी बैलेंस के साथ)'
                : '⚡ 1-Click Demo Login (with ₹10,000 Demo Balance)'}
            </span>
          </button>

          <p className="text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {language === 'hi'
                ? 'सुरक्षित 256-बिट SSL एन्क्रिप्टेड प्लेटफॉर्म'
                : '100% Safe 256-Bit SSL Encrypted Connection'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
