/* ============================================================
   THE YARD: a container yard you drive around.
   Ten bays, one per capability (text comes from CAPS and PROJ).
   ============================================================ */
const YC = { white: '#F3F5F7', grey: '#C5CDD5', mid: '#8B96A1', dark: '#1C1F23', orange: '#FF5A1F', yellow: '#FFC21A', cobalt: '#2447FF', green: '#12A866', magenta: '#E23D9B', cyan: '#16B8D9', violet: '#7A5CFF', ground: '#E4E9ED', road: '#2B2F35' };
const BAYC = ['#FF5A1F', '#7A5CFF', '#2447FF', '#E23D9B', '#12A866', '#16B8D9', '#FFC21A', '#FF5A1F', '#2447FF', '#12A866'];
const BAYSRC = ['game', 'ar', 'vr', 'mr', 2, 3, 4, 5, 0, 1];          // what each bay's screen shows
const BAYKIND = CAPS.map(c => (c.d === '3D' ? 'Games' : c.d === 'XR' ? 'Spatial' : 'Interfaces'));
const Y = {
  ok: false, t: 0, camA: 0.785, mode: 'intro', bays: [], obst: [], visited: new Set(), active: -1, keys: {}, target: null, auto: false, ptr: false,
  zoom: 1, dist: 170, orb: 0.5, lx: 0, lz: -5, shift: 0, shiftY: 0, vel: { x: 0, z: 0 }, pos: { x: 3.5, z: 9 }, head: 2.6, forkY: 0.45,
  fork: null, lift: null, wheels: [], anims: [], marker: null, acc: 0, toastT: 0, doneShown: false
};
let ren, scene, cam, GB, yRay, yNdc, yV3;
const MATS = {};
const lin = hex => new THREE.Color(hex).convertSRGBToLinear();
const M = (hex, o) => { const k = hex + (o ? JSON.stringify(o) : ''); return MATS[k] || (MATS[k] = new THREE.MeshLambertMaterial(Object.assign({ color: lin(hex) }, o))); };
function bx(p, w, h, d, m, x, y, z, ry) { const o = new THREE.Mesh(GB, m); o.scale.set(w, h, d); o.position.set(x, y, z); if (ry) o.rotation.y = ry; o.castShadow = true; o.receiveShadow = true; p.add(o); return o; }
function cy(p, rt, rb, h, m, x, y, z, seg) { const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 20), m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; p.add(o); return o; }
function sp(p, r, m, x, y, z) { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), m); o.position.set(x, y, z); o.castShadow = true; p.add(o); return o; }
function flat(p, geo, m, y, x, z) { const o = new THREE.Mesh(geo, m); o.rotation.x = -Math.PI / 2; o.position.set(x || 0, y, z || 0); o.receiveShadow = true; p.add(o); return o; }
function yScreen(p, cv, w, h, x, y, z) {
  const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
  const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t })); o.position.set(x, y, z); p.add(o); return t;
}
const wire = (geo, hex) => new THREE.LineSegments(new THREE.EdgesGeometry(geo, 1), new THREE.LineBasicMaterial({ color: lin(hex) }));

