/* =====================================================================
   REAL-WORLD WALKTHROUGHS — MODULE 10 (MODERN DEEP LEARNING & AI).
   Three end-to-end walkthroughs per lesson, each in a distinct domain.
   Every code step was run with python3 (numpy/scipy/stdlib only; torch is
   NOT available) and the EXACT stdout is pasted into `output`.
   Merged into window.WALKTHROUGHS keyed by lesson id.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ============================================================ */
  /* 1. TRANSFORMERS & SELF-ATTENTION  (id: mod-transformer)      */
  /* ============================================================ */
  "mod-transformer": [
    {
      title: `Who does "it" refer to?`,
      domain: `Chatbots / coreference`,
      question: `In "it sat on the mat", which earlier word should the token "it" pull meaning from? Self-attention can decide this without any loop over the sentence.`,
      steps: [
        {
          title: `The data`,
          body: `<p>We have five tokens: "it", "sat", "on", "the", "mat". Each becomes a vector of length $d = 4$. From those vectors we build a query $Q$, a key $K$, and a value $V$ with learned weight matrices.</p>
                 <p>The query asks "what am I looking for?", the key answers "what do I offer?", and the value carries the content to pass along.</p>`
        },
        {
          title: `The math`,
          body: `<p>Self-attention scores every pair of tokens, scales by $\\sqrt{d}$, softmaxes each row, then blends the values:</p>
                 <p>$$\\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d}}\\right) V$$</p>
                 <p>Row 0 is "it" looking at all five tokens. The biggest weight in that row names the word "it" leans on.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Build $Q,K,V$ with a fixed seed, score, softmax, and read off the attention row for "it".</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
tokens = ["it","sat","on","the","mat"]
d = 4
X = rng.standard_normal((len(tokens), d))
Wq = rng.standard_normal((d, d)); Wk = rng.standard_normal((d, d)); Wv = rng.standard_normal((d, d))
Q = X @ Wq; K = X @ Wk; V = X @ Wv
scores = Q @ K.T / np.sqrt(d)
def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)
A = softmax(scores)
out = A @ V
print("attention weights for query 'it':", np.round(A[0], 3))
print("row sum:", round(float(A[0].sum()), 3))
print("most-attended token by 'it':", tokens[int(A[0].argmax())])`,
          output: `attention weights for query 'it': [0.126 0.079 0.209 0.48  0.106]
row sum: 1.0
most-attended token by 'it': the`
        }
      ],
      conclusion: `The row of weights $[0.126, 0.079, 0.209, 0.48, 0.106]$ sums to $1$, and the largest entry $0.48$ points at "the". The new vector for "it" is a weighted blend $\\sum_j A_{0j} V_j$, dominated by that neighbor. With random weights the pick is arbitrary; training is what makes attention learn the right link.`
    },
    {
      title: `Ranking documents for a query`,
      domain: `Search / retrieval`,
      question: `A search query is one vector; candidate documents are key vectors. Scaled dot-product attention turns "how relevant is each doc?" into weights that sum to 1.`,
      steps: [
        {
          title: `The data`,
          body: `<p>The query "running shoes" is a 3-feature vector. Four documents (sneakers, chairs, trail shoes, pots) are also 3-feature vectors. Features loosely mean (athletic, furniture, kitchen).</p>`
        },
        {
          title: `The math`,
          body: `<p>Each document score is the scaled dot product with the query, $\\frac{d_i \\cdot q}{\\sqrt{d}}$. A softmax over the four scores gives attention weights. Higher weight means more relevant.</p>
                 <p>Note we only need scores $&gt; 0$ to win; the softmax handles the rest by normalizing.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compute scores, softmax them, and rank the documents.</p>`,
          code: `import numpy as np
query = np.array([0.9, 0.1, 0.2])           # "running shoes"
docs = np.array([
    [0.8, 0.2, 0.1],   # athletic sneakers
    [0.1, 0.9, 0.0],   # office chairs
    [0.85,0.15,0.25],  # trail running shoes
    [0.0, 0.1, 0.95],  # cooking pots
])
names = ["sneakers","chairs","trail shoes","pots"]
d = query.shape[0]
scores = docs @ query / np.sqrt(d)
def softmax(z):
    z = z - z.max(); e = np.exp(z); return e / e.sum()
w = softmax(scores)
for n, s, p in zip(names, scores, w):
    print(f"{n:12s} score={s:+.3f}  weight={p:.3f}")
print("ranked:", [names[i] for i in np.argsort(-w)])`,
          output: `sneakers     score=+0.439  weight=0.287
chairs       score=+0.104  weight=0.206
trail shoes  score=+0.479  weight=0.299
pots         score=+0.115  weight=0.208
ranked: ['trail shoes', 'sneakers', 'pots', 'chairs']`
        }
      ],
      conclusion: `Trail shoes win at weight $0.299$, sneakers next at $0.287$, both above the off-topic items. The softmax weights sum to $1$ and let the engine pull a relevance-weighted blend of document content, $\\sum_i w_i V_i$. This is attention used directly as a retrieval ranker.`
    },
    {
      title: `Why divide by the square root of d`,
      domain: `Machine translation / stability`,
      question: `Long query/key vectors make dot products huge, which saturates the softmax and kills gradients. Does dividing by $\\sqrt{d}$ actually fix it?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Take a translation model with head dimension $d = 64$. A query $q$ and four keys are drawn with independent standard-normal entries, mean 0 and variance 1.</p>`
        },
        {
          title: `The math`,
          body: `<p>A raw score is $q^\\top k = \\sum_{i=1}^{d} q_i k_i$. Each term has variance 1, so the sum has variance $d$ and typical size $\\sqrt{d} \\approx 8$. After dividing by $\\sqrt{d}$ the variance returns to 1.</p>
                 <p>We compare the top softmax weight with and without the scaling. A near-1 weight means the softmax has saturated.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Score raw and scaled, then softmax both.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
def softmax(z):
    z = z - z.max(); e = np.exp(z); return e / e.sum()
q = rng.standard_normal(64); k = rng.standard_normal((4, 64))
raw = k @ q
scaled = raw / np.sqrt(64)
print("raw dot products:   ", np.round(raw, 2))
print("scaled by 1/sqrt(d):", np.round(scaled, 2))
print("softmax(raw)   max weight:", round(float(softmax(raw).max()), 3))
print("softmax(scaled) max weight:", round(float(softmax(scaled).max()), 3))`,
          output: `raw dot products:    [-9.7  -6.95 -2.03 -7.39]
scaled by 1/sqrt(d): [-1.21 -0.87 -0.25 -0.92]
softmax(raw)   max weight: 0.988
softmax(scaled) max weight: 0.411`
        }
      ],
      conclusion: `Raw scores span about $[-9.7, -2.0]$ and the softmax slams one weight to $0.988$ (saturated, tiny gradient). Dividing by $\\sqrt{64} = 8$ shrinks them to roughly $[-1.2, -0.25]$ and the top weight drops to $0.411$, a healthy spread. The single factor $\\frac{1}{\\sqrt{d}}$ keeps attention trainable no matter how long the vectors get.`
    }
  ],

  /* ============================================================ */
  /* 2. MULTI-HEAD ATTENTION  (id: mod-multihead)                 */
  /* ============================================================ */
  "mod-multihead": [
    {
      title: `Two heads on one sentence`,
      domain: `Chatbots / language understanding`,
      question: `Split each token's vector into two slices, run attention on each, and the two heads focus on different words. Does concatenating them give a richer vector?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Sentence "she poured the tea". Each token is a vector of size $d = 8$. With $h = 2$ heads, each head sees a slice of size $d/h = 4$.</p>`
        },
        {
          title: `The math`,
          body: `<p>Each head runs its own scaled-dot-product attention on its slice, then we stack the outputs:</p>
                 <p>$$\\text{MultiHead} = \\text{Concat}(\\text{head}_1, \\text{head}_2)\\,W^O, \\quad \\text{head}_i = \\text{Attention}(Q_i, K_i, V_i)$$</p>
                 <p>We watch the attention row for "she" in each head; if the two heads disagree on what to look at, they are capturing different relations.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Slice, attend per head, and concatenate.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
tokens = ["she","poured","the","tea"]
d, h = 8, 2
dh = d // h
X = rng.standard_normal((4, d))
def softmax(z):
    z = z - z.max(axis=-1, keepdims=True); e = np.exp(z); return e / e.sum(axis=-1, keepdims=True)
def attn(slc):
    Q = K = V = slc
    A = softmax(Q @ K.T / np.sqrt(slc.shape[1]))
    return A, A @ V
heads = []
for i in range(h):
    sl = X[:, i*dh:(i+1)*dh]
    A, o = attn(sl)
    heads.append(o)
    print(f"head {i} attn for 'she':", np.round(A[0], 3))
concat = np.concatenate(heads, axis=1)
print("concat shape:", concat.shape)`,
          output: `head 0 attn for 'she': [0.307 0.209 0.291 0.193]
head 1 attn for 'she': [0.68  0.085 0.153 0.083]
concat shape: (4, 8)`
        }
      ],
      conclusion: `Head 0 spreads its attention nearly evenly $[0.31, 0.21, 0.29, 0.19]$, while head 1 concentrates on "she" itself at $0.68$. Two different focuses for the same token. Concatenating gives a $(4, 8)$ matrix, back to length $d = 8$ per token, ready for $W^O$. Same vector budget, two independent views.`
    },
    {
      title: `Three signals over a reading history`,
      domain: `Recommendation systems`,
      question: `A reader's history is a sequence of book vectors. With three heads we can let each head specialize on a different aspect of taste, then fuse them.`,
      steps: [
        {
          title: `The data`,
          body: `<p>History of four books: mystery, cookbook, sci-fi, memoir. Each is a vector of size $d = 6$. With $h = 3$ heads, each head works in $d/h = 2$ dimensions.</p>`
        },
        {
          title: `The math`,
          body: `<p>Each head attends over the four books with its own 2-D slice. The head's output per book is $\\sum_j A_{ij} V_j$. Because the slices differ, the three heads pick different "most similar" books.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Run attention per head and see which book each head ties "mystery" to.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
items = ["mystery","cookbook","sci-fi","memoir"]
d, h = 6, 3
dh = d // h
X = rng.standard_normal((4, d))
def softmax(z):
    z = z - z.max(axis=-1, keepdims=True); e = np.exp(z); return e / e.sum(axis=-1, keepdims=True)
outs = []
for i in range(h):
    sl = X[:, i*dh:(i+1)*dh]
    A = softmax(sl @ sl.T / np.sqrt(dh))
    outs.append(A @ sl)
    print(f"head {i}: top item for 'mystery' query ->", items[int(A[0].argmax())])
concat = np.concatenate(outs, axis=1)
print("per-item enriched vector length:", concat.shape[1])`,
          output: `head 0: top item for 'mystery' query -> cookbook
head 1: top item for 'mystery' query -> mystery
head 2: top item for 'mystery' query -> memoir
per-item enriched vector length: 6`
        }
      ],
      conclusion: `The three heads link "mystery" to three different books (cookbook, itself, memoir). Each head captures a distinct facet of similarity. Concatenating restores the length-$6$ vector ($3$ heads of size $2$), so the recommender gets a multi-faceted item representation at the same cost as one big head.`
    },
    {
      title: `Same budget, more views`,
      domain: `Model architecture / cost`,
      question: `Splitting size-$d$ attention into $h$ heads of size $d/h$ keeps the total work the same. So why not always use many heads?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Model vector size $d = 12$. We compare $h = 1$, $3$, and $6$ heads. Each head works in $d/h$ dimensions.</p>`
        },
        {
          title: `The math`,
          body: `<p>Per-head attention cost scales with the head dimension $d/h$. Summed over $h$ heads the total is $h \\cdot \\frac{d}{h} = d$, independent of $h$. But you get $h$ independent focuses instead of one.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Tabulate head dimension, total work, and number of views.</p>`,
          code: `import numpy as np
d = 12
for h in [1, 3, 6]:
    dh = d // h
    # attention cost per head ~ proportional to dh (per query-key dim), x h heads
    work = h * dh
    print(f"h={h:>2} heads, head_dim={dh:>2}, total dim of work = {work}, views = {h}")`,
          output: `h= 1 heads, head_dim=12, total dim of work = 12, views = 1
h= 3 heads, head_dim= 4, total dim of work = 12, views = 3
h= 6 heads, head_dim= 2, total dim of work = 12, views = 6`
        }
      ],
      conclusion: `Total work stays at $12$ for all three configurations, yet views climb from $1$ to $6$. Each head still produces one weighted average, so more heads means more simultaneous relations for free. The catch is the head dimension shrinks ($12 \\to 2$): too many heads and each one is too small to be expressive, which is why real models tune $h$ rather than maximize it.`
    }
  ],

  /* ============================================================ */
  /* 3. LARGE LANGUAGE MODELS  (id: mod-llm)                      */
  /* ============================================================ */
  "mod-llm": [
    {
      title: `Temperature controls the chatbot`,
      domain: `Chatbots / text generation`,
      question: `Given fixed next-word logits, how does the temperature knob change which word a chatbot is likely to say?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Prompt "The cat sat on the ___". The model emits one logit (raw score) per vocabulary word: $z = [3.2, 2.1, 1.0, -0.5]$ for ["mat", "sofa", "roof", "moon"].</p>`
        },
        {
          title: `The math`,
          body: `<p>The next-token probability divides each logit by temperature $T$ before softmax:</p>
                 <p>$$P(x_{t+1} = v) = \\frac{\\exp(z_v / T)}{\\sum_u \\exp(z_u / T)}$$</p>
                 <p>Low $T$ (below 1) sharpens toward the top word; high $T$ (above 1) flattens toward uniform.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Softmax the same logits at three temperatures.</p>`,
          code: `import numpy as np
vocab = ["mat","sofa","roof","moon"]
logits = np.array([3.2, 2.1, 1.0, -0.5])
def softmax(z):
    z = z - z.max(); e = np.exp(z); return e / e.sum()
for T in [0.5, 1.0, 2.0]:
    p = softmax(logits / T)
    print(f"T={T}: " + ", ".join(f"{v}={pi*100:5.1f}%" for v, pi in zip(vocab, p)))`,
          output: `T=0.5: mat= 89.0%, sofa=  9.9%, roof=  1.1%, moon=  0.1%
T=1.0: mat= 68.1%, sofa= 22.7%, roof=  7.5%, moon=  1.7%
T=2.0: mat= 48.4%, sofa= 27.9%, roof= 16.1%, moon=  7.6%`
        }
      ],
      conclusion: `At $T = 0.5$ the model is almost sure ("mat" $= 89\\%$): focused, repetitive. At $T = 1$ it is confident but flexible ($68\\%$). At $T = 2$ the bars flatten ("mat" only $48\\%$): creative, riskier. Same logits, very different behavior, all from one division by $T$.`
    },
    {
      title: `BERT for sentiment`,
      domain: `Search / text classification`,
      question: `BERT pools a sentence into one vector, then a tiny classifier head turns it into class probabilities. How does the softmax decide positive vs negative?`,
      steps: [
        {
          title: `The data`,
          body: `<p>BERT summarizes a review into a pooled [CLS] vector of size 4. A classifier head with weights $W$ (shape $2 \\times 4$) and bias $b$ maps it to two logits, one per class.</p>`
        },
        {
          title: `The math`,
          body: `<p>The logits are $\\text{logits} = W\\,\\text{cls} + b$, then softmax gives $P(\\text{neg})$ and $P(\\text{pos})$. The larger probability is the prediction.</p>
                 <p>This is the same fine-tuning head BERT uses for ranking and question answering, just with two output classes here.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Project the pooled vector to logits and softmax.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
cls = rng.standard_normal(4)          # pooled sentence vector
W = rng.standard_normal((2, 4)); b = np.array([0.1, -0.1])
logits = W @ cls + b
def softmax(z):
    z = z - z.max(); e = np.exp(z); return e / e.sum()
p = softmax(logits)
labels = ["negative","positive"]
print("logits:", np.round(logits, 3))
print("P(neg)=%.3f  P(pos)=%.3f" % (p[0], p[1]))
print("prediction:", labels[int(p.argmax())])`,
          output: `logits: [ 0.919 -0.416]
P(neg)=0.792  P(pos)=0.208
prediction: negative`
        }
      ],
      conclusion: `The head produces logits $[0.919, -0.416]$; softmax turns that gap into $P(\\text{neg}) = 0.792$ vs $P(\\text{pos}) = 0.208$, so the review is classified negative. Fine-tuning trains $W$ and $b$ so the right class gets the bigger logit; the architecture is just BERT's pooled vector plus a softmax.`
    },
    {
      title: `Scoring a sentence with perplexity`,
      domain: `Code completion / evaluation`,
      question: `An LLM scores a whole sentence as a product of next-token probabilities. Perplexity turns that into a single "how surprised was the model?" number. Lower is better.`,
      steps: [
        {
          title: `The data`,
          body: `<p>For two candidate completions we record the model's probability of each true next token. A "good" completion gets high per-token probabilities; a "bad" one gets low ones.</p>`
        },
        {
          title: `The math`,
          body: `<p>The chain rule factors a sentence's likelihood into per-token predictions: $P(\\text{sentence}) = \\prod_t P(x_t \\mid x_{1:t-1})$. Perplexity is</p>
                 <p>$$\\text{PPL} = \\exp\\!\\left(-\\frac{1}{n}\\sum_t \\log P(x_t \\mid x_{1:t-1})\\right)$$</p>
                 <p>It is the geometric mean of $1/P$, so smaller perplexity means the model found the text less surprising.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compute likelihood and perplexity for both completions.</p>`,
          code: `import numpy as np
probs_good = [0.6, 0.5, 0.7, 0.4]   # model's prob of each true next token
probs_bad  = [0.1, 0.05, 0.2, 0.15]
def ppl(ps):
    ps = np.array(ps)
    return float(np.exp(-np.mean(np.log(ps))))
print("sentence likelihood (good) =", round(float(np.prod(probs_good)), 5))
print("perplexity (good) =", round(ppl(probs_good), 3))
print("perplexity (bad)  =", round(ppl(probs_bad), 3))
print("good fits the model better:", ppl(probs_good) < ppl(probs_bad))`,
          output: `sentence likelihood (good) = 0.084
perplexity (good) = 1.858
perplexity (bad)  = 9.036
good fits the model better: True`
        }
      ],
      conclusion: `The good completion has perplexity $1.858$ versus $9.036$ for the bad one. A perplexity near $1.9$ means the model was effectively choosing among about 2 words at each step; near $9$ means it was floundering among 9. Because likelihood factors per token via the chain rule, this single number ranks completions, which is exactly how code-completion models pick suggestions.`
    }
  ],

  /* ============================================================ */
  /* 4. AUTOENCODERS  (id: mod-autoencoder)                       */
  /* ============================================================ */
  "mod-autoencoder": [
    {
      title: `Catching a fraudulent transaction`,
      domain: `Anomaly detection / fraud`,
      question: `Normal transactions live on a low-dimensional surface. A linear autoencoder (PCA) rebuilds them with tiny error; a fraud transaction lies off the surface and reconstructs badly.`,
      steps: [
        {
          title: `The data`,
          body: `<p>200 normal transactions, each 5 numbers, but secretly generated from just 2 underlying factors, so they lie on a 2-D plane inside 5-D space. We fit a 2-number bottleneck.</p>`
        },
        {
          title: `The math`,
          body: `<p>A linear autoencoder with squared loss learns the top principal components. Encode $z = (x - \\mu)P^\\top$, decode $\\hat{x} = zP + \\mu$, score with $\\mathcal{L} = \\lVert x - \\hat{x} \\rVert^2$.</p>
                 <p>Points on the plane reconstruct perfectly; a fraud vector pushed off the plane keeps a large residual.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit the 2-D subspace by SVD, then compare reconstruction error for a normal vs a fraud transaction.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
basis = rng.standard_normal((2, 5))
codes = rng.standard_normal((200, 2))
Xn = codes @ basis
mu = Xn.mean(0)
Xc = Xn - mu
U, S, Vt = np.linalg.svd(Xc, full_matrices=False)
P = Vt[:2]                       # 2-D bottleneck (encoder = decoder = P)
def recon_err(x):
    xc = x - mu
    z = xc @ P.T                 # encode to 2 numbers
    xr = z @ P                   # decode back to 5
    return float(np.mean((xc - xr) ** 2))
normal_err = np.mean([recon_err(x) for x in Xn])
fraud = Xn[0] + np.array([2.0, -1.5, 3.0, -2.0, 2.5])   # large off-plane shift
print("avg normal recon error: %.6f" % normal_err)
print("fraud recon error:      %.6f" % recon_err(fraud))
print("fraud flagged (error > 0.5):", recon_err(fraud) > 0.5)`,
          output: `avg normal recon error: 0.000000
fraud recon error:      4.805402
fraud flagged (error > 0.5): True`
        }
      ],
      conclusion: `Normal transactions reconstruct with error $\\approx 0$ because they lie on the learned 2-D plane. The fraud vector reconstructs with error $4.81$, far above any sensible threshold, so it is flagged. The bottleneck only learned the "normal" geometry, so anything off that surface lights up. That residual $\\lVert x - \\hat{x} \\rVert^2$ is the anomaly score.`
    },
    {
      title: `Compressing image patches`,
      domain: `Image compression`,
      question: `Smooth image patches are highly redundant. How many bottleneck numbers do we need to rebuild an 8-pixel patch, and what is the error/compression trade-off?`,
      steps: [
        {
          title: `The data`,
          body: `<p>300 smooth 8-pixel patches, each built from 3 hidden coefficients (a constant, a ramp, and a sine). Neighboring pixels are correlated, so the intrinsic dimension is far below 8.</p>`
        },
        {
          title: `The math`,
          body: `<p>For each code size $k$ we keep the top $k$ principal directions, encode $8 \\to k$, decode $k \\to 8$, and measure mean squared error plus the fraction of variance kept.</p>
                 <p>More code numbers means lower error but less compression.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Sweep code sizes 1, 2, 3.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
t = np.linspace(0, 1, 8)
patches = np.array([a + b*t + c*np.sin(3*t) for a, b, c in rng.standard_normal((300, 3))])
mu = patches.mean(0); Xc = patches - mu
U, S, Vt = np.linalg.svd(Xc, full_matrices=False)
total_var = (S**2).sum()
for k in [1, 2, 3]:
    P = Vt[:k]
    Z = Xc @ P.T               # encode 8 -> k
    R = Z @ P + mu             # decode k -> 8
    err = np.mean((patches - R)**2)
    kept = (S[:k]**2).sum()/total_var
    print(f"code size {k}: recon MSE={err:.6f}, variance kept={kept*100:5.1f}%")`,
          output: `code size 1: recon MSE=0.167341, variance kept= 90.2%
code size 2: recon MSE=0.075391, variance kept= 95.6%
code size 3: recon MSE=0.000000, variance kept=100.0%`
        }
      ],
      conclusion: `A single code number already keeps $90.2\\%$ of the variance; three numbers nail the patch exactly (MSE $\\approx 0$, $100\\%$ variance) because the data truly had 3 degrees of freedom. The autoencoder discovers the intrinsic dimension on its own: compressing $8 \\to 3$ is lossless here, while $8 \\to 1$ trades error for a 8x smaller code.`
    },
    {
      title: `Cleaning a noisy signal`,
      domain: `Denoising`,
      question: `If clean signals all live in a small subspace, projecting a noisy signal onto that subspace throws away the noise. Does an autoencoder denoise just by reconstructing?`,
      steps: [
        {
          title: `The data`,
          body: `<p>400 clean signals, each a 10-sample sine at a random phase. All phases of a sine lie in a 2-D subspace (spanned by sine and cosine). We then corrupt one signal with Gaussian noise.</p>`
        },
        {
          title: `The math`,
          body: `<p>Encode the noisy signal into the 2-D code, then decode: $\\hat{x} = ((x - \\mu)P^\\top)P + \\mu$. The in-subspace part survives; the off-subspace noise is dropped. Compare MSE-to-clean before and after.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit the clean subspace, then run a noisy signal through the autoencoder.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
t = np.linspace(0, 1, 10)
clean = np.array([np.sin(2*np.pi*t + p) for p in rng.uniform(0, 6, 400)])  # all sines
mu = clean.mean(0); Xc = clean - mu
U, S, Vt = np.linalg.svd(Xc, full_matrices=False)
P = Vt[:2]                                   # 2-D subspace captures all phases
sig = np.sin(2*np.pi*t + 1.0)
noisy = sig + rng.normal(0, 0.4, 10)
den = ((noisy - mu) @ P.T) @ P + mu          # encode then decode = denoise
print("noisy  MSE vs clean:", round(float(np.mean((noisy - sig)**2)), 4))
print("denoised MSE vs clean:", round(float(np.mean((den - sig)**2)), 4))`,
          output: `noisy  MSE vs clean: 0.0834
denoised MSE vs clean: 0.0036`
        }
      ],
      conclusion: `The noisy signal sits $0.0834$ MSE away from the clean sine. After encoding to 2 numbers and decoding, the error drops to $0.0036$, a 23x improvement. The bottleneck can only represent things in the clean subspace, so reconstruction silently strips the noise. This is exactly how a denoising autoencoder rebuilds a clean image from a corrupted one.`
    }
  ],

  /* ============================================================ */
  /* 5. VARIATIONAL AUTOENCODERS  (id: mod-vae)                   */
  /* ============================================================ */
  "mod-vae": [
    {
      title: `Generating varied faces from one code`,
      domain: `Image generation`,
      question: `The reparameterization trick samples a code $z = \\mu + \\sigma\\odot\\epsilon$. Feeding the same input through it twice gives two different but related outputs. That variety is how a VAE generates.`,
      steps: [
        {
          title: `The data`,
          body: `<p>For one input, the encoder outputs a mean $\\mu = [0.5, -0.2]$ and a spread $\\sigma = [0.3, 0.4]$. A toy linear decoder ($2 \\to 3$) stands in for the face generator.</p>`
        },
        {
          title: `The math`,
          body: `<p>Draw noise $\\epsilon \\sim N(0, I)$ and form $z = \\mu + \\sigma \\odot \\epsilon$, where $\\odot$ multiplies entrywise. The randomness sits in $\\epsilon$, so gradients still flow to $\\mu, \\sigma$. Decode each $z$ to an output.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Sample three codes from the same $\\mu, \\sigma$ and decode them.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
mu = np.array([0.5, -0.2])          # encoder mean for one input
sigma = np.array([0.3, 0.4])        # encoder spread
W = np.array([[1.0, 0.5],[0.2, -1.0],[0.8, 0.3]])   # toy decoder 2 -> 3
for i in range(3):
    eps = rng.standard_normal(2)
    z = mu + sigma * eps
    x = W @ z
    print(f"sample {i}: eps={np.round(eps,2)}  z={np.round(z,2)}  decoded={np.round(x,2)}")`,
          output: `sample 0: eps=[ 0.13 -0.13]  z=[ 0.54 -0.25]  decoded=[0.41 0.36 0.35]
sample 1: eps=[0.64 0.1 ]  z=[ 0.69 -0.16]  decoded=[0.61 0.3  0.51]
sample 2: eps=[-0.54  0.36]  z=[ 0.34 -0.06]  decoded=[0.31 0.12 0.25]`
        }
      ],
      conclusion: `Each draw of $\\epsilon$ jitters the code around $\\mu = [0.5, -0.2]$, producing three nearby codes and three similar-but-distinct decoded outputs. Because $z = \\mu + \\sigma\\epsilon$ is a smooth function of $\\mu$ and $\\sigma$ with $\\epsilon$ held fixed, the network can still be trained by backprop. The encoded spread $\\sigma$ is what gives a VAE its generative variety.`
    },
    {
      title: `Morphing between two avatars`,
      domain: `Image generation / interpolation`,
      question: `The VAE's KL term packs all codes near $N(0, I)$, leaving no holes. So a straight line between two codes decodes to a smooth morph. Does every step in between look plausible?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Two avatars are encoded to latent points $z_A = [-1, 1]$ and $z_B = [1.5, 0.5]$. The same toy linear decoder turns any code into an output.</p>`
        },
        {
          title: `The math`,
          body: `<p>Interpolate $z(\\alpha) = (1 - \\alpha) z_A + \\alpha z_B$ for $\\alpha$ from 0 to 1, then decode each. A smooth, continuous latent space means consecutive outputs change gradually.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Walk five steps from $z_A$ to $z_B$ and decode each.</p>`,
          code: `import numpy as np
W = np.array([[1.0, 0.5],[0.2,-1.0],[0.8,0.3]])   # toy decoder
zA = np.array([-1.0, 1.0])    # latent of face A
zB = np.array([ 1.5, 0.5])    # latent of face B
for a in [0.0, 0.25, 0.5, 0.75, 1.0]:
    z = (1 - a) * zA + a * zB
    x = W @ z
    print(f"alpha={a:.2f}  z={np.round(z,2)}  decoded={np.round(x,2)}")`,
          output: `alpha=0.00  z=[-1.  1.]  decoded=[-0.5 -1.2 -0.5]
alpha=0.25  z=[-0.38  0.88]  decoded=[ 0.06 -0.95 -0.04]
alpha=0.50  z=[0.25 0.75]  decoded=[ 0.62 -0.7   0.42]
alpha=0.75  z=[0.88 0.62]  decoded=[ 1.19 -0.45  0.89]
alpha=1.00  z=[1.5 0.5]  decoded=[ 1.75 -0.2   1.35]`
        }
      ],
      conclusion: `Each decoded output shifts in even, monotone steps from $[-0.5, -1.2, -0.5]$ to $[1.75, -0.2, 1.35]$, with no jumps. Because the KL term keeps the latent space dense and gap-free, every intermediate code decodes to a valid in-between face. That smooth-interpolation property is what a plain autoencoder lacks and a VAE provides.`
    },
    {
      title: `Flagging anomalies by KL`,
      domain: `Anomaly detection`,
      question: `A VAE's KL term measures how far an input's encoded distribution sits from $N(0, I)$. A typical input gets a small KL; a strange input the encoder is unsure about gets a large one.`,
      steps: [
        {
          title: `The data`,
          body: `<p>Two inputs. A normal one encodes to $\\mu \\approx 0$, $\\sigma \\approx 1$ (close to the prior). A weird one encodes to a large mean $\\mu = [3, 2.5]$ and tight $\\sigma = [0.2, 0.3]$ (the encoder is confidently off-prior).</p>`
        },
        {
          title: `The math`,
          body: `<p>The closed-form KL from $N(\\mu, \\sigma^2)$ to $N(0, 1)$, summed over dimensions, is</p>
                 <p>$$D_{KL} = \\tfrac{1}{2}\\sum_i \\big(\\mu_i^2 + \\sigma_i^2 - 2\\log\\sigma_i - 1\\big)$$</p>
                 <p>Inputs far from the prior have large KL, so KL itself is an anomaly score.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compute KL for both inputs.</p>`,
          code: `import numpy as np
def kl(mu, sigma):
    # KL(N(mu,sigma^2) || N(0,1)) summed over dims
    return float(0.5 * np.sum(mu**2 + sigma**2 - 2*np.log(sigma) - 1))
normal = (np.array([0.1, -0.2]), np.array([0.9, 1.1]))
weird  = (np.array([3.0,  2.5]), np.array([0.2, 0.3]))
print("normal input KL:", round(kl(*normal), 4))
print("weird  input KL:", round(kl(*weird), 4))
print("weird flagged (KL > 1):", kl(*weird) > 1)`,
          output: `normal input KL: 0.0451
weird  input KL: 9.5034
weird flagged (KL > 1): True`
        }
      ],
      conclusion: `The normal input has KL $0.045$, right at the prior. The weird input has KL $9.50$, dominated by its large $\\mu^2$ term, so it is flagged. Because training pulled ordinary inputs toward $N(0, I)$, anything the encoder must push far away to represent is, by definition, unusual. The KL term doubles as a built-in novelty detector.`
    }
  ],

  /* ============================================================ */
  /* 6. DIFFUSION MODELS  (id: mod-diffusion)                     */
  /* ============================================================ */
  "mod-diffusion": [
    {
      title: `Noise it, then undo it`,
      domain: `Image generation`,
      question: `The forward process dissolves an image into noise; a denoiser that knows the noise it added can walk the chain backward. Can we noise a tiny image and recover it exactly?`,
      steps: [
        {
          title: `The data`,
          body: `<p>A 4-pixel "image" $x_0 = [0.9, 0.1, 0.8, 0.2]$. A noise schedule $\\beta = [0.1, 0.2, 0.3]$ controls how much fresh noise each forward step adds.</p>`
        },
        {
          title: `The math`,
          body: `<p>Each forward step is $x_t = \\sqrt{1 - \\beta_t}\\,x_{t-1} + \\sqrt{\\beta_t}\\,\\epsilon$. The training target is the added noise $\\epsilon$. An ideal denoiser knows every $\\epsilon$, so it inverts each step by $x_{t-1} = (x_t - \\sqrt{\\beta_t}\\,\\epsilon)/\\sqrt{1 - \\beta_t}$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Run forward noising, remembering each $\\epsilon$, then reverse it.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
clean = np.array([0.9, 0.1, 0.8, 0.2])     # a tiny 4-pixel "image"
betas = [0.1, 0.2, 0.3]
x = clean.copy()
noises = []
for b in betas:
    eps = rng.standard_normal(4); noises.append((b, eps))
    x = np.sqrt(1 - b) * x + np.sqrt(b) * eps
print("noisy x after 3 steps:", np.round(x, 3))
# reverse: an ideal eps-predictor knows each eps; undo step by step
for b, eps in reversed(noises):
    x = (x - np.sqrt(b) * eps) / np.sqrt(1 - b)
print("recovered clean image:", np.round(x, 3))
print("matches original:", np.allclose(x, clean))`,
          output: `noisy x after 3 steps: [ 0.083 -0.518  0.866  0.544]
recovered clean image: [0.9 0.1 0.8 0.2]
matches original: True`
        }
      ],
      conclusion: `After 3 forward steps the image is unrecognizable static $[0.083, -0.518, 0.866, 0.544]$. Subtracting the predicted noise step by step recovers $x_0 = [0.9, 0.1, 0.8, 0.2]$ exactly. The whole job of a diffusion network is to predict $\\epsilon_\\theta(x_t, t)$; a perfect predictor inverts the chain, and starting from pure noise instead would synthesize a brand-new image.`
    },
    {
      title: `Why the two square roots`,
      domain: `Generative modeling / stability`,
      question: `The forward step uses $\\sqrt{1 - \\beta_t}$ on the signal and $\\sqrt{\\beta_t}$ on the noise. The claim is that this keeps the variance pinned at 1 across all steps. Does it hold?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Start with $100{,}000$ samples of unit variance. Apply four forward steps with an increasing schedule $\\beta = [0.1, 0.3, 0.5, 0.7]$, adding fresh unit-variance noise each time.</p>`
        },
        {
          title: `The math`,
          body: `<p>If $x_{t-1}$ and $\\epsilon$ both have variance 1 and are independent, then $\\text{Var}(x_t) = (1 - \\beta_t)\\cdot 1 + \\beta_t\\cdot 1 = 1$. The two square roots are chosen exactly to conserve variance.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Track the sample variance after each step.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
x = rng.standard_normal(100000)        # start with variance ~1
print("step 0 variance: %.4f" % x.var())
for t, b in enumerate([0.1, 0.3, 0.5, 0.7], start=1):
    eps = rng.standard_normal(100000)
    x = np.sqrt(1 - b) * x + np.sqrt(b) * eps
    print(f"step {t} (beta={b}) variance: {x.var():.4f}")`,
          output: `step 0 variance: 1.0003
step 1 (beta=0.1) variance: 1.0018
step 2 (beta=0.3) variance: 1.0008
step 3 (beta=0.5) variance: 0.9978
step 4 (beta=0.7) variance: 0.9973`
        }
      ],
      conclusion: `The variance stays glued to $1.000$ across all four steps even as $\\beta$ grows from $0.1$ to $0.7$. Without the $\\sqrt{1 - \\beta_t}$ shrink, repeated additions would make the signal explode. The schedule trades structure for noise while conserving total energy, which is why the forward process can run for hundreds of steps without blowing up.`
    },
    {
      title: `Denoising an audio frame`,
      domain: `Audio generation`,
      question: `A diffusion denoiser learns to separate signal from noise. If clean audio frames are smooth (low-rank), the part of a noisy frame lying off the clean subspace is the noise to remove.`,
      steps: [
        {
          title: `The data`,
          body: `<p>400 clean 8-sample audio frames, each a sine at a random phase, so they all live in a 2-D subspace. One forward step with $\\beta = 0.3$ noises a held-out frame.</p>`
        },
        {
          title: `The math`,
          body: `<p>The noisy frame is $x_t = \\sqrt{1 - \\beta}\\,\\text{sig} + \\sqrt{\\beta}\\,\\epsilon$. A denoiser that knows the clean subspace projects onto it: the in-subspace component is the recovered signal, the rest is discarded noise.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit the clean subspace, noise a frame, then project to denoise.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
t = np.linspace(0, 1, 8)
clean = np.array([np.sin(2*np.pi*t + p) for p in rng.uniform(0, 6, 400)])  # smooth frames
mu = clean.mean(0); Xc = clean - mu
U, S, Vt = np.linalg.svd(Xc, full_matrices=False)
P = Vt[:2]                                   # clean signals live in a 2-D subspace
beta = 0.3
sig = np.sin(2*np.pi*t + 1.0)
eps = rng.standard_normal(8)
xt = np.sqrt(1-beta)*sig + np.sqrt(beta)*eps  # one forward step
# denoiser: keep only the in-subspace part, treat the rest as noise
clean_part = ((xt - mu) @ P.T) @ P + mu
print("noisy frame MSE vs clean:   ", round(float(np.mean((xt - np.sqrt(1-beta)*sig)**2)), 4))
print("denoised frame MSE vs clean:", round(float(np.mean((clean_part - np.sqrt(1-beta)*sig)**2)), 4))`,
          output: `noisy frame MSE vs clean:    0.1778
denoised frame MSE vs clean: 0.0143`
        }
      ],
      conclusion: `The noised frame sits $0.1778$ MSE from the clean signal; projecting onto the learned 2-D audio subspace cuts that to $0.0143$, a 12x reduction. A real diffusion network learns this denoising as $\\epsilon_\\theta(x_t, t)$ instead of an explicit projection, but the principle is identical: separate the structured signal from the unstructured noise, one step at a time.`
    }
  ],

  /* ============================================================ */
  /* 7. NORMALIZING FLOWS  (id: mod-normalizing-flows)            */
  /* ============================================================ */
  "mod-normalizing-flows": [
    {
      title: `Bending a Gaussian into two peaks`,
      domain: `Density estimation`,
      question: `Push a single Gaussian hump through an invertible map and it splits into a bimodal shape, yet the change-of-variables formula still gives the exact density and it still integrates to 1.`,
      steps: [
        {
          title: `The data`,
          body: `<p>Base density is a standard Gaussian in $u$. The transform is $x = g(u) = u + 1.6\\,\\tanh(u)$, whose derivative $g'(u) = 1 + 1.6(1 - \\tanh^2 u)$ is always positive, so $g$ is invertible.</p>`
        },
        {
          title: `The math`,
          body: `<p>Change of variables: $p_x(x) = p_u(u)\\,/\\,|g'(u)|$ where $u = g^{-1}(x)$. Where $g$ stretches space ($g'$ large) the density thins; where it squeezes, density piles up. The total probability must stay $1$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Evaluate the transformed density at several points and numerically integrate it.</p>`,
          code: `import numpy as np
def base_pdf(u): return np.exp(-u*u/2)/np.sqrt(2*np.pi)
sep = 1.6
g  = lambda u: u + sep*np.tanh(u)
gp = lambda u: 1 + sep*(1 - np.tanh(u)**2)   # always > 0 => invertible
us = np.array([-2.0, -0.5, 0.0, 0.5, 2.0])
for u in us:
    x = g(u); px = base_pdf(u)/abs(gp(u))
    print(f"u={u:+.1f} -> x={x:+.3f}   p_x(x)={px:.4f}")
# verify it integrates to 1 (change of variables: integrate p_x over x = integrate p_u over u)
uu = np.linspace(-8, 8, 200000)
xx = g(uu); pxx = base_pdf(uu)/np.abs(gp(uu))
print("integral of p_x dx =", round(float(np.trapz(pxx, xx)), 4))`,
          output: `u=-2.0 -> x=-3.542   p_x(x)=0.0485
u=-0.5 -> x=-1.239   p_x(x)=0.1559
u=+0.0 -> x=+0.000   p_x(x)=0.1534
u=+0.5 -> x=+1.239   p_x(x)=0.1559
u=+2.0 -> x=+3.542   p_x(x)=0.0485
integral of p_x dx = 1.0`
        }
      ],
      conclusion: `At the center ($u = 0$) the map stretches space, so $p_x(0) = 0.153$ is lower than the off-center peaks at $x = \\pm1.239$ where $p_x = 0.156$: a single hump has become bimodal. Crucially $\\int p_x\\,dx = 1.0$, confirming the $1/|g'(u)|$ factor conserves probability. The flow gives an exact, normalized density for a shape the base Gaussian could never represent.`
    },
    {
      title: `Flagging a network intrusion`,
      domain: `Anomaly detection`,
      question: `A flow gives the EXACT log-likelihood of any point. Low-likelihood traffic is anomalous. Can an affine flow fit to normal traffic flag an attack value?`,
      steps: [
        {
          title: `The data`,
          body: `<p>2000 normal traffic measurements distributed as $N(5, 2^2)$. An affine flow $x = e^s u + t$ with $t = \\text{mean}$ and $e^s = \\text{std}$ maps that data back to a standard Gaussian.</p>`
        },
        {
          title: `The math`,
          body: `<p>The inverse is $u = (x - t)/e^s$, and the log-density is $\\log p_x(x) = -\\tfrac{1}{2}u^2 - \\tfrac{1}{2}\\log(2\\pi) - s$. The constant $-s = -\\log(\\text{std})$ is the Jacobian term. Points with log-likelihood below the 1st percentile are flagged.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit the flow, score a few values, set a threshold, and test an attack value.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
data = rng.normal(5.0, 2.0, 2000)        # normal traffic ~ N(5,2^2)
m, sd = data.mean(), data.std()
# inverse flow: u = (x - t)/exp(s),  with t=m, exp(s)=sd  => log|du/dx| = -log(sd)
def log_px(x):
    u = (x - m)/sd
    return -0.5*u*u - 0.5*np.log(2*np.pi) - np.log(sd)
for x, name in [(5.0,"typical"), (9.0,"high"), (20.0,"attack")]:
    print(f"x={x:5.1f} ({name:7s}): log p_x = {log_px(x):8.3f}")
thresh = np.percentile(log_px(data), 1)   # 1st-percentile log-likelihood
print("anomaly threshold (1st pctile):", round(float(thresh), 3))
print("x=20 flagged:", log_px(20.0) < thresh)`,
          output: `x=  5.0 (typical): log p_x =   -1.613
x=  9.0 (high   ): log p_x =   -3.668
x= 20.0 (attack ): log p_x =  -29.937
anomaly threshold (1st pctile): -4.891
x=20 flagged: True`
        }
      ],
      conclusion: `A typical value scores $\\log p_x = -1.61$, a high-but-plausible value $-3.67$, and the attack value $-29.94$, far below the $1\\%$ threshold of $-4.89$, so it is flagged. Because the flow yields an exact normalized likelihood (not an approximation like GANs or VAEs), the log-density is a principled, calibrated anomaly score.`
    },
    {
      title: `Sampling and inverting a waveform`,
      domain: `Audio synthesis`,
      question: `WaveGlow-style synthesis samples $u \\sim N(0, I)$ and pushes it through an invertible $g$ to get audio. Because $g$ is invertible, every generated sample can be exactly run back to its base point.`,
      steps: [
        {
          title: `The data`,
          body: `<p>Draw 8 base samples $u \\sim N(0, 1)$. The invertible transform is $x = g(u) = u + 2\\,\\tanh(u)$, monotonic so it has a unique inverse.</p>`
        },
        {
          title: `The math`,
          body: `<p>Generation is forward: $x = g(u)$. Inversion solves $g(u) = x$ for $u$; since $g$ is strictly increasing, a bisection search converges to the unique root. Exact invertibility is what flows guarantee and other generators do not.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Generate a waveform, then invert it back to the base samples.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
sep = 2.0
g    = lambda u: u + sep*np.tanh(u)
# generate by sampling the base and transforming
u = rng.standard_normal(8)
x = g(u)
print("base samples u:", np.round(u, 3))
print("waveform   x  :", np.round(x, 3))
# invert: recover u from x by bisection (g is monotonic so a unique root exists)
def ginv(xv):
    lo, hi = -20.0, 20.0
    for _ in range(60):
        mid = 0.5*(lo+hi)
        if g(mid) < xv: lo = mid
        else: hi = mid
    return 0.5*(lo+hi)
u_rec = np.array([ginv(xv) for xv in x])
print("recovered  u  :", np.round(u_rec, 3))
print("inversion exact:", np.allclose(u, u_rec, atol=1e-6))`,
          output: `base samples u: [ 0.126 -0.132  0.64   0.105 -0.536  0.362  1.304  0.947]
waveform   x  : [ 0.376 -0.395  1.771  0.314 -1.515  1.055  3.029  2.424]
recovered  u  : [ 0.126 -0.132  0.64   0.105 -0.536  0.362  1.304  0.947]
inversion exact: True`
        }
      ],
      conclusion: `Sampling $u \\sim N(0, I)$ and applying $x = g(u)$ produces a waveform; running each sample back through $g^{-1}$ recovers the original $u$ to machine precision ($x = 3.029$ inverts to $u = 1.304$, and so on). That exact two-way map is the defining property of a normalizing flow: generation and likelihood share one invertible function, which is why flows like WaveGlow can synthesize and score audio with the same network.`
    }
  ]

});
