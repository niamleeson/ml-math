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

/* All ML curriculum (464 lessons) — commonness rating 0–10, keyed by numeric lesson id
   (part.topic). Same scale as above; merged into window.USAGE so the sidebar shows the
   green saturation badge next to each All ML lesson. Nav-only (lesson pages don't read USAGE). */
Object.assign(window.USAGE, {
  // Part 1: Statistical Learning Theory
  "1.1": 5, "1.2": 5, "1.3": 3, "1.4": 3, "1.5": 2, "1.6": 3, "1.7": 3, "1.8": 6, "1.9": 2, "1.10": 3, "1.11": 3,
  // Part 2: Optimization
  "2.1": 6, "2.2": 5, "2.3": 10, "2.4": 4, "2.5": 6, "2.6": 4, "2.7": 4, "2.8": 4, "2.9": 6, "2.10": 4, "2.11": 6, "2.12": 4, "2.13": 4, "2.14": 6, "2.15": 4, "2.16": 3,
  // Part 3: Core Machine Learning
  "3.1": 8, "3.2": 6, "3.3": 9, "3.4": 5, "3.5": 10, "3.6": 9, "3.7": 6, "3.8": 9, "3.9": 9, "3.10": 6, "3.11": 4, "3.12": 4, "3.13": 5, "3.14": 10, "3.15": 9, "3.16": 5, "3.17": 5, "3.18": 3, "3.19": 10, "3.20": 7, "3.21": 6, "3.22": 8, "3.23": 9, "3.24": 5, "3.25": 6, "3.26": 8, "3.27": 9, "3.28": 6, "3.29": 7, "3.30": 6, "3.31": 5, "3.32": 3, "3.33": 4, "3.34": 5, "3.35": 5, "3.36": 10, "3.37": 5, "3.38": 10, "3.39": 9, "3.40": 6, "3.41": 5, "3.42": 9, "3.43": 8, "3.44": 9, "3.45": 9, "3.46": 7, "3.47": 8, "3.48": 7,
  // Part 4: Unsupervised Learning
  "4.1": 9, "4.2": 4, "4.3": 3, "4.4": 6, "4.5": 7, "4.6": 3, "4.7": 3, "4.8": 6, "4.9": 4, "4.10": 3, "4.11": 6, "4.12": 9, "4.13": 6, "4.14": 4, "4.15": 4, "4.16": 4, "4.17": 4, "4.18": 4, "4.19": 7, "4.20": 7, "4.21": 4, "4.22": 6, "4.23": 3, "4.24": 7, "4.25": 5, "4.26": 4,
  // Part 5: Probabilistic & Graphical Models
  "5.1": 6, "5.2": 5, "5.3": 5, "5.4": 4, "5.5": 4, "5.6": 4, "5.7": 3, "5.8": 3, "5.9": 6, "5.10": 5, "5.11": 6, "5.12": 5, "5.13": 3, "5.14": 6, "5.15": 6, "5.16": 6, "5.17": 4, "5.18": 3, "5.19": 5, "5.20": 6, "5.21": 5, "5.22": 3, "5.23": 5, "5.24": 5,
  // Part 6: Deep Learning Foundations
  "6.1": 9, "6.2": 5, "6.3": 10, "6.4": 10, "6.5": 9, "6.6": 10, "6.7": 10, "6.8": 10, "6.9": 5, "6.10": 3, "6.11": 9, "6.12": 9, "6.13": 9, "6.14": 6, "6.15": 9, "6.16": 8, "6.17": 9, "6.18": 8, "6.19": 8, "6.20": 9, "6.21": 4, "6.22": 7, "6.23": 4, "6.24": 9, "6.25": 9, "6.26": 6, "6.27": 3, "6.28": 3, "6.29": 2, "6.30": 2, "6.31": 4, "6.32": 3, "6.33": 4, "6.34": 8,
  // Part 7: Computer Vision
  "7.1": 8, "7.2": 5, "7.3": 10, "7.4": 9, "7.5": 6, "7.6": 7, "7.7": 6, "7.8": 6, "7.9": 6, "7.10": 9, "7.11": 6, "7.12": 5, "7.13": 7, "7.14": 6, "7.15": 8, "7.16": 6, "7.17": 5, "7.18": 8, "7.19": 6, "7.20": 7, "7.21": 5, "7.22": 6, "7.23": 5, "7.24": 5, "7.25": 5, "7.26": 6, "7.27": 7, "7.28": 6, "7.29": 5, "7.30": 5, "7.31": 4,
  // Part 8: Sequence Models & NLP
  "8.1": 9, "8.2": 6, "8.3": 9, "8.4": 8, "8.5": 5, "8.6": 8, "8.7": 6, "8.8": 7, "8.9": 6, "8.10": 7, "8.11": 10, "8.12": 10, "8.13": 8, "8.14": 7, "8.15": 9, "8.16": 8, "8.17": 7, "8.18": 5, "8.19": 4, "8.20": 4, "8.21": 4, "8.22": 7, "8.23": 7, "8.24": 7, "8.25": 9, "8.26": 7, "8.27": 6, "8.28": 5,
  // Part 9: Large Language Models
  "9.1": 8, "9.2": 9, "9.3": 7, "9.4": 7, "9.5": 6, "9.6": 6, "9.7": 7, "9.8": 7, "9.9": 5, "9.10": 6, "9.11": 9, "9.12": 8, "9.13": 6, "9.14": 7, "9.15": 7, "9.16": 4, "9.17": 9, "9.18": 10, "9.19": 7, "9.20": 8, "9.21": 8, "9.22": 9, "9.23": 8, "9.24": 8, "9.25": 7,
  // Part 10: Generative Models
  "10.1": 8, "10.2": 7, "10.3": 6, "10.4": 2, "10.5": 7, "10.6": 6, "10.7": 5, "10.8": 6, "10.9": 5, "10.10": 4, "10.11": 5, "10.12": 8, "10.13": 7, "10.14": 8, "10.15": 6, "10.16": 5, "10.17": 4, "10.18": 4, "10.19": 5,
  // Part 11: Reinforcement Learning
  "11.1": 6, "11.2": 6, "11.3": 6, "11.4": 5, "11.5": 5, "11.6": 6, "11.7": 4, "11.8": 5, "11.9": 7, "11.10": 6, "11.11": 7, "11.12": 5, "11.13": 4, "11.14": 6, "11.15": 6, "11.16": 5, "11.17": 8, "11.18": 6, "11.19": 6, "11.20": 5, "11.21": 6, "11.22": 7, "11.23": 4, "11.24": 4, "11.25": 5, "11.26": 4, "11.27": 5, "11.28": 5, "11.29": 5, "11.30": 4, "11.31": 4, "11.32": 4, "11.33": 4, "11.34": 4, "11.35": 5,
  // Part 12: Graph & Geometric Learning
  "12.1": 6, "12.2": 4, "12.3": 6, "12.4": 7, "12.5": 6, "12.6": 6, "12.7": 4, "12.8": 4, "12.9": 4, "12.10": 6, "12.11": 5, "12.12": 4, "12.13": 3, "12.14": 5, "12.15": 4,
  // Part 13: Speech & Audio
  "13.1": 7, "13.2": 7, "13.3": 6, "13.4": 6, "13.5": 6, "13.6": 5, "13.7": 4, "13.8": 4,
  // Part 14: Time Series & Forecasting
  "14.1": 7, "14.2": 6, "14.3": 7, "14.4": 6, "14.5": 5, "14.6": 6, "14.7": 6, "14.8": 6, "14.9": 5, "14.10": 6,
  // Part 15: Recommender Systems & Ranking
  "15.1": 8, "15.2": 8, "15.3": 7, "15.4": 7, "15.5": 7, "15.6": 7, "15.7": 7, "15.8": 6, "15.9": 6, "15.10": 5, "15.11": 6,
  // Part 16: Information Retrieval & Search
  "16.1": 6, "16.2": 8, "16.3": 7, "16.4": 8, "16.5": 8, "16.6": 7, "16.7": 7, "16.8": 6,
  // Part 17: Learning Paradigms
  "17.1": 9, "17.2": 6, "17.3": 6, "17.4": 8, "17.5": 7, "17.6": 6, "17.7": 5, "17.8": 7, "17.9": 5, "17.10": 6, "17.11": 5, "17.12": 6, "17.13": 8,
  // Part 18: Data-Centric AI
  "18.1": 9, "18.2": 7, "18.3": 9, "18.4": 7, "18.5": 5, "18.6": 6, "18.7": 8, "18.8": 8, "18.9": 6, "18.10": 4,
  // Part 19: Trustworthy, Responsible & Robust AI
  "19.1": 8, "19.2": 6, "19.3": 5, "19.4": 3, "19.5": 3, "19.6": 6, "19.7": 6, "19.8": 6, "19.9": 5, "19.10": 4, "19.11": 3, "19.12": 4, "19.13": 6, "19.14": 3, "19.15": 4, "19.16": 7, "19.17": 5, "19.18": 6, "19.19": 5, "19.20": 6, "19.21": 4, "19.22": 6,
  // Part 20: ML Systems, MLOps & Production
  "20.1": 8, "20.2": 7, "20.3": 8, "20.4": 7, "20.5": 7, "20.6": 7, "20.7": 8, "20.8": 7, "20.9": 8, "20.10": 6, "20.11": 7, "20.12": 7, "20.13": 7, "20.14": 6, "20.15": 7, "20.16": 6, "20.17": 7, "20.18": 6, "20.19": 7, "20.20": 6,
  // Part 21: Classical / Symbolic AI
  "21.1": 5, "21.2": 5, "21.3": 4, "21.4": 4, "21.5": 4, "21.6": 4, "21.7": 3, "21.8": 5, "21.9": 4, "21.10": 4, "21.11": 3, "21.12": 3, "21.13": 5,
  // Part 22: Search & Planning
  "22.1": 6, "22.2": 4, "22.3": 6, "22.4": 5, "22.5": 6, "22.6": 5, "22.7": 5, "22.8": 4, "22.9": 3, "22.10": 4,
  // Part 23: Game Theory & Multi-Agent Systems
  "23.1": 5, "23.2": 4, "23.3": 3, "23.4": 4, "23.5": 3, "23.6": 4, "23.7": 4, "23.8": 4,
  // Part 24: Evolutionary Computation & Swarm Intelligence
  "24.1": 5, "24.2": 4, "24.3": 5, "24.4": 4, "24.5": 5, "24.6": 4, "24.7": 3, "24.8": 3, "24.9": 3,
  // Part 25: Neurosymbolic AI & Program Synthesis
  "25.1": 4, "25.2": 3, "25.3": 5, "25.4": 5, "25.5": 3,
  // Part 27: Frontiers
  "27.1": 3, "27.2": 2, "27.3": 6, "27.4": 5, "27.5": 4
});

