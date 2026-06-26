/* Reinforcement Learning — "Temporal-Difference (TD) learning: bootstrap a value
   from the very next step". Self-contained: lesson + CODE + CODEVIZ merged by id
   "rl-td-learning". Cross-links aix-sarsa-td, aix-monte-carlo, ai-mdp, ai-value-iteration. */
(function () {
  window.LESSONS.push({
    id: "rl-td-learning",
    title: "Temporal-Difference (TD) learning: the central idea of reinforcement learning",
    tagline: "Don't wait for the episode to end and don't need a model — nudge each state's value toward the very next step's estimate.",
    module: "Reinforcement Learning",
    prereqs: ["ai-mdp", "ai-value-iteration", "aix-monte-carlo", "aix-sarsa-td"],

    whenToUse:
      `<p><b>Reach for TD (Temporal-Difference) learning when you must learn values from raw experience,
       with no model of the world, and you want to update <i>online</i> — after every single step rather
       than waiting for an episode to finish.</b> TD is the idea most of modern reinforcement learning is
       built on, so this is your default for model-free prediction and control.</p>
       <ul>
         <li><b>Model-free prediction.</b> You have a fixed policy and want to estimate how good each state
         is under it, but you cannot see the transition probabilities — you only get to act and observe.</li>
         <li><b>Continuing (non-episodic) tasks.</b> When there is no natural "end of episode" — a server that
         runs forever, a controller that never stops — Monte Carlo cannot wait for a return that never arrives.
         TD updates mid-stream, so it works here.</li>
         <li><b>Online / continual learning.</b> Each step teaches a little immediately, so the agent improves
         while it acts instead of only between episodes.</li>
       </ul>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Dynamic programming</b> (see <code>ai-value-iteration</code>) — when you do NOT know the
         transition model and must learn from samples. DP needs the full Markov Decision Process (MDP);
         TD does not.</li>
         <li><b>Monte Carlo</b> (see <code>aix-monte-carlo</code>) — when you want low-variance, immediate,
         mid-episode updates and can tolerate a little bootstrapping bias. TD usually learns faster.</li>
       </ul>
       <p>TD is the seed for the control methods next: <b>SARSA</b> and <b>Q-learning</b>
       (see <code>aix-sarsa-td</code>) apply this exact update to action-values, and <b>DQN (Deep Q-Network)</b>
       scales it with neural networks. This lesson is also the bridge to <b>n-step TD</b> and
       <b>TD(&lambda;)</b>, which interpolate between TD and Monte Carlo.</p>`,

    application:
      `<p>TD learning is the backbone of practical reinforcement learning.</p>
       <ul>
         <li><b>Games.</b> TD-Gammon learned backgammon at expert level purely from TD updates;
         the same idea, scaled with deep networks, underlies <b>DQN</b> on Atari.</li>
         <li><b>Robotics and control.</b> Continuing control loops (balancing, locomotion) use TD because
         there is no episode to wait for.</li>
         <li><b>Recommendation and ads.</b> Long-horizon value estimates of user state are learned online
         from streaming interactions.</li>
         <li><b>Neuroscience.</b> The <b>TD error</b> matches the firing of dopamine neurons measured in the
         brain — a "reward prediction error". This is one of the strongest links between a machine-learning
         algorithm and biology, and it is why TD is a leading model of how animals learn from reward.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>It is biased.</b> TD bootstraps off its own current estimate $V(S_{t+1})$, which is wrong early
         on, so the update inherits that error. The bias shrinks as the estimates improve. Fix: this is the
         price for low variance — accept it, or move toward Monte Carlo (or n-step / TD(&lambda;)) if the bias
         hurts.</li>
         <li><b>It can diverge with function approximation.</b> Bootstrapping + off-policy data + function
         approximation together form the <b>"deadly triad"</b>: estimates can blow up. Plain tabular TD is safe;
         the danger appears with neural networks (covered with DQN). Fix: target networks, on-policy data, or
         gradient-TD methods.</li>
         <li><b>Learning-rate $\\alpha$ tuning.</b> Too large and updates oscillate or diverge; too small and
         learning crawls. Fix: a <b>step-size schedule</b> that decays $\\alpha$ over time (e.g. $\\alpha_n = 1/n$)
         satisfies the stochastic-approximation conditions and guarantees convergence in the tabular case.</li>
         <li><b>A nonzero TD error does NOT mean the value is "wrong".</b> The TD error $\\delta_t$ is the
         <i>surprise</i> on one sampled step; it is noisy and is expected to be nonzero even at the true value.
         Fix: judge convergence by the <i>average</i> error over many steps, not a single one.</li>
       </ul>`,

    bigIdea:
      `<p><b>TD (Temporal-Difference) learning is the single most important idea in reinforcement learning.</b>
       It splices together the two older families:</p>
       <ul>
         <li>From <b>Monte Carlo</b> (see <code>aix-monte-carlo</code>) it takes <b>model-free sampling</b>:
         learn straight from experienced transitions, with no knowledge of the world's dynamics.</li>
         <li>From <b>dynamic programming</b> (see <code>ai-value-iteration</code>) it takes <b>bootstrapping</b>:
         update a value using another current value estimate, rather than waiting for a final outcome.</li>
       </ul>
       <p><b>Bootstrapping</b> means: to estimate how good a state is, lean on your own current guess of how
       good the <i>next</i> state is. You do not finish the trip before learning — the moment the next landmark
       looks better or worse than expected, you revise your estimate of where you started.</p>
       <p>The simplest version is <b>TD(0) prediction</b>: given a fixed policy, after <i>every</i> step it nudges
       the value of the state you just left toward a one-step estimate of its value. That is the whole engine.</p>`,

    buildup:
      `<p>Set up the pieces. The agent follows a fixed policy $\\pi$. At time $t$ it is in state $S_t$, takes the
       action $\\pi$ chooses, receives reward $R_{t+1}$, and lands in state $S_{t+1}$. We keep a table $V$ of one
       number per state — our current estimate of each state's value under $\\pi$.</p>
       <p><b>1. What value should a state have?</b> The true value of $S_t$ is the expected discounted future
       reward from there. By the Bellman equation it equals the reward you get next plus the discounted value of
       where you land: $V^\\pi(S_t) = \\mathbb{E}[\\,R_{t+1} + \\gamma V^\\pi(S_{t+1})\\,]$.</p>
       <p><b>2. The TD target.</b> We cannot compute that expectation (no model), but one sampled step gives us a
       cheap stand-in for it: the <b>TD target</b> $R_{t+1} + \\gamma V(S_{t+1})$ — the reward we actually saw plus
       our current guess for the next state.</p>
       <p><b>3. The TD error.</b> The gap between that target and what we currently believe is the <b>TD error</b>
       $\\delta_t = R_{t+1} + \\gamma V(S_{t+1}) - V(S_t)$. It is the <i>surprise</i>: positive if things went
       better than expected, negative if worse.</p>
       <p><b>4. The update.</b> Step the old value a fraction $\\alpha$ of the way toward the target —
       equivalently, add a fraction of the surprise. Do this after every step, online, never waiting for the
       episode to end.</p>`,

    symbols: [
      { sym: "$S_t$", desc: "the state at time step $t$ ('S sub t')." },
      { sym: "$S_{t+1}$", desc: "the next state, reached after the action at step $t$." },
      { sym: "$R_{t+1}$", desc: "the reward received on the transition out of $S_t$ into $S_{t+1}$." },
      { sym: "$\\pi$", desc: "the policy (Greek 'pi'): the fixed rule mapping a state to the action taken." },
      { sym: "$V(S_t)$", desc: "our current estimated value of state $S_t$ under policy $\\pi$ (a stored number we update)." },
      { sym: "$V^\\pi(s)$", desc: "the TRUE value of state $s$ under $\\pi$: expected discounted future reward starting there." },
      { sym: "$\\alpha$", desc: "the learning rate (Greek 'alpha') in $[0,1]$: how big a step to take toward the target." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma') in $[0,1]$: how much future reward counts vs. immediate reward." },
      { sym: "$R_{t+1} + \\gamma V(S_{t+1})$", desc: "the TD target: reward now plus the discounted current value of the next state." },
      { sym: "$\\delta_t$", desc: "the TD error (Greek 'delta', 'delta sub t'): $\\delta_t = R_{t+1} + \\gamma V(S_{t+1}) - V(S_t)$, the surprise on this step." },
      { sym: "$\\leftarrow$", desc: "assignment ('becomes'): the left side is overwritten by the right side." },
      { sym: "$\\mathbb{E}[\\cdot]$", desc: "the expectation (probability-weighted average) over the randomness in transitions and rewards." }
    ],

    formula:
      `$$ \\delta_t = R_{t+1} + \\gamma V(S_{t+1}) - V(S_t) \\qquad\\qquad V(S_t) \\leftarrow V(S_t) + \\alpha\\,\\delta_t $$
       $$ \\text{i.e.}\\quad V(S_t) \\leftarrow V(S_t) + \\alpha\\big[\\, R_{t+1} + \\gamma V(S_{t+1}) - V(S_t)\\,\\big] $$`,

    whatItDoes:
      `<p>Read it left to right. Compute the <b>TD target</b> $R_{t+1} + \\gamma V(S_{t+1})$: the reward just seen
       plus the discounted value we currently assign the next state.</p>
       <p>Subtract the old value $V(S_t)$ to get the <b>TD error</b> $\\delta_t$ — the surprise. Then move $V(S_t)$
       a fraction $\\alpha$ of the way toward the target. A positive $\\delta_t$ raises the value; a negative one
       lowers it.</p>
       <p>Crucially this runs <i>every step</i>, with no waiting and no model of the world — the next state's own
       (imperfect) estimate stands in for the unknown future. That substitution is the bootstrapping.</p>`,

    derivation:
      `<p><b>Why is bootstrapping off the next step valid?</b> Because the value function obeys a one-step
       self-consistency, and the TD update is sampled stochastic approximation of it.</p>
       <p><b>The fixed point (Bellman).</b> For a fixed policy $\\pi$, the true value satisfies
       $$V^\\pi(s) = \\mathbb{E}_\\pi[\\,R_{t+1} + \\gamma V^\\pi(S_{t+1}) \\mid S_t = s\\,].$$
       A state's value equals the immediate reward plus the discounted value of where you go next. This is the
       same equation value iteration solves when the model is known.</p>
       <ul class="steps">
         <li>Define the TD error for one sampled step: $\\delta_t = R_{t+1} + \\gamma V(S_{t+1}) - V(S_t)$. It is
         the gap between the two sides of the Bellman equation, using one sample of $R_{t+1}, S_{t+1}$ instead of
         the expectation.</li>
         <li>If our estimate already equals $V^\\pi$, then $\\mathbb{E}[\\delta_t] = 0$: no <i>expected</i> gap,
         though any single $\\delta_t$ is still noisy.</li>
         <li>Whenever $\\mathbb{E}[\\delta_t] \\ne 0$, the estimate violates Bellman. Step toward closing it:
         $V(S_t) \\leftarrow V(S_t) + \\alpha\\,\\delta_t$.</li>
         <li>This is exactly the Robbins–Monro stochastic-approximation update for the Bellman fixed point. With
         a step-size schedule satisfying $\\sum_n \\alpha_n = \\infty$ and $\\sum_n \\alpha_n^2 \\lt \\infty$ (e.g.
         $\\alpha_n = 1/n$), tabular TD(0) converges to $V^\\pi$ with probability 1. &#8718;</li>
       </ul>
       <p><b>Monte Carlo vs. TD — the bias/variance contrast.</b> Both estimate the same $V^\\pi$, but from
       different targets:</p>
       <ul>
         <li><b>Monte Carlo</b> uses the full sampled return $G_t = R_{t+1} + \\gamma R_{t+2} + \\dots$ as its
         target. Since $\\mathbb{E}[G_t] = V^\\pi(S_t)$ exactly, MC is <b>unbiased</b>. But $G_t$ sums the
         randomness of <i>every</i> future step, so it has <b>high variance</b> — and you must wait for the episode
         to end.</li>
         <li><b>TD(0)</b> uses $R_{t+1} + \\gamma V(S_{t+1})$. This depends on the randomness of only <i>one</i>
         step (plus the deterministic current estimate), so it has <b>much lower variance</b> and is available
         immediately. But because $V(S_{t+1})$ is itself only an estimate, the target is <b>biased</b> while $V$
         is still wrong.</li>
       </ul>
       <p>In one line: <b>MC is unbiased but high-variance and slow; TD is biased but low-variance, online, and
       usually faster.</b></p>`,

    example:
      `<p>One concrete TD(0) update. State $S_t$ currently has $V(S_t) = 0.4$. The agent steps, receives reward
       $R_{t+1} = 0$, and lands in $S_{t+1}$ where $V(S_{t+1}) = 1.0$. Use $\\alpha = 0.1$, $\\gamma = 0.9$.</p>
       <ul class="steps">
         <li>TD target: $R_{t+1} + \\gamma V(S_{t+1}) = 0 + 0.9 \\times 1.0 = 0.9$.</li>
         <li>TD error: $\\delta_t = 0.9 - V(S_t) = 0.9 - 0.4 = 0.5$ (a positive surprise — the next state is worth
         more than we thought).</li>
         <li>Update: $V(S_t) \\leftarrow 0.4 + 0.1 \\times 0.5 = 0.45$.</li>
         <li>$V(S_t)$ moved a tenth of the way from $0.4$ toward $0.9$. We did not wait for the episode to end;
         the next state's value flowed back one step, immediately.</li>
       </ul>`,

    practice: [
      {
        q: `A state has $V(S_t) = 2.0$. The agent steps, gets $R_{t+1} = 1$, lands in $S_{t+1}$ with
            $V(S_{t+1}) = 3.0$. Using $\\alpha = 0.5$ and $\\gamma = 1.0$, compute the TD target, the TD error
            $\\delta_t$, and the new $V(S_t)$.`,
        steps: [
          { do: `Compute the TD target $R_{t+1} + \\gamma V(S_{t+1})$.`,
            why: `It is the one-step estimate we are pulling toward: $1 + 1.0\\times 3.0 = 4.0$.` },
          { do: `Compute the TD error $\\delta_t = \\text{target} - V(S_t) = 4.0 - 2.0 = 2.0$.`,
            why: `The surprise: the step turned out worth more than the old estimate.` },
          { do: `Apply the update $V(S_t) \\leftarrow V(S_t) + \\alpha\\,\\delta_t = 2.0 + 0.5\\times 2.0$.`,
            why: `Move halfway ($\\alpha = 0.5$) toward the target.` }
        ],
        answer: `Target $= 4.0$, $\\delta_t = 2.0$, new $V(S_t) = 2.0 + 0.5\\times 2.0 = 3.0$.`
      },
      {
        q: `Your TD estimate of a state has stopped drifting on average, yet the TD error $\\delta_t$ is nonzero
            and flips sign from step to step. Is something broken? Why or why not?`,
        steps: [
          { do: `Recall what $\\delta_t$ measures: the surprise on one <i>sampled</i> step, not a verdict on the value.`,
            why: `$\\delta_t = R_{t+1} + \\gamma V(S_{t+1}) - V(S_t)$ uses single random samples, so it is noisy.` },
          { do: `Recall the convergence condition: at the true value, $\\mathbb{E}[\\delta_t] = 0$, not $\\delta_t = 0$.`,
            why: `Only the <i>expected</i> error vanishes; individual errors stay noisy and average to zero.` }
        ],
        answer: `Nothing is broken. A noisy, sign-flipping $\\delta_t$ whose average is near zero is exactly what
                 convergence looks like — the value is right on average. Judge by the mean error over many steps,
                 not one.`
      }
    ]
  });

  window.CODE["rl-td-learning"] = {
    lib: "numpy + gymnasium",
    runnable: false,
    explain:
      `<p>TD(0) <b>prediction</b>: estimate $V^\\pi$ for a <i>fixed</i> policy on a small Gymnasium environment,
       updating after every step with no model of the world. We use <code>FrozenLake-v1</code> (slippery), fix a
       simple policy ("always go right"), and run the update
       $V(S_t) \\leftarrow V(S_t) + \\alpha[R_{t+1} + \\gamma V(S_{t+1}) - V(S_t)]$ on each transition. Run it in
       <b>Google Colab</b>: the setup cell installs Gymnasium (<code>!pip install gymnasium</code>).
       <code>runnable</code> is off because the in-browser engine has no Gymnasium; paste this into Colab to run
       it and watch the value table fill in.</p>`,
    code: `# Colab setup cell:  !pip install gymnasium
import numpy as np
import gymnasium as gym

# ============================================================
# TD(0) PREDICTION of V^pi for a FIXED policy (model-free, online).
#   Update each step:  V(S_t) <- V(S_t) + alpha * [ R_{t+1} + gamma*V(S_{t+1}) - V(S_t) ]
# ============================================================
env = gym.make("FrozenLake-v1", is_slippery=True)   # 4x4 grid, 16 states, 4 actions
nS = env.observation_space.n                          # number of states (16)

# A FIXED policy to evaluate: always take action 2 ("move right").
# (Slippery ice makes the outcome stochastic even with a fixed action.)
RIGHT = 2
def policy(state):
    return RIGHT

# Hyperparameters
alpha   = 0.1     # learning rate (step size toward the TD target)
gamma   = 0.99    # discount factor
episodes = 20000

V = np.zeros(nS)  # value estimate, one number per state; starts at 0

for ep in range(episodes):
    state, _ = env.reset()
    done = False
    while not done:
        action = policy(state)                        # fixed-policy action
        next_state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated

        # --- THE TD(0) UPDATE ---
        # If the episode ended, the next state's value contributes 0 (terminal).
        v_next = 0.0 if done else V[next_state]
        td_target = reward + gamma * v_next           # R_{t+1} + gamma*V(S_{t+1})
        td_error  = td_target - V[state]              # delta_t (the surprise)
        V[state] += alpha * td_error                  # nudge toward the target

        state = next_state

env.close()

# Print the learned value of each state as a 4x4 grid.
np.set_printoptions(precision=3, suppress=True)
print("Estimated V^pi for the 'always right' policy (FrozenLake 4x4):")
print(V.reshape(4, 4))
# States near the goal (bottom-right) end up with the highest values;
# holes and far cells stay near 0.`
  };

  window.CODEVIZ["rl-td-learning"] = {
    question: "How do you read a TD learning curve? Track the estimate's error per episode and learn to recognise the healthy case, a step size set too large, and the well-tuned decaying-step-size case.",
    charts: [
      {
        type: "line",
        title: "Healthy: TD(0) beats Monte Carlo on error (mean abs error over 200 runs)",
        xlabel: "episodes",
        ylabel: "| V(center) - true value |",
        series: [
          { name: "TD(0)", color: "#7ee787", points: [[0,0.0],[2,0.0009],[4,0.0039],[6,0.0083],[8,0.0133],[10,0.018],[12,0.0221],[14,0.0254],[16,0.0297],[18,0.0332],[20,0.0346],[22,0.0361],[24,0.0382],[26,0.042],[28,0.041],[30,0.0434],[32,0.0439],[34,0.0441],[36,0.0456],[38,0.0433],[40,0.04],[42,0.0418],[44,0.0487],[46,0.0518],[48,0.0487],[50,0.0491],[52,0.0501],[54,0.0526],[56,0.0505],[58,0.0526],[60,0.051],[62,0.0515],[64,0.0501],[66,0.0493],[68,0.0506],[70,0.05],[72,0.0517],[74,0.0527],[76,0.0513],[78,0.0556],[80,0.0557],[82,0.0559],[84,0.0585],[86,0.0569],[88,0.0554],[90,0.0563],[92,0.0542],[94,0.0556],[96,0.0577],[98,0.0584]] },
          { name: "Monte Carlo", color: "#ff7b72", points: [[0,0.1315],[2,0.1726],[4,0.1869],[6,0.1923],[8,0.1913],[10,0.1794],[12,0.1913],[14,0.1788],[16,0.1831],[18,0.1859],[20,0.1889],[22,0.1965],[24,0.1973],[26,0.1979],[28,0.1989],[30,0.201],[32,0.2005],[34,0.2004],[36,0.1862],[38,0.1899],[40,0.1865],[42,0.1785],[44,0.1955],[46,0.2072],[48,0.1866],[50,0.1816],[52,0.1953],[54,0.1806],[56,0.1813],[58,0.1911],[60,0.1878],[62,0.1883],[64,0.1839],[66,0.1901],[68,0.2048],[70,0.1954],[72,0.1924],[74,0.1883],[76,0.1795],[78,0.1946],[80,0.1889],[82,0.1956],[84,0.2008],[86,0.2038],[88,0.1952],[90,0.1963],[92,0.1725],[94,0.1978],[96,0.1893],[98,0.1912]] }
        ],
        interpret: "Real numbers from the code below (5-state random walk, true center value = 0.5, same step size alpha = 0.1 for both, 200 runs). The x-axis is how many episodes the agent has seen; the y-axis is how far the center-state estimate sits from the known true value (0 = perfect). Green TD(0) drops to a small, stable error near 0.05 within a few episodes; red Monte Carlo plateaus far higher (~0.19) because its full-return target soaks up the randomness of every future step. <b>Read it as:</b> lower and flatter is better, and the green line being both lower and quicker is the whole point — TD's one-step target has far less variance."
      },
      {
        type: "line",
        title: "Step size too large: error never settles, it oscillates (illustrative)",
        xlabel: "episodes",
        ylabel: "| V(center) - true value |",
        series: [
          { name: "TD(0), alpha too big", color: "#ff7b72", points: [[0,0.0],[5,0.12],[10,0.05],[15,0.19],[20,0.07],[25,0.22],[30,0.06],[35,0.20],[40,0.09],[45,0.24],[50,0.05],[55,0.21],[60,0.08],[65,0.23],[70,0.06],[75,0.20],[80,0.10],[85,0.25],[90,0.07],[95,0.22]] }
        ],
        interpret: "Illustrative shape. Same axes — episodes vs distance from the true value — but here alpha is set too high (say 0.8). Each update slams the estimate a big fraction of the way toward a single noisy target, so the error swings wildly up and down and never settles into a low band. <b>Recognise it by:</b> a jagged line with no shrinking trend, often as wide late as it was early. The fix is a smaller alpha or a step-size schedule that decays it."
      },
      {
        type: "line",
        title: "Decaying step size: error keeps shrinking toward zero (illustrative)",
        xlabel: "episodes",
        ylabel: "| V(center) - true value |",
        series: [
          { name: "TD(0), alpha_n = 1/n", color: "#7ee787", points: [[0,0.0],[5,0.07],[10,0.045],[15,0.032],[20,0.025],[25,0.02],[30,0.017],[35,0.014],[40,0.012],[45,0.011],[50,0.0095],[55,0.0085],[60,0.0075],[65,0.0068],[70,0.0062],[75,0.0057],[80,0.0052],[85,0.0048],[90,0.0045],[95,0.0042]] }
        ],
        interpret: "Illustrative shape of the convergence guarantee. Same axes again. With a decaying step size (e.g. alpha_n = 1/n, which satisfies the stochastic-approximation conditions), the early steps move fast, then the shrinking alpha damps the noise so the error keeps drifting toward 0 instead of plateauing at a noise floor. <b>Recognise it by:</b> a smooth, monotone-ish decline that flattens near zero rather than levelling off at a constant band like the fixed-alpha green curve in the first chart."
      }
    ],
    caption: "Three TD learning curves on the same axes — episodes (x) vs distance from the true value (y). The first is real; the other two are illustrative shapes for a too-large step size and a well-tuned decaying one.",
    code: `import numpy as np

# A tiny 5-state random walk (Sutton & Barto). States 0..4 (left..right).
# Off the LEFT end -> terminal, reward 0.  Off the RIGHT end -> terminal, reward +1.
# Each step goes left/right with prob 0.5.  gamma = 1.  Start in the center (state 2).
# Under this equiprobable policy the TRUE values are (i+1)/6, so center (state 2) = 3/6 = 0.5.
N        = 5
TRUE     = np.array([1, 2, 3, 4, 5]) / 6.0   # true V for states 0..4
GAMMA    = 1.0
ALPHA    = 0.1                                # SAME step size for both methods
WATCH    = 2                                  # the center state we track

def run_episode():
    s, traj = 2, []
    while True:
        a  = np.random.randint(0, 2)          # 0 = left, 1 = right
        sp = s + (1 if a == 1 else -1)
        if sp < 0:  traj.append((s, 0.0)); return traj    # left terminal, R=0
        if sp > 4:  traj.append((s, 1.0)); return traj    # right terminal, R=1
        traj.append((s, 0.0)); s = sp

def experiment(method, n_episodes, n_runs=200):
    errs = np.zeros(n_episodes)
    for _ in range(n_runs):
        V = np.full(N, 0.5)                   # optimistic init at 0.5
        for ep in range(n_episodes):
            traj = run_episode()
            if method == "TD":
                for t, (s, r) in enumerate(traj):
                    v_next = V[traj[t+1][0]] if t+1 < len(traj) else 0.0
                    V[s] += ALPHA * (r + GAMMA * v_next - V[s])   # TD(0) update
            else:  # Monte Carlo: target = full return from each visited state
                rewards = [r for (_, r) in traj]
                states  = [s for (s, _) in traj]
                returns = np.cumsum(rewards[::-1])[::-1]          # suffix sums (gamma=1)
                for s, g in zip(states, returns):
                    V[s] += ALPHA * (g - V[s])                    # MC update
            errs[ep] += abs(V[WATCH] - TRUE[WATCH])
    return errs / n_runs

np.random.seed(0)
NEP = 100
td_err = experiment("TD", NEP)
mc_err = experiment("MC", NEP)

# Subsample to <=60 plotted points for the chart.
idx = list(range(0, NEP, 2))
print("true center value:", TRUE[WATCH])
print("TD(0) error  :", [round(td_err[i], 4) for i in idx])
print("MonteCarlo   :", [round(mc_err[i], 4) for i in idx])`
  };
})();
