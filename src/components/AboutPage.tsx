import React from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  Award,
  CheckCircle2,
  FileText,
  HeartHandshake,
  Globe2,
} from 'lucide-react';
import { Language } from '../types';

interface AboutPageProps {
  language: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ language }) => {
  return (
    <div id="page-about" className="space-y-5 animate-fadeIn">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
          <Award className="w-4 h-4" />
          <span>{language === 'hi' ? 'प्लेटफॉर्म परिचय' : 'Certified Platform Overview'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          {language === 'hi'
            ? 'कलर प्रेडिक्शन गेमिंग प्लेटफॉर्म'
            : 'Next-Gen Provably Fair Color Prediction'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          {language === 'hi'
            ? 'हमारा प्लेटफॉर्म पूरी तरह से सुरक्षित, पारदर्शी और अत्याधुनिक क्रिप्टोग्राफिक तकनीक पर आधारित है। यहाँ हर राउंड का नतीजा पूरी तरह से स्वतंत्र, निष्पक्ष और सत्यापित होता है।'
            : 'Built with institutional-grade cryptographic fairness, our platform delivers an uncompromising, tamper-proof gaming experience with instant settlements and complete transparency.'}
        </p>
      </div>

      {/* Trust & Security Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Fair RNG Algorithm', val: 'SHA-256', sub: 'Cryptographically Verified' },
          { label: 'Uptime Reliability', val: '99.98%', sub: 'High Availability' },
          { label: 'Instant Settlements', val: '< 30 Sec', sub: 'Automated IMPS/UPI' },
          { label: 'Active Players', val: '124,000+', sub: 'Across 18+ States' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <div className="text-xs text-slate-400 font-semibold">{stat.label}</div>
            <div className="text-xl sm:text-2xl font-mono font-black text-emerald-400">{stat.val}</div>
            <div className="text-[10px] text-slate-500">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Provably Fair Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">
            {language === 'hi' ? 'प्रूवेबली फेयर (Provably Fair) तकनीक कैसे काम करती है?' : 'How Provably Fair RNG Works'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <div className="text-xs font-bold text-white">
              {language === 'hi' ? 'सर्वर सीड जनरेशन' : 'Server Seed Generation'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'प्रत्येक राउंड की शुरुआत से पहले एक गुप्त SHA-256 हैश उत्पन्न किया जाता है।'
                : 'A cryptographically secret SHA-256 seed is generated before the betting window opens.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <div className="text-xs font-bold text-white">
              {language === 'hi' ? 'पब्लिक ब्लॉकचेन हैश' : 'Public Hash Validation'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'अंतिम 5 सेकंड में राउंड लॉक होता है और परिणाम किसी भी मानवीय हस्तक्षेप के बिना तय होता है।'
                : 'Deterministic modulo math resolves the winning number and color split automatically.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <div className="text-xs font-bold text-white">
              {language === 'hi' ? 'पारदर्शी सत्यापन' : 'Open Verification'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'कोई भी खिलाड़ी गेम रिकॉर्ड में जाकर हर राउंड का हैश कोड स्वतंत्र रूप से जांच सकता है।'
                : 'Players can independently cross-reference the hash against standard SHA-256 verifiers.'}
            </p>
          </div>
        </div>
      </div>

      {/* Responsible Gaming */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-bold text-white">
            {language === 'hi' ? 'जिम्मेदार गेमिंग (Responsible Gaming)' : 'Responsible Gaming Pledge'}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'hi'
              ? 'यह ऐप केवल 18 वर्ष से अधिक आयु के उपयोगकर्ताओं के लिए मनोरंजन और डेमो सिमुलेशन हेतु बनाई गई है। खेलें समझदारी से और अपने बजट का ध्यान रखें।'
              : 'This platform strictly adheres to fair gaming standards. Only users 18+ are permitted. Please play responsibly within your entertainment budget.'}
          </p>
        </div>
      </div>
    </div>
  );
};
