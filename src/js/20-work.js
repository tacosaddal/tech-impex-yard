/* ============================================================
   CAPABILITIES + SAMPLE PROJECTS (edit the two lists below)
   ============================================================ */
const CAPS = [
  { d: '3D', c: '--c3', n: 'Game development', p: 'Gameplay, physics, multiplayer and live operations for PC, console, mobile and web. Prototype to launch, then the updates after.', t: ['Gameplay systems', 'Multiplayer', 'Shaders and VFX', 'Live ops'] },
  { d: 'XR', c: '--c4', n: 'Augmented reality', p: 'Product visualisers, try-before-you-buy, on-site overlays and guided training that stay anchored to the real world.', t: ['Product visualisers', 'Web AR', 'On-site overlays'] },
  { d: 'XR', c: '--c4', n: 'Virtual reality', p: 'Training simulators, virtual showrooms and immersive experiences for standalone and PC headsets.', t: ['Training simulators', 'Virtual showrooms', 'Headset apps'] },
  { d: 'XR', c: '--c4', n: 'Mixed reality', p: 'Spatial apps where interfaces leave the screen and work alongside your team in the room.', t: ['Spatial interfaces', 'Hand tracking', 'Passthrough'] },
  { d: '2D', c: '--c2', n: 'Internal management systems', p: 'One system for the whole operation: people, jobs, assets, compliance and reporting, with the permissions and audit trail to match.', t: ['Roles and permissions', 'Workflows', 'Audit trails', 'Integrations'] },
  { d: '2D', c: '--c2', n: 'CRM platforms', p: 'Every lead, conversation and deal in one pipeline, shaped around how your team sells instead of how a template thinks they should.', t: ['Pipelines', 'Client portals', 'Automation'] },
  { d: '2D', c: '--c2', n: 'Sales management systems', p: 'Targets, quotes, commissions and forecasts in one place, updated the moment a deal moves.', t: ['Targets', 'Quoting', 'Commission', 'Forecasting'] },
  { d: '2D', c: '--c2', n: 'Data analytics dashboards', p: 'Your numbers in real time, from every source, on one screen that people can actually read.', t: ['Real-time data', 'KPI design', 'Data pipelines'] },
  { d: '2D', c: '--c2', n: 'Web apps', p: 'Fast, secure platforms that scale from ten users to ten thousand without a rewrite.', t: ['Platforms', 'Portals', 'APIs'] },
  { d: '2D', c: '--c2', n: 'Mobile apps', p: 'iOS and Android from one codebase, with offline built in and the store submission handled.', t: ['iOS', 'Android', 'Offline sync'] }
];
const PROJ = [
  { t: 'Emberfall', k: 'Game development', y: '2025', cov: 'game', s: 'Co-op action RPG for PC and console', b: ['A four-player co-op campaign with drop-in matchmaking', 'A custom ability system designers can extend without code', 'Rollback netcode tuned for fast combat'] },
  { t: 'Roomline', k: 'Augmented reality', y: '2025', cov: 'ar', s: 'Furniture visualiser for a home retailer', b: ['A catalogue of true-to-scale 3D products', 'One-tap placement that works from a product page', 'Saved rooms shoppers can share'] },
  { t: 'Deepshift', k: 'Virtual reality', y: '2024', cov: 'vr', s: 'Safety training simulator for offshore crews', b: ['Twelve scored emergency scenarios', 'An instructor view that mirrors the headset live', 'Results that export to the training record'] },
  { t: 'Halo Room', k: 'Mixed reality', y: '2025', cov: 'mr', s: 'Spatial control room for a logistics operator', b: ['Live dashboards pinned to the walls of any room', 'Hand-tracked controls, no controllers needed', 'A shared session for remote teams'] },
  { t: 'Meridian', k: 'Internal management system', y: '2024', cov: 2, s: 'Operations platform for a facilities group', b: ['Jobs, assets and compliance in a single system', 'Role-based access with a full audit trail', 'A mobile app for engineers on site'] },
  { t: 'Kestrel', k: 'CRM platform', y: '2024', cov: 3, s: 'Pipeline and client portal for a brokerage', b: ['A pipeline shaped around the way the team sells', 'A client portal with document signing', 'Automated follow-ups and reminders'] },
  { t: 'Northstar', k: 'Sales management system', y: '2023', cov: 4, s: 'Targets and commission for a national sales team', b: ['Live targets by region, team and rep', 'Commission rules the finance team can edit', 'Forecasts that update as deals move'] },
  { t: 'Pulse Board', k: 'Data analytics dashboard', y: '2025', cov: 5, s: 'Real-time trading dashboards for an energy firm', b: ['Streaming data from six separate sources', 'Wall-screen and mobile layouts', 'Alerts when a number leaves its range'] },
  { t: 'Ledgerly', k: 'Web app', y: '2023', cov: 0, s: 'Scheduling and invoicing platform for clinics', b: ['Bookings, invoices and payments in one flow', 'A design system shared across three products', 'Zero-downtime releases'] },
  { t: 'Tandem', k: 'Mobile app', y: '2024', cov: 1, s: 'Class booking app for a fitness chain', b: ['One codebase for iOS and Android', 'Offline timetable with background sync', 'In-app payments and waiting lists'] }
];

