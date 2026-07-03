/* =====================================================================
   AFP-AI Learning Guide — Domain 5 · Reinforcement Learning  (modules M23–M26)
   ---------------------------------------------------------------------
   Authored source for the AFP-AI track. One object per module.
   Read by tools/gen-afp.js and tools/gen-afp-notebooks.js.
   Shape follows tools/afp-authored/d0-foundations.js M1.
   ===================================================================== */
"use strict";

const M23 = {
  "m": 23,
  "domain": 5,
  "title": "RLHF, DPO, PPO",
  "tagline": "Turn human preference labels into safer model behavior while keeping the tuned model close to a trusted reference.",
  "skipIf": "design a fine-tuning plan for LLM RL tuning.",
  "mapsTo": [
    "Creative Intelligence"
  ],
  "connections": {
    "buildsOn": [
      "probability and logistic functions",
      "cross-entropy loss",
      "policy gradients"
    ],
    "leadsTo": [
      "safe LLM fine-tuning",
      "reward modeling",
      "preference optimization"
    ],
    "usedWith": [
      "KL divergence",
      "Bradley-Terry models",
      "stochastic policies"
    ]
  },
  "motivation": "<p>You already know how to train a model from labels. RLHF starts when the label is not a single right answer, but a human preference: this generated headline is clearer than that one; this prompt completion follows the brand guardrail better than that one. For Creative Intelligence, those comparisons are often easier and more reliable than asking reviewers to invent a perfect numeric score.</p><p>The key idea is to convert preferences into an optimization signal, then update carefully. PPO uses a learned reward model and a KL penalty so the model improves without drifting far from the reference. DPO keeps the same preference spirit but skips the explicit reward model by optimizing a closed-form preference objective directly.</p>",
  "definition": "<p><b>Definition.</b> In RLHF, humans compare outputs, a reward model learns scores $r_\\phi(x,y)$, and a policy $\\pi_\\theta(y|x)$ is fine-tuned to maximize reward while staying close to a reference $\\pi_0$:</p><p>$$\\max_\\theta\\; \\mathbb{E}_{y\\sim\\pi_\\theta}[r_\\phi(x,y)] - \\beta\\,D_{KL}(\\pi_\\theta(\\cdot|x)\\|\\pi_0(\\cdot|x)).$$</p><p>For a preference pair where $y_w$ beats $y_l$, Bradley-Terry uses $P(y_w \\succ y_l)=\\sigma(r_\\phi(x,y_w)-r_\\phi(x,y_l))$. PPO estimates policy-gradient updates with a clipped probability ratio; DPO optimizes preferences directly by comparing policy log-ratios to reference log-ratios.</p>",
  "symbols": [
    {
      "sym": "$x$",
      "desc": "the prompt or context, such as a creative brief."
    },
    {
      "sym": "$y_w,y_l$",
      "desc": "the preferred and less-preferred completions in a human comparison."
    },
    {
      "sym": "$r_\\phi(x,y)$",
      "desc": "the learned reward model score."
    },
    {
      "sym": "$\\pi_\\theta(y|x)$",
      "desc": "the policy being tuned."
    },
    {
      "sym": "$\\pi_0(y|x)$",
      "desc": "the frozen reference policy used as an anchor."
    },
    {
      "sym": "$\\beta$",
      "desc": "the strength of the KL or DPO temperature term."
    },
    {
      "sym": "$\\rho=\\pi_\\theta(a|s)/\\pi_{old}(a|s)$",
      "desc": "the PPO probability ratio for a sampled action."
    }
  ],
  "derivation": [
    {
      "do": "Model a preference pair",
      "result": "$P(y_w \\succ y_l)=\\sigma(r_w-r_l)$",
      "why": "a difference in reward scores is enough to predict which item humans prefer"
    },
    {
      "do": "Write the reward-model loss",
      "result": "$-\\log\\sigma(r_w-r_l)$",
      "why": "maximizing the chosen probability is ordinary binary log loss on pairwise data"
    },
    {
      "do": "Anchor policy tuning",
      "result": "$J=\\mathbb{E}[r]-\\beta D_{KL}(\\pi_\\theta\\|\\pi_0)$",
      "why": "without the anchor, reward hacking can move the model far from safe reference behavior"
    },
    {
      "do": "Clip the PPO ratio",
      "result": "$\\min(\\rho A,\\operatorname{clip}(\\rho,1-\\epsilon,1+\\epsilon)A)$",
      "why": "a large probability jump cannot create an overly large update when the advantage is positive"
    }
  ],
  "worked": {
    "problem": "A reviewer prefers completion A over B. The reward model scores are $r_A=1.8$ and $r_B=0.6$. A PPO sample for A has old probability 0.20, new probability 0.30, advantage 0.50, and $\\epsilon=0.2$. Compute the Bradley-Terry preference probability and the PPO clipped term.",
    "skills": [
      "Bradley-Terry probability",
      "PPO ratio",
      "clipping"
    ],
    "strategy": "Compute the preference probability from the reward difference, then compute the PPO ratio before applying the clipping interval.",
    "steps": [
      {
        "do": "Subtract rewards",
        "result": "$r_A-r_B=1.8-0.6=1.2$",
        "why": "Bradley-Terry depends on the difference, not the absolute scores"
      },
      {
        "do": "Apply the sigmoid",
        "result": "$\\sigma(1.2)=1/(1+e^{-1.2})\u0007pprox0.7685$",
        "why": "this is the model probability that A beats B"
      },
      {
        "do": "Compute the PPO ratio",
        "result": "$\\rho=0.30/0.20=1.50$",
        "why": "the new policy made A 50% more likely than the old policy"
      },
      {
        "do": "Clip the ratio",
        "result": "$\\operatorname{clip}(1.50,0.80,1.20)=1.20$",
        "why": "PPO caps the update because the probability jump is too large"
      },
      {
        "do": "Multiply by advantage",
        "result": "$\\min(1.50\\cdot0.50,1.20\\cdot0.50)=0.60$",
        "why": "for a positive advantage, PPO uses the smaller clipped objective term"
      }
    ],
    "verify": "The preference probability is above 0.5 because A has higher reward; the PPO term is below the unclipped 0.75 because the ratio exceeded 1.2.",
    "answer": "$P(A\\succ B)\u0007pprox0.7685$ and the PPO clipped objective term is $0.60$.",
    "connects": "This is the RLHF loop in miniature: preferences become reward differences, then policy updates are constrained by a reference-aware trust region."
  },
  "practice": [
    {
      "problem": "A preference pair has $r_w=2.0$ and $r_l=1.1$. Compute $P(w\\succ l)$.",
      "steps": [
        {
          "do": "Subtract the scores",
          "result": "$2.0-1.1=0.9$",
          "why": "the Bradley-Terry probability uses only the gap"
        },
        {
          "do": "Apply the sigmoid",
          "result": "$\\sigma(0.9)=1/(1+e^{-0.9})\u0007pprox0.7109$",
          "why": "a positive gap gives probability above one half"
        }
      ],
      "answer": "$P(w\\succ l)\u0007pprox0.711$."
    },
    {
      "problem": "A policy has expected reward 1.40, KL to reference 0.30, and $\\beta=0.2$. Compute the KL-penalized objective.",
      "steps": [
        {
          "do": "Compute the penalty",
          "result": "$0.2\\cdot0.30=0.06$",
          "why": "the KL cost is scaled by $\\beta$"
        },
        {
          "do": "Subtract the penalty",
          "result": "$1.40-0.06=1.34$",
          "why": "the objective rewards quality but charges for drift"
        }
      ],
      "answer": "The objective is $1.34$."
    },
    {
      "problem": "For PPO, old probability is 0.40, new probability is 0.34, advantage is $-0.7$, and $\\epsilon=0.2$. Compute the clipped term.",
      "steps": [
        {
          "do": "Compute the ratio",
          "result": "$\\rho=0.34/0.40=0.85$",
          "why": "the new policy lowered the sampled action probability"
        },
        {
          "do": "Find the clip interval",
          "result": "$[1-0.2,1+0.2]=[0.8,1.2]$",
          "why": "0.85 is inside the allowed interval"
        },
        {
          "do": "Multiply by advantage",
          "result": "$0.85\\cdot(-0.7)=-0.595$",
          "why": "no clipping changes the ratio"
        }
      ],
      "answer": "The clipped PPO term is $-0.595$."
    },
    {
      "problem": "DPO compares log-ratios. If the policy chosen-vs-rejected log-ratio is 1.2, the reference log-ratio is 0.4, and $\\beta=0.5$, compute $\\sigma(\\beta(1.2-0.4))$.",
      "steps": [
        {
          "do": "Subtract log-ratios",
          "result": "$1.2-0.4=0.8$",
          "why": "DPO measures improvement relative to the reference"
        },
        {
          "do": "Scale by beta",
          "result": "$0.5\\cdot0.8=0.4$",
          "why": "the temperature controls sharpness"
        },
        {
          "do": "Apply sigmoid",
          "result": "$\\sigma(0.4)\u0007pprox0.5987$",
          "why": "positive margin favors the chosen response"
        }
      ],
      "answer": "The DPO preference probability is about $0.599$."
    },
    {
      "problem": "A reward model gives 92 correct preferences out of 120 validation comparisons. What is the validation accuracy, and why is it not enough by itself?",
      "steps": [
        {
          "do": "Divide correct by total",
          "result": "$92/120=0.7667$",
          "why": "accuracy is the fraction of pair labels predicted correctly"
        },
        {
          "do": "Convert to percent",
          "result": "$0.7667\u0007pprox76.7\\%$",
          "why": "this is easier to communicate"
        },
        {
          "do": "Name the missing check",
          "result": "inspect reward hacking and KL drift",
          "why": "a high preference accuracy can still push the policy toward brittle outputs"
        }
      ],
      "answer": "Validation accuracy is about $76.7\\%$; also check policy behavior, KL, and held-out safety slices."
    }
  ],
  "applications": [
    {
      "title": "Creative Intelligence prompt tuning",
      "background": "Preference labels can compare two generated creative suggestions for clarity, brand fit, and factuality before a prompt or adapter is promoted.",
      "numbers": "If reviewers mark 780 winners across 1,000 pairs and the reward model predicts 690 of those winners, validation accuracy is $690/1000=69\\%$; a random comparator would be near 50%."
    },
    {
      "title": "KL guardrail for brand voice",
      "background": "A model that chases a reward model can become repetitive or unsafe, so teams track how far it moves from the reference model.",
      "numbers": "Expected reward 1.8 with KL 0.9 and $\\beta=0.3$ gives objective $1.8-0.3\\cdot0.9=1.53$; a lower-reward policy at 1.65 with KL 0.2 scores $1.59$ and may be preferred."
    },
    {
      "title": "RLHF data budgeting",
      "background": "Pairwise comparisons are cheaper than writing ideal answers, but they still need sampling discipline across verticals and locales.",
      "numbers": "At 6 comparisons per prompt for 400 prompts, labeling requires $6\\cdot400=2,400$ judgments; with 3 raters per comparison that becomes 7,200 rater decisions."
    },
    {
      "title": "PPO update monitoring",
      "background": "During fine-tuning, a clipped ratio shows when an update is trying to move too aggressively on a batch.",
      "numbers": "With old probability 0.10, new probability 0.15, advantage 0.4, and $\\epsilon=0.2$, PPO uses $1.2\\cdot0.4=0.48$ instead of $1.5\\cdot0.4=0.60$."
    },
    {
      "title": "DPO for fast preference iteration",
      "background": "DPO is attractive when the team has high-quality chosen/rejected pairs and wants fewer moving pieces than reward-model plus PPO training.",
      "numbers": "If policy log-ratio minus reference log-ratio is 0.6 and $\\beta=0.8$, the DPO sigmoid argument is 0.48, so the implied chosen probability is $\\sigma(0.48)\u0007pprox0.618$."
    },
    {
      "title": "Human evaluation gate before launch",
      "background": "Even when offline objectives improve, launch reviews compare generated ads or directives against a baseline on held-out prompts.",
      "numbers": "A tuned policy winning 312 of 500 blind comparisons has win rate $312/500=62.4\\%$; an approximate standard error is $\\sqrt{0.624\\cdot0.376/500}\u0007pprox0.0217$."
    }
  ],
  "applicationsClose": "<p>RLHF, PPO, and DPO are different costumes for one practical workflow: collect preferences, convert them into a stable objective, and keep the model close enough to trusted behavior that offline wins have a chance to survive human review.</p>",
  "takeaways": [
    "Bradley-Terry turns pairwise preferences into probabilities through $\\sigma(r_w-r_l)$.",
    "PPO fine-tunes a policy with clipped probability ratios and usually a KL-to-reference penalty.",
    "DPO uses preference pairs directly, comparing policy log-ratios against reference log-ratios instead of training a separate reward model."
  ],
  "resources": [
    {
      "label": "OpenAI — Spinning Up in Deep RL",
      "note": "policy gradients and PPO"
    },
    {
      "label": "HuggingFace — RLHF / TRL",
      "note": "reward modeling + PPO/DPO in practice"
    },
    {
      "label": "DeepLearning.AI — RLHF",
      "note": "the RLHF pipeline end to end"
    }
  ],
  "papers": [
    "InstructGPT / Training LMs to follow instructions with human feedback (Ouyang et al., 2022)",
    "Proximal Policy Optimization (Schulman et al., 2017)",
    "Constitutional AI (Bai et al., 2022)"
  ],
  "notebook": [
    {
      "t": "md",
      "src": "# M23 · RLHF, DPO, PPO\n\n_AFP-AI · Domain 5 · Reinforcement learning_\n\n**Tune an assistant from preference signals without forgetting the reference model.**\n\nThis notebook builds the smallest useful RLHF playground: Bradley-Terry preferences, a KL-penalized policy objective, a PPO clipped term, and a DPO-style direct preference update."
    },
    {
      "t": "code",
      "src": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(23)"
    },
    {
      "t": "md",
      "src": "## Preference probability\n\nA reward model often starts from pairwise labels. If response $w$ beats response $l$, the Bradley-Terry model uses\n\n$$P(w \\succ l)=\\sigma(r_w-r_l).$$\n\nOnly the reward difference matters."
    },
    {
      "t": "code",
      "src": "def sigmoid(x):\n    return 1.0 / (1.0 + np.exp(-x))\n\nreward_winner = 1.4\nreward_loser = 0.2\npreference_prob = sigmoid(reward_winner - reward_loser)\n\nprint(round(preference_prob, 4))\nassert 0.76 < preference_prob < 0.77"
    },
    {
      "t": "md",
      "src": "## Tiny prompt-tuning policy\n\nPretend one Creative Intelligence prompt has three candidate completions. The reference model is safe but generic; the trainable policy shifts probability toward the preferred completion while paying a KL cost."
    },
    {
      "t": "code",
      "src": "actions = np.array([\"plain\", \"specific\", \"risky\"])\nref_logits = np.array([0.2, 0.1, -0.4])\npolicy_logits = np.array([0.0, 0.4, -0.5])\nrewards = np.array([0.1, 1.0, -0.2])\n\ndef softmax(z):\n    shifted = z - np.max(z)\n    weights = np.exp(shifted)\n    return weights / weights.sum()\n\nref_probs = softmax(ref_logits)\npolicy_probs = softmax(policy_logits)\n\nprint(pd.DataFrame({\"action\": actions, \"ref\": ref_probs, \"policy\": policy_probs, \"reward\": rewards}))\nassert np.isclose(policy_probs.sum(), 1.0)"
    },
    {
      "t": "md",
      "src": "## KL-penalized objective\n\nA simple RLHF objective is expected reward minus a reference penalty:\n\n$$J(\\pi)=\\sum_a \\pi(a) r(a)-\\beta\\sum_a \\pi(a)\\log\\frac{\\pi(a)}{\\pi_0(a)}.$$\n\nThe penalty keeps the tuned model near the model we trust."
    },
    {
      "t": "code",
      "src": "beta = 0.2\nexpected_reward = np.sum(policy_probs * rewards)\nkl_to_ref = np.sum(policy_probs * np.log(policy_probs / ref_probs))\nobjective = expected_reward - beta * kl_to_ref\n\nprint(\"expected reward\", round(expected_reward, 4))\nprint(\"kl to ref\", round(kl_to_ref, 4))\nprint(\"objective\", round(objective, 4))\nassert objective < expected_reward"
    },
    {
      "t": "md",
      "src": "## PPO clipped ratio term\n\nPPO updates from logged samples. For one sampled action, it compares the new probability to the old probability with $\\rho=\\pi_{new}(a)/\\pi_{old}(a)$ and clips the ratio before multiplying by the advantage."
    },
    {
      "t": "code",
      "src": "old_prob = 0.30\nnew_prob = 0.42\nadvantage = 0.80\nepsilon = 0.20\nratio = new_prob / old_prob\nclipped_ratio = np.clip(ratio, 1.0 - epsilon, 1.0 + epsilon)\nunclipped = ratio * advantage\nclipped = clipped_ratio * advantage\nppo_term = min(unclipped, clipped)\n\nprint(\"ratio\", round(ratio, 3))\nprint(\"unclipped\", round(unclipped, 3))\nprint(\"clipped\", round(clipped, 3))\nprint(\"ppo term\", round(ppo_term, 3))\nassert np.isclose(ppo_term, 0.96)"
    },
    {
      "t": "md",
      "src": "## DPO-style direct preference signal\n\nDPO skips an explicit reward model. It compares the policy log-ratio between winner and loser against the reference log-ratio, then pushes the winner up when the policy is not sufficiently better than reference."
    },
    {
      "t": "code",
      "src": "chosen = 1\nrejected = 0\npolicy_log_ratio = np.log(policy_probs[chosen]) - np.log(policy_probs[rejected])\nref_log_ratio = np.log(ref_probs[chosen]) - np.log(ref_probs[rejected])\nbeta_dpo = 0.5\nmargin = beta_dpo * (policy_log_ratio - ref_log_ratio)\ndpo_prob = sigmoid(margin)\n\nprint(\"dpo preference probability\", round(dpo_prob, 4))\nassert 0.5 < dpo_prob < 0.6"
    },
    {
      "t": "md",
      "src": "## Compare update families\n\nThe same data can support three views: learn a reward model from preferences, optimize with PPO under a KL guardrail, or optimize preferences directly with DPO."
    },
    {
      "t": "code",
      "src": "names = [\"BT preference\", \"KL objective\", \"PPO term\", \"DPO prob\"]\nvalues = [preference_prob, objective, ppo_term, dpo_prob]\n\nfig, ax = plt.subplots(figsize=(7, 3))\nax.bar(names, values, color=\"#4c78a8\")\nax.set_title(\"tiny RLHF calculations\")\nax.set_ylim(0.0, 1.1)\nplt.xticks(rotation=20)\nplt.show()"
    }
  ]
};

