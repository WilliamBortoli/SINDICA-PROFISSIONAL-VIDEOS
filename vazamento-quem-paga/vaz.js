/* Reel "Vazou pro vizinho: quem paga?" — v2, animação enriquecida.
   Enredo: drone entra pela janela da Dona Maria → TV queima → câmera sobe pela laje → Seu João troca a torneira →
   2 semanas pingando → infiltração → regra vertical/horizontal → caso → pegadinha → teste → Maiane.
   Narração contínua entra aos 2 s (mixar.py). Sem legenda no rodapé.
   Reaproveita os auxiliares de ../boa-convivencia/conv.js (palco D, person, title, chip, check, stage, wipe, Maiane). */

window.DURATION = 61;
const BLUE = "#3d8bfd", WATER = "#4aa3ff", RED = "#ff3b4e";
const KF = (t, keys) => {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
    const [a, ...va] = keys[i - 1], [b, ...vb] = keys[i], k = ease((t - a) / (b - a));
    return va.map((v, j) => lerp(v, vb[j], k));
  }
  return keys[keys.length - 1].slice(1);
};
const cyc = (t, per, off = 0) => (((t - off) % per) + per) % per / per;
const hash = (i) => { const x = Math.sin(i * 127.1) * 43758.5; return x - Math.floor(x); };
function drop(parent, s = 1) { const d = g(parent, { opacity: 0 }); P(d, `M 0 ${-16 * s} Q ${11 * s} 0 0 ${10 * s} Q ${-11 * s} 0 0 ${-16 * s} Z`, { fill: WATER }); C(d, { cx: -3 * s, cy: 0, r: 2.5 * s, fill: "#fff", opacity: 0.8 }); return d; }
function splash(parent, n, color = WATER) { return [...Array(n)].map(() => C(parent, { r: 4, fill: color, opacity: 0 })); }
function runSplash(ps, x, y, k, spread = 60, h = 50) {
  ps.forEach((p, i) => {
    const a = Math.PI * (0.15 + 0.7 * i / (ps.length - 1));
    p.setAttribute("cx", x + Math.cos(a) * spread * k * (i % 2 ? 1 : -1) * 0.8);
    p.setAttribute("cy", y - Math.sin(a) * h * k + 120 * k * k);
    p.setAttribute("opacity", k > 0 && k < 1 ? 1 - k : 0);
  });
}
function blobPath(r, seed) {
  let d = "";
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2, rr = r * (0.8 + 0.35 * hash(seed + (i % 24)));
    d += (i ? " L " : "M ") + (Math.cos(a) * rr).toFixed(1) + " " + (Math.sin(a) * rr * 0.45).toFixed(1);
  }
  return d + " Z";
}
D.querySelector("defs").insertAdjacentHTML("beforeend", `
  <pattern id="bp" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#3d8bfd" stroke-opacity=".25"/></pattern>
  <linearGradient id="tvsun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a76"/><stop offset="1" stop-color="#6a4c93"/></linearGradient>
  <clipPath id="tvclip"><rect x="575" y="895" width="350" height="240" rx="6"/></clipPath>
  <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6d0" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d0" stop-opacity="0"/></linearGradient>`);

/* =====================================================================
   3D: janela da Dona Maria piscando com a luz da TV (o drone entra por ela)
   ===================================================================== */
const mWin = div(world, "f", { width: "12px", height: "16px", background: "#9cc7ff", transform: `translate3d(555.4px,737px,${FLOOR + 3}px) rotateY(-90deg)` });
const mHalo = div(world, "f", { width: "70px", height: "70px", borderRadius: "50%", background: "radial-gradient(rgba(150,200,255,.7), rgba(150,200,255,0) 70%)", transform: `translate3d(555px,710px,${FLOOR - 27}px) rotateY(-90deg)` });

/* =====================================================================
   SALA DA DONA MARIA (close)
   ===================================================================== */