/* ---------- cover art (160 x 200 space) ---------- */
function coverArt(k, type, t) {
  const ctx = k.ctx;
  k.r(0, 0, 160, 200, '#000');
  if (typeof type === 'number') {           // interface projects reuse the live screens, cropped
    ctx.save(); ctx.translate(-70, 0); ctx.scale(200 / 240, 200 / 240); SCREENS[type](k, t); ctx.restore(); return;
  }
  if (type === 'game') {
    const hz = 104;
    const g = ctx.createLinearGradient(0, 48, 0, hz); g.addColorStop(0, '#ffc83d'); g.addColorStop(1, '#ff3d7f');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(80, hz, 46, Math.PI, 0); ctx.fill();
    for (let i = 0; i < 5; i++) { const y = hz - 34 + i * 8 + ((t * 3) % 8); if (y < hz) k.r(30, y, 100, 1.5 + i * 0.6, '#000'); }
    ctx.fillStyle = '#0a0d14'; ctx.beginPath(); ctx.moveTo(0, hz);[[18, 78], [34, 92], [52, 70], [70, 96], [96, 84], [112, 66], [132, 90], [150, 76], [160, 88]].forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(160, hz); ctx.fill();
    k.r(0, hz, 160, 1.5, '#fff');
    ctx.strokeStyle = '#35e0ff'; ctx.lineWidth = 1;
    for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(80 + i * 4, hz); ctx.lineTo(80 + i * 46, 200); ctx.stroke(); }
    for (let j = 0; j < 9; j++) { const z = (j + (t * 0.8) % 1) / 9, y = hz + z * z * 96; k.r(0, y, 160, 1, '#35e0ff'); }
    const sx = 80 + Math.sin(t * 0.9) * 18; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(sx, 150); ctx.lineTo(sx - 9, 168); ctx.lineTo(sx, 163); ctx.lineTo(sx + 9, 168); ctx.fill();
  } else if (type === 'ar') {
    for (let j = 0; j < 9; j++) for (let i = 0; i < 13; i++) { const z = j / 8, y = 120 + z * z * 70, x = 80 + (i - 6) * (8 + z * 12); k.c(x, y, 0.9 + z * 0.9, '#6f6ab0'); }
    const cy = 96 + Math.sin(t * 1.3) * 4, c = '#a98bff';
    const P = [[80, cy - 34], [112, cy - 18], [112, cy + 18], [80, cy + 34], [48, cy + 18], [48, cy - 18]];
    ctx.fillStyle = 'rgba(169,139,255,.22)'; ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.fill();
    k.l(P.concat([P[0]]), c, 2); k.l([[80, cy], [80, cy + 34]], c, 2); k.l([[80, cy], [48, cy - 18]], c, 2); k.l([[80, cy], [112, cy - 18]], c, 2);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(80, 160, 34 + Math.sin(t * 2) * 3, 9, 0, 0, 6.2832); ctx.stroke();
    [[14, 14, 1, 1], [146, 14, -1, 1], [14, 186, 1, -1], [146, 186, -1, -1]].forEach(b => { k.r(b[0], b[1], 14 * b[2], 1.5, '#fff'); k.r(b[0], b[1], 1.5, 14 * b[3], '#fff'); });
    const sy = 30 + ((t * 30) % 150); k.r(14, sy, 132, 1, 'rgba(53,224,255,.8)');
  } else if (type === 'vr') {
    [54, 106].forEach((x, e) => {
      const g = ctx.createRadialGradient(x, 100, 4, x, 100, 40); g.addColorStop(0, '#1b2a6b'); g.addColorStop(1, '#05060f');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, 100, 40, 0, 6.2832); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(x, 100, 39, 0, 6.2832); ctx.clip();
      ctx.strokeStyle = '#35e0ff'; ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.ellipse(x + (e ? -3 : 3), 100, i * 9 + Math.sin(t + i) * 2, 40, 0, 0, 6.2832); ctx.stroke(); }
      for (let j = -3; j <= 3; j++) { ctx.beginPath(); ctx.ellipse(x, 100 + j * 12, 40, 5, 0, 0, 6.2832); ctx.stroke(); }
      const ox = x + Math.cos(t * 0.8) * 14 + (e ? -4 : 4); k.c(ox, 100 + Math.sin(t * 0.8) * 10, 5, '#ffc83d');
      ctx.restore();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, 100, 40, 0, 6.2832); ctx.stroke();
    });
    k.rr(20, 164, 120, 3, 1.5, '#a98bff');
  } else if (type === 'mr') {
    const c = '#8f8fd8';
    k.l([[28, 50], [132, 50], [132, 136], [28, 136], [28, 50]], c, 1); k.l([[0, 22], [28, 50]], c, 1); k.l([[160, 22], [132, 50]], c, 1); k.l([[0, 190], [28, 136]], c, 1); k.l([[160, 190], [132, 136]], c, 1);
    k.rr(46, 62, 68, 44, 3, '#35e0ff'); k.r(52, 70, 30, 3, '#000'); for (let i = 0; i < 6; i++) k.r(52 + i * 9, 98 - (6 + ((i * 7 + Math.floor(t * 2)) % 5) * 4), 6, 6 + ((i * 7 + Math.floor(t * 2)) % 5) * 4, '#000');
    ctx.fillStyle = '#ffc83d'; ctx.beginPath(); ctx.moveTo(4, 60); ctx.lineTo(22, 70); ctx.lineTo(22, 112); ctx.lineTo(4, 122); ctx.fill();
    ctx.fillStyle = '#a98bff'; ctx.beginPath(); ctx.moveTo(156, 60); ctx.lineTo(138, 70); ctx.lineTo(138, 112); ctx.lineTo(156, 122); ctx.fill();
    const by = 156 + Math.sin(t * 1.4) * 2; k.rr(64, by, 32, 4, 2, '#fff'); k.r(68, by + 4, 3, 18, '#fff'); k.r(89, by + 4, 3, 18, '#fff'); k.r(64, by - 22, 4, 22, '#fff');
    ctx.strokeStyle = '#59e39b'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(80, 184, 26, 6, 0, 0, 6.2832); ctx.stroke();
  }
}

