/* Validates authored math lessons against the spec. Usage: node tools/validate-math.js [topicPrefix] */
"use strict";
const A = require("./math-authored.js");
const prefix = process.argv[2] || "math-01-";
const FORBIDDEN_FIELDS = ["hints", "mistakes", "difficulty", "demo", "tier", "prereqs"];
const EMOJI = /[\u2705\u274C\u2714\u2713\u26A0\u2757\u2728\uD83D\uD83C\uD83E]/;
const ITALIC = /<i>|<\/i>|<em>|<\/em>/;

function scanStrings(obj, path, bag) {
  if (typeof obj === "string") {
    if (ITALIC.test(obj)) bag.push(`italic@${path}`);
    if (EMOJI.test(obj)) bag.push(`emoji@${path}`);
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => scanStrings(v, `${path}[${i}]`, bag));
  } else if (obj && typeof obj === "object") {
    for (const k of Object.keys(obj)) scanStrings(obj[k], `${path}.${k}`, bag);
  }
}

let problems = [];
const ids = Object.keys(A).filter(id => id.startsWith(prefix)).sort();
for (const id of ids) {
  const l = A[id];
  const errs = [];
  // required top-level fields
  for (const f of ["title", "tagline", "connections", "motivation", "definition", "worked", "practice", "applications", "applicationsClose", "takeaways"]) {
    if (l[f] === undefined) errs.push(`missing ${f}`);
  }
  for (const f of FORBIDDEN_FIELDS) if (l[f] !== undefined) errs.push(`forbidden field ${f}`);
  // connections
  const c = l.connections || {};
  for (const k of ["buildsOn", "leadsTo", "usedWith"]) if (!Array.isArray(c[k]) || !c[k].length) errs.push(`connections.${k} empty`);
  // worked
  const w = l.worked || {};
  if (!w.problem) errs.push("worked.problem missing");
  if (!Array.isArray(w.steps) || w.steps.length < 2) errs.push("worked.steps <2");
  (w.steps || []).forEach((s, i) => { if (!s.do || !s.result) errs.push(`worked.steps[${i}] missing do/result`); });
  if (!w.answer) errs.push("worked.answer missing");
  // practice
  if (!Array.isArray(l.practice) || l.practice.length !== 5) errs.push(`practice.length=${(l.practice || []).length} (want 5)`);
  (l.practice || []).forEach((p, i) => {
    if (!p.problem) errs.push(`practice[${i}].problem missing`);
    if (!Array.isArray(p.steps) || p.steps.length < 2) errs.push(`practice[${i}].steps <2`);
    if (!p.answer) errs.push(`practice[${i}].answer missing`);
  });
  // applications
  if (!Array.isArray(l.applications) || l.applications.length < 6) errs.push(`applications.length=${(l.applications || []).length} (want >=6)`);
  (l.applications || []).forEach((a, i) => {
    if (!a.title) errs.push(`applications[${i}].title missing`);
    if (!a.numbers) errs.push(`applications[${i}].numbers missing`);
  });
  if (!Array.isArray(l.takeaways) || l.takeaways.length < 3) errs.push("takeaways <3");
  // italics / emojis
  const bag = []; scanStrings(l, id, bag);
  errs.push(...bag);
  if (errs.length) problems.push(`${id} "${l.title || "?"}":\n   - ${errs.join("\n   - ")}`);
}

// coverage: which 1..62 are present
const present = new Set(ids.map(id => parseInt(id.split("-")[2], 10)));
const missing = [];
for (let i = 1; i <= 62; i++) if (!present.has(i)) missing.push(i);

console.log(`Checked ${ids.length} lessons under ${prefix}`);
if (missing.length) console.log(`MISSING lesson numbers: ${missing.join(", ")}`);
if (problems.length) { console.log(`\nPROBLEMS (${problems.length}):\n` + problems.join("\n")); process.exit(1); }
else if (!missing.length) { console.log("All lessons present and valid."); }
else process.exit(1);
