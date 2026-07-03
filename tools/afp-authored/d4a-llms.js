/* =====================================================================
   AFP-AI Learning Guide — Domain 4 · LLMs  (modules M17–M19)
   ---------------------------------------------------------------------
   Authored source for the AFP-AI track. One object per module.
   Generated notebooks are written by tools/gen-afp-notebooks.js.
   ===================================================================== */
"use strict";

const M17 = {
  "m": 17,
  "domain": 4,
  "title": "Transformer basics (attention/self-attention, positional encoding, encoder vs decoder)",
  "tagline": "Use attention to let each token decide which other tokens matter before any generation or ranking happens.",
  "skipIf": "explain self-attention and when to use an encoder vs a decoder.",
  "mapsTo": [
    "all"
  ],
  "connections": {
    "buildsOn": [
      "vectors and dot products",
      "softmax probabilities",
      "matrix multiplication",
      "sequence modeling"
    ],
    "leadsTo": [
      "LLM fundamentals + prompting",
      "RAG & query understanding",
      "semantic retrieval",
      "multimodal creative intelligence"
    ],
    "usedWith": [
      "embeddings",
      "normalization",
      "cross-entropy",
      "causal masking",
      "positional features"
    ]
  },
  "motivation": "<p>You already know how to compare two vectors with a dot product. A transformer repeats that small move at scale: every word, query term, creator skill, or video label asks, <b>which other pieces should I listen to right now?</b> That is the heart of attention, and it is why the same architecture can read ad queries, classify video content, and draft creative suggestions.</p><p>The hard part in language is context. In the phrase 'apple video ad', the token 'apple' should listen differently depending on whether the surrounding tokens suggest fruit, a company, or a device category. Self-attention gives each token a context-aware representation by computing weights over the whole sequence, while positional encodings keep the model from forgetting order.</p>",
  "definition": "<p><b>Definition.</b> Scaled dot-product attention maps queries $Q$, keys $K$, and values $V$ to context vectors by</p><p>$$\\text{Attention}(Q,K,V)=\\text{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d}}\\right)V.$$</p><p>Each query asks a question, each key says what a token offers, and each value is the information copied forward. Self-attention uses the same sequence to produce $Q$, $K$, and $V$. Multi-head attention runs this calculation several times with different learned projections, then concatenates the heads so different relation types can be captured at once.</p><p><b>Architecture choice.</b> An <b>encoder</b> uses bidirectional attention and is best for understanding tasks like query relevance or classification. A <b>decoder</b> uses causal attention and is best for generation because token $t$ cannot see future tokens. An <b>encoder-decoder</b> reads one sequence and generates another, as in translation or grounded summarization.</p>",
  "symbols": [
    {
      "sym": "$Q \\in \\mathbb{R}^{n\\times d}$",
      "desc": "query matrix; one question vector per token."
    },
    {
      "sym": "$K \\in \\mathbb{R}^{n\\times d}$",
      "desc": "key matrix; one address vector per token."
    },
    {
      "sym": "$V \\in \\mathbb{R}^{n\\times d_v}$",
      "desc": "value matrix; content vectors that get averaged by attention weights."
    },
    {
      "sym": "$QK^\\top$",
      "desc": "all query-key similarity scores for the sequence."
    },
    {
      "sym": "$\\sqrt{d}$",
      "desc": "the scaling term that keeps logits from becoming too large as vector dimension grows."
    },
    {
      "sym": "$P_t$",
      "desc": "a positional encoding added to token embeddings so order is visible."
    }
  ],
  "derivation": [
    {
      "do": "Compare every query to every key",
      "result": "$S=QK^\\top$",
      "why": "a row of $S$ holds the raw relevance scores for one token attending to all tokens"
    },
    {
      "do": "Scale the scores",
      "result": "$Z=S/\\sqrt{d}$",
      "why": "without scaling, large dimensions make dot products high-variance and softmax too peaky"
    },
    {
      "do": "Normalize each row",
      "result": "$A=\\text{softmax}(Z)$",
      "why": "each row becomes nonnegative weights that sum to 1"
    },
    {
      "do": "Average the values",
      "result": "$O=AV$",
      "why": "the output token representation is the weighted mix of value vectors"
    },
    {
      "do": "Add order before attention",
      "result": "$x_t=e_t+P_t$",
      "why": "attention alone is permutation-invariant, so position must enter explicitly"
    }
  ],
  "worked": {
    "problem": "Compute one-head attention for the query token in a two-token sequence. Let $q=[1,0]$, keys $k_1=[1,0]$, $k_2=[0,1]$, and values $v_1=[2,0]$, $v_2=[0,4]$ with $d=2$.",
    "skills": [
      "dot products",
      "softmax",
      "weighted averages"
    ],
    "strategy": "Compute one row only: scores, scale, softmax, then value-weighted sum.",
    "steps": [
      {
        "do": "Dot with the first key",
        "result": "$q\\cdot k_1=1$",
        "why": "the query aligns perfectly with the first key"
      },
      {
        "do": "Dot with the second key",
        "result": "$q\\cdot k_2=0$",
        "why": "the query is orthogonal to the second key"
      },
      {
        "do": "Scale the logits",
        "result": "$[1,0]/\\sqrt{2}=[0.707,0]$",
        "why": "attention uses scaled scores before softmax"
      },
      {
        "do": "Apply softmax",
        "result": "$a\u0007pprox[0.670,0.330]$",
        "why": "$e^{0.707}/(e^{0.707}+1)\u0007pprox0.670$"
      },
      {
        "do": "Average the values",
        "result": "$0.670[2,0]+0.330[0,4]=[1.340,1.320]$",
        "why": "the output carries mostly token 1 with some token 2 context"
      }
    ],
    "verify": "The attention weights sum to $0.670+0.330=1.000$, and the output lies between the two value vectors coordinate-wise.",
    "answer": "The one-head attention output for this query is approximately $[1.34,1.32]$.",
    "connects": "self-attention is just normalized similarity followed by a weighted average of information vectors."
  },
  "practice": [
    {
      "problem": "With $q=[0,1]$, the same keys, and the same values, compute the attention output.",
      "steps": [
        {
          "do": "Compute raw scores",
          "result": "$[q\\cdot k_1,q\\cdot k_2]=[0,1]$",
          "why": "the query now matches the second key"
        },
        {
          "do": "Scale scores",
          "result": "$[0,1]/\\sqrt{2}=[0,0.707]$",
          "why": "dimension is still $d=2$"
        },
        {
          "do": "Softmax",
          "result": "$a\u0007pprox[0.330,0.670]$",
          "why": "the second token receives the larger weight"
        },
        {
          "do": "Average values",
          "result": "$0.330[2,0]+0.670[0,4]=[0.660,2.680]$",
          "why": "weights choose mostly the second value"
        }
      ],
      "answer": "$[0.66,2.68]$ approximately."
    },
    {
      "problem": "A three-token row has scaled logits $[2,1,0]$. Compute the attention weight on the first token.",
      "steps": [
        {
          "do": "Exponentiate",
          "result": "$[e^2,e^1,e^0]=[7.389,2.718,1]$",
          "why": "softmax turns logits into positive scores"
        },
        {
          "do": "Sum scores",
          "result": "$7.389+2.718+1=11.107$",
          "why": "the denominator normalizes the row"
        },
        {
          "do": "Divide",
          "result": "$7.389/11.107=0.665$",
          "why": "this is the first attention weight"
        }
      ],
      "answer": "About $0.665$."
    },
    {
      "problem": "Why does a decoder mask future tokens when generating the phrase 'search ads relevance'?",
      "steps": [
        {
          "do": "Name the prediction",
          "result": "when predicting 'ads', the model has seen 'search' only",
          "why": "autoregressive generation predicts the next token from the past"
        },
        {
          "do": "Apply the mask",
          "result": "attention from the 'ads' position to 'relevance' is set to $-\\infty$ before softmax",
          "why": "future tokens must not leak into training"
        },
        {
          "do": "Read the effect",
          "result": "softmax gives future positions weight 0",
          "why": "the decoder learns the same condition it will face at serving time"
        }
      ],
      "answer": "The causal mask prevents label leakage from future tokens."
    },
    {
      "problem": "A token embedding is $[0.2,0.5]$ and its positional encoding is $[0.1,-0.2]$. What vector enters attention?",
      "steps": [
        {
          "do": "Write the addition",
          "result": "$x_t=e_t+P_t$",
          "why": "position is injected before attention"
        },
        {
          "do": "Add coordinate 1",
          "result": "$0.2+0.1=0.3$",
          "why": "add matching coordinates"
        },
        {
          "do": "Add coordinate 2",
          "result": "$0.5-0.2=0.3$",
          "why": "the second coordinate also combines token and position"
        }
      ],
      "answer": "$[0.3,0.3]$."
    },
    {
      "problem": "For query relevance classification, should you start with an encoder or decoder, and why?",
      "steps": [
        {
          "do": "Identify the task",
          "result": "score a complete query-ad pair",
          "why": "classification needs understanding of all input tokens"
        },
        {
          "do": "Choose attention visibility",
          "result": "bidirectional attention",
          "why": "each token can use left and right context"
        },
        {
          "do": "Map to architecture",
          "result": "encoder",
          "why": "encoders are built for full-context representations"
        }
      ],
      "answer": "Use an encoder-style model for bidirectional understanding."
    }
  ],
  "applications": [
    {
      "title": "Creator Marketplace AI query understanding",
      "background": "A brand query like 'B2B cybersecurity creators in APAC' needs every token to condition on the others before intent and slots are extracted.",
      "numbers": "With 6 query tokens and 4 heads, self-attention computes $4\\times6\\times6=144$ pair scores. If the 'APAC' token gives weights $[0.05,0.10,0.15,0.20,0.40,0.10]$, then 40% of its context comes from the geography token it most trusts."
    },
    {
      "title": "Search Ads query relevance",
      "background": "An encoder can read the full query and ad text together before producing a relevance score, which is safer than generating text when the output is a label.",
      "numbers": "A 12-token query-ad pair has $12^2=144$ attention positions per head. With 8 heads, one layer has $1,152$ attention weights before value averaging."
    },
    {
      "title": "Creative Intelligence prompt improvements",
      "background": "When a GenAI assistant rewrites ad copy, decoder attention lets the next word depend on previous words while preventing future leakage.",
      "numbers": "For a 20-token draft, causal masking keeps $20\\times21/2=210$ visible positions instead of $20^2=400$, so 190 future positions receive zero weight."
    },
    {
      "title": "Instream Ads content classification",
      "background": "A video transcript encoder can let 'recipe' attend to 'knife', 'pan', and '30 minutes' before classifying content safety or topic.",
      "numbers": "If transcript chunks are truncated from 600 to 256 tokens, attention pairs drop from $600^2=360,000$ to $256^2=65,536$, a 5.49x reduction."
    },
    {
      "title": "Multi-head skill matching",
      "background": "Creator matching benefits when one head follows industry terms and another follows audience signals.",
      "numbers": "With model width 64 and 4 heads, each head often works in $64/4=16$ dimensions; four 16-dimensional views are concatenated back to 64 dimensions."
    },
    {
      "title": "Latency planning for semantic search rerankers",
      "background": "Transformer cost grows quadratically with sequence length, so token budgets directly affect ads serving latency.",
      "numbers": "Doubling a reranker input from 128 to 256 tokens makes attention pairs grow from $16,384$ to $65,536$, exactly 4x."
    }
  ],
  "applicationsClose": "<p>Attention is a small computation with a large footprint: compare, normalize, average. Whether the team is understanding a creator query, judging search-ad relevance, improving prompts, or classifying Instream content, the same mechanism decides which context should travel forward.</p>",
  "takeaways": [
    "Scaled dot-product attention is $\\text{softmax}(QK^\\top/\\sqrt{d})V$: similarities become weights, then weights average values.",
    "Self-attention needs positional information because dot-product attention by itself does not know token order.",
    "Use encoders for understanding, decoders for generation, and encoder-decoders when one sequence conditions another."
  ],
  "resources": [
    {
      "label": "The Illustrated Transformer (Jay Alammar)",
      "note": "the canonical visual walkthrough"
    },
    {
      "label": "Karpathy — Let's build GPT",
      "note": "attention coded from scratch"
    },
    {
      "label": "d2l.ai — attention mechanisms",
      "note": "math + code"
    }
  ],
  "papers": [
    "Attention Is All You Need (Vaswani et al., 2017)",
    "BERT (Devlin et al., 2019)",
    "FlashAttention (Dao et al., 2022)"
  ],
  "notebook": [
    {
      "t": "md",
      "src": "# M17 · Transformer basics\n\nCurriculum · Domain 4 · LLMs\n\n**Use attention to let each token decide which other tokens matter.**\n\nIn this notebook we implement scaled dot-product attention from scratch with NumPy. The core formula is\n\n$$\\text{softmax}(QK^\\top/\\sqrt{d})V$$\n\nNo model weights, downloads, or GPUs are needed."
    },
    {
      "t": "code",
      "src": "import numpy as np\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(17)"
    },
    {
      "t": "md",
      "src": "## Tiny token embeddings\n\nWe pretend three ads/query tokens already have 4-dimensional embeddings. A real transformer learns projections into queries, keys, and values; here we choose small deterministic matrices so the math is visible."
    },
    {
      "t": "code",
      "src": "tokens = [\"search\", \"ads\", \"relevance\"]\nX = np.array([\n    [1.0, 0.2, 0.0, 0.1],\n    [0.9, 0.1, 0.3, 0.0],\n    [0.0, 0.1, 1.0, 0.2],\n])\n\nW_q = np.array([\n    [1.0, 0.0],\n    [0.0, 1.0],\n    [0.5, 0.0],\n    [0.0, 0.5],\n])\nW_k = np.array([\n    [1.0, 0.0],\n    [0.0, 1.0],\n    [0.4, 0.0],\n    [0.0, 0.4],\n])\nW_v = np.array([\n    [1.0, 0.0],\n    [0.0, 1.0],\n    [0.0, 1.0],\n    [1.0, 0.0],\n])\n\nQ = X @ W_q\nK = X @ W_k\nV = X @ W_v\n\nprint(Q)"
    },
    {
      "t": "md",
      "src": "## Step 1 - Scores\n\nFor every token pair, compute $QK^\\top$. A high score means the query vector and key vector point in similar directions."
    },
    {
      "t": "code",
      "src": "scores = Q @ K.T\nscaled_scores = scores / np.sqrt(Q.shape[1])\n\nprint(np.round(scaled_scores, 3))\n\nassert scaled_scores.shape == (3, 3)"
    },
    {
      "t": "md",
      "src": "## Step 2 - Row-wise softmax\n\nSoftmax turns each row into attention weights. Every row sums to 1, so each output vector is a weighted average of value vectors."
    },
    {
      "t": "code",
      "src": "def softmax_rows(z):\n    shifted = z - z.max(axis=1, keepdims=True)\n    exp_z = np.exp(shifted)\n    return exp_z / exp_z.sum(axis=1, keepdims=True)\n\nA = softmax_rows(scaled_scores)\n\nprint(np.round(A, 3))\n\nassert np.allclose(A.sum(axis=1), 1.0)"
    },
    {
      "t": "md",
      "src": "## Step 3 - Weighted values\n\nNow multiply the attention matrix by $V$. Each output row is the context-aware version of the corresponding input token."
    },
    {
      "t": "code",
      "src": "O = A @ V\n\nfor token, vector in zip(tokens, O):\n    print(token, np.round(vector, 3))\n\nassert O.shape == (3, 2)"
    },
    {
      "t": "md",
      "src": "## Add a causal mask\n\nA decoder cannot look into the future. We set future logits to a very negative number before softmax, which makes their weights effectively zero."
    },
    {
      "t": "code",
      "src": "mask = np.triu(np.ones_like(scaled_scores), k=1).astype(bool)\ncausal_scores = scaled_scores.copy()\ncausal_scores[mask] = -1e9\ncausal_A = softmax_rows(causal_scores)\n\nprint(np.round(causal_A, 3))\n\nassert np.allclose(causal_A[mask], 0.0)"
    },
    {
      "t": "md",
      "src": "## Visualize the attention matrix\n\nThe heatmap shows which tokens each token listens to. Rows are listeners; columns are sources of information."
    },
    {
      "t": "code",
      "src": "fig, ax = plt.subplots(figsize=(4, 3))\nim = ax.imshow(A, vmin=0.0, vmax=1.0, cmap=\"Blues\")\nax.set_xticks(range(len(tokens)))\nax.set_yticks(range(len(tokens)))\nax.set_xticklabels(tokens)\nax.set_yticklabels(tokens)\nax.set_title(\"self-attention weights\")\nfig.colorbar(im, ax=ax)\nplt.show()"
    },
    {
      "t": "md",
      "src": "## Practice\n\n1. Change `W_q` so the token `relevance` pays more attention to `ads`.\n2. Increase the sequence to four tokens and confirm the attention matrix becomes $4\\times4$.\n3. Compare encoder attention `A` with decoder attention `causal_A` for the final token."
    },
    {
      "t": "code",
      "src": "# Your turn:\n"
    }
  ]
};

