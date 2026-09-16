# -*- coding: utf-8 -*-
"""生成《案例答题模板》打印版 HTML —— 主观题万能框架"""
import os

BASE = r"C:\Users\ThinkPad\Downloads\safe-exam"
OUT = os.path.join(BASE, "public", "downloads")
os.makedirs(OUT, exist_ok=True)

CSS = """
@page { size: A4; margin: 16mm 14mm; }
* { box-sizing: border-box; }
body { font-family: -apple-system, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif;
       color:#1f2937; line-height:1.8; font-size:11pt; margin:0; }
.cover { text-align:center; padding:46mm 0 0; page-break-after:always; }
.cover .badge { display:inline-block; font-size:9pt; letter-spacing:2px; color:#1e3a8a;
                border:1px solid #bfdbfe; background:#eff6ff; border-radius:999px; padding:4px 14px; margin-bottom:18px; }
.cover h1 { font-size:30pt; margin:0 0 6px; color:#111827; letter-spacing:1px; }
.cover h2 { font-size:14pt; color:#6b7280; font-weight:400; margin:0 0 30px; }
.cover .meta { font-size:10pt; color:#9ca3af; line-height:2; }
.cover .rule { width:60px; height:3px; background:#2563eb; margin:24px auto; border-radius:2px; }
h2.sec { font-size:15pt; color:#fff; background:#1d4ed8; padding:8px 14px; border-radius:6px;
         margin:26px 0 14px; page-break-after:avoid; }
h3 { font-size:12pt; color:#1e40af; margin:20px 0 8px; page-break-after:avoid;
     border-left:3px solid #2563eb; padding-left:8px; }
table { width:100%; border-collapse:collapse; margin:8px 0 14px; font-size:10pt; page-break-inside:avoid; }
th { background:#eff6ff; color:#1e40af; text-align:left; padding:6px 8px; border:1px solid #bfdbfe; font-weight:600; }
td { padding:6px 8px; border:1px solid #e5e7eb; vertical-align:top; }
td.n { font-weight:700; color:#1d4ed8; white-space:nowrap; }
.box { border:1px solid #e5e7eb; border-radius:8px; padding:12px 14px; margin:10px 0; page-break-inside:avoid; }
.box .t { font-weight:700; color:#111827; margin-bottom:6px; }
.tpl { background:#f0f9ff; border-left:4px solid #2563eb; padding:10px 14px; margin:10px 0;
       font-size:10pt; white-space:pre-wrap; font-family:Consolas,"Courier New",monospace; line-height:1.7;
       page-break-inside:avoid; }
.tip { background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:10px 12px; margin:10px 0; font-size:10pt; page-break-inside:avoid; }
.tip b { color:#b45309; }
.warn { background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:10px 12px; margin:10px 0; font-size:10pt; page-break-inside:avoid; }
.warn b { color:#b91c1c; }
.good { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:10px 12px; margin:10px 0; font-size:10pt; page-break-inside:avoid; }
.good b { color:#15803d; }
ul,ol { margin:6px 0 12px; padding-left:22px; }
li { margin:4px 0; }
.footer { margin-top:30px; padding-top:12px; border-top:1px dashed #d1d5db; font-size:9pt; color:#9ca3af; text-align:center; }
.noprint { position:fixed; top:12px; right:12px; background:#1d4ed8; color:#fff; padding:10px 16px;
           border-radius:8px; font-size:12px; box-shadow:0 4px 12px rgba(0,0,0,.2); }
@media print { .noprint { display:none; } body { font-size:10.5pt; } }
"""

parts = [f"""<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<title>案例答题模板 · 安全生产专业实务</title><style>{CSS}</style></head><body>
<div class="noprint">按 Ctrl+P（Mac: Cmd+P）→ 目标选「另存为 PDF」即可保存</div>
<div class="cover">
  <div class="badge">主观题专用</div>
  <h1>案例答题模板</h1>
  <h2>中级注册安全工程师《安全生产专业实务》</h2>
  <div class="rule"></div>
  <div class="meta">
    万能答题框架 · 五类高频题型<br>
    事故等级判定 · 重大危险源计算 · 隐患判定<br>
    化工安全专业方向优先适用<br>
    <br>
    注安师免费学习平台 · zhuanshi365.cn
  </div>
</div>"""]

