/* Reel "Dia de sol no condomínio: 5 gestos de boa convivência" — sem narração e sem legenda no rodapé.
   Reaproveita a maquete 3D (index.html, paleta de dia) e a personagem da Maiane; aqui ficam as cenas 2D e a linha do tempo. */

const DUR = 42;
window.DURATION = DUR;
const CREAM = "#f4f1ea", INK = "#1f2430", GREEN = "#2ee59d";
const fadeIO = (t, a, b, f = 0.3) => Math.min(ease(prog(t, a, a + f)), 1 - ease(prog(t, b - f, b)));
const SC = [[5.5, 11.5], [11.5, 17.5], [17.5, 23.5], [23.5, 29.5], [29.5, 35.5], [35.5, 42]];

/* =====================================================================
   3D de dia: nuvens e sombras de nuvem passando
   ===================================================================== */
document.getElementById("cam").style.background = "linear-gradient(#7cc4f2, #e3f4ff 55%)";
const clouds3d = [[150, 300], [600, 700], [300, 1150], [700, 1500], [-100, 900]].map(([x, y], i) => {
  const sh = div(world, "f", { width: "320px", height: "200px", borderRadius: "50%", background: "radial-gradient(rgba(20,40,20,.28), rgba(20,40,20,0) 70%)" });
  const cl = div(world, "f", { width: "300px", height: "180px", borderRadius: "50%", background: "radial-gradient(rgba(255,255,255,.85), rgba(255,255,255,0) 68%)" });
  return { sh, cl, x, y };
});

/* =====================================================================
   PALCO 2D
   ===================================================================== */
const D = document.createElementNS(NS, "svg");
D.setAttribute("width", 1080); D.setAttribute("height", 1920); D.setAttribute("viewBox", "0 0 1080 1920");
Object.assign(D.style, { position: "absolute", left: 0, top: 0 });
document.body.insertBefore(D, document.getElementById("overlay"));
D.innerHTML = `<defs>
  <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fbdf0"/><stop offset="1" stop-color="#e6f6ff"/></linearGradient>
  <radialGradient id="sunGlow"><stop offset="0" stop-color="#fff7d1" stop-opacity=".95"/><stop offset=".4" stop-color="#ffe9a3" stop-opacity=".45"/><stop offset="1" stop-color="#ffe9a3" stop-opacity="0"/></radialGradient>
  <linearGradient id="lawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc66a"/><stop offset="1" stop-color="#5f9a45"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9dcf5"/><stop offset=".5" stop-color="#7fb2db"/><stop offset="1" stop-color="#a8cfee"/></linearGradient>
  <radialGradient id="warmLight" cx=".85" cy=".1" r=".9"><stop offset="0" stop-color="#ffd27a" stop-opacity=".35"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
  <filter id="soft6"><feGaussianBlur stdDeviation="6"/></filter>
</defs>`;
const g = (parent, attrs) => sv("g", attrs || {}, parent);
const R = (parent, a) => sv("rect", a, parent);
const C = (parent, a) => sv("circle", a, parent);
const P = (parent, d, a) => sv("path", Object.assign({ d }, a || {}), parent);
const E = (parent, a) => sv("ellipse", a, parent);
const TX = (parent, a, text) => sv("text", Object.assign({ "text-anchor": "middle", "font-weight": 900, fill: CREAM }, a), parent, text);

