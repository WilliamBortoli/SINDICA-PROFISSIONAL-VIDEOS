"""Trilha alegre + efeitos do reel "Boa convivência" (sem narração). Gera sfx_trilha.wav (48 kHz, estéreo)."""
import numpy as np, wave

SR, DUR = 48000, 42.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(3)
tt = lambda d: np.arange(int(SR * d)) / SR
SC = [5.5, 11.5, 17.5, 23.5, 29.5, 35.5]


def add(t0, sig, gain=1.0, pan=0.0):
    i = int(t0 * SR); n = min(len(sig), N - i)
    if n <= 0 or i < 0: return
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i:i + n] += sig[:n] * gain * l * 1.414; R[i:i + n] += sig[:n] * gain * r * 1.414


def band(x, lo, hi):
    f = np.fft.rfftfreq(len(x), 1 / SR); X = np.fft.rfft(x)
    return np.fft.irfft(X / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4), len(x))


def norm(x): return x / (np.max(np.abs(x)) + 1e-9)
dec = lambda d, k: np.exp(-tt(d) * k)


def pluck(f, d=0.9):  # Karplus-Strong (violão/ukulele)
    n, p = int(d * SR), max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = 0.996 * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out


def bell(f0, d=1.2):
    t = tt(d); return norm(sum(np.sin(2 * np.pi * f0 * k * t) * np.exp(-t * (3 + 2 * k)) / k for k in (1, 2, 3.01, 4.2)))


# ---------- música: C – G – Am – F, 100 bpm ----------
BEAT = 0.6
CH = [[261.6, 329.6, 392.0], [196.0, 246.9, 293.7], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6]]
BASS = [65.4, 49.0, 55.0, 43.7]
t = 0.0; bar = 0
while t < DUR - 0.5:
    ch, bs = CH[bar % 4], BASS[bar % 4]
    pattern = [0, 1, 2, 1, 0, 1, 2, 1]
    for i, k in enumerate(pattern):                       # dedilhado em colcheias
        add(t + i * BEAT / 2, pluck(ch[k] * (2 if i % 4 == 2 else 1), 0.8), 0.16, -0.2 + 0.4 * (i % 2))
    b = np.sin(2 * np.pi * bs * 2 * tt(BEAT * 2)) * dec(BEAT * 2, 2.5)
    add(t, b, 0.22); add(t + BEAT * 2, b, 0.18)
    for i in range(8):                                    # chocalho
        s = band(rng.standard_normal(int(.06 * SR)), 5000, 12000) * dec(.06, 70)
        add(t + i * BEAT / 2 + 0.01, norm(s), 0.035 if i % 2 else 0.05, 0.4)
    t += BEAT * 4; bar += 1
# melodia de glockenspiel (entra depois da abertura)
MEL = [784, 659, 784, 880, 784, 659, 587, 659, 523, 587, 659, 784, 698, 659, 587, 523]
for i, t0 in enumerate(np.arange(5.5, 35.5, BEAT * 2)):
    add(t0, bell(MEL[i % len(MEL)], 1.0), 0.07, 0.3 * np.sin(i))

# ---------- ambiente ----------
for t0 in np.arange(0.3, DUR - 1, 1.1):                  # pássaros
    t = tt(0.12); f = 3200 + 1400 * np.sin(np.linspace(0, np.pi, len(t)))
    ch = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.linspace(0, np.pi, len(t)))
    for k in range(rng.integers(1, 4)):
        add(t0 + k * 0.14 + rng.uniform(0, .4), ch, 0.03, rng.uniform(-.9, .9))
add(0, norm(band(rng.standard_normal(N), 100, 900)), 0.012)  # brisa

# ---------- efeitos ----------
def whoosh(d=0.6):
    n = int(d * SR); return norm(band(rng.standard_normal(n), 400, 4000) * np.sin(np.linspace(0, np.pi, n)) ** 2)
