# Core Lesson Plans

One Markdown planning file per lesson in the original 107-lesson cheatsheet curriculum.

These plans are renderer-agnostic and reference the structure rules in `../../LESSON-PAGE-STRUCTURES.md`. Each lesson plan chooses a page type, outlines the lesson page, and specifies a Google Colab companion plan with 10 basic, 5 easy, and 5 advanced runnable examples using different datasets or synthetic data-generating processes.

## Summary

| Module | Lesson count |
|---|---:|
| Foundations: Math you need first | 9 |
| Probability & Statistics | 22 |
| Machine Learning | 27 |
| Deep Learning | 27 |
| Artificial Intelligence | 22 |
| **Total** | **107** |

## Foundations: Math you need first

| # | Lesson | Page structure | Notebook |
|---:|---|---|---|
| 001 | [Vectors](001-fnd-vector-vectors.md) | Linear algebra page | Required |
| 002 | [The dot product (inner product)](002-fnd-dot-the-dot-product-inner-product.md) | Linear algebra page | Required |
| 003 | [Matrices](003-fnd-matrix-matrices.md) | Linear algebra page | Required |
| 004 | [Matrix x vector](004-fnd-matvec-matrix-x-vector.md) | Linear algebra page | Required |
| 005 | [Norms (the length of a vector)](005-fnd-norm-norms-the-length-of-a-vector.md) | Linear algebra page | Required |
| 006 | [Derivatives (slope)](006-fnd-derivative-derivatives-slope.md) | Formula / theorem page | Required |
| 007 | [The gradient (slope in many directions)](007-fnd-gradient-the-gradient-slope-in-many-directions.md) | Formula / theorem page | Required |
| 008 | [The chain rule](008-fnd-chain-the-chain-rule.md) | Formula / theorem page | Required |
| 009 | [Eigenvalues & eigenvectors](009-fnd-eigen-eigenvalues-eigenvectors.md) | Linear algebra page | Required |

## Probability & Statistics

