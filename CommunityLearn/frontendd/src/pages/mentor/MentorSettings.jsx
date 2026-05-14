import { useState, useEffect } from 'react';
import { Save, Plus, X, CheckCircle2 } from 'lucide-react';
import { getMentorProfile, updateMentorProfile, upsertMentorProfile } from '../../utils/sharedStore';

const SUBJECTS = ['Mathematics','Programming','Physics','Chemistry','Biology','English','History','Economics','Data Science','Music','Psychology','Arabic','Art & Design'];
const SLOT_OPTIONS = ['Mon 9AM','Mon 11AM','Mon 2PM','Mon 4PM','Tue 10AM','Tue 2PM','Tue 4PM','Wed 9AM','Wed 2PM','Wed 4PM','Thu 10AM','Thu 3PM','Fri 10AM','Fri 2PM','Fri 4PM','Sat 10AM','Sat 2PM','Sun 11AM','Sun 2PM'];

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-500/60 transition-colors";

const MentorSettings = ({ currentUser }) => {
  const [saved,   setSaved]   = useState(false);
  const [profile, setProfile] = useState({
    name:      currentUser?.name || '',
    email:     currentUser?.email || '',
    subject:   'Mathematics',
    specialty: '',
    bio:       '',
    price:     25,
    exp:       1,
    sessions:  [],
  });

  useEffect(() => {
    const p = getMentorProfile(currentUser?.id);
    if (p) setProfile(prev => ({ ...prev, ...p }));
  }, [currentUser]);

  const toggleSlot = (slot) => {
    setProfile(prev => ({
      ...prev,
      sessions: prev.sessions.includes(slot)
        ? prev.sessions.filter(s => s !== slot)
        : [...prev.sessions, slot],
    }));
  };

  const handleSave = () => {
    if (!currentUser?.id) return;
    updateMentorProfile(currentUser.id, profile);
    // Also upsert so new mentors appear in student tutor list
    upsertMentorProfile({ ...currentUser, ...profile });
    // Notify student sessions page to refresh
    window.dispatchEvent(new Event('cl_mentor_update'));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Basic info */}
      <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-6">
        <h3 className="text-sm font-bold text-white mb-5">Profile Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name">
              <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className={inputCls} placeholder="Your full name" />
            </Field>
            <Field label="Email">
              <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className={inputCls} placeholder="your@email.com" />
            </Field>
          </div>
          <Field label="Teaching Subject">
            <select value={profile.subject} onChange={e => setProfile({ ...profile, subject: e.target.value })}
              className={inputCls + ' cursor-pointer'}>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Specialty / Sub-topic">
            <input value={profile.specialty} onChange={e => setProfile({ ...profile, specialty: e.target.value })} className={inputCls} placeholder="e.g. Calculus & Linear Algebra" />
          </Field>
          <Field label="Bio (shown to students)">
            <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={3}
              className={inputCls + ' resize-none'} placeholder="Tell students about your background and teaching style…" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Session Price (USD)">
              <input type="number" min={5} max={200} value={profile.price} onChange={e => setProfile({ ...profile, price: Number(e.target.value) })} className={inputCls} />
              <p className="text-[10px] text-gray-600 mt-1">Students see ₹{profile.price * 80} per session</p>
            </Field>
            <Field label="Years of Experience">
              <input type="number" min={0} max={50} value={profile.exp} onChange={e => setProfile({ ...profile, exp: Number(e.target.value) })} className={inputCls} />
            </Field>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-6">
        <h3 className="text-sm font-bold text-white mb-1">Availability Slots</h3>
        <p className="text-[11px] text-gray-500 mb-4">Select all slots when you are available for sessions</p>
        <div className="flex flex-wrap gap-2">
          {SLOT_OPTIONS.map(slot => {
            const active = profile.sessions.includes(slot);
            return (
              <button key={slot} onClick={() => toggleSlot(slot)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${active ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white hover:border-emerald-700/40'}`}>
                {active && '✓ '}{slot}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-600 mt-3">{profile.sessions.length} slot{profile.sessions.length !== 1 ? 's' : ''} selected</p>
      </div>

      {/* Danger / preferences */}
      <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-6">
        <h3 className="text-sm font-bold text-white mb-4">Preferences</h3>
        <div className="space-y-3">
          {[
            { label:'Email me when a student books a session',     key:'notifyBooking',  def:true  },
            { label:'Email me when a student sends a message',     key:'notifyMessage',  def:true  },
            { label:'Show my profile in student search',           key:'profileVisible', def:true  },
            { label:'Accept automatic bookings (no confirmation)', key:'autoAccept',     def:false },
          ].map((pref,i) => (
            <label key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0 cursor-pointer">
              <span className="text-xs text-gray-300">{pref.label}</span>
              <div className={`w-9 h-5 rounded-full transition-colors relative ${profile[pref.key] ?? pref.def ? 'bg-emerald-600' : 'bg-white/10'}`}
                onClick={() => setProfile(prev => ({ ...prev, [pref.key]: !(prev[pref.key] ?? pref.def) }))}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${profile[pref.key] ?? pref.def ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${saved ? 'bg-emerald-700 text-emerald-200' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'}`}>
        {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
      </button>
      <p className="text-center text-[11px] text-gray-600">Changes are visible to students immediately after saving</p>
    </div>
  );
};

export default MentorSettings;
