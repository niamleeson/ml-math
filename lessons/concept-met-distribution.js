/* Metrics & Evaluation — measuring the distance between two distributions (and information).
   BEGINNER lesson. Self-contained: lesson + CODE + CODEVIZ merged by id "met-distribution". */
(function () {
  window.LESSONS.push({
    id: "met-distribution",
    title: "Distance between two distributions (and information)",
    tagline: "How different are these two histograms? Many ways to put one number on it.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["prob-normal", "prob-estimation", "dl-cross-entropy", "mod-contrastive"],

    bigIdea:
      `<p>You have <b>two distributions</b> — two histograms, two bags of numbers. Maybe last month's
       traffic vs this month's. Maybe real images vs ones your model dreamed up. The whole question of
       this lesson is one sentence: <b>"how different are these two histograms?"</b></p>
       <p>A <b>distribution</b> is just how often each value shows up — the shape of a histogram once you
       turn the bar heights into fractions that add up to 1. Compare two of them and you get a single
       number: 0 means identical, bigger means more different.</p>
       <p>There are two big families of such numbers. <b>Information-theory</b> quantities (entropy,
       cross-entropy, KL divergence, mutual information, perplexity) measure surprise and shared
       information — they grew up around coding and language models. <b>Distribution distances</b>
       (total variation, Hellinger, Wasserstein, energy distance, MMD) measure raw geometric distance
       between the two shapes — they power drift detection, generative-model scoring, and contrastive
       losses. We define <b>every one</b> below.</p>`,

    buildup:
      `<p>The atom of information theory is <b>surprise</b>. A rare event surprises you more than a common
       one. If an event has probability $p$, its surprise is $-\\log p$ — small $p$ gives big surprise.
       Average surprise over a whole distribution is its <b>entropy</b>.</p>
       <p>Compare two distributions and you ask: "if I expected $Q$ but reality is $P$, how many extra
       bits of surprise do I pay?" That extra cost is <b>KL (Kullback–Leibler) divergence</b>. Almost
       everything else is built from entropy and KL, or is a geometric cousin that fixes one of KL's
       weaknesses.</p>
       <p>One vocabulary note. We write distributions as lists of probabilities over the same bins:
       $P=[p_1,p_2,\\dots]$ and $Q=[q_1,q_2,\\dots]$, each list summing to 1. "Bin $i$" is one bucket of
       the histogram; $p_i$ is the fraction of $P$'s mass in it.</p>`,

    symbols: [
      { sym: "$P,\\ Q$", desc: "the two distributions we compare. Each is a list of probabilities over the same bins (or two probability densities), each summing to 1." },
      { sym: "$p_i,\\ q_i$", desc: "the probability that $P$ (resp. $Q$) puts in bin $i$ — the height of that histogram bar after normalizing." },
      { sym: "$\\log$", desc: "logarithm. Base 2 measures information in <b>bits</b>; natural log (base $e$) in <b>nats</b>. Pick one and stay consistent." },
      { sym: "$H(P)$", desc: "entropy of $P$: the average surprise (uncertainty) of a single draw from $P$." },
      { sym: "$H(P,Q)$", desc: "cross-entropy: average surprise when reality is $P$ but you priced events using $Q$." },
      { sym: "$D_{\\mathrm{KL}}(P\\,\\|\\,Q)$", desc: "KL (Kullback–Leibler) divergence: the extra bits cross-entropy costs over entropy — how much $Q$ misses $P$." },
      { sym: "$I(X;Y)$", desc: "mutual information: how many bits knowing $X$ tells you about $Y$ (their shared information)." },
      { sym: "$x,\\ y$", desc: "individual values or events drawn from the distributions (e.g. a feature value, a word, a class label)." },
      { sym: "$\\mathbb{E}$", desc: "expectation — a probability-weighted average over all outcomes." }
    ],

    formula:
      `$$ H(P)=-\\sum_i p_i\\log p_i, \\qquad H(P,Q)=-\\sum_i p_i\\log q_i, \\qquad D_{\\mathrm{KL}}(P\\,\\|\\,Q)=\\sum_i p_i\\log\\frac{p_i}{q_i} $$`,

    whatItDoes:
      `<p><b>Entropy</b> $H(P)$ sums each outcome's surprise $-\\log p_i$, weighted by how often it
       happens ($p_i$). A fair coin has entropy 1 bit; a two-headed coin has entropy 0 (no surprise ever).</p>
       <p><b>Cross-entropy</b> $H(P,Q)$ is the same average surprise, but you score each event with the
       <i>wrong</i> probabilities $q_i$ instead of the true $p_i$. It is exactly the loss you minimize
       when training a classifier (see <code>dl-cross-entropy</code>).</p>
       <p><b>KL divergence</b> is the gap between them: $D_{\\mathrm{KL}}(P\\,\\|\\,Q)=H(P,Q)-H(P)$. It is
       the price, in extra bits, of believing $Q$ when the truth is $P$. It is $0$ only when $P=Q$, and
       always $\\ge 0$. Below we define the whole family that branches off these three.</p>`,

    derivation:
      `<p><b>Why KL is "extra bits", gently.</b></p>
       <ul class="steps">
         <li>Optimal codes give a symbol of probability $p$ a length of $-\\log p$ bits (rare = long code, common = short). The best you can do on $P$ averages to $H(P)$ bits — that is the entropy.</li>
         <li>If you instead built your code for $Q$, you spend $-\\log q_i$ bits on bin $i$, and your average cost is the cross-entropy $H(P,Q)=-\\sum_i p_i\\log q_i$.</li>
         <li>The waste is the difference: $H(P,Q)-H(P)=-\\sum_i p_i\\log q_i+\\sum_i p_i\\log p_i=\\sum_i p_i\\log\\frac{p_i}{q_i}=D_{\\mathrm{KL}}(P\\,\\|\\,Q)$.</li>
         <li>Because the right code is always at least as good as a wrong one, this waste can never be negative — KL $\\ge 0$, with equality exactly when $Q=P$. That is why KL works as a "difference" even though it is not a true distance. $\\blacksquare$</li>
       </ul>
       <p><b>The full glossary</b> (define each — this is the heart of the lesson):</p>
       <ul>
         <li><b>Entropy</b> $H(P)=-\\sum_i p_i\\log p_i$ — average surprise / uncertainty of one draw from $P$.</li>
         <li><b>Cross-entropy</b> $H(P,Q)=-\\sum_i p_i\\log q_i$ — average surprise when truth is $P$ but you price with $Q$. Equals $H(P)+D_{\\mathrm{KL}}(P\\,\\|\\,Q)$.</li>
         <li><b>Conditional entropy</b> $H(Y\\mid X)=-\\sum_{x,y}p(x,y)\\log p(y\\mid x)$ — leftover uncertainty in $Y$ once you already know $X$. If $X$ tells you everything, it is $0$.</li>
         <li><b>Joint entropy</b> $H(X,Y)=-\\sum_{x,y}p(x,y)\\log p(x,y)$ — total uncertainty of the pair $(X,Y)$ together. It satisfies $H(X,Y)=H(X)+H(Y\\mid X)$.</li>
         <li><b>KL (Kullback–Leibler) divergence</b> $D_{\\mathrm{KL}}(P\\,\\|\\,Q)=\\sum_i p_i\\log\\frac{p_i}{q_i}$ — extra bits from using $Q$ for $P$. <b>Asymmetric:</b> $D_{\\mathrm{KL}}(P\\,\\|\\,Q)\\ne D_{\\mathrm{KL}}(Q\\,\\|\\,P)$ in general.</li>
         <li><b>JS (Jensen–Shannon) divergence</b> $\\mathrm{JS}(P,Q)=\\tfrac12 D_{\\mathrm{KL}}(P\\,\\|\\,M)+\\tfrac12 D_{\\mathrm{KL}}(Q\\,\\|\\,M)$ with the midpoint $M=\\tfrac12(P+Q)$ — a <b>symmetric, always-finite</b> repair of KL, bounded between 0 and 1 bit. Its square root is a true metric.</li>
         <li><b>Mutual information</b> $I(X;Y)=\\sum_{x,y}p(x,y)\\log\\frac{p(x,y)}{p(x)p(y)}=H(X)-H(X\\mid Y)$ — bits of shared information; it is the KL divergence between the joint $p(x,y)$ and the "if they were independent" product $p(x)p(y)$. Zero iff $X,Y$ are independent.</li>
         <li><b>Pointwise mutual information (PMI)</b> $\\mathrm{PMI}(x,y)=\\log\\frac{p(x,y)}{p(x)p(y)}$ — the <i>per-pair</i> version: how much more (or less) often this specific $x$ and $y$ co-occur than chance. Averaging PMI over all pairs gives $I(X;Y)$. Heavily used in NLP word association.</li>
         <li><b>Perplexity</b> $\\mathrm{PPL}=2^{H(P,Q)}$ (or $e^{H}$ in nats) — cross-entropy turned into an "effective number of equally-likely choices". A language model with perplexity 20 is as confused as if it picked uniformly among 20 words each step. Lower is better.</li>
         <li><b>Bits-per-dimension (bpd)</b> — for image/density models, the cross-entropy (negative log-likelihood) in bits divided by the number of pixels$\\times$channels. It normalizes "how surprised is the model" so a $32\\times32$ and a $64\\times64$ model are comparable. Lower is better.</li>
       </ul>
       <p><b>Distribution distances</b> (geometry, not coding):</p>
       <ul>
         <li><b>Total variation (TV) distance</b> $\\mathrm{TV}(P,Q)=\\tfrac12\\sum_i|p_i-q_i|$ — half the total bar-height mismatch. The largest gap in probability the two can disagree on for any event. Always in $[0,1]$.</li>
         <li><b>Hellinger distance</b> $H_e(P,Q)=\\tfrac{1}{\\sqrt2}\\sqrt{\\sum_i(\\sqrt{p_i}-\\sqrt{q_i})^2}$ — Euclidean distance between the <i>square-rooted</i> histograms. A bounded ($[0,1]$) symmetric true metric, gentler than KL.</li>
         <li><b>Wasserstein (earth-mover) distance</b> $W_1(P,Q)=\\inf_{\\gamma}\\mathbb{E}_{(x,y)\\sim\\gamma}|x-y|$ — the least "work" to shovel one histogram's dirt into the other's shape (mass $\\times$ distance moved). A true metric that <b>still works when the two histograms don't overlap</b>, because it cares how far the mass is, not just whether bins match.</li>
         <li><b>Energy distance</b> $D_E(P,Q)=2\\,\\mathbb{E}|X-Y|-\\mathbb{E}|X-X'|-\\mathbb{E}|Y-Y'|$ (with independent copies $X,X'\\sim P$, $Y,Y'\\sim Q$) — a sample-based distance: average cross-pair distance minus the two within-group distances. Zero iff $P=Q$.</li>
         <li><b>Maximum Mean Discrepancy (MMD)</b> $\\mathrm{MMD}^2(P,Q)=\\mathbb{E}\\,k(X,X')+\\mathbb{E}\\,k(Y,Y')-2\\,\\mathbb{E}\\,k(X,Y)$ for a kernel $k$ (e.g. a Gaussian/RBF bump) — compare the two clouds through a similarity kernel; the gap is 0 iff the distributions match. It is the workhorse <b>kernel two-sample test</b> and energy distance is a special case of it.</li>
       </ul>`,

    example:
      `<p>Take two tiny 3-bin distributions: $P=[0.5,\\,0.3,\\,0.2]$ and $Q=[0.2,\\,0.3,\\,0.5]$ (mass
       moved from bin 1 to bin 3). Use base-2 logs, so answers are in bits.</p>
       <ul class="steps">
         <li><b>Entropy of $P$:</b> $H(P)=-(0.5\\log_2 0.5+0.3\\log_2 0.3+0.2\\log_2 0.2)=-(0.5(-1)+0.3(-1.737)+0.2(-2.322))=1.485$ bits.</li>
         <li><b>Total variation:</b> $\\mathrm{TV}=\\tfrac12(|0.5-0.2|+|0.3-0.3|+|0.2-0.5|)=\\tfrac12(0.3+0+0.3)=0.30$. The two disagree by at most 30 percentage points on any event.</li>
         <li><b>KL, both directions:</b> $D_{\\mathrm{KL}}(P\\,\\|\\,Q)=0.5\\log_2\\frac{0.5}{0.2}+0.3\\log_2\\frac{0.3}{0.3}+0.2\\log_2\\frac{0.2}{0.5}=0.5(1.322)+0+0.2(-1.322)=0.397$ bits. Swap them and you get the same $0.397$ here (because $P$ and $Q$ are mirror images) — but in general the two directions differ. That asymmetry is KL's signature.</li>
         <li><b>Hellinger:</b> $\\sqrt{p_i}=[0.707,0.548,0.447]$, $\\sqrt{q_i}=[0.447,0.548,0.707]$. Differences squared: $0.0676+0+0.0676=0.135$. So $H_e=\\tfrac{1}{\\sqrt2}\\sqrt{0.135}=0.260$ — bounded and symmetric, smaller and tamer than KL.</li>
       </ul>
       <p>Four different numbers (TV $0.30$, KL $0.40$, Hellinger $0.26$) for one shift — <b>different
       scales, same verdict</b>: these histograms are clearly different.</p>`,

    whenToUse:
      `<p><b>The choice is mostly about three things: is it symmetric, is it bounded, and do the two
       distributions overlap?</b></p>
       <ul>
         <li><b>KL divergence</b> — use when you have a clear <i>reference</i> $Q$ and a candidate $P$, and they overlap (every bin $Q$ assigns near-zero, $P$ must too). It is the native loss of classification and variational inference. Avoid it when the supports might be disjoint — it blows up to infinity.</li>
         <li><b>JS divergence</b> — use when you want a <b>symmetric, always-finite, bounded</b> comparison and don't care which is the reference: comparing two models, two corpora, or as a smoother drift score. Its square root is a genuine metric.</li>
         <li><b>Wasserstein (earth-mover)</b> — use when the distributions can have <b>disjoint or barely-overlapping support</b> (e.g. real vs generated images early in training), or when you want a true metric whose value scales with the data's units. It is the basis of the WGAN (Wasserstein Generative Adversarial Network) and the FID-style scoring of generators.</li>
         <li><b>MMD</b> — use as a <b>kernel two-sample test</b>: "did these two samples come from the same distribution?" — great in high dimensions and with no binning. It powers many drift detectors and some contrastive / generative losses.</li>
         <li><b>Mutual information (and PMI)</b> — use to measure <b>dependence</b>, not distance: feature selection, disentanglement, word-association mining, and the InfoNCE contrastive objective (see <code>mod-contrastive</code>), which is a lower bound on MI.</li>
         <li><b>Total variation / Hellinger</b> — use when you want a simple, bounded, symmetric number for theory or robust statistics; Hellinger behaves more smoothly than TV.</li>
         <li><b>Perplexity / bits-per-dimension</b> — use to report a generative model's quality on its own terms: perplexity for language, bits-per-dimension for images/audio.</li>
       </ul>`,

    application:
      `<p>These metrics quietly run three of the biggest jobs in applied ML.</p>
       <ul>
         <li><b>Drift detection &amp; monitoring.</b> Compare today's feature histogram to the training one with KL, JS, Wasserstein, or an MMD two-sample test; an alert fires when the distance crosses a threshold (the cousin metric PSI, Population Stability Index, is essentially a symmetrized KL).</li>
         <li><b>Generative-model evaluation.</b> Language models report <b>perplexity</b>; image/audio models report <b>bits-per-dimension</b> and Wasserstein/MMD-based scores (FID, KID) to measure how close generated samples are to real ones.</li>
         <li><b>Contrastive &amp; representation learning.</b> InfoNCE maximizes a mutual-information bound; many self-supervised and domain-adaptation losses are literally MMD or an adversarial Wasserstein/JS estimate (see <code>mod-contrastive</code>).</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>KL is undefined when the reference has a zero where the other doesn't.</b> If $q_i=0$ but $p_i\\gt 0$, then $p_i\\log(p_i/q_i)$ is $+\\infty$. The fix: add a tiny smoothing constant (Laplace / additive smoothing) to every bin, or prefer JS / Wasserstein, which stay finite.</li>
         <li><b>KL is asymmetric — and the two directions mean different things.</b> $D_{\\mathrm{KL}}(P\\,\\|\\,Q)$ ("forward") punishes $Q$ for missing $P$'s mass and is mode-covering; $D_{\\mathrm{KL}}(Q\\,\\|\\,P)$ ("reverse") is mode-seeking. Always state which way round you computed it; never average them and call it KL (that is closer to JS).</li>
         <li><b>Small samples give biased, noisy estimates.</b> Entropy, KL, and MI are all <i>underestimated</i> with few samples, and MMD/energy have variance that shrinks slowly. Use enough data, a bias-corrected estimator, or a permutation test for significance — don't trust a divergence from 30 points.</li>
         <li><b>Binning sensitivity.</b> For continuous data you must bin to get $p_i,q_i$, and the answer changes with bin count and edges. Too few bins hides the shift; too many makes every bin sparse and inflates KL. Prefer binning-free metrics (Wasserstein, energy, MMD) or fix bin edges from a reference window.</li>
         <li><b>Scales are not comparable across metrics.</b> KL is in bits and unbounded; JS/Hellinger/TV sit in $[0,1]$; Wasserstein and energy carry the data's physical units. Never compare a KL of 1.2 to a Hellinger of 0.6 as if "bigger = more drift" across metrics — only compare a metric to its own history/threshold.</li>
         <li><b>A distance of 0 needs the right metric.</b> Two very different distributions can share the same mean and variance; only a proper distance (Wasserstein, MMD with a characteristic kernel, energy) is guaranteed to be 0 <i>only</i> when the full distributions match.</li>
       </ul>`,

    practice: [
      {
        q: `A monitoring job computes $D_{\\mathrm{KL}}(P_{\\text{today}}\\,\\|\\,Q_{\\text{train}})$ on a categorical feature and suddenly returns <code>inf</code>. The feature looks fine. What happened and how do you fix it without throwing away the metric?`,
        steps: [
          { do: `Look for a category that appears today but had zero count in the training reference $Q$.`, why: `KL has a term $p_i\\log(p_i/q_i)$; if $q_i=0$ while $p_i\\gt 0$ you divide by zero inside the log, giving $+\\infty$.` },
          { do: `Add a small smoothing constant to every bin of both histograms before normalizing (e.g. add $10^{-3}$ to each count).`, why: `Additive (Laplace) smoothing removes the hard zero so the log is finite, while barely changing well-populated bins.` },
          { do: `Or switch the drift score to JS divergence or Wasserstein.`, why: `JS uses the midpoint $M=\\tfrac12(P+Q)$, which is never zero where either is positive, so it stays finite by construction; Wasserstein has no division at all.` }
        ],
        answer: `<p>A <b>new category with zero reference probability</b> made a $q_i=0$, so KL hit $+\\infty$. Fix it by <b>additive smoothing</b> (a tiny constant in every bin) or by switching to <b>JS divergence</b> / <b>Wasserstein</b>, both of which stay finite even with disjoint support. This is KL's classic zero-support pitfall.</p>`
      },
      {
        q: `Two distributions sit on completely separate ranges: $P$ is a spike at $0$, $Q$ is a spike at $5$. As you slide $Q$ from $5$ down toward $1$, what do KL/JS report versus Wasserstein, and which is more useful for training a generator?`,
        steps: [
          { do: `Note that as long as the spikes don't overlap, $P$ and $Q$ share no support.`, why: `KL is infinite (zero in one where the other is positive); JS is pinned at its maximum (1 bit) and flat — it can't tell 5 from 2.` },
          { do: `Compute Wasserstein: it is just the distance the mass must move, $|0-5|=5$, then $4$, then $1$ as $Q$ slides in.`, why: `Earth-mover distance measures how far mass is, not whether bins coincide, so it changes smoothly even with disjoint support.` },
          { do: `Pick the metric whose value (and gradient) changes as the spikes approach.`, why: `A generator needs a signal that says "you're getting warmer"; a flat JS gives no gradient, Wasserstein does.` }
        ],
        answer: `<p>KL is $\\infty$ and JS is stuck at its max (1 bit) the whole time the supports are disjoint — both are flat and useless for moving $Q$ closer. <b>Wasserstein</b> reports $5\\to4\\to1$, decreasing smoothly, giving a usable gradient. This is exactly why <b>WGAN (Wasserstein GAN)</b> replaced the JS-based objective.</p>`
      },
      {
        q: `In NLP you want to know whether the bigram "machine learning" is a real collocation or just two common words landing next to each other. Which information measure answers this, and how do you read its sign?`,
        steps: [
          { do: `Use pointwise mutual information: $\\mathrm{PMI}(x,y)=\\log\\frac{p(x,y)}{p(x)p(y)}$ for $x=$"machine", $y=$"learning".`, why: `PMI compares the observed co-occurrence $p(x,y)$ to what you'd expect if the words were independent, $p(x)p(y)$.` },
          { do: `Estimate $p(x,y)$ from how often the pair occurs, and $p(x),p(y)$ from each word's own frequency.`, why: `These are just counts divided by totals over the corpus.` },
          { do: `Read the sign: PMI $\\gt 0$ means they co-occur more than chance (a collocation); $\\approx 0$ means independent; $\\lt 0$ means they avoid each other.`, why: `The log is positive when the ratio exceeds 1, i.e. the pair is over-represented.` }
        ],
        answer: `<p><b>Pointwise mutual information (PMI)</b>. A large positive PMI says "machine" and "learning" appear together far more than their individual frequencies predict — a genuine collocation. PMI near 0 means independent; negative means they repel. Averaging PMI over all word pairs gives the total <b>mutual information</b> $I(X;Y)$.</p>`
      }
    ]
  });

  window.CODE["met-distribution"] = {
    lib: "scipy + numpy",
    runnable: false,
    explain: `<p>The real functions practitioners call: <code>scipy.stats.entropy</code> computes both entropy and KL divergence, <code>jensenshannon</code> gives the JS distance, and <code>wasserstein_distance</code> / <code>energy_distance</code> are the geometric distances. Hellinger and a Gaussian-kernel MMD are short enough to write from scratch, so you see the formula.</p>`,
    code: `import numpy as np
from scipy.stats import entropy, wasserstein_distance, energy_distance
from scipy.spatial.distance import jensenshannon

# Two histograms P and Q over the SAME bins (each sums to 1).
P = np.array([0.5, 0.3, 0.2])
Q = np.array([0.2, 0.3, 0.5])

# --- Information theory ---
H_P = entropy(P, base=2)                 # entropy of P, in bits
H_PQ = entropy(P, base=2) + entropy(P, Q, base=2)  # cross-entropy = H(P) + KL(P||Q)
KL  = entropy(P, Q, base=2)              # KL(P || Q): pass a second arg -> divergence
KL_rev = entropy(Q, P, base=2)           # KL(Q || P): NOT equal in general (asymmetry)
JS  = jensenshannon(P, Q, base=2) ** 2   # JS DIVERGENCE (the function returns the DISTANCE = sqrt)
print("H(P)=%.3f  CE=%.3f  KL=%.3f  KL_rev=%.3f  JS=%.3f" % (H_P, H_PQ, KL, KL_rev, JS))

# Perplexity from a model's cross-entropy (here over P scored with Q):
ppl = 2 ** entropy(P, base=2)            # 2 ** H, the "effective number of choices"
print("perplexity =", round(ppl, 3))

# Mutual information from a joint table p(x,y): I = KL(joint || product-of-marginals)
joint = np.array([[0.30, 0.10],
                  [0.10, 0.50]])
px = joint.sum(1, keepdims=True); py = joint.sum(0, keepdims=True)
MI  = np.sum(joint * np.log2(joint / (px * py)))          # mutual information, bits
PMI = np.log2(joint[1, 1] / (px[1, 0] * py[0, 1]))        # pointwise MI of one cell
print("MI=%.3f bits  PMI(1,1)=%.3f bits" % (MI, PMI))

# --- Distribution distances (work on raw SAMPLES, no binning needed) ---
a = np.array([2.9, 3.1, 3.4, 3.0, 2.7])   # sample from group A
b = np.array([1.9, 2.1, 1.7, 2.3, 2.0])   # sample from group B
print("Wasserstein =", round(wasserstein_distance(a, b), 3))
print("Energy      =", round(energy_distance(a, b), 3))

# Total variation & Hellinger on the two histograms P, Q:
TV  = 0.5 * np.sum(np.abs(P - Q))                          # half the L1 gap
Hel = np.sqrt(0.5 * np.sum((np.sqrt(P) - np.sqrt(Q)) ** 2)) # Hellinger distance
print("TV=%.3f  Hellinger=%.3f" % (TV, Hel))

# MMD from scratch with a Gaussian (RBF) kernel, on the raw samples a, b:
def mmd2(x, y, sigma):
    x = x[:, None]; y = y[:, None]
    k = lambda u, v: np.exp(-(u - v.T) ** 2 / (2 * sigma ** 2))   # RBF similarity
    m, n = len(x), len(y)
    return (k(x, x).sum() / m**2 + k(y, y).sum() / n**2
            - 2 * k(x, y).sum() / (m * n))                        # MMD^2
sigma = np.std(np.concatenate([a, b]))
print("MMD^2 =", round(mmd2(a, b, sigma), 4))`
  };

  window.CODEVIZ["met-distribution"] = {
    question: "Two discrete distributions P and Q over the same 6 ordered bins (P leans left, Q leans right). For each key formula — KL, JS, Wasserstein/earth-mover, KS, PSI — what does it actually look at, and what number does it report on THIS pair?",
    charts: [
      {
        type: "bars",
        title: "Step 1: the two distributions P (leans left) vs Q (leans right), over bins x=1..6",
        labels: ["1", "2", "3", "4", "5", "6"],
        series: [
          { name: "P", color: "#4ea1ff", points: [[0, 0.30], [1, 0.25], [2, 0.20], [3, 0.13], [4, 0.08], [5, 0.04]] },
          { name: "Q", color: "#ff7b72", points: [[0, 0.05], [1, 0.10], [2, 0.17], [3, 0.23], [4, 0.25], [5, 0.20]] }
        ]
      },
      {
        type: "bars",
        title: "KL = sum p log2(p/q): the per-bin contributions that add up to KL(P||Q)=0.82 bits",
        labels: ["1", "2", "3", "4", "5", "6"],
        values: [0.775, 0.330, 0.047, -0.107, -0.132, -0.093],
        valueLabels: ["+.78", "+.33", "+.05", "-.11", "-.13", "-.09"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#ff7b72", "#ff7b72", "#ff7b72"]
      },
      {
        type: "line",
        title: "KS = max|CDF gap| (=0.43 at x=3); Wasserstein = total area between the CDFs (=1.57)",
        xlabel: "bin value x",
        ylabel: "cumulative probability",
        series: [
          { name: "CDF of P", color: "#4ea1ff", points: [[1, 0.30], [2, 0.55], [3, 0.75], [4, 0.88], [5, 0.96], [6, 1.00]] },
          { name: "CDF of Q", color: "#ff7b72", points: [[1, 0.05], [2, 0.15], [3, 0.32], [4, 0.55], [5, 0.80], [6, 1.00]] }
        ]
      },
      {
        type: "bars",
        title: "PSI = sum (p-q) ln(p/q): per-bin contributions add up to PSI=1.10 (big shift, >0.25)",
        labels: ["1", "2", "3", "4", "5", "6"],
        values: [0.448, 0.137, 0.005, 0.057, 0.194, 0.258],
        valueLabels: [".45", ".14", ".00", ".06", ".19", ".26"],
        colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"]
      },
      {
        type: "bars",
        title: "Same shift, five different numbers: each metric on its own scale",
        labels: ["KL(P||Q) bits", "KL(Q||P) bits", "JS div bits", "Wasserstein", "KS stat", "PSI"],
        values: [0.821, 0.763, 0.182, 1.570, 0.430, 1.099],
        valueLabels: ["0.82", "0.76", "0.18", "1.57", "0.43", "1.10"],
        colors: ["#4ea1ff", "#79c0ff", "#7ee787", "#c89bff", "#ffb454", "#ff7b72"]
      }
    ],
    caption: "Real numbers from P=[.30,.25,.20,.13,.08,.04] and Q=[.05,.10,.17,.23,.25,.20] over bins 1..6. Chart 1 shows the shift: P's mass is low, Q's is high. Chart 2 breaks KL(P||Q)=0.82 bits into its per-bin terms p log2(p/q) — green bins (1-3, where p>q) PAY bits, red bins (4-6, where p<q) refund some; they net to 0.82, and KL(Q||P)=0.76 differs because the terms are reweighted (asymmetry). Chart 3 plots both CDFs: the KS statistic is their single biggest vertical gap (0.43 at x=3), while Wasserstein/earth-mover is the TOTAL area between them (1.57, in bin units). Chart 4 splits PSI=Sigma (p-q)ln(p/q)=1.10 per bin (>0.25 = major population shift). Chart 5 lines up all five: bounded [0,1]-ish JS (0.18) and KS (0.43) vs unbounded KL/PSI vs unit-scaled Wasserstein — never compare across metrics, only each to its own threshold.",
    code: `import numpy as np

# Two discrete distributions over the SAME 6 ordered bins (values 1..6).
x = np.array([1, 2, 3, 4, 5, 6])
P = np.array([0.30, 0.25, 0.20, 0.13, 0.08, 0.04])   # leans LEFT
Q = np.array([0.05, 0.10, 0.17, 0.23, 0.25, 0.20])   # leans RIGHT
P = P / P.sum(); Q = Q / Q.sum()

# KL(P||Q) in bits, term by term: p_i * log2(p_i / q_i)  -> sums to 0.821
kl_terms = P * np.log2(P / Q)
KL_fwd = kl_terms.sum()
KL_rev = (Q * np.log2(Q / P)).sum()                  # 0.763 -> asymmetric

# JS divergence (bits): average KL to the midpoint M = (P+Q)/2  -> 0.182
M = 0.5 * (P + Q)
JS = 0.5 * (P * np.log2(P / M)).sum() + 0.5 * (Q * np.log2(Q / M)).sum()

# CDFs -> KS and Wasserstein both read off them (bin spacing = 1):
cP, cQ = np.cumsum(P), np.cumsum(Q)
KS  = np.max(np.abs(cP - cQ))                         # 0.430 (biggest gap, at x=3)
W1  = np.sum(np.abs(cP - cQ))                         # 1.570 (area between CDFs)

# PSI = sum (p - q) * ln(p / q)  -> 1.099  (>0.25 = major shift)
PSI = np.sum((P - Q) * np.log(P / Q))

print("KL=%.3f KLrev=%.3f JS=%.3f Wass=%.3f KS=%.3f PSI=%.3f"
      % (KL_fwd, KL_rev, JS, W1, KS, PSI))
# -> KL=0.821 KLrev=0.763 JS=0.182 Wass=1.570 KS=0.430 PSI=1.099`
  };
})();
