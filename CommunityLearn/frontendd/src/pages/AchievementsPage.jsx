import { Trophy, Star, Zap, Lock, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import { ALL_BADGES, isBadgeEarned } from '../data/badges';

const BADGE_COLORS = [
  'from-violet-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-purple-600',
  'from-sky-500 to-indigo-500',
  'from-lime-500 to-emerald-500',
];

const CATEGORIES = [
  { id: 'all',       label: 'All Badges',    icon: Trophy },
  { id: 'learning',  label: 'Learning',      icon: TrendingUp },
  { id: 'quiz',      label: 'Quizzes',       icon: Star },
  { id: 'session',   label: 'Sessions',      icon: CheckCircle2 },
  { id: 'streak',    label: 'Streaks',       icon: Zap },
  { id: 'milestone', label: 'Milestones',    icon: Award },
];

// Map each badge to a category by keyword matching on name/description
const getBadgeCategory = (badge) => {
  const text = `${badge.name} ${badge.description || ''}`.toLowerCase();
  if (text.includes('quiz') || text.includes('perfect') || text.includes('score'))  return 'quiz';
  if (text.includes('session') || text.includes('book') || text.includes('mentor')) return 'session';
  if (text.includes('streak') || text.includes('day') || text.includes('daily'))    return 'streak';
  if (text.includes('level') || text.includes('xp') || text.includes('point') || text.includes('first')) return 'milestone';
  return 'learning';
};

import { useState } from 'react';

const AchievementsPage = ({ userProgress }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredBadge,   setHoveredBadge]   = useState(null);

  const earnedBadges  = ALL_BADGES.filter(b => isBadgeEarned(b, userProgress));
  const lockedBadges  = ALL_BADGES.filter(b => !isBadgeEarned(b, userProgress));
  const earnedPct     = Math.round((earnedBadges.length / ALL_BADGES.length) * 100);

  const filtered = ALL_BADGES.filter(b =>
    activeCategory === 'all' || getBadgeCategory(b) === activeCategory
  );

  const filteredEarned = filtered.filter(b => isBadgeEarned(b, userProgress));
  const filteredLocked = filtered.filter(b => !isBadgeEarned(b, userProgress));

  return (
    <div
      className="min-h-screen bg-[#0c1118] text-white pb-12"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* ── Header banner ── */}
      <div
        className="rounded-2xl border border-white/[0.07] p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1a1030 0%,#111827 60%,#0f172a 100%)' }}
      >
        <div className="pointer-events-none absolute -top-10 right-10 w-56 h-56 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 w-40 h-40 rounded-full bg-indigo-700/10 blur-2xl" />

        <div className="relative flex items-center justify-between flex-wrap gap-6">
          {/* Left */}
          <div>
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Your Achievements</p>
            <h1 className="text-2xl font-black text-white mb-1">Badge Collection 🏆</h1>
            <p className="text-sm text-gray-400">
              You've unlocked <span className="text-violet-300 font-bold">{earnedBadges.length}</span> of{' '}
              <span className="text-white font-bold">{ALL_BADGES.length}</span> total badges.
            </p>
          </div>

          {/* Right — progress ring */}
          <div className="flex items-center gap-6">
            {/* Mini stats */}
            {[
              { label: 'Earned',  value: earnedBadges.length, color: 'text-violet-400' },
              { label: 'Locked',  value: lockedBadges.length,  color: 'text-gray-500'  },
              { label: 'Total',   value: ALL_BADGES.length,    color: 'text-white'      },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">{s.label}</p>
              </div>
            ))}

            {/* Progress bar */}
            <div className="w-32">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-gray-500">Progress</span>
                <span className="text-[10px] font-bold text-violet-300">{earnedPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-700"
                  style={{ width: `${earnedPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category filter tabs ── */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const count = cat.id === 'all'
            ? ALL_BADGES.length
            : ALL_BADGES.filter(b => getBadgeCategory(b) === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeCategory === cat.id
                  ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/30'
                  : 'bg-white/[0.04] border-white/[0.07] text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-gray-600'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Earned badges ── */}
      {filteredEarned.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Earned ({filteredEarned.length})</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredEarned.map((badge, i) => {
              const colorClass = BADGE_COLORS[i % BADGE_COLORS.length];
              const isHovered  = hoveredBadge === badge.id;
              return (
                <div
                  key={badge.id}
                  onMouseEnter={() => setHoveredBadge(badge.id)}
                  onMouseLeave={() => setHoveredBadge(null)}
                  className="relative flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-[#101720] border border-white/[0.07] hover:border-violet-500/40 hover:bg-[#131e30] transition-all duration-200 cursor-default group"
                >
                  {/* Glow */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  {/* Badge icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-3xl border-2 border-white/20 shadow-lg transition-transform duration-200 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                    {badge.icon}
                  </div>

                  {/* Name */}
                  <p className="text-xs font-bold text-white text-center leading-tight">{badge.name}</p>

                  {/* Description tooltip */}
                  {badge.description && (
                    <p className="text-[9px] text-gray-500 text-center leading-tight">{badge.description}</p>
                  )}

                  {/* Earned pill */}
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Earned
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Locked badges ── */}
      {filteredLocked.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-gray-600" />
            <h2 className="text-sm font-bold text-gray-500">Locked ({filteredLocked.length})</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredLocked.map((badge, i) => (
              <div
                key={badge.id}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-[#0d1117] border border-white/[0.04] opacity-60 cursor-default"
              >
                {/* Locked icon */}
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border-2 border-white/[0.08] flex items-center justify-center text-3xl grayscale">
                  {badge.icon}
                </div>

                {/* Name */}
                <p className="text-xs font-semibold text-gray-500 text-center leading-tight">{badge.name}</p>

                {/* Description */}
                {badge.description && (
                  <p className="text-[9px] text-gray-700 text-center leading-tight">{badge.description}</p>
                )}

                {/* Locked pill */}
                <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-700 border border-white/[0.06]">
                  🔒 Locked
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Trophy className="w-16 h-16 text-gray-800 mb-4" />
          <p className="text-gray-500 font-bold text-lg">No badges in this category</p>
          <p className="text-gray-700 text-sm mt-1">Try a different filter above</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;
