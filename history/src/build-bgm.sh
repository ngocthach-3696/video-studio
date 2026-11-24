#!/bin/bash
# Fit the default background track to a video length.
# usage: bash src/build-bgm.sh <video_seconds> <out.wav> [track.mp3]
#  - track shorter than the video: play from 0, crossfade (3 s) into a second copy whose ending lands on the video end
#  - track longer: start late so its ending lands on the video end
# Output is loudness-normalised to -20 LUFS; use "musicStart": 0, "musicVolume": 0.7 (≈14-15 dB under the voice, measure).
export PATH="$(cd "$(dirname "$0")/../.." && pwd)/tools/ffmpeg/bin:$PATH"
T=$1; OUT=$2; F=${3:-$(dirname "$0")/../assets/music/historical-documentary.mp3}; X=3
L=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F")
if awk "BEGIN{exit !($L>=$T)}"; then
  ffmpeg -v error -ss $(awk "BEGIN{print $L-$T}") -i "$F" -af "afade=t=in:d=2,loudnorm=I=-20" -ar 44100 -y "$OUT"
elif awk "BEGIN{exit !($T>2*$L-$X)}"; then
  # video longer than two copies (episode 1905, 435.8 s on a 204 s track): the old 2-copy mix left a
  # ~28 s hole with no music. Use 3 copies: full copy from 0, a middle part (taken from 30 s into the
  # track, skipping the intro) and a last copy whose ending lands on the video end, 3 s crossfades.
  M=$(awk "BEGIN{print $T-2*$L+2*$X}")
  if awk "BEGIN{exit !($M>$L-30)}"; then
    # short track (e.g. 111 s on a 390 s video): chain N full copies with 3 s crossfades,
    # keep the last T seconds so the track's ending lands on the video end, fade in at the start.
    N=$(awk "BEGIN{n=int(($T-$X)/($L-$X)); if(n*($L-$X)+$X<$T) n++; print n}")
    IN=""; FC=""; prev="0:a"
    for i in $(seq 0 $((N-1))); do IN="$IN -i $F"; done
    for i in $(seq 1 $((N-1))); do FC="$FC[$prev][$i:a]acrossfade=d=$X:c1=tri:c2=tri[x$i];"; prev="x$i"; done
    TOT=$(awk "BEGIN{print $N*$L-($N-1)*$X}")
    ffmpeg -v error $IN -filter_complex "${FC}[$prev]atrim=start=$(awk "BEGIN{print $TOT-$T}"),asetpts=N/SR/TB,afade=t=in:d=2,loudnorm=I=-20[o]" -map "[o]" -ar 44100 -y "$OUT"
    echo "$OUT $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s ($N copies)"; exit 0
  fi
  ffmpeg -v error -i "$F" -i "$F" -i "$F" -filter_complex "[0:a]afade=t=in:d=1,afade=t=out:st=$(awk "BEGIN{print $L-$X}"):d=$X[a];[1:a]atrim=30:$(awk "BEGIN{print 30+$M}"),asetpts=N/SR/TB,afade=t=in:d=$X,afade=t=out:st=$(awk "BEGIN{print $M-$X}"):d=$X,adelay=$(awk "BEGIN{print int(($L-$X)*1000)}"):all=1[b];[2:a]afade=t=in:d=$X,adelay=$(awk "BEGIN{print int(($T-$L)*1000)}"):all=1[c];[a][b][c]amix=inputs=3:normalize=0,atrim=0:$T,loudnorm=I=-20[o]" -map "[o]" -ar 44100 -y "$OUT"
else
  C=$(awk "BEGIN{print $T-$L}")
  ffmpeg -v error -i "$F" -i "$F" -filter_complex "[0:a]atrim=0:$(awk "BEGIN{print $C+$X}"),asetpts=N/SR/TB,afade=t=in:d=1,afade=t=out:st=$C:d=$X[a];[1:a]afade=t=in:d=$X,adelay=$(awk "BEGIN{print int($C*1000)}"):all=1[b];[a][b]amix=inputs=2:normalize=0,atrim=0:$T,loudnorm=I=-20[o]" -map "[o]" -ar 44100 -y "$OUT"
fi
echo "$OUT $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s"
