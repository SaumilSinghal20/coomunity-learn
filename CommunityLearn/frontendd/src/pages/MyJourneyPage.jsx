import { useState } from 'react';
import {
  TrendingUp, Trophy, Zap, Target, Star, Flame,
  CheckCircle2, Calendar, BookOpen, Brain, ArrowUpRight,
  Award, Lock, ChevronRight, BarChart3, Clock
} from 'lucide-react';
import { ALL_BADGES, isBadgeEarned } from '../data/badges';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const GlowCard = ({ children, className = '', style = {} }) => (
  <div
    className={`rounded-2xl border border-white/[0.07] bg-[#101720] ${className}`}
    style={style}
  >
    {children}
  </div>
);

const ProgressBar = ({ pct, gradient, height = 'h-2' }) => (
  <div className={`w-full bg-white/[0.08] rounded-full ${height} overflow-hidden`}>
    <div
      className={`${height} rounded-full transition-all duration-700`}
      style={{ width: `${Math.max(pct, 2)}%`, background: gradient }}
    />
  </div>
);

const StatChip = ({ icon: Icon, color, label, value }) => (
  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm text-gray-300">{label}</span>
    </div>
    <span className="text-sm font-bold text-white">{value}</span>
  </div>
);

// ─── Mini ring SVG ────────────────────────────────────────────────────────────
const Ring = ({ pct, color, size = 72, stroke = 6, label }) => {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-white leading-none">{pct}%</span>
          {pct > 0 && <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400 mt-0.5" />}
        </div>
      </div>
      <p className="text-[10px] text-gray-500 text-center font-medium">{label}</p>
    </div>
  );
};

// ─── Timeline milestone ───────────────────────────────────────────────────────
const Milestone = ({ icon, color, bg, title, desc, time, done }) => (
  <div className={`flex gap-4 py-3 border-b border-white/[0.04] last:border-0 ${done ? '' : 'opacity-40'}`}>
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
      <icon.type className={`w-4 h-4 ${color}`} {...icon.props} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-white leading-tight">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-[10px] text-gray-600">{time}</p>
      {done
        ? <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto mt-1" />
        : <Lock className="w-4 h-4 text-gray-700 ml-auto mt-1" />
      }
    </div>
  </div>
);