| # | Lesson | Page structure | Notebook |
|---:|---|---|---|
| 010 | [Sample space & events](010-prob-sample-space-sample-space-events.md) | Concept / definition page | Recommended |
| 011 | [Probability axioms](011-prob-axioms-probability-axioms.md) | Concept / definition page | Recommended |
| 012 | [Conditional probability](012-prob-conditional-conditional-probability.md) | Formula / theorem page | Required |
| 013 | [Bayes' rule](013-prob-bayes-bayes-rule.md) | Formula / theorem page | Required |
| 014 | [Total probability theorem](014-prob-total-prob-total-probability-theorem.md) | Formula / theorem page | Required |
| 015 | [Independence](015-prob-independence-independence.md) | Formula / theorem page | Required |
| 016 | [Counting: permutations & combinations](016-prob-counting-counting-permutations-combinations.md) | Worked problem page | Required |
| 017 | [Random variable & PMF](017-prob-random-variable-random-variable-pmf.md) | Concept / definition page | Required |
| 018 | [Expectation (the mean)](018-prob-expectation-expectation-the-mean.md) | Formula / theorem page | Required |
| 019 | [Variance & standard deviation](019-prob-variance-variance-standard-deviation.md) | Formula / theorem page | Required |
| 020 | [Bernoulli & Binomial](020-prob-bernoulli-binomial-bernoulli-binomial.md) | Distribution page | Required |
| 021 | [Geometric & Poisson](021-prob-geometric-poisson-geometric-poisson.md) | Distribution page | Required |
| 022 | [Continuous variables: PDF & CDF](022-prob-pdf-cdf-continuous-variables-pdf-cdf.md) | Concept / definition page | Required |
| 023 | [Uniform & Exponential](023-prob-uniform-exponential-uniform-exponential.md) | Distribution page | Required |
| 024 | [Normal (Gaussian) distribution](024-prob-normal-normal-gaussian-distribution.md) | Distribution page | Required |
| 025 | [Joint & marginal distributions](025-prob-joint-marginal-joint-marginal-distributions.md) | Concept / definition page | Required |
| 026 | [Covariance & correlation](026-prob-covariance-correlation-covariance-correlation.md) | Formula / theorem page | Required |
| 027 | [Conditional expectation](027-prob-conditional-expectation-conditional-expectation.md) | Formula / theorem page | Required |
| 028 | [Markov & Chebyshev inequalities](028-prob-inequalities-markov-chebyshev-inequalities.md) | Formula / theorem page | Required |
| 029 | [Law of Large Numbers](029-prob-lln-law-of-large-numbers.md) | Formula / theorem page | Required |
| 030 | [Central Limit Theorem](030-prob-clt-central-limit-theorem.md) | Formula / theorem page | Required |
| 031 | [Parameter estimation](031-prob-estimation-parameter-estimation.md) | Statistics / estimation page | Required |

## Machine Learning

| # | Lesson | Page structure | Notebook |
|---:|---|---|---|
| 032 | [Supervised learning setup](032-ml-supervised-supervised-learning-setup.md) | Concept / definition page | Recommended |
| 033 | [Loss function](033-ml-loss-loss-function.md) | Formula / theorem page | Required |
| 034 | [Cost function](034-ml-cost-cost-function.md) | Formula / theorem page | Required |
| 035 | [Gradient descent](035-ml-gradient-descent-gradient-descent.md) | Algorithm page | Required |
| 036 | [Linear regression](036-ml-linear-regression-linear-regression.md) | Model page | Required |
| 037 | [Likelihood & maximum likelihood](037-ml-likelihood-likelihood-maximum-likelihood.md) | Derivation / proof page | Required |
| 038 | [Logistic regression](038-ml-logistic-regression-logistic-regression.md) | Model page | Required |
| 039 | [Softmax (multiclass)](039-ml-softmax-softmax-multiclass.md) | Formula / theorem page | Required |
| 040 | [Generalized linear models](040-ml-glm-generalized-linear-models.md) | Model page | Required |
| 041 | [Support vector machines](041-ml-svm-support-vector-machines.md) | Model page | Required |
| 042 | [The kernel trick](042-ml-kernels-the-kernel-trick.md) | Concept / definition page | Required |
| 043 | [Gaussian discriminant analysis](043-ml-gda-gaussian-discriminant-analysis.md) | Model page | Required |
| 044 | [Naive Bayes](044-ml-naive-bayes-naive-bayes.md) | Model page | Required |
| 045 | [Decision trees (CART (Classification And Regression Trees))](045-ml-trees-decision-trees-cart-classification-and-regression-trees.md) | Model page | Required |
| 046 | [Random forests & boosting](046-ml-ensembles-random-forests-boosting.md) | Model page | Required |
| 047 | [k-nearest neighbors](047-ml-knn-k-nearest-neighbors.md) | Model page | Required |
| 048 | [Bias-variance tradeoff](048-ml-bias-variance-bias-variance-tradeoff.md) | Formula / theorem page | Required |
| 049 | [Learning theory (gentle)](049-ml-learning-theory-learning-theory-gentle.md) | Concept / definition page | Recommended |
| 050 | [k-means clustering](050-ml-kmeans-k-means-clustering.md) | Algorithm page | Required |
| 051 | [Expectation-Maximization (gentle)](051-ml-em-expectation-maximization-gentle.md) | Algorithm page | Required |
| 052 | [Hierarchical clustering](052-ml-hierarchical-hierarchical-clustering.md) | Algorithm page | Required |
| 053 | [Principal component analysis (PCA)](053-ml-pca-principal-component-analysis-pca.md) | Model page | Required |
| 054 | [Independent component analysis (ICA)](054-ml-ica-independent-component-analysis-ica.md) | Model page | Required |
| 055 | [Confusion matrix & classification metrics](055-ml-classification-metrics-confusion-matrix-classification-metrics.md) | Interpretation page | Required |
| 056 | [ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve)](056-ml-roc-auc-roc-receiver-operating-characteristic-curve-auc-area-under-the-curve.md) | Interpretation page | Required |
| 057 | [Regression metrics (R^2 and RMSE (Root Mean Squared Error))](057-ml-regression-metrics-regression-metrics-r-2-and-rmse-root-mean-squared-error.md) | Interpretation page | Required |
| 058 | [Regularization & cross-validation](058-ml-regularization-regularization-cross-validation.md) | Concept / definition page | Required |

## Deep Learning

