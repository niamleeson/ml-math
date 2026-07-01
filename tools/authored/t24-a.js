module.exports = {
  "math-24-01": {
    "id": "math-24-01",
    "title": "Games, players, and payoffs",
    "tagline": "A game is a careful way to describe choices whose results depend on more than one decision-maker.",
    "connections": {
      "buildsOn": [
        "sets",
        "functions",
        "probability basics"
      ],
      "leadsTo": [
        "Normal-form games",
        "Dominant strategies",
        "Nash equilibrium"
      ],
      "usedWith": [
        "optimization",
        "expected value",
        "matrices",
        "fixed points"
      ]
    },
    "motivation": "<p>You already know how to optimize one person's choice: compare the outcomes and pick the best one. Game theory begins when your outcome also depends on what someone else chooses.</p><p>A <b>game</b> names the players, their available actions, and the payoff each player receives after everyone acts. That language is useful for auctions, markets, routing, GANs, and multi-agent learning because it keeps incentives visible instead of hiding them in prose.</p>",
    "definition": "<p>A finite strategic game has a set of players $N=\\{1,\\ldots,n\\}$, an action set $A_i$ for each player $i$, and a payoff function $u_i:A_1\\times\\cdots\\times A_n\\to\\mathbb{R}$. If the joint action is $a=(a_1,\\ldots,a_n)$, then player $i$ receives $u_i(a)$.</p><p>The key point is that $u_i$ is a function of the whole action profile, not just player $i$'s own action. For two players with actions $a_1$ and $a_2$, changing $a_2$ can change $u_1(a_1,a_2)$ even when $a_1$ stays fixed. That dependence is what makes a game different from ordinary one-person optimization.</p><p><b>Assumptions that matter:</b> payoffs are numerical preferences where larger means better for that player; the listed players and actions are the whole model; and the timing here is simultaneous unless a later lesson says otherwise.</p>",
    "worked": {
      "problem": "Two ad bidders choose High or Low bids. Payoffs are $(u_A,u_B)$: High/High $(2,2)$, High/Low $(5,1)$, Low/High $(1,5)$, Low/Low $(3,3)$. Identify the players, actions, and payoff to A when A chooses High and B chooses Low.",
      "skills": [
        "game components",
        "payoff reading",
        "action profiles"
      ],
      "strategy": "The numbers are not hard; the skill is naming the parts so later equilibrium questions have a clean model.",
      "steps": [
        {
          "do": "List the players",
          "result": "$N=\\{A,B\\}$",
          "why": "there are two decision-makers"
        },
        {
          "do": "List A's actions",
          "result": "$A_A=\\{\\text{High},\\text{Low}\\}$",
          "why": "A has two possible bids"
        },
        {
          "do": "List B's actions",
          "result": "$A_B=\\{\\text{High},\\text{Low}\\}$",
          "why": "B has the same two possible bids"
        },
        {
          "do": "Write the requested action profile",
          "result": "$(\\text{High},\\text{Low})$",
          "why": "A's action is listed first and B's second"
        },
        {
          "do": "Read the payoff pair",
          "result": "$(5,1)$",
          "why": "the table entry for High/Low gives both rewards"
        },
        {
          "do": "Select A's payoff",
          "result": "$u_A(\\text{High},\\text{Low})=5$",
          "why": "the first coordinate belongs to A"
        }
      ],
      "verify": "The payoff to B in the same cell is $1$, which reminds us that one outcome can be good for one player and poor for another.",
      "answer": "$u_A(\\text{High},\\text{Low})=5$; the game has players A and B, each with actions High and Low.",
      "connects": "A game turns a strategic situation into players, actions, and payoff functions."
    },
    "practice": [
      {
        "problem": "A routing game has drivers 1 and 2. Each chooses Route X or Route Y. How many pure action profiles are there, and list them.",
        "steps": [
          {
            "do": "Count player 1 actions",
            "result": "$2$",
            "why": "Route X and Route Y are available"
          },
          {
            "do": "Count player 2 actions",
            "result": "$2$",
            "why": "the second driver has the same choices"
          },
          {
            "do": "Multiply the counts",
            "result": "$2\\cdot2=4$",
            "why": "a profile chooses one action for each player"
          },
          {
            "do": "List the profiles",
            "result": "$(X,X),(X,Y),(Y,X),(Y,Y)$",
            "why": "ordered pairs record player 1 first"
          },
          {
            "do": "Check completeness",
            "result": "$4$ profiles listed",
            "why": "the list matches the count"
          }
        ],
        "answer": "There are $4$ pure action profiles: $(X,X),(X,Y),(Y,X),(Y,Y)$."
      },
      {
        "problem": "In a two-player game, payoffs at $(U,L)$ are $(4,-1)$. What are $u_1(U,L)$ and $u_2(U,L)$?",
        "steps": [
          {
            "do": "Identify the payoff pair",
            "result": "$(4,-1)$",
            "why": "the cell gives both players' payoffs"
          },
          {
            "do": "Read player 1's coordinate",
            "result": "$4$",
            "why": "player 1 uses the first coordinate"
          },
          {
            "do": "Write player 1's payoff",
            "result": "$u_1(U,L)=4$",
            "why": "use the action profile as the input"
          },
          {
            "do": "Read player 2's coordinate",
            "result": "$-1$",
            "why": "player 2 uses the second coordinate"
          },
          {
            "do": "Write player 2's payoff",
            "result": "$u_2(U,L)=-1$",
            "why": "negative payoffs are allowed"
          }
        ],
        "answer": "$u_1(U,L)=4$ and $u_2(U,L)=-1$."
      },
      {
        "problem": "Three agents each choose 0 or 1. How many joint actions are possible?",
        "steps": [
          {
            "do": "Count actions for agent 1",
            "result": "$2$",
            "why": "the choices are 0 and 1"
          },
          {
            "do": "Count actions for agent 2",
            "result": "$2$",
            "why": "the second choice is independent in the model"
          },
          {
            "do": "Count actions for agent 3",
            "result": "$2$",
            "why": "the third choice is also binary"
          },
          {
            "do": "Multiply the action counts",
            "result": "$2\\cdot2\\cdot2=8$",
            "why": "a joint action chooses for all three agents"
          },
          {
            "do": "State the growth pattern",
            "result": "$2^3=8$",
            "why": "binary choices across players multiply"
          }
        ],
        "answer": "There are $8$ joint actions."
      },
      {
        "problem": "A payoff is $u_1(a_1,a_2)=10-c(a_1)-2a_2$ with $c(0)=0$, $c(1)=3$, and $a_2\\in\\{0,1\\}$. Compute $u_1(1,0)$ and $u_1(1,1)$.",
        "steps": [
          {
            "do": "Substitute $(1,0)$",
            "result": "$u_1(1,0)=10-c(1)-2\\cdot0$",
            "why": "use the formula for the first profile"
          },
          {
            "do": "Use $c(1)=3$",
            "result": "$u_1(1,0)=10-3=7$",
            "why": "the cost of action 1 is 3"
          },
          {
            "do": "Substitute $(1,1)$",
            "result": "$u_1(1,1)=10-c(1)-2\\cdot1$",
            "why": "now player 2 chooses 1"
          },
          {
            "do": "Use $c(1)=3$ again",
            "result": "$u_1(1,1)=10-3-2=5$",
            "why": "both the cost and the interaction term apply"
          },
          {
            "do": "Compare the payoffs",
            "result": "$7>5$",
            "why": "player 2's action lowers player 1's payoff here"
          }
        ],
        "answer": "$u_1(1,0)=7$ and $u_1(1,1)=5$."
      },
      {
        "problem": "A learner receives reward $8$ if both agents choose Share, reward $2$ if it shares while the other does not, and reward $5$ if both do not share. If the other agent shares with probability $0.6$ and the learner chooses Share, what is its expected payoff?",
        "steps": [
          {
            "do": "List the relevant payoffs",
            "result": "$8$ and $2$",
            "why": "these are the learner's payoffs when it chooses Share"
          },
          {
            "do": "Attach probabilities",
            "result": "$0.6$ and $0.4$",
            "why": "the other shares with probability $0.6$ and does not with $1-0.6$"
          },
          {
            "do": "Write expected payoff",
            "result": "$0.6\\cdot8+0.4\\cdot2$",
            "why": "weight each payoff by its probability"
          },
          {
            "do": "Multiply",
            "result": "$4.8+0.8$",
            "why": "compute each weighted contribution"
          },
          {
            "do": "Add",
            "result": "$5.6$",
            "why": "expected payoff averages over the other agent's action"
          }
        ],
        "answer": "The expected payoff from Share is $5.6$."
      }
    ],
    "applications": [
      {
        "title": "Ad auctions",
        "background": "Advertisers bid against one another, so the value of a bid depends on competing bids. Game models make that dependence explicit.",
        "numbers": "If A bids High and B bids Low with payoff $(5,1)$, A's payoff is $5$; if both bid High and payoff is $(2,2)$, A loses $3$ payoff points by facing a high rival."
      },
      {
        "title": "Traffic routing",
        "background": "Drivers choosing routes create congestion for each other. This is one of the classic examples of strategic externalities.",
        "numbers": "If two drivers split routes, each travel time is $20$ minutes; if both choose X, each takes $35$ minutes, so each loses $15$ minutes relative to splitting."
      },
      {
        "title": "GAN training",
        "background": "A generative adversarial network has a generator and discriminator with linked objectives. The generator's success depends on the discriminator's behavior.",
        "numbers": "If the discriminator accuracy falls from $0.90$ to $0.55$, a generator reward such as $1-\\text{accuracy}$ rises from $0.10$ to $0.45$."
      },
      {
        "title": "Multi-agent reinforcement learning",
        "background": "Multiple agents learning in one environment make rewards nonstationary from each other's perspective. A game state clarifies whose action changed the reward.",
        "numbers": "With two robots choosing Left or Right, there are $2\\cdot2=4$ joint actions at one state."
      },
      {
        "title": "Security games",
        "background": "Defenders allocate limited inspection effort while attackers choose targets. Payoffs represent losses, catches, and costs.",
        "numbers": "If guarding server A costs $2$ and prevents loss $10$ with probability $0.7$, expected prevented loss is $7$, net value $7-2=5$."
      },
      {
        "title": "Recommendation ecosystems",
        "background": "Platforms, creators, and users can have aligned or conflicting incentives. Game language separates each actor's payoff.",
        "numbers": "If a creator gains $6$ from exposure and a user loses $2$ from low relevance, the same recommendation can have payoff pair $(6,-2)$."
      }
    ],
    "applicationsClose": "Across auctions, roads, adversarial models, and teams of agents, the same first move is to name who chooses, what they can choose, and how each outcome is valued.",
    "takeaways": [
      "A game consists of players, action sets, and payoff functions.",
      "A payoff depends on the whole action profile, not only one player's action.",
      "Larger payoff means better for that player within the model.",
      "Expected payoffs average over uncertain actions by other players."
    ]
  },
  "math-24-02": {
    "id": "math-24-02",
    "title": "Normal-form games",
    "tagline": "A normal-form table is a compact map of every simultaneous action profile and its payoffs.",
    "connections": {
      "buildsOn": [
        "Games, players, and payoffs",
        "tables",
        "ordered pairs"
      ],
      "leadsTo": [
        "Dominant strategies",
        "Dominated strategies",
        "Pure-strategy Nash equilibrium"
      ],
      "usedWith": [
        "matrices",
        "best responses",
        "expected value"
      ]
    },
    "motivation": "<p>Once you can name players and payoffs, the next gift is organization. For two players with a few actions, a table lets you see the whole strategic world at once.</p><p>A <b>normal-form game</b> is that table. Rows are one player's actions, columns are the other's, and each cell stores the payoff pair. This simple format is where many equilibrium ideas become visible by comparing numbers in rows and columns.</p>",
    "definition": "<p>For a two-player finite game, a normal-form payoff matrix lists player 1's actions as rows and player 2's actions as columns. The cell in row $r$ and column $c$ contains $(u_1(r,c),u_2(r,c))$.</p><p>Reading the table is functional: fixing a column means player 2's action is held constant, so comparing first coordinates down that column compares player 1's options. Fixing a row means player 1's action is held constant, so comparing second coordinates across that row compares player 2's options.</p><p><b>Assumptions that matter:</b> the table represents simultaneous choices; each player knows the listed actions and payoffs in the model; and payoff pairs are ordered consistently, usually row player first and column player second.</p>",
    "worked": {
      "problem": "Given rows Top, Bottom and columns Left, Right with payoffs Top/Left $(3,2)$, Top/Right $(0,4)$, Bottom/Left $(5,1)$, Bottom/Right $(2,3)$, find player 1's best row when player 2 chooses Left and player 2's best column when player 1 chooses Top.",
      "skills": [
        "matrix reading",
        "best comparisons",
        "payoff coordinates"
      ],
      "strategy": "Hold the other player's action fixed, then compare the correct coordinate.",
      "steps": [
        {
          "do": "Fix player 2's action",
          "result": "Left column",
          "why": "we are finding player 1's best row against Left"
        },
        {
          "do": "Read player 1 payoff at Top/Left",
          "result": "$3$",
          "why": "the first coordinate in $(3,2)$ belongs to player 1"
        },
        {
          "do": "Read player 1 payoff at Bottom/Left",
          "result": "$5$",
          "why": "the first coordinate in $(5,1)$ belongs to player 1"
        },
        {
          "do": "Compare player 1 payoffs",
          "result": "$5>3$",
          "why": "larger payoff is preferred"
        },
        {
          "do": "State player 1's best row",
          "result": "Bottom",
          "why": "Bottom gives player 1 payoff 5 against Left"
        },
        {
          "do": "Fix player 1's action",
          "result": "Top row",
          "why": "now compare player 2's columns"
        },
        {
          "do": "Compare player 2 payoffs on Top row",
          "result": "$4>2$",
          "why": "Right gives player 2 payoff 4 and Left gives 2"
        },
        {
          "do": "State player 2's best column",
          "result": "Right",
          "why": "Right is better for player 2 when player 1 chooses Top"
        }
      ],
      "verify": "Each comparison changed only one player's action while holding the other player's action fixed, which is exactly how normal-form tables should be read.",
      "answer": "Against Left, player 1 prefers Bottom; against Top, player 2 prefers Right.",
      "connects": "Normal form makes strategic comparison a matter of scanning rows and columns carefully."
    },
    "practice": [
      {
        "problem": "In the table with $(U,L)=(2,2)$, $(U,R)=(6,0)$, $(D,L)=(1,5)$, $(D,R)=(4,4)$, what is player 1's payoff at $(U,R)$ and player 2's payoff at $(D,L)$?",
        "steps": [
          {
            "do": "Read the $(U,R)$ cell",
            "result": "$(6,0)$",
            "why": "row U and column R identify the cell"
          },
          {
            "do": "Select player 1's coordinate",
            "result": "$6$",
            "why": "player 1 is first"
          },
          {
            "do": "Read the $(D,L)$ cell",
            "result": "$(1,5)$",
            "why": "row D and column L identify the cell"
          },
          {
            "do": "Select player 2's coordinate",
            "result": "$5$",
            "why": "player 2 is second"
          },
          {
            "do": "State both values",
            "result": "$u_1(U,R)=6$, $u_2(D,L)=5$",
            "why": "use payoff-function notation"
          }
        ],
        "answer": "$u_1(U,R)=6$ and $u_2(D,L)=5$."
      },
      {
        "problem": "For the same table, find player 1's best response to column R.",
        "steps": [
          {
            "do": "Fix column R",
            "result": "cells $(U,R)$ and $(D,R)$",
            "why": "player 2's action is held constant"
          },
          {
            "do": "Read player 1 payoff at $(U,R)$",
            "result": "$6$",
            "why": "first coordinate of $(6,0)$"
          },
          {
            "do": "Read player 1 payoff at $(D,R)$",
            "result": "$4$",
            "why": "first coordinate of $(4,4)$"
          },
          {
            "do": "Compare",
            "result": "$6>4$",
            "why": "player 1 prefers the larger payoff"
          },
          {
            "do": "Choose the row",
            "result": "U",
            "why": "U gives the larger payoff against R"
          }
        ],
        "answer": "Player 1's best response to R is U."
      },
      {
        "problem": "For the same table, find player 2's best response to row D.",
        "steps": [
          {
            "do": "Fix row D",
            "result": "cells $(D,L)$ and $(D,R)$",
            "why": "player 1's action is held constant"
          },
          {
            "do": "Read player 2 payoff at $(D,L)$",
            "result": "$5$",
            "why": "second coordinate of $(1,5)$"
          },
          {
            "do": "Read player 2 payoff at $(D,R)$",
            "result": "$4$",
            "why": "second coordinate of $(4,4)$"
          },
          {
            "do": "Compare",
            "result": "$5>4$",
            "why": "player 2 prefers the larger payoff"
          },
          {
            "do": "Choose the column",
            "result": "L",
            "why": "L gives the larger payoff against D"
          }
        ],
        "answer": "Player 2's best response to D is L."
      },
      {
        "problem": "A $3\\times2$ normal-form game has 3 rows and 2 columns. How many payoff pairs must be listed?",
        "steps": [
          {
            "do": "Count row actions",
            "result": "$3$",
            "why": "player 1 has 3 actions"
          },
          {
            "do": "Count column actions",
            "result": "$2$",
            "why": "player 2 has 2 actions"
          },
          {
            "do": "Multiply actions",
            "result": "$3\\cdot2=6$",
            "why": "each row-column combination is a cell"
          },
          {
            "do": "Attach payoff pairs",
            "result": "$6$ pairs",
            "why": "each cell stores one pair"
          },
          {
            "do": "Note the number of individual payoffs",
            "result": "$12$ numbers",
            "why": "each pair contains two payoffs"
          }
        ],
        "answer": "The table has $6$ payoff pairs, containing $12$ individual payoff numbers."
      },
      {
        "problem": "If player 1 randomizes U with probability $0.25$ and D with $0.75$, and player 2 chooses L, compute player 1's expected payoff from the table $(U,L)=(2,2)$ and $(D,L)=(1,5)$.",
        "steps": [
          {
            "do": "List player 1 payoffs in column L",
            "result": "$2$ and $1$",
            "why": "use first coordinates"
          },
          {
            "do": "Attach probabilities",
            "result": "$0.25$ and $0.75$",
            "why": "these are player 1's own mixing probabilities"
          },
          {
            "do": "Write the expected payoff",
            "result": "$0.25\\cdot2+0.75\\cdot1$",
            "why": "average payoffs by probability"
          },
          {
            "do": "Multiply",
            "result": "$0.5+0.75$",
            "why": "compute weighted terms"
          },
          {
            "do": "Add",
            "result": "$1.25$",
            "why": "sum the weighted payoffs"
          }
        ],
        "answer": "Player 1's expected payoff is $1.25$."
      }
    ],
    "applications": [
      {
        "title": "A/B platform decisions",
        "background": "A platform and advertiser may each choose aggressive or conservative settings. Normal form shows every combination.",
        "numbers": "Two actions each give $2\\cdot2=4$ cells; if Aggressive/Conservative gives $(7,3)$, platform payoff is $7$ and advertiser payoff is $3$."
      },
      {
        "title": "Model competition",
        "background": "Two teams may choose fast or accurate models. The payoff table can encode latency and quality tradeoffs.",
        "numbers": "If both choose accurate, payoff $(5,5)$; if one chooses fast against accurate, payoff $(6,3)$ for the fast team and other team."
      },
      {
        "title": "Pricing games",
        "background": "Retailers choosing high or low prices form a classic simultaneous game. Tables make undercutting incentives easy to inspect.",
        "numbers": "If High/High yields $(10,10)$ and Low/High yields $(14,4)$, the row retailer gains $4$ by undercutting."
      },
      {
        "title": "Cyber defense",
        "background": "A defender chooses Monitor or Ignore while an attacker chooses Attack or Wait. The normal-form table lists losses and costs.",
        "numbers": "If Monitor/Attack gives defender payoff $-2$ and Ignore/Attack gives $-10$, monitoring improves defender payoff by $8$."
      },
      {
        "title": "MARL joint action values",
        "background": "In multi-agent RL, a central critic can store values for joint actions much like a payoff matrix.",
        "numbers": "With 4 actions for agent A and 3 for agent B, the critic evaluates $4\\cdot3=12$ joint actions per state."
      },
      {
        "title": "GAN objective snapshots",
        "background": "A generator choice and discriminator threshold can be discretized to inspect training incentives at a moment in time.",
        "numbers": "If G1/D1 yields losses $(0.8,0.3)$ and G2/D1 yields $(0.6,0.5)$, a payoff defined as negative loss gives generator payoffs $-0.8$ and $-0.6$."
      }
    ],
    "applicationsClose": "A normal-form table is modest, but it teaches the essential discipline of holding one choice fixed while comparing another.",
    "takeaways": [
      "Rows and columns represent simultaneous actions.",
      "Each cell stores an ordered payoff pair.",
      "Compare first coordinates down a fixed column for player 1.",
      "Compare second coordinates across a fixed row for player 2."
    ]
  },
  "math-24-03": {
    "id": "math-24-03",
    "title": "Dominant strategies",
    "tagline": "A dominant strategy is a choice that stays best no matter what the other player does.",
    "connections": {
      "buildsOn": [
        "Normal-form games",
        "payoff comparisons",
        "inequalities"
      ],
      "leadsTo": [
        "Dominated strategies",
        "Iterated elimination",
        "Nash equilibrium"
      ],
      "usedWith": [
        "best responses",
        "optimization",
        "matrices"
      ]
    },
    "motivation": "<p>You have probably seen decisions that feel robust: no matter what someone else does, one option still looks better. Game theory gives that feeling a precise name.</p><p>A <b>dominant strategy</b> is powerful because it removes strategic guessing. Instead of predicting the other player, you compare your payoffs against each possible action they might take and see whether the same action wins every time.</p>",
    "definition": "<p>For player $i$, strategy $s_i$ <b>strictly dominates</b> another strategy $t_i$ if $u_i(s_i,s_{-i})>u_i(t_i,s_{-i})$ for every possible strategy profile $s_{-i}$ of the other players. A strategy is strictly dominant if it strictly dominates every other strategy available to that player.</p><p>The condition is column-by-column for a row player and row-by-row for a column player. The word every matters: one exception is enough to destroy strict dominance. Weak dominance replaces $>$ with $\\ge$ everywhere and requires $>$ somewhere.</p><p><b>Assumptions that matter:</b> payoff numbers correctly represent preferences; all relevant opponent actions are listed; strict dominance needs a strict improvement in every opponent case; and weak dominance is useful but more delicate because ties can matter.</p>",
    "worked": {
      "problem": "Rows Up and Down face columns Left and Right. Player 1 payoffs are: Up/Left $4$, Down/Left $2$, Up/Right $3$, Down/Right $1$. Does Up strictly dominate Down for player 1?",
      "skills": [
        "dominance checks",
        "column comparisons",
        "strict inequalities"
      ],
      "strategy": "Check the same pair of rows separately in each opponent column.",
      "steps": [
        {
          "do": "Fix column Left",
          "result": "compare $4$ with $2$",
          "why": "player 2 choosing Left is one possible case"
        },
        {
          "do": "Evaluate the Left comparison",
          "result": "$4>2$",
          "why": "Up gives player 1 more than Down"
        },
        {
          "do": "Fix column Right",
          "result": "compare $3$ with $1$",
          "why": "player 2 choosing Right is the other case"
        },
        {
          "do": "Evaluate the Right comparison",
          "result": "$3>1$",
          "why": "Up again gives player 1 more"
        },
        {
          "do": "Combine the cases",
          "result": "Up beats Down in every column",
          "why": "strict dominance requires every opponent action"
        },
        {
          "do": "State the dominance result",
          "result": "Up strictly dominates Down",
          "why": "all comparisons are strict"
        }
      ],
      "verify": "There are only two columns and Up wins in both, so no hidden opponent action remains unchecked.",
      "answer": "Yes. Up strictly dominates Down for player 1.",
      "connects": "Dominance is robust best-choice reasoning across all opponent actions."
    },
    "practice": [
      {
        "problem": "Player 1 payoffs are U/L $5$, D/L $3$, U/R $2$, D/R $4$. Does U strictly dominate D?",
        "steps": [
          {
            "do": "Fix column L",
            "result": "compare $5$ with $3$",
            "why": "start with one opponent action"
          },
          {
            "do": "Evaluate column L",
            "result": "$5>3$",
            "why": "U is better against L"
          },
          {
            "do": "Fix column R",
            "result": "compare $2$ with $4$",
            "why": "check the other opponent action"
          },
          {
            "do": "Evaluate column R",
            "result": "$2<4$",
            "why": "U is worse against R"
          },
          {
            "do": "Apply the every-case rule",
            "result": "no strict dominance",
            "why": "one failed column is enough"
          }
        ],
        "answer": "No. U does not strictly dominate D because it loses when the column player chooses R."
      },
      {
        "problem": "Player 1 payoffs are A/L $3$, B/L $3$, A/R $6$, B/R $2$. Does A weakly dominate B?",
        "steps": [
          {
            "do": "Compare in column L",
            "result": "$3=3$",
            "why": "weak dominance permits ties"
          },
          {
            "do": "Compare in column R",
            "result": "$6>2$",
            "why": "A is strictly better in this column"
          },
          {
            "do": "Check non-worse condition",
            "result": "$3\\ge3$ and $6\\ge2$",
            "why": "A is never worse"
          },
          {
            "do": "Check strict-somewhere condition",
            "result": "$6>2$",
            "why": "there is at least one strict gain"
          },
          {
            "do": "State the result",
            "result": "A weakly dominates B",
            "why": "both weak-dominance requirements hold"
          }
        ],
        "answer": "Yes. A weakly dominates B."
      },
      {
        "problem": "For player 2, row U has payoffs L $1$, R $4$ and row D has payoffs L $2$, R $5$. Does R strictly dominate L for player 2?",
        "steps": [
          {
            "do": "Fix row U",
            "result": "compare R payoff $4$ with L payoff $1$",
            "why": "player 1's row is held fixed"
          },
          {
            "do": "Evaluate row U",
            "result": "$4>1$",
            "why": "R is better for player 2"
          },
          {
            "do": "Fix row D",
            "result": "compare R payoff $5$ with L payoff $2$",
            "why": "check the second row"
          },
          {
            "do": "Evaluate row D",
            "result": "$5>2$",
            "why": "R is again better"
          },
          {
            "do": "State dominance",
            "result": "R strictly dominates L",
            "why": "R wins in every row"
          }
        ],
        "answer": "Yes. R strictly dominates L for player 2."
      },
      {
        "problem": "A player has three strategies with payoffs against two opponent actions: A $(4,4)$, B $(3,2)$, C $(5,1)$. Is any one strategy strictly dominant?",
        "steps": [
          {
            "do": "Compare A against B",
            "result": "$4>3$ and $4>2$",
            "why": "A strictly dominates B"
          },
          {
            "do": "Compare A against C in first case",
            "result": "$4<5$",
            "why": "A does not dominate C"
          },
          {
            "do": "Compare C against A in second case",
            "result": "$1<4$",
            "why": "C does not dominate A"
          },
          {
            "do": "Check dominant-strategy requirement",
            "result": "must beat both other strategies",
            "why": "strictly dominant means dominates every alternative"
          },
          {
            "do": "Conclude",
            "result": "no strictly dominant strategy",
            "why": "A beats B but not C; C does not beat A"
          }
        ],
        "answer": "No strategy is strictly dominant."
      },
      {
        "problem": "In a prisoner's-dilemma payoff table, Cooperate/Cooperate gives $3$, Defect/Cooperate gives $5$, Cooperate/Defect gives $0$, Defect/Defect gives $1$ for player 1. Show Defect strictly dominates Cooperate for player 1.",
        "steps": [
          {
            "do": "Fix opponent Cooperate",
            "result": "Defect payoff $5$ versus Cooperate payoff $3$",
            "why": "compare player 1's options"
          },
          {
            "do": "Evaluate the first comparison",
            "result": "$5>3$",
            "why": "Defect is better if the other cooperates"
          },
          {
            "do": "Fix opponent Defect",
            "result": "Defect payoff $1$ versus Cooperate payoff $0$",
            "why": "compare the second case"
          },
          {
            "do": "Evaluate the second comparison",
            "result": "$1>0$",
            "why": "Defect is also better if the other defects"
          },
          {
            "do": "Apply strict dominance",
            "result": "Defect strictly dominates Cooperate",
            "why": "Defect wins in every opponent case"
          }
        ],
        "answer": "Defect strictly dominates Cooperate for player 1."
      }
    ],
    "applications": [
      {
        "title": "Prisoner's dilemma",
        "background": "The classic dilemma shows how individually dominant choices can produce a collectively worse outcome.",
        "numbers": "Defect gives $5$ instead of $3$ when the other cooperates and $1$ instead of $0$ when the other defects, so it dominates by margins $2$ and $1$."
      },
      {
        "title": "Auction bidding rules",
        "background": "Some auction formats make truthful bidding dominant. This is why second-price auctions are central in mechanism design.",
        "numbers": "If true value is $10$, bidding $10$ can win with surplus $10-7=3$ when the second price is $7$; overbidding to $12$ risks paying $11$ for value $10$, payoff $-1$."
      },
      {
        "title": "Spam filtering actions",
        "background": "A system may choose Block or Allow under uncertain attacker behavior. Dominance can identify a safe rule if one action is better in all cases.",
        "numbers": "If Block gives payoffs $8,6$ across two attack types while Allow gives $3,5$, Block strictly dominates because $8>3$ and $6>5$."
      },
      {
        "title": "Feature selection under costs",
        "background": "A model designer may compare using a costly feature versus skipping it across data regimes. Dominance is rare but valuable.",
        "numbers": "If using feature F gives validation utilities $0.82-0.03=0.79$ and $0.76-0.03=0.73$, while skipping gives $0.75$ and $0.70$, F dominates in both regimes."
      },
      {
        "title": "Routing protocols",
        "background": "A packet-routing policy may dominate another if it has lower latency under every congestion scenario.",
        "numbers": "Policy A latencies $20$ and $35$ ms beat policy B latencies $25$ and $40$ ms by $5$ ms in both cases."
      },
      {
        "title": "Multi-agent policies",
        "background": "In small MARL games, a policy can dominate another across every opponent policy. That lets pruning happen before learning deeper equilibria.",
        "numbers": "If policy P returns rewards $4,7,6$ against three opponents and Q returns $2,5,6$, P weakly dominates Q because $4\\ge2$, $7\\ge5$, $6\\ge6$, with strict gains twice."
      }
    ],
    "applicationsClose": "Dominance is the rare strategic shortcut: when it holds, the player's best choice does not depend on prediction.",
    "takeaways": [
      "Strict dominance means higher payoff against every opponent action.",
      "Weak dominance means never lower payoff and higher payoff somewhere.",
      "For row players, compare down each fixed column.",
      "Dominant strategies simplify games before equilibrium analysis begins."
    ]
  },
  "math-24-04": {
    "id": "math-24-04",
    "title": "Dominated strategies",
    "tagline": "A dominated strategy is an option you can safely distrust because another option does at least as well in the relevant comparisons.",
    "connections": {
      "buildsOn": [
        "Dominant strategies",
        "Normal-form games",
        "inequalities"
      ],
      "leadsTo": [
        "Iterated elimination",
        "Pure-strategy Nash equilibrium",
        "Mixed strategies"
      ],
      "usedWith": [
        "best responses",
        "matrix games",
        "optimization"
      ]
    },
    "motivation": "<p>Dominant strategies are the bright spotlight. Dominated strategies are the useful shadow: choices that should not survive careful comparison.</p><p>When one strategy is worse than another no matter what opponents do, rational play has a reason to discard it. This pruning is one of the first ways game theory reduces complexity without solving the whole game at once.</p>",
    "definition": "<p>Strategy $t_i$ is <b>strictly dominated</b> by strategy $s_i$ if $u_i(s_i,s_{-i})>u_i(t_i,s_{-i})$ for every opponent profile $s_{-i}$. It is <b>weakly dominated</b> if $u_i(s_i,s_{-i})\\ge u_i(t_i,s_{-i})$ for every opponent profile and the inequality is strict for at least one profile.</p><p>The definition is the same comparison as dominance, viewed from the losing strategy. A strictly dominated strategy can never be a best response to any pure opponent action because another available strategy gives more in every case.</p><p><b>Assumptions that matter:</b> dominance is judged within the listed strategy set; strict dominated strategies are safest to eliminate; weak elimination can change conclusions if done carelessly; and payoffs are ordinal in the sense that only preference order matters for dominance.</p>",
    "worked": {
      "problem": "Player 1 has rows A, B, C. Against columns L and R, payoffs are A $(6,5)$, B $(4,2)$, C $(3,7)$ for player 1. Is B strictly dominated by A?",
      "skills": [
        "dominated strategies",
        "column comparisons",
        "safe pruning"
      ],
      "strategy": "Compare the candidate dominator A against B in every column.",
      "steps": [
        {
          "do": "Compare against column L",
          "result": "$6$ versus $4$",
          "why": "use player 1 payoffs for A and B"
        },
        {
          "do": "Evaluate column L",
          "result": "$6>4$",
          "why": "A beats B when the opponent chooses L"
        },
        {
          "do": "Compare against column R",
          "result": "$5$ versus $2$",
          "why": "check the other opponent action"
        },
        {
          "do": "Evaluate column R",
          "result": "$5>2$",
          "why": "A beats B when the opponent chooses R"
        },
        {
          "do": "Apply the strict rule",
          "result": "B is strictly dominated by A",
          "why": "A gives more in every column"
        },
        {
          "do": "Interpret the pruning",
          "result": "B can be removed",
          "why": "B is never a best response while A remains available"
        }
      ],
      "verify": "C being better than A in one column does not matter for this question; B is already beaten by A everywhere.",
      "answer": "Yes. B is strictly dominated by A.",
      "connects": "A dominated strategy is identified by finding another strategy that beats it in every relevant case."
    },
    "practice": [
      {
        "problem": "Player 1 payoffs are A $(2,5)$ and B $(1,4)$ across columns L,R. Is B strictly dominated by A?",
        "steps": [
          {
            "do": "Compare column L",
            "result": "$2$ versus $1$",
            "why": "A's payoff is compared to B's"
          },
          {
            "do": "Evaluate column L",
            "result": "$2>1$",
            "why": "A is better in the first column"
          },
          {
            "do": "Compare column R",
            "result": "$5$ versus $4$",
            "why": "check the second column"
          },
          {
            "do": "Evaluate column R",
            "result": "$5>4$",
            "why": "A is better in the second column"
          },
          {
            "do": "State result",
            "result": "B is strictly dominated",
            "why": "A beats B everywhere"
          }
        ],
        "answer": "Yes. B is strictly dominated by A."
      },
      {
        "problem": "Player 1 payoffs are A $(2,5)$ and B $(2,3)$ across columns L,R. Is B weakly dominated by A?",
        "steps": [
          {
            "do": "Compare column L",
            "result": "$2=2$",
            "why": "weak dominance permits a tie"
          },
          {
            "do": "Compare column R",
            "result": "$5>3$",
            "why": "A is strictly better somewhere"
          },
          {
            "do": "Check never-worse condition",
            "result": "$2\\ge2$ and $5\\ge3$",
            "why": "A is never worse"
          },
          {
            "do": "Check strict-somewhere condition",
            "result": "$5>3$",
            "why": "there is a genuine improvement"
          },
          {
            "do": "State result",
            "result": "B is weakly dominated",
            "why": "both weak conditions hold"
          }
        ],
        "answer": "Yes. B is weakly dominated by A."
      },
      {
        "problem": "Player 2 columns L and R have payoffs against rows U,D: L $(3,6)$, R $(4,5)$ for player 2. Is either column strictly dominated?",
        "steps": [
          {
            "do": "Compare at row U",
            "result": "R payoff $4$ versus L payoff $3$",
            "why": "player 2 compares columns within a fixed row"
          },
          {
            "do": "Evaluate row U",
            "result": "$4>3$",
            "why": "R is better at U"
          },
          {
            "do": "Compare at row D",
            "result": "R payoff $5$ versus L payoff $6$",
            "why": "check the second row"
          },
          {
            "do": "Evaluate row D",
            "result": "$5<6$",
            "why": "R is worse at D"
          },
          {
            "do": "Conclude",
            "result": "no strict domination between L and R",
            "why": "each column is better in one row"
          }
        ],
        "answer": "Neither column strictly dominates the other."
      },
      {
        "problem": "Rows A, B, C have player 1 payoffs against L,R: A $(4,4)$, B $(1,3)$, C $(2,5)$. Which row is strictly dominated?",
        "steps": [
          {
            "do": "Compare A to B",
            "result": "$4>1$ and $4>3$",
            "why": "A beats B in both columns"
          },
          {
            "do": "Mark B",
            "result": "B is strictly dominated by A",
            "why": "the strict rule holds"
          },
          {
            "do": "Compare A to C",
            "result": "$4>2$ but $4<5$",
            "why": "A does not dominate C"
          },
          {
            "do": "Compare C to A",
            "result": "$2<4$",
            "why": "C does not dominate A"
          },
          {
            "do": "List dominated rows",
            "result": "B only",
            "why": "only B is beaten everywhere by another row"
          }
        ],
        "answer": "Row B is strictly dominated by row A."
      },
      {
        "problem": "A model policy Q has rewards $(1,2,3)$ against three opponent policies. Policy P has rewards $(2,2,4)$. Is Q weakly dominated by P, and what does that mean?",
        "steps": [
          {
            "do": "Compare first opponent",
            "result": "$2>1$",
            "why": "P is better in case 1"
          },
          {
            "do": "Compare second opponent",
            "result": "$2=2$",
            "why": "P ties in case 2"
          },
          {
            "do": "Compare third opponent",
            "result": "$4>3$",
            "why": "P is better in case 3"
          },
          {
            "do": "Check weak dominance",
            "result": "$2\\ge1$, $2\\ge2$, $4\\ge3$",
            "why": "P is never worse"
          },
          {
            "do": "Interpret",
            "result": "Q is weakly dominated",
            "why": "Q has no advantage over P in the listed cases"
          }
        ],
        "answer": "Yes. Q is weakly dominated by P, so P is at least as good against all listed opponents and better against some."
      }
    ],
    "applications": [
      {
        "title": "Strategy pruning",
        "background": "Dominated strategies let analysts shrink a game before solving it. This is especially helpful when action sets are large.",
        "numbers": "If a row's payoffs are $(1,2,1)$ and another row's are $(3,4,2)$, the first row is strictly dominated in all $3$ columns."
      },
      {
        "title": "Automated negotiation",
        "background": "Agents can remove offers that are worse for themselves under every response. That saves search time.",
        "numbers": "Offer A utilities $(5,6)$ beat offer B utilities $(3,4)$ across two buyer types, so B can be pruned."
      },
      {
        "title": "Hyperparameter policy choices",
        "background": "A training controller may drop a policy that never outperforms another across validation regimes.",
        "numbers": "If scheduler S has accuracies $(0.82,0.80,0.78)$ and T has $(0.79,0.80,0.75)$, T is weakly dominated by S."
      },
      {
        "title": "Security allocation",
        "background": "A defender can discard patrol plans that are worse under every attacker target.",
        "numbers": "Plan P expected losses $(-2,-4,-3)$ are better than Q losses $(-5,-6,-4)$ because larger utility means less loss in all targets."
      },
      {
        "title": "Robotics coordination",
        "background": "A robot team can remove motion primitives that use more energy and arrive later in every scenario.",
        "numbers": "Primitive A takes $(5,7)$ seconds while B takes $(6,9)$ seconds; if payoff is negative time, B is strictly dominated."
      },
      {
        "title": "GAN discriminator thresholds",
        "background": "During analysis, a threshold choice can be dominated if another threshold improves detection without hurting generator feedback in all sampled cases.",
        "numbers": "Threshold T1 utilities $(0.6,0.7,0.65)$ beat T2 $(0.5,0.7,0.60)$, so T2 is weakly dominated."
      }
    ],
    "applicationsClose": "Dominated strategies are the choices the table itself gives you permission to doubt.",
    "takeaways": [
      "A strictly dominated strategy is beaten in every opponent case by another strategy.",
      "A weakly dominated strategy is never better and sometimes worse.",
      "Strict dominated strategies are never best responses while the dominator remains.",
      "Eliminating weakly dominated strategies requires more care than eliminating strictly dominated ones."
    ]
  },
  "math-24-05": {
    "id": "math-24-05",
    "title": "Iterated elimination",
    "tagline": "Iterated elimination solves part of a game by repeatedly removing strategies that no longer make rational sense.",
    "connections": {
      "buildsOn": [
        "Dominated strategies",
        "Normal-form games",
        "logical implication"
      ],
      "leadsTo": [
        "Pure-strategy Nash equilibrium",
        "Mixed strategies",
        "Zero-sum games"
      ],
      "usedWith": [
        "matrix reduction",
        "best responses",
        "optimization"
      ]
    },
    "motivation": "<p>Sometimes one dominated strategy is only the first loose thread. Once you remove it, another strategy may become dominated in the smaller game.</p><p><b>Iterated elimination</b> follows that thread carefully. It is not magic; it is repeated comparison under a shrinking list of possibilities. The reward is a smaller game and sometimes a single predicted outcome.</p>",
    "definition": "<p><b>Iterated elimination of strictly dominated strategies</b> repeatedly removes any strategy that is strictly dominated in the current reduced game. After each removal, dominance comparisons are recomputed using only the remaining opponent strategies.</p><p>The recomputation matters because a strategy might not be dominated against all original columns, but can become dominated after a column is removed. For strict dominance in finite games, the final reduced set does not depend on the order of elimination in the same troublesome way weak dominance can.</p><p><b>Assumptions that matter:</b> players are treated as rational enough not to use strictly dominated strategies; this reasoning is common knowledge for multiple rounds of deletion; and weakly dominated strategies require caution because deletion order can affect what remains.</p>",
    "worked": {
      "problem": "Player 1 rows A,B and player 2 columns L,R. Payoffs are A/L $(4,2)$, A/R $(4,1)$, B/L $(1,3)$, B/R $(3,0)$. Use strict iterated elimination.",
      "skills": [
        "strict domination",
        "reduced games",
        "payoff tables"
      ],
      "strategy": "First find a strictly dominated strategy in the full game, delete it, then compare again in the smaller game.",
      "steps": [
        {
          "do": "Compare player 1 rows in column L",
          "result": "$4>1$",
          "why": "A beats B when player 2 chooses L"
        },
        {
          "do": "Compare player 1 rows in column R",
          "result": "$4>3$",
          "why": "A beats B when player 2 chooses R"
        },
        {
          "do": "Eliminate player 1 row",
          "result": "remove B",
          "why": "B is strictly dominated by A"
        },
        {
          "do": "Reduce the game",
          "result": "only row A remains",
          "why": "player 2 now compares payoffs on row A"
        },
        {
          "do": "Compare player 2 columns on row A",
          "result": "$2>1$",
          "why": "L gives player 2 more than R"
        },
        {
          "do": "Eliminate player 2 column",
          "result": "remove R",
          "why": "R is strictly dominated by L in the reduced game"
        },
        {
          "do": "State the surviving profile",
          "result": "$(A,L)$",
          "why": "only row A and column L remain"
        }
      ],
      "verify": "The second deletion was justified only after B was gone, because player 2's comparison in the reduced game used the remaining row A.",
      "answer": "Strict iterated elimination leaves the single profile $(A,L)$.",
      "connects": "Iterated elimination is dominance reasoning applied more than once."
    },
    "practice": [
      {
        "problem": "Rows U,D have player 1 payoffs against L,R: U $(3,3)$, D $(1,2)$. What row is eliminated first?",
        "steps": [
          {
            "do": "Compare in column L",
            "result": "$3>1$",
            "why": "U beats D against L"
          },
          {
            "do": "Compare in column R",
            "result": "$3>2$",
            "why": "U beats D against R"
          },
          {
            "do": "Apply strict domination",
            "result": "D is strictly dominated by U",
            "why": "U wins in every column"
          },
          {
            "do": "Eliminate the row",
            "result": "remove D",
            "why": "strictly dominated strategies can be deleted"
          },
          {
            "do": "Name the reduced rows",
            "result": "U remains",
            "why": "only U is left for player 1"
          }
        ],
        "answer": "Eliminate D first; U remains."
      },
      {
        "problem": "After only row U remains, player 2 payoffs are L $2$ and R $5$. Which column survives?",
        "steps": [
          {
            "do": "Fix the remaining row",
            "result": "U",
            "why": "the reduced game has one row"
          },
          {
            "do": "Read player 2 payoff for L",
            "result": "$2$",
            "why": "second coordinate for L"
          },
          {
            "do": "Read player 2 payoff for R",
            "result": "$5$",
            "why": "second coordinate for R"
          },
          {
            "do": "Compare",
            "result": "$5>2$",
            "why": "R is better for player 2"
          },
          {
            "do": "Eliminate the worse column",
            "result": "remove L",
            "why": "L is dominated in the reduced game"
          }
        ],
        "answer": "Column R survives."
      },
      {
        "problem": "A $3\\times2$ game has player 1 rows A $(5,5)$, B $(2,4)$, C $(1,6)$ across L,R. Which row is strictly dominated by A?",
        "steps": [
          {
            "do": "Compare A to B",
            "result": "$5>2$ and $5>4$",
            "why": "A beats B in both columns"
          },
          {
            "do": "Mark B",
            "result": "B is dominated by A",
            "why": "strict dominance holds"
          },
          {
            "do": "Compare A to C",
            "result": "$5>1$ but $5<6$",
            "why": "A does not beat C in every column"
          },
          {
            "do": "State eliminable row",
            "result": "B",
            "why": "only B is strictly dominated by A"
          },
          {
            "do": "Reduce row set",
            "result": "A and C remain",
            "why": "C must stay for now"
          }
        ],
        "answer": "Eliminate B; rows A and C remain."
      },
      {
        "problem": "In a reduced game, player 2 columns L,M,R have payoffs on the only remaining row: $4,1,3$. Which columns are strictly dominated?",
        "steps": [
          {
            "do": "Identify the best column payoff",
            "result": "$4$ at L",
            "why": "player 2 maximizes payoff"
          },
          {
            "do": "Compare L to M",
            "result": "$4>1$",
            "why": "L beats M on the only row"
          },
          {
            "do": "Compare L to R",
            "result": "$4>3$",
            "why": "L beats R on the only row"
          },
          {
            "do": "Eliminate dominated columns",
            "result": "remove M and R",
            "why": "both are strictly worse than L"
          },
          {
            "do": "State survivor",
            "result": "L",
            "why": "only L remains"
          }
        ],
        "answer": "M and R are strictly dominated by L; L survives."
      },
      {
        "problem": "A MARL joint-action table has agent 1 policies P,Q and agent 2 policies X,Y. Agent 1 rewards: P $(8,7)$, Q $(5,6)$. After deleting Q, agent 2 rewards on P are X $3$, Y $4$. What profile remains?",
        "steps": [
          {
            "do": "Compare agent 1 rewards against X",
            "result": "$8>5$",
            "why": "P beats Q if agent 2 uses X"
          },
          {
            "do": "Compare agent 1 rewards against Y",
            "result": "$7>6$",
            "why": "P beats Q if agent 2 uses Y"
          },
          {
            "do": "Delete Q",
            "result": "P remains",
            "why": "Q is strictly dominated"
          },
          {
            "do": "Compare agent 2 rewards on P",
            "result": "$4>3$",
            "why": "Y beats X in the reduced game"
          },
          {
            "do": "State the remaining profile",
            "result": "$(P,Y)$",
            "why": "one policy for each agent remains"
          }
        ],
        "answer": "The remaining profile is $(P,Y)$."
      }
    ],
    "applications": [
      {
        "title": "Solving small games",
        "background": "Before computing equilibria, economists often delete strictly dominated strategies to shrink the table.",
        "numbers": "A $4\\times4$ game has $16$ cells; deleting one row and one column leaves $3\\times3=9$ cells."
      },
      {
        "title": "Search pruning",
        "background": "Computer science uses the same spirit when removing actions that cannot be optimal under any remaining case.",
        "numbers": "If an action is beaten in all $5$ scenarios, deleting it reduces comparisons from $6\\cdot5=30$ to $5\\cdot5=25$."
      },
      {
        "title": "Negotiation agents",
        "background": "Automated negotiators can iteratively remove offers that rational opponents should not accept after earlier pruning.",
        "numbers": "If 10 offers become 7 after one pass and 5 after another, the search space drops by $50%$."
      },
      {
        "title": "Security planning",
        "background": "A defender may remove patrol plans dominated under all surviving attacker strategies, then remove attacks that are no longer attractive.",
        "numbers": "A $5\\times4$ table has $20$ cells; deleting 2 defender rows and 1 attacker column leaves $3\\times3=9$ cells."
      },
      {
        "title": "MARL action masking",
        "background": "In multi-agent RL, safe action masks sometimes remove provably inferior actions before policy updates.",
        "numbers": "If each of 3 agents has 5 actions, there are $5^3=125$ joint actions; pruning one action per agent leaves $4^3=64$."
      },
      {
        "title": "GAN design choices",
        "background": "Researchers may compare architectures or objectives under sampled discriminator settings and remove choices that are uniformly worse.",
        "numbers": "If generator G2 scores $(0.40,0.35,0.42)$ and G1 scores $(0.48,0.39,0.50)$, G2 can be pruned in that sampled table."
      }
    ],
    "applicationsClose": "Iterated elimination is patient reasoning: delete only what the current table proves, then look again.",
    "takeaways": [
      "Iterated elimination repeatedly removes dominated strategies from the current reduced game.",
      "After each deletion, recompute dominance using only surviving strategies.",
      "Strict elimination is safer and more order-robust than weak elimination.",
      "The method can shrink a game dramatically, but it may not solve every game completely."
    ]
  },
  "math-24-06": {
    "id": "math-24-06",
    "title": "Pure-strategy Nash equilibrium",
    "tagline": "A Nash equilibrium is a stable action profile where no single player wants to change alone.",
    "connections": {
      "buildsOn": [
        "Normal-form games",
        "best responses",
        "Dominated strategies"
      ],
      "leadsTo": [
        "Mixed strategies",
        "Mixed-strategy Nash equilibrium",
        "Zero-sum games"
      ],
      "usedWith": [
        "fixed points",
        "optimization",
        "matrix games"
      ]
    },
    "motivation": "<p>Dominance asks whether one choice wins against everything. Nash equilibrium asks a softer, more local question: once everyone has chosen, would anyone want to change alone?</p><p>A <b>pure-strategy Nash equilibrium</b> is stable in that precise unilateral sense. It does not mean everyone is happy, fair, or globally optimal. It means each player's action is a best response to the others' current actions.</p>",
    "definition": "<p>An action profile $a^\\ast=(a_1^\\ast,\\ldots,a_n^\\ast)$ is a <b>Nash equilibrium</b> if for every player $i$ and every alternative action $a_i$, $$u_i(a_i^\\ast,a_{-i}^\\ast)\\ge u_i(a_i,a_{-i}^\\ast).$$ Here $a_{-i}^\\ast$ means the other players' equilibrium actions held fixed.</p><p>The inequality is exactly a no-profitable-deviation test. Hold everyone else still; if player $i$ cannot improve by switching, player $i$ is content. When this holds for every player, the profile is mutually best responding.</p><p><b>Assumptions that matter:</b> deviations are unilateral; payoffs represent preferences; pure equilibrium uses deterministic actions, not probability mixtures; and an equilibrium can be inefficient or nonunique.</p>",
    "worked": {
      "problem": "Find the pure Nash equilibria in the table: U/L $(3,3)$, U/R $(0,4)$, D/L $(4,0)$, D/R $(1,1)$.",
      "skills": [
        "best responses",
        "Nash tests",
        "payoff matrices"
      ],
      "strategy": "Mark each player's best responses, then find cells where both marks meet.",
      "steps": [
        {
          "do": "Compare player 1 in column L",
          "result": "$4>3$",
          "why": "D is player 1's best response to L"
        },
        {
          "do": "Compare player 1 in column R",
          "result": "$1>0$",
          "why": "D is player 1's best response to R"
        },
        {
          "do": "Compare player 2 in row U",
          "result": "$4>3$",
          "why": "R is player 2's best response to U"
        },
        {
          "do": "Compare player 2 in row D",
          "result": "$1>0$",
          "why": "R is player 2's best response to D"
        },
        {
          "do": "Find mutual best responses",
          "result": "$(D,R)$",
          "why": "D is best against R and R is best against D"
        },
        {
          "do": "Test unilateral deviations at $(D,R)$",
          "result": "$1\\ge0$ for player 1 and $1\\ge0$ for player 2",
          "why": "neither player improves by switching alone"
        }
      ],
      "verify": "At $(D,R)$, switching alone lowers the switcher's payoff from $1$ to $0$, so the profile is stable even though $(U,L)$ gives both players $3$.",
      "answer": "The unique pure-strategy Nash equilibrium is $(D,R)$.",
      "connects": "Nash stability is about unilateral incentives, not about the largest total payoff."
    },
    "practice": [
      {
        "problem": "For U/L $(2,2)$, U/R $(0,3)$, D/L $(3,0)$, D/R $(1,1)$, find the pure Nash equilibrium.",
        "steps": [
          {
            "do": "Player 1 best response to L",
            "result": "D",
            "why": "$3>2$"
          },
          {
            "do": "Player 1 best response to R",
            "result": "D",
            "why": "$1>0$"
          },
          {
            "do": "Player 2 best response to U",
            "result": "R",
            "why": "$3>2$"
          },
          {
            "do": "Player 2 best response to D",
            "result": "R",
            "why": "$1>0$"
          },
          {
            "do": "Find the mutual best response",
            "result": "$(D,R)$",
            "why": "D and R point to the same cell"
          }
        ],
        "answer": "The pure Nash equilibrium is $(D,R)$."
      },
      {
        "problem": "Coordination game: A/A $(4,4)$, A/B $(0,0)$, B/A $(0,0)$, B/B $(3,3)$. Find all pure Nash equilibria.",
        "steps": [
          {
            "do": "Best response to column A for player 1",
            "result": "A",
            "why": "$4>0$"
          },
          {
            "do": "Best response to column B for player 1",
            "result": "B",
            "why": "$3>0$"
          },
          {
            "do": "Best response to row A for player 2",
            "result": "A",
            "why": "$4>0$"
          },
          {
            "do": "Best response to row B for player 2",
            "result": "B",
            "why": "$3>0$"
          },
          {
            "do": "List mutual best-response cells",
            "result": "$(A,A)$ and $(B,B)$",
            "why": "both players are best responding in those cells"
          }
        ],
        "answer": "The pure Nash equilibria are $(A,A)$ and $(B,B)$."
      },
      {
        "problem": "Matching pennies payoffs for player 1 are H/H $1$, H/T $-1$, T/H $-1$, T/T $1$, and player 2 has opposite payoffs. Show there is no pure Nash equilibrium.",
        "steps": [
          {
            "do": "Check H/H",
            "result": "player 2 can switch to T",
            "why": "player 2 improves from $-1$ to $1$"
          },
          {
            "do": "Check H/T",
            "result": "player 1 can switch to T",
            "why": "player 1 improves from $-1$ to $1$"
          },
          {
            "do": "Check T/H",
            "result": "player 1 can switch to H",
            "why": "player 1 improves from $-1$ to $1$"
          },
          {
            "do": "Check T/T",
            "result": "player 2 can switch to H",
            "why": "player 2 improves from $-1$ to $1$"
          },
          {
            "do": "Conclude",
            "result": "no pure Nash equilibrium",
            "why": "every cell has a profitable unilateral deviation"
          }
        ],
        "answer": "There is no pure-strategy Nash equilibrium."
      },
      {
        "problem": "At a candidate profile, player 1 can switch from payoff $5$ to $7$, while player 2 can switch from $4$ to $3$. Is it a Nash equilibrium?",
        "steps": [
          {
            "do": "Test player 1's deviation",
            "result": "$7>5$",
            "why": "player 1 can improve"
          },
          {
            "do": "Record the failure",
            "result": "profitable deviation exists",
            "why": "one improving player is enough"
          },
          {
            "do": "Test player 2's deviation",
            "result": "$3<4$",
            "why": "player 2 would not switch"
          },
          {
            "do": "Apply Nash condition",
            "result": "not an equilibrium",
            "why": "all players must lack profitable deviations"
          },
          {
            "do": "State the reason",
            "result": "player 1 breaks stability",
            "why": "unilateral stability fails"
          }
        ],
        "answer": "No. Player 1 has a profitable unilateral deviation."
      },
      {
        "problem": "A two-agent learning state has policies Safe and Risky. Payoffs are Safe/Safe $(6,6)$, Safe/Risky $(2,8)$, Risky/Safe $(8,2)$, Risky/Risky $(1,1)$. Find pure Nash equilibria.",
        "steps": [
          {
            "do": "Player 1 best response to Safe",
            "result": "Risky",
            "why": "$8>6$"
          },
          {
            "do": "Player 1 best response to Risky",
            "result": "Safe",
            "why": "$2>1$"
          },
          {
            "do": "Player 2 best response to Safe",
            "result": "Risky",
            "why": "$8>6$"
          },
          {
            "do": "Player 2 best response to Risky",
            "result": "Safe",
            "why": "$2>1$"
          },
          {
            "do": "Find mutual best responses",
            "result": "$(Safe,Risky)$ and $(Risky,Safe)$",
            "why": "each is stable against one-sided switching"
          }
        ],
        "answer": "The pure Nash equilibria are $(Safe,Risky)$ and $(Risky,Safe)$."
      }
    ],
    "applications": [
      {
        "title": "Traffic equilibria",
        "background": "Wardrop traffic equilibrium is a continuous cousin of Nash equilibrium: no driver can reduce travel time by switching routes alone.",
        "numbers": "If route A takes $30$ minutes and route B takes $25$, a driver on A has a $5$ minute profitable deviation, so the allocation is not stable."
      },
      {
        "title": "Pricing competition",
        "background": "Firms choosing prices may settle where neither wants to change price given the other's price.",
        "numbers": "If Low/Low gives profits $(4,4)$ and switching to High against Low gives $2$, neither firm improves by switching from Low."
      },
      {
        "title": "Protocol selection",
        "background": "Networks can have stable protocol choices when each node's protocol is best given neighbors' choices.",
        "numbers": "If both using protocol X gives utility $10$ each and switching alone gives $6$, $(X,X)$ is stable."
      },
      {
        "title": "Multi-agent RL evaluation",
        "background": "A learned joint policy is often checked for unilateral exploitability. Low exploitability means close to Nash stability.",
        "numbers": "If agent 1's current reward is $7.0$ and best unilateral alternative is $7.2$, exploitability for that agent is $0.2$."
      },
      {
        "title": "GAN training intuition",
        "background": "GANs are often described through equilibrium: the discriminator cannot improve and the generator cannot improve under the idealized objective.",
        "numbers": "At an ideal discriminator accuracy $0.5$, a simple discriminator payoff above random is $0.5-0.5=0$."
      },
      {
        "title": "Coordination standards",
        "background": "Technologies such as keyboard layouts or file formats can be equilibria because switching alone is costly.",
        "numbers": "If both use standard S, payoff is $9$ each; switching alone to T gives payoff $1$, so no single user wants to move first."
      }
    ],
    "applicationsClose": "Nash equilibrium is the quiet stability test underneath many strategic systems: would any one participant change if everyone else stayed put?",
    "takeaways": [
      "A pure Nash equilibrium is a mutual best-response action profile.",
      "Only unilateral deviations are tested.",
      "Equilibrium need not maximize total payoff.",
      "A game can have zero, one, or multiple pure Nash equilibria."
    ]
  },
  "math-24-07": {
    "id": "math-24-07",
    "title": "Mixed strategies",
    "tagline": "A mixed strategy lets a player choose a probability distribution over actions instead of one fixed action.",
    "connections": {
      "buildsOn": [
        "Pure-strategy Nash equilibrium",
        "expected value",
        "probability distributions"
      ],
      "leadsTo": [
        "Mixed-strategy Nash equilibrium",
        "Existence of equilibria",
        "Zero-sum games"
      ],
      "usedWith": [
        "linear functions",
        "simplex geometry",
        "expected payoff"
      ]
    },
    "motivation": "<p>When a pure choice is predictable, an opponent may exploit it. Randomization can be strategic, not indecisive.</p><p>A <b>mixed strategy</b> assigns probabilities to pure actions. Once probabilities enter, payoffs become expected payoffs: weighted averages over the possible action profiles. That one move is the bridge from tables to equilibrium existence.</p>",
    "definition": "<p>For a finite action set $A_i=\\{a_1,\\ldots,a_k\\}$, a mixed strategy for player $i$ is a probability vector $p=(p_1,\\ldots,p_k)$ with $p_j\\ge0$ and $\\sum_{j=1}^k p_j=1$. The number $p_j$ is the probability of playing action $a_j$.</p><p>If player 1 mixes with probabilities $p_r$ over rows and player 2 mixes with probabilities $q_c$ over columns, player 1's expected payoff is $$\\sum_r\\sum_c p_r q_c u_1(r,c).$$ This is just the expected-value rule applied to all row-column outcomes.</p><p><b>Assumptions that matter:</b> probabilities are chosen before the random draw; players evaluate lotteries by expected payoff; probabilities must be nonnegative and sum to $1$; and pure strategies are special mixed strategies with probability $1$ on one action.</p>",
    "worked": {
      "problem": "Player 1 chooses U with probability $0.7$ and D with $0.3$. Player 2 chooses L with probability $0.4$ and R with $0.6$. Player 1 payoffs are U/L $5$, U/R $1$, D/L $2$, D/R $4$. Compute player 1's expected payoff.",
      "skills": [
        "mixed strategies",
        "joint probabilities",
        "expected payoff"
      ],
      "strategy": "Multiply action probabilities to get cell probabilities, then weight each payoff.",
      "steps": [
        {
          "do": "Compute probability of U/L",
          "result": "$0.7\\cdot0.4=0.28$",
          "why": "independent mixed draws multiply"
        },
        {
          "do": "Compute probability of U/R",
          "result": "$0.7\\cdot0.6=0.42$",
          "why": "U combines with R"
        },
        {
          "do": "Compute probability of D/L",
          "result": "$0.3\\cdot0.4=0.12$",
          "why": "D combines with L"
        },
        {
          "do": "Compute probability of D/R",
          "result": "$0.3\\cdot0.6=0.18$",
          "why": "D combines with R"
        },
        {
          "do": "Write expected payoff",
          "result": "$0.28\\cdot5+0.42\\cdot1+0.12\\cdot2+0.18\\cdot4$",
          "why": "weight each payoff by its cell probability"
        },
        {
          "do": "Add weighted payoffs",
          "result": "$1.40+0.42+0.24+0.72=2.78$",
          "why": "sum all outcomes"
        }
      ],
      "verify": "The cell probabilities add to $1.00$, so the expected payoff is a proper weighted average.",
      "answer": "Player 1's expected payoff is $2.78$.",
      "connects": "Mixed strategies turn payoff tables into expected-value calculations."
    },
    "practice": [
      {
        "problem": "Is $p=(0.2,0.5,0.3)$ a valid mixed strategy?",
        "steps": [
          {
            "do": "Check nonnegativity",
            "result": "$0.2,0.5,0.3\\ge0$",
            "why": "probabilities cannot be negative"
          },
          {
            "do": "Add the probabilities",
            "result": "$0.2+0.5+0.3=1.0$",
            "why": "probabilities must sum to 1"
          },
          {
            "do": "Apply the definition",
            "result": "valid mixed strategy",
            "why": "both conditions hold"
          },
          {
            "do": "Interpret first component",
            "result": "$20%$ on action 1",
            "why": "probabilities describe randomization"
          },
          {
            "do": "Interpret support",
            "result": "all three actions are in support",
            "why": "each has positive probability"
          }
        ],
        "answer": "Yes. It is a valid mixed strategy."
      },
      {
        "problem": "Is $q=(0.6,0.6,-0.2)$ a valid mixed strategy?",
        "steps": [
          {
            "do": "Check the sum",
            "result": "$0.6+0.6-0.2=1.0$",
            "why": "the total condition happens to hold"
          },
          {
            "do": "Check nonnegativity",
            "result": "$-0.2<0$",
            "why": "one probability is negative"
          },
          {
            "do": "Apply the definition",
            "result": "invalid mixed strategy",
            "why": "all probabilities must be nonnegative"
          },
          {
            "do": "Name the issue",
            "result": "negative probability",
            "why": "probabilities cannot describe negative chance"
          },
          {
            "do": "State correction idea",
            "result": "choose nonnegative entries summing to 1",
            "why": "both conditions are required"
          }
        ],
        "answer": "No. It has a negative component."
      },
      {
        "problem": "A player mixes A with probability $0.25$ and B with $0.75$. Against opponent action X, payoffs are $8$ for A and $4$ for B. Compute expected payoff.",
        "steps": [
          {
            "do": "Attach probabilities",
            "result": "$0.25$ and $0.75$",
            "why": "these are the mixing weights"
          },
          {
            "do": "Write expected payoff",
            "result": "$0.25\\cdot8+0.75\\cdot4$",
            "why": "weight each payoff"
          },
          {
            "do": "Multiply first term",
            "result": "$2$",
            "why": "$0.25\\cdot8=2$"
          },
          {
            "do": "Multiply second term",
            "result": "$3$",
            "why": "$0.75\\cdot4=3$"
          },
          {
            "do": "Add",
            "result": "$5$",
            "why": "expected payoff is the weighted average"
          }
        ],
        "answer": "The expected payoff is $5$."
      },
      {
        "problem": "Player 2 chooses L with probability $q$. Player 1's payoff from U is $3$ against L and $7$ against R. Write expected payoff from U as a function of $q$.",
        "steps": [
          {
            "do": "Write probability of L",
            "result": "$q$",
            "why": "given in the problem"
          },
          {
            "do": "Write probability of R",
            "result": "$1-q$",
            "why": "two probabilities must sum to 1"
          },
          {
            "do": "Weight the L payoff",
            "result": "$3q$",
            "why": "payoff 3 occurs with probability q"
          },
          {
            "do": "Weight the R payoff",
            "result": "$7(1-q)$",
            "why": "payoff 7 occurs with probability $1-q$"
          },
          {
            "do": "Add and simplify",
            "result": "$3q+7(1-q)=7-4q$",
            "why": "combine expected payoff terms"
          }
        ],
        "answer": "The expected payoff from U is $7-4q$."
      },
      {
        "problem": "In rock-paper-scissors, a player mixes Rock, Paper, Scissors as $(1/3,1/3,1/3)$. If winning pays $1$, losing pays $-1$, and tying pays $0$, what is the expected payoff against opponent Rock?",
        "steps": [
          {
            "do": "List outcomes against Rock",
            "result": "Rock ties, Paper wins, Scissors loses",
            "why": "compare each action to Rock"
          },
          {
            "do": "List payoffs",
            "result": "$0,1,-1$",
            "why": "tie, win, loss"
          },
          {
            "do": "Attach probabilities",
            "result": "$1/3,1/3,1/3$",
            "why": "uniform mix"
          },
          {
            "do": "Write expectation",
            "result": "$(1/3)0+(1/3)1+(1/3)(-1)$",
            "why": "weight each payoff"
          },
          {
            "do": "Simplify",
            "result": "$0$",
            "why": "$1/3-1/3=0$"
          }
        ],
        "answer": "The expected payoff is $0$."
      }
    ],
    "applications": [
      {
        "title": "Randomized security patrols",
        "background": "Predictable patrols can be exploited. Mixed strategies make coverage uncertain.",
        "numbers": "If a guard visits gate A with probability $0.7$ and B with $0.3$, the expected covered value for assets $10$ and $6$ is $0.7\\cdot10+0.3\\cdot6=8.8$."
      },
      {
        "title": "Exploration in reinforcement learning",
        "background": "Epsilon-greedy policies mix a greedy action with random exploration so learning does not get stuck too early.",
        "numbers": "With $\\epsilon=0.1$ and 5 actions, the greedy action has probability $0.9+0.1/5=0.92$."
      },
      {
        "title": "GAN minibatch variation",
        "background": "Training uses random minibatches, which effectively mixes over examples and perturbations seen by generator and discriminator.",
        "numbers": "If two sample types appear with probabilities $0.6$ and $0.4$ and losses $1.2$ and $0.7$, expected loss is $0.6\\cdot1.2+0.4\\cdot0.7=1.0$."
      },
      {
        "title": "Load balancing",
        "background": "Servers can receive randomized traffic allocations to avoid deterministic overload.",
        "numbers": "Sending $40%$ of 1000 requests to server A gives expected load $0.4\\cdot1000=400$ requests."
      },
      {
        "title": "A/B testing",
        "background": "Experiments randomize users across variants. The strategy is a probability distribution over treatments.",
        "numbers": "With allocation $(0.5,0.3,0.2)$ over A,B,C for 10,000 users, expected counts are $5000,3000,2000$."
      },
      {
        "title": "Ad pacing",
        "background": "An ad system may randomize whether to bid on eligible impressions to meet a budget smoothly.",
        "numbers": "If 20,000 impressions are eligible and bid probability is $0.15$, expected bids are $3000$."
      }
    ],
    "applicationsClose": "Mixed strategies are probability distributions with a purpose: they let strategic choice be measured through expected payoff.",
    "takeaways": [
      "A mixed strategy is a nonnegative probability vector summing to $1$.",
      "Pure strategies are mixtures with one action assigned probability $1$.",
      "Expected payoff weights each outcome by its probability.",
      "Randomization can prevent predictable exploitation."
    ]
  },
  "math-24-08": {
    "id": "math-24-08",
    "title": "Mixed-strategy Nash equilibrium",
    "tagline": "A mixed equilibrium randomizes so that every action used with positive probability is worth using.",
    "connections": {
      "buildsOn": [
        "Mixed strategies",
        "Pure-strategy Nash equilibrium",
        "linear equations"
      ],
      "leadsTo": [
        "Existence of equilibria",
        "Zero-sum games",
        "GANs and adversarial training"
      ],
      "usedWith": [
        "expected value",
        "systems of equations",
        "best responses"
      ]
    },
    "motivation": "<p>Some games have no stable pure outcome. Matching pennies is the friendly warning: whatever fixed side you choose, the other player wants to react.</p><p>Mixed-strategy Nash equilibrium finds stability in uncertainty. Each player randomizes in a way that makes the other player indifferent among the pure actions they actually use. Indifference is not a feeling here; it is an equation of expected payoffs.</p>",
    "definition": "<p>A mixed-strategy profile $\\sigma^\\ast$ is a Nash equilibrium if no player can improve expected payoff by switching to another mixed or pure strategy. In a finite game, it is enough to check pure deviations because expected payoff is linear in a player's own probabilities.</p><p>The practical rule is the <b>indifference principle</b>: if a player assigns positive probability to several pure actions, those actions must all give the same expected payoff against the opponents' equilibrium mix. Any unused pure action must give no more than that value.</p><p><b>Assumptions that matter:</b> players maximize expected payoff; all probabilities in a support are positive and sum to $1$; indifference equations apply only to actions used with positive probability; and unused actions still need a no-better check.</p>",
    "worked": {
      "problem": "Matching pennies: player 1 gets $1$ if actions match and $-1$ otherwise; player 2 gets the opposite. Let player 2 play H with probability $q$. Find $q$ that makes player 1 indifferent between H and T.",
      "skills": [
        "indifference equations",
        "expected payoff",
        "mixed equilibrium"
      ],
      "strategy": "Set player 1's expected payoff from H equal to the expected payoff from T, then solve for the opponent's mixing probability.",
      "steps": [
        {
          "do": "Write payoff from H",
          "result": "$q(1)+(1-q)(-1)$",
          "why": "H wins when player 2 plays H and loses when player 2 plays T"
        },
        {
          "do": "Simplify payoff from H",
          "result": "$2q-1$",
          "why": "combine $q-1+q$"
        },
        {
          "do": "Write payoff from T",
          "result": "$q(-1)+(1-q)(1)$",
          "why": "T loses to H and wins against T"
        },
        {
          "do": "Simplify payoff from T",
          "result": "$1-2q$",
          "why": "combine $-q+1-q$"
        },
        {
          "do": "Set payoffs equal",
          "result": "$2q-1=1-2q$",
          "why": "indifference makes both pure actions usable"
        },
        {
          "do": "Solve for $q$",
          "result": "$q=\\tfrac12$",
          "why": "add $2q$ and add $1$, then divide by $4$"
        }
      ],
      "verify": "At $q=1/2$, both H and T give player 1 expected payoff $0$, so player 1 cannot exploit player 2's mix.",
      "answer": "Player 2 must mix H with probability $1/2$; by symmetry player 1 also mixes H with probability $1/2$.",
      "connects": "Mixed equilibrium balances incentives by making supported actions equally good."
    },
    "practice": [
      {
        "problem": "In matching pennies, if player 2 plays H with $q=0.7$, what are player 1's expected payoffs from H and T?",
        "steps": [
          {
            "do": "Use payoff from H",
            "result": "$2q-1$",
            "why": "derived from match payoff"
          },
          {
            "do": "Substitute $q=0.7$",
            "result": "$2(0.7)-1=0.4$",
            "why": "compute H payoff"
          },
          {
            "do": "Use payoff from T",
            "result": "$1-2q$",
            "why": "derived from mismatch payoff"
          },
          {
            "do": "Substitute $q=0.7$",
            "result": "$1-2(0.7)=-0.4$",
            "why": "compute T payoff"
          },
          {
            "do": "Choose best response",
            "result": "H",
            "why": "$0.4>-0.4$"
          }
        ],
        "answer": "Expected payoffs are $0.4$ from H and $-0.4$ from T, so H is better."
      },
      {
        "problem": "A row player's payoffs are U: $4$ vs L and $0$ vs R; D: $1$ vs L and $3$ vs R. If column plays L with probability $q$, find $q$ making U and D equally good.",
        "steps": [
          {
            "do": "Write expected payoff of U",
            "result": "$4q+0(1-q)=4q$",
            "why": "weight U payoffs"
          },
          {
            "do": "Write expected payoff of D",
            "result": "$1q+3(1-q)$",
            "why": "weight D payoffs"
          },
          {
            "do": "Simplify D payoff",
            "result": "$3-2q$",
            "why": "$q+3-3q=3-2q$"
          },
          {
            "do": "Set equal",
            "result": "$4q=3-2q$",
            "why": "indifference condition"
          },
          {
            "do": "Solve",
            "result": "$q=\\tfrac12$",
            "why": "$6q=3$"
          }
        ],
        "answer": "$q=1/2$ makes U and D equally good."
      },
      {
        "problem": "For the same game, if the row player plays U with probability $p$, and the column player's payoffs are L: $2$ vs U, $0$ vs D; R: $0$ vs U, $3$ vs D, find $p$ making L and R equally good.",
        "steps": [
          {
            "do": "Write payoff of L",
            "result": "$2p+0(1-p)=2p$",
            "why": "L payoff depends on row mix"
          },
          {
            "do": "Write payoff of R",
            "result": "$0p+3(1-p)$",
            "why": "R pays 3 when row plays D"
          },
          {
            "do": "Simplify R payoff",
            "result": "$3-3p$",
            "why": "distribute 3"
          },
          {
            "do": "Set equal",
            "result": "$2p=3-3p$",
            "why": "make column indifferent"
          },
          {
            "do": "Solve",
            "result": "$p=\\tfrac35$",
            "why": "$5p=3$"
          }
        ],
        "answer": "$p=3/5$ makes L and R equally good."
      },
      {
        "problem": "At a proposed mix, a player uses A and B with positive probabilities. Expected payoffs are $5$ for A, $5$ for B, and $4$ for unused C. Does the support pass the equilibrium payoff check for that player?",
        "steps": [
          {
            "do": "Compare used actions",
            "result": "$5=5$",
            "why": "actions in support must tie"
          },
          {
            "do": "Check unused C",
            "result": "$4\\le5$",
            "why": "unused actions must not be better"
          },
          {
            "do": "Assess profitable deviations",
            "result": "none among A,B,C",
            "why": "no pure action gives more than 5"
          },
          {
            "do": "Use linearity",
            "result": "no mixed deviation improves",
            "why": "a mixture of actions worth at most 5 is worth at most 5"
          },
          {
            "do": "State result",
            "result": "passes for this player",
            "why": "the player's payoff check holds"
          }
        ],
        "answer": "Yes, for this player the support passes the mixed-equilibrium payoff check."
      },
      {
        "problem": "In a penalty-kick game, kicker shoots Left with probability $p$ and goalie dives Left with probability $q$. Kicker scoring probabilities are $0.6$ if same side and $0.9$ if opposite. Find $q$ that makes the kicker indifferent between shooting Left and Right.",
        "steps": [
          {
            "do": "Expected score from Left",
            "result": "$0.6q+0.9(1-q)$",
            "why": "same side with probability q"
          },
          {
            "do": "Simplify Left",
            "result": "$0.9-0.3q$",
            "why": "combine terms"
          },
          {
            "do": "Expected score from Right",
            "result": "$0.9q+0.6(1-q)$",
            "why": "opposite side if goalie dives Left"
          },
          {
            "do": "Simplify Right",
            "result": "$0.6+0.3q$",
            "why": "combine terms"
          },
          {
            "do": "Set equal and solve",
            "result": "$0.9-0.3q=0.6+0.3q$, so $q=0.5$",
            "why": "the goalie must randomize evenly to equalize shots"
          }
        ],
        "answer": "$q=0.5$ makes the kicker indifferent."
      }
    ],
    "applications": [
      {
        "title": "Penalty kicks",
        "background": "Sports strategy often uses mixed equilibrium because predictable choices are exploitable.",
        "numbers": "If a goalie dives left $80%$ of the time, a kicker with opposite-side success $0.9$ and same-side success $0.6$ scores $0.9(0.8)+0.6(0.2)=0.84$ by shooting right."
      },
      {
        "title": "Security inspection",
        "background": "Randomized inspection schedules can make attackers indifferent across targets, reducing exploitability.",
        "numbers": "If target A is inspected with probability $0.7$, an attack value $10$ with catch loss $10$ has expected payoff $0.3\\cdot10+0.7\\cdot0=3$."
      },
      {
        "title": "Rock-paper-scissors agents",
        "background": "A uniform mixed equilibrium prevents any pure action from being exploited in the standard zero-sum game.",
        "numbers": "Against $(1/3,1/3,1/3)$, Rock has expected payoff $(1/3)0+(1/3)(-1)+(1/3)(1)=0$."
      },
      {
        "title": "GAN equilibrium ideal",
        "background": "The ideal GAN point has neither generator nor discriminator able to improve under the theoretical objective. Mixed distributions replace single actions.",
        "numbers": "If real and generated distributions match, a discriminator guessing real with probability $0.5$ has accuracy $0.5$ and no better threshold from data alone."
      },
      {
        "title": "Adversarial training",
        "background": "Robust ML often mixes attacks during training so the model cannot overfit one attack type.",
        "numbers": "If attacks A and B have losses $0.4$ and $0.8$, a $50/50$ mix has expected loss $0.6$."
      },
      {
        "title": "Online experimentation",
        "background": "Traffic allocation can be viewed as a mixed strategy when variants strategically adapt to metrics or budgets.",
        "numbers": "A split $(0.5,0.5)$ with conversion rates $0.04$ and $0.06$ gives expected conversion $0.05$ before learning updates."
      }
    ],
    "applicationsClose": "Mixed equilibrium is stable uncertainty: randomization chosen so no player has a better unilateral way to use the probabilities.",
    "takeaways": [
      "A mixed Nash equilibrium has no profitable pure or mixed unilateral deviation.",
      "Actions used with positive probability must tie in expected payoff.",
      "Unused actions must not give higher expected payoff.",
      "Indifference equations often solve two-action mixed equilibria."
    ]
  },
  "math-24-09": {
    "id": "math-24-09",
    "title": "Existence of equilibria",
    "tagline": "Finite games may lack pure equilibria, but mixed strategies guarantee at least one Nash equilibrium.",
    "connections": {
      "buildsOn": [
        "Mixed-strategy Nash equilibrium",
        "fixed points",
        "compact sets"
      ],
      "leadsTo": [
        "Zero-sum games",
        "minimax theorem",
        "multi-agent RL"
      ],
      "usedWith": [
        "continuity",
        "convex sets",
        "optimization"
      ]
    },
    "motivation": "<p>Matching pennies has no pure equilibrium, which could feel discouraging. But once mixed strategies are allowed, equilibrium comes back.</p><p>The deep theorem is hopeful: every finite game has at least one mixed-strategy Nash equilibrium. The proof lives in fixed-point ideas, but the lesson for ML is practical too. When agents have finite actions and expected payoffs, a stable mixed profile exists even if pure stability fails.</p>",
    "definition": "<p><b>Nash's existence theorem</b> says every finite game has at least one mixed-strategy Nash equilibrium. Each player's mixed-strategy set is a simplex: probabilities are nonnegative and sum to $1$. This set is closed, bounded, and convex.</p><p>Expected payoff is continuous and linear in each player's own mixed strategy when the others are fixed. A best-response correspondence maps each mixed profile to the set of payoff-maximizing mixed strategies. Under the finite-game assumptions, a fixed-point theorem guarantees a profile where each player's chosen mix is a best response to the others.</p><p><b>Assumptions that matter:</b> action sets are finite; mixed strategies allow all probability distributions over those actions; players maximize expected payoff; and the theorem guarantees existence, not uniqueness, easy computation, or good social welfare.</p>",
    "worked": {
      "problem": "Explain why matching pennies has a mixed equilibrium even though it has no pure equilibrium, and identify it.",
      "skills": [
        "existence",
        "mixed equilibrium",
        "matching pennies"
      ],
      "strategy": "First verify pure instability, then use the indifference solution as the guaranteed mixed equilibrium.",
      "steps": [
        {
          "do": "Check a matching cell",
          "result": "player 2 wants to switch",
          "why": "when actions match, player 2 loses and can improve"
        },
        {
          "do": "Check a mismatching cell",
          "result": "player 1 wants to switch",
          "why": "when actions differ, player 1 loses and can improve"
        },
        {
          "do": "Conclude about pure profiles",
          "result": "no pure Nash equilibrium",
          "why": "every cell has a profitable unilateral deviation"
        },
        {
          "do": "Let player 2 play H with probability $q$",
          "result": "player 1 payoffs are $2q-1$ from H and $1-2q$ from T",
          "why": "expected payoffs come from the two outcomes"
        },
        {
          "do": "Set player 1 indifferent",
          "result": "$2q-1=1-2q$",
          "why": "both pure actions must be usable in equilibrium"
        },
        {
          "do": "Solve for $q$",
          "result": "$q=1/2$",
          "why": "the opponent must mix evenly"
        },
        {
          "do": "Use symmetry",
          "result": "$p=1/2$ for player 1",
          "why": "player 2 is made indifferent the same way"
        }
      ],
      "verify": "At the half-half mix, each pure action gives expected payoff $0$, so neither player can improve by changing strategy.",
      "answer": "Matching pennies has no pure equilibrium, but it has the mixed equilibrium where both players choose H with probability $1/2$ and T with probability $1/2$.",
      "connects": "Existence says finite games regain equilibrium once probability mixtures are part of the strategy space."
    },
    "practice": [
      {
        "problem": "A player has two actions. Describe the mixed-strategy set and show it is a line segment.",
        "steps": [
          {
            "do": "Name the probabilities",
            "result": "$(p,1-p)$",
            "why": "two probabilities must sum to 1"
          },
          {
            "do": "Apply nonnegativity",
            "result": "$0\\le p\\le1$",
            "why": "both probabilities must be nonnegative"
          },
          {
            "do": "Identify the endpoints",
            "result": "$(1,0)$ and $(0,1)$",
            "why": "pure strategies are the endpoints"
          },
          {
            "do": "Describe the set",
            "result": "all points between endpoints",
            "why": "p moves continuously from 0 to 1"
          },
          {
            "do": "Name the shape",
            "result": "line segment",
            "why": "a one-dimensional simplex"
          }
        ],
        "answer": "The mixed-strategy set is $\\{(p,1-p):0\\le p\\le1\\}$, a line segment."
      },
      {
        "problem": "A player has three actions. Is $(0.2,0.3,0.5)$ in the simplex?",
        "steps": [
          {
            "do": "Check nonnegativity",
            "result": "$0.2,0.3,0.5\\ge0$",
            "why": "all entries are valid probabilities"
          },
          {
            "do": "Sum entries",
            "result": "$0.2+0.3+0.5=1$",
            "why": "probabilities add to 1"
          },
          {
            "do": "Apply simplex definition",
            "result": "inside the simplex",
            "why": "both conditions hold"
          },
          {
            "do": "Identify support",
            "result": "three actions",
            "why": "all probabilities are positive"
          },
          {
            "do": "State conclusion",
            "result": "valid mixed strategy",
            "why": "the point belongs to the strategy space"
          }
        ],
        "answer": "Yes. It is in the three-action simplex."
      },
      {
        "problem": "Why does finite-game expected payoff vary continuously with a mixing probability $p$? Use payoff $U(p)=4p+1(1-p)$.",
        "steps": [
          {
            "do": "Write the payoff",
            "result": "$U(p)=4p+1(1-p)$",
            "why": "expected payoff is a weighted average"
          },
          {
            "do": "Simplify",
            "result": "$U(p)=1+3p$",
            "why": "combine like terms"
          },
          {
            "do": "Identify function type",
            "result": "linear",
            "why": "the expression has form $a+bp$"
          },
          {
            "do": "Recall continuity",
            "result": "linear functions are continuous",
            "why": "small changes in p make small payoff changes"
          },
          {
            "do": "Quantify a change",
            "result": "$U(0.6)-U(0.5)=3(0.1)=0.3$",
            "why": "the payoff change is proportional"
          }
        ],
        "answer": "$U(p)=1+3p$ is continuous in $p$."
      },
      {
        "problem": "A game has a pure Nash equilibrium. Does Nash's theorem still say a mixed equilibrium exists?",
        "steps": [
          {
            "do": "Recall pure as mixed",
            "result": "pure action equals probability $1$ on one action",
            "why": "pure strategies are included in mixed strategies"
          },
          {
            "do": "Use the pure equilibrium",
            "result": "it is also a mixed profile",
            "why": "degenerate mixtures are allowed"
          },
          {
            "do": "Check no deviation",
            "result": "same Nash inequalities hold",
            "why": "mixed deviations cannot beat the best pure response if none improve"
          },
          {
            "do": "Apply theorem",
            "result": "at least one mixed equilibrium exists",
            "why": "the pure equilibrium counts"
          },
          {
            "do": "State conclusion",
            "result": "yes",
            "why": "existence includes pure equilibria as special cases"
          }
        ],
        "answer": "Yes. A pure Nash equilibrium is also a mixed-strategy equilibrium with degenerate probabilities."
      },
      {
        "problem": "A finite two-player game has 2 actions for player 1 and 3 actions for player 2. What are the dimensions of their mixed-strategy simplexes and why does existence apply?",
        "steps": [
          {
            "do": "Compute player 1 dimension",
            "result": "$2-1=1$",
            "why": "two probabilities have one sum-to-one constraint"
          },
          {
            "do": "Compute player 2 dimension",
            "result": "$3-1=2$",
            "why": "three probabilities have one sum-to-one constraint"
          },
          {
            "do": "Check finiteness",
            "result": "both action sets are finite",
            "why": "there are 2 and 3 actions"
          },
          {
            "do": "Check mixed spaces",
            "result": "simplexes are compact and convex",
            "why": "finite probability simplexes have the needed shape"
          },
          {
            "do": "Apply Nash theorem",
            "result": "a mixed equilibrium exists",
            "why": "finite-game assumptions hold"
          }
        ],
        "answer": "Player 1's simplex is 1-dimensional, player 2's is 2-dimensional, and a mixed Nash equilibrium exists."
      }
    ],
    "applications": [
      {
        "title": "Why mixed equilibria matter",
        "background": "Some strategic systems have no stable deterministic profile. Existence tells us probability can restore a solution concept.",
        "numbers": "Matching pennies has $4$ pure cells and all $4$ have a profitable deviation, yet the $1/2,1/2$ mix is stable."
      },
      {
        "title": "Algorithm design",
        "background": "Equilibrium-computation algorithms rely on the fact that a target solution exists before searching for it.",
        "numbers": "A $2\\times2$ game has two one-dimensional mixed spaces; solving two indifference equations can find a candidate."
      },
      {
        "title": "Multi-agent RL benchmarks",
        "background": "Finite Markov games often analyze equilibria at each state or in policies over finite actions.",
        "numbers": "With 5 actions per agent and 2 agents, a state has $25$ joint pure actions, but each agent's mixed strategy is a 4-dimensional simplex."
      },
      {
        "title": "GAN theory",
        "background": "Idealized GANs use distributional strategies. Existence intuition supports looking for saddle or equilibrium-like points even when pure generators are insufficient.",
        "numbers": "A generator mixing two modes with probabilities $(0.5,0.5)$ can match a data distribution with two equally likely modes, while either pure mode alone misses half the data."
      },
      {
        "title": "Market design",
        "background": "Mechanism designers need equilibrium existence to predict participation and bidding behavior in finite simplified models.",
        "numbers": "If each of 3 bidders has 4 bid levels, there are $4^3=64$ pure profiles, and Nash's theorem guarantees at least one mixed equilibrium."
      },
      {
        "title": "Robust evaluation",
        "background": "When systems compete, existence does not mean the equilibrium is easy to find or desirable. It means the model has a stable reference point.",
        "numbers": "A game may have equilibrium welfare $2+2=4$ while another non-equilibrium cell has welfare $5+5=10$."
      }
    ],
    "applicationsClose": "Existence is a promise of mathematical footing: finite strategic models always have at least one mixed equilibrium to analyze.",
    "takeaways": [
      "Every finite game has at least one mixed-strategy Nash equilibrium.",
      "Mixed-strategy spaces are probability simplexes: closed, bounded, and convex.",
      "Expected payoffs are continuous and linear in a player's own mix.",
      "Existence does not imply uniqueness, efficiency, or easy computation."
    ]
  },
  "math-24-10": {
    "id": "math-24-10",
    "title": "Zero-sum games",
    "tagline": "In a zero-sum game, one player's gain is exactly the other's loss, so strategy becomes minimax thinking.",
    "connections": {
      "buildsOn": [
        "Mixed-strategy Nash equilibrium",
        "expected value",
        "matrices"
      ],
      "leadsTo": [
        "GANs and adversarial training",
        "minimax optimization",
        "multi-agent reinforcement learning"
      ],
      "usedWith": [
        "linear programming",
        "duality",
        "saddle points",
        "convexity"
      ]
    },
    "motivation": "<p>Some games are partly cooperative or mutually beneficial. Zero-sum games are sharper: every point one player gains is a point the other player loses.</p><p>This makes the central question beautifully clear. The row player tries to maximize payoff; the column player tries to minimize that same payoff. The resulting <b>minimax</b> view is one of the main mathematical bridges from game theory to GANs and adversarial ML.</p>",
    "definition": "<p>A two-player game is <b>zero-sum</b> if $u_1(a)+u_2(a)=0$ for every action profile $a$. We can store only player 1's payoff matrix $A$, because player 2's payoff is $-A$.</p><p>For mixed strategies $p$ for the row player and $q$ for the column player, the row player's expected payoff is $p^T A q$. The row player wants $\\max_p \\min_q p^T A q$, while the column player wants $\\min_q \\max_p p^T A q$. The minimax theorem says these values are equal in finite zero-sum games.</p><p><b>Assumptions that matter:</b> payoffs sum to zero exactly; players optimize expected payoff; mixed strategies range over probability simplexes; and minimax equality is special to zero-sum structure, not arbitrary games.</p>",
    "worked": {
      "problem": "For the zero-sum payoff matrix $A=\\begin{pmatrix}2&-1\\0&1\\end{pmatrix}$ for the row player, find the row player's maximin pure strategy and the column player's minimax pure strategy.",
      "skills": [
        "zero-sum matrices",
        "maximin",
        "minimax"
      ],
      "strategy": "For pure security levels, take row minima for the maximizer and column maxima for the minimizer.",
      "steps": [
        {
          "do": "Compute row 1 minimum",
          "result": "$\\min(2,-1)=-1$",
          "why": "the column player would choose the worse entry in row 1"
        },
        {
          "do": "Compute row 2 minimum",
          "result": "$\\min(0,1)=0$",
          "why": "the worst case in row 2 is 0"
        },
        {
          "do": "Choose the larger row minimum",
          "result": "$\\max(-1,0)=0$",
          "why": "the row player maximizes guaranteed payoff"
        },
        {
          "do": "Compute column 1 maximum",
          "result": "$\\max(2,0)=2$",
          "why": "the row player would choose the larger entry in column 1"
        },
        {
          "do": "Compute column 2 maximum",
          "result": "$\\max(-1,1)=1$",
          "why": "the row player's best response to column 2 gives 1"
        },
        {
          "do": "Choose the smaller column maximum",
          "result": "$\\min(2,1)=1$",
          "why": "the column player minimizes the row player's possible payoff"
        }
      ],
      "verify": "The pure maximin value $0$ and pure minimax value $1$ do not match, so a pure saddle point is not identified here.",
      "answer": "Row's pure maximin strategy is row 2 with guarantee $0$; column's pure minimax strategy is column 2 with upper bound $1$.",
      "connects": "Zero-sum analysis asks what each side can guarantee against an adversary."
    },
    "practice": [
      {
        "problem": "Check whether payoff pair $(4,-4)$ is consistent with zero-sum play.",
        "steps": [
          {
            "do": "Add the payoffs",
            "result": "$4+(-4)=0$",
            "why": "zero-sum requires total payoff zero"
          },
          {
            "do": "Apply the definition",
            "result": "consistent",
            "why": "the sum is exactly zero"
          },
          {
            "do": "Identify player 2 payoff",
            "result": "$-4$",
            "why": "it is the negative of player 1's payoff"
          },
          {
            "do": "Interpret",
            "result": "player 1's gain equals player 2's loss",
            "why": "interests are exactly opposed"
          },
          {
            "do": "State result",
            "result": "zero-sum cell",
            "why": "this cell satisfies the condition"
          }
        ],
        "answer": "Yes. The pair $(4,-4)$ is zero-sum."
      },
      {
        "problem": "For $A=\\begin{pmatrix}1&3\\2&0\\end{pmatrix}$, compute row minima and the pure maximin value.",
        "steps": [
          {
            "do": "Row 1 minimum",
            "result": "$\\min(1,3)=1$",
            "why": "worst case for row 1"
          },
          {
            "do": "Row 2 minimum",
            "result": "$\\min(2,0)=0$",
            "why": "worst case for row 2"
          },
          {
            "do": "Compare row guarantees",
            "result": "$1>0$",
            "why": "row player wants the larger guarantee"
          },
          {
            "do": "Choose maximin value",
            "result": "$1$",
            "why": "maximum of row minima"
          },
          {
            "do": "Choose maximin row",
            "result": "row 1",
            "why": "row 1 guarantees at least 1"
          }
        ],
        "answer": "Row minima are $1$ and $0$; pure maximin value is $1$ from row 1."
      },
      {
        "problem": "For the same matrix, compute column maxima and the pure minimax value.",
        "steps": [
          {
            "do": "Column 1 maximum",
            "result": "$\\max(1,2)=2$",
            "why": "row player can get 2 if column 1 is chosen"
          },
          {
            "do": "Column 2 maximum",
            "result": "$\\max(3,0)=3$",
            "why": "row player can get 3 if column 2 is chosen"
          },
          {
            "do": "Compare column risks",
            "result": "$2<3$",
            "why": "column player wants the smaller maximum"
          },
          {
            "do": "Choose minimax value",
            "result": "$2$",
            "why": "minimum of column maxima"
          },
          {
            "do": "Choose minimax column",
            "result": "column 1",
            "why": "column 1 limits row payoff to at most 2"
          }
        ],
        "answer": "Column maxima are $2$ and $3$; pure minimax value is $2$ from column 1."
      },
      {
        "problem": "Rock-paper-scissors has payoff $1$ for win, $0$ for tie, $-1$ for loss. Against a uniform opponent, compute expected payoff of Rock.",
        "steps": [
          {
            "do": "List Rock outcomes",
            "result": "tie versus Rock, lose versus Paper, win versus Scissors",
            "why": "compare Rock to each opponent action"
          },
          {
            "do": "List payoffs",
            "result": "$0,-1,1$",
            "why": "tie, loss, win"
          },
          {
            "do": "Attach probabilities",
            "result": "$1/3,1/3,1/3$",
            "why": "uniform opponent"
          },
          {
            "do": "Write expectation",
            "result": "$(1/3)0+(1/3)(-1)+(1/3)(1)$",
            "why": "weight each outcome"
          },
          {
            "do": "Add",
            "result": "$0$",
            "why": "negative and positive terms cancel"
          }
        ],
        "answer": "The expected payoff of Rock is $0$."
      },
      {
        "problem": "A GAN-style minimax objective has discriminator loss values for generator choices G1,G2 and discriminator choices D1,D2: $A=\\begin{pmatrix}0.8&0.2\\0.5&0.4\\end{pmatrix}$ where the discriminator maximizes and generator minimizes. If generator chooses G1 with probability $p=0.25$ and discriminator chooses D1 with probability $q=0.6$, compute expected discriminator payoff.",
        "steps": [
          {
            "do": "Compute G1/D1 probability",
            "result": "$0.25\\cdot0.6=0.15$",
            "why": "multiply mixed probabilities"
          },
          {
            "do": "Compute G1/D2 probability",
            "result": "$0.25\\cdot0.4=0.10$",
            "why": "D2 probability is $1-q$"
          },
          {
            "do": "Compute G2/D1 probability",
            "result": "$0.75\\cdot0.6=0.45$",
            "why": "G2 probability is $1-p$"
          },
          {
            "do": "Compute G2/D2 probability",
            "result": "$0.75\\cdot0.4=0.30$",
            "why": "multiply remaining probabilities"
          },
          {
            "do": "Weight and add payoffs",
            "result": "$0.15(0.8)+0.10(0.2)+0.45(0.5)+0.30(0.4)=0.485$",
            "why": "expected payoff is the sum over all cells"
          }
        ],
        "answer": "The expected discriminator payoff is $0.485$."
      }
    ],
    "applications": [
      {
        "title": "Minimax decision making",
        "background": "Zero-sum games formalize conservative planning against an adversary. The maximin choice protects the worst case.",
        "numbers": "If row guarantees are $-2$, $1$, and $0$, the maximin guarantee is $1$ from the second row."
      },
      {
        "title": "GAN objectives",
        "background": "Original GAN training is often introduced as a minimax game between generator and discriminator. One network's improvement can hurt the other's objective.",
        "numbers": "If discriminator payoff is accuracy minus $0.5$, accuracy $0.90$ gives payoff $0.40$, while accuracy $0.50$ gives payoff $0$."
      },
      {
        "title": "Adversarial examples",
        "background": "Robust training can be written as minimizing loss under a worst-case perturbation, a zero-sum flavor between model and attacker.",
        "numbers": "If perturbations produce losses $0.2,0.7,0.4$, the attacker chooses $0.7$ and the model trains against that maximum."
      },
      {
        "title": "Poker and hidden information",
        "background": "Simplified poker models are classic zero-sum games because chips won by one player are lost by another.",
        "numbers": "Winning $15$ chips gives payoff $+15$ to one player and $-15$ to the other, summing to $0$."
      },
      {
        "title": "Network defense",
        "background": "Attack-defense resource allocation is often approximated as zero-sum when defender utility is negative attacker utility.",
        "numbers": "If a breach gives attacker $100$ and defender $-100$, blocking with probability $0.8$ reduces attacker expected payoff to $0.2\\cdot100=20$."
      },
      {
        "title": "Evaluation by worst case",
        "background": "Benchmarks sometimes report worst-group performance, echoing minimax thinking: improve the weakest case rather than the average only.",
        "numbers": "If group accuracies are $0.91,0.84,0.78$, the worst-group score is $0.78$; raising it to $0.82$ improves the minimax metric by $0.04$."
      }
    ],
    "applicationsClose": "Zero-sum games distill strategic conflict into one number both sides care about in opposite directions, which is why minimax keeps reappearing in adversarial ML.",
    "takeaways": [
      "Zero-sum means $u_1+u_2=0$ at every action profile.",
      "The row player maximizes $p^T A q$ while the column player minimizes it.",
      "Pure maximin uses row minima; pure minimax uses column maxima.",
      "Finite zero-sum mixed games satisfy minimax equality."
    ]
  }
};
