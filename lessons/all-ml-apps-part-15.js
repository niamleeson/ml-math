/* All ML — Part 15 applications (5 each). Loaded after content-part-15.js, before all-ml-register.js. */

/* ---- _apps-part15-A.js ---- */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

(window.ALLML_CONTENT["15.1"] = window.ALLML_CONTENT["15.1"] || {}).applications = [
  { title: "Streaming/video recommendations", background: "<p>Streaming shelves historically used collaborative evidence because viewers reveal taste through watch and rating overlap long before every title has rich metadata.</p>", numbers: "<p>For Ava, the lesson compares two neighbors on items 0, 1, and 3: $s(0,2)=13/27.495=0.473$ and $s(0,3)=9/33.045=0.272$. Their ratings 5 and 4 give $\hat r=(0.473\cdot5+0.272\cdot4)/(0.473+0.272)=4.635$.</p>" },
  { title: "Marketplace product rows", background: "<p>Product recommenders often switch from user-user to item-item evidence because item co-occurrence can be more stable than sparse shopper overlap.</p>", numbers: "<p>Using Ava's rated items, similarities to the target are 1.000, 0.994, and 0.976, so $\hat r=(1.000\cdot5+0.994\cdot4+0.976\cdot1)/(1.000+0.994+0.976)=3.351$.</p>" },
  { title: "Job/course recommendations", background: "<p>Education and job platforms need to remove rating-scale bias because some members rate every course generously while others reserve high scores.</p>", numbers: "<p>Mean-centering starts Ava at $3.333$. The weighted residual is $0.971\cdot1.250+0.956\cdot0.750=1.932$ and $1.932/1.927=1.002$, giving $3.333+1.002=4.335$.</p>" },
  { title: "Social/content feeds", background: "<p>Feeds may have massive catalogs but tiny pairwise overlap, so the overlap count matters as much as the cosine value.</p>", numbers: "<p>The lesson's first neighbor cosine uses only 3 shared items: numerator $5\cdot1+4\cdot1+1\cdot4=13$ and denominator $\sqrt{42}\sqrt{18}=27.495$, so the visible $0.473$ has high variance.</p>" },
  { title: "Email/news personalization", background: "<p>Newsletter systems can accidentally recommend the same head article to everyone if popularity is used as a fallback without normalized similarity.</p>", numbers: "<p>In the 4-item toy slate, item-item evidence totals $9.951/2.970=3.351$, while user-user evidence gives $3.452/0.745=4.635$, illustrating how the fallback axis changes the top item.</p>" }
];

(window.ALLML_CONTENT["15.2"] = window.ALLML_CONTENT["15.2"] || {}).applications = [
  { title: "Movie recommendation", background: "<p>Low-rank movie recommenders compress viewers and movies into a few latent coordinates so sparse ratings can share statistical strength.</p>", numbers: "<p>For user factor $p_0=(1.2,0.2)$ and item factor $q_0=(4.0,0.2)$, the score is $1.2\cdot4.0+0.2\cdot0.2=4.840$.</p>" },
  { title: "Music taste embeddings", background: "<p>Music services use latent mismatch to avoid recommending every globally popular song to every listener.</p>", numbers: "<p>The same user with item $q_2=(0.2,3.7)$ scores $1.2\cdot0.2+0.2\cdot3.7=0.240+0.740=0.980$, showing weak alignment.</p>" },
  { title: "Retail personalization", background: "<p>Retail catalogs reuse hidden coordinates for brand, price, and style-like patterns even when those names are not manually supplied.</p>", numbers: "<p>User 2 and item 2 align as $0.1\cdot0.2+1.3\cdot3.7=0.020+4.810=4.830$, so the second latent coordinate dominates.</p>" },
  { title: "Rating prediction services", background: "<p>Online factor updates move user and item embeddings after each observed rating error.</p>", numbers: "<p>Starting from prediction $2.480$ for a 5-star event, one step gives $p'=(1.174,0.249)$ and $q'=(3.086,0.423)$, raising the dot product to $3.728$.</p>" },
  { title: "Catalog compression", background: "<p>Low rank is a storage and generalization choice: the model must explain many cells with a small number of reusable causes.</p>", numbers: "<p>On the lesson matrix, reconstruction error falls from rank-1 $7.141$ to rank-2 $1.414$ and rank-4 $0.000$, showing the capacity tradeoff.</p>" }
];

