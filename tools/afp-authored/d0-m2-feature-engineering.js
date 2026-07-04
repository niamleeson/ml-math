/* Domain 0 · M2 — Feature engineering & leakage (multi-lesson SECTION).
   Assembles every sub-lesson file in ./m2-parts/*.js (each exports one
   sub-lesson object with `sub` + `subtitle` + full lesson fields), ordered
   by `sub`. Drop a new part file in m2-parts/ and it is picked up automatically.
   gen-afp.js emits one lesson page + notebook per sub-lesson (afp-m02-<sub>). */
"use strict";
const fs = require("fs");
const path = require("path");

const PARTS = path.join(__dirname, "m2-parts");
const lessons = fs.readdirSync(PARTS)
  .filter(f => /\.js$/.test(f))
  .map(f => require(path.join(PARTS, f)))
  .sort((a, b) => String(a.sub).localeCompare(String(b.sub)));

module.exports = [
  {
    m: 2, domain: 0,
    title: "Feature engineering & leakage",
    tagline: "Turn raw logged events into trustworthy model inputs without smuggling the answer into the row.",
    mapsTo: ["all"],
    intro:
      "<p>Feature engineering is where most production wins and most quiet disasters happen. This module is broken into focused sub-lessons so each craft skill gets a full treatment, a worked example, and its own practice notebook. Work them in order, or jump to the one you need.</p>" +
      "<p>The thread that ties them together is a single serving-time contract: every feature must be computable at the moment you make the prediction, from only what was known then. Leakage breaks that contract; point-in-time joins enforce it; and the encoding and scaling lessons show how to make categorical, numeric, and float signals both useful and honest under it.</p>",
    lessons
  }
];
