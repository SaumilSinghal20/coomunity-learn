import { useState } from 'react';
import {
  LayoutDashboard, BookOpen, Brain, FileQuestion, Trophy,
  LogOut, Calendar, Star, Flame, Users, TrendingUp,
  ChevronRight, ArrowUpRight, Clock, CheckCircle2, Zap
} from 'lucide-react';
import { ALL_BADGES, isBadgeEarned } from '../data/badges';

// ── Progress Ring SVG ──────────────────────────────────────────────────────────
const ProgressRing = ({ pct = 0, size = 90, stroke = 7, color = '#6366f1', label, sublabel }) => {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-white leading-none">{pct}%</span>
          {pct > 0 && <ArrowUpRight className="w-3 h-3 text-emerald-400 mt-0.5" />}
        </div>
      </div>
      {sublabel && <p className="text-[9px] text-gray-500 text-center">{sublabel}</p>}
      {label && <p className="text-xs font-semibold text-gray-300 text-center">• {label}</p>}
    </div>
  );
};

// ── Sparkline ─────────────────────────────────────────────────────────────────
const Sparkline = () => (
  <svg viewBox="0 0 200 55" className="w-full h-14" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#34d399" />
      </linearGradient>
      <linearGradient id="g3" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    <polyline points="0,48 50,28 100,38 150,12 200,8"  fill="none" stroke="url(#g1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="0,52 50,42 100,32 150,42 200,38" fill="none" stroke="url(#g2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="0,42 50,52 100,22 150,32 200,28" fill="none" stroke="url(#g3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Nav Item ──────────────────────────────────────────────────────────────────
const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon className="w-4 h-4 flex-shrink-0" />
    {label}
  </button>
);

// ── Stat Row ──────────────────────────────────────────────────────────────────
const StatRow = ({ icon: Icon, iconColor, label, value }) => (
  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span className="text-sm text-gray-300">{label}</span>
    </div>
    <span className="text-sm font-bold text-white">{value}</span>
  </div>
);

// ── Activity Row ──────────────────────────────────────────────────────────────
const ActivityRow = ({ icon: Icon, iconBg, text, highlight, time }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <p className="text-xs text-gray-400 truncate">
        {text} <span className="font-semibold text-white">{highlight}</span>
      </p>
    </div>
    <span className="text-[10px] text-gray-600 whitespace-nowrap ml-2 flex-shrink-0">{time}</span>
  </div>
);

// ── Badge Item ────────────────────────────────────────────────────────────────
const BadgeItem = ({ badge, earned, colorClass }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all ${
      earned
        ? `${colorClass} border-white/20 shadow-lg`
        : 'bg-white/5 border-white/10 grayscale opacity-35'
    }`}>
      {badge.icon}
    </div>
    <p className="text-[9px] text-gray-400 text-center leading-tight max-w-[60px]">{badge.name}</p>
  </div>
);

const BADGE_COLORS = [
  'bg-gradient-to-br from-violet-500 to-indigo-600',
  'bg-gradient-to-br from-emerald-500 to-teal-600',
  'bg-gradient-to-br from-amber-500 to-orange-600',
  'bg-gradient-to-br from-rose-500 to-pink-600',
  'bg-gradient-to-br from-cyan-500 to-blue-600',
];

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
const Dashboard = ({ userProgress, currentUser, onTabChange }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const mentors = JSON.parse(localStorage.getItem("mentors") || "[]");

  const pts           = userProgress.points        || 0;
  const lvl           = userProgress.level         || 1;
  const quizzes       = userProgress.quizzes       || 0;
  const sessions      = userProgress.sessions      || 0;
  const perfectScores = userProgress.perfectScores || 0;
  const streak        = userProgress.streak        || 0;

  const ptsInLevel  = pts % 200;
  const ptsToNext   = 200 - ptsInLevel;
  const progressPct = Math.round((ptsInLevel / 200) * 100);
  const mathPct     = Math.min(100, Math.round(pts / 20));
  const progPct     = Math.min(100, quizzes * 10);
  const sciPct      = Math.min(100, (lvl - 1) * 5 + 3);
  const overallPct  = Math.min(100, Math.round((mathPct + progPct + sciPct) / 3));

  const earnedBadges = ALL_BADGES.filter(b => isBadgeEarned(b, userProgress));
  const topBadges    = earnedBadges.slice(0, 3);
  const name         = currentUser?.name || 'Student';
  const firstName    = name.split(' ')[0];
  const initials     = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const navItems = [
    { id:'dashboard',    label:'Dashboard',    icon:LayoutDashboard },
    { id:'journey',      label:'My Journey',   icon:TrendingUp },
    { id:'resources',    label:'Resources',    icon:BookOpen },
    { id:'chat',         label:'AI Tutor',     icon:Brain },
    { id:'quizzes',      label:'Quizzes',      icon:FileQuestion },
    { id:'achievements', label:'Achievements', icon:Trophy },
  ];

  const handleNav = (id) => {
    setActiveNav(id);
    const mapped = { sessions:'sessions', resources:'resources', chat:'chat', quizzes:'quizzes', journey:'journey', achievements:'achievements' };
    if (onTabChange && mapped[id]) onTabChange(mapped[id]);
  };

  return (
    <div className="flex h-screen bg-[#0c1118] text-white overflow-hidden" style={{ fontFamily:"'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-[#101720] border-r border-white/[0.05] py-5 px-3 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-7">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[15px] tracking-tight">CommunityLearn</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map(n => (
            <NavItem key={n.id} icon={n.icon} label={n.label} active={activeNav === n.id} onClick={() => handleNav(n.id)} />
          ))}
        </nav>

        {/* Profile Card */}
        <div className="mt-5 rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2.5">My Profile</p>
          <p className="text-sm font-bold text-white leading-tight">{name}</p>
          <p className="text-xs text-gray-500 mb-3 capitalize">{currentUser?.role || 'Student'}</p>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-sm font-bold mb-4 shadow-lg">
            {initials}
          </div>
          <button
            onClick={() => onTabChange && onTabChange('logout')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] text-xs text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto bg-[#0c1118]">
        <div className="p-5 grid grid-cols-[1fr_300px] gap-5">

          {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* ① Your Journey */}
            <div className="rounded-2xl border border-white/[0.07] p-6 relative overflow-hidden"
              style={{ background:'linear-gradient(135deg,#161d2e 0%,#111827 60%,#0f172a 100%)' }}>
              <div className="pointer-events-none absolute -top-8 right-10 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 left-24 w-36 h-36 rounded-full bg-indigo-700/10 blur-2xl" />

              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Your Journey</p>

              <div className="flex items-start justify-between gap-4 relative">
                {/* Left: Welcome + bar */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-0.5">
                    Welcome Back, {firstName}! 👋
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">Your smart learning dashboard is ready.</p>

                  <p className="text-xs font-semibold text-gray-400 mb-1.5">Level {lvl} Progress</p>
                  <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden mb-1.5">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-violet-400 transition-all duration-700"
                      style={{ width: `${Math.max(progressPct, 2)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-600">
                    <span>0%</span>
                    <span>{progressPct}% to Level {lvl + 1}</span>
                  </div>
                </div>

                {/* Right: Stat boxes */}
                <div className="flex gap-2.5 flex-shrink-0">
                  <div className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-2xl bg-indigo-600/30 border border-indigo-500/30 text-center">
                    <span className="text-2xl font-black text-white leading-none">{lvl}</span>
                    <span className="text-[9px] text-indigo-300 mt-1">Level</span>
                  </div>
                  <div className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-2xl bg-white/[0.06] border border-white/[0.08] text-center">
                    <span className="text-2xl font-black text-white leading-none">{pts}</span>
                    <span className="text-[9px] text-gray-400 mt-1">XP Points</span>
                  </div>
                  <div className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-2xl bg-amber-600/25 border border-amber-500/30 text-center">
                    <span className="text-2xl font-black text-white leading-none">{earnedBadges.length}</span>
                    <span className="text-[9px] text-amber-300 mt-1">Badges</span>
                  </div>
                </div>
              </div>

              {/* Quizzes perfect */}
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.07]">
                <FileQuestion className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs text-gray-400">Quizzes Perfect: <span className="font-bold text-white">{perfectScores}</span></span>
              </div>
            </div>

            {/* ② Performance Insights */}
            <div className="rounded-2xl bg-[#101720] border border-white/[0.07] p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">Performance Insights</h3>
                <button className="text-[10px] text-violet-400 flex items-center gap-0.5 hover:text-violet-300">
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-stretch gap-5">
                {/* Rings */}
                <div className="flex items-center gap-6">
                  <ProgressRing pct={mathPct} size={86} stroke={7} color="#6366f1" sublabel="Progress Rings" label="Mathematics" />
                  <ProgressRing pct={progPct} size={86} stroke={7} color="#8b5cf6" sublabel="Progress Rings" label="Programming" />
                  <ProgressRing pct={sciPct}  size={86} stroke={7} color="#10b981" sublabel="Progress Rings" label="Science"     />
                </div>

                {/* Overall panel */}
                <div className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1">Overall Performance</p>
                    <p className="text-4xl font-black text-white">{overallPct}%</p>
                  </div>
                  <Sparkline />
                  <div className="flex justify-between mt-0.5">
                    {['Year','Year','Year','Year'].map((y,i) => <span key={i} className="text-[9px] text-gray-700">{y}</span>)}
                  </div>
                </div>
              </div>

              {/* Insight hint */}
              <div className="mt-4 px-4 py-2.5 rounded-xl bg-violet-600/10 border border-violet-500/20">
                <p className="text-xs text-gray-400">
                  Your general performance is solid. Try a{' '}
                  <span className="font-semibold text-violet-300">Mathematics</span> quiz to boost your score!
                </p>
              </div>
            </div>

            {/* ③ Bottom 2-col */}
            <div className="grid grid-cols-2 gap-5">
                {/* 👨‍🏫 AVAILABLE MENTORS */}
<div className="rounded-2xl bg-[#101720] border border-white/[0.07] p-5 mt-5">
  <h3 className="text-sm font-bold text-white mb-4">Available Mentors</h3>

  {mentors.length === 0 ? (
    <p className="text-gray-500 text-sm">No mentors available</p>
  ) : (
    <div className="space-y-3">
      {mentors.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
        >
          <div>
            <p className="text-white font-semibold">{m.name}</p>
            <p className="text-xs text-gray-400">{m.subject}</p>
          </div>

          <button
            onClick={() => onTabChange && onTabChange('sessions')}
            className="text-xs px-3 py-1 rounded bg-emerald-600 text-white"
          >
            Book
          </button>
        </div>
      ))}
    </div>
  )}