const MR = g(D, { opacity: 0 }), MRc = g(MR, {});
R(MRc, { x: -100, y: -100, width: 1280, height: 1700, fill: "#f6e3dc" });
for (let x = -100; x < 1180; x += 60) R(MRc, { x, y: 318, width: 22, height: 1240, fill: "#f0d6cd", opacity: 0.6 });
R(MRc, { x: -100, y: -100, width: 1280, height: 400, fill: "#fbf8f4" });
R(MRc, { x: -100, y: 300, width: 1280, height: 18, fill: "#e9dfd3" });
// mancha no teto (cresce), bolhas e trincas
const stainG = g(MRc, {});
const stainOut = P(stainG, blobPath(1, 3), { fill: "#d9c39a", opacity: 0.9 });
const stainIn = P(stainG, blobPath(0.6, 9), { fill: "#b89a6a", opacity: 0.9 });
const cracks = P(MRc, "M 640 312 L 610 290 L 590 296 M 760 312 L 800 286 L 830 292 M 700 316 L 712 270", { stroke: "#9a8f80", "stroke-width": 3, fill: "none", opacity: 0 });
const flakes = [0, 1, 2, 3].map(() => R(MRc, { width: 10, height: 6, fill: "#efe6d8", opacity: 0 }));
// janela com cortinas, céu, raio de sol e poeira
R(MRc, { x: 60, y: 470, width: 300, height: 510, fill: "url(#dsky)" });
C(MRc, { cx: 290, cy: 560, r: 40, fill: "#fff3b8" });
[[120, 900, 70, "#5d9e4c"], [230, 930, 90, "#4c8a3d"], [330, 910, 60, "#66a957"]].forEach(([x, y, r, c]) => C(MRc, { cx: x, cy: y, r, fill: c }));
R(MRc, { x: 60, y: 470, width: 300, height: 510, fill: "none", stroke: "#fffaf2", "stroke-width": 20 });
R(MRc, { x: 202, y: 470, width: 16, height: 510, fill: "#fffaf2" }); R(MRc, { x: 60, y: 716, width: 300, height: 16, fill: "#fffaf2" });
const curtL = P(MRc, "M 30 440 L 120 440 Q 100 700 140 1010 L 30 1010 Z", { fill: "#e9a23b" });
const curtR = P(MRc, "M 300 440 L 390 440 L 390 1010 L 280 1010 Q 320 700 300 440 Z", { fill: "#e9a23b" });
R(MRc, { x: 10, y: 430, width: 400, height: 14, rx: 7, fill: "#8a5a3c" });
P(MRc, "M 360 480 L 360 980 L 1000 1900 L 640 1900 Z", { fill: "url(#beam)" });
const dust = [...Array(14)].map(() => C(MRc, { r: 3, fill: "#fff", opacity: 0.6 }));
// quadros e relógio
R(MRc, { x: 430, y: 520, width: 110, height: 140, fill: "#fff", stroke: "#8a5a3c", "stroke-width": 8 }); C(MRc, { cx: 485, cy: 580, r: 28, fill: "#f4a261" });
R(MRc, { x: 980, y: 560, width: 90, height: 110, fill: "#fff", stroke: "#8a5a3c", "stroke-width": 8 }); P(MRc, "M 990 650 L 1020 600 L 1060 650 Z", { fill: "#2a9d8f" });
C(MRc, { cx: 800, cy: 620, r: 62, fill: "#fff", stroke: "#3d405b", "stroke-width": 8 });
const clkH = R(MRc, { x: 796, y: 585, width: 8, height: 40, rx: 4, fill: "#3d405b" }), clkM = R(MRc, { x: 797, y: 572, width: 6, height: 52, rx: 3, fill: "#e5484d" });
// chão, tapete
R(MRc, { x: -100, y: 1560, width: 1280, height: 460, fill: "#c99a6a" });
for (let y = 1600; y < 1920; y += 56) R(MRc, { x: -100, y, width: 1280, height: 3, fill: "#a87f52" });
E(MRc, { cx: 600, cy: 1720, rx: 440, ry: 90, fill: "#d97b66" }); E(MRc, { cx: 600, cy: 1720, rx: 380, ry: 66, fill: "none", stroke: "#f4d6a0", "stroke-width": 6 });
// rack, planta, TV
R(MRc, { x: 540, y: 1160, width: 440, height: 130, rx: 10, fill: "#8a5a3c" });
R(MRc, { x: 560, y: 1290, width: 16, height: 60, fill: "#6b4429" }); R(MRc, { x: 944, y: 1290, width: 16, height: 60, fill: "#6b4429" });
R(MRc, { x: 900, y: 1080, width: 60, height: 80, rx: 8, fill: "#e76f51" });
const plant = g(MRc, {});
[[-30, "#4c9a44"], [0, "#3f8a3a"], [28, "#57a84d"]].forEach(([a, c]) => P(plant, "M 930 1082 Q 920 1010 930 960 Q 950 1010 930 1082 Z", { fill: c, transform: `rotate(${a} 930 1082)` }));
const tvLight = E(MRc, { cx: 750, cy: 1020, rx: 330, ry: 260, fill: "#9cc7ff", opacity: 0.2 });
R(MRc, { x: 560, y: 880, width: 380, height: 270, rx: 14, fill: "#141519" });
const tvC = g(MRc, { "clip-path": "url(#tvclip)" });
R(tvC, { x: 575, y: 895, width: 350, height: 240, fill: "url(#tvsun)" });
const tvSun = C(tvC, { cx: 750, cy: 1050, r: 50, fill: "#ffd166" });
const tvPpl = g(tvC, {});
[[680, "#2b2d42"], [820, "#2b2d42"]].forEach(([x, c]) => { C(tvPpl, { cx: x, cy: 1050, r: 20, fill: c }); R(tvPpl, { x: x - 26, y: 1068, width: 52, height: 70, rx: 20, fill: c }); });
const tvHearts = [0, 1, 2].map(() => sv("text", { "font-size": 30, "text-anchor": "middle" }, tvC, "❤️"));
const tvOff = R(tvC, { x: 575, y: 895, width: 350, height: 240, fill: "#08090c", opacity: 0 });
const tvLine = R(tvC, { x: 575, y: 1012, width: 350, height: 6, fill: "#fff", opacity: 0 });
const tvGlitch = [0, 1, 2, 3].map((i) => R(tvC, { x: 575, y: 900 + i * 60, width: 350, height: 14, fill: i % 2 ? "#ff3b6b" : "#2de2e6", opacity: 0 }));
// sofá, gato, Dona Maria sentada com o controle
R(MRc, { x: 30, y: 1150, width: 500, height: 190, rx: 40, fill: "#6c8ebf" });
R(MRc, { x: 30, y: 1300, width: 500, height: 140, rx: 30, fill: "#7fa1d2" });
R(MRc, { x: 0, y: 1230, width: 86, height: 250, rx: 30, fill: "#5f80b0" });
R(MRc, { x: 60, y: 1440, width: 20, height: 50, fill: "#3d405b" }); R(MRc, { x: 480, y: 1440, width: 20, height: 50, fill: "#3d405b" });
const cat = g(MRc, {});
E(cat, { cx: 0, cy: 0, rx: 52, ry: 28, fill: "#8d8d8d" }); C(cat, { cx: 44, cy: -18, r: 22, fill: "#8d8d8d" });
P(cat, "M 30 -34 L 36 -54 L 48 -36 Z M 50 -36 L 62 -52 L 64 -30 Z", { fill: "#7a7a7a" });
P(cat, "M -50 4 Q -86 -10 -70 -40", { stroke: "#8d8d8d", "stroke-width": 12, fill: "none", "stroke-linecap": "round" });
const zzz = TX(MRc, { x: 160, y: 1200, "font-size": 34, fill: "#6b7280" }, "z z");
const catAlert = TX(MRc, { x: 160, y: 1140, "font-size": 60, fill: "#e5484d", opacity: 0 }, "!");
const maria = person(MRc, { top: "#9b5de5", pants: "#6d597a", hair: "#d7d7d7", pony: true, s: 1.0 });
const remote = g(maria.parts.hand, {}); R(remote, { x: -10, y: -214, width: 20, height: 46, rx: 6, fill: "#2b2d42" }); C(remote, { cx: 0, cy: -204, r: 3, fill: "#e5484d" });
const mDrops = [0, 1].map(() => drop(MRc, 1.5));
const mSplash = splash(MRc, 8);
const spark = g(MRc, { opacity: 0 });
for (let i = 0; i < 10; i++) R(spark, { x: 697, y: 760, width: 7, height: 70, rx: 3, fill: i % 2 ? "#ffd60a" : "#fff", transform: `rotate(${i * 36} 700 880)` });
const flashC = C(MRc, { cx: 700, cy: 880, r: 120, fill: "#fffbe6", opacity: 0 });
const smoke = [0, 1, 2, 3].map((i) => C(MRc, { r: 30 + i * 8, fill: "#9a9ea6", opacity: 0 }));

/* =====================================================================
   PASSAGEM PELA LAJE (a câmera sobe para o andar de cima)
   ===================================================================== */
const SLABX = g(D, { opacity: 0 });
R(SLABX, { x: 0, y: 0, width: 1080, height: 700, fill: "#9aa0a8" });
for (let x = -700; x < 1080; x += 40) P(SLABX, `M ${x} 700 L ${x + 700} 0`, { stroke: "#868c94", "stroke-width": 4 });
R(SLABX, { x: 0, y: 320, width: 1080, height: 40, fill: "#b8c0ca" });
R(SLABX, { x: 0, y: 330, width: 1080, height: 8, fill: "#fff", opacity: 0.5 });
const slabDrops = [0, 1, 2, 3].map(() => drop(SLABX, 1.4));

/* =====================================================================
   COZINHA DO SEU JOÃO (close)
   ===================================================================== */
