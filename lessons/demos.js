/* =====================================================================
   Demos — a small, reusable library of interactive widgets.
   Each lesson sets   demo: function(host){ Demos.<widget>(host, {...}); }
   so widget logic is written and tested ONCE, not per lesson.

   Widgets:
     Demos.plot(host, opts)     curves over an x-range, optional draggable
                                point + tangent + shaded area. (functions,
                                activations, continuous distributions)
     Demos.bars(host, opts)     discrete distribution as bars, with sliders.
                                (Bernoulli/Binomial/Poisson/Geometric/dice)
     Demos.descent(host, opts)  1-D gradient descent stepper on f(x).
     Demos.scatter(host, opts)  2-D points: kmeans / knn / line / axes.
     Demos.calc(host, opts)     generic slider-driven calculator with a live
                                readout and optional bar visualization.
                                (Bayes, metrics, costs, similarity, ...)

   All widgets read the page's CSS theme variables, so they match light/dark.
   ===================================================================== */
(function () {
  const Demos = {};

  function colors() {
    const cs = (typeof getComputedStyle === 'function')
      ? getComputedStyle(document.documentElement) : null;
    const get = (n, d) => { try { return (cs && cs.getPropertyValue(n).trim()) || d; } catch (e) { return d; } };
    return {
      ink: get('--ink', '#e6edf3'), dim: get('--ink-dim', '#9aa7b4'),
      a1: get('--accent', '#4ea1ff'), a2: get('--accent-2', '#7ee787'),
      warn: get('--warn', '#ffb454'), purple: get('--purple', '#c89bff'),
      bd: get('--border', '#2a3340'), panel: get('--panel', '#161c24')
    };
  }
  // 8-digit hex alpha helper (expects #rrggbb)
  function alpha(hex, aa) { return (/^#[0-9a-fA-F]{6}$/.test(hex)) ? hex + aa : hex; }

  function el(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function canvas(host, w, h) {
    const c = el('canvas'); c.width = w; c.height = h;
    host.appendChild(c);
    return { c: c, x: c.getContext('2d') };
  }
  // labelled slider that calls cb(value) live; returns {row, input, val}
  function slider(host, label, min, max, val, step, cb) {
    const row = el('div'); row.style.margin = '6px 0';
    const lab = el('label'); lab.style.display = 'block';
    const valSpan = el('span'); valSpan.className = 'out'; valSpan.style.marginLeft = '6px';
    const inp = el('input', { type: 'range' });
    inp.min = min; inp.max = max; inp.step = step; inp.value = val;
    lab.textContent = label; lab.appendChild(valSpan);
    inp.addEventListener('input', function () { valSpan.textContent = fmt(realVal()); cb(realVal()); });
    function realVal() { return parseFloat(inp.value); }
    row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    valSpan.textContent = fmt(val);
    return { input: inp, get: realVal };
  }
  function fmt(v) { return (Math.abs(v) >= 100 || Number.isInteger(v)) ? String(v) : (+v).toFixed(2); }
  function out(host) { const d = el('div', { class: 'out' }); d.style.marginTop = '6px'; host.appendChild(d); return d; }
  function fact(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
  function comb(n, k) { if (k < 0 || k > n) return 0; return fact(n) / (fact(k) * fact(n - k)); }

  // ---------- plot: curves + optional param sliders / drag / tangent / shade ----------
  // curve.f may be f(x) or f(x, state). opts.controls add parameter sliders that reshape curves.
  Demos.plot = function (host, o) {
    host.innerHTML = '';
    const W = 640, H = o.height || 300, L = 46, R = 624, T = 18, B = H - 26, NS = 240;
    const xmin = o.xmin, xmax = o.xmax, curves = o.curves || [];
    const state = {}; (o.controls || []).forEach(c => state[c.key] = c.val);
    let dragX = o.drag ? (o.drag.start != null ? o.drag.start : (xmin + xmax) / 2) : null;
    const cv = canvas(host, W, H); const ctx = cv.x;
    const readout = (o.drag || o.readout) ? out(host) : null;
    const px = x => L + (x - xmin) / (xmax - xmin) * (R - L);

    function draw() {
      const c = colors();
      // sample with current state, find y-range
      let ymin = (o.ymin != null) ? o.ymin : Infinity, ymax = (o.ymax != null) ? o.ymax : -Infinity;
      const data = curves.map(cu => {
        const pts = [];
        for (let i = 0; i <= NS; i++) { const x = xmin + (xmax - xmin) * i / NS, y = cu.f(x, state); pts.push([x, y]); if (o.ymin == null && isFinite(y)) ymin = Math.min(ymin, y); if (o.ymax == null && isFinite(y)) ymax = Math.max(ymax, y); }
        return pts;
      });
      if (!isFinite(ymin)) ymin = 0; if (!isFinite(ymax)) ymax = 1; if (ymin === ymax) { ymin -= 1; ymax += 1; }
      const pad = (ymax - ymin) * 0.08; ymin -= pad; ymax += pad;
      const py = y => B - (y - ymin) / (ymax - ymin) * (B - T);

      ctx.clearRect(0, 0, W, H);
      ctx.font = '13px -apple-system, sans-serif'; ctx.textBaseline = 'alphabetic';
      ctx.strokeStyle = c.bd; ctx.lineWidth = 1;
      const y0 = (ymin <= 0 && ymax >= 0) ? py(0) : B;
      ctx.beginPath(); ctx.moveTo(L, y0); ctx.lineTo(R, y0); ctx.stroke();
      const x0 = (xmin <= 0 && xmax >= 0) ? px(0) : L;
      ctx.beginPath(); ctx.moveTo(x0, T); ctx.lineTo(x0, B); ctx.stroke();
      ctx.fillStyle = c.dim; ctx.fillText(String(+xmax.toFixed(2)), R - 18, y0 + 14); ctx.fillText(String(+xmin.toFixed(2)), L, y0 + 14);
      // shaded area up to dragX
      if (o.drag && o.shade && dragX != null) {
        const ci = o.drag.curve || 0;
        ctx.beginPath(); ctx.moveTo(px(xmin), y0);
        for (let i = 0; i <= NS; i++) { const x = xmin + (xmax - xmin) * i / NS; if (x > dragX) break; ctx.lineTo(px(x), py(curves[ci].f(x, state))); }
        ctx.lineTo(px(dragX), y0); ctx.closePath(); ctx.fillStyle = alpha(c.a1, '44'); ctx.fill();
      }
      const cols = [c.a1, c.a2, c.purple, c.warn];
      data.forEach((pts, i) => {
        ctx.beginPath();
        pts.forEach((p, j) => { const X = px(p[0]), Y = py(p[1]); j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
        ctx.strokeStyle = curves[i].color || cols[i % cols.length];
        ctx.setLineDash(curves[i].dashed ? [5, 4] : []); ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
        if (curves[i].label) { ctx.fillStyle = curves[i].color || cols[i % cols.length]; ctx.fillText(curves[i].label, L + 6 + i * 96, T + 12); }
      });
      if (o.drag && dragX != null) {
        const ci = o.drag.curve || 0, yx = curves[ci].f(dragX, state);
        ctx.strokeStyle = c.a2; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px(dragX), T); ctx.lineTo(px(dragX), B); ctx.stroke(); ctx.setLineDash([]);
        if (o.drag.df) {
          const m = o.drag.df(dragX, state), span = (xmax - xmin) * 0.18;
          ctx.strokeStyle = c.warn; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(px(dragX - span), py(yx - m * span)); ctx.lineTo(px(dragX + span), py(yx + m * span)); ctx.stroke();
        }
        ctx.fillStyle = c.a2; ctx.beginPath(); ctx.arc(px(dragX), py(yx), 4.5, 0, 7); ctx.fill();
        if (readout) readout.innerHTML = o.drag.readout(dragX, yx, state);
      } else if (o.readout && readout) { readout.innerHTML = o.readout(state); }
    }
    (o.controls || []).forEach(c => slider(host, c.label, c.min, c.max, c.val, c.step || 0.1, function (v) { state[c.key] = v; draw(); }));
    if (o.drag) slider(host, o.drag.label || 'x', xmin, xmax, dragX, (xmax - xmin) / 200, function (v) { dragX = v; draw(); });
    host.insertBefore(cv.c, host.children[0]);   // keep canvas on top
    draw();
  };

  // ---------- bars: discrete distribution with sliders ----------
  Demos.bars = function (host, o) {
    host.innerHTML = '';
    const ctrls = o.controls || [];
    const W = 640, H = o.height || 280, L = 40, R = 624, T = 30, B = H - 28;
    const cv = canvas(host, W, H); const ctx = cv.x;
    const readout = out(host);
    const state = {}; ctrls.forEach(c => state[c.key] = c.val);

    function draw() {
      const c = colors();
      const bars = o.pmf(state);           // -> [{k, p}], p in [0,1]
      ctx.clearRect(0, 0, W, H);
      ctx.font = '12px -apple-system, sans-serif'; ctx.textBaseline = 'alphabetic';
      let pmax = 0; bars.forEach(b => pmax = Math.max(pmax, b.p)); if (pmax <= 0) pmax = 1;
      const n = bars.length, bw = (R - L) / n * 0.7, gap = (R - L) / n;
      ctx.strokeStyle = c.bd; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(R, B); ctx.stroke();
      bars.forEach((b, i) => {
        const x = L + i * gap + (gap - bw) / 2, h = (b.p / pmax) * (B - T);
        ctx.fillStyle = c.a1; ctx.fillRect(x, B - h, bw, h);
        ctx.fillStyle = c.dim;
        if (n <= 16) ctx.fillText(String(b.k), x + bw / 2 - 4, B + 14);
        if (n <= 12) { ctx.fillStyle = c.ink; ctx.fillText(b.p.toFixed(2), x + bw / 2 - 12, B - h - 4); }
      });
      readout.innerHTML = o.readout ? o.readout(state, bars) : '';
    }
    ctrls.forEach(c => slider(host, c.label, c.min, c.max, c.val, c.step || 1, function (v) { state[c.key] = v; draw(); }));
    host.insertBefore(cv.c, host.children[0]);   // canvas on top
    host.insertBefore(readout, null);
    draw();
  };

  // ---------- descent: 1-D gradient descent stepper ----------
  Demos.descent = function (host, o) {
    host.innerHTML = '';
    const f = o.f, df = o.df, xmin = o.xmin, xmax = o.xmax;
    const W = 640, H = o.height || 300, L = 46, R = 624, T = 18, B = H - 26;
    let ymin = Infinity, ymax = -Infinity;
    for (let i = 0; i <= 200; i++) { const x = xmin + (xmax - xmin) * i / 200, y = f(x); ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); }
    const pad = (ymax - ymin) * 0.08; ymin -= pad; ymax += pad;
    const px = x => L + (x - xmin) / (xmax - xmin) * (R - L);
    const py = y => B - (y - ymin) / (ymax - ymin) * (B - T);
    const cv = canvas(host, W, H); const ctx = cv.x;
    let lr = o.lr || 0.1, pos = (o.start != null ? o.start : xmax * 0.8), path = [pos];
    const readout = out(host);

    function draw() {
      const c = colors(); ctx.clearRect(0, 0, W, H);
      ctx.font = '13px -apple-system, sans-serif';
      ctx.strokeStyle = c.bd; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(R, B); ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) { const x = xmin + (xmax - xmin) * i / 200, X = px(x), Y = py(f(x)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
      ctx.strokeStyle = c.a1; ctx.lineWidth = 2; ctx.stroke();
      // path dots
      path.forEach((p, i) => { ctx.fillStyle = i === path.length - 1 ? c.warn : alpha(c.a2, 'aa'); ctx.beginPath(); ctx.arc(px(p), py(f(p)), i === path.length - 1 ? 5.5 : 3, 0, 7); ctx.fill(); });
      const g = df(pos);
      readout.innerHTML = 'x = <b>' + pos.toFixed(3) + '</b>, f(x) = ' + f(pos).toFixed(3) +
        ', gradient = ' + g.toFixed(3) + '. Next step: x − ' + lr + '×(' + g.toFixed(2) + ') = <b>' + (pos - lr * g).toFixed(3) + '</b>.';
    }
    const btnRow = el('div'); btnRow.style.margin = '8px 0';
    const step = el('button', null, 'Take a step ↓'); style(step, c => c);
    const reset = el('button', null, 'Reset'); style(reset, c => c);
    reset.style.marginLeft = '8px';
    step.addEventListener('click', function () { pos = pos - lr * df(pos); path.push(pos); if (path.length > 60) path.shift(); draw(); });
    reset.addEventListener('click', function () { pos = (o.start != null ? o.start : xmax * 0.8); path = [pos]; draw(); });
    btnRow.appendChild(step); btnRow.appendChild(reset); host.appendChild(btnRow);
    slider(host, 'learning rate', o.lrMin || 0.01, o.lrMax || 1, lr, 0.01, function (v) { lr = v; draw(); });
    host.insertBefore(cv.c, host.children[0]);
    host.insertBefore(readout, btnRow);
    function style(b) { b.style.cssText = 'background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px'; }
    draw();
  };

  // ---------- scatter: 2-D points (kmeans / knn / line / axes) ----------
  Demos.scatter = function (host, o) {
    host.innerHTML = '';
    const W = 640, H = o.height || 360, P = 30;
    const pts = o.points;                 // [{x,y,c?}]
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    const xmin = Math.min.apply(0, xs) - 1, xmax = Math.max.apply(0, xs) + 1;
    const ymin = Math.min.apply(0, ys) - 1, ymax = Math.max.apply(0, ys) + 1;
    const px = x => P + (x - xmin) / (xmax - xmin) * (W - 2 * P);
    const py = y => (H - P) - (y - ymin) / (ymax - ymin) * (H - 2 * P);
    const cv = canvas(host, W, H); const ctx = cv.x;
    const readout = out(host);
    const palette = ['#4ea1ff', '#7ee787', '#ffb454', '#c89bff', '#ff7b72'];

    function draw(extra) {
      const c = colors(); ctx.clearRect(0, 0, W, H); ctx.font = '12px sans-serif';
      ctx.strokeStyle = c.bd; ctx.strokeRect(P, P, W - 2 * P, H - 2 * P);
      if (extra) extra(ctx, c, px, py);
      pts.forEach(p => {
        ctx.fillStyle = (p.c != null) ? palette[p.c % palette.length] : c.a1;
        ctx.beginPath(); ctx.arc(px(p.x), py(p.y), 5, 0, 7); ctx.fill();
      });
    }
    if (o.init) o.init({ pts, draw, readout, px, py, palette, host, slider: (l, a, b, v, s, cb) => slider(host, l, a, b, v, s, cb) });
    else draw();
    host.insertBefore(cv.c, host.children[0]);
    host.insertBefore(readout, null);
  };

  // ---------- calc: generic slider calculator + optional bars ----------
  Demos.calc = function (host, o) {
    host.innerHTML = '';
    const state = {}; (o.inputs || []).forEach(i => state[i.key] = i.val);
    const readout = el('div', { class: 'out' }); readout.style.cssText = 'margin-top:10px;font-size:14px;line-height:1.7';
    let cv = null, ctx = null;
    if (o.bars) { const cc = canvas(host, 640, o.barsHeight || 150); cv = cc.c; ctx = cc.x; }

    function recompute() {
      const r = o.compute(state);          // -> {text, bars?:[{label,val,color?}], max?}
      readout.innerHTML = r.text;
      if (o.bars && r.bars) {
        const c = colors(); ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.font = '13px sans-serif'; ctx.textBaseline = 'alphabetic';
        const mx = r.max || Math.max.apply(0, r.bars.map(b => b.val)) || 1;
        const n = r.bars.length, bh = Math.min(34, (cv.height - 10) / n - 8);
        r.bars.forEach((b, i) => {
          const y = 6 + i * (bh + 12), w = Math.max(0, b.val / mx) * (cv.width - 230);
          ctx.fillStyle = b.color || c.a1; ctx.fillRect(150, y, w, bh);
          ctx.fillStyle = c.ink; ctx.fillText(b.label, 8, y + bh / 2 + 4);
          ctx.fillStyle = c.dim; ctx.fillText(typeof b.val === 'number' ? (+b.val).toFixed(3) : b.val, 156 + w, y + bh / 2 + 4);
        });
      }
    }
    (o.inputs || []).forEach(i => slider(host, i.label, i.min, i.max, i.val, i.step || 0.01, function (v) { state[i.key] = v; recompute(); }));
    host.appendChild(readout);
    if (cv) host.insertBefore(cv, readout);   // bars above readout, below sliders
    recompute();
  };

  const BTN = 'background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin:0 8px 0 0';

  // ---------- grid: N x M colored cell grid (frequency grids, confusion, conv, pooling) ----------
  Demos.grid = function (host, o) {
    host.innerHTML = '';
    const rows = o.rows, cols = o.cols, cz = o.cellSize || Math.max(10, Math.min(38, Math.floor(560 / cols)));
    const W = Math.max(360, cols * cz + 80), H = rows * cz + 40;
    const state = {}; (o.controls || []).forEach(c => state[c.key] = c.val);
    const cv = canvas(host, W, H); const ctx = cv.x;
    const readout = out(host);
    function draw() {
      const c = colors(); ctx.clearRect(0, 0, W, H);
      ctx.font = Math.min(13, cz - 2) + 'px sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
      const ox = 40, oy = 14;
      for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
        const info = o.cell(r, k, state) || {};
        ctx.fillStyle = info.color || c.panel; ctx.fillRect(ox + k * cz, oy + r * cz, cz - 1, cz - 1);
        if (info.label != null && cz >= 14) { ctx.fillStyle = info.text || c.ink; ctx.fillText(String(info.label), ox + k * cz + cz / 2, oy + r * cz + cz / 2); }
      }
      ctx.textAlign = 'start'; readout.innerHTML = o.readout ? o.readout(state) : '';
    }
    (o.controls || []).forEach(c => slider(host, c.label, c.min, c.max, c.val, c.step || 1, function (v) { state[c.key] = v; draw(); }));
    host.insertBefore(cv.c, host.children[0]); host.insertBefore(readout, host.children[1]);
    draw();
  };

  // ---------- sampler: animated sampling builds a histogram (CLT, LLN, estimation) ----------
  Demos.sampler = function (host, o) {
    host.innerHTML = '';
    const W = 640, H = o.height || 260, L = 46, R = 624, T = 16, B = H - 24;
    const nb = o.bins || 24, lo = o.lo, hi = o.hi;
    let samples = [], counts = new Array(nb).fill(0);
    const cv = canvas(host, W, H); const ctx = cv.x;
    const readout = out(host);
    const row = el('div'); row.style.margin = '8px 0';
    function add(n) { for (let i = 0; i < n; i++) { const v = o.draw1(); samples.push(v); let b = Math.floor((v - lo) / (hi - lo) * nb); if (b < 0) b = 0; if (b >= nb) b = nb - 1; counts[b]++; } draw(); }
    function reset() { samples = []; counts = new Array(nb).fill(0); draw(); }
    function draw() {
      const c = colors(); ctx.clearRect(0, 0, W, H); ctx.font = '12px sans-serif';
      const mx = Math.max.apply(0, counts) || 1, bw = (R - L) / nb;
      ctx.strokeStyle = c.bd; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(R, B); ctx.stroke();
      for (let i = 0; i < nb; i++) { const h = counts[i] / mx * (B - T); ctx.fillStyle = c.a1; ctx.fillRect(L + i * bw, B - h, bw - 1, h); }
      const mean = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : (lo + hi) / 2;
      const mxp = L + (Math.max(lo, Math.min(hi, mean)) - lo) / (hi - lo) * (R - L);
      ctx.strokeStyle = c.warn; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(mxp, T); ctx.lineTo(mxp, B); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = c.dim; ctx.fillText(String(lo), L, B + 14); ctx.fillText(String(hi), R - 16, B + 14);
      readout.innerHTML = o.readout ? o.readout(samples, mean) : ('samples drawn: <b>' + samples.length + '</b> &nbsp; running mean = <b>' + mean.toFixed(3) + '</b>');
    }
    [['Draw 1', 1], ['Draw 30', 30], ['Draw 200', 200], ['Reset', 0]].forEach(function (p) {
      const b = el('button', null, p[0]); b.style.cssText = BTN;
      b.addEventListener('click', function () { p[1] ? add(p[1]) : reset(); }); row.appendChild(b);
    });
    host.insertBefore(cv.c, host.children[0]); host.insertBefore(readout, host.children[1]); host.insertBefore(row, host.children[2]);
    draw();
  };

  // ---------- vectors: draggable 2-D arrows from origin (dot, norm, eigen, cosine, PCA) ----------
  Demos.vectors = function (host, o) {
    host.innerHTML = '';
    const W = 520, H = 380, rng = o.range || 5, P = 18, cx = W / 2, cy = H / 2, sc = (W / 2 - P) / rng;
    const px = x => cx + x * sc, py = y => cy - y * sc, ix = X => (X - cx) / sc, iy = Y => (cy - Y) / sc;
    const vecs = {}; o.vectors.forEach(v => vecs[v.key] = { x: v.x, y: v.y });
    const cv = canvas(host, W, H); const ctx = cv.x; const readout = out(host);
    function arrow(x2, y2, col) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(x2, y2); ctx.stroke();
      const a = Math.atan2(y2 - py(0), x2 - px(0));
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 11 * Math.cos(a - 0.4), y2 - 11 * Math.sin(a - 0.4)); ctx.lineTo(x2 - 11 * Math.cos(a + 0.4), y2 - 11 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
    }
    function draw() {
      const c = colors(); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = c.bd; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(P, cy); ctx.lineTo(W - P, cy); ctx.moveTo(cx, P); ctx.lineTo(cx, H - P); ctx.stroke();
      const cols = [c.a1, c.a2, c.purple, c.warn], r = o.compute ? o.compute(vecs) : {};
      if (r.draw) r.draw(ctx, { px, py, colors: c });
      o.vectors.forEach((v, i) => { const vv = vecs[v.key], col = v.color || cols[i % cols.length]; arrow(px(vv.x), py(vv.y), col); ctx.fillStyle = col; ctx.font = '13px sans-serif'; ctx.fillText(v.label || v.key, px(vv.x) + 8, py(vv.y) - 8); });
      readout.innerHTML = r.text || '';
    }
    let drag = null;
    function rel(e) { const b = cv.c.getBoundingClientRect(); return { x: (e.clientX - b.left) * (cv.c.width / b.width), y: (e.clientY - b.top) * (cv.c.height / b.height) }; }
    cv.c.addEventListener('mousedown', function (e) { const m = rel(e); o.vectors.forEach(function (v) { if (v.drag === false) return; const vv = vecs[v.key]; if (Math.hypot(m.x - px(vv.x), m.y - py(vv.y)) < 16) drag = v.key; }); });
    cv.c.addEventListener('mousemove', function (e) { if (!drag) return; const m = rel(e); vecs[drag].x = Math.max(-rng, Math.min(rng, Math.round(ix(m.x)))); vecs[drag].y = Math.max(-rng, Math.min(rng, Math.round(iy(m.y)))); draw(); });
    window.addEventListener('mouseup', function () { drag = null; });
    host.insertBefore(cv.c, host.children[0]); host.insertBefore(readout, host.children[1]);
    host.appendChild(el('div', { class: 'hint' }, 'Drag an arrow tip to move it.'));
    draw();
  };

  // ---------- tree: 2-level game tree (minimax / expectimax) with leaf sliders ----------
  Demos.tree = function (host, o) {
    host.innerHTML = '';
    const W = 600, H = 300, type = o.type || 'minimax', probs = o.probs || [0.5, 0.5];
    const st = { l: [o.leaves[0], o.leaves[1], o.leaves[2], o.leaves[3]] };
    const cv = canvas(host, W, H); const ctx = cv.x; const readout = out(host);
    function draw() {
      const c = colors(); ctx.clearRect(0, 0, W, H); ctx.font = '13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const L = st.l;
      const left = type === 'minimax' ? Math.min(L[0], L[1]) : probs[0] * L[0] + probs[1] * L[1];
      const right = type === 'minimax' ? Math.min(L[2], L[3]) : probs[0] * L[2] + probs[1] * L[3];
      const root = Math.max(left, right);
      const lx = [80, 230, 370, 520], ly = 240, mx = [155, 445], my = 140, rx = 300, ry = 46;
      ctx.strokeStyle = c.bd; ctx.lineWidth = 1.5;
      [[rx, ry, mx[0], my], [rx, ry, mx[1], my], [mx[0], my, lx[0], ly], [mx[0], my, lx[1], ly], [mx[1], my, lx[2], ly], [mx[1], my, lx[3], ly]].forEach(e => { ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(e[2], e[3]); ctx.stroke(); });
      function node(x, y, val, fill, shape) {
        ctx.fillStyle = fill; ctx.strokeStyle = c.ink; ctx.lineWidth = 1.5; ctx.beginPath();
        if (shape === 'up') { ctx.moveTo(x, y - 17); ctx.lineTo(x - 17, y + 12); ctx.lineTo(x + 17, y + 12); ctx.closePath(); }
        else if (shape === 'down') { ctx.moveTo(x, y + 17); ctx.lineTo(x - 17, y - 12); ctx.lineTo(x + 17, y - 12); ctx.closePath(); }
        else if (shape === 'circ') { ctx.arc(x, y, 16, 0, 7); }
        else { ctx.rect(x - 16, y - 14, 32, 28); }
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = c.ink; ctx.fillText(typeof val === 'number' ? Math.round(val * 100) / 100 : val, x, y);
      }
      node(rx, ry, root, alpha(c.a1, '88'), 'up');
      node(mx[0], my, left, alpha(c.a2, '88'), type === 'minimax' ? 'down' : 'circ');
      node(mx[1], my, right, alpha(c.a2, '88'), type === 'minimax' ? 'down' : 'circ');
      lx.forEach((x, i) => node(x, ly, L[i], c.panel, 'rect'));
      ctx.textAlign = 'start';
      readout.innerHTML = type === 'minimax'
        ? ('MIN nodes (▽): min(' + L[0] + ',' + L[1] + ') = ' + left + ', min(' + L[2] + ',' + L[3] + ') = ' + right + '.<br>MAX root (△): max(' + left + ',' + right + ') = <b>' + root + '</b>. The agent picks the ' + (left >= right ? 'left' : 'right') + ' branch.')
        : ('Chance nodes (○): ' + probs[0] + '·' + L[0] + ' + ' + probs[1] + '·' + L[1] + ' = <b>' + left.toFixed(2) + '</b>, and ' + right.toFixed(2) + '.<br>MAX root picks the higher average: <b>' + Math.max(left, right).toFixed(2) + '</b>.');
    }
    [0, 1, 2, 3].forEach(i => slider(host, 'leaf ' + (i + 1), o.min == null ? -5 : o.min, o.max == null ? 10 : o.max, st.l[i], 1, function (v) { st.l[i] = v; draw(); }));
    host.insertBefore(cv.c, host.children[0]); host.insertBefore(readout, host.children[1]);
    draw();
  };

  // expose helpers for lessons/tests
  Demos._fact = fact; Demos._comb = comb;
  window.Demos = Demos;
})();
