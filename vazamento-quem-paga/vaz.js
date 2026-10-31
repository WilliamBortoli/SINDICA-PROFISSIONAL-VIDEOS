/* Reel "Vazou pro vizinho: quem paga?" — narração contínua (NARRACAO.md), sem legenda no rodapé.
   Reaproveita os auxiliares de ../boa-convivencia/conv.js (palco D, person, title, chip, check, wipe, Maiane). */

window.DURATION = 58.5;
const BLUE = "#3d8bfd", WATER = "#4aa3ff", RED = "#ff3b4e";
const KF = (t, keys) => {                 // interpola keyframes [t, ...valores] com easing
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
    const [a, ...va] = keys[i - 1], [b, ...vb] = keys[i], k = ease((t - a) / (b - a));
    return va.map((v, j) => lerp(v, vb[j], k));
  }
  return keys[keys.length - 1].slice(1);
};
function drop(parent) { const d = g(parent, { opacity: 0 }); P(d, "M 0 -16 Q 11 0 0 10 Q -11 0 0 -16 Z", { fill: WATER }); C(d, { cx: -3, cy: 0, r: 2.5, fill: "#fff", opacity: 0.8 }); return d; }

/* =====================================================================
   CORTE DO PRÉDIO (4 andares, prumada vertical + ramais horizontais)
   ===================================================================== */
