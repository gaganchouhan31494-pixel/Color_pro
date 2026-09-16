import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Award,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  UserPlus,
  GitBranch,
} from 'lucide-react';
import { Member } from '../types';
import { formatCurrency } from '../utils/mlmEngine';

interface TeamListViewProps {
  members: Member[];
  currentMember: Member;
  onSelectMember: (id: string) => void;
  onOpenAddMember: () => void;
  lang: 'en' | 'hi';
}

export const TeamListView: React.FC<TeamListViewProps> = ({
  members,
  currentMember,
  onSelectMember,
  onOpenAddMember,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [legFilter, setLegFilter] = useState<'ALL' | 'LEFT' | 'RIGHT' | 'DIRECT'>('ALL');

  // Filter team members
  const teamMembers = members.filter((m) => {
    // Search matching
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    // Leg matching
    if (legFilter === 'LEFT') return m.leg === 'LEFT';
    if (legFilter === 'RIGHT') return m.leg === 'RIGHT';
    if (legFilter === 'DIRECT') return m.sponsorId === currentMember.id;
    return true;
  });

  const leftTeamCount = members.filter((m) => m.leg === 'LEFT').length;
  const rightTeamCount = members.filter((m) => m.leg === 'RIGHT').length;
  const directCount = members.filter((m) => m.sponsorId === currentMember.id).length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Summary */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {lang === 'hi' ? 'मेरी टीम व डाउनलाइन सूची' : 'Team Downline & Genealogy Directory'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'लेफ्ट एवं राइट टीम के सभी वितरकों की विस्तृत सूची व बिजनेस वॉल्यूम'
                : 'Complete list of Left (Team A) and Right (Team B) distributors with BV metrics'}
            </p>
          </div>

          <button
            onClick={onOpenAddMember}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all self-start sm:self-auto min-h-[44px]"
          >
            <UserPlus className="w-4 h-4" />
            <span>{lang === 'hi' ? '+ नया वितरक जोड़ें' : '+ Register Downline'}</span>
          </button>
        </div>

        {/* Quick Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {lang === 'hi' ? 'कुल टीम सदस्य' : 'Total Downlines'}
            </span>
            <span className="text-xl font-black text-white font-mono">{members.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-blue-500/30">
            <span className="text-[10px] text-blue-400 uppercase tracking-wider block">
              {lang === 'hi' ? 'लेफ्ट टीम (Team A)' : 'Left Team'}
            </span>
            <span className="text-xl font-black text-blue-300 font-mono">{leftTeamCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">
              {lang === 'hi' ? 'राइट टीम (Team B)' : 'Right Team'}
            </span>
            <span className="text-xl font-black text-emerald-300 font-mono">{rightTeamCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/30">
            <span className="text-[10px] text-amber-400 uppercase tracking-wider block">
              {lang === 'hi' ? 'डायरेक्ट स्पॉन्सर' : 'Direct Referrals'}
            </span>
            <span className="text-xl font-black text-amber-300 font-mono">{directCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'hi'
                ? 'नाम, आईडी या फोन नंबर से खोजें...'
                : 'Search by Name, Member ID, or Phone...'
            }
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          <button
            onClick={() => setLegFilter('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              legFilter === 'ALL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'hi' ? 'सभी' : 'All'} ({members.length})
          </button>
          <button
            onClick={() => setLegFilter('LEFT')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              legFilter === 'LEFT'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'hi' ? 'लेफ्ट लेग' : 'Left Leg'} ({leftTeamCount})
          </button>
          <button
            onClick={() => setLegFilter('RIGHT')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              legFilter === 'RIGHT'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'hi' ? 'राइट लेग' : 'Right Leg'} ({rightTeamCount})
          </button>
          <button
            onClick={() => setLegFilter('DIRECT')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              legFilter === 'DIRECT'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'hi' ? 'डायरेक्ट्स' : 'Directs'} ({directCount})
          </button>
        </div>
      </div>

      {/* Member Cards Grid (Responsive & Mobile-optimized) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {teamMembers.map((m) => {
          const isCurrent = m.id === currentMember.id;
          const isDirect = m.sponsorId === currentMember.id;

          return (
            <div
              key={m.id}
              className={`p-4 rounded-2xl bg-slate-900/50 backdrop-blur-xl border transition-all flex flex-col justify-between space-y-3 ${
                isCurrent
                  ? 'border-emerald-500/70 ring-1 ring-emerald-500/30'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white text-base shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{m.name}</h3>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                        {m.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        m.leg === 'LEFT'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {m.leg} LEG
                    </span>
                    {isDirect && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        DIRECT
                      </span>
                    )}
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Package:</span>
                    <span className="font-bold text-white text-[11px] truncate block">
                      {m.packageName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rank:</span>
                    <span className="font-bold text-amber-300 text-[11px]">{m.rank}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Left BV:</span>
                    <span className="font-mono font-bold text-blue-400">
                      {m.leftBV.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Right BV:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {m.rightBV.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500">Joined: {m.joinDate}</span>
                <button
                  onClick={() => onSelectMember(m.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>{lang === 'hi' ? 'डैशबोर्ड देखें' : 'View Dashboard'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
