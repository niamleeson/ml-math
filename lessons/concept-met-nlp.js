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
      `<p>Reference (human): <code>the quick brown fox</code> (4 words). Candidate (machine): <code>the brown fox</code> (3 words).</p>
       <p><b>Unigram precision</b> $p_1$ = (candidate words found in the reference) / (candidate words). All three of "the", "brown", "fox" appear in the reference, so $p_1 = 3/3 = 1.0$.</p>
       <p><b>Bigram precision</b> $p_2$: candidate bigrams are "the brown" and "brown fox". The reference bigrams are "the quick", "quick brown", "brown fox". Only "brown fox" matches, so $p_2 = 1/2 = 0.5$.</p>
       <p><b>Brevity penalty</b>: candidate length $c = 3$, reference length $r = 4$, and $c \\le r$, so $\\text{BP} = e^{1 - 4/3} = e^{-1/3} \\approx 0.717$.</p>
       <p><b>BLEU (up to bigrams, equal weights $1/2$)</b>: $\\text{BP}\\cdot\\exp\\!\\big(\\tfrac12\\log 1.0 + \\tfrac12\\log 0.5\\big) = 0.717 \\times \\sqrt{1.0 \\times 0.5} \\approx 0.717 \\times 0.707 \\approx 0.507$.</p>
       <p><b>WER</b>: turning the candidate into the reference needs one insertion ("quick"), so $S=0, D=0, I=1$ over $4$ reference words: $\\text{WER} = 1/4 = 0.25$.</p>
       <p><b>ROUGE-1 F1</b>: recall $R = 3/4 = 0.75$ (3 of 4 reference words produced), precision $P = 3/3 = 1.0$, so $F_1 = \\frac{2(1.0)(0.75)}{1.0+0.75} = \\frac{1.5}{1.75} \\approx 0.857$.</p>
       <p>One short candidate, several rulers: BLEU $\\approx 0.51$, WER $= 0.25$, ROUGE-1 $\\approx 0.86$. They disagree because each weighs precision, recall, and length differently.</p>`,

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
    question: "Given one human reference and three machine candidates, do the metrics agree on which candidate is best — high BLEU and ROUGE, low WER for the good one?",
    charts: [{
      type: "bars",
      title: "Three candidates vs one reference: BLEU-1 & ROUGE-1 reward the close match, WER punishes errors",
      xlabel: "candidate (A best, C worst)",
      ylabel: "score (0..1)",
      labels: ["A BLEU-1", "A ROUGE-1", "A WER", "B BLEU-1", "B ROUGE-1", "B WER", "C BLEU-1", "C ROUGE-1", "C WER"],
      values: [1.0, 1.0, 0.0, 0.778, 0.778, 0.222, 0.571, 0.5, 0.889],
      valueLabels: ["1.00", "1.00", "0.00", "0.78", "0.78", "0.22", "0.57", "0.50", "0.89"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454", "#4ea1ff", "#7ee787", "#ffb454", "#4ea1ff", "#7ee787", "#ffb454"]
    }],
    caption: "Reference: \"the quick brown fox jumps over the lazy dog\". Candidate A is an exact copy (BLEU-1 = ROUGE-1 = 1.00, WER = 0.00). Candidate B (\"a quick brown fox jumped over the lazy dog\") has two changed words, so overlap drops to 0.78 and WER rises to 0.22. Candidate C (\"the dog ran past a brown fox\") shares few words: BLEU-1 = 0.57, ROUGE-1 = 0.50, WER = 0.89. Every metric agrees on the ranking A > B > C — BLEU/ROUGE up, WER down for the better candidate. All numbers are computed below with numpy only (edit distance for WER, clipped n-gram overlap for BLEU-1 and ROUGE-1).",
    code: `import numpy as np
from collections import Counter

reference = "the quick brown fox jumps over the lazy dog"
candidates = {
    "A": "the quick brown fox jumps over the lazy dog",   # exact copy
    "B": "a quick brown fox jumped over the lazy dog",     # two word changes
    "C": "the dog ran past a brown fox",                   # mostly different
}

def tokenize(s):
    return s.split()

def wer(ref, hyp):                       # Word Error Rate via Levenshtein edit distance
    r, h = tokenize(ref), tokenize(hyp)
    n, m = len(r), len(h)
    D = np.zeros((n + 1, m + 1), dtype=int)
    D[:, 0] = np.arange(n + 1)           # deleting all reference words
    D[0, :] = np.arange(m + 1)           # inserting all hypothesis words
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if r[i - 1] == h[j - 1] else 1
            D[i, j] = min(D[i - 1, j] + 1,        # deletion
                          D[i, j - 1] + 1,        # insertion
                          D[i - 1, j - 1] + cost) # match or substitution
    return D[n, m] / max(n, 1)

def clipped_overlap(ref, hyp):           # shared unigrams, each clipped to ref count
    rc, hc = Counter(tokenize(ref)), Counter(tokenize(hyp))
    return sum(min(hc[w], rc[w]) for w in hc)

def bleu1(ref, hyp):                     # BLEU = clipped unigram precision here
    overlap = clipped_overlap(ref, hyp)
    return overlap / max(len(tokenize(hyp)), 1)

def rouge1_f1(ref, hyp):                 # ROUGE-1 = F1 of unigram precision & recall
    overlap = clipped_overlap(ref, hyp)
    rec = overlap / max(len(tokenize(ref)), 1)
    prec = overlap / max(len(tokenize(hyp)), 1)
    return 0.0 if rec + prec == 0 else 2 * rec * prec / (rec + prec)

for name, cand in candidates.items():
    print(name,
          "BLEU-1=%.3f" % bleu1(reference, cand),
          "ROUGE-1=%.3f" % rouge1_f1(reference, cand),
          "WER=%.3f" % wer(reference, cand))
# A BLEU-1=1.000 ROUGE-1=1.000 WER=0.000
# B BLEU-1=0.778 ROUGE-1=0.778 WER=0.222
# C BLEU-1=0.571 ROUGE-1=0.500 WER=0.889

import matplotlib.pyplot as plt
names = list(candidates)
x = np.arange(len(names))
plt.bar(x - 0.25, [bleu1(reference, candidates[n]) for n in names], 0.25, label="BLEU-1", color="#4ea1ff")
plt.bar(x + 0.00, [rouge1_f1(reference, candidates[n]) for n in names], 0.25, label="ROUGE-1", color="#7ee787")
plt.bar(x + 0.25, [wer(reference, candidates[n]) for n in names], 0.25, label="WER", color="#ffb454")
plt.xticks(x, names); plt.ylabel("score (0..1)"); plt.legend()
plt.title("BLEU-1 & ROUGE-1 up, WER down for the better candidate")
plt.show()`
  };
})();