const M18 = {
  "m": 18,
  "domain": 4,
  "title": "LLM fundamentals + prompting",
  "tagline": "Turn text into tokens, tokens into probabilities, and prompts into reliable structured behavior.",
  "skipIf": "explain tokens/context, few-shot prompting, and structured output.",
  "mapsTo": [
    "all"
  ],
  "connections": {
    "buildsOn": [
      "transformer decoder attention",
      "softmax",
      "log loss",
      "probability chains"
    ],
    "leadsTo": [
      "RAG & query understanding",
      "LLM evaluation",
      "agentic workflows",
      "creative generation guardrails"
    ],
    "usedWith": [
      "tokenization",
      "temperature",
      "top-p sampling",
      "few-shot examples",
      "JSON schemas"
    ]
  },
  "motivation": "<p>You have probably written prompts that worked once and failed the next time. That is not magic; it is probability. An LLM repeatedly predicts the next token from the context you gave it, and small choices in wording, examples, temperature, and output format shift that probability distribution.</p><p>For AFP-AI work, prompting is not just chat polish. A Creative Intelligence assistant may need JSON fields for tone and claim type; a Search Ads relevance helper may need a terse reason code; a Creator Marketplace parser may need slots that downstream systems can validate. The goal is to make the model's probability machinery easier to steer and easier to check.</p>",
  "definition": "<p><b>Definition.</b> An autoregressive LLM assigns a sequence probability by multiplying next-token probabilities:</p><p>$$P(x_1,\\ldots,x_T)=\\prod_{t=1}^{T}P(x_t\\mid x_{<t}).$$</p><p>Given logits $z$, the next-token distribution is $p_i=\\frac{\\exp(z_i/\\tau)}{\\sum_j\\exp(z_j/\\tau)}$, where $\\tau$ is temperature. Lower temperature sharpens choices; higher temperature spreads probability mass. Prompting supplies instructions, context, examples, and output constraints that change the conditional distribution without changing model weights.</p><p><b>Prompting choices.</b> Zero-shot prompts rely on instructions only. Few-shot prompts add examples. Structured-output prompts specify keys, types, and fallback behavior, often as JSON, so the answer can be validated by code.</p>",
  "symbols": [
    {
      "sym": "$x_t$",
      "desc": "the token generated or scored at position $t$."
    },
    {
      "sym": "$x_{<t}$",
      "desc": "all previous tokens in the context window."
    },
    {
      "sym": "$z_i$",
      "desc": "the raw logit assigned to candidate token $i$."
    },
    {
      "sym": "$\\tau$",
      "desc": "temperature; a positive number controlling distribution sharpness."
    },
    {
      "sym": "$\\text{PPL}$",
      "desc": "perplexity, $\\exp$ of average negative log probability per token."
    }
  ],
  "derivation": [
    {
      "do": "Start with the chain rule",
      "result": "$P(x_{1:T})=\\prod_t P(x_t\\mid x_{<t})$",
      "why": "autoregressive models predict one token at a time"
    },
    {
      "do": "Convert logits to probabilities",
      "result": "$p_i=\\exp(z_i)/\\sum_j\\exp(z_j)$",
      "why": "softmax makes scores positive and normalized"
    },
    {
      "do": "Insert temperature",
      "result": "$p_i(\\tau)=\\exp(z_i/\\tau)/\\sum_j\\exp(z_j/\\tau)$",
      "why": "dividing by small $\\tau$ magnifies logit differences"
    },
    {
      "do": "Score a sequence",
      "result": "$\\log P=\\sum_t \\log p_t$",
      "why": "products are easier to add in log space"
    },
    {
      "do": "Define perplexity",
      "result": "$\\text{PPL}=\\exp\\left(-\\frac{1}{T}\\sum_t\\log p_t\\right)$",
      "why": "it is the effective average branching factor"
    }
  ],
  "worked": {
    "problem": "A tiny next-token vocabulary has logits for {relevant, broad, unsafe} equal to $[2,1,0]$. Compute softmax at temperature $1$, then sequence perplexity for two observed tokens with probabilities $0.70$ and $0.50$.",
    "skills": [
      "softmax",
      "temperature",
      "log probability",
      "perplexity"
    ],
    "strategy": "Normalize logits first; then use log probabilities so the sequence calculation is additive.",
    "steps": [
      {
        "do": "Exponentiate logits",
        "result": "$[e^2,e^1,e^0]=[7.389,2.718,1]$",
        "why": "softmax works with positive scores"
      },
      {
        "do": "Sum exponentials",
        "result": "$7.389+2.718+1=11.107$",
        "why": "this is the normalizer"
      },
      {
        "do": "Divide each score",
        "result": "$p\u0007pprox[0.665,0.245,0.090]$",
        "why": "probabilities sum to 1"
      },
      {
        "do": "Add log probabilities",
        "result": "$\\log P=\\log0.70+\\log0.50=-1.050$",
        "why": "the sequence probability is the product in log space"
      },
      {
        "do": "Compute perplexity",
        "result": "$\\exp(1.050/2)=1.690$",
        "why": "average negative log probability is $0.525$"
      }
    ],
    "verify": "The most likely token is 'relevant' because it had the largest logit, and perplexity $1.69$ is between a certain one-choice model and a uniform three-choice model.",
    "answer": "Softmax is about $[0.665,0.245,0.090]$; the two-token perplexity is about $1.69$.",
    "connects": "prompting changes the context, which changes these next-token probabilities."
  },
  "practice": [
    {
      "problem": "For logits $[2,1,0]$, compute the first-token probability at temperature $0.5$.",
      "steps": [
        {
          "do": "Divide by temperature",
          "result": "$[2,1,0]/0.5=[4,2,0]$",
          "why": "lower temperature sharpens differences"
        },
        {
          "do": "Exponentiate",
          "result": "$[e^4,e^2,e^0]=[54.598,7.389,1]$",
          "why": "softmax uses positive scores"
        },
        {
          "do": "Normalize first token",
          "result": "$54.598/(54.598+7.389+1)=0.867$",
          "why": "the top token becomes more likely"
        }
      ],
      "answer": "About $0.867$."
    },
    {
      "problem": "For logits $[2,1,0]$, compute the first-token probability at temperature $2$.",
      "steps": [
        {
          "do": "Divide by temperature",
          "result": "$[2,1,0]/2=[1,0.5,0]$",
          "why": "higher temperature flattens differences"
        },
        {
          "do": "Exponentiate",
          "result": "$[2.718,1.649,1]$",
          "why": "scores are closer together"
        },
        {
          "do": "Normalize first token",
          "result": "$2.718/(2.718+1.649+1)=0.506$",
          "why": "the top token is less dominant"
        }
      ],
      "answer": "About $0.506$ for the first token at temperature $2$."
    },
    {
      "problem": "A three-token answer has probabilities $[0.8,0.5,0.25]$. Compute its sequence probability.",
      "steps": [
        {
          "do": "Multiply the first two",
          "result": "$0.8\\times0.5=0.4$",
          "why": "sequence probability multiplies conditional probabilities"
        },
        {
          "do": "Multiply the third",
          "result": "$0.4\\times0.25=0.1$",
          "why": "include every generated token"
        }
      ],
      "answer": "The sequence probability is $0.10$."
    },
    {
      "problem": "The same answer has average negative log probability $0.7$. Compute perplexity.",
      "steps": [
        {
          "do": "Write the formula",
          "result": "$\\text{PPL}=\\exp(0.7)$",
          "why": "perplexity exponentiates average negative log probability"
        },
        {
          "do": "Evaluate",
          "result": "$\\exp(0.7)=2.014$",
          "why": "this is the effective branching factor"
        }
      ],
      "answer": "Perplexity is about $2.01$."
    },
    {
      "problem": "You need an LLM to return `intent`, `industry`, and `geo` for a creator search. What prompt style should you use?",
      "steps": [
        {
          "do": "Name the need",
          "result": "machine-validated fields",
          "why": "downstream systems need predictable keys"
        },
        {
          "do": "Choose examples",
          "result": "few-shot structured JSON",
          "why": "examples teach both the task and format"
        },
        {
          "do": "Add fallback",
          "result": "return low confidence or missing slots when ambiguous",
          "why": "guardrails are part of reliable prompting"
        }
      ],
      "answer": "Use a few-shot structured-output prompt with a JSON schema and fallback rule."
    }
  ],
  "applications": [
    {
      "title": "Creative Intelligence GenAI prompt improvements",
      "background": "Prompt templates can steer creative rewrites toward policy-safe, brand-specific variants while returning structured fields for review.",
      "numbers": "If a rewrite prompt lowers manual rejection from 18% to 12% on 2,000 drafts, rejected drafts fall from 360 to 240, saving 120 reviews."
    },
    {
      "title": "Creator Marketplace AI structured brief parsing",
      "background": "A few-shot prompt can parse 'tech creators in Germany for B2B security' into slots before retrieval.",
      "numbers": "If 92 of 100 parsed briefs have valid JSON and 86 have correct slots, format success is 92% and end-to-end exact slot accuracy is 86%."
    },
    {
      "title": "Search Ads reason-code generation",
      "background": "An LLM can explain why a query-ad pair is relevant, but the prompt should force a short enum-like reason to avoid free-form drift.",
      "numbers": "With 5 allowed reason codes, uniform perplexity would be 5. A model assigning 0.70 to the correct code has one-step perplexity $1/0.70=1.43$."
    },
    {
      "title": "Instream Ads content classification assistance",
      "background": "A prompt can ask for a topic label plus evidence span from a transcript, making human review faster.",
      "numbers": "If top-1 label accuracy is 78% and evidence-span accuracy among correct labels is 90%, both-correct rate is $0.78\\times0.90=70.2\\%$."
    },
    {
      "title": "Temperature for creative exploration",
      "background": "Copy brainstorming benefits from higher temperature, while final structured outputs usually need lower temperature.",
      "numbers": "For logits $[3,2,1]$, top-token probability is 0.665 at $\\tau=1$ and about 0.867 at $\\tau=0.5$, so low temperature cuts variety."
    },
    {
      "title": "Context-window budgeting",
      "background": "Prompt examples are useful but consume space that could hold user context or retrieved evidence.",
      "numbers": "In a 4,000-token budget, a 600-token system prompt and four 250-token examples leave $4,000-600-1,000=2,400$ tokens for user input and output."
    }
  ],
  "applicationsClose": "<p>LLMs are probability engines wrapped in product choices. Once you can read logits, temperature, context, examples, and JSON constraints as levers on the same next-token distribution, prompting becomes an engineering discipline rather than a guessing game.</p>",
  "takeaways": [
    "Autoregressive LLMs multiply next-token probabilities across the sequence.",
    "Temperature and top-p change sampling behavior; prompting changes the conditional context the model sees.",
    "Few-shot and structured-output prompts are essential when AFP-AI outputs must be parsed, validated, and audited."
  ],
  "resources": [
    {
      "label": "HuggingFace — LLM course",
      "note": "tokens, sampling, generation"
    },
    {
      "label": "DeepLearning.AI — ChatGPT Prompt Engineering",
      "note": "few-shot, structure, guardrails"
    }
  ],
  "papers": [
    "GPT-3 / Language Models are Few-Shot Learners (Brown et al., 2020)",
    "Chain-of-Thought Prompting (Wei et al., 2022)",
    "InstructGPT (Ouyang et al., 2022)"
  ],
  "notebook": [
    {
      "t": "md",
      "src": "# M18 · LLM fundamentals + prompting\n\nCurriculum · Domain 4 · LLMs\n\n**Turn tokens into probabilities and prompts into reliable structured behavior.**\n\nWe simulate a tiny language model with NumPy. The core probability is\n\n$$P(x_1,\\ldots,x_T)=\\prod_t P(x_t\\mid x_{<t})$$\n\nand perplexity is $\\exp$ of average negative log probability."
    },
    {
      "t": "code",
      "src": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(18)"
    },
    {
      "t": "md",
      "src": "## A toy tokenizer\n\nReal tokenizers split text into subwords. Here we lowercase and split on spaces so we can focus on probability mechanics."
    },
    {
      "t": "code",
      "src": "vocab = [\"return\", \"relevant\", \"broad\", \"unsafe\", \"json\", \"fallback\"]\ntoken_to_id = {token: idx for idx, token in enumerate(vocab)}\n\ndef tokenize(text):\n    cleaned = text.lower().replace(\",\", \"\")\n    return cleaned.split()\n\nprompt = \"Return json fallback\"\ntokens = tokenize(prompt)\nids = [token_to_id[token] for token in tokens]\n\nprint(tokens)\nprint(ids)\n\nassert ids == [0, 4, 5]"
    },
    {
      "t": "md",
      "src": "## Softmax and temperature\n\nA model emits logits. Temperature computes $\\text{softmax}(z/\\tau)$, so smaller $\\tau$ makes the largest logit more dominant."
    },
    {
      "t": "code",
      "src": "def softmax(logits):\n    shifted = logits - np.max(logits)\n    exp_logits = np.exp(shifted)\n    return exp_logits / exp_logits.sum()\n\nlogits = np.array([0.2, 2.0, 1.0, 0.0, -0.5, -1.0])\nprobs_t1 = softmax(logits / 1.0)\nprobs_t05 = softmax(logits / 0.5)\nprobs_t2 = softmax(logits / 2.0)\n\nprint(np.round(probs_t1, 3))\nprint(np.round(probs_t05, 3))\nprint(np.round(probs_t2, 3))\n\nassert probs_t05[1] > probs_t1[1]"
    },
    {
      "t": "md",
      "src": "## Sequence probability and perplexity\n\nIf a target answer has token probabilities $0.7$, $0.5$, and $0.25$, the sequence probability is their product. Perplexity converts average log loss back to an intuitive effective branching factor."
    },
    {
      "t": "code",
      "src": "target_probs = np.array([0.7, 0.5, 0.25])\nsequence_probability = np.prod(target_probs)\nnegative_log_likelihood = -np.sum(np.log(target_probs))\nperplexity = np.exp(negative_log_likelihood / len(target_probs))\n\nprint(\"sequence probability\", round(sequence_probability, 4))\nprint(\"perplexity\", round(perplexity, 3))\n\nassert np.isclose(sequence_probability, 0.0875)"
    },
    {
      "t": "md",
      "src": "## Tiny structured-output scorer\n\nWe simulate prompting by adding a bias to logits when the prompt asks for JSON. This is not a real LLM; it is a transparent way to see how instructions can make structured tokens more likely."
    },
    {
      "t": "code",
      "src": "base_logits = np.array([0.1, 1.5, 1.0, 0.2, 0.0, -0.5])\njson_bias = np.array([0.0, 0.0, 0.0, 0.0, 2.0, 1.0])\nplain_probs = softmax(base_logits)\nstructured_probs = softmax(base_logits + json_bias)\n\nsummary = pd.DataFrame({\n    \"token\": vocab,\n    \"plain\": plain_probs,\n    \"structured\": structured_probs,\n})\n\nprint(summary.round(3))\n\nassert structured_probs[token_to_id[\"json\"]] > plain_probs[token_to_id[\"json\"]]"
    },
    {
      "t": "md",
      "src": "## Top-p filtering\n\nTop-p sampling keeps the smallest set of tokens whose cumulative probability reaches $p$. It trims the long tail while preserving some variety."
    },
    {
      "t": "code",
      "src": "def top_p_keep(probs, p):\n    order = np.argsort(probs)[::-1]\n    cumulative = np.cumsum(probs[order])\n    keep_sorted = cumulative <= p\n    keep_sorted[0] = True\n    first_over = np.argmax(cumulative >= p)\n    keep_sorted[:first_over + 1] = True\n    keep = np.zeros_like(probs, dtype=bool)\n    keep[order[keep_sorted]] = True\n    return keep\n\nkeep = top_p_keep(probs_t1, 0.8)\n\nprint([token for token, flag in zip(vocab, keep) if flag])\n\nassert keep.sum() >= 1"
    },
    {
      "t": "md",
      "src": "## Visualize temperature\n\nThe same logits become sharper or flatter as temperature changes."
    },
    {
      "t": "code",
      "src": "x = np.arange(len(vocab))\nfig, ax = plt.subplots(figsize=(6, 3))\nax.plot(x, probs_t05, marker=\"o\", label=\"tau=0.5\")\nax.plot(x, probs_t1, marker=\"o\", label=\"tau=1\")\nax.plot(x, probs_t2, marker=\"o\", label=\"tau=2\")\nax.set_xticks(x)\nax.set_xticklabels(vocab, rotation=25)\nax.set_ylabel(\"probability\")\nax.set_title(\"temperature changes next-token probabilities\")\nax.legend()\nplt.show()"
    },
    {
      "t": "md",
      "src": "## Practice\n\n1. Change the JSON bias and observe when `fallback` becomes more likely than `json`.\n2. Try top-p values 0.5, 0.8, and 0.95.\n3. Create a three-example few-shot prompt as a Python list of dictionaries and count its tokens."
    },
    {
      "t": "code",
      "src": "# Your turn:\n"
    }
  ]
};

