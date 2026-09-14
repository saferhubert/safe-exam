"""
将 laws 各章的 page.mdx 转换为「分节锚点 + 随堂练习」格式。

做三件事：
1. 给每个 `## 第N节 xxx` 标题插入 <h3 id="sN">锚点</h3>，供题目溯源跳转
2. 在每节末尾插入 <PracticeFrom section="sN" />（若该节有随堂练习题）
3. 把老的「章节练习」链接块规范化（可选）

只处理 headings，不动正文内容，保证已有内容零损失。
"""
import re, os, json, sys

BASE = r"C:\Users\ThinkPad\Downloads\safe-exam\src\content\laws"

CN = "一二三四五六七八九十"


def section_id_from_heading(idx: int) -> str:
    """第 n 个『## 第X节』标题 -> s(n)，从 1 开始"""
    return f"s{idx}"


def convert_chapter(ch_slug: str) -> dict:
    page = os.path.join(BASE, ch_slug, "page.mdx")
    quiz = os.path.join(BASE, ch_slug, "quiz.json")
    if not os.path.exists(page):
        return {"chapter": ch_slug, "skipped": "no page.mdx"}

    src = open(page, encoding="utf-8").read()

    # 若已转换过，跳过
    if re.search(r'<h3 id="s\d+"', src):
        return {"chapter": ch_slug, "skipped": "already converted"}

    # 找出所有二级标题
    lines = src.split("\n")
    # 识别哪些 ## 是「节」：以 第X节 开头，或是 一、二、三 这种（ch01/02/05）
    sec_idx = 0
    out = []
    inserted_anchors = []

    for i, line in enumerate(lines):
        m = re.match(r"^##\s+(?:第[一二三四五六七八九十]+节\s*)?(.+?)\s*$", line)
        if m and not line.startswith("###"):
            heading_text = m.group(1)
            # 跳过非「节」类的标题
            if (
                heading_text in ("考试大纲要求", "本章小结", "章节练习")
                or "考点地图" in heading_text
                or "小结" in heading_text
                or heading_text.startswith("本章")
            ):
                out.append(line)
                continue
            sec_idx += 1
            sid = f"s{sec_idx}"
            inserted_anchors.append({"id": sid, "title": line.replace("## ", "").strip()})
            # 保留原 ## 标题（用于显示），并在其后加锚点
            out.append(line)
            out.append("")
            out.append(f'<h3 id="{sid}">{heading_text}</h3>')
            continue
        out.append(line)

    new_src = "\n".join(out)

    # 在每节末尾插入随堂练习占位（仅当 quiz.json 里该节有 inline 题）
    inline_sections = []
    if os.path.exists(quiz):
        try:
            q = json.load(open(quiz, encoding="utf-8"))
            inline_sections = sorted({
                x["sourceRef"]["sectionId"]
                for x in q.get("questions", [])
                if x.get("scope") == "inline" and x.get("sourceRef")
            })
        except Exception:
            pass

    if inline_sections:
        for sid in inline_sections:
            # 在该节的下一个 ## 之前插入 PracticeFrom
            pat = re.compile(rf'(<h3 id="{sid}">.*?)(?=\n##\s|\Z)', re.S)
            def repl(m):
                return m.group(1).rstrip() + f'\n\n<PracticeFrom section="{sid}" />\n\n'
            new_src = pat.sub(repl, new_src, count=1)

    open(page, "w", encoding="utf-8").write(new_src)

    return {
        "chapter": ch_slug,
        "sections": len(inserted_anchors),
        "anchors": inserted_anchors,
        "inlineInjected": inline_sections,
    }


if __name__ == "__main__":
    results = []
    for i in range(1, 8):
        results.append(convert_chapter(f"chapter-0{i}"))
    print(json.dumps(results, ensure_ascii=False, indent=2))
