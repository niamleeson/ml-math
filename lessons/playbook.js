/* Interactive decision-tree playbook: practical guidance for building a model.
   Each tree is a recursive structure of decision nodes (a question + options) and
   leaf nodes (advice + recommended approaches that link to lessons). */
window.PLAYBOOK = [
  {
    id: "choose-model",
    icon: "🧭",
    title: "Which model should I use?",
    intro: "Pick a model by first nailing down what you are predicting, then matching it to your data. Start with the simplest thing that could work.",
    root: {
      q: "What are you trying to produce? (the output / task)",
      options: [
        {
          label: "Predict a category (classification)",
          node: {
            q: "What does your input data look like?",
            options: [
              {
                label: "Small tabular (rows & columns, few examples)",
                node: {
                  advice: "Start simple and lean on regularization. With little data, simple linear or distance-based models beat heavy ones and are easy to debug.",
                  recommend: [
                    { name: "Logistic regression", why: "Strong, interpretable baseline for tabular classification.", lessons: ["ml-logistic-regression", "ml-softmax"] },
                    { name: "Naive Bayes / GDA", why: "Works well when data is scarce and features are roughly independent or Gaussian.", lessons: ["ml-naive-bayes", "ml-gda"] },
                    { name: "k-nearest neighbors", why: "No training needed; a decent baseline on small clean datasets.", lessons: ["ml-knn"] }
                  ],
                  tips: ["Add L1/L2 regularization and validate with cross-validation.", "Always compare against a trivial majority-class baseline."]
                }
              },
              {
                label: "Large tabular (many rows & features)",
                node: {
                  advice: "Gradient-boosted trees are the go-to for tabular data at scale — they capture nonlinearities and feature interactions automatically.",
                  recommend: [
                    { name: "Gradient boosting (XGBoost / LightGBM)", why: "State of the art on most tabular problems; handles mixed feature types.", lessons: ["cls-gradient-boosting", "ml-ensembles"] },
                    { name: "Random forest", why: "Robust, low-tuning ensemble; a fast strong baseline.", lessons: ["ml-ensembles", "ml-trees"] },
                    { name: "Logistic regression", why: "Keep as a linear baseline and for interpretability.", lessons: ["ml-logistic-regression"] }
                  ],
                  tips: ["Tune with cross-validation; watch for class imbalance."]
                }
              },
              {
                label: "Images",
                node: {
                  advice: "Use a convolutional network, and prefer a pretrained backbone fine-tuned on your data unless you have a very large labeled set.",
                  recommend: [
                    { name: "CNN (convolutional network)", why: "Convolution + pooling exploit spatial structure in pixels.", lessons: ["dl-conv", "dl-pooling", "dl-conv-hyperparams"] },
                    { name: "Vision Transformer (ViT)", why: "Competitive with CNNs when you have lots of data or a pretrained model.", lessons: ["mod-vit", "mod-transformer"] },
                    { name: "Transfer learning + augmentation", why: "Fine-tune a pretrained backbone and augment to stretch limited labels.", lessons: ["dl-data-augmentation", "mod-contrastive"] }
                  ]
                }
              },
              {
                label: "Text / language",
                node: {
                  advice: "Fine-tune a pretrained transformer (or use its embeddings) — this beats training from scratch in almost every text setting.",
                  recommend: [
                    { name: "Transformer / pretrained LLM", why: "Self-attention captures long-range context; pretrained models transfer well.", lessons: ["mod-transformer", "mod-llm", "mod-multihead"] },
                    { name: "Embeddings + simple classifier", why: "Turn text into vectors, then run logistic regression — cheap and strong.", lessons: ["dl-word-embeddings", "dl-word2vec", "ml-logistic-regression"] },
                    { name: "Naive Bayes (bag of words)", why: "Surprisingly strong, fast baseline for short-text classification.", lessons: ["ml-naive-bayes"] }
                  ]
                }
              },
              {
                label: "Graph / network data",
                node: {
                  advice: "Use a graph neural network so the model can pass information along edges; otherwise engineer node features and use a tabular model.",
                  recommend: [
                    { name: "Graph neural network (GNN)", why: "Message passing learns from each node's neighborhood structure.", lessons: ["mod-gnn"] },
                    { name: "Feature engineering + gradient boosting", why: "Hand-build node/edge features, then classify with boosted trees.", lessons: ["cls-gradient-boosting", "ml-ensembles"] }
                  ]
                }
              }
            ]
          }
        },
        {
          label: "Predict a number (regression)",
          node: {
            q: "What does your input data look like?",
            options: [
              {
                label: "Small / simple tabular",
                node: {
                  advice: "Start with linear regression plus regularization; reach for nonlinear local methods only if a clear curve appears.",
                  recommend: [
                    { name: "Linear regression (Ridge / Lasso)", why: "Interpretable baseline; regularization controls variance on small data.", lessons: ["ml-linear-regression", "ml-regularization"] },
                    { name: "Locally weighted regression", why: "Captures smooth nonlinearities without a global model.", lessons: ["mlx-lwr"] },
                    { name: "Gaussian process regression", why: "Great for small data and gives calibrated uncertainty.", lessons: ["cls-gaussian-process", "cls-bayesian-regression"] }
                  ],
                  tips: ["Judge with RMSE and R², not just one number."]
                }
              },
              {
                label: "Large tabular",
                node: {
                  advice: "Gradient-boosted trees are again the strongest default for numeric prediction on rich tabular data.",
                  recommend: [
                    { name: "Gradient boosting (XGBoost / LightGBM)", why: "Handles nonlinearity and interactions; top tabular regressor.", lessons: ["cls-gradient-boosting", "ml-ensembles"] },
                    { name: "Random forest", why: "Low-tuning, robust nonlinear baseline.", lessons: ["ml-ensembles", "ml-trees"] },
                    { name: "Support vector regression", why: "Effective with kernels when relationships are smooth but nonlinear.", lessons: ["cls-svr", "ml-kernels"] }
                  ]
                }
              },
              {
                label: "Time series (predict future values)",
                node: {
                  advice: "Decide between a classical statistical model and a neural sequence model based on data volume and seasonality.",
                  recommend: [
                    { name: "ARIMA / classical forecasting", why: "Strong on single series with trend and seasonality.", lessons: ["mod-timeseries"] },
                    { name: "RNN / LSTM", why: "Learns nonlinear temporal patterns when you have lots of history.", lessons: ["dl-rnn", "dl-lstm-gru"] },
                    { name: "Transformer", why: "Attention captures long-range dependencies across many series.", lessons: ["mod-transformer", "dl-attention"] }
                  ]
                }
              }
            ]
          }
        },
        {
          label: "Group items without labels (clustering)",
          node: {
            q: "What shape do you expect the groups to have?",
            options: [
              {
                label: "Roughly round blobs, you know how many",
                node: {
                  advice: "k-means is fast and simple when clusters are compact and you can guess k; use a soft version if clusters overlap.",
                  recommend: [
                    { name: "k-means", why: "Fast, simple partitioning into k compact clusters.", lessons: ["ml-kmeans", "mlx-clustering-metrics"] },
                    { name: "Gaussian mixture model", why: "Soft assignments and elliptical clusters via EM.", lessons: ["cls-gmm", "ml-em"] }
                  ],
                  tips: ["Pick k with the silhouette score, not by eye alone."]
                }
              },
              {
                label: "Odd shapes / unknown count / noise",
                node: {
                  advice: "Density- or graph-based methods find arbitrary shapes and flag outliers without you specifying the cluster count.",
                  recommend: [
                    { name: "DBSCAN", why: "Finds arbitrary-shaped clusters and labels noise automatically.", lessons: ["cls-dbscan"] },
                    { name: "Hierarchical clustering", why: "Builds a tree of clusters; no fixed k, inspect at any level.", lessons: ["ml-hierarchical"] },
                    { name: "Spectral clustering", why: "Handles non-convex clusters via the graph Laplacian.", lessons: ["cls-spectral-clustering"] }
                  ]
                }
              }
            ]
          }
        },
        {
          label: "Reduce dimensions / visualize",
          node: {
            q: "Do you need a linear summary or a 2-D map for the human eye?",
            options: [
              {
                label: "Linear summary / compression / features",
                node: {
                  advice: "PCA and SVD give a fast linear projection that preserves variance; autoencoders capture nonlinear structure.",
                  recommend: [
                    { name: "PCA / SVD", why: "Linear projection keeping maximum variance; great preprocessing step.", lessons: ["ml-pca", "la-svd"] },
                    { name: "Autoencoder", why: "Learns a compact nonlinear code of the data.", lessons: ["mod-autoencoder"] }
                  ]
                }
              },
              {
                label: "2-D map for visualization",
                node: {
                  advice: "Nonlinear embedding methods are built for visualizing high-dimensional clusters in two dimensions.",
                  recommend: [
                    { name: "t-SNE / UMAP", why: "Reveals local cluster structure in a 2-D plot.", lessons: ["cls-tsne"] },
                    { name: "PCA (first pass)", why: "Run before t-SNE/UMAP to denoise and speed things up.", lessons: ["ml-pca"] }
                  ]
                }
              }
            ]
          }
        },
        {
          label: "Recommend items to users",
          node: {
            advice: "Start with collaborative filtering from the interaction matrix; add a bandit on top if you must balance exploring new items against exploiting known winners.",
            recommend: [
              { name: "Collaborative filtering / matrix factorization", why: "Learns user and item vectors from past interactions.", lessons: ["cls-recommender"] },
              { name: "Cosine similarity on embeddings", why: "Content-based fallback that works with no interaction history (cold start).", lessons: ["dl-cosine-similarity", "dl-word-embeddings"] },
              { name: "Multi-armed bandits", why: "Trade exploration vs exploitation when serving recommendations live.", lessons: ["cls-bandits"] }
            ]
          }
        },
        {
          label: "Detect anomalies / outliers",
          node: {
            advice: "If you have almost no examples of the bad class, model 'normal' and flag deviations rather than training a standard classifier.",
            recommend: [
              { name: "Isolation Forest", why: "Isolates rare points fast; no labels needed.", lessons: ["cls-anomaly"] },
              { name: "Gaussian / density model", why: "Flags low-probability points under a fitted distribution.", lessons: ["cls-gmm", "prob-normal"] },
              { name: "Autoencoder reconstruction error", why: "High reconstruction error marks points unlike the training data.", lessons: ["mod-autoencoder"] }
            ]
          }
        },
        {
          label: "Generate content (images / text)",
          node: {
            q: "What kind of content?",
            options: [
              {
                label: "Images",
                node: {
                  advice: "Diffusion models are the current state of the art for image generation; GANs and VAEs are lighter alternatives.",
                  recommend: [
                    { name: "Diffusion models", why: "Highest-quality image generation today.", lessons: ["mod-diffusion"] },
                    { name: "GAN", why: "Fast sampling; good for sharp images when training is stable.", lessons: ["dl-gan"] },
                    { name: "VAE", why: "Stable training and a smooth latent space to interpolate in.", lessons: ["mod-vae", "mod-autoencoder"] }
                  ]
                }
              },
              {
                label: "Text",
                node: {
                  advice: "Use an autoregressive transformer language model; fine-tune or prompt a pretrained one rather than training from scratch.",
                  recommend: [
                    { name: "Large language model (GPT-style)", why: "Generates fluent text; pretrained models transfer broadly.", lessons: ["mod-llm", "mod-transformer"] },
                    { name: "Multi-head attention internals", why: "Understand the mechanism powering the generator.", lessons: ["mod-multihead", "dl-attention"] }
                  ]
                }
              }
            ]
          }
        },
        {
          label: "Make sequential decisions / control (RL)",
          node: {
            q: "How big is the state/action space?",
            options: [
              {
                label: "Small and enumerable",
                node: {
                  advice: "Use tabular reinforcement learning — you can store a value for every state-action pair and learn it directly.",
                  recommend: [
                    { name: "Q-learning / value iteration", why: "Learns optimal actions in small, discrete MDPs.", lessons: ["ai-q-learning", "ai-value-iteration", "ai-mdp"] },
                    { name: "SARSA / TD learning", why: "On-policy temporal-difference control for small spaces.", lessons: ["aix-sarsa-td", "aix-monte-carlo"] }
                  ]
                }
              },
              {
                label: "Large / continuous (needs a network)",
                node: {
                  advice: "Approximate values or policies with neural networks once the state space is too big to tabulate.",
                  recommend: [
                    { name: "Deep Q-Network (DQN)", why: "Neural value function for high-dimensional discrete actions.", lessons: ["mod-dqn", "ai-qvalue"] },
                    { name: "Policy gradients / Actor-Critic (PPO)", why: "Handles continuous actions and stochastic policies.", lessons: ["mod-policy-gradient", "mod-actor-critic"] }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  },
  {
    id: "fix-model",
    icon: "🩺",
    title: "My model underperforms — what do I tweak?",
    intro: "Diagnose before you treat. Compare training error and validation error to find the symptom, then apply the matching fix.",
    root: {
      q: "Which symptom matches what you see?",
      options: [
        {
          label: "Training error itself is high (it can't even fit the data)",
          node: {
            advice: "This is underfitting / high bias: the model is too weak or under-trained. Increase capacity, add signal, or train longer before touching regularization.",
            recommend: [
              { name: "Bigger / more expressive model", why: "More parameters or a nonlinear model can capture patterns a weak one misses.", lessons: ["ml-bias-variance", "dl-neuron"] },
              { name: "Add features / better representation", why: "More signal in the inputs lets even a simple model fit.", lessons: ["mlx-error-analysis", "dl-word-embeddings"] },
              { name: "Reduce regularization, train longer", why: "Too much penalty or too few epochs starves the fit.", lessons: ["ml-regularization", "dl-minibatch"] },
              { name: "Richer activations / nonlinearity", why: "Linear-only models cap what can be learned.", lessons: ["dl-activations", "ml-kernels"] }
            ],
            tips: ["Confirm with a learning curve: high train AND validation error together means bias."]
          }
        },
        {
          label: "Big gap: train looks great, validation is much worse",
          node: {
            advice: "This is overfitting / high variance: the model memorized the training set. Add data, regularize, or simplify the model.",
            recommend: [
              { name: "More / augmented data", why: "More examples are the most reliable cure for variance.", lessons: ["dl-data-augmentation", "ml-bias-variance"] },
              { name: "Regularization (L1 / L2)", why: "Penalizes complexity so the model generalizes.", lessons: ["ml-regularization"] },
              { name: "Dropout & early stopping", why: "Standard deep-learning curbs on overfitting.", lessons: ["dl-dropout", "dl-early-stopping"] },
              { name: "Simpler model / fewer features", why: "A smaller hypothesis space can't memorize noise.", lessons: ["ml-bias-variance", "mlx-model-selection"] }
            ],
            tips: ["Use k-fold cross-validation to measure the gap reliably."]
          }
        },
        {
          label: "Training is unstable / loss won't converge or blows up",
          node: {
            advice: "This is an optimization problem, not a capacity one. Fix the learning rate, normalization, initialization, and gradient flow.",
            recommend: [
              { name: "Tune the learning rate / optimizer", why: "Too high diverges, too low stalls; Adam adapts per-parameter.", lessons: ["dl-optimizers", "ml-gradient-descent"] },
              { name: "Batch normalization", why: "Stabilizes activations and lets you train deeper, faster.", lessons: ["dl-batchnorm"] },
              { name: "Better weight initialization", why: "Xavier/He init keeps signal variance sane at start.", lessons: ["dl-init"] },
              { name: "Fix vanishing/exploding gradients", why: "Gradient clipping and gated units keep gradients usable in deep/recurrent nets.", lessons: ["dl-vanishing-gradient", "dl-lstm-gru"] }
            ],
            tips: ["Plot the loss curve: spikes/NaNs point to learning rate or exploding gradients."]
          }
        },
        {
          label: "Metrics look fine, but it's bad in the real world",
          node: {
            q: "What's the likely culprit?",
            options: [
              {
                label: "Suspicious: too good to be true",
                node: {
                  advice: "Suspect data leakage — information from the answer is sneaking into the features or the test set overlaps with training.",
                  recommend: [
                    { name: "Hunt for leakage", why: "Remove features that wouldn't exist at prediction time; isolate the test set.", lessons: ["mlx-cross-validation", "mlx-error-analysis"] },
                    { name: "Proper cross-validation", why: "Leak-free splits (e.g. time-based) give honest estimates.", lessons: ["mlx-cross-validation", "ml-supervised"] }
                  ]
                }
              },
              {
                label: "Wrong metric / imbalanced classes",
                node: {
                  advice: "Accuracy lies on imbalanced data. Pick a metric that reflects the cost of each error and inspect the confusion matrix.",
                  recommend: [
                    { name: "Confusion matrix & precision/recall", why: "Shows where errors actually fall, not just an averaged score.", lessons: ["ml-classification-metrics"] },
                    { name: "ROC / AUC", why: "Threshold-independent view of ranking quality.", lessons: ["ml-roc-auc"] },
                    { name: "Use the right regression metric", why: "RMSE vs R² emphasize different errors; match it to the goal.", lessons: ["ml-regression-metrics"] }
                  ]
                }
              },
              {
                label: "Distribution shift: real data differs from training",
                node: {
                  advice: "The deployment data drifted from your training set. Run error analysis to find where it fails, then retrain or augment on those slices.",
                  recommend: [
                    { name: "Error & ablative analysis", why: "Pinpoints which slices and components drag performance down.", lessons: ["mlx-error-analysis"] },
                    { name: "Augment / retrain on shifted data", why: "Refresh the training set to match production reality.", lessons: ["dl-data-augmentation"] }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  },
  {
    id: "get-data",
    icon: "🗃️",
    title: "How do I get & prepare the data?",
    intro: "The fastest accuracy gains usually come from data, not model tweaks. Match a strategy to your data situation.",
    root: {
      q: "What's your data situation?",
      options: [
        {
          label: "No labels at all",
          node: {
            advice: "Either create labels or pick a method that needs none. Start unsupervised, and label a small seed set if you eventually need supervision.",
            recommend: [
              { name: "Self-supervised / contrastive pretraining", why: "Learns useful representations from raw unlabeled data.", lessons: ["mod-contrastive", "mod-autoencoder"] },
              { name: "Unsupervised clustering", why: "Find structure now; clusters can seed later labeling.", lessons: ["ml-kmeans", "cls-dbscan"] },
              { name: "Anomaly detection", why: "If you only care about rare events, model 'normal' with no labels.", lessons: ["cls-anomaly"] }
            ]
          }
        },
        {
          label: "Few labels, lots of unlabeled data",
          node: {
            advice: "Exploit the unlabeled pool. Pretrain or use semi-supervised tricks, then ask humans to label only the most informative points.",
            recommend: [
              { name: "Transfer learning from a pretrained model", why: "A few labels go far when you fine-tune a model that already knows the domain.", lessons: ["mod-llm", "mod-vit", "dl-word-embeddings"] },
              { name: "Self-supervised pretraining", why: "Learn from unlabeled data first, fine-tune on the few labels.", lessons: ["mod-contrastive", "mod-autoencoder"] },
              { name: "Active learning", why: "Label only the points the model is most unsure about — max info per label.", lessons: ["mlx-error-analysis", "ml-bias-variance"] }
            ]
          }
        },
        {
          label: "Small dataset overall",
          node: {
            advice: "Stretch what you have and keep the model simple. Augmentation and pretrained features beat training a big model from scratch.",
            recommend: [
              { name: "Data augmentation", why: "Synthesizes new examples (flips, crops, noise) for free.", lessons: ["dl-data-augmentation"] },
              { name: "Transfer learning", why: "Borrow features learned on a large external dataset.", lessons: ["mod-vit", "mod-llm"] },
              { name: "Simple, regularized models", why: "Low-variance models generalize better on little data.", lessons: ["ml-regularization", "ml-logistic-regression", "cls-gaussian-process"] }
            ],
            tips: ["Validate with k-fold cross-validation so each example earns its keep.", "Cross-validation lessons: see mlx-cross-validation."]
          }
        },
        {
          label: "Imbalanced classes (one class is rare)",
          node: {
            advice: "Rebalance the data or the loss, and stop trusting raw accuracy. Resample, reweight, and evaluate with precision/recall.",
            recommend: [
              { name: "Resampling / SMOTE", why: "Over-sample the minority (SMOTE synthesizes) or under-sample the majority.", lessons: ["ml-classification-metrics"] },
              { name: "Class weighting in the loss", why: "Make minority mistakes cost more during training.", lessons: ["ml-loss", "dl-cross-entropy"] },
              { name: "Right metrics + threshold tuning", why: "Judge with PR / ROC-AUC and move the decision threshold.", lessons: ["ml-roc-auc", "ml-classification-metrics"] }
            ]
          }
        },
        {
          label: "Noisy / dirty data",
          node: {
            advice: "Clean and normalize first — garbage in, garbage out. Standardize features, handle missing values, and fix or down-weight bad labels.",
            recommend: [
              { name: "Normalize / standardize features", why: "Puts features on comparable scales so models train well.", lessons: ["dl-batchnorm", "prob-normal"] },
              { name: "Error analysis to find bad data", why: "Inspect the worst errors — many trace back to label or data issues.", lessons: ["mlx-error-analysis"] },
              { name: "Robust models / regularization", why: "Less sensitive to outliers and mislabeled points.", lessons: ["ml-regularization", "ml-ensembles"] }
            ]
          }
        },
        {
          label: "Need more variety / coverage",
          node: {
            advice: "Increase diversity through augmentation, synthetic generation, or new data sources targeted at the gaps you found.",
            recommend: [
              { name: "Data augmentation", why: "Cheap way to broaden coverage of the cases you already have.", lessons: ["dl-data-augmentation"] },
              { name: "Synthetic data (generative models)", why: "Generate rare or missing cases with GANs/VAEs/diffusion.", lessons: ["dl-gan", "mod-vae", "mod-diffusion"] },
              { name: "Add new data sources / features", why: "Fill gaps that augmentation can't invent.", lessons: ["mlx-error-analysis"] }
            ]
          }
        }
      ]
    }
  },
  {
    id: "no-good-model",
    icon: "🧪",
    title: "Nothing works — what strategies are left?",
    intro: "When accuracy plateaus and standard models fail, the fix is rarely another hyperparameter. Diagnose the deeper cause first.",
    root: {
      q: "Why do you think it's stuck?",
      options: [
        {
          label: "Not enough signal in the features",
          node: {
            advice: "The inputs may not contain what's needed. Engineer better features, encode domain knowledge, and bring in new data sources.",
            recommend: [
              { name: "Feature engineering", why: "Hand-crafted, domain-informed features can unlock learnable signal.", lessons: ["mlx-error-analysis", "ml-supervised"] },
              { name: "Learned representations / embeddings", why: "Let a network discover features you can't hand-design.", lessons: ["dl-word-embeddings", "mod-autoencoder", "mod-contrastive"] },
              { name: "Add data sources", why: "If the answer isn't in the inputs, no model can find it — get richer inputs.", lessons: ["dl-data-augmentation"] }
            ]
          }
        },
        {
          label: "The model is just too weak",
          node: {
            advice: "Scale up model power: combine models or move to bigger pretrained architectures via transfer learning.",
            recommend: [
              { name: "Ensembles (bagging / boosting)", why: "Combining many models beats any single one on most tabular tasks.", lessons: ["ml-ensembles", "cls-gradient-boosting"] },
              { name: "Stacking", why: "A meta-model blends diverse base models for extra lift.", lessons: ["cls-stacking"] },
              { name: "Bigger / pretrained models + transfer", why: "Fine-tune a large pretrained backbone instead of training small from scratch.", lessons: ["mod-transformer", "mod-llm", "mod-vit"] }
            ]
          }
        },
        {
          label: "The problem might be framed wrong",
          node: {
            advice: "Reframe before optimizing. Change the target, split into sub-problems, change granularity, or relax to an easier proxy task.",
            recommend: [
              { name: "Reframe the target / break it up", why: "A different or decomposed objective is often far easier to learn.", lessons: ["ml-supervised", "ai-search-problem"] },
              { name: "Relax to an easier proxy", why: "Solve a simpler related task first, then tighten toward the real goal.", lessons: ["aix-relaxation", "ml-loss"] },
              { name: "Error analysis to guide reframing", why: "See exactly which cases fail before redefining the problem.", lessons: ["mlx-error-analysis"] }
            ]
          }
        },
        {
          label: "It may just be fundamentally hard / too little data",
          node: {
            advice: "Some problems are capped by data or inherent noise. Collect more, simplify the goal, add a human in the loop, and set realistic expectations.",
            recommend: [
              { name: "Collect more / augment data", why: "More data is the most dependable lever when variance dominates.", lessons: ["dl-data-augmentation", "ml-bias-variance"] },
              { name: "Simplify the goal", why: "A narrower, achievable target can deliver real value now.", lessons: ["ml-supervised", "mlx-model-selection"] },
              { name: "Human-in-the-loop + bandits", why: "Let the model handle easy cases and route hard ones to people; explore safely.", lessons: ["cls-bandits", "mlx-error-analysis"] }
            ],
            tips: ["Estimate the irreducible error (Bayes error) so you know when 'good enough' is reached: see ml-bias-variance."]
          }
        }
      ]
    }
  }
];
