# Advanced CNN Architectures: GAN, ResNet, Inception
> **Source:** CS 230 · **Category:** Model · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 Runnable notebook section; an `.ipynb` will be generated.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

**What we will build, step by step:**
1. **ResNet residual learning with a shortcut** — learn a correction instead of relearning the input.
2. **Inception parallel branches plus $1\times1$ convolution** — mix channels cheaply and concatenate multi-scale features.
3. **GAN generator versus discriminator** — move fake samples in the direction that fools a discriminator.

### Step 0 — Set up our tools

We import NumPy (tiny tensors + math) and Matplotlib (pictures). We fix a random **seed** so you
get the same numbers every run, then define a small `log()` helper so each printed value is labeled.

```python
import numpy as np                       # NumPy: vectors, tiny image tensors, losses, and parameter counts.
import matplotlib.pyplot as plt          # Matplotlib: draw residuals, branch maps, and GAN histograms.

np.random.seed(0)                         # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # A comfortable default plot size.

def log(label, value):                    # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")           # Format is: [what this is] the value.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — ResNet: residual learning with a shortcut

A residual block computes $y=g(x+F(x))$. The shortcut carries the input $x$ forward directly, so
the main path only has to learn a **correction** $F(x)$; if the right mapping is close to identity,
the block can keep $F(x)$ small.

```python
x_res_demo = np.array([1.0, -0.6, 0.2, 1.4, -0.1])                         # A tiny activation vector entering a residual block.
residual_demo = np.array([0.08, 0.30, -0.05, -0.12, 0.18])                  # The main path learns a small correction F(x).
pre_activation_demo = x_res_demo + residual_demo                            # The shortcut adds x back to the residual correction.
output_res_demo = np.maximum(pre_activation_demo, 0.0)                      # Apply ReLU g(.) after the residual addition.

log("input x", np.round(x_res_demo, 3))                                     # Print the shortcut signal.
log("residual F(x)", np.round(residual_demo, 3))                             # Print the learned correction.
log("x + F(x)", np.round(pre_activation_demo, 3))                            # Print the pre-activation sum.
log("ReLU(x + F(x))", np.round(output_res_demo, 3))                          # Print the final block output.

layers_demo = np.arange(1, 31)                                              # Compare gradient flow through depths 1..30.
plain_slope_demo = 0.82                                                     # A plain stack multiplies by a sub-unit derivative each layer.
residual_slope_demo = 1.0 + 0.02                                            # A shortcut contributes an identity derivative plus a small correction.
plain_gradient_demo = plain_slope_demo ** layers_demo                       # Plain gradients shrink by repeated multiplication.
residual_gradient_demo = residual_slope_demo ** layers_demo                 # Residual gradients keep an identity route.

log("plain gradient after 30 layers", round(float(plain_gradient_demo[-1]), 5)) # Print the vanishing-gradient example.
log("residual gradient after 30 layers", round(float(residual_gradient_demo[-1]), 5)) # Print the shortcut-preserved scale.

fig_demo, axes_demo = plt.subplots(1, 2, figsize=(10, 4))                   # Create panels for activations and gradients.
axes_demo[0].bar(np.arange(len(x_res_demo)) - 0.18, x_res_demo, width=0.36, label="x") # Draw the input coordinates.
axes_demo[0].bar(np.arange(len(x_res_demo)) + 0.18, residual_demo, width=0.36, label="F(x)") # Draw residual corrections.
axes_demo[0].set_title("Residual block learns a correction")                # Title the activation panel.
axes_demo[0].set_xlabel("coordinate")                                       # Label vector coordinates.
axes_demo[0].legend()                                                       # Show x versus F(x).
axes_demo[1].plot(layers_demo, plain_gradient_demo, marker="o", label="plain stack") # Plot shrinking plain gradients.
axes_demo[1].plot(layers_demo, residual_gradient_demo, marker="s", label="shortcut path") # Plot residual gradient scale.
axes_demo[1].axhline(1.0, color="black", linestyle="--", label="unit scale") # Mark unchanged gradient size.
axes_demo[1].set_title("Shortcut keeps gradients flowing")                  # Title the gradient panel.
axes_demo[1].set_xlabel("number of layers")                                 # Label depth axis.
axes_demo[1].set_ylabel("relative gradient")                                # Label gradient magnitude.
axes_demo[1].legend()                                                       # Explain curves.
plt.tight_layout()                                                          # Prevent panel overlap.
plt.show()                                                                  # Render the residual visualization.
```
▶ What you'll see: the residual output keeps most of the input signal, and the shortcut-gradient curve stays much larger than the plain one.

### Step 2 — Inception: parallel branches plus $1\times1$ convolution

An Inception module sends the same input through several branches, such as $1\times1$, $3\times3$,
$5\times5$, and pooling, then concatenates their channels. The $1\times1$ convolution is a cheap
channel mixer and bottleneck that reduces expensive spatial-filter parameters.

```python
patch_demo = np.random.rand(4, 4, 3)                                        # A tiny 4x4 image-like tensor with 3 channels.
weights_1x1_demo = np.array([[0.8, -0.2], [0.1, 0.6], [0.4, 0.3]])           # A 1x1 conv mixes 3 input channels into 2 channels.
bottleneck_demo = patch_demo @ weights_1x1_demo                             # Apply the same channel-mixing weights at every pixel.

branch_1x1_demo = bottleneck_demo[..., :1]                                  # Branch 1 keeps one cheap 1x1 mixed channel.
branch_3x3_demo = (bottleneck_demo[..., :1] + np.roll(bottleneck_demo[..., :1], 1, axis=0) + np.roll(bottleneck_demo[..., :1], -1, axis=0) + np.roll(bottleneck_demo[..., :1], 1, axis=1) + np.roll(bottleneck_demo[..., :1], -1, axis=1)) / 5.0 # Mimic a local 3x3-style branch.
branch_pool_demo = np.max(patch_demo, axis=2, keepdims=True)                # Pooling branch keeps the strongest channel at each pixel.
inception_output_demo = np.concatenate([branch_1x1_demo, branch_3x3_demo, branch_pool_demo], axis=2) # Concatenate branch outputs by channel.

k_demo = 5                                                                  # Use a 5x5 branch to show bottleneck savings.
c_in_demo = 64                                                              # Number of input channels before a large branch.
c_b_demo = 16                                                               # Bottleneck channels after the 1x1 reduction.
c_out_demo = 128                                                            # Number of output channels from the large branch.
params_direct_demo = k_demo * k_demo * c_in_demo * c_out_demo + c_out_demo  # Direct 5x5 parameter count.
params_bottleneck_demo = c_in_demo * c_b_demo + c_b_demo + k_demo * k_demo * c_b_demo * c_out_demo + c_out_demo # 1x1 bottleneck plus 5x5 count.
savings_demo = 100.0 * (1.0 - params_bottleneck_demo / params_direct_demo)  # Convert the savings to a percentage.

log("input patch shape", patch_demo.shape)                                  # Print input tensor shape.
log("1x1 bottleneck shape", bottleneck_demo.shape)                          # Print reduced channel shape.
log("branch shapes", [branch_1x1_demo.shape, branch_3x3_demo.shape, branch_pool_demo.shape]) # Print all branch shapes.
log("concatenated output shape", inception_output_demo.shape)               # Print final Inception-style output shape.
log("direct 5x5 params", int(params_direct_demo))                           # Print direct large-filter cost.
log("1x1 bottleneck + 5x5 params", int(params_bottleneck_demo))             # Print bottlenecked cost.
log("parameter savings %", round(float(savings_demo), 1))                   # Print savings percentage.

fig_demo, axes_demo = plt.subplots(1, 4, figsize=(12, 3))                   # Create branch-map and parameter panels.
axes_demo[0].imshow(branch_1x1_demo[:, :, 0], cmap="viridis")               # Show the 1x1 branch output map.
axes_demo[0].set_title("1x1 branch")                                        # Title the first branch.
axes_demo[1].imshow(branch_3x3_demo[:, :, 0], cmap="viridis")               # Show the local branch output map.
axes_demo[1].set_title("3x3-like branch")                                   # Title the second branch.
axes_demo[2].imshow(branch_pool_demo[:, :, 0], cmap="viridis")              # Show the pooling branch output map.
axes_demo[2].set_title("pool branch")                                       # Title the pooling branch.
axes_demo[3].bar(["direct", "1x1+5x5"], [params_direct_demo, params_bottleneck_demo], color=["salmon", "seagreen"]) # Compare parameter counts.
axes_demo[3].set_title("bottleneck saves params")                           # Title the parameter chart.
for ax_demo in axes_demo[:3]:                                               # Clean up image panels.
    ax_demo.axis("off")                                                     # Hide pixel ticks.
plt.tight_layout()                                                          # Keep labels readable.
plt.show()                                                                  # Render the Inception visualization.
```
▶ What you'll see: parallel branch maps keep the same spatial size, concatenation widens the channel axis, and the bottleneck bar is much smaller.

### Step 3 — GAN: generator versus discriminator

A GAN trains two models in a game. The discriminator $D(x)$ learns to score real samples high and
fake samples low; the generator $G(z)$ changes its fake samples so $D(G(z))$ moves closer to 1.

```python
def sigmoid_demo(logits_demo):                                              # Define the discriminator's probability squashing function.
    return 1.0 / (1.0 + np.exp(-np.clip(logits_demo, -40.0, 40.0)))          # Convert logits into probabilities safely.

real_demo = np.random.normal(loc=2.0, scale=0.35, size=120)                 # Synthetic real data clustered near 2.
noise_demo = np.random.normal(loc=0.0, scale=1.0, size=120)                 # Random generator noise.
generator_mean_demo = -1.1                                                  # Start the generator far from the real data.
generator_scale_demo = 0.25                                                 # Keep fake samples narrowly spread at first.
fake_before_demo = generator_mean_demo + generator_scale_demo * noise_demo  # Generate fake samples from noise.

disc_slope_demo = 1.4                                                       # A simple discriminator that treats larger values as more real.
disc_bias_demo = -0.8                                                       # Discriminator intercept.
eps_demo = 1e-8                                                             # Small constant to protect logarithms.
d_real_demo = sigmoid_demo(disc_slope_demo * real_demo + disc_bias_demo)    # Score real samples.
d_fake_before_demo = sigmoid_demo(disc_slope_demo * fake_before_demo + disc_bias_demo) # Score fake samples before the generator update.
loss_d_demo = -np.mean(np.log(d_real_demo + eps_demo) + np.log(1.0 - d_fake_before_demo + eps_demo)) # Discriminator binary-cross-entropy loss.
loss_g_before_demo = -np.mean(np.log(d_fake_before_demo + eps_demo))        # Generator loss rewards high D(fake).

lr_demo = 0.9                                                               # A visible one-step generator learning rate.
grad_fake_demo = -disc_slope_demo * (1.0 - d_fake_before_demo)              # Gradient of -log D(fake) with respect to fake sample value.
fake_after_demo = fake_before_demo - lr_demo * grad_fake_demo               # Move fake samples toward higher discriminator scores.
d_fake_after_demo = sigmoid_demo(disc_slope_demo * fake_after_demo + disc_bias_demo) # Score fake samples after the generator update.
loss_g_after_demo = -np.mean(np.log(d_fake_after_demo + eps_demo))          # Recompute generator loss after the update.

log("real mean", round(float(real_demo.mean()), 3))                         # Print real distribution center.
log("fake mean before", round(float(fake_before_demo.mean()), 3))           # Print starting fake center.
log("fake mean after one G step", round(float(fake_after_demo.mean()), 3))  # Print moved fake center.
log("mean D(real)", round(float(d_real_demo.mean()), 3))                    # Print discriminator score on real samples.
log("mean D(fake) before", round(float(d_fake_before_demo.mean()), 3))      # Print discriminator score on initial fake samples.
log("mean D(fake) after", round(float(d_fake_after_demo.mean()), 3))        # Print discriminator score after the generator step.
log("D loss", round(float(loss_d_demo), 3))                                 # Print discriminator objective.
log("G loss before/after", (round(float(loss_g_before_demo), 3), round(float(loss_g_after_demo), 3))) # Print generator improvement.

bins_demo = np.linspace(-2.0, 3.3, 28)                                      # Shared histogram bins for all distributions.
plt.hist(real_demo, bins=bins_demo, density=True, alpha=0.55, label="real", color="steelblue") # Draw real data.
plt.hist(fake_before_demo, bins=bins_demo, density=True, alpha=0.45, label="fake before", color="salmon") # Draw fake samples before.
plt.hist(fake_after_demo, bins=bins_demo, density=True, alpha=0.45, label="fake after one G step", color="seagreen") # Draw fake samples after.
plt.xlabel("sample value")                                                  # Label the 1-D data axis.
plt.ylabel("density")                                                       # Label histogram density.
plt.title("GAN generator moves fake samples toward real-looking regions")   # Title the adversarial visualization.
plt.legend()                                                                # Explain histogram colors.
plt.show()                                                                  # Render the GAN plot.
```
▶ What you'll see: the generator step shifts fake samples toward the real distribution, raises $D(\text{fake})$, and lowers generator loss.

### Recap — what you just ran

- **ResNet** added a shortcut so the block learned only a residual correction and preserved gradient flow.
- **Inception** used parallel branches, a cheap **$1\times1$ bottleneck**, and channel concatenation.
- **GANs** trained a generator using feedback from a discriminator that scores real vs. fake samples.

Everything below (starting at **§1 Overview**) develops these same ideas with fuller architecture
examples, toy classifiers, and adversarial-training diagnostics.

---

## 1. Overview

Advanced CNN architectures reuse the same primitive operations from convolutional networks, but arrange them in smarter computational graphs. GANs learn by adversarial competition, ResNets learn deep transformations with skip connections, and Inception modules learn several receptive-field scales in parallel.

**One-line intuition:** ResNet says “learn a correction,” Inception says “try several filter sizes at once,” and GAN says “train a generator by trying to fool a discriminator.”

## 2. Key Idea

### ResNet: residual learning with a shortcut

A residual block does not ask stacked layers to learn a full mapping $H(x)$ from scratch. Instead, it asks the main path to learn a residual correction $F(x)$ and then adds the original input back:

$$
\boxed{y = g\big(x + F(x)\big)}
$$

In the notation often used for a two-layer residual block,

$$
\boxed{a^{[l+2]} = g\left(a^{[l]} + z^{[l+2]}\right)}.
$$

The shortcut creates an identity path for both activations and gradients. If the useful transformation is close to identity, the network can set $F(x)\approx 0$ and pass information forward instead of forcing every layer to relearn the same signal.

```text
Residual block pseudocode
Input x
main = Conv -> ReLU -> Conv applied to x
skip = x, or a 1×1 projection if channel counts differ
output = ReLU(skip + main)
Return output
```

### Inception: parallel branches plus $1\times1$ convolution

An Inception module applies several operations to the same input and concatenates the resulting channels:

$$
\operatorname{Inception}(x)=\operatorname{concat}\left(B_{1\times1}(x), B_{3\times3}(x), B_{5\times5}(x), B_{pool}(x)\right).
$$

The $1\times1$ convolution is a channel mixer. At each spatial location, it computes weighted sums across channels, so it can reduce channel count before expensive $3\times3$ or $5\times5$ filters:

$$
\text{params}(k\times k\text{ conv}) = k^2 C_{in} C_{out} + C_{out}.
$$

A bottleneck changes an expensive branch from $k^2 C_{in}C_{out}$ to $C_{in}C_b + k^2 C_bC_{out}$ with $C_b\ll C_{in}$.

```text
Inception module pseudocode
Input x with C channels
branch1 = 1×1 conv(x)
branch2 = 3×3 conv(1×1 bottleneck(x))
branch3 = 5×5 conv(1×1 bottleneck(x))
branch4 = 1×1 conv(maxpool(x))
output = concatenate branches along channel axis
Return output
```

### GAN: generator versus discriminator

A Generative Adversarial Network has two models. The generator $G(z)$ maps random noise $z$ to fake samples, while the discriminator $D(x)$ estimates whether a sample is real. The classical minimax objective is

$$
\min_G \max_D\; \mathbb{E}_{x\sim p_{data}}[\log D(x)] + \mathbb{E}_{z\sim p_z}[\log(1-D(G(z)))] .
$$

The discriminator improves by separating real from fake samples. The generator improves by making fake samples that the discriminator labels as real.

```text
GAN training pseudocode
Repeat for many small steps:
  Sample real data x
  Sample noise z and create fake data G(z)
  Update D to classify real as 1 and fake as 0
  Sample new noise z
  Update G so D(G(z)) moves toward 1
