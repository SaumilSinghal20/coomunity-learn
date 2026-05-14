import { LayoutDashboard, Users, BookOpen, Brain, Zap, LogOut, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'sessions',  label: 'Sessions',   icon: Users           },
  { id: 'resources', label: 'Resources',  icon: BookOpen        },
  { id: 'chat',      label: 'AI Tutor',   icon: Brain           },
  { id: 'quizzes',   label: 'Quizzes',    icon: Zap             },
];

export const AppHeader = ({ currentUser, onLogout }) => {
  const [dropOpen, setDropOpen] = useState(false);
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';
  const roleColor = currentUser?.role === 'mentor'
    ? 'from-purple-500 to-pink-500'
    : 'from-blue-500 to-cyan-500';

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'rgba(5,5,15,0.82)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 40px rgba(0,0,0,0.5)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)' }}
          >
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">CommunityLearn</span>
            <span className="block text-[10px] text-gray-500 -mt-0.5 tracking-widest uppercase">Smart Learning Platform</span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <Bell className="w-4 h-4 text-gray-400" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: '#f43f5e', boxShadow: '0 0 6px #f43f5e' }}
            />
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropOpen(p => !p)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${roleColor} flex items-center justify-center text-white text-xs font-bold`}>
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-white text-xs font-semibold leading-tight">{currentUser?.name || 'User'}</p>
                <p className="text-gray-500 text-[10px] capitalize">{currentUser?.role || 'Student'}</p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-44 rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(15,15,30,0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                }}
              >
                <div className="p-3 border-b border-white/5">
                  <p className="text-white text-xs font-semibold">{currentUser?.name}</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">{currentUser?.email}</p>
                </div>
                <button
                  onClick={() => { setDropOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export const AppNav = ({ activeTab, onTabChange }) => (
  <nav
    className="sticky top-16 z-30 w-full"
    style={{
      background: 'rgba(5,5,15,0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}
  >
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all duration-200 group"
              style={{ color: active ? '#a78bfa' : 'rgba(156,163,175,1)' }}
            >
              <Icon
                className="w-4 h-4 transition-all duration-200"
                style={{ color: active ? '#a78bfa' : undefined }}
              />
              <span className="hidden sm:inline">{label}</span>

              {/* Active underline */}
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: active ? 'linear-gradient(90deg,#6366f1,#a855f7)' : 'transparent',
                  boxShadow: active ? '0 0 12px rgba(139,92,246,0.8)' : 'none',
                }}
              />

              {/* Hover bg */}
              <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: 'rgba(139,92,246,0.06)' }}
              />
            </button>
          );
        })}
      </div>
    </div>
  </nav>
);
