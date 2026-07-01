module.exports = {
  "math-14-13": {
    "id": "math-14-13",
    "title": "Combinatorial identities",
    "tagline": "Combinatorial identities let one counting story reveal another, so algebra becomes a proof by re-counting.",
    "connections": {
      "buildsOn": [
        "binomial coefficients",
        "factorials",
        "Pascal's rule"
      ],
      "leadsTo": [
        "Inclusion–exclusion",
        "Generating functions",
        "discrete probability"
      ],
      "usedWith": [
        "set counting",
        "Pascal's triangle",
        "algebraic proofs",
        "recurrences"
      ]
    },
    "motivation": "<p>You already know that $\\binom{n}{k}$ counts ways to choose $k$ items from $n$. The lovely surprise is that the same collection can often be counted in two different ways.</p><p>A <b>combinatorial identity</b> is an equality that becomes trustworthy when both sides count the same thing. Instead of pushing symbols alone, we ask what story the symbols are telling.</p>",
    "definition": "<p>A <b>combinatorial identity</b> is an equation between counting expressions, such as $$\\sum_{k=0}^n \\binom{n}{k}=2^n.$$ Here $n$ is the number of available objects and $k$ is a chosen subset size. The left side counts all subsets by first grouping them according to size; the right side counts each object as either in or out.</p><p>Vandermonde's identity says $\\sum_{k=0}^r \\binom{m}{k}\\binom{n}{r-k}=\\binom{m+n}{r}$. It follows by choosing $r$ people from two groups: choose $k$ from the first group and $r-k$ from the second, then sum over possible $k$.</p><p><b>Assumptions that matter:</b> counts are finite; $\\binom{n}{k}=0$ when $k<0$ or $k>n$; and a valid combinatorial proof must count every object exactly once on each side.</p>",
    "worked": {
      "problem": "Prove and evaluate $\\sum_{k=0}^5 \\binom{5}{k}=2^5$.",
      "skills": [
        "binomial coefficients",
        "counting by cases",
        "subset counting"
      ],
      "strategy": "The sum looks algebraic — count all subsets once by size and once by yes-or-no decisions.",
      "steps": [
        {
          "do": "Name the set size",
          "result": "$n=5$",
          "why": "there are five distinct objects"
        },
        {
          "do": "Interpret one term",
          "result": "$\\binom{5}{k}$",
          "why": "it counts subsets with exactly $k$ objects"
        },
        {
          "do": "Interpret the sum",
          "result": "$\\sum_{k=0}^5\\binom{5}{k}$",
          "why": "it counts all subsets after grouping by size"
        },
        {
          "do": "Count by decisions",
          "result": "$2^5$",
          "why": "each of five objects is either chosen or not chosen"
        },
        {
          "do": "Compute the value",
          "result": "$2^5=32$",
          "why": "five binary choices give 32 subsets"
        }
      ],
      "verify": "For three objects the same idea gives $1+3+3+1=8$, so the pattern is believable before $n=5$.",
      "answer": "The sum equals $32$, and both sides count all subsets of a 5-element set.",
      "connects": "The identity is not a magic formula; it is two honest counts of the same subsets."
    },
    "practice": [
      {
        "problem": "Use Pascal's identity to compute $\\binom{8}{3}$ from smaller binomial coefficients.",
        "steps": [
          {
            "do": "Write Pascal's identity",
            "result": "$\\binom{8}{3}=\\binom{7}{2}+\\binom{7}{3}$",
            "why": "choose whether a distinguished item is included"
          },
          {
            "do": "Compute the first term",
            "result": "$\\binom{7}{2}=21$",
            "why": "choose two of seven"
          },
          {
            "do": "Compute the second term",
            "result": "$\\binom{7}{3}=35$",
            "why": "choose three of seven"
          },
          {
            "do": "Add the terms",
            "result": "$21+35=56$",
            "why": "the two cases are disjoint"
          },
          {
            "do": "State the count",
            "result": "$\\binom{8}{3}=56$",
            "why": "Pascal's split preserves the total"
          }
        ],
        "answer": "$\\binom{8}{3}=56$."
      },
      {
        "problem": "Evaluate $\\sum_{k=0}^4\\binom{4}{k}$ and explain the count.",
        "steps": [
          {
            "do": "Identify the identity",
            "result": "$\\sum_{k=0}^n\\binom{n}{k}=2^n$",
            "why": "all subsets grouped by size"
          },
          {
            "do": "Substitute $n=4$",
            "result": "$\\sum_{k=0}^4\\binom{4}{k}=2^4$",
            "why": "there are four objects"
          },
          {
            "do": "Compute the power",
            "result": "$2^4=16$",
            "why": "four in-or-out decisions"
          },
          {
            "do": "Expand to check",
            "result": "$1+4+6+4+1=16$",
            "why": "Pascal row 4 agrees"
          },
          {
            "do": "Interpret the result",
            "result": "16 subsets",
            "why": "including the empty set and full set"
          }
        ],
        "answer": "There are $16$ subsets."
      },
      {
        "problem": "Use Vandermonde to compute $\\sum_{k=0}^2\\binom{3}{k}\\binom{4}{2-k}$.",
        "steps": [
          {
            "do": "Match the groups",
            "result": "$m=3$, $n=4$, $r=2$",
            "why": "choose two from two groups"
          },
          {
            "do": "Apply Vandermonde",
            "result": "$\\sum_{k=0}^2\\binom{3}{k}\\binom{4}{2-k}=\\binom{7}{2}$",
            "why": "choose both items from all seven at once"
          },
          {
            "do": "Compute the binomial coefficient",
            "result": "$\\binom{7}{2}=21$",
            "why": "use $7\\cdot6/2$"
          },
          {
            "do": "Check by expansion",
            "result": "$1\\cdot6+3\\cdot4+3\\cdot1=21$",
            "why": "the cases are $k=0,1,2$"
          },
          {
            "do": "State the counted object",
            "result": "two-person committees from seven people",
            "why": "each committee has a unique number from the first group"
          }
        ],
        "answer": "The sum equals $21$."
      },
      {
        "problem": "Count the number of even-size subsets of a 6-element set.",
        "steps": [
          {
            "do": "Pair subsets with complements",
            "result": "each subset has a complement",
            "why": "complements preserve parity when $n=6$ is even"
          },
          {
            "do": "Use the binomial sum for even sizes",
            "result": "$\\binom60+\\binom62+\\binom64+\\binom66$",
            "why": "group by even cardinality"
          },
          {
            "do": "Compute terms",
            "result": "$1+15+15+1$",
            "why": "from row 6 of Pascal's triangle"
          },
          {
            "do": "Add the terms",
            "result": "$32$",
            "why": "sum the even-size counts"
          },
          {
            "do": "Compare to all subsets",
            "result": "$32=2^5$",
            "why": "half of the $2^6$ subsets have even size"
          }
        ],
        "answer": "There are $32$ even-size subsets."
      },
      {
        "problem": "A model ensemble chooses any nonempty subset of 5 base models. Use an identity to count the choices.",
        "steps": [
          {
            "do": "Count all subsets",
            "result": "$2^5$",
            "why": "each model is in or out"
          },
          {
            "do": "Compute all subsets",
            "result": "$2^5=32$",
            "why": "five binary choices"
          },
          {
            "do": "Identify the forbidden subset",
            "result": "empty subset",
            "why": "the ensemble must choose at least one model"
          },
          {
            "do": "Subtract the forbidden case",
            "result": "$32-1=31$",
            "why": "remove the empty choice"
          },
          {
            "do": "Write as a binomial sum",
            "result": "$\\sum_{k=1}^5\\binom5k=31$",
            "why": "group valid ensembles by size"
          }
        ],
        "answer": "There are $31$ nonempty ensembles."
      }
    ],
    "applications": [
      {
        "title": "Feature subset search",
        "background": "Feature selection tries many subsets of variables before training. Combinatorial identities keep the count visible.",
        "numbers": "With $12$ candidate features, all subsets number $2^{12}=4096$; nonempty subsets number $4095$."
      },
      {
        "title": "Ensemble model choices",
        "background": "Bagging and ensemble methods often combine groups of base learners. Counting by size says how many candidate ensembles exist.",
        "numbers": "From $8$ trained models, exactly three-model ensembles number $\\binom83=56$."
      },
      {
        "title": "A/B test segment combinations",
        "background": "Experiment platforms can define audiences by selected attributes. Subset identities count possible segment definitions.",
        "numbers": "With $6$ binary attributes, there are $2^6=64$ possible attribute-inclusion patterns."
      },
      {
        "title": "Polynomial feature expansion",
        "background": "A degree-limited feature map counts monomials using combinations with repetition.",
        "numbers": "For $d=4$ inputs and degree $2$, the number of degree-2 monomials is $\\binom{4+2-1}{2}=10$."
      },
      {
        "title": "Database projection lists",
        "background": "Query planners may consider sets of columns to materialize. Subset counting gives the planning space.",
        "numbers": "Choosing any 4 columns from 20 gives $\\binom{20}{4}=4845$ possible projections."
      },
      {
        "title": "Counting labels in multi-label ML",
        "background": "A multi-label classifier may assign any subset of labels. The basic subset identity gives output-space size.",
        "numbers": "With $10$ labels, possible label sets total $2^{10}=1024$; excluding no-label gives $1023$."
      }
    ],
    "applicationsClose": "The common thread is re-counting: when two expressions count the same finite choices, an identity becomes a reliable tool.",
    "takeaways": [
      "A combinatorial identity is often best proved by counting one set in two ways.",
      "Pascal's identity splits choices by whether a special item is included.",
      "The binomial sum $\\sum_k\\binom nk=2^n$ counts all subsets.",
      "Vandermonde counts selections from two groups either separately or all at once."
    ]
  },
  "math-14-14": {
    "id": "math-14-14",
    "title": "Inclusion–exclusion",
    "tagline": "Inclusion–exclusion counts unions by adding what you want and repairing the overcount.",
    "connections": {
      "buildsOn": [
        "sets",
        "unions and intersections",
        "Combinatorial identities"
      ],
      "leadsTo": [
        "The pigeonhole principle",
        "Discrete probability",
        "Boolean algebra"
      ],
      "usedWith": [
        "Venn diagrams",
        "indicator variables",
        "set complements",
        "probability rules"
      ]
    },
    "motivation": "<p>You already know a small overcount: if 12 students like tea and 9 like coffee, adding gives 21, but students who like both were counted twice.</p><p><b>Inclusion–exclusion</b> is the careful repair. Add the single sets, subtract overlaps, then add back triple overlaps when needed. It is bookkeeping with integrity.</p>",
    "definition": "<p>For two finite sets, $$|A\\cup B|=|A|+|B|-|A\\cap B|.$$ The subtraction is needed because every element in $A\\cap B$ appears once in $|A|$ and once in $|B|$.</p><p>For three sets, $$|A\\cup B\\cup C|=|A|+|B|+|C|-|A\\cap B|-|A\\cap C|-|B\\cap C|+|A\\cap B\\cap C|.$$ A triple-overlap element is added three times, subtracted three times, and added once, so it is counted exactly once.</p><p><b>Assumptions that matter:</b> the sets are finite or have well-defined sizes; intersections are counted consistently; and complements must be taken relative to a stated universe.</p>",
    "worked": {
      "problem": "In a group of 100 users, 55 use mobile, 40 use desktop, and 20 use both. How many use at least one of the two?",
      "skills": [
        "two-set formula",
        "overcount repair",
        "set interpretation"
      ],
      "strategy": "The overlap is counted twice by the first addition — subtract it once.",
      "steps": [
        {
          "do": "Name the sets",
          "result": "$M$ for mobile and $D$ for desktop",
          "why": "short names keep the formula readable"
        },
        {
          "do": "Write the formula",
          "result": "$|M\\cup D|=|M|+|D|-|M\\cap D|$",
          "why": "union means at least one"
        },
        {
          "do": "Substitute the numbers",
          "result": "$55+40-20$",
          "why": "use the given counts"
        },
        {
          "do": "Add the single counts",
          "result": "$95-20$",
          "why": "mobile plus desktop overcounts shared users"
        },
        {
          "do": "Subtract the overlap",
          "result": "$75$",
          "why": "each both-device user is now counted once"
        }
      ],
      "verify": "The result cannot exceed 100 and is at least 55, so 75 is plausible.",
      "answer": "75 users use at least one of mobile or desktop.",
      "connects": "Inclusion–exclusion turns a naive sum into an exact union count."
    },
    "practice": [
      {
        "problem": "A class has 18 students in algebra, 14 in statistics, and 6 in both. Count students in at least one course.",
        "steps": [
          {
            "do": "Let the sets be $A$ and $S$",
            "result": "$|A|=18$, $|S|=14$, $|A\\cap S|=6$",
            "why": "translate the words"
          },
          {
            "do": "Write inclusion–exclusion",
            "result": "$|A\\cup S|=18+14-6$",
            "why": "subtract the double-counted overlap"
          },
          {
            "do": "Add first",
            "result": "$32-6$",
            "why": "combine single memberships"
          },
          {
            "do": "Subtract",
            "result": "$26$",
            "why": "repair the overcount"
          },
          {
            "do": "Interpret",
            "result": "26 students",
            "why": "the union means at least one course"
          }
        ],
        "answer": "26 students are in at least one course."
      },
      {
        "problem": "Out of 60 files, 25 are compressed, 30 are encrypted, and 10 are both. How many are neither?",
        "steps": [
          {
            "do": "Compute at least one",
            "result": "$25+30-10=45$",
            "why": "use the two-set union formula"
          },
          {
            "do": "Name the universe",
            "result": "$60$ files",
            "why": "neither is a complement"
          },
          {
            "do": "Subtract from the universe",
            "result": "$60-45$",
            "why": "remove files with at least one property"
          },
          {
            "do": "Compute",
            "result": "$15$",
            "why": "simple subtraction"
          },
          {
            "do": "State the complement",
            "result": "15 files are neither",
            "why": "they are not compressed and not encrypted"
          }
        ],
        "answer": "15 files are neither compressed nor encrypted."
      },
      {
        "problem": "In 50 requests, 20 fail validation, 15 time out, and 5 do both. Count requests with exactly one problem.",
        "steps": [
          {
            "do": "Count validation-only",
            "result": "$20-5=15$",
            "why": "remove requests that also timed out"
          },
          {
            "do": "Count timeout-only",
            "result": "$15-5=10$",
            "why": "remove requests that also failed validation"
          },
          {
            "do": "Add exact-one cases",
            "result": "$15+10=25$",
            "why": "the two cases are disjoint"
          },
          {
            "do": "Alternative union count",
            "result": "$20+15-5=30$",
            "why": "requests with at least one problem"
          },
          {
            "do": "Remove both from union",
            "result": "$30-5=25$",
            "why": "exactly one excludes the overlap"
          }
        ],
        "answer": "25 requests have exactly one problem."
      },
      {
        "problem": "For sets with $|A|=30$, $|B|=25$, $|C|=20$, pairwise intersections $8,7,6$, and triple intersection $3$, find $|A\\cup B\\cup C|$.",
        "steps": [
          {
            "do": "Write the three-set formula",
            "result": "$|A\\cup B\\cup C|=30+25+20-8-7-6+3$",
            "why": "include singles, exclude pairs, include triples"
          },
          {
            "do": "Add singles",
            "result": "$75$",
            "why": "total before repairs"
          },
          {
            "do": "Add pair overlaps",
            "result": "$8+7+6=21$",
            "why": "total overcount to subtract"
          },
          {
            "do": "Subtract pair overlaps",
            "result": "$75-21=54$",
            "why": "triple elements were subtracted too much"
          },
          {
            "do": "Add triple overlap",
            "result": "$54+3=57$",
            "why": "restore triple elements once"
          }
        ],
        "answer": "The union has size $57$."
      },
      {
        "problem": "A classifier flags 120 items for policy A, 90 for policy B, 50 for policy C; pair overlaps are 35, 20, 15, and 8 items hit all three. How many unique items are flagged?",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$120+90+50-35-20-15+8$",
            "why": "three-set inclusion–exclusion"
          },
          {
            "do": "Add single flags",
            "result": "$260$",
            "why": "naive total alerts"
          },
          {
            "do": "Add pair overlaps",
            "result": "$35+20+15=70$",
            "why": "alerts counted twice"
          },
          {
            "do": "Subtract and add triple",
            "result": "$260-70+8$",
            "why": "repair pair and triple counts"
          },
          {
            "do": "Compute unique flagged items",
            "result": "$198$",
            "why": "final union size"
          }
        ],
        "answer": "198 unique items are flagged."
      }
    ],
    "applications": [
      {
        "title": "Deduplicating alerts",
        "background": "Monitoring systems often emit several alerts for one incident. Inclusion–exclusion estimates unique incidents from overlapping alert streams.",
        "numbers": "If CPU alerts hit 40 hosts, memory 30, and both 12, unique alerted hosts are $40+30-12=58$."
      },
      {
        "title": "Search result blending",
        "background": "Search engines merge results from several retrievers. Overlap must be removed before counting unique documents.",
        "numbers": "Retriever A returns 100 docs, B returns 80, overlap 25; union size is $155$."
      },
      {
        "title": "Data quality checks",
        "background": "Datasets may fail multiple validation rules. Inclusion–exclusion separates total bad rows from duplicated failure counts.",
        "numbers": "Rule counts 300 and 220 with 75 overlap give $300+220-75=445$ bad rows."
      },
      {
        "title": "Probability of events",
        "background": "The same formula works for probabilities when events overlap. It prevents probabilities from exceeding 1.",
        "numbers": "$P(A)=0.4$, $P(B)=0.3$, $P(A\\cap B)=0.1$ gives $P(A\\cup B)=0.6$."
      },
      {
        "title": "Cache coverage",
        "background": "Systems may ask how many requests are served by either of two caches. Shared hits should not be counted twice.",
        "numbers": "Cache 1 hits 700 requests, cache 2 hits 500, both hit 250, so at least one hits $950$."
      },
      {
        "title": "Multi-label evaluation",
        "background": "An item can be assigned several labels. Counting items with any sensitive label needs overlap-aware union counts.",
        "numbers": "Labels have counts 45, 35, 20, pair overlaps 10, 5, 4, triple 2; union is $45+35+20-19+2=83$."
      }
    ],
    "applicationsClose": "Wherever categories overlap, inclusion–exclusion is the quiet discipline that counts people, rows, requests, and events once.",
    "takeaways": [
      "For two sets, add the sizes and subtract the intersection.",
      "For three sets, subtract pairwise overlaps and add back the triple overlap.",
      "Exactly-one and neither questions often use inclusion–exclusion plus complements.",
      "Always state the universe when using complements."
    ]
  },
  "math-14-15": {
    "id": "math-14-15",
    "title": "The pigeonhole principle",
    "tagline": "The pigeonhole principle finds certainty in crowding: too many objects for too few boxes forces a repeat.",
    "connections": {
      "buildsOn": [
        "functions between finite sets",
        "Counting basics",
        "Inclusion–exclusion"
      ],
      "leadsTo": [
        "Recurrence relations",
        "Discrete probability",
        "Counting, complexity, and Big-O"
      ],
      "usedWith": [
        "ceilings",
        "modular arithmetic",
        "graph coloring",
        "hashing"
      ]
    },
    "motivation": "<p>You already trust the idea: if 13 people choose birth months, at least two share a month. There are only 12 months.</p><p>The <b>pigeonhole principle</b> gives that intuition a clean mathematical voice. It is a proof method for guarantees, especially when the exact repeated item is not known.</p>",
    "definition": "<p>If $N$ objects are placed into $k$ boxes and $N>k$, then at least one box contains at least two objects. More generally, at least one box contains at least $\\lceil N/k\\rceil$ objects.</p><p>The generalized version follows because if every box had at most $\\lceil N/k\\rceil-1$ objects, then the total would be at most $k(\\lceil N/k\\rceil-1)$, which is less than $N$ when $\\lceil N/k\\rceil$ is the smallest integer not below $N/k$.</p><p><b>Assumptions that matter:</b> every object must be assigned to a box; boxes must cover all possible categories; and the conclusion guarantees existence, not which box is crowded.</p>",
    "worked": {
      "problem": "How many people guarantee that at least 4 share a birth month?",
      "skills": [
        "generalized pigeonhole",
        "ceilings",
        "guarantee arguments"
      ],
      "strategy": "To force four in some month, find the largest crowd that could avoid four, then add one.",
      "steps": [
        {
          "do": "Name the boxes",
          "result": "12 months",
          "why": "birth months are the categories"
        },
        {
          "do": "Set the avoidance limit",
          "result": "at most 3 people per month",
          "why": "this avoids having four in any month"
        },
        {
          "do": "Compute the largest avoiding total",
          "result": "$12\\cdot3=36$",
          "why": "fill every month with three people"
        },
        {
          "do": "Add one person",
          "result": "$36+1=37$",
          "why": "one more must enter a month already holding three"
        },
        {
          "do": "State the guarantee",
          "result": "37 people force at least 4 in one month",
          "why": "this is the smallest guaranteed number"
        }
      ],
      "verify": "With 36 people, three in each month is possible, so 37 is the first forced value.",
      "answer": "37 people guarantee that at least 4 share a birth month.",
      "connects": "Pigeonhole proofs often ask how long a pattern can avoid the crowded outcome."
    },
    "practice": [
      {
        "problem": "Show that among 8 people, at least two were born on the same day of the week.",
        "steps": [
          {
            "do": "Name the objects",
            "result": "8 people",
            "why": "these are placed into categories"
          },
          {
            "do": "Name the boxes",
            "result": "7 weekdays",
            "why": "birth weekdays are the possible boxes"
          },
          {
            "do": "Compare counts",
            "result": "$8>7$",
            "why": "more objects than boxes"
          },
          {
            "do": "Apply pigeonhole",
            "result": "some weekday has at least 2 people",
            "why": "a repeat is forced"
          },
          {
            "do": "Interpret",
            "result": "two people share a birth weekday",
            "why": "the exact weekday is not specified"
          }
        ],
        "answer": "At least two people share a birth weekday."
      },
      {
        "problem": "How many integers must be chosen to guarantee two have the same remainder modulo 5?",
        "steps": [
          {
            "do": "Name the boxes",
            "result": "remainders $0,1,2,3,4$",
            "why": "modulo 5 has five categories"
          },
          {
            "do": "Find the avoiding maximum",
            "result": "5 integers",
            "why": "one can occupy each remainder"
          },
          {
            "do": "Add one",
            "result": "$5+1=6$",
            "why": "the sixth repeats a remainder"
          },
          {
            "do": "Apply pigeonhole",
            "result": "two integers share a remainder",
            "why": "same box means same remainder"
          },
          {
            "do": "State the guarantee",
            "result": "6 integers",
            "why": "this is minimal"
          }
        ],
        "answer": "6 integers guarantee a shared remainder modulo 5."
      },
      {
        "problem": "If 41 files are assigned to 10 servers, prove some server gets at least 5 files.",
        "steps": [
          {
            "do": "Compute the average load",
            "result": "$41/10=4.1$",
            "why": "average above 4 forces a higher integer"
          },
          {
            "do": "Take the ceiling",
            "result": "$\\lceil4.1\\rceil=5$",
            "why": "loads are whole numbers"
          },
          {
            "do": "Apply generalized pigeonhole",
            "result": "some server has at least 5 files",
            "why": "one box reaches the ceiling"
          },
          {
            "do": "Check avoidance",
            "result": "10 servers with at most 4 files hold only 40",
            "why": "that is not enough for 41 files"
          },
          {
            "do": "Conclude",
            "result": "at least one server has 5 or more files",
            "why": "the guarantee follows"
          }
        ],
        "answer": "Some server receives at least 5 files."
      },
      {
        "problem": "Prove that among any 6 integers, two differ by a multiple of 5.",
        "steps": [
          {
            "do": "Assign each integer to a remainder modulo 5",
            "result": "boxes are $0$ through $4$",
            "why": "same remainder means difference divisible by 5"
          },
          {
            "do": "Count boxes",
            "result": "5 remainder classes",
            "why": "there are only five"
          },
          {
            "do": "Compare objects to boxes",
            "result": "$6>5$",
            "why": "six integers crowd five classes"
          },
          {
            "do": "Apply pigeonhole",
            "result": "two integers have the same remainder",
            "why": "a repeated box is forced"
          },
          {
            "do": "Subtract the two integers",
            "result": "their difference is $0\\bmod 5$",
            "why": "equal remainders cancel"
          }
        ],
        "answer": "Two of the integers differ by a multiple of 5."
      },
      {
        "problem": "A hash table maps 1001 keys into 100 buckets. What load is guaranteed in some bucket?",
        "steps": [
          {
            "do": "Identify objects and boxes",
            "result": "1001 keys and 100 buckets",
            "why": "hashing assigns each key to a bucket"
          },
          {
            "do": "Compute average load",
            "result": "$1001/100=10.01$",
            "why": "average keys per bucket"
          },
          {
            "do": "Take the ceiling",
            "result": "$\\lceil10.01\\rceil=11$",
            "why": "bucket counts are integers"
          },
          {
            "do": "Apply generalized pigeonhole",
            "result": "some bucket has at least 11 keys",
            "why": "one bucket meets or exceeds the ceiling"
          },
          {
            "do": "Interpret for hashing",
            "result": "a collision chain of length at least 11 exists",
            "why": "if all keys are stored in buckets"
          }
        ],
        "answer": "At least one bucket contains at least 11 keys."
      }
    ],
    "applications": [
      {
        "title": "Hash collisions",
        "background": "Hash tables deliberately map a huge key space into fewer buckets. Pigeonhole says collisions are unavoidable.",
        "numbers": "Mapping 10,000 user ids to 1,024 buckets guarantees a bucket with at least $\\lceil10000/1024\\rceil=10$ ids."
      },
      {
        "title": "Birthday paradox setup",
        "background": "Probability refines pigeonhole, but the deterministic floor is simple. With more people than days, a shared birthday is certain.",
        "numbers": "With 367 people and 366 possible birthdays including leap day, at least two share a birthday."
      },
      {
        "title": "Load balancing",
        "background": "Distributed systems spread tasks across machines. Average load gives a minimum worst-case guarantee.",
        "numbers": "101 tasks on 20 workers force some worker to hold at least $\\lceil101/20\\rceil=6$ tasks."
      },
      {
        "title": "Remainder arguments",
        "background": "Number theory uses pigeonholes for congruence guarantees. Same remainder means divisible difference.",
        "numbers": "Choosing 11 integers guarantees two share a remainder modulo 10, so their difference is a multiple of 10."
      },
      {
        "title": "Cache slots",
        "background": "Limited cache slots cannot hold all active items uniquely. Pigeonhole predicts conflict pressure.",
        "numbers": "250 active keys in 64 cache sets force at least $\\lceil250/64\\rceil=4$ keys in one set."
      },
      {
        "title": "Mini-batch grouping",
        "background": "ML training may bucket examples by sequence length. Too many examples for few buckets forces a crowded bucket.",
        "numbers": "513 sequences placed into 32 length buckets force some bucket to contain at least $\\lceil513/32\\rceil=17$ sequences."
      }
    ],
    "applicationsClose": "The pigeonhole principle is small but sturdy: when finite capacity is exceeded, repetition or crowding is not an accident but a certainty.",
    "takeaways": [
      "If $N>k$, placing $N$ objects in $k$ boxes forces a shared box.",
      "The generalized guarantee is at least $\\lceil N/k\\rceil$ objects in some box.",
      "Many proofs choose boxes as remainders, categories, buckets, or labels.",
      "The principle proves existence without identifying the crowded box."
    ]
  },
  "math-14-16": {
    "id": "math-14-16",
    "title": "Recurrence relations",
    "tagline": "A recurrence describes a sequence by telling each term how to grow from earlier terms.",
    "connections": {
      "buildsOn": [
        "sequences",
        "functions",
        "Counting basics"
      ],
      "leadsTo": [
        "Solving linear recurrences",
        "Generating functions",
        "Counting, complexity, and Big-O"
      ],
      "usedWith": [
        "induction",
        "dynamic programming",
        "trees",
        "difference equations"
      ]
    },
    "motivation": "<p>You already compute patterns step by step: today's balance depends on yesterday's balance, and today's dynamic-programming table entry depends on earlier entries.</p><p>A <b>recurrence relation</b> turns that dependency into a definition. It is a natural language for counting processes that unfold one size at a time.</p>",
    "definition": "<p>A recurrence relation defines a sequence $a_0,a_1,a_2,\\ldots$ by giving initial values and a rule for later terms, such as $a_n=a_{n-1}+2$ with $a_0=3$. Initial values anchor the sequence; the recurrence propagates it.</p><p>For counting binary strings with no consecutive 1s, let $a_n$ be the number of valid length-$n$ strings. A valid string ending in 0 follows any valid length $n-1$ string; a valid string ending in 10 follows any valid length $n-2$ string. Thus $a_n=a_{n-1}+a_{n-2}$.</p><p><b>Assumptions that matter:</b> the recurrence rule must apply only where earlier terms exist; initial conditions must be enough to start the rule; and $a_n$ should have a consistent meaning for every $n$.</p>",
    "worked": {
      "problem": "Find $a_1$ through $a_5$ for $a_n=3a_{n-1}+2$ with $a_0=1$.",
      "skills": [
        "iteration",
        "initial conditions",
        "sequence notation"
      ],
      "strategy": "The rule gives one new term at a time — start from the anchor and iterate carefully.",
      "steps": [
        {
          "do": "Start from the initial value",
          "result": "$a_0=1$",
          "why": "the recurrence needs a first term"
        },
        {
          "do": "Compute $a_1$",
          "result": "$3\\cdot1+2=5$",
          "why": "use $a_0$"
        },
        {
          "do": "Compute $a_2$",
          "result": "$3\\cdot5+2=17$",
          "why": "use $a_1$"
        },
        {
          "do": "Compute $a_3$",
          "result": "$3\\cdot17+2=53$",
          "why": "use $a_2$"
        },
        {
          "do": "Compute $a_4$",
          "result": "$3\\cdot53+2=161$",
          "why": "use $a_3$"
        },
        {
          "do": "Compute $a_5$",
          "result": "$3\\cdot161+2=485$",
          "why": "use $a_4$"
        }
      ],
      "verify": "Each term is a little more than triple the previous term, so fast growth from 1 to 485 is expected.",
      "answer": "$a_1=5$, $a_2=17$, $a_3=53$, $a_4=161$, $a_5=485$.",
      "connects": "A recurrence is an engine: initial values start it, and the rule drives the sequence."
    },
    "practice": [
      {
        "problem": "For $a_n=a_{n-1}+4$ with $a_0=2$, compute $a_1$ through $a_4$ and guess a formula.",
        "steps": [
          {
            "do": "Compute $a_1$",
            "result": "$2+4=6$",
            "why": "add 4 once"
          },
          {
            "do": "Compute $a_2$",
            "result": "$6+4=10$",
            "why": "apply the recurrence again"
          },
          {
            "do": "Compute $a_3$",
            "result": "$10+4=14$",
            "why": "continue the pattern"
          },
          {
            "do": "Compute $a_4$",
            "result": "$14+4=18$",
            "why": "four additions of 4"
          },
          {
            "do": "Guess the closed form",
            "result": "$a_n=2+4n$",
            "why": "start at 2 and add 4 for each step"
          }
        ],
        "answer": "$a_1=6$, $a_2=10$, $a_3=14$, $a_4=18$, and $a_n=2+4n$."
      },
      {
        "problem": "For $b_n=2b_{n-1}$ with $b_0=3$, compute $b_1$ through $b_5$.",
        "steps": [
          {
            "do": "Compute $b_1$",
            "result": "$2\\cdot3=6$",
            "why": "double the initial term"
          },
          {
            "do": "Compute $b_2$",
            "result": "$2\\cdot6=12$",
            "why": "double again"
          },
          {
            "do": "Compute $b_3$",
            "result": "$2\\cdot12=24$",
            "why": "apply the same rule"
          },
          {
            "do": "Compute $b_4$",
            "result": "$2\\cdot24=48$",
            "why": "continue doubling"
          },
          {
            "do": "Compute $b_5$",
            "result": "$2\\cdot48=96$",
            "why": "one more step"
          }
        ],
        "answer": "The terms are $6,12,24,48,96$."
      },
      {
        "problem": "Let $F_0=0$, $F_1=1$, and $F_n=F_{n-1}+F_{n-2}$. Compute $F_2$ through $F_7$.",
        "steps": [
          {
            "do": "Compute $F_2$",
            "result": "$1+0=1$",
            "why": "add the previous two terms"
          },
          {
            "do": "Compute $F_3$",
            "result": "$1+1=2$",
            "why": "use $F_2$ and $F_1$"
          },
          {
            "do": "Compute $F_4$",
            "result": "$2+1=3$",
            "why": "use the two latest terms"
          },
          {
            "do": "Compute $F_5$",
            "result": "$3+2=5$",
            "why": "continue the recurrence"
          },
          {
            "do": "Compute $F_6$ and $F_7$",
            "result": "$F_6=8$, $F_7=13$",
            "why": "add adjacent previous terms"
          }
        ],
        "answer": "$F_2=1$, $F_3=2$, $F_4=3$, $F_5=5$, $F_6=8$, $F_7=13$."
      },
      {
        "problem": "A valid password string of length $n$ over $\\{0,1\\}$ cannot contain consecutive 1s. Derive the recurrence for $a_n$.",
        "steps": [
          {
            "do": "Define $a_n$",
            "result": "number of valid length-$n$ strings",
            "why": "clear meaning for the sequence"
          },
          {
            "do": "Split by final symbol",
            "result": "ending in 0 or ending in 1",
            "why": "these cases are disjoint"
          },
          {
            "do": "Count strings ending in 0",
            "result": "$a_{n-1}$",
            "why": "append 0 to any valid shorter string"
          },
          {
            "do": "Count strings ending in 1",
            "result": "$a_{n-2}$",
            "why": "the previous symbol must be 0, so append 01 to a valid length $n-2$ string"
          },
          {
            "do": "Add the cases",
            "result": "$a_n=a_{n-1}+a_{n-2}$",
            "why": "disjoint cases cover all valid strings"
          }
        ],
        "answer": "The recurrence is $a_n=a_{n-1}+a_{n-2}$ with $a_0=1$ and $a_1=2$."
      },
      {
        "problem": "A dynamic program has cost $T(n)=T(n-1)+n$ with $T(0)=0$. Compute $T(5)$ by iteration.",
        "steps": [
          {
            "do": "Compute $T(1)$",
            "result": "$0+1=1$",
            "why": "use the recurrence"
          },
          {
            "do": "Compute $T(2)$",
            "result": "$1+2=3$",
            "why": "add the new size"
          },
          {
            "do": "Compute $T(3)$",
            "result": "$3+3=6$",
            "why": "continue accumulating"
          },
          {
            "do": "Compute $T(4)$",
            "result": "$6+4=10$",
            "why": "add 4"
          },
          {
            "do": "Compute $T(5)$",
            "result": "$10+5=15$",
            "why": "add 5"
          }
        ],
        "answer": "$T(5)=15$."
      }
    ],
    "applications": [
      {
        "title": "Dynamic programming tables",
        "background": "Dynamic programming defines each table cell from smaller subproblems. Recurrences are the blueprint.",
        "numbers": "If $D(n)=D(n-1)+n$ and $D(0)=0$, then $D(4)=1+2+3+4=10$ operations."
      },
      {
        "title": "Fibonacci growth",
        "background": "The Fibonacci recurrence appears in tilings and branching processes. It is a first friendly second-order recurrence.",
        "numbers": "$F_5=5$ and $F_6=8$, so $F_7=13$."
      },
      {
        "title": "Tree node counts",
        "background": "Complete binary trees grow recursively: each level doubles. A recurrence expresses that expansion.",
        "numbers": "With $N_h=2N_{h-1}+1$ and $N_0=1$, $N_3=15$ nodes."
      },
      {
        "title": "Training checkpoints",
        "background": "A schedule may update a budget from the previous epoch. Recurrences make the schedule reproducible.",
        "numbers": "If batch size follows $b_n=2b_{n-1}$ from $32$, then after 3 doublings it is $256$."
      },
      {
        "title": "Queue backlogs",
        "background": "Backlog today depends on yesterday plus arrivals minus service. This is a practical recurrence.",
        "numbers": "With $q_n=q_{n-1}+12-10$ and $q_0=5$, $q_4=13$."
      },
      {
        "title": "Autoregressive models",
        "background": "Sequence models often predict from previous tokens or states. The indexing mirrors recurrence thinking.",
        "numbers": "If hidden size update cost is $c_n=c_{n-1}+64$ from $0$, then 10 steps accumulate $640$ units."
      }
    ],
    "applicationsClose": "Recurrences let discrete processes speak step by step, from simple schedules to dynamic programs and sequence models.",
    "takeaways": [
      "A recurrence needs both a rule and enough initial conditions.",
      "First-order rules use one previous term; second-order rules use two.",
      "Counting recurrences often come from splitting the last step into cases.",
      "Iteration is the safest first way to understand a recurrence."
    ]
  },
  "math-14-17": {
    "id": "math-14-17",
    "title": "Solving linear recurrences",
    "tagline": "Solving a linear recurrence turns a step-by-step rule into a formula you can evaluate directly.",
    "connections": {
      "buildsOn": [
        "Recurrence relations",
        "algebra",
        "sequences"
      ],
      "leadsTo": [
        "Generating functions",
        "Counting, complexity, and Big-O",
        "discrete probability"
      ],
      "usedWith": [
        "characteristic equations",
        "geometric sequences",
        "induction",
        "dynamic programming"
      ]
    },
    "motivation": "<p>Iterating a recurrence is honest but slow. If you need the 1000th term, computing every previous term may hide the pattern.</p><p>For many linear recurrences, a special guess unlocks the formula. Geometric sequences are the key: if each term is a power, the recurrence becomes an algebra equation.</p>",
    "definition": "<p>A homogeneous linear recurrence with constant coefficients has the form $a_n=c_1a_{n-1}+\\cdots+c_da_{n-d}$. Trying $a_n=r^n$ gives a <b>characteristic equation</b>. For $a_n=5a_{n-1}-6a_{n-2}$, the equation is $r^2=5r-6$, or $r^2-5r+6=0$.</p><p>If the characteristic roots are distinct, say $r_1$ and $r_2$, then $a_n=A r_1^n+B r_2^n$, and the constants come from initial conditions. The reason is linearity: each root-power sequence satisfies the recurrence, and sums of solutions also satisfy it.</p><p><b>Assumptions that matter:</b> this lesson focuses on homogeneous recurrences with constant coefficients and distinct roots; repeated roots and nonhomogeneous terms need extra modifications; and initial conditions determine the constants.</p>",
    "worked": {
      "problem": "Solve $a_n=5a_{n-1}-6a_{n-2}$ with $a_0=2$ and $a_1=5$.",
      "skills": [
        "characteristic equation",
        "factoring",
        "initial conditions"
      ],
      "strategy": "The recurrence is linear and homogeneous — try $a_n=r^n$, then fit constants.",
      "steps": [
        {
          "do": "Substitute $a_n=r^n$",
          "result": "$r^n=5r^{n-1}-6r^{n-2}$",
          "why": "look for geometric solutions"
        },
        {
          "do": "Divide by $r^{n-2}$",
          "result": "$r^2=5r-6$",
          "why": "remove the common power"
        },
        {
          "do": "Move all terms to one side",
          "result": "$r^2-5r+6=0$",
          "why": "form the characteristic equation"
        },
        {
          "do": "Factor",
          "result": "$(r-2)(r-3)=0$",
          "why": "find the roots"
        },
        {
          "do": "Write the general solution",
          "result": "$a_n=A2^n+B3^n$",
          "why": "distinct roots give a linear combination"
        },
        {
          "do": "Use $a_0=2$",
          "result": "$A+B=2$",
          "why": "both powers equal 1 at $n=0$"
        },
        {
          "do": "Use $a_1=5$",
          "result": "$2A+3B=5$",
          "why": "substitute $n=1$"
        },
        {
          "do": "Solve the constants",
          "result": "$A=1$, $B=1$",
          "why": "subtract twice the first equation from the second"
        },
        {
          "do": "State the formula",
          "result": "$a_n=2^n+3^n$",
          "why": "insert the constants"
        }
      ],
      "verify": "The formula gives $a_0=2$ and $a_1=5$, and $a_2=4+9=13$, matching $5\\cdot5-6\\cdot2=13$.",
      "answer": "$a_n=2^n+3^n$.",
      "connects": "Characteristic roots reveal the geometric pieces inside a linear recurrence."
    },
    "practice": [
      {
        "problem": "Solve $a_n=2a_{n-1}$ with $a_0=7$ by recognizing the pattern.",
        "steps": [
          {
            "do": "Compute the first few terms",
            "result": "$7,14,28$",
            "why": "each term doubles"
          },
          {
            "do": "Identify the ratio",
            "result": "$2$",
            "why": "successive terms multiply by 2"
          },
          {
            "do": "Write the geometric form",
            "result": "$a_n=7\\cdot2^n$",
            "why": "start at $a_0=7$"
          },
          {
            "do": "Check $n=1$",
            "result": "$7\\cdot2=14$",
            "why": "matches the recurrence"
          },
          {
            "do": "Check $n=2$",
            "result": "$7\\cdot4=28$",
            "why": "the formula stays consistent"
          }
        ],
        "answer": "$a_n=7\\cdot2^n$."
      },
      {
        "problem": "Solve $a_n=4a_{n-1}$ with $a_0=3$.",
        "steps": [
          {
            "do": "Try $a_n=r^n$",
            "result": "$r^n=4r^{n-1}$",
            "why": "geometric trial"
          },
          {
            "do": "Divide by $r^{n-1}$",
            "result": "$r=4$",
            "why": "characteristic root"
          },
          {
            "do": "Write the general solution",
            "result": "$a_n=A4^n$",
            "why": "one first-order root"
          },
          {
            "do": "Use $a_0=3$",
            "result": "$A=3$",
            "why": "because $4^0=1$"
          },
          {
            "do": "State the formula",
            "result": "$a_n=3\\cdot4^n$",
            "why": "constant fitted"
          }
        ],
        "answer": "$a_n=3\\cdot4^n$."
      },
      {
        "problem": "Solve $a_n=3a_{n-1}-2a_{n-2}$ with $a_0=1$, $a_1=4$.",
        "steps": [
          {
            "do": "Form the characteristic equation",
            "result": "$r^2=3r-2$",
            "why": "try $r^n$"
          },
          {
            "do": "Move terms",
            "result": "$r^2-3r+2=0$",
            "why": "standard polynomial form"
          },
          {
            "do": "Factor",
            "result": "$(r-1)(r-2)=0$",
            "why": "roots are 1 and 2"
          },
          {
            "do": "Write the solution",
            "result": "$a_n=A+B2^n$",
            "why": "since $1^n=1$"
          },
          {
            "do": "Use initial values",
            "result": "$A+B=1$ and $A+2B=4$",
            "why": "substitute $n=0,1$"
          },
          {
            "do": "Solve constants",
            "result": "$B=3$, $A=-2$",
            "why": "subtract the equations"
          },
          {
            "do": "State formula",
            "result": "$a_n=-2+3\\cdot2^n$",
            "why": "insert constants"
          }
        ],
        "answer": "$a_n=-2+3\\cdot2^n$."
      },
      {
        "problem": "Solve $a_n=7a_{n-1}-10a_{n-2}$ with $a_0=0$, $a_1=1$.",
        "steps": [
          {
            "do": "Write the characteristic equation",
            "result": "$r^2-7r+10=0$",
            "why": "move all terms to one side"
          },
          {
            "do": "Factor",
            "result": "$(r-5)(r-2)=0$",
            "why": "roots are 5 and 2"
          },
          {
            "do": "Write the general solution",
            "result": "$a_n=A5^n+B2^n$",
            "why": "distinct roots"
          },
          {
            "do": "Use $a_0=0$",
            "result": "$A+B=0$",
            "why": "initial value"
          },
          {
            "do": "Use $a_1=1$",
            "result": "$5A+2B=1$",
            "why": "second initial value"
          },
          {
            "do": "Solve",
            "result": "$A=1/3$, $B=-1/3$",
            "why": "use $B=-A$"
          },
          {
            "do": "State formula",
            "result": "$a_n=\\dfrac{5^n-2^n}{3}$",
            "why": "combine constants"
          }
        ],
        "answer": "$a_n=(5^n-2^n)/3$."
      },
      {
        "problem": "A divide-and-conquer counter satisfies $T_n=2T_{n-1}$ for levels $n$ with $T_0=1$. Find $T_{10}$.",
        "steps": [
          {
            "do": "Recognize first-order growth",
            "result": "$T_n=2T_{n-1}$",
            "why": "each level doubles"
          },
          {
            "do": "Write the formula",
            "result": "$T_n=2^n$",
            "why": "starts at $1$"
          },
          {
            "do": "Substitute $n=10$",
            "result": "$T_{10}=2^{10}$",
            "why": "ten doublings"
          },
          {
            "do": "Compute the power",
            "result": "$2^{10}=1024$",
            "why": "standard power of two"
          },
          {
            "do": "Interpret",
            "result": "1024 subproblems at level 10",
            "why": "direct formula avoids iterating all levels"
          }
        ],
        "answer": "$T_{10}=1024$."
      }
    ],
    "applications": [
      {
        "title": "Fibonacci formulas",
        "background": "The Fibonacci recurrence has characteristic roots involving the golden ratio. The formula explains its growth rate.",
        "numbers": "$F_{20}=6765$, while $\\varphi^{20}/\\sqrt5\\approx6765$ gives a close integer."
      },
      {
        "title": "Algorithm recurrences",
        "background": "Some algorithm costs follow linear recurrences. Solving them reveals the growth rate.",
        "numbers": "If $T_n=2T_{n-1}$ and $T_0=1$, then $T_{30}=2^{30}=1,073,741,824$."
      },
      {
        "title": "Population models",
        "background": "Age-structured populations can be approximated by recurrence rules. Characteristic roots describe long-run growth.",
        "numbers": "If $a_n=3a_{n-1}$ from $100$, then after 5 periods $a_5=100\\cdot3^5=24,300$."
      },
      {
        "title": "Signal filters",
        "background": "Simple digital filters update from previous outputs. Linear recurrences describe their impulse response.",
        "numbers": "For $y_n=0.5y_{n-1}$ with $y_0=1$, $y_6=0.5^6=0.015625$."
      },
      {
        "title": "Gradient momentum memory",
        "background": "Exponential moving averages are first-order recurrences. Solving shows how old gradients fade.",
        "numbers": "With $m_n=0.9m_{n-1}$ and $m_0=1$, the weight after 10 steps is $0.9^{10}\\approx0.349$."
      },
      {
        "title": "Branching search trees",
        "background": "A search that branches by a fixed factor has geometric recurrence behavior.",
        "numbers": "If nodes per depth satisfy $N_d=3N_{d-1}$ and $N_0=1$, depth 6 has $729$ nodes."
      }
    ],
    "applicationsClose": "Solving recurrences changes perspective: from marching term by term to seeing the powers that control growth.",
    "takeaways": [
      "For homogeneous constant-coefficient recurrences, try $a_n=r^n$.",
      "The characteristic equation turns the recurrence into algebra.",
      "Distinct roots give a sum of geometric terms.",
      "Initial conditions determine the constants in the closed form."
    ]
  },
  "math-14-18": {
    "id": "math-14-18",
    "title": "Generating functions",
    "tagline": "Generating functions store a whole sequence inside one power series, so algebra can do counting work.",
    "connections": {
      "buildsOn": [
        "sequences",
        "Recurrence relations",
        "power series notation"
      ],
      "leadsTo": [
        "Discrete probability",
        "Counting, complexity, and Big-O",
        "combinatorial identities"
      ],
      "usedWith": [
        "polynomials",
        "convolutions",
        "recurrences",
        "coefficient extraction"
      ]
    },
    "motivation": "<p>You already use lists of numbers: $1,1,2,3,5,8$ tells a story term by term. A generating function packages that list as coefficients of powers of $x$.</p><p>The gift is that counting choices become multiplication, and recurrence rules become algebra. We do not evaluate $x$ so much as use it as a label for size.</p>",
    "definition": "<p>The ordinary generating function for a sequence $a_0,a_1,a_2,\\ldots$ is $$A(x)=\\sum_{n\\ge0}a_nx^n.$$ The notation $[x^n]A(x)$ means the coefficient of $x^n$ in $A(x)$.</p><p>For example, $1+x+x^2+\\cdots=1/(1-x)$ as a formal power series because multiplying by $(1-x)$ cancels all terms after the constant: $(1-x)(1+x+x^2+\\cdots)=1$.</p><p><b>Assumptions that matter:</b> in combinatorics, power series may be treated formally without worrying about numerical convergence; coefficients must match the counted sizes; and multiplication of generating functions corresponds to splitting size between independent choices.</p>",
    "worked": {
      "problem": "Use generating functions to count ways to make total 4 using parts of size 1 and 2, with unlimited copies and order ignored.",
      "skills": [
        "coefficient extraction",
        "geometric series",
        "counting partitions"
      ],
      "strategy": "Each part size contributes a geometric series — multiply and read the coefficient of $x^4$.",
      "steps": [
        {
          "do": "Write the size-1 factor",
          "result": "$1+x+x^2+x^3+x^4+\\cdots$",
          "why": "choose any number of ones"
        },
        {
          "do": "Write the size-2 factor",
          "result": "$1+x^2+x^4+\\cdots$",
          "why": "choose any number of twos"
        },
        {
          "do": "Multiply the factors",
          "result": "$A(x)=(1+x+x^2+\\cdots)(1+x^2+x^4+\\cdots)$",
          "why": "independent choices combine by multiplication"
        },
        {
          "do": "List contributions to $x^4$",
          "result": "$x^4\\cdot1$, $x^2\\cdot x^2$, $1\\cdot x^4$",
          "why": "the exponents must add to 4"
        },
        {
          "do": "Count contributions",
          "result": "$3$",
          "why": "there are three coefficient contributions"
        }
      ],
      "verify": "The actual combinations are $1+1+1+1$, $1+1+2$, and $2+2$, so the coefficient 3 is right.",
      "answer": "There are 3 ways.",
      "connects": "Generating functions turn size bookkeeping into coefficient extraction."
    },
    "practice": [
      {
        "problem": "Find the generating function for the constant sequence $1,1,1,\\ldots$.",
        "steps": [
          {
            "do": "Write the definition",
            "result": "$A(x)=\\sum_{n\\ge0}1\\cdot x^n$",
            "why": "each coefficient is 1"
          },
          {
            "do": "Expand the sum",
            "result": "$1+x+x^2+\\cdots$",
            "why": "ordinary power series"
          },
          {
            "do": "Multiply by $1-x$",
            "result": "$(1-x)A(x)=1$",
            "why": "all later terms cancel formally"
          },
          {
            "do": "Solve for $A(x)$",
            "result": "$A(x)=1/(1-x)$",
            "why": "divide by $1-x$"
          },
          {
            "do": "State the coefficient rule",
            "result": " $[x^n]A(x)=1$",
            "why": "every size has one object"
          }
        ],
        "answer": "$A(x)=1/(1-x)$."
      },
      {
        "problem": "Find the coefficient of $x^3$ in $(1+x)^5$.",
        "steps": [
          {
            "do": "Recognize the binomial theorem",
            "result": "$(1+x)^5=\\sum_{k=0}^5\\binom5k x^k$",
            "why": "coefficients count choices"
          },
          {
            "do": "Identify the needed coefficient",
            "result": "$[x^3](1+x)^5=\\binom53$",
            "why": "choose which 3 factors contribute $x$"
          },
          {
            "do": "Compute $\\binom53$",
            "result": "$10$",
            "why": "use $5\\cdot4\\cdot3/(3\\cdot2\\cdot1)$"
          },
          {
            "do": "Interpret",
            "result": "choose 3 of 5 factors",
            "why": "each chosen factor supplies $x$"
          },
          {
            "do": "State the coefficient",
            "result": "10",
            "why": "coefficient extraction complete"
          }
        ],
        "answer": "The coefficient is $10$."
      },
      {
        "problem": "Count nonnegative solutions to $a+b+c=4$ using a generating function.",
        "steps": [
          {
            "do": "Give each variable a factor",
            "result": "$1+x+x^2+\\cdots$",
            "why": "one variable can contribute any nonnegative amount"
          },
          {
            "do": "Multiply three factors",
            "result": "$(1+x+x^2+\\cdots)^3$",
            "why": "three independent variables"
          },
          {
            "do": "Use the closed form",
            "result": "$(1-x)^{-3}$",
            "why": "geometric series cubed"
          },
          {
            "do": "Use stars and bars coefficient",
            "result": "$[x^4](1-x)^{-3}=\\binom{4+3-1}{3-1}$",
            "why": "standard coefficient"
          },
          {
            "do": "Compute",
            "result": "$\\binom62=15$",
            "why": "choose separator positions"
          }
        ],
        "answer": "There are $15$ solutions."
      },
      {
        "problem": "Find the coefficient of $x^5$ in $(1+x+x^2)(1+x^3)$.",
        "steps": [
          {
            "do": "List the first factor exponents",
            "result": "$0,1,2$",
            "why": "possible contributions"
          },
          {
            "do": "List the second factor exponents",
            "result": "$0,3$",
            "why": "possible contributions"
          },
          {
            "do": "Find pairs summing to 5",
            "result": "$2+3=5$",
            "why": "only one pair works"
          },
          {
            "do": "Count the pairs",
            "result": "$1$",
            "why": "coefficient equals number of valid exponent splits"
          },
          {
            "do": "State coefficient",
            "result": "$[x^5]=1$",
            "why": "one product term gives $x^5$"
          }
        ],
        "answer": "The coefficient is $1$."
      },
      {
        "problem": "A model can choose 0, 1, or 2 text features and 0 or 1 image feature. Use a generating function to count ways to choose exactly 2 features by type-count only.",
        "steps": [
          {
            "do": "Write text factor",
            "result": "$1+x+x^2$",
            "why": "choose 0, 1, or 2 text features"
          },
          {
            "do": "Write image factor",
            "result": "$1+x$",
            "why": "choose 0 or 1 image feature"
          },
          {
            "do": "Multiply",
            "result": "$(1+x+x^2)(1+x)$",
            "why": "combine independent type choices"
          },
          {
            "do": "Collect the $x^2$ terms",
            "result": "$x\\cdot x$ and $x^2\\cdot1$",
            "why": "two exponent splits give total 2"
          },
          {
            "do": "Count coefficient",
            "result": "$2$",
            "why": "the type-count choices are text+image or two text"
          }
        ],
        "answer": "There are 2 type-count patterns for exactly 2 features."
      }
    ],
    "applications": [
      {
        "title": "Polynomial multiplication as convolution",
        "background": "Signal processing and probability use the same coefficient rule: multiplication combines independent sizes.",
        "numbers": "$ (1+2x)(3+4x)$ has $x$ coefficient $1\\cdot4+2\\cdot3=10$."
      },
      {
        "title": "Counting feature budgets",
        "background": "Feature selection with budgets can be encoded by powers of $x$. Coefficients count feasible totals.",
        "numbers": "If text choices contribute $1+x+x^2$ and image choices $1+x$, coefficient of $x^2$ is $2$."
      },
      {
        "title": "Dice sums",
        "background": "A die has generating function $x+x^2+\\cdots+x^6$. Two dice use its square.",
        "numbers": "The coefficient of $x^7$ in $(x+\\cdots+x^6)^2$ is $6$, matching sums to 7."
      },
      {
        "title": "Integer partitions with limited parts",
        "background": "Generating functions count ways to build totals from allowed part sizes.",
        "numbers": "Using parts 1 and 3 for total 6 gives coefficient of $x^6$ in $(1+x+x^2+\\cdots)(1+x^3+x^6+\\cdots)$, which is $3$."
      },
      {
        "title": "Binomial coefficients",
        "background": "The polynomial $(1+x)^n$ stores subset counts. Coefficients are binomial coefficients.",
        "numbers": "In $(1+x)^8$, coefficient of $x^3$ is $\\binom83=56$."
      },
      {
        "title": "Dynamic programming compression",
        "background": "Generating functions can summarize a DP table by size. Algebraic operations mirror transitions.",
        "numbers": "If current counts are $1+3x+2x^2$ and a choice adds 0 or 1, multiplying by $1+x$ gives coefficient of $x^2$ equal $3+2=5$."
      }
    ],
    "applicationsClose": "Generating functions are counting ledgers: coefficients hold answers, while algebra moves entire families of answers at once.",
    "takeaways": [
      "An ordinary generating function is $A(x)=\\sum a_nx^n$.",
      "Coefficient notation $[x^n]A(x)$ means the coefficient of $x^n$.",
      "Multiplication combines independent choices by adding exponents.",
      "Formal power series can be used for counting even when numerical convergence is not the focus."
    ]
  },
  "math-14-19": {
    "id": "math-14-19",
    "title": "Discrete probability",
    "tagline": "Discrete probability assigns weights to countable outcomes and turns counting into a measure of chance.",
    "connections": {
      "buildsOn": [
        "sets",
        "Counting basics",
        "Inclusion–exclusion"
      ],
      "leadsTo": [
        "Posets and lattices",
        "Modular arithmetic",
        "Counting, complexity, and Big-O"
      ],
      "usedWith": [
        "random variables",
        "expectation",
        "combinatorics",
        "Bayes rule"
      ]
    },
    "motivation": "<p>You already reason with chance when you say a fair coin has two equally likely outcomes. Discrete probability keeps that common sense precise when there are many outcomes.</p><p>In ML, probability is the language of uncertainty: labels, tokens, model errors, sampled batches, and randomized algorithms all live here.</p>",
    "definition": "<p>A discrete probability space has a countable sample space $\\Omega$ and probabilities $P(\\omega)\\ge0$ for outcomes $\\omega$, with $\\sum_{\\omega\\in\\Omega}P(\\omega)=1$. For an event $A\\subseteq\\Omega$, $P(A)=\\sum_{\\omega\\in A}P(\\omega)$.</p><p>If all outcomes are equally likely, then $P(A)=|A|/|\\Omega|$. The complement rule $P(A^c)=1-P(A)$ follows because $A$ and $A^c$ are disjoint and together cover the whole sample space.</p><p><b>Assumptions that matter:</b> probabilities must be nonnegative and sum to 1; equally likely formulas require genuine symmetry; and independence means $P(A\\cap B)=P(A)P(B)$, not merely that events feel unrelated.</p>",
    "worked": {
      "problem": "A fair die is rolled twice. What is the probability the sum is 7?",
      "skills": [
        "sample spaces",
        "equally likely outcomes",
        "counting favorable cases"
      ],
      "strategy": "The outcomes are ordered pairs — count all pairs and then count pairs whose sum is 7.",
      "steps": [
        {
          "do": "Count all outcomes",
          "result": "$6\\cdot6=36$",
          "why": "each roll has six possibilities"
        },
        {
          "do": "List favorable pairs",
          "result": "$(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$",
          "why": "ordered pairs with sum 7"
        },
        {
          "do": "Count favorable outcomes",
          "result": "$6$",
          "why": "six listed pairs"
        },
        {
          "do": "Form the probability",
          "result": "$6/36$",
          "why": "favorable over total for equally likely outcomes"
        },
        {
          "do": "Simplify",
          "result": "$1/6$",
          "why": "divide numerator and denominator by 6"
        }
      ],
      "verify": "A sum of 7 is common but not dominant; probability $1/6$ matches the classic dice table.",
      "answer": "The probability is $1/6$.",
      "connects": "Discrete probability is counting with normalized weights."
    },
    "practice": [
      {
        "problem": "A fair coin is flipped 3 times. Find the probability of exactly 2 heads.",
        "steps": [
          {
            "do": "Count all outcomes",
            "result": "$2^3=8$",
            "why": "three binary flips"
          },
          {
            "do": "Count head positions",
            "result": "$\\binom32=3$",
            "why": "choose which two flips are heads"
          },
          {
            "do": "Form the probability",
            "result": "$3/8$",
            "why": "favorable over total"
          },
          {
            "do": "Convert to decimal",
            "result": "$0.375$",
            "why": "divide 3 by 8"
          },
          {
            "do": "Interpret",
            "result": "37.5 percent",
            "why": "less than half but substantial"
          }
        ],
        "answer": "The probability is $3/8=0.375$."
      },
      {
        "problem": "From 5 red and 3 blue balls, choose one uniformly. Find $P(\\text{blue})$ and $P(\\text{not blue})$.",
        "steps": [
          {
            "do": "Count total balls",
            "result": "$5+3=8$",
            "why": "all equally likely draws"
          },
          {
            "do": "Count blue balls",
            "result": "$3$",
            "why": "favorable outcomes"
          },
          {
            "do": "Compute blue probability",
            "result": "$3/8$",
            "why": "favorable over total"
          },
          {
            "do": "Use complement rule",
            "result": "$1-3/8=5/8$",
            "why": "not blue is the complement"
          },
          {
            "do": "Check with red count",
            "result": "$5/8$",
            "why": "not blue means red here"
          }
        ],
        "answer": "$P(\\text{blue})=3/8$ and $P(\\text{not blue})=5/8$."
      },
      {
        "problem": "Two independent events have $P(A)=0.4$ and $P(B)=0.25$. Find $P(A\\cap B)$ and $P(A\\cup B)$.",
        "steps": [
          {
            "do": "Use independence",
            "result": "$P(A\\cap B)=0.4\\cdot0.25$",
            "why": "independent events multiply"
          },
          {
            "do": "Compute intersection",
            "result": "$0.10$",
            "why": "multiply decimals"
          },
          {
            "do": "Use inclusion–exclusion",
            "result": "$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$",
            "why": "avoid double-counting overlap"
          },
          {
            "do": "Substitute",
            "result": "$0.4+0.25-0.10$",
            "why": "use computed intersection"
          },
          {
            "do": "Compute union",
            "result": "$0.55$",
            "why": "add and subtract"
          }
        ],
        "answer": "$P(A\\cap B)=0.10$ and $P(A\\cup B)=0.55$."
      },
      {
        "problem": "A random variable takes values 0, 1, 2 with probabilities 0.2, 0.5, 0.3. Compute its expectation.",
        "steps": [
          {
            "do": "Write expectation",
            "result": "$E[X]=\\sum xP(X=x)$",
            "why": "weighted average"
          },
          {
            "do": "Substitute values",
            "result": "$0\\cdot0.2+1\\cdot0.5+2\\cdot0.3$",
            "why": "multiply each value by its probability"
          },
          {
            "do": "Compute products",
            "result": "$0+0.5+0.6$",
            "why": "term by term"
          },
          {
            "do": "Add",
            "result": "$1.1$",
            "why": "total expected value"
          },
          {
            "do": "Interpret",
            "result": "average value is 1.1 over many trials",
            "why": "expectation need not be an observed value"
          }
        ],
        "answer": "$E[X]=1.1$."
      },
      {
        "problem": "A classifier is correct with probability 0.9 independently on each of 4 examples. Find the probability it gets all 4 correct and exactly 3 correct.",
        "steps": [
          {
            "do": "Compute all-correct probability",
            "result": "$0.9^4=0.6561$",
            "why": "independent correct events multiply"
          },
          {
            "do": "Choose the incorrect position for exactly 3 correct",
            "result": "$\\binom41=4$",
            "why": "one of four examples is wrong"
          },
          {
            "do": "Write one pattern probability",
            "result": "$0.9^3\\cdot0.1$",
            "why": "three correct and one wrong"
          },
          {
            "do": "Multiply by patterns",
            "result": "$4\\cdot0.9^3\\cdot0.1$",
            "why": "disjoint positions"
          },
          {
            "do": "Compute",
            "result": "$4\\cdot0.729\\cdot0.1=0.2916$",
            "why": "decimal arithmetic"
          }
        ],
        "answer": "All 4 correct has probability $0.6561$; exactly 3 correct has probability $0.2916$."
      }
    ],
    "applications": [
      {
        "title": "Model accuracy as probability",
        "background": "Accuracy estimates the probability a model is correct on a random example from a distribution.",
        "numbers": "If 460 of 500 validation examples are correct, estimated accuracy is $460/500=0.92$."
      },
      {
        "title": "Mini-batch sampling",
        "background": "Training samples batches from data. Hypergeometric or binomial counts describe label mixes.",
        "numbers": "With class rate $0.2$, expected positives in a batch of 64 are $64\\cdot0.2=12.8$."
      },
      {
        "title": "Dropout masks",
        "background": "Dropout randomly keeps or removes activations. A Bernoulli variable models each unit.",
        "numbers": "With keep probability $0.8$ across 100 units, expected kept units are $80$."
      },
      {
        "title": "Randomized hashing",
        "background": "Hash functions are often analyzed probabilistically. Collision chance is a discrete event.",
        "numbers": "Two independent keys into 1000 buckets collide with probability $1/1000=0.001$."
      },
      {
        "title": "A/B testing",
        "background": "Experiment outcomes are random variables. Counts become estimated probabilities.",
        "numbers": "If 52 conversions occur among 1000 users, conversion estimate is $0.052$."
      },
      {
        "title": "Language-model tokens",
        "background": "A next-token distribution assigns probabilities to a finite vocabulary slice.",
        "numbers": "If token probabilities are $0.50,0.30,0.20$, their sum is $1.00$ and the top-token chance is $0.50$."
      }
    ],
    "applicationsClose": "Discrete probability is the bridge from counting possibilities to quantifying uncertainty in data, algorithms, and models.",
    "takeaways": [
      "A discrete probability space assigns nonnegative probabilities summing to 1.",
      "For equally likely outcomes, probability is favorable count divided by total count.",
      "Complements and inclusion–exclusion work for probabilities just as they do for counts.",
      "Expectation is a probability-weighted average."
    ]
  },
  "math-14-20": {
    "id": "math-14-20",
    "title": "Posets and lattices",
    "tagline": "Posets organize objects by partial order, and lattices guarantee shared upper and lower summaries.",
    "connections": {
      "buildsOn": [
        "sets",
        "relations",
        "functions"
      ],
      "leadsTo": [
        "Modular arithmetic",
        "Boolean algebra",
        "Counting, complexity, and Big-O"
      ],
      "usedWith": [
        "Hasse diagrams",
        "subsets",
        "divisibility",
        "Boolean algebra"
      ]
    },
    "motivation": "<p>You already know some comparisons are incomplete. Two feature sets may not contain each other; two tasks may not depend on each other. A total line is too strict.</p><p>A <b>partially ordered set</b> lets some pairs be comparable and others remain independent. A lattice adds reliable meet and join operations, which is why these ideas appear in logic, permissions, and dataflow.</p>",
    "definition": "<p>A <b>poset</b> is a set $P$ with a relation $\\le$ that is reflexive, antisymmetric, and transitive. Reflexive means $a\\le a$; antisymmetric means $a\\le b$ and $b\\le a$ imply $a=b$; transitive means $a\\le b$ and $b\\le c$ imply $a\\le c$.</p><p>A <b>lattice</b> is a poset where every pair $a,b$ has a greatest lower bound $a\\wedge b$ called the meet, and a least upper bound $a\\vee b$ called the join. For subsets ordered by inclusion, meet is intersection and join is union.</p><p><b>Assumptions that matter:</b> the order relation must be stated; comparable does not mean equal; not every poset is a lattice; and meet/join are defined by the order, not by ordinary arithmetic unless the order says so.</p>",
    "worked": {
      "problem": "In the subset poset of $\\{1,2,3\\}$ ordered by inclusion, find the meet and join of $A=\\{1,2\\}$ and $B=\\{2,3\\}$.",
      "skills": [
        "subset order",
        "meet",
        "join"
      ],
      "strategy": "For subset inclusion, lower means contained in both and upper means containing both.",
      "steps": [
        {
          "do": "State the order",
          "result": "$X\\le Y$ means $X\\subseteq Y$",
          "why": "the poset uses inclusion"
        },
        {
          "do": "Find common lower elements",
          "result": "subsets contained in both $A$ and $B$",
          "why": "lower bounds must be inside each set"
        },
        {
          "do": "Compute the meet",
          "result": "$A\\cap B=\\{2\\}$",
          "why": "intersection is the greatest common subset"
        },
        {
          "do": "Find common upper elements",
          "result": "sets containing both $A$ and $B$",
          "why": "upper bounds must include all elements in either set"
        },
        {
          "do": "Compute the join",
          "result": "$A\\cup B=\\{1,2,3\\}$",
          "why": "union is the least common superset"
        }
      ],
      "verify": "$\\{2\\}$ is contained in both sets, and $\\{1,2,3\\}$ contains both while no smaller set can contain all elements from both.",
      "answer": "The meet is $\\{2\\}$ and the join is $\\{1,2,3\\}$.",
      "connects": "A lattice gives a clean way to combine partial information from below and above."
    },
    "practice": [
      {
        "problem": "Check whether divisibility on $\\{1,2,3,6\\}$ is a partial order.",
        "steps": [
          {
            "do": "Check reflexive",
            "result": "$a\\mid a$ for each listed $a$",
            "why": "every number divides itself"
          },
          {
            "do": "Check antisymmetric",
            "result": "if $a\\mid b$ and $b\\mid a$, then $a=b$",
            "why": "positive divisibility has no two-way relation except equality"
          },
          {
            "do": "Check transitive",
            "result": "if $a\\mid b$ and $b\\mid c$, then $a\\mid c$",
            "why": "divisibility composes"
          },
          {
            "do": "Apply to the set",
            "result": "all three properties hold",
            "why": "the listed set is positive integers"
          },
          {
            "do": "Conclude",
            "result": "divisibility is a partial order",
            "why": "some pairs like 2 and 3 are incomparable"
          }
        ],
        "answer": "Yes, divisibility is a partial order on this set."
      },
      {
        "problem": "In subsets of $\\{a,b\\}$, find the meet and join of $\\{a\\}$ and $\\{b\\}$.",
        "steps": [
          {
            "do": "Use subset order",
            "result": "meet is intersection",
            "why": "lower means contained in both"
          },
          {
            "do": "Compute intersection",
            "result": "$\\{a\\}\\cap\\{b\\}=\\varnothing$",
            "why": "they share no elements"
          },
          {
            "do": "Use subset order",
            "result": "join is union",
            "why": "upper means contains both"
          },
          {
            "do": "Compute union",
            "result": "$\\{a\\}\\cup\\{b\\}=\\{a,b\\}$",
            "why": "include both elements"
          },
          {
            "do": "State results",
            "result": "meet $\\varnothing$, join $\\{a,b\\}$",
            "why": "subset lattice result"
          }
        ],
        "answer": "Meet is $\\varnothing$ and join is $\\{a,b\\}$."
      },
      {
        "problem": "For divisibility on $\\{1,2,3,6\\}$, find meet and join of 2 and 3.",
        "steps": [
          {
            "do": "Interpret meet",
            "result": "greatest common divisor",
            "why": "lower bounds divide both numbers"
          },
          {
            "do": "Compute common divisors of 2 and 3",
            "result": "$\\{1\\}$",
            "why": "only 1 divides both"
          },
          {
            "do": "State meet",
            "result": "$1$",
            "why": "greatest common divisor is 1"
          },
          {
            "do": "Interpret join",
            "result": "least common multiple inside the set",
            "why": "upper bounds are multiples of both"
          },
          {
            "do": "Compute join",
            "result": "$6$",
            "why": "6 is the least listed multiple of both"
          }
        ],
        "answer": "Meet is $1$ and join is $6$."
      },
      {
        "problem": "In the dependency order where $a\\le b$ means task $a$ must finish before task $b$, explain why two independent tasks may be incomparable.",
        "steps": [
          {
            "do": "State comparability",
            "result": "tasks are comparable if one must precede the other",
            "why": "order gives a dependency direction"
          },
          {
            "do": "Consider independent tasks",
            "result": "neither depends on the other",
            "why": "no required order exists"
          },
          {
            "do": "Check $a\\le b$",
            "result": "false",
            "why": "task $a$ need not finish before $b$"
          },
          {
            "do": "Check $b\\le a$",
            "result": "false",
            "why": "task $b$ need not finish before $a$"
          },
          {
            "do": "Conclude",
            "result": "the tasks are incomparable",
            "why": "partial orders allow this"
          }
        ],
        "answer": "Independent tasks are incomparable because neither must precede the other."
      },
      {
        "problem": "Feature sets $A=\\{x_1,x_3\\}$ and $B=\\{x_2,x_3,x_4\\}$ are ordered by inclusion. Find meet and join sizes.",
        "steps": [
          {
            "do": "Compute meet",
            "result": "$A\\cap B=\\{x_3\\}$",
            "why": "shared features only"
          },
          {
            "do": "Find meet size",
            "result": "$1$",
            "why": "one shared feature"
          },
          {
            "do": "Compute join",
            "result": "$A\\cup B=\\{x_1,x_2,x_3,x_4\\}$",
            "why": "features appearing in either set"
          },
          {
            "do": "Find join size",
            "result": "$4$",
            "why": "four distinct features"
          },
          {
            "do": "Interpret",
            "result": "meet is common information and join is combined information",
            "why": "lattice language fits feature sets"
          }
        ],
        "answer": "Meet size is $1$ and join size is $4$."
      }
    ],
    "applications": [
      {
        "title": "Feature-set lattices",
        "background": "Feature subsets ordered by inclusion form a lattice. Meet keeps common features; join combines candidates.",
        "numbers": "For $A=\\{1,2,5\\}$ and $B=\\{2,3\\}$, meet size is $1$ and join size is $4$."
      },
      {
        "title": "Permission systems",
        "background": "Access rights often form partial orders. Joining permissions combines capabilities safely.",
        "numbers": "If role A grants $\\{read,write\\}$ and role B grants $\\{read,delete\\}$, the join grants 3 distinct permissions."
      },
      {
        "title": "Dataflow analysis",
        "background": "Compilers use lattices to merge facts from different control-flow paths. Meet or join summarizes safe information.",
        "numbers": "If path facts are variables initialized $\\{x,y\\}$ and $\\{y,z\\}$, definitely initialized variables are intersection $\\{y\\}$."
      },
      {
        "title": "Divisibility lattices",
        "background": "Divisibility uses gcd as meet and lcm as join. This gives a number-theoretic lattice on divisors of a fixed number.",
        "numbers": "For 12 and 18, meet is $\\gcd(12,18)=6$ and join is $\\operatorname{lcm}(12,18)=36$."
      },
      {
        "title": "Version constraints",
        "background": "Package versions with dependency constraints are partially ordered. Some versions are incomparable when neither satisfies the other's constraints.",
        "numbers": "Constraint $\\{1.0,1.1\\}$ joined with $\\{1.1,1.2\\}$ by union has 3 allowed versions."
      },
      {
        "title": "Concept hierarchies",
        "background": "Ontologies and taxonomies are often partial, not total. Least common ancestors behave like joins when they exist.",
        "numbers": "If two labels share one parent among 20 class labels, their common abstraction can reduce two labels to one parent category."
      }
    ],
    "applicationsClose": "Posets respect partial information, and lattices add dependable ways to merge or compare that information.",
    "takeaways": [
      "A poset relation is reflexive, antisymmetric, and transitive.",
      "Pairs in a poset need not be comparable.",
      "A lattice gives every pair a meet and a join.",
      "Subset lattices use intersection as meet and union as join."
    ]
  },
  "math-14-21": {
    "id": "math-14-21",
    "title": "Modular arithmetic",
    "tagline": "Modular arithmetic keeps the remainder and lets cyclic patterns become ordinary algebra.",
    "connections": {
      "buildsOn": [
        "integers",
        "division with remainder",
        "The pigeonhole principle"
      ],
      "leadsTo": [
        "Boolean algebra",
        "Counting, complexity, and Big-O",
        "Discrete probability"
      ],
      "usedWith": [
        "congruences",
        "remainders",
        "cyclic groups",
        "hashing"
      ]
    },
    "motivation": "<p>You already use modular arithmetic whenever a clock wraps: 10 hours after 5 o'clock is 3 o'clock, not 15. The clock kept the remainder modulo 12.</p><p>Modulo arithmetic is the mathematics of wraparound. It is essential for hashing, checksums, cryptography, periodic schedules, and many discrete proofs.</p>",
    "definition": "<p>For integers $a,b$ and positive integer $m$, we write $a\\equiv b\\pmod m$ when $m$ divides $a-b$. Equivalently, $a$ and $b$ have the same remainder after division by $m$.</p><p>Congruences respect addition and multiplication: if $a\\equiv b\\pmod m$ and $c\\equiv d\\pmod m$, then $a+c\\equiv b+d\\pmod m$ and $ac\\equiv bd\\pmod m$. This works because the differences contain factors of $m$.</p><p><b>Assumptions that matter:</b> the modulus $m$ is positive; division is delicate because not every number has a modular inverse; and congruence classes group infinitely many integers by the same remainder.</p>",
    "worked": {
      "problem": "Compute $37+58\\pmod{12}$ and $37\\cdot58\\pmod{12}$.",
      "skills": [
        "remainders",
        "modular addition",
        "modular multiplication"
      ],
      "strategy": "Reduce each number to a remainder first, then do arithmetic with smaller numbers.",
      "steps": [
        {
          "do": "Reduce 37 modulo 12",
          "result": "$37\\equiv1\\pmod{12}$",
          "why": "36 is divisible by 12"
        },
        {
          "do": "Reduce 58 modulo 12",
          "result": "$58\\equiv10\\pmod{12}$",
          "why": "48 is divisible by 12"
        },
        {
          "do": "Add remainders",
          "result": "$1+10=11$",
          "why": "addition respects congruence"
        },
        {
          "do": "Multiply remainders",
          "result": "$1\\cdot10=10$",
          "why": "multiplication respects congruence"
        },
        {
          "do": "State results",
          "result": "$37+58\\equiv11$, $37\\cdot58\\equiv10\\pmod{12}$",
          "why": "remainders are between 0 and 11"
        }
      ],
      "verify": "Directly, $37+58=95$ and $95$ leaves remainder 11; $37\\cdot58=2146$ leaves remainder 10.",
      "answer": "The sum is $11\\pmod{12}$ and the product is $10\\pmod{12}$.",
      "connects": "Modulo arithmetic lets us replace large integers with their remainder classes."
    },
    "practice": [
      {
        "problem": "Find the remainder of 83 modulo 7.",
        "steps": [
          {
            "do": "Find a nearby multiple",
            "result": "$7\\cdot11=77$",
            "why": "largest convenient multiple below 83"
          },
          {
            "do": "Subtract",
            "result": "$83-77=6$",
            "why": "remainder after division"
          },
          {
            "do": "Write congruence",
            "result": "$83\\equiv6\\pmod7$",
            "why": "same remainder"
          },
          {
            "do": "Check range",
            "result": "$0\\le6<7$",
            "why": "valid remainder"
          },
          {
            "do": "State answer",
            "result": "6",
            "why": "the remainder is 6"
          }
        ],
        "answer": "The remainder is $6$."
      },
      {
        "problem": "Compute $25+44\\pmod9$.",
        "steps": [
          {
            "do": "Reduce 25",
            "result": "$25\\equiv7\\pmod9$",
            "why": "subtract 18"
          },
          {
            "do": "Reduce 44",
            "result": "$44\\equiv8\\pmod9$",
            "why": "subtract 36"
          },
          {
            "do": "Add remainders",
            "result": "$7+8=15$",
            "why": "modular addition"
          },
          {
            "do": "Reduce 15",
            "result": "$15\\equiv6\\pmod9$",
            "why": "subtract 9"
          },
          {
            "do": "State result",
            "result": "$25+44\\equiv6\\pmod9$",
            "why": "final remainder"
          }
        ],
        "answer": "$25+44\\equiv6\\pmod9$."
      },
      {
        "problem": "Compute $13\\cdot17\\pmod5$.",
        "steps": [
          {
            "do": "Reduce 13",
            "result": "$13\\equiv3\\pmod5$",
            "why": "subtract 10"
          },
          {
            "do": "Reduce 17",
            "result": "$17\\equiv2\\pmod5$",
            "why": "subtract 15"
          },
          {
            "do": "Multiply remainders",
            "result": "$3\\cdot2=6$",
            "why": "multiplication respects congruence"
          },
          {
            "do": "Reduce 6",
            "result": "$6\\equiv1\\pmod5$",
            "why": "subtract 5"
          },
          {
            "do": "State product",
            "result": "$13\\cdot17\\equiv1\\pmod5$",
            "why": "final remainder"
          }
        ],
        "answer": "$13\\cdot17\\equiv1\\pmod5$."
      },
      {
        "problem": "Solve $3x\\equiv1\\pmod7$ by testing small residues.",
        "steps": [
          {
            "do": "List residues",
            "result": "0 through 6",
            "why": "solutions repeat modulo 7"
          },
          {
            "do": "Test $x=1$",
            "result": "$3\\cdot1\\equiv3$",
            "why": "not 1"
          },
          {
            "do": "Test $x=2$",
            "result": "$3\\cdot2=6\\equiv6$",
            "why": "not 1"
          },
          {
            "do": "Test $x=3$",
            "result": "$3\\cdot3=9\\equiv2$",
            "why": "not 1"
          },
          {
            "do": "Test $x=5$",
            "result": "$3\\cdot5=15\\equiv1$",
            "why": "15 leaves remainder 1"
          },
          {
            "do": "State solution",
            "result": "$x\\equiv5\\pmod7$",
            "why": "all congruent residues work"
          }
        ],
        "answer": "$x\\equiv5\\pmod7$."
      },
      {
        "problem": "A hash function is $h(k)=k\\bmod 10$. Find buckets for keys 314, 271, and 999, then identify any collision.",
        "steps": [
          {
            "do": "Compute $314\\bmod10$",
            "result": "4",
            "why": "last digit gives remainder modulo 10"
          },
          {
            "do": "Compute $271\\bmod10$",
            "result": "1",
            "why": "last digit is 1"
          },
          {
            "do": "Compute $999\\bmod10$",
            "result": "9",
            "why": "last digit is 9"
          },
          {
            "do": "Compare buckets",
            "result": "4, 1, and 9",
            "why": "all buckets differ"
          },
          {
            "do": "State collision status",
            "result": "no collision among these keys",
            "why": "no two keys share a bucket"
          }
        ],
        "answer": "Buckets are 4, 1, and 9; there is no collision among these keys."
      }
    ],
    "applications": [
      {
        "title": "Hash tables",
        "background": "Hashing often uses remainders to assign keys to buckets. Modulo arithmetic makes bucket indices finite.",
        "numbers": "With $h(k)=k\\bmod100$, key 12345 maps to bucket 45."
      },
      {
        "title": "Checksums",
        "background": "Simple checksums reduce sums modulo a base to catch transcription errors.",
        "numbers": "Digits 4, 8, 2 sum to 14; modulo 10 checksum remainder is 4."
      },
      {
        "title": "Clock arithmetic",
        "background": "Scheduling systems wrap times around daily or weekly cycles.",
        "numbers": "A job 50 hours after Monday 09:00 is Wednesday 11:00 because $9+50=59\\equiv11\\pmod{24}$ with two extra days."
      },
      {
        "title": "Cryptography",
        "background": "Many cryptographic systems use modular multiplication and inverses. The arithmetic is exact but wrapped.",
        "numbers": "Modulo 11, $3\\cdot4=12\\equiv1$, so 4 is the inverse of 3."
      },
      {
        "title": "Sharding",
        "background": "Databases often assign records to shards by modulo. It is simple and deterministic.",
        "numbers": "User id 987 with 16 shards goes to shard $987\\bmod16=11$."
      },
      {
        "title": "Cyclic positional features",
        "background": "Periodic features can be represented by remainders before encoding.",
        "numbers": "Hour 27 maps to hour $27\\bmod24=3$, so it has the same daily position as 03:00."
      }
    ],
    "applicationsClose": "Modular arithmetic is the disciplined version of wraparound: reduce, operate, and interpret the remainder.",
    "takeaways": [
      "$a\\equiv b\\pmod m$ means $m$ divides $a-b$.",
      "Addition and multiplication preserve congruence.",
      "Every integer belongs to exactly one residue class modulo $m$.",
      "Division modulo $m$ requires an inverse, which may not exist."
    ]
  },
  "math-14-22": {
    "id": "math-14-22",
    "title": "Boolean algebra",
    "tagline": "Boolean algebra turns true-or-false logic into algebraic laws for simplifying conditions.",
    "connections": {
      "buildsOn": [
        "sets",
        "logic",
        "Posets and lattices"
      ],
      "leadsTo": [
        "Counting, complexity, and Big-O",
        "discrete probability",
        "Boolean circuits"
      ],
      "usedWith": [
        "truth tables",
        "set operations",
        "lattices",
        "binary variables"
      ]
    },
    "motivation": "<p>You already combine conditions: a filter might keep rows where age is high and country is allowed, or where a trusted flag is true. Boolean algebra is the arithmetic of those conditions.</p><p>It matters because logic grows quickly. Algebraic laws let us simplify predicates, reason about circuits, and make model rules easier to audit.</p>",
    "definition": "<p>Boolean algebra uses values $0$ and $1$ or false and true, with operations AND ($\\land$), OR ($\\lor$), and NOT ($\\neg$). Key laws include identity, commutativity, associativity, distributivity, and complements such as $x\\land\\neg x=0$ and $x\\lor\\neg x=1$.</p><p>De Morgan's laws say $\\neg(x\\land y)=\\neg x\\lor\\neg y$ and $\\neg(x\\lor y)=\\neg x\\land\\neg y$. They follow from checking the four possible truth assignments for $x,y$; in every row, both sides match.</p><p><b>Assumptions that matter:</b> variables are Boolean unless stated otherwise; AND binds like intersection, OR like union, and NOT like complement; and simplification must preserve the truth value for every assignment.</p>",
    "worked": {
      "problem": "Simplify $x\\land(y\\lor\\neg y)$.",
      "skills": [
        "Boolean laws",
        "complements",
        "identity law"
      ],
      "strategy": "Use the complement law inside the parentheses, then the identity law for AND.",
      "steps": [
        {
          "do": "Identify the inner expression",
          "result": "$y\\lor\\neg y$",
          "why": "a variable or its negation is always true"
        },
        {
          "do": "Apply the complement law",
          "result": "$y\\lor\\neg y=1$",
          "why": "one of $y$ or not $y$ must hold"
        },
        {
          "do": "Substitute",
          "result": "$x\\land1$",
          "why": "replace the inner expression"
        },
        {
          "do": "Apply the identity law",
          "result": "$x\\land1=x$",
          "why": "AND with true leaves a value unchanged"
        },
        {
          "do": "State the simplified form",
          "result": "$x$",
          "why": "the condition depends only on $x$"
        }
      ],
      "verify": "If $x=0$, the original is false; if $x=1$, the original is true, no matter what $y$ is.",
      "answer": "The expression simplifies to $x$.",
      "connects": "Boolean algebra removes irrelevant logical clutter while preserving every truth assignment."
    },
    "practice": [
      {
        "problem": "Simplify $x\\lor(x\\land y)$.",
        "steps": [
          {
            "do": "Factor using distributivity",
            "result": "$x\\lor(x\\land y)=(x\\land1)\\lor(x\\land y)$",
            "why": "write $x$ as $x\\land1$"
          },
          {
            "do": "Factor out $x$",
            "result": "$x\\land(1\\lor y)$",
            "why": "reverse distributivity"
          },
          {
            "do": "Simplify inside",
            "result": "$1\\lor y=1$",
            "why": "true OR anything is true"
          },
          {
            "do": "Apply identity",
            "result": "$x\\land1=x$",
            "why": "AND with true leaves $x$"
          },
          {
            "do": "Name the law",
            "result": "absorption",
            "why": "the larger condition absorbs the smaller one"
          }
        ],
        "answer": "$x\\lor(x\\land y)=x$."
      },
      {
        "problem": "Use De Morgan's law to rewrite $\\neg(a\\lor b)$.",
        "steps": [
          {
            "do": "Identify the form",
            "result": "$\\neg(a\\lor b)$",
            "why": "NOT of an OR"
          },
          {
            "do": "Apply De Morgan",
            "result": "$\\neg a\\land\\neg b$",
            "why": "to make an OR false, both parts must be false"
          },
          {
            "do": "Check row $a=0,b=0$",
            "result": "both sides are true",
            "why": "only row where neither is true"
          },
          {
            "do": "Check a row with $a=1$",
            "result": "both sides are false",
            "why": "the OR is true, so its negation is false"
          },
          {
            "do": "State rewrite",
            "result": "$\\neg(a\\lor b)=\\neg a\\land\\neg b$",
            "why": "law confirmed"
          }
        ],
        "answer": "$\\neg(a\\lor b)=\\neg a\\land\\neg b$."
      },
      {
        "problem": "Simplify $(x\\land y)\\lor(x\\land\\neg y)$.",
        "steps": [
          {
            "do": "Factor out $x$",
            "result": "$x\\land(y\\lor\\neg y)$",
            "why": "distributivity"
          },
          {
            "do": "Apply complement",
            "result": "$y\\lor\\neg y=1$",
            "why": "one of the pair is true"
          },
          {
            "do": "Substitute",
            "result": "$x\\land1$",
            "why": "replace the parenthesis"
          },
          {
            "do": "Apply identity",
            "result": "$x$",
            "why": "AND with true"
          },
          {
            "do": "Interpret",
            "result": "whether $y$ is true or false, $x$ is required",
            "why": "the condition depends only on $x$"
          }
        ],
        "answer": "The expression simplifies to $x$."
      },
      {
        "problem": "Make a truth table for $x\\oplus y$ defined as $(x\\land\\neg y)\\lor(\\neg x\\land y)$.",
        "steps": [
          {
            "do": "Evaluate $x=0,y=0$",
            "result": "0",
            "why": "neither exactly-one case holds"
          },
          {
            "do": "Evaluate $x=0,y=1$",
            "result": "1",
            "why": "the second term holds"
          },
          {
            "do": "Evaluate $x=1,y=0$",
            "result": "1",
            "why": "the first term holds"
          },
          {
            "do": "Evaluate $x=1,y=1$",
            "result": "0",
            "why": "both exactly-one terms fail"
          },
          {
            "do": "State pattern",
            "result": "true exactly when inputs differ",
            "why": "this is XOR"
          }
        ],
        "answer": "The truth values are 0, 1, 1, 0 for 00, 01, 10, 11."
      },
      {
        "problem": "A rule triggers when $(A\\lor B)\\land\\neg B$ is true. Simplify and interpret it.",
        "steps": [
          {
            "do": "Distribute AND over OR",
            "result": "$(A\\land\\neg B)\\lor(B\\land\\neg B)$",
            "why": "split the condition"
          },
          {
            "do": "Apply complement to second term",
            "result": "$B\\land\\neg B=0$",
            "why": "cannot both hold"
          },
          {
            "do": "Substitute",
            "result": "$(A\\land\\neg B)\\lor0$",
            "why": "remove impossible case"
          },
          {
            "do": "Apply identity for OR",
            "result": "$A\\land\\neg B$",
            "why": "OR with false changes nothing"
          },
          {
            "do": "Interpret",
            "result": "A is true and B is false",
            "why": "the trigger is stricter than $A\\lor B$"
          }
        ],
        "answer": "The rule simplifies to $A\\land\\neg B$."
      }
    ],
    "applications": [
      {
        "title": "Feature filters",
        "background": "Data pipelines combine Boolean predicates to include or exclude rows. Simplification reduces redundant checks.",
        "numbers": "Rule $age\\_ok\\land(country\\_ok\\lor\\neg country\\_ok)$ simplifies to $age\\_ok$."
      },
      {
        "title": "Decision trees",
        "background": "Each path in a decision tree is a conjunction of tests. Boolean algebra can detect impossible or redundant paths.",
        "numbers": "A path containing $x>5$ and not $x>5$ has form $p\\land\\neg p=0$, so it covers 0 rows."
      },
      {
        "title": "Circuit design",
        "background": "Digital circuits implement Boolean expressions. Fewer gates mean lower cost and delay.",
        "numbers": "Expression $(x\\land y)\\lor(x\\land\\neg y)$ uses two ANDs and one OR before simplifying to just wire $x$."
      },
      {
        "title": "Search query logic",
        "background": "Search systems parse AND, OR, and NOT. De Morgan's laws help rewrite excluded conditions.",
        "numbers": "NOT(red OR blue) equals NOT red AND NOT blue, so two exclusions replace one grouped exclusion."
      },
      {
        "title": "Access control",
        "background": "Permissions are Boolean combinations of roles and resource flags. Simplification improves audits.",
        "numbers": "$(admin\\lor owner)\\land\\neg admin$ simplifies to $owner\\land\\neg admin$."
      },
      {
        "title": "Binary indicators in ML",
        "background": "Boolean features often become 0/1 variables. Logical relations can remove duplicate features.",
        "numbers": "If feature $z=x\\land1$, then $z=x$, so storing both adds no information."
      }
    ],
    "applicationsClose": "Boolean algebra is logic with a calculator: every simplification is valid only if it preserves all possible truth assignments.",
    "takeaways": [
      "Boolean values use AND, OR, and NOT as algebraic operations.",
      "Complement laws give $x\\land\\neg x=0$ and $x\\lor\\neg x=1$.",
      "De Morgan's laws move NOT across AND and OR by switching the operation.",
      "Absorption and distributivity simplify redundant rules and circuits."
    ]
  },
  "math-14-23": {
    "id": "math-14-23",
    "title": "Counting, complexity, and Big-O",
    "tagline": "Big-O uses counting to describe how work grows, which is the practical heartbeat of scalable ML systems.",
    "connections": {
      "buildsOn": [
        "Counting basics",
        "Recurrence relations",
        "Combinatorial identities"
      ],
      "leadsTo": [
        "algorithm analysis",
        "scalable ML",
        "randomized methods"
      ],
      "usedWith": [
        "summations",
        "recurrences",
        "discrete probability",
        "graphs"
      ]
    },
    "motivation": "<p>You already feel the difference between checking 10 examples and checking 10 million. The exact seconds depend on hardware, but the growth pattern often decides whether an idea can run at all.</p><p><b>Big-O</b> is a language for upper-bounding growth. Counting operations, pairs, subsets, or states lets us predict when an ML pipeline will scale and when it will collapse.</p>",
    "definition": "<p>We write $f(n)=O(g(n))$ if there are constants $C>0$ and $n_0$ such that $0\\le f(n)\\le Cg(n)$ for all $n\\ge n_0$. The function $n$ usually measures input size, such as examples, features, tokens, or graph nodes.</p><p>The definition ignores constant factors and lower-order terms because it studies eventual growth. For example, $3n^2+10n+5=O(n^2)$ since for $n\\ge1$, $3n^2+10n+5\\le18n^2$.</p><p><b>Assumptions that matter:</b> Big-O is an upper bound, not an exact runtime; the variable $n$ must be stated; constants can matter in real systems even when asymptotics hide them; and different resources such as time, memory, and communication may have different bounds.</p>",
    "worked": {
      "problem": "An ML validation job compares every pair of $n=5000$ embeddings once, and each cosine comparison costs $d=128$ multiply-adds. Estimate the operation count and Big-O in $n$ and $d$.",
      "skills": [
        "pair counting",
        "operation counting",
        "Big-O"
      ],
      "strategy": "The obstacle is the pair count — count unordered pairs, then multiply by the vector dimension.",
      "steps": [
        {
          "do": "Count unordered pairs",
          "result": "$\\binom{5000}{2}$",
          "why": "each pair is compared once"
        },
        {
          "do": "Expand the binomial coefficient",
          "result": "$5000\\cdot4999/2$",
          "why": "use $\\binom n2=n(n-1)/2$"
        },
        {
          "do": "Compute pairs",
          "result": "$12,497,500$",
          "why": "half of $24,995,000$"
        },
        {
          "do": "Multiply by dimension",
          "result": "$12,497,500\\cdot128$",
          "why": "each comparison uses 128 multiply-adds"
        },
        {
          "do": "Compute operations",
          "result": "$1,599,680,000$",
          "why": "about 1.6 billion multiply-adds"
        },
        {
          "do": "State Big-O",
          "result": "$O(n^2d)$",
          "why": "pair count grows quadratically and each pair costs $d$"
        }
      ],
      "verify": "The pair count is roughly $5000^2/2=12.5$ million, so the billion-scale operation estimate is reasonable.",
      "answer": "About $1.60$ billion multiply-adds; asymptotic cost $O(n^2d)$.",
      "connects": "Counting the objects being processed is the first step toward a meaningful complexity bound."
    },
    "practice": [
      {
        "problem": "Show that $7n+20=O(n)$.",
        "steps": [
          {
            "do": "Choose a threshold",
            "result": "$n\\ge1$",
            "why": "keep the algebra simple"
          },
          {
            "do": "Bound the constant term",
            "result": "$20\\le20n$",
            "why": "true when $n\\ge1$"
          },
          {
            "do": "Combine terms",
            "result": "$7n+20\\le27n$",
            "why": "replace 20 by 20n"
          },
          {
            "do": "Choose the Big-O constant",
            "result": "$C=27$",
            "why": "matches the definition"
          },
          {
            "do": "State the result",
            "result": "$7n+20=O(n)$",
            "why": "for all $n\\ge1$"
          }
        ],
        "answer": "$7n+20=O(n)$."
      },
      {
        "problem": "Count loop iterations for nested loops: for each $i=1$ to $n$, for each $j=1$ to $n$, do one operation.",
        "steps": [
          {
            "do": "Count inner iterations for one $i$",
            "result": "$n$",
            "why": "the $j$ loop runs $n$ times"
          },
          {
            "do": "Count outer iterations",
            "result": "$n$",
            "why": "there are $n$ choices of $i$"
          },
          {
            "do": "Multiply",
            "result": "$n\\cdot n=n^2$",
            "why": "independent nested loops multiply"
          },
          {
            "do": "State exact count",
            "result": "$n^2$ operations",
            "why": "one operation per pair"
          },
          {
            "do": "State Big-O",
            "result": "$O(n^2)$",
            "why": "exact quadratic count"
          }
        ],
        "answer": "The loop does $n^2$ operations, so it is $O(n^2)$."
      },
      {
        "problem": "A dataset has $n=100000$ examples and $d=50$ features. A linear scan computes one score using all features for each example. Count multiply-adds and Big-O.",
        "steps": [
          {
            "do": "Count work per example",
            "result": "$d=50$",
            "why": "one multiply-add per feature"
          },
          {
            "do": "Count examples",
            "result": "$n=100000$",
            "why": "scan all rows"
          },
          {
            "do": "Multiply",
            "result": "$100000\\cdot50=5,000,000$",
            "why": "total feature operations"
          },
          {
            "do": "Write symbolic cost",
            "result": "$nd$",
            "why": "examples times features"
          },
          {
            "do": "State Big-O",
            "result": "$O(nd)$",
            "why": "linear in both examples and features"
          }
        ],
        "answer": "The scan uses about $5,000,000$ multiply-adds and costs $O(nd)$."
      },
      {
        "problem": "Compare checking all feature subsets for $d=20$ features with checking all single features.",
        "steps": [
          {
            "do": "Count all subsets",
            "result": "$2^{20}$",
            "why": "each feature is included or excluded"
          },
          {
            "do": "Compute $2^{20}$",
            "result": "$1,048,576$",
            "why": "standard power of two"
          },
          {
            "do": "Count single features",
            "result": "$20$",
            "why": "choose one feature"
          },
          {
            "do": "Compute ratio",
            "result": "$1,048,576/20\\approx52,429$",
            "why": "exhaustive subset search is far larger"
          },
          {
            "do": "State growth",
            "result": "all subsets are $O(2^d)$, singles are $O(d)$",
            "why": "exponential versus linear"
          }
        ],
        "answer": "All subsets: $1,048,576$; singles: $20$; the growth is $O(2^d)$ versus $O(d)$."
      },
      {
        "problem": "A transformer attention layer forms all token-token scores for sequence length $L=1024$ with head dimension $d=64$. Count score multiply-adds and give Big-O.",
        "steps": [
          {
            "do": "Count token pairs",
            "result": "$L^2=1024^2$",
            "why": "attention scores every query-key pair"
          },
          {
            "do": "Compute pairs",
            "result": "$1,048,576$",
            "why": "square of 1024"
          },
          {
            "do": "Multiply by head dimension",
            "result": "$1,048,576\\cdot64$",
            "why": "dot product length is 64"
          },
          {
            "do": "Compute operations",
            "result": "$67,108,864$",
            "why": "about 67 million multiply-adds"
          },
          {
            "do": "State Big-O",
            "result": "$O(L^2d)$",
            "why": "quadratic in sequence length"
          }
        ],
        "answer": "About $67.1$ million multiply-adds; attention score cost is $O(L^2d)$."
      }
    ],
    "applications": [
      {
        "title": "Linear model inference",
        "background": "A linear model scores each example by a dot product. Counting features gives the cost.",
        "numbers": "For $n=1,000,000$ examples and $d=100$ features, inference uses $100,000,000$ multiply-adds, or $O(nd)$."
      },
      {
        "title": "Pairwise retrieval evaluation",
        "background": "Evaluating all query-document pairs can become quadratic or bilinear. Counting pairs warns before launching.",
        "numbers": "10,000 queries against 50,000 documents gives $5\\times10^8$ scores."
      },
      {
        "title": "Transformer attention",
        "background": "Self-attention compares every token with every token. This is why long contexts are expensive.",
        "numbers": "For $L=4096$ and $d=128$, score work is $4096^2\\cdot128=2,147,483,648$ multiply-adds."
      },
      {
        "title": "Hyperparameter grid search",
        "background": "Grid search multiplies choices across parameters. Combinatorics gives total trials.",
        "numbers": "Learning rates 5 choices, batch sizes 4, depths 6 gives $5\\cdot4\\cdot6=120$ runs."
      },
      {
        "title": "Feature subset explosion",
        "background": "Trying every feature subset is usually infeasible because the count is exponential.",
        "numbers": "With 30 features, subsets total $2^{30}=1,073,741,824$."
      },
      {
        "title": "Mini-batch training epochs",
        "background": "Epoch cost is often examples times per-example model cost. Big-O separates scalable pieces.",
        "numbers": "If one example costs 20,000 operations and an epoch has 200,000 examples, the epoch costs $4\\times10^9$ operations."
      }
    ],
    "applicationsClose": "Big-O is not a stopwatch, but it is a compass: counting the work tells you which ML designs can survive scale.",
    "takeaways": [
      "Big-O gives an eventual upper bound after constants and lower-order terms are controlled.",
      "Always say what $n$ measures: examples, features, tokens, nodes, or something else.",
      "Loops, pairs, subsets, and recurrences are common sources of complexity counts.",
      "In ML, $O(nd)$, $O(n^2d)$, and $O(2^d)$ describe very different scaling realities."
    ]
  }
};