| # | Lesson | Page structure | Notebook |
|---:|---|---|---|
| 059 | [The neuron & network layers](059-dl-neuron-the-neuron-network-layers.md) | Model page | Required |
| 060 | [Activation functions](060-dl-activations-activation-functions.md) | Deep learning component page | Required |
| 061 | [Forward propagation](061-dl-forward-prop-forward-propagation.md) | Deep learning component page | Required |
| 062 | [Cross-entropy loss](062-dl-cross-entropy-cross-entropy-loss.md) | Formula / theorem page | Required |
| 063 | [Backpropagation](063-dl-backprop-backpropagation.md) | Derivation / proof page | Required |
| 064 | [Optimizers: Momentum, RMSprop, Adam](064-dl-optimizers-optimizers-momentum-rmsprop-adam.md) | Algorithm page | Required |
| 065 | [Mini-batch gradient descent & epochs](065-dl-minibatch-mini-batch-gradient-descent-epochs.md) | Algorithm page | Required |
| 066 | [Weight initialization (Xavier)](066-dl-init-weight-initialization-xavier.md) | Concept / definition page | Required |
| 067 | [Dropout](067-dl-dropout-dropout.md) | Deep learning component page | Required |
| 068 | [Batch normalization](068-dl-batchnorm-batch-normalization.md) | Deep learning component page | Required |
| 069 | [Early stopping](069-dl-early-stopping-early-stopping.md) | Deep learning component page | Required |
| 070 | [Convolutional layer](070-dl-conv-convolutional-layer.md) | Deep learning component page | Required |
| 071 | [Pooling (max / average)](071-dl-pooling-pooling-max-average.md) | Deep learning component page | Required |
| 072 | [Filter hyperparameters & output size](072-dl-conv-hyperparams-filter-hyperparameters-output-size.md) | Deep learning component page | Required |
| 073 | [Counting CNN (Convolutional Neural Network) parameters](073-dl-cnn-params-counting-cnn-convolutional-neural-network-parameters.md) | Deep learning component page | Required |
| 074 | [Object detection (IoU (Intersection over Union), YOLO (You Only Look Once))](074-dl-object-detection-object-detection-iou-intersection-over-union-yolo-you-only-look-once.md) | Model page | Required |
| 075 | [Face verification & triplet loss](075-dl-face-recognition-face-verification-triplet-loss.md) | Model page | Required |
| 076 | [Neural style transfer](076-dl-style-transfer-neural-style-transfer.md) | Deep learning component page | Required |
| 077 | [GANs (Generative Adversarial Networks) (generator vs discriminator)](077-dl-gan-gans-generative-adversarial-networks-generator-vs-discriminator.md) | Model page | Required |
| 078 | [Recurrent neural networks (RNNs)](078-dl-rnn-recurrent-neural-networks-rnns.md) | Model page | Required |
| 079 | [Vanishing & exploding gradients](079-dl-vanishing-gradient-vanishing-exploding-gradients.md) | Deep learning component page | Required |
| 080 | [LSTM (Long Short-Term Memory) & GRU (Gated Recurrent Unit) (gates)](080-dl-lstm-gru-lstm-long-short-term-memory-gru-gated-recurrent-unit-gates.md) | Model page | Required |
| 081 | [Word embeddings](081-dl-word-embeddings-word-embeddings.md) | Model page | Required |
| 082 | [word2vec & GloVe](082-dl-word2vec-word2vec-glove.md) | Model page | Required |
| 083 | [Cosine similarity](083-dl-cosine-similarity-cosine-similarity.md) | Worked problem page | Required |
| 084 | [Attention](084-dl-attention-attention.md) | Model page | Required |
| 085 | [Data augmentation](085-dl-data-augmentation-data-augmentation.md) | Deep learning component page | Required |

## Artificial Intelligence

| # | Lesson | Page structure | Notebook |
|---:|---|---|---|
| 086 | [Linear predictors (reflex models)](086-ai-linear-predictors-linear-predictors-reflex-models.md) | Model page | Required |
| 087 | [Loss minimization](087-ai-loss-minimization-loss-minimization.md) | Algorithm page | Required |
| 088 | [Stochastic gradient descent (SGD)](088-ai-sgd-stochastic-gradient-descent-sgd.md) | Algorithm page | Required |
| 089 | [Search problems](089-ai-search-problem-search-problems.md) | Concept / definition page | Required |
| 090 | [Tree search: BFS (Breadth-First Search), DFS (Depth-First Search), iterative deepening](090-ai-tree-search-tree-search-bfs-breadth-first-search-dfs-depth-first-search-iterative-.md) | Algorithm page | Required |
| 091 | [Graph search: dynamic programming and UCS (Uniform Cost Search)](091-ai-graph-search-graph-search-dynamic-programming-and-ucs-uniform-cost-search.md) | Algorithm page | Required |
| 092 | [A* search](092-ai-astar-a-search.md) | Algorithm page | Required |
| 093 | [Markov Decision Processes (MDPs)](093-ai-mdp-markov-decision-processes-mdps.md) | Interpretation page | Required |
| 094 | [Policies and values](094-ai-policy-value-policies-and-values.md) | Formula / theorem page | Required |
| 095 | [Q-values](095-ai-qvalue-q-values.md) | Formula / theorem page | Required |
| 096 | [Value iteration](096-ai-value-iteration-value-iteration.md) | Algorithm page | Required |
| 097 | [Q-learning (model-free)](097-ai-q-learning-q-learning-model-free.md) | Algorithm page | Required |
| 098 | [Minimax (game playing)](098-ai-minimax-minimax-game-playing.md) | Algorithm page | Required |
| 099 | [Alpha-beta pruning](099-ai-alpha-beta-alpha-beta-pruning.md) | Algorithm page | Required |
| 100 | [Expectimax](100-ai-expectimax-expectimax.md) | Algorithm page | Required |
| 101 | [Constraint satisfaction problems (CSPs)](101-ai-csp-constraint-satisfaction-problems-csps.md) | Concept / definition page | Required |
| 102 | [Solving CSPs (Constraint Satisfaction Problems): backtracking and consistency](102-ai-csp-search-solving-csps-constraint-satisfaction-problems-backtracking-and-consist.md) | Algorithm page | Required |
| 103 | [Bayesian networks](103-ai-bayes-net-bayesian-networks.md) | Model page | Required |
| 104 | [Inference in Bayes nets](104-ai-bayes-inference-inference-in-bayes-nets.md) | Formula / theorem page | Required |
| 105 | [Hidden Markov Models (HMMs)](105-ai-hmm-hidden-markov-models-hmms.md) | Model page | Required |
| 106 | [Propositional logic](106-ai-propositional-logic-propositional-logic.md) | AI decision-process page | Recommended |
| 107 | [Inference and resolution](107-ai-inference-rules-inference-and-resolution.md) | AI decision-process page | Required |

