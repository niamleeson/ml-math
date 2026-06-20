/* Render every lesson's demo in headless Chrome and screenshot the real canvas.
   Usage: node tools/screenshot.js [lessonIdSubstring]
   Output: screenshots/<id>.png  +  screenshots/manifest.json (console errors, sizes). */
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'screenshots');
const filter = process.argv[2] || '';

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 1000, deviceScaleFactor: 2 });

  let bucket = [];
  page.on('console', m => { if (m.type() === 'error') bucket.push('console: ' + m.text()); });
  page.on('pageerror', e => bucket.push('pageerror: ' + e.message));

  await page.goto('file://' + path.join(ROOT, 'index.html'), { waitUntil: 'load' });
  await page.waitForFunction(() => window.App && window.LESSONS && window.LESSONS.length > 0, { timeout: 15000 });

  let ids = await page.evaluate(() => window.LESSONS.filter(l => typeof l.demo === 'function').map(l => l.id));
  if (filter) ids = ids.filter(i => i.includes(filter));
  console.log('rendering', ids.length, 'demos...');

  const manifest = [];
  for (const id of ids) {
    bucket = [];
    let ok = true, note = '';
    try {
      await page.evaluate(i => window.App.open(i), id);
      // demo() runs synchronously inside open(); wait for the host to be populated
      // (canvas for plots/scatter/bars, or just sliders+readout for calc demos).
      await page.waitForFunction(() => {
        const h = document.getElementById('demo-host');
        return h && (h.querySelector('canvas') || h.querySelector('input') || h.children.length > 0);
      }, { timeout: 4000 });
      // nudge the first slider + click first button so the interactive state is exercised in the shot
      await page.evaluate(() => {
        const h = document.getElementById('demo-host');
        const r = h.querySelector('input[type=range]');
        if (r) { r.value = r.value; r.dispatchEvent(new Event('input', { bubbles: true })); }
        const b = h.querySelector('button'); if (b) b.click();
      });
      await new Promise(r => setTimeout(r, 120));
      // screenshot the whole demo card (host's parent .card) for context (title + canvas + readout)
      const handle = await page.evaluateHandle(() => {
        const h = document.getElementById('demo-host');
        return h.closest('.card') || h;
      });
      const elt = handle.asElement();
      await elt.screenshot({ path: path.join(OUT, id + '.png') });
    } catch (e) { ok = false; note = e.message; }
    if (bucket.length) ok = false;
    manifest.push({ id, ok, errors: bucket.slice(0, 5), note });
    console.log((ok ? 'OK  ' : 'FAIL') + '  ' + id + (bucket.length ? '  [' + bucket.length + ' console errs]' : '') + (note ? '  ' + note : ''));
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  const bad = manifest.filter(m => !m.ok);
  console.log('\nrendered', manifest.length, '| clean', manifest.length - bad.length, '| with errors', bad.length);
  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
