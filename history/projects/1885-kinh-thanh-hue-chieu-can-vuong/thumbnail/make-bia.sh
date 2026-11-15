#!/bin/sh
# Bìa 1080x1920 (cùng kiểu bìa 1858/1867): dòng phụ nhỏ, tiêu đề lớn màu kem viền nâu, dòng chữ đỏ. Không logo.
# delogo xoá dấu ✦ của Gemini ở góc dưới phải (bìa không có logo che).
# Chữ nằm trong vùng an toàn khi Facebook cắt 4:5 / 1:1 (y 300–1500), tránh 20% dưới.
# usage: sh thumbnail/make-bia.sh   (chạy ở thư mục project, cần ffmpeg trong PATH)
F=../../assets/fonts/NotoSans-CondensedBold.ttf
# $1 ảnh nền, $2 file ra, $3 dòng phụ, $4 dòng lớn, $5 dòng đỏ, $6 cỡ dòng đỏ, $7 cỡ dòng lớn,
# $8 vị trí khối chữ: top (trên, nền tối dần từ trên) | low (dưới mặt nhân vật, nền tối dần từ dưới)
mk() {
  if [ "${8:-top}" = low ]; then Y=1070; SH="170*max(0\,(Y-850)/1070)"; else Y=300; SH="170*max(0\,1-Y/1150)"; fi
  ffmpeg -hide_banner -loglevel error -y -i "$1" -f lavfi -i "color=black:s=1080x1920,format=rgba" -filter_complex "
[0:v]scale=1080:-2,crop=1080:1920:0:(ih-1920)/2,delogo=x=890:y=1745:w=80:h=80,format=rgba[bg];
[1:v]geq=r=0:g=0:b=0:a='$SH'[sh];
[bg][sh]overlay,
drawtext=fontfile=$F:text='$3':fontsize=72:fontcolor=0xF3E6C8:borderw=4:bordercolor=0x2A1A10:x=(w-tw)/2:y=$Y,
drawtext=fontfile=$F:text='$4':fontsize=${7:-175}:fontcolor=0xFBF1DC:borderw=9:bordercolor=0x2A1A10:shadowcolor=black@0.6:shadowx=6:shadowy=8:x=(w-tw)/2:y=$((Y+90)),
drawtext=fontfile=$F:text='$5':fontsize=${6:-160}:fontcolor=0xD8312A:borderw=8:bordercolor=0xFBF1DC:shadowcolor=black@0.6:shadowx=6:shadowy=8:x=(w-tw)/2:y=$((Y+310)),
format=yuv420p" -frames:v 1 -q:v 2 "$2"
}
# vòng 1: 3 kiểu nền (cận mặt / tương phản kịch tính / vật biểu tượng), mỗi nền một bộ chữ
mk images/s006.jpg thumbnail/bia-A-can-mat-ham-nghi.jpg "HUẾ · 1885" "VUA 13 TUỔI" "BỎ NGAI VÀO RỪNG" 118 175 low
mk images/s007.jpg thumbnail/bia-B-to-giay-dai-bac.jpg "CHIẾU CẦN VƯƠNG · 1885" "TỜ GIẤY" "ĐẤU ĐẠI BÁC?" 150 190
mk images/s074.jpg thumbnail/bia-C-ngai-vang-chiec-ghe.jpg "VUA HÀM NGHI · 1885" "VÌ SAO VUA" "BỎ NGAI VÀNG?" 140 170
