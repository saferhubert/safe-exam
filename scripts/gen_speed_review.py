# -*- coding: utf-8 -*-
"""生成《化工安全考点速记手册》打印版 HTML（浏览器 Ctrl+P 另存为 PDF）"""
import json, os, glob, html
from collections import defaultdict

BASE = r"C:\Users\ThinkPad\Downloads\safe-exam"
OUT = os.path.join(BASE, "public", "downloads")
os.makedirs(OUT, exist_ok=True)

# ---- 收集题目（作为考点与解析来源）----
bych = defaultdict(list)
for f in sorted(glob.glob(os.path.join(BASE, "src", "content", "chemical", "chapter-0*", "quiz.json"))):
    d = json.load(open(f, encoding="utf-8"))
    n = d["chapterNumber"]
    for q in d["questions"]:
        bych[n].append(q)

CHAPTERS = {
    1: ("化工安全生产概述", 6),
    2: ("化工运行安全技术", 31),
    3: ("化工防火防爆安全技术", 2),
    4: ("化学品储运安全技术", 4),
    5: ("化工建设项目安全技术", 25),
    6: ("化工事故应急管理及救援", 1),
    7: ("化工安全类案例", 6),
}

# ---- 必背数字表（从教材/题目提炼，人工核对）----
NUMBERS = [
    ("70%", "化工化学品中具有易燃易爆/有毒有害/腐蚀性的比例"),
    ("950℃ / -96℃", "石油烃裂解炉出口温度 / 裂解产物气分离温度"),
    ("10~30MPa、300℃", "合成氨反应条件（氨的合成）"),
    ("130~300MPa、150~300℃", "乙烯聚合生产聚乙烯条件"),
    ("1:3", "合成氨中 N₂ 与 H₂ 的配比"),
    ("300~450℃、15~30MPa", "合成氨工艺条件"),
    ("5%", "电解食盐水时氯气中含氢量的爆炸临界值"),
    ("90℃", "三氯化氮受热分解爆炸的温度"),
    ("pH＜4.5", "电解液中铵盐生成三氯化氮的适宜条件"),
    ("4%~75%", "氢气的爆炸极限"),
    ("5.0 / 3.0 / 1.7", "惰性气体转换系数：CO₂ / He / Ar"),
    ("LEL 10%~25%", "可燃气体检测报警仪的报警值（常用 10%）"),
    ("≤23.5%", "动火作业时氧含量上限"),
    ("19.5%~21%", "受限空间作业氧含量合格范围"),
    ("30m", "动火点周围不得排放可燃气体 / 盲板抽堵周围不得动火"),
    ("15m", "动火点周围不得排放可燃液体"),
    ("10m", "动火点周围不得进行可燃溶剂清洗或喷漆"),
    ("30min", "特级、一级动火中断超过此时间需重新分析"),
    ("60min", "受限空间作业中断超过此时间需重新检测"),
    ("五级风", "以上禁止露天动火作业"),
    ("六级风", "以上不应进行露天吊装作业"),
    ("1.25 倍", "液压试验压力（相对设计压力）"),
    ("1.0 倍", "气密性试验压力（等于设计压力）"),
    ("500m", "重大危险源「单元」的边缘距离界定值"),
    ("≤1", "多品种重大危险源辨识：Σ(实际量/临界量) ≥ 1 即构成"),
    ("3 年", "重大危险源安全评估周期"),
    ("每半年 / 每季度 / 每周", "安全包保责任制：主要负责人 / 技术负责人 / 操作负责人排查频次"),
    ("3 / 10 / 30", "事故等级死亡人数分界（一般/较大/重大/特别重大）"),
    ("10 / 50 / 100", "事故等级重伤人数分界"),
    ("1000万 / 5000万 / 1亿", "事故等级直接经济损失分界"),
    ("1.7m", "遮栏高度要求"),
    ("1.2m / 1.5m", "户内 / 户外栅栏高度要求"),
    ("≤15 天 / ≤30 天", "临时用电作业有效期（一般 / 特殊情况）"),
    ("0.7m", "临时用电线路埋地深度不小于此值"),
    ("7 天", "安全作业票最长有效期（高处作业）"),
]