# ===== 第一章：为什么实务最容易丢分 =====
parts.append("""
<h2 class="sec">一、先搞懂：实务主观题为什么最容易丢分</h2>
<p>《安全生产专业实务》是全科唯一含 <b>主观案例题</b> 的科目。客观题靠记忆，
主观题靠 <b>「踩点得分」</b> —— 阅卷按关键词给分，答得多不等于得分多。</p>

<table>
<tr><th style="width:26%">常见丢分原因</th><th>具体表现</th><th style="width:30%">对策</th></tr>
<tr><td class="n">不知道答几点</td><td>想到哪写到哪，3 点写完就停手</td><td>按模板先列编号，<b>宁多勿少</b>，一般 4~6 点</td></tr>
<tr><td class="n">用词不规范</td><td>写"不太安全""有点危险"，阅卷找不到关键词</td><td>一律用<b>法规原文术语</b>（如"未按规定进行动火分析"）</td></tr>
<tr><td class="n">漏了管理原因</td><td>只答技术原因，不答管理原因</td><td>记住口诀：<b>技术 + 管理</b> 两层都要写</td></tr>
<tr><td class="n">措施写成口号</td><td>写"加强管理""提高意识"</td><td>措施必须<b>可执行</b>："建立××制度并落实考核"</td></tr>
<tr><td class="n">不写判定依据</td><td>只说"构成重大危险源"，不说依据</td><td>写清<b>依据条款/公式</b>，这是得分点</td></tr>
</table>

<div class="tip"><b>核心原则：</b>阅卷是「按点给分」，不是「按篇给分」。
每道题的得分点通常是 <b>3~6 个</b>，写满不一定对，<b>写到关键词才给分</b>。
所以答题时先想「这题能拆成几点」，再逐点作答。</div>
""")

# ===== 第二章：通用答题四步法 =====
parts.append("""
<h2 class="sec">二、通用答题四步法（所有案例题通用）</h2>
<p>拿到任何一道案例题，按下面四步走，基本不会跑偏。</p>

<h3>第 1 步：定性 —— 这是什么类型的问题</h3>
<table>
<tr><th style="width:30%">问题类型</th><th>识别特征（题干关键词）</th></tr>
<tr><td class="n">原因分析类</td><td>"分析……的原因""造成事故的原因有哪些"</td></tr>
<tr><td class="n">判定类</td><td>"是否构成……""属于什么等级""是否属于重大隐患"</td></tr>
<tr><td class="n">措施类</td><td>"应采取哪些措施""如何防范""提出整改建议"</td></tr>
<tr><td class="n">计算类</td><td>给出数量/临界量/人数，问"是否构成重大危险源""属于几级"</td></tr>
<tr><td class="n">辨识类</td><td>"指出存在的隐患/危险有害因素"</td></tr>
</table>

<h3>第 2 步：定点 —— 锁定对应法条或公式</h3>
<ul>
<li><b>事故等级</b> → 《生产安全事故报告和调查处理条例》（493 号令）</li>
<li><b>重大危险源</b> → GB 18218《危险化学品重大危险源辨识》</li>
<li><b>重大隐患</b> → 危险化学品企业重大生产安全事故隐患判定标准（20 条）</li>
<li><b>特殊作业</b> → GB 30871《危险化学品企业特殊作业安全规范》</li>
<li><b>事故类别</b> → GB 6441《企业职工伤亡事故分类》</li>
<li><b>外部防护距离</b> → GB/T 37243</li>
</ul>

<h3>第 3 步：分点 —— 按"技术 + 管理"两条线拆点</h3>
<div class="tpl">【通用拆点框架】

直接原因：
① 人的不安全行为：____（违规操作 / 未按规程 / 未持证）
② 物的不安全状态：____（设备缺陷 / 安全装置失效 / 未检测）

间接原因（管理缺陷）：
③ 制度：安全管理制度不健全 / 未建立××制度
④ 培训：安全教育培训不到位 / 特种作业人员未培训
⑤ 检查：隐患排查治理不到位 / 未开展定期检查
⑥ 应急：应急预案缺失或不完善 / 未组织演练
⑦ 投入：安全生产投入不足 / 安全设施未配备

防范措施（对应上面每条原因，逐条提出）：
① 技术措施：____
② 管理措施：____
③ 教育培训：____
④ 个体防护：____
⑤ 应急处置：____</div>

<h3>第 4 步：作答 —— 编号 + 术语 + 不写废话</h3>
<div class="good"><b>好的答法：</b><br>
1. 未按规定办理动火作业票，属于三级动火作业未经审批。<br>
2. 动火前未进行可燃气体分析，未落实"30m 内不得排放可燃气体"要求。<br>
3. 现场未设置监火人，作业人员未佩戴个体防护装备。</div>
<div class="warn"><b>差的答法：</b><br>
没有重视安全，管理比较混乱，工人安全意识差，应该加强管理、提高认识。<br>
（阅卷找不到关键词，0 分）</div>
""")

