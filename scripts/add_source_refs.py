"""
为 laws 各章 quiz.json 的题目补 sourceRef（知识点溯源），
并把一部分题目标记为 scope:"inline"（随堂练习），注入对应分节。

映射策略：用每节标题/title 的关键词，与题目的 examPoint 做匹配打分，取最高分的节。
"""
import json, os, re

BASE = r"C:\Users\ThinkPad\Downloads\safe-exam\src\content\laws"

# 每节的匹配关键词（人工整理，覆盖各节核心考点词）
SECTION_KEYWORDS = {
    "chapter-01": {
        "s1": ["方针", "安全第一", "预防为主", "综合治理", "内涵"],
        "s2": ["工作机制", "政府", "部门", "企业", "社会", "职工权利", "三方"],
        "s3": ["规划", "十三五", "十四五", "指标"],
        "s4": ["改革发展", "意见", "改革"],
    },
    "chapter-02": {
        "s1": ["制定主体", "法的形式", "形式识别", "法律", "行政法规", "地方性"],
        "s2": ["效力", "层级", "冲突", "特别法", "优于", "综合法", "单行法", "部门规章"],
        "s3": ["体系", "框架", "法律体系"],
    },
    "chapter-03": {
        "s1": ["适用范围", "立法目的", "第二条", "监管职责", "监管部门"],
        "s2": ["主要负责人", "安全管理机构", "安全管理人员职责", "基本规定", "方针", "工会"],
        "s3": ["三同时", "安全教育培训", "危险作业", "资金投入", "重大危险源", "管理机构配备",
                 "安管人员任免", "安全评价", "交叉作业", "发包", "出租", "工伤保险", "责任保险"],
        "s4": ["从业人员", "权利", "义务", "劳动合同"],
        "s5": ["监督管理", "监督检查", "停止供电", "举报", "公益诉讼", "黑名单", "职权"],
        "s6": ["应急救援", "事故报告", "调查处理", "应急组织", "抢救"],
        "s7": ["法律责任", "罚款", "中介机构", "处罚", "主要负责人事故罚款"],
    },
    "chapter-04": {
        "s1": ["矿山", "安全出口", "矿柱", "岩柱", "矿山建设", "矿山开采"],
        "s2": ["消防", "专职消防队", "公众聚集场所", "防火", "灭火"],
        "s3": ["道路", "通行", "非机动车", "车辆"],
        "s4": ["特种设备", "使用登记", "检验检测", "电梯", "设计文件鉴定"],
        "s5": ["建筑", "施工许可", "发包", "承包", "建筑施工"],
    },
    "chapter-05": {
        "s1": ["民法典", "侵权责任", "建筑物倒塌"],
        "s2": ["刑法", "重大责任事故罪", "强令", "违章冒险", "不报", "谎报", "危险作业罪",
                 "重大劳动安全事故罪"],
        "s3": ["行政处罚", "不予处罚", "办案期限", "行政处罚的种类", "管辖"],
        "s4": ["劳动法", "女职工", "未成年工", "禁忌"],
        "s5": ["劳动合同", "订立", "履行", "解除"],
        "s6": ["突发事件", "预警", "应急处置", "救援"],
        "s7": ["职业病", "诊断", "尘肺", "职业健康"],
    },
    "chapter-06": {
        "s1": ["安全生产许可证", "许可范围", "颁发"],
        "s2": ["煤矿企业", "煤矿安全"],
        "s3": ["建设工程", "相关单位安全责任"],
        "s4": ["危险化学品", "危化品"],
        "s5": ["烟花爆竹"],
        "s6": ["民用爆炸物品", "民爆"],
        "s7": ["特种设备安全监察", "特种设备使用安全"],
        "s8": ["应急预案演练", "应急演练", "应急准备", "应急预案"],
        "s9": ["事故报告", "事故等级", "事故调查", "事故分类"],
        "s10": ["工伤", "工伤保险", "劳动能力鉴定"],
        "s11": ["大型群众性活动"],
        "s12": ["女职工", "孕期", "禁忌"],
    },
    "chapter-07": {
        "s1": ["注册安全工程师"],
        "s2": ["安全培训", "培训学时", "三级"],
        "s3": ["特种作业", "操作证", "复审"],
        "s4": ["安全生产培训管理办法", "培训组织"],
        "s5": ["重大隐患", "隐患排查", "隐患报告"],
        "s6": ["应急预案评审", "应急预案论证", "应急预案管理"],
        "s7": ["信息报告", "事故信息"],
        "s8": ["失信名单"],
        "s9": ["行政处罚办法", "违法行为处罚"],
        "s10": ["建设工程消防设计审查", "消防验收"],
        "s11": ["高层民用建筑", "防火巡查"],
        "s12": ["粉尘防爆", "粉尘"],
        "s13": ["三同时"],
        "s14": ["有限空间"],
        "s15": ["危险化学品管道", "重大危险源重新评估", "重大危险源"],
    },
}