(window.ALLML_CONTENT["15.3"] = window.ALLML_CONTENT["15.3"] || {}).applications = [
  { title: "New-item launch ranking", background: "<p>Cold launch inventory has no clicks yet, so content features keep it eligible instead of assigning a fake zero collaborative score.</p>", numbers: "<p>The lesson's cold item keeps a content fallback score of $0.820$, which is unknown collaboration handled as content evidence rather than $0$.</p>" },
  { title: "Article/product similarity", background: "<p>Content recommenders build user profiles from attributes of previously liked articles or products.</p>", numbers: "<p>With features and ratings 5, 4, and 1, the weighted sum is $(9,5,6)$ and the rating sum is 10, so $p=(0.900,0.500,0.600)$.</p>" },
  { title: "Creative/content matching", background: "<p>Creative matching scores candidate assets by cosine similarity to the advertiser or member profile.</p>", numbers: "<p>The candidates score $0.744$, $0.643$, and $0.819$; candidate $(1,1,0)$ wins because it matches the two strongest profile coordinates.</p>" },
  { title: "Hybrid feed ranking", background: "<p>Feeds blend behavior and content because each signal wins under different data conditions.</p>", numbers: "<p>With $\alpha=0.4$, item B scores $0.4\cdot0.74+0.6\cdot0.90=0.836$, beating A at $0.496$ and C at $0.760$.</p>" },
  { title: "Cold inventory surfacing", background: "<p>Marketplaces need to surface new items enough to collect evidence without confusing missing collaboration for negative feedback.</p>", numbers: "<p>In a 3-candidate illustrative slate, replacing missing collaboration with content can preserve a new item at $0.820$ instead of pushing it below known items by assigning $0$.</p>" }
];

(window.ALLML_CONTENT["15.4"] = window.ALLML_CONTENT["15.4"] || {}).applications = [
  { title: "Search result ranking", background: "<p>Search rankers often start with pointwise click labels, but the loss reveals whether unclicked high scores are costly.</p>", numbers: "<p>For labels $(1,0,1)$ and scores $(2.0,0.5,1.0)$, losses $0.127$, $0.974$, and $0.313$ average to $0.471$.</p>" },
  { title: "Ads auction ordering", background: "<p>Ads auctions care that a better ad beats a worse one by enough margin, not just that each has a calibrated score.</p>", numbers: "<p>With $s_+=1.2$ and $s_-=0.7$, the gap is $0.500$, so hinge loss is $\max(0,1-0.500)=0.500$.</p>" },
  { title: "Feed ranking", background: "<p>Smooth pairwise losses keep pressure on hard negatives even after the positive item is slightly ahead.</p>", numbers: "<p>The same gap gives $\log(1+e^{-0.500})=0.474$, so training still improves the pair.</p>" },
  { title: "Homepage slates", background: "<p>Listwise training normalizes within the candidate slate so all competitors affect the target item's probability.</p>", numbers: "<p>For scores $(2.0,0.5,1.0)$, the target probability is $7.389/(7.389+1.649+2.718)=0.629$ and loss is $-\log0.629=0.464$.</p>" },
  { title: "Candidate re-ranking", background: "<p>Re-rankers use listwise gradients to move the top target up while moving every slate competitor down.</p>", numbers: "<p>The softmax gradient is $(0.629-1,0.140,0.231)=(-0.371,0.140,0.231)$ for the 3-item lesson slate.</p>" }
];

(window.ALLML_CONTENT["15.5"] = window.ALLML_CONTENT["15.5"] || {}).applications = [
  { title: "Web search relevance", background: "<p>Web search uses graded relevance because a perfect answer at rank 1 is more valuable than a marginally related page.</p>", numbers: "<p>For relevance $(3,2,0,1)$, DCG is $7/1+3/1.585+0/2+1/2.322=9.323$.</p>" },
  { title: "Shopping search", background: "<p>Shopping systems compare the shown order with the best possible ordering to normalize by query difficulty.</p>", numbers: "<p>The ideal graded ordering has $IDCG=9.393$, so the lesson list has $NDCG=9.323/9.393=0.993$.</p>" },
  { title: "Recommendation shelves", background: "<p>Recommendation shelves often care about multiple useful hits, making average precision more informative than first-hit metrics.</p>", numbers: "<p>Binary hits $(1,0,1,1,0)$ have precisions $1.000$, $0.667$, and $0.750$, so $AP=(1.000+0.667+0.750)/3=0.806$.</p>" },
  { title: "Question answering", background: "<p>Question answering often needs one correct result quickly, so reciprocal rank is intentionally first-success focused.</p>", numbers: "<p>For hits $(0,0,1,1,0)$, the first relevant result appears at rank 3, so $MRR=1/3=0.333$.</p>" },
  { title: "Feed evaluation", background: "<p>Feed metrics must use the same cutoff across experiments because users experience only a finite visible prefix.</p>", numbers: "<p>NDCG@10 and NDCG@100 answer different surfaces: the first discounts 10 positions, while the second gives credit across 100 positions.</p>" }
];

