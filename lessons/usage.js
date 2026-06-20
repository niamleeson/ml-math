/* Commonness rating per lesson: how often the concept is actually used in real
   ML/DL/AI practice. 5 = ubiquitous, 4 = very common, 3 = common, 2 = occasional/
   specialized, 1 = rare/niche. Shown as a badge in the sidebar. Merged by lesson id. */
window.USAGE = {
  // Foundations
  "fnd-vector": 5, "fnd-dot": 5, "fnd-matrix": 5, "fnd-matvec": 5, "fnd-norm": 5,
  "fnd-derivative": 5, "fnd-gradient": 5, "fnd-chain": 5, "fnd-eigen": 4,
  // Linear Algebra (deep dive)
  "la-matmul": 5, "la-transpose": 5, "la-identity-diagonal": 4, "la-inverse": 4,
  "la-determinant": 3, "la-trace": 3, "la-rank-independence": 3, "la-psd": 3,
  "la-spectral": 3, "la-svd": 4, "la-hessian": 3,
  // Probability & Statistics
  "prob-sample-space": 4, "prob-axioms": 4, "prob-conditional": 5, "prob-bayes": 5,
  "prob-total-prob": 4, "prob-independence": 4, "prob-counting": 3, "prob-random-variable": 4,
  "prob-expectation": 5, "prob-variance": 5, "prob-bernoulli-binomial": 4,
  "prob-geometric-poisson": 3, "prob-pdf-cdf": 4, "prob-uniform-exponential": 3,
  "prob-normal": 5, "prob-joint-marginal": 4, "prob-covariance-correlation": 4,
  "prob-conditional-expectation": 3, "prob-inequalities": 3, "prob-lln": 3,
  "prob-clt": 4, "prob-estimation": 4,
  // Probability (advanced)
  "probx-derived": 2, "probx-convolution": 2, "probx-total-variance": 2, "probx-mgf": 2,
  // Machine Learning (CS229)
  "ml-supervised": 5, "ml-loss": 5, "ml-cost": 5, "ml-gradient-descent": 5,
  "ml-linear-regression": 5, "ml-likelihood": 4, "ml-logistic-regression": 5, "ml-softmax": 5,
  "ml-glm": 3, "ml-svm": 4, "ml-kernels": 3, "ml-gda": 2, "ml-naive-bayes": 4,
  "ml-trees": 4, "ml-ensembles": 5, "ml-knn": 4, "ml-bias-variance": 5, "ml-learning-theory": 2,
  "ml-kmeans": 5, "ml-em": 3, "ml-hierarchical": 3, "ml-pca": 5, "ml-ica": 2,
  "ml-classification-metrics": 5, "ml-roc-auc": 5, "ml-regression-metrics": 5, "ml-regularization": 5,
  // Machine Learning — more
  "mlx-newton": 2, "mlx-lwr": 2, "mlx-cross-validation": 5, "mlx-model-selection": 3,
  "mlx-clustering-metrics": 3, "mlx-error-analysis": 3,
  // Classical ML (beyond the cheat sheet)
  "cls-gmm": 3, "cls-dbscan": 3, "cls-spectral-clustering": 2, "cls-lda-qda": 3,
  "cls-gaussian-process": 2, "cls-bayesian-regression": 2, "cls-gradient-boosting": 5,
  "cls-stacking": 3, "cls-anomaly": 3, "cls-recommender": 4, "cls-tsne": 4,
  "cls-factor-analysis": 2, "cls-svr": 2, "cls-bandits": 3,
  // Deep Learning (CS230)
  "dl-neuron": 5, "dl-activations": 5, "dl-forward-prop": 5, "dl-cross-entropy": 5,
  "dl-backprop": 5, "dl-optimizers": 5, "dl-minibatch": 5, "dl-init": 4, "dl-dropout": 4,
  "dl-batchnorm": 4, "dl-early-stopping": 4, "dl-conv": 5, "dl-pooling": 4,
  "dl-conv-hyperparams": 4, "dl-cnn-params": 3, "dl-object-detection": 3,
  "dl-face-recognition": 2, "dl-style-transfer": 2, "dl-gan": 3, "dl-rnn": 3,
  "dl-vanishing-gradient": 4, "dl-lstm-gru": 3, "dl-word-embeddings": 4, "dl-word2vec": 3,
  "dl-cosine-similarity": 5, "dl-attention": 5, "dl-data-augmentation": 4,
  // Modern Deep Learning & AI
  "mod-transformer": 5, "mod-multihead": 5, "mod-llm": 5, "mod-autoencoder": 3,
  "mod-vae": 3, "mod-diffusion": 4, "mod-normalizing-flows": 2, "mod-gnn": 3,
  "mod-dqn": 3, "mod-policy-gradient": 3, "mod-actor-critic": 3, "mod-contrastive": 4,
  "mod-vit": 4, "mod-timeseries": 4,
  // Artificial Intelligence (CS221)
  "ai-linear-predictors": 4, "ai-loss-minimization": 4, "ai-sgd": 5, "ai-search-problem": 3,
  "ai-tree-search": 3, "ai-graph-search": 3, "ai-astar": 4, "ai-mdp": 3, "ai-policy-value": 3,
  "ai-qvalue": 3, "ai-value-iteration": 3, "ai-q-learning": 4, "ai-minimax": 3,
  "ai-alpha-beta": 2, "ai-expectimax": 2, "ai-csp": 2, "ai-csp-search": 2, "ai-bayes-net": 3,
  "ai-bayes-inference": 3, "ai-hmm": 3, "ai-propositional-logic": 2, "ai-inference-rules": 2,
  // Artificial Intelligence — more
  "aix-relaxation": 2, "aix-structured-perceptron": 2, "aix-monte-carlo": 3, "aix-sarsa-td": 3,
  "aix-game-theory": 3, "aix-variable-elimination": 2, "aix-gibbs-particle": 2,
  "aix-markov-blanket": 2, "aix-forward-backward": 2, "aix-lda-topic": 3, "aix-fol": 2
};
