# usage: bash bang-chu.sh sNNN "TEXT" cx cy size  -> (cx,cy = centre of the plaque face; the CAPITAL-letter body is centred there, accents ignored) draws the sign text (Alegreya SC Bold, gold) on images/_goc-chua-chu/sNNN.jpg -> images/sNNN.jpg
cd "$(dirname "$0")"; export PATH=/c/video-studio/tools/ffmpeg/bin:$PATH
mkdir -p images/_goc-chua-chu; [ -f images/_goc-chua-chu/$1.jpg ] || cp images/$1.jpg images/_goc-chua-chu/$1.jpg
ffmpeg -v error -y -i images/_goc-chua-chu/$1.jpg -vf "drawtext=fontfile='C\:/video-studio/history/assets/fonts/AlegreyaSC-Bold.ttf':text='$2':fontsize=$5:fontcolor=#F4CF5A:borderw=3:bordercolor=#3A1A0A:shadowx=2:shadowy=2:shadowcolor=black@0.5:x=$3-text_w/2:y=$4-ascent+0.325*$5" -q:v 2 images/$1.jpg