const WORK = { vis: 0, cards: [], maxX: 0, x: 0, vel: 0, lastX: 0, acc: 0, tick: 0, sec: null, track: null, hover: -1 };
const MODAL = { on: false, i: -1, cv: null, ctx: null, acc: 0, last: null };

function initWork() {
  /* capabilities list */
  $('#caps').innerHTML = CAPS.map((c, i) => `<li class="cap" style="--k:var(${c.c})">
    <button type="button" class="cap__r" aria-expanded="false" aria-controls="capm${i}"><span class="cap__d mono">${c.d}</span><span class="cap__n">${c.n}</span><span class="cap__x" aria-hidden="true"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 1v12M1 7h12"/></svg></span></button>
    <div class="cap__m" id="capm${i}"><div><div class="cap__in"><p>${c.p}</p><ul class="tags mono">${c.t.map(t => `<li>${t}</li>`).join('')}</ul></div></div></div></li>`).join('');
  $$('.cap').forEach(li => $('.cap__r', li).addEventListener('click', () => {
    const open = !li.classList.contains('is-open');
    $$('.cap.is-open').forEach(o => { o.classList.remove('is-open'); $('.cap__r', o).setAttribute('aria-expanded', 'false'); });
    if (open) { li.classList.add('is-open'); $('.cap__r', li).setAttribute('aria-expanded', 'true'); }
    snd('tick'); setTimeout(layout, 650);
  }));

  /* project cards */
  WORK.sec = $('#work'); WORK.track = $('#track');
  WORK.track.innerHTML = PROJ.map((p, i) => `<button type="button" class="card" data-i="${i}" data-cursor="Open" aria-label="${p.t}: ${p.s}">
    <span class="card__c"><canvas width="160" height="200" aria-hidden="true"></canvas></span>
    <span class="card__k mono"><span>${p.k}</span><span>${p.y}</span></span>
    <span class="card__t">${p.t}</span><span class="card__s">${p.s}</span></button>`).join('');
  $$('.card', WORK.track).forEach((el, i) => {
    const cv = $('canvas', el), box = $('.card__c', el), c = { el, box, cv, k: kit(cv.getContext('2d')), hov: 0, th: 0, mx: 0.5, my: 0.5, mesh: null, tex: null };
    coverArt(c.k, PROJ[i].cov, 2 + i);
    if (S.gl) {
      c.tex = new THREE.CanvasTexture(cv); c.tex.minFilter = c.tex.magFilter = THREE.LinearFilter; c.tex.generateMipmaps = false;
      c.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 16, 1), new THREE.ShaderMaterial({
        uniforms: { tMap: { value: c.tex }, uCells: { value: new THREE.Vector2(64, 80) }, uM: { value: new THREE.Vector2(.5, .5) }, uHover: { value: 0 }, uTime: PU.uTime, uVel: { value: 0 }, uRad: { value: 0.022 }, uAsp: { value: 0.8 }, uA: { value: 1 } },
        vertexShader: GL_COVER_V, fragmentShader: GL_COVER_F, transparent: true, depthTest: false, depthWrite: false
      }));
      c.mesh.frustumCulled = false; uiScene.add(c.mesh);
    }
    el.addEventListener('pointerenter', () => { c.th = 1; });
    el.addEventListener('pointerleave', () => { c.th = 0; });
    el.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(); c.mx = (e.clientX - r.left) / r.width; c.my = 1 - (e.clientY - r.top) / r.height; });
    el.addEventListener('click', () => openCase(i));
    WORK.cards.push(c);
  });

  /* case panel */
  MODAL.cv = document.createElement('canvas'); MODAL.cv.width = 96; MODAL.cv.height = 60; MODAL.ctx = MODAL.cv.getContext('2d');
  $('#modalc').appendChild(MODAL.cv);
  $('#modalx').addEventListener('click', closeCase);
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeCase(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && MODAL.on) closeCase(); });
}

