#!/bin/bash
# usage: bash tts-sua.sh s047 s048 ...  (re-read the given lines of tts-ngat-nhip.txt with eleven_v3; 3 takes each,
# pick best Whisper score among takes that end with >=0.15 s silence; old clip kept in audio-v3/_cu/)
export PATH="/c/Users/huynh.ngoc.thach/Desktop/video-studio/tools/node:/c/Users/huynh.ngoc.thach/Desktop/video-studio/tools/ffmpeg/bin:$PATH"
S=/c/Users/huynh.ngoc.thach/Desktop/video-studio/history/src
P=$(cd "$(dirname "$0")" && pwd)
cd /c/Users/huynh.ngoc.thach/Desktop/video-studio/history
mkdir -p $P/audio-v3/_cu $P/audio-v3/txt
for id in "$@"; do
  i=$((10#${id#s})); sed -n "${i}p" $P/tts-ngat-nhip.txt > $P/audio-v3/txt/$id.txt
  [ -f $P/audio-v3/_cu/$id-cu.mp3 ] || cp $P/audio/$id.mp3 $P/audio-v3/_cu/$id-cu.mp3
  best=""; bestsc=-1
  for k in 1 2 3; do
    f=$P/audio-v3/$id-n$k.mp3
    node src/vibi-tts.mjs $P/audio-v3/txt/$id.txt $f --model eleven_v3 --stability 0.5 > /dev/null 2>&1 || { echo "$id take$k LOI" >> $P/audio-v3/log-sua.txt; continue; }
    sc=$(python -I -X utf8 $S/whisper-score.py $f $P/audio-v3/txt/$id.txt)
    d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $f)
    ls=$(ffmpeg -hide_banner -i $f -af silencedetect=n=-40dB:d=0.15 -f null - 2>&1 | grep -o "silence_start: [0-9.]*" | tail -1 | awk '{print $2}')
    tail=$(awk "BEGIN{t=$d-${ls:-$d}; print (t>=0.15 && $d-${ls:-0}<$d)?t:0}")
    echo "$id take$k score $sc dur $d tail $tail" >> $P/audio-v3/log-sua.txt
    ok=$(awk "BEGIN{print ($tail>=0.15)}")
    eff=$(awk "BEGIN{print $sc - ($ok?0:0.5)}")
    if awk "BEGIN{exit !($eff>$bestsc)}"; then best=$k; bestsc=$eff; fi
    awk "BEGIN{exit !($sc>=0.95 && $ok)}" && break
  done
  [ -n "$best" ] && cp $P/audio-v3/$id-n$best.mp3 $P/audio-v3/$id.mp3 && cp $P/audio-v3/$id-n$best.mp3 $P/audio/$id.mp3
  echo "$id CHON take$best diem $bestsc" >> $P/audio-v3/log-sua.txt
done
echo XONG >> $P/audio-v3/log-sua.txt
