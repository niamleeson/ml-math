/* Fixes the single-backslash LaTeX bug in tools/afp-authored/*.js.
   In a JS string "\sigma" is "sigma" at runtime (backslash dropped) and "\frac"
   becomes formfeed+"rac"; MathJax then renders garbage. Correct source doubles it:
   "\\sigma". This doubles a LONE backslash ONLY when it is immediately followed by a
   known LaTeX macro name (allowlist), so intentional "\n" line breaks in notebook
   source are preserved: a newline before "under..." captures "nunder", not a macro.

   Usage: node tools/fix-afp-latex.js [tools/afp-authored/<file>.js ...]   (default: all)
   Idempotent: already-doubled "\\sigma" is left untouched. */
"use strict";
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "afp-authored");

const MACROS = new Set([
  // Greek (lower + upper)
  "alpha","beta","gamma","delta","epsilon","varepsilon","zeta","eta","theta","vartheta",
  "iota","kappa","lambda","mu","nu","xi","pi","varpi","rho","varrho","sigma","varsigma",
  "tau","upsilon","phi","varphi","chi","psi","omega",
  "Gamma","Delta","Theta","Lambda","Xi","Pi","Sigma","Upsilon","Phi","Psi","Omega",
  // functions / operators
  "log","ln","exp","sin","cos","tan","cot","sec","csc","sinh","cosh","tanh",
  "arcsin","arccos","arctan","lim","limsup","liminf","sup","inf","max","min","arg",
  "deg","det","dim","gcd","hom","ker","Pr","bmod","pmod",
  // big operators
  "sum","prod","int","iint","iiint","oint","coprod","bigcup","bigcap","bigoplus",
  "bigotimes","bigvee","bigwedge","bigsqcup",
  // relations
  "leq","geq","neq","le","ge","ne","equiv","sim","simeq","cong","approx","propto",
  "ll","gg","subset","supset","subseteq","supseteq","subsetneq","in","ni","notin",
  "mid","parallel","perp","asymp","doteq","models","prec","succ","preceq","succeq",
  // logic / quantifiers
  "forall","exists","nexists","neg","lnot","land","lor","implies","iff","therefore","because",
  // arrows
  "to","gets","rightarrow","leftarrow","leftrightarrow","Rightarrow","Leftarrow",
  "Leftrightarrow","mapsto","longrightarrow","longleftarrow","hookrightarrow","rightleftharpoons",
  // delimiters / dots
  "langle","rangle","lfloor","rfloor","lceil","rceil","lvert","rvert","lVert","rVert",
  "cdot","cdotp","cdots","ldots","vdots","ddots","dots","dotsc","dotsb",
  // binary ops / sets
  "times","div","pm","mp","ast","star","circ","bullet","oplus","ominus","otimes","odot",
  "cap","cup","sqcap","sqcup","wedge","vee","setminus","smallsetminus","triangleq",
  // accents / fonts
  "hat","widehat","bar","overline","underline","overbrace","underbrace","vec","tilde",
  "widetilde","dot","ddot","check","breve","acute","grave","mathring",
  "mathbb","mathbf","mathcal","mathrm","mathsf","mathtt","mathit","mathfrak","boldsymbol",
  "bm","bold","text","textbf","textit","textrm","texttt","textsf","operatorname","substack",
  // structure / misc
  "frac","dfrac","tfrac","cfrac","binom","dbinom","tbinom","sqrt","partial","nabla","infty",
  "emptyset","varnothing","ell","Re","Im","top","bot","angle","triangle","square","diamond",
  "prime","nabla","aleph","hbar","imath","jmath","wp","Delta","surd",
  // spacing / sizing / env
  "quad","qquad","left","right","big","Big","bigg","Bigg","bigl","bigr","Bigl","Bigr",
  "begin","end","atop","choose","overset","underset","stackrel","phantom","mathstrut",
  // stats shorthands authors may use
  "mathbbm","mathbf","operatorname","argmax","argmin","softmax","sign","median","mode",
  "var","cov","corr","tr","diag","rank","span","Var","Cov","Corr","Tr","KL"
]);

function fixText(text) {
  let count = 0;
  const out = text.replace(/(?<!\\)\\([A-Za-z]+)/g, (mm, name) => {
    if (MACROS.has(name)) { count++; return "\\" + mm; }
    return mm;
  });
  return { out, count };
}

let files = process.argv.slice(2);
if (!files.length) files = fs.readdirSync(SRC).filter(f => /\.js$/.test(f)).sort().map(f => path.join(SRC, f));

let grand = 0;
files.forEach(f => {
  const p = path.resolve(f);
  const before = fs.readFileSync(p, "utf8");
  const { out, count } = fixText(before);
  if (count) fs.writeFileSync(p, out);
  grand += count;
  console.log(`${count ? "fixed" : "ok   "} ${path.basename(p).padEnd(26)} ${count} backslash(es) doubled`);
});
console.log(`\nTotal: ${grand} backslash(es) doubled across ${files.length} file(s).`);