const M24 = {
  "m": 24,
  "domain": 5,
  "title": "Counterfactual / off-policy evaluation (IPS/DR)",
  "tagline": "Estimate a new policy from logged ads data before spending traffic on a risky experiment.",
  "skipIf": "estimate a policy's value from logged data using IPS/DR.",
  "mapsTo": [
    "Advanced"
  ],
  "connections": {
    "buildsOn": [
      "conditional probability",
      "expected value",
      "supervised reward models"
    ],
    "leadsTo": [
      "safe policy launch gates",
      "counterfactual learning",
      "causal evaluation"
    ],
    "usedWith": [
      "propensity scores",
      "importance sampling",
      "Doubly Robust estimators"
    ]
  },
  "motivation": "<p>Ads teams rarely get to try every policy live. A new bidding or directive policy may look promising, but launching it blindly can waste budget or harm member experience. Off-policy evaluation asks a careful question: given logs from yesterday's policy, what can we honestly infer about today's proposed policy?</p><p>The catch is selection bias. We only observe the reward for the action the logging policy actually took. IPS corrects that bias with propensity ratios; DR adds a reward model so the estimate can be lower variance while still correcting the model on the logged action.</p>",
  "definition": "<p><b>Definition.</b> Logged bandit data has rows $(x_i,a_i,p_i,r_i)$: context, logged action, logging propensity $p_i=\\pi_0(a_i|x_i)$, and reward. For a new policy $\\pi$, IPS estimates value by</p><p>$$\\hat V_{IPS}=\\frac{1}{n}\\sum_{i=1}^n r_i\\frac{\\pi(a_i|x_i)}{p_i}.$$</p><p>Self-normalized IPS divides by $\\sum_i \\pi(a_i|x_i)/p_i$. Doubly Robust adds a reward model $\\hat q(x,a)$ and corrects it with the observed residual on the logged action.</p>",
  "symbols": [
    {
      "sym": "$x_i$",
      "desc": "context for impression or auction $i$."
    },
    {
      "sym": "$a_i$",
      "desc": "the action actually taken by the logging policy."
    },
    {
      "sym": "$p_i$",
      "desc": "the probability that the logging policy assigned to $a_i$."
    },
    {
      "sym": "$r_i$",
      "desc": "the observed reward, such as click or value."
    },
    {
      "sym": "$\\pi(a|x)$",
      "desc": "the proposed policy being evaluated."
    },
    {
      "sym": "$\\hat q(x,a)$",
      "desc": "a learned reward model used by DR."
    }
  ],
  "derivation": [
    {
      "do": "Start from target value",
      "result": "$V(\\pi)=\\mathbb{E}_{x,a\\sim\\pi}[r]$",
      "why": "we need the reward under the new policy's action distribution"
    },
    {
      "do": "Rewrite under logged actions",
      "result": "$\\mathbb{E}_{a\\sim\\pi_0}[r\\,\\pi(a|x)/\\pi_0(a|x)]$",
      "why": "importance sampling changes the action distribution when propensities are nonzero"
    },
    {
      "do": "Replace the expectation by a sample average",
      "result": "$\\hat V_{IPS}=\\frac1n\\sum_i r_i\\pi(a_i|x_i)/p_i$",
      "why": "the logs provide one sampled action and reward per row"
    },
    {
      "do": "Add a model baseline",
      "result": "$\\hat q_\\pi(x_i)+w_i(r_i-\\hat q(x_i,a_i))$",
      "why": "DR uses the model for all actions and the weighted residual to correct logged-action bias"
    }
  ],
  "worked": {
    "problem": "Six logged rows have rewards $[0,1,0,1,1,0]$, propensities $[0.5,0.25,0.4,0.2,0.3,0.35]$, and new-policy probabilities on the logged actions $[0.2,0.5,0.1,0.6,0.45,0.25]$. Compute IPS. Then compute DR if $\\hat q_\\pi=[0.35,0.55,0.40,0.65,0.70,0.50]$ and $\\hat q(x_i,a_i)=[0.30,0.45,0.35,0.55,0.60,0.45]$.",
    "skills": [
      "importance weights",
      "IPS",
      "Doubly Robust"
    ],
    "strategy": "Compute weights first; reuse them for both IPS and the DR correction.",
    "steps": [
      {
        "do": "Compute weights",
        "result": "$w=[0.4,2.0,0.25,3.0,1.5,0.714]$",
        "why": "each is new probability divided by logging propensity"
      },
      {
        "do": "Multiply rewards by weights",
        "result": "$wr=[0,2.0,0,3.0,1.5,0]$",
        "why": "only observed rewards are reweighted"
      },
      {
        "do": "Average IPS terms",
        "result": "$(0+2+0+3+1.5+0)/6=1.0833$",
        "why": "IPS is the mean weighted reward"
      },
      {
        "do": "Compute DR residual terms",
        "result": "$w(r-\\hat q)=[-0.12,1.10,-0.0875,1.35,0.60,-0.321]$",
        "why": "the model error is corrected only for the logged action"
      },
      {
        "do": "Average DR terms",
        "result": "mean($\\hat q_\\pi + correction$)$\u0007pprox1.0369$",
        "why": "DR combines model predictions and weighted residuals"
      }
    ],
    "verify": "The largest weight is 3.0, so both estimates deserve a variance check before being trusted.",
    "answer": "IPS is about $1.083$ and DR is about $0.945$ for this tiny table.",
    "connects": "Off-policy evaluation lives or dies on the same ratio $\\pi/p$ that corrects logged action selection."
  },
  "practice": [
    {
      "problem": "A row has reward 1, logged propensity 0.25, and new-policy probability 0.10. What is its IPS contribution before averaging?",
      "steps": [
        {
          "do": "Compute the weight",
          "result": "$0.10/0.25=0.40$",
          "why": "the new policy chooses this logged action less often"
        },
        {
          "do": "Multiply by reward",
          "result": "$1\\cdot0.40=0.40$",
          "why": "IPS contribution is weighted reward"
        }
      ],
      "answer": "$0.40$."
    },
    {
      "problem": "Three IPS terms are $[0,2,1]$. Compute the IPS estimate.",
      "steps": [
        {
          "do": "Sum terms",
          "result": "$0+2+1=3$",
          "why": "IPS averages weighted rewards"
        },
        {
          "do": "Divide by row count",
          "result": "$3/3=1$",
          "why": "there are three logged rows"
        }
      ],
      "answer": "$1.0$."
    },
    {
      "problem": "Weights are $[0.5,2.0,1.5]$ and weighted rewards are $[0,2,1.5]$. Compute SNIPS.",
      "steps": [
        {
          "do": "Sum weighted rewards",
          "result": "$0+2+1.5=3.5$",
          "why": "this is the numerator"
        },
        {
          "do": "Sum weights",
          "result": "$0.5+2.0+1.5=4.0$",
          "why": "this is the self-normalizer"
        },
        {
          "do": "Divide",
          "result": "$3.5/4.0=0.875$",
          "why": "SNIPS normalizes by total weight"
        }
      ],
      "answer": "$0.875$."
    },
    {
      "problem": "For one DR row, $\\hat q_\\pi=0.4$, weight $w=2$, reward $r=1$, and logged-action model prediction $\\hat q=0.7$. Compute the DR term.",
      "steps": [
        {
          "do": "Compute residual",
          "result": "$1-0.7=0.3$",
          "why": "DR corrects model error on the logged action"
        },
        {
          "do": "Weight the residual",
          "result": "$2\\cdot0.3=0.6$",
          "why": "the correction uses the importance weight"
        },
        {
          "do": "Add model value",
          "result": "$0.4+0.6=1.0$",
          "why": "DR term is model value plus correction"
        }
      ],
      "answer": "$1.0$."
    },
    {
      "problem": "Why is a row with $p_i=0$ unusable for IPS if $\\pi(a_i|x_i)>0$?",
      "steps": [
        {
          "do": "Write the weight",
          "result": "$\\pi(a_i|x_i)/p_i$",
          "why": "IPS divides by the logging propensity"
        },
        {
          "do": "Substitute zero",
          "result": "$\\pi(a_i|x_i)/0$ is undefined",
          "why": "the logged policy never explored that action"
        },
        {
          "do": "Name the condition",
          "result": "support overlap is required",
          "why": "the new policy must not rely on actions absent from logs"
        }
      ],
      "answer": "IPS requires nonzero logging propensity wherever the new policy puts probability."
    }
  ],
  "applications": [
    {
      "title": "Off-policy evaluation of logged ads policies",
      "background": "Before a new pacing or bidding policy gets live traffic, teams can estimate value from historical randomized logs.",
      "numbers": "For 100k rows with average weighted reward 0.0063, IPS estimates a 0.63% reward rate; if the current policy is 0.0060, the lift estimate is $(0.0063-0.0060)/0.0060=5\\%$."
    },
    {
      "title": "Creative directive policy replay",
      "background": "A new directive selector may prefer different creative guidance than the logged selector, so propensities are the bridge.",
      "numbers": "A logged row with click 1, old propensity 0.20, and new probability 0.35 contributes $1\\cdot0.35/0.20=1.75$ clicks before averaging."
    },
    {
      "title": "Variance guardrail",
      "background": "Large weights make a few rows dominate and can turn a reassuring estimate into noise.",
      "numbers": "Weights $[1,1,1,10]$ have effective sample size $(13^2)/(1+1+1+100)=169/103\u0007pprox1.64$, not 4."
    },
    {
      "title": "Self-normalization for small slices",
      "background": "When evaluating a locale or industry slice, SNIPS can stabilize estimates when total weights drift from the row count.",
      "numbers": "If weighted rewards sum to 42 and weights sum to 7,000 across 10,000 rows, SNIPS is $42/7000=0.006$ while IPS is $42/10000=0.0042$."
    },
    {
      "title": "DR with a calibrated reward model",
      "background": "A response model trained on logged ads can provide low-variance predictions while IPS residuals protect against model bias.",
      "numbers": "If $\\hat q_\\pi=0.010$, $w=1.5$, $r=1$, and $\\hat q=0.020$, the DR term is $0.010+1.5(0.980)=1.48$ for that rare positive row."
    },
    {
      "title": "Launch decision confidence",
      "background": "OPE should report uncertainty, not just a point estimate, because logs are finite and propensities vary.",
      "numbers": "A slice estimate of 0.012 with bootstrap standard error 0.002 has a rough 95% interval $0.012\\pm1.96\\cdot0.002=[0.0081,0.0159]$."
    }
  ],
  "applicationsClose": "<p>Counterfactual evaluation is not magic; it is careful accounting. Propensities explain why the logged row appeared, reward models reduce noise, and support checks tell you when the logs simply cannot answer the launch question.</p>",
  "takeaways": [
    "IPS corrects logged-action bias with the ratio $\\pi(a_i|x_i)/p_i$.",
    "SNIPS often lowers variance by normalizing weights, at the cost of finite-sample bias.",
    "DR combines a reward model with an IPS correction and is strongest when propensities and model quality are both monitored."
  ],
  "resources": [
    {
      "label": "Open Bandit Pipeline (docs + paper)",
      "note": "off-policy estimators on real logged data"
    }
  ],
  "papers": [
    "Doubly Robust Policy Evaluation and Learning (Dudik et al., 2011)"
  ],
  "notebook": [
    {
      "t": "md",
      "src": "# M24 · Counterfactual / off-policy evaluation\n\n_AFP-AI · Domain 5 · Reinforcement learning_\n\n**Estimate a new ads policy from old logged traffic before risking an online test.**\n\nWe compute IPS, self-normalized IPS, and Doubly Robust estimates on a tiny logged bandit table."
    },
    {
      "t": "code",
      "src": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(24)"
    },
    {
      "t": "md",
      "src": "## Logged bandit feedback\n\nEach row contains context, logged action, logging propensity $p_{log}(a|x)$, and observed reward $r$. Off-policy evaluation asks for the value of a new policy $\\pi_{new}$ using only those rows."
    },
    {
      "t": "code",
      "src": "log = pd.DataFrame({\n    \"segment\": [\"cold\", \"cold\", \"warm\", \"warm\", \"hot\", \"hot\"],\n    \"action\": [\"A\", \"B\", \"A\", \"C\", \"B\", \"C\"],\n    \"p_log\": [0.50, 0.25, 0.40, 0.20, 0.30, 0.35],\n    \"reward\": [0.0, 1.0, 0.0, 1.0, 1.0, 0.0],\n    \"p_new\": [0.20, 0.50, 0.10, 0.60, 0.45, 0.25],\n})\n\nlog[\"weight\"] = log[\"p_new\"] / log[\"p_log\"]\nprint(log)\nassert np.all(log[\"p_log\"] > 0.0)"
    },
    {
      "t": "md",
      "src": "## IPS\n\nThe inverse propensity score estimator reweights rewards by how much more often the new policy would have chosen the logged action:\n\n$$\\hat V_{IPS}=\\frac{1}{n}\\sum_i r_i\\frac{\\pi_{new}(a_i|x_i)}{p_{log}(a_i|x_i)}.$$"
    },
    {
      "t": "code",
      "src": "ips_terms = log[\"reward\"] * log[\"weight\"]\nips_value = ips_terms.mean()\n\nprint(ips_terms.round(3).to_list())\nprint(round(ips_value, 4))\nassert np.isclose(ips_value, 1.0833333333333333)"
    },
    {
      "t": "md",
      "src": "## Self-normalized IPS\n\nSNIPS divides by the total weight. It often lowers variance, but it introduces a little bias in finite samples."
    },
    {
      "t": "code",
      "src": "snips_value = ips_terms.sum() / log[\"weight\"].sum()\n\nprint(round(snips_value, 4))\nassert 0.80 < snips_value < 0.85"
    },
    {
      "t": "md",
      "src": "## Doubly Robust\n\nDR uses a reward model $\\hat q(x,a)$ plus an IPS correction for the action actually observed. If either the model or propensities are right, DR can be reliable."
    },
    {
      "t": "code",
      "src": "q_new = np.array([0.35, 0.55, 0.40, 0.65, 0.70, 0.50])\nq_logged = np.array([0.30, 0.45, 0.35, 0.55, 0.60, 0.45])\ncorrection = log[\"weight\"].to_numpy() * (log[\"reward\"].to_numpy() - q_logged)\ndr_terms = q_new + correction\ndr_value = dr_terms.mean()\n\nprint(np.round(dr_terms, 3))\nprint(round(dr_value, 4))\nassert 0.90 < dr_value < 1.00"
    },
    {
      "t": "md",
      "src": "## Variance is the warning light\n\nLarge importance weights mean a small number of logged rows dominate the estimate. In production we inspect max weight and effective sample size before trusting the number."
    },
    {
      "t": "code",
      "src": "weights = log[\"weight\"].to_numpy()\neffective_n = weights.sum() ** 2 / np.sum(weights ** 2)\n\nprint(\"max weight\", round(weights.max(), 3))\nprint(\"effective n\", round(effective_n, 3))\nassert effective_n < len(weights)"
    },
    {
      "t": "md",
      "src": "## Visual check\n\nThe estimators answer the same question with different bias-variance trade-offs."
    },
    {
      "t": "code",
      "src": "names = [\"IPS\", \"SNIPS\", \"DR\"]\nvalues = [ips_value, snips_value, dr_value]\n\nfig, ax = plt.subplots(figsize=(5, 3))\nax.bar(names, values, color=\"#f58518\")\nax.set_ylim(0.0, 0.9)\nax.set_ylabel(\"estimated value\")\nax.set_title(\"off-policy estimates\")\nplt.show()"
    }
  ]
};