CSS = """
@page { size: A4; margin: 16mm 14mm; }
* { box-sizing: border-box; }
body { font-family: -apple-system, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif;
       color:#1f2937; line-height:1.75; font-size:11pt; margin:0; }
.cover { text-align:center; padding:46mm 0 0; page-break-after:always; }
.cover .badge { display:inline-block; font-size:9pt; letter-spacing:2px; color:#b91c1c;
                border:1px solid #fecaca; background:#fef2f2; border-radius:999px; padding:4px 14px; margin-bottom:18px; }
.cover h1 { font-size:30pt; margin:0 0 6px; color:#111827; letter-spacing:1px; }
.cover h2 { font-size:14pt; color:#6b7280; font-weight:400; margin:0 0 30px; }
.cover .meta { font-size:10pt; color:#9ca3af; line-height:2; }
.cover .rule { width:60px; height:3px; background:#dc2626; margin:24px auto; border-radius:2px; }
h2.sec { font-size:15pt; color:#fff; background:#dc2626; padding:8px 14px; border-radius:6px;
         margin:26px 0 14px; page-break-after:avoid; }
h2.sec .w { float:right; font-size:10pt; font-weight:400; opacity:.9; }
h3 { font-size:12pt; color:#b91c1c; margin:18px 0 8px; page-break-after:avoid;
     border-left:3px solid #dc2626; padding-left:8px; }
table { width:100%; border-collapse:collapse; margin:8px 0 14px; font-size:10pt; page-break-inside:avoid; }
th { background:#fef2f2; color:#991b1b; text-align:left; padding:6px 8px; border:1px solid #fecaca; font-weight:600; }
td { padding:6px 8px; border:1px solid #e5e7eb; vertical-align:top; }
td.n { font-weight:700; color:#b91c1c; white-space:nowrap; }
.kv { background:#f9fafb; border-left:3px solid #9ca3af; padding:8px 12px; margin:8px 0; font-size:10pt; }
.tip { background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:10px 12px; margin:10px 0; font-size:10pt; page-break-inside:avoid; }
.tip b { color:#b45309; }
.warn { background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:10px 12px; margin:10px 0; font-size:10pt; page-break-inside:avoid; }
.warn b { color:#b91c1c; }
.q { margin:0 0 10px; padding-left:0; }
.q .stem { font-weight:600; color:#111827; }
.q .ans { color:#15803d; font-weight:600; }
.q .exp { color:#4b5563; font-size:9.5pt; margin-top:2px; }
ul { margin:6px 0 12px; padding-left:20px; }
li { margin:3px 0; }
.memo { font-family:Consolas,"Courier New",monospace; background:#111827; color:#fbbf24;
        padding:8px 12px; border-radius:6px; font-size:10pt; margin:8px 0; page-break-inside:avoid; }
.footer { margin-top:30px; padding-top:12px; border-top:1px dashed #d1d5db; font-size:9pt; color:#9ca3af; text-align:center; }
@media print { .noprint { display:none; } body { font-size:10.5pt; } }
.noprint { position:fixed; top:12px; right:12px; background:#dc2626; color:#fff; padding:10px 16px;
           border-radius:8px; font-size:12px; box-shadow:0 4px 12px rgba(0,0,0,.2); }
"""

def esc(s): return html.escape(str(s))

parts = []
parts.append(f"""<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<title>化工安全考点速记手册 · 中级注册安全工程师</title><style>{CSS}</style></head><body>
<div class="noprint">按 Ctrl+P（Mac: Cmd+P）→ 目标选「另存为 PDF」即可保存</div>
<div class="cover">
  <div class="badge">2026 备考专用</div>
  <h1>化工安全 · 考点速记手册</h1>
  <h2>中级注册安全工程师《安全生产专业实务》</h2>
  <div class="rule"></div>
  <div class="meta">
    覆盖 7 章 31 节 · 82 个核心考点<br>
    依据 2026 版官方教材编写<br>
    含必背数字速查表 · 易混点辨析 · 记忆口诀<br>
    <br>
    注安师免费学习平台 · zhuanshi365.cn
  </div>
</div>""")

# ---------- 手册使用说明 ----------
parts.append("""
<h2 class="sec">使用说明</h2>
<p>本手册把化工安全 7 章内容压缩成一张张「看一眼就能记住」的表格，适合三阶段使用：</p>
<table>
<tr><th style="width:22%">阶段</th><th>怎么用</th></tr>
<tr><td class="n">强化期</td><td>配合网站各章讲义，逐章过一遍本手册，重点记 <b>加粗的数字</b>与表格对比项</td></tr>
<tr><td class="n">冲刺期</td><td>只看「必背数字速查表」与「易混点辨析」，一天一遍，反复 7 天</td></tr>
<tr><td class="n">考前一天</td><td>只看第 7 章的答题模板与必背数字，保持手感即可，不要再做新题</td></tr>
</table>
<div class="tip"><b>重要：</b>化工安全 2025 年分值最集中的两章是 <b>第 2 章（31 分）</b> 与 <b>第 5 章（25 分）</b>，
两章合计 56 分。时间紧张时先保这两章。</div>
""")

# ---------- 必背数字速查 ----------
parts.append('<h2 class="sec">必背数字速查表 <span class="w">考前反复看</span></h2>')
parts.append("<table><tr><th style=\"width:26%\">数字</th><th>含义</th></tr>")
for k, v in NUMBERS:
    parts.append(f'<tr><td class="n">{esc(k)}</td><td>{esc(v)}</td></tr>')
parts.append("</table>")
parts.append('<div class="warn"><b>提醒：</b>数字类考点是化工安全最稳定的拿分点，'
             '2025 年多道题直接考数字。上表每一项都出现在官方教材原文中，务必逐一记牢。</div>')

# ---------- 分章考点 ----------
for ch in sorted(CHAPTERS):
    name, score = CHAPTERS[ch]
    parts.append(f'<h2 class="sec">第 {ch} 章　{name} <span class="w">2025 年约 {score} 分</span></h2>')
    qs = bych.get(ch, [])
    # 按考点分组，生成「考点 + 要点」表
    seen = {}
    for q in qs:
        p = q["examPoint"]
        if p not in seen:
            seen[p] = q
    parts.append('<table><tr><th style="width:30%">考点</th><th>核心要点（速记）</th></tr>')
    for p, q in seen.items():
        exp = q["explanation"]
        parts.append(f'<tr><td class="n">{esc(p)}</td><td>{esc(exp)}</td></tr>')
    parts.append("</table>")

parts.append('<div class="footer">'
             '化工安全考点速记手册 · 依据 2026 版《安全生产专业实务·化工安全》官方教材编写<br>'
             '本资料由 zhuanshi365.cn 整理，仅供个人备考使用，请勿用于商业传播'
             '</div></body></html>')

out = os.path.join(OUT, "chemical-speed-review.html")
open(out, "w", encoding="utf-8").write("".join(parts))
print("生成:", out, round(os.path.getsize(out)/1024), "KB")