function openCase(i) {
  const p = PROJ[i]; if (!MODAL.on) lockScroll(true); MODAL.on = true; MODAL.i = i; MODAL.last = document.activeElement;
  $('#modal-k').textContent = p.k + ' · sample project';
  $('#modal-t').textContent = p.t;
  $('#modal-d').innerHTML = `<div><dt>Client</dt><dd>[Client name]</dd></div><div><dt>Year</dt><dd>${p.y}</dd></div><div><dt>Role</dt><dd>Design and build</dd></div>`;
  $('#modal-b').innerHTML = `<p><strong>${p.s}.</strong> This is placeholder copy for a sample project. Replace it with the real brief: who the client is, what they needed, and why they came to you.</p>
    <p><strong>What we built</strong></p><ul>${p.b.map(b => `<li>${b}</li>`).join('')}</ul>
    <p><strong>Result</strong><br>[Add one real, measurable result here.]</p>`;
  $('#modal').classList.add('is-on'); $('#modalp').scrollTop = 0; drawModal();
  setTimeout(() => $('#modalx').focus({ preventScroll: true }), 80); snd('whoosh');
}
function closeCase() { if (!MODAL.on) return; lockScroll(false); MODAL.on = false; $('#modal').classList.remove('is-on'); if (MODAL.last && MODAL.last.focus) MODAL.last.focus({ preventScroll: true }); snd('drop'); }
function drawModal() { const c = WORK.cards[MODAL.i]; if (!c) return; MODAL.ctx.imageSmoothingEnabled = true; MODAL.ctx.drawImage(c.cv, 0, 50, 160, 100, 0, 0, 96, 60); }

