"""Junta a narração contínua (narracao-completa.wav ou .mp4) ao vídeo, abaixando a trilha sob a voz.
Uso: python3 mixar.py [arquivo_da_narracao] [inicio_em_segundos=2.0]  →  reel-vazamento-FINAL.mp4"""
import numpy as np, wave, sys, subprocess

SR = 48000
src = sys.argv[1] if len(sys.argv) > 1 else "narracao-completa.wav"
start = float(sys.argv[2]) if len(sys.argv) > 2 else 2.0
# ffmpeg converte qualquer formato (wav, mp3, m4a, mp4 de celular) para mono 48 kHz
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
voice = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
voice /= np.max(np.abs(voice)) + 1e-9
with wave.open("sfx_trilha.wav") as w:
    bed = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32).reshape(-1, 2) / 32768
v = np.zeros(len(bed)); s = int(start * SR); n = min(len(voice), len(v) - s); v[s:s + n] = voice[:n]
if len(voice) > n:
    print(f"ATENÇÃO: a narração tem {len(voice)/SR:.1f}s e passa do vídeo ({len(bed)/SR:.1f}s) — os tempos das cenas precisam ser ajustados")
envv = np.convolve(np.abs(v), np.ones(4800) / 4800, "same")
duck = 1 - 0.65 * np.clip(envv / (envv.max() + 1e-9) * 6, 0, 1)
mix = bed * 0.5 * duck[:, None] + v[:, None] * 0.9
mix /= np.max(np.abs(mix)) / 0.95
with wave.open("mix_final.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "video_sem_audio.mp4", "-i", "mix_final.wav", "-c:v", "copy",
                "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", "reel-vazamento-FINAL.mp4"], check=True)
print("reel-vazamento-FINAL.mp4 ok")
