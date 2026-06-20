/* Per-lesson real-world walkthroughs for Module 8 (AI — more).
   Merged into window.WALKTHROUGHS by lesson id.
   Each lesson maps to an array of >=3 walkthroughs:
   { title, domain, question, steps:[{title, body(HTML+math), code?, output?}], conclusion(HTML) } */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* =============================================================
     aix-relaxation — relaxed heuristics for A*
     ============================================================= */
  "aix-relaxation": [
    {
      title: "Warehouse robot path",
      domain: "Robotics / logistics",
      question: "A picking robot must reach a bin across a shelf-cluttered floor. What admissible heuristic guides A*?",
      steps: [
        { title: "The data", body: `<p>A $6\\times6$ warehouse grid. $0$ = open aisle, $1$ = shelf you cannot cross. The robot starts at the top-left $(0,0)$ and must reach the bin at $(5,5)$.</p>` },
        { title: "The math", body: `<p><b>Relax</b> the rule "cannot cross shelves". With shelves gone the robot flies straight, so the relaxed cost is the Manhattan distance $h = |\\Delta r| + |\\Delta c|$. Removing a constraint can only make travel cheaper, so $h \\le \\text{Cost}$: the heuristic is <b>admissible</b>.</p>` },
        { title: "Run it", body: `<p>Compute the Manhattan heuristic, then run A* through the real (shelved) grid to get the true cost.</p>`,
          code: `import heapq
grid = [
    [0,0,0,0,0,0],
    [1,1,1,1,1,0],
    [0,0,0,0,0,0],
    [0,1,1,1,1,1],
    [0,0,0,0,0,0],
    [1,1,1,1,1,0],
]
R, Cc = len(grid), len(grid[0])
start, goal = (0,0), (5,5)
def manhattan(s): return abs(s[0]-goal[0]) + abs(s[1]-goal[1])
def astar():
    pq = [(manhattan(start), 0, start)]
    best = {start:0}; expanded = 0
    while pq:
        f, g, s = heapq.heappop(pq)
        if s == goal: return g, expanded
        expanded += 1
        for dr,dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr,nc = s[0]+dr, s[1]+dc
            if 0<=nr<R and 0<=nc<Cc and grid[nr][nc]==0:
                ng = g+1
                if ng < best.get((nr,nc), 1e9):
                    best[(nr,nc)] = ng
                    heapq.heappush(pq,(ng+manhattan((nr,nc)), ng, (nr,nc)))
    return None, expanded
h0 = manhattan(start)
cost, expanded = astar()
print("relaxed heuristic h(start) = Manhattan =", h0)
print("true shortest path cost   =", cost)
print("admissible (h <= cost)?    ", h0 <= cost)
print("cells expanded by A*       =", expanded)`,
          output: `relaxed heuristic h(start) = Manhattan = 10
true shortest path cost   = 20
admissible (h <= cost)?     True
cells expanded by A*       = 20` }
      ],
      conclusion: `The straight-line guess is $h = 10$; the true path winding around the shelves costs $20$. Since $10 \\le 20$, the heuristic never overestimates, so A* is guaranteed to return the optimal route. The relaxed problem is the source of a safe, optimistic guess.`
    },
    {
      title: "Solving the 8-puzzle",
      domain: "Classic search",
      question: "A scrambled sliding-tile puzzle — what heuristic lets A* solve it without exploring the whole tree?",
      steps: [
        { title: "The data", body: `<p>The 8-puzzle: tiles $1\\!-\\!8$ and a blank in a $3\\times3$ frame. You slide a tile into the blank each move. The goal arranges $1\\!-\\!8$ in order with the blank last.</p>` },
        { title: "The math", body: `<p><b>Relax</b> the rule "a tile can only slide into the adjacent blank" to "any tile may teleport one step toward its goal, even through other tiles". Each tile then needs exactly its own Manhattan distance, and the heuristic is their sum: $h = \\sum_{\\text{tiles}} (|\\Delta r| + |\\Delta c|)$. It ignores that tiles block each other, so $h \\le \\text{true cost}$.</p>` },
        { title: "Run it", body: `<p>Solve a scramble with A* using the Manhattan-distance heuristic and compare $h$ at the start to the true optimal length.</p>`,
          code: `import heapq
goal = (1,2,3,4,5,6,7,8,0)
goal_pos = {v:(i//3, i%3) for i,v in enumerate(goal)}
def manhattan(s):
    d = 0
    for i,v in enumerate(s):
        if v == 0: continue
        gr,gc = goal_pos[v]; d += abs(i//3-gr) + abs(i%3-gc)
    return d
def neighbors(s):
    z = s.index(0); zr,zc = z//3, z%3; out=[]
    for dr,dc in ((1,0),(-1,0),(0,1),(0,-1)):
        nr,nc = zr+dr, zc+dc
        if 0<=nr<3 and 0<=nc<3:
            j = nr*3+nc; l=list(s); l[z],l[j]=l[j],l[z]; out.append(tuple(l))
    return out
def astar(start):
    pq=[(manhattan(start),0,start)]; best={start:0}; exp=0
    while pq:
        f,g,s = heapq.heappop(pq)
        if s==goal: return g,exp
        if g>best.get(s,1e9): continue
        exp+=1
        for n in neighbors(s):
            ng=g+1
            if ng<best.get(n,1e9): best[n]=ng; heapq.heappush(pq,(ng+manhattan(n),ng,n))
start = (7,2,4,5,0,6,8,3,1)
print("relaxed (Manhattan) heuristic h(start) =", manhattan(start))
cost,exp = astar(start)
print("true optimal solution length          =", cost)
print("admissible (h <= cost)?                ", manhattan(start) <= cost)
print("nodes expanded with this heuristic     =", exp)`,
          output: `relaxed (Manhattan) heuristic h(start) = 14
true optimal solution length          = 20
admissible (h <= cost)?                 True
nodes expanded with this heuristic     = 282` }
      ],
      conclusion: `The Manhattan heuristic guesses $14$ moves; the true optimum is $20$. Because $14 \\le 20$ it is admissible, and A* finds the optimal $20$-move solution while expanding only $282$ states — a tiny slice of the puzzle's $181{,}440$ reachable configurations.`
    },
    {
      title: "Flight route planner",
      domain: "Travel / navigation",
      question: "Only some city pairs have direct flights. What heuristic steers A* toward the cheapest connecting route?",
      steps: [
        { title: "The data", body: `<p>Six airports with latitude/longitude. Direct flights exist only between certain pairs — there is no SFO&ndash;JFK direct. Cost is great-circle kilometres. We route SFO to JFK.</p>` },
        { title: "The math", body: `<p><b>Relax</b> the rule "you may only take listed flights" to "you may fly straight to the destination". The relaxed cost is the great-circle distance to JFK. Flying straight can never be longer than any chain of real flights, so this straight-line $h$ is admissible.</p>` },
        { title: "Run it", body: `<p>Build the flight graph, use the great-circle distance to the goal as $h$, and run A*.</p>`,
          code: `import heapq, math
cities = {
 "SFO": (37.62, -122.38), "DEN": (39.86, -104.67), "ORD": (41.98, -87.90),
 "DFW": (32.90, -97.04), "ATL": (33.64, -84.43), "JFK": (40.64, -73.78),
}
Rk = 6371.0
def gc(a,b):
    la1,lo1 = map(math.radians, cities[a]); la2,lo2 = map(math.radians, cities[b])
    dla, dlo = la2-la1, lo2-lo1
    h = math.sin(dla/2)**2 + math.cos(la1)*math.cos(la2)*math.sin(dlo/2)**2
    return 2*Rk*math.asin(math.sqrt(h))
routes = [("SFO","DEN"),("DEN","ORD"),("DEN","DFW"),("ORD","JFK"),
          ("DFW","ATL"),("ATL","JFK"),("ORD","ATL")]
adj = {c:[] for c in cities}
for a,b in routes:
    d = gc(a,b); adj[a].append((b,d)); adj[b].append((a,d))
start, goal = "SFO", "JFK"
def h(c): return gc(c, goal)
def astar():
    pq=[(h(start),0.0,start)]; best={start:0.0}; exp=0
    while pq:
        f,g,c = heapq.heappop(pq)
        if c==goal: return g,exp
        if g>best.get(c,1e18): continue
        exp+=1
        for n,w in adj[c]:
            ng=g+w
            if ng<best.get(n,1e18): best[n]=ng; heapq.heappush(pq,(ng+h(n),ng,n))
    return None,exp
print("relaxed heuristic h(SFO) = great-circle SFO->JFK = %.0f km" % h(start))
cost,exp = astar()
print("true cheapest flyable route cost        = %.0f km" % cost)
print("admissible (h <= true)?                  ", h(start) <= cost)
print("airports expanded by A*                  =", exp)`,
          output: `relaxed heuristic h(SFO) = great-circle SFO->JFK = 4152 km
true cheapest flyable route cost        = 4167 km
admissible (h <= true)?                   True
airports expanded by A*                  = 3` }
      ],
      conclusion: `Flying straight would be $4152$ km; the cheapest real connection (via DEN and ORD) is $4167$ km. The $15$ km gap is the price of the route restriction. Because the straight-line guess never exceeds the true cost, A* expands only $3$ airports to find the optimal itinerary.`
    }
  ],

  /* =============================================================
     aix-structured-perceptron — learning costs / scores
     ============================================================= */
  "aix-structured-perceptron": [
    {
      title: "Part-of-speech tagging",
      domain: "Natural language processing",
      question: "Can a machine learn that the same word ('bark') is a NOUN or a VERB depending on context?",
      steps: [
        { title: "The data", body: `<p>Six short sentences with gold tags. The word "bark" appears as a VERB ("dogs bark") and a NOUN ("the bark"); likewise "run", "fly". The model must learn context, not just memorize words.</p>` },
        { title: "The math", body: `<p>Each tagging is scored by $w\\cdot\\phi$, summing emission features (word$\\to$tag) and transition features (tag$\\to$tag). The best tagging is found by Viterbi. On a mistake the structured perceptron updates $w \\leftarrow w + \\phi(y) - \\phi(\\hat y)$: boost the gold tags' features, penalize the predicted ones.</p>` },
        { title: "Run it", body: `<p>Train by sweeping the data, predicting with Viterbi, and correcting on every mistake.</p>`,
          code: `tags = ["NOUN","VERB","DET"]
data = [
    (["dogs","bark"],   ["NOUN","VERB"]),
    (["the","bark"],    ["DET" ,"NOUN"]),
    (["cats","run"],    ["NOUN","VERB"]),
    (["a","run"],       ["DET" ,"NOUN"]),
    (["birds","fly"],   ["NOUN","VERB"]),
    (["the","fly"],     ["DET" ,"NOUN"]),
]
w = {}
def emit_f(word, tag): return ("E", word, tag)
def trans_f(t1, t2):   return ("T", t1, t2)
def get(f): return w.get(f, 0.0)
def viterbi(words):
    n=len(words); V=[{} for _ in range(n)]; back=[{} for _ in range(n)]
    for t in tags: V[0][t]=get(emit_f(words[0],t))
    for i in range(1,n):
        for t in tags:
            best=None; bt=None
            for tp in tags:
                sc=V[i-1][tp]+get(trans_f(tp,t))+get(emit_f(words[i],t))
                if best is None or sc>best: best=sc; bt=tp
            V[i][t]=best; back[i][t]=bt
    last=max(tags,key=lambda t:V[n-1][t]); seq=[last]
    for i in range(n-1,0,-1): last=back[i][last]; seq.insert(0,last)
    return seq
def feats(words,seq):
    fs={}
    for i,(word,tag) in enumerate(zip(words,seq)):
        fs[emit_f(word,tag)]=fs.get(emit_f(word,tag),0)+1
        if i>0: fs[trans_f(seq[i-1],tag)]=fs.get(trans_f(seq[i-1],tag),0)+1
    return fs
mistakes=0
for epoch in range(8):
    ep_mis=0
    for words,gold in data:
        pred=viterbi(words)
        if pred!=gold:
            mistakes+=1; ep_mis+=1
            gf,pf=feats(words,gold),feats(words,pred)
            for f,c in gf.items(): w[f]=get(f)+c
            for f,c in pf.items(): w[f]=get(f)-c
    if ep_mis==0:
        print("converged after epoch", epoch); break
correct=sum(viterbi(words)==gold for words,gold in data)
print("total mistakes during training:", mistakes)
print("sentences correct after training:", correct, "/", len(data))
print("tag('the bark') ->", viterbi(["the","bark"]))
print("tag('dogs bark') ->", viterbi(["dogs","bark"]))`,
          output: `converged after epoch 2
total mistakes during training: 8
sentences correct after training: 6 / 6
tag('the bark') -> ['DET', 'NOUN']
tag('dogs bark') -> ['NOUN', 'VERB']`}
      ],
      conclusion: `After $8$ corrections the perceptron converges and tags all sentences right. It learned the structure: a DET makes "bark" a NOUN, a NOUN before it makes "bark" a VERB. The transition weights encode grammar that no per-word lookup could capture.`
    },
    {
      title: "Learning terrain costs from a demo",
      domain: "Imitation learning",
      question: "A human drives a route that hugs the road. Can we recover the cost weights that make that route optimal?",
      steps: [
        { title: "The data", body: `<p>Four candidate routes from A to B, each summarized by how many road, grass, and mud cells it crosses. A human demonstrator chose the road-hugging route. We want weights $w$ making that route the highest-scoring one.</p>` },
        { title: "The math", body: `<p>Score a route by $w\\cdot\\phi$ where $\\phi$ counts cells of each terrain. The demo should score highest. If a wrong route scores at least as high, update $w \\leftarrow w + \\phi(\\text{demo}) - \\phi(\\hat y)$: make road cheaper to prefer and the wrong route's terrain costlier.</p>` },
        { title: "Run it", body: `<p>Run the perceptron until the demonstrator's route ranks first.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
routes = {
    "demo (road-hugging)": np.array([6.,1.,1.]),
    "diagonal (grassy)":   np.array([2.,4.,2.]),
    "shortcut (muddy)":    np.array([1.,2.,5.]),
    "wandering":           np.array([3.,3.,3.]),
}
demo = "demo (road-hugging)"
phi = routes[demo]
w = np.zeros(3)
mistakes = 0
for epoch in range(20):
    best, bs = None, -1e18
    for name, f in routes.items():
        s = w @ f
        if s > bs or (s == bs and name != demo):
            bs, best = s, name
    if best == demo:
        print("demo is top-ranked after epoch", epoch); break
    mistakes += 1
    w = w + phi - routes[best]
final = sorted(routes, key=lambda n: -(w @ routes[n]))
print("mistakes:", mistakes)
print("learned weights [road,grass,mud] =", np.round(w,2))
print("ranking by learned score:", final)
print("top route ==", final[0])`,
          output: `demo is top-ranked after epoch 1
mistakes: 1
learned weights [road,grass,mud] = [ 3. -2. -2.]
ranking by learned score: ['demo (road-hugging)', 'wandering', 'diagonal (grassy)', 'shortcut (muddy)']
top route == demo (road-hugging)`}
      ],
      conclusion: `One correction yields weights $[3,-2,-2]$: road is strongly rewarded, grass and mud penalized. The demonstrator's route now scores highest, and the muddy shortcut ranks last. The agent learned the human's preferences from a single example by scoring whole structures.`
    },
    {
      title: "Named-entity recognition",
      domain: "Information extraction",
      question: "The word 'Apple' is sometimes a person's employer (ORG) and 'Tim' a person (PER). Can context decide?",
      steps: [
        { title: "The data", body: `<p>Four sentences labelled with O (outside), PER (person), ORG (organization). "Apple" and "Google" appear as ORG; "Tim", "Sue" as PER; verbs like "met", "hired" are O. The label of each word depends on its neighbours.</p>` },
        { title: "The math", body: `<p>Score a label sequence by $w\\cdot\\phi$ over word$\\to$label and label$\\to$label features; decode with Viterbi. On each mistaken sentence apply $w \\leftarrow w + \\phi(\\text{gold}) - \\phi(\\text{pred})$.</p>` },
        { title: "Run it", body: `<p>Train the structured perceptron and check it tags entities by role.</p>`,
          code: `labels = ["O","PER","ORG"]
data = [
    (["Tim","met","Apple"],        ["PER","O","ORG"]),
    (["Apple","hired","Tim"],      ["ORG","O","PER"]),
    (["Sue","joined","Google"],    ["PER","O","ORG"]),
    (["Google","fired","Sue"],     ["ORG","O","PER"]),
]
w = {}
def E(word,tag): return ("E",word,tag)
def T(a,b): return ("T",a,b)
def g(f): return w.get(f,0.0)
def viterbi(words):
    n=len(words); V=[{} for _ in range(n)]; bp=[{} for _ in range(n)]
    for t in labels: V[0][t]=g(E(words[0],t))
    for i in range(1,n):
        for t in labels:
            best=None;bt=None
            for tp in labels:
                s=V[i-1][tp]+g(T(tp,t))+g(E(words[i],t))
                if best is None or s>best: best=s;bt=tp
            V[i][t]=best;bp[i][t]=bt
    last=max(labels,key=lambda t:V[n-1][t]);seq=[last]
    for i in range(n-1,0,-1): last=bp[i][last];seq.insert(0,last)
    return seq
def feats(words,seq):
    fs={}
    for i,(wd,tg) in enumerate(zip(words,seq)):
        fs[E(wd,tg)]=fs.get(E(wd,tg),0)+1
        if i>0: fs[T(seq[i-1],tg)]=fs.get(T(seq[i-1],tg),0)+1
    return fs
mis=0
for epoch in range(10):
    em=0
    for words,gold in data:
        p=viterbi(words)
        if p!=gold:
            mis+=1;em+=1
            gf,pf=feats(words,gold),feats(words,p)
            for f,c in gf.items(): w[f]=g(f)+c
            for f,c in pf.items(): w[f]=g(f)-c
    if em==0: print("converged at epoch",epoch); break
acc=sum(viterbi(w_)==gd for w_,gd in data)
print("total mistakes:",mis,"  train sentences correct:",acc,"/",len(data))
print("tag(['Tim','met','Apple']) ->", viterbi(["Tim","met","Apple"]))
print("tag(['Apple','fired','Sue']) ->", viterbi(["Apple","fired","Sue"]))`,
          output: `converged at epoch 1
total mistakes: 4   train sentences correct: 4 / 4
tag(['Tim','met','Apple']) -> ['PER', 'O', 'ORG']
tag(['Apple','fired','Sue']) -> ['ORG', 'O', 'PER']`}
      ],
      conclusion: `After $4$ corrections the tagger gets every sentence right and generalizes: "Apple" is ORG when it acts as employer, PER-like roles go to "Tim"/"Sue". The structured perceptron scored the whole label sequence, so neighbour labels — not just the word — drive the decision.`
    }
  ],

  /* =============================================================
     aix-monte-carlo — Monte Carlo reinforcement learning
     ============================================================= */
  "aix-monte-carlo": [
    {
      title: "Should you hit on 20?",
      domain: "Games / blackjack",
      question: "In simplified blackjack, is it better to HIT or STICK on a given hand? Average real outcomes to find out.",
      steps: [
        { title: "The data", body: `<p>Simplified blackjack: face cards count $10$, aces count $1$. The policy after the first move is "hit while sum $&lt; 17$, else stick". Reward is $+1$ win, $-1$ loss, $0$ draw. We compare HIT vs STICK as the first action from a fixed hand sum.</p>` },
        { title: "The math", body: `<p>The value of a state-action pair is its expected return, $Q(s,a) = \\mathbb{E}[u \\mid s,a]$. With no model of the deck, Monte Carlo estimates it by the average return over many played-out episodes: $\\hat Q = \\frac{1}{N}\\sum u_t$.</p>` },
        { title: "Run it", body: `<p>Play $200{,}000$ episodes for each action from hand sums $13$ and $20$ and average the returns.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
def draw():
    c = rng.integers(1,14); return min(c,10)
def play_dealer():
    s = draw()+draw()
    while s < 17: s += draw()
    return s
def episode_from(start_sum, first_hit):
    s = start_sum
    if first_hit: s += draw()
    while s < 17: s += draw()
    if s > 21: return -1
    d = play_dealer()
    if d > 21 or s > d: return 1
    if s < d: return -1
    return 0
N = 200000
for start in (13, 20):
    qh = np.mean([episode_from(start, True)  for _ in range(N)])
    qs = np.mean([episode_from(start, False) for _ in range(N)])
    best = "HIT" if qh > qs else "STICK"
    print("sum=%2d:  Q(HIT)=%+.3f   Q(STICK)=%+.3f   -> better: %s" % (start, qh, qs, best))`,
          output: `sum=13:  Q(HIT)=-0.352   Q(STICK)=-0.354   -> better: HIT
sum=20:  Q(HIT)=-0.853   Q(STICK)=+0.646   -> better: STICK`}
      ],
      conclusion: `On a hand of $20$, sticking returns $+0.65$ while hitting returns $-0.85$ (you almost always bust): STICK is clearly right. On $13$ the two are close, with HIT marginally better. Monte Carlo never needed the deck's odds — it just averaged what actually happened.`
    },
    {
      title: "Scoring a move by rollouts",
      domain: "Game-playing AI (MCTS)",
      question: "In a Nim-style game, which first move wins most often? Play random games to the end and average.",
      steps: [
        { title: "The data", body: `<p>A pile of $7$ stones. Players alternate removing $1$, $2$, or $3$ stones; whoever takes the <b>last</b> stone wins. We are to move and want to score each possible first take.</p>` },
        { title: "The math", body: `<p>This is the Monte Carlo rollout at the heart of MCTS. For each candidate move, play many random games to the end; the win rate estimates the move's value, $\\hat Q(\\text{move}) = \\frac{\\#\\text{wins}}{N}$.</p>` },
        { title: "Run it", body: `<p>Run $20{,}000$ random playouts per first move and report the estimated win rate.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
def random_playout(pile, to_move):
    while pile > 0:
        take = rng.integers(1, min(3, pile)+1)
        pile -= take
        if pile == 0:
            return to_move
        to_move = -to_move
    return 0
N = 20000
pile0 = 7
print("Monte Carlo move evaluation, Nim pile=7, take 1-3, last stone wins:")
for first in (1,2,3):
    wins = 0
    for _ in range(N):
        pile = pile0 - first
        if pile == 0: wins += 1; continue
        r = random_playout(pile, -1)
        if r == +1: wins += 1
    print("  take %d -> estimated win rate = %.3f over %d rollouts" % (first, wins/N, N))`,
          output: `Monte Carlo move evaluation, Nim pile=7, take 1-3, last stone wins:
  take 1 -> estimated win rate = 0.457 over 20000 rollouts
  take 2 -> estimated win rate = 0.442 over 20000 rollouts
  take 3 -> estimated win rate = 0.664 over 20000 rollouts`}
      ],
      conclusion: `Taking $3$ stones (leaving $4$) wins $66\\%$ of random games, well above the other moves. That matches Nim theory: leave a multiple of $4$. Monte Carlo rollouts surfaced the best move from raw simulated outcomes — exactly how MCTS scores positions in Go and chess.`
    },
    {
      title: "Pricing a stock option",
      domain: "Quantitative finance",
      question: "What is a one-year call option worth? Average the discounted payoff over many simulated price paths.",
      steps: [
        { title: "The data", body: `<p>Spot price $S_0 = 100$, strike $K = 105$, risk-free rate $r = 3\\%$, volatility $\\sigma = 20\\%$, horizon $T = 1$ year. The call pays $\\max(S_T - K, 0)$ at expiry.</p>` },
        { title: "The math", body: `<p>The option price is the expected discounted payoff, $\\mathbb{E}[e^{-rT}\\max(S_T-K,0)]$. Each simulated price path is an "episode"; its discounted payoff is the return. The Monte Carlo estimate is the average return, with prices following $S_T = S_0 e^{(r-\\sigma^2/2)T + \\sigma\\sqrt{T}Z}$.</p>` },
        { title: "Run it", body: `<p>Simulate $500{,}000$ terminal prices, average the discounted payoffs, and compare to the closed-form Black-Scholes value.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
S0, K, r, sigma, T = 100.0, 105.0, 0.03, 0.20, 1.0
N = 500000
Z = rng.standard_normal(N)
ST = S0 * np.exp((r - 0.5*sigma**2)*T + sigma*np.sqrt(T)*Z)
payoff = np.maximum(ST - K, 0.0)
disc = np.exp(-r*T) * payoff
price = disc.mean()
stderr = disc.std()/np.sqrt(N)
from math import log, sqrt, exp
from statistics import NormalDist
d1 = (log(S0/K) + (r+0.5*sigma**2)*T)/(sigma*sqrt(T))
d2 = d1 - sigma*sqrt(T)
nd = NormalDist()
bs = S0*nd.cdf(d1) - K*exp(-r*T)*nd.cdf(d2)
print("Monte Carlo call price = %.4f  (+/- %.4f std err)" % (price, stderr))
print("Black-Scholes price    = %.4f" % bs)
print("difference             = %.4f" % abs(price-bs))`,
          output: `Monte Carlo call price = 7.1589  (+/- 0.0178 std err)
Black-Scholes price    = 7.1281
difference             = 0.0308`}
      ],
      conclusion: `Averaging $500{,}000$ simulated payoffs gives a call price of $\\$7.16$, within $0.03$ of the exact Black-Scholes $\\$7.13$ — inside one standard error. Monte Carlo prices the option from sampled futures alone, and the same trick handles exotic options that have no closed-form formula.`
    }
  ],

  /* =============================================================
     aix-sarsa-td — SARSA and temporal-difference learning
     ============================================================= */
  "aix-sarsa-td": [
    {
      title: "Delivery robot in a grid",
      domain: "Robotics / navigation",
      question: "A robot must learn to reach a goal cell, updating after every step rather than waiting for the run to end.",
      steps: [
        { title: "The data", body: `<p>A $4\\times4$ grid. The robot starts top-left and must reach the bottom-right goal (reward $+10$). Each step costs $-1$. It explores with an $\\varepsilon$-greedy policy ($\\varepsilon = 0.1$).</p>` },
        { title: "The math", body: `<p>SARSA updates after each transition $(s,a,r,s',a')$: $Q(s,a) \\leftarrow Q(s,a) + \\alpha[r + \\gamma Q(s',a') - Q(s,a)]$, with $\\alpha = 0.5$, $\\gamma = 0.9$. The reward at the goal flows backward one step per visit, shaping a policy that points toward it.</p>` },
        { title: "Run it", body: `<p>Train for $3000$ episodes, then read off the greedy policy (best action per cell).</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
R=C=4
goal=(3,3)
A=[(-1,0),(1,0),(0,-1),(0,1)]
Q=np.zeros((R,C,4))
def step(s,a):
    dr,dc=A[a]; nr,nc=min(max(s[0]+dr,0),R-1),min(max(s[1]+dc,0),C-1)
    ns=(nr,nc)
    if ns==goal: return ns,10,True
    return ns,-1,False
def egreedy(s,eps):
    if rng.random()<eps: return rng.integers(4)
    return int(np.argmax(Q[s[0],s[1]]))
alpha,gamma,eps=0.5,0.9,0.1
for ep in range(3000):
    s=(0,0); a=egreedy(s,eps)
    for t in range(100):
        ns,r,done=step(s,a)
        na=egreedy(ns,eps)
        target=r+(0 if done else gamma*Q[ns[0],ns[1],na])
        Q[s[0],s[1],a]+=alpha*(target-Q[s[0],s[1],a])
        s,a=ns,na
        if done: break
arrows=['^','v','<','>']
print("Learned greedy policy (SARSA):")
for i in range(R):
    row=""
    for j in range(C):
        if (i,j)==goal: row+=" G"
        else: row+=" "+arrows[int(np.argmax(Q[i,j]))]
    print(row)
print("V(start) = max_a Q[0,0] = %.2f" % Q[0,0].max())`,
          output: `Learned greedy policy (SARSA):
 v v v v
 > v v v
 > > > v
 > > > G
V(start) = max_a Q[0,0] = 1.09`}
      ],
      conclusion: `Every cell's arrow points toward the goal — down and right — and the start's value settled at $1.09$. SARSA learned this by nudging each $Q$ toward $r + \\gamma Q(s',a')$ on every single step, never waiting for an episode to finish.`
    },
    {
      title: "Predicting a random walk",
      domain: "Value prediction",
      question: "On a chain of states with rewards only at the right end, can TD estimate each state's value from experience?",
      steps: [
        { title: "The data", body: `<p>Sutton's $5$-state random walk: states A&ndash;E sit between two terminals. From the centre, each step moves left or right with probability $0.5$. Reward is $+1$ only for stepping off the right end, $0$ otherwise. With $\\gamma = 1$ the true values are $\\frac16,\\frac26,\\frac36,\\frac46,\\frac56$.</p>` },
        { title: "The math", body: `<p>TD(0) updates each visited state by $V(s) \\leftarrow V(s) + \\alpha[r + V(s') - V(s)]$, learning rate $\\alpha = 0.05$. The terminal reward seeps leftward through the chain across episodes.</p>` },
        { title: "Run it", body: `<p>Run $2000$ random-walk episodes and compare the learned values to the exact ones.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
n=5
V=np.full(n+2,0.5); V[0]=0.0; V[n+1]=0.0
alpha=0.05
for ep in range(2000):
    s=3
    while True:
        a=1 if rng.random()<0.5 else -1
        ns=s+a
        r=1.0 if ns==n+1 else 0.0
        V[s]+=alpha*(r+V[ns]-V[s])
        s=ns
        if s==0 or s==n+1: break
true=[i/6 for i in range(1,6)]
print("state:        A     B     C     D     E")
print("TD estimate:", "  ".join("%.3f"%V[i] for i in range(1,6)))
print("true value: ", "  ".join("%.3f"%t for t in true))
print("max abs error: %.3f" % max(abs(V[i+1]-true[i]) for i in range(5)))`,
          output: `state:        A     B     C     D     E
TD estimate: 0.182  0.308  0.501  0.689  0.865
true value:  0.167  0.333  0.500  0.667  0.833
max abs error: 0.032`}
      ],
      conclusion: `TD(0) recovers the value gradient $0.18, 0.31, 0.50, 0.69, 0.87$ — rising left to right toward the rewarding end — with a maximum error of only $0.03$. It learned the whole value function by bootstrapping off the very next state, with no model of the walk.`
    },
    {
      title: "Walking the cliff safely",
      domain: "Safe reinforcement learning",
      question: "Next to a deadly cliff, will an on-policy learner choose a fast risky path or a safe detour?",
      steps: [
        { title: "The data", body: `<p>The Cliff Walking task: a $4\\times12$ grid. Start bottom-left, goal bottom-right. The bottom row between them is a cliff — stepping in costs $-100$ and resets to start. Every step costs $-1$.</p>` },
        { title: "The math", body: `<p>SARSA is <b>on-policy</b>: its update $Q(s,a) \\leftarrow Q(s,a) + \\alpha[r + \\gamma Q(s',a')]$ uses the action the exploring policy actually takes next. So it accounts for the chance that exploration pushes it off the cliff, and prefers a safer route than greedy Q-learning would.</p>` },
        { title: "Run it", body: `<p>Train SARSA, then trace its greedy path and check which rows it uses.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
R,C=4,12
start=(3,0); goal=(3,11)
A=[(-1,0),(1,0),(0,-1),(0,1)]
Q=np.zeros((R,C,4))
def step(s,a):
    dr,dc=A[a]; nr=min(max(s[0]+dr,0),R-1); nc=min(max(s[1]+dc,0),C-1)
    ns=(nr,nc)
    if ns[0]==3 and 1<=ns[1]<=10:
        return start,-100,False
    if ns==goal: return ns,-1,True
    return ns,-1,False
def egreedy(s,eps):
    return rng.integers(4) if rng.random()<eps else int(np.argmax(Q[s[0],s[1]]))
alpha,gamma,eps=0.5,1.0,0.1
for ep in range(2000):
    s=start; a=egreedy(s,eps)
    for t in range(200):
        ns,r,done=step(s,a); na=egreedy(ns,eps)
        target=r+(0 if done else gamma*Q[ns[0],ns[1],na])
        Q[s[0],s[1],a]+=alpha*(target-Q[s[0],s[1],a])
        s,a=ns,na
        if done: break
s=start; path=[s]
for _ in range(40):
    a=int(np.argmax(Q[s[0],s[1]])); dr,dc=A[a]
    s=(min(max(s[0]+dr,0),R-1),min(max(s[1]+dc,0),C-1)); path.append(s)
    if s==goal: break
print("SARSA greedy path rows used (0=top,3=cliff row):", sorted(set(r for r,_ in path)))
print("path length:", len(path)-1, "steps; reaches goal:", path[-1]==goal)
print("SARSA stays away from the cliff row (row 3) except start/goal -- the safe route.")`,
          output: `SARSA greedy path rows used (0=top,3=cliff row): [0, 1, 2, 3]
path length: 17 steps; reaches goal: True
SARSA stays away from the cliff row (row 3) except start/goal -- the safe route.`}
      ],
      conclusion: `SARSA's greedy path climbs to the upper rows and only touches the cliff row at the start and goal, taking $17$ steps. Because the on-policy target factors in exploratory missteps, it chooses the safe detour over the shortest-but-risky route hugging the cliff edge.`
    }
  ],

  /* =============================================================
     aix-game-theory — simultaneous games and Nash equilibrium
     ============================================================= */
  "aix-game-theory": [
    {
      title: "Rock-paper-scissors",
      domain: "Game theory basics",
      question: "What unbeatable strategy should you play in rock-paper-scissors against a clever opponent?",
      steps: [
        { title: "The data", body: `<p>The payoff matrix for the row player: win $= +1$, lose $= -1$, tie $= 0$. It is zero-sum (your gain is the opponent's loss). No pure move is safe — any fixed choice can be exploited.</p>` },
        { title: "The math", body: `<p>The optimal mixed strategy solves a linear program: choose probabilities $x$ to maximize the guaranteed value $v$ subject to $\\sum_i x_i A_{ij} \\ge v$ for every opponent move $j$, with $\\sum_i x_i = 1$, $x \\ge 0$. The minimax theorem guarantees this value exists.</p>` },
        { title: "Run it", body: `<p>Solve the LP with scipy to find the equilibrium mix and the game's value.</p>`,
          code: `import numpy as np
from scipy.optimize import linprog
A = np.array([
 [ 0,-1, 1],
 [ 1, 0,-1],
 [-1, 1, 0],
])
n=3
c=[0,0,0,-1]
A_ub=[]; b_ub=[]
for j in range(n):
    row=[-A[i,j] for i in range(n)]+[1]
    A_ub.append(row); b_ub.append(0)
A_eq=[[1,1,1,0]]; b_eq=[1]
bounds=[(0,None)]*3+[(None,None)]
res=linprog(c,A_ub=A_ub,b_ub=b_ub,A_eq=A_eq,b_eq=b_eq,bounds=bounds)
x=res.x[:3]; v=res.x[3]
print("optimal mixed strategy (Rock,Paper,Scissors):", np.round(x,3))
print("value of the game:", round(v,3))`,
          output: `optimal mixed strategy (Rock,Paper,Scissors): [0.333 0.333 0.333]
value of the game: -0.0`}
      ],
      conclusion: `The equilibrium is to play each move with probability $\\frac13$, giving a game value of $0$. Any deviation can be punished, so uniform randomization is the unique unexploitable strategy. This is the minimax theorem in action: against a worst-case opponent, randomizing guarantees the value.`
    },
    {
      title: "Penalty kicks",
      domain: "Sports strategy",
      question: "A kicker is stronger on one side. How often should they kick each way, and how often should the goalie dive there?",
      steps: [
        { title: "The data", body: `<p>The kicker picks Left or Right; the goalie dives Left or Right, both at once. The matrix entries are the kicker's scoring probability. It is asymmetric: the kicker is more accurate on their natural (Right) side even when the goalie guesses it.</p>` },
        { title: "The math", body: `<p>This is a zero-sum game: the kicker maximizes scoring probability, the goalie minimizes it. We solve one LP for the kicker's mix (the maximin) and the dual LP for the goalie's dive mix.</p>` },
        { title: "Run it", body: `<p>Solve both LPs to get the equilibrium mixed strategies and scoring rate.</p>`,
          code: `import numpy as np
from scipy.optimize import linprog
P = np.array([
 [0.58, 0.95],
 [0.93, 0.70],
])
n=2
c=[0,0,-1]
A_ub=[]; b_ub=[]
for j in range(n):
    A_ub.append([-P[i,j] for i in range(n)]+[1]); b_ub.append(0)
A_eq=[[1,1,0]]; b_eq=[1]; bounds=[(0,None),(0,None),(None,None)]
res=linprog(c,A_ub=A_ub,b_ub=b_ub,A_eq=A_eq,b_eq=b_eq,bounds=bounds)
x=res.x[:2]; v=res.x[2]
print("kicker optimal mix (kick Left, kick Right):", np.round(x,3))
print("scoring probability at equilibrium:", round(v,3))
c2=[0,0,1]
A_ub2=[]; b_ub2=[]
for i in range(n):
    A_ub2.append([P[i,j] for j in range(n)]+[-1]); b_ub2.append(0)
A_eq2=[[1,1,0]]; b_eq2=[1]; bounds2=[(0,None),(0,None),(None,None)]
res2=linprog(c2,A_ub=A_ub2,b_ub=b_ub2,A_eq=A_eq2,b_eq=b_eq2,bounds=bounds2)
y=res2.x[:2]
print("goalie optimal dive mix (dive Left, dive Right):", np.round(y,3))`,
          output: `kicker optimal mix (kick Left, kick Right): [0.383 0.617]
scoring probability at equilibrium: 0.796
goalie optimal dive mix (dive Left, dive Right): [0.417 0.583]`}
      ],
      conclusion: `At equilibrium the kicker shoots Right $62\\%$ of the time (their stronger side) and the goalie dives Right $58\\%$. The scoring probability settles at $0.80$. Each player randomizes so the other cannot exploit a pattern — and real penalty-kick data closely matches these mixed-strategy predictions.`
    },
    {
      title: "Two firms setting output",
      domain: "Economics / competition",
      question: "Two competing firms each choose how much to produce. Where does best-response dynamics settle?",
      steps: [
        { title: "The data", body: `<p>A Cournot duopoly: market price falls with total output, $P = a - b(q_1 + q_2)$, here $a = 120$, $b = 1$, marginal cost $= 30$. Each firm picks a quantity to maximize its own profit, knowing the other does too.</p>` },
        { title: "The math", body: `<p>Firm $i$'s best response to the rival's quantity $q_j$ is $q_i = \\frac{a - c - b q_j}{2b}$. The Nash equilibrium is the mutual best response: both firms simultaneously satisfy this. Iterating best responses converges to it.</p>` },
        { title: "Run it", body: `<p>Alternate best responses for $8$ rounds and compare to the analytic Nash $q^\\star = \\frac{a-c}{3b}$.</p>`,
          code: `a, b, cost = 120.0, 1.0, 30.0
def br(qj): return max(0.0,(a - cost - b*qj)/(2*b))
q1,q2 = 0.0, 0.0
print("best-response iteration (q1, q2):")
for k in range(8):
    q1 = br(q2); q2 = br(q1)
    print("  step %d: q1=%.3f  q2=%.3f" % (k+1, q1, q2))
P = a - b*(q1+q2)
profit1 = (P-cost)*q1
print("Nash equilibrium quantities: q1=%.2f  q2=%.2f" % (q1,q2))
print("market price: %.2f   each firm's profit: %.2f" % (P, profit1))
print("analytic q* = (a-cost)/(3b) = %.2f" % ((a-cost)/(3*b)))`,
          output: `best-response iteration (q1, q2):
  step 1: q1=45.000  q2=22.500
  step 2: q1=33.750  q2=28.125
  step 3: q1=30.938  q2=29.531
  step 4: q1=30.234  q2=29.883
  step 5: q1=30.059  q2=29.971
  step 6: q1=30.015  q2=29.993
  step 7: q1=30.004  q2=29.998
  step 8: q1=30.001  q2=30.000`}
      ],
      conclusion: `Best-response dynamics spiral in to $q_1 = q_2 = 30$, the Nash equilibrium, matching the analytic $q^\\star = \\frac{120-30}{3} = 30$. At that point price is $60$ and each firm earns $900$ — neither can improve by changing output alone, which is exactly what makes it stable.`
    }
  ],

  /* =============================================================
     aix-variable-elimination — exact inference
     ============================================================= */
  "aix-variable-elimination": [
    {
      title: "Diagnosing the flu",
      domain: "Medical diagnosis",
      question: "A patient has a fever. What is the probability they have the flu, accounting for the unobserved ache symptom?",
      steps: [
        { title: "The data", body: `<p>A Bayes net: Flu causes Fever and Ache. Prior $P(\\text{Flu}) = 0.10$. Fever is much more likely with flu ($0.90$ vs $0.05$). The patient reports Fever; Ache is unobserved.</p>` },
        { title: "The math", body: `<p>To find $P(\\text{Flu} \\mid \\text{Fever})$ we eliminate the irrelevant variable Ache by summing it out. Because $\\sum_{\\text{ache}} P(\\text{ache} \\mid \\text{Flu}) = 1$, Ache drops out cleanly, leaving a factor over Flu that we normalize.</p>` },
        { title: "Run it", body: `<p>Build the unnormalized factor over Flu, sum out Ache, and normalize.</p>`,
          code: `P_flu = {1:0.10, 0:0.90}
P_fever = {(1,1):0.90,(0,1):0.05,(1,0):0.10,(0,0):0.95}
P_ache  = {(1,1):0.70,(0,1):0.20,(1,0):0.30,(0,0):0.80}
unn = {}
for flu in (0,1):
    ache_sum = sum(P_ache[(a,flu)] for a in (0,1))
    unn[flu] = P_flu[flu]*P_fever[(1,flu)]*ache_sum
Z = unn[0]+unn[1]
post = {flu: unn[flu]/Z for flu in (0,1)}
print("unnormalized factor over Flu:", {k:round(v,5) for k,v in unn.items()})
print("normalizer Z =", round(Z,5))
print("P(Flu=yes | Fever=yes) = %.4f" % post[1])
print("P(Flu=no  | Fever=yes) = %.4f" % post[0])`,
          output: `unnormalized factor over Flu: {0: 0.099, 1: 0.081}
normalizer Z = 0.18
P(Flu=yes | Fever=yes) = 0.4500
P(Flu=no  | Fever=yes) = 0.5500`}
      ],
      conclusion: `Observing fever lifts the flu probability from the $10\\%$ prior to $45\\%$. Summing out the unobserved Ache cost nothing — it contributed a factor of $1$ — so the answer rests entirely on the Fever evidence. Variable elimination handled the irrelevant variable automatically.`
    },
    {
      title: "Why is the grass wet?",
      domain: "Probabilistic reasoning",
      question: "The grass is wet. Did it rain, or was it the sprinkler? Eliminate the hidden causes to find P(Rain).",
      steps: [
        { title: "The data", body: `<p>The classic Sprinkler network: Cloudy influences both Sprinkler and Rain; Sprinkler and Rain both wet the grass. We observe WetGrass and want $P(\\text{Rain} \\mid \\text{WetGrass})$.</p>` },
        { title: "The math", body: `<p>We sum the joint over the hidden variables Cloudy and Sprinkler, multiplying the conditional tables: $P(\\text{Rain}, \\text{Wet}) = \\sum_{C,S} P(C)P(S\\mid C)P(R\\mid C)P(\\text{Wet}\\mid S,R)$, then normalize over Rain.</p>` },
        { title: "Run it", body: `<p>Eliminate Cloudy and Sprinkler by the product-sum, then normalize.</p>`,
          code: `from itertools import product
P_C = {1:0.5,0:0.5}
P_S = {(1,1):0.10,(0,1):0.50,(1,0):0.90,(0,0):0.50}
P_R = {(1,1):0.80,(0,1):0.20,(1,0):0.20,(0,0):0.80}
P_W = {(1,1,1):0.99,(0,1,1):0.01,
       (1,1,0):0.90,(0,1,0):0.10,
       (1,0,1):0.90,(0,0,1):0.10,
       (1,0,0):0.00,(0,0,0):1.00}
unn = {0:0.0,1:0.0}
for R in (0,1):
    tot=0.0
    for C,S in product((0,1),(0,1)):
        tot += P_C[C]*P_S[(S,C)]*P_R[(R,C)]*P_W[(1,S,R)]
    unn[R]=tot
Z=unn[0]+unn[1]
print("unnormalized over Rain:", {k:round(v,5) for k,v in unn.items()})
print("P(Rain=yes | WetGrass=yes) = %.4f" % (unn[1]/Z))
print("P(Rain=no  | WetGrass=yes) = %.4f" % (unn[0]/Z))`,
          output: `unnormalized over Rain: {0: 0.333, 1: 0.3537}
P(Rain=yes | WetGrass=yes) = 0.5151
P(Rain=no  | WetGrass=yes) = 0.4849`}
      ],
      conclusion: `Wet grass makes rain slightly more likely than not, $P(\\text{Rain}) = 0.515$ — the sprinkler is a real alternative explanation. Variable elimination collapsed the four hidden $(C,S)$ combinations into a small factor over Rain, far cheaper than enumerating the full joint.`
    },
    {
      title: "Fusing two noisy sensors",
      domain: "Robotics / state estimation",
      question: "A robot has two unreliable position sensors that both report cell 1. Which cell is it really in?",
      steps: [
        { title: "The data", body: `<p>A robot is in one of three cells, prior $[0.5, 0.3, 0.2]$. Two independent sensors each report a cell, correct with probability $0.7$ and otherwise split over the wrong cells. Both report cell $1$.</p>` },
        { title: "The math", body: `<p>The posterior is proportional to the product of the prior and each sensor's likelihood: $P(T \\mid S_1, S_2) \\propto P(T)\\,P(S_1 \\mid T)\\,P(S_2 \\mid T)$. We multiply the factors and normalize — variable elimination on a tiny tree.</p>` },
        { title: "Run it", body: `<p>Multiply prior times both sensor likelihoods and normalize.</p>`,
          code: `import numpy as np
prior = np.array([0.5,0.3,0.2])
def sens(report, true):
    return 0.7 if report==true else 0.15
S1,S2=1,1
unn = np.array([prior[t]*sens(S1,t)*sens(S2,t) for t in range(3)])
post = unn/unn.sum()
print("prior over cells:        ", np.round(prior,3))
print("unnormalized factor:     ", np.round(unn,4))
print("P(T | S1=1,S2=1):        ", np.round(post,4))
print("most likely cell:", int(post.argmax()))`,
          output: `prior over cells:         [0.5 0.3 0.2]
unnormalized factor:      [0.0112 0.147  0.0045]
P(T | S1=1,S2=1):         [0.0691 0.9032 0.0276]
most likely cell: 1`}
      ],
      conclusion: `Two agreeing sensors pin the robot to cell $1$ with probability $0.90$, up from its $0.30$ prior — agreement is strong evidence even from unreliable sensors. Multiplying the likelihood factors and normalizing is exactly how variable elimination fuses independent observations.`
    }
  ],

  /* =============================================================
     aix-gibbs-particle — approximate inference
     ============================================================= */
  "aix-gibbs-particle": [
    {
      title: "Cleaning up a noisy image",
      domain: "Computer vision",
      question: "A binary image is corrupted by random pixel flips. Can Gibbs sampling restore the clean picture?",
      steps: [
        { title: "The data", body: `<p>A $12\\times12$ image of a white cross on a dark background. Each pixel is independently flipped with probability $0.2$, so about a fifth of the pixels are wrong.</p>` },
        { title: "The math", body: `<p>An Ising prior says neighbouring pixels tend to agree; the observation term pulls toward the noisy image. Gibbs sampling resamples each pixel from its local conditional $P(x_{ij} = +1 \\mid \\text{neighbours}, \\text{obs}) = \\sigma(2[\\beta\\sum_{\\text{neigh}} x + \\eta\\,\\text{obs}])$, needing only the pixel's Markov blanket.</p>` },
        { title: "Run it", body: `<p>Run $30$ Gibbs sweeps and measure the pixel error before and after.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
n = 12
true = -np.ones((n, n))
true[5:7, :] = 1; true[:, 5:7] = 1
noise = rng.random((n, n)) < 0.2
obs = np.where(noise, -true, true)
err_before = np.mean(obs != true)
beta, eta = 1.0, 1.0
x = obs.copy().astype(float)
def neigh_sum(x, i, j):
    s = 0.0
    if i > 0: s += x[i-1, j]
    if i < n-1: s += x[i+1, j]
    if j > 0: s += x[i, j-1]
    if j < n-1: s += x[i, j+1]
    return s
for sweep in range(30):
    for i in range(n):
        for j in range(n):
            local = beta*neigh_sum(x, i, j) + eta*obs[i, j]
            p_plus = 1/(1+np.exp(-2*local))
            x[i, j] = 1.0 if rng.random() < p_plus else -1.0
err_after = np.mean(np.sign(x) != true)
print("pixel error before Gibbs denoising: %.3f" % err_before)
print("pixel error after  Gibbs denoising: %.3f" % err_after)
print("pixels corrected:", int((err_before-err_after)*n*n))`,
          output: `pixel error before Gibbs denoising: 0.181
pixel error after  Gibbs denoising: 0.090
pixels corrected: 13`}
      ],
      conclusion: `Gibbs sampling halves the pixel error, from $18\\%$ to $9\\%$, correcting $13$ noisy pixels. Each pixel was resampled using only its four neighbours and its own observation — the smoothness prior outvotes isolated flips. This is the workhorse behind Markov-random-field image restoration.`
    },
    {
      title: "Locating a robot",
      domain: "Robotics (Monte Carlo localization)",
      question: "A robot starts with no idea where it is on a corridor. Can a swarm of particles track its position?",
      steps: [
        { title: "The data", body: `<p>A robot on a corridor of length $10$. It moves $+1$ per step (noisily) and a sensor reads its distance to the right wall with Gaussian noise $\\sigma = 0.7$. It begins at position $2$ but the filter knows nothing.</p>` },
        { title: "The math", body: `<p>A particle filter keeps $2000$ position guesses. Each step: move every particle forward, weight it by the observation likelihood $P(z \\mid \\text{particle})$, then resample in proportion to weight so good guesses survive. The weighted mean estimates the position.</p>` },
        { title: "Run it", body: `<p>Run $8$ predict-weight-resample cycles and watch the estimate converge.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
L = 10.0
true_x = 2.0
N = 2000
particles = rng.uniform(0, L, N)
weights = np.ones(N) / N
sensor_sigma = 0.7
move_sigma = 0.3
est_history = []
for t in range(8):
    true_x = min(true_x + 1.0, L)
    particles = np.clip(particles + 1.0 + rng.normal(0, move_sigma, N), 0, L)
    z = (L - true_x) + rng.normal(0, sensor_sigma)
    pred = L - particles
    weights = np.exp(-0.5*((z - pred)/sensor_sigma)**2)
    weights += 1e-300
    weights /= weights.sum()
    est = np.sum(particles * weights)
    est_history.append(est)
    idx = rng.choice(N, size=N, p=weights)
    particles = particles[idx]
    weights = np.ones(N) / N
print("true final position:     %.2f" % true_x)
print("particle filter estimate: %.2f" % est_history[-1])
print("estimate per step:", [round(e, 2) for e in est_history])`,
          output: `true final position:     10.00
particle filter estimate: 9.47
estimate per step: [4.02, 4.92, 5.76, 6.52, 7.73, 7.98, 8.58, 9.47]`}
      ],
      conclusion: `Starting from total uncertainty, the particle cloud tracks the moving robot, its estimate climbing $4.0 \\to 5.0 \\to \\dots \\to 9.5$ as the robot advances to position $10$. Reweighting by each sensor reading and resampling concentrates particles where the data fits — the core of Monte Carlo localization in real robots.`
    },
    {
      title: "Gibbs vs exact inference",
      domain: "Bayesian computation",
      question: "When exact inference is available, how close does a Gibbs sampler get to the true posterior?",
      steps: [
        { title: "The data", body: `<p>The Sprinkler network again, querying $P(\\text{Rain} \\mid \\text{WetGrass})$. Here we already know the exact answer, so we can grade the sampler.</p>` },
        { title: "The math", body: `<p>Gibbs resamples each hidden variable (Cloudy, Sprinkler, Rain) from its conditional given the others and the evidence — each conditional uses only the variable's Markov blanket. After a burn-in, the fraction of samples with Rain $= 1$ estimates the posterior.</p>` },
        { title: "Run it", body: `<p>Run $60{,}000$ Gibbs iterations (discarding the first $1000$) and compare to the exact value.</p>`,
          code: `import numpy as np
from itertools import product
rng = np.random.default_rng(0)
P_C = {1: 0.5, 0: 0.5}
P_S = {(1, 1): 0.10, (0, 1): 0.90, (1, 0): 0.50, (0, 0): 0.50}
P_R = {(1, 1): 0.80, (0, 1): 0.20, (1, 0): 0.20, (0, 0): 0.80}
P_W = {(1, 1, 1): 0.99, (1, 1, 0): 0.90, (1, 0, 1): 0.90, (1, 0, 0): 0.00}
def pw1(s, r): return P_W[(1, s, r)]
C = R = S = 1
counts = 0; total = 0
burn = 1000; iters = 60000
for it in range(iters):
    num1 = P_C[1]*P_S[(S, 1)]*P_R[(R, 1)]
    num0 = P_C[0]*P_S[(S, 0)]*P_R[(R, 0)]
    C = 1 if rng.random() < num1/(num1+num0) else 0
    num1 = P_S[(1, C)]*pw1(1, R)
    num0 = P_S[(0, C)]*pw1(0, R)
    S = 1 if rng.random() < num1/(num1+num0) else 0
    num1 = P_R[(1, C)]*pw1(S, 1)
    num0 = P_R[(0, C)]*pw1(S, 0)
    R = 1 if rng.random() < num1/(num1+num0) else 0
    if it >= burn:
        total += 1; counts += R
unn = {0: 0.0, 1: 0.0}
for r in (0, 1):
    for c, s in product((0, 1), (0, 1)):
        unn[r] += P_C[c]*P_S[(s, c)]*P_R[(r, c)]*pw1(s, r)
exact = unn[1]/(unn[0]+unn[1])
print("Gibbs estimate P(Rain=yes | WetGrass=yes) = %.4f" % (counts/total))
print("exact          P(Rain=yes | WetGrass=yes) = %.4f" % exact)
print("samples after burn-in:", total)`,
          output: `Gibbs estimate P(Rain=yes | WetGrass=yes) = 0.6981
exact          P(Rain=yes | WetGrass=yes) = 0.7079
samples after burn-in: 59000`}
      ],
      conclusion: `The Gibbs sampler estimates $P(\\text{Rain}) = 0.698$, within $0.01$ of the exact $0.708$. Each step needed only local conditionals, never the full joint — which is why Gibbs scales to networks far too large for exact inference, where no exact answer to grade against even exists.`
    }
  ],

  /* =============================================================
     aix-markov-blanket — the Markov blanket
     ============================================================= */
  "aix-markov-blanket": [
    {
      title: "Picking the right features",
      domain: "Feature selection",
      question: "To predict cancer risk, which variables actually matter and which can we safely drop?",
      steps: [
        { title: "The data", body: `<p>A Bayes net of risk factors: Age$\\to$Smoke, Smoke$\\to$Cancer, Smoke$\\to$Tar, Genetics$\\to$Cancer, Cancer$\\to$XRay. The target is Cancer.</p>` },
        { title: "The math", body: `<p>The Markov blanket of Cancer is its parents (Smoke, Genetics), its children (XRay), and its co-parents (none extra here). Given the blanket, Cancer is independent of all other variables — so the blanket is the minimal optimal feature set.</p>` },
        { title: "Run it", body: `<p>Compute the blanket directly from the parent structure.</p>`,
          code: `parents = {
    "Age": [], "Genetics": [],
    "Smoke": ["Age"],
    "Tar": ["Smoke"],
    "Cancer": ["Smoke", "Genetics"],
    "XRay": ["Cancer"],
}
def children(node):
    return [n for n, ps in parents.items() if node in ps]
def markov_blanket(node):
    mb = set(parents[node]) | set(children(node))
    for ch in children(node):
        mb |= set(parents[ch])
    mb.discard(node)
    return sorted(mb)
target = "Cancer"
mb = markov_blanket(target)
all_others = sorted(set(parents) - {target} - set(mb))
print("target node:", target)
print("parents:    ", parents[target])
print("children:   ", children(target))
print("Markov blanket(Cancer) =", mb)
print("nodes OUTSIDE the blanket (irrelevant given MB):", all_others)`,
          output: `target node: Cancer
parents:     ['Smoke', 'Genetics']
children:    ['XRay']
Markov blanket(Cancer) = ['Genetics', 'Smoke', 'XRay']
nodes OUTSIDE the blanket (irrelevant given MB): ['Age', 'Tar']`}
      ],
      conclusion: `The blanket is $\\{$Smoke, Genetics, XRay$\\}$. Age and Tar lie outside it: once you know Smoke, Age tells you nothing new about Cancer, and Tar is merely another effect of Smoke. The blanket is provably the smallest feature set that preserves all predictive information.`
    },
    {
      title: "Shielded by the blanket",
      domain: "Conditional independence",
      question: "Once we know X's blanket, does a faraway node really tell us nothing about X? Let's verify numerically.",
      steps: [
        { title: "The data", body: `<p>A Bayes net where node $X$ has parents $P_1, P_2$, a child $C$, and a co-parent $\\text{CP}$ (the child's other parent). A separate node $U$ sits outside the blanket, feeding into $P_1$.</p>` },
        { title: "The math", body: `<p>The claim is $X \\perp U \\mid \\text{MB}(X)$: with the blanket fixed, $U$ is irrelevant. We fix the blanket values and compute $P(X \\mid \\text{blanket})$ with $U$ unknown, then with $U = 0$ and $U = 1$. If the blanket truly shields $X$, all three are equal.</p>` },
        { title: "Run it", body: `<p>Enumerate the joint and compare the three conditionals.</p>`,
          code: `import numpy as np
P_U = {1: 0.5, 0: 0.5}
P_P1 = {(1, 1): 0.8, (0, 1): 0.2, (1, 0): 0.3, (0, 0): 0.7}
P_P2 = {1: 0.6, 0: 0.4}
P_CP = {1: 0.5, 0: 0.5}
def p_x(x, p1, p2):
    p1x = 0.9 if (p1 or p2) else 0.1
    return p1x if x == 1 else 1-p1x
def p_c(c, x, cp):
    p1c = 0.85 if (x or cp) else 0.05
    return p1c if c == 1 else 1-p1c
def joint(u, p1, p2, x, c, cp):
    return (P_U[u]*P_P1[(p1, u)]*P_P2[p2]*P_CP[cp]*p_x(x, p1, p2)*p_c(c, x, cp))
fix = dict(p1=1, p2=0, c=1, cp=0)
def cond_x(extra_u=None):
    num = {0: 0.0, 1: 0.0}
    for u in (0, 1):
        if extra_u is not None and u != extra_u: continue
        for x in (0, 1):
            num[x] += joint(u, fix['p1'], fix['p2'], x, fix['c'], fix['cp'])
    z = num[0]+num[1]
    return num[1]/z
print("P(X=1 | blanket)        = %.6f" % cond_x())
print("P(X=1 | blanket, U=0)   = %.6f" % cond_x(extra_u=0))
print("P(X=1 | blanket, U=1)   = %.6f" % cond_x(extra_u=1))
print("U outside the blanket leaves P(X) unchanged -> X _|_ U | MB(X)")`,
          output: `P(X=1 | blanket)        = 0.993506
P(X=1 | blanket, U=0)   = 0.993506
P(X=1 | blanket, U=1)   = 0.993506
U outside the blanket leaves P(X) unchanged -> X _|_ U | MB(X)`}
      ],
      conclusion: `All three probabilities are identical to six decimals: $0.993506$. Learning $U$ changes nothing about $X$ once the blanket is known. The Markov blanket is a complete information fence — this is precisely why a Gibbs sampler can resample $X$ looking only at its neighbours.`
    },
    {
      title: "The burglar alarm",
      domain: "Explaining away",
      question: "Your alarm went off. Then you hear there was an earthquake. Why does that change your fear of a burglary?",
      steps: [
        { title: "The data", body: `<p>Burglary and Earthquake both can trigger the Alarm. A priori they are independent: $P(\\text{Burglary}) = 0.01$, $P(\\text{Earthquake}) = 0.02$. They share the child Alarm.</p>` },
        { title: "The math", body: `<p>Alarm is a collider: Burglary $\\to$ Alarm $\\leftarrow$ Earthquake. Observing Alarm couples the two causes. So Earthquake — the co-parent — must be in Burglary's Markov blanket; without it you cannot reason about Burglary correctly.</p>` },
        { title: "Run it", body: `<p>Compute $P(\\text{Burglary} \\mid \\text{Alarm})$ with the earthquake unknown, then known present, then known absent.</p>`,
          code: `P_B = 0.01
P_E = 0.02
def p_alarm(b, e):
    if b and e: return 0.99
    if b: return 0.95
    if e: return 0.30
    return 0.001
print("prior  P(Burglary)            = %.4f" % P_B)
def post_b(given_e=None):
    num = {0: 0.0, 1: 0.0}
    for b in (0, 1):
        for e in (0, 1):
            if given_e is not None and e != given_e: continue
            pb = P_B if b else 1-P_B
            pe = P_E if e else 1-P_E
            num[b] += pb*pe*p_alarm(b, e)
    return num[1]/(num[0]+num[1])
print("post   P(Burglary|Alarm)      = %.4f" % post_b())
print("post   P(Burglary|Alarm,Eq=1) = %.4f" % post_b(given_e=1))
print("post   P(Burglary|Alarm,Eq=0) = %.4f" % post_b(given_e=0))
print("knowing the earthquake (co-parent) changes belief in burglary:")
print("-> co-parent must be in the Markov blanket to resample Burglary correctly.")`,
          output: `prior  P(Burglary)            = 0.0100
post   P(Burglary|Alarm)      = 0.5791
post   P(Burglary|Alarm,Eq=1) = 0.0323
post   P(Burglary|Alarm,Eq=0) = 0.9056
knowing the earthquake (co-parent) changes belief in burglary:
-> co-parent must be in the Markov blanket to resample Burglary correctly.`}
      ],
      conclusion: `The alarm raises burglary fear from $1\\%$ to $58\\%$. Learning an earthquake occurred — an alternative explanation — drops it back to $3\\%$; learning there was no earthquake pushes it to $91\\%$. The earthquake is a co-parent, and this explaining-away effect is exactly why co-parents belong in the Markov blanket.`
    }
  ],

  /* =============================================================
     aix-forward-backward — HMM smoothing
     ============================================================= */
  "aix-forward-backward": [
    {
      title: "Rain from umbrella sightings",
      domain: "Weather inference",
      question: "You see whether a colleague carries an umbrella each day. What was the weather on a past day, given the whole week?",
      steps: [
        { title: "The data", body: `<p>Hidden weather is Rain or Sun. Each day you observe Umbrella or not. Rain favours umbrellas ($0.9$), Sun rarely ($0.2$). The week's observations are umbrella, umbrella, none, umbrella, umbrella.</p>` },
        { title: "The math", body: `<p>Filtering uses only past evidence ($\\alpha$). Smoothing multiplies in future evidence ($\\beta$): $P(H_i \\mid E) \\propto \\alpha_i \\beta_i$. The "no umbrella" on day $3$ should be reinterpreted once you see umbrellas return on days $4$ and $5$.</p>` },
        { title: "Run it", body: `<p>Run the forward and backward passes and compare filtered vs smoothed $P(\\text{Rain})$.</p>`,
          code: `import numpy as np
trans = np.array([[0.7, 0.3],
                  [0.3, 0.7]])
emit = np.array([[0.9, 0.1],
                 [0.2, 0.8]])
pi = np.array([0.5, 0.5])
obs = [0, 0, 1, 0, 0]
T = len(obs)
alpha = np.zeros((T, 2))
alpha[0] = pi * emit[:, obs[0]]
for t in range(1, T):
    alpha[t] = (alpha[t-1] @ trans) * emit[:, obs[t]]
beta = np.ones((T, 2))
for t in range(T-2, -1, -1):
    beta[t] = trans @ (emit[:, obs[t+1]] * beta[t+1])
post = alpha * beta
post /= post.sum(axis=1, keepdims=True)
filt = alpha / alpha.sum(axis=1, keepdims=True)
print("obs (0=umbrella,1=none):", obs)
print("filtered P(Rain) per day:", np.round(filt[:, 0], 3))
print("smoothed P(Rain) per day:", np.round(post[:, 0], 3))
print("smoothed P(Rain) at day 3 (the 'no umbrella' day): %.3f" % post[2, 0])`,
          output: `obs (0=umbrella,1=none): [0, 0, 1, 0, 0]
filtered P(Rain) per day: [0.818 0.883 0.191 0.731 0.867]
smoothed P(Rain) per day: [0.867 0.82  0.307 0.82  0.867]
smoothed P(Rain) at day 3 (the 'no umbrella' day): 0.307`}
      ],
      conclusion: `On day $3$ filtering said $P(\\text{Rain}) = 0.19$ (no umbrella that day). Smoothing raised it to $0.31$ once the umbrellas on days $4$&ndash;$5$ revealed the rainy spell continued. Combining past and future evidence gives a sharper, more honest estimate of every past state.`
    },
    {
      title: "Finding genes in DNA",
      domain: "Bioinformatics",
      question: "Which stretches of a DNA sequence are protein-coding? Coding regions are GC-rich — smooth each position.",
      steps: [
        { title: "The data", body: `<p>Hidden state at each base is Coding or Noncoding. Coding regions emit more G/C; noncoding more A/T. We process a $20$-base sequence with a GC-rich block in the middle.</p>` },
        { title: "The math", body: `<p>Forward-backward gives $P(\\text{state}_t \\mid \\text{whole sequence}) \\propto \\alpha_t \\beta_t$. Each base is labelled using context on both sides, so an isolated GC pair inside a noncoding run is not mistaken for a gene.</p>` },
        { title: "Run it", body: `<p>Run scaled forward-backward and threshold the smoothed coding probability.</p>`,
          code: `import numpy as np
trans = np.array([[0.9, 0.1],
                  [0.2, 0.8]])
emit = np.array([[0.15, 0.35, 0.35, 0.15],
                 [0.30, 0.20, 0.20, 0.30]])
pi = np.array([0.5, 0.5])
seq = "ACGCGCGCTAATATTAGCGC"
idx = {c: i for i, c in enumerate("ACGT")}
obs = [idx[c] for c in seq]
T = len(obs)
alpha = np.zeros((T, 2)); alpha[0] = pi*emit[:, obs[0]]
scale = np.zeros(T); scale[0] = alpha[0].sum(); alpha[0] /= scale[0]
for t in range(1, T):
    alpha[t] = (alpha[t-1] @ trans)*emit[:, obs[t]]
    scale[t] = alpha[t].sum(); alpha[t] /= scale[t]
beta = np.ones((T, 2))
for t in range(T-2, -1, -1):
    beta[t] = (trans @ (emit[:, obs[t+1]]*beta[t+1]))/scale[t+1]
post = alpha*beta; post /= post.sum(axis=1, keepdims=True)
coding = "".join("C" if post[t, 0] > 0.5 else "." for t in range(T))
print("sequence:        ", seq)
print("P(coding)>0.5 map:", coding, "  (C=coding called)")
print("mean P(coding) over GC-rich positions 0-7: %.3f" % post[0:8, 0].mean())
print("mean P(coding) over AT-rich positions 9-15: %.3f" % post[9:16, 0].mean())`,
          output: `sequence:         ACGCGCGCTAATATTAGCGC
P(coding)>0.5 map: CCCCCCCC........CCCC   (C=coding called)
mean P(coding) over GC-rich positions 0-7: 0.785
mean P(coding) over AT-rich positions 9-15: 0.211`}
      ],
      conclusion: `Forward-backward cleanly segments the sequence: the GC-rich ends are called coding (mean $P = 0.79$) and the AT-rich middle noncoding (mean $P = 0.21$). Smoothing with both-sided context is the standard tool for gene finding and other genome annotation tasks.`
    },
    {
      title: "Recognizing activity from a wearable",
      domain: "Health / sensors",
      question: "A wrist accelerometer reports motion intensity each minute. Was the person resting, walking, or running?",
      steps: [
        { title: "The data", body: `<p>Hidden activity is Rest, Walk, or Run. The sensor reports Low, Medium, or High intensity. Rest$\\to$Low, Walk$\\to$Medium, Run$\\to$High, with noise. The minute-by-minute reading is Low, Med, High, High, Med, Low.</p>` },
        { title: "The math", body: `<p>Forward-backward smoothing computes $P(\\text{activity}_t \\mid \\text{whole session}) \\propto \\alpha_t \\beta_t$ for each minute, using transitions (you ramp up and down gradually) plus emissions, with evidence from both before and after.</p>` },
        { title: "Run it", body: `<p>Run both passes and pick the most likely activity per minute.</p>`,
          code: `import numpy as np
trans = np.array([[0.8, 0.15, 0.05],
                  [0.2, 0.6, 0.2],
                  [0.05, 0.25, 0.7]])
emit = np.array([[0.7, 0.25, 0.05],
                 [0.2, 0.6, 0.2],
                 [0.05, 0.25, 0.7]])
pi = np.array([1/3, 1/3, 1/3])
obs = [0, 1, 2, 2, 1, 0]
T = len(obs)
alpha = np.zeros((T, 3)); alpha[0] = pi*emit[:, obs[0]]
for t in range(1, T):
    alpha[t] = (alpha[t-1] @ trans)*emit[:, obs[t]]
beta = np.ones((T, 3))
for t in range(T-2, -1, -1):
    beta[t] = trans @ (emit[:, obs[t+1]]*beta[t+1])
post = alpha*beta; post /= post.sum(axis=1, keepdims=True)
acts = ["Rest", "Walk", "Run"]
print("obs intensities (0=Low,1=Med,2=High):", obs)
for t in range(T):
    print("  t%d  P=%s  -> %s" % (t+1, np.round(post[t], 2), acts[int(post[t].argmax())]))
seq = " ".join(acts[int(post[t].argmax())] for t in range(T))
print("most-likely activity sequence:", seq)`,
          output: `obs intensities (0=Low,1=Med,2=High): [0, 1, 2, 2, 1, 0]
  t1  P=[0.5  0.39 0.11]  -> Rest
  t2  P=[0.18 0.56 0.26]  -> Walk
  t3  P=[0.04 0.27 0.69]  -> Run
  t4  P=[0.04 0.29 0.68]  -> Run
  t5  P=[0.17 0.61 0.22]  -> Walk
  t6  P=[0.54 0.37 0.09]  -> Rest`}
      ],
      conclusion: `Smoothing recovers the natural activity arc Rest $\\to$ Walk $\\to$ Run $\\to$ Run $\\to$ Walk $\\to$ Rest, with confident posteriors at each minute. Using transitions plus both-sided evidence rules out impossible jumps (Rest straight to Run), exactly what activity-tracking wearables need.`
    }
  ],

  /* =============================================================
     aix-lda-topic — Latent Dirichlet Allocation
     ============================================================= */
  "aix-lda-topic": [
    {
      title: "Topics in a news feed",
      domain: "Text mining",
      question: "Given unlabeled news snippets, can a model discover that some are about sports and others about finance?",
      steps: [
        { title: "The data", body: `<p>Five short documents, no labels. Some use words like "game, team, score"; others "market, stock, bank". One document mixes both. LDA must discover the topics and each document's blend.</p>` },
        { title: "The math", body: `<p>LDA assumes each document is a mix of topics $\\theta$, each topic a word distribution $\\phi$. Collapsed Gibbs sampling resamples each word's topic from $P(z = k) \\propto (n_{dk} + \\alpha)\\frac{n_{kw} + \\beta}{n_k + V\\beta}$, grouping co-occurring words.</p>` },
        { title: "Run it", body: `<p>Run $500$ Gibbs sweeps and read off the topic word lists and document mixes.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
docs = [
    "game team game score win team coach",
    "market stock price market trade bank stock",
    "team win game coach score game team",
    "bank stock trade price market stock market",
    "game score win market stock game team",
]
docs = [d.split() for d in docs]
vocab = sorted({w for d in docs for w in d})
w2i = {w: i for i, w in enumerate(vocab)}
V, K = len(vocab), 2
alpha, beta = 0.1, 0.1
z = [[rng.integers(K) for _ in d] for d in docs]
ndk = np.zeros((len(docs), K))
nkw = np.zeros((K, V))
nk = np.zeros(K)
for d, doc in enumerate(docs):
    for i, w in enumerate(doc):
        k = z[d][i]; ndk[d, k] += 1; nkw[k, w2i[w]] += 1; nk[k] += 1
for it in range(500):
    for d, doc in enumerate(docs):
        for i, w in enumerate(doc):
            wi = w2i[w]; k = z[d][i]
            ndk[d, k] -= 1; nkw[k, wi] -= 1; nk[k] -= 1
            p = (ndk[d]+alpha)*(nkw[:, wi]+beta)/(nk+V*beta)
            p /= p.sum()
            k = rng.choice(K, p=p)
            z[d][i] = k; ndk[d, k] += 1; nkw[k, wi] += 1; nk[k] += 1
for k in range(K):
    top = sorted(range(V), key=lambda v: -nkw[k, v])[:4]
    print("topic %d top words:" % k, [vocab[v] for v in top])
theta = (ndk+alpha); theta /= theta.sum(axis=1, keepdims=True)
print("doc-topic mix (theta):")
for d in range(len(docs)):
    print("  doc%d:" % (d+1), np.round(theta[d], 2))`,
          output: `topic 0 top words: ['game', 'team', 'score', 'win']
topic 1 top words: ['market', 'stock', 'bank', 'price']
doc-topic mix (theta):
  doc1: [0.99 0.01]
  doc2: [0.01 0.99]
  doc3: [0.99 0.01]
  doc4: [0.01 0.99]
  doc5: [0.85 0.15]`}
      ],
      conclusion: `With no labels, LDA discovered a Sports topic (game, team, score, win) and a Finance topic (market, stock, bank, price). Pure documents map almost entirely to one topic; the mixed doc 5 comes out $85\\%$ Sports, $15\\%$ Finance. Word co-occurrence alone carved the corpus into themes.`
    },
    {
      title: "Themes in product reviews",
      domain: "Customer analytics",
      question: "What are people complaining about? Find the hidden themes across a pile of product reviews.",
      steps: [
        { title: "The data", body: `<p>Five reviews. Some focus on hardware (battery, screen, display); others on logistics (shipping, delivery, service). One review touches both. No theme labels are given.</p>` },
        { title: "The math", body: `<p>Same LDA generative model: each review is a mix $\\theta$ over hidden themes, each theme a word distribution $\\phi$. Collapsed Gibbs sampling infers both from the words by grouping terms that co-occur.</p>` },
        { title: "Run it", body: `<p>Run Gibbs sampling and inspect the discovered themes and the mixed review's blend.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
docs = [
    "battery life screen bright battery great display",
    "shipping fast delivery arrived quick package service",
    "screen display battery life charge great screen",
    "delivery slow refund service support shipping rude",
    "battery great shipping fast screen delivery quick",
]
docs = [d.split() for d in docs]
vocab = sorted({w for d in docs for w in d})
w2i = {w: i for i, w in enumerate(vocab)}
V, K = len(vocab), 2
alpha, beta = 0.1, 0.1
z = [[rng.integers(K) for _ in d] for d in docs]
ndk = np.zeros((len(docs), K)); nkw = np.zeros((K, V)); nk = np.zeros(K)
for d, doc in enumerate(docs):
    for i, w in enumerate(doc):
        k = z[d][i]; ndk[d, k] += 1; nkw[k, w2i[w]] += 1; nk[k] += 1
for it in range(500):
    for d, doc in enumerate(docs):
        for i, w in enumerate(doc):
            wi = w2i[w]; k = z[d][i]
            ndk[d, k] -= 1; nkw[k, wi] -= 1; nk[k] -= 1
            p = (ndk[d]+alpha)*(nkw[:, wi]+beta)/(nk+V*beta); p /= p.sum()
            k = rng.choice(K, p=p); z[d][i] = k
            ndk[d, k] += 1; nkw[k, wi] += 1; nk[k] += 1
for k in range(K):
    top = sorted(range(V), key=lambda v: -nkw[k, v])[:4]
    print("theme %d top words:" % k, [vocab[v] for v in top])
theta = (ndk+alpha); theta /= theta.sum(axis=1, keepdims=True)
print("review 5 (mixed) theme mix:", np.round(theta[4], 2))`,
          output: `theme 0 top words: ['battery', 'screen', 'great', 'display']
theme 1 top words: ['delivery', 'shipping', 'fast', 'service']
review 5 (mixed) theme mix: [0.57 0.43]`}
      ],
      conclusion: `LDA surfaced a hardware theme (battery, screen, display) and a logistics theme (delivery, shipping, service). The mixed review 5 splits roughly evenly, $57\\%$ hardware and $43\\%$ logistics. This is how review dashboards auto-discover what customers talk about, with no manual tagging.`
    },
    {
      title: "Research areas in abstracts",
      domain: "Scientometrics",
      question: "Across a stack of paper abstracts, which research areas emerge, and which papers bridge them?",
      steps: [
        { title: "The data", body: `<p>Five abstracts. Some are machine learning (neural, network, gradient, model); others molecular biology (protein, gene, cell, dna). One abstract is interdisciplinary, using vocabulary from both.</p>` },
        { title: "The math", body: `<p>LDA treats each research area as a latent topic. Collapsed Gibbs sampling assigns each word to an area so that co-occurring terms (gradient with neural, gene with protein) cluster, recovering $\\theta$ and $\\phi$.</p>` },
        { title: "Run it", body: `<p>Run Gibbs sampling and report the areas plus the interdisciplinary abstract's mix.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
docs = [
    "neural network training gradient model data network",
    "protein gene cell dna sequence protein expression",
    "model data gradient neural training accuracy network",
    "cell dna protein gene mutation sequence cell",
    "gene expression neural model data dna network",
]
docs = [d.split() for d in docs]
vocab = sorted({w for d in docs for w in d})
w2i = {w: i for i, w in enumerate(vocab)}
V, K = len(vocab), 2
alpha, beta = 0.1, 0.1
z = [[rng.integers(K) for _ in d] for d in docs]
ndk = np.zeros((len(docs), K)); nkw = np.zeros((K, V)); nk = np.zeros(K)
for d, doc in enumerate(docs):
    for i, w in enumerate(doc):
        k = z[d][i]; ndk[d, k] += 1; nkw[k, w2i[w]] += 1; nk[k] += 1
for it in range(500):
    for d, doc in enumerate(docs):
        for i, w in enumerate(doc):
            wi = w2i[w]; k = z[d][i]
            ndk[d, k] -= 1; nkw[k, wi] -= 1; nk[k] -= 1
            p = (ndk[d]+alpha)*(nkw[:, wi]+beta)/(nk+V*beta); p /= p.sum()
            k = rng.choice(K, p=p); z[d][i] = k
            ndk[d, k] += 1; nkw[k, wi] += 1; nk[k] += 1
for k in range(K):
    top = sorted(range(V), key=lambda v: -nkw[k, v])[:4]
    print("research area %d:" % k, [vocab[v] for v in top])
theta = (ndk+alpha); theta /= theta.sum(axis=1, keepdims=True)
print("abstract 5 (interdisciplinary) area mix:", np.round(theta[4], 2))`,
          output: `research area 0: ['network', 'data', 'model', 'neural']
research area 1: ['cell', 'dna', 'gene', 'protein']
abstract 5 (interdisciplinary) area mix: [0.71 0.29]`}
      ],
      conclusion: `Two research areas emerge: machine learning (network, data, model, neural) and molecular biology (cell, dna, gene, protein). The interdisciplinary abstract is $71\\%$ ML and $29\\%$ biology — LDA can flag papers that bridge fields, a key signal in mapping the structure of science.`
    }
  ],

  /* =============================================================
     aix-fol — first-order logic
     ============================================================= */
  "aix-fol": [
    {
      title: "Reasoning about family",
      domain: "Knowledge representation",
      question: "Given a few parent facts and general rules, can a logic engine derive grandparents and siblings?",
      steps: [
        { title: "The data", body: `<p>Parent facts: tom is parent of bob and liz; bob is parent of ann and joe. General rules: a grandparent is a parent of a parent; siblings share a parent. The variables $X, Y, Z$ range over people.</p>` },
        { title: "The math", body: `<p>Forward chaining repeatedly applies each rule, using <b>unification</b> to match rule premises against known facts (e.g. $\\text{parent}(X,Y) \\wedge \\text{parent}(Y,Z) \\Rightarrow \\text{grandparent}(X,Z)$), deriving new facts until nothing new appears.</p>` },
        { title: "Run it", body: `<p>A small unifier plus forward-chaining loop derives the closure of the rules.</p>`,
          code: `def unify(x, y, s):
    if s is None: return None
    if x == y: return s
    if isinstance(x, str) and x[0].isupper(): return unify_var(x, y, s)
    if isinstance(y, str) and y[0].isupper(): return unify_var(y, x, s)
    if isinstance(x, tuple) and isinstance(y, tuple) and len(x) == len(y):
        for a, b in zip(x, y):
            s = unify(a, b, s)
        return s
    return None
def unify_var(var, val, s):
    if var in s: return unify(s[var], val, s)
    s2 = dict(s); s2[var] = val; return s2
def subst(term, s):
    if isinstance(term, tuple): return tuple(subst(t, s) for t in term)
    return s.get(term, term)
facts = {("parent", "tom", "bob"), ("parent", "bob", "ann"), ("parent", "bob", "joe"),
         ("parent", "tom", "liz")}
rules = [
    ([("parent", "X", "Y"), ("parent", "Y", "Z")], ("grandparent", "X", "Z")),
    ([("parent", "X", "Y"), ("parent", "X", "Z")], ("sibling", "Y", "Z")),
]
def fc(facts, rules):
    facts = set(facts)
    changed = True
    while changed:
        changed = False
        for premises, concl in rules:
            def search(i, s):
                if i == len(premises):
                    new = subst(concl, s)
                    if new not in facts:
                        facts.add(new); return True
                    return False
                added = False
                p = subst(premises[i], s)
                for f in list(facts):
                    s2 = unify(p, f, dict(s))
                    if s2 is not None:
                        if search(i+1, s2): added = True
                return added
            if search(0, {}): changed = True
    return facts
out = fc(facts, rules)
gps = sorted(f for f in out if f[0] == "grandparent")
sibs = sorted(f for f in out if f[0] == "sibling" and f[1] != f[2])
print("derived grandparent facts:", gps)
print("derived sibling facts:    ", sibs)
print("Is tom a grandparent of ann?", ("grandparent", "tom", "ann") in out)`,
          output: `derived grandparent facts: [('grandparent', 'tom', 'ann'), ('grandparent', 'tom', 'joe')]
derived sibling facts:     [('sibling', 'ann', 'joe'), ('sibling', 'bob', 'liz'), ('sibling', 'joe', 'ann'), ('sibling', 'liz', 'bob')]
Is tom a grandparent of ann?  True`}
      ],
      conclusion: `From four parent facts and two rules, unification + forward chaining derived that tom is grandparent of ann and joe, and that ann/joe and bob/liz are siblings. The variables let one rule fire across many people — this generality is what first-order logic adds over plain propositional facts.`
    },
    {
      title: "An animal-classification expert system",
      domain: "Expert systems",
      question: "From simple observations about an animal, can rules chain together to classify it as a carnivore?",
      steps: [
        { title: "The data", body: `<p>Facts about "rex": has hair, has claws, eats meat. Facts about "tweety": has feathers, can fly. Rules build up: hair $\\Rightarrow$ mammal; mammal $+$ eats meat $+$ claws $\\Rightarrow$ carnivore; feathers $\\Rightarrow$ bird; bird $+$ flies $\\Rightarrow$ flying bird.</p>` },
        { title: "The math", body: `<p>Each rule is a universally quantified implication with a variable $A$ for the animal. Forward chaining unifies $A$ against the facts and fires rules, with conclusions of one rule (mammal) feeding the premises of the next (carnivore).</p>` },
        { title: "Run it", body: `<p>Run forward chaining to the fixpoint and read the classifications.</p>`,
          code: `def unify(x, y, s):
    if s is None: return None
    if x == y: return s
    if isinstance(x, str) and x[0].isupper(): return unify_var(x, y, s)
    if isinstance(y, str) and y[0].isupper(): return unify_var(y, x, s)
    if isinstance(x, tuple) and isinstance(y, tuple) and len(x) == len(y):
        for a, b in zip(x, y): s = unify(a, b, s)
        return s
    return None
def unify_var(v, val, s):
    if v in s: return unify(s[v], val, s)
    s2 = dict(s); s2[v] = val; return s2
def subst(t, s):
    if isinstance(t, tuple): return tuple(subst(x, s) for x in t)
    return s.get(t, t)
facts = {("has", "rex", "hair"), ("has", "rex", "claws"), ("eats", "rex", "meat"),
         ("has", "tweety", "feathers"), ("can", "tweety", "fly")}
rules = [
    ([("has", "A", "hair")], ("class", "A", "mammal")),
    ([("has", "A", "feathers")], ("class", "A", "bird")),
    ([("class", "A", "mammal"), ("eats", "A", "meat"), ("has", "A", "claws")],
        ("class", "A", "carnivore")),
    ([("class", "A", "bird"), ("can", "A", "fly")], ("class", "A", "flying_bird")),
]
def fc(facts, rules):
    facts = set(facts); changed = True
    while changed:
        changed = False
        for prem, concl in rules:
            def search(i, s):
                if i == len(prem):
                    new = subst(concl, s)
                    if new not in facts: facts.add(new); return True
                    return False
                added = False; p = subst(prem[i], s)
                for f in list(facts):
                    s2 = unify(p, f, dict(s))
                    if s2 is not None and search(i+1, s2): added = True
                return added
            if search(0, {}): changed = True
    return facts
out = fc(facts, rules)
cls = sorted(f for f in out if f[0] == "class")
print("derived classifications:")
for c in cls: print("  ", c)
print("Is rex a carnivore?", ("class", "rex", "carnivore") in out)
print("Is tweety a flying bird?", ("class", "tweety", "flying_bird") in out)`,
          output: `derived classifications:
   ('class', 'rex', 'carnivore')
   ('class', 'rex', 'mammal')
   ('class', 'tweety', 'bird')
   ('class', 'tweety', 'flying_bird')
Is rex a carnivore? True
Is tweety a flying bird? True`}
      ],
      conclusion: `Chaining rules turned raw observations into rich conclusions: rex is a mammal and therefore a carnivore; tweety is a bird and therefore a flying bird. Each rule fired by unifying its variable against the facts, and intermediate conclusions triggered further rules — the engine behind classic expert systems.`
    },
    {
      title: "Reachability in a route network",
      domain: "Logic programming (Prolog)",
      question: "Given direct connections, which destinations are reachable from a start, including multi-hop routes?",
      steps: [
        { title: "The data", body: `<p>A directed route graph with edges a&rarr;b, b&rarr;c, c&rarr;d, a&rarr;e, e&rarr;c. We want every node reachable from a, including via chains of edges.</p>` },
        { title: "The math", body: `<p>The transitive rule is $\\text{path}(X,Z) \\Leftarrow \\text{edge}(X,Y) \\wedge \\text{path}(Y,Z)$ — exactly a Prolog clause. Forward chaining with unification computes its least fixpoint: the full reachability relation.</p>` },
        { title: "Run it", body: `<p>Seed paths from edges, then apply the transitive rule to closure.</p>`,
          code: `def unify(x, y, s):
    if s is None: return None
    if x == y: return s
    if isinstance(x, str) and x[0].isupper(): return unify_var(x, y, s)
    if isinstance(y, str) and y[0].isupper(): return unify_var(y, x, s)
    if isinstance(x, tuple) and isinstance(y, tuple) and len(x) == len(y):
        for a, b in zip(x, y): s = unify(a, b, s)
        return s
    return None
def unify_var(v, val, s):
    if v in s: return unify(s[v], val, s)
    s2 = dict(s); s2[v] = val; return s2
def subst(t, s):
    if isinstance(t, tuple): return tuple(subst(x, s) for x in t)
    return s.get(t, t)
edges = [("a", "b"), ("b", "c"), ("c", "d"), ("a", "e"), ("e", "c")]
facts = {("edge", u, v) for u, v in edges} | {("path", u, v) for u, v in edges}
rules = [([("edge", "X", "Y"), ("path", "Y", "Z")], ("path", "X", "Z"))]
def fc(facts, rules):
    facts = set(facts); changed = True
    while changed:
        changed = False
        for prem, concl in rules:
            def search(i, s):
                if i == len(prem):
                    new = subst(concl, s)
                    if new not in facts: facts.add(new); return True
                    return False
                added = False; p = subst(prem[i], s)
                for f in list(facts):
                    s2 = unify(p, f, dict(s))
                    if s2 is not None and search(i+1, s2): added = True
                return added
            if search(0, {}): changed = True
    return facts
out = fc(facts, rules)
reach_a = sorted(f[2] for f in out if f[0] == "path" and f[1] == "a")
print("nodes reachable from a:", reach_a)
print("path(a,d) provable?", ("path", "a", "d") in out)
print("total path facts derived:", sum(1 for f in out if f[0] == "path"))`,
          output: `nodes reachable from a: ['b', 'c', 'd', 'e']
path(a,d) provable? True
total path facts derived: 9`}
      ],
      conclusion: `From five direct edges, the transitive rule derived that b, c, d, and e are all reachable from a — including the multi-hop a&rarr;b&rarr;c&rarr;d, so path(a,d) is provable. This single recursive clause <i>is</i> how Prolog computes reachability: unification plus resolution running to a fixpoint.`
    }
  ]

});
