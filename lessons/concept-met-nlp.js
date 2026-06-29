/* =====================================================================
   STANDALONE LESSON — Metrics for text, translation & speech.
   BEGINNER audience. Module: "Metrics & Evaluation".
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - HTML teaching fields; math in $...$ / $$...$$ with DOUBLED backslashes
     - a worked example with real numbers and a real-data CODEVIZ
   Pushed into window.LESSONS; its codeviz merged into window.CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-nlp",
    title: "Metrics for text, translation & speech",
    tagline: "How to put a number on a machine's words — comparing what it wrote to what a human wrote.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["mod-llm", "dl-word-embeddings"],

    whenToUse:
      `<p>Pick the metric that matches the <b>task</b> and the <b>budget</b>:</p>
       <ul>
         <li><b>BLEU / ROUGE</b> — cheap word-overlap scores. BLEU (Bilingual Evaluation Understudy) for translation; ROUGE (Recall-Oriented Understudy for Gisting Evaluation) for summarization. Use them for fast, repeatable comparisons during development.</li>
         <li><b>BERTScore / COMET</b> — meaning-aware scores. Use when paraphrases matter and overlap metrics unfairly punish good wording. They cost more (they run a neural network).</li>
         <li><b>Perplexity</b> — a language model's own quality on held-out text. Use to compare two language models trained with the <i>same</i> tokenizer.</li>
         <li><b>WER (Word Error Rate)</b> — for speech recognition and OCR (Optical Character Recognition): how many words the transcript got wrong.</li>
         <li><b>pass@k</b> — for code generation: does at least one of $k$ samples actually run and pass the tests?</li>
         <li><b>distinct-n / entropy</b> — for chatbots and open-ended text: is the output diverse, or does the model repeat itself?</li>
       </ul>
       <p><b>Avoid</b> a single overlap number as your only judge of a creative or open-ended task — pair it with a meaning-aware metric or human review.</p>`,

    application:
      `<p>These metrics run constantly in real systems. Machine-translation teams track <b>BLEU</b> and <b>COMET</b> on every model release. Summarization and search-snippet teams report <b>ROUGE</b>. Voice assistants and call-center transcription are graded on <b>WER</b>. Question-answering benchmarks (like SQuAD, the Stanford Question Answering Dataset) report <b>exact match</b> and <b>token-F1</b>. Code-generation models (Codex-style) are ranked by <b>pass@k</b>. Chatbot research reports <b>distinct-n</b> and <b>self-BLEU</b> to prove the model is not just repeating itself. And every language model lists its <b>perplexity</b>.</p>`,

    pitfalls:
      `<ul>
         <li><b>BLEU / ROUGE punish valid paraphrases.</b> "began" instead of "started" is correct but shares no words, so the score drops. Fix: add multiple human references, or also report a meaning-aware metric (BERTScore, COMET).</li>
         <li><b>Perplexity is not comparable across tokenizers.</b> A model that splits text into bigger or smaller pieces gets a different perplexity for the same quality. Fix: only compare perplexities computed with the identical tokenizer, or convert to bits-per-byte.</li>
         <li><b>WER counts every edit equally.</b> Mishearing "a" for "the" costs the same as mishearing a key name or number, even though one matters far more. Fix: report task-weighted error, or inspect which words are missed.</li>
         <li><b>N-gram metrics reward copying.</b> A summary that copies sentences verbatim from the source scores high on ROUGE without truly summarizing. Fix: add an abstractiveness or novelty check, plus human review.</li>
         <li><b>One number hides failures.</b> A high average can sit on top of a few catastrophic outputs. Fix: look at the score distribution and the worst examples, not just the mean.</li>
       </ul>`,

    bigIdea:
      `<p>How do you grade a sentence a machine wrote? You compare it to a <b>reference</b> — a sentence a human wrote that you trust. The metric turns "how close are these two sentences?" into a number.</p>
       <p>There are three big families, and the whole lesson hangs on this split:</p>
       <ul class="steps">
         <li><b>Overlap-based.</b> Count shared <i>words and word-runs</i>. BLEU, ROUGE, METEOR, chrF, TER, GLEU, NIST, exact match, token-F1, WER, CER. Cheap and fast, but blind to paraphrases.</li>
         <li><b>Embedding-based.</b> Compare the <i>meanings</i> of the words using vectors, so synonyms still match. BERTScore, MoverScore, BLEURT, COMET. Slower, but fairer to good rewordings.</li>
         <li><b>Probability-based.</b> Ask a language model how <i>surprised</i> it is by the text. Perplexity. No reference sentence needed — the model itself is the judge.</li>
       </ul>
       <p>Same goal — score the words — three different rulers.</p>`,

    buildup:
      `<p>Start with the simplest idea: count matching words. Build up from there.</p>
       <p>First we need the word <b>n-gram</b> (pronounced "en-gram"). An <b>n-gram</b> is a run of $n$ words in a row. A 1-gram (unigram) is one word; a 2-gram (bigram) is two words in a row; a 3-gram is three. Example: in "the lazy dog", the bigrams are "the lazy" and "lazy dog".</p>
       <p>Two ways to ask "did we match?":</p>
       <ul class="steps">
         <li><b>Precision</b> = of the words the machine wrote, what fraction appear in the reference? Rewards not making things up.</li>
         <li><b>Recall</b> = of the words in the reference, what fraction did the machine produce? Rewards not leaving things out.</li>
       </ul>
       <p>BLEU is built on precision (don't add wrong words). ROUGE leans on recall (don't miss important words). <b>F1</b> blends both: $F_1 = \\frac{2\\,P\\,R}{P+R}$, where $P$ is precision and $R$ is recall.</p>
       <p>WER comes from a different question: how many single-word <b>edits</b> turn the machine's transcript into the reference? Count the substitutions, deletions, and insertions; divide by the reference length.</p>`,

    symbols: [
      { sym: "$\\text{ref}$", desc: "the reference: the trusted human-written sentence we grade against." },
      { sym: "$\\text{cand}$", desc: "the candidate: the sentence the machine produced." },
      { sym: "$p_n$", desc: "the clipped n-gram precision: the fraction of the candidate's $n$-grams that also appear in the reference (each reference $n$-gram can be matched only as many times as it occurs)." },
      { sym: "$w_n$", desc: "the weight given to each n-gram order $n$ in BLEU. Usually equal, $w_n = 1/N$ for $N$ orders." },
      { sym: "$N$", desc: "the largest n-gram order used. Standard BLEU uses $N = 4$." },
      { sym: "$\\text{BP}$", desc: "the brevity penalty: a number $\\le 1$ that shrinks BLEU when the candidate is shorter than the reference (so a machine can't game precision by writing fewer words)." },
      { sym: "$c$", desc: "the candidate length in words; $r$ is the reference length in words." },
      { sym: "$S, D, I$", desc: "the counts of word Substitutions, Deletions, and Insertions needed to turn the candidate into the reference (the edit distance pieces)." },
      { sym: "$P, R, F_1$", desc: "Precision, Recall, and their harmonic mean F1. $F_1 = \\frac{2 P R}{P + R}$." },
      { sym: "$P(\\cdot)$", desc: "a probability the language model assigns to a token (a word or word-piece)." }
    ],

    formula:
      `$$ \\text{BLEU} = \\text{BP}\\cdot\\exp\\!\\Big(\\sum_{n=1}^{N} w_n \\log p_n\\Big),\\qquad \\text{BP} = \\begin{cases} 1 & c > r \\\\ e^{\\,1 - r/c} & c \\le r \\end{cases} $$
       $$ \\text{WER} = \\frac{S + D + I}{\\text{number of words in the reference}},\\qquad \\text{ROUGE\\text{-}1}_{F_1} = \\frac{2 P R}{P + R} $$
       $$ \\text{Perplexity} = \\exp\\!\\Big(-\\frac{1}{T}\\sum_{t=1}^{T} \\log P(\\text{token}_t) \\Big) $$`,

    whatItDoes:
      `<p><b>BLEU.</b> Compute the clipped precision $p_n$ for $n = 1,2,3,4$, take a (weighted) geometric mean of them — that is the $\\exp$-of-sum-of-logs — then multiply by the brevity penalty so short outputs can't cheat. Score runs $0$ to $1$ (often shown $\\times 100$). Higher is better.</p>
       <p><b>WER.</b> The minimum number of word edits to fix the transcript, divided by how many words the reference has. $0$ is perfect; it can exceed $1$ if the transcript is much longer and wronger than the reference. Lower is better.</p>
       <p><b>ROUGE-1 F1.</b> The F1 (harmonic mean) of unigram precision and recall between candidate and reference. Higher is better.</p>
       <p><b>Perplexity.</b> Take the model's average surprise per token — the negative average log-probability — and exponentiate it. Read it as "on average the model was as unsure as if choosing uniformly among this many words." Lower is better.</p>
       <p>Now the rest of the family, defined briefly:</p>
       <ul>
         <li><b>self-BLEU</b> (diversity): score each generated sentence's BLEU against the model's <i>other</i> generations. <i>High</i> self-BLEU is <i>bad</i> — it means the model keeps writing the same thing.</li>
         <li><b>ROUGE-2</b>: same idea as ROUGE-1 but over bigrams (catches word-pair fluency). <b>ROUGE-L</b>: based on the Longest Common Subsequence (LCS) — the longest run of words appearing in order in both, not necessarily adjacent.</li>
         <li><b>METEOR</b> (Metric for Evaluation of Translation with Explicit ORdering): like BLEU but also matches stems and synonyms, and penalizes scrambled word order. Friendlier to paraphrases.</li>
         <li><b>chrF</b> (character F-score): F-score over <i>character</i> n-grams instead of words. Robust for languages with rich word endings.</li>
         <li><b>TER</b> (Translation Edit Rate): like WER but for translation — edits (including block shifts) per reference word. Lower is better.</li>
         <li><b>GLEU</b> (Google-BLEU): a BLEU variant that behaves better on single sentences.</li>
         <li><b>NIST</b> (National Institute of Standards and Technology metric): BLEU-like, but weights rare, informative n-grams more than common ones.</li>
         <li><b>BERTScore</b>: match each candidate word to its most similar reference word using BERT (Bidirectional Encoder Representations from Transformers) embeddings, then average the similarities. Synonyms match.</li>
         <li><b>MoverScore</b>: like BERTScore but uses the <i>Word Mover's Distance</i> — the cheapest way to "transport" the candidate's word-vectors onto the reference's.</li>
         <li><b>BLEURT</b> (Bilingual Evaluation Understudy with Representations from Transformers): a BERT-based model <i>fine-tuned to predict human ratings</i>, so its score tracks what people think.</li>
         <li><b>COMET</b> (Crosslingual Optimized Metric for Evaluation of Translation): a learned metric that looks at the source, the candidate, and the reference together; state-of-the-art agreement with human translation judgments.</li>
         <li><b>Exact match (EM)</b>: 1 if the answer string equals the reference exactly (after light normalization), else 0. Used in question answering.</li>
         <li><b>Token-F1</b>: F1 over the set of answer words — partial credit when the answer overlaps but isn't identical. Used in question answering.</li>
         <li><b>CER (Character Error Rate)</b>: WER but counting <i>character</i> edits — for OCR and fine-grained speech scoring.</li>
         <li><b>pass@k</b>: for code, the chance that at least one of $k$ sampled programs passes all unit tests. <b>distinct-n</b>: the fraction of generated n-grams that are unique (diversity). <b>entropy</b>: how spread-out the word distribution is — higher means more varied output.</li>
       </ul>`,

    derivation:
      `<p><b>Why BLEU multiplies precisions instead of averaging them.</b> BLEU takes a <i>geometric</i> mean of $p_1,\\dots,p_4$, written as $\\exp(\\sum_n w_n \\log p_n)$. A geometric mean is harsh: if any single $p_n$ is zero, the whole product is zero. That is on purpose — a translation with correct words but no correct word-<i>pairs</i> (a word salad) should not score well. The $\\log$ then $\\exp$ is just the standard trick for a weighted geometric mean: $\\prod_n p_n^{w_n} = \\exp(\\sum_n w_n \\log p_n)$.</p>
       <p><b>Why the brevity penalty exists.</b> Precision alone loves short outputs: a one-word candidate that happens to match scores precision $1$. BLEU has no recall term, so it bolts on $\\text{BP}$. When the candidate is at least as long as the reference ($c > r$), $\\text{BP} = 1$. When it is shorter, $\\text{BP} = e^{1 - r/c} \\lt  1$ shrinks the score. This restores the "don't leave things out" pressure that recall would have given.</p>
       <p><b>Why WER is an edit distance.</b> The smallest number of single-word insertions, deletions, and substitutions to turn one sentence into another is the <b>Levenshtein (edit) distance</b>. A small table (dynamic programming) fills in $D[i,j]$ = cost to align the first $i$ reference words with the first $j$ candidate words, each cell taking the cheapest of delete / insert / match-or-substitute. Dividing by the reference length makes it a rate, comparable across sentences of different lengths.</p>
       <p><b>Why perplexity is $\\exp$ of average surprise.</b> A model's surprise at a token is $-\\log P(\\text{token})$ — small when the model expected it, large when it didn't. Average that over all $T$ tokens, then $\\exp$ it. The $\\exp$ converts "average log-probability" back into an effective <i>branching factor</i>: a perplexity of $20$ means the model was, on average, as uncertain as if picking uniformly from $20$ choices. Lower surprise, lower perplexity, better model.</p>`,

    example:
      `<p>Reference (human): <code>the quick brown fox</code> ($r = 4$ words). Candidate (machine): <code>the brown fox</code> ($c = 3$ words). We grade this one pair with four rulers.</p>
       <table class="extable">
         <caption>Unigram (1-word) match: each candidate word vs the reference.</caption>
         <thead><tr><th>candidate word</th><th>in reference?</th></tr></thead>
         <tbody>
           <tr><td class="row-h">the</td><td>yes</td></tr>
           <tr><td class="row-h">brown</td><td>yes</td></tr>
           <tr><td class="row-h">fox</td><td>yes</td></tr>
         </tbody>
       </table>
       <p>Now the calculation, step by step:</p>
       <ul class="steps">
         <li><b>Unigram precision</b> $p_1$ = (candidate words found in reference) / (candidate words) = $3/3 = 1.0$.</li>
         <li><b>Bigram precision</b> $p_2$: candidate bigrams are "the brown", "brown fox"; reference bigrams are "the quick", "quick brown", "brown fox". Only "brown fox" matches, so $p_2 = 1/2 = 0.5$.</li>
         <li><b>Brevity penalty</b>: $c = 3 \\le r = 4$, so $\\text{BP} = e^{1 - 4/3} = e^{-1/3} \\approx 0.717$.</li>
         <li><b>BLEU</b> (up to bigrams, equal weights $1/2$) = $\\text{BP}\\cdot\\exp\\!\\big(\\tfrac12\\log 1.0 + \\tfrac12\\log 0.5\\big) = 0.717 \\times \\sqrt{1.0 \\times 0.5} = 0.717 \\times 0.707 \\approx 0.507$.</li>
         <li><b>WER</b>: turning candidate into reference needs one insertion ("quick"), so $S=0,\\ D=0,\\ I=1$ over $4$ reference words: $\\text{WER} = (0+0+1)/4 = 0.25$.</li>
         <li><b>ROUGE-1 F1</b>: recall $R = 3/4 = 0.75$, precision $P = 3/3 = 1.0$, so $F_1 = \\frac{2(1.0)(0.75)}{1.0+0.75} = \\frac{1.5}{1.75} \\approx 0.857$.</li>
       </ul>
       <table class="extable">
         <caption>Same candidate, four rulers — they disagree on purpose.</caption>
         <thead><tr><th>metric</th><th class="num">score</th><th>better when</th></tr></thead>
         <tbody>
           <tr><td class="row-h">BLEU (n=2)</td><td class="num">0.507</td><td>higher</td></tr>
           <tr><td class="row-h">WER</td><td class="num">0.250</td><td>lower</td></tr>
           <tr><td class="row-h">ROUGE-1 F1</td><td class="num">0.857</td><td>higher</td></tr>
         </tbody>
       </table>
       <p>One short candidate, three different verdicts — each weighs precision, recall, and length differently.</p>`,

    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      var ref = "the quick brown fox jumps over the lazy dog";
      function tok(s) { return s.trim().toLowerCase().split(/\s+/).filter(Boolean); }
      function counter(arr) { var m = {}; arr.forEach(function (w) { m[w] = (m[w] || 0) + 1; }); return m; }
      function wer(r, h) {
        r = tok(r); h = tok(h); var n = r.length, m = h.length;
        var D = []; for (var i = 0; i <= n; i++) { D.push([]); for (var j = 0; j <= m; j++) D[i].push(i === 0 ? j : (j === 0 ? i : 0)); }
        for (i = 1; i <= n; i++) for (j = 1; j <= m; j++) {
          var c = r[i - 1] === h[j - 1] ? 0 : 1;
          D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + c);
        }
        return n ? D[n][m] / n : 0;
      }
      function bleu1(r, h) {
        var rc = counter(tok(r)), hc = counter(tok(h)), ov = 0;
        for (var w in hc) ov += Math.min(hc[w], rc[w] || 0);
        return h.trim() ? ov / tok(h).length : 0;
      }
      function rouge1(r, h) {
        var rc = counter(tok(r)), hc = counter(tok(h)), ov = 0;
        for (var w in hc) ov += Math.min(hc[w], rc[w] || 0);
        var rec = tok(r).length ? ov / tok(r).length : 0, prec = tok(h).length ? ov / tok(h).length : 0;
        return (rec + prec) ? 2 * rec * prec / (rec + prec) : 0;
      }
      var wrap = document.createElement("div"); wrap.style.marginBottom = "8px";
      wrap.innerHTML = "<div style='font-size:12px;margin-bottom:4px'>reference: <code>" + ref + "</code></div>" +
        "<div style='font-size:12px;margin-bottom:4px'>type a candidate transcript:</div>";
      var inp = document.createElement("input"); inp.type = "text"; inp.value = "a quick brown fox jumped over the lazy dog";
      inp.style.width = "100%"; inp.style.boxSizing = "border-box"; inp.style.padding = "6px";
      wrap.appendChild(inp); host.appendChild(wrap);
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 240; host.appendChild(cv);
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      function draw() {
        var c = C(), cand = inp.value;
        var b = bleu1(ref, cand), r1 = rouge1(ref, cand), w = wer(ref, cand);
        if (window.Charts) {
          window.Charts.draw(cv, {
            type: "bars",
            labels: ["BLEU-1 (higher=better)", "ROUGE-1 (higher=better)", "WER (lower=better)"],
            values: [b, r1, w],
            valueLabels: [b.toFixed(3), r1.toFixed(3), w.toFixed(3)],
            colors: [c.accent, c.accent2, c.warn]
          });
        }
        rd.innerHTML = "Word-overlap rewards keeping the reference's words; WER counts the edits to fix the transcript. " +
          "Try a near-perfect copy (BLEU and ROUGE near 1, WER near 0) versus a reworded line (overlap drops even when meaning survives).";
      }
      inp.addEventListener("input", draw);
      draw();
    },

    practice: [
      {
        q: `Reference: <code>cats sit on mats</code> (4 words). Candidate: <code>cats sit on the mat</code> (5 words). Compute the unigram (1-gram) precision $p_1$ and ROUGE-1 recall.`,
        steps: [
          { do: `List candidate words: cats, sit, on, the, mat. Which appear in the reference {cats, sit, on, mats}? cats, sit, on do; "the" and "mat" do not.`, why: `Precision counts candidate words found in the reference.` },
          { do: `$p_1 = 3/5 = 0.6$.`, why: `3 of the 5 candidate words matched.` },
          { do: `Recall counts reference words produced: of {cats, sit, on, mats}, the candidate has cats, sit, on (not "mats", only "mat"). So recall $= 3/4 = 0.75$.`, why: `"mat" $\\ne$ "mats" — exact word match fails, which is the paraphrase blind spot.` }
        ],
        answer: `Unigram precision $p_1 = 3/5 = 0.6$; ROUGE-1 recall $= 3/4 = 0.75$. Note "mat" vs "mats" costs a match even though the meaning is the same — the classic overlap-metric weakness.`
      },
      {
        q: `A speech model transcribes the 5-word reference <code>turn the lights on now</code> as <code>turn lights on now</code>. What is the WER (Word Error Rate)?`,
        steps: [
          { do: `Align the two: the only difference is the missing word "the".`, why: `Find the cheapest set of single-word edits.` },
          { do: `That is one deletion: $S=0, D=1, I=0$.`, why: `Deleting "the" from the reference gives the candidate.` },
          { do: `$\\text{WER} = (S+D+I)/(\\text{reference words}) = 1/5 = 0.2$.`, why: `Divide edits by the 5 reference words to get a rate.` }
        ],
        answer: `WER $= 1/5 = 0.2$ (one deleted word out of five). Lower is better, so this is a fairly good transcript.`
      },
      {
        q: `Your translation model scores high BLEU but a reviewer says the outputs read like copies of the source. Which metric should you add, and why?`,
        steps: [
          { do: `BLEU and ROUGE reward shared n-grams, so copying scores well — they cannot see "is this novel or just pasted?".`, why: `Overlap metrics are blind to copying and to paraphrase quality.` },
          { do: `Add a meaning-aware metric (BERTScore or COMET) to check semantic adequacy, and a diversity/novelty check (distinct-n or self-BLEU) to catch copying.`, why: `Embedding metrics judge meaning; diversity metrics judge repetition.` }
        ],
        answer: `Pair BLEU with an embedding-based metric (BERTScore / COMET) for meaning, and a diversity metric (distinct-n or self-BLEU) to detect copying. No single overlap number should be the only judge.`
      }
    ]
  });

  window.CODE["met-nlp"] = {
    lib: "sacrebleu, rouge_score, evaluate, jiwer, torchmetrics",
    runnable: false,
    explain: `<p>The real APIs practitioners call. <code>sacrebleu</code> for standardized BLEU/chrF/TER, <code>rouge_score</code> for ROUGE, HuggingFace <code>evaluate</code> as a one-stop hub (it also wraps BERTScore and METEOR), <code>jiwer</code> for WER/CER, and <code>torchmetrics.text</code> for Perplexity, BLEU, ROUGE, and BERTScore inside a PyTorch loop.</p>`,
    code: `# pip install sacrebleu rouge-score evaluate jiwer torchmetrics torch
# --- BLEU, chrF, TER (sacrebleu: the standard, reproducible implementation) ---
import sacrebleu
refs = [["the quick brown fox jumps over the lazy dog"]]   # list of reference lists
cand = ["a quick brown fox jumped over the lazy dog"]
print("BLEU :", sacrebleu.corpus_bleu(cand, refs).score)     # 0..100, higher better
print("chrF :", sacrebleu.corpus_chrf(cand, refs).score)     # character F-score
print("TER  :", sacrebleu.corpus_ter(cand, refs).score)      # edit rate, lower better

# --- ROUGE-1 / ROUGE-2 / ROUGE-L (summarization overlap/recall) ---
from rouge_score import rouge_scorer
sc = rouge_scorer.RougeScorer(["rouge1", "rouge2", "rougeL"], use_stemmer=True)
print(sc.score("the quick brown fox jumps over the lazy dog",
               "a quick brown fox jumped over the lazy dog"))

# --- HuggingFace evaluate: one hub for many metrics (incl. METEOR, BERTScore) ---
import evaluate
meteor = evaluate.load("meteor")
print("METEOR:", meteor.compute(predictions=cand, references=[r[0] for r in refs]))
bertscore = evaluate.load("bertscore")                       # embedding-based, semantic
print("BERTScore:", bertscore.compute(predictions=cand,
      references=[r[0] for r in refs], lang="en")["f1"])
squad = evaluate.load("squad")                               # exact match + token-F1 for QA
print(squad.compute(
    predictions=[{"id": "1", "prediction_text": "Paris"}],
    references=[{"id": "1", "answers": {"text": ["Paris"], "answer_start": [0]}}]))

# --- WER and CER for speech / OCR (jiwer) ---
import jiwer
print("WER:", jiwer.wer("turn the lights on now", "turn lights on now"))   # 0.2
print("CER:", jiwer.cer("turn the lights on now", "turn lights on now"))

# --- torchmetrics.text: Perplexity, BLEU, ROUGE, BERTScore in a PyTorch pipeline ---
import torch
from torchmetrics.text import Perplexity, BLEUScore, ROUGEScore, BERTScore
print("BLEU (tm):", BLEUScore()(cand, [[r[0] for r in refs]]))
print("ROUGE (tm):", ROUGEScore()(cand, [r[0] for r in refs]))
# Perplexity wants per-token logits (V = vocab size) and the true next-token ids:
logits = torch.randn(2, 8, 100)          # (batch, seq_len, vocab) model outputs
target = torch.randint(0, 100, (2, 8))   # (batch, seq_len) gold tokens
print("Perplexity:", Perplexity()(logits, target))   # exp of mean cross-entropy
print("BERTScore (tm):", BERTScore()(cand, [r[0] for r in refs])["f1"])`
  };

  window.CODEVIZ["met-nlp"] = {
    question: "On one fixed reference vs one candidate, how is each metric built — and what do the FAILURE shapes look like? Watch BLEU come together from its n-gram precisions and brevity penalty, see why BLEU and ROUGE disagree, then meet the cases that bite in practice: a perfect paraphrase that overlap metrics wrongly punish, the brevity penalty crushing a too-short output, and the same model looking great or terrible just by swapping tokenizers.",
    charts: [
      {
        type: "bars",
        title: "Healthy: BLEU = BP x geometric-mean(p1..p4), term by term",
        xlabel: "term",
        ylabel: "value (0..1)",
        labels: ["p1", "p2", "p3", "p4", "BP", "BLEU"],
        values: [1.0, 0.8, 0.75, 0.6667, 0.8465, 0.6732],
        valueLabels: ["1.00", "0.80", "0.75", "0.667", "0.847", "0.673"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#ffb454", "#7ee787"],
        interpret: "Each blue bar is one n-gram precision: of the candidate's n-word runs, what fraction appear in the reference. They fall left to right (single words match easily, 4-word runs rarely) — that downward staircase is normal. The orange bar is the brevity penalty (0.847, below 1 because the candidate is one word short). The green bar is the final BLEU: the geometric mean of the four blue bars, then multiplied by orange. <b>Read it as:</b> BLEU can only be as strong as its weakest n-gram precision, and being too short drags it down further."
      },
      {
        type: "bars",
        title: "Same candidate, different rulers: BLEU vs ROUGE-1 vs ROUGE-L",
        xlabel: "metric",
        ylabel: "score (0..1)",
        labels: ["BLEU (n=4)", "ROUGE-1 F1", "ROUGE-L F1"],
        values: [0.6732, 0.9231, 0.9231],
        valueLabels: ["0.673", "0.923", "0.923"],
        colors: ["#7ee787", "#c89bff", "#ffb454"],
        interpret: "Three metrics, ONE identical candidate. BLEU (green) is much lower than the two ROUGE scores (0.673 vs 0.923) — not because the text changed, but because BLEU multiplies four n-gram precisions and adds a brevity penalty, while ROUGE-1 only checks single-word overlap. <b>Lesson:</b> never compare a BLEU number against a ROUGE number; a metric's scale is its own. Always state which ruler produced the score."
      },
      {
        type: "bars",
        title: "ROUGE-1 = F1 of unigram recall & precision",
        xlabel: "component",
        ylabel: "value (0..1)",
        labels: ["recall = 6/7", "precision = 6/6", "F1"],
        values: [0.8571, 1.0, 0.9231],
        valueLabels: ["0.857", "1.00", "0.923"],
        colors: ["#4ea1ff", "#c89bff", "#7ee787"],
        interpret: "Blue = recall (of the 7 reference words, how many the candidate produced: 6/7). Purple = precision (of the 6 candidate words, how many are in the reference: 6/6 = perfect, it added no junk). Green = their F1, the harmonic mean, which sits below precision because recall is the weaker of the two. <b>Read it as:</b> precision punishes adding wrong words; recall punishes leaving good words out; F1 won't be high unless both are."
      },
      {
        type: "bars",
        title: "Perplexity = exp(cross-entropy): per-token surprise, then exp of the mean",
        xlabel: "token surprise (nats), then summary",
        ylabel: "value",
        labels: ["t1 P=.5", "t2 P=.4", "t3 P=.1", "t4 P=.25", "t5 P=.2", "cross-ent", "perplexity"],
        values: [0.6931, 0.9163, 2.3026, 1.3863, 1.6094, 1.3816, 3.9811],
        valueLabels: ["0.69", "0.92", "2.30", "1.39", "1.61", "1.38", "3.98"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#ffb454", "#7ee787"],
        interpret: "Each blue bar is one token's surprise, minus the log of the probability the model gave it: a token the model expected (P=0.5) costs little; one it doubted (P=0.1) spikes to 2.30. Orange is their average (cross-entropy, 1.38 nats). Green exponentiates that into perplexity, 3.98 — read as 'the model was as unsure as if guessing uniformly among ~4 words'. <b>One spike token (the P=0.1 bar) drags the whole average up</b>, which is why perplexity is sensitive to rare hard tokens. Lower is better."
      },
      {
        type: "bars",
        title: "Variant — paraphrase trap: same meaning, overlap metrics collapse (illustrative)",
        xlabel: "metric",
        ylabel: "score (0..1)",
        labels: ["BLEU", "ROUGE-1", "BERTScore (meaning)"],
        values: [0.18, 0.25, 0.91],
        valueLabels: ["0.18", "0.25", "0.91"],
        colors: ["#ff7b72", "#ffb454", "#7ee787"],
        interpret: "Illustrative. The candidate is a perfect paraphrase — e.g. reference 'the film began at noon', candidate 'the movie started at midday'. Every content word is a correct synonym, so word-overlap finds almost nothing: BLEU and ROUGE crater (red/orange) even though the translation is excellent. The green bar is BERTScore, which compares word MEANINGS via embeddings and stays near 0.9. <b>How to recognise it:</b> overlap metrics low, a human rates the output fine. <b>What it means:</b> trust a meaning-aware metric (BERTScore/COMET) here, not BLEU."
      },
      {
        type: "bars",
        title: "Variant — brevity penalty crushes a too-short candidate (illustrative)",
        xlabel: "candidate length c (reference r = 20 words)",
        ylabel: "brevity penalty BP",
        labels: ["c=4", "c=8", "c=12", "c=16", "c=20"],
        values: [0.2096, 0.4724, 0.6592, 0.8290, 1.0],
        valueLabels: ["0.21", "0.47", "0.66", "0.83", "1.00"],
        colors: ["#ff7b72", "#ff7b72", "#ffb454", "#ffb454", "#7ee787"],
        interpret: "Illustrative: the brevity penalty BP = exp(1 - r/c) against a 20-word reference. A model can cheat precision by emitting just a few words it is sure about — but BP slams that shut. At c=4 words BP=0.21, so even perfect precision yields BLEU below 0.21 (red). Only when the candidate is as long as the reference (c=20) does BP reach 1.0 (green). <b>How to recognise it:</b> precisions look high yet BLEU is tiny. <b>What it means:</b> the output is too short — BP is doing the job recall would, forcing completeness."
      },
      {
        type: "bars",
        title: "Variant — perplexity is NOT comparable across tokenizers (illustrative)",
        xlabel: "same model & text, different tokenizer",
        ylabel: "perplexity (lower=better)",
        labels: ["char-level", "BPE 32k", "word-level"],
        values: [3.1, 14.0, 280.0],
        valueLabels: ["3.1", "14", "280"],
        colors: ["#9aa7b4", "#7ee787", "#ff7b72"],
        interpret: "Illustrative, log-ish scale: the SAME model on the SAME text reports wildly different perplexity just by changing how text is split into tokens. Character tokenizers have few choices per step (low perplexity, 3.1) while word-level vocabularies have tens of thousands (perplexity 280) — none of this reflects model quality. <b>How to recognise it:</b> two papers quote very different perplexities for similar models. <b>What it means:</b> only compare perplexities computed with the IDENTICAL tokenizer, or convert to bits-per-byte first."
      }
    ],
    caption: "Charts 1-4 build the metrics on a real pair — reference \"the cat sat on the warm mat\" (7 words), candidate \"the cat sat on the mat\" (6 words) — all numbers computed below with numpy. Charts 5-7 are the failure shapes you actually meet: a paraphrase that overlap metrics wrongly punish, the brevity penalty crushing a too-short output, and perplexity swinging by tokenizer. Each chart's own interpret box explains how to read it.",
    code: `import numpy as np
from collections import Counter

reference = "the cat sat on the warm mat".split()   # 7 words
candidate = "the cat sat on the mat".split()         # 6 words

def ngrams(toks, n):
    return [tuple(toks[i:i+n]) for i in range(len(toks) - n + 1)]

def clipped_precision(ref, cand, n):     # fraction of candidate n-grams found in ref
    rc, cc = Counter(ngrams(ref, n)), Counter(ngrams(cand, n))
    total = sum(cc.values())
    if total == 0:
        return 0.0
    overlap = sum(min(cnt, rc[g]) for g, cnt in cc.items())
    return overlap / total

# --- BLEU = BP * geometric mean of p1..p4 ---
ps = [clipped_precision(reference, candidate, n) for n in range(1, 5)]
c, r = len(candidate), len(reference)
BP = 1.0 if c > r else np.exp(1 - r / c)            # brevity penalty, c <= r here
geo = np.exp(np.mean([np.log(p) for p in ps]))      # equal weights 1/4
bleu = BP * geo
print("p1..p4 =", [round(p, 3) for p in ps])
print("BP=%.3f  geo_mean=%.3f  BLEU=%.3f" % (BP, geo, bleu))
# p1..p4 = [1.0, 0.8, 0.75, 0.667]
# BP=0.847  geo_mean=0.795  BLEU=0.673

# --- ROUGE-1 (unigram recall / precision / F1) ---
overlap1 = sum(min(c1, Counter(reference)[w]) for w, c1 in Counter(candidate).items())
rec = overlap1 / len(reference)                     # 6/7
prec = overlap1 / len(candidate)                    # 6/6
f1 = 2 * rec * prec / (rec + prec)
print("ROUGE-1 recall=%.3f prec=%.3f F1=%.3f" % (rec, prec, f1))
# ROUGE-1 recall=0.857 prec=1.000 F1=0.923

# --- ROUGE-L (Longest Common Subsequence) ---
def lcs_len(a, b):
    dp = np.zeros((len(a) + 1, len(b) + 1), dtype=int)
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            dp[i, j] = dp[i-1, j-1] + 1 if a[i-1] == b[j-1] else max(dp[i-1, j], dp[i, j-1])
    return int(dp[-1, -1])
L = lcs_len(reference, candidate)
rl_rec, rl_prec = L / len(reference), L / len(candidate)
rougeL = 2 * rl_rec * rl_prec / (rl_rec + rl_prec)
print("ROUGE-L F1=%.3f (LCS=%d)" % (rougeL, L))
# ROUGE-L F1=0.923 (LCS=6)

# --- Perplexity = exp(cross-entropy) on a toy 5-token sequence ---
probs = np.array([0.5, 0.4, 0.1, 0.25, 0.2])        # model's prob for each gold token
cross_entropy = -np.mean(np.log(probs))             # average surprise in nats
ppl = np.exp(cross_entropy)
print("cross_entropy=%.3f  perplexity=%.3f" % (cross_entropy, ppl))
# cross_entropy=1.382  perplexity=3.981

import matplotlib.pyplot as plt
fig, ax = plt.subplots(1, 2, figsize=(11, 4))
ax[0].bar(["p1","p2","p3","p4","BP","BLEU"], ps + [BP, bleu],
          color=["#4ea1ff"]*4 + ["#ffb454", "#7ee787"])
ax[0].set_title("BLEU = BP x geo-mean(p1..p4)"); ax[0].set_ylabel("value")
ax[1].bar(["BLEU","ROUGE-1","ROUGE-L"], [bleu, f1, rougeL],
          color=["#7ee787", "#c89bff", "#ffb454"])
ax[1].set_title("same pair, different rulers"); ax[1].set_ylim(0, 1)
plt.tight_layout(); plt.show()`
  };
})();
