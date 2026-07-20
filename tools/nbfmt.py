#!/usr/bin/env python3
"""Canonical notebook code-cell formatter (single source of truth for readability).

Rule: a blank line delimits every top-level `print(...)` block. One blank line is
inserted whenever we cross INTO or OUT OF a run of top-level print statements, so
the "compute" code is visually separated from the "show results" prints, and any
trailing `assert` / `plt.*` lines are separated from the prints too.

Properties:
  * top-level only  - never touches prints indented inside loops/functions.
  * string-safe     - ignores lines inside triple-quoted strings.
  * comment-aware   - a comment directly above a print stays attached to it.
  * idempotent      - never creates a double blank line; re-running is a no-op.
  * additive        - only inserts blank lines; never removes or edits code.

Usage:
  from nbfmt import format_source            # format a code-cell string
  python3 tools/nbfmt.py a.ipynb b.ipynb     # format specific notebooks in place
  python3 tools/nbfmt.py                      # format all app notebooks in place
"""
import json
import sys
import glob
import os


def _is_print(stripped: str) -> bool:
    return stripped.startswith("print(") or stripped.startswith("print ")


def format_source(src: str) -> str:
    """Insert blank lines delimiting top-level print blocks. See module docstring."""
    lines = src.split("\n")
    n = len(lines)

    # Pass 1: classify each line while tracking triple-quoted-string state.
    # info[i] = (is_toplevel_content, is_print, is_comment)
    info = []
    in_triple = None
    for ln in lines:
        inside_string = in_triple is not None
        is_content = is_print = is_comment = False
        if not inside_string:
            stripped = ln.strip()
            if stripped and ln[:1] not in (" ", "\t"):  # top-level, non-blank
                is_content = True
                if stripped.startswith("#"):
                    is_comment = True
                else:
                    is_print = _is_print(stripped)
        # Update triple-quote state AFTER classifying this line.
        for q in ('"""', "'''"):
            if ln.count(q) % 2 == 1:
                in_triple = None if in_triple == q else (q if in_triple is None else in_triple)
                break
        info.append((is_content, is_print, is_comment))

    # Pass 2: resolve each top-level line's block category (True = print block).
    # A comment adopts the category of the next non-comment content line it hugs.
    cat = [None] * n
    for i in range(n):
        is_content, is_print, is_comment = info[i]
        if not is_content:
            continue
        if not is_comment:
            cat[i] = is_print
            continue
        found = False
        j = i + 1
        while j < n:
            jc = info[j]
            if not jc[0]:  # blank / non-content line breaks the attachment
                break
            if jc[2]:  # another comment -> keep scanning
                j += 1
                continue
            cat[i] = jc[1]
            found = True
            break
        if not found:
            cat[i] = False

    # Pass 3: emit, inserting one blank line at each print-block boundary.
    out = []
    prev_cat = None
    for i, ln in enumerate(lines):
        if info[i][0]:
            c = cat[i]
            if prev_cat is not None and c != prev_cat and out and out[-1].strip() != "":
                out.append("")
            out.append(ln)
            prev_cat = c
        else:
            out.append(ln)
    return "\n".join(out)


def _to_source_list(text: str):
    """Match the notebook JSON convention: list of lines, each but the last ends in
    ``\\n``. A trailing newline stays attached to the last line (no empty element)."""
    if text == "":
        return []
    parts = text.split("\n")
    lines = [p + "\n" for p in parts[:-1]]
    if parts[-1] != "":
        lines.append(parts[-1])
    return lines


def format_file(path: str) -> bool:
    """Format all code cells in a notebook in place. Returns True if it changed.

    Preserves the file's exact serialization style so unchanged cells never churn:
      * escaping - Python-generated notebooks escape non-ASCII (ensure_ascii=True);
        JS-generated ones keep raw UTF-8. Detected from whether the file is ASCII.
      * indent 1 space, no trailing newline (matches both JSON.stringify(nb,null,1)
        and json.dump(nb, indent=1)).
    """
    with open(path, "r", encoding="utf-8") as f:
        raw = f.read()
    nb = json.loads(raw)
    ensure_ascii = raw.isascii()  # ASCII file => Python-style escaped dump
    changed = False
    for cell in nb.get("cells", []):
        if cell.get("cell_type") != "code":
            continue
        src = cell.get("source", [])
        was_string = isinstance(src, str)
        before = src if was_string else "".join(src)
        after = format_source(before)
        if after != before:
            # Preserve the cell's original source representation (string vs line-array).
            cell["source"] = after if was_string else _to_source_list(after)
            changed = True
    if changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write(json.dumps(nb, indent=1, ensure_ascii=ensure_ascii))
    return changed


def _default_targets():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pats = ["notebooks/*.ipynb", "afp/notebooks/*.ipynb", "topics/notebooks/**/*.ipynb"]
    files = []
    for p in pats:
        files += glob.glob(os.path.join(root, p), recursive=True)
    return sorted(files)


def main(argv):
    targets = argv[1:] or _default_targets()
    changed = 0
    for path in targets:
        try:
            if format_file(path):
                changed += 1
        except Exception as e:  # noqa: BLE001 - report and continue
            print(f"  SKIP {path}: {e}", file=sys.stderr)
    print(f"nbfmt: formatted {changed}/{len(targets)} notebook(s)")


if __name__ == "__main__":
    main(sys.argv)
