/* Reel "Violência doméstica no condomínio" — formato CTSP (mesma situação, 3 reações).
   Reaproveita a maquete 3D e a portaria do index.html; aqui ficam as cenas novas e a linha do tempo. */

const RED = "#ff3b4e", ORANGE = "#ff9f1c", GREEN = "#2ee59d", BLUE = "#3d7bff", CREAM = "#f4f1ea";

// ---------- falas (início, fim) — re-temporizar quando chegar o áudio da voz da Maiane ----------
const CUES = [
  [0.8, 2.8, "Gritos no apartamento ao lado."],
  [3.4, 4.4, "Três reações."],
  [4.9, 6.3, "Só uma está certa."],
  [8.0, 12.0, "Tu aumenta o volume da TV e finge que não ouviu."],
  [16.6, 20.2, "Tu posta no grupo do condomínio perguntando quem ouviu."],
  [26.0, 27.6, "Tu liga cento e noventa."],
  [29.0, 30.8, "A portaria libera a polícia"],
  [31.2, 32.6, "e guarda as imagens."],
  [43.2, 46.6, "Ela não deu queixa, a polícia não pode agir?"],
  [47.4, 48.3, "Pode, sim."],
  [50.4, 52.4, "Não é na hora, mas tu desconfia."],
  [52.7, 53.6, "Pra onde liga?"],
  [56.3, 57.3, "Cento e oitenta."],
  [59.2, 61.2, "Nunca enfrente o agressor sozinho."],
  [62.6, 64.8, "Salva e manda no grupo do condomínio."],
  [65.4, 66.8, "Pode salvar uma vida."],
];
window.CUES = CUES;

const DUR = 68.5;
window.DURATION = DUR;
const inR = (t, a, b) => t >= a && t < b;
const fadeIO = (t, a, b, f = 0.3) => Math.min(ease(prog(t, a, a + f)), 1 - ease(prog(t, b - f, b)));

/* =====================================================================
   3D: janela vermelha pulsando (gancho)
   ===================================================================== */
const redWin = div(world, "f", { width: "9px", height: "11px", background: "#ff4b4b",
  transform: `translate3d(555.4px,742px,${FLOOR * 3 + 3}px) rotateY(-90deg)` });
const redHalo = div(world, "f", { width: "60px", height: "60px", borderRadius: "50%",
  background: "radial-gradient(rgba(255,70,70,.75), rgba(255,70,70,0) 70%)",
  transform: `translate3d(554px,718px,${FLOOR * 3 - 22}px) rotateY(-90deg)` });

/* =====================================================================
   FACHADA (cenas 1, 2 e 3a): a parede comprida, janela da vítima e do vizinho
   ===================================================================== */
const FA = document.createElementNS(NS, "svg");
FA.setAttribute("width", 1080); FA.setAttribute("height", 1920); FA.setAttribute("viewBox", "0 0 1080 1920");
Object.assign(FA.style, { position: "absolute", left: 0, top: 0, opacity: 0 });
document.body.insertBefore(FA, document.getElementById("overlay"));
FA.innerHTML = `<defs>
  <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b16"/><stop offset="1" stop-color="#1a2238"/></linearGradient>
  <radialGradient id="redGlow"><stop offset="0" stop-color="#ff3b3b" stop-opacity=".85"/><stop offset="1" stop-color="#ff3b3b" stop-opacity="0"/></radialGradient>
  <radialGradient id="tvGlow"><stop offset="0" stop-color="#7fb4ff" stop-opacity=".8"/><stop offset="1" stop-color="#7fb4ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="warm"><stop offset="0" stop-color="#ffd98a" stop-opacity=".6"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
  <filter id="fblur"><feGaussianBlur stdDeviation="6"/></filter>
  <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000" opacity=".35"/></pattern>
</defs>`;
const FG = sv("g", {}, FA);                 // grupo da cena (recebe zoom e tremida da rebobinada)
sv("rect", { width: 1080, height: 1920, fill: "url(#fsky)" }, FG);
for (let i = 0; i < 30; i++) sv("circle", { cx: rnd() * 1080, cy: rnd() * 340, r: rnd() * 1.6 + 0.4, fill: "#fff", opacity: 0.3 + rnd() * 0.5 }, FG);
// parede bege (5 andares) + faixa cinza embaixo
const FLH = 236, FTOP = 380;
sv("rect", { x: -60, y: FTOP - 40, width: 1200, height: 40, fill: "#4a4f5a" }, FG);                 // beiral
sv("rect", { x: -60, y: FTOP, width: 1200, height: FLH * 5, fill: "#b8aa8f" }, FG);
sv("rect", { x: -60, y: FTOP + FLH * 5 - 168, width: 1200, height: 168, fill: "#9a9da3" }, FG);
for (let f = 1; f < 5; f++) sv("rect", { x: -60, y: FTOP + f * FLH - 4, width: 1200, height: 8, fill: "#a99b80" }, FG);
const winRect = (x, y) => ({ x, y, w: 240, h: 150 });
const WINS = [];
for (let f = 0; f < 5; f++) for (const x of [80, 420, 760]) {
  const y = FTOP + f * FLH + 44;
  if (f === 4) continue;                              // térreo atrás da faixa: sem janela
  const lit = rnd() < 0.4;
  sv("rect", { x: x - 8, y: y - 8, width: 256, height: 166, rx: 4, fill: "#e8e2d6" }, FG);
  WINS.push({ x, y, el: sv("rect", { x, y, width: 240, height: 150, fill: lit ? "#d9b26a" : "#1d2537", opacity: lit ? 0.75 : 1 }, FG) });
  sv("rect", { x: x + 118, y, width: 4, height: 150, fill: "#e8e2d6" }, FG);
}
// janela da vítima: andar 2, centro (só luz vermelha pulsando — ninguém aparece)
const VW = { x: 420, y: FTOP + 2 * FLH + 44 };
const vGlow = sv("ellipse", { cx: VW.x + 120, cy: VW.y + 75, rx: 260, ry: 210, fill: "url(#redGlow)" }, FG);
const vPane = sv("rect", { x: VW.x, y: VW.y, width: 240, height: 150, fill: "#5a1218" }, FG);
sv("path", { d: `M ${VW.x} ${VW.y} Q ${VW.x + 40} ${VW.y + 75} ${VW.x + 18} ${VW.y + 150} L ${VW.x} ${VW.y + 150} Z M ${VW.x + 240} ${VW.y} Q ${VW.x + 200} ${VW.y + 75} ${VW.x + 222} ${VW.y + 150} L ${VW.x + 240} ${VW.y + 150} Z`, fill: "#2a0a0e", opacity: 0.8 }, FG); // cortinas
sv("rect", { x: VW.x + 118, y: VW.y, width: 4, height: 150, fill: "#e8e2d6" }, FG);
const waves = sv("g", {}, FG);
for (let i = 0; i < 3; i++) for (const sd of [-1, 1])
  sv("path", { d: `M ${VW.x + 120 + sd * (150 + i * 40)} ${VW.y + 15} Q ${VW.x + 120 + sd * (180 + i * 40)} ${VW.y + 75} ${VW.x + 120 + sd * (150 + i * 40)} ${VW.y + 135}`,
    fill: "none", stroke: "#ff6b6b", "stroke-width": 6, "stroke-linecap": "round", class: "wv", "data-i": i }, waves);
