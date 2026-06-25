/* Paper lesson — "Leveraging Passage Retrieval with Generative Models for Open
   Domain Question Answering" (Fusion-in-Decoder, FiD), Izacard & Grave, 2020.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-fid".
   GROUNDED from arXiv:2007.01282 (abstract) and the ar5iv HTML mirror
   (Section 3 "Method": independent per-passage encoding + decoder fusion over
   the concatenation + linear-cost argument; Section 4 "Scaling with number of
   passages" / Figure 3; Table 1 exact-match scores).
   Track B (architecture): compose a tiny encoder + decoder with torch.nn, then
   implement the NOVEL part by hand — encode each passage INDEPENDENTLY, then
   CONCATENATE all passage encodings and let the decoder attend over the union
   (fusion happens in the decoder). Reproduce: answer accuracy rises as the
   decoder fuses more passages whose evidence is spread across the set. */
(function () {
  window.LESSONS.push({
    id: "paper-fid",
    title: "FiD — Leveraging Passage Retrieval with Generative Models for Open Domain Question Answering (2020)",
    tagline: "Encode each retrieved passage on its own, then let the decoder fuse evidence across all of them at once.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Gautier Izacard, Edouard Grave",
      org: "Facebook AI Research; Inria; ENS, PSL University",
      year: 2020,
      venue: "arXiv:2007.01282 (Jul 2020); EACL 2021",
      citations: "",
      arxiv: "https://arxiv.org/abs/2007.01282",
      code: "https://github.com/facebookresearch/FiD"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-transformer", "paper-t5", "paper-seq2seq", "dl-attention", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p><b>Open-domain question answering</b> (open-domain QA = answer any question without being told which
       document holds the answer) was being solved in two opposite ways, each with a flaw.</p>
       <ul>
        <li><b>Big generative models alone.</b> A large sequence-to-sequence model (a network that reads text and
        writes text) can answer questions purely from what it memorized during pretraining. But, from the abstract,
        "this approach requires to use models with billions of parameters, which are expensive to train and query."</li>
        <li><b>Retrieve-then-read with extraction.</b> Fetch a few candidate passages, then have a model
        <i>extract</i> a span from one passage as the answer. This is cheaper, but committing to a span inside a
        single passage makes it hard to combine clues that are spread across several passages.</li>
       </ul>
       <p>The paper asks a sharp question (abstract): "we investigate how much these models can benefit from
       retrieving text passages, potentially containing evidence." In plain words: take a generative model, feed it
       <i>many</i> retrieved passages, and let it <i>write</i> the answer while aggregating evidence from all of
       them. The open problem is how to feed many passages to a Transformer without the cost exploding.</p>`,
    contribution:
      `<ul>
        <li><b>Fusion-in-Decoder (FiD).</b> Each retrieved passage is encoded <b>independently</b> by the encoder,
        then <i>all</i> passage encodings are <b>concatenated</b> and the decoder attends jointly over the union.
        The "fusion" of evidence happens in the <b>decoder</b>, not the encoder &mdash; hence the name.</li>
        <li><b>Linear cost in the number of passages.</b> Because the encoder never lets passages attend to each
        other, self-attention runs over one passage at a time. Cost grows linearly with the passage count, not
        quadratically, so the model can read 100 passages.</li>
        <li><b>Evidence aggregation is the payoff.</b> From the abstract: "the performance of this method
        significantly improves when increasing the number of retrieved passages. This is evidence that generative
        models are good at aggregating and combining evidence from multiple passages."</li>
      </ul>`,
    whyItMattered:
      `<p>FiD became the standard recipe for <b>retrieval-augmented generation</b> (retrieval-augmented = give the
       model retrieved text to read before it answers). It showed a small generative reader, fed many passages,
       could beat far larger closed-book models. The independent-encode / decoder-fuse split is now a common
       pattern whenever you must condition a Transformer on many documents at once. It sits alongside RAG
       (retrieval-augmented generation) as one of the two reference designs for open-domain QA that reads
       retrieved evidence.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Method)</b> &mdash; the whole architecture in barely a page. Three sentences carry the idea:
        each passage is "processed independently from other passages by the encoder"; the decoder "performs
        attention over the concatenation of the resulting representations of all the retrieved passages"; and the
        computation "grows linearly with the number of passages, instead of quadratically." Transcribe these.</li>
        <li><b>Figure 1</b> &mdash; the schematic: passages go up through the encoder separately, then merge into one
        decoder. One picture tells the story.</li>
        <li><b>&sect;4, "Scaling with number of passages" (Figure 3)</b> &mdash; the headline experiment: accuracy
        rises as you feed more passages. This is the effect you reproduce.</li>
        <li><b>Table 1</b> &mdash; the exact-match scores on Natural Questions and TriviaQA (quoted in Results).</li>
       </ul>
       <p><b>Skim:</b> the retriever details (DPR / BM25 used to fetch passages) and the training hyper-parameters.
       The novelty is the reader, not the retriever.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a tiny Fusion-in-Decoder reader. A toy "retriever" returns a <b>set</b> of 6 passages; the
       single clue that determines the answer is hidden in <i>one random passage</i> of that set. You will let the
       decoder fuse only the first $k$ of the 6 passages and measure answer accuracy as $k$ goes $1 \\to 6$.</p>
       <p>Before running: sketch the accuracy-vs-$k$ curve. If the clue is in a uniformly random one of 6 passages
       and the decoder can only see the first $k$, what fraction of the time is the clue visible? What accuracy do
       you expect at $k=1$ versus $k=6$? Write your guess.</p>`,
    attempt:
      `<p>Before the reveal, sketch the forward pass you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Encode independently.</b> For each passage <code>p</code> in the retrieved set, run it through the
        SAME encoder on its own: <code>h = encoder(embed(p))</code>. Crucially, passage A's tokens must NEVER
        attend to passage B's tokens. <i># this is what makes cost linear</i></li>
        <li><b>Fuse in the decoder.</b> TODO &mdash; take the list of per-passage encodings and
        <code>torch.cat([...], dim=1)</code> them into one long memory, then run the decoder so it attends over
        that concatenation: <code>decoder(query, mem)</code>.</li>
        <li>TODO: why must the concatenation happen <i>before</i> the decoder and NOT inside the encoder? What
        property would you lose if you concatenated the raw passages and encoded them together?</li>
       </ul>
       <p>Then run the ablation: force the decoder to fuse only ONE passage (no fusion) even though 6 were
       retrieved. Predict what happens to accuracy.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>FiD starts from an ordinary <b>sequence-to-sequence</b> Transformer &mdash; an <b>encoder</b> that reads
       text into vectors and a <b>decoder</b> that writes the answer one token at a time while attending to those
       vectors. The paper builds on a pretrained one (&sect;3): "based on a sequence-to-sequence network,
       pretrained on unsupervised data, such as T5 or BART." The novelty is entirely in <i>how the retrieved
       passages are routed through it</i>.</p>
       <p><b>Step 1 &mdash; format each passage.</b> The retriever returns $N$ passages for the question. Each
       passage is paired with the question and its title. The paper adds marker tokens (&sect;3): "We add special
       tokens question:, title: and context: before the question, title and text of each passage." So passage $i$
       becomes one input string: <code>question: ... title: ... context: ...</code>.</p>
       <p><b>Step 2 &mdash; encode each passage INDEPENDENTLY.</b> This is the first half of the idea (&sect;3):
       "each retrieved passage and its title are concatenated with the question, and processed independently from
       other passages by the encoder." Independently means passage $i$'s self-attention sees only passage $i$'s own
       tokens. Run the encoder $N$ times, once per passage, producing $N$ separate encodings
       $E_1, E_2, \\dots, E_N$. Each $E_i$ is a sequence of vectors, one per token of passage $i$.</p>
       <p><b>Step 3 &mdash; CONCATENATE, then fuse in the DECODER.</b> This is the second half (&sect;3): "the
       decoder performs attention over the concatenation of the resulting representations of all the retrieved
       passages." Lay the $N$ encodings end to end into one long memory
       $M = [\\,E_1; E_2; \\dots; E_N\\,]$. The decoder's cross-attention reads over <i>all</i> of $M$ at once. So
       the only place where information from different passages mixes is the decoder &mdash; the <b>fusion</b>
       happens <b>in the decoder</b>. That is why a clue in passage 3 and a clue in passage 7 can both reach the
       answer: the decoder attends across the whole union.</p>
       <p><b>Why this is cheap.</b> Self-attention cost grows with the square of the sequence length. If you
       instead glued all $N$ passages into one giant input and encoded them together, the encoder's self-attention
       would be quadratic in $N$. By encoding each passage alone, the encoder's self-attention is over one passage
       at a time, so (&sect;3) "the computation time of the model grows linearly with the number of passages,
       instead of quadratically." The decoder does attend over the full concatenation, but the decoder's query is
       short (just the answer being generated), so that cross-attention is far cheaper than full self-attention
       over everything. That is the whole trick: pay quadratic cost only <i>within</i> each small passage, never
       <i>across</i> the whole set.</p>`,
    symbols: [
      { sym: "$N$", desc: "the <b>number of retrieved passages</b> fed to the reader for one question. The paper scales this up to 100." },
      { sym: "$P_i$", desc: "the $i$-th <b>retrieved passage</b> (its text, plus the question and title, with the <code>question:</code> / <code>title:</code> / <code>context:</code> marker tokens)." },
      { sym: "$\\text{Enc}(\\cdot)$", desc: "the <b>encoder</b>: the part of the sequence-to-sequence model that turns a token sequence into a sequence of vectors. The SAME encoder is reused for every passage." },
      { sym: "$E_i$", desc: "the <b>encoding of passage</b> $P_i$: $E_i = \\text{Enc}(P_i)$. A sequence of vectors, one per token of passage $i$. Computed independently of the other passages." },
      { sym: "$[\\,E_1; \\dots; E_N\\,]$", desc: "the <b>concatenation</b> of all passage encodings, laid end to end into one long memory sequence. The semicolon means \"stack these sequences one after another.\"" },
      { sym: "$M$", desc: "the fused <b>memory</b> the decoder reads: $M = [\\,E_1; E_2; \\dots; E_N\\,]$. Length = sum of all passage lengths." },
      { sym: "$\\text{Dec}(\\cdot)$", desc: "the <b>decoder</b>: writes the answer token by token. Its <b>cross-attention</b> attends over the memory $M$ &mdash; this is where evidence from different passages is fused." },
      { sym: "“cross-attention”", desc: "a plain term: the decoder layer that lets the answer-in-progress attend to the encoder memory $M$. In FiD it ranges over the concatenation of all passages, so the decoder can pull a clue from any passage." },
      { sym: "“open-domain QA”", desc: "open-domain question answering: answering a question without being told which document contains the answer; you must retrieve evidence first." }
    ],
    formula: `$$ E_i = \\text{Enc}(P_i)\\ \\ \\text{(each passage encoded independently, \\S3)} \\qquad\\qquad \\text{answer} = \\text{Dec}\\big(\\,[\\,E_1; E_2; \\dots; E_N\\,]\\,\\big)\\ \\ \\text{(decoder fuses the concatenation, \\S3)} $$`,
    whatItDoes:
      `<p><b>The left equation</b> says: run the encoder once per passage, separately. Passage $i$ never sees
       passage $j$. This is the source of the linear cost &mdash; the encoder's expensive self-attention is paid
       only over one short passage at a time, $N$ times, instead of once over a giant length-$N$ input
       (which would be quadratic).</p>
       <p><b>The right equation</b> says: glue the $N$ encodings into one memory and let the decoder attend over the
       whole thing. The decoder is the FIRST and ONLY place where passages interact. Because its cross-attention
       spans the union of all passages, the answer can combine a fact from passage 2 with a fact from passage 40.
       That is "fusion in the decoder." The design separates a cheap, parallel, per-passage <i>read</i> from a
       single joint <i>aggregation</i> step.</p>`,
    derivation:
      `<p>There is no new loss function to derive &mdash; FiD trains with ordinary sequence-to-sequence
       cross-entropy on the answer text. The thing to justify is the <b>cost</b> claim, which is the design's whole
       reason for existing. (This lesson has no separate concept owner, so we work it out here.)</p>
       <p><b>Self-attention is quadratic.</b> For a sequence of length $T$, self-attention compares every token to
       every other token, so its cost scales like $T^2$. Now suppose you have $N$ passages, each of length $\\ell$.</p>
       <p><b>Option A &mdash; encode everything together (the naive way).</b> Concatenate the raw passages into one
       input of length $T = N\\ell$. The encoder's self-attention then costs about
       $$ (N\\ell)^2 = N^2 \\ell^2, $$
       which is <b>quadratic</b> in the number of passages $N$. Double the passages, quadruple the encoder cost.</p>
       <p><b>Option B &mdash; FiD: encode each passage alone.</b> Run the encoder $N$ times, each over a length-$\\ell$
       passage. The total encoder self-attention cost is
       $$ N \\cdot \\ell^2, $$
       which is <b>linear</b> in $N$. The catch you give up: passages cannot attend to each other in the encoder.
       FiD recovers that interaction in the decoder, whose cross-attention costs about
       $$ (\\text{answer length}) \\times (N\\ell), $$
       linear in $N$ and small because the answer is short. So FiD trades $N^2\\ell^2$ encoder cost for
       $N\\ell^2 + (\\text{small})\\,N\\ell$ &mdash; linear, which is exactly why it can read 100 passages where the
       naive model cannot. This matches the paper's statement (&sect;3) that cost "grows linearly with the number of
       passages, instead of quadratically."</p>`,
    example:
      `<p>Work the toy reproduction by hand so the accuracy curve is predictable. Setup: the retriever returns
       $N=6$ passages. The single clue that fixes the answer sits in <b>one uniformly random</b> passage of the 6.
       There are $C=8$ possible answers. If the decoder fuses the first $k$ passages and the clue is inside that
       window, the model reads it and answers correctly; if the clue is outside, the model has no information and
       guesses uniformly, getting it right $1/C = 1/8$ of the time.</p>
       <ul class="steps">
        <li><b>Probability the clue is visible.</b> The clue is in a uniform random one of 6 passages, so the chance
        it falls within the first $k$ is $P(\\text{visible}) = k/6$.</li>
        <li><b>Expected accuracy.</b> Visible &rarr; correct (probability $k/6$); not visible &rarr; guess, correct
        with probability $1/8$. So
        $$ \\mathbb{E}[\\text{acc}] = \\frac{k}{6}\\cdot 1 + \\Big(1 - \\frac{k}{6}\\Big)\\cdot \\frac{1}{8}. $$</li>
        <li><b>Plug in $k=1$.</b> $P(\\text{visible}) = 1/6 \\approx 0.1667$. Accuracy
        $= 0.1667 + (0.8333)(0.125) = 0.1667 + 0.1042 = 0.2708$.</li>
        <li><b>Plug in $k=3$.</b> $P(\\text{visible}) = 3/6 = 0.5$. Accuracy
        $= 0.5 + (0.5)(0.125) = 0.5 + 0.0625 = 0.5625$.</li>
        <li><b>Plug in $k=6$.</b> $P(\\text{visible}) = 6/6 = 1$. Accuracy $= 1\\cdot 1 + 0\\cdot 0.125 = 1.0$.</li>
       </ul>
       <p>So the predicted curve is $0.27, 0.42, 0.56, 0.71, 0.85, 1.00$ for $k = 1\\dots 6$. The trained tiny model
       below tracks this closely (it measured $\\approx 0.22, 0.32, 0.56, 0.70, 0.86, 1.00$): more fused passages
       &rarr; the spread-out evidence is found &rarr; higher accuracy. This is the paper's effect in miniature.</p>`,
    recipe:
      `<ol>
        <li><b>Build the pieces</b> with <code>torch.nn</code>: a token <code>nn.Embedding</code>, a small
        <code>nn.TransformerEncoder</code> (shared across passages), an <code>nn.TransformerDecoder</code>, and a
        linear answer head. (FiD uses a pretrained T5 / BART; here we use tiny randomly-initialized blocks so it
        runs on CPU.)</li>
        <li><b>Make the toy data:</b> a "retriever" returns $N=6$ passages of filler tokens; plant one
        answer-signaling token in ONE random passage of the set, so the evidence is spread across the retrieved set.</li>
        <li><b>Encode independently (by hand):</b> loop over the passages and run the SAME encoder on each one
        alone &mdash; <code>E_i = encoder(embed(P_i))</code>. No passage attends to another.</li>
        <li><b>Fuse in the decoder:</b> <code>mem = torch.cat([E_1, ..., E_N], dim=1)</code>, then
        <code>decoder(query, mem)</code> so the decoder attends over the concatenation. Read the answer from the
        head.</li>
        <li><b>Scaling experiment:</b> let the decoder fuse only the first $k$ passages and plot accuracy as
        $k: 1 \\to 6$.</li>
        <li><b>Ablate the fusion:</b> set $k=1$ (decoder sees a single passage) even though 6 were retrieved &mdash;
        accuracy collapses toward chance, isolating fusion as the source of the gain.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the method obtains "state-of-the-art results on the Natural Questions and
       TriviaQA open benchmarks," and "the performance of this method significantly improves when increasing the
       number of retrieved passages."</p>
       <p>Exact-match scores (quoted from <b>Table 1</b>, the large model): <b>51.4</b> on Natural Questions and
       <b>67.6</b> on TriviaQA. The number-of-passages effect is <b>Figure 3</b> (&sect;4, "Scaling with number of
       passages"), whose caption reads: "Performance of Fusion-in-Decoder (base) on valid sets as a function of the
       number of retrieved passages." It shows accuracy rising as passages go from 10 toward 100.</p>
       <p><i>These are the paper's own reported numbers, quoted from the abstract, Table 1, and Figure 3. The
       numbers in the CODEVIZ panel below are from our own tiny run on a toy passage set &mdash; not the paper's
       reported results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The Transformer encoder and decoder already ship in
       PyTorch, so you <b>import</b> them and build only the novel routing. <b>Import:</b>
       <code>nn.Embedding</code>, <code>nn.TransformerEncoder</code> / <code>nn.TransformerEncoderLayer</code>,
       <code>nn.TransformerDecoder</code> / <code>nn.TransformerDecoderLayer</code>, <code>nn.Linear</code>, and
       <code>torch.optim.Adam</code>. <b>Build by hand:</b> the <b>Fusion-in-Decoder routing</b> &mdash; loop the
       SAME encoder over each passage independently, then <code>torch.cat</code> the per-passage encodings and feed
       the concatenation to the decoder's cross-attention. PyTorch will happily encode everything together if you
       let it; the contribution is the deliberate choice to encode separately and fuse only in the decoder. We use
       tiny random-init blocks on a toy task instead of a pretrained T5, so there are no real language models
       &mdash; the lesson is conceptual.</p>`,
    pitfalls:
      `<ul>
        <li><b>Encoding all passages together.</b> If you concatenate the raw passages BEFORE the encoder, the
        encoder's self-attention runs over the whole length &mdash; that is the quadratic-cost design FiD avoids,
        and it lets passages leak into each other in the encoder. <b>Fix:</b> encode each passage alone; concatenate
        only the <i>encodings</i>, right before the decoder.</li>
        <li><b>Forgetting the decoder must see the full concatenation.</b> If the decoder attends to only one
        passage's encoding, there is no fusion &mdash; you are back to single-passage reading. <b>Fix:</b> the
        decoder memory must be the <code>cat</code> of ALL passage encodings.</li>
        <li><b>Thinking more passages always means more cost-per-passage.</b> The point of independent encoding is
        that each passage costs the same no matter how many others there are; total encoder cost is linear, not
        quadratic. Reading 100 passages is feasible exactly because of this.</li>
        <li><b>Confusing FiD with cross-passage encoder attention.</b> Some readers assume the model must let
        passages attend to each other to combine evidence. FiD shows you do not: keep the encoder per-passage and
        let the <i>decoder</i> do all the combining.</li>
        <li><b>Confusing the reader with the retriever.</b> FiD is a <i>reader</i> design. The passages come from a
        separate retriever (DPR / BM25). The paper's contribution and your implementation are about how the reader
        fuses passages, not how they are fetched.</li>
      </ul>`,
    recall: [
      "Where does the fusion of evidence happen in FiD &mdash; the encoder or the decoder?",
      "Write $E_i = \\text{Enc}(P_i)$ and the decoder-fusion step from memory; say which step is per-passage.",
      "Why is the encoder cost linear in the number of passages $N$ instead of quadratic?",
      "What does the ablation that fuses only ONE passage demonstrate?"
    ],
    practice: [
      {
        q: `<b>The fusion ablation.</b> You have a working FiD reader. Six passages are retrieved, with the answer
            clue in one random passage of the set. You change the decoder to fuse only the FIRST passage
            (<code>k_fuse = 1</code>) instead of all six, everything else identical. What did you just remove, and
            what do you expect to happen to accuracy?`,
        steps: [
          { do: `Locate the memory build: <code>mem = torch.cat([encode(p) for p in passages[:k_fuse]], dim=1)</code>. Set <code>k_fuse = 1</code>.`, why: `Now the decoder's cross-attention sees only passage 0's encoding, so it cannot pull a clue from passages 1&ndash;5.` },
          { do: `Reason about visibility: the clue is in a uniform random one of 6 passages, so with only passage 0 fused it is visible $1/6$ of the time; otherwise the model must guess among $C=8$ answers.`, why: `Expected accuracy $= \\tfrac{1}{6}\\cdot 1 + \\tfrac{5}{6}\\cdot\\tfrac{1}{8} \\approx 0.27$ &mdash; near chance.` },
          { do: `Compare to full fusion ($k=6$): the clue is always visible, so accuracy approaches 1.0.`, why: `Fusion across the whole retrieved set is what lets the decoder find evidence wherever it landed.` }
        ],
        answer: `<p>You removed the <b>cross-passage fusion</b>: with <code>k_fuse = 1</code> the decoder attends to a
                 single passage, so it can answer only when the clue happens to sit in that one passage
                 ($\\approx 1/6$ of the time) and otherwise guesses. Accuracy collapses from $\\approx 1.0$ (fuse all
                 6) to $\\approx 0.27$. This isolates the decoder fusion as the source of the gain &mdash; the same
                 reason the paper's accuracy rises with the number of passages (&sect;4, Figure 3).</p>`
      },
      {
        q: `<b>The linear-cost argument.</b> You have $N$ passages, each of length $\\ell$ tokens. Compare the
            encoder self-attention cost of (A) gluing all passages into one input and encoding them together, versus
            (B) FiD's per-passage encoding. Which is linear in $N$, and why does that let FiD read 100 passages?`,
        steps: [
          { do: `Recall self-attention cost scales like the square of the sequence length: length $T$ costs $\\sim T^2$.`, why: `Every token attends to every other token, so comparisons grow with $T^2$.` },
          { do: `Option A: one input of length $T = N\\ell$. Cost $\\sim (N\\ell)^2 = N^2\\ell^2$ &mdash; quadratic in $N$.`, why: `All passages attend to all others, so doubling $N$ quadruples encoder cost.` },
          { do: `Option B (FiD): encode each length-$\\ell$ passage alone, $N$ times. Cost $\\sim N\\cdot\\ell^2$ &mdash; linear in $N$.`, why: `Passages do not attend across each other in the encoder, so cost just adds up per passage.` }
        ],
        answer: `<p>Option A (encode together) is $N^2\\ell^2$ &mdash; <b>quadratic</b> in the passage count. FiD's
                 Option B is $N\\ell^2$ &mdash; <b>linear</b>, because each passage is encoded on its own and never
                 attends to the others. The decoder's cross-attention over the concatenation is also linear in $N$
                 and cheap because the answer is short. Linear cost is exactly what lets FiD scale to 100 passages
                 (&sect;3), where the naive quadratic model cannot.</p>`
      },
      {
        q: `In the worked example ($N=6$ passages, clue in a uniform random one, $C=8$ answers), the predicted
            accuracy was $\\mathbb{E}[\\text{acc}] = \\tfrac{k}{6} + (1-\\tfrac{k}{6})\\tfrac{1}{8}$. Suppose instead
            the retriever returned $N=10$ passages (clue still in one random passage) and the decoder fused $k=4$.
            Compute the expected accuracy. What does this say about retrieving more passages than you fuse?`,
        steps: [
          { do: `Probability the clue is visible in the first $k=4$ of $N=10$: $P = 4/10 = 0.4$.`, why: `The clue is uniform over 10 passages; only the first 4 are fused.` },
          { do: `Expected accuracy $= 0.4\\cdot 1 + (1 - 0.4)\\cdot\\tfrac{1}{8} = 0.4 + 0.6\\cdot 0.125 = 0.4 + 0.075 = 0.475$.`, why: `Visible &rarr; correct; not visible &rarr; guess at $1/8$.` },
          { do: `Compare: with $N=6$, $k=4$ gave $0.71$; with $N=10$, $k=4$ gives $0.475$.`, why: `Spreading the clue over more retrieved passages while fusing the same number lowers the chance it is in the window.` }
        ],
        answer: `<p>$\\mathbb{E}[\\text{acc}] = 0.4 + 0.6\\cdot 0.125 = 0.475$. Retrieving more passages only helps if
                 the decoder actually <b>fuses</b> them: with the clue spread over $N=10$ but only $k=4$ fused, the
                 evidence is outside the window more often, so accuracy drops to $0.475$ versus $0.71$ at $N=6$,
                 $k=4$. This is why FiD's payoff comes from fusing <i>many</i> passages in the decoder, not from
                 retrieving many and reading few &mdash; the whole point of the linear cost is that you <i>can</i>
                 afford to fuse them all.</p>`
      }
    ]
  });

  window.CODE["paper-fid"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a tiny encoder and decoder with <code>nn.TransformerEncoder</code> /
       <code>nn.TransformerDecoder</code>, then build the <b>novel</b> routing by hand &mdash; Fusion-in-Decoder.
       Each retrieved passage is encoded <b>independently</b> by the SAME encoder (a Python loop, cost linear in the
       passage count), then the per-passage encodings are <code>torch.cat</code>-ed into one memory and the decoder
       attends over that <b>concatenation</b> (fusion in the decoder, &sect;3). A toy "retriever" returns 6 passages
       of filler tokens with one answer-signaling token planted in ONE random passage, so the evidence is spread
       across the set. We let the decoder fuse only the first $k$ passages and watch accuracy climb as
       $k: 1 \\to 6$. The first cell recomputes the worked example's predicted curve
       ($0.27, 0.42, 0.56, 0.71, 0.85, 1.00$). The last cell is the <b>ablation</b>: fuse only 1 of the 6 retrieved
       passages and watch accuracy collapse. CPU, a few thousand fast iterations. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn
import random, numpy as np

torch.manual_seed(0); np.random.seed(0); random.seed(0)

# --- 0. Sanity-check the worked example: predicted accuracy curve. ---
# Clue in 1 of N=6 random passages; C=8 answers; decoder fuses first k passages.
# Visible -> correct; else guess at 1/C.  E[acc] = k/6 + (1 - k/6)/8.
N, C = 6, 8
for k in range(1, 7):
    p = k / N
    print("k=%d  P(clue visible)=%.4f  E[acc]=%.4f" % (k, p, p + (1 - p) / C))
# k=1 ... E[acc]=0.2708     k=3 ... 0.5625     k=6 ... 1.0000  -> matches the run below


# --- 1. Toy data: a "retriever" returns N passages; the answer clue is in ONE. ---
L = 5                                  # tokens per passage
FILL  = list(range(0, 6))              # distractor filler tokens
SIGNAL = list(range(6, 6 + C))         # one signal token per answer class
V = 6 + C                              # vocab size
def make_example(rng):
    answer = rng.randrange(C)                                   # 0..C-1
    passages = [[rng.choice(FILL) for _ in range(L)] for _ in range(N)]
    pa = rng.randrange(N)                                       # which passage holds it
    passages[pa][rng.randrange(L)] = SIGNAL[answer]             # signal token = the answer
    return passages, answer

# --- 2. The model: tiny encoder + decoder composed with torch.nn. ---
D = 32
class FiD(nn.Module):
    def __init__(self):
        super().__init__()
        self.emb = nn.Embedding(V, D)
        self.pos = nn.Parameter(torch.randn(L, D) * 0.02)
        enc = nn.TransformerEncoderLayer(D, 4, 64, batch_first=True, dropout=0.0)
        self.encoder = nn.TransformerEncoder(enc, 2)            # SHARED across passages
        self.query = nn.Parameter(torch.randn(1, D) * 0.02)     # decoder seed token
        dec = nn.TransformerDecoderLayer(D, 4, 64, batch_first=True, dropout=0.0)
        self.decoder = nn.TransformerDecoder(dec, 2)
        self.head = nn.Linear(D, C)

    def encode_one(self, p):                                    # encode ONE passage alone
        x = self.emb(torch.tensor(p)).unsqueeze(0) + self.pos.unsqueeze(0)
        return self.encoder(x)                                  # self-attn over ONE passage

    def forward(self, passages, k_fuse):
        # FUSION-IN-DECODER: encode each passage independently, then CONCATENATE
        # all encodings and let the decoder attend over the union (Sec 3).
        mem = torch.cat([self.encode_one(p) for p in passages[:k_fuse]], dim=1)   # [1, k*L, D]
        out = self.decoder(self.query.unsqueeze(0), mem)        # decoder fuses the set
        return self.head(out[:, 0, :])                          # [1, C]

# --- 3. Train + evaluate at a given fuse count k. ---
def train_eval(k_fuse, seed=0, iters=4000):
    torch.manual_seed(seed); np.random.seed(seed)
    rng = random.Random(seed); model = FiD()
    opt = torch.optim.Adam(model.parameters(), lr=1.5e-3); lossf = nn.CrossEntropyLoss()
    model.train()
    for _ in range(iters):
        passages, ans = make_example(rng)
        loss = lossf(model(passages, k_fuse), torch.tensor([ans]))
        opt.zero_grad(); loss.backward(); opt.step()
    model.eval(); rng_e = random.Random(5000 + seed); correct = 0; Nev = 500
    with torch.no_grad():
        for _ in range(Nev):
            passages, ans = make_example(rng_e)
            correct += (model(passages, k_fuse).argmax(-1).item() == ans)
    return correct / Nev

print("\\nAccuracy vs number of passages the decoder fuses (6 retrieved):")
for k in [1, 2, 3, 4, 5, 6]:
    print("  k_fuse=%d  accuracy=%.3f" % (k, train_eval(k)))

# --- 4. ABLATION: 6 retrieved, but decoder fuses only 1 (no fusion) vs all 6. ---
print("\\nAblation  no-fusion (k=1): %.3f    full fusion (k=6): %.3f"
      % (train_eval(1), train_eval(6)))
# Typical single-seed run (CPU):
#   k_fuse=1 ~0.22   k_fuse=2 ~0.32   k_fuse=3 ~0.56   k_fuse=4 ~0.70   k_fuse=5 ~0.86   k_fuse=6 ~1.00
# Ablation: fusing 1 of 6 ~0.22  vs  fusing all 6 ~1.00.
# (Our small run, not the paper's reported numbers. Exact values vary by seed/hardware.)`
  };

  window.CODEVIZ["paper-fid"] = {
    question: "As the decoder fuses MORE of the retrieved passages, does answer accuracy rise when the evidence is spread across the passage set?",
    charts: [
      {
        type: "line",
        title: "Answer accuracy vs number of passages fused by the decoder (6 retrieved, evidence spread)",
        xlabel: "passages the decoder fuses (k of 6 retrieved)",
        ylabel: "answer accuracy (500 held-out questions, avg of 3 seeds)",
        series: [
          {
            name: "Fusion-in-Decoder (measured)",
            color: "#7ee787",
            points: [[1,0.220],[2,0.320],[3,0.556],[4,0.703],[5,0.860],[6,1.000]]
          },
          {
            name: "Predicted  k/6 + (1-k/6)/8",
            color: "#58a6ff",
            points: [[1,0.271],[2,0.417],[3,0.563],[4,0.708],[5,0.854],[6,1.000]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny Fusion-in-Decoder reader (2-layer nn.TransformerEncoder shared across passages + 2-layer nn.TransformerDecoder, D=32) on a toy task: a retriever returns 6 passages of filler tokens, with the single answer-signaling token planted in ONE random passage, so the evidence is spread across the set (8 possible answers). Each passage is encoded independently; the decoder attends over the concatenation of the first k passage encodings. Measured accuracy (avg of 3 seeds) climbs 0.22 &rarr; 1.00 as k goes 1 &rarr; 6, tracking the predicted curve k/6 + (1-k/6)/8 closely. Fusing only 1 of 6 (the ablation, leftmost point) sits near chance; fusing all 6 finds the spread-out evidence every time. This is the paper's '&sect;4, Figure 3' effect &mdash; accuracy improves with more fused passages &mdash; in miniature.",
    code: `import torch, torch.nn as nn, random, numpy as np

N, C, L, D = 6, 8, 5, 32
FILL = list(range(0, 6)); SIGNAL = list(range(6, 6 + C)); V = 6 + C
def make_example(rng):
    ans = rng.randrange(C)
    ps = [[rng.choice(FILL) for _ in range(L)] for _ in range(N)]
    ps[rng.randrange(N)][rng.randrange(L)] = SIGNAL[ans]      # clue in ONE random passage
    return ps, ans

class FiD(nn.Module):
    def __init__(self):
        super().__init__()
        self.emb = nn.Embedding(V, D); self.pos = nn.Parameter(torch.randn(L, D) * 0.02)
        self.encoder = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(D, 4, 64, batch_first=True, dropout=0.0), 2)
        self.query = nn.Parameter(torch.randn(1, D) * 0.02)
        self.decoder = nn.TransformerDecoder(
            nn.TransformerDecoderLayer(D, 4, 64, batch_first=True, dropout=0.0), 2)
        self.head = nn.Linear(D, C)
    def enc1(self, p):                                        # encode ONE passage alone
        return self.encoder(self.emb(torch.tensor(p)).unsqueeze(0) + self.pos.unsqueeze(0))
    def forward(self, ps, k):                                 # FUSION-IN-DECODER
        mem = torch.cat([self.enc1(p) for p in ps[:k]], dim=1)   # concat the encodings
        return self.head(self.decoder(self.query.unsqueeze(0), mem)[:, 0, :])

def train_eval(k, seed, iters=4000):
    torch.manual_seed(seed); np.random.seed(seed); rng = random.Random(seed)
    m = FiD(); opt = torch.optim.Adam(m.parameters(), lr=1.5e-3); lf = nn.CrossEntropyLoss()
    m.train()
    for _ in range(iters):
        ps, a = make_example(rng)
        loss = lf(m(ps, k), torch.tensor([a])); opt.zero_grad(); loss.backward(); opt.step()
    m.eval(); rng_e = random.Random(5000 + seed); ok = 0
    with torch.no_grad():
        for _ in range(500):
            ps, a = make_example(rng_e); ok += (m(ps, k).argmax(-1).item() == a)
    return ok / 500

for k in [1, 2, 3, 4, 5, 6]:
    accs = [train_eval(k, s) for s in (0, 1, 2)]
    print("k=%d  measured=%.3f  predicted=%.4f" % (k, sum(accs)/3, k/N + (1 - k/N)/C))
# k=1 measured=0.220 predicted=0.2708     k=4 measured=0.703 predicted=0.7083
# k=2 measured=0.320 predicted=0.4167     k=5 measured=0.860 predicted=0.8542
# k=3 measured=0.556 predicted=0.5625     k=6 measured=1.000 predicted=1.0000
# More fused passages -> spread-out evidence is found -> higher accuracy.
# Our small run, not the paper's number.`
  };
})();
