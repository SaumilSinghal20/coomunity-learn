import { useState } from 'react';
import { Star, X, Send, MessageSquare } from 'lucide-react';
import { addReview, sendMessage, addNotification } from '../utils/sharedStore';

// ── Student → Mentor message widget ───────────────────────────────────────────
export const SendMessageModal = ({ currentUser, mentor, onClose }) => {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage({
      senderId:      currentUser.id,
      senderName:    currentUser.name,
      recipientId:   mentor.mentorId || mentor._dynamicId || String(mentor.id),
      recipientName: mentor.mentorName || mentor.name,
      text:          text.trim(),
    });
    addNotification({
      userId:  mentor.mentorId || mentor._dynamicId || String(mentor.id),
      type:    'new_message',
      title:   'New Message',
      message: `${currentUser.name}: ${text.trim().slice(0,50)}`,
    });
    window.dispatchEvent(new Event('cl_message_update'));
    setSent(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#111827] border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white">Message {mentor.mentorName || mentor.name}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        {sent ? (
          <div className="text-center py-4">
            <MessageSquare className="w-10 h-10 text-teal-400 mx-auto mb-2" />
            <p className="text-white font-semibold">Message sent! ✓</p>
          </div>
        ) : (
          <>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
              placeholder="Type your message to the mentor…"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-gray-600 outline-none focus:border-teal-500/60 transition-colors resize-none mb-4" />
            <button onClick={handleSend} disabled={!text.trim()}
              className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-all">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ── Star picker ───────────────────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n => (
      <button key={n} onClick={() => onChange(n)}
        className="transition-transform hover:scale-110">
        <Star className={`w-7 h-7 ${n <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-600 hover:text-amber-300'}`} />
      </button>
    ))}
  </div>
);

// ── Review Modal ───────────────────────────────────────────────────────────────
const StudentReviewModal = ({ session, currentUser, onClose }) => {
  const [rating, setRating] = useState(5);
  const [text,   setText]   = useState('');
  const [done,   setDone]   = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) { alert('Please write a brief review'); return; }
    addReview({
      sessionId:   session.id,
      mentorId:    session.mentorId,
      mentorName:  session.mentorName,
      studentId:   currentUser.id,
      studentName: currentUser.name,
      subject:     session.subject,
      rating,
      text:        text.trim(),
    });
    addNotification({
      userId:  session.mentorId,
      type:    'new_review',
      title:   'New Review Received',
      message: `${currentUser.name} gave you ${rating} stars`,
    });
    window.dispatchEvent(new Event('cl_review_update'));
    setDone(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#111827] border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-white">Rate your session</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        {done ? (
          <div className="text-center py-6">
            <Star className="w-12 h-12 fill-amber-400 text-amber-400 mx-auto mb-2" />
            <p className="text-white font-bold text-lg">Review submitted! ✓</p>
            <p className="text-gray-500 text-xs mt-1">Thank you for your feedback</p>
          </div>
        ) : (
          <>
            <div className="bg-white/[0.04] rounded-xl p-3 mb-5 border border-white/[0.07]">
              <p className="text-xs font-bold text-white">{session.mentorName}</p>
              <p className="text-[10px] text-gray-500">{session.subject} · {session.slot}</p>
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Your rating</p>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
              placeholder="Share your experience with this mentor…"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-gray-600 outline-none focus:border-amber-500/60 transition-colors resize-none mb-4" />
            <button onClick={handleSubmit}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-all">
              Submit Review
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentReviewModal;
