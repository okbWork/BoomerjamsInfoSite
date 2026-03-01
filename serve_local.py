#!/usr/bin/env python3
"""Run a local static server from the repository root regardless of caller CWD."""

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
import sys

PORT = 4173

if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        print(f"Invalid port: {sys.argv[1]!r}. Using default {PORT}.")

repo_root = Path(__file__).resolve().parent
os.chdir(repo_root)

class Handler(SimpleHTTPRequestHandler):
    # Keep logs visible for local debugging.
    pass

server = ThreadingHTTPServer(("", PORT), Handler)
print(f"Serving BoomerjamsInfoSite from: {repo_root}")
print(f"Open: http://localhost:{PORT}/index.html")
print("Press Ctrl+C to stop.")

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
finally:
    server.server_close()