const KC = g(D, { opacity: 0 }), KCc = g(KC, {});
R(KCc, { x: -300, y: -300, width: 1680, height: 1820, fill: "#eef3f6" });
for (let y = 300; y < 1150; y += 70) R(KCc, { x: -300, y, width: 1680, height: 2, fill: "#d9e2e8" });
for (let x = 0; x < 1080; x += 70) R(KCc, { x, y: 300, width: 2, height: 850, fill: "#d9e2e8" });
R(KCc, { x: 80, y: 360, width: 300, height: 330, rx: 10, fill: "url(#dsky)", stroke: "#fff", "stroke-width": 16 });
C(KCc, { cx: 300, cy: 430, r: 34, fill: "#fff3b8" });
P(KCc, "M 380 380 L 380 690 L 900 1500 L 600 1500 Z", { fill: "url(#beam)" });
R(KCc, { x: 70, y: 690, width: 320, height: 16, fill: "#d6d0c4" });
R(KCc, { x: 150, y: 620, width: 60, height: 70, rx: 8, fill: "#e76f51" });
const kPlant = g(KCc, {});
[[-25, "#4c9a44"], [5, "#3f8a3a"], [30, "#57a84d"]].forEach(([a, c]) => P(kPlant, "M 180 622 Q 170 570 180 530 Q 196 570 180 622 Z", { fill: c, transform: `rotate(${a} 180 622)` }));
// relógio e calendário (giram/viram nas "2 semanas")
C(KCc, { cx: 560, cy: 470, r: 52, fill: "#fff", stroke: "#3d405b", "stroke-width": 7 });
const kH = R(KCc, { x: 557, y: 440, width: 6, height: 34, rx: 3, fill: "#3d405b" }), kM = R(KCc, { x: 558, y: 428, width: 4, height: 46, rx: 2, fill: "#e5484d" });
R(KCc, { x: 820, y: 400, width: 170, height: 200, rx: 8, fill: "#fff", stroke: "#c9ced6", "stroke-width": 3 });
R(KCc, { x: 820, y: 400, width: 170, height: 50, rx: 8, fill: "#e5484d" });
const calNum = TX(KCc, { x: 905, y: 545, "font-size": 80, fill: "#2b2d42" }, "1");
const calPage = R(KCc, { x: 820, y: 450, width: 170, height: 150, fill: "#fff", opacity: 0 });
// piso e caixa de ferramentas
R(KCc, { x: -300, y: 1500, width: 1680, height: 620, fill: "#c89f6f" });
for (let y = 1530; y < 1960; y += 60) R(KCc, { x: -300, y, width: 1680, height: 3, fill: "#a87f52" });
R(KCc, { x: 90, y: 1650, width: 200, height: 100, rx: 10, fill: "#d62828" }); R(KCc, { x: 150, y: 1625, width: 80, height: 30, rx: 8, fill: "none", stroke: "#8b1e1e", "stroke-width": 8 });
R(KCc, { x: 110, y: 1660, width: 160, height: 10, fill: "#8b1e1e" });
// bancada, armário aberto, cuba, encanamento
R(KCc, { x: 300, y: 1180, width: 640, height: 320, fill: "#3b3f47" });
const mold = [...Array(9)].map((_, i) => C(KCc, { cx: 760 + hash(i) * 160, cy: 1460 + hash(i + 9) * 30, r: 0, fill: "#6b7b5a", opacity: 0.7 }));
R(KCc, { x: 300, y: 1180, width: 70, height: 320, fill: "#fff", stroke: "#d6d0c4", "stroke-width": 3 });
R(KCc, { x: 870, y: 1180, width: 70, height: 320, fill: "#fff", stroke: "#d6d0c4", "stroke-width": 3 });
R(KCc, { x: 280, y: 1140, width: 680, height: 42, rx: 6, fill: "#8b8f96" });
R(KCc, { x: 480, y: 1182, width: 240, height: 70, rx: 12, fill: "#c5ccd4" });
const ripples = [0, 1, 2].map(() => E(KCc, { cx: 760, cy: 1176, rx: 10, ry: 3, fill: "none", stroke: "#fff", "stroke-width": 3, opacity: 0 }));
P(KCc, "M 600 1252 L 600 1330 Q 600 1380 650 1380 Q 700 1380 700 1330 L 700 1300", { stroke: "#cfd5dc", "stroke-width": 22, fill: "none" });
R(KCc, { x: 860, y: 1390, width: 60, height: 40, rx: 8, fill: "#c0c6cf" });
P(KCc, "M 640 1252 Q 660 1420 860 1410", { stroke: "#c9ced6", "stroke-width": 12, fill: "none", "stroke-dasharray": "6 4" });
C(KCc, { cx: 858, cy: 1410, r: 14, fill: "#b5bcc5", stroke: "#8b929b", "stroke-width": 3 });
// escorredor e celular com tutorial
R(KCc, { x: 800, y: 1080, width: 130, height: 60, rx: 8, fill: "none", stroke: "#9aa3ad", "stroke-width": 5 });
[0, 1, 2].forEach((i) => E(KCc, { cx: 830 + i * 30, cy: 1075, rx: 12, ry: 40, fill: "#fff", stroke: "#d6dce3", "stroke-width": 3 }));
R(KCc, { x: 380, y: 1040, width: 56, height: 100, rx: 10, fill: "#0b0d12", transform: "rotate(-12 408 1090)" });
const tut = g(KCc, { transform: "rotate(-12 408 1090)" });
R(tut, { x: 385, y: 1048, width: 46, height: 84, rx: 6, fill: "#e5484d" });
P(tut, "M 400 1075 L 400 1105 L 422 1090 Z", { fill: "#fff" });
// torneira velha (sai) e nova (entra)
function faucetShape(parent, c1, c2) {
  const f = g(parent, {});
  P(f, "M 640 1140 L 640 1010 Q 640 950 700 950 Q 760 950 760 1010 L 760 1040", { stroke: c1, "stroke-width": 26, fill: "none", "stroke-linecap": "round" });
  P(f, "M 640 1140 L 640 1010 Q 640 950 700 950", { stroke: "#fff", "stroke-width": 6, fill: "none", opacity: 0.6 });
  R(f, { x: 610, y: 1100, width: 60, height: 40, rx: 8, fill: c2 });
  return f;
}
const oldF = faucetShape(KCc, "#a9a49a", "#8f8a80");
const newF = faucetShape(KCc, "#d7dee6", "#b9c1ca");
const shine = [0, 1, 2].map((i) => TX(KCc, { "font-size": 40, opacity: 0 }, "✨"));
const fBox = g(KCc, { opacity: 0 }); R(fBox, { x: 330, y: 1060, width: 110, height: 80, rx: 6, fill: "#f4a261" }); TX(fBox, { x: 385, y: 1112, "font-size": 24, fill: "#1f2430" }, "NOVA");
const stream = R(KCc, { x: 752, y: 1052, width: 16, height: 0, rx: 8, fill: WATER, opacity: 0 });
const streamHi = R(KCc, { x: 757, y: 1052, width: 4, height: 0, fill: "#fff", opacity: 0 });
const basinSplash = splash(KCc, 8);
// o pingo na conexão
const kDrops = [0, 1].map(() => drop(KCc));
const kSplash = splash(KCc, 6);
const kPuddle = E(KCc, { cx: 858, cy: 1492, rx: 0, ry: 7, fill: WATER, opacity: 0.85 });
const ominous = drop(KCc, 0.7);
// Seu João
const jk = person(KCc, { top: "#2a9d8f", pants: "#2c3e50", hair: "#3b2a1e", s: 1.05 });
const wrench = g(jk.parts.hand, { opacity: 0 });
R(wrench, { x: -7, y: -250, width: 14, height: 80, rx: 6, fill: "#8d939c" });
P(wrench, "M -16 -262 L -16 -240 L -4 -240 L -4 -250 L 4 -250 L 4 -240 L 16 -240 L 16 -262 Z", { fill: "#8d939c" });
const handBox = g(jk.parts.hand, { opacity: 0 }); R(handBox, { x: -50, y: -200, width: 100, height: 70, rx: 6, fill: "#f4a261" });
const clic = [0, 1].map((i) => TX(KCc, { "font-size": 34, fill: "#1f2430", opacity: 0 }, "clic"));
const arcs = P(KCc, "M 470 1000 A 60 60 0 0 1 560 960 M 480 1030 A 80 80 0 0 1 580 975", { stroke: "#1f2430", "stroke-width": 4, fill: "none", opacity: 0 });
const thumbs = TX(KCc, { x: 300, y: 1000, "font-size": 100, opacity: 0 }, "👍");
const notes = [0, 1, 2].map((i) => TX(KCc, { "font-size": 50, fill: "#3d405b", opacity: 0 }, i % 2 ? "♫" : "♪"));
const dayChip = chip(KC, 540, 900, "💧 dia 14", "#5b8def"), dayTxt = dayChip.querySelector("text");