const CT = g(D, { opacity: 0 }), CTc = g(CT, {});
R(CTc, { x: -400, y: -400, width: 1880, height: 2720, fill: "url(#dsky)" });
R(CTc, { x: -400, y: 1760, width: 1880, height: 600, fill: "url(#lawn)" });
const SLAB = [500, 800, 1100, 1400, 1700];             // topo de cada laje
R(CTc, { x: 70, y: 440, width: 940, height: 60, fill: "#a7adb7" });          // telhado
R(CTc, { x: 70, y: 500, width: 940, height: 1226, fill: "#efe5cf" });
const ROOM = [["#eaf2f7", "#c9b38f"], ["#f6efe2", "#d1b48c"], ["#fbf2f2", "#b98e62"], ["#eef6ee", "#c9b38f"]];
for (let k = 0; k < 4; k++) {
  const y = SLAB[k] + 26, h = SLAB[k + 1] - y;
  R(CTc, { x: 100, y, width: 720, height: h, fill: ROOM[k][0] });
  R(CTc, { x: 100, y: y + h - 18, width: 720, height: 18, fill: ROOM[k][1] });
  R(CTc, { x: 84, y: y + 50, width: 16, height: 150, fill: "url(#glass)" });  // janela no corte
}
for (const y of SLAB) { R(CTc, { x: 70, y, width: 940, height: 26, fill: "#9aa0a8" }); for (let x = 80; x < 1000; x += 26) P(CTc, `M ${x} ${y + 26} L ${x + 14} ${y}`, { stroke: "#868c94", "stroke-width": 2 }); }
R(CTc, { x: 820, y: 500, width: 120, height: 1226, fill: "#d9d2c3" });          // shaft
const colX = 870;
const column = R(CTc, { x: colX, y: 470, width: 24, height: 1300, rx: 6, fill: "#a9b1bb" });
const branchY = SLAB.slice(1).map((s) => s - 66);
const branches = branchY.map((y) => R(CTc, { x: 600, y, width: colX - 600 + 4, height: 14, rx: 6, fill: "#a9b1bb" }));
// 4º andar e 1º andar: quartos genéricos
R(CTc, { x: 160, y: 700, width: 240, height: 70, rx: 10, fill: "#9db4d8" }); R(CTc, { x: 160, y: 680, width: 70, height: 30, rx: 8, fill: "#fff" });
R(CTc, { x: 520, y: 1580, width: 160, height: 100, rx: 8, fill: "#8fbf8f" }); C(CTc, { cx: 300, cy: 1620, r: 40, fill: "#e9c46a" });
// 3º andar: cozinha do Seu João (pia sobre a TV da Dona Maria)
R(CTc, { x: 480, y: 940, width: 250, height: 150, fill: "#fff", stroke: "#d6d0c4", "stroke-width": 3 });
R(CTc, { x: 470, y: 925, width: 270, height: 18, fill: "#8b8f96" });
P(CTc, "M 600 925 L 600 880 Q 600 860 630 860 L 650 860 L 650 875", { stroke: "#b8c0ca", "stroke-width": 10, fill: "none", "stroke-linecap": "round" });
const joao = person(CTc, { top: "#2a9d8f", pants: "#2c3e50", hair: "#3b2a1e", s: 0.5 });
placePerson(joao, 400, 1094); walk(joao, 0, 0, 0);
const leakJ = [612, branchY[1] + 7];
const puddle = E(CTc, { cx: 612, cy: 1092, rx: 0, ry: 6, fill: WATER, opacity: 0.8 });
const seep = R(CTc, { x: 575, y: 1100, width: 70, height: 26, fill: WATER, opacity: 0 });
// 2º andar: sala da Dona Maria
R(CTc, { x: 150, y: 1310, width: 250, height: 80, rx: 18, fill: "#e07a5f" }); R(CTc, { x: 150, y: 1280, width: 60, height: 70, rx: 14, fill: "#c9654d" });
R(CTc, { x: 520, y: 1355, width: 180, height: 45, fill: "#7a5a3c" });
R(CTc, { x: 515, y: 1225, width: 190, height: 120, rx: 8, fill: "#16181d" });
const tvScreen = R(CTc, { x: 525, y: 1235, width: 170, height: 100, rx: 4, fill: "#3d8bfd" });
const tvGlow = E(CTc, { cx: 610, cy: 1285, rx: 160, ry: 110, fill: "#9cc7ff", opacity: 0.25 });
const spark = g(CTc, { opacity: 0 });
for (let i = 0; i < 8; i++) R(spark, { x: 607, y: 1170, width: 6, height: 40, rx: 3, fill: "#ffd60a", transform: `rotate(${i * 45} 610 1230)` });
const smoke = [0, 1, 2].map((i) => C(CTc, { r: 18 + i * 6, fill: "#8d9199", opacity: 0 }));
const stain = E(CTc, { cx: 608, cy: 1130, rx: 0, ry: 0, fill: "#b8996a", opacity: 0.75 });
const maria = person(CTc, { top: "#9b5de5", pants: "#6d597a", hair: "#cfcfcf", pony: true, s: 0.55, dir: -1 });
const ctDrops = [0, 1, 2].map(() => drop(CTc));
// destaques do diagrama
const dim = R(CTc, { x: 70, y: 440, width: 940, height: 1290, fill: "#fff", opacity: 0 });
const colGlow = R(CTc, { x: colX - 6, y: 470, width: 36, height: 1300, rx: 12, fill: GOLD, opacity: 0, filter: "url(#soft6)" });
const colHi = R(CTc, { x: colX, y: 470, width: 24, height: 1300, rx: 6, fill: GOLD, opacity: 0 });
const brHi = branchY.map((y) => R(CTc, { x: 600, y, width: colX - 600 + 4, height: 14, rx: 6, fill: BLUE, opacity: 0 }));
const leakMark = g(CTc, { opacity: 0 }); C(leakMark, { r: 26, fill: "none", stroke: RED, "stroke-width": 6 }); C(leakMark, { r: 9, fill: RED });
const colLeak = g(CTc, { opacity: 0 }); C(colLeak, { r: 26, fill: "none", stroke: RED, "stroke-width": 6 }); C(colLeak, { r: 9, fill: RED });
const trace = P(CTc, `M 608 1150 L 608 ${leakJ[1] + 20}`, { stroke: RED, "stroke-width": 6, "stroke-dasharray": "14 10", fill: "none", opacity: 0 });
const tagV = chip(CTc, 600, 610, "VERTICAL · CONDOMÍNIO", GOLD);
const tagH = chip(CTc, 450, 680, "HORIZONTAL · PROPRIETÁRIO", BLUE);

/* =====================================================================
   COZINHA EM CLOSE (instalação e o pingo)
   ===================================================================== */
