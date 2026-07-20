// Shared build hook: run the canonical Python formatter (tools/nbfmt.py) over the
// given .ipynb paths so freshly generated notebooks get the same readable code
// formatting (blank line before each top-level print block). Single source of truth
// for the rule lives in nbfmt.py. Fail-safe: a formatting hiccup never breaks a build.
"use strict";
const { execFileSync } = require("child_process");
const path = require("path");

module.exports = function formatNotebooks(paths) {
  const list = (paths || []).filter(Boolean);
  if (!list.length) return;
  try {
    execFileSync("python3", [path.join(__dirname, "nbfmt.py"), ...list], { stdio: "inherit" });
  } catch (e) {
    console.warn("nbfmt: skipped code formatting (" + ((e && e.message) || e) + ")");
  }
};
