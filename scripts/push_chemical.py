# -*- coding: utf-8 -*-
"""通过 GitHub API 推送 chemical 文件（github.com 被墙，api.github.com 可达）"""
import json, os, sys, base64, urllib.request, urllib.error

BASE = r"C:\Users\ThinkPad\Downloads\safe-exam"
REPO = "saferhubert/safe-exam"
BRANCH = "main"

tok = os.environ.get("GH_TOKEN") or open(r"C:\Users\ThinkPad\Downloads\safe-exam\.ght_tmp").read().strip()

def api(path, method="GET", data=None):
    url = f"https://api.github.com/repos/{REPO}/{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method, headers={
        "Authorization": f"Bearer {tok}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "hermes",
        "Content-Type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)

FILES = [
 "src/content/chemical/chapter-01/page.mdx",
 "src/content/chemical/chapter-01/quiz.json",
 "src/content/chemical/chapter-02/page.mdx",
 "src/content/chemical/chapter-02/quiz.json",
 "src/content/chemical/chapter-03/page.mdx",
 "src/content/chemical/chapter-03/quiz.json",
 "src/content/chemical/chapter-04/page.mdx",
 "src/content/chemical/chapter-04/quiz.json",
 "src/content/chemical/chapter-05/page.mdx",
 "src/content/chemical/chapter-05/quiz.json",
 "src/content/chemical/chapter-06/page.mdx",
 "src/content/chemical/chapter-06/quiz.json",
 "src/content/chemical/chapter-07/page.mdx",
 "src/content/chemical/chapter-07/quiz.json",
 "src/content/chemical/chapters.json",
 "src/content/chemical/meta.json",
 "src/lib/constants.ts",
]

ok = fail = 0
for rel in FILES:
    local = os.path.join(BASE, rel.replace("/", os.sep))
    content = base64.b64encode(open(local, "rb").read()).decode()
    # get existing sha
    sha = None
    try:
        cur = api(f"contents/{rel}?ref={BRANCH}")
        sha = cur.get("sha")
    except urllib.error.HTTPError as e:
        if e.code != 404:
            print(f"  GET {rel}: HTTP {e.code}"); fail += 1; continue
    payload = {"message": f"feat(chemical): {rel}", "content": content, "branch": BRANCH}
    if sha:
        payload["sha"] = sha
    try:
        res = api(f"contents/{rel}", "PUT", payload)
        # 201 = created OK, 200 = updated OK
        code = res.get("commit") is not None
        print(f"  OK   {rel}  (sha {res['content']['sha'][:8]})")
        ok += 1
    except urllib.error.HTTPError as e:
        print(f"  FAIL {rel}: HTTP {e.code} {e.read()[:200]}")
        fail += 1
print(f"\nPUSHED {ok}/{len(FILES)}  failed={fail}")