const KC = g(D, { opacity: 0 }), KCc = g(KC, {});
R(KCc, { x: -200, y: -200, width: 1480, height: 1720, fill: "#eef3f6" });
for (let y = 300; y < 1150; y += 70) R(KCc, { x: -200, y, width: 1480, height: 2, fill: "#d9e2e8" });
for (let x = 0; x < 1080; x += 70) R(KCc, { x, y: 300, width: 2, height: 850, fill: "#d9e2e8" });
R(KCc, { x: 80, y: 360, width: 300, height: 330, rx: 10, fill: "url(#dsky)", stroke: "#fff", "stroke-width": 16 });
R(KCc, { x: -200, y: 1500, width: 1480, height: 620, fill: "#c89f6f" });
for (let y = 1530; y < 1920; y += 60) R(KCc, { x: -200, y, width: 1480, height: 3, fill: "#a87f52" });
R(KCc, { x: 300, y: 1180, width: 640, height: 320, fill: "#3b3f47" });           // armário aberto (interior escuro)
R(KCc, { x: 300, y: 1180, width: 70, height: 320, fill: "#fff", stroke: "#d6d0c4", "stroke-width": 3 });
R(KCc, { x: 870, y: 1180, width: 70, height: 320, fill: "#fff", stroke: "#d6d0c4", "stroke-width": 3 });
R(KCc, { x: 280, y: 1140, width: 680, height: 42, rx: 6, fill: "#8b8f96" });
R(KCc, { x: 480, y: 1182, width: 240, height: 70, rx: 12, fill: "#c5ccd4" });     // cuba
P(KCc, "M 600 1252 L 600 1330 Q 600 1380 650 1380 Q 700 1380 700 1330 L 700 1300", { stroke: "#cfd5dc", "stroke-width": 22, fill: "none" }); // sifão
R(KCc, { x: 860, y: 1390, width: 60, height: 40, rx: 8, fill: "#c0c6cf" });       // registro na parede
const hose = P(KCc, "M 640 1252 Q 660 1420 860 1410", { stroke: "#c9ced6", "stroke-width": 12, fill: "none", "stroke-dasharray": "6 4" });
const joint = C(KCc, { cx: 858, cy: 1410, r: 14, fill: "#b5bcc5", stroke: "#8b929b", "stroke-width": 3 });
const faucet = g(KCc, {});
P(faucet, "M 640 1140 L 640 1010 Q 640 950 700 950 Q 760 950 760 1010 L 760 1040", { stroke: "#cfd6de", "stroke-width": 26, fill: "none", "stroke-linecap": "round" });
P(faucet, "M 640 1140 L 640 1010 Q 640 950 700 950", { stroke: "#fff", "stroke-width": 6, fill: "none", opacity: 0.7 });
R(faucet, { x: 610, y: 1100, width: 60, height: 40, rx: 8, fill: "#b9c1ca" });
const stream = R(KCc, { x: 752, y: 1052, width: 16, height: 130, rx: 8, fill: WATER, opacity: 0 });
const kcDrop = drop(KCc);
const kcPuddle = E(KCc, { cx: 858, cy: 1492, rx: 0, ry: 7, fill: WATER, opacity: 0.85 });
const jk = person(KCc, { top: "#2a9d8f", pants: "#2c3e50", hair: "#3b2a1e", s: 1.05 });
const wrench = g(jk.parts.hand, {});
R(wrench, { x: -7, y: -250, width: 14, height: 80, rx: 6, fill: "#8d939c" });
P(wrench, "M -16 -262 L -16 -240 L -4 -240 L -4 -250 L 4 -250 L 4 -240 L 16 -240 L 16 -262 Z", { fill: "#8d939c" });
const thumbs = TX(KCc, { x: 330, y: 1010, "font-size": 90, opacity: 0 }, "👍");
const dayChip = chip(KC, 540, 900, "💧 dia 14", "#5b8def");
const dayTxt = dayChip.querySelector("text");

/* =====================================================================
   FINAL: Maiane
   ===================================================================== */
