/* Validate a SINGLE M2 sub-lesson part file in isolation (for parallel authoring).
   Wraps the part as a one-lesson section, then runs the standard validators
   (structural + LaTeX/currency) and the notebook check.
   Usage: node tools/afp-check-part.js tools/afp-authored/m2-parts/s2.js */
"use strict";
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const partPath = path.resolve(process.argv[2]);
const part = require(partPath);
if (!part || !part.sub) { console.error("part must export an object with a `sub` field"); process.exit(2); }

const SRC = path.join(__dirname, "afp-authored");
const tmp = path.join(SRC, `.__part_${part.sub}_check.js`);
fs.writeFileSync(tmp,
  `module.exports=[{m:2,domain:0,title:"M2 section",tagline:"Temporary validation wrapper",intro:"Temporary validation wrapper for one M2 sub-lesson.",mapsTo:["all"],lessons:[require(${JSON.stringify(partPath)})]}];\n`);

let failed = false;
try {
  cp.execSync(`node ${JSON.stringify(path.join(__dirname, "validate-afp.js"))} ${JSON.stringify(tmp)}`, { stdio: "inherit" });
  cp.execSync(`node ${JSON.stringify(path.join(__dirname, "gen-afp-notebooks.js"))} ${JSON.stringify(tmp)}`, { stdio: "inherit" });
  cp.execSync(`node ${JSON.stringify(path.join(__dirname, "check_nb.js"))} ${JSON.stringify(path.join(__dirname, "..", "notebooks", `afp-m02-${part.sub}.ipynb`))}`, { stdio: "inherit" });
} catch (e) {
  failed = true;
} finally {
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
}
process.exit(failed ? 1 : 0);