def pick_section(chapter: str, exam_point: str, sections: list) -> str | None:
    kws = SECTION_KEYWORDS.get(chapter, {})
    best, best_score = None, 0
    ep = exam_point or ""
    for sid, words in kws.items():
        score = sum(1 for w in words if w in ep)
        if score > best_score:
            best, best_score = sid, score
    if best:
        return best
    # 兜底：返回第一节
    return sections[0]["id"] if sections else None


def main():
    chapters_meta = json.load(open(os.path.join(BASE, "chapters.json"), encoding="utf-8"))
    meta_by_slug = {c["slug"]: c for c in chapters_meta}

    report = []
    for slug, meta in meta_by_slug.items():
        qp = os.path.join(BASE, slug, "quiz.json")
        if not os.path.exists(qp):
            continue
        quiz = json.load(open(qp, encoding="utf-8"))
        questions = quiz.get("questions", [])
        sections = meta["sections"]
        sec_title = {s["id"]: s["title"] for s in sections}

        # 统计每节题量，选出 2 题作为随堂练习
        by_sec = {}
        for q in questions:
            sid = pick_section(slug, q.get("examPoint", ""), sections)
            if not sid:
                continue
            by_sec.setdefault(sid, []).append(q)

        inline_ids = set()
        # 保证章节测验至少保留 10 题，其余才可作随堂练习
        min_quiz = 10
        budget_inline = max(0, len(questions) - min_quiz)
        # 每节最多 2 题；按节轮询分配，保证覆盖均匀
        order = sorted(by_sec.keys(), key=lambda s: int(s[1:]) if s[1:].isdigit() else 99)
        picked = 0
        for round_no in range(2):
            for sid in order:
                if picked >= budget_inline:
                    break
                qs = by_sec[sid]
                if round_no < len(qs):
                    inline_ids.add(qs[round_no]["id"])
                    picked += 1
            if picked >= budget_inline:
                break

        for q in questions:
            sid = pick_section(slug, q.get("examPoint", ""), sections)
            if not sid:
                continue
            q["sourceRef"] = {
                "chapter": slug,
                "sectionId": sid,
                "sectionTitle": sec_title.get(sid, ""),
                "point": q.get("examPoint", ""),
            }
            if q["id"] in inline_ids:
                q["scope"] = "inline"
            else:
                q.pop("scope", None)

        json.dump(quiz, open(qp, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        n_inline = sum(1 for q in questions if q.get("scope") == "inline")
        report.append({
            "chapter": slug,
            "total": len(questions),
            "inline": n_inline,
            "quiz": len(questions) - n_inline,
            "sectionsCovered": len(by_sec),
            "sectionsTotal": len(sections),
        })

    for r in report:
        print(f"{r['chapter']}: {r['total']}题 = 随堂{r['inline']} + 测验{r['quiz']} | "
              f"覆盖 {r['sectionsCovered']}/{r['sectionsTotal']} 节")


if __name__ == "__main__":
    main()