// ─── Subject progress row ─────────────────────────────────────────────────────
const SubjectRow = ({ name, pct, gradient, color, quizCount }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-sm font-medium text-gray-300">{name}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-600">{quizCount} quizzes</span>
        <span className="text-sm font-bold" style={{ color }}>{pct}%</span>
      </div>
    </div>
    <ProgressBar pct={pct} gradient={gradient} />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  MY JOURNEY PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const MyJourneyPage = ({ userProgress, currentUser, onTabChange }) => {
  const [badgeTab, setBadgeTab] = useState('earned');

  const pts           = userProgress.points        || 0;
  const lvl           = userProgress.level         || 1;
  const quizzes       = userProgress.quizzes       || 0;
  const sessions      = userProgress.sessions      || 0;
  const perfectScores = userProgress.perfectScores || 0;
  const streak        = userProgress.streak        || 0;

  const ptsInLevel  = pts % 200;
  const ptsToNext   = 200 - ptsInLevel;
  const progressPct = Math.round((ptsInLevel / 200) * 100);

  // Subject breakdowns (derived from progress)
  const mathPct    = Math.min(100, Math.round(pts / 20));
  const progPct    = Math.min(100, quizzes * 10);
  const sciPct     = Math.min(100, (lvl - 1) * 5 + 3);
  const historyPct = Math.min(100, sessions * 15);
  const overallPct = Math.min(100, Math.round((mathPct + progPct + sciPct + historyPct) / 4));

  const subjects = [
    { name:'Mathematics', pct:mathPct, gradient:'linear-gradient(90deg,#6366f1,#818cf8)', color:'#818cf8',  quizCount: Math.round(quizzes * 0.4) },
    { name:'Programming',  pct:progPct, gradient:'linear-gradient(90deg,#8b5cf6,#c084fc)', color:'#c084fc',  quizCount: Math.round(quizzes * 0.3) },
    { name:'Science',      pct:sciPct,  gradient:'linear-gradient(90deg,#10b981,#34d399)', color:'#34d399',  quizCount: Math.round(quizzes * 0.2) },
    { name:'History',      pct:historyPct, gradient:'linear-gradient(90deg,#f59e0b,#fbbf24)', color:'#fbbf24', quizCount: Math.round(quizzes * 0.1) },
  ];

  // Badges
  const earnedBadges  = ALL_BADGES.filter(b => isBadgeEarned(b, userProgress));
  const lockedBadges  = ALL_BADGES.filter(b => !isBadgeEarned(b, userProgress));
  const displayBadges = badgeTab === 'earned' ? earnedBadges : lockedBadges;

  const BADGE_COLORS = [
    'bg-gradient-to-br from-violet-500 to-indigo-600',
    'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-gradient-to-br from-amber-500 to-orange-600',
    'bg-gradient-to-br from-rose-500 to-pink-600',
    'bg-gradient-to-br from-cyan-500 to-blue-600',
  ];

  // Journey timeline
  const milestones = [
    {
      icon:  <CheckCircle2 className="w-4 h-4" />,
      bg:    'bg-emerald-600/25', color: 'text-emerald-400',
      title: 'Joined CommunityLearn',
      desc:  'Your learning journey officially began.',
      time:  'Day 1',
      done:  true,
    },
    {
      icon:  <Brain className="w-4 h-4" />,
      bg:    'bg-violet-600/25', color: 'text-violet-400',
      title: 'Completed First Quiz',
      desc:  `${quizzes} quiz${quizzes !== 1 ? 'zes' : ''} completed so far.`,
      time:  quizzes > 0 ? 'Done' : 'Pending',
      done:  quizzes > 0,
    },
    {
      icon:  <Calendar className="w-4 h-4" />,
      bg:    'bg-blue-600/25', color: 'text-blue-400',
      title: 'Booked First Session',
      desc:  `${sessions} session${sessions !== 1 ? 's' : ''} booked with mentors.`,
      time:  sessions > 0 ? 'Done' : 'Pending',
      done:  sessions > 0,
    },
    {
      icon:  <Star className="w-4 h-4" />,
      bg:    'bg-amber-600/25', color: 'text-amber-400',
      title: 'Scored Perfect on a Quiz',
      desc:  `${perfectScores} perfect score${perfectScores !== 1 ? 's' : ''} achieved.`,
      time:  perfectScores > 0 ? 'Done' : 'Pending',
      done:  perfectScores > 0,
    },
    {
      icon:  <Trophy className="w-4 h-4" />,
      bg:    'bg-yellow-600/25', color: 'text-yellow-400',
      title: 'Reached Level 5',
      desc:  'Keep earning XP to hit level milestones.',
      time:  lvl >= 5 ? 'Done' : `Level ${lvl}/5`,
      done:  lvl >= 5,
    },
    {
      icon:  <Flame className="w-4 h-4" />,
      bg:    'bg-orange-600/25', color: 'text-orange-400',
      title: '7-Day Learning Streak',
      desc:  `Current streak: ${streak} day${streak !== 1 ? 's' : ''}.`,
      time:  streak >= 7 ? 'Done' : `${streak}/7 days`,
      done:  streak >= 7,
    },
    {
      icon:  <Award className="w-4 h-4" />,
      bg:    'bg-pink-600/25', color: 'text-pink-400',
      title: 'Unlock 10 Badges',
      desc:  `${earnedBadges.length} of ${ALL_BADGES.length} badges unlocked.`,
      time:  earnedBadges.length >= 10 ? 'Done' : `${earnedBadges.length}/10`,
      done:  earnedBadges.length >= 10,
    },
  ];

  const doneCount = milestones.filter(m => m.done).length;

  return (
    <div className="space-y-5">

      {/* ── Page header banner ─────────────────────────────────────────────── */}
      <GlowCard
        className="p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#161d2e 0%,#111827 60%,#0f172a 100%)' }}
      >
        <div className="pointer-events-none absolute -top-8 right-10 w-56 h-56 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-24 w-36 h-36 rounded-full bg-indigo-700/10 blur-2xl" />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">My Journey</p>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {currentUser?.name?.split(' ')[0] || 'Student'}'s Learning Story
            </h1>
            <p className="text-sm text-gray-500">
              {doneCount} of {milestones.length} milestones reached · Level {lvl} · {pts} XP earned
            </p>
          </div>

          {/* XP summary chips */}
          <div className="flex gap-2.5 flex-shrink-0">
            {[
              { val: lvl,           sub: 'Level',    bg: 'bg-indigo-600/30 border-indigo-500/30',  textColor: 'text-indigo-300'  },
              { val: pts,           sub: 'XP',       bg: 'bg-violet-600/25 border-violet-500/30',  textColor: 'text-violet-300'  },
              { val: earnedBadges.length, sub: 'Badges', bg: 'bg-amber-600/25 border-amber-500/30', textColor: 'text-amber-300' },
            ].map((s, i) => (
              <div key={i} className={`flex flex-col items-center justify-center w-[68px] h-[68px] rounded-2xl border text-center ${s.bg}`}>
                <span className="text-xl font-black text-white leading-none">{s.val}</span>
                <span className={`text-[9px] mt-1 ${s.textColor}`}>{s.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Level progress bar */}
        <div className="relative mt-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Level {lvl} — {ptsInLevel} / 200 XP</span>
            <span className="text-violet-400 font-semibold">{progressPct}% · {ptsToNext} XP to Level {lvl + 1}</span>
          </div>
          <ProgressBar
            pct={progressPct}
            gradient="linear-gradient(90deg,#7c3aed,#6366f1,#818cf8)"
            height="h-2.5"
          />
        </div>
      </GlowCard>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── LEFT: Stats + Subject progress ─────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Zap,          color: 'text-violet-400', bg: 'bg-violet-600/20', label: 'XP Points',     val: pts          },
              { icon: BookOpen,     color: 'text-blue-400',   bg: 'bg-blue-600/20',   label: 'Quizzes Done',  val: quizzes      },
              { icon: Calendar,     color: 'text-emerald-400',bg: 'bg-emerald-600/20',label: 'Sessions',       val: sessions     },
              { icon: Target,       color: 'text-amber-400',  bg: 'bg-amber-600/20',  label: 'Perfect Scores', val: perfectScores},
            ].map((s, i) => (
              <div key={i} className="rounded-xl bg-[#101720] border border-white/[0.07] p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition-transform">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className="text-2xl font-black text-white leading-none">{s.val}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Subject progress */}
          <GlowCard className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Subject Progress</h3>
              </div>
              <span className="text-[10px] text-gray-600">Based on your quiz activity</span>
            </div>

            {/* Rings row */}
            <div className="flex items-center justify-around mb-6 pb-5 border-b border-white/[0.05]">
              <Ring pct={mathPct}    color="#6366f1" label="Mathematics" />
              <Ring pct={progPct}    color="#8b5cf6" label="Programming" />
              <Ring pct={sciPct}     color="#10b981" label="Science"     />
              <Ring pct={historyPct} color="#f59e0b" label="History"     />
              <Ring pct={overallPct} color="#ec4899" label="Overall" size={80} stroke={7} />
            </div>

            {/* Bar rows */}
            <div className="flex flex-col gap-4">
              {subjects.map((s, i) => (
                <SubjectRow key={i} {...s} />
              ))}
            </div>

            {/* Tip */}
            <div className="mt-4 px-4 py-2.5 rounded-xl bg-violet-600/10 border border-violet-500/20">
              <p className="text-xs text-gray-400">
                💡 Complete more <span className="text-violet-300 font-semibold">Mathematics</span> and{' '}
                <span className="text-violet-300 font-semibold">Programming</span> quizzes to push your overall score higher.
              </p>
            </div>
          </GlowCard>

          {/* Personal stats detail */}
          <GlowCard className="p-5">
            <h3 className="text-sm font-bold text-white mb-4">Detailed Stats</h3>
            <div className="flex flex-col gap-2">
              <StatChip icon={Calendar}     color="text-blue-400"   label="Sessions Booked"  value={sessions}                          />
              <StatChip icon={Star}         color="text-yellow-400" label="Perfect Quizzes"   value={perfectScores}                     />
              <StatChip icon={Flame}        color="text-orange-400" label="Current Streak"    value={`${streak} day${streak!==1?'s':''}`} />
              <StatChip icon={Trophy}       color="text-amber-400"  label="Current Level"     value={`Level ${lvl}`}                    />
              <StatChip icon={Zap}          color="text-violet-400" label="XP to Next Level"  value={`${ptsToNext} XP`}                 />
              <StatChip icon={Award}        color="text-pink-400"   label="Badges Earned"     value={`${earnedBadges.length} / ${ALL_BADGES.length}`} />
            </div>
          </GlowCard>
        </div>

        {/* ── RIGHT: Timeline + Badges ─────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Journey timeline */}
          <GlowCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Milestones</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">
                {doneCount}/{milestones.length} done
              </span>
            </div>

            {/* overall milestone bar */}
            <ProgressBar
              pct={Math.round((doneCount / milestones.length) * 100)}
              gradient="linear-gradient(90deg,#10b981,#34d399)"
              height="h-1.5"
            />
            <p className="text-[10px] text-gray-600 mt-1.5 mb-4">
              {Math.round((doneCount / milestones.length) * 100)}% of journey milestones reached
            </p>

            <div>
              {milestones.map((m, i) => (
                <Milestone key={i} {...m} />
              ))}
            </div>
          </GlowCard>

          {/* Badges section */}
          <GlowCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Badges</h3>
              <div className="flex rounded-xl overflow-hidden border border-white/[0.08]">
                {['earned', 'locked'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setBadgeTab(tab)}
                    className={`px-3 py-1 text-[10px] font-bold capitalize transition-all ${
                      badgeTab === tab
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/[0.03] text-gray-500 hover:text-white'
                    }`}
                  >
                    {tab} ({tab === 'earned' ? earnedBadges.length : lockedBadges.length})
                  </button>
                ))}
              </div>
            </div>

            {displayBadges.length === 0 ? (
              <div className="py-8 text-center">
                <Trophy className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-600 text-xs">
                  {badgeTab === 'earned' ? 'No badges earned yet. Complete quizzes to start!' : 'All badges unlocked! 🎉'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                {displayBadges.map((b, i) => (
                  <div key={b.id} className="flex flex-col items-center gap-1.5 group relative">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all ${
                      badgeTab === 'earned'
                        ? `${BADGE_COLORS[i % BADGE_COLORS.length]} border-white/20 shadow-lg group-hover:scale-110`
                        : 'bg-white/5 border-white/10 grayscale opacity-35'
                    }`}>
                      {badgeTab === 'earned' ? b.icon : <Lock className="w-5 h-5 text-gray-600" />}
                    </div>
                    <p className={`text-[9px] text-center leading-tight max-w-[58px] ${
                      badgeTab === 'earned' ? 'text-gray-400' : 'text-gray-700'
                    }`}>{b.name}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onTabChange && onTabChange('achievements')}
              className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition-all"
              style={{ background:'linear-gradient(90deg,#7c3aed,#4f46e5)', border:'1px solid rgba(139,92,246,0.3)' }}
            >
              <Trophy className="w-3.5 h-3.5" />
              View All {ALL_BADGES.length} Achievements
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </GlowCard>

        </div>
      </div>
    </div>
  );
};

const BADGE_COLORS = [
  'bg-gradient-to-br from-violet-500 to-indigo-600',
  'bg-gradient-to-br from-emerald-500 to-teal-600',
  'bg-gradient-to-br from-amber-500 to-orange-600',
  'bg-gradient-to-br from-rose-500 to-pink-600',
  'bg-gradient-to-br from-cyan-500 to-blue-600',
];

export default MyJourneyPage;
