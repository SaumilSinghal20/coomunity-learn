// ─────────────────────────────────────────────────────────────────────────────
//  sharedStore.js  –  localStorage-backed shared state for CommunityLearn
//  This replaces a real backend for the demo. All data persists across refreshes.
// ─────────────────────────────────────────────────────────────────────────────

const read  = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const uid   = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ─── Mentor Profiles ──────────────────────────────────────────────────────────
export const getMentorProfiles = () => read('cl_mentor_profiles', []);

export const getMentorProfile = (mentorId) =>
  getMentorProfiles().find(p => p.id === mentorId) || null;

export const updateMentorProfile = (mentorId, data) => {
  const profiles = getMentorProfiles();
  const idx = profiles.findIndex(p => p.id === mentorId);
  if (idx >= 0) profiles[idx] = { ...profiles[idx], ...data };
  else profiles.push({ id: mentorId, ...data });
  write('cl_mentor_profiles', profiles);
};

export const upsertMentorProfile = (user) => {
  if (!user?.id) return;
  const profiles = getMentorProfiles();
  const idx = profiles.findIndex(p => p.id === user.id);
  const entry = {
    id:        user.id,
    name:      user.name      || 'Unknown Mentor',
    email:     user.email     || '',
    subject:   user.subject   || 'General',
    specialty: user.specialty || '',
    bio:       user.bio       || '',
    price:     user.price     || 25,
    exp:       user.exp       || 1,
    sessions:  user.sessions  || [],
    rating:    user.rating    || 4.5,
    reviews:   user.reviews   || 0,
    role:      'mentor',
    badge:     'New',
    _dynamicId: user.id,
  };
  if (idx >= 0) profiles[idx] = { ...profiles[idx], ...entry };
  else profiles.push(entry);
  write('cl_mentor_profiles', profiles);
};

// ─── Sessions ─────────────────────────────────────────────────────────────────
export const getAllSessions = () => read('cl_sessions', []);

export const getMentorSessions = (mentorId) =>
  getAllSessions().filter(s => s.mentorId === mentorId);

export const getStudentSessions = (studentId) =>
  getAllSessions().filter(s => s.studentId === studentId);

export const bookSession = ({ mentorId, mentorName, studentId, studentName, studentEmail, subject, slot, price }) => {
  const sessions = getAllSessions();
  const session = {
    id:           uid(),
    mentorId,
    mentorName,
    studentId,
    studentName,
    studentEmail: studentEmail || '',
    subject,
    slot,
    price:        price || 0,
    status:       'pending',
    meetLink:     null,
    createdAt:    new Date().toISOString(),
  };
  sessions.push(session);
  write('cl_sessions', sessions);
  return session;
};

export const acceptSession = (sessionId) => {
  const sessions = getAllSessions();
  const idx = sessions.findIndex(s => s.id === sessionId);
  if (idx < 0) return null;
  const meetLink = `https://meet.google.com/${uid().slice(0, 3)}-${uid().slice(0, 4)}-${uid().slice(0, 3)}`;
  sessions[idx] = { ...sessions[idx], status: 'confirmed', meetLink };
  write('cl_sessions', sessions);
  return meetLink;
};

export const declineSession = (sessionId) => {
  const sessions = getAllSessions();
  const idx = sessions.findIndex(s => s.id === sessionId);
  if (idx >= 0) { sessions[idx].status = 'cancelled'; write('cl_sessions', sessions); }
};

export const completeSession = (sessionId) => {
  const sessions = getAllSessions();
  const idx = sessions.findIndex(s => s.id === sessionId);
  if (idx >= 0) { sessions[idx].status = 'completed'; write('cl_sessions', sessions); }
};

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const getAllReviews = () => read('cl_reviews', []);

export const getMentorReviews = (mentorId) =>
  getAllReviews().filter(r => r.mentorId === mentorId);

export const getMentorAvgRating = (mentorId) => {
  const reviews = getMentorReviews(mentorId);
  if (!reviews.length) return null;
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  return Math.round(avg * 10) / 10;
};

export const addReview = ({ sessionId, mentorId, mentorName, studentId, studentName, subject, rating, text }) => {
  const reviews = getAllReviews();
  reviews.push({
    id: uid(), sessionId, mentorId, mentorName,
    studentId, studentName, subject, rating, text,
    createdAt: new Date().toISOString(),
  });
  write('cl_reviews', reviews);
};

// ─── Messages ─────────────────────────────────────────────────────────────────
export const getAllMessages = () => read('cl_messages', []);

export const sendMessage = ({ senderId, senderName, recipientId, recipientName, text }) => {
  const messages = getAllMessages();
  messages.push({
    id: uid(), senderId, senderName, recipientId, recipientName,
    text, read: false, createdAt: new Date().toISOString(),
  });
  write('cl_messages', messages);
};

export const getConversation = (userId, partnerId) =>
  getAllMessages().filter(m =>
    (m.senderId === userId && m.recipientId === partnerId) ||
    (m.senderId === partnerId && m.recipientId === userId)
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

export const getMentorConversations = (mentorId) => {
  const msgs = getAllMessages().filter(m =>
    m.senderId === mentorId || m.recipientId === mentorId
  );
  const partners = {};
  msgs.forEach(m => {
    const partnerId   = m.senderId === mentorId ? m.recipientId : m.senderId;
    const partnerName = m.senderId === mentorId ? m.recipientName : m.senderName;
    if (!partners[partnerId] || new Date(m.createdAt) > new Date(partners[partnerId].lastMsg?.createdAt || 0)) {
      partners[partnerId] = { partnerId, partnerName, lastMsg: m };
    }
  });
  return Object.values(partners);
};

export const markMessageRead = (messageId) => {
  const messages = getAllMessages();
  const idx = messages.findIndex(m => m.id === messageId);
  if (idx >= 0) { messages[idx].read = true; write('cl_messages', messages); }
};

export const getUnreadCount = (userId) =>
  getAllMessages().filter(m => m.recipientId === userId && !m.read).length;

// ─── Notifications ────────────────────────────────────────────────────────────
export const getAllNotifications = () => read('cl_notifications', []);

export const addNotification = ({ userId, type, title, message, data }) => {
  const notifs = getAllNotifications();
  notifs.unshift({
    id: uid(), userId, type, title, message, data: data || {},
    read: false, createdAt: new Date().toISOString(),
  });
  // Keep last 50
  write('cl_notifications', notifs.slice(0, 50));
};

export const getUserNotifications = (userId) =>
  getAllNotifications().filter(n => n.userId === userId);

export const markNotificationRead = (notifId) => {
  const notifs = getAllNotifications();
  const idx = notifs.findIndex(n => n.id === notifId);
  if (idx >= 0) { notifs[idx].read = true; write('cl_notifications', notifs); }
};

// ─── Email (stub — logs to console in demo) ───────────────────────────────────
export const sendEmailNotification = ({ to, subject, body }) => {
  console.info(`[EMAIL STUB] To: ${to}\nSubject: ${subject}\n${body}`);
};
