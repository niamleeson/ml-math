/* =====================================================================
   DEEP LEARNING LESSON (CS230)
   dl-beam-search — Beam search decoding and length normalization for
   sequence models (machine translation, text generation). Self-contained:
   registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "dl-beam-search",
    title: "Beam search decoding & length normalization",
    tagline: "Don't grab the top word at every step — keep the best few partial sentences, and stop short answers from cheating.",
    module: "Deep Learning (CS230)",
    prereqs: ["dl-rnn", "dl-attention", "dl-cross-entropy", "mod-transformer", "mod-llm"],

    whenToUse:
      `<p><b>Reach for beam search when a model must output a whole sequence and you want the most probable one</b> — translating a sentence, captioning an image, transcribing speech, or any decoder that emits one token (word piece) at a time.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Greedy decoding</b> (just take the single top token each step) — when one early high-probability word would otherwise lock you into a worse overall sentence. Beam keeps a backup so it can recover.</li>
         <li><b>Sampling</b> (randomly draw tokens) — when you want the single best, most-likely answer rather than diverse or creative text. Translation wants beam; open-ended chat often wants sampling.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>You want variety or creativity — beam search produces bland, repetitive text; use temperature sampling, top-k, or nucleus (top-p) sampling instead.</li>
         <li>Latency is critical and quality loss is acceptable — greedy (beam width $B = 1$) is the cheapest.</li>
       </ul>
       <p><b>In practice:</b> machine-translation systems use a beam width $B$ of about 10; B between 4 and 10 is a common sweet spot.</p>`,

    application:
      `<p>Beam search is the standard decoder for <b>machine translation</b> (Google Translate-style systems), <b>image captioning</b>, and <b>speech-to-text</b>. Length normalization is what keeps those systems from emitting clipped, too-short translations. The same idea underlies "best-of" and constrained decoding in modern <b>LLMs (Large Language Models)</b>, even though chat assistants more often <i>sample</i> for variety.</p>`,

    pitfalls:
      `<ul>
         <li><b>Forgetting length normalization.</b> Each extra token multiplies in another probability (&lt; 1), so longer sequences score lower. Without the $T_y^{\\alpha}$ fix, beam search prefers short, truncated outputs. Always divide by $T_y^{\\alpha}$.</li>
         <li><b>Working in raw probability space.</b> Multiplying many small probabilities underflows to 0.0 in floating point. Sum log-probabilities instead — it is numerically stable and turns products into sums.</li>
         <li><b>Beam width too large.</b> Bigger $B$ costs more compute and, past a point, returns worse, blander, repetitive text. More search is not always better quality.</li>
         <li><b>Treating beam search as exact.</b> It is a heuristic. It can still miss the true highest-probability sequence — it only keeps $B$ paths, not all of them.</li>
         <li><b>Blaming the search when the model is wrong.</b> If the best beam output is bad, check whether the model assigned it high probability. Beam search errors and model errors need different fixes.</li>
       </ul>`,

    bigIdea:
      `<p>A sequence model (an RNN or Transformer decoder) picks output words one at a time. We don't want a good <i>first</i> word — we want the most probable <b>whole sentence</b>.</p>
       <p><b>Greedy decoding</b> takes the single highest-probability word at each step. That is <b>myopic</b>: a great first word can force a bad rest-of-sentence, and greedy can never take it back.</p>
       <p><b>Beam search</b> hedges. At every step it keeps the best <b>B</b> partial sentences (B is the <b>beam width</b>), expands each, and re-keeps the best B. With $B = 1$ it <i>is</i> greedy; larger $B$ explores more candidates but costs more.</p>`,

    buildup:
      `<p>Score a candidate sentence by the model's probability of that exact word sequence. We pick the sequence that maximizes it. Because multiplying many probabilities underflows, we work in <b>log space</b>: the log of a product is the sum of logs, so we add log-probabilities instead of multiplying probabilities.</p>
       <p>But summing logs has a side effect: every word adds another negative number, so a 10-word sentence almost always scores lower than a 3-word one. That biases the search toward <b>short</b> outputs. The fix is to divide the summed log-probability by the length raised to a power, $T_y^{\\alpha}$ — <b>length normalization</b>.</p>`,

    symbols: [
      { sym: "$y^{&lt;t&gt;}$", desc: "the output token (word) chosen at step $t$." },
      { sym: "$x$", desc: "the input the model conditions on (e.g. the source sentence to translate)." },
      { sym: "$T_y$", desc: "the length of the output sequence (number of generated tokens)." },
      { sym: "$P(y^{&lt;1&gt;}, \\dots, y^{&lt;T_y&gt;} \\mid x)$", desc: "the model's probability of the whole output sequence given the input." },
      { sym: "$B$", desc: "the beam width — how many partial sequences we keep at each step. $B = 1$ is greedy." },
      { sym: "$\\alpha$", desc: "the length-normalization strength, typically between 0.5 and 1. $\\alpha = 0$ means no normalization; $\\alpha = 1$ divides by full length." }
    ],

    formula: `$$ y = \\arg\\max_{y^{&lt;1&gt;},\\dots,y^{&lt;T_y&gt;}} P\\left(y^{&lt;1&gt;},\\dots,y^{&lt;T_y&gt;} \\mid x\\right) $$`,
    whatItDoes:
      `<p>This says the goal: find the output sequence $y$ that the model thinks is the most probable, given the input $x$. Beam search is a practical way to search for that sequence without checking every possible sentence (which is exponentially many).</p>
       <p>To compare candidates safely and fairly, we don't score them with the raw probability above. We score with the <b>length-normalized log-likelihood</b>:</p>
       $$ \\frac{1}{T_y^{\\alpha}} \\sum_{t=1}^{T_y} \\log p\\left(y^{&lt;t&gt;} \\mid x, y^{&lt;1&gt;}, \\dots, y^{&lt;t-1&gt;}\\right) $$
       <p>The sum adds the log-probability of each token given everything before it. Dividing by $T_y^{\\alpha}$ removes the unfair penalty on longer sequences.</p>`,

    derivation:
      `<p><b>Why log space.</b> The probability of a sequence factors as a product of per-step probabilities: $P(y \\mid x) = \\prod_{t=1}^{T_y} p(y^{&lt;t&gt;} \\mid x, y^{&lt;1&gt;}, \\dots, y^{&lt;t-1&gt;})$. Each factor is below 1, so a long product is a tiny number that underflows to 0.0 in floating point. Taking the log turns the product into a sum: $\\log P = \\sum_t \\log p(\\cdot)$. Sums of logs are stable, and $\\arg\\max$ is unchanged because $\\log$ is monotonic.</p>
       <p><b>Why short sequences win without normalization.</b> Each $\\log p(\\cdot)$ is negative (a probability below 1 has a negative log). So every extra token <i>subtracts</i> more from the score. A short sentence has fewer negative terms, so it scores higher — purely because it is short, not because it is better. Beam search therefore over-produces clipped outputs.</p>
       <p><b>Why $T_y^{\\alpha}$ fixes it.</b> Dividing by the length $T_y$ converts the total log-probability into an <i>average per-token</i> log-probability, which no longer grows with length. Using $T_y^{\\alpha}$ with $0.5 \\le \\alpha \\le 1$ is a softer version: $\\alpha = 1$ is the full per-token average, $\\alpha = 0$ is no correction, and values in between trade off how strongly we reward longer sequences. $\\alpha$ is a tunable knob.</p>`,

    example:
      `<p>Two candidate translations, scored by summed log-probability (natural log):</p>
       <ul class="steps">
         <li><b>Short:</b> "Go." — 2 tokens, log-probs $-0.5, -0.7$. Sum $= -1.2$.</li>
         <li><b>Full:</b> "Please go now." — 4 tokens, log-probs $-0.5, -0.6, -0.5, -0.4$. Sum $= -2.0$.</li>
         <li><b>Raw scores</b> prefer the short one ($-1.2 \\gt -2.0$), even though the full sentence is the better translation. That is the short-sequence bias.</li>
         <li><b>Normalize</b> with $\\alpha = 0.7$. Short: $-1.2 / 2^{0.7} = -1.2 / 1.62 \\approx -0.74$. Full: $-2.0 / 4^{0.7} = -2.0 / 2.64 \\approx -0.76$.</li>
         <li>Now they are nearly tied, and a slightly higher $\\alpha$ tips it to the full sentence. Length normalization stops the short answer from cheating.</li>
       </ul>`,

    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      var st = { alpha: 0.7 };
      // two candidates: [label, array of per-token log-probs]
      var cands = [
        { name: "short:  “Go.”", lps: [-0.5, -0.7] },
        { name: "full:   “Please go now.”", lps: [-0.5, -0.6, -0.5, -0.4] }
      ];
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 220; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      function score(c, a) { var s = 0; for (var i = 0; i < c.lps.length; i++) s += c.lps[i]; return s / Math.pow(c.lps.length, a); }
      function draw() {
        var c = C();
        ctx.clearRect(0, 0, 640, 220);
        ctx.font = "13px sans-serif"; ctx.textBaseline = "middle";
        var s0 = score(cands[0], st.alpha), s1 = score(cands[1], st.alpha);
        var winner = s1 > s0 ? 1 : 0;
        var ys = [70, 150];
        for (var k = 0; k < 2; k++) {
          var sc = k === 0 ? s0 : s1;
          ctx.textAlign = "start"; ctx.fillStyle = c.ink;
          ctx.fillText(cands[k].name, 20, ys[k] - 20);
          // bar: more negative -> shorter. map score in [-1.5, 0] to [0, 420]
          var w = Math.max(4, (1.5 + sc) / 1.5 * 420);
          ctx.fillStyle = (k === winner) ? c.accent2 : c.dim;
          ctx.fillRect(20, ys[k], w, 22);
          ctx.fillStyle = c.ink; ctx.font = "12px sans-serif";
          ctx.fillText("normalized score = " + sc.toFixed(3), 26 + w + 6, ys[k] + 11);
          ctx.font = "13px sans-serif";
        }
        ctx.textAlign = "center"; ctx.fillStyle = c.warn; ctx.font = "12px sans-serif";
        ctx.fillText("α = " + st.alpha.toFixed(2) + "  —  winner: " + (winner === 1 ? "full sentence" : "short answer"), 320, 200);
        ctx.textAlign = "start";
      }
      var row = document.createElement("div"); row.style.margin = "8px 0";
      var lab = document.createElement("label"); lab.style.display = "block";
      lab.textContent = "length-normalization strength α = " + st.alpha;
      var inp = document.createElement("input"); inp.type = "range"; inp.min = 0; inp.max = 1; inp.step = 0.05; inp.value = st.alpha;
      inp.addEventListener("input", function () { st.alpha = parseFloat(inp.value); lab.textContent = "length-normalization strength α = " + st.alpha.toFixed(2); draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
      var note = document.createElement("div"); note.className = "out"; note.style.marginTop = "6px";
      note.innerHTML = "At <b>α = 0</b> (no normalization) the short answer wins on raw summed log-prob. Slide α up and the full sentence overtakes it — that is length normalization removing the short-sequence bias.";
      host.appendChild(note);
      draw();
    },

    practice: [
      {
        q: `With beam width $B = 1$, what does beam search reduce to, and why?`,
        steps: [
          { do: `Recall that the beam keeps the top $B$ partial sequences at each step.`, why: `With $B = 1$ you keep exactly one partial sequence.` },
          { do: `At each step you expand that one sequence and keep only the single best continuation.`, why: `Keeping the best one continuation each step is exactly the greedy rule.` }
        ],
        answer: `<p>It becomes <b>greedy decoding</b> — taking the single highest-probability token at every step. Beam search with $B = 1$ keeps one candidate, so it can never explore an alternative.</p>`
      },
      {
        q: `A model gives two outputs: a 2-token answer with summed log-prob $-1.5$ and a 5-token answer with summed log-prob $-3.0$. Which wins with no normalization, and which with $\\alpha = 1$?`,
        steps: [
          { do: `No normalization ($\\alpha = 0$): compare the raw sums.`, why: `$-1.5 \\gt -3.0$, so the short answer wins. This is the short-sequence bias.` },
          { do: `With $\\alpha = 1$: divide each by its length. Short: $-1.5 / 2 = -0.75$. Long: $-3.0 / 5 = -0.60$.`, why: `Now we compare average per-token log-prob.` },
          { do: `Compare: $-0.60 \\gt -0.75$.`, why: `The longer answer has the better per-token probability.` }
        ],
        answer: `<p>No normalization picks the <b>short</b> answer ($-1.5 \\gt -3.0$). With $\\alpha = 1$ the <b>long</b> answer wins ($-0.60 \\gt -0.75$), because per-token it is more probable.</p>`
      },
      {
        q: `Why do we add log-probabilities instead of multiplying probabilities?`,
        steps: [
          { do: `A sequence's probability is a product of many per-step probabilities, each below 1.`, why: `Multiplying many numbers below 1 gives a vanishingly small result.` },
          { do: `In floating point that tiny product underflows to 0.0, destroying the score.`, why: `You can no longer compare candidates — they all read as 0.` },
          { do: `Take logs: $\\log$ of a product is a sum of logs, and $\\arg\\max$ is unchanged.`, why: `Sums of moderate negative numbers are numerically stable.` }
        ],
        answer: `<p>Multiplying many sub-1 probabilities underflows to 0.0. Logs turn the product into a stable sum, and because $\\log$ is monotonic the most-probable sequence is unchanged.</p>`
      }
    ]
  });

  window.CODE["dl-beam-search"] = {
    lib: "NumPy / pure Python",
    runnable: false,
    explain: `<p>Beam search and greedy decoding from scratch over a <b>toy</b> next-token model: a fixed-seed random transition table over a 6-word vocabulary. We run greedy and beam ($B = 3$) and print the chosen sequences with their log-probabilities. Runs in Colab as-is.</p>`,
    code: `import numpy as np

# ---- toy next-token model: P(next word | current word) ----
VOCAB = ["the", "cat", "dog", "sat", "ran", "<eos>"]   # <eos> = end of sequence
V, EOS, START, MAXLEN = len(VOCAB), 5, 0, 6

rng = np.random.default_rng(11)            # fixed seed -> reproducible
logits = rng.normal(size=(V, V))           # random transition logits
logits[:, EOS] += -1.5                     # make stopping a bit less eager
P = np.exp(logits); P /= P.sum(1, keepdims=True)   # rows are valid distributions
logP = np.log(P)                           # work in log space (stable, additive)

def show(seq):                             # token ids -> words
    return " ".join(VOCAB[i] for i in seq)

# ---- greedy: take the single top token each step (myopic) ----
def greedy():
    seq, lp = [START], 0.0
    for _ in range(MAXLEN):
        nxt = int(np.argmax(logP[seq[-1]]))    # best next word
        lp += logP[seq[-1], nxt]; seq.append(nxt)
        if nxt == EOS: break
    return seq, lp

# ---- beam search: keep the top B partial sequences each step ----
def beam(B):
    beams, done = [([START], 0.0)], []
    for _ in range(MAXLEN):
        cand = []
        for seq, lp in beams:
            if seq[-1] == EOS:                 # finished -> set aside
                done.append((seq, lp)); continue
            for w in range(V):                 # expand every next word
                cand.append((seq + [w], lp + logP[seq[-1], w]))
        if not cand: break
        cand.sort(key=lambda t: t[1], reverse=True)   # by log-prob, high first
        beams = cand[:B]                       # keep only the top B
    allf = done + beams
    allf.sort(key=lambda t: t[1], reverse=True)
    return allf[0]                             # best finished/partial sequence

g_seq, g_lp = greedy()
print(f"greedy        logp={g_lp:7.4f}   {show(g_seq)}")
b_seq, b_lp = beam(3)
print(f"beam (B=3)    logp={b_lp:7.4f}   {show(b_seq)}")
print(f"beam wins by  {b_lp - g_lp:+.4f} log-prob")

# greedy        logp=-6.3567   the cat ran dog ran dog ran
# beam (B=3)    logp=-6.2352   the cat ran cat ran dog ran
# beam wins by  +0.1215 log-prob`
  };

  window.CODEVIZ["dl-beam-search"] = {
    question: "On the toy model, how does the best sequence log-probability beam search finds change as we widen the beam B from 1 (greedy) up to 8?",
    charts: [
      {
        type: "bars",
        title: "Best sequence log-probability vs beam width B (higher = better; B=1 is greedy)",
        xlabel: "beam width B",
        ylabel: "best log-probability found",
        labels: ["B=1 (greedy)", "B=2", "B=4", "B=8"],
        values: [-6.357, -6.235, -5.808, -4.311],
        valueLabels: ["-6.357", "-6.235", "-5.808", "-4.311"],
        colors: ["#9aa7b4", "#4ea1ff", "#4ea1ff", "#7ee787"]
      }
    ],
    caption: "Best log-probability the decoder finds, computed for real with numpy over the fixed-seed toy model (seed 11). The bars are non-decreasing in B: B=1 (greedy) scores -6.357, and each wider beam does at least as well (-6.235, -5.808, -4.311). Greedy is the worst because it commits early and cannot recover; widening the beam explores more partial sequences and uncovers higher-probability outputs — beam beats greedy. The gain comes at compute cost roughly proportional to B, which is why translation systems settle near B=10 rather than going arbitrarily large.",
    code: `import numpy as np

VOCAB = ["the", "cat", "dog", "sat", "ran", "<eos>"]
V, EOS, START, MAXLEN = len(VOCAB), 5, 0, 6

rng = np.random.default_rng(11)            # same fixed seed as the CODE tab
logits = rng.normal(size=(V, V)); logits[:, EOS] += -1.5
P = np.exp(logits); P /= P.sum(1, keepdims=True)
logP = np.log(P)

def beam(B):
    beams, done = [([START], 0.0)], []
    for _ in range(MAXLEN):
        cand = []
        for seq, lp in beams:
            if seq[-1] == EOS:
                done.append((seq, lp)); continue
            for w in range(V):
                cand.append((seq + [w], lp + logP[seq[-1], w]))
        if not cand: break
        cand.sort(key=lambda t: t[1], reverse=True)
        beams = cand[:B]
    return max(done + beams, key=lambda t: t[1])[1]   # best log-prob

for B in [1, 2, 4, 8]:
    print(f"B={B}  best logp = {beam(B):.3f}")
# B=1  best logp = -6.357   (= greedy)
# B=2  best logp = -6.235
# B=4  best logp = -5.808
# B=8  best logp = -4.311   (non-decreasing in B)`
  };
})();
