#!/bin/sh
# usage: el-collect.sh s002 s003 ...  -> moves Downloads/ElevenLabs_*.mp3 (sorted by name = time) to audio/<id>.mp3
cd /c/Users/Admin/Downloads || exit 1
set -- "$@"
n=$(ls ElevenLabs_*.mp3 2>/dev/null | wc -l)
if [ "$n" -ne "$#" ]; then echo "MISMATCH: $n files vs $# ids"; ls ElevenLabs_*.mp3; exit 1; fi
ls ElevenLabs_*.mp3 | sort | while IFS= read -r f; do id=$1; shift; mv "$f" "/c/video-studio/history/projects/mua-do-thanh-co-1972/audio/$id.mp3"; echo "$id <- $f"; done