(window.ALLML_CONTENT["15.6"] = window.ALLML_CONTENT["15.6"] || {}).applications = [
  { title: "Sponsored content ranking", background: "<p>Sponsored content rankers turn a real-valued logit into a click probability consumed by ranking and bidding systems.</p>", numbers: "<p>With base $-1.2$, user contribution $0.7$, and item contribution $0.4$, $z=-0.100$ and $p=1/(1+e^{0.100})=0.475$.</p>" },
  { title: "Ads feature crosses", background: "<p>Wide crosses capture pair-specific lifts that main effects miss, such as a member segment interacting with an advertiser category.</p>", numbers: "<p>Without the cross, $z=-2.0+0.5+0.4=-1.100$ gives $p=0.250$; adding cross weight $1.2$ gives $z=0.100$ and $p=0.525$.</p>" },
  { title: "Marketplace recommendation", background: "<p>FM interactions reuse embedding dots to model sparse categorical combinations without hand-building every cross.</p>", numbers: "<p>Embedding dots are $0.130$, $0.360$, and $0.180$, so the FM interaction sum is $0.670$.</p>" },
  { title: "Feed ranking", background: "<p>DeepFM-style rankers combine linear memorization, FM pair interactions, and a small nonlinear term.</p>", numbers: "<p>Linear $-0.300$, FM $0.670$, and deep $0.250$ produce $z=0.620$ and $p=\sigma(0.620)=0.650$.</p>" },
  { title: "Bidding/pacing systems", background: "<p>Bidding systems need calibrated probabilities, so negative downsampling must be corrected before treating scores as CTR.</p>", numbers: "<p>For illustrative 10:1 negative downsampling, the logit needs an intercept correction of $\log(0.1)=-2.303$ before reading $\sigma(z)$ as real CTR.</p>" }
];

/* ---- _apps-part15-B.js ---- */
/* All ML — Part 15B (Recommender Systems & Ranking) lesson applications for 15.7–15.11. */
(window.ALLML_CONTENT["15.7"] = window.ALLML_CONTENT["15.7"] || {}).applications = [
  {
    title: "Large-catalog retrieval",
    background: "<p>Two-tower retrieval is used when a ranker cannot score every item in a huge catalog. The user tower creates one request-time vector, and an item-vector index retrieves a small candidate set before deeper ranking.</p>",
    numbers: "<p>With user vector $(1.0,0.2)$, item dot scores are $1.020$, $0.880$, $0.300$, and $-0.340$, so the nearest retrieved item is the first item before any second-stage ranker runs.</p>"
  },
  {
    title: "Video candidate generation",
    background: "<p>Video surfaces often use a retrieval model to narrow millions of clips to a few hundred plausible candidates. Sampled softmax trains the model to separate watched positives from sampled negatives.</p>",
    numbers: "<p>For positive score $2.0$ and negative scores $1.0$ and $0.0$, $e^2/(e^2+e^1+e^0)=7.389/11.107=0.665$.</p>"
  },
  {
    title: "Job recommendation retrieval",
    background: "<p>Job and member towers can be indexed separately, making retrieval fast enough for request-time personalization. The contrastive loss gives a direct training signal when the applied or viewed job should beat negatives.</p>",
    numbers: "<p>The same sampled-softmax probability $0.665$ gives loss $-\log(0.665)=0.408$, the value asserted in the lesson notebook.</p>"
  },
  {
    title: "ANN index serving",
    background: "<p>Approximate nearest-neighbor serving depends on score geometry. Temperature is a training knob that changes how strongly the model reacts to score gaps before vectors are indexed.</p>",
    numbers: "<p>For scores $(2,1,0)$, temperature $T=0.5$ gives positive probability $0.867$, $T=1.0$ gives $0.665$, and $T=2.0$ gives $0.506$.</p>"
  },
  {
    title: "Batch training systems",
    background: "<p>In-batch negatives make training efficient because every other example's item can act as a negative without extra sampling. This is a practical reason two-tower models scale well.</p>",
    numbers: "<p>A batch of $3$ matched user-item pairs forms a $3\times3$ score matrix, giving $3$ positives on the diagonal and $6$ in-batch negatives off the diagonal.</p>"
  }
];