/* one signature model per bay. Each returns an optional animation function. */
const MODELS = [
  (p, A) => {                                              // game development: arcade cabinet
    bx(p, 1.5, 2.7, 1.3, A, 0, 1.35, 0); bx(p, 1.64, 0.42, 1.42, M(YC.white), 0, 2.92, 0);
    bx(p, 1.25, 0.95, 0.08, M(YC.dark), 0, 2.02, 0.68).rotation.x = -0.22; bx(p, 1.5, 0.26, 0.6, M(YC.dark), 0, 1.32, 0.86);
    cy(p, 0.03, 0.03, 0.3, M(YC.white), -0.3, 1.58, 0.9, 8); sp(p, 0.09, M(YC.yellow), -0.3, 1.76, 0.9); sp(p, 0.07, M(YC.cobalt), 0.25, 1.48, 0.92); sp(p, 0.07, M(YC.yellow), 0.45, 1.48, 0.92);
    const coin = cy(p, 0.34, 0.34, 0.08, M(YC.yellow), 0, 3.95, 0, 24); coin.rotation.x = Math.PI / 2;
    return t => { coin.rotation.z = t * 2; coin.position.y = 3.95 + Math.sin(t * 2) * 0.15; };
  },
  (p, A) => {                                              // AR: an object hovering over a marker
    cy(p, 1.15, 1.25, 0.3, M(YC.white), 0, 0.15, 0, 32);
    const h = new THREE.Group(); h.position.set(0, 1.8, 0); p.add(h);
    h.add(wire(new THREE.BoxGeometry(1.35, 1.35, 1.35), YC.dark));
    h.add(new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.35, 1.35), new THREE.MeshLambertMaterial({ color: A.color, transparent: true, opacity: 0.25, depthWrite: false })));
    const inner = bx(h, 0.56, 0.56, 0.56, A, 0, 0, 0);
    cy(p, 0.04, 0.04, 1.3, M(YC.dark), 1.75, 0.65, 0.9, 8); bx(p, 0.5, 0.9, 0.06, M(YC.dark), 1.75, 1.5, 0.9).rotation.y = -0.9;
    return t => { h.rotation.y = t * 0.6; h.position.y = 1.8 + Math.sin(t * 1.4) * 0.12; inner.rotation.x = t; };
  },
  (p, A) => {                                              // VR: headset under a wire dome
    cy(p, 0.6, 0.7, 0.12, M(YC.dark), 0, 0.06, 0, 24); cy(p, 0.09, 0.09, 1.5, M(YC.dark), 0, 0.8, 0, 10);
    const h = new THREE.Group(); h.position.set(0, 1.95, 0); p.add(h);
    bx(h, 1.3, 0.66, 0.62, A, 0, 0, 0.12); bx(h, 1.1, 0.5, 0.1, M(YC.dark), 0, 0, 0.45);
    const st = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 8, 28, Math.PI), M(YC.dark)); st.rotation.x = -Math.PI / 2; st.castShadow = true; h.add(st);
    const dome = wire(new THREE.SphereGeometry(2.4, 12, 6, 0, 6.2832, 0, Math.PI / 2), YC.mid); p.add(dome);
    return t => { h.position.y = 1.95 + Math.sin(t * 1.3) * 0.08; h.rotation.y = Math.sin(t * 0.5) * 0.5; dome.rotation.y = t * 0.1; };
  },
  (p, A) => {                                              // mixed reality: panels floating round a desk
    bx(p, 0.9, 0.75, 0.9, M(YC.white), 0, 0.375, 0); sp(p, 0.22, A, 0, 1.0, 0);
    const ps = [[-1.5, 0.55], [0, 0], [1.5, -0.55]].map((d, k) => {
      const g = new THREE.Group(); g.position.set(d[0], 1.95, k === 1 ? -0.35 : 0.1); g.rotation.y = d[1]; p.add(g);
      bx(g, 1.35, 0.9, 0.05, k === 1 ? A : M(YC.white), 0, 0, 0); bx(g, 1.1, 0.12, 0.06, M(YC.dark), 0, 0.25, 0.01); bx(g, 0.7, 0.08, 0.06, M(YC.grey), -0.2, 0.02, 0.01); bx(g, 0.9, 0.08, 0.06, M(YC.grey), -0.1, -0.18, 0.01);
      return g;
    });
    return t => ps.forEach((g, k) => { g.position.y = 1.95 + Math.sin(t * 1.2 + k * 1.3) * 0.12; });
  },
  (p, A) => {                                              // internal management systems: control tower
    cy(p, 0.85, 1.05, 3.2, M(YC.white), 0, 1.6, 0, 24); cy(p, 1.5, 1.15, 0.95, M(YC.dark), 0, 3.65, 0, 24); cy(p, 1.53, 1.42, 0.22, A, 0, 3.72, 0, 24);
    cy(p, 1.65, 1.65, 0.16, M(YC.white), 0, 4.2, 0, 24); cy(p, 0.04, 0.04, 1.5, M(YC.dark), 0, 5.0, 0, 6); bx(p, 0.5, 0.9, 0.1, M(YC.dark), 0, 0.45, 1.0);
    const l = sp(p, 0.13, A, 0, 5.8, 0);
    return t => { l.scale.setScalar(Math.sin(t * 4) > 0.5 ? 1.6 : 1); };
  },
  (p, A) => {                                              // CRM: leads drop through a funnel
    const f = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.34, 1.5, 28, 1, true), new THREE.MeshLambertMaterial({ color: A.color, side: THREE.DoubleSide })); f.position.y = 2.55; f.castShadow = true; p.add(f);
    cy(p, 0.34, 0.34, 0.9, M(YC.dark), 0, 1.35, 0, 16); bx(p, 1.7, 0.25, 1.2, M(YC.white), 0, 0.5, 0);
    [[-1, -0.6], [1, -0.6], [0, 1]].forEach(d => cy(p, 0.05, 0.05, 2.6, M(YC.dark), d[0] * 1.25, 1.3, d[1] * 1.25, 6));
    const balls = []; for (let k = 0; k < 7; k++) balls.push(sp(p, 0.16, M([YC.yellow, YC.white, YC.cobalt, YC.orange][k % 4]), 0, 0, 0));
    return t => balls.forEach((b, k) => {
      const u = (t * 0.3 + k / 7) % 1;
      if (u < 0.55) { const v = u / 0.55, r = 1.25 * (1 - v) + 0.12, a = v * 9 + k; b.position.set(Math.cos(a) * r, 3.2 - v * 1.3, Math.sin(a) * r); }
      else if (u < 0.75) { b.position.set(0, 1.9 - (u - 0.55) / 0.2 * 1.2, 0); }
      else { const v = (u - 0.75) / 0.25; b.position.set((k % 3 - 1) * 0.5 * v, 0.78, 0.1 + v * 0.3); }
    });
  },
  (p, A) => {                                              // sales management: the chart that goes up
    bx(p, 3.0, 0.3, 1.5, M(YC.white), 0, 0.15, 0);
    const bars = [0.9, 1.4, 2.0, 2.8].map((h, k) => { const b = bx(p, 0.5, h, 0.5, k === 3 ? A : M(YC.dark), -1.05 + k * 0.7, 0.3 + h / 2, 0); b.userData.h = h; return b; });
    const ar = new THREE.Group(); ar.position.set(-0.1, 2.95, 0.5); ar.rotation.z = 0.62; p.add(ar); bx(ar, 3.0, 0.1, 0.1, A, 0, 0, 0);
    const hd = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 12), A); hd.position.set(1.6, 0, 0); hd.rotation.z = -Math.PI / 2; hd.castShadow = true; ar.add(hd);
    return t => bars.forEach((b, k) => { const s = 0.85 + 0.15 * Math.sin(t * 1.5 + k); b.scale.y = b.userData.h * s; b.position.y = 0.3 + b.userData.h * s / 2; });
  },
  (p, A) => {                                              // data analytics: a dish that listens to everything
    bx(p, 1.3, 0.6, 1.3, M(YC.dark), 0, 0.3, 0); cy(p, 0.14, 0.18, 1.5, M(YC.white), 0, 1.35, 0, 12);
    const tt = new THREE.Group(); tt.position.set(0, 2.25, 0); p.add(tt); const d = new THREE.Group(); d.rotation.x = 0.85; tt.add(d);
    const pts = []; for (let k = 0; k <= 10; k++) { const r = k / 10 * 1.45; pts.push(new THREE.Vector2(r, 0.26 * r * r)); }
    const bowl = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), new THREE.MeshLambertMaterial({ color: lin(YC.white), side: THREE.DoubleSide })); bowl.castShadow = true; d.add(bowl);
    cy(d, 0.03, 0.03, 1.1, M(YC.dark), 0, 0.6, 0, 6); sp(d, 0.13, A, 0, 1.15, 0);
    return t => { tt.rotation.y = t * 0.4; };
  },
  (p, A) => {                                              // web apps: the world, wired
    cy(p, 0.7, 0.85, 0.25, M(YC.white), 0, 0.125, 0, 24); cy(p, 0.07, 0.07, 0.9, M(YC.dark), 0, 0.7, 0, 8);
    const g = new THREE.Group(); g.position.y = 2.25; p.add(g);
    const s = new THREE.Mesh(new THREE.SphereGeometry(1.15, 24, 16), A); s.castShadow = true; g.add(s); g.add(wire(new THREE.SphereGeometry(1.17, 12, 8), '#FFFFFF'));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.05, 8, 48), M(YC.dark)); ring.rotation.x = 1.2; g.add(ring); const sat = sp(g, 0.14, M(YC.yellow), 1.7, 0, 0);
    return t => { s.rotation.y = t * 0.35; const u = t * 1.1; sat.position.set(Math.cos(u) * 1.7, Math.sin(u) * 1.7 * Math.cos(1.2), Math.sin(u) * 1.7 * Math.sin(1.2)); };
  },
  (p, A, bay) => {                                         // mobile apps: a very large phone
    bx(p, 1.2, 0.25, 0.8, M(YC.white), 0, 0.125, 0);
    const ph = new THREE.Group(); ph.position.set(0, 2.0, 0); ph.rotation.x = -0.12; p.add(ph); bx(ph, 1.55, 3.1, 0.2, M(YC.dark), 0, 0, 0);
    const cv = document.createElement('canvas'); cv.width = 192; cv.height = 448; const ctx = cv.getContext('2d'), k = kit(ctx);
    const draw = t => { ctx.setTransform(2, 0, 0, 2, -264, -16); SCREENS[1](k, t); };
    draw(2); const tex = yScreen(ph, cv, 1.38, 2.95, 0, 0, 0.105); bay.extra = t => { draw(t); tex.needsUpdate = true; };
    return t => { ph.rotation.y = Math.sin(t * 0.6) * 0.25; };
  }
];

