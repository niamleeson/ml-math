# Lesson Plan — 36 Bayesian Networks & Inference

| Field | Value |
|---|---|
| Source | CS 221 |
| Content category | Concept+Method |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 45–60 min |
| Source topic file | ../36-bayesian-networks.md |

## Part 1 — Overview (plan)
Bayesian networks represent a joint distribution compactly using a DAG and local CPTs, then answer
"what is likely given evidence?" queries. Hook: evidence can both increase and decrease beliefs through
conditional independence and explaining away.

## Part 2 — Key Idea (plan)
- **Focus (per category = Concept+Method):** introduce the vocabulary and structure of Bayesian networks
  (DAG, parents, CPTs, local normalization, factorization, conditional independence), then give step-by-step
  inference procedures for exact and approximate queries.
- **Core artifacts to present:** BN factorization
  $P(x_1,\ldots,x_n)=\prod_i p(x_i\mid x_{\operatorname{Parents}(i)})$; local-normalization constraint
  $\sum_{x_i}p(x_i\mid x_{\operatorname{Parents}(i)})=1$; explaining-away collider $C_1\to E\leftarrow C_2$;
  probabilistic-program sketches for Markov models, HMMs, naive Bayes, and LDA; generic inference pipeline
  (prune non-ancestors → factor graph → condition evidence → remove disconnected nodes → infer); variable
  elimination sum-product step; forward-backward recurrences; Gibbs update; particle filtering proposal,
  weighting, resampling; MLE objective and Laplace-smoothed CPT counts.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Look up one CPT entry | binary `Disease → Fever` CPT | CPT table cell highlighted for `P(Fever=1 | Disease=1)` | ~2 |
| B2 | Multiply two factors for one assignment | toy BN factors `P(D)` and `P(Fever|D)` with `D=1,Fever=1` | printed factor values and product | ~2 |
| B3 | Normalize a two-value posterior row | toy unnormalized weights `[0.18, 0.02]` | two-bar normalized distribution | ~2 |
| B4 | Sum out one variable from a tiny factor | toy factor `f(A,B)` | marginal bar chart over `A` | ~3 |
| B5 | Compute one 3-node joint probability by the chain rule | medical `D→F,C` CPT entries | local-factor/product bar chart | ~3 |
| B6 | Compute one conditional probability ratio | toy `P(A,B)` and `P(B)` scalars | numerator/denominator/ratio bars | ~2 |
| B7 | Do one Gibbs resample from local weights | two unnormalized local weights | Gibbs conditional bar chart | ~3 |
| B8 | Slice one factor to match evidence | toy factor `f(A,B)` with evidence `B=1` | evidence-consistent factor bars | ~3 |
| B9 | Check one structural independence in a chain | chain `A→B→C` with `B` observed | blocked-chain diagram | ~3 |
| B10 | Compute one expected count for MLE | old count plus fractional responsibility | old/responsibility/new count bars | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand-compute a 3-node medical posterior | Pen-and-paper BN: Disease $D\to Fever F$, $D\to Cough C$ with binary CPTs | Lesson text: tiny DAG and posterior table for $P(D\mid F{=}1,C{=}1)$ | ~4 |
| E2 | Read conditional independence from a chain | Synthetic chain $A\to B\to C$ | Notebook: DAG with highlighted blocked/unblocked path; posterior bars before/after conditioning on $B$ | ~4 |
| E3 | Explaining away in a collider | Burglary $B$ and Earthquake $E$ causing Alarm $A$ | Notebook: collider DAG; bar charts for $P(E)$, $P(E\mid A)$, $P(E\mid A,B)$ | ~5 |
| E4 | Convert local CPTs into a joint probability | Small Sprinkler/Rain/WetGrass BN | Notebook: DAG with CPT panels; heatmap/table of selected joint assignments | ~4 |
| E5 | One variable-elimination step by hand | 3-node BN $A\to B$, $A\to C$ querying $P(B\mid C{=}1)$ | Lesson text: factor table before and after summing out $A$ | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Variable elimination with ordering cost | 5-node student-style BN with evidence on two leaves | Notebook: factor-size bar charts for two elimination orders; posterior bars | ~7 |
| A2 | Forward-backward smoothing in an HMM | Hidden weather states and noisy umbrella observations | Notebook: chain DAG; forward/backward message heatmaps; smoothed posterior over time | ~7 |
| A3 | Gibbs sampling convergence and burn-in | Alarm-style BN with evidence fixed | Notebook: trace plot, running posterior estimate, exact-vs-sampled posterior bars | ~8 |
| A4 | Particle filtering with weight degeneracy edge case | Object-tracking HMM with rare/highly informative observation | Notebook: particle cloud over time; effective sample size; convergence/error plot vs. exact filtering | ~8 |
| A5 | Learn CPTs with MLE and Laplace smoothing | Small categorical dataset with a zero-count parent/child combination | Notebook: raw-count table, smoothed CPT table, posterior bars showing zero-count failure fixed | ~7 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/36-bayesian-networks.ipynb
- **Est. cell count:** ~84 (⚖️ topic → 3 atomic basics plus E1/E5 hand derivations; remaining examples coded with granular build↔see loops)
- **Key libraries:** numpy, pandas, matplotlib, networkx, pgmpy (or lightweight custom factor tables if pgmpy install fails), scipy, ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** rare-observation particle-filtering sequence in A4 demonstrates weight degeneracy and sampling error; zero-count CPT data in A5 demonstrates why Laplace smoothing is needed.
- **Signature visualizations:** DAGs annotated with CPTs; posterior probability bar charts; forward/backward message heatmaps; Gibbs/particle convergence curves.
