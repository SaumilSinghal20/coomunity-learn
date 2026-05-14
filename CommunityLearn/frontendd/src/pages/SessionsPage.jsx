import { useState, useEffect } from 'react';
import {
  Search, ArrowLeft, X, CreditCard, Shield, CheckCircle,
  Star, Calendar, Clock, Users, ChevronRight, Video,
  BarChart3, BookOpen, FlaskConical, Music, Brain,
  Landmark, Palette, Globe, MessageSquare
} from 'lucide-react';
import {
  getMentorProfiles,
  bookSession,
  getStudentSessions,
  getMentorReviews,
  getMentorAvgRating,
  sendEmailNotification,
  addNotification,
  sendMessage,
} from '../utils/sharedStore';
import { TUTORS } from '../data/tutors'; // fallback static tutors

// ─── helpers ──────────────────────────────────────────────────────────────────
const badgeCls = b => {
  if (b === 'Top Rated') return 'bg-amber-500 text-white';
  if (b === 'Popular')   return 'bg-teal-500 text-white';
  if (b === 'Rising')    return 'bg-emerald-600 text-white';
  if (b === 'New')       return 'bg-rose-600 text-white';
  return 'bg-violet-600 text-white';
};

const subjectIcon = s => {
  const map = {
    Mathematics:   <BarChart3    className="w-3.5 h-3.5" />,
    Programming:   <Brain        className="w-3.5 h-3.5" />,
    English:       <BookOpen     className="w-3.5 h-3.5" />,
    Physics:       <FlaskConical className="w-3.5 h-3.5" />,
    Chemistry:     <FlaskConical className="w-3.5 h-3.5" />,
    Biology:       <FlaskConical className="w-3.5 h-3.5" />,
    History:       <Clock        className="w-3.5 h-3.5" />,
    Economics:     <Landmark     className="w-3.5 h-3.5" />,
    'Data Science':<Brain        className="w-3.5 h-3.5" />,
    Music:         <Music        className="w-3.5 h-3.5" />,
    Psychology:    <Users        className="w-3.5 h-3.5" />,
    Arabic:        <Globe        className="w-3.5 h-3.5" />,
    'Art & Design':<Palette      className="w-3.5 h-3.5" />,
  };
  return map[s] || <BookOpen className="w-3.5 h-3.5" />;
};

const getBullets = t => {
  const map = {
    Mathematics:   ['Certified Mathematics Expert',     'Algebra & Calculus Specialist'],
    Programming:   ['Certified Google Developer',       'Python & Data Science Expert'],
    English:       ['Cambridge Certified Educator',     'IELTS & TOEFL Expert'],
    Physics:       ['Stanford Research Physicist',      'JEE & NEET Physics Expert'],
    Chemistry:     ['IIT Delhi Chemistry Graduate',     'Organic Reactions Specialist'],
    Biology:       ['AIIMS Graduate Biologist',         'Genetics & Cell Biology Expert'],
    History:       ['Oxford Historian',                 'World History Specialist'],
    Economics:     ['Former IMF Economist',             'Macro & Micro Expert'],
    'Data Science':['Ex-Netflix Data Scientist',        'ML & TensorFlow Expert'],
    Music:         ['Berklee Music Graduate',           'Piano & Music Theory Expert'],
    Psychology:    ['Clinical Psychologist',            'Cognitive Behavior Expert'],
    Arabic:        ['Al-Azhar University Professor',    'Tajweed & Grammar Expert'],
    'Art & Design':['Ex-Adobe Designer',               'UI/UX & Figma Expert'],
  };
  return map[t.subject] || [t.specialty || 'Certified Expert', 'Domain Specialist'];
};

const DEFAULT_SLOTS = ['Mon 2PM','Wed 4PM','Fri 3PM','Sat 11AM','Sun 2PM'];

