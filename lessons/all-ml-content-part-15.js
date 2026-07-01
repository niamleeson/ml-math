/* All ML — authored content for Part 15: Recommender Systems & Ranking (15.1–15.11).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Every number here was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 15.1 Collaborative filtering ---------------- */
window.ALLML_CONTENT["15.1"] = {
  tagline: "Recommendations can be made from people who behaved alike, even when we know almost nothing about the items themselves.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/15.1-collaborative-filtering.ipynb",
  context: String.raw`
    <p>This lesson starts the recommender block with the oldest useful signal: the user-item interaction matrix.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the matrix view: rows are users, columns are items, and missing entries are the ratings or clicks we want to infer.</li>
      <li><b>Cosine similarity</b> turns overlapping behavior into a neighbor weight; the dot product is literally the evidence-sharing mechanism.</li>
      <li><b>Generalization from sparse samples</b> connects back to Part 1: a neighbor estimate is only trustworthy when overlap is large enough.</li>
    </ul>
    <p>Where it leads: collaborative filtering is the hand-built ancestor of matrix factorization (15.2), neural retrieval (15.7), and cold-start fixes (15.9), which exist because pure collaboration fails when history is sparse.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple: Ava has not rated item 3, but we must decide whether to show it. The naive approach is global popularity, which ignores that Ava may have unusual taste. Collaborative filtering asks a wiser question: who or what behaved like Ava before?</p>
    <p>The mental model is borrowing judgment from neighbors. User-user filtering says similar people are votes; item-item filtering says similar things are evidence. The design decision people gloss over is <b>which axis to compare</b>. User neighbors adapt to personal taste but become noisy when users overlap on few items; item neighbors are often more stable because popular items accumulate many co-ratings.</p>`,
  mathematics: String.raw`
    <p>Let $R\in\mathbb{R}^{m\times n}$ be the sparse user-item matrix, $r_{ui}$ the observed rating, and $N(u)$ the neighbor users who rated item $i$. A basic user-user prediction is</p>
    <div class="formula-box">$$\hat r_{ui}=\frac{\sum_{v\in N(u)} s(u,v)r_{vi}}{\sum_{v\in N(u)} s(u,v)},\qquad s(u,v)=\frac{R_u\cdot R_v}{\|R_u\|_2\|R_v\|_2}$$</div>
    <p>In the toy matrix $[[5,4,0,1],[4,5,0,1],[1,1,5,4],[0,1,4,5]]$, using items 0, 1, and 3 to compare Ava to users 2 and 3 gives:</p>
    <ol class="work">
      <li>$s(0,2)=\frac{5\cdot1+4\cdot1+1\cdot4}{\sqrt{42}\sqrt{18}}=13/27.495=0.473$</li>
      <li>$s(0,3)=\frac{5\cdot0+4\cdot1+1\cdot5}{\sqrt{42}\sqrt{26}}=9/33.045=0.272$</li>
      <li>$\hat r_{0,2}=\frac{0.473\cdot5+0.272\cdot4}{0.473+0.272}=3.452/0.745=4.635$</li>
    </ol>
    <p>The missing rating is high because both neighbors liked item 3, and the closer neighbor receives more weight.</p>
    <p>Mean-centering changes the question from "who rates high?" to "who likes this more than usual?" On a closely related tiny matrix where the centered neighbors have positive correlation, Ava's mean is $3.333$ and the prediction is:</p>
    <ol class="work">
      <li>neighbor residuals for item 3: user 2 has $5-2.750=2.250$, user 3 has $4-3.333=0.667$</li>
      <li>weighted residual $=0.971\cdot1.250+0.956\cdot0.750=1.932$; divide by $1.927$ gives $1.002$</li>
      <li>$\hat r_{0,2}=3.333+1.002=4.335$</li>
    </ol>
    <p>The centered answer is still positive, but less extreme, because it corrects for users who generally rate high or low. Item-item filtering on Ava's rated items gives a different estimate:</p>
    <ol class="work">
      <li>similarities to items 0, 1, and 3 are $1.000$, $0.994$, and $0.976$</li>
      <li>$\hat r_{0,2}=\frac{1.000\cdot5+0.994\cdot4+0.976\cdot1}{1.000+0.994+0.976}=9.951/2.970=3.351$</li>
    </ol>
    <p>That lower score is the important lesson: changing the neighborhood definition changes the evidence being averaged, not merely the implementation.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Treating missing as zero.</b> In $R$, a zero often means unobserved, not disliked; putting it into the dot product creates fake negative evidence.</li>
      <li><b>Trusting tiny overlaps.</b> The cosine denominator can look clean even when two users share only one item; the similarity then has high variance.</li>
      <li><b>Forgetting mean shifts.</b> Without centering, generous raters dominate $\hat r_{ui}$ through rating scale rather than taste.</li>
      <li><b>Letting popularity masquerade as personalization.</b> Item neighbors built from very popular items can recommend the same head items to everyone unless similarities are normalized carefully.</li>
    </ul>`
};

