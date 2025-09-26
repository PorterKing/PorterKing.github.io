#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

# 切换到项目目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 3000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

try:
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🌹 波&雪的专属纪念网页已启动！")
        print(f"📱 请在浏览器中访问: http://localhost:{PORT}")
        print(f"💕 发现了 {len([f for f in os.listdir('assets/images') if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.heic'))])} 张珍贵的回忆照片")
        print(f"🎵 发现了 {len([f for f in os.listdir('assets/music') if f.lower().endswith(('.mp3', '.wav', '.ogg', '.m4a'))])} 首浪漫音乐")
        print("按 Ctrl+C 停止服务器")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n👋 服务器已停止")
except Exception as e:
    print(f"❌ 启动失败: {e}")
    print("💡 你也可以直接用浏览器打开 index.html 文件")