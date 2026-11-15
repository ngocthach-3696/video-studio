# usage: collect.sh <id-done> <next-id>
SP="${SP:?set SP to the folder served by cors_srv.py}"
P="${P:?set P to the project folder}"
f=$(ls -t "$USERPROFILE/Downloads"/*.mp4 | head -1)
age=$(( $(date +%s) - $(stat -c %Y "$f") ))
if [ $age -gt 300 ]; then echo "KHONG THAY FILE MOI ($f, $age s)"; exit 1; fi
mv "$f" "$P/videos/v2/$1-veo.mp4" && echo "$1 <- $(basename "$f")"
[ -n "$2" ] && echo -n "$2" > "$SP/up/id.txt" && echo "next $2"
