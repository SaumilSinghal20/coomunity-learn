import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Calendar, Book, Users, MessageSquare, Award, BarChart3,
  Plus, Search, LogOut, Clock, Star, CheckCircle, Target,
  Trophy, Zap, Eye, EyeOff, ArrowLeft, Mail, Lock,
  User, GraduationCap, BookOpen, ChevronRight, Sparkles,
  Globe, Shield, TrendingUp, Play, X, Bell, ChevronDown,
  Rocket, Crown, ExternalLink,
  Video, FileText, Cpu, CreditCard, Check,
  Brain
} from 'lucide-react';

// ─── API ──────────────────────────────────────────────────────────────────────
const API = axios.create({ baseURL: 'http://localhost:5000' });
const getToken    = ()  => localStorage.getItem('cl_token');
const saveToken   = (t) => localStorage.setItem('cl_token', t);
const clearToken  = ()  => localStorage.removeItem('cl_token');
const getSession  = ()  => { try { return JSON.parse(localStorage.getItem('cl_session') || 'null'); } catch { return null; } };
const saveSession = (s) => localStorage.setItem('cl_session', JSON.stringify(s));
const clearSession= ()  => { localStorage.removeItem('cl_session'); clearToken(); };
API.interceptors.request.use(cfg => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
// ─── 3D UI HELPERS (UPGRADED) ────────────────────────────────────────────────
const App3DBackground = ({ className = '', children }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_20%_-10%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(1000px_500px_at_90%_0%,rgba(168,85,247,0.16),transparent_60%),linear-gradient(to_bottom,rgba(2,6,23,0.98),rgba(3,7,18,1))]" />

      {/* Aurora animated blobs */}
      <div className="pointer-events-none absolute -top-56 -left-40 h-[36rem] w-[36rem] rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-56 -right-40 h-[36rem] w-[36rem] rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

      {/* Subtle perspective grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          transform: 'perspective(900px) rotateX(62deg) translateY(33%) scale(1.3)',
          transformOrigin: 'center',
        }}
      />

      {/* Edge vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)]" />

      {/* Tiny film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg fill='%23ffffff' fill-opacity='0.9'%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3Ccircle cx='72' cy='54' r='1'/%3E%3Ccircle cx='132' cy='100' r='1'/%3E%3Ccircle cx='40' cy='130' r='1'/%3E%3Ccircle cx='155' cy='40' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-[1]">{children}</div>
    </div>
  );
};

/**
 * Card3D (UPGRADED)
 * - Mouse reactive tilt + shine + depth shadows
 * - supports: <Card3D>...</Card3D>
 * - supports: <Card3D as="button" onClick={...}>...</Card3D>
 */
const Card3D = ({ as: Comp = 'div', className = '', children, ...props }) => {
  const ref = React.useRef(null);

    const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const ry = (px - 0.5) * 10;     // left-right tilt
    const rx = -(py - 0.5) * 10;    // up-down tilt
    el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-2px)`;
    el.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
  };

  return (
    <Comp
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...props}
      className={[
        'relative z-0 hover:z-20 overflow-visible rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl',
        'shadow-[0_35px_100px_-65px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.16)]',
        'transition-transform duration-200 will-change-transform',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl',
        'before:bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.16),transparent_45%)]',
        'after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-px after:rounded-t-3xl after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent',
        className,
      ].join(' ')}
    >
      {children}
    </Comp>
  );
};
// ─── BADGES (NO functions — plain data only) ──────────────────────────────────
const ALL_BADGES = [
  { id:'first_login',   name:'First Step',        desc:'Log in for the first time',      icon:'🚀', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'first_quiz',    name:'Quiz Starter',       desc:'Complete your first quiz',       icon:'📝', minPoints:0,     minLevel:1,  minQuizzes:1,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'points_100',    name:'Century',            desc:'Earn 100 points',                icon:'💯', minPoints:100,   minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'points_250',    name:'Quarter K',          desc:'Earn 250 points',                icon:'🌟', minPoints:250,   minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'points_500',    name:'High Flyer',         desc:'Earn 500 points',                icon:'🏆', minPoints:500,   minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'points_750',    name:'Three-Quarter K',    desc:'Earn 750 points',                icon:'🎖️', minPoints:750,   minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'points_1000',   name:'Scholar',            desc:'Earn 1000 points',               icon:'📚', minPoints:1000,  minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'points_2000',   name:'Knowledge Seeker',   desc:'Earn 2000 points',               icon:'🔭', minPoints:2000,  minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'points_3000',   name:'Unstoppable',        desc:'Earn 3000 points',               icon:'💪', minPoints:3000,  minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'points_5000',   name:'Grand Master',       desc:'Earn 5000 points',               icon:'🎖️', minPoints:5000,  minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'points_10000',  name:'Platinum',           desc:'Earn 10000 points',              icon:'🔮', minPoints:10000, minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'level_2',       name:'Level Up!',          desc:'Reach Level 2',                  icon:'⬆️', minPoints:0,     minLevel:2,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'level_3',       name:'Learner',            desc:'Reach Level 3',                  icon:'📈', minPoints:0,     minLevel:3,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'level_5',       name:'Rising Star',        desc:'Reach Level 5',                  icon:'⭐', minPoints:0,     minLevel:5,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'level_7',       name:'High Achiever',      desc:'Reach Level 7',                  icon:'🚀', minPoints:0,     minLevel:7,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'level_10',      name:'Master',             desc:'Reach Level 10',                 icon:'👑', minPoints:0,     minLevel:10, minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'level_15',      name:'Legend',             desc:'Reach Level 15',                 icon:'🏅', minPoints:0,     minLevel:15, minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'level_20',      name:'Grandmaster',        desc:'Reach Level 20',                 icon:'🎓', minPoints:0,     minLevel:20, minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'quiz_3',        name:'Quiz Fan',           desc:'Complete 3 quizzes',             icon:'🎯', minPoints:0,     minLevel:1,  minQuizzes:3,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'quiz_5',        name:'Quiz Regular',       desc:'Complete 5 quizzes',             icon:'📋', minPoints:0,     minLevel:1,  minQuizzes:5,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'quiz_10',       name:'Quiz Champion',      desc:'Complete 10 quizzes',            icon:'🏅', minPoints:0,     minLevel:1,  minQuizzes:10, minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'quiz_20',       name:'Quiz Master',        desc:'Complete 20 quizzes',            icon:'🏆', minPoints:0,     minLevel:1,  minQuizzes:20, minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'quiz_25',       name:'Quiz Addict',        desc:'Complete 25 quizzes',            icon:'🎪', minPoints:0,     minLevel:1,  minQuizzes:25, minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'perfect_score', name:'Perfect Score',      desc:'Score 100% on a quiz',           icon:'💎', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:1 },
  { id:'perfect_3',     name:'Triple Perfect',     desc:'Score 100% three times',         icon:'💫', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:3 },
  { id:'session_1',     name:'First Booking',      desc:'Book your first session',        icon:'📅', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:1,  minStreak:0,  minPerfect:0 },
  { id:'session_3',     name:'Session Goer',       desc:'Book 3 sessions',                icon:'🗓️', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:3,  minStreak:0,  minPerfect:0 },
  { id:'session_5',     name:'Regular Learner',    desc:'Book 5 sessions',                icon:'🎓', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:5,  minStreak:0,  minPerfect:0 },
  { id:'session_10',    name:'Dedicated Student',  desc:'Book 10 sessions',               icon:'🎒', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:10, minStreak:0,  minPerfect:0 },
  { id:'streak_3',      name:'On a Roll',          desc:'3-day learning streak',          icon:'🔥', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:3,  minPerfect:0 },
  { id:'streak_5',      name:'Dedicated',          desc:'5-day learning streak',          icon:'🏋️', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:5,  minPerfect:0 },
  { id:'streak_7',      name:'Week Warrior',       desc:'7-day learning streak',          icon:'⚡', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:7,  minPerfect:0 },
  { id:'streak_14',     name:'Fortnight',          desc:'14-day streak',                  icon:'🌈', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:14, minPerfect:0 },
  { id:'streak_30',     name:'Monthly Grinder',    desc:'30-day streak',                  icon:'🗓️', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:30, minPerfect:0 },
  { id:'top_scorer',    name:'Top Scorer',         desc:'Score above 90% average',        icon:'🎯', minPoints:200,   minLevel:2,  minQuizzes:5,  minSessions:0,  minStreak:0,  minPerfect:1 },
  { id:'completionist', name:'Completionist',      desc:'Complete every subject quiz',    icon:'✅', minPoints:0,     minLevel:5,  minQuizzes:15, minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'all_rounder',   name:'All Rounder',        desc:'Complete quizzes in 3 subjects', icon:'🌍', minPoints:0,     minLevel:1,  minQuizzes:9,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'mentor_fav',    name:"Mentor's Fave",      desc:'Book same tutor 3 times',        icon:'❤️', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:3,  minStreak:0,  minPerfect:0 },
  { id:'comeback_kid',  name:'Comeback Kid',       desc:'Retake and improve a quiz',      icon:'🔄', minPoints:0,     minLevel:1,  minQuizzes:2,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'explorer',      name:'Explorer',           desc:'Visit all 5 tabs',               icon:'🗺️', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'bookworm',      name:'Bookworm',           desc:'View 10 resources',              icon:'📖', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'social_star',   name:'Social Star',        desc:'Share your progress',            icon:'🌟', minPoints:50,    minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'speed_demon',   name:'Speed Demon',        desc:'Complete a quiz in under 5 min', icon:'⚡', minPoints:0,     minLevel:1,  minQuizzes:1,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'early_bird',    name:'Early Bird',         desc:'Login before 7 AM',              icon:'🌅', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:1,  minPerfect:0 },
  { id:'night_owl',     name:'Night Owl',          desc:'Study after 10 PM',              icon:'🦉', minPoints:0,     minLevel:1,  minQuizzes:0,  minSessions:0,  minStreak:1,  minPerfect:0 },
  { id:'code_wizard',   name:'Code Wizard',        desc:'Complete 3 Programming quizzes', icon:'💻', minPoints:0,     minLevel:1,  minQuizzes:3,  minSessions:0,  minStreak:0,  minPerfect:0 },
  { id:'math_lover',    name:'Math Lover',         desc:'Complete 3 Math quizzes',        icon:'➕', minPoints:0,     minLevel:1,  minQuizzes:3,  minSessions:0,  minStreak:0,  minPerfect:0 },
];

const isBadgeEarned = (badge, progress) =>
  (progress.points        || 0) >= badge.minPoints   &&
  (progress.level         || 1) >= badge.minLevel    &&
  (progress.quizzes       || 0) >= badge.minQuizzes  &&
  (progress.sessions      || 0) >= badge.minSessions &&
  (progress.streak        || 0) >= badge.minStreak   &&
  (progress.perfectScores || 0) >= badge.minPerfect;

// ─── TUTORS DATA ──────────────────────────────────────────────────────────────
const TUTORS = [
  { id:1,  name:'Dr. Sarah Johnson',   subject:'Mathematics',     specialty:'Algebra & Calculus',           exp:12, rating:4.9, reviews:234, price:25,  img:'SJ', color:'from-blue-500 to-cyan-600',     badge:'Top Rated', sessions:['Mon 2PM','Wed 4PM','Fri 2PM'],     bio:'PhD from MIT. Expert in advanced calculus, linear algebra and statistics.' },
  { id:2,  name:'Prof. Mike Chen',     subject:'Programming',     specialty:'Web Dev & Algorithms',         exp:9,  rating:4.8, reviews:189, price:30,  img:'MC', color:'from-purple-500 to-violet-600',  badge:'Popular',   sessions:['Tue 3PM','Thu 5PM','Sat 10AM'],    bio:'Former Google engineer. Teaches JS, Python, React, Node and system design.' },
  { id:3,  name:'Emily Roberts',       subject:'English',         specialty:'Grammar & Creative Writing',   exp:7,  rating:4.7, reviews:156, price:20,  img:'ER', color:'from-green-500 to-teal-600',    badge:'New',       sessions:['Mon 10AM','Wed 2PM','Fri 4PM'],    bio:'Cambridge graduate. Specializes in IELTS, TOEFL and academic writing.' },
  { id:4,  name:'Dr. James Wilson',    subject:'Physics',         specialty:'Mechanics & Quantum',          exp:15, rating:4.9, reviews:312, price:35,  img:'JW', color:'from-orange-500 to-red-600',    badge:'Top Rated', sessions:['Tue 4PM','Thu 2PM','Sun 11AM'],    bio:'Published researcher at Stanford. Makes complex physics intuitive and fun.' },
  { id:5,  name:'Dr. Priya Sharma',    subject:'Chemistry',       specialty:'Organic & Inorganic Chem',     exp:10, rating:4.8, reviews:201, price:28,  img:'PS', color:'from-pink-500 to-rose-600',     badge:'Popular',   sessions:['Mon 3PM','Wed 5PM','Sat 2PM'],     bio:'IIT Delhi alumna. Expert in JEE chemistry, organic reactions and lab techniques.' },
  { id:6,  name:'Prof. David Lee',     subject:'History',         specialty:'World History & Politics',     exp:11, rating:4.6, reviews:143, price:22,  img:'DL', color:'from-amber-500 to-yellow-600',  badge:'',          sessions:['Tue 11AM','Thu 3PM','Fri 5PM'],    bio:'Oxford historian. Passionate about making history engaging and relevant.' },
  { id:7,  name:'Ms. Aisha Patel',     subject:'Biology',         specialty:'Genetics & Cell Biology',      exp:8,  rating:4.7, reviews:178, price:26,  img:'AP', color:'from-emerald-500 to-green-600', badge:'Rising',    sessions:['Mon 4PM','Wed 11AM','Sun 3PM'],    bio:'AIIMS graduate. Specializes in NEET biology, genetics and human physiology.' },
  { id:8,  name:'Dr. Carlos Rivera',   subject:'Economics',       specialty:'Micro & Macroeconomics',       exp:13, rating:4.8, reviews:267, price:32,  img:'CR', color:'from-indigo-500 to-blue-600',   badge:'Popular',   sessions:['Tue 2PM','Thu 4PM','Sat 11AM'],    bio:'Former IMF economist. Teaches economics from basics to advanced theory.' },
  { id:9,  name:'Prof. Lisa Zhang',    subject:'Data Science',    specialty:'ML & Data Analysis',           exp:6,  rating:4.9, reviews:289, price:40,  img:'LZ', color:'from-violet-500 to-purple-600', badge:'Top Rated', sessions:['Mon 5PM','Wed 3PM','Fri 11AM'],    bio:'Ex-Netflix data scientist. Python, ML, TensorFlow and data visualization.' },
  { id:10, name:'Mr. Raj Krishnan',    subject:'Music',           specialty:'Piano & Music Theory',         exp:14, rating:4.7, reviews:134, price:24,  img:'RK', color:'from-teal-500 to-cyan-600',    badge:'',          sessions:['Tue 5PM','Thu 11AM','Sun 2PM'],    bio:'Berklee graduate. Classical and contemporary piano, sight reading, composition.' },
  { id:11, name:'Dr. Anna Kowalski',   subject:'Psychology',      specialty:'Cognitive & Behavioral',       exp:9,  rating:4.8, reviews:198, price:35,  img:'AK', color:'from-rose-500 to-pink-600',    badge:'Rising',    sessions:['Mon 11AM','Wed 4PM','Sat 3PM'],    bio:'Clinical psychologist. Covers psychology fundamentals to advanced research methods.' },
  { id:12, name:'Prof. Omar Hassan',   subject:'Arabic',          specialty:'Arabic Language & Literature', exp:16, rating:4.9, reviews:145, price:22,  img:'OH', color:'from-yellow-500 to-amber-600',  badge:'',          sessions:['Tue 10AM','Thu 5PM','Fri 3PM'],    bio:'Al-Azhar University professor. Quran memorization, Arabic grammar and literature.' },
  { id:13, name:'Dr. Wei Lin',         subject:'Mathematics',     specialty:'Statistics & Probability',     exp:8,  rating:4.8, reviews:167, price:28,  img:'WL', color:'from-cyan-500 to-blue-600',    badge:'Rising',    sessions:['Mon 3PM','Wed 5PM','Sat 11AM'],    bio:'Stanford statistics PhD. Expert in probability theory, regression and data analysis.' },
  { id:14, name:'Ms. Sofia Martinez',  subject:'Art & Design',    specialty:'UI/UX & Digital Art',          exp:6,  rating:4.7, reviews:112, price:22,  img:'SM', color:'from-fuchsia-500 to-pink-600',  badge:'New',       sessions:['Tue 2PM','Thu 4PM','Fri 11AM'],    bio:'Ex-Adobe designer. Teaches Figma, Illustrator, Procreate and design principles.' },
  { id:15, name:'Prof. Arjun Mehta',   subject:'Programming',     specialty:'Python & Machine Learning',    exp:7,  rating:4.8, reviews:203, price:35,  img:'AM', color:'from-green-500 to-emerald-600', badge:'Popular',   sessions:['Mon 4PM','Wed 2PM','Sat 3PM'],     bio:'IIT Bombay alumnus. Python, ML, deep learning and competitive programming.' },
  { id:16, name:'Dr. Fatima Al-Zahra', subject:'Physics',         specialty:'Optics & Modern Physics',      exp:11, rating:4.7, reviews:156, price:30,  img:'FZ', color:'from-sky-500 to-indigo-600',   badge:'',          sessions:['Tue 3PM','Thu 11AM','Sun 2PM'],    bio:'Cairo University physicist. Expert in modern physics, optics and electromagnetic theory.' },
  { id:17, name:'Mr. Tom Bradley',     subject:'English',         specialty:'Business English & GMAT',      exp:9,  rating:4.6, reviews:134, price:25,  img:'TB', color:'from-lime-500 to-green-600',   badge:'',          sessions:['Mon 11AM','Wed 4PM','Fri 3PM'],    bio:'Oxford graduate, former corporate trainer. GMAT, GRE verbal, business writing.' },
  { id:18, name:'Dr. Yuki Tanaka',     subject:'Chemistry',       specialty:'Analytical Chemistry',         exp:12, rating:4.8, reviews:178, price:32,  img:'YT', color:'from-red-500 to-orange-600',   badge:'Top Rated', sessions:['Tue 4PM','Thu 2PM','Sat 10AM'],    bio:'Tokyo University graduate. Analytical chemistry, spectroscopy and lab techniques.' },
  { id:19, name:'Prof. Elena Vasquez', subject:'History',         specialty:'European & Latin American',    exp:10, rating:4.7, reviews:123, price:24,  img:'EV', color:'from-orange-500 to-amber-600',  badge:'',          sessions:['Mon 2PM','Wed 11AM','Sun 4PM'],    bio:'Columbia University historian. European history, colonialism and modern politics.' },
  { id:20, name:'Ms. Preethi Nair',    subject:'Biology',         specialty:'Microbiology & Biochemistry',  exp:7,  rating:4.9, reviews:189, price:28,  img:'PN', color:'from-teal-500 to-green-600',   badge:'Rising',    sessions:['Tue 11AM','Thu 5PM','Fri 2PM'],    bio:'AIIMS graduate. Microbiology, biochemistry and molecular biology for NEET.' },
  { id:21, name:'Dr. Kevin Oduya',     subject:'Economics',       specialty:'Development Economics',        exp:9,  rating:4.7, reviews:145, price:26,  img:'KO', color:'from-blue-600 to-purple-600',  badge:'',          sessions:['Mon 5PM','Wed 3PM','Sat 2PM'],     bio:'LSE economist. Development economics, game theory and behavioral economics.' },
  { id:22, name:'Mr. Liang Wei',       subject:'Data Science',    specialty:'Deep Learning & NLP',          exp:5,  rating:4.8, reviews:234, price:42,  img:'LW', color:'from-violet-600 to-indigo-600', badge:'Top Rated', sessions:['Tue 5PM','Thu 3PM','Sun 11AM'],    bio:'Ex-DeepMind researcher. Neural networks, NLP, transformers and computer vision.' },
  { id:23, name:'Dr. Amara Diallo',    subject:'Psychology',      specialty:'Positive Psychology',          exp:8,  rating:4.6, reviews:112, price:30,  img:'AD', color:'from-pink-600 to-rose-600',    badge:'',          sessions:['Mon 3PM','Wed 5PM','Fri 4PM'],     bio:'Yale psychology PhD. Positive psychology, mindfulness, motivation and well-being.' },
  { id:24, name:'Ms. Rina Kapoor',     subject:'Music',           specialty:'Vocals & Hindustani',          exp:12, rating:4.8, reviews:156, price:26,  img:'RK2',color:'from-yellow-500 to-orange-600', badge:'Popular',  sessions:['Tue 2PM','Thu 4PM','Sat 11AM'],    bio:'Gandharva Mahavidyalaya graduate. Classical vocals, Hindustani music and film songs.' },
];

// ─── RESOURCES DATA ───────────────────────────────────────────────────────────
const RESOURCES = [
  { id:1,  title:'Complete Calculus Handbook',         subject:'Mathematics',  type:'PDF',         author:'Dr. Sarah Johnson',  downloads:1234, rating:4.8, premium:false, pages:180,    desc:'Limits, derivatives, integrals with solved examples.' },
  { id:2,  title:'Linear Algebra Masterclass',         subject:'Mathematics',  type:'Video',       author:'Dr. Sarah Johnson',  downloads:892,  rating:4.9, premium:true,  duration:'6h 30m', desc:'Vectors, matrices, eigenvalues — full course.' },
  { id:3,  title:'Statistics & Probability Guide',     subject:'Mathematics',  type:'PDF',         author:'Prof. Alan Turing',  downloads:567,  rating:4.6, premium:false, pages:95,     desc:'Probability theory, distributions, hypothesis testing.' },
  { id:4,  title:'SAT Math Prep Series',               subject:'Mathematics',  type:'Interactive', author:'Dr. Sarah Johnson',  downloads:2341, rating:4.7, premium:true,  lessons:40,   desc:'Complete SAT math preparation with timed quizzes.' },
  { id:5,  title:'JavaScript — Zero to Hero',          subject:'Programming',  type:'Video',       author:'Prof. Mike Chen',    downloads:3421, rating:4.9, premium:false, duration:'12h',    desc:'ES6+, async/await, DOM, fetch API and projects.' },
  { id:6,  title:'Python for Data Science',            subject:'Programming',  type:'Video',       author:'Prof. Arjun Mehta',  downloads:2876, rating:4.9, premium:true,  duration:'15h',    desc:'NumPy, Pandas, Matplotlib, Scikit-learn.' },
  { id:7,  title:'React & Node Full Stack Guide',      subject:'Programming',  type:'PDF',         author:'Prof. Mike Chen',    downloads:1876, rating:4.8, premium:true,  pages:320,    desc:'Build complete web apps with React frontend and Node backend.' },
  { id:8,  title:'Data Structures & Algorithms',       subject:'Programming',  type:'Interactive', author:'Prof. Mike Chen',    downloads:4312, rating:4.9, premium:false, lessons:60,   desc:'Arrays, trees, graphs, sorting — interview prep.' },
  { id:9,  title:'System Design Fundamentals',         subject:'Programming',  type:'PDF',         author:'Prof. Mike Chen',    downloads:987,  rating:4.7, premium:true,  pages:210,    desc:'Scalable system design for SDE interviews.' },
  { id:10, title:'Classical Mechanics Complete Notes', subject:'Physics',      type:'PDF',         author:'Dr. James Wilson',   downloads:1543, rating:4.8, premium:false, pages:240,    desc:"Newton's laws, energy, momentum, rotational motion." },
  { id:11, title:'Quantum Physics Simplified',         subject:'Physics',      type:'Video',       author:'Dr. James Wilson',   downloads:876,  rating:4.9, premium:true,  duration:'8h',     desc:'Wave-particle duality, Schrödinger equation, quantum states.' },
  { id:12, title:'JEE Physics Formula Book',           subject:'Physics',      type:'PDF',         author:'Dr. James Wilson',   downloads:5432, rating:4.7, premium:false, pages:85,     desc:'All JEE physics formulas organized by chapter.' },
  { id:13, title:'Organic Chemistry Reactions Atlas',  subject:'Chemistry',    type:'PDF',         author:'Dr. Priya Sharma',   downloads:2134, rating:4.8, premium:false, pages:190,    desc:'All named reactions with mechanisms and examples.' },
  { id:14, title:'Physical Chemistry Video Course',    subject:'Chemistry',    type:'Video',       author:'Dr. Priya Sharma',   downloads:1234, rating:4.7, premium:true,  duration:'10h',    desc:'Thermodynamics, kinetics, equilibrium — complete course.' },
  { id:15, title:'NEET Chemistry Crash Course',        subject:'Chemistry',    type:'Interactive', author:'Dr. Yuki Tanaka',    downloads:3456, rating:4.9, premium:true,  lessons:50,   desc:'Topic-wise NEET chemistry with previous year questions.' },
  { id:16, title:'Cell Biology Complete Guide',        subject:'Biology',      type:'PDF',         author:'Ms. Aisha Patel',    downloads:1876, rating:4.7, premium:false, pages:165,    desc:'Cell structure, division, genetics and molecular biology.' },
  { id:17, title:'Human Anatomy Video Series',         subject:'Biology',      type:'Video',       author:'Ms. Aisha Patel',    downloads:2341, rating:4.8, premium:true,  duration:'9h',     desc:'Complete human body systems with 3D diagrams.' },
  { id:18, title:'NEET Biology MCQ Bank',              subject:'Biology',      type:'Interactive', author:'Ms. Preethi Nair',   downloads:6543, rating:4.9, premium:false, lessons:80,   desc:'5000+ NEET biology questions with detailed solutions.' },
  { id:19, title:'Advanced Grammar & Usage',           subject:'English',      type:'PDF',         author:'Emily Roberts',      downloads:2134, rating:4.6, premium:false, pages:140,    desc:'Complete English grammar from basics to advanced usage.' },
  { id:20, title:'IELTS Writing Band 8+ Guide',        subject:'English',      type:'PDF',         author:'Emily Roberts',      downloads:4321, rating:4.8, premium:true,  pages:120,    desc:'Task 1 & 2 strategies with model answers.' },
  { id:21, title:'Spoken English Masterclass',         subject:'English',      type:'Video',       author:'Mr. Tom Bradley',    downloads:3456, rating:4.7, premium:true,  duration:'7h',     desc:'Accent, fluency, business English and presentations.' },
  { id:22, title:'World History Timeline Atlas',       subject:'History',      type:'PDF',         author:'Prof. David Lee',    downloads:1234, rating:4.5, premium:false, pages:200,    desc:'Complete world history from ancient to modern times.' },
  { id:23, title:'UPSC History Notes',                 subject:'History',      type:'PDF',         author:'Prof. Elena Vasquez',downloads:3421, rating:4.7, premium:true,  pages:280,    desc:'Comprehensive Indian and world history for UPSC.' },
  { id:24, title:'Microeconomics Visual Guide',        subject:'Economics',    type:'Video',       author:'Dr. Carlos Rivera',  downloads:987,  rating:4.7, premium:false, duration:'5h',     desc:'Supply, demand, elasticity, market structures.' },
  { id:25, title:'Macroeconomics & Policy',            subject:'Economics',    type:'PDF',         author:'Dr. Kevin Oduya',    downloads:876,  rating:4.6, premium:true,  pages:175,    desc:'GDP, inflation, monetary and fiscal policy.' },
  { id:26, title:'Machine Learning A-Z',               subject:'Data Science', type:'Video',       author:'Prof. Lisa Zhang',   downloads:5432, rating:4.9, premium:true,  duration:'20h',    desc:'Supervised, unsupervised, reinforcement learning.' },
  { id:27, title:'SQL & Database Design',              subject:'Data Science', type:'Interactive', author:'Mr. Liang Wei',      downloads:3456, rating:4.8, premium:false, lessons:45,   desc:'SQL from basics to advanced queries and optimization.' },
  { id:28, title:'Data Visualization with Python',     subject:'Data Science', type:'Video',       author:'Prof. Lisa Zhang',   downloads:2134, rating:4.7, premium:true,  duration:'6h',     desc:'Matplotlib, Seaborn, Plotly and Tableau basics.' },
  { id:29, title:'Introduction to Psychology',         subject:'Psychology',   type:'PDF',         author:'Dr. Anna Kowalski',  downloads:1543, rating:4.6, premium:false, pages:160,    desc:'Consciousness, perception, memory, personality.' },
  { id:30, title:'Cognitive Behavioral Therapy Guide', subject:'Psychology',   type:'PDF',         author:'Dr. Amara Diallo',   downloads:987,  rating:4.7, premium:true,  pages:130,    desc:'CBT techniques, cognitive distortions and worksheets.' },
  { id:31, title:'Music Theory Fundamentals',          subject:'Music',        type:'Video',       author:'Mr. Raj Krishnan',   downloads:1234, rating:4.7, premium:false, duration:'4h',     desc:'Notes, scales, chords, rhythm and ear training.' },
  { id:32, title:'Piano Beginner to Intermediate',     subject:'Music',        type:'Video',       author:'Ms. Rina Kapoor',    downloads:2341, rating:4.8, premium:true,  duration:'8h',     desc:'Technique, scales, repertoire and sight reading.' },
  { id:33, title:'Arabic for Beginners',               subject:'Arabic',       type:'Video',       author:'Prof. Omar Hassan',  downloads:876,  rating:4.8, premium:false, duration:'5h',     desc:'Arabic alphabet, pronunciation and basic conversations.' },
  { id:34, title:'Quran Tajweed Rules',                subject:'Arabic',       type:'PDF',         author:'Prof. Omar Hassan',  downloads:3456, rating:4.9, premium:false, pages:95,     desc:'Complete tajweed rules with audio examples.' },
  { id:35, title:'Digital Art Fundamentals',           subject:'Art & Design', type:'Video',       author:'Ms. Sofia Martinez', downloads:1876, rating:4.7, premium:true,  duration:'6h',     desc:'Procreate, Adobe Illustrator basics and design principles.' },
  { id:36, title:'UI/UX Design Masterclass',           subject:'Art & Design', type:'Video',       author:'Ms. Sofia Martinez', downloads:2341, rating:4.8, premium:true,  duration:'10h',    desc:'Figma, user research, wireframing and prototyping.' },
];

// ─── VIDEO MAP ────────────────────────────────────────────────────────────────
const VIDEO_MAP = {
  'JavaScript — Zero to Hero':         'https://www.youtube.com/embed/W6NZfCO5SIk',
  'Classical Mechanics Complete Notes':'https://www.youtube.com/embed/b1t41Q3xRM8',
  'Cell Biology Complete Guide':       'https://www.youtube.com/embed/URUJD5NEXC8',
  'Advanced Grammar & Usage':          'https://www.youtube.com/embed/m3gBjBJOAU4',
  'World History Timeline Atlas':      'https://www.youtube.com/embed/-muIoWofsCE',
  'Data Structures & Algorithms':      'https://www.youtube.com/embed/pkYVOmU3MgA',
  'Music Theory Fundamentals':         'https://www.youtube.com/embed/rgaTLrZGlk0',
  'Arabic for Beginners':              'https://www.youtube.com/embed/eLdZ7kqS_Tc',
  'Quran Tajweed Rules':               'https://www.youtube.com/embed/n40djXpDj6M',
  'Introduction to Psychology':        'https://www.youtube.com/embed/vo4pMVb0R6M',
  'Statistics & Probability Guide':    'https://www.youtube.com/embed/sxQaBpKfDRk',
  'Microeconomics Visual Guide':       'https://www.youtube.com/embed/4CpAkDg2xhg',
  'JEE Physics Formula Book':          'https://www.youtube.com/embed/b1t41Q3xRM8',
  'Organic Chemistry Reactions Atlas': 'https://www.youtube.com/embed/oLirGH7dXNY',
  'SQL & Database Design':             'https://www.youtube.com/embed/HXV3zeQKqGY',
};

// ─── QUIZ QUESTIONS ───────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = {
  'Algebra Fundamentals': [
    { q:'What is the value of x in 2x + 4 = 10?',         opts:['2','3','4','5'],                                       ans:1 },
    { q:'Simplify: 3(x + 2)',                             opts:['3x+2','3x+6','3x+5','6x'],                             ans:1 },
    { q:'What is the slope of y = 3x + 7?',               opts:['7','3','10','1'],                                      ans:1 },
    { q:'Solve: x² = 25',                                  opts:['x=5 only','x=±5','x=25','x=±25'],                     ans:1 },
    { q:'Quadratic formula?',                              opts:['x=(-b±√(b²-4ac))/2a','x=(b±√(b²+4ac))/2a','x=-b/2a','x=√(b²-4ac)'], ans:0 },
  ],
  'Calculus Challenge': [
    { q:'Derivative of x²?',                              opts:['x','2x','2','x³/3'],                                   ans:1 },
    { q:'∫2x dx = ?',                                     opts:['2','x²','x²+C','2x²+C'],                              ans:2 },
    { q:'Derivative of sin(x)?',                          opts:['-cos(x)','cos(x)','-sin(x)','tan(x)'],                 ans:1 },
    { q:'Limit of (sin x)/x as x→0?',                     opts:['0','∞','1','undefined'],                              ans:2 },
    { q:'Derivative of eˣ?',                              opts:['xeˣ⁻¹','eˣ','e','1'],                                 ans:1 },
  ],
  'JavaScript ES6+': [
    { q:'What does "===" check?',                         opts:['Value only','Type only','Value and type','Reference'],  ans:2 },
    { q:'typeof null returns?',                           opts:['"null"','"object"','"undefined"','"boolean"'],          ans:1 },
    { q:'Block-scoped variable keyword?',                 opts:['var','let','function','class'],                         ans:1 },
    { q:'Array.map() returns?',                           opts:['Same array modified','A new array','undefined','boolean'], ans:1 },
    { q:'What is a Promise?',                             opts:['A loop','Async operation handler','Variable type','CSS property'], ans:1 },
  ],
  'Python Basics': [
    { q:'Output of print(type([]))?',                     opts:["<class 'list'>","<class 'array'>","<class 'tuple'>","<class 'dict'>"], ans:0 },
    { q:'How to define a function?',                      opts:['function myF():','def myF():','fun myF():','func myF():'], ans:1 },
    { q:'Exponentiation operator?',                       opts:['^','**','^^','exp()'],                                  ans:1 },
    { q:'len("hello") returns?',                          opts:['4','5','6','Error'],                                   ans:1 },
    { q:'List comprehension is?',                         opts:['A for loop','Concise list creation','Dict method','Class method'], ans:1 },
  ],
  "Newton's Laws of Motion": [
    { q:"Newton's First Law is also called?",             opts:['Law of Acceleration','Law of Inertia','Action-Reaction','Gravity'], ans:1 },
    { q:'F = ma is Newton\'s ___ Law',                   opts:['First','Second','Third','Fourth'],                      ans:1 },
    { q:'SI unit of Force?',                              opts:['Joule','Watt','Newton','Pascal'],                       ans:2 },
    { q:'Body at rest stays at rest due to?',             opts:['Friction','Gravity','Inertia','Momentum'],              ans:2 },
    { q:'Action and reaction act on?',                    opts:['Same body','Different bodies','Neither','Same point'],  ans:1 },
  ],
  'Organic Chemistry Basics': [
    { q:'Simplest organic compound?',                     opts:['Ethane','Methane','Propane','Butane'],                  ans:1 },
    { q:'Functional group of alcohols?',                  opts:['-COOH','-NH₂','-OH','-CHO'],                           ans:2 },
    { q:'Isomerism means?',                               opts:['Same formula, different structure','Different formula, same structure','Same everything','None'], ans:0 },
    { q:'Benzene has ___ carbon atoms?',                  opts:['4','5','6','8'],                                       ans:2 },
    { q:'Example of an alkane?',                          opts:['Ethene','Ethyne','Ethane','Benzene'],                   ans:2 },
  ],
  'English Grammar Mastery': [
    { q:'A noun referring to a group is?',                opts:['Proper','Abstract','Collective','Common'],              ans:2 },
    { q:'"She runs fast" — "runs" is a?',                 opts:['Noun','Adjective','Verb','Adverb'],                     ans:2 },
    { q:'Passive voice sentence?',                        opts:['He ate the cake','The cake was eaten by him','He eats cake','He will eat cake'], ans:1 },
    { q:'"Neither John nor his friends ___ coming."',     opts:['is','are','was','were'],                               ans:1 },
    { q:'"Beautiful" is an?',                             opts:['Adverb','Verb','Adjective','Noun'],                     ans:2 },
  ],
  'Electromagnetic Waves': [
    { q:'Speed of light in vacuum?',                      opts:['3×10⁸ m/s','3×10⁶ m/s','3×10¹⁰ m/s','3×10⁴ m/s'],   ans:0 },
    { q:'EM waves are ___ waves',                         opts:['Mechanical','Longitudinal','Transverse','Sound'],       ans:2 },
    { q:'Which has highest frequency?',                   opts:['Radio','Infrared','Gamma rays','X-rays'],              ans:2 },
    { q:'Visible light range (nm)?',                      opts:['100-400','400-700','700-1000','1000+'],                 ans:1 },
    { q:'EM waves need medium?',                          opts:['Yes','No','Only in vacuum','Only in air'],              ans:1 },
  ],
};

const DEFAULT_QUESTIONS = (title) => [
  { q:`In ${title}, which is a fundamental concept?`,   opts:['Basic Principle','Advanced Theory','Correct Answer','Complex Formula'], ans:2 },
  { q:`Primary method in ${title}?`,                   opts:['Option A','Correct Method','Option C','Option D'],         ans:1 },
  { q:`Key formula in ${title}?`,                      opts:['Correct Formula','Option B','Option C','Option D'],        ans:0 },
  { q:`${title} is categorized as?`,                   opts:['Option A','Option B','Option C','Correct Category'],       ans:3 },
  { q:`Best approach to study ${title}?`,              opts:['Option A','Practice Problems','Option C','Option D'],      ans:1 },
];

// ─── QUIZZES DATA ─────────────────────────────────────────────────────────────
const QUIZZES_DATA = [
  { id:1,  title:'Algebra Fundamentals',      questions:5,  difficulty:'Easy',   subject:'Mathematics', time:20, points:150 },
  { id:2,  title:'Calculus Challenge',        questions:5,  difficulty:'Hard',   subject:'Mathematics', time:30, points:200 },
  { id:3,  title:'JavaScript ES6+',           questions:5,  difficulty:'Medium', subject:'Programming', time:35, points:250 },
  { id:4,  title:'Python Basics',             questions:5,  difficulty:'Easy',   subject:'Programming', time:25, points:200 },
  { id:5,  title:"Newton's Laws of Motion",   questions:5,  difficulty:'Easy',   subject:'Physics',     time:20, points:150 },
  { id:6,  title:'Electromagnetic Waves',     questions:5,  difficulty:'Medium', subject:'Physics',     time:30, points:200 },
  { id:7,  title:'Organic Chemistry Basics',  questions:5,  difficulty:'Medium', subject:'Chemistry',   time:35, points:250 },
  { id:8,  title:'Cell Biology Deep Dive',    questions:5,  difficulty:'Medium', subject:'Biology',     time:25, points:200 },
  { id:9,  title:'English Grammar Mastery',   questions:5,  difficulty:'Easy',   subject:'English',     time:40, points:300 },
  { id:10, title:'World History Quiz',        questions:5,  difficulty:'Medium', subject:'History',     time:30, points:250 },
  { id:11, title:'Microeconomics Concepts',   questions:5,  difficulty:'Hard',   subject:'Economics',   time:30, points:200 },
  { id:12, title:'Machine Learning Basics',   questions:5,  difficulty:'Hard',   subject:'Data Science',time:35, points:200 },
  { id:13, title:'Psychology 101',            questions:5,  difficulty:'Easy',   subject:'Psychology',  time:20, points:150 },
  { id:14, title:'Music Theory Quiz',         questions:5,  difficulty:'Medium', subject:'Music',       time:20, points:150 },
  { id:15, title:'React Hooks & State',       questions:5,  difficulty:'Hard',   subject:'Programming', time:25, points:150 },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const FInput = ({ icon: Icon, type = 'text', placeholder, value, onChange, error, right }) => (
  <div className="space-y-1">
    <div className={`flex items-center gap-3 bg-white/10 border ${error ? 'border-red-400/60' : 'border-white/20'} rounded-xl px-4 py-3 focus-within:border-blue-400/60 transition-all`}>
      {Icon && <Icon className="w-4 h-4 text-white/40 flex-shrink-0" />}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none" />
      {right}
    </div>
    {error && <p className="text-red-400 text-xs pl-1">{error}</p>}
  </div>
);

const Spin = () => (
  <span className="flex items-center justify-center gap-2">
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
    Please wait...
  </span>
);

const ErrBox = ({ msg }) => msg ? (
  <div className="flex items-start gap-2 bg-red-500/10 border border-red-400/30 rounded-xl p-3 mb-5">
    <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
    <p className="text-red-400 text-sm">{msg}</p>
  </div>
) : null;

// ─── LANDING PAGE (3D) ───────────────────────────────────────────────────────
const LandingPage = ({ onGetStarted }) => {
  const stats = [
    { label: 'Active Students', value: '12,000+', icon: Users },
    { label: 'Expert Mentors',  value: '800+',    icon: GraduationCap },
    { label: 'Live Sessions',   value: '5,000+',  icon: Play },
    { label: 'Subjects Covered',value: '120+',    icon: BookOpen },
  ];

  const features = [
    { icon: Sparkles,   title: 'AI-Powered Learning', desc: 'Smart recommendations and auto-grading powered by ML.',       color: 'from-yellow-400 to-orange-500' },
    { icon: Users,      title: 'Community Driven',    desc: 'Connect with peers, mentors and learners across the globe.',  color: 'from-blue-400 to-cyan-500' },
    { icon: Shield,     title: 'Verified Mentors',    desc: 'All mentors are verified experts in their fields.',            color: 'from-green-400 to-teal-500' },
    { icon: TrendingUp, title: 'Track Progress',      desc: 'Detailed analytics and gamified progress tracking.',          color: 'from-purple-400 to-pink-500' },
    { icon: Globe,      title: 'Learn Anywhere',      desc: 'Fully responsive — learn on any device, any time.',           color: 'from-red-400 to-rose-500' },
    { icon: Award,      title: 'Earn Certificates',   desc: 'Get recognised with badges and completion certificates.',     color: 'from-indigo-400 to-violet-500' },
  ];

  return (
    <App3DBackground className="min-h-screen">
      {/* Top Nav (3D glass) */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 md:px-16 py-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-[0_18px_50px_-18px_rgba(59,130,246,0.7)]">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              CommunityLearn
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={onGetStarted}
              className="relative isolate overflow-hidden rounded-2xl px-5 py-2.5 text-sm font-semibold text-white
                         bg-gradient-to-r from-blue-500 to-purple-600
                         shadow-[0_22px_60px_-25px_rgba(147,51,234,0.75)]
                         transition-all hover:-translate-y-0.5 active:translate-y-[1px]"
            >
              <span className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_40%)]" />
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-16 pt-20 pb-16 text-center">
        <div className="relative max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white/90 text-xs font-semibold px-4 py-2 rounded-full border border-white/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            AI-Powered Community Learning Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Learn Together,<br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Grow Together
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with expert mentors, join live sessions, practice with AI-powered quizzes, and build skills that matter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="group relative isolate overflow-hidden rounded-2xl px-8 py-4 text-base font-bold text-white
                         bg-gradient-to-r from-blue-500 to-purple-600
                         shadow-[0_26px_80px_-35px_rgba(59,130,246,0.8)]
                         transition-all hover:-translate-y-1 active:translate-y-[1px]"
            >
              <span className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.35),transparent_45%)]" />
              <span className="inline-flex items-center gap-2">
                Start Learning Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button
              onClick={onGetStarted}
              className="rounded-2xl px-8 py-4 text-base font-semibold text-white
                         bg-white/10 border border-white/20 backdrop-blur
                         shadow-[0_18px_60px_-40px_rgba(0,0,0,0.85)]
                         transition-all hover:-translate-y-1 hover:bg-white/15 active:translate-y-[1px]"
            >
              <span className="inline-flex items-center gap-2">
                <Play className="w-4 h-4 fill-white" />
                Become a Mentor
              </span>
            </button>
          </div>

          {/* 3D hero “floating cards” strip */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {[
              { title: 'Personalized Paths', desc: 'Smarter learning plans with instant feedback.', grad: 'from-cyan-400/20 to-blue-600/5' },
              { title: 'Verified Experts',   desc: 'Learn from mentors with proven experience.',    grad: 'from-purple-500/20 to-pink-500/5' },
              { title: 'Gamified Growth',    desc: 'Badges, streaks and levels to stay motivated.', grad: 'from-emerald-400/20 to-teal-500/5' },
            ].map((c, i) => (
              <Card3D key={i} className={`p-5 bg-gradient-to-br ${c.grad}`}>
                <h3 className="text-white font-bold mb-1">{c.title}</h3>
                <p className="text-white/60 text-sm">{c.desc}</p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-16 py-10">
        <Card3D className="max-w-5xl mx-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_18px_70px_-45px_rgba(59,130,246,0.7)]">
                  <s.icon className="w-6 h-6 text-blue-300" />
                </div>
                <p className="text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-white/60 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Card3D>
      </section>

      {/* Features */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Excel
              </span>
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              A complete ecosystem for modern learners and mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card3D key={i} className="p-6 cursor-default">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.85)]`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-16 pb-24">
        <div className="max-w-5xl mx-auto">
          <Card3D className="p-10 md:p-16 text-center bg-gradient-to-r from-blue-600/60 to-purple-700/60">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Join thousands of students and mentors shaping the future of education.
            </p>

            <button
              onClick={onGetStarted}
              className="relative isolate overflow-hidden rounded-2xl px-10 py-4 text-lg font-extrabold
                         bg-white text-blue-700
                         shadow-[0_30px_90px_-45px_rgba(255,255,255,0.7)]
                         transition-all hover:-translate-y-1 active:translate-y-[1px]"
            >
              <span className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_45%)]" />
              Join CommunityLearn — It&apos;s Free 🚀
            </button>
          </Card3D>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 md:px-16 py-8 text-center">
        <p className="text-white/40 text-sm">© 2026 CommunityLearn. Built with ❤️ for learners everywhere.</p>
      </footer>
    </App3DBackground>
  );
};
// ─── ROLE SELECTION (3D) ─────────────────────────────────────────────────────
const RoleSelection = ({ onSelect, onBack }) => (
  <App3DBackground className="min-h-screen flex flex-col items-center justify-center px-4 relative">
    <button
      onClick={onBack}
      className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors
                 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl px-3 py-2
                 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
    >
      <ArrowLeft className="w-4 h-4" /> Back
    </button>

    <div className="text-center mb-12">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_26px_80px_-40px_rgba(59,130,246,0.75)]">
        <BookOpen className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-4xl font-extrabold text-white mb-3">Join CommunityLearn</h2>
      <p className="text-white/60 text-lg">How would you like to join?</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
      {[
        {
          role: 'student',
          label: "I'm a Student",
          Icon: GraduationCap,
          grad: 'from-blue-400 to-cyan-500',
          glow: 'shadow-[0_30px_90px_-55px_rgba(59,130,246,0.85)]',
          txtColor: 'text-blue-300',
          items: [
            'Book live tutoring sessions',
            'AI-powered study assistant',
            'Practice quizzes & badges',
            'Track your progress',
          ],
        },
        {
          role: 'mentor',
          label: "I'm a Mentor",
          Icon: BookOpen,
          grad: 'from-purple-400 to-pink-500',
          glow: 'shadow-[0_30px_90px_-55px_rgba(168,85,247,0.85)]',
          txtColor: 'text-purple-300',
          items: [
            'Host live tutoring sessions',
            'Upload study resources',
            'Auto-grade student quizzes',
            'Build your reputation',
          ],
        },
      ].map(({ role, label, Icon, grad, glow, txtColor, items }) => (
        <Card3D
          key={role}
          as="button"
          onClick={() => onSelect(role)}
          className={[
            'text-left p-8 w-full',
            'hover:[transform:translateY(-6px)_rotateX(4deg)_rotateY(-4deg)]',
            glow,
          ].join(' ')}
        >
          {/* inner highlight layer */}
          <div className="relative">
            <div className={`w-16 h-16 bg-gradient-to-br ${grad} rounded-2xl flex items-center justify-center mb-5 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.85)]`}>
              <Icon className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{label}</h3>

            <ul className="space-y-2 mb-6 mt-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                  <CheckCircle className={`w-4 h-4 ${txtColor} flex-shrink-0`} />
                  {item}
                </li>
              ))}
            </ul>

            <div className={`flex items-center gap-2 ${txtColor} font-semibold text-sm`}>
              Continue as {role === 'student' ? 'Student' : 'Mentor'}
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Card3D>
      ))}
    </div>
  </App3DBackground>
);

