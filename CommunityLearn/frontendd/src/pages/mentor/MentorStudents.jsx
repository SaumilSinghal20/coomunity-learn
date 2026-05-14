import { useState, useEffect } from 'react';
import {
  Search, Star, MessageSquare, Calendar, TrendingUp,
  Users, BookOpen, ChevronRight, Clock, Filter
} from 'lucide-react';
import { getMentorSessions, getMentorReviews } from '../../utils/sharedStore';

// ── Progress Bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ pct }) => {
  const color =
    pct >= 80 ? 'from-emerald-500 to-teal-400' :
    pct >= 50 ? 'from-amber-500 to-yellow-400' :
                'from-red-500 to-orange-400';
  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
      <div className={`h-1.5 rounded-full bg-gradient-to-r ${color} transition-all duration-700`} style={{ width:`${pct}%` }}/>
    </div>
  );
};

// ── Build student records from real session data ───────────────────────────────
const buildStudents = (sessions, reviews) => {
  // Group by studentId
  const map = {};
  sessions.forEach(s => {
    if (!map[s.studentId]) {
      map[s.studentId] = {
        id:          s.studentId,
        name:        s.studentName || 'Student',
        subject:     s.subject,
        sessions:    0,
        completed:   0,
        spend:       0,
        lastSession: null,
        status:      'active',
        joinedAt:    s.createdAt,
      };
    }
    const stu = map[s.studentId];
    stu.sessions++;
    if (s.status === 'completed') { stu.completed++; stu.spend += (s.price || 0) * 80; }
    if (!stu.lastSession || new Date(s.createdAt) > new Date(stu.lastSession)) {
      stu.lastSession = s.createdAt;
    }
    if (s.status === 'cancelled') stu.status = 'inactive';
  });

  // Attach reviews / ratings
  const students = Object.values(map).map(stu => {
    const stuReviews = reviews.filter(r => r.studentId === stu.id);
    const avgRating  = stuReviews.length
      ? stuReviews.reduce((a, r) => a + r.rating, 0) / stuReviews.length
      : null;
    // Progress heuristic: % of sessions completed * a score factor
    const progress = stu.sessions > 0 ? Math.min(100, Math.round((stu.completed / stu.sessions) * 100 * 0.9 + 10)) : 0;
    return { ...stu, rating: avgRating, progress };
  });

  return students;
};

const initials = (name) => name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || 'S';
const COLORS   = ['from-blue-500 to-cyan-500','from-pink-500 to-rose-500','from-violet-500 to-purple-500','from-emerald-500 to-teal-500','from-amber-500 to-orange-500','from-sky-500 to-blue-500'];
const color    = (name) => COLORS[(name || '').charCodeAt(0) % COLORS.length];

const timeAgo = (iso) => {
  if (!iso) return 'Never';
  const secs = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (secs < 60)        return 'Just now';
  if (secs < 3600)      return `${Math.floor(secs/60)}m ago`;
  if (secs < 86400)     return `${Math.floor(secs/3600)}h ago`;
  if (secs < 86400*7)   return `${Math.floor(secs/86400)}d ago`;
  return new Date(iso).toLocaleDateString();
};

