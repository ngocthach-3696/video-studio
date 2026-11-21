#!/bin/bash
# Phân tích video mẫu: đo camera (6 mẫu), khung hình từng cảnh + lời thoại (mẫu 5, 6). Chạy: bash styles/ref-mau-5-6/phan-tich.sh
export PATH="/c/Users/huynh.ngoc.thach/Desktop/video-studio/tools/ffmpeg/bin:$PATH"
cd /c/Users/huynh.ngoc.thach/Desktop/video-studio/history; D="$USERPROFILE/Downloads"; O=styles/ref-mau-5-6; C=styles/ref-camera
declare -A V=( [mauA]="Facebook.mp4" [mauB]="Facebook (1).mp4" [mau3]="Video mau 3.mp4" [mau4]="Video mau 4.mp4" [mau5]="Facebook (2).mp4" [mau6]="1 Facebook.mp4" )
for k in mau5 mau6 mau4 mauA mau3 mauB; do python -I -X utf8 src/cam-motion.py "$D/${V[$k]}" $C/$k.csv; done
for k in mau5 mau6; do
  f="$D/${V[$k]}"; mkdir -p $O/$k
  # 1 frame at the middle of each shot, labelled "shot time"
  tail -n +2 $C/$k.csv | while IFS=, read sh t dur rest; do
    m=$(awk "BEGIN{print $t+$dur/2}"); ffmpeg -v error -y -ss $m -i "$f" -frames:v 1 -vf "scale=216:-1,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='$sh  $t':x=4:y=4:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.7" $O/$k/f$(printf %03d $sh).jpg
  done
  ls $O/$k/f*.jpg | split -l 40 - $O/$k/list-
  i=1; for L in $O/$k/list-*; do ffmpeg -v error -y $(sed 's/^/-i /' $L | tr '\n' ' ') -filter_complex "$(n=$(wc -l < $L); for j in $(seq 0 $((n-1))); do echo -n "[$j]"; done; echo -n "xstack=inputs=$n:layout=$(python -I -c "print('|'.join(f'{(j%10)*216}_{(j//10)*384}' for j in range($(wc -l < $L))))"):fill=black")" -frames:v 1 $O/$k-sheet-$(printf %02d $i).jpg; i=$((i+1)); done
  rm -rf $O/$k/list-*
  python -I -X utf8 - "$f" $O/$k-loi-thoai.txt <<'PY'
import sys, subprocess, numpy as np
from faster_whisper import WhisperModel
raw = subprocess.run(["ffmpeg","-v","error","-i",sys.argv[1],"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
a = np.frombuffer(raw, np.int16).astype(np.float32)/32768
m = WhisperModel("small", device="cpu", compute_type="int8")
with open(sys.argv[2],"w",encoding="utf-8") as o:
    for s in m.transcribe(a, language="vi")[0]: o.write(f"[{s.start:6.1f}-{s.end:6.1f}] {s.text.strip()}\n")
PY
done
echo XONG