const M25 = {
  "m": 25,
  "domain": 5,
  "title": "Contextual bandits (explore/exploit)",
  "tagline": "Learn which directive or variant works while still sending enough traffic to discover better choices.",
  "skipIf": "frame directive/variant selection as a bandit.",
  "mapsTo": [
    "all"
  ],
  "connections": {
    "buildsOn": [
      "expected value",
      "Bernoulli rewards",
      "confidence intervals"
    ],
    "leadsTo": [
      "online experimentation",
      "personalized creative selection",
      "full reinforcement learning"
    ],
    "usedWith": [
      "regret",
      "UCB bonuses",
      "Bayesian posteriors"
    ]
  },
  "motivation": "<p>A/B tests answer a fixed question: which variant won after we split traffic? Bandits answer a more adaptive question: can we learn while sending more traffic to variants that already look promising? That is exactly the shape of directive selection, headline variant choice, and creative recommendation.</p><p>The tension is explore versus exploit. Epsilon-greedy explores by randomization, UCB explores by optimism for uncertain arms, and Thompson sampling explores by sampling from a posterior. Contextual bandits add member, advertiser, or creative features so the best arm can differ by context.</p>",
  "definition": "<p><b>Definition.</b> A bandit repeats rounds $t=1,\\dots,T$. It observes context $x_t$ if contextual, chooses action $a_t$, and observes reward $r_t$ only for that action. Regret compares the chosen rewards to the best available policy:</p><p>$$R_T=\\sum_{t=1}^T r_t(\\pi^*)-\\sum_{t=1}^T r_t(a_t).$$</p><p>UCB chooses $a=\u0007rg\\max_a \\hat\\mu_a+c\\sqrt{\\log t/n_a}$ in the context-free case. LinUCB replaces each arm mean with a linear prediction from context plus an uncertainty bonus.</p>",
  "symbols": [
    {
      "sym": "$a_t$",
      "desc": "the arm or variant chosen at round $t$."
    },
    {
      "sym": "$r_t$",
      "desc": "the observed reward for the chosen arm only."
    },
    {
      "sym": "$\\hat\\mu_a$",
      "desc": "empirical mean reward for arm $a$."
    },
    {
      "sym": "$n_a$",
      "desc": "number of times arm $a$ has been tried."
    },
    {
      "sym": "$c$",
      "desc": "exploration strength in UCB."
    },
    {
      "sym": "$R_T$",
      "desc": "cumulative regret against the best arm or policy."
    }
  ],
  "derivation": [
    {
      "do": "Estimate each arm mean",
      "result": "$\\hat\\mu_a=\\text{wins}_a/n_a$",
      "why": "the mean is the exploitation part"
    },
    {
      "do": "Add uncertainty",
      "result": "$c\\sqrt{\\log t/n_a}$",
      "why": "arms tried fewer times get larger bonuses"
    },
    {
      "do": "Choose the largest index",
      "result": "$a_t=\u0007rg\\max_a UCB_a$",
      "why": "optimism makes exploration targeted rather than purely random"
    },
    {
      "do": "Track regret",
      "result": "$\\mu^*-\\mu_{a_t}$ per round in expectation",
      "why": "regret measures the cost of learning"
    }
  ],
  "worked": {
    "problem": "Three creative variants have counts $n=[100,25,10]$, empirical CTRs $\\hat\\mu=[0.040,0.050,0.030]$, current round $t=136$, and $c=0.2$. Compute UCB indices and pick an arm. Contrast with greedy selection.",
    "skills": [
      "UCB index",
      "exploration bonus",
      "greedy baseline"
    ],
    "strategy": "Compute the confidence bonus for each arm, add it to the mean, and compare with the arm chosen by mean alone.",
    "steps": [
      {
        "do": "Compute $\\log t$",
        "result": "$\\log(136)\u0007pprox4.913$",
        "why": "the same time term appears in every bonus"
      },
      {
        "do": "Bonus for arm 1",
        "result": "$0.2\\sqrt{4.913/100}\u0007pprox0.0443$",
        "why": "many observations mean a smaller bonus"
      },
      {
        "do": "Bonus for arm 2",
        "result": "$0.2\\sqrt{4.913/25}\u0007pprox0.0887$",
        "why": "fewer observations create more optimism"
      },
      {
        "do": "Bonus for arm 3",
        "result": "$0.2\\sqrt{4.913/10}\u0007pprox0.1402$",
        "why": "the least-tested arm gets the largest bonus"
      },
      {
        "do": "Add means",
        "result": "UCB $\u0007pprox[0.0843,0.1387,0.1702]$",
        "why": "UCB chooses arm 3 even though its observed mean is lowest"
      }
    ],
    "verify": "Greedy would choose arm 2 because 0.050 is the largest empirical mean; UCB chooses arm 3 because uncertainty is still high.",
    "answer": "UCB selects variant 3; epsilon-greedy would usually select variant 2 and only sometimes explore variants 1 or 3.",
    "connects": "The exploration bonus is a disciplined way to buy information when creative evidence is still thin."
  },
  "practice": [
    {
      "problem": "With $\\epsilon=0.1$ and 1,000 rounds, how many random exploration rounds do you expect?",
      "steps": [
        {
          "do": "Use expectation",
          "result": "$\\epsilon T=0.1\\cdot1000$",
          "why": "epsilon is the exploration probability each round"
        },
        {
          "do": "Multiply",
          "result": "$0.1\\cdot1000=100$",
          "why": "expectation adds across rounds"
        }
      ],
      "answer": "About 100 exploration rounds."
    },
    {
      "problem": "An arm has 8 wins in 200 trials. What is its empirical CTR?",
      "steps": [
        {
          "do": "Divide wins by trials",
          "result": "$8/200=0.04$",
          "why": "CTR is mean Bernoulli reward"
        },
        {
          "do": "Convert to percent",
          "result": "$0.04=4\\%$",
          "why": "percent form is easier to read"
        }
      ],
      "answer": "$0.04$, or 4%."
    },
    {
      "problem": "Compute a UCB index with $\\hat\\mu=0.03$, $c=0.1$, $t=100$, and $n=25$.",
      "steps": [
        {
          "do": "Compute the log term",
          "result": "$\\log(100)\u0007pprox4.605$",
          "why": "UCB grows slowly with time"
        },
        {
          "do": "Compute the bonus",
          "result": "$0.1\\sqrt{4.605/25}\u0007pprox0.0429$",
          "why": "uncertainty shrinks with $n$"
        },
        {
          "do": "Add the mean",
          "result": "$0.03+0.0429=0.0729$",
          "why": "the index is mean plus bonus"
        }
      ],
      "answer": "Approximately $0.073$."
    },
    {
      "problem": "A Thompson arm has Beta posterior $\\operatorname{Beta}(11,91)$. What is its posterior mean?",
      "steps": [
        {
          "do": "Use the Beta mean",
          "result": "$\u0007lpha/(\u0007lpha+\\beta)$",
          "why": "Bernoulli Thompson sampling uses Beta posteriors"
        },
        {
          "do": "Substitute",
          "result": "$11/(11+91)=11/102$",
          "why": "alpha plus beta is total pseudo-count"
        },
        {
          "do": "Divide",
          "result": "$11/102\u0007pprox0.1078$",
          "why": "this is the posterior CTR mean"
        }
      ],
      "answer": "About $0.108$."
    },
    {
      "problem": "Best CTR is 5%, but you chose an arm with CTR 3% for 200 impressions. What is expected regret in clicks?",
      "steps": [
        {
          "do": "Compute the CTR gap",
          "result": "$0.05-0.03=0.02$",
          "why": "regret per impression is the missed expected reward"
        },
        {
          "do": "Multiply by impressions",
          "result": "$0.02\\cdot200=4$",
          "why": "expected regret accumulates over rounds"
        }
      ],
      "answer": "4 expected clicks."
    }
  ],
  "applications": [
    {
      "title": "Creative variant selection",
      "background": "Bandits can allocate more traffic to the variant that is winning while still reserving some impressions for learning.",
      "numbers": "If variants have estimated CTRs 3.0%, 3.4%, and 3.2%, greedy picks 3.4%; with $\\epsilon=0.1$ over 10,000 impressions, about 1,000 impressions still explore."
    },
    {
      "title": "Directive selection for generated ads",
      "background": "A directive such as benefit-led, proof-led, or urgency-led can be treated as an arm when only the shown directive receives feedback.",
      "numbers": "Counts $[500,100,50]$ and CTRs $[0.030,0.035,0.020]$ with $c=0.1,t=650$ give bonuses about $[0.011,0.025,0.036]$, so the third arm may still be explored."
    },
    {
      "title": "Thompson sampling for sparse advertisers",
      "background": "Bayesian posteriors are useful when an advertiser has little traffic and point estimates are unstable.",
      "numbers": "A Beta(2,38) arm has mean $2/40=0.05$; after one click it becomes Beta(3,38) with mean $3/41\u0007pprox0.073$."
    },
    {
      "title": "LinUCB for contextual personalization",
      "background": "The best creative may depend on context such as industry, device, or member seniority.",
      "numbers": "If a context score is 0.04 and the uncertainty bonus is 0.015, LinUCB index is 0.055; another arm with score 0.045 and bonus 0.004 has index 0.049."
    },
    {
      "title": "Regret reporting",
      "background": "Regret translates exploration cost into expected missed outcomes, making learning trade-offs concrete.",
      "numbers": "Choosing a 4.0% arm instead of a 4.5% best arm for 20,000 impressions costs $(0.045-0.040)\\cdot20000=100$ expected clicks."
    },
    {
      "title": "Cold-start exploration budget",
      "background": "New Event Ads or Instream variants need initial evidence before ranking can be confident.",
      "numbers": "Trying 4 variants for 250 impressions each creates 1,000 exploration impressions; at 3% CTR, expect $1000\\cdot0.03=30$ clicks across the warm-up."
    }
  ],
  "applicationsClose": "<p>Bandits are the middle ground between static experiments and full RL. They fit when the action matters now, the feedback is partial, and tomorrow's state is mostly unchanged by today's choice.</p>",
  "takeaways": [
    "Bandits observe reward only for the chosen action, so exploration is not optional.",
    "UCB explores through optimism, epsilon-greedy through randomization, and Thompson sampling through posterior samples.",
    "Contextual bandits personalize the arm choice without modeling long-term state transitions."
  ],
  "resources": [
    {
      "label": "Bandit Algorithms (Lattimore & Szepesvari)",
      "note": "the rigorous reference"
    },
    {
      "label": "Vowpal Wabbit — contextual bandits tutorial",
      "note": "practical CB training"
    }
  ],
  "papers": [
    "LinUCB — A Contextual-Bandit Approach to News Article Recommendation (Li et al., 2010)",
    "An Empirical Evaluation of Thompson Sampling (Chapelle & Li, 2011)"
  ],
  "notebook": [
    {
      "t": "md",
      "src": "# M25 · Contextual bandits\n\n_AFP-AI · Domain 5 · Reinforcement learning_\n\n**Choose creative variants while learning which one works.**\n\nWe compare epsilon-greedy, UCB, and Thompson sampling on a deterministic Bernoulli-bandit simulation."
    },
    {
      "t": "code",
      "src": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(25)"
    },
    {
      "t": "md",
      "src": "## Bandit objective\n\nA bandit chooses an action, observes only that action's reward, and repeats. Regret compares your reward with the best arm in hindsight:\n\n$$R_T = T\\mu^* - \\sum_{t=1}^T r_t.$$"
    },
    {
      "t": "code",
      "src": "true_ctr = np.array([0.035, 0.045, 0.055])\narm_names = np.array([\"benefit\", \"proof\", \"urgency\"])\nrounds = 600\n\nprint(pd.DataFrame({\"arm\": arm_names, \"true_ctr\": true_ctr}))\nassert true_ctr.argmax() == 2"
    },
    {
      "t": "md",
      "src": "## Epsilon-greedy\n\nMost rounds exploit the current best empirical mean; a small fraction explores a random arm."
    },
    {
      "t": "code",
      "src": "def run_epsilon(epsilon):\n    counts = np.zeros(3)\n    wins = np.zeros(3)\n    rewards = []\n    choices = []\n    for t in range(rounds):\n        if rng.random() < epsilon or counts.sum() == 0:\n            arm = rng.integers(3)\n        else:\n            means = wins / np.maximum(counts, 1)\n            arm = int(np.argmax(means))\n        reward = float(rng.random() < true_ctr[arm])\n        counts[arm] = counts[arm] + 1\n        wins[arm] = wins[arm] + reward\n        rewards.append(reward)\n        choices.append(arm)\n    return np.array(rewards), np.array(choices), counts\n\neps_rewards, eps_choices, eps_counts = run_epsilon(0.10)\nprint(eps_counts.astype(int))\nassert eps_counts.sum() == rounds"
    },
    {
      "t": "md",
      "src": "## UCB\n\nUCB adds optimism to arms with fewer observations:\n\n$$UCB_a = \\hat\\mu_a + c\\sqrt{\\frac{\\log t}{n_a}}.$$\n\nThat bonus is the exploration engine."
    },
    {
      "t": "code",
      "src": "def run_ucb(c):\n    counts = np.ones(3)\n    wins = np.array([float(rng.random() < p) for p in true_ctr])\n    rewards = wins.tolist()\n    choices = [0, 1, 2]\n    for t in range(3, rounds):\n        means = wins / counts\n        bonus = c * np.sqrt(np.log(t + 1) / counts)\n        arm = int(np.argmax(means + bonus))\n        reward = float(rng.random() < true_ctr[arm])\n        counts[arm] = counts[arm] + 1\n        wins[arm] = wins[arm] + reward\n        rewards.append(reward)\n        choices.append(arm)\n    return np.array(rewards), np.array(choices), counts\n\nucb_rewards, ucb_choices, ucb_counts = run_ucb(0.4)\nprint(ucb_counts.astype(int))\nassert ucb_counts.sum() == rounds"
    },
    {
      "t": "md",
      "src": "## Thompson sampling\n\nFor Bernoulli rewards, a Beta posterior is convenient. Thompson samples one plausible CTR per arm and chooses the largest sample."
    },
    {
      "t": "code",
      "src": "def run_thompson():\n    alpha = np.ones(3)\n    beta = np.ones(3)\n    rewards = []\n    choices = []\n    for t in range(rounds):\n        samples = rng.beta(alpha, beta)\n        arm = int(np.argmax(samples))\n        reward = float(rng.random() < true_ctr[arm])\n        alpha[arm] = alpha[arm] + reward\n        beta[arm] = beta[arm] + 1.0 - reward\n        rewards.append(reward)\n        choices.append(arm)\n    return np.array(rewards), np.array(choices), alpha, beta\n\nts_rewards, ts_choices, ts_alpha, ts_beta = run_thompson()\nprint(np.round(ts_alpha / (ts_alpha + ts_beta), 4))\nassert len(ts_rewards) == rounds"
    },
    {
      "t": "md",
      "src": "## Regret comparison\n\nLower regret means the algorithm found the useful creative faster."
    },
    {
      "t": "code",
      "src": "best_rate = true_ctr.max()\neps_regret = np.cumsum(best_rate - eps_rewards)\nucb_regret = np.cumsum(best_rate - ucb_rewards)\nts_regret = np.cumsum(best_rate - ts_rewards)\n\nprint(round(eps_regret[-1], 2))\nprint(round(ucb_regret[-1], 2))\nprint(round(ts_regret[-1], 2))\nassert np.isfinite(ts_regret[-1])"
    },
    {
      "t": "md",
      "src": "## Plot the learning curves\n\nA single run is noisy by design, which is why bandit evaluations use many seeds. The mechanics are still visible in one small run."
    },
    {
      "t": "code",
      "src": "fig, ax = plt.subplots(figsize=(6, 3))\nax.plot(eps_regret, label=\"epsilon\")\nax.plot(ucb_regret, label=\"ucb\")\nax.plot(ts_regret, label=\"thompson\")\nax.set_title(\"cumulative regret\")\nax.set_xlabel(\"round\")\nax.set_ylabel(\"regret\")\nax.legend()\nplt.show()"
    }
  ]
};

