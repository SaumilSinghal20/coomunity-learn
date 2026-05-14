import { useState, useEffect } from 'react';
import { App3DBackground } from './components/UI';
import { AppHeader, AppNav } from './components/AppLayout';
import AuthFlow          from './pages/AuthFlow';
import Dashboard         from './pages/Dashboard';
import SessionsPage      from './pages/SessionsPage';
import ResourcesPage     from './pages/ResourcesPage';
import ChatPage          from './pages/ChatPage';
import QuizzesPage       from './pages/QuizzesPage';
import AchievementsPage  from './pages/AchievementsPage';
import MyJourneyPage     from './pages/MyJourneyPage';   // ← NEW
import MentorApp         from './pages/mentor/MentorApp';
import { getSession, saveSession, clearSession } from './utils/api';

const DEFAULT_PROGRESS = {
  points: 0, level: 1, quizzes: 0,
  sessions: 0, streak: 0, perfectScores: 0,
};

const App = () => {
  const [currentUser,  setCurrentUser]  = useState(getSession);
  const [activeTab,    setActiveTab]    = useState('dashboard');
  const [userProgress, setUserProgress] = useState(() => {
    try {
      const session = getSession();
      if (!session) return DEFAULT_PROGRESS;
      const saved = localStorage.getItem(`progress_${session.id}`);
      return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
    } catch { return DEFAULT_PROGRESS; }
  });

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`progress_${currentUser.id}`, JSON.stringify(userProgress));
    }
  }, [userProgress, currentUser]);

  const handleLogin = (u) => {
    saveSession(u);
    setCurrentUser(u);
    try {
      const saved = localStorage.getItem(`progress_${u.id}`);
      setUserProgress(saved ? JSON.parse(saved) : DEFAULT_PROGRESS);
    } catch { setUserProgress(DEFAULT_PROGRESS); }
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setActiveTab('dashboard');
    setUserProgress(DEFAULT_PROGRESS);
  };

  const handleQuizComplete = (pts, isPerfect) => {
    setUserProgress(prev => {
      const newPoints  = (prev.points  || 0) + pts;
      const newQuizzes = (prev.quizzes || 0) + 1;
      const newPerfect = (prev.perfectScores || 0) + (isPerfect ? 1 : 0);
      const newLevel   = Math.floor(newPoints / 200) + 1;
      return { ...prev, points: newPoints, quizzes: newQuizzes, perfectScores: newPerfect, level: newLevel };
    });
  };

  const handleBookingComplete = () => {
    setUserProgress(prev => ({ ...prev, sessions: (prev.sessions || 0) + 1 }));
  };

  if (!currentUser) return <AuthFlow onLogin={handleLogin} />;

  if (currentUser.role === 'mentor') {
    return <MentorApp currentUser={currentUser} onLogout={handleLogout} />;
  }

  // When Dashboard calls onTabChange('logout'), handle it here
  const handleTabChange = (tab) => {
    if (tab === 'logout') { handleLogout(); return; }
    setActiveTab(tab);
  };

  return (
    <App3DBackground className="min-h-screen bg-gray-950">
      <AppHeader currentUser={currentUser} onLogout={handleLogout} />
      <AppNav activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-6 py-8">

        {activeTab === 'dashboard' && (
          <Dashboard
            userProgress={userProgress}
            currentUser={currentUser}
            onTabChange={handleTabChange}
          />
        )}

        {/* ✅ FIXED — My Journey now has its own page */}
        {activeTab === 'journey' && (
          <MyJourneyPage
            userProgress={userProgress}
            currentUser={currentUser}
            onTabChange={handleTabChange}
          />
        )}

        {activeTab === 'sessions' && (
          <SessionsPage
            currentUser={currentUser}
            onBookingComplete={handleBookingComplete}
          />
        )}

        {activeTab === 'resources' && <ResourcesPage />}

        {activeTab === 'chat' && <ChatPage currentUser={currentUser} />}

        {activeTab === 'quizzes' && (
          <QuizzesPage onQuizComplete={handleQuizComplete} />
        )}

        {activeTab === 'achievements' && (
          <AchievementsPage userProgress={userProgress} />
        )}

      </main>
    </App3DBackground>
  );
};

export default App;
