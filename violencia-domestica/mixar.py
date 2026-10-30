"""Encaixa a voz da Maiane (falas/fala-XX.wav) nos tempos de CUES e abaixa a trilha sob a voz.
Uso: python3 mixar.py  →  gera mix_final.wav (se faltar alguma fala, o espaço fica em silêncio e avisa)."""
import numpy as np, wave, os, re, subprocess

SR = 48000
CUES = [(float(a), float(b)) for a, b in re.findall(r"\[(\d+\.?\d*), (\d+\.?\d*), \"", open("cenas.js").read())]


def read(path):
    with wave.open(path) as w:
        ch, sr, n = w.getnchannels(), w.getframerate(), w.getnframes()
        x = np.frombuffer(w.readframes(n), np.int16).astype(np.float32) / 32768
    x = x.reshape(-1, ch).mean(1)
    if sr != SR:  # reamostra
        x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
    return x


with wave.open("sfx_trilha.wav") as w:
    st = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32).reshape(-1, 2) / 32768
voice = np.zeros(len(st))
for i, (a, b) in enumerate(CUES, 1):
    p = f"falas/fala-{i:02d}.wav"
    if not os.path.exists(p):
        print(f"FALTA {p} — fica em silêncio"); continue
    v = read(p); v /= np.max(np.abs(v)) + 1e-9
    if len(v) / SR > (b - a) + 0.4:
        print(f"ATENÇÃO {p}: {len(v)/SR:.2f}s, espaço de {b - a:.2f}s — ajustar a cena")
    s = int(a * SR); voice[s:s + len(v)] += v[: len(voice) - s]
# ducking: trilha cai ~8 dB onde há voz (envelope suavizado)
envv = np.convolve(np.abs(voice), np.ones(4800) / 4800, "same")
duck = 1 - 0.6 * np.clip(envv / (envv.max() + 1e-9) * 6, 0, 1)
mix = st * 0.55 * duck[:, None] + voice[:, None] * 0.85
mix /= np.max(np.abs(mix)) / 0.95
with wave.open("mix_final.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("mix_final.wav ok")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "video_sem_legenda.mp4", "-i", "mix_final.wav",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
                "reel-violencia-FINAL.mp4"], check=True)
print("reel-violencia-FINAL.mp4 ok")