// ─── merge static + dynamic tutors ───────────────────────────────────────────
const useMergedTutors = () => {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    const refresh = () => {
      const dynamicMentors = getMentorProfiles().map(m => ({
        id:        `dynamic_${m.id}`,
        _dynamicId: m.id,
        name:      m.name,
        subject:   m.subject   || 'General',
        specialty: m.specialty || 'General Teaching',
        exp:       m.exp       || 1,
        rating:    parseFloat(getMentorAvgRating(m.id) || m.rating || 4.5),
        reviews:   getMentorReviews(m.id).length,
        price:     m.price     || 25,
        img:       m.img       || m.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2),
        color:     m.color     || 'from-emerald-500 to-teal-600',
        badge:     m.badge     || 'New',
        sessions:  m.sessions?.length ? m.sessions : DEFAULT_SLOTS,
        bio:       m.bio       || `Expert ${m.subject || ''} tutor. Passionate about helping students achieve their goals.`,
        email:     m.email     || '',
        isDynamic: true,
      }));

      // Merge — dynamic mentors appear first
      const staticIds = new Set(TUTORS.map(t => t.id));
      setTutors([...dynamicMentors, ...TUTORS]);
    };
    refresh();
    window.addEventListener('cl_mentor_update', refresh);
    return () => window.removeEventListener('cl_mentor_update', refresh);
  }, []);

  return tutors;
};

// ─── Tutor Card ───────────────────────────────────────────────────────────────
const TutorCard = ({ tutor, onProfile, onBook, onMessage }) => {
  const bullets = getBullets(tutor);
  return (
    <div className="rounded-2xl border border-white/[0.09] bg-[#131c2e] hover:border-teal-500/40 hover:bg-[#162035] transition-all duration-200 p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3.5">
        <div className={`w-14 h-14 flex-shrink-0 rounded-full bg-gradient-to-br ${tutor.color} flex items-center justify-center text-white font-bold text-lg border-2 border-white/10 shadow-lg`}>
          {tutor.img}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 justify-between">
            <h3 className="text-sm font-bold text-white leading-tight truncate">{tutor.name}</h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {tutor.isDynamic && (
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600/40 text-emerald-300 border border-emerald-600/30">LIVE</span>
              )}
              {tutor.badge && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeCls(tutor.badge)}`}>{tutor.badge}</span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{tutor.subject}</p>
          {tutor.specialty && <p className="text-[10px] text-teal-400/70 mt-0.5">{tutor.specialty}</p>}
        </div>
      </div>

      <div className="space-y-1">
        {bullets.map((b, i) => (
          <p key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
            <span className="text-teal-400 mt-0.5 flex-shrink-0">•</span> {b}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        {[
          { icon:<Calendar className="w-3 h-3" />,  value:`${tutor.exp}y`, label:'Exp',     color:'bg-teal-600/70'  },
          { icon:<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />, value:typeof tutor.rating === 'number' ? tutor.rating.toFixed(1) : tutor.rating, label:'Rating', color:'bg-[#1e2a1e]' },
          { icon:<MessageSquare className="w-3 h-3" />, value:tutor.reviews, label:'Reviews', color:'bg-[#1c2130]' },
        ].map((s, i) => (
          <div key={i} className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl ${s.color} border border-white/[0.07] min-w-[60px] flex-1`}>
            <div className="flex items-center gap-1 text-white text-xs font-bold">{s.icon}{s.value}</div>
            <span className="text-[9px] text-gray-400 mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div>
          <span className="text-lg font-black text-white">₹{tutor.price * 80}</span>
          <span className="text-xs text-gray-500 ml-1">/sess</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onProfile(tutor)}
            className="px-3 py-1.5 rounded-xl border border-white/20 text-xs font-semibold text-gray-300 hover:text-white hover:border-white/40 transition-all">
            Profile
          </button>
          <button onClick={() => onBook(tutor)}
            className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-xs font-bold text-white transition-all shadow-lg shadow-teal-900/30">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Booking Modal ─────────────────────────────────────────────────────────────