function buildYard() {
  GB = new THREE.BoxGeometry(1, 1, 1);
  const g = new THREE.Group(); scene.add(g);
  bx(g, 70, 2, 86, M(YC.ground), 0, -1, -7).castShadow = false; bx(g, 71, 0.6, 87, M(YC.mid), 0, -2.3, -7).castShadow = false;
  flat(g, new THREE.RingGeometry(15.2, 18.8, 96), M(YC.road), 0.02);
  flat(g, new THREE.PlaneGeometry(3.2, 30.6), M(YC.road), 0.02); flat(g, new THREE.PlaneGeometry(30.6, 3.2), M(YC.road), 0.021); flat(g, new THREE.CircleGeometry(5.4, 48), M(YC.road), 0.022);
  for (let i = 0; i < 44; i++) { const a = i / 44 * 6.2832; bx(g, 1.1, 0.02, 0.16, M(YC.white), Math.cos(a) * 17, 0.04, Math.sin(a) * 17, -a - Math.PI / 2).castShadow = false; }

  /* gatehouse */
  const hq = new THREE.Group(); g.add(hq);
  bx(hq, 2.8, 2.2, 2.8, M(YC.white), 0, 1.1, 0); bx(hq, 2.84, 0.7, 1.7, M(YC.dark), 0, 1.45, 0); bx(hq, 1.7, 0.7, 2.84, M(YC.dark), 0, 1.45, 0); bx(hq, 3.4, 0.25, 3.4, M(YC.orange), 0, 2.33, 0);
  cy(hq, 0.05, 0.05, 5.2, M(YC.dark), 1.25, 2.6, 1.25, 6); const flag = bx(hq, 1.7, 0.95, 0.04, M(YC.orange), 2.12, 4.6, 1.25);
  Y.anims.push(t => { flag.rotation.y = Math.sin(t * 2.2) * 0.18; });
  Y.obst.push({ x: 0, z: 0, r: 2.5 });
  [[4.2, 3.4], [-3.8, 4.6], [5.1, -2.9], [-4.6, -3.7]].forEach(c => { const o = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.72, 12), M(YC.orange)); o.position.set(c[0], 0.36, c[1]); o.castShadow = true; g.add(o); });

  /* gantry crane and stacks on the quay */
  const cr = new THREE.Group(); cr.position.set(0, 0, -41); g.add(cr);
  [-14, 14].forEach(x => { bx(cr, 0.9, 13, 0.9, M(YC.orange), x, 6.5, -3.4); bx(cr, 0.9, 13, 0.9, M(YC.orange), x, 6.5, 3.4); bx(cr, 1.1, 0.9, 8.6, M(YC.orange), x, 12.6, 0); bx(cr, 1.3, 0.5, 9.4, M(YC.dark), x, 0.25, 0); });
  bx(cr, 33, 1.3, 1.5, M(YC.orange), 0, 13.6, 0);
  const tr = new THREE.Group(); cr.add(tr); bx(tr, 2, 0.8, 2.2, M(YC.dark), 0, 12.6, 0); bx(tr, 0.07, 5, 0.07, M(YC.dark), -2.6, 9.7, 0); bx(tr, 0.07, 5, 0.07, M(YC.dark), 2.6, 9.7, 0); bx(tr, 6.2, 2.7, 2.5, M(YC.cobalt), 0, 5.9, 0);
  Y.anims.push(t => { tr.position.x = Math.sin(t * 0.22) * 8; });
  const sc = [YC.orange, YC.cobalt, YC.yellow, YC.green, YC.white, YC.magenta, YC.cyan, YC.dark, YC.violet];
  let n = 0; [-44.5, -37.5].forEach(z => { for (let x = -10; x <= 10; x += 6.7) { const hgt = 1 + ((n * 7 + 3) % 3); for (let k = 0; k < hgt; k++) bx(g, 6.2, 2.7, 2.5, M(sc[(n + k * 2) % sc.length]), x, 1.35 + k * 2.72, z); n++; } });
  [[-30, 30], [30, 30], [-30, -30], [30, -30]].forEach(c => { cy(g, 0.12, 0.16, 9, M(YC.dark), c[0], 4.5, c[1], 8); bx(g, 1.6, 0.18, 0.5, M(YC.white), c[0] - Math.sign(c[0]) * 0.6, 9, c[1]); });

  /* bays: every bay faces the camera, so its model and screen are always readable */
  const TH = Math.PI / 4, cT = Math.cos(TH), sT = Math.sin(TH);
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i + 0.5) * 0.62832, x = Math.cos(a) * 25, z = Math.sin(a) * 25;
    const b = { i, x, z, visited: false }, B = new THREE.Group(); B.position.set(x, 0, z); B.rotation.y = TH; g.add(B);
    const w = (lx, lz) => ({ x: x + lx * cT + lz * sT, z: z - lx * sT + lz * cT });
    bx(g, 3, 0.02, 2.4, M(YC.road), Math.cos(a) * 19.7, 0.02, Math.sin(a) * 19.7, Math.PI / 2 - a).castShadow = false;
    flat(B, new THREE.CircleGeometry(4.8, 48), M('#FFFFFF'), 0.03);
    b.ringMat = new THREE.MeshLambertMaterial({ color: lin(YC.grey) }); flat(B, new THREE.RingGeometry(4.8, 5.3, 64), b.ringMat, 0.035);
    /* painted bay number */
    b.dc = document.createElement('canvas'); b.dc.width = b.dc.height = 512;
    b.dt = new THREE.CanvasTexture(b.dc); b.dt.encoding = THREE.sRGBEncoding;
    flat(B, new THREE.PlaneGeometry(2.7, 2.7), new THREE.MeshLambertMaterial({ map: b.dt, transparent: true, depthWrite: false }), 0.05, -2.3, 2.7);
    /* container at the back with the screen on top */
    const A = M(BAYC[i]);
    bx(B, 6.2, 2.7, 2.5, A, 0.3, 1.35, -2.6);
    for (let k = 0; k < 10; k++) bx(B, 0.14, 2.46, 0.07, A, -2.4 + k * 0.6, 1.35, -1.32);
    bx(B, 6.3, 0.14, 2.6, M(YC.dark), 0.3, 2.74, -2.6);
    const port = typeof BAYSRC[i] === 'string', cw = port ? 1.9 : 3.3, chh = port ? 2.375 : 2.2;
    b.cv = document.createElement('canvas'); b.cv.width = port ? 320 : 720; b.cv.height = port ? 400 : 480;
    const ctx = b.cv.getContext('2d'); b.k = kit(ctx);
    b.draw = t => { ctx.setTransform(2, 0, 0, 2, 0, 0); if (port) coverArt(b.k, BAYSRC[i], t); else SCREENS[BAYSRC[i]](b.k, t); b.tex.needsUpdate = true; };
    bx(B, cw + 0.24, chh + 0.24, 0.16, M(YC.dark), 0.3, 2.86 + chh / 2 + 0.12, -2.6); cy(B, 0.07, 0.07, 0.3, M(YC.dark), 0.3 - cw / 3, 2.9, -2.6, 6); cy(B, 0.07, 0.07, 0.3, M(YC.dark), 0.3 + cw / 3, 2.9, -2.6, 6);
    b.tex = yScreen(B, b.cv, cw, chh, 0.3, 2.86 + chh / 2 + 0.12, -2.51); b.draw(2 + i);
    const mg = new THREE.Group(); mg.position.set(-0.4, 0, 0.9); B.add(mg);
    const an = MODELS[i](mg, A, b); if (an) Y.anims.push(an);
    const ob = w(0, -0.9); Y.obst.push({ x: ob.x, z: ob.z, r: 3.2 });
    b.ap = w(3.3, 2.7); const lb = w(0.3, -2.6); b.lab = new THREE.Vector3(lb.x, 6.6, lb.z);
    Y.bays.push(b);
  }

  /* forklift */
  const F = new THREE.Group(), O = M(YC.orange), D = M(YC.dark);
  bx(F, 1.3, 0.5, 2.0, O, 0, 0.6, 0); bx(F, 1.3, 0.55, 0.6, D, 0, 1.0, -0.72); bx(F, 0.5, 0.3, 0.5, D, 0, 1.0, -0.1);
  [[-0.58, -0.78], [0.58, -0.78], [-0.58, 0.4], [0.58, 0.4]].forEach(c => bx(F, 0.08, 1.2, 0.08, D, c[0], 1.45, c[1]));
  bx(F, 1.34, 0.08, 1.36, D, 0, 2.08, -0.19); sp(F, 0.1, M(YC.yellow), 0, 2.2, -0.19);
  bx(F, 0.1, 2.4, 0.1, D, -0.4, 1.5, 1.06); bx(F, 0.1, 2.4, 0.1, D, 0.4, 1.5, 1.06); bx(F, 0.9, 0.08, 0.08, D, 0, 2.7, 1.06);
  const lift = new THREE.Group(); F.add(lift);
  bx(lift, 1.0, 0.5, 0.06, D, 0, 0.1, 1.14); bx(lift, 0.12, 0.06, 1.1, M(YC.grey), -0.3, -0.12, 1.7); bx(lift, 0.12, 0.06, 1.1, M(YC.grey), 0.3, -0.12, 1.7);
  bx(lift, 0.8, 0.7, 0.8, M(YC.white), 0, 0.27, 1.75); bx(lift, 0.82, 0.16, 0.82, O, 0, 0.27, 1.75);
  [[-0.72, -0.62], [0.72, -0.62], [-0.72, 0.68], [0.72, 0.68]].forEach(c => { const wl = cy(F, 0.34, 0.34, 0.26, D, c[0], 0.34, c[1], 18); wl.rotation.z = Math.PI / 2; Y.wheels.push(wl); });
  F.scale.setScalar(1.15); scene.add(F); Y.fork = F; Y.lift = lift;

  Y.marker = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.75, 40), new THREE.MeshBasicMaterial({ color: lin(YC.orange), transparent: true, opacity: 0.9 }));
  Y.marker.rotation.x = -Math.PI / 2; Y.marker.position.y = 0.07; Y.marker.visible = false; scene.add(Y.marker);
}