/* =====================================================================
   CORTE DO PRÉDIO (raio-X): prumada vertical + ramais horizontais
   ===================================================================== */
const CT = g(D, { opacity: 0 }), CTc = g(CT, {});
R(CTc, { x: -400, y: -400, width: 1880, height: 2720, fill: "url(#dsky)" });
R(CTc, { x: -400, y: 1760, width: 1880, height: 600, fill: "url(#lawn)" });
const SLAB = [500, 800, 1100, 1400, 1700];
R(CTc, { x: 70, y: 440, width: 940, height: 60, fill: "#a7adb7" });
R(CTc, { x: 70, y: 500, width: 940, height: 1226, fill: "#efe5cf" });
const ROOM = [["#eaf2f7", "#c9b38f"], ["#f6efe2", "#d1b48c"], ["#fbf2f2", "#b98e62"], ["#eef6ee", "#c9b38f"]];
for (let k = 0; k < 4; k++) {
  const y = SLAB[k] + 26, h = SLAB[k + 1] - y;
  R(CTc, { x: 100, y, width: 720, height: h, fill: ROOM[k][0] });
  R(CTc, { x: 100, y: y + h - 18, width: 720, height: 18, fill: ROOM[k][1] });
  R(CTc, { x: 84, y: y + 50, width: 16, height: 150, fill: "url(#glass)" });
}
for (const y of SLAB) { R(CTc, { x: 70, y, width: 940, height: 26, fill: "#9aa0a8" }); for (let x = 80; x < 1000; x += 26) P(CTc, `M ${x} ${y + 26} L ${x + 14} ${y}`, { stroke: "#868c94", "stroke-width": 2 }); }
R(CTc, { x: 820, y: 500, width: 120, height: 1226, fill: "#d9d2c3" });
const colX = 870;
R(CTc, { x: colX, y: 470, width: 24, height: 1300, rx: 6, fill: "#a9b1bb" });
const branchY = SLAB.slice(1).map((s) => s - 66);
branchY.forEach((y) => R(CTc, { x: 600, y, width: colX - 600 + 4, height: 14, rx: 6, fill: "#a9b1bb" }));
R(CTc, { x: 160, y: 700, width: 240, height: 70, rx: 10, fill: "#9db4d8" }); R(CTc, { x: 160, y: 680, width: 70, height: 30, rx: 8, fill: "#fff" });
R(CTc, { x: 520, y: 1580, width: 160, height: 100, rx: 8, fill: "#8fbf8f" }); C(CTc, { cx: 300, cy: 1620, r: 40, fill: "#e9c46a" });
R(CTc, { x: 480, y: 940, width: 250, height: 150, fill: "#fff", stroke: "#d6d0c4", "stroke-width": 3 });
R(CTc, { x: 470, y: 925, width: 270, height: 18, fill: "#8b8f96" });
P(CTc, "M 600 925 L 600 880 Q 600 860 630 860 L 650 860 L 650 875", { stroke: "#b8c0ca", "stroke-width": 10, fill: "none", "stroke-linecap": "round" });
const joao = person(CTc, { top: "#2a9d8f", pants: "#2c3e50", hair: "#3b2a1e", s: 0.5 });
const leakJ = [612, branchY[1] + 7];
const puddle = E(CTc, { cx: 612, cy: 1092, rx: 0, ry: 6, fill: WATER, opacity: 0.8 });
const seepDrops = [...Array(6)].map(() => C(CTc, { r: 5, fill: WATER, opacity: 0 }));
const seep = R(CTc, { x: 575, y: 1100, width: 70, height: 0, fill: WATER, opacity: 0.6 });
R(CTc, { x: 150, y: 1310, width: 250, height: 80, rx: 18, fill: "#6c8ebf" }); R(CTc, { x: 150, y: 1280, width: 60, height: 70, rx: 14, fill: "#5f80b0" });
R(CTc, { x: 520, y: 1355, width: 180, height: 45, fill: "#7a5a3c" });
R(CTc, { x: 515, y: 1225, width: 190, height: 120, rx: 8, fill: "#16181d" });
R(CTc, { x: 525, y: 1235, width: 170, height: 100, rx: 4, fill: "#08090c" });
const ctStain = P(CTc, blobPath(70, 5), { fill: "#b8996a", opacity: 0, transform: "translate(608 1132)" });
const mariaCT = person(CTc, { top: "#9b5de5", pants: "#6d597a", hair: "#d7d7d7", pony: true, s: 0.55, dir: -1 });
const ctDrops = [0, 1, 2].map(() => drop(CTc));
// raio-X e destaques
const xray = R(CTc, { x: 70, y: 440, width: 940, height: 1290, fill: "url(#bp)", opacity: 0 });
const dim = R(CTc, { x: 70, y: 440, width: 940, height: 1290, fill: "#fff", opacity: 0 });
const scan = R(CTc, { x: 50, y: 0, width: 980, height: 14, fill: BLUE, opacity: 0, filter: "url(#soft6)" });
const colGlow = R(CTc, { x: colX - 8, y: 470, width: 40, height: 1300, rx: 14, fill: GOLD, opacity: 0, filter: "url(#soft6)" });
const colHi = R(CTc, { x: colX, y: 470, width: 24, height: 1300, rx: 6, fill: GOLD, opacity: 0 });
const colFlow = P(CTc, `M ${colX + 12} 470 L ${colX + 12} 1770`, { stroke: "#fff", "stroke-width": 6, "stroke-dasharray": "18 26", fill: "none", opacity: 0 });
const brHi = branchY.map((y) => R(CTc, { x: 600, y, width: colX - 600 + 4, height: 14, rx: 6, fill: BLUE, opacity: 0 }));
const brFlow = branchY.map((y) => P(CTc, `M ${colX} ${y + 7} L 600 ${y + 7}`, { stroke: "#fff", "stroke-width": 5, "stroke-dasharray": "14 20", fill: "none", opacity: 0 }));
const leakMark = g(CTc, { opacity: 0 }); C(leakMark, { r: 26, fill: "none", stroke: RED, "stroke-width": 6 }); C(leakMark, { r: 9, fill: RED });
const spray = splash(CTc, 10);
const colLeak = g(CTc, { opacity: 0 }); C(colLeak, { r: 26, fill: "none", stroke: RED, "stroke-width": 6 }); C(colLeak, { r: 9, fill: RED });
const colSpray = splash(CTc, 10);
const trace = P(CTc, `M 608 1150 L 608 ${leakJ[1] + 20}`, { stroke: RED, "stroke-width": 6, "stroke-dasharray": "14 10", fill: "none", opacity: 0 });
const loupe = TX(CTc, { "font-size": 64, opacity: 0 }, "🔎");
const tagV = chip(CTc, 600, 610, "🏢 VERTICAL · CONDOMÍNIO", GOLD);
const tagH = chip(CTc, 450, 680, "🏠 HORIZONTAL · PROPRIETÁRIO", BLUE);

/* =====================================================================
   FINAL: Maiane num dia de sol (palco do conv.js)
   ===================================================================== */
const FN = stage({ trees: [[960, 1450, 1], [110, 1460, 0.8]] });
FN.appendChild(M);

/* =====================================================================
   OVERLAY
   ===================================================================== */