// ── Student Card ──────────────────────────────────────────────────────────────
const StudentCard = ({ student }) => (
  <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5 hover:border-emerald-700/40 transition-all duration-200 flex flex-col gap-4">
    {/* Header */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${color(student.name)} flex items-center justify-center text-white font-bold text-sm border-2 border-white/10 flex-shrink-0`}>
          {initials(student.name)}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{student.name}</h4>
          <p className="text-xs text-emerald-400">{student.subject}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
          student.status === 'active'
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'bg-gray-500/20 text-gray-500 border border-gray-500/30'
        }`}>
          {student.status}
        </span>
        <p className="text-[10px] text-gray-600">Since {new Date(student.joinedAt).toLocaleDateString('en', {month:'short', year:'numeric'})}</p>
      </div>
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-3 gap-2">
      {[
        { icon:Calendar, label:'Sessions', value:student.sessions,                           color:'text-emerald-400' },
        { icon:Star,     label:'Rating',   value:student.rating ? student.rating.toFixed(1) : '—', color:'text-amber-400' },
        { icon:BookOpen, label:'Spent',    value:`₹${(student.spend/1000).toFixed(0)}k`,     color:'text-cyan-400'    },
      ].map((s,i) => (
        <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-2.5 text-center">
          <div className={`flex items-center justify-center gap-1 text-xs font-black ${s.color} mb-0.5`}>
            <s.icon className="w-3 h-3"/>{s.value}
          </div>
          <p className="text-[9px] text-gray-700">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Progress */}
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] text-gray-500 font-semibold">Session Completion</span>
        <span className={`text-[11px] font-bold ${
          student.progress >= 80 ? 'text-emerald-400' :
          student.progress >= 50 ? 'text-amber-400'   : 'text-red-400'
        }`}>{student.progress}%</span>
      </div>
      <ProgressBar pct={student.progress}/>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
        <Clock className="w-3.5 h-3.5 text-emerald-700"/>
        Last: {timeAgo(student.lastSession)}
      </div>
      <div className="flex gap-1.5">
        <button className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-emerald-400 hover:border-emerald-700/40 transition-all">
          <MessageSquare className="w-3.5 h-3.5"/>
        </button>
        <button className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-emerald-400 hover:border-emerald-700/40 transition-all">
          <Calendar className="w-3.5 h-3.5"/>
        </button>
        <button className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-emerald-400 hover:border-emerald-700/40 transition-all">
          <ChevronRight className="w-3.5 h-3.5"/>
        </button>
      </div>
    </div>
  </div>
);

// ── MENTOR STUDENTS PAGE ──────────────────────────────────────────────────────
const MentorStudents = ({ currentUser }) => {
  const [search,   setSearch]   = useState('');
  const [sortBy,   setSortBy]   = useState('sessions');
  const [statusF,  setStatusF]  = useState('all');
  const [students, setStudents] = useState([]);

  const load = () => {
    if (!currentUser?.id) return;
    const sessions = getMentorSessions(currentUser.id);
    const reviews  = getMentorReviews(currentUser.id);
    setStudents(buildStudents(sessions, reviews));
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

  const filtered = students
    .filter(s =>
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
       s.subject.toLowerCase().includes(search.toLowerCase())) &&
      (statusF === 'all' || s.status === statusF)
    )
    .sort((a, b) => {
      if (sortBy === 'sessions') return b.sessions - a.sessions;
      if (sortBy === 'rating')   return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'spend')    return b.spend - a.spend;
      return 0;
    });

  const totalStudents  = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const avgRating      = students.filter(s => s.rating).length
    ? (students.filter(s => s.rating).reduce((a, s) => a + s.rating, 0) / students.filter(s => s.rating).length).toFixed(1)
    : '—';
  const totalSessions  = students.reduce((a, s) => a + s.sessions, 0);

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon:Users,      label:'Total Students',    value:totalStudents,  color:'text-emerald-400', bg:'bg-emerald-600/20' },
          { icon:TrendingUp, label:'Active Students',   value:activeStudents, color:'text-teal-400',    bg:'bg-teal-600/20'   },
          { icon:Star,       label:'Avg Student Rating',value:avgRating,      color:'text-amber-400',   bg:'bg-amber-600/20'  },
          { icon:Calendar,   label:'Total Sessions',    value:totalSessions,  color:'text-cyan-400',    bg:'bg-cyan-600/20'   },
        ].map((s,i) => (
          <div key={i} className="rounded-xl bg-[#0d1f1a] border border-emerald-900/30 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-5 h-5 ${s.color}`}/>
            </div>
            <div>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-600">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-white placeholder-gray-700 outline-none focus:border-emerald-600/50 transition-colors"/>
        </div>
        {['all','active','inactive'].map(f => (
          <button key={f} onClick={() => setStatusF(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${statusF===f?'bg-emerald-600 border-emerald-500 text-white':'bg-white/[0.04] border-white/[0.07] text-gray-500 hover:text-white'}`}>
            {f}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <Filter className="w-3.5 h-3.5 text-gray-600"/>
          <span className="text-xs text-gray-600">Sort by:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="pl-3 pr-6 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-white/[0.07] text-gray-400 outline-none cursor-pointer appearance-none">
            <option value="sessions">Sessions</option>
            <option value="rating">Rating</option>
            <option value="progress">Progress</option>
            <option value="spend">Revenue</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-600">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</p>

      {/* Empty state for new mentor */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-emerald-700"/>
          </div>
          <p className="text-gray-400 font-semibold text-lg">
            {search || statusF !== 'all' ? 'No students match your filter' : 'No students yet'}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {search || statusF !== 'all'
              ? 'Try changing your search or filter'
              : 'Students will appear here once they book a session with you'}
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => <StudentCard key={s.id} student={s}/>)}
        </div>
      )}
    </div>
  );
};

export default MentorStudents;
