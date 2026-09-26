#!/usr/bin/env python3
"""Publish the exported fragment to the standalone page; no dependencies."""
from pathlib import Path

folder = Path(__file__).resolve().parent
page = folder / "index.html"
html = page.read_text(encoding="utf-8")
start = html.index('<main id="main-content">') + len('<main id="main-content">')
end = html.index('</main>', start)
fragment = (folder / "test.html").read_text(encoding="utf-8").strip()
page.write_text(html[:start] + '\n' + fragment + '\n' + html[end:], encoding="utf-8")
print("Updated index.html from test.html")
