/* Real-world application domains and the lessons (concepts) that power them. */
window.APPLICATIONS = [
  {
    id: "recommender-systems",
    name: "Recommender Systems",
    icon: "🎬",
    blurb: "How Netflix, Spotify and Amazon predict what you'll watch, hear or buy next from your past behavior and people like you.",
    lessons: [
      { id: "cls-recommender", how: "matrix factorization predicts unseen user-item ratings" },
      { id: "ml-pca", how: "compresses users and items into latent factors" },
      { id: "la-svd", how: "decomposes the ratings matrix into latent dimensions" },
      { id: "dl-cosine-similarity", how: "scores how similar two item or user vectors are" },
      { id: "cls-factor-analysis", how: "models hidden taste factors behind ratings" },
      { id: "dl-word-embeddings", how: "learns dense vectors for items and users" },
      { id: "cls-bandits", how: "balances exploring new items vs exploiting favorites" },
      { id: "ml-linear-regression", how: "predicts ratings from user and item features" },
      { id: "ml-regularization", how: "stops latent factors from overfitting sparse data" },
      { id: "fnd-dot", how: "dot product scores user-item affinity" },
      { id: "cls-spectral-clustering", how: "graph clustering finds related items" }
    ]
  },
  {
    id: "search-ranking",
    name: "Search & Ranking",
    icon: "🔎",
    blurb: "How web search engines and social feeds decide which results or posts to show you first, ordered by relevance.",
    lessons: [
      { id: "ai-linear-predictors", how: "scores each document against the query" },
      { id: "ml-logistic-regression", how: "predicts click probability for ranking" },
      { id: "dl-cosine-similarity", how: "matches query vector to document vectors" },
      { id: "dl-word-embeddings", how: "represents queries and documents as vectors" },
      { id: "cls-gradient-boosting", how: "learning-to-rank with boosted trees (LambdaMART)" },
      { id: "ml-classification-metrics", how: "measures relevance precision and recall" },
      { id: "ml-roc-auc", how: "evaluates ranking quality across thresholds" },
      { id: "mod-transformer", how: "deep semantic matching of query and text" },
      { id: "cls-bandits", how: "explores new results to learn what users click" },
      { id: "fnd-norm", how: "normalizes vectors before similarity scoring" },
      { id: "cls-stacking", how: "blends multiple ranking signals into one score" }
    ]
  },
  {
    id: "llm-chatbots",
    name: "Large Language Models & Chatbots",
    icon: "💬",
    blurb: "How ChatGPT and similar assistants read your words and generate fluent, helpful replies one token at a time.",
    lessons: [
      { id: "mod-llm", how: "the core GPT/BERT architecture that powers chat" },
      { id: "mod-transformer", how: "self-attention reads the whole context at once" },
      { id: "mod-multihead", how: "multiple attention heads capture different relations" },
      { id: "dl-attention", how: "lets each word focus on relevant earlier words" },
      { id: "dl-word-embeddings", how: "turns tokens into dense meaning vectors" },
      { id: "dl-cross-entropy", how: "loss for predicting the next token" },
      { id: "ml-softmax", how: "turns scores into a probability over the vocabulary" },
      { id: "dl-backprop", how: "trains billions of weights by gradient signal" },
      { id: "dl-optimizers", how: "Adam updates the huge weight matrices stably" },
      { id: "mod-actor-critic", how: "RLHF (PPO) aligns answers to human preferences" },
      { id: "la-matmul", how: "matrix multiplies are the core compute of every layer" },
      { id: "dl-forward-prop", how: "runs tokens forward through the network" }
    ]
  },
  {
    id: "computer-vision",
    name: "Computer Vision",
    icon: "📷",
    blurb: "How self-driving cars, phones and cameras detect objects, recognize faces and understand images.",
    lessons: [
      { id: "dl-conv", how: "convolution filters detect edges and textures" },
      { id: "dl-pooling", how: "downsamples feature maps to summarize regions" },
      { id: "dl-object-detection", how: "YOLO and IoU locate and box objects" },
      { id: "dl-face-recognition", how: "triplet loss verifies identity from a face" },
      { id: "dl-conv-hyperparams", how: "stride and padding set the output map size" },
      { id: "dl-cnn-params", how: "counts the weights a vision model must learn" },
      { id: "dl-data-augmentation", how: "flips and crops to multiply training images" },
      { id: "dl-batchnorm", how: "stabilizes and speeds up deep CNN training" },
      { id: "mod-vit", how: "Vision Transformers classify image patches" },
      { id: "dl-cross-entropy", how: "loss for image classification labels" },
      { id: "dl-activations", how: "ReLU adds nonlinearity between conv layers" },
      { id: "dl-dropout", how: "regularizes deep vision nets against overfitting" }
    ]
  },
  {
    id: "image-generation",
    name: "Image Generation",
    icon: "🎨",
    blurb: "How tools like Stable Diffusion, DALL-E and style-transfer apps create new images from noise or text prompts.",
    lessons: [
      { id: "mod-diffusion", how: "denoises random noise into a clean image" },
      { id: "dl-gan", how: "generator and discriminator compete to make realism" },
      { id: "mod-vae", how: "encodes images into a sampleable latent space" },
      { id: "mod-normalizing-flows", how: "invertible maps for exact-likelihood generation" },
      { id: "dl-style-transfer", how: "repaints a photo in an artist's style" },
      { id: "prob-normal", how: "Gaussian noise is the starting point for sampling" },
      { id: "mod-contrastive", how: "CLIP aligns text prompts with image content" },
      { id: "dl-backprop", how: "trains the generator from the loss signal" },
      { id: "mod-autoencoder", how: "compresses images to a latent before decoding" }
    ]
  },
  {
    id: "speech-translation",
    name: "Speech Recognition & Translation",
    icon: "🗣️",
    blurb: "How voice assistants transcribe speech and apps translate between languages in real time.",
    lessons: [
      { id: "dl-rnn", how: "processes audio and word sequences over time" },
      { id: "dl-lstm-gru", how: "gates remember context across long utterances" },
      { id: "dl-attention", how: "aligns input sounds with output words" },
      { id: "mod-transformer", how: "modern sequence-to-sequence translation backbone" },
      { id: "ai-hmm", how: "classic phoneme sequence modeling for ASR" },
      { id: "aix-forward-backward", how: "smooths over hidden phoneme states" },
      { id: "dl-word-embeddings", how: "represents words for translation" },
      { id: "ml-softmax", how: "picks the next word from the vocabulary" },
      { id: "dl-cross-entropy", how: "loss for predicting the correct transcription" }
    ]
  },
  {
    id: "medical-diagnosis",
    name: "Medical Diagnosis & Imaging",
    icon: "🩺",
    blurb: "How AI reads X-rays, MRIs and lab results to flag disease and support doctors' decisions.",
    lessons: [
      { id: "dl-conv", how: "scans medical images for tumors and lesions" },
      { id: "ml-logistic-regression", how: "estimates disease probability from features" },
      { id: "ml-classification-metrics", how: "sensitivity and specificity for diagnosis" },
      { id: "ml-roc-auc", how: "trades off false positives vs missed cases" },
      { id: "prob-bayes", how: "updates disease odds given a positive test" },
      { id: "ml-naive-bayes", how: "combines symptom probabilities for diagnosis" },
      { id: "dl-data-augmentation", how: "expands scarce labeled medical scans" },
      { id: "ml-regularization", how: "prevents overfitting on small patient datasets" },
      { id: "dl-object-detection", how: "localizes nodules and abnormalities in scans" }
    ]
  },
  {
    id: "fraud-anomaly",
    name: "Fraud & Anomaly Detection",
    icon: "🚨",
    blurb: "How banks and platforms spot fraudulent transactions and unusual behavior that don't fit normal patterns.",
    lessons: [
      { id: "cls-anomaly", how: "Isolation Forest flags rare outlier transactions" },
      { id: "ml-logistic-regression", how: "scores each transaction's fraud probability" },
      { id: "cls-gradient-boosting", how: "XGBoost is the workhorse fraud classifier" },
      { id: "prob-normal", how: "models normal behavior to detect deviations" },
      { id: "prob-inequalities", how: "Chebyshev bounds flag how-far-from-mean events" },
      { id: "ml-classification-metrics", how: "precision matters on rare fraud cases" },
      { id: "ml-roc-auc", how: "tunes the alert threshold for fraud" },
      { id: "cls-gmm", how: "clusters normal behavior, flags low-density points" },
      { id: "cls-dbscan", how: "density clustering isolates anomalous points" },
      { id: "ml-knn", how: "distance to neighbors flags isolated points" },
      { id: "cls-lda-qda", how: "discriminant analysis separates fraud from normal" }
    ]
  },
  {
    id: "credit-risk",
    name: "Credit Scoring & Risk",
    icon: "💳",
    blurb: "How lenders predict whether a borrower will repay and set credit limits and interest rates.",
    lessons: [
      { id: "ml-logistic-regression", how: "the standard model for default probability" },
      { id: "ml-glm", how: "generalized linear models for risk outcomes" },
      { id: "cls-gradient-boosting", how: "boosted trees boost credit-scoring accuracy" },
      { id: "ml-classification-metrics", how: "evaluates approve/deny decision quality" },
      { id: "ml-roc-auc", how: "ranks borrowers by risk across cutoffs" },
      { id: "ml-regularization", how: "keeps scorecards simple and generalizable" },
      { id: "ml-trees", how: "interpretable rules for accept/reject" },
      { id: "ml-likelihood", how: "fits the model by maximum likelihood" },
      { id: "prob-bernoulli-binomial", how: "default is a Bernoulli repay-or-not event" },
      { id: "ml-ensembles", how: "random forests rank applicants by default risk" },
      { id: "ml-supervised", how: "labeled past loans train the scoring model" }
    ]
  },
  {
    id: "algorithmic-trading",
    name: "Finance & Algorithmic Trading",
    icon: "📈",
    blurb: "How quant funds forecast prices, build portfolios and execute trades automatically.",
    lessons: [
      { id: "mod-timeseries", how: "ARIMA forecasts price and return series" },
      { id: "ml-linear-regression", how: "estimates factor exposures and signals" },
      { id: "prob-covariance-correlation", how: "asset covariance drives portfolio risk" },
      { id: "ml-pca", how: "extracts dominant market risk factors" },
      { id: "prob-normal", how: "models returns for risk and pricing" },
      { id: "prob-variance", how: "volatility is the variance of returns" },
      { id: "cls-bandits", how: "allocates capital while exploring strategies" },
      { id: "prob-expectation", how: "expected return drives trade decisions" },
      { id: "probx-mgf", how: "moment generating functions for return tails" },
      { id: "fnd-eigen", how: "eigen-decomposes the covariance matrix" }
    ]
  },
  {
    id: "spam-moderation",
    name: "Spam & Content Moderation",
    icon: "🛡️",
    blurb: "How email and social platforms filter spam, abuse and harmful content automatically.",
    lessons: [
      { id: "ml-naive-bayes", how: "classic word-probability spam filter" },
      { id: "ml-logistic-regression", how: "scores messages as spam or harmful" },
      { id: "dl-word-embeddings", how: "represents text meaning for classification" },
      { id: "mod-transformer", how: "context-aware toxicity and abuse detection" },
      { id: "ml-svm", how: "max-margin text classifier for spam" },
      { id: "ml-classification-metrics", how: "balances false bans vs missed spam" },
      { id: "prob-bayes", how: "updates spam odds from observed words" },
      { id: "aix-lda-topic", how: "topic modeling surfaces themes in flagged text" },
      { id: "ml-kernels", how: "kernel SVM separates nonlinear spam patterns" },
      { id: "ml-gda", how: "Gaussian models of spam vs ham word counts" }
    ]
  },
  {
    id: "robotics-control",
    name: "Robotics & Control",
    icon: "🤖",
    blurb: "How robot arms, drones and warehouse bots learn to move and act to achieve goals.",
    lessons: [
      { id: "ai-mdp", how: "frames control as states, actions and rewards" },
      { id: "ai-policy-value", how: "values states to choose good actions" },
      { id: "ai-value-iteration", how: "computes the optimal control policy" },
      { id: "ai-q-learning", how: "learns control by trial and error" },
      { id: "mod-policy-gradient", how: "directly optimizes continuous motor policies" },
      { id: "mod-actor-critic", how: "PPO trains stable robot control policies" },
      { id: "aix-sarsa-td", how: "temporal-difference updates from each step" },
      { id: "ai-astar", how: "plans collision-free paths to a goal" },
      { id: "ai-hmm", how: "estimates robot state from noisy sensors" },
      { id: "ai-qvalue", how: "Q-values rate each action in each state" },
      { id: "aix-structured-perceptron", how: "learns control costs from demonstrations" }
    ]
  },
  {
    id: "game-ai",
    name: "Game AI",
    icon: "🎮",
    blurb: "How engines master chess, Go and video games — from classic search to self-play deep RL like AlphaGo.",
    lessons: [
      { id: "ai-minimax", how: "looks ahead to pick the best move" },
      { id: "ai-alpha-beta", how: "prunes the search tree to go deeper" },
      { id: "ai-expectimax", how: "handles chance nodes in dice games" },
      { id: "mod-dqn", how: "Deep Q-Networks master Atari from pixels" },
      { id: "ai-q-learning", how: "learns winning moves by self-play" },
      { id: "aix-monte-carlo", how: "Monte Carlo rollouts estimate move value" },
      { id: "aix-game-theory", how: "Nash equilibrium in competitive play" },
      { id: "mod-actor-critic", how: "modern self-play policy training" },
      { id: "ai-tree-search", how: "explores move sequences systematically" }
    ]
  },
  {
    id: "ab-testing",
    name: "A/B Testing & Experimentation",
    icon: "🧪",
    blurb: "How product teams run controlled experiments to decide if a change actually improves a metric.",
    lessons: [
      { id: "prob-estimation", how: "estimates the true effect from sample data" },
      { id: "prob-clt", how: "justifies normal-based confidence intervals" },
      { id: "prob-normal", how: "models the sampling distribution of the mean" },
      { id: "prob-bernoulli-binomial", how: "conversion is a binomial count" },
      { id: "prob-variance", how: "variance sets the needed sample size" },
      { id: "prob-lln", how: "averages converge as the test runs longer" },
      { id: "cls-bandits", how: "adaptive tests shift traffic to the winner" },
      { id: "prob-expectation", how: "compares expected metric across variants" },
      { id: "prob-covariance-correlation", how: "controls for correlated covariates" }
    ]
  },
  {
    id: "forecasting-timeseries",
    name: "Forecasting & Time Series",
    icon: "📅",
    blurb: "How companies predict demand, sales, weather and energy load to plan ahead.",
    lessons: [
      { id: "mod-timeseries", how: "ARIMA models trend and seasonality" },
      { id: "dl-rnn", how: "sequence models forecast future values" },
      { id: "dl-lstm-gru", how: "remembers long-range seasonal patterns" },
      { id: "ml-linear-regression", how: "regression on lagged and calendar features" },
      { id: "cls-gradient-boosting", how: "boosted trees on engineered time features" },
      { id: "cls-gaussian-process", how: "smooth probabilistic forecasts with uncertainty" },
      { id: "prob-expectation", how: "the forecast is a conditional expectation" },
      { id: "ml-regression-metrics", how: "RMSE measures forecast accuracy" },
      { id: "mod-transformer", how: "attention-based long-horizon forecasting" }
    ]
  },
  {
    id: "marketing-churn",
    name: "Marketing & Customer Analytics",
    icon: "🎯",
    blurb: "How businesses segment customers, predict churn and target the right people with the right offer.",
    lessons: [
      { id: "ml-kmeans", how: "segments customers into behavior clusters" },
      { id: "ml-logistic-regression", how: "predicts which customers will churn" },
      { id: "cls-gradient-boosting", how: "boosted trees rank churn and conversion risk" },
      { id: "mlx-clustering-metrics", how: "silhouette score picks the segment count" },
      { id: "cls-dbscan", how: "finds dense customer groups of any shape" },
      { id: "ml-classification-metrics", how: "measures campaign targeting accuracy" },
      { id: "cls-bandits", how: "tests offers and exploits the best one" },
      { id: "ml-pca", how: "reduces many customer attributes to factors" },
      { id: "cls-tsne", how: "visualizes customer segments in 2D" }
    ]
  },
  {
    id: "drug-discovery",
    name: "Bioinformatics & Drug Discovery",
    icon: "🧬",
    blurb: "How AI predicts protein structures, finds drug candidates and analyzes genomic data.",
    lessons: [
      { id: "mod-gnn", how: "graph nets model molecules as atom graphs" },
      { id: "ai-hmm", how: "models gene and protein sequence structure" },
      { id: "ml-pca", how: "reduces high-dimensional gene expression data" },
      { id: "cls-tsne", how: "visualizes single-cell clusters" },
      { id: "ml-kmeans", how: "clusters genes or compounds by similarity" },
      { id: "mod-transformer", how: "protein language models predict structure" },
      { id: "cls-gaussian-process", how: "guides which experiments to run next" },
      { id: "ml-svm", how: "classifies compounds as active or inactive" },
      { id: "ml-hierarchical", how: "builds phylogenetic and gene trees" },
      { id: "ml-em", how: "fits mixture models to genomic subpopulations" }
    ]
  },
  {
    id: "self-driving",
    name: "Self-Driving & Autonomous Navigation",
    icon: "🚗",
    blurb: "How autonomous vehicles perceive the road, predict other agents and plan a safe route.",
    lessons: [
      { id: "dl-object-detection", how: "detects cars, pedestrians and signs" },
      { id: "dl-conv", how: "CNNs perceive the road from camera frames" },
      { id: "ai-astar", how: "plans the route to the destination" },
      { id: "aix-relaxation", how: "admissible heuristics speed up route search" },
      { id: "ai-hmm", how: "tracks vehicle state from noisy sensors" },
      { id: "aix-gibbs-particle", how: "particle filters localize the car on the map" },
      { id: "ai-mdp", how: "frames driving decisions as sequential choices" },
      { id: "mod-actor-critic", how: "learns driving policies in simulation" },
      { id: "dl-pooling", how: "summarizes perception feature maps" }
    ]
  },
  {
    id: "language-understanding",
    name: "Text Mining & NLP Analytics",
    icon: "📰",
    blurb: "How companies mine sentiment, topics and meaning from reviews, tickets and documents at scale.",
    lessons: [
      { id: "dl-word2vec", how: "learns word vectors from large text corpora" },
      { id: "dl-word-embeddings", how: "represents text as dense vectors" },
      { id: "aix-lda-topic", how: "discovers latent topics in document sets" },
      { id: "ml-naive-bayes", how: "classic sentiment and topic classifier" },
      { id: "dl-cosine-similarity", how: "measures document and word similarity" },
      { id: "mod-transformer", how: "contextual embeddings for understanding" },
      { id: "mod-llm", how: "summarizes and answers questions over text" },
      { id: "ml-logistic-regression", how: "baseline sentiment classifier" },
      { id: "cls-tsne", how: "visualizes document and word clusters" }
    ]
  },
  {
    id: "ml-optimization-engine",
    name: "Training Engines & Optimization",
    icon: "⚙️",
    blurb: "The shared optimization machinery under nearly every model — how learning actually happens by minimizing loss.",
    lessons: [
      { id: "ml-gradient-descent", how: "the core algorithm that minimizes loss" },
      { id: "fnd-gradient", how: "the slope direction that descent follows" },
      { id: "fnd-chain", how: "chains derivatives through composed layers" },
      { id: "ai-sgd", how: "stochastic updates scale to huge datasets" },
      { id: "dl-minibatch", how: "mini-batches trade noise for speed" },
      { id: "dl-optimizers", how: "Adam and momentum accelerate convergence" },
      { id: "mlx-newton", how: "second-order steps using curvature" },
      { id: "la-hessian", how: "curvature matrix shapes the loss landscape" },
      { id: "ml-cost", how: "the objective surface being minimized" },
      { id: "dl-vanishing-gradient", how: "why deep gradient signals can break" },
      { id: "ml-loss", how: "per-example loss aggregated into the cost" },
      { id: "fnd-derivative", how: "the slope that tells weights which way to move" },
      { id: "ai-loss-minimization", how: "learning framed as minimizing empirical loss" },
      { id: "dl-init", how: "Xavier init keeps early gradients well-scaled" },
      { id: "dl-early-stopping", how: "halts training before it overfits" },
      { id: "ai-sgd", how: "stochastic gradient descent on one batch at a time" },
      { id: "dl-neuron", how: "the weighted-sum unit gradients flow through" }
    ]
  },
  {
    id: "model-evaluation",
    name: "Model Evaluation & Tuning",
    icon: "📐",
    blurb: "How practitioners validate, compare and tune models before shipping them — the discipline that keeps predictions honest.",
    lessons: [
      { id: "ml-bias-variance", how: "diagnoses underfitting vs overfitting" },
      { id: "mlx-cross-validation", how: "k-fold gives a robust accuracy estimate" },
      { id: "ml-regularization", how: "penalties trade fit for generalization" },
      { id: "mlx-model-selection", how: "AIC/BIC pick the best model complexity" },
      { id: "mlx-error-analysis", how: "ablations find where the model fails" },
      { id: "ml-classification-metrics", how: "precision, recall and F1 score quality" },
      { id: "ml-roc-auc", how: "threshold-free comparison of classifiers" },
      { id: "ml-regression-metrics", how: "R-squared and RMSE for regressors" },
      { id: "ml-learning-theory", how: "bounds how much data generalization needs" },
      { id: "mlx-clustering-metrics", how: "silhouette validates unsupervised models" }
    ]
  },
  {
    id: "expert-systems-reasoning",
    name: "Expert Systems & Reasoning",
    icon: "🧩",
    blurb: "How knowledge-based AI schedules, plans and reasons over rules and constraints — from logistics to puzzle solving.",
    lessons: [
      { id: "ai-csp", how: "encodes scheduling and assignment as constraints" },
      { id: "ai-csp-search", how: "backtracking solves the constraint problem" },
      { id: "ai-propositional-logic", how: "represents facts as logical statements" },
      { id: "ai-inference-rules", how: "resolution derives new conclusions" },
      { id: "aix-fol", how: "first-order logic adds objects and relations" },
      { id: "ai-search-problem", how: "frames planning as a state-space search" },
      { id: "ai-graph-search", how: "uniform-cost search finds optimal plans" },
      { id: "ai-tree-search", how: "BFS and DFS explore the plan space" }
    ]
  },
  {
    id: "probabilistic-diagnosis",
    name: "Probabilistic Reasoning & Inference",
    icon: "🔮",
    blurb: "How systems reason under uncertainty — diagnosing causes, filtering sensor noise and inferring hidden state from evidence.",
    lessons: [
      { id: "ai-bayes-net", how: "models causes and effects as a graph" },
      { id: "ai-bayes-inference", how: "computes probabilities of hidden causes" },
      { id: "aix-variable-elimination", how: "exact inference by summing out variables" },
      { id: "aix-markov-blanket", how: "identifies what a variable depends on" },
      { id: "prob-bayes", how: "updates beliefs from new evidence" },
      { id: "prob-conditional", how: "conditional probabilities link the variables" },
      { id: "prob-total-prob", how: "marginalizes over hidden possibilities" },
      { id: "aix-gibbs-particle", how: "sampling approximates hard inference" },
      { id: "prob-independence", how: "factorizes the joint for tractable inference" },
      { id: "prob-joint-marginal", how: "the joint distribution the network represents" }
    ]
  },
  {
    id: "scientific-modeling",
    name: "Scientific & Engineering Modeling",
    icon: "🔬",
    blurb: "How scientists and engineers fit physical models to noisy data and quantify uncertainty in measurements and signals.",
    lessons: [
      { id: "ml-linear-regression", how: "fits a model to experimental data" },
      { id: "cls-bayesian-regression", how: "gives uncertainty bands on the fit" },
      { id: "cls-gaussian-process", how: "interpolates with calibrated uncertainty" },
      { id: "mlx-lwr", how: "locally weighted fits for nonlinear trends" },
      { id: "ml-ica", how: "separates mixed signals into sources" },
      { id: "probx-derived", how: "derives the distribution of a transformed quantity" },
      { id: "probx-convolution", how: "distribution of summed measurement noise" },
      { id: "probx-total-variance", how: "decomposes uncertainty into components" },
      { id: "cls-svr", how: "robust regression that tolerates outliers" },
      { id: "prob-uniform-exponential", how: "models waiting times and arrivals" }
    ]
  },
  {
    id: "linear-algebra-engines",
    name: "Numerical & Linear Algebra Engines",
    icon: "🧮",
    blurb: "The matrix machinery beneath every ML library — the operations that make training and inference fast and stable.",
    lessons: [
      { id: "fnd-matrix", how: "data and weights are stored as matrices" },
      { id: "fnd-matvec", how: "a layer is a matrix times a vector" },
      { id: "fnd-vector", how: "every feature set is a vector" },
      { id: "la-transpose", how: "reorients matrices for the right products" },
      { id: "la-inverse", how: "solves linear systems in closed form" },
      { id: "la-determinant", how: "tests invertibility and scales volumes" },
      { id: "la-rank-independence", how: "detects redundant, collinear features" },
      { id: "la-psd", how: "covariance and kernel matrices are PSD" },
      { id: "la-spectral", how: "diagonalizes symmetric matrices" },
      { id: "la-trace", how: "sums eigenvalues for many ML quantities" },
      { id: "la-identity-diagonal", how: "identity and scaling building blocks" },
      { id: "fnd-eigen", how: "eigenvectors reveal principal directions" }
    ]
  },
  {
    id: "operations-queues",
    name: "Operations Research & Queueing",
    icon: "📦",
    blurb: "How logistics, call centers and networks model random arrivals, counts and waiting to plan capacity.",
    lessons: [
      { id: "prob-geometric-poisson", how: "Poisson counts arrivals per interval" },
      { id: "prob-uniform-exponential", how: "exponential models time between arrivals" },
      { id: "prob-expectation", how: "expected wait and throughput drive planning" },
      { id: "prob-conditional-expectation", how: "expected outcome given current load" },
      { id: "prob-random-variable", how: "demand and queue length as random variables" },
      { id: "prob-pdf-cdf", how: "service-time distributions for capacity" },
      { id: "prob-counting", how: "counts arrangements for assignment problems" },
      { id: "prob-sample-space", how: "enumerates the possible system states" },
      { id: "prob-axioms", how: "the rules that make the probabilities consistent" }
    ]
  }
];
