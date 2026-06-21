/* =====================================================================
   METRICS & EVALUATION LESSON (BEGINNER) — "met-ranking"
   Metrics for rankings & search results.
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-ranking",
    title: "Metrics for rankings & search results",
    tagline: "A correct answer at rank 1 beats the same answer at rank 10 — ranking metrics reward good ORDER, not just the right set.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["ml-classification-metrics"],

    whenToUse:
      `<p><b>Reach for a ranking metric whenever your model returns a sorted list and the reader looks at the top first.</b> Search results, a recommendation feed, "people you may know", retrieved documents for a RAG (Retrieval-Augmented Generation) prompt, the top fraud alerts a team will review — in all of these, the model's job is to put the good stuff <i>near the top</i>. Plain accuracy is blind to order; ranking metrics are built around it.</p>
       <p>The single idea that unites this whole family: <b>position matters.</b> A relevant result at rank 1 is worth more than the same result at rank 10, because users read top-down and rarely scroll. Every metric below is a different way of turning "good things near the top" into one number.</p>
       <p><b>Which metric when</b> (the short version — we define each below):</p>
       <ul>
         <li><b>NDCG@k (Normalized Discounted Cumulative Gain at k)</b> — use it when relevance is <i>graded</i> (a result can be "perfect", "okay", or "useless", not just yes/no) and position should be weighted smoothly. The default for web search and recommendations.</li>
         <li><b>MAP (Mean Average Precision)</b> — use it when relevance is <i>binary</i> (relevant or not) and you care about getting <i>all</i> the relevant items high, averaged across many queries.</li>
         <li><b>MRR (Mean Reciprocal Rank)</b> — use it when only the <i>first</i> correct answer matters (a question-answering box, "I'm feeling lucky", a single intended destination).</li>
         <li><b>Recall@k / Precision@k</b> — use them when you only show or act on the top $k$ items. Recall@k = "did the top $k$ catch the relevant ones?"; Precision@k = "of the top $k$, how many were relevant?".</li>
         <li><b>Hit rate / success@k</b> — use it when you only need <i>at least one</i> relevant item in the top $k$ (did we satisfy the user at all?).</li>
         <li><b>Kendall's $\\tau$ / Spearman's $\\rho$</b> — use these when you want to compare a <i>whole predicted order</i> against a <i>whole true order</i> (do two rankings agree?), rather than scoring relevance.</li>
       </ul>
       <p>This lesson powers the <b>Search &amp; Ranking</b> lab, and pairs with <code>met-recsys</code> (recommender-system metrics), which reuses NDCG, MAP and hit rate on user–item lists.</p>`,

    application:
      `<p>These metrics are the scoreboard for almost everything that returns a list. <b>Web search</b> (Google, Bing) tunes rankers against NDCG. <b>Recommender feeds</b> (YouTube, Spotify, Amazon) report NDCG@k, Recall@k and hit rate — see <code>met-recsys</code>. <b>Question answering</b> and <b>entity linking</b> live on MRR, because one right answer at the top is the whole game. <b>RAG (Retrieval-Augmented Generation)</b> pipelines measure Recall@k of the retriever — "did the right passage make it into the top $k$ we feed the model?". <b>Learning-to-rank</b> systems (LambdaMART, the gradient-boosting ranker in the Search &amp; Ranking lab) are trained to directly push NDCG up. And <b>A/B test analysis</b> of two ranked lists uses Kendall's $\\tau$ / Spearman's $\\rho$ to ask whether a new ranker really reordered things or just shuffled noise.</p>`,

    pitfalls:
      `<ul>
         <li><b>Averaging over queries with different numbers of relevant items.</b> Tell: you compute Recall@10 per query and average, but query A has 2 relevant docs and query B has 50. Recall@10 can be at most 1.0 for A but is capped at 10/50 = 0.2 for B — B is doomed to look bad no matter how good the ranker is. <i>Fix:</i> prefer a <b>normalized</b> metric (NDCG divides by the ideal, so a query's best-possible score is always 1.0), or report R-precision / recall at each query's own number of relevant items.</li>
         <li><b>Picking $k$ to flatter the result.</b> Tell: the headline is "Recall@100 = 0.95" but users only see the first 10. The choice of $k$ must match where users actually look (the screen, the budget, the context window). Report the $k$ you ship, not the $k$ that looks best.</li>
         <li><b>Ignoring position entirely.</b> Tell: the metric is plain Precision@k or hit rate, which treat rank 1 and rank $k$ as equal. If <i>order within the top $k$</i> matters, that metric is blind to it — use NDCG or MAP, which discount lower positions.</li>
         <li><b>Binary metric on graded relevance (or vice-versa).</b> Tell: results are labelled 0/1/2/3 ("bad"…"perfect") but you score with MAP, which only knows relevant/not — you throw away the grades. <i>Fix:</i> use NDCG, which uses the grades as <b>gains</b>. The reverse (NDCG with only 0/1 labels) is fine but then NDCG and MAP measure similar things.</li>
         <li><b>Comparing NDCG across query sets with different ideal lists.</b> NDCG is normalized <i>per query</i>, which is the right fix for the recall problem above — but it means a 0.7 on an easy query set and a 0.7 on a hard set are not the same difficulty. Compare rankers on the <i>same</i> query set, not across sets.</li>
         <li><b>Treating Kendall's $\\tau$ and Spearman's $\\rho$ as relevance metrics.</b> Tell: someone reports $\\tau$ to say "the ranker is good". $\\tau$/$\\rho$ measure <i>agreement between two orderings</i>, not whether the top items are relevant. Use them to compare a predicted order to a gold order, not to grade relevance.</li>
       </ul>`,

    bigIdea:
      `<p>Start with the everyday picture. You search for a recipe. The engine returns 10 links. You glance at the top one or two, maybe scroll a little, then either click or give up. <b>You almost never reach the bottom.</b> So a ranker that buries the perfect recipe at position 9 has failed you — even though, as a <i>set</i>, it "found" the right page.</p>
       <p>That is the core insight: a ranked list is judged top-down, with attention fading as you go down. A good ranking metric must therefore (1) reward putting relevant items high, and (2) discount items that sit lower. "Relevant" can be <b>binary</b> (relevant / not) or <b>graded</b> (a 0–3 score of how good a match is). The whole family below is built from those two ingredients — a notion of relevance, and a way to weight by position.</p>
       <p>One more split: some metrics score <b>one list against a set of relevant items</b> (Precision@k, NDCG, MAP, MRR). Others compare <b>two whole orderings against each other</b> (Kendall's $\\tau$, Spearman's $\\rho$) — "does my predicted order agree with the gold order?".</p>`,

    buildup:
      `<p>Set up the vocabulary once and we can define every metric quickly.</p>
       <ul>
         <li>A <b>query</b> $q$ (a search, a user, a question) has a ranked list of returned items $\\,i_1, i_2, \\dots\\,$, best first. The <b>rank</b> of an item is its position (1 is the top).</li>
         <li>Each item has a <b>relevance</b> $rel_i$. <b>Binary:</b> $rel_i \\in \\{0,1\\}$ (relevant or not). <b>Graded:</b> $rel_i \\in \\{0,1,2,3,\\dots\\}$ (how good it is).</li>
         <li><b>$k$</b> is the cutoff — how far down the list we look (the screen, the budget). "@k" means "computed over the top $k$ items".</li>
         <li>A <b>position discount</b> is a weight that shrinks as rank grows, so lower positions count less. DCG uses $\\dfrac{1}{\\log_2(\\text{rank}+1)}$.</li>
       </ul>
       <p>Now the family, building up from binary set-overlap to position-weighted graded scores:</p>
       <ol>
         <li><b>Precision@k</b> $=\\dfrac{\\#\\{\\text{relevant in top }k\\}}{k}$ — of the top $k$, what fraction are relevant. (No position weighting inside the top $k$.)</li>
         <li><b>Recall@k</b> $=\\dfrac{\\#\\{\\text{relevant in top }k\\}}{\\#\\{\\text{relevant total}\\}}$ — of all the relevant items that exist, what fraction made it into the top $k$.</li>
         <li><b>F1@k</b> $=\\dfrac{2\\cdot \\text{Precision@}k\\cdot \\text{Recall@}k}{\\text{Precision@}k+\\text{Recall@}k}$ — the harmonic mean of the two, a single balance number (high only when <i>both</i> are high).</li>
         <li><b>Hit rate / success@k</b> $= \\mathbf 1[\\text{at least one relevant item in top }k]$ — a 0/1 flag: did we satisfy the user at all? Averaged over queries it is the fraction of queries with a hit in the top $k$.</li>
         <li><b>MRR (Mean Reciprocal Rank)</b>: for each query take $\\dfrac{1}{\\text{rank of the first relevant item}}$ (a "reciprocal rank"), then average over queries. First hit at rank 1 ⇒ 1.0; at rank 4 ⇒ 0.25; never ⇒ 0. Only the first hit matters.</li>
         <li><b>AP (Average Precision)</b> for one query: walk down the list, and every time you hit a relevant item, record the Precision@(its rank); average those values over all relevant items. It rewards clustering the relevant items high. <b>MAP (Mean Average Precision)</b> is AP averaged over all queries.</li>
         <li><b>DCG (Discounted Cumulative Gain)</b>: add up each item's gain divided by its position discount — $\\text{DCG@}k=\\sum_{r=1}^{k}\\dfrac{rel_r}{\\log_2(r+1)}$ (one common form; a variant uses $2^{rel_r}-1$ as the gain to reward highly-relevant items more). High gains high up score most.</li>
         <li><b>NDCG@k (Normalized DCG)</b> $=\\dfrac{\\text{DCG@}k}{\\text{IDCG@}k}$, where IDCG (Ideal DCG) is the DCG of the <i>best possible</i> ordering. Dividing by the ideal puts every query on a 0–1 scale, so queries with different numbers of relevant items are comparable. This is the workhorse metric.</li>
         <li><b>ERR (Expected Reciprocal Rank)</b>: a "cascade" metric. It models a user reading top-down who <i>stops</i> once satisfied. The chance an item satisfies grows with its grade; ERR is the expected $1/\\text{rank}$ at which the user stops. It discounts an item by how likely the user already stopped above it — so a great result low down is heavily penalized.</li>
         <li><b>Kendall's $\\tau$ / Spearman's $\\rho$</b>: rank-correlation coefficients in $[-1, 1]$ comparing two full orderings. $+1$ = identical order, $-1$ = exactly reversed, $0$ = unrelated. $\\tau$ counts agreeing vs. disagreeing pairs; $\\rho$ is Pearson correlation on the ranks.</li>
       </ol>`,

    symbols: [
      { sym: "$q$", desc: "a query — one search, one user, or one question, each with its own ranked list of results." },
      { sym: "$k$", desc: "the cutoff: how far down the ranked list we look ('@k' = computed over the top $k$ items)." },
      { sym: "$r$", desc: "a rank (position) in the list; $r=1$ is the top." },
      { sym: "$rel_r$", desc: "the relevance of the item at rank $r$. Binary: 0 or 1. Graded: 0,1,2,3,… (how good the match is)." },
      { sym: "$\\mathbf 1[\\cdot]$", desc: "the indicator: 1 if the condition inside is true, else 0 (used for hit rate / success@k)." },
      { sym: "$\\log_2$", desc: "the base-2 logarithm — the position discount $1/\\log_2(r+1)$ shrinks slowly as rank grows, so lower ranks count less." },
      { sym: "$\\text{DCG@}k$", desc: "Discounted Cumulative Gain over the top $k$: the sum of each item's gain divided by its position discount." },
      { sym: "$\\text{IDCG@}k$", desc: "Ideal DCG: the DCG of the best-possible ordering of those items (used to normalize NDCG)." },
      { sym: "$\\text{AP}(q)$", desc: "Average Precision for query $q$: the mean of Precision@rank taken at each relevant item's position." },
      { sym: "$\\text{rank}_1(q)$", desc: "the rank of the FIRST relevant item for query $q$ (used by MRR)." },
      { sym: "$Q$", desc: "the number of queries we average over (MAP, MRR, mean NDCG are all averages over $Q$ queries)." },
      { sym: "$\\tau,\\ \\rho$", desc: "Kendall's tau and Spearman's rho: rank-correlation scores in $[-1,1]$ comparing two whole orderings." }
    ],

    formula: `$$\\text{P@}k=\\frac{\\#\\text{rel in top }k}{k},\\quad \\text{R@}k=\\frac{\\#\\text{rel in top }k}{\\#\\text{rel total}},\\quad \\text{F1@}k=\\frac{2\\,\\text{P@}k\\,\\text{R@}k}{\\text{P@}k+\\text{R@}k}$$
$$\\text{MRR}=\\frac1Q\\sum_{q}\\frac{1}{\\text{rank}_1(q)},\\qquad \\text{MAP}=\\frac1Q\\sum_q \\text{AP}(q),\\quad \\text{AP}(q)=\\frac{1}{\\#\\text{rel}}\\sum_{r:\\,rel_r=1}\\text{P@}r$$
$$\\text{DCG@}k=\\sum_{r=1}^{k}\\frac{rel_r}{\\log_2(r+1)},\\qquad \\text{NDCG@}k=\\frac{\\text{DCG@}k}{\\text{IDCG@}k}\\in[0,1]$$`,

    whatItDoes:
      `<p><b>Precision@k / Recall@k / F1@k</b> are the binary "did the top $k$ contain the relevant items?" trio. Precision asks "how clean is the top $k$", Recall asks "how much of the good stuff did we capture", and F1 balances both. None of them weights position <i>inside</i> the top $k$.</p>
       <p><b>MRR</b> rewards getting the first correct answer as high as possible — it is $1/\\text{rank}$ of that first hit, averaged over queries, and ignores everything after the first hit. <b>MAP</b> rewards getting <i>all</i> relevant items high: its AP term re-measures precision each time a relevant item appears, so clustering relevant items near the top scores best.</p>
       <p><b>DCG</b> sums position-discounted gains, so a high-grade item high up contributes most; <b>NDCG</b> divides DCG by the ideal ordering's DCG, putting every query on a 0–1 scale and making queries with different relevance counts directly comparable. <b>ERR</b> goes further: it models a user who stops scrolling once satisfied, so a strong result is worth less if strong results already sit above it. <b>Kendall's $\\tau$ / Spearman's $\\rho$</b> step outside relevance entirely and just measure how much two orderings agree.</p>`,

    derivation:
      `<p><b>Why the $\\log_2$ discount?</b> We want lower positions to count less, but not collapse to zero — moving from rank 1 to 2 should hurt more than moving from rank 100 to 101 (users barely notice deep changes). The function $1/\\log_2(r+1)$ does exactly that: it equals $1$ at rank 1, $\\approx 0.63$ at rank 2, $\\approx 0.5$ at rank 3, and keeps shrinking, but ever more gently. So early positions are heavily rewarded and deep positions are nearly flat — matching how attention actually fades.</p>
       <ul class="steps">
         <li><b>DCG.</b> Give each item a gain (its relevance). Weight by the discount and sum: $\\text{DCG@}k=\\sum_{r=1}^k rel_r/\\log_2(r+1)$. A relevant item at rank 1 adds its full gain; the same item at rank 8 adds only $1/\\log_2 9 \\approx 0.32$ of it. <i>Position is now baked in.</i></li>
         <li><b>The problem with raw DCG.</b> Its size depends on how many relevant items a query has — a query with 10 relevant items can reach a much bigger DCG than one with 2. You cannot average raw DCG across queries fairly (this is the "different numbers of relevant items" pitfall).</li>
         <li><b>NDCG fixes it.</b> Sort the items by relevance to get the <i>best possible</i> list, and compute its DCG — that is the Ideal DCG (IDCG@k). Then $\\text{NDCG@}k=\\text{DCG@}k/\\text{IDCG@}k$. Now a perfect ranking scores exactly $1.0$ <i>for every query</i>, regardless of how many relevant items it has, so averaging is fair. $\\blacksquare$</li>
       </ul>
       <p><b>Why MRR is a reciprocal.</b> We want first-hit-at-rank-1 to score 1 and have the score fall off as the first hit sinks. $1/\\text{rank}$ does this cleanly: rank 1 ⇒ 1, rank 2 ⇒ 0.5, rank 5 ⇒ 0.2. The fall-off is steep early (rank 1 vs 2 is a big drop) and shallow late (rank 50 vs 51 barely differs) — again matching attention.</p>
       <p><b>Why AP rewards clustering.</b> AP averages Precision@r over the positions where relevant items land. Precision@r is high when relevant items appear early (the numerator fills up while $r$ is still small), so packing the relevant items at the top maximizes AP. A relevant item buried deep is multiplied by a small precision, dragging AP down — that is how MAP encodes "all the good stuff near the top".</p>`,

    example:
      `<p>One query. The engine returns 5 results; the ✓ are relevant (binary), the ✗ are not, top first:</p>
       <p><code>rank 1: ✗ &nbsp; rank 2: ✓ &nbsp; rank 3: ✗ &nbsp; rank 4: ✓ &nbsp; rank 5: ✗</code> &nbsp; (2 relevant items total)</p>
       <ul class="steps">
         <li><b>Precision@3</b> = (relevant in top 3)/3 = 1/3 ≈ <b>0.33</b>. <b>Precision@5</b> = 2/5 = <b>0.40</b>.</li>
         <li><b>Recall@3</b> = (relevant in top 3)/(total relevant) = 1/2 = <b>0.50</b>. <b>Recall@5</b> = 2/2 = <b>1.0</b>.</li>
         <li><b>F1@3</b> = $\\dfrac{2(0.33)(0.50)}{0.33+0.50} = \\dfrac{0.33}{0.83} ≈$ <b>0.40</b>.</li>
         <li><b>Hit rate / success@3</b> = 1 (there <i>is</i> a relevant item in the top 3). success@1 = 0 (rank 1 was ✗).</li>
         <li><b>MRR (this single query)</b>: first relevant item is at rank 2, so RR = 1/2 = <b>0.50</b>.</li>
         <li><b>AP</b>: relevant items sit at ranks 2 and 4. Precision@2 = 1/2 = 0.50; Precision@4 = 2/4 = 0.50. AP = (0.50 + 0.50)/2 = <b>0.50</b>. (Over many queries this becomes MAP.)</li>
         <li><b>DCG@5</b> (binary gains): $\\frac{0}{\\log_2 2}+\\frac{1}{\\log_2 3}+\\frac{0}{\\log_2 4}+\\frac{1}{\\log_2 5}+\\frac{0}{\\log_2 6} = 0.631 + 0.431 = $ <b>1.062</b>.</li>
         <li><b>IDCG@5</b>: the ideal puts both ✓ at ranks 1–2: $\\frac{1}{\\log_2 2}+\\frac{1}{\\log_2 3} = 1.0 + 0.631 = $ <b>1.631</b>. So <b>NDCG@5</b> = 1.062 / 1.631 ≈ <b>0.65</b>.</li>
       </ul>
       <p>Notice the story the numbers tell: Recall@5 is a perfect 1.0 (we found both relevant items), but NDCG@5 is only 0.65 — because we put them at ranks 2 and 4 instead of 1 and 2. <b>The set was right; the order was not, and the position-aware metric caught it.</b> That gap is the entire reason ranking metrics exist.</p>`,

    demo: function (host) {
      var c = (function () {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      })();
      var wrap = document.createElement("div");
      var instr = document.createElement("p");
      instr.innerHTML = "Click any result to flip it between <b>relevant (✓)</b> and <b>not (✗)</b>. Watch how the same set of relevant items scores differently depending on WHERE they sit. Position is the whole point.";
      instr.style.color = c.dim; instr.style.margin = "0 0 8px";
      wrap.appendChild(instr);

      // 8 results, relevance flippable. Start with relevant items buried low to show the effect.
      var rel = [0, 0, 1, 0, 1, 0, 0, 1];
      var rowsHost = document.createElement("div");
      wrap.appendChild(rowsHost);
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "10px"; readout.style.lineHeight = "1.6";
      wrap.appendChild(readout);
      host.appendChild(wrap);

      function dcg(arr, k) {
        var s = 0;
        for (var r = 0; r < k && r < arr.length; r++) s += arr[r] / (Math.log(r + 2) / Math.log(2));
        return s;
      }
      function ndcg(arr, k) {
        var ideal = arr.slice().sort(function (a, b) { return b - a; });
        var id = dcg(ideal, k);
        return id > 0 ? dcg(arr, k) / id : 0;
      }
      function compute() {
        var k = rel.length;
        var totalRel = rel.reduce(function (a, b) { return a + b; }, 0);
        var hitsTopK = rel.reduce(function (a, b) { return a + b; }, 0);
        var pAtK = hitsTopK / k;
        var rAtK = totalRel > 0 ? hitsTopK / totalRel : 0;
        var first = -1; for (var i = 0; i < rel.length; i++) { if (rel[i] === 1) { first = i + 1; break; } }
        var rr = first > 0 ? 1 / first : 0;
        // AP
        var hits = 0, apSum = 0;
        for (var r = 0; r < rel.length; r++) { if (rel[r] === 1) { hits++; apSum += hits / (r + 1); } }
        var ap = totalRel > 0 ? apSum / totalRel : 0;
        var nd = ndcg(rel, k);
        var success3 = (rel[0] || rel[1] || rel[2]) ? 1 : 0;
        return { totalRel: totalRel, pAtK: pAtK, rAtK: rAtK, rr: rr, first: first, ap: ap, nd: nd, success3: success3 };
      }
      function render() {
        rowsHost.innerHTML = "";
        for (var i = 0; i < rel.length; i++) {
          (function (idx) {
            var row = document.createElement("div");
            row.style.cssText = "display:flex;align-items:center;gap:10px;padding:5px 8px;margin:3px 0;border:1px solid " + c.border + ";border-radius:6px;cursor:pointer;background:" + c.panel + ";";
            var pos = document.createElement("span"); pos.textContent = "rank " + (idx + 1); pos.style.cssText = "color:" + c.dim + ";min-width:54px;font-size:12px;";
            var bar = document.createElement("span");
            var w = Math.round(100 / (Math.log(idx + 2) / Math.log(2)));
            bar.style.cssText = "height:8px;width:" + w + "px;border-radius:4px;background:" + c.dim + ";opacity:.4;";
            bar.title = "position weight 1/log2(rank+1)";
            var mark = document.createElement("span");
            mark.textContent = rel[idx] ? "✓ relevant" : "✗ not";
            mark.style.cssText = "font-weight:600;color:" + (rel[idx] ? c.accent2 : c.dim) + ";min-width:92px;";
            row.appendChild(pos); row.appendChild(mark); row.appendChild(bar);
            row.addEventListener("click", function () { rel[idx] = rel[idx] ? 0 : 1; render(); });
            rowsHost.appendChild(row);
          })(i);
        }
        var m = compute();
        readout.innerHTML =
          "<b>" + m.totalRel + "</b> relevant items, " + rel.length + " results shown.<br>" +
          "Precision@" + rel.length + " = <b>" + m.pAtK.toFixed(3) + "</b> &nbsp;·&nbsp; Recall@" + rel.length + " = <b>" + m.rAtK.toFixed(3) + "</b> &nbsp;·&nbsp; success@3 = <b>" + m.success3 + "</b><br>" +
          "MRR (first hit at rank " + (m.first > 0 ? m.first : "—") + ") = <b>" + m.rr.toFixed(3) + "</b> &nbsp;·&nbsp; AP = <b>" + m.ap.toFixed(3) + "</b><br>" +
          "<span style='color:" + c.accent + "'>NDCG@" + rel.length + " = <b>" + m.nd.toFixed(3) + "</b></span> &nbsp;— move the same ✓ up and NDCG rises even though Precision/Recall don't change.";
      }
      render();
    },

    practice: [
      {
        q: `Two rankers return the SAME 5 documents and find the SAME 2 relevant ones, so both have Recall@5 = 1.0. Ranker A places the relevant docs at ranks 1 and 2; Ranker B places them at ranks 4 and 5. A stakeholder says "they're tied — both found everything." Are they tied? Which single metric best shows the difference, and why?`,
        steps: [
          { do: `Notice what Recall@5 ignores.`, why: `Recall@k only asks whether the relevant items are somewhere in the top $k$ — it says nothing about WHERE in the top $k$. Both rankers captured both relevant docs, so both score 1.0.` },
          { do: `Bring in position.`, why: `Users read top-down, so ranks 1–2 (Ranker A) are far better than ranks 4–5 (Ranker B). We need a metric that discounts lower positions.` },
          { do: `Pick NDCG@5.`, why: `NDCG weights each relevant item by $1/\\log_2(\\text{rank}+1)$ and normalizes by the ideal. Ranker A is the ideal ordering, so NDCG = 1.0; Ranker B is penalized for the deep placements, scoring well below 1.0.` }
        ],
        answer: `<p><b>Not tied.</b> Recall@5 is identical (1.0 for both) precisely because it is blind to order. <b>NDCG@5</b> best exposes the gap: Ranker A places both relevant docs at ranks 1–2, which is the ideal ordering, so NDCG@5 = 1.0; Ranker B's docs at ranks 4–5 get discounted by $1/\\log_2 5 \\approx 0.43$ and $1/\\log_2 6 \\approx 0.39$, dragging its NDCG well below 1.0. (MRR would also separate them — A's first hit is rank 1 ⇒ 1.0, B's is rank 4 ⇒ 0.25 — but MRR only looks at the FIRST hit, whereas NDCG accounts for both relevant items.)</p>`
      },
      {
        q: `Your search log has two query types: "navigational" queries where the user wants exactly ONE specific page (their bank's login), and "research" queries where the user wants to gather MANY relevant articles. You can only headline one metric per type. Which metric for each, and why not use the same one for both?`,
        steps: [
          { do: `Characterize the navigational query.`, why: `Success means the one intended page is at the very top; everything else is irrelevant. Only the rank of that first (and only) correct result matters.` },
          { do: `Pick MRR for navigational.`, why: `MRR = $1/\\text{rank}$ of the first relevant hit. It is exactly "how high did we put the one right answer", which is the entire goal for navigational queries.` },
          { do: `Characterize the research query.`, why: `Here there are many relevant articles and the user wants them all surfaced high — getting one right is not enough.` },
          { do: `Pick MAP (or NDCG) for research.`, why: `MAP rewards pulling ALL relevant items toward the top (it re-measures precision at each relevant item). NDCG works too, and is preferred if relevance is graded rather than binary.` }
        ],
        answer: `<p><b>Navigational ⇒ MRR.</b> Only one page is correct and only its rank matters, so the reciprocal rank of the first (and only) hit is the right scoreboard. <b>Research ⇒ MAP</b> (or NDCG@k for graded relevance). The user wants every relevant article surfaced high, and MAP averages precision over <i>all</i> relevant items, rewarding rankings that cluster them near the top. Using MRR for research would ignore everything after the first hit; using MAP for navigational is overkill (and noisier) when there is exactly one correct answer.</p>`
      },
      {
        q: `A teammate builds an offline eval: for each of 1,000 queries they compute Recall@10 and average them. Query set A has ~3 relevant docs per query; query set B has ~40 relevant docs per query. The ranker scores great on A but "terribly" on B, and they conclude the ranker is broken for B-type queries. What is the flaw, and what should they report instead?`,
        steps: [
          { do: `Compute the ceiling on Recall@10 for each set.`, why: `For B, at most 10 relevant docs can fit in the top 10, but there are ~40 relevant, so Recall@10 is capped at 10/40 = 0.25 no matter how perfect the ranker is. For A (3 relevant) it can reach 1.0.` },
          { do: `Spot the unfair comparison.`, why: `The metric's maximum differs across query sets, so averaging Recall@10 penalizes B for having more relevant items — an artifact, not a ranker failure.` },
          { do: `Switch to a normalized or per-query-sized metric.`, why: `NDCG normalizes by each query's ideal (best-possible = 1.0 for every query), so it is comparable across sets. R-precision (recall at each query's own number of relevant items) also removes the ceiling artifact.` }
        ],
        answer: `<p>The flaw is <b>averaging a recall@k whose ceiling depends on the number of relevant items</b>. B-type queries have ~40 relevant docs, so Recall@10 can never exceed 10/40 = 0.25 even for a perfect ranker — the low score is an artifact of the metric, not the model. <b>Report NDCG@k instead</b> (it normalizes by each query's ideal DCG, so a perfect ranking is 1.0 for every query regardless of how many relevant items it has), or use R-precision (recall at each query's own number of relevant items). Then A and B are on the same footing and the comparison is meaningful.</p>`
      }
    ]
  });

  window.CODE["met-ranking"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>The real ranking-metric API: <code>ndcg_score</code> and <code>label_ranking_average_precision_score</code> from <code>sklearn.metrics</code>, plus <code>scipy.stats.kendalltau</code> / <code>spearmanr</code> for rank correlation — and from-scratch <code>precision@k</code>, <code>MRR</code> and <code>MAP</code> with <code>numpy</code> so you can see exactly what each number means.</p>`,
    code: `import numpy as np
from sklearn.metrics import ndcg_score, label_ranking_average_precision_score
from scipy.stats import kendalltau, spearmanr

# --- one query: 5 results, scored by the model, with TRUE relevance grades ---
# graded relevance 0..3 (0 = useless, 3 = perfect)
true_rel = np.array([[3, 2, 0, 0, 1]])     # ground-truth grade of each item
scores   = np.array([[0.9, 0.2, 0.7, 0.1, 0.5]])  # model's score for each item

# --- NDCG@k: position-weighted, graded relevance (the search/recsys workhorse) ---
print("NDCG@3 :", round(ndcg_score(true_rel, scores, k=3), 4))
print("NDCG@5 :", round(ndcg_score(true_rel, scores, k=5), 4))

# --- DCG from scratch, to demystify ndcg_score ---
def dcg_at_k(rel_in_ranked_order, k):
    g = np.asarray(rel_in_ranked_order)[:k]
    discounts = 1.0 / np.log2(np.arange(2, g.size + 2))
    return float(np.sum(g * discounts))
order = np.argsort(scores[0])[::-1]        # rank items best-first by score
rel_ranked = true_rel[0][order]
idcg = dcg_at_k(np.sort(true_rel[0])[::-1], 5)
print("DCG@5  :", round(dcg_at_k(rel_ranked, 5), 4),
      " NDCG@5 (manual):", round(dcg_at_k(rel_ranked, 5) / idcg, 4))

# --- LRAP: sklearn's label-ranking average precision (binary relevance) ---
bin_rel = (true_rel > 0).astype(int)       # 1 = relevant, 0 = not
print("LRAP   :", round(label_ranking_average_precision_score(bin_rel, scores), 4))

# --- from-scratch Precision@k, MRR, MAP on binary relevance ---
def precision_at_k(rel_ranked, k):
    return float(np.asarray(rel_ranked)[:k].sum()) / k

def reciprocal_rank(rel_ranked):
    hits = np.flatnonzero(np.asarray(rel_ranked) == 1)
    return 1.0 / (hits[0] + 1) if hits.size else 0.0   # rank of FIRST hit

def average_precision(rel_ranked):
    rel_ranked = np.asarray(rel_ranked)
    total = rel_ranked.sum()
    if total == 0:
        return 0.0
    hits, s = 0, 0.0
    for r, rr in enumerate(rel_ranked, start=1):
        if rr == 1:
            hits += 1
            s += hits / r                  # precision at this hit's rank
    return s / total

bin_ranked = bin_rel[0][order]
print("P@3    :", round(precision_at_k(bin_ranked, 3), 4))
print("RR     :", round(reciprocal_rank(bin_ranked), 4))
print("AP     :", round(average_precision(bin_ranked), 4))

# MRR / MAP are these averaged over many queries:
queries = [bin_ranked, np.array([1, 0, 1, 0, 0]), np.array([0, 0, 0, 1, 1])]
print("MRR    :", round(np.mean([reciprocal_rank(q) for q in queries]), 4))
print("MAP    :", round(np.mean([average_precision(q) for q in queries]), 4))

# --- rank correlation: do two whole orderings agree? ---
gold_order  = [1, 2, 3, 4, 5]              # ideal positions
model_order = [1, 3, 2, 5, 4]              # model's positions
print("Kendall tau :", round(kendalltau(gold_order, model_order).statistic, 4))
print("Spearman rho:", round(spearmanr(gold_order, model_order).statistic, 4))`
  };

  window.CODEVIZ["met-ranking"] = {
    question: "On real data: rank the breast-cancer test tumors by a (deliberately weak) score and treat truly-malignant tumors as 'relevant'. How do Precision@k and NDCG@k change as we look further down the list (grow k)?",
    charts: [
      {
        type: "line",
        title: "Precision@k and NDCG@k as the cutoff k grows (relevant = malignant tumor)",
        xlabel: "k (how far down the ranked list we look)",
        ylabel: "metric value (0–1)",
        series: [
          {
            name: "NDCG@k",
            color: "#4ea1ff",
            points: [[1, 1.0], [2, 1.0], [3, 1.0], [5, 0.854], [8, 0.727], [10, 0.696], [15, 0.717], [20, 0.666], [30, 0.696], [40, 0.749], [50, 0.728]]
          },
          {
            name: "Precision@k",
            color: "#7ee787",
            points: [[1, 1.0], [2, 1.0], [3, 1.0], [5, 0.8], [8, 0.625], [10, 0.6], [15, 0.667], [20, 0.6], [30, 0.667], [40, 0.75], [50, 0.72]]
          },
          {
            name: "Recall@k",
            color: "#ffb454",
            points: [[1, 0.012], [2, 0.024], [3, 0.035], [5, 0.047], [8, 0.059], [10, 0.071], [15, 0.118], [20, 0.141], [30, 0.235], [40, 0.353], [50, 0.424]]
          }
        ]
      }
    ],
    caption: "228 test tumors, 85 truly malignant ('relevant'), ranked by a deliberately weak single-feature score (mean texture). At small k the top items are all malignant, so Precision@k and NDCG@k both sit at 1.0; as k grows and non-malignant tumors creep in, both fall (NDCG@5 = 0.854, P@5 = 0.80; NDCG@10 = 0.696). NDCG stays slightly above Precision because it credits hits near the top more (position-weighting). Recall@k, by contrast, only ever rises with k — it measures how many of the 85 relevant tumors we have captured so far. Three views of the SAME ranking, each answering a different question.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.metrics import ndcg_score

# relevant = malignant tumor (sklearn target: 0=malignant, 1=benign)
data = load_breast_cancer()
X = data.data
y = (data.target == 0).astype(int)          # 1 = malignant = "relevant"
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.4, random_state=0, stratify=y)

# a DELIBERATELY WEAK ranker: rank tumors by ONE noisy feature (mean texture)
# so the ranking is imperfect and the curves actually have structure.
scores = X_te[:, 1].astype(float)           # feature 1 = "mean texture"
order  = np.argsort(scores)[::-1]           # rank best-first
rel    = y_te[order]                        # 1/0 relevance in ranked order
R      = int(rel.sum())                     # total relevant (= 85)

def precision_at_k(rel, k): return rel[:k].sum() / k
def recall_at_k(rel, k):    return rel[:k].sum() / R
def dcg_at_k(rel, k):
    g = rel[:k]; disc = 1.0 / np.log2(np.arange(2, k + 2)); return float(np.sum(g * disc))
def ndcg_at_k(rel, k):
    idcg = dcg_at_k(np.sort(rel)[::-1], k)
    return dcg_at_k(rel, k) / idcg if idcg > 0 else 0.0

ks = [1, 2, 3, 5, 8, 10, 15, 20, 30, 40, 50]
print("k  P@k    R@k    NDCG@k")
for k in ks:
    print(k, round(precision_at_k(rel, k), 3),
             round(recall_at_k(rel, k), 3),
             round(ndcg_at_k(rel, k), 3))

# cross-check NDCG against scikit-learn's ndcg_score
sorted_scores = np.sort(scores)[::-1].reshape(1, -1)
y_true_row    = rel.reshape(1, -1).astype(float)
for k in [5, 10, 20]:
    print("sklearn NDCG@%d:" % k, round(ndcg_score(y_true_row, sorted_scores, k=k), 3))
# -> 0.854, 0.696, 0.666  (matches the from-scratch values above)`
  };
})();