// janela do vizinho (ao lado, mesmo andar): silhueta sem rosto
const NW = { x: 80, y: VW.y };
sv("rect", { x: NW.x, y: NW.y, width: 240, height: 150, fill: "#c99b55" }, FG);
const tvLight = sv("rect", { x: NW.x, y: NW.y, width: 240, height: 150, fill: "#6f9bff", opacity: 0 }, FG);
const neigh = sv("g", {}, FG);
const SIL = "#1a1410";
// pose base: cabeça + ombros
sv("circle", { cx: NW.x + 80, cy: NW.y + 70, r: 26, fill: SIL }, neigh);
sv("path", { d: `M ${NW.x + 30} ${NW.y + 150} Q ${NW.x + 34} ${NW.y + 100} ${NW.x + 80} ${NW.y + 98} Q ${NW.x + 126} ${NW.y + 100} ${NW.x + 130} ${NW.y + 150} Z`, fill: SIL }, neigh);
const poseTV = sv("path", { d: `M ${NW.x + 118} ${NW.y + 120} L ${NW.x + 168} ${NW.y + 104} L ${NW.x + 182} ${NW.y + 100}`, fill: "none", stroke: SIL, "stroke-width": 12, "stroke-linecap": "round" }, neigh); // controle
const posePhone = sv("g", { opacity: 0 }, neigh);
sv("path", { d: `M ${NW.x + 112} ${NW.y + 130} L ${NW.x + 120} ${NW.y + 108}`, stroke: SIL, "stroke-width": 12, "stroke-linecap": "round" }, posePhone);
sv("rect", { x: NW.x + 112, y: NW.y + 92, width: 16, height: 24, rx: 3, fill: "#cfe3ff" }, posePhone);
sv("ellipse", { cx: NW.x + 104, cy: NW.y + 82, rx: 34, ry: 28, fill: "url(#tvGlow)", opacity: 0.6 }, posePhone);
const poseCall = sv("g", { opacity: 0 }, neigh);
sv("path", { d: `M ${NW.x + 118} ${NW.y + 140} Q ${NW.x + 128} ${NW.y + 100} ${NW.x + 106} ${NW.y + 76}`, fill: "none", stroke: SIL, "stroke-width": 12, "stroke-linecap": "round" }, poseCall);
sv("rect", { x: NW.x + 98, y: NW.y + 56, width: 12, height: 26, rx: 3, fill: "#cfe3ff" }, poseCall);
// chão + poste
sv("rect", { x: 0, y: FTOP + FLH * 5, width: 1080, height: 400, fill: "#14181f" }, FG);
sv("rect", { x: 940, y: 1250, width: 10, height: 330, fill: "#2d323c" }, FG);
sv("ellipse", { cx: 945, cy: 1250, rx: 90, ry: 90, fill: "url(#warm)" }, FG);
sv("circle", { cx: 945, cy: 1250, r: 9, fill: "#fff4cf" }, FG);
// rebobinada: linhas + tarja
const vhs = sv("g", { opacity: 0 }, FA);
sv("rect", { width: 1080, height: 1920, fill: "url(#scan)" }, vhs);
const vhsBars = [0, 1, 2].map(() => sv("rect", { x: 0, y: 0, width: 1080, height: 26, fill: "#fff", opacity: 0.12 }, vhs));
sv("text", { x: 544, y: 236, "text-anchor": "middle", "font-size": 92, "font-weight": 900, fill: "#2de2e6", opacity: 0.7 }, vhs, "⏪ REBOBINA");
sv("text", { x: 536, y: 232, "text-anchor": "middle", "font-size": 92, "font-weight": 900, fill: "#ff3b6b", opacity: 0.7 }, vhs, "⏪ REBOBINA");
sv("text", { x: 540, y: 234, "text-anchor": "middle", "font-size": 92, "font-weight": 900, fill: "#fff" }, vhs, "⏪ REBOBINA");

