/* Headless test harness for lesson `demo` widgets.
   Usage: node tools/demo-harness.js lessons/00-foundations.js [more files...]
   Loads demos.js + the given lesson files, then for every lesson that has a
   demo: runs it against a fake DOM/canvas, simulates slider/button events, and
   fails if any non-finite (NaN/Infinity) number reaches a canvas drawing call. */

let nanHits = [];
let curLesson = '(none)';

function fakeCtx() {
  const check = (name, args) => {
    for (const a of args) if (typeof a === 'number' && !Number.isFinite(a)) {
      nanHits.push(curLesson + ' -> ctx.' + name + '(' + args.join(',') + ')');
    }
  };
  const handler = {
    get(t, prop) {
      if (prop === 'canvas') return { width: 640, height: 360 };
      if (prop in t) return t[prop];
      // any method: validate numeric args
      return function () { check(prop, Array.prototype.slice.call(arguments)); return undefined; };
    },
    set(t, prop, val) { t[prop] = val; return true; }
  };
  return new Proxy({ measureText: () => ({ width: 10 }) }, handler);
}

class El {
  constructor(tag) { this.tagName = (tag || 'div').toUpperCase(); this.children = []; this.style = {}; this._attrs = {}; this._lis = {}; this._html = ''; this.value = '0'; this.textContent = ''; this.className = ''; this.id = ''; this.width = 640; this.height = 360; }
  set innerHTML(v) { this._html = v; this.children = []; }   // setting innerHTML clears kids (like real DOM)
  get innerHTML() { return this._html; }
  get firstChild() { return this.children[0] || null; }
  get lastChild() { return this.children[this.children.length - 1] || null; }
  appendChild(c) { this.children.push(c); return c; }
  insertBefore(c, ref) { const i = ref ? this.children.indexOf(ref) : -1; if (i < 0) this.children.push(c); else this.children.splice(i, 0, c); return c; }
  removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; }
  setAttribute(k, v) { this._attrs[k] = v; if (k === 'type') this.type = v; if (k === 'class') this.className = v; if (k === 'id') this.id = v; }
  getAttribute(k) { return this._attrs[k]; }
  addEventListener(t, fn) { (this._lis[t] = this._lis[t] || []).push(fn); }
  dispatch(t) { (this._lis[t] || []).forEach(fn => fn({ target: this })); }
  getContext() { return fakeCtx(); }
  _all() { let r = []; for (const c of this.children) { r.push(c); if (c._all) r = r.concat(c._all()); } return r; }
  querySelector(sel) {
    const all = this._all();
    const match = e => sel[0] === '#' ? e.id === sel.slice(1) : sel[0] === '.' ? (e.className || '').split(' ').includes(sel.slice(1)) : e.tagName === sel.toUpperCase();
    for (const e of all) if (match(e)) return e;
    return null;
  }
  querySelectorAll(sel) { return this._all().filter(e => sel[0] === '#' ? e.id === sel.slice(1) : sel[0] === '.' ? (e.className || '').split(' ').includes(sel.slice(1)) : e.tagName === sel.toUpperCase()); }
}

global.document = { createElement: t => new El(t), documentElement: new El('html') };
global.getComputedStyle = () => ({ getPropertyValue: () => '' });
global.window = { LESSONS: [], DERIVATIONS: {}, PRACTICE: {} };

const path = require('path');
const files = process.argv.slice(2);
// demos.js first
require(path.resolve('lessons/demos.js'));
global.Demos = global.window.Demos;          // lessons reference bare `Demos` (a window global in browsers)
files.forEach(f => require(path.resolve(f)));

let tested = 0, withDemo = 0, errors = [];
for (const l of window.LESSONS) {
  if (typeof l.demo !== 'function') continue;
  withDemo++; curLesson = l.id;
  const host = new El('div');
  try {
    l.demo(host);                       // initial render
    // exercise interactivity: sliders at several values, buttons clicked
    const ranges = host.querySelectorAll('input');
    ranges.forEach(r => {
      [r.min, (parseFloat(r.min) + parseFloat(r.max)) / 2, r.max].forEach(v => { r.value = String(v); r.dispatch('input'); });
    });
    host.querySelectorAll('button').forEach(b => { b.dispatch('click'); b.dispatch('click'); });
    tested++;
  } catch (e) { errors.push(l.id + ': ' + e.message); }
}

console.log('lessons scanned:', window.LESSONS.length, '| with demo:', withDemo, '| ran without throwing:', tested);
if (errors.length) { console.log('\nTHREW:'); errors.forEach(e => console.log('  ' + e)); }
if (nanHits.length) { console.log('\nNON-FINITE coords (math bug):'); [...new Set(nanHits)].slice(0, 30).forEach(h => console.log('  ' + h)); }
console.log('\nRESULT:', (errors.length || nanHits.length) ? 'FAIL' : 'PASS');
process.exit((errors.length || nanHits.length) ? 1 : 0);