for c in SC: add(c - 0.3, whoosh(), 0.16)
def step(): return norm(band(rng.standard_normal(int(.07 * SR)), 150, 1200)) * dec(.07, 60)
def chime(): s = bell(1046.5, 0.9) + 0.6 * np.concatenate([np.zeros(int(.09 * SR)), bell(1568, 0.81)]); return norm(s)
# 1 · lixeira
for t0 in np.arange(5.7, 8.1, 0.43): add(t0, step(), 0.12, -0.4)
add(8.1, norm(band(rng.standard_normal(int(.25 * SR)), 80, 900)) * dec(.25, 18), 0.18)   # tampa abre
add(8.95, np.sin(2 * np.pi * 70 * tt(.3)) * dec(.3, 14), 0.3)                              # saco cai
add(9.3, norm(band(rng.standard_normal(int(.2 * SR)), 100, 1200)) * dec(.2, 25), 0.2)      # tampa fecha
add(9.5, chime(), 0.2)
# 2 · pet
for t0 in np.arange(11.6, 14.4, 0.21): add(t0, step() * 0.6, 0.06, 0.3)
add(15.0, norm(band(rng.standard_normal(int(.25 * SR)), 1500, 6000)) * dec(.25, 12), 0.05)  # sacolinha
add(15.6, chime(), 0.2)
# 3 · devagar
d = 3.4; t = tt(d); hum = band(rng.standard_normal(len(t)), 50, 300) + 0.5 * np.sin(2 * np.pi * 42 * t)
add(17.6, norm(hum) * np.interp(t, [0, 1, 2.6, 3.4], [0, 1, .6, 0]), 0.14, -0.3)
add(20.1, np.sin(2 * np.pi * 1900 * tt(.3)) * np.sin(np.linspace(0, np.pi, int(.3 * SR))), 0.02)  # freio suave
for t0 in np.arange(17.5, 23.4, np.pi / 4.2): add(t0, np.sin(2 * np.pi * 160 * tt(.12)) * dec(.12, 35), 0.12, 0.5)  # bola
add(21.1, chime(), 0.2)
# 4 · lazer
for k in range(4): add(23.5 + k * 1.818, norm(band(rng.standard_normal(int(.08 * SR)), 300, 2500)) * dec(.08, 50), 0.18, 0.4)  # toque na bola
for t0 in np.arange(23.5, 29.4, np.pi / 2.6):
    t = tt(.35); add(t0, np.sin(2 * np.pi * (520 + 80 * np.sin(t * 9)) * t) * np.sin(np.linspace(0, np.pi, len(t))), 0.012, -0.5)  # rangido do balanço
add(27.3, chime(), 0.2)
# 5 · gentileza
add(30.4, np.sin(2 * np.pi * 1760 * tt(.12)) * dec(.12, 20), 0.08, 0.3)                    # bip do facial
add(30.45, norm(band(rng.standard_normal(int(.6 * SR)), 200, 2000)) * np.sin(np.linspace(0, np.pi, int(.6 * SR))), 0.06)  # porta
for t0 in np.arange(29.7, 33.1, 0.43): add(t0, step(), 0.1, -0.3)
for k in range(5): add(32.5 + k * 0.25, bell(1318 + k * 110, 0.5), 0.03, -0.4 + 0.2 * k)  # corações
add(33.7, chime(), 0.2)
# final
for t0 in np.arange(35.6, 37.4, 0.28): add(t0, step(), 0.08)
add(39.6, bell(523.3, 2.5) + bell(659.3, 2.5) + bell(784, 2.5), 0.12)

fade = np.ones(N); fn = int(1.5 * SR); fade[-fn:] = np.linspace(1, 0, fn); fade[:int(.3 * SR)] = np.linspace(0, 1, int(.3 * SR))
L *= fade; R *= fade
pk = max(np.abs(L).max(), np.abs(R).max()); L, R = L / pk * 0.9, R / pk * 0.9
with wave.open("sfx_trilha.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.stack([L, R], 1) * 32767).astype(np.int16).tobytes())
print("ok")