const FN = g(D, { opacity: 0 });
R(FN, { x: 0, y: 0, width: 1080, height: 1920, fill: "url(#dsky)" });
[[60, 380], [520, 440]].forEach(([x, w]) => {
  R(FN, { x, y: 820, width: w, height: 900, fill: "#efe5cf" });
  for (let fl = 0; fl < 5; fl++) for (let wx = x + 30; wx < x + w - 60; wx += 110) R(FN, { x: wx, y: 860 + fl * 160, width: 70, height: 90, fill: "url(#glass)" });
  R(FN, { x, y: 1600, width: w, height: 120, fill: "#c4c7cc" });
});
R(FN, { x: 0, y: 1720, width: 1080, height: 200, fill: "url(#lawn)" });
FN.appendChild(M);

/* =====================================================================
   TÍTULOS (topo) — sem legenda no rodapé
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
const caseChip = chip(OV, 540, 520, "conserto + TV da vizinha", RED);
const okCond = check(OV, 540, 720);
const cd = g(OV, { opacity: 0 });
C(cd, { cx: 540, cy: 1100, r: 130, fill: "rgba(31,36,48,.85)" });
const cdRing = C(cd, { cx: 540, cy: 1100, r: 130, fill: "none", stroke: GOLD, "stroke-width": 10, "stroke-dasharray": 2 * Math.PI * 130, transform: "rotate(-90 540 1100)" });
const cdNum = TX(cd, { x: 540, y: 1170, "font-size": 190 }, "3");
const logo2 = g(OV, { opacity: 0 });
R(logo2, { x: 250, y: 1720, width: 580, height: 104, rx: 52, fill: "#1f2430", stroke: GOLD, "stroke-width": 4 });
TX(logo2, { x: 540, y: 1788, "font-size": 48, "font-weight": 800, fill: GOLD }, "@maiane.sindica");
OV.appendChild(wipe);

/* =====================================================================
   LINHA DO TEMPO (sincronizada com a narração planejada)
   ===================================================================== */
const CAM = [[0, 540, 1140, 1.45], [4.6, 540, 1140, 1.45], [18, 560, 1120, 1.5], [22, 560, 1260, 1.75], [28.6, 560, 1260, 1.75],
  [30.2, 540, 1110, 1.0], [40.8, 540, 1110, 1.0], [41.8, 600, 1000, 1.45], [45.6, 600, 1000, 1.45], [46.6, 600, 1110, 1.3], [49.6, 600, 1110, 1.3], [50.4, 540, 1110, 1.0]];
const KCAM = [[5, 600, 1200, 1.0], [12.8, 600, 1200, 1.0], [14.4, 840, 1400, 2.3], [18, 840, 1400, 2.5]];
const tvOn = (t) => t < 2.8 || (t > 5 && t < 25.0);

