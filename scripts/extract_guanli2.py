import fitz, os, json, time

SRC = r"D:\baidudownload\管理"
OUT = r"C:\Users\ThinkPad\Downloads\safe-exam\.extract\guanli"
os.makedirs(OUT, exist_ok=True)

# 只提取尚未提取过、且对内容生产有用的资料
WANT = [
    "06.2026中级注安-安全管理-真题卷-20-25年.pdf",
    "08.2026中级注安-安全管理-新版电子版教材【高清搜索版】.pdf",
    "2026年注安【管理】2026年新版电子版教材【高清搜索版】.pdf",
    "09.2026中级注安-安全管理-习题集.pdf",
    "18.2026中级注安-安全管理-5星考题（54题）.pdf",
    "23.2026中级注安-安全管理-233-注安管理-母题700题（带答案）.pdf",
    "11.2026中级注安-安全管理-十年真题精解.pdf",
    "15.2026中级注安-安全管理-顺利精编习题集.pdf",
    "05.2026中级注安-安全管理-四色笔记.pdf",
    "12.2026中级注安-安全管理-教材新增考点总结.pdf",
    "03.2026中级注安-安全管理-教材变动.pdf",
    "04.2026中级注安-安全管理-2026新教材对比.pdf",
]

report = []
for f in WANT:
    p = os.path.join(SRC, f)
    if not os.path.exists(p):
        print(f"MISSING: {f}", flush=True)
        continue
    out = os.path.join(OUT, f.replace(".pdf", "").replace(" ", "_") + ".txt")
    if os.path.exists(out) and os.path.getsize(out) > 1000:
        print(f"SKIP (already): {f}", flush=True)
        continue
    try:
        t0 = time.time()
        doc = fitz.open(p)
        buf = []
        for i, page in enumerate(doc):
            t = page.get_text()
            if t.strip():
                buf.append(f"\n===== [P{i+1}] =====\n" + t)
        full = "".join(buf)
        open(out, "w", encoding="utf-8").write(full)
        report.append({"file": f, "pages": doc.page_count, "chars": len(full)})
        doc.close()
        print(f"OK {doc.page_count:>4}p {len(full):>9}chars {round(time.time()-t0,1):>6}s  {f}", flush=True)
    except Exception as e:
        print(f"FAIL {f}: {str(e)[:120]}", flush=True)

json.dump(report, open(os.path.join(OUT, "_index.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=2)
print("\nDONE. extracted:", len(report))