/* ---------------- 15.2 Matrix factorization ---------------- */
window.ALLML_CONTENT["15.2"] = {
  tagline: "A sparse rating matrix becomes two small tables of hidden user and item traits whose dot product fills the gaps.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/15.2-matrix-factorization.ipynb",
  context: String.raw`
    <p>Matrix factorization compresses the neighbor idea from 15.1 into learned coordinates.</p>
    <ul>
      <li><b>Dot products</b> become the scoring rule: a user factor and item factor align when the predicted rating should be high.</li>
      <li><b>Gradient descent</b> supplies the update rule that moves factors after each observed rating error.</li>
      <li><b>Regularization</b> controls the capacity of the latent space, tying this lesson back to the overfitting warnings in Part 1.</li>
    </ul>
    <p>Where it leads: these factors are the conceptual bridge to content hybrids (15.3), DLRM-style embedding tables (15.6), and two-tower retrieval (15.7).</p>`,
  intuition: String.raw`
    <p>Collaborative filtering stores many local similarities. Matrix factorization asks for a smaller explanation: perhaps users and items live in a hidden taste space, and a rating is high when their vectors point together.</p>
    <p>The pain it solves is sparsity. Instead of needing Ava and Ben to overlap on many exact items, we learn that Ava is high on one latent dimension and item 3 is high on the same dimension. The design decision is <b>low rank</b>: we intentionally force the model through a narrow bottleneck so it discovers reusable structure rather than memorizing each observed cell.</p>`,
  mathematics: String.raw`
    <p>With $P\in\mathbb{R}^{m\times k}$ user factors and $Q\in\mathbb{R}^{n\times k}$ item factors, the prediction is</p>
    <div class="formula-box">$$\hat R=P Q^\top,\\ \hat r_{ui}=p_u^\top q_i$$</div>
    <p>The usual squared-error objective over observed entries $\Omega$ is $\sum_{(u,i)\in\Omega}(r_{ui}-p_u^\top q_i)^2+\lambda(\|p_u\|_2^2+\|q_i\|_2^2)$.</p>
    <p>For $p_0=(1.2,0.2)$ and item factors $q_0=(4.0,0.2)$ and $q_2=(0.2,3.7)$:</p>
    <ol class="work">
      <li>$\hat r_{0,0}=1.2\cdot4.0+0.2\cdot0.2=4.800+0.040=4.840$</li>
      <li>$\hat r_{0,2}=1.2\cdot0.2+0.2\cdot3.7=0.240+0.740=0.980$</li>
      <li>$\hat r_{2,2}=0.1\cdot0.2+1.3\cdot3.7=0.020+4.810=4.830$</li>
    </ol>
    <p>The same two coordinates explain a user who likes the first item family and another who likes the second.</p>
    <p>One SGD step for $p=(0.8,0.2)$, $q=(3.0,0.4)$, rating $r=5$, step $\eta=0.05$, and $\lambda=0.1$ is:</p>
    <ol class="work">
      <li>prediction $=0.8\cdot3.0+0.2\cdot0.4=2.480$; error $e=5-2.480=2.520$</li>
      <li>$p' = p+0.05(e q-0.1p)=(0.8,0.2)+0.05(7.480,0.988)=(1.174,0.249)$</li>
      <li>$q' = q+0.05(e p-0.1q)=(3.0,0.4)+0.05(1.716,0.464)=(3.086,0.423)$</li>
      <li>new prediction $=1.174\cdot3.086+0.249\cdot0.423=3.728$</li>
    </ol>
    <p>The update raises the score because the observed rating was higher than the dot product. On the symmetric four-by-four rating matrix, rank controls reconstruction error:</p>
    <ol class="work">
      <li>rank 1 error $=7.141$</li>
      <li>rank 2 error $=1.414$</li>
      <li>rank 4 error $=0.000$ exactly for practical purposes</li>
    </ol>
    <p>Low rank is not a technical nuisance; it is the model's promise that many observed preferences share a few reusable causes.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using all blank cells as negatives.</b> The objective is over $\Omega$, the observed entries; treating every missing $r_{ui}$ as zero changes the problem into exposure modeling.</li>
      <li><b>Choosing rank as if bigger is always safer.</b> Larger $k$ lowers training error but increases the capacity term, just like the bias-complexity tradeoff in 1.2.</li>
      <li><b>Ignoring factor scale.</b> $p_u$ can be multiplied while $q_i$ is divided; regularization is what keeps the representation numerically stable.</li>
      <li><b>Reading latent dimensions too literally.</b> They may align with genres or price bands, but the objective only promises predictive coordinates, not human-named traits.</li>
    </ul>`
};

