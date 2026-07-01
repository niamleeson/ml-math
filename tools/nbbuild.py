"""
Shared notebook builder for the Part-7 (Computer Vision) rebuild.

Agents build cells with md()/code(), then write() a valid Colab .ipynb with
metadata.enhanced_walkthrough=true (so the old generator won't clobber it). check_readable()
enforces the "one statement per line" convention from the plan (§B.4): it flags code lines that
chain multiple statements with ';'. Keep code readable — one operation per line.
"""

import json
import re


def md(text):
    """Return a markdown cell."""
    return {"cell_type": "markdown", "metadata": {}, "source": _split(text)}


def code(text):
    """Return a code cell."""
    return {"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": _split(text)}


def _split(s):
    """Store source as a list of lines with trailing newlines (nbformat convention)."""
    lines = str(s).split("\n")
    return [ln + "\n" if i < len(lines) - 1 else ln for i, ln in enumerate(lines)]


def _strip_strings_and_comments(line):
    """Rough removal of string literals and trailing comments so the ';' check ignores them."""
    out = re.sub(r'"[^"]*"', '""', line)
    out = re.sub(r"'[^']*'", "''", out)
    out = out.split("#", 1)[0]
    return out


def check_readable(cells):
    """Return a list of (cell_index, line) for code lines that pack multiple statements with ';'.

    A single trailing ';' or ';' inside strings/comments is ignored. Empty result == clean.
    """
    problems = []
    for i, c in enumerate(cells):
        if c["cell_type"] != "code":
            continue
        for raw in "".join(c["source"]).split("\n"):
            bare = _strip_strings_and_comments(raw).rstrip()
            inner = bare[:-1] if bare.endswith(";") else bare
            if ";" in inner:
                problems.append((i, raw))
    return problems


def notebook(cells):
    """Wrap cells into a full nbformat-4 dict with the enhanced_walkthrough guard set."""
    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {"name": "python3", "display_name": "Python 3"},
            "language_info": {"name": "python"},
            "colab": {"provenance": []},
            "enhanced_walkthrough": True,
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }


def write(path, cells, enforce_readable=True):
    """Validate readability then write the notebook JSON to path. Raises if code is not readable."""
    bad = check_readable(cells)
    if enforce_readable and bad:
        preview = "\n".join(f"  cell {i}: {ln}" for i, ln in bad[:8])
        raise ValueError(f"{path}: {len(bad)} dense code line(s) — one statement per line:\n{preview}")
    with open(path, "w") as f:
        json.dump(notebook(cells), f, indent=1)
    return path
