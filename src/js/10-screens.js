/* ============================================================
   2D SCREENS: small live interfaces drawn to a canvas.
   The particle wall shows one pixel per particle; the project
   covers and the mixed-reality panels reuse the same drawings.
   ============================================================ */
const UI = { off: '#000', pan: '#1b1e25', pan2: '#272b35', ln: '#363a47', tx: '#b9bdc9', hi: '#ffffff', dim: '#6f7482', a1: '#ffc83d', a2: '#35e0ff', a3: '#ff6a3d', a4: '#a98bff', ok: '#59e39b', bad: '#ff5d6c' };
const FONT = 'Geist, "Helvetica Neue", Arial, sans-serif';

function kit(ctx) {
  return {
    ctx,
    r(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); },
    rr(x, y, w, h, r, c, stroke) {
      r = Math.min(r, w / 2, h / 2); if (w <= 0 || h <= 0) return;
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
      if (stroke) { ctx.strokeStyle = c; ctx.lineWidth = stroke; ctx.stroke(); } else { ctx.fillStyle = c; ctx.fill(); }
    },
    t(s, x, y, sz, c, wt = 500, al = 'left') { ctx.fillStyle = c; ctx.font = wt + ' ' + sz + 'px ' + FONT; ctx.textAlign = al; ctx.textBaseline = 'alphabetic'; ctx.fillText(s, x, y); },
    c(x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); },
    arc(x, y, r, a0, a1, c, w, cap = 'round') { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = cap; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); },
    l(p, c, w) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); p.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); }
  };
}

/* all screens are drawn in a 360 x 240 space */
function shell(k, title, act) {
  k.r(0, 0, 360, 240, '#000');
  k.rr(2, 2, 356, 236, 7, UI.pan);
  k.r(2, 19, 356, 1, UI.ln);
  k.c(11, 11, 2.2, UI.bad); k.c(19, 11, 2.2, UI.a1); k.c(27, 11, 2.2, UI.ok);
  k.t(title, 180, 14, 8, UI.tx, 600, 'center');
  k.r(36, 20, 1, 218, UI.ln);
  for (let i = 0; i < 6; i++) k.rr(12, 30 + i * 22, 14, 14, 3, i === act ? UI.a1 : UI.pan2);
}

function scrWeb(k, t) {
  shell(k, 'Bookings', 0);
  k.t('This week', 46, 38, 11, UI.hi, 600); k.t('24 bookings', 350, 38, 8, UI.dim, 500, 'right');
  const x0 = 46, y0 = 48, cw = 60.8, rh = 22;
  for (let i = 0; i <= 5; i++) k.r(x0 + i * cw, y0, 1, 176, UI.ln);
  for (let j = 0; j <= 8; j++) k.r(x0, y0 + j * rh, 305, 1, UI.ln);
  const ev = [[0, 0, 2, UI.a2], [0, 4, 2, UI.a4], [1, 1, 3, UI.a1], [2, 0, 1, UI.a3], [2, 3, 3, UI.a2], [3, 2, 2, UI.ok], [4, 0, 2, UI.a4], [4, 5, 2, UI.a1], [1, 5, 2, UI.a3], [3, 5, 1, UI.a2]];
  ev.forEach((e, i) => {
    const dy = i === 4 ? Math.sin(t * 1.2) * 10 : 0, x = x0 + e[0] * cw + 4, y = y0 + e[1] * rh + 3 + dy, h = e[2] * rh - 5;
    k.ctx.globalAlpha = 0.34; k.rr(x, y, cw - 7, h, 3, e[3]); k.ctx.globalAlpha = 1;
    k.r(x, y, 2.5, h, e[3]); k.r(x + 7, y + 6, 26, 2.5, UI.hi); if (h > 22) k.r(x + 7, y + 12, 18, 2, UI.tx);
  });
  const ny = y0 + ((t * 8) % 176); k.r(x0, ny, 305, 1, UI.hi); k.c(x0, ny, 2.5, UI.hi);
}