Return the trained generator and discriminator
```

GANs are useful when the goal is generation, ResNets are useful when the network needs many trainable transformations, and Inception modules are useful when features may appear at several spatial scales.

## 3. Hands-on Notebook

### Setup

Run this first. The install line is commented because Colab usually includes these packages; uncomment it only if your runtime is missing a dependency.

```python
# !pip -q install numpy matplotlib scikit-learn ipywidgets  # install only small CPU-friendly packages if the runtime is missing them.
import numpy as np  # use NumPy for every tensor, convolution, loss, and training loop in this CPU-only lesson.
import matplotlib.pyplot as plt  # use Matplotlib to visualize feature maps, losses, samples, and architecture tradeoffs.
from sklearn.datasets import load_digits  # use the built-in digits dataset so the notebook needs no internet download.
from sklearn.model_selection import train_test_split  # create tiny train/test splits for the miniature classifier examples.
from sklearn.metrics import confusion_matrix, accuracy_score  # summarize classifier predictions with familiar diagnostics.
try:  # try to import widgets so Colab can show live architecture sliders.
    from ipywidgets import interact, IntSlider, Dropdown  # expose interactive controls for filter counts and branch choices.
except ModuleNotFoundError:  # keep the notebook runnable in minimal Python environments without widgets installed.
    class _FallbackWidget:  # define a tiny widget stand-in that stores one default value.
        def __init__(self, value=None, **kwargs):  # accept the keyword style used by ipywidgets constructors.
            self.value = value  # keep the selected value so the fallback interact can call once.
    IntSlider = _FallbackWidget  # replace integer sliders with fallback value holders.
    Dropdown = _FallbackWidget  # replace dropdowns with fallback value holders.
    def interact(function, **controls):  # define a fallback that executes the interactive function once.
        values = {name: control.value for name, control in controls.items()}  # extract default values from each fallback control.
        return function(**values)  # call the function once so the example remains executable.
np.random.seed(230)  # seed the legacy NumPy generator for reproducible helper behavior.
RNG = np.random.default_rng(230)  # create a modern reproducible random generator for tensors and training batches.
plt.style.use("seaborn-v0_8-whitegrid")  # use a readable notebook plotting style.
EPS = 1e-8  # define a small constant to avoid log-of-zero and divide-by-zero in losses.
COLOR_CYCLE = plt.cm.tab10.colors  # use a stable color palette across examples.


def relu(x):  # define the standard CNN nonlinearity used by residual and classifier examples.
    return np.maximum(x, 0.0)  # keep positive activations and zero out negative activations.


def sigmoid(x):  # define the logistic function for the tiny GAN discriminator.
    return 1.0 / (1.0 + np.exp(-np.clip(x, -40.0, 40.0)))  # clip logits so exponentials stay numerically stable.


def softmax(logits):  # define a stable softmax for miniature classifiers.
    shifted = logits - logits.max(axis=1, keepdims=True)  # subtract the row maximum so exponentials do not overflow.
    exp_shifted = np.exp(shifted)  # exponentiate stabilized logits into positive scores.
    return exp_shifted / exp_shifted.sum(axis=1, keepdims=True)  # normalize each row into class probabilities.


def one_hot(y, num_classes):  # define one-hot encoding for cross-entropy training.
    encoded = np.zeros((len(y), num_classes))  # allocate a zero matrix with one column per class.
    encoded[np.arange(len(y)), y] = 1.0  # place a one at each observed class index.
    return encoded  # return the encoded label matrix.


def conv_param_count(kernel_size, in_channels, out_channels, use_bias=True):  # compute parameter count for one convolution layer.
    weights = kernel_size * kernel_size * in_channels * out_channels  # count every spatial weight for every input-output channel pair.
    biases = out_channels if use_bias else 0  # add one bias per output channel when biases are used.
    return weights + biases  # return total trainable parameters.


def conv2d_same(x, kernel, bias=0.0):  # implement a small same-padding convolution for H×W×C tensors and k×k×C kernels.
    k = kernel.shape[0]  # read the square kernel width.
    pad = k // 2  # compute symmetric padding so output height and width match input.
    padded = np.pad(x, ((pad, pad), (pad, pad), (0, 0)), mode="constant")  # pad only spatial dimensions.
    out = np.zeros((x.shape[0], x.shape[1]))  # allocate one output feature map for this filter.
    for i in range(x.shape[0]):  # slide the filter down each output row.
        for j in range(x.shape[1]):  # slide the filter across each output column.
            patch = padded[i:i + k, j:j + k, :]  # extract the local receptive field with all channels.
            out[i, j] = np.sum(patch * kernel) + bias  # multiply, sum, and add bias to produce one activation.
    return out  # return the feature map produced by one filter.


def conv_bank_same(x, kernels, biases=None):  # apply several same-padding filters to one H×W×C input.
    biases = np.zeros(kernels.shape[0]) if biases is None else biases  # use zero biases unless explicit biases are supplied.
    maps = [conv2d_same(x, kernels[f], biases[f]) for f in range(kernels.shape[0])]  # compute one feature map per filter.
    return np.stack(maps, axis=-1)  # stack feature maps into an H×W×F tensor.


def conv1x1(x, weights, bias=None):  # implement a 1×1 convolution as a channel-mixing matrix multiply at each pixel.
    bias = np.zeros(weights.shape[1]) if bias is None else bias  # use zero bias for each output channel by default.
    flat = x.reshape(-1, x.shape[-1])  # flatten spatial locations while preserving channels.
    mixed = flat @ weights + bias  # apply the same channel-mixing weights at every spatial location.
    return mixed.reshape(x.shape[0], x.shape[1], weights.shape[1])  # restore the spatial grid with new channel count.


def maxpool2d_same(x, size=3):  # implement same-size max pooling for simple Inception pool branches.
    pad = size // 2  # compute padding so output spatial size is preserved.
    padded = np.pad(x, ((pad, pad), (pad, pad), (0, 0)), mode="edge")  # edge-pad so border values remain meaningful.
    out = np.zeros_like(x)  # allocate a pooled tensor with the same shape as the input.
    for i in range(x.shape[0]):  # scan every output row.
        for j in range(x.shape[1]):  # scan every output column.
            patch = padded[i:i + size, j:j + size, :]  # extract a local window for all channels.
            out[i, j, :] = patch.max(axis=(0, 1))  # keep the strongest response in each channel.
    return out  # return pooled feature maps.


def plot_feature_grid(tensor, title, max_channels=8):  # draw up to several channels from an H×W×C tensor.
    channels = min(tensor.shape[-1], max_channels)  # cap the number of panels so figures remain readable.
    fig, axes = plt.subplots(1, channels, figsize=(2.4 * channels, 2.4))  # create one panel per displayed channel.
    axes = np.atleast_1d(axes)  # ensure axes is iterable even for a single channel.
    for c in range(channels):  # loop over displayed channels.
        axes[c].imshow(tensor[:, :, c], cmap="viridis")  # show one feature map as a heatmap.
        axes[c].set_title(f"ch {c}")  # label the channel index.
        axes[c].axis("off")  # hide ticks because feature-map coordinates are not the focus.
    fig.suptitle(title)  # add a shared title describing the tensor.
    plt.tight_layout()  # prevent titles from overlapping.
    plt.show()  # render the feature-map grid.


def make_synthetic_images(n=240, size=8, seed=230):  # create tiny offline image tensors with vertical, horizontal, and blob patterns.
    rng = np.random.default_rng(seed)  # create a local generator so this helper is reproducible.
    X = np.zeros((n, size, size, 1))  # allocate grayscale images with one channel.
    y = np.zeros(n, dtype=int)  # allocate integer labels for three toy classes.
    for i in range(n):  # fill each image one by one.
        cls = i % 3  # cycle classes so the dataset is balanced.
        image = rng.normal(0.0, 0.08, size=(size, size))  # start from low-amplitude Gaussian noise.
        if cls == 0:  # make class zero a vertical bar.
            image[:, size // 2 - 1:size // 2 + 1] += 1.0  # brighten two central columns.
        elif cls == 1:  # make class one a horizontal bar.
            image[size // 2 - 1:size // 2 + 1, :] += 1.0  # brighten two central rows.
        else:  # make class two a centered blob.
            yy, xx = np.mgrid[:size, :size]  # create coordinate grids for a Gaussian bump.
            image += np.exp(-((xx - size / 2) ** 2 + (yy - size / 2) ** 2) / 4.0)  # add a smooth center object.
        X[i, :, :, 0] = image  # store the generated grayscale image.
        y[i] = cls  # store the class label.
    return X, y  # return images and labels.


def extract_plain_features(images):  # build simple fixed CNN-like features without training convolution filters.
    vertical = np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=float)[:, :, None]  # define an edge detector for vertical contrast.
    horizontal = vertical.transpose(1, 0, 2)  # define a matching edge detector for horizontal contrast.
    blur = np.ones((3, 3, 1), dtype=float) / 9.0  # define a smoothing filter that captures blob intensity.
    kernels = np.stack([vertical, horizontal, blur], axis=0)  # combine filters into a small convolution bank.
    features = []  # collect one feature vector per image.
    for image in images:  # process each image independently.
        maps = relu(conv_bank_same(image, kernels))  # apply the filter bank and nonlinearity.
        vector = maps.mean(axis=(0, 1))  # global-average-pool each map into one scalar feature.
        features.append(vector)  # append the three pooled features.
    return np.vstack(features)  # return an N×3 feature matrix.


def extract_residual_features(images):  # build residual-style fixed features by adding filtered corrections to the input.
    sharpen = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=float)[:, :, None]  # define a sharpening residual filter.
    smooth = np.ones((3, 3, 1), dtype=float) / 9.0  # define a smoothing residual filter.
    kernels = np.stack([sharpen, smooth], axis=0)  # combine residual main-path filters.
    features = []  # collect residual feature vectors.
    for image in images:  # process each image independently.
        main = conv_bank_same(image, kernels)  # compute two main-path transformations.
        skip = np.repeat(image, repeats=2, axis=-1)  # project the one-channel input into two skip channels by repetition.
        out = relu(skip + 0.25 * main)  # add a scaled residual correction and apply ReLU.
        vector = np.concatenate([out.mean(axis=(0, 1)), out.max(axis=(0, 1))])  # summarize average and strongest responses.
        features.append(vector)  # append the pooled residual features.
    return np.vstack(features)  # return an N×4 feature matrix.


def extract_inception_features(images):  # build multi-scale fixed features from parallel branches.
    small = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]], dtype=float)[:, :, None]  # define a 3×3 small-scale edge filter.
    large = np.ones((5, 5, 1), dtype=float) / 25.0  # define a 5×5 large-scale averaging filter.
    features = []  # collect multi-branch feature vectors.
    for image in images:  # process each image independently.
        b1 = conv1x1(image, np.array([[1.0]]))  # keep an identity-like 1×1 branch.
        b3 = relu(conv2d_same(image, small)[:, :, None])  # compute a small receptive-field branch.
        b5 = conv2d_same(image, large)[:, :, None]  # compute a larger receptive-field branch.
        bp = maxpool2d_same(image, size=3)  # compute a pooling branch.
        merged = np.concatenate([b1, b3, b5, bp], axis=-1)  # concatenate branch channels like Inception.
        features.append(np.concatenate([merged.mean(axis=(0, 1)), merged.std(axis=(0, 1))]))  # summarize mean and variation per branch.
    return np.vstack(features)  # return an N×8 feature matrix.


def train_softmax_classifier(X_train, y_train, X_test, y_test, epochs=120, lr=0.4):  # train a tiny linear classifier on extracted features.
    classes = int(np.max(y_train)) + 1  # infer the number of classes from labels.
    Xtr = np.c_[X_train, np.ones(X_train.shape[0])]  # append a bias column to the training design matrix.
    Xte = np.c_[X_test, np.ones(X_test.shape[0])]  # append the same bias column to test features.
    W = RNG.normal(0.0, 0.05, size=(Xtr.shape[1], classes))  # initialize small classifier weights.
    Y = one_hot(y_train, classes)  # encode labels for cross-entropy.
    losses = []  # store loss values across epochs.
    accuracies = []  # store test accuracies across epochs.
    grad_norms = []  # store gradient norms as an optimization diagnostic.
    for epoch in range(epochs):  # run a short full-batch gradient descent loop.
        probs = softmax(Xtr @ W)  # compute class probabilities for all training samples.
        loss = -np.mean(np.sum(Y * np.log(probs + EPS), axis=1))  # compute multiclass cross-entropy.
        grad = Xtr.T @ (probs - Y) / Xtr.shape[0]  # compute the gradient of cross-entropy with respect to weights.
        W -= lr * grad  # update weights in the negative-gradient direction.
        pred = np.argmax(softmax(Xte @ W), axis=1)  # predict test labels using the current weights.
        losses.append(loss)  # record the current loss.
        accuracies.append(accuracy_score(y_test, pred))  # record test accuracy for learning curves.
        grad_norms.append(np.linalg.norm(grad, axis=0).mean())  # record average class-gradient norm.
    final_pred = np.argmax(softmax(Xte @ W), axis=1)  # compute final test predictions after training.
    return W, np.array(losses), np.array(accuracies), np.array(grad_norms), final_pred  # return model, curves, and predictions.


def make_ring(n=256, radius=2.0, noise=0.08, seed=230):  # create a 2-D ring distribution for a toy GAN example.
    rng = np.random.default_rng(seed)  # create a reproducible local generator.
    theta = rng.uniform(0.0, 2.0 * np.pi, size=n)  # sample angles uniformly around the circle.
    r = rng.normal(radius, noise, size=n)  # sample radii close to the target circle.
    return np.c_[r * np.cos(theta), r * np.sin(theta)]  # convert polar coordinates into 2-D points.


def make_modes(n=300, weights=(0.75, 0.2, 0.05), seed=230):  # create an imbalanced Gaussian mixture for mode-collapse diagnosis.
    rng = np.random.default_rng(seed)  # create a reproducible local generator.
    centers = np.array([[-2.0, 0.0], [2.0, 0.0], [0.0, 2.5]])  # define three separated modes.
    labels = rng.choice(3, size=n, p=np.array(weights) / np.sum(weights))  # sample modes with imbalance.
    points = centers[labels] + rng.normal(0.0, 0.25, size=(n, 2))  # add local Gaussian noise around each chosen center.
    return points, labels, centers  # return samples, true mode labels, and centers.


def discriminator_features(x):  # create nonlinear features for a 2-D discriminator.
    return np.c_[np.ones(len(x)), x[:, 0], x[:, 1], x[:, 0] ** 2, x[:, 1] ** 2, x[:, 0] * x[:, 1]]  # include bias, linear, and quadratic terms.


