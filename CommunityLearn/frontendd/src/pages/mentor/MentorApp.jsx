import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Video, Users, TrendingUp, BookOpen,
  Brain, Settings, LogOut, Bell, ChevronDown,
  MessageSquare, Calendar, Star
} from 'lucide-react';
import MentorDashboard from './MentorDashboard';
import MentorSessions  from './MentorSessions';
import MentorMessages  from './MentorMessages';
import MentorReviews   from './MentorReviews';
import MentorSettings  from './MentorSettings';
import MentorStudents  from './MentorStudents';
import MentorAnalytics from './MentorAnalytics';
import {
  getUnreadCount,
  getMentorSessions,
  getMentorProfile,
  getMentorReviews,
  getMentorAvgRating,
} from '../../utils/sharedStore';

const NavItem = ({ icon: Icon, label, active, badge, onClick }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
      active
        ? 'bg-gradient-to-r from-emerald-700/70 to-teal-700/50 text-white shadow-lg shadow-emerald-900/30 border border-emerald-600/30'
        : 'text-gray-500 hover:text-white hover:bg-white/[0.05]'
    }`}>
    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-emerald-300' : 'group-hover:text-emerald-400'}`} />
    <span className="flex-1 text-left">{label}</span>
    {badge > 0 && (
      <span className="min-w-[20px] h-5 px-1 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

const NavSection = ({ label }) => (
  <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest px-4 pt-4 pb-1">{label}</p>
);

const MentorApp = ({ currentUser, onLogout }) => {
  const [activeTab,    setActiveTab]    = useState('dashboard');
  const [unread,       setUnread]       = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [profile,      setProfile]      = useState(null);

  const refreshCounts = () => {
    if (!currentUser?.id) return;
    setUnread(getUnreadCount(currentUser.id));
    setPendingCount(getMentorSessions(currentUser.id).filter(s => s.status === 'pending').length);
    setProfile(getMentorProfile(currentUser.id));
  };

  useEffect(() => {
    refreshCounts();
    const iv = setInterval(refreshCounts, 5000);
    ['cl_session_update','cl_message_update','cl_review_update','cl_mentor_update'].forEach(e =>
      window.addEventListener(e, refreshCounts)
    );
    return () => {
      clearInterval(iv);
      ['cl_session_update','cl_message_update','cl_review_update','cl_mentor_update'].forEach(e =>
        window.removeEventListener(e, refreshCounts)
      );
    };
  }, [currentUser]);

  const name     = profile?.name || currentUser?.name || 'Mentor';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const reviews  = getMentorReviews(currentUser?.id);
  const avgRating= getMentorAvgRating(currentUser?.id);

  const pageTitle = {
    dashboard: 'Dashboard',
    sessions:  'Sessions',
    students:  'My Students',
    messages:  'Messages',
    analytics: 'Analytics',
    reviews:   'Reviews',
    settings:  'Settings',
  }[activeTab] || 'Mentor Portal';

  const pageSub = {
    dashboard: 'Your teaching overview at a glance',
    sessions:  'Manage your upcoming & past sessions',
    students:  'Track your student progress',
    messages:  'Chat with your students',
    analytics: 'Detailed earnings & performance data',
    reviews:   'Student feedback on your sessions',
    settings:  'Update your profile and availability',
  }[activeTab] || '';

  return (
    <div className="flex h-screen bg-[#080f0c] text-white overflow-hidden"
      style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <aside className="w-60 flex-shrink-0 flex flex-col bg-[#0a1510] border-r border-emerald-900/20 overflow-y-auto">
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-emerald-900/20">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-black text-[15px] text-white tracking-tight">CommunityLearn</span>
            <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-widest">Mentor Portal</p>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-emerald-900/10">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-700/30">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-300 font-semibold">Available for sessions</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
          <NavSection label="Overview" />
          <NavItem icon={LayoutDashboard} label="Dashboard"   active={activeTab==='dashboard'} onClick={()=>setActiveTab('dashboard')} />

          <NavSection label="Teaching" />
          <NavItem icon={Video}           label="Sessions"    active={activeTab==='sessions'}  onClick={()=>setActiveTab('sessions')}  badge={pendingCount} />
          <NavItem icon={Users}           label="My Students" active={activeTab==='students'}  onClick={()=>setActiveTab('students')}  />
          <NavItem icon={MessageSquare}   label="Messages"    active={activeTab==='messages'}  onClick={()=>setActiveTab('messages')}  badge={unread} />

          <NavSection label="Insights" />
          <NavItem icon={TrendingUp}      label="Analytics"   active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')} />
          <NavItem icon={Star}            label="Reviews"     active={activeTab==='reviews'}   onClick={()=>setActiveTab('reviews')}   />

          <NavSection label="Account" />
          <NavItem icon={Settings}        label="Settings"    active={activeTab==='settings'}  onClick={()=>setActiveTab('settings')}  />
        </nav>

        {/* Profile card */}
        <div className="p-3 border-t border-emerald-900/20">
          <div className="rounded-2xl bg-white/[0.03] border border-emerald-900/20 p-3.5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{name}</p>
                <p className="text-[10px] text-emerald-600">Verified Mentor</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {[
                { v: getMentorSessions(currentUser?.id).filter(s=>s.status==='completed').length, l:'Done'    },
                { v: new Set(getMentorSessions(currentUser?.id).map(s=>s.studentId)).size,        l:'Students'},
                { v: avgRating || '—',                                                             l:'Rating'  },
              ].map((s,i) => (
                <div key={i} className="rounded-lg bg-white/[0.03] p-1.5 text-center">
                  <p className="text-xs font-black text-emerald-400">{s.v}</p>
                  <p className="text-[8px] text-gray-700">{s.l}</p>
                </div>
              ))}
            </div>
            <button onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-white/[0.07] text-xs text-gray-500 hover:text-white hover:bg-white/[0.05] transition-all">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-emerald-900/20 bg-[#080f0c]">
          <div>
            <h1 className="text-base font-black text-white">{pageTitle}</h1>
            <p className="text-[11px] text-gray-600 mt-0.5">{pageSub}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              {(unread + pendingCount) > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold">{initials}</div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-white leading-tight">{name.split(' ')[0]}</p>
                <p className="text-[9px] text-emerald-600">Mentor</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {activeTab === 'dashboard' && <MentorDashboard currentUser={currentUser} onTabChange={setActiveTab} />}
          {activeTab === 'sessions'  && <MentorSessions  currentUser={currentUser} />}
          {activeTab === 'students'  && <MentorStudents  currentUser={currentUser} />}
          {activeTab === 'messages'  && <MentorMessages  currentUser={currentUser} />}
          {activeTab === 'analytics' && <MentorAnalytics currentUser={currentUser} />}
          {activeTab === 'reviews'   && <MentorReviews   currentUser={currentUser} />}
          {activeTab === 'settings'  && <MentorSettings  currentUser={currentUser} />}
        </main>
      </div>
    </div>
  );
};

export default MentorApp;
