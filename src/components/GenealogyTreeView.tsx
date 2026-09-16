import React, { useState, useMemo } from 'react';
import {
  GitMerge,
  UserPlus,
  Search,
  RotateCcw,
  ArrowUp,
  Info,
  ChevronRight,
  Shield,
  ExternalLink,
  Award,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Smartphone,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { Member, Leg } from '../types';
import { formatCurrency } from '../utils/mlmEngine';

interface GenealogyTreeViewProps {
  members: Member[];
  rootMemberId: string;
  onSelectRoot: (memberId: string) => void;
  onOpenAddMember: (placementId: string, leg: Leg) => void;
  lang: 'en' | 'hi';
}

export const GenealogyTreeView: React.FC<GenealogyTreeViewProps> = ({
  members,
  rootMemberId,
  onSelectRoot,
  onOpenAddMember,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'VISUAL' | 'MOBILE_CARDS'>('VISUAL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const memberMap = useMemo(() => {
    return new Map<string, Member>(members.map((m) => [m.id, m]));
  }, [members]);

  const currentRoot = memberMap.get(rootMemberId) || members[0];

  // Node details modal
  const selectedMember = selectedNodeId ? memberMap.get(selectedNodeId) : null;

  // Search filtered
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return members.filter(
      (m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
    );
  }, [members, searchQuery]);

  // Renders a single Node Card in the visual tree
  const renderNodeCard = (memberId: string | null | undefined, parentId: string, leg: Leg) => {
    if (!memberId) {
      // Empty position
      return (
        <div
          onClick={() => onOpenAddMember(parentId, leg)}
          className="group cursor-pointer w-40 sm:w-48 min-h-[105px] rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500/80 bg-slate-900/50 hover:bg-emerald-950/20 p-3 flex flex-col items-center justify-center transition-all duration-200 text-center shadow-md"
        >
          <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-emerald-500/20 border border-slate-700 group-hover:border-emerald-500/50 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
            <UserPlus className="w-4 h-4" />
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-400 group-hover:text-emerald-300">
            {lang === 'hi' ? `+ खाली (${leg === 'LEFT' ? 'बाएं' : 'दाएं'})` : `+ Vacant ${leg}`}
          </p>
          <span className="text-[10px] text-slate-500 group-hover:text-emerald-400/80">
            {lang === 'hi' ? 'सदस्य जोड़ें' : 'Add downline'}
          </span>
        </div>
      );
    }

    const member = memberMap.get(memberId);
    if (!member) return null;

    const isCurrentRoot = member.id === currentRoot.id;

    return (
      <div
        onClick={() => setSelectedNodeId(member.id)}
        className={`cursor-pointer w-40 sm:w-48 rounded-xl border transition-all duration-200 bg-slate-900/90 shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/60 relative overflow-hidden group ${
          isCurrentRoot
            ? 'border-emerald-500 ring-2 ring-emerald-500/30'
            : 'border-slate-700/80'
        }`}
      >
        {/* Top Header bar with Rank / Leg */}
        <div className="px-2.5 py-1 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between text-[10px]">
          <span className="font-mono font-bold text-emerald-400">{member.id}</span>
          <span
            className={`font-semibold px-1.5 py-0.2 rounded text-[9px] ${
              member.leg === 'LEFT'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {member.leg}
          </span>
        </div>

        {/* Member Basic Info */}
        <div className="p-2.5 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs shrink-0">
              {member.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate leading-tight group-hover:text-emerald-300 transition-colors">
                {member.name}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">{member.packageName}</p>
            </div>
          </div>

          {/* Left / Right BV indicators */}
          <div className="pt-1.5 border-t border-slate-800 grid grid-cols-2 gap-1 text-[10px] font-mono">
            <div className="bg-slate-950/60 rounded px-1.5 py-0.5 text-blue-400 truncate">
              L: {member.leftBV.toLocaleString()}
            </div>
            <div className="bg-slate-950/60 rounded px-1.5 py-0.5 text-emerald-400 truncate text-right">
              R: {member.rightBV.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Drill down action button */}
        {!isCurrentRoot && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectRoot(member.id);
            }}
            className="w-full py-1 bg-slate-800/90 hover:bg-emerald-600 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1 border-t border-slate-700/50"
          >
            <span>{lang === 'hi' ? 'ट्री में शीर्ष बनाएं' : 'Make Root'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  };

  const leftChild = currentRoot.leftChildId ? memberMap.get(currentRoot.leftChildId) : null;
  const rightChild = currentRoot.rightChildId ? memberMap.get(currentRoot.rightChildId) : null;

  return (
    <div className="space-y-6">
      {/* Control Bar: Search, View Mode, Breadcrumb */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {lang === 'hi' ? 'बाइनरी जेनेऑलॉजी ट्री' : 'Binary Genealogy Tree'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'लेफ्ट एवं राइट लेग संरचना, डायरेक्ट डाउनलाइन व स्पिलओवर प्लेसमेंट'
                : 'Dual-leg binary structure showing 1:1 matching and direct placements'}
            </p>
          </div>

          {/* View Mode Switcher + Zoom Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800">
              <button
                onClick={() => setViewMode('VISUAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'VISUAL'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'विजुअल ट्री' : 'Visual Tree'}</span>
              </button>
              <button
                onClick={() => setViewMode('MOBILE_CARDS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'MOBILE_CARDS'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'मोबाइल कार्ड्स' : 'Mobile Cards'}</span>
              </button>
            </div>

            {/* Zoom Controls (only for visual tree) */}
            {viewMode === 'VISUAL' && (
              <div className="flex items-center rounded-xl bg-slate-950/80 p-1 border border-slate-800">
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.15))}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-[11px] text-slate-300 font-bold">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(1.4, prev + 0.15))}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Reset to Master Root */}
            {currentRoot.id !== members[0].id && (
              <button
                onClick={() => onSelectRoot(members[0].id)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'शीर्ष पर जाएं' : 'Reset Top'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'hi'
                ? 'आईडी या नाम से वितरक खोजें और ट्री में नेविगेट करें...'
                : 'Search member ID or name to jump in tree...'
            }
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-1 divide-y divide-slate-800">
              {searchResults.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    onSelectRoot(m.id);
                    setSearchQuery('');
                  }}
                  className="p-2 hover:bg-slate-900 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400">{m.id}</span>
                    <span className="text-white font-medium">{m.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {m.packageName} • {m.leg} Leg
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: MOBILE RESPONSIVE CARDS (No horizontal overflow on small phones) */}
      {viewMode === 'MOBILE_CARDS' ? (
        <div className="space-y-4">
          {/* Current Root Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">
                ★ {lang === 'hi' ? 'वर्तमान शीर्ष नोड' : 'Current Root Distributor'}
              </span>
              <span className="text-xs font-bold text-amber-300">{currentRoot.rank}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                {currentRoot.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{currentRoot.name}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  ID: {currentRoot.id} • {currentRoot.packageName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
              <div className="p-2 rounded-lg bg-slate-950/70 text-blue-400">
                <span className="block text-[10px] text-slate-500">Left BV:</span>
                <span className="font-mono font-bold text-sm">
                  {currentRoot.leftBV.toLocaleString()} BV
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/70 text-emerald-400">
                <span className="block text-[10px] text-slate-500">Right BV:</span>
                <span className="font-mono font-bold text-sm">
                  {currentRoot.rightBV.toLocaleString()} BV
                </span>
              </div>
            </div>
          </div>

          {/* Dual Legs Vertical Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LEFT LEG CONTAINER */}
            <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span>{lang === 'hi' ? 'लेफ्ट लेग (Team A)' : 'Left Leg (Team A)'}</span>
                </h3>
              </div>

              {leftChild ? (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{leftChild.name}</h4>
                      <span className="text-[11px] font-mono text-blue-400 font-bold">
                        {leftChild.id}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectRoot(leftChild.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-[10px] text-slate-200 hover:text-white font-bold transition-colors"
                    >
                      {lang === 'hi' ? 'शीर्ष बनाएं' : 'Make Root'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900 p-2 rounded-lg">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Package:</span>
                      <span className="text-white font-bold">{leftChild.packageName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Downlines:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        L: {leftChild.leftBV.toLocaleString()} | R: {leftChild.rightBV.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Level 2 children inside Left */}
                  <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
                    <div className="text-[11px]">
                      <span className="text-[10px] text-slate-500 block">Sub-Left:</span>
                      {leftChild.leftChildId ? (
                        <button
                          onClick={() => onSelectRoot(leftChild.leftChildId!)}
                          className="font-mono text-blue-400 hover:underline font-bold"
                        >
                          {leftChild.leftChildId}
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenAddMember(leftChild.id, 'LEFT')}
                          className="text-emerald-400 text-[10px] hover:underline"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                    <div className="text-[11px]">
                      <span className="text-[10px] text-slate-500 block">Sub-Right:</span>
                      {leftChild.rightChildId ? (
                        <button
                          onClick={() => onSelectRoot(leftChild.rightChildId!)}
                          className="font-mono text-emerald-400 hover:underline font-bold"
                        >
                          {leftChild.rightChildId}
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenAddMember(leftChild.id, 'RIGHT')}
                          className="text-emerald-400 text-[10px] hover:underline"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onOpenAddMember(currentRoot.id, 'LEFT')}
                  className="w-full py-6 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500/70 bg-slate-950/40 hover:bg-blue-950/20 text-center flex flex-col items-center justify-center transition-colors"
                >
                  <UserPlus className="w-5 h-5 text-blue-400 mb-1" />
                  <span className="text-xs font-bold text-slate-300">
                    {lang === 'hi' ? '+ लेफ्ट में नया वितरक जोड़ें' : '+ Place in Left Leg'}
                  </span>
                </button>
              )}
            </div>

            {/* RIGHT LEG CONTAINER */}
            <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span>{lang === 'hi' ? 'राइट लेग (Team B)' : 'Right Leg (Team B)'}</span>
                </h3>
              </div>

              {rightChild ? (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{rightChild.name}</h4>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        {rightChild.id}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectRoot(rightChild.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 text-[10px] text-slate-200 hover:text-white font-bold transition-colors"
                    >
                      {lang === 'hi' ? 'शीर्ष बनाएं' : 'Make Root'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900 p-2 rounded-lg">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Package:</span>
                      <span className="text-white font-bold">{rightChild.packageName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Downlines:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        L: {rightChild.leftBV.toLocaleString()} | R: {rightChild.rightBV.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Level 2 children inside Right */}
                  <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
                    <div className="text-[11px]">
                      <span className="text-[10px] text-slate-500 block">Sub-Left:</span>
                      {rightChild.leftChildId ? (
                        <button
                          onClick={() => onSelectRoot(rightChild.leftChildId!)}
                          className="font-mono text-blue-400 hover:underline font-bold"
                        >
                          {rightChild.leftChildId}
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenAddMember(rightChild.id, 'LEFT')}
                          className="text-emerald-400 text-[10px] hover:underline"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                    <div className="text-[11px]">
                      <span className="text-[10px] text-slate-500 block">Sub-Right:</span>
                      {rightChild.rightChildId ? (
                        <button
                          onClick={() => onSelectRoot(rightChild.rightChildId!)}
                          className="font-mono text-emerald-400 hover:underline font-bold"
                        >
                          {rightChild.rightChildId}
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenAddMember(rightChild.id, 'RIGHT')}
                          className="text-emerald-400 text-[10px] hover:underline"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onOpenAddMember(currentRoot.id, 'RIGHT')}
                  className="w-full py-6 rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500/70 bg-slate-950/40 hover:bg-emerald-950/20 text-center flex flex-col items-center justify-center transition-colors"
                >
                  <UserPlus className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-xs font-bold text-slate-300">
                    {lang === 'hi' ? '+ राइट में नया वितरक जोड़ें' : '+ Place in Right Leg'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: VISUAL TREE CANVAS WITH RESPONSIVE OVERFLOW & PAN */
        <div className="p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-x-auto min-h-[460px]">
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 pb-4 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>{lang === 'hi' ? 'लेफ्ट लेग (Team A)' : 'Left Leg'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>{lang === 'hi' ? 'राइट लेग (Team B)' : 'Right Leg'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-dashed border-slate-500"></div>
              <span>{lang === 'hi' ? 'खाली स्थान' : 'Vacant Slot'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? '1:1 पेयर मैचिंग' : '1:1 Match'}</span>
            </div>
          </div>

          {/* Tree Diagram Container with dynamic zoom */}
          <div
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
            className="flex flex-col items-center space-y-6 min-w-[580px] sm:min-w-[680px] transition-transform duration-200 py-2"
          >
            {/* LEVEL 0: ROOT */}
            <div className="flex flex-col items-center">
              {renderNodeCard(currentRoot.id, currentRoot.id, currentRoot.leg)}

              {/* Vertical connector line */}
              <div className="w-0.5 h-6 bg-slate-700"></div>

              {/* Horizontal branch line */}
              <div className="w-72 sm:w-80 h-0.5 bg-slate-700 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500"></div>
                <div className="absolute left-0 top-0 w-0.5 h-6 bg-slate-700"></div>
                <div className="absolute right-0 top-0 w-0.5 h-6 bg-slate-700"></div>
              </div>
            </div>

            {/* LEVEL 1: LEFT & RIGHT CHILDREN */}
            <div className="grid grid-cols-2 gap-8 sm:gap-16 w-full max-w-2xl">
              {/* Left Sub-tree */}
              <div className="flex flex-col items-center">
                <div className="text-[11px] font-bold text-blue-400 mb-2 uppercase tracking-wider">
                  ◀ {lang === 'hi' ? 'लेफ्ट लेग' : 'Left Leg'}
                </div>
                {renderNodeCard(currentRoot.leftChildId, currentRoot.id, 'LEFT')}

                {/* Level 2 children inside Left */}
                {leftChild && (
                  <>
                    <div className="w-0.5 h-6 bg-slate-700 mt-2"></div>
                    <div className="w-40 sm:w-48 h-0.5 bg-slate-700 relative">
                      <div className="absolute left-0 top-0 w-0.5 h-5 bg-slate-700"></div>
                      <div className="absolute right-0 top-0 w-0.5 h-5 bg-slate-700"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-5 w-full">
                      <div className="flex justify-center">
                        {renderNodeCard(leftChild.leftChildId, leftChild.id, 'LEFT')}
                      </div>
                      <div className="flex justify-center">
                        {renderNodeCard(leftChild.rightChildId, leftChild.id, 'RIGHT')}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Sub-tree */}
              <div className="flex flex-col items-center">
                <div className="text-[11px] font-bold text-emerald-400 mb-2 uppercase tracking-wider">
                  {lang === 'hi' ? 'राइट लेग' : 'Right Leg'} ▶
                </div>
                {renderNodeCard(currentRoot.rightChildId, currentRoot.id, 'RIGHT')}

                {/* Level 2 children inside Right */}
                {rightChild && (
                  <>
                    <div className="w-0.5 h-6 bg-slate-700 mt-2"></div>
                    <div className="w-40 sm:w-48 h-0.5 bg-slate-700 relative">
                      <div className="absolute left-0 top-0 w-0.5 h-5 bg-slate-700"></div>
                      <div className="absolute right-0 top-0 w-0.5 h-5 bg-slate-700"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-5 w-full">
                      <div className="flex justify-center">
                        {renderNodeCard(rightChild.leftChildId, rightChild.id, 'LEFT')}
                      </div>
                      <div className="flex justify-center">
                        {renderNodeCard(rightChild.rightChildId, rightChild.id, 'RIGHT')}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Node Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setSelectedNodeId(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-xl">
                {selectedMember.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedMember.name}</h3>
                <p className="text-xs font-mono text-emerald-400">ID: {selectedMember.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Package:</span>
                <span className="font-bold text-white">{selectedMember.packageName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Rank:</span>
                <span className="font-bold text-amber-300">{selectedMember.rank}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Left BV:</span>
                <span className="font-mono font-bold text-blue-400">
                  {selectedMember.leftBV.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Right BV:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {selectedMember.rightBV.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onSelectRoot(selectedMember.id);
                  setSelectedNodeId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                {lang === 'hi' ? 'ट्री में इस सदस्य को शीर्ष बनाएं' : 'Make Root in Tree'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
