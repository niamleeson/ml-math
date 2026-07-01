/* All ML — authored content for Part 8: Sequence Models & NLP (except 8.11, already authored).
   Generated with verified companion notebooks; LaTeX via String.raw; no prose italics. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 8.1 Text preprocessing & normalization ---------------- */
window.ALLML_CONTENT["8.1"] = {
  tagline: "Make text comparable before modeling, while preserving the signals the task actually needs.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.1-text-preprocessing.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Text preprocessing & normalization becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Make text comparable before modeling, while preserving the signals the task actually needs.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is normalization function $n(\cdot)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>casefolding maps &apos;Café&apos; and &apos;CAFÉ&apos; to one form, Unicode NFC prevents duplicate spellings, and the padding mask separates real tokens from placeholders.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering normalization function $n(\cdot)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.2 Edit distance & string algorithms ---------------- */
window.ALLML_CONTENT["8.2"] = {
  tagline: "A dynamic program turns string similarity into a minimum-cost path through insertions, deletions and substitutions.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.2-edit-distance.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Edit distance & string algorithms becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. A dynamic program turns string similarity into a minimum-cost path through insertions, deletions and substitutions.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is Levenshtein recurrence $D_{i,j}=\min(D_{i-1,j}+1,D_{i,j-1}+1,D_{i-1,j-1}+c)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>the table for &apos;cat&apos; to &apos;cut&apos; ends at $1$, and &apos;kitten&apos; to &apos;sitting&apos; ends at $3$.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering Levenshtein recurrence $D_{i,j}=\min(D_{i-1,j}+1,D_{i,j-1}+1,D_{i-1,j-1}+c)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.3 Tokenization (BPE, WordPiece, SentencePiece) ---------------- */
window.ALLML_CONTENT["8.3"] = {
  tagline: "Subwords are the compromise between brittle word vocabularies and long character sequences.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.3-tokenization.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Tokenization (BPE, WordPiece, SentencePiece) becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Subwords are the compromise between brittle word vocabularies and long character sequences.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is merge or segmentation score $s(x_1,\ldots,x_k)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>the most frequent BPE pair is &apos;l&apos;+&apos;o&apos;, and the word &apos;lowest&apos; can be represented by subwords instead of &apos;&lt;unk&gt;&apos;.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering merge or segmentation score $s(x_1,\ldots,x_k)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.4 Bag-of-words & TF-IDF ---------------- */
window.ALLML_CONTENT["8.4"] = {
  tagline: "Count what appears, then discount what appears everywhere.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.4-bow-tfidf.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Bag-of-words & TF-IDF becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Count what appears, then discount what appears everywhere.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $\mathrm{tfidf}(t,d)=\mathrm{tf}(t,d)\log\frac{1+N}{1+\mathrm{df}(t)}+\mathrm{tf}(t,d)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>&apos;cat sat&apos; creates a count row, and IDF makes rare &apos;fish&apos; heavier than common &apos;cat&apos;.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $\mathrm{tfidf}(t,d)=\mathrm{tf}(t,d)\log\frac{1+N}{1+\mathrm{df}(t)}+\mathrm{tf}(t,d)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.5 n-gram language models ---------------- */
window.ALLML_CONTENT["8.5"] = {
  tagline: "Predict the next token by counting short histories.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.5-ngram-language-models.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: n-gram language models becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Predict the next token by counting short histories.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $P(w_t\mid w_{t-n+1:t-1})=\frac{c(h,w_t)}{c(h)}$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>after &apos;a&apos;, the toy corpus gives probabilities $[0,0.667,0.333]$ over &apos;[a,b,c]&apos;.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $P(w_t\mid w_{t-n+1:t-1})=\frac{c(h,w_t)}{c(h)}$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.6 Word embeddings (Word2Vec, GloVe, FastText) ---------------- */
window.ALLML_CONTENT["8.6"] = {
  tagline: "Words become useful vectors when nearby-context statistics become geometry.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.6-word-embeddings.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Word embeddings (Word2Vec, GloVe, FastText) becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Words become useful vectors when nearby-context statistics become geometry.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is cosine similarity $\frac{u^\top v}{\lVert u\rVert\lVert v\rVert}$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>&apos;king&apos; is closer to &apos;queen&apos; than to &apos;car&apos;, and &apos;king-man+woman=[2,3]&apos; in the toy analogy.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering cosine similarity $\frac{u^\top v}{\lVert u\rVert\lVert v\rVert}$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.7 Recurrent Neural Networks ---------------- */
window.ALLML_CONTENT["8.7"] = {
  tagline: "A shared transition lets one hidden state summarize all previous tokens.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.7-rnn.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Recurrent Neural Networks becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. A shared transition lets one hidden state summarize all previous tokens.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>the hidden state rises across &apos;[1,0,1,1]&apos;, while gradients like $0.2^{20}$ nearly vanish.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.8 LSTM ---------------- */
window.ALLML_CONTENT["8.8"] = {
  tagline: "Gates protect a memory cell from being overwritten at every step.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.8-lstm.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: LSTM becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Gates protect a memory cell from being overwritten at every step.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $c_t=f_t\odot c_{t-1}+i_t\odot g_t$ and $h_t=o_t\odot\tanh(c_t)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>with $f=0.8$, $i=0.5$, $g=	anh(2)$, the new cell is $1.282$.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $c_t=f_t\odot c_{t-1}+i_t\odot g_t$ and $h_t=o_t\odot\tanh(c_t)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.9 GRU ---------------- */
window.ALLML_CONTENT["8.9"] = {
  tagline: "A smaller gated recurrence blends old state and candidate state directly.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.9-gru.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: GRU becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. A smaller gated recurrence blends old state and candidate state directly.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $h_t=(1-z_t)h_{t-1}+z_t\tilde h_t$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>with $h=2$, candidate $-1$, the update gate moves smoothly from $2$ to $-1$.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $h_t=(1-z_t)h_{t-1}+z_t\tilde h_t$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.10 Sequence-to-sequence (encoder–decoder) ---------------- */
window.ALLML_CONTENT["8.10"] = {
  tagline: "An encoder reads the source sequence; a decoder writes a new sequence from that state.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.10-seq2seq.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Sequence-to-sequence (encoder–decoder) becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. An encoder reads the source sequence; a decoder writes a new sequence from that state.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $p(y_t\mid y_{\lt t},x)=\mathrm{softmax}(W h_t)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>the encoder compresses &apos;[2,1,3]&apos;, and the reverse-sequence target is &apos;[3,2,1]&apos;.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $p(y_t\mid y_{\lt t},x)=\mathrm{softmax}(W h_t)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.12 Transformers (self-attention, multi-head) ---------------- */
window.ALLML_CONTENT["8.12"] = {
  tagline: "A Transformer block makes every token contextual in parallel, then stabilizes the update.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.12-transformers.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Transformers (self-attention, multi-head) becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. A Transformer block makes every token contextual in parallel, then stabilizes the update.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $Y=\mathrm{LayerNorm}(X+\mathrm{Attention}(X))$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>self-attention rows sum to $1$, and LayerNorm makes each token row mean $0$.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $Y=\mathrm{LayerNorm}(X+\mathrm{Attention}(X))$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.13 Positional encodings (sinusoidal, learned, RoPE, ALiBi, relative) ---------------- */
window.ALLML_CONTENT["8.13"] = {
  tagline: "Attention needs explicit position because content alone does not specify order.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.13-positional-encodings.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Positional encodings (sinusoidal, learned, RoPE, ALiBi, relative) becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Attention needs explicit position because content alone does not specify order.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $x_t'=x_t+p_t$ or a position-dependent bias/rotation. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>sinusoidal position $0$ has cosine value $1$, and ALiBi makes far positions more negative.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $x_t'=x_t+p_t$ or a position-dependent bias/rotation, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.14 Efficient & long-context attention ---------------- */
window.ALLML_CONTENT["8.14"] = {
  tagline: "Long-context methods keep essential links without storing every token-token pair.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.14-efficient-long-context-attention.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Efficient & long-context attention becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Long-context methods keep essential links without storing every token-token pair.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is dense cost $T^2$ versus sparse or streamed attention. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>increasing $T$ from $128$ to $1024$ multiplies dense memory by $64$.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering dense cost $T^2$ versus sparse or streamed attention, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.15 Decoding strategies ---------------- */
window.ALLML_CONTENT["8.15"] = {
  tagline: "Decoding is the policy that turns next-token probabilities into actual text.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.15-decoding-strategies.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Decoding strategies becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Decoding is the policy that turns next-token probabilities into actual text.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $p_i=\mathrm{softmax}(z_i/\tau)$ plus filtering sets. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>higher temperature raises entropy, top-k keeps exactly three candidates, and nucleus keeps the smallest mass above the threshold.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $p_i=\mathrm{softmax}(z_i/\tau)$ plus filtering sets, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.16 Language-model evaluation ---------------- */
window.ALLML_CONTENT["8.16"] = {
  tagline: "No single text metric measures everything, so likelihood and overlap must be read together.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.16-lm-evaluation.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Language-model evaluation becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. No single text metric measures everything, so likelihood and overlap must be read together.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is perplexity $=\exp\left(-\frac1T\sum_t\log p_t\right)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>probabilities &apos;[0.5,0.25,0.25]&apos; give perplexity $3.175$.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering perplexity $=\exp\left(-\frac1T\sum_t\log p_t\right)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.17 Named entity recognition & sequence labeling ---------------- */
window.ALLML_CONTENT["8.17"] = {
  tagline: "Sequence labeling predicts one structured tag per token, not one label for the whole sentence.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.17-ner-sequence-labeling.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Named entity recognition & sequence labeling becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Sequence labeling predicts one structured tag per token, not one label for the whole sentence.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $\arg\max_y \sum_t e_t(y_t)+\sum_t A_{y_{t-1},y_t}$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>BIO tags turn &apos;Ada ... OpenAI&apos; into person and organization spans.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $\arg\max_y \sum_t e_t(y_t)+\sum_t A_{y_{t-1},y_t}$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.18 POS tagging & morphology ---------------- */
window.ALLML_CONTENT["8.18"] = {
  tagline: "POS and morphology explain how a token behaves syntactically and internally.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.18-pos-tagging-morphology.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: POS tagging & morphology becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. POS and morphology explain how a token behaves syntactically and internally.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is tag score $e_t(y)+A_{y_{t-1},y}$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>the suffix &apos;-ed&apos; is a past-tense feature and context can flip an ambiguous word to VERB.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering tag score $e_t(y)+A_{y_{t-1},y}$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.19 Dependency & constituency parsing ---------------- */
window.ALLML_CONTENT["8.19"] = {
  tagline: "Parsing turns a sentence into arcs between words or nested phrase spans.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.19-dependency-constituency-parsing.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Dependency & constituency parsing becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Parsing turns a sentence into arcs between words or nested phrase spans.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is dependency tree score $\sum_i s(h_i,i)$ and span chart scores. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>the best head for &apos;her&apos; is &apos;saw&apos;, and CKY fills the full span after shorter spans.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering dependency tree score $\sum_i s(h_i,i)$ and span chart scores, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.20 Coreference resolution ---------------- */
window.ALLML_CONTENT["8.20"] = {
  tagline: "Coreference links mentions that point to the same real-world entity.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.20-coreference-resolution.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Coreference resolution becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Coreference links mentions that point to the same real-world entity.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is pair score $s(i,j)$ plus clustering over antecedent links. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>&apos;Alice&apos; links to &apos;she&apos;, agreement masks impossible links, and pairwise F1 is $0.5$ in the toy case.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering pair score $s(i,j)$ plus clustering over antecedent links, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.21 Semantic role labeling ---------------- */
window.ALLML_CONTENT["8.21"] = {
  tagline: "SRL names the roles around a predicate: who did what to whom.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.21-semantic-role-labeling.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Semantic role labeling becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. SRL names the roles around a predicate: who did what to whom.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is role score $s(\text{predicate},\text{span},r)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>&apos;sold&apos; anchors the frame, ARG0 wins with highest probability, and duplicate ARG1 violates a global constraint.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering role score $s(\text{predicate},\text{span},r)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.22 Machine translation ---------------- */
window.ALLML_CONTENT["8.22"] = {
  tagline: "Translation preserves meaning while changing language and often word order.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.22-machine-translation.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Machine translation becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Translation preserves meaning while changing language and often word order.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $p(y\mid x)=\prod_t p(y_t\mid y_{\lt t},x)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>the lexical table maps &apos;je&apos; to &apos;I&apos; and attention rows sum to $1$.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $p(y\mid x)=\prod_t p(y_t\mid y_{\lt t},x)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.23 Question answering ---------------- */
window.ALLML_CONTENT["8.23"] = {
  tagline: "QA conditions on a question and context to select or generate an answer.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.23-question-answering.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Question answering becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. QA conditions on a question and context to select or generate an answer.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is span score $P_\text{start}(i)P_\text{end}(j)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>the toy question selects &apos;France&apos;, and no-answer can beat the best span.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering span score $P_\text{start}(i)P_\text{end}(j)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.24 Summarization ---------------- */
window.ALLML_CONTENT["8.24"] = {
  tagline: "Summarization compresses while preserving salient facts.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.24-summarization.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Summarization becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Summarization compresses while preserving salient facts.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is selection score $\lambda\,\mathrm{salience}-(1-\lambda)\,\mathrm{redundancy}$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>MMR chooses a less redundant sentence, and ROUGE recall is $0.6$ for three of five facts.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering selection score $\lambda\,\mathrm{salience}-(1-\lambda)\,\mathrm{redundancy}$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.25 Text classification & sentiment ---------------- */
window.ALLML_CONTENT["8.25"] = {
  tagline: "Text classification pools token evidence into one document-level decision.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.25-text-classification-sentiment.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Text classification & sentiment becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Text classification pools token evidence into one document-level decision.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $p(y=1\mid x)=\sigma(w^\top x+b)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>two &apos;good&apos; counts give a positive probability above $0.9$, while negation lowers the score.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $p(y=1\mid x)=\sigma(w^\top x+b)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.26 Dialogue systems & chatbots ---------------- */
window.ALLML_CONTENT["8.26"] = {
  tagline: "Dialogue models combine intent, state, retrieval and safety over many turns.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.26-dialogue-systems.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Dialogue systems & chatbots becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Dialogue models combine intent, state, retrieval and safety over many turns.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is state update $s_t=f(s_{t-1},u_t)$ and response score $q^\top r$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>slot count grows over turns, retrieval picks the nearest response, and safety below $0.5$ triggers fallback.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering state update $s_t=f(s_{t-1},u_t)$ and response score $q^\top r$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.27 Multilingual & cross-lingual NLP ---------------- */
window.ALLML_CONTENT["8.27"] = {
  tagline: "Cross-lingual NLP aligns languages so supervision can transfer across them.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.27-multilingual-cross-lingual-nlp.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Multilingual & cross-lingual NLP becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Cross-lingual NLP aligns languages so supervision can transfer across them.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is shared-space similarity $\cos(e_\text{source},e_\text{target})$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>English and Spanish vectors align on the diagonal, while tokenizer coverage drops across scripts.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering shared-space similarity $\cos(e_\text{source},e_\text{target})$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};

/* ---------------- 8.28 Text-to-SQL & semantic parsing ---------------- */
window.ALLML_CONTENT["8.28"] = {
  tagline: "Semantic parsing maps language to executable meaning under grammar and schema constraints.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.28-text-to-sql-semantic-parsing.ipynb",
  context: String.raw`
    <p>This lesson sits in the sequence-modeling spine of Part 8, where raw text becomes structured computation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the vectors, matrices and dot products used to score tokens, spans, documents or actions.</li>
      <li><b>Probability and softmax</b> turn those scores into normalized choices, so the model can rank alternatives instead of making brittle rules.</li>
      <li><b>Earlier NLP representations</b> feed directly into this topic: normalization, tokenization, counts and embeddings decide what information reaches the model.</li>
    </ul>
    <p>Where it leads: Text-to-SQL & semantic parsing becomes one of the working parts behind Transformers (8.12), evaluation (8.16), task-specific NLP systems (8.17–8.28), and the large-language-model lessons that follow. The habit to carry forward is to name the representation, name the score, and then ask what information the score can and cannot see.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple to state: text is discrete, contextual and variable-length, but a learning system needs stable numerical decisions. Semantic parsing maps language to executable meaning under grammar and schema constraints.</p>
    <p>The naive approach is to hand-code every exception. That works for a classroom example and fails the moment spelling, order, ambiguity or context changes. The better mental model is a carefully designed scoring machine: choose what objects are comparable, score the allowed alternatives, normalize or decode the scores, and then inspect the errors.</p>
    <p>The design decision people often gloss over is what to throw away. Every NLP representation is a controlled loss of information. The wise choice is not to keep everything; it is to keep the distinctions the downstream decision needs while discarding variation that would only fragment the data.</p>`,
  mathematics: String.raw`
    <p>The core object for this lesson is $\arg\max_a \sum_t \log p(a_t\mid a_{\lt t},x,\mathcal S)$. Every symbol names a concrete part of the computation: the input tokens or spans are the rows, the scores are the model's preferences, and the final probabilities, paths or labels are the decision the system exposes.</p>
    <p><b>Tiny verified case.</b> In the companion notebook, the first cell builds the smallest version of the mechanism and checks it with an assertion:</p>
    <ol class="work">
      <li>grammar masks assign zero probability to invalid actions, and execution accuracy can exceed exact match.</li>
      <li>The plotted quantity is computed before it is shown, and the final line asserts the expected value so the notebook cannot silently drift.</li>
    </ol>
    <p>That tiny case matters because it makes the representation accountable. If the score cannot explain this toy example, it will not become trustworthy merely by scaling up.</p>
    <p><b>The knob turn.</b> The second through fourth notebook cells change one design choice at a time: a gate, a smoothing constant, a mask, a threshold, a transition score, or a decoding policy depending on the lesson.</p>
    <ol class="work">
      <li>The before case is computed as one vector or table.</li>
      <li>The after case changes exactly one term in the formula.</li>
      <li>The assertion checks the intended inequality, such as a probability increasing, an invalid option becoming zero, or a longer path receiving a different score.</li>
    </ol>
    <p>This is the arithmetic habit behind reliable NLP work: isolate one moving part, compute it by hand-sized code, and only then trust the larger model.</p>
    <p><b>End-to-end reading.</b> The fifth notebook cell connects the pieces into a small synthetic task. It stays CPU-only and uses no pretrained model, so the lesson remains about the mechanism rather than a downloaded artifact. The result is not a benchmark; it is a microscope for seeing why the method behaves the way it does.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting preprocessing become invisible.</b> If the representation changes the rows entering $\arg\max_a \sum_t \log p(a_t\mid a_{\lt t},x,\mathcal S)$, every downstream score changes too; log the policy and test it on edge cases.</li>
      <li><b>Trusting a normalized score without checking its support.</b> Softmax, decoding and dynamic programs only normalize over what you allow; an unmasked invalid token, span or action can look numerically confident while being structurally wrong.</li>
      <li><b>Evaluating with one number.</b> NLP systems trade off likelihood, overlap, faithfulness, latency and safety; a single metric can hide the failure mode caused by the mathematical term you changed.</li>
      <li><b>Scaling before the toy case works.</b> Large models make the same arithmetic harder to inspect, not more correct; the five notebook assertions are the minimum sanity check.</li>
    </ul>`
};
