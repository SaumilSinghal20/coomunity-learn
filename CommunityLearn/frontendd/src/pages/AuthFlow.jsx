import { useState } from 'react';
import {
  ArrowLeft, Mail, Lock, User, GraduationCap, BookOpen,
  ChevronRight, Sparkles, Globe, Shield, TrendingUp, Play,
  Users, Award, CheckCircle, Eye, EyeOff
} from 'lucide-react';
import { App3DBackground, Card3D, FInput, Spin, ErrBox } from '../components/UI';
import { saveToken } from '../utils/api';
import { upsertMentorProfile } from '../utils/sharedStore';

const API = 'http://localhost:5000';

// ─── localStorage demo auth (for users registered via localStorage, not DB) ──
const getUsers  = () => { try { return JSON.parse(localStorage.getItem('cl_users')||'[]'); } catch { return []; } };
const saveUsers = (u) => localStorage.setItem('cl_users', JSON.stringify(u));

const demoLogin = (email, password, role) => {
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (!user)             return { error: 'Invalid email or password.' };
  if (user.role !== role) return { error: `This account is a "${user.role}", not a "${role}".` };
  return { user };
};

const demoRegister = (name, email, password, role, subject) => {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { error: 'Email already registered.' };
  const user = { id:`${role}-${Date.now()}`, name, email, password, role, subject:subject||null, createdAt:new Date().toISOString() };
  saveUsers([...users, user]);
  return { user };
};

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const LandingPage = ({ onGetStarted }) => {
  const stats    = [
    { label:'Active Students',  value:'12,000+', icon:Users         },
    { label:'Expert Mentors',   value:'800+',    icon:GraduationCap  },
    { label:'Live Sessions',    value:'5,000+',  icon:Play          },
    { label:'Subjects Covered', value:'120+',    icon:BookOpen      },
  ];
  const features = [
    { icon:Sparkles,   title:'AI-Powered Learning',  desc:'Smart recommendations and auto-grading.',           color:'from-yellow-400 to-orange-500' },
    { icon:Users,      title:'Community Driven',     desc:'Connect with peers and learners worldwide.',         color:'from-blue-400 to-cyan-500'    },
    { icon:Shield,     title:'Verified Mentors',     desc:'All mentors are verified experts.',                 color:'from-green-400 to-teal-500'   },
    { icon:TrendingUp, title:'Track Progress',       desc:'Detailed analytics and gamified tracking.',         color:'from-purple-400 to-pink-500'  },
    { icon:Globe,      title:'Learn Anywhere',       desc:'Fully responsive — any device, any time.',          color:'from-red-400 to-rose-500'     },
    { icon:Award,      title:'Earn Certificates',    desc:'Badges and completion certificates.',               color:'from-indigo-400 to-violet-500'},
  ];

  return (
    <App3DBackground className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 md:px-16 py-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white"/>
            </div>
            <span className="text-xl font-bold text-white">CommunityLearn</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onGetStarted} className="text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">Sign In</button>
            <button onClick={onGetStarted} className="relative isolate overflow-hidden rounded-2xl px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:-translate-y-0.5 transition-all">
              <span className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_40%)]"/>
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      <section className="px-6 md:px-16 pt-20 pb-16 text-center">
        <div className="max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-semibold px-4 py-2 rounded-full border border-white/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400"/> AI-Powered Community Learning Platform
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Learn Together,<br/>
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Grow Together</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">Connect with expert mentors, join live sessions, practice with AI-powered quizzes, and build skills that matter.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onGetStarted} className="group relative isolate overflow-hidden rounded-2xl px-8 py-4 font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:-translate-y-1 transition-all">
              <span className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.35),transparent_45%)]"/>
              <span className="inline-flex items-center gap-2">Start Learning Free <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/></span>
            </button>
            <button onClick={onGetStarted} className="rounded-2xl px-8 py-4 font-semibold text-white bg-white/10 border border-white/20 hover:-translate-y-1 transition-all">
              <span className="inline-flex items-center gap-2"><Play className="w-4 h-4 fill-white"/>Become a Mentor</span>
            </button>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {[
              { title:'Personalized Paths', desc:'Smarter learning plans with instant feedback.',  grad:'from-cyan-400/20 to-blue-600/5'    },
              { title:'Verified Experts',   desc:'Learn from mentors with proven experience.',     grad:'from-purple-500/20 to-pink-500/5'  },
              { title:'Gamified Growth',    desc:'Badges, streaks and levels to stay motivated.', grad:'from-emerald-400/20 to-teal-500/5' },
            ].map((c,i) => (
              <Card3D key={i} className={`p-5 bg-gradient-to-br ${c.grad}`}>
                <h3 className="text-white font-bold mb-1">{c.title}</h3>
                <p className="text-white/60 text-sm">{c.desc}</p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-10">
        <Card3D className="max-w-5xl mx-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s,i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"><s.icon className="w-6 h-6 text-blue-300"/></div>
                <p className="text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-white/60 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Card3D>
      </section>

      <section className="px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Everything You Need to <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Excel</span></h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">A complete ecosystem for modern learners and mentors.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f,i) => (
              <Card3D key={i} className="p-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}><f.icon className="w-6 h-6 text-white"/></div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/60 text-sm">{f.desc}</p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 pb-24">
        <Card3D className="max-w-5xl mx-auto p-10 md:p-16 text-center bg-gradient-to-r from-blue-600/60 to-purple-700/60">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/80 mb-8 text-lg">Join thousands of students and mentors shaping the future of education.</p>
          <button onClick={onGetStarted} className="relative isolate overflow-hidden rounded-2xl px-10 py-4 text-lg font-extrabold bg-white text-blue-700 hover:-translate-y-1 transition-all">
            <span className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_45%)]"/>
            Join CommunityLearn — It&apos;s Free 🚀
          </button>
        </Card3D>
      </section>
      <footer className="border-t border-white/10 px-6 py-8 text-center">
        <p className="text-white/40 text-sm">© 2026 CommunityLearn. Built with ❤️ for learners everywhere.</p>
      </footer>
    </App3DBackground>
  );
};

