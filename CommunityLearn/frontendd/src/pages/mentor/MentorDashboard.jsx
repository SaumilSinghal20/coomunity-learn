import { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Star, DollarSign, Calendar,
  ChevronRight, ArrowUpRight, BookOpen, CheckCircle2,
  AlertCircle, Video, MessageSquare
} from 'lucide-react';
import {
  getMentorSessions,
  getMentorReviews,
  getMentorAvgRating,
  getUnreadCount,
  getMentorProfile,
} from '../../utils/sharedStore';

// ── Sparkline ─────────────────────────────────────────────────────────────────
const Sparkline = ({ points, color = '#10b981' }) => {
  const w = 80, h = 28;
  const xs  = points.map((_, i) => (i / (points.length - 1)) * w);
  const min = Math.min(...points), max = Math.max(...points);
  const ys  = points.map(p => h - ((p - min) / (max - min || 1)) * h);
  const d   = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StatCard = ({ icon: Icon, iconBg, label, value, sub, trend, trendUp, spark }) => (
  <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5 hover:border-emerald-700/40 transition-all duration-200">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {spark && <Sparkline points={spark} />}
    </div>
    <p className="text-2xl font-black text-white mb-0.5">{value}</p>
    <p className="text-xs text-gray-500 mb-2">{label}</p>
    {trend && (
      <div className={`flex items-center gap-1 text-[11px] font-semibold ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
        <ArrowUpRight className="w-3 h-3" />
        {trend} <span className="text-gray-600 font-normal ml-1">{sub}</span>
      </div>
    )}
  </div>
);

const SessionRow = ({ session }) => {
  const statusCls = {
    confirmed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    pending:   'bg-amber-500/20   text-amber-300   border-amber-500/30',
    completed: 'bg-gray-500/20    text-gray-400    border-gray-500/30',
    cancelled: 'bg-red-500/20     text-red-400     border-red-500/30',
  };
  const initials = (session.studentName||'S').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const colors   = ['from-blue-500 to-cyan-500','from-pink-500 to-rose-500','from-violet-500 to-purple-500','from-emerald-500 to-teal-500'];
  const color    = colors[(session.studentName||'').charCodeAt(0) % colors.length];

  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] rounded-xl px-2 -mx-2 transition-colors">
      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{initials}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{session.studentName || 'Student'}</p>
        <p className="text-[11px] text-gray-500">{session.subject}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-gray-300">{session.slot || '—'}</p>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusCls[session.status]||statusCls.pending}`}>
          {session.status}
        </span>
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const colors = ['from-blue-500 to-cyan-500','from-pink-500 to-rose-500','from-violet-500 to-purple-500'];
  const initials = (review.studentName||'S').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const color    = colors[(review.studentName||'').charCodeAt(0) % colors.length];
  return (
    <div className="rounded-xl bg-[#0a1a15] border border-white/[0.05] p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{initials}</div>
          <div>
            <p className="text-xs font-bold text-white">{review.studentName}</p>
            <p className="text-[10px] text-gray-600">{review.subject} · {new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({length:5}).map((_,i) => (
            <Star key={i} className={`w-3 h-3 ${i<review.rating?'fill-amber-400 text-amber-400':'text-gray-700'}`}/>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-gray-400 leading-relaxed">{review.text}</p>
    </div>
  );
};

// ── MENTOR DASHBOARD ──────────────────────────────────────────────────────────
const MentorDashboard = ({ currentUser, onTabChange }) => {
  const [sessions,    setSessions]    = useState([]);
  const [reviews,     setReviews]     = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile,     setProfile]     = useState(null);

  const load = () => {
    if (!currentUser?.id) return;
    const s = getMentorSessions(currentUser.id);
    setSessions(s);
    setReviews(getMentorReviews(currentUser.id));
    setUnreadCount(getUnreadCount(currentUser.id));
    setProfile(getMentorProfile(currentUser.id));
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 5000);
    window.addEventListener('cl_session_update', load);
    window.addEventListener('cl_review_update',  load);
    window.addEventListener('cl_message_update', load);
    return () => {
      clearInterval(iv);
      window.removeEventListener('cl_session_update', load);
      window.removeEventListener('cl_review_update',  load);
      window.removeEventListener('cl_message_update', load);
    };
  }, [currentUser]);

  const name        = profile?.name || currentUser?.name || 'Mentor';
  const firstName   = name.split(' ')[0];
  const totalEarned = sessions.filter(s=>s.status==='completed').reduce((a,s)=>a+(s.price||0),0);
  const avgRating   = getMentorAvgRating(currentUser?.id);
  const todaySess   = sessions.filter(s => s.status==='confirmed' && s.slot?.toLowerCase().includes('today'));
  const pendingSess = sessions.filter(s => s.status==='pending');
  const upcoming    = sessions.filter(s => ['pending','confirmed'].includes(s.status)).slice(0,5);
  const recentRevs  = reviews.slice(0,3);
  const earningsSpark = [12000,18000,15000,22000,19000,28000,totalEarned||24000];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl border border-emerald-800/30 p-6 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,#0a2018 0%,#0d2a1e 50%,#0a1f16 100%)' }}>
        <div className="pointer-events-none absolute -top-10 right-20 w-48 h-48 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-32 h-32 rounded-full bg-teal-600/8 blur-2xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Mentor Dashboard</p>
            <h2 className="text-2xl font-black text-white mb-1">Good morning, {firstName}! 👨‍🏫</h2>
            <p className="text-sm text-gray-400">
              You have{' '}
              <span className="text-emerald-400 font-bold">{todaySess.length} confirmed</span> &amp;{' '}
              <span className="text-amber-400 font-bold">{pendingSess.length} pending</span> sessions.
            </p>
            {profile?.subject && (
              <p className="text-xs text-gray-600 mt-1">Teaching: <span className="text-emerald-400 font-semibold">{profile.subject}</span></p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-semibold">Available Now</span>
            </div>
            {pendingSess.length > 0 && (
              <button onClick={() => onTabChange?.('sessions')}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                {pendingSess.length} session{pendingSess.length>1?'s':''} awaiting acceptance →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}      iconBg="bg-emerald-600/80" label="Total Students" value={new Set(sessions.map(s=>s.studentId)).size} trendUp={true} trend="+active" sub="students" spark={[5,10,15,20,25,30,new Set(sessions.map(s=>s.studentId)).size||35]} />
        <StatCard icon={Video}      iconBg="bg-teal-600/80"    label="Sessions Done"  value={sessions.filter(s=>s.status==='completed').length} trendUp={true} trend="+recent" sub="completed" spark={[2,5,8,10,12,15,sessions.filter(s=>s.status==='completed').length||18]} />
        <StatCard icon={Star}       iconBg="bg-amber-600/80"   label="Avg Rating"     value={avgRating || '—'} trendUp={true} trend="from students" sub="reviews" spark={[4.2,4.4,4.5,4.6,4.7,4.7,parseFloat(avgRating||4.5)]} />
        <StatCard icon={DollarSign} iconBg="bg-cyan-600/80"    label="Earnings (₹)"  value={totalEarned.toLocaleString()||'0'} trendUp={true} trend="+growing" sub="total" spark={earningsSpark} />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-[1fr_300px] gap-5">
        {/* Sessions chart placeholder */}
        <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Earnings Overview</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Based on completed sessions</p>
            </div>
            <p className="text-xl font-black text-emerald-400">₹{totalEarned.toLocaleString()}</p>
          </div>
          <div className="flex items-end gap-2 h-32 mb-3">
            {earningsSpark.map((v,i) => {
              const max = Math.max(...earningsSpark, 1);
              const isLast = i === earningsSpark.length - 1;
              return (
                <div key={i} className="flex-1 rounded-t-lg transition-all duration-500 relative group"
                  style={{ height:`${(v/max)*100}%`, background:isLast?'linear-gradient(to top,#059669,#34d399)':'rgba(16,185,129,0.2)' }}>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0d2a1e] border border-emerald-700/50 rounded-lg px-2 py-1 text-[9px] text-emerald-300 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    ₹{(v/1000).toFixed(0)}k
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 justify-around">
            {['W1','W2','W3','W4','W5','W6','Now'].map(w => <span key={w} className="flex-1 text-center text-[9px] text-gray-700">{w}</span>)}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5">
          <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2.5">
            {[
              { icon:Video,         label:'View My Sessions',    sub:`${pendingSess.length} pending approval`,    tab:'sessions' },
              { icon:Calendar,      label:'Manage Availability', sub:'Update your schedule',                     tab:'settings' },
              { icon:BookOpen,      label:'Upload Resource',     sub:'Add study material',                       tab:'resources' },
              { icon:MessageSquare, label:'Student Messages',    sub:`${unreadCount} unread message${unreadCount!==1?'s':''}`, tab:'messages' },
              { icon:TrendingUp,    label:'Analytics Report',    sub:'View detailed performance',                tab:'analytics' },
            ].map((a,i) => (
              <button key={i} onClick={() => onTabChange?.(a.tab)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-emerald-700/30 transition-all text-left group">
                <div className="w-8 h-8 rounded-lg bg-emerald-700/40 flex items-center justify-center flex-shrink-0">
                  <a.icon className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">{a.label}</p>
                  <p className="text-[10px] text-gray-600">{a.sub}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-emerald-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-[1fr_300px] gap-5">
        {/* Upcoming sessions */}
        <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Upcoming Sessions</h3>
            {pendingSess.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                {pendingSess.length} pending
              </div>
            )}
          </div>
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Video className="w-8 h-8 text-gray-700 mb-2" />
              <p className="text-gray-600 text-xs">No upcoming sessions</p>
              <p className="text-gray-700 text-[10px] mt-1">Sessions booked by students appear here</p>
            </div>
          ) : (
            upcoming.map((s,i) => <SessionRow key={i} session={s} />)
          )}
          {sessions.length > 5 && (
            <button onClick={() => onTabChange?.('sessions')} className="w-full mt-3 py-2 text-xs text-emerald-400 hover:text-emerald-300 text-center transition-colors">
              View all {sessions.length} sessions →
            </button>
          )}
        </div>

        {/* Recent reviews */}
        <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Recent Reviews</h3>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-white">{avgRating || '—'}</span>
            </div>
          </div>
          {recentRevs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Star className="w-8 h-8 text-gray-700 mb-2" />
              <p className="text-gray-600 text-xs">No reviews yet</p>
              <p className="text-gray-700 text-[10px] mt-1">Students leave reviews after sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRevs.map((r,i) => <ReviewCard key={i} review={r} />)}
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Mentor Achievements</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon:'🏆', label:'Top Rated Mentor',  sub:'4.0+ avg rating',         earned: parseFloat(avgRating||0) >= 4.0 },
            { icon:'🎯', label:'10 Sessions',        sub:'Complete 10 sessions',    earned: sessions.filter(s=>s.status==='completed').length >= 10 },
            { icon:'⭐', label:'First Review',       sub:'Receive your first review',earned: reviews.length > 0 },
            { icon:'🚀', label:'Elite Mentor',       sub:'Complete 50 sessions',    earned: sessions.filter(s=>s.status==='completed').length >= 50 },
          ].map((a,i) => (
            <div key={i} className={`rounded-xl p-3.5 flex items-center gap-3 border transition-all ${a.earned?'bg-emerald-500/10 border-emerald-500/30':'bg-white/[0.02] border-white/[0.05] opacity-50'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${a.earned?'bg-emerald-500/20':'bg-white/5'}`}>{a.icon}</div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{a.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{a.sub}</p>
                {a.earned && <p className="text-[9px] text-emerald-400 font-bold mt-0.5">EARNED ✓</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
