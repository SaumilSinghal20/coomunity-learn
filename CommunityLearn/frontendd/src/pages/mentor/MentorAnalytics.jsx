import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Star, Users, Video, ArrowUpRight } from 'lucide-react';
import { getMentorSessions, getMentorReviews, getMentorAvgRating } from '../../utils/sharedStore';

// ── Bar Chart bar ─────────────────────────────────────────────────────────────
const BarGroup = ({ label, value, max, color, sublabel }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-end justify-between mb-1">
      <span className="text-[10px] text-gray-600">{label}</span>
      <span className="text-[11px] font-bold text-white">{sublabel}</span>
    </div>
    <div className="w-full h-2 rounded-full bg-white/[0.07] overflow-hidden">
      <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width:`${max > 0 ? (value/max)*100 : 0}%` }}/>
    </div>
  </div>
);

// ── Donut Chart ───────────────────────────────────────────────────────────────
const DonutChart = ({ data, total }) => {
  const radius = 50, cx = 60, cy = 60, strokeWidth = 14;
  const circ   = 2 * Math.PI * radius;
  let cumulative = 0;

  if (total === 0) {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth}/>
        <text x={cx} y={cy - 4}  textAnchor="middle" fill="white"   fontSize="14" fontWeight="bold">₹0</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#6b7280" fontSize="8">total</text>
      </svg>
    );
  }

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth}/>
      {data.map((d, i) => {
        const pct    = d.value / total;
        const dash   = pct * circ;
        const offset = circ * (1 - cumulative);
        cumulative  += pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={radius} fill="none"
            stroke={d.color} strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
      <text x={cx} y={cy - 4}  textAnchor="middle" fill="white"   fontSize="14" fontWeight="bold">₹{(total/1000).toFixed(0)}k</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#6b7280" fontSize="8">total</text>
    </svg>
  );
};

// ── MENTOR ANALYTICS ──────────────────────────────────────────────────────────
const MentorAnalytics = ({ currentUser }) => {
  const [period,   setPeriod]   = useState('month');
  const [sessions, setSessions] = useState([]);
  const [reviews,  setReviews]  = useState([]);

  const load = () => {
    if (!currentUser?.id) return;
    setSessions(getMentorSessions(currentUser.id));
    setReviews(getMentorReviews(currentUser.id));
  };

  useEffect(() => {
    load();
    window.addEventListener('cl_session_update', load);
    window.addEventListener('cl_review_update',  load);
    return () => {
      window.removeEventListener('cl_session_update', load);
      window.removeEventListener('cl_review_update',  load);
    };
  }, [currentUser]);

  // ── Derived real stats ────────────────────────────────────────────────────
  const completed     = sessions.filter(s => s.status === 'completed');
  const totalEarned   = completed.reduce((a, s) => a + (s.price || 0) * 80, 0); // USD→INR ~80
  const totalSessions = sessions.length;
  const uniqueStudents= new Set(sessions.map(s => s.studentId)).size;
  const avgRating     = getMentorAvgRating(currentUser?.id);

  // Build weekly earnings buckets (last 8 weeks)
  const now = Date.now();
  const weeklyEarnings = Array.from({ length: 8 }, (_, w) => {
    const weekEnd   = now - w * 7 * 86400000;
    const weekStart = weekEnd - 7 * 86400000;
    return completed
      .filter(s => { const t = new Date(s.createdAt).getTime(); return t >= weekStart && t < weekEnd; })
      .reduce((a, s) => a + (s.price || 0) * 80, 0);
  }).reverse();

  const weeklySessionCount = Array.from({ length: 8 }, (_, w) => {
    const weekEnd   = now - w * 7 * 86400000;
    const weekStart = weekEnd - 7 * 86400000;
    return sessions.filter(s => { const t = new Date(s.createdAt).getTime(); return t >= weekStart && t < weekEnd; }).length;
  }).reverse();

  const chartData = period === 'month' ? weeklyEarnings : weeklySessionCount;
  const maxVal    = Math.max(...chartData, 1);

  // Subject breakdown from real sessions
  const subjectMap = {};
  completed.forEach(s => {
    subjectMap[s.subject] = (subjectMap[s.subject] || 0) + (s.price || 0) * 80;
  });
  const SUBJECT_COLORS = ['#10b981','#0891b2','#7c3aed','#f59e0b','#ef4444','#ec4899'];
  const subjectBreakdown = Object.entries(subjectMap)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value], i) => ({
      label, value,
      color: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
      pct:   totalEarned > 0 ? Math.round((value/totalEarned)*100) : 0,
    }));
  const donutData = subjectBreakdown.map(s => ({ value: s.value, color: s.color }));

  // Performance metrics — real where possible, derived otherwise
  const completionRate = sessions.length > 0 ? Math.round((completed.length / sessions.length) * 100) : 0;
  const onTimeRate     = completionRate; // same source in demo
  const repeatStudents = sessions.length > 0
    ? Math.round((sessions.filter(s => { const c = sessions.filter(x => x.studentId === s.studentId).length; return c > 1; }).length / sessions.length) * 100)
    : 0;

  // Milestones — real thresholds
  const milestones = [
    { icon:'🎯', label:'First 10 Sessions',  date:'Complete 10 sessions', done: completed.length >= 10 },
    { icon:'⭐', label:'4.5+ Rating',         date:'Earn 4.5+ avg rating', done: parseFloat(avgRating||0) >= 4.5 },
    { icon:'💰', label:'₹50k Earnings',       date:'Earn ₹50,000 total',   done: totalEarned >= 50000 },
    { icon:'👥', label:'20 Students',          date:'Teach 20 students',    done: uniqueStudents >= 20 },
    { icon:'🏆', label:'100 Sessions',         date:'Complete 100 sessions',done: completed.length >= 100 },
    { icon:'🚀', label:'₹1L Earnings',         date:'Earn ₹1,00,000 total', done: totalEarned >= 100000 },
    { icon:'🌟', label:'50 Students',          date:'Teach 50 students',    done: uniqueStudents >= 50 },
    { icon:'💎', label:'Elite Mentor Badge',   date:'Complete all above',   done: false },
  ];

  const kpiCards = [
    { icon:DollarSign, label:'Total Earned',   value:`₹${totalEarned.toLocaleString()}`, trend:`${completed.length} sessions`, bg:'bg-emerald-600/20', color:'text-emerald-400' },
    { icon:Video,      label:'Total Sessions', value:String(totalSessions),               trend:`${sessions.filter(s=>s.status==='pending').length} pending`, bg:'bg-teal-600/20',   color:'text-teal-400'    },
    { icon:Users,      label:'Total Students', value:String(uniqueStudents),              trend:'unique students',               bg:'bg-cyan-600/20',    color:'text-cyan-400'    },
    { icon:Star,       label:'Avg Rating',     value:avgRating ? `${avgRating} ⭐` : '—', trend:`${reviews.length} review${reviews.length!==1?'s':''}`, bg:'bg-amber-600/20', color:'text-amber-400' },
  ];

  return (
    <div className="space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((k,i) => (
          <div key={i} className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5">
            <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon className={`w-5 h-5 ${k.color}`}/>
            </div>
            <p className={`text-2xl font-black ${k.color} mb-0.5`}>{k.value}</p>
            <p className="text-[11px] text-gray-600 mb-2">{k.label}</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3 h-3"/>{k.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state for brand new mentors */}
      {totalSessions === 0 && (
        <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-emerald-700"/>
          </div>
          <p className="text-gray-400 font-semibold text-lg">No analytics yet</p>
          <p className="text-gray-600 text-sm mt-1">Your earnings charts and performance data will appear here once students start booking sessions with you.</p>
          <p className="text-gray-700 text-xs mt-3">💡 Go to Settings to set up your availability and subject first</p>
        </div>
      )}

      {totalSessions > 0 && (
        <>
          {/* Earnings chart + subject donut */}
          <div className="grid grid-cols-[1fr_280px] gap-5">
            <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-white">{period === 'month' ? 'Earnings Trend' : 'Sessions per Week'}</h3>
                  <p className="text-[11px] text-gray-600 mt-0.5">Based on your completed sessions</p>
                </div>
                <div className="flex gap-1.5">
                  {['week','month'].map(p => (
                    <button key={p} onClick={() => setPeriod(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${period===p?'bg-emerald-600 text-white':'bg-white/[0.04] text-gray-500 hover:text-white'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {/* Bars */}
              <div className="flex items-end gap-2 h-40 mb-3">
                {chartData.map((v,i) => {
                  const isLast = i === chartData.length - 1;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="w-full rounded-t-lg transition-all duration-500 relative"
                        style={{ height:`${(v/maxVal)*100}%`, minHeight:'2px', background:isLast?'linear-gradient(to top,#059669,#34d399)':'rgba(16,185,129,0.2)' }}>
                        {v > 0 && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0d2a1e] border border-emerald-700/50 rounded-lg px-2 py-1 text-[9px] text-emerald-300 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {period==='month' ? `₹${(v/1000).toFixed(1)}k` : `${v} sess`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 justify-around">
                {['W1','W2','W3','W4','W5','W6','W7','Now'].map(w => <span key={w} className="flex-1 text-center text-[9px] text-gray-700">{w}</span>)}
              </div>
            </div>

            {/* Subject breakdown */}
            <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5 flex flex-col">
              <h3 className="text-sm font-bold text-white mb-4">Revenue by Subject</h3>
              <div className="flex justify-center mb-4">
                <DonutChart data={donutData} total={totalEarned}/>
              </div>
              {subjectBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {subjectBreakdown.map((s,i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background:s.color }}/>
                          <span className="text-xs text-gray-400">{s.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-white">₹{(s.value/1000).toFixed(0)}k</span>
                          <span className="text-[10px] text-gray-600 ml-1">{s.pct}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-1.5 rounded-full transition-all duration-700" style={{ width:`${s.pct}%`, background:s.color }}/>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 text-xs text-center">No earnings data yet</p>
              )}
              <div className="mt-auto pt-4 border-t border-white/[0.05]">
                <p className="text-[10px] text-gray-600 mb-1">Total Revenue</p>
                <p className="text-xl font-black text-emerald-400">₹{totalEarned.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Performance metrics + Milestones */}
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5">
              <h3 className="text-sm font-bold text-white mb-5">Performance Metrics</h3>
              <div className="space-y-4">
                <BarGroup label="Session Completion Rate" value={completionRate} max={100} color="bg-gradient-to-r from-emerald-600 to-teal-500" sublabel={`${completionRate}%`}/>
                <BarGroup label="Student Satisfaction"    value={parseFloat(avgRating||0)} max={5} color="bg-gradient-to-r from-amber-500 to-yellow-400" sublabel={avgRating ? `${avgRating}/5` : '—'}/>
                <BarGroup label="Repeat Student Rate"     value={repeatStudents} max={100} color="bg-gradient-to-r from-cyan-600 to-blue-500" sublabel={`${repeatStudents}%`}/>
                <BarGroup label="On-Time Session Rate"    value={onTimeRate}     max={100} color="bg-gradient-to-r from-violet-600 to-purple-500" sublabel={`${onTimeRate}%`}/>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5">
              <h3 className="text-sm font-bold text-white mb-4">Career Milestones</h3>
              <div className="space-y-2.5">
                {milestones.map((m,i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${m.done?'bg-emerald-500/8 border-emerald-700/30':'bg-white/[0.02] border-white/[0.05] opacity-60'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${m.done?'bg-emerald-500/20':'bg-white/5'}`}>{m.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{m.label}</p>
                      <p className="text-[10px] text-gray-600">{m.done ? '✓ Achieved' : m.date}</p>
                    </div>
                    {m.done && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MentorAnalytics;