# ===== 第三章：五类高频题型专属模板 =====
parts.append("""
<h2 class="sec">三、五类高频题型 · 专属答题模板</h2>

<h3>题型 1 · 生产安全事故等级判定（几乎每年考）</h3>
<div class="kv">
<b>判定标准（三个条件满足其一即可，择重原则）：</b><br>
· 特别重大：死亡 <b>30 人以上</b> 或重伤 <b>100 人以上</b> 或损失 <b>1 亿元以上</b><br>
· 重大：死亡 <b>10~30 人</b> 或重伤 <b>50~100 人</b> 或损失 <b>5000 万~1 亿元</b><br>
· 较大：死亡 <b>3~10 人</b> 或重伤 <b>10~50 人</b> 或损失 <b>1000 万~5000 万元</b><br>
· 一般：死亡 <b>3 人以下</b> 或重伤 <b>10 人以下</b> 或损失 <b>1000 万元以下</b>
</div>
<div class="tpl">【答题模板】

第一步：列出题干给出的三项数据
死亡 __ 人；重伤 __ 人；直接经济损失 __ 万元。

第二步：分别对照标准
按死亡人数对照：属于 __ 事故；
按重伤人数对照：属于 __ 事故；
按经济损失对照：属于 __ 事故。

第三步：取最重者
三者中取等级最高者，本次事故为 __ 事故。

（提示：若某一项数据未给出，只按给出的项目判定，并在答案中说明）</div>
<div class="tip"><b>易错点：</b>「以上」含本数，「以下」不含本数。
死亡正好 3 人属于<b>较大事故</b>（3 人以上 10 人以下），不属于一般事故。</div>

<h3>题型 2 · 重大危险源辨识与分级</h3>
<div class="kv">
<b>核心公式：</b><br>
· 单一品种：实际存在量 ÷ 临界量 <b>≥ 1</b> → 构成重大危险源<br>
· 多品种：<b>Σ（每种实际量 ÷ 该种临界量）≥ 1</b> → 构成重大危险源<br>
· 单元界定：同属一个单位的几个装置，<b>边缘距离＜500m</b> 算一个单元
</div>
<div class="tpl">【答题模板】

第一步：确定单元
题干中 A、B 两个装置边缘距离 __ m，小于 500m，应划分为同一单元。

第二步：列出各物料的数据
物料 1：实际量 __ t，临界量 __ t，比值 __；
物料 2：实际量 __ t，临界量 __ t，比值 __。

第三步：求和并判定
Σ = __ + __ = __（≥1 或 ＜1）
结论：该单元（构成 / 不构成）重大危险源。

第四步：如构成，进一步分级
根据危险化学品数量与临界量比值及暴露人员数量，判定为 __ 级重大危险源。</div>
<div class="warn"><b>易错点：</b>单元界定的 <b>500m 是「边缘距离」</b>，不是中心距离。
考试常在此设干扰项。另外不要漏掉「同属一个生产经营单位」这个前提。</div>

<h3>题型 3 · 重大生产安全事故隐患判定</h3>
<div class="kv">
<b>「两重点一重大」= 重点监管危险化工工艺 + 重点监管危险化学品 + 重大危险源</b>
</div>
<table>
<tr><th style="width:34%">高频判定项</th><th>要点</th></tr>
<tr><td class="n">人的资质</td><td>主要负责人、安全管理人员未考核合格；特种作业人员未持证上岗</td></tr>
<tr><td class="n">外部安全防护距离</td><td>涉及"两重点一重大"的装置、储存设施外部防护距离不符合国标</td></tr>
<tr><td class="n">架空电力线路</td><td>地区架空电力线路穿越生产区且不符合国标</td></tr>
<tr><td class="n">自动化控制</td><td>重点监管危险化工工艺装置未实现自动化控制、未实现紧急停车功能</td></tr>
<tr><td class="n">紧急切断</td><td>一级、二级重大危险源罐区未实现紧急切断功能</td></tr>
<tr><td class="n">SIS</td><td>涉毒性气体、液化气体、剧毒液体的一级、二级重大危险源未配备独立 SIS</td></tr>
<tr><td class="n">注水设施</td><td>全压力式液化烃储罐未按国标设置注水设施，或未建立注水操作规程</td></tr>
<tr><td class="n">管道穿越</td><td>光气、氯气等剧毒气体及硫化氢气体管道穿越除厂区外的公共区域</td></tr>
</table>
<div class="tpl">【答题模板】

第一步：逐条对照判定标准
根据《危险化学品企业重大生产安全事故隐患判定标准》，本案中：
① ____ 项符合"未实现紧急切断功能"，属重大隐患；
② ____ 项符合"未配备独立安全仪表系统"，属重大隐患。

第二步：给出结论
综上，该企业存在 __ 项重大生产安全事故隐患。

第三步：如问措施，逐条对应提出
① 针对紧急切断：____
② 针对 SIS：____</div>

<h3>题型 4 · 原因分析与防范措施（最常考）</h3>
<div class="tpl">【标准答案结构】

一、事故直接原因
1. 人的不安全行为：____
2. 物的不安全状态：____

二、事故间接原因
1. 安全生产责任制不健全，未落实____责任
2. 安全教育培训不到位，作业人员不具备____能力
3. 隐患排查治理制度未落实，未及时发现并消除____隐患
4. 特殊作业管理制度未严格执行，未办理____作业票
5. 应急预案不完善，未按规定组织应急演练

三、事故防范措施
（技术措施）
1. 增设/完善____安全设施，确保____有效
2. 对____设备进行定期检测检验，防止失效
（管理措施）
3. 健全安全生产责任制，明确各岗位安全职责并考核
4. 严格执行特殊作业许可制度，落实作业前分析与现场监护
5. 建立隐患排查治理台账，实行闭环管理
（教育培训）
6. 开展全员安全教育培训，特种作业人员持证上岗
（个体防护与应急）
7. 按标准配备个体防护装备并监督检查佩戴情况
8. 修订完善应急预案，每年至少组织一次演练</div>
<div class="tip"><b>得分技巧：</b>防范措施类题目，记住维度口诀 ——
<b>「技术、管理、培训、防护、应急」五件套</b>。
先按这五个维度各写 1~2 点，基本能覆盖大部分得分点。</div>

<h3>题型 5 · 事故类别判定（GB 6441）</h3>
<div class="kv"><b>20 类事故中与化工最相关的：</b>
容器爆炸、锅炉爆炸、其他爆炸、中毒和窒息、火灾、灼烫、高处坠落、机械伤害、起重伤害、触电、物体打击、车辆伤害、坍塌</div>
<table>
<tr><th style="width:44%">题干描述</th><th>应判定为</th></tr>
<tr><td>反应釜因超压破裂爆炸</td><td class="n">容器爆炸</td></tr>
<tr><td>锅炉超压破裂爆炸</td><td class="n">锅炉爆炸</td></tr>
<tr><td>可燃气体/蒸气/粉尘与空气混合爆炸</td><td class="n">其他爆炸</td></tr>
<tr><td>污水井清淤硫化氢中毒</td><td class="n">中毒和窒息</td></tr>
<tr><td>强酸灼伤皮肤</td><td class="n">灼烫</td></tr>
<tr><td>吊装物坠落砸伤</td><td class="n">起重伤害</td></tr>
</table>
<div class="warn"><b>最易混：容器爆炸 vs 其他爆炸</b><br>
· <b>容器爆炸</b>：压力容器（反应釜、储罐、气瓶）<b>本身破裂</b>导致的爆炸<br>
· <b>其他爆炸</b>：<b>可燃物与空气混合</b>形成的爆炸性混合物爆炸<br>
判别关键：问「是什么炸了」—— 是容器本体，还是气体云。</div>
""")