</div>

              {/* My Quizzes */}
              <div className="rounded-2xl bg-[#101720] border border-white/[0.07] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">My Quizzes</h3>
                  <button onClick={() => handleNav('quizzes')} className="text-[10px] text-violet-400 hover:text-violet-300 flex items-center gap-0.5">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3.5 mb-4">
                  <p className="text-[10px] text-gray-600 mb-1">Next Recommended Quiz:</p>
                  <p className="text-sm font-bold text-white">"Geometry Fundamentals"</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">Medium</span>
                    <span className="text-[10px] text-gray-600">+150 XP</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs text-gray-400">Done: <span className="text-white font-bold">{quizzes}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs text-gray-400">XP: <span className="text-white font-bold">{pts}</span></span>
                  </div>
                </div>
              </div>

              {/* Upcoming Sessions */}
              <div className="rounded-2xl bg-[#101720] border border-white/[0.07] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Upcoming Sessions</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">New</span>
                </div>
                <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3.5 mb-4">
                  <p className="text-[10px] text-gray-600 mb-1">Upcoming Session:</p>
                  <p className="text-sm font-bold text-white">'Science Lab' (Oct 28, 2PM)</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock className="w-3 h-3 text-violet-400" />
                    <span className="text-[10px] text-gray-600">Oct 28, 2PM</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs text-gray-400">Booked: <span className="text-white font-bold">{sessions}</span></span>
                  </div>
                  <button onClick={() => handleNav('sessions')} className="text-[10px] text-violet-400 hover:text-violet-300 flex items-center gap-0.5">
                    Book Now <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT COLUMN ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Personal Stats */}
            <div className="rounded-2xl bg-[#101720] border border-white/[0.07] p-5">
              <h3 className="text-sm font-bold text-white mb-4">Personal Stats</h3>
              <div className="flex flex-col gap-2">
                <StatRow icon={Calendar} iconColor="text-blue-400"   label="Sessions Booked" value={sessions}         />
                <StatRow icon={Star}     iconColor="text-yellow-400" label="Perfect Quizzes"  value={perfectScores}   />
                <StatRow icon={Flame}    iconColor="text-orange-400" label="Active Streak"    value={`${streak}d`}    />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl bg-[#101720] border border-white/[0.07] p-5">
              <h3 className="text-sm font-bold text-white mb-3">Recent Activity</h3>
              <ActivityRow icon={Users}        iconBg="bg-violet-600"  text="Joined"    highlight="CommunityLearn"             time="Just now"     />
              <ActivityRow icon={Trophy}       iconBg="bg-amber-600"   text="Earned"    highlight={`${earnedBadges.length} Badges`} time="1 day ago"   />
              <ActivityRow icon={CheckCircle2} iconBg="bg-emerald-600" text="Completed" highlight="First Session"               time="3 months ago" />
            </div>

            {/* Top Achievements */}
            <div className="rounded-2xl bg-[#101720] border border-white/[0.07] p-5">
              <h3 className="text-sm font-bold text-white mb-0.5">Top Achievements</h3>
              <p className="text-[10px] text-gray-600 mb-4">Top {Math.min(topBadges.length, 3) || 3} Unlocked Badges</p>

              <div className="flex gap-3 justify-around mb-5">
                {topBadges.length > 0
                  ? topBadges.map((b, i) => (
                    <BadgeItem key={b.id} badge={b} earned={true} colorClass={BADGE_COLORS[i % BADGE_COLORS.length]} />
                  ))
                  : null
                }
                {/* Fill placeholders */}
                {Array.from({ length: Math.max(0, 3 - topBadges.length) }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border-2 border-white/[0.08] flex items-center justify-center text-xl opacity-30">
                      {['🚀','📝','🌟'][topBadges.length + i]}
                    </div>
                    <p className="text-[9px] text-gray-700 text-center">Locked</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleNav('achievements')}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 hover:opacity-90"
                style={{ background:'linear-gradient(90deg,#7c3aed,#4f46e5)', border:'1px solid rgba(139,92,246,0.3)' }}
              >
                <Trophy className="w-3.5 h-3.5" />
                View All {ALL_BADGES.length} Achievements
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;