# Advanced CNN Architectures: GAN, ResNet, Inception

> **Source:** Deep Learning — Stanford CS 230 &middot; Topic 22/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

#### 1.6.3 Architectures using computational tricks

- **Generative Adversarial Network** — Generative adversarial networks, also known as GANs, are composed of a generative and a discriminative model, where the generative model aims at generating the most truthful output that will be fed into the discriminative which aims at differentiating the generated and true image.

*[Figure: GAN pipeline diagram. A training set is sent through a “Real-world image” block to produce a real teddy-bear image, while random noise is sent through a “Generator” block to produce a generated teddy-bear image; both images enter a “Discriminator” block whose output is a vertical real/fake decision panel with a green circle labeled Real and a red circle labeled Fake. The purpose is to show adversarial competition between generation and discrimination.]*

_Remark: use cases using variants of GANs include text to image, music generation and synthesis._

- **ResNet** — The Residual Network architecture (also called ResNet) uses residual blocks with a high number of layers meant to decrease the training error. The residual block has the following characterizing equation:

$$
\boxed{a^{[l+2]}=g\left(a^{[l]}+z^{[l+2]}\right)}
$$

*[Figure: Residual block diagram showing a main sequence of layers from activation $a^{[l]}$ to $z^{[l+2]}$ and a skip connection carrying $a^{[l]}$ forward to be added before applying activation $g$, illustrating how identity shortcuts help gradients and features flow through deep networks.]*

- **Inception Network** — This architecture uses inception modules and aims at giving a try at different convolutions in order to increase its performance. In particular, it uses the $1\times1$ convolution trick to lower the burden of computation.

*[Figure: Inception module illustration with multiple parallel branches applying different operations such as $1\times1$, $3\times3$, and $5\times5$ convolutions and pooling, then concatenating their outputs; the purpose is to show feature diversification while $1\times1$ convolutions reduce computation.]*

* * *