# ===== 第四章：化工专属高频考点清单 =====
parts.append("""
<h2 class="sec">四、化工安全专属高频考点清单</h2>
<p>以下内容在化工安全真题中反复出现，答题时可直接引用。</p>

<h3>必须记住的三组数字</h3>
<table>
<tr><th style="width:30%">场景</th><th>数字要求</th></tr>
<tr><td class="n">动火作业</td><td>距动火点 <b>30m</b> 内不得排放可燃气体、<b>15m</b> 内不得排放可燃液体、<b>10m</b> 内不得进行可燃溶剂清洗或喷漆；<b>五级风</b>以上禁止露天动火</td></tr>
<tr><td class="n">受限空间</td><td>氧含量 <b>19.5%~21%</b>；作业前 <b>30min</b> 内检测；中断超 <b>60min</b> 重新检测</td></tr>
<tr><td class="n">盲板抽堵</td><td>预先绘制盲板位置图并统一编号；<b>一张作业票只进行一块盲板的一项作业</b></td></tr>
</table>

<h3>答题常用法规术语（照抄即得分）</h3>
<ul>
<li>「未按规定办理××作业票」</li>
<li>「未进行作业前安全分析 / 气体检测」</li>
<li>「未设置专职监护人 / 监护人擅自离岗」</li>
<li>「安全设施未与主体工程同时设计、同时施工、同时投入生产和使用」</li>
<li>「未按规定进行安全教育培训，特种作业人员未持证上岗」</li>
<li>「未建立健全生产安全事故隐患排查治理制度」</li>
<li>「安全生产条件不符合国家标准或者行业标准规定」</li>
<li>「未制定应急预案或者未定期组织演练」</li>
</ul>

<h3>18 种重点监管危险化工工艺（必背）</h3>
<div class="kv">光气及光气化、电解、氯化、硝化、合成氨、裂解（裂化）、氟化、加氢、重氮化、氧化、过氧化、胺基化、磺化、聚合、烷基化、新型煤化工、电石生产、偶氮化</div>
<div class="tip"><b>记忆口诀：</b>「光电解、氯硝氨；裂氟加、重氧过；胺磺聚、烷煤电偶」<br>
<b>反应类型：</b>只有<b>电解工艺</b>（吸热）和<b>裂解工艺</b>（高温吸热）不是放热反应，其余全部放热。</div>
""")