/* Mathematics for ML curriculum (689 lessons) — commonness rating 0–10, keyed by
   lesson id (math-TT-NN). Same 0–10 scale as above (how often the concept is used in
   real ML/DL/AI practice). Merged into window.USAGE so the sidebar shows the green
   saturation badge next to each math lesson. Nav-only (lesson pages don't read USAGE). */
Object.assign(window.USAGE, {
  // Topic 01 — Single-variable calculus
  "math-01-01": 6, "math-01-02": 4, "math-01-03": 7, "math-01-04": 8, "math-01-05": 4, "math-01-06": 2, "math-01-07": 5, "math-01-08": 3,
  "math-01-09": 5, "math-01-10": 2, "math-01-11": 4, "math-01-12": 2, "math-01-13": 9, "math-01-14": 5, "math-01-15": 8, "math-01-16": 8,
  "math-01-17": 8, "math-01-18": 6, "math-01-19": 10, "math-01-20": 8, "math-01-21": 8, "math-01-22": 4, "math-01-23": 4, "math-01-24": 4,
  "math-01-25": 2, "math-01-26": 7, "math-01-27": 4, "math-01-28": 3, "math-01-29": 3, "math-01-30": 7, "math-01-31": 5, "math-01-32": 6,
  "math-01-33": 6, "math-01-34": 3, "math-01-35": 3, "math-01-36": 2, "math-01-37": 7, "math-01-38": 5, "math-01-39": 5, "math-01-40": 7,
  "math-01-41": 6, "math-01-42": 5, "math-01-43": 5, "math-01-44": 2, "math-01-45": 2, "math-01-46": 2, "math-01-47": 4, "math-01-48": 2,
  "math-01-49": 1, "math-01-50": 2, "math-01-51": 3, "math-01-52": 2, "math-01-53": 4, "math-01-54": 4, "math-01-55": 4, "math-01-56": 3,
  "math-01-57": 4, "math-01-58": 7, "math-01-59": 4, "math-01-60": 6, "math-01-61": 5, "math-01-62": 10,
  // Topic 02 — Multivariable / vector calculus
  "math-02-01": 9, "math-02-02": 10, "math-02-03": 3, "math-02-04": 3, "math-02-05": 4, "math-02-06": 4, "math-02-07": 2, "math-02-08": 7,
  "math-02-09": 5, "math-02-10": 3, "math-02-11": 3, "math-02-12": 9, "math-02-13": 10, "math-02-14": 6, "math-02-15": 4, "math-02-16": 6,
  "math-02-17": 9, "math-02-18": 9, "math-02-19": 6, "math-02-20": 7, "math-02-21": 6, "math-02-22": 8, "math-02-23": 7, "math-02-24": 6,
  "math-02-25": 7, "math-02-26": 4, "math-02-27": 2, "math-02-28": 6, "math-02-29": 6, "math-02-30": 1, "math-02-31": 2, "math-02-32": 4,
  "math-02-33": 3, "math-02-34": 2, "math-02-35": 2, "math-02-36": 1, "math-02-37": 1, "math-02-38": 2, "math-02-39": 1, "math-02-40": 1,
  "math-02-41": 9,
  // Topic 03 — Differential equations (ODEs)
  "math-03-01": 4, "math-03-02": 3, "math-03-03": 4, "math-03-04": 3, "math-03-05": 4, "math-03-06": 4, "math-03-07": 3, "math-03-08": 2,
  "math-03-09": 2, "math-03-10": 2, "math-03-11": 4, "math-03-12": 3, "math-03-13": 3, "math-03-14": 3, "math-03-15": 2, "math-03-16": 2,
  "math-03-17": 2, "math-03-18": 2, "math-03-19": 4, "math-03-20": 5, "math-03-21": 4, "math-03-22": 3, "math-03-23": 4, "math-03-24": 4,
  "math-03-25": 1, "math-03-26": 2, "math-03-27": 3, "math-03-28": 2, "math-03-29": 2, "math-03-30": 6, "math-03-31": 5, "math-03-32": 2,
  "math-03-33": 2, "math-03-34": 4, "math-03-35": 6,
  // Topic 04 — Real analysis
  "math-04-01": 4, "math-04-02": 2, "math-04-03": 3, "math-04-04": 3, "math-04-05": 3, "math-04-06": 3, "math-04-07": 4, "math-04-08": 2,
  "math-04-09": 2, "math-04-10": 3, "math-04-11": 3, "math-04-12": 3, "math-04-13": 2, "math-04-14": 3, "math-04-15": 3, "math-04-16": 3,
  "math-04-17": 2, "math-04-18": 3, "math-04-19": 3, "math-04-20": 5, "math-04-21": 3, "math-04-22": 4, "math-04-23": 3, "math-04-24": 2,
  "math-04-25": 3, "math-04-26": 3, "math-04-27": 3, "math-04-28": 4, "math-04-29": 3, "math-04-30": 3, "math-04-31": 4, "math-04-32": 6,
  // Topic 05 — Functional analysis
  "math-05-01": 6, "math-05-02": 5, "math-05-03": 7, "math-05-04": 3, "math-05-05": 7, "math-05-06": 5, "math-05-07": 5, "math-05-08": 6,
  "math-05-09": 5, "math-05-10": 3, "math-05-11": 3, "math-05-12": 4, "math-05-13": 3, "math-05-14": 2, "math-05-15": 2, "math-05-16": 2,
  "math-05-17": 3, "math-05-18": 5, "math-05-19": 5, "math-05-20": 3, "math-05-21": 5,
  // Topic 06 — Harmonic / Fourier analysis
  "math-06-01": 4, "math-06-02": 4, "math-06-03": 5, "math-06-04": 3, "math-06-05": 4, "math-06-06": 6, "math-06-07": 5, "math-06-08": 6,
  "math-06-09": 4, "math-06-10": 3, "math-06-11": 3, "math-06-12": 5, "math-06-13": 6, "math-06-14": 6, "math-06-15": 2, "math-06-16": 4,
  "math-06-17": 5, "math-06-18": 5, "math-06-19": 8,
  // Topic 07 — Measure theory
  "math-07-01": 3, "math-07-02": 3, "math-07-03": 2, "math-07-04": 3, "math-07-05": 2, "math-07-06": 3, "math-07-07": 2, "math-07-08": 3,
  "math-07-09": 2, "math-07-10": 2, "math-07-11": 3, "math-07-12": 3, "math-07-13": 2, "math-07-14": 3, "math-07-15": 3, "math-07-16": 3,
  "math-07-17": 3, "math-07-18": 4, "math-07-19": 4, "math-07-20": 3,
  // Topic 08 — Numerical analysis
  "math-08-01": 7, "math-08-02": 6, "math-08-03": 6, "math-08-04": 5, "math-08-05": 6, "math-08-06": 6, "math-08-07": 6, "math-08-08": 3,
  "math-08-09": 6, "math-08-10": 3, "math-08-11": 4, "math-08-12": 5, "math-08-13": 6, "math-08-14": 3, "math-08-15": 6, "math-08-16": 3,
  "math-08-17": 3, "math-08-18": 3, "math-08-19": 8, "math-08-20": 5, "math-08-21": 5, "math-08-22": 6, "math-08-23": 8,
  // Topic 09 — Linear algebra
  "math-09-01": 10, "math-09-02": 7, "math-09-03": 5, "math-09-04": 9, "math-09-05": 10, "math-09-06": 6, "math-09-07": 3, "math-09-08": 5,
  "math-09-09": 7, "math-09-10": 6, "math-09-11": 7, "math-09-12": 7, "math-09-13": 6, "math-09-14": 9, "math-09-15": 8, "math-09-16": 6,
  "math-09-17": 5, "math-09-18": 8, "math-09-19": 5, "math-09-20": 7, "math-09-21": 5, "math-09-22": 2, "math-09-23": 8, "math-09-24": 8,
  "math-09-25": 7, "math-09-26": 5, "math-09-27": 6, "math-09-28": 6, "math-09-29": 7, "math-09-30": 6, "math-09-31": 9, "math-09-32": 8,
  "math-09-33": 6, "math-09-34": 9, "math-09-35": 7, "math-09-36": 6, "math-09-37": 8, "math-09-38": 4, "math-09-39": 8,
  // Topic 10 — Representation theory
  "math-10-01": 4, "math-10-02": 3, "math-10-03": 3, "math-10-04": 2, "math-10-05": 3, "math-10-06": 2, "math-10-07": 2, "math-10-08": 2,
  "math-10-09": 2, "math-10-10": 2, "math-10-11": 2, "math-10-12": 2, "math-10-13": 5, "math-10-14": 5, "math-10-15": 4,
  // Topic 11 — Analytic geometry
  "math-11-01": 6, "math-11-02": 3, "math-11-03": 6, "math-11-04": 4, "math-11-05": 9, "math-11-06": 10, "math-11-07": 3, "math-11-08": 3,
  "math-11-09": 4, "math-11-10": 3, "math-11-11": 2, "math-11-12": 6, "math-11-13": 2, "math-11-14": 7, "math-11-15": 3, "math-11-16": 6,
  "math-11-17": 3, "math-11-18": 7,
  // Topic 12 — Differential geometry
  "math-12-01": 3, "math-12-02": 2, "math-12-03": 3, "math-12-04": 1, "math-12-05": 2, "math-12-06": 3, "math-12-07": 4, "math-12-08": 2,
  "math-12-09": 2, "math-12-10": 2, "math-12-11": 2, "math-12-12": 4, "math-12-13": 4, "math-12-14": 3, "math-12-15": 4, "math-12-16": 3,
  "math-12-17": 3, "math-12-18": 2, "math-12-19": 4, "math-12-20": 4,
  // Topic 13 — Topology
  "math-13-01": 3, "math-13-02": 3, "math-13-03": 3, "math-13-04": 2, "math-13-05": 2, "math-13-06": 3, "math-13-07": 2, "math-13-08": 2,
  "math-13-09": 3, "math-13-10": 4, "math-13-11": 2, "math-13-12": 2, "math-13-13": 2, "math-13-14": 1, "math-13-15": 2, "math-13-16": 2,
  "math-13-17": 3, "math-13-18": 4,
  // Topic 14 — Discrete math / combinatorics
  "math-14-01": 4, "math-14-02": 3, "math-14-03": 6, "math-14-04": 4, "math-14-05": 6, "math-14-06": 4, "math-14-07": 3, "math-14-08": 4,
  "math-14-09": 4, "math-14-10": 5, "math-14-11": 6, "math-14-12": 5, "math-14-13": 3, "math-14-14": 4, "math-14-15": 3, "math-14-16": 4,
  "math-14-17": 3, "math-14-18": 2, "math-14-19": 6, "math-14-20": 3, "math-14-21": 4, "math-14-22": 4, "math-14-23": 8,
  // Topic 15 — Graph theory
  "math-15-01": 7, "math-15-02": 4, "math-15-03": 5, "math-15-04": 4, "math-15-05": 5, "math-15-06": 6, "math-15-07": 4, "math-15-08": 6,
  "math-15-09": 6, "math-15-10": 6, "math-15-11": 4, "math-15-12": 4, "math-15-13": 4, "math-15-14": 4, "math-15-15": 4, "math-15-16": 4,
  "math-15-17": 3, "math-15-18": 2, "math-15-19": 2, "math-15-20": 2, "math-15-21": 2, "math-15-22": 7, "math-15-23": 6, "math-15-24": 5,
  "math-15-25": 4, "math-15-26": 6, "math-15-27": 7,
  // Topic 16 — Mathematical logic & set theory
  "math-16-01": 4, "math-16-02": 3, "math-16-03": 3, "math-16-04": 4, "math-16-05": 5, "math-16-06": 2, "math-16-07": 2, "math-16-08": 2,
  "math-16-09": 5, "math-16-10": 2, "math-16-11": 4, "math-16-12": 3, "math-16-13": 2, "math-16-14": 1, "math-16-15": 1, "math-16-16": 4,
  "math-16-17": 3, "math-16-18": 2, "math-16-19": 4,
  // Topic 17 — Probability theory
  "math-17-01": 6, "math-17-02": 5, "math-17-03": 6, "math-17-04": 4, "math-17-05": 9, "math-17-06": 7, "math-17-07": 6, "math-17-08": 9,
  "math-17-09": 7, "math-17-10": 7, "math-17-11": 8, "math-17-12": 6, "math-17-13": 9, "math-17-14": 9, "math-17-15": 5, "math-17-16": 3,
  "math-17-17": 7, "math-17-18": 6, "math-17-19": 4, "math-17-20": 3, "math-17-21": 6, "math-17-22": 4, "math-17-23": 10, "math-17-24": 5,
  "math-17-25": 7, "math-17-26": 7, "math-17-27": 8, "math-17-28": 7, "math-17-29": 7, "math-17-30": 7, "math-17-31": 6, "math-17-32": 5,
  "math-17-33": 7, "math-17-34": 4, "math-17-35": 4, "math-17-36": 6, "math-17-37": 6, "math-17-38": 7, "math-17-39": 5, "math-17-40": 9,
  // Topic 18 — Mathematical statistics / inference
  "math-18-01": 6, "math-18-02": 6, "math-18-03": 6, "math-18-04": 6, "math-18-05": 6, "math-18-06": 7, "math-18-07": 7, "math-18-08": 8,
  "math-18-09": 5, "math-18-10": 4, "math-18-11": 3, "math-18-12": 9, "math-18-13": 4, "math-18-14": 5, "math-18-15": 8, "math-18-16": 3,
  "math-18-17": 5, "math-18-18": 3, "math-18-19": 6, "math-18-20": 7, "math-18-21": 6, "math-18-22": 5, "math-18-23": 6, "math-18-24": 4,
  "math-18-25": 4, "math-18-26": 4, "math-18-27": 6, "math-18-28": 9, "math-18-29": 9, "math-18-30": 6,
  // Topic 19 — Stochastic processes
  "math-19-01": 5, "math-19-02": 7, "math-19-03": 6, "math-19-04": 3, "math-19-05": 3, "math-19-06": 6, "math-19-07": 4, "math-19-08": 5,
  "math-19-09": 3, "math-19-10": 4, "math-19-11": 2, "math-19-12": 5, "math-19-13": 5, "math-19-14": 6, "math-19-15": 3, "math-19-16": 4,
  "math-19-17": 8, "math-19-18": 7, "math-19-19": 8, "math-19-20": 6, "math-19-21": 4, "math-19-22": 4, "math-19-23": 5, "math-19-24": 7,
  // Topic 20 — Bayesian statistics
  "math-20-01": 6, "math-20-02": 7, "math-20-03": 8, "math-20-04": 8, "math-20-05": 5, "math-20-06": 4, "math-20-07": 4, "math-20-08": 3,
  "math-20-09": 5, "math-20-10": 5, "math-20-11": 5, "math-20-12": 4, "math-20-13": 4, "math-20-14": 4, "math-20-15": 6, "math-20-16": 6,
  "math-20-17": 6, "math-20-18": 5, "math-20-19": 5,
  // Topic 21 — Information theory
  "math-21-01": 6, "math-21-02": 8, "math-21-03": 5, "math-21-04": 5, "math-21-05": 7, "math-21-06": 9, "math-21-07": 10, "math-21-08": 4,
  "math-21-09": 3, "math-21-10": 4, "math-21-11": 4, "math-21-12": 3, "math-21-13": 3, "math-21-14": 3, "math-21-15": 2, "math-21-16": 3,
  "math-21-17": 5, "math-21-18": 4, "math-21-19": 7, "math-21-20": 9,
  // Topic 22 — Optimization
  "math-22-01": 7, "math-22-02": 6, "math-22-03": 7, "math-22-04": 7, "math-22-05": 10, "math-22-06": 5, "math-22-07": 4, "math-22-08": 9,
  "math-22-09": 6, "math-22-10": 5, "math-22-11": 4, "math-22-12": 4, "math-22-13": 10, "math-22-14": 3, "math-22-15": 6, "math-22-16": 7,
  "math-22-17": 10, "math-22-18": 4, "math-22-19": 5, "math-22-20": 5, "math-22-21": 5, "math-22-22": 5, "math-22-23": 4, "math-22-24": 4,
  "math-22-25": 4, "math-22-26": 8,
  // Topic 23 — Operations research
  "math-23-01": 4, "math-23-02": 4, "math-23-03": 3, "math-23-04": 4, "math-23-05": 3, "math-23-06": 4, "math-23-07": 3, "math-23-08": 3,
  "math-23-09": 4, "math-23-10": 3, "math-23-11": 7, "math-23-12": 3, "math-23-13": 2, "math-23-14": 3, "math-23-15": 5, "math-23-16": 4,
  "math-23-17": 5,
  // Topic 24 — Game theory
  "math-24-01": 5, "math-24-02": 4, "math-24-03": 4, "math-24-04": 3, "math-24-05": 3, "math-24-06": 5, "math-24-07": 4, "math-24-08": 5,
  "math-24-09": 3, "math-24-10": 5, "math-24-11": 5, "math-24-12": 3, "math-24-13": 3, "math-24-14": 2, "math-24-15": 3, "math-24-16": 3,
  "math-24-17": 2, "math-24-18": 3, "math-24-19": 3, "math-24-20": 6,
  // Topic 25 — Dynamical systems & chaos
  "math-25-01": 4, "math-25-02": 3, "math-25-03": 5, "math-25-04": 5, "math-25-05": 2, "math-25-06": 2, "math-25-07": 3, "math-25-08": 3,
  "math-25-09": 3, "math-25-10": 4, "math-25-11": 2, "math-25-12": 1, "math-25-13": 4, "math-25-14": 3, "math-25-15": 3, "math-25-16": 2,
  "math-25-17": 3, "math-25-18": 2, "math-25-19": 2, "math-25-20": 5,
  // Topic 26 — Control theory
  "math-26-01": 4, "math-26-02": 3, "math-26-03": 3, "math-26-04": 2, "math-26-05": 3, "math-26-06": 3, "math-26-07": 4, "math-26-08": 3,
  "math-26-09": 3, "math-26-10": 2, "math-26-11": 2, "math-26-12": 3, "math-26-13": 2, "math-26-14": 4, "math-26-15": 4, "math-26-16": 3,
  "math-26-17": 3, "math-26-18": 3, "math-26-19": 5, "math-26-20": 6, "math-26-21": 5, "math-26-22": 5,
  // Topic 27 — Numerical methods / scientific computing
  "math-27-01": 5, "math-27-02": 9, "math-27-03": 6, "math-27-04": 5, "math-27-05": 5, "math-27-06": 3, "math-27-07": 4, "math-27-08": 5,
  "math-27-09": 4, "math-27-10": 3, "math-27-11": 6, "math-27-12": 6, "math-27-13": 9, "math-27-14": 4, "math-27-15": 3, "math-27-16": 7,
  "math-27-17": 4, "math-27-18": 8, "math-27-19": 8,
});
