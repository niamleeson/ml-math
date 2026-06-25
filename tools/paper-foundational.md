# Foundational papers (capstone components) — build manifest

Each row → one `lessons/concept-<id>.js`, authored per `tools/paper-lessons-spec.md` (fetch the paper via
ar5iv/arXiv, ground everything, build the track's notebook, node --check). Edit ONLY the new file; do NOT
touch index.html (tags added centrally). conceptLink = existing concept lesson to recap+link (verify it
exists; use null if not). "no arXiv" papers: ground metadata + method from the published source via web
search; the code oracle still guarantees correctness.

DONE: paper-batchnorm (A), paper-resnet (B).

id | paper | arXiv | track | module | conceptLink | partOf | build / oracle
---|-------|-------|-------|--------|-------------|--------|----------------
paper-word2vec | Efficient Estimation of Word Representations (Mikolov 2013) | 1301.3781 | primitive | Papers · Sequence & NLP | dl-word2vec | mini-gpt#1, sentiment#1 | skip-gram from scratch; allclose-style check loss matches a manual softmax
paper-attention | Attention Is All You Need — scaled dot-product (Vaswani 2017) | 1706.03762 | primitive | Papers · Transformers & LLMs | dl-attention | mini-gpt#2 | scaled dot-product attention from scratch; allclose vs F.scaled_dot_product_attention
paper-transformer | Attention Is All You Need — the Transformer (Vaswani 2017) | 1706.03762 | architecture | Papers · Transformers & LLMs | mod-transformer | mini-gpt#3 | build multi-head + PE + encoder block from nn.Linear; train tiny copy task
paper-layernorm | Layer Normalization (Ba 2016) | 1607.06450 | primitive | Papers · Foundations & Optimization | dl-batchnorm | mini-gpt#4 | LayerNorm from scratch; allclose vs nn.LayerNorm
paper-adamw | Decoupled Weight Decay Regularization / AdamW (Loshchilov 2017) | 1711.05101 | primitive | Papers · Foundations & Optimization | dl-optimizers | mini-gpt#6 | AdamW step from scratch; allclose vs torch.optim.AdamW on a few steps
paper-gpt | GPT-2: Language Models are Unsupervised Multitask Learners (Radford 2019) | no arXiv — OpenAI report (search) | architecture | Papers · Transformers & LLMs | mod-llm | mini-gpt#7 | nanoGPT-style causal LM from transformer blocks; generate char text
paper-backprop | Learning representations by back-propagating errors (Rumelhart 1986) | no arXiv — Nature 1986 (search) | primitive | Papers · Foundations & Optimization | dl-backprop | image-classifier#1 | autograd from scratch (a tiny tape); allclose grads vs torch.autograd
paper-lenet | Gradient-Based Learning Applied to Document Recognition (LeCun 1998) | no arXiv — IEEE (search) | architecture | Papers · Computer Vision | dl-conv | image-classifier#2 | LeNet-5 from nn.Conv2d; train on MNIST subset
paper-alexnet | ImageNet Classification with Deep CNNs (Krizhevsky 2012) | no arXiv — NeurIPS (search) | architecture | Papers · Computer Vision | dl-conv | image-classifier#3 | scaled-down AlexNet on CIFAR subset
paper-vgg | Very Deep Convolutional Networks / VGG (Simonyan 2014) | 1409.1556 | architecture | Papers · Computer Vision | dl-cnn-params | image-classifier#5 | VGG-style stacked 3x3 on CIFAR subset
paper-adam | Adam: A Method for Stochastic Optimization (Kingma 2014) | 1412.6980 | primitive | Papers · Foundations & Optimization | dl-optimizers | image-classifier#7 | Adam step from scratch; allclose vs torch.optim.Adam
paper-gan | Generative Adversarial Nets (Goodfellow 2014) | 1406.2661 | architecture | Papers · Generative Models | dl-gan | gan#1 | G/D minimax loop; generate MNIST; mode-collapse note
paper-dcgan | Unsupervised Representation Learning with DCGAN (Radford 2015) | 1511.06434 | architecture | Papers · Generative Models | dl-gan | gan#2 | conv generator/discriminator; generate MNIST/Fashion
paper-wgan | Wasserstein GAN (Arjovsky 2017) | 1701.07875 | architecture | Papers · Generative Models | null | gan#4 | WGAN critic + weight clip; show loss correlates with quality
paper-cgan | Conditional Generative Adversarial Nets (Mirza 2014) | 1411.1784 | architecture | Papers · Generative Models | null | gan#5 | condition G/D on labels; generate a chosen digit
paper-vae | Auto-Encoding Variational Bayes / VAE (Kingma 2013) | 1312.6114 | architecture | Papers · Generative Models | mod-vae | diffusion#1 | encoder/decoder + reparameterization + ELBO; reconstruct MNIST
paper-unet | U-Net (Ronneberger 2015) | 1505.04597 | architecture | Papers · Computer Vision | null | diffusion#2 | encoder-decoder + skips; toy segmentation
paper-ddpm | Denoising Diffusion Probabilistic Models (Ho 2020) | 2006.11239 | architecture | Papers · Generative Models | mod-diffusion | diffusion#3 | forward noising + denoising U-Net + simplified loss; sample tiny images
paper-cfg | Classifier-Free Diffusion Guidance (Ho 2022) | 2207.12598 | architecture | Papers · Generative Models | null | diffusion#4 | train conditional+uncond; show guidance scale sharpens samples
paper-reinforce | Policy-gradient / REINFORCE (Williams 1992; Sutton 2000) | 2000 paper or no arXiv (search) | architecture | Papers · Reinforcement Learning | rl-policy-gradients | ppo#1 | REINFORCE on CartPole; return rises
paper-gae | High-Dim Continuous Control with GAE (Schulman 2015) | 1506.02438 | architecture | Papers · Reinforcement Learning | null | ppo#2 | GAE advantage; lower-variance vs Monte-Carlo returns
paper-a2c | Asynchronous Methods for Deep RL / A3C-A2C (Mnih 2016) | 1602.01783 | architecture | Papers · Reinforcement Learning | rl-actor-critic | ppo#3 | advantage actor-critic on CartPole
paper-ppo | Proximal Policy Optimization (Schulman 2017) | 1707.06347 | architecture | Papers · Reinforcement Learning | rl-ppo | ppo#4 | clipped surrogate; solve CartPole; worked ratio/clip numbers
paper-dqn | Playing Atari with Deep RL / DQN (Mnih 2013) | 1312.5602 | architecture | Papers · Reinforcement Learning | rl-dqn | dqn#1 | Q-net + replay + target net; solve CartPole
paper-double-dqn | Deep RL with Double Q-learning (van Hasselt 2016) | 1509.06461 | architecture | Papers · Reinforcement Learning | null | dqn#2 | decouple select/eval; show overestimation drop
paper-dueling-dqn | Dueling Network Architectures (Wang 2016) | 1511.06581 | architecture | Papers · Reinforcement Learning | null | dqn#3 | value+advantage streams
paper-prioritized-replay | Prioritized Experience Replay (Schaul 2015) | 1511.05952 | architecture | Papers · Reinforcement Learning | null | dqn#4 | TD-error priorities + IS weights; faster learning
paper-simclr | A Simple Framework for Contrastive Learning / SimCLR (Chen 2020) | 2002.05709 | architecture | Papers · Self-supervised & Representation | unl-simclr | simclr#1 | two augmented views + NT-Xent; linear probe beats from-scratch
paper-moco | Momentum Contrast / MoCo (He 2020) | 1911.05722 | architecture | Papers · Self-supervised & Representation | unl-moco | simclr#2 | momentum encoder + queue
paper-clip | Learning Transferable Visual Models / CLIP (Radford 2021) | 2103.00020 | architecture | Papers · Self-supervised & Representation | mod-contrastive | simclr#3 | two encoders + InfoNCE; zero-shot match on toy pairs
paper-lstm | Long Short-Term Memory (Hochreiter 1997) | no arXiv — Neural Computation (search) | primitive | Papers · Sequence & NLP | dl-lstm-gru | sentiment#2 | LSTM cell from scratch; allclose vs nn.LSTMCell
paper-seq2seq | Sequence to Sequence Learning (Sutskever 2014) | 1409.3215 | architecture | Papers · Sequence & NLP | null | sentiment#3 | LSTM encoder-decoder; toy reversal/translation
paper-bahdanau-attention | Neural MT by Jointly Learning to Align and Translate (Bahdanau 2014) | 1409.0473 | architecture | Papers · Sequence & NLP | dl-attention | sentiment#4 | additive attention over encoder states; show alignment
paper-gcn | Semi-Supervised Classification with GCN (Kipf 2016) | 1609.02907 | architecture | Papers · Graph Neural Networks | mod-gnn | gnn#1 | graph conv layer; node classification on Cora-like toy graph
paper-graphsage | Inductive Representation Learning / GraphSAGE (Hamilton 2017) | 1706.02216 | architecture | Papers · Graph Neural Networks | null | gnn#2 | neighbor sampling + aggregation
paper-gat | Graph Attention Networks (Velickovic 2017) | 1710.10903 | architecture | Papers · Graph Neural Networks | null | gnn#3 | attention over neighbors
