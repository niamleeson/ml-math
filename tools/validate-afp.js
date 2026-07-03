/* Validates authored AFP modules against the AFP track spec.
   Usage: node tools/validate-afp.js            (all authored modules)
          node tools/validate-afp.js 7          (only M7)
   Checks schema completeness, 5 practice / >=6 applications / >=3 takeaways,
   AFP extras (skipIf, mapsTo, resources, papers, notebook), no italics/emoji,
   balanced $, and the notebook contract (>=10 cells, an assert, a $…$ md cell,
   one statement per line). */
"use strict";
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "afp-authored");

const EMOJI = /[\u2705\u274C\u2714\u2713\u26A0\u2757\u2728\uD83D\uD83C\uD83E]/;
const ITALIC = /<i>|<\/i>|<em>|<\/em>/;
const oddDollars = (s) => (String(s || "").replace(/\\\$/g, "").match(/\$/g) || []).length % 2 === 1;

function scanStrings(obj, p, bag) {
  if (typeof obj === "string") {
    if (ITALIC.test(obj)) bag.push(`italic@${p}`);
    if (EMOJI.test(obj)) bag.push(`emoji@${p}`);
    if (oddDollars(obj)) bag.push(`unclosed-$@${p}`);
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => scanStrings(v, `${p}[${i}]`, bag));
  } else if (obj && typeof obj === "object") {
    for (const k of Object.keys(obj)) scanStrings(obj[k], `${p}.${k}`, bag);
  }
}
function stripStr(line) { return line.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''").split("#")[0]; }

// Arg can be: a single authored .js file (isolated check), or a module number, or nothing (all).
const arg = process.argv[2];
let files;
if (arg && arg.endsWith(".js")) files = [path.resolve(arg)];
else files = fs.readdirSync(SRC).filter(f => /\.js$/.test(f)).sort().map(f => path.join(SRC, f));
let mods = [];
files.forEach(f => { mods = mods.concat(require(f)); });
const only = (arg && /^\d+$/.test(arg)) ? parseInt(arg, 10) : null;
if (only) mods = mods.filter(m => m.m === only);

let problems = [];
const seen = new Set();
for (const l of mods.sort((a, b) => a.m - b.m)) {
  const errs = [];
  const tag = `M${l.m}`;
  if (l.m == null || l.m < 1 || l.m > 28) errs.push(`bad m=${l.m}`);
  if (l.domain == null || l.domain < 0 || l.domain > 6) errs.push(`bad domain=${l.domain}`);
  if (seen.has(l.m)) errs.push(`duplicate module number`);
  seen.add(l.m);

  for (const f of ["title", "tagline", "skipIf", "mapsTo", "connections", "motivation",
    "definition", "worked", "practice", "applications", "applicationsClose", "takeaways",
    "resources", "papers", "notebook"]) {
    if (l[f] === undefined) errs.push(`missing ${f}`);
  }
  if (!Array.isArray(l.mapsTo) || !l.mapsTo.length) errs.push("mapsTo empty");
  const c = l.connections || {};
  for (const k of ["buildsOn", "leadsTo", "usedWith"]) if (!Array.isArray(c[k]) || !c[k].length) errs.push(`connections.${k} empty`);
  const w = l.worked || {};
  if (!w.problem) errs.push("worked.problem missing");
  if (!Array.isArray(w.steps) || w.steps.length < 2) errs.push("worked.steps <2");
  (w.steps || []).forEach((s, i) => { if (!s.do || !s.result) errs.push(`worked.steps[${i}] missing do/result`); });
  if (!w.answer) errs.push("worked.answer missing");
  if (!Array.isArray(l.practice) || l.practice.length !== 5) errs.push(`practice.length=${(l.practice || []).length} (want 5)`);
  (l.practice || []).forEach((p, i) => {
    if (!p.problem) errs.push(`practice[${i}].problem missing`);
    if (!Array.isArray(p.steps) || p.steps.length < 2) errs.push(`practice[${i}].steps <2`);
    if (!p.answer) errs.push(`practice[${i}].answer missing`);
  });
  if (!Array.isArray(l.applications) || l.applications.length < 6) errs.push(`applications.length=${(l.applications || []).length} (want >=6)`);
  (l.applications || []).forEach((a, i) => {
    if (!a.title) errs.push(`applications[${i}].title missing`);
    if (!a.numbers) errs.push(`applications[${i}].numbers missing`);
  });
  if (!Array.isArray(l.takeaways) || l.takeaways.length < 3) errs.push("takeaways <3");
  if (!Array.isArray(l.resources) || !l.resources.length) errs.push("resources empty");
  (l.resources || []).forEach((r, i) => { if (!r.label) errs.push(`resources[${i}].label missing`); });
  if (!Array.isArray(l.papers)) errs.push("papers not array");

  // notebook contract (mirrors tools/check_nb.js)
  const nb = l.notebook || [];
  if (!Array.isArray(nb) || nb.length < 10) errs.push(`notebook cells=${nb.length} (want >=10)`);
  const codeSrc = nb.filter(x => x.t === "code").map(x => x.src || "").join("\n");
  const mdSrc = nb.filter(x => x.t === "md").map(x => x.src || "").join("\n");
  if (!/\bassert\b/.test(codeSrc)) errs.push("notebook: no assert");
  if (!(/\$[^$]+\$/.test(mdSrc) || /\$\$[\s\S]+\$\$/.test(mdSrc))) errs.push("notebook: no $…$ math cell");
  nb.forEach((cell, ci) => {
    if (cell.t !== "code") return;
    String(cell.src || "").split("\n").forEach(raw => {
      let bare = stripStr(raw).replace(/\s+$/, "");
      const inner = bare.endsWith(";") ? bare.slice(0, -1) : bare;
      if (inner.includes(";")) errs.push(`notebook cell[${ci}] dense line: ${raw.trim().slice(0, 50)}`);
    });
  });

  const bag = []; scanStrings(l, tag, bag); errs.push(...bag);
  if (errs.length) problems.push(`${tag} "${l.title || "?"}":\n   - ${errs.join("\n   - ")}`);
}

console.log(`Checked ${mods.length} AFP module(s)${only ? " (M" + only + ")" : ""}.`);
if (problems.length) { console.log(`\nPROBLEMS (${problems.length}):\n` + problems.join("\n")); process.exit(1); }
console.log("All authored AFP modules valid.");

// Also run the LaTeX backslash / currency scan so a single command gates both.
try {
  const args = process.argv[2] ? [JSON.stringify(process.argv[2])] : [];
  require("child_process").execSync(`node ${JSON.stringify(path.join(__dirname, "scan-afp-latex.js"))} ${args.join(" ")}`.trim(), { stdio: "inherit" });
} catch (e) {
  process.exit(1);
}
