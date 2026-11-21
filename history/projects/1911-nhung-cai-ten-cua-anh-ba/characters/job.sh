# bash job.sh prep <id>   -> write job.json for <id>, stamp time
# bash job.sh collect <id> -> move newest Flow download to characters/_v1/<id>.jpg
SP="C:/Users/HUYNHN~1.THA/AppData/Local/Temp/claude/9f6c2c7ba441f149/5070fe5e-1a25-4d09-9638-da2ff1572d7b/scratchpad"
cd "$(dirname "$0")"; export PATH="c:/Users/huynh.ngoc.thach/Desktop/video-studio/tools/node:$PATH"
case $1 in
prep) node make-jobs.mjs $2 "$SP/up/job.json" && date "+%Y-%m-%d %H:%M:%S" > ../.lot-since && echo "prep $2";;
collect) f=$(find ~/Downloads -maxdepth 1 -newermt "$(cat ../.lot-since)" -type f -name "*.jpg" | head -1); [ -n "$f" ] && mv "$f" _v1/$2.jpg && echo "got _v1/$2.jpg" || echo "NO FILE";;
esac
