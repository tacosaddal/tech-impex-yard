/* ============================================================
   YARD UI: cards, dock, manifest, sound, input
   ============================================================ */
const AU = { ctx: null, on: false, g: null };
function sndToggle() {
  if (!AU.ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; try { AU.ctx = new AC(); AU.g = AU.ctx.createGain(); AU.g.connect(AU.ctx.destination); } catch (e) { return; } }
  AU.on = !AU.on; if (AU.ctx.state === 'suspended') AU.ctx.resume(); AU.g.gain.value = AU.on ? 0.9 : 0;
  const b = $('#snd'); b.setAttribute('aria-pressed', AU.on); b.textContent = AU.on ? 'Sound on' : 'Sound off';
  if (AU.on) snd('place');
}
function blip(f, dur, vol, type, delay) {
  const c = AU.ctx, t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
  o.type = type || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(AU.g); o.start(t); o.stop(t + dur + 0.05);
}
function snd(n) {
  if (!AU.on) return;
  try {
    if (n === 'tick') blip(1100, 0.05, 0.05, 'square');
    else if (n === 'place') { blip(520, 0.14, 0.09, 'triangle'); blip(780, 0.22, 0.08, 'triangle', 0.07); }
    else if (n === 'win') [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => blip(f, 0.25, 0.09, 'triangle', i * 0.08));
    else if (n === 'horn') { blip(220, 0.25, 0.08, 'sawtooth'); blip(277, 0.25, 0.06, 'sawtooth'); }
  } catch (e) {}
}

const contactHTML = () => `<button class="mail" type="button" data-copy><b>hello@your-domain.com</b><small class="mono">Click to copy</small></button><p class="mono" style="color:var(--ink-2)">[Phone number] &nbsp;/&nbsp; [City], United Kingdom</p>`;

function yToast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('is-on'); Y.toastT = 2.4; }
function yCount() {
  const n = Y.visited.size; $('#cnt').textContent = n + ' / 10 bays';
  $$('#pips i').forEach((el, i) => { el.classList.toggle('is-on', Y.visited.has(i)); });
  $$('#dock button').forEach(el => { const i = +el.dataset.b; el.classList.toggle('is-v', Y.visited.has(i)); el.classList.toggle('is-a', i === Y.active); });
  Y.bays.forEach(b => b.el.classList.toggle('is-v', b.visited));
}
function showCard(i) {
  const el = $('#card');
  if (i < 0) { el.classList.remove('is-on'); return; }
  if (i === 10) {
    el.style.setProperty('--k', '#ffc21a');
    el.innerHTML = `<p class="card__k mono"><b>HQ</b> Gatehouse</p><h2 class="x">Got cargo?</h2><p class="card__p">Tell us what you need built. We reply within one working day.</p>${contactHTML()}`;
  } else {
    const c = CAPS[i], p = PROJ[i], all = Y.visited.size >= 10;
    el.style.setProperty('--k', BAYC[i]);
    el.innerHTML = `<p class="card__k mono"><b>Bay ${pad(i + 1, 2)}</b> ${BAYKIND[i]}</p><h2 class="x">${c.n}</h2><p class="card__p">${c.p}</p>
      <ul class="tags mono">${c.t.map(t => `<li>${t}</li>`).join('')}</ul>
      <div class="card__x"><small class="mono">Sample export</small><b>${p.t}</b><span>${p.s}</span></div>
      <div class="card__f"><button class="btn" type="button" data-next>${all ? 'Talk to us' : 'Next bay'} &rarr;</button><span class="mono">${Y.visited.size} / 10 logged</span></div>`;
  }
  el.scrollTop = 0; el.classList.add('is-on');
}
function yActive(i) {
  if (i >= 0 && i < 10 && !Y.visited.has(i)) {
    const b = Y.bays[i]; Y.visited.add(i); b.visited = true; b.ringMat.color.copy(lin(BAYC[i]));
    yToast('Bay ' + pad(i + 1, 2) + ' logged  /  ' + Y.visited.size + ' of 10'); snd(Y.visited.size >= 10 ? 'win' : 'place');
    if (Y.visited.size >= 10 && !Y.doneShown) { Y.doneShown = true; setTimeout(() => openSheet('done'), 1800); }
  } else if (i === 10) snd('horn');
  yCount(); showCard(i);
}
function nextBay() {
  if (Y.visited.size >= 10) { openSheet('done'); return; }
  let best = -1, bd = 1e9;
  Y.bays.forEach(b => { if (b.visited) return; const d = Math.hypot(b.x - Y.pos.x, b.z - Y.pos.z); if (d < bd) { bd = d; best = b.i; } });
  if (best >= 0) driveToBay(best);
}
function openSheet(id) { $('#' + id).classList.add('is-on'); const b = $('#' + id + ' [data-close]'); if (b) setTimeout(() => b.focus({ preventScroll: true }), 60); }
function closeSheets() { $$('.sheet').forEach(s => s.classList.remove('is-on')); }
function yStart() { if (Y.mode !== 'intro') return; Y.mode = 'play'; $('#intro').classList.add('is-off'); $('#app').classList.remove('is-intro'); snd('horn'); setTimeout(() => $('#hint').classList.add('is-off'), 9000); }

