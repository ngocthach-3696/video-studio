#!/bin/sh
# Bìa 1080x1920 kiểu Mưa đỏ: dòng phụ nhỏ, tiêu đề lớn màu kem viền nâu, dòng chữ đỏ. Không logo.
# usage: sh thumbnail/make-bia.sh   (chạy ở thư mục project, cần ffmpeg trong PATH)
F=../../assets/fonts/NotoSans-CondensedBold.ttf
BIG="TIẾNG SÚNG"; RED="ĐẦU TIÊN"
mk() { # $1 ảnh nguồn, $2 file ra, $3 dòng phụ (tùy chọn)
  SUB=${3:-ĐÀ NẴNG · 1858}
  ffmpeg -hide_banner -loglevel error -y -i "$1" -f lavfi -i "color=black:s=1080x1920,format=rgba" -filter_complex "
[0:v]scale=1080:-2,crop=1080:1920:0:(ih-1920)/2,format=rgba[bg];
[1:v]geq=r=0:g=0:b=0:a='170*max(0\,1-Y/1150)'[sh];
[bg][sh]overlay,
drawtext=fontfile=$F:text='$SUB':fontsize=72:fontcolor=0xF3E6C8:borderw=4:bordercolor=0x2A1A10:x=(w-tw)/2:y=330,
drawtext=fontfile=$F:text='$BIG':fontsize=180:fontcolor=0xFBF1DC:borderw=9:bordercolor=0x2A1A10:shadowcolor=black@0.6:shadowx=6:shadowy=8:x=(w-tw)/2:y=420,
drawtext=fontfile=$F:text='$RED':fontsize=170:fontcolor=0xD8312A:borderw=8:bordercolor=0xFBF1DC:shadowcolor=black@0.6:shadowx=6:shadowy=8:x=(w-tw)/2:y=640,
format=yuv420p" -frames:v 1 -q:v 2 "$2"
}
mk images/s018.jpg thumbnail/bia-A-chien-thuyen-na-phao.jpg
mk images/s014.jpg thumbnail/bia-B-dan-lang-nhin-doan-tau.jpg
mk images/s051.jpg thumbnail/bia-C-tau-hy-vong-chay.jpg "1858 – 1862"
# ảnh gen riêng cho bìa (thumbnail/t01..t03.jpg, prompt ở thumbnail/prompts.mjs)
mk thumbnail/t01.jpg thumbnail/bia-D-linh-nhin-chien-thuyen.jpg
mk thumbnail/t02.jpg thumbnail/bia-E-nguyen-tri-phuong.jpg
mk thumbnail/t03.jpg thumbnail/bia-F-me-con-tren-bai-bien.jpg
