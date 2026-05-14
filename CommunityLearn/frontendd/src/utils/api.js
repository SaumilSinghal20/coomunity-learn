import axios from 'axios';

// ─── Token helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY   = 'cl_token';
const SESSION_KEY = 'cl_session';

export const saveToken   = (t) => localStorage.setItem(TOKEN_KEY, t);
export const getToken    = ()  => localStorage.getItem(TOKEN_KEY);
export const clearToken  = ()  => localStorage.removeItem(TOKEN_KEY);

export const saveSession  = (u) => localStorage.setItem(SESSION_KEY, JSON.stringify(u));
export const getSession   = ()  => {
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

// ─── Axios instance ───────────────────────────────────────────────────────────
// Points to your backend. If you don't have a backend yet,
// login/register will fail gracefully — the app still renders.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

export default API;
