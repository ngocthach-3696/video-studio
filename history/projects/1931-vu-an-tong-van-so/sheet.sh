# usage: bash sheet.sh <out.jpg> id1 id2 ...  (row of thumbnails with id labels)
P=$(cd "$(dirname "$0")" && pwd); export PATH="/c/Users/huynh.ngoc.thach/Desktop/video-studio/tools/ffmpeg/bin:$PATH"
out=$1; shift; args=(); f=""; i=0
for id in "$@"; do args+=(-i $(cygpath -m $P/images/$id.jpg)); f+="[$i]scale=240:-2,drawtext=fontfile=f.ttf:text=$id:x=8:y=8:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.6[v$i];"; i=$((i+1)); done
cols=$(( i<6 ? i : 6 )); rows=$(( (i+cols-1)/cols )); lay=""; for ((k=0;k<i;k++)); do lay+="$([ $k -gt 0 ] && echo '|')$(( (k%cols)*240 ))_$(( (k/cols)*430 ))"; done
for ((k=0;k<i;k++)); do f+="[v$k]"; done
cd $P/sheets && ffmpeg -v error -y "${args[@]}" -filter_complex "${f}xstack=inputs=$i:layout=$lay:fill=black" -q:v 3 $(cygpath -m $P/$out)