/* =====================================================================
   PORTARIA: viatura com giroflex, refração das luzes e reflexo no chão
   ===================================================================== */
const fdefs = F.querySelector("defs");
fdefs.insertAdjacentHTML("beforeend", `
  <filter id="b30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="b10" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
  <radialGradient id="redSpill"><stop offset="0" stop-color="#ff2a3c" stop-opacity=".9"/><stop offset=".45" stop-color="#ff2a3c" stop-opacity=".25"/><stop offset="1" stop-color="#ff2a3c" stop-opacity="0"/></radialGradient>
  <radialGradient id="blueSpill"><stop offset="0" stop-color="#2f6bff" stop-opacity=".9"/><stop offset=".45" stop-color="#2f6bff" stop-opacity=".25"/><stop offset="1" stop-color="#2f6bff" stop-opacity="0"/></radialGradient>
  <linearGradient id="wet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`);
// asfalto molhado (só aparece com a viatura)
const wetSheen = sv("rect", { x: 0, y: 1650, width: 1080, height: 270, fill: "#24314a", opacity: 0 }, FS);
const pc = sv("g", {}, FS);
FS.insertBefore(pc, M);
FS.insertBefore(wetSheen, pc);
const pcRefl = sv("g", { opacity: 0.55 }, pc);      // reflexo do carro no chão molhado
const pcBody = sv("g", {}, pc);
function drawCar(g, flip) {
  const s = flip ? -1 : 1, y0 = flip ? 0 : 0;
  const P = (d) => sv("path", { d, transform: flip ? "scale(1,-1)" : "" }, g);
  const add = (tag, a) => { const e = sv(tag, a, g); if (flip) e.setAttribute("transform", "scale(1,-1)"); return e; };
  add("path", { d: "M 0 -46 Q 2 -92 40 -100 L 120 -106 L 170 -168 Q 180 -176 200 -176 L 330 -176 Q 352 -176 362 -160 L 392 -108 L 420 -104 Q 438 -98 438 -70 L 438 -46 Z", fill: "#e9ecf0" });
  add("path", { d: "M 0 -46 L 438 -46 L 438 -82 L 0 -82 Z", fill: "#2a2f3a", opacity: 0.9 });
  add("path", { d: "M 132 -108 L 178 -164 L 262 -164 L 262 -108 Z", fill: "#121722" });
  add("path", { d: "M 272 -108 L 272 -164 L 332 -164 Q 344 -164 350 -154 L 378 -108 Z", fill: "#121722" });
  add("path", { d: "M 150 -112 L 186 -156 L 214 -156 L 178 -112 Z", fill: "#fff", opacity: 0.12 });
  add("rect", { x: 0, y: -70, width: 18, height: 12, rx: 3, fill: "#fffbe0" });   // farol
  add("rect", { x: 428, y: -76, width: 12, height: 16, rx: 3, fill: "#ff2a3c" });  // lanterna
  add("rect", { x: 186, y: -190, width: 120, height: 14, rx: 5, fill: "#20242c" }); // giroflex
}
drawCar(pcBody, false);
drawCar(pcRefl, true);
pcRefl.setAttribute("filter", "url(#b10)");
const barR = sv("rect", { x: 188, y: -190, width: 58, height: 14, rx: 5, fill: RED }, pcBody);
const barB = sv("rect", { x: 246, y: -190, width: 58, height: 14, rx: 5, fill: BLUE }, pcBody);
const wheels = [80, 352].map((wx) => {
  const g = sv("g", {}, pc);
  sv("circle", { cx: 0, cy: 0, r: 44, fill: "#0b0d12" }, g);
  sv("circle", { cx: 0, cy: 0, r: 24, fill: "#9aa0aa" }, g);
  for (let i = 0; i < 5; i++) sv("rect", { x: -3, y: -22, width: 6, height: 20, fill: "#5d636e", transform: `rotate(${i * 72})` }, g);
  g.wx = wx; return g;
});
pc.setAttribute("opacity", 0);
// camada de luz por cima de tudo (modo "screen" = luz somando)
const LIGHT = sv("g", { style: "mix-blend-mode:screen", opacity: 0 }, F);
const spillR = sv("circle", { r: 900, fill: "url(#redSpill)" }, LIGHT);
const spillB = sv("circle", { r: 900, fill: "url(#blueSpill)" }, LIGHT);
const guaritaR = sv("rect", { x: 650, y: 1236, width: 340, height: 344, fill: RED, opacity: 0 }, LIGHT);
const guaritaB = sv("rect", { x: 650, y: 1236, width: 340, height: 344, fill: BLUE, opacity: 0 }, LIGHT);
const refl = sv("g", { filter: "url(#b30)" }, LIGHT);       // reflexos verticais no chão molhado
const reflR = sv("ellipse", { rx: 46, ry: 190, fill: RED }, refl);
const reflB = sv("ellipse", { rx: 46, ry: 190, fill: BLUE }, refl);
const streakR = sv("ellipse", { rx: 520, ry: 7, fill: "#ff8a95" }, LIGHT);   // risco anamórfico
const streakB = sv("ellipse", { rx: 520, ry: 7, fill: "#8fb0ff" }, LIGHT);
const flares = [0.35, 0.6, 0.85].map((k, i) => sv("circle", { r: [26, 14, 40][i], fill: i === 1 ? "#ff8a95" : "#8fb0ff", opacity: 0, "data-k": k }, LIGHT));
// strobe de polícia: dois piscos curtos por meio segundo, vermelho e azul alternados
const strobe = (t, ph) => { const c = ((t + ph) % 0.5) / 0.5; return c < 0.12 || (c > 0.2 && c < 0.32) ? 1 : 0.08; };