function paintDecals() {
  Y.bays.forEach(b => {
    const c = b.dc.getContext('2d'); c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 256, 256);
    c.fillStyle = 'rgba(28,31,35,0.86)'; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    c.font = '800 150px Archivo, "Arial Black", Arial, sans-serif'; c.fillText(pad(b.i + 1, 2), 128, 170);
    c.font = '500 19px "DM Mono", monospace'; c.fillText(BAYKIND[b.i].toUpperCase(), 128, 212);
    b.dt.needsUpdate = true;
  });
}

function initYard() {
  if (!window.THREE) return false;
  const canvas = $('#gl');
  try { ren = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' }); } catch (e) { return false; }
  ren.outputEncoding = THREE.sRGBEncoding; ren.shadowMap.enabled = true; ren.shadowMap.type = THREE.PCFSoftShadowMap; ren.setClearColor(0xdce4ea, 1);
  scene = new THREE.Scene(); scene.fog = new THREE.Fog(lin('#DCE4EA'), 330, 680);
  cam = new THREE.PerspectiveCamera(26, 1.6, 2, 700);
  scene.add(new THREE.HemisphereLight(0xe6eef8, 0xb8b2a6, 0.46));
  const sun = new THREE.DirectionalLight(0xfff0dc, 0.66); sun.position.set(40, 62, 20); sun.target.position.set(0, 0, -7); sun.castShadow = true;
  const sz = TOUCH ? 1024 : 2048; sun.shadow.mapSize.set(sz, sz);
  const sc = sun.shadow.camera; sc.left = -58; sc.right = 58; sc.top = 60; sc.bottom = -60; sc.near = 10; sc.far = 190; sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.04;
  scene.add(sun); scene.add(sun.target);
  yRay = new THREE.Raycaster(); yNdc = new THREE.Vector2(); yV3 = new THREE.Vector3();
  buildYard(); paintDecals();
  return true;
}

function yResize() {
  const cv = $('#gl'); S.w = cv.clientWidth || innerWidth; S.h = cv.clientHeight || innerHeight;
  if (!Y.ok) return;
  ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, (DBG && DBG.dpr) || (TOUCH ? 1.5 : 2))); ren.setSize(S.w, S.h, false);
  cam.aspect = S.w / S.h; cam.updateProjectionMatrix();
}

