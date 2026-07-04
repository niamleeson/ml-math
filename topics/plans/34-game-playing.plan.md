# Lesson Plan — 34 Game Playing: Minimax & Games

| Field | Value |
|---|---|
| Source | CS 221 |
| Content category | Method/Algorithm |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 50–65 min |
| Source topic file | ../34-game-playing.md |

## Part 1 — Overview (plan)
Game playing plans against other agents, so values depend on what the opponent will do next. Hook: the same position can have a different best move under a random opponent, a perfect adversary, or a simultaneous strategic opponent.

## Part 2 — Key Idea (plan)
- **Focus (per category = Method/Algorithm):** step-by-step recursive algorithms for expectimax, minimax, alpha-beta pruning, depth-limited search with evaluation functions, and simultaneous-game reasoning.
- **Core artifacts to present:** two-player zero-sum game definition $(s_{\text{start}}, \operatorname{Actions}, \operatorname{Succ}, \operatorname{IsEnd}, \operatorname{Utility}, \operatorname{Player})$; deterministic vs. stochastic policies; expectimax recurrence; minimax recurrence; properties of $\pi_{\max}$ and $\pi_{\min}$; alpha-beta $\alpha,\beta$ bounds and prune condition; evaluation function $\operatorname{Eval}(s)$ for depth limits; TD value update for game evaluation; payoff matrix; pure and mixed strategies; minimax theorem; Nash equilibrium inequalities for non-zero-sum games.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand propagate a depth-2 minimax tree | 8-leaf utility tree from the source figure | game tree with leaf utilities, min/max node values, and best branch highlighted | ~5 |
| E2 | Hand compute expectimax against a fixed random opponent | same tree with opponent probabilities | game tree with expected values at opponent/chance nodes | ~5 |
| E3 | Alpha-beta pruning by hand | ordered depth-3 minimax tree | tree values propagating up with pruned branches grayed and $\alpha,\beta$ annotations | ~6 |
| E4 | One payoff matrix and a pure-strategy Nash check | 2x2 non-zero-sum matrix | payoff table with best responses circled; Nash cell highlighted | ~4 |
| E5 | Coded minimax for tic-tac-toe endgames | `tic_tac_toe_near_end` positions | process: small game tree expansion; result: best move highlighted on the board | ~8 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Failure/edge: minimax blowup without pruning | synthetic branching-factor/depth game trees | process: node-count curve by depth; result: plain minimax vs. alpha-beta explored-node bars | ~8 |
| A2 | Move ordering makes alpha-beta powerful | same random utility trees with good/bad move orders | process: pruned branches grayed in two side-by-side trees; result: explored-node ratio | ~10 |
| A3 | Depth-limited search with an evaluation function | connect-four-style mini board | process: frontier states scored by $\operatorname{Eval}(s)$; result: selected move vs. full-depth oracle on small cases | ~12 |
| A4 | Minimax can be too pessimistic against a non-adversarial opponent | simple dice/choice game with known opponent policy | process: minimax and expectimax values propagated on the same tree; result: different best moves highlighted | ~9 |
| A5 | Mixed strategies and zero-sum matrix games | matching-pennies / rock-paper-scissors payoff matrix | process: expected-value surface over mixed strategies; result: minimax mixed equilibrium marked | ~9 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/34-game-playing.ipynb
- **Est. cell count:** ~112 (⚖️ topic → hand tree/payoff derivations in lesson plus coded game-tree and board-game visualizations)
- **Key libraries:** numpy, matplotlib, networkx, pandas, ipywidgets, functools (`lru_cache`)
- **Runtime:** CPU
- **Failure/edge dataset included:** `branching_blowup_trees` in A1 — plain minimax expands exponentially many nodes as depth grows; alpha-beta with good ordering returns the same value while pruning large subtrees.
- **Signature visualizations:** game tree values propagating upward; alpha-beta pruned branches grayed; best move highlighted on a board/payoff matrix.
