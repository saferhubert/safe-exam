import fitz, os, json, sys

SRC = r"D:\baidudownload\管理"
OUT = r"C:\Users\ThinkPad\Downloads\safe-exam\.extract"
os.makedirs(OUT, exist_ok=True)

files = sorted(os.listdir(SRC))
report = []
for f in files:
    if not f.lower().endswith(".pdf"):
        continue
    p = os.path.join(SRC, f)
    try:
        doc = fitz.open(p)
        text = []
        for i, page in enumerate(doc):
            t = page.get_text()
            if t.strip():
                text.append(f"\n===== [P{i+1}] =====\n" + t)
        full = "".join(text)
        safe = f.replace(".pdf", "").replace(" ", "_")
        op = os.path.join(OUT, safe + ".txt")
        with open(op, "w", encoding="utf-8") as fh:
            fh.write(full)
        report.append({
            "file": f,
            "pages": doc.page_count,
            "chars": len(full),
            "out": op,
        })
        doc.close()
    except Exception as e:
        report.append({"file": f, "error": str(e)[:200]})

with open(os.path.join(OUT, "_index.json"), "w", encoding="utf-8") as fh:
    json.dump(report, fh, ensure_ascii=False, indent=2)

for r in report:
    if "error" in r:
        print(f"FAIL {r['file']}: {r['error']}")
    else:
        print(f"OK   {r['pages']:>4}p {r['chars']:>8} chars  {r['file']}")