/* where on the ground is the pointer? */
function groundAt(cx, cy2) {
  const r = $('#gl').getBoundingClientRect();
  yNdc.set((cx - r.left) / r.width * 2 - 1, -((cy2 - r.top) / r.height * 2 - 1)); yRay.setFromCamera(yNdc, cam);
  const o = yRay.ray.origin, d = yRay.ray.direction; if (d.y > -0.01) return null;
  const t = -o.y / d.y; return { x: clamp(o.x + d.x * t, -32, 32), z: clamp(o.z + d.z * t, -31, 34) };
}
function driveTo(p, auto) { Y.target = { x: p.x, z: p.z }; Y.auto = !!auto; if (Y.mode === 'intro') yStart(); }
function driveToBay(i) { if (i === 10) driveTo({ x: 3.6, z: 4.2 }, true); else driveTo(Y.bays[i].ap, true); }

function yDrive(dt) {
  const f = { x: -Math.cos(Y.camA), z: -Math.sin(Y.camA) }, K = Y.keys;
  let fx = (K.up ? 1 : 0) - (K.down ? 1 : 0), rx = (K.right ? 1 : 0) - (K.left ? 1 : 0), ix = f.x * fx - f.z * rx, iz = f.z * fx + f.x * rx;
  const kl = Math.hypot(ix, iz);
  if (kl > 0) { ix /= kl; iz /= kl; Y.target = null; Y.auto = false; }
  else if (Y.target) {
    const dx = Y.target.x - Y.pos.x, dz = Y.target.z - Y.pos.z, d = Math.hypot(dx, dz);
    if (d < 0.6) Y.target = null; else { const sl = Math.min(1, d / 2.6); ix = dx / d * sl; iz = dz / d * sl; }
  }
  const top = Y.auto ? 20 : 13.5;
  Y.vel.x = damp(Y.vel.x, ix * top, 5, dt); Y.vel.z = damp(Y.vel.z, iz * top, 5, dt);
  let nx = Y.pos.x + Y.vel.x * dt, nz = Y.pos.z + Y.vel.z * dt;
  for (const o of Y.obst) {
    const dx = nx - o.x, dz = nz - o.z, d = Math.hypot(dx, dz) || 0.001, m = o.r + 1.1;
    if (d < m) { nx = o.x + dx / d * m - dz / d * 0.05; nz = o.z + dz / d * m + dx / d * 0.05; }     // slide round, never stick
  }
  Y.pos.x = clamp(nx, -32.5, 32.5); Y.pos.z = clamp(nz, -31.5, 34.5);
  const v = Math.hypot(Y.vel.x, Y.vel.z);
  if (v > 0.7) { let dh = Math.atan2(Y.vel.x, Y.vel.z) - Y.head; dh = Math.atan2(Math.sin(dh), Math.cos(dh)); Y.head += dh * Math.min(1, dt * 9); }
  const F = Y.fork; F.position.set(Y.pos.x, Math.abs(Math.sin(Y.t * 30)) * 0.012 * Math.min(1, v / 6), Y.pos.z); F.rotation.y = Y.head;
  Y.wheels.forEach(w => { w.rotation.x += v * dt / 0.39; });
  Y.forkY = damp(Y.forkY, Y.active >= 0 && Y.active < 10 && v < 1.5 ? 1.55 : 0.45, 3, dt); Y.lift.position.y = Y.forkY;
  Y.marker.visible = !!Y.target && !Y.auto;
  if (Y.target) { Y.marker.position.x = Y.target.x; Y.marker.position.z = Y.target.z; const s = 1 + Math.sin(Y.t * 6) * 0.12; Y.marker.scale.set(s, s, s); }

  /* which bay are we in? */
  let act = -1;
  for (const b of Y.bays) if (Math.hypot(Y.pos.x - b.x, Y.pos.z - b.z) < 6.3) { act = b.i; break; }
  if (act < 0 && Math.hypot(Y.pos.x, Y.pos.z) < 5.6) act = 10;
  if (act !== Y.active) { Y.active = act; yActive(act); }
}

