# usage: bash bang-chu.sh sNNN cx cy size angle_deg "LINE1" ["LINE2"]
# Draws gold Alegreya SC Bold text centred (capital-letter body, accents ignored) on the plaque face at (cx,cy),
# rotated by angle_deg (negative = rising to the right). Drawn at 4x then downscaled (crisp).
# Source: images/_goc-chua-chu/sNNN.jpg (copied from images/ on first run) -> images/sNNN.jpg
cd "$(dirname "$0")"; export PATH=/c/Users/huynh.ngoc.thach/Desktop/video-studio/tools/ffmpeg/bin:$PATH
id=$1 cx=$2 cy=$3 sz=$4 ang=$5; shift 5
mkdir -p images/_goc-chua-chu; [ -f images/_goc-chua-chu/$id.jpg ] || cp images/$id.jpg images/_goc-chua-chu/$id.jpg
F="C\:/Users/huynh.ngoc.thach/Desktop/video-studio/history/assets/fonts/AlegreyaSC-Bold.ttf"
S=4; C=$((sz*S*12)); n=$#; L=$(awk "BEGIN{print $sz*1.18*$S}")
dt=""; i=0
for t in "$@"; do
  off=$(awk "BEGIN{print ($i-($n-1)/2)*$L}")
  dt="$dt,drawtext=fontfile='$F':text='$t':fontsize=$((sz*S)):fontcolor=#F4CF5A:borderw=$((3*S)):bordercolor=#3A1A0A:shadowx=$((2*S)):shadowy=$((2*S)):shadowcolor=black@0.5:x=(w-text_w)/2:y=h/2+$off-ascent+0.325*$((sz*S))"
  i=$((i+1))
done
ffmpeg -v error -y -i images/_goc-chua-chu/$id.jpg -f lavfi -i "color=black@0:s=${C}x${C},format=rgba" -filter_complex \
 "[1]null${dt},rotate=$ang*PI/180:c=none,scale=iw/$S:ih/$S:flags=lanczos[t];[0][t]overlay=x=$cx-w/2:y=$cy-h/2:shortest=1" -frames:v 1 -q:v 2 images/$id.jpg
