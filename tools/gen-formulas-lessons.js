/* =====================================================================
   gen-formulas-lessons.js — build the "Formulas" section (first section
   under the "Math" supergroup) from vector-math-formulas.md.

   Converts vector-math-formulas.md into lessons/math-00-formulas.js, whose
   objects are pushed into window.LESSONS (module "Formulas", superGroup
   "Math", template "formulas"). One lesson per "# Part N", plus an Overview,
   a through-line closer, and a Practice-drills links page.

   Run:  node tools/gen-formulas-lessons.js
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "vector-math-formulas.md");
const OUT = path.join(ROOT, "lessons", "math-00-formulas.js");
const REPO = "niamleeson/ml-math";

/* ---------- tiny Markdown -> HTML converter (same rules as build-curriculum.js) ---------- */
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function inline(text) {
  let t = esc(text);
  t = t.replace(/&lt;br\s*\/?&gt;/g, "<br>");
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  return t;
}
function convert(md) {
  const code = [], disp = [], icode = [], imath = [];
  md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, c) => { code.push({ lang: lang || "text", c }); return "\n\u0000c" + (code.length - 1) + "\u0000\n"; });
  md = md.replace(/\$\$([\s\S]*?)\$\$/g, (m, x) => { disp.push(x); return "\u0000m" + (disp.length - 1) + "\u0000"; });
  md = md.replace(/`([^`]+)`/g, (m, x) => { icode.push(x); return "\u0000j" + (icode.length - 1) + "\u0000"; });
  md = md.replace(/\$([^$\n]+?)\$/g, (m, x) => { imath.push(x); return "\u0000x" + (imath.length - 1) + "\u0000"; });

  const lines = md.split("\n");
  function parseBlocks(ls) {
    let out = "", k = 0;
    while (k < ls.length) {
      let line = ls[k];
      if (!line.trim()) { k++; continue; }
      let mc = line.match(/^\u0000c(\d+)\u0000$/);
      if (mc) { out += "\u0000c" + mc[1] + "\u0000\n"; k++; continue; }
      if (/^<[a-zA-Z\/]/.test(line.trim())) { out += line.trim() + "\n"; k++; continue; }
      let mh = line.match(/^(#{1,6})\s+(.*)$/);
      if (mh) { const lvl = mh[1].length; out += "<h" + lvl + ">" + inline(mh[2].trim()) + "</h" + lvl + ">\n"; k++; continue; }
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) { out += "<hr>\n"; k++; continue; }
      if (/^>\s?/.test(line)) {
        const buf = [];
        while (k < ls.length && /^>\s?/.test(ls[k])) { buf.push(ls[k].replace(/^>\s?/, "")); k++; }
        out += "<blockquote>\n" + parseBlocks(buf) + "</blockquote>\n"; continue;
      }
      if (line.indexOf("|") !== -1 && k + 1 < ls.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(ls[k + 1]) && ls[k + 1].indexOf("-") !== -1) {
        const cells = (r) => r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
        const header = cells(line);
        k += 2;
        let thead = "<thead><tr>" + header.map((c) => "<th>" + inline(c) + "</th>").join("") + "</tr></thead>";
        let body = "";
        while (k < ls.length && ls[k].indexOf("|") !== -1 && ls[k].trim()) {
          const row = cells(ls[k]);
          body += "<tr>" + row.map((c) => "<td>" + inline(c) + "</td>").join("") + "</tr>"; k++;
        }
        out += "<table>" + thead + "<tbody>" + body + "</tbody></table>\n"; continue;
      }
      if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
        const items = [];
        while (k < ls.length && /^\s*([-*+]|\d+\.)\s+/.test(ls[k])) {
          const m = ls[k].match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
          items.push({ indent: m[1].length, ordered: /\d+\./.test(m[2]), text: m[3] });
          k++;
        }
        out += buildList(items) + "\n"; continue;
      }
      const buf = [];
      while (k < ls.length && ls[k].trim() && !/^(#{1,6}\s|>\s?|\s*([-*+]|\d+\.)\s|-{3,}$)/.test(ls[k]) && !/^\u0000c\d+\u0000$/.test(ls[k].trim()) && !/^<[a-zA-Z\/]/.test(ls[k].trim())) {
        buf.push(ls[k]); k++;
      }
      if (buf.length) out += "<p>" + inline(buf.join(" ")) + "</p>\n";
      else { k++; }
    }
    return out;
  }
  function buildList(items) {
    let idx = 0;
    function build(minIndent) {
      const ordered = items[idx].ordered;
      let h = ordered ? "<ol>" : "<ul>";
      while (idx < items.length && items[idx].indent >= minIndent) {
        const cur = items[idx];
        if (cur.indent > minIndent) { h += build(cur.indent); continue; }
        idx++;
        let li = "<li>" + inline(cur.text);
        if (idx < items.length && items[idx].indent > cur.indent) li += build(items[idx].indent);
        li += "</li>";
        h += li;
      }
      h += ordered ? "</ol>" : "</ul>";
      return h;
    }
    return build(items[0].indent);
  }

  let title = "";
  const firstH1 = lines.findIndex((l) => /^#\s+/.test(l));
  if (firstH1 !== -1) { title = lines[firstH1].replace(/^#\s+/, "").trim(); lines.splice(firstH1, 1); }

  let html = parseBlocks(lines);
  html = html.replace(/\u0000c(\d+)\u0000/g, (m, n) => '<pre><code class="language-' + code[n].lang + '">' + esc(code[n].c.replace(/\n$/, "")) + "</code></pre>");
  html = html.replace(/\u0000m(\d+)\u0000/g, (m, n) => "$$" + disp[n] + "$$");
  html = html.replace(/\u0000j(\d+)\u0000/g, (m, n) => "<code>" + esc(icode[n]) + "</code>");
  html = html.replace(/\u0000x(\d+)\u0000/g, (m, n) => "$" + imath[n] + "$");
  return { title, html: html.trim() };
}

/* ---------- LaTeX for each formula (id "P.N") — shown above the code block ---------- */
const LATEX = {
  "1.1": "\\mathbf{a}+\\mathbf{b} = [\\,a_1+b_1,\\; a_2+b_2,\\; \\dots,\\; a_n+b_n\\,]",
  "1.2": "\\mathbf{a}-\\mathbf{b} = [\\,a_1-b_1,\\; a_2-b_2,\\; \\dots,\\; a_n-b_n\\,]",
  "1.3": "k\\,\\mathbf{v} = [\\,k v_1,\\; k v_2,\\; \\dots,\\; k v_n\\,]",
  "1.4": "\\mathbf{0} = [\\,0,\\; 0,\\; \\dots,\\; 0\\,]",
  "1.5": "c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 + \\dots + c_k\\mathbf{v}_k",
  "1.6": "w_1\\mathbf{v}_1 + \\dots + w_k\\mathbf{v}_k \\quad\\text{with}\\quad \\sum_i w_i = 1",
  "2.1": "\\lVert \\mathbf{v}\\rVert = \\sqrt{v_1^2 + v_2^2 + \\dots + v_n^2}",
  "2.2": "\\lVert \\mathbf{v}\\rVert = \\sqrt{\\mathbf{v}\\cdot\\mathbf{v}}",
  "2.3": "\\lVert \\mathbf{v}\\rVert^2 = \\mathbf{v}\\cdot\\mathbf{v} = v_1^2 + v_2^2 + \\dots",
  "2.4": "\\lVert k\\,\\mathbf{v}\\rVert = |k|\\,\\lVert \\mathbf{v}\\rVert",
  "2.5": "\\lVert \\mathbf{v}\\rVert_1 = |v_1| + |v_2| + \\dots + |v_n|",
  "2.6": "\\lVert \\mathbf{v}\\rVert_\\infty = \\max\\big(|v_1|,\\, |v_2|,\\, \\dots,\\, |v_n|\\big)",
  "2.7": "\\lVert \\mathbf{v}\\rVert_p = \\left(|v_1|^p + |v_2|^p + \\dots\\right)^{1/p}",
  "3.1": "\\mathbf{a}\\cdot\\mathbf{b} = a_1 b_1 + a_2 b_2 + \\dots + a_n b_n",
  "3.2": "\\mathbf{a}\\cdot\\mathbf{b} = \\lVert\\mathbf{a}\\rVert\\,\\lVert\\mathbf{b}\\rVert\\cos\\theta",
  "3.3": "\\mathbf{v}\\cdot\\mathbf{v} = \\lVert\\mathbf{v}\\rVert^2",
  "3.4": "\\mathbf{a}\\cdot\\hat{\\mathbf{b}} = \\lVert\\mathbf{a}\\rVert\\cos\\theta",
  "3.5": "\\mathbf{a}\\cdot\\mathbf{b} = \\mathbf{b}\\cdot\\mathbf{a},\\qquad \\mathbf{a}\\cdot(\\mathbf{b}+\\mathbf{c}) = \\mathbf{a}\\cdot\\mathbf{b} + \\mathbf{a}\\cdot\\mathbf{c}",
  "4.1": "\\cos(\\mathbf{a},\\mathbf{b}) = \\frac{\\mathbf{a}\\cdot\\mathbf{b}}{\\lVert\\mathbf{a}\\rVert\\,\\lVert\\mathbf{b}\\rVert}",
  "4.2": "d_{\\cos}(\\mathbf{a},\\mathbf{b}) = 1 - \\cos(\\mathbf{a},\\mathbf{b})",
  "4.3": "\\theta = \\arccos\\!\\big(\\cos(\\mathbf{a},\\mathbf{b})\\big)",
  "4.4": "|\\,\\mathbf{a}\\cdot\\mathbf{b}\\,| \\;\\le\\; \\lVert\\mathbf{a}\\rVert\\,\\lVert\\mathbf{b}\\rVert",
  "5.1": "\\hat{\\mathbf{v}} = \\frac{\\mathbf{v}}{\\lVert\\mathbf{v}\\rVert}",
  "5.2": "\\hat{\\mathbf{a}}\\cdot\\hat{\\mathbf{b}} = \\cos(\\mathbf{a},\\mathbf{b})",
  "5.3": "\\mathbf{v}_{\\text{centered}} = \\mathbf{v} - \\bar{v}",
  "5.4": "\\mathbf{z} = \\frac{\\mathbf{v} - \\mu}{\\sigma}",
  "6.1": "d(\\mathbf{a},\\mathbf{b}) = \\lVert\\mathbf{a}-\\mathbf{b}\\rVert = \\sqrt{\\textstyle\\sum_i (a_i-b_i)^2}",
  "6.2": "d(\\mathbf{a},\\mathbf{b})^2 = \\textstyle\\sum_i (a_i-b_i)^2",
  "6.3": "d_1(\\mathbf{a},\\mathbf{b}) = \\textstyle\\sum_i |a_i-b_i|",
  "6.4": "d_\\infty(\\mathbf{a},\\mathbf{b}) = \\max_i |a_i-b_i|",
  "6.5": "d_p(\\mathbf{a},\\mathbf{b}) = \\left(\\textstyle\\sum_i |a_i-b_i|^p\\right)^{1/p}",
  "6.6": "d(\\mathbf{a},\\mathbf{b}) \\ge 0,\\quad d(\\mathbf{a},\\mathbf{b}) = d(\\mathbf{b},\\mathbf{a}),\\quad d(\\mathbf{a},\\mathbf{c}) \\le d(\\mathbf{a},\\mathbf{b}) + d(\\mathbf{b},\\mathbf{c})",
  "7.1": "d(\\mathbf{a},\\mathbf{b})^2 = \\lVert\\mathbf{a}\\rVert^2 + \\lVert\\mathbf{b}\\rVert^2 - 2\\,\\mathbf{a}\\cdot\\mathbf{b}",
  "7.2": "d^2 = 2 - 2\\cos\\theta",
  "7.3": "\\mathbf{a}\\cdot\\mathbf{b} = \\tfrac{1}{2}\\big(\\lVert\\mathbf{a}+\\mathbf{b}\\rVert^2 - \\lVert\\mathbf{a}\\rVert^2 - \\lVert\\mathbf{b}\\rVert^2\\big)",
  "7.4": "\\lVert\\mathbf{a}+\\mathbf{b}\\rVert^2 + \\lVert\\mathbf{a}-\\mathbf{b}\\rVert^2 = 2\\lVert\\mathbf{a}\\rVert^2 + 2\\lVert\\mathbf{b}\\rVert^2",
  "8.1": "\\text{proj length} = \\frac{\\mathbf{a}\\cdot\\mathbf{b}}{\\lVert\\mathbf{b}\\rVert}",
  "8.2": "\\operatorname{proj}_{\\mathbf{b}}\\mathbf{a} = \\frac{\\mathbf{a}\\cdot\\mathbf{b}}{\\mathbf{b}\\cdot\\mathbf{b}}\\,\\mathbf{b}",
  "8.3": "\\mathbf{a} = \\operatorname{proj}_{\\mathbf{b}}\\mathbf{a} + \\mathbf{a}_{\\perp}",
  "8.4": "\\mathbf{a}\\perp\\mathbf{b} \\iff \\mathbf{a}\\cdot\\mathbf{b} = 0",
  "9.1": "\\mathbf{a}\\odot\\mathbf{b} = [\\,a_1 b_1,\\; a_2 b_2,\\; \\dots,\\; a_n b_n\\,]",
  "9.2": "(\\mathbf{a}\\otimes\\mathbf{b})_{ij} = a_i b_j",
  "9.3": "\\lVert\\mathbf{a}\\times\\mathbf{b}\\rVert = \\lVert\\mathbf{a}\\rVert\\,\\lVert\\mathbf{b}\\rVert\\sin\\theta",
  "10.1": "\\bar{\\mathbf{v}} = \\frac{1}{k}\\sum_{i=1}^{k}\\mathbf{v}_i",
  "10.2": "r(\\mathbf{a},\\mathbf{b}) = \\cos\\big(\\mathbf{a}-\\bar a,\\; \\mathbf{b}-\\bar b\\big)",
  "10.3": "\\operatorname{Var}(\\mathbf{v}) = \\frac{\\lVert\\mathbf{v}-\\bar v\\rVert^2}{n}",
  "10.4": "\\operatorname{Cov}(\\mathbf{a},\\mathbf{b}) = \\frac{(\\mathbf{a}-\\bar a)\\cdot(\\mathbf{b}-\\bar b)}{n}",
  "11.1": "\\operatorname{lerp}(\\mathbf{a},\\mathbf{b},t) = (1-t)\\,\\mathbf{a} + t\\,\\mathbf{b}",
  "11.2": "\\operatorname{slerp}(\\mathbf{a},\\mathbf{b},t) = \\frac{\\sin((1-t)\\Omega)}{\\sin\\Omega}\\,\\mathbf{a} + \\frac{\\sin(t\\Omega)}{\\sin\\Omega}\\,\\mathbf{b}",
  "11.3": "\\begin{bmatrix}x'\\\\ y'\\end{bmatrix} = \\begin{bmatrix}\\cos t & -\\sin t\\\\ \\sin t & \\cos t\\end{bmatrix}\\begin{bmatrix}x\\\\ y\\end{bmatrix}",
  "11.4": "\\operatorname{reflect}(\\mathbf{v}) = 2(\\mathbf{v}\\cdot\\mathbf{u})\\,\\mathbf{u} - \\mathbf{v}",
  "12.1": "\\lVert\\mathbf{a}+\\mathbf{b}\\rVert \\;\\le\\; \\lVert\\mathbf{a}\\rVert + \\lVert\\mathbf{b}\\rVert",
  "12.2": "|\\,\\mathbf{a}\\cdot\\mathbf{b}\\,| \\;\\le\\; \\lVert\\mathbf{a}\\rVert\\,\\lVert\\mathbf{b}\\rVert",
  "13.1": "\\text{best} = \\arg\\max_i \\cos(\\mathbf{q},\\mathbf{item}_i)",
  "13.2": "\\mathbf{king} - \\mathbf{man} + \\mathbf{woman} \\approx \\mathbf{queen}",
  "13.3": "\\operatorname{softmax}(\\mathbf{v})_i = \\frac{e^{v_i}}{\\sum_j e^{v_j}}",
  "13.4": "\\mathbf{s} = \\frac{1}{k}\\sum_{w}\\operatorname{vec}(w)",
  "14.1": "(M\\mathbf{v})_i = \\sum_j M_{ij}\\,v_j",
  "14.2": "(MN)_{ij} = \\sum_k M_{ik}\\,N_{kj}",
  "14.3": "(M^{\\top})_{ij} = M_{ji}",
  "14.4": "I\\mathbf{v} = \\mathbf{v}",
  "14.5": "\\det\\!\\begin{bmatrix}a & b\\\\ c & d\\end{bmatrix} = ad - bc",
  "14.6": "\\begin{bmatrix}a & b\\\\ c & d\\end{bmatrix}^{-1} = \\frac{1}{ad-bc}\\begin{bmatrix}d & -b\\\\ -c & a\\end{bmatrix}",
  "14.7": "\\mathbf{a}\\cdot\\mathbf{b} = \\mathbf{a}^{\\top}\\mathbf{b}",
  "14.8": "\\operatorname{tr}(M) = \\sum_i M_{ii}",
  "14.9": "\\operatorname{rank}(M) = \\#\\,\\text{independent rows (or columns)}",
  "14.10": "M\\mathbf{v} = \\lambda\\,\\mathbf{v}",
  "14.11": "M = U\\,\\Sigma\\,V^{\\top}",
  "14.12": "C = \\frac{1}{n}\\,X_c^{\\top} X_c",
  "14.13": "Q^{\\top} Q = I",
  "14.14": "\\mathbf{u}_k = \\mathbf{v}_k - \\sum_{j<k}\\operatorname{proj}_{\\mathbf{u}_j}\\mathbf{v}_k",
  "14.15": "\\lVert M\\rVert_F = \\sqrt{\\textstyle\\sum_{i,j} M_{ij}^2}",
  "14.16": "G_{ij} = \\mathbf{v}_i\\cdot\\mathbf{v}_j",
  "15.1": "\\nabla f = \\left[\\frac{\\partial f}{\\partial x_1},\\; \\frac{\\partial f}{\\partial x_2},\\; \\dots\\right]",
  "15.2": "f(\\mathbf{w}) = \\mathbf{w}\\cdot\\mathbf{x} \\;\\Rightarrow\\; \\nabla_{\\mathbf{w}} f = \\mathbf{x}",
  "15.3": "f(\\mathbf{v}) = \\lVert\\mathbf{v}\\rVert^2 \\;\\Rightarrow\\; \\nabla f = 2\\,\\mathbf{v}",
  "15.4": "f(\\mathbf{v}) = \\lVert\\mathbf{v}\\rVert \\;\\Rightarrow\\; \\nabla f = \\frac{\\mathbf{v}}{\\lVert\\mathbf{v}\\rVert}",
  "15.5": "D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u}",
  "15.6": "J_{ij} = \\frac{\\partial f_i}{\\partial x_j}",
  "15.7": "\\frac{d}{dx} f(g(x)) = f'(g(x))\\,g'(x)",
  "15.8": "\\mathbf{w}_{\\text{new}} = \\mathbf{w} - \\eta\\,\\nabla f",
  "16.1": "d_M(\\mathbf{a},\\mathbf{b}) = \\sqrt{(\\mathbf{a}-\\mathbf{b})^{\\top}\\,\\Sigma^{-1}\\,(\\mathbf{a}-\\mathbf{b})}",
  "16.2": "J(A,B) = \\frac{|A \\cap B|}{|A \\cup B|}",
  "16.3": "d_H(\\mathbf{a},\\mathbf{b}) = \\#\\{\\,i : a_i \\ne b_i\\,\\}",
  "16.4": "d_{\\text{edit}}(s,t) = \\min\\ \\#\\,\\text{insert/delete/substitute ops}",
  "16.5": "K(\\mathbf{a},\\mathbf{b}) = \\mathbf{a}\\cdot\\mathbf{b}",
  "16.6": "K(\\mathbf{a},\\mathbf{b}) = (\\mathbf{a}\\cdot\\mathbf{b} + c)^d",
  "16.7": "K(\\mathbf{a},\\mathbf{b}) = \\exp\\!\\left(-\\frac{\\lVert\\mathbf{a}-\\mathbf{b}\\rVert^2}{2\\sigma^2}\\right)",
  "17.1": "\\operatorname{softmax}(\\mathbf{v})_i = \\frac{e^{v_i}}{\\sum_j e^{v_j}}",
  "17.2": "H(p) = -\\sum_i p_i \\ln p_i",
  "17.3": "H(p,q) = -\\sum_i p_i \\ln q_i",
  "17.4": "D_{\\mathrm{KL}}(p \\parallel q) = \\sum_i p_i \\ln\\frac{p_i}{q_i}",
  "17.5": "\\mathbb{E}[X] = \\mathbf{p}\\cdot\\mathbf{values} = \\sum_i p_i\\,\\text{value}_i",
};

/* ---------- drills data (1,395 questions) keyed by formula id ---------- */
let DRILLS = {};
try {
  DRILLS = JSON.parse(fs.readFileSync(path.join(ROOT, "lessons", "vector-drills-data.json"), "utf8"));
} catch (e) {
  console.warn("WARNING: lessons/vector-drills-data.json not found — run tools/gen-vector-drills.py first. Examples will be omitted.");
}

/* ---------- theme-aware tokenizer for the plain-text formula code ---------- */
const KEYWORDS = new Set(["where", "order", "does", "not", "matter", "never", "negative",
  "the", "of", "for", "each", "word", "in", "either", "both", "size", "count", "positions",
  "and", "add", "up", "to", "goes", "with", "min", "insert", "delete", "substitute", "ops",
  "a", "b", "how", "far", "reaches", "along", "direction", "mean", "outcome", "under",
  "row", "column", "its", "columns", "are", "unit", "length", "mutually", "perpendicular",
  "center", "data", "eigenvectors", "principal", "directions", "most", "variance", "first",
  "covariance", "area", "parallelogram", "subtract", "average", "entries", "own", "value"]);
const FUNCS = new Set(["norm", "sqrt", "dot", "cos", "sin", "tan", "arccos", "exp", "log", "ln",
  "max", "min", "abs", "mean", "cosine", "cosine_distance", "angle", "distance", "distance_L1",
  "distance_Linf", "distance_Lp", "lerp", "slerp", "reflect", "proj", "projection_length",
  "softmax", "outer", "det", "inverse", "transpose", "trace", "rank", "Jaccard", "Hamming",
  "variance", "covariance", "correlation", "sentence_vector", "word_vector", "vec", "K", "H",
  "KL", "Var", "Cov"]);
function tokenize(src) {
  const re = /(\s+)|(-?\d+\.?\d*)|([A-Za-z_][A-Za-z0-9_]*)|(<=>|<->|->|<=|>=|!=|\|\||[=+\-*/^<>|~.])|([\[\]{}(),;])|(.)/g;
  let out = "", m;
  while ((m = re.exec(src)) !== null) {
    if (m[1]) { out += m[1]; }
    else if (m[2]) { out += '<span class="tk-num">' + esc(m[2]) + "</span>"; }
    else if (m[3]) {
      const w = m[3];
      const after = src.slice(re.lastIndex).match(/^\s*\(/);
      let cls = "tk-id";
      if (FUNCS.has(w) || (after && /^[A-Za-z_]/.test(w))) cls = "tk-fn";
      else if (KEYWORDS.has(w.toLowerCase())) cls = "tk-kw";
      out += '<span class="' + cls + '">' + esc(w) + "</span>";
    }
    else if (m[4]) { out += '<span class="tk-op">' + esc(m[4]) + "</span>"; }
    else if (m[5]) { out += '<span class="tk-punc">' + esc(m[5]) + "</span>"; }
    else { out += esc(m[6]); }
  }
  return out;
}
function unesc(s) { return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"); }
// Replace every <pre><code class="language-…">…</code></pre> with a theme-aware,
// syntax-highlighted <pre class="fcode"> (no <code>, so the app's hljs pass skips it).
function themeCode(html) {
  return html.replace(/<pre><code class="language-[^"]*">([\s\S]*?)<\/code><\/pre>/g,
    (m, body) => '<pre class="fcode">' + tokenize(unesc(body)) + "</pre>");
}

/* ---------- render the 15 collapsible practice examples for one formula ---------- */
function drillsHtml(fid) {
  const d = DRILLS[fid];
  if (!d) return "";
  const levelLabel = { basic: "Basic", easy: "Easy", advanced: "Advanced" };
  let items = "";
  ["basic", "easy", "advanced"].forEach((lvl) => {
    (d[lvl] || []).forEach((p, i) => {
      const steps = (p.steps || []).map((s) => '<li><div class="do">' + esc(s) + "</div></li>").join("");
      items +=
        '<div class="problem">' +
          '<div class="qrow"><span class="qnum">' + levelLabel[lvl][0] + (i + 1) + "</span>" +
          '<div class="qtext">' + esc(p.q) + "</div></div>" +
          '<button class="reveal" onclick="this.closest(\'.problem\').classList.toggle(\'open\'); App.typeset(this.closest(\'.problem\'));">Show step-by-step solution ▾</button>' +
          '<div class="solution"><ol class="solsteps">' + steps + "</ol>" +
          '<div class="finalans">✅ Answer: ' + esc(p.answer) + "</div></div>" +
        "</div>";
    });
  });
  return '<details class="fmla-drills"><summary>Practice — 15 questions ' +
    "(5 basic · 5 easy · 5 advanced)</summary>" + items + "</details>";
}

/* ---------- build one Part page: intro + per-formula (latex + code + drills) ---------- */
// Also collects a compact reference entry per formula into REF (for the all-in-one page).
const REF = [];
function buildPartHtml(chunk, partTitle) {
  // drop the "# Part …" H1 line (used as the lesson title elsewhere)
  const body = chunk.replace(/^#\s+.*(\r?\n)?/, "");
  // split into the intro (before the first "## X.Y") and each formula subsection
  const parts = body.split(/\n(?=##\s+\d+\.\d+\s)/);
  let html = "";
  parts.forEach((seg, idx) => {
    const mh = seg.match(/^##\s+(\d+\.\d+)\s+(.*)$/m);
    if (idx === 0 && !mh) { html += themeCode(convert(seg).html); return; } // intro prose
    if (!mh) { html += themeCode(convert(seg).html); return; }
    const fid = mh[1];
    const name = mh[2].trim();
    // first fenced code line = the plain-text form of this formula (for the reference page)
    const cm = seg.match(/```[a-z]*\n([^\n]*)/);
    REF.push({ part: partTitle, fid: fid, name: name, latex: LATEX[fid] || "", code: cm ? cm[1].trim() : "" });
    let sub = themeCode(convert(seg).html);
    // inject the LaTeX display right after this formula's <h2> heading
    if (LATEX[fid]) {
      sub = sub.replace(/(<h2>[\s\S]*?<\/h2>)/, '$1\n<div class="fmla-latex">$$$$' + LATEX[fid] + '$$$$</div>');
    }
    // append the 15 collapsible practice examples
    sub += drillsHtml(fid);
    html += sub;
  });
  return html;
}