function scrMobile(k, t) {
  k.r(0, 0, 360, 240, '#000');
  const px = 132, py = 8, pw = 96, ph = 224, a = (Math.sin(t * 0.9) + 1) / 2;
  k.rr(22 + a * 6, 60, 92, 34, 7, UI.pan2); k.c(36 + a * 6, 77, 6, UI.a3); k.r(48 + a * 6, 70, 52, 3, UI.hi); k.r(48 + a * 6, 79, 36, 3, UI.dim);
  k.rr(246 - a * 6, 128, 96, 40, 7, UI.pan2); k.t('Booked', 256 - a * 6, 144, 9, UI.ok, 600); k.r(256 - a * 6, 152, 60, 3, UI.tx);
  k.rr(250 + a * 4, 40, 70, 26, 7, UI.pan); k.r(260 + a * 4, 50, 40, 3, UI.dim); k.r(260 + a * 4, 57, 26, 3, UI.dim);
  k.rr(30 - a * 4, 150, 78, 30, 7, UI.pan); k.c(44 - a * 4, 165, 5, UI.a2); k.r(55 - a * 4, 160, 40, 3, UI.dim); k.r(55 - a * 4, 168, 24, 3, UI.dim);
  k.rr(px, py, pw, ph, 13, UI.pan); k.rr(px, py, pw, ph, 13, UI.tx, 1.5);
  k.rr(px + 34, py + 6, 28, 6, 3, '#000');
  k.t('Good morning', px + 10, py + 30, 7.5, UI.dim, 500); k.t('Tandem', px + 10, py + 45, 13, UI.hi, 600);
  k.rr(px + 8, py + 54, pw - 16, 54, 7, UI.a3);
  k.t('Next class', px + 15, py + 68, 7, '#000', 600); k.t('18:30', px + 15, py + 94, 21, '#000', 600);
  for (let i = 0; i < 3; i++) { const y = py + 116 + i * 26; k.rr(px + 8, y, pw - 16, 21, 5, UI.pan2); k.c(px + 19, y + 10.5, 5, [UI.a2, UI.a1, UI.a4][i]); k.r(px + 30, y + 7, 38 - i * 6, 3, UI.tx); k.r(px + 30, y + 13, 24, 2, UI.dim); }
  k.r(px + 8, py + ph - 26, pw - 16, 1, UI.ln);
  for (let i = 0; i < 4; i++) k.c(px + 20 + i * 19, py + ph - 14, 3.2, i === 0 ? UI.a3 : UI.dim);
}

function scrSystem(k, t) {
  shell(k, 'Operations', 2);
  [['Open jobs', '128', UI.hi], ['On site', '37', UI.a2], ['Overdue', '6', UI.bad]].forEach((d, i) => { const x = 46 + i * 72; k.rr(x, 26, 66, 34, 5, UI.pan2); k.t(d[0], x + 7, 38, 7, UI.dim, 500); k.t(d[1], x + 7, 54, 14, d[2], 600); });
  const rows = 8, y0 = 66, hl = Math.floor(t * 0.8) % rows;
  k.t('JOB', 48, y0 + 7, 6, UI.dim, 600); k.t('SITE', 92, y0 + 7, 6, UI.dim, 600); k.t('STATUS', 196, y0 + 7, 6, UI.dim, 600);
  for (let i = 0; i < rows; i++) {
    const y = y0 + 11 + i * 19;
    if (i === hl) k.rr(44, y, 214, 17, 3, UI.pan2);
    k.r(44, y + 18, 214, 1, UI.ln);
    k.r(48, y + 7, 26, 3, UI.tx); k.r(92, y + 7, 60 + ((i * 37) % 30), 3, UI.tx); k.c(170, y + 8.5, 4, [UI.a2, UI.a4, UI.a1, UI.a3][i % 4]);
    const st = (i * 3 + Math.floor(t * 0.3 + i * 0.37)) % 3; k.rr(196, y + 3, 38, 11, 5.5, [UI.ok, UI.a1, UI.bad][st]);
  }
  k.rr(264, 26, 86, 204, 6, UI.pan2); k.t('Job 2041', 272, 42, 9, UI.hi, 600); k.r(272, 50, 60, 3, UI.dim);
  for (let i = 0; i < 5; i++) k.r(272, 64 + i * 14, [64, 50, 58, 40, 54][i], 3, UI.tx);
  k.rr(272, 140, 70, 6, 3, UI.pan); k.rr(272, 140, 70 * (0.3 + 0.6 * ((Math.sin(t * 0.7) + 1) / 2)), 6, 3, UI.a2);
  k.rr(272, 200, 70, 20, 6, UI.a1); k.t('Assign', 307, 213.5, 8, '#000', 600, 'center');
}

