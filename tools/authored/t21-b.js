module.exports = {
  "math-21-11": {
    "id": "math-21-11",
    "title": "Source coding and Shannon's theorem",
    "tagline": "Good lossless compression matches short descriptions to common symbols and cannot beat entropy on average.",
    "connections": {
      "buildsOn": [
        "Jensen's inequality in information theory",
        "entropy",
        "expected value"
      ],
      "leadsTo": [
        "Huffman coding",
        "Arithmetic coding"
      ],
      "usedWith": [
        "Kraft inequality",
        "prefix-free codes",
        "typical sets"
      ]
    },
    "motivation": "<p>You already abbreviate common words because they are worth making short. Source coding gives that instinct a precise limit.</p><p>Shannon's theorem says entropy is the best possible long-run lossless rate, and careful block codes can approach it as closely as we like.</p>",
    "definition": "<p>For a discrete source $X$, entropy is $H(X)=-\\sum_x p(x)\\log_2 p(x)$ bits. A binary code with lengths $\\ell(x)$ has expected length $L=\\sum_x p(x)\\ell(x)$.</p><p>Uniquely decodable codes must satisfy length-packing constraints, so $L\\ge H(X)$. Shannon's source coding theorem adds the positive side: for long enough blocks, rates below $H(X)+\\epsilon$ are achievable for any $\\epsilon>0$.</p><p><b>Assumptions that matter:</b> the clean theorem uses a known stationary source; logs are base $2$ for bits; prefix-free codes are the usual practical setting; and the guarantee is asymptotic in block length.</p>",
    "worked": {
      "problem": "For $P(A)=1/2$, $P(B)=1/4$, $P(C)=1/4$, compare entropy with code $A\\mapsto0$, $B\\mapsto10$, $C\\mapsto11$.",
      "skills": [
        "entropy",
        "expected code length",
        "prefix codes"
      ],
      "strategy": "Compute the source entropy, then compute the average length of the proposed code.",
      "steps": [
        {
          "do": "Compute $A$ contribution",
          "result": "$-(1/2)\\log_2(1/2)=0.5$",
          "why": "probability $1/2$ has surprise 1 bit"
        },
        {
          "do": "Compute $B$ contribution",
          "result": "$-(1/4)\\log_2(1/4)=0.5$",
          "why": "probability $1/4$ has surprise 2 bits"
        },
        {
          "do": "Compute $C$ contribution",
          "result": "$0.5$",
          "why": "same probability as $B$"
        },
        {
          "do": "Add entropy",
          "result": "$H=1.5$ bits",
          "why": "sum the three contributions"
        },
        {
          "do": "Compute expected length",
          "result": "$L=(1/2)1+(1/4)2+(1/4)2=1.5$ bits",
          "why": "weight lengths by probabilities"
        }
      ],
      "verify": "No codeword is a prefix of another, and the expected length equals the entropy lower bound.",
      "answer": "$H(X)=1.5$ bits and $L=1.5$ bits.",
      "connects": "This is the rare case where a simple prefix code reaches Shannon's limit exactly."
    },
    "practice": [
      {
        "problem": "Compute entropy for a binary source with $P(1)=0.8$ and $P(0)=0.2$ using $\\log_2 0.8\\approx-0.322$ and $\\log_2 0.2\\approx-2.322$.",
        "steps": [
          {
            "do": "Write entropy",
            "result": "$H=-0.8\\log_2 0.8-0.2\\log_2 0.2$",
            "why": "entropy is average surprise"
          },
          {
            "do": "Substitute the logs",
            "result": "$H=-0.8(-0.322)-0.2(-2.322)$",
            "why": "use the provided values"
          },
          {
            "do": "Multiply the first term",
            "result": "$0.2576$",
            "why": "$0.8\\cdot0.322=0.2576$"
          },
          {
            "do": "Multiply the second term",
            "result": "$0.4644$",
            "why": "$0.2\\cdot2.322=0.4644$"
          },
          {
            "do": "Add the contributions",
            "result": "$H\\approx0.722$ bits",
            "why": "average uncertainty is the sum"
          }
        ],
        "answer": "$H\\approx0.722$ bits."
      },
      {
        "problem": "For distributions $P=(0.7,0.3)$ and $Q=(0.5,0.5)$, compute $D_{KL}(P\\|Q)$ using $\\log 1.4\\approx0.336$ and $\\log 0.6\\approx-0.511$.",
        "steps": [
          {
            "do": "Write the KL formula",
            "result": "$D_{KL}(P\\|Q)=0.7\\log(0.7/0.5)+0.3\\log(0.3/0.5)$",
            "why": "compare probabilities component by component"
          },
          {
            "do": "Compute the ratios",
            "result": "$1.4$ and $0.6$",
            "why": "divide $P_i$ by $Q_i$"
          },
          {
            "do": "Substitute logs",
            "result": "$0.7(0.336)+0.3(-0.511)$",
            "why": "use the approximations"
          },
          {
            "do": "Multiply terms",
            "result": "$0.2352-0.1533$",
            "why": "weight each log ratio"
          },
          {
            "do": "Subtract",
            "result": "$0.0819$ nats",
            "why": "KL is small but positive"
          }
        ],
        "answer": "$D_{KL}(P\\|Q)\\approx0.082$ nats."
      },
      {
        "problem": "A code uses lengths $1,2,3,3$ for probabilities $0.4,0.3,0.2,0.1$. Compute expected length.",
        "steps": [
          {
            "do": "Write the average",
            "result": "$L=0.4(1)+0.3(2)+0.2(3)+0.1(3)$",
            "why": "expected length weights each code length"
          },
          {
            "do": "Compute first two terms",
            "result": "$0.4+0.6=1.0$",
            "why": "common symbols dominate the average"
          },
          {
            "do": "Compute last two terms",
            "result": "$0.6+0.3=0.9$",
            "why": "rare symbols have longer codewords"
          },
          {
            "do": "Add totals",
            "result": "$L=1.9$ bits",
            "why": "sum all weighted lengths"
          },
          {
            "do": "Compare to two-bit fixed coding",
            "result": "$2-1.9=0.1$ bit saved",
            "why": "variable length helps"
          }
        ],
        "answer": "The expected length is $1.9$ bits per symbol."
      },
      {
        "problem": "A sequence receives model probabilities $0.9$, $0.5$, and $0.25$ for its actual symbols. Compute the negative log probability in bits.",
        "steps": [
          {
            "do": "Multiply probabilities",
            "result": "$0.9\\cdot0.5\\cdot0.25=0.1125$",
            "why": "independent sequence probabilities multiply"
          },
          {
            "do": "Write code length",
            "result": "$-\\log_2(0.1125)$",
            "why": "negative log probability is ideal length"
          },
          {
            "do": "Split the log",
            "result": "$-\\log_2(0.9)-\\log_2(0.5)-\\log_2(0.25)$",
            "why": "products become sums"
          },
          {
            "do": "Use common values",
            "result": "$0.152+1+2$",
            "why": "$-\\log_2(0.9)\\approx0.152$"
          },
          {
            "do": "Add",
            "result": "$3.152$ bits",
            "why": "total sequence surprise"
          }
        ],
        "answer": "The sequence costs about $3.152$ bits."
      },
      {
        "problem": "A loss has reconstruction term $1.6$ and KL term $0.4$. Compute the negative ELBO, then recompute with KL weight $0.25$.",
        "steps": [
          {
            "do": "Add unweighted terms",
            "result": "$1.6+0.4=2.0$",
            "why": "negative ELBO combines fit and KL"
          },
          {
            "do": "Scale the KL term",
            "result": "$0.25\\cdot0.4=0.1$",
            "why": "apply the weight"
          },
          {
            "do": "Add weighted terms",
            "result": "$1.6+0.1=1.7$",
            "why": "combine reconstruction and weighted KL"
          },
          {
            "do": "Compare objectives",
            "result": "$2.0-1.7=0.3$",
            "why": "down-weighting KL lowers the loss"
          },
          {
            "do": "Interpret the tradeoff",
            "result": "less regularization",
            "why": "the model is allowed to use the latent code more freely"
          }
        ],
        "answer": "Unweighted loss is $2.0$; with KL weight $0.25$, loss is $1.7$."
      }
    ],
    "applications": [
      {
        "title": "Compression budgets",
        "background": "Source coding and Shannon's theorem helps turn probability models into concrete storage expectations rather than vague compression hopes.",
        "numbers": "At $1.3$ bits per symbol, $10,000$ symbols need about $13,000$ bits before headers."
      },
      {
        "title": "Classifier losses",
        "background": "In ML, Source coding and Shannon's theorem connects naturally to negative log probabilities used for supervised learning.",
        "numbers": "If the true-class probability is $0.8$, the loss is $-\\log(0.8)\\approx0.223$ nats."
      },
      {
        "title": "Latent-variable models",
        "background": "Variational models use information terms to decide how much a latent representation should remember.",
        "numbers": "A reconstruction cost $2.1$ plus KL $0.3$ gives negative ELBO $2.4$."
      },
      {
        "title": "Reinforcement learning policies",
        "background": "Policy optimization often measures how far a new action distribution moved from an old one.",
        "numbers": "Old policy $(0.6,0.4)$ and new $(0.5,0.5)$ have KL about $0.020$ nats."
      },
      {
        "title": "Communication systems",
        "background": "Rates, capacities, and code lengths make noisy links analyzable before hardware is built.",
        "numbers": "A rate of $0.7$ bits/use over $2000$ uses carries $1400$ information bits."
      },
      {
        "title": "Representation learning",
        "background": "Information constraints explain bottlenecks in embeddings, autoencoders, and quantizers.",
        "numbers": "An $8$-bit code can name $2^8=256$ clusters; a $10$-bit code can name $1024$."
      }
    ],
    "applicationsClose": "Across these examples, one idea keeps changing clothes: probabilities become logarithmic costs, and averages become operational limits.",
    "takeaways": [
      "Information-theoretic quantities turn uncertainty into arithmetic.",
      "Logarithms convert probability products into additive costs.",
      "The same entropy and KL terms appear in compression, inference, and ML losses.",
      "Always check the modeling assumptions before treating a bound as a guarantee."
    ]
  },
  "math-21-12": {
    "id": "math-21-12",
    "title": "Huffman coding",
    "tagline": "Huffman coding is the greedy tree algorithm that makes common symbols shallow and rare symbols deep.",
    "connections": {
      "buildsOn": [
        "Source coding and Shannon's theorem",
        "entropy",
        "logarithms"
      ],
      "leadsTo": [
        "Arithmetic coding",
        "information-theoretic ML objectives"
      ],
      "usedWith": [
        "priority queues",
        "KL divergence",
        "expected value"
      ]
    },
    "motivation": "<p>Once entropy sets the target, the next question is how to build a real code. Huffman coding is the classic answer.</p><p>It repeatedly merges the two least likely symbols, building an optimal prefix tree from the bottom up.</p>",
    "definition": "<p>A <b>Huffman code</b> starts with symbol probabilities as leaf weights. Repeatedly combine the two smallest weights; the final binary tree assigns codeword lengths by depth.</p><p>The greedy step is valid because in some optimal tree the two least likely symbols can be deepest siblings. Merging them leaves a smaller problem of the same kind.</p><p><b>Assumptions that matter:</b> probabilities are known or estimated; the optimization is over binary prefix codes for individual symbols; ties may produce different equally optimal codes; and lengths are integer numbers of bits.</p>",
    "worked": {
      "problem": "Build Huffman lengths for probabilities $0.4,0.3,0.2,0.1$.",
      "skills": [
        "priority queues",
        "logs",
        "probability arithmetic"
      ],
      "strategy": "Translate the definition into one small calculation at a time, keeping units and direction clear.",
      "steps": [
        {
          "do": "Merge the two smallest",
          "result": "$0.1+0.2=0.3$",
          "why": "Huffman begins with least likely symbols"
        },
        {
          "do": "List remaining weights",
          "result": "$0.3,0.3,0.4$",
          "why": "replace the pair by its sum"
        },
        {
          "do": "Merge two smallest again",
          "result": "$0.3+0.3=0.6$",
          "why": "continue greedily"
        },
        {
          "do": "Merge the final pair",
          "result": "$0.4+0.6=1.0$",
          "why": "complete the tree"
        },
        {
          "do": "Read lengths",
          "result": "$1,2,3,3$",
          "why": "the largest probability can be closest to the root"
        },
        {
          "do": "Compute average",
          "result": "$0.4+0.6+0.6+0.3=1.9$ bits",
          "why": "weight each length"
        }
      ],
      "verify": "The result has the right sign and agrees with the qualitative meaning of the definition.",
      "answer": "One optimal expected length is $1.9$ bits.",
      "connects": "This calculation shows the lesson's abstract quantity acting as a concrete numerical guide."
    },
    "practice": [
      {
        "problem": "Compute entropy for a binary source with $P(1)=0.8$ and $P(0)=0.2$ using $\\log_2 0.8\\approx-0.322$ and $\\log_2 0.2\\approx-2.322$.",
        "steps": [
          {
            "do": "Write entropy",
            "result": "$H=-0.8\\log_2 0.8-0.2\\log_2 0.2$",
            "why": "entropy is average surprise"
          },
          {
            "do": "Substitute the logs",
            "result": "$H=-0.8(-0.322)-0.2(-2.322)$",
            "why": "use the provided values"
          },
          {
            "do": "Multiply the first term",
            "result": "$0.2576$",
            "why": "$0.8\\cdot0.322=0.2576$"
          },
          {
            "do": "Multiply the second term",
            "result": "$0.4644$",
            "why": "$0.2\\cdot2.322=0.4644$"
          },
          {
            "do": "Add the contributions",
            "result": "$H\\approx0.722$ bits",
            "why": "average uncertainty is the sum"
          }
        ],
        "answer": "$H\\approx0.722$ bits."
      },
      {
        "problem": "For distributions $P=(0.7,0.3)$ and $Q=(0.5,0.5)$, compute $D_{KL}(P\\|Q)$ using $\\log 1.4\\approx0.336$ and $\\log 0.6\\approx-0.511$.",
        "steps": [
          {
            "do": "Write the KL formula",
            "result": "$D_{KL}(P\\|Q)=0.7\\log(0.7/0.5)+0.3\\log(0.3/0.5)$",
            "why": "compare probabilities component by component"
          },
          {
            "do": "Compute the ratios",
            "result": "$1.4$ and $0.6$",
            "why": "divide $P_i$ by $Q_i$"
          },
          {
            "do": "Substitute logs",
            "result": "$0.7(0.336)+0.3(-0.511)$",
            "why": "use the approximations"
          },
          {
            "do": "Multiply terms",
            "result": "$0.2352-0.1533$",
            "why": "weight each log ratio"
          },
          {
            "do": "Subtract",
            "result": "$0.0819$ nats",
            "why": "KL is small but positive"
          }
        ],
        "answer": "$D_{KL}(P\\|Q)\\approx0.082$ nats."
      },
      {
        "problem": "A code uses lengths $1,2,3,3$ for probabilities $0.4,0.3,0.2,0.1$. Compute expected length.",
        "steps": [
          {
            "do": "Write the average",
            "result": "$L=0.4(1)+0.3(2)+0.2(3)+0.1(3)$",
            "why": "expected length weights each code length"
          },
          {
            "do": "Compute first two terms",
            "result": "$0.4+0.6=1.0$",
            "why": "common symbols dominate the average"
          },
          {
            "do": "Compute last two terms",
            "result": "$0.6+0.3=0.9$",
            "why": "rare symbols have longer codewords"
          },
          {
            "do": "Add totals",
            "result": "$L=1.9$ bits",
            "why": "sum all weighted lengths"
          },
          {
            "do": "Compare to two-bit fixed coding",
            "result": "$2-1.9=0.1$ bit saved",
            "why": "variable length helps"
          }
        ],
        "answer": "The expected length is $1.9$ bits per symbol."
      },
      {
        "problem": "A sequence receives model probabilities $0.9$, $0.5$, and $0.25$ for its actual symbols. Compute the negative log probability in bits.",
        "steps": [
          {
            "do": "Multiply probabilities",
            "result": "$0.9\\cdot0.5\\cdot0.25=0.1125$",
            "why": "independent sequence probabilities multiply"
          },
          {
            "do": "Write code length",
            "result": "$-\\log_2(0.1125)$",
            "why": "negative log probability is ideal length"
          },
          {
            "do": "Split the log",
            "result": "$-\\log_2(0.9)-\\log_2(0.5)-\\log_2(0.25)$",
            "why": "products become sums"
          },
          {
            "do": "Use common values",
            "result": "$0.152+1+2$",
            "why": "$-\\log_2(0.9)\\approx0.152$"
          },
          {
            "do": "Add",
            "result": "$3.152$ bits",
            "why": "total sequence surprise"
          }
        ],
        "answer": "The sequence costs about $3.152$ bits."
      },
      {
        "problem": "A loss has reconstruction term $1.6$ and KL term $0.4$. Compute the negative ELBO, then recompute with KL weight $0.25$.",
        "steps": [
          {
            "do": "Add unweighted terms",
            "result": "$1.6+0.4=2.0$",
            "why": "negative ELBO combines fit and KL"
          },
          {
            "do": "Scale the KL term",
            "result": "$0.25\\cdot0.4=0.1$",
            "why": "apply the weight"
          },
          {
            "do": "Add weighted terms",
            "result": "$1.6+0.1=1.7$",
            "why": "combine reconstruction and weighted KL"
          },
          {
            "do": "Compare objectives",
            "result": "$2.0-1.7=0.3$",
            "why": "down-weighting KL lowers the loss"
          },
          {
            "do": "Interpret the tradeoff",
            "result": "less regularization",
            "why": "the model is allowed to use the latent code more freely"
          }
        ],
        "answer": "Unweighted loss is $2.0$; with KL weight $0.25$, loss is $1.7$."
      }
    ],
    "applications": [
      {
        "title": "Compression budgets",
        "background": "Huffman coding helps turn probability models into concrete storage expectations rather than vague compression hopes.",
        "numbers": "At $1.3$ bits per symbol, $10,000$ symbols need about $13,000$ bits before headers."
      },
      {
        "title": "Classifier losses",
        "background": "In ML, Huffman coding connects naturally to negative log probabilities used for supervised learning.",
        "numbers": "If the true-class probability is $0.8$, the loss is $-\\log(0.8)\\approx0.223$ nats."
      },
      {
        "title": "Latent-variable models",
        "background": "Variational models use information terms to decide how much a latent representation should remember.",
        "numbers": "A reconstruction cost $2.1$ plus KL $0.3$ gives negative ELBO $2.4$."
      },
      {
        "title": "Reinforcement learning policies",
        "background": "Policy optimization often measures how far a new action distribution moved from an old one.",
        "numbers": "Old policy $(0.6,0.4)$ and new $(0.5,0.5)$ have KL about $0.020$ nats."
      },
      {
        "title": "Communication systems",
        "background": "Rates, capacities, and code lengths make noisy links analyzable before hardware is built.",
        "numbers": "A rate of $0.7$ bits/use over $2000$ uses carries $1400$ information bits."
      },
      {
        "title": "Representation learning",
        "background": "Information constraints explain bottlenecks in embeddings, autoencoders, and quantizers.",
        "numbers": "An $8$-bit code can name $2^8=256$ clusters; a $10$-bit code can name $1024$."
      }
    ],
    "applicationsClose": "Across these examples, one idea keeps changing clothes: probabilities become logarithmic costs, and averages become operational limits.",
    "takeaways": [
      "Information-theoretic quantities turn uncertainty into arithmetic.",
      "Logarithms convert probability products into additive costs.",
      "The same entropy and KL terms appear in compression, inference, and ML losses.",
      "Always check the modeling assumptions before treating a bound as a guarantee."
    ]
  },
  "math-21-13": {
    "id": "math-21-13",
    "title": "Arithmetic coding",
    "tagline": "Arithmetic coding encodes a whole message as a small interval, allowing fractional bits per symbol.",
    "connections": {
      "buildsOn": [
        "Huffman coding",
        "entropy",
        "logarithms"
      ],
      "leadsTo": [
        "Channel capacity",
        "information-theoretic ML objectives"
      ],
      "usedWith": [
        "binary intervals",
        "KL divergence",
        "expected value"
      ]
    },
    "motivation": "<p>Huffman codes are practical, but each symbol receives an integer-length codeword. Arithmetic coding smooths that rough edge.</p><p>It narrows an interval according to the probabilities of the symbols in the whole message.</p>",
    "definition": "<p>An <b>arithmetic code</b> begins with $[0,1)$. Each symbol selects a probability-sized subinterval inside the current interval. For a memoryless model, the final interval width is $\\prod_i p(x_i)$.</p><p>A number inside an interval of width $w$ needs about $-\\log_2 w$ bits to specify. Thus arithmetic coding turns sequence probability directly into code length.</p><p><b>Assumptions that matter:</b> encoder and decoder share the model; finite-precision implementations must renormalize carefully; intervals use a consistent endpoint convention; and better probabilities give better compression.</p>",
    "worked": {
      "problem": "Encode $BA$ when $P(A)=0.75$, $P(B)=0.25$, with $A:[0,0.75)$ and $B:[0.75,1)$.",
      "skills": [
        "binary intervals",
        "logs",
        "probability arithmetic"
      ],
      "strategy": "Translate the definition into one small calculation at a time, keeping units and direction clear.",
      "steps": [
        {
          "do": "Start with the full interval",
          "result": "$[0,1)$",
          "why": "all messages begin here"
        },
        {
          "do": "Choose $B$",
          "result": "$[0.75,1)$",
          "why": "the first symbol selects its range"
        },
        {
          "do": "Find the width",
          "result": "$0.25$",
          "why": "the current interval length"
        },
        {
          "do": "Choose $A$ inside the interval",
          "result": "$[0.75,0.9375)$",
          "why": "take the first $75\\%$ of the current interval"
        },
        {
          "do": "Compute final width",
          "result": "$0.1875$",
          "why": "$0.25\\cdot0.75=0.1875$"
        },
        {
          "do": "Convert width to bits",
          "result": "$-\\log_2(0.1875)\\approx2.415$",
          "why": "narrower intervals need more bits"
        }
      ],
      "verify": "The result has the right sign and agrees with the qualitative meaning of the definition.",
      "answer": "The interval is $[0.75,0.9375)$ and its ideal length is about $2.415$ bits.",
      "connects": "This calculation shows the lesson's abstract quantity acting as a concrete numerical guide."
    },
    "practice": [
      {
        "problem": "Compute entropy for a binary source with $P(1)=0.8$ and $P(0)=0.2$ using $\\log_2 0.8\\approx-0.322$ and $\\log_2 0.2\\approx-2.322$.",
        "steps": [
          {
            "do": "Write entropy",
            "result": "$H=-0.8\\log_2 0.8-0.2\\log_2 0.2$",
            "why": "entropy is average surprise"
          },
          {
            "do": "Substitute the logs",
            "result": "$H=-0.8(-0.322)-0.2(-2.322)$",
            "why": "use the provided values"
          },
          {
            "do": "Multiply the first term",
            "result": "$0.2576$",
            "why": "$0.8\\cdot0.322=0.2576$"
          },
          {
            "do": "Multiply the second term",
            "result": "$0.4644$",
            "why": "$0.2\\cdot2.322=0.4644$"
          },
          {
            "do": "Add the contributions",
            "result": "$H\\approx0.722$ bits",
            "why": "average uncertainty is the sum"
          }
        ],
        "answer": "$H\\approx0.722$ bits."
      },
      {
        "problem": "For distributions $P=(0.7,0.3)$ and $Q=(0.5,0.5)$, compute $D_{KL}(P\\|Q)$ using $\\log 1.4\\approx0.336$ and $\\log 0.6\\approx-0.511$.",
        "steps": [
          {
            "do": "Write the KL formula",
            "result": "$D_{KL}(P\\|Q)=0.7\\log(0.7/0.5)+0.3\\log(0.3/0.5)$",
            "why": "compare probabilities component by component"
          },
          {
            "do": "Compute the ratios",
            "result": "$1.4$ and $0.6$",
            "why": "divide $P_i$ by $Q_i$"
          },
          {
            "do": "Substitute logs",
            "result": "$0.7(0.336)+0.3(-0.511)$",
            "why": "use the approximations"
          },
          {
            "do": "Multiply terms",
            "result": "$0.2352-0.1533$",
            "why": "weight each log ratio"
          },
          {
            "do": "Subtract",
            "result": "$0.0819$ nats",
            "why": "KL is small but positive"
          }
        ],
        "answer": "$D_{KL}(P\\|Q)\\approx0.082$ nats."
      },
      {
        "problem": "A code uses lengths $1,2,3,3$ for probabilities $0.4,0.3,0.2,0.1$. Compute expected length.",
        "steps": [
          {
            "do": "Write the average",
            "result": "$L=0.4(1)+0.3(2)+0.2(3)+0.1(3)$",
            "why": "expected length weights each code length"
          },
          {
            "do": "Compute first two terms",
            "result": "$0.4+0.6=1.0$",
            "why": "common symbols dominate the average"
          },
          {
            "do": "Compute last two terms",
            "result": "$0.6+0.3=0.9$",
            "why": "rare symbols have longer codewords"
          },
          {
            "do": "Add totals",
            "result": "$L=1.9$ bits",
            "why": "sum all weighted lengths"
          },
          {
            "do": "Compare to two-bit fixed coding",
            "result": "$2-1.9=0.1$ bit saved",
            "why": "variable length helps"
          }
        ],
        "answer": "The expected length is $1.9$ bits per symbol."
      },
      {
        "problem": "A sequence receives model probabilities $0.9$, $0.5$, and $0.25$ for its actual symbols. Compute the negative log probability in bits.",
        "steps": [
          {
            "do": "Multiply probabilities",
            "result": "$0.9\\cdot0.5\\cdot0.25=0.1125$",
            "why": "independent sequence probabilities multiply"
          },
          {
            "do": "Write code length",
            "result": "$-\\log_2(0.1125)$",
            "why": "negative log probability is ideal length"
          },
          {
            "do": "Split the log",
            "result": "$-\\log_2(0.9)-\\log_2(0.5)-\\log_2(0.25)$",
            "why": "products become sums"
          },
          {
            "do": "Use common values",
            "result": "$0.152+1+2$",
            "why": "$-\\log_2(0.9)\\approx0.152$"
          },
          {
            "do": "Add",
            "result": "$3.152$ bits",
            "why": "total sequence surprise"
          }
        ],
        "answer": "The sequence costs about $3.152$ bits."
      },
      {
        "problem": "A loss has reconstruction term $1.6$ and KL term $0.4$. Compute the negative ELBO, then recompute with KL weight $0.25$.",
        "steps": [
          {
            "do": "Add unweighted terms",
            "result": "$1.6+0.4=2.0$",
            "why": "negative ELBO combines fit and KL"
          },
          {
            "do": "Scale the KL term",
            "result": "$0.25\\cdot0.4=0.1$",
            "why": "apply the weight"
          },
          {
            "do": "Add weighted terms",
            "result": "$1.6+0.1=1.7$",
            "why": "combine reconstruction and weighted KL"
          },
          {
            "do": "Compare objectives",
            "result": "$2.0-1.7=0.3$",
            "why": "down-weighting KL lowers the loss"
          },
          {
            "do": "Interpret the tradeoff",
            "result": "less regularization",
            "why": "the model is allowed to use the latent code more freely"
          }
        ],
        "answer": "Unweighted loss is $2.0$; with KL weight $0.25$, loss is $1.7$."
      }
    ],
    "applications": [
      {
        "title": "Compression budgets",
        "background": "Arithmetic coding helps turn probability models into concrete storage expectations rather than vague compression hopes.",
        "numbers": "At $1.3$ bits per symbol, $10,000$ symbols need about $13,000$ bits before headers."
      },
      {
        "title": "Classifier losses",
        "background": "In ML, Arithmetic coding connects naturally to negative log probabilities used for supervised learning.",
        "numbers": "If the true-class probability is $0.8$, the loss is $-\\log(0.8)\\approx0.223$ nats."
      },
      {
        "title": "Latent-variable models",
        "background": "Variational models use information terms to decide how much a latent representation should remember.",
        "numbers": "A reconstruction cost $2.1$ plus KL $0.3$ gives negative ELBO $2.4$."
      },
      {
        "title": "Reinforcement learning policies",
        "background": "Policy optimization often measures how far a new action distribution moved from an old one.",
        "numbers": "Old policy $(0.6,0.4)$ and new $(0.5,0.5)$ have KL about $0.020$ nats."
      },
      {
        "title": "Communication systems",
        "background": "Rates, capacities, and code lengths make noisy links analyzable before hardware is built.",
        "numbers": "A rate of $0.7$ bits/use over $2000$ uses carries $1400$ information bits."
      },
      {
        "title": "Representation learning",
        "background": "Information constraints explain bottlenecks in embeddings, autoencoders, and quantizers.",
        "numbers": "An $8$-bit code can name $2^8=256$ clusters; a $10$-bit code can name $1024$."
      }
    ],
    "applicationsClose": "Across these examples, one idea keeps changing clothes: probabilities become logarithmic costs, and averages become operational limits.",
    "takeaways": [
      "Information-theoretic quantities turn uncertainty into arithmetic.",
      "Logarithms convert probability products into additive costs.",
      "The same entropy and KL terms appear in compression, inference, and ML losses.",
      "Always check the modeling assumptions before treating a bound as a guarantee."
    ]
  },
  "math-21-14": {
    "id": "math-21-14",
    "title": "Channel capacity",
    "tagline": "Channel capacity is the maximum reliable information rate through a noisy channel.",
    "connections": {
      "buildsOn": [
        "Arithmetic coding",
        "entropy",
        "logarithms"
      ],
      "leadsTo": [
        "The noisy-channel coding theorem",
        "information-theoretic ML objectives"
      ],
      "usedWith": [
        "mutual information",
        "KL divergence",
        "expected value"
      ]
    },
    "motivation": "<p>A noisy channel may flip or blur symbols. Capacity asks how much information survives if we choose the best input distribution.</p><p>It is not one clever message; it is the best achievable rate per channel use.</p>",
    "definition": "<p>For channel input $X$ and output $Y$, capacity is $C=\\max_{p(x)} I(X;Y)$ bits per use. For a binary symmetric channel with flip probability $p$, $C=1-H_2(p)$.</p><p>The formula says a clean binary channel carries one bit, while output uncertainty caused by flips subtracts $H_2(p)$ bits.</p><p><b>Assumptions that matter:</b> the channel law is known; uses are independent in the basic model; logs are base $2$ for bits; and capacity is an optimized limit, not the performance of every code.</p>",
    "worked": {
      "problem": "Compute capacity for a binary symmetric channel with flip probability $0.1$ and $H_2(0.1)\\approx0.469$.",
      "skills": [
        "mutual information",
        "logs",
        "probability arithmetic"
      ],
      "strategy": "Translate the definition into one small calculation at a time, keeping units and direction clear.",
      "steps": [
        {
          "do": "Write the formula",
          "result": "$C=1-H_2(p)$",
          "why": "binary symmetric channel capacity"
        },
        {
          "do": "Substitute $p=0.1$",
          "result": "$C=1-H_2(0.1)$",
          "why": "use the flip probability"
        },
        {
          "do": "Use the entropy value",
          "result": "$C=1-0.469$",
          "why": "given binary entropy"
        },
        {
          "do": "Subtract",
          "result": "$C=0.531$ bits/use",
          "why": "noise reduces one clean bit"
        },
        {
          "do": "Scale to $1000$ uses",
          "result": "$531$ bits",
          "why": "capacity times uses"
        }
      ],
      "verify": "The result has the right sign and agrees with the qualitative meaning of the definition.",
      "answer": "Capacity is about $0.531$ bits per channel use.",
      "connects": "This calculation shows the lesson's abstract quantity acting as a concrete numerical guide."
    },
    "practice": [
      {
        "problem": "Compute entropy for a binary source with $P(1)=0.8$ and $P(0)=0.2$ using $\\log_2 0.8\\approx-0.322$ and $\\log_2 0.2\\approx-2.322$.",
        "steps": [
          {
            "do": "Write entropy",
            "result": "$H=-0.8\\log_2 0.8-0.2\\log_2 0.2$",
            "why": "entropy is average surprise"
          },
          {
            "do": "Substitute the logs",
            "result": "$H=-0.8(-0.322)-0.2(-2.322)$",
            "why": "use the provided values"
          },
          {
            "do": "Multiply the first term",
            "result": "$0.2576$",
            "why": "$0.8\\cdot0.322=0.2576$"
          },
          {
            "do": "Multiply the second term",
            "result": "$0.4644$",
            "why": "$0.2\\cdot2.322=0.4644$"
          },
          {
            "do": "Add the contributions",
            "result": "$H\\approx0.722$ bits",
            "why": "average uncertainty is the sum"
          }
        ],
        "answer": "$H\\approx0.722$ bits."
      },
      {
        "problem": "For distributions $P=(0.7,0.3)$ and $Q=(0.5,0.5)$, compute $D_{KL}(P\\|Q)$ using $\\log 1.4\\approx0.336$ and $\\log 0.6\\approx-0.511$.",
        "steps": [
          {
            "do": "Write the KL formula",
            "result": "$D_{KL}(P\\|Q)=0.7\\log(0.7/0.5)+0.3\\log(0.3/0.5)$",
            "why": "compare probabilities component by component"
          },
          {
            "do": "Compute the ratios",
            "result": "$1.4$ and $0.6$",
            "why": "divide $P_i$ by $Q_i$"
          },
          {
            "do": "Substitute logs",
            "result": "$0.7(0.336)+0.3(-0.511)$",
            "why": "use the approximations"
          },
          {
            "do": "Multiply terms",
            "result": "$0.2352-0.1533$",
            "why": "weight each log ratio"
          },
          {
            "do": "Subtract",
            "result": "$0.0819$ nats",
            "why": "KL is small but positive"
          }
        ],
        "answer": "$D_{KL}(P\\|Q)\\approx0.082$ nats."
      },
      {
        "problem": "A code uses lengths $1,2,3,3$ for probabilities $0.4,0.3,0.2,0.1$. Compute expected length.",
        "steps": [
          {
            "do": "Write the average",
            "result": "$L=0.4(1)+0.3(2)+0.2(3)+0.1(3)$",
            "why": "expected length weights each code length"
          },
          {
            "do": "Compute first two terms",
            "result": "$0.4+0.6=1.0$",
            "why": "common symbols dominate the average"
          },
          {
            "do": "Compute last two terms",
            "result": "$0.6+0.3=0.9$",
            "why": "rare symbols have longer codewords"
          },
          {
            "do": "Add totals",
            "result": "$L=1.9$ bits",
            "why": "sum all weighted lengths"
          },
          {
            "do": "Compare to two-bit fixed coding",
            "result": "$2-1.9=0.1$ bit saved",
            "why": "variable length helps"
          }
        ],
        "answer": "The expected length is $1.9$ bits per symbol."
      },
      {
        "problem": "A sequence receives model probabilities $0.9$, $0.5$, and $0.25$ for its actual symbols. Compute the negative log probability in bits.",
        "steps": [
          {
            "do": "Multiply probabilities",
            "result": "$0.9\\cdot0.5\\cdot0.25=0.1125$",
            "why": "independent sequence probabilities multiply"
          },
          {
            "do": "Write code length",
            "result": "$-\\log_2(0.1125)$",
            "why": "negative log probability is ideal length"
          },
          {
            "do": "Split the log",
            "result": "$-\\log_2(0.9)-\\log_2(0.5)-\\log_2(0.25)$",
            "why": "products become sums"
          },
          {
            "do": "Use common values",
            "result": "$0.152+1+2$",
            "why": "$-\\log_2(0.9)\\approx0.152$"
          },
          {
            "do": "Add",
            "result": "$3.152$ bits",
            "why": "total sequence surprise"
          }
        ],
        "answer": "The sequence costs about $3.152$ bits."
      },
      {
        "problem": "A loss has reconstruction term $1.6$ and KL term $0.4$. Compute the negative ELBO, then recompute with KL weight $0.25$.",
        "steps": [
          {
            "do": "Add unweighted terms",
            "result": "$1.6+0.4=2.0$",
            "why": "negative ELBO combines fit and KL"
          },
          {
            "do": "Scale the KL term",
            "result": "$0.25\\cdot0.4=0.1$",
            "why": "apply the weight"
          },
          {
            "do": "Add weighted terms",
            "result": "$1.6+0.1=1.7$",
            "why": "combine reconstruction and weighted KL"
          },
          {
            "do": "Compare objectives",
            "result": "$2.0-1.7=0.3$",
            "why": "down-weighting KL lowers the loss"
          },
          {
            "do": "Interpret the tradeoff",
            "result": "less regularization",
            "why": "the model is allowed to use the latent code more freely"
          }
        ],
        "answer": "Unweighted loss is $2.0$; with KL weight $0.25$, loss is $1.7$."
      }
    ],
    "applications": [
      {
        "title": "Compression budgets",
        "background": "Channel capacity helps turn probability models into concrete storage expectations rather than vague compression hopes.",
        "numbers": "At $1.3$ bits per symbol, $10,000$ symbols need about $13,000$ bits before headers."
      },
      {
        "title": "Classifier losses",
        "background": "In ML, Channel capacity connects naturally to negative log probabilities used for supervised learning.",
        "numbers": "If the true-class probability is $0.8$, the loss is $-\\log(0.8)\\approx0.223$ nats."
      },
      {
        "title": "Latent-variable models",
        "background": "Variational models use information terms to decide how much a latent representation should remember.",
        "numbers": "A reconstruction cost $2.1$ plus KL $0.3$ gives negative ELBO $2.4$."
      },
      {
        "title": "Reinforcement learning policies",
        "background": "Policy optimization often measures how far a new action distribution moved from an old one.",
        "numbers": "Old policy $(0.6,0.4)$ and new $(0.5,0.5)$ have KL about $0.020$ nats."
      },
      {
        "title": "Communication systems",
        "background": "Rates, capacities, and code lengths make noisy links analyzable before hardware is built.",
        "numbers": "A rate of $0.7$ bits/use over $2000$ uses carries $1400$ information bits."
      },
      {
        "title": "Representation learning",
        "background": "Information constraints explain bottlenecks in embeddings, autoencoders, and quantizers.",
        "numbers": "An $8$-bit code can name $2^8=256$ clusters; a $10$-bit code can name $1024$."
      }
    ],
    "applicationsClose": "Across these examples, one idea keeps changing clothes: probabilities become logarithmic costs, and averages become operational limits.",
    "takeaways": [
      "Information-theoretic quantities turn uncertainty into arithmetic.",
      "Logarithms convert probability products into additive costs.",
      "The same entropy and KL terms appear in compression, inference, and ML losses.",
      "Always check the modeling assumptions before treating a bound as a guarantee."
    ]
  },
  "math-21-15": {
    "id": "math-21-15",
    "title": "The noisy-channel coding theorem",
    "tagline": "Shannon's noisy-channel theorem draws the line between possible reliable rates and impossible ones.",
    "connections": {
      "buildsOn": [
        "Channel capacity",
        "entropy",
        "logarithms"
      ],
      "leadsTo": [
        "Rate–distortion theory",
        "information-theoretic ML objectives"
      ],
      "usedWith": [
        "block codes",
        "KL divergence",
        "expected value"
      ]
    },
    "motivation": "<p>Noise does not end communication. Shannon showed that long, carefully separated codewords can make errors vanish below a precise rate.</p><p>Above that rate, no amount of cleverness can make reliability asymptotically perfect.</p>",
    "definition": "<p>If a channel has capacity $C$, the noisy-channel coding theorem says every rate $R<C$ is achievable with error probability tending to zero using long block codes. The converse says rates $R>C$ cannot be made reliable.</p><p>The geometry is packing: codewords have noisy clouds around them. Below capacity, the clouds can be separated; above capacity, too many messages are packed into the output space.</p><p><b>Assumptions that matter:</b> statements are asymptotic in block length; the channel follows the modeled law; encoding and decoding may be complex; and the theorem proves existence, not a simple construction.</p>",
    "worked": {
      "problem": "A channel has capacity $0.75$ bits/use. Classify rates $0.6$ and $0.9$.",
      "skills": [
        "block codes",
        "logs",
        "probability arithmetic"
      ],
      "strategy": "Translate the definition into one small calculation at a time, keeping units and direction clear.",
      "steps": [
        {
          "do": "State capacity",
          "result": "$C=0.75$ bits/use",
          "why": "given boundary"
        },
        {
          "do": "Compare $0.6$",
          "result": "$0.6<0.75$",
          "why": "below capacity"
        },
        {
          "do": "Classify $0.6$",
          "result": "achievable in principle",
          "why": "the theorem allows rates below $C$"
        },
        {
          "do": "Compare $0.9$",
          "result": "$0.9>0.75$",
          "why": "above capacity"
        },
        {
          "do": "Classify $0.9$",
          "result": "not reliably achievable asymptotically",
          "why": "the converse rules it out"
        }
      ],
      "verify": "The result has the right sign and agrees with the qualitative meaning of the definition.",
      "answer": "Rate $0.6$ is possible in principle; rate $0.9$ is not.",
      "connects": "This calculation shows the lesson's abstract quantity acting as a concrete numerical guide."
    },
    "practice": [
      {
        "problem": "Compute entropy for a binary source with $P(1)=0.8$ and $P(0)=0.2$ using $\\log_2 0.8\\approx-0.322$ and $\\log_2 0.2\\approx-2.322$.",
        "steps": [
          {
            "do": "Write entropy",
            "result": "$H=-0.8\\log_2 0.8-0.2\\log_2 0.2$",
            "why": "entropy is average surprise"
          },
          {
            "do": "Substitute the logs",
            "result": "$H=-0.8(-0.322)-0.2(-2.322)$",
            "why": "use the provided values"
          },
          {
            "do": "Multiply the first term",
            "result": "$0.2576$",
            "why": "$0.8\\cdot0.322=0.2576$"
          },
          {
            "do": "Multiply the second term",
            "result": "$0.4644$",
            "why": "$0.2\\cdot2.322=0.4644$"
          },
          {
            "do": "Add the contributions",
            "result": "$H\\approx0.722$ bits",
            "why": "average uncertainty is the sum"
          }
        ],
        "answer": "$H\\approx0.722$ bits."
      },
      {
        "problem": "For distributions $P=(0.7,0.3)$ and $Q=(0.5,0.5)$, compute $D_{KL}(P\\|Q)$ using $\\log 1.4\\approx0.336$ and $\\log 0.6\\approx-0.511$.",
        "steps": [
          {
            "do": "Write the KL formula",
            "result": "$D_{KL}(P\\|Q)=0.7\\log(0.7/0.5)+0.3\\log(0.3/0.5)$",
            "why": "compare probabilities component by component"
          },
          {
            "do": "Compute the ratios",
            "result": "$1.4$ and $0.6$",
            "why": "divide $P_i$ by $Q_i$"
          },
          {
            "do": "Substitute logs",
            "result": "$0.7(0.336)+0.3(-0.511)$",
            "why": "use the approximations"
          },
          {
            "do": "Multiply terms",
            "result": "$0.2352-0.1533$",
            "why": "weight each log ratio"
          },
          {
            "do": "Subtract",
            "result": "$0.0819$ nats",
            "why": "KL is small but positive"
          }
        ],
        "answer": "$D_{KL}(P\\|Q)\\approx0.082$ nats."
      },
      {
        "problem": "A code uses lengths $1,2,3,3$ for probabilities $0.4,0.3,0.2,0.1$. Compute expected length.",
        "steps": [
          {
            "do": "Write the average",
            "result": "$L=0.4(1)+0.3(2)+0.2(3)+0.1(3)$",
            "why": "expected length weights each code length"
          },
          {
            "do": "Compute first two terms",
            "result": "$0.4+0.6=1.0$",
            "why": "common symbols dominate the average"
          },
          {
            "do": "Compute last two terms",
            "result": "$0.6+0.3=0.9$",
            "why": "rare symbols have longer codewords"
          },
          {
            "do": "Add totals",
            "result": "$L=1.9$ bits",
            "why": "sum all weighted lengths"
          },
          {
            "do": "Compare to two-bit fixed coding",
            "result": "$2-1.9=0.1$ bit saved",
            "why": "variable length helps"
          }
        ],
        "answer": "The expected length is $1.9$ bits per symbol."
      },
      {
        "problem": "A sequence receives model probabilities $0.9$, $0.5$, and $0.25$ for its actual symbols. Compute the negative log probability in bits.",
        "steps": [
          {
            "do": "Multiply probabilities",
            "result": "$0.9\\cdot0.5\\cdot0.25=0.1125$",
            "why": "independent sequence probabilities multiply"
          },
          {
            "do": "Write code length",
            "result": "$-\\log_2(0.1125)$",
            "why": "negative log probability is ideal length"
          },
          {
            "do": "Split the log",
            "result": "$-\\log_2(0.9)-\\log_2(0.5)-\\log_2(0.25)$",
            "why": "products become sums"
          },
          {
            "do": "Use common values",
            "result": "$0.152+1+2$",
            "why": "$-\\log_2(0.9)\\approx0.152$"
          },
          {
            "do": "Add",
            "result": "$3.152$ bits",
            "why": "total sequence surprise"
          }
        ],
        "answer": "The sequence costs about $3.152$ bits."
      },
      {
        "problem": "A loss has reconstruction term $1.6$ and KL term $0.4$. Compute the negative ELBO, then recompute with KL weight $0.25$.",
        "steps": [
          {
            "do": "Add unweighted terms",
            "result": "$1.6+0.4=2.0$",
            "why": "negative ELBO combines fit and KL"
          },
          {
            "do": "Scale the KL term",
            "result": "$0.25\\cdot0.4=0.1$",
            "why": "apply the weight"
          },
          {
            "do": "Add weighted terms",
            "result": "$1.6+0.1=1.7$",
            "why": "combine reconstruction and weighted KL"
          },
          {
            "do": "Compare objectives",
            "result": "$2.0-1.7=0.3$",
            "why": "down-weighting KL lowers the loss"
          },
          {
            "do": "Interpret the tradeoff",
            "result": "less regularization",
            "why": "the model is allowed to use the latent code more freely"
          }
        ],
        "answer": "Unweighted loss is $2.0$; with KL weight $0.25$, loss is $1.7$."
      }
    ],
    "applications": [
      {
        "title": "Compression budgets",
        "background": "The noisy-channel coding theorem helps turn probability models into concrete storage expectations rather than vague compression hopes.",
        "numbers": "At $1.3$ bits per symbol, $10,000$ symbols need about $13,000$ bits before headers."
      },
      {
        "title": "Classifier losses",
        "background": "In ML, The noisy-channel coding theorem connects naturally to negative log probabilities used for supervised learning.",
        "numbers": "If the true-class probability is $0.8$, the loss is $-\\log(0.8)\\approx0.223$ nats."
      },
      {
        "title": "Latent-variable models",
        "background": "Variational models use information terms to decide how much a latent representation should remember.",
        "numbers": "A reconstruction cost $2.1$ plus KL $0.3$ gives negative ELBO $2.4$."
      },
      {
        "title": "Reinforcement learning policies",
        "background": "Policy optimization often measures how far a new action distribution moved from an old one.",
        "numbers": "Old policy $(0.6,0.4)$ and new $(0.5,0.5)$ have KL about $0.020$ nats."
      },
      {
        "title": "Communication systems",
        "background": "Rates, capacities, and code lengths make noisy links analyzable before hardware is built.",
        "numbers": "A rate of $0.7$ bits/use over $2000$ uses carries $1400$ information bits."
      },
      {
        "title": "Representation learning",
        "background": "Information constraints explain bottlenecks in embeddings, autoencoders, and quantizers.",
        "numbers": "An $8$-bit code can name $2^8=256$ clusters; a $10$-bit code can name $1024$."
      }
    ],
    "applicationsClose": "Across these examples, one idea keeps changing clothes: probabilities become logarithmic costs, and averages become operational limits.",
    "takeaways": [
      "Information-theoretic quantities turn uncertainty into arithmetic.",
      "Logarithms convert probability products into additive costs.",
      "The same entropy and KL terms appear in compression, inference, and ML losses.",
      "Always check the modeling assumptions before treating a bound as a guarantee."
    ]
  },
  "math-21-16": {
    "id": "math-21-16",
    "title": "Rate–distortion theory",
    "tagline": "Rate–distortion theory asks how many bits are needed when small errors are allowed.",
    "connections": {
      "buildsOn": [
        "The noisy-channel coding theorem",
        "entropy",
        "logarithms"
      ],
      "leadsTo": [
        "The maximum entropy principle",
        "information-theoretic ML objectives"
      ],
      "usedWith": [
        "constrained optimization",
        "KL divergence",
        "expected value"
      ]
    },
    "motivation": "<p>Lossless compression is not always the goal. Audio, images, embeddings, and weights can often change a little while staying useful.</p><p>Rate–distortion theory makes that tradeoff precise: fewer bits mean more distortion, and a distortion budget implies a minimum rate.</p>",
    "definition": "<p>For source $X$, reconstruction $\\hat X$, and distortion $d(x,\\hat x)$, the rate-distortion function is $R(D)=\\min I(X;\\hat X)$ subject to $E[d(X,\\hat X)]\\le D$.</p><p>The minimization keeps only the information needed to meet the allowed average distortion. Loosening $D$ cannot increase the minimum required rate.</p><p><b>Assumptions that matter:</b> the distortion measure must match the task; expectations use the source distribution; the theorem is asymptotic over long blocks; and different applications need different distortion definitions.</p>",
    "worked": {
      "problem": "For a fair binary source with Hamming distortion $D=0.1$, use $R(D)=1-H_2(D)$ and $H_2(0.1)\\approx0.469$.",
      "skills": [
        "constrained optimization",
        "logs",
        "probability arithmetic"
      ],
      "strategy": "Translate the definition into one small calculation at a time, keeping units and direction clear.",
      "steps": [
        {
          "do": "Write the formula",
          "result": "$R(D)=1-H_2(D)$",
          "why": "binary fair source with Hamming distortion"
        },
        {
          "do": "Substitute $D=0.1$",
          "result": "$R(0.1)=1-H_2(0.1)$",
          "why": "allowed error probability"
        },
        {
          "do": "Use the entropy value",
          "result": "$R(0.1)=1-0.469$",
          "why": "given value"
        },
        {
          "do": "Subtract",
          "result": "$R(0.1)=0.531$ bits/symbol",
          "why": "minimum rate at that distortion"
        },
        {
          "do": "Scale to $1000$ symbols",
          "result": "$531$ bits",
          "why": "rate times symbols"
        }
      ],
      "verify": "The result has the right sign and agrees with the qualitative meaning of the definition.",
      "answer": "The minimum asymptotic rate is about $0.531$ bits per symbol.",
      "connects": "This calculation shows the lesson's abstract quantity acting as a concrete numerical guide."
    },
    "practice": [
      {
        "problem": "Compute entropy for a binary source with $P(1)=0.8$ and $P(0)=0.2$ using $\\log_2 0.8\\approx-0.322$ and $\\log_2 0.2\\approx-2.322$.",
        "steps": [
          {
            "do": "Write entropy",
            "result": "$H=-0.8\\log_2 0.8-0.2\\log_2 0.2$",
            "why": "entropy is average surprise"
          },
          {
            "do": "Substitute the logs",
            "result": "$H=-0.8(-0.322)-0.2(-2.322)$",
            "why": "use the provided values"
          },
          {
            "do": "Multiply the first term",
            "result": "$0.2576$",
            "why": "$0.8\\cdot0.322=0.2576$"
          },
          {
            "do": "Multiply the second term",
            "result": "$0.4644$",
            "why": "$0.2\\cdot2.322=0.4644$"
          },
          {
            "do": "Add the contributions",
            "result": "$H\\approx0.722$ bits",
            "why": "average uncertainty is the sum"
          }
        ],
        "answer": "$H\\approx0.722$ bits."
      },
      {
        "problem": "For distributions $P=(0.7,0.3)$ and $Q=(0.5,0.5)$, compute $D_{KL}(P\\|Q)$ using $\\log 1.4\\approx0.336$ and $\\log 0.6\\approx-0.511$.",
        "steps": [
          {
            "do": "Write the KL formula",
            "result": "$D_{KL}(P\\|Q)=0.7\\log(0.7/0.5)+0.3\\log(0.3/0.5)$",
            "why": "compare probabilities component by component"
          },
          {
            "do": "Compute the ratios",
            "result": "$1.4$ and $0.6$",
            "why": "divide $P_i$ by $Q_i$"
          },
          {
            "do": "Substitute logs",
            "result": "$0.7(0.336)+0.3(-0.511)$",
            "why": "use the approximations"
          },
          {
            "do": "Multiply terms",
            "result": "$0.2352-0.1533$",
            "why": "weight each log ratio"
          },
          {
            "do": "Subtract",
            "result": "$0.0819$ nats",
            "why": "KL is small but positive"
          }
        ],
        "answer": "$D_{KL}(P\\|Q)\\approx0.082$ nats."
      },
      {
        "problem": "A code uses lengths $1,2,3,3$ for probabilities $0.4,0.3,0.2,0.1$. Compute expected length.",
        "steps": [
          {
            "do": "Write the average",
            "result": "$L=0.4(1)+0.3(2)+0.2(3)+0.1(3)$",
            "why": "expected length weights each code length"
          },
          {
            "do": "Compute first two terms",
            "result": "$0.4+0.6=1.0$",
            "why": "common symbols dominate the average"
          },
          {
            "do": "Compute last two terms",
            "result": "$0.6+0.3=0.9$",
            "why": "rare symbols have longer codewords"
          },
          {
            "do": "Add totals",
            "result": "$L=1.9$ bits",
            "why": "sum all weighted lengths"
          },
          {
            "do": "Compare to two-bit fixed coding",
            "result": "$2-1.9=0.1$ bit saved",
            "why": "variable length helps"
          }
        ],
        "answer": "The expected length is $1.9$ bits per symbol."
      },
      {
        "problem": "A sequence receives model probabilities $0.9$, $0.5$, and $0.25$ for its actual symbols. Compute the negative log probability in bits.",
        "steps": [
          {
            "do": "Multiply probabilities",
            "result": "$0.9\\cdot0.5\\cdot0.25=0.1125$",
            "why": "independent sequence probabilities multiply"
          },
          {
            "do": "Write code length",
            "result": "$-\\log_2(0.1125)$",
            "why": "negative log probability is ideal length"
          },
          {
            "do": "Split the log",
            "result": "$-\\log_2(0.9)-\\log_2(0.5)-\\log_2(0.25)$",
            "why": "products become sums"
          },
          {
            "do": "Use common values",
            "result": "$0.152+1+2$",
            "why": "$-\\log_2(0.9)\\approx0.152$"
          },
          {
            "do": "Add",
            "result": "$3.152$ bits",
            "why": "total sequence surprise"
          }
        ],
        "answer": "The sequence costs about $3.152$ bits."
      },
      {
        "problem": "A loss has reconstruction term $1.6$ and KL term $0.4$. Compute the negative ELBO, then recompute with KL weight $0.25$.",
        "steps": [
          {
            "do": "Add unweighted terms",
            "result": "$1.6+0.4=2.0$",
            "why": "negative ELBO combines fit and KL"
          },
          {
            "do": "Scale the KL term",
            "result": "$0.25\\cdot0.4=0.1$",
            "why": "apply the weight"
          },
          {
            "do": "Add weighted terms",
            "result": "$1.6+0.1=1.7$",
            "why": "combine reconstruction and weighted KL"
          },
          {
            "do": "Compare objectives",
            "result": "$2.0-1.7=0.3$",
            "why": "down-weighting KL lowers the loss"
          },
          {
            "do": "Interpret the tradeoff",
            "result": "less regularization",
            "why": "the model is allowed to use the latent code more freely"
          }
        ],
        "answer": "Unweighted loss is $2.0$; with KL weight $0.25$, loss is $1.7$."
      }
    ],
    "applications": [
      {
        "title": "Compression budgets",
        "background": "Rate–distortion theory helps turn probability models into concrete storage expectations rather than vague compression hopes.",
        "numbers": "At $1.3$ bits per symbol, $10,000$ symbols need about $13,000$ bits before headers."
      },
      {
        "title": "Classifier losses",
        "background": "In ML, Rate–distortion theory connects naturally to negative log probabilities used for supervised learning.",
        "numbers": "If the true-class probability is $0.8$, the loss is $-\\log(0.8)\\approx0.223$ nats."
      },
      {
        "title": "Latent-variable models",
        "background": "Variational models use information terms to decide how much a latent representation should remember.",
        "numbers": "A reconstruction cost $2.1$ plus KL $0.3$ gives negative ELBO $2.4$."
      },
      {
        "title": "Reinforcement learning policies",
        "background": "Policy optimization often measures how far a new action distribution moved from an old one.",
        "numbers": "Old policy $(0.6,0.4)$ and new $(0.5,0.5)$ have KL about $0.020$ nats."
      },
      {
        "title": "Communication systems",
        "background": "Rates, capacities, and code lengths make noisy links analyzable before hardware is built.",
        "numbers": "A rate of $0.7$ bits/use over $2000$ uses carries $1400$ information bits."
      },
      {
        "title": "Representation learning",
        "background": "Information constraints explain bottlenecks in embeddings, autoencoders, and quantizers.",
        "numbers": "An $8$-bit code can name $2^8=256$ clusters; a $10$-bit code can name $1024$."
      }
    ],
    "applicationsClose": "Across these examples, one idea keeps changing clothes: probabilities become logarithmic costs, and averages become operational limits.",
    "takeaways": [
      "Information-theoretic quantities turn uncertainty into arithmetic.",
      "Logarithms convert probability products into additive costs.",
      "The same entropy and KL terms appear in compression, inference, and ML losses.",
      "Always check the modeling assumptions before treating a bound as a guarantee."
    ]
  },
  "math-21-17": {
    "id": "math-21-17",
    "title": "The maximum entropy principle",
    "tagline": "Maximum entropy says: honor the constraints, then add no extra certainty.",
    "connections": {
      "buildsOn": [
        "Rate–distortion theory",
        "entropy",
        "logarithms"
      ],
      "leadsTo": [
        "f-divergences",
        "information-theoretic ML objectives"
      ],
      "usedWith": [
        "Lagrange multipliers",
        "KL divergence",
        "expected value"
      ]
    },
    "motivation": "<p>Sometimes you know only a few facts, such as a mean or a support. The maximum entropy principle is a disciplined way to avoid inventing details.</p><p>Among all distributions satisfying the known constraints, choose the one with largest entropy.</p>",
    "definition": "<p>The <b>maximum entropy principle</b> maximizes $H(p)=-\\sum_i p_i\\log p_i$ subject to constraints such as $\\sum_i p_i=1$ and $\\sum_i p_i a_i=\\mu$.</p><p>With only finite support and normalization, the maximizer is uniform. Entropy is concave, so spreading mass evenly creates the largest uncertainty when no outcome is distinguished.</p><p><b>Assumptions that matter:</b> the support is part of the model; constraints must be correct; logs may use any base without changing the maximizer; and maximum entropy is a modeling principle, not a guarantee about nature.</p>",
    "worked": {
      "problem": "Find the maximum-entropy distribution on three outcomes with no constraints except total probability $1$.",
      "skills": [
        "Lagrange multipliers",
        "logs",
        "probability arithmetic"
      ],
      "strategy": "Translate the definition into one small calculation at a time, keeping units and direction clear.",
      "steps": [
        {
          "do": "State support size",
          "result": "$n=3$",
          "why": "three outcomes"
        },
        {
          "do": "Use symmetry",
          "result": "$p_1=p_2=p_3$",
          "why": "no outcome is distinguished"
        },
        {
          "do": "Enforce normalization",
          "result": "$3p_i=1$",
          "why": "probabilities sum to 1"
        },
        {
          "do": "Solve",
          "result": "$p_i=1/3$",
          "why": "divide by 3"
        },
        {
          "do": "Compute entropy",
          "result": "$H=\\log_2 3\\approx1.585$ bits",
          "why": "uniform distribution on three outcomes"
        }
      ],
      "verify": "The result has the right sign and agrees with the qualitative meaning of the definition.",
      "answer": "The distribution is $(1/3,1/3,1/3)$ with entropy $\\log_2 3\\approx1.585$ bits.",
      "connects": "This calculation shows the lesson's abstract quantity acting as a concrete numerical guide."
    },
    "practice": [
      {
        "problem": "Compute entropy for a binary source with $P(1)=0.8$ and $P(0)=0.2$ using $\\log_2 0.8\\approx-0.322$ and $\\log_2 0.2\\approx-2.322$.",
        "steps": [
          {
            "do": "Write entropy",
            "result": "$H=-0.8\\log_2 0.8-0.2\\log_2 0.2$",
            "why": "entropy is average surprise"
          },
          {
            "do": "Substitute the logs",
            "result": "$H=-0.8(-0.322)-0.2(-2.322)$",
            "why": "use the provided values"
          },
          {
            "do": "Multiply the first term",
            "result": "$0.2576$",
            "why": "$0.8\\cdot0.322=0.2576$"
          },
          {
            "do": "Multiply the second term",
            "result": "$0.4644$",
            "why": "$0.2\\cdot2.322=0.4644$"
          },
          {
            "do": "Add the contributions",
            "result": "$H\\approx0.722$ bits",
            "why": "average uncertainty is the sum"
          }
        ],
        "answer": "$H\\approx0.722$ bits."
      },
      {
        "problem": "For distributions $P=(0.7,0.3)$ and $Q=(0.5,0.5)$, compute $D_{KL}(P\\|Q)$ using $\\log 1.4\\approx0.336$ and $\\log 0.6\\approx-0.511$.",
        "steps": [
          {
            "do": "Write the KL formula",
            "result": "$D_{KL}(P\\|Q)=0.7\\log(0.7/0.5)+0.3\\log(0.3/0.5)$",
            "why": "compare probabilities component by component"
          },
          {
            "do": "Compute the ratios",
            "result": "$1.4$ and $0.6$",
            "why": "divide $P_i$ by $Q_i$"
          },
          {
            "do": "Substitute logs",
            "result": "$0.7(0.336)+0.3(-0.511)$",
            "why": "use the approximations"
          },
          {
            "do": "Multiply terms",
            "result": "$0.2352-0.1533$",
            "why": "weight each log ratio"
          },
          {
            "do": "Subtract",
            "result": "$0.0819$ nats",
            "why": "KL is small but positive"
          }
        ],
        "answer": "$D_{KL}(P\\|Q)\\approx0.082$ nats."
      },
      {
        "problem": "A code uses lengths $1,2,3,3$ for probabilities $0.4,0.3,0.2,0.1$. Compute expected length.",
        "steps": [
          {
            "do": "Write the average",
            "result": "$L=0.4(1)+0.3(2)+0.2(3)+0.1(3)$",
            "why": "expected length weights each code length"
          },
          {
            "do": "Compute first two terms",
            "result": "$0.4+0.6=1.0$",
            "why": "common symbols dominate the average"
          },
          {
            "do": "Compute last two terms",
            "result": "$0.6+0.3=0.9$",
            "why": "rare symbols have longer codewords"
          },
          {
            "do": "Add totals",
            "result": "$L=1.9$ bits",
            "why": "sum all weighted lengths"
          },
          {
            "do": "Compare to two-bit fixed coding",
            "result": "$2-1.9=0.1$ bit saved",
            "why": "variable length helps"
          }
        ],
        "answer": "The expected length is $1.9$ bits per symbol."
      },
      {
        "problem": "A sequence receives model probabilities $0.9$, $0.5$, and $0.25$ for its actual symbols. Compute the negative log probability in bits.",
        "steps": [
          {
            "do": "Multiply probabilities",
            "result": "$0.9\\cdot0.5\\cdot0.25=0.1125$",
            "why": "independent sequence probabilities multiply"
          },
          {
            "do": "Write code length",
            "result": "$-\\log_2(0.1125)$",
            "why": "negative log probability is ideal length"
          },
          {
            "do": "Split the log",
            "result": "$-\\log_2(0.9)-\\log_2(0.5)-\\log_2(0.25)$",
            "why": "products become sums"
          },
          {
            "do": "Use common values",
            "result": "$0.152+1+2$",
            "why": "$-\\log_2(0.9)\\approx0.152$"
          },
          {
            "do": "Add",
            "result": "$3.152$ bits",
            "why": "total sequence surprise"
          }
        ],
        "answer": "The sequence costs about $3.152$ bits."
      },
      {
        "problem": "A loss has reconstruction term $1.6$ and KL term $0.4$. Compute the negative ELBO, then recompute with KL weight $0.25$.",
        "steps": [
          {
            "do": "Add unweighted terms",
            "result": "$1.6+0.4=2.0$",
            "why": "negative ELBO combines fit and KL"
          },
          {
            "do": "Scale the KL term",
            "result": "$0.25\\cdot0.4=0.1$",
            "why": "apply the weight"
          },
          {
            "do": "Add weighted terms",
            "result": "$1.6+0.1=1.7$",
            "why": "combine reconstruction and weighted KL"
          },
          {
            "do": "Compare objectives",
            "result": "$2.0-1.7=0.3$",
            "why": "down-weighting KL lowers the loss"
          },
          {
            "do": "Interpret the tradeoff",
            "result": "less regularization",
            "why": "the model is allowed to use the latent code more freely"
          }
        ],
        "answer": "Unweighted loss is $2.0$; with KL weight $0.25$, loss is $1.7$."
      }
    ],
    "applications": [
      {
        "title": "Compression budgets",
        "background": "The maximum entropy principle helps turn probability models into concrete storage expectations rather than vague compression hopes.",
        "numbers": "At $1.3$ bits per symbol, $10,000$ symbols need about $13,000$ bits before headers."
      },
      {
        "title": "Classifier losses",
        "background": "In ML, The maximum entropy principle connects naturally to negative log probabilities used for supervised learning.",
        "numbers": "If the true-class probability is $0.8$, the loss is $-\\log(0.8)\\approx0.223$ nats."
      },
      {
        "title": "Latent-variable models",
        "background": "Variational models use information terms to decide how much a latent representation should remember.",
        "numbers": "A reconstruction cost $2.1$ plus KL $0.3$ gives negative ELBO $2.4$."
      },
      {
        "title": "Reinforcement learning policies",
        "background": "Policy optimization often measures how far a new action distribution moved from an old one.",
        "numbers": "Old policy $(0.6,0.4)$ and new $(0.5,0.5)$ have KL about $0.020$ nats."
      },
      {
        "title": "Communication systems",
        "background": "Rates, capacities, and code lengths make noisy links analyzable before hardware is built.",
        "numbers": "A rate of $0.7$ bits/use over $2000$ uses carries $1400$ information bits."
      },
      {
        "title": "Representation learning",
        "background": "Information constraints explain bottlenecks in embeddings, autoencoders, and quantizers.",
        "numbers": "An $8$-bit code can name $2^8=256$ clusters; a $10$-bit code can name $1024$."
      }
    ],
    "applicationsClose": "Across these examples, one idea keeps changing clothes: probabilities become logarithmic costs, and averages become operational limits.",
    "takeaways": [
      "Information-theoretic quantities turn uncertainty into arithmetic.",
      "Logarithms convert probability products into additive costs.",
      "The same entropy and KL terms appear in compression, inference, and ML losses.",
      "Always check the modeling assumptions before treating a bound as a guarantee."
    ]
  },
  "math-21-18": {
    "id": "math-21-18",
    "title": "f-divergences",
    "tagline": "f-divergences compare distributions by applying a convex penalty to probability ratios.",
    "connections": {
      "buildsOn": [
        "The maximum entropy principle",
        "entropy",
        "logarithms"
      ],
      "leadsTo": [
        "The evidence lower bound (ELBO)",
        "information-theoretic ML objectives"
      ],
      "usedWith": [
        "convexity",
        "KL divergence",
        "expected value"
      ]
    },
    "motivation": "<p>KL divergence is famous, but it is one member of a larger family. Different choices punish different mismatches.</p><p>f-divergences organize these measures with one convex-function template.</p>",
    "definition": "<p>For distributions $P$ and $Q$, an $f$-divergence is $D_f(P\\|Q)=\\sum_x Q(x)f(P(x)/Q(x))$, where $f$ is convex and $f(1)=0$.</p><p>If $P=Q$, every ratio equals $1$, so the divergence is zero. Convexity and Jensen's inequality give nonnegativity under the usual support conditions.</p><p><b>Assumptions that matter:</b> $Q(x)>0$ wherever $P(x)>0$ for finite ratios; $P$ and $Q$ share support; $f$ is convex; and the direction can matter.</p>",
    "worked": {
      "problem": "Compute $D_f$ for $f(t)=(t-1)^2$, $P=(0.6,0.4)$, and $Q=(0.5,0.5)$.",
      "skills": [
        "convexity",
        "logs",
        "probability arithmetic"
      ],
      "strategy": "Translate the definition into one small calculation at a time, keeping units and direction clear.",
      "steps": [
        {
          "do": "Compute first ratio",
          "result": "$0.6/0.5=1.2$",
          "why": "divide $P$ by $Q$"
        },
        {
          "do": "Evaluate first penalty",
          "result": "$(1.2-1)^2=0.04$",
          "why": "apply $f$"
        },
        {
          "do": "Weight first penalty",
          "result": "$0.5\\cdot0.04=0.02$",
          "why": "definition weights by $Q$"
        },
        {
          "do": "Compute second ratio",
          "result": "$0.4/0.5=0.8$",
          "why": "second component"
        },
        {
          "do": "Weight second penalty",
          "result": "$0.5(0.8-1)^2=0.02$",
          "why": "same squared difference"
        },
        {
          "do": "Add terms",
          "result": "$D_f=0.04$",
          "why": "sum weighted penalties"
        }
      ],
      "verify": "The result has the right sign and agrees with the qualitative meaning of the definition.",
      "answer": "The divergence is $0.04$.",
      "connects": "This calculation shows the lesson's abstract quantity acting as a concrete numerical guide."
    },
    "practice": [
      {
        "problem": "Compute entropy for a binary source with $P(1)=0.8$ and $P(0)=0.2$ using $\\log_2 0.8\\approx-0.322$ and $\\log_2 0.2\\approx-2.322$.",
        "steps": [
          {
            "do": "Write entropy",
            "result": "$H=-0.8\\log_2 0.8-0.2\\log_2 0.2$",
            "why": "entropy is average surprise"
          },
          {
            "do": "Substitute the logs",
            "result": "$H=-0.8(-0.322)-0.2(-2.322)$",
            "why": "use the provided values"
          },
          {
            "do": "Multiply the first term",
            "result": "$0.2576$",
            "why": "$0.8\\cdot0.322=0.2576$"
          },
          {
            "do": "Multiply the second term",
            "result": "$0.4644$",
            "why": "$0.2\\cdot2.322=0.4644$"
          },
          {
            "do": "Add the contributions",
            "result": "$H\\approx0.722$ bits",
            "why": "average uncertainty is the sum"
          }
        ],
        "answer": "$H\\approx0.722$ bits."
      },
      {
        "problem": "For distributions $P=(0.7,0.3)$ and $Q=(0.5,0.5)$, compute $D_{KL}(P\\|Q)$ using $\\log 1.4\\approx0.336$ and $\\log 0.6\\approx-0.511$.",
        "steps": [
          {
            "do": "Write the KL formula",
            "result": "$D_{KL}(P\\|Q)=0.7\\log(0.7/0.5)+0.3\\log(0.3/0.5)$",
            "why": "compare probabilities component by component"
          },
          {
            "do": "Compute the ratios",
            "result": "$1.4$ and $0.6$",
            "why": "divide $P_i$ by $Q_i$"
          },
          {
            "do": "Substitute logs",
            "result": "$0.7(0.336)+0.3(-0.511)$",
            "why": "use the approximations"
          },
          {
            "do": "Multiply terms",
            "result": "$0.2352-0.1533$",
            "why": "weight each log ratio"
          },
          {
            "do": "Subtract",
            "result": "$0.0819$ nats",
            "why": "KL is small but positive"
          }
        ],
        "answer": "$D_{KL}(P\\|Q)\\approx0.082$ nats."
      },
      {
        "problem": "A code uses lengths $1,2,3,3$ for probabilities $0.4,0.3,0.2,0.1$. Compute expected length.",
        "steps": [
          {
            "do": "Write the average",
            "result": "$L=0.4(1)+0.3(2)+0.2(3)+0.1(3)$",
            "why": "expected length weights each code length"
          },
          {
            "do": "Compute first two terms",
            "result": "$0.4+0.6=1.0$",
            "why": "common symbols dominate the average"
          },
          {
            "do": "Compute last two terms",
            "result": "$0.6+0.3=0.9$",
            "why": "rare symbols have longer codewords"
          },
          {
            "do": "Add totals",
            "result": "$L=1.9$ bits",
            "why": "sum all weighted lengths"
          },
          {
            "do": "Compare to two-bit fixed coding",
            "result": "$2-1.9=0.1$ bit saved",
            "why": "variable length helps"
          }
        ],
        "answer": "The expected length is $1.9$ bits per symbol."
      },
      {
        "problem": "A sequence receives model probabilities $0.9$, $0.5$, and $0.25$ for its actual symbols. Compute the negative log probability in bits.",
        "steps": [
          {
            "do": "Multiply probabilities",
            "result": "$0.9\\cdot0.5\\cdot0.25=0.1125$",
            "why": "independent sequence probabilities multiply"
          },
          {
            "do": "Write code length",
            "result": "$-\\log_2(0.1125)$",
            "why": "negative log probability is ideal length"
          },
          {
            "do": "Split the log",
            "result": "$-\\log_2(0.9)-\\log_2(0.5)-\\log_2(0.25)$",
            "why": "products become sums"
          },
          {
            "do": "Use common values",
            "result": "$0.152+1+2$",
            "why": "$-\\log_2(0.9)\\approx0.152$"
          },
          {
            "do": "Add",
            "result": "$3.152$ bits",
            "why": "total sequence surprise"
          }
        ],
        "answer": "The sequence costs about $3.152$ bits."
      },
      {
        "problem": "A loss has reconstruction term $1.6$ and KL term $0.4$. Compute the negative ELBO, then recompute with KL weight $0.25$.",
        "steps": [
          {
            "do": "Add unweighted terms",
            "result": "$1.6+0.4=2.0$",
            "why": "negative ELBO combines fit and KL"
          },
          {
            "do": "Scale the KL term",
            "result": "$0.25\\cdot0.4=0.1$",
            "why": "apply the weight"
          },
          {
            "do": "Add weighted terms",
            "result": "$1.6+0.1=1.7$",
            "why": "combine reconstruction and weighted KL"
          },
          {
            "do": "Compare objectives",
            "result": "$2.0-1.7=0.3$",
            "why": "down-weighting KL lowers the loss"
          },
          {
            "do": "Interpret the tradeoff",
            "result": "less regularization",
            "why": "the model is allowed to use the latent code more freely"
          }
        ],
        "answer": "Unweighted loss is $2.0$; with KL weight $0.25$, loss is $1.7$."
      }
    ],
    "applications": [
      {
        "title": "Compression budgets",
        "background": "f-divergences helps turn probability models into concrete storage expectations rather than vague compression hopes.",
        "numbers": "At $1.3$ bits per symbol, $10,000$ symbols need about $13,000$ bits before headers."
      },
      {
        "title": "Classifier losses",
        "background": "In ML, f-divergences connects naturally to negative log probabilities used for supervised learning.",
        "numbers": "If the true-class probability is $0.8$, the loss is $-\\log(0.8)\\approx0.223$ nats."
      },
      {
        "title": "Latent-variable models",
        "background": "Variational models use information terms to decide how much a latent representation should remember.",
        "numbers": "A reconstruction cost $2.1$ plus KL $0.3$ gives negative ELBO $2.4$."
      },
      {
        "title": "Reinforcement learning policies",
        "background": "Policy optimization often measures how far a new action distribution moved from an old one.",
        "numbers": "Old policy $(0.6,0.4)$ and new $(0.5,0.5)$ have KL about $0.020$ nats."
      },
      {
        "title": "Communication systems",
        "background": "Rates, capacities, and code lengths make noisy links analyzable before hardware is built.",
        "numbers": "A rate of $0.7$ bits/use over $2000$ uses carries $1400$ information bits."
      },
      {
        "title": "Representation learning",
        "background": "Information constraints explain bottlenecks in embeddings, autoencoders, and quantizers.",
        "numbers": "An $8$-bit code can name $2^8=256$ clusters; a $10$-bit code can name $1024$."
      }
    ],
    "applicationsClose": "Across these examples, one idea keeps changing clothes: probabilities become logarithmic costs, and averages become operational limits.",
    "takeaways": [
      "Information-theoretic quantities turn uncertainty into arithmetic.",
      "Logarithms convert probability products into additive costs.",
      "The same entropy and KL terms appear in compression, inference, and ML losses.",
      "Always check the modeling assumptions before treating a bound as a guarantee."
    ]
  },
  "math-21-19": {
    "id": "math-21-19",
    "title": "The evidence lower bound (ELBO)",
    "tagline": "The ELBO is a tractable lower bound whose gap is exactly a KL divergence.",
    "connections": {
      "buildsOn": [
        "f-divergences",
        "entropy",
        "logarithms"
      ],
      "leadsTo": [
        "Cross-entropy loss, KL in VAEs and RL",
        "information-theoretic ML objectives"
      ],
      "usedWith": [
        "Jensen's inequality",
        "KL divergence",
        "expected value"
      ]
    },
    "motivation": "<p>Latent-variable models hide variables we wish we knew. The evidence $\\log p(x)$ can be hard to compute because it sums or integrates over those hidden variables.</p><p>The ELBO gives a lower bound we can optimize, and the KL gap tells us how tight it is.</p>",
    "definition": "<p>For latent $z$, model $p(x,z)$, and variational distribution $q(z\\mid x)$, $\\text{ELBO}=E_q[\\log p(x,z)-\\log q(z\\mid x)]$.</p><p>The decomposition $\\log p(x)=\\text{ELBO}+D_{KL}(q(z\\mid x)\\|p(z\\mid x))$ makes the lower bound clear because KL divergence is nonnegative.</p><p><b>Assumptions that matter:</b> expectations are under $q$; support must make logs finite; the variational family may limit tightness; and ML usually uses natural logs.</p>",
    "worked": {
      "problem": "If $\\log p(x)=-2.0$ and the KL gap is $0.3$, find the ELBO.",
      "skills": [
        "Jensen's inequality",
        "logs",
        "probability arithmetic"
      ],
      "strategy": "Translate the definition into one small calculation at a time, keeping units and direction clear.",
      "steps": [
        {
          "do": "Write the decomposition",
          "result": "$\\log p(x)=\\text{ELBO}+D_{KL}$",
          "why": "evidence equals bound plus gap"
        },
        {
          "do": "Substitute values",
          "result": "$-2.0=\\text{ELBO}+0.3$",
          "why": "use given numbers"
        },
        {
          "do": "Subtract the gap",
          "result": "$\\text{ELBO}=-2.0-0.3$",
          "why": "isolate the bound"
        },
        {
          "do": "Compute",
          "result": "$\\text{ELBO}=-2.3$",
          "why": "arithmetic"
        },
        {
          "do": "Check direction",
          "result": "$-2.3\\le -2.0$",
          "why": "the bound is below the evidence"
        }
      ],
      "verify": "The result has the right sign and agrees with the qualitative meaning of the definition.",
      "answer": "The ELBO is $-2.3$.",
      "connects": "This calculation shows the lesson's abstract quantity acting as a concrete numerical guide."
    },
    "practice": [
      {
        "problem": "Compute entropy for a binary source with $P(1)=0.8$ and $P(0)=0.2$ using $\\log_2 0.8\\approx-0.322$ and $\\log_2 0.2\\approx-2.322$.",
        "steps": [
          {
            "do": "Write entropy",
            "result": "$H=-0.8\\log_2 0.8-0.2\\log_2 0.2$",
            "why": "entropy is average surprise"
          },
          {
            "do": "Substitute the logs",
            "result": "$H=-0.8(-0.322)-0.2(-2.322)$",
            "why": "use the provided values"
          },
          {
            "do": "Multiply the first term",
            "result": "$0.2576$",
            "why": "$0.8\\cdot0.322=0.2576$"
          },
          {
            "do": "Multiply the second term",
            "result": "$0.4644$",
            "why": "$0.2\\cdot2.322=0.4644$"
          },
          {
            "do": "Add the contributions",
            "result": "$H\\approx0.722$ bits",
            "why": "average uncertainty is the sum"
          }
        ],
        "answer": "$H\\approx0.722$ bits."
      },
      {
        "problem": "For distributions $P=(0.7,0.3)$ and $Q=(0.5,0.5)$, compute $D_{KL}(P\\|Q)$ using $\\log 1.4\\approx0.336$ and $\\log 0.6\\approx-0.511$.",
        "steps": [
          {
            "do": "Write the KL formula",
            "result": "$D_{KL}(P\\|Q)=0.7\\log(0.7/0.5)+0.3\\log(0.3/0.5)$",
            "why": "compare probabilities component by component"
          },
          {
            "do": "Compute the ratios",
            "result": "$1.4$ and $0.6$",
            "why": "divide $P_i$ by $Q_i$"
          },
          {
            "do": "Substitute logs",
            "result": "$0.7(0.336)+0.3(-0.511)$",
            "why": "use the approximations"
          },
          {
            "do": "Multiply terms",
            "result": "$0.2352-0.1533$",
            "why": "weight each log ratio"
          },
          {
            "do": "Subtract",
            "result": "$0.0819$ nats",
            "why": "KL is small but positive"
          }
        ],
        "answer": "$D_{KL}(P\\|Q)\\approx0.082$ nats."
      },
      {
        "problem": "A code uses lengths $1,2,3,3$ for probabilities $0.4,0.3,0.2,0.1$. Compute expected length.",
        "steps": [
          {
            "do": "Write the average",
            "result": "$L=0.4(1)+0.3(2)+0.2(3)+0.1(3)$",
            "why": "expected length weights each code length"
          },
          {
            "do": "Compute first two terms",
            "result": "$0.4+0.6=1.0$",
            "why": "common symbols dominate the average"
          },
          {
            "do": "Compute last two terms",
            "result": "$0.6+0.3=0.9$",
            "why": "rare symbols have longer codewords"
          },
          {
            "do": "Add totals",
            "result": "$L=1.9$ bits",
            "why": "sum all weighted lengths"
          },
          {
            "do": "Compare to two-bit fixed coding",
            "result": "$2-1.9=0.1$ bit saved",
            "why": "variable length helps"
          }
        ],
        "answer": "The expected length is $1.9$ bits per symbol."
      },
      {
        "problem": "A sequence receives model probabilities $0.9$, $0.5$, and $0.25$ for its actual symbols. Compute the negative log probability in bits.",
        "steps": [
          {
            "do": "Multiply probabilities",
            "result": "$0.9\\cdot0.5\\cdot0.25=0.1125$",
            "why": "independent sequence probabilities multiply"
          },
          {
            "do": "Write code length",
            "result": "$-\\log_2(0.1125)$",
            "why": "negative log probability is ideal length"
          },
          {
            "do": "Split the log",
            "result": "$-\\log_2(0.9)-\\log_2(0.5)-\\log_2(0.25)$",
            "why": "products become sums"
          },
          {
            "do": "Use common values",
            "result": "$0.152+1+2$",
            "why": "$-\\log_2(0.9)\\approx0.152$"
          },
          {
            "do": "Add",
            "result": "$3.152$ bits",
            "why": "total sequence surprise"
          }
        ],
        "answer": "The sequence costs about $3.152$ bits."
      },
      {
        "problem": "A loss has reconstruction term $1.6$ and KL term $0.4$. Compute the negative ELBO, then recompute with KL weight $0.25$.",
        "steps": [
          {
            "do": "Add unweighted terms",
            "result": "$1.6+0.4=2.0$",
            "why": "negative ELBO combines fit and KL"
          },
          {
            "do": "Scale the KL term",
            "result": "$0.25\\cdot0.4=0.1$",
            "why": "apply the weight"
          },
          {
            "do": "Add weighted terms",
            "result": "$1.6+0.1=1.7$",
            "why": "combine reconstruction and weighted KL"
          },
          {
            "do": "Compare objectives",
            "result": "$2.0-1.7=0.3$",
            "why": "down-weighting KL lowers the loss"
          },
          {
            "do": "Interpret the tradeoff",
            "result": "less regularization",
            "why": "the model is allowed to use the latent code more freely"
          }
        ],
        "answer": "Unweighted loss is $2.0$; with KL weight $0.25$, loss is $1.7$."
      }
    ],
    "applications": [
      {
        "title": "Compression budgets",
        "background": "The evidence lower bound (ELBO) helps turn probability models into concrete storage expectations rather than vague compression hopes.",
        "numbers": "At $1.3$ bits per symbol, $10,000$ symbols need about $13,000$ bits before headers."
      },
      {
        "title": "Classifier losses",
        "background": "In ML, The evidence lower bound (ELBO) connects naturally to negative log probabilities used for supervised learning.",
        "numbers": "If the true-class probability is $0.8$, the loss is $-\\log(0.8)\\approx0.223$ nats."
      },
      {
        "title": "Latent-variable models",
        "background": "Variational models use information terms to decide how much a latent representation should remember.",
        "numbers": "A reconstruction cost $2.1$ plus KL $0.3$ gives negative ELBO $2.4$."
      },
      {
        "title": "Reinforcement learning policies",
        "background": "Policy optimization often measures how far a new action distribution moved from an old one.",
        "numbers": "Old policy $(0.6,0.4)$ and new $(0.5,0.5)$ have KL about $0.020$ nats."
      },
      {
        "title": "Communication systems",
        "background": "Rates, capacities, and code lengths make noisy links analyzable before hardware is built.",
        "numbers": "A rate of $0.7$ bits/use over $2000$ uses carries $1400$ information bits."
      },
      {
        "title": "Representation learning",
        "background": "Information constraints explain bottlenecks in embeddings, autoencoders, and quantizers.",
        "numbers": "An $8$-bit code can name $2^8=256$ clusters; a $10$-bit code can name $1024$."
      }
    ],
    "applicationsClose": "Across these examples, one idea keeps changing clothes: probabilities become logarithmic costs, and averages become operational limits.",
    "takeaways": [
      "Information-theoretic quantities turn uncertainty into arithmetic.",
      "Logarithms convert probability products into additive costs.",
      "The same entropy and KL terms appear in compression, inference, and ML losses.",
      "Always check the modeling assumptions before treating a bound as a guarantee."
    ]
  },
  "math-21-20": {
    "id": "math-21-20",
    "title": "Cross-entropy loss, KL in VAEs and RL",
    "tagline": "Cross-entropy and KL are the information penalties that quietly train much of modern ML.",
    "connections": {
      "buildsOn": [
        "The evidence lower bound (ELBO)",
        "entropy",
        "logarithms"
      ],
      "leadsTo": [
        "optimization objectives",
        "information-theoretic ML objectives"
      ],
      "usedWith": [
        "regularization",
        "KL divergence",
        "expected value"
      ]
    },
    "motivation": "<p>This capstone connects the whole topic to training loops. Classifiers use cross-entropy, VAEs use reconstruction plus KL, and RL methods use KL to keep policy updates controlled.</p><p>The shared idea is simple: a model pays when it assigns low probability to what happened or moves too far from a reference distribution.</p>",
    "definition": "<p>For one-hot label $y$ and predicted probabilities $\\hat p$, cross-entropy is $L=-\\sum_k y_k\\log \\hat p_k$, which becomes $-\\log$ of the true-class probability. KL is $D_{KL}(q\\|p)=\\sum_i q_i\\log(q_i/p_i)$.</p><p>In VAEs, negative ELBO is reconstruction loss plus $D_{KL}(q(z\\mid x)\\|p(z))$. In RL, a policy KL such as $D_{KL}(\\pi_{old}\\|\\pi_{new})$ measures how far the new action distribution moved.</p><p><b>Assumptions that matter:</b> logs are usually natural in optimization; probabilities being logged must be positive; KL is asymmetric; and loss weights change the tradeoff between fit and regularization.</p>",
    "worked": {
      "problem": "A classifier predicts $[0.1,0.7,0.2]$ and the true class is the second class. Compute the cross-entropy loss.",
      "skills": [
        "regularization",
        "logs",
        "probability arithmetic"
      ],
      "strategy": "Translate the definition into one small calculation at a time, keeping units and direction clear.",
      "steps": [
        {
          "do": "Select the true-class probability",
          "result": "$0.7$",
          "why": "one-hot labels pick one component"
        },
        {
          "do": "Write cross-entropy",
          "result": "$L=-\\log(0.7)$",
          "why": "negative log likelihood"
        },
        {
          "do": "Use the log value",
          "result": "$\\log(0.7)\\approx-0.357$",
          "why": "natural log"
        },
        {
          "do": "Negate",
          "result": "$L\\approx0.357$ nats",
          "why": "loss is positive"
        },
        {
          "do": "Compare with probability $0.2$",
          "result": "$-\\log(0.2)\\approx1.609$",
          "why": "worse confidence pays more"
        }
      ],
      "verify": "The result has the right sign and agrees with the qualitative meaning of the definition.",
      "answer": "The loss is about $0.357$ nats.",
      "connects": "This calculation shows the lesson's abstract quantity acting as a concrete numerical guide."
    },
    "practice": [
      {
        "problem": "Compute entropy for a binary source with $P(1)=0.8$ and $P(0)=0.2$ using $\\log_2 0.8\\approx-0.322$ and $\\log_2 0.2\\approx-2.322$.",
        "steps": [
          {
            "do": "Write entropy",
            "result": "$H=-0.8\\log_2 0.8-0.2\\log_2 0.2$",
            "why": "entropy is average surprise"
          },
          {
            "do": "Substitute the logs",
            "result": "$H=-0.8(-0.322)-0.2(-2.322)$",
            "why": "use the provided values"
          },
          {
            "do": "Multiply the first term",
            "result": "$0.2576$",
            "why": "$0.8\\cdot0.322=0.2576$"
          },
          {
            "do": "Multiply the second term",
            "result": "$0.4644$",
            "why": "$0.2\\cdot2.322=0.4644$"
          },
          {
            "do": "Add the contributions",
            "result": "$H\\approx0.722$ bits",
            "why": "average uncertainty is the sum"
          }
        ],
        "answer": "$H\\approx0.722$ bits."
      },
      {
        "problem": "For distributions $P=(0.7,0.3)$ and $Q=(0.5,0.5)$, compute $D_{KL}(P\\|Q)$ using $\\log 1.4\\approx0.336$ and $\\log 0.6\\approx-0.511$.",
        "steps": [
          {
            "do": "Write the KL formula",
            "result": "$D_{KL}(P\\|Q)=0.7\\log(0.7/0.5)+0.3\\log(0.3/0.5)$",
            "why": "compare probabilities component by component"
          },
          {
            "do": "Compute the ratios",
            "result": "$1.4$ and $0.6$",
            "why": "divide $P_i$ by $Q_i$"
          },
          {
            "do": "Substitute logs",
            "result": "$0.7(0.336)+0.3(-0.511)$",
            "why": "use the approximations"
          },
          {
            "do": "Multiply terms",
            "result": "$0.2352-0.1533$",
            "why": "weight each log ratio"
          },
          {
            "do": "Subtract",
            "result": "$0.0819$ nats",
            "why": "KL is small but positive"
          }
        ],
        "answer": "$D_{KL}(P\\|Q)\\approx0.082$ nats."
      },
      {
        "problem": "A code uses lengths $1,2,3,3$ for probabilities $0.4,0.3,0.2,0.1$. Compute expected length.",
        "steps": [
          {
            "do": "Write the average",
            "result": "$L=0.4(1)+0.3(2)+0.2(3)+0.1(3)$",
            "why": "expected length weights each code length"
          },
          {
            "do": "Compute first two terms",
            "result": "$0.4+0.6=1.0$",
            "why": "common symbols dominate the average"
          },
          {
            "do": "Compute last two terms",
            "result": "$0.6+0.3=0.9$",
            "why": "rare symbols have longer codewords"
          },
          {
            "do": "Add totals",
            "result": "$L=1.9$ bits",
            "why": "sum all weighted lengths"
          },
          {
            "do": "Compare to two-bit fixed coding",
            "result": "$2-1.9=0.1$ bit saved",
            "why": "variable length helps"
          }
        ],
        "answer": "The expected length is $1.9$ bits per symbol."
      },
      {
        "problem": "A sequence receives model probabilities $0.9$, $0.5$, and $0.25$ for its actual symbols. Compute the negative log probability in bits.",
        "steps": [
          {
            "do": "Multiply probabilities",
            "result": "$0.9\\cdot0.5\\cdot0.25=0.1125$",
            "why": "independent sequence probabilities multiply"
          },
          {
            "do": "Write code length",
            "result": "$-\\log_2(0.1125)$",
            "why": "negative log probability is ideal length"
          },
          {
            "do": "Split the log",
            "result": "$-\\log_2(0.9)-\\log_2(0.5)-\\log_2(0.25)$",
            "why": "products become sums"
          },
          {
            "do": "Use common values",
            "result": "$0.152+1+2$",
            "why": "$-\\log_2(0.9)\\approx0.152$"
          },
          {
            "do": "Add",
            "result": "$3.152$ bits",
            "why": "total sequence surprise"
          }
        ],
        "answer": "The sequence costs about $3.152$ bits."
      },
      {
        "problem": "A loss has reconstruction term $1.6$ and KL term $0.4$. Compute the negative ELBO, then recompute with KL weight $0.25$.",
        "steps": [
          {
            "do": "Add unweighted terms",
            "result": "$1.6+0.4=2.0$",
            "why": "negative ELBO combines fit and KL"
          },
          {
            "do": "Scale the KL term",
            "result": "$0.25\\cdot0.4=0.1$",
            "why": "apply the weight"
          },
          {
            "do": "Add weighted terms",
            "result": "$1.6+0.1=1.7$",
            "why": "combine reconstruction and weighted KL"
          },
          {
            "do": "Compare objectives",
            "result": "$2.0-1.7=0.3$",
            "why": "down-weighting KL lowers the loss"
          },
          {
            "do": "Interpret the tradeoff",
            "result": "less regularization",
            "why": "the model is allowed to use the latent code more freely"
          }
        ],
        "answer": "Unweighted loss is $2.0$; with KL weight $0.25$, loss is $1.7$."
      }
    ],
    "applications": [
      {
        "title": "Compression budgets",
        "background": "Cross-entropy loss, KL in VAEs and RL helps turn probability models into concrete storage expectations rather than vague compression hopes.",
        "numbers": "At $1.3$ bits per symbol, $10,000$ symbols need about $13,000$ bits before headers."
      },
      {
        "title": "Classifier losses",
        "background": "In ML, Cross-entropy loss, KL in VAEs and RL connects naturally to negative log probabilities used for supervised learning.",
        "numbers": "If the true-class probability is $0.8$, the loss is $-\\log(0.8)\\approx0.223$ nats."
      },
      {
        "title": "Latent-variable models",
        "background": "Variational models use information terms to decide how much a latent representation should remember.",
        "numbers": "A reconstruction cost $2.1$ plus KL $0.3$ gives negative ELBO $2.4$."
      },
      {
        "title": "Reinforcement learning policies",
        "background": "Policy optimization often measures how far a new action distribution moved from an old one.",
        "numbers": "Old policy $(0.6,0.4)$ and new $(0.5,0.5)$ have KL about $0.020$ nats."
      },
      {
        "title": "Communication systems",
        "background": "Rates, capacities, and code lengths make noisy links analyzable before hardware is built.",
        "numbers": "A rate of $0.7$ bits/use over $2000$ uses carries $1400$ information bits."
      },
      {
        "title": "Representation learning",
        "background": "Information constraints explain bottlenecks in embeddings, autoencoders, and quantizers.",
        "numbers": "An $8$-bit code can name $2^8=256$ clusters; a $10$-bit code can name $1024$."
      }
    ],
    "applicationsClose": "Across these examples, one idea keeps changing clothes: probabilities become logarithmic costs, and averages become operational limits.",
    "takeaways": [
      "Information-theoretic quantities turn uncertainty into arithmetic.",
      "Logarithms convert probability products into additive costs.",
      "The same entropy and KL terms appear in compression, inference, and ML losses.",
      "Always check the modeling assumptions before treating a bound as a guarantee."
    ]
  }
};
