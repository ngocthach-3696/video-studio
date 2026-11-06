"""
YT Audio - tải âm thanh YouTube thành MP3 (Windows 10/11)

Dùng yt-dlp (thư viện Python) + FFmpeg. Giao diện tkinter có sẵn trong Python.
Chỉ dùng cho nội dung bạn có quyền tải xuống (video của bạn, Creative Commons,
nội dung được tác giả cho phép...).

Chạy:  python yt_audio_gui.py
"""

import importlib
import os
import queue
import shutil
import subprocess
import sys
import threading
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

# D:\YouTube nếu máy có ổ D:, không thì C:\Users\<bạn>\Music\YouTube
DEFAULT_OUT_DIR = r"D:\YouTube" if os.path.isdir("D:\\") else os.path.join(os.path.expanduser("~"), "Music", "YouTube")

# Các thư mục hay chứa FFmpeg trên Windows (ngoài PATH).
FFMPEG_CANDIDATES = [
    r"C:\ffmpeg\bin",
    r"C:\Program Files\ffmpeg\bin",
    r"C:\Program Files (x86)\ffmpeg\bin",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "ffmpeg", "bin"),
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "tools", "ffmpeg", "bin"),
]


# --------------------------------------------------------------------------- #
# Kiểm tra công cụ
# --------------------------------------------------------------------------- #
def find_ffmpeg():
    """Trả về thư mục chứa ffmpeg.exe + ffprobe.exe, hoặc None."""
    exe = shutil.which("ffmpeg")
    if exe and shutil.which("ffprobe"):
        return os.path.dirname(exe)
    for d in FFMPEG_CANDIDATES:
        d = os.path.normpath(d)
        if os.path.isfile(os.path.join(d, "ffmpeg.exe")) and os.path.isfile(os.path.join(d, "ffprobe.exe")):
            return d
    return None


def load_ytdlp():
    """Import yt_dlp; trả về module hoặc None nếu chưa cài."""
    try:
        importlib.invalidate_caches()
        return importlib.import_module("yt_dlp")
    except ImportError:
        return None


def is_youtube_url(s):
    s = s.lower()
    return s.startswith(("http://", "https://")) and ("youtube.com/" in s or "youtu.be/" in s)


# --------------------------------------------------------------------------- #
# Logger chuyển thông báo của yt-dlp về giao diện
# --------------------------------------------------------------------------- #
class QueueLogger:
    def __init__(self, q):
        self.q = q

    def debug(self, msg):
        pass  # quá nhiều chi tiết, bỏ qua

    def info(self, msg):
        pass

    def warning(self, msg):
        self.q.put(("log", "⚠ " + msg))

    def error(self, msg):
        self.q.put(("log", "✖ " + msg))