const T = {
  gancho: title(null, "QUEM PAGA", "A TV?", 300),
  diy: title(null, "FAÇA VOCÊ", "MESMO?", 300),
  semanas: title(null, "2 SEMANAS", "DEPOIS", 300),
  pingou: title(null, "PINGOU SEM", "NINGUÉM VER", 300),
  agora: title(null, "E AGORA,", "QUEM PAGA?", 300),
  vert: title(null, "VERTICAL", "= CONDOMÍNIO", 270),
  hor: title(null, "HORIZONTAL", "= PROPRIETÁRIO", 270),
  joao: title(null, "QUEM PAGA?", "SEU JOÃO", 270),
  origem: title(null, "O QUE VALE", "É A ORIGEM", 270),
  teste: title(null, "E SE VAZAR", "NA COLUNA?", 270),
  cond: title(null, "AÍ É COM O", "CONDOMÍNIO", 270),
  sindica: title(null, "VAZOU? CHAMA", "A SÍNDICA", 300),
  salva: title(null, "SALVA E MANDA", "NO GRUPO", 300),
};
T.hor.inner.lastChild.setAttribute("fill", BLUE);
const note = chip(OV, 540, 520, "Regra comum nas convenções · confira a do seu", "#8a93a3");
const okCond = check(OV, 540, 720);
// recibo do conserto
const receipt = g(OV, { opacity: 0 });
P(receipt, "M 300 1180 L 780 1180 L 780 1560 L 760 1580 L 740 1560 L 720 1580 L 700 1560 L 680 1580 L 660 1560 L 640 1580 L 620 1560 L 600 1580 L 580 1560 L 560 1580 L 540 1560 L 520 1580 L 500 1560 L 480 1580 L 460 1560 L 440 1580 L 420 1560 L 400 1580 L 380 1560 L 360 1580 L 340 1560 L 320 1580 L 300 1560 Z", { fill: "#fff", stroke: "#d6d0c4", "stroke-width": 3 });
TX(receipt, { x: 540, y: 1250, "font-size": 40, fill: "#1f2430" }, "🧾 CONSERTO");
TX(receipt, { x: 540, y: 1320, "font-size": 30, "font-weight": 700, fill: "#4a5160" }, "cano + TV da vizinha");
R(receipt, { x: 340, y: 1360, width: 400, height: 3, fill: "#d6d0c4" });
TX(receipt, { x: 540, y: 1440, "font-size": 34, fill: RED }, "Quem paga: Seu João");
const cd = g(OV, { opacity: 0 });
C(cd, { cx: 540, cy: 1100, r: 130, fill: "rgba(31,36,48,.85)" });
const cdRing = C(cd, { cx: 540, cy: 1100, r: 130, fill: "none", stroke: GOLD, "stroke-width": 10, "stroke-dasharray": 2 * Math.PI * 130, transform: "rotate(-90 540 1100)" });
const cdNum = TX(cd, { x: 540, y: 1170, "font-size": 190 }, "3");
const logo2 = g(OV, { opacity: 0 });
R(logo2, { x: 250, y: 1720, width: 580, height: 104, rx: 52, fill: "#1f2430", stroke: GOLD, "stroke-width": 4 });
TX(logo2, { x: 540, y: 1788, "font-size": 48, "font-weight": 800, fill: GOLD }, "@maiane.sindica");
// moldura da janela que o drone atravessa
const winFrame = g(OV, { opacity: 0 });
P(winFrame, "M -2000 -2000 H 3080 V 3920 H -2000 Z M 390 760 V 1160 H 690 V 760 Z", { fill: "#efe5cf", "fill-rule": "evenodd" });
R(winFrame, { x: 390, y: 760, width: 300, height: 400, fill: "none", stroke: "#fffaf2", "stroke-width": 22 });
R(winFrame, { x: 532, y: 760, width: 16, height: 400, fill: "#fffaf2" });
const whiteFlash = R(OV, { width: 1080, height: 1920, fill: "#fff", opacity: 0 });
OV.appendChild(wipe); OV.appendChild(seal);

/* =====================================================================
   LINHA DO TEMPO
   ===================================================================== */
const CAM3D = [[0, 40, 1.3, -10, 470, 1150, 0], [1.4, 60, 2.2, -50, 520, 900, 10], [3.0, 80, 5.6, -90, 556, 745, FLOOR + 10]];
const CTCAM = [[21.6, 600, 1140, 1.6], [24, 600, 1140, 1.6], [31, 540, 1110, 1.0], [42.6, 540, 1110, 1.0], [43.6, 600, 1000, 1.5], [47.6, 600, 1000, 1.5],
  [48.6, 600, 1110, 1.3], [51.6, 600, 1110, 1.3], [52.4, 540, 1110, 1.0]];
const KCAM = [[7.6, 600, 1220, 1.0], [14.2, 600, 1220, 1.0], [15.4, 820, 1360, 1.7], [16.8, 840, 1400, 2.4], [21.6, 840, 1400, 2.4]];