/* ---------- math-track reference: every display equation from every math lesson ---------- */
function collectStrings(o, acc) {
  if (o == null) return;
  if (typeof o === "string") { acc.push(o); return; }
  if (Array.isArray(o)) { o.forEach((x) => collectStrings(x, acc)); return; }
  if (typeof o === "object") { for (const k in o) collectStrings(o[k], acc); }
}
function mathTrackRefHtml() {
  const dir = path.join(ROOT, "lessons");
  const files = fs.readdirSync(dir).filter((f) => /^math-\d\d-.*\.js$/.test(f) && f !== path.basename(OUT)).sort();
  let html = "<p>Every <strong>display formula</strong> from every lesson in the Math track, " +
    "grouped by topic and then by the lesson it appears in. This is a lookup index — open the " +
    "lesson itself for the full explanation.</p>";
  let nTopics = 0, nFormulas = 0;
  files.forEach((f) => {
    const sandbox = { window: { LESSONS: [] } };
    try { require("vm").runInNewContext(fs.readFileSync(path.join(dir, f), "utf8"), sandbox); }
    catch (e) { console.warn("skip " + f + ": " + e.message); return; }
    const lessons = sandbox.window.LESSONS;
    if (!lessons || !lessons.length) return;
    const topic = lessons[0].module || f;
    // collect (title -> [equations]) preserving lesson order
    const rows = [];
    lessons.forEach((l) => {
      const acc = []; collectStrings(l, acc);
      const blob = acc.join("\n");
      const seen = new Set(), eqs = [];
      let m; const re = /\$\$([\s\S]*?)\$\$/g;
      while ((m = re.exec(blob)) !== null) {
        const eq = m[1].trim();
        if (eq && !seen.has(eq)) { seen.add(eq); eqs.push(eq); }
      }
      if (eqs.length) rows.push({ title: l.title || "", eqs: eqs });
    });
    if (!rows.length) return;
    nTopics++;
    html += "<h2>" + esc(topic) + "</h2>";
    rows.forEach((r) => {
      html += '<div class="ref-item"><div class="ref-name">' + esc(r.title) + "</div>";
      r.eqs.forEach((eq) => { nFormulas++; html += '<div class="fmla-latex">$$' + eq + "$$</div>"; });
      html += "</div>";
    });
  });
  console.log("  math-track reference: " + nFormulas + " display formulas across " + nTopics + " topics");
  return html;
}