function yCamera(dt) {
  const intro = Y.mode === 'intro', portrait = S.w / S.h < 0.8;
  const tx = intro ? 0 : Y.pos.x + Y.vel.x * 0.3, tz = intro ? -6 : Y.pos.z + Y.vel.z * 0.3;
  Y.lx = damp(Y.lx, tx, intro ? 2 : 3.5, dt); Y.lz = damp(Y.lz, tz, intro ? 2 : 3.5, dt);
  Y.dist = damp(Y.dist, (intro ? (portrait ? 250 : 172) : (portrait ? 112 : 76)) * Y.zoom, 2.2, dt);
  Y.orb = intro ? Y.orb + dt * (RM ? 0 : 0.045) : damp(Y.orb, 0, 2.2, dt);
  Y.camA = Math.PI / 4 + Y.orb;                                    // camera sits on this bearing from the look point
  const hx = Math.cos(Y.camA) * 0.71, hz = Math.sin(Y.camA) * 0.71, hy = 0.72;
  cam.position.set(Y.lx + hx * Y.dist, hy * Y.dist, Y.lz + hz * Y.dist); cam.lookAt(Y.lx, 1, Y.lz);
  const cardOn = $('#card').classList.contains('is-on'), wide = S.w > 760;      // keep the forklift clear of the card
  Y.shift = damp(Y.shift, cardOn && wide ? 0.13 : 0, 3.5, dt); Y.shiftY = damp(Y.shiftY, cardOn && !wide ? 0.2 : 0, 3.5, dt);
  if (Y.shift > 0.002 || Y.shiftY > 0.002) cam.setViewOffset(S.w, S.h, Y.shift * S.w, Y.shiftY * S.h, S.w, S.h); else cam.clearViewOffset();
  cam.updateMatrixWorld();
}