const M26 = {
  "m": 26,
  "domain": 5,
  "title": "RL foundations (MDPs, value/policy, policy gradients) + where RL fits ads",
  "tagline": "Model decisions whose consequences change the next decision, not just the current reward.",
  "skipIf": "state an MDP and explain the bandit vs full-RL trade-offs.",
  "mapsTo": [
    "Instream Ads perf",
    "Event Ads perf"
  ],
  "connections": {
    "buildsOn": [
      "expected value",
      "dynamic programming",
      "gradient ascent"
    ],
    "leadsTo": [
      "pacing and bidding agents",
      "policy-gradient methods",
      "safe sequential experimentation"
    ],
    "usedWith": [
      "Bellman equations",
      "value iteration",
      "REINFORCE"
    ]
  },
  "motivation": "<p>A bandit is enough when choosing a creative variant does not meaningfully change tomorrow's situation. Pacing and bidding are different: spending too much now changes remaining budget, delivery pressure, and future opportunities. The action has consequences, so the state must remember them.</p><p>Reinforcement learning gives names to that loop: states, actions, transition probabilities, rewards, and discounting. Value methods compute how good states or state-action pairs are; policy gradients directly improve the action distribution from sampled returns.</p>",
  "definition": "<p><b>Definition.</b> A Markov Decision Process is $(\\mathcal{S},\\mathcal{A},P,R,\\gamma)$. In state $s$, action $a$ moves to $s'$ with probability $P(s'|s,a)$ and reward $R(s,a,s')$. The optimal value satisfies the Bellman equation</p><p>$$V^*(s)=\\max_a \\sum_{s'}P(s'|s,a)\\left[R(s,a,s')+\\gamma V^*(s')\\right].$$</p><p>Policy gradients optimize a parameterized policy with $\\nabla J(\\theta)=\\mathbb{E}[\\nabla_\\theta\\log\\pi_\\theta(a_t|s_t)G_t]$ in the REINFORCE form.</p>",
  "symbols": [
    {
      "sym": "$\\mathcal{S}$",
      "desc": "the state space, such as budget pacing state."
    },
    {
      "sym": "$\\mathcal{A}$",
      "desc": "the action space, such as bid low or bid high."
    },
    {
      "sym": "$P(s'|s,a)$",
      "desc": "transition probability after taking action $a$ in state $s$."
    },
    {
      "sym": "$R(s,a,s')$",
      "desc": "reward for that transition."
    },
    {
      "sym": "$\\gamma$",
      "desc": "discount factor for future reward."
    },
    {
      "sym": "$V(s),Q(s,a)$",
      "desc": "state value and state-action value."
    },
    {
      "sym": "$G_t$",
      "desc": "sampled return from time $t$ onward."
    }
  ],
  "derivation": [
    {
      "do": "Condition on the first action",
      "result": "$a$ chosen in state $s$",
      "why": "sequential value starts with a decision now"
    },
    {
      "do": "Average over next states",
      "result": "$\\sum_{s'}P(s'|s,a)[R(s,a,s')+\\gamma V(s')]$",
      "why": "the action has stochastic consequences"
    },
    {
      "do": "Choose the best action",
      "result": "$V^*(s)=\\max_a$ of that quantity",
      "why": "optimal control picks the largest expected long-term value"
    },
    {
      "do": "For a policy gradient, score the sampled action",
      "result": "$\\nabla_\\theta\\log\\pi_\\theta(a_t|s_t)G_t$",
      "why": "actions with positive return become more likely; negative-return actions become less likely"
    }
  ],
  "worked": {
    "problem": "A tiny pacing MDP has states under, on-track, over and actions low, high. With $V_0=0$, transition and reward give expected immediate rewards: low $[0.35,0.63,-0.02]$ and high $[0.695,0.465,-0.43]$. Compute one value-iteration sweep and the greedy action in each state.",
    "skills": [
      "Bellman update",
      "value iteration",
      "policy extraction"
    ],
    "strategy": "Because $V_0=0$, the first Bellman update is just the maximum expected immediate reward for each state.",
    "steps": [
      {
        "do": "Write the under-state action values",
        "result": "low $=0.35$, high $=0.695$",
        "why": "future value is zero in the first sweep"
      },
      {
        "do": "Maximize for under",
        "result": "$V_1(under)=0.695$",
        "why": "high has the larger immediate expected reward"
      },
      {
        "do": "Write the on-track action values",
        "result": "low $=0.63$, high $=0.465$",
        "why": "low is larger because it protects future pacing"
      },
      {
        "do": "Maximize for on-track",
        "result": "$V_1(on)=0.63$",
        "why": "the lower bid has the larger expected immediate value"
      },
      {
        "do": "Maximize for over",
        "result": "$V_1(over)=\\max(-0.02,-0.43)=-0.02$",
        "why": "low avoids the larger over-delivery penalty"
      }
    ],
    "verify": "The over state chooses low because high bidding makes the negative reward more likely; that matches pacing intuition.",
    "answer": "$V_1=[0.695,0.63,-0.02]$ with greedy actions [high, low, low].",
    "connects": "Value iteration is Bellman's equation turned into repeated arithmetic over a sequential ads state."
  },
  "practice": [
    {
      "problem": "An action leads to rewards 1 with probability 0.7 and 0 with probability 0.3. If next-state value is zero, what is its one-step value?",
      "steps": [
        {
          "do": "Multiply reward by probability",
          "result": "$0.7\\cdot1=0.7$",
          "why": "only the rewarding outcome contributes"
        },
        {
          "do": "Add the zero outcome",
          "result": "$0.7+0.3\\cdot0=0.7$",
          "why": "expected value averages all outcomes"
        }
      ],
      "answer": "$0.7$."
    },
    {
      "problem": "Compute $1+\\gamma V(s')$ for $\\gamma=0.9$ and $V(s')=3$.",
      "steps": [
        {
          "do": "Discount the future value",
          "result": "$0.9\\cdot3=2.7$",
          "why": "future reward is worth less than immediate reward"
        },
        {
          "do": "Add immediate reward",
          "result": "$1+2.7=3.7$",
          "why": "Bellman backup adds now plus discounted future"
        }
      ],
      "answer": "$3.7$."
    },
    {
      "problem": "Two actions have Bellman values 2.4 and 2.1. What is $V(s)$ under the optimal Bellman update?",
      "steps": [
        {
          "do": "List action values",
          "result": "$Q(s,a_1)=2.4$, $Q(s,a_2)=2.1$",
          "why": "the value update compares actions"
        },
        {
          "do": "Take the maximum",
          "result": "$\\max(2.4,2.1)=2.4$",
          "why": "optimal value uses the best action"
        }
      ],
      "answer": "$V(s)=2.4$."
    },
    {
      "problem": "A softmax policy chooses an action with probability 0.25. The sampled return is 4. What scalar multiplies $\\nabla\\log\\pi(a|s)$ in REINFORCE?",
      "steps": [
        {
          "do": "Identify the REINFORCE term",
          "result": "$\\nabla\\log\\pi(a|s)G$",
          "why": "the return is the scalar multiplier"
        },
        {
          "do": "Read the return",
          "result": "$G=4$",
          "why": "the probability affects the log-gradient, not this scalar"
        }
      ],
      "answer": "The multiplier is 4."
    },
    {
      "problem": "For choosing a headline variant independently on each impression, should you start with a bandit or full RL? Why?",
      "steps": [
        {
          "do": "Check whether state changes",
          "result": "the headline choice does not materially change future budget state",
          "why": "without delayed consequences, full MDP structure adds little"
        },
        {
          "do": "Pick the simpler tool",
          "result": "use a contextual bandit",
          "why": "it handles partial feedback and exploration directly"
        }
      ],
      "answer": "Start with a contextual bandit; use full RL when actions change future state such as pacing or budget."
    }
  ],
  "applications": [
    {
      "title": "Instream Ads pacing",
      "background": "Video ad delivery has budget and opportunity state, so spending aggressively now changes future delivery quality.",
      "numbers": "With $\\gamma=0.9$, an immediate value 0.4 plus next-state value 1.2 gives $0.4+0.9\\cdot1.2=1.48$."
    },
    {
      "title": "Event Ads bidding",
      "background": "Event campaigns may need attendance by a deadline, making bid choices sequential rather than independent.",
      "numbers": "If high bid gets expected reward 0.8 but moves to an over-spend state worth -0.3, its backed-up value is $0.8+0.9(-0.3)=0.53$."
    },
    {
      "title": "Bandit boundary for creative selection",
      "background": "If a creative choice affects only the current impression reward, a contextual bandit is usually simpler and safer than RL.",
      "numbers": "A 4.2% CTR arm versus a 4.0% arm over 50,000 impressions has immediate expected gain $(0.042-0.040)\\cdot50000=100$ clicks, with no future state needed."
    },
    {
      "title": "Value iteration for small simulators",
      "background": "Before training an agent, a tiny MDP simulator can expose whether reward design matches business intuition.",
      "numbers": "If low bid value is $0.3+0.9\\cdot1.0=1.2$ and high bid value is $0.6+0.9\\cdot0.5=1.05$, the optimal action is low despite lower immediate reward."
    },
    {
      "title": "Policy gradient for stochastic bidding",
      "background": "A differentiable policy can learn bid probabilities from sampled returns when transitions are too large for tabular value iteration.",
      "numbers": "If $\\nabla\\log\\pi=[-0.3,0.3]$ and return is 2, the REINFORCE estimate is $[-0.6,0.6]$, increasing the sampled action's logit."
    },
    {
      "title": "Reward design guardrails",
      "background": "Ads RL needs rewards that balance advertiser value, member experience, and budget health, not a single click signal.",
      "numbers": "A reward $1.0\\cdot click -0.2\\cdot hide -0.1\\cdot overspend$ gives $1-0-0.1=0.9$ for a click with one overspend unit, but $0-0.2-0= -0.2$ for a hide."
    }
  ],
  "applicationsClose": "<p>Full RL earns its complexity only when actions change future state. For AFP-AI, that points to pacing and bidding; for isolated variant selection, a contextual bandit usually gives the cleanest learning loop.</p>",
  "takeaways": [
    "An MDP models sequential decisions with states, actions, transition probabilities, rewards, and discounting.",
    "Bellman updates compute value as immediate reward plus discounted future value, maximized over actions.",
    "Use bandits for independent partial-feedback choices; use full RL when today's action changes tomorrow's state."
  ],
  "resources": [
    {
      "label": "OpenAI — Spinning Up in Deep RL",
      "note": "MDPs to policy gradients with code"
    },
    {
      "label": "Sutton & Barto — Reinforcement Learning",
      "note": "the foundational textbook"
    },
    {
      "label": "David Silver — RL course (DeepMind)",
      "note": "lectures on value/policy methods"
    }
  ],
  "papers": [
    "Proximal Policy Optimization (Schulman et al., 2017)",
    "Playing Atari with Deep RL / DQN (Mnih et al., 2013/2015)",
    "Real-Time Bidding by Reinforcement Learning in Display Advertising (Cai et al., 2017)"
  ],
  "notebook": [
    {
      "t": "md",
      "src": "# M26 · RL foundations\n\n_AFP-AI · Domain 5 · Reinforcement learning_\n\n**State an MDP, compute values, and know when full RL is worth the complexity.**\n\nWe build a tiny pacing MDP and run value iteration, then compute one REINFORCE policy-gradient term."
    },
    {
      "t": "code",
      "src": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(26)"
    },
    {
      "t": "md",
      "src": "## MDP pieces\n\nAn MDP is $(\\mathcal{S},\\mathcal{A},P,R,\\gamma)$. The Bellman optimality update is\n\n$$V_{new}(s)=\\max_a \\sum_{s'} P(s'|s,a)[R(s,a,s')+\\gamma V(s')].$$"
    },
    {
      "t": "code",
      "src": "states = np.array([\"under\", \"on_track\", \"over\"])\nactions = np.array([\"bid_low\", \"bid_high\"])\ngamma = 0.9\n\nT = np.array([\n    [[0.70, 0.30, 0.00], [0.20, 0.70, 0.10], [0.00, 0.30, 0.70]],\n    [[0.25, 0.65, 0.10], [0.05, 0.55, 0.40], [0.00, 0.10, 0.90]],\n])\n\nR = np.array([\n    [[0.2, 0.7, 0.0], [0.3, 0.8, 0.1], [0.0, 0.4, -0.2]],\n    [[0.1, 1.0, 0.2], [0.2, 0.9, -0.1], [0.0, 0.2, -0.5]],\n])\n\nassert np.allclose(T.sum(axis=2), 1.0)"
    },
    {
      "t": "md",
      "src": "## One Bellman sweep\n\nStart with $V_0(s)=0$. The first sweep only sees immediate expected reward, because the future value term is zero."
    },
    {
      "t": "code",
      "src": "V = np.zeros(3)\nq_values = np.sum(T * (R + gamma * V), axis=2)\nV_one = q_values.max(axis=0)\nbest_actions = actions[q_values.argmax(axis=0)]\n\nprint(pd.DataFrame({\"state\": states, \"V1\": V_one, \"best_action\": best_actions}))\nassert V_one[2] < 0.0"
    },
    {
      "t": "md",
      "src": "## Value iteration\n\nRepeating the Bellman update propagates future consequences backward through the states."
    },
    {
      "t": "code",
      "src": "history = [V.copy()]\nfor k in range(20):\n    q_values = np.sum(T * (R + gamma * V), axis=2)\n    V = q_values.max(axis=0)\n    history.append(V.copy())\n\npolicy = actions[q_values.argmax(axis=0)]\nprint(np.round(V, 3))\nprint(policy)\nassert V[1] > V[2]"
    },
    {
      "t": "md",
      "src": "## Bandit or full RL\n\nIf today's creative choice does not change tomorrow's state, use a bandit. If spending now changes future budget state, pacing, or eligibility, the sequential state matters and an MDP is the right abstraction."
    },
    {
      "t": "code",
      "src": "bandit_rows = pd.DataFrame({\n    \"problem\": [\"variant pick\", \"budget pacing\"],\n    \"state_changes\": [False, True],\n    \"tool\": [\"bandit\", \"MDP or RL\"],\n})\n\nprint(bandit_rows)\nassert bandit_rows.loc[1, \"tool\"] == \"MDP or RL\""
    },
    {
      "t": "md",
      "src": "## One REINFORCE term\n\nPolicy gradients use sampled returns. For a softmax policy, the update direction is proportional to $\\nabla \\log \\pi(a|s)G$."
    },
    {
      "t": "code",
      "src": "logits = np.array([0.2, -0.1])\nexp_logits = np.exp(logits - logits.max())\nprobs = exp_logits / exp_logits.sum()\naction = 1\nreturn_G = 2.5\none_hot = np.array([0.0, 1.0])\ngrad_log_prob = one_hot - probs\ngrad_estimate = grad_log_prob * return_G\n\nprint(\"probs\", np.round(probs, 3))\nprint(\"gradient estimate\", np.round(grad_estimate, 3))\nassert np.isclose(grad_estimate.sum(), 0.0)"
    },
    {
      "t": "md",
      "src": "## Plot value convergence\n\nThe values stabilize as the Bellman updates converge."
    },
    {
      "t": "code",
      "src": "hist = np.array(history)\nfig, ax = plt.subplots(figsize=(6, 3))\nfor idx, state in enumerate(states):\n    ax.plot(hist[:, idx], label=state)\nax.set_xlabel(\"iteration\")\nax.set_ylabel(\"value\")\nax.set_title(\"value iteration\")\nax.legend()\nplt.show()"
    }
  ]
};

module.exports = [M23, M24, M25, M26];
