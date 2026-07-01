/* Safely fixes single-backslash LaTeX in authored lesson files.
   Doubles any lone backslash that is NOT part of a \\ pair and NOT an escaped
   quote (\" or \'). Operates on raw file text, so it also repairs files that
   would otherwise fail to parse (e.g. \xi, \up...). Idempotent.
   Usage: node tools/fix-latex-backslashes.js [file ...]   (default: tools/authored/*.js) */
"use strict";
const fs = require("fs");
const path = require("path");

let files = process.argv.slice(2);
if (!files.length) {
  const dir = path.join(__dirname, "authored");
  files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith(".js")).map(f => path.join(dir, f)) : [];
}

let totalChanged = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  // Double a single backslash that is not preceded by a backslash and not
  // followed by a backslash, a double-quote, or a single-quote.
  const fixed = src.replace(/(?<!\\)\\(?!["'\\])/g, "\\\\");
  if (fixed !== src) {
    const before = (src.match(/\\/g) || []).length;
    const after = (fixed.match(/\\/g) || []).length;
    fs.writeFileSync(f, fixed);
    console.log(`fixed ${path.basename(f)}: backslashes ${before} -> ${after}`);
    totalChanged++;
  }
}
console.log(totalChanged ? `Fixed ${totalChanged} file(s).` : "No changes (all clean).");