/* ---------------- 15.3 Content-based & hybrid recommenders ---------------- */
window.ALLML_CONTENT["15.3"] = {
  tagline: "When behavior is sparse, item attributes let us recommend by what something is, not only by who clicked it.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/15.3-content-hybrid-recommenders.ipynb",
  context: String.raw`
    <p>This lesson adds side information to the collaborative signals from 15.1 and 15.2.</p>
    <ul>
      <li><b>Feature vectors</b> represent item attributes, so the same dot-product geometry can score semantic similarity.</li>
      <li><b>Cosine similarity</b> again supplies scale-free matching, now between a user profile and item content.</li>
      <li><b>Model ensembling</b> supplies the hybrid blend: different signals are useful under different data conditions.</li>
    </ul>
    <p>Where it leads: hybrid thinking is the practical answer to cold start (15.9), and the same feature-plus-behavior blend appears in CTR systems (15.6).</p>`,
  intuition: String.raw`
    <p>Pure collaborative filtering cannot recommend a brand-new item because no one has clicked it yet. Content-based recommendation says: if we know the item is visual, text-heavy, or video-like, we can compare it to what the user already liked.</p>
    <p>The mental model is building a taste profile from attributes. The design decision is not "content or collaborative"; it is <b>how much to trust each today</b>. When interactions are abundant, behavior often wins. When an item or user is new, content is the only honest signal.</p>`,
  mathematics: String.raw`
    <p>Let $x_i\in\mathbb{R}^d$ be item features and $r_i$ a user's rating. A content profile can be the rating-weighted mean $p=\frac{\sum_i r_i x_i}{\sum_i r_i}$, scored by cosine similarity. A hybrid score is</p>
    <div class="formula-box">$$s_{hybrid}(u,i)=\alpha s_{content}(u,i)+(1-\alpha)s_{collab}(u,i)$$</div>
    <p>For features $[[1,0,1],[1,1,0],[0,1,1],[0,0,1]]$ and ratings $(5,4,1,0)$:</p>
    <ol class="work">
      <li>weighted feature sum $=5(1,0,1)+4(1,1,0)+1(0,1,1)=(9,5,6)$</li>
      <li>rating sum $=5+4+1=10$</li>
      <li>profile $p=(9,5,6)/10=(0.900,0.500,0.600)$, equivalent in direction to $(1.000,0.556,0.667)$</li>
    </ol>
    <p>The profile says the user leans visual, with meaningful but smaller text and video preference. Candidate cosine scores are:</p>
    <ol class="work">
      <li>candidate $(1,0,0)$: $0.900/(\|p\|\cdot1)=0.744$</li>
      <li>candidate $(0,1,1)$: $(0.500+0.600)/(1.209\cdot1.414)=0.643$</li>
      <li>candidate $(1,1,0)$: $(0.900+0.500)/(1.209\cdot1.414)=0.819$</li>
    </ol>
    <p>The mixed visual-text item wins because it matches the two strongest coordinates. With content scores $(0.79,0.74,0.85)$, collaborative scores $(0.30,0.90,0.70)$, and $\alpha=0.4$:</p>
    <ol class="work">
      <li>A: $0.4\cdot0.79+0.6\cdot0.30=0.496$</li>
      <li>B: $0.4\cdot0.74+0.6\cdot0.90=0.836$</li>
      <li>C: $0.4\cdot0.85+0.6\cdot0.70=0.760$</li>
    </ol>
    <p>The hybrid chooses B because strong collaborative evidence outweighs C's slightly better content match. For a new item with no collaborative score, the notebook falls back to its content score $0.820$, which is exactly why hybrids matter in production.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Over-specializing the content profile.</b> If $p$ is built only from past clicks, cosine ranking can trap the user in a narrow attribute bubble.</li>
      <li><b>Mixing uncalibrated scores.</b> The blend formula assumes $s_{content}$ and $s_{collab}$ live on comparable scales; otherwise $\alpha$ is not meaningful.</li>
      <li><b>Forgetting missing collaborative evidence.</b> A new item's absent collaborative score is unknown, not zero; treating it as zero punishes launch inventory.</li>
      <li><b>Using attributes that leak labels.</b> Content features created after engagement can silently encode the target and inflate offline metrics.</li>
    </ul>`
};

/* ---------------- 15.4 Learning to rank ---------------- */
window.ALLML_CONTENT["15.4"] = {
  tagline: "A ranking model should be trained on the kind of mistake it will be judged for: bad scores, bad pairs, or bad lists.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/15.4-learning-to-rank.ipynb",
  context: String.raw`
    <p>This lesson changes the training objective from prediction accuracy to ordering quality.</p>
    <ul>
      <li><b>Logistic regression</b> gives the pointwise loss used when each item is treated as an independent click label.</li>
      <li><b>Margins</b> from classification become pairwise constraints: a relevant item should beat an irrelevant item by enough.</li>
      <li><b>Softmax normalization</b> turns a whole slate into a probability distribution, enabling listwise learning.</li>
    </ul>
    <p>Where it leads: ranking losses feed directly into ranking metrics (15.5), CTR rankers (15.6), and two-stage retrieval-plus-ranking systems (15.7).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that recommenders show ordered lists, not isolated predictions. A model can have reasonable click probabilities and still put the best item third, which is a ranking failure.</p>
    <p>Pointwise learning asks "is this item clicked?" Pairwise learning asks "does the clicked item beat this unclicked one?" Listwise learning asks "does the entire distribution put enough probability on the right top item?" The design decision is choosing the loss whose pressure matches the product surface. If the interface only cares about the top few positions, an independent pointwise loss is often too indirect.</p>`,
  mathematics: String.raw`
    <p>For label $y_i\in\{0,1\}$ and score $s_i$, pointwise logistic loss is $-y_i\log\sigma(s_i)-(1-y_i)\log(1-\sigma(s_i))$. Pairwise hinge loss for a preferred item $+$ over $-$ is $\max(0,1-(s_+-s_-))$. Listwise softmax loss for target $t$ is</p>
    <div class="formula-box">$$L_{list}=-\log\frac{e^{s_t}}{\sum_j e^{s_j}}$$</div>
    <p>For labels $(1,0,1)$ and scores $(2.0,0.5,1.0)$, pointwise logistic computes:</p>
    <ol class="work">
      <li>$\sigma(2.0)=0.881$, $\sigma(0.5)=0.622$, $\sigma(1.0)=0.731$</li>
      <li>loss terms $=-\log0.881=0.127$, $-\log(1-0.622)=0.974$, $-\log0.731=0.313$</li>
      <li>mean loss $=(0.127+0.974+0.313)/3=0.471$</li>
    </ol>
    <p>The middle unclicked item is expensive because its score is still fairly high. Pairwise losses look at score differences:</p>
    <ol class="work">
      <li>with $s_+=1.2$ and $s_-=0.7$, margin difference $=0.500$</li>
      <li>hinge loss $=\max(0,1-0.500)=0.500$</li>
      <li>smooth logistic pairwise loss $=\log(1+e^{-0.500})=0.474$</li>
    </ol>
    <p>Both say the relevant item is ahead, but not ahead enough. For the listwise score vector $(2.0,0.5,1.0)$ with item 0 as target:</p>
    <ol class="work">
      <li>exponentials: $e^2=7.389$, $e^{0.5}=1.649$, $e^1=2.718$; sum $=11.756$</li>
      <li>target probability $=7.389/11.756=0.629$</li>
      <li>loss $=-\log0.629=0.464$</li>
    </ol>
    <p>The softmax gradient is $(p_0-1,p_1,p_2)=(-0.371,0.140,0.231)$, so training pushes the target score up and all competitors down in one coupled move.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing pointwise loss and expecting NDCG.</b> Independent calibration does not guarantee the highest relevant item moves to the top.</li>
      <li><b>Sampling easy negatives only.</b> Pairwise loss becomes nearly zero when $s_+-s_-$ is already large; hard negatives carry the learning signal.</li>
      <li><b>Ignoring query boundaries.</b> Listwise softmax must normalize within a user's candidate slate, not across unrelated users.</li>
      <li><b>Forgetting position value.</b> A pairwise swap at ranks 1 and 2 matters more than one at ranks 99 and 100; metrics in 15.5 make that explicit.</li>
    </ul>`
};

