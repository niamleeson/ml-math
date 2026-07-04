/* Detects LaTeX macros that lost their backslash at RUNTIME — the classic
   "single backslash in a JS string" bug (JS drops "\s" etc., so "$\\sigma$"
   authored as "$\sigma$" reaches MathJax as "$sigma$" and renders broken).

   Scans every $…$ / $$…$$ span in every authored string field (lesson text
   AND notebook cell src). Correctly-backslashed macros (runtime "\sigma") pass;
   bare ones (runtime "sigma") fail. Legit literal text in \text{…}/\operatorname{…}
   and subscript labels like p_{log} are excluded.

   Usage: node tools/scan-afp-latex.js [tools/afp-authored/<file>.js | <m>]
   Exit 1 if any issue. Fix each by DOUBLING the backslash in the source
   ("\sigma" -> "\\sigma"); never touch already-doubled "\\sigma". */
"use strict";
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "afp-authored");

// GROUP A — long, unambiguous macros that are never substrings of common words or
// other macros. Guard only against a preceding backslash (so "w\approx" -> "wapprox"
// is still caught). Longer alternatives first so "cdots" wins over "cdot".
const A = ["approx","cdots","cdotp","cdot","ldots","times","dfrac","tfrac","frac","sqrt",
  "nabla","partial","infty","varepsilon","epsilon","sigma","alpha","gamma","delta","theta",
  "lambda","omega","beta","langle","rangle","mathbf","mathbb","mathcal","mathrm","mathsf",
  "boldsymbol","leq","geq","neq","propto","equiv","forall","exists","operatorname","overline",
  "underline","widehat","widetilde","otimes","oplus","bigcup","bigcap","sum","prod","mapsto",
  "rightarrow","leftarrow"];
// Group A matches a macro not immediately preceded by a backslash. Suffix-collisions
// (e.g. "epsilon" inside "\varepsilon") are filtered in scan() via backslashedWord().
const reA = new RegExp("(?<!\\\\)(" + A.join("|") + ")(?![a-z])", "g");
// GROUP B — short / substring-prone macros (Greek 2-3 letters, function names,
// relations). Guard against a preceding letter too ("\min" -> the inner "in" is not
// flagged) and a trailing letter. Subscript/superscript labels (p_{log}) are skipped.
const B = ["sinh","cosh","tanh","varphi","zeta","kappa","iota","ddot","tilde","dots",
  "log","ln","exp","max","min","det","dim","sin","cos","tan","sec","csc","cot","lim","sup",
  "inf","arg","deg","gcd","hat","bar","vec","dot","top","bot","int","oint","mid","phi","psi",
  "chi","rho","tau","nu","xi","mu","pi","eta","le","ge","ne","in","to"];
const reB = new RegExp("(?<!\\\\)(" + B.join("|") + ")(?![A-Za-z])", "g");
const TEXTWRAP = /\\(?:text|operatorname|mathrm|mathit|mathsf|mathtt|textbf|textrm|textit)\s*\{[^{}]*\}/g;

// A macro match at index `i` is legitimate (not a dropped backslash) when the
// contiguous letter-run it belongs to is introduced by a backslash — i.e. it is
// really "\varepsilon" (so the inner "epsilon" is fine) rather than a bare "wapprox".
function backslashedWord(span, i) {
  let k = i;
  while (k > 0 && /[A-Za-z]/.test(span[k - 1])) k--;
  return span[k - 1] === "\\";
}

function mathSpans(s) {
  const masked = String(s).replace(/\\\$/g, "  ");   // escaped \$ is a literal dollar, not a delimiter
  const out = [];
  const re = /\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g;
  let m;
  while ((m = re.exec(masked))) out.push(m[1] != null ? m[1] : m[2]);
  return out;
}
function scan(val, p, bag) {
  if (typeof val === "string") {
    // Currency hazard: a bare "$" (MathJax inline delimiter) used for money turns the
    // text up to the next "$" into math. Two reliable signals: (1) odd count of inline
    // "$" in the field, (2) a "$…$" span full of prose. Fix money as "\\$" (renders "$").
    const noDisp = val.replace(/\\\$/g, "").replace(/\$\$[\s\S]*?\$\$/g, "");
    if (((noDisp.match(/\$/g) || []).length) % 2 === 1) {
      bag.push(`${p}: odd number of unescaped "$" (unclosed math or currency $ — escape money as \\\\$)`);
    }
    mathSpans(val).forEach(raw => {
      const stripped = raw.replace(TEXTWRAP, "  ");
      if (/[a-z]{3,}(?:\s+[a-z]{3,}){1,}/.test(stripped.replace(/\\[A-Za-z]+/g, " "))) {
        bag.push(`${p}: prose inside a "$…$" math span (unescaped currency $? use \\\\$): "${raw.slice(0, 46)}"`);
      }
      // A control char inside a math span means a backslash-escape macro broke:
      // \b->\x08  \t->\x09  \v->\x0b  \f->\x0c  \r->\x0d  (so \bar,\theta,\frac,\rho,...).
      if (/[\u0008\u0009\u000b\u000c\u000d]/.test(raw)) {
        const shown = raw.replace(/[\u0008\u0009\u000b\u000c\u000d]/g, "<CTRL>").slice(0, 40);
        bag.push(`${p}: control char from a broken \\t/\\b/\\f/\\r/\\v macro (e.g. \\frac,\\bar,\\theta,\\times,\\top,\\tau,\\rho): "${shown}"`);
      }
      const span = raw.replace(TEXTWRAP, "  ");
      let m;
      reA.lastIndex = 0;
      while ((m = reA.exec(span))) {
        if (backslashedWord(span, m.index)) continue;
        bag.push(`${p}: bare "${m[1]}" (want \\\\${m[1]}) in "...${span.slice(Math.max(0, m.index - 6), m.index + m[1].length + 3)}..."`);
      }
      reB.lastIndex = 0;
      while ((m = reB.exec(span))) {
        if (span[m.index - 1] === "{" && (span[m.index - 2] === "_" || span[m.index - 2] === "^")) continue;
        if (backslashedWord(span, m.index)) continue;
        bag.push(`${p}: bare "${m[1]}" (want \\\\${m[1]}) in "...${span.slice(Math.max(0, m.index - 6), m.index + m[1].length + 3)}..."`);
      }
    });
  } else if (Array.isArray(val)) {
    val.forEach((v, i) => scan(v, `${p}[${i}]`, bag));
  } else if (val && typeof val === "object") {
    for (const k of Object.keys(val)) scan(val[k], `${p}.${k}`, bag);
  }
}

const arg = process.argv[2];
let files;
if (arg && arg.endsWith(".js")) files = [path.resolve(arg)];
else files = fs.readdirSync(SRC).filter(f => /\.js$/.test(f)).sort().map(f => path.join(SRC, f));
let mods = [];
files.forEach(f => { mods = mods.concat(require(f)); });
const only = (arg && /^\d+$/.test(arg)) ? parseInt(arg, 10) : null;
if (only) mods = mods.filter(m => m.m === only);

let total = 0;
mods.sort((a, b) => a.m - b.m).forEach(mm => {
  const bag = [];
  scan(mm, `M${mm.m}`, bag);
  if (bag.length) {
    total += bag.length;
    console.log(`M${mm.m} "${mm.title}" — ${bag.length} LaTeX backslash issue(s):`);
    bag.forEach(b => console.log("   " + b));
  }
});
if (total) { console.log(`\n${total} LaTeX backslash issue(s). Double the backslash in each (\\sigma -> \\\\sigma).`); process.exit(1); }
console.log(`No LaTeX backslash issues in ${mods.length} module(s).`);
