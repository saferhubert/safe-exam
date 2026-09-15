import fitz, os, json, time

SRC = r"D:\baidudownload\化工"
OUT = r"C:\Users\ThinkPad\Downloads\safe-exam\.extract\huagong"
os.makedirs(OUT, exist_ok=True)

WANT = [
    "2026中级注安-化工安全-官方教材 2026新版本.pdf",
    "2026中级注安-化工安全-历年核心考点分值分布.pdf",
    "2026中级注安-化工安全-考情分析26年复习规划.pdf",
    "2026中级注安-化工安全-四色笔记.pdf",
    "2026中级注安-化工安全-顺利记忆口诀.pdf",
    "2026中级注安-化工安全-233 20-25年.pdf",
    "2026中级注安-化工安全-习题集.pdf",
    "2026中级注安-化工安全-教材变动.pdf",
    "2026中级注安-化工安全-233 2026新教材对比.pdf",
    "2026中级注安-化工安全-提分宝.pdf",
]

report = []
for f in WANT:
    p = os.path.join(SRC, f)
    if not os.path.exists(p):
        print(f"MISSING: {f}", flush=True); continue
    out = os.path.join(OUT, f.replace(".pdf", "").replace(" ", "_") + ".txt")
    if os.path.exists(out) and os.path.getsize(out) > 1000:
        print(f"SKIP: {f}", flush=True); continue
    try:
        t0 = time.time()
        doc = fitz.open(p)
        pages = doc.page_count
        buf = []
        for i, page in enumerate(doc):
            t = page.get_text()
            if t.strip():
                buf.append(f"\n===== [P{i+1}] =====\n" + t)
        full = "".join(buf)
        open(out, "w", encoding="utf-8").write(full)
        report.append({"file": f, "pages": pages, "chars": len(full)})
        doc.close()
        print(f"OK {pages:>4}p {len(full):>9}chars {round(time.time()-t0,1):>6}s  {f}", flush=True)
    except Exception as e:
        print(f"FAIL {f}: {str(e)[:100]}", flush=True)

json.dump(report, open(os.path.join(OUT, "_index.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=2)
print("\nDONE:", len(report))
