// Structural notebook validator — NO python execution. Usage: node tools/check_nb.js <file.ipynb> ...
// Checks: valid JSON, cell structure, enhanced_walkthrough, readable code (one statement/line),
// presence of asserts + a math ($...$) cell. Does NOT run the notebook.
const fs = require("fs");

function stripStringsAndComments(line) {
  let out = line.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");
  out = out.split("#")[0];
  return out;
}
function denseLines(cells) {
  const bad = [];
  cells.forEach((c, i) => {
    if (c.cell_type !== "code") return;
    const src = Array.isArray(c.source) ? c.source.join("") : c.source || "";
    src.split("\n").forEach((raw) => {
      let bare = stripStringsAndComments(raw).replace(/\s+$/, "");
      const inner = bare.endsWith(";") ? bare.slice(0, -1) : bare;
      if (inner.includes(";")) bad.push([i, raw]);
    });
  });
  return bad;
}

let anyFail = false;
const files = process.argv.slice(2);
for (const f of files) {
  let nb;
  try {
    nb = JSON.parse(fs.readFileSync(f, "utf8"));
  } catch (e) {
    console.log(`FAIL ${f}  invalid JSON: ${e.message}`);
    anyFail = true;
    continue;
  }
  const cells = nb.cells || [];
  const code = cells.filter((c) => c.cell_type === "code");
  const md = cells.filter((c) => c.cell_type === "markdown");
  const allCode = code.map((c) => (Array.isArray(c.source) ? c.source.join("") : c.source || "")).join("\n");
  const allMd = md.map((c) => (Array.isArray(c.source) ? c.source.join("") : c.source || "")).join("\n");
  const ew = !!(nb.metadata && nb.metadata.enhanced_walkthrough);
  const bad = denseLines(cells);
  const hasAssert = /\bassert\b/.test(allCode);
  const hasMath = /\$[^$]+\$/.test(allMd) || /\$\$[\s\S]+\$\$/.test(allMd);
  const problems = [];
  if (cells.length < 10) problems.push(`only ${cells.length} cells`);
  if (!ew) problems.push("enhanced_walkthrough not set");
  if (bad.length) problems.push(`${bad.length} dense code line(s)`);
  if (!hasAssert) problems.push("no assert in build-once");
  if (!hasMath) problems.push("no $…$ math cell");
  const name = f.split("/").pop();
  if (problems.length) {
    anyFail = true;
    console.log(`FAIL ${name.padEnd(46)} ${problems.join("; ")}`);
    if (bad.length) console.log(`      first dense: cell ${bad[0][0]}: ${bad[0][1].trim().slice(0, 80)}`);
  } else {
    console.log(`ok   ${name.padEnd(46)} cells=${cells.length} md/code=${md.length}/${code.length} enh=1 dense=0 assert=1 math=1`);
  }
}
process.exit(anyFail ? 1 : 0);