/* ---------------- 15.5 Ranking metrics ---------------- */
window.ALLML_CONTENT["15.5"] = {
  tagline: "Ranking metrics care not only what you retrieved, but how early the useful things appeared.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/15.5-ranking-metrics.ipynb",
  context: String.raw`
    <p>This lesson gives the scoreboard for the losses in 15.4.</p>
    <ul>
      <li><b>Logarithms</b> create position discounts, making rank 1 much more valuable than rank 10.</li>
      <li><b>Precision and recall</b> become prefix-based when the output is an ordered list.</li>
      <li><b>Graded relevance</b> lets NDCG distinguish a perfect result from a merely acceptable one.</li>
    </ul>
    <p>Where it leads: recommender evaluation (15.11) asks whether these offline metric estimates are unbiased, and bandits (15.10) optimize online rewards when offline metrics are not enough.</p>`,
  intuition: String.raw`
    <p>A recommender list is consumed from the top down. Two systems can retrieve the same three useful items, but the one that places them at ranks 1, 2, and 3 is better than the one hiding them at 18, 19, and 20.</p>
    <p>The design decision is <b>what kind of usefulness</b> to reward. NDCG handles graded relevance and position; MAP rewards precision at every relevant hit; MRR cares only about the first success. None is universally right. The metric should match the user's job on that surface.</p>`,
  mathematics: String.raw`
    <p>For relevance values $rel_i$ at rank $i$ starting from zero,</p>
    <div class="formula-box">$$DCG=\sum_i\frac{2^{rel_i}-1}{\log_2(i+2)},\qquad NDCG=\frac{DCG}{IDCG}$$</div>
    <p>For graded relevance $(3,2,0,1)$:</p>
    <ol class="work">
      <li>rank 1 gain $=(2^3-1)/\log_2 2=7/1=7.000$</li>
      <li>rank 2 gain $=(2^2-1)/\log_2 3=3/1.585=1.893$</li>
      <li>rank 3 gain $=0/2=0.000$; rank 4 gain $=(2^1-1)/\log_2 5=1/2.322=0.431$</li>
      <li>$DCG=7.000+1.893+0.000+0.431=9.323$; ideal $=9.393$; $NDCG=0.993$</li>
    </ol>
    <p>The list is almost ideal because the most valuable items are already early. Average precision for binary hits $(1,0,1,1,0)$ is:</p>
    <ol class="work">
      <li>precision at rank 1 hit $=1/1=1.000$</li>
      <li>precision at rank 3 hit $=2/3=0.667$</li>
      <li>precision at rank 4 hit $=3/4=0.750$</li>
      <li>$AP=(1.000+0.667+0.750)/3=0.806$</li>
    </ol>
    <p>MAP is the mean of this AP over users or queries. MRR for hits $(0,0,1,1,0)$ is simpler:</p>
    <ol class="work">
      <li>first relevant result appears at rank 3</li>
      <li>reciprocal rank $=1/3=0.333$</li>
    </ol>
    <p>MRR is perfect for a "find one good answer" product, but it ignores every useful item after the first.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Comparing metrics with different cutoffs.</b> NDCG@10 and NDCG@100 answer different product questions because the discount tail changes.</li>
      <li><b>Using MRR when multiple good items matter.</b> The formula stops at the first hit, so later relevant recommendations receive no credit.</li>
      <li><b>Treating unjudged as irrelevant.</b> If labels are incomplete, the zero gain term may mean unobserved rather than bad.</li>
      <li><b>Averaging over users without weights.</b> Heavy and light users may deserve different aggregation depending on the product objective.</li>
    </ul>`
};

