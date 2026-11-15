import http.server, sys, os
os.chdir(sys.argv[1])
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*'); super().end_headers()
http.server.ThreadingHTTPServer(('127.0.0.1', 8765), H).serve_forever()
