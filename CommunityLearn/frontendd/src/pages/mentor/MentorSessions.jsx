import { useState, useEffect } from 'react';
import {
  Video, Calendar, Clock, CheckCircle2, X, Search,
  ChevronDown, MessageSquare, Star, Filter, Play,
  Check, AlertCircle, Users, ExternalLink, Copy
} from 'lucide-react';
import {
  getMentorSessions,
  acceptSession,
  declineSession,
  completeSession,
  addNotification,
  sendEmailNotification,
} from '../../utils/sharedStore';

const statusConfig = {
  confirmed: { label:'Confirmed', cls:'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot:'bg-emerald-400' },
  pending:   { label:'Pending',   cls:'bg-amber-500/20   text-amber-300   border-amber-500/30',   dot:'bg-amber-400'   },
  completed: { label:'Completed', cls:'bg-gray-500/20    text-gray-400    border-gray-500/30',    dot:'bg-gray-400'    },
  cancelled: { label:'Cancelled', cls:'bg-red-500/20     text-red-400     border-red-500/30',     dot:'bg-red-400'     },
};

// ── Meet Link Card ─────────────────────────────────────────────────────────────
const MeetLinkBanner = ({ link }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
      <p className="text-[10px] text-emerald-400 font-bold mb-1.5">📹 Google Meet Link (share with student)</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-[11px] text-emerald-300 font-mono truncate">{link}</code>
        <button onClick={copy}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[10px] font-bold transition-all flex-shrink-0">
          {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={() => window.open(link, '_blank')}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all flex-shrink-0">
          <ExternalLink className="w-3 h-3" /> Join
        </button>
      </div>
    </div>
  );
};

// ── Session Card ───────────────────────────────────────────────────────────────
const SessionCard = ({ session, onAccept, onDecline, onComplete }) => {
  const { label, cls, dot } = statusConfig[session.status] || statusConfig.pending;
  const initials = (session.studentName || 'S').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const colors   = ['from-blue-500 to-cyan-500','from-pink-500 to-rose-500','from-violet-500 to-purple-500','from-emerald-500 to-teal-500','from-amber-500 to-orange-500'];
  const color    = colors[session.studentName?.charCodeAt(0) % colors.length] || colors[0];

  return (
    <div className={`rounded-2xl border transition-all duration-200 p-5 ${
      session.status === 'confirmed' ? 'bg-[#0a1f17] border-emerald-800/40 hover:border-emerald-700/50' :
      session.status === 'pending'   ? 'bg-[#1a1500] border-amber-800/30 hover:border-amber-700/40'     :
      session.status === 'cancelled' ? 'bg-[#1a0a0a] border-red-900/20 opacity-60'                      :
                                       'bg-[#0d1117] border-white/[0.06] hover:border-white/10'
    }`}>
      <div className="flex items-start gap-3.5">
        <div className={`w-11 h-11 flex-shrink-0 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold border-2 border-white/10`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-bold text-white">{session.studentName || 'Student'}</h4>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{label}
            </span>
          </div>
          <p className="text-xs text-emerald-400 font-semibold">{session.subject}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">📚 {session.topic || session.subject}</p>
          <p className="text-[10px] text-gray-600 mt-0.5">✉️ {session.studentEmail || 'No email'}</p>

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {session.slot || 'TBD'}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              60 min
            </div>
            <div className="ml-auto text-sm font-black text-white">₹{session.price?.toLocaleString() || '—'}</div>
          </div>

          {/* Meet link if confirmed */}
          {session.status === 'confirmed' && session.meetLink && (
            <MeetLinkBanner link={session.meetLink} />
          )}

          {session.status === 'completed' && session.rating && (
            <div className="flex items-center gap-1 mt-2">
              {Array.from({length:5}).map((_,i) => (
                <Star key={i} className={`w-3 h-3 ${i<session.rating?'fill-amber-400 text-amber-400':'text-gray-700'}`}/>
              ))}
              <span className="text-[10px] text-gray-500 ml-1">Student rating</span>
            </div>
          )}
        </div>
      </div>

      {session.status === 'pending' && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-white/[0.05]">
          <button onClick={() => onAccept(session.id)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Accept &amp; Generate Meet Link
          </button>
          <button onClick={() => onDecline(session.id)}
            className="flex-1 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-red-500/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
            <X className="w-3.5 h-3.5" /> Decline
          </button>
        </div>
      )}
      {session.status === 'confirmed' && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-white/[0.05]">
          <button onClick={() => window.open(session.meetLink, '_blank')}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5">
            <Play className="w-3.5 h-3.5 fill-white" /> Start Session
          </button>
          <button onClick={() => onComplete(session.id)}
            className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-emerald-400 text-xs transition-all flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Done
          </button>
          <button className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-white text-xs transition-all flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

// ── MENTOR SESSIONS PAGE ───────────────────────────────────────────────────────
const MentorSessions = ({ currentUser }) => {
  const [sessions, setSessions] = useState([]);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');

  const load = () => {
    if (currentUser?.id) setSessions(getMentorSessions(currentUser.id));
  };

  useEffect(() => {
    load();
    window.addEventListener('cl_session_update', load);
    return () => window.removeEventListener('cl_session_update', load);
  }, [currentUser]);

  const handleAccept = (sessionId) => {
    const meetLink = acceptSession(sessionId);
    const session  = sessions.find(s => s.id === sessionId);

    // Notify student with meet link
    if (session) {
      addNotification({
        userId:  session.studentId,
        type:    'session_confirmed',
        title:   'Session Confirmed! 🎉',
        message: `Your session with ${currentUser.name} has been confirmed.`,
        data:    { sessionId, meetLink },
      });
      sendEmailNotification({
        to:      session.studentEmail,
        subject: `Session Confirmed — Google Meet Link`,
        body:    `Your session with ${currentUser.name} is confirmed!\n\nSlot: ${session.slot}\nSubject: ${session.subject}\n\nJoin Meeting: ${meetLink}\n\nThis link will be active at the time of your session.`,
      });
    }
    window.dispatchEvent(new Event('cl_session_update'));
    load();
  };

  const handleDecline = (sessionId) => {
    declineSession(sessionId);
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      addNotification({
        userId:  session.studentId,
        type:    'session_declined',
        title:   'Session Declined',
        message: `Unfortunately ${currentUser.name} could not accept your session request.`,
        data:    { sessionId },
      });
    }
    window.dispatchEvent(new Event('cl_session_update'));
    load();
  };

  const handleComplete = (sessionId) => {
    completeSession(sessionId);
    window.dispatchEvent(new Event('cl_session_update'));
    load();
  };

  const filtered = sessions.filter(s => {
    const matchSearch = s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
                        s.subject?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'all' || s.status === filter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all:       sessions.length,
    pending:   sessions.filter(s => s.status === 'pending').length,
    confirmed: sessions.filter(s => s.status === 'confirmed').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon:Video,        label:'Total Sessions',  value:counts.all,       color:'text-emerald-400', bg:'bg-emerald-600/20' },
          { icon:AlertCircle,  label:'Pending',         value:counts.pending,   color:'text-amber-400',   bg:'bg-amber-600/20'   },
          { icon:CheckCircle2, label:'Confirmed',       value:counts.confirmed, color:'text-cyan-400',    bg:'bg-cyan-600/20'    },
          { icon:Users,        label:'Completed',       value:counts.completed, color:'text-teal-400',    bg:'bg-teal-600/20'    },
        ].map((s,i) => (
          <div key={i} className="rounded-xl bg-[#0d1f1a] border border-emerald-900/30 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-600">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sessions..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-white placeholder-gray-700 outline-none focus:border-emerald-600/50 transition-colors" />
        </div>
        {['all','pending','confirmed','completed','cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${filter===f?'bg-emerald-600 border-emerald-500 text-white':'bg-white/[0.04] border-white/[0.07] text-gray-500 hover:text-white'}`}>
            {f} {f==='all'?`(${counts.all})`:f==='pending'?`(${counts.pending})`:''}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-600">{filtered.length} sessions found</p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Video className="w-12 h-12 text-gray-800 mb-3" />
          <p className="text-gray-500 font-semibold">No sessions yet</p>
          <p className="text-gray-700 text-xs mt-1">Sessions booked by students will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(s => (
            <SessionCard key={s.id} session={s} onAccept={handleAccept} onDecline={handleDecline} onComplete={handleComplete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorSessions;
