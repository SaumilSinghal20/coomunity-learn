// server.js - CommunityLearn Backend
// Run: node server.js
// NOTE: Uses CommonJS (require). Do NOT add "type":"module" to package.json.

const express    = require('express');
const nodemailer = require('nodemailer');   // ✅ FIX: only one import, CommonJS style
const cors       = require('cors');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const { Pool }   = require('pg');
require('dotenv').config();

const app        = express();
const PORT       = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// OTP STORE  — Map used consistently with .get() / .set() / .delete()
// ✅ FIX: Your original code declared otpStore as new Map() at the top,
//   but the reset-password route used bracket syntax: otpStore[email]
//   That reads from the object prototype, not the Map — always returns undefined.
//   Every route now uses Map methods uniformly.
// ─────────────────────────────────────────────────────────────────────────────
const otpStore = new Map();   // email.toLowerCase() → { otp, expires }

// ─────────────────────────────────────────────────────────────────────────────
// VERIFIED EMAILS SET
// ✅ FIX: The reset-password route was checking otpStore AFTER /otp/verify had
//   already deleted the OTP from it (correct one-time-use behaviour).
//   So reset-password always saw an empty store → "No OTP found".
//   Solution: /otp/verify marks the email as verified in a separate Set.
//   /reset-password checks this Set instead of otpStore.
// ─────────────────────────────────────────────────────────────────────────────
const verifiedEmails = new Set();  // cleared after successful password reset

// ── Nodemailer ────────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

// ── PostgreSQL ────────────────────────────────────────────────────────────────
const pool = new Pool({
  user:     process.env.DB_USER     || 'postgres',
  host:     process.env.DB_HOST     || 'localhost',
  database: process.env.DB_NAME     || 'communitylearn',
  password: process.env.DB_PASSWORD || 'password',
  port:     parseInt(process.env.DB_PORT || '5432'),
});
pool.connect((err, client, release) => {
  if (err) console.error('❌ DB connection error:', err.stack);
  else     { console.log('✅ Database connected'); release(); }
});

// ── Rate limiting ─────────────────────────────────────────────────────────────
const loginAttempts      = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME       = 15 * 60 * 1000;

const isAccountLocked = (email) => {
  const a = loginAttempts.get(email);
  if (!a) return false;
  if (a.count >= MAX_LOGIN_ATTEMPTS && Date.now() - a.lastAttempt < LOCKOUT_TIME) return true;
  loginAttempts.delete(email);
  return false;
};
const recordFailedLogin  = (email) => {
  const a = loginAttempts.get(email) || { count:0, lastAttempt:Date.now() };
  a.count++; a.lastAttempt = Date.now(); loginAttempts.set(email, a);
};
const resetLoginAttempts = (email) => loginAttempts.delete(email);

// ── Helpers ───────────────────────────────────────────────────────────────────
const isValidEmail     = (e)  => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const isStrongPassword = (pw) => pw && pw.length >= 6;

// ── Auth middleware ───────────────────────────────────────────────────────────
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user; next();
  });
};

// ── Activity logger ───────────────────────────────────────────────────────────
async function logActivity(req, { userId=null, action, entityType=null, entityId=null, meta={} }) {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress;
    await pool.query(
      `INSERT INTO public.activity_logs (user_id,action,entity_type,entity_id,meta,ip,user_agent)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [userId, action, entityType, entityId, meta, ip, req.headers['user-agent']]
    );
  } catch (e) { console.warn('activity log failed:', e.message); }
}

// ═══════════════════════════════════════════════════════════════
//  OTP ROUTES
// ═══════════════════════════════════════════════════════════════

// POST /api/otp/send
app.post('/api/otp/send', async (req, res) => {
  const { email } = req.body;
  if (!email || !isValidEmail(email))
    return res.status(400).json({ error: 'Valid email is required.' });

  try {
    const user = await pool.query('SELECT id FROM users WHERE LOWER(email)=LOWER($1)', [email]);
    if (user.rows.length === 0)
      return res.status(404).json({ error: 'No account found with this email.' });
  } catch (dbErr) {
    console.warn('DB check skipped (DB may be down):', dbErr.message);
  }

  const otp     = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 min

  // ✅ Always use Map.set()
  otpStore.set(email.toLowerCase(), { otp, expires });
  verifiedEmails.delete(email.toLowerCase()); // reset any previous verify

  try {
    await transporter.sendMail({
      from:    `"CommunityLearn" <${process.env.MAIL_USER}>`,
      to:      email,
      subject: 'CommunityLearn — Password Reset OTP',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;
                    background:#0a0a1a;border-radius:16px;color:#fff">
          <h2 style="color:#a78bfa;margin-bottom:8px">CommunityLearn</h2>
          <p style="color:#9ca3af;margin-bottom:24px">Password Reset Request</p>
          <div style="background:#1a1a2e;border-radius:12px;padding:24px;
                      text-align:center;margin-bottom:24px">
            <p style="color:#9ca3af;font-size:14px;margin-bottom:8px">Your one-time password</p>
            <span style="font-size:40px;font-weight:900;letter-spacing:8px;color:#a78bfa">${otp}</span>
            <p style="color:#6b7280;font-size:12px;margin-top:12px">Valid for 10 minutes</p>
          </div>
          <p style="color:#6b7280;font-size:12px">
            Didn't request this? You can safely ignore this email.
          </p>
        </div>`,
    });
    console.log(`✅ OTP sent to ${email}`);
    res.json({ success: true, message: 'OTP sent to your email.' });
  } catch (mailErr) {
    console.error('Mail error:', mailErr.message);
    console.log(`[DEV FALLBACK] OTP for ${email}: ${otp}`); // visible in terminal
    res.status(500).json({ error: 'Could not send email. Check MAIL_USER/MAIL_PASS in .env' });
  }
});