/* ---------- the all-in-one reference page: every formula, grouped by section ---------- */
function referenceHtml() {
  let html = "<p>Every formula in this section on one page, grouped by topic — no examples, " +
    "just the name and the formula. Use it as a quick lookup or a printable cheat sheet.</p>";
  let curPart = "";
  REF.forEach((r) => {
    if (r.part !== curPart) { html += "<h2>" + esc(r.part) + "</h2>"; curPart = r.part; }
    html += '<div class="ref-item"><div class="ref-name">' + esc(r.fid) + " · " + esc(r.name) + "</div>";
    if (r.latex) html += '<div class="fmla-latex">$$' + r.latex + "$$</div>";
    if (r.code) html += '<pre class="fcode">' + tokenize(r.code) + "</pre>";
    html += "</div>";
  });
  return html;
}



/* ---------- split the source into sections and build lessons ---------- */
const raw = fs.readFileSync(SRC, "utf8");
// Split before every top-level "# " heading (intro, each "# Part N", "# The through-line").
const chunks = raw.split(/\n(?=# )/).map((c) => c.trim()).filter(Boolean);

const lessons = [];
chunks.forEach((chunk) => {
  const h1 = (chunk.match(/^#\s+(.*)$/m) || [, ""])[1].trim();
  if (/^Vector Math Formulas/i.test(h1)) {
    lessons.push({ key: "00", title: "Overview & how to read", html: themeCode(convert(chunk).html) });
  } else if (/^Part\s+(\d+)/i.test(h1)) {
    const n = h1.match(/^Part\s+(\d+)/i)[1].padStart(2, "0");
    lessons.push({ key: n, title: h1, html: buildPartHtml(chunk, h1) });
  } else if (/through-line/i.test(h1)) {
    lessons.push({ key: "97", title: "The through-line", html: "<h3>" + esc(h1) + "</h3>" + themeCode(convert(chunk).html) });
  }
});

// All-in-one reference page (built after every Part has populated REF). Key "00b" sorts it
// right after the Overview and before Part 1.
lessons.push({ key: "00b", title: "All formulas — quick reference", html: referenceHtml() });

// Every display formula from every lesson in the whole Math track (all 27 topics).
lessons.push({ key: "00c", title: "All math-lesson formulas (every topic)", html: mathTrackRefHtml() });

// Practice-drills links page (points at the generated drills + self-checking notebook).
const colab = "https://colab.research.google.com/github/" + REPO + "/blob/main/afp/notebooks/vector-math-drills.ipynb";
const nbGh = "https://github.com/" + REPO + "/blob/main/afp/notebooks/vector-math-drills.ipynb";
const drillsGh = "https://github.com/" + REPO + "/blob/main/vector-math-drills.md";
lessons.push({
  key: "98",
  title: "Practice drills (1,395 questions)",
  html:
    "<p>Every formula on these pages already shows its <strong>15 practice questions</strong> " +
    "(5 basic, 5 easy, 5 advanced) with collapsible step-by-step solutions — " +
    "<strong>1,395 in total</strong>. You can also work them in a notebook:</p>" +
    "<ul>" +
    '<li><a href="' + colab + '">Open the self-checking notebook in Colab</a> ' +
    "(recomputes and asserts every answer).</li>" +
    '<li><a href="' + nbGh + '">View the notebook on GitHub</a>.</li>' +
    '<li><a href="' + drillsGh + '">Read all 1,395 questions and solutions (Markdown)</a>.</li>' +
    "</ul>",
});


// Order: Overview, Part 01..17, through-line, practice.
lessons.sort((a, b) => a.key.localeCompare(b.key));

const data = lessons.map((l, i) => ({
  id: "formula-" + l.key,
  title: l.title,
  module: "Formulas",
  superGroup: "Math",
  template: "formulas",
  meta: "Math · Vector, matrix &amp; ML formula reference",
  prevId: i > 0 ? "formula-" + lessons[i - 1].key : "",
  nextId: i < lessons.length - 1 ? "formula-" + lessons[i + 1].key : "",
  html: l.html,
}));

const banner = "/* AUTO-GENERATED by tools/gen-formulas-lessons.js from vector-math-formulas.md — do not edit by hand. */\n";
const js = banner +
  "(function () {\n" +
  "  var L = (window.LESSONS = window.LESSONS || []);\n" +
  "  var data = " + JSON.stringify(data, null, 0) + ";\n" +
  "  data.forEach(function (o) { L.push(o); });\n" +
  "})();\n";
fs.writeFileSync(OUT, js);
console.log("wrote lessons/math-00-formulas.js  (" + data.length + " lessons, " + (js.length / 1024).toFixed(0) + " KB)");
data.forEach((d) => console.log("  " + d.id + "  —  " + d.title));
