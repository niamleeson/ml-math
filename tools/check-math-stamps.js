#!/usr/bin/env node
/* Verify that every rendered formula in every lesson carries its source TeX.

   MathJax renders to SVG, so a formula is vector paths, not selectable text. index.html wraps
   MathJax.typesetPromise once at startup to stamp each <mjx-container> with data-tex, which is
   what lets the Ask-Claude widget quote the source instead of the picture. This script proves
   that holds for the whole corpus.

   Usage:  node tools/check-math-stamps.js [limit]        (needs `yarn run dev` running)
           PORT=8092 node tools/check-math-stamps.js

   NOTE ON CORRECTNESS: do NOT re-typeset a lesson to "make sure it finished" — that both
   doubles the work and races, counting containers mid-render that have not been stamped yet.
   An earlier version did exactly that and reported ~800 phantom failures. Instead we wait for
   the stamp itself: poll until no `mjx-container:not([data-tex])` remains. */

const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const puppeteer = require(path.join(ROOT, 'node_modules', 'puppeteer-core'));

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = process.env.PORT || 8080;
const LIMIT = Number(process.argv[2] || 0);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1000 });
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e.message).slice(0, 160)));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() =>
    window.App && window.LESSONS && window.LESSONS.length &&
    window.MathJax && MathJax.typesetPromise &&
    MathJax.typesetPromise.toString().includes('__stampTeX'), { timeout: 60000 });

  let ids = await page.evaluate(() => window.LESSONS.map(l => l.id));
  if (LIMIT) ids = ids.slice(0, LIMIT);
  console.log(`checking ${ids.length} lessons`);

  // Run the whole loop inside the page: one round trip, and no MathJax re-render per lesson.
  await page.evaluate((lessonIds) => {
    window.__sw = { i: 0, math: 0, un: 0, bad: [], slow: [], done: false };
    (async () => {
      const c = document.getElementById('content');
      for (let k = 0; k < lessonIds.length; k++) {
        window.App.open(lessonIds[k]);
        let waited = 0;
        while (waited < 4000 && c.querySelector('mjx-container:not([data-tex])')) {
          await new Promise(r => setTimeout(r, 20)); waited += 20;
        }
        const m = [...c.querySelectorAll('mjx-container')];
        const un = m.filter(x => !x.dataset.tex);
        window.__sw.math += m.length; window.__sw.un += un.length; window.__sw.i = k + 1;
        if (waited >= 4000) window.__sw.slow.push(lessonIds[k]);
        if (un.length) window.__sw.bad.push({ id: lessonIds[k], math: m.length, un: un.length });
      }
      window.__sw.done = true;
    })();
  }, ids);

  let last = -1;
  for (;;) {
    const s = await page.evaluate(() => ({ ...window.__sw, bad: window.__sw.bad.slice(0, 20) }));
    if (s.i !== last) {
      process.stdout.write(`\r  ${s.i}/${ids.length}  formulas=${s.math}  unstamped=${s.un}`);
      last = s.i;
    }
    if (s.done) {
      console.log('\n=== RESULT ===');
      console.log('lessons       :', s.i);
      console.log('formulas      :', s.math);
      console.log('UNSTAMPED     :', s.un);
      console.log('lessons w/ gap:', s.bad.length, s.bad.length ? JSON.stringify(s.bad) : '');
      console.log('timed out     :', s.slow.length, s.slow.slice(0, 10).join(' '));
      console.log('page errors   :', pageErrors.length, pageErrors.slice(0, 3));
      await browser.close();
      process.exit(s.un || s.bad.length ? 1 : 0);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
})();