(window.ALLML_CONTENT["15.8"] = window.ALLML_CONTENT["15.8"] || {}).applications = [
  {
    title: "Short-video next-item ranking",
    background: "<p>Short-video sessions can shift intent within seconds, so the latest watches often matter more than a lifetime average. A recency-weighted session vector summarizes that current intent.</p>",
    numbers: "<p>With embeddings $(1,0)$, $(0,1)$, $(1,1)$ and weights $(0.2,0.3,0.5)$, the session vector is $h=(0.2+0+0.5,0+0.3+0.5)=(0.700,0.800)$.</p>"
  },
  {
    title: "Shopping journeys",
    background: "<p>Shopping recommenders use transition patterns such as browsing a product and then viewing accessories. A first-order Markov row provides a simple, interpretable next-step baseline.</p>",
    numbers: "<p>From sessions $[0,1,2]$, $[0,1,1]$, and $[1,2,0]$, transitions after item $1$ are two to item $2$ and one to item $1$, so $P(2\mid1)=2/3=0.667$.</p>"
  },
  {
    title: "News sessions",
    background: "<p>News intent changes with the story a reader is following. Attention lets the current query choose which prior click matters instead of averaging the entire session uniformly.</p>",
    numbers: "<p>Query $(1,0.2)$ gives attention dots $(1.000,0.200,1.200)$, whose softmax weights are approximately $(0.374,0.168,0.457)$.</p>"
  },
  {
    title: "Search refinement",
    background: "<p>Search recommenders must use only events before the prediction point. Attention over the prefix can preserve the useful context without leaking the clicked result being predicted.</p>",
    numbers: "<p>The lesson attention weights produce context $0.374(1,0)+0.168(0,1)+0.457(1,1)=(0.832,0.626)$.</p>"
  },
  {
    title: "Cold new-user sessions",
    background: "<p>A new user may have no stable profile, but a three-click session is already enough to reveal immediate intent. Sequential ranking bridges cold-start personalization before a long history exists.</p>",
    numbers: "<p>Illustratively, after only $3$ events, recency weights $(0.2,0.3,0.5)$ put $50\%$ of the profile on the latest click, so current intent can dominate an empty lifetime average.</p>"
  }
];

(window.ALLML_CONTENT["15.9"] = window.ALLML_CONTENT["15.9"] || {}).applications = [
  {
    title: "New creator/item onboarding",
    background: "<p>New inventory often has too few impressions for raw click-through rate to be reliable. Cold-start systems must avoid mistaking uncertainty for quality.</p>",
    numbers: "<p>Clicks $(50,20,5)$ over impressions $(1000,200,20)$ have raw CTRs $0.050$, $0.100$, and $0.250$, which would over-rank the $20$-impression item.</p>"
  },
  {
    title: "Marketplace launch inventory",
    background: "<p>Bayesian shrinkage pulls tiny-denominator estimates toward a prior until the item has enough evidence. This keeps launch inventory eligible without letting noise dominate.</p>",
    numbers: "<p>With $\operatorname{Beta}(10,190)$, the estimates become $(50+10)/(1000+200)=0.050$, $(20+10)/(200+200)=0.075$, and $(5+10)/(20+200)=0.068$.</p>"
  },
  {
    title: "Content fallback ranking",
    background: "<p>A new item can still be ranked from attributes such as topic, format, or creator category. Content similarity is a legitimate score before collaborative history exists.</p>",
    numbers: "<p>For new item $(1,1)$ and profile $(1,0.5)$, cosine is $1.5/(\sqrt{1.25}\sqrt{2})=0.949$.</p>"
  },
  {
    title: "New-user personalization",
    background: "<p>As a new user accumulates actions, systems can blend a prior or onboarding profile with behavior. The weight should grow gradually rather than switching abruptly.</p>",
    numbers: "<p>With $w=n/(n+5)$ at $n=20$, the blend $(1-w)0.06+w0.18$ uses $w=0.8$ and scores $0.156$.</p>"
  },
  {
    title: "Exploration allocation",
    background: "<p>Cold items need allocated exposure to collect the impressions required for reliable estimates. A small warm start is often enough to move from pure prior to mixed evidence.</p>",
    numbers: "<p>Illustratively, $5$ warm-start events give $w=5/(5+5)=0.5$, so prior and behavior each contribute half of the blended score.</p>"
  }
];

