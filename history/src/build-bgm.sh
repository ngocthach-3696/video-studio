#!/bin/bash
# Fit the default background track to a video length.
# usage: bash src/build-bgm.sh <video_seconds> <out.wav> [track.mp3]
#  - track shorter than the video: play from 0, crossfade (3 s) into a second copy whose ending lands on the video end
#  - track longer: start late so its ending lands on the video end
# Output is loudness-normalised to -20 LUFS; use "musicStart": 0, "musicVolume": 0.7 (≈14-15 dB under the voice, measure).
export PATH="/c/video-studio/tools/ffmpeg/bin:$PATH"
T=$1; OUT=$2; F=${3:-$(dirname "$0")/../assets/music/historical-documentary.mp3}; X=3
L=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F")
if awk "BEGIN{exit !($L>=$T)}"; then
  ffmpeg -v error -ss $(awk "BEGIN{print $L-$T}") -i "$F" -af "afade=t=in:d=2,loudnorm=I=-20" -ar 44100 -y "$OUT"
else
  C=$(awk "BEGIN{print $T-$L}")
  ffmpeg -v error -i "$F" -i "$F" -filter_complex "[0:a]atrim=0:$(awk "BEGIN{print $C+$X}"),asetpts=N/SR/TB,afade=t=in:d=1,afade=t=out:st=$C:d=$X[a];[1:a]afade=t=in:d=$X,adelay=$(awk "BEGIN{print int($C*1000)}"):all=1[b];[a][b]amix=inputs=2:normalize=0,atrim=0:$T,loudnorm=I=-20[o]" -map "[o]" -ar 44100 -y "$OUT"
fi
echo "$OUT $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s"