// ---------- cenário de fundo: céu, sol, nuvens, pássaros, prédio bege, gramado, árvores ----------
function cloud(parent, x, y, s) {
  const c = g(parent, {});
  [[0, 0, 70], [60, -25, 60], [120, 0, 65], [60, 15, 70]].forEach(([dx, dy, r]) => C(c, { cx: dx, cy: dy, r, fill: "#fff", opacity: 0.95 }));
  c.base = [x, y, s]; return c;
}
function tree(parent, x, y, s) {
  const t = g(parent, {});
  E(t, { cx: x + 30 * s, cy: y + 4, rx: 90 * s, ry: 16 * s, fill: "#2f5a26", opacity: 0.35 });
  R(t, { x: x - 12 * s, y: y - 150 * s, width: 24 * s, height: 150 * s, rx: 8, fill: "#7a5233" });
  const top = g(t, {});
  [[0, -210, 95, "#3f8a3a"], [-60, -170, 70, "#4c9a44"], [62, -165, 72, "#3a7f35"], [-10, -260, 70, "#57a84d"], [30, -200, 60, "#62b357"]]
    .forEach(([dx, dy, r, c]) => C(top, { cx: x + dx * s, cy: y + dy * s, r: r * s, fill: c }));
  C(top, { cx: x - 25 * s, cy: y - 270 * s, r: 28 * s, fill: "#8fd07e", opacity: 0.6 });
  t.top = top; t.ox = x; t.oy = y - 150 * s; return t;
}
function bird(parent) { return P(parent, "M -14 0 Q -7 -8 0 0 Q 7 -8 14 0", { fill: "none", stroke: "#2b3346", "stroke-width": 3, "stroke-linecap": "round" }); }
function facade(parent, y0, floors, fh) {
  const f = g(parent, {});
  R(f, { x: -40, y: y0 - 50, width: 1160, height: 54, fill: "#a7adb7" });                         // beiral/telhado
  R(f, { x: -40, y: y0, width: 1160, height: floors * fh, fill: "#efe5cf" });
  R(f, { x: -40, y: y0 + floors * fh - fh * 0.7, width: 1160, height: fh * 0.7, fill: "#c4c7cc" });  // faixa cinza ~2 m
  for (let fl = 0; fl < floors - 1; fl++) for (let x = 40; x < 1080; x += 260) {
    const y = y0 + fl * fh + fh * 0.22;
    R(f, { x: x - 6, y: y - 6, width: 172, height: fh * 0.56 + 12, rx: 4, fill: "#fbf8f2" });
    R(f, { x, y, width: 160, height: fh * 0.56, fill: "url(#glass)" });
    P(f, `M ${x + 20} ${y + fh * 0.56} L ${x + 90} ${y} L ${x + 120} ${y} L ${x + 50} ${y + fh * 0.56} Z`, { fill: "#fff", opacity: 0.35 });
    R(f, { x: x + 78, y, width: 4, height: fh * 0.56, fill: "#fbf8f2" });
    R(f, { x: x - 10, y: y + fh * 0.56 + 6, width: 180, height: 8, rx: 3, fill: "#d9cdb4" });
  }
  return f;
}
function stage(o = {}) {
  const s = g(D, { opacity: 0 });
  const cam = g(s, {});                          // recebe o zoom lento da cena
  R(cam, { x: -200, y: -200, width: 1480, height: 2320, fill: "url(#dsky)" });
  const sun = g(cam, {});
  C(sun, { cx: 880, cy: 230, r: 260, fill: "url(#sunGlow)" });
  const rays = g(sun, {});
  for (let i = 0; i < 12; i++) R(rays, { x: 876, y: 70, width: 8, height: 60, rx: 4, fill: "#ffe48a", opacity: 0.6, transform: `rotate(${i * 30} 880 230)` });
  C(sun, { cx: 880, cy: 230, r: 72, fill: "#fff3b8" });
  const cl = [cloud(cam, 150, 260, 1), cloud(cam, 560, 150, 0.8), cloud(cam, 980, 420, 0.9)];
  const birds = [0, 1, 2, 3].map((i) => bird(cam));
  if (o.facade !== false) facade(cam, o.fy || 560, 5, o.fh || 170);
  R(cam, { x: -200, y: o.gy || 1400, width: 1480, height: 900, fill: "url(#lawn)" });
  for (let i = 0; i < 40; i++) {
    const x = rnd() * 1080, y = (o.gy || 1400) + 30 + rnd() * 500;
    C(cam, { cx: x, cy: y, r: 4 + rnd() * 4, fill: ["#ffd84d", "#ff8fb1", "#fff", "#b48cff"][i % 4], opacity: 0.9 });
  }
  const trees = (o.trees || []).map(([x, y, sc]) => tree(cam, x, y, sc));
  const fg = g(cam, {});                          // camada da ação
  const light = R(s, { x: 0, y: 0, width: 1080, height: 1920, fill: "url(#warmLight)", style: "mix-blend-mode:screen" });
  s.cam = cam; s.rays = rays; s.cl = cl; s.birds = birds; s.trees = trees; s.fg = fg;
  return s;
}
function stageUpdate(s, lt, t) {
  s.cam.setAttribute("transform", `translate(540 1100) scale(${lerp(1.04, 1.1, lt / 6)}) translate(-540 -1100)`);
  s.rays.setAttribute("transform", `rotate(${t * 6} 880 230)`);
  s.cl.forEach((c, i) => { const [x, y, sc] = c.base; c.setAttribute("transform", `translate(${((x + t * (14 + i * 6)) % 1400) - 150} ${y}) scale(${sc})`); });
  s.birds.forEach((b, i) => {
    const x = ((t * (90 + i * 12) + i * 330) % 1500) - 200, y = 360 + i * 45 + Math.sin(t * 2 + i) * 12;
    b.setAttribute("transform", `translate(${x} ${y}) scale(1 ${0.6 + 0.4 * Math.abs(Math.sin(t * 9 + i))})`);
  });
  s.trees.forEach((tr, i) => tr.top.setAttribute("transform", `rotate(${Math.sin(t * 1.3 + i) * 1.6} ${tr.ox} ${tr.oy})`));
}