function scrCRM(k, t) {
  shell(k, 'Pipeline', 3);
  const names = ['Lead', 'Qualified', 'Proposal', 'Won'], cols = [UI.dim, UI.a2, UI.a1, UI.ok], counts = [4, 3, 3, 2], cw = 74;
  for (let c = 0; c < 4; c++) {
    const x = 46 + c * 77; k.t(names[c], x + 2, 37, 8, UI.tx, 600); k.c(x + 68, 34, 2.5, cols[c]);
    k.rr(x, 42, cw, 188, 5, '#14161b');
    for (let i = 0; i < counts[c]; i++) {
      if (c === 1 && i === 0) continue;
      const y = 48 + i * 44; k.rr(x + 4, y, cw - 8, 38, 4, UI.pan2); k.r(x + 9, y + 7, 40, 3, UI.hi); k.r(x + 9, y + 14, 28, 3, UI.dim);
      k.t('£' + (8 + ((c * 7 + i * 5) % 30)) + 'k', x + 9, y + 31, 9, cols[c], 600);
    }
  }
  const ph = (t * 0.3) % 1, e = ss(0.2, 0.8, ph), mx = lerp(127, 204, e), my = lerp(48, 180, e) - Math.sin(e * Math.PI) * 24;
  k.rr(mx, my, cw - 8, 38, 4, UI.hi); k.r(mx + 5, my + 7, 40, 3, '#000'); k.r(mx + 5, my + 14, 28, 3, '#666'); k.t('£24k', mx + 5, my + 31, 9, '#000', 600);
}

function scrSales(k, t) {
  shell(k, 'Sales', 4);
  const g = 0.5 + 0.28 * ss(0, 1, (t * 0.25) % 1.6);
  k.rr(46, 26, 120, 120, 6, UI.pan2); k.t('Quarter target', 54, 40, 7, UI.dim, 500);
  k.arc(106, 90, 36, Math.PI * 0.75, Math.PI * 2.25, UI.ln, 8); k.arc(106, 90, 36, Math.PI * 0.75, Math.PI * (0.75 + 1.5 * g), UI.a1, 8);
  k.t(Math.round(g * 100) + '%', 106, 97, 22, UI.hi, 600, 'center'); k.t('of target', 106, 109, 7, UI.dim, 500, 'center');
  k.rr(172, 26, 178, 120, 6, UI.pan2); k.t('Leaderboard', 180, 40, 7, UI.dim, 500);
  ['Amara', 'Jonas', 'Priya', 'Lewis', 'Mei'].forEach((n, i) => {
    const y = 50 + i * 18, v = (0.95 - i * 0.15) * (0.6 + 0.4 * ss(0, 1, (t * 0.5 - i * 0.1) % 2));
    k.t(n, 180, y + 8, 8, UI.tx, 500); k.rr(216, y + 2, 96, 7, 3.5, UI.pan); k.rr(216, y + 2, 96 * v, 7, 3.5, i === 0 ? UI.a1 : UI.a2);
    k.t('£' + Math.round(v * 84) + 'k', 342, y + 8, 7, UI.hi, 600, 'right');
  });
  k.rr(46, 152, 304, 78, 6, UI.pan2); k.t('Forecast', 54, 166, 7, UI.dim, 500);
  for (let i = 0; i < 14; i++) { const h = 10 + (Math.sin(i * 0.9 + 1) * 0.5 + 0.5) * 26 + i * 1.6, hh = h * ss(0, 1, ((t * 0.6 - i * 0.03) % 3 + 3) % 3); k.rr(56 + i * 20.5, 222 - hh, 12, hh, 2, i > 9 ? UI.a1 : UI.dim); }
}