window.render = function (t) {
  document.getElementById("front").style.opacity = 0;
  document.getElementById("cam").style.visibility = "hidden";
  birds3d.setAttribute("opacity", 0);
  SCENES.forEach(([s]) => s.setAttribute("opacity", 0));
  const inCT = t < 5 || (t >= 18 && t < 54), inKC = t >= 5 && t < 18, inFN = t >= 54;
  CT.setAttribute("opacity", inCT ? 1 : 0); KC.setAttribute("opacity", inKC ? 1 : 0); FN.setAttribute("opacity", inFN ? 1 : 0);

  // ---------- corte do prédio ----------
  if (inCT) {
    const [cx, cy, s] = KF(t, CAM);
    CTc.setAttribute("transform", `translate(540 1100) scale(${s}) translate(${-cx} ${-cy})`);
    const on = tvOn(t);
    tvScreen.setAttribute("fill", on ? `hsl(${(t * 40) % 360},70%,60%)` : "#0b0c10");
    tvGlow.setAttribute("opacity", on ? 0.22 + 0.06 * Math.sin(t * 12) : 0);
    const sparkAt = t < 5 ? 2.8 : 25.0;
    const sk = prog(t, sparkAt, sparkAt + 0.5);
    spark.setAttribute("opacity", sk > 0 && sk < 1 ? 1 - sk : 0);
    spark.setAttribute("transform", `translate(610 1230) scale(${0.6 + sk}) translate(-610 -1230)`);
    smoke.forEach((c, i) => { const k = prog(t, sparkAt + 0.2 + i * 0.2, sparkAt + 2.2 + i * 0.2); c.setAttribute("cx", 600 + i * 20 + k * 30); c.setAttribute("cy", 1220 - k * 120); c.setAttribute("opacity", k > 0 && k < 1 ? 0.5 * (1 - k) : 0); });
    // vazamento: poça no 3º, infiltração na laje, mancha no teto da Dona Maria
    const leakK = t < 5 ? 1 : prog(t, 18, 21.5);
    puddle.setAttribute("rx", 70 * leakK); seep.setAttribute("opacity", 0.75 * leakK);
    stain.setAttribute("rx", 70 * (t < 5 ? 1 : prog(t, 19.5, 24))); stain.setAttribute("ry", 14 * (t < 5 ? 1 : prog(t, 19.5, 24)));
    ctDrops.forEach((d, i) => {
      const per = 0.9, st = t < 5 ? 0.6 : 21.8, ph = ((t - st - i * 0.3) % per + per) % per / per;
      const active = t < 5 ? t > st + i * 0.3 && t < 3.6 : t > st + i * 0.3 && t < 29;
      d.setAttribute("opacity", active ? 1 : 0);
      d.setAttribute("transform", `translate(${608 + i * 6} ${lerp(1150, 1222, ph * ph)})`);
    });
    // Dona Maria: assiste TV, depois mãos na cabeça
    const panic = t < 5 ? ease(prog(t, 3.0, 3.4)) : ease(prog(t, 25.3, 25.7));
    placePerson(maria, 470, 1394);
    walk(maria, 0, 0, lerp(0, -165, panic));
    maria.parts.armB.setAttribute("transform", `rotate(${lerp(0, -165, panic)} 0 -312)`);
    // diagrama
    const diag = t >= 29.6;
    dim.setAttribute("opacity", diag ? 0.45 * ease(prog(t, 29.6, 30.4)) : 0);
    const cg = diag ? ease(prog(t, 31, 31.6)) : 0, bg = diag ? ease(prog(t, 35.2, 35.8)) : 0;
    colHi.setAttribute("opacity", cg); colGlow.setAttribute("opacity", cg * (0.6 + 0.4 * Math.sin(t * 4)));
    brHi.forEach((b) => b.setAttribute("opacity", bg));
    pop(tagV, t, 31.4, 41); pop(tagH, t, 35.6, 41);
    leakMark.setAttribute("transform", `translate(${leakJ[0]} ${leakJ[1]}) scale(${1 + 0.25 * Math.sin(t * 8)})`);
    leakMark.setAttribute("opacity", t >= 41.5 && t < 50 ? 1 : 0);
    trace.setAttribute("opacity", t >= 46.8 && t < 50 ? 1 : 0); trace.setAttribute("stroke-dashoffset", -t * 60);
    colLeak.setAttribute("transform", `translate(${colX + 12} 760) scale(${1 + 0.25 * Math.sin(t * 8)})`);
    colLeak.setAttribute("opacity", t >= 50.4 && t < 54 ? 1 : 0);
  }
  // ---------- cozinha em close ----------
  if (inKC) {
    const [cx, cy, s] = KF(t, KCAM);
    KCc.setAttribute("transform", `translate(540 1100) scale(${s}) translate(${-cx} ${-cy})`);
    placePerson(jk, 330, 1720);
    const working = t > 6 && t < 9.4;
    walk(jk, 0, 0, t > 11 && t < 12.8 ? -150 : working ? -105 + Math.sin(t * 9) * 12 : -20);
    wrench.setAttribute("opacity", t < 10.8 ? 1 : 0);
    faucet.setAttribute("transform", `translate(0 ${lerp(-260, 0, ease(prog(t, 5.6, 6.6)))})`);
    faucet.setAttribute("opacity", ease(prog(t, 5.4, 5.8)));
    stream.setAttribute("opacity", t > 9.6 && t < 12.6 ? 0.85 : 0);
    stream.setAttribute("height", 130 * ease(prog(t, 9.6, 9.9)));
    thumbs.setAttribute("opacity", fadeIO(t, 11.2, 12.8, 0.2));
    // o pingo na conexão (após "2 semanas")
    const per = 0.8, ph = ((t - 14.2) % per + per) % per / per;
    kcDrop.setAttribute("opacity", t > 14.2 ? 1 : 0);
    kcDrop.setAttribute("transform", `translate(858 ${ph < 0.4 ? 1428 : lerp(1428, 1488, ((ph - 0.4) / 0.6) ** 2)}) scale(${ph < 0.4 ? 0.3 + ph * 1.75 : 1})`);
    kcPuddle.setAttribute("rx", 80 * prog(t, 14.4, 18));
    pop(dayChip, t, 14.6, 18);
    dayTxt.textContent = `💧 dia ${Math.max(1, Math.round(lerp(1, 14, prog(t, 14.8, 17.6))))}`;
  }
  // ---------- final com a Maiane ----------
  if (inFN) {
    const lt = t - 54, k = ease(prog(lt, 0.1, 1.8)), walking = lt > 0.1 && lt < 1.9 ? Math.min(1, 1 - prog(lt, 1.6, 1.9)) : 0;
    const ph = lt * Math.PI * 3.6;
    M.setAttribute("transform", `translate(${lerp(-260, 330, k)} ${1790 - Math.abs(Math.sin(ph)) * 10 * walking}) scale(0.92)`);
    MB.setAttribute("transform", `rotate(${Math.sin(ph) * 1.6 * walking} 0 -450)`);
    legL.setAttribute("transform", `translate(0 ${-Math.max(0, Math.sin(ph)) * 34 * walking})`);
    legR.setAttribute("transform", `translate(0 ${-Math.max(0, -Math.sin(ph)) * 34 * walking})`);
    armL.setAttribute("transform", `rotate(${-Math.sin(ph) * 8 * walking} -106 -738)`);
    const up = ease(prog(lt, 2.0, 2.6));
    armR.setAttribute("transform", `rotate(${-8 * up} 112 -738)`);
    fore.setAttribute("transform", `rotate(${128 * up} 136 -575)`);
    phone.setAttribute("transform", `rotate(${-128 * up} 133 -470)`);
    screen.setAttribute("opacity", up); phone.querySelector(".pglow").setAttribute("opacity", 0);
    head.setAttribute("transform", `rotate(${Math.sin(t * 1.7) * 1.5} 0 -800)`);
  }
  // ---------- títulos ----------
  showTitle(T.gancho, t, 0.4, 4.9); showTitle(T.diy, t, 5.4, 12.8); showTitle(T.semanas, t, 12.9, 14.6);
  showTitle(T.pingou, t, 14.7, 21.9); showTitle(T.agora, t, 26.6, 29.4);
  showTitle(T.vert, t, 31.2, 35.1); showTitle(T.hor, t, 35.2, 41.2); pop(note, t, 37.2, 41.2);
  showTitle(T.joao, t, 41.6, 45.9); pop(caseChip, t, 42.6, 45.9);
  showTitle(T.origem, t, 46.4, 49.9); showTitle(T.teste, t, 50.2, 52.9); showTitle(T.cond, t, 53.0, 54.0);
  showCheck(okCond, t, 53.0); okCond.setAttribute("opacity", t >= 53 && t < 54 ? okCond.getAttribute("opacity") : 0);
  const cdOn = t >= 50.6 && t < 53;
  cd.setAttribute("opacity", cdOn ? 1 : 0);
  if (cdOn) { cdNum.textContent = String(3 - Math.floor((t - 50.6) / 0.8)); cdRing.setAttribute("stroke-dashoffset", 2 * Math.PI * 130 * (((t - 50.6) % 0.8) / 0.8)); }
  showTitle(T.sindica, t, 54.2, 56.3); showTitle(T.salva, t, 56.4, 58.5);
  logo2.setAttribute("opacity", ease(prog(t, 56.6, 57)));
  seal.setAttribute("opacity", 1 - ease(prog(t, 56.4, 56.7)));
  let wx = -2000;
  for (const c of [5, 18, 29.6, 54]) if (Math.abs(t - c) < 0.3) wx = lerp(-900, 1500, (t - c + 0.3) / 0.6);
  wipe.setAttribute("transform", `translate(${wx} 0)`);
};
window.render(0);
