# Capstone spines — build real systems out of the paper lessons

A capstone is an ORDERED PATH through foundational papers. Each step is a normal paper lesson
(`tools/paper-lessons-spec.md`); implementing it adds a COMPONENT to a growing system. At milestones you
assemble + run the partial system; the final notebook stitches everything into the working build.

## Capstone object (`lessons/concept-capstone-<id>.js`)
```
window.LESSONS.push({
  id: "capstone-<id>", type: "capstone", title: "...", module: "Capstones",
  goal: `<the working system + what "done" looks like>`,
  architecture: `<diagram/description of what you'll build>`,
  steps: [ { paper: "paper-<slug>", builds: "<component>", milestone: true|false }, ... ],
  reflection: `<what each paper contributed; what to read next>`
});
window.CODE["capstone-<id>"]   = { lib:"PyTorch", runnable:false, explain:`...`, code:`<final build: import/assemble components → train → demo>` };
window.CODEVIZ["capstone-<id>"]= { ... };   // the finished system's result (ours, labeled)
```
Each component paper lesson sets `partOf: [{ capstone:"capstone-<id>", step:<n>, builds:"..." }]`.
A paper shared by two spines (e.g. paper-batchnorm) is written ONCE and linked from both.

## The 9 spines (component papers in build order)

1. capstone-mini-gpt — "Build a mini-GPT from scratch" (generates char-level text)
   paper-word2vec(🔨A) → paper-attention(🔨A) → paper-transformer(🧩B) → paper-layernorm(🔨A) →
   paper-resnet(🧩B, residual) → paper-adamw(🔨A) → paper-gpt(🧩B)   [milestones: attention, transformer, gpt]

2. capstone-image-classifier — "From a single neuron to ResNet" (CIFAR-10)
   paper-backprop(🔨A) → paper-lenet(🧩B, convolution) → paper-alexnet(🧩B) → paper-batchnorm(🔨A) →
   paper-vgg(🧩B) → paper-resnet(🧩B) → paper-adam(🔨A)   [milestones: lenet, batchnorm, resnet]

3. capstone-gan — "A GAN that generates digits" (MNIST)
   paper-gan(🧩B) → paper-dcgan(🧩B) → paper-batchnorm(🔨A, shared) → paper-wgan(🧩B) → paper-cgan(🧩B)
   [milestones: gan, dcgan]

4. capstone-diffusion — "A diffusion image generator"
   paper-vae(🧩B) → paper-unet(🧩B) → paper-ddpm(🧩B) → paper-cfg(🧩B, classifier-free guidance)
   [milestones: ddpm, cfg]

5. capstone-ppo — "An RL agent: policy gradients → PPO" (CartPole → LunarLander)
   paper-reinforce(🧩B) → paper-gae(🧩B) → paper-a2c(🧩B) → paper-ppo(🧩B)   [milestones: reinforce, ppo]

6. capstone-dqn — "A DQN that learns from rewards" (CartPole/MountainCar)
   paper-dqn(🧩B) → paper-double-dqn(🧩B) → paper-dueling-dqn(🧩B) → paper-prioritized-replay(🧩B)
   [milestones: dqn, dueling-dqn]

7. capstone-simclr — "Self-supervised vision" (learn features without labels, then probe)
   paper-simclr(🧩B) → paper-moco(🧩B) → paper-clip(🧩B, optional)   [milestone: simclr]

8. capstone-sentiment — "The classic NLP pipeline" (sentiment classifier)
   paper-word2vec(🔨A, shared) → paper-lstm(🔨A) → paper-seq2seq(🧩B) → paper-bahdanau-attention(🧩B)
   [milestones: lstm, bahdanau-attention]

9. capstone-gnn — "A graph neural network" (node classification on Cora)
   paper-gcn(🧩B) → paper-graphsage(🧩B) → paper-gat(🧩B)   [milestone: gcn]

## The foundational set (~40 unique paper ids) = the union of the spines above.
These get built FIRST (Phases 2-3). The remaining ~160 papers from the 200-list are the reference library
(Phase 4) — same template, not on a spine (`partOf: []`).

## Notebook for a capstone
intro (the system) → architecture → for each step: a short "you built X in paper-<slug>" recap + import/define
that component → milestone assembly cells → final training run → demo (generate text / classify / play / sample).
All numbers are OURS, labeled.
