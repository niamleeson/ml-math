/* =====================================================================
   REAL-WORLD WALKTHROUGHS — MODULE 4: ARTIFICIAL INTELLIGENCE.
   For each lesson: 3 worked walkthroughs in distinct real-world domains.
   Each: data -> math -> runnable Python (numpy/stdlib) -> exact output.
   All code below was run with python3 and the stdout pasted verbatim.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ============================================================= */
  "ai-linear-predictors": [
    {
      title: `Flagging spam email`,
      domain: `NLP / email security`,
      question: `An email mentions "free" twice and has 3 links. Is it spam?`,
      steps: [
        { title: `The data`, body: `<p>We describe the email with two numbers: how often the word "free" appears, and how many links it has. That is the feature vector $\\phi(x) = [2, 3]$. The trained weights are $w = [1.5, 0.5]$.</p>` },
        { title: `The math`, body: `<p>Score is the dot product $s = w\\cdot\\phi(x) = 1.5\\times2 + 0.5\\times3$. The prediction is $\\text{sign}(s)$: positive means spam, negative means ham.</p>` },
        { title: `Run it`, body: `<p>Compute the dot product with numpy and read off the sign.</p>`,
          code: `import numpy as np\nphi = np.array([2, 3])      # "free" count, link count\nw   = np.array([1.5, 0.5])  # learned weights\nb   = 0.0\ns = w @ phi + b\nprint("score=%.1f pred=%s" % (s, "spam" if s > 0 else "ham"))`,
          output: `score=4.5 pred=spam` }
      ],
      conclusion: `The score $s = 4.5 &gt; 0$, so $f_w(x) = +1$: the email is flagged as <b>spam</b>.`
    },
    {
      title: `Approving a loan`,
      domain: `Finance / credit scoring`,
      question: `Three applicants apply for credit. Who gets approved?`,
      steps: [
        { title: `The data`, body: `<p>Each applicant is three numbers: income (in units of 100k), years employed, and owns-home (1/0). The trained weights are $w = [2.0, 0.5, 1.0]$ with bias $b = -3$.</p>` },
        { title: `The math`, body: `<p>For each applicant compute $s = w\\cdot\\phi(x) + b$. Approve if $s &gt; 0$, deny otherwise. The bias $-3$ is the bar each applicant must clear.</p>` },
        { title: `Run it`, body: `<p>Multiply each feature row by the weights and add the bias.</p>`,
          code: `import numpy as np\nX = np.array([[0.7, 3, 1],   # income, years, owns_home\n              [0.2, 1, 0],\n              [0.9, 5, 1]])\nw = np.array([2.0, 0.5, 1.0]); b = -3.0\nfor i, x in enumerate(X):\n    sc = w @ x + b\n    print("applicant %d score=%.2f -> %s" % (i, sc, "approve" if sc > 0 else "deny"))`,
          output: `applicant 0 score=0.90 -> approve\napplicant 1 score=-2.10 -> deny\napplicant 2 score=2.30 -> approve` }
      ],
      conclusion: `Applicants 0 and 2 clear the bar ($s &gt; 0$) and are <b>approved</b>; applicant 1 scores $-2.10$ and is <b>denied</b>.`
    },
    {
      title: `Sentiment of a review`,
      domain: `NLP / product reviews`,
      question: `A review says "great" and "love". Is it positive?`,
      steps: [
        { title: `The data`, body: `<p>We track four words: $[\\text{great}, \\text{love}, \\text{terrible}, \\text{boring}]$. The review's word counts are $\\phi(x) = [1, 1, 0, 0]$. Positive words have positive weights; negative words have negative weights.</p>` },
        { title: `The math`, body: `<p>Score $s = w\\cdot\\phi(x)$ with $w = [1.2, 1.0, -1.5, -0.8]$. The sign of $s$ gives the sentiment.</p>` },
        { title: `Run it`, body: `<p>Dot the weight vector with the word counts.</p>`,
          code: `import numpy as np\nvocab = ["great", "love", "terrible", "boring"]\nw = np.array([1.2, 1.0, -1.5, -0.8])\nreview = np.array([1, 1, 0, 0])   # counts of each word\nsc = w @ review\nprint("sentiment score=%.1f -> %s" % (sc, "positive" if sc > 0 else "negative"))`,
          output: `sentiment score=2.2 -> positive` }
      ],
      conclusion: `The two positive words sum to $s = 2.2 &gt; 0$, so the review is classified <b>positive</b>.`
    }
  ],

  /* ============================================================= */
  "ai-loss-minimization": [
    {
      title: `Grading a fraud detector`,
      domain: `Finance / fraud`,
      question: `How wrong is our fraud model on four transactions?`,
      steps: [
        { title: `The data`, body: `<p>Four transactions, each with a model score and a true label $y$ ($+1$ fraud, $-1$ legit): scores $[2.0, 0.3, -1.0, 1.5]$, labels $[+1, +1, -1, -1]$.</p>` },
        { title: `The math`, body: `<p>The margin is $m = s\\cdot y$. Hinge loss is $\\max(0, 1-m)$: zero once the margin passes $1$, growing otherwise. Train loss is the average.</p>` },
        { title: `Run it`, body: `<p>Compute margins, then hinge losses, then average.</p>`,
          code: `import numpy as np\nscores = np.array([2.0, 0.3, -1.0, 1.5])\ny      = np.array([1, 1, -1, -1])\nmargins = scores * y\nhinge = np.maximum(0, 1 - margins)\nprint("margins", margins.tolist())\nprint("hinge  ", [round(h, 2) for h in hinge])\nprint("train hinge loss=%.3f" % hinge.mean())`,
          output: `margins [2.0, 0.3, 1.0, -1.5]\nhinge   [0.0, 0.7, 0.0, 2.5]\ntrain hinge loss=0.800` }
      ],
      conclusion: `Average hinge loss is $0.800$. The misclassified transaction (margin $-1.5$) dominates, contributing $2.5$; the under-confident one (margin $0.3$) adds $0.7$.`
    },
    {
      title: `Scoring house-price predictions`,
      domain: `Real estate`,
      question: `How far off are our three price predictions?`,
      steps: [
        { title: `The data`, body: `<p>Predicted prices (in thousands): $[310, 250, 180]$. True prices: $[300, 270, 200]$. Here we predict numbers, not yes/no.</p>` },
        { title: `The math`, body: `<p>Squared loss is $(\\text{pred}-y)^2$. It punishes big errors hard. Mean squared error (MSE) is the average.</p>` },
        { title: `Run it`, body: `<p>Square the residuals and average them.</p>`,
          code: `import numpy as np\npred = np.array([310, 250, 180])\ntrue = np.array([300, 270, 200])\nsq = (pred - true) ** 2\nprint("sq errors", sq.tolist())\nprint("MSE=%.1f" % sq.mean())`,
          output: `sq errors [100, 400, 400]\nMSE=300.0` }
      ],
      conclusion: `MSE is $300.0$ (in thousands-squared). The $10$k miss costs only $100$, but each $20$k miss costs $400$: squaring makes large errors hurt far more.`
    },
    {
      title: `Logistic loss on ad clicks`,
      domain: `Online advertising`,
      question: `How does logistic loss rate three predictions of differing margin?`,
      steps: [
        { title: `The data`, body: `<p>Three impressions with margins $m = [2.0, 0.0, -1.0]$. A large positive margin means correct and confident; negative means wrong.</p>` },
        { title: `The math`, body: `<p>Logistic loss is $\\log(1 + e^{-m})$. It is a smooth curve: it always rewards a bigger margin a little more, even when already correct.</p>` },
        { title: `Run it`, body: `<p>Apply the logistic loss formula to each margin.</p>`,
          code: `import numpy as np\nm = np.array([2.0, 0.0, -1.0])\nlog = np.log(1 + np.exp(-m))\nprint("logistic losses", [round(x, 3) for x in log])\nprint("avg=%.3f" % log.mean())`,
          output: `logistic losses [0.127, 0.693, 1.313]\navg=0.711` }
      ],
      conclusion: `Average logistic loss is $0.711$. Even the confident-correct case (margin $2$) keeps a small loss of $0.127$ — the smooth curve never fully stops rewarding more confidence.`
    }
  ],

  /* ============================================================= */
  "ai-sgd": [
    {
      title: `Fitting a price line, one house at a time`,
      domain: `Real estate`,
      question: `Can SGD recover the rule price = 3·size + 2 from examples?`,
      steps: [
        { title: `The data`, body: `<p>Four houses with sizes $x = [1,2,3,4]$ and true prices generated by $y = 3x + 2$. We start with $w=0, b=0$ and learn from one house at a time.</p>` },
        { title: `The math`, body: `<p>For one example the squared-loss gradient is $\\nabla_w = (\\hat y - y)\\,x$ and $\\nabla_b = (\\hat y - y)$. SGD updates $w \\leftarrow w - \\eta\\nabla_w$ after each house.</p>` },
        { title: `Run it`, body: `<p>Loop over examples many times, nudging the weights each step.</p>`,
          code: `import numpy as np\nxs = np.array([1.0, 2.0, 3.0, 4.0]); ys = 3 * xs + 2\nw = 0.0; b = 0.0; eta = 0.02\nfor epoch in range(400):\n    for i in range(len(xs)):\n        x = xs[i]; yt = ys[i]\n        pred = w * x + b; err = pred - yt\n        w -= eta * err * x\n        b -= eta * err\nprint("learned w=%.2f b=%.2f" % (w, b))`,
          output: `learned w=3.00 b=1.99` }
      ],
      conclusion: `Thousands of tiny per-house nudges drive the weights to $w = 3.00$, $b = 1.99$ — essentially the true rule $3x + 2$.`
    },
    {
      title: `One weight, one step`,
      domain: `Robotics / control tuning`,
      question: `A controller gain is $w=4$ with loss gradient $2$. Where does one step land it?`,
      steps: [
        { title: `The data`, body: `<p>The current gain is $w = 4$. For the latest sample the loss gradient is $\\nabla_w = 2$ (uphill is to the right). Learning rate $\\eta = 0.5$.</p>` },
        { title: `The math`, body: `<p>The update is $w \\leftarrow w - \\eta\\nabla_w$. The minus sign moves against the gradient — downhill.</p>` },
        { title: `Run it`, body: `<p>Apply a single update.</p>`,
          code: `w = 4.0; grad = 2.0; eta = 0.5\nw = w - eta * grad\nprint("after one SGD step w=%.1f" % w)`,
          output: `after one SGD step w=3.0` }
      ],
      conclusion: `The gain steps from $4$ to $3.0$, downhill by $\\eta\\nabla_w = 0.5\\times2 = 1$. Each new sample gives the next nudge.`
    },
    {
      title: `Learning demand from daily sales`,
      domain: `Retail / forecasting`,
      question: `Can SGD learn the slope of demand vs price?`,
      steps: [
        { title: `The data`, body: `<p>Demand follows $\\text{units} = 3\\cdot\\text{discount} + 2$. We feed discounts $[1,2,3,4]$ one day at a time and want to recover the slope and intercept. (Same generator as the housing case — it is the universal SGD loop.)</p>` },
        { title: `The math`, body: `<p>Per-example gradient $\\nabla_w = (\\hat y - y)x$, update $w \\leftarrow w - \\eta\\nabla_w$. After enough passes the average direction wins.</p>` },
        { title: `Run it`, body: `<p>Stream the days and watch the parameters converge.</p>`,
          code: `import numpy as np\ndisc = np.array([1.0, 2.0, 3.0, 4.0])\nunits = 3 * disc + 2\nw = 0.0; b = 0.0; eta = 0.02\nfor epoch in range(400):\n    for i in range(len(disc)):\n        err = (w * disc[i] + b) - units[i]\n        w -= eta * err * disc[i]\n        b -= eta * err\nprint("slope=%.2f intercept=%.2f" % (w, b))`,
          output: `slope=3.00 intercept=1.99` }
      ],
      conclusion: `SGD recovers slope $3.00$ and intercept $1.99$: each extra point of discount adds about $3$ units of demand.`
    }
  ],

  /* ============================================================= */
  "ai-search-problem": [
    {
      title: `Robot crossing a warehouse`,
      domain: `Robotics / path planning`,
      question: `What is the cheapest path for a robot from S to G through a grid with shelves?`,
      steps: [
        { title: `The data`, body: `<p>A 4×4 grid. <code>S</code> is the start, <code>G</code> the goal, <code>#</code> are shelves (blocked). Each step costs $1$. The five pieces: start $S$, actions = up/down/left/right, cost $1$, successor = the adjacent open cell, IsEnd = reaching $G$.</p>` },
        { title: `The math`, body: `<p>A <b>path</b> is a chain of moves; its cost is the sum of step costs. We want the path with the smallest total ending where IsEnd is true. With unit costs, breadth-first search finds it.</p>` },
        { title: `Run it`, body: `<p>BFS explores cells in order of distance and reconstructs the path.</p>`,
          code: `from collections import deque\ngrid = ["S..#",\n        ".#..",\n        ".#.G",\n        "...."]\nR, Cc = len(grid), len(grid[0])\ndef find(ch):\n    return next((r, c) for r in range(R) for c in range(Cc) if grid[r][c] == ch)\nstart, goal = find('S'), find('G')\ndef succ(s):\n    r, c = s\n    return [(r+dr, c+dc) for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]\n            if 0 <= r+dr < R and 0 <= c+dc < Cc and grid[r+dr][c+dc] != '#']\nq = deque([start]); prev = {start: None}\nwhile q:\n    u = q.popleft()\n    if u == goal: break\n    for v in succ(u):\n        if v not in prev: prev[v] = u; q.append(v)\npath = []; cur = goal\nwhile cur: path.append(cur); cur = prev[cur]\npath.reverse()\nprint("path", path)\nprint("cost (steps)=", len(path) - 1)`,
          output: `path [(0, 0), (0, 1), (0, 2), (1, 2), (2, 2), (2, 3)]\ncost (steps)= 5` }
      ],
      conclusion: `The cheapest plan threads around the shelves in $5$ steps: $(0,0)\\to(0,1)\\to(0,2)\\to(1,2)\\to(2,2)\\to(2,3)$.`
    },
    {
      title: `Turning CAT into DOG`,
      domain: `NLP / word games`,
      question: `What is the shortest chain of real words from "cat" to "dog", changing one letter at a time?`,
      steps: [
        { title: `The data`, body: `<p>A dictionary of valid words. A state is a word; an action changes one letter to make another dictionary word, costing $1$. Start = "cat", IsEnd = "dog".</p>` },
        { title: `The math`, body: `<p>Each one-letter change is a unit-cost edge between words. The shortest word ladder is the cheapest path, found by BFS.</p>` },
        { title: `Run it`, body: `<p>Generate neighbors by swapping each letter, then BFS.</p>`,
          code: `from collections import deque\nimport string\nwords = {"cat", "cot", "cog", "dog", "dot", "cab"}\nstart, goal = "cat", "dog"\ndef neighbors(w):\n    return [w[:i]+ch+w[i+1:] for i in range(len(w))\n            for ch in string.ascii_lowercase\n            if w[:i]+ch+w[i+1:] != w and w[:i]+ch+w[i+1:] in words]\nq = deque([start]); prev = {start: None}\nwhile q:\n    u = q.popleft()\n    if u == goal: break\n    for v in neighbors(u):\n        if v not in prev: prev[v] = u; q.append(v)\npath = []; cur = goal\nwhile cur: path.append(cur); cur = prev[cur]\npath.reverse()\nprint("ladder:", path)\nprint("steps =", len(path) - 1)`,
          output: `ladder: ['cat', 'cot', 'dot', 'dog']\nsteps = 3` }
      ],
      conclusion: `The cheapest ladder is cat → cot → dot → dog, a path of $3$ one-letter steps.`
    },
    {
      title: `Cheapest delivery route`,
      domain: `Logistics / routing`,
      question: `With weighted roads between stops, what is the cheapest route A → D?`,
      steps: [
        { title: `The data`, body: `<p>Stops A, B, C, D with road costs: A→B = 4, A→C = 1, C→B = 2, B→D = 1, C→D = 5. Costs differ, so we cannot just count steps.</p>` },
        { title: `The math`, body: `<p>Path cost is the sum of road costs. With varying costs we expand the cheapest-so-far partial route first (a priority queue) until we pop the goal.</p>` },
        { title: `Run it`, body: `<p>A min-heap pops the lowest-cost route and extends it.</p>`,
          code: `import heapq\nedges = {"A": [("B", 4), ("C", 1)], "B": [("D", 1)],\n         "C": [("B", 2), ("D", 5)], "D": []}\npq = [(0, "A", ["A"])]; seen = {}\nbest = None\nwhile pq:\n    cost, u, p = heapq.heappop(pq)\n    if u in seen and seen[u] <= cost: continue\n    seen[u] = cost\n    if u == "D": best = (cost, p); break\n    for v, w in edges[u]:\n        heapq.heappush(pq, (cost + w, v, p + [v]))\nprint("cheapest route", best[1], "cost", best[0])`,
          output: `cheapest route ['A', 'C', 'B', 'D'] cost 4` }
      ],
      conclusion: `The cheapest route is A → C → B → D at cost $4$, beating the direct-looking A → B → D (cost $5$). Cheapest is not always fewest stops.`
    }
  ],

  /* ============================================================= */
  "ai-tree-search": [
    {
      title: `Crawling a website breadth-first`,
      domain: `Web / search engines`,
      question: `In what order does a BFS crawler visit a small site?`,
      steps: [
        { title: `The data`, body: `<p>Pages link out: home → {about, blog}, about → {team}, blog → {post1, post2}. Branching factor $b\\approx2$. BFS uses a queue (take from the front).</p>` },
        { title: `The math`, body: `<p>BFS explores level by level: all depth-1 pages, then all depth-2 pages. It finds the shallowest page first, at the cost of holding a whole level in memory, $\\mathcal{O}(b^d)$.</p>` },
        { title: `Run it`, body: `<p>A queue (deque) drives the level-by-level order.</p>`,
          code: `from collections import deque\nlinks = {"home": ["about", "blog"], "about": ["team"],\n         "blog": ["post1", "post2"],\n         "team": [], "post1": [], "post2": []}\norder = []; q = deque(["home"]); seen = {"home"}\nwhile q:\n    u = q.popleft(); order.append(u)\n    for v in links[u]:\n        if v not in seen: seen.add(v); q.append(v)\nprint("BFS crawl order:", order)`,
          output: `BFS crawl order: ['home', 'about', 'blog', 'team', 'post1', 'post2']` }
      ],
      conclusion: `BFS visits home, then its children about and blog, then their children team, post1, post2 — strictly level by level.`
    },
    {
      title: `Walking a file system depth-first`,
      domain: `Operating systems`,
      question: `In what order does a DFS walk descend a directory tree?`,
      steps: [
        { title: `The data`, body: `<p>Directories: / → {bin, usr}, bin → {ls, cat}, usr → {lib}. DFS uses a stack (take from the top), diving deep before going wide.</p>` },
        { title: `The math`, body: `<p>DFS follows one branch to the bottom, then backtracks. Its memory is just the current path, $\\mathcal{O}(d)$ — tiny — but it can wander down the wrong branch first.</p>` },
        { title: `Run it`, body: `<p>A stack drives the deep-first order; children are pushed reversed so the first child pops first.</p>`,
          code: `tree = {"/": ["bin", "usr"], "bin": ["ls", "cat"],\n        "usr": ["lib"], "ls": [], "cat": [], "lib": []}\norder = []; st = ["/"]; seen = set()\nwhile st:\n    u = st.pop()\n    if u in seen: continue\n    seen.add(u); order.append(u)\n    for v in reversed(tree[u]): st.append(v)\nprint("DFS walk order:", order)`,
          output: `DFS walk order: ['/', 'bin', 'ls', 'cat', 'usr', 'lib']` }
      ],
      conclusion: `DFS fully explores bin (ls, cat) before touching usr — diving deep first, using only path-sized memory.`
    },
    {
      title: `Solving a puzzle with iterative deepening`,
      domain: `Puzzles / games`,
      question: `Where is the goal node, found by depth-limited search with a growing limit?`,
      steps: [
        { title: `The data`, body: `<p>A binary tree, root $1$, with the goal at node $6$ (depth $2$). Iterative deepening runs depth-limited DFS with limit $0$, then $1$, then $2$, …</p>` },
        { title: `The math`, body: `<p>Each round is a DFS capped at the current limit. This gets BFS's shallowest-goal guarantee with DFS's $\\mathcal{O}(d)$ memory. The cost is re-exploring shallow nodes, which is cheap.</p>` },
        { title: `Run it`, body: `<p>Run depth-limited search at increasing limits until the goal appears.</p>`,
          code: `children = {1: [2, 3], 2: [4, 5], 3: [6, 7],\n            4: [], 5: [], 6: [], 7: []}\ngoal = 6\ndef dls(node, limit, path):\n    if node == goal: return path\n    if limit == 0: return None\n    for ch in children[node]:\n        r = dls(ch, limit - 1, path + [ch])\n        if r: return r\n    return None\nfor depth in range(0, 4):\n    res = dls(1, depth, [1])\n    print("depth limit %d -> %s" % (depth, res if res else "not found"))\n    if res: break`,
          output: `depth limit 0 -> not found\ndepth limit 1 -> not found\ndepth limit 2 -> [1, 3, 6]` }
      ],
      conclusion: `Limits $0$ and $1$ fail; limit $2$ finds the goal via path $[1, 3, 6]$ — the shallowest goal, found with small memory.`
    }
  ],

  /* ============================================================= */
  "ai-graph-search": [
    {
      title: `Shortest road route with Dijkstra`,
      domain: `Logistics / road networks`,
      question: `What is the cheapest cost from S to G in a weighted road graph?`,
      steps: [
        { title: `The data`, body: `<p>A weighted graph of intersections. Edges (cost): S→A=1, S→B=4, A→C=2, A→B=2, B→D=1, C→G=3, D→G=2, C→D=1.</p>` },
        { title: `The math`, body: `<p>Uniform cost search (Dijkstra) keeps each node's best PastCost and always settles the cheapest frontier node next: $\\text{PastCost}(v) = \\min(\\text{PastCost}(v),\\, \\text{PastCost}(u) + \\text{Cost}(u,v))$.</p>` },
        { title: `Run it`, body: `<p>A heap pops the cheapest node and relaxes its neighbors.</p>`,
          code: `import heapq\ngraph = {"S": [("A", 1), ("B", 4)], "A": [("C", 2), ("B", 2)],\n         "B": [("D", 1)], "C": [("G", 3), ("D", 1)],\n         "D": [("G", 2)], "G": []}\npq = [(0, "S")]; dist = {"S": 0}\nwhile pq:\n    d, u = heapq.heappop(pq)\n    if d > dist.get(u, 1e9): continue\n    for v, w in graph[u]:\n        nd = d + w\n        if nd < dist.get(v, 1e9):\n            dist[v] = nd; heapq.heappush(pq, (nd, v))\nprint("settled costs:", {k: dist[k] for k in sorted(dist)})\nprint("shortest S->G cost =", dist["G"])`,
          output: `settled costs: {'A': 1, 'B': 3, 'C': 3, 'D': 4, 'G': 6, 'S': 0}\nshortest S->G cost = 6` }
      ],
      conclusion: `The shortest cost S → G is $6$. UCS settles each node at its true minimum cost, e.g. B at $3$ (via A, not the direct $4$).`
    },
    {
      title: `Spell-check distance with dynamic programming`,
      domain: `NLP / spell-check`,
      question: `How many edits turn "kitten" into "sitting"?`,
      steps: [
        { title: `The data`, body: `<p>Two words, "kitten" and "sitting". An edit is an insert, delete, or substitute, each cost $1$. Each cell $(i,j)$ is a subproblem: edit distance of the prefixes.</p>` },
        { title: `The math`, body: `<p>DP memoizes the future cost: $dp[i][j] = \\min(dp[i-1][j]+1,\\; dp[i][j-1]+1,\\; dp[i-1][j-1]+c)$, where $c=0$ if the letters match. Each subproblem is solved once.</p>` },
        { title: `Run it`, body: `<p>Fill the table row by row, reusing earlier answers.</p>`,
          code: `a, b = "kitten", "sitting"\nn, m = len(a), len(b)\ndp = [[0]*(m+1) for _ in range(n+1)]\nfor i in range(n+1): dp[i][0] = i\nfor j in range(m+1): dp[0][j] = j\nfor i in range(1, n+1):\n    for j in range(1, m+1):\n        c = 0 if a[i-1] == b[j-1] else 1\n        dp[i][j] = min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+c)\nprint("edit distance(%s,%s)=%d" % (a, b, dp[n][m]))`,
          output: `edit distance(kitten,sitting)=3` }
      ],
      conclusion: `The edit distance is $3$ (k→s, e→i, and insert g). DP reuses each prefix sub-answer instead of recomputing, so the table fills in $\\mathcal{O}(nm)$.`
    },
    {
      title: `Cheapest flight itinerary`,
      domain: `Travel / flight pricing`,
      question: `What is the cheapest fare from JFK to LAX with connections?`,
      steps: [
        { title: `The data`, body: `<p>Airports with one-way fares: JFK→ORD=200, JFK→ATL=150, ATL→ORD=80, ORD→LAX=120, ATL→LAX=300.</p>` },
        { title: `The math`, body: `<p>Same UCS recurrence as routing: settle the cheapest cumulative fare first, relaxing connections. The goal's settled cost is the cheapest itinerary.</p>` },
        { title: `Run it`, body: `<p>A heap of running fares pops the cheapest and extends it.</p>`,
          code: `import heapq\nfares = {"JFK": [("ORD", 200), ("ATL", 150)],\n         "ATL": [("ORD", 80), ("LAX", 300)],\n         "ORD": [("LAX", 120)], "LAX": []}\npq = [(0, "JFK", ["JFK"])]; dist = {"JFK": 0}; best = None\nwhile pq:\n    d, u, p = heapq.heappop(pq)\n    if u == "LAX": best = (d, p); break\n    if d > dist.get(u, 1e9): continue\n    for v, w in fares[u]:\n        if d + w < dist.get(v, 1e9):\n            dist[v] = d + w; heapq.heappush(pq, (d + w, v, p + [v]))\nprint("cheapest itinerary", best[1], "fare $%d" % best[0])`,
          output: `cheapest itinerary ['JFK', 'ORD', 'LAX'] fare $320` }
      ],
      conclusion: `The cheapest fare is \\$320 via JFK → ORD → LAX. The one-stop-via-ATL route (150 + 80 + 120 = \\$350) is pricier, so UCS settles LAX at the true minimum \\$320.`
    }
  ],

  /* ============================================================= */
  "ai-astar": [
    {
      title: `Game-character pathfinding`,
      domain: `Video games`,
      question: `How does A* route a character to the goal while expanding few cells?`,
      steps: [
        { title: `The data`, body: `<p>A 4×5 tile map with walls <code>#</code>. Start <code>S</code> top-left, goal <code>G</code> bottom-right. Each move costs $1$. The heuristic $h$ is Manhattan distance to the goal — admissible on a grid.</p>` },
        { title: `The math`, body: `<p>A* expands the cell with the lowest $f = g + h$, where $g$ is steps so far and $h$ guesses the remaining distance. The heuristic steers it toward the goal instead of spreading evenly.</p>` },
        { title: `Run it`, body: `<p>A heap ordered by $f$ drives the search; we also count expanded cells.</p>`,
          code: `import heapq\ngrid = ["S...#",\n        ".##.#",\n        "....#",\n        ".#..G"]\nR, Cc = len(grid), len(grid[0])\ndef find(ch):\n    return next((r, c) for r in range(R) for c in range(Cc) if grid[r][c] == ch)\nstart, goal = find('S'), find('G')\ndef h(s): return abs(s[0]-goal[0]) + abs(s[1]-goal[1])\ndef nbrs(s):\n    r, c = s\n    for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:\n        if 0 <= r+dr < R and 0 <= c+dc < Cc and grid[r+dr][c+dc] != '#':\n            yield (r+dr, c+dc)\npq = [(h(start), 0, start)]; g = {start: 0}; prev = {start: None}; expanded = 0\nwhile pq:\n    f, gc, u = heapq.heappop(pq)\n    if u == goal: break\n    if gc > g.get(u, 1e9): continue\n    expanded += 1\n    for v in nbrs(u):\n        if gc + 1 < g.get(v, 1e9):\n            g[v] = gc + 1; prev[v] = u\n            heapq.heappush(pq, (gc + 1 + h(v), gc + 1, v))\npath = []; cur = goal\nwhile cur is not None: path.append(cur); cur = prev[cur]\npath.reverse()\nprint("path length =", len(path) - 1, "nodes expanded =", expanded)\nprint("path", path)`,
          output: `path length = 7 nodes expanded = 13\npath [(0, 0), (0, 1), (0, 2), (0, 3), (1, 3), (2, 3), (3, 3), (3, 4)]` }
      ],
      conclusion: `A* finds the optimal $7$-step path while expanding only $13$ cells — the heuristic keeps it aimed at the goal instead of flooding the map.`
    },
    {
      title: `GPS routing with straight-line distance`,
      domain: `Navigation / GPS`,
      question: `What route does A* pick between cities using as-the-crow-flies distance?`,
      steps: [
        { title: `The data`, body: `<p>Cities with map coordinates and road costs: A→B=3, A→C=5, B→C=2, B→D=4, C→D=2, C→G=6, D→G=2. Goal is G.</p>` },
        { title: `The math`, body: `<p>The heuristic $h(n)$ is the Euclidean (straight-line) distance from $n$ to G. It never exceeds the true road distance, so it is admissible and A* returns the optimal route.</p>` },
        { title: `Run it`, body: `<p>Compute $h$ from coordinates and run A* over the road graph.</p>`,
          code: `import heapq, math\ncoord = {"A": (0,0), "B": (2,1), "C": (3,3), "D": (5,2), "G": (6,4)}\nroads = {"A": [("B",3),("C",5)], "B": [("C",2),("D",4)],\n         "C": [("D",2),("G",6)], "D": [("G",2)], "G": []}\ngoal = "G"\ndef h(n):\n    (x1,y1),(x2,y2) = coord[n], coord[goal]\n    return math.hypot(x2-x1, y2-y1)\npq = [(h("A"), 0, "A")]; g = {"A": 0}; prev = {"A": None}\nwhile pq:\n    f, gc, u = heapq.heappop(pq)\n    if u == goal: break\n    if gc > g.get(u, 1e9): continue\n    for v, w in roads[u]:\n        if gc + w < g.get(v, 1e9):\n            g[v] = gc + w; prev[v] = u\n            heapq.heappush(pq, (gc + w + h(v), gc + w, v))\npath = []; cur = goal\nwhile cur is not None: path.append(cur); cur = prev[cur]\npath.reverse()\nprint("route", path, "cost", g[goal])`,
          output: `route ['A', 'B', 'D', 'G'] cost 9` }
      ],
      conclusion: `A* picks A → B → D → G at cost $9$. The straight-line heuristic pulls the search toward G, avoiding the longer detour through C.`
    },
    {
      title: `Admissible vs inadmissible heuristic`,
      domain: `Robotics / planning theory`,
      question: `What happens to A*'s guarantee if the heuristic overestimates?`,
      steps: [
        { title: `The data`, body: `<p>From a state the true remaining cost is $5$. We test two heuristics: $h=4$ (under) and $h=9$ (over).</p>` },
        { title: `The math`, body: `<p>A heuristic is <b>admissible</b> when $h(s) \\le$ true remaining cost. Admissible $\\Rightarrow$ A* is optimal. An overestimate ($h &gt; $ truth) can make A* skip the real cheapest path.</p>` },
        { title: `Run it`, body: `<p>Check both heuristics against the true cost.</p>`,
          code: `true_remaining = 5\nfor h in (4, 9):\n    ok = h <= true_remaining\n    print("h=%d -> admissible=%s" % (h, ok))`,
          output: `h=4 -> admissible=True\nh=9 -> admissible=False` }
      ],
      conclusion: `$h=4$ is admissible ($4 \\le 5$) and keeps A* optimal; $h=9$ overestimates ($9 &gt; 5$) and can break the optimality guarantee.`
    }
  ],

  /* ============================================================= */
  "ai-mdp": [
    {
      title: `A robot on slippery ice`,
      domain: `Robotics`,
      question: `If "move right" slips 20% of the time, what is that action worth?`,
      steps: [
        { title: `The data`, body: `<p>The robot tries to move right. Outcomes: $80\\%$ it goes right (reward $+5$, next value $10$); $20\\%$ it slips up (reward $0$, next value $0$). Discount $\\gamma = 0.9$.</p>` },
        { title: `The math`, body: `<p>The transition probabilities must sum to $1$. The action's value is $\\sum_{s'} T(s,a,s')\\,[\\,\\text{Reward} + \\gamma V(s')\\,]$ — an average over where it might land.</p>` },
        { title: `Run it`, body: `<p>Confirm the probabilities sum to $1$, then take the expectation.</p>`,
          code: `T = {"right": 0.8, "up": 0.2}\nRw = {"right": 5, "up": 0}\nVnext = {"right": 10, "up": 0}\ngamma = 0.9\nq = sum(T[o] * (Rw[o] + gamma * Vnext[o]) for o in T)\nprint("sum of probs =", sum(T.values()))\nprint("Q(s,right) = %.2f" % q)`,
          output: `sum of probs = 1.0\nQ(s,right) = 11.20` }
      ],
      conclusion: `The probabilities sum to $1$, and "move right" is worth $11.20$ — the $20\\%$ slip chance pulls it below the no-slip value of $5 + 0.9\\times10 = 14$.`
    },
    {
      title: `Restocking inventory`,
      domain: `Retail / operations`,
      question: `After restocking to 2 units, what is the distribution of next-day stock?`,
      steps: [
        { title: `The data`, body: `<p>Stock can be $0, 1, 2$. We restock to $2$. Daily demand is random: $0$ units with prob $0.5$, $1$ with $0.3$, $2$ with $0.2$. Next stock is $\\max(0, 2 - \\text{demand})$.</p>` },
        { title: `The math`, body: `<p>This is the MDP transition $T(s, \\text{restock}, s')$. For each demand outcome we land in a next state with that probability; the probabilities over all next states must sum to $1$.</p>` },
        { title: `Run it`, body: `<p>Map each demand to a next stock and accumulate probabilities.</p>`,
          code: `demand = {0: 0.5, 1: 0.3, 2: 0.2}\nnxt = {}\nfor d, p in demand.items():\n    s2 = max(0, 2 - d)\n    nxt[s2] = nxt.get(s2, 0) + p\nfor s in sorted(nxt):\n    print("  stock=%d prob=%.1f" % (s, nxt[s]))\nprint("total prob =", round(sum(nxt.values()), 3))`,
          output: `  stock=0 prob=0.2\n  stock=1 prob=0.3\n  stock=2 prob=0.5\ntotal prob = 1.0` }
      ],
      conclusion: `Next-day stock is $0$ w.p. $0.2$, $1$ w.p. $0.3$, $2$ w.p. $0.5$, summing to $1$ — a valid MDP transition the planner can act on.`
    },
    {
      title: `A dispatch decision under uncertainty`,
      domain: `Ride-hailing`,
      question: `Should a driver accept a ride whose length is uncertain?`,
      steps: [
        { title: `The data`, body: `<p>Accepting a ride: $60\\%$ it is short (reward $8$, next value $4$), $40\\%$ long (reward $20$, next value $2$). Rejecting: stay idle (reward $0$, next value $5$). Discount $\\gamma = 0.9$.</p>` },
        { title: `The math`, body: `<p>Each action's value averages its random outcomes: $\\sum_{s'} T\\,[\\,\\text{Reward} + \\gamma V(s')\\,]$. The driver should take the action with the higher value, planning with the odds.</p>` },
        { title: `Run it`, body: `<p>Compute the value of accept vs reject.</p>`,
          code: `gamma = 0.9\nQ_accept = sum(p*(r+gamma*v) for p,r,v in [(0.6,8,4),(0.4,20,2)])\nQ_reject = 0 + gamma * 5\nprint("Q(accept)=%.2f Q(reject)=%.2f -> %s" %\n      (Q_accept, Q_reject, "accept" if Q_accept > Q_reject else "reject"))`,
          output: `Q(accept)=15.68 Q(reject)=4.50 -> accept` }
      ],
      conclusion: `Accepting is worth $15.68$ versus $4.50$ for idling, so the driver should <b>accept</b> — even though the ride length is uncertain.`
    }
  ],

  /* ============================================================= */
  "ai-policy-value": [
    {
      title: `Value of a warehouse robot's plan`,
      domain: `Robotics`,
      question: `How good is the "always move toward the goal" policy from each aisle?`,
      steps: [
        { title: `The data`, body: `<p>A line of 4 aisles, states $0,1,2,3$. State $3$ is the goal (reaching it pays $+10$); other steps pay $0$. The policy: always move right. Discount $\\gamma = 0.9$.</p>` },
        { title: `The math`, body: `<p>$V_\\pi(s)$ is the expected discounted reward of following $\\pi$ from $s$. Here it is deterministic, so $V_\\pi(s) = \\gamma\\,V_\\pi(s+1)$, with the $+10$ paid on entering state $3$.</p>` },
        { title: `Run it`, body: `<p>Back up the value from the goal toward the start.</p>`,
          code: `gamma = 0.9\nV = [0]*4   # V[3] terminal = 0\nfor s in [2, 1, 0]:\n    V[s] = 0 + gamma * (10 if s+1 == 3 else V[s+1])\nprint("V_pi:", [round(v, 3) for v in V])`,
          output: `V_pi: [7.29, 8.1, 9.0, 0]` }
      ],
      conclusion: `The plan is worth $9.0$ from aisle $2$ (one step away), but only $7.29$ from aisle $0$ — discounting shrinks the same $+10$ goal the farther away you start.`
    },
    {
      title: `Discounting a trading strategy`,
      domain: `Finance / trading`,
      question: `Three equal payoffs arrive over three days. What is their discounted value?`,
      steps: [
        { title: `The data`, body: `<p>A strategy yields rewards $r = [10, 10, 10]$ on days $1, 2, 3$. The discount $\\gamma = 0.5$ says a dollar tomorrow is worth half a dollar today.</p>` },
        { title: `The math`, body: `<p>Utility is the discounted sum $u = \\sum_i r_i\\,\\gamma^{\\,i}$ (day $1$ at $\\gamma^0$, day $2$ at $\\gamma^1$, …). With no randomness, the value equals this utility.</p>` },
        { title: `Run it`, body: `<p>Weight each day's reward by its discount and sum.</p>`,
          code: `r = [10, 10, 10]; g = 0.5\nu = sum(ri * g**i for i, ri in enumerate(r))\nprint("discounted utility =", u)`,
          output: `discounted utility = 17.5` }
      ],
      conclusion: `The discounted value is $17.5$, far below the raw total $30$: day 2 counts as $5$ and day 3 as $2.5$. Sooner payoffs dominate.`
    },
    {
      title: `Comparing two game plans`,
      domain: `Board games`,
      question: `An aggressive plan front-loads reward; a patient plan spreads it. Which has higher value?`,
      steps: [
        { title: `The data`, body: `<p>Aggressive plan rewards $[8, 4, 0]$; patient plan rewards $[2, 4, 8]$ over three turns. Discount $\\gamma = 0.8$.</p>` },
        { title: `The math`, body: `<p>Each plan's value is $u = \\sum_i r_i\\gamma^{\\,i}$. Discounting favors plans that earn early, so front-loaded rewards are worth more.</p>` },
        { title: `Run it`, body: `<p>Discount and sum each reward stream.</p>`,
          code: `g = 0.8\ndef value(r): return sum(ri * g**i for i, ri in enumerate(r))\nagg = value([8, 4, 0]); pat = value([2, 4, 8])\nprint("aggressive=%.2f patient=%.2f -> %s" %\n      (agg, pat, "aggressive" if agg > pat else "patient"))`,
          output: `aggressive=11.20 patient=10.32 -> aggressive` }
      ],
      conclusion: `The aggressive plan wins, $11.20$ vs $10.32$: with $\\gamma=0.8$, earning the big reward on turn 1 beats waiting until turn 3 for it.`
    }
  ],

  /* ============================================================= */
  "ai-qvalue": [
    {
      title: `Worth of a risky action`,
      domain: `Robotics`,
      question: `An action succeeds 80% of the time. What is its Q-value?`,
      steps: [
        { title: `The data`, body: `<p>Action $a$ has two outcomes: $80\\%$ reward $5$ then next value $10$; $20\\%$ reward $0$ then next value $0$. Discount $\\gamma = 0.5$.</p>` },
        { title: `The math`, body: `<p>$Q(s,a) = \\sum_{s'} T(s,a,s')\\,[\\,\\text{Reward}(s,a,s') + \\gamma V(s')\\,]$ — average the (reward plus discounted future value) over outcomes.</p>` },
        { title: `Run it`, body: `<p>Weight each outcome term by its probability and sum.</p>`,
          code: `gamma = 0.5\nouts = [(0.8, 5, 10), (0.2, 0, 0)]   # (prob, reward, V_next)\nQ = sum(p * (r + gamma * v) for p, r, v in outs)\nprint("Q(s,a) =", Q)`,
          output: `Q(s,a) = 8.0` }
      ],
      conclusion: `The action is worth $Q(s,a) = 8.0$: the good outcome contributes $0.8\\times(5+5)=8$, the bad outcome $0$.`
    },
    {
      title: `Accept or reject a ride request`,
      domain: `Ride-hailing`,
      question: `Which has the higher Q-value: accepting a variable ride, or staying idle?`,
      steps: [
        { title: `The data`, body: `<p>Accept: $60\\%$ short (reward $8$, value $4$), $40\\%$ long (reward $20$, value $2$). Reject: idle (reward $0$, value $5$). $\\gamma = 0.9$.</p>` },
        { title: `The math`, body: `<p>Compute $Q(s,\\text{accept})$ as the expectation over ride outcomes, and $Q(s,\\text{reject})$ for staying idle. Pick the larger.</p>` },
        { title: `Run it`, body: `<p>Evaluate both Q-values and compare.</p>`,
          code: `gamma = 0.9\nQ_accept = sum(p*(r+gamma*v) for p,r,v in [(0.6,8,4),(0.4,20,2)])\nQ_reject = 0 + gamma * 5\nprint("Q(accept)=%.2f Q(reject)=%.2f -> %s" %\n      (Q_accept, Q_reject, "accept" if Q_accept > Q_reject else "reject"))`,
          output: `Q(accept)=15.68 Q(reject)=4.50 -> accept` }
      ],
      conclusion: `$Q(\\text{accept}) = 15.68 &gt; Q(\\text{reject}) = 4.50$, so accepting is the better-valued action by a wide margin.`
    },
    {
      title: `A single sure outcome`,
      domain: `Games / scoring`,
      question: `If an action always lands the same way, what is its Q-value?`,
      steps: [
        { title: `The data`, body: `<p>Action $a$ has one outcome, probability $1$: reward $6$, next-state value $V = 4$. Discount $\\gamma = 0.5$.</p>` },
        { title: `The math`, body: `<p>With a single certain outcome the sum collapses to one term: $Q(s,a) = 1\\times[\\,\\text{Reward} + \\gamma V(s')\\,]$.</p>` },
        { title: `Run it`, body: `<p>Evaluate the single term.</p>`,
          code: `gamma = 0.5\nouts = [(1.0, 6, 4)]\nQ = sum(p * (r + gamma * v) for p, r, v in outs)\nprint("Q(s,a) =", Q)`,
          output: `Q(s,a) = 8.0` }
      ],
      conclusion: `$Q(s,a) = 6 + 0.5\\times4 = 8.0$. With no randomness the Q-value is just the immediate reward plus the discounted next value.`
    }
  ],

  /* ============================================================= */
  "ai-value-iteration": [
    {
      title: `Solving a corridor navigation MDP`,
      domain: `Robotics`,
      question: `What are the optimal values and policy for a 4-state corridor?`,
      steps: [
        { title: `The data`, body: `<p>States $0,1,2,3$; state $3$ is the goal (value $1$). Actions left/right are deterministic; bumping the wall stays in place. Step reward $-0.04$, discount $\\gamma = 0.9$.</p>` },
        { title: `The math`, body: `<p>The Bellman backup $V^{(t)}(s) \\leftarrow \\max_a [\\,R + \\gamma V^{(t-1)}(\\text{Succ}(s,a))\\,]$ is applied to every state, repeatedly, until values stop moving. The policy is $\\arg\\max_a$.</p>` },
        { title: `Run it`, body: `<p>Sweep the Bellman update 30 times, then read off the greedy policy.</p>`,
          code: `gamma = 0.9; step = -0.04\nstates = [0, 1, 2, 3]\nV = {s: 0.0 for s in states}; V[3] = 1.0\ndef succ(s, a):\n    ns = s + a\n    return s if (ns < 0 or ns > 3) else ns\nfor _ in range(30):\n    newV = dict(V)\n    for s in states:\n        if s == 3: continue\n        newV[s] = max(step + gamma * V[succ(s, a)] for a in (-1, 1))\n    V = newV\npol = {}\nfor s in states:\n    if s == 3: continue\n    pol[s] = "right" if (step + gamma*V[succ(s,1)]) >= (step + gamma*V[succ(s,-1)]) else "left"\nprint("V*:", {s: round(V[s], 3) for s in states})\nprint("pi*:", pol)`,
          output: `V*: {0: 0.621, 1: 0.734, 2: 0.86, 3: 1.0}\npi*: {0: 'right', 1: 'right', 2: 'right'}` }
      ],
      conclusion: `Values climb toward the goal ($0.62, 0.73, 0.86, 1.0$) and the optimal policy is "right" everywhere — march straight to state $3$.`
    },
    {
      title: `Optimal values on a 3×3 grid`,
      domain: `Warehouse logistics`,
      question: `What are the state values for a grid with a goal and a pit?`,
      steps: [
        { title: `The data`, body: `<p>A 3×3 grid. Goal at $(0,2)$ pays $+1$; pit at $(1,2)$ pays $-1$; both terminal. Four moves, deterministic, bumping a wall stays. Step reward $-0.04$, $\\gamma = 0.9$.</p>` },
        { title: `The math`, body: `<p>Same Bellman backup over the whole grid. Values spread out from the goal; cells near the pit are pulled down.</p>` },
        { title: `Run it`, body: `<p>Iterate 50 sweeps and print the value grid.</p>`,
          code: `ROWS, COLS = 3, 3\ngoal, pit = (0, 2), (1, 2)\ngamma, step = 0.9, -0.04\nacts = [(-1,0),(1,0),(0,-1),(0,1)]\nV = {(r,c): 0.0 for r in range(ROWS) for c in range(COLS)}\nV[goal] = 1.0; V[pit] = -1.0\ndef succ(s, a):\n    nr, nc = s[0]+a[0], s[1]+a[1]\n    return (nr,nc) if 0 <= nr < ROWS and 0 <= nc < COLS else s\nfor _ in range(50):\n    nV = dict(V)\n    for r in range(ROWS):\n        for c in range(COLS):\n            s = (r,c)\n            if s in (goal, pit): continue\n            nV[s] = max(step + gamma * V[succ(s,a)] for a in acts)\n    V = nV\nfor r in range(ROWS):\n    print(" ".join("%5.2f" % V[(r,c)] for c in range(COLS)))`,
          output: ` 0.73  0.86  1.00\n 0.62  0.73 -1.00\n 0.52  0.62  0.52` }
      ],
      conclusion: `The goal corner reaches $1.00$ with values smoothly decreasing away from it; the pit stays at $-1.00$. Following the highest-value neighbor gives the optimal route to the goal.`
    },
    {
      title: `One Bellman backup by hand`,
      domain: `Games / endgame tables`,
      question: `Given two action Q-values, what is the new state value and best action?`,
      steps: [
        { title: `The data`, body: `<p>Using last round's values, a state's two actions have Q-values $Q(\\text{left}) = 3$ and $Q(\\text{right}) = 7$.</p>` },
        { title: `The math`, body: `<p>$V^{(t)}(s) = \\max_a Q(s,a)$ keeps the bigger number; $\\pi^*(s) = \\arg\\max_a Q(s,a)$ names the best action.</p>` },
        { title: `Run it`, body: `<p>Take the max and the argmax over the actions.</p>`,
          code: `Q = {"left": 3, "right": 7}\nV = max(Q.values())\npi = max(Q, key=Q.get)\nprint("V(s) =", V, "| pi*(s) =", pi)`,
          output: `V(s) = 7 | pi*(s) = right` }
      ],
      conclusion: `The new value is $V(s) = 7$ and the optimal action is "right". Repeating this backup over all states until convergence yields $\\pi^*$.`
    }
  ],

  /* ============================================================= */
  "ai-q-learning": [
    {
      title: `Learning a corridor with no map`,
      domain: `Robotics / RL`,
      question: `Can an agent learn the right action in each state purely from experience?`,
      steps: [
        { title: `The data`, body: `<p>States $0,1,2$ plus goal $3$ (reaching $3$ pays $+1$). The agent does <i>not</i> know the transitions — it must act and observe. Actions left/right, $\\gamma = 0.9$, learning rate $\\eta = 0.5$, $\\varepsilon$-greedy exploration.</p>` },
        { title: `The math`, body: `<p>After each step, $\\hat Q(s,a) \\leftarrow (1-\\eta)\\hat Q(s,a) + \\eta[\\,r + \\gamma\\max_{a'}\\hat Q(s',a')\\,]$. The estimate slides toward the observed reward-plus-future.</p>` },
        { title: `Run it`, body: `<p>Run 2000 episodes of acting and updating, then read the learned policy.</p>`,
          code: `import numpy as np\nnp.random.seed(1)\ngamma, eta = 0.9, 0.5\nA = [-1, 1]\nQ = {(s, a): 0.0 for s in range(3) for a in A}\ndef env(s, a):\n    ns = min(3, max(0, s + a))\n    return ns, (1.0 if ns == 3 else 0.0)\nfor ep in range(2000):\n    s = 0\n    while s != 3:\n        a = A[np.random.randint(2)] if np.random.rand() < 0.2 \\\n            else max(A, key=lambda aa: Q[(s, aa)])\n        ns, r = env(s, a)\n        bestnext = 0 if ns == 3 else max(Q[(ns, aa)] for aa in A)\n        Q[(s, a)] = (1-eta)*Q[(s, a)] + eta*(r + gamma*bestnext)\n        s = ns\nfor s in range(3):\n    pol = "right" if Q[(s, 1)] >= Q[(s, -1)] else "left"\n    print("state %d: Q_left=%.2f Q_right=%.2f -> %s" %\n          (s, Q[(s, -1)], Q[(s, 1)], pol))`,
          output: `state 0: Q_left=0.73 Q_right=0.81 -> right\nstate 1: Q_left=0.73 Q_right=0.90 -> right\nstate 2: Q_left=0.81 Q_right=1.00 -> right` }
      ],
      conclusion: `Without ever seeing the model, the agent learns "go right" everywhere, with Q-values rising toward the goal ($0.81, 0.90, 1.00$) — matching what value iteration would compute.`
    },
    {
      title: `One Q-learning update`,
      domain: `Game agents`,
      question: `How does a single observed reward move a Q-estimate?`,
      steps: [
        { title: `The data`, body: `<p>Current estimate $\\hat Q(s,a) = 4$. The agent acts and sees reward $r = 10$; the best next value is $0$. Use $\\eta = 0.5$, $\\gamma = 0.5$.</p>` },
        { title: `The math`, body: `<p>Target $= r + \\gamma\\max_{a'}\\hat Q(s',a')$. New estimate $= (1-\\eta)\\hat Q + \\eta\\cdot\\text{target}$ — a blend of old and new.</p>` },
        { title: `Run it`, body: `<p>Compute the target and blend.</p>`,
          code: `Qhat = 4.0; r = 10; bestnext = 0; eta = 0.5; gamma = 0.5\ntarget = r + gamma * bestnext\nQhat = (1 - eta) * Qhat + eta * target\nprint("updated Qhat =", Qhat)`,
          output: `updated Qhat = 7.0` }
      ],
      conclusion: `The estimate moves from $4$ to $7.0$, halfway toward the observed target of $10$. More trials pull it closer to the true value.`
    },
    {
      title: `A two-armed slot machine`,
      domain: `Recommendation / bandits`,
      question: `Can Q-learning find the better of two arms from rewards alone?`,
      steps: [
        { title: `The data`, body: `<p>One state, two actions (arms). Arm A pays reward $1$, arm B pays $0$ (deterministic here for clarity). The agent must learn this from pulls. $\\eta = 0.5$, single-step so $\\gamma$ does not matter.</p>` },
        { title: `The math`, body: `<p>With no next state, the update is $\\hat Q(a) \\leftarrow (1-\\eta)\\hat Q(a) + \\eta r$. Repeated pulls drive each arm's estimate to its true reward.</p>` },
        { title: `Run it`, body: `<p>Pull each arm many times with $\\varepsilon$-greedy and read the estimates.</p>`,
          code: `import numpy as np\nnp.random.seed(0)\nreward = {"A": 1.0, "B": 0.0}\nQ = {"A": 0.0, "B": 0.0}; eta = 0.5\nfor t in range(500):\n    a = np.random.choice(["A", "B"]) if np.random.rand() < 0.2 \\\n        else max(Q, key=Q.get)\n    Q[a] = (1 - eta) * Q[a] + eta * reward[a]\nprint("Q(A)=%.2f Q(B)=%.2f -> best arm %s" % (Q["A"], Q["B"], max(Q, key=Q.get)))`,
          output: `Q(A)=1.00 Q(B)=0.00 -> best arm A` }
      ],
      conclusion: `Q-learning settles on $Q(A)=1.00$, $Q(B)=0.00$ and picks arm <b>A</b> — discovering the better arm from sampled rewards, no model needed.`
    }
  ],

  /* ============================================================= */
  "ai-minimax": [
    {
      title: `Best move in tic-tac-toe`,
      domain: `Games`,
      question: `X has two in a row. What is the optimal move against perfect play?`,
      steps: [
        { title: `The data`, body: `<p>Board <code>"XX OO    "</code> (cells 0-8): X at 0,1; O at 3,4. X to move. Win = $+1$ for X, loss = $-1$, draw = $0$.</p>` },
        { title: `The math`, body: `<p>$V(s) = \\max_a V(\\text{Succ})$ on X's turn, $\\min_a V(\\text{Succ})$ on O's. Recurse to terminal boards and back the values up. X picks the move with the highest value.</p>` },
        { title: `Run it`, body: `<p>Full minimax over the game tree from this position.</p>`,
          code: `import math\ndef winner(b):\n    lines = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]\n    for a,bb,c in lines:\n        if b[a] != ' ' and b[a] == b[bb] == b[c]: return b[a]\n    return None\ndef minimax(b, player):\n    w = winner(b)\n    if w == 'X': return 1\n    if w == 'O': return -1\n    if ' ' not in b: return 0\n    moves = [i for i in range(9) if b[i] == ' ']\n    if player == 'X':\n        return max(minimax(b[:m]+'X'+b[m+1:], 'O') for m in moves)\n    return min(minimax(b[:m]+'O'+b[m+1:], 'X') for m in moves)\nboard = \"XX OO    \"\nvals = {m: minimax(board[:m]+'X'+board[m+1:], 'O')\n        for m in range(9) if board[m] == ' '}\nbest = max(vals, key=vals.get)\nprint(\"move values:\", vals)\nprint(\"best move = cell\", best, \"value\", vals[best])`,
          output: `move values: {2: 1, 5: 0, 6: -1, 7: -1, 8: -1}\nbest move = cell 2 value 1` }
      ],
      conclusion: `Playing cell $2$ completes the top row for an immediate win (value $+1$). Every other move lets O at least draw or win — minimax finds the one winning move.`
    },
    {
      title: `Backing values up a game tree`,
      domain: `Games / theory`,
      question: `With known leaf scores, which branch should the maximizer pick?`,
      steps: [
        { title: `The data`, body: `<p>You move first (max). Branch A leads to opponent min over leaves $\\{3, 8\\}$; branch B to min over $\\{5, 2\\}$.</p>` },
        { title: `The math`, body: `<p>At opponent (min) nodes take the smaller leaf; at your (max) node take the larger branch value: $\\max(\\min(3,8),\\,\\min(5,2))$.</p>` },
        { title: `Run it`, body: `<p>Compute the min at each branch, then the max.</p>`,
          code: `leaves = {('A','l'): 3, ('A','r'): 8, ('B','l'): 5, ('B','r'): 2}\nA = min(leaves[('A','l')], leaves[('A','r')])\nB = min(leaves[('B','l')], leaves[('B','r')])\nroot = max(A, B)\nprint(\"branch A(min)=%d B(min)=%d root(max)=%d\" % (A, B, root))`,
          output: `branch A(min)=3 B(min)=2 root(max)=3` }
      ],
      conclusion: `Branch A is worth $3$ and branch B is worth $2$, so you pick A; the minimax value of the game is $3$ — what you can guarantee against perfect play.`
    },
    {
      title: `Optimal play in misère Nim`,
      domain: `Combinatorial games`,
      question: `From a single pile of 4 sticks (take 1-2, last stick loses), does the mover win?`,
      steps: [
        { title: `The data`, body: `<p>A pile of $4$ sticks. On your turn take $1$ or $2$. The player forced to take the last stick <i>loses</i>. Score $+1$ if the player to move eventually wins, $-1$ if loses.</p>` },
        { title: `The math`, body: `<p>Minimax via negamax: $\\text{value}(p) = \\max_{\\text{take}} -\\text{value}(p-\\text{take})$. A terminal pile of $1$ forces a loss for the mover ($-1$). The negation flips perspective each turn.</p>` },
        { title: `Run it`, body: `<p>Recurse from the current pile, negating the opponent's value.</p>`,
          code: `import math\nfrom functools import lru_cache\n@lru_cache(None)\ndef value(pile):\n    if pile == 1: return -1   # mover must take last stick -> loses\n    best = -math.inf\n    for take in (1, 2):\n        if take < pile:\n            best = max(best, -value(pile - take))\n    return best\nprint(\"value for mover with 4 sticks =\", value(4))`,
          output: `value for mover with 4 sticks = -1` }
      ],
      conclusion: `The value is $-1$: with $4$ sticks under perfect play, the player to move <b>loses</b>. Whatever they take ($1$ or $2$), the opponent can always leave them facing the last stick.`
    }
  ],

  /* ============================================================= */
  "ai-alpha-beta": [
    {
      title: `Pruning a depth-2 game tree`,
      domain: `Games / chess engines`,
      question: `How many leaves can alpha-beta skip on a small tree?`,
      steps: [
        { title: `The data`, body: `<p>A depth-2 tree: root is max, two min children, leaves $[3, 5, 2, 9]$. Plain minimax visits all $4$ leaves.</p>` },
        { title: `The math`, body: `<p>Track $\\alpha$ (max's best so far) and $\\beta$ (min's best so far). Prune a branch when $\\alpha \\ge \\beta$: it cannot change the decision.</p>` },
        { title: `Run it`, body: `<p>Run alpha-beta and count the leaves actually examined.</p>`,
          code: `import math\nleaves = [3, 5, 2, 9]; visited = [0]\ndef ab(depth, idx, alpha, beta, maximizing):\n    if depth == 2:\n        visited[0] += 1\n        return leaves[idx]\n    if maximizing:\n        val = -math.inf\n        for k in range(2):\n            val = max(val, ab(depth+1, idx*2+k, alpha, beta, False))\n            alpha = max(alpha, val)\n            if alpha >= beta: break\n        return val\n    else:\n        val = math.inf\n        for k in range(2):\n            val = min(val, ab(depth+1, idx*2+k, alpha, beta, True))\n            beta = min(beta, val)\n            if alpha >= beta: break\n        return val\nroot = ab(0, 0, -math.inf, math.inf, True)\nprint(\"minimax value =\", root)\nprint(\"leaves examined with alpha-beta =\", visited[0], \"of\", len(leaves))`,
          output: `minimax value = 3\nleaves examined with alpha-beta = 3 of 4` }
      ],
      conclusion: `Alpha-beta returns the same value $3$ as minimax but examines only $3$ of $4$ leaves — after the second branch's first leaf ($2$) it knows that branch can't beat the secured $3$.`
    },
    {
      title: `Deeper pruning savings`,
      domain: `Games / connect-style`,
      question: `On a depth-3 tree, how much does pruning save?`,
      steps: [
        { title: `The data`, body: `<p>A full binary tree of depth $3$ with $8$ leaves $[3,12,8,2,4,6,14,1]$. Root is max.</p>` },
        { title: `The math`, body: `<p>The same $\\alpha \\ge \\beta$ cutoff applies recursively. Good move ordering lets whole sub-trees be skipped, cutting the effective branching factor.</p>` },
        { title: `Run it`, body: `<p>Run alpha-beta over all $8$ leaves and count examinations.</p>`,
          code: `import math\nleaves = [3, 12, 8, 2, 4, 6, 14, 1]; vis = [0]\ndef ab(idx, depth, alpha, beta, mx):\n    if depth == 3:\n        vis[0] += 1\n        return leaves[idx]\n    if mx:\n        v = -math.inf\n        for k in range(2):\n            v = max(v, ab(idx*2+k, depth+1, alpha, beta, False))\n            alpha = max(alpha, v)\n            if alpha >= beta: break\n        return v\n    else:\n        v = math.inf\n        for k in range(2):\n            v = min(v, ab(idx*2+k, depth+1, alpha, beta, True))\n            beta = min(beta, v)\n            if alpha >= beta: break\n        return v\nr = ab(0, 0, -math.inf, math.inf, True)\nprint(\"value =\", r, \"leaves examined =\", vis[0], \"of\", len(leaves))`,
          output: `value = 8 leaves examined = 6 of 8` }
      ],
      conclusion: `The minimax value is $8$, found while examining only $6$ of $8$ leaves. The skipped leaves could not change the root — the deeper the tree, the bigger this saving grows.`
    },
    {
      title: `When a single child triggers a cutoff`,
      domain: `Games / theory`,
      question: `Max already secured 7. A new min-branch's first child is 4. Skip the rest?`,
      steps: [
        { title: `The data`, body: `<p>Max has $\\alpha = 7$ secured from an earlier branch. Now exploring a min node whose first child returns $4$; the second child is unknown.</p>` },
        { title: `The math`, body: `<p>A min node's value is at most its smallest child, so this branch $\\le 4$. Since $4 &lt; 7 = \\alpha$, the cutoff $\\alpha \\ge \\beta$ fires (with $\\beta = 4$): prune.</p>` },
        { title: `Run it`, body: `<p>Check the cutoff condition explicitly.</p>`,
          code: `alpha = 7        # max's secured best\nfirst_child = 4  # first reply at this min node\nbeta = first_child\nprune = alpha >= beta\nprint(\"beta=%d alpha=%d -> prune=%s\" % (beta, alpha, prune))`,
          output: `beta=4 alpha=7 -> prune=True` }
      ],
      conclusion: `Since $\\alpha = 7 \\ge \\beta = 4$, the branch is pruned: it can never reach $7$, so the second child is irrelevant.`
    }
  ],

  /* ============================================================= */
  "ai-expectimax": [
    {
      title: `Backgammon move under dice`,
      domain: `Dice games`,
      question: `Which move has the higher expected value when dice decide the outcome?`,
      steps: [
        { title: `The data`, body: `<p>Two moves. Move A leads to a chance node: $0.5$ value $8$, $0.5$ value $4$. Move B: $0.5$ value $5$, $0.5$ value $5$.</p>` },
        { title: `The math`, body: `<p>At a chance node, $V = \\sum_a \\pi(a)\\,V(\\text{Succ})$ — average the outcomes. At your node take the max over moves.</p>` },
        { title: `Run it`, body: `<p>Average each move's dice outcomes, then maximize.</p>`,
          code: `A = 0.5*8 + 0.5*4\nB = 0.5*5 + 0.5*5\nprint(\"E[A]=%.1f E[B]=%.1f -> pick %s value %.1f\" %\n      (A, B, 'A' if A > B else 'B', max(A, B)))`,
          output: `E[A]=6.0 E[B]=5.0 -> pick A value 6.0` }
      ],
      conclusion: `Move A averages $6.0$ versus B's $5.0$, so you pick A — even though B is "safe", A's expected value is higher under random dice.`
    },
    {
      title: `Expectimax vs minimax`,
      domain: `Games / theory`,
      question: `For a coin-flip outcome of 10 or 0, how do the two methods differ?`,
      steps: [
        { title: `The data`, body: `<p>A chance node: outcome $10$ or $0$, each with probability $0.5$.</p>` },
        { title: `The math`, body: `<p>Expectimax averages: $0.5\\times10 + 0.5\\times0$. Minimax assumes the worst: $\\min(10, 0)$. They disagree because one expects randomness, the other expects malice.</p>` },
        { title: `Run it`, body: `<p>Compute both and compare.</p>`,
          code: `em = 0.5*10 + 0.5*0\nmm = min(10, 0)\nprint(\"expectimax=%.1f minimax(worst)=%.1f\" % (em, mm))`,
          output: `expectimax=5.0 minimax(worst)=0.0` }
      ],
      conclusion: `Expectimax values the node at $5.0$; minimax at $0.0$. Treating a coin flip as a perfect adversary throws away the upside — use expectimax when "the other side" is chance.`
    },
    {
      title: `Pac-Man facing a random ghost`,
      domain: `Video games`,
      question: `Take a risky path past a random ghost, or grab a safe pellet?`,
      steps: [
        { title: `The data`, body: `<p>Risky path past a random ghost: $0.5$ caught (value $-1$), $0.5$ escape (value $+4$). Safe path: a pellet worth $+2$ for certain.</p>` },
        { title: `The math`, body: `<p>The ghost is a chance node: $V_{\\text{risky}} = 0.5\\times(-1) + 0.5\\times4$. Compare to the deterministic safe value, then take the max.</p>` },
        { title: `Run it`, body: `<p>Average the risky outcomes and compare to the pellet.</p>`,
          code: `risky = 0.5*(-1) + 0.5*4\nsafe = 2\nprint(\"E[risky]=%.1f safe=%.1f -> %s\" %\n      (risky, safe, \"risky\" if risky > safe else \"safe\"))`,
          output: `E[risky]=1.5 safe=2.0 -> safe` }
      ],
      conclusion: `The risky path averages only $1.5$ versus the pellet's $2.0$, so the safe move wins. Expectimax weighs the $50\\%$ chance of getting caught instead of assuming the worst.`
    }
  ],

  /* ============================================================= */
  "ai-csp": [
    {
      title: `Map coloring as factors`,
      domain: `Cartography`,
      question: `Which colorings of two neighboring regions are valid?`,
      steps: [
        { title: `The data`, body: `<p>Two neighboring regions R1, R2, each colored Red or Blue. One rule: neighbors must differ. The "differ" factor returns $1$ if they differ, $0$ if same.</p>` },
        { title: `The math`, body: `<p>$\\text{Weight}(x) = \\prod_j f_j(x)$. A hard constraint is a $0/1$ factor; any broken rule multiplies in a $0$, killing the assignment.</p>` },
        { title: `Run it`, body: `<p>Enumerate all colorings and compute each weight.</p>`,
          code: `def differ(a, b): return 1 if a != b else 0\nfor r1 in [\"Red\", \"Blue\"]:\n    for r2 in [\"Red\", \"Blue\"]:\n        w = differ(r1, r2)\n        print(\"R1=%s R2=%s weight=%d %s\" %\n              (r1, r2, w, \"valid\" if w > 0 else \"invalid\"))`,
          output: `R1=Red R2=Red weight=0 invalid\nR1=Red R2=Blue weight=1 valid\nR1=Blue R2=Red weight=1 valid\nR1=Blue R2=Blue weight=0 invalid` }
      ],
      conclusion: `Only the two colorings where R1 and R2 differ have weight $1$ (valid); matching colors give weight $0$. The product of factors cleanly separates legal from illegal.`
    },
    {
      title: `Counting valid seating arrangements`,
      domain: `Event planning`,
      question: `How many ways to seat A, B, C in 2 sections so adjacent guests differ?`,
      steps: [
        { title: `The data`, body: `<p>Three guests A, B, C, each assigned a section ($1$ or $2$). Constraints: A and B must differ; B and C must differ. Two factors, each $0/1$.</p>` },
        { title: `The math`, body: `<p>An assignment is valid only if $\\text{Weight}(x) = f_{AB}\\times f_{BC} = 1$, i.e. both "differ" rules hold. Count those.</p>` },
        { title: `Run it`, body: `<p>Enumerate all assignments and keep the weight-1 ones.</p>`,
          code: `from itertools import product\nsections = [1, 2]\nvalid = 0\nfor a, b, c in product(sections, repeat=3):\n    f1 = 1 if a != b else 0\n    f2 = 1 if b != c else 0\n    if f1 * f2 > 0: valid += 1\nprint(\"valid seatings (adjacent differ) =\", valid)`,
          output: `valid seatings (adjacent differ) = 2` }
      ],
      conclusion: `Exactly $2$ of the $8$ assignments satisfy both constraints (1-2-1 and 2-1-2). Every other arrangement multiplies in a $0$ from a broken rule.`
    },
    {
      title: `A Sudoku cell's constraints`,
      domain: `Puzzles`,
      question: `Which digit can fill a cell given its row, column, and box?`,
      steps: [
        { title: `The data`, body: `<p>A cell whose row already contains $\\{1,2,3\\}$, column contains $\\{4,5\\}$, and box contains $\\{6,7,8\\}$. Domain is digits $1$-$9$. Each "all-different" group is a set of factors.</p>` },
        { title: `The math`, body: `<p>A digit is valid only if every all-different factor stays satisfied — equivalently, the digit is not already used in its row, column, or box. The product of factors is $1$ for exactly the allowed digits.</p>` },
        { title: `Run it`, body: `<p>Subtract the used digits from the domain.</p>`,
          code: `domain = set(range(1, 10))\nrow = {1, 2, 3}; col = {4, 5}; box = {6, 7, 8}\nallowed = sorted(domain - row - col - box)\nprint(\"used:\", sorted(row | col | box))\nprint(\"allowed digits:\", allowed)`,
          output: `used: [1, 2, 3, 4, 5, 6, 7, 8]\nallowed digits: [9]` }
      ],
      conclusion: `Only digit $9$ keeps every all-different factor at $1$, so the cell is forced to $9$. Each Sudoku constraint is just a "must all differ" group of factors.`
    }
  ],

  /* ============================================================= */
  "ai-csp-search": [
    {
      title: `Coloring a map with backtracking`,
      domain: `Cartography`,
      question: `Can we 3-color the Australia map so neighbors differ?`,
      steps: [
        { title: `The data`, body: `<p>Regions WA, NT, SA, Q, NSW, V, T with their adjacency. Domain = $\\{$R, G, B$\\}$. Constraint: adjacent regions differ.</p>` },
        { title: `The math`, body: `<p>Backtracking assigns one region at a time, checks the "differ" constraint against assigned neighbors, and undoes a choice the moment no color fits.</p>` },
        { title: `Run it`, body: `<p>Recursive backtracking finds a consistent coloring.</p>`,
          code: `neighbors = {\n  'WA': ['NT','SA'], 'NT': ['WA','SA','Q'],\n  'SA': ['WA','NT','Q','NSW','V'], 'Q': ['NT','SA','NSW'],\n  'NSW': ['SA','Q','V'], 'V': ['SA','NSW'], 'T': []}\ncolors = ['R','G','B']; order = ['WA','NT','SA','Q','NSW','V','T']\nassign = {}\ndef ok(var, col): return all(assign.get(n) != col for n in neighbors[var])\ndef bt(i):\n    if i == len(order): return True\n    v = order[i]\n    for col in colors:\n        if ok(v, col):\n            assign[v] = col\n            if bt(i+1): return True\n            del assign[v]\n    return False\nbt(0)\nprint(\"coloring:\", dict(sorted(assign.items())))\nconflicts = sum(1 for v in neighbors for n in neighbors[v]\n                if assign[v] == assign[n]) // 2\nprint(\"conflicts =\", conflicts)`,
          output: `coloring: {'NSW': 'G', 'NT': 'G', 'Q': 'R', 'SA': 'B', 'T': 'R', 'V': 'R', 'WA': 'R'}\nconflicts = 0` }
      ],
      conclusion: `Backtracking finds a valid 3-coloring with $0$ conflicts — every pair of neighbors gets different colors, e.g. SA (blue) differs from all five of its neighbors.`
    },
    {
      title: `Scheduling exams into time slots`,
      domain: `University scheduling`,
      question: `Can 4 exams with shared students fit into 2 slots?`,
      steps: [
        { title: `The data`, body: `<p>Exams Math, Phys, Chem, Bio. Conflicting pairs (shared students, must differ): Math-Phys, Phys-Chem, Chem-Bio, Math-Bio. Domain = $\\{$slot 1, slot 2$\\}$.</p>` },
        { title: `The math`, body: `<p>This is graph coloring: exams are variables, conflicts are edges, slots are colors. Backtracking assigns slots and backs up on any clash. The conflict graph is a 4-cycle, which is 2-colorable.</p>` },
        { title: `Run it`, body: `<p>Backtrack over exams, respecting the "differ" constraints.</p>`,
          code: `conflict_pairs = [('Math','Phys'),('Phys','Chem'),('Chem','Bio'),('Math','Bio')]\nexams = ['Math','Phys','Chem','Bio']\nadj = {e: [] for e in exams}\nfor a, b in conflict_pairs: adj[a].append(b); adj[b].append(a)\nslots = [1, 2]; sched = {}\ndef ok(e, s): return all(sched.get(n) != s for n in adj[e])\ndef bt(i):\n    if i == len(exams): return True\n    e = exams[i]\n    for s in slots:\n        if ok(e, s):\n            sched[e] = s\n            if bt(i+1): return True\n            del sched[e]\n    return False\nfound = bt(0)\nprint(\"schedule found:\", found, dict(sorted(sched.items())))`,
          output: `schedule found: True {'Bio': 2, 'Chem': 1, 'Math': 1, 'Phys': 2}` }
      ],
      conclusion: `A valid schedule exists: Math and Chem in slot 1, Phys and Bio in slot 2 — no two conflicting exams share a slot.`
    },
    {
      title: `Forward checking shrinks a domain`,
      domain: `Puzzles / planning`,
      question: `After assigning A = Red, what is left in a neighbor's domain?`,
      steps: [
        { title: `The data`, body: `<p>Region A is a neighbor of B. Both start with domain $\\{$Red, Green, Blue$\\}$. We assign A = Red.</p>` },
        { title: `The math`, body: `<p>Forward checking removes the just-used value from each unassigned neighbor's domain. If a domain hits one value, the most-constrained-variable heuristic assigns it next; if it empties, backtrack.</p>` },
        { title: `Run it`, body: `<p>Assign A and prune B's domain.</p>`,
          code: `domB = {\"Red\", \"Green\", \"Blue\"}\nA_color = \"Red\"\ndomB.discard(A_color)         # forward checking on neighbor B\nprint(\"B domain after A=Red:\", sorted(domB))\n# suppose another neighbor also rules out Green\ndomB.discard(\"Green\")\nprint(\"B domain after second prune:\", sorted(domB))\nprint(\"most-constrained -> assign B =\", next(iter(domB)) if len(domB)==1 else \"(still choices)\")`,
          output: `B domain after A=Red: ['Blue', 'Green']\nB domain after second prune: ['Blue']\nmost-constrained -> assign B = Blue` }
      ],
      conclusion: `Forward checking trims B to $\\{$Green, Blue$\\}$, then to $\\{$Blue$\\}$. With one value left, B is the most-constrained variable and is assigned Blue next — pruning before exploring.`
    }
  ],

  /* ============================================================= */
  "ai-bayes-net": [
    {
      title: `The sprinkler network`,
      domain: `Everyday reasoning`,
      question: `What is the joint probability that it rained, the sprinkler was off, and the grass is wet?`,
      steps: [
        { title: `The data`, body: `<p>DAG: Rain → WetGrass ← Sprinkler. $P(\\text{Rain})=0.3$, $P(\\text{Sprinkler})=0.4$. The CPT gives $P(\\text{Wet}\\mid r,s)$: e.g. $P(\\text{Wet}\\mid \\text{Rain},\\,\\lnot\\text{Spr})=0.9$.</p>` },
        { title: `The math`, body: `<p>The joint factors as $P(R)\\,P(S)\\,P(W\\mid R,S)$ — one term per node given its parents. We want $P(R{=}T,\\,S{=}F,\\,W{=}T)$.</p>` },
        { title: `Run it`, body: `<p>Multiply the three factors.</p>`,
          code: `pRain = 0.3; pSpr = 0.4\ndef pWet(r, s):\n    return {(1,1): 0.99, (1,0): 0.9, (0,1): 0.8, (0,0): 0.05}[(r, s)]\nr, s, w = 1, 0, 1\njoint = pRain * (1 - pSpr) * pWet(r, s)\nprint(\"P(Rain=T,Spr=F,Wet=T) = %.4f\" % joint)`,
          output: `P(Rain=T,Spr=F,Wet=T) = 0.1620` }
      ],
      conclusion: `The joint is $0.3 \\times 0.6 \\times 0.9 = 0.1620$. The graph told us exactly which three conditional probabilities to multiply, instead of a full $2^3$ table.`
    },
    {
      title: `Marginal chance the grass is wet`,
      domain: `Everyday reasoning`,
      question: `Across all weather and sprinkler states, how likely is wet grass?`,
      steps: [
        { title: `The data`, body: `<p>Same sprinkler network and CPT. Now we ignore the causes and ask for $P(\\text{Wet}=T)$ overall.</p>` },
        { title: `The math`, body: `<p>Sum the joint over the parents: $P(W) = \\sum_{r,s} P(r)\\,P(s)\\,P(W\\mid r,s)$. This marginalizes out Rain and Sprinkler.</p>` },
        { title: `Run it`, body: `<p>Sum over all four parent combinations.</p>`,
          code: `pRain = 0.3; pSpr = 0.4\ndef pWet(r, s):\n    return {(1,1): 0.99, (1,0): 0.9, (0,1): 0.8, (0,0): 0.05}[(r, s)]\ntotal = 0\nfor r in (0, 1):\n    for s in (0, 1):\n        pr = pRain if r else 1 - pRain\n        ps = pSpr if s else 1 - pSpr\n        total += pr * ps * pWet(r, s)\nprint(\"P(Wet=T) = %.4f\" % total)`,
          output: `P(Wet=T) = 0.5258` }
      ],
      conclusion: `Marginalizing over both causes gives $P(\\text{Wet}=T) = 0.5258$. The network lets us compute this by summing four small products rather than enumerating a giant joint table.`
    },
    {
      title: `A diagnostic test network`,
      domain: `Medical diagnosis`,
      question: `What are the joint probabilities of disease and a positive test?`,
      steps: [
        { title: `The data`, body: `<p>DAG: Disease → Test. $P(\\text{Disease})=0.1$, $P(+\\mid \\text{Disease})=0.9$ (sensitivity), $P(+\\mid \\lnot\\text{Disease})=0.2$ (false-positive rate).</p>` },
        { title: `The math`, body: `<p>Joint $P(D, +) = P(D)\\,P(+\\mid D)$. Compute it for both disease states to see how the positive test splits between true and false positives.</p>` },
        { title: `Run it`, body: `<p>Multiply prior by likelihood for each disease state.</p>`,
          code: `pD = 0.1; sens = 0.9; fpr = 0.2\nprint(\"P(D=T, Test=+) = %.4f\" % (pD * sens))\nprint(\"P(D=F, Test=+) = %.4f\" % ((1 - pD) * fpr))`,
          output: `P(D=T, Test=+) = 0.0900\nP(D=F, Test=+) = 0.1800` }
      ],
      conclusion: `A positive test comes from a true case with probability $0.09$ but from a false alarm with probability $0.18$ — twice as often. The network exposes why a positive test alone is weak evidence.`
    }
  ],

  /* ============================================================= */
  "ai-bayes-inference": [
    {
      title: `Diagnosing after a positive test`,
      domain: `Medical diagnosis`,
      question: `Given a positive test, how likely is each of Flu, Cold, or Healthy?`,
      steps: [
        { title: `The data`, body: `<p>Priors $P(H) = [0.20, 0.30, 0.50]$ for Flu, Cold, Healthy. Test likelihoods $P(+\\mid H) = [0.90, 0.50, 0.10]$.</p>` },
        { title: `The math`, body: `<p>Bayes: posterior $\\propto$ prior $\\times$ likelihood, normalized by the evidence $P(+) = \\sum_H P(H)P(+\\mid H)$.</p>` },
        { title: `Run it`, body: `<p>Multiply, sum for evidence, normalize.</p>`,
          code: `import numpy as np\nhyps = [\"Flu\", \"Cold\", \"Healthy\"]\nprior = np.array([0.20, 0.30, 0.50])\nlike  = np.array([0.90, 0.50, 0.10])   # P(+test | H)\njoint = prior * like\npost = joint / joint.sum()\nprint(\"evidence P(+) = %.3f\" % joint.sum())\nfor h, p in zip(hyps, post):\n    print(\"  P(%s | +) = %.3f\" % (h, p))`,
          output: `evidence P(+) = 0.380\n  P(Flu | +) = 0.474\n  P(Cold | +) = 0.395\n  P(Healthy | +) = 0.132` }
      ],
      conclusion: `The positive test shifts belief toward illness: Flu jumps from $0.20$ to $0.474$ and Healthy falls from $0.50$ to $0.132$. Flu is now the leading hypothesis.`
    },
    {
      title: `Explaining away a burglar alarm`,
      domain: `Home security`,
      question: `Once an earthquake is confirmed, does a burglary become more or less likely?`,
      steps: [
        { title: `The data`, body: `<p>Alarm has two causes: Burglary ($P=0.001$) and Earthquake ($P=0.002$). The CPT $P(\\text{Alarm}\\mid B,E)$ ranges from $0.95$ (both) to $0.001$ (neither).</p>` },
        { title: `The math`, body: `<p>Compute $P(B\\mid \\text{Alarm})$ by summing out E, then $P(B\\mid \\text{Alarm}, \\text{Earthquake})$ by fixing E true. If the second is lower, that is "explaining away".</p>` },
        { title: `Run it`, body: `<p>Normalize the relevant joints for each evidence set.</p>`,
          code: `pB = 0.001; pE = 0.002\ndef pAlarm(b, e):\n    return {(1,1): 0.95, (1,0): 0.94, (0,1): 0.29, (0,0): 0.001}[(b, e)]\ndef post_b(evidence_quake=None):\n    num = den = 0\n    for b in (0, 1):\n        for e in (0, 1):\n            if evidence_quake is not None and e != evidence_quake: continue\n            pb = pB if b else 1 - pB\n            pe = pE if e else 1 - pE\n            jp = pb * pe * pAlarm(b, e)\n            den += jp\n            if b == 1: num += jp\n    return num / den\nprint(\"P(Burglary | Alarm)             = %.4f\" % post_b())\nprint(\"P(Burglary | Alarm, Earthquake) = %.4f\" % post_b(evidence_quake=1))`,
          output: `P(Burglary | Alarm)             = 0.3736\nP(Burglary | Alarm, Earthquake) = 0.0033` }
      ],
      conclusion: `Hearing the alarm makes burglary likely ($0.374$), but confirming the earthquake drops it to $0.0033$ — the quake already explains the alarm. This is "explaining away".`
    },
    {
      title: `Spam given a trigger word`,
      domain: `Email filtering`,
      question: `An email contains "free". What is the chance it is spam?`,
      steps: [
        { title: `The data`, body: `<p>Prior $P(\\text{spam}) = 0.4$. Likelihoods: $P(\\text{"free"}\\mid \\text{spam}) = 0.8$, $P(\\text{"free"}\\mid \\text{ham}) = 0.1$.</p>` },
        { title: `The math`, body: `<p>Posterior $P(\\text{spam}\\mid \\text{"free"}) = \\dfrac{P(\\text{spam})P(\\text{"free"}\\mid \\text{spam})}{P(\\text{"free"})}$, with $P(\\text{"free"})$ summed over spam and ham.</p>` },
        { title: `Run it`, body: `<p>Apply Bayes' rule.</p>`,
          code: `pS = 0.4\nnum = pS * 0.8\nden = pS * 0.8 + (1 - pS) * 0.1\nprint(\"P(spam | 'free') = %.3f\" % (num / den))`,
          output: `P(spam | 'free') = 0.842` }
      ],
      conclusion: `Seeing "free" lifts the spam probability from $0.40$ to $0.842$ — the word is over three times more common in spam, so it is strong evidence.`
    }
  ],

  /* ============================================================= */
  "ai-hmm": [
    {
      title: `Inferring weather from umbrellas`,
      domain: `Time-series inference`,
      question: `After watching umbrella use for 4 days, how likely is it Rainy?`,
      steps: [
        { title: `The data`, body: `<p>Hidden state Rainy/Sunny, persistence $P(\\text{stay})=0.7$. Emission $P(\\text{Umbrella}\\mid \\text{Rainy})=0.9$, $P(\\text{Umbrella}\\mid \\text{Sunny})=0.2$. Observations: U, U, N, U.</p>` },
        { title: `The math`, body: `<p>The forward (filtering) update: predict via transitions, then reweight by the emission, then normalize. $b_t \\propto e(o_t)\\odot(T^\\top b_{t-1})$.</p>` },
        { title: `Run it`, body: `<p>Run the forward pass over the four observations.</p>`,
          code: `import numpy as np\nTrans = np.array([[0.7, 0.3], [0.3, 0.7]])   # stay 0.7\nemit_umb = np.array([0.9, 0.2]); emit_no = np.array([0.1, 0.8])\nobs = [\"U\", \"U\", \"N\", \"U\"]\nbelief = np.array([0.5, 0.5])\nfor t, o in enumerate(obs):\n    pred = belief if t == 0 else Trans.T @ belief\n    e = emit_umb if o == \"U\" else emit_no\n    w = pred * e; belief = w / w.sum()\n    print(\"t%d obs=%s -> P(Rainy)=%.3f P(Sunny)=%.3f\" %\n          (t+1, o, belief[0], belief[1]))`,
          output: `t1 obs=U -> P(Rainy)=0.818 P(Sunny)=0.182\nt2 obs=U -> P(Rainy)=0.883 P(Sunny)=0.117\nt3 obs=N -> P(Rainy)=0.191 P(Sunny)=0.809\nt4 obs=U -> P(Rainy)=0.731 P(Sunny)=0.269` }
      ],
      conclusion: `Two umbrellas push P(Rainy) to $0.883$; a no-umbrella day flips belief to Sunny ($0.809$); the next umbrella swings it back to $0.731$ Rainy. Each clue updates the hidden-state belief.`
    },
    {
      title: `Localizing a robot in a corridor`,
      domain: `Robotics`,
      question: `Where is the robot after three noisy door readings?`,
      steps: [
        { title: `The data`, body: `<p>A 4-cell corridor; the robot moves right each step. Doors are at cells $1$ and $3$. A noisy sensor reports door/no-door with $90\\%$ reliability. Observations: door, no-door, door.</p>` },
        { title: `The math`, body: `<p>HMM filtering: the transition shifts belief right; the emission reweights by sensor agreement. Belief concentrates where the readings match the door map.</p>` },
        { title: `Run it`, body: `<p>Run the forward pass with a right-shift transition.</p>`,
          code: `import numpy as np\nN = 4\nT = np.zeros((N, N))\nfor i in range(N): T[i, min(i+1, N-1)] = 1.0   # move right\ndoor = np.array([0, 1, 0, 1])                   # cells with doors\ndef emit(obs_door):\n    return np.array([0.9 if (d == 1) == (obs_door == 1) else 0.1 for d in door])\nbel = np.ones(N) / N\nfor t, o in enumerate([1, 0, 1]):               # door, no-door, door\n    if t > 0: bel = T.T @ bel\n    bel = bel * emit(o); bel = bel / bel.sum()\n    print(\"after obs %d -> \" % (t+1), [round(x, 3) for x in bel])`,
          output: `after obs 1 ->  [0.05, 0.45, 0.05, 0.45]\nafter obs 2 ->  [0.0, 0.011, 0.88, 0.109]\nafter obs 3 ->  [0.0, 0.0, 0.001, 0.999]` }
      ],
      conclusion: `Belief sharpens from uniform to $0.999$ on cell $3$. The door-then-no-door-then-door sequence is consistent only with the path ending at cell $3$ — the robot has localized itself.`
    },
    {
      title: `One filtering step by hand`,
      domain: `Time-series inference`,
      question: `Starting from 50/50, what is the belief after one umbrella sighting?`,
      steps: [
        { title: `The data`, body: `<p>Prior belief $P(\\text{Rainy})=P(\\text{Sunny})=0.5$. First observation is an umbrella. Emissions: $P(\\text{Umb}\\mid \\text{Rainy})=0.9$, $P(\\text{Umb}\\mid \\text{Sunny})=0.2$.</p>` },
        { title: `The math`, body: `<p>The first step has no transition: just reweight the prior by the emission and normalize. $b \\propto [0.5\\times0.9,\\; 0.5\\times0.2]$.</p>` },
        { title: `Run it`, body: `<p>Weight and normalize the two-state belief.</p>`,
          code: `prior = [0.5, 0.5]\nemit = [0.9, 0.2]   # P(Umbrella | Rainy), P(Umbrella | Sunny)\nw = [prior[i] * emit[i] for i in range(2)]\nz = sum(w)\nbelief = [round(wi / z, 3) for wi in w]\nprint(\"P(Rainy)=%.3f P(Sunny)=%.3f\" % (belief[0], belief[1]))`,
          output: `P(Rainy)=0.818 P(Sunny)=0.182` }
      ],
      conclusion: `One umbrella lifts P(Rainy) from $0.5$ to $0.818$. The emission alone, normalized, gives the first belief — the seed for all later forward steps.`
    }
  ],

  /* ============================================================= */
  "ai-propositional-logic": [
    {
      title: `Does wet-ground follow from rain?`,
      domain: `Automated reasoning`,
      question: `Given "it is raining" and "rain implies wet", is wet entailed?`,
      steps: [
        { title: `The data`, body: `<p>Knowledge base: $R$ (raining) and $R \\rightarrow W$ (rain implies wet ground). Query: $W$. Symbols $R, W$ each true or false.</p>` },
        { title: `The math`, body: `<p>KB $\\models W$ iff $W$ is true in <i>every</i> model where the KB is true. Check all $4$ truth assignments; if any KB-true model has $W$ false, entailment fails.</p>` },
        { title: `Run it`, body: `<p>Enumerate all models and test entailment.</p>`,
          code: `from itertools import product\nsyms = ['R', 'W']\ndef kb(m): return m['R'] and ((not m['R']) or m['W'])\ndef query(m): return m['W']\nentails = True\nfor vals in product([False, True], repeat=2):\n    m = dict(zip(syms, vals))\n    if kb(m) and not query(m): entails = False\nprint(\"KB |= W ?\", entails)`,
          output: `KB |= W ? True` }
      ],
      conclusion: `KB $\\models W$ is True: in every model where both $R$ and $R\\rightarrow W$ hold, $W$ is forced true. The ground must be wet.`
    },
    {
      title: `Checking an access-control rule`,
      domain: `Security / authorization`,
      question: `If a user is a verified member (not an admin), can they edit?`,
      steps: [
        { title: `The data`, body: `<p>Rule: $\\text{CanEdit} \\leftrightarrow \\text{Admin} \\lor (\\text{Member} \\land \\text{Verified})$. Facts: Member and Verified true, Admin false. Query: CanEdit.</p>` },
        { title: `The math`, body: `<p>Entailment again: in every model consistent with the rule and the facts, is CanEdit true? Enumerate the $2^4$ models and check.</p>` },
        { title: `Run it`, body: `<p>Filter models by the rule and facts, confirm CanEdit always holds.</p>`,
          code: `from itertools import product\nsyms = ['Admin', 'Member', 'Verified', 'CanEdit']\ndef kb(m):\n    rule = m['CanEdit'] == (m['Admin'] or (m['Member'] and m['Verified']))\n    return rule and m['Member'] and m['Verified'] and (not m['Admin'])\nent = all(m['CanEdit']\n          for vals in product([False, True], repeat=4)\n          for m in [dict(zip(syms, vals))] if kb(m))\nprint(\"Member & Verified, not Admin  =>  CanEdit entailed?\", ent)`,
          output: `Member & Verified, not Admin  =>  CanEdit entailed? True` }
      ],
      conclusion: `CanEdit is entailed: a verified member satisfies the right side of the rule, so edit access follows even without admin rights.`
    },
    {
      title: `An XOR gate from AND/OR/NOT`,
      domain: `Digital circuits`,
      question: `What is the truth table of XOR built from basic connectives?`,
      steps: [
        { title: `The data`, body: `<p>Two inputs $A, B$. We build XOR as $(A \\land \\lnot B) \\lor (B \\land \\lnot A)$ using only AND, OR, NOT gates.</p>` },
        { title: `The math`, body: `<p>A truth table lists every model (combination of inputs) and the sentence's value. XOR should be true exactly when the inputs differ.</p>` },
        { title: `Run it`, body: `<p>Evaluate the expression over all four input rows.</p>`,
          code: `print(\"A B | A XOR B\")\nfor A in (0, 1):\n    for B in (0, 1):\n        x = (A and not B) or (B and not A)\n        print(\" %d %d |   %d\" % (A, B, int(x)))`,
          output: `A B | A XOR B\n 0 0 |   0\n 0 1 |   1\n 1 0 |   1\n 1 1 |   0` }
      ],
      conclusion: `The table shows XOR is true exactly on the differing rows (0,1) and (1,0) — the connectives AND, OR, NOT compose into any logic gate.`
    }
  ],

  /* ============================================================= */
  "ai-inference-rules": [
    {
      title: `Forward chaining a diagnosis`,
      domain: `Expert systems`,
      question: `From "it rained" and "it is cold", what conditions can we derive?`,
      steps: [
        { title: `The data`, body: `<p>Horn rules: Rain→Wet, Sprinkler→Wet, Wet→Slippery, (Wet ∧ Cold)→Ice. Seed facts: Rain, Cold.</p>` },
        { title: `The math`, body: `<p>Modus ponens: when every premise of a rule is known, add its conclusion. Repeat until no new fact appears (the KB is saturated).</p>` },
        { title: `Run it`, body: `<p>Apply rules in rounds until nothing new fires.</p>`,
          code: `rules = [([\"Rain\"], \"Wet\"), ([\"Sprinkler\"], \"Wet\"),\n         ([\"Wet\"], \"Slippery\"), ([\"Wet\", \"Cold\"], \"Ice\")]\nknown = set([\"Rain\", \"Cold\"])\nchanged = True; rounds = 0\nwhile changed:\n    changed = False; rounds += 1\n    for pre, con in rules:\n        if con not in known and all(p in known for p in pre):\n            known.add(con); changed = True\n            print(\"round %d: fired %s -> %s\" % (rounds, \"&\".join(pre), con))\nprint(\"final known facts:\", sorted(known))`,
          output: `round 1: fired Rain -> Wet\nround 1: fired Wet -> Slippery\nround 1: fired Wet&Cold -> Ice\nfinal known facts: ['Cold', 'Ice', 'Rain', 'Slippery', 'Wet']` }
      ],
      conclusion: `Modus ponens cascades from Rain and Cold to derive Wet, Slippery, and Ice. Forward chaining mechanically produces every entailed fact, no truth table needed.`
    },
    {
      title: `Reasoning over a taxonomy`,
      domain: `Knowledge graphs`,
      question: `From "Socrates is human", what properties follow?`,
      steps: [
        { title: `The data`, body: `<p>Rules: Human→Mortal, Human→Thinker, Mortal→Finite. Seed: Human (Socrates is human).</p>` },
        { title: `The math`, body: `<p>Each rule fires by modus ponens once its premise is known. Conclusions chain: Human gives Mortal, which gives Finite.</p>` },
        { title: `Run it`, body: `<p>Saturate the knowledge base.</p>`,
          code: `rules = [([\"Human\"], \"Mortal\"), ([\"Human\"], \"Thinker\"),\n         ([\"Mortal\"], \"Finite\")]\nknown = set([\"Human\"])\nchanged = True\nwhile changed:\n    changed = False\n    for pre, con in rules:\n        if con not in known and all(p in known for p in pre):\n            known.add(con); changed = True\nprint(\"derived:\", sorted(known))`,
          output: `derived: ['Finite', 'Human', 'Mortal', 'Thinker']` }
      ],
      conclusion: `From the single fact Human, chaining derives Mortal, Thinker, and Finite. The classic syllogism "Socrates is mortal" falls out of one modus ponens step.`
    },
    {
      title: `A loan-approval rule engine`,
      domain: `Business rules`,
      question: `Does an applicant with good credit, income, and no fraud get approved?`,
      steps: [
        { title: `The data`, body: `<p>Rules: (GoodCredit ∧ HasIncome)→Eligible, (Eligible ∧ NoFraud)→Approve. Seed facts: GoodCredit, HasIncome, NoFraud.</p>` },
        { title: `The math`, body: `<p>Forward chaining fires the first rule to derive Eligible, then the second to derive Approve. The conclusion of one rule becomes the premise of the next.</p>` },
        { title: `Run it`, body: `<p>Run the rule engine to fixpoint.</p>`,
          code: `rules = [([\"GoodCredit\", \"HasIncome\"], \"Eligible\"),\n         ([\"Eligible\", \"NoFraud\"], \"Approve\")]\nknown = set([\"GoodCredit\", \"HasIncome\", \"NoFraud\"])\nchanged = True\nwhile changed:\n    changed = False\n    for pre, con in rules:\n        if con not in known and all(p in known for p in pre):\n            known.add(con); changed = True\nprint(\"Approve derived?\", \"Approve\" in known, \"| facts:\", sorted(known))`,
          output: `Approve derived? True | facts: ['Approve', 'Eligible', 'GoodCredit', 'HasIncome', 'NoFraud']` }
      ],
      conclusion: `The engine derives Eligible, then Approve — the applicant is approved. Chained Horn rules let a machine reach guaranteed-correct decisions automatically.`
    }
  ]

});
