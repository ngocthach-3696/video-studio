# Score a TTS clip: Whisper transcript vs. the text file (0..1, number words ignored).
# usage: python -I -X utf8 src/whisper-score.py clip.mp3 text.txt
import sys, subprocess, re, unicodedata, difflib, numpy as np
from faster_whisper import WhisperModel
mp3, txt = sys.argv[1], sys.argv[2]
raw = subprocess.run(["ffmpeg","-v","error","-i",mp3,"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
a = np.frombuffer(raw, np.int16).astype(np.float32)/32768
m = WhisperModel("small", device="cpu", compute_type="int8")
hyp = " ".join(s.text for s in m.transcribe(a, language="vi")[0])
n = lambda s: re.sub(r"[^\w]+"," ",unicodedata.normalize("NFC",s).lower()).split()
ref = n(open(txt,encoding="utf-8").read())
# numbers in whisper output -> compare letters only, digits ignored
NUM = {"một","hai","ba","bốn","tư","năm","sáu","bảy","tám","chín","mười","mươi","mốt","lăm","trăm","nghìn","linh"}
h = [w for w in n(hyp) if not w.isdigit() and w not in NUM]
r = [w for w in ref if w not in NUM]
print(round(difflib.SequenceMatcher(None, r, h).ratio(), 3))
