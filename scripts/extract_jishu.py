import fitz, os, json, time

SRC = r"D:\baidudownload\技术"
OUT = r"C:\Users\ThinkPad\Downloads\safe-exam\.extract\jishu"
os.makedirs(OUT, exist_ok=True)

# 优先提取：教材、考情、分值分布、考点精粹、口诀、易错、真题卷、习题集
WANT = [
    "08.2026中级注安-技术基础-2026年新版电子版教材【高清搜索版】.pdf",
    "2026年注安【技术】2026年新版电子版教材【高清搜索版】.pdf",
    "03.2026中级注安-技术基础-历年核心考点分值分布.pdf",
    "04.2026中级注安-技术基础-考情分析26年复习规划.pdf",
    "25.2026中级注安-技术基础-考点精粹手册.pdf",
    "25.2026中级注安-技术基础-速记口诀.pdf",
    "24.2026中级注安-技术基础-易错易混知识点.pdf",
    "01.2026中级注安-技术基础-真题卷-20-25年.pdf",
    "12.2026中级注安-技术基础-母题700题（带答案）.pdf",
    "21.2026中级注安-技术基础-233母题400题（答案版）.pdf",
    "20.2026中级注安-技术基础-5星考题（192题）.pdf",
    "18.2026中级注安-技术基础-68个高频考点总结（李天宇亲编）.pdf",
    "14.2026中级注安-技术基础-四色笔记2.0（新教材）.pdf",
    "06.2026中级注安-技术基础-233四色笔记.pdf",
    "16.2026中级注安-技术基础-顺利记忆口诀.pdf",
    "09.2026中级注安-技术基础-习题集.pdf",
]

report = []
for f in WANT:
    p = os.path.join(SRC, f)
    if not os.path.exists(p):
        print(f"MISSING: {f}", flush=True)
        continue
    out = os.path.join(OUT, f.replace(".pdf", "").replace(" ", "_") + ".txt")
    if os.path.exists(out) and os.path.getsize(out) > 1000:
        print(f"SKIP: {f}", flush=True)
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
        print(f"FAIL {f}: {str(e)[:100]}", flush=True)

json.dump(report, open(os.path.join(OUT, "_index.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=2)
print("\nDONE:", len(report))
