#!/bin/bash
# usage: IDS="28 29" TAKE=1 bash tts-1lan.sh   (one vibi take per line, Whisper score; log in audio-v3/log2.txt)
# Lines that fail or score < 0.85 are listed in audio-v3/lai.txt so a second pass (TAKE=2) can retry only those.
export PATH="/c/Users/huynh.ngoc.thach/Desktop/video-studio/tools/node:/c/Users/huynh.ngoc.thach/Desktop/video-studio/tools/ffmpeg/bin:$PATH"
S=/c/Users/huynh.ngoc.thach/Desktop/video-studio/history/src
P=$(cd "$(dirname "$0")" && pwd)
k=${TAKE:-1}
cd /c/Users/huynh.ngoc.thach/Desktop/video-studio/history
: > $P/audio-v3/lai.txt
for i in $IDS; do i=$((10#$i));
  id=$(printf "s%03d" $i); sed -n "${i}p" $P/tts-ngat-nhip.txt > $P/audio-v3/txt/$id.txt
  if ! timeout 300 node src/vibi-tts.mjs $P/audio-v3/txt/$id.txt $P/audio-v3/$id-t$k.mp3 --model eleven_v3 --stability 0.5 > $P/audio-v3/err-$id.txt 2>&1; then
    echo "$id take$k LOI $(grep -m1 -o 'vibi [^:]*: .\{0,80\}' $P/audio-v3/err-$id.txt)" >> $P/audio-v3/log2.txt; echo $i >> $P/audio-v3/lai.txt; continue
  fi
  sc=$(python -I -X utf8 $S/whisper-score.py $P/audio-v3/$id-t$k.mp3 $P/audio-v3/txt/$id.txt)
  echo "$id take$k score $sc" >> $P/audio-v3/log2.txt
  awk "BEGIN{exit !($sc>=0.85)}" && cp $P/audio-v3/$id-t$k.mp3 $P/audio-v3/$id.mp3 || echo $i >> $P/audio-v3/lai.txt
done
echo "XONG luot $k" >> $P/audio-v3/log2.txt
