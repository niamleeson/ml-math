/* Commonness rating per lesson: how often the concept is actually used in real
   ML/DL/AI practice, on a 0–10 scale. 10 = ubiquitous, 0 = rare/theoretical.
   Shown as a green saturation badge in the sidebar. Merged by lesson id. */
window.USAGE = {
  // Foundations
  "fnd-vector": 10, "fnd-dot": 10, "fnd-matrix": 10, "fnd-matvec": 10, "fnd-norm": 9,
  "fnd-derivative": 9, "fnd-gradient": 10, "fnd-chain": 9, "fnd-eigen": 6,
  // Linear Algebra (deep dive)
  "la-matmul": 10, "la-transpose": 9, "la-identity-diagonal": 7, "la-inverse": 6,
  "la-determinant": 4, "la-cofactor": 4, "la-trace": 4, "la-rank-independence": 5, "la-psd": 5,
  "la-spectral": 4, "la-svd": 7, "la-jacobian": 7, "la-hessian": 4,
  // Probability & Statistics
  "prob-sample-space": 5, "prob-axioms": 5, "prob-conditional": 9, "prob-bayes": 9,
  "prob-total-prob": 5, "prob-independence": 6, "prob-counting": 3, "prob-random-variable": 6,
  "prob-expectation": 9, "prob-variance": 9, "prob-bernoulli-binomial": 6,
  "prob-geometric-poisson": 4, "prob-pdf-cdf": 6, "prob-uniform-exponential": 4,
  "prob-normal": 10, "prob-joint-marginal": 6, "prob-covariance-correlation": 7,
  "prob-conditional-expectation": 5, "prob-inequalities": 3, "prob-lln": 4,
  "prob-clt": 6, "prob-estimation": 7,
  // Probability (advanced)
  "probx-derived": 3, "probx-convolution": 3, "probx-total-variance": 3, "probx-mgf": 2,
  // Machine Learning (CS229)
  "ml-supervised": 10, "ml-loss": 10, "ml-cost": 9, "ml-gradient-descent": 10,
  "ml-linear-regression": 10, "ml-likelihood": 7, "ml-logistic-regression": 10, "ml-softmax": 10,
  "ml-glm": 5, "ml-svm": 6, "ml-kernels": 5, "ml-gda": 3, "ml-naive-bayes": 6,
  "ml-trees": 7, "ml-ensembles": 9, "ml-knn": 6, "ml-bias-variance": 9, "ml-learning-theory": 3,
  "ml-kmeans": 8, "ml-em": 5, "ml-hierarchical": 5, "ml-pca": 9, "ml-ica": 3,
  "ml-classification-metrics": 10, "ml-roc-auc": 9, "ml-regression-metrics": 9, "ml-regularization": 10,
  // Machine Learning — more
  "mlx-newton": 3, "mlx-lwr": 3, "mlx-cross-validation": 9, "mlx-model-selection": 6,
  "mlx-clustering-metrics": 5, "mlx-error-analysis": 6,
  // Classical ML (beyond the cheat sheet)
  "cls-gmm": 5, "cls-dbscan": 6, "cls-spectral-clustering": 4, "cls-lda-qda": 5,
  "cls-gaussian-process": 4, "cls-bayesian-regression": 4, "cls-gradient-boosting": 9,
  "cls-stacking": 5, "cls-anomaly": 6, "cls-recommender": 7, "cls-tsne": 7,
  "cls-factor-analysis": 3, "cls-svr": 3, "cls-bandits": 5,
  // Deep Learning (CS230)
  "dl-neuron": 10, "dl-activations": 9, "dl-forward-prop": 9, "dl-cross-entropy": 10,
  "dl-backprop": 10, "dl-optimizers": 9, "dl-minibatch": 9, "dl-init": 7, "dl-dropout": 7,
  "dl-batchnorm": 8, "dl-early-stopping": 7, "dl-conv": 9, "dl-pooling": 7,
  "dl-conv-hyperparams": 6, "dl-cnn-params": 4, "dl-object-detection": 6,
  "dl-face-recognition": 4, "dl-style-transfer": 2, "dl-gan": 5, "dl-rnn": 5,
  "dl-vanishing-gradient": 6, "dl-lstm-gru": 5, "dl-word-embeddings": 8, "dl-word2vec": 5,
  "dl-cosine-similarity": 9, "dl-attention": 10, "dl-data-augmentation": 7,
  // Modern Deep Learning & AI
  "mod-transformer": 10, "mod-multihead": 9, "mod-llm": 10, "mod-autoencoder": 6,
  "mod-vae": 5, "mod-diffusion": 7, "mod-normalizing-flows": 3, "mod-gnn": 5,
  "mod-dqn": 5, "mod-policy-gradient": 6, "mod-actor-critic": 6, "mod-contrastive": 7,
  "mod-vit": 7, "mod-timeseries": 6,
  // Artificial Intelligence (CS221)
  "ai-linear-predictors": 6, "ai-loss-minimization": 7, "ai-sgd": 10, "ai-search-problem": 5,
  "ai-tree-search": 5, "ai-graph-search": 5, "ai-astar": 6, "ai-mdp": 6, "ai-policy-value": 5,
  "ai-qvalue": 5, "ai-value-iteration": 5, "ai-q-learning": 6, "ai-minimax": 4,
  "ai-alpha-beta": 3, "ai-expectimax": 3, "ai-csp": 4, "ai-csp-search": 3, "ai-bayes-net": 4,
  "ai-bayes-inference": 4, "ai-hmm": 5, "ai-propositional-logic": 3, "ai-inference-rules": 2,
  // Artificial Intelligence — more
  "aix-relaxation": 3, "aix-structured-perceptron": 2, "aix-monte-carlo": 5, "aix-sarsa-td": 4,
  "aix-game-theory": 4, "aix-variable-elimination": 2, "aix-gibbs-particle": 3,
  "aix-markov-blanket": 2, "aix-forward-backward": 3, "aix-lda-topic": 4, "aix-fol": 2
};