/* ---------------- 15.6 CTR prediction ---------------- */
window.ALLML_CONTENT["15.6"] = {
  tagline: "CTR models turn sparse identities and interactions into a calibrated probability of click.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/15.6-ctr-prediction.ipynb",
  context: String.raw`
    <p>CTR prediction is the ranking model behind many ad and feed systems.</p>
    <ul>
      <li><b>Logistic regression</b> provides the probability link: a real-valued logit becomes a click probability.</li>
      <li><b>Embeddings</b> let sparse categorical fields interact through learned vectors, continuing the factor idea from 15.2.</li>
      <li><b>Calibration</b> matters because ranking and bidding systems often consume the probability itself, not just the order.</li>
    </ul>
    <p>Where it leads: DLRM-style interaction blocks connect to two-tower retrieval (15.7), while online exploration and bias correction appear in 15.10 and 15.11.</p>`,
  intuition: String.raw`
    <p>The concrete problem is to estimate whether this user will click this item in this context. Sparse IDs alone are too brittle; dense neural features alone can forget memorized business rules. Wide & Deep, DeepFM, and DLRM are all compromises between memorization and generalization.</p>
    <p>The design decision is to model <b>crosses</b>. A user feature and an item feature may each be weak alone, but their interaction can be decisive. Embedding-dot interactions are the scalable version of hand-written crossed features.</p>`,
  mathematics: String.raw`
    <p>A CTR model produces a logit $z$ and probability $p=\sigma(z)=1/(1+e^{-z})$. Wide models add explicit crosses; FM-style models add pairwise embedding dots:</p>
    <div class="formula-box">$$z=b+w^\top x+\sum_{i\lt j} e_i^\top e_j + f_{deep}(x)$$</div>
    <p>For base $-1.2$, user contribution $0.7$, and item contribution $0.4$:</p>
    <ol class="work">
      <li>$z=-1.2+0.7+0.4=-0.100$</li>
      <li>$p=1/(1+e^{0.100})=0.475$</li>
    </ol>
    <p>A wide crossed feature with weight $1.2$ changes the same style of calculation:</p>
    <ol class="work">
      <li>without cross: $z=-2.0+0.5+0.4=-1.100$, so $p=0.250$</li>
      <li>with cross: $z=-2.0+0.5+0.4+1.2=0.100$, so $p=0.525$</li>
    </ol>
    <p>The cross captures a pair-specific lift that main effects miss. For embeddings $(0.2,0.5)$, $(0.4,0.1)$, and $(0.3,0.6)$:</p>
    <ol class="work">
      <li>$e_0^\top e_1=0.2\cdot0.4+0.5\cdot0.1=0.130$</li>
      <li>$e_0^\top e_2=0.2\cdot0.3+0.5\cdot0.6=0.360$</li>
      <li>$e_1^\top e_2=0.4\cdot0.3+0.1\cdot0.6=0.180$</li>
      <li>FM interaction sum $=0.130+0.360+0.180=0.670$</li>
    </ol>
    <p>Adding linear $-0.300$, FM $0.670$, and deep $0.250$ gives $z=0.620$ and $p=0.650$, which is the DeepFM pattern in one line.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing AUC while consuming probabilities.</b> A ranker can order well but be miscalibrated; bidding and pacing need the $p$ scale to mean click probability.</li>
      <li><b>Letting crosses explode.</b> Explicit wide crosses memorize sparse coincidences unless frequency thresholds or regularization control them.</li>
      <li><b>Using post-click features.</b> Features unavailable at request time leak the label and make offline CTR look magical.</li>
      <li><b>Ignoring negative sampling rate.</b> If negatives are downsampled, the logit intercept must be corrected before interpreting $\sigma(z)$ as real CTR.</li>
    </ul>`
};

/* ---------------- 15.7 Two-tower & neural retrieval recommenders ---------------- */
window.ALLML_CONTENT["15.7"] = {
  tagline: "Two towers learn a user vector and an item vector so retrieval becomes nearest-neighbor search at scale.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/15.7-two-tower-neural-retrieval.ipynb",
  context: String.raw`
    <p>This lesson scales recommendation from scoring a few candidates to retrieving from millions.</p>
    <ul>
      <li><b>Matrix factorization (15.2)</b> supplies the dot-product scoring idea; two towers learn the factors from richer features.</li>
      <li><b>Softmax classification</b> supplies the contrastive training loss over positives and sampled negatives.</li>
      <li><b>Nearest-neighbor search</b> is the systems payoff: item vectors can be indexed before the request arrives.</li>
    </ul>
    <p>Where it leads: sequential recommenders (15.8) improve the user tower with recent behavior, and evaluation bias (15.11) asks whether retrieved candidates reflect true preference or logging artifacts.</p>`,
  intuition: String.raw`
    <p>The concrete pain is latency. A deep ranker may score hundreds of items, not millions. A two-tower model separates user computation from item computation: produce a user vector now, precompute item vectors offline, and retrieve by dot product.</p>
    <p>The design decision is the separation itself. Cross features between this exact user and item are weaker than in a full ranker, but the reward is sublinear retrieval. Two-tower models trade some expressiveness for candidate-generation speed.</p>`,
  mathematics: String.raw`
    <p>A user tower $f_\theta(u)$ and item tower $g_\phi(i)$ produce vectors in $\mathbb{R}^d$; the score is $s(u,i)=f_\theta(u)^\top g_\phi(i)$. With sampled items, the training loss is</p>
    <div class="formula-box">$$L=-\log\frac{e^{s(u,i^+)}}{e^{s(u,i^+)}+\sum_{j}e^{s(u,i_j^-)}}$$</div>
    <p>For user vector $(1.0,0.2)$ and item vectors $(1,0.1)$, $(0.8,0.4)$, $(0.1,1)$, $(-0.5,0.8)$:</p>
    <ol class="work">
      <li>scores: $1.0\cdot1+0.2\cdot0.1=1.020$; $0.800+0.080=0.880$; $0.100+0.200=0.300$; $-0.500+0.160=-0.340$</li>
      <li>top item is item 0 because $1.020$ is largest</li>
    </ol>
    <p>With positive score $2.0$ and negatives $1.0$ and $0.0$:</p>
    <ol class="work">
      <li>exponentials $=7.389,2.718,1.000$; sum $=11.107$</li>
      <li>positive probability $=7.389/11.107=0.665$</li>
      <li>loss $=-\log0.665=0.408$</li>
    </ol>
    <p>Temperature changes the sharpness of that competition:</p>
    <ol class="work">
      <li>$T=0.5$: positive probability $=0.867$</li>
      <li>$T=1.0$: positive probability $=0.665$</li>
      <li>$T=2.0$: positive probability $=0.506$</li>
    </ol>
    <p>Lower temperature makes the model care more about score gaps. In-batch negatives turn a batch of three user-item pairs into a $3\times3$ score matrix, using every other row's item as a negative for free.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Expecting ranker-level feature crosses.</b> Separate towers cannot model arbitrary user-item interactions before retrieval; that is why a second-stage ranker often follows.</li>
      <li><b>Using easy sampled negatives.</b> If negatives are obviously bad, the softmax denominator teaches little about the boundary near good items.</li>
      <li><b>Forgetting vector normalization choices.</b> Dot product mixes angle and norm; cosine-style retrieval changes the meaning of score.</li>
      <li><b>Measuring only loss.</b> The product cares whether the true item appears in top $k$ candidates, so recall@k must be checked.</li>
    </ul>`
};

