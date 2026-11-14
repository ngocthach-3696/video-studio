# usage: bash lot.sh next s013,s014,...   -> build flow-run.js for those ids and stamp .lot-since
#        bash lot.sh collect "<run log>"  -> move Downloads since .lot-since into images/ for the ids marked ok, in order
#        bash lot.sh missing              -> comma list of scenes without an image
cd "$(dirname "$0")"
case "$1" in
next) node flow-gen.mjs 0 0 "$2" && date "+%Y-%m-%d %H:%M:%S" > .lot-since ;;
missing) for i in $(seq -w 1 83); do [ -f images/s0$i.jpg ] || printf "s0%s," $i; done; echo ;;
collect)
  ids=($(echo "$2" | grep -o "s0[0-9][0-9] ok" | cut -d' ' -f1))
  mapfile -t f < <(find /c/Users/Admin/Downloads -maxdepth 1 -newermt "$(cat .lot-since)" -type f \( -name "*.jpg" -o -name "*.png" \) -printf "%T@ %p\n" | sort -n | cut -d' ' -f2-)
  [ ${#f[@]} -ne ${#ids[@]} ] && echo "CẢNH BÁO: ${#f[@]} file vs ${#ids[@]} ok"
  n=${#f[@]}; [ $n -gt ${#ids[@]} ] && n=${#ids[@]}
  for ((i=0;i<n;i++)); do mv "${f[$i]}" "images/${ids[$i]}.jpg"; echo "${ids[$i]} <- $(basename "${f[$i]}")"; done
  # same file downloaded twice = wrong image
  for ((i=1;i<n;i++)); do cmp -s "images/${ids[$i]}.jpg" "images/${ids[$((i-1))]}.jpg" && { echo "TRÙNG ${ids[$i]} -> xóa"; rm "images/${ids[$i]}.jpg"; }; done ;;
esac