function renderMaria(t, phase) {          // phase 0 = gancho, 1 = dano
  const sparkAt = phase ? 27.6 : 5.0, base = phase ? 24 : 3.0;
  const shake = t > sparkAt && t < sparkAt + 0.5 ? (hash(Math.floor(t * 40)) - 0.5) * 24 : 0;
  const z = phase ? lerp(1.0, 1.12, prog(t, 24, 31)) : lerp(1.15, 1.0, ease(prog(t, 3.0, 4.0)));
  MRc.setAttribute("transform", `translate(${shake} ${shake * 0.6}) translate(540 960) scale(${z}) translate(-540 -960)`);
  // ambiente vivo
  curtL.setAttribute("transform", `skewX(${Math.sin(t * 1.6) * 3})`); curtR.setAttribute("transform", `skewX(${-Math.sin(t * 1.6 + 1) * 3})`);
  dust.forEach((d, i) => { const k = cyc(t, 6 + hash(i) * 4, hash(i + 3) * 8); d.setAttribute("cx", 380 + k * 500 + hash(i) * 120); d.setAttribute("cy", 520 + k * 900 + Math.sin(t + i) * 20); d.setAttribute("opacity", Math.sin(k * Math.PI) * 0.7); });
  plant.setAttribute("transform", `rotate(${Math.sin(t * 1.3) * 2} 930 1082)`);
  clkM.setAttribute("transform", `rotate(${t * 36} 800 620)`); clkH.setAttribute("transform", `rotate(${t * 3} 800 620)`);
  // mancha no teto
  const sk = phase ? ease(prog(t, 24, 26.6)) : 1;
  stainG.setAttribute("transform", `translate(700 318) scale(${lerp(0.01, 110, sk)})`);
  stainIn.setAttribute("opacity", 0.9 * sk);
  cracks.setAttribute("opacity", phase ? prog(t, 25.5, 26.5) : 1);
  flakes.forEach((f, i) => { const k = cyc(t, 2.2, i * 0.55); f.setAttribute("x", 650 + i * 30); f.setAttribute("y", 320 + k * 1200); f.setAttribute("opacity", phase && t > 25.4 && t < 29 ? (1 - k) : 0); f.setAttribute("transform", `rotate(${k * 360} ${655 + i * 30} ${320 + k * 1200})`); });
  // gotas e respingos sobre a TV
  const dropStart = phase ? 26.2 : 3.6;
  mDrops.forEach((d, i) => {
    const per = 0.85, k = cyc(t, per, dropStart + i * 0.42);
    const on = t > dropStart + i * 0.42 && t < sparkAt + 1.4;
    d.setAttribute("opacity", on ? 1 : 0);
    d.setAttribute("transform", `translate(${700 + i * 14} ${k < 0.35 ? 330 : lerp(330, 880, ((k - 0.35) / 0.65) ** 2)}) scale(${k < 0.35 ? 0.3 + k * 2 : 1})`);
  });
  runSplash(mSplash, 700, 880, cyc(t, 0.85, dropStart + 0.85) * 2.2 * (t > dropStart + 0.85 && t < sparkAt + 1.4 ? 1 : 0), 70, 70);
  // TV: novela → falha → desliga
  const on = t < sparkAt;
  tvSun.setAttribute("cy", 1050 - Math.sin(t * 0.8) * 30);
  tvPpl.setAttribute("transform", `translate(${Math.sin(t * 2) * 8} 0)`);
  tvHearts.forEach((h, i) => { const k = cyc(t, 2, i * 0.66); h.setAttribute("x", 720 + i * 40); h.setAttribute("y", 1060 - k * 140); h.setAttribute("opacity", on ? Math.sin(k * Math.PI) : 0); });
  const gl = t > sparkAt - 0.4 && t < sparkAt + 0.1;
  tvGlitch.forEach((r, i) => { r.setAttribute("opacity", gl ? 0.8 : 0); r.setAttribute("transform", `translate(${(hash(Math.floor(t * 30) + i) - 0.5) * 60} 0)`); });
  const offK = prog(t, sparkAt + 0.05, sparkAt + 0.35);
  tvOff.setAttribute("opacity", t > sparkAt + 0.05 ? 1 : 0);
  tvLine.setAttribute("opacity", offK > 0 && offK < 1 ? 1 : 0);
  tvLine.setAttribute("transform", `translate(750 1015) scale(${1 - offK} 1) translate(-750 -1015)`);
  tvLight.setAttribute("opacity", on ? 0.18 + 0.06 * Math.sin(t * 9) : 0);
  const spk = prog(t, sparkAt, sparkAt + 0.5);
  spark.setAttribute("opacity", spk > 0 && spk < 1 ? 1 - spk : 0);
  spark.setAttribute("transform", `translate(700 880) scale(${0.5 + spk}) rotate(${spk * 40}) translate(-700 -880)`);
  flashC.setAttribute("opacity", spk > 0 && spk < 1 ? (1 - spk) * 0.8 : 0); flashC.setAttribute("r", 80 + spk * 200);
  smoke.forEach((c, i) => { const k = prog(t, sparkAt + 0.2 + i * 0.2, sparkAt + 2.6 + i * 0.2); c.setAttribute("cx", 690 + i * 22 + k * 40); c.setAttribute("cy", 870 - k * 260); c.setAttribute("opacity", k > 0 && k < 1 ? 0.55 * (1 - k) : 0); });
  // Dona Maria sentada; levanta assustada
  const panic = ease(prog(t, sparkAt + 0.15, sparkAt + 0.45));
  const jump = panic * Math.abs(Math.sin(prog(t, sparkAt + 0.15, sparkAt + 0.65) * Math.PI)) * 40;
  placePerson(maria, 330, 1490 - jump);
  walk(maria, 0, 0, lerp(-55, -168, panic));
  maria.parts.armB.setAttribute("transform", `rotate(${lerp(0, -160, panic)} 0 -312)`);
  maria.parts.legF.setAttribute("transform", `rotate(${lerp(-82, -40, panic)} 0 -180)`);
  maria.parts.legB.setAttribute("transform", `rotate(${lerp(-78, -30, panic)} 0 -180)`);
  remote.setAttribute("opacity", panic < 0.5 ? 1 : 0);
  // gato dorme; pula no estalo
  const cj = prog(t, sparkAt + 0.1, sparkAt + 0.8);
  cat.setAttribute("transform", `translate(${lerp(150, -120, cj)} ${1290 - Math.sin(cj * Math.PI) * 220 + Math.sin(t * 2) * 2 * (1 - cj)})`);
  zzz.setAttribute("opacity", t < sparkAt ? 0.4 + 0.4 * Math.sin(t * 2) : 0);
  catAlert.setAttribute("opacity", cj > 0 && cj < 1 ? 1 : 0);
}

