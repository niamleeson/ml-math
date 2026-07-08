# Lesson Plan — 23 RNN Fundamentals & LSTM/GRU

| Field | Value |
|---|---|
| Source | CS 230 |
| Content category | Model |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 50–65 min |
| Source topic file | ../23-rnn-fundamentals-lstm-gru.md |

## Part 1 — Overview (plan)
RNNs process sequences by reusing the same weights over time, while GRU/LSTM gates decide what to remember,
forget, update, and reveal. Hook: "a sentence is not a bag of words — order and memory matter."

## Part 2 — Key Idea (plan)
- **Focus (per category = Model):** formulation + when to use: vanilla RNNs for short dependencies, GRU/LSTM
  for longer dependencies, bidirectional/deep variants when future context or added temporal depth is useful.
- **Core artifacts to present:** unrolled RNN diagram; shared temporal weights; equations
  $a^{<t>}=g_1(W_{aa}a^{<t-1>}+W_{ax}x^{<t>}+b_a)$ and
  $y^{<t>}=g_2(W_{ya}a^{<t>}+b_y)$; sequence loss
  $\mathcal{L}=\sum_t\mathcal{L}(\hat y^{<t>},y^{<t>})$; BPTT sum of gradients; vanishing/exploding gradients;
  gradient clipping curve; gate formula $\Gamma=\sigma(Wx^{<t>}+Ua^{<t-1>}+b)$; GRU/LSTM candidate,
  update, forget, relevance, output gate equations.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Compute one tanh RNN hidden-state update | toy scalar $x^{<t>}$, $a^{<t-1>}$, weights, and bias | printed affine value and tanh output | ~2 |
| B2 | Compute one sigmoid gate value | toy scalar gate inputs $x^{<t>}$ and $a^{<t-1>}$ | printed logit and gate value on sigmoid curve | ~2 |
| B3 | Unroll a length-3 scalar RNN | tiny numeric sequence `[1, 0, 1]` | printed timestep-by-timestep hidden states | ~3 |
| B4 | Multiply a forget gate by previous cell memory | toy vector forget gate and previous cell state | printed elementwise product | ~2 |
| B5 | Compute one GRU update-gate blend | toy scalar previous memory, candidate, and update gate | printed blend terms and new state | ~2 |
| B6 | Compute one LSTM cell-state update | toy scalar forget/update gates, old cell, and candidate | printed old-memory and new-candidate contributions | ~2 |
| B7 | Apply an LSTM output gate to cell memory | toy scalar output gate and cell state | printed tanh cell value and hidden state | ~2 |
| B8 | Clip one exploding scalar gradient | toy gradient value and clipping threshold | printed raw vs clipped gradient | ~2 |
| B9 | Count vanilla RNN parameters | toy input, hidden, and output sizes | printed parameter formula and total | ~2 |
| B10 | Compute one output probability from a hidden state | toy scalar hidden state, output weight, and bias | printed output logit and sigmoid probability | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand-unroll a vanilla RNN for 3 timesteps | tiny numeric sequence `[1, 0, 1]` | process: unrolled computation graph; result: table of $a^{<1>},a^{<2>},a^{<3>}$ and $\hat y$ | ~5 |
| E2 | Derive one GRU timestep by hand | one numeric $x^{<t>},a^{<t-1>},c^{<t-1>}$ | process: relevance/update gates; result: $\widetilde c^{<t>}$, $c^{<t>}$, $a^{<t>}$ values | ~6 |
| E3 | Derive one LSTM timestep by hand | one numeric $x^{<t>},a^{<t-1>},c^{<t-1>}$ | process: forget/update/relevance/output gate table; result: new cell and hidden state | ~7 |
| E4 | Sequence-shape "hello world" | synthetic parity / running-sum sequences | process: input→hidden→output tensor-shape diagram; result: predicted sequence vs target | ~5 |
| E5 | Gradient clipping demo | toy exploding scalar recurrence | process: raw vs clipped gradient norm curve; result: stable update trajectory | ~4 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Vanilla RNN failure on long memory | synthetic copy task | process: loss curve + gradient norms over time; result: failure on delayed dependency | ~8 |
| A2 | LSTM fixes long dependency | same synthetic copy task | process: forget/update/output gate activations over time; result: correct delayed prediction vs vanilla RNN | ~9 |
| A3 | GRU vs LSTM on text classification | small sentiment snippets / IMDB subset | process: training curves; result: accuracy + gate activation heatmaps for sample reviews | ~8 |
| A4 | Character-level text generation | tiny Shakespeare / names corpus | process: hidden-state/gate activations over time; result: generated text samples at different temperatures | ~9 |
| A5 | Bidirectional vs one-way sequence tagging | toy NER-style labeled sentences | process: forward/backward hidden-state diagram; result: token labels with future-context error analysis | ~8 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/deep-learning/23-rnn-fundamentals-lstm-gru.ipynb
- **Est. cell count:** ~94 (⚖️ topic → all 13 examples (3 basics + 5 easy + 5 advanced) with hand derivations plus coded sequence/gate visualizations)
- **Key libraries:** numpy, matplotlib, pandas, tensorflow/keras or torch, scikit-learn, seaborn, ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** synthetic long copy task in A1/A2 — vanilla RNN loses long-range information while LSTM preserves it through gates.
- **Signature visualizations:** unrolled RNN graph; LSTM/GRU gate activations over time; generated text samples with sequence prediction plots.
