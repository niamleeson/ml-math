# Face Recognition & Neural Style Transfer

> **Source:** Deep Learning — Stanford CS 230 &middot; Topic 21/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

#### 1.6.1 Face verification and recognition

- **Types of models** — Two main types of model are summed up in table below:

| Face verification | Face recognition |
|---|---|
| - Is this the correct person?<br>- One-to-one lookup | - Is this one of the $K$ persons in the database?<br>- One-to-many lookup |
| *[Figure: Face verification illustration showing a query teddy-bear image compared with a reference teddy-bear image, marked with a green check when the identities match, and a query white-bear image compared with a different teddy-bear reference, marked with a red cross when they do not match; the purpose is to show a one-to-one identity check.]* | *[Figure: Face recognition illustration showing one query teddy-bear image connected to a database containing multiple candidate images; one path is highlighted in green to the matching teddy bear while other gray paths go to nonmatching teddy bears, a white bear, and a red-nosed toy, illustrating one-to-many lookup among $K$ people.]* |

- **One Shot Learning** — One Shot Learning is a face verification algorithm that uses a limited training set to learn a similarity function that quantifies how different two given images are. The similarity function applied to two images is often noted $d(\textrm{image 1}, \textrm{image 2})$.

- **Siamese Network** — Siamese Networks aim at learning how to encode images to then quantify how different two images are. For a given input image $x^{(i)}$, the encoded output is often noted as $f(x^{(i)})$.

*[Figure: Siamese-network-style embedding illustration for face images, where input images are mapped through the same neural network encoder into representation vectors so that distances between embeddings can be compared; the pedagogical purpose is to show that similarity is computed after encoding, not directly from pixels.]*

- **Triplet loss** — The triplet loss $\ell$ is a loss function computed on the embedding representation of a triplet of images $A$ (anchor), $P$ (positive) and $N$ (negative). The anchor and the positive example belong to a same class, while the negative example to another one. By calling $\alpha\in\mathbb{R}^+$ the margin parameter, this loss is defined as follows:

$$
\boxed{\ell(A,P,N)=\max\left(d(A,P)-d(A,N)+\alpha,0\right)}
$$

*[Figure: Two concentric-distance triplet-loss diagrams. In the first, anchor $A$ is near positive example $P$ and far from negative example $N$ by at least margin $\alpha$, so the label underneath is $\ell(A,P,N)=0$. In the second, $N$ lies too close to $A$ relative to $P$ and the margin, so the label underneath is $\ell(A,P,N)>0$; the purpose is to visualize when the margin constraint is satisfied or violated.]*

#### 1.6.2 Neural style transfer

- **Motivation** — The goal of neural style transfer is to generate an image $G$ based on a given content $C$ and a given style $S$.

*[Figure: Neural style transfer input-output diagram with a teddy bear reading a book labeled Content $C$, a Van Gogh-like Starry Night image labeled Style $S$, and a generated teddy-bear image painted in the same swirling blue-yellow style labeled Generated image $G$; the plus sign and equals sign show that the generated image combines content and style.]*

- **Activation** — In a given layer $l$, the activation is noted $a^{[l]}$ and is of dimensions $n_H\times n_w\times n_c$.

- **Content cost function** — The content cost function $J_{\textrm{content}}(C,G)$ is used to determine how the generated image $G$ differs from the original content image $C$. It is defined as follows:

$$
\boxed{J_{\textrm{content}}(C,G)=\frac{1}{2}\left\|a^{[l](C)}-a^{[l](G)}\right\|^2}
$$

- **Style matrix** — The style matrix $G^{[l]}$ of a given layer $l$ is a Gram matrix where each of its elements $G_{kk'}^{[l]}$ quantifies how correlated the channels $k$ and $k'$ are. It is defined with respect to activations $a^{[l]}$ as follows:

$$
\boxed{G_{kk'}^{[l]}=\sum_{i=1}^{n_H^{[l]}}\sum_{j=1}^{n_w^{[l]}}a_{ijk}^{[l]}a_{ijk'}^{[l]}}
$$

_Remark: the style matrix for the style image and the generated image are noted $G^{[l]}(S)$ and $G^{[l]}(G)$ respectively._

- **Style cost function** — The style cost function $J_{\textrm{style}}(S,G)$ is used to determine how the generated image $G$ differs from the style $S$. It is defined as follows:

$$
\boxed{J_{\textrm{style}}^{[l]}(S,G)=\frac{1}{(2n_Hn_wn_c)^2}\left\|G^{[l](S)}-G^{[l](G)}\right\|_F^2=\frac{1}{(2n_Hn_wn_c)^2}\sum_{k,k'=1}^{n_c}\left(G_{kk'}^{[l](S)}-G_{kk'}^{[l](G)}\right)^2}
$$

- **Overall cost function** — The overall cost function is defined as being a combination of the content and style cost functions, weighted by parameters $\alpha,\beta$, as follows:

$$
\boxed{J(G)=\alpha J_{\textrm{content}}(C,G)+\beta J_{\textrm{style}}(S,G)}
$$

_Remark: a higher value of $\alpha$ will make the model care more about the content while a higher value of $\beta$ will make it care more about the style._
