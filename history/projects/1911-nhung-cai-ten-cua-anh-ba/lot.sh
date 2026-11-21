# bash lot.sh next s001,s002   -> queue ids for .playwright-mcp/batch.js, stamp time
# bash lot.sh collect "<log>"  -> Downloads since stamp -> images/_goc-chua-giam/sNNN.jpg + images/sNNN.jpg (saturation 0.85)
# bash lot.sh missing          -> scenes without image
SP="C:/Users/HUYNHN~1.THA/AppData/Local/Temp/claude/9f6c2c7ba441f149/5070fe5e-1a25-4d09-9638-da2ff1572d7b/scratchpad"
cd "$(dirname "$0")"; export PATH="c:/Users/huynh.ngoc.thach/Desktop/video-studio/tools/ffmpeg/bin:$PATH"
case $1 in
next) cp flow-jobs.json "$SP/up/" && echo "$2" > "$SP/up/ids.txt" && date "+%Y-%m-%d %H:%M:%S" > .lot-since && echo "queued $2";;
missing) node -e 'const fs=require("fs");console.log(require("./flow-jobs.json").map(j=>j.id).filter(i=>!fs.existsSync("images/"+i+".jpg")).join(","))';;
collect)
  mkdir -p images/_goc-chua-giam
  ids=($(echo "$2" | grep -oE "s[0-9]{3}[a-z]? ok" | cut -d' ' -f1))
  mapfile -t f < <(find $HOME/Downloads -maxdepth 1 -newermt "$(cat .lot-since)" -type f -name "*.jpg" -printf "%T@ %p\n" | sort -n | cut -d' ' -f2-)
  [ ${#f[@]} -ne ${#ids[@]} ] && echo "CẢNH BÁO: ${#f[@]} file vs ${#ids[@]} ok"
  n=${#f[@]}; [ $n -gt ${#ids[@]} ] && n=${#ids[@]}
  for ((i=0;i<n;i++)); do id=${ids[$i]}; mv "${f[$i]}" images/_goc-chua-giam/$id.jpg; ffmpeg -v error -y -i images/_goc-chua-giam/$id.jpg -vf "eq=saturation=0.85" -q:v 2 images/$id.jpg; echo "$id <- $(basename "${f[$i]}")"; done
  for ((i=1;i<n;i++)); do cmp -s images/_goc-chua-giam/${ids[$i]}.jpg images/_goc-chua-giam/${ids[$((i-1))]}.jpg && echo "TRÙNG ${ids[$i]}"; done; true;;
esac
