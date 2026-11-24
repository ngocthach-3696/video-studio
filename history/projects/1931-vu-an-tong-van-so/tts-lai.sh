#!/bin/bash
# usage: IDS="1 2 3" bash tts-lai.sh  (re-read only these line numbers of tts-ngat-nhip.txt; log in audio-v3/log2.txt)
# generate all lines with eleven_v3, check each with Whisper, retry lines that score badly (max 2 retries)
export PATH="/c/Users/huynh.ngoc.thach/Desktop/video-studio/tools/node:/c/Users/huynh.ngoc.thach/Desktop/video-studio/tools/ffmpeg/bin:$PATH"
S=/c/Users/huynh.ngoc.thach/Desktop/video-studio/history/src
P=$(cd "$(dirname "$0")" && pwd)
cd /c/Users/huynh.ngoc.thach/Desktop/video-studio/history
for i in $IDS; do i=$((10#$i));
  id=$(printf "s%03d" $i); sed -n "${i}p" $P/tts-ngat-nhip.txt > $P/audio-v3/txt/$id.txt
  best=""; bestsc=-1
  for k in 1 2 3; do
    node src/vibi-tts.mjs $P/audio-v3/txt/$id.txt $P/audio-v3/$id-t$k.mp3 --model eleven_v3 --stability 0.5 > /dev/null 2>&1 || continue
    sc=$(python -I -X utf8 $S/whisper-score.py $P/audio-v3/$id-t$k.mp3 $P/audio-v3/txt/$id.txt)
    if awk "BEGIN{exit !($sc>$bestsc)}"; then best=$k; bestsc=$sc; fi
    awk "BEGIN{exit !($sc>=0.85)}" && break
  done
  cp $P/audio-v3/$id-t$best.mp3 $P/audio-v3/$id.mp3
  echo "$id take$best score $bestsc" >> $P/audio-v3/log2.txt
done
echo XONG >> $P/audio-v3/log2.txt
