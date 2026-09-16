import React from 'react';
import { ShieldCheck, Award, CheckCircle2, FileCheck, Lock, Sparkles } from 'lucide-react';

export type StampType =
  | 'GOVT_COMPLIANT'
  | 'MCA_ROC'
  | 'ISO_9001'
  | 'DUPLICATE_CHECK_PASSED'
  | 'DESIGNER_REGISTERED'
  | 'TAX_COMPLIANT';

interface OfficialStampBadgeProps {
  type: StampType;
  size?: 'sm' | 'md' | 'lg';
  date?: string;
  registrationNumber?: string;
  className?: string;
}

export const OfficialStampBadge: React.FC<OfficialStampBadgeProps> = ({
  type,
  size = 'md',
  date = '2024-2026',
  registrationNumber,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24 text-[8px]',
    md: 'w-36 h-36 text-[10px]',
    lg: 'w-48 h-48 text-[12px]',
  };

  switch (type) {
    case 'GOVT_COMPLIANT':
      return (
        <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
          {/* Circular Stamp Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/80 border-dashed animate-[spin_40s_linear_infinite]" />
          <div className="absolute inset-1 rounded-full border border-emerald-400/50 bg-gradient-to-br from-emerald-950/70 via-slate-950/80 to-emerald-900/50 backdrop-blur-md shadow-lg shadow-emerald-500/10 flex flex-col items-center justify-center p-2 text-center text-emerald-300">
            {/* Inner Ring */}
            <div className="w-full h-full rounded-full border border-emerald-500/60 p-1.5 flex flex-col items-center justify-center relative">
              <div className="text-[7px] tracking-widest font-black uppercase text-emerald-400/90 leading-tight">
                ★ GOVT. OF INDIA ★
              </div>
              <ShieldCheck className="w-6 h-6 my-0.5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <div className="font-extrabold text-[8px] uppercase tracking-wider text-white">
                DIRECT SELLING
              </div>
              <div className="text-[7px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded-full border border-amber-500/40 mt-0.5">
                COMPLIANT 2021
              </div>
              <div className="text-[6px] font-mono text-slate-400 mt-0.5">
                REG: DOCA-7712
              </div>
            </div>
          </div>
        </div>
      );

    case 'MCA_ROC':
      return (
        <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/70 border-dotted animate-[spin_50s_linear_infinite]" />
          <div className="absolute inset-1 rounded-full border border-blue-400/50 bg-gradient-to-br from-blue-950/80 via-slate-950/85 to-indigo-950/70 backdrop-blur-md shadow-lg shadow-blue-500/15 flex flex-col items-center justify-center p-2 text-center text-blue-300">
            <div className="w-full h-full rounded-full border border-blue-500/50 p-1.5 flex flex-col items-center justify-center">
              <div className="text-[7px] tracking-widest font-black uppercase text-blue-300 leading-tight">
                ★ MCA REGISTERED ★
              </div>
              <Award className="w-6 h-6 my-0.5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
              <div className="font-extrabold text-[8px] uppercase tracking-wider text-white">
                ROC GOVT SEAL
              </div>
              <div className="text-[7px] font-mono text-cyan-300 font-bold bg-blue-500/20 px-1 py-0.2 rounded mt-0.5">
                CIN: U74999DL
              </div>
              <div className="text-[6px] text-slate-400 mt-0.5">ESTD 2024</div>
            </div>
          </div>
        </div>
      );

    case 'ISO_9001':
      return (
        <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/60 border-dashed" />
          <div className="absolute inset-1 rounded-full border border-amber-400/50 bg-gradient-to-br from-amber-950/70 via-slate-950/80 to-yellow-950/50 backdrop-blur-md shadow-lg shadow-amber-500/15 flex flex-col items-center justify-center p-2 text-center text-amber-300">
            <div className="w-full h-full rounded-full border border-amber-500/50 p-1 flex flex-col items-center justify-center">
              <div className="text-[7px] tracking-widest font-black uppercase text-amber-400 leading-tight">
                ★ CERTIFIED ★
              </div>
              <div className="text-[12px] font-black text-white font-mono tracking-tighter my-0.5 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                ISO 9001
              </div>
              <div className="text-[7px] font-bold text-amber-200 uppercase">QUALITY ASSURED</div>
              <div className="text-[6px] font-mono text-amber-400/80 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/30 mt-0.5">
                IAF ACCREDITED
              </div>
            </div>
          </div>
        </div>
      );

    case 'DUPLICATE_CHECK_PASSED':
      return (
        <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
          <div className="absolute inset-0 rounded-full border-2 border-teal-500/70 border-dashed animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-1 rounded-full border border-teal-400/60 bg-gradient-to-br from-teal-950/80 via-slate-950/90 to-emerald-950/70 backdrop-blur-md shadow-xl shadow-teal-500/20 flex flex-col items-center justify-center p-2 text-center text-teal-300">
            <div className="w-full h-full rounded-full border border-teal-500/60 p-1 flex flex-col items-center justify-center">
              <div className="text-[7px] tracking-widest font-black uppercase text-teal-300 leading-tight">
                ★ 100% ORIGINAL ★
              </div>
              <CheckCircle2 className="w-6 h-6 my-0.5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <div className="font-extrabold text-[8px] uppercase tracking-wider text-white">
                NO DUPLICATE
              </div>
              <div className="text-[6px] font-mono font-bold text-teal-200 bg-teal-500/20 px-1.5 py-0.2 rounded mt-0.5 border border-teal-500/40">
                1 PAN = 1 ID PASS
              </div>
              <div className="text-[6px] text-slate-400 mt-0.5">SECURE VERIFIED</div>
            </div>
          </div>
        </div>
      );

    case 'DESIGNER_REGISTERED':
      return (
        <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/60 border-dotted" />
          <div className="absolute inset-1 rounded-full border border-purple-400/50 bg-gradient-to-br from-purple-950/70 via-slate-950/85 to-indigo-950/70 backdrop-blur-md shadow-lg shadow-purple-500/20 flex flex-col items-center justify-center p-2 text-center text-purple-300">
            <div className="w-full h-full rounded-full border border-purple-500/50 p-1 flex flex-col items-center justify-center">
              <div className="text-[7px] tracking-widest font-black uppercase text-purple-300 leading-tight">
                ★ REGISTERED ★
              </div>
              <Sparkles className="w-5 h-5 my-0.5 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
              <div className="font-extrabold text-[8px] uppercase tracking-wider text-white">
                OFFICIAL DESIGN
              </div>
              <div className="text-[6px] font-mono font-bold text-purple-200 bg-purple-500/20 px-1 py-0.2 rounded mt-0.5">
                INTELLECTUAL PROP
              </div>
              <div className="text-[6px] text-slate-400 mt-0.5">AUTH #88921</div>
            </div>
          </div>
        </div>
      );

    case 'TAX_COMPLIANT':
    default:
      return (
        <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/70 border-dashed" />
          <div className="absolute inset-1 rounded-full border border-amber-400/50 bg-gradient-to-br from-amber-950/80 via-slate-950/85 to-slate-900/80 backdrop-blur-md shadow-lg shadow-amber-500/15 flex flex-col items-center justify-center p-2 text-center text-amber-300">
            <div className="w-full h-full rounded-full border border-amber-500/50 p-1 flex flex-col items-center justify-center">
              <div className="text-[7px] tracking-widest font-black uppercase text-amber-400 leading-tight">
                ★ 100% TAX PAID ★
              </div>
              <FileCheck className="w-5 h-5 my-0.5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <div className="font-extrabold text-[8px] uppercase tracking-wider text-white">
                TDS & GST SEAL
              </div>
              <div className="text-[6px] font-mono font-bold text-amber-200 bg-amber-500/20 px-1 py-0.2 rounded mt-0.5">
                SEC 194H GOVT
              </div>
              <div className="text-[6px] text-slate-400 mt-0.5">AUDITED 2026</div>
            </div>
          </div>
        </div>
      );
  }
};
