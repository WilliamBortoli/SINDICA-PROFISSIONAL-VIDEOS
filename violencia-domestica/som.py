"""Trilha e efeitos do reel "Violência doméstica" (sem a narração).
Gera sfx_trilha.wav (48 kHz, estéreo). A voz da Maiane entra depois, por cima, nos tempos de CUES (cenas.js)."""
import numpy as np, wave

SR, DUR = 48000, 68.5
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
tt = lambda d: np.arange(int(SR * d)) / SR


def add(t0, sig, gain=1.0, pan=0.0):
    i = int(t0 * SR); n = min(len(sig), N - i)
    if n <= 0: return
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i:i + n] += sig[:n] * gain * l * 1.414
    R[i:i + n] += sig[:n] * gain * r * 1.414


def band(x, lo, hi):
    f = np.fft.rfftfreq(len(x), 1 / SR); X = np.fft.rfft(x)
    m = 1 / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))


def env(n, a, r):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def dec(d, k):  # decaimento exponencial
    return np.exp(-tt(d) * k)


def norm(x): return x / (np.max(np.abs(x)) + 1e-9)

# ---------- cama: piano/pad grave em lá menor → fá (tabela) → lá menor ----------
def pad(t0, d, freqs, g):
    t = tt(d); s = np.zeros_like(t)
    for f in freqs:
        for det in (-0.6, 0.6):
            s += np.sin(2 * np.pi * (f + det) * t) + 0.25 * np.sin(4 * np.pi * (f + det) * t)
    s *= (0.8 + 0.2 * np.sin(2 * np.pi * 0.15 * t)) * env(len(t), 1.5, 1.5)
    add(t0, norm(s), g)

AM, FM = [110, 164.8, 220, 261.6], [87.3, 130.8, 174.6, 220]
pad(0, 15, AM, 0.10); pad(13.5, 24, AM, 0.10); pad(36.5, 7, FM, 0.10); pad(42, 20, AM, 0.10); pad(60.5, 8, [130.8, 196, 261.6, 329.6], 0.10)
# notas soltas de piano (melancólicas)
def piano(t0, f, g=0.08):
    t = tt(2.5); s = sum(np.sin(2 * np.pi * f * k * t) / k ** 1.5 for k in (1, 2, 3, 4)) * dec(2.5, 2.2)
    s[:200] *= np.linspace(0, 1, 200); add(t0, norm(s), g, rng.uniform(-.3, .3))
for t0, f in [(0.3, 440), (2.6, 392), (4.8, 329.6), (7.4, 440), (11.0, 523.3), (16.4, 440), (19.9, 392), (43.0, 329.6), (45.4, 293.7), (47.4, 261.6), (50.2, 440), (63.0, 523.3), (65.4, 659.3), (66.4, 523.3)]:
    piano(t0, f)

# ---------- ambiente noturno ----------
amb = band(rng.standard_normal(N), 60, 500); add(0, norm(amb) * env(N, 2, 1.5), 0.035)
for t0 in np.arange(0.5, DUR - 1, 1.7):              # grilos
    if 28 < t0 < 42.5 or 37.5 < t0 < 42.5: continue
    for k in range(3):
        c = np.sin(2 * np.pi * 4600 * tt(0.035)) * env(int(0.035 * SR), 0.005, 0.02)
        add(t0 + k * 0.06 + rng.uniform(0, .3), c, 0.012, rng.uniform(-.8, .8))

# ---------- gancho: batimento + pancadas abafadas através da parede ----------
def thump(f=55, d=0.16): return np.sin(2 * np.pi * f * tt(d)) * dec(d, 28)
for t0 in np.arange(0.5, 6.6, 0.85):
    add(t0, thump(), 0.45); add(t0 + 0.2, thump(48), 0.3)
for t0 in (1.1, 2.4, 9.3, 10.9):
    add(t0, norm(band(rng.standard_normal(int(.35 * SR)), 40, 220)) * dec(.35, 12), 0.35, 0.2)

# ---------- whoosh nos cortes ----------
def whoosh(d=0.6):
    n = int(d * SR); x = rng.standard_normal(n)
    s = band(x, 300, 3500) * np.sin(np.linspace(0, np.pi, n)) ** 2
    return norm(s)
for t0 in (6.45, 27.9, 37.2, 42.2, 49.7, 58.3, 61.6):
    add(t0, whoosh(), 0.22, rng.uniform(-.4, .4))

# ---------- cena 1: TV abafada subindo de volume ----------
d = 7.6; n = int(d * SR); t = tt(d)
tv = band(rng.standard_normal(n), 250, 1600)
syl = 0.5 + 0.5 * np.sin(2 * np.pi * 4.3 * t + 3 * np.sin(2 * np.pi * 0.7 * t))
gain = np.interp(t + 7.0, [7.0, 8.4, 11.6, 14.4, 14.9], [0.25, 0.3, 1.0, 1.0, 0])
add(7.0, norm(tv * syl) * gain, 0.10, -0.35)

