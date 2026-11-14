#!/bin/sh
# usage: sh sheet.sh out.jpg img1 img2 ...  -> horizontal-wrapped contact sheet (5 per row, labelled)
out=$1; shift
args=""; f=""; n=0
for i in "$@"; do
  lbl=$(basename "$i" .jpg)
  args="$args -i $i"
  f="$f[$n:v]scale=300:534,drawtext=fontfile=/Windows/Fonts/arial.ttf:text=$lbl:x=6:y=6:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.6[v$n];"
  n=$((n+1))
done
cols=5; [ $n -lt 5 ] && cols=$n
rows=$(( (n + cols - 1) / cols ))
ins=""; i=0; while [ $i -lt $n ]; do ins="$ins[v$i]"; i=$((i+1)); done
layout=""; i=0; while [ $i -lt $n ]; do c=$((i % cols)); r=$((i / cols)); layout="$layout${layout:+|}$((c*300))_$((r*534))"; i=$((i+1)); done
ffmpeg -y -loglevel error $args -filter_complex "${f}${ins}xstack=inputs=$n:layout=$layout:fill=black" -frames:v 1 -q:v 4 "$out"