window.render = function (t) {
  document.getElementById("front").style.opacity = 0;
  birds3d.setAttribute("opacity", 0);
  SCENES.forEach(([s]) => s.setAttribute("opacity", 0));
  const in3D = t < 3.25, inMR = (t >= 3.0 && t < 7.6) || (t >= 24 && t < 31), inSL = t >= 7.0 && t < 8.0;
  const inKC = t >= 7.6 && t < 21.6, inCT = t >= 21.6 && t < 24 || (t >= 31 && t < 56), inFN = t >= 56;
  // ---------- drone ----------
  document.getElementById("cam").style.visibility = in3D ? "visible" : "hidden";
  if (in3D) {
    const [tilt, s, rz, cx, cy, cz] = KF(t, CAM3D);
    document.getElementById("cam").style.perspective = "1500px";
    world.style.transform = `translate(540px, 960px) rotateX(${tilt}deg) rotateZ(${rz}deg) scale3d(${s},${s},${s}) translate3d(${-cx}px, ${-cy}px, ${-cz}px)`;
    const fl = 0.6 + 0.4 * Math.abs(Math.sin(t * 7));
    mWin.style.opacity = fl; mHalo.style.opacity = fl * ease(prog(t, 0.6, 1.6));
    mWin.style.background = `hsl(${200 + Math.sin(t * 5) * 30},90%,75%)`;
    clouds3d.forEach((c) => { const x = c.x + t * 22, y = c.y + t * 6; c.sh.style.transform = `translate3d(${x}px,${y}px,0.5px)`; c.cl.style.transform = `translate3d(${x - 60}px,${y - 90}px,150px)`; });
    car.style.transform = "translate3d(-500px,0,0)"; gate.style.transform = "translate3d(330px,1520px,0)";
  }
  // a moldura da janela cresce e a gente "entra" na sala
  const wk = prog(t, 2.6, 3.4);
  winFrame.setAttribute("opacity", wk > 0 && wk < 1 ? 1 : 0);
  winFrame.setAttribute("transform", `translate(540 960) scale(${lerp(0.5, 6, ease(wk))}) translate(-540 -960)`);
  whiteFlash.setAttribute("opacity", Math.max(0, 1 - Math.abs(t - 3.0) / 0.25) * 0.7 + Math.max(0, 1 - Math.abs(t - 24) / 0.2) * 0.6 + Math.max(0, 1 - Math.abs(t - 21.6) / 0.2) * 0.5);
  // ---------- sala da Dona Maria ----------
  MR.setAttribute("opacity", inMR ? (t < 7.6 ? 1 - ease(prog(t, 7.3, 7.6)) : 1) : 0);
  if (inMR) renderMaria(t, t >= 24 ? 1 : 0);
  // ---------- subindo pela laje ----------
  SLABX.setAttribute("opacity", inSL ? 1 : 0);
  if (inSL) {
    const k = prog(t, 7.0, 8.0);
    SLABX.setAttribute("transform", `translate(0 ${lerp(1920, -700, k)})`);
    slabDrops.forEach((d, i) => { d.setAttribute("opacity", 1); d.setAttribute("transform", `translate(${200 + i * 220} ${360 + cyc(t, 0.4, i * 0.1) * 300})`); });
  }
  // ---------- cozinha do Seu João ----------
  KC.setAttribute("opacity", inKC ? (t < 8.0 ? ease(prog(t, 7.5, 7.8)) : 1) : 0);
  if (inKC) {
    const [cx, cy, s] = KF(t, KCAM);
    KCc.setAttribute("transform", `translate(540 1100) scale(${s}) translate(${-cx} ${-cy})`);
    kPlant.setAttribute("transform", `rotate(${Math.sin(t * 1.3) * 2.5} 180 622)`);
    const fast = t > 15 && t < 16.8;
    kM.setAttribute("transform", `rotate(${t * 36 + (fast ? (t - 15) * 4000 : t > 16.8 ? 7200 : 0)} 560 470)`);
    kH.setAttribute("transform", `rotate(${t * 3 + (fast ? (t - 15) * 340 : t > 16.8 ? 612 : 0)} 560 470)`);
    const day = t < 15 ? 1 : Math.min(14, 1 + Math.floor(prog(t, 15.1, 16.7) * 13));
    calNum.textContent = String(day);
    calPage.setAttribute("opacity", fast ? 1 - cyc(t, 0.12) : 0);
    // João: entra com a caixa, tira a torneira velha, põe a nova, aperta, abre a água
    const enter = ease(prog(t, 7.7, 8.9)), walking = t > 7.7 && t < 8.9 ? 1 : 0;
    let arm = -20;
    if (t < 9.0) arm = -40; else if (t < 9.6) arm = lerp(-40, -100, prog(t, 9.0, 9.4));
    else if (t < 10.6) arm = -120 + Math.sin(t * 6) * 10; else if (t < 11.4) arm = -110;
    else if (t < 12.8) arm = -105 + Math.sin(t * 10) * 14; else if (t < 13.6) arm = -90; else if (t < 14.6) arm = -150;
    // nas 2 semanas, o João passa pelo fundo (só as pernas aparecem no zoom)
    const pass = prog(t, 18.4, 20.2), passing = t > 18.4 && t < 20.2;
    placePerson(jk, passing ? lerp(1000, 1500, pass) : t > 15 ? -600 : lerp(-200, 330, enter), 1720);
    walk(jk, t * 7, walking || passing ? 1 : 0, passing ? undefined : arm);
    handBox.setAttribute("opacity", t < 9.4 ? 1 : 0); fBox.setAttribute("opacity", t >= 9.4 && t < 15 ? 1 : 0);
    wrench.setAttribute("opacity", t >= 11.3 && t < 12.9 ? 1 : 0);
    const ok = prog(t, 9.6, 10.5);
    oldF.setAttribute("transform", `translate(${lerp(0, -330, ease(ok))} ${-Math.sin(ok * Math.PI) * 120 + ease(ok) * 40}) rotate(${ease(ok) * -80} 700 1050)`);
    oldF.setAttribute("opacity", 1 - ease(prog(t, 10.3, 10.6)));
    newF.setAttribute("transform", `translate(0 ${lerp(-300, 0, ease(prog(t, 10.6, 11.3)))})`);
    newF.setAttribute("opacity", ease(prog(t, 10.5, 10.7)));
    shine.forEach((sx, i) => { const k = cyc(t, 1.2, i * 0.4); sx.setAttribute("x", 650 + i * 50); sx.setAttribute("y", 980 + i * 30); sx.setAttribute("opacity", t > 11.3 && t < 15 ? Math.sin(k * Math.PI) : 0); });
    clic.forEach((c, i) => { const k = cyc(t, 0.5, i * 0.25); c.setAttribute("x", 520 + i * 70); c.setAttribute("y", 1000 - k * 40); c.setAttribute("opacity", t > 11.4 && t < 12.8 ? 1 - k : 0); });
    arcs.setAttribute("opacity", t > 11.4 && t < 12.8 ? 0.4 + 0.4 * Math.sin(t * 20) : 0);
    const flow = t > 12.9 && t < 14.6;
    stream.setAttribute("opacity", flow ? 0.9 : 0); streamHi.setAttribute("opacity", flow ? 0.7 : 0);
    const sh = 130 * ease(prog(t, 12.9, 13.1));
    stream.setAttribute("height", sh); streamHi.setAttribute("height", sh);
    streamHi.setAttribute("y", 1052 + (t * 300) % 60);
    runSplash(basinSplash, 760, 1176, flow ? cyc(t, 0.35) : 0, 70, 40);
    ripples.forEach((r, i) => { const k = cyc(t, 0.9, i * 0.3); r.setAttribute("rx", 10 + k * 90); r.setAttribute("ry", 3 + k * 10); r.setAttribute("opacity", flow ? 1 - k : 0); });
    thumbs.setAttribute("opacity", fadeIO(t, 13.6, 14.8, 0.2));
    thumbs.setAttribute("transform", `translate(300 1000) scale(${1 + Math.sin(prog(t, 13.6, 14.0) * Math.PI) * 0.3}) translate(-300 -1000)`);
    // "Parecia." — a primeira gotinha
    const om = prog(t, 14.4, 15.0);
    ominous.setAttribute("opacity", t > 14.4 && t < 15.2 ? 1 : 0);
    ominous.setAttribute("transform", `translate(858 1428) scale(${0.2 + om * 0.8})`);
    // 2 semanas pingando: gotas, respingos, poça, mofo
    kDrops.forEach((d, i) => {
      const k = cyc(t, 0.9, 16.8 + i * 0.45), on = t > 16.8 + i * 0.45;
      d.setAttribute("opacity", on ? 1 : 0);
      d.setAttribute("transform", `translate(858 ${k < 0.4 ? 1428 : lerp(1428, 1488, ((k - 0.4) / 0.6) ** 2)}) scale(${k < 0.4 ? 0.3 + k * 1.75 : 1})`);
    });
    runSplash(kSplash, 858, 1488, t > 17.7 ? cyc(t, 0.45, 17.7) * 1.4 : 0, 40, 30);
    kPuddle.setAttribute("rx", 90 * prog(t, 16.8, 21.4));
    mold.forEach((m, i) => m.setAttribute("r", 14 * prog(t, 18 + i * 0.3, 20 + i * 0.3)));
    notes.forEach((n, i) => { const k = cyc(t, 1.2, 18.4 + i * 0.4); n.setAttribute("x", lerp(1000, 1500, pass) - 40 + i * 30); n.setAttribute("y", 1080 - k * 80); n.setAttribute("opacity", passing ? Math.sin(k * Math.PI) : 0); });
    pop(dayChip, t, 16.8, 21.6);
    dayTxt.textContent = `💧 dia ${Math.max(1, Math.round(lerp(1, 14, prog(t, 17, 21))))}`;
  }
  // ---------- corte do prédio ----------
  CT.setAttribute("opacity", inCT ? 1 : 0);
  if (inCT) {
    const [cx, cy, s] = KF(t, CTCAM);
    CTc.setAttribute("transform", `translate(540 1100) scale(${s}) translate(${-cx} ${-cy})`);
    placePerson(joao, t < 24 ? 400 : 380, 1094); walk(joao, t * 7, 0, -20);
    placePerson(mariaCT, 470, 1394); walk(mariaCT, 0, 0, t >= 31 ? -165 : -20);
    mariaCT.parts.armB.setAttribute("transform", `rotate(${t >= 31 ? -165 : 0} 0 -312)`);
    // infiltração atravessando a laje
    const sk = t < 24 ? prog(t, 21.6, 23.8) : 1;
    puddle.setAttribute("rx", 70 * (t < 24 ? Math.max(0.4, sk) : 1));
    seep.setAttribute("height", 26 * sk);
    seepDrops.forEach((d, i) => { const k = cyc(t, 0.7, i * 0.12); d.setAttribute("cx", 585 + i * 10); d.setAttribute("cy", 1100 + k * 40); d.setAttribute("opacity", t < 24 ? (1 - k) * sk : 0); });
    ctStain.setAttribute("opacity", t < 24 ? prog(t, 22.8, 23.8) * 0.8 : 0.8);
    ctStain.setAttribute("transform", `translate(608 1132) scale(${t < 24 ? Math.max(0.05, prog(t, 22.8, 23.8)) : 1})`);
    ctDrops.forEach((d, i) => {
      const k = cyc(t, 0.9, 23 + i * 0.3), on = t > 23 + i * 0.3 && t < 24;
      d.setAttribute("opacity", on ? 1 : 0); d.setAttribute("transform", `translate(${608 + i * 6} ${lerp(1150, 1222, k * k)})`);
    });
    // raio-X: varredura, prumada dourada e ramais azuis com água correndo
    const xr = t >= 31 ? ease(prog(t, 31, 31.9)) : 0;
    scan.setAttribute("opacity", t >= 31 && t < 32 ? 1 : 0); scan.setAttribute("y", lerp(440, 1740, prog(t, 31, 31.9)));
    xray.setAttribute("opacity", xr); dim.setAttribute("opacity", xr * 0.4);
    const cg = t >= 31 ? ease(prog(t, 32.6, 33.2)) : 0, bg = t >= 31 ? ease(prog(t, 37, 37.6)) : 0;
    colHi.setAttribute("opacity", cg); colGlow.setAttribute("opacity", cg * (0.6 + 0.4 * Math.sin(t * 4)));
    colFlow.setAttribute("opacity", cg * 0.9); colFlow.setAttribute("stroke-dashoffset", -t * 160);
    brHi.forEach((b) => b.setAttribute("opacity", bg));
    brFlow.forEach((b) => { b.setAttribute("opacity", bg * 0.9); b.setAttribute("stroke-dashoffset", -t * 120); });
    pop(tagV, t, 33, 43); pop(tagH, t, 37.4, 43);
    // o caso: vazamento no ramal do Seu João (espirrando)
    const caseOn = t >= 43.4 && t < 52;
    leakMark.setAttribute("transform", `translate(${leakJ[0]} ${leakJ[1]}) scale(${1 + 0.25 * Math.sin(t * 8)})`);
    leakMark.setAttribute("opacity", caseOn ? 1 : 0);
    spray.forEach((p, i) => { const k = cyc(t, 0.6, i * 0.06), a = -0.4 + (i / 9) * 0.8; p.setAttribute("cx", leakJ[0] + Math.sin(a) * 70 * k); p.setAttribute("cy", leakJ[1] + 10 - 30 * k + 90 * k * k); p.setAttribute("opacity", caseOn && t < 48 ? 1 - k : 0); });
    // pegadinha: da mancha até a origem
    const pk = prog(t, 48.8, 51);
    trace.setAttribute("opacity", t >= 48.6 && t < 52 ? 1 : 0); trace.setAttribute("stroke-dashoffset", -t * 60);
    loupe.setAttribute("x", 650); loupe.setAttribute("y", lerp(1200, leakJ[1] + 30, ease(pk)));
    loupe.setAttribute("opacity", t >= 48.6 && t < 52 ? 1 : 0);
    // teste: vazamento na coluna
    const colOn = t >= 52.4 && t < 56;
    colLeak.setAttribute("transform", `translate(${colX + 12} 760) scale(${1 + 0.25 * Math.sin(t * 8)})`);
    colLeak.setAttribute("opacity", colOn ? 1 : 0);
    colSpray.forEach((p, i) => { const k = cyc(t, 0.6, i * 0.06), a = -1.2 + (i / 9) * 0.9; p.setAttribute("cx", colX + 12 + Math.sin(a) * 90 * k); p.setAttribute("cy", 760 - 30 * k + 90 * k * k); p.setAttribute("opacity", colOn ? 1 - k : 0); });
  }
  // ---------- final ----------
  FN.setAttribute("opacity", inFN ? 1 : 0);
  if (inFN) {
    const lt = t - 56;
    stageUpdate(FN, lt, t);
    const k = ease(prog(lt, 0.1, 1.8)), walking = lt > 0.1 && lt < 1.9 ? Math.min(1, 1 - prog(lt, 1.6, 1.9)) : 0, ph = lt * Math.PI * 3.6;
    M.setAttribute("transform", `translate(${lerp(-260, 330, k)} ${1790 - Math.abs(Math.sin(ph)) * 10 * walking}) scale(0.92)`);
    MB.setAttribute("transform", `rotate(${Math.sin(ph) * 1.6 * walking} 0 -450)`);
    legL.setAttribute("transform", `translate(0 ${-Math.max(0, Math.sin(ph)) * 34 * walking})`);
    legR.setAttribute("transform", `translate(0 ${-Math.max(0, -Math.sin(ph)) * 34 * walking})`);
    const wave = ease(prog(lt, 2.0, 2.4)) * (1 - ease(prog(lt, 3.0, 3.3)));
    armL.setAttribute("transform", `rotate(${lerp(-Math.sin(ph) * 8 * walking, 150 + Math.sin(lt * 9) * 12, wave)} -106 -738)`);
    const up = ease(prog(lt, 3.2, 3.8));
    armR.setAttribute("transform", `rotate(${-8 * up} 112 -738)`);
    fore.setAttribute("transform", `rotate(${128 * up} 136 -575)`);
    phone.setAttribute("transform", `rotate(${-128 * up} 133 -470)`);
    screen.setAttribute("opacity", up); phone.querySelector(".pglow").setAttribute("opacity", 0);
    head.setAttribute("transform", `rotate(${Math.sin(t * 1.7) * 1.5} 0 -800)`);
  }
  // ---------- títulos ----------
  showTitle(T.gancho, t, 5.3, 7.4); showTitle(T.diy, t, 8.4, 14.2); showTitle(T.semanas, t, 15.0, 16.7);
  showTitle(T.pingou, t, 16.8, 21.5); showTitle(T.agora, t, 28.6, 31.0);
  showTitle(T.vert, t, 33.0, 37.0); showTitle(T.hor, t, 37.1, 43.2); pop(note, t, 39.2, 43.2);
  showTitle(T.joao, t, 43.6, 47.9);
  receipt.setAttribute("opacity", fadeIO(t, 44.6, 47.9, 0.25));
  receipt.setAttribute("transform", `translate(0 ${lerp(500, 0, ease(prog(t, 44.6, 45.2)))}) rotate(${lerp(8, -3, ease(prog(t, 44.6, 45.2)))} 540 1380)`);
  showTitle(T.origem, t, 48.4, 51.9); showTitle(T.teste, t, 52.2, 54.9); showTitle(T.cond, t, 55.0, 56.0);
  showCheck(okCond, t, 55.0); if (!(t >= 55 && t < 56)) okCond.setAttribute("opacity", 0);
  const cdOn = t >= 52.6 && t < 55;
  cd.setAttribute("opacity", cdOn ? 1 : 0);
  if (cdOn) { cdNum.textContent = String(3 - Math.floor((t - 52.6) / 0.8)); cdRing.setAttribute("stroke-dashoffset", 2 * Math.PI * 130 * (((t - 52.6) % 0.8) / 0.8)); }
  showTitle(T.sindica, t, 56.2, 58.6); showTitle(T.salva, t, 58.7, 61);
  logo2.setAttribute("opacity", ease(prog(t, 58.9, 59.3)));
  seal.setAttribute("opacity", 1 - ease(prog(t, 58.7, 59.0)));
  let wx = -2000;
  for (const c of [31, 56]) if (Math.abs(t - c) < 0.3) wx = lerp(-900, 1500, (t - c + 0.3) / 0.6);
  wipe.setAttribute("transform", `translate(${wx} 0)`);
};
window.render(0);