# ---------- carimbos neon ----------
def stampfx():
    s = np.sin(2 * np.pi * 50 * tt(.5)) * dec(.5, 7) + 0.4 * band(rng.standard_normal(int(.5 * SR)), 1500, 6000) * dec(.5, 60)
    buzz = np.sign(np.sin(2 * np.pi * 120 * tt(.5))) * dec(.5, 6) * 0.15
    s[:len(buzz)] += buzz; return norm(s)
for t0 in (12.4, 20.8, 34.2):
    add(t0, stampfx(), 0.5)

# ---------- rebobinada (fita voltando) ----------
def rewind(d=1.2):
    t = tt(d); f = 1800 + 2600 * (t / d) + 400 * np.sin(2 * np.pi * 23 * t)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5 + band(rng.standard_normal(len(t)), 2000, 9000) * 0.6
    s *= (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 9 * t))) * env(len(t), .05, .15)
    return norm(s)
add(14.6, rewind(), 0.18); add(24.0, rewind(), 0.18)

# ---------- cena 2: digitação + envio ----------
for t0 in np.arange(17.0, 19.3, 0.11):
    c = band(rng.standard_normal(int(.02 * SR)), 2000, 8000) * dec(.02, 250)
    add(t0 + rng.uniform(0, .04), norm(c), 0.10, -0.3)
t = tt(.12); pop = np.sin(2 * np.pi * np.cumsum(np.linspace(700, 1400, len(t))) / SR) * dec(.12, 30)
add(19.5, pop, 0.25)

# ---------- cena 3a: chamada para o 190 (tom de chamada) ----------
for t0 in (26.3, 27.3):
    add(t0, np.sin(2 * np.pi * 425 * tt(.9)) * env(int(.9 * SR), .02, .05), 0.10)

# ---------- cena 3b: viatura (motor, sirene, freio), portão, câmera, livro ----------
d = 2.4; t = tt(d)
eng = band(rng.standard_normal(len(t)), 40, 260) + 0.6 * np.sin(2 * np.pi * (48 - 14 * t / d) * t)
pan = np.linspace(0.9, -0.2, len(t))
for i0 in range(0, len(t), 4800):  # panorâmica da direita pro centro em blocos
    seg = norm(eng)[i0:i0 + 4800] * env(len(t), .4, .6)[i0:i0 + 4800]
    add(28.1 + i0 / SR, seg, 0.30, pan[i0])
d = 14.2; t = tt(d)
f = 950 + 380 * np.sin(2 * np.pi * t / 2.6)
siren = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
sg = np.interp(t + 28.1, [28.1, 28.9, 31.0, 34.0, 37.5, 42.3], [0, 1, 0.75, 0.45, 0.3, 0])
add(28.1, norm(band(siren, 300, 5000)) * sg, 0.11, 0.3)
add(30.0, np.sin(2 * np.pi * 2400 * tt(.35)) * env(int(.35 * SR), .05, .2), 0.03)          # freio
d = 1.0; t = tt(d)
add(30.6, norm(np.sign(np.sin(2 * np.pi * 95 * t)) * 0.3 + band(rng.standard_normal(len(t)), 80, 900)) * env(len(t), .1, .2), 0.10, -0.3)  # motor do portão
for k in (0, 0.14):
    add(32.0 + k, np.sin(2 * np.pi * 1600 * tt(.08)) * env(int(.08 * SR), .005, .03), 0.10, 0.4)  # bip da câmera
add(33.0, norm(band(rng.standard_normal(int(.3 * SR)), 1500, 7000)) * dec(.3, 14), 0.10, 0.4)   # folha do livro

# ---------- tabela, teste rápido, alerta, final ----------
def blip(f, d=0.18): return np.sin(2 * np.pi * f * tt(d)) * dec(d, 18)
for t0, f in ((37.9, 520), (38.5, 470), (39.1, 784)):
    add(t0, blip(f), 0.18)
def tick(): return norm(band(rng.standard_normal(int(.05 * SR)), 900, 2500)) * dec(.05, 90)
for t0 in (53.8, 54.6, 55.4):
    add(t0, tick(), 0.35)
def bell(f0, d=2.2):
    t = tt(d); return norm(sum(np.sin(2 * np.pi * f0 * k * t) * np.exp(-t * (2 + k)) / k for k in (1, 2, 2.76, 4.07)))
add(56.2, bell(880), 0.25); add(57.5, blip(660, .12), 0.12)
t = tt(1.4); boom = np.sin(2 * np.pi * np.cumsum(np.linspace(70, 32, len(t))) / SR) * dec(1.4, 3)
add(58.6, boom, 0.5)
n = int(.9 * SR); riser = band(rng.standard_normal(n), 400, 6000) * np.linspace(0, 1, n) ** 2
add(61.2, norm(riser), 0.12)
add(65.8, bell(659.3, 2.6), 0.18)

# ---------- final: fade + normalização ----------
fade = np.ones(N); fn = int(1.2 * SR); fade[-fn:] = np.linspace(1, 0, fn)
L *= fade; R *= fade
peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
L, R = L / peak * 0.9, R / peak * 0.9
out = (np.stack([L, R], 1) * 32767).astype(np.int16)
with wave.open("sfx_trilha.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print("ok", out.shape[0] / SR, "s")
