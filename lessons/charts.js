/* Reusable canvas chart engine for lesson visualizations.
   window.Charts.draw(canvasEl, spec) — theme-aware, redraws from CSS variables.
   spec types:
     bars/hist : { type, labels:[...], values:[...], valueLabels?:[...], colors?:[...] }
     line      : { type, xlabel?, ylabel?, series:[ {name,color,points:[[x,y],...]} ] }
     scatter   : { type, xlabel?, ylabel?, groups:[ {name,color,points:[[x,y]]} ], lines?:[ {color,dash?,points:[[x,y]]} ] }
     roc       : { type, auc?, points:[[fpr,tpr],...] }
     confusion : { type, labels:[...], matrix:[[...],...] }
     heatmap   : { type, rows?:[...], cols?:[...], matrix:[[...]], showVals? } */
(function () {
  function cvar(n, d) { return (getComputedStyle(document.documentElement).getPropertyValue(n) || d).trim(); }
  const PAL = () => ({
    ink: cvar("--ink", "#e6edf3"), dim: cvar("--ink-dim", "#9aa7b4"), bd: cvar("--border", "#2a3340"),
    ac: cvar("--accent", "#4ea1ff"), ac2: cvar("--accent-2", "#7ee787"), warn: cvar("--warn", "#ffb454"),
    purple: cvar("--purple", "#c89bff"), panel: cvar("--panel", "#161c24")
  });
  function fin(v) { return typeof v === "number" && isFinite(v); }

  function drawBars(ctx, cv, s) {
    if ((!s.values || !s.values.length) && s.series && s.series.length) return drawGroupedBars(ctx, cv, s);
    const c = PAL(), W = cv.width, H = cv.height, pad = 38, bw = W - pad - 14, bh = H - pad - 26;
    const vals = (s.values || []).map(Number), labs = s.labels || [], n = vals.length || 1;
    const max = Math.max(...vals.filter(fin), 1e-9), min = Math.min(0, ...vals.filter(fin));
    const span = max - min || 1;
    ctx.strokeStyle = c.bd; ctx.lineWidth = 1; ctx.beginPath();
    ctx.moveTo(pad, 12); ctx.lineTo(pad, 12 + bh); ctx.lineTo(pad + bw, 12 + bh); ctx.stroke();
    const zero = 12 + bh - (-min / span) * bh, slot = bw / n, w = slot * 0.66;
    ctx.font = "10px sans-serif";
    vals.forEach((v, i) => {
      if (!fin(v)) return;
      const x = pad + i * slot + (slot - w) / 2, hh = (v / span) * bh, y = v >= 0 ? zero - hh : zero;
      ctx.fillStyle = (s.colors && s.colors[i]) || c.ac; ctx.fillRect(x, y, w, Math.abs(hh) || 1);
      ctx.fillStyle = c.dim; ctx.textAlign = "center"; ctx.fillText(labs[i] != null ? labs[i] : "", x + w / 2, 12 + bh + 13);
      ctx.fillStyle = c.ink; ctx.fillText((s.valueLabels && s.valueLabels[i] != null) ? s.valueLabels[i] : v, x + w / 2, (v >= 0 ? y : y + Math.abs(hh)) - 3);
    });
  }
  // Grouped/multi-series bars from a `series:[{name,color,points:[[x,y]]}]` spec (forgiving alias for line-style data).
  function drawGroupedBars(ctx, cv, s) {
    const c = PAL(), W = cv.width, H = cv.height, pad = 38, bw = W - pad - 14, bh = H - pad - 26;
    const series = s.series || [];
    const xset = [];
    series.forEach(se => (se.points || []).forEach(p => { if (!xset.includes(p[0])) xset.push(p[0]); }));
    xset.sort((a, b) => a - b);
    const n = xset.length || 1, g = series.length || 1, allY = [];
    series.forEach(se => (se.points || []).forEach(p => { if (fin(p[1])) allY.push(p[1]); }));
    const max = Math.max(...allY, 1e-9), min = Math.min(0, ...allY), span = max - min || 1;
    ctx.strokeStyle = c.bd; ctx.lineWidth = 1; ctx.beginPath();
    ctx.moveTo(pad, 12); ctx.lineTo(pad, 12 + bh); ctx.lineTo(pad + bw, 12 + bh); ctx.stroke();
    const zero = 12 + bh - (-min / span) * bh, slot = bw / n, gw = slot * 0.8 / g;
    ctx.font = "10px sans-serif";
    const labs = s.labels || xset;
    xset.forEach((xv, i) => {
      series.forEach((se, gi) => {
        const pt = (se.points || []).find(p => p[0] === xv); if (!pt || !fin(pt[1])) return;
        const v = pt[1], x = pad + i * slot + slot * 0.1 + gi * gw, hh = (v / span) * bh, y = v >= 0 ? zero - hh : zero;
        ctx.fillStyle = se.color || c.ac; ctx.fillRect(x, y, gw * 0.9, Math.abs(hh) || 1);
      });
      ctx.fillStyle = c.dim; ctx.textAlign = "center"; ctx.fillText(labs[i] != null ? labs[i] : xv, pad + i * slot + slot / 2, 12 + bh + 13);
    });
    if (g > 1) legend(ctx, cv, series.map(se => ({ name: se.name || "", color: se.color || c.ac })));
  }
  function frame(ctx, cv, padL, padT, padB) {
    ctx.strokeStyle = PAL().bd; ctx.lineWidth = 1; ctx.beginPath();
    ctx.moveTo(padL, padT); ctx.lineTo(padL, cv.height - padB); ctx.lineTo(cv.width - 14, cv.height - padB); ctx.stroke();
  }
  function scaler(cv, padL, padT, padB, xs, ys) {
    const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
    return {
      xmin, xmax, ymin, ymax,
      px: x => padL + (xmax > xmin ? (x - xmin) / (xmax - xmin) : .5) * (cv.width - padL - 14),
      py: y => (cv.height - padB) - (ymax > ymin ? (y - ymin) / (ymax - ymin) : .5) * (cv.height - padT - padB)
    };
  }
  function legend(ctx, cv, items) {
    ctx.font = "11px sans-serif"; ctx.textAlign = "left"; let y = 16;
    items.forEach(it => { ctx.fillStyle = it.color; ctx.fillRect(cv.width - 132, y - 8, 10, 10);
      ctx.fillStyle = PAL().dim; ctx.fillText(it.name, cv.width - 117, y + 1); y += 15; });
  }
  function drawLine(ctx, cv, s) {
    const c = PAL(), padL = 48, padT = 14, padB = 30, series = s.series || [];
    let xs = [], ys = []; series.forEach(se => (se.points || []).forEach(p => { if (fin(p[0]) && fin(p[1])) { xs.push(p[0]); ys.push(p[1]); } }));
    if (!xs.length) return;
    const sc = scaler(cv, padL, padT, padB, xs, ys);
    frame(ctx, cv, padL, padT, padB);
    ctx.fillStyle = c.dim; ctx.font = "10px sans-serif"; ctx.textAlign = "right";
    ctx.fillText(sc.ymax.toFixed(2), padL - 5, sc.py(sc.ymax) + 3); ctx.fillText(sc.ymin.toFixed(2), padL - 5, sc.py(sc.ymin) + 3);
    ctx.textAlign = "center";
    if (s.xlabel) ctx.fillText(s.xlabel, (padL + cv.width - 14) / 2, cv.height - 8);
    if (s.ylabel) { ctx.save(); ctx.translate(11, (padT + cv.height - padB) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(s.ylabel, 0, 0); ctx.restore(); }
    series.forEach(se => {
      ctx.strokeStyle = se.color || c.ac; ctx.lineWidth = 2; ctx.beginPath();
      (se.points || []).forEach((p, i) => { const X = sc.px(p[0]), Y = sc.py(p[1]); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
    });
    legend(ctx, cv, series.filter(se => se.name).map(se => ({ name: se.name, color: se.color || c.ac })));
  }
  function drawScatter(ctx, cv, s) {
    const c = PAL(), padL = 46, padT = 14, padB = 30, groups = s.groups || [], lines = s.lines || [];
    let xs = [], ys = [];
    groups.forEach(g => (g.points || []).forEach(p => { if (fin(p[0]) && fin(p[1])) { xs.push(p[0]); ys.push(p[1]); } }));
    lines.forEach(l => (l.points || []).forEach(p => { if (fin(p[0]) && fin(p[1])) { xs.push(p[0]); ys.push(p[1]); } }));
    if (!xs.length) return;
    const sc = scaler(cv, padL, padT, padB, xs, ys);
    frame(ctx, cv, padL, padT, padB);
    ctx.fillStyle = c.dim; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    if (s.xlabel) ctx.fillText(s.xlabel, (padL + cv.width - 14) / 2, cv.height - 8);
    if (s.ylabel) { ctx.save(); ctx.translate(11, (padT + cv.height - padB) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(s.ylabel, 0, 0); ctx.restore(); }
    groups.forEach(g => { ctx.fillStyle = g.color || c.ac;
      (g.points || []).forEach(p => { if (!fin(p[0]) || !fin(p[1])) return; ctx.beginPath(); ctx.arc(sc.px(p[0]), sc.py(p[1]), 3.2, 0, 7); ctx.fill(); }); });
    lines.forEach(l => { ctx.strokeStyle = l.color || c.warn; ctx.lineWidth = 2; if (l.dash) ctx.setLineDash([5, 4]);
      ctx.beginPath(); (l.points || []).forEach((p, i) => { const X = sc.px(p[0]), Y = sc.py(p[1]); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); ctx.setLineDash([]); });
    legend(ctx, cv, groups.filter(g => g.name).map(g => ({ name: g.name, color: g.color || c.ac })));
  }
  function drawRoc(ctx, cv, s) {
    const c = PAL(), padL = 44, padT = 14, padB = 30, sz = Math.min(cv.width - padL - 20, cv.height - padT - padB);
    const x0 = padL, y0 = cv.height - padB, px = f => x0 + f * sz, py = t => y0 - t * sz;
    frame(ctx, cv, padL, padT, padB);
    ctx.strokeStyle = c.dim; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(1), py(1)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = c.ac2; ctx.lineWidth = 2; ctx.beginPath();
    (s.points || [[0, 0], [1, 1]]).forEach((p, i) => { i ? ctx.lineTo(px(p[0]), py(p[1])) : ctx.moveTo(px(p[0]), py(p[1])); }); ctx.stroke();
    ctx.fillStyle = c.ink; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
    if (s.auc != null) ctx.fillText("AUC = " + s.auc, px(0.42), py(0.18));
    ctx.fillStyle = c.dim; ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.fillText("false positive rate", (px(0) + px(1)) / 2, cv.height - 8);
  }
  function drawConfusion(ctx, cv, s) {
    const c = PAL(), labs = s.labels || [], M = s.matrix || [], n = M.length || 1;
    const top = 22, left = 74, cell = Math.min(58, (cv.height - top - 24) / n, (cv.width - left - 14) / n);
    let max = 1; M.forEach(r => r.forEach(v => { if (+v > max) max = +v; }));
    ctx.font = "11px sans-serif";
    for (let i = 0; i < n; i++) for (let j = 0; j < (M[i] || []).length; j++) {
      const v = +(M[i][j] || 0), x = left + j * cell, y = top + i * cell, a = 0.12 + 0.85 * (v / max);
      ctx.fillStyle = (i === j ? "rgba(46,160,67," : "rgba(78,161,255,") + a.toFixed(2) + ")"; ctx.fillRect(x, y, cell - 2, cell - 2);
      ctx.fillStyle = c.ink; ctx.textAlign = "center"; ctx.fillText(v, x + cell / 2 - 1, y + cell / 2 + 3);
    }
    ctx.fillStyle = c.dim; ctx.textAlign = "right"; labs.forEach((l, i) => ctx.fillText(l, left - 6, top + i * cell + cell / 2 + 3));
    ctx.textAlign = "center"; labs.forEach((l, j) => ctx.fillText(l, left + j * cell + cell / 2, top - 7));
    ctx.fillStyle = c.dim; ctx.textAlign = "left"; ctx.fillText("rows = actual, cols = predicted", left, top + n * cell + 15);
  }
  function drawHeatmap(ctx, cv, s) {
    const c = PAL(), M = s.matrix || [], rows = M.length || 1, cols = (M[0] || []).length || 1;
    const top = s.cols ? 20 : 8, left = s.rows ? 56 : 8;
    const cw = (cv.width - left - 12) / cols, ch = (cv.height - top - 14) / rows;
    let mx = -Infinity, mn = Infinity; M.forEach(r => r.forEach(v => { if (fin(+v)) { mx = Math.max(mx, +v); mn = Math.min(mn, +v); } }));
    const span = (mx - mn) || 1; ctx.font = "10px sans-serif";
    for (let i = 0; i < rows; i++) for (let j = 0; j < (M[i] || []).length; j++) {
      const v = +M[i][j], a = fin(v) ? (v - mn) / span : 0;
      ctx.fillStyle = "rgba(78,161,255," + (0.1 + 0.85 * a).toFixed(2) + ")"; ctx.fillRect(left + j * cw, top + i * ch, cw - 1, ch - 1);
      if (s.showVals && cw > 26) { ctx.fillStyle = c.ink; ctx.textAlign = "center"; ctx.fillText(fin(v) ? (Math.round(v * 100) / 100) : "", left + j * cw + cw / 2, top + i * ch + ch / 2 + 3); }
    }
    ctx.fillStyle = c.dim; ctx.textAlign = "right"; (s.rows || []).forEach((l, i) => ctx.fillText(l, left - 5, top + i * ch + ch / 2 + 3));
    ctx.textAlign = "center"; (s.cols || []).forEach((l, j) => ctx.fillText(l, left + j * cw + cw / 2, top - 6));
  }
  const DRAW = { bar: drawBars, bars: drawBars, hist: drawBars, line: drawLine, scatter: drawScatter, roc: drawRoc, confusion: drawConfusion, heatmap: drawHeatmap };
  window.Charts = {
    draw(canvas, spec) {
      if (!canvas || !spec || !DRAW[spec.type]) return false;
      const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height);
      try { DRAW[spec.type](ctx, canvas, spec); return true; } catch (e) { return false; }
    }
  };
})();
