# Flow image batches, episode 1941.
#   bash lot.sh next [N]          -> todo.json = next N missing scene jobs (default 4), served on 127.0.0.1:8765
#   bash lot.sh collect s001 s002 -> newest K Downloads jpgs (oldest first) become images/<id>.jpg
#                                    (original kept in images/_goc-chua-giam/, saturation 0.85 = style rule)
#   bash lot.sh missing           -> list scene ids without an image
P=$(cd "$(dirname "$0")" && pwd)
SP="C:/Users/HUYNHN~1.THA/AppData/Local/Temp/claude/9f6c2c7ba441f149/cee3abc3-f58a-491a-a273-d14c5da04d22/scratchpad/up"
export PATH="/c/Users/huynh.ngoc.thach/Desktop/video-studio/tools/ffmpeg/bin:/c/Users/huynh.ngoc.thach/Desktop/video-studio/tools/node:$PATH"
mkdir -p $P/images/_goc-chua-giam
case "$1" in
  missing) node -e "const j=require('$(cygpath -m $P)/flow-jobs.json');const fs=require('fs');console.log(j.map(x=>x.id).filter(id=>!fs.existsSync('$(cygpath -m $P)/images/'+id+'.jpg')).join(' '))";;
  next) node -e "const j=require('$(cygpath -m $P)/flow-jobs.json');const fs=require('fs');const t=j.filter(x=>!fs.existsSync('$(cygpath -m $P)/images/'+x.id+'.jpg')).slice(0,${2:-4});fs.writeFileSync('$SP/todo.json',JSON.stringify(t));console.log(t.map(x=>x.id).join(' '))";;
  collect) shift; K=$#
    mapfile -t F < <(ls -t ~/Downloads/*.jpg ~/Downloads/*.png 2>/dev/null | head -$K | tac)
    [ ${#F[@]} -lt $K ] && { echo "CHỈ CÓ ${#F[@]} FILE cho $K ảnh, không gom (xem tên file rồi gom tay)"; exit 1; }
    for id in "$@"; do f="${F[0]}"; F=("${F[@]:1}")
      age=$(( $(date +%s) - $(stat -c %Y "$f") )); [ $age -gt 1800 ] && { echo "SKIP $id: $f cũ ${age}s"; continue; }
      mv "$f" $P/images/_goc-chua-giam/$id.jpg
      ffmpeg -v error -y -i $(cygpath -m $P/images/_goc-chua-giam/$id.jpg) -vf eq=saturation=0.85 -q:v 2 $(cygpath -m $P/images/$id.jpg)
      echo "OK $id <- $(basename "$f")"; done;;
esac