// ─── LOGIN PAGE (3D) ─────────────────────────────────────────────────────────
const LoginPage = ({ role, onLogin, onSignup, onForgot, onBack }) => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errs, setErrs]       = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [gErr, setGErr]       = useState('');
  const isStu  = role === 'student';
  const accent = isStu ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500';
  const aTxt   = isStu ? 'text-blue-300' : 'text-purple-300';

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrs(e); return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault(); setGErr('');
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await API.post('/api/auth/login', { email: form.email, password: form.password });
      if (data.user.role !== role) {
        setGErr(`This account is registered as a "${data.user.role}", not a "${role}".`);
        setLoading(false); return;
      }
      saveToken(data.token); setLoading(false);
      onLogin({ id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role });
    } catch (err) { setGErr(err.response?.data?.error || 'Login failed.'); setLoading(false); }
  };

  return (
    <App3DBackground className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md relative">
        {/* Back */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 text-sm transition-colors
                     bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl px-3 py-2
                     shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
        >
          <ArrowLeft className="w-4 h-4" /> Change role
        </button>

        {/* Card */}
        <Card3D className="p-8">
          <div className="text-center mb-8">
            <div className={`w-14 h-14 bg-gradient-to-br ${accent} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_26px_80px_-45px_rgba(0,0,0,0.9)]`}>
              {isStu ? <GraduationCap className="w-7 h-7 text-white" /> : <BookOpen className="w-7 h-7 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{isStu ? 'Student Login' : 'Mentor Login'}</h2>
            <p className="text-white/55 text-sm">Welcome back! Sign in to continue.</p>
          </div>

          <ErrBox msg={gErr} />

          <form onSubmit={submit} className="space-y-4">
            {/* Optional wrapper to make inputs feel more “3D” without changing FInput logic */}
            <div className="space-y-4">
              <FInput
                icon={Mail}
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                error={errs.email}
              />

              <FInput
                icon={Lock}
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                error={errs.password}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="text-white/40 hover:text-white/80 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <div className="text-right">
              <button type="button" onClick={onForgot} className={`text-xs font-medium ${aTxt} hover:underline`}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`relative isolate overflow-hidden w-full bg-gradient-to-r ${accent} text-white py-3.5 rounded-2xl font-semibold text-sm
                          shadow-[0_28px_90px_-55px_rgba(59,130,246,0.85)]
                          transition-all hover:-translate-y-0.5 active:translate-y-[1px] disabled:opacity-50`}
            >
              <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_50%)]" />
              <span className="relative">{loading ? <Spin /> : 'Sign In'}</span>
            </button>
          </form>

          <p className="text-center text-white/55 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <button onClick={onSignup} className={`font-semibold ${aTxt} hover:underline`}>
              Sign up free
            </button>
          </p>
        </Card3D>
      </div>
    </App3DBackground>
  );
};

