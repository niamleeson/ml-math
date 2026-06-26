/* Reinforcement Learning — "The exploration vs exploitation dilemma and the strategies that resolve it".
   Framed on the multi-armed bandit (a one-state MDP that isolates the problem).
   Self-contained: lesson + CODE + CODEVIZ merged by id "rl-exploration". */
(function () {
  window.LESSONS.push({
    id: "rl-exploration",
    title: "Exploration vs exploitation: how an agent decides what to try next",
    tagline: "Pull the arm that looks best now, or one you barely know? Greedy gets stuck; smart exploration shrinks over time and keeps regret small.",
    module: "Reinforcement Learning",
    prereqs: ["cls-bandits", "ai-q-learning", "aix-monte-carlo", "prob-expectation"],

    whenToUse:
      `<p>The <b>exploration&ndash;exploitation dilemma</b> shows up in <i>every</i> online-decision setting &mdash;
       anywhere you must choose an action, see only the reward of the action you chose, and want to do well
       <i>while</i> still learning. You never see what the actions you skipped would have paid.</p>
       <ul>
         <li><b>Reach for an explicit exploration strategy when:</b> you learn from your own choices and each choice
         costs something. Concretely &mdash; <b>A/B testing</b> and adaptive experiments (shift traffic toward the
         winner as evidence accrues), <b>online advertising</b> (which creative to show), <b>recommendation</b>
         (which item to surface), <b>clinical trials</b> (which treatment to assign), and the action-selection
         step inside any reinforcement-learning (RL) agent.</li>
         <li><b>You do NOT need this when</b> the rewards of all actions are already known, or you have a fixed
         labelled dataset and are just fitting a supervised model &mdash; there is nothing to explore because you
         already see every outcome.</li>
       </ul>
       <p>We isolate the dilemma on the simplest possible problem: the <b>multi-armed bandit</b>, a
       <b>one-state MDP (Markov Decision Process)</b>. A bandit strips away state transitions and long-horizon
       planning so the <i>only</i> question left is "which action do I try, and how do I trade learning against
       earning?" Master it here; the same tactics (&epsilon;-greedy, optimistic starts, UCB) then plug straight
       into the action-selection step of full RL methods like <code>ai-q-learning</code>.</p>`,

    application:
      `<p>This is one of the most widely deployed ideas in applied machine learning, usually under the name
       <b>bandits</b>.</p>
       <ul>
         <li><b>Ads and content.</b> A live system picks which ad or headline to show. &epsilon;-greedy or UCB
         (Upper Confidence Bound) keeps probing fresh candidates so a temporarily-unlucky good ad is not abandoned.</li>
         <li><b>Recommendation and ranking.</b> Surfacing a never-seen item occasionally (exploration) is the only
         way to learn it is good; pure exploitation would freeze the catalog onto early favorites.</li>
         <li><b>Adaptive A/B testing.</b> Classic A/B testing splits traffic 50/50 the whole time; a bandit shifts
         traffic toward the better arm as it learns, wasting less reward on the loser.</li>
         <li><b>Clinical trials and pricing.</b> Thompson sampling and UCB allocate patients or price points toward
         the option that is winning while still gathering enough evidence on the others.</li>
         <li><b>Inside RL agents.</b> Q-learning, SARSA (State-Action-Reward-State-Action) and deep RL all face the
         same choice at every step; their exploration knob is exactly the machinery in this lesson.</li>
       </ul>
       <p><b>Where this sits in the family.</b> The <code>cls-bandits</code> lesson introduces the bandit and the
       UCB formula; this lesson goes deeper &mdash; the full menu of strategies, the regret metric, and <i>why</i>
       exploration must shrink over time. <code>aix-monte-carlo</code> estimates an action's value by averaging
       sampled returns (the running average we use here is the bandit version of that idea), and
       <code>ai-q-learning</code> reuses &epsilon;-greedy as its exploration policy.</p>`,

    pitfalls:
      `<ul>
         <li><b>Too little exploration &mdash; getting stuck.</b> A pure greedy agent locks onto whichever arm
         looked best after a few noisy pulls and never re-checks. If that early winner was a fluke, the agent
         pays a penalty <i>every single step forever</i> &mdash; its regret grows in a straight line. This is the
         headline failure mode. Fix: force some exploration (&epsilon;, optimism, or a confidence bonus).</li>
         <li><b>Too much exploration &mdash; wasted reward.</b> A large fixed &epsilon; keeps pulling known-bad
         arms long after you are sure they are bad, throwing away reward needlessly. Fix: keep exploration small,
         and decay it.</li>
         <li><b>Not decaying &epsilon;.</b> A constant &epsilon; means you explore at the same rate forever; even
         after you have found the best arm, you still waste a fraction &epsilon; of pulls on random arms. Fix:
         decay &epsilon; toward 0 (e.g. $\\varepsilon_t = 1/t$) so exploration fades as evidence accumulates.</li>
         <li><b>Mis-tuned knobs.</b> UCB's confidence width $c$ and softmax's temperature $\\tau$ control the
         explore/exploit balance. Too high &rarr; over-explore; too low &rarr; under-explore. Fix: tune on held-out
         runs; common defaults are $c \\approx 1$&ndash;$2$ and an annealed $\\tau$.</li>
         <li><b>Non-stationary rewards.</b> If an arm's true payout drifts over time, exploration that decays to
         zero will miss the change. Fix: keep a floor of persistent exploration and use a constant step size (a
         recency-weighted average) instead of a true mean, so old data is forgotten.</li>
         <li><b>Deep RL is much harder.</b> In large state spaces with <b>sparse rewards</b> (you only get a signal
         after a long sequence of correct actions), random &epsilon;-greeding almost never stumbles onto reward.
         Fix: this needs dedicated exploration &mdash; curiosity/intrinsic-reward bonuses, count-based exploration,
         or noisy networks &mdash; a research topic in its own right.</li>
       </ul>`,

    bigIdea:
      `<p><b>The core tension.</b> You face several actions ("arms"), each paying an unknown random reward. You
       only ever observe the reward of the arm you <i>actually pull</i> &mdash; never the others. So every pull
       does two jobs at once, and they fight:</p>
       <ul>
         <li><b>Exploit:</b> pull the arm that looks best <i>given what you know now</i>, to earn reward this turn.</li>
         <li><b>Explore:</b> pull a less-certain arm to <i>learn</i> whether it is secretly better, sacrificing
         this turn's expected reward for information that helps every future turn.</li>
       </ul>
       <p><b>Why naive greedy fails.</b> "Always exploit" sounds optimal but is a trap. Early estimates are based
       on a handful of noisy pulls. Suppose the truly-best arm happened to pay below its average on its first two
       pulls; greedy now believes a worse arm is best and pulls <i>only</i> that worse arm forever. Because it
       never pulls the good arm again, it never collects the evidence that would correct its mistake. It is stuck.</p>
       <p><b>Why exploration must shrink over time.</b> Early on, your estimates are bad, so exploring is cheap and
       valuable &mdash; you have a lot to learn. Late in the game, your estimates are accurate, so exploring a
       known-bad arm is almost pure waste. The right schedule therefore explores <i>a lot</i> at first and
       <i>less and less</i> as evidence piles up. Good algorithms make this happen automatically.</p>
       <p><b>The scoreboard: regret.</b> We measure a strategy not by total reward (which depends on the unknown
       arm values) but by <b>cumulative regret</b> &mdash; the reward you <i>lost</i> compared to an oracle that
       always pulled the best arm. Greedy that gets stuck has regret growing in a straight line (linear, bad).
       Good strategies grow regret much more slowly &mdash; the best provably grow it like $\\ln T$ (logarithmic),
       which flattens out.</p>`,

    buildup:
      `<p>Here is the menu of strategies, from simplest to smartest. Let $\\hat Q(a)$ be our current estimate of
       arm $a$'s mean reward (the running average of rewards we have seen from $a$).</p>
       <p><b>1. &epsilon;-greedy.</b> With probability $1-\\varepsilon$ pull the best-looking arm
       ($\\arg\\max_a \\hat Q(a)$); with probability $\\varepsilon$ pull a <i>uniformly random</i> arm. Dead
       simple, ubiquitous, and surprisingly hard to beat. Its weakness: when it does explore, it explores
       <i>blindly</i> &mdash; an arm it is already sure is terrible is just as likely to be picked as a promising
       under-tried one.</p>
       <p><b>2. Decaying &epsilon;.</b> Make &epsilon; shrink as time goes on, e.g. $\\varepsilon_t = 1/t$ or
       $\\varepsilon_t = \\min(1, c/t)$. Now you explore hard early (when you need to) and barely at all late
       (when you do not). This is what makes exploration "shrink over time" concrete.</p>
       <p><b>3. Optimistic initialization.</b> A trick that needs no &epsilon; at all: start every estimate
       $\\hat Q(a)$ at a value much <i>higher</i> than any real reward could be. A greedy agent will then be
       "disappointed" by whatever arm it pulls (the real reward is below the optimistic start), so it keeps
       switching to the still-untried, still-optimistic arms &mdash; forcing it to try everything once early on.
       The optimism wears off as real data replaces the inflated starts. Simple and effective in stationary
       problems.</p>
       <p><b>4. Upper Confidence Bound (UCB).</b> Replace blind exploration with <b>optimism under
       uncertainty</b>: prefer arms that are <i>either</i> high-value <i>or</i> under-explored, by adding a
       confidence bonus that is large for rarely-pulled arms and shrinks as you pull them. Pull
       $\\arg\\max_a [\\hat Q(a) + c\\sqrt{\\ln t / N(a)}]$. The bonus directs exploration toward arms that
       <i>could</i> be the best, instead of wasting it on arms already known to be bad. This earns the best
       theoretical regret.</p>
       <p><b>5. Boltzmann / softmax.</b> Instead of a hard "best or random" split, pick each arm with probability
       <i>proportional to</i> $e^{\\hat Q(a)/\\tau}$. High-value arms are more likely, but every arm keeps a
       non-zero chance, graded by how good it looks. The temperature $\\tau$ sets the sharpness: large $\\tau$
       &rarr; near-uniform (lots of exploration), $\\tau \\to 0$ &rarr; greedy.</p>
       <p><b>6. Thompson sampling (a note).</b> A Bayesian strategy: keep a <i>posterior distribution</i> over
       each arm's true value, <b>sample</b> one value from each arm's posterior, and pull whichever sampled value
       is highest. Arms you are unsure about have wide posteriors, so they occasionally sample high and get tried
       &mdash; exploration falls out automatically from the uncertainty. Often the best performer in practice and
       beautifully simple to implement (e.g. Beta posteriors for Bernoulli rewards).</p>`,

    symbols: [
      { sym: "$a$", desc: "an action, i.e. which arm of the bandit you pull (out of $k$ arms)." },
      { sym: "$k$", desc: "the number of arms (actions) available." },
      { sym: "$t$", desc: "the time step / round number; the total number of pulls made so far." },
      { sym: "$T$", desc: "the total horizon: how many pulls the whole game lasts." },
      { sym: "$\\mu_a$", desc: "the true (unknown) mean reward of arm $a$ &mdash; what you are trying to learn." },
      { sym: "$\\mu^*$", desc: "the mean reward of the best arm, $\\mu^* = \\max_a \\mu_a$ &mdash; the oracle's per-pull reward." },
      { sym: "$a_t$", desc: "the arm actually pulled at step $t$." },
      { sym: "$\\hat Q(a)$", desc: "your current ESTIMATE of $\\mu_a$: the running average of rewards seen from arm $a$." },
      { sym: "$N(a)$", desc: "the count of how many times arm $a$ has been pulled so far." },
      { sym: "$\\varepsilon$", desc: "for &epsilon;-greedy: the probability of pulling a uniformly random arm (explore) instead of the best (exploit). Between 0 and 1." },
      { sym: "$c$", desc: "for UCB: a tuning constant controlling how wide the confidence bonus is (how much you favour uncertainty)." },
      { sym: "$\\tau$", desc: "for softmax/Boltzmann: the temperature; large $\\tau$ explores more, $\\tau \\to 0$ becomes greedy." },
      { sym: "$\\text{Regret}_T$", desc: "cumulative regret after $T$ pulls: total reward LOST versus always pulling the best arm." }
    ],

    formula:
      `$$ a_t = \\arg\\max_a \\left[\\, \\hat Q(a) + c\\sqrt{\\frac{\\ln t}{N(a)}} \\,\\right]
         \\qquad\\text{(UCB action rule)} $$
       $$ \\text{Regret}_T = \\sum_{t=1}^{T} \\bigl(\\mu^* - \\mu_{a_t}\\bigr)
         \\qquad\\text{(cumulative regret)} $$
       $$ P(a_t = a) = \\frac{e^{\\hat Q(a)/\\tau}}{\\sum_{b} e^{\\hat Q(b)/\\tau}}
         \\qquad\\text{(Boltzmann / softmax)} $$`,

    whatItDoes:
      `<p><b>UCB rule.</b> For each arm, take its value estimate $\\hat Q(a)$ and add a bonus
       $c\\sqrt{\\ln t / N(a)}$. The bonus is <i>large</i> for an arm pulled few times (small $N(a)$) and
       <i>shrinks</i> as the arm is pulled more; the $\\ln t$ on top slowly re-widens it over time so no arm is
       abandoned forever. Pull the arm with the highest <i>optimistic</i> total. Early on the bonus dominates so
       every arm gets sampled; later the estimates dominate so the true best arm wins.</p>
       <p><b>Regret.</b> At each step the oracle would have earned $\\mu^*$ but you earned (in expectation) only
       $\\mu_{a_t}$, so you lost $\\mu^* - \\mu_{a_t}$ this step (zero if you pulled the best arm). Summed over all
       $T$ steps, that is your total regret &mdash; the number we minimize. A strategy stuck on a bad arm adds a
       fixed positive gap every step, so its regret line climbs forever (linear). A strategy that finds and sticks
       to the best arm stops adding regret, so its line flattens.</p>
       <p><b>Softmax.</b> Convert estimates into a probability distribution over arms via the exponential. Better
       arms get exponentially more probability, but every arm keeps a chance &mdash; a soft, graded version of
       exploration controlled by $\\tau$.</p>`,

    derivation:
      `<p><b>Where the UCB bonus comes from (optimism under uncertainty).</b> Define each arm's value optimistically
       as the highest value consistent with the data so far, then act greedily on those optimistic values.</p>
       <ul class="steps">
         <li>The estimate $\\hat Q(a)$ is an average of $N(a)$ noisy samples, so it has error. We want an upper
         bound $U(a)$ such that the true mean satisfies $\\mu_a \\le \\hat Q(a) + U(a)$ with high probability.</li>
         <li><b>Hoeffding's inequality</b> (a concentration bound for averages of bounded random variables) says:
         the true mean exceeds $\\hat Q(a) + u$ with probability at most $e^{-2 N(a) u^2}$. So a wider $u$ means a
         safer bound.</li>
         <li>We want the chance of the bound failing to fall fast as the game grows &mdash; set that failure
         probability to $t^{-4}$: solve $e^{-2 N(a) u^2} = t^{-4}$.</li>
         <li>Take natural logs: $-2 N(a)\\, u^2 = -4 \\ln t$, hence $u^2 = \\dfrac{2 \\ln t}{N(a)}$ and
         $u = \\sqrt{\\dfrac{2 \\ln t}{N(a)}}$. Folding the constant into a tunable $c$ gives the bonus
         $c\\sqrt{\\ln t / N(a)}$.</li>
         <li>So $\\hat Q(a) + c\\sqrt{\\ln t / N(a)}$ is a high-confidence ceiling on what arm $a$ could be worth.
         Pulling the arm with the largest ceiling is "optimism in the face of uncertainty": you either get lucky
         and earn, or you learn fast that the arm is worse than it looked. $\\blacksquare$</li>
       </ul>
       <p><b>Why this beats &epsilon;-greedy.</b> &epsilon;-greedy explores <i>uniformly</i> &mdash; it wastes
       exploration on arms it already knows are bad. UCB explores <i>directionally</i> &mdash; the bonus steers
       pulls only toward arms that could plausibly be best, so it stops probing clearly-bad arms. The payoff is
       provable: UCB's cumulative regret grows like $O(\\ln T)$ (logarithmic, flattening), versus the linear
       regret of stuck greedy and the larger constant of fixed-&epsilon; greedy.</p>`,

    example:
      `<p>A tiny worked UCB step. Three arms, after $t = 10$ total pulls. Note $\\ln 10 \\approx 2.303$, and take
       $c = 1$.</p>
       <ul class="steps">
         <li><b>Current state.</b> Arm A: $\\hat Q = 0.60$, pulled $N = 6$ times. Arm B: $\\hat Q = 0.50$,
         $N = 3$. Arm C: $\\hat Q = 0.40$, $N = 1$. Greedy would pull A (highest estimate). Watch UCB instead.</li>
         <li><b>Bonus for A:</b> $\\sqrt{2.303 / 6} = \\sqrt{0.384} \\approx 0.62$, so $U_A = 0.60 + 0.62 = 1.22$.</li>
         <li><b>Bonus for B:</b> $\\sqrt{2.303 / 3} = \\sqrt{0.768} \\approx 0.88$, so $U_B = 0.50 + 0.88 = 1.38$.</li>
         <li><b>Bonus for C:</b> $\\sqrt{2.303 / 1} = \\sqrt{2.303} \\approx 1.52$, so $U_C = 0.40 + 1.52 = 1.92$.</li>
         <li><b>Decision.</b> UCB pulls <b>C</b> &mdash; the least-tried arm &mdash; even though its <i>estimate</i>
         is the lowest, because its uncertainty is the largest. Greedy would never have given C another chance.
         This is exactly the exploration greedy lacks.</li>
       </ul>
       <p><b>Tiny regret tally.</b> Suppose the true means are $\\mu_A = 0.7, \\mu_B = 0.5, \\mu_C = 0.3$, so
       $\\mu^* = 0.7$ (arm A). A greedy agent that wrongly locked onto B pays $\\mu^* - \\mu_B = 0.7 - 0.5 = 0.2$
       of regret <i>every</i> step; over $T = 1000$ steps that is $200$ &mdash; a straight line. An agent that
       finds A and stays adds essentially nothing after it settles, so its regret line flattens near a small
       constant.</p>`,

    practice: [
      {
        q: `An agent uses pure greedy on a 5-arm bandit. After 8 pulls it has tried arm 3 twice (both unlucky, low rewards) and arm 1 four times (decent), and now pulls ONLY arm 1 for the next 10,000 steps. Arm 3 is actually the best arm. What went wrong and what is the regret behaviour?`,
        steps: [
          { do: `Note that greedy always pulls $\\arg\\max_a \\hat Q(a)$ and never pulls anything else once an arm leads.`, why: `With no exploration, the agent only updates the arm it already favours; the others' estimates are frozen at their early, noisy values.` },
          { do: `Observe that arm 3's two unlucky pulls left $\\hat Q(3)$ artificially low, below $\\hat Q(1)$.`, why: `Greedy now believes arm 1 is best and will never pull arm 3 again, so it can never collect the evidence that would correct the estimate.` },
          { do: `Track the per-step regret: every step pays $\\mu^* - \\mu_1 > 0$ because arm 3 (the true best) is never chosen.`, why: `A fixed positive gap added every step makes cumulative regret grow in a straight line (linear) forever.` }
        ],
        answer: `<p>Greedy got <b>stuck on a sub-optimal arm</b>. Two unlucky early pulls of the truly-best arm 3 dropped its estimate below arm 1's; with no exploration the agent never revisits arm 3, so the mistake is never corrected. It pays the fixed gap $\\mu^* - \\mu_1$ <i>every step</i>, so cumulative regret grows <b>linearly</b> &mdash; the classic too-little-exploration failure. The fix: inject exploration (decaying &epsilon;, optimistic initial values, or a UCB bonus) so under-tried arms keep getting sampled.</p>`
      },
      {
        q: `You run &epsilon;-greedy with a fixed $\\varepsilon = 0.1$ and it works, but a teammate insists on decaying &epsilon; over time. On a stationary bandit, why is decaying better, and what is a simple schedule?`,
        steps: [
          { do: `Split the cost of fixed $\\varepsilon$ into early vs late.`, why: `Early, estimates are noisy so exploring is valuable; late, estimates are accurate so exploring a known-bad arm is almost pure wasted reward.` },
          { do: `Quantify the late waste: with constant $\\varepsilon=0.1$, even after finding the best arm you still pull a random arm 10% of the time, forever.`, why: `That keeps adding a small fixed amount of regret per step, so regret never fully flattens — it stays linear with a small slope.` },
          { do: `Decay $\\varepsilon$ toward 0, e.g. $\\varepsilon_t = \\min(1, c/t)$ or $1/t$.`, why: `You explore hard when it pays (early) and almost never when it doesn't (late), letting cumulative regret flatten toward logarithmic.` }
        ],
        answer: `<p>On a <b>stationary</b> problem a <i>constant</i> $\\varepsilon$ keeps wasting a fraction $\\varepsilon$ of pulls on random arms forever &mdash; even after the best arm is obvious &mdash; so regret keeps climbing with slope roughly $\\varepsilon \\cdot (\\text{avg gap})$. <b>Decaying</b> &epsilon; (e.g. $\\varepsilon_t = 1/t$) explores a lot early, when estimates are noisy and learning is cheap, and almost not at all late, when estimates are sharp. That matches the principle "exploration must shrink over time" and pushes regret from linear toward logarithmic. (Caveat: if rewards are <b>non-stationary</b>, keep a floor of exploration instead of decaying to zero.)</p>`
      },
      {
        q: `Compare how &epsilon;-greedy and UCB decide to explore. UCB has a confidence bonus $c\\sqrt{\\ln t / N(a)}$. Explain why UCB usually achieves lower regret, and what the bonus does as $N(a)$ grows.`,
        steps: [
          { do: `Describe &epsilon;-greedy's exploration: with probability $\\varepsilon$ pick a UNIFORMLY random arm.`, why: `Uniform means an arm already known to be terrible is just as likely to be explored as a promising under-tried one — exploration is spent blindly.` },
          { do: `Describe UCB's exploration: it pulls $\\arg\\max_a[\\hat Q(a) + c\\sqrt{\\ln t / N(a)}]$.`, why: `The bonus is large only for arms with small $N(a)$ (few pulls), so exploration is directed at arms that are uncertain AND could plausibly be best — not at arms already known to be bad.` },
          { do: `Track the bonus as $N(a)$ grows.`, why: `$\\sqrt{\\ln t / N(a)}$ shrinks toward 0 as an arm is pulled more, so a well-understood arm stops being explored; the slow $\\ln t$ growth keeps no arm abandoned forever.` }
        ],
        answer: `<p>&epsilon;-greedy explores <b>uniformly and blindly</b> &mdash; it wastes its exploration budget on arms it already knows are bad. UCB explores <b>directionally</b>: the bonus $c\\sqrt{\\ln t / N(a)}$ is large only for rarely-pulled, uncertain arms, so it probes exactly the arms that <i>might</i> be the best and stops probing clearly-bad ones. As $N(a)$ grows the bonus shrinks to ~0, so confident arms are exploited; the $\\ln t$ term re-widens it slowly so nothing is forgotten. This "optimism under uncertainty" gives UCB provably <b>logarithmic</b> $O(\\ln T)$ regret, beating &epsilon;-greedy in most stationary problems.</p>`
      }
    ]
  });

  window.CODE["rl-exploration"] = {
    lib: "numpy",
    runnable: false,
    explain: `<p>A self-contained <b>k-armed bandit</b> simulation in pure numpy, comparing four strategies on the
      same problem: <b>greedy</b>, <b>&epsilon;-greedy</b>, <b>optimistic-init greedy</b>, and <b>UCB (Upper
      Confidence Bound)</b>. Each arm has an unknown true mean drawn once; every pull returns a noisy reward. We
      track <b>average reward</b> and <b>cumulative regret</b> over steps and print the final regret of each
      strategy &mdash; greedy gets stuck (high regret), &epsilon;-greedy and optimistic-init do much better, and
      UCB is best. It runs in <b>Google Colab</b> or any Python with numpy; <code>runnable</code> is off only
      because plotting/seeding is best done in a notebook.</p>`,
    code: `# Colab-ready: pure numpy, no gym/torch needed.
import numpy as np

# ============================================================
# 1. THE k-ARMED BANDIT ENVIRONMENT
#    Each arm a has a fixed true mean mu_a (unknown to the agent).
#    Pulling arm a returns a noisy reward ~ Normal(mu_a, 1).
# ============================================================
rng = np.random.default_rng(5)
k = 10
true_means = rng.normal(0.0, 1.0, k)   # the hidden values
opt = true_means.max()                 # mu* : the best arm's mean (oracle)
T = 2000                               # horizon (number of pulls)

def pull(a, r):                        # sample a reward from arm a
    return r.normal(true_means[a], 1.0)

# ============================================================
# 2. ONE GENERIC BANDIT LOOP, four selection rules
#    Q[a] = running average estimate of mu_a ; N[a] = pull count.
#    We update Q incrementally:  Q <- Q + (reward - Q) / N.
#    Regret at step t = mu* - mu_{a_t}  (expected reward lost).
# ============================================================
def run(strategy, eps=0.1, c=2.0, opt_init=0.0, seed=0):
    r = np.random.default_rng(seed)
    Q = np.full(k, opt_init, dtype=float)   # optimistic start if opt_init>0
    N = np.zeros(k)
    cum_regret = np.zeros(T)
    total = 0.0
    for t in range(1, T + 1):
        # ---- choose an arm a_t ----
        if strategy == "greedy":
            a = int(np.argmax(Q))                       # always exploit
        elif strategy == "egreedy":
            if r.random() < eps:
                a = int(r.integers(k))                  # explore: random arm
            else:
                a = int(np.argmax(Q))                   # exploit
        elif strategy == "optimistic":
            a = int(np.argmax(Q))                       # greedy, but Q starts high
        elif strategy == "ucb":
            bonus = c * np.sqrt(np.log(t) / (N + 1e-9)) # optimism under uncertainty
            a = int(np.argmax(Q + bonus))
        # ---- pull, observe reward, update estimate ----
        reward = pull(a, r)
        N[a] += 1
        Q[a] += (reward - Q[a]) / N[a]                  # incremental mean
        # ---- accumulate regret ----
        total += opt - true_means[a]
        cum_regret[t - 1] = total
    return cum_regret

g  = run("greedy",                          seed=6)
e  = run("egreedy",  eps=0.1,               seed=7)
ucb = run("ucb",     c=2.0,                 seed=8)
oi = run("optimistic", opt_init=5.0,        seed=9)   # start values WAY above any real reward

# ============================================================
# 3. REPORT FINAL CUMULATIVE REGRET (lower is better)
# ============================================================
print(f"true means (rounded): {np.round(true_means, 2)}")
print(f"best arm mean mu* = {opt:.3f}\\n")
print(f"  greedy           final regret = {g[-1]:8.1f}   (gets stuck -> linear)")
print(f"  epsilon-greedy   final regret = {e[-1]:8.1f}   (sub-linear)")
print(f"  optimistic-init  final regret = {oi[-1]:8.1f}   (forces early exploration)")
print(f"  UCB              final regret = {ucb[-1]:8.1f}   (lowest -> logarithmic)")
# Typical output (seed 5):
#   greedy           ~ 2448.8   epsilon-greedy ~ 411.9
#   optimistic-init  ~ small     UCB           ~ 163.6`
  };

  window.CODEVIZ["rl-exploration"] = {
    question: "How do you READ a regret curve — and the per-arm uncertainty view UCB acts on — to tell a healthy strategy from one that's stuck?",
    charts: [
      {
        type: "line",
        title: "IDEAL: cumulative regret — greedy (linear) vs ε-greedy (sub-linear) vs UCB (logarithmic)",
        xlabel: "step t (pulls)",
        ylabel: "cumulative regret (reward lost vs the best arm)",
        series: [
          { name: "greedy (stuck → linear)", color: "#ff7b72", points: [[1, 2.4], [52, 83.3], [103, 145.2], [154, 207.1], [206, 270.3], [257, 332.2], [308, 394.1], [359, 456.1], [411, 519.2], [462, 581.1], [513, 643.1], [564, 705.0], [616, 768.2], [667, 830.1], [718, 892.0], [769, 954.0], [821, 1017.1], [872, 1079.0], [923, 1141.0], [974, 1202.9], [1026, 1266.0], [1077, 1328.0], [1128, 1389.9], [1179, 1451.8], [1231, 1515.0], [1282, 1576.9], [1333, 1638.8], [1384, 1700.8], [1436, 1763.9], [1487, 1825.8], [1538, 1887.8], [1589, 1949.7], [1641, 2012.9], [1692, 2074.8], [1743, 2136.7], [1794, 2198.6], [1846, 2261.8], [1897, 2323.7], [1948, 2385.7], [2000, 2448.8]] },
          { name: "ε-greedy ε=0.1 (sub-linear)", color: "#4ea1ff", points: [[1, 2.4], [52, 37.7], [103, 69.3], [154, 95.4], [206, 101.9], [257, 109.2], [308, 123.4], [359, 132.3], [411, 139.1], [462, 155.9], [513, 168.9], [564, 178.7], [616, 186.8], [667, 193.2], [718, 200.8], [769, 207.2], [821, 216.6], [872, 226.1], [923, 229.5], [974, 238.9], [1026, 250.0], [1077, 257.7], [1128, 269.5], [1179, 274.9], [1231, 289.6], [1282, 298.4], [1333, 313.1], [1384, 322.2], [1436, 331.1], [1487, 334.4], [1538, 344.5], [1589, 352.1], [1641, 358.9], [1692, 364.4], [1743, 371.4], [1794, 379.3], [1846, 387.6], [1897, 399.0], [1948, 403.9], [2000, 411.9]] },
          { name: "UCB c=2 (logarithmic, lowest)", color: "#7ee787", points: [[1, 2.4], [52, 33.2], [103, 49.3], [154, 62.0], [206, 67.7], [257, 75.4], [308, 82.8], [359, 90.9], [411, 92.3], [462, 92.3], [513, 94.7], [564, 96.3], [616, 103.9], [667, 105.4], [718, 105.4], [769, 108.8], [821, 108.8], [872, 114.4], [923, 117.5], [974, 122.0], [1026, 131.8], [1077, 132.3], [1128, 134.1], [1179, 134.6], [1231, 134.6], [1282, 135.1], [1333, 138.5], [1384, 149.1], [1436, 158.9], [1487, 158.9], [1538, 163.1], [1589, 163.1], [1641, 163.1], [1692, 163.1], [1743, 163.1], [1794, 163.1], [1846, 163.1], [1897, 163.1], [1948, 163.1], [2000, 163.6]] }
        ],
        interpret: "<b>How to read it:</b> x is pulls made, y is total reward LOST versus an oracle that always pulls the best arm — so lower and flatter is better, and the curve can only ever go up. <b>Shape is everything:</b> a straight LINE that never bends (red) means the strategy is stuck paying a fixed penalty every step forever — greedy locked onto a wrong arm. A curve that BENDS over (blue, ε-greedy) is sub-linear: still climbing, but slower. A curve that FLATTENS to nearly horizontal (green, UCB) is the signature of an algorithm that found the best arm and stopped wasting pulls — logarithmic regret. <b>Conclude:</b> read the late slope, not the height — flat late means solved."
      },
      {
        type: "bars",
        title: "VARIANT — what UCB sees at one step: estimate Q̂ (bar) plus confidence bonus (the gap to the marker)",
        labels: ["Arm A  (N=6)", "Arm B  (N=3)", "Arm C  (N=1)"],
        values: [0.60, 0.50, 0.40],
        valueLabels: ["Q̂=0.60 → U=1.22", "Q̂=0.50 → U=1.38", "Q̂=0.40 → U=1.92 ✓pull"],
        colors: ["#9aa7b4", "#9aa7b4", "#7ee787"],
        interpret: "<b>How to read it:</b> each bar is an arm's current value estimate Q̂ — the running average reward seen from it. Greedy reads only the bars and pulls the tallest (Arm A, 0.60). But UCB adds a confidence bonus that is BIGGER for less-pulled arms: with c=1 and t=10, the upper bound U = Q̂ + √(ln t / N) gives A=1.22, B=1.38, C=1.92. <b>What it tells you:</b> Arm C has the LOWEST estimate but the HIGHEST upper bound because it has been pulled only once (N=1) — huge uncertainty. <b>Conclude:</b> UCB pulls C (green), the arm greedy would never revisit. This is directed exploration: probe the uncertain arm that could still be best. Numbers are the worked example from the lesson."
      },
      {
        type: "line",
        title: "VARIANT — non-stationary: decay-to-zero ε MISSES a drift (arm values change at step 1000)",
        xlabel: "step t (pulls)",
        ylabel: "cumulative regret (reward lost vs the CURRENT best arm)",
        series: [
          { name: "decayed ε→0 (blind after drift)", color: "#ff7b72", points: [[1, 3], [200, 40], [400, 55], [600, 62], [800, 66], [1000, 68], [1100, 120], [1200, 175], [1300, 232], [1400, 290], [1500, 349], [1600, 408], [1700, 468], [1800, 528], [1900, 589], [2000, 650]] },
          { name: "ε floored at 0.05 (keeps probing)", color: "#7ee787", points: [[1, 3], [200, 42], [400, 60], [600, 70], [800, 76], [1000, 80], [1100, 110], [1200, 128], [1300, 140], [1400, 150], [1500, 158], [1600, 165], [1700, 171], [1800, 177], [1900, 182], [2000, 187]] }
        ],
        interpret: "<b>Illustrative shapes.</b> Here the best arm secretly changes at step 1000 (a non-stationary world). Both curves are flat and healthy on the left — exploration has done its job. <b>The tell is the kink at 1000:</b> the decay-to-zero strategy (red) has already shrunk ε to nearly nothing, so it never re-checks the other arms and stays loyal to the now-WRONG arm — its regret turns back into a straight rising line, exactly the stuck-greedy failure but arriving late. The floored strategy (green) keeps a small permanent ε, notices the new winner within a few hundred pulls, and re-flattens. <b>Conclude:</b> when a curve that was flat suddenly resumes a straight climb, suspect drift — and never decay exploration fully to zero on non-stationary problems."
      }
    ],
    caption: "Read the regret curve by its LATE SHAPE: straight line = stuck (linear), bending = sub-linear, flattening = solved (logarithmic). The bar chart shows the per-arm uncertainty view UCB acts on — lowest estimate can still have the highest upper bound. The third panel is the failure to watch for: a flat curve that resumes a straight climb means the world drifted and your exploration decayed too far.",
    code: `import numpy as np

# ---- a REAL 10-armed Gaussian bandit, simulated in numpy ----
rng = np.random.default_rng(5)
k, T = 10, 2000
true_means = rng.normal(0.0, 1.0, k)   # hidden arm values
opt = true_means.max()                 # mu* : best arm's mean

def run(strategy, eps=0.1, c=2.0, seed=0):
    r = np.random.default_rng(seed)
    Q = np.zeros(k); N = np.zeros(k)
    cum = np.zeros(T); total = 0.0
    for t in range(1, T + 1):
        if strategy == "greedy":
            a = int(np.argmax(Q))
        elif strategy == "egreedy":
            a = int(r.integers(k)) if r.random() < eps else int(np.argmax(Q))
        elif strategy == "ucb":
            a = int(np.argmax(Q + c * np.sqrt(np.log(t) / (N + 1e-9))))
        reward = r.normal(true_means[a], 1.0)
        N[a] += 1
        Q[a] += (reward - Q[a]) / N[a]          # incremental mean estimate
        total += opt - true_means[a]            # regret = mu* - mu_{a_t}
        cum[t - 1] = total
    return cum

g  = run("greedy",  seed=6)
e  = run("egreedy", eps=0.1, seed=7)
u  = run("ucb",     c=2.0,   seed=8)

# subsample to 40 points for plotting
idx = np.linspace(0, T - 1, 40).astype(int)
for name, arr in [("greedy", g), ("egreedy", e), ("ucb", u)]:
    print(name, [[int(i + 1), round(float(arr[i]), 1)] for i in idx])
print(f"FINAL  greedy={g[-1]:.1f}  egreedy={e[-1]:.1f}  ucb={u[-1]:.1f}")
# FINAL  greedy=2448.8  egreedy=411.9  ucb=163.6`
  };
})();
