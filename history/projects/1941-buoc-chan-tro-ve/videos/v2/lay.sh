# usage: bash lay.sh sNNN  -> copies the newest Flow mp4 in Downloads to videos/v2/sNNN-omni.mp4 (refuses duplicates)
cd "$(dirname "$0")"; f=$(ls -t ~/Downloads/*.mp4 | head -1)
for o in *.mp4; do cmp -s "$f" "$o" && { echo "TRUNG voi $o"; exit 1; }; done
cp "$f" "$1-omni.mp4" && echo "$1 <- $(basename "$f")"
