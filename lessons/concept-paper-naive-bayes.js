/* Paper lesson — "A Comparison of Event Models for Naive Bayes Text Classification",
   Andrew McCallum & Kamal Nigam, AAAI-98 Workshop on Learning for Text Categorization, 1998.
   No arXiv (classic). Self-contained: lesson + CODE + CODEVIZ merged by id "paper-naive-bayes".
   GROUNDED from the official PDF on kamalnigam.com — every equation (Eqns 2-7) and every quoted
   number read directly from the paper's text. Track A (primitive): build multinomial Naive Bayes
   (log-prior + Laplace-smoothed log-likelihood + argmax) from raw torch tensors, then VERIFY with
   torch.allclose against (a) a hand-computed reference and (b) sklearn's MultinomialNB. The Naive
   Bayes math lives in concept ml-naive-bayes; here we recap + implement the multinomial event model. */
(function () {
  window.LESSONS.push({
    id: "paper-naive-bayes",
    title: "Naive Bayes event models — A Comparison of Event Models for Naive Bayes Text Classification (1998)",
    tagline: "Showed that the two things everyone called \"Naive Bayes\" for text are different generative models, and that the word-count (multinomial) one usually wins.",
    module: "Papers · Classical ML",
    track: "primitive",
    paper: {
      authors: "Andrew McCallum, Kamal Nigam",
      org: "Just Research (Pittsburgh) and Carnegie Mellon University, School of Computer Science",
      year: 1998,
      venue: "AAAI-98 Workshop on Learning for Text Categorization (Technical Report WS-98-05)",
      citations: "",
      url: "http://www.kamalnigam.com/papers/multinomial-aaaiws98.pdf",
      code: ""
    },
    conceptLink: "ml-naive-bayes",
    partOf: [],
    prereqs: ["ml-naive-bayes", "prob-bayes", "fe-bag-of-words", "pt-tensors"],

    // WHY READ IT
    problem:
      `<p>By 1998 "Naive Bayes" was a popular and surprisingly strong text classifier, but the paper opens
       (&sect;Introduction) by pointing out a genuine confusion: <b>two different probabilistic models</b> were
       both being called "Naive Bayes," and people did not always say which one they used.</p>
       <ul>
        <li>The <b>multi-variate Bernoulli</b> model: a document is a vector of <b>yes/no</b> flags &mdash; for
        every word in the vocabulary, did it appear at least once? It records presence and <i>absence</i>, but
        <b>not how many times</b> a word occurs.</li>
        <li>The <b>multinomial</b> model: a document is a <b>bag of word counts</b> &mdash; how many times each
        word occurs. The paper calls this a "uni-gram language model."</li>
       </ul>
       <p>The paper quotes the problem directly: "there has been some confusion in the document classification
       community about the &lsquo;naive Bayes&rsquo; classifier because there are two <i>different</i> generative
       models in common use, both of which &hellip; are called &lsquo;naive Bayes&rsquo;." A "generative model"
       here means a story for how a document is randomly produced; the two stories are not the same, so they give
       different classifiers. (Note: the word "naive" labels the shared assumption that words are independent
       given the class &mdash; "naive" because it is clearly false, yet works well.)</p>`,
    contribution:
      `<ul>
        <li><b>It names and separates the two event models.</b> &sect;Multi-variate Bernoulli Model and
        &sect;Multinomial Model give each its own generative story, likelihood equation, and parameter estimate,
        so you can finally tell them apart instead of lumping them as one "Naive Bayes."</li>
        <li><b>It pins down the multinomial likelihood including document length.</b> Footnote 2: "Many previous
        formalizations of the multinomial model have omitted document length. Including document length is
        necessary because document length specifies the number of draws from the multinomial."</li>
        <li><b>It settles the comparison empirically</b> on five text corpora (Yahoo, Industry Sector,
        Newsgroups, WebKB, Reuters). The headline (Abstract): the multinomial "performs even better at larger
        vocabulary sizes&mdash;providing on average a 27% reduction in error over the multi-variate Bernoulli
        model."</li>
      </ul>`,
    whyItMattered:
      `<p>This is the paper people cite when they say "use multinomial Naive Bayes for text." It is why the
       default text-classification baseline today &mdash; and why scikit-learn's <code>MultinomialNB</code> &mdash;
       is the count-based multinomial model, not the presence/absence Bernoulli one. It also crisply separated
       "did the word appear?" (Bernoulli) from "how often did it appear?" (multinomial), a distinction that
       carries straight into modern bag-of-words and TF-IDF feature pipelines. The multinomial Naive Bayes
       classifier remains a strong, fast baseline that new text models are still measured against.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;Probabilistic Framework of Naive Bayes</b> &mdash; the shared setup: a document is generated
        by first picking a class (the prior), then generating words from that class's parameters. Equation (1) is
        the mixture-over-classes view both models share.</li>
        <li><b>&sect;Multinomial Model</b> &mdash; Eqn (5) (the count likelihood) and Eqn (6) (the Laplace-smoothed
        word-probability estimate, with $|V|$ in the denominator). <b>This is what you implement.</b></li>
        <li><b>&sect;Classification</b> &mdash; Eqn (7), Bayes' rule; the classifier is the $\\arg\\max$ over classes
        of the posterior.</li>
        <li><b>Figures 1&ndash;4</b> &mdash; accuracy vs vocabulary size. Watch the multivariate Bernoulli curve
        rise then <b>fall</b> as the vocabulary grows, while the multinomial stays high.</li>
       </ul>
       <p><b>Skim:</b> &sect;Multi-variate Bernoulli Model (Eqns 2&ndash;3) once for contrast &mdash; you need the
       idea, not its implementation. Skim &sect;Feature Selection (the mutual-information Eqn 8) and the per-corpus
       Reuters breakdowns (Figs 5&ndash;6); the core is the multinomial in &sect;Multinomial Model and
       &sect;Classification, about two pages.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Two documents land in the spam folder. Doc A says "free" once; Doc B says "free free free free free".
       The multivariate Bernoulli model records the <i>same</i> feature for both (the word "free" is present,
       flag = 1). The multinomial model records counts 1 vs 5. Before running anything, predict: as you grow the
       vocabulary to thousands of words (most of them rare), will the count-based <b>multinomial</b> end up with
       <b>higher</b>, <b>equal</b>, or <b>lower</b> accuracy than the presence/absence <b>Bernoulli</b>? Write one
       sentence of reasoning.</p>
       <p>(Hint &mdash; the paper's Abstract: the multivariate Bernoulli "performs well with small vocabulary
       sizes, but &hellip; the multinomial performs even better at larger vocabulary sizes.")</p>`,
    attempt:
      `<p>Before the reveal, sketch the three quantities you will compute from raw count tensors. Fill in the
       <code>TODO</code>s. Let $X$ be the training counts (one row per document, one column per vocabulary word),
       $y$ the class labels, $V$ the vocabulary size, and $\\alpha=1$ the Laplace (add-one) smoothing constant:</p>
       <ul>
        <li><b>Log prior</b> per class $c$: <code>log_prior[c] = log( (# docs in c) / (total docs) )</code>.
        TODO: count documents per class, divide, take <code>torch.log</code>.</li>
        <li><b>Log word-probability</b> $\\log\\hat\\theta_{w_t\\mid c}$ (Eqn 6): for class $c$, sum the word
        counts of its documents into a length-$V$ vector <code>wc</code>; then
        <code>log_theta[c] = log( (alpha + wc) / (alpha*V + wc.sum()) )</code>. TODO: why is the denominator
        $\\alpha V + \\sum_t wc_t$ and not just $\\sum_t wc_t$?</li>
        <li><b>Classify</b> a test count-vector $d$: <code>score[c] = log_prior[c] + (d * log_theta[c]).sum()</code>,
        then <code>pred = argmax_c score[c]</code>. TODO: write this as one matrix product
        <code>log_prior + d @ log_theta.T</code>.</li>
       </ul>
       <p>Then verify: your <code>log_theta</code> and your test scores must match a hand-computed reference with
       <code>torch.allclose</code>, and your normalized log-probabilities must match
       <code>sklearn.naive_bayes.MultinomialNB</code>.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Both event models share one Bayesian setup (&sect;Probabilistic Framework). A document is generated in
       two steps: (1) pick a class $c_j$ with probability $P(c_j)$ (the <b>prior</b>), then (2) generate the
       document's words from that class's parameters. To classify a new document we run Bayes' rule backwards:
       compute, for each class, how probable that class would have made this document, and pick the most probable
       class. The two models differ only in step (2) &mdash; the story for generating words.</p>
       <p><b>Multivariate Bernoulli (the contrast, &sect;Multi-variate Bernoulli Model).</b> A document is a
       binary vector over the whole vocabulary $V$. For each word $w_t$, $B_{it}\\in\\{0,1\\}$ says whether word
       $t$ appears in document $i$ &mdash; <i>at least once</i>; repeats are ignored. The document's probability
       (Eqn 2) multiplies, over <b>every</b> vocabulary word, the chance that word is present or absent:
       a word that is absent still contributes a $(1 - P(w_t\\mid c))$ factor. So this model "explicitly includes
       the non-occurrence probability of words that do not appear in the document" (paper) and "does not capture
       the number of times each word occurs."</p>
       <p><b>Multinomial (what we implement, &sect;Multinomial Model).</b> Here "a document is an ordered sequence
       of word events, drawn from the same vocabulary $V$." Picture drawing $N_i$ words (where $N_i$ is the
       document's length) independently from a single bag, where word $w_t$ has probability
       $\\theta_{w_t\\mid c_j}=P(w_t\\mid c_j)$ and $\\sum_t \\theta_{w_t\\mid c_j}=1$. Let $N_{it}$ be the number
       of times word $w_t$ appears in document $i$. The document's probability is the multinomial distribution
       (Eqn 5). This is the familiar "bag of words": <b>counts matter</b>, position does not.</p>
       <p><b>Estimating the parameters.</b> With labeled training data we just count. For the multinomial word
       probabilities the paper uses the "Laplacean prior, priming each word's count with a count of one to avoid
       probabilities of zero." That is Eqn (6): add 1 to every word's count, and add $|V|$ to the denominator so
       the per-class probabilities still sum to 1. The class prior (Eqn 4) is simply the fraction of training
       documents in each class. (The paper writes everything with soft membership $P(c_j\\mid d_i)$ for the
       general mixture case; with ordinary labeled data $P(c_j\\mid d_i)\\in\\{0,1\\}$, so the sums become plain
       counts &mdash; that is the case we implement.)</p>
       <p><b>Classifying.</b> Eqn (7) is Bayes' rule: the posterior $P(c_j\\mid d_i)$ is proportional to
       prior $\\times$ likelihood. We take logarithms (so the product of many small word-probabilities becomes a
       stable sum) and pick the class with the largest log-prior + log-likelihood. The denominator
       $P(d_i)$ is the same for every class, so it drops out of the $\\arg\\max$.</p>`,
    architecture:
      `<p>This is a <b>generative-classifier</b> paper, not a network of layers, so its "architecture" is a
       two-stage probabilistic pipeline. Both event models share the same skeleton (&sect;Probabilistic Framework);
       they swap out only the document-likelihood block.</p>
       <p><b>Shared mixture skeleton (Eqn 1).</b> A document $d_i$ is generated by a mixture over classes: pick a
       class $c_j$ with prior $P(c_j\\mid\\theta)$, then emit the document with $P(d_i\\mid c_j;\\theta)$. With
       labeled data the class is one-to-one with the mixture component, so the "hidden" component is just the label.</p>
       <p><b>Fit stage (closed-form counting, no gradient descent).</b> Two parameter tables are estimated from the
       training set $D$:</p>
       <ul>
        <li><b>Prior table</b> $\\hat\\theta_{c_j}$, length $|\\mathcal{C}|$ &mdash; Eqn 4, the fraction of training
        documents in each class.</li>
        <li><b>Word-probability table</b> $\\hat\\theta_{w_t\\mid c_j}$, shape $|\\mathcal{C}|\\times|V|$ &mdash; one
        probability per (class, vocabulary word). This is the one block that differs by event model:
        <b>multinomial</b> fills it from word <i>counts</i> $N_{it}$ with denominator $|V|+\\text{total}$ (Eqn 6);
        <b>multivariate Bernoulli</b> fills it from presence flags $B_{it}$ with denominator $2+\\#\\text{docs}$
        (Eqn 3).</li>
       </ul>
       <p><b>Document-likelihood block (the interchangeable part).</b> Given a document, compute
       $P(d_i\\mid c_j)$ for each class &mdash; <b>multinomial</b> by Eqn 5 (product of $\\theta^{N_{it}}$ over the
       words present, times length factors), <b>Bernoulli</b> by Eqn 2 (product over the <i>whole</i> vocabulary of
       a present-or-absent factor, including a $(1-\\theta)$ term for every absent word).</p>
       <p><b>Decision stage (Eqn 7).</b> Combine prior $\\times$ likelihood through Bayes' rule and take
       $\\arg\\max_j$ over classes. In practice this runs in log space: a length-$|\\mathcal{C}|$ score vector
       $\\log\\hat\\theta_{c_j}+(\\text{doc vector})\\cdot\\log\\hat\\theta_{\\cdot\\mid c_j}$, whose largest entry is
       the predicted class; the shared evidence $P(d_i)$ cancels and is never computed.</p>
       <p><b>Feature-selection front-end (&sect;Feature Selection, Eqn 8).</b> To shrink $V$, words are ranked by
       average mutual information $I(C;W_t)$ with the class and the top-$K$ kept; the paper's experiments sweep this
       $K$ along the x-axis of every figure.</p>`,
    symbols: [
      { sym: "$V$", desc: "the <b>vocabulary</b> &mdash; the fixed list of distinct words the model knows. $|V|$ is its size (the number of distinct words)." },
      { sym: "$d_i$", desc: "the $i$-th document. In the multinomial model it is represented as a vector of word counts." },
      { sym: "$c_j$", desc: "the $j$-th class (category), e.g. \"romance\" vs \"action\". The set of all classes is $\\mathcal{C}$, with $|\\mathcal{C}|$ classes." },
      { sym: "$\\theta$", desc: "the full set of model parameters &mdash; all the class priors and per-class word probabilities. A hat ($\\hat\\theta$) denotes the values estimated from training data." },
      { sym: "$D$ (and $|D|$)", desc: "the training set of labeled documents $\\{d_1,\\dots,d_{|D|}\\}$; $|D|$ is the number of training documents." },
      { sym: "$w_t$", desc: "the $t$-th distinct word in the vocabulary $V$ (the dimension index $t$ runs $1\\dots|V|$)." },
      { sym: "$N_{it}$", desc: "the <b>count</b>: how many times word $w_t$ occurs in document $d_i$. The bag-of-words representation is just this matrix of counts." },
      { sym: "$N_i$ (or $|d_i|$)", desc: "the <b>length</b> of document $d_i$ &mdash; its total number of words, $N_i=\\sum_t N_{it}$. It is the number of draws from the multinomial." },
      { sym: "$B_{it}$", desc: "(Bernoulli model only) a 0/1 flag: 1 if word $w_t$ appears at least once in $d_i$, else 0. Ignores how many times the word appears." },
      { sym: "$\\theta_{w_t\\mid c_j}$", desc: "the probability that a single word drawn from class $c_j$ is word $w_t$, i.e. $P(w_t\\mid c_j)$. A hat $\\hat\\theta$ means the estimate computed from data. For each class these sum to 1 over all words." },
      { sym: "$\\theta_{c_j}$", desc: "the class <b>prior</b> $P(c_j)$ &mdash; how common class $c_j$ is before seeing any words." },
      { sym: "$\\alpha$", desc: "the <b>Laplace smoothing</b> constant (the paper uses $\\alpha=1$, \"add-one\"): a pseudo-count added to every word so an unseen word does not force the whole product to zero." },
      { sym: "$P(c_j\\mid d_i)$", desc: "the <b>class membership</b> of training document $d_i$ used inside the estimators (Eqns 3, 4, 6). With ordinary hard labels it is 1 if $d_i$ is in class $c_j$ and 0 otherwise, so the weighted sums collapse to plain counts; the paper keeps it general for the soft/semi-supervised case." },
      { sym: "$P(c_j\\mid d_i;\\hat\\theta)$", desc: "the <b>posterior</b> (Eqn 7): how probable class $c_j$ is given the document, under the fitted parameters. The classifier returns the class with the largest posterior." },
      { sym: "$\\arg\\max$", desc: "\"the argument that maximizes\" &mdash; here, the class index that gives the largest posterior score. It is the prediction." },
      { sym: "$\\propto$", desc: "\"is proportional to\" &mdash; equal up to a constant factor that is the same for every class, so it does not change which class wins." }
    ],
    formula: `$$ \\text{(shared mixture / total probability, Eqn. 1)}\\quad P(d_i\\mid\\theta)=\\sum_{j=1}^{|\\mathcal{C}|}P(c_j\\mid\\theta)\\,P(d_i\\mid c_j;\\theta) $$
$$ \\text{(class prior estimate, Eqn. 4)}\\quad \\hat\\theta_{c_j}=P(c_j\\mid\\hat\\theta)=\\frac{\\sum_{i=1}^{|D|}P(c_j\\mid d_i)}{|D|} $$
$$ \\text{(multinomial likelihood, Eqn. 5)}\\quad P(d_i\\mid c_j;\\theta)=P(|d_i|)\\,|d_i|!\\prod_{t=1}^{|V|}\\frac{P(w_t\\mid c_j;\\theta)^{N_{it}}}{N_{it}!} $$
$$ \\text{(Laplace-smoothed word prob, Eqn. 6)}\\quad \\hat\\theta_{w_t\\mid c_j}=P(w_t\\mid c_j;\\hat\\theta_j)=\\frac{1+\\sum_{i=1}^{|D|}N_{it}\\,P(c_j\\mid d_i)}{|V|+\\sum_{s=1}^{|V|}\\sum_{i=1}^{|D|}N_{is}\\,P(c_j\\mid d_i)} $$
$$ \\text{(classify by Bayes' rule, Eqn. 7)}\\quad P(c_j\\mid d_i;\\hat\\theta)=\\frac{P(c_j\\mid\\hat\\theta)\\,P(d_i\\mid c_j;\\hat\\theta_j)}{P(d_i\\mid\\hat\\theta)} $$
$$ \\text{(multivariate Bernoulli likelihood, for contrast, Eqn. 2)}\\quad P(d_i\\mid c_j;\\theta)=\\prod_{t=1}^{|V|}\\Big(B_{it}\\,P(w_t\\mid c_j;\\theta)+(1-B_{it})(1-P(w_t\\mid c_j;\\theta))\\Big) $$
$$ \\text{(multivariate Bernoulli word prob, for contrast, Eqn. 3)}\\quad \\hat\\theta_{w_t\\mid c_j}=\\frac{1+\\sum_{i=1}^{|D|}B_{it}\\,P(c_j\\mid d_i)}{2+\\sum_{i=1}^{|D|}P(c_j\\mid d_i)} $$`,
    whatItDoes:
      `<p><b>Eqn (5)</b> is the probability the multinomial model assigns to a document of class $c_j$. Read the
       product: each distinct word $w_t$ contributes its class probability raised to the power of how many times
       it appears, $\\theta_{w_t\\mid c_j}^{N_{it}}$ &mdash; so frequent words count more. The front factors
       $P(|d_i|)\\,|d_i|!/\\prod_t N_{it}!$ are the multinomial coefficient and the length distribution; the
       paper keeps document length $|d_i|$ because it "specifies the number of draws." For classification these
       front factors are the <b>same for every class</b>, so they cancel in the $\\arg\\max$ &mdash; which is why
       our code can skip them and just sum $N_{it}\\log\\theta_{w_t\\mid c_j}$.</p>
       <p><b>Eqn (6)</b> estimates each word probability by <i>counting with smoothing</i>. The numerator
       $1+\\sum_i N_{it}$ is "how many times word $t$ appears across this class's documents, plus one." The
       denominator $|V|+\\sum_s\\sum_i N_{is}$ is "the total word count for this class, plus $|V|$." The $+1$ and
       $+|V|$ are Laplace add-one smoothing: without them, a word never seen in a class would get probability 0
       and zero out the entire product (Eqn 5) for any test document containing it. (With ordinary hard labels,
       $P(c_j\\mid d_i)$ is 1 for documents in class $j$ and 0 otherwise, so the sums are plain counts over that
       class's documents.)</p>
       <p><b>Eqn (7)</b> is Bayes' rule: posterior $\\propto$ prior $\\times$ likelihood. We classify by taking
       logs and choosing $\\arg\\max_j[\\,\\log P(c_j) + \\sum_t N_{it}\\log\\hat\\theta_{w_t\\mid c_j}\\,]$. Logs turn
       the long product of tiny probabilities into a numerically safe sum; the denominator $P(d_i)$ is identical
       across classes and drops out.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the full Naive Bayes derivation is in the <code>ml-naive-bayes</code> concept
       lesson.</b> Bayes' rule says $P(c\\mid d)=P(c)\\,P(d\\mid c)/P(d)$. The "naive" assumption is that, given the
       class, the word events are independent, so $P(d\\mid c)$ factors into a product over words. In the
       multinomial story, a document is $N_i$ independent draws from a per-class word distribution, which gives
       the multinomial likelihood (Eqn 5).</p>
       <p><b>Why the smoothing denominator is $\\alpha|V| + \\sum_t (\\text{counts})$.</b> A probability
       distribution over words must sum to 1. If we add a pseudo-count $\\alpha$ to <i>every</i> one of the $|V|$
       words in the numerator, we have added $\\alpha|V|$ total mass, so the denominator must add the same
       $\\alpha|V|$ for the per-word probabilities to still sum to 1:
       $\\sum_t \\hat\\theta_{w_t\\mid c}=\\sum_t \\frac{\\alpha + N_{\\cdot t}}{\\alpha|V| + \\sum_s N_{\\cdot s}}
       =\\frac{\\alpha|V| + \\sum_t N_{\\cdot t}}{\\alpha|V| + \\sum_s N_{\\cdot s}}=1.$
       With $\\alpha=1$ this is exactly Eqn (6). That normalization is the whole reason $|V|$ (not some other
       number) appears in the denominator.</p>
       <p><b>Why logs.</b> Eqn (5) multiplies many probabilities, each well below 1; for a long document the
       product underflows to 0 in floating point. Taking $\\log$ turns the product into a sum
       $\\sum_t N_{it}\\log\\theta_{w_t\\mid c}$, which is stable and preserves the $\\arg\\max$ because $\\log$ is
       monotonic.</p>`,
    example:
      `<p>A tiny worked example you can verify by hand and in the notebook. Vocabulary of $|V|=5$ words, indexed
       <code>0=fun, 1=couple, 2=love, 3=fast, 4=furious</code>. Two classes: <b>class 0 = romance</b>,
       <b>class 1 = action</b>. Four training documents, written as count vectors over the 5 words:</p>
       <ul class="steps">
        <li><code>d0 "fun fun love couple"</code> &rarr; $[2,1,1,0,0]$ &nbsp;(class 0)</li>
        <li><code>d1 "couple love love"</code> &rarr; $[0,1,2,0,0]$ &nbsp;(class 0)</li>
        <li><code>d2 "fast furious furious"</code> &rarr; $[0,0,0,1,2]$ &nbsp;(class 1)</li>
        <li><code>d3 "fast fast fun furious"</code> &rarr; $[1,0,0,2,1]$ &nbsp;(class 1)</li>
       </ul>
       <p><b>Step 1 &mdash; log prior (Eqn 4).</b> 2 of 4 documents in each class, so $P(c_0)=P(c_1)=0.5$ and
       $\\log 0.5 = -0.6931$ for both.</p>
       <p><b>Step 2 &mdash; per-class word totals.</b> Class 0: $d0+d1=[2,2,3,0,0]$, total $=7$. Class 1:
       $d2+d3=[1,0,0,3,3]$, total $=7$. With $\\alpha=1$ and $|V|=5$, each denominator is $5+7=12$.</p>
       <p><b>Step 3 &mdash; smoothed word probs (Eqn 6),</b> $\\hat\\theta=(1+\\text{count})/12$:</p>
       <ul class="steps">
        <li>class 0: $[\\tfrac{3}{12},\\tfrac{3}{12},\\tfrac{4}{12},\\tfrac{1}{12},\\tfrac{1}{12}]
        =[0.25,0.25,0.3333,0.0833,0.0833]$.</li>
        <li>class 1: $[\\tfrac{2}{12},\\tfrac{1}{12},\\tfrac{1}{12},\\tfrac{4}{12},\\tfrac{4}{12}]
        =[0.1667,0.0833,0.0833,0.3333,0.3333]$.</li>
       </ul>
       <p><b>Step 4 &mdash; classify the test document</b> <code>"love love fun"</code> $=[1,0,2,0,0]$
       (one "fun" at index 0, two "love" at index 2). Score $=\\log P(c)+\\sum_t N_t\\log\\hat\\theta_{t\\mid c}$:</p>
       <ul class="steps">
        <li>class 0: $-0.6931 + 1\\cdot\\log 0.25 + 2\\cdot\\log 0.3333 = -0.6931 -1.3863 -2.1972 = \\mathbf{-4.2767}$.</li>
        <li>class 1: $-0.6931 + 1\\cdot\\log 0.1667 + 2\\cdot\\log 0.0833 = -0.6931 -1.7918 -4.9698 = \\mathbf{-7.4547}$.</li>
       </ul>
       <p>$-4.2767 \\gt -7.4547$, so the prediction is <b>class 0 (romance)</b> &mdash; correct, since "love"
       and "fun" are romance words. The notebook recomputes these exact numbers with raw torch tensors and
       asserts they match this hand reference (and match scikit-learn's <code>MultinomialNB</code>).</p>`,
    recipe:
      `<ol>
        <li><b>Build the count matrix.</b> Represent each document as a length-$|V|$ vector of word counts
        $N_{it}$ (bag of words). Stack into $X$ with one row per document.</li>
        <li><b>Log prior (Eqn 4):</b> for each class $c$, <code>log_prior[c] = log( (#docs in c) / (total) )</code>.</li>
        <li><b>Per-class word totals:</b> for each class, sum the count vectors of its documents into a length-$|V|$
        vector <code>wc</code>.</li>
        <li><b>Smoothed log word-probs (Eqn 6):</b>
        <code>log_theta[c] = log( (alpha + wc) / (alpha*|V| + wc.sum()) )</code>, with <code>alpha = 1</code>.</li>
        <li><b>Score a test doc</b> $d$ (count vector): <code>score = log_prior + d @ log_theta.T</code> &mdash;
        the prior plus, for each class, the count-weighted sum of log word-probs.</li>
        <li><b>Predict:</b> <code>pred = score.argmax()</code> (Eqn 7's $\\arg\\max$; the shared $P(d)$ cancels).</li>
        <li><b>Verify (Track A):</b> assert <code>torch.allclose</code> against the hand-computed reference, and
        against <code>sklearn.naive_bayes.MultinomialNB</code>'s <code>predict_log_proba</code> (after normalizing
        your scores with <code>logsumexp</code>).</li>
      </ol>`,
    results:
      `<p>The paper compares the two event models on five corpora across many vocabulary sizes (&sect;Results,
       Figs 1&ndash;6). Its conclusions, quoted:</p>
       <ul>
        <li>Abstract / Conclusions: "the multinomial model is found to be almost uniformly better than the
        multi-variate Bernoulli model. In empirical results &hellip; the multinomial model reduces error by an
        average of 27%, and sometimes by more than 50%."</li>
        <li>Abstract: the multivariate Bernoulli "performs well with small vocabulary sizes, but &hellip; the
        multinomial performs even better at larger vocabulary sizes."</li>
        <li>Reported maxima (&sect;Results): on Yahoo Science the multinomial reaches "a maximum of 54% accuracy
        at a vocabulary size of 1000 words," while the multivariate Bernoulli "reaches a maximum of 41% accuracy
        with only 200 words." On Newsgroups, "Multinomial achieves 85% accuracy and multi-variate Bernoulli
        achieves 74% accuracy."</li>
       </ul>
       <p><i>Those are the paper's reported numbers. The accuracies in the CODE / CODEVIZ below are from our own
       small synthetic-corpus runs &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> Multinomial Naive Bayes is a classifier, so the metric is
       <b>classification accuracy</b> on a held-out test split of a text corpus, swept across vocabulary
       sizes (the paper's Figs 1&ndash;6 on Yahoo, Industry Sector, Newsgroups, WebKB, Reuters). The
       trivial baseline is the <b>majority-class accuracy</b> (always predict the most frequent class): on
       a balanced 2-class toy corpus that is $50\\%$, on the paper's 20-way Newsgroups it is $\\approx 5\\%$.
       A correct build must beat that comfortably. The two cross-checks in the lesson are themselves
       pass/fail metrics: <code>torch.allclose</code> against the hand reference and against scikit-learn's
       <code>MultinomialNB.predict_log_proba</code>.</p>
       <ul>
        <li><b>Sanity checks before the full run.</b> (1) Each class's smoothed word distribution must
        <b>sum to 1</b>: <code>torch.exp(log_theta).sum(1)</code> $\\approx [1,1]$ &mdash; if not, $|V|$ is
        in the wrong place in the denominator (Eqn 6). (2) Reproduce the worked example exactly:
        <code>log_post</code> $=[-4.2767,-7.4547]$ for the test doc <code>"love love fun"</code>, prediction
        class 0. (3) On a tiny separable corpus the model should hit $100\\%$ <b>train</b> accuracy &mdash;
        Naive Bayes is fit by closed-form counting, so there is no optimization to get stuck. (4) Confirm
        your normalized scores match sklearn before trusting any accuracy number.</li>
        <li><b>Expected range.</b> Anchored to the paper's reported maxima (&sect;Results): on Yahoo Science
        the multinomial reaches "a maximum of 54% accuracy at a vocabulary size of 1000 words"; on
        Newsgroups "Multinomial achieves 85% accuracy and multi-variate Bernoulli achieves 74% accuracy"
        (paper's numbers). On a clean synthetic 2-class corpus expect accuracy in the high 90s. <i>Rule of
        thumb (not a paper claim):</i> if accuracy sits near majority-class, the build is broken; if it is
        a few points below sklearn's <code>MultinomialNB</code> on the same split, suspect a smoothing or
        log-space bug, not tuning.</li>
        <li><b>Ablation &mdash; prove the count model earns its keep.</b> The paper's central claim is that
        <b>counts beat presence/absence</b>. Swap the document representation from counts $N_{it}$ to
        Bernoulli presence flags $B_{it}=\\mathbb{1}[N_{it}\\gt 0]$ (Eqns 2&ndash;3) and sweep the vocabulary
        from small to large. The multinomial accuracy should <b>hold up</b> while the Bernoulli accuracy
        <b>drops</b> as the vocabulary grows (the CODEVIZ crossover: $\\approx 0.96$ vs $\\approx 0.85$ on
        our toy run). If both curves stay equal, the count information is not actually being used &mdash;
        you have wired in presence flags, not counts.</li>
        <li><b>Failure signals &amp; what they mean.</b> Accuracy <b>stuck at majority-class</b> &rarr;
        labels shuffled, or every test doc predicted to one class (often the log-prior dominating because
        <code>log_theta</code> is all $-\\infty$). <code>-inf</code> or <code>NaN</code> in
        <code>log_theta</code> &rarr; a zero made it through (smoothing dropped, $\\log 0$). Per-class
        probabilities <b>not summing to 1</b> &rarr; $|V|$ missing from the denominator. <b>Mismatch vs
        sklearn</b> after fixing the above &rarr; you forgot to normalize with
        <code>logsumexp</code> before comparing to <code>predict_log_proba</code> (raw $\\arg\\max$ scores
        are unnormalized). Multinomial <b>no better than Bernoulli</b> at large vocabulary &rarr; counts not
        flowing through; you are scoring presence, not frequency.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track A (primitive)</b> paper: scikit-learn ships multinomial Naive Bayes as one class
       (<code>MultinomialNB</code>), so we <b>build it from scratch with raw torch tensors</b> and then verify our
       version <i>is</i> the library's. <b>Build by hand:</b> the log-prior (Eqn 4), the Laplace-smoothed log
       word-probabilities (Eqn 6) &mdash; the $(\\alpha + \\text{counts})/(\\alpha|V| + \\text{total})$ tensor
       arithmetic &mdash; and the classifier $\\arg\\max_c[\\log\\text{prior} + d\\cdot\\log\\theta]$ (Eqn 7). No
       autograd is needed: Naive Bayes is fit by closed-form counting, not gradient descent. <b>Import only for
       the cross-check:</b> <code>sklearn.naive_bayes.MultinomialNB</code> (to confirm our normalized
       log-probabilities match) &mdash; both scikit-learn and torch are preinstalled in Colab (no pip). The
       payoff is the two <code>torch.allclose</code> checks: our hand-built tensors equal the hand reference and
       equal the library.</p>`,
    pitfalls:
      `<ul>
        <li><b>Putting $|V|$ in the wrong place in smoothing.</b> Add-one smoothing adds $\\alpha$ to <i>every</i>
        word in the numerator, so the denominator must add $\\alpha\\,|V|$ (not $\\alpha$, not the number of
        classes). Use $\\alpha=1$ here. If your per-class probabilities do not sum to 1, this is why.</li>
        <li><b>Confusing the two event models.</b> The multinomial uses <b>counts</b> $N_{it}$ (Eqn 5); the
        multivariate Bernoulli uses 0/1 <b>presence</b> $B_{it}$ and multiplies over the <i>whole</i> vocabulary
        including absent words (Eqn 2). They give different classifiers &mdash; that is the paper's entire point.
        Implement the multinomial.</li>
        <li><b>Multiplying probabilities instead of summing logs.</b> A long document multiplies hundreds of
        numbers below 1, which underflows to 0. Always work in log space: $\\sum_t N_{it}\\log\\theta$.</li>
        <li><b>Forgetting the prior.</b> The score is log-prior <b>plus</b> log-likelihood. With balanced classes
        the prior is a constant and harmless, but with imbalanced classes, dropping it changes predictions.</li>
        <li><b>Comparing raw scores to sklearn's <code>predict_log_proba</code>.</b> Our $\\arg\\max$ uses
        unnormalized scores; to compare to sklearn you must normalize with
        <code>score - torch.logsumexp(score)</code> so both are proper log-probabilities.</li>
      </ul>`,
    recall: [
      "State the multinomial document likelihood (Eqn 5) and say which factors cancel in the argmax.",
      "Write the Laplace-smoothed word-probability estimate (Eqn 6) and explain why $|V|$ is in the denominator.",
      "Define $N_{it}$ and $B_{it}$, and say which event model uses each.",
      "Why classify in log space instead of multiplying probabilities?",
      "Give the one-line classification rule as an argmax over classes (Eqn 7)."
    ],
    practice: [
      {
        q: `<b>The event-model ablation.</b> Take the multinomial Naive Bayes you built and swap only its
            document representation for the multivariate Bernoulli one: replace counts $N_{it}$ with presence
            flags $B_{it}=\\mathbb{1}[N_{it}\\gt 0]$ and score with the Bernoulli likelihood (Eqn 2, which also
            multiplies in a $(1-\\theta)$ factor for every absent word). Train both on the same toy corpus and
            sweep the vocabulary size from small to large. What do you expect, and what does the result
            demonstrate about the paper's claim?`,
        steps: [
          { do: `Fit the multinomial (Eqns 4-6) and the Bernoulli (Eqns 3-4, score by Eqn 2) on the identical training split.`, why: `Holding data and split fixed isolates the <i>event model</i> as the only variable.` },
          { do: `Sweep vocabulary by keeping the top-K most frequent words, K small to large; record test accuracy for each model.`, why: `The paper's Figs 1-3 vary vocabulary size on the x-axis; the divergence appears as the vocabulary grows.` },
          { do: `Observe the two are close at small K, but the Bernoulli accuracy drops as K grows while the multinomial stays high.`, why: `Adding many rare words gives the Bernoulli model many noisy presence/absence factors and it cannot use word frequency; the multinomial's counts stay informative.` }
        ],
        answer: `<p>At a <b>small</b> vocabulary the two event models are about equal (sometimes Bernoulli is even
                 slightly ahead). As the vocabulary <b>grows</b>, the multivariate Bernoulli accuracy falls off
                 while the <b>multinomial stays high</b> &mdash; exactly the paper's finding (Abstract: Bernoulli
                 "performs well with small vocabulary sizes, but &hellip; the multinomial performs even better at
                 larger vocabulary sizes," for a 27% average error reduction). The CODEVIZ panel shows this
                 crossover on our toy corpus. The reason: the multinomial uses word <b>frequency</b>, which stays
                 informative; the Bernoulli only sees presence/absence and is swamped by the many rare words.</p>`
      },
      {
        q: `Why does Laplace (add-one) smoothing have $|V|$ in the denominator of Eqn (6), rather than $+1$ or
            $+|\\mathcal{C}|$ (the number of classes)? Show that without $|V|$ the per-class word probabilities
            would not sum to 1.`,
        steps: [
          { do: `Write the unsmoothed estimate $\\hat\\theta_{w_t\\mid c}=N_{\\cdot t}/\\sum_s N_{\\cdot s}$ and confirm $\\sum_t\\hat\\theta=1$.`, why: `A word distribution must sum to 1 over the vocabulary.` },
          { do: `Add $\\alpha$ to each of the $|V|$ numerators; the total added mass is $\\alpha|V|$.`, why: `Smoothing every word adds $\\alpha$ exactly $|V|$ times.` },
          { do: `To keep the sum at 1, add the same $\\alpha|V|$ to the denominator: $\\hat\\theta=(\\alpha+N_{\\cdot t})/(\\alpha|V|+\\sum_s N_{\\cdot s})$.`, why: `Numerator and denominator must add the same total mass for normalization to hold.` }
        ],
        answer: `<p>Summing Eqn (6) over all words: $\\sum_{t}\\frac{\\alpha+N_{\\cdot t}}{\\alpha|V|+\\sum_s N_{\\cdot s}}
                 =\\frac{\\alpha|V|+\\sum_t N_{\\cdot t}}{\\alpha|V|+\\sum_s N_{\\cdot s}}=1$. Because we added the
                 pseudo-count $\\alpha$ to each of the $|V|$ words, we injected $\\alpha|V|$ of extra mass into the
                 numerators, so the denominator must absorb exactly $\\alpha|V|$ for the distribution to stay
                 normalized. Using $+1$ or $+|\\mathcal{C}|$ instead would make the per-class probabilities not
                 sum to 1. With $\\alpha=1$ this is the paper's Eqn (6).</p>`
      },
      {
        q: `Using the worked-example parameters (class 0 word probs $[0.25,0.25,0.3333,0.0833,0.0833]$, class 1
            $[0.1667,0.0833,0.0833,0.3333,0.3333]$, equal priors $0.5$), classify the test document
            <code>"fast furious"</code> $=[0,0,0,1,1]$ by hand. Give the log-score for each class and the
            prediction.`,
        steps: [
          { do: `class 0 score $=\\log 0.5 + 1\\cdot\\log 0.0833 + 1\\cdot\\log 0.0833 = -0.6931 -2.4849 -2.4849 = -5.6629$.`, why: `"fast" is index 3 and "furious" is index 4; both have prob 0.0833 in class 0.` },
          { do: `class 1 score $=\\log 0.5 + 1\\cdot\\log 0.3333 + 1\\cdot\\log 0.3333 = -0.6931 -1.0986 -1.0986 = -2.8903$.`, why: `Both words have prob 0.3333 in class 1 (action).` },
          { do: `Compare: $-2.8903 \\gt -5.6629$, so predict class 1.`, why: `The larger (less negative) log-score wins the argmax (Eqn 7).` }
        ],
        answer: `<p>class 0 score $=-5.6629$, class 1 score $=-2.8903$. Since $-2.8903 \\gt -5.6629$, the model
                 predicts <b>class 1 (action)</b> &mdash; correct, because "fast" and "furious" are both high-
                 probability action words. This is the same $\\arg\\max$ rule (Eqn 7) the notebook computes; the
                 shared $P(d)$ denominator cancels, so we only need prior $\\times$ likelihood in log space.</p>`
      }
    ]
  });

  window.CODE["paper-naive-bayes"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track A: we <b>build multinomial Naive Bayes from raw torch tensors</b> &mdash; the log-prior (Eqn 4),
       the Laplace-smoothed log word-probabilities (Eqn 6), and the classifier
       $\\arg\\max_c[\\log\\text{prior} + d\\cdot\\log\\theta]$ (Eqn 7) &mdash; no autograd, no <code>nn</code>
       layers, just counting and a matrix product. Cell 1 fits the toy 5-word, 2-class corpus from the worked
       example and prints <code>log_theta</code> and the test scores. Cell 2 <b>verifies</b> two ways:
       <code>torch.allclose</code> against the hand-computed reference numbers, and against scikit-learn's
       <code>MultinomialNB.predict_log_proba</code> (after normalizing our scores with <code>logsumexp</code>).
       Both scikit-learn and torch are preinstalled in Colab (no pip). Paste and run.</p>`,
    code: `import torch, math
torch.set_printoptions(precision=6)

# --- 0. Toy corpus from the worked example. Vocab |V|=5: 0=fun 1=couple 2=love 3=fast 4=furious ---
# class 0 = romance, class 1 = action. Each row is a document's word-count vector N_it (bag of words).
X = torch.tensor([[2.,1,1,0,0],   # d0 "fun fun love couple"   -> class 0
                  [0.,1,2,0,0],   # d1 "couple love love"      -> class 0
                  [0.,0,0,1,2],   # d2 "fast furious furious"  -> class 1
                  [1.,0,0,2,1]])  # d3 "fast fast fun furious" -> class 1
y = torch.tensor([0, 0, 1, 1])
V = X.shape[1]; C = 2; alpha = 1.0           # |V|=5, 2 classes, Laplace add-one

# --- 1. Fit: log-prior (Eqn 4), Laplace-smoothed log word-probs (Eqn 6). Pure counting. ---
counts_c  = torch.tensor([(y == c).sum() for c in range(C)], dtype=torch.float)
log_prior = torch.log(counts_c / counts_c.sum())                       # Eqn 4 (hard labels)

word_counts = torch.stack([X[y == c].sum(0) for c in range(C)])        # [C, V] per-class word totals
num   = alpha + word_counts                                            # 1 + count   (numerator)
denom = alpha * V + word_counts.sum(1, keepdim=True)                   # |V| + total (denominator)
log_theta = torch.log(num / denom)                                     # Eqn 6: log P(w_t | c)

print("log_prior     :", [round(v, 4) for v in log_prior.tolist()])
print("log_theta c0  :", [round(v, 4) for v in log_theta[0].tolist()])
print("log_theta c1  :", [round(v, 4) for v in log_theta[1].tolist()])

# --- 2. Classify (Eqn 7 argmax): score = log_prior + N . log_theta, then take the largest. ---
test = torch.tensor([[1., 0, 2, 0, 0]])      # "love love fun" = 1x fun(0) + 2x love(2)  -> expect class 0
log_post = log_prior + test @ log_theta.T    # [1, C]; the shared P(d) cancels in the argmax
pred = log_post.argmax(1)
print("log_post      :", [round(v, 4) for v in log_post[0].tolist()])
print("prediction    :", pred.item(), "(0 = romance, expected 0)")

# --- 3. VERIFY against an independent hand-computed reference (the worked example). ---
# class 0 totals d0+d1=[2,2,3,0,0] sum 7 -> denom 5+7=12 ;  class 1 totals d2+d3=[1,0,0,3,3] sum 7 -> 12
ref_theta = torch.tensor([[(1+w)/12 for w in [2,2,3,0,0]],
                          [(1+w)/12 for w in [1,0,0,3,3]]])
ref_logpost = torch.tensor([[math.log(0.5) + 1*math.log(ref_theta[0,0]) + 2*math.log(ref_theta[0,2]),
                             math.log(0.5) + 1*math.log(ref_theta[1,0]) + 2*math.log(ref_theta[1,2])]])
assert torch.allclose(log_theta, ref_theta.log(), atol=1e-6), "log_theta != hand reference"
assert torch.allclose(log_post,  ref_logpost,     atol=1e-6), "log_post  != hand reference"
assert pred.item() == 0
print("allclose vs HAND reference :", True)

# --- 4. VERIFY our tensors ARE scikit-learn's MultinomialNB (normalize with logsumexp first). ---
from sklearn.naive_bayes import MultinomialNB
sk = MultinomialNB(alpha=1.0).fit(X.numpy(), y.numpy())
sk_logproba = torch.tensor(sk.predict_log_proba(test.numpy()), dtype=torch.float)
my_logproba = (log_post - torch.logsumexp(log_post, 1, keepdim=True)).float()
print("sklearn log-proba          :", [round(v, 6) for v in sk_logproba[0].tolist()])
print("ours    log-proba          :", [round(v, 6) for v in my_logproba[0].tolist()])
print("allclose vs sklearn        :", torch.allclose(my_logproba, sk_logproba, atol=1e-5))

# Our small run -> log_theta c0 [-1.3863,-1.3863,-1.0986,-2.4849,-2.4849];
#   log_post [-4.2767,-7.4547]; prediction 0; both allclose checks True.
# These are OUR numbers on a 4-document toy corpus, not the paper's reported accuracies.`
  };

  window.CODEVIZ["paper-naive-bayes"] = {
    question: "On a toy text corpus, how do the multinomial and multivariate Bernoulli Naive Bayes event models compare as the vocabulary grows?",
    charts: [
      {
        type: "line",
        title: "Test accuracy vs vocabulary size — multinomial (counts) vs multivariate Bernoulli (presence)",
        xlabel: "vocabulary size (top-K most frequent words, log scale)",
        ylabel: "test accuracy",
        series: [
          {
            name: "Multinomial (counts)",
            color: "#7ee787",
            points: [[10,0.9917],[20,0.9917],[40,0.975],[80,0.975],[160,0.9583],[320,0.9583]]
          },
          {
            name: "Multivariate Bernoulli (presence)",
            color: "#ff7b72",
            points: [[10,0.9917],[20,0.9833],[40,0.975],[80,0.9667],[160,0.9417],[320,0.85]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's numbers (the paper reports a 27% average error reduction for the multinomial across five real corpora). Two synthetic 2-class topic corpora, 240 documents of length 40 over a 400-word vocabulary; we sweep vocabulary by keeping the top-K most frequent words and train both event models from scratch on the same 50/50 split. At a small vocabulary the two are equal (~0.99); as the vocabulary grows, the multivariate Bernoulli falls to ~0.85 while the multinomial stays at ~0.96 &mdash; exactly the paper's qualitative finding that the count-based multinomial holds up better at larger vocabulary sizes because it uses word frequency, not just presence/absence.",
    code: `import numpy as np
# Reproduce the paper's qualitative trend (Figs 1-3): multinomial holds up as the
# vocabulary grows; multivariate Bernoulli (presence/absence only) falls off.
def make_corpus(n_per_class=120, doc_len=40, vocab=400, seed=0):
    rng = np.random.default_rng(seed)
    p0 = np.ones(vocab); p1 = np.ones(vocab)
    p0[:5] += 12; p0[5:10] += 1            # class 0 favors words 0-4
    p1[5:10] += 12; p1[:5] += 1            # class 1 favors words 5-9 (rest is shared noise)
    p0 /= p0.sum(); p1 /= p1.sum()
    X, y = [], []
    for c, p in [(0, p0), (1, p1)]:
        for _ in range(n_per_class):
            X.append(np.bincount(rng.choice(vocab, doc_len, p=p), minlength=vocab)); y.append(c)
    return np.array(X, float), np.array(y)

def split(X, y, frac=0.5, seed=1):
    r = np.random.default_rng(seed); idx = r.permutation(len(y)); k = int(len(y)*frac)
    return X[idx[:k]], y[idx[:k]], X[idx[k:]], y[idx[k:]]

def multinomial(Xtr, ytr, Xte, V, a=1.0):     # Eqns 4-6, classify by argmax of log-score
    wc = np.stack([Xtr[ytr==c].sum(0) for c in range(2)])
    lt = np.log((a+wc)/(a*V + wc.sum(1, keepdims=True)))
    lp = np.log([(ytr==c).mean() for c in range(2)])
    return (lp + Xte @ lt.T).argmax(1)

def bernoulli(Xtr, ytr, Xte, V, a=1.0):        # Eqns 2-3: presence/absence only
    B = (Xtr>0).astype(float)
    th = np.stack([(a + B[ytr==c].sum(0))/(2*a + (ytr==c).sum()) for c in range(2)])
    lp = np.log([(ytr==c).mean() for c in range(2)]); Bte = (Xte>0).astype(float)
    sc = np.stack([lp[c] + (Bte*np.log(th[c]) + (1-Bte)*np.log(1-th[c])).sum(1) for c in range(2)], 1)
    return sc.argmax(1)

X, y = make_corpus(seed=0); Xtr, ytr, Xte, yte = split(X, y)
order = np.argsort(-X.sum(0))                  # rank words by frequency
for K in [10, 20, 40, 80, 160, 320]:
    keep = order[:K]; xtr, xte = Xtr[:, keep], Xte[:, keep]
    mn = (multinomial(xtr, ytr, xte, K) == yte).mean()
    bn = (bernoulli(xtr, ytr, xte, K) == yte).mean()
    print(f"V={K:4d}  multinomial={mn:.4f}  bernoulli={bn:.4f}")
# Our small run ->
# V=  10  multinomial=0.9917  bernoulli=0.9917
# V=  20  multinomial=0.9917  bernoulli=0.9833
# V=  40  multinomial=0.9750  bernoulli=0.9750
# V=  80  multinomial=0.9750  bernoulli=0.9667
# V= 160  multinomial=0.9583  bernoulli=0.9417
# V= 320  multinomial=0.9583  bernoulli=0.8500`
  };
})();
