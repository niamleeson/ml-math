/* Shared helpers for the AFP/Curriculum tooling: loading authored modules and
   flattening them into ordered lesson "specs". A module is EITHER a single flat
   lesson (has worked/practice/...) OR a SECTION with `lessons: [ sub-lessons ]`.
   Each sub-lesson carries `sub` ("01") + `subtitle`, and is emitted as its own
   lesson id `afp-mNN-SS` with title "M<n>.<k> · <subtitle>". */
"use strict";
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "afp-authored");

const pad = (x) => String(x).padStart(2, "0");
const mid = (m) => `afp-m${pad(m)}`;

function allFiles() {
  return fs.readdirSync(SRC).filter(f => /\.js$/.test(f)).sort().map(f => path.join(SRC, f));
}
function loadFiles(files) {
  let mods = [];
  files.forEach(f => {
    const arr = require(path.resolve(f));
    if (!Array.isArray(arr)) throw new Error(`${f} must module.exports an array`);
    mods = mods.concat(arr);
  });
  return mods;
}
// Is this authored entry a multi-lesson section?
function isSection(o) { return Array.isArray(o.lessons); }

// Flatten flat modules + sectioned modules into ordered lesson specs:
//   { id, title, m, domain, kind:"lesson"|"section"|"sub", sectionTitle?, data }
// A SECTION emits: one overview page (kind "section", template afp-section, no notebook)
// followed by one page per sub-lesson (kind "sub"). A flat module emits one "lesson".
function flatten(mods) {
  const specs = [];
  mods.slice().sort((a, b) => a.m - b.m).forEach(o => {
    if (isSection(o)) {
      const subs = o.lessons.slice().sort((a, b) => String(a.sub).localeCompare(String(b.sub)));
      specs.push({
        id: mid(o.m),
        title: `M${o.m} \u00B7 ${o.title}`,
        m: o.m, domain: o.domain, kind: "section",
        data: {
          template: "afp-section",
          tagline: o.tagline,
          intro: o.intro,
          mapsTo: o.mapsTo,
          sublessons: subs.map(s => ({
            id: `${mid(o.m)}-${s.sub}`,
            label: `M${o.m}.${parseInt(s.sub, 10)}`,
            subtitle: s.subtitle,
            skipIf: s.skipIf
          }))
        }
      });
      subs.forEach(sub => {
        specs.push({
          id: `${mid(o.m)}-${sub.sub}`,
          title: `M${o.m}.${parseInt(sub.sub, 10)} \u00B7 ${sub.subtitle}`,
          m: o.m, domain: o.domain, kind: "sub", sectionTitle: o.title, data: sub
        });
      });
    } else {
      specs.push({ id: mid(o.m), title: `M${o.m} \u00B7 ${o.title}`, m: o.m, domain: o.domain, kind: "lesson", data: o });
    }
  });
  return specs;
}

module.exports = { SRC, pad, mid, allFiles, loadFiles, isSection, flatten };