// ─── SIGNUP PAGE (3D) ────────────────────────────────────────────────────────
const SignupPage = ({ role, onLogin, onLogin2, onBack }) => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [errs, setErrs]       = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [gErr, setGErr]       = useState('');
  const [ok, setOk]           = useState(false);
  const isStu  = role === 'student';
  const accent = isStu ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500';
  const aTxt   = isStu ? 'text-blue-300' : 'text-purple-300';

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Full name (min 2 chars) required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters required';
    if (!form.confirm) e.confirm = 'Please confirm password';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrs(e); return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault(); setGErr('');
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await API.post('/api/auth/register', { email: form.email, password: form.password, name: form.name, role });
      saveToken(data.token); setLoading(false); setOk(true);
      setTimeout(() => onLogin({ id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role }), 1500);
    } catch (err) { setGErr(err.response?.data?.error || 'Registration failed.'); setLoading(false); }
  };

  if (ok) return (
    <App3DBackground className="min-h-screen flex items-center justify-center px-4">
      <Card3D className="w-full max-w-md p-10 text-center">
        <div className={`w-20 h-20 bg-gradient-to-br ${accent} rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.9)]`}>
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Account Created! 🎉</h2>
        <p className="text-white/60">Redirecting to your dashboard...</p>
      </Card3D>
    </App3DBackground>
  );

  return (
    <App3DBackground className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 text-sm transition-colors
                     bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl px-3 py-2
                     shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
        >
          <ArrowLeft className="w-4 h-4" /> Change role
        </button>

        <Card3D className="p-8">
          <div className="text-center mb-8">
            <div className={`w-14 h-14 bg-gradient-to-br ${accent} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_26px_80px_-45px_rgba(0,0,0,0.9)]`}>
              {isStu ? <GraduationCap className="w-7 h-7 text-white" /> : <BookOpen className="w-7 h-7 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Create {isStu ? 'Student' : 'Mentor'} Account</h2>
            <p className="text-white/55 text-sm">Join the community — it&apos;s free!</p>
          </div>

          <ErrBox msg={gErr} />

          <form onSubmit={submit} className="space-y-4">
            <FInput
              icon={User}
              placeholder="Full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              error={errs.name}
            />

            <FInput
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              error={errs.email}
            />

            <FInput
              icon={Lock}
              type={showPw ? 'text' : 'password'}
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              error={errs.password}
              right={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <FInput
              icon={Lock}
              type={showCf ? 'text' : 'password'}
              placeholder="Confirm password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              error={errs.confirm}
              right={
                <button
                  type="button"
                  onClick={() => setShowCf(!showCf)}
                  className="text-white/40 hover:text-white/80 transition-colors"
                >
                  {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <button
              type="submit"
              disabled={loading}
              className={`relative isolate overflow-hidden w-full bg-gradient-to-r ${accent} text-white py-3.5 rounded-2xl font-semibold text-sm
                          shadow-[0_28px_90px_-55px_rgba(59,130,246,0.85)]
                          transition-all hover:-translate-y-0.5 active:translate-y-[1px] disabled:opacity-50`}
            >
              <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_50%)]" />
              <span className="relative">
                {loading ? <Spin /> : `Create ${isStu ? 'Student' : 'Mentor'} Account`}
              </span>
            </button>
          </form>

          <p className="text-center text-white/55 text-sm mt-6">
            Already have an account?{' '}
            <button onClick={onLogin2} className={`font-semibold ${aTxt} hover:underline`}>
              Sign in
            </button>
          </p>
        </Card3D>
      </div>
    </App3DBackground>
  );
};

// ─── FORGOT PASSWORD (3D) ────────────────────────────────────────────────────
const ForgotPasswordPage = ({ onBack }) => {
  const [step, setStep]       = useState(1);
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [genOtp, setGenOtp]   = useState('');
  const [np, setNp]           = useState('');
  const [cp, setCp]           = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [errs, setErrs]       = useState({});
  const [loading, setLoading] = useState(false);
  const [gErr, setGErr]       = useState('');

  const s1 = ev => {
    ev.preventDefault(); setGErr('');
    if (!email.trim()) { setErrs({ email: 'Email required' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrs({ email: 'Enter a valid email' }); return; }
    setLoading(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGenOtp(code); setLoading(false); setErrs({}); setStep(2);
      alert('[DEMO] Your OTP is: ' + code);
    }, 900);
  };

  const s2 = ev => {
    ev.preventDefault(); setGErr('');
    if (!otp.trim()) { setErrs({ otp: 'Please enter the OTP' }); return; }
    if (otp.trim() !== genOtp) { setErrs({ otp: 'Incorrect OTP.' }); return; }
    setErrs({}); setStep(3);
  };

  const s3 = async (ev) => {
    ev.preventDefault(); setGErr('');
    const e = {};
    if (!np || np.length < 6) e.np = 'Min 6 characters required';
    if (!cp) e.cp = 'Please confirm password';
    else if (cp !== np) e.cp = 'Passwords do not match';
    if (Object.keys(e).length) { setErrs(e); return; }
    setLoading(true);
    try {
      await API.post('/api/auth/reset-password', { email, newPassword: np });
      setLoading(false); setStep(4);
    } catch (err) { setGErr(err.response?.data?.error || 'Failed to reset password.'); setLoading(false); }
  };

  return (
    <App3DBackground className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 text-sm transition-colors
                     bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl px-3 py-2
                     shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to login
        </button>

        <Card3D className="p-8">
          {step === 4 ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.9)]">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Password Reset ✅</h2>
              <p className="text-white/60 text-sm mb-6">Your password has been updated.</p>

              <button
                onClick={onBack}
                className="relative isolate overflow-hidden bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-2xl font-semibold text-sm
                           shadow-[0_28px_90px_-55px_rgba(34,197,94,0.65)]
                           transition-all hover:-translate-y-0.5 active:translate-y-[1px]"
              >
                <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                <span className="relative">Back to Login</span>
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_26px_80px_-45px_rgba(0,0,0,0.9)]">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Reset Password</h2>
                <p className="text-white/55 text-sm">
                  {step === 1 && 'Enter your email to receive a reset OTP'}
                  {step === 2 && 'Enter the OTP sent to your email'}
                  {step === 3 && 'Choose a new password'}
                </p>
              </div>

              {/* Stepper (3D-ish pills) */}
              <div className="flex items-center justify-center gap-2 mb-7">
                {[1, 2, 3].map(s => (
                  <React.Fragment key={s}>
                    <div
                      className={[
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border',
                        step >= s
                          ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white border-white/10 shadow-[0_18px_60px_-45px_rgba(239,68,68,0.7)]'
                          : 'bg-white/5 text-white/40 border-white/10',
                      ].join(' ')}
                    >
                      {step > s ? '✓' : s}
                    </div>
                    {s < 3 && (
                      <div className={`flex-1 max-w-[40px] h-0.5 rounded-full ${step > s ? 'bg-orange-400' : 'bg-white/10'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <ErrBox msg={gErr} />

              {step === 1 && (
                <form onSubmit={s1} className="space-y-4">
                  <FInput
                    icon={Mail}
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    error={errs.email}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative isolate overflow-hidden w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-2xl font-semibold text-sm
                               shadow-[0_28px_90px_-55px_rgba(249,115,22,0.7)]
                               transition-all hover:-translate-y-0.5 active:translate-y-[1px] disabled:opacity-50"
                  >
                    <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                    <span className="relative">{loading ? <Spin /> : 'Send OTP'}</span>
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={s2} className="space-y-4">
                  <FInput
                    icon={Shield}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    error={errs.otp}
                  />

                  <p className="text-white/40 text-xs text-center">Check the demo alert popup for your OTP</p>

                  <button
                    type="submit"
                    className="relative isolate overflow-hidden w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-2xl font-semibold text-sm
                               shadow-[0_28px_90px_-55px_rgba(239,68,68,0.7)]
                               transition-all hover:-translate-y-0.5 active:translate-y-[1px]"
                  >
                    <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                    <span className="relative">Verify OTP</span>
                  </button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={s3} className="space-y-4">
                  <FInput
                    icon={Lock}
                    type={showPw ? 'text' : 'password'}
                    placeholder="New password"
                    value={np}
                    onChange={e => setNp(e.target.value)}
                    error={errs.np}
                    right={
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="text-white/40 hover:text-white/80 transition-colors"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  <FInput
                    icon={Lock}
                    type="password"
                    placeholder="Confirm new password"
                    value={cp}
                    onChange={e => setCp(e.target.value)}
                    error={errs.cp}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative isolate overflow-hidden w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-2xl font-semibold text-sm
                               shadow-[0_28px_90px_-55px_rgba(249,115,22,0.7)]
                               transition-all hover:-translate-y-0.5 active:translate-y-[1px] disabled:opacity-50"
                  >
                    <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                    <span className="relative">{loading ? <Spin /> : 'Reset Password'}</span>
                  </button>
                </form>
              )}
            </>
          )}
        </Card3D>
      </div>
    </App3DBackground>
  );
};

// ─── AUTH FLOW (3D wrapper) ───────────────────────────────────────────────────
const AuthFlow = ({ onLogin }) => {
  const [screen, setScreen]             = useState('landing');
  const [selectedRole, setSelectedRole] = useState(null);

  const go = (s) => setScreen(s);
  const pickRole = (r) => { setSelectedRole(r); go('login'); };

  return (
    // Keep your original gradient theme, but add 3D background on top
    <App3DBackground className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
      {screen === 'landing' && <LandingPage onGetStarted={() => go('role')} />}
      {screen === 'role'    && <RoleSelection onSelect={pickRole} onBack={() => go('landing')} />}
      {screen === 'login'   && (
        <LoginPage
          role={selectedRole}
          onLogin={onLogin}
          onSignup={() => go('signup')}
          onForgot={() => go('forgot')}
          onBack={() => go('role')}
        />
      )}
      {screen === 'signup'  && (
        <SignupPage
          role={selectedRole}
          onLogin={onLogin}
          onLogin2={() => go('login')}
          onBack={() => go('role')}
        />
      )}
      {screen === 'forgot'  && <ForgotPasswordPage onBack={() => go('login')} />}
    </App3DBackground>
  );
};

// ─── DASHBOARD (3D) ──────────────────────────────────────────────────────────
const Dashboard = ({ userProgress, currentUser }) => {
  const [showAllBadges, setShowAllBadges] = useState(false);

  const earnedBadges  = ALL_BADGES.filter(b => isBadgeEarned(b, userProgress));
  const displayBadges = showAllBadges ? ALL_BADGES : ALL_BADGES.slice(0, 12);

  const pts        = userProgress.points  || 0;
  const lvl        = userProgress.level   || 1;
  const ptsInLevel = pts % 200;
  const ptsToNext  = 200 - ptsInLevel;
  const progress   = (ptsInLevel / 200) * 100;

  return (
    // ✅ NO App3DBackground here — the parent already provides it
    <div className="w-full space-y-5 relative z-10 overflow-visible">

      {/* ══════════ STAT CARDS ══════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-visible">
        {[
          { label: 'Level',   value: lvl,                    icon: Trophy, iconBg: 'bg-blue-500/20',    iconColor: 'text-blue-300',    glow: '0 20px 60px -20px rgba(59,130,246,0.6)'   },
          { label: 'Points',  value: pts,                    icon: Zap,    iconBg: 'bg-purple-500/20',  iconColor: 'text-purple-300',  glow: '0 20px 60px -20px rgba(168,85,247,0.6)'  },
          { label: 'Quizzes', value: userProgress.quizzes || 0, icon: Target, iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-300', glow: '0 20px 60px -20px rgba(16,185,129,0.55)' },
          { label: 'Badges',  value: earnedBadges.length,   icon: Award,  iconBg: 'bg-amber-500/20',   iconColor: 'text-amber-300',   glow: '0 20px 60px -20px rgba(245,158,11,0.5)'  },
        ].map((c, i) => (
          <Card3D
            key={i}
            className="p-4 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-1"
            style={{ boxShadow: c.glow }}
          >
            <div className={`w-11 h-11 flex-shrink-0 ${c.iconBg} rounded-xl flex items-center justify-center border border-white/10`}>
              <c.icon className={`w-5 h-5 ${c.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-xs font-medium truncate">{c.label}</p>
              <p className="text-2xl font-bold text-white leading-tight">{c.value}</p>
            </div>
          </Card3D>
        ))}
      </div>

      {/* ══════════ LEVEL PROGRESS ══════════ */}
      <Card3D className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">Level Progress</h2>
          <span className="text-blue-300 text-sm font-bold">Level {lvl}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-400 text-xs mt-2">{ptsToNext} points to next level</p>
      </Card3D>

      {/* ══════════ LEARNING PROGRESS + QUICK STATS ══════════ */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-visible">

        {/* Learning Progress */}
        <Card3D className="p-5 flex flex-col">
          <h2 className="text-base font-semibold text-white mb-5">Learning Progress</h2>
          <div className="flex flex-col gap-4 flex-1">
            {[
              { s: 'Mathematics', p: Math.min(100, pts / 20),                          c: 'from-blue-500 to-cyan-400',    tc: 'text-blue-300'    },
              { s: 'Programming', p: Math.min(100, (userProgress.quizzes || 0) * 10),  c: 'from-purple-500 to-pink-400',  tc: 'text-purple-300'  },
              { s: 'Overall',     p: Math.min(100, (lvl - 1) * 5 + 5),                 c: 'from-emerald-500 to-green-400',tc: 'text-emerald-300' },
            ].map((x, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-white">{x.s}</span>
                  <span className={`text-sm font-bold ${x.tc}`}>{Math.round(x.p)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${x.c} transition-all duration-700`}
                    style={{ width: `${x.p}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card3D>

        {/* Quick Stats */}
        <Card3D className="p-5 flex flex-col">
          <h2 className="text-base font-semibold text-white mb-5">Quick Stats</h2>
          <div className="flex flex-col gap-3 flex-1">
            {[
              { label: 'Sessions Booked', value: userProgress.sessions      || 0,       icon: Calendar, color: 'text-blue-300'   },
              { label: 'Perfect Scores',  value: userProgress.perfectScores || 0,       icon: Star,     color: 'text-yellow-300' },
              { label: 'Current Streak',  value: `${userProgress.streak     || 0} days`,icon: Zap,      color: 'text-orange-300' },
              { label: 'Badges Earned',   value: earnedBadges.length,                   icon: Award,    color: 'text-purple-300' },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <s.icon className={`w-4 h-4 flex-shrink-0 ${s.color}`} />
                  <span className="text-gray-300 text-sm truncate">{s.label}</span>
                </div>
                <span className="text-white font-bold text-sm pl-2">{s.value}</span>
              </div>
            ))}
          </div>
        </Card3D>
      </div>

      {/* ══════════ BADGES ══════════ */}
       <Card3D className="p-5 overflow-visible">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">Badges &amp; Achievements</h2>
            <p className="text-gray-400 text-xs mt-0.5">{earnedBadges.length} / {ALL_BADGES.length} unlocked</p>
          </div>
          <button
            onClick={() => setShowAllBadges(!showAllBadges)}
            className="text-blue-300 text-xs font-medium bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 hover:bg-white/10 transition-colors"
          >
            {showAllBadges ? 'Show Less' : 'View All'}
          </button>
        </div>

        {/* ✅ Responsive badge grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 overflow-visible">
          {displayBadges.map((b) => {
            const earned = isBadgeEarned(b, userProgress);
            return (
              <div key={b.id} className="relative flex flex-col items-center gap-1.5 group">
                <div
                  className={[
                    'w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-200',
                    earned
                      ? 'bg-gradient-to-br from-yellow-400/30 to-orange-500/30 border-2 border-yellow-400/50 group-hover:scale-110'
                      : 'bg-white/5 border-2 border-white/10 grayscale opacity-40',
                  ].join(' ')}
                >
                  {b.icon}
                </div>
                <p className={`text-[9px] font-medium text-center leading-tight ${earned ? 'text-gray-300' : 'text-gray-600'}`}>
                  {b.name}
                </p>
                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  {b.desc}
                  {!earned && <span className="block text-red-400 text-[10px] mt-0.5">🔒 Locked</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Card3D>

    </div>
  );
};

// ─── SESSIONS PAGE (3D) ──────────────────────────────────────────────────────
const SessionsPage = ({ currentUser, onBookingComplete }) => {
  const [search,    setSearch]    = useState('');
  const [filterSub, setFilterSub] = useState('All');
  const [selected,  setSelected]  = useState(null);
  const [booking,   setBooking]   = useState(null);
  const [payDone,   setPayDone]   = useState(false);
  const [selSlot,   setSelSlot]   = useState('');
  const [cardForm,  setCardForm]  = useState({ name: '', number: '', expiry: '', cvv: '' });

  const subjects = ['All', ...Array.from(new Set(TUTORS.map(t => t.subject)))];
  const filtered  = TUTORS.filter(t =>
    (filterSub === 'All' || t.subject === filterSub) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) ||
     t.subject.toLowerCase().includes(search.toLowerCase()) ||
     t.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  const badgeColor = (b) => {
    if (b === 'Top Rated') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    if (b === 'Popular')   return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    if (b === 'Rising')    return 'bg-green-500/20 text-green-300 border-green-500/40';
    if (b === 'New')       return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    return '';
  };

  const handlePayment = () => {
    if (!selSlot) { alert('Please select a time slot'); return; }
    if (!cardForm.name || !cardForm.number || !cardForm.expiry || !cardForm.cvv) {
      alert('Please fill in all payment details'); return;
    }
    if (cardForm.number.length < 16) { alert('Enter a valid 16-digit card number'); return; }
    setPayDone(true);
    if (onBookingComplete) onBookingComplete();
  };

  // Booking Modal
  if (booking && !payDone) return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card3D className="w-full max-w-md p-8 overflow-y-auto max-h-[90vh] bg-gray-900/70">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Book Session</h2>
          <button
            onClick={() => { setBooking(null); setSelSlot(''); setPayDone(false); setCardForm({ name:'',number:'',expiry:'',cvv:'' }); }}
            className="p-2 text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all
                       shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.9)]">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${booking.color} flex items-center justify-center text-white font-bold text-lg shadow-lg border border-white/10`}>
            {booking.img}
          </div>
          <div>
            <p className="text-white font-semibold">{booking.name}</p>
            <p className="text-gray-400 text-sm">{booking.specialty}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold text-white">₹{booking.price * 80}</p>
            <p className="text-gray-400 text-xs">per session</p>
          </div>
        </div>

        <p className="text-white font-semibold mb-3">Select a Time Slot</p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {booking.sessions.map(s => (
            <button
              key={s}
              onClick={() => setSelSlot(s)}
              className={`py-2 px-3 rounded-2xl text-sm font-medium border transition-all
                shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]
                hover:-translate-y-0.5 active:translate-y-[1px]
                ${selSlot === s
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-white/10 text-white'
                  : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Payment */}
        <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center border border-white/10">
              <CreditCard className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Secure Payment</p>
              <p className="text-gray-400 text-xs">Cards, UPI, Net Banking accepted</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <input
            placeholder="Cardholder Name"
            value={cardForm.name}
            onChange={e => setCardForm({ ...cardForm, name: e.target.value })}
            className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none
                       focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/30
                       shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          />
          <input
            placeholder="Card Number (16 digits)"
            value={cardForm.number}
            onChange={e => setCardForm({ ...cardForm, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
            className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none
                       focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/30
                       shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="MM/YY"
              value={cardForm.expiry}
              onChange={e => setCardForm({ ...cardForm, expiry: e.target.value.slice(0, 5) })}
              className="bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none
                         focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/30
                         shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            />
            <input
              placeholder="CVV"
              type="password"
              value={cardForm.cvv}
              onChange={e => setCardForm({ ...cardForm, cvv: e.target.value.slice(0, 3) })}
              className="bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none
                         focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/30
                         shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/5 rounded-2xl p-3 mb-4 border border-white/10 shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]">
          <span className="text-gray-400 text-sm">Total (INR)</span>
          <span className="text-white font-bold text-lg">₹{booking.price * 80}</span>
        </div>

        <button
          onClick={handlePayment}
          disabled={!selSlot}
          className="relative isolate overflow-hidden w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-2xl font-bold
                     shadow-[0_30px_90px_-55px_rgba(59,130,246,0.85)]
                     transition-all hover:-translate-y-0.5 active:translate-y-[1px]
                     disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
        >
          <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
          <span className="relative flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Pay ₹{booking.price * 80} & Confirm Booking
          </span>
        </button>

        <p className="text-center text-gray-500 text-xs mt-3 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" /> Secured by 256-bit SSL encryption
        </p>
      </Card3D>
    </div>
  );

  // Success Modal
  if (payDone) return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card3D className="w-full max-w-md p-10 text-center bg-gray-900/70">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.9)]">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed! 🎉</h2>
        <p className="text-gray-400 text-sm mb-1">
          Session with <span className="text-white font-semibold">{booking?.name}</span>
        </p>
        <p className="text-blue-300 text-sm font-semibold mb-6">{selSlot}</p>
        <p className="text-gray-500 text-xs mb-6">
          A confirmation has been sent to your email. You&apos;ll receive a meeting link 30 minutes before the session.
        </p>
        <button
          onClick={() => { setBooking(null); setPayDone(false); setSelSlot(''); setCardForm({ name: '', number: '', expiry: '', cvv: '' }); }}
          className="relative isolate overflow-hidden w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-2xl font-semibold
                     shadow-[0_30px_90px_-55px_rgba(34,197,94,0.7)]
                     transition-all hover:-translate-y-0.5 active:translate-y-[1px]"
        >
          <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
          <span className="relative">Back to Tutors</span>
        </button>
      </Card3D>
    </div>
  );

  // Tutor Detail
  if (selected) return (
    <App3DBackground>
  <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6">
   <button
        onClick={() => setSelected(null)}
        className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors
                   bg-white/5 border border-white/10 rounded-xl px-3 py-2
                   shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all tutors
        </button>

        <Card3D className="p-8 bg-gray-900/70">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-white font-bold text-3xl shadow-xl border border-white/10`}>
              {selected.img}
            </div>
            {selected.badge && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor(selected.badge)}`}>
                {selected.badge}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{selected.name}</h2>
            <p className="text-blue-300 font-semibold mb-1">{selected.subject} — {selected.specialty}</p>
            <p className="text-gray-400 text-sm mb-4">{selected.bio}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Experience', value: `${selected.exp} yrs` },
                { label: 'Rating',     value: `⭐ ${selected.rating}` },
                { label: 'Reviews',    value: `${selected.reviews}+` },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-3 text-center border border-white/10 shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]">
                  <p className="text-white font-bold text-lg">{s.value}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="text-white font-semibold mb-3">Available Slots</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {selected.sessions.map(s => (
                <span key={s} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-xl text-sm">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-extrabold text-white">₹{selected.price * 80}</span>
                <span className="text-gray-400 text-sm ml-1">/ session</span>
              </div>
              <button
                onClick={() => setBooking(selected)}
                className="relative isolate overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold
                           shadow-[0_30px_90px_-55px_rgba(59,130,246,0.85)]
                           transition-all hover:-translate-y-0.5 active:translate-y-[1px]"
              >
                <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                <span className="relative">Book Session</span>
              </button>
            </div>
          </div>
        </div>
      </Card3D>
  </div>
</App3DBackground>
  );

  // Main List
  return (
    <App3DBackground className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Find Your Tutor</h2>
          <p className="text-gray-400 text-sm mt-1">{TUTORS.length} expert tutors across {subjects.length - 1} subjects</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tutors, subjects..."
            className="pl-9 pr-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-500 rounded-2xl text-sm outline-none
                       focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/60 w-64
                       shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {subjects.map(s => (
          <button
            key={s}
            onClick={() => setFilterSub(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all
                        shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]
                        hover:-translate-y-0.5 active:translate-y-[1px]
                        ${filterSub === s
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-white/10 text-white'
                          : 'bg-white/5 border-white/15 text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(t => (
          <Card3D
            key={t.id}
            className="p-6 bg-gray-900/70 group flex flex-col hover:[transform:translateY(-6px)_rotateX(3deg)_rotateY(-3deg)]"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0 border border-white/10`}>
                {t.img}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
                    {t.name}
                  </h3>
                  {t.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${badgeColor(t.badge)}`}>
                      {t.badge}
                    </span>
                  )}
                </div>
                <p className="text-blue-300 text-xs font-semibold mt-0.5">{t.subject}</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">{t.specialty}</p>
              </div>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">{t.bio}</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white/5 rounded-2xl p-2 text-center border border-white/10 shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]">
                <p className="text-white text-sm font-bold">{t.exp}y</p>
                <p className="text-gray-500 text-[10px]">Exp</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-2 text-center border border-white/10 shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]">
                <p className="text-yellow-300 text-sm font-bold">⭐{t.rating}</p>
                <p className="text-gray-500 text-[10px]">Rating</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-2 text-center border border-white/10 shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]">
                <p className="text-white text-sm font-bold">{t.reviews}</p>
                <p className="text-gray-500 text-[10px]">Reviews</p>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between">
              <div>
                <span className="text-xl font-extrabold text-white">₹{t.price * 80}</span>
                <span className="text-gray-400 text-xs ml-1">/session</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelected(t)}
                  className="px-3 py-2 bg-white/5 border border-white/15 text-gray-200 rounded-2xl text-xs font-medium hover:bg-white/10 transition-all
                             shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
                >
                  Profile
                </button>
                <button
                  onClick={() => setBooking(t)}
                  className="relative isolate overflow-hidden px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl text-xs font-bold
                             shadow-[0_28px_90px_-60px_rgba(59,130,246,0.85)]
                             transition-all hover:-translate-y-0.5 active:translate-y-[1px]"
                >
                  <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                  <span className="relative">Book</span>
                </button>
              </div>
            </div>
          </Card3D>
        ))}
      </div>
    </App3DBackground>
  );
};

// ─── RESOURCES PAGE (3D) ─────────────────────────────────────────────────────
const ResourcesPage = () => {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [choiceModal, setChoiceModal] = useState(null);
  const [search,       setSearch]       = useState('');
  const [filterSub,    setFilterSub]    = useState('All');
  const [filterType,   setFilterType]   = useState('All');
  const [selected,     setSelected]     = useState(null);

  const subjects = ['All', ...Array.from(new Set(RESOURCES.map(r => r.subject)))];
  const types    = ['All', 'PDF', 'Video', 'Interactive'];

  const filtered = RESOURCES.filter(r =>
    (filterSub  === 'All' || r.subject === filterSub) &&
    (filterType === 'All' || r.type    === filterType) &&
    (r.title.toLowerCase().includes(search.toLowerCase()) ||
     r.subject.toLowerCase().includes(search.toLowerCase()) ||
     r.author.toLowerCase().includes(search.toLowerCase()))
  );

  const typeIcon  = (t) =>
    t === 'PDF' ? <FileText className="w-4 h-4" /> :
    t === 'Video' ? <Video className="w-4 h-4" /> :
    <Cpu className="w-4 h-4" />;

  const typeColor = (t) =>
    t === 'PDF'
      ? 'bg-red-500/20 text-red-300 border-red-500/40'
      : t === 'Video'
        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  const handleView = (r) => {
    if (r.premium) { setSelected(r); return; }
    setChoiceModal(r);
  };

  return (
    <App3DBackground className="space-y-6">
      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card3D className="w-full max-w-4xl overflow-hidden bg-gray-900/70">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h3 className="text-white font-bold text-lg">{playingVideo.title}</h3>
                <p className="text-gray-400 text-sm">{playingVideo.author}</p>
              </div>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-2 text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all
                           shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={playingVideo.url}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={playingVideo.title}
              />
            </div>

            <div className="px-6 py-4 bg-gray-900/60 border-t border-white/10">
              <p className="text-gray-300 text-sm">{playingVideo.desc}</p>
            </div>
          </Card3D>
        </div>
      )}

      {/* Resource Choice Modal */}
      {choiceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card3D className="w-full max-w-sm p-8 bg-gray-900/70">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 pr-3">
                <h2 className="text-lg font-bold text-white leading-tight">{choiceModal.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{choiceModal.author}</p>
              </div>
              <button
                onClick={() => setChoiceModal(null)}
                className="p-1.5 text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all flex-shrink-0
                           shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-gray-400 text-xs mb-6 leading-relaxed">{choiceModal.desc}</p>

            <p className="text-white text-sm font-semibold mb-4 text-center">
              How would you like to access this?
            </p>

            <div className="space-y-3">
              {/* Watch Video Option */}
              <Card3D
                as="button"
                onClick={() => {
                  const url = VIDEO_MAP[choiceModal.title];
                  if (url) setPlayingVideo({ ...choiceModal, url });
                  else window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(choiceModal.title + ' full tutorial')}`, '_blank');
                  setChoiceModal(null);
                }}
                className="w-full p-4 flex items-center gap-4 text-left bg-purple-500/10 border border-purple-500/30 hover:border-purple-400/60 hover:bg-purple-500/15"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 border border-white/10">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">Watch Video</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {VIDEO_MAP[choiceModal.title] ? 'Embedded YouTube video' : 'Search YouTube for this topic'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
              </Card3D>

              {/* Get PDF Option */}
              <Card3D
                as="button"
                onClick={() => {
                  window.open(
                    `https://www.google.com/search?q=${encodeURIComponent(choiceModal.title + ' free PDF download filetype:pdf OR site:scribd.com OR site:academia.edu')}`,
                    '_blank'
                  );
                  setChoiceModal(null);
                }}
                className="w-full p-4 flex items-center gap-4 text-left bg-red-500/10 border border-red-500/30 hover:border-red-400/60 hover:bg-red-500/15"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 border border-white/10">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">Get PDF</p>
                  <p className="text-gray-400 text-xs mt-0.5">Search for free PDF on Google</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
              </Card3D>

              {/* Find on Internet Option */}
              <Card3D
                as="button"
                onClick={() => {
                  window.open(
                    `https://www.google.com/search?q=${encodeURIComponent(choiceModal.title + ' free course tutorial online')}`,
                    '_blank'
                  );
                  setChoiceModal(null);
                }}
                className="w-full p-4 flex items-center gap-4 text-left bg-blue-500/10 border border-blue-500/30 hover:border-blue-400/60 hover:bg-blue-500/15"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 border border-white/10">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">Find Online</p>
                  <p className="text-gray-400 text-xs mt-0.5">Search free courses on the internet</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
              </Card3D>
            </div>

            <button
              onClick={() => setChoiceModal(null)}
              className="w-full mt-4 py-2 text-gray-500 hover:text-white text-xs transition-colors"
            >
              Cancel
            </button>
          </Card3D>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card3D className="w-full max-w-md p-8 bg-gray-900/70 border border-yellow-500/30">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_30px_90px_-55px_rgba(245,158,11,0.7)] border border-white/10">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">Premium Content 👑</h2>
            <p className="text-gray-400 text-sm text-center mb-1">"{selected.title}"</p>
            <p className="text-gray-400 text-sm text-center mb-6">
              Upgrade to Premium to unlock this and 100+ more resources.
            </p>

            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.9)]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-bold">Premium Plan</span>
                <span className="text-2xl font-extrabold text-yellow-300">
                  $9.99<span className="text-sm text-gray-400">/mo</span>
                </span>
              </div>
              {['All premium PDFs & videos', 'Unlimited resource downloads', 'Ad-free experience', 'Priority support'].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300 text-sm mb-1.5">
                  <Check className="w-4 h-4 text-green-400" />{f}
                </div>
              ))}
            </div>

            <button
              onClick={() => alert('Connect Razorpay/Stripe for production payment!')}
              className="relative isolate overflow-hidden w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3.5 rounded-2xl font-bold
                         shadow-[0_30px_90px_-55px_rgba(245,158,11,0.8)]
                         transition-all hover:-translate-y-0.5 active:translate-y-[1px] mb-3"
            >
              <span className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.45),transparent_55%)]" />
              <span className="relative">Upgrade to Premium — ₹799/mo</span>
            </button>

            <button
              onClick={() => setSelected(null)}
              className="w-full py-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Maybe later
            </button>
          </Card3D>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Learning Resources</h2>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} resources across {subjects.length - 1} subjects</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="pl-9 pr-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-500 rounded-2xl text-sm outline-none
                       focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/60 w-64
                       shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                        shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]
                        hover:-translate-y-0.5 active:translate-y-[1px]
                        ${filterType === t
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-white/10 text-white'
                          : 'bg-white/5 border-white/15 text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {subjects.map(s => (
          <button
            key={s}
            onClick={() => setFilterSub(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-all
                        shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]
                        hover:-translate-y-0.5 active:translate-y-[1px]
                        ${filterSub === s
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-white/10 text-white'
                          : 'bg-white/5 border-white/15 text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(r => (
          <Card3D
            key={r.id}
            className="p-6 group flex flex-col bg-gray-900/70 hover:[transform:translateY(-6px)_rotateX(3deg)_rotateY(-3deg)]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  {r.premium && <Crown className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" />}
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
                    {r.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-xs">{r.author}</p>
              </div>

              <span className={`px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 border flex items-center gap-1 ${typeColor(r.type)}`}>
                {typeIcon(r.type)}{r.type}
              </span>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed mb-3 flex-1">{r.desc}</p>

            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="bg-white/5 px-2 py-0.5 rounded-full border border-white/10">{r.subject}</span>
              <span>{r.pages ? `${r.pages} pages` : r.duration ? r.duration : `${r.lessons} lessons`}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-yellow-300 font-medium">{r.rating}</span>
              </div>
              <span className="text-xs text-gray-400">{r.downloads.toLocaleString()} downloads</span>
            </div>

            <button
              onClick={() => handleView(r)}
              className={`relative isolate overflow-hidden w-full py-2 rounded-2xl font-semibold text-sm transition-all
                          hover:-translate-y-0.5 active:translate-y-[1px]
                          shadow-[0_28px_90px_-60px_rgba(0,0,0,0.85)]
                          flex items-center justify-center gap-2 ${
                r.premium
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              }`}
            >
              <span className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
              <span className="relative">
                {r.premium ? <><Crown className="w-4 h-4 inline-block mr-2" />Premium</> : <><ExternalLink className="w-4 h-4 inline-block mr-2" />View Free</>}
              </span>
            </button>
          </Card3D>
        ))}
      </div>
    </App3DBackground>
  );
};
// ─── CHAT PAGE (3D) ──────────────────────────────────────────────────────────
const ChatPage = ({ currentUser }) => {
  const [input, setInput]   = useState('');
  const [msgs, setMsgs]     = useState([
    { type: 'bot', text: "Hello! 👋 I'm your AI learning assistant powered by Google Gemini. Ask me ANYTHING about your studies — Mathematics, Programming, Physics, Chemistry, Biology, History, Economics, Data Science, Music, Psychology and more!\n\nI give real, detailed answers to any question you ask! 🚀" }
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef           = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  // ── Smart local fallback ──
  const getLocalFallback = (message) => {
    const t = message.toLowerCase();
    if (t.includes('2+2') || t.includes('2 + 2'))         return '2 + 2 = **4** 😊\n\nThis is basic arithmetic!\n\n💡 Need help with more math? Ask me anything!';
    if (t.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(message.replace(/[^0-9+\-*/().]/g, ''));
        return `🔢 **Answer: ${result}**\n\nThis is a basic arithmetic calculation.\n\n💡 For complex math, ask me step-by-step!`;
      } catch { /* fall through */ }
    }
    if (t.includes('hello') || t.includes('hi'))           return '👋 Hello! I\'m your AI Tutor. Ask me any academic question — Math, Science, Programming, History and more! 🎓';
    if (t.includes('python'))                              return '🐍 **Python Help:**\n\n• Variables: `x = 5`\n• Lists: `my_list = [1, 2, 3]`\n• Functions: `def my_func():`\n• Loops: `for i in range(10):`\n\nWhat specific Python concept do you need help with?';
    if (t.includes('javascript') || t.includes(' js '))     return '💻 **JavaScript Help:**\n\n• Variables: `let x = 5;`\n• Arrays: `const arr = [1,2,3];`\n• Functions: `const fn = () => {}`\n• Async: `await fetch(url)`\n\nWhat JS concept are you working on?';
    if (t.includes('calculus') || t.includes('derivative')) return '📐 **Calculus:**\n\n• Derivative of xⁿ = nxⁿ⁻¹\n• Derivative of sin(x) = cos(x)\n• Derivative of eˣ = eˣ\n• ∫2x dx = x² + C\n\nWhat specific problem are you solving?';
    if (t.includes('physics'))                             return '⚛️ **Physics Help:**\n\n• F = ma (Newton\'s 2nd Law)\n• E = mc²\n• v = u + at\n• KE = ½mv²\n\nWhat physics topic are you studying?';
    if (t.includes('chemistry'))                           return '🧪 **Chemistry Help:**\n\n• Periodic table & atomic structure\n• Organic reactions & mechanisms\n• Balancing equations\n• Mole concept: n = m/M\n\nWhat chemistry topic needs help?';
    if (t.includes('biology'))                             return '🧬 **Biology Help:**\n\n• Cell structure & organelles\n• DNA replication & transcription\n• Photosynthesis: 6CO₂+6H₂O → C₆H₁₂O₆+6O₂\n• Genetics & inheritance\n\nWhat biology topic are you studying?';
    if (t.includes('history'))                             return '📜 **History Help:**\n\n• Ancient civilizations\n• World Wars I & II\n• Indian Independence Movement\n• Modern world history\n\nWhich period or event are you studying?';
    if (t.includes('econom'))                              return '📊 **Economics Help:**\n\n• Supply & Demand\n• GDP = C + I + G + (X-M)\n• Inflation & monetary policy\n• Market structures\n\nWhat concept do you need help with?';
    if (t.includes('algebra'))                             return '➕ **Algebra Help:**\n\n• Solving equations: 2x+4=10 → x=3\n• Quadratic formula: x = (-b±√(b²-4ac))/2a\n• Factoring: x²-5x+6 = (x-2)(x-3)\n\nWhat algebra problem are you working on?';
    if (t.includes('data science') || t.includes('machine learning') || t.includes('ml')) return '🤖 **Data Science & ML:**\n\n• Python libraries: NumPy, Pandas, Sklearn\n• Supervised learning: Linear/Logistic Regression\n• Unsupervised: K-Means, PCA\n• Neural Networks & Deep Learning\n\nWhat ML concept are you studying?';
    return `🤔 I received your question about: "${message}"\n\n⚠️ The AI API is temporarily rate-limited.\nPlease wait **60 seconds** and try again for a full AI answer!\n\nI can help with:\n• 📐 Math & Calculus\n• 💻 Programming (Python, JS, React)\n• ⚛️ Physics & Chemistry\n• 🧬 Biology\n• 📜 History & Economics\n• 🤖 Data Science & ML\n\nAsk again in a moment! 😊`;
  };

  // ── Real AI call using Google Gemini ──
  const getAIReply = async (userMessage) => {
    const GEMINI_API_KEY = 'AIzaSyBD70E4445WQqqQ3sDPWt6Cv1YWAaKZYMk'; // keep as-is (per your request)

    const attempts = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`,
    ];

    for (const url of attempts) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `You are an expert AI tutor on CommunityLearn. Answer this student question clearly with bullet points, examples, and step-by-step explanations where needed.\n\nQuestion: ${userMessage}` }]
            }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
          })
        });

        const data = await response.json();

        if (data?.error?.status === 'RESOURCE_EXHAUSTED') {
          console.warn('Quota exceeded, trying next model...');
          continue;
        }
        if (data?.error) {
          console.warn('API error:', data.error.message);
          continue;
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } catch (err) {
        console.error('Fetch error:', err);
        continue;
      }
    }

    return getLocalFallback(userMessage);
  };

  const send = async () => {
    if (!input.trim() || typing) return;
    const txt = input.trim();
    setMsgs(prev => [...prev, { type: 'user', text: txt }]);
    setInput('');
    setTyping(true);
    const reply = await getAIReply(txt);
    setMsgs(prev => [...prev, { type: 'bot', text: reply }]);
    setTyping(false);
  };

  return (
    <App3DBackground className="h-[calc(100vh-170px)]">
      <Card3D className="p-6 h-full flex flex-col bg-gray-900/70">
        {/* Header */}
        <div className="border-b border-white/10 pb-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_26px_80px_-45px_rgba(99,102,241,0.8)] border border-white/10">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Tutor Assistant</h2>
            <p className="text-xs text-gray-400">Covers 12+ subjects · Available 24/7 · Instant answers</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 text-xs font-medium">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
          {msgs.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-2 max-w-[82%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold border border-white/10 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.9)] ${
                    msg.type === 'user'
                      ? (currentUser?.role === 'mentor'
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                          : 'bg-gradient-to-br from-blue-500 to-cyan-500')
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}
                >
                  {msg.type === 'user' ? (currentUser?.name?.[0]?.toUpperCase() || 'U') : <Brain className="w-4 h-4" />}
                </div>

                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line border shadow-[0_22px_70px_-55px_rgba(0,0,0,0.9)] ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-white/10 rounded-tr-sm'
                      : 'bg-white/5 backdrop-blur text-gray-100 border-white/10 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.9)]">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl flex gap-1 shadow-[0_22px_70px_-55px_rgba(0,0,0,0.9)]">
                  {[0, 0.2, 0.4].map((d, j) => (
                    <div key={j} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: d + 's' }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 pt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask me anything... (press Enter)"
            disabled={typing}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-gray-500 rounded-2xl text-sm outline-none
                       focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/60 disabled:opacity-50 transition-all
                       shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          />
          <button
            onClick={send}
            disabled={typing || !input.trim()}
            className="relative isolate overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold text-sm
                       shadow-[0_30px_90px_-55px_rgba(59,130,246,0.85)]
                       transition-all hover:-translate-y-0.5 active:translate-y-[1px] disabled:opacity-50"
          >
            <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
            <span className="relative">Send</span>
          </button>
        </div>
      </Card3D>
    </App3DBackground>
  );
};
// ─── QUIZZES PAGE (3D) ───────────────────────────────────────────────────────
const QuizzesPage = ({ quizzes, onQuizComplete }) => {
  const [filterSub,   setFilterSub]  = useState('All');
  const [filterDiff,  setFilterDiff] = useState('All');
  const [activeQuiz,  setActiveQuiz] = useState(null);
  const [qIndex,      setQIndex]     = useState(0);
  const [score,       setScore]      = useState(0);
  const [selected,    setSelected]   = useState(null);
  const [finished,    setFinished]   = useState(false);

  const subjects     = ['All', ...Array.from(new Set(quizzes.map(q => q.subject)))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filtered = quizzes.filter(q =>
    (filterSub  === 'All' || q.subject    === filterSub) &&
    (filterDiff === 'All' || q.difficulty === filterDiff)
  );

  const sampleQuestions = activeQuiz
    ? (QUIZ_QUESTIONS[activeQuiz.title] || DEFAULT_QUESTIONS(activeQuiz.title))
    : [];

  const handleAnswer = (idx) => {
    setSelected(idx);
    setTimeout(() => {
      const correct = idx === sampleQuestions[qIndex].ans;
      if (correct) setScore(s => s + 1);
      if (qIndex + 1 < sampleQuestions.length) {
        setQIndex(i => i + 1); setSelected(null);
      } else {
        setFinished(true);
        if (onQuizComplete) {
          const pct = Math.round(((score + (correct ? 1 : 0)) / sampleQuestions.length) * 100);
          onQuizComplete(activeQuiz.points, pct === 100);
        }
      }
    }, 800);
  };

  const resetQuiz = () => { setActiveQuiz(null); setQIndex(0); setScore(0); setSelected(null); setFinished(false); };

  // ── Quiz in progress ──
  if (activeQuiz && !finished) {
    const cq = sampleQuestions[qIndex];
    return (
      <App3DBackground className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={resetQuiz}
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors
                       bg-white/5 border border-white/10 rounded-xl px-3 py-2
                       shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Quiz
          </button>
          <span className="text-gray-400 text-sm">{qIndex + 1} / {sampleQuestions.length}</span>
        </div>

        <Card3D className="rounded-2xl p-3 bg-gray-900/70">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 shadow-[0_10px_40px_-20px_rgba(59,130,246,0.9)]"
              style={{ width: `${(qIndex / sampleQuestions.length) * 100}%` }}
            />
          </div>
        </Card3D>

        <Card3D className="rounded-2xl p-8 bg-gray-900/70">
          <div className="flex items-center gap-2 mb-6">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
              activeQuiz.difficulty === 'Easy'   ? 'bg-green-500/20 text-green-300 border-green-500/40' :
              activeQuiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                                                   'bg-red-500/20 text-red-300 border-red-500/40'
            }`}>
              {activeQuiz.difficulty}
            </span>
            <span className="text-gray-400 text-sm">{activeQuiz.subject}</span>
          </div>

          <h3 className="text-lg font-bold text-white mb-6">{cq.q}</h3>

          <div className="space-y-3">
            {cq.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => selected === null && handleAnswer(i)}
                disabled={selected !== null}
                className={`w-full text-left px-5 py-3.5 rounded-2xl border text-sm font-medium transition-all
                            shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]
                            hover:-translate-y-0.5 active:translate-y-[1px]
                            disabled:hover:translate-y-0 disabled:active:translate-y-0
                            ${
                              selected === null ? 'bg-white/5 border-white/15 text-gray-200 hover:bg-white/10 hover:border-white/30' :
                              i === cq.ans      ? 'bg-green-500/20 border-green-400 text-green-300' :
                              i === selected    ? 'bg-red-500/20 border-red-400 text-red-300' :
                                                  'bg-white/5 border-white/10 text-gray-500'
                            }`}
              >
                <span className="font-bold mr-3 text-gray-400">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
        </Card3D>

        <Card3D className="rounded-2xl p-4 flex justify-between bg-gray-900/70">
          <span className="text-gray-400 text-sm">Current Score</span>
          <span className="text-white font-bold">{score} / {qIndex}</span>
        </Card3D>
      </App3DBackground>
    );
  }

  // ── Quiz finished ──
  if (finished) {
    const pct = Math.round((score / sampleQuestions.length) * 100);
    return (
      <App3DBackground className="max-w-md mx-auto text-center space-y-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.9)] ${
          pct >= 80 ? 'bg-gradient-to-br from-green-400 to-teal-500' :
          pct >= 50 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      'bg-gradient-to-br from-red-400 to-pink-500'
        }`}>
          <Trophy className="w-12 h-12 text-white" />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Quiz Complete! 🎉</h2>
          <p className="text-gray-400">{activeQuiz?.title}</p>
        </div>

        <Card3D className="rounded-2xl p-6 bg-gray-900/70">
          <p className={`text-5xl font-extrabold mb-2 ${
            pct >= 80 ? 'text-green-300' : pct >= 50 ? 'text-yellow-300' : 'text-red-300'
          }`}>
            {pct}%
          </p>
          <p className="text-gray-400 text-sm">{score} correct out of {sampleQuestions.length}</p>
          <p className="text-white font-semibold mt-3">
            {pct >= 80 ? '🌟 Excellent work!' : pct >= 50 ? '👍 Good effort — keep practicing!' : '📚 Keep studying and try again!'}
          </p>
          {pct === 100 && <p className="text-yellow-300 text-sm mt-2">💎 Perfect Score badge unlocked!</p>}
          <p className="text-blue-300 text-sm mt-1">+{activeQuiz?.points} XP earned!</p>
        </Card3D>

        <button
          onClick={resetQuiz}
          className="relative isolate overflow-hidden w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-2xl font-semibold
                     shadow-[0_30px_90px_-55px_rgba(59,130,246,0.85)]
                     transition-all hover:-translate-y-0.5 active:translate-y-[1px]"
        >
          <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
          <span className="relative">Back to Quizzes</span>
        </button>
      </App3DBackground>
    );
  }

  // ── Quiz list ──
  return (
    <App3DBackground className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Practice Quizzes</h2>
        <p className="text-gray-400 text-sm mt-1">{quizzes.length} quizzes across {subjects.length - 1} subjects</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {difficulties.map(d => (
          <button
            key={d}
            onClick={() => setFilterDiff(d)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                        shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]
                        hover:-translate-y-0.5 active:translate-y-[1px]
                        ${filterDiff === d
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-white/10 text-white'
                          : 'bg-white/5 border-white/15 text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
          >
            {d}
          </button>
        ))}

        <div className="w-px bg-white/10 mx-1" />

        {subjects.map(s => (
          <button
            key={s}
            onClick={() => setFilterSub(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                        shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]
                        hover:-translate-y-0.5 active:translate-y-[1px]
                        ${filterSub === s
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-white/10 text-white'
                          : 'bg-white/5 border-white/15 text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(q => (
          <Card3D
            key={q.id}
            className="p-6 bg-gray-900/70 group hover:[transform:translateY(-6px)_rotateX(3deg)_rotateY(-3deg)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  {q.title}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">{q.subject}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Questions</span>
                <span className="font-semibold text-white">{q.questions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time</span>
                <span className="font-semibold text-white">{q.time} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Points</span>
                <span className="font-semibold text-yellow-300">+{q.points} XP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Difficulty</span>
                <span className={`font-bold text-xs px-2 py-0.5 rounded-full border ${
                  q.difficulty === 'Easy'   ? 'bg-green-500/20 text-green-300 border-green-500/40' :
                  q.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                                              'bg-red-500/20 text-red-300 border-red-500/40'
                }`}>
                  {q.difficulty}
                </span>
              </div>
            </div>

            <button
              onClick={() => { setActiveQuiz(q); setQIndex(0); setScore(0); setSelected(null); setFinished(false); }}
              className="relative isolate overflow-hidden w-full py-2.5 rounded-2xl font-semibold text-sm transition-all
                         bg-gradient-to-r from-blue-500 to-purple-600 text-white
                         shadow-[0_30px_90px_-55px_rgba(59,130,246,0.85)]
                         hover:-translate-y-0.5 active:translate-y-[1px]"
            >
              <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
              <span className="relative">Start Quiz →</span>
            </button>
          </Card3D>
        ))}
      </div>
    </App3DBackground>
  );
};

// ─── MAIN APP (3D) ───────────────────────────────────────────────────────────
const CommunityLearn = () => {
  const [currentUser,   setCurrentUser]   = useState(getSession);
  const [activeTab,     setActiveTab]     = useState('dashboard');
  const [userProgress,  setUserProgress]  = useState(() => {
    try {
      const session = getSession();
      if (!session) return { points: 0, level: 1, quizzes: 0, sessions: 0, streak: 0, perfectScores: 0 };
      const saved = localStorage.getItem(`progress_${session.id}`);
      return saved ? JSON.parse(saved) : { points: 0, level: 1, quizzes: 0, sessions: 0, streak: 0, perfectScores: 0 };
    } catch {
      return { points: 0, level: 1, quizzes: 0, sessions: 0, streak: 0, perfectScores: 0 };
    }
  });

  // Persist progress whenever it changes
  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`progress_${currentUser.id}`, JSON.stringify(userProgress));
    }
  }, [userProgress, currentUser]);

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setActiveTab('dashboard');
    setUserProgress({ points: 0, level: 1, quizzes: 0, sessions: 0, streak: 0, perfectScores: 0 });
  };

  const handleLogin = (u) => {
    saveSession(u);
    setCurrentUser(u);
    try {
      const saved = localStorage.getItem(`progress_${u.id}`);
      if (saved) setUserProgress(JSON.parse(saved));
      else setUserProgress({ points: 0, level: 1, quizzes: 0, sessions: 0, streak: 0, perfectScores: 0 });
    } catch {
      setUserProgress({ points: 0, level: 1, quizzes: 0, sessions: 0, streak: 0, perfectScores: 0 });
    }
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

  return (
    <App3DBackground className="min-h-screen bg-gray-950">
      {/* Header (3D glass) */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_26px_80px_-45px_rgba(59,130,246,0.8)]">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">CommunityLearn</h1>
              <p className="text-[10px] text-gray-400 mt-0.5">Smart Learning Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl transition-all
                           shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 cursor-pointer group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm border border-white/10
                            shadow-[0_22px_70px_-55px_rgba(0,0,0,0.9)] ring-2 ${
                  currentUser.role === 'mentor'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 ring-purple-500/40'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500 ring-blue-500/40'
                }`}
              >
                {currentUser.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white leading-none">{currentUser.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">{currentUser.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-300 hover:text-red-300 bg-white/5 border border-white/10 hover:bg-red-500/10 rounded-2xl transition-all
                         shadow-[0_18px_60px_-45px_rgba(0,0,0,0.85)] hover:-translate-y-0.5 active:translate-y-[1px]"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Nav (3D pills) */}
      <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-[58px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 py-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'sessions',  label: 'Sessions',  icon: Users },
              { id: 'resources', label: 'Resources', icon: Book },
              { id: 'chat',      label: 'AI Tutor',  icon: MessageSquare },
              { id: 'quizzes',   label: 'Quizzes',   icon: Target },
            ].map(t => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={[
                    'flex items-center gap-2 px-4 py-2 rounded-2xl whitespace-nowrap text-sm font-medium transition-all',
                    'border shadow-[0_18px_60px_-50px_rgba(0,0,0,0.85)]',
                    'hover:-translate-y-0.5 active:translate-y-[1px]',
                    active
                      ? 'bg-white/10 text-white border-white/20'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white',
                  ].join(' ')}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && <Dashboard userProgress={userProgress} currentUser={currentUser} />}
        {activeTab === 'sessions'  && <SessionsPage currentUser={currentUser} onBookingComplete={handleBookingComplete} />}
        {activeTab === 'resources' && <ResourcesPage />}
        {activeTab === 'chat'      && <ChatPage currentUser={currentUser} />}
        {activeTab === 'quizzes'   && <QuizzesPage quizzes={QUIZZES_DATA} onQuizComplete={handleQuizComplete} />}
      </main>
    </App3DBackground>
  );
};

export default CommunityLearn;