# Lesson Plan — 01 Probability: Models, Axioms, Conditioning & Counting

| Field | Value |
|---|---|
| Source | Probability (MIT) |
| Content category | Formula/Concept |
| Example type | 🧮 Numeric |
| Colab notebook | No |
| Est. lesson time | 35–50 min |
| Source topic file | ../01-probability-foundations.md |

## Part 1 — Overview (plan)
Build probability from the ground up: choose a sample space, assign probabilities that obey the axioms, then compute events by conditioning, Bayes' rule, independence, and counting. Hook: the same real situation can look easy or impossible depending on whether the sample space has the right granularity.

## Part 2 — Key Idea (plan)
- **Focus (per category = Formula/Concept):** precise vocabulary + core formulas; show how axioms imply useful rules and how counting converts uniform finite models into probabilities.
- **Core artifacts to present:** sample space $\Omega$; event $A\subseteq\Omega$; axioms $\mathbb{P}(A)\ge 0$, $\mathbb{P}(\Omega)=1$, additivity; complement/union rules; conditional probability $\mathbb{P}(A\mid B)=\mathbb{P}(A\cap B)/\mathbb{P}(B)$; multiplication rule; total probability; Bayes' rule; independence $\mathbb{P}(A\cap B)=\mathbb{P}(A)\mathbb{P}(B)$; conditional independence; permutations $n!$, combinations $\binom nk$, partitions $\binom{n}{n_1,\ldots,n_r}$.

## Part 3 — Worked Examples

### 🟡 Easy (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| E1 | Build a valid finite probability model | $\Omega=\{1,2,3,4\}$ with proposed masses $(0.1,0.2,0.3,0.4)$; event $A=\{2,4\}$ | Check nonnegativity + normalization, compute $\mathbb{P}(A)$ and $\mathbb{P}(A^c)$ from additivity. |
| E2 | Two-dice event by uniform counting | Two fair dice; $A=$ "sum is 7"; $B=$ "first die is 4" | Choose ordered-pair sample space of size 36; count $|A|$, $|B|$, $|A\cap B|$; compute probabilities. |
| E3 | Inclusion–exclusion for overlapping events | $\mathbb{P}(A)=0.55$, $\mathbb{P}(B)=0.40$, $\mathbb{P}(A\cap B)=0.20$ | Derive $\mathbb{P}(A\cup B)$ and $\mathbb{P}(A^c\cap B)$ using union and complement rules. |
| E4 | Conditional probability from a card deck | Standard 52-card deck; $A=$ ace, $B=$ spade | Compute $\mathbb{P}(A\mid B)$, $\mathbb{P}(B\mid A)$, and explain why conditioning changes the denominator. |
| E5 | Basic combinations without replacement | Draw 5 cards from 52; event = exactly 2 hearts | Count favorable hands with $\binom{13}{2}\binom{39}{3}$ and total hands $\binom{52}{5}$. |

### 🔴 Advanced (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| A1 | Bayes' rule with rare positives | Disease prevalence $0.01$; sensitivity $0.95$; false-positive rate $0.04$ | Use total probability for positive tests and Bayes' rule for $\mathbb{P}(\text{disease}\mid +)$; highlight base-rate effect. |
| A2 | Sequential conditioning with the multiplication rule | Urn has 5 red, 3 blue, 2 green; draw 3 without replacement; event sequence red→red→blue | Derive joint probability as $\mathbb{P}(R_1)\mathbb{P}(R_2\mid R_1)\mathbb{P}(B_3\mid R_1\cap R_2)$. |
| A3 | Independence vs conditional independence | Two independent fair coins; $A=$ first coin heads, $B=$ second coin heads, $C=$ exactly one head | Show $A$ and $B$ independent unconditionally but not independent given $C$ by computing product and intersection probabilities. |
| A4 | Partitions and total probability | Factory has lines $L_1,L_2,L_3$ producing $(50\%,30\%,20\%)$ with defect rates $(1\%,3\%,5\%)$ | Compute $\mathbb{P}(D)$ from a partition and posterior line probabilities $\mathbb{P}(L_i\mid D)$. |
| A5 | Multinomial counting for grouped assignments | 10 distinct tasks assigned to teams A/B/C with counts $(4,3,3)$; event = Alice's task goes to A | Count total partitions $10!/(4!3!3!)$, favorable partitions after fixing Alice, and probability; connect to symmetry. |

## Part 4 — Colab Notebook (omit if 🧮)
N/A — 🧮 numeric topic (no notebook).