// ---------- personagens (de perfil, sem rosto) ----------
function person(parent, o) {
  const root = g(parent, {}), body = g(root, {});
  const sk = o.skin || "#f0c4a0", hairC = o.hair || "#5a3a22";
  E(root, { cx: 0, cy: 4, rx: 70, ry: 12, fill: "#000", opacity: 0.18 });
  const limb = (x1, y1, x2, y2, c, w) => P(null, `M ${x1} ${y1} L ${x2} ${y2}`, { stroke: c, "stroke-width": w, "stroke-linecap": "round", fill: "none" });
  const legB = g(body, {}), legF = g(body, {}), armB = g(body, {});
  [legB, legF].forEach((lg, i) => {
    lg.appendChild(limb(0, -180, 0, -18, o.pants || "#34495e", 34));
    E(lg, { cx: 10, cy: -10, rx: 26, ry: 12, fill: o.shoe || "#222" });
    if (i === 0) lg.setAttribute("opacity", 0.85);
  });
  armB.appendChild(limb(0, -312, 0, -190, o.top || "#2a9d8f", 26)); armB.setAttribute("opacity", 0.85);
  R(body, { x: -36, y: -335, width: 72, height: 175, rx: 30, fill: o.top || "#2a9d8f" });
  R(body, { x: -10, y: -360, width: 20, height: 30, fill: sk });
  const headG = g(body, {});
  C(headG, { cx: 6, cy: -388, r: 36, fill: sk });
  P(headG, "M -32 -388 Q -34 -432 8 -430 Q 44 -428 42 -398 Q 20 -414 -4 -404 Q -14 -380 -30 -372 Z", { fill: hairC });
  if (o.pony) P(headG, "M -30 -400 Q -70 -380 -56 -330 Q -44 -360 -26 -372 Z", { fill: hairC });
  if (o.longHair) P(headG, "M -32 -400 Q -40 -340 -20 -320 L 0 -330 Q -14 -360 -12 -392 Z", { fill: hairC });
  const armF = g(body, {});
  armF.appendChild(limb(0, -312, 0, -190, o.top || "#2a9d8f", 26));
  C(armF, { cx: 0, cy: -184, r: 14, fill: sk });
  const hand = g(armF, {});                    // o que a pessoa segura vai aqui
  root.parts = { body, legB, legF, armB, armF, hand, headG };
  root.s = o.s || 1; root.dir = o.dir || 1;
  return root;
}
function placePerson(p, x, y) { p.setAttribute("transform", `translate(${x} ${y}) scale(${p.dir * p.s} ${p.s})`); }
function walk(p, ph, amp, armOverride) {
  const a = Math.sin(ph) * 24 * amp, P_ = p.parts;
  P_.legF.setAttribute("transform", `rotate(${a} 0 -180)`); P_.legB.setAttribute("transform", `rotate(${-a} 0 -180)`);
  P_.armB.setAttribute("transform", `rotate(${a * 0.8} 0 -312)`);
  P_.armF.setAttribute("transform", `rotate(${armOverride !== undefined ? armOverride : -a * 0.8} 0 -312)`);
  P_.body.setAttribute("transform", `translate(0 ${-Math.abs(Math.sin(ph)) * 8 * amp})`);
}
function handPos(p, x, y, armDeg) {           // posição da mão no palco (para a guia do cachorro)
  const r = (armDeg * Math.PI) / 180, s = p.s, d = p.dir;
  return [x + d * s * (-128 * Math.sin(r)), y + s * (-312 + 128 * Math.cos(r))];
}
function dog(parent) {
  const d = g(parent, {}), body = g(d, {});
  E(d, { cx: 0, cy: 4, rx: 70, ry: 10, fill: "#000", opacity: 0.16 });
  const legs = [-40, -22, 26, 42].map((x) => P(body, `M ${x} -62 L ${x} -6`, { stroke: "#a86f37", "stroke-width": 13, "stroke-linecap": "round" }));
  const tail = P(body, "M -58 -80 Q -86 -110 -78 -128", { stroke: "#c58b4a", "stroke-width": 11, fill: "none", "stroke-linecap": "round" });
  E(body, { cx: 0, cy: -78, rx: 64, ry: 30, fill: "#c58b4a" });
  const headG = g(body, {});
  C(headG, { cx: 66, cy: -112, r: 27, fill: "#c58b4a" });
  E(headG, { cx: 92, cy: -104, rx: 18, ry: 12, fill: "#d9a56a" });
  C(headG, { cx: 106, cy: -106, r: 6, fill: "#2b1d12" });
  P(headG, "M 52 -132 Q 40 -112 52 -96 Q 62 -112 60 -130 Z", { fill: "#7a4a22" });
  R(body, { x: 44, y: -98, width: 10, height: 26, rx: 4, fill: "#e5484d", transform: "rotate(-20 49 -85)" });
  d.legs = legs; d.tail = tail; d.headG = headG; return d;
}
function carSide(parent, color) {
  const c = g(parent, {});
  E(c, { cx: 220, cy: 6, rx: 230, ry: 14, fill: "#000", opacity: 0.2 });
  P(c, "M 0 -46 Q 2 -92 40 -100 L 120 -106 L 170 -168 Q 180 -176 200 -176 L 330 -176 Q 352 -176 362 -160 L 392 -108 L 420 -104 Q 438 -98 438 -70 L 438 -46 Z", { fill: color });
  P(c, "M 132 -108 L 178 -164 L 262 -164 L 262 -108 Z", { fill: "url(#glass)" });
  P(c, "M 272 -108 L 272 -164 L 332 -164 Q 344 -164 350 -154 L 378 -108 Z", { fill: "url(#glass)" });
  R(c, { x: 0, y: -70, width: 18, height: 12, rx: 3, fill: "#fffbe0" });
  const brake = R(c, { x: 426, y: -78, width: 14, height: 18, rx: 3, fill: "#a3242e" });
  const wheels = [80, 352].map((wx) => { const w = g(c, {}); C(w, { r: 42, fill: "#16181d" }); C(w, { r: 22, fill: "#c5cad3" }); for (let i = 0; i < 5; i++) R(w, { x: -3, y: -20, width: 6, height: 18, fill: "#7d838d", transform: `rotate(${i * 72})` }); w.wx = wx; return w; });
  c.brake = brake; c.wheels = wheels; return c;
}
function check(parent, x, y) {
  const c = g(parent, { opacity: 0 });
  const ring = C(c, { cx: x, cy: y, r: 80, fill: "none", stroke: GREEN, "stroke-width": 6 });
  C(c, { cx: x, cy: y, r: 62, fill: GREEN });
  P(c, `M ${x - 28} ${y + 2} L ${x - 8} ${y + 24} L ${x + 30} ${y - 22}`, { stroke: "#fff", "stroke-width": 14, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" });
  c.ring = ring; c.x = x; c.y = y; return c;
}
function showCheck(c, lt, at) {
  const k = prog(lt, at, at + 0.35);
  c.setAttribute("opacity", lt < at ? 0 : 1);
  c.setAttribute("transform", `translate(${c.x} ${c.y}) scale(${lt < at ? 0 : 0.6 + 0.4 * ease(k) + Math.sin(k * Math.PI) * 0.15}) translate(${-c.x} ${-c.y})`);
  c.ring.setAttribute("r", 80 + 60 * prog(lt, at, at + 0.8)); c.ring.setAttribute("opacity", 1 - prog(lt, at, at + 0.8));
}
function chip(parent, x, y, text, color) {
  const c = g(parent, { opacity: 0 });
  const w = text.length * 19 + 60;
  R(c, { x: x - w / 2, y: y - 40, width: w, height: 70, rx: 35, fill: "rgba(255,255,255,.95)", stroke: color, "stroke-width": 4 });
  TX(c, { x, y: y + 8, "font-size": 34, fill: INK, "font-weight": 800 }, text);
  return c;
}
function bubble(parent, x, y, text) {
  const b = g(parent, { opacity: 0 });
  const w = text.length * 24 + 60;
  R(b, { x: x - w / 2, y: y - 50, width: w, height: 84, rx: 42, fill: "#fff", stroke: INK, "stroke-width": 4 });
  P(b, `M ${x - 10} ${y + 32} L ${x + 4} ${y + 60} L ${x + 22} ${y + 32} Z`, { fill: "#fff", stroke: INK, "stroke-width": 4 });
  R(b, { x: x - 14, y: y + 26, width: 40, height: 10, fill: "#fff" });
  TX(b, { x, y: y + 6, "font-size": 40, fill: INK }, text);
  return b;
}
const pop = (el, lt, a, b) => { el.setAttribute("opacity", lt < a || lt > b ? 0 : fadeIO(lt, a, b, 0.2)); };

/* ---------- 1 · lixeira coletiva ---------- */
const s1 = stage({ trees: [[120, 1460, 0.9]] });
{
  const f = s1.fg;
  R(f, { x: 300, y: 1450, width: 800, height: 160, fill: "#cfc9bd" });
  for (let x = 300; x < 1100; x += 60) R(f, { x, y: 1450, width: 2, height: 160, fill: "#b5afa3" });
  R(f, { x: 360, y: 1050, width: 14, height: 470, fill: "#5d6a60" }); R(f, { x: 1010, y: 1050, width: 14, height: 470, fill: "#5d6a60" });
  P(f, "M 330 1060 L 1060 1060 L 1030 1010 L 360 1010 Z", { fill: "#41534a" });
  R(f, { x: 330, y: 1058, width: 730, height: 12, fill: "#2f3c35" });
  for (let x = 380; x < 1010; x += 18) R(f, { x, y: 1072, width: 5, height: 100, fill: "#7a8a7e", opacity: 0.55 });
  s1.lids = [];
  [["#2e7d32", 420, "♻"], ["#6b6b6b", 610, "🗑"], ["#1565c0", 800, "♻"]].forEach(([c, x, ic]) => {
    R(f, { x, y: 1290, width: 170, height: 240, rx: 14, fill: c });
    R(f, { x: x + 120, y: 1290, width: 50, height: 240, rx: 12, fill: "#000", opacity: 0.12 });
    TX(f, { x: x + 85, y: 1430, "font-size": 70, fill: "#fff" }, ic);
    C(f, { cx: x + 30, cy: 1534, r: 16, fill: "#222" }); C(f, { cx: x + 140, cy: 1534, r: 16, fill: "#222" });
    const lid = g(f, {}); R(lid, { x: x - 6, y: 1268, width: 182, height: 28, rx: 10, fill: c }); R(lid, { x: x - 6, y: 1268, width: 182, height: 8, rx: 4, fill: "#fff", opacity: 0.25 });
    lid.hx = x - 6; s1.lids.push(lid);
  });
  s1.p = person(f, { top: "#2a9d8f", pants: "#2c3e50", hair: "#3b2a1e", s: 1 });
  s1.bag = g(f, {}); E(s1.bag, { cx: 0, cy: 0, rx: 34, ry: 40, fill: "#e8eaee" }); P(s1.bag, "M -12 -38 Q 0 -60 12 -38", { stroke: "#c3c7cf", "stroke-width": 6, fill: "none" });
  s1.ck = check(f, 700, 1150);
}
function u1(lt, t) {
  stageUpdate(s1, lt, t);
  const k = ease(prog(lt, 0.2, 2.6)), x = lerp(-180, 300, k), walking = lt > 0.2 && lt < 2.7 ? 1 : 0;
  placePerson(s1.p, x, 1560);
  const throwK = prog(lt, 2.9, 3.4);
  walk(s1.p, lt * 7, walking, lt > 2.6 ? lerp(0, -95, ease(prog(lt, 2.6, 2.95))) * (1 - ease(prog(lt, 3.5, 3.9))) : undefined);
  s1.lids[0].setAttribute("transform", `rotate(${-55 * ease(prog(lt, 2.6, 2.9)) * (1 - ease(prog(lt, 3.6, 3.9)))} ${s1.lids[0].hx} 1282)`);
  const [hx, hy] = handPos(s1.p, x, 1560, lt > 2.6 ? lerp(0, -95, ease(prog(lt, 2.6, 2.95))) : 0);
  if (lt < 2.9) s1.bag.setAttribute("transform", `translate(${hx} ${hy + 40})`);
  else {
    const bx = lerp(hx, 505, throwK), by = lerp(hy + 40, 1300, throwK) - Math.sin(throwK * Math.PI) * 160;
    s1.bag.setAttribute("transform", `translate(${bx} ${by}) rotate(${throwK * 200}) scale(${1 - 0.3 * throwK})`);
    s1.bag.setAttribute("opacity", lt > 3.45 ? 0 : 1);
  }
  if (lt < 2.9) s1.bag.setAttribute("opacity", 1);
  showCheck(s1.ck, lt, 4.0);
}

/* ---------- 2 · pet na guia (calçada com piso tátil) ---------- */
const s2 = stage({ trees: [[960, 1440, 1], [80, 1440, 0.8]] });
{
  const f = s2.fg;
  R(f, { x: -100, y: 1480, width: 1300, height: 190, fill: "#d3cec4" });
  for (let x = -100; x < 1200; x += 70) R(f, { x, y: 1480, width: 2, height: 190, fill: "#bdb7ab" });
  R(f, { x: -100, y: 1560, width: 1300, height: 34, fill: "#f2c230" });
  for (let x = -100; x < 1200; x += 17) for (let y = 1566; y < 1592; y += 12) C(f, { cx: x, cy: y, r: 3.4, fill: "#d9a516" });
  R(f, { x: -100, y: 1670, width: 1300, height: 14, fill: "#a9a397" });
  s2.p = person(f, { top: "#ef6f6c", pants: "#3d405b", hair: "#c48a3f", pony: true, s: 1 });
  s2.d = dog(f);
  s2.leash = P(f, "", { stroke: "#e5484d", "stroke-width": 4, fill: "none" });
  s2.bag = g(f, { opacity: 0 }); R(s2.bag, { x: -16, y: -10, width: 32, height: 40, rx: 8, fill: "#3cb371" }); P(s2.bag, "M -8 -10 Q 0 -24 8 -10", { stroke: "#2e8b57", "stroke-width": 4, fill: "none" });
  s2.paws = [0, 1, 2, 3, 4].map(() => TX(f, { "font-size": 30, opacity: 0 }, "🐾"));
  s2.ck = check(f, 760, 1180);
  s2.chip = chip(f, 540, 1340, "sujeira recolhida", GREEN);
}
function u2(lt, t) {
  stageUpdate(s2, lt, t);
  const k = ease(prog(lt, 0.1, 3.0)), walking = lt > 0.1 && lt < 3.0 ? 1 : 0;
  const px = lerp(-260, 330, k), dx = px + 300;
  const arm = lt > 3.3 ? lerp(-25, -70, ease(prog(lt, 3.3, 3.8))) : -25;
  placePerson(s2.p, px, 1600); walk(s2.p, lt * 7, walking, arm);
  s2.d.setAttribute("transform", `translate(${dx} 1612)`);
  s2.d.legs.forEach((l, i) => l.setAttribute("transform", `rotate(${Math.sin(lt * 12 + i * 1.6) * 22 * walking} ${[-40, -22, 26, 42][i]} -62)`));
  s2.d.tail.setAttribute("transform", `rotate(${Math.sin(lt * 16) * 18} -58 -80)`);
  s2.d.headG.setAttribute("transform", `rotate(${lt > 3.0 ? 22 * ease(prog(lt, 3.0, 3.3)) : 0} 60 -100)`);
  const [hx, hy] = handPos(s2.p, px, 1600, -25);
  s2.leash.setAttribute("d", `M ${hx} ${hy} Q ${(hx + dx + 49) / 2} ${hy + 60} ${dx + 49} 1527`);
  const [bx, by] = handPos(s2.p, px, 1600, arm);
  s2.bag.setAttribute("transform", `translate(${bx} ${by + 20})`); s2.bag.setAttribute("opacity", ease(prog(lt, 3.5, 3.8)));
  s2.paws.forEach((pw, i) => { const x = -100 + i * 120; pw.setAttribute("x", x); pw.setAttribute("y", 1660); pw.setAttribute("opacity", dx > x + 120 ? 0.35 : 0); });
  showCheck(s2.ck, lt, 4.1); pop(s2.chip, lt, 4.3, 6);
}

/* ---------- 3 · devagar na rua interna ---------- */
const s3 = stage({ trees: [[980, 1380, 0.9]], gy: 1380 });
{
  const f = s3.fg;
  R(f, { x: -100, y: 1380, width: 1300, height: 90, fill: "#d3cec4" });
  R(f, { x: -100, y: 1410, width: 1300, height: 24, fill: "#f2c230" });
  R(f, { x: -100, y: 1470, width: 1300, height: 360, fill: "#6b717a" });
  for (let x = -100; x < 1200; x += 120) R(f, { x, y: 1640, width: 60, height: 10, fill: "#e7b866" });
  R(f, { x: -100, y: 1830, width: 1300, height: 100, fill: "#d3cec4" });
  carSide(f, "#9aa3ad").setAttribute("transform", "translate(-80 1520) scale(0.7)");
  R(f, { x: 856, y: 1100, width: 12, height: 300, fill: "#8a8f97" });
  const sign = g(f, {}); R(sign, { x: 802, y: 1040, width: 120, height: 120, fill: "#f6c445", stroke: "#1f2430", "stroke-width": 6, transform: "rotate(45 862 1100)" });
  TX(sign, { x: 862, y: 1118, "font-size": 50 }, "🚸");
  R(f, { x: 772, y: 1186, width: 180, height: 44, rx: 6, fill: "#fff", stroke: "#1f2430", "stroke-width": 4 });
  TX(f, { x: 862, y: 1218, "font-size": 30, fill: INK }, "DEVAGAR");
  s3.kid = person(f, { top: "#ffb703", pants: "#219ebc", hair: "#2b1d12", s: 0.62, dir: -1 });
  s3.ball = g(f, {}); C(s3.ball, { r: 26, fill: "#fff" }); P(s3.ball, "M -26 0 Q 0 -14 26 0 M 0 -26 Q 12 0 0 26", { stroke: "#e5484d", "stroke-width": 5, fill: "none" });
  s3.car = carSide(f, "#f4f5f7");
  s3.speed = chip(f, 300, 1300, "🐢 bem devagar", "#f6c445");
  s3.ck = check(f, 540, 1150);
  s3.chip = chip(f, 540, 1300, "parou e esperou", GREEN);
}
function u3(lt, t) {
  stageUpdate(s3, lt, t);
  const k = 1 - Math.pow(1 - clamp(lt / 3.2), 2.2), cx = lerp(-520, 250, k);
  s3.car.setAttribute("transform", `translate(${cx + 438} 1700) scale(-1 1)`);
  s3.car.wheels.forEach((w) => w.setAttribute("transform", `translate(${w.wx} -44) rotate(${cx * 1.3})`));
  s3.car.brake.setAttribute("fill", lt > 2.6 ? "#ff3b4e" : "#a3242e");
  placePerson(s3.kid, 760, 1440); walk(s3.kid, 0, 0, -30 + Math.sin(lt * 7) * 10);
  const by = 1414 - Math.abs(Math.sin(lt * 4.2)) * 130;
  s3.ball.setAttribute("transform", `translate(${700} ${by})`);
  pop(s3.speed, lt, 0.6, 3.3); showCheck(s3.ck, lt, 3.6); pop(s3.chip, lt, 3.8, 6);
}

/* ---------- 4 · áreas de lazer (playground + quadra de areia) ---------- */
const s4 = stage({ facade: true, fy: 520, fh: 150, trees: [[60, 1420, 0.8]] });
{
  const f = s4.fg;
  R(f, { x: -100, y: 1440, width: 620, height: 260, fill: "#d8c08a" });           // areia do playground
  R(f, { x: 560, y: 1380, width: 600, height: 320, fill: "#e3cf98" });            // quadra de areia
  const q = g(f, {});
  for (let x = 560; x <= 1100; x += 18) R(q, { x, y: 1080, width: 2, height: 300, fill: "#9aa3ad", opacity: 0.45 });
  R(q, { x: 560, y: 1070, width: 520, height: 10, fill: "#7d858f" });
  for (let x = 580; x < 1080; x += 46) C(q, { cx: x, cy: 1086, r: 5, fill: "#fff6c8" });   // LEDs
  R(q, { x: 812, y: 1250, width: 6, height: 190, fill: "#555" }); R(q, { x: 760, y: 1250, width: 110, height: 60, fill: "none", stroke: "#fff", "stroke-width": 3 });
  for (let x = 764; x < 868; x += 12) R(q, { x, y: 1252, width: 1.5, height: 56, fill: "#fff", opacity: 0.6 });
  // balanço
  P(f, "M 60 1560 L 130 1170 L 200 1560 M 300 1560 L 370 1170 L 440 1560", { stroke: "#e5484d", "stroke-width": 16, fill: "none", "stroke-linecap": "round" });
  R(f, { x: 110, y: 1160, width: 280, height: 20, rx: 8, fill: "#c0392b" });
  s4.swing = g(f, {});
  P(s4.swing, "M 230 1180 L 230 1430 M 280 1180 L 280 1430", { stroke: "#555", "stroke-width": 4 });
  R(s4.swing, { x: 214, y: 1424, width: 82, height: 14, rx: 6, fill: "#2b6cb0" });
  s4.kid1 = person(s4.swing, { top: "#8e44ad", pants: "#1d3557", hair: "#e9c46a", s: 0.55, pony: true });
  // escorregador
  P(f, "M 470 1560 L 470 1260 L 530 1260 L 530 1560", { stroke: "#f39c12", "stroke-width": 12, fill: "none" });
  P(f, "M 530 1270 Q 620 1420 700 1560", { stroke: "#f6c445", "stroke-width": 34, fill: "none", "stroke-linecap": "round" });
  // vôlei na areia
  s4.k2 = person(f, { top: "#06d6a0", pants: "#073b4c", hair: "#2b1d12", s: 0.62 });
  s4.k3 = person(f, { top: "#ef476f", pants: "#073b4c", hair: "#5a3a22", s: 0.62, dir: -1, pony: true });
  s4.ball = g(f, {}); C(s4.ball, { r: 22, fill: "#fff" }); P(s4.ball, "M -22 0 Q 0 -12 22 0 M 0 -22 Q 10 0 0 22", { stroke: "#2b6cb0", "stroke-width": 4, fill: "none" });
  s4.ck = check(f, 540, 1000);
}
function u4(lt, t) {
  stageUpdate(s4, lt, t);
  const a = Math.sin(lt * 2.6) * 24;
  s4.swing.setAttribute("transform", `rotate(${a} 255 1180)`);
  placePerson(s4.kid1, 255, 1430); walk(s4.kid1, 0, 0, -60);
  placePerson(s4.k2, 700, 1600); placePerson(s4.k3, 980, 1600);
  const ph = (lt * 0.55) % 1, dir = Math.floor(lt * 0.55) % 2;
  const bx = dir ? lerp(960, 720, ph) : lerp(720, 960, ph), by = 1330 - Math.sin(ph * Math.PI) * 300;
  s4.ball.setAttribute("transform", `translate(${bx} ${by}) rotate(${lt * 400})`);
  walk(s4.k2, 0, 0, dir === 0 && ph < 0.15 ? -150 : -40); walk(s4.k3, 0, 0, dir === 1 && ph < 0.15 ? -150 : -40);
  showCheck(s4.ck, lt, 3.8);
}

/* ---------- 5 · gentileza na entrada do bloco ---------- */
const s5 = stage({ facade: false, gy: 1560, trees: [] });
{
  const f = s5.fg;
  // alas do H (pontas lisas) + núcleo recuado com a entrada
  R(f, { x: 330, y: 620, width: 420, height: 940, fill: "#e2d6bc" });
  for (let fl = 0; fl < 5; fl++) R(f, { x: 500, y: 680 + fl * 170, width: 80, height: 90, rx: 4, fill: "url(#glass)" });
  R(f, { x: 330, y: 1450, width: 420, height: 110, fill: "#b9bcc1" });
  R(f, { x: -40, y: 520, width: 370, height: 1040, fill: "#efe5cf" }); R(f, { x: 750, y: 520, width: 370, height: 1040, fill: "#efe5cf" });
  R(f, { x: -40, y: 1440, width: 370, height: 120, fill: "#c4c7cc" }); R(f, { x: 750, y: 1440, width: 370, height: 120, fill: "#c4c7cc" });
  P(f, "M -60 520 L 165 440 L 350 520 Z M 730 520 L 935 440 L 1140 520 Z", { fill: "#a7adb7" });
  R(f, { x: 430, y: 1210, width: 220, height: 350, fill: "#5d6470" });
  s5.door = R(f, { x: 440, y: 1220, width: 200, height: 340, fill: "url(#glass)", stroke: "#3d434d", "stroke-width": 6 });
  R(f, { x: 672, y: 1300, width: 34, height: 54, rx: 6, fill: "#11151f" });
  s5.face = R(f, { x: 678, y: 1306, width: 22, height: 30, rx: 3, fill: GREEN });
  R(f, { x: 380, y: 1560, width: 320, height: 40, fill: "#cfc9bd" });
  s5.b = person(f, { top: "#9b5de5", pants: "#2b2d42", hair: "#1d1d1d", longHair: true, s: 0.95 });
  s5.a = person(f, { top: "#f77f00", pants: "#264653", hair: "#6b4226", s: 0.95 });
  s5.bags = g(f, {});
  [[-20, "#f1faee"], [18, "#e9edc9"]].forEach(([dx, c]) => { R(s5.bags, { x: dx - 22, y: -10, width: 44, height: 56, rx: 8, fill: c }); TX(s5.bags, { x: dx, y: 30, "font-size": 26 }, dx < 0 ? "🥖" : "🍎"); });
  s5.hi = bubble(f, 760, 1050, "Bom dia! ☀️"); s5.ty = bubble(f, 300, 1050, "Obrigado!");
  s5.hearts = [0, 1, 2, 3, 4].map(() => TX(f, { "font-size": 54, opacity: 0 }, "💛"));
  s5.ck = check(f, 540, 900);
}
function u5(lt, t) {
  stageUpdate(s5, lt, t);
  placePerson(s5.b, 720, 1600);
  walk(s5.b, 0, 0, lt > 0.8 ? -70 : 0);
  s5.door.setAttribute("transform", `translate(${lt > 0.8 ? 0 : 0} 0) scale(${lerp(1, 0.25, ease(prog(lt, 0.9, 1.5)) * (1 - ease(prog(lt, 4.6, 5.2))))} 1)`);
  s5.door.setAttribute("transform-origin", "640 1390");
  s5.face.setAttribute("opacity", 0.55 + 0.45 * Math.abs(Math.sin(t * 3)));
  const k = ease(prog(lt, 0.2, 3.6)), ax = lerp(-200, 540, k), walking = lt > 0.2 && lt < 3.6 ? 1 : 0;
  placePerson(s5.a, ax, 1600); walk(s5.a, lt * 7, walking, -10);
  s5.a.setAttribute("opacity", 1 - ease(prog(lt, 3.6, 4.2)));
  const [hx, hy] = handPos(s5.a, ax, 1600, -10);
  s5.bags.setAttribute("transform", `translate(${hx} ${hy + 30}) scale(0.95)`); s5.bags.setAttribute("opacity", 1 - ease(prog(lt, 3.6, 4.2)));
  pop(s5.hi, lt, 1.4, 3.4); pop(s5.ty, lt, 2.6, 4.4);
  s5.hearts.forEach((h, i) => {
    const hk = prog(lt, 3.0 + i * 0.25, 4.6 + i * 0.25);
    h.setAttribute("x", 420 + i * 60 + Math.sin(hk * 8 + i) * 18); h.setAttribute("y", 1300 - hk * 380);
    h.setAttribute("opacity", hk > 0 && hk < 1 ? Math.sin(hk * Math.PI) : 0);
  });
  showCheck(s5.ck, lt, 4.2);
}

/* ---------- 6 · final: Maiane na portaria ensolarada ---------- */
const s6 = stage({ facade: false, gy: 1580, trees: [[980, 1590, 0.9]] });
{
  const f = s6.fg;
  [[-40, 300], [340, 300], [700, 300]].forEach(([x, w], i) => {
    R(f, { x, y: 700, width: w * 0.4, height: 720, fill: "#efe5cf" }); R(f, { x: x + w * 0.6, y: 700, width: w * 0.4, height: 720, fill: "#efe5cf" });
    R(f, { x: x + w * 0.4, y: 760, width: w * 0.2, height: 660, fill: "#d9cdb4" });
    for (let fl = 0; fl < 5; fl++) R(f, { x: x + w * 0.45, y: 790 + fl * 120, width: w * 0.1, height: 60, fill: "url(#glass)" });
    R(f, { x, y: 1330, width: w, height: 90, fill: "#c4c7cc" });
    P(f, `M ${x - 10} 700 L ${x + w * 0.2} 650 L ${x + w * 0.4 + 10} 700 Z M ${x + w * 0.6 - 10} 700 L ${x + w * 0.8} 650 L ${x + w + 10} 700 Z`, { fill: "#a7adb7" });
  });
  R(f, { x: -100, y: 1420, width: 1300, height: 160, fill: "#cfd5de" });
  for (let x = 0; x < 1080; x += 18) R(f, { x, y: 1440, width: 4, height: 140, fill: "#8a93a3" });
  R(f, { x: 0, y: 1436, width: 1080, height: 8, fill: "#9aa3b3" });
  R(f, { x: 640, y: 1250, width: 330, height: 330, fill: "#5b6b80" });
  R(f, { x: 620, y: 1226, width: 370, height: 30, rx: 4, fill: "#3c4454" });
  R(f, { x: 670, y: 1290, width: 270, height: 130, rx: 6, fill: "url(#glass)", stroke: "#d5dae2", "stroke-width": 6 });
  R(f, { x: 640, y: 1450, width: 330, height: 14, fill: GOLD });
  TX(f, { x: 805, y: 1520, "font-size": 34, fill: "#fff", "letter-spacing": 5 }, "PORTARIA");
  R(f, { x: 600, y: 1340, width: 34, height: 54, rx: 6, fill: "#11151f" }); R(f, { x: 606, y: 1346, width: 22, height: 30, rx: 3, fill: GREEN });
  R(f, { x: -100, y: 1580, width: 1300, height: 70, fill: "#c9c5bb" });
  s6.appendChild(M);   // a Maiane entra no palco de dia (mesma personagem dos outros reels)
}
function u6(lt, t) {
  stageUpdate(s6, lt, t);
  const k = ease(prog(lt, 0.1, 1.9)), walking = lt > 0.1 && lt < 2.0 ? Math.min(1, 1 - prog(lt, 1.7, 2.0)) : 0;
  const ph = lt * Math.PI * 3.6, mx = lerp(-260, 330, k);
  M.setAttribute("transform", `translate(${mx} ${1790 - Math.abs(Math.sin(ph)) * 10 * walking}) scale(0.92)`);
  MB.setAttribute("transform", `rotate(${Math.sin(ph) * 1.6 * walking} 0 -450)`);
  legL.setAttribute("transform", `translate(0 ${-Math.max(0, Math.sin(ph)) * 34 * walking})`);
  legR.setAttribute("transform", `translate(0 ${-Math.max(0, -Math.sin(ph)) * 34 * walking})`);
  const wave = ease(prog(lt, 2.1, 2.5));
  armL.setAttribute("transform", `rotate(${lerp(-Math.sin(ph) * 8 * walking, 150 + Math.sin(lt * 9) * 12, wave)} -106 -738)`);
  const up = ease(prog(lt, 3.6, 4.2));
  armR.setAttribute("transform", `rotate(${-8 * up} 112 -738)`);
  fore.setAttribute("transform", `rotate(${128 * up} 136 -575)`);
  phone.setAttribute("transform", `rotate(${-128 * up} 133 -470)`);
  screen.setAttribute("opacity", up); phone.querySelector(".pglow").setAttribute("opacity", 0);
  head.setAttribute("transform", `rotate(${Math.sin(t * 1.7) * 1.5} 0 -800)`);
}

const SCENES = [[s1, u1], [s2, u2], [s3, u3], [s4, u4], [s5, u5], [s6, u6]];

/* =====================================================================
   OVERLAY: títulos, transição dourada e selo
   ===================================================================== */
function title(num, l1, l2, y = 330) {
  const t = g(OV, { opacity: 0 }), inner = g(t, {});
  if (num) { C(inner, { cx: 540, cy: y - 150, r: 52, fill: GOLD }); TX(inner, { x: 540, y: y - 126, "font-size": 66, fill: INK }, num); }
  TX(inner, { x: 540, y, "font-size": 104, stroke: "#1f2430", "stroke-width": 14, "paint-order": "stroke", "letter-spacing": 2 }, l1);
  TX(inner, { x: 540, y: y + 112, "font-size": 104, fill: GOLD, stroke: "#1f2430", "stroke-width": 14, "paint-order": "stroke", "letter-spacing": 2 }, l2);
  t.inner = inner; return t;
}
function showTitle(tt, t, a, b) {
  tt.setAttribute("opacity", t < a || t > b ? 0 : fadeIO(t, a, b, 0.25));
  tt.inner.setAttribute("transform", `translate(0 ${lerp(-40, 0, ease(prog(t, a, a + 0.4)))})`);
}
const T0a = title(null, "DIA DE SOL", "NO CONDOMÍNIO", 420), T0b = title(null, "5 GESTOS DE", "BOA CONVIVÊNCIA", 420);
const TT = [title("1", "LIXO NO", "LUGAR CERTO"), title("2", "PET NA GUIA", "E SACOLINHA"), title("3", "DEVAGAR NA", "RUA INTERNA"),
  title("4", "CUIDE DO QUE", "É DE TODOS"), title("5", "GENTILEZA", "GERA GENTILEZA")];
const TF1 = title(null, "CONDOMÍNIO BOM", "SE FAZ JUNTO", 300), TF2 = title(null, "SALVA E MANDA", "NO GRUPO", 300);
const logo = g(OV, { opacity: 0 });
R(logo, { x: 250, y: 1700, width: 580, height: 104, rx: 52, fill: "#1f2430", stroke: GOLD, "stroke-width": 4 });
TX(logo, { x: 540, y: 1768, "font-size": 48, "font-weight": 800, fill: GOLD }, "@maiane.sindica");
const seal = g(OV, {});
R(seal, { x: 380, y: 52, width: 320, height: 56, rx: 28, fill: "rgba(31,36,48,.7)", stroke: GOLD, "stroke-width": 2 });
TX(seal, { x: 540, y: 90, "font-size": 28, "font-weight": 800, fill: GOLD }, "@maiane.sindica");
const wipe = g(OV, {});
P(wipe, "M 0 0 L 700 0 L 400 1920 L -300 1920 Z", { fill: GOLD });
P(wipe, "M 700 0 L 760 0 L 460 1920 L 400 1920 Z", { fill: "#fff3c4" });
const birds3d = g(OV, {});
const b3 = [0, 1, 2, 3, 4].map(() => P(birds3d, "M -16 0 Q -8 -10 0 0 Q 8 -10 16 0", { fill: "none", stroke: "#2b3346", "stroke-width": 3.5, "stroke-linecap": "round" }));
OV.appendChild(flash);

/* =====================================================================
   LINHA DO TEMPO
   ===================================================================== */
window.render = function (t) {
  document.getElementById("front").style.opacity = 0;
  // abertura 3D
  const open = t < 5.5;
  document.getElementById("cam").style.visibility = open ? "visible" : "hidden";
  birds3d.setAttribute("opacity", open ? 1 : 0);
  if (open) {
    const k = ease(prog(t, 0, 5.5));
    const tilt = lerp(56, 46, k), s = lerp(1.5, 2.1, k), rz = lerp(-24, 8, k), cx = lerp(450, 470, k), cy = lerp(520, 1180, k);
    document.getElementById("cam").style.perspective = "1500px";
    world.style.transform = `translate(540px, 1120px) rotateX(${tilt}deg) rotateZ(${rz}deg) scale3d(${s},${s},${s}) translate(${-cx}px, ${-cy}px)`;
    clouds3d.forEach((c, i) => {
      const x = c.x + t * 22, y = c.y + t * 6;
      c.sh.style.transform = `translate3d(${x}px,${y}px,0.5px)`;
      c.cl.style.transform = `translate3d(${x - 60}px,${y - 90}px,150px)`;
    });
    car.style.transform = "translate3d(-500px,0,0)";
    gate.style.transform = "translate3d(330px,1520px,0)";
    b3.forEach((b, i) => b.setAttribute("transform", `translate(${((t * (110 + i * 15) + i * 260) % 1400) - 150} ${700 + i * 60 + Math.sin(t * 2 + i) * 15}) scale(1 ${0.6 + 0.4 * Math.abs(Math.sin(t * 9 + i))})`));
  }
  showTitle(T0a, t, 0.4, 2.8); showTitle(T0b, t, 3.0, 5.4);
  // cenas 2D
  SCENES.forEach(([s, u], i) => {
    const [a, b] = SC[i], on = t >= a && t < b;
    s.setAttribute("opacity", on ? 1 : 0);
    if (on) u(t - a, t);
  });
  TT.forEach((tt, i) => showTitle(tt, t, SC[i][0] + 0.35, SC[i][1] - 0.1));
  showTitle(TF1, t, 36.4, 39.4); showTitle(TF2, t, 39.5, 42);
  logo.setAttribute("opacity", ease(prog(t, 39.7, 40.1)));
  seal.setAttribute("opacity", 1 - ease(prog(t, 39.5, 39.8)));
  // transição dourada nos cortes
  let wx = -2000;
  for (const c of [5.5, 11.5, 17.5, 23.5, 29.5, 35.5]) if (Math.abs(t - c) < 0.3) wx = lerp(-900, 1500, (t - c + 0.3) / 0.6);
  wipe.setAttribute("transform", `translate(${wx} 0)`);
  flash.setAttribute("opacity", 0);
};
window.render(0);