function yUI() {
  $$('[data-studio]').forEach(e => { e.textContent = STUDIO; });
  $('#pips').innerHTML = CAPS.map((c, i) => `<i style="--c:${BAYC[i]}"></i>`).join('');
  $('#dock').innerHTML = CAPS.map((c, i) => `<button type="button" data-b="${i}" style="--c:${BAYC[i]}" aria-label="Bay ${i + 1}: ${c.n}" title="${c.n}">${pad(i + 1, 2)}</button>`).join('') +
    `<button type="button" data-b="10" style="--c:#ffc21a" aria-label="Gatehouse: contact" title="Gatehouse">HQ</button>`;
  $('#labels').innerHTML = CAPS.map((c, i) => `<div class="lb mono is-off" style="--c:${BAYC[i]}"><b>${pad(i + 1, 2)}</b><span>${c.n}</span></div>`).join('');
  $$('#labels .lb').forEach((el, i) => { if (Y.bays[i]) Y.bays[i].el = el; });
  $('#listp').innerHTML = `<div class="row" style="justify-content:space-between"><p class="mono">${STUDIO} &nbsp;/&nbsp; what we ship</p><button class="btn btn--o" type="button" data-close>Close</button></div>
    <h2 class="x" id="list-h">The manifest</h2>
    <ol class="mf">${CAPS.map((c, i) => `<li><span class="mono">Bay ${pad(i + 1, 2)}</span><b>${c.n}</b><p>${c.p}<small>Sample export: <strong>${PROJ[i].t}</strong>, ${PROJ[i].s.charAt(0).toLowerCase() + PROJ[i].s.slice(1)}.</small></p></li>`).join('')}</ol>
    <div style="display:grid;gap:10px"><p class="mono">Start a project</p>${contactHTML()}</div>`;
  $('#donep').innerHTML = `<p class="mono">10 / 10 bays logged</p><h2 class="x" id="done-h">Yard cleared.</h2><p class="card__p">You have seen everything we ship. Now tell us what you need built.</p>${contactHTML()}<div class="row"><button class="btn btn--o" type="button" data-close>Keep driving</button></div>`;

  $('#go').addEventListener('click', () => { if (Y.ok) yStart(); else openSheet('list'); });
  $('#go2').addEventListener('click', () => openSheet('list'));
  $('#listb').addEventListener('click', () => { openSheet('list'); snd('tick'); });
  $('#snd').addEventListener('click', sndToggle);
  $('#home').addEventListener('click', () => { if (Y.ok) driveToBay(10); });
  $('#dock').addEventListener('click', e => { const b = e.target.closest('[data-b]'); if (b && Y.ok) { driveToBay(+b.dataset.b); snd('tick'); } });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-close]') || e.target.classList.contains('sheet')) closeSheets();
    if (e.target.closest('[data-next]')) nextBay();
    const m = e.target.closest('[data-copy]');
    if (m) {
      const b = $('b', m), sm = $('small', m), ok = () => { sm.textContent = 'Copied'; setTimeout(() => { sm.textContent = 'Click to copy'; }, 1800); };
      const fb = () => { const r = document.createRange(); r.selectNodeContents(b); const s = getSelection(); s.removeAllRanges(); s.addRange(r); sm.textContent = 'Selected. Press Ctrl or Cmd + C'; };
      try { navigator.clipboard.writeText(b.textContent).then(ok, fb); } catch (err) { fb(); }
    }
  });

  const KEY = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSheets(); return; }
    const k = KEY[e.key]; if (!k || e.metaKey || e.ctrlKey || $('.sheet.is-on') || !Y.ok) return;
    Y.keys[k] = true; if (Y.mode === 'intro') yStart(); if (e.key.startsWith('Arrow')) e.preventDefault();
  });
  window.addEventListener('keyup', e => { const k = KEY[e.key]; if (k) Y.keys[k] = false; });
  window.addEventListener('blur', () => { Y.keys = {}; });

  const cv = $('#gl');
  const go = e => {
    const p = groundAt(e.clientX, e.clientY); if (!p) return;
    const b = Y.bays.find(q => Math.hypot(q.x - p.x, q.z - p.z) < 5.6);
    if (b) driveToBay(b.i); else driveTo(p, false);
  };
  cv.addEventListener('pointerdown', e => { if (!Y.ok) return; Y.ptr = true; try { cv.setPointerCapture(e.pointerId); } catch (err) {} go(e); });
  cv.addEventListener('pointermove', e => { if (Y.ptr && Y.mode === 'play') { const p = groundAt(e.clientX, e.clientY); if (p) driveTo(p, false); } });
  const up = () => { Y.ptr = false; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', e => { e.preventDefault(); Y.zoom = clamp(Y.zoom * (e.deltaY > 0 ? 1.1 : 0.9), 0.55, 1.8); }, { passive: false });
}

function yBoot() {
  Y.ok = initYard();
  document.documentElement.classList.toggle('no-gl', !Y.ok);
  yUI(); yResize();
  if (Y.ok) {
    Y.fork.position.set(Y.pos.x, 0, Y.pos.z); Y.fork.rotation.y = Y.head; Y.lift.position.y = Y.forkY;
    yCount();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { paintDecals(); });
  } else { $('#go').textContent = 'Open the manifest'; }
  window.addEventListener('resize', yResize);
  if (DBG) { window.__S = S; window.__Y = Y; S.ready = true; }
  requestAnimationFrame(yFrame);
}
yBoot();
