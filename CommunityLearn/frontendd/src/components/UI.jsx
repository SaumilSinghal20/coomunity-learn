
import React from 'react';
import { X } from 'lucide-react';

// ─── 3D BACKGROUND ────────────────────────────────────────────────────────────
export const App3DBackground = ({ className = '', children }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_20%_-10%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(1000px_500px_at_90%_0%,rgba(168,85,247,0.16),transparent_60%),linear-gradient(to_bottom,rgba(2,6,23,0.98),rgba(3,7,18,1))]" />
    <div className="pointer-events-none absolute -top-56 -left-40 h-[36rem] w-[36rem] rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
    <div className="pointer-events-none absolute -bottom-56 -right-40 h-[36rem] w-[36rem] rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.09]"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)',
        backgroundSize: '42px 42px',
        transform: 'perspective(900px) rotateX(62deg) translateY(33%) scale(1.3)',
        transformOrigin: 'center',
      }}
    />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)]" />
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-soft-light"
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg fill='%23ffffff' fill-opacity='0.9'%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3Ccircle cx='72' cy='54' r='1'/%3E%3Ccircle cx='132' cy='100' r='1'/%3E%3Ccircle cx='40' cy='130' r='1'/%3E%3Ccircle cx='155' cy='40' r='1'/%3E%3C/g%3E%3C/svg%3E\")" }}
    />
    <div className="relative z-[1]">{children}</div>
  </div>
);

// ─── 3D CARD ─────────────────────────────────────────────────────────────────
export const Card3D = ({ as: Comp = 'div', className = '', children, ...props }) => {
  const ref = React.useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top)  / r.height;
    const ry = (px - 0.5) * 10;
    const rx = -(py - 0.5) * 10;
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
        'after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-px after:rounded-t-3xl',
        'after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent',
        className,
      ].join(' ')}
    >
      {children}
    </Comp>
  );
};

// ─── FORM INPUT ───────────────────────────────────────────────────────────────
export const FInput = ({ icon: Icon, type = 'text', placeholder, value, onChange, error, right }) => (
  <div className="space-y-1">
    <div className={`flex items-center gap-3 bg-white/10 border ${error ? 'border-red-400/60' : 'border-white/20'} rounded-xl px-4 py-3 focus-within:border-blue-400/60 transition-all`}>
      {Icon && <Icon className="w-4 h-4 text-white/40 flex-shrink-0" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none"
      />
      {right}
    </div>
    {error && <p className="text-red-400 text-xs pl-1">{error}</p>}
  </div>
);

// ─── SPINNER ──────────────────────────────────────────────────────────────────
export const Spin = () => (
  <span className="flex items-center justify-center gap-2">
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
    Please wait...
  </span>
);

// ─── ERROR BOX ────────────────────────────────────────────────────────────────
export const ErrBox = ({ msg }) =>
  msg ? (
    <div className="flex items-start gap-2 bg-red-500/10 border border-red-400/30 rounded-xl p-3 mb-5">
      <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      <p className="text-red-400 text-sm">{msg}</p>
    </div>
  ) : null;