// ─── ROLE SELECTION ───────────────────────────────────────────────────────────
const RoleSelection = ({ onSelect, onBack }) => (
  <App3DBackground className="min-h-screen flex flex-col items-center justify-center px-4 relative">
    <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2 transition-all hover:-translate-y-0.5">
      <ArrowLeft className="w-4 h-4"/> Back
    </button>
    <div className="text-center mb-12">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-5"><BookOpen className="w-8 h-8 text-white"/></div>
      <h2 className="text-4xl font-extrabold text-white mb-3">Join CommunityLearn</h2>
      <p className="text-white/60 text-lg">How would you like to join?</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
      {[
        { role:'student', label:"I'm a Student", Icon:GraduationCap, grad:'from-blue-400 to-cyan-500',   txtColor:'text-blue-300',   items:['Book live tutoring sessions','AI-powered study assistant','Practice quizzes & badges','Track your progress'] },
        { role:'mentor',  label:"I'm a Mentor",  Icon:BookOpen,      grad:'from-purple-400 to-pink-500', txtColor:'text-purple-300', items:['Host live tutoring sessions','Upload study resources','Auto-grade student quizzes','Build your reputation'] },
      ].map(({ role, label, Icon, grad, txtColor, items }) => (
        <Card3D key={role} as="button" onClick={() => onSelect(role)} className="text-left p-8 w-full">
          <div className={`w-16 h-16 bg-gradient-to-br ${grad} rounded-2xl flex items-center justify-center mb-5`}><Icon className="w-8 h-8 text-white"/></div>
          <h3 className="text-2xl font-bold text-white mb-2">{label}</h3>
          <ul className="space-y-2 mb-6 mt-3">
            {items.map((item,i) => (
              <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle className={`w-4 h-4 ${txtColor} flex-shrink-0`}/> {item}
              </li>
            ))}
          </ul>
          <div className={`flex items-center gap-2 ${txtColor} font-semibold text-sm`}>
            Continue as {role==='student'?'Student':'Mentor'} <ChevronRight className="w-4 h-4"/>
          </div>
        </Card3D>
      ))}
    </div>
  </App3DBackground>
);

