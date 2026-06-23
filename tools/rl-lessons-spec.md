# Authoring a "Reinforcement Learning" lesson

You write ONE self-contained file `lessons/concept-<id>.js` for one Reinforcement Learning
concept. This module is a FULL CURRICULUM meant to teach RL from scratch — so be DETAILED and
RIGOROUS: real math (the Bellman equations, returns, the policy-gradient theorem, TD updates
are first-class here), clear intuition, and runnable code. Same lesson structure as the other
technique lessons.

Read first:
- `lessons/04-ai.js` → the existing `ai-mdp` / `ai-value-iteration` / `ai-q-learning` lessons (RL
  basics already in the app — CROSS-LINK these, don't duplicate; go deeper).
- `lessons/10-modern-b.js` → `mod-dqn` / `mod-policy-gradient` / `mod-actor-critic` (deep-RL lessons
  already in the app — cross-link and extend).
- `lessons/codeviz-04-ai.js` and `codeviz-10-modern-b.js` → CODEVIZ chart shapes: line
  `series:[{name,color,points:[[x,y]]}]`; bars `{type:"bars",labels,values,valueLabels,colors}`;
  heatmap for value grids; scatter `groups:[{name,color,points}]`.

## File skeleton
```
(function () {
  window.LESSONS.push({
    id: "<ID>", title: "<TITLE>", tagline: "<one plain sentence>",
    module: "Reinforcement Learning",
    prereqs: [<existing ids you VERIFY by grepping window.LESSONS; e.g. ai-mdp, ai-value-iteration,
              ai-q-learning, aix-monte-carlo, aix-sarsa-td, mod-dqn, mod-policy-gradient,
              mod-actor-critic, prob-expectation, fnd-gradient, sibling rl-* ids; [] if unsure>],
    whenToUse: `...`,     // when this method/idea fits vs the alternatives in RL
    application: `...`,   // where it's used (games, robotics, control, recommendation, RLHF...)
    pitfalls: `...`,      // <ul> of the classic failure modes + the fix
    bigIdea: `...`, buildup: `...`,
    symbols: [ { sym:"$...$", desc:"plain-English meaning" }, ... ],   // define EVERY symbol — RL is notation-heavy
    formula: `$$ ... $$`, whatItDoes: `...`,   // the key equation(s): Bellman, return, TD update, PG theorem...
    derivation: `...`,    // DERIVE / justify it — this is a learning curriculum, show why it's true
    example: `...`,       // a tiny concrete worked example with real numbers (a 2-4 state MDP, a gridworld step)
    demo: function (host) { ... },   // OPTIONAL theme-aware canvas/Charts demo
    practice: [ { q:`...`, steps:[{do:`...`, why:`...`}], answer:`...` }, ... ]
  });
  window.CODE["<ID>"] = {
    lib: "<gymnasium + numpy / PyTorch — what fits>",
    runnable: false,        // in-browser engine has no gym/torch; THIS CODE RUNS IN COLAB
    explain: `<p>...frames the code; note Colab: !pip install gymnasium...</p>`,
    code: `<real, runnable RL code: tabular numpy on a small env, or gymnasium + PyTorch for deep RL>`
  };
  window.CODEVIZ["<ID>"] = {
    question: "...",
    charts: [ { type:"line|bars|heatmap|scatter", title, xlabel, ylabel, <...> } ],
    caption: "...",
    code: `<Python that COMPUTES the plotted numbers — numpy ONLY, a tiny self-contained MDP/gridworld you implement>`
  };
})();
```

## Page render order: title/tagline → whenToUse → (where used) → CODE → CODEVIZ → pitfalls →
## "Under the hood" (bigIdea, buildup, symbols, formula, derivation, example — the MATH, always visible) → demo → practice.

## Code rules — TWO TRACKS
- `CODE.code` = REAL, runnable RL code. For TABULAR methods (DP, MC, TD, SARSA, Q-learning, exploration)
  implement them in numpy on a SMALL environment (a hand-built gridworld, or `gymnasium`'s FrozenLake/Taxi/
  CliffWalking — `!pip install gymnasium`). For DEEP RL (DQN, policy gradient, actor-critic, PPO, continuous
  control) use `gymnasium` (e.g. CartPole/LunarLander/Pendulum) + PyTorch, or reference `stable-baselines3`.
  Runs in Colab. `runnable:false`.
- `CODEVIZ.code` = a SMALL self-contained numpy computation (a tiny MDP/gridworld you build inline — NO gym
  needed) that produces real plotted numbers. RUN it to embed real numbers. Great RL charts:
  * value iteration / policy iteration CONVERGENCE: line of max value-change per sweep (→ 0), or a heatmap of V over the grid;
  * Q-learning / SARSA LEARNING CURVE: line of return-per-episode rising over training;
  * MC vs TD: variance/bias of value estimates over episodes;
  * exploration: cumulative regret of epsilon-greedy vs UCB vs greedy on a bandit;
  * SARSA vs Q-learning on CliffWalking: the safe vs optimal path return;
  * discount gamma: how V or the optimal policy changes with gamma.
  Subsample to <= 60 plotted points; numbers must be real outputs of the code.

## HARD CONVENTIONS
1. Teaching fields are HTML — `<p>`, `<b>`, `<i>`, `<ul>/<ol><li>`, `<code>`. Short, plain sentences,
   but DON'T skimp on the math — define every symbol and show the key derivation.
2. Math in `$...$`/`$$...$$`; inside JS strings DOUBLE every backslash (`\\gamma`, `\\pi`, `\\sum`, `\\max`,
   `\\nabla`, `\\mathbb{E}`, `\\leftarrow`, `\\alpha`). NEVER an HTML entity inside `$...$` — use `\\lt`/`\\gt`.
3. NEVER a raw "<" before a letter/number in prose — write `&lt;`. ">" is fine.
4. Expand every abbreviation on first use — "MDP (Markov Decision Process)", "TD (Temporal Difference)",
   "DQN (Deep Q-Network)", "PPO (Proximal Policy Optimization)", "RLHF (Reinforcement Learning from Human Feedback)".
5. Run `node --check lessons/concept-<id>.js` and fix any error.

Report: lesson id, the RL concept, the key equation(s), what CODE runs, the CODEVIZ illustration, node --check result.
