module.exports = {
  "math-21-01": {
    connectionsProse: "<p>Information and surprise starts from the probability ideas used throughout probability and statistics. If a reader already understands that rare events have smaller probabilities than common events, the new step is to put that rarity on a scale that can be added and compared. This lesson leads into entropy, because entropy is just the average of this one-outcome surprise. It also explains why negative log probability appears as a loss in classifiers and language models.</p>",
    motivation: "<p>A single outcome can feel more or less informative depending on how likely it was before it happened. Seeing the expected outcome usually changes little, while seeing a rare outcome narrows the possibilities much more. Information theory turns that informal sense of surprise into a number by using the event probability as the input.</p>" +
                "<p>The logarithm is the important modeling choice. Independent events have probabilities that multiply, but the amount of information from observing both should add. Taking a negative logarithm turns a small probability into a positive surprise score and turns products into sums, so the scale matches the way independent evidence accumulates.</p>",
    definition: "<p>Self-information measures the surprise of an event from its probability.</p>" +
                "<p>$$I(A)=-\\log_b p(A)=\\log_b(1/p(A))$$</p>" +
                "<p><b>Assumptions that matter:</b> The event has probability $0<p(A)\\le1$; base $2$ gives bits and base $e$ gives nats.</p>",
    symbols: [
      { sym: "$A$", desc: "the event" },
      { sym: "$p(A)$", desc: "the probability of the event" },
      { sym: "$b$", desc: "the log base" },
      { sym: "$I(A)$", desc: "self-information" }
    ],
    derivation: [
      { do: "Start with an event $A$ of probability $p(A)$, where $0<p(A)\\le1$.", result: "$p(A)$", why: "Probability is the only input to one-outcome surprise." },
      { do: "Use the reciprocal.", result: "$1/p(A)$", why: "Rarer events should receive larger numbers." },
      { do: "Take a logarithm.", result: "$\\log_b(1/p(A))$", why: "Logarithms make multiplicative counts additive." },
      { do: "Rewrite the reciprocal log.", result: "$-\\log_b p(A)$", why: "This is the same expression and stays nonnegative for $p\\le1$." },
      { do: "For independent $A,B$, multiply probabilities.", result: "$p(A\\cap B)=p(A)p(B)$", why: "Independence is exactly the condition that probabilities multiply." },
      { do: "Apply self-information to the intersection.", result: "$I(A\\cap B)=-\\log_b[p(A)p(B)]=-\\log_b p(A)-\\log_b p(B)=I(A)+I(B)$", why: "The definition makes independent information add." }
    ],
    applications: [
      { title: "Binary branch", background: "A probability-one-half branch has one bit of surprise.", numbers: "$p=0.5\\Rightarrow I=1$ bit." },
      { title: "Classifier miss", background: "A low true-class probability gives a larger negative-log score.", numbers: "true-class $p=0.1\\Rightarrow I=3.322$ bits." },
      { title: "Confident correct prediction", background: "A high true-class probability gives little surprise.", numbers: "$p=0.9\\Rightarrow I=0.152$ bits." },
      { title: "Eight-way code", background: "One equally likely outcome among eight carries three binary decisions.", numbers: "$p=1/8\\Rightarrow I=3$ bits." },
      { title: "Anomaly score", background: "A rare event receives a high surprise score.", numbers: "$p=0.005=1/200\\Rightarrow I=7.644$ bits." },
      { title: "Natural-log loss", background: "Using natural logs reports the same idea in nats.", numbers: "$p=0.8\\Rightarrow -\\ln p=0.223$ nats." }
    ]
  },
  "math-21-02": {
    connectionsProse: "<p>Entropy builds directly on self-information. Instead of measuring the surprise of one observed outcome, it asks for the average surprise before the draw is made. That makes it a natural summary of uncertainty in a whole distribution rather than a single event. The same quantity later becomes the lower bound for lossless compression and a reference point for cross-entropy and KL divergence.</p>",
    motivation: "<p>When the outcome is not known yet, each possible value has its own surprise and its own chance of occurring. Entropy combines those two facts by weighting every self-information value by the probability of seeing it. Common outcomes matter more in the average, while rare outcomes can still contribute because their surprise is larger.</p>" +
                "<p>This average has a direct coding interpretation. If logs are base 2, entropy is measured in bits and describes the best long-run number of binary decisions needed to identify outcomes from the source. A fair coin has one full bit of uncertainty, while a heavily biased coin has less because many draws are easy to predict.</p>",
    definition: "<p>Entropy is the expected self-information of a discrete random variable.</p>" +
                "<p>$$H(X)=-\\sum_x p(x)\\log_2 p(x)$$</p>" +
                "<p><b>Assumptions that matter:</b> $X$ is discrete; logs are base $2$ for bits; zero-probability outcomes contribute $0$ by limit.</p>",
    symbols: [
      { sym: "$X$", desc: "a discrete random variable" },
      { sym: "$x$", desc: "one outcome" },
      { sym: "$p(x)$", desc: "the probability of outcome $x$" },
      { sym: "$H(X)$", desc: "entropy" },
      { sym: "$\\log_2$", desc: "base-2 logarithm, so units are bits" }
    ],
    derivation: [
      { do: "Write the self-information for each outcome $x$.", result: "$I(x)=-\\log_2 p(x)$", why: "This measures the surprise after seeing $x$." },
      { do: "Average over possible outcomes.", result: "$E[I(X)]=\\sum_x p(x)I(x)$", why: "Entropy is expected surprise." },
      { do: "Substitute $I(x)$ into the expectation.", result: "$H(X)=\\sum_x p(x)(-\\log_2 p(x))$", why: "Replace the surprise with its formula." },
      { do: "Pull out the minus sign.", result: "$H(X)=-\\sum_x p(x)\\log_2 p(x)$", why: "This is the standard entropy formula." },
      { do: "Handle zero-probability outcomes by limit.", result: "$p\\log p\\to0$ as $p\\to0^+$", why: "Impossible outcomes are not observed." }
    ],
    applications: [
      { title: "Fair coin", background: "Two equally likely outcomes have one bit of uncertainty.", numbers: "$H(0.5,0.5)=1$ bit." },
      { title: "Biased coin", background: "A predictable coin has less than one bit of uncertainty.", numbers: "$H(0.75,0.25)=0.811$ bits." },
      { title: "Class imbalance", background: "A heavily imbalanced binary label has low entropy.", numbers: "$H(0.9,0.1)=0.469$ bits." },
      { title: "Three labels", background: "A skewed three-class distribution has entropy between one and two bits.", numbers: "$H(0.7,0.2,0.1)=1.157$ bits." },
      { title: "Four-symbol uniform source", background: "Four equally likely outcomes need two binary decisions.", numbers: "$H=\\log_2 4=2$ bits." },
      { title: "Language-model perplexity", background: "Perplexity converts entropy into an effective number of choices.", numbers: "entropy $4$ bits means $2^4=16$ effective choices." }
    ]
  },
  "math-21-03": {
    connectionsProse: "<p>Joint entropy extends entropy from one variable to a pair of variables. The reader already knows how a probability table assigns mass to each cell, and this lesson treats each cell as one combined outcome. That viewpoint keeps the formula familiar while making room for dependence between variables. It prepares the chain rules, conditional entropy, and mutual information that follow.</p>",
    motivation: "<p>Learning two variables together means learning which ordered pair occurred. If the joint table has four possible cells, then the uncertainty is distributed across those cells, not across each variable separately. Joint entropy applies the ordinary entropy formula to the combined outcome $(X,Y)$.</p>" +
                "<p>Dependence matters because the pair may contain less uncertainty than two separate variables would suggest. If the variables are independent, their probabilities multiply and joint entropy splits into a sum. If they are correlated or one partly determines the other, some pairs become more predictable, and the joint entropy reflects that shared structure.</p>",
    definition: "<p>Joint entropy is the entropy of the combined outcome $(X,Y)$.</p>" +
                "<p>$$H(X,Y)=-\\sum_x\\sum_y p(x,y)\\log_2 p(x,y)$$</p>" +
                "<p><b>Assumptions that matter:</b> $X$ and $Y$ are discrete variables with a joint probability table; logs are base $2$ for bits.</p>",
    symbols: [
      { sym: "$X,Y$", desc: "discrete variables" },
      { sym: "$(x,y)$", desc: "one joint outcome" },
      { sym: "$p(x,y)$", desc: "a cell probability" },
      { sym: "$H(X,Y)$", desc: "joint entropy in bits" }
    ],
    derivation: [
      { do: "Define a combined variable.", result: "$Z=(X,Y)$", why: "Learning the pair is learning one larger outcome." },
      { do: "Give the combined variable its cell probabilities.", result: "$p_Z(x,y)=p(x,y)$", why: "Each cell has its own probability." },
      { do: "Apply ordinary entropy to $Z$.", result: "$H(Z)=-\\sum_{(x,y)}p_Z(x,y)\\log_2 p_Z(x,y)$", why: "Joint entropy is not a new rule." },
      { do: "Replace $p_Z$ with $p(x,y)$ and write the double sum.", result: "$H(X,Y)=-\\sum_x\\sum_y p(x,y)\\log_2 p(x,y)$", why: "This is the table form." },
      { do: "If $X,Y$ are independent, substitute $p(x,y)=p(x)p(y)$ and split the log.", result: "$H(X,Y)=H(X)+H(Y)$", why: "Independence makes the joint uncertainty add." }
    ],
    applications: [
      { title: "Four uniform cells", background: "Four equal joint outcomes have two bits of joint uncertainty.", numbers: "$H=2$ bits." },
      { title: "Two possible pairs", background: "Two equally likely joint outcomes have one bit of uncertainty.", numbers: "$(0.5,0.5)$ gives $1$ bit." },
      { title: "Table $(0.5,0.25,0.25,0)$", background: "A joint table with one impossible cell has less than two bits.", numbers: "$H=1.5$ bits." },
      { title: "Correlated binary table", background: "Correlation concentrates mass on diagonal cells.", numbers: "$(0.4,0.1;0.1,0.4)$: $H=1.722$ bits." },
      { title: "Independent coin and four-way tag", background: "Independent sources add their entropies.", numbers: "$1+2=3$ bits." },
      { title: "Counts $40,10,10,40$ out of $100$", background: "Counts can be normalized into the correlated table probabilities.", numbers: "joint entropy $1.722$ bits." }
    ]
  },
  "math-21-04": {
    connectionsProse: "<p>Conditional entropy builds on entropy inside branches of a probability model. Once one variable is known, the distribution of another variable may become sharper, flatter, or unchanged. This lesson measures the uncertainty that remains after that first piece of information is available. It is the main ingredient in chain rules and in the reduction-of-uncertainty view of mutual information.</p>",
    motivation: "<p>The key distinction is between uncertainty before and uncertainty after conditioning. For each value $X=x$, there is a conditional distribution over $Y$, and that distribution has its own entropy. Some branches may leave almost no ambiguity, while others may still leave many possible outcomes.</p>" +
                "<p>Conditional entropy averages those branch uncertainties using how often the branches occur. It therefore measures the expected remaining uncertainty in $Y$ once $X$ has been observed. A deterministic label has zero conditional entropy, while an independent label keeps the same entropy it had before conditioning.</p>",
    definition: "<p>Conditional entropy is the expected uncertainty left in $Y$ after $X$ is known.</p>" +
                "<p>$$H(Y\\mid X)=-\\sum_x\\sum_y p(x,y)\\log_2 p(y\\mid x)$$</p>" +
                "<p><b>Assumptions that matter:</b> The variables are discrete and conditional probabilities are defined on branches with positive probability.</p>",
    symbols: [
      { sym: "$p(y\\mid x)$", desc: "the conditional probability of $Y=y$ after $X=x$" },
      { sym: "$p(x,y)$", desc: "joint probability" },
      { sym: "$H(Y\\mid X)$", desc: "conditional entropy measured in bits" }
    ],
    derivation: [
      { do: "Write the entropy inside branch $X=x$.", result: "$H(Y\\mid X=x)=-\\sum_y p(y\\mid x)\\log_2 p(y\\mid x)$", why: "This is ordinary entropy inside one branch." },
      { do: "Weight branch $x$ by its probability.", result: "$p(x)$", why: "Branches must be weighted by how often they happen." },
      { do: "Average the branch entropies.", result: "$H(Y\\mid X)=\\sum_x p(x)H(Y\\mid X=x)$", why: "This is expected remaining uncertainty." },
      { do: "Substitute the branch formula.", result: "$H(Y\\mid X)=-\\sum_x p(x)\\sum_y p(y\\mid x)\\log_2 p(y\\mid x)$", why: "Expand the expectation." },
      { do: "Use the product rule.", result: "$p(x)p(y\\mid x)=p(x,y)$", why: "This rewrites the expression using the joint table." },
      { do: "Replace the weights by joint probabilities.", result: "$H(Y\\mid X)=-\\sum_x\\sum_y p(x,y)\\log_2 p(y\\mid x)$", why: "The final formula weights conditional surprise by joint probability." }
    ],
    applications: [
      { title: "Deterministic label", background: "If $X$ fixes $Y$, no uncertainty remains after conditioning.", numbers: "if $Y$ is fixed by $X$, $H(Y\\mid X)=0$ bits." },
      { title: "Independent fair bits", background: "Conditioning on an independent bit changes nothing.", numbers: "$H(Y\\mid X)=H(Y)=1$ bit." },
      { title: "Correlated table $(0.4,0.1;0.1,0.4)$", background: "The diagonal-heavy table leaves less than one bit after conditioning.", numbers: "$H(Y\\mid X)=0.722$ bits." },
      { title: "Branch entropies $0.5$ and $1.0$ with branch weights $0.6,0.4$", background: "Conditional entropy averages branch entropies by branch probability.", numbers: "average $0.7$ bits." },
      { title: "Noisy binary label with error $0.1$", background: "A ten-percent error label leaves binary error uncertainty.", numbers: "$H(Y\\mid X)=H(0.9,0.1)=0.469$ bits." },
      { title: "Table $(0.3,0.2;0.1,0.4)$", background: "A non-symmetric joint table gives its own branch-weighted uncertainty.", numbers: "$H(Y\\mid X)=0.846$ bits." }
    ]
  },
  "math-21-05": {
    connectionsProse: "<p>Mutual information combines entropy, conditional entropy, and joint entropy into one measure of dependence. The reader has already seen uncertainty before conditioning and uncertainty after conditioning. This lesson names the difference between those two quantities. It becomes the standard way to measure how much a feature, channel output, or representation tells us about another variable.</p>",
    motivation: "<p>Knowing one variable can reduce uncertainty about another. Mutual information measures that reduction in bits: start with what was unknown, then subtract what remains after the related variable is observed. If the observation changes nothing, the reduction is zero.</p>" +
                "<p>The same idea can be written symmetrically with joint entropy or locally with a ratio of probabilities. The ratio form compares the actual joint probability with the probability the pair would have under independence. When those agree everywhere, there is no mutual information; when the joint table systematically differs from independence, the variables share information.</p>",
    definition: "<p>Mutual information measures how much knowing one variable reduces uncertainty about another.</p>" +
                "<p>$$I(X;Y)=H(X)-H(X\\mid Y)=\\sum_{x,y}p(x,y)\\log_2\\frac{p(x,y)}{p(x)p(y)}$$</p>" +
                "<p><b>Assumptions that matter:</b> The variables are discrete and ratios are used only where joint probabilities are valid; base $2$ gives bits.</p>",
    symbols: [
      { sym: "$I(X;Y)$", desc: "mutual information in bits" },
      { sym: "$p(x)$", desc: "the marginal probability of $X=x$" },
      { sym: "$p(y)$", desc: "the marginal probability of $Y=y$" },
      { sym: "$p(x,y)$", desc: "joint probability" },
      { sym: "$p(x)p(y)$", desc: "what the joint probability would be under independence" }
    ],
    derivation: [
      { do: "Start with the uncertainty in $X$.", result: "$H(X)$", why: "This is what is unknown before seeing $Y$." },
      { do: "Name the uncertainty left after seeing $Y$.", result: "$H(X\\mid Y)$", why: "This is what is still unknown." },
      { do: "Define the reduction in uncertainty.", result: "$I(X;Y)=H(X)-H(X\\mid Y)$", why: "Information gained is before minus after." },
      { do: "Use the chain rule.", result: "$H(X,Y)=H(Y)+H(X\\mid Y)$", why: "Joint uncertainty can be learned as $Y$ first, then $X$." },
      { do: "Rearrange to the symmetric form.", result: "$I(X;Y)=H(X)+H(Y)-H(X,Y)$", why: "This shows $I(X;Y)=I(Y;X)$." },
      { do: "Expand the entropies.", result: "$I(X;Y)=\\sum_{x,y}p(x,y)\\log_2\\frac{p(x,y)}{p(x)p(y)}$", why: "Dependence is measured by the ratio of joint probability to independence probability." }
    ],
    applications: [
      { title: "Independent variables", background: "If the joint equals the product of marginals, no uncertainty is reduced.", numbers: "$I=0$ bits." },
      { title: "Duplicate fair bit", background: "A copied fair bit tells the full one bit about the original.", numbers: "$I=1$ bit." },
      { title: "Correlated table $(0.4,0.1;0.1,0.4)$", background: "Diagonal correlation creates a positive dependence measure.", numbers: "$I=0.278$ bits." },
      { title: "Feature selection", background: "Information gained is label entropy minus remaining conditional entropy.", numbers: "if $H(Y)=1$ and $H(Y\\mid X)=0.722$, then $I=0.278$ bits." },
      { title: "Noisy binary channel with error $0.1$ and uniform input", background: "The channel transmits one bit minus error entropy.", numbers: "$I=1-H(0.9,0.1)=0.531$ bits." },
      { title: "Table $(0.3,0.2;0.1,0.4)$", background: "A second joint table gives a smaller but positive dependence.", numbers: "$I=0.125$ bits." }
    ]
  },
  "math-21-06": {
    connectionsProse: "<p>KL divergence builds directly on entropy and cross-entropy. Entropy measures the average code length when the code matches the true distribution. Cross-entropy measures the average code length when data come from one distribution but the code is built from another. KL divergence is the extra length caused by that mismatch.</p><p>This lesson is a central bridge in the section. It explains why maximum likelihood trains models by reducing wasted code length, why variational inference has a KL gap, and why policy optimization often limits how far a new policy can move from an old one. The same formula appears in many places, so the main job is to keep its direction, units, and support assumptions clear.</p>",
    motivation: "<p>Suppose data really come from a distribution $P$, but a model uses probabilities from a different distribution $Q$. Each time outcome $x$ occurs, the ideal code under $P$ would spend $-\\log p(x)$ units, while the model code spends $-\\log q(x)$ units. The difference is the cost of using the wrong probabilities on that outcome.</p>" +
                "<p>KL divergence averages that extra cost over the true distribution $P$. It is not a distance in the geometric sense, because swapping $P$ and $Q$ usually changes the answer. That asymmetry is useful rather than accidental: using a model $Q$ to code data from $P$ is a different operation from using $P$ to code data from $Q$.</p>" +
                "<p>The value is always nonnegative when the support is valid. Zero means the model assigns the same probabilities as the truth on the outcomes that can occur. A positive value measures the average penalty per draw: in bits with base-2 logs, or in nats with natural logs.</p>",
    definition: "<p>KL divergence is the expected extra code length from using model distribution $Q$ for data drawn from $P$.</p>" +
                "<p>$$D_{KL}(P\\|Q)=\\sum_x p(x)\\log\\frac{p(x)}{q(x)}$$</p>" +
                "<p><b>Assumptions that matter:</b> Require $q(x)>0$ whenever $p(x)>0$; base $2$ logs give bits and natural logs give nats.</p>",
    symbols: [
      { sym: "$P$", desc: "the data or target distribution" },
      { sym: "$Q$", desc: "the model or reference distribution" },
      { sym: "$p(x),q(x)$", desc: "probabilities of outcome $x$" },
      { sym: "$D_{KL}(P\\|Q)$", desc: "the directed divergence" }
    ],
    derivation: [
      { do: "Let $P$ be the true distribution and $Q$ the model distribution.", result: "$P,Q$", why: "The expectation should be taken over data that actually occur." },
      { do: "Write the code lengths under $Q$ and $P$.", result: "$-\\log q(x)$ and $-\\log p(x)$", why: "Negative log probability is code length." },
      { do: "Subtract the ideal code length from the model code length.", result: "$[-\\log q(x)]-[-\\log p(x)]=\\log\\frac{p(x)}{q(x)}$", why: "This is the extra length for outcome $x$." },
      { do: "Average the extra length under $P$.", result: "$D_{KL}(P\\|Q)=\\sum_x p(x)\\log\\frac{p(x)}{q(x)}$", why: "Frequent true outcomes matter more." },
      { do: "Relate KL to cross-entropy.", result: "$H(P,Q)-H(P)=D_{KL}(P\\|Q)$", why: "$H(P,Q)=-\\sum_xp(x)\\log q(x)$ and $H(P)=-\\sum_xp(x)\\log p(x)$." },
      { do: "Apply Jensen to $-\\log t$.", result: "$D_{KL}(P\\|Q)=E_P[-\\log(Q/P)]\\ge -\\log E_P[Q/P]=-\\log\\sum_x q(x)=0$", why: "The support condition makes the ratio finite and proves nonnegativity." }
    ],
    applications: [
      { title: "Model mismatch in bits", background: "A wrong model for a fair source wastes code length.", numbers: "$P=(0.5,0.5)$, $Q=(0.25,0.75)$ gives $D_{KL}=0.2075$ bits." },
      { title: "Small policy update", background: "A modest probability shift has a small natural-log KL.", numbers: "$P=(0.6,0.4)$, $Q=(0.5,0.5)$ gives $0.0201$ nats." },
      { title: "Larger drift", background: "Moving from a skewed target to a uniform model costs more.", numbers: "$P=(0.9,0.1)$, $Q=(0.5,0.5)$ gives $0.3681$ nats." },
      { title: "VAE posterior penalty", background: "A variational posterior can be compared with a prior or reference distribution.", numbers: "$q=(0.8,0.2)$ versus $p=(0.6,0.4)$ gives $0.0915$ nats." },
      { title: "Extra code length", background: "KL is cross-entropy minus entropy.", numbers: "if $H(P,Q)=1.2075$ bits and $H(P)=1$ bit, the KL is $0.2075$ bits." },
      { title: "Three-action policy", background: "A three-action policy shift can be scored by average log ratio.", numbers: "$P=(0.2,0.5,0.3)$, $Q=(0.3,0.4,0.3)$ gives $0.0305$ nats." }
    ]
  },
  "math-21-07": {
    connectionsProse: "<p>Cross-entropy follows naturally after entropy and KL divergence. Entropy measures the code length when probabilities match the data source, while KL measures the extra cost from a mismatch. Cross-entropy includes both pieces in the single quantity optimized by many learning systems. It is the average negative log probability assigned by a model to data generated elsewhere.</p>",
    motivation: "<p>In supervised learning and probabilistic modeling, the model supplies probabilities, but the data are drawn from some target distribution. Each observed outcome is charged the code length or loss $-\\log q(x)$ according to the model's probability. Averaging those losses under the true distribution gives cross-entropy.</p>" +
                "<p>This value cannot be lower than the true entropy when the support is valid. The irreducible part is the uncertainty already present in the data source, and the extra part is the KL divergence from the true distribution to the model. This decomposition explains why improving a model means reducing the mismatch term while the data entropy itself remains fixed.</p>",
    definition: "<p>Cross-entropy is the average negative log probability assigned by $Q$ to data drawn from $P$.</p>" +
                "<p>$$H(P,Q)=-\\sum_x p(x)\\log q(x)=H(P)+D_{KL}(P\\|Q)$$</p>" +
                "<p><b>Assumptions that matter:</b> $Q$ must assign positive probability wherever $P$ can produce data; base $2$ gives bits and natural log gives nats.</p>",
    symbols: [
      { sym: "$P$", desc: "the true distribution" },
      { sym: "$Q$", desc: "the model distribution" },
      { sym: "$H(P,Q)$", desc: "cross-entropy" },
      { sym: "$H(P)$", desc: "entropy" },
      { sym: "$D_{KL}$", desc: "mismatch" }
    ],
    derivation: [
      { do: "Let outcome $x$ be drawn from $P$.", result: "$p(x)$", why: "The true distribution decides the average." },
      { do: "Assign the model code length.", result: "$-\\log q(x)$", why: "Negative log model probability is the loss for that outcome." },
      { do: "Average the model code length.", result: "$H(P,Q)=-\\sum_x p(x)\\log q(x)$", why: "This defines cross-entropy." },
      { do: "Add and subtract $\\sum_xp(x)\\log p(x)$ inside the expression.", result: "$H(P,Q)=-\\sum_xp(x)\\log p(x)+\\sum_xp(x)\\log\\frac{p(x)}{q(x)}$", why: "This separates true uncertainty from model mismatch." },
      { do: "Identify the entropy and KL terms.", result: "$H(P,Q)=H(P)+D_{KL}(P\\|Q)$", why: "Cross-entropy equals irreducible entropy plus extra KL cost." }
    ],
    applications: [
      { title: "One-hot classifier", background: "For one true class, cross-entropy is the negative log of its probability.", numbers: "true class probability $0.7$ gives $0.357$ nats." },
      { title: "Binary soft label", background: "Soft targets average model log probabilities under the target distribution.", numbers: "$P=(0.8,0.2)$, $Q=(0.6,0.4)$ gives $0.592$ nats." },
      { title: "Bits decomposition", background: "Cross-entropy splits into entropy plus KL.", numbers: "$P=(0.5,0.5)$, $Q=(0.25,0.75)$ gives $H(P,Q)=1.2075=1+0.2075$ bits." },
      { title: "Three-class labels", background: "A multiclass soft target uses all class probabilities.", numbers: "$P=(0.7,0.2,0.1)$, $Q=(0.6,0.3,0.1)$ gives $0.829$ nats." },
      { title: "Token NLL", background: "Token-level negative log probabilities add across a sequence.", numbers: "probabilities $0.9,0.5,0.25$ give total $3.152$ bits." },
      { title: "Perplexity", background: "Perplexity exponentiates base-2 cross-entropy.", numbers: "cross-entropy $1.5$ bits gives perplexity $2^{1.5}=2.828$." }
    ]
  },
  "math-21-08": {
    connectionsProse: "<p>The chain rules connect the separate entropy quantities introduced earlier. Joint entropy, marginal entropy, and conditional entropy are not unrelated formulas; they are different ways of accounting for the same uncertainty. This lesson shows how uncertainty can be counted in stages. It is used constantly in mutual information identities, graphical models, and coding arguments.</p>",
    motivation: "<p>Learning a pair can be organized as a two-step process. First learn $X$, then learn whatever uncertainty remains about $Y$ after $X$ is known. The total uncertainty in the pair should be the cost of the first stage plus the expected cost of the second stage.</p>" +
                "<p>The algebra works because every joint probability factors into a marginal times a conditional probability. Taking a logarithm turns that product into a sum, and the double sum separates into the entropy of $X$ plus the conditional entropy of $Y$ given $X$. The result is a bookkeeping rule for information, not a new kind of randomness.</p>",
    definition: "<p>The entropy chain rule says joint uncertainty can be counted by learning one variable first and then the remaining conditional uncertainty.</p>" +
                "<p>$$H(X,Y)=H(X)+H(Y\\mid X)$$</p>" +
                "<p><b>Assumptions that matter:</b> The variables are discrete; the factorization $p(x,y)=p(x)p(y\\mid x)$ is used where probabilities are positive.</p>",
    symbols: [
      { sym: "$p(y\\mid x)$", desc: "a conditional probability" },
      { sym: "$H(Y\\mid X)$", desc: "expected remaining uncertainty" },
      { sym: "$H(X,Y)$", desc: "joint entropy" }
    ],
    derivation: [
      { do: "Start from joint entropy.", result: "$H(X,Y)=-\\sum_{x,y}p(x,y)\\log_2 p(x,y)$", why: "This counts uncertainty in the pair." },
      { do: "Factor the joint probability.", result: "$p(x,y)=p(x)p(y\\mid x)$", why: "Every joint event is a marginal times a conditional." },
      { do: "Substitute the factorization.", result: "$H(X,Y)=-\\sum_{x,y}p(x,y)\\log_2[p(x)p(y\\mid x)]$", why: "Use the factorization inside the log." },
      { do: "Split the log into two terms.", result: "$\\log_2[p(x)p(y\\mid x)]=\\log_2 p(x)+\\log_2 p(y\\mid x)$", why: "Logarithms turn products into sums." },
      { do: "Simplify the first term.", result: "$-\\sum_x p(x)\\log_2 p(x)=H(X)$", why: "Marginalization removes $y$." },
      { do: "Simplify the second term.", result: "$-\\sum_{x,y}p(x,y)\\log_2 p(y\\mid x)=H(Y\\mid X)$", why: "This is conditional entropy." },
      { do: "Combine the two terms.", result: "$H(X,Y)=H(X)+H(Y\\mid X)$", why: "Joint uncertainty is first-stage plus remaining uncertainty." }
    ],
    applications: [
      { title: "Correlated table", background: "Joint entropy equals marginal entropy plus conditional entropy.", numbers: "$H(X)=1$, $H(Y\\mid X)=0.722$, so $H(X,Y)=1.722$ bits." },
      { title: "Deterministic label", background: "No remaining label uncertainty means joint entropy is just the input entropy.", numbers: "$H(Y\\mid X)=0$, so $H(X,Y)=H(X)$." },
      { title: "Independent fair bits", background: "For independent bits, conditioning does not reduce the second bit.", numbers: "$H(X,Y)=1+1=2$ bits." },
      { title: "Table $(0.3,0.2;0.1,0.4)$", background: "The same rule checks a different table.", numbers: "$H(X)=1$, $H(Y\\mid X)=0.846$, so $H(X,Y)=1.846$ bits." },
      { title: "Three-stage source", background: "The chain rule extends by adding conditional stages.", numbers: "$1+0.5+0.25=1.75$ bits." },
      { title: "Mutual information check", background: "Conditional entropy also verifies reduction in uncertainty.", numbers: "$I(X;Y)=H(Y)-H(Y\\mid X)=1-0.722=0.278$ bits." }
    ]
  },
  "math-21-09": {
    connectionsProse: "<p>The data processing inequality builds on mutual information and Markov chains. Once information passes through an intermediate representation, later processing can keep relevant information or discard it, but it cannot create new access to the original source. This is a basic constraint behind compression, privacy filters, representation learning, and channel pipelines. The lesson states that constraint in the language of mutual information.</p>",
    motivation: "<p>A Markov chain $X\\to Y\\to Z$ means that $Z$ is produced from $Y$ without any additional direct view of $X$. The downstream variable may be a feature, a quantized code, a prediction, or a noisy measurement. Whatever it is, its knowledge about $X$ must come through $Y$.</p>" +
                "<p>Mutual information makes this limitation precise. If $Z$ is a processed version of $Y$, then the information $Z$ has about $X$ is bounded by the information $Y$ had about $X$. Equality can occur for invertible processing, but ordinary compression, noise, and filtering usually reduce the amount.</p>",
    definition: "<p>The data processing inequality says processing cannot increase mutual information about an upstream source.</p>" +
                "<p>$$X\\to Y\\to Z\\quad\\Longrightarrow\\quad I(X;Z)\\le I(X;Y)$$</p>" +
                "<p><b>Assumptions that matter:</b> $X\\to Y\\to Z$ is a Markov chain, so after $Y$ is known, $Z$ adds no direct information about $X$.</p>",
    symbols: [
      { sym: "$X$", desc: "the source" },
      { sym: "$Y$", desc: "the intermediate representation" },
      { sym: "$Z$", desc: "the processed output" },
      { sym: "$I(\\cdot;\\cdot)$", desc: "mutual information" },
      { sym: "$I(X;Y\\mid Z)$", desc: "information left after conditioning on $Z$" }
    ],
    derivation: [
      { do: "Assume a Markov chain.", result: "$X\\to Y\\to Z$", why: "Once $Y$ is known, $Z$ has no extra direct access to $X$." },
      { do: "Use the chain rule for mutual information in one order.", result: "$I(X;Y,Z)=I(X;Z)+I(X;Y\\mid Z)$", why: "Learn $Z$ first, then the remaining information in $Y$." },
      { do: "Use the other order.", result: "$I(X;Y,Z)=I(X;Y)+I(X;Z\\mid Y)$", why: "Learn $Y$ first, then any remaining information in $Z$." },
      { do: "Apply the Markov condition.", result: "$I(X;Z\\mid Y)=0$", why: "After $Y$ is known, $Z$ adds no information about $X$." },
      { do: "Equate the two forms.", result: "$I(X;Y)=I(X;Z)+I(X;Y\\mid Z)$", why: "Both equal $I(X;Y,Z)$." },
      { do: "Use nonnegativity of conditional mutual information.", result: "$I(X;Y)\\ge I(X;Z)$", why: "This is the data processing inequality." }
    ],
    applications: [
      { title: "Compression bound", background: "A deterministic or random processing of $Y$ cannot exceed $Y$'s information about $X$.", numbers: "if $I(X;Y)=1.5$ bits, any $Z=f(Y)$ has $I(X;Z)\\le1.5$ bits." },
      { title: "Loss through bottleneck", background: "The difference measures information discarded by the representation.", numbers: "$1.5$ to $1.0$ bits means $0.5$ bits lost." },
      { title: "Impossible claim", background: "A downstream variable exceeding the intermediate information contradicts the Markov setup.", numbers: "$I(X;Y)=0.8$ and $I(X;Z)=1.1$ violates the Markov assumption." },
      { title: "Invertible transform", background: "Invertible processing preserves the information in $Y$.", numbers: "if $Z$ is invertible from $Y$, then $I(X;Z)=I(X;Y)$, e.g. $0.8$ bits stays $0.8$." },
      { title: "Noisy binary channel then quantizer", background: "Any later feature is bounded by the channel's mutual information.", numbers: "input-output MI $0.531$ bits bounds every later feature by $0.531$." },
      { title: "Privacy filter", background: "A filter can be judged by how much sensitive information it removes.", numbers: "reducing $I(S;Z)$ from $0.4$ to $0.1$ bits removes $0.3$ bits about sensitive attribute $S$." }
    ]
  },
  "math-21-10": {
    connectionsProse: "<p>Jensen's inequality is a general tool from convexity that supports several information-theory facts. The reader has already seen averages, logarithms, and KL nonnegativity. This lesson explains why the curvature of negative log makes those facts work. It is especially important for proving that KL divergence and many related divergences cannot be negative.</p>",
    motivation: "<p>Convex functions interact with averages in a disciplined way. Applying a convex function after averaging gives a value no larger than averaging the function values first. For information theory, the most important convex function is $-\\log t$ on positive inputs.</p>" +
                "<p>Probability ratios turn this geometric fact into a statement about model mismatch. When the ratio $Q(X)/P(X)$ is averaged under $P$, it equals one under the support assumptions. Jensen then says the average negative log ratio is at least the negative log of one, which is zero. That is the clean reason KL divergence has a nonnegative sign.</p>",
    definition: "<p>Jensen's inequality says a convex function of an average is no greater than the average of the convex function values.</p>" +
                "<p>$$f(\\sum_i\\lambda_i x_i)\\le\\sum_i\\lambda_i f(x_i)$$</p>" +
                "<p><b>Assumptions that matter:</b> The weights satisfy $\\lambda_i\\ge0$ and sum to $1$; for $-\\log t$, all inputs must be positive.</p>",
    symbols: [
      { sym: "$f$", desc: "a convex function" },
      { sym: "$\\lambda_i$", desc: "nonnegative weights" },
      { sym: "$E$", desc: "expectation" },
      { sym: "$R$", desc: "a probability ratio" }
    ],
    derivation: [
      { do: "Let $f$ be convex and let $X$ take values $x_i$ with weights $\\lambda_i\\ge0$ summing to $1$.", result: "$\\sum_i\\lambda_i=1$", why: "These are averaging weights." },
      { do: "Use the two-point convexity condition.", result: "$f(\\lambda a+(1-\\lambda)b)\\le\\lambda f(a)+(1-\\lambda)f(b)$", why: "The graph lies below chords." },
      { do: "Repeat the two-point argument.", result: "$f(\\sum_i\\lambda_i x_i)\\le\\sum_i\\lambda_i f(x_i)$", why: "This is Jensen for finite averages." },
      { do: "Choose the information-theory convex function.", result: "$f(t)=-\\log t$", why: "It is convex on $t>0$ because its second derivative is $1/t^2>0$." },
      { do: "Apply Jensen to $R=Q(X)/P(X)$ under $P$.", result: "$E_P[-\\log R]\\ge -\\log E_P[R]$", why: "Negative log of an average is no larger than average negative log." },
      { do: "Use the average ratio.", result: "$D_{KL}(P\\|Q)=E_P[-\\log(Q/P)]\\ge0$", why: "Since $E_P[Q/P]=\\sum_x q(x)=1$, this proves KL nonnegativity." }
    ],
    applications: [
      { title: "Log of an average", background: "Concavity of log reverses the convex Jensen direction for $\\ln$.", numbers: "$\\ln(0.5)= -0.693$ is at least $0.5\\ln0.2+0.5\\ln0.8=-0.916$ because $\\ln$ is concave." },
      { title: "KL bound", background: "Nonnegative KL places entropy below cross-entropy.", numbers: "$D_{KL}\\ge0$, so cross-entropy $1.4$ bits implies $H(P)\\le1.4$ bits." },
      { title: "Equality case", background: "Jensen is tight for the KL proof when every ratio is the same.", numbers: "if $P=Q$, then all ratios are $1$ and KL is $0$." },
      { title: "Model mismatch", background: "A simple two-outcome mismatch confirms a positive KL.", numbers: "$P=(0.7,0.3)$, $Q=(0.5,0.5)$ gives KL $0.082$ nats, confirming nonnegativity." },
      { title: "ELBO lower bound", background: "A nonnegative KL gap lowers the ELBO beneath the evidence.", numbers: "KL gap $0.3$ nats makes ELBO $0.3$ below $\\log p(x)$." },
      { title: "Arithmetic-geometric mean", background: "Concavity of log relates arithmetic and geometric averages.", numbers: "$0.5\\ln2+0.5\\ln8=\\ln4$, while $\\ln5$ for the arithmetic mean is larger by $0.223$ nats." }
    ]
  },
  "math-21-11": {
    connectionsProse: "<p>Source coding connects entropy to lossless compression. Earlier lessons defined entropy as average surprise; this lesson gives it an operational meaning as a best possible long-run code rate. Prefix codes provide the concrete setting, because their codewords can be decoded without ambiguity. Shannon's theorem explains both the lower bound and why long blocks can approach it.</p>",
    motivation: "<p>A lossless code should assign shorter codewords to common symbols and longer codewords to rare symbols. The expected length averages those code lengths using the source probabilities. The central limit is that no uniquely decodable binary prefix code can have an average length below the source entropy.</p>" +
                "<p>The theorem also has a constructive side. Individual symbols may force integer code lengths and therefore small overhead, but long blocks behave more smoothly. Typical length-$n$ sequences occupy about $2^{nH}$ possibilities, so roughly $nH$ bits are enough per block, up to an arbitrarily small overhead for large $n$.</p>",
    definition: "<p>Source coding studies lossless binary descriptions of symbols and relates their best average length to entropy.</p>" +
                "<p>$$L=\\sum_xp(x)\\ell(x),\\qquad L\\ge H(P)$$</p>" +
                "<p><b>Assumptions that matter:</b> The code is a binary prefix code; lengths obey Kraft's inequality; Shannon achievability uses long blocks and arbitrarily small overhead $\\epsilon$.</p>",
    symbols: [
      { sym: "$\\ell(x)$", desc: "the binary code length for symbol $x$" },
      { sym: "$L$", desc: "expected length" },
      { sym: "$H(P)$", desc: "source entropy" },
      { sym: "$K$", desc: "the Kraft sum" },
      { sym: "$\\epsilon$", desc: "an arbitrarily small overhead" }
    ],
    derivation: [
      { do: "Define expected length for a prefix code.", result: "$L=\\sum_xp(x)\\ell(x)$", why: "Average bits per symbol weight code length by frequency." },
      { do: "Use Kraft's inequality.", result: "$\\sum_x2^{-\\ell(x)}\\le1$", why: "Binary codewords must fit into a prefix tree." },
      { do: "Normalize code lengths into a distribution.", result: "$q(x)=2^{-\\ell(x)}/K$ with $K=\\sum_x2^{-\\ell(x)}\\le1$", why: "This lets code lengths be compared with probabilities." },
      { do: "Use KL nonnegativity.", result: "$H(P)\\le -\\sum_xp(x)\\log_2 q(x)$", why: "Cross-entropy cannot beat entropy." },
      { do: "Substitute $q(x)$.", result: "$-\\log_2 q(x)=\\ell(x)+\\log_2 K$", why: "This relates model code length to tree length." },
      { do: "Use $\\log_2K\\le0$ and rearrange for complete prefix codes.", result: "$L\\ge H(P)$", why: "No lossless prefix code beats entropy." },
      { do: "Use long blocks for the constructive side.", result: "$2^{nH}$ typical sequences need about $nH$ bits", why: "Rates below $H+\\epsilon$ are achievable for large $n$." }
    ],
    applications: [
      { title: "Exact dyadic source", background: "Dyadic probabilities can match integer prefix lengths exactly.", numbers: "$P=(0.5,0.25,0.25)$ has $H=1.5$ bits and code lengths $1,2,2$ give $L=1.5$." },
      { title: "Biased binary source", background: "Entropy gives the lower bound for any lossless code rate.", numbers: "$P=(0.8,0.2)$ has lower bound $0.722$ bits/symbol." },
      { title: "Fixed two-bit code waste", background: "A fixed-length code can spend more than entropy on a skewed source.", numbers: "for $P=(0.5,0.25,0.25)$, fixed length $2$ wastes $0.5$ bits/symbol." },
      { title: "Million symbols", background: "The entropy lower bound scales linearly with source length.", numbers: "at $1.5$ bits/symbol, $10^6$ symbols need at least $1.5$ Mbits." },
      { title: "Near-Shannon block code", background: "Long blocks can target entropy plus a small overhead.", numbers: "if $H=0.722$ and overhead $0.03$, rate $0.752$ bits/symbol is the target." },
      { title: "Four uniform symbols", background: "Uniform four-symbol data cannot average below two bits losslessly.", numbers: "$H=2$ bits and no lossless binary code can average below $2$." }
    ]
  },
  "math-21-12": {
    connectionsProse: "<p>Huffman coding is the concrete optimal prefix-code algorithm for a known discrete distribution. It uses the source-coding idea that frequent symbols deserve short descriptions and rare symbols can be placed deeper in the tree. The lesson builds on expected code length and prefix-code trees. It gives a practical method that often comes very close to entropy.</p>",
    motivation: "<p>A prefix code can be pictured as a binary tree whose leaves are symbols. The expected length is smaller when high-probability symbols sit near the root and low-probability symbols sit farther down. Huffman's algorithm turns that intuition into a greedy construction with a proof of optimality.</p>" +
                "<p>The key step is to pair the two least likely symbols as deepest siblings. Once those two are merged into a compound symbol, the remaining problem is a smaller version of the same problem. Repeating the merge and then expanding the tree gives an optimal prefix code for the original probabilities.</p>",
    definition: "<p>Huffman coding constructs an optimal binary prefix code for a known discrete distribution by repeatedly merging the two least likely symbols.</p>" +
                "<p>$$L=\\sum_ip_i\\ell_i$$</p>" +
                "<p><b>Assumptions that matter:</b> Probabilities are known and the code is a binary prefix code, so no codeword begins another.</p>",
    symbols: [
      { sym: "$p_i$", desc: "symbol probabilities" },
      { sym: "$\\ell_i$", desc: "code lengths" },
      { sym: "$L=\\sum_ip_i\\ell_i$", desc: "expected length in bits" }
    ],
    derivation: [
      { do: "Look at a full binary prefix tree.", result: "two deepest leaves can be chosen as siblings", why: "Deepest codewords share all but the last bit." },
      { do: "Place the two least probable symbols deepest.", result: "least likely symbols are deepest siblings", why: "Swapping a rarer symbol deeper cannot increase expected length." },
      { do: "Merge those two symbols.", result: "compound probability equals their sum", why: "The shared prefix is the same until the final bit." },
      { do: "Solve the smaller coding problem optimally.", result: "an optimal smaller tree", why: "The rest of the tree is unchanged by the final split." },
      { do: "Split the compound symbol back.", result: "one bit is added to each of the two least likely symbols", why: "This restores the original alphabet." },
      { do: "Repeat the merge process.", result: "the greedy algorithm constructs an optimal prefix tree", why: "Each reduction preserves optimal substructure." }
    ],
    applications: [
      { title: "Four-symbol code", background: "Huffman places more probable symbols at shorter depths.", numbers: "probabilities $0.4,0.3,0.2,0.1$ get lengths $1,2,3,3$ and $L=1.9$ bits." },
      { title: "Entropy gap", background: "The optimal prefix code is close to but not always equal to entropy.", numbers: "the same source has $H=1.846$ bits, so Huffman overhead is $0.054$ bits." },
      { title: "Dyadic source", background: "Dyadic probabilities can be represented exactly by prefix lengths.", numbers: "$0.5,0.25,0.25$ gives lengths $1,2,2$ and reaches $1.5$ bits." },
      { title: "Uniform four symbols", background: "Uniform four-symbol data get equal two-bit codewords.", numbers: "lengths $2,2,2,2$ give $L=2$ bits." },
      { title: "Rare error token", background: "The least likely token is placed deeper in the tree.", numbers: "probability $0.1$ receives length $3$ in the $0.4,0.3,0.2,0.1$ tree." },
      { title: "Storage estimate", background: "Expected length gives a direct pre-header storage estimate.", numbers: "$100{,}000$ symbols at $1.9$ bits/symbol need $190{,}000$ bits before headers." }
    ]
  },
  "math-21-13": {
    connectionsProse: "<p>Arithmetic coding continues the source-coding story but avoids some integer-length limits of symbol-by-symbol prefix codes. Instead of assigning a separate bit string to each symbol, it assigns one interval to the whole sequence. That lets code length track sequence probability very closely. It is a natural follow-up to entropy, negative log probability, and Huffman coding.</p>",
    motivation: "<p>A sequence with high probability should need fewer bits than a sequence with low probability. Arithmetic coding realizes this by repeatedly narrowing an interval inside $[0,1)$. Each observed symbol keeps the subinterval assigned to that symbol, so the interval width is multiplied by the symbol probability at each step.</p>" +
                "<p>At the end, any binary fraction that falls inside the final interval identifies the sequence. Narrow intervals need more bits to name, and the number of bits is about the negative base-2 logarithm of the interval width. Because the width equals the sequence probability under the model, arithmetic coding turns sequence probability directly into code length.</p>",
    definition: "<p>Arithmetic coding represents a whole sequence by a number inside an interval whose width equals the sequence probability.</p>" +
                "<p>$$\\text{bits}\\approx -\\log_2 p(x_{1:n})$$</p>" +
                "<p><b>Assumptions that matter:</b> The model assigns symbol or conditional probabilities; an interval of width $w$ can be named with about $\\lceil-\\log_2 w\\rceil$ bits.</p>",
    symbols: [
      { sym: "$x_{1:n}$", desc: "the sequence" },
      { sym: "$p(x_{1:n})$", desc: "its model probability" },
      { sym: "$w$", desc: "final interval width" },
      { sym: "$\\lceil\\cdot\\rceil$", desc: "rounds up to an integer bit count" }
    ],
    derivation: [
      { do: "Assign each symbol an interval.", result: "interval width equals symbol probability", why: "This maps probabilities to fractions of the unit interval." },
      { do: "Keep the interval for the first symbol.", result: "the current interval narrows", why: "The message must lie inside it." },
      { do: "Rescale and subdivide by next-symbol probabilities.", result: "interval widths multiply", why: "Conditional refinement multiplies interval widths." },
      { do: "Track the width after sequence $x_{1:n}$.", result: "$w=p(x_{1:n})$ for an independent model, or the product of conditional probabilities in a language model", why: "Each step multiplies by the chosen probability." },
      { do: "Name an interval of width $w$ by binary prefixes.", result: "$\\lceil-\\log_2 w\\rceil$ bits", why: "Binary prefixes cut the unit interval into powers of two." },
      { do: "Substitute the sequence probability for width.", result: "about $-\\log_2 p(x_{1:n})$ bits", why: "Sequence probability becomes code length." }
    ],
    applications: [
      { title: "Sequence probability", background: "Arithmetic code length follows the product probability of the sequence.", numbers: "$0.4\\cdot0.3\\cdot0.2=0.024$ needs $5.381$ ideal bits." },
      { title: "Integer bound", background: "A real interval can be named with the ceiling of the ideal bit count.", numbers: "width $0.024$ can be named with $\\lceil5.381\\rceil=6$ bits." },
      { title: "High-probability token run", background: "Likely tokens make a wide interval and short ideal code.", numbers: "probabilities $0.9,0.8$ need $-\\log_2(0.72)=0.474$ bits ideally." },
      { title: "Language-model NLL", background: "Token probabilities add as negative log bits across the sequence.", numbers: "token probabilities $0.9,0.5,0.25$ cost $3.152$ bits." },
      { title: "Block advantage", background: "Long blocks can approach entropy per symbol.", numbers: "a source with entropy $1.846$ bits/symbol needs about $1846$ bits for $1000$ symbols." },
      { title: "Rare event sequence", background: "Very small sequence probabilities require many identifying bits.", numbers: "probability $10^{-6}$ costs $19.932$ bits." }
    ]
  },
  "math-21-14": {
    connectionsProse: "<p>Channel capacity moves from storing symbols to communicating through noise. Mutual information already measures how much an output tells us about an input. Capacity asks for the largest such information rate after choosing the best input distribution for the channel. This gives a numerical limit on reliable communication per channel use.</p>",
    motivation: "<p>A noisy channel is described by transition probabilities from inputs to outputs. Some input choices may be more informative than others, because they produce output distributions that are easier to distinguish. Mutual information measures how much uncertainty about the input is removed by observing the output.</p>" +
                "<p>Capacity maximizes that mutual information over all input distributions. For a symmetric binary channel, the uniform input is optimal because both symbols are treated equally by the noise. The resulting formula is one bit per use minus the binary entropy of the flip probability, so more noise leaves less reliable information per use.</p>",
    definition: "<p>Channel capacity is the maximum mutual information between channel input and output over input distributions.</p>" +
                "<p>$$C=\\max_{p(x)} I(X;Y)$$</p>" +
                "<p><b>Assumptions that matter:</b> The channel law $p(y\\mid x)$ is fixed; for a binary symmetric channel with flip probability $\\varepsilon$, uniform input is optimal.</p>",
    symbols: [
      { sym: "$C$", desc: "capacity" },
      { sym: "$X$", desc: "channel input" },
      { sym: "$Y$", desc: "channel output" },
      { sym: "$p(y\\mid x)$", desc: "the channel law" },
      { sym: "$H_b(\\varepsilon)$", desc: "binary entropy of error probability $\\varepsilon$" }
    ],
    derivation: [
      { do: "Specify the channel.", result: "$p(y\\mid x)$", why: "Transition probabilities describe noisy output for each input." },
      { do: "Choose an input distribution.", result: "$p(x)$", why: "The sender controls how often each input is used." },
      { do: "Form the joint distribution.", result: "$p(x,y)=p(x)p(y\\mid x)$", why: "Input choice and channel law determine all pairs." },
      { do: "Compute mutual information.", result: "$I(X;Y)=H(Y)-H(Y\\mid X)$", why: "This is information delivered per channel use." },
      { do: "Maximize over input distributions.", result: "$C=\\max_{p(x)} I(X;Y)$", why: "Capacity is the best achievable rate for that channel." },
      { do: "Specialize to a binary symmetric channel with flip probability $\\varepsilon$ and uniform input.", result: "$H(Y)=1$ and $H(Y\\mid X)=H_b(\\varepsilon)$", why: "Output is uniform and each input has the same error entropy." },
      { do: "Subtract error entropy from one bit.", result: "$C=1-H_b(\\varepsilon)$ bits/use", why: "Uniform input is optimal by symmetry." }
    ],
    applications: [
      { title: "Noiseless bit channel", background: "With no flips, a binary channel carries a full bit per use.", numbers: "$\\varepsilon=0$ gives $C=1$ bit/use." },
      { title: "Binary symmetric channel", background: "Ten-percent flip noise removes binary error entropy from one bit.", numbers: "$\\varepsilon=0.1$ gives $C=0.531$ bits/use." },
      { title: "Very noisy channel", background: "A fair coin flip output carries no reliable input information.", numbers: "$\\varepsilon=0.5$ gives $C=0$ bits/use." },
      { title: "Block budget", background: "Capacity times channel uses bounds reliable payload.", numbers: "capacity $0.7$ bits/use over $2000$ uses carries at most $1400$ reliable bits." },
      { title: "Error $0.11$", background: "Slightly higher noise lowers capacity to about one-half bit per use.", numbers: "$C=0.500$ bits/use." },
      { title: "Error $0.01$", background: "Low flip noise leaves most of the one-bit capacity.", numbers: "$C=0.919$ bits/use." }
    ]
  },
  "math-21-15": {
    connectionsProse: "<p>The noisy-channel coding theorem gives channel capacity its operational meaning. The capacity formula says how much information a channel can carry per use; the theorem says what rates are actually reliable in the long-block limit. It connects mutual information, coding, and probability of decoding error. This lesson is explain-only because the full proof is long and technical.</p>",
    motivation: "<p>A code for a noisy channel maps messages to length-$n$ channel input sequences and uses a decoder to guess the message from the noisy output. The communication rate counts how many message bits are sent per channel use. The theorem separates possible rates from impossible ones using the single number $C$.</p>" +
                "<p>If the rate is below capacity, there exist long codes whose error probability can be made arbitrarily small. If the rate is above capacity, no coding method can make communication reliable. The proof requires typical sequences, random codebooks, decoding error bounds, and a converse argument, so the responsible lesson goal is to state the theorem clearly rather than compress the proof into a false derivation.</p>",
    definition: "<p>The noisy-channel coding theorem states that rates below capacity can be made reliable with long codes, while rates above capacity cannot.</p>" +
                "<p>$$R<C\\text{ is achievable with arbitrarily small error; }R>C\\text{ is not reliably achievable.}$$</p>" +
                "<p><b>Assumptions that matter:</b> The statement concerns long block codes over a fixed noisy channel; the full proof requires typical sequences, random codebooks, decoding error bounds, and a converse argument.</p>",
    symbols: [
      { sym: "$R$", desc: "communication rate in bits per channel use" },
      { sym: "$C$", desc: "channel capacity" },
      { sym: "$n$", desc: "the number of channel uses in one codeword" },
      { sym: "error probability", desc: "the chance the decoded message differs from the sent message" }
    ],
    applications: [
      { title: "Below capacity", background: "A rate under capacity can be made reliable with sufficiently long blocks.", numbers: "if $C=0.7$ and $R=0.6$, the theorem allows arbitrarily small error with long blocks." },
      { title: "Above capacity", background: "A rate above capacity cannot be made reliable by coding tricks.", numbers: "if $C=0.7$ and $R=0.8$, reliable communication is impossible." },
      { title: "Payload limit", background: "Block length times capacity estimates reliable payload size.", numbers: "$n=1000$, $C=0.531$ supports about $531$ reliable bits on a BSC with error $0.1$." },
      { title: "Safety margin", background: "Operating below capacity leaves room for coding overhead and reliability.", numbers: "using $R=0.5$ on that channel leaves $0.031$ bits/use of margin." },
      { title: "Noisy half-capacity channel", background: "A half-bit channel carries about half a bit per use in the long-block limit.", numbers: "$C=0.500$ over $10{,}000$ uses supports about $5000$ bits." },
      { title: "Zero-capacity channel", background: "Any positive rate is too high when capacity is zero.", numbers: "if $C=0$, even $R=0.01$ bits/use is above capacity." }
    ]
  },
  "math-21-16": {
    connectionsProse: "<p>Rate–distortion theory is the lossy counterpart of source coding. Entropy gives the minimum rate when reconstruction must be exact, while rate–distortion allows controlled error. The lesson introduces a distortion budget and asks how much information must still pass from the source to the reconstruction. This is the mathematical setting for lossy compression tradeoffs.</p>",
    motivation: "<p>Lossy compression replaces each source value with an approximation. To make that precise, the problem needs a distortion function that assigns a cost to each reconstruction error and a budget for the average cost. A larger budget allows rougher reconstructions and should require fewer bits.</p>" +
                "<p>The rate–distortion function measures the least mutual information between the source and its reconstruction among all conditional reconstruction rules that satisfy the distortion constraint. For a fair binary source with Hamming distortion, allowing an error probability $D$ removes $H_b(D)$ bits of uncertainty, leaving the rate $1-H_b(D)$ for $D\\le1/2$.</p>",
    definition: "<p>The rate-distortion function is the least information rate needed to reconstruct a source under an average distortion budget.</p>" +
                "<p>$$R(D)=\\min_{p(\\hat x\\mid x):E[d]\\le D}I(X;\\hat X)$$</p>" +
                "<p><b>Assumptions that matter:</b> A distortion function $d(x,\\hat x)$ and budget $D$ are fixed; for a fair binary source with Hamming distortion, $D\\le1/2$ gives $R(D)=1-H_b(D)$.</p>",
    symbols: [
      { sym: "$D$", desc: "the distortion budget" },
      { sym: "$R(D)$", desc: "the minimum rate" },
      { sym: "$\\hat X$", desc: "reconstruction" },
      { sym: "$d$", desc: "distortion" },
      { sym: "$H_b$", desc: "binary entropy" }
    ],
    derivation: [
      { do: "Let $X$ be the source and $\\hat X$ its reconstruction.", result: "$X,\\hat X$", why: "Lossy coding replaces the source by an approximation." },
      { do: "Choose a distortion function.", result: "$d(x,\\hat x)$", why: "This defines the cost of a reconstruction error." },
      { do: "Require average distortion to stay within budget.", result: "$E[d(X,\\hat X)]\\le D$", why: "The allowed quality loss is a constraint." },
      { do: "Measure preserved information.", result: "$I(X;\\hat X)$", why: "Reconstruction cannot depend on the source without information flow." },
      { do: "Minimize over conditional reconstructions satisfying the constraint.", result: "$R(D)=\\min_{p(\\hat x\\mid x):E[d]\\le D}I(X;\\hat X)$", why: "This is the rate-distortion function." },
      { do: "Specialize to a fair binary source with Hamming distortion $D\\le1/2$.", result: "$R(D)=1-H_b(D)$", why: "The optimal strategy is a binary symmetric error of probability $D$." }
    ],
    applications: [
      { title: "Lossless limit", background: "With no distortion, a fair bit still needs one bit.", numbers: "$D=0$ for a fair bit gives $R(D=0)=1$ bit." },
      { title: "Allow $10\\%$ bit errors", background: "A ten-percent distortion budget reduces the required rate.", numbers: "$R(D=0.1)=0.531$ bits." },
      { title: "Allow $50\\%$ errors", background: "At random-guess distortion for a fair bit, no information is needed.", numbers: "$R(D=0.5)=0$ bits." },
      { title: "Image budget", background: "Bits per pixel scale over all pixels.", numbers: "$R=0.25$ bits/pixel over $10^6$ pixels gives $250{,}000$ bits." },
      { title: "Distortion margin", background: "The savings are the difference between lossless and lossy rates.", numbers: "lowering rate from $1$ to $0.531$ saves $0.469$ bits/source bit at $D=0.1$." },
      { title: "Two-class label compression", background: "A one-percent allowed error leaves most of the bit.", numbers: "allowed error $0.01$ gives $R=0.919$ bits." }
    ]
  },
  "math-21-17": {
    connectionsProse: "<p>The maximum entropy principle uses entropy as a rule for choosing a distribution under limited information. If only certain constraints are known, the preferred distribution is the one with the largest entropy among distributions satisfying them. With only the number of possible outcomes known, this becomes the uniform distribution. The lesson connects entropy to Lagrange multipliers and modeling discipline.</p>",
    motivation: "<p>Choosing a distribution can accidentally add assumptions that the evidence does not support. The maximum entropy principle avoids that by spreading probability as evenly as the known constraints allow. When the only constraint is that probabilities sum to one, there is no reason within the model to favor one outcome over another.</p>" +
                "<p>The derivation makes that symmetry explicit. Maximizing entropy with a normalization constraint gives the same derivative condition for every probability. All optimal probabilities therefore have the same logarithm and must be equal, producing $p_i=1/n$ and entropy $\\ln n$ nats or $\\log_2 n$ bits.</p>",
    definition: "<p>The maximum entropy principle chooses the highest-entropy distribution among those satisfying the known constraints.</p>" +
                "<p>$$H(p)=-\\sum_i p_i\\ln p_i$$</p>" +
                "<p><b>Assumptions that matter:</b> With only normalization $\\sum_i p_i=1$ over $n$ outcomes, the maximizing distribution is uniform.</p>",
    symbols: [
      { sym: "$p_i$", desc: "probabilities over $n$ outcomes" },
      { sym: "$\\lambda$", desc: "a Lagrange multiplier" },
      { sym: "$H$", desc: "entropy" }
    ],
    derivation: [
      { do: "Maximize entropy subject to normalization.", result: "$H(p)=-\\sum_i p_i\\ln p_i$ subject to $\\sum_i p_i=1$", why: "The only constraint is normalization." },
      { do: "Form the Lagrangian.", result: "$\\mathcal L=-\\sum_i p_i\\ln p_i+\\lambda(\\sum_i p_i-1)$", why: "The multiplier enforces total probability one." },
      { do: "Differentiate with respect to $p_i$.", result: "$\\partial\\mathcal L/\\partial p_i=-(\\ln p_i+1)+\\lambda$", why: "Each probability is varied separately." },
      { do: "Set the derivative to zero.", result: "$\\ln p_i=\\lambda-1$", why: "All optimal probabilities have the same log." },
      { do: "Use normalization.", result: "$p_i=1/n$", why: "Equal logs mean a uniform distribution." },
      { do: "Substitute the uniform distribution into entropy.", result: "$H=\\ln n$ nats, or $\\log_2 n$ bits", why: "This is the entropy at the maximum." }
    ],
    applications: [
      { title: "Four outcomes", background: "Uniform mass over four outcomes maximizes entropy.", numbers: "max entropy is $\\log_2 4=2$ bits." },
      { title: "Ten classes", background: "Without other constraints, ten labels are maximally uncertain when uniform.", numbers: "max entropy is $\\log_2 10=3.322$ bits." },
      { title: "Binary label with no other constraint", background: "The maximum-entropy binary distribution is fair.", numbers: "$p=(0.5,0.5)$ and $H=1$ bit." },
      { title: "Uniform byte", background: "A byte has 256 equally possible values at maximum entropy.", numbers: "$256$ values give $8$ bits." },
      { title: "Nats version", background: "Natural logs report maximum entropy in nats.", numbers: "four outcomes give $\\ln4=1.386$ nats." },
      { title: "Model check", background: "A skewed three-class distribution falls below the uniform maximum.", numbers: "distribution $(0.7,0.2,0.1)$ has $1.157$ bits, below the three-class maximum $1.585$ bits." }
    ]
  },
  "math-21-18": {
    connectionsProse: "<p>The family of $f$-divergences generalizes KL divergence. Earlier lessons compared distributions through log ratios; this lesson keeps the ratio idea but allows many convex penalty functions. Different choices of $f$ recover different notions of discrepancy. The common structure helps keep support assumptions and nonnegativity clear.</p>",
    motivation: "<p>When two distributions are compared point by point, the ratio $p(x)/q(x)$ says how much more or less mass $P$ assigns than $Q$. A ratio of one means local agreement, while ratios away from one signal mismatch. An $f$-divergence applies a convex penalty to each ratio and averages those penalties under the reference distribution $Q$.</p>" +
                "<p>Convexity is what gives the whole family its nonnegative sign. Since the $Q$-weighted average ratio equals one, Jensen's inequality says the average penalty is at least the penalty at one. With $f(1)=0$, equal distributions have zero divergence and valid mismatches have nonnegative divergence.</p>",
    definition: "<p>An $f$-divergence compares two distributions by averaging a convex penalty of their probability ratio.</p>" +
                "<p>$$D_f(P\\|Q)=\\sum_x q(x)f(p(x)/q(x))$$</p>" +
                "<p><b>Assumptions that matter:</b> The function $f$ is convex with $f(1)=0$; require $q(x)>0$ wherever $p(x)>0$.</p>",
    symbols: [
      { sym: "$f$", desc: "a convex function" },
      { sym: "$D_f$", desc: "the divergence generated by $f$" },
      { sym: "$p(x)/q(x)$", desc: "a probability ratio" }
    ],
    derivation: [
      { do: "Compare $P$ to $Q$ through ratios.", result: "$r(x)=p(x)/q(x)$", why: "Ratios show where $P$ puts more or less mass than $Q$." },
      { do: "Choose a convex function with zero at one.", result: "$f(1)=0$", why: "Ratio $1$ means no local mismatch." },
      { do: "Average the penalty under $Q$.", result: "$D_f(P\\|Q)=\\sum_x q(x)f(p(x)/q(x))$", why: "The reference distribution supplies the weights." },
      { do: "Check equal distributions.", result: "$D_f=\\sum_xq(x)f(1)=0$", why: "If $P=Q$, every ratio is $1$." },
      { do: "Apply Jensen.", result: "$\\sum_xq(x)f(r(x))\\ge f(\\sum_xq(x)r(x))$", why: "Convex functions put the average penalty above the penalty at the average ratio." },
      { do: "Compute the average ratio.", result: "$\\sum_xq(x)p(x)/q(x)=\\sum_xp(x)=1$, so $D_f(P\\|Q)\\ge f(1)=0$", why: "This proves nonnegativity under support conditions." }
    ],
    applications: [
      { title: "Pearson chi-square", background: "Choosing a squared ratio penalty gives Pearson chi-square divergence.", numbers: "$f(t)=(t-1)^2$, $P=(0.6,0.4)$, $Q=(0.5,0.5)$ gives $0.040$." },
      { title: "KL as an $f$-divergence", background: "KL appears from the convex generator $t\\ln t$.", numbers: "$f(t)=t\\ln t$ gives $0.0201$ nats for the same $P,Q$." },
      { title: "Total variation", background: "Absolute ratio deviation gives total variation in this form.", numbers: "$f(t)=0.5|t-1|$ gives $0.100$." },
      { title: "Squared Hellinger form", background: "A square-root ratio penalty gives squared Hellinger form.", numbers: "$f(t)=(\\sqrt t-1)^2$ gives $0.0101$." },
      { title: "Jensen-Shannon example", background: "A symmetrized smoothed KL gives a finite bits-valued comparison.", numbers: "$P=(0.8,0.2)$ and $Q=(0.2,0.8)$ give $0.278$ bits." },
      { title: "Zero check", background: "Equal distributions make every local ratio exactly one.", numbers: "$P=Q$ makes every ratio $1$ and every valid $D_f=0$." }
    ]
  },
  "math-21-19": {
    connectionsProse: "<p>The ELBO connects KL divergence to latent-variable modeling. In these models the observed data $x$ depend on an unobserved variable $z$, and the exact posterior over $z$ is often hard to compute. A variational distribution gives a tractable substitute. The lesson shows that the price of this substitution is exactly a KL gap.</p>",
    motivation: "<p>The evidence $\\log p(x)$ is the quantity a latent-variable model would like to evaluate or maximize. Direct computation can be difficult because it requires summing or integrating over latent variables. Variational inference introduces a manageable distribution $q(z\\mid x)$ and rewrites the evidence in terms of an objective plus a mismatch term.</p>" +
                "<p>The objective is the evidence lower bound, or ELBO. It is lower than the true log evidence because the remaining term is a KL divergence from the variational posterior to the true posterior. When the approximation is exact, the KL gap is zero and the bound is tight; when the approximation is loose, the ELBO falls below the evidence by that many nats.</p>",
    definition: "<p>The ELBO is a variational lower bound on log evidence whose gap is a posterior KL divergence.</p>" +
                "<p>$$\\log p(x)=\\mathrm{ELBO}+D_{KL}(q(z\\mid x)\\|p(z\\mid x))$$</p>" +
                "<p><b>Assumptions that matter:</b> Expectations are under the variational distribution $q(z\\mid x)$; logs are natural in most ML uses.</p>",
    symbols: [
      { sym: "$x$", desc: "observed data" },
      { sym: "$z$", desc: "latent variable" },
      { sym: "$p(x,z)$", desc: "the joint model" },
      { sym: "$p(z\\mid x)$", desc: "the true posterior" },
      { sym: "$q(z\\mid x)$", desc: "the variational approximation" }
    ],
    derivation: [
      { do: "Start with evidence.", result: "$\\log p(x)$", why: "This is the log probability of observed data." },
      { do: "Insert any variational distribution $q(z\\mid x)$.", result: "$\\log p(x)=E_q[\\log p(x)]$", why: "A constant equals its expectation." },
      { do: "Use the posterior identity.", result: "$p(x)=p(x,z)/p(z\\mid x)$", why: "Rearrange the definition of the posterior." },
      { do: "Substitute inside the log.", result: "$\\log p(x)=E_q[\\log p(x,z)-\\log p(z\\mid x)]$", why: "This expresses evidence using latent $z$." },
      { do: "Add and subtract $E_q[\\log q(z\\mid x)]$.", result: "variational objective plus KL gap", why: "This creates the ELBO and the mismatch term." },
      { do: "Group terms.", result: "$\\log p(x)=E_q[\\log p(x,z)-\\log q(z\\mid x)]+E_q[\\log q(z\\mid x)-\\log p(z\\mid x)]$", why: "The two grouped expectations have standard meanings." },
      { do: "Identify the two groups.", result: "$\\mathrm{ELBO}=E_q[\\log p(x,z)-\\log q(z\\mid x)]$ and $D_{KL}(q(z\\mid x)\\|p(z\\mid x))$", why: "KL is nonnegative." },
      { do: "Use nonnegativity of the KL gap.", result: "$\\mathrm{ELBO}\\le\\log p(x)$", why: "Equality holds when $q(z\\mid x)=p(z\\mid x)$." }
    ],
    applications: [
      { title: "Gap computation", background: "ELBO equals log evidence minus the KL gap.", numbers: "if $\\log p(x)=-2.0$ and KL gap is $0.3$, ELBO is $-2.3$." },
      { title: "Negative ELBO loss", background: "Training often minimizes reconstruction plus KL.", numbers: "reconstruction $1.6$ plus KL $0.4$ gives loss $2.0$." },
      { title: "Beta-VAE weighting", background: "A beta-VAE changes the KL weight in the objective.", numbers: "with KL weight $0.25$, $1.6+0.25(0.4)=1.7$." },
      { title: "Tight posterior", background: "An exact variational posterior closes the gap.", numbers: "KL gap $0$ makes ELBO equal $\\log p(x)$." },
      { title: "Loose posterior", background: "The difference between evidence and ELBO is the KL gap.", numbers: "ELBO $-3.0$ and log evidence $-2.4$ imply gap $0.6$ nats." },
      { title: "Two-example batch", background: "Batch objectives average example-level ELBOs.", numbers: "ELBOs $-2.3$ and $-1.7$ average to $-2.0$." }
    ]
  },
  "math-21-20": {
    connectionsProse: "<p>This capstone gathers the section's training-objective uses into one place. Cross-entropy supplies classifier losses, the ELBO supplies the VAE reconstruction-plus-KL objective, and KL divergence controls policy movement in reinforcement learning. The reader has already seen each mathematical piece separately. This lesson emphasizes which distributions play the roles of data, model, posterior, prior, old policy, and new policy.</p>",
    motivation: "<p>Many machine-learning objectives are built from negative log probabilities. In a one-hot classifier, only the true class contributes, so multiclass cross-entropy becomes the negative log probability assigned to that class. A confident correct prediction has a small loss, while a low true-class probability has a large loss.</p>" +
                "<p>VAEs and policy methods use the same ingredients with different distributions. In a VAE, the negative ELBO separates into a reconstruction term and a KL term that keeps the encoder distribution near the prior. In reinforcement learning, a KL penalty or trust-region constraint limits how far a new policy moves from the old policy, with old-policy action probabilities weighting the movement cost.</p>",
    definition: "<p>Cross-entropy, VAE losses, and policy KL penalties are training objectives built from negative log probabilities and KL divergence.</p>" +
                "<p>$$L=-\\sum_k y_k\\ln \\hat p_k,\\qquad D_{KL}(\\pi_{old}\\|\\pi_{new})=\\sum_a\\pi_{old}(a)\\ln[\\pi_{old}(a)/\\pi_{new}(a)]$$</p>" +
                "<p><b>Assumptions that matter:</b> Labels are one-hot for the classifier reduction; VAE logs and RL KL penalties usually use natural logs, so losses are in nats.</p>",
    symbols: [
      { sym: "$y_k$", desc: "a one-hot label" },
      { sym: "$\\hat p_k$", desc: "predicted class probability" },
      { sym: "$q(z\\mid x)$", desc: "an encoder distribution" },
      { sym: "$p(z)$", desc: "a prior" },
      { sym: "$\\pi_{old},\\pi_{new}$", desc: "action distributions" }
    ],
    derivation: [
      { do: "Use a one-hot label $y$.", result: "exactly one component $y_k$ is $1$", why: "Only the true class contributes to the sum." },
      { do: "Write cross-entropy loss.", result: "$L=-\\sum_k y_k\\ln \\hat p_k$", why: "It averages negative log predicted probabilities under the label distribution." },
      { do: "Reduce to the true class $c$.", result: "$L=-\\ln\\hat p_c$", why: "Only the true class has $y_c=1$." },
      { do: "Use the VAE ELBO identity.", result: "$-\\mathrm{ELBO}=E_q[-\\log p(x\\mid z)]+D_{KL}(q(z\\mid x)\\|p(z))$", why: "When $p(x,z)=p(x\\mid z)p(z)$, negative ELBO becomes reconstruction plus prior KL." },
      { do: "Write the RL trust-region penalty.", result: "$D_{KL}(\\pi_{old}\\|\\pi_{new})=\\sum_a\\pi_{old}(a)\\ln[\\pi_{old}(a)/\\pi_{new}(a)]$", why: "Old-policy actions weight the movement cost." },
      { do: "Compare the objectives.", result: "negative-log and KL quantities with different choices of distributions", why: "The training loop chooses which distribution is treated as data or reference." }
    ],
    applications: [
      { title: "Classifier loss", background: "One-hot cross-entropy becomes the negative log of the true class probability.", numbers: "prediction $[0.1,0.7,0.2]$ with class 2 gives $-\\ln0.7=0.357$ nats." },
      { title: "Worse classifier", background: "A low true-class probability produces a larger loss.", numbers: "true-class probability $0.1$ gives $2.303$ nats." },
      { title: "VAE loss", background: "Negative ELBO adds reconstruction loss and KL penalty.", numbers: "reconstruction $2.1$ plus KL $0.3$ gives negative ELBO $2.4$." },
      { title: "Policy KL", background: "A small policy movement has a small KL cost.", numbers: "old $(0.6,0.4)$ and new $(0.5,0.5)$ give $0.0201$ nats." },
      { title: "Policy penalty objective", background: "A KL penalty adds weighted movement cost to the reward loss.", numbers: "reward loss $1.2$ plus KL weight $0.5$ times $0.0201$ gives $1.210$ total." },
      { title: "Distillation soft-label cross-entropy", background: "Teacher probabilities define the target distribution for the student.", numbers: "teacher $(0.8,0.2)$ and student $(0.6,0.4)$ gives $0.592$ nats." }
    ]
  }
};