// ─── LOGIN PAGE (includes forgot-password flow inline) ─────────────────────────
const LoginPage = ({ role, onLogin, onSignup, onBack }) => {
  // mode: 'login' | 'forgot' | 'otp' | 'reset'
  const [mode,        setMode]        = useState('login');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [otp,         setOtp]         = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPw,      setShowPw]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [err,         setErr]         = useState('');

  const isStu  = role === 'student';
  const accent = isStu ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500';
  const aTxt   = isStu ? 'text-blue-300' : 'text-purple-300';

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (ev) => {
  ev.preventDefault();
  setErr('');

  if (!email.trim() || !password) {
    setErr('Please enter email and password.');
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    saveToken(data.token);
    onLogin(data.user);

  } catch (err) {
    setErr(err.message);
  } finally {
    setLoading(false);
  }
};

  // ── Step 1: Send OTP ───────────────────────────────────────────────────────
  const handleSendOTP = async () => {
    setErr(''); setLoading(true);
    if (!email.trim()) { setErr('Please enter your email first.'); setLoading(false); return; }
    try {
      const res  = await fetch(`${API}/api/otp/send`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP.');
      setMode('otp');
    } catch (ex) {
      setErr(ex.message || 'Could not reach server. Is server.js running on port 5000?');
    } finally { setLoading(false); }
  };

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
  const handleVerifyOTP = async () => {
    setErr(''); setLoading(true);
    if (!otp.trim() || otp.trim().length !== 6) { setErr('Please enter the 6-digit OTP.'); setLoading(false); return; }
    try {
      const res  = await fetch(`${API}/api/otp/verify`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed.');
      // Server marks email as verified — now we can reset password
      setMode('reset');
    } catch (ex) {
      setErr(ex.message);
    } finally { setLoading(false); }
  };

  // ── Step 3: Reset Password ─────────────────────────────────────────────────
  // ✅ FIX: No longer sends 'otp' in the body — the server checks verifiedEmails
  //   instead. Sending a stale OTP here was causing "No OTP found" because the
  //   OTP was already deleted from otpStore during /otp/verify.
  const handleResetPassword = async () => {
    setErr(''); setLoading(true);
    if (!newPassword || newPassword.length < 6) { setErr('Password must be at least 6 characters.'); setLoading(false); return; }
    try {
      const res  = await fetch(`${API}/api/auth/reset-password`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email: email.trim(), newPassword }),
        // ✅ Note: 'otp' is intentionally NOT sent here — server uses verifiedEmails
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password.');
      setMode('login');
      setErr('');
      setOtp('');
      setNewPassword('');
      // Show success briefly via a non-blocking alert
      alert('✅ Password reset successfully! Please sign in with your new password.');
    } catch (ex) {
      setErr(ex.message);
    } finally { setLoading(false); }
  };

  const modeTitle = {
    login:  isStu ? 'Student Login'      : 'Mentor Login',
    forgot: 'Forgot Password',
    otp:    'Enter OTP',
    reset:  'Set New Password',
  }[mode];

  const modeSub = {
    login:  'Welcome back! Sign in to continue.',
    forgot: 'Enter your registered email to receive an OTP.',
    otp:    `OTP sent to ${email}. Check your inbox.`,
    reset:  'Choose a strong new password.',
  }[mode];

  return (
    <App3DBackground className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button onClick={mode === 'login' ? onBack : () => { setMode('login'); setErr(''); }}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2 transition-all hover:-translate-y-0.5">
          <ArrowLeft className="w-4 h-4"/> {mode === 'login' ? 'Change role' : 'Back to login'}
        </button>

        <Card3D className="p-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className={`w-14 h-14 bg-gradient-to-br ${accent} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              {isStu ? <GraduationCap className="w-7 h-7 text-white"/> : <BookOpen className="w-7 h-7 text-white"/>}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{modeTitle}</h2>
            <p className="text-white/55 text-sm">{modeSub}</p>
          </div>

          {/* Progress dots for forgot-password flow */}
          {mode !== 'login' && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {['forgot','otp','reset'].map((m,i) => {
                const idx   = ['forgot','otp','reset'].indexOf(mode);
                const done  = i < idx;
                const active= i === idx;
                return (
                  <div key={m} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center border transition-all ${
                      done   ? `bg-gradient-to-br ${accent} text-white border-white/10` :
                      active ? `bg-gradient-to-br ${accent} text-white border-white/10` :
                               'bg-white/5 text-white/30 border-white/10'
                    }`}>{done ? '✓' : i+1}</div>
                    {i < 2 && <div className={`w-8 h-0.5 rounded-full ${done ? 'bg-blue-400' : 'bg-white/10'}`}/>}
                  </div>
                );
              })}
            </div>
          )}

          {err && <ErrBox msg={err}/>}

          {/* ── LOGIN form ─────────────────────────────────────────────────── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <FInput icon={Mail} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}/>
              <FInput icon={Lock} type={showPw?'text':'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                right={<button type="button" onClick={() => setShowPw(p=>!p)} className="text-white/40 hover:text-white/80 transition-colors">{showPw?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>}
              />
              <div className="text-right">
                <button type="button" onClick={() => { setMode('forgot'); setErr(''); }}
                  className={`text-xs font-medium ${aTxt} hover:underline`}>
                  Forgot password?
                </button>
              </div>
              <button type="submit" disabled={loading}
                className={`relative isolate overflow-hidden w-full bg-gradient-to-r ${accent} text-white py-3.5 rounded-2xl font-semibold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50`}>
                <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_50%)]"/>
                <span className="relative">{loading ? <Spin/> : 'Sign In'}</span>
              </button>
            </form>
          )}

          {/* ── FORGOT: enter email ─────────────────────────────────────────── */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <FInput icon={Mail} type="email" placeholder="Your registered email" value={email} onChange={e => setEmail(e.target.value)}/>
              <button onClick={handleSendOTP} disabled={loading}
                className={`relative isolate overflow-hidden w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-2xl font-semibold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50`}>
                <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]"/>
                <span className="relative">{loading ? <Spin/> : 'Send OTP to Email'}</span>
              </button>
            </div>
          )}

          {/* ── OTP: verify ─────────────────────────────────────────────────── */}
          {mode === 'otp' && (
            <div className="space-y-4">
              <FInput icon={Lock} placeholder="Enter 6-digit OTP" value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}/>
              <p className="text-gray-600 text-xs text-center">
                Check your inbox at <span className="text-purple-400">{email}</span>
              </p>
              <button onClick={handleVerifyOTP} disabled={loading}
                className="relative isolate overflow-hidden w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-2xl font-semibold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50">
                <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]"/>
                <span className="relative">{loading ? <Spin/> : 'Verify OTP'}</span>
              </button>
              <button onClick={handleSendOTP} disabled={loading}
                className="w-full py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Resend OTP
              </button>
            </div>
          )}

          {/* ── RESET: new password ──────────────────────────────────────────── */}
          {mode === 'reset' && (
            <div className="space-y-4">
              <FInput icon={Lock} type={showPw?'text':'password'} placeholder="New password (min 6 chars)"
                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                right={<button type="button" onClick={() => setShowPw(p=>!p)} className="text-white/40 hover:text-white/80 transition-colors">{showPw?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>}
              />
              <button onClick={handleResetPassword} disabled={loading}
                className="relative isolate overflow-hidden w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-2xl font-semibold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50">
                <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]"/>
                <span className="relative">{loading ? <Spin/> : 'Reset Password'}</span>
              </button>
            </div>
          )}

          <p className="text-center text-white/55 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <button onClick={onSignup} className={`font-semibold ${aTxt} hover:underline`}>Sign up free</button>
          </p>
        </Card3D>
      </div>
    </App3DBackground>
  );
};

// ─── SIGNUP ───────────────────────────────────────────────────────────────────
const SignupPage = ({ role, onLogin, onLogin2, onBack }) => {
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'', subject:'' });
  const [errs,    setErrs]    = useState({});
  const [showPw,  setShowPw]  = useState(false);
  const [showCf,  setShowCf]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [gErr,    setGErr]    = useState('');
  const [ok,      setOk]      = useState(false);
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

  const submit = (ev) => {
    ev.preventDefault(); setGErr('');
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = demoRegister(form.name.trim(), form.email.trim(), form.password, role, form.subject);
      if (result.error) { setGErr(result.error); setLoading(false); return; }
      if (role === 'mentor') upsertMentorProfile({ ...result.user, sessions:[] });
      saveToken('demo-token-' + result.user.id);
      setOk(true);
      setTimeout(() => onLogin(result.user), 1500);
    }, 700);
  };

  if (ok) return (
    <App3DBackground className="min-h-screen flex items-center justify-center px-4">
      <Card3D className="w-full max-w-md p-10 text-center">
        <div className={`w-20 h-20 bg-gradient-to-br ${accent} rounded-full flex items-center justify-center mx-auto mb-6`}><CheckCircle className="w-10 h-10 text-white"/></div>
        <h2 className="text-3xl font-bold text-white mb-2">Account Created! 🎉</h2>
        <p className="text-white/60">Redirecting to your dashboard...</p>
      </Card3D>
    </App3DBackground>
  );

  return (
    <App3DBackground className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2 transition-all hover:-translate-y-0.5">
          <ArrowLeft className="w-4 h-4"/> Change role
        </button>
        <Card3D className="p-8">
          <div className="text-center mb-8">
            <div className={`w-14 h-14 bg-gradient-to-br ${accent} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              {isStu ? <GraduationCap className="w-7 h-7 text-white"/> : <BookOpen className="w-7 h-7 text-white"/>}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Create {isStu?'Student':'Mentor'} Account</h2>
            <p className="text-white/55 text-sm">Join the community — it&apos;s free!</p>
          </div>
          <ErrBox msg={gErr}/>
          <form onSubmit={submit} className="space-y-4">
            <FInput icon={User}  placeholder="Full name"  value={form.name}    onChange={e => setForm({...form,name:e.target.value})}    error={errs.name}/>
            <FInput icon={Mail}  type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}  error={errs.email}/>
            {role === 'mentor' && (
              <FInput icon={BookOpen} placeholder="Subject you teach (e.g. Mathematics)" value={form.subject} onChange={e => setForm({...form,subject:e.target.value})}/>
            )}
            <FInput icon={Lock} type={showPw?'text':'password'} placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm({...form,password:e.target.value})} error={errs.password}
              right={<button type="button" onClick={() => setShowPw(p=>!p)} className="text-white/40 hover:text-white/80 transition-colors">{showPw?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>}
            />
            <FInput icon={Lock} type={showCf?'text':'password'} placeholder="Confirm password" value={form.confirm} onChange={e => setForm({...form,confirm:e.target.value})} error={errs.confirm}
              right={<button type="button" onClick={() => setShowCf(p=>!p)} className="text-white/40 hover:text-white/80 transition-colors">{showCf?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>}
            />
            <button type="submit" disabled={loading}
              className={`relative isolate overflow-hidden w-full bg-gradient-to-r ${accent} text-white py-3.5 rounded-2xl font-semibold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50`}>
              <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_50%)]"/>
              <span className="relative">{loading ? <Spin/> : `Create ${isStu?'Student':'Mentor'} Account`}</span>
            </button>
          </form>
          <p className="text-center text-white/55 text-sm mt-6">
            Already have an account?{' '}
            <button onClick={onLogin2} className={`font-semibold ${aTxt} hover:underline`}>Sign in</button>
          </p>
        </Card3D>
      </div>
    </App3DBackground>
  );
};

// ─── AUTH FLOW ────────────────────────────────────────────────────────────────
const AuthFlow = ({ onLogin }) => {
  const [screen,       setScreen]       = useState('landing');
  const [selectedRole, setSelectedRole] = useState(null);
  const pickRole = (r) => { setSelectedRole(r); setScreen('login'); };

  return (
    <App3DBackground className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
      {screen === 'landing' && <LandingPage  onGetStarted={() => setScreen('role')} />}
      {screen === 'role'    && <RoleSelection onSelect={pickRole} onBack={() => setScreen('landing')} />}
      {screen === 'login'   && <LoginPage    role={selectedRole} onLogin={onLogin} onSignup={() => setScreen('signup')} onBack={() => setScreen('role')} />}
      {screen === 'signup'  && <SignupPage   role={selectedRole} onLogin={onLogin} onLogin2={() => setScreen('login')}  onBack={() => setScreen('role')} />}
    </App3DBackground>
  );
};

export default AuthFlow;
