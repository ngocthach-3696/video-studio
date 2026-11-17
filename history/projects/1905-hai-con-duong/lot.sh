# usage: bash lot.sh next s013,s014,...   -> build flow-run.js for those ids (scenes or character keys) and stamp .lot-since
#        bash lot.sh collect "<run log>"  -> move Downloads since .lot-since into images/ or characters/ for the ids marked ok, in order
#        bash lot.sh missing              -> comma list of scenes without an image
cd "$(dirname "$0")"
dest() { [[ $1 =~ ^s[0-9]{3}$ ]] && echo images/$1.jpg || echo characters/$1.jpg; }
case "$1" in
next) node flow-gen.mjs 0 0 "$2" && date "+%Y-%m-%d %H:%M:%S" > .lot-since ;;
missing) for i in $(seq -w 1 83); do [ -f images/s0$i.jpg ] || printf "s0%s," $i; done; echo ;;
collect)
  mkdir -p images characters
  ids=($(echo "$2" | grep -oE "[a-z0-9-]+ ok" | cut -d' ' -f1))
  mapfile -t f < <(find $HOME/Downloads -maxdepth 1 -newermt "$(cat .lot-since)" -type f \( -name "*.jpg" -o -name "*.png" \) -printf "%T@ %p\n" | sort -n | cut -d' ' -f2-)
  [ ${#f[@]} -ne ${#ids[@]} ] && echo "CẢNH BÁO: ${#f[@]} file vs ${#ids[@]} ok"
  n=${#f[@]}; [ $n -gt ${#ids[@]} ] && n=${#ids[@]}
  for ((i=0;i<n;i++)); do d=$(dest ${ids[$i]}); mv "${f[$i]}" "$d"; echo "${ids[$i]} <- $(basename "${f[$i]}")"; done
  # same file downloaded twice = wrong image
  for ((i=1;i<n;i++)); do a=$(dest ${ids[$i]}); b=$(dest ${ids[$((i-1))]}); cmp -s "$a" "$b" && { echo "TRÙNG ${ids[$i]} -> xóa"; rm "$a"; }; done ;;
esac
