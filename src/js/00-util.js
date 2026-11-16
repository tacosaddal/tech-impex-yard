/* ============================================================
   STUDIO SITE. Change the name here and it updates everywhere.
   ============================================================ */
const STUDIO = 'Tech Impex';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, x) => clamp((x - a) / (b - a));
const ss = (a, b, x) => { const t = inv(a, b, x); return t * t * (3 - 2 * t); };
const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
const eio = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eob = t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const rnd = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const pick = a => a[(Math.random() * a.length) | 0];
const pad = (n, l) => String(Math.round(n)).padStart(l, '0');
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TOUCH = matchMedia('(pointer: coarse)').matches;
const DBG = window.__dbg || null;            // set by the local test harness only

/* shared state */
const S = {
  w: innerWidth, h: innerHeight, dpr: 1,
  y: 0, sm: 0, vy: 0,           // scroll: raw, smoothed, velocity
  s: 0, T: 0,                   // journey position (units) and shape timeline
  time: 0, dt: 0.016,
  ch: '', dimIdx: 0,
  px: 0.5, py: 0.5, spx: 0.5, spy: 0.5, pv: 0, pin: false,   // pointer (0..1), smoothed, speed
  lens: 0, pulse: 0, flash: 0, intro: 0, ready: false,
  gl: false, tier: 1
};

/* journey keyframes, in scroll units (1 unit = UNIT * viewport height) */
const KF = {
  hero: [0, 0.55], m01: [0.55, 1.5],
  d1: [1.3, 2.95], spread: [1.8, 2.5], m12: [2.95, 3.9],
  d2: [3.65, 6.35], scr: [3.95, 6.25],
  demo: [6.35, 8.15], m23: [8.15, 9.1],
  d3: [8.9, 10.95], m34: [10.95, 11.85],
  ar: [11.65, 13.05], wrap: [13.05, 13.85],
  vr: [13.6, 15.0], stereo: [14.0, 14.75], room: [15.0, 15.6],
  mr: [15.35, 16.65], m45: [16.65, 17.5], end: 17.5
};
const UNIT = 0.6;

/* page scroll is only intercepted while the game or a case panel is open */
const _lock = { n: 0, h: e => { if (!(e.target.closest && e.target.closest('[data-scrollable]'))) e.preventDefault(); } };
function lockScroll(on) {
  _lock.n = Math.max(0, _lock.n + (on ? 1 : -1));
  if (on && _lock.n === 1) { window.addEventListener('wheel', _lock.h, { passive: false }); window.addEventListener('touchmove', _lock.h, { passive: false }); }
  else if (!on && _lock.n === 0) { window.removeEventListener('wheel', _lock.h); window.removeEventListener('touchmove', _lock.h); }
}

/* tiny tween helper driven by the main loop */
const tweens = [];
function tween(dur, fn, done, ease = eio) { const t = { t: 0, dur, fn, done, ease }; tweens.push(t); fn(0); return t; }
function runTweens(dt) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const t = tweens[i]; t.t += dt; const k = clamp(t.t / t.dur);
    t.fn(t.ease(k));
    if (k >= 1) { tweens.splice(i, 1); if (t.done) t.done(); }
  }
}
function countTo(el, to, fmt, dur = 0.7) {
  const from = el._v === undefined ? to : el._v; el._v = to;
  if (from === to) { el.textContent = fmt(to); return; }
  tween(dur, k => { el.textContent = fmt(lerp(from, to, k)); }, null, t => 1 - Math.pow(1 - t, 3));
}
