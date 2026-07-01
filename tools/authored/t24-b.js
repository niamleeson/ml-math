module.exports = {
  "math-24-11": {
    "id": "math-24-11",
    "title": "The minimax theorem",
    "tagline": "Minimax says that in the right zero-sum game, guarding against the worst case is the same as facing an optimal opponent.",
    "connections": {
      "buildsOn": [
        "matrix games",
        "mixed strategies",
        "expected value",
        "linear inequalities"
      ],
      "leadsTo": [
        "Extensive-form games",
        "GANs as minimax; multi-agent RL",
        "duality in optimization"
      ],
      "usedWith": [
        "convex sets",
        "linear programming",
        "Nash equilibrium",
        "saddle points"
      ]
    },
    "motivation": "<p>You already know how to choose safely: if one route can take 20 or 60 minutes and another reliably takes 35, the worst-case lens may prefer the reliable route. Zero-sum games make that instinct precise.</p><p>The <b>minimax theorem</b> is the comforting surprise: when two players mix among finitely many actions and one player's gain is the other's loss, the row player can secure a value and the column player can hold them to that same value. Defense and attack meet at one number.</p>",
    "definition": "<p>In a finite two-player zero-sum game with payoff matrix $A$, the row player chooses a mixed strategy $p$ and the column player chooses a mixed strategy $q$. The row player's expected payoff is $p^T A q$. The minimax theorem states $$\\max_p\\min_q p^T A q=\\min_q\\max_p p^T A q.$$ The shared number is the <b>value</b> of the game.</p><p>Why the equality is special: for any fixed $p$ and $q$, the worst column response to $p$ is no larger than the best row response to $q$, so $\\max_p\\min_q p^T A q\\le\\min_q\\max_p p^T A q$ is easy. The theorem says finite mixed strategies and linear expected payoffs close the gap.</p><p><b>Assumptions that matter:</b> the action sets are finite; players may randomize with probabilities that sum to $1$; payoffs are zero-sum; and both players evaluate strategies by expected payoff.</p>",
    "worked": {
      "problem": "Find the value and optimal row mix for $A=\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}$.",
      "skills": [
        "mixed strategies",
        "worst-case payoff",
        "equalizing"
      ],
      "strategy": "The opponent picks the weaker column — choose the row probability that makes both columns equally good.",
      "steps": [
        {
          "do": "Let row play top with probability $p$",
          "result": "bottom has probability $1-p$",
          "why": "a mixed strategy assigns probabilities summing to 1"
        },
        {
          "do": "Compute payoff if column chooses left",
          "result": "$2p$",
          "why": "top-left pays 2 and bottom-left pays 0"
        },
        {
          "do": "Compute payoff if column chooses right",
          "result": "$1-p$",
          "why": "top-right pays 0 and bottom-right pays 1"
        },
        {
          "do": "Equalize the two column payoffs",
          "result": "$2p=1-p$",
          "why": "the worst of two numbers is largest when they are balanced"
        },
        {
          "do": "Solve for $p$",
          "result": "$p=\\tfrac13$",
          "why": "add $p$ and divide by 3"
        },
        {
          "do": "Compute the secured value",
          "result": "$2p=\\tfrac23$",
          "why": "both columns now give the same payoff"
        }
      ],
      "verify": "If $p$ were larger, the right column would be worse; if smaller, the left column would be worse. At $p=1/3$, neither column can punish more.",
      "answer": "The row player's optimal mix is $(\\tfrac13,\\tfrac23)$ and the game value is $\\tfrac23$.",
      "connects": "The minimax value is the payoff both players can force when each prepares for the other's best response."
    },
    "practice": [
      {
        "problem": "For $A=\\begin{pmatrix}3&0\\\\0&2\\end{pmatrix}$, find the row mix that maximizes the guaranteed payoff.",
        "steps": [
          {
            "do": "Let top probability be $p$",
            "result": "bottom probability is $1-p$",
            "why": "two rows exhaust the choices"
          },
          {
            "do": "Write left-column payoff",
            "result": "$3p$",
            "why": "only top-left contributes"
          },
          {
            "do": "Write right-column payoff",
            "result": "$2(1-p)$",
            "why": "only bottom-right contributes"
          },
          {
            "do": "Equalize payoffs",
            "result": "$3p=2-2p$",
            "why": "balance the opponent's two punishments"
          },
          {
            "do": "Solve",
            "result": "$5p=2$, so $p=0.4$",
            "why": "collect like terms"
          },
          {
            "do": "Find the value",
            "result": "$3(0.4)=1.2$",
            "why": "both columns match"
          }
        ],
        "answer": "Play top with probability $0.4$; the guaranteed payoff is $1.2$."
      },
      {
        "problem": "For row mix $p=(0.6,0.4)$ in $A=\\begin{pmatrix}1&4\\\\3&0\\end{pmatrix}$, compute the worst-case payoff.",
        "steps": [
          {
            "do": "Compute payoff against left",
            "result": "$0.6\\cdot1+0.4\\cdot3=1.8$",
            "why": "use expected payoff"
          },
          {
            "do": "Compute payoff against right",
            "result": "$0.6\\cdot4+0.4\\cdot0=2.4$",
            "why": "use expected payoff"
          },
          {
            "do": "Take the smaller payoff",
            "result": "$\\min(1.8,2.4)=1.8$",
            "why": "the column player minimizes row payoff"
          },
          {
            "do": "Identify the punishing column",
            "result": "left",
            "why": "left gives the smaller expectation"
          }
        ],
        "answer": "The worst-case payoff is $1.8$, achieved when the column player chooses left."
      },
      {
        "problem": "For $A=\\begin{pmatrix}1&5\\\\4&2\\end{pmatrix}$, find the row player's equalizing mix and value.",
        "steps": [
          {
            "do": "Let top probability be $p$",
            "result": "bottom probability is $1-p$",
            "why": "set up the mixed row strategy"
          },
          {
            "do": "Compute left payoff",
            "result": "$p+4(1-p)=4-3p$",
            "why": "weight the left column entries"
          },
          {
            "do": "Compute right payoff",
            "result": "$5p+2(1-p)=2+3p$",
            "why": "weight the right column entries"
          },
          {
            "do": "Equalize",
            "result": "$4-3p=2+3p$",
            "why": "maximize the smaller column payoff"
          },
          {
            "do": "Solve",
            "result": "$p=\\tfrac13$",
            "why": "$2=6p$"
          },
          {
            "do": "Compute value",
            "result": "$4-3(\\tfrac13)=3$",
            "why": "substitute back"
          }
        ],
        "answer": "The equalizing row mix is $(\\tfrac13,\\tfrac23)$ and the secured value is $3$."
      },
      {
        "problem": "For matching pennies with payoff $A=\\begin{pmatrix}1&-1\\\\-1&1\\end{pmatrix}$, show that the fair mix has value $0$.",
        "steps": [
          {
            "do": "Let heads probability be $p$",
            "result": "tails probability is $1-p$",
            "why": "row randomizes between two actions"
          },
          {
            "do": "Compute payoff if column plays heads",
            "result": "$p-(1-p)=2p-1$",
            "why": "matching wins, mismatching loses"
          },
          {
            "do": "Compute payoff if column plays tails",
            "result": "$-p+(1-p)=1-2p$",
            "why": "signs reverse"
          },
          {
            "do": "Equalize",
            "result": "$2p-1=1-2p$",
            "why": "balance both pure responses"
          },
          {
            "do": "Solve",
            "result": "$p=\\tfrac12$",
            "why": "$4p=2$"
          },
          {
            "do": "Compute value",
            "result": "$0$",
            "why": "both expressions become 0"
          }
        ],
        "answer": "The fair mix $(\\tfrac12,\\tfrac12)$ guarantees value $0$."
      },
      {
        "problem": "A robust classifier chooses model A or B. Under attack 1, accuracies are $0.80,0.60$; under attack 2, accuracies are $0.50,0.75$. Find the mix maximizing worst-case accuracy.",
        "steps": [
          {
            "do": "Let model A probability be $p$",
            "result": "model B probability is $1-p$",
            "why": "randomize across models"
          },
          {
            "do": "Compute attack 1 accuracy",
            "result": "$0.80p+0.60(1-p)=0.60+0.20p$",
            "why": "expected accuracy under attack 1"
          },
          {
            "do": "Compute attack 2 accuracy",
            "result": "$0.50p+0.75(1-p)=0.75-0.25p$",
            "why": "expected accuracy under attack 2"
          },
          {
            "do": "Equalize attacks",
            "result": "$0.60+0.20p=0.75-0.25p$",
            "why": "best robust mix balances vulnerabilities"
          },
          {
            "do": "Solve",
            "result": "$0.45p=0.15$, so $p=\\tfrac13$",
            "why": "subtract and divide"
          },
          {
            "do": "Compute worst-case accuracy",
            "result": "$0.60+0.20/3\\approx0.667$",
            "why": "both attacks match"
          }
        ],
        "answer": "Use model A with probability $1/3$ and model B with probability $2/3$; worst-case accuracy is about $0.667$."
      }
    ],
    "applications": [
      {
        "title": "Robust model selection",
        "background": "Security-minded ML often chooses models against possible attacks. The minimax view asks for the best guaranteed performance, not the best average story.",
        "numbers": "If model A gets $90\\%$ clean and $50\\%$ attacked while B gets $75\\%$ clean and $70\\%$ attacked, a $50$-$50$ mix gives clean $82.5\\%$ and attacked $60\\%$; the guaranteed rate is $60\\%$."
      },
      {
        "title": "Adversarial training",
        "background": "Adversarial training pits a predictor against perturbations that try to raise loss. The learner minimizes the worst loss the attacker can create.",
        "numbers": "If loss is $0.20$ on normal data and $0.55$ after an attack, the robust objective sees $0.55$; lowering attacked loss to $0.35$ improves the minimax target by $0.20$."
      },
      {
        "title": "Network routing",
        "background": "Packet routing can be modeled as a game against congestion. A minimax route plan limits the damage from the worst traffic pattern.",
        "numbers": "Route 1 has delays $20,80$ ms under two loads; route 2 has $35,45$ ms. Worst cases are $80$ and $45$, so minimax chooses route 2."
      },
      {
        "title": "Portfolio hedging",
        "background": "Finance used minimax-like reasoning for guarding against bad market states. The payoff matrix is not always truly zero-sum, but the worst-case arithmetic is the same.",
        "numbers": "Asset A returns $8\\%$ or $-6\\%$; asset B returns $2\\%$ or $1\\%$. The safer worst case is B with $1\\%$ rather than A with $-6\\%$."
      },
      {
        "title": "A/B testing under segment shift",
        "background": "A product choice can look good on average but weak in a segment. Minimax checks the segment that hurts most.",
        "numbers": "Design A lifts clicks by $4\\%$ for desktop and $-2\\%$ for mobile; design B lifts $1\\%$ and $1\\%$. Worst segment favors B."
      },
      {
        "title": "Game-playing AI",
        "background": "Zero-sum board games inspired minimax search. A chess engine evaluates a move by assuming the opponent then chooses the reply that hurts most.",
        "numbers": "If a move's possible replies lead to evaluations $+3,+1,-2$, its minimax score is $-2$. Another move with $0,0.5,0.2$ has worst score $0$, so it is safer."
      }
    ],
    "applicationsClose": "Minimax is the discipline of asking what you can still guarantee when the other side is intelligent and prepared.",
    "takeaways": [
      "Finite zero-sum mixed games have a shared value: $\\max\\min=\\min\\max$.",
      "Equalizing the opponent's pure responses is a powerful way to find a $2\\times2$ optimal mix.",
      "The theorem depends on randomization, linear expected payoff, finite actions, and zero-sum preferences.",
      "Robust ML, adversarial training, routing, and game AI all reuse the same worst-case lens."
    ]
  },
  "math-24-12": {
    "id": "math-24-12",
    "title": "Extensive-form games",
    "tagline": "An extensive-form game turns a strategic situation into a tree of choices, information, and payoffs.",
    "connections": {
      "buildsOn": [
        "payoff matrices",
        "decision trees",
        "probability",
        "expected value"
      ],
      "leadsTo": [
        "Backward induction",
        "Subgame perfection",
        "Repeated games"
      ],
      "usedWith": [
        "trees",
        "conditional probability",
        "sequential optimization",
        "Nash equilibrium"
      ]
    },
    "motivation": "<p>You already know that some decisions happen in order. One person moves, another observes or does not observe, and then someone responds. A payoff matrix can hide that timing.</p><p>An <b>extensive-form game</b> draws the timing as a tree. The picture records who moves, what they know, which actions are available, and what payoffs arrive at the leaves. It is the natural grammar for bargaining, auctions, protocols, and multi-step AI interaction.</p>",
    "definition": "<p>An extensive-form game consists of decision nodes, a player assigned to each nonterminal node, actions leaving each node, possible chance probabilities, information sets describing which nodes a player cannot distinguish, and terminal payoffs. A <b>strategy</b> is a complete contingent plan: it specifies what a player would do at every information set they might reach.</p><p>The expected payoff is derived by multiplying probabilities along each path and summing terminal payoffs. When all previous actions are observed, each information set has one node and the game has <b>perfect information</b>. When several nodes share an information set, the player must choose the same action at all of them because they cannot tell which node they are at.</p><p><b>Assumptions that matter:</b> the game tree has no cycles unless represented by repeated stages; each terminal leaf has payoffs for all players; chance probabilities are known; and a strategy describes off-path choices too, not only the path that actually occurs.</p>",
    "worked": {
      "problem": "A seller first chooses High price or Low price. A buyer observes the price and chooses Buy or Walk. Payoffs are High-Buy $(5,1)$, High-Walk $(0,0)$, Low-Buy $(3,3)$, Low-Walk $(0,0)$. List the buyer's pure strategies and compute seller payoff if seller chooses High and buyer strategy is Buy after Low, Walk after High.",
      "skills": [
        "game trees",
        "contingent strategies",
        "payoff reading"
      ],
      "strategy": "The key obstacle is that a strategy must name actions after every possible observed price, even off the actual path.",
      "steps": [
        {
          "do": "List the buyer's information points",
          "result": "after High and after Low",
          "why": "the buyer observes the seller's price"
        },
        {
          "do": "Count buyer choices at each point",
          "result": "2 choices after High and 2 after Low",
          "why": "Buy or Walk is available at each point"
        },
        {
          "do": "Compute number of pure buyer strategies",
          "result": "$2\\cdot2=4$",
          "why": "a complete plan chooses one action at each point"
        },
        {
          "do": "List the pure strategies",
          "result": "$(B_H,B_L),(B_H,W_L),(W_H,B_L),(W_H,W_L)$",
          "why": "subscripts name the observed price"
        },
        {
          "do": "Apply the named buyer strategy after High",
          "result": "Walk",
          "why": "the actual seller choice is High"
        },
        {
          "do": "Read the terminal payoff",
          "result": "$(0,0)$",
          "why": "High followed by Walk ends at that leaf"
        }
      ],
      "verify": "The buyer's instruction after Low is not used on this path, but it still belongs to the strategy because Low could have happened.",
      "answer": "The buyer has four pure strategies; against seller High and buyer plan $(W_H,B_L)$, the seller payoff is $0$.",
      "connects": "Extensive form separates the path that occurs from the complete plans players commit to."
    },
    "practice": [
      {
        "problem": "Player 1 chooses L or R. If L, payoffs are $(2,1)$. If R, Player 2 chooses U or D with payoffs $(0,3)$ and $(4,0)$. How many pure strategies does Player 2 have, and what payoff follows $(R,D)$?",
        "steps": [
          {
            "do": "Find Player 2 decision nodes",
            "result": "one node after R",
            "why": "Player 2 moves only if R occurs"
          },
          {
            "do": "List Player 2 actions",
            "result": "U or D",
            "why": "two actions leave that node"
          },
          {
            "do": "Count pure strategies",
            "result": "$2$",
            "why": "one decision point with two choices"
          },
          {
            "do": "Follow path $(R,D)$",
            "result": "right then down",
            "why": "use the actions in order"
          },
          {
            "do": "Read the leaf",
            "result": "$(4,0)$",
            "why": "the D leaf after R has those payoffs"
          }
        ],
        "answer": "Player 2 has 2 pure strategies; path $(R,D)$ gives payoff $(4,0)$."
      },
      {
        "problem": "A chance node sends state Good with probability $0.7$ and Bad with probability $0.3$. Action Invest pays $10$ in Good and $-5$ in Bad. Compute expected payoff.",
        "steps": [
          {
            "do": "Write the Good contribution",
            "result": "$0.7\\cdot10=7$",
            "why": "probability times payoff"
          },
          {
            "do": "Write the Bad contribution",
            "result": "$0.3\\cdot(-5)=-1.5$",
            "why": "probability times payoff"
          },
          {
            "do": "Add contributions",
            "result": "$7-1.5=5.5$",
            "why": "expected payoff sums path values"
          },
          {
            "do": "Interpret sign",
            "result": "positive",
            "why": "the average payoff is above zero"
          }
        ],
        "answer": "The expected payoff from Invest is $5.5$."
      },
      {
        "problem": "A player has two information sets. At the first they choose A or B; at the second they choose X, Y, or Z. How many pure strategies are there?",
        "steps": [
          {
            "do": "Count actions at first information set",
            "result": "$2$",
            "why": "A or B"
          },
          {
            "do": "Count actions at second information set",
            "result": "$3$",
            "why": "X, Y, or Z"
          },
          {
            "do": "Multiply choices",
            "result": "$2\\cdot3=6$",
            "why": "a pure strategy chooses at every information set"
          },
          {
            "do": "Name the structure",
            "result": "$(A,X),(A,Y),(A,Z),(B,X),(B,Y),(B,Z)$",
            "why": "each ordered pair is a complete plan"
          }
        ],
        "answer": "There are $6$ pure strategies."
      },
      {
        "problem": "In an imperfect-information game, Player 2 cannot tell whether they are at node $n_1$ or $n_2$, and both nodes have actions Accept or Reject. How many actions can a pure strategy assign across that information set?",
        "steps": [
          {
            "do": "Identify the information set",
            "result": "$\\{n_1,n_2\\}$",
            "why": "the two nodes are indistinguishable"
          },
          {
            "do": "Apply the information-set rule",
            "result": "same action at both nodes",
            "why": "the player cannot condition on what they do not observe"
          },
          {
            "do": "Count available instructions",
            "result": "$2$",
            "why": "Accept everywhere or Reject everywhere"
          },
          {
            "do": "Reject separate assignments",
            "result": "not $4$",
            "why": "Accept at one node and Reject at the other would require knowing the node"
          }
        ],
        "answer": "Only 2 instructions are possible for that information set: Accept at both nodes or Reject at both nodes."
      },
      {
        "problem": "A two-step dialogue policy asks a clarifying question with probability $0.4$. If it asks, success probability is $0.9$; if it skips, success probability is $0.6$. Compute total success probability.",
        "steps": [
          {
            "do": "Compute ask path contribution",
            "result": "$0.4\\cdot0.9=0.36$",
            "why": "multiply branch probability by conditional success"
          },
          {
            "do": "Compute skip probability",
            "result": "$1-0.4=0.6$",
            "why": "the two first-step branches exhaust probability"
          },
          {
            "do": "Compute skip path contribution",
            "result": "$0.6\\cdot0.6=0.36$",
            "why": "multiply skip probability by success given skip"
          },
          {
            "do": "Add contributions",
            "result": "$0.36+0.36=0.72$",
            "why": "sum over terminal success paths"
          },
          {
            "do": "Convert to percent",
            "result": "$72\\%$",
            "why": "probability $0.72$ is 72 percent"
          }
        ],
        "answer": "The policy succeeds with probability $0.72$."
      }
    ],
    "applications": [
      {
        "title": "Negotiation trees",
        "background": "Bargaining is sequential: offers, counteroffers, and acceptances happen over time. Extensive form keeps timing visible.",
        "numbers": "If offer High is accepted with probability $0.3$ for profit $10$ and rejected for $0$, expected profit is $3$; Low accepted with probability $0.8$ for profit $6$ gives $4.8$."
      },
      {
        "title": "Security protocols",
        "background": "Attack-defense interactions often branch by whether an alert is triggered. A tree records both defender actions and attacker responses.",
        "numbers": "Patch costs $2$ and prevents a $10$ loss with probability $0.7$, giving expected avoided loss $7-2=5$."
      },
      {
        "title": "Customer support bots",
        "background": "A bot may ask a question, route to a human, or answer directly. The tree clarifies consequences of early choices.",
        "numbers": "Ask-first costs $1$ minute and solves $85\\%$; direct answer costs $0.2$ minute and solves $60\\%$. Expected unsolved rates are $15\\%$ and $40\\%$."
      },
      {
        "title": "Auctions",
        "background": "Bidding procedures are sequential when participants observe earlier bids. Extensive-form games model the information revealed by each bid.",
        "numbers": "If a bid of $100$ leads to win probability $0.4$ and surplus $30$, expected surplus is $12$ before bid costs."
      },
      {
        "title": "Multi-agent RL episodes",
        "background": "An episode is a tree of states, actions, rewards, and transitions. Policies are strategies that say what to do at each reachable state.",
        "numbers": "If action A reaches reward $5$ with probability $0.6$ and reward $1$ with probability $0.4$, expected reward is $3.4$."
      },
      {
        "title": "Clinical decision pathways",
        "background": "Medicine often uses staged decisions after test results. The tree makes conditional choices explicit.",
        "numbers": "A test costs $50$; if positive probability is $0.2$ and treatment benefit is $500$, expected benefit before false positives is $0.2\\cdot500-50=50$."
      }
    ],
    "applicationsClose": "Whenever timing and information matter, the game tree is the clean board on which strategic reasoning can begin.",
    "takeaways": [
      "An extensive-form game records players, actions, information sets, chance moves, and terminal payoffs.",
      "A strategy is a complete contingent plan, including off-path decisions.",
      "Expected payoff sums terminal payoffs weighted by path probabilities.",
      "Information sets prevent players from conditioning on distinctions they cannot observe."
    ]
  },
  "math-24-13": {
    "id": "math-24-13",
    "title": "Backward induction",
    "tagline": "Backward induction solves a finite perfect-information game by reasoning from the final choices back to the start.",
    "connections": {
      "buildsOn": [
        "Extensive-form games",
        "decision trees",
        "optimization"
      ],
      "leadsTo": [
        "Subgame perfection",
        "Repeated games",
        "dynamic programming"
      ],
      "usedWith": [
        "recursion",
        "Bellman equations",
        "tree search",
        "sequential rationality"
      ]
    },
    "motivation": "<p>You already solve small plans backward. If a trip must end by 6:00, you decide when to leave by working back from arrival time. Sequential games reward the same habit.</p><p><b>Backward induction</b> says: at the last decision nodes, choose the best action for the player who moves there; then replace those nodes by their chosen payoffs and step backward. It is local common sense, repeated until the root.</p>",
    "definition": "<p>In a finite extensive-form game with perfect information, backward induction selects actions by solving terminal decision nodes first and then moving upward through the tree. At each node, the active player chooses the action whose continuation payoff is best for that player.</p><p>The method works because a player's current choice only matters through the continuation payoff it leads to. Once all later rational choices are known, the current node becomes an ordinary maximization problem. This is the game-theory cousin of dynamic programming.</p><p><b>Assumptions that matter:</b> the tree is finite; players observe previous actions; payoffs are known; players choose actions to maximize their own payoffs; and ties may create multiple backward-induction outcomes unless a tie-breaking rule is specified.</p>",
    "worked": {
      "problem": "Player 1 chooses L or R. L ends with $(2,2)$. R lets Player 2 choose U giving $(0,3)$ or D giving $(4,1)$. Solve by backward induction.",
      "skills": [
        "terminal-node reasoning",
        "sequential rationality",
        "payoff comparison"
      ],
      "strategy": "Start at Player 2's last decision, then replace that subtree by the payoff it will produce.",
      "steps": [
        {
          "do": "Solve Player 2's node after R",
          "result": "choose U",
          "why": "Player 2 compares payoff $3$ from U to $1$ from D"
        },
        {
          "do": "Replace the R subtree",
          "result": "R leads to $(0,3)$",
          "why": "future rational play after R is now summarized"
        },
        {
          "do": "Compare Player 1's root options",
          "result": "L gives $2$ and R gives $0$ to Player 1",
          "why": "Player 1 cares about the first payoff"
        },
        {
          "do": "Choose Player 1's action",
          "result": "L",
          "why": "$2>0$"
        },
        {
          "do": "State the path",
          "result": "L",
          "why": "the game ends immediately at the left leaf"
        }
      ],
      "verify": "Although D would give Player 1 a higher payoff after R, Player 2 would not choose it, so Player 1 should not count on it.",
      "answer": "Backward induction predicts Player 1 chooses L, with outcome $(2,2)$.",
      "connects": "Backward induction protects us from wishful thinking about what later players will rationally do."
    },
    "practice": [
      {
        "problem": "Player 1 chooses A ending $(1,1)$ or B. After B, Player 2 chooses C ending $(3,0)$ or D ending $(0,4)$. Find the backward-induction outcome.",
        "steps": [
          {
            "do": "Solve Player 2's choice",
            "result": "D",
            "why": "Player 2 compares $0$ from C to $4$ from D"
          },
          {
            "do": "Replace B",
            "result": "B leads to $(0,4)$",
            "why": "D is the rational continuation"
          },
          {
            "do": "Compare Player 1 payoffs",
            "result": "A gives $1$, B gives $0$",
            "why": "use first coordinates"
          },
          {
            "do": "Choose root action",
            "result": "A",
            "why": "$1>0$"
          },
          {
            "do": "State outcome",
            "result": "$(1,1)$",
            "why": "A ends the game"
          }
        ],
        "answer": "The outcome is A with payoff $(1,1)$."
      },
      {
        "problem": "At the last node, Player 2 chooses X for payoff $(5,2)$ or Y for $(1,6)$. What continuation payoff should the earlier player attach to that node?",
        "steps": [
          {
            "do": "Compare Player 2's payoffs",
            "result": "$2$ for X and $6$ for Y",
            "why": "second coordinate belongs to Player 2"
          },
          {
            "do": "Choose Player 2's action",
            "result": "Y",
            "why": "$6>2$"
          },
          {
            "do": "Read the resulting full payoff",
            "result": "$(1,6)$",
            "why": "the chosen leaf gives both players' payoffs"
          },
          {
            "do": "Use as continuation value",
            "result": "$(1,6)$",
            "why": "earlier nodes see the solved subtree"
          }
        ],
        "answer": "The continuation payoff is $(1,6)$."
      },
      {
        "problem": "A firm can Enter or Stay Out. Stay Out pays $(0,5)$. Enter lets incumbent Fight with $(-2,-1)$ or Accommodate with $(3,2)$. Solve.",
        "steps": [
          {
            "do": "Solve incumbent choice after Enter",
            "result": "Accommodate",
            "why": "incumbent payoff $2$ exceeds $-1$"
          },
          {
            "do": "Replace Enter branch",
            "result": "Enter leads to $(3,2)$",
            "why": "rational incumbent response is summarized"
          },
          {
            "do": "Compare entrant payoffs",
            "result": "Enter gives $3$, Stay Out gives $0$",
            "why": "entrant is Player 1"
          },
          {
            "do": "Choose entrant action",
            "result": "Enter",
            "why": "$3>0$"
          },
          {
            "do": "State outcome",
            "result": "Enter, Accommodate",
            "why": "follow the chosen path"
          }
        ],
        "answer": "Backward induction gives Enter followed by Accommodate, payoff $(3,2)$."
      },
      {
        "problem": "A three-step game: Player 1 chooses Stop for $(2,2)$ or Go. If Go, Player 2 chooses Stop for $(1,3)$ or Go. If Go again, Player 1 chooses X for $(4,0)$ or Y for $(0,1)$. Solve.",
        "steps": [
          {
            "do": "Solve final Player 1 node",
            "result": "X",
            "why": "Player 1 compares $4$ to $0$"
          },
          {
            "do": "Replace final Go continuation",
            "result": "$(4,0)$",
            "why": "X will be chosen"
          },
          {
            "do": "Solve Player 2 middle node",
            "result": "Stop",
            "why": "Player 2 compares $3$ from Stop to $0$ from Go"
          },
          {
            "do": "Replace first Go branch",
            "result": "$(1,3)$",
            "why": "middle rational choice is Stop"
          },
          {
            "do": "Solve Player 1 root",
            "result": "Stop",
            "why": "Player 1 compares $2$ to $1$"
          }
        ],
        "answer": "The outcome is Player 1 Stop at the root, payoff $(2,2)$."
      },
      {
        "problem": "A model-serving agent can Query a tool or Answer now. Query costs $0.02$ and then succeeds with value $1$ with probability $0.9$; Answer now succeeds with value $0.7$. Which action has higher expected value?",
        "steps": [
          {
            "do": "Compute Query gross value",
            "result": "$0.9\\cdot1+0.1\\cdot0=0.9$",
            "why": "success value is weighted by probability"
          },
          {
            "do": "Subtract query cost",
            "result": "$0.9-0.02=0.88$",
            "why": "cost lowers the continuation value"
          },
          {
            "do": "Write Answer-now value",
            "result": "$0.7$",
            "why": "given by the problem"
          },
          {
            "do": "Compare values",
            "result": "$0.88>0.7$",
            "why": "choose the larger expected payoff"
          },
          {
            "do": "Choose action",
            "result": "Query",
            "why": "it has the better continuation value"
          }
        ],
        "answer": "Query has expected value $0.88$, so it is preferred to Answer now."
      }
    ],
    "applications": [
      {
        "title": "Entry deterrence",
        "background": "Classic industrial-organization examples use backward induction to show when threats are credible. A threat that hurts the threatener later will not guide rational early choices.",
        "numbers": "If Fight gives incumbent $-1$ and Accommodate gives $2$, the entrant predicts Accommodate and enters when entry payoff is $3>0$."
      },
      {
        "title": "Dynamic programming",
        "background": "Backward induction is the finite-tree version of dynamic programming. Later solved values become earlier continuation values.",
        "numbers": "If terminal rewards are $5$ and $2$, a max node stores $5$; a previous node comparing $3$ to that stored $5$ chooses the $5$ branch."
      },
      {
        "title": "Chess endgames",
        "background": "Game engines solve small endgame trees from checkmate positions backward. Every earlier position inherits win, loss, or draw values from successors.",
        "numbers": "If move A leads to forced mate in $3$ and move B to draw value $0$, a winning engine picks A with value $+1$."
      },
      {
        "title": "Project planning",
        "background": "Sequential decisions with deadlines can be optimized backward from the final requirement. This is strategic reasoning without an opponent.",
        "numbers": "If delivery needs $5$ days testing and $8$ days build before July 20, latest build start is July 7."
      },
      {
        "title": "Dialogue systems",
        "background": "A dialogue policy can compare the value of asking now against answering now by looking at expected future success.",
        "numbers": "Ask cost $1$ turn and raises success from $0.65$ to $0.90$; if success is worth $10$, net gain is $2.5-1=1.5$."
      },
      {
        "title": "Robotics planning",
        "background": "A robot chooses current actions by estimating the best future path from each resulting state. Backward induction is exact on small finite maps.",
        "numbers": "If left leads to future reward $6$ after cost $1$, value is $5$; right leads to reward $4$ after cost $0.5$, value is $3.5$."
      }
    ],
    "applicationsClose": "Backward induction is a quiet discipline: solve the future honestly, then choose the present with clear eyes.",
    "takeaways": [
      "Solve finite perfect-information games from terminal nodes back to the root.",
      "At each node, the active player chooses the continuation best for themselves.",
      "The method exposes non-credible threats because later incentives must be respected.",
      "It is closely related to dynamic programming and planning in AI."
    ]
  },
  "math-24-14": {
    "id": "math-24-14",
    "title": "Subgame perfection",
    "tagline": "Subgame perfection asks a strategy profile to be a Nash equilibrium after every history where play could continue.",
    "connections": {
      "buildsOn": [
        "Backward induction",
        "Nash equilibrium",
        "Extensive-form games"
      ],
      "leadsTo": [
        "Repeated games",
        "credible threats",
        "dynamic mechanism design"
      ],
      "usedWith": [
        "sequential rationality",
        "fixed points",
        "dynamic programming",
        "equilibrium refinement"
      ]
    },
    "motivation": "<p>You already saw that some promises in a game tree are not believable. If a player says they will choose an action later that hurts themselves, the early player should be skeptical.</p><p><b>Subgame perfection</b> formalizes that skepticism. It keeps only equilibria whose prescribed behavior remains rational in every proper subgame, including places the actual path may never reach.</p>",
    "definition": "<p>A <b>subgame</b> begins at a decision node that is alone in its information set and includes all its successors without cutting any information set. A strategy profile is a <b>subgame-perfect equilibrium</b> if its restriction to every subgame is a Nash equilibrium of that subgame.</p><p>Backward induction produces a subgame-perfect equilibrium in finite perfect-information games. The reason is local: each solved node makes the strategy optimal in the subgame rooted there, and moving backward preserves optimality in all later subgames.</p><p><b>Assumptions that matter:</b> subgames must be well-defined; the refinement is strongest in perfect-information trees; strategies still specify off-path behavior; and subgame perfection rules out non-credible threats but does not remove every possible equilibrium in games with simultaneous moves or imperfect information.</p>",
    "worked": {
      "problem": "Entrant chooses In or Out. Out gives $(0,2)$. In lets incumbent choose Fight $(-1,-1)$ or Accommodate $(2,1)$. Identify the subgame-perfect outcome and explain why Fight is not credible.",
      "skills": [
        "subgames",
        "credible threats",
        "backward induction"
      ],
      "strategy": "Solve the incumbent's subgame first; subgame perfection requires rational play there even if the entrant might avoid it.",
      "steps": [
        {
          "do": "Identify the proper subgame",
          "result": "the node after In",
          "why": "it is a singleton decision node with all successors"
        },
        {
          "do": "Solve incumbent's choice in that subgame",
          "result": "Accommodate",
          "why": "incumbent payoff $1$ exceeds $-1$"
        },
        {
          "do": "Compare entrant's root payoffs",
          "result": "In gives $2$ and Out gives $0$",
          "why": "use the continuation from the solved subgame"
        },
        {
          "do": "Choose entrant's action",
          "result": "In",
          "why": "$2>0$"
        },
        {
          "do": "State why Fight is not credible",
          "result": "Fight is not optimal after In",
          "why": "subgame perfection tests the off-path threat where it would be used"
        }
      ],
      "verify": "The incumbent may wish the entrant believed Fight, but once In occurs, Accommodate is better for the incumbent.",
      "answer": "The subgame-perfect outcome is In then Accommodate, with payoff $(2,1)$.",
      "connects": "Subgame perfection is Nash equilibrium plus credible behavior in every continuation game."
    },
    "practice": [
      {
        "problem": "In the same entry game, change Fight payoff for incumbent to $3$, so Fight gives $(-1,3)$ and Accommodate gives $(2,1)$. Find the subgame-perfect outcome.",
        "steps": [
          {
            "do": "Solve incumbent subgame",
            "result": "Fight",
            "why": "incumbent payoff $3$ exceeds $1$"
          },
          {
            "do": "Replace In continuation",
            "result": "$(-1,3)$",
            "why": "Fight is now credible"
          },
          {
            "do": "Compare entrant payoffs",
            "result": "Out gives $0$, In gives $-1$",
            "why": "entrant chooses the larger payoff"
          },
          {
            "do": "Choose root action",
            "result": "Out",
            "why": "$0>-1$"
          },
          {
            "do": "State outcome",
            "result": "Out",
            "why": "the incumbent subgame is off path but still specified"
          }
        ],
        "answer": "The subgame-perfect outcome is Out, with credible off-path Fight after In."
      },
      {
        "problem": "A game has root A ending $(1,1)$ or B leading to Player 2 choosing C $(0,0)$ or D $(2,3)$. Find the subgame-perfect equilibrium path.",
        "steps": [
          {
            "do": "Identify subgame after B",
            "result": "Player 2's decision node",
            "why": "it is a proper continuation game"
          },
          {
            "do": "Solve Player 2 choice",
            "result": "D",
            "why": "$3>0$ for Player 2"
          },
          {
            "do": "Replace B",
            "result": "B gives $(2,3)$",
            "why": "use rational continuation"
          },
          {
            "do": "Compare Player 1 payoffs",
            "result": "A gives $1$, B gives $2$",
            "why": "root player maximizes first payoff"
          },
          {
            "do": "Choose path",
            "result": "B then D",
            "why": "follow optimal choices"
          }
        ],
        "answer": "The subgame-perfect path is B then D, payoff $(2,3)$."
      },
      {
        "problem": "A proposed strategy says Player 2 will choose C after B even though C gives Player 2 $0$ and D gives Player 2 $3$. Can this be subgame-perfect?",
        "steps": [
          {
            "do": "Focus on the subgame after B",
            "result": "Player 2 chooses between C and D",
            "why": "subgame perfection checks every continuation"
          },
          {
            "do": "Compare Player 2 payoffs",
            "result": "$0<3$",
            "why": "D is strictly better"
          },
          {
            "do": "Assess C",
            "result": "not optimal",
            "why": "a best response would choose D"
          },
          {
            "do": "Apply definition",
            "result": "not subgame-perfect",
            "why": "restriction to the subgame is not a Nash equilibrium"
          }
        ],
        "answer": "No. Choosing C after B is not optimal in that subgame."
      },
      {
        "problem": "A two-stage game has no proper subgames because Player 2's two decision nodes are in one information set. What does subgame perfection add beyond Nash equilibrium?",
        "steps": [
          {
            "do": "Check singleton condition",
            "result": "Player 2 nodes are not singletons",
            "why": "a subgame cannot start inside a nontrivial information set"
          },
          {
            "do": "Count proper subgames",
            "result": "none",
            "why": "only the whole game qualifies"
          },
          {
            "do": "Apply subgame-perfect definition",
            "result": "Nash on the whole game",
            "why": "there are no smaller subgames to test"
          },
          {
            "do": "State implication",
            "result": "no extra refinement here",
            "why": "subgame perfection has no additional bite"
          }
        ],
        "answer": "In this game, subgame-perfect equilibrium coincides with Nash equilibrium."
      },
      {
        "problem": "A service-level contract says Provider will Refund after failure, costing Provider $4$ but preserving future value $7$. Refuse costs $0$ now but loses future value $7$. Is Refund credible after failure?",
        "steps": [
          {
            "do": "Compute Provider payoff from Refund",
            "result": "$-4+7=3$",
            "why": "cost now plus retained future value"
          },
          {
            "do": "Compute Provider payoff from Refuse",
            "result": "$0-7=-7$",
            "why": "save cost but lose future value"
          },
          {
            "do": "Compare payoffs",
            "result": "$3>-7$",
            "why": "Refund is better after failure"
          },
          {
            "do": "Apply credibility test",
            "result": "credible",
            "why": "the promised action is optimal in the continuation"
          },
          {
            "do": "Name the refinement idea",
            "result": "subgame perfection",
            "why": "later incentives support the promise"
          }
        ],
        "answer": "Refund is credible because it gives Provider payoff $3$ instead of $-7$."
      }
    ],
    "applications": [
      {
        "title": "Credible threats in markets",
        "background": "Subgame perfection became central because some Nash equilibria depended on threats no rational firm would carry out. The refinement separates posturing from credible action.",
        "numbers": "If punishing entry costs an incumbent $5$ and accommodating earns $2$, punishment is $7$ worse and not credible."
      },
      {
        "title": "Smart contracts",
        "background": "A contract can make future actions credible by changing payoffs. Deposits and penalties alter the continuation game.",
        "numbers": "With a $100$ deposit forfeited on refusal, honoring a $30$ refund can beat refusing: honor payoff $-30$, refuse payoff $-100$."
      },
      {
        "title": "Reputation systems",
        "background": "Future ratings can make helpful behavior credible. The continuation payoff from reputation changes the subgame incentives.",
        "numbers": "A seller loses $200$ future profit from cheating for a $50$ gain, so honest behavior has net advantage $150$."
      },
      {
        "title": "Multi-agent planning",
        "background": "Agents that announce future cooperation must still prefer it when the future state arrives. Subgame checks prevent brittle plans.",
        "numbers": "If cooperating later gives reward $8$ and defecting gives $5$ after a shared setup, cooperation is sequentially rational."
      },
      {
        "title": "Protocol design",
        "background": "Distributed protocols often use penalties so honest continuation is optimal after unexpected histories.",
        "numbers": "A validator gains $3$ by cheating but risks slashing $20$ with probability $0.5$, expected penalty $10$, so cheating net is $-7$."
      },
      {
        "title": "Customer-service guarantees",
        "background": "A guarantee is credible when honoring it costs less than the lost lifetime value from refusal.",
        "numbers": "Refund cost $25$ versus expected retained future margin $60$ makes refunding worth $35$ net."
      }
    ],
    "applicationsClose": "Subgame perfection teaches a humane but firm lesson: promises matter when the incentives still support them later.",
    "takeaways": [
      "A subgame-perfect equilibrium is a Nash equilibrium in every subgame.",
      "The refinement rules out non-credible threats in sequential games.",
      "Backward induction yields subgame-perfect equilibria in finite perfect-information games.",
      "Information sets limit where proper subgames can begin."
    ]
  },
  "math-24-15": {
    "id": "math-24-15",
    "title": "Repeated games",
    "tagline": "Repeated games show how the shadow of future interaction can support cooperation today.",
    "connections": {
      "buildsOn": [
        "Stage games",
        "Nash equilibrium",
        "discounted sums",
        "Subgame perfection"
      ],
      "leadsTo": [
        "folk theorems",
        "multi-agent RL",
        "reputation and incentives"
      ],
      "usedWith": [
        "geometric series",
        "Markov chains",
        "dynamic programming",
        "equilibrium refinement"
      ]
    },
    "motivation": "<p>You already know one-shot temptation: if a teammate will never see you again, shirking may look attractive. But repeated interaction changes the arithmetic. Tomorrow can discipline today.</p><p>A <b>repeated game</b> plays a stage game more than once. Strategies can condition on history, so kindness, punishment, forgiveness, and reputation become mathematical objects.</p>",
    "definition": "<p>A repeated game consists of a stage game played over periods $t=0,1,2,\\dots$ or for a finite horizon. With discount factor $\\delta\\in[0,1)$, a payoff stream $u_0,u_1,u_2,\\dots$ has present value $$\\sum_{t=0}^{\\infty}\\delta^t u_t.$$ A common cooperative strategy is <b>grim trigger</b>: cooperate until someone defects, then punish forever.</p><p>The geometric sum drives the key comparison. Constant payoff $c$ forever has value $c/(1-\\delta)$. Cooperation can be sustained when the one-time gain from defection is smaller than the discounted future loss from punishment.</p><p><b>Assumptions that matter:</b> players observe enough history to condition on it; payoffs and discounting are known; finite-horizon games with known final period often unravel; and infinite-horizon cooperation depends strongly on $\\delta$ being high enough.</p>",
    "worked": {
      "problem": "In a repeated prisoner's dilemma, mutual cooperation gives each $3$, defecting against a cooperator gives $5$, mutual defection gives $1$. Under grim trigger, find when cooperation is better than defecting once if the discount factor is $\\delta$.",
      "skills": [
        "discounting",
        "geometric series",
        "incentive constraints"
      ],
      "strategy": "Compare the value of cooperating forever with the value of one tempting defection followed by punishment forever.",
      "steps": [
        {
          "do": "Write cooperation value",
          "result": "$V_C=3+3\\delta+3\\delta^2+\\cdots$",
          "why": "cooperation earns 3 every period"
        },
        {
          "do": "Sum the geometric series",
          "result": "$V_C=\\dfrac{3}{1-\\delta}$",
          "why": "constant discounted payoff sums to $c/(1-\\delta)$"
        },
        {
          "do": "Write defection value",
          "result": "$V_D=5+\\delta+\\delta^2+\\cdots$",
          "why": "defect now earns 5, then punishment gives 1 forever"
        },
        {
          "do": "Sum punishment tail",
          "result": "$V_D=5+\\dfrac{\\delta}{1-\\delta}$",
          "why": "the tail starts one period later"
        },
        {
          "do": "Set cooperation at least as good",
          "result": "$\\dfrac{3}{1-\\delta}\\ge5+\\dfrac{\\delta}{1-\\delta}$",
          "why": "cooperation must beat the deviation"
        },
        {
          "do": "Multiply by $1-\\delta$",
          "result": "$3\\ge5-4\\delta$",
          "why": "$1-\\delta$ is positive for $\\delta<1$"
        },
        {
          "do": "Solve",
          "result": "$\\delta\\ge\\tfrac12$",
          "why": "move terms to isolate $\\delta$"
        }
      ],
      "verify": "If players care at least half as much about the next period as the current one, the future punishment outweighs the immediate temptation.",
      "answer": "Grim-trigger cooperation is incentive-compatible when $\\delta\\ge\\tfrac12$.",
      "connects": "Repeated play turns future value into present discipline."
    },
    "practice": [
      {
        "problem": "Compute the discounted value of receiving $4$ forever when $\\delta=0.8$.",
        "steps": [
          {
            "do": "Write the series",
            "result": "$4+4(0.8)+4(0.8)^2+\\cdots$",
            "why": "same payoff repeats"
          },
          {
            "do": "Use the geometric formula",
            "result": "$4/(1-0.8)$",
            "why": "constant discounted payoff"
          },
          {
            "do": "Compute denominator",
            "result": "$0.2$",
            "why": "$1-0.8=0.2$"
          },
          {
            "do": "Divide",
            "result": "$20$",
            "why": "$4/0.2=20$"
          }
        ],
        "answer": "The discounted value is $20$."
      },
      {
        "problem": "A deviation gives $7$ now instead of cooperative $5$, then punishment lowers future payoff from $5$ to $2$ forever. At $\\delta=0.6$, is cooperation stable?",
        "steps": [
          {
            "do": "Compute cooperation value",
            "result": "$5/(1-0.6)=12.5$",
            "why": "cooperate forever"
          },
          {
            "do": "Compute deviation tail",
            "result": "$0.6\\cdot2/(1-0.6)=3$",
            "why": "punishment starts next period"
          },
          {
            "do": "Compute deviation value",
            "result": "$7+3=10$",
            "why": "gain now plus punished future"
          },
          {
            "do": "Compare",
            "result": "$12.5>10$",
            "why": "cooperation has higher value"
          },
          {
            "do": "Conclude",
            "result": "stable",
            "why": "the deviation is not profitable"
          }
        ],
        "answer": "Yes. Cooperation value $12.5$ exceeds deviation value $10$."
      },
      {
        "problem": "For the same payoffs, find the threshold $\\delta$ where cooperation payoff $5$ beats deviation $7$ followed by punishment $2$.",
        "steps": [
          {
            "do": "Write cooperation value",
            "result": "$5/(1-\\delta)$",
            "why": "constant cooperative payoff"
          },
          {
            "do": "Write deviation value",
            "result": "$7+2\\delta/(1-\\delta)$",
            "why": "deviate now, punished later"
          },
          {
            "do": "Set inequality",
            "result": "$5/(1-\\delta)\\ge7+2\\delta/(1-\\delta)$",
            "why": "cooperation must be at least as good"
          },
          {
            "do": "Multiply by $1-\\delta$",
            "result": "$5\\ge7-5\\delta$",
            "why": "clear denominator"
          },
          {
            "do": "Solve",
            "result": "$\\delta\\ge0.4$",
            "why": "$5\\delta\\ge2$"
          }
        ],
        "answer": "Cooperation is stable when $\\delta\\ge0.4$."
      },
      {
        "problem": "In a 3-period known-horizon prisoner's dilemma, the final period has dominant defection. Explain the backward-unraveling arithmetic if mutual cooperation pays $3$ and mutual defection pays $1$.",
        "steps": [
          {
            "do": "Solve period 3",
            "result": "defect",
            "why": "no future punishment remains"
          },
          {
            "do": "Look at period 2",
            "result": "future period 3 will defect regardless",
            "why": "period 2 cooperation cannot buy later cooperation"
          },
          {
            "do": "Solve period 2",
            "result": "defect",
            "why": "the one-shot incentive returns"
          },
          {
            "do": "Look at period 1",
            "result": "periods 2 and 3 are already defect",
            "why": "no future reward supports cooperation"
          },
          {
            "do": "Solve period 1",
            "result": "defect",
            "why": "backward induction unravels the finite game"
          }
        ],
        "answer": "With a known final period and standard payoffs, defection occurs in all 3 periods."
      },
      {
        "problem": "A repeated recommendation system rewards two agents $1$ each for sharing data, but either can gain $1.4$ by withholding while the other shares; future sharing payoff is $1$ and punishment payoff is $0.2$. Find the discount threshold.",
        "steps": [
          {
            "do": "Write sharing value",
            "result": "$1/(1-\\delta)$",
            "why": "share forever"
          },
          {
            "do": "Write withholding value",
            "result": "$1.4+0.2\\delta/(1-\\delta)$",
            "why": "temptation now, lower future payoff"
          },
          {
            "do": "Set incentive constraint",
            "result": "$1/(1-\\delta)\\ge1.4+0.2\\delta/(1-\\delta)$",
            "why": "sharing must beat withholding"
          },
          {
            "do": "Multiply by $1-\\delta$",
            "result": "$1\\ge1.4-1.2\\delta$",
            "why": "clear positive denominator"
          },
          {
            "do": "Solve",
            "result": "$\\delta\\ge\\tfrac13$",
            "why": "$1.2\\delta\\ge0.4$"
          }
        ],
        "answer": "Sharing is sustainable when $\\delta\\ge1/3$."
      }
    ],
    "applications": [
      {
        "title": "Reputation markets",
        "background": "Online marketplaces rely on future business to discipline today's seller. A bad review lowers tomorrow's payoff.",
        "numbers": "Cheating gain $20$ today versus lost future profit $8$ per month discounted at $0.9$ has loss $0.9\\cdot8/(1-0.9)=72$, so honesty wins."
      },
      {
        "title": "Collusion analysis",
        "background": "Economists study repeated pricing because firms may keep prices high when future punishment is valuable. Antitrust analysis checks this incentive arithmetic.",
        "numbers": "Extra undercutting profit $5$ million today is deterred if future loss is $1$ million per quarter with $\\delta=0.9$: loss value $9$ million."
      },
      {
        "title": "Multi-agent RL self-play",
        "background": "Agents trained together repeatedly may learn reciprocal strategies rather than one-shot best responses.",
        "numbers": "If cooperation reward is $3$ per episode and betrayal gives $5$ once then $1$ after, $\\delta=0.8$ gives cooperation value $15$ versus betrayal $9$."
      },
      {
        "title": "Distributed systems",
        "background": "Nodes may follow protocols because misbehavior leads to exclusion from future rewards.",
        "numbers": "A validator gains $4$ by cheating now but loses $0.5$ per future round; with $\\delta=0.95$, future loss is $0.95\\cdot0.5/0.05=9.5$."
      },
      {
        "title": "Team collaboration",
        "background": "Repeated project work makes reliability valuable. Future teammates remember today's choices.",
        "numbers": "Saving $2$ hours by shirking can cost four future collaborations worth $1$ hour each discounted by $0.8$, value $0.8+0.64+0.512+0.410=2.362$."
      },
      {
        "title": "API rate-limit cooperation",
        "background": "Services can cooperate by respecting limits because retaliation or throttling affects future access.",
        "numbers": "Bursting gives $1000$ extra calls now but triggers loss of $300$ calls per day; with daily $\\delta=0.8$, future loss is $0.8\\cdot300/0.2=1200$."
      }
    ],
    "applicationsClose": "Repeated games show that patience is not just a virtue; in strategic systems it is a payoff term.",
    "takeaways": [
      "Discounted repeated payoff is $\\sum_t\\delta^t u_t$.",
      "Constant payoff $c$ forever has value $c/(1-\\delta)$.",
      "Cooperation can survive when future punishment outweighs current temptation.",
      "Known finite horizons can unravel by backward induction."
    ]
  },
  "math-24-16": {
    "id": "math-24-16",
    "title": "Bayesian games",
    "tagline": "Bayesian games model strategic choices when players have private information and beliefs about one another.",
    "connections": {
      "buildsOn": [
        "probability",
        "expected utility",
        "Nash equilibrium",
        "mixed strategies"
      ],
      "leadsTo": [
        "mechanism design",
        "auctions",
        "Bayesian persuasion"
      ],
      "usedWith": [
        "conditional expectation",
        "Bayes' rule",
        "optimization under uncertainty",
        "incomplete information"
      ]
    },
    "motivation": "<p>You often make decisions without knowing exactly who you face. A buyer may have high or low value; a sender may be reliable or noisy; an opponent may be cautious or bold. Strategy then depends on beliefs.</p><p>A <b>Bayesian game</b> keeps the uncertainty inside the model. Nature draws each player's type, players know their own type, and strategies map types to actions. Equilibrium asks each type to be optimal given beliefs and other players' type-contingent strategies.</p>",
    "definition": "<p>A Bayesian game specifies players, action sets, type sets, a common prior probability over types, and payoffs that may depend on actions and types. A pure strategy for player $i$ is a function $s_i(t_i)$ from that player's type $t_i$ to an action. A <b>Bayes-Nash equilibrium</b> is a strategy profile where every type maximizes expected payoff given its beliefs and the other strategies.</p><p>The expectation is the key derivation: a type does not maximize payoff against one known world; it averages payoffs over possible other types using conditional probabilities. If type $H$ assigns probability $0.7$ to one state and $0.3$ to another, expected payoff is $0.7u_1+0.3u_2$.</p><p><b>Assumptions that matter:</b> the prior is common knowledge; each player observes their own type; beliefs are updated consistently when information is observed; and risk-neutral expected utility is used unless stated otherwise.</p>",
    "worked": {
      "problem": "A bidder's value is High $10$ with probability $0.4$ or Low $4$ with probability $0.6$. Bidding costs $5$ and wins for sure; not bidding gives $0$. What should each type do?",
      "skills": [
        "types",
        "expected payoff",
        "type-contingent strategies"
      ],
      "strategy": "Treat each type as its own decision maker because it knows its value after nature's draw.",
      "steps": [
        {
          "do": "Compute High type payoff from bid",
          "result": "$10-5=5$",
          "why": "value minus cost"
        },
        {
          "do": "Compare High bid to not bid",
          "result": "$5>0$",
          "why": "not bidding gives zero"
        },
        {
          "do": "Choose High action",
          "result": "Bid",
          "why": "High type benefits"
        },
        {
          "do": "Compute Low type payoff from bid",
          "result": "$4-5=-1$",
          "why": "cost exceeds value"
        },
        {
          "do": "Compare Low bid to not bid",
          "result": "$-1<0$",
          "why": "not bidding is better"
        },
        {
          "do": "Choose Low action",
          "result": "Not Bid",
          "why": "Low type avoids a loss"
        }
      ],
      "verify": "The prior probabilities describe how often types occur, but after a bidder knows its own type, the action comparison uses that type's payoff.",
      "answer": "The type-contingent strategy is High bids and Low does not bid.",
      "connects": "Bayesian-game strategies are functions from private information to actions."
    },
    "practice": [
      {
        "problem": "A worker is Productive with probability $0.7$ and Unproductive with probability $0.3$. Training costs $2$. Productive gains value $5$ from training; Unproductive gains $1$. Which types train?",
        "steps": [
          {
            "do": "Productive net payoff",
            "result": "$5-2=3$",
            "why": "benefit minus cost"
          },
          {
            "do": "Compare to no training",
            "result": "$3>0$",
            "why": "no training gives zero"
          },
          {
            "do": "Productive action",
            "result": "Train",
            "why": "positive net value"
          },
          {
            "do": "Unproductive net payoff",
            "result": "$1-2=-1$",
            "why": "cost exceeds benefit"
          },
          {
            "do": "Unproductive action",
            "result": "Do not train",
            "why": "zero beats negative payoff"
          }
        ],
        "answer": "Productive trains; Unproductive does not."
      },
      {
        "problem": "An investor does not know whether a startup is Good with probability $0.25$ or Bad with probability $0.75$. Investing pays $12$ if Good and $-4$ if Bad. Compute expected payoff.",
        "steps": [
          {
            "do": "Good contribution",
            "result": "$0.25\\cdot12=3$",
            "why": "probability times payoff"
          },
          {
            "do": "Bad contribution",
            "result": "$0.75\\cdot(-4)=-3$",
            "why": "probability times payoff"
          },
          {
            "do": "Add contributions",
            "result": "$3-3=0$",
            "why": "expected payoff averages over types"
          },
          {
            "do": "Compare to not investing",
            "result": "$0=0$",
            "why": "not investing gives zero"
          },
          {
            "do": "State indifference",
            "result": "indifferent",
            "why": "expected payoffs tie"
          }
        ],
        "answer": "The expected payoff is $0$, so a risk-neutral investor is indifferent."
      },
      {
        "problem": "A signal says Positive. Prior disease probability is $0.1$; true positive rate $0.8$; false positive rate $0.2$. Compute posterior probability of disease.",
        "steps": [
          {
            "do": "Compute joint disease and positive",
            "result": "$0.1\\cdot0.8=0.08$",
            "why": "prior times true positive rate"
          },
          {
            "do": "Compute joint no disease and positive",
            "result": "$0.9\\cdot0.2=0.18$",
            "why": "no-disease prior times false positive rate"
          },
          {
            "do": "Compute total positive probability",
            "result": "$0.08+0.18=0.26$",
            "why": "sum ways to see positive"
          },
          {
            "do": "Apply Bayes' rule",
            "result": "$0.08/0.26\\approx0.308$",
            "why": "posterior is joint over total"
          },
          {
            "do": "Interpret",
            "result": "about $30.8\\%$",
            "why": "positive signal raises but does not settle belief"
          }
        ],
        "answer": "The posterior disease probability is about $0.308$."
      },
      {
        "problem": "A seller values an item at $2$. Buyer value is $8$ with probability $0.5$ and $3$ with probability $0.5$. If price is $5$, what is expected seller profit?",
        "steps": [
          {
            "do": "Determine High buyer action",
            "result": "buy",
            "why": "$8>5$"
          },
          {
            "do": "Determine Low buyer action",
            "result": "not buy",
            "why": "$3<5$"
          },
          {
            "do": "Compute profit if sale occurs",
            "result": "$5-2=3$",
            "why": "price minus seller value"
          },
          {
            "do": "Compute sale probability",
            "result": "$0.5$",
            "why": "only High buys"
          },
          {
            "do": "Compute expected profit",
            "result": "$0.5\\cdot3=1.5$",
            "why": "profit weighted by sale probability"
          }
        ],
        "answer": "Expected seller profit at price $5$ is $1.5$."
      },
      {
        "problem": "A classifier can request human review. Easy cases occur with probability $0.6$ and have automated accuracy $0.95$; hard cases occur with probability $0.4$ and have accuracy $0.65$. Review costs $0.10$ and gives accuracy $0.98$. If correct is worth $1$, should hard cases be reviewed?",
        "steps": [
          {
            "do": "Compute hard automated value",
            "result": "$0.65$",
            "why": "accuracy times value"
          },
          {
            "do": "Compute hard review value before cost",
            "result": "$0.98$",
            "why": "review accuracy times value"
          },
          {
            "do": "Subtract review cost",
            "result": "$0.98-0.10=0.88$",
            "why": "cost lowers payoff"
          },
          {
            "do": "Compare hard values",
            "result": "$0.88>0.65$",
            "why": "review improves hard-case payoff"
          },
          {
            "do": "State type-contingent action",
            "result": "review hard cases",
            "why": "the hard type benefits from review"
          }
        ],
        "answer": "Yes. Hard cases should be reviewed because $0.88>0.65$."
      }
    ],
    "applications": [
      {
        "title": "Auctions with private values",
        "background": "Bayesian games are a foundation of auction theory because bidders know their own values but not others'.",
        "numbers": "If your value is $100$ and a sealed bid of $70$ wins with probability $0.4$, expected surplus is $0.4(100-70)=12$."
      },
      {
        "title": "Spam detection",
        "background": "A sender may be legitimate or spammy, and the filter chooses actions from probabilistic evidence. Types represent hidden sender classes.",
        "numbers": "Prior spam $20\\%$, flag rate $90\\%$ for spam and $10\\%$ for ham gives posterior spam after flag $0.18/(0.18+0.08)=0.692$."
      },
      {
        "title": "Hiring signals",
        "background": "Education and portfolios can signal private productivity. Bayesian reasoning compares what different types would choose.",
        "numbers": "If certification costs productive workers $2$ and unproductive workers $6$, while wage gain is $4$, only productive workers find it profitable."
      },
      {
        "title": "Personalized pricing",
        "background": "A seller may not know a buyer's value. Expected revenue weighs possible types against purchase decisions.",
        "numbers": "Price $30$: high value $50$ buys with probability $0.4$, low value $20$ does not, so revenue is $12$. Price $18$ sells to all, revenue $18$."
      },
      {
        "title": "Human-in-the-loop ML",
        "background": "Systems often know a confidence type but not the true label. Bayesian policies decide when to ask for help.",
        "numbers": "Review cost $0.05$ and accuracy gain from $0.70$ to $0.95$ is worth $0.25$, so review has net gain $0.20$ on uncertain cases."
      },
      {
        "title": "Cybersecurity",
        "background": "Defenders face attackers of unknown sophistication. A Bayesian model averages over attacker types when choosing controls.",
        "numbers": "Advanced attacker probability $0.2$ with loss $100$ and basic probability $0.8$ with loss $20$ gives expected unprotected loss $36$."
      }
    ],
    "applicationsClose": "Bayesian games are strategic probability: act for the type you are, while respecting uncertainty about everyone else.",
    "takeaways": [
      "A Bayesian-game strategy maps private types to actions.",
      "Bayes-Nash equilibrium requires every type to maximize expected payoff given beliefs.",
      "Common priors and consistent belief updates are central assumptions.",
      "Auctions, signaling, security, and human-in-the-loop ML all use incomplete-information reasoning."
    ]
  },
  "math-24-17": {
    "id": "math-24-17",
    "title": "Cooperative games and the core",
    "tagline": "Cooperative game theory asks which coalitions can create value and whether any proposed split is stable against group deviations.",
    "connections": {
      "buildsOn": [
        "sets",
        "inequalities",
        "payoff allocation",
        "optimization"
      ],
      "leadsTo": [
        "Shapley value",
        "mechanism design",
        "coalition formation"
      ],
      "usedWith": [
        "linear programming",
        "convexity",
        "fair division",
        "dual constraints"
      ]
    },
    "motivation": "<p>Not every strategic problem is about fighting. Sometimes the question is: if several people or systems cooperate, how much can they create together, and how should that value be divided?</p><p>A <b>cooperative game</b> names the value of every coalition. The <b>core</b> is the set of payoff divisions where no group can walk away and do better on its own. It is stability written as inequalities.</p>",
    "definition": "<p>For a player set $N$, a transferable-utility cooperative game assigns each coalition $S\\subseteq N$ a value $v(S)$ with $v(\\varnothing)=0$. An allocation $x=(x_i)_{i\\in N}$ is in the <b>core</b> if it is efficient, $$\\sum_{i\\in N}x_i=v(N),$$ and coalitionally rational, $$\\sum_{i\\in S}x_i\\ge v(S)\\quad\\text{for every }S\\subseteq N.$$</p><p>The inequalities come directly from blocking. If a coalition $S$ receives less than $v(S)$, its members can form $S$ alone and divide $v(S)$ so that they are collectively better off. The core contains exactly the allocations with no such blocking coalition.</p><p><b>Assumptions that matter:</b> utility is transferable like money or divisible reward; coalition values are known; players can enforce agreements within a coalition; and the core may be empty if coalition demands are mutually inconsistent.</p>",
    "worked": {
      "problem": "Three players have $v(\\{1\\})=v(\\{2\\})=v(\\{3\\})=0$, pair values $v(12)=6$, $v(13)=4$, $v(23)=4$, and grand value $v(123)=8$. Is allocation $x=(4,2,2)$ in the core?",
      "skills": [
        "coalition inequalities",
        "efficiency",
        "stability"
      ],
      "strategy": "Check efficiency first, then every coalition inequality that could block.",
      "steps": [
        {
          "do": "Check total allocation",
          "result": "$4+2+2=8$",
          "why": "efficiency requires the grand value"
        },
        {
          "do": "Compare to grand value",
          "result": "$8=v(123)$",
          "why": "the allocation uses all value"
        },
        {
          "do": "Check singleton coalitions",
          "result": "$4,2,2\\ge0$",
          "why": "each player gets at least alone value"
        },
        {
          "do": "Check coalition $12$",
          "result": "$4+2=6$",
          "why": "must be at least $v(12)=6$"
        },
        {
          "do": "Check coalition $13$",
          "result": "$4+2=6\\ge4$",
          "why": "coalition 13 cannot improve as a group"
        },
        {
          "do": "Check coalition $23$",
          "result": "$2+2=4$",
          "why": "must be at least $v(23)=4$"
        }
      ],
      "verify": "Every coalition receives at least what it can make alone, and the full value is fully allocated.",
      "answer": "Yes. The allocation $(4,2,2)$ is in the core.",
      "connects": "The core is a checklist of possible objections by every coalition."
    },
    "practice": [
      {
        "problem": "For a two-player game with $v(1)=1$, $v(2)=2$, $v(12)=5$, is allocation $(2,3)$ in the core?",
        "steps": [
          {
            "do": "Check efficiency",
            "result": "$2+3=5$",
            "why": "must equal grand value"
          },
          {
            "do": "Check player 1",
            "result": "$2\\ge1$",
            "why": "individual rationality"
          },
          {
            "do": "Check player 2",
            "result": "$3\\ge2$",
            "why": "individual rationality"
          },
          {
            "do": "Conclude",
            "result": "in the core",
            "why": "all coalition constraints hold"
          }
        ],
        "answer": "Yes, $(2,3)$ is in the core."
      },
      {
        "problem": "Same game: is allocation $(0,5)$ in the core?",
        "steps": [
          {
            "do": "Check efficiency",
            "result": "$0+5=5$",
            "why": "grand value is allocated"
          },
          {
            "do": "Check player 1 constraint",
            "result": "$0\\ge1$ is false",
            "why": "player 1 can get 1 alone"
          },
          {
            "do": "Identify blocking coalition",
            "result": "$\\{1\\}$",
            "why": "single player 1 objects"
          },
          {
            "do": "Conclude",
            "result": "not in the core",
            "why": "one violated inequality is enough"
          }
        ],
        "answer": "No. Player 1 blocks because $0<1$."
      },
      {
        "problem": "Three players have $v(123)=9$, $v(12)=5$, $v(13)=5$, $v(23)=5$, singletons $0$. Test $x=(3,3,3)$.",
        "steps": [
          {
            "do": "Check efficiency",
            "result": "$3+3+3=9$",
            "why": "uses grand value"
          },
          {
            "do": "Check singletons",
            "result": "$3\\ge0$ for each",
            "why": "individual constraints hold"
          },
          {
            "do": "Check pair 12",
            "result": "$3+3=6\\ge5$",
            "why": "pair cannot block"
          },
          {
            "do": "Check pair 13",
            "result": "$6\\ge5$",
            "why": "pair cannot block"
          },
          {
            "do": "Check pair 23",
            "result": "$6\\ge5$",
            "why": "pair cannot block"
          }
        ],
        "answer": "Yes. $(3,3,3)$ is in the core."
      },
      {
        "problem": "For $v(123)=9$ and every pair value $7$ with singleton values $0$, show the core is empty.",
        "steps": [
          {
            "do": "Write pair constraints",
            "result": "$x_1+x_2\\ge7$, $x_1+x_3\\ge7$, $x_2+x_3\\ge7$",
            "why": "each pair must be satisfied"
          },
          {
            "do": "Add pair constraints",
            "result": "$2(x_1+x_2+x_3)\\ge21$",
            "why": "each player appears in two pair sums"
          },
          {
            "do": "Use efficiency",
            "result": "$x_1+x_2+x_3=9$",
            "why": "grand value is 9"
          },
          {
            "do": "Substitute",
            "result": "$18\\ge21$",
            "why": "this is impossible"
          },
          {
            "do": "Conclude",
            "result": "core is empty",
            "why": "constraints conflict"
          }
        ],
        "answer": "The core is empty because pair demands require more than the grand coalition can allocate."
      },
      {
        "problem": "Three data owners create model value. Alone values are $0$; pair values are $10,8,6$ for AB, AC, BC; all together value is $15$. Test allocation A=$6$, B=$5$, C=$4$.",
        "steps": [
          {
            "do": "Check efficiency",
            "result": "$6+5+4=15$",
            "why": "all generated value is allocated"
          },
          {
            "do": "Check AB",
            "result": "$6+5=11\\ge10$",
            "why": "AB cannot block"
          },
          {
            "do": "Check AC",
            "result": "$6+4=10\\ge8$",
            "why": "AC cannot block"
          },
          {
            "do": "Check BC",
            "result": "$5+4=9\\ge6$",
            "why": "BC cannot block"
          },
          {
            "do": "Check singleton values",
            "result": "all shares are $\\ge0$",
            "why": "individual constraints hold"
          }
        ],
        "answer": "The allocation $(6,5,4)$ is in the core."
      }
    ],
    "applications": [
      {
        "title": "Data cooperatives",
        "background": "Multiple data owners may jointly train a better model. The core asks whether the reward split keeps every subgroup willing to participate.",
        "numbers": "If all three earn value $15$ but owners A and B can earn $10$ without C, then A+B must receive at least $10$ together."
      },
      {
        "title": "Cloud cost sharing",
        "background": "Teams sharing infrastructure need stable cost allocations. A coalition should not pay more than its standalone cost in cost-game form.",
        "numbers": "If teams A and B can run separately for $8$ but are charged $9$ together, they can object by leaving the pool."
      },
      {
        "title": "Supply-chain alliances",
        "background": "Suppliers may create savings by coordinating. The core checks whether any subset can capture better savings alone.",
        "numbers": "Total savings $100$ with pair AB able to save $70$ means A+B must receive at least $70$ of allocated savings."
      },
      {
        "title": "Federated learning incentives",
        "background": "Hospitals or devices may contribute data to a shared model. Stable rewards help prevent useful coalitions from leaving.",
        "numbers": "If hospitals 1 and 2 can reach AUC gain $0.04$ without hospital 3, their combined reward should value at least $0.04$ of contribution units."
      },
      {
        "title": "Ride-sharing matching",
        "background": "Passengers sharing a ride split cost. Core-like constraints say no subgroup should be able to take a cheaper separate ride.",
        "numbers": "If three-person ride costs $30$ and riders A+B can ride for $18$, their assigned charges should sum to no more than $18$ in the cost version."
      },
      {
        "title": "Open-source maintenance",
        "background": "Several firms funding a maintainer can view features as coalition value. Stable funding shares account for what subsets need most.",
        "numbers": "If all firms value maintenance at $300k$ and firms A+C value it at $220k$, then an allocation of benefit with A+C below $220k$ is unstable."
      }
    ],
    "applicationsClose": "The core turns fairness into a sturdy question: who could credibly leave together, and are they already receiving enough to stay?",
    "takeaways": [
      "A cooperative game assigns a value $v(S)$ to every coalition $S$.",
      "Core allocations are efficient and satisfy every coalition's value constraint.",
      "A coalition blocks an allocation if it receives less than it can make alone.",
      "The core can be empty when coalition demands are too strong to fit inside total value."
    ]
  },
  "math-24-18": {
    "id": "math-24-18",
    "title": "Evolutionary game theory",
    "tagline": "Evolutionary game theory studies strategies by asking which behaviors grow when payoffs determine reproduction or imitation.",
    "connections": {
      "buildsOn": [
        "expected payoff",
        "dynamical systems",
        "matrix games"
      ],
      "leadsTo": [
        "replicator dynamics",
        "multi-agent learning",
        "population games"
      ],
      "usedWith": [
        "differential equations",
        "fixed points",
        "stability",
        "Markov processes"
      ]
    },
    "motivation": "<p>You already know that successful habits tend to spread. If a strategy earns better outcomes in a population, more agents may copy it, reproduce it, or update toward it.</p><p><b>Evolutionary game theory</b> replaces fully rational one-shot choice with population change. The central question becomes: which strategies survive under payoff-driven dynamics?</p>",
    "definition": "<p>For a population state $x$, where $x_i$ is the fraction using strategy $i$, payoff matrix $A$ gives strategy payoff $(Ax)_i$ and average population payoff $x^T A x$. The <b>replicator equation</b> is $$\\dot x_i=x_i\\big((Ax)_i-x^T A x\\big).$$ A strategy grows when its payoff is above average and shrinks when below average.</p><p>This formula comes from proportional growth: the change in share equals current share times relative advantage. If a strategy is absent, $x_i=0$, it cannot grow without mutation because the multiplier is zero.</p><p><b>Assumptions that matter:</b> payoffs translate into growth or imitation rates; the population is large enough for deterministic shares; strategy shares are nonnegative and sum to $1$; and mutation or exploration must be added separately if absent strategies can reappear.</p>",
    "worked": {
      "problem": "In a population with Hawk share $x$ and Dove share $1-x$, payoffs are $u_H=2-4x$ and $u_D=1-x$. Find the interior equilibrium where both strategies have equal payoff.",
      "skills": [
        "replicator dynamics",
        "equilibrium",
        "linear equations"
      ],
      "strategy": "Interior rest points require used strategies to have equal payoff; otherwise one grows faster.",
      "steps": [
        {
          "do": "Set payoffs equal",
          "result": "$2-4x=1-x$",
          "why": "both strategies can coexist only if neither has an advantage"
        },
        {
          "do": "Move $x$ terms",
          "result": "$1=3x$",
          "why": "add $4x$ and subtract 1"
        },
        {
          "do": "Solve for share",
          "result": "$x=\\tfrac13$",
          "why": "divide by 3"
        },
        {
          "do": "Compute common payoff",
          "result": "$u_H=2-4/3=2/3$",
          "why": "substitute into Hawk payoff"
        },
        {
          "do": "Check Dove payoff",
          "result": "$u_D=1-1/3=2/3$",
          "why": "substitute into Dove payoff"
        }
      ],
      "verify": "At $x=1/3$, neither strategy earns more than the other, so the replicator force between them is zero.",
      "answer": "The interior equilibrium has Hawk share $1/3$ and Dove share $2/3$, with payoff $2/3$.",
      "connects": "Evolutionary equilibrium is about growth pressure, not just deliberate best response."
    },
    "practice": [
      {
        "problem": "If a strategy has share $0.2$, payoff $5$, and population average payoff $3$, compute $\\dot x$ under replicator dynamics.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$\\dot x=x(u-\\bar u)$",
            "why": "single-strategy growth term"
          },
          {
            "do": "Substitute values",
            "result": "$\\dot x=0.2(5-3)$",
            "why": "share times advantage"
          },
          {
            "do": "Compute difference",
            "result": "$5-3=2$",
            "why": "payoff advantage"
          },
          {
            "do": "Multiply",
            "result": "$0.4$",
            "why": "$0.2\\cdot2=0.4$"
          }
        ],
        "answer": "The share is increasing at rate $0.4$."
      },
      {
        "problem": "For two strategies, $u_A=3-2x$ and $u_B=1+x$, find the interior equal-payoff share of A.",
        "steps": [
          {
            "do": "Set payoffs equal",
            "result": "$3-2x=1+x$",
            "why": "coexistence condition"
          },
          {
            "do": "Move constants",
            "result": "$2=3x$",
            "why": "subtract 1 and add $2x$"
          },
          {
            "do": "Solve",
            "result": "$x=\\tfrac23$",
            "why": "divide by 3"
          },
          {
            "do": "Compute payoff",
            "result": "$u_A=3-4/3=5/3$",
            "why": "substitute"
          },
          {
            "do": "Check B",
            "result": "$1+2/3=5/3$",
            "why": "payoffs match"
          }
        ],
        "answer": "The interior share is $x=2/3$."
      },
      {
        "problem": "A population state is $x=(0.5,0.5)$ with strategy payoffs $(4,2)$. Compute average payoff and both growth rates.",
        "steps": [
          {
            "do": "Compute average payoff",
            "result": "$0.5\\cdot4+0.5\\cdot2=3$",
            "why": "weighted average"
          },
          {
            "do": "Growth of strategy 1",
            "result": "$0.5(4-3)=0.5$",
            "why": "above-average payoff grows"
          },
          {
            "do": "Growth of strategy 2",
            "result": "$0.5(2-3)=-0.5$",
            "why": "below-average payoff shrinks"
          },
          {
            "do": "Check conservation",
            "result": "$0.5+(-0.5)=0$",
            "why": "shares still sum to 1"
          }
        ],
        "answer": "Average payoff is $3$; growth rates are $0.5$ and $-0.5$."
      },
      {
        "problem": "In a coordination game, strategy A earns $2x$ and B earns $2(1-x)$. Find the interior equilibrium and describe direction at $x=0.6$.",
        "steps": [
          {
            "do": "Set payoffs equal",
            "result": "$2x=2(1-x)$",
            "why": "interior rest point"
          },
          {
            "do": "Solve",
            "result": "$x=0.5$",
            "why": "$2x=2-2x$ gives $4x=2$"
          },
          {
            "do": "Evaluate at $x=0.6$",
            "result": "$u_A=1.2$, $u_B=0.8$",
            "why": "substitute share"
          },
          {
            "do": "Compare payoffs",
            "result": "$u_A>u_B$",
            "why": "A has advantage"
          },
          {
            "do": "Infer direction",
            "result": "A share increases",
            "why": "above-average strategies spread"
          }
        ],
        "answer": "Interior equilibrium is $0.5$; at $x=0.6$, A increases."
      },
      {
        "problem": "A bandit population has policies P and Q. At current mix, P share is $0.7$, P reward $0.62$, Q reward $0.57$. Approximate one small update with step size $0.1$ using $x_{new}=x+0.1x(u_P-\\bar u)$.",
        "steps": [
          {
            "do": "Compute average reward",
            "result": "$0.7(0.62)+0.3(0.57)=0.605$",
            "why": "weighted by current shares"
          },
          {
            "do": "Compute P advantage",
            "result": "$0.62-0.605=0.015$",
            "why": "payoff above average"
          },
          {
            "do": "Compute growth increment",
            "result": "$0.1\\cdot0.7\\cdot0.015=0.00105$",
            "why": "step size times replicator term"
          },
          {
            "do": "Update P share",
            "result": "$0.70105$",
            "why": "add increment to $0.7"
          },
          {
            "do": "Interpret",
            "result": "P grows slightly",
            "why": "its reward is only a little above average"
          }
        ],
        "answer": "The updated P share is approximately $0.70105$."
      }
    ],
    "applications": [
      {
        "title": "Biological competition",
        "background": "The field began with biology, where reproductive success changes trait frequencies over generations.",
        "numbers": "If trait A has fitness $1.2$ and average fitness is $1.0$ at share $0.3$, replicator growth is $0.3(0.2)=0.06$."
      },
      {
        "title": "Cultural imitation",
        "background": "People may copy strategies that appear successful. Evolutionary games model the spread of norms without assuming perfect calculation.",
        "numbers": "If a norm earns payoff $7$ versus population average $5$ at share $0.4$, growth pressure is $0.8$ per time unit in the scaled model."
      },
      {
        "title": "Multi-agent RL policy populations",
        "background": "Population-based training keeps multiple policies and allocates more trials to better performers. The arithmetic resembles replicator growth.",
        "numbers": "Policy A reward $120$ versus average $100$ at share $0.25$ gives growth term $0.25\\cdot20=5$ before scaling."
      },
      {
        "title": "Traffic route choice",
        "background": "Drivers shift toward faster routes after experience. Payoffs can be negative travel times.",
        "numbers": "Route A time $20$ min and average time $25$ gives payoff advantage $5$ if payoff is negative time, so its share tends to grow."
      },
      {
        "title": "Security behavior",
        "background": "Defensive practices spread when they visibly reduce losses. Population dynamics describe adoption over time.",
        "numbers": "If MFA users lose $1\\%$ and nonusers lose $4\\%$, payoff advantage can be $3$ percentage points in favor of MFA."
      },
      {
        "title": "Algorithm selection",
        "background": "AutoML systems can keep a population of algorithms and expand those with better validation scores.",
        "numbers": "Algorithm X score $0.84$ versus average $0.80$ at share $0.2$ gives update term $0.2(0.04)=0.008$."
      }
    ],
    "applicationsClose": "Evolutionary games remind us that strategy can be selected by feedback, not only chosen by foresight.",
    "takeaways": [
      "Replicator dynamics grow strategies with above-average payoff and shrink those below average.",
      "Interior equilibria require all used strategies to have equal payoff.",
      "Absent strategies stay absent unless mutation or exploration is added.",
      "Population learning in biology, culture, traffic, and MARL often follows evolutionary logic."
    ]
  },
  "math-24-19": {
    "id": "math-24-19",
    "title": "Correlated equilibrium",
    "tagline": "Correlated equilibrium lets players coordinate through signals so no one wants to disobey their recommendation.",
    "connections": {
      "buildsOn": [
        "Nash equilibrium",
        "conditional probability",
        "expected payoff"
      ],
      "leadsTo": [
        "mechanism design",
        "traffic routing",
        "multi-agent coordination"
      ],
      "usedWith": [
        "linear inequalities",
        "Bayes' rule",
        "convex polytopes",
        "information design"
      ]
    },
    "motivation": "<p>You already know that advice can help people coordinate. If a trusted traffic app privately suggests routes to drivers, each driver may follow because the suggestion contains information about what others are likely doing.</p><p>A <b>correlated equilibrium</b> is exactly that: a probability distribution over action profiles plus private recommendations, such that each player prefers following their own recommendation given what that recommendation tells them.</p>",
    "definition": "<p>Let $\\pi(a)$ be a distribution over action profiles $a=(a_i,a_{-i})$. A mediator draws $a$ from $\\pi$ and privately recommends $a_i$ to player $i$. The distribution is a <b>correlated equilibrium</b> if for every player $i$, every recommended action $r$, and every alternative action $d$, following has at least as much conditional expected payoff as deviating: $$\\mathbb{E}[u_i(r,a_{-i})\\mid a_i=r]\\ge\\mathbb{E}[u_i(d,a_{-i})\\mid a_i=r].$$</p><p>The condition is just no-profitable-deviation after hearing the signal. Nash equilibrium is the special case where recommendations are independent across players; correlation can coordinate safer or more efficient outcomes.</p><p><b>Assumptions that matter:</b> the mediator's distribution is common knowledge; recommendations are private unless stated otherwise; players can condition only on their own recommendation; and the obedience inequalities must hold for every recommended action with positive probability.</p>",
    "worked": {
      "problem": "In Battle of the Sexes, payoffs are $(2,1)$ at $(A,A)$, $(1,2)$ at $(B,B)$, and $(0,0)$ off diagonal. A mediator recommends $(A,A)$ with probability $0.5$ and $(B,B)$ with probability $0.5$. Show this is a correlated equilibrium.",
      "skills": [
        "conditional expectation",
        "obedience constraints",
        "coordination"
      ],
      "strategy": "Given a recommendation, infer the other player's recommended action and compare follow versus deviate.",
      "steps": [
        {
          "do": "Condition on Player 1 being told A",
          "result": "other player is told A with probability $1$",
          "why": "the mediator only recommends matched pairs"
        },
        {
          "do": "Compute Player 1 payoff from following A",
          "result": "$2$",
          "why": "outcome is $(A,A)$"
        },
        {
          "do": "Compute Player 1 payoff from deviating to B",
          "result": "$0$",
          "why": "outcome becomes $(B,A)$"
        },
        {
          "do": "Condition on Player 1 being told B",
          "result": "other player is told B with probability $1$",
          "why": "same matched-pair logic"
        },
        {
          "do": "Compare Player 1 payoffs after B",
          "result": "follow gives $1$, deviate gives $0$",
          "why": "$(B,B)$ beats mismatch"
        },
        {
          "do": "Apply symmetry for Player 2",
          "result": "follow gives $1$ after A and $2$ after B, deviate gives $0$",
          "why": "both recommendations are obeyed"
        }
      ],
      "verify": "Each recommendation tells a player the other side is coordinated with them, so disobeying only creates a mismatch.",
      "answer": "The mediator distribution is a correlated equilibrium.",
      "connects": "Correlation can coordinate players without forcing them to use independent randomization."
    },
    "practice": [
      {
        "problem": "In the same game, compute expected payoffs under the $50$-$50$ mediator over $(A,A)$ and $(B,B)$.",
        "steps": [
          {
            "do": "Compute Player 1 expected payoff",
            "result": "$0.5\\cdot2+0.5\\cdot1$",
            "why": "average across the two coordinated outcomes"
          },
          {
            "do": "Simplify Player 1 payoff",
            "result": "$1.5$",
            "why": "$1+0.5=1.5$"
          },
          {
            "do": "Compute Player 2 expected payoff",
            "result": "$0.5\\cdot1+0.5\\cdot2$",
            "why": "use second coordinates"
          },
          {
            "do": "Simplify Player 2 payoff",
            "result": "$1.5$",
            "why": "$0.5+1=1.5$"
          },
          {
            "do": "State fairness",
            "result": "equal expected payoffs",
            "why": "the mediator alternates advantages"
          }
        ],
        "answer": "Both players get expected payoff $1.5$."
      },
      {
        "problem": "A traffic mediator sends one of two drivers to route L and the other to route R with equal probability. If both use same route each gets $2$; if split each gets $5$. Show obeying is optimal after recommendation L.",
        "steps": [
          {
            "do": "Condition on recommendation L",
            "result": "other driver is recommended R",
            "why": "the mediator always splits drivers"
          },
          {
            "do": "Payoff from obeying L",
            "result": "$5$",
            "why": "routes are split"
          },
          {
            "do": "Payoff from deviating to R",
            "result": "$2$",
            "why": "both drivers use R"
          },
          {
            "do": "Compare",
            "result": "$5>2$",
            "why": "obeying is better"
          },
          {
            "do": "Conclude for L",
            "result": "obedience holds",
            "why": "no profitable deviation after L"
          }
        ],
        "answer": "After recommendation L, obeying gives $5$ instead of $2$."
      },
      {
        "problem": "Suppose recommendation X tells you the other player chooses X with probability $0.7$ and Y with probability $0.3$. Your payoff from X is $4$ if matched and $0$ if not; deviating to Y gives $1$ if other X and $3$ if other Y. Should you obey?",
        "steps": [
          {
            "do": "Expected payoff from obeying X",
            "result": "$0.7\\cdot4+0.3\\cdot0=2.8$",
            "why": "condition on the recommendation"
          },
          {
            "do": "Expected payoff from deviating to Y",
            "result": "$0.7\\cdot1+0.3\\cdot3=1.6$",
            "why": "use alternative payoffs"
          },
          {
            "do": "Compare",
            "result": "$2.8>1.6$",
            "why": "following is better"
          },
          {
            "do": "State obedience",
            "result": "obey X",
            "why": "deviation is not profitable"
          }
        ],
        "answer": "Yes. Obeying X has expected payoff $2.8$ versus $1.6$."
      },
      {
        "problem": "A proposed correlated plan recommends $(A,A)$ with probability $1$, but Player 1 gets $0$ at $(A,A)$ and $2$ by switching to B while Player 2 stays A. Is it a correlated equilibrium?",
        "steps": [
          {
            "do": "Condition on Player 1 recommendation A",
            "result": "Player 2 plays A with probability $1$",
            "why": "only $(A,A)$ is recommended"
          },
          {
            "do": "Compute follow payoff",
            "result": "$0$",
            "why": "given by the problem"
          },
          {
            "do": "Compute deviation payoff",
            "result": "$2$",
            "why": "switch to B while Player 2 stays A"
          },
          {
            "do": "Compare",
            "result": "$2>0$",
            "why": "deviation is profitable"
          },
          {
            "do": "Conclude",
            "result": "not a correlated equilibrium",
            "why": "one obedience inequality fails"
          }
        ],
        "answer": "No. Player 1 would deviate from A to B."
      },
      {
        "problem": "A two-agent scheduler recommends Safe to both with probability $0.6$ and Fast to exactly one agent with probability $0.4$ split equally. If told Fast, the other is Safe; obeying Fast gives $8$, switching to Safe gives $5$. If told Safe, expected follow payoff is $6$ and switch payoff is $4$. Is the plan obedient?",
        "steps": [
          {
            "do": "Check Fast recommendation",
            "result": "$8>5$",
            "why": "obeying Fast beats switching"
          },
          {
            "do": "Check Safe recommendation",
            "result": "$6>4$",
            "why": "obeying Safe beats switching"
          },
          {
            "do": "Check both agents",
            "result": "same recommendation logic applies symmetrically",
            "why": "the plan treats agents equally"
          },
          {
            "do": "Apply definition",
            "result": "obedient",
            "why": "all listed deviations are unprofitable"
          },
          {
            "do": "Name result",
            "result": "correlated equilibrium candidate",
            "why": "obedience conditions are satisfied"
          }
        ],
        "answer": "Yes. The stated obedience comparisons all favor following recommendations."
      }
    ],
    "applications": [
      {
        "title": "Traffic routing",
        "background": "A central app can reduce congestion by correlating route recommendations. Private signals prevent everyone from taking the same shortcut.",
        "numbers": "If split routes give each driver $20$ minutes and same route gives $35$, following a split recommendation saves $15$ minutes."
      },
      {
        "title": "Wireless channel allocation",
        "background": "Devices can coordinate channel choices through recommendations to avoid interference. Correlation improves throughput.",
        "numbers": "Two devices on different channels get $10$ Mbps each; same channel gives $3$ Mbps. A mediator that splits them raises total throughput from $6$ to $20$ Mbps."
      },
      {
        "title": "Multi-agent task assignment",
        "background": "Robots can receive correlated private roles so they do not duplicate work. Obedience means each robot prefers its assigned role.",
        "numbers": "If one robot maps and one carries, team reward is $12$; if both map, reward is $5$. Role correlation gains $7$."
      },
      {
        "title": "Load balancing",
        "background": "A scheduler can randomize assignments in a correlated way across servers. Each worker follows because its own assignment implies others are balanced.",
        "numbers": "With two jobs, separate servers finish in $4$ seconds; same server takes $9$ seconds. Correlation cuts completion time by $5$ seconds."
      },
      {
        "title": "Recommendation platforms",
        "background": "Platforms may coordinate exposure so creators do not all compete for one slot. Correlated recommendations distribute attention.",
        "numbers": "If two campaigns shown to distinct segments each get $1000$ impressions, but overlap gives each $600$, correlation adds $800$ total impressions."
      },
      {
        "title": "Mechanism design",
        "background": "Correlated equilibrium is a bridge to mechanisms that recommend actions rather than force them. The obedience constraints are incentive constraints.",
        "numbers": "If following a recommendation pays expected $1.2$ and deviating pays $1.0$, a payment of $0.21$ is more than enough to preserve obedience if costs shift by $0.2$."
      }
    ],
    "applicationsClose": "Correlation is useful when the signal itself helps players trust that others are being guided in compatible ways.",
    "takeaways": [
      "A correlated equilibrium is a distribution over action profiles with no profitable deviation after private recommendations.",
      "Obedience is checked by conditional expected payoff for every recommendation.",
      "Nash equilibrium is a special independent case; correlation can improve coordination.",
      "Traffic, scheduling, wireless systems, and MARL coordination all use this signal-based idea."
    ]
  },
  "math-24-20": {
    "id": "math-24-20",
    "title": "GANs as minimax; multi-agent RL",
    "tagline": "GANs and multi-agent RL turn game theory into learning systems whose objectives move because other learners move too.",
    "connections": {
      "buildsOn": [
        "The minimax theorem",
        "Repeated games",
        "Correlated equilibrium",
        "gradients"
      ],
      "leadsTo": [
        "adversarial training",
        "self-play",
        "equilibrium learning"
      ],
      "usedWith": [
        "optimization",
        "stochastic gradients",
        "Markov decision processes",
        "Nash equilibrium"
      ]
    },
    "motivation": "<p>You already know how ordinary supervised learning feels: choose parameters to lower one loss on fixed data. Game-based ML is livelier. Another model, agent, or policy changes while you learn.</p><p>In a <b>GAN</b>, a generator tries to fool a discriminator while the discriminator tries to tell real from fake. In <b>multi-agent RL</b>, policies learn in an environment that includes other learning policies. Game theory gives the language for objectives, equilibria, and instability.</p>",
    "definition": "<p>A classic GAN objective is $$\\min_G\\max_D\\;\\mathbb{E}_{x\\sim p_{data}}[\\log D(x)]+\\mathbb{E}_{z\\sim p_z}[\\log(1-D(G(z)))].$$ Here $G$ maps noise $z$ to fake samples, $D(x)$ estimates probability that $x$ is real, and the discriminator maximizes classification log-likelihood while the generator tries to reduce the fake-detection term.</p><p>For fixed $G$, the best discriminator at a point is $D^*(x)=p_{data}(x)/(p_{data}(x)+p_G(x))$. This comes from maximizing $a\\log D+b\\log(1-D)$ in $D$, whose derivative is $a/D-b/(1-D)$; setting it to zero gives $D=a/(a+b)$. At equilibrium, $p_G=p_{data}$ and $D^*(x)=1/2$.</p><p><b>Assumptions that matter:</b> the ideal statement assumes enough model capacity, enough optimization, and well-defined distributions; practical training uses stochastic gradients and may cycle; multi-agent RL adds state, time, exploration, and nonstationarity because other policies are changing.</p>",
    "worked": {
      "problem": "A tiny discriminator sees 4 real samples with outputs $D=0.8,0.7,0.6,0.9$ and 4 generated samples with outputs $D=0.3,0.4,0.2,0.5$. Compute the discriminator GAN objective average using natural logs $\\ln0.8=-0.223$, $\\ln0.7=-0.357$, $\\ln0.6=-0.511$, $\\ln0.9=-0.105$, $\\ln0.7=-0.357$, $\\ln0.6=-0.511$, $\\ln0.8=-0.223$, $\\ln0.5=-0.693$.",
      "skills": [
        "GAN objective",
        "log loss",
        "averaging"
      ],
      "strategy": "Real samples contribute $\\log D(x)$; fake samples contribute $\\log(1-D(G(z)))$.",
      "steps": [
        {
          "do": "Sum real log terms",
          "result": "$-0.223-0.357-0.511-0.105=-1.196$",
          "why": "use $\\log D$ for real samples"
        },
        {
          "do": "Convert fake outputs to $1-D$",
          "result": "$0.7,0.6,0.8,0.5$",
          "why": "fake term rewards labeling fakes as fake"
        },
        {
          "do": "Sum fake log terms",
          "result": "$-0.357-0.511-0.223-0.693=-1.784$",
          "why": "use the provided logs"
        },
        {
          "do": "Add total log objective",
          "result": "$-1.196-1.784=-2.980$",
          "why": "discriminator objective sums real and fake contributions"
        },
        {
          "do": "Average over 8 terms",
          "result": "$-2.980/8=-0.3725$",
          "why": "average makes the scale per sample"
        },
        {
          "do": "Interpret discriminator quality",
          "result": "better than random on average",
          "why": "many real outputs exceed $0.5$ and fake outputs are below $0.5$"
        }
      ],
      "verify": "If all outputs were $0.5$, each term would be $\\ln0.5=-0.693$, much lower than the average $-0.3725$ here for the maximizing discriminator.",
      "answer": "The average discriminator objective is approximately $-0.373$ per term.",
      "connects": "The GAN minimax game is visible even in a small batch of log terms."
    },
    "practice": [
      {
        "problem": "For fixed densities $p_{data}(x)=0.6$ and $p_G(x)=0.2$ at one point, compute the optimal discriminator $D^*(x)$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$D^*(x)=p_{data}/(p_{data}+p_G)$",
            "why": "best discriminator for fixed generator"
          },
          {
            "do": "Substitute densities",
            "result": "$0.6/(0.6+0.2)$",
            "why": "use the given numbers"
          },
          {
            "do": "Add denominator",
            "result": "$0.6/0.8$",
            "why": "combine densities"
          },
          {
            "do": "Divide",
            "result": "$0.75$",
            "why": "the real density is three quarters of the total"
          },
          {
            "do": "Interpret",
            "result": "label mostly real",
            "why": "data density is larger than generator density"
          }
        ],
        "answer": "The optimal discriminator value is $0.75$."
      },
      {
        "problem": "A generator uses non-saturating loss $-\\log D(G(z))$. If three fake samples receive discriminator scores $0.25,0.50,0.80$, compute average loss using $-\\ln0.25=1.386$, $-\\ln0.50=0.693$, $-\\ln0.80=0.223$.",
        "steps": [
          {
            "do": "List losses",
            "result": "$1.386,0.693,0.223$",
            "why": "apply $-\\log D$ to each fake score"
          },
          {
            "do": "Add losses",
            "result": "$1.386+0.693+0.223=2.302$",
            "why": "sum batch losses"
          },
          {
            "do": "Divide by 3",
            "result": "$2.302/3\\approx0.767$",
            "why": "average over samples"
          },
          {
            "do": "Interpret scores",
            "result": "higher $D$ means lower generator loss",
            "why": "the $0.80$ sample contributes least"
          }
        ],
        "answer": "Average generator loss is approximately $0.767$."
      },
      {
        "problem": "In a two-agent zero-sum MARL state, policy A chooses Up with probability $0.6$. Payoff against opponent Left is $2$ for Up and $0$ for Down; against Right is $-1$ for Up and $3$ for Down. Compute A's expected payoff against opponent mix Left $0.5$, Right $0.5$.",
        "steps": [
          {
            "do": "Compute payoff if opponent Left",
            "result": "$0.6\\cdot2+0.4\\cdot0=1.2$",
            "why": "average over A's actions"
          },
          {
            "do": "Compute payoff if opponent Right",
            "result": "$0.6(-1)+0.4(3)=0.6$",
            "why": "average over A's actions"
          },
          {
            "do": "Weight opponent mix",
            "result": "$0.5\\cdot1.2+0.5\\cdot0.6$",
            "why": "opponent randomizes equally"
          },
          {
            "do": "Add",
            "result": "$0.6+0.3=0.9$",
            "why": "expected payoff across opponent actions"
          },
          {
            "do": "State value",
            "result": "$0.9$",
            "why": "this is one-state policy value"
          }
        ],
        "answer": "A's expected payoff is $0.9$."
      },
      {
        "problem": "A self-play agent's win rates against checkpoints are $0.55,0.48,0.62,0.50$. Compute the average and decide whether it clears a $0.54$ promotion threshold.",
        "steps": [
          {
            "do": "Add win rates",
            "result": "$0.55+0.48+0.62+0.50=2.15$",
            "why": "sum evaluation results"
          },
          {
            "do": "Divide by 4",
            "result": "$2.15/4=0.5375$",
            "why": "average across checkpoints"
          },
          {
            "do": "Compare to threshold",
            "result": "$0.5375<0.54$",
            "why": "promotion requires at least $0.54$"
          },
          {
            "do": "Decision",
            "result": "do not promote",
            "why": "the average falls short by $0.0025$"
          }
        ],
        "answer": "Average win rate is $0.5375$, so it does not clear the $0.54$ threshold."
      },
      {
        "problem": "A discriminator has real accuracy $90\\%$ on 100 real samples and fake accuracy $70\\%$ on 100 fake samples. Compute balanced accuracy and explain what generator pressure this creates.",
        "steps": [
          {
            "do": "Convert accuracies",
            "result": "$0.90$ and $0.70$",
            "why": "use proportions"
          },
          {
            "do": "Average the two rates",
            "result": "$(0.90+0.70)/2$",
            "why": "balanced accuracy weighs real and fake equally"
          },
          {
            "do": "Compute balanced accuracy",
            "result": "$0.80$",
            "why": "sum is $1.60$"
          },
          {
            "do": "Compare to random",
            "result": "$0.80>0.50$",
            "why": "the discriminator is strong"
          },
          {
            "do": "Infer generator pressure",
            "result": "improve fake realism",
            "why": "fake detection remains easy at $70\\%$ accuracy"
          }
        ],
        "answer": "Balanced accuracy is $0.80$; the generator is pressured to make fake samples harder to detect."
      }
    ],
    "applications": [
      {
        "title": "Image GAN training",
        "background": "GANs became famous for image generation because a discriminator can provide a learned training signal when pixel-wise targets are not enough.",
        "numbers": "If a batch has average $-\\log D(G(z))=0.9$ and improves to $0.6$, the generator has reduced loss by $0.3$ per fake sample."
      },
      {
        "title": "Mode collapse detection",
        "background": "A generator may fool the discriminator while covering too few data modes. Game metrics must be paired with diversity checks.",
        "numbers": "If real data has 10 classes but 1000 generated images cover only 4 classes, empirical class coverage is $40\\%$ even if discriminator loss looks good."
      },
      {
        "title": "Adversarial robustness",
        "background": "Robust training is another minimax problem: the model minimizes loss while an attacker maximizes it within a perturbation set.",
        "numbers": "Clean loss $0.20$ and adversarial loss $0.75$ make the robust objective $0.75$; after training, reducing adversarial loss to $0.45$ improves worst-case loss by $0.30$."
      },
      {
        "title": "Self-play in games",
        "background": "AlphaZero-style systems improve by playing against versions of themselves. The opponent distribution changes as the agent improves.",
        "numbers": "If a new policy wins 56 of 100 games against the current best, its estimated win rate is $0.56$; a 55 percent gate would promote it."
      },
      {
        "title": "Opponent nonstationarity in MARL",
        "background": "In multi-agent RL, your reward function can appear to change because other policies update. This breaks the fixed-data comfort of supervised learning.",
        "numbers": "If your policy's reward against opponent v1 is $8$ but against v2 is $3$, the same action lost $5$ value because the opponent changed."
      },
      {
        "title": "Population-based training",
        "background": "Instead of one opponent, agents train against a population to avoid overfitting to a single strategy.",
        "numbers": "Win rates against five opponents $0.7,0.6,0.5,0.4,0.3$ average to $0.5$, revealing that strength is uneven despite one high score."
      },
      {
        "title": "Reward shaping and social dilemmas",
        "background": "MARL often studies cooperation problems where individual reward conflicts with group reward. Game theory names the tension.",
        "numbers": "If two agents cooperate they each get $3$; unilateral defection gives defector $5$ and cooperator $0$; mutual defection gives $1$ each, exactly the repeated-game pressure seen in self-play."
      }
    ],
    "applicationsClose": "The ML lesson is practical and humbling: when learners interact, objectives are not fixed landscapes but strategic relationships.",
    "takeaways": [
      "A GAN is a minimax game between generator $G$ and discriminator $D$.",
      "For fixed $G$, the ideal discriminator is $D^*(x)=p_{data}(x)/(p_{data}(x)+p_G(x))$.",
      "At the ideal GAN equilibrium, generated and data distributions match and $D$ outputs $1/2$.",
      "Multi-agent RL adds nonstationarity because each agent learns while others learn.",
      "Self-play, adversarial robustness, and population training all use game-theoretic thinking."
    ]
  }
};