const M19 = {
  "m": 19,
  "domain": 4,
  "title": "RAG & query understanding (NL→structured)",
  "tagline": "Ground generation in retrieved evidence, then parse natural language into structured decisions with a fallback.",
  "skipIf": "build retrieval-grounded query interpretation with a low-confidence fallback.",
  "mapsTo": [
    "all"
  ],
  "connections": {
    "buildsOn": [
      "embeddings",
      "cosine similarity",
      "LLM prompting",
      "classification thresholds"
    ],
    "leadsTo": [
      "agentic search experiences",
      "grounded creative assistants",
      "retrieval evaluation",
      "production guardrails"
    ],
    "usedWith": [
      "chunking",
      "reranking",
      "citations",
      "slot filling",
      "confidence calibration"
    ]
  },
  "motivation": "<p>An LLM can sound confident even when it is missing product facts. RAG changes the job: first retrieve relevant evidence, then ask the model to answer from that evidence, and fall back when retrieval is weak. This is how we keep language interfaces useful without asking them to memorize every campaign rule, creator taxonomy, or policy detail.</p><p>Query understanding adds one more production step. A Creator Marketplace search such as 'enterprise AI creators in Canada with security audience' must become structured intent and slots before retrieval, ranking, and filters can work. The safest system measures confidence and chooses answer-versus-fallback deliberately.</p>",
  "definition": "<p><b>Definition.</b> Retrieval-augmented generation uses a pipeline</p><p>$$\\text{query} \\to \\text{retrieve}(k) \\to \\text{augment prompt with evidence} \\to \\text{generate grounded answer}.$$</p><p>Dense retrieval commonly scores a query embedding $q$ and chunk embedding $c_i$ by cosine similarity $s_i=\\frac{q^\\top c_i}{\\|q\\|\\|c_i\\|}$. A reranker may rescore the top candidates. For natural-language to structured parsing, the system predicts intent, slots, and a confidence score; if confidence is below threshold $\\gamma$, it returns a fallback rather than a brittle interpretation.</p>",
  "symbols": [
    {
      "sym": "$q$",
      "desc": "query embedding or parsed query representation."
    },
    {
      "sym": "$c_i$",
      "desc": "embedding for retrieved chunk $i$."
    },
    {
      "sym": "$s_i$",
      "desc": "retrieval score, often cosine similarity."
    },
    {
      "sym": "$k$",
      "desc": "number of chunks retrieved before augmentation or reranking."
    },
    {
      "sym": "$\\gamma$",
      "desc": "confidence threshold for answering instead of falling back."
    },
    {
      "sym": "$\\text{recall@}k$",
      "desc": "fraction of questions whose needed evidence appears in the top $k$."
    }
  ],
  "derivation": [
    {
      "do": "Embed the query and chunks",
      "result": "$q,c_1,\\ldots,c_n$",
      "why": "retrieval needs comparable vectors"
    },
    {
      "do": "Score each chunk",
      "result": "$s_i=q^\\top c_i/(\\|q\\|\\|c_i\\|)$",
      "why": "cosine compares direction rather than raw length"
    },
    {
      "do": "Select top evidence",
      "result": "$\\text{top-}k=\\operatorname{argsort}(s)[:k]$",
      "why": "only the strongest chunks enter the prompt"
    },
    {
      "do": "Estimate confidence",
      "result": "$\\hat{p}=\\max_i s_i$ or calibrated reranker probability",
      "why": "the system needs a scalar answer-versus-fallback signal"
    },
    {
      "do": "Apply threshold",
      "result": "answer if $\\hat{p}\\ge\\gamma$, otherwise fallback",
      "why": "low-confidence retrieval should not be turned into confident prose"
    }
  ],
  "worked": {
    "problem": "A Creator Marketplace query vector is $q=[1,0]$. Three chunks have embeddings $c_1=[0.8,0.6]$ for 'B2B security creators', $c_2=[0.3,0.954]$ for 'fitness creators', and $c_3=[0.6,0.8]$ for 'Canada enterprise AI'. Use cosine scores and threshold $\\gamma=0.75$ to decide answer versus fallback.",
    "skills": [
      "cosine similarity",
      "top-k retrieval",
      "thresholding"
    ],
    "strategy": "Normalize each chunk score against the query, then compare the best score to the threshold.",
    "steps": [
      {
        "do": "Compute score for chunk 1",
        "result": "$s_1=(1\\times0.8+0\\times0.6)/(1\\times1)=0.8$",
        "why": "$c_1$ already has norm 1"
      },
      {
        "do": "Compute score for chunk 2",
        "result": "$s_2=0.3$",
        "why": "only the first coordinate aligns with $q$"
      },
      {
        "do": "Compute score for chunk 3",
        "result": "$s_3=0.6$",
        "why": "chunk 3 is partly aligned"
      },
      {
        "do": "Rank chunks",
        "result": "$c_1$ first, then $c_3$, then $c_2$",
        "why": "$0.8>0.6>0.3$"
      },
      {
        "do": "Apply threshold",
        "result": "$0.8\\ge0.75$",
        "why": "the best retrieved evidence is strong enough to answer"
      }
    ],
    "verify": "The selected chunk is semantically plausible because 'B2B security creators' matches the query intent better than fitness.",
    "answer": "Retrieve chunk 1 and answer with citation; do not fallback because confidence $0.8$ clears $0.75$.",
    "connects": "RAG is a retrieval decision plus a grounded generation decision, not generation alone."
  },
  "practice": [
    {
      "problem": "If the threshold rises to $0.85$ with the same scores $[0.8,0.3,0.6]$, what happens?",
      "steps": [
        {
          "do": "Find the best score",
          "result": "$\\max s=0.8$",
          "why": "confidence comes from the strongest chunk in this simple rule"
        },
        {
          "do": "Compare to threshold",
          "result": "$0.8<0.85$",
          "why": "the evidence is below the new bar"
        },
        {
          "do": "Choose action",
          "result": "fallback",
          "why": "a weak retrieval should not produce a confident answer"
        }
      ],
      "answer": "Return the low-confidence fallback."
    },
    {
      "problem": "A query retrieves relevant evidence at ranks 1, 4, and 8 out of 10. Compute recall@5 if there are 3 relevant chunks total.",
      "steps": [
        {
          "do": "Count relevant chunks in top 5",
          "result": "2",
          "why": "ranks 1 and 4 are included, rank 8 is not"
        },
        {
          "do": "Divide by total relevant",
          "result": "$2/3=0.667$",
          "why": "recall@5 measures coverage of needed evidence"
        }
      ],
      "answer": "Recall@5 is about $0.667$."
    },
    {
      "problem": "A parser outputs intent score 0.72 and slot completeness 0.80. If confidence is their product and $\\gamma=0.60$, answer or fallback?",
      "steps": [
        {
          "do": "Multiply components",
          "result": "$0.72\\times0.80=0.576$",
          "why": "the rule penalizes either weak intent or missing slots"
        },
        {
          "do": "Compare threshold",
          "result": "$0.576<0.60$",
          "why": "confidence is just below the bar"
        },
        {
          "do": "Choose action",
          "result": "fallback",
          "why": "ask for clarification rather than over-parse"
        }
      ],
      "answer": "Fallback."
    },
    {
      "problem": "Two chunks have cosine scores 0.74 and 0.73. Why might a reranker still be useful?",
      "steps": [
        {
          "do": "Read the margin",
          "result": "$0.74-0.73=0.01$",
          "why": "the dense retriever is nearly tied"
        },
        {
          "do": "Name the risk",
          "result": "top choice may be unstable",
          "why": "small score gaps are sensitive to embedding noise"
        },
        {
          "do": "Use reranking",
          "result": "rescore top chunks with richer features",
          "why": "a cross-encoder or rules can inspect exact terms and slots"
        }
      ],
      "answer": "Use a reranker because the retrieval margin is only 0.01."
    },
    {
      "problem": "Parse 'AI creators in Canada for finance CMOs' into three slots.",
      "steps": [
        {
          "do": "Find topic",
          "result": "AI",
          "why": "the content theme is explicit"
        },
        {
          "do": "Find geography",
          "result": "Canada",
          "why": "the location slot follows 'in'"
        },
        {
          "do": "Find audience",
          "result": "finance CMOs",
          "why": "the target audience follows 'for'"
        }
      ],
      "answer": "`{topic: 'AI', geo: 'Canada', audience: 'finance CMOs'}`."
    }
  ],
  "applications": [
    {
      "title": "Creator Marketplace AI query understanding + semantic search",
      "background": "Natural-language briefs become structured slots and an embedding query before semantic retrieval finds matching creators.",
      "numbers": "If 1,000 queries have 900 with correct intent and 810 with all slots correct, intent accuracy is 90% and strict parse accuracy is 81%. A threshold that falls back on 120 uncertain queries leaves 880 automated parses."
    },
    {
      "title": "Search Ads query relevance grounding",
      "background": "Retrieved policy and landing-page evidence can ground why an ad is relevant or irrelevant to a search query.",
      "numbers": "For 500 judged queries, if needed evidence appears in top 3 for 410, recall@3 is $410/500=82\\%$. Improving to 440 raises recall by 6 percentage points."
    },
    {
      "title": "Creative Intelligence GenAI prompt improvements",
      "background": "RAG can inject brand guidelines and previous high-performing claims into a copy-improvement prompt.",
      "numbers": "With 6 retrieved examples averaging 120 tokens, augmentation uses $6\\times120=720$ tokens. In a 4,000-token context, that leaves 3,280 tokens for instructions, user input, and output."
    },
    {
      "title": "Instream Ads content classification evidence",
      "background": "A content classifier can retrieve transcript chunks that justify a topic label before handing the case to review.",
      "numbers": "If top-5 retrieval contains the decisive transcript span in 460 of 500 videos, evidence recall@5 is 92%. If classification accuracy is 88%, both correct is roughly $0.92\\times0.88=80.96\\%$."
    },
    {
      "title": "Low-confidence fallback for member trust",
      "background": "When retrieval is weak, asking a clarifying question is better than inventing a creator filter or policy explanation.",
      "numbers": "At threshold 0.70, suppose 760 of 1,000 queries answer with 95% correctness and 240 fallback. Automated correct answers are $760\\times0.95=722$; lowering the threshold to answer 900 at 88% gives 792 correct but 108 wrong instead of 38 wrong."
    },
    {
      "title": "Reranking budget",
      "background": "Dense retrieval is fast for thousands of chunks; reranking only the top candidates gives quality without scoring everything expensively.",
      "numbers": "If dense retrieval scans 10,000 chunks and reranks top 50, the reranker sees $50/10,000=0.5\\%$ of the corpus per query."
    }
  ],
  "applicationsClose": "<p>RAG makes language systems accountable to evidence, and query understanding makes natural language usable by structured ads systems. The transferable move is simple: retrieve what you can cite, parse what you can validate, and fallback when the confidence math says the system is guessing.</p>",
  "takeaways": [
    "RAG follows retrieve, augment, generate; the generated answer should be grounded in cited chunks.",
    "Cosine similarity and reranking turn a natural-language request into ranked evidence.",
    "NL-to-structured systems need confidence thresholds and fallbacks because a bad parse can be worse than no parse."
  ],
  "resources": [
    {
      "label": "DeepLearning.AI — Advanced RAG",
      "note": "retrieval, reranking, grounding"
    },
    {
      "label": "LlamaIndex docs",
      "note": "RAG pipelines"
    },
    {
      "label": "Pinecone — RAG guide",
      "note": "chunking, embeddings, retrieval"
    }
  ],
  "papers": [
    "Retrieval-Augmented Generation (Lewis et al., 2020)",
    "Dense Passage Retrieval (Karpukhin et al., 2020)"
  ],
  "notebook": [
    {
      "t": "md",
      "src": "# M19 · RAG & query understanding\n\nCurriculum · Domain 4 · LLMs\n\n**Ground answers in retrieved evidence, then fallback when confidence is low.**\n\nWe build a tiny retrieval pipeline and slot parser. Retrieval uses cosine similarity\n\n$$s_i=\\frac{q^\\top c_i}{\\|q\\|\\|c_i\\|}$$\n\nso all numbers are inspectable."
    },
    {
      "t": "code",
      "src": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.feature_extraction.text import TfidfVectorizer\n\nrng = np.random.default_rng(19)"
    },
    {
      "t": "md",
      "src": "## A tiny evidence corpus\n\nEach chunk is a short piece of product knowledge we might cite for Creator Marketplace or ads relevance."
    },
    {
      "t": "code",
      "src": "chunks = [\n    \"B2B cybersecurity creators often discuss enterprise risk compliance and cloud security\",\n    \"Canada finance executives respond to creators with regional market expertise\",\n    \"Fitness creators focus on workouts nutrition and consumer wellness\",\n    \"Search ads relevance depends on query intent landing page match and policy safety\",\n    \"Creative intelligence prompts improve headlines with brand claims and evidence\",\n]\n\nquery = \"enterprise security creators in Canada for finance audience\"\n\nvectorizer = TfidfVectorizer()\nX = vectorizer.fit_transform(chunks + [query]).toarray()\nchunk_vecs = X[:-1]\nquery_vec = X[-1]\n\nprint(chunk_vecs.shape)\n\nassert chunk_vecs.shape[0] == len(chunks)"
    },
    {
      "t": "md",
      "src": "## Cosine retrieval\n\nWe normalize vectors and score every chunk against the query. Higher cosine means the chunk points in a more similar direction."
    },
    {
      "t": "code",
      "src": "def normalize_rows(matrix):\n    norms = np.linalg.norm(matrix, axis=1, keepdims=True)\n    return matrix / np.maximum(norms, 1e-12)\n\nchunk_unit = normalize_rows(chunk_vecs)\nquery_unit = query_vec / max(np.linalg.norm(query_vec), 1e-12)\nscores = chunk_unit @ query_unit\nranked = np.argsort(scores)[::-1]\n\nfor idx in ranked:\n    print(round(scores[idx], 3), chunks[idx])\n\nassert scores[ranked[0]] >= scores[ranked[1]]"
    },
    {
      "t": "md",
      "src": "## Confidence threshold\n\nA RAG system should not answer just because it found something. We compare the best score to a threshold $\\gamma$ and fallback if retrieval is weak."
    },
    {
      "t": "code",
      "src": "gamma = 0.20\nbest_idx = ranked[0]\nbest_score = scores[best_idx]\nshould_answer = best_score >= gamma\n\nprint(\"best score\", round(best_score, 3))\nprint(\"answer?\", should_answer)\n\nassert should_answer"
    },
    {
      "t": "md",
      "src": "## Simple NL to structured slots\n\nThis parser is intentionally small. Production systems use learned parsers and validation, but the shape is the same: intent, slots, confidence, fallback."
    },
    {
      "t": "code",
      "src": "def parse_creator_query(text):\n    lower = text.lower()\n    topic = \"security\" if \"security\" in lower else None\n    geo = \"Canada\" if \"canada\" in lower else None\n    audience = \"finance\" if \"finance\" in lower else None\n    filled = sum(value is not None for value in [topic, geo, audience])\n    confidence = filled / 3.0\n    return {\n        \"intent\": \"creator_search\",\n        \"topic\": topic,\n        \"geo\": geo,\n        \"audience\": audience,\n        \"confidence\": confidence,\n    }\n\nparsed = parse_creator_query(query)\n\nprint(parsed)\n\nassert parsed[\"confidence\"] == 1.0"
    },
    {
      "t": "md",
      "src": "## Combine retrieval and parsing\n\nA robust answer needs both enough evidence and enough parsing confidence."
    },
    {
      "t": "code",
      "src": "parse_threshold = 0.75\nretrieval_ok = best_score >= gamma\nparse_ok = parsed[\"confidence\"] >= parse_threshold\naction = \"answer_with_citation\" if retrieval_ok and parse_ok else \"fallback\"\n\nprint(action)\nprint(\"citation:\", chunks[best_idx])\n\nassert action == \"answer_with_citation\""
    },
    {
      "t": "md",
      "src": "## Evaluate recall@k\n\nSuppose chunks 0 and 1 are the relevant evidence for this query. Recall@k asks how many of those relevant chunks appear in the top $k$."
    },
    {
      "t": "code",
      "src": "relevant = {0, 1}\ntop_k = set(ranked[:3])\nrecall_at_3 = len(relevant.intersection(top_k)) / len(relevant)\n\nprint(\"recall@3\", recall_at_3)\n\nassert recall_at_3 >= 0.5"
    },
    {
      "t": "md",
      "src": "## Visualize scores\n\nA bar chart makes the retrieval margin easy to see. Small margins are a good reason to rerank or fallback."
    },
    {
      "t": "code",
      "src": "labels = [f\"chunk {idx}\" for idx in range(len(chunks))]\nfig, ax = plt.subplots(figsize=(6, 3))\nax.bar(labels, scores, color=\"#4c78a8\")\nax.axhline(gamma, color=\"#f58518\", linestyle=\"--\", label=\"threshold\")\nax.set_ylabel(\"cosine score\")\nax.set_title(\"retrieval scores\")\nax.legend()\nplt.show()"
    },
    {
      "t": "md",
      "src": "## Practice\n\n1. Raise `gamma` until the system falls back.\n2. Add a new chunk about Canadian cybersecurity creators and rerun retrieval.\n3. Modify `parse_creator_query` to extract `industry` separately from `audience`."
    },
    {
      "t": "code",
      "src": "# Your turn:\n"
    }
  ]
};

module.exports = [M17, M18, M19];
