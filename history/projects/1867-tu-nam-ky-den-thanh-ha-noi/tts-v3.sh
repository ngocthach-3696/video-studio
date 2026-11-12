#!/bin/bash
# usage: bash tts-v3.sh  (reads tts-ngat-nhip.txt, writes audio-v3/sNNN.mp3 + log.txt; then copy audio-v3/s???.mp3 to audio/)
# generate all 75 lines with eleven_v3, check each with Whisper, retry lines that score badly (max 2 retries)
export PATH="/c/video-studio/tools/node:/c/video-studio/tools/ffmpeg/bin:$PATH"
S=/c/video-studio/history/src
P=$(cd "$(dirname "$0")" && pwd)
cd /c/video-studio/history
N=$(grep -c . "$P/tts-ngat-nhip.txt"); for i in $(seq 1 $N); do
  id=$(printf "s%03d" $i); sed -n "${i}p" $P/tts-ngat-nhip.txt > $P/audio-v3/txt/$id.txt
  best=""; bestsc=-1
  for k in 1 2 3; do
    node src/vibi-tts.mjs $P/audio-v3/txt/$id.txt $P/audio-v3/$id-t$k.mp3 --model eleven_v3 --stability 0.5 > /dev/null 2>&1 || continue
    sc=$(python -I -X utf8 $S/whisper-score.py $P/audio-v3/$id-t$k.mp3 $P/audio-v3/txt/$id.txt)
    if awk "BEGIN{exit !($sc>$bestsc)}"; then best=$k; bestsc=$sc; fi
    awk "BEGIN{exit !($sc>=0.85)}" && break
  done
  cp $P/audio-v3/$id-t$best.mp3 $P/audio-v3/$id.mp3
  echo "$id take$best score $bestsc" >> $P/audio-v3/log.txt
done
echo XONG >> $P/audio-v3/log.txt