def simple_gan_train(real_sampler, steps=400, batch=96, seed=230, collapse_pressure=0.0):  # train a tiny differentiable toy GAN with a linear generator and logistic discriminator.
    rng = np.random.default_rng(seed)  # create a local generator for reproducible noise and batches.
    Wg = rng.normal(0.0, 0.35, size=(2, 2))  # initialize generator weights mapping 2-D noise to 2-D samples.
    bg = rng.normal(0.0, 0.05, size=2)  # initialize generator bias.
    wd = rng.normal(0.0, 0.05, size=6)  # initialize discriminator weights over quadratic features.
    d_losses = []  # store discriminator losses.
    g_losses = []  # store generator losses.
    snapshots = []  # store generated samples over time for visualization.
    for step in range(steps):  # alternate discriminator and generator updates.
        real = real_sampler(batch)  # sample a mini-batch of real data.
        z = rng.normal(0.0, 1.0, size=(batch, 2))  # sample generator noise.
        fake = z @ Wg + bg  # map noise to fake samples using the current generator.
        Xd = np.vstack([real, fake])  # combine real and fake samples for discriminator training.
        yd = np.r_[np.ones(batch), np.zeros(batch)]  # label real as one and fake as zero.
        phid = discriminator_features(Xd)  # compute discriminator features for the combined batch.
        pd = sigmoid(phid @ wd)  # compute discriminator real probabilities.
        grad_wd = phid.T @ (pd - yd) / len(yd)  # compute logistic-regression discriminator gradient.
        wd -= 0.18 * grad_wd  # update discriminator weights.
        z = rng.normal(0.0, 1.0, size=(batch, 2))  # sample fresh noise for the generator update.
        fake = z @ Wg + bg  # create fake points from current generator parameters.
        phif = discriminator_features(fake)  # compute discriminator features of fake points.
        pf = sigmoid(phif @ wd)  # compute how real the discriminator thinks fake points are.
        dlogit_dx0 = wd[1] + 2.0 * wd[3] * fake[:, 0] + wd[5] * fake[:, 1]  # differentiate discriminator logit with respect to fake x-coordinate.
        dlogit_dx1 = wd[2] + 2.0 * wd[4] * fake[:, 1] + wd[5] * fake[:, 0]  # differentiate discriminator logit with respect to fake y-coordinate.
        dloss_dx = -np.c_[dlogit_dx0, dlogit_dx1] * (1.0 - pf)[:, None] / batch  # compute generator non-saturating loss gradient through D.
        dloss_dx += collapse_pressure * (fake - fake.mean(axis=0, keepdims=True)) / batch  # optionally penalize spread to demonstrate collapse.
        grad_Wg = z.T @ dloss_dx  # backpropagate fake-point gradients into generator weights.
        grad_bg = dloss_dx.sum(axis=0)  # backpropagate fake-point gradients into generator bias.
        Wg -= 0.08 * grad_Wg  # update generator weights.
        bg -= 0.08 * grad_bg  # update generator bias.
        d_loss = -np.mean(yd * np.log(pd + EPS) + (1.0 - yd) * np.log(1.0 - pd + EPS))  # compute discriminator logistic loss.
        g_loss = -np.mean(np.log(pf + EPS))  # compute generator loss that rewards fooling D.
        d_losses.append(d_loss)  # record discriminator loss.
        g_losses.append(g_loss)  # record generator loss.
        if step in [0, steps // 4, steps // 2, steps - 1]:  # keep a few snapshots rather than every iteration.
            snapshots.append((step, fake.copy(), wd.copy()))  # store generated samples and discriminator state.
    return Wg, bg, wd, np.array(d_losses), np.array(g_losses), snapshots  # return trained parameters and diagnostics.
```

### Data — swappable sources

The notebook uses CPU-only, no-internet data. The `DATA_SOURCE` toggle can create tiny synthetic image tensors, load built-in handwritten digits, create a ring distribution for GANs, or create an imbalanced mixture where the GAN can collapse to a dominant mode.

```python
DATA_SOURCE = "synthetic_images"  # choose "synthetic_images", "digits", "ring", or "imbalanced_modes".

if DATA_SOURCE == "synthetic_images":  # use controllable 8×8 image tensors for CNN architecture mechanics.
    X_data, y_data = make_synthetic_images(n=240, size=8, seed=230)  # create vertical-bar, horizontal-bar, and blob images.
    data_description = "tiny synthetic 8×8 images with bars and blobs"  # describe the selected source.
elif DATA_SOURCE == "digits":  # use scikit-learn's built-in digits dataset without downloading anything.
    digits = load_digits()  # load 8×8 grayscale digit images bundled with scikit-learn.
    X_data = digits.images[..., None] / 16.0  # scale pixel values to roughly [0, 1] and add a channel axis.
    y_data = digits.target  # keep digit labels for toy classifier examples.
    data_description = "built-in sklearn digits, 8×8 grayscale"  # describe the selected source.
elif DATA_SOURCE == "ring":  # use a 2-D ring for GAN generator/discriminator examples.
    X_data = make_ring(n=300, radius=2.0, noise=0.08, seed=230)  # create real 2-D samples on a ring.
    y_data = np.zeros(len(X_data), dtype=int)  # provide dummy labels because GANs are unsupervised.
    data_description = "2-D ring distribution for GAN training"  # describe the selected source.
elif DATA_SOURCE == "imbalanced_modes":  # use a failure case for GAN mode coverage.
    X_data, y_data, mode_centers = make_modes(n=300, seed=230)  # create an imbalanced three-mode mixture.
    data_description = "imbalanced 2-D Gaussian mixture for mode-collapse diagnosis"  # describe the selected source.
else:  # reject unsupported toggles early.
    raise ValueError("DATA_SOURCE must be synthetic_images, digits, ring, or imbalanced_modes")  # explain the valid options.
print(f"Loaded {data_description} with shape {X_data.shape}.")  # show the selected dataset shape.
```

```python
if X_data.ndim == 4:  # branch for image tensors.
    fig, axes = plt.subplots(2, 6, figsize=(10, 4))  # create a small image gallery.
    for ax, idx in zip(axes.ravel(), range(12)):  # display the first twelve examples.
        ax.imshow(X_data[idx, :, :, 0], cmap="gray")  # show one grayscale image.
        ax.set_title(f"y={y_data[idx]}")  # label the hidden class for context.
        ax.axis("off")  # remove pixel ticks.
    plt.suptitle("Data preview: image tensors")  # add a gallery title.
    plt.tight_layout()  # keep panels from overlapping.
    plt.show()  # render the gallery.
else:  # branch for 2-D point data.
    plt.figure(figsize=(5.5, 5))  # create a scatter figure.
    plt.scatter(X_data[:, 0], X_data[:, 1], s=35, alpha=0.8, c=y_data, cmap="tab10")  # show 2-D samples and optional mode labels.
    plt.axis("equal")  # use equal axes so ring and mixture geometry are not distorted.
    plt.title("Data preview: 2-D toy distribution")  # label the data view.
    plt.xlabel("x1")  # label the first coordinate.
    plt.ylabel("x2")  # label the second coordinate.
    plt.show()  # render the point cloud.
```

▶ What you'll see: for `synthetic_images`, small 8×8 objects with different spatial patterns; for `ring`, points around a circle; for `imbalanced_modes`, one dominant cluster and two rarer clusters, which is a GAN failure case.

### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the advanced-CNN ideas from scratch, one small step at a time. Everything here uses only NumPy + Matplotlib and tiny inline data, so every residual, channel mix, parameter count, score, and loss is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us tiny arrays for residuals, channel mixing, sigmoid scores, and losses.
import matplotlib.pyplot as plt  # Matplotlib lets us visualize gradients, parameter savings, and real-vs-fake samples.
np.random.seed(22)  # fix randomness so every walkthrough printout and plot is reproducible.
```

#### 1. ResNet: learn a residual and keep a shortcut

A residual block writes the target mapping as $y=F(x)+x$ instead of asking stacked layers to learn the whole $H(x)$ directly. The shortcut carries the original signal forward, while the main path only has to learn the correction $F(x)=H(x)-x$. If the best mapping is close to identity, setting $F(x)\approx0$ is easier than relearning $x$ through many nonlinear layers.

```python
x_res_w = np.array([1.0, -2.0, 0.5, 3.0])  # create one tiny activation vector entering a residual block.
F_res_w = np.array([0.08, -0.04, 0.02, 0.05])  # create a small learned residual correction from the main path.
y_res_w = F_res_w + x_res_w  # add the shortcut so the block output is y=F(x)+x.
print("input x:", x_res_w)  # inspect the activation that bypasses the main path.
print("residual F(x):", F_res_w)  # inspect the small correction learned by the block.
print("output y=F(x)+x:", np.round(y_res_w, 3))  # inspect the shortcut-plus-correction output.
```
▶ What you'll see: the output is almost the input, with only small residual edits added coordinate by coordinate.

```python
F_zero_w = np.zeros_like(x_res_w)  # make the residual path exactly zero to test the identity case.
y_identity_w = F_zero_w + x_res_w  # add the shortcut to see what happens when F(x)=0.
identity_error_w = np.max(np.abs(y_identity_w - x_res_w))  # measure whether the block changed the input at all.
print("zero residual output:", y_identity_w)  # inspect the output when the main path learns nothing.
print("max identity error:", identity_error_w)  # verify that the shortcut passes x through exactly.
```
▶ What you'll see: with $F(x)=0$, the residual block becomes the identity map.

The key gradient difference is that a residual block has derivative $\frac{dy}{dx}=\frac{dF}{dx}+1$. Even when the main-path derivative is small, the shortcut contributes a direct $+1$ route for gradient flow, so backpropagation is less likely to shrink toward zero.

```python
layers_res_w = np.arange(1, 31)  # represent depth from 1 to 30 repeated blocks.
plain_slope_w = 0.82  # choose a small per-layer derivative for a plain stack.
residual_slope_w = 1.0 + 0.02  # choose a shortcut derivative plus a small residual derivative.
grad_plain_w = plain_slope_w ** layers_res_w  # multiply plain derivatives through depth, causing exponential shrinkage.
grad_skip_w = residual_slope_w ** layers_res_w  # multiply residual derivatives that include the shortcut path.
print("plain gradient after 30 layers:", round(float(grad_plain_w[-1]), 5))  # inspect the vanishing plain-stack gradient.
print("skip gradient after 30 layers:", round(float(grad_skip_w[-1]), 5))  # inspect the shortcut-preserved gradient scale.
```
▶ What you'll see: the plain stack's gradient shrinks rapidly, while the shortcut path keeps the gradient much larger.

```python
plt.figure(figsize=(6.0, 4.0))  # create a compact gradient-flow comparison figure.
plt.plot(layers_res_w, grad_plain_w, marker="o", label="plain stack")  # plot the shrinking gradient without a shortcut.
plt.plot(layers_res_w, grad_skip_w, marker="s", label="residual shortcut")  # plot the gradient path that includes the identity shortcut.
plt.axhline(1.0, color="black", linewidth=1.0, linestyle="--", label="unit gradient")  # mark the scale of an unchanged gradient.
plt.xlabel("number of layers")  # label the depth axis.
plt.ylabel("relative gradient magnitude")  # label the backpropagated-gradient axis.
plt.title("1: ResNet shortcut keeps gradients flowing")  # title the plot with the walkthrough number.
plt.legend()  # show which curve is plain and which uses a shortcut.
plt.show()  # render the gradient-flow figure.
```
▶ What you'll see: the plain curve decays toward zero, while the residual curve stays near a useful scale.

*Why it's done this way: the model only has to learn the difference from the identity, and the shortcut gives both activations and gradients a low-resistance path through deep networks.*

#### 2. Inception: mix channels cheaply with a $1\times1$ bottleneck

An Inception module uses parallel branches so the network can test several feature scales at the same spatial location. A $1\times1$ convolution is the cheapest branch and also a bottleneck: at each pixel it performs a small linear combination across channels, reducing channel count before expensive $3\times3$ or $5\times5$ filters. That makes the parameter count drop from $k\times k\times C_{in}\times C_{out}$ to $C_{in}\times C_b + k\times k\times C_b\times C_{out}$.

```python
image_inc_w = np.array([[[1.0, 10.0, 100.0], [2.0, 20.0, 200.0]], [[3.0, 30.0, 300.0], [4.0, 40.0, 400.0]]])  # create a 2x2 image with 3 channels.
weights_1x1_w = np.array([[0.5, 0.1], [0.05, -0.2], [0.01, 0.3]])  # create 3 input-channel by 2 output-channel mixing weights.
bias_1x1_w = np.array([0.0, 1.0])  # add one bias per output channel.
mixed_inc_w = image_inc_w @ weights_1x1_w + bias_1x1_w  # apply a 1x1 convolution as per-pixel channel mixing.
print("input shape HxWxC:", image_inc_w.shape)  # inspect the starting spatial and channel dimensions.
print("1x1 weights shape Cin x Cout:", weights_1x1_w.shape)  # inspect the channel-mixing matrix shape.
print("mixed output shape:", mixed_inc_w.shape)  # inspect the reduced channel count after the 1x1 convolution.
print("top-left mixed pixel:", np.round(mixed_inc_w[0, 0], 2))  # inspect one pixel's two channel mixtures.
```
▶ What you'll see: each pixel keeps its spatial position, but its three channels are mixed into two new channels.

```python
branch_1x1_w = mixed_inc_w[..., :1]  # make a tiny 1x1-style branch with one output channel.
branch_3x3_w = np.mean(image_inc_w, axis=2, keepdims=True)  # mimic a larger-filter branch by averaging channels into one map.
branch_pool_w = np.max(image_inc_w, axis=2, keepdims=True)  # mimic a pooling branch by keeping the strongest channel value.
inception_out_w = np.concatenate([branch_1x1_w, branch_3x3_w, branch_pool_w], axis=2)  # concatenate parallel branch outputs along channels.
print("branch shapes:", branch_1x1_w.shape, branch_3x3_w.shape, branch_pool_w.shape)  # inspect every parallel branch shape.
print("concatenated Inception shape:", inception_out_w.shape)  # inspect the channel-stacked module output.
```
▶ What you'll see: parallel branches preserve the same height and width, then concatenate their feature channels.

```python
k_inc_w = 5  # choose a large 5x5 convolution to make parameter savings visible.
Cin_inc_w = 64  # choose the number of input channels entering a branch.
Cb_inc_w = 16  # choose a smaller bottleneck channel count produced by a 1x1 convolution.
Cout_inc_w = 128  # choose the number of output channels from the expensive convolution.
params_direct_w = k_inc_w * k_inc_w * Cin_inc_w * Cout_inc_w + Cout_inc_w  # count parameters for a direct 5x5 convolution.
params_bottleneck_w = Cin_inc_w * Cb_inc_w + Cb_inc_w + k_inc_w * k_inc_w * Cb_inc_w * Cout_inc_w + Cout_inc_w  # count 1x1 bottleneck plus 5x5 parameters.
savings_w = 100.0 * (1.0 - params_bottleneck_w / params_direct_w)  # convert the parameter reduction into a percentage.
print("direct 5x5 params:", params_direct_w)  # inspect the expensive baseline parameter count.
print("1x1 bottleneck + 5x5 params:", params_bottleneck_w)  # inspect the reduced parameter count.
print("parameter savings %:", round(float(savings_w), 1))  # inspect how much the bottleneck saves.
```
▶ What you'll see: the bottleneck branch uses far fewer parameters because the large filter sees only $C_b$ channels.

```python
plt.figure(figsize=(5.5, 4.0))  # create a compact bar chart for parameter counts.
plt.bar(["direct 5x5", "1x1 + 5x5"], [params_direct_w, params_bottleneck_w], color=["tab:red", "tab:green"])  # compare direct and bottlenecked branches.
plt.ylabel("parameter count")  # label the vertical axis with the counted quantity.
plt.title("2: Inception bottleneck reduces parameters")  # title the plot with the walkthrough number.
plt.show()  # render the parameter-count chart.
```
▶ What you'll see: the bottleneck bar is much shorter than the direct large-convolution bar.

*Why it's done this way: $1\times1$ convolutions are cheap channel mixers because they use no spatial window, so Inception can reduce channels first and spend expensive spatial filters only on a compact representation.*

#### 3. GAN: train a generator against a discriminator

A GAN has a generator $G(z)$ that turns noise into fake samples and a discriminator $D(x)$ that estimates $P(\text{real}\mid x)$. The discriminator maximizes real scores and minimizes fake scores, while the generator changes its samples so $D(G(z))$ looks real. A guarded binary-cross-entropy version is:

$$
\mathcal{L}_D=-\frac{1}{m}\sum_i\left[\log D(x_i)+\log(1-D(G(z_i)))\right],
\qquad
\mathcal{L}_G=-\frac{1}{m}\sum_i\log D(G(z_i)).
$$

```python
rng_gan_w = np.random.default_rng(22)  # create a local random generator so this section is reproducible.
real_gan_w = rng_gan_w.normal(loc=2.0, scale=0.35, size=80)  # sample a tiny one-dimensional real distribution.
z_gan_w = rng_gan_w.normal(loc=0.0, scale=1.0, size=80)  # sample generator noise values.
g_mu_w = -1.2  # start the generator mean far from the real mean.
g_scale_w = 0.25  # set a small generator scale for fake-sample spread.
fake_gan_w = g_mu_w + g_scale_w * z_gan_w  # map noise to fake samples with a simple affine generator.
print("real mean/std:", round(float(real_gan_w.mean()), 3), round(float(real_gan_w.std()), 3))  # inspect the real distribution summary.
print("fake mean/std before:", round(float(fake_gan_w.mean()), 3), round(float(fake_gan_w.std()), 3))  # inspect the generator's starting distribution summary.
```
▶ What you'll see: the fake samples begin far to the left of the real samples.

```python
def sigmoid_gan_w(t_w):  # define the discriminator's probability squashing function.
    return 1.0 / (1.0 + np.exp(-t_w))  # convert a real-valued score into a value between 0 and 1.

disc_a_w = 1.4  # choose a positive discriminator slope so larger x looks more real.
disc_b_w = -0.8  # choose an intercept that places the decision region near the toy data.
eps_gan_w = 1e-8  # guard all logarithms from log(0).
D_real_w = sigmoid_gan_w(disc_a_w * real_gan_w + disc_b_w)  # compute discriminator probabilities for real samples.
D_fake_w = sigmoid_gan_w(disc_a_w * fake_gan_w + disc_b_w)  # compute discriminator probabilities for fake samples.
loss_D_w = -np.mean(np.log(np.clip(D_real_w, eps_gan_w, 1.0)) + np.log(np.clip(1.0 - D_fake_w, eps_gan_w, 1.0)))  # compute discriminator loss.
loss_G_w = -np.mean(np.log(np.clip(D_fake_w, eps_gan_w, 1.0)))  # compute non-saturating generator loss.
print("mean D(real):", round(float(D_real_w.mean()), 3))  # inspect how real the discriminator thinks real samples are.
print("mean D(fake):", round(float(D_fake_w.mean()), 3))  # inspect how real the discriminator thinks fake samples are.
print("loss_D, loss_G:", round(float(loss_D_w), 3), round(float(loss_G_w), 3))  # inspect both adversarial losses.
```
▶ What you'll see: $D(\text{real})$ is high, $D(\text{fake})$ is low, and the generator loss is large.

The generator update follows the loss gradient through the fixed discriminator. For $D(x)=\sigma(ax+b)$ and $\mathcal{L}_G=-\log D(x)$, the derivative with respect to a fake sample is $-a(1-D(x))$; subtracting that gradient moves samples in the direction that increases $D(x)$.

```python
lr_gan_w = 0.9  # choose a visible one-step learning rate for the fake samples.
grad_fake_w = -disc_a_w * (1.0 - D_fake_w)  # compute d[-log D(fake)]/d fake for the fixed discriminator.
fake_step_w = fake_gan_w - lr_gan_w * grad_fake_w  # move fake samples one adversarial step toward higher discriminator scores.
D_fake_step_w = sigmoid_gan_w(disc_a_w * fake_step_w + disc_b_w)  # score the moved fake samples with the same discriminator.
loss_G_step_w = -np.mean(np.log(np.clip(D_fake_step_w, eps_gan_w, 1.0)))  # recompute generator loss after the step.
print("fake mean before/after:", round(float(fake_gan_w.mean()), 3), round(float(fake_step_w.mean()), 3))  # inspect movement toward the real mean.
print("mean D(fake) before/after:", round(float(D_fake_w.mean()), 3), round(float(D_fake_step_w.mean()), 3))  # inspect whether fake samples look more real.
print("generator loss before/after:", round(float(loss_G_w), 3), round(float(loss_G_step_w), 3))  # inspect whether the generator objective improved.
```
▶ What you'll see: one generator step shifts fake samples rightward, raises $D(\text{fake})$, and lowers generator loss.

```python
bins_gan_w = np.linspace(-2.0, 3.2, 24)  # create shared histogram bins so real and fake distributions are comparable.
plt.figure(figsize=(6.2, 4.0))  # create a compact distribution comparison figure.
plt.hist(real_gan_w, bins=bins_gan_w, alpha=0.55, density=True, label="real", color="tab:blue")  # plot real data density.
plt.hist(fake_gan_w, bins=bins_gan_w, alpha=0.45, density=True, label="fake before", color="tab:red")  # plot fake density before the generator step.
plt.hist(fake_step_w, bins=bins_gan_w, alpha=0.45, density=True, label="fake after one G step", color="tab:green")  # plot fake density after one adversarial step.
plt.xlabel("one-dimensional sample value")  # label the sample axis.
plt.ylabel("density")  # label the histogram density axis.
plt.title("3: GAN real vs fake distributions")  # title the plot with the walkthrough number.
plt.legend()  # show which histogram belongs to real, before, and after samples.
plt.show()  # render the GAN histogram comparison.
```
▶ What you'll see: the post-step fake histogram moves closer to the real histogram, though it is not fully matched after one step.

*Why it's done this way: the discriminator supplies a learned training signal for samples that have no labels, and the generator follows that signal to make fakes that increasingly fool the discriminator while the discriminator learns to catch them.*

### 🟢 Basics (warm-up)

#### B1. Apply one $1\times1$ convolution to a tiny volume

**Goal.** See that a $1\times1$ convolution mixes channels independently at each pixel.  
**We'll build this in 3 steps:** create a tiny volume, apply one channel-weight vector, and visualize the output heatmap.

```python
volume_b1 = np.array([[[1.0, 2.0, 0.0], [0.0, 1.0, 3.0]], [[2.0, 0.0, 1.0], [1.0, 1.0, 1.0]]])  # create a 2×2×3 input volume.
weights_b1 = np.array([[0.5], [-1.0], [2.0]])  # define one 1×1 filter with one weight per input channel.
bias_b1 = np.array([0.25])  # define one scalar bias for the output channel.
output_b1 = conv1x1(volume_b1, weights_b1, bias_b1)  # apply the same channel-weighted sum at every spatial location.
print("input shape:", volume_b1.shape)  # print the input tensor shape.
print("output shape:", output_b1.shape)  # print the output tensor shape after channel mixing.
print("top-left weighted sum:", volume_b1[0, 0] @ weights_b1[:, 0] + bias_b1[0])  # audit one pixel calculation.
```

▶ What you'll see: the spatial grid stays 2×2, but three input channels become one mixed output channel.

```python
plt.figure(figsize=(4, 3.5))  # create a compact heatmap figure.
plt.imshow(output_b1[:, :, 0], cmap="magma")  # visualize the single output channel as a heatmap.
plt.colorbar(label="1×1 response")  # add a colorbar so weighted sums are readable.
plt.title("B1: one 1×1 convolution output")  # title the basic operation.
plt.xticks([0, 1])  # show the two column positions.
plt.yticks([0, 1])  # show the two row positions.
plt.show()  # render the heatmap.
```

▶ What you'll see: four output values, one for each spatial location, computed from channel weights only.

👀 **Takeaway.** A $1\times1$ convolution changes the channel representation without looking at neighboring pixels.

#### B2. Count parameters of one convolution layer

**Goal.** Compute the trainable parameters in a convolution layer before building bigger modules.

```python
kernel_b2 = 3  # choose a 3×3 spatial kernel.
in_channels_b2 = 16  # assume the input tensor has sixteen channels.
out_channels_b2 = 32  # ask the layer to produce thirty-two output channels.
params_b2 = conv_param_count(kernel_b2, in_channels_b2, out_channels_b2, use_bias=True)  # compute weights plus biases.
print(f"formula: {kernel_b2}×{kernel_b2}×{in_channels_b2}×{out_channels_b2} + {out_channels_b2}")  # print the exact formula.
print("parameter count:", params_b2)  # print the numeric total.
```

▶ What you'll see: a 3×3 conv from 16 to 32 channels has 4,640 parameters including bias.

```python
parts_b2 = [kernel_b2 * kernel_b2 * in_channels_b2 * out_channels_b2, out_channels_b2]  # separate weights and biases.
plt.figure(figsize=(5, 3.5))  # create a small bar chart.
plt.bar(["weights", "biases"], parts_b2, color=["steelblue", "orange"])  # compare the dominant weight count with small bias count.
plt.title("B2: convolution parameter count")  # title the parameter-count primitive.
plt.ylabel("trainable parameters")  # label the count axis.
plt.show()  # render the bar chart.
```

▶ What you'll see: almost all parameters come from kernel weights, not biases.

👀 **Takeaway.** Channel counts and kernel size dominate convolution cost.

#### B3. Add a residual shortcut $x+F(x)$

**Goal.** Perform the central ResNet operation on tiny feature maps.

```python
x_b3 = np.array([[0.2, 0.5], [1.0, -0.4]])  # create a tiny skip-path activation map.
F_b3 = np.array([[0.1, -0.2], [0.3, 0.6]])  # create a tiny learned residual correction.
sum_b3 = x_b3 + F_b3  # add the shortcut and residual branch elementwise.
y_b3 = relu(sum_b3)  # apply the output activation after the residual addition.
print("x:\n", x_b3)  # print the shortcut map.
print("F(x):\n", F_b3)  # print the residual correction.
print("ReLU(x + F(x)):\n", y_b3)  # print the residual block output.
```

▶ What you'll see: the output keeps the skip information but shifts it by the learned correction.

```python
fig, axes = plt.subplots(1, 3, figsize=(9, 3))  # create side-by-side heatmaps.
for ax, matrix, title in zip(axes, [x_b3, F_b3, y_b3], ["skip x", "residual F(x)", "output ReLU(x+F(x))"]):  # loop over the three maps.
    im = ax.imshow(matrix, cmap="coolwarm", vmin=-1.0, vmax=1.3)  # visualize signed values consistently.
    ax.set_title(title)  # label each stage.
    ax.axis("off")  # remove ticks for a cleaner comparison.
fig.colorbar(im, ax=axes.ravel().tolist(), shrink=0.75)  # add one shared colorbar.
plt.show()  # render the residual-add visual.
```

▶ What you'll see: the final heatmap is not a brand-new signal; it is the skip map plus a correction.

👀 **Takeaway.** A residual block can preserve information by default and only learn changes that help.


#### B4. Concatenate two feature maps like an Inception module

**Goal.** Join parallel branch outputs along the channel axis.

```python
branch_a_b4 = np.ones((2, 2, 1))  # create a first branch with one channel.
branch_b_b4 = np.full((2, 2, 2), 2.0)  # create a second branch with two channels.
concat_b4 = np.concatenate([branch_a_b4, branch_b_b4], axis=-1)  # concatenate channels while keeping height and width.
print("branch A shape:", branch_a_b4.shape)  # show the first branch shape.
print("branch B shape:", branch_b_b4.shape)  # show the second branch shape.
print("concatenated shape:", concat_b4.shape)  # show the combined channel count.
```

▶ What you'll see: a 2×2×1 tensor and a 2×2×2 tensor become one 2×2×3 tensor.

```python
plot_feature_grid(concat_b4, "B4: concatenated Inception-style channels", max_channels=3)  # visualize each output channel.
```

▶ What you'll see: the branch outputs remain separate channels in one larger tensor.

👀 **Takeaway.** Inception combines parallel features by stacking channels, not by adding values.

#### B5. Tiny generator forward pass from noise to vector

**Goal.** Run one miniature GAN generator step with a linear map and tanh output.

```python
z_b5 = np.array([0.4, -1.0])  # create a two-dimensional noise vector.
Wg_b5 = np.array([[1.0, -0.5, 0.3], [0.2, 0.7, -1.2]])  # map noise to three generated features.
bg_b5 = np.array([0.1, -0.2, 0.0])  # add a generator bias.
logits_b5 = z_b5 @ Wg_b5 + bg_b5  # compute the generator's pre-activation output.
fake_b5 = np.tanh(logits_b5)  # squash generated values into a bounded range.
print("noise z:", z_b5)  # print the input noise.
print("generator logits:", logits_b5)  # print the linear output.
print("fake sample:", fake_b5)  # print the generated vector.
```

▶ What you'll see: fixed noise becomes a structured fake vector through learned weights.

```python
plt.figure(figsize=(5, 3))  # create a small bar chart for the fake vector.
plt.bar(["feature 0", "feature 1", "feature 2"], fake_b5, color="purple")  # plot generated feature values.
plt.ylim(-1.0, 1.0)  # show the tanh output range.
plt.title("B5 tiny generator output")  # title the generator primitive.
plt.show()  # render the bar chart.
```

▶ What you'll see: tanh keeps each generated feature between −1 and 1.

👀 **Takeaway.** A generator transforms random noise into a sample-shaped vector.

#### B6. Discriminator score with a sigmoid

**Goal.** Convert one discriminator logit into a real/fake probability.

```python
sample_b6 = np.array([0.3, -0.4, 0.8])  # create a toy sample vector.
Wd_b6 = np.array([1.2, -0.7, 0.5])  # define discriminator weights.
bd_b6 = -0.1  # define a discriminator bias.
logit_b6 = float(sample_b6 @ Wd_b6 + bd_b6)  # compute the real/fake logit.
score_b6 = float(sigmoid(logit_b6))  # squash the logit into a probability-like score.
print(f"discriminator logit = {logit_b6:.3f}")  # print the raw score.
print(f"D(x) = sigmoid(logit) = {score_b6:.3f}")  # print the probability.
```

▶ What you'll see: a positive logit produces a score above 0.5.

```python
xs_b6 = np.linspace(-5, 5, 200)  # create logit values for the sigmoid curve.
plt.figure(figsize=(5, 3.5))  # create a compact curve plot.
plt.plot(xs_b6, sigmoid(xs_b6), label="sigmoid")  # draw the discriminator squashing function.
plt.scatter([logit_b6], [score_b6], s=90, color="crimson", label="sample score")  # mark the toy sample.
plt.xlabel("logit")  # label the x-axis.
plt.ylabel("D(x)")  # label the y-axis.
plt.title("B6 discriminator score")  # title the plot.
plt.legend()  # identify curve and sample.
plt.show()  # render the sigmoid plot.
```

▶ What you'll see: the sigmoid maps any real-valued evidence into the interval (0, 1).

👀 **Takeaway.** The discriminator's final sigmoid turns evidence into a realness score.

#### B7. ReLU on a small activation volume

**Goal.** Apply the CNN nonlinearity elementwise to a tiny volume.

```python
volume_b7 = np.array([[[-1.0, 0.5], [2.0, -0.2]], [[0.0, -3.0], [1.5, 0.7]]])  # create a 2×2×2 activation volume.
relu_b7 = relu(volume_b7)  # zero out negative activations.
print("before ReLU:\n", volume_b7)  # print raw activations.
print("after ReLU:\n", relu_b7)  # print rectified activations.
```

▶ What you'll see: negative entries become zero while positive entries are unchanged.

```python
plot_feature_grid(relu_b7, "B7: ReLU output volume", max_channels=2)  # visualize the rectified channels.
```

▶ What you'll see: only positive evidence survives in the output maps.

👀 **Takeaway.** ReLU is an elementwise gate that keeps positive activations.

#### B8. Parameter savings from a $1\times1$ bottleneck

**Goal.** Compare an expensive convolution branch with and without channel reduction.

```python
in_b8 = 64  # start with sixty-four input channels.
bottleneck_b8 = 16  # reduce to sixteen channels before the expensive filter.
out_b8 = 32  # produce thirty-two output channels.
direct_b8 = conv_param_count(3, in_b8, out_b8, use_bias=False)  # count a direct 3×3 branch.
with_bottleneck_b8 = conv_param_count(1, in_b8, bottleneck_b8, use_bias=False) + conv_param_count(3, bottleneck_b8, out_b8, use_bias=False)  # count 1×1 reduce plus 3×3 conv.
saved_b8 = direct_b8 - with_bottleneck_b8  # compute saved parameters.
print("direct 3×3 params:", direct_b8)  # print direct cost.
print("1×1 bottleneck + 3×3 params:", with_bottleneck_b8)  # print bottleneck cost.
print("parameters saved:", saved_b8)  # print savings.
```

▶ What you'll see: reducing channels first greatly lowers the 3×3 parameter count.

```python
plt.figure(figsize=(5, 3.5))  # create a comparison chart.
plt.bar(["direct", "bottleneck"], [direct_b8, with_bottleneck_b8], color=["gray", "green"])  # compare parameter counts.
plt.ylabel("parameters")  # label the count axis.
plt.title("B8 bottleneck parameter savings")  # title the savings plot.
plt.show()  # render the chart.
```

▶ What you'll see: the bottleneck branch is much smaller.

👀 **Takeaway.** A $1\times1$ bottleneck is cheap and can make later spatial filters cheaper.

#### B9. Batch-normalize one activation value

**Goal.** Normalize a single activation using a batch mean, variance, scale, and shift.

```python
x_b9 = 3.0  # choose one activation value from a batch.
mean_b9 = 2.0  # use the batch mean for this channel.
var_b9 = 0.25  # use the batch variance for this channel.
gamma_b9 = 1.5  # choose a learned scale.
beta_b9 = -0.5  # choose a learned shift.
normalized_b9 = (x_b9 - mean_b9) / np.sqrt(var_b9 + EPS)  # standardize the activation.
y_b9 = gamma_b9 * normalized_b9 + beta_b9  # apply learned scale and shift.
print(f"standardized value = {normalized_b9:.3f}")  # print normalized activation.
print(f"batch-norm output = {y_b9:.3f}")  # print final batch-normalized value.
```

▶ What you'll see: batch norm first standardizes, then lets the layer learn a new scale and shift.

```python
plt.figure(figsize=(5, 3))  # create a tiny before/after chart.
plt.bar(["raw x", "standardized", "BN output"], [x_b9, normalized_b9, y_b9], color=["steelblue", "orange", "green"])  # compare the three values.
plt.title("B9 one batch-norm calculation")  # title the normalization primitive.
plt.show()  # render the chart.
```

▶ What you'll see: the final value is not necessarily zero-mean because $\gamma$ and $\beta$ are learned.

👀 **Takeaway.** Batch norm is standardization followed by a learnable affine transform.

#### B10. Global average pool a feature map

**Goal.** Collapse each channel to one average value before classification.

```python
feature_b10 = np.array([[[1.0, 2.0], [3.0, 0.0]], [[5.0, 4.0], [7.0, 6.0]]])  # create a 2×2×2 feature tensor.
gap_b10 = feature_b10.mean(axis=(0, 1))  # average over height and width for each channel.
print("feature tensor shape:", feature_b10.shape)  # print the input shape.
print("global average pooled vector:", gap_b10)  # print one value per channel.
```

▶ What you'll see: a spatial feature map becomes a compact channel summary vector.

```python
plt.figure(figsize=(5, 3))  # create a small bar chart.
plt.bar(["channel 0", "channel 1"], gap_b10, color="teal")  # show channel averages.
plt.ylabel("average activation")  # label the average axis.
plt.title("B10 global average pooling")  # title the pooling primitive.
plt.show()  # render the pooled vector.
```

▶ What you'll see: each output is the mean activation over the whole spatial grid.

👀 **Takeaway.** Global average pooling removes spatial dimensions while preserving channel summaries.

### 🟡 Easy Examples

#### E1. Residual block forward pass on tiny feature maps

**Goal.** Build a small residual block forward pass and inspect the main path, skip path, addition, and activation.  
**Data source.** Synthetic 8×8 image tensor.  
**We'll build this in 5 steps:** choose an image, build filters, compute the main path, add the skip path, and visualize the activated output.

```python
X_e1, y_e1 = make_synthetic_images(n=12, size=8, seed=231)  # create a small image set for residual mechanics.
x_e1 = X_e1[2]  # choose one blob-like image as the residual-block input.
plot_feature_grid(x_e1, "E1 step 1: input image as one channel", max_channels=1)  # display the input feature map.
```

▶ What you'll see: one small grayscale object that will flow through both the main path and the shortcut.

```python
edge_e1 = np.array([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]], dtype=float)[:, :, None] / 8.0  # define a normalized edge-like filter.
blur_e1 = np.ones((3, 3, 1), dtype=float) / 9.0  # define a blur filter for a second main-path feature.
kernels_e1 = np.stack([edge_e1, blur_e1], axis=0)  # stack filters into a two-channel main path.
main_e1 = conv_bank_same(x_e1, kernels_e1)  # compute the residual branch output before activation.
print("main-path shape:", main_e1.shape)  # show that the main path has two channels.
plot_feature_grid(main_e1, "E1 step 2: main path F(x) before activation")  # visualize main-path channels.
```

▶ What you'll see: one channel emphasizes edges, while another smooths the object.

```python
skip_e1 = np.repeat(x_e1, repeats=2, axis=-1)  # project one input channel to two skip channels by channel repetition.
preact_e1 = skip_e1 + 0.5 * main_e1  # add a scaled residual correction to the skip tensor.
print("skip shape:", skip_e1.shape)  # confirm that skip and main tensors have matching shape.
print("pre-activation min/max:", np.round(preact_e1.min(), 3), np.round(preact_e1.max(), 3))  # inspect the residual-add value range.
plot_feature_grid(preact_e1, "E1 step 3: skip + F(x) before ReLU")  # display the residual sum.
```

▶ What you'll see: the residual sum keeps the input structure while sharpening or smoothing it by channel.

```python
out_e1 = relu(preact_e1)  # apply ReLU to the residual-add tensor.
metric_e1 = float(np.mean(out_e1 > 0.0))  # measure the fraction of active output units.
plot_feature_grid(out_e1, f"E1 final: activated residual output, active={metric_e1:.2f}")  # visualize the block output.
print("fraction of active units:", round(metric_e1, 3))  # print a simple activation metric.
```

▶ What you'll see: negative residual sums are clipped, while positive skip-corrected features pass forward.

👀 **Takeaway.** The block output has the same spatial shape as the input, but carries richer channel information after $x+F(x)$.

#### E2. Plain CNN vs small ResNet on digits

**Goal.** Compare a plain fixed-feature CNN-style classifier with a residual-feature classifier on a tiny offline dataset.  
**Data source.** Built-in `sklearn digits` 8×8 images.  
**We'll build this in 6 steps:** load digits, extract plain features, extract residual features, train classifiers, plot curves, and inspect confusion matrices.

```python
digits_e2 = load_digits()  # load offline handwritten digits.
images_e2 = digits_e2.images[..., None] / 16.0  # scale images to [0, 1] and add a channel dimension.
labels_e2 = digits_e2.target  # keep digit labels for supervised toy evaluation.
small_mask_e2 = labels_e2 < 5  # keep five classes so the CPU-only classifier is tiny.
images_e2 = images_e2[small_mask_e2][:500]  # use a small subset for quick notebook execution.
labels_e2 = labels_e2[small_mask_e2][:500]  # keep matching labels for the subset.
X_train_img_e2, X_test_img_e2, y_train_e2, y_test_e2 = train_test_split(images_e2, labels_e2, test_size=0.3, random_state=230, stratify=labels_e2)  # create a reproducible split.
print("train images:", X_train_img_e2.shape, "test images:", X_test_img_e2.shape)  # show the dataset size.
```

```python
plain_train_e2 = extract_plain_features(X_train_img_e2)  # extract simple convolution-bank features from training images.
plain_test_e2 = extract_plain_features(X_test_img_e2)  # extract the same features from test images.
res_train_e2 = extract_residual_features(X_train_img_e2)  # extract residual-style features from training images.
res_test_e2 = extract_residual_features(X_test_img_e2)  # extract residual-style features from test images.
print("plain feature shape:", plain_train_e2.shape)  # report plain feature dimensionality.
print("residual feature shape:", res_train_e2.shape)  # report residual feature dimensionality.
```

```python
plain_W_e2, plain_loss_e2, plain_acc_e2, plain_grad_e2, plain_pred_e2 = train_softmax_classifier(plain_train_e2, y_train_e2, plain_test_e2, y_test_e2, epochs=140, lr=0.35)  # train the plain-feature classifier.
res_W_e2, res_loss_e2, res_acc_e2, res_grad_e2, res_pred_e2 = train_softmax_classifier(res_train_e2, y_train_e2, res_test_e2, y_test_e2, epochs=140, lr=0.35)  # train the residual-feature classifier.
print("plain final accuracy:", round(plain_acc_e2[-1], 3))  # print the plain model's final accuracy.
print("residual final accuracy:", round(res_acc_e2[-1], 3))  # print the residual model's final accuracy.
```

```python
plt.figure(figsize=(8, 4))  # create a training-curve figure.
plt.plot(plain_loss_e2, label="plain loss")  # draw plain model loss.
plt.plot(res_loss_e2, label="residual loss")  # draw residual model loss.
plt.title("E2 step 4: classifier loss curves")  # title the optimization comparison.
plt.xlabel("epoch")  # label the training step axis.
plt.ylabel("cross-entropy")  # label the loss axis.
plt.legend()  # identify each curve.
plt.show()  # render loss curves.
```

▶ What you'll see: both tiny classifiers learn, and the residual feature representation often starts with a more useful signal.

```python
plt.figure(figsize=(8, 4))  # create an accuracy-curve figure.
plt.plot(plain_acc_e2, label="plain test accuracy")  # draw plain model accuracy.
plt.plot(res_acc_e2, label="residual test accuracy")  # draw residual model accuracy.
plt.title("E2 step 5: test accuracy curves")  # title the accuracy comparison.
plt.xlabel("epoch")  # label epochs.
plt.ylabel("accuracy")  # label accuracy.
plt.ylim(0, 1.05)  # keep accuracy on a fixed interpretable scale.
plt.legend()  # show curve labels.
plt.show()  # render the accuracy curves.
```

▶ What you'll see: residual features give a shortcut-enhanced representation, not a guarantee, but often train more smoothly on this toy task.

```python
cm_plain_e2 = confusion_matrix(y_test_e2, plain_pred_e2, labels=np.arange(5))  # compute the plain classifier confusion matrix.
cm_res_e2 = confusion_matrix(y_test_e2, res_pred_e2, labels=np.arange(5))  # compute the residual classifier confusion matrix.
fig, axes = plt.subplots(1, 2, figsize=(10, 4))  # create side-by-side confusion matrices.
for ax, cm, title in zip(axes, [cm_plain_e2, cm_res_e2], ["plain features", "residual features"]):  # loop over models.
    im = ax.imshow(cm, cmap="Blues")  # show counts as a heatmap.
    ax.set_title(title)  # label the model.
    ax.set_xlabel("predicted")  # label prediction axis.
    ax.set_ylabel("true")  # label truth axis.
    ax.set_xticks(np.arange(5))  # set digit-class ticks.
    ax.set_yticks(np.arange(5))  # set digit-class ticks.
fig.colorbar(im, ax=axes.ravel().tolist(), shrink=0.8)  # add one shared colorbar for count scale.
plt.show()  # render confusion matrices.
```

▶ What you'll see: the diagonal entries show correct digit predictions; off-diagonal entries reveal which digits the tiny features confuse.

👀 **Takeaway.** ResNet’s advantage is architectural: a model can learn useful transformations while preserving a clean path for information flow.

#### E3. Build an Inception-style module

**Goal.** Implement parallel $1\times1$, $3\times3$, $5\times5$, and pooling branches, then concatenate channels.  
**Data source.** Synthetic RGB-like patch.  
**We'll build this in 5 steps:** create a patch, run each branch, inspect shapes, concatenate, and visualize branch outputs.

```python
patch_e3 = np.zeros((8, 8, 3))  # allocate an 8×8×3 synthetic patch.
patch_e3[2:6, 2:6, 0] = 1.0  # add a red-channel square object.
patch_e3[:, 3:5, 1] = 0.8  # add a green-channel vertical stripe.
patch_e3[1:7, 1:7, 2] = np.eye(6) * 0.9  # add a blue-channel diagonal pattern.
plot_feature_grid(patch_e3, "E3 step 1: input RGB-like channels", max_channels=3)  # display the input channels.
```

```python
W1_e3 = RNG.normal(0.0, 0.4, size=(3, 2))  # create two 1×1 filters that mix three input channels.
b1_e3 = conv1x1(patch_e3, W1_e3)  # compute the 1×1 branch.
print("branch 1×1 shape:", b1_e3.shape)  # report the first branch shape.
plot_feature_grid(b1_e3, "E3 step 2: 1×1 branch", max_channels=2)  # visualize channel-mixing outputs.
```

```python
kernels3_e3 = RNG.normal(0.0, 0.25, size=(2, 3, 3, 3))  # create two random 3×3 filters over three channels.
b3_e3 = relu(conv_bank_same(patch_e3, kernels3_e3))  # compute the 3×3 branch with ReLU.
print("branch 3×3 shape:", b3_e3.shape)  # report the small receptive-field branch shape.
plot_feature_grid(b3_e3, "E3 step 3: 3×3 branch", max_channels=2)  # visualize local-pattern responses.
```

```python
kernels5_e3 = RNG.normal(0.0, 0.15, size=(1, 5, 5, 3))  # create one 5×5 filter for a larger receptive field.
b5_e3 = relu(conv_bank_same(patch_e3, kernels5_e3))  # compute the 5×5 branch.
bp_e3 = conv1x1(maxpool2d_same(patch_e3, size=3), RNG.normal(0.0, 0.3, size=(3, 1)))  # pool then project to one channel.
print("branch 5×5 shape:", b5_e3.shape)  # report the large branch shape.
print("pool-projection shape:", bp_e3.shape)  # report the pooling branch shape.
```

```python
merged_e3 = np.concatenate([b1_e3, b3_e3, b5_e3, bp_e3], axis=-1)  # concatenate branch outputs along the channel dimension.
print("concatenated output shape:", merged_e3.shape)  # show that channel counts add while spatial size stays fixed.
plot_feature_grid(merged_e3, "E3 final: Inception-style concatenated channels", max_channels=6)  # visualize the merged branch tensor.
```

▶ What you'll see: each branch produces a different feature interpretation, and concatenation packs them into one wider tensor.

👀 **Takeaway.** Inception modules trade one path for several parallel hypotheses about the right feature scale.

#### E4. $1\times1$ bottleneck saves compute

**Goal.** Quantify why Inception uses $1\times1$ bottlenecks before expensive larger kernels.  
**Data source.** CIFAR-like mini-batch shape, simulated offline as 32×32×64 tensors.  
**We'll build this in 4 steps:** define dimensions, count direct parameters, count bottleneck parameters, and compare output shapes with lower compute.

```python
height_e4 = 32  # use a CIFAR-like spatial height without downloading CIFAR.
width_e4 = 32  # use a CIFAR-like spatial width.
in_channels_e4 = 64  # assume an intermediate CNN tensor has sixty-four channels.
out_channels_e4 = 128  # ask the branch to produce one hundred twenty-eight channels.
bottleneck_e4 = 16  # reduce channels to sixteen before the expensive convolution.
direct_params_e4 = conv_param_count(5, in_channels_e4, out_channels_e4, use_bias=True)  # count a direct 5×5 branch.
bottle_params_e4 = conv_param_count(1, in_channels_e4, bottleneck_e4, use_bias=True) + conv_param_count(5, bottleneck_e4, out_channels_e4, use_bias=True)  # count 1×1 reduction plus 5×5 expansion.
print("direct 5×5 params:", direct_params_e4)  # print the expensive direct count.
print("bottlenecked params:", bottle_params_e4)  # print the reduced bottleneck count.
```

```python
direct_mults_e4 = height_e4 * width_e4 * 5 * 5 * in_channels_e4 * out_channels_e4  # approximate direct multiply count.
bottle_mults_e4 = height_e4 * width_e4 * (1 * 1 * in_channels_e4 * bottleneck_e4 + 5 * 5 * bottleneck_e4 * out_channels_e4)  # approximate bottleneck multiply count.
plt.figure(figsize=(6, 4))  # create a compute comparison chart.
plt.bar(["direct 5×5", "1×1 then 5×5"], [direct_mults_e4, bottle_mults_e4], color=["tomato", "seagreen"])  # compare multiply counts.
plt.ylabel("approximate multiplications")  # label the compute axis.
plt.title("E4 step 2: bottleneck compute reduction")  # title the bottleneck comparison.
plt.ticklabel_format(axis="y", style="sci", scilimits=(0, 0))  # format large counts compactly.
plt.show()  # render the compute chart.
```

▶ What you'll see: the bottleneck branch is much cheaper because the 5×5 filters operate on 16 channels instead of 64.

```python
same_output_shape_e4 = (height_e4, width_e4, out_channels_e4)  # direct and bottlenecked branches can both end with the same channel count.
reduction_e4 = 100.0 * (1.0 - bottle_mults_e4 / direct_mults_e4)  # compute percent compute savings.
print("direct output shape:", same_output_shape_e4)  # show the direct branch output shape.
print("bottleneck output shape:", same_output_shape_e4)  # show the bottleneck branch output shape.
print(f"approximate compute saved: {reduction_e4:.1f}%")  # print the savings as a percentage.
```

```python
plt.figure(figsize=(6, 4))  # create a parameter comparison chart.
plt.bar(["direct params", "bottleneck params"], [direct_params_e4, bottle_params_e4], color=["tomato", "seagreen"])  # compare trainable parameters.
plt.ylabel("parameters")  # label parameter axis.
plt.title("E4 final: same output channels, fewer parameters")  # title the final tradeoff.
plt.show()  # render the parameter chart.
```

▶ What you'll see: the branch can preserve the final output shape while sharply reducing parameters and multiplications.

👀 **Takeaway.** A $1\times1$ bottleneck is not just a trick; it changes the economics of wide multi-branch CNNs.

#### E5. GAN “hello world” on 2-D points

**Goal.** Train a minimal generator and discriminator on a 2-D ring, then watch losses and generated samples.  
**Data source.** 2-D Gaussian ring.  
**We'll build this in 7 steps:** create real samples, initialize adversaries, alternate updates, plot losses, show snapshots, draw the discriminator surface, and compare real versus fake samples.

```python
real_ring_e5 = make_ring(n=400, radius=2.0, noise=0.08, seed=232)  # create real data on a ring.
plt.figure(figsize=(5.2, 5.2))  # create a raw-data scatter plot.
plt.scatter(real_ring_e5[:, 0], real_ring_e5[:, 1], s=25, alpha=0.75, color="steelblue")  # draw real ring samples.
plt.axis("equal")  # keep circle geometry correct.
plt.title("E5 step 1: real 2-D ring samples")  # title the real distribution.
plt.xlabel("x1")  # label the first coordinate.
plt.ylabel("x2")  # label the second coordinate.
plt.show()  # render the ring.
```

▶ What you'll see: real data form a noisy circle, which the simple linear generator cannot perfectly represent.

```python
sampler_e5 = lambda n: real_ring_e5[RNG.choice(len(real_ring_e5), size=n, replace=True)]  # define a mini-batch sampler from real ring points.
Wg_e5, bg_e5, wd_e5, d_loss_e5, g_loss_e5, snapshots_e5 = simple_gan_train(sampler_e5, steps=500, batch=96, seed=233)  # train the tiny GAN.
print("final discriminator loss:", round(float(d_loss_e5[-1]), 3))  # print the final discriminator loss.
print("final generator loss:", round(float(g_loss_e5[-1]), 3))  # print the final generator loss.
```

```python
plt.figure(figsize=(8, 4))  # create a loss-curve figure.
plt.plot(d_loss_e5, label="discriminator loss")  # draw discriminator loss across training.
plt.plot(g_loss_e5, label="generator loss")  # draw generator loss across training.
plt.title("E5 step 4: adversarial loss curves")  # title the GAN training dynamics.
plt.xlabel("training step")  # label the iteration axis.
plt.ylabel("loss")  # label loss values.
plt.legend()  # identify the two adversaries.
plt.show()  # render the loss curves.
```

▶ What you'll see: losses move against each other rather than monotonically decreasing like ordinary supervised training.

```python
fig, axes = plt.subplots(1, len(snapshots_e5), figsize=(4 * len(snapshots_e5), 3.8))  # create a row of generated-sample snapshots.
for ax, (step, fake, _) in zip(axes, snapshots_e5):  # loop through stored generator states.
    ax.scatter(real_ring_e5[:, 0], real_ring_e5[:, 1], s=10, alpha=0.25, color="steelblue", label="real")  # show the real ring faintly.
    ax.scatter(fake[:, 0], fake[:, 1], s=18, alpha=0.75, color="darkorange", label="fake")  # show generated samples at this step.
    ax.set_title(f"step {step}")  # label the snapshot.
    ax.axis("equal")  # preserve geometry.
axes[0].legend()  # add one legend.
plt.tight_layout()  # arrange panels cleanly.
plt.show()  # render sample evolution.
```

▶ What you'll see: fake samples move as the generator responds to discriminator feedback, but a linear generator struggles to fill a ring.

```python
grid_x_e5 = np.linspace(-3, 3, 120)  # define horizontal grid values for the discriminator surface.
grid_y_e5 = np.linspace(-3, 3, 120)  # define vertical grid values for the discriminator surface.
xx_e5, yy_e5 = np.meshgrid(grid_x_e5, grid_y_e5)  # create a 2-D grid of evaluation points.
grid_e5 = np.c_[xx_e5.ravel(), yy_e5.ravel()]  # flatten grid coordinates into an N×2 matrix.
surface_e5 = sigmoid(discriminator_features(grid_e5) @ wd_e5).reshape(xx_e5.shape)  # compute final discriminator real-probability surface.
z_final_e5 = RNG.normal(0.0, 1.0, size=(400, 2))  # sample noise for final generator visualization.
fake_final_e5 = z_final_e5 @ Wg_e5 + bg_e5  # generate final fake points.
plt.figure(figsize=(6, 5.5))  # create the discriminator-surface plot.
plt.contourf(xx_e5, yy_e5, surface_e5, levels=20, cmap="RdBu", alpha=0.65)  # show real/fake probabilities as a smooth background.
plt.scatter(real_ring_e5[:, 0], real_ring_e5[:, 1], s=14, alpha=0.55, color="black", label="real")  # overlay real points.
plt.scatter(fake_final_e5[:, 0], fake_final_e5[:, 1], s=18, alpha=0.75, color="gold", label="fake")  # overlay fake points.
plt.colorbar(label="D(x) = probability real")  # label the discriminator output scale.
plt.legend()  # identify real and fake samples.
plt.axis("equal")  # keep geometry correct.
plt.title("E5 final: discriminator surface with real and fake samples")  # title the GAN result.
plt.show()  # render the final GAN diagnostic.
```

▶ What you'll see: the discriminator surface highlights regions it believes are real; fake samples try to move toward those regions.

👀 **Takeaway.** GAN training is a game: the generator improves only through the discriminator’s learned notion of realism.

### 🔴 Advanced Examples

#### A1. Train a tiny DCGAN-style generator

**Goal.** Train a tiny offline GAN-style generator on image-like data and visualize generated image grids.  
**Data source.** Built-in digits used as a Fashion-MNIST-sized stand-in, kept 8×8 for CPU speed.  
**We'll build this in 9 steps:** load images, flatten them, define tiny adversaries, train, store grids, plot losses, compare real/fake images, inspect confidence, and summarize limitations.

```python
digits_a1 = load_digits()  # load offline 8×8 digit images.
real_images_a1 = digits_a1.images[:600] / 16.0  # scale a small subset to [0, 1].
real_flat_a1 = real_images_a1.reshape(len(real_images_a1), -1)  # flatten images for a tiny CPU generator.
noise_dim_a1 = 10  # use a small latent dimension for the toy generator.
hidden_a1 = 24  # use a tiny hidden representation so training stays fast.
rng_a1 = np.random.default_rng(234)  # create a local generator for reproducible GAN initialization.
G1_a1 = rng_a1.normal(0.0, 0.2, size=(noise_dim_a1, hidden_a1))  # initialize first generator layer.
Gb1_a1 = np.zeros(hidden_a1)  # initialize first generator bias.
G2_a1 = rng_a1.normal(0.0, 0.15, size=(hidden_a1, 64))  # initialize output generator layer.
Gb2_a1 = np.zeros(64)  # initialize output generator bias.
D_a1 = rng_a1.normal(0.0, 0.05, size=65)  # initialize a logistic discriminator over pixels plus bias.
print("real image matrix:", real_flat_a1.shape)  # show the flattened training shape.
```

```python
def generator_a1(z):  # define the tiny generator forward pass.
    h = np.tanh(z @ G1_a1 + Gb1_a1)  # map noise to a hidden code with bounded activations.
    x = sigmoid(h @ G2_a1 + Gb2_a1)  # map hidden code to pixel intensities in [0, 1].
    return h, x  # return hidden activations and generated pixels for backpropagation.

def disc_a1(x):  # define the tiny discriminator forward pass.
    xb = np.c_[np.ones(len(x)), x]  # prepend a bias feature to each image vector.
    return sigmoid(xb @ D_a1), xb  # return real probabilities and the design matrix.
```

```python
loss_d_a1 = []  # store discriminator loss values.
loss_g_a1 = []  # store generator loss values.
grid_snapshots_a1 = []  # store generated image grids during training.
for step in range(350):  # run a short alternating GAN loop.
    idx = rng_a1.choice(len(real_flat_a1), size=64, replace=True)  # sample real images for a mini-batch.
    real = real_flat_a1[idx]  # gather the real mini-batch.
    z = rng_a1.normal(0.0, 1.0, size=(64, noise_dim_a1))  # sample latent noise.
    h_fake, fake = generator_a1(z)  # generate fake images.
    p_real, xb_real = disc_a1(real)  # evaluate discriminator on real images.
    p_fake, xb_fake = disc_a1(fake)  # evaluate discriminator on fake images.
    grad_D = (xb_real.T @ (p_real - 1.0) + xb_fake.T @ p_fake) / 128.0  # compute discriminator gradient.
    D_a1 -= 0.35 * grad_D  # update discriminator weights.
    z = rng_a1.normal(0.0, 1.0, size=(64, noise_dim_a1))  # sample new latent noise for generator update.
    h_fake, fake = generator_a1(z)  # generate a fresh fake batch.
    p_fake, xb_fake = disc_a1(fake)  # evaluate updated discriminator on fake images.
    dloss_dfake = -(1.0 - p_fake)[:, None] * D_a1[1:][None, :] / 64.0  # compute gradient of generator loss through discriminator.
    dlogit = dloss_dfake * fake * (1.0 - fake)  # backpropagate through output sigmoid.
    grad_G2 = h_fake.T @ dlogit  # compute gradient for generator output weights.
    grad_Gb2 = dlogit.sum(axis=0)  # compute gradient for generator output bias.
    dh = dlogit @ G2_a1.T * (1.0 - h_fake ** 2)  # backpropagate into hidden tanh activations.
    grad_G1 = z.T @ dh  # compute gradient for generator first layer.
    grad_Gb1 = dh.sum(axis=0)  # compute gradient for generator first-layer bias.
    G2_a1 -= 0.25 * grad_G2  # update generator output weights.
    Gb2_a1 -= 0.25 * grad_Gb2  # update generator output bias.
    G1_a1 -= 0.25 * grad_G1  # update generator first-layer weights.
    Gb1_a1 -= 0.25 * grad_Gb1  # update generator first-layer bias.
    d_loss = -0.5 * (np.mean(np.log(p_real + EPS)) + np.mean(np.log(1.0 - p_fake + EPS)))  # estimate discriminator loss.
    g_loss = -np.mean(np.log(p_fake + EPS))  # estimate generator non-saturating loss.
    loss_d_a1.append(d_loss)  # record discriminator loss.
    loss_g_a1.append(g_loss)  # record generator loss.
    if step in [0, 100, 200, 349]:  # store a few generator snapshots.
        _, generated = generator_a1(rng_a1.normal(0.0, 1.0, size=(12, noise_dim_a1)))  # generate a small image grid.
        grid_snapshots_a1.append((step, generated.reshape(12, 8, 8)))  # reshape and store generated images.
```

```python
plt.figure(figsize=(8, 4))  # create loss-curve figure.
plt.plot(loss_d_a1, label="D loss")  # draw discriminator loss.
plt.plot(loss_g_a1, label="G loss")  # draw generator loss.
plt.title("A1 step 6: tiny image GAN losses")  # title adversarial training curves.
plt.xlabel("step")  # label training step axis.
plt.ylabel("loss")  # label loss axis.
plt.legend()  # identify curves.
plt.show()  # render loss curves.
```

▶ What you'll see: the curves oscillate because each model changes the other model's task.

```python
fig, axes = plt.subplots(len(grid_snapshots_a1), 12, figsize=(12, 4.8))  # create one row per saved training snapshot.
for row, (step, images) in enumerate(grid_snapshots_a1):  # loop over snapshots.
    for col in range(12):  # loop over generated images in that snapshot.
        axes[row, col].imshow(images[col], cmap="gray", vmin=0, vmax=1)  # display one generated image.
        axes[row, col].axis("off")  # hide pixel ticks.
        if col == 0:  # label only the first panel in each row.
            axes[row, col].set_ylabel(f"step {step}")  # annotate the training step.
plt.suptitle("A1 step 7: generated image grids over training")  # title the snapshot grid.
plt.tight_layout()  # arrange the panels.
plt.show()  # render generated images.
```

▶ What you'll see: early images look like noise; later images often develop digit-like strokes but remain crude because the model is intentionally tiny.

```python
_, final_fake_a1 = generator_a1(rng_a1.normal(0.0, 1.0, size=(120, noise_dim_a1)))  # generate a larger final fake batch.
p_real_a1, _ = disc_a1(real_flat_a1[:120])  # compute discriminator confidence on real images.
p_fake_a1, _ = disc_a1(final_fake_a1)  # compute discriminator confidence on fake images.
plt.figure(figsize=(7, 4))  # create confidence histogram figure.
plt.hist(p_real_a1, bins=20, alpha=0.7, label="real confidence")  # histogram real-image confidence.
plt.hist(p_fake_a1, bins=20, alpha=0.7, label="fake confidence")  # histogram fake-image confidence.
plt.title("A1 final: discriminator confidence histogram")  # title final diagnostic.
plt.xlabel("D(x)")  # label discriminator probability axis.
plt.ylabel("count")  # label histogram count axis.
plt.legend()  # identify histograms.
plt.show()  # render confidence histograms.
```

▶ What you'll see: if the discriminator separates histograms easily, the generator has not fully fooled it.

👀 **Takeaway.** A DCGAN uses convolutional layers for images, but the adversarial training signal is already visible in this tiny CPU-safe image GAN.

#### A2. GAN failure case — mode collapse

**Goal.** Demonstrate how a generator can over-focus on a dominant mode and miss rarer real modes.  
**Data source.** Imbalanced 2-D Gaussian mixture.  
**We'll build this in 8 steps:** create modes, train with collapse pressure, plot losses, inspect snapshots, measure mode coverage, visualize the discriminator surface, compare to balanced data, and diagnose the failure.

```python
real_modes_a2, labels_modes_a2, centers_a2 = make_modes(n=500, weights=(0.78, 0.17, 0.05), seed=235)  # create an imbalanced three-mode target distribution.
plt.figure(figsize=(5.8, 5))  # create raw mixture plot.
plt.scatter(real_modes_a2[:, 0], real_modes_a2[:, 1], s=22, alpha=0.65, c=labels_modes_a2, cmap="tab10")  # show real samples colored by hidden mode.
plt.scatter(centers_a2[:, 0], centers_a2[:, 1], s=180, marker="X", color="black", label="mode centers")  # mark true mode centers.
plt.legend()  # show the center label.
plt.title("A2 step 1: imbalanced real modes")  # title failure-case data.
plt.axis("equal")  # preserve geometry.
plt.show()  # render the mixture.
```

▶ What you'll see: one mode has many more samples than the other two, tempting a generator to cover only the majority region.

```python
sampler_a2 = lambda n: real_modes_a2[RNG.choice(len(real_modes_a2), size=n, replace=True)]  # define a sampler from the imbalanced mixture.
Wg_a2, bg_a2, wd_a2, d_loss_a2, g_loss_a2, snapshots_a2 = simple_gan_train(sampler_a2, steps=550, batch=96, seed=236, collapse_pressure=0.08)  # train a toy GAN with extra pressure toward low spread.
plt.figure(figsize=(8, 4))  # create loss plot.
plt.plot(d_loss_a2, label="D loss")  # draw discriminator loss.
plt.plot(g_loss_a2, label="G loss")  # draw generator loss.
plt.title("A2 step 3: mode-collapse GAN losses")  # title the adversarial curves.
plt.xlabel("step")  # label training step axis.
plt.ylabel("loss")  # label loss values.
plt.legend()  # identify curves.
plt.show()  # render losses.
```

▶ What you'll see: losses alone do not reveal whether all real modes are covered.

```python
fig, axes = plt.subplots(1, len(snapshots_a2), figsize=(4 * len(snapshots_a2), 3.8))  # create snapshot panels.
for ax, (step, fake, _) in zip(axes, snapshots_a2):  # loop over saved generator states.
    ax.scatter(real_modes_a2[:, 0], real_modes_a2[:, 1], s=10, alpha=0.2, color="steelblue", label="real")  # show real data faintly.
    ax.scatter(fake[:, 0], fake[:, 1], s=22, alpha=0.8, color="darkorange", label="fake")  # show fake samples.
    ax.scatter(centers_a2[:, 0], centers_a2[:, 1], s=80, marker="X", color="black")  # mark mode centers.
    ax.set_title(f"step {step}")  # label the snapshot.
    ax.axis("equal")  # preserve geometry.
axes[0].legend()  # add a legend once.
plt.tight_layout()  # arrange snapshot panels.
plt.show()  # render mode-collapse snapshots.
```

▶ What you'll see: generated points often concentrate near one broad region instead of covering all three modes.

```python
fake_a2 = RNG.normal(0.0, 1.0, size=(600, 2)) @ Wg_a2 + bg_a2  # sample final generator points.
dists_a2 = np.sqrt(((fake_a2[:, None, :] - centers_a2[None, :, :]) ** 2).sum(axis=2))  # compute distance from each fake point to each true mode center.
nearest_a2 = np.argmin(dists_a2, axis=1)  # assign each fake point to its nearest mode.
coverage_a2 = np.bincount(nearest_a2, minlength=3) / len(fake_a2)  # compute fraction of fake samples nearest to each mode.
plt.figure(figsize=(6, 4))  # create coverage bar chart.
plt.bar(["mode 0", "mode 1", "mode 2"], coverage_a2, color=["steelblue", "orange", "green"])  # plot generated mode coverage.
plt.title("A2 step 5: generated mode coverage")  # title coverage diagnostic.
plt.ylabel("fraction of fake samples")  # label coverage axis.
plt.ylim(0, 1)  # keep fractions interpretable.
plt.show()  # render coverage chart.
print("mode coverage:", np.round(coverage_a2, 3))  # print exact coverage values.
```

▶ What you'll see: one bar can dominate, even though the real distribution has multiple modes.

```python
xx_a2, yy_a2 = np.meshgrid(np.linspace(-3.5, 3.5, 120), np.linspace(-1.5, 3.8, 120))  # create a grid around the mixture.
grid_a2 = np.c_[xx_a2.ravel(), yy_a2.ravel()]  # flatten grid coordinates.
surface_a2 = sigmoid(discriminator_features(grid_a2) @ wd_a2).reshape(xx_a2.shape)  # compute discriminator real probabilities.
plt.figure(figsize=(6, 5))  # create surface plot.
plt.contourf(xx_a2, yy_a2, surface_a2, levels=20, cmap="RdBu", alpha=0.65)  # show discriminator confidence.
plt.scatter(real_modes_a2[:, 0], real_modes_a2[:, 1], s=10, alpha=0.25, color="black", label="real")  # overlay real samples.
plt.scatter(fake_a2[:, 0], fake_a2[:, 1], s=14, alpha=0.65, color="gold", label="fake")  # overlay fake samples.
plt.scatter(centers_a2[:, 0], centers_a2[:, 1], s=100, marker="X", color="white", edgecolor="black")  # mark modes on top of the surface.
plt.colorbar(label="D(x)")  # label discriminator probability.
plt.legend()  # identify sample types.
plt.axis("equal")  # preserve geometry.
plt.title("A2 final: discriminator diagnosis of mode collapse")  # title final diagnostic.
plt.show()  # render mode-collapse diagnosis.
```

▶ What you'll see: the discriminator surface may still identify real regions that the generator undersamples.

👀 **Takeaway.** GAN quality cannot be judged by loss alone; sample diversity and mode coverage are essential diagnostics.

#### A3. Deep plain CNN vs ResNet under vanishing gradients

**Goal.** Simulate how repeated Jacobian multiplications shrink gradients, and show how residual shortcuts preserve gradient flow.  
**Data source.** CIFAR-like synthetic feature vectors.  
**We'll build this in 8 steps:** create deep random layers, propagate a signal, backpropagate gradients, add residual shortcuts, compare norms, train tiny classifiers, plot curves, and summarize the residual benefit.

```python
rng_a3 = np.random.default_rng(237)  # create a local generator for reproducible deep matrices.
dim_a3 = 24  # choose a small channel dimension.
layers_a3 = 18  # choose enough layers to show gradient shrinkage.
plain_weights_a3 = [rng_a3.normal(0.0, 0.18, size=(dim_a3, dim_a3)) for _ in range(layers_a3)]  # create small plain-layer matrices.
res_weights_a3 = [rng_a3.normal(0.0, 0.18, size=(dim_a3, dim_a3)) for _ in range(layers_a3)]  # create matching residual correction matrices.
x_a3 = rng_a3.normal(0.0, 1.0, size=(dim_a3,))  # create one synthetic feature vector.
print("layers:", layers_a3, "feature dimension:", dim_a3)  # report the simulation size.
```

```python
plain_acts_a3 = [x_a3]  # store plain-network activations.
for W in plain_weights_a3:  # move through each plain layer.
    plain_acts_a3.append(np.tanh(plain_acts_a3[-1] @ W))  # apply a small linear map and tanh nonlinearity.
res_acts_a3 = [x_a3]  # store residual-network activations.
for W in res_weights_a3:  # move through each residual layer.
    correction = np.tanh(res_acts_a3[-1] @ W)  # compute a bounded residual correction.
    res_acts_a3.append(res_acts_a3[-1] + 0.25 * correction)  # add the scaled correction to the shortcut.
plain_norms_forward_a3 = [np.linalg.norm(a) for a in plain_acts_a3]  # compute activation norms for the plain stack.
res_norms_forward_a3 = [np.linalg.norm(a) for a in res_acts_a3]  # compute activation norms for the residual stack.
```

```python
grad_plain_a3 = np.ones(dim_a3) / np.sqrt(dim_a3)  # start with a unit-sized output gradient.
plain_grad_norms_a3 = [np.linalg.norm(grad_plain_a3)]  # store backward gradient norms for the plain stack.
for W, act_prev in zip(reversed(plain_weights_a3), reversed(plain_acts_a3[:-1])):  # backpropagate through plain layers.
    local = 1.0 - np.tanh(act_prev @ W) ** 2  # compute tanh derivative at the layer output.
    grad_plain_a3 = (grad_plain_a3 * local) @ W.T  # multiply by activation derivative and weight transpose.
    plain_grad_norms_a3.append(np.linalg.norm(grad_plain_a3))  # record the gradient norm.
grad_res_a3 = np.ones(dim_a3) / np.sqrt(dim_a3)  # start a matching output gradient for residual stack.
res_grad_norms_a3 = [np.linalg.norm(grad_res_a3)]  # store residual gradient norms.
for W, act_prev in zip(reversed(res_weights_a3), reversed(res_acts_a3[:-1])):  # backpropagate through residual layers.
    local = 1.0 - np.tanh(act_prev @ W) ** 2  # compute derivative of the residual correction.
    jacobian = np.eye(dim_a3) + 0.25 * (W * local[:, None]).T  # approximate identity-plus-correction Jacobian.
    grad_res_a3 = grad_res_a3 @ jacobian  # propagate through the residual block.
    res_grad_norms_a3.append(np.linalg.norm(grad_res_a3))  # record residual gradient norm.
```

```python
plt.figure(figsize=(8, 4))  # create gradient-norm figure.
plt.semilogy(plain_grad_norms_a3[::-1], marker="o", label="plain stack")  # plot plain gradients from input to output.
plt.semilogy(res_grad_norms_a3[::-1], marker="o", label="residual stack")  # plot residual gradients from input to output.
plt.title("A3 step 4: gradient norm by layer")  # title vanishing-gradient diagnostic.
plt.xlabel("layer index from input")  # label layer axis.
plt.ylabel("gradient norm, log scale")  # label gradient norm axis.
plt.legend()  # identify stacks.
plt.show()  # render gradient comparison.
```

▶ What you'll see: the plain stack’s gradients can shrink dramatically, while identity shortcuts keep residual gradients closer to the output scale.

```python
plt.figure(figsize=(8, 4))  # create activation-norm figure.
plt.plot(plain_norms_forward_a3, marker="o", label="plain activations")  # draw plain activation norms.
plt.plot(res_norms_forward_a3, marker="o", label="residual activations")  # draw residual activation norms.
plt.title("A3 step 5: activation norms through depth")  # title activation-flow diagnostic.
plt.xlabel("layer")  # label depth axis.
plt.ylabel("activation norm")  # label norm axis.
plt.legend()  # identify stacks.
plt.show()  # render forward norm comparison.
```

▶ What you'll see: residual activations preserve a strong signal because every layer includes an identity path.

```python
X_a3, y_a3 = make_synthetic_images(n=300, size=8, seed=238)  # create synthetic image classes as a CIFAR-like offline stand-in.
Xtr_a3, Xte_a3, ytr_a3, yte_a3 = train_test_split(X_a3, y_a3, test_size=0.3, random_state=238, stratify=y_a3)  # split toy images.
plain_feat_a3 = extract_plain_features(Xtr_a3)  # extract plain features for training.
plain_test_a3 = extract_plain_features(Xte_a3)  # extract plain features for testing.
res_feat_a3 = extract_residual_features(Xtr_a3)  # extract residual features for training.
res_test_a3 = extract_residual_features(Xte_a3)  # extract residual features for testing.
_, loss_plain_a3, acc_plain_a3, grad_plain_cls_a3, _ = train_softmax_classifier(plain_feat_a3, ytr_a3, plain_test_a3, yte_a3, epochs=120, lr=0.4)  # train plain-feature classifier.
_, loss_res_a3, acc_res_a3, grad_res_cls_a3, _ = train_softmax_classifier(res_feat_a3, ytr_a3, res_test_a3, yte_a3, epochs=120, lr=0.4)  # train residual-feature classifier.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 4))  # create training-curve panels.
axes[0].plot(loss_plain_a3, label="plain")  # draw plain loss.
axes[0].plot(loss_res_a3, label="residual")  # draw residual loss.
axes[0].set_title("A3 step 7: loss on toy images")  # title loss panel.
axes[0].set_xlabel("epoch")  # label epoch axis.
axes[0].set_ylabel("cross-entropy")  # label loss axis.
axes[0].legend()  # identify loss curves.
axes[1].plot(acc_plain_a3, label="plain")  # draw plain accuracy.
axes[1].plot(acc_res_a3, label="residual")  # draw residual accuracy.
axes[1].set_title("A3 final: accuracy on toy images")  # title accuracy panel.
axes[1].set_xlabel("epoch")  # label epoch axis.
axes[1].set_ylabel("test accuracy")  # label accuracy axis.
axes[1].set_ylim(0, 1.05)  # keep accuracy scale fixed.
axes[1].legend()  # identify accuracy curves.
plt.tight_layout()  # arrange panels.
plt.show()  # render training comparison.
```

▶ What you'll see: the residual diagnostic and toy classifier illustrate the same idea: shortcuts make useful signals easier to preserve.

👀 **Takeaway.** Residual connections change the optimization geometry by adding an identity route through deep computations.

#### A4. Inception module for multi-scale patterns

**Goal.** Use an Inception-style module to detect small and large synthetic objects in the same image.  
**Data source.** Synthetic shapes with small and large objects.  
**We'll build this in 8 steps:** create shapes, define branches, run $1\times1$, run $3\times3$, run $5\times5$, run pooling, concatenate, and visualize multi-scale activations.

```python
image_a4 = np.zeros((16, 16, 1))  # allocate a larger synthetic image.
image_a4[2:5, 2:5, 0] = 1.0  # add a small square object.
image_a4[8:14, 8:14, 0] = 0.8  # add a larger square object.
image_a4 += RNG.normal(0.0, 0.03, size=image_a4.shape)  # add mild noise to mimic image texture.
plot_feature_grid(image_a4, "A4 step 1: small and large objects", max_channels=1)  # visualize the input pattern.
```

```python
w1_a4 = np.array([[1.0, -0.5]])  # define a 1×1 branch that creates positive and contrast channels.
b1_a4 = conv1x1(image_a4, w1_a4)  # apply the channel-mixing branch.
plot_feature_grid(b1_a4, "A4 step 2: 1×1 branch", max_channels=2)  # show the local channel projections.
```

```python
laplace_a4 = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]], dtype=float)[:, :, None]  # define a small-object edge filter.
k3_a4 = np.stack([laplace_a4], axis=0)  # make a one-filter 3×3 branch.
b3_a4 = np.abs(conv_bank_same(image_a4, k3_a4))  # use absolute edge magnitude for the small-scale branch.
plot_feature_grid(b3_a4, "A4 step 3: 3×3 small-scale edge branch", max_channels=1)  # show small-scale edge responses.
```

```python
large_a4 = np.ones((5, 5, 1), dtype=float) / 25.0  # define a large averaging filter.
k5_a4 = np.stack([large_a4], axis=0)  # make a one-filter 5×5 branch.
b5_a4 = conv_bank_same(image_a4, k5_a4)  # apply the large receptive-field branch.
plot_feature_grid(b5_a4, "A4 step 4: 5×5 large-scale branch", max_channels=1)  # show large-object smoothing responses.
```

```python
bp_a4 = maxpool2d_same(image_a4, size=3)  # compute a max-pooling branch that preserves strongest local evidence.
bp_proj_a4 = conv1x1(bp_a4, np.array([[1.0]]))  # project pooled values back to one channel.
plot_feature_grid(bp_proj_a4, "A4 step 5: pooling branch", max_channels=1)  # show pooled activations.
```

```python
merged_a4 = np.concatenate([b1_a4, b3_a4, b5_a4, bp_proj_a4], axis=-1)  # concatenate all multi-scale branch outputs.
branch_energy_a4 = np.mean(np.abs(merged_a4), axis=(0, 1))  # compute mean absolute activation per output channel.
print("merged output shape:", merged_a4.shape)  # show spatial size and channel count.
print("branch/channel energy:", np.round(branch_energy_a4, 3))  # print a compact response summary.
plot_feature_grid(merged_a4, "A4 final: multi-scale Inception feature montage", max_channels=5)  # display the full branch montage.
```

▶ What you'll see: small filters highlight edges, large filters smooth broad objects, and pooling preserves strong local responses.

```python
plt.figure(figsize=(6, 4))  # create branch-energy chart.
plt.bar(["1×1 a", "1×1 b", "3×3", "5×5", "pool"], branch_energy_a4, color=["gray", "gray", "steelblue", "orange", "green"])  # compare average branch responses.
plt.title("A4 final metric: average activation by branch")  # title the activation summary.
plt.ylabel("mean absolute activation")  # label the metric.
plt.show()  # render branch-energy plot.
```

▶ What you'll see: different branches respond differently because each branch has a different receptive field or operation.

👀 **Takeaway.** Inception modules let the network keep small-scale and large-scale evidence side by side.

#### A5. Architecture comparison capstone

**Goal.** Compare PlainCNN-style, ResNet-block, and Inception-block feature pipelines on accuracy, parameters, approximate FLOPs, and feature maps.  
**Data source.** CIFAR-like synthetic images generated offline.  
**We'll build this in 10 steps:** create data, compute three feature sets, train classifiers, count parameters, approximate FLOPs, plot accuracy, plot tradeoffs, show feature maps, compare confusion matrices, and choose an architecture for constraints.

```python
X_a5, y_a5 = make_synthetic_images(n=450, size=8, seed=239)  # generate a balanced offline image dataset.
Xtr_a5, Xte_a5, ytr_a5, yte_a5 = train_test_split(X_a5, y_a5, test_size=0.3, random_state=239, stratify=y_a5)  # split into train and test sets.
print("train/test shapes:", Xtr_a5.shape, Xte_a5.shape)  # report capstone dataset sizes.
```

```python
features_a5 = {  # create a dictionary of architecture feature extractors.
    "PlainCNN": (extract_plain_features(Xtr_a5), extract_plain_features(Xte_a5)),  # compute plain CNN-style features.
    "ResNetBlock": (extract_residual_features(Xtr_a5), extract_residual_features(Xte_a5)),  # compute residual features.
    "InceptionBlock": (extract_inception_features(Xtr_a5), extract_inception_features(Xte_a5)),  # compute inception features.
}  # close the architecture feature dictionary.
for name, (train_feat, test_feat) in features_a5.items():  # inspect feature dimensionality for every architecture.
    print(name, "train features", train_feat.shape, "test features", test_feat.shape)  # print feature matrix shapes.
```

```python
results_a5 = {}  # store metrics and predictions for all architectures.
for name, (train_feat, test_feat) in features_a5.items():  # train one classifier per architecture.
    W, loss, acc, grad, pred = train_softmax_classifier(train_feat, ytr_a5, test_feat, yte_a5, epochs=130, lr=0.45)  # train the small classifier.
    results_a5[name] = {"W": W, "loss": loss, "acc": acc, "grad": grad, "pred": pred}  # store outputs for later plots.
    print(name, "final accuracy", round(float(acc[-1]), 3))  # print final accuracy.
```

```python
plt.figure(figsize=(8, 4))  # create accuracy-curve figure.
for name, result in results_a5.items():  # draw one curve per architecture.
    plt.plot(result["acc"], label=name)  # plot test accuracy over epochs.
plt.title("A5 step 4: accuracy curves by architecture")  # title accuracy comparison.
plt.xlabel("epoch")  # label epoch axis.
plt.ylabel("test accuracy")  # label accuracy axis.
plt.ylim(0, 1.05)  # keep accuracy scale fixed.
plt.legend()  # identify architectures.
plt.show()  # render accuracy curves.
```

▶ What you'll see: all three pipelines solve the simple toy task, but their feature dimensions and compute differ.

```python
params_a5 = {  # define approximate trainable parameter counts for each fixed feature extractor plus classifier.
    "PlainCNN": conv_param_count(3, 1, 3) + results_a5["PlainCNN"]["W"].size,  # count three 3×3 filters plus classifier weights.
    "ResNetBlock": conv_param_count(3, 1, 2) + results_a5["ResNetBlock"]["W"].size,  # count residual main-path filters plus classifier.
    "InceptionBlock": conv_param_count(1, 1, 1) + conv_param_count(3, 1, 1) + conv_param_count(5, 1, 1) + results_a5["InceptionBlock"]["W"].size,  # count simplified branches plus classifier.
}  # close parameter-count dictionary.
flops_a5 = {  # define rough multiply counts per image for each extractor.
    "PlainCNN": 8 * 8 * 3 * 3 * 1 * 3,  # count three 3×3 filters over an 8×8 image.
    "ResNetBlock": 8 * 8 * 3 * 3 * 1 * 2 + 8 * 8 * 2,  # count two filters plus residual additions.
    "InceptionBlock": 8 * 8 * (1 * 1 * 1 * 1 + 3 * 3 * 1 * 1 + 5 * 5 * 1 * 1 + 3 * 3 * 1),  # count branch multiplications and pooling comparisons roughly.
}  # close FLOP dictionary.
print("params:", params_a5)  # print parameter estimates.
print("approx FLOPs:", flops_a5)  # print compute estimates.
```

```python
names_a5 = list(results_a5.keys())  # keep architecture names in a stable order.
accs_a5 = [results_a5[name]["acc"][-1] for name in names_a5]  # collect final accuracies.
param_values_a5 = [params_a5[name] for name in names_a5]  # collect parameter counts.
flop_values_a5 = [flops_a5[name] for name in names_a5]  # collect FLOP estimates.
fig, axes = plt.subplots(1, 3, figsize=(13, 4))  # create three tradeoff panels.
axes[0].bar(names_a5, accs_a5, color="steelblue")  # compare accuracy.
axes[0].set_title("accuracy")  # title accuracy panel.
axes[0].set_ylim(0, 1.05)  # keep accuracy scale fixed.
axes[1].bar(names_a5, param_values_a5, color="darkorange")  # compare parameter counts.
axes[1].set_title("parameters")  # title parameter panel.
axes[2].bar(names_a5, flop_values_a5, color="seagreen")  # compare compute.
axes[2].set_title("approx FLOPs/image")  # title FLOP panel.
for ax in axes:  # format all panels.
    ax.tick_params(axis="x", rotation=20)  # rotate labels so names fit.
plt.suptitle("A5 step 7: architecture tradeoff chart")  # add overall tradeoff title.
plt.tight_layout()  # arrange panels.
plt.show()  # render tradeoffs.
```

▶ What you'll see: better feature diversity may cost parameters or compute, so architecture choice is a constrained optimization problem.

```python
sample_a5 = Xte_a5[0]  # choose one held-out image for feature-map inspection.
plain_maps_a5 = relu(conv_bank_same(sample_a5, np.stack([np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=float)[:, :, None], np.array([[-1, -1, -1], [0, 0, 0], [1, 1, 1]], dtype=float)[:, :, None], np.ones((3, 3, 1)) / 9.0], axis=0)))  # compute plain feature maps.
res_maps_a5 = relu(np.repeat(sample_a5, 2, axis=-1) + 0.25 * conv_bank_same(sample_a5, np.stack([np.ones((3, 3, 1)) / 9.0, np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=float)[:, :, None]], axis=0)))  # compute residual feature maps.
inc_maps_a5 = np.concatenate([sample_a5, relu(conv2d_same(sample_a5, np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]], dtype=float)[:, :, None])[:, :, None]), conv2d_same(sample_a5, np.ones((5, 5, 1)) / 25.0)[:, :, None], maxpool2d_same(sample_a5, size=3)], axis=-1)  # compute inception feature maps.
plot_feature_grid(plain_maps_a5, "A5 step 8: PlainCNN feature maps", max_channels=3)  # display plain maps.
plot_feature_grid(res_maps_a5, "A5 step 8: ResNet-block feature maps", max_channels=2)  # display residual maps.
plot_feature_grid(inc_maps_a5, "A5 step 8: Inception-block feature maps", max_channels=4)  # display inception maps.
```

▶ What you'll see: the three designs produce different intermediate representations even for the same input image.

```python
fig, axes = plt.subplots(1, 3, figsize=(12, 3.8))  # create confusion-matrix panels.
for ax, name in zip(axes, names_a5):  # loop over architectures.
    cm = confusion_matrix(yte_a5, results_a5[name]["pred"], labels=np.arange(3))  # compute confusion matrix.
    im = ax.imshow(cm, cmap="Blues")  # visualize class-count matrix.
    ax.set_title(name)  # label architecture.
    ax.set_xlabel("predicted")  # label predicted class axis.
    ax.set_ylabel("true")  # label true class axis.
    ax.set_xticks(np.arange(3))  # set class ticks.
    ax.set_yticks(np.arange(3))  # set class ticks.
fig.colorbar(im, ax=axes.ravel().tolist(), shrink=0.8)  # add shared colorbar.
plt.suptitle("A5 step 9: confusion matrices")  # title confusion comparison.
plt.show()  # render matrices.
```

▶ What you'll see: mistakes, if any, reveal which architecture loses information about bars versus blobs.

```python
score_a5 = np.array(accs_a5) - 0.00002 * np.array(param_values_a5) - 0.000001 * np.array(flop_values_a5)  # define a simple accuracy-minus-cost score.
best_idx_a5 = int(np.argmax(score_a5))  # choose the architecture with best score under this toy cost preference.
print("cost-aware scores:", dict(zip(names_a5, np.round(score_a5, 3))))  # print all scores.
print("selected architecture under this constraint:", names_a5[best_idx_a5])  # print the best tradeoff.
```

▶ What you'll see: the “best” architecture depends on how much you penalize parameters and compute, not only on accuracy.

👀 **Takeaway.** Architecture design is a tradeoff among representation quality, optimization behavior, and computational budget.

### Interactive Experiment

Use the sliders to explore how filters, branch mix, and bottleneck width change parameter counts and output shapes before you train anything.

```python
def architecture_readout(input_channels=32, output_channels=64, bottleneck=8, branch_mix="inception"):  # define an interactive architecture calculator.
    if branch_mix == "plain 3×3":  # handle a single ordinary convolution branch.
        params = conv_param_count(3, input_channels, output_channels, use_bias=True)  # count one 3×3 convolution.
        output_shape = (16, 16, output_channels)  # preserve spatial size with same padding.
        explanation = "one 3×3 branch"  # describe the selected design.
    elif branch_mix == "residual block":  # handle a two-layer residual block with matching channels.
        params = conv_param_count(3, input_channels, output_channels, use_bias=True) + conv_param_count(3, output_channels, output_channels, use_bias=True)  # count two main-path convolutions.
        params += conv_param_count(1, input_channels, output_channels, use_bias=True) if input_channels != output_channels else 0  # add projection shortcut only when channels differ.
        output_shape = (16, 16, output_channels)  # residual output uses the requested channel count.
        explanation = "two 3×3 layers plus identity/projection shortcut"  # describe residual design.
    else:  # handle an Inception-style parallel module.
        branch1 = conv_param_count(1, input_channels, output_channels // 4, use_bias=True)  # count 1×1 branch.
        branch3 = conv_param_count(1, input_channels, bottleneck, use_bias=True) + conv_param_count(3, bottleneck, output_channels // 4, use_bias=True)  # count bottlenecked 3×3 branch.
        branch5 = conv_param_count(1, input_channels, bottleneck, use_bias=True) + conv_param_count(5, bottleneck, output_channels // 4, use_bias=True)  # count bottlenecked 5×5 branch.
        branchp = conv_param_count(1, input_channels, output_channels - 3 * (output_channels // 4), use_bias=True)  # count pool-projection branch.
        params = branch1 + branch3 + branch5 + branchp  # sum branch parameters.
        output_shape = (16, 16, output_channels)  # concatenated branches produce the requested total channels.
        explanation = "parallel 1×1, 3×3, 5×5, and pool-projection branches"  # describe Inception design.
    print("design:", explanation)  # print selected design explanation.
    print("input shape:", (16, 16, input_channels))  # print assumed input tensor shape.
    print("output shape:", output_shape)  # print resulting output tensor shape.
    print("trainable parameters:", int(params))  # print total parameter count.
    plt.figure(figsize=(5, 3.5))  # create a compact visual readout.
    plt.bar(["parameters"], [params], color="slateblue")  # plot the current parameter count.
    plt.title(f"Interactive readout: {branch_mix}")  # title with selected branch mix.
    plt.ylabel("count")  # label parameter axis.
    plt.show()  # render the readout chart.

interact(architecture_readout, input_channels=IntSlider(value=32, min=4, max=128, step=4), output_channels=IntSlider(value=64, min=8, max=160, step=8), bottleneck=IntSlider(value=8, min=2, max=64, step=2), branch_mix=Dropdown(value="inception", options=["plain 3×3", "residual block", "inception"]))  # launch live sliders in Colab, or execute once with fallback widgets.
```

▶ What you'll see: parameter counts jump when channels and kernel sizes grow, while bottlenecks control Inception branch cost.