function yLabels() {
  Y.bays.forEach((b, i) => {
    const el = b.el; yV3.copy(b.lab).project(cam);
    const on = yV3.z < 1 && Math.abs(yV3.x) < 1.05 && Math.abs(yV3.y) < 1.05 && !(Y.active === i && S.w <= 760);
    el.classList.toggle('is-off', !on);
    if (on) el.style.transform = 'translate(' + ((yV3.x * 0.5 + 0.5) * S.w).toFixed(1) + 'px,' + ((-yV3.y * 0.5 + 0.5) * S.h).toFixed(1) + 'px) translate(-50%,-100%) translateY(-12px)';
  });
}

let yLast = 0;
function yFrame(ms) {
  requestAnimationFrame(yFrame);
  const now = ms / 1000, raw = yLast ? now - yLast : 0.016; yLast = now;
  const dt = Math.min(raw, DBG && DBG.fast ? 0.5 : 0.05); Y.t += dt; S.time = Y.t;
  runTweens(dt);
  if (Y.toastT > 0) { Y.toastT -= dt; if (Y.toastT <= 0) $('#toast').classList.remove('is-on'); }
  if (!Y.ok) return;
  if (!RM) Y.anims.forEach(a => a(Y.t));
  yCamera(dt); if (Y.mode === 'play') yDrive(dt);
  Y.acc += dt;
  if (Y.acc > 0.1 && Y.active >= 0 && Y.active < 10) { Y.acc = 0; const b = Y.bays[Y.active]; b.draw(Y.t); if (b.extra) b.extra(Y.t); }
  yLabels();
  ren.render(scene, cam);
}
