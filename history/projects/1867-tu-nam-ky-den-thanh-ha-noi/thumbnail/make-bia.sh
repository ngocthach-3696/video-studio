#!/bin/sh
# Bìa 1080x1920 (cùng kiểu bìa 1858): dòng phụ nhỏ, tiêu đề lớn màu kem viền nâu, dòng chữ đỏ. Không logo.
# usage: sh thumbnail/make-bia.sh   (chạy ở thư mục project, cần ffmpeg trong PATH)
F=../../assets/fonts/NotoSans-CondensedBold.ttf
mk() { # $1 ảnh nền, $2 file ra, $3 dòng phụ, $4 dòng lớn, $5 dòng đỏ, $6 cỡ chữ dòng đỏ
  ffmpeg -hide_banner -loglevel error -y -i "$1" -f lavfi -i "color=black:s=1080x1920,format=rgba" -filter_complex "
[0:v]scale=1080:-2,crop=1080:1920:0:(ih-1920)/2,format=rgba[bg];
[1:v]geq=r=0:g=0:b=0:a='170*max(0\,1-Y/1150)'[sh];
[bg][sh]overlay,
drawtext=fontfile=$F:text='$3':fontsize=72:fontcolor=0xF3E6C8:borderw=4:bordercolor=0x2A1A10:x=(w-tw)/2:y=300,
drawtext=fontfile=$F:text='$4':fontsize=${7:-175}:fontcolor=0xFBF1DC:borderw=9:bordercolor=0x2A1A10:shadowcolor=black@0.6:shadowx=6:shadowy=8:x=(w-tw)/2:y=390,
drawtext=fontfile=$F:text='$5':fontsize=${6:-160}:fontcolor=0xD8312A:borderw=8:bordercolor=0xFBF1DC:shadowcolor=black@0.6:shadowx=6:shadowy=8:x=(w-tw)/2:y=610,
format=yuv420p" -frames:v 1 -q:v 2 "$2"
}
mk thumbnail/t01.jpg thumbnail/bia-A-ba-vi-quan-ba-cai-chet.jpg "1867 – 1882" "BA CÁI CHẾT" "MỘT LỰA CHỌN" 138
mk thumbnail/t02.jpg thumbnail/bia-B-hoang-dieu-thanh-mat.jpg "HÀ NỘI · 1882" "THÀNH MẤT" "NGƯỜI KHÔNG HÀNG" 108
mk thumbnail/t01.jpg thumbnail/bia-C-ba-vi-quan-thanh-mat.jpg "1867 – 1882" "THÀNH MẤT" "NGƯỜI KHÔNG HÀNG" 108
# vòng 2 (người dùng muốn ảnh khác)
mk thumbnail/t04.jpg thumbnail/bia-D-phan-thanh-gian-chen-thuoc.jpg "1867 – 1882" "BA CÁI CHẾT" "MỘT LỰA CHỌN" 138
mk thumbnail/t05.jpg thumbnail/bia-E-nguyen-tri-phuong-khuoc-tu.jpg "1867 – 1882" "BA CÁI CHẾT" "MỘT LỰA CHỌN" 138
mk thumbnail/t06.jpg thumbnail/bia-F-vo-mieu-guom-khan.jpg "HÀ NỘI · 1882" "THÀNH MẤT" "NGƯỜI KHÔNG HÀNG" 108
# vòng 3: nền F, thử chữ khác
mk thumbnail/t06.jpg thumbnail/bia-F1-ba-cai-chet.jpg "1867 – 1882" "BA CÁI CHẾT" "MỘT LỰA CHỌN" 138
mk thumbnail/t06.jpg thumbnail/bia-F2-giu-khi-tiet.jpg "TỪ NAM KỲ ĐẾN HÀ NỘI" "MẤT THÀNH" "GIỮ KHÍ TIẾT" 150
mk thumbnail/t06.jpg thumbnail/bia-F3-ten-tap.jpg "NGƯỢC DÒNG TRĂM NĂM · TẬP 2" "TỪ NAM KỲ" "ĐẾN THÀNH HÀ NỘI" 112
# vòng 4: nền F, chủ đề gây tò mò hơn
mk thumbnail/t06.jpg thumbnail/bia-G1-vi-sao-chon-cai-chet.jpg "3 VỊ QUAN TRIỀU NGUYỄN" "VÌ SAO HỌ" "CHỌN CÁI CHẾT?" 128
mk thumbnail/t06.jpg thumbnail/bia-G2-tha-chet-khong-hang.jpg "3 VỊ QUAN TRIỀU NGUYỄN" "THÀ CHẾT" "KHÔNG ĐẦU HÀNG" 125
mk thumbnail/t06.jpg thumbnail/bia-G3-200-linh.jpg "HÀ NỘI · 1873" "200 LÍNH PHÁP" "HẠ THÀNH 7.000 QUÂN" 104 150
mk thumbnail/t06.jpg thumbnail/bia-G4-thanh-guom-de-lai.jpg "HOÀNG DIỆU · 1882" "THANH GƯƠM" "ĐỂ LẠI VÕ MIẾU" 135 160