function scrData(k, t) {
  const ctx = k.ctx;
  shell(k, 'Analytics', 5);
  [['Revenue', '£1.28m', UI.hi], ['Orders', '18,204', UI.hi], ['Conversion', '4.7%', UI.ok], ['Churn', '1.2%', UI.a3]].forEach((d, i) => { const x = 46 + i * 77; k.rr(x, 26, 72, 36, 5, UI.pan2); k.t(d[0], x + 6, 37, 6.5, UI.dim, 500); k.t(d[1], x + 6, 54, 12, d[2], 600); });
  k.rr(46, 68, 222, 104, 6, UI.pan2);
  const p1 = [], p2 = [];
  for (let i = 0; i <= 44; i++) { const x = 54 + i * 4.7; p1.push([x, 150 - (Math.sin(i * 0.33 + t * 0.5) * 0.5 + 0.5) * 34 - i * 0.9 - Math.sin(i * 1.3) * 4]); p2.push([x, 160 - (Math.cos(i * 0.25 + t * 0.3) * 0.5 + 0.5) * 22 - i * 0.3]); }
  for (let j = 0; j < 4; j++) k.r(54, 84 + j * 24, 206, 1, UI.ln);
  ctx.fillStyle = 'rgba(53,224,255,0.2)'; ctx.beginPath(); ctx.moveTo(p1[0][0], 166); p1.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(p1[44][0], 166); ctx.fill();
  k.l(p2, UI.a4, 1.5); k.l(p1, UI.a2, 2);
  const ci = Math.floor(((Math.sin(t * 0.6) + 1) / 2) * 44), cp = p1[ci], tx = Math.min(cp[0] + 5, 222);
  k.r(cp[0], 76, 1, 90, UI.dim); k.c(cp[0], cp[1], 3, UI.hi);
  k.rr(tx, 78, 42, 16, 4, UI.hi); k.t('£' + (40 + ci) + 'k', tx + 21, 89.5, 8, '#000', 600, 'center');
  k.rr(274, 68, 76, 104, 6, UI.pan2); k.t('Channels', 281, 81, 6.5, UI.dim, 500);
  let a0 = -Math.PI / 2 + t * 0.2;
  [[0.42, UI.a2], [0.27, UI.a1], [0.19, UI.a4], [0.12, UI.a3]].forEach(d => { const a1 = a0 + d[0] * Math.PI * 2; k.arc(312, 116, 22, a0 + 0.05, a1 - 0.05, d[1], 9, 'butt'); a0 = a1; });
  for (let i = 0; i < 3; i++) { k.c(285, 156 + i * 5.5 - 5, 1.6, [UI.a2, UI.a1, UI.a4][i]); }
  k.rr(46, 178, 304, 52, 6, UI.pan2);
  for (let i = 0; i < 30; i++) { const h = 6 + (Math.sin(i * 0.7 + t * 0.8) * 0.5 + 0.5) * 30; k.rr(54 + i * 9.7, 224 - h, 6, h, 2, i % 7 === 3 ? UI.a1 : UI.ln); }
}
const SCREENS = [scrWeb, scrMobile, scrSystem, scrCRM, scrSales, scrData];

/* the wall: one canvas pixel per particle */
const WALL = { cv: null, ctx: null, k: null, tex: null, acc: 1, idx: 0, f: 0 };
function initWall() {
  WALL.cv = document.createElement('canvas'); WALL.cv.width = GRID.x; WALL.cv.height = GRID.y;
  WALL.ctx = WALL.cv.getContext('2d'); WALL.k = kit(WALL.ctx);
  if (!S.gl) return;
  WALL.tex = new THREE.CanvasTexture(WALL.cv);
  WALL.tex.minFilter = WALL.tex.magFilter = THREE.NearestFilter; WALL.tex.generateMipmaps = false;
  PU.uScreen.value = WALL.tex;
}
function drawWall() {
  const ctx = WALL.ctx, sx = GRID.x / 360, sy = GRID.y / 240, t = S.time;
  ctx.setTransform(sx, 0, 0, sy, 0, 0);
  SCREENS[WALL.idx](WALL.k, t);
  if (WALL.f > 0.001 && WALL.idx < 5) {      // wipe to the next screen
    const x = 360 * (1 - WALL.f);
    ctx.save(); ctx.beginPath(); ctx.rect(x, 0, 360 - x, 240); ctx.clip();
    SCREENS[WALL.idx + 1](WALL.k, t); ctx.restore();
    WALL.k.r(x - 1, 0, 2, 240, '#fff');
  }
  if (WALL.tex) WALL.tex.needsUpdate = true;
}
function updateWall(dt, active) {
  if (!active) return;
  WALL.acc += dt;
  if (WALL.acc > 0.085) { WALL.acc = 0; drawWall(); }
}
