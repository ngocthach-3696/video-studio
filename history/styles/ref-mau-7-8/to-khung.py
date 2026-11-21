# Tờ khung hình + lời thoại cho một video mẫu.
#   python -I -X utf8 to-khung.py <video> <csv camera> <tiền tố ra> [doc|ngang] [--loi-thoai]
# - csv camera: styles/ref-camera/<mau>.csv (tạo bằng src/cam-motion.py)
# - Ra: <tiền tố>-to-01.jpg… (mỗi ô = khung giữa một cảnh, nhãn "số cảnh  phút p giây  (độ dài)", đúng thứ tự)
#        <tiền tố>-loi-thoai.txt nếu có --loi-thoai (faster-whisper small, CPU; video 40 phút mất ~40 phút).
# Chỉ chạy MỘT lượt mỗi lần (lần trước chạy trùng 3 lượt, các lượt ghi đè lên nhau).
import csv, os, shutil, subprocess, sys, tempfile
video, csvf, prefix = sys.argv[1:4]
doc = (sys.argv[4] if len(sys.argv) > 4 else "ngang") == "doc"
ff = os.path.join(os.path.dirname(__file__), "../../../tools/ffmpeg/bin/ffmpeg.exe")
font = "C\\:/Windows/Fonts/arial.ttf"
w, h, cols, per = (216, 384, 10, 40) if doc else (320, 180, 6, 48)
tmp = tempfile.mkdtemp()
rows = list(csv.DictReader(open(csvf)))
files = []
for i, r in enumerate(rows, 1):
    t, d = float(r["t"]), float(r["dur"])
    lab = f"{i}  {int(t//60)}p{t%60:04.1f}  ({d:.1f}s)"
    f = os.path.join(tmp, f"k{i:03d}.jpg"); files.append(f)
    subprocess.run([ff, "-v", "error", "-y", "-ss", f"{t+d/2:.2f}", "-i", video, "-frames:v", "1", "-vf",
                    f"scale={w}:{h},drawtext=fontfile='{font}':text='{lab}':x=4:y=4:fontsize=15:fontcolor=yellow:box=1:boxcolor=black@0.7",
                    f], check=True)
for s in range(0, len(files), per):
    part = files[s:s + per]
    args = [ff, "-v", "error", "-y"]
    for f in part: args += ["-i", f]
    lay = "|".join(f"{(j%cols)*w}_{(j//cols)*h}" for j in range(len(part)))
    args += ["-filter_complex", f"xstack=inputs={len(part)}:layout={lay}:fill=black", "-frames:v", "1", f"{prefix}-to-{s//per+1:02d}.jpg"]
    subprocess.run(args, check=True)
shutil.rmtree(tmp)
print("to khung:", len(files), "canh")
if "--loi-thoai" in sys.argv:
    import numpy as np
    from faster_whisper import WhisperModel
    raw = subprocess.run([ff, "-v", "error", "-i", video, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    m = WhisperModel("small", device="cpu", compute_type="int8")
    with open(f"{prefix}-loi-thoai.txt", "w", encoding="utf-8") as o:
        for seg in m.transcribe(a, language="vi")[0]:
            o.write(f"[{seg.start:6.1f}-{seg.end:6.1f}] {seg.text.strip()}\n")
    print("loi thoai xong")