/* ---------------- 15.8 Sequential & session-based recommendation ---------------- */
window.ALLML_CONTENT["15.8"] = {
  tagline: "A user's next action often depends more on the last few actions than on their lifetime average.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/15.8-sequential-session-recommendation.ipynb",
  context: String.raw`
    <p>This lesson adds time order to the representations from 15.2 and 15.7.</p>
    <ul>
      <li><b>Markov models</b> provide the simplest next-item mechanism: estimate $P(i_t\mid i_{t-1})$ from transitions.</li>
      <li><b>Embeddings</b> let a session be summarized as a vector rather than a raw item id.</li>
      <li><b>Attention</b> chooses which past event matters for the current query, rather than averaging all history equally.</li>
    </ul>
    <p>Where it leads: session signals improve neural retrieval (15.7), help cold-start users after only a few actions (15.9), and must be evaluated carefully because logs are policy-dependent (15.11).</p>`,
  intuition: String.raw`
    <p>A lifetime profile says someone likes both jobs and videos. A session says they have clicked three video items in a row. For the next recommendation, the session may be the better clue.</p>
    <p>The design decision is <b>how much history to remember</b>. Too short and the model chases noise; too long and it misses intent shifts. Sequential recommenders are built around this tension: recency, transition structure, or attention decides what counts as the present context.</p>`,
  mathematics: String.raw`
    <p>A recency-weighted session profile is $h=\sum_t \alpha_t e_{i_t}$ with $\sum_t\alpha_t=1$. A first-order Markov model estimates $P(b\mid a)=C_{ab}/\sum_j C_{aj}$.</p>
    <p>For item embeddings $(1,0)$, $(0,1)$, $(1,1)$ and recency weights $(0.2,0.3,0.5)$:</p>
    <ol class="work">
      <li>dimension 0: $0.2\cdot1+0.3\cdot0+0.5\cdot1=0.700$</li>
      <li>dimension 1: $0.2\cdot0+0.3\cdot1+0.5\cdot1=0.800$</li>
      <li>session profile $h=(0.700,0.800)$</li>
    </ol>
    <p>For sessions $[0,1,2]$, $[0,1,1]$, and $[1,2,0]$, transition counts from item 1 are:</p>
    <ol class="work">
      <li>$1\to1$ occurs once and $1\to2$ occurs twice</li>
      <li>row sum $=3$</li>
      <li>$P(2\mid1)=2/3=0.667$ and $P(1\mid1)=1/3=0.333$</li>
    </ol>
    <p>The model predicts item 2 after item 1. Attention with query $(1,0.2)$ over embeddings $(1,0)$, $(0,1)$, $(1,1)$ computes:</p>
    <ol class="work">
      <li>dots $=1.000,0.200,1.200$</li>
      <li>softmax weights $=0.374,0.168,0.457$ after exponentiating and normalizing</li>
      <li>context $=0.374(1,0)+0.168(0,1)+0.457(1,1)=(0.832,0.626)$</li>
    </ol>
    <p>Attention keeps the recent evidence but lets the query decide which event is most relevant now.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Shuffling sessions during training.</b> Order is the signal; randomizing events destroys $P(i_t\mid i_{t-1})$ and attention structure.</li>
      <li><b>Letting old history drown intent.</b> Uniform averages make $h$ slow to respond when the user's current task changes.</li>
      <li><b>Over-trusting one transition.</b> Markov probabilities with tiny counts need smoothing, or a single accidental path dominates.</li>
      <li><b>Leaking the future into features.</b> A session embedding must use only events before the prediction point.</li>
    </ul>`
};

