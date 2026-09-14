import fitz, os, json, sys, time

SRC = r"D:\baidudownload\法规"
OUT = r"C:\Users\ThinkPad\Downloads\safe-exam\.extract\fagui"
os.makedirs(OUT, exist_ok=True)

# 优先提取"文字密度高、体积小"的资料（大体积教材扫描件耗时极长，单列出来）
files = sorted(os.listdir(SRC))
report = []

for f in files:
    if not f.lower().endswith(".pdf"):
        continue
    p = os.path.join(SRC, f)
    size_mb = os.path.getsize(p) / 1024 / 1024
    try:
        t0 = time.time()
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
            "file": f, "sizeMB": round(size_mb, 1),
            "pages": doc.page_count, "chars": len(full),
            "secs": round(time.time() - t0, 1),
        })
        doc.close()
        print(f"OK  {size_mb:>7.1f}MB {doc.page_count:>4}p {len(full):>9}chars {round(time.time()-t0,1):>6}s  {f}", flush=True)
    except Exception as e:
        report.append({"file": f, "error": str(e)[:200]})
        print(f"FAIL {f}: {str(e)[:120]}", flush=True)

with open(os.path.join(OUT, "_index.json"), "w", encoding="utf-8") as fh:
    json.dump(report, fh, ensure_ascii=False, indent=2)

print("\n=== SUMMARY ===")
ok = [r for r in report if "error" not in r]
print(f"extracted: {len(ok)}/{len(report)} | total chars: {sum(r['chars'] for r in ok)}")