/* =====================================================================
   OVERLAY: carimbos neon, HUDs, cartões, tabela, textos e legendas
   ===================================================================== */
const odefs = sv("defs", {}, OV);
odefs.innerHTML = `
  <filter id="neon" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
  <radialGradient id="alertBg" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#3a0b12"/><stop offset="1" stop-color="#0b0d14"/></radialGradient>
  <pattern id="ogrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".04"/></pattern>`;
const T = (attrs, parent, text) => sv("text", Object.assign({ "text-anchor": "middle", "font-weight": 900, fill: CREAM }, attrs), parent, text);
function bigText(l1, l2, y, size, c2 = GOLD) {
  const g = sv("g", { opacity: 0 }, OV);
  T({ x: 540, y, "font-size": size, stroke: "#0d1118", "stroke-width": 12, "paint-order": "stroke", "letter-spacing": 2 }, g, l1);
  if (l2) T({ x: 540, y: y + size * 1.08, "font-size": size, fill: c2, stroke: "#0d1118", "stroke-width": 12, "paint-order": "stroke", "letter-spacing": 2 }, g, l2);
  return g;
}
function stamp(text, color, tag) {
  const g = sv("g", { opacity: 0 }, OV), inner = sv("g", {}, g);
  const w = text.length * 50 + 90;
  sv("rect", { x: 540 - w / 2, y: 470, width: w, height: 140, rx: 26, fill: "rgba(8,10,16,.6)", stroke: color, "stroke-width": 8, filter: "url(#neon)" }, inner);
  T({ x: 540, y: 572, "font-size": 86, fill: "#fff", stroke: color, "stroke-width": 7, "paint-order": "stroke", filter: "url(#neon)", "letter-spacing": 3 }, inner, text);
  const tg = sv("g", { opacity: 0 }, g);
  const tw = tag.length * 19 + 70;
  sv("rect", { x: 540 - tw / 2, y: 646, width: tw, height: 66, rx: 33, fill: "rgba(13,17,24,.9)", stroke: color, "stroke-width": 3 }, tg);
  T({ x: 540, y: 690, "font-size": 34, "font-weight": 800 }, tg, tag);
  g.inner = inner; g.tag = tg; return g;
}
function showStamp(st, t, a, b) {
  const k = prog(t, a, a + 0.28);
  st.setAttribute("opacity", t < a ? 0 : fadeIO(t, a, b, 0.2));
  const sc = lerp(1.9, 1, ease(k));
  st.inner.setAttribute("transform", `translate(540 540) rotate(-5) scale(${sc}) translate(-540 -540)`);
  st.tag.setAttribute("opacity", ease(prog(t, a + 0.4, a + 0.7)));
}
const hook1 = bigText("GRITOS", "AO LADO", 330, 120, "#ff6b6b");
const hook2 = bigText("3 REAÇÕES", "SÓ 1 CERTA", 330, 120);
const stOmissao = stamp("OMISSÃO", RED, "Silêncio protege o agressor");
const stExpoe = stamp("EXPÕE A VÍTIMA", ORANGE, "Grupo não é canal de denúncia");
const stCerto = stamp("CERTO", GREEN, "190 · pode pedir sigilo");
// HUD de volume (cena 1)
const vol = sv("g", { opacity: 0 }, OV);
sv("rect", { x: 70, y: 1270, width: 420, height: 90, rx: 45, fill: "rgba(13,17,24,.88)", stroke: "#3a4458", "stroke-width": 2 }, vol);
T({ x: 128, y: 1330, "font-size": 44 }, vol, "🔊");
const volBars = [];
for (let i = 0; i < 10; i++) volBars.push(sv("rect", { x: 178 + i * 29, y: 1340 - 8 - i * 3.6, width: 20, height: 16 + i * 3.6, rx: 4, fill: "#3a4458" }, vol));
// cartão do grupo (cena 2)
const chat = sv("g", { opacity: 0 }, OV);
sv("rect", { x: 120, y: 1170, width: 840, height: 330, rx: 34, fill: "#0f1520", stroke: "#2a3346", "stroke-width": 3 }, chat);
sv("text", { x: 170, y: 1236, "font-size": 34, "font-weight": 800, fill: CREAM }, chat, "👥  Grupo do condomínio");
sv("text", { x: 170, y: 1276, "font-size": 24, fill: "#8a93a3" }, chat, "312 participantes");
const bubble = sv("g", {}, chat);
sv("rect", { x: 360, y: 1320, width: 560, height: 120, rx: 26, fill: "#1f5f4f" }, bubble);
const chatTxt = sv("text", { x: 392, y: 1394, "font-size": 40, "font-weight": 700, fill: "#eafff6" }, bubble, "");
const chatTicks = sv("text", { x: 892, y: 1426, "text-anchor": "end", "font-size": 24, fill: "#7fd3ff", opacity: 0 }, bubble, "✓✓");
const CHAT_MSG = "alguém ouviu isso? 👀";
// ligação (cena 3a)
const call = sv("g", { opacity: 0 }, OV);
sv("rect", { x: 330, y: 1060, width: 420, height: 620, rx: 64, fill: "#07090e", stroke: "#3a3f4a", "stroke-width": 8 }, call);
sv("rect", { x: 346, y: 1076, width: 388, height: 588, rx: 52, fill: "#121a2a" }, call);
sv("rect", { x: 488, y: 1092, width: 104, height: 26, rx: 13, fill: "#000" }, call);
T({ x: 540, y: 1290, "font-size": 124, fill: "#fff" }, call, "190");
const calling = T({ x: 540, y: 1350, "font-size": 34, "font-weight": 600, fill: "#a9b4c8" }, call, "chamando…");
const rings = [0, 1, 2].map(() => sv("circle", { cx: 540, cy: 1540, r: 50, fill: "none", stroke: GREEN, "stroke-width": 4, opacity: 0 }, call));
sv("circle", { cx: 540, cy: 1540, r: 50, fill: "#e5484d" }, call);
T({ x: 540, y: 1556, "font-size": 44 }, call, "📞");
// cartões da portaria (cena 3b)
function chip(icon, label, y, color) {
  const g = sv("g", { opacity: 0 }, OV);
  sv("rect", { x: 560, y, width: 480, height: 84, rx: 42, fill: "rgba(13,17,24,.9)", stroke: color, "stroke-width": 3 }, g);
  sv("text", { x: 600, y: y + 56, "font-size": 38, fill: color }, g, icon);
  sv("text", { x: 660, y: y + 55, "font-size": 34, "font-weight": 800, fill: CREAM }, g, label);
  return g;
}
const chipRec = chip("●", "imagens guardadas", 900, "#ff4b4b");
const chipBook = chip("📒", "registro no livro", 1010, GOLD);
const chipGate = chip("🔓", "portaria libera", 790, GREEN);
// tabela comparativa
const tab = sv("g", { opacity: 0 }, OV);
sv("rect", { width: 1080, height: 1920, fill: "#0b0f17", opacity: 0.94 }, tab);
sv("rect", { width: 1080, height: 1920, fill: "url(#ogrid)" }, tab);
T({ x: 540, y: 400, "font-size": 92, "letter-spacing": 3 }, tab, "AS 3 REAÇÕES");
const ROWS = [["Fingir que não ouviu", "OMISSÃO", RED, "✕"], ["Postar no grupo", "EXPÕE", ORANGE, "✕"], ["Ligar 190", "CERTO", GREEN, "✓"]];
const tabRows = ROWS.map(([a, b, c, m], i) => {
  const g = sv("g", { opacity: 0 }, tab), y = 600 + i * 270;
  sv("rect", { x: 70, y, width: 940, height: 210, rx: 30, fill: "rgba(255,255,255,.04)", stroke: c, "stroke-width": 3 }, g);
  sv("text", { x: 120, y: y + 90, "font-size": 46, "font-weight": 800, fill: CREAM }, g, a);
  sv("text", { x: 120, y: y + 160, "font-size": 50, "font-weight": 900, fill: c, filter: "url(#neon)", "letter-spacing": 2 }, g, b);
  sv("circle", { cx: 920, cy: y + 105, r: 52, fill: "none", stroke: c, "stroke-width": 6, filter: "url(#neon)" }, g);
  T({ x: 920, y: y + 128, "font-size": 64, fill: c }, g, m);
  return g;
});
// pegadinha
const peg1 = bigText("SEM QUEIXA?", null, 330, 112);
const peg2 = bigText("POLÍCIA AGE", null, 470, 112, GOLD);
peg2.firstChild.setAttribute("fill", GOLD);
const pegNote = sv("g", { opacity: 0 }, OV);
sv("rect", { x: 170, y: 520, width: 740, height: 60, rx: 30, fill: "rgba(13,17,24,.88)", stroke: GOLD, "stroke-width": 2 }, pegNote);
T({ x: 540, y: 560, "font-size": 28, "font-weight": 700 }, pegNote, "Lesão corporal · Lei Maria da Penha · STF");
// teste rápido
const teste = sv("g", { opacity: 0 }, OV);
sv("rect", { width: 1080, height: 1920, fill: "#0b0f17", opacity: 0.93 }, teste);
sv("rect", { width: 1080, height: 1920, fill: "url(#ogrid)" }, teste);
const tq0 = sv("g", {}, teste);
T({ x: 540, y: 300, "font-size": 60, fill: "#a9b4c8", "letter-spacing": 6 }, tq0, "TESTE RÁPIDO");
const tq1 = T({ x: 540, y: 520, "font-size": 120 }, teste, "DESCONFIOU?");
const tq2 = sv("g", {}, teste);
T({ x: 540, y: 520, "font-size": 120 }, tq2, "PRA ONDE");
T({ x: 540, y: 650, "font-size": 120, fill: GOLD }, tq2, "LIGA?");
const cdRing = sv("circle", { cx: 540, cy: 1040, r: 170, fill: "none", stroke: GOLD, "stroke-width": 10, "stroke-dasharray": 2 * Math.PI * 170, transform: "rotate(-90 540 1040)" }, teste);
const cdNum = T({ x: 540, y: 1130, "font-size": 260 }, teste, "3");
const ans = sv("g", { opacity: 0 }, teste);
T({ x: 540, y: 1150, "font-size": 330, fill: GOLD, filter: "url(#neon)" }, ans, "180");
T({ x: 540, y: 1250, "font-size": 46, "font-weight": 800 }, ans, "Central da Mulher");
T({ x: 540, y: 1320, "font-size": 44, "font-weight": 700, fill: GOLD }, ans, "grátis · 24 h · anônimo");
const ans100 = sv("g", { opacity: 0 }, teste);
sv("rect", { x: 110, y: 1400, width: 860, height: 76, rx: 38, fill: "rgba(255,255,255,.05)", stroke: "#56606f", "stroke-width": 2 }, ans100);
T({ x: 540, y: 1450, "font-size": 32, "font-weight": 700 }, ans100, "100 · criança, idoso, pessoa com deficiência");
// alerta
const alerta = sv("g", { opacity: 0 }, OV);
sv("rect", { width: 1080, height: 1920, fill: "url(#alertBg)", opacity: 0.72 }, alerta);
T({ x: 540, y: 250, "font-size": 90 }, alerta, "⚠️");
T({ x: 540, y: 400, "font-size": 112, stroke: "#0d1118", "stroke-width": 10, "paint-order": "stroke" }, alerta, "NUNCA ENFRENTE");
T({ x: 540, y: 520, "font-size": 112, fill: "#ff6b6b", stroke: "#0d1118", "stroke-width": 10, "paint-order": "stroke" }, alerta, "SOZINHO");
// final
const fim1 = bigText("SALVA E", "COMPARTILHA", 330, 120);
const fim2 = bigText("PODE SALVAR", "UMA VIDA", 330, 120);
const logo = sv("g", { opacity: 0 }, OV);
sv("rect", { x: 50, y: 1380, width: 980, height: 260, rx: 40, fill: "rgba(8,10,16,.85)" }, logo);
sv("rect", { x: 250, y: 1420, width: 580, height: 110, rx: 55, fill: "#0d1118", stroke: GOLD, "stroke-width": 4 }, logo);
T({ x: 540, y: 1494, "font-size": 50, "font-weight": 800, fill: GOLD }, logo, "@maiane.sindica");
T({ x: 540, y: 1590, "font-size": 34, "font-weight": 700, fill: "#c9cfd9", "letter-spacing": 4 }, logo, "SÍNDICA PROFISSIONAL · GESTÃO PRESENTE");
const blackout = sv("rect", { width: 1080, height: 1920, fill: "#000", opacity: 0 }, OV);
// selo do perfil no topo
const seal = sv("g", {}, OV);
sv("rect", { x: 380, y: 52, width: 320, height: 56, rx: 28, fill: "rgba(13,17,24,.75)", stroke: GOLD, "stroke-width": 2 }, seal);
T({ x: 540, y: 90, "font-size": 28, "font-weight": 800, fill: GOLD }, seal, "@maiane.sindica");
// legenda palavra por palavra
const capG = sv("g", { opacity: 0 }, OV);
const capBg = sv("rect", { x: 60, y: 1690, width: 960, height: 150, rx: 30, fill: "rgba(8,10,16,.72)" }, capG);
const capT = [T({ x: 540, y: 1752, "font-size": 50 }, capG, ""), T({ x: 540, y: 1814, "font-size": 50 }, capG, "")];
function caption(t) {
  const c = CUES.find(([a, b]) => t >= a - 0.05 && t < b + 0.35);
  if (!c) { capG.setAttribute("opacity", 0); return; }
  const [a, b, text] = c, words = text.split(" ");
  const k = clamp((t - a) / (b - a)) * words.length;
  const rows = text.length > 28 ? [words.slice(0, Math.ceil(words.length / 2)), words.slice(Math.ceil(words.length / 2))] : [words, []];
  let idx = 0;
  rows.forEach((row, r) => {
    const el = capT[r]; el.textContent = "";
    row.forEach((w, j) => {
      const ts = sv("tspan", { fill: idx < k - 1 ? CREAM : idx < k ? GOLD : "rgba(244,241,234,.38)" }, el, (j ? " " : "") + w);
      idx++;
    });
  });
  capT[0].setAttribute("y", rows[1].length ? 1752 : 1782);
  capG.setAttribute("opacity", fadeIO(t, a - 0.05, b + 0.35, 0.12));
}
OV.appendChild(flash);