/* ---------------- 15.9 The cold-start problem ---------------- */
window.ALLML_CONTENT["15.9"] = {
  tagline: "Cold start is not one problem: new users, new items, and new contexts each remove a different source of evidence.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/15.9-cold-start-problem.ipynb",
  context: String.raw`
    <p>This lesson names the failure mode that motivated many earlier design choices.</p>
    <ul>
      <li><b>Collaborative filtering (15.1)</b> needs interactions, so it fails first when rows or columns are empty.</li>
      <li><b>Content and hybrid recommenders (15.3)</b> supply fallback features when behavior is missing.</li>
      <li><b>Bayesian shrinkage</b> keeps tiny-count popularity estimates from overwhelming reliable evidence.</li>
    </ul>
    <p>Where it leads: bandits (15.10) actively gather evidence, while evaluation bias (15.11) asks whether new items were given enough exposure to be measured fairly.</p>`,
  intuition: String.raw`
    <p>A recommender learns from feedback, but new users and new items have no feedback. The naive fix is popularity, which is safe but impersonal and can bury new inventory forever.</p>
    <p>The design decision is to treat cold start as an <b>uncertainty allocation</b> problem. Use priors when you know little, content when attributes exist, onboarding when the user will answer, and exploration when the system must learn from traffic.</p>`,
  mathematics: String.raw`
    <p>A raw popularity estimate is $\hat p=c/n$. A Beta-binomial shrunk estimate with prior $\text{Beta}(\alpha,\beta)$ is</p>
    <div class="formula-box">$$\mathbb{E}[p\mid c,n]=\frac{c+\alpha}{n+\alpha+\beta}$$</div>
    <p>For clicks $(50,20,5)$ and impressions $(1000,200,20)$, raw CTRs are:</p>
    <ol class="work">
      <li>A: $50/1000=0.050$</li>
      <li>B: $20/200=0.100$</li>
      <li>C: $5/20=0.250$</li>
    </ol>
    <p>Raw popularity would choose C, but C has only 20 impressions. With prior $\alpha=10$, $\beta=190$:</p>
    <ol class="work">
      <li>A: $(50+10)/(1000+200)=60/1200=0.050$</li>
      <li>B: $(20+10)/(200+200)=30/400=0.075$</li>
      <li>C: $(5+10)/(20+200)=15/220=0.068$</li>
    </ol>
    <p>Shrinkage chooses B because C's apparent lead was too uncertain. For a new item with content vector $(1,1)$ and user profile $(1,0.5)$:</p>
    <ol class="work">
      <li>dot $=1\cdot1+0.5\cdot1=1.500$</li>
      <li>norms $=\sqrt{1.25}=1.118$ and $\sqrt2=1.414$</li>
      <li>cosine $=1.500/(1.118\cdot1.414)=0.949$</li>
    </ol>
    <p>Content gives a legitimate score before collaborative history exists. As a user accumulates events, the notebook uses $w=n/(n+5)$ and score $(1-w)0.06+w0.18$, moving from $0.060$ at zero events to above $0.150$ after 20 events.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing no data with bad data.</b> A new item has unknown appeal; assigning zero collaborative score creates a self-fulfilling failure.</li>
      <li><b>Ranking raw CTR by tiny denominators.</b> The $c/n$ estimate has high variance when $n$ is small; shrinkage reduces that mechanism.</li>
      <li><b>Asking too much onboarding.</b> Each question buys profile dimensions but also user friction; the profile should be useful after very few answers.</li>
      <li><b>Never exploring new inventory.</b> Without allocated exposure, the system cannot collect the impressions needed to leave cold start.</li>
    </ul>`
};

/* ---------------- 15.10 Bandit-based recommendation ---------------- */
window.ALLML_CONTENT["15.10"] = {
  tagline: "Bandits recommend while learning, paying some short-term regret to discover better long-term choices.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/15.10-bandit-based-recommendation.ipynb",
  context: String.raw`
    <p>This lesson turns recommendation from passive prediction into active decision-making.</p>
    <ul>
      <li><b>Expected reward</b> is the objective: each arm has an unknown click or conversion probability.</li>
      <li><b>Uncertainty estimates</b> decide exploration, whether by epsilon-greedy randomness, UCB bonuses, or Bayesian posterior sampling.</li>
      <li><b>Regret</b> measures the cost of learning compared with always choosing the best arm.</li>
    </ul>
    <p>Where it leads: bandits are a practical cold-start tool (15.9) and a way to collect less biased evaluation data for 15.11.</p>`,
  intuition: String.raw`
    <p>A recommender trained only on yesterday's logs exploits what it already believes. But if it never tries uncertain items, it may never discover that they are better.</p>
    <p>The mental model is a careful teacher letting the system experiment, but with a budget. The design decision is how exploration is justified: epsilon-greedy explores blindly, UCB explores because uncertainty is high, and Thompson sampling explores in proportion to posterior plausibility.</p>`,
  mathematics: String.raw`
    <p>Epsilon-greedy assigns $1-\varepsilon$ extra probability to the current best arm. UCB chooses</p>
    <div class="formula-box">$$a_t=\arg\max_a \left(\hat\mu_a+\sqrt{\frac{2\ln t}{n_a}}\right)$$</div>
    <p>For estimated values $(0.05,0.08,0.04)$ and $\varepsilon=0.2$ over three arms:</p>
    <ol class="work">
      <li>exploration mass per arm $=0.2/3=0.067$</li>
      <li>best arm B receives $0.8+0.067=0.867$</li>
      <li>arms A and C each receive $0.067$</li>
    </ol>
    <p>For UCB with means $(0.05,0.08,0.04)$, pulls $(100,20,5)$, and $t=125$:</p>
    <ol class="work">
      <li>A bonus $=\sqrt{2\ln125/100}=0.311$, score $=0.361$</li>
      <li>B bonus $=\sqrt{2\ln125/20}=0.695$, score $=0.775$</li>
      <li>C bonus $=\sqrt{2\ln125/5}=1.390$, score $=1.430$</li>
    </ol>
    <p>UCB chooses C despite its low mean because five pulls leave huge uncertainty. Thompson sampling with clicks $(5,8,1)$ and non-clicks $(95,92,19)$ has Beta posterior means:</p>
    <ol class="work">
      <li>A: $(5+1)/(5+95+2)=6/102=0.059$</li>
      <li>B: $(8+1)/(8+92+2)=9/102=0.088$</li>
      <li>C: $(1+1)/(1+19+2)=2/22=0.091$</li>
    </ol>
    <p>Posterior sampling would still sometimes try C because uncertainty remains. If the best arm has reward $0.10$ and chosen rewards are $(0.05,0.08,0.04,0.10,0.08)$, cumulative regret is $(0.05,0.07,0.13,0.13,0.15)$, making the exploration cost visible.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Exploring without guardrails.</b> Random traffic has user cost; epsilon and candidate eligibility must respect product safety.</li>
      <li><b>Using stationary formulas on drifting rewards.</b> UCB's $n_a$ denominator assumes old observations remain relevant; stale data can suppress necessary re-exploration.</li>
      <li><b>Optimizing clicks alone.</b> Reward definition controls behavior; click bandits can learn bait unless downstream value is included.</li>
      <li><b>Ignoring interference.</b> Recommending one item can change future user state, so simple arm independence may be false.</li>
    </ul>`
};

