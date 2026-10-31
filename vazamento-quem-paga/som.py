"""Trilha leve + efeitos do reel "Vazou pro vizinho: quem paga?". Gera sfx_trilha.wav (48 kHz, estéreo).
A trilha fica baixa (~0,13) porque a narração contínua da Maiane entra por cima (mixar.py)."""
import numpy as np, wave

SR, DUR = 48000, 58.5
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(5)
tt = lambda d: np.arange(int(SR * d)) / SR
dec = lambda d, k: np.exp(-tt(d) * k)
norm = lambda x: x / (np.max(np.abs(x)) + 1e-9)


def add(t0, sig, gain=1.0, pan=0.0):
    i = int(t0 * SR); n = min(len(sig), N - i)
    if n <= 0: return
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i:i + n] += sig[:n] * gain * l * 1.414; R[i:i + n] += sig[:n] * gain * r * 1.414


def band(x, lo, hi):
    f = np.fft.rfftfreq(len(x), 1 / SR); X = np.fft.rfft(x)
    return np.fft.irfft(X / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4), len(x))


def pluck(f, d=0.8):
    n, p = int(d * SR), max(2, int(SR / f)); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = 0.996 * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out


def bell(f0, d=1.0):
    t = tt(d); return norm(sum(np.sin(2 * np.pi * f0 * k * t) * np.exp(-t * (3 + 2 * k)) / k for k in (1, 2, 3.01, 4.2)))


# ---------- trilha: dedilhado leve; fica mais "pensativo" no problema e resolve na explicação ----------
BEAT = 0.62
PROG = {"leve": ([261.6, 329.6, 392.0], [196.0, 246.9, 293.7], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6]),
        "tenso": ([220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [164.8, 207.7, 246.9], [220.0, 261.6, 329.6])}
t, bar = 0.0, 0
while t < DUR - 0.5:
    mode = "tenso" if 13 <= t < 29 else "leve"
    ch = PROG[mode][bar % 4]
    for i, k in enumerate([0, 1, 2, 1, 0, 1, 2, 1]):
        add(t + i * BEAT / 2, pluck(ch[k] * (2 if i % 4 == 2 else 1)), 0.13, -0.2 + 0.4 * (i % 2))
    add(t, np.sin(2 * np.pi * ch[0] / 2 * tt(BEAT * 4)) * dec(BEAT * 4, 1.2), 0.12)
    t += BEAT * 4; bar += 1

# ---------- efeitos ----------
def whoosh(d=0.6):
    n = int(d * SR); return norm(band(rng.standard_normal(n), 400, 4000) * np.sin(np.linspace(0, np.pi, n)) ** 2)
def plink(): t = tt(.25); return np.sin(2 * np.pi * np.cumsum(np.linspace(1400, 700, len(t))) / SR) * dec(.25, 18)
def zap():
    n = int(.5 * SR); s = band(rng.standard_normal(n), 1500, 9000) * (np.sign(np.sin(2 * np.pi * 37 * tt(.5))) * .5 + .5) * dec(.5, 6)
    return norm(s + 0.6 * np.sin(2 * np.pi * 60 * tt(.5)) * dec(.5, 5))
def tvhum(d): return norm(band(rng.standard_normal(int(d * SR)), 2000, 9000)) * 0.4 + np.sin(2 * np.pi * 15600 * tt(d)) * 0.2
for c in (5, 18, 29.6, 54): add(c - 0.3, whoosh(), 0.14)
# gancho e dano: TV ligada, gotas, estalo
add(0, tvhum(2.8), 0.02); add(5, tvhum(20), 0.012)
for t0 in (0.9, 1.8, 2.6): add(t0, plink(), 0.12, 0.2)
add(2.8, zap(), 0.32); add(25.0, zap(), 0.32)
for t0 in np.arange(21.8, 28.6, 0.9): add(t0 + 0.7, plink(), 0.1, 0.2)
# instalação: chave de boca, água correndo
for t0 in np.arange(6.1, 9.3, 0.35): add(t0, norm(band(rng.standard_normal(int(.05 * SR)), 2500, 8000)) * dec(.05, 80), 0.08, -0.2)
d = 3.0; add(9.6, norm(band(rng.standard_normal(int(d * SR)), 600, 5000)) * np.interp(tt(d), [0, .2, 2.7, 3], [0, 1, 1, 0]), 0.06)
add(11.2, bell(1046.5, 0.6), 0.08)
# o pingo (com eco), relógio dos dias
for t0 in np.arange(14.2, 18, 0.8):
    p = plink(); add(t0 + 0.4, p, 0.16, 0.3); add(t0 + 0.55, p, 0.05, -0.3)
for t0 in np.arange(14.8, 17.6, 0.2): add(t0, np.sin(2 * np.pi * 2200 * tt(.02)) * dec(.02, 200), 0.04)
# infiltração na laje
d = 3.5; add(18, norm(band(rng.standard_normal(int(d * SR)), 60, 400)) * np.interp(tt(d), [0, 1, 3.5], [0, 1, 0]), 0.1)
# diagrama: coluna (dourado) e ramais (azul) acendem; alerta no ponto do vazamento
add(31, bell(523.3, 1.4), 0.12); add(35.2, bell(659.3, 1.4), 0.12)
for t0 in np.arange(41.5, 45.5, 0.5): add(t0, np.sin(2 * np.pi * 880 * tt(.08)) * dec(.08, 30), 0.05)
for t0 in (50.6, 51.4, 52.2): add(t0, norm(band(rng.standard_normal(int(.05 * SR)), 900, 2500)) * dec(.05, 90), 0.25)
add(53.0, bell(880, 1.4) + 0.5 * bell(1318.5, 1.2), 0.14)
add(56.6, bell(523.3, 2) + bell(659.3, 2) + bell(784, 2), 0.08)

fade = np.ones(N); fn = int(1.5 * SR); fade[-fn:] = np.linspace(1, 0, fn)
L *= fade; R *= fade
pk = max(np.abs(L).max(), np.abs(R).max()); L, R = L / pk * 0.9, R / pk * 0.9
with wave.open("sfx_trilha.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.stack([L, R], 1) * 32767).astype(np.int16).tobytes())
print("ok")
