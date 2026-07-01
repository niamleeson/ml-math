module.exports = {
  "math-07-01": {
    "id": "math-07-01",
    "title": "Why measure theory?",
    "tagline": "Measure theory is the careful language for size, probability, and integration when ordinary length is too small a toolbox.",
    "connections": {
      "buildsOn": [
        "sets",
        "functions",
        "limits",
        "basic probability"
      ],
      "leadsTo": [
        "σ-algebras",
        "measures",
        "Lebesgue integration"
      ],
      "usedWith": [
        "set operations",
        "sequences of sets",
        "probability spaces",
        "real analysis"
      ]
    },
    "motivation": "<p>You already know how to measure simple things: an interval $[0,3]$ has length $3$, and a fair coin event has probability $1/2$. That instinct is exactly right.</p><p><b>Measure theory</b> asks for one language that can handle lengths, areas, probabilities, limits of events, and functions with infinitely many small pieces. It is the foundation under modern probability and the reason statements like expected loss, almost everywhere, and convergence in distribution can be made precise.</p>",
    "definition": "<p>A <b>measure-theoretic model</b> has three ingredients: a set $X$ of outcomes, a collection $\\mathcal F$ of subsets of $X$ that we agree are measurable, and a function $\\mu:\\mathcal F\\to[0,\\infty]$ that assigns size. The central rule is countable additivity: if $A_1,A_2,\\ldots$ are disjoint measurable sets, then $$\\mu\\left(\\bigcup_{n=1}^{\\infty}A_n\\right)=\\sum_{n=1}^{\\infty}\\mu(A_n).$$</p><p>This rule extends ordinary addition. Two disjoint intervals of lengths $2$ and $3$ have union length $5$; countable additivity says the same bookkeeping still works for infinitely many non-overlapping pieces.</p><p><b>Assumptions that matter:</b> not every subset must be measurable; $\\mathcal F$ tells us which questions are legal; $\\mu$ may take the value $\\infty$; and disjointness is required before sizes can be added directly.</p>",
    "worked": {
      "problem": "A sample space has disjoint events $A$, $B$, and $C$ with $\\mu(A)=0.2$, $\\mu(B)=0.3$, and $\\mu(C)=0.1$. Find $\\mu(A\\cup B\\cup C)$ and $\\mu((A\\cup B)^{c})$ if $\\mu(X)=1$.",
      "skills": [
        "disjoint unions",
        "complements",
        "probability measure"
      ],
      "strategy": "Use countable additivity for the disjoint union, then subtract from the total size.",
      "steps": [
        {
          "do": "Add $A$ and $B$",
          "result": "$\\mu(A\\cup B)=0.2+0.3=0.5$",
          "why": "disjoint measurable sets have additive measure"
        },
        {
          "do": "Add $C$",
          "result": "$\\mu(A\\cup B\\cup C)=0.5+0.1=0.6$",
          "why": "$C$ is also disjoint from the first two events"
        },
        {
          "do": "Compute the complement size",
          "result": "$\\mu((A\\cup B)^c)=1-0.5$",
          "why": "a set and its complement partition $X$"
        },
        {
          "do": "Subtract",
          "result": "$\\mu((A\\cup B)^c)=0.5$",
          "why": "the total measure is $1$"
        }
      ],
      "verify": "The union of all three events has measure below $1$, so the probabilities are consistent with a probability space.",
      "answer": "$\\mu(A\\cup B\\cup C)=0.6$ and $\\mu((A\\cup B)^c)=0.5$.",
      "connects": "The example shows the whole point of measure theory: legal sets plus a size rule make infinite probability bookkeeping reliable."
    },
    "practice": [
      {
        "problem": "Disjoint sets $E$ and $F$ have $\\mu(E)=4$ and $\\mu(F)=7$. Find $\\mu(E\\cup F)$.",
        "steps": [
          {
            "do": "Check the relation",
            "result": "$E\\cap F=\\varnothing$",
            "why": "the problem says the sets are disjoint"
          },
          {
            "do": "Apply additivity",
            "result": "$\\mu(E\\cup F)=\\mu(E)+\\mu(F)$",
            "why": "sizes add for disjoint measurable sets"
          },
          {
            "do": "Substitute values",
            "result": "$4+7$",
            "why": "use the given measures"
          },
          {
            "do": "Add",
            "result": "$11$",
            "why": "ordinary arithmetic completes the measure calculation"
          }
        ],
        "answer": "$\\mu(E\\cup F)=11$."
      },
      {
        "problem": "In a probability space, $P(A)=0.65$. Find $P(A^c)$.",
        "steps": [
          {
            "do": "Use the total size",
            "result": "$P(X)=1$",
            "why": "probability measures have total mass $1$"
          },
          {
            "do": "Partition the space",
            "result": "$X=A\\cup A^c$",
            "why": "an event and its complement cover all outcomes"
          },
          {
            "do": "Use disjointness",
            "result": "$P(A)+P(A^c)=1$",
            "why": "$A$ and $A^c$ do not overlap"
          },
          {
            "do": "Subtract $P(A)$",
            "result": "$P(A^c)=1-0.65$",
            "why": "isolate the complement probability"
          },
          {
            "do": "Compute",
            "result": "$P(A^c)=0.35$",
            "why": "subtract decimals"
          }
        ],
        "answer": "$P(A^c)=0.35$."
      },
      {
        "problem": "A line segment is split into intervals of lengths $1/2$, $1/4$, and $1/8$. What is the total measured length of their disjoint union?",
        "steps": [
          {
            "do": "Write the measure sum",
            "result": "$\\frac12+\\frac14+\\frac18$",
            "why": "the intervals are disjoint pieces"
          },
          {
            "do": "Use a common denominator",
            "result": "$\\frac48+\\frac28+\\frac18$",
            "why": "eighths compare the lengths directly"
          },
          {
            "do": "Add numerators",
            "result": "$\\frac78$",
            "why": "$4+2+1=7$"
          },
          {
            "do": "Convert to decimal",
            "result": "$0.875$",
            "why": "$7/8=0.875$"
          }
        ],
        "answer": "The total length is $7/8=0.875$."
      },
      {
        "problem": "If $P(A)=0.4$, $P(B)=0.5$, and $P(A\\cap B)=0.2$, find $P(A\\cup B)$.",
        "steps": [
          {
            "do": "Start with inclusion-exclusion",
            "result": "$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$",
            "why": "the overlap would otherwise be counted twice"
          },
          {
            "do": "Substitute values",
            "result": "$0.4+0.5-0.2$",
            "why": "use the given probabilities"
          },
          {
            "do": "Add first",
            "result": "$0.9-0.2$",
            "why": "combine the two event sizes"
          },
          {
            "do": "Subtract the overlap",
            "result": "$0.7$",
            "why": "remove the double count"
          }
        ],
        "answer": "$P(A\\cup B)=0.7$."
      },
      {
        "problem": "A dataset has measurable groups with proportions $0.10$, $0.25$, $0.40$, and $0.25$. What is the measure of the union, and why is this a partition?",
        "steps": [
          {
            "do": "Add the first two groups",
            "result": "$0.10+0.25=0.35$",
            "why": "disjoint group proportions add"
          },
          {
            "do": "Add the third group",
            "result": "$0.35+0.40=0.75$",
            "why": "continue the disjoint union"
          },
          {
            "do": "Add the last group",
            "result": "$0.75+0.25=1.00$",
            "why": "all four groups account for the whole dataset"
          },
          {
            "do": "Interpret the sum",
            "result": "$1.00$",
            "why": "total probability mass means every row belongs to exactly one group"
          }
        ],
        "answer": "The union has measure $1$; the groups form a partition if they are disjoint and cover the dataset."
      }
    ],
    "applications": [
      {
        "title": "Expected loss",
        "background": "Machine learning averages loss over examples. Measure theory says the average is an integral over a probability space, not just a finite sum.",
        "numbers": "If losses $1$, $3$, and $6$ have probabilities $0.2$, $0.5$, and $0.3$, expected loss is $0.2\\cdot1+0.5\\cdot3+0.3\\cdot6=3.5$."
      },
      {
        "title": "Continuous probability",
        "background": "A density assigns probability by area, so single points can have probability zero while intervals have positive probability.",
        "numbers": "For the uniform distribution on $[0,1]$, $P([0.2,0.5])=0.5-0.2=0.3$, but $P(\\{0.2\\})=0$."
      },
      {
        "title": "Dataset slices",
        "background": "Analytics often partitions traffic into measurable cohorts before comparing outcomes.",
        "numbers": "If cohorts have shares $0.15$, $0.35$, and $0.50$, their union has measure $1.00$ when they are disjoint and exhaustive."
      },
      {
        "title": "Risk constraints",
        "background": "Fairness and safety rules often bound the measure of bad events under a data distribution.",
        "numbers": "If failure region $F$ has $P(F)=0.004$, then in $100000$ independent cases the expected failures are $100000\\cdot0.004=400$."
      },
      {
        "title": "Image area",
        "background": "Computer vision masks are measurable regions on a pixel grid or in the continuous image plane.",
        "numbers": "A $200$ by $100$ image has $20000$ pixels; a mask with $3500$ pixels covers $3500/20000=0.175$ of the image."
      },
      {
        "title": "Limit arguments",
        "background": "Generalization theory studies events over infinitely many samples or parameters, where countable unions appear naturally.",
        "numbers": "If bad events have probabilities $0.01/2^n$, their total probability is at most $0.01\\sum_{n=1}^{\\infty}2^{-n}=0.01$."
      }
    ],
    "applicationsClose": "Measure theory keeps one promise across length, probability, data, and limits: only measure legal sets, and add disjoint pieces honestly.",
    "takeaways": [
      "Measure theory studies size through measurable sets and a measure function.",
      "Countable additivity is the engine that lets infinitely many disjoint pieces be handled safely.",
      "Probability, integration, expected loss, and almost-everywhere statements all use this language."
    ]
  },
  "math-07-02": {
    "id": "math-07-02",
    "title": "σ-algebras",
    "tagline": "A $\\sigma$-algebra is the rulebook saying which subsets are measurable and stable under the set operations we need.",
    "connections": {
      "buildsOn": [
        "sets",
        "complements",
        "unions and intersections",
        "Why measure theory?"
      ],
      "leadsTo": [
        "measurable spaces",
        "measures",
        "random variables"
      ],
      "usedWith": [
        "power sets",
        "partitions",
        "set limits",
        "Boolean algebra"
      ]
    },
    "motivation": "<p>You already know that a probability question begins with an event: did it rain, did the model predict class $1$, did the loss exceed $2$? But before assigning probabilities, we need to know which events are allowed.</p><p>A <b>$\\sigma$-algebra</b> is that allowed-event list. It is built to be stable under the questions we naturally ask: not $A$, $A$ or $B$, and countably many alternatives at once.</p>",
    "definition": "<p>Given a set $X$, a collection $\\mathcal F$ of subsets of $X$ is a <b>$\\sigma$-algebra</b> if: $X\\in\\mathcal F$; whenever $A\\in\\mathcal F$, the complement $A^c=X\\setminus A$ is in $\\mathcal F$; and whenever $A_1,A_2,\\ldots\\in\\mathcal F$, the countable union $\\bigcup_{n=1}^{\\infty}A_n$ is in $\\mathcal F$.</p><p>Countable intersections then come for free because $$\\bigcap_{n=1}^{\\infty}A_n=\\left(\\bigcup_{n=1}^{\\infty}A_n^c\\right)^c.$$ Complements and countable unions therefore also give countable intersections.</p><p><b>Assumptions that matter:</b> every set in $\\mathcal F$ must be a subset of the same underlying set $X$; closure under finite unions follows from countable union by repeating or padding with empty sets; and a $\\sigma$-algebra says what is measurable, not how large it is.</p>",
    "worked": {
      "problem": "Let $X=\\{1,2,3,4\\}$ and $\\mathcal F=\\{\\varnothing,X,\\{1,2\\},\\{3,4\\}\\}$. Show that $\\mathcal F$ is a $\\sigma$-algebra.",
      "skills": [
        "set complements",
        "unions",
        "$\\sigma$-algebra checks"
      ],
      "strategy": "Check the required closure rules one at a time; the collection is small enough to list the outcomes.",
      "steps": [
        {
          "do": "Check that $X$ is included",
          "result": "$X\\in\\mathcal F$",
          "why": "the whole space is listed"
        },
        {
          "do": "Check the complement of $\\varnothing$",
          "result": "$\\varnothing^c=X$",
          "why": "both sets are listed"
        },
        {
          "do": "Check the complement of $\\{1,2\\}$",
          "result": "$\\{1,2\\}^c=\\{3,4\\}$",
          "why": "the complementary block is listed"
        },
        {
          "do": "Check the complement of $\\{3,4\\}$",
          "result": "$\\{3,4\\}^c=\\{1,2\\}$",
          "why": "closure under complements holds"
        },
        {
          "do": "Check unions of blocks",
          "result": "$\\{1,2\\}\\cup\\{3,4\\}=X$",
          "why": "all possible unions stay in the collection"
        }
      ],
      "verify": "The only listed building blocks are two complementary pieces; any countable union repeats $\\varnothing$, one block, or both blocks.",
      "answer": "$\\mathcal F$ is a $\\sigma$-algebra on $X$.",
      "connects": "A $\\sigma$-algebra can be much smaller than the full power set while still supporting complements and countable unions."
    },
    "practice": [
      {
        "problem": "For $X=\\{a,b\\}$, list the power set $\\mathcal P(X)$ and decide whether it is a $\\sigma$-algebra.",
        "steps": [
          {
            "do": "List subsets with no elements",
            "result": "$\\varnothing$",
            "why": "the empty set is always a subset"
          },
          {
            "do": "List one-element subsets",
            "result": "$\\{a\\},\\{b\\}$",
            "why": "each element can appear alone"
          },
          {
            "do": "List the full subset",
            "result": "$\\{a,b\\}=X$",
            "why": "all elements together form the whole space"
          },
          {
            "do": "Check closure",
            "result": "complements and unions stay in the list",
            "why": "the power set contains every subset"
          }
        ],
        "answer": "$\\mathcal P(X)=\\{\\varnothing,\\{a\\},\\{b\\},X\\}$, and it is a $\\sigma$-algebra."
      },
      {
        "problem": "Let $X=\\{1,2,3\\}$ and $\\mathcal G=\\{\\varnothing,X,\\{1\\}\\}$. Is $\\mathcal G$ a $\\sigma$-algebra?",
        "steps": [
          {
            "do": "Check $X$",
            "result": "$X\\in\\mathcal G$",
            "why": "the first requirement holds"
          },
          {
            "do": "Choose a listed set",
            "result": "$\\{1\\}\\in\\mathcal G$",
            "why": "test complement closure"
          },
          {
            "do": "Take its complement",
            "result": "$\\{1\\}^c=\\{2,3\\}$",
            "why": "complement is relative to $X$"
          },
          {
            "do": "Compare with $\\mathcal G$",
            "result": "$\\{2,3\\}\\notin\\mathcal G$",
            "why": "the required complement is missing"
          },
          {
            "do": "Conclude",
            "result": "not a $\\sigma$-algebra",
            "why": "one failed closure rule is enough"
          }
        ],
        "answer": "No. It is not closed under complements."
      },
      {
        "problem": "If $A$ belongs to a $\\sigma$-algebra $\\mathcal F$, prove that $\\varnothing$ belongs to $\\mathcal F$.",
        "steps": [
          {
            "do": "Use the definition",
            "result": "$X\\in\\mathcal F$",
            "why": "the whole space must be measurable"
          },
          {
            "do": "Take a complement",
            "result": "$X^c=\\varnothing$",
            "why": "complements are relative to $X$"
          },
          {
            "do": "Apply complement closure",
            "result": "$\\varnothing\\in\\mathcal F$",
            "why": "the complement of a measurable set is measurable"
          },
          {
            "do": "Notice $A$ was not needed",
            "result": "the result follows from $X$ alone",
            "why": "every $\\sigma$-algebra contains the empty set"
          }
        ],
        "answer": "$\\varnothing\\in\\mathcal F$."
      },
      {
        "problem": "Let $\\mathcal F$ be a $\\sigma$-algebra and $A,B\\in\\mathcal F$. Show that $A\\cap B\\in\\mathcal F$.",
        "steps": [
          {
            "do": "Take complements",
            "result": "$A^c,B^c\\in\\mathcal F$",
            "why": "closure under complements"
          },
          {
            "do": "Take a union",
            "result": "$A^c\\cup B^c\\in\\mathcal F$",
            "why": "finite unions are countable unions"
          },
          {
            "do": "Take the complement",
            "result": "$(A^c\\cup B^c)^c\\in\\mathcal F$",
            "why": "closure under complements again"
          },
          {
            "do": "Use De Morgan's law",
            "result": "$(A^c\\cup B^c)^c=A\\cap B$",
            "why": "intersection is built from complement and union"
          }
        ],
        "answer": "$A\\cap B$ is measurable."
      },
      {
        "problem": "A model logs only whether a score is below $0.5$ or at least $0.5$. On $X=[0,1]$, write the $\\sigma$-algebra generated by this two-bin observation.",
        "steps": [
          {
            "do": "Name the first bin",
            "result": "$B_0=[0,0.5)$",
            "why": "scores below the threshold share one observation"
          },
          {
            "do": "Name the second bin",
            "result": "$B_1=[0.5,1]$",
            "why": "scores at or above the threshold share the other observation"
          },
          {
            "do": "Include the empty and whole sets",
            "result": "$\\varnothing$ and $X$",
            "why": "every $\\sigma$-algebra contains them"
          },
          {
            "do": "Include both bins",
            "result": "$B_0$ and $B_1$",
            "why": "the observation can distinguish exactly these events"
          },
          {
            "do": "List the collection",
            "result": "$\\{\\varnothing,X,B_0,B_1\\}$",
            "why": "the two bins are complements"
          }
        ],
        "answer": "The generated $\\sigma$-algebra is $\\{\\varnothing,X,[0,0.5),[0.5,1]\\}$."
      }
    ],
    "applications": [
      {
        "title": "Coarse logging",
        "background": "A product log may record only categories, not exact values. The measurable events are unions of recorded categories.",
        "numbers": "If categories have counts $20$, $50$, and $30$ out of $100$, the event category 1 or 2 has measurable mass $(20+50)/100=0.70$."
      },
      {
        "title": "Feature binning",
        "background": "Tree models and dashboards often bin continuous features. The bins generate a smaller $\\sigma$-algebra than all intervals.",
        "numbers": "Bins $[0,10)$, $[10,20)$, $[20,30]$ allow the event $x\\ge10$ with mass $45+15=60$ if bin counts are $40,45,15$."
      },
      {
        "title": "Privacy views",
        "background": "Privacy systems deliberately expose only coarse events. A $\\sigma$-algebra captures what can be asked without revealing finer data.",
        "numbers": "If only age groups under 18 and at least 18 are visible, a dataset with $120$ minors among $1000$ users gives visible event mass $0.12$."
      },
      {
        "title": "Classification labels",
        "background": "A label space with $k$ classes usually uses the full power set, because any collection of classes can be an event.",
        "numbers": "For $3$ classes, the power set has $2^3=8$ measurable label events."
      },
      {
        "title": "A/B testing",
        "background": "Experiments need events closed under combining variants and taking complements.",
        "numbers": "If variant A has $480$ users and variant B has $520$, the complement of A has measure $520/1000=0.52$."
      },
      {
        "title": "Monitoring alerts",
        "background": "Alert systems combine conditions with or, and not. Closure rules keep compound alerts measurable.",
        "numbers": "If CPU alert has probability $0.04$, memory alert $0.03$, and overlap $0.01$, their union alert is $0.04+0.03-0.01=0.06$."
      }
    ],
    "applicationsClose": "A $\\sigma$-algebra is the quiet contract behind every probability statement: it names the events that survive reliable logical operations.",
    "takeaways": [
      "A $\\sigma$-algebra contains $X$, is closed under complements, and is closed under countable unions.",
      "It is automatically closed under countable intersections by De Morgan's law.",
      "It controls measurability; a measure later assigns sizes to the measurable sets."
    ]
  },
  "math-07-03": {
    "id": "math-07-03",
    "title": "Measurable spaces",
    "tagline": "A measurable space is a universe together with the events we are allowed to inspect.",
    "connections": {
      "buildsOn": [
        "σ-algebras",
        "sets",
        "functions"
      ],
      "leadsTo": [
        "measures",
        "probability spaces",
        "measurable functions"
      ],
      "usedWith": [
        "Borel sets",
        "sample spaces",
        "partitions",
        "product spaces"
      ]
    },
    "motivation": "<p>You can think of raw data as a universe of possible outcomes. But analysis does not use the universe alone; it also needs a rule for which questions about the universe are legitimate.</p><p>A <b>measurable space</b> packages those two things together. It says: here are the possible outcomes, and here are the subsets we can measure, observe, or assign probabilities to.</p>",
    "definition": "<p>A <b>measurable space</b> is a pair $(X,\\mathcal F)$ where $X$ is a set and $\\mathcal F$ is a $\\sigma$-algebra of subsets of $X$. The members of $\\mathcal F$ are called measurable sets.</p><p>The pair matters. The same underlying set $X$ can carry different $\\sigma$-algebras. For $X=\\{1,2,3,4\\}$, the full power set can observe every subset, while $\\{\\varnothing,X,\\{1,2\\},\\{3,4\\}\\}$ can only distinguish the two blocks.</p><p><b>Assumptions that matter:</b> a measurable space does not yet assign sizes; it only defines legal sets; all measurable sets are subsets of $X$; and changing $\\mathcal F$ changes which functions and events are measurable.</p>",
    "worked": {
      "problem": "Let $X=\\{1,2,3,4\\}$ and $\\mathcal F=\\{\\varnothing,X,\\{1,2\\},\\{3,4\\}\\}$. Decide whether $A=\\{1\\}$ and $B=\\{1,2\\}$ are measurable in $(X,\\mathcal F)$.",
      "skills": [
        "measurable sets",
        "membership in a $\\sigma$-algebra",
        "coarse observations"
      ],
      "strategy": "Measurability here is not about intuition; it is membership in the chosen $\\sigma$-algebra.",
      "steps": [
        {
          "do": "List the measurable candidates",
          "result": "$\\varnothing,X,\\{1,2\\},\\{3,4\\}$",
          "why": "these are exactly the sets in $\\mathcal F$"
        },
        {
          "do": "Check $A$",
          "result": "$\\{1\\}\\notin\\mathcal F$",
          "why": "singletons are not visible in this coarse space"
        },
        {
          "do": "Check $B$",
          "result": "$\\{1,2\\}\\in\\mathcal F$",
          "why": "the whole first block is listed"
        },
        {
          "do": "State $A$'s status",
          "result": "$A$ is not measurable",
          "why": "measurable means belonging to $\\mathcal F$"
        },
        {
          "do": "State $B$'s status",
          "result": "$B$ is measurable",
          "why": "it is one of the legal events"
        }
      ],
      "verify": "The space can distinguish the first block from the second block, but not individual points inside a block.",
      "answer": "$A$ is not measurable; $B$ is measurable.",
      "connects": "The $\\sigma$-algebra is the lens; the same set $X$ looks fine or coarse depending on that lens."
    },
    "practice": [
      {
        "problem": "For $X=\\{H,T\\}$ and $\\mathcal F=\\mathcal P(X)$, is $(X,\\mathcal F)$ a measurable space?",
        "steps": [
          {
            "do": "List the set",
            "result": "$X=\\{H,T\\}$",
            "why": "coin outcomes form the universe"
          },
          {
            "do": "Identify $\\mathcal F$",
            "result": "$\\mathcal P(X)$",
            "why": "the power set contains every subset"
          },
          {
            "do": "Use a known fact",
            "result": "$\\mathcal P(X)$ is a $\\sigma$-algebra",
            "why": "all complements and unions remain subsets"
          },
          {
            "do": "Apply the definition",
            "result": "$(X,\\mathcal F)$ is a measurable space",
            "why": "a set plus a $\\sigma$-algebra is enough"
          }
        ],
        "answer": "Yes. It is a measurable space."
      },
      {
        "problem": "Let $X=\\{1,2,3\\}$ and $\\mathcal F=\\{\\varnothing,X,\\{1\\},\\{2,3\\}\\}$. Which singletons are measurable?",
        "steps": [
          {
            "do": "Check $\\{1\\}$",
            "result": "$\\{1\\}\\in\\mathcal F$",
            "why": "it is listed"
          },
          {
            "do": "Check $\\{2\\}$",
            "result": "$\\{2\\}\\notin\\mathcal F$",
            "why": "it is not listed"
          },
          {
            "do": "Check $\\{3\\}$",
            "result": "$\\{3\\}\\notin\\mathcal F$",
            "why": "it is not listed"
          },
          {
            "do": "Interpret the block",
            "result": "$\\{2,3\\}$ is measurable",
            "why": "the space sees 2 and 3 together"
          },
          {
            "do": "Answer the singleton question",
            "result": "only $\\{1\\}$",
            "why": "only membership in $\\mathcal F$ counts"
          }
        ],
        "answer": "Only the singleton $\\{1\\}$ is measurable."
      },
      {
        "problem": "On $X=\\mathbb R$, suppose $\\mathcal F=\\{\\varnothing,\\mathbb R\\}$. Is $[0,1]$ measurable?",
        "steps": [
          {
            "do": "Name the $\\sigma$-algebra",
            "result": "$\\mathcal F=\\{\\varnothing,\\mathbb R\\}$",
            "why": "this is the trivial $\\sigma$-algebra"
          },
          {
            "do": "Compare $[0,1]$ with $\\varnothing$",
            "result": "$[0,1]\\ne\\varnothing$",
            "why": "the interval has points"
          },
          {
            "do": "Compare $[0,1]$ with $\\mathbb R$",
            "result": "$[0,1]\\ne\\mathbb R$",
            "why": "many real numbers are outside the interval"
          },
          {
            "do": "Use membership",
            "result": "$[0,1]\\notin\\mathcal F$",
            "why": "the interval is not a legal event"
          }
        ],
        "answer": "No. $[0,1]$ is not measurable in the trivial measurable space."
      },
      {
        "problem": "A sensor reports low for $X<10$ and high for $X\\ge10$. Write the measurable space on $\\mathbb R$ generated by that report.",
        "steps": [
          {
            "do": "Name the low event",
            "result": "$L=(-\\infty,10)$",
            "why": "the report groups all low readings"
          },
          {
            "do": "Name the high event",
            "result": "$H=[10,\\infty)$",
            "why": "the report groups all high readings"
          },
          {
            "do": "Include required sets",
            "result": "$\\varnothing$ and $\\mathbb R$",
            "why": "every $\\sigma$-algebra contains them"
          },
          {
            "do": "Use complements",
            "result": "$L^c=H$",
            "why": "the two report events are complements"
          },
          {
            "do": "List the generated $\\sigma$-algebra",
            "result": "$\\{\\varnothing,\\mathbb R,L,H\\}$",
            "why": "no finer question is observable"
          }
        ],
        "answer": "The measurable space is $(\\mathbb R,\\{\\varnothing,\\mathbb R,(-\\infty,10),[10,\\infty)\\})$."
      },
      {
        "problem": "A finite dataset has $100$ rows, but the measurable space only observes three disjoint groups of sizes $20$, $30$, and $50$. How many measurable sets are generated by the groups?",
        "steps": [
          {
            "do": "Count the atoms",
            "result": "$3$ groups",
            "why": "each group is an indivisible observed block"
          },
          {
            "do": "Recall subset counting",
            "result": "$2^3$ unions",
            "why": "each group is either included or not included"
          },
          {
            "do": "Compute",
            "result": "$2^3=8$",
            "why": "three binary choices"
          },
          {
            "do": "Interpret",
            "result": "$8$ measurable sets",
            "why": "all legal events are unions of the three groups"
          }
        ],
        "answer": "The generated $\\sigma$-algebra has $8$ measurable sets."
      }
    ],
    "applications": [
      {
        "title": "Raw samples versus observable events",
        "background": "Data platforms often store raw rows but expose only approved slices. The measurable space separates the universe from visible events.",
        "numbers": "If $1000$ rows are exposed through $4$ disjoint segments, the generated $\\sigma$-algebra has $2^4=16$ visible events."
      },
      {
        "title": "Borel measurable data",
        "background": "Real-valued features usually use the Borel measurable space, generated by open intervals, because thresholds and intervals must be observable.",
        "numbers": "The event $2\\le x<5$ has length $3$, so a uniform feature on $[0,10]$ gives probability $3/10=0.3$."
      },
      {
        "title": "Label spaces",
        "background": "Classification labels form finite measurable spaces, usually with every subset measurable.",
        "numbers": "For $5$ labels, the full label $\\sigma$-algebra has $2^5=32$ events."
      },
      {
        "title": "Coarsened telemetry",
        "background": "Monitoring systems often aggregate values before storage. The measurable space remembers only the aggregate bins.",
        "numbers": "With bins normal, slow, failed and counts $900$, $80$, $20$, the event not normal has mass $(80+20)/1000=0.10$."
      },
      {
        "title": "Random variables",
        "background": "A random variable is a measurable function from an outcome space into a value space, so both spaces matter.",
        "numbers": "If a coin space maps $H\\mapsto1$ and $T\\mapsto0$, the event output at least $0.5$ pulls back to $\\{H\\}$ with probability $0.5$."
      },
      {
        "title": "Product observations",
        "background": "Combining two features creates a product universe and measurable rectangles before more complex events are built.",
        "numbers": "If feature A has $3$ bins and feature B has $2$ bins, their grid has $3\\cdot2=6$ rectangle cells."
      }
    ],
    "applicationsClose": "A measurable space is the stage before measurement: it tells us what can be seen, named, and later assigned size.",
    "takeaways": [
      "A measurable space is a pair $(X,\\mathcal F)$ with $\\mathcal F$ a $\\sigma$-algebra on $X$.",
      "Measurability of a set means membership in the chosen $\\sigma$-algebra.",
      "Different $\\sigma$-algebras on the same $X$ produce different levels of observable detail."
    ]
  },
  "math-07-04": {
    "id": "math-07-04",
    "title": "Measures",
    "tagline": "A measure assigns size to measurable sets while preserving the arithmetic of disjoint pieces.",
    "connections": {
      "buildsOn": [
        "measurable spaces",
        "σ-algebras",
        "series"
      ],
      "leadsTo": [
        "probability measures",
        "outer measure",
        "Lebesgue measure",
        "integration"
      ],
      "usedWith": [
        "counting measure",
        "Dirac measure",
        "finite measures",
        "signed measures"
      ]
    },
    "motivation": "<p>Once a measurable space tells us which sets are legal, the next question is beautifully natural: how big are they?</p><p>A <b>measure</b> answers that question. Length is a measure on intervals, probability is a measure on events, counting is a measure on finite sets, and all of them share one rule: split into disjoint pieces, then add.</p>",
    "definition": "<p>On a measurable space $(X,\\mathcal F)$, a <b>measure</b> is a function $\\mu:\\mathcal F\\to[0,\\infty]$ such that $\\mu(\\varnothing)=0$ and, for any disjoint sequence $A_1,A_2,\\ldots$ in $\\mathcal F$, $$\\mu\\left(\\bigcup_{n=1}^{\\infty}A_n\\right)=\\sum_{n=1}^{\\infty}\\mu(A_n).$$</p><p>Monotonicity follows from this rule. If $A\\subseteq B$, then $B=A\\cup(B\\setminus A)$ disjointly, so $\\mu(B)=\\mu(A)+\\mu(B\\setminus A)\\ge\\mu(A)$.</p><p><b>Assumptions that matter:</b> $\\mu$ is only defined on measurable sets; values cannot be negative; countable additivity needs disjointness; and a probability measure is the special case with $\\mu(X)=1$.</p>",
    "worked": {
      "problem": "Counting measure on $X=\\{a,b,c,d,e\\}$ assigns $\\mu(A)$ equal to the number of elements in $A$. For $A=\\{a,c\\}$ and $B=\\{b,d,e\\}$, find $\\mu(A)$, $\\mu(B)$, and $\\mu(A\\cup B)$.",
      "skills": [
        "counting measure",
        "disjoint additivity",
        "finite sets"
      ],
      "strategy": "Count each set, then use disjoint additivity for the union.",
      "steps": [
        {
          "do": "Count elements of $A$",
          "result": "$\\mu(A)=2$",
          "why": "$A$ contains $a$ and $c$"
        },
        {
          "do": "Count elements of $B$",
          "result": "$\\mu(B)=3$",
          "why": "$B$ contains $b$, $d$, and $e$"
        },
        {
          "do": "Check overlap",
          "result": "$A\\cap B=\\varnothing$",
          "why": "the listed elements are distinct"
        },
        {
          "do": "Apply additivity",
          "result": "$\\mu(A\\cup B)=2+3$",
          "why": "disjoint pieces add"
        },
        {
          "do": "Add",
          "result": "$\\mu(A\\cup B)=5$",
          "why": "the union is all five elements"
        }
      ],
      "verify": "The union has exactly the five elements in $X$, so the count $5$ is consistent.",
      "answer": "$\\mu(A)=2$, $\\mu(B)=3$, and $\\mu(A\\cup B)=5$.",
      "connects": "Counting measure is the simplest model of a measure: size means number of points."
    },
    "practice": [
      {
        "problem": "Lebesgue-style length gives $\\mu([2,7])=5$. Find the length of $[2,4]\\cup[5,7]$.",
        "steps": [
          {
            "do": "Measure the first interval",
            "result": "$4-2=2$",
            "why": "length is right endpoint minus left endpoint"
          },
          {
            "do": "Measure the second interval",
            "result": "$7-5=2$",
            "why": "same length rule"
          },
          {
            "do": "Check disjointness",
            "result": "$[2,4]\\cap[5,7]=\\varnothing$",
            "why": "there is a gap between $4$ and $5$"
          },
          {
            "do": "Add lengths",
            "result": "$2+2=4$",
            "why": "disjoint intervals add"
          }
        ],
        "answer": "The total length is $4$."
      },
      {
        "problem": "A probability measure has $P(A)=0.25$ and $P(B)=0.40$ for disjoint events. Find $P(A\\cup B)$.",
        "steps": [
          {
            "do": "Check the condition",
            "result": "$A\\cap B=\\varnothing$",
            "why": "the problem says disjoint"
          },
          {
            "do": "Use countable additivity",
            "result": "$P(A\\cup B)=P(A)+P(B)$",
            "why": "finite additivity is included"
          },
          {
            "do": "Substitute",
            "result": "$0.25+0.40$",
            "why": "use given probabilities"
          },
          {
            "do": "Add",
            "result": "$0.65$",
            "why": "decimal addition"
          }
        ],
        "answer": "$P(A\\cup B)=0.65$."
      },
      {
        "problem": "If $A\\subseteq B$, $\\mu(A)=3$, and $\\mu(B\\setminus A)=8$, find $\\mu(B)$.",
        "steps": [
          {
            "do": "Decompose $B$",
            "result": "$B=A\\cup(B\\setminus A)$",
            "why": "split $B$ into inside $A$ and outside $A$"
          },
          {
            "do": "Note disjointness",
            "result": "$A\\cap(B\\setminus A)=\\varnothing$",
            "why": "an element cannot be both in and outside $A$"
          },
          {
            "do": "Apply additivity",
            "result": "$\\mu(B)=\\mu(A)+\\mu(B\\setminus A)$",
            "why": "disjoint decomposition"
          },
          {
            "do": "Substitute and add",
            "result": "$3+8=11$",
            "why": "use the given sizes"
          }
        ],
        "answer": "$\\mu(B)=11$."
      },
      {
        "problem": "For counting measure on integers, find $\\mu(\\{2,4,6,8\\})$ and $\\mu(\\varnothing)$.",
        "steps": [
          {
            "do": "Count the listed integers",
            "result": "$4$",
            "why": "there are four elements"
          },
          {
            "do": "Apply counting measure",
            "result": "$\\mu(\\{2,4,6,8\\})=4$",
            "why": "size equals cardinality"
          },
          {
            "do": "Count the empty set",
            "result": "$0$",
            "why": "there are no elements"
          },
          {
            "do": "Apply the measure axiom",
            "result": "$\\mu(\\varnothing)=0$",
            "why": "every measure assigns zero to the empty set"
          }
        ],
        "answer": "The measures are $4$ and $0$."
      },
      {
        "problem": "A discrete distribution has masses $0.1$, $0.2$, $0.3$, and $0.4$ on four outcomes. Verify it is a probability measure on the full finite space.",
        "steps": [
          {
            "do": "Check nonnegativity",
            "result": "$0.1,0.2,0.3,0.4\\ge0$",
            "why": "measures cannot assign negative mass"
          },
          {
            "do": "Add the masses",
            "result": "$0.1+0.2+0.3+0.4$",
            "why": "the whole space is the disjoint union of atoms"
          },
          {
            "do": "Compute the total",
            "result": "$1.0$",
            "why": "the masses sum to one"
          },
          {
            "do": "Apply the probability condition",
            "result": "$\\mu(X)=1$",
            "why": "total mass one defines a probability measure"
          }
        ],
        "answer": "Yes. The masses define a probability measure."
      }
    ],
    "applications": [
      {
        "title": "Empirical distributions",
        "background": "Training data often uses the empirical measure, which puts equal mass on each example.",
        "numbers": "For $500$ examples, each row has mass $1/500=0.002$; a subset of $35$ rows has mass $35/500=0.07$."
      },
      {
        "title": "Counting tokens",
        "background": "Natural-language processing often measures finite sets by counts before normalizing to probabilities.",
        "numbers": "If a document has token counts $cat:3$ and $dog:2$, counting measure of $\\{cat,dog\\}$ occurrences is $5$."
      },
      {
        "title": "Probability models",
        "background": "A probability distribution is a measure with total mass one, giving sizes to events.",
        "numbers": "A Bernoulli variable with $P(1)=0.7$ has $P(0)=1-0.7=0.3$."
      },
      {
        "title": "Weighted sampling",
        "background": "Importance sampling changes the measure by assigning unequal weights to examples.",
        "numbers": "Weights $2$, $1$, and $1$ normalize to probabilities $0.5$, $0.25$, and $0.25$."
      },
      {
        "title": "Geometric area",
        "background": "Computer vision and graphics use area measures for regions and masks.",
        "numbers": "A rectangle from $x=1$ to $5$ and $y=2$ to $8$ has area measure $(5-1)(8-2)=24$."
      },
      {
        "title": "Dirac measure",
        "background": "A point mass, or Dirac measure, is useful for deterministic outcomes and degenerate distributions.",
        "numbers": "If $\\delta_3$ puts all mass at $3$, then $\\delta_3(\\{3\\})=1$ and $\\delta_3([0,2])=0$."
      }
    ],
    "applicationsClose": "Measures make size arithmetic portable: count, length, area, probability, and weighted data all obey the same disjoint-addition law.",
    "takeaways": [
      "A measure maps measurable sets to nonnegative sizes, possibly $\\infty$.",
      "Countable additivity is the defining arithmetic rule for disjoint measurable sets.",
      "Probability, counting, length, and point mass are all measures with different interpretations."
    ]
  },
  "math-07-05": {
    "id": "math-07-05",
    "title": "Outer measure",
    "tagline": "Outer measure estimates size from the outside, before we know exactly which sets deserve to be measurable.",
    "connections": {
      "buildsOn": [
        "measures",
        "infimum",
        "countable covers",
        "interval length"
      ],
      "leadsTo": [
        "Lebesgue measure",
        "Carathéodory measurability",
        "measurable sets"
      ],
      "usedWith": [
        "covers",
        "subadditivity",
        "infima",
        "metric spaces"
      ]
    },
    "motivation": "<p>Sometimes a set is too irregular to measure directly. A wise first move is to cover it by simple pieces whose sizes we understand, then ask how small the total covering size can be.</p><p><b>Outer measure</b> does exactly that. It measures from the outside, like wrapping a strange object in smaller and smaller boxes until the best possible wrapper reveals its size.</p>",
    "definition": "<p>On $\\mathbb R$, the Lebesgue outer measure of a set $E$ is $$m^*(E)=\\inf\\left\\{\\sum_{n=1}^{\\infty} |I_n|: E\\subseteq\\bigcup_{n=1}^{\\infty} I_n,\\ I_n \\text{ open intervals}\\right\\},$$ where $|I_n|$ is interval length. The infimum means the greatest lower bound over all countable interval covers.</p><p>Outer measure always has $m^*(\\varnothing)=0$, monotonicity, and countable subadditivity: $m^*(\\bigcup E_n)\\le\\sum m^*(E_n)$. Subadditivity comes by covering each $E_n$ nearly optimally and then combining all those covers.</p><p><b>Assumptions that matter:</b> outer measure is defined for every subset, but it is not countably additive on every possible subset; measurability is the later condition that identifies sets where additivity behaves correctly.</p>",
    "worked": {
      "problem": "Show that $m^*(\\{2\\})=0$ on the real line.",
      "skills": [
        "interval covers",
        "infimum",
        "outer measure zero"
      ],
      "strategy": "Cover the point by intervals of arbitrarily small length; then the best possible outer size cannot be positive.",
      "steps": [
        {
          "do": "Choose a small number",
          "result": "$\\epsilon>0$",
          "why": "we will make the cover as short as requested"
        },
        {
          "do": "Cover the point",
          "result": "$\\{2\\}\\subset(2-\\epsilon/2,2+\\epsilon/2)$",
          "why": "the interval contains $2$"
        },
        {
          "do": "Compute the interval length",
          "result": "$\\epsilon$",
          "why": "right endpoint minus left endpoint"
        },
        {
          "do": "Bound the outer measure",
          "result": "$m^*(\\{2\\})\\le\\epsilon$",
          "why": "outer measure is at most any cover length"
        },
        {
          "do": "Let $\\epsilon$ shrink",
          "result": "$m^*(\\{2\\})=0$",
          "why": "a nonnegative number below every positive $\\epsilon$ must be zero"
        }
      ],
      "verify": "Outer measure cannot be negative, so the upper bound by every $\\epsilon>0$ forces exactly zero.",
      "answer": "$m^*(\\{2\\})=0$.",
      "connects": "Points have zero length because we can cover them from outside with intervals as short as we like."
    },
    "practice": [
      {
        "problem": "Cover $[0,1]$ by the open interval $(-0.1,1.1)$. What upper bound does this give for $m^*([0,1])$?",
        "steps": [
          {
            "do": "Check containment",
            "result": "$[0,1]\\subset(-0.1,1.1)$",
            "why": "the cover contains every point in the set"
          },
          {
            "do": "Compute length",
            "result": "$1.1-(-0.1)=1.2$",
            "why": "interval length is endpoint difference"
          },
          {
            "do": "Use the cover",
            "result": "$m^*([0,1])\\le1.2$",
            "why": "outer measure is no larger than any cover total"
          },
          {
            "do": "Interpret",
            "result": "$1.2$ is only an upper bound",
            "why": "better covers can be closer to $1$"
          }
        ],
        "answer": "The cover gives $m^*([0,1])\\le1.2$."
      },
      {
        "problem": "Show that $m^*(\\{1,3\\})=0$ using one $\\epsilon$-argument.",
        "steps": [
          {
            "do": "Choose $\\epsilon>0$",
            "result": "$\\epsilon/2$ for each point",
            "why": "split the total allowance"
          },
          {
            "do": "Cover $1$",
            "result": "$(1-\\epsilon/8,1+\\epsilon/8)$",
            "why": "this interval has length $\\epsilon/4$"
          },
          {
            "do": "Cover $3$",
            "result": "$(3-\\epsilon/8,3+\\epsilon/8)$",
            "why": "this interval also has length $\\epsilon/4$"
          },
          {
            "do": "Add lengths",
            "result": "$\\epsilon/4+\\epsilon/4=\\epsilon/2$",
            "why": "the total is below $\\epsilon$"
          },
          {
            "do": "Conclude",
            "result": "$m^*(\\{1,3\\})=0$",
            "why": "arbitrarily small covers force zero"
          }
        ],
        "answer": "$m^*(\\{1,3\\})=0$."
      },
      {
        "problem": "If $A\\subseteq B$ and $m^*(B)=5$, what can you say about $m^*(A)$?",
        "steps": [
          {
            "do": "Use monotonicity",
            "result": "$m^*(A)\\le m^*(B)$",
            "why": "any cover of $B$ also covers $A$"
          },
          {
            "do": "Substitute",
            "result": "$m^*(A)\\le5$",
            "why": "use the given outer measure"
          },
          {
            "do": "Use nonnegativity",
            "result": "$0\\le m^*(A)$",
            "why": "outer measure is never negative"
          },
          {
            "do": "Combine bounds",
            "result": "$0\\le m^*(A)\\le5$",
            "why": "both facts apply"
          }
        ],
        "answer": "$m^*(A)$ is between $0$ and $5$."
      },
      {
        "problem": "Sets $E_1$ and $E_2$ have $m^*(E_1)=2$ and $m^*(E_2)=3$. What bound does subadditivity give for $m^*(E_1\\cup E_2)$?",
        "steps": [
          {
            "do": "Write subadditivity",
            "result": "$m^*(E_1\\cup E_2)\\le m^*(E_1)+m^*(E_2)$",
            "why": "outer measure need not require disjointness for this bound"
          },
          {
            "do": "Substitute",
            "result": "$2+3$",
            "why": "use given values"
          },
          {
            "do": "Add",
            "result": "$5$",
            "why": "ordinary arithmetic"
          },
          {
            "do": "State the bound",
            "result": "$m^*(E_1\\cup E_2)\\le5$",
            "why": "overlap can only reduce the union size"
          }
        ],
        "answer": "$m^*(E_1\\cup E_2)\\le5$."
      },
      {
        "problem": "A classifier's uncertain region is covered by score intervals of lengths $0.04$, $0.03$, and $0.01$. What outer-measure upper bound follows?",
        "steps": [
          {
            "do": "Add first two lengths",
            "result": "$0.04+0.03=0.07$",
            "why": "combine cover sizes"
          },
          {
            "do": "Add the third length",
            "result": "$0.07+0.01=0.08$",
            "why": "total cover length"
          },
          {
            "do": "Apply outer measure",
            "result": "$m^*(E)\\le0.08$",
            "why": "a cover gives an upper bound"
          },
          {
            "do": "Interpret",
            "result": "at most $8\\%$ of the score line",
            "why": "the covered interval length is $0.08$ inside a unit range"
          }
        ],
        "answer": "The outer-measure upper bound is $0.08$."
      }
    ],
    "applications": [
      {
        "title": "Bounding rare score regions",
        "background": "Outer measure lets you bound complicated threshold regions by covering them with intervals.",
        "numbers": "Covers of lengths $0.02$, $0.015$, and $0.005$ give outer measure at most $0.04$."
      },
      {
        "title": "Approximate geometry",
        "background": "Before exact area is known, graphics algorithms cover shapes with boxes to bound size.",
        "numbers": "Boxes of areas $4$, $3$, and $1.5$ give outer area at most $8.5$."
      },
      {
        "title": "Confidence sets",
        "background": "Statistics often covers an unknown parameter set by intervals, then reports the total width.",
        "numbers": "Intervals $[0.1,0.2]$ and $[0.45,0.50]$ have total length $0.10+0.05=0.15$."
      },
      {
        "title": "Anomaly windows",
        "background": "Monitoring can cover suspicious time points by windows and bound total affected time.",
        "numbers": "Windows of $5$, $8$, and $2$ minutes cover at most $15$ minutes of anomaly time."
      },
      {
        "title": "Compression of sparse events",
        "background": "Finite or countable point sets have zero length even if they contain many values.",
        "numbers": "One thousand points can each be covered by length $10^{-6}$ intervals, giving total cover length $0.001$."
      },
      {
        "title": "Union bounds",
        "background": "Probability union bounds mirror outer-measure subadditivity.",
        "numbers": "If three failure modes have probabilities $0.01$, $0.02$, and $0.005$, any failure has probability at most $0.035$."
      }
    ],
    "applicationsClose": "Outer measure is cautious in the best way: it gives every set an outside size, then prepares us to identify the sets where exact additivity is safe.",
    "takeaways": [
      "Outer measure is built from infima of countable covers.",
      "It is monotone and countably subadditive for all sets.",
      "Measurable sets are the ones where outer measure later behaves like a true measure."
    ]
  },
  "math-07-06": {
    "id": "math-07-06",
    "title": "Lebesgue measure",
    "tagline": "Lebesgue measure extends length from intervals to a vast family of real-line sets without losing countable additivity.",
    "connections": {
      "buildsOn": [
        "outer measure",
        "measures",
        "interval length"
      ],
      "leadsTo": [
        "measurable functions",
        "Lebesgue integration",
        "almost everywhere"
      ],
      "usedWith": [
        "Borel sets",
        "null sets",
        "translation invariance",
        "probability densities"
      ]
    },
    "motivation": "<p>You already trust that the interval $[2,5]$ has length $3$. The challenge is to measure sets made from many intervals, limits of intervals, and scattered exceptional points without breaking the arithmetic of length.</p><p><b>Lebesgue measure</b> is the answer on the real line. It keeps interval length, gives countable sets length zero, and supports the integrals used throughout probability and ML.</p>",
    "definition": "<p>Lebesgue measure $m$ is the measure on Lebesgue measurable subsets of $\\mathbb R$ satisfying $m((a,b))=b-a$ for intervals and countable additivity on disjoint measurable sets. It is obtained by restricting outer measure $m^*$ to the sets that pass the Carathéodory measurability test.</p><p>For intervals, the familiar rule remains: $m([a,b])=b-a$, and adding or removing endpoints does not change length because singletons have measure zero.</p><p><b>Assumptions that matter:</b> sets must be Lebesgue measurable before $m$ is used as a measure; countable sets have measure zero; intervals have their usual length; and translation does not change measure.</p>",
    "worked": {
      "problem": "Find the Lebesgue measure of $[0,2]\\cup[3,4]$.",
      "skills": [
        "interval length",
        "disjoint additivity",
        "Lebesgue measure"
      ],
      "strategy": "Measure each interval by endpoint difference, then add because the intervals are disjoint.",
      "steps": [
        {
          "do": "Measure $[0,2]$",
          "result": "$2-0=2$",
          "why": "Lebesgue measure agrees with interval length"
        },
        {
          "do": "Measure $[3,4]$",
          "result": "$4-3=1$",
          "why": "same length rule"
        },
        {
          "do": "Check overlap",
          "result": "$[0,2]\\cap[3,4]=\\varnothing$",
          "why": "there is a gap"
        },
        {
          "do": "Add measures",
          "result": "$2+1=3$",
          "why": "disjoint measurable sets add"
        }
      ],
      "verify": "The union consists of three total units of line length, with the gap from $2$ to $3$ excluded.",
      "answer": "$m([0,2]\\cup[3,4])=3$.",
      "connects": "Lebesgue measure preserves ordinary length while allowing unions beyond a single interval."
    },
    "practice": [
      {
        "problem": "Find $m((1,6))$.",
        "steps": [
          {
            "do": "Identify endpoints",
            "result": "$a=1$, $b=6$",
            "why": "the set is one interval"
          },
          {
            "do": "Subtract",
            "result": "$6-1=5$",
            "why": "interval length"
          },
          {
            "do": "Ignore endpoint type",
            "result": "open interval still has length $5$",
            "why": "endpoints have measure zero"
          }
        ],
        "answer": "$m((1,6))=5$."
      },
      {
        "problem": "Find $m([0,1]\\cup\\{2\\})$.",
        "steps": [
          {
            "do": "Measure the interval",
            "result": "$m([0,1])=1$",
            "why": "endpoint difference"
          },
          {
            "do": "Measure the point",
            "result": "$m(\\{2\\})=0$",
            "why": "singletons have zero measure"
          },
          {
            "do": "Check disjointness",
            "result": "$[0,1]\\cap\\{2\\}=\\varnothing$",
            "why": "$2$ is outside the interval"
          },
          {
            "do": "Add",
            "result": "$1+0=1$",
            "why": "disjoint additivity"
          }
        ],
        "answer": "$m([0,1]\\cup\\{2\\})=1$."
      },
      {
        "problem": "Find $m([0,5]\\setminus[1,3])$.",
        "steps": [
          {
            "do": "Describe the remaining set",
            "result": "$[0,1)\\cup(3,5]$",
            "why": "remove the middle interval"
          },
          {
            "do": "Measure the left piece",
            "result": "$1-0=1$",
            "why": "endpoint type does not change length"
          },
          {
            "do": "Measure the right piece",
            "result": "$5-3=2$",
            "why": "length of the second piece"
          },
          {
            "do": "Add",
            "result": "$1+2=3$",
            "why": "the pieces are disjoint"
          }
        ],
        "answer": "The measure is $3$."
      },
      {
        "problem": "Show that the rational numbers in $[0,1]$ have Lebesgue measure zero, using the fact that they are countable.",
        "steps": [
          {
            "do": "Use countability",
            "result": "$\\mathbb Q\\cap[0,1]=\\{q_1,q_2,\\ldots\\}$",
            "why": "rationals can be listed"
          },
          {
            "do": "Measure each singleton",
            "result": "$m(\\{q_n\\})=0$",
            "why": "points have zero measure"
          },
          {
            "do": "Use countable additivity",
            "result": "$m(\\bigcup_n\\{q_n\\})=\\sum_n0$",
            "why": "countable union of disjoint points"
          },
          {
            "do": "Sum",
            "result": "$0$",
            "why": "all terms are zero"
          }
        ],
        "answer": "$m(\\mathbb Q\\cap[0,1])=0$."
      },
      {
        "problem": "A feature is uniformly distributed on $[0,10]$. What Lebesgue-length fraction lies in $[2,3]\\cup[7,9]$?",
        "steps": [
          {
            "do": "Measure $[2,3]$",
            "result": "$1$",
            "why": "$3-2=1$"
          },
          {
            "do": "Measure $[7,9]$",
            "result": "$2$",
            "why": "$9-7=2$"
          },
          {
            "do": "Add selected length",
            "result": "$1+2=3$",
            "why": "the intervals are disjoint"
          },
          {
            "do": "Divide by total length",
            "result": "$3/10=0.3$",
            "why": "uniform probability is length fraction"
          }
        ],
        "answer": "The fraction is $0.3$."
      }
    ],
    "applications": [
      {
        "title": "Uniform probability",
        "background": "Lebesgue measure becomes probability after normalization on a finite interval.",
        "numbers": "On $[0,4]$, the interval $[1,3]$ has probability length $2/4=0.5$."
      },
      {
        "title": "Continuous features",
        "background": "Feature distributions with densities integrate over Lebesgue measure.",
        "numbers": "A constant density $0.2$ on $[0,5]$ gives probability of $[1,2.5]$ equal to $0.2\\cdot1.5=0.3$."
      },
      {
        "title": "Null exceptions",
        "background": "Analysis often ignores failures on measure-zero sets because they occupy no length.",
        "numbers": "Changing a model output at $10$ exact thresholds changes it on a set of measure $0$."
      },
      {
        "title": "Image masks in normalized coordinates",
        "background": "A rectangular region in a continuous image has area given by two-dimensional Lebesgue measure.",
        "numbers": "A box of width $0.3$ and height $0.2$ has area $0.06$."
      },
      {
        "title": "Histograms",
        "background": "Histogram probabilities estimate Lebesgue-length intervals under a density.",
        "numbers": "A bin $[4,6]$ with estimated density $0.12$ has approximate probability $0.12\\cdot2=0.24$."
      },
      {
        "title": "Translation invariance",
        "background": "Shifting data along the real line does not change lengths of intervals.",
        "numbers": "$[2,5]$ and $[12,15]$ both have Lebesgue measure $3$."
      }
    ],
    "applicationsClose": "Lebesgue measure is ordinary length made robust enough for limits, countable sets, densities, and modern integration.",
    "takeaways": [
      "Lebesgue measure agrees with interval length.",
      "Countable sets, including finite sets and rationals, have measure zero.",
      "It is countably additive on Lebesgue measurable sets and is the base measure for many densities."
    ]
  },
  "math-07-07": {
    "id": "math-07-07",
    "title": "Measurable functions",
    "tagline": "A measurable function is one whose observable output questions pull back to measurable input events.",
    "connections": {
      "buildsOn": [
        "measurable spaces",
        "preimages",
        "real functions"
      ],
      "leadsTo": [
        "random variables",
        "Lebesgue integral",
        "convergence theorems"
      ],
      "usedWith": [
        "Borel sets",
        "indicator functions",
        "simple functions",
        "composition"
      ]
    },
    "motivation": "<p>A function can map outcomes to numbers, labels, losses, or predictions. To integrate it or treat it as a random variable, we need its output events to correspond to legal input events.</p><p>That is exactly what <b>measurable</b> means for functions: whenever you ask an allowed question about the output, the set of inputs answering yes is measurable.</p>",
    "definition": "<p>A function $f:(X,\\mathcal F)\\to(Y,\\mathcal G)$ is <b>measurable</b> if for every $B\\in\\mathcal G$, the preimage $f^{-1}(B)=\\{x\\in X:f(x)\\in B\\}$ belongs to $\\mathcal F$. For real-valued functions, it is enough to check sets of the form $(-\\infty,a]$: $\\{x:f(x)\\le a\\}\\in\\mathcal F$ for every real $a$.</p><p>Indicator functions show the idea: $1_A$ is measurable exactly when $A$ is measurable, because $\\{x:1_A(x)=1\\}=A$.</p><p><b>Assumptions that matter:</b> measurability depends on both domain and codomain $\\sigma$-algebras; preimages, not images, define measurability; and continuous real functions are Borel measurable on standard real spaces.</p>",
    "worked": {
      "problem": "Let $(X,\\mathcal F)$ be a measurable space and $A\\in\\mathcal F$. Show that the indicator $1_A$ is measurable as a function into $\\mathbb R$.",
      "skills": [
        "indicator functions",
        "preimages",
        "measurability"
      ],
      "strategy": "Check threshold preimages; the only possible values are $0$ and $1$.",
      "steps": [
        {
          "do": "List possible outputs",
          "result": "$1_A(x)\\in\\{0,1\\}$",
          "why": "indicators only record membership"
        },
        {
          "do": "Check thresholds below $0$",
          "result": "$\\{x:1_A(x)\\le a\\}=\\varnothing$ for $a<0$",
          "why": "no output is below $0$"
        },
        {
          "do": "Check thresholds between $0$ and $1$",
          "result": "$\\{x:1_A(x)\\le a\\}=A^c$",
          "why": "only points outside $A$ have output $0$"
        },
        {
          "do": "Check thresholds at least $1$",
          "result": "$\\{x:1_A(x)\\le a\\}=X$",
          "why": "both possible outputs are included"
        },
        {
          "do": "Use the $\\sigma$-algebra",
          "result": "$\\varnothing,A^c,X\\in\\mathcal F$",
          "why": "$A$ measurable implies its complement is measurable"
        }
      ],
      "verify": "Every threshold preimage is measurable, so the real-valued function passes the measurability test.",
      "answer": "$1_A$ is measurable.",
      "connects": "Measurable functions turn output questions into measurable input events."
    },
    "practice": [
      {
        "problem": "If $f(x)=2x+1$ on $\\mathbb R$ with Borel sets, find $f^{-1}((3,7])$.",
        "steps": [
          {
            "do": "Write the preimage condition",
            "result": "$3<2x+1\\le7$",
            "why": "outputs must fall in the interval"
          },
          {
            "do": "Subtract $1$",
            "result": "$2<2x\\le6$",
            "why": "isolate the term with $x$"
          },
          {
            "do": "Divide by $2$",
            "result": "$1<x\\le3$",
            "why": "solve the inequality"
          },
          {
            "do": "State the preimage",
            "result": "$(1,3]$",
            "why": "those inputs produce outputs in $(3,7]$"
          }
        ],
        "answer": "$f^{-1}((3,7])=(1,3]$."
      },
      {
        "problem": "For $A\\in\\mathcal F$, find $1_A^{-1}(\\{1\\})$ and $1_A^{-1}(\\{0\\})$.",
        "steps": [
          {
            "do": "Use the definition of $1_A$",
            "result": "$1_A(x)=1$ on $A$",
            "why": "members get output one"
          },
          {
            "do": "Take the preimage of $\\{1\\}$",
            "result": "$A$",
            "why": "exactly members map to one"
          },
          {
            "do": "Use the outside value",
            "result": "$1_A(x)=0$ on $A^c$",
            "why": "nonmembers get output zero"
          },
          {
            "do": "Take the preimage of $\\{0\\}$",
            "result": "$A^c$",
            "why": "exactly nonmembers map to zero"
          }
        ],
        "answer": "The preimages are $A$ and $A^c$."
      },
      {
        "problem": "A coarse space on $X=\\{1,2,3,4\\}$ has $\\mathcal F=\\{\\varnothing,X,\\{1,2\\},\\{3,4\\}\\}$. Is $f(1)=f(2)=0$, $f(3)=f(4)=1$ measurable?",
        "steps": [
          {
            "do": "Find preimage of $\\{0\\}$",
            "result": "$\\{1,2\\}$",
            "why": "those points map to zero"
          },
          {
            "do": "Check membership",
            "result": "$\\{1,2\\}\\in\\mathcal F$",
            "why": "the first block is measurable"
          },
          {
            "do": "Find preimage of $\\{1\\}$",
            "result": "$\\{3,4\\}$",
            "why": "those points map to one"
          },
          {
            "do": "Check membership",
            "result": "$\\{3,4\\}\\in\\mathcal F$",
            "why": "the second block is measurable"
          },
          {
            "do": "Conclude",
            "result": "measurable",
            "why": "all output events pull back to measurable blocks"
          }
        ],
        "answer": "Yes, the function is measurable."
      },
      {
        "problem": "In the same coarse space, is $g(1)=1$ and $g(2)=g(3)=g(4)=0$ measurable?",
        "steps": [
          {
            "do": "Find preimage of $\\{1\\}$",
            "result": "$\\{1\\}$",
            "why": "only point $1$ maps to one"
          },
          {
            "do": "Check membership",
            "result": "$\\{1\\}\\notin\\mathcal F$",
            "why": "single points inside the block are not measurable"
          },
          {
            "do": "Apply the definition",
            "result": "not measurable",
            "why": "one nonmeasurable preimage is enough"
          },
          {
            "do": "Interpret",
            "result": "$g$ sees more detail than the space allows",
            "why": "it separates $1$ from $2$"
          }
        ],
        "answer": "No. $g$ is not measurable on that coarse space."
      },
      {
        "problem": "A score $s$ is measurable. Show the event $\\{x:s(x)>0.8\\}$ is measurable.",
        "steps": [
          {
            "do": "Rewrite with a complement",
            "result": "$\\{s>0.8\\}=X\\setminus\\{s\\le0.8\\}$",
            "why": "threshold measurability is usually stated with $\\le$"
          },
          {
            "do": "Use measurability of $s$",
            "result": "$\\{s\\le0.8\\}\\in\\mathcal F$",
            "why": "threshold preimage is measurable"
          },
          {
            "do": "Take complement",
            "result": "$X\\setminus\\{s\\le0.8\\}\\in\\mathcal F$",
            "why": "$\\sigma$-algebras are closed under complements"
          },
          {
            "do": "Conclude",
            "result": "$\\{s>0.8\\}\\in\\mathcal F$",
            "why": "the high-score event is measurable"
          }
        ],
        "answer": "The event is measurable."
      }
    ],
    "applications": [
      {
        "title": "Random variables",
        "background": "In probability, a random variable is exactly a measurable function from outcomes to numbers.",
        "numbers": "If $X$ maps outcomes to $0$ or $1$ and $P(X=1)=0.3$, then $P(X\\le0)=0.7$."
      },
      {
        "title": "Loss functions",
        "background": "Expected loss requires the loss to be measurable so the event loss above a threshold is meaningful.",
        "numbers": "If $P(L>2)=0.05$ over $10000$ examples, about $500$ examples exceed loss $2$."
      },
      {
        "title": "Classifiers",
        "background": "A classifier's decision regions must be measurable to assign probabilities to predictions.",
        "numbers": "If $35$ of $200$ validation points fall in predicted class A, empirical measure is $35/200=0.175$."
      },
      {
        "title": "Feature thresholds",
        "background": "Decision trees use threshold events, which are measurable for real-valued features.",
        "numbers": "A split $x\\le4.5$ sending $120$ of $300$ rows left has empirical mass $0.4$."
      },
      {
        "title": "Calibration curves",
        "background": "Calibration bins are preimages of score intervals under a measurable score function.",
        "numbers": "Scores in $[0.7,0.8)$ for $80$ of $1000$ examples form a measurable bin of mass $0.08$."
      },
      {
        "title": "Composed pipelines",
        "background": "Measurable functions compose, matching how preprocessing followed by prediction should remain observable.",
        "numbers": "If standardization maps $x=70$ to $z=(70-50)/10=2$, and a threshold uses $z>1$, this equals $x>60$."
      }
    ],
    "applicationsClose": "Measurable functions are the safe bridges between spaces: every observable output event has a measurable set of causes.",
    "takeaways": [
      "Measurability is defined by preimages of measurable output sets.",
      "For real functions, threshold events $\\{f\\le a\\}$ are enough to check.",
      "Random variables, losses, scores, and indicators are measurable functions when their events are well-defined."
    ]
  },
  "math-07-08": {
    "id": "math-07-08",
    "title": "The Lebesgue integral",
    "tagline": "The Lebesgue integral adds values by measuring where a function takes them, not by slicing only the input axis.",
    "connections": {
      "buildsOn": [
        "Lebesgue measure",
        "measurable functions",
        "simple functions"
      ],
      "leadsTo": [
        "monotone convergence",
        "Fatou's lemma",
        "expected value"
      ],
      "usedWith": [
        "indicator functions",
        "probability measures",
        "nonnegative functions",
        "$L^p$ spaces"
      ]
    },
    "motivation": "<p>You already know a finite weighted average: value times weight, then add. The Lebesgue integral is the infinite, measurable version of that same idea.</p><p>Instead of asking only how wide each input slice is, it asks how much measure sits where the function has each value. That makes it especially natural for probability and expected loss.</p>",
    "definition": "<p>For a nonnegative simple function $s=\\sum_{k=1}^n a_k 1_{A_k}$ with $a_k\\ge0$ and measurable $A_k$, define $$\\int_X s\\,d\\mu=\\sum_{k=1}^n a_k\\mu(A_k).$$ For a nonnegative measurable function $f$, define $$\\int_X f\\,d\\mu=\\sup\\left\\{\\int_X s\\,d\\mu:0\\le s\\le f,\\ s \\text{ simple}\\right\\}.$$ General integrable functions are handled by positive and negative parts.</p><p>This definition agrees with area for familiar functions and with expectation when $\\mu$ is probability.</p><p><b>Assumptions that matter:</b> the function must be measurable; nonnegative integrals may be $\\infty$; signed integrals require the positive and negative parts not both infinite; and $d\\mu$ names the measure used for weighting.</p>",
    "worked": {
      "problem": "Let $X=\\{a,b,c\\}$ with probabilities $0.2$, $0.5$, $0.3$. If $f(a)=1$, $f(b)=4$, and $f(c)=10$, compute $\\int f\\,d\\mu$.",
      "skills": [
        "simple functions",
        "weighted averages",
        "expectation"
      ],
      "strategy": "Finite probability integrals are weighted sums: multiply each value by its mass and add.",
      "steps": [
        {
          "do": "Multiply the first value",
          "result": "$1\\cdot0.2=0.2$",
          "why": "value times probability mass"
        },
        {
          "do": "Multiply the second value",
          "result": "$4\\cdot0.5=2.0$",
          "why": "same weighted-sum rule"
        },
        {
          "do": "Multiply the third value",
          "result": "$10\\cdot0.3=3.0$",
          "why": "third atom contribution"
        },
        {
          "do": "Add contributions",
          "result": "$0.2+2.0+3.0=5.2$",
          "why": "the integral sums value-weight products"
        }
      ],
      "verify": "The answer lies between the minimum value $1$ and maximum value $10$, as a probability-weighted average should.",
      "answer": "$\\int f\\,d\\mu=5.2$.",
      "connects": "On finite spaces, the Lebesgue integral is exactly the weighted average you already trust."
    },
    "practice": [
      {
        "problem": "Compute $\\int 3\\cdot1_A\\,d\\mu$ if $\\mu(A)=0.4$.",
        "steps": [
          {
            "do": "Identify the simple function value",
            "result": "$3$ on $A$",
            "why": "the indicator is one on $A$"
          },
          {
            "do": "Use the simple integral rule",
            "result": "$3\\mu(A)$",
            "why": "coefficient times set measure"
          },
          {
            "do": "Substitute",
            "result": "$3\\cdot0.4$",
            "why": "use the given measure"
          },
          {
            "do": "Multiply",
            "result": "$1.2$",
            "why": "ordinary arithmetic"
          }
        ],
        "answer": "The integral is $1.2$."
      },
      {
        "problem": "A simple function is $s=2\\cdot1_A+5\\cdot1_B$ on disjoint sets with $\\mu(A)=3$ and $\\mu(B)=4$. Compute $\\int s\\,d\\mu$.",
        "steps": [
          {
            "do": "Compute the $A$ contribution",
            "result": "$2\\cdot3=6$",
            "why": "value times measure"
          },
          {
            "do": "Compute the $B$ contribution",
            "result": "$5\\cdot4=20$",
            "why": "value times measure"
          },
          {
            "do": "Add",
            "result": "$6+20=26$",
            "why": "disjoint simple pieces add"
          },
          {
            "do": "State the integral",
            "result": "$26$",
            "why": "total weighted area"
          }
        ],
        "answer": "$\\int s\\,d\\mu=26$."
      },
      {
        "problem": "For uniform measure on $[0,2]$, compute $\\int_0^2 4\\,dx$.",
        "steps": [
          {
            "do": "Identify constant value",
            "result": "$4$",
            "why": "the function has the same height everywhere"
          },
          {
            "do": "Measure the interval",
            "result": "$2-0=2$",
            "why": "Lebesgue length"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot2=8$",
            "why": "constant integral is height times length"
          },
          {
            "do": "Interpret",
            "result": "area $8$",
            "why": "rectangle of height $4$ and width $2$"
          }
        ],
        "answer": "The integral is $8$."
      },
      {
        "problem": "A nonnegative random loss takes values $0$, $2$, and $5$ with probabilities $0.6$, $0.3$, and $0.1$. Compute expected loss.",
        "steps": [
          {
            "do": "Multiply value $0$",
            "result": "$0\\cdot0.6=0$",
            "why": "zero loss contributes nothing"
          },
          {
            "do": "Multiply value $2$",
            "result": "$2\\cdot0.3=0.6$",
            "why": "weighted contribution"
          },
          {
            "do": "Multiply value $5$",
            "result": "$5\\cdot0.1=0.5$",
            "why": "weighted contribution"
          },
          {
            "do": "Add",
            "result": "$0+0.6+0.5=1.1$",
            "why": "expectation is an integral"
          }
        ],
        "answer": "Expected loss is $1.1$."
      },
      {
        "problem": "Approximate $\\int_0^1 x\\,dx$ from below using the simple function with value $0$ on $[0,0.5)$ and $0.5$ on $[0.5,1]$.",
        "steps": [
          {
            "do": "Measure the first half",
            "result": "$0.5$",
            "why": "length of $[0,0.5)$"
          },
          {
            "do": "Compute first contribution",
            "result": "$0\\cdot0.5=0$",
            "why": "simple value times measure"
          },
          {
            "do": "Measure the second half",
            "result": "$0.5$",
            "why": "length of $[0.5,1]$"
          },
          {
            "do": "Compute second contribution",
            "result": "$0.5\\cdot0.5=0.25$",
            "why": "lower simple value times length"
          },
          {
            "do": "Add",
            "result": "$0.25$",
            "why": "the lower approximation is below the true integral $0.5$"
          }
        ],
        "answer": "The lower simple-function integral is $0.25$."
      }
    ],
    "applications": [
      {
        "title": "Expected loss",
        "background": "ML training minimizes expectations, which are Lebesgue integrals under the data distribution.",
        "numbers": "Losses $0.2$, $1.0$, $3.0$ with probabilities $0.5$, $0.4$, $0.1$ give expected loss $0.1+0.4+0.3=0.8$."
      },
      {
        "title": "Empirical risk",
        "background": "A finite dataset uses the empirical measure, so the integral becomes an average.",
        "numbers": "For losses $2$, $4$, $5$, $9$, empirical risk is $(2+4+5+9)/4=5$."
      },
      {
        "title": "Density integration",
        "background": "Continuous probabilities integrate density over sets.",
        "numbers": "Density $f(x)=2x$ on $[0,1]$ gives $P([0,0.5])=\\int_0^{0.5}2x\\,dx=0.25$."
      },
      {
        "title": "Weighted metrics",
        "background": "Business metrics often weight examples by importance or traffic share.",
        "numbers": "Segment errors $0.1$ and $0.3$ with traffic weights $0.8$ and $0.2$ give weighted error $0.08+0.06=0.14$."
      },
      {
        "title": "Image intensity",
        "background": "Average brightness is an integral of intensity over image area.",
        "numbers": "If half an image has brightness $100$ and half $200$, average brightness is $100\\cdot0.5+200\\cdot0.5=150$."
      },
      {
        "title": "Regularization",
        "background": "Norm penalties are integrals or sums of parameter magnitudes under counting measure.",
        "numbers": "For weights $[1,-2,3]$, the squared $L^2$ sum is $1^2+(-2)^2+3^2=14$."
      }
    ],
    "applicationsClose": "The Lebesgue integral is one idea in many uniforms: weighted sums, areas, probabilities, and expected losses all add value times measure.",
    "takeaways": [
      "Simple functions integrate by summing value times measure.",
      "Nonnegative measurable functions integrate as suprema of simple lower approximations.",
      "Expected value is the Lebesgue integral with respect to a probability measure."
    ]
  },
  "math-07-09": {
    "id": "math-07-09",
    "title": "The monotone convergence theorem",
    "tagline": "When nonnegative measurable functions rise pointwise, their integrals rise to the integral of the limit.",
    "connections": {
      "buildsOn": [
        "Lebesgue integral",
        "measurable functions",
        "pointwise limits"
      ],
      "leadsTo": [
        "Fatou's lemma",
        "dominated convergence",
        "interchanging limits and integrals"
      ],
      "usedWith": [
        "increasing sequences",
        "nonnegative functions",
        "series",
        "expectations"
      ]
    },
    "motivation": "<p>Limits and integrals are both ways of gathering infinitely much information. The delicate question is when you may swap them.</p><p>The <b>monotone convergence theorem</b> gives a wonderfully clean answer for nonnegative functions that only increase. If your approximations rise toward the truth, the areas rise toward the true area.</p>",
    "definition": "<p>If $0\\le f_1\\le f_2\\le\\cdots$ are measurable functions on $(X,\\mathcal F,\\mu)$ and $f_n(x)\\to f(x)$ pointwise, then $$\\int_X f\\,d\\mu=\\lim_{n\\to\\infty}\\int_X f_n\\,d\\mu.$$ The limit may be $\\infty$.</p><p>The monotonicity matters because no area is ever lost by later approximations. Since $f_n\\le f$, each integral is at most $\\int f\\,d\\mu$; the theorem says these lower areas climb all the way up.</p><p><b>Assumptions that matter:</b> every $f_n$ must be measurable; the sequence must be nondecreasing pointwise; functions must be nonnegative; and no separate boundedness assumption is required.</p>",
    "worked": {
      "problem": "On $[0,1]$, let $f_n(x)=1$ on $[0,1-1/n]$ and $0$ elsewhere. Compute $\\lim_n\\int f_n\\,dx$ and compare with the limit function.",
      "skills": [
        "indicator functions",
        "monotone convergence",
        "Lebesgue measure"
      ],
      "strategy": "Read each integral as the length of the interval where the indicator equals one.",
      "steps": [
        {
          "do": "Identify the support",
          "result": "$[0,1-1/n]$",
          "why": "that is where $f_n=1$"
        },
        {
          "do": "Compute its length",
          "result": "$1-1/n$",
          "why": "right endpoint minus left endpoint"
        },
        {
          "do": "Write the integral",
          "result": "$\\int_0^1 f_n\\,dx=1-1/n$",
          "why": "integral of an indicator is measure of its set"
        },
        {
          "do": "Take the limit",
          "result": "$\\lim_n(1-1/n)=1$",
          "why": "$1/n\\to0$"
        },
        {
          "do": "Identify the pointwise limit",
          "result": "$f(x)=1$ for $0\\le x<1$ and $f(1)=0$",
          "why": "every point below $1$ is eventually included"
        }
      ],
      "verify": "The limit function differs from the constant $1$ only at one point, which has measure zero, so its integral is $1$.",
      "answer": "Both sides equal $1$.",
      "connects": "MCT justifies replacing increasing simple approximations by their limiting function inside the integral."
    },
    "practice": [
      {
        "problem": "If $\\int f_n\\,d\\mu=2-1/n$ for an increasing nonnegative sequence, what is $\\int f\\,d\\mu$ by MCT?",
        "steps": [
          {
            "do": "Check the theorem pattern",
            "result": "$f_n\\uparrow f$",
            "why": "the problem says increasing to a limit"
          },
          {
            "do": "Use MCT",
            "result": "$\\int f\\,d\\mu=\\lim_n\\int f_n\\,d\\mu$",
            "why": "limits and integrals swap under the hypotheses"
          },
          {
            "do": "Substitute",
            "result": "$\\lim_n(2-1/n)$",
            "why": "use the given integral formula"
          },
          {
            "do": "Take the limit",
            "result": "$2$",
            "why": "$1/n\\to0$"
          }
        ],
        "answer": "$\\int f\\,d\\mu=2$."
      },
      {
        "problem": "For $f_n=1_{[0,n]}$ on $\\mathbb R$, compute $\\int f_n\\,dx$ and the limit.",
        "steps": [
          {
            "do": "Measure the support",
            "result": "$m([0,n])=n$",
            "why": "interval length"
          },
          {
            "do": "Integrate the indicator",
            "result": "$\\int f_n\\,dx=n$",
            "why": "indicator integral equals measure"
          },
          {
            "do": "Check monotonicity",
            "result": "$f_n\\le f_{n+1}$",
            "why": "intervals expand"
          },
          {
            "do": "Take the limit",
            "result": "$\\lim_n n=\\infty$",
            "why": "the covered length grows without bound"
          }
        ],
        "answer": "The integrals increase to $\\infty$."
      },
      {
        "problem": "Let $f_n(x)=x\\,1_{[0,1-1/n]}(x)$ on $[0,1]$. Compute $\\lim\\int f_n\\,dx$.",
        "steps": [
          {
            "do": "Write the integral",
            "result": "$\\int_0^{1-1/n}x\\,dx$",
            "why": "the function is zero outside that interval"
          },
          {
            "do": "Use the antiderivative",
            "result": "$x^2/2$",
            "why": "integral of $x$"
          },
          {
            "do": "Evaluate",
            "result": "$(1-1/n)^2/2$",
            "why": "upper endpoint substitution"
          },
          {
            "do": "Take the limit",
            "result": "$1/2$",
            "why": "$(1-1/n)^2\\to1$"
          },
          {
            "do": "Connect to MCT",
            "result": "$\\int_0^1x\\,dx=1/2$",
            "why": "the increasing functions converge to $x$"
          }
        ],
        "answer": "The limit is $1/2$."
      },
      {
        "problem": "Show why the sequence $f_n(x)=1/n$ on $[0,1]$ is not a use case for MCT as stated.",
        "steps": [
          {
            "do": "Compare first two functions",
            "result": "$f_2=1/2<1=f_1$",
            "why": "the sequence decreases"
          },
          {
            "do": "Check monotone direction",
            "result": "not nondecreasing",
            "why": "MCT needs $f_n\\le f_{n+1}$"
          },
          {
            "do": "Compute the limit",
            "result": "$f_n\\to0$",
            "why": "$1/n\\to0$"
          },
          {
            "do": "State the issue",
            "result": "MCT hypotheses fail",
            "why": "another theorem would handle this example"
          }
        ],
        "answer": "MCT does not apply because the sequence decreases, not increases."
      },
      {
        "problem": "For nonnegative random variables $Y_n=\\min(Y,n)$ with $Y\\ge0$, explain why $E[Y_n]\\uparrow E[Y]$.",
        "steps": [
          {
            "do": "Compare truncations",
            "result": "$\\min(Y,n)\\le\\min(Y,n+1)$",
            "why": "raising the cap cannot lower the value"
          },
          {
            "do": "Find the pointwise limit",
            "result": "$Y_n\\to Y$",
            "why": "eventually the cap exceeds any finite value of $Y$"
          },
          {
            "do": "Check nonnegativity",
            "result": "$Y_n\\ge0$",
            "why": "$Y$ is nonnegative"
          },
          {
            "do": "Apply MCT",
            "result": "$E[Y_n]\\to E[Y]$",
            "why": "expectation is an integral"
          }
        ],
        "answer": "By MCT, $E[\\min(Y,n)]$ increases to $E[Y]$."
      }
    ],
    "applications": [
      {
        "title": "Approximating expected loss",
        "background": "Clip a nonnegative loss at higher and higher caps, then MCT recovers the true expected loss.",
        "numbers": "If capped expectations are $1.2$, $1.7$, $1.9$, and approach $2.0$, MCT identifies expected loss as $2.0$."
      },
      {
        "title": "Histograms to densities",
        "background": "Increasing simple lower approximations can converge to a density or response curve.",
        "numbers": "Lower areas $0.40$, $0.47$, $0.495$ rising to $0.5$ converge to the true area $0.5$."
      },
      {
        "title": "Counting infinite events",
        "background": "Indicators of expanding sets increase to the indicator of their union.",
        "numbers": "Sets $[0,n]$ have measures $n$, so the union $[0,\\infty)$ has infinite measure."
      },
      {
        "title": "Series as integrals",
        "background": "MCT justifies turning sums of nonnegative functions into integrals of infinite sums.",
        "numbers": "If integrals are $1/2^n$, the integral of the sum is $\\sum_{n=1}^{\\infty}2^{-n}=1$."
      },
      {
        "title": "Reliability over time",
        "background": "Failure probability by time $t$ increases as the time window expands.",
        "numbers": "If $P(T\\le1)=0.1$, $P(T\\le2)=0.18$, and $P(T\\le5)=0.35$, the events increase with time."
      },
      {
        "title": "Data filters",
        "background": "Relaxing filters creates increasing included sets and increasing measured totals.",
        "numbers": "A threshold includes $200$, then $350$, then $410$ of $500$ rows, with empirical masses $0.40$, $0.70$, $0.82$."
      }
    ],
    "applicationsClose": "MCT is the safe exchange rule for growing approximations: if the functions only rise, their integrals rise to the integral of the limit.",
    "takeaways": [
      "MCT requires nonnegative measurable functions with $f_n\\le f_{n+1}$ pointwise.",
      "Under those hypotheses, $\\int f_n\\,d\\mu$ increases to $\\int f\\,d\\mu$.",
      "No boundedness condition is needed; the answer may be infinite."
    ]
  },
  "math-07-10": {
    "id": "math-07-10",
    "title": "Fatou's lemma",
    "tagline": "Fatou's lemma says the integral of the eventual lower behavior is no larger than the eventual lower integrals.",
    "connections": {
      "buildsOn": [
        "Lebesgue integral",
        "monotone convergence theorem",
        "liminf"
      ],
      "leadsTo": [
        "dominated convergence",
        "probability bounds",
        "lower semicontinuity"
      ],
      "usedWith": [
        "nonnegative functions",
        "expectations",
        "convergence in probability",
        "optimization limits"
      ]
    },
    "motivation": "<p>Not every sequence increases neatly. Functions can wiggle, spike, or alternate. We still need a reliable inequality that survives imperfect convergence.</p><p><b>Fatou's lemma</b> is that safety net for nonnegative functions. It says the integral of what remains in the limit inferior cannot exceed the limit inferior of the integrals.</p>",
    "definition": "<p>For nonnegative measurable functions $f_n$, Fatou's lemma states $$\\int_X \\liminf_{n\\to\\infty} f_n\\,d\\mu\\le\\liminf_{n\\to\\infty}\\int_X f_n\\,d\\mu.$$ Here $\\liminf f_n(x)$ means the eventual lower value at each point: take tails, find their infimums, then let the tail start move forward.</p><p>The lemma follows from MCT by defining $g_k(x)=\\inf_{n\\ge k}f_n(x)$. Then $g_k\\le g_{k+1}$ and $g_k\\uparrow\\liminf f_n$, so MCT applies to the increasing lower envelope.</p><p><b>Assumptions that matter:</b> the functions must be measurable and nonnegative; the result is an inequality, not usually equality; and it is especially useful when convergence is too weak for stronger interchange theorems.</p>",
    "worked": {
      "problem": "On $X=\\{a,b\\}$ with equal probabilities, let $f_n(a)=1$ for all $n$ and $f_n(b)=2$ if $n$ is odd, $0$ if $n$ is even. Verify Fatou's lemma.",
      "skills": [
        "liminf",
        "finite expectations",
        "Fatou's lemma"
      ],
      "strategy": "Compute the pointwise liminf first, then compare its integral with the liminf of the integrals.",
      "steps": [
        {
          "do": "Find the liminf at $a$",
          "result": "$\\liminf f_n(a)=1$",
          "why": "the value is constantly $1$"
        },
        {
          "do": "Find the liminf at $b$",
          "result": "$\\liminf f_n(b)=0$",
          "why": "the sequence alternates between $2$ and $0$"
        },
        {
          "do": "Integrate the pointwise liminf",
          "result": "$0.5\\cdot1+0.5\\cdot0=0.5$",
          "why": "equal probabilities weight the two outcomes"
        },
        {
          "do": "Compute odd integrals",
          "result": "$0.5\\cdot1+0.5\\cdot2=1.5$",
          "why": "odd $n$ uses value $2$ at $b$"
        },
        {
          "do": "Compute even integrals",
          "result": "$0.5\\cdot1+0.5\\cdot0=0.5$",
          "why": "even $n$ uses value $0$ at $b$"
        },
        {
          "do": "Take liminf of integrals",
          "result": "$0.5$",
          "why": "the lower recurring integral value is $0.5$"
        }
      ],
      "verify": "Both sides are $0.5$, so the inequality holds with equality in this example.",
      "answer": "$\\int\\liminf f_n\\,d\\mu=0.5\\le0.5=\\liminf\\int f_n\\,d\\mu$.",
      "connects": "Fatou's lemma protects the lower limiting mass even when the sequence oscillates."
    },
    "practice": [
      {
        "problem": "If $\\int f_n\\,d\\mu$ has values $1,3,1,3,\\ldots$, what is $\\liminf_n\\int f_n\\,d\\mu$?",
        "steps": [
          {
            "do": "List recurring lower values",
            "result": "$1$ appears infinitely often",
            "why": "every odd position has value $1$"
          },
          {
            "do": "List recurring higher values",
            "result": "$3$ appears infinitely often",
            "why": "every even position has value $3$"
          },
          {
            "do": "Take eventual lower value",
            "result": "$1$",
            "why": "every tail still contains a $1$"
          },
          {
            "do": "State the liminf",
            "result": "$1$",
            "why": "the lower long-run level is $1$"
          }
        ],
        "answer": "The liminf is $1$."
      },
      {
        "problem": "For $f_n(x)=x^n$ on $[0,1]$, compute $\\liminf f_n(x)$ and compare integrals.",
        "steps": [
          {
            "do": "Find pointwise limit for $0\\le x<1$",
            "result": "$x^n\\to0$",
            "why": "powers below one shrink"
          },
          {
            "do": "Find pointwise limit at $1$",
            "result": "$1^n=1$",
            "why": "the endpoint stays one"
          },
          {
            "do": "Integrate the liminf",
            "result": "$0$",
            "why": "a single endpoint has measure zero"
          },
          {
            "do": "Compute integrals",
            "result": "$\\int_0^1x^n\\,dx=1/(n+1)$",
            "why": "power rule"
          },
          {
            "do": "Take liminf of integrals",
            "result": "$0$",
            "why": "$1/(n+1)\\to0$"
          }
        ],
        "answer": "Fatou gives $0\\le0$, equality here."
      },
      {
        "problem": "Suppose $f_n\\ge0$ and $\\int f_n\\,d\\mu\\le4$ for all $n$. What bound does Fatou give for $\\int\\liminf f_n\\,d\\mu$?",
        "steps": [
          {
            "do": "Use integral bound",
            "result": "$\\liminf_n\\int f_n\\,d\\mu\\le4$",
            "why": "all terms are at most $4$"
          },
          {
            "do": "Apply Fatou",
            "result": "$\\int\\liminf f_n\\,d\\mu\\le\\liminf\\int f_n\\,d\\mu$",
            "why": "the lemma's inequality"
          },
          {
            "do": "Combine",
            "result": "$\\int\\liminf f_n\\,d\\mu\\le4$",
            "why": "chain the two inequalities"
          },
          {
            "do": "Interpret",
            "result": "the lower-limit function has integral at most $4$",
            "why": "mass cannot appear below the bounded liminf"
          }
        ],
        "answer": "$\\int\\liminf f_n\\,d\\mu\\le4$."
      },
      {
        "problem": "Let $f_n=n\\,1_{(0,1/n)}$ on $[0,1]$. Compute $\\int f_n$ and $\\int\\liminf f_n$.",
        "steps": [
          {
            "do": "Compute support length",
            "result": "$1/n$",
            "why": "interval from $0$ to $1/n$"
          },
          {
            "do": "Compute each integral",
            "result": "$n\\cdot(1/n)=1$",
            "why": "height times length"
          },
          {
            "do": "Find pointwise eventual value for $x>0$",
            "result": "$0$",
            "why": "eventually $x$ is outside $(0,1/n)$"
          },
          {
            "do": "Find value at $x=0$",
            "result": "$0$",
            "why": "the interval is open and excludes $0$"
          },
          {
            "do": "Integrate liminf",
            "result": "$0$",
            "why": "the pointwise liminf is zero everywhere"
          }
        ],
        "answer": "$\\int f_n=1$ for all $n$, while $\\int\\liminf f_n=0$."
      },
      {
        "problem": "Validation losses $L_n\\ge0$ have expected values with liminf $0.8$. What can you conclude about $E[\\liminf L_n]$?",
        "steps": [
          {
            "do": "Name the functions",
            "result": "$L_n\\ge0$",
            "why": "Fatou applies to nonnegative losses"
          },
          {
            "do": "Write Fatou",
            "result": "$E[\\liminf L_n]\\le\\liminf E[L_n]$",
            "why": "expectation is an integral"
          },
          {
            "do": "Substitute",
            "result": "$E[\\liminf L_n]\\le0.8$",
            "why": "use the given liminf"
          },
          {
            "do": "Interpret",
            "result": "eventual lower loss has expectation at most $0.8$",
            "why": "Fatou gives an upper bound on this lower-limit expectation"
          }
        ],
        "answer": "$E[\\liminf L_n]\\le0.8$."
      }
    ],
    "applications": [
      {
        "title": "Lower bounds in learning",
        "background": "Fatou is often used when losses converge imperfectly but remain nonnegative.",
        "numbers": "If expected losses have liminf $1.2$, then $E[\\liminf L_n]\\le1.2$."
      },
      {
        "title": "Escaping spikes",
        "background": "Narrow spikes can keep integrals large while pointwise limits vanish, and Fatou's inequality remains true.",
        "numbers": "For $n1_{(0,1/n)}$, each integral is $1$, but the pointwise liminf integral is $0$."
      },
      {
        "title": "Probability of eventual events",
        "background": "Fatou underlies inequalities relating probabilities of repeated events to limiting event behavior.",
        "numbers": "If event indicators have probabilities alternating $0.2$ and $0.6$, the liminf of probabilities is $0.2$."
      },
      {
        "title": "Optimization limits",
        "background": "Lower semicontinuity arguments use Fatou-like reasoning to control objectives under limits.",
        "numbers": "If nonnegative penalties have integrals bounded by $10$, Fatou bounds the limiting lower penalty integral by $10$."
      },
      {
        "title": "Risk certificates",
        "background": "When model risks are estimated across checkpoints, Fatou gives a conservative statement about eventual lower risk.",
        "numbers": "Checkpoint risks $0.9,0.7,0.85,0.75$ have tail lower values moving toward at most $0.75$."
      },
      {
        "title": "Series and envelopes",
        "background": "The proof's lower envelopes $g_k=\\inf_{n\\ge k}f_n$ are increasing, turning a messy sequence into an MCT sequence.",
        "numbers": "For values $[3,1,2,1.5]$, tail infima start $1$, $1$, $1.5$, $1.5$, showing the lower envelope rises."
      }
    ],
    "applicationsClose": "Fatou's lemma is the dependable inequality for rough convergence: lower limiting behavior can be integrated without pretending every limit exchange is equality.",
    "takeaways": [
      "Fatou applies to nonnegative measurable functions.",
      "It states $\\int\\liminf f_n\\,d\\mu\\le\\liminf\\int f_n\\,d\\mu$.",
      "It follows from MCT applied to increasing lower envelopes and is often strict when mass moves or spikes."
    ]
  }
};