/* ---------------- 15.11 Recommender evaluation & bias ---------------- */
window.ALLML_CONTENT["15.11"] = {
  tagline: "Recommender logs are not neutral data; they are traces of what an older policy chose to show.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/15.11-recommender-evaluation-bias.ipynb",
  context: String.raw`
    <p>This final recommender lesson asks whether our measurements are trustworthy.</p>
    <ul>
      <li><b>Ranking metrics (15.5)</b> provide the quantities we want to estimate, such as recall@k or NDCG.</li>
      <li><b>Bandits (15.10)</b> explain why randomized exposure can make evaluation more honest.</li>
      <li><b>Causal weighting</b> enters through propensities: shown items are not a random sample of all relevant items.</li>
    </ul>
    <p>Where it leads: this is the bridge from model-building to responsible deployment, where offline validation, online tests, and counterfactual estimates must agree before launch.</p>`,
  intuition: String.raw`
    <p>The naive offline evaluation story says: hide some clicks, rank items, compute recall. The problem is that clicks only exist for items the old system exposed. An unclicked item may be bad, unseen, or shown in a poor position.</p>
    <p>The design decision is to evaluate the <b>logging process</b> as well as the model. If exposure probabilities are known, inverse propensity scoring can correct some bias. If they are not, offline metrics may mainly reward similarity to the previous recommender.</p>`,
  mathematics: String.raw`
    <p>For logged examples with click $c_i$ and propensity $p_i=P(\text{shown}_i)$, inverse propensity scoring estimates reward by</p>
    <div class="formula-box">$$\hat V_{IPS}=\frac{1}{n}\sum_i \frac{c_i}{p_i}$$</div>
    <p>A small holdout recall@3 example with all positives retrieved gives:</p>
    <ol class="work">
      <li>user 0: two hidden positives, both in top 3, recall $=2/2=1.000$</li>
      <li>user 1: one hidden positive in top 3, recall $=1/1=1.000$</li>
      <li>user 2: one hidden positive in top 3, recall $=1/1=1.000$</li>
      <li>mean recall@3 $=(1+1+1)/3=1.000$</li>
    </ol>
    <p>That metric is only meaningful if the hidden positives are representative. Exposure bias shows why they may not be:</p>
    <ol class="work">
      <li>true relevance vector $(1,1,0,1)$ contains three relevant items</li>
      <li>exposure vector $(1,0,1,0)$ reveals only positions 1 and 3</li>
      <li>observed positives $=(1,0,0,0)$, so logs show only one of three positives</li>
    </ol>
    <p>IPS corrects known exposure probabilities. For clicks $(1,0,1)$ and propensities $(0.5,0.2,0.1)$:</p>
    <ol class="work">
      <li>weighted rewards $=1/0.5=2.000$, $0/0.2=0.000$, $1/0.1=10.000$</li>
      <li>IPS estimate $=(2+0+10)/3=4.000$</li>
      <li>naive mean click $=(1+0+1)/3=0.667$</li>
    </ol>
    <p>The IPS number is larger because rare exposure carries more population weight, but the same $1/p_i$ term also increases variance. Position bias has its own mechanism: if relevance is $0.5$ and examination probabilities are $(1.0,0.6,0.3,0.15)$, observed click rates are $(0.500,0.300,0.150,0.075)$ even with equal relevance.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Treating logs as random samples.</b> They are selected by the old policy, so unshown items do not have missing-at-random labels.</li>
      <li><b>Using IPS without clipping or variance checks.</b> Small propensities make $c_i/p_i$ explode, as the $0.1$ propensity produced weight $10.000$.</li>
      <li><b>Ignoring position bias.</b> A lower rank can reduce clicks through examination probability even when relevance is identical.</li>
      <li><b>Letting feedback loops define success.</b> If traffic concentrates on current winners, future training data becomes less diverse and offline metrics can reinforce the loop.</li>
    </ul>`
};