# --------------------------------------------------------------------------- #
# Giao diện
# --------------------------------------------------------------------------- #
class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("YT Audio – tải MP3")
        self.geometry("720x620")
        self.minsize(600, 540)
        self.q = queue.Queue()
        self.worker = None
        self.yt_dlp = load_ytdlp()
        self.ffmpeg_dir = find_ffmpeg()

        self._style()
        self._build()
        self._refresh_tool_status()
        self.after(100, self._poll_queue)

    # ---- giao diện ------------------------------------------------------- #
    def _style(self):
        s = ttk.Style(self)
        if "vista" in s.theme_names():
            s.theme_use("vista")
        s.configure("Title.TLabel", font=("Segoe UI Semibold", 16))
        s.configure("Sub.TLabel", font=("Segoe UI", 9), foreground="#666")
        s.configure("Ok.TLabel", font=("Segoe UI", 9), foreground="#1a7f37")
        s.configure("Bad.TLabel", font=("Segoe UI", 9), foreground="#c62828")
        s.configure("Big.TButton", font=("Segoe UI Semibold", 11), padding=(18, 8))

    def _build(self):
        root = ttk.Frame(self, padding=16)
        root.pack(fill="both", expand=True)

        ttk.Label(root, text="Tải âm thanh YouTube → MP3", style="Title.TLabel").pack(anchor="w")
        ttk.Label(root, text="Dán một hoặc nhiều link, mỗi link một dòng.", style="Sub.TLabel").pack(anchor="w", pady=(0, 8))

        # Ô nhập link
        box = ttk.Frame(root)
        box.pack(fill="both", expand=True)
        self.links = tk.Text(box, height=8, font=("Consolas", 10), wrap="none", undo=True)
        sb = ttk.Scrollbar(box, command=self.links.yview)
        self.links.configure(yscrollcommand=sb.set)
        self.links.pack(side="left", fill="both", expand=True)
        sb.pack(side="right", fill="y")

        # Thư mục lưu
        row = ttk.Frame(root)
        row.pack(fill="x", pady=(10, 0))
        ttk.Label(row, text="Lưu vào:").pack(side="left")
        self.out_var = tk.StringVar(value=DEFAULT_OUT_DIR)
        ttk.Entry(row, textvariable=self.out_var).pack(side="left", fill="x", expand=True, padx=6)
        ttk.Button(row, text="Đổi…", command=self._pick_dir).pack(side="left")
        ttk.Button(row, text="Mở thư mục", command=self._open_dir).pack(side="left", padx=(6, 0))

        # Trạng thái công cụ
        tools = ttk.Frame(root)
        tools.pack(fill="x", pady=(10, 0))
        self.ytdlp_lbl = ttk.Label(tools)
        self.ytdlp_lbl.pack(side="left")
        self.install_btn = ttk.Button(tools, text="Cài / cập nhật yt-dlp", command=self._install_ytdlp)
        self.install_btn.pack(side="left", padx=8)
        self.ffmpeg_lbl = ttk.Label(tools)
        self.ffmpeg_lbl.pack(side="left", padx=(12, 0))

        # Xác nhận quyền
        self.rights_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(
            root,
            text="Tôi xác nhận mình có quyền tải các nội dung này (video của tôi, Creative Commons, được tác giả cho phép…)",
            variable=self.rights_var,
        ).pack(anchor="w", pady=(10, 0))

        # Nút tải
        self.dl_btn = ttk.Button(root, text="⬇  Download", style="Big.TButton", command=self._start)
        self.dl_btn.pack(pady=(12, 8))

        # Tiến trình
        self.cur_lbl = ttk.Label(root, text="Sẵn sàng.", style="Sub.TLabel")
        self.cur_lbl.pack(anchor="w")
        self.cur_bar = ttk.Progressbar(root, mode="determinate", maximum=100)
        self.cur_bar.pack(fill="x", pady=(2, 6))
        self.all_lbl = ttk.Label(root, text="Tổng: 0/0", style="Sub.TLabel")
        self.all_lbl.pack(anchor="w")
        self.all_bar = ttk.Progressbar(root, mode="determinate", maximum=1)
        self.all_bar.pack(fill="x", pady=(2, 8))

        # Nhật ký
        self.log = tk.Text(root, height=8, font=("Consolas", 9), state="disabled", bg="#fafafa")
        self.log.pack(fill="both", expand=True)

    def _refresh_tool_status(self):
        if self.yt_dlp:
            ver = getattr(getattr(self.yt_dlp, "version", None), "__version__", "?")
            self.ytdlp_lbl.configure(text=f"✔ yt-dlp {ver}", style="Ok.TLabel")
        else:
            self.ytdlp_lbl.configure(text="✖ Chưa có yt-dlp", style="Bad.TLabel")
        if self.ffmpeg_dir:
            self.ffmpeg_lbl.configure(text="✔ FFmpeg", style="Ok.TLabel")
        else:
            self.ffmpeg_lbl.configure(text="✖ Chưa có FFmpeg (xem README)", style="Bad.TLabel")

    def _write_log(self, text):
        self.log.configure(state="normal")
        self.log.insert("end", text + "\n")
        self.log.see("end")
        self.log.configure(state="disabled")

    def _pick_dir(self):
        d = filedialog.askdirectory(initialdir=self.out_var.get() or "C:\\")
        if d:
            self.out_var.set(os.path.normpath(d))

    def _open_dir(self):
        d = self.out_var.get()
        if os.path.isdir(d):
            os.startfile(d)
        else:
            messagebox.showinfo("Thư mục", f"Thư mục chưa tồn tại:\n{d}")

    # ---- cài yt-dlp ------------------------------------------------------ #
    def _install_ytdlp(self):
        if self.worker and self.worker.is_alive():
            return
        self.install_btn.configure(state="disabled")
        self._write_log("Đang cài/cập nhật yt-dlp bằng pip…")

        def run():
            try:
                r = subprocess.run(
                    [sys.executable, "-m", "pip", "install", "-U", "yt-dlp"],
                    capture_output=True, text=True,
                    creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                )
                self.q.put(("pip", r.returncode, (r.stdout + r.stderr)[-600:]))
            except Exception as e:  # noqa: BLE001
                self.q.put(("pip", 1, str(e)))

        self.worker = threading.Thread(target=run, daemon=True)
        self.worker.start()

    # ---- tải ------------------------------------------------------------- #
    def _start(self):
        if self.worker and self.worker.is_alive():
            return
        self.yt_dlp = self.yt_dlp or load_ytdlp()
        self.ffmpeg_dir = self.ffmpeg_dir or find_ffmpeg()
        self._refresh_tool_status()
        if not self.yt_dlp:
            messagebox.showerror("Thiếu yt-dlp", "Chưa cài yt-dlp.\nBấm “Cài / cập nhật yt-dlp” hoặc chạy:\n\npip install -U yt-dlp")
            return
        if not self.ffmpeg_dir:
            messagebox.showerror("Thiếu FFmpeg", "Không tìm thấy ffmpeg.exe và ffprobe.exe.\nCài FFmpeg và thêm thư mục bin vào PATH (xem README).")
            return
        if not self.rights_var.get():
            messagebox.showwarning("Xác nhận quyền", "Hãy tick ô xác nhận bạn có quyền tải các nội dung này.")
            return

        lines = [l.strip() for l in self.links.get("1.0", "end").splitlines() if l.strip()]
        urls, bad = [], []
        for l in lines:
            (urls if is_youtube_url(l) else bad).append(l)
        urls = list(dict.fromkeys(urls))  # bỏ trùng, giữ thứ tự
        for b in bad:
            self._write_log(f"Bỏ qua (không phải link YouTube): {b}")
        if not urls:
            messagebox.showwarning("Chưa có link", "Hãy dán ít nhất một link YouTube hợp lệ.")
            return

        out_dir = self.out_var.get().strip() or DEFAULT_OUT_DIR
        drive = os.path.splitdrive(out_dir)[0]
        if drive and not os.path.isdir(drive + "\\"):
            messagebox.showerror("Lỗi thư mục", f"Máy không có ổ {drive}\nBấm “Đổi…” để chọn thư mục khác.")
            return
        try:
            os.makedirs(out_dir, exist_ok=True)
        except OSError as e:
            messagebox.showerror("Lỗi thư mục", f"Không tạo được thư mục:\n{out_dir}\n\n{e}")
            return

        self.dl_btn.configure(state="disabled")
        self.all_bar.configure(maximum=len(urls), value=0)
        self.all_lbl.configure(text=f"Tổng: 0/{len(urls)}")
        self.worker = threading.Thread(target=self._download_all, args=(urls, out_dir), daemon=True)
        self.worker.start()

    def _download_all(self, urls, out_dir):
        yt_dlp = self.yt_dlp
        ok, failed = [], []

        def hook(d):
            st = d.get("status")
            if st == "downloading":
                total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
                done = d.get("downloaded_bytes") or 0
                pct = done * 100 / total if total else 0
                speed = d.get("_speed_str", "").strip()
                self.q.put(("progress", pct, f"Đang tải… {pct:5.1f}%  {speed}"))
            elif st == "finished":
                self.q.put(("progress", 100, "Đang chuyển sang MP3…"))

        def pp_hook(d):
            if d.get("status") == "started" and d.get("postprocessor") == "ExtractAudio":
                self.q.put(("progress", 100, "Đang chuyển sang MP3 320kbps…"))

        opts = {
            "format": "bestaudio/best",
            "outtmpl": os.path.join(out_dir, "%(title)s.%(ext)s"),
            "windowsfilenames": True,      # bỏ ký tự Windows không cho phép trong tên file
            "noplaylist": True,            # link có &list=... chỉ tải đúng video đó
            "ffmpeg_location": self.ffmpeg_dir,
            "postprocessors": [
                {"key": "FFmpegExtractAudio", "preferredcodec": "mp3", "preferredquality": "320"},
                {"key": "FFmpegMetadata", "add_metadata": True},
            ],
            "progress_hooks": [hook],
            "postprocessor_hooks": [pp_hook],
            "logger": QueueLogger(self.q),
            "quiet": True,
            "no_warnings": False,
            "noprogress": True,
            "retries": 3,
            "fragment_retries": 3,
        }

        for i, url in enumerate(urls, 1):
            self.q.put(("item", i, len(urls), url))
            try:
                with yt_dlp.YoutubeDL(opts) as ydl:
                    info = ydl.extract_info(url, download=True)
                title = (info or {}).get("title", url)
                ok.append(title)
                self.q.put(("log", f"✔ Xong: {title}.mp3"))
            except yt_dlp.utils.DownloadError as e:
                failed.append(url)
                self.q.put(("log", f"✖ Không tải được: {url}\n   {self._short(e)}"))
            except Exception as e:  # noqa: BLE001
                failed.append(url)
                self.q.put(("log", f"✖ Lỗi không xác định: {url}\n   {self._short(e)}"))
            self.q.put(("overall", i, len(urls)))

        self.q.put(("done", ok, failed, out_dir))

    @staticmethod
    def _short(e):
        s = str(e).replace("\x1b[0;31m", "").replace("\x1b[0m", "")
        return s if len(s) < 300 else s[:300] + "…"

    # ---- nhận thông điệp từ luồng nền ------------------------------------ #
    def _poll_queue(self):
        try:
            while True:
                msg = self.q.get_nowait()
                kind = msg[0]
                if kind == "progress":
                    self.cur_bar.configure(value=msg[1])
                    self.cur_lbl.configure(text=msg[2])
                elif kind == "item":
                    _, i, n, url = msg
                    self.cur_bar.configure(value=0)
                    self.cur_lbl.configure(text=f"[{i}/{n}] Đang lấy thông tin…")
                    self._write_log(f"[{i}/{n}] {url}")
                elif kind == "overall":
                    _, i, n = msg
                    self.all_bar.configure(value=i)
                    self.all_lbl.configure(text=f"Tổng: {i}/{n}")
                elif kind == "log":
                    self._write_log(msg[1])
                elif kind == "pip":
                    _, code, out = msg
                    self.install_btn.configure(state="normal")
                    if code == 0:
                        self.yt_dlp = load_ytdlp()
                        self._write_log("✔ Đã cài/cập nhật yt-dlp.")
                    else:
                        self._write_log("✖ Cài yt-dlp thất bại:\n" + out)
                    self._refresh_tool_status()
                elif kind == "done":
                    _, ok, failed, out_dir = msg
                    self.dl_btn.configure(state="normal")
                    self.cur_lbl.configure(text="Hoàn tất.")
                    text = f"Tải xong {len(ok)} file MP3 vào:\n{out_dir}"
                    if failed:
                        text += f"\n\nKhông tải được {len(failed)} link (xem nhật ký)."
                        messagebox.showwarning("Hoàn tất (có lỗi)", text)
                    else:
                        messagebox.showinfo("Hoàn tất", text)
        except queue.Empty:
            pass
        self.after(100, self._poll_queue)


if __name__ == "__main__":
    App().mainloop()