function sizeWork() {
  WORK.sec.style.height = '';
  WORK.maxX = Math.max(0, WORK.track.scrollWidth - S.w);
  WORK.sec.style.height = Math.round(($('#stage').offsetHeight || S.h) + WORK.maxX) + 'px';
}

function updateWork(dt) {
  const top = LAY.work, h = WORK.sec.offsetHeight, vh = LAY.vh;
  const near = S.sm > top - vh * 1.2 && S.sm < top + h + vh * 0.2;
  WORK.vis = near ? 1 : 0;
  if (!near) return;
  const p = WORK.maxX > 0 ? clamp((S.sm - top) / (h - vh)) : 0;
  WORK.x = -p * WORK.maxX;
  WORK.track.style.transform = 'translate3d(' + WORK.x.toFixed(2) + 'px,0,0)';
  const v = (WORK.x - WORK.lastX) / Math.max(dt, 0.001); WORK.lastX = WORK.x;
  WORK.vel = damp(WORK.vel, clamp(v / 1600, -1.6, 1.6), 8, dt);
  WORK.acc += dt; const redraw = WORK.acc > 0.12; if (redraw) WORK.acc = 0;
  WORK.cards.forEach((c, i) => {
    c.hov = damp(c.hov, c.th, 7, dt);
    const r = c.box.getBoundingClientRect(), on = r.right > -80 && r.left < S.w + 80 && r.bottom > -80 && r.top < S.h + 80;
    if (on && redraw && (i + WORK.tick) % 2 === 0) { coverArt(c.k, PROJ[i].cov, S.time + i * 3); if (c.tex) c.tex.needsUpdate = true; }
    if (!c.mesh) return;
    c.mesh.visible = on; if (!on) return;
    c.mesh.position.set(r.left + r.width / 2, -(r.top + r.height / 2), 0); c.mesh.scale.set(r.width, r.height, 1);
    const u = c.mesh.material.uniforms; u.uHover.value = c.hov; u.uVel.value = RM ? 0 : WORK.vel; u.uM.value.set(c.mx, c.my); u.uAsp.value = r.width / r.height; u.uA.value = MODAL.on ? 0.25 : 1;
  });
  if (redraw) WORK.tick++;
  if (MODAL.on) { MODAL.acc += dt; if (MODAL.acc > 0.12) { MODAL.acc = 0; drawModal(); } }
}
