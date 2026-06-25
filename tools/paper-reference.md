# Reference-library papers — build manifest (the ~160 beyond the foundational set)

Each row → one `lessons/concept-<id>.js`, authored per `tools/paper-lessons-spec.md` (fetch via
ar5iv/arXiv or the official PDF; ground everything; build the track's notebook; node --check). Edit ONLY
the new file; do NOT touch index.html (tags added centrally). conceptLink = an existing concept lesson to
recap+link if one fits, else null. partOf: [] (reference papers are not on a capstone spine).
"no arXiv" → set paper.url to the official/published source you find by web-search; ground from it.

Format: id | title (year) | arXiv (or "no arXiv: hint") | track | module | conceptLink

### Foundations & Optimization
paper-momentum | On the importance of initialization and momentum (2013) | no arXiv: proceedings.mlr.press/v28/sutskever13 | primitive | Papers · Foundations & Optimization | dl-optimizers
paper-nesterov | Nesterov accelerated gradient / A method for unconstrained convex minimization (1983) | no arXiv: classic, web-search | primitive | Papers · Foundations & Optimization | dl-optimizers
paper-adagrad | Adaptive Subgradient Methods / Adagrad (2011) | no arXiv: jmlr.org/papers/v12/duchi11a | primitive | Papers · Foundations & Optimization | dl-optimizers
paper-rmsprop | RMSProp (Hinton Coursera lecture 6, 2012) | no arXiv: cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf | primitive | Papers · Foundations & Optimization | dl-optimizers
paper-sgdr | SGDR: Stochastic Gradient Descent with Warm Restarts (2016) | 1608.03983 | primitive | Papers · Foundations & Optimization | dl-optimizers
paper-xavier-init | Understanding the difficulty of training deep feedforward networks / Glorot init (2010) | no arXiv: proceedings.mlr.press/v9/glorot10a | primitive | Papers · Foundations & Optimization | dl-init
paper-he-init | Delving Deep into Rectifiers / He init + PReLU (2015) | 1502.01852 | primitive | Papers · Foundations & Optimization | dl-init
paper-groupnorm | Group Normalization (2018) | 1803.08494 | primitive | Papers · Foundations & Optimization | dl-batchnorm
paper-weightnorm | Weight Normalization (2016) | 1602.07868 | primitive | Papers · Foundations & Optimization | null
paper-gelu | Gaussian Error Linear Units (GELU) (2016) | 1606.08415 | primitive | Papers · Foundations & Optimization | dl-activations
paper-swish | Searching for Activation Functions / Swish (2017) | 1710.05941 | primitive | Papers · Foundations & Optimization | dl-activations

### Regularization & Augmentation
paper-dropout | Dropout (2014) | no arXiv: jmlr.org/papers/v15/srivastava14a | primitive | Papers · Foundations & Optimization | dl-dropout
paper-stochastic-depth | Deep Networks with Stochastic Depth (2016) | 1603.09382 | architecture | Papers · Computer Vision | null
paper-label-smoothing | Rethinking the Inception Architecture (label smoothing) (2015) | 1512.00567 | primitive | Papers · Foundations & Optimization | null
paper-mixup | mixup: Empirical Risk Minimization (2017) | 1710.09412 | primitive | Papers · Foundations & Optimization | null
paper-cutmix | CutMix (2019) | 1905.04899 | primitive | Papers · Computer Vision | null
paper-autoaugment | AutoAugment (2018) | 1805.09501 | architecture | Papers · Computer Vision | null
paper-lottery-ticket | The Lottery Ticket Hypothesis (2018) | 1803.03635 | architecture | Papers · Efficiency & Compression | null
paper-double-descent | Deep Double Descent (2019) | 1912.02292 | architecture | Papers · Foundations & Optimization | ml-bias-variance

### Classical ML
paper-knn | Nearest neighbor pattern classification (1967) | no arXiv: classic | primitive | Papers · Classical ML | ml-knn
paper-naive-bayes | A comparison of event models for Naive Bayes text classification (1998) | no arXiv: classic | primitive | Papers · Classical ML | ml-naive-bayes
paper-cart | Classification and Regression Trees (1984) | no arXiv: book/classic | primitive | Papers · Classical ML | ml-trees
paper-svm | Support-Vector Networks (1995) | no arXiv: link.springer.com/article/10.1007/BF00994018 | primitive | Papers · Classical ML | ml-svm
paper-adaboost | A decision-theoretic generalization / AdaBoost (1997) | no arXiv: classic | primitive | Papers · Classical ML | ml-ensembles
paper-gradient-boosting | Greedy Function Approximation: A Gradient Boosting Machine (2001) | no arXiv: projecteuclid | primitive | Papers · Classical ML | cls-gradient-boosting
paper-random-forests | Random Forests (2001) | no arXiv: link.springer.com/article/10.1023/A:1010933404324 | primitive | Papers · Classical ML | ml-ensembles
paper-xgboost | XGBoost: A Scalable Tree Boosting System (2016) | 1603.02754 | architecture | Papers · Classical ML | cls-gradient-boosting
paper-lightgbm | LightGBM (2017) | no arXiv: NeurIPS 2017 proceedings | architecture | Papers · Classical ML | cls-gradient-boosting
paper-lasso | Regression Shrinkage and Selection via the Lasso (1996) | no arXiv: JRSS-B | primitive | Papers · Classical ML | ml-regularization
paper-kmeans | Least squares quantization in PCM / k-means (1982, Lloyd) | no arXiv: classic | primitive | Papers · Classical ML | ml-kmeans
paper-dbscan | DBSCAN (1996) | no arXiv: KDD-96 | primitive | Papers · Classical ML | cls-dbscan
paper-em | Maximum Likelihood from Incomplete Data via the EM Algorithm (1977) | no arXiv: JRSS-B | primitive | Papers · Classical ML | ml-em
paper-pca | On lines and planes of closest fit / LSI of PCA (Pearson 1901 / Hotelling 1933) | no arXiv: classic | primitive | Papers · Classical ML | ml-pca
paper-tsne | Visualizing Data using t-SNE (2008) | no arXiv: jmlr.org/papers/v9/vandermaaten08a | primitive | Papers · Classical ML | cls-tsne
paper-gaussian-processes | Gaussian Processes for Machine Learning (2006) | no arXiv: gaussianprocess.org/gpml | primitive | Papers · Classical ML | cls-gaussian-process

### Computer Vision (CNN architectures + detection/segmentation)
paper-inception | Going Deeper with Convolutions / GoogLeNet (2014) | 1409.4842 | architecture | Papers · Computer Vision | dl-inception
paper-densenet | Densely Connected Convolutional Networks (2016) | 1608.06993 | architecture | Papers · Computer Vision | null
paper-highway | Highway Networks (2015) | 1505.00387 | architecture | Papers · Computer Vision | dl-resnet
paper-senet | Squeeze-and-Excitation Networks (2017) | 1709.01507 | architecture | Papers · Computer Vision | null
paper-mobilenet | MobileNets (2017) | 1704.04861 | architecture | Papers · Computer Vision | null
paper-mobilenetv2 | MobileNetV2 (2018) | 1801.04381 | architecture | Papers · Computer Vision | null
paper-shufflenet | ShuffleNet (2017) | 1707.01083 | architecture | Papers · Computer Vision | null
paper-efficientnet | EfficientNet (2019) | 1905.11946 | architecture | Papers · Computer Vision | null
paper-convnext | A ConvNet for the 2020s / ConvNeXt (2022) | 2201.03545 | architecture | Papers · Computer Vision | null
paper-non-local | Non-local Neural Networks (2017) | 1711.07971 | architecture | Papers · Computer Vision | dl-attention
paper-rcnn | Rich feature hierarchies / R-CNN (2013) | 1311.2524 | architecture | Papers · Computer Vision | dl-object-detection
paper-fast-rcnn | Fast R-CNN (2015) | 1504.08083 | architecture | Papers · Computer Vision | dl-object-detection
paper-faster-rcnn | Faster R-CNN (2015) | 1506.01497 | architecture | Papers · Computer Vision | dl-object-detection
paper-yolo | You Only Look Once (2015) | 1506.02640 | architecture | Papers · Computer Vision | dl-object-detection
paper-ssd | SSD: Single Shot MultiBox Detector (2015) | 1512.02325 | architecture | Papers · Computer Vision | dl-object-detection
paper-fpn | Feature Pyramid Networks (2016) | 1612.03144 | architecture | Papers · Computer Vision | null
paper-retinanet | Focal Loss for Dense Object Detection / RetinaNet (2017) | 1708.02002 | architecture | Papers · Computer Vision | null
paper-mask-rcnn | Mask R-CNN (2017) | 1703.06870 | architecture | Papers · Computer Vision | dl-object-detection
paper-detr | End-to-End Object Detection with Transformers / DETR (2020) | 2005.12872 | architecture | Papers · Computer Vision | null

### Sequence & Pre-Transformer NLP
paper-gru | On the Properties of Neural Machine Translation / GRU (2014) | 1409.1259 | primitive | Papers · Sequence & NLP | dl-lstm-gru
paper-glove | GloVe: Global Vectors for Word Representation (2014) | no arXiv: nlp.stanford.edu/pubs/glove.pdf | primitive | Papers · Sequence & NLP | dl-word2vec
paper-fasttext | Enriching Word Vectors with Subword Information / fastText (2016) | 1607.04606 | architecture | Papers · Sequence & NLP | dl-word-embeddings
paper-ctc | Connectionist Temporal Classification (2006) | no arXiv: cs.toronto.edu/~graves/icml_2006.pdf | architecture | Papers · Sequence & NLP | null
paper-elmo | Deep contextualized word representations / ELMo (2018) | 1802.05365 | architecture | Papers · Sequence & NLP | dl-word-embeddings
paper-ulmfit | Universal Language Model Fine-tuning / ULMFiT (2018) | 1801.06146 | architecture | Papers · Sequence & NLP | fs-transfer-learning

### Transformers & Efficient Attention
paper-transformer-xl | Transformer-XL (2019) | 1901.02860 | architecture | Papers · Transformers & LLMs | mod-transformer
paper-bert | BERT (2018) | 1810.04805 | architecture | Papers · Transformers & LLMs | mod-llm
paper-roberta | RoBERTa (2019) | 1907.11692 | architecture | Papers · Transformers & LLMs | mod-llm
paper-albert | ALBERT (2019) | 1909.11942 | architecture | Papers · Transformers & LLMs | mod-llm
paper-distilbert | DistilBERT (2019) | 1910.01108 | architecture | Papers · Transformers & LLMs | null
paper-bart | BART (2019) | 1910.13461 | architecture | Papers · Transformers & LLMs | null
paper-t5 | Exploring the Limits of Transfer Learning / T5 (2019) | 1910.10683 | architecture | Papers · Transformers & LLMs | mod-llm
paper-electra | ELECTRA (2020) | 2003.10555 | architecture | Papers · Transformers & LLMs | null
paper-sentence-bert | Sentence-BERT (2019) | 1908.10084 | architecture | Papers · Transformers & LLMs | dl-cosine-similarity
paper-longformer | Longformer (2020) | 2004.05150 | architecture | Papers · Transformers & LLMs | dl-attention
paper-rope | RoFormer: Rotary Position Embedding (2021) | 2104.09864 | primitive | Papers · Transformers & LLMs | mod-transformer
paper-flashattention | FlashAttention (2022) | 2205.14135 | architecture | Papers · Transformers & LLMs | dl-attention
paper-vit | An Image is Worth 16x16 Words / ViT (2020) | 2010.11929 | architecture | Papers · Transformers & LLMs | mod-vit

### LLMs & Alignment
paper-gpt3 | Language Models are Few-Shot Learners / GPT-3 (2020) | 2005.14165 | read-only | Papers · Transformers & LLMs | fs-in-context
paper-scaling-laws | Scaling Laws for Neural Language Models (2020) | 2001.08361 | read-only | Papers · Transformers & LLMs | null
paper-chinchilla | Training Compute-Optimal LLMs / Chinchilla (2022) | 2203.15556 | read-only | Papers · Transformers & LLMs | null
paper-palm | PaLM (2022) | 2204.02311 | read-only | Papers · Transformers & LLMs | null
paper-llama | LLaMA: Open and Efficient Foundation LMs (2023) | 2302.13971 | read-only | Papers · Transformers & LLMs | null
paper-instructgpt | Training LMs to follow instructions / InstructGPT-RLHF (2022) | 2203.02155 | architecture | Papers · Transformers & LLMs | null
paper-chain-of-thought | Chain-of-Thought Prompting (2022) | 2201.11903 | read-only | Papers · Transformers & LLMs | null
paper-lora | LoRA: Low-Rank Adaptation (2021) | 2106.09685 | architecture | Papers · Transformers & LLMs | fs-transfer-learning
paper-rag | Retrieval-Augmented Generation (2020) | 2005.11401 | architecture | Papers · Transformers & LLMs | null
paper-dpo | Direct Preference Optimization (2023) | 2305.18290 | architecture | Papers · Transformers & LLMs | null
paper-switch-transformer | Switch Transformers / MoE (2021) | 2101.03961 | architecture | Papers · Transformers & LLMs | null
paper-fid | Leveraging Passage Retrieval / Fusion-in-Decoder (2020) | 2007.01282 | architecture | Papers · Transformers & LLMs | null
paper-constitutional-ai | Constitutional AI (2022) | 2212.08073 | read-only | Papers · Transformers & LLMs | null

### Generative Models (GANs + VAE/Flows/Diffusion)
paper-pix2pix | Image-to-Image Translation / pix2pix (2016) | 1611.07004 | architecture | Papers · Generative Models | dl-gan
paper-cyclegan | Unpaired Image-to-Image Translation / CycleGAN (2017) | 1703.10593 | architecture | Papers · Generative Models | dl-gan
paper-progan | Progressive Growing of GANs (2017) | 1710.10196 | architecture | Papers · Generative Models | dl-gan
paper-stylegan | A Style-Based Generator / StyleGAN (2018) | 1812.04948 | architecture | Papers · Generative Models | dl-gan
paper-beta-vae | beta-VAE (2017) | no arXiv: openreview ICLR 2017 | architecture | Papers · Generative Models | mod-vae
paper-vqvae | Neural Discrete Representation Learning / VQ-VAE (2017) | 1711.00937 | architecture | Papers · Generative Models | mod-vae
paper-pixelcnn | Conditional Image Generation with PixelCNN (2016) | 1606.05328 | architecture | Papers · Generative Models | null
paper-realnvp | Density estimation using Real NVP (2016) | 1605.08803 | architecture | Papers · Generative Models | mod-normalizing-flows
paper-glow | Glow: Generative Flow with 1x1 Convolutions (2018) | 1807.03039 | architecture | Papers · Generative Models | mod-normalizing-flows
paper-score-sde | Score-Based Generative Modeling through SDEs (2020) | 2011.13456 | architecture | Papers · Generative Models | mod-diffusion
paper-latent-diffusion | High-Resolution Image Synthesis / Latent Diffusion (2021) | 2112.10752 | architecture | Papers · Generative Models | mod-diffusion
paper-controlnet | Adding Conditional Control / ControlNet (2023) | 2302.05543 | architecture | Papers · Generative Models | null
paper-dalle | Zero-Shot Text-to-Image Generation / DALL-E (2021) | 2102.12092 | read-only | Papers · Generative Models | null
paper-neural-style | A Neural Algorithm of Artistic Style (2015) | 1508.06576 | architecture | Papers · Generative Models | dl-style-transfer

### Self-supervised & Representation
paper-autoencoder | Reducing the Dimensionality of Data with Neural Networks (2006) | no arXiv: science.org/doi/10.1126/science.1127647 | architecture | Papers · Self-supervised & Representation | mod-autoencoder
paper-denoising-ae | Extracting and Composing Robust Features / Denoising Autoencoders (2008) | no arXiv: ICML 2008 | architecture | Papers · Self-supervised & Representation | mod-autoencoder
paper-byol | Bootstrap Your Own Latent / BYOL (2020) | 2006.07733 | architecture | Papers · Self-supervised & Representation | null
paper-simsiam | Exploring Simple Siamese Representation Learning (2020) | 2011.10566 | architecture | Papers · Self-supervised & Representation | null
paper-dino | Emerging Properties in Self-Supervised ViT / DINO (2021) | 2104.14294 | architecture | Papers · Self-supervised & Representation | null
paper-mae | Masked Autoencoders Are Scalable Vision Learners (2021) | 2111.06377 | architecture | Papers · Self-supervised & Representation | null
paper-barlow-twins | Barlow Twins (2021) | 2103.03230 | architecture | Papers · Self-supervised & Representation | null

### Reinforcement Learning
paper-rainbow | Rainbow: Combining Improvements in Deep RL (2017) | 1710.02298 | architecture | Papers · Reinforcement Learning | rl-dqn
paper-trpo | Trust Region Policy Optimization (2015) | 1502.05477 | architecture | Papers · Reinforcement Learning | rl-ppo
paper-ddpg | Continuous control with deep RL / DDPG (2015) | 1509.02971 | architecture | Papers · Reinforcement Learning | rl-continuous-control
paper-sac | Soft Actor-Critic (2018) | 1801.01290 | architecture | Papers · Reinforcement Learning | rl-continuous-control
paper-her | Hindsight Experience Replay (2017) | 1707.01495 | architecture | Papers · Reinforcement Learning | null
paper-world-models | World Models (2018) | 1803.10122 | architecture | Papers · Reinforcement Learning | rl-model-based
paper-alphazero | Mastering Chess and Shogi by Self-Play / AlphaZero (2017) | 1712.01815 | architecture | Papers · Reinforcement Learning | null
paper-muzero | Mastering Atari, Go, Chess by Planning / MuZero (2019) | 1911.08265 | architecture | Papers · Reinforcement Learning | rl-model-based
paper-alphago | Mastering the game of Go / AlphaGo (2016) | no arXiv: nature.com/articles/nature16961 | read-only | Papers · Reinforcement Learning | null
paper-decision-transformer | Decision Transformer (2021) | 2106.01345 | architecture | Papers · Reinforcement Learning | rl-offline-rl
paper-icm | Curiosity-driven Exploration / ICM (2017) | 1705.05363 | architecture | Papers · Reinforcement Learning | rl-exploration

### Graph Neural Networks
paper-deepwalk | DeepWalk (2014) | 1403.6652 | architecture | Papers · Graph Neural Networks | mod-gnn
paper-node2vec | node2vec (2016) | 1607.00653 | architecture | Papers · Graph Neural Networks | mod-gnn
paper-mpnn | Neural Message Passing for Quantum Chemistry / MPNN (2017) | 1704.01212 | architecture | Papers · Graph Neural Networks | mod-gnn
paper-gin | How Powerful are Graph Neural Networks? / GIN (2018) | 1810.00826 | architecture | Papers · Graph Neural Networks | mod-gnn
paper-pinsage | Graph Convolutional Neural Networks for Web-Scale / PinSAGE (2018) | 1806.01973 | architecture | Papers · Graph Neural Networks | mod-gnn

### Speech & Audio
paper-deep-speech | Deep Speech (2014) | 1412.5567 | architecture | Papers · Speech & Audio | null
paper-wavenet | WaveNet (2016) | 1609.03499 | architecture | Papers · Speech & Audio | null
paper-tacotron | Tacotron (2017) | 1703.10135 | architecture | Papers · Speech & Audio | null
paper-las | Listen, Attend and Spell (2015) | 1508.01211 | architecture | Papers · Speech & Audio | dl-attention
paper-conformer | Conformer (2020) | 2005.08100 | architecture | Papers · Speech & Audio | null
paper-wav2vec2 | wav2vec 2.0 (2020) | 2006.11477 | architecture | Papers · Speech & Audio | null
paper-whisper | Robust Speech Recognition / Whisper (2022) | 2212.04356 | read-only | Papers · Speech & Audio | null
paper-hubert | HuBERT (2021) | 2106.07447 | architecture | Papers · Speech & Audio | null

### Recommender Systems
paper-matrix-factorization | Matrix Factorization Techniques for Recommender Systems (2009) | no arXiv: IEEE Computer | primitive | Papers · Recommender Systems | cls-recommender
paper-fm | Factorization Machines (2010) | no arXiv: IEEE ICDM 2010 | architecture | Papers · Recommender Systems | null
paper-bpr | BPR: Bayesian Personalized Ranking (2009) | 1205.2618 | architecture | Papers · Recommender Systems | null
paper-wide-deep | Wide & Deep Learning (2016) | 1606.07792 | architecture | Papers · Recommender Systems | null
paper-ncf | Neural Collaborative Filtering (2017) | 1708.05031 | architecture | Papers · Recommender Systems | cls-recommender
paper-deepfm | DeepFM (2017) | 1703.04247 | architecture | Papers · Recommender Systems | null

### Efficiency & Compression
paper-knowledge-distillation | Distilling the Knowledge in a Neural Network (2015) | 1503.02531 | architecture | Papers · Efficiency & Compression | null
paper-pruning | Learning both Weights and Connections (2015) | 1506.02626 | architecture | Papers · Efficiency & Compression | null
paper-deep-compression | Deep Compression (2015) | 1510.00149 | architecture | Papers · Efficiency & Compression | null
paper-xnor-net | XNOR-Net (2016) | 1603.05279 | architecture | Papers · Efficiency & Compression | null
paper-quantization-aware | Quantization and Training for Efficient Integer-Arithmetic Inference (2017) | 1712.05877 | architecture | Papers · Efficiency & Compression | null
paper-mixed-precision | Mixed Precision Training (2017) | 1710.03740 | architecture | Papers · Efficiency & Compression | pt-gpu-amp
paper-squeezenet | SqueezeNet (2016) | 1602.07360 | architecture | Papers · Efficiency & Compression | null
paper-darts | DARTS: Differentiable Architecture Search (2018) | 1806.09055 | architecture | Papers · Efficiency & Compression | null

### Meta-learning, Bayesian & Robustness
paper-siamese | Siamese Neural Networks for One-shot Image Recognition (2015) | no arXiv: cs.toronto.edu/~rsalakhu/papers/oneshot1.pdf | architecture | Papers · Meta-learning, Bayesian & Robustness | fs-metric-learning
paper-matching-networks | Matching Networks for One Shot Learning (2016) | 1606.04080 | architecture | Papers · Meta-learning, Bayesian & Robustness | fs-few-shot
paper-prototypical | Prototypical Networks for Few-shot Learning (2017) | 1703.05175 | architecture | Papers · Meta-learning, Bayesian & Robustness | fs-few-shot
paper-maml | Model-Agnostic Meta-Learning / MAML (2017) | 1703.03400 | architecture | Papers · Meta-learning, Bayesian & Robustness | fs-meta-learning
paper-bayes-by-backprop | Weight Uncertainty in Neural Networks / Bayes by Backprop (2015) | 1505.05424 | architecture | Papers · Meta-learning, Bayesian & Robustness | null
paper-mc-dropout | Dropout as a Bayesian Approximation / MC Dropout (2015) | 1506.02142 | architecture | Papers · Meta-learning, Bayesian & Robustness | dl-dropout
paper-deep-ensembles | Simple and Scalable Predictive Uncertainty / Deep Ensembles (2016) | 1612.01474 | architecture | Papers · Meta-learning, Bayesian & Robustness | null
paper-normalizing-flows-vi | Variational Inference with Normalizing Flows (2015) | 1505.05770 | architecture | Papers · Meta-learning, Bayesian & Robustness | mod-normalizing-flows
paper-fgsm | Explaining and Harnessing Adversarial Examples / FGSM (2014) | 1412.6572 | architecture | Papers · Meta-learning, Bayesian & Robustness | null
paper-pgd | Towards Deep Learning Models Resistant to Adversarial Attacks / PGD (2017) | 1706.06083 | architecture | Papers · Meta-learning, Bayesian & Robustness | null
paper-carlini-wagner | Towards Evaluating the Robustness of Neural Networks / C&W (2016) | 1608.04644 | architecture | Papers · Meta-learning, Bayesian & Robustness | null
paper-certified-robustness | Certified Adversarial Robustness via Randomized Smoothing (2019) | 1902.02918 | architecture | Papers · Meta-learning, Bayesian & Robustness | null

### Interpretability
paper-lime | "Why Should I Trust You?" / LIME (2016) | 1602.04938 | architecture | Papers · Meta-learning, Bayesian & Robustness | null
paper-gradcam | Grad-CAM (2016) | 1610.02391 | architecture | Papers · Meta-learning, Bayesian & Robustness | null
paper-shap | A Unified Approach to Interpreting Model Predictions / SHAP (2017) | 1705.07874 | architecture | Papers · Meta-learning, Bayesian & Robustness | null
paper-integrated-gradients | Axiomatic Attribution for Deep Networks / Integrated Gradients (2017) | 1703.01365 | architecture | Papers · Meta-learning, Bayesian & Robustness | null

### Datasets / Benchmarks / Surveys (read-only)
paper-imagenet | ImageNet: A Large-Scale Hierarchical Image Database (2009) | no arXiv: image-net.org/static_files/papers/imagenet_cvpr09.pdf | read-only | Papers · Datasets, Benchmarks & Surveys | null
paper-mscoco | Microsoft COCO: Common Objects in Context (2014) | 1405.0312 | read-only | Papers · Datasets, Benchmarks & Surveys | null
paper-deep-learning-survey | Deep Learning (LeCun, Bengio, Hinton, Nature 2015) | no arXiv: nature.com/articles/nature14539 | read-only | Papers · Datasets, Benchmarks & Surveys | null
