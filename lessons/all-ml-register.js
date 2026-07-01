/* All ML — registration + a SEPARATE textbook renderer for the ml-math-tutor app.
   Reads window.ALLML (topics) and window.ALLML_CONTENT (authored bodies) and:
     1) defines window.renderAllMLLesson() — a NEW renderer, deliberately separate
        from the app's renderPaper/renderBook/renderMath/... so the four-section
        spec (Context, Intuition, Mathematics, Pitfalls) is preserved exactly;
     2) pushes the topics into window.LESSONS under the "All ML" supergroup, with
        module = plain part NAME (no "Part N") and title-only nav entries (no "N.N");
     3) injects the small amount of CSS the four-section layout needs on top of the
        app's existing textbook reading mode.
   Content is authored per id in all-ml-content.js; topics with none render as scaffolds. */
(function () {
  var PARTS = window.ALLML_PARTS || [];
  var CONTENT = window.ALLML_CONTENT || {};
  var partName = {};
  PARTS.forEach(function (p) { partName[p.num] = p.name; });

  var SECTIONS = [
    { key: "context", label: "Context",
      hint: "How prior topics feed in, and how this topic feeds forward to later lessons." },
    { key: "intuition", label: "Intuition",
      hint: "The problem, the pain in the older approach, the mental model, and the key design decision." },
    { key: "mathematics", label: "Mathematics",
      hint: "The formula with every symbol and shape named, plus worked numeric examples shown step by step." },
    { key: "pitfalls", label: "Pitfalls",
      hint: "Real bugs and their mechanisms, not just symptoms." }
  ];

  // The NEW renderer. Returns the lesson HTML for App.open() to inject into #content.
  window.renderAllMLLesson = function (l, prevId, nextId, byId) {
    byId = byId || {};
    function card(s) {
      var body = l[s.key]
        ? l[s.key]
        : '<p class="sec-hint">' + s.hint + '</p><p class="scaffold-note">Content to be authored.</p>';
      return '<div class="card allml ' + s.key + '"><h3>' + s.label + '</h3>' + body + '</div>';
    }
    var colab = l.colab
      ? '<a class="colab-btn" href="' + l.colab + '" target="_blank" rel="noopener">\u25B6 Open in Colab</a>'
      : '<span class="colab-btn off" title="Notebook not built yet">\u25B6 Open in Colab (pending)</span>';
    var toolbar = '<div class="allml-toolbar">' + colab + '</div>';
    var nav = '<div class="nav-row">' +
      '<button ' + (prevId ? 'onclick="App.open(\'' + prevId + '\')"' : 'disabled') + '>' +
        '<span>\u2190 Previous</span>' + (prevId && byId[prevId] ? byId[prevId].title : '') + '</button>' +
      '<button class="next" ' + (nextId ? 'onclick="App.open(\'' + nextId + '\')"' : 'disabled') + '>' +
        '<span>Next \u2192</span>' + (nextId && byId[nextId] ? byId[nextId].title : '') + '</button>' +
      '</div>';
    return '<div class="allml-doc">' +
      '<div class="crumbs">All ML \u203A ' + (partName[l.part] || '') + '</div>' +
      '<h2 class="lesson-title">' + l.title + '</h2>' +
      (l.tagline ? '<p class="lesson-sub">' + l.tagline + '</p>' : '') +
      toolbar +
      SECTIONS.map(card).join('') +
      nav +
      '</div>';
  };

  // Register topics into the app's global lesson list, grouped as "All ML".
  window.LESSONS = window.LESSONS || [];
  window.MODULE_ORDER = window.MODULE_ORDER || [];
  var seen = {};
  (window.ALLML || []).forEach(function (t) {
    var c = CONTENT[t.id] || {};
    window.LESSONS.push({
      id: t.id, title: t.title, part: t.part, gap: t.gap,
      colab: c.colab || t.colab, tagline: c.tagline,
      context: c.context, intuition: c.intuition, mathematics: c.mathematics, pitfalls: c.pitfalls,
      module: partName[t.part], superGroup: "All ML", template: "allml"
    });
    if (!seen[t.part]) { seen[t.part] = true; window.MODULE_ORDER.push(partName[t.part]); }
  });

  // Scoped CSS layered on top of the app's textbook reading mode (#content).
  var css = [
    '#content .allml-doc .lesson-sub { font-style: normal; }',
    '#content .allml-toolbar { display:flex; gap:10px; align-items:center; margin:0 0 34px; flex-wrap:wrap; }',
    '#content .colab-btn.off { opacity:.5; cursor:not-allowed; }',
    '#content .card.allml .sec-hint { color:var(--ink-dim); font-size:15px; margin:0 0 4px; }',
    '#content .card.allml ol.work { margin:12px 0 16px; padding-left:24px; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; font-size:15px; }',
    '#content .card.allml ol.work li { margin:5px 0; font-variant-numeric:tabular-nums; line-height:1.5; }',
    '#content .card.allml .formula-box { text-align:center; }',
    '#content .card.allml table.mini { border-collapse:collapse; margin:16px 0; font-size:15px; line-height:1.45; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; }',
    '#content .card.allml table.mini th, #content .card.allml table.mini td { padding:6px 18px 6px 0; text-align:left; border-bottom:1px solid var(--border); vertical-align:top; }',
    '#content .card.allml table.mini tr:first-child th { font-weight:700; color:var(--ink); border-bottom:2px solid var(--ink); }',
    '#content .card.allml table.mini tr:last-child td { border-bottom:none; }'
  ].join('\n');
  var st = document.createElement('style');
  st.id = 'allml-style';
  st.textContent = css;
  document.head.appendChild(st);
})();