const BookingModal = ({ tutor, currentUser, onClose, onConfirm }) => {
  const [selSlot,  setSelSlot]  = useState('');
  const [cardForm, setCardForm] = useState({ name:'', number:'', expiry:'', cvv:'' });
  const [loading,  setLoading]  = useState(false);

  const handlePay = async () => {
    if (!selSlot) { alert('Please select a time slot'); return; }
    if (!cardForm.name || !cardForm.number || !cardForm.expiry || !cardForm.cvv) { alert('Fill all payment details'); return; }
    if (cardForm.number.length < 16) { alert('Enter valid 16-digit card number'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // simulate payment

    const session = bookSession({
      mentorId:     tutor._dynamicId || String(tutor.id),
      mentorName:   tutor.name,
      mentorEmail:  tutor.email || '',
      studentId:    currentUser.id,
      studentName:  currentUser.name,
      studentEmail: currentUser.email || '',
      subject:      tutor.subject,
      slot:         selSlot,
      price:        tutor.price * 80,
      topic:        tutor.specialty || tutor.subject,
    });

    // Notify mentor
    addNotification({
      userId:  tutor._dynamicId || String(tutor.id),
      type:    'new_booking',
      title:   'New Session Request',
      message: `${currentUser.name} has booked a session for ${selSlot}`,
      data:    { sessionId: session.id },
    });

    // Notify student
    addNotification({
      userId:  currentUser.id,
      type:    'booking_pending',
      title:   'Booking Sent!',
      message: `Your booking with ${tutor.name} for ${selSlot} is pending confirmation.`,
      data:    { sessionId: session.id },
    });

    // Simulate email
    sendEmailNotification({
      to:      tutor.email || 'mentor@communitylearn.app',
      subject: `New Session Request from ${currentUser.name}`,
      body:    `Student: ${currentUser.name}\nSlot: ${selSlot}\nSubject: ${tutor.subject}\n\nLog in to CommunityLearn to accept or decline.`,
    });

    // Dispatch event so mentor dashboard updates live
    window.dispatchEvent(new Event('cl_session_update'));
    setLoading(false);
    onConfirm(session);
  };

  const slots = tutor.sessions?.length ? tutor.sessions : DEFAULT_SLOTS;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#111827] border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white">Book Session</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl p-3.5 mb-5 border border-white/[0.07]">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${tutor.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>{tutor.img}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{tutor.name}</p>
            <p className="text-xs text-gray-400">{tutor.subject}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-black text-white">₹{tutor.price * 80}</p>
            <p className="text-[10px] text-gray-500">per session</p>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-400 mb-2">Select a Time Slot</p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {slots.map(s => (
            <button key={s} onClick={() => setSelSlot(s)}
              className={`py-2 px-2 rounded-xl text-[10px] font-semibold border transition-all ${selSlot === s ? 'bg-teal-500 border-teal-400 text-white' : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:border-teal-500/40 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-xl px-3.5 py-2.5 mb-4">
          <CreditCard className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-white">Secure Payment</p>
            <p className="text-[10px] text-gray-500">Cards, UPI, Net Banking accepted</p>
          </div>
        </div>

        <div className="space-y-2.5 mb-5">
          <input type="text" placeholder="Cardholder Name" value={cardForm.name}
            onChange={e => setCardForm({ ...cardForm, name: e.target.value })}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm outline-none focus:border-teal-500/60 transition-colors" />
          <input type="text" placeholder="Card Number (16 digits)" value={cardForm.number}
            onChange={e => setCardForm({ ...cardForm, number: e.target.value.replace(/\D/g,'').slice(0,16) })}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm outline-none focus:border-teal-500/60 transition-colors" />
          <div className="grid grid-cols-2 gap-2.5">
            <input placeholder="MM/YY" value={cardForm.expiry}
              onChange={e => setCardForm({ ...cardForm, expiry: e.target.value.slice(0,5) })}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm outline-none focus:border-teal-500/60 transition-colors" />
            <input placeholder="CVV" type="password" value={cardForm.cvv}
              onChange={e => setCardForm({ ...cardForm, cvv: e.target.value.slice(0,3) })}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm outline-none focus:border-teal-500/60 transition-colors" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/[0.04] rounded-xl px-4 py-3 mb-4 border border-white/[0.07]">
          <span className="text-sm text-gray-400">Total (INR)</span>
          <span className="text-base font-black text-white">₹{tutor.price * 80}</span>
        </div>

        <button onClick={handlePay} disabled={!selSlot || loading}
          className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30">
          {loading ? <span className="animate-pulse">Processing…</span> : <><CreditCard className="w-4 h-4" />Pay ₹{tutor.price * 80} &amp; Request Booking</>}
        </button>
        <p className="text-center text-[10px] text-gray-600 mt-3 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" /> Secured by 256-bit SSL · Mentor must confirm
        </p>
      </div>
    </div>
  );
};

// ─── Success Modal ─────────────────────────────────────────────────────────────
const SuccessModal = ({ session, tutor, onClose }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="w-full max-w-sm rounded-2xl bg-[#111827] border border-white/10 p-8 text-center shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-4">
        <Clock className="w-8 h-8 text-amber-400" />
      </div>
      <h2 className="text-lg font-bold text-white mb-1">Booking Requested! ⏳</h2>
      <p className="text-sm text-gray-400 mb-1">Session with <span className="text-white font-semibold">{tutor?.name}</span></p>
      <p className="text-teal-400 text-sm font-semibold mb-3">{session?.slot}</p>
      <div className="bg-white/[0.04] rounded-xl p-3 mb-5 border border-white/[0.07] text-left">
        <p className="text-[11px] text-gray-500 mb-1">What happens next?</p>
        <p className="text-xs text-gray-300">1. Mentor reviews your request</p>
        <p className="text-xs text-gray-300">2. You get a Google Meet link once confirmed</p>
        <p className="text-xs text-gray-300">3. Join at the scheduled time</p>
      </div>
      <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm transition-all">Done</button>
    </div>
  </div>
);

// ─── Confirmed Session Modal (shows Meet link) ─────────────────────────────────
const MeetLinkModal = ({ session, onClose }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="w-full max-w-sm rounded-2xl bg-[#111827] border border-emerald-500/30 p-8 text-center shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
        <Video className="w-8 h-8 text-emerald-400" />
      </div>
      <h2 className="text-lg font-bold text-white mb-1">Session Confirmed! 🎉</h2>
      <p className="text-sm text-gray-400 mb-4">Your Google Meet link is ready:</p>
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-5">
        <p className="text-xs text-gray-500 mb-1">Meeting Link</p>
        <a href={session.meetLink} target="_blank" rel="noopener noreferrer"
          className="text-emerald-400 text-sm font-mono break-all hover:underline">
          {session.meetLink}
        </a>
      </div>
      <button onClick={() => window.open(session.meetLink, '_blank')}
        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all mb-2">
        Join Meeting
      </button>
      <button onClick={onClose} className="w-full py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">Close</button>
    </div>
  </div>
);

// ─── Profile Modal ─────────────────────────────────────────────────────────────
const ProfileModal = ({ tutor, currentUser, onClose, onBook }) => {
  const bullets   = getBullets(tutor);
  const reviews   = tutor._dynamicId ? getMentorReviews(tutor._dynamicId) : [];
  const avgRating = reviews.length ? (reviews.reduce((a,r) => a+r.rating, 0)/reviews.length).toFixed(1) : tutor.rating;
  const slots     = tutor.sessions?.length ? tutor.sessions : DEFAULT_SLOTS;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#111827] border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <button onClick={onClose} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-16 h-16 flex-shrink-0 rounded-full bg-gradient-to-br ${tutor.color} flex items-center justify-center text-white font-bold text-xl border-2 border-white/10`}>{tutor.img}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{tutor.name}</h2>
              {tutor.isDynamic && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600/40 text-emerald-300 border border-emerald-600/30">LIVE MENTOR</span>}
              {tutor.badge && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeCls(tutor.badge)}`}>{tutor.badge}</span>}
            </div>
            <p className="text-sm text-teal-400 font-semibold">{tutor.subject} — {tutor.specialty}</p>
            <p className="text-xs text-gray-400 mt-1">{tutor.bio}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[{label:'Experience',value:`${tutor.exp} yrs`},{label:'Rating',value:`⭐ ${avgRating}`},{label:'Reviews',value:`${reviews.length || tutor.reviews}+`}].map((s,i) => (
            <div key={i} className="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.07]">
              <p className="text-sm font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs font-semibold text-gray-400 mb-2">Specialties</p>
        <div className="space-y-1 mb-5">
          {bullets.map((b,i) => <p key={i} className="text-xs text-gray-400 flex items-start gap-1.5"><span className="text-teal-400 mt-0.5">•</span>{b}</p>)}
        </div>
        <p className="text-xs font-semibold text-gray-400 mb-2">Available Slots</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {slots.map(s => <span key={s} className="px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-lg text-xs">{s}</span>)}
        </div>

        {/* Reviews from students */}
        {reviews.length > 0 && (
          <>
            <p className="text-xs font-semibold text-gray-400 mb-2">Student Reviews</p>
            <div className="space-y-2 mb-5">
              {reviews.slice(0,3).map((r,i) => (
                <div key={i} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-white">{r.studentName}</p>
                    <div className="flex items-center gap-0.5">{Array.from({length:5}).map((_,j) => <Star key={j} className={`w-3 h-3 ${j<r.rating?'fill-amber-400 text-amber-400':'text-gray-700'}`}/>)}</div>
                  </div>
                  <p className="text-[11px] text-gray-400">{r.text}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <div><span className="text-2xl font-black text-white">₹{tutor.price * 80}</span><span className="text-sm text-gray-500 ml-1">/ session</span></div>
          <button onClick={() => onBook(tutor)} className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm transition-all shadow-lg shadow-teal-900/30">Book Now</button>
        </div>
      </div>
    </div>
  );
};

// ─── SESSIONS PAGE ─────────────────────────────────────────────────────────────
const SessionsPage = ({ currentUser, onBookingComplete }) => {
  const tutors      = useMergedTutors();
  const [search,    setSearch]    = useState('');
  const [filterSub, setFilterSub] = useState('All');
  const [booking,   setBooking]   = useState(null);
  const [profile,   setProfile]   = useState(null);
  const [success,   setSuccess]   = useState({ show:false, session:null, tutor:null });
  const [myBookings,setMyBookings]= useState([]);
  const [meetModal, setMeetModal] = useState(null);

  // load student's own sessions to show confirmed ones with meet links
  useEffect(() => {
    const refresh = () => {
      if (currentUser?.id) setMyBookings(getStudentSessions(currentUser.id));
    };
    refresh();
    window.addEventListener('cl_session_update', refresh);
    return () => window.removeEventListener('cl_session_update', refresh);
  }, [currentUser]);

  const uniqueSubjects  = ['All', ...Array.from(new Set(tutors.map(t => t.subject)))];
  const visibleFilters  = ['All','Mathematics','Programming','English','Science','History'];

  const filtered = tutors.filter(t =>
    (filterSub === 'All' || t.subject === filterSub) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) ||
     t.subject.toLowerCase().includes(search.toLowerCase()) ||
     (t.specialty||'').toLowerCase().includes(search.toLowerCase()))
  );

  const handleConfirm = (session) => {
    setBooking(null);
    setSuccess({ show:true, session, tutor:booking });
    if (onBookingComplete) onBookingComplete();
  };

  const confirmedSessions = myBookings.filter(s => s.status === 'confirmed' && s.meetLink);

  return (
    <div className="min-h-screen bg-[#0c1118]" style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      {booking && <BookingModal tutor={booking} currentUser={currentUser} onClose={() => setBooking(null)} onConfirm={handleConfirm} />}
      {success.show && <SuccessModal session={success.session} tutor={success.tutor} onClose={() => setSuccess({ show:false, session:null, tutor:null })} />}
      {profile && <ProfileModal tutor={profile} currentUser={currentUser} onClose={() => setProfile(null)} onBook={t => { setProfile(null); setBooking(t); }} />}
      {meetModal && <MeetLinkModal session={meetModal} onClose={() => setMeetModal(null)} />}

      {/* My confirmed sessions with meet links */}
      {confirmedSessions.length > 0 && (
        <div className="px-6 pt-5">
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 mb-4">
            <p className="text-xs font-bold text-emerald-300 mb-3">✅ Your Confirmed Sessions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {confirmedSessions.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-white/[0.04] rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-white">{s.mentorName}</p>
                    <p className="text-xs text-gray-400">{s.slot} · {s.subject}</p>
                  </div>
                  <button onClick={() => setMeetModal(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
                    <Video className="w-3.5 h-3.5" /> Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-6 pt-4 pb-4">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-black text-white">Find Your Tutor</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} Expert Tutors available
              {filterSub !== 'All' && <> for <span className="text-teal-400 font-semibold">"{filterSub}"</span></>}
            </p>
          </div>
          <div className="relative w-80 flex-shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search tutors, subjects, concepts..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#131c2e] border border-white/[0.08] text-sm text-white placeholder-gray-600 outline-none focus:border-teal-500/50 transition-colors" />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {visibleFilters.map(s => (
            <button key={s} onClick={() => setFilterSub(s)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterSub === s ? 'bg-teal-500/20 border-teal-500/60 text-teal-300' : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-white'}`}>
              {s !== 'All' && <span className="opacity-70">{subjectIcon(s)}</span>}{s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Users className="w-12 h-12 text-gray-700 mb-3" />
            <p className="text-gray-400 font-semibold">No tutors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(t => (
              <TutorCard key={t.id} tutor={t} onProfile={setProfile} onBook={setBooking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionsPage;
