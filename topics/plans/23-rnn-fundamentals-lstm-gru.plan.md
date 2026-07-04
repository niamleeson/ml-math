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

### 🟢 Easy (5)
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
- **Notebook file:** topics/notebooks/23-rnn-fundamentals-lstm-gru.ipynb
- **Est. cell count:** ~82 (⚖️ topic → E1–E3 hand derivations in lesson plus coded sequence/gate visualizations)
- **Key libraries:** numpy, matplotlib, pandas, tensorflow/keras or torch, scikit-learn, seaborn, ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** synthetic long copy task in A1/A2 — vanilla RNN loses long-range information while LSTM preserves it through gates.
- **Signature visualizations:** unrolled RNN graph; LSTM/GRU gate activations over time; generated text samples with sequence prediction plots.