/* =====================================================================
   LINHA DO TEMPO
   ===================================================================== */
window.render = function (t) {
  const S = {
    hook: inR(t, 0, 6.8), fac: inR(t, 6.8, 28.2), por: inR(t, 28.2, 37.5) || inR(t, 37.5, 62), fim: t >= 62,
  };
  // ---------- 3D (gancho e final) ----------
  const show3D = t < 6.8 || t >= 62;
  document.getElementById("cam").style.visibility = show3D ? "visible" : "hidden";
  if (t < 6.8) {
    const k = ease(prog(t, 0, 6.6));
    const tilt = lerp(42, 64, k), s = lerp(1.35, 3.6, k), rz = lerp(-4, -32, k);
    const cx = lerp(470, 548, k), cy = lerp(1000, 752, k);
    document.getElementById("cam").style.perspective = "1500px";
    world.style.transform = `translate(540px, 1040px) rotateX(${tilt}deg) rotateZ(${rz}deg) scale3d(${s},${s},${s}) translate(${-cx}px, ${-cy}px)`;
    const pulse = 0.55 + 0.45 * Math.abs(Math.sin(t * 5.2));
    redWin.style.opacity = pulse; redHalo.style.opacity = pulse * ease(prog(t, 0.3, 1.2));
  } else if (t >= 62) {
    const k = ease(prog(t, 62, 67));
    const tilt = lerp(58, 8, k), s = lerp(2.4, 1.15, k), rz = lerp(-10, 0, k);
    const cx = lerp(478, 440, k), cy = lerp(1500, 860, k), oy = lerp(1230, 980, k);
    document.getElementById("cam").style.perspective = lerp(1500, 3800, k) + "px";
    world.style.transform = `translate(540px, ${oy}px) rotateX(${tilt}deg) rotateZ(${rz}deg) scale3d(${s},${s},${s}) translate(${-cx}px, ${-cy}px)`;
    redWin.style.opacity = 0; redHalo.style.opacity = 0;
  }
  car.style.transform = "translate3d(-500px,0,0)";
  gate.style.transform = "translate3d(330px,1520px,0)";
  hook1.setAttribute("opacity", fadeIO(t, 0.8, 3.3));
  hook2.setAttribute("opacity", fadeIO(t, 3.4, 6.7));
  hook2.lastChild.setAttribute("opacity", ease(prog(t, 4.9, 5.2)));

  // ---------- fachada ----------
  const fac = t >= 6.8 && t < 28.2;
  FA.style.opacity = fac ? 1 : 0;
  if (!fac) { vol.setAttribute("opacity", 0); chat.setAttribute("opacity", 0); call.setAttribute("opacity", 0); }
  if (fac) {
    const z = lerp(1, 1.12, prog(t, 6.8, 28.2));
    const rw = inR(t, 14.6, 15.8) || inR(t, 24, 25.2);
    const jit = rw ? (Math.sin(t * 91) * 14) : 0;
    FG.setAttribute("transform", `translate(${jit} 0) translate(420 900) scale(${z}) translate(-420 -900)`);
    FA.style.filter = rw ? "saturate(.35) contrast(1.2) hue-rotate(-12deg)" : "none";
    vhs.setAttribute("opacity", rw ? 1 : 0);
    vhsBars.forEach((b, i) => b.setAttribute("y", ((t * 1700 + i * 640) % 1920)));
    const pulse = 0.5 + 0.5 * Math.abs(Math.sin(t * 5.2));
    vGlow.setAttribute("opacity", pulse); vPane.setAttribute("fill", pulse > 0.7 ? "#8a1b24" : "#5a1218");
    [...waves.children].forEach((w) => {
      const i = +w.dataset.i, ph = ((t * 1.6 - i * 0.33) % 1 + 1) % 1;
      w.setAttribute("opacity", (1 - ph) * 0.9);
    });
    // estado de cada cena (na rebobinada volta ao começo)
    const c1 = t < 14.6 ? 1 : t < 15.8 ? 1 - prog(t, 14.6, 15.6) : 0;
    const v = t < 14.6 ? prog(t, 8.4, 11.6) : 1 - prog(t, 14.6, 15.4);
    tvLight.setAttribute("opacity", (inR(t, 6.8, 15.8) ? (0.15 + 0.35 * v) * (0.6 + 0.4 * Math.abs(Math.sin(t * 13))) : 0));
    vol.setAttribute("opacity", inR(t, 8.2, 15.8) ? fadeIO(t, 8.2, 15.8, 0.25) : 0);
    volBars.forEach((b, i) => b.setAttribute("fill", i < Math.round(v * 10) ? (i > 6 ? RED : GOLD) : "#3a4458"));
    poseTV.setAttribute("opacity", t < 15.8 ? 1 : 0);
    posePhone.setAttribute("opacity", inR(t, 15.8, 25.2) ? 1 : 0);
    poseCall.setAttribute("opacity", t >= 25.2 ? 1 : 0);
    // cena 2: mensagem digitada no grupo
    chat.setAttribute("opacity", inR(t, 16.4, 25.2) ? fadeIO(t, 16.4, 25.2, 0.25) : 0);
    const typed = t < 24 ? prog(t, 17.0, 19.3) : 1 - prog(t, 24, 24.8);
    chatTxt.textContent = [...CHAT_MSG].slice(0, Math.round(typed * [...CHAT_MSG].length)).join("");
    chatTicks.setAttribute("opacity", inR(t, 19.5, 24) ? 1 : 0);
    // cena 3a: ligação para o 190
    call.setAttribute("opacity", inR(t, 25.6, 28.2) ? fadeIO(t, 25.6, 28.2, 0.25) : 0);
    calling.setAttribute("opacity", 0.5 + 0.5 * Math.abs(Math.sin(t * 3)));
    rings.forEach((r, i) => { const ph = ((t * 1.2 + i / 3) % 1); r.setAttribute("r", 50 + ph * 90); r.setAttribute("opacity", (1 - ph) * 0.8); });
  }
  showStamp(stOmissao, t, 12.4, 14.7);
  showStamp(stExpoe, t, 20.8, 24.1);
  showStamp(stCerto, t, 34.2, 37.6);

  // ---------- portaria (3b, tabela, pegadinha, teste, alerta) ----------
  const por = t >= 28.2 && t < 62;
  document.getElementById("front").style.opacity = por ? 1 : 0;
  if (por) {
    FS.setAttribute("transform", `translate(540 1700) scale(${lerp(1.08, 1, ease(prog(t, 28.2, 34)))}) translate(-540 -1700)`);
    fTag.setAttribute("opacity", 0.55 + 0.45 * Math.abs(Math.sin(t * 3)));
    fFace.setAttribute("opacity", 0.6 + 0.4 * Math.abs(Math.sin(t * 2.2)));
    beacon.setAttribute("opacity", Math.sin(t * 5) > 0 ? 1 : 0.25);
    const police = t < 42.5;
    pc.setAttribute("opacity", police ? 1 : 0);
    wetSheen.setAttribute("opacity", police ? 0.35 : 0);
    // viatura chega pela direita e para em frente ao portão
    const k = ease(prog(t, 28.3, 30.3));
    const px = lerp(1180, 150, k);
    pcBody.setAttribute("transform", "");
    pc.setAttribute("transform", `translate(${px} 1712)`);
    pcRefl.setAttribute("transform", `translate(0 6)`);
    wheels.forEach((w) => w.setAttribute("transform", `translate(${w.wx} -44) rotate(${-px * 1.3})`));
    fGate.setAttribute("transform", `translate(${-170 * ease(prog(t, 30.6, 31.6))} 0)`);
    // giroflex + luz espalhada + reflexos
    const r = police ? strobe(t, 0) : 0, b = police ? strobe(t, 0.25) : 0;
    barR.setAttribute("opacity", 0.35 + 0.65 * r); barB.setAttribute("opacity", 0.35 + 0.65 * b);
    LIGHT.setAttribute("opacity", police ? Math.min(1, prog(t, 28.2, 28.9)) * (1 - prog(t, 41.8, 42.5)) : 0);
    const lx = px + 246, ly = 1712 - 184;
    spillR.setAttribute("cx", lx - 30); spillR.setAttribute("cy", ly); spillR.setAttribute("opacity", r * 0.85);
    spillB.setAttribute("cx", lx + 30); spillB.setAttribute("cy", ly); spillB.setAttribute("opacity", b * 0.85);
    guaritaR.setAttribute("opacity", r * 0.28); guaritaB.setAttribute("opacity", b * 0.3);
    reflR.setAttribute("cx", lx - 30); reflR.setAttribute("cy", 1840); reflR.setAttribute("opacity", r * 0.9);
    reflB.setAttribute("cx", lx + 30); reflB.setAttribute("cy", 1840); reflB.setAttribute("opacity", b * 0.9);
    streakR.setAttribute("cx", lx - 30); streakR.setAttribute("cy", ly); streakR.setAttribute("opacity", r * 0.8);
    streakB.setAttribute("cx", lx + 30); streakB.setAttribute("cy", ly); streakB.setAttribute("opacity", b * 0.8);
    flares.forEach((f, i) => {
      const kk = +f.dataset.k;
      f.setAttribute("cx", lerp(lx, 1080 - lx, kk)); f.setAttribute("cy", lerp(ly, 1920 - ly, kk) * 0.6 + ly * 0.4);
      f.setAttribute("opacity", Math.max(r, b) * 0.22);
    });
    // Maiane: só a partir da pegadinha, parada em frente à portaria
    const showM = t >= 42.5;
    M.setAttribute("opacity", showM ? 1 : 0);
    M.setAttribute("transform", `translate(330 ${1790 + Math.sin(t * 2.2) * 2}) scale(0.92)`);
    MB.setAttribute("transform", ""); legL.setAttribute("transform", ""); legR.setAttribute("transform", ""); armL.setAttribute("transform", "");
    const up = t >= 42.5 ? ease(prog(t, 47.4, 48.1)) * (1 - ease(prog(t, 58.6, 59.2))) : 0;
    armR.setAttribute("transform", `rotate(${-8 * up} 112 -738)`);
    fore.setAttribute("transform", `rotate(${128 * up} 136 -575)`);
    phone.setAttribute("transform", `rotate(${-128 * up} 133 -470)`);
    screen.setAttribute("opacity", up); phone.querySelector(".pglow").setAttribute("opacity", up);
    head.setAttribute("transform", `rotate(${Math.sin(t * 1.7) * 1.2} 0 -800)`);
  }
  chipGate.setAttribute("opacity", fadeIO(t, 30.6, 37.4));
  chipRec.setAttribute("opacity", fadeIO(t, 32.0, 37.4));
  chipBook.setAttribute("opacity", fadeIO(t, 33.0, 37.4));
  // tabela
  tab.setAttribute("opacity", fadeIO(t, 37.5, 42.5, 0.3));
  tabRows.forEach((g, i) => g.setAttribute("opacity", ease(prog(t, 37.9 + i * 0.6, 38.2 + i * 0.6))));
  // pegadinha
  peg1.setAttribute("opacity", fadeIO(t, 43.2, 50));
  peg2.setAttribute("opacity", fadeIO(t, 47.4, 50));
  pegNote.setAttribute("opacity", fadeIO(t, 47.9, 50));
  // teste rápido
  teste.setAttribute("opacity", fadeIO(t, 50, 58.6, 0.3));
  tq1.setAttribute("opacity", inR(t, 50, 52.6) ? 1 : 0);
  tq2.setAttribute("opacity", inR(t, 52.6, 56.2) ? 1 : 0);
  const cdOn = inR(t, 53.8, 56.2);
  cdRing.setAttribute("opacity", cdOn ? 1 : 0); cdNum.setAttribute("opacity", cdOn ? 1 : 0);
  if (cdOn) {
    const n = 3 - Math.floor((t - 53.8) / 0.8);
    cdNum.textContent = String(n);
    cdRing.setAttribute("stroke-dashoffset", 2 * Math.PI * 170 * (((t - 53.8) % 0.8) / 0.8));
  }
  ans.setAttribute("opacity", ease(prog(t, 56.2, 56.45)));
  ans.setAttribute("transform", `translate(540 1080) scale(${lerp(1.4, 1, ease(prog(t, 56.2, 56.5)))}) translate(-540 -1080)`);
  ans100.setAttribute("opacity", ease(prog(t, 57.5, 57.8)));
  // alerta
  alerta.setAttribute("opacity", fadeIO(t, 58.6, 62, 0.3));
  // final
  fim1.setAttribute("opacity", fadeIO(t, 62.6, 65.3));
  fim2.setAttribute("opacity", fadeIO(t, 65.4, 68.4));
  logo.setAttribute("opacity", ease(prog(t, 65.8, 66.3)));
  seal.setAttribute("opacity", 1 - ease(prog(t, 65.6, 66)));
  blackout.setAttribute("opacity", ease(prog(t, 67.9, 68.5)));
  // cortes com flash
  let fl = 0;
  for (const c of [6.8, 28.2, 62]) fl = Math.max(fl, 1 - Math.abs(t - c) / 0.22);
  flash.setAttribute("opacity", clamp(fl) * 0.85);
  flash.setAttribute("fill", t > 20 && t < 40 ? "#fff" : "#ffe9e9");
  // legenda do rodapé desligada a pedido (a narração da Maiane carrega a mensagem)
};
window.render(0);