(window.ALLML_CONTENT["15.10"] = window.ALLML_CONTENT["15.10"] || {}).applications = [
  {
    title: "Homepage exploration",
    background: "<p>Homepage recommenders can reserve a controlled fraction of traffic for exploration while mostly exploiting the current best arm. Epsilon-greedy makes that tradeoff explicit.</p>",
    numbers: "<p>With $\varepsilon=0.2$ over $3$ arms, each arm gets $0.2/3=0.067$ exploration mass and the best arm gets $0.8+0.067=0.867$.</p>"
  },
  {
    title: "New-item discovery",
    background: "<p>Upper confidence bounds promote uncertain arms, which helps new items receive data even when their current mean is low. The bonus shrinks as pulls accumulate.</p>",
    numbers: "<p>With means $(0.05,0.08,0.04)$, pulls $(100,20,5)$, and $t=125$, UCB scores are $0.361$, $0.775$, and $1.430$, so arm C is explored.</p>"
  },
  {
    title: "Ads creative testing",
    background: "<p>Thompson sampling treats each creative's CTR as a posterior distribution. Sampling from those posteriors naturally balances promising means with uncertainty.</p>",
    numbers: "<p>Clicks $(5,8,1)$ and non-clicks $(95,92,19)$ give Beta posterior means $6/102=0.059$, $9/102=0.088$, and $2/22=0.091$.</p>"
  },
  {
    title: "Feed experimentation",
    background: "<p>Regret makes the cost of learning visible. Each exploratory recommendation is compared with the best arm that would have been chosen with full information.</p>",
    numbers: "<p>If best reward is $0.10$ and chosen rewards are $(0.05,0.08,0.04,0.10,0.08)$, cumulative regret is $(0.05,0.07,0.13,0.13,0.15)$.</p>"
  },
  {
    title: "Safe exploration",
    background: "<p>Production bandits should not randomize over unsafe or ineligible candidates. Guardrails filter the action set before epsilon, UCB, or Thompson selection.</p>",
    numbers: "<p>Illustratively, if a $3$-item slate has one ineligible item, recall@3 should be tracked over the eligible set of $2$ candidates rather than sending random traffic to all $3$.</p>"
  }
];

(window.ALLML_CONTENT["15.11"] = window.ALLML_CONTENT["15.11"] || {}).applications = [
  {
    title: "Offline recommender holdouts",
    background: "<p>Holdout metrics estimate whether hidden positives are retrieved, but they are only trustworthy when the held-out labels represent what users could have seen.</p>",
    numbers: "<p>In the lesson's $3$-user example, recalls are $2/2=1.000$, $1/1=1.000$, and $1/1=1.000$, so mean recall@3 is $1.000$.</p>"
  },
  {
    title: "Exposure-biased logs",
    background: "<p>Logs reveal only what the old policy exposed. Unshown relevant items are missing labels, not irrelevant labels.</p>",
    numbers: "<p>True relevance $(1,1,0,1)$ has $3$ positives, but exposure $(1,0,1,0)$ reveals observed positives $(1,0,0,0)$, only $1$ of $3$.</p>"
  },
  {
    title: "Counterfactual ads evaluation",
    background: "<p>Inverse propensity scoring reweights rare exposures so logged outcomes can estimate a different policy. The same weights can be high variance when propensities are small.</p>",
    numbers: "<p>For clicks $(1,0,1)$ and propensities $(0.5,0.2,0.1)$, IPS is $(1/0.5+0/0.2+1/0.1)/3=4.000$, while naive mean click is $0.667$.</p>"
  },
  {
    title: "Feed position-bias correction",
    background: "<p>Lower ranks receive fewer examinations, so equal relevance can produce lower observed click rates. Position-aware correction separates relevance from visibility.</p>",
    numbers: "<p>If relevance is $0.5$ and examination probabilities are $(1.0,0.6,0.3,0.15)$, observed rates are $(0.500,0.300,0.150,0.075)$.</p>"
  },
  {
    title: "Feedback-loop monitoring",
    background: "<p>A recommender that keeps showing head items gathers more head-item labels, which can make future offline evaluation even more head-biased. Monitoring diversity helps catch that loop.</p>",
    numbers: "<p>Illustratively, if a head item receives $80$ of $100$ logged impressions, then $80\%$ of future labels come from one item even before the next model is trained.</p>"
  }
];

