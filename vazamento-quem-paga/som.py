"""Trilha leve + efeitos do reel "Vazou pro vizinho: quem paga?". Gera sfx_trilha.wav (48 kHz, estéreo).
A trilha fica baixa (~0,13) porque a narração contínua da Maiane entra por cima (mixar.py)."""
import numpy as np, wave

SR, DUR = 48000, 61.0
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
    mode = "tenso" if 15 <= t < 31 else "leve"
    ch = PROG[mode][bar % 4]
    for i, k in enumerate([0, 1, 2, 1, 0, 1, 2, 1]):
        add(t + i * BEAT / 2, pluck(ch[k] * (2 if i % 4 == 2 else 1)), 0.13, -0.2 + 0.4 * (i % 2))
    add(t, np.sin(2 * np.pi * ch[0] / 2 * tt(BEAT * 4)) * dec(BEAT * 4, 1.2), 0.12)
    t += BEAT * 4; bar += 1

# ---------- efeitos (linha do tempo v2) ----------
def whoosh(d=0.6):
    n = int(d * SR); return norm(band(rng.standard_normal(n), 400, 4000) * np.sin(np.linspace(0, np.pi, n)) ** 2)
def plink(): t = tt(.25); return np.sin(2 * np.pi * np.cumsum(np.linspace(1400, 700, len(t))) / SR) * dec(.25, 18)
def zap():
    n = int(.5 * SR); s = band(rng.standard_normal(n), 1500, 9000) * (np.sign(np.sin(2 * np.pi * 37 * tt(.5))) * .5 + .5) * dec(.5, 6)
    return norm(s + 0.6 * np.sin(2 * np.pi * 60 * tt(.5)) * dec(.5, 5))
def tvsound(d):  # novela abafada: cordas + vozes indistintas
    t = tt(d); v = band(rng.standard_normal(len(t)), 300, 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * 3.7 * t + 2 * np.sin(t)))
    return norm(v * 0.5 + np.sin(2 * np.pi * 330 * t) * 0.2 + np.sin(2 * np.pi * 415 * t) * 0.15)
def meow(): t = tt(.45); f = 700 + 300 * np.sin(np.linspace(0, np.pi, len(t))); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.linspace(0, np.pi, len(t))) * (0.6 + 0.4 * np.sin(2 * np.pi * 6 * t))
# drone: zumbido subindo e whoosh na janela
d = 3.2; t = tt(d); drn = np.sin(2 * np.pi * np.cumsum(180 + 60 * t / d + 4 * np.sin(2 * np.pi * 30 * t)) / SR) + 0.4 * band(rng.standard_normal(len(t)), 800, 4000)
add(0, norm(drn) * np.interp(t, [0, .5, 2.6, 3.2], [0, 1, 1, 0]), 0.08)
add(2.7, whoosh(0.7), 0.22)
# sala: novela, gotas, estalo, gato
add(3.0, tvsound(2.0), 0.05); add(24.0, tvsound(3.6), 0.05)
for t0 in np.arange(3.6, 5.0, 0.85): add(t0 + 0.3, plink(), 0.12, 0.2)
for t0 in np.arange(26.2, 29, 0.85): add(t0 + 0.3, plink(), 0.12, 0.2)
add(5.0, zap(), 0.34); add(27.6, zap(), 0.34)
add(5.1, meow(), 0.06, -0.5); add(27.7, meow(), 0.06, -0.5)
# subida pela laje
add(7.0, whoosh(1.0), 0.18)
# cozinha: passos, caixa, torneira velha, chave (clic), água, joinha
for t0 in np.arange(7.8, 8.9, 0.38): add(t0, norm(band(rng.standard_normal(int(.07 * SR)), 150, 1200)) * dec(.07, 60), 0.1, -0.3)
add(9.4, np.sin(2 * np.pi * 120 * tt(.15)) * dec(.15, 30), 0.15)
add(10.4, norm(band(rng.standard_normal(int(.2 * SR)), 800, 4000)) * dec(.2, 25), 0.1)
for t0 in np.arange(11.45, 12.8, 0.25): add(t0, norm(band(rng.standard_normal(int(.04 * SR)), 2500, 8000)) * dec(.04, 90), 0.12, -0.2)
d = 1.7; add(12.9, norm(band(rng.standard_normal(int(d * SR)), 600, 5000)) * np.interp(tt(d), [0, .15, 1.5, 1.7], [0, 1, 1, 0]), 0.07)
add(13.6, bell(1046.5, 0.6), 0.08); add(14.5, bell(392, 1.2), 0.06)   # "Parecia."
# 2 semanas: relógio acelerado, pingos com eco, assobio
for t0 in np.arange(15.0, 16.8, 0.07): add(t0, np.sin(2 * np.pi * 2400 * tt(.015)) * dec(.015, 300), 0.04)
for t0 in np.arange(16.8, 21.6, 0.45):
    p = plink(); add(t0 + 0.4, p, 0.15, 0.3); add(t0 + 0.55, p, 0.05, -0.3)
for k, f in enumerate([880, 988, 1046, 988, 880]): add(18.5 + k * 0.28, np.sin(2 * np.pi * f * tt(.25)) * np.sin(np.linspace(0, np.pi, int(.25 * SR))), 0.025, 0.6)
# infiltração na laje
d = 2.4; add(21.6, norm(band(rng.standard_normal(int(d * SR)), 60, 400)) * np.interp(tt(d), [0, .6, 2.4], [0, 1, 0]), 0.12)
for c in (24.0, 31.0, 56.0): add(c - 0.3, whoosh(), 0.14)
# raio-X: varredura, coluna, ramais com água correndo
d = 0.9; t = tt(d); add(31.0, np.sin(2 * np.pi * np.cumsum(np.linspace(300, 1800, len(t))) / SR) * np.sin(np.linspace(0, np.pi, len(t))), 0.04)
add(32.6, bell(523.3, 1.4), 0.12); add(37.0, bell(659.3, 1.4), 0.12)
d = 10; add(32.8, norm(band(rng.standard_normal(int(d * SR)), 300, 2500)) * np.interp(tt(d), [0, 1, 9, 10], [0, 1, 1, 0]), 0.025)
# caso: alerta + papel do recibo
for t0 in np.arange(43.4, 47.4, 0.5): add(t0, np.sin(2 * np.pi * 880 * tt(.08)) * dec(.08, 30), 0.05)
add(44.6, norm(band(rng.standard_normal(int(.4 * SR)), 1500, 7000)) * dec(.4, 10), 0.08)
# pegadinha e teste
add(48.8, bell(784, 0.8), 0.06)
for t0 in (52.6, 53.4, 54.2): add(t0, norm(band(rng.standard_normal(int(.05 * SR)), 900, 2500)) * dec(.05, 90), 0.25)
add(55.0, bell(880, 1.4) + 0.5 * bell(1318.5, 1.4), 0.14)
add(58.9, bell(523.3, 2) + bell(659.3, 2) + bell(784, 2), 0.08)

fade = np.ones(N); fn = int(1.5 * SR); fade[-fn:] = np.linspace(1, 0, fn)
L *= fade; R *= fade
pk = max(np.abs(L).max(), np.abs(R).max()); L, R = L / pk * 0.9, R / pk * 0.9
with wave.open("sfx_trilha.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.stack([L, R], 1) * 32767).astype(np.int16).tobytes())
print("ok")