// POST /api/otp/verify
app.post('/api/otp/verify', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ error: 'Email and OTP are required.' });

  const key    = email.toLowerCase();
  // ✅ Always use Map.get()
  const record = otpStore.get(key);

  if (!record)
    return res.status(400).json({ error: 'No OTP found. Please request a new one.' });

  if (Date.now() > record.expires) {
    otpStore.delete(key);
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }

  if (record.otp !== otp.trim())
    return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });

  // ✅ Delete OTP (one-time use) and mark email as verified
  otpStore.delete(key);
  verifiedEmails.add(key);

  res.json({ success: true, message: 'OTP verified.' });
});

// ═══════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ═══════════════════════════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ error: 'All fields are required.' });
    if (!isValidEmail(email))
      return res.status(400).json({ error: 'Invalid email format.' });
    if (!isStrongPassword(password))
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const existing = await pool.query('SELECT id FROM users WHERE LOWER(email)=LOWER($1)', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: 'Email already registered. Please login.' });

    const hash   = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (email,password_hash,role) VALUES ($1,$2,$3) RETURNING id,email,role',
      [email.toLowerCase(), hash, role || 'student']
    );
    const userId = result.rows[0].id;
    await pool.query(
      'INSERT INTO profiles (user_id,display_name,skills,interests) VALUES ($1,$2,$3,$4)',
      [userId, name, [], []]
    );
    const token = jwt.sign({ id:userId, email:result.rows[0].email, role:result.rows[0].role }, JWT_SECRET, { expiresIn:'7d' });
    res.status(201).json({ success:true, token, user:{ id:userId, email:result.rows[0].email, name, role:result.rows[0].role } });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });
    if (isAccountLocked(email))
      return res.status(429).json({ error: 'Too many failed attempts. Locked for 15 minutes.' });

    const result = await pool.query(
      'SELECT u.*,p.display_name FROM users u LEFT JOIN profiles p ON u.id=p.user_id WHERE LOWER(u.email)=LOWER($1)',
      [email]
    );
    if (!result.rows.length) {
      recordFailedLogin(email);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user  = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      recordFailedLogin(email);
      const attempts  = loginAttempts.get(email);
      const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - (attempts?.count || 0));
      return res.status(401).json({ error: 'Invalid email or password.', attemptsRemaining: remaining });
    }

    resetLoginAttempts(email);
    await logActivity(req, { userId:user.id, action:'LOGIN', entityType:'user', entityId:String(user.id), meta:{ email:user.email } });

    const token = jwt.sign({ id:user.id, email:user.email, role:user.role }, JWT_SECRET, { expiresIn:'7d' });
    res.json({ success:true, token, user:{ id:user.id, email:user.email, name:user.display_name, role:user.role } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword)
      return res.status(400).json({ error: 'Email and new password are required.' });
    if (!isStrongPassword(newPassword))
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const key = email.toLowerCase();

    // ✅ FIX: Check verifiedEmails, NOT otpStore
    // otpStore is already empty at this point (deleted in /otp/verify — correct behaviour)
    if (!verifiedEmails.has(key))
      return res.status(400).json({ error: 'Email not verified. Please complete OTP verification first.' });

    const user = await pool.query('SELECT id FROM users WHERE LOWER(email)=LOWER($1)', [email]);
    if (!user.rows.length)
      return res.status(404).json({ error: 'No account found with this email.' });

    const hash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash=$1,updated_at=NOW() WHERE LOWER(email)=LOWER($2)', [hash, email]);

    verifiedEmails.delete(key); // clean up after use
    console.log(`✅ Password reset: ${email}`);
    res.json({ success:true, message:'Password updated successfully.' });
  } catch (err) {
    console.error('Reset error:', err.message);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// POST /api/auth/change-password (requires login)
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: 'Both passwords are required.' });
    if (!isStrongPassword(newPassword))
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });

    const result = await pool.query('SELECT password_hash FROM users WHERE id=$1', [req.user.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'User not found.' });

    const valid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' });

    const hash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash=$1,updated_at=NOW() WHERE id=$2', [hash, req.user.id]);
    res.json({ success:true, message:'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

// ═══════════════════════════════════════════════════════════════
//  OTHER ROUTES (sessions, bookings, profile — unchanged)
// ═══════════════════════════════════════════════════════════════

app.get('/api/sessions', authenticateToken, async (req, res) => {
  try {
    const r = await pool.query(`SELECT s.*,p.display_name as tutor_name,
      (SELECT COUNT(*) FROM bookings WHERE session_id=s.id AND status='booked') as enrolled_count
      FROM sessions s JOIN profiles p ON s.tutor_id=p.user_id
      WHERE s.start_time > NOW() ORDER BY s.start_time ASC`);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: 'Failed to fetch sessions.' }); }
});

