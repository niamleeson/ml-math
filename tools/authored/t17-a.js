module.exports = {
  "math-17-01": {
    "id": "math-17-01",
    "title": "Sample spaces and events",
    "tagline": "Probability begins by naming what could happen before measuring how likely it is.",
    "connections": {
      "buildsOn": [
        "sets",
        "counting",
        "logical statements"
      ],
      "leadsTo": [
        "Set operations on events",
        "Axioms of probability",
        "random variables"
      ],
      "usedWith": [
        "sets",
        "Venn diagrams",
        "counting",
        "functions"
      ]
    },
    "motivation": "<p>You already sort possibilities all the time: a coin lands heads or tails, an email is spam or not spam, a prediction is correct or incorrect. Probability asks us to name that universe before assigning numbers.</p><p>A <b>sample space</b> is the universe of possible outcomes. An <b>event</b> is a collection of outcomes inside it. Once those are clear, probability becomes careful bookkeeping instead of guesswork.</p>",
    "definition": "<p>A <b>sample space</b> $S$ is the set of all possible outcomes of an experiment. An outcome is one result, often written $\\omega\\in S$. An <b>event</b> is a subset $A\\subseteq S$; it happens exactly when the observed outcome lies in $A$.</p><p>For a finite experiment with equally likely outcomes, $P(A)=|A|/|S|$. This comes from giving each outcome weight $1/|S|$ and adding those weights over the outcomes in $A$.</p><p><b>Assumptions that matter:</b> $S$ includes every possible outcome exactly once at the chosen detail level; events may contain zero, one, or many outcomes; and the simple counting formula requires equally likely finite outcomes.</p>",
    "worked": {
      "problem": "Roll one fair die. Let $A$ be even and $B$ be at least $5$. Write $S$, $A$, $B$, $P(A)$, and $P(B)$.",
      "skills": [
        "sample spaces",
        "events as subsets",
        "finite probability"
      ],
      "strategy": "Name the whole set first, then identify each event as a subset before counting.",
      "steps": [
        {
          "do": "Write the sample space",
          "result": "$S=\\{1,2,3,4,5,6\\}$",
          "why": "a die has six possible face values"
        },
        {
          "do": "List even outcomes",
          "result": "$A=\\{2,4,6\\}$",
          "why": "these are divisible by $2$"
        },
        {
          "do": "List outcomes at least $5$",
          "result": "$B=\\{5,6\\}$",
          "why": "only $5$ and $6$ qualify"
        },
        {
          "do": "Count the sample space",
          "result": "$|S|=6$",
          "why": "six outcomes are equally likely"
        },
        {
          "do": "Compute $P(A)$",
          "result": "$P(A)=3/6=1/2$",
          "why": "three outcomes are in $A$"
        },
        {
          "do": "Compute $P(B)$",
          "result": "$P(B)=2/6=1/3$",
          "why": "two outcomes are in $B$"
        }
      ],
      "verify": "Both probabilities are between $0$ and $1$, and the larger event has the larger probability.",
      "answer": "$S=\\{1,2,3,4,5,6\\}$, $A=\\{2,4,6\\}$, $B=\\{5,6\\}$, $P(A)=1/2$, and $P(B)=1/3$.",
      "connects": "Events are sets, so probability begins by deciding which outcomes belong to which set."
    },
    "practice": [
      {
        "problem": "Flip two coins. Write the event of exactly one head.",
        "steps": [
          {
            "do": "List ordered outcomes",
            "result": "$S=\\{HH,HT,TH,TT\\}$",
            "why": "first and second coin are recorded"
          },
          {
            "do": "Select one-head outcomes",
            "result": "$H=\\{HT,TH\\}$",
            "why": "each has exactly one $H$"
          },
          {
            "do": "Count all outcomes",
            "result": "$|S|=4$",
            "why": "two binary choices give four outcomes"
          },
          {
            "do": "Count favorable outcomes",
            "result": "$|H|=2$",
            "why": "two outcomes qualify"
          },
          {
            "do": "Compute probability",
            "result": "$P(H)=2/4=1/2$",
            "why": "divide favorable by total"
          }
        ],
        "answer": "$H=\\{HT,TH\\}$ and $P(H)=1/2$"
      },
      {
        "problem": "Draw one card from a $52$-card deck. Find probabilities of red and queen.",
        "steps": [
          {
            "do": "Count all cards",
            "result": "$|S|=52$",
            "why": "a standard deck has 52 cards"
          },
          {
            "do": "Count red cards",
            "result": "$|R|=26$",
            "why": "hearts and diamonds have 13 each"
          },
          {
            "do": "Count queens",
            "result": "$|Q|=4$",
            "why": "one queen per suit"
          },
          {
            "do": "Compute $P(R)$",
            "result": "$26/52=1/2$",
            "why": "half the deck is red"
          },
          {
            "do": "Compute $P(Q)$",
            "result": "$4/52=1/13$",
            "why": "four queens among 52 cards"
          }
        ],
        "answer": "$P(R)=1/2$ and $P(Q)=1/13$"
      },
      {
        "problem": "Choose uniformly from integers $1$ through $20$. Let $M$ be multiples of $3$.",
        "steps": [
          {
            "do": "Count the sample space",
            "result": "$|S|=20$",
            "why": "there are 20 integers"
          },
          {
            "do": "List multiples",
            "result": "$M=\\{3,6,9,12,15,18\\}$",
            "why": "multiply $3$ by $1$ through $6$"
          },
          {
            "do": "Count the event",
            "result": "$|M|=6$",
            "why": "six integers qualify"
          },
          {
            "do": "Compute probability",
            "result": "$P(M)=6/20$",
            "why": "favorable over total"
          },
          {
            "do": "Reduce",
            "result": "$P(M)=3/10$",
            "why": "divide by $2$"
          }
        ],
        "answer": "$M=\\{3,6,9,12,15,18\\}$ and $P(M)=3/10$"
      },
      {
        "problem": "A dataset has $80$ cat, $50$ dog, and $70$ car images. Choose one; find the animal event probability.",
        "steps": [
          {
            "do": "Count all images",
            "result": "$80+50+70=200$",
            "why": "the sample space is all images"
          },
          {
            "do": "Identify animal classes",
            "result": "cat and dog",
            "why": "cars are not animals"
          },
          {
            "do": "Count animal images",
            "result": "$80+50=130$",
            "why": "add cats and dogs"
          },
          {
            "do": "Compute probability",
            "result": "$130/200$",
            "why": "divide by all images"
          },
          {
            "do": "Convert to decimal",
            "result": "$0.65$",
            "why": "$130/200=13/20=0.65$"
          }
        ],
        "answer": "The animal event has probability $0.65$"
      },
      {
        "problem": "A model predicts labels $\\{0,1,2\\}$ for two items. Ordered pairs are equally likely. Let $E$ be matching predictions.",
        "steps": [
          {
            "do": "Count ordered pairs",
            "result": "$3\\cdot3=9$",
            "why": "three choices for each item"
          },
          {
            "do": "List matches",
            "result": "$E=\\{(0,0),(1,1),(2,2)\\}$",
            "why": "matching means equal entries"
          },
          {
            "do": "Count matches",
            "result": "$|E|=3$",
            "why": "one match per label"
          },
          {
            "do": "Compute probability",
            "result": "$P(E)=3/9$",
            "why": "favorable over total"
          },
          {
            "do": "Reduce",
            "result": "$P(E)=1/3$",
            "why": "divide by $3$"
          }
        ],
        "answer": "$E=\\{(0,0),(1,1),(2,2)\\}$ and $P(E)=1/3$"
      }
    ],
    "applications": [
      {
        "title": "Coin flips as a first model",
        "background": "Coin tossing is standard because the sample space is tiny and symmetric.",
        "numbers": "For two flips, at least one head is $\\{HH,HT,TH\\}$, so $P=3/4$."
      },
      {
        "title": "Quality control",
        "background": "Factories sample items to reason about defects without inspecting everything.",
        "numbers": "With $95$ good chips and $5$ defective chips, the defect event has probability $5/100=0.05$."
      },
      {
        "title": "Classification labels",
        "background": "In ML, the label space is the sample space of possible targets.",
        "numbers": "For $\\{cat,dog,car,bike\\}$, the vehicle event $\\{car,bike\\}$ has uniform probability $2/4=0.5$."
      },
      {
        "title": "A/B testing",
        "background": "Experiment teams define outcomes such as purchase before analyzing results.",
        "numbers": "If $120$ of $1000$ users purchase, the empirical purchase probability is $120/1000=0.12$."
      },
      {
        "title": "Ranking impressions",
        "background": "Search and feed systems define events such as click, save, or skip per impression.",
        "numbers": "If $45$ of $900$ impressions get a click, the click event rate is $45/900=0.05$."
      },
      {
        "title": "Robot safety states",
        "background": "A robot planner can treat grid cells as outcomes and safe cells as an event.",
        "numbers": "If $9$ of $60$ cells are blocked, the blocked event covers $9/60=0.15$ of the grid."
      }
    ],
    "applicationsClose": "From dice to datasets, the first act is the same: name possible outcomes, then name the subset that matters.",
    "takeaways": [
      "A sample space $S$ lists all outcomes at the chosen level of detail.",
      "An event is a subset of $S$.",
      "For finite equally likely outcomes, $P(A)=|A|/|S|$.",
      "Careful event definitions prevent probability errors later."
    ]
  },
  "math-17-02": {
    "id": "math-17-02",
    "title": "Set operations on events",
    "tagline": "Union, intersection, and complement let events combine without losing their meaning.",
    "connections": {
      "buildsOn": [
        "Sample spaces and events",
        "sets",
        "Venn diagrams"
      ],
      "leadsTo": [
        "Axioms of probability",
        "conditional probability",
        "inclusion-exclusion"
      ],
      "usedWith": [
        "logic",
        "counting",
        "Venn diagrams",
        "indicator functions"
      ]
    },
    "motivation": "<p>After events are sets, everyday words become precise. A user clicks or buys, a card is red and a queen, a test is positive but the patient is healthy. Probability needs exact language for these combined statements.</p><p><b>Set operations</b> give that language: or, and, and not become operations we can count and reason about.</p>",
    "definition": "<p>For events $A,B\\subseteq S$, the <b>union</b> $A\\cup B$ means $A$ or $B$ or both happen. The <b>intersection</b> $A\\cap B$ means both happen. The <b>complement</b> $A^c$ means $A$ does not happen, relative to $S$.</p><p>The counting identity $|A\\cup B|=|A|+|B|-|A\\cap B|$ subtracts the overlap because outcomes in both sets were counted twice.</p><p><b>Assumptions that matter:</b> all events use the same sample space; complements are relative to that space; and disjoint events have empty intersection.</p>",
    "worked": {
      "problem": "From numbers $1$ through $12$, let $A$ be multiples of $2$ and $B$ multiples of $3$. Find $A\\cup B$, $A\\cap B$, and $A^c$.",
      "skills": [
        "union",
        "intersection",
        "complement"
      ],
      "strategy": "List each event, then combine by meaning.",
      "steps": [
        {
          "do": "List $A$",
          "result": "$A=\\{2,4,6,8,10,12\\}$",
          "why": "multiples of $2$"
        },
        {
          "do": "List $B$",
          "result": "$B=\\{3,6,9,12\\}$",
          "why": "multiples of $3$"
        },
        {
          "do": "Find the intersection",
          "result": "$A\\cap B=\\{6,12\\}$",
          "why": "these appear in both lists"
        },
        {
          "do": "Find the union",
          "result": "$A\\cup B=\\{2,3,4,6,8,9,10,12\\}$",
          "why": "include outcomes in either list once"
        },
        {
          "do": "Find the complement",
          "result": "$A^c=\\{1,3,5,7,9,11\\}$",
          "why": "these are in $S$ but not $A$"
        }
      ],
      "verify": "The union has $6+4-2=8$ elements, matching the list.",
      "answer": "$A\\cup B=\\{2,3,4,6,8,9,10,12\\}$, $A\\cap B=\\{6,12\\}$, and $A^c=\\{1,3,5,7,9,11\\}$.",
      "connects": "Compound probability statements are set operations in disguise."
    },
    "practice": [
      {
        "problem": "In $S=\\{1,2,3,4,5,6\\}$, $A=\\{1,2,3\\}$ and $B=\\{3,4,5\\}$. Find union and intersection.",
        "steps": [
          {
            "do": "Write both sets",
            "result": "$A=\\{1,2,3\\}$ and $B=\\{3,4,5\\}$",
            "why": "start from the given events"
          },
          {
            "do": "Collect elements in either set",
            "result": "$\\{1,2,3,4,5\\}$",
            "why": "union means or"
          },
          {
            "do": "Collect elements in both",
            "result": "$\\{3\\}$",
            "why": "intersection means and"
          },
          {
            "do": "Count the union",
            "result": "$5$",
            "why": "five distinct elements appear"
          },
          {
            "do": "Check the count",
            "result": "$3+3-1=5$",
            "why": "subtract the overlap"
          }
        ],
        "answer": "$A\\cup B=\\{1,2,3,4,5\\}$ and $A\\cap B=\\{3\\}$"
      },
      {
        "problem": "For a die, let $E$ be even and $L$ be less than $4$. Find $E^c$ and $E\\cap L$.",
        "steps": [
          {
            "do": "List $E$",
            "result": "$E=\\{2,4,6\\}$",
            "why": "even rolls"
          },
          {
            "do": "List $L$",
            "result": "$L=\\{1,2,3\\}$",
            "why": "rolls less than $4$"
          },
          {
            "do": "Find complement",
            "result": "$E^c=\\{1,3,5\\}$",
            "why": "all die outcomes not even"
          },
          {
            "do": "Find intersection",
            "result": "$E\\cap L=\\{2\\}$",
            "why": "only $2$ is in both"
          },
          {
            "do": "State sizes",
            "result": "$|E^c|=3$, $|E\\cap L|=1$",
            "why": "counts support probabilities"
          }
        ],
        "answer": "$E^c=\\{1,3,5\\}$ and $E\\cap L=\\{2\\}$"
      },
      {
        "problem": "A card is red or a queen. Count the event in a $52$-card deck.",
        "steps": [
          {
            "do": "Count red cards",
            "result": "$|R|=26$",
            "why": "two red suits"
          },
          {
            "do": "Count queens",
            "result": "$|Q|=4$",
            "why": "one per suit"
          },
          {
            "do": "Count overlap",
            "result": "$|R\\cap Q|=2$",
            "why": "two red queens"
          },
          {
            "do": "Apply inclusion-exclusion",
            "result": "$|R\\cup Q|=26+4-2$",
            "why": "avoid double counting"
          },
          {
            "do": "Compute",
            "result": "$28$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "There are $28$ such cards."
      },
      {
        "problem": "Among $100$ users, $40$ clicked, $25$ purchased, and $10$ did both. Count clicked or purchased.",
        "steps": [
          {
            "do": "Name events",
            "result": "$C$ and $P$",
            "why": "clicked and purchased"
          },
          {
            "do": "Write counts",
            "result": "$|C|=40$, $|P|=25$, $|C\\cap P|=10$",
            "why": "given data"
          },
          {
            "do": "Use inclusion-exclusion",
            "result": "$|C\\cup P|=40+25-10$",
            "why": "subtract overlap"
          },
          {
            "do": "Compute union",
            "result": "$55$",
            "why": "$65-10=55$"
          },
          {
            "do": "Compute neither",
            "result": "$100-55=45$",
            "why": "complement of the union"
          }
        ],
        "answer": "$55$ users clicked or purchased; $45$ did neither."
      },
      {
        "problem": "For $200$ cases, $|T|=70$, $|\\hat T|=80$, and $|T\\cap\\hat T|=50$. Count false positives and false negatives.",
        "steps": [
          {
            "do": "Read true positives",
            "result": "$|T\\cap\\hat T|=50$",
            "why": "both true and predicted positive"
          },
          {
            "do": "Compute false positives",
            "result": "$80-50=30$",
            "why": "predicted positive but not truly positive"
          },
          {
            "do": "Compute false negatives",
            "result": "$70-50=20$",
            "why": "truly positive but not predicted positive"
          },
          {
            "do": "Count union",
            "result": "$70+80-50=100$",
            "why": "positive by truth or prediction"
          },
          {
            "do": "Check totals",
            "result": "$200-100=100$",
            "why": "neither positive remains"
          }
        ],
        "answer": "False positives $30$ and false negatives $20$"
      }
    ],
    "applications": [
      {
        "title": "Database filters",
        "background": "Query languages combine conditions with AND, OR, and NOT.",
        "numbers": "If $300$ rows satisfy age, $120$ satisfy region, and $80$ satisfy both, OR returns $300+120-80=340$ rows."
      },
      {
        "title": "Confusion matrices",
        "background": "Classifier evaluation is set arithmetic on true and predicted label events.",
        "numbers": "If $80$ are predicted positive and $50$ are true positives, false positives are $30$."
      },
      {
        "title": "Recommendation funnels",
        "background": "Product funnels track unions and intersections of view, click, save, and buy.",
        "numbers": "With $200$ clicks, $50$ buys, and $30$ both, click or buy count is $220$."
      },
      {
        "title": "Privacy cohorts",
        "background": "Access rules often combine allowed groups and exclusions.",
        "numbers": "If team A has $40$, team B has $35$, and overlap is $10$, the union has $65$ users."
      },
      {
        "title": "Feature flags",
        "background": "Experiment flags combine targeting rules using set operations.",
        "numbers": "If $60\\%$ match country, $20\\%$ match employee, and $5\\%$ match both, OR covers $75\\%$."
      },
      {
        "title": "Deduplication",
        "background": "Data cleaning combines sources without counting repeated records twice.",
        "numbers": "Source 1 has $900$ ids, source 2 has $700$, overlap $250$, so unique ids are $1350$."
      }
    ],
    "applicationsClose": "Across these examples, the same probability idea keeps its shape while the objects change from toy outcomes to real model behavior.",
    "takeaways": [
      "$A\\cup B$ means $A$ or $B$ or both.",
      "$A\\cap B$ means both events happen.",
      "$A^c$ means not $A$ inside the chosen sample space.",
      "Inclusion-exclusion subtracts overlap counted twice."
    ]
  },
  "math-17-03": {
    "id": "math-17-03",
    "title": "Axioms of probability",
    "tagline": "The axioms are the small rulebook that every valid probability model must obey.",
    "connections": {
      "buildsOn": [
        "Sample spaces and events",
        "Set operations on events"
      ],
      "leadsTo": [
        "Combinatorial probability",
        "conditional probability",
        "Bayes theorem"
      ],
      "usedWith": [
        "sets",
        "measure",
        "logic"
      ]
    },
    "motivation": "<p>It is tempting to treat probabilities as vibes, but useful probability needs rules. The axioms are simple: no negative chances, total chance one, and add disjoint pieces by addition.</p><p>From those rules come the formulas used throughout statistics and ML.</p>",
    "definition": "<p>A probability measure $P$ assigns each event $A\\subseteq S$ a number. The axioms are: $P(A)\\ge0$; $P(S)=1$; and if $A$ and $B$ are disjoint, then $P(A\\cup B)=P(A)+P(B)$.</p><p>From $S=A\\cup A^c$ with disjoint pieces, $1=P(S)=P(A)+P(A^c)$, so $P(A^c)=1-P(A)$.</p><p><b>Assumptions that matter:</b> events are in one sample space; probabilities are normalized to total $1$; and additivity without subtraction applies only to disjoint events.</p>",
    "worked": {
      "problem": "If $P(A)=0.35$, $P(B)=0.20$, and $A,B$ are disjoint, find $P(A^c)$ and $P(A\\cup B)$.",
      "skills": [
        "axioms",
        "complements",
        "disjoint addition"
      ],
      "strategy": "Translate the words into events or formulas, then compute one piece at a time.",
      "steps": [
        {
          "do": "Use complement",
          "result": "$P(A^c)=1-0.35=0.65$",
          "why": "total probability is $1$"
        },
        {
          "do": "Use disjoint additivity",
          "result": "$P(A\\cup B)=0.35+0.20=0.55$",
          "why": "disjoint events do not overlap"
        }
      ],
      "verify": "The result respects the probability rules and the arithmetic matches the event definition.",
      "answer": "$P(A\\cup B)=0.35+0.20=0.55$",
      "connects": "Axioms of probability gives a reusable rule for this calculation."
    },
    "practice": [
      {
        "problem": "If $P(A)=0.28$, find $P(A^c)$.",
        "steps": [
          {
            "do": "Write the complement rule",
            "result": "$P(A^c)=1-P(A)$",
            "why": "the event and its complement fill the sample space"
          },
          {
            "do": "Substitute",
            "result": "$P(A^c)=1-0.28$",
            "why": "use the given probability"
          },
          {
            "do": "Subtract",
            "result": "$P(A^c)=0.72$",
            "why": "remaining probability goes outside $A$"
          },
          {
            "do": "Check nonnegativity",
            "result": "$0.72\\ge0$",
            "why": "axioms require probabilities not be negative"
          },
          {
            "do": "Check total",
            "result": "$0.28+0.72=1$",
            "why": "the event and complement sum to one"
          }
        ],
        "answer": "$P(A^c)=0.72$."
      },
      {
        "problem": "Disjoint events have $P(A)=0.15$ and $P(B)=0.40$. Find $P(A\\cup B)$.",
        "steps": [
          {
            "do": "Identify disjointness",
            "result": "$A\\cap B=\\varnothing$",
            "why": "there is no overlap to subtract"
          },
          {
            "do": "Use additivity",
            "result": "$P(A\\cup B)=P(A)+P(B)$",
            "why": "axiom for disjoint events"
          },
          {
            "do": "Substitute",
            "result": "$0.15+0.40$",
            "why": "use the given probabilities"
          },
          {
            "do": "Add",
            "result": "$0.55$",
            "why": "sum the disjoint pieces"
          },
          {
            "do": "Check the range",
            "result": "$0.55\\le1$",
            "why": "the answer is a valid probability"
          }
        ],
        "answer": "$P(A\\cup B)=0.55$."
      },
      {
        "problem": "If $P(A)=0.6$, $P(B)=0.5$, and $P(A\\cap B)=0.2$, find $P(A\\cup B)$.",
        "steps": [
          {
            "do": "Use the general union formula",
            "result": "$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$",
            "why": "overlap is counted twice"
          },
          {
            "do": "Substitute",
            "result": "$0.6+0.5-0.2$",
            "why": "enter all three probabilities"
          },
          {
            "do": "Add first",
            "result": "$1.1-0.2$",
            "why": "combine event probabilities"
          },
          {
            "do": "Subtract overlap",
            "result": "$0.9$",
            "why": "remove double count"
          },
          {
            "do": "Check plausibility",
            "result": "$0.9\\ge0.6$ and $0.9\\ge0.5$",
            "why": "the union contains both events"
          }
        ],
        "answer": "$P(A\\cup B)=0.9$."
      },
      {
        "problem": "A proposed model says $P(A)=1.2$. Explain why it is invalid.",
        "steps": [
          {
            "do": "Recall nonnegativity and normalization",
            "result": "$0\\le P(A)\\le1$",
            "why": "an event cannot exceed the whole sample space"
          },
          {
            "do": "Compare the proposed value",
            "result": "$1.2>1$",
            "why": "it is larger than total probability"
          },
          {
            "do": "Apply the axiom",
            "result": "$P(S)=1$",
            "why": "the sample space has probability one"
          },
          {
            "do": "Conclude validity",
            "result": "invalid probability assignment",
            "why": "the proposal violates the axioms"
          },
          {
            "do": "State a repair idea",
            "result": "renormalize or correct the model",
            "why": "probabilities must be calibrated to total one"
          }
        ],
        "answer": "The model is invalid because an event probability cannot exceed $1$."
      },
      {
        "problem": "Three disjoint classes have probabilities $0.2$, $0.3$, and $0.4$. Find the missing other-class probability.",
        "steps": [
          {
            "do": "Add known classes",
            "result": "$0.2+0.3+0.4=0.9$",
            "why": "disjoint class probabilities add"
          },
          {
            "do": "Use total probability",
            "result": "$P(S)=1$",
            "why": "all classes together must sum to one"
          },
          {
            "do": "Subtract known mass",
            "result": "$1-0.9=0.1$",
            "why": "the remainder belongs to other"
          },
          {
            "do": "Check nonnegativity",
            "result": "$0.1\\ge0$",
            "why": "the missing probability is valid"
          },
          {
            "do": "Check total",
            "result": "$0.2+0.3+0.4+0.1=1$",
            "why": "the completed distribution is normalized"
          }
        ],
        "answer": "The missing probability is $0.1$."
      }
    ],
    "applications": [
      {
        "title": "Probability calibration",
        "background": "Calibration checks whether predicted probabilities obey real frequencies.",
        "numbers": "If a model gives ten bins of mass $0.1$ each, the total mass is $10\\cdot0.1=1$."
      },
      {
        "title": "Dataset class priors",
        "background": "Class probabilities must sum to one before they can be used as priors.",
        "numbers": "Counts $500,300,200$ out of $1000$ give priors $0.5,0.3,0.2$, summing to $1$."
      },
      {
        "title": "Mutually exclusive labels",
        "background": "Single-label classification assumes one true class per example.",
        "numbers": "If class A is $0.7$ and class B is $0.2$, then $P(A\\cup B)=0.9$ because they are disjoint."
      },
      {
        "title": "Anomaly rates",
        "background": "Complement probabilities are often easier than direct counts.",
        "numbers": "If normal traffic is $0.995$, anomaly probability is $1-0.995=0.005$."
      },
      {
        "title": "Sampling audits",
        "background": "A probability table with total above one reveals a data or modeling bug.",
        "numbers": "Entries $0.4,0.35,0.30$ sum to $1.05$, so they cannot be a valid distribution."
      },
      {
        "title": "Risk aggregation",
        "background": "Disjoint failure modes can be added safely.",
        "numbers": "If memory failure is $0.01$ and disk failure is $0.02$ with no overlap in the model, total failure probability is $0.03$."
      }
    ],
    "applicationsClose": "The axioms are small, but they are the guardrails behind every probability table and ML uncertainty estimate.",
    "takeaways": [
      "Axioms of probability is a core probability tool for ML mathematics.",
      "Name the events and assumptions before calculating.",
      "Check that probability answers stay between $0$ and $1$.",
      "The same rule works for toy examples and data systems."
    ]
  },
  "math-17-04": {
    "id": "math-17-04",
    "title": "Combinatorial probability",
    "tagline": "Counting carefully lets probability handle large spaces without listing every outcome.",
    "connections": {
      "buildsOn": [
        "Axioms of probability",
        "counting",
        "factorials"
      ],
      "leadsTo": [
        "Conditional probability",
        "binomial distributions",
        "sampling"
      ],
      "usedWith": [
        "combinations",
        "permutations",
        "sets"
      ]
    },
    "motivation": "<p>Listing outcomes is fine for one die, but it collapses for passwords, cards, and mini-batches. Combinatorics gives us a way to count without writing everything down.</p><p>The heart is still $P=\\text{favorable}/\\text{total}$, but the counts now come from permutations and combinations.</p>",
    "definition": "<p>When outcomes are equally likely, $P(A)=|A|/|S|$. The product rule says $m$ choices followed by $n$ choices give $mn$ ordered outcomes. Combinations count unordered selections: $\\binom{n}{k}=\\dfrac{n!}{k!(n-k)!}$.</p><p>The formula divides $n!$ ordered arrangements by $k!$ reorderings inside the chosen group and $(n-k)!$ reorderings outside it.</p><p><b>Assumptions that matter:</b> decide whether order matters, whether replacement is allowed, and whether all counted outcomes are equally likely.</p>",
    "worked": {
      "problem": "From $10$ images, choose $3$ for review uniformly. What is the probability that a particular image is included?",
      "skills": [
        "combinations",
        "symmetry",
        "finite probability"
      ],
      "strategy": "Translate the words into events or formulas, then compute one piece at a time.",
      "steps": [
        {
          "do": "Count all review sets",
          "result": "$\\binom{10}{3}=120$",
          "why": "choose 3 unordered images"
        },
        {
          "do": "Count sets including the target",
          "result": "$\\binom{9}{2}=36$",
          "why": "after including it, choose 2 of the remaining 9"
        },
        {
          "do": "Divide counts",
          "result": "$36/120=0.30$",
          "why": "favorable over total"
        }
      ],
      "verify": "The result respects the probability rules and the arithmetic matches the event definition.",
      "answer": "$36/120=0.30$",
      "connects": "Combinatorial probability gives a reusable rule for this calculation."
    },
    "practice": [
      {
        "problem": "How many $4$-digit PINs are possible if digits may repeat?",
        "steps": [
          {
            "do": "Count choices for digit 1",
            "result": "$10$",
            "why": "digits $0$ through $9$ are allowed"
          },
          {
            "do": "Count choices for digit 2",
            "result": "$10$",
            "why": "repetition is allowed"
          },
          {
            "do": "Count choices for digit 3",
            "result": "$10$",
            "why": "same rule again"
          },
          {
            "do": "Count choices for digit 4",
            "result": "$10$",
            "why": "same rule again"
          },
          {
            "do": "Multiply choices",
            "result": "$10^4=10000$",
            "why": "product rule for ordered choices"
          }
        ],
        "answer": "There are $10000$ possible PINs."
      },
      {
        "problem": "How many ways can $3$ reviewers be chosen from $8$ people?",
        "steps": [
          {
            "do": "Decide whether order matters",
            "result": "order does not matter",
            "why": "a group of reviewers has no first reviewer"
          },
          {
            "do": "Write the combination",
            "result": "$\\binom{8}{3}$",
            "why": "choose 3 from 8"
          },
          {
            "do": "Expand",
            "result": "$\\dfrac{8!}{3!5!}$",
            "why": "combination formula"
          },
          {
            "do": "Cancel",
            "result": "$\\dfrac{8\\cdot7\\cdot6}{3\\cdot2\\cdot1}$",
            "why": "common $5!$ cancels"
          },
          {
            "do": "Compute",
            "result": "$56$",
            "why": "the quotient is $336/6$"
          }
        ],
        "answer": "$56$ reviewer groups are possible."
      },
      {
        "problem": "A hand of $5$ cards is drawn. Find the probability all are hearts.",
        "steps": [
          {
            "do": "Count all hands",
            "result": "$\\binom{52}{5}=2598960$",
            "why": "five-card hands are unordered"
          },
          {
            "do": "Count all-heart hands",
            "result": "$\\binom{13}{5}=1287$",
            "why": "choose all cards from hearts"
          },
          {
            "do": "Set up probability",
            "result": "$1287/2598960$",
            "why": "favorable over total"
          },
          {
            "do": "Approximate",
            "result": "$0.000495$",
            "why": "divide the counts"
          },
          {
            "do": "Interpret",
            "result": "about $0.0495\\%$",
            "why": "very rare because all suits must match"
          }
        ],
        "answer": "The probability is $1287/2598960\\approx0.000495$."
      },
      {
        "problem": "From $12$ data points, choose a validation set of $4$. What is the probability a fixed point is included?",
        "steps": [
          {
            "do": "Count all validation sets",
            "result": "$\\binom{12}{4}=495$",
            "why": "choose 4 of 12"
          },
          {
            "do": "Force the fixed point in",
            "result": "choose $3$ of remaining $11$",
            "why": "one slot is already used"
          },
          {
            "do": "Count favorable sets",
            "result": "$\\binom{11}{3}=165$",
            "why": "choose the other validation points"
          },
          {
            "do": "Divide",
            "result": "$165/495=1/3$",
            "why": "favorable over total"
          },
          {
            "do": "Check by symmetry",
            "result": "$4/12=1/3$",
            "why": "four validation slots among twelve points"
          }
        ],
        "answer": "The fixed point is included with probability $1/3$."
      },
      {
        "problem": "A mini-batch of $2$ is sampled without replacement from $6$ examples, $2$ of which are positive. Find probability both are positive.",
        "steps": [
          {
            "do": "Count all batches",
            "result": "$\\binom{6}{2}=15$",
            "why": "unordered sample without replacement"
          },
          {
            "do": "Count positive-only batches",
            "result": "$\\binom{2}{2}=1$",
            "why": "must take both positives"
          },
          {
            "do": "Compute probability",
            "result": "$1/15$",
            "why": "favorable over total"
          },
          {
            "do": "Convert decimal",
            "result": "$0.0667$",
            "why": "one divided by fifteen"
          },
          {
            "do": "Interpret",
            "result": "about $6.67\\%$",
            "why": "both positives is uncommon"
          }
        ],
        "answer": "The probability is $1/15\\approx0.0667$."
      }
    ],
    "applications": [
      {
        "title": "Password spaces",
        "background": "Security estimates count possible strings before reasoning about attack probability.",
        "numbers": "An $8$-character lowercase password has $26^8=208827064576$ possibilities."
      },
      {
        "title": "Train-validation splits",
        "background": "ML workflows choose subsets for validation or test sets.",
        "numbers": "Choosing $20$ validation points from $100$ gives $\\binom{100}{20}$ possible splits."
      },
      {
        "title": "Random forests",
        "background": "Feature subsampling in trees is combinatorial.",
        "numbers": "Choosing $3$ features from $10$ at a split gives $\\binom{10}{3}=120$ possible feature subsets."
      },
      {
        "title": "Card-game baselines",
        "background": "Combinatorics made probability concrete historically through gambling problems.",
        "numbers": "A five-card flush in a fixed suit has $\\binom{13}{5}=1287$ hands."
      },
      {
        "title": "Hyperparameter grids",
        "background": "Grid search counts configurations by multiplying choices.",
        "numbers": "With $4$ learning rates, $3$ depths, and $5$ seeds, there are $4\\cdot3\\cdot5=60$ runs."
      },
      {
        "title": "Negative sampling",
        "background": "Sampling examples without replacement uses combinations.",
        "numbers": "Choosing $5$ negatives from $1000$ possible negatives gives $\\binom{1000}{5}$ possible sets."
      }
    ],
    "applicationsClose": "Combinatorial probability keeps the sample-space idea alive when listing outcomes would be impossible.",
    "takeaways": [
      "Combinatorial probability is a core probability tool for ML mathematics.",
      "Name the events and assumptions before calculating.",
      "Check that probability answers stay between $0$ and $1$.",
      "The same rule works for toy examples and data systems."
    ]
  },
  "math-17-05": {
    "id": "math-17-05",
    "title": "Conditional probability",
    "tagline": "Conditional probability updates the sample space to the world where new information is true.",
    "connections": {
      "buildsOn": [
        "Set operations on events",
        "Axioms of probability"
      ],
      "leadsTo": [
        "Independence",
        "Law of total probability",
        "Bayes theorem"
      ],
      "usedWith": [
        "fractions",
        "sets",
        "ratios"
      ]
    },
    "motivation": "<p>New information changes the question. If you know a card is a queen, the chance it is red is not counted over all $52$ cards anymore; it is counted over the four queens.</p><p>That is the entire warmth of conditional probability: keep only the cases consistent with what you learned.</p>",
    "definition": "<p>For events $A$ and $B$ with $P(B)>0$, the <b>conditional probability</b> of $A$ given $B$ is $P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}$.</p><p>The formula comes from restricting attention to $B$: within the $B$ world, the favorable part is $A\\cap B$, and the total part is $B$.</p><p><b>Assumptions that matter:</b> $P(B)$ must be positive; the vertical bar means given, not division by an event; and conditioning can change probabilities dramatically.</p>",
    "worked": {
      "problem": "In a deck, given the card is a queen, find the probability it is red.",
      "skills": [
        "conditioning",
        "intersection",
        "renormalizing"
      ],
      "strategy": "Translate the words into events or formulas, then compute one piece at a time.",
      "steps": [
        {
          "do": "Count the given event",
          "result": "$|Q|=4$",
          "why": "there are four queens"
        },
        {
          "do": "Count red queens",
          "result": "$|R\\cap Q|=2$",
          "why": "hearts and diamonds are red"
        },
        {
          "do": "Compute conditional probability",
          "result": "$P(R\\mid Q)=2/4=1/2$",
          "why": "restrict the sample space to queens"
        }
      ],
      "verify": "The result respects the probability rules and the arithmetic matches the event definition.",
      "answer": "$P(R\\mid Q)=2/4=1/2$",
      "connects": "Conditional probability gives a reusable rule for this calculation."
    },
    "practice": [
      {
        "problem": "In $100$ users, $30$ use mobile and $12$ mobile users click. Find $P(click\\mid mobile)$.",
        "steps": [
          {
            "do": "Name events",
            "result": "$C$ click, $M$ mobile",
            "why": "conditioning event is mobile"
          },
          {
            "do": "Write counts",
            "result": "$|C\\cap M|=12$, $|M|=30$",
            "why": "clicking mobile users over all mobile users"
          },
          {
            "do": "Use formula",
            "result": "$P(C\\mid M)=|C\\cap M|/|M|$",
            "why": "restrict to mobile"
          },
          {
            "do": "Substitute",
            "result": "$12/30$",
            "why": "use counts"
          },
          {
            "do": "Simplify",
            "result": "$0.4$",
            "why": "divide by $30$"
          }
        ],
        "answer": "$P(click\\mid mobile)=0.4$."
      },
      {
        "problem": "A card is known to be red. Find probability it is a king.",
        "steps": [
          {
            "do": "Count red cards",
            "result": "$26$",
            "why": "hearts and diamonds"
          },
          {
            "do": "Count red kings",
            "result": "$2$",
            "why": "king of hearts and diamonds"
          },
          {
            "do": "Use conditional probability",
            "result": "$2/26$",
            "why": "given red means red is the denominator"
          },
          {
            "do": "Reduce",
            "result": "$1/13$",
            "why": "divide by $2$"
          },
          {
            "do": "Interpret",
            "result": "same as ordinary king probability",
            "why": "color does not change rank in a fair deck"
          }
        ],
        "answer": "$1/13$."
      },
      {
        "problem": "If $P(A\\cap B)=0.18$ and $P(B)=0.6$, find $P(A\\mid B)$.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$P(A\\mid B)=P(A\\cap B)/P(B)$",
            "why": "definition of conditioning"
          },
          {
            "do": "Substitute",
            "result": "$0.18/0.6$",
            "why": "use given probabilities"
          },
          {
            "do": "Divide",
            "result": "$0.3$",
            "why": "eighteen hundredths over six tenths"
          },
          {
            "do": "Check range",
            "result": "$0.3\\le1$",
            "why": "valid conditional probability"
          },
          {
            "do": "State meaning",
            "result": "inside $B$, $30\\%$ also has $A$",
            "why": "conditioned sample space"
          }
        ],
        "answer": "$P(A\\mid B)=0.3$."
      },
      {
        "problem": "A confusion matrix has $50$ true positives and $20$ false negatives. Find recall.",
        "steps": [
          {
            "do": "Define recall",
            "result": "$P(\\hat T\\mid T)$",
            "why": "predicted positive given truly positive"
          },
          {
            "do": "Count truly positive",
            "result": "$50+20=70$",
            "why": "true positives plus false negatives"
          },
          {
            "do": "Set numerator",
            "result": "$50$",
            "why": "true positives"
          },
          {
            "do": "Compute",
            "result": "$50/70=5/7$",
            "why": "divide by truly positive total"
          },
          {
            "do": "Approximate",
            "result": "$0.714$",
            "why": "recall is about $71.4\\%$"
          }
        ],
        "answer": "Recall is $5/7\\approx0.714$."
      },
      {
        "problem": "A model score is high for $80$ examples; $60$ of those are actually positive. Find precision.",
        "steps": [
          {
            "do": "Define precision",
            "result": "$P(T\\mid \\hat T)$",
            "why": "true positive given predicted positive"
          },
          {
            "do": "Set denominator",
            "result": "$80$",
            "why": "all high-score predicted positives"
          },
          {
            "do": "Set numerator",
            "result": "$60$",
            "why": "actual positives among them"
          },
          {
            "do": "Divide",
            "result": "$60/80=0.75$",
            "why": "conditional fraction"
          },
          {
            "do": "Interpret",
            "result": "three of four high-score cases are positive",
            "why": "precision describes reliability of positive predictions"
          }
        ],
        "answer": "Precision is $0.75$."
      }
    ],
    "applications": [
      {
        "title": "Precision",
        "background": "Precision is conditional probability in classifier evaluation.",
        "numbers": "$60$ true positives among $80$ predicted positives gives $P(T\\mid \\hat T)=60/80=0.75$."
      },
      {
        "title": "Recall",
        "background": "Recall conditions on the true positive class.",
        "numbers": "$50$ true positives and $20$ false negatives give recall $50/(50+20)=0.714$."
      },
      {
        "title": "Click-through by device",
        "background": "Product metrics are often conditional on segment.",
        "numbers": "$12$ clicks among $300$ mobile impressions gives $P(click\\mid mobile)=0.04$."
      },
      {
        "title": "Medical tests",
        "background": "Diagnostic interpretation depends on conditioning on the test result or disease status.",
        "numbers": "$95$ positives among $100$ sick patients gives sensitivity $0.95$."
      },
      {
        "title": "Recommendation relevance",
        "background": "Offline recommendation metrics condition on shown or retrieved items.",
        "numbers": "If $18$ of $40$ retrieved items are relevant, relevance given retrieval is $18/40=0.45$."
      },
      {
        "title": "Data quality",
        "background": "Error rates are often reported within a source.",
        "numbers": "$7$ bad rows among $500$ rows from source A gives $P(error\\mid A)=0.014$."
      }
    ],
    "applicationsClose": "Conditioning is the habit of changing the denominator to match the information you have.",
    "takeaways": [
      "Conditional probability is a core probability tool for ML mathematics.",
      "Name the events and assumptions before calculating.",
      "Check that probability answers stay between $0$ and $1$.",
      "The same rule works for toy examples and data systems."
    ]
  },
  "math-17-06": {
    "id": "math-17-06",
    "title": "Independence",
    "tagline": "Independent events do not change each other when you condition on one of them.",
    "connections": {
      "buildsOn": [
        "Conditional probability",
        "Axioms of probability"
      ],
      "leadsTo": [
        "Law of total probability",
        "Bayes theorem",
        "random variables"
      ],
      "usedWith": [
        "products",
        "conditional probability",
        "factorization"
      ]
    },
    "motivation": "<p>Some information matters; some does not. Knowing a fair coin landed heads tells you nothing about an independently rolled die. Knowing a medical test is positive, however, may matter a lot.</p><p>Independence is the precise statement that learning one event leaves the probability of the other unchanged.</p>",
    "definition": "<p>Events $A$ and $B$ are <b>independent</b> when $P(A\\cap B)=P(A)P(B)$. If $P(B)>0$, this is equivalent to $P(A\\mid B)=P(A)$.</p><p>The equivalence follows by dividing $P(A\\cap B)=P(A)P(B)$ by $P(B)$, giving $P(A\\mid B)=P(A)$.</p><p><b>Assumptions that matter:</b> independence is not the same as disjointness; it must be justified by design or checked from probabilities; and pairwise independence need not imply mutual independence for many events.</p>",
    "worked": {
      "problem": "A fair coin and fair die are used. Let $A$ be heads and $B$ be rolling $6$. Check independence.",
      "skills": [
        "product rule",
        "conditioning",
        "finite spaces"
      ],
      "strategy": "Translate the words into events or formulas, then compute one piece at a time.",
      "steps": [
        {
          "do": "Compute $P(A)$",
          "result": "$1/2$",
          "why": "one head outcome out of two"
        },
        {
          "do": "Compute $P(B)$",
          "result": "$1/6$",
          "why": "one die face out of six"
        },
        {
          "do": "Compute the joint probability",
          "result": "$P(A\\cap B)=1/12$",
          "why": "one combined outcome among twelve"
        },
        {
          "do": "Multiply marginals",
          "result": "$P(A)P(B)=(1/2)(1/6)=1/12$",
          "why": "compare with the joint"
        }
      ],
      "verify": "The result respects the probability rules and the arithmetic matches the event definition.",
      "answer": "$P(A)P(B)=(1/2)(1/6)=1/12$",
      "connects": "Independence gives a reusable rule for this calculation."
    },
    "practice": [
      {
        "problem": "A fair coin and die are tossed. Check whether heads and even are independent.",
        "steps": [
          {
            "do": "Compute $P(H)$",
            "result": "$1/2$",
            "why": "one side of coin"
          },
          {
            "do": "Compute $P(E)$",
            "result": "$3/6=1/2$",
            "why": "three even die faces"
          },
          {
            "do": "Compute joint probability",
            "result": "$P(H\\cap E)=3/12=1/4$",
            "why": "heads with an even die face"
          },
          {
            "do": "Multiply marginals",
            "result": "$(1/2)(1/2)=1/4$",
            "why": "product matches joint"
          },
          {
            "do": "Conclude",
            "result": "independent",
            "why": "joint equals product"
          }
        ],
        "answer": "They are independent."
      },
      {
        "problem": "If $P(A)=0.4$, $P(B)=0.5$, and $P(A\\cap B)=0.2$, are they independent?",
        "steps": [
          {
            "do": "Multiply marginals",
            "result": "$0.4\\cdot0.5=0.2$",
            "why": "independence product"
          },
          {
            "do": "Compare to joint",
            "result": "$P(A\\cap B)=0.2$",
            "why": "given joint probability"
          },
          {
            "do": "Check equality",
            "result": "$0.2=0.2$",
            "why": "the test passes"
          },
          {
            "do": "Compute conditional",
            "result": "$0.2/0.5=0.4$",
            "why": "conditioning on $B$ leaves $A$ unchanged"
          },
          {
            "do": "Conclude",
            "result": "independent",
            "why": "both criteria agree"
          }
        ],
        "answer": "Yes, the events are independent."
      },
      {
        "problem": "If $P(A)=0.4$, $P(B)=0.5$, and $A,B$ are disjoint, can they be independent?",
        "steps": [
          {
            "do": "Use disjointness",
            "result": "$P(A\\cap B)=0$",
            "why": "disjoint events never happen together"
          },
          {
            "do": "Multiply marginals",
            "result": "$0.4\\cdot0.5=0.2$",
            "why": "independence would require this joint"
          },
          {
            "do": "Compare",
            "result": "$0\\ne0.2$",
            "why": "the product test fails"
          },
          {
            "do": "Check positivity",
            "result": "both events have positive probability",
            "why": "nonzero disjoint events exclude each other"
          },
          {
            "do": "Conclude",
            "result": "not independent",
            "why": "learning one happened rules out the other"
          }
        ],
        "answer": "No, positive-probability disjoint events are not independent."
      },
      {
        "problem": "Two independent failures have probabilities $0.01$ and $0.03$. Find probability both fail.",
        "steps": [
          {
            "do": "Name events",
            "result": "$A$ and $B$ failures",
            "why": "two components"
          },
          {
            "do": "Use independence",
            "result": "$P(A\\cap B)=P(A)P(B)$",
            "why": "joint factors"
          },
          {
            "do": "Substitute",
            "result": "$0.01\\cdot0.03$",
            "why": "use failure probabilities"
          },
          {
            "do": "Multiply",
            "result": "$0.0003$",
            "why": "three ten-thousandths"
          },
          {
            "do": "Interpret",
            "result": "$0.03\\%$",
            "why": "both failing is rarer than either alone"
          }
        ],
        "answer": "The probability both fail is $0.0003$."
      },
      {
        "problem": "Independent dropout masks keep a unit with probability $0.8$ in two layers. Find probability it is kept both times.",
        "steps": [
          {
            "do": "Set probabilities",
            "result": "$P(K_1)=0.8$, $P(K_2)=0.8$",
            "why": "same keep rate"
          },
          {
            "do": "Use independence",
            "result": "$P(K_1\\cap K_2)=0.8\\cdot0.8$",
            "why": "masks are independent"
          },
          {
            "do": "Multiply",
            "result": "$0.64$",
            "why": "eighty percent twice"
          },
          {
            "do": "Find not both if useful",
            "result": "$1-0.64=0.36$",
            "why": "complement"
          },
          {
            "do": "Interpret",
            "result": "kept both times in $64\\%$ of trials",
            "why": "long-run frequency"
          }
        ],
        "answer": "Probability kept both times is $0.64$."
      }
    ],
    "applications": [
      {
        "title": "Naive Bayes",
        "background": "Naive Bayes assumes features are conditionally independent given a class.",
        "numbers": "If word probabilities are $0.2$ and $0.1$ in a class, the joint factor is $0.2\\cdot0.1=0.02$."
      },
      {
        "title": "Dropout",
        "background": "Neural nets often sample independent dropout masks.",
        "numbers": "Keep probability $0.9$ for two units gives both kept probability $0.81$."
      },
      {
        "title": "A/B assignment",
        "background": "Random assignment makes treatment independent of user traits in expectation.",
        "numbers": "If treatment probability is $0.5$ and mobile share is $0.6$, expected treated mobile share is $0.3$."
      },
      {
        "title": "System reliability",
        "background": "Independent component failures multiply for joint failure.",
        "numbers": "Failures $0.01$ and $0.02$ give both-fail probability $0.0002$."
      },
      {
        "title": "Shuffling data",
        "background": "Random shuffling aims to make batch membership independent of ordering artifacts.",
        "numbers": "If $10\\%$ of data is positive, an independent draw has positive probability $0.1$ for each slot."
      },
      {
        "title": "Simulation",
        "background": "Monte Carlo methods often rely on independent repeated samples.",
        "numbers": "For event probability $0.3$, two independent hits have probability $0.09$."
      }
    ],
    "applicationsClose": "Independence is powerful because it turns joint probabilities into products, but only when the assumption is justified.",
    "takeaways": [
      "Independence is a core probability tool for ML mathematics.",
      "Name the events and assumptions before calculating.",
      "Check that probability answers stay between $0$ and $1$.",
      "The same rule works for toy examples and data systems."
    ]
  },
  "math-17-07": {
    "id": "math-17-07",
    "title": "The law of total probability",
    "tagline": "Total probability rebuilds an event from clean cases that cover the world.",
    "connections": {
      "buildsOn": [
        "Conditional probability",
        "Independence"
      ],
      "leadsTo": [
        "Bayes theorem",
        "mixture distributions",
        "expectation"
      ],
      "usedWith": [
        "partitions",
        "weighted averages",
        "sums"
      ]
    },
    "motivation": "<p>Large probability questions are often easier after splitting the world into cases. Maybe traffic comes from mobile or desktop; a patient is sick or healthy; a data point comes from class 0 or class 1.</p><p>The law of total probability says: solve the event inside each case, then add the weighted pieces.</p>",
    "definition": "<p>If $B_1,\\ldots,B_k$ are disjoint events whose union is $S$ and each has positive probability, then $P(A)=\\sum_{i=1}^k P(A\\mid B_i)P(B_i)$.</p><p>This comes from writing $A$ as the disjoint union $(A\\cap B_1)\\cup\\cdots\\cup(A\\cap B_k)$ and using $P(A\\cap B_i)=P(A\\mid B_i)P(B_i)$.</p><p><b>Assumptions that matter:</b> the cases $B_i$ must be mutually disjoint, cover the whole sample space, and have probabilities that sum to $1$.</p>",
    "worked": {
      "problem": "A site has $70\\%$ mobile users and $30\\%$ desktop users. Click rates are $4\\%$ mobile and $6\\%$ desktop. Find overall click probability.",
      "skills": [
        "partitioning",
        "weighted averages",
        "conditional probability"
      ],
      "strategy": "Translate the words into events or formulas, then compute one piece at a time.",
      "steps": [
        {
          "do": "Write the mobile contribution",
          "result": "$0.04\\cdot0.70=0.028$",
          "why": "mobile clicks weighted by mobile share"
        },
        {
          "do": "Write the desktop contribution",
          "result": "$0.06\\cdot0.30=0.018$",
          "why": "desktop clicks weighted by desktop share"
        },
        {
          "do": "Add contributions",
          "result": "$0.028+0.018=0.046$",
          "why": "the cases cover all users"
        }
      ],
      "verify": "The result respects the probability rules and the arithmetic matches the event definition.",
      "answer": "$0.028+0.018=0.046$",
      "connects": "The law of total probability gives a reusable rule for this calculation."
    },
    "practice": [
      {
        "problem": "Two user types: $60\\%$ new with $2\\%$ click rate, $40\\%$ returning with $5\\%$ click rate. Find total click rate.",
        "steps": [
          {
            "do": "Write new-user contribution",
            "result": "$0.60\\cdot0.02=0.012$",
            "why": "rate weighted by share"
          },
          {
            "do": "Write returning contribution",
            "result": "$0.40\\cdot0.05=0.020$",
            "why": "second case weighted by share"
          },
          {
            "do": "Add contributions",
            "result": "$0.012+0.020=0.032$",
            "why": "cases partition users"
          },
          {
            "do": "Convert to percent",
            "result": "$3.2\\%$",
            "why": "decimal to percent"
          },
          {
            "do": "Check range",
            "result": "between $2\\%$ and $5\\%$",
            "why": "weighted averages lie between case rates"
          }
        ],
        "answer": "The total click rate is $0.032$ or $3.2\\%$."
      },
      {
        "problem": "A model serves route A $80\\%$ of the time with failure $1\\%$, route B $20\\%$ with failure $4\\%$. Find failure rate.",
        "steps": [
          {
            "do": "Contribution A",
            "result": "$0.8\\cdot0.01=0.008$",
            "why": "route A weighted failure"
          },
          {
            "do": "Contribution B",
            "result": "$0.2\\cdot0.04=0.008$",
            "why": "route B weighted failure"
          },
          {
            "do": "Add",
            "result": "$0.016$",
            "why": "total probability"
          },
          {
            "do": "Convert",
            "result": "$1.6\\%$",
            "why": "decimal to percent"
          },
          {
            "do": "Interpret",
            "result": "overall service failure",
            "why": "average over routes"
          }
        ],
        "answer": "$1.6\\%$."
      },
      {
        "problem": "Classes have priors $0.7,0.3$ and error rates $0.1,0.2$. Find total error.",
        "steps": [
          {
            "do": "Class 1 contribution",
            "result": "$0.7\\cdot0.1=0.07$",
            "why": "weighted error"
          },
          {
            "do": "Class 2 contribution",
            "result": "$0.3\\cdot0.2=0.06$",
            "why": "weighted error"
          },
          {
            "do": "Add",
            "result": "$0.13$",
            "why": "total error"
          },
          {
            "do": "Check range",
            "result": "between $0.1$ and $0.2$",
            "why": "weighted average"
          },
          {
            "do": "State percent",
            "result": "$13\\%$",
            "why": "interpretation"
          }
        ],
        "answer": "Total error is $0.13$."
      },
      {
        "problem": "A mixture uses component 1 with weight $0.25$ and event chance $0.8$, component 2 with weight $0.75$ and chance $0.4$.",
        "steps": [
          {
            "do": "Component 1 mass",
            "result": "$0.25\\cdot0.8=0.20$",
            "why": "weight times conditional probability"
          },
          {
            "do": "Component 2 mass",
            "result": "$0.75\\cdot0.4=0.30$",
            "why": "second component"
          },
          {
            "do": "Add",
            "result": "$0.50$",
            "why": "total probability"
          },
          {
            "do": "Check",
            "result": "between $0.4$ and $0.8$",
            "why": "weighted average"
          },
          {
            "do": "Conclude",
            "result": "$P(A)=0.50$",
            "why": "overall event chance"
          }
        ],
        "answer": "$P(A)=0.50$."
      },
      {
        "problem": "A spam filter sees $30\\%$ promotional mail with flag rate $0.5$ and $70\\%$ normal mail with flag rate $0.1$. Find flag rate.",
        "steps": [
          {
            "do": "Promo contribution",
            "result": "$0.3\\cdot0.5=0.15$",
            "why": "promotional case"
          },
          {
            "do": "Normal contribution",
            "result": "$0.7\\cdot0.1=0.07$",
            "why": "normal case"
          },
          {
            "do": "Add",
            "result": "$0.22$",
            "why": "all mail types"
          },
          {
            "do": "Check",
            "result": "less than $0.5$ and greater than $0.1$",
            "why": "weighted average"
          },
          {
            "do": "Interpret",
            "result": "$22\\%$ flagged",
            "why": "overall rate"
          }
        ],
        "answer": "The flag rate is $0.22$."
      }
    ],
    "applications": [
      {
        "title": "Traffic mix",
        "background": "Overall rates combine segment rates by traffic share.",
        "numbers": "Mobile $70\\%$ at $4\\%$ click and desktop $30\\%$ at $6\\%$ click gives $0.046$ overall."
      },
      {
        "title": "Class priors",
        "background": "Expected error can be averaged over classes.",
        "numbers": "Class shares $0.8,0.2$ with errors $0.05,0.15$ give $0.8\\cdot0.05+0.2\\cdot0.15=0.07$."
      },
      {
        "title": "Mixture models",
        "background": "Mixtures generate data by first choosing a component.",
        "numbers": "Weights $0.6,0.4$ with event probabilities $0.2,0.7$ give total $0.40$."
      },
      {
        "title": "Medical screening",
        "background": "Population rates combine subgroup risks.",
        "numbers": "Group shares $0.9,0.1$ with risks $0.01,0.08$ give $0.017$ risk."
      },
      {
        "title": "Recommendation channels",
        "background": "Overall engagement averages over surfaces.",
        "numbers": "Feed share $0.75$ at $0.03$ save and search share $0.25$ at $0.05$ save gives $0.035$."
      },
      {
        "title": "Data pipelines",
        "background": "Overall failure rates combine stage-specific routing.",
        "numbers": "Route A $80\\%$ at $1\\%$ fail and route B $20\\%$ at $4\\%$ fail gives $0.016$."
      }
    ],
    "applicationsClose": "Across these examples, the same probability idea keeps its shape while the objects change from toy outcomes to real model behavior.",
    "takeaways": [
      "The law of total probability is a core probability tool for ML mathematics.",
      "Name the events and assumptions before calculating.",
      "Check that probability answers stay between $0$ and $1$.",
      "The same rule works for toy examples and data systems."
    ]
  },
  "math-17-08": {
    "id": "math-17-08",
    "title": "Bayes theorem",
    "tagline": "Bayes theorem turns evidence around: from likelihoods to updated beliefs.",
    "connections": {
      "buildsOn": [
        "The law of total probability",
        "Conditional probability"
      ],
      "leadsTo": [
        "Bayesian inference",
        "Naive Bayes",
        "posterior distributions"
      ],
      "usedWith": [
        "fractions",
        "weighted averages",
        "likelihoods"
      ]
    },
    "motivation": "<p>Often we know how likely evidence is under each cause, but we want the reverse. A test is positive; how likely is the condition? A word appears; how likely is the topic?</p><p>Bayes theorem is the disciplined reversal that combines prior probability with how strongly the evidence points.</p>",
    "definition": "<p>For $P(B)>0$, <b>Bayes theorem</b> says $P(A\\mid B)=\\dfrac{P(B\\mid A)P(A)}{P(B)}$. With cases $A$ and $A^c$, the denominator is $P(B)=P(B\\mid A)P(A)+P(B\\mid A^c)P(A^c)$.</p><p>The formula follows because $P(A\\cap B)$ can be written as both $P(A\\mid B)P(B)$ and $P(B\\mid A)P(A)$.</p><p><b>Assumptions that matter:</b> priors and likelihoods must refer to the same population; $P(B)$ must be positive; and rare base rates can dominate even accurate evidence.</p>",
    "worked": {
      "problem": "A disease affects $1\\%$ of people. A test is $95\\%$ sensitive and has $5\\%$ false positive rate. Given a positive test, find disease probability.",
      "skills": [
        "Bayes theorem",
        "base rates",
        "normalization"
      ],
      "strategy": "Translate the words into events or formulas, then compute one piece at a time.",
      "steps": [
        {
          "do": "Compute true-positive mass",
          "result": "$0.95\\cdot0.01=0.0095$",
          "why": "positive and diseased"
        },
        {
          "do": "Compute false-positive mass",
          "result": "$0.05\\cdot0.99=0.0495$",
          "why": "positive and healthy"
        },
        {
          "do": "Compute positive-test probability",
          "result": "$0.0095+0.0495=0.059$",
          "why": "all ways to test positive"
        },
        {
          "do": "Apply Bayes",
          "result": "$0.0095/0.059\\approx0.161$",
          "why": "normalize the diseased positive mass"
        }
      ],
      "verify": "The result respects the probability rules and the arithmetic matches the event definition.",
      "answer": "$0.0095/0.059\\approx0.161$",
      "connects": "Bayes theorem gives a reusable rule for this calculation."
    },
    "practice": [
      {
        "problem": "Prior spam $0.2$, $P(word\\mid spam)=0.6$, $P(word\\mid ham)=0.1$. Find $P(spam\\mid word)$.",
        "steps": [
          {
            "do": "Spam-word mass",
            "result": "$0.6\\cdot0.2=0.12$",
            "why": "likelihood times prior"
          },
          {
            "do": "Ham-word mass",
            "result": "$0.1\\cdot0.8=0.08$",
            "why": "evidence under ham"
          },
          {
            "do": "Total word probability",
            "result": "$0.12+0.08=0.20$",
            "why": "all ways word appears"
          },
          {
            "do": "Normalize",
            "result": "$0.12/0.20=0.60$",
            "why": "Bayes theorem"
          },
          {
            "do": "Interpret",
            "result": "posterior spam $60\\%$",
            "why": "updated belief"
          }
        ],
        "answer": "$0.60$."
      },
      {
        "problem": "A rare defect has prior $0.02$, test sensitivity $0.9$, false positive $0.1$. Find defect probability given positive.",
        "steps": [
          {
            "do": "True positive mass",
            "result": "$0.9\\cdot0.02=0.018$",
            "why": "defect and positive"
          },
          {
            "do": "False positive mass",
            "result": "$0.1\\cdot0.98=0.098$",
            "why": "no defect but positive"
          },
          {
            "do": "Total positive",
            "result": "$0.116$",
            "why": "sum evidence masses"
          },
          {
            "do": "Divide",
            "result": "$0.018/0.116\\approx0.155$",
            "why": "posterior"
          },
          {
            "do": "Notice base rate",
            "result": "still only about $15.5\\%$",
            "why": "defect is rare"
          }
        ],
        "answer": "Approximately $0.155$."
      },
      {
        "problem": "Two variants are equally likely. Error rates are $0.04$ for A and $0.01$ for B. Given an error, find probability variant A served it.",
        "steps": [
          {
            "do": "A-error mass",
            "result": "$0.5\\cdot0.04=0.02$",
            "why": "prior times likelihood"
          },
          {
            "do": "B-error mass",
            "result": "$0.5\\cdot0.01=0.005$",
            "why": "second cause"
          },
          {
            "do": "Total error",
            "result": "$0.025$",
            "why": "sum masses"
          },
          {
            "do": "Normalize",
            "result": "$0.02/0.025=0.8$",
            "why": "posterior for A"
          },
          {
            "do": "Interpret",
            "result": "A explains $80\\%$ of errors",
            "why": "higher error rate dominates"
          }
        ],
        "answer": "$0.8$."
      },
      {
        "problem": "Prior disease $0.1$, positive likelihood $0.8$ if sick and $0.2$ if healthy. Find posterior.",
        "steps": [
          {
            "do": "Sick positive",
            "result": "$0.1\\cdot0.8=0.08$",
            "why": "joint mass"
          },
          {
            "do": "Healthy positive",
            "result": "$0.9\\cdot0.2=0.18$",
            "why": "false positive mass"
          },
          {
            "do": "Total positive",
            "result": "$0.26$",
            "why": "evidence probability"
          },
          {
            "do": "Posterior",
            "result": "$0.08/0.26\\approx0.308$",
            "why": "normalize"
          },
          {
            "do": "Check",
            "result": "below $0.5$",
            "why": "false positives are common"
          }
        ],
        "answer": "Approximately $0.308$."
      },
      {
        "problem": "Prior topic sports $0.4$; word likelihoods $0.5$ sports and $0.2$ non-sports. Find posterior sports.",
        "steps": [
          {
            "do": "Sports mass",
            "result": "$0.4\\cdot0.5=0.20$",
            "why": "prior times likelihood"
          },
          {
            "do": "Other mass",
            "result": "$0.6\\cdot0.2=0.12$",
            "why": "non-sports evidence"
          },
          {
            "do": "Total word",
            "result": "$0.32$",
            "why": "all evidence"
          },
          {
            "do": "Posterior",
            "result": "$0.20/0.32=0.625$",
            "why": "Bayes normalization"
          },
          {
            "do": "Interpret",
            "result": "word raises sports belief",
            "why": "posterior exceeds prior"
          }
        ],
        "answer": "$0.625$."
      }
    ],
    "applications": [
      {
        "title": "Spam filtering",
        "background": "Bayes connects word likelihoods to posterior spam probability.",
        "numbers": "Prior spam $0.2$, word likelihoods $0.6$ spam and $0.1$ ham give posterior $0.12/(0.12+0.08)=0.6$."
      },
      {
        "title": "Medical diagnosis",
        "background": "Base rates matter when interpreting positive tests.",
        "numbers": "Prior $0.01$, sensitivity $0.95$, false positive $0.05$ gives posterior $0.0095/0.059=0.161$."
      },
      {
        "title": "Fraud detection",
        "background": "Rare fraud can still have modest posterior after an alert.",
        "numbers": "Prior $0.002$, alert rates $0.8$ fraud and $0.01$ nonfraud give $0.0016/(0.0016+0.00998)=0.138$."
      },
      {
        "title": "A/B debugging",
        "background": "Bayes updates which variant likely caused an error.",
        "numbers": "Variant share $0.5$ each, error rates $0.04$ and $0.01$ give posterior variant A given error $0.02/(0.025)=0.8$."
      },
      {
        "title": "Sensor fusion",
        "background": "Robotics updates belief after noisy observations.",
        "numbers": "Prior obstacle $0.3$, hit rates $0.9$ obstacle and $0.2$ no obstacle give $0.27/(0.27+0.14)=0.659$."
      },
      {
        "title": "Topic classification",
        "background": "Text models infer topics from word evidence.",
        "numbers": "Prior sports $0.4$, word likelihoods $0.5$ sports and $0.1$ other give $0.20/(0.20+0.06)=0.769$."
      }
    ],
    "applicationsClose": "Across these examples, the same probability idea keeps its shape while the objects change from toy outcomes to real model behavior.",
    "takeaways": [
      "Bayes theorem is a core probability tool for ML mathematics.",
      "Name the events and assumptions before calculating.",
      "Check that probability answers stay between $0$ and $1$.",
      "The same rule works for toy examples and data systems."
    ]
  },
  "math-17-09": {
    "id": "math-17-09",
    "title": "Discrete random variables",
    "tagline": "A discrete random variable turns outcomes into numbers you can tabulate.",
    "connections": {
      "buildsOn": [
        "Sample spaces and events",
        "Axioms of probability"
      ],
      "leadsTo": [
        "Expectation",
        "variance",
        "discrete distributions"
      ],
      "usedWith": [
        "functions",
        "tables",
        "sums"
      ]
    },
    "motivation": "<p>Events answer yes or no; random variables assign numbers. A die roll can become the number shown, two coin flips can become the number of heads, and an ad impression can become revenue.</p><p>For discrete variables, the whole distribution can be listed as probabilities attached to possible values.</p>",
    "definition": "<p>A <b>discrete random variable</b> $X$ is a function from the sample space to a countable set of numbers. Its probability mass function is $p_X(x)=P(X=x)$, and the masses satisfy $p_X(x)\\ge0$ and $\\sum_x p_X(x)=1$.</p><p>The distribution groups outcomes that produce the same number, then adds their probabilities.</p><p><b>Assumptions that matter:</b> the possible values are finite or countable; probabilities over all possible values sum to $1$; and $X=x$ is an event.</p>",
    "worked": {
      "problem": "Flip two fair coins and let $X$ be the number of heads. Find the distribution of $X$.",
      "skills": [
        "random variables",
        "probability mass functions",
        "grouping outcomes"
      ],
      "strategy": "Translate the words into events or formulas, then compute one piece at a time.",
      "steps": [
        {
          "do": "List outcomes",
          "result": "$HH,HT,TH,TT$",
          "why": "four equally likely outcomes"
        },
        {
          "do": "Map to $X$ values",
          "result": "$2,1,1,0$",
          "why": "count heads in each outcome"
        },
        {
          "do": "Compute $P(X=0)$",
          "result": "$1/4$",
          "why": "only $TT$"
        },
        {
          "do": "Compute $P(X=1)$",
          "result": "$2/4=1/2$",
          "why": "$HT$ and $TH$"
        },
        {
          "do": "Compute $P(X=2)$",
          "result": "$1/4$",
          "why": "only $HH$"
        }
      ],
      "verify": "The result respects the probability rules and the arithmetic matches the event definition.",
      "answer": "$1/4$",
      "connects": "Discrete random variables gives a reusable rule for this calculation."
    },
    "practice": [
      {
        "problem": "A variable has $P(X=0)=0.2$, $P(X=1)=0.5$, $P(X=2)=0.3$. Check it is a PMF.",
        "steps": [
          {
            "do": "Check nonnegative",
            "result": "all masses are $0.2,0.5,0.3$",
            "why": "none are below zero"
          },
          {
            "do": "Add masses",
            "result": "$0.2+0.5+0.3=1.0$",
            "why": "total probability"
          },
          {
            "do": "Apply PMF rule",
            "result": "valid",
            "why": "nonnegative and sums to one"
          },
          {
            "do": "Name support",
            "result": "$\\{0,1,2\\}$",
            "why": "values with positive mass"
          },
          {
            "do": "Interpret",
            "result": "probability is fully assigned",
            "why": "no missing mass"
          }
        ],
        "answer": "It is a valid PMF."
      },
      {
        "problem": "For two fair coins, let $X$ be heads. Find $P(X=1)$.",
        "steps": [
          {
            "do": "List outcomes",
            "result": "$HH,HT,TH,TT$",
            "why": "four equally likely outcomes"
          },
          {
            "do": "Map to counts",
            "result": "$2,1,1,0$",
            "why": "number of heads"
          },
          {
            "do": "Find $X=1$ outcomes",
            "result": "$HT,TH$",
            "why": "exactly one head"
          },
          {
            "do": "Compute probability",
            "result": "$2/4=1/2$",
            "why": "favorable over total"
          },
          {
            "do": "State PMF value",
            "result": "$p_X(1)=1/2$",
            "why": "mass at value one"
          }
        ],
        "answer": "$P(X=1)=1/2$."
      },
      {
        "problem": "A Bernoulli variable has success probability $0.7$. Give its PMF.",
        "steps": [
          {
            "do": "Set success mass",
            "result": "$P(X=1)=0.7$",
            "why": "definition of success probability"
          },
          {
            "do": "Use complement",
            "result": "$P(X=0)=1-0.7=0.3$",
            "why": "failure is not success"
          },
          {
            "do": "Check sum",
            "result": "$0.7+0.3=1$",
            "why": "valid PMF"
          },
          {
            "do": "Check nonnegative",
            "result": "both masses are nonnegative",
            "why": "PMF rule"
          },
          {
            "do": "State support",
            "result": "$\\{0,1\\}$",
            "why": "Bernoulli values"
          }
        ],
        "answer": "$P(X=1)=0.7$, $P(X=0)=0.3$."
      },
      {
        "problem": "A die roll random variable $X$ is the face value. Find $P(X\\ge5)$.",
        "steps": [
          {
            "do": "List qualifying values",
            "result": "$5,6$",
            "why": "faces at least five"
          },
          {
            "do": "Count qualifying outcomes",
            "result": "$2$",
            "why": "two die faces"
          },
          {
            "do": "Count all outcomes",
            "result": "$6$",
            "why": "six faces"
          },
          {
            "do": "Compute probability",
            "result": "$2/6=1/3$",
            "why": "favorable over total"
          },
          {
            "do": "State event",
            "result": "$P(X\\ge5)=1/3$",
            "why": "event written using random variable"
          }
        ],
        "answer": "$1/3$."
      },
      {
        "problem": "A classifier outputs number of errors in $3$ items with masses $P(0)=0.7$, $P(1)=0.2$, $P(2)=0.08$, $P(3)=0.02$. Find probability at least one error.",
        "steps": [
          {
            "do": "Define event",
            "result": "$X\\ge1$",
            "why": "at least one error"
          },
          {
            "do": "Use complement",
            "result": "$P(X\\ge1)=1-P(X=0)$",
            "why": "easier than adding three masses"
          },
          {
            "do": "Substitute",
            "result": "$1-0.7$",
            "why": "zero-error mass"
          },
          {
            "do": "Compute",
            "result": "$0.3$",
            "why": "remaining probability"
          },
          {
            "do": "Check by addition",
            "result": "$0.2+0.08+0.02=0.3$",
            "why": "same result"
          }
        ],
        "answer": "Probability of at least one error is $0.3$."
      }
    ],
    "applications": [
      {
        "title": "Click counts",
        "background": "A click indicator is a discrete random variable taking $0$ or $1$.",
        "numbers": "If click probability is $0.04$, then $P(X=1)=0.04$ and $P(X=0)=0.96$."
      },
      {
        "title": "Binomial batches",
        "background": "The number of positives in a mini-batch is discrete.",
        "numbers": "For two independent examples with positive probability $0.5$, probabilities for $0,1,2$ positives are $0.25,0.5,0.25$."
      },
      {
        "title": "Token counts",
        "background": "Language models often count occurrences of words or tokens.",
        "numbers": "If a token appears $3$ times in $100$ positions, the empirical mass at that token is $0.03$."
      },
      {
        "title": "Queue lengths",
        "background": "Systems monitor integer queue sizes.",
        "numbers": "If queue length probabilities are $P(0)=0.6$, $P(1)=0.3$, $P(2)=0.1$, they sum to $1$."
      },
      {
        "title": "Defect counts",
        "background": "Manufacturing counts defective items in a sample.",
        "numbers": "In two items with defect probability $0.1$, probability of zero defects is $0.9^2=0.81$."
      },
      {
        "title": "Rating stars",
        "background": "User ratings are discrete values.",
        "numbers": "If ratings $1$ through $5$ have masses $0.05,0.10,0.20,0.30,0.35$, total mass is $1.00$."
      }
    ],
    "applicationsClose": "Across these examples, the same probability idea keeps its shape while the objects change from toy outcomes to real model behavior.",
    "takeaways": [
      "Discrete random variables is a core probability tool for ML mathematics.",
      "Name the events and assumptions before calculating.",
      "Check that probability answers stay between $0$ and $1$.",
      "The same rule works for toy examples and data systems."
    ]
  },
  "math-17-10": {
    "id": "math-17-10",
    "title": "Continuous random variables",
    "tagline": "A continuous random variable spreads probability across intervals rather than points.",
    "connections": {
      "buildsOn": [
        "Discrete random variables",
        "integrals"
      ],
      "leadsTo": [
        "Probability density functions",
        "Cumulative distribution functions",
        "Expectation"
      ],
      "usedWith": [
        "integrals",
        "functions",
        "intervals"
      ]
    },
    "motivation": "<p>Some quantities are not naturally counted one by one: time to load a page, height, temperature, model score. For these, probability lives over intervals.</p><p>The gentle surprise is that a single exact value usually has probability zero, while intervals can have positive probability.</p>",
    "definition": "<p>A <b>continuous random variable</b> $X$ takes values on an interval or continuum. Probabilities are assigned to intervals such as $P(a\\le X\\le b)$, usually through a density $f$ by $P(a\\le X\\le b)=\\int_a^b f(x)\\,dx$.</p><p>Point probabilities are zero for ordinary continuous variables because an interval with width shrinking to $0$ has area shrinking to $0$.</p><p><b>Assumptions that matter:</b> densities must be nonnegative and integrate to $1$; interval endpoints do not change probabilities for continuous variables; and density height is not itself probability.</p>",
    "worked": {
      "problem": "Let $X$ be uniform on $[0,10]$. Find $P(2\\le X\\le5)$ and $P(X=4)$.",
      "skills": [
        "interval probability",
        "uniform distributions",
        "point probability"
      ],
      "strategy": "Translate the words into events or formulas, then compute one piece at a time.",
      "steps": [
        {
          "do": "Find the density",
          "result": "$f(x)=1/10$",
          "why": "total area over length $10$ must be $1$"
        },
        {
          "do": "Find interval width",
          "result": "$5-2=3$",
          "why": "probability is density times width"
        },
        {
          "do": "Compute interval probability",
          "result": "$(1/10)\\cdot3=0.3$",
          "why": "area of a rectangle"
        },
        {
          "do": "State point probability",
          "result": "$P(X=4)=0$",
          "why": "a single point has zero width"
        }
      ],
      "verify": "The result respects the probability rules and the arithmetic matches the event definition.",
      "answer": "$P(X=4)=0$",
      "connects": "Continuous random variables gives a reusable rule for this calculation."
    },
    "practice": [
      {
        "problem": "Uniform $X$ on $[0,8]$. Find $P(2\\le X\\le6)$.",
        "steps": [
          {
            "do": "Find interval length",
            "result": "$8$",
            "why": "total width"
          },
          {
            "do": "Find target width",
            "result": "$6-2=4$",
            "why": "favorable width"
          },
          {
            "do": "Use uniform probability",
            "result": "$4/8$",
            "why": "width over total width"
          },
          {
            "do": "Simplify",
            "result": "$1/2$",
            "why": "reduce fraction"
          },
          {
            "do": "Interpret",
            "result": "$0.5$",
            "why": "half the interval"
          }
        ],
        "answer": "$0.5$."
      },
      {
        "problem": "Uniform $X$ on $[-1,1]$. Find $P(X>0.25)$.",
        "steps": [
          {
            "do": "Total width",
            "result": "$2$",
            "why": "from $-1$ to $1$"
          },
          {
            "do": "Favorable width",
            "result": "$1-0.25=0.75$",
            "why": "values above $0.25$"
          },
          {
            "do": "Divide",
            "result": "$0.75/2=0.375$",
            "why": "uniform interval probability"
          },
          {
            "do": "Check range",
            "result": "$0.375$",
            "why": "valid probability"
          },
          {
            "do": "Interpret",
            "result": "less than half",
            "why": "threshold is above the midpoint"
          }
        ],
        "answer": "$0.375$."
      },
      {
        "problem": "For continuous $X$, compare $P(1<X<3)$ and $P(1\\le X\\le3)$.",
        "steps": [
          {
            "do": "Point probabilities",
            "result": "$P(X=1)=P(X=3)=0$",
            "why": "single points have zero probability"
          },
          {
            "do": "Write closed interval",
            "result": "open interval plus endpoints",
            "why": "only endpoints differ"
          },
          {
            "do": "Add endpoint masses",
            "result": "$0+0$",
            "why": "no change"
          },
          {
            "do": "Conclude",
            "result": "the probabilities are equal",
            "why": "endpoints do not matter"
          },
          {
            "do": "State condition",
            "result": "ordinary continuous variable",
            "why": "not a discrete mass"
          }
        ],
        "answer": "They are equal for a continuous random variable."
      },
      {
        "problem": "A score is uniform on $[0,1]$. Find probability it lies within $0.1$ of $0.5$.",
        "steps": [
          {
            "do": "Translate condition",
            "result": "$0.4\\le X\\le0.6$",
            "why": "within $0.1$ of $0.5$"
          },
          {
            "do": "Find width",
            "result": "$0.6-0.4=0.2$",
            "why": "target interval"
          },
          {
            "do": "Total width",
            "result": "$1$",
            "why": "unit interval"
          },
          {
            "do": "Compute probability",
            "result": "$0.2/1=0.2$",
            "why": "uniform area"
          },
          {
            "do": "Interpret",
            "result": "$20\\%$",
            "why": "one fifth of scores"
          }
        ],
        "answer": "$0.2$."
      },
      {
        "problem": "Latency is uniform from $100$ to $300$ ms. Find probability below $180$ ms.",
        "steps": [
          {
            "do": "Total width",
            "result": "$300-100=200$",
            "why": "full latency range"
          },
          {
            "do": "Favorable width",
            "result": "$180-100=80$",
            "why": "below threshold"
          },
          {
            "do": "Compute",
            "result": "$80/200=0.4$",
            "why": "uniform interval probability"
          },
          {
            "do": "Check",
            "result": "between $0$ and $1$",
            "why": "valid probability"
          },
          {
            "do": "Interpret",
            "result": "$40\\%$ of requests",
            "why": "under the model"
          }
        ],
        "answer": "$0.4$."
      }
    ],
    "applications": [
      {
        "title": "Latency",
        "background": "Response time varies continuously enough that interval probabilities are natural.",
        "numbers": "Uniform $0$ to $500$ ms gives $P(100\\le X\\le200)=100/500=0.2$."
      },
      {
        "title": "Model scores",
        "background": "Scores such as logits or calibrated probabilities move on continua.",
        "numbers": "A score uniform on $[0,1]$ exceeds $0.8$ with probability $0.2$."
      },
      {
        "title": "Sensor noise",
        "background": "Physical sensors produce real-valued measurements.",
        "numbers": "If error is uniform on $[-1,1]$, probability error lies between $-0.2$ and $0.2$ is $0.4/2=0.2$."
      },
      {
        "title": "Arrival times",
        "background": "Queueing models treat arrivals as continuous times.",
        "numbers": "Uniform arrival in a $10$ minute window has probability $3/10=0.3$ of arriving in the first $3$ minutes."
      },
      {
        "title": "Embeddings",
        "background": "Vector components are real-valued random quantities across data.",
        "numbers": "If a component is modeled uniform on $[-2,2]$, probability it is positive is $2/4=0.5$."
      },
      {
        "title": "A/B metric changes",
        "background": "Measured lift can be modeled as a continuous estimate.",
        "numbers": "If lift is uniform from $-1\\%$ to $3\\%$, probability of positive lift is $3/4=0.75$."
      }
    ],
    "applicationsClose": "Across these examples, the same probability idea keeps its shape while the objects change from toy outcomes to real model behavior.",
    "takeaways": [
      "Continuous random variables is a core probability tool for ML mathematics.",
      "Name the events and assumptions before calculating.",
      "Check that probability answers stay between $0$ and $1$.",
      "The same rule works for toy examples and data systems."
    ]
  },
  "math-17-11": {
    "id": "math-17-11",
    "title": "Probability density functions",
    "tagline": "A density is probability per unit length; areas under it are probabilities.",
    "connections": {
      "buildsOn": [
        "Continuous random variables",
        "functions",
        "integrals"
      ],
      "leadsTo": [
        "Cumulative distribution functions",
        "Expectation",
        "normal distributions"
      ],
      "usedWith": [
        "area",
        "integrals",
        "nonnegative functions"
      ]
    },
    "motivation": "<p>For continuous variables, probability is not stored at individual points. It is spread like a thin layer of paint over the number line.</p><p>A <b>probability density function</b> tells how thick that paint is. To get probability, you measure area.</p>",
    "definition": "<p>A <b>probability density function</b> $f$ satisfies $f(x)\\ge0$ and $\\int_{-\\infty}^{\\infty} f(x)\\,dx=1$. For intervals, $P(a\\le X\\le b)=\\int_a^b f(x)\\,dx$.</p><p>The total area must be $1$ because the random variable must land somewhere. Nonnegative area over an interval becomes the probability of landing there.</p><p><b>Assumptions that matter:</b> $f(x)$ may exceed $1$ if concentrated on a short interval; probabilities are areas, not heights; and endpoints do not matter for continuous variables.</p>",
    "worked": {
      "problem": "Let $f(x)=2x$ for $0\\le x\\le1$ and $0$ otherwise. Find $P(0.5\\le X\\le1)$.",
      "skills": [
        "density",
        "area",
        "integration"
      ],
      "strategy": "Check the density, then integrate over the requested interval.",
      "steps": [
        {
          "do": "Check total area",
          "result": "$\\int_0^1 2x\\,dx=1$",
          "why": "the function is a valid density"
        },
        {
          "do": "Set up the interval area",
          "result": "$P(0.5\\le X\\le1)=\\int_{0.5}^1 2x\\,dx$",
          "why": "probability is area under the density"
        },
        {
          "do": "Find an antiderivative",
          "result": "$\\int 2x\\,dx=x^2$",
          "why": "power rule"
        },
        {
          "do": "Evaluate the bounds",
          "result": "$1^2-0.5^2=0.75$",
          "why": "subtract lower area from upper area"
        }
      ],
      "verify": "The probability is less than $1$ and bigger than half because density is larger near $1$.",
      "answer": "$P(0.5\\le X\\le1)=0.75$.",
      "connects": "Density height guides where probability is concentrated; area gives the probability."
    },
    "practice": [
      {
        "problem": "For $f(x)=1/4$ on $[0,4]$, find $P(1\\le X\\le3)$.",
        "steps": [
          {
            "do": "Check density height",
            "result": "$1/4$",
            "why": "uniform on length four"
          },
          {
            "do": "Find interval width",
            "result": "$3-1=2$",
            "why": "target interval"
          },
          {
            "do": "Multiply height by width",
            "result": "$(1/4)\\cdot2$",
            "why": "rectangle area"
          },
          {
            "do": "Compute",
            "result": "$1/2$",
            "why": "two fourths"
          },
          {
            "do": "Interpret",
            "result": "half the probability mass",
            "why": "half the interval length"
          }
        ],
        "answer": "$1/2$."
      },
      {
        "problem": "Find $c$ so $f(x)=c$ on $[2,7]$ is a density.",
        "steps": [
          {
            "do": "Find interval length",
            "result": "$7-2=5$",
            "why": "support width"
          },
          {
            "do": "Require total area one",
            "result": "$5c=1$",
            "why": "rectangle area"
          },
          {
            "do": "Solve for $c$",
            "result": "$c=1/5$",
            "why": "divide by five"
          },
          {
            "do": "Check nonnegative",
            "result": "$1/5>0$",
            "why": "density cannot be negative"
          },
          {
            "do": "State density",
            "result": "$0.2$",
            "why": "decimal form"
          }
        ],
        "answer": "$c=1/5=0.2$."
      },
      {
        "problem": "For $f(x)=2x$ on $[0,1]$, find $P(X\\le0.5)$.",
        "steps": [
          {
            "do": "Set up integral",
            "result": "$\\int_0^{0.5}2x\\,dx$",
            "why": "area up to $0.5$"
          },
          {
            "do": "Antiderivative",
            "result": "$x^2$",
            "why": "power rule"
          },
          {
            "do": "Evaluate upper bound",
            "result": "$0.5^2=0.25$",
            "why": "upper area"
          },
          {
            "do": "Evaluate lower bound",
            "result": "$0^2=0$",
            "why": "lower area"
          },
          {
            "do": "Subtract",
            "result": "$0.25$",
            "why": "probability"
          }
        ],
        "answer": "$0.25$."
      },
      {
        "problem": "A density is $f(x)=3x^2$ on $[0,1]$. Find $P(X>0.5)$.",
        "steps": [
          {
            "do": "Use complement",
            "result": "$P(X>0.5)=1-P(X\\le0.5)$",
            "why": "tail is easier"
          },
          {
            "do": "Set up lower area",
            "result": "$\\int_0^{0.5}3x^2\\,dx$",
            "why": "CDF up to $0.5$"
          },
          {
            "do": "Antiderivative",
            "result": "$x^3$",
            "why": "integral of $3x^2$"
          },
          {
            "do": "Evaluate",
            "result": "$0.5^3=0.125$",
            "why": "lower probability"
          },
          {
            "do": "Subtract tail",
            "result": "$1-0.125=0.875$",
            "why": "probability above $0.5$"
          }
        ],
        "answer": "$0.875$."
      },
      {
        "problem": "A proposed density is $f(x)=-1$ on $[0,1]$. Is it valid?",
        "steps": [
          {
            "do": "Check nonnegativity",
            "result": "$f(x)=-1<0$",
            "why": "densities cannot be negative"
          },
          {
            "do": "Check total area",
            "result": "$\\int_0^1 -1\\,dx=-1$",
            "why": "total is not one"
          },
          {
            "do": "Compare with requirements",
            "result": "fails both",
            "why": "invalid density"
          },
          {
            "do": "Interpret",
            "result": "negative probability would result",
            "why": "not meaningful"
          },
          {
            "do": "Conclude",
            "result": "not valid",
            "why": "violates density assumptions"
          }
        ],
        "answer": "It is not a valid density."
      }
    ],
    "applications": [
      {
        "title": "Uniform density",
        "background": "Uniform distributions have constant density over an interval.",
        "numbers": "On $[0,4]$, density $1/4$ gives $P(1\\le X\\le3)=2/4=0.5$."
      },
      {
        "title": "Triangular density",
        "background": "Simple increasing densities model values more likely near one end.",
        "numbers": "For $f(x)=2x$ on $[0,1]$, $P(X>0.5)=1-0.25=0.75$."
      },
      {
        "title": "Normal curves",
        "background": "Gaussian densities are central in noise models and approximate averages.",
        "numbers": "About $0.68$ of a normal distribution lies within one standard deviation of the mean."
      },
      {
        "title": "Kernel density estimates",
        "background": "KDEs estimate an unknown density from data by smoothing observed points.",
        "numbers": "If estimated area from $0$ to $1$ is $0.42$, then the model assigns probability $0.42$ to that interval."
      },
      {
        "title": "Anomaly scores",
        "background": "Density models can flag low-density observations.",
        "numbers": "If density near typical scores is $1.5$ but near an outlier is $0.02$, the outlier lies in a much thinner region."
      },
      {
        "title": "Simulation checks",
        "background": "A proposed density must integrate to one.",
        "numbers": "A constant density $c$ on $[2,7]$ needs $5c=1$, so $c=0.2$."
      }
    ],
    "applicationsClose": "Across these examples, the same probability idea keeps its shape while the objects change from toy outcomes to real model behavior.",
    "takeaways": [
      "Probability density functions translates probability into a numerical function.",
      "Areas, sums, and accumulated probabilities must be checked against total probability $1$.",
      "These tools are central for losses, uncertainty, and ML evaluation."
    ]
  },
  "math-17-12": {
    "id": "math-17-12",
    "title": "Cumulative distribution functions",
    "tagline": "A CDF tells how much probability has accumulated up to a point.",
    "connections": {
      "buildsOn": [
        "Continuous random variables",
        "Discrete random variables",
        "Probability density functions"
      ],
      "leadsTo": [
        "Expectation",
        "quantiles",
        "inverse transform sampling"
      ],
      "usedWith": [
        "functions",
        "integrals",
        "monotonicity"
      ]
    },
    "motivation": "<p>Sometimes the most useful probability question is not exactly at a value, but up to a value: how likely is the response time at most $200$ ms?</p><p>The <b>cumulative distribution function</b> answers that question for every cutoff.</p>",
    "definition": "<p>The CDF of $X$ is $F(x)=P(X\\le x)$. For a continuous variable with density $f$, $F(x)=\\int_{-\\infty}^x f(t)\\,dt$. For a discrete variable, $F(x)=\\sum_{v\\le x}P(X=v)$.</p><p>It accumulates probability from left to right, so it never decreases and moves from $0$ toward $1$.</p><p><b>Assumptions that matter:</b> $F$ is right-continuous; jumps represent point masses in discrete distributions; and for continuous variables, interval probability is $F(b)-F(a)$.</p>",
    "worked": {
      "problem": "For $X$ uniform on $[0,10]$, find $F(7)$ and $P(3<X\\le7)$.",
      "skills": [
        "CDF",
        "uniform distribution",
        "interval probability"
      ],
      "strategy": "Use the accumulated area up to each cutoff, then subtract.",
      "steps": [
        {
          "do": "Write the CDF inside the interval",
          "result": "$F(x)=x/10$ for $0\\le x\\le10$",
          "why": "uniform area grows linearly"
        },
        {
          "do": "Evaluate $F(7)$",
          "result": "$7/10=0.7$",
          "why": "seven tenths of the interval lies to the left"
        },
        {
          "do": "Evaluate $F(3)$",
          "result": "$3/10=0.3$",
          "why": "three tenths lies to the left"
        },
        {
          "do": "Subtract for the interval",
          "result": "$F(7)-F(3)=0.4$",
          "why": "probability between cutoffs is accumulated difference"
        }
      ],
      "verify": "The interval from $3$ to $7$ has width $4$ out of total width $10$, matching $0.4$.",
      "answer": "$F(7)=0.7$ and $P(3<X\\le7)=0.4$.",
      "connects": "A CDF converts interval probability into subtraction."
    },
    "practice": [
      {
        "problem": "A CDF has $F(2)=0.3$ and $F(5)=0.8$. Find $P(2<X\\le5)$.",
        "steps": [
          {
            "do": "Use CDF subtraction",
            "result": "$P(2<X\\le5)=F(5)-F(2)$",
            "why": "accumulated probability difference"
          },
          {
            "do": "Substitute",
            "result": "$0.8-0.3$",
            "why": "given CDF values"
          },
          {
            "do": "Compute",
            "result": "$0.5$",
            "why": "subtract"
          },
          {
            "do": "Check range",
            "result": "$0.5$",
            "why": "valid probability"
          },
          {
            "do": "Interpret",
            "result": "half the mass lies in the interval",
            "why": "between the cutoffs"
          }
        ],
        "answer": "$0.5$."
      },
      {
        "problem": "For uniform $[0,4]$, find $F(3)$.",
        "steps": [
          {
            "do": "Write CDF inside support",
            "result": "$F(x)=x/4$",
            "why": "area from $0$ to $x$"
          },
          {
            "do": "Substitute $x=3$",
            "result": "$F(3)=3/4$",
            "why": "use cutoff"
          },
          {
            "do": "Convert",
            "result": "$0.75$",
            "why": "decimal form"
          },
          {
            "do": "Check",
            "result": "less than $1$",
            "why": "cutoff is inside support"
          },
          {
            "do": "Interpret",
            "result": "$75\\%$ is at or below $3$",
            "why": "uniform length ratio"
          }
        ],
        "answer": "$F(3)=0.75$."
      },
      {
        "problem": "A discrete variable has $P(X=0)=0.2$, $P(X=1)=0.5$, $P(X=2)=0.3$. Find $F(1)$.",
        "steps": [
          {
            "do": "Define CDF",
            "result": "$F(1)=P(X\\le1)$",
            "why": "accumulate up to one"
          },
          {
            "do": "List included masses",
            "result": "$P(X=0)$ and $P(X=1)$",
            "why": "values at most one"
          },
          {
            "do": "Add",
            "result": "$0.2+0.5=0.7$",
            "why": "sum included probabilities"
          },
          {
            "do": "Check jump",
            "result": "mass at $1$ is included",
            "why": "CDF uses $\\le$"
          },
          {
            "do": "Interpret",
            "result": "$70\\%$ at or below one",
            "why": "cumulative probability"
          }
        ],
        "answer": "$F(1)=0.7$."
      },
      {
        "problem": "If $F(10)=0.95$, what is $P(X>10)$?",
        "steps": [
          {
            "do": "Use complement",
            "result": "$P(X>10)=1-P(X\\le10)$",
            "why": "above cutoff is complement"
          },
          {
            "do": "Substitute CDF",
            "result": "$1-F(10)$",
            "why": "definition of CDF"
          },
          {
            "do": "Use value",
            "result": "$1-0.95$",
            "why": "given"
          },
          {
            "do": "Compute",
            "result": "$0.05$",
            "why": "tail probability"
          },
          {
            "do": "Interpret",
            "result": "five percent above ten",
            "why": "right tail"
          }
        ],
        "answer": "$0.05$."
      },
      {
        "problem": "For $F(x)=x^2$ on $[0,1]$, find $P(0.2<X\\le0.6)$.",
        "steps": [
          {
            "do": "Evaluate upper CDF",
            "result": "$F(0.6)=0.36$",
            "why": "square the upper bound"
          },
          {
            "do": "Evaluate lower CDF",
            "result": "$F(0.2)=0.04$",
            "why": "square the lower bound"
          },
          {
            "do": "Subtract",
            "result": "$0.36-0.04$",
            "why": "interval probability"
          },
          {
            "do": "Compute",
            "result": "$0.32$",
            "why": "difference"
          },
          {
            "do": "Check",
            "result": "positive and below one",
            "why": "valid probability"
          }
        ],
        "answer": "$0.32$."
      }
    ],
    "applications": [
      {
        "title": "Percentiles",
        "background": "CDFs turn measurements into percentile ranks.",
        "numbers": "If $F(200\\text{ ms})=0.9$, then $90\\%$ of requests finish by $200$ ms."
      },
      {
        "title": "Threshold rates",
        "background": "Classifier score thresholds use tail probabilities from a CDF.",
        "numbers": "If negative scores have $F(0.7)=0.95$, then $5\\%$ exceed $0.7$."
      },
      {
        "title": "Interval probabilities",
        "background": "CDF subtraction avoids re-integrating densities.",
        "numbers": "If $F(8)=0.8$ and $F(3)=0.25$, then $P(3<X\\le8)=0.55$."
      },
      {
        "title": "Quantiles",
        "background": "Monitoring systems report p95 and p99 from inverse CDFs.",
        "numbers": "If the p95 latency is $400$ ms, then $F(400)=0.95$."
      },
      {
        "title": "Discrete jumps",
        "background": "For discrete variables, CDF jumps show point masses.",
        "numbers": "If $P(X=2)=0.3$, then the CDF jumps upward by $0.3$ at $2$."
      },
      {
        "title": "Inverse transform sampling",
        "background": "Simulators can sample from a distribution by applying an inverse CDF to uniform noise.",
        "numbers": "If $F(x)=x^2$ on $[0,1]$ and $u=0.64$, then $x=\\sqrt{0.64}=0.8$."
      }
    ],
    "applicationsClose": "Across these examples, the same probability idea keeps its shape while the objects change from toy outcomes to real model behavior.",
    "takeaways": [
      "Cumulative distribution functions translates probability into a numerical function.",
      "Areas, sums, and accumulated probabilities must be checked against total probability $1$.",
      "These tools are central for losses, uncertainty, and ML evaluation."
    ]
  },
  "math-17-13": {
    "id": "math-17-13",
    "title": "Expectation",
    "tagline": "Expectation is the long-run average value, found by weighting outcomes by their probabilities.",
    "connections": {
      "buildsOn": [
        "Discrete random variables",
        "Continuous random variables",
        "Probability density functions"
      ],
      "leadsTo": [
        "variance",
        "loss minimization",
        "risk"
      ],
      "usedWith": [
        "sums",
        "integrals",
        "weighted averages"
      ]
    },
    "motivation": "<p>Probability distributions can be large, but often we need one careful summary: the average value we would see over many repetitions.</p><p><b>Expectation</b> is that probability-weighted center. It is not always a value that can occur, but it is the balance point of the distribution.</p>",
    "definition": "<p>For a discrete random variable, $\\mathbb{E}[X]=\\sum_x xP(X=x)$. For a continuous random variable with density $f$, $\\mathbb{E}[X]=\\int_{-\\infty}^{\\infty} x f(x)\\,dx$ when the sum or integral converges.</p><p>The formula weights each value by how often it occurs. Linearity follows by distributing sums or integrals: $\\mathbb{E}[aX+bY]=a\\mathbb{E}[X]+b\\mathbb{E}[Y]$ when expectations exist.</p><p><b>Assumptions that matter:</b> probabilities must sum or integrate to $1$; the weighted sum or integral must converge; and expectation is a long-run average, not a guaranteed outcome.</p>",
    "worked": {
      "problem": "Let $X$ have values $0,1,2$ with probabilities $0.2,0.5,0.3$. Find $\\mathbb{E}[X]$.",
      "skills": [
        "weighted averages",
        "discrete expectation"
      ],
      "strategy": "Multiply each value by its probability, then add.",
      "steps": [
        {
          "do": "Write the expectation sum",
          "result": "$\\mathbb{E}[X]=0\\cdot0.2+1\\cdot0.5+2\\cdot0.3$",
          "why": "weight each value by its probability"
        },
        {
          "do": "Compute the first term",
          "result": "$0\\cdot0.2=0$",
          "why": "zero contributes nothing"
        },
        {
          "do": "Compute the remaining terms",
          "result": "$1\\cdot0.5=0.5$ and $2\\cdot0.3=0.6$",
          "why": "multiply value by probability"
        },
        {
          "do": "Add the terms",
          "result": "$0+0.5+0.6=1.1$",
          "why": "sum all weighted contributions"
        }
      ],
      "verify": "The answer lies between the smallest value $0$ and largest value $2$, as it should.",
      "answer": "$\\mathbb{E}[X]=1.1$.",
      "connects": "Expectation is the distribution balanced on a number line."
    },
    "practice": [
      {
        "problem": "Find expectation for $X=0,1$ with $P(X=1)=0.3$.",
        "steps": [
          {
            "do": "Find failure probability",
            "result": "$P(X=0)=0.7$",
            "why": "complement of success"
          },
          {
            "do": "Write expectation",
            "result": "$0\\cdot0.7+1\\cdot0.3$",
            "why": "weighted values"
          },
          {
            "do": "Compute terms",
            "result": "$0+0.3$",
            "why": "zero contributes nothing"
          },
          {
            "do": "Add",
            "result": "$0.3$",
            "why": "expected value"
          },
          {
            "do": "Interpret",
            "result": "mean success indicator equals success probability",
            "why": "Bernoulli fact"
          }
        ],
        "answer": "$\\mathbb{E}[X]=0.3$."
      },
      {
        "problem": "A variable takes $10$ with probability $0.2$ and $0$ with probability $0.8$. Find expectation.",
        "steps": [
          {
            "do": "Write weighted sum",
            "result": "$10\\cdot0.2+0\\cdot0.8$",
            "why": "value times probability"
          },
          {
            "do": "Compute first term",
            "result": "$2$",
            "why": "ten times point two"
          },
          {
            "do": "Compute second term",
            "result": "$0$",
            "why": "zero value"
          },
          {
            "do": "Add",
            "result": "$2$",
            "why": "expected value"
          },
          {
            "do": "Interpret",
            "result": "long-run average payoff",
            "why": "not necessarily the most common value"
          }
        ],
        "answer": "$2$."
      },
      {
        "problem": "For a fair die, find $\\mathbb{E}[X]$.",
        "steps": [
          {
            "do": "Write sum",
            "result": "$(1+2+3+4+5+6)/6$",
            "why": "each face has probability $1/6$"
          },
          {
            "do": "Add faces",
            "result": "$21/6$",
            "why": "sum is 21"
          },
          {
            "do": "Divide",
            "result": "$3.5$",
            "why": "average face value"
          },
          {
            "do": "Check range",
            "result": "between $1$ and $6$",
            "why": "reasonable mean"
          },
          {
            "do": "Interpret",
            "result": "balance point of die values",
            "why": "not an actual face"
          }
        ],
        "answer": "$3.5$."
      },
      {
        "problem": "Loss is $0.1$ with probability $0.6$ and $1.0$ with probability $0.4$. Find expected loss.",
        "steps": [
          {
            "do": "Write weighted sum",
            "result": "$0.1\\cdot0.6+1.0\\cdot0.4$",
            "why": "loss weighted by probability"
          },
          {
            "do": "Compute first term",
            "result": "$0.06$",
            "why": "small-loss contribution"
          },
          {
            "do": "Compute second term",
            "result": "$0.40$",
            "why": "large-loss contribution"
          },
          {
            "do": "Add",
            "result": "$0.46$",
            "why": "expected loss"
          },
          {
            "do": "Interpret",
            "result": "average loss over many cases",
            "why": "training objective style"
          }
        ],
        "answer": "Expected loss is $0.46$."
      },
      {
        "problem": "Use linearity: $\\mathbb{E}[X]=2$ and $\\mathbb{E}[Y]=5$. Find $\\mathbb{E}[3X-2Y+4]$.",
        "steps": [
          {
            "do": "Apply linearity",
            "result": "$3\\mathbb{E}[X]-2\\mathbb{E}[Y]+4$",
            "why": "expectation distributes over sums and constants"
          },
          {
            "do": "Substitute",
            "result": "$3\\cdot2-2\\cdot5+4$",
            "why": "use given means"
          },
          {
            "do": "Multiply",
            "result": "$6-10+4$",
            "why": "compute scaled means"
          },
          {
            "do": "Add",
            "result": "$0$",
            "why": "finish arithmetic"
          },
          {
            "do": "Interpret",
            "result": "no independence needed",
            "why": "linearity does not require independence"
          }
        ],
        "answer": "$\\mathbb{E}[3X-2Y+4]=0$."
      }
    ],
    "applications": [
      {
        "title": "Expected loss",
        "background": "Training minimizes average loss over data and randomness.",
        "numbers": "Losses $0.2,0.5,1.0$ with probabilities $0.5,0.3,0.2$ give expectation $0.1+0.15+0.2=0.45$."
      },
      {
        "title": "Expected revenue",
        "background": "Business models often optimize expected value, not one outcome.",
        "numbers": "Revenue $0$ with probability $0.9$ and $10$ with probability $0.1$ has expectation $1$."
      },
      {
        "title": "Calibration baselines",
        "background": "A Bernoulli variable has expectation equal to its success probability.",
        "numbers": "If click probability is $0.04$, expected clicks per impression is $0.04$."
      },
      {
        "title": "A/B testing",
        "background": "Expected metric lift averages over possible outcomes.",
        "numbers": "Lift $-1$ with probability $0.3$ and $2$ with probability $0.7$ has expectation $1.1$."
      },
      {
        "title": "Queue load",
        "background": "Expected arrivals guide capacity planning.",
        "numbers": "Counts $0,1,2$ with probabilities $0.2,0.5,0.3$ have mean $0+0.5+0.6=1.1$."
      },
      {
        "title": "Ensembles",
        "background": "Model averaging is expectation over predictors or samples.",
        "numbers": "Predictions $0.2,0.6,0.7$ averaged uniformly give expected prediction $0.5$."
      }
    ],
    "applicationsClose": "Across these examples, the same probability idea keeps its shape while the objects change from toy outcomes to real model behavior.",
    "takeaways": [
      "Expectation translates probability into a numerical function.",
      "Areas, sums, and accumulated probabilities must be checked against total probability $1$.",
      "These tools are central for losses, uncertainty, and ML evaluation."
    ]
  }
};