# ===== 第五章：考场时间分配 =====
parts.append("""
<h2 class="sec">五、考场时间分配建议</h2>
<table>
<tr><th style="width:24%">题型</th><th style="width:18%">建议用时</th><th>策略</th></tr>
<tr><td class="n">客观题</td><td>约 60 分钟</td><td>先做单选后多选；不确定的先标记跳过，不要恋战</td></tr>
<tr><td class="n">案例题（第一道）</td><td>约 30 分钟</td><td>通常为化工安全必答题，务必拿到基础分</td></tr>
<tr><td class="n">案例题（其余）</td><td>每题 25~30 分钟</td><td>先读问题再读材料，带着问题找线索</td></tr>
<tr><td class="n">检查</td><td>15 分钟</td><td>重点看是否漏答小问、编号是否清晰</td></tr>
</table>
<div class="tip"><b>重要提醒：</b>案例题<b>不要留空白</b>。即使不确定，也要按模板写出
「人、物、管理」三个维度，写出关键词就可能得分。空白一定 0 分，写了至少有部分分。</div>

<div class="footer">
案例答题模板 · 中级注册安全工程师《安全生产专业实务》<br>
本资料由 zhuanshi365.cn 整理，仅供个人备考使用，请勿用于商业传播
</div></body></html>""")

out = os.path.join(OUT, "case-answer-templates.html")
open(out, "w", encoding="utf-8").write("".join(parts))
print("生成:", out, round(os.path.getsize(out)/1024), "KB")