app.post('/api/sessions', authenticateToken, async (req, res) => {
  try {
    if (!['mentor','admin'].includes(req.user.role))
      return res.status(403).json({ error: 'Only mentors can create sessions.' });
    const { title, description, start_time, duration_min, capacity, subject } = req.body;
    if (!title || !start_time || !duration_min)
      return res.status(400).json({ error: 'Title, start time, and duration required.' });
    const r = await pool.query(
      'INSERT INTO sessions (tutor_id,title,description,start_time,duration_min,capacity,subject) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [req.user.id, title, description, start_time, duration_min, capacity||10, subject]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: 'Failed to create session.' }); }
});

app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { session_id } = req.body;
    if (!session_id) return res.status(400).json({ error: 'Session ID required.' });
    const existing = await pool.query('SELECT id FROM bookings WHERE session_id=$1 AND student_id=$2', [session_id, req.user.id]);
    if (existing.rows.length) return res.status(400).json({ error: 'Already booked.' });
    const sess = await pool.query(
      `SELECT s.capacity,COUNT(b.id) as current_bookings FROM sessions s
       LEFT JOIN bookings b ON s.id=b.session_id AND b.status='booked'
       WHERE s.id=$1 GROUP BY s.id,s.capacity`, [session_id]
    );
    if (!sess.rows.length) return res.status(404).json({ error: 'Session not found.' });
    if (sess.rows[0].current_bookings >= sess.rows[0].capacity)
      return res.status(400).json({ error: 'Session is full.' });
    const r = await pool.query(
      'INSERT INTO bookings (session_id,student_id,status) VALUES ($1,$2,$3) RETURNING *',
      [session_id, req.user.id, 'booked']
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: 'Failed to book.' }); }
});

app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT b.*,s.title,s.start_time,s.duration_min,p.display_name as tutor_name
       FROM bookings b JOIN sessions s ON b.session_id=s.id JOIN profiles p ON s.tutor_id=p.user_id
       WHERE b.student_id=$1 ORDER BY s.start_time DESC`, [req.user.id]
    );
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: 'Failed to fetch bookings.' }); }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const r = await pool.query(
      'SELECT p.*,u.email,u.role,u.created_at FROM profiles p JOIN users u ON p.user_id=u.id WHERE p.user_id=$1',
      [req.user.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Profile not found.' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: 'Failed to fetch profile.' }); }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { display_name, skills, interests, bio } = req.body;
    const r = await pool.query(
      'UPDATE profiles SET display_name=$1,skills=$2,interests=$3,bio=$4,updated_at=NOW() WHERE user_id=$5 RETURNING *',
      [display_name, skills||[], interests||[], bio, req.user.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Profile not found.' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: 'Failed to update profile.' }); }
});

app.get('/health', (_, res) => res.json({ status:'OK', uptime:process.uptime() }));
app.get('/api/test-db', async (_, res) => {
  try {
    const r = await pool.query('SELECT COUNT(*) FROM users');
    res.json({ success:true, userCount:r.rows[0].count });
  } catch (e) { res.status(500).json({ error:e.message }); }
});

app.listen(PORT, () => {
  console.log(`\n✅ CommunityLearn backend: http://localhost:${PORT}`);
  console.log(`   Mail: ${process.env.MAIL_USER || '⚠️  MAIL_USER not set in .env'}`);
  console.log(`   DB:   ${process.env.DB_NAME||'communitylearn'} @ ${process.env.DB_HOST||'localhost'}\n`);
});
