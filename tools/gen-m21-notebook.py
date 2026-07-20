#!/usr/bin/env python3
"""Generate afp/notebooks/M21-diffusion.ipynb.

A runnable, VERY beginner-friendly Colab notebook for module M21: diffusion
models and visual generation. It uses only synthetic 2D points as the stand-in
for images, then walks through forward noising, epsilon prediction, a tiny MLP
denoiser, reverse sampling, conditioning, classifier-free guidance, and the
plain-English bridge to real text-to-image/video systems.
"""
import json, os
cells = []
def md(t):   cells.append({"cell_type": "markdown", "metadata": {}, "source": t.strip("\n").splitlines(keepends=True)})
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
try:
    from nbfmt import format_source as _fmt_src
except Exception:
    def _fmt_src(s): return s
def code(s): cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": _fmt_src(s).strip("\n").splitlines(keepends=True)})

# ------------------------------------------------------------------- intro
md(r"""
# M21 · Diffusion & Visual Generation — ✍️ Toy Example, Step by Tiny Step

**Companion to lesson M21. Written for someone new to ML.**

Diffusion models learn to **generate** by learning to **denoise**. Instead of downloading real
images or big models, this notebook uses a tiny synthetic 2D "picture world": two colored clouds of
points. Every major idea gets a **Toy example**, every code cell prints the numbers it computes, and
nearly every idea has a picture. Run top to bottom; nothing needs the internet.

**What you'll do:**
- Add Gaussian noise until data becomes nearly pure noise (**forward / diffusion process**).
- Train a tiny MLP to predict the noise (**epsilon prediction**).
- Start from noise and repeatedly denoise to make new samples (**reverse / sampling process**).
- Add class labels (**conditioning**) and adjust label strength (**classifier-free guidance**).
- Map the toy to real text-to-image and video systems.
""")

md(r"""
## Big idea · Toy example overview

A **forward process** (also called the **diffusion process**) gradually corrupts data by adding
random Gaussian noise. A **reverse process** (also called the **denoising process**) learns the
opposite direction: start from noise, remove a little noise at a time, and end with a new sample.

Pipeline:

`data point → add a little noise → add more noise → pure-ish noise`

then, after training:

`pure noise → denoise → denoise → generated data point`

**Good for:** generating images, audio, video, molecules, or any data where "start random, refine
step by step" is useful.

**Watch out for:** diffusion is iterative, so sampling can be slower than one-shot generators; the
denoiser must be trained carefully because tiny errors happen many times.
""")

md(r"""
## Step 0 · Setup

Import NumPy (arrays), scikit-learn (a tiny MLP), and Matplotlib (pictures). Fix the **seed** so the
printed numbers are reproducible, and define a tiny `log()` helper.
""")
code(r"""
import warnings
import numpy as np
import matplotlib.pyplot as plt
from sklearn.neural_network import MLPRegressor
from sklearn.exceptions import ConvergenceWarning

warnings.filterwarnings("ignore", category=ConvergenceWarning)
np.random.seed(0)
plt.rcParams["figure.figsize"] = (6, 4)

def log(label, value):
    print(f"[{label}] {value}")

def equal_axes(ax):
    ax.set_aspect("equal", adjustable="box")
    ax.grid(True, alpha=0.2)

log("setup", "tools ready — NumPy + scikit-learn MLPRegressor + Matplotlib, seed fixed to 0")
""")

md(r"""
## Big idea · Toy example picture

Before doing math, here is the whole chain as a tiny drawing: the left side destroys structure by
adding noise; the right side learns to rebuild structure by denoising.
""")
code(r"""
log("pipeline step 1", "forward: data -> noisy data -> almost pure noise")
log("pipeline step 2", "reverse: pure noise -> denoise repeatedly -> generated data")

fig, ax = plt.subplots(figsize=(9, 2.8))
ax.axis("off")
boxes = [("data", 0.08), ("add noise", 0.28), ("noise", 0.48), ("denoise", 0.68), ("new data", 0.88)]
for text, x in boxes:
    ax.text(x, 0.55, text, ha="center", va="center",
            bbox=dict(boxstyle="round,pad=0.35", fc="white", ec="black"))
for x0, x1, label in [(0.14, 0.22, "forward"), (0.34, 0.42, "forward"),
                      (0.54, 0.62, "reverse"), (0.74, 0.82, "reverse")]:
    ax.annotate("", xy=(x1, 0.55), xytext=(x0, 0.55), arrowprops=dict(arrowstyle="->", lw=2))
    ax.text((x0+x1)/2, 0.74, label, ha="center", fontsize=9)
ax.set_title("Diffusion in one picture")
plt.show()
""")

# ------------------------------------------------------------------- data
md(r"""
---
# Part A · Our tiny visual world

## Toy example · two labeled 2D blobs as fake "images"

Real image models learn from millions of images. Here, each "image" is just a 2D point. The two
classes are two clouds: class 0 on the left and class 1 on the right.

**Good for:** seeing every step in 2D without heavy models.

**Watch out for:** this is not photo-realistic generation; it is the same *mechanism* on a toy
distribution.
""")
code(r"""
n_per_class = 140
class0 = np.random.normal(loc=[-2.0, -0.25], scale=[0.35, 0.28], size=(n_per_class, 2))
class1 = np.random.normal(loc=[ 2.0,  0.25], scale=[0.35, 0.28], size=(n_per_class, 2))
X = np.vstack([class0, class1])
y = np.array([0]*n_per_class + [1]*n_per_class)

log("data shape", X.shape)
log("class counts", {0: int((y == 0).sum()), 1: int((y == 1).sum())})
log("overall mean", np.round(X.mean(axis=0), 3).tolist())
log("overall std", np.round(X.std(axis=0), 3).tolist())
log("first 3 points", np.round(X[:3], 3).tolist())

plt.scatter(X[:,0], X[:,1], c=y, cmap="coolwarm", s=22)
plt.title("Toy data: two 2D classes (our fake image world)")
plt.xlabel("feature 1"); plt.ylabel("feature 2"); equal_axes(plt.gca()); plt.show()
""")

# ------------------------------------------------------------------- forward process
md(r"""
---
# Part B · Forward diffusion: data → noise

## Toy example · the noise schedule (beta, alpha, alpha-bar)

At each step `t`, the **noise schedule** says how much fresh Gaussian noise to add.

- **beta_t** = the small amount of new noise added at step `t`.
- **alpha_t = 1 - beta_t** = the fraction of signal kept at that step.
- **alpha_bar_t** = cumulative product of alphas up to `t`; it tells how much original signal remains.

**Good for:** controlling a smooth path from clean data to nearly pure noise.

**Watch out for:** if beta is too large too early, data gets destroyed abruptly; if too small, many
steps are needed.
""")

md(r"""
## Forward process · Step 0 · What are we actually doing?

Forget images for a second. Picture **one single number** — say the brightness of one pixel, `x0 = 2.0`.
The forward process just does this, over and over: **shrink the number a little, then add a little random
noise.** Repeat ~1000 times and the original `2.0` is buried under randomness — it looks like static.

Why bother destroying data? Because it hands us free practice problems: at every step we know exactly how
much noise we added, so later we can train a network to *undo* one step. We are manufacturing "before and
after noise" pairs.

We will walk one number through the first few steps **by hand**, printing every intermediate value.
""")

md(r"""
## Forward process · Step 1 · The per-step formula (one step, by hand)

One noising step is:

`x_t = sqrt(alpha_t) * x_(t-1)  +  sqrt(1 - alpha_t) * eps_t`

Read each piece slowly:

- `x_(t-1)` = the value we have right now (before this step).
- `alpha_t` = the fraction of "signal power" we **keep** this step. If `beta_t = 0.1` (the noise we add),
  then `alpha_t = 1 - beta_t = 0.9`.
- `sqrt(alpha_t)` = the actual multiplier on the value. **Why the square root?** Because when you add two
  numbers, their *variances* (spread²) add, not their sizes. Using square roots makes
  `(sqrt(alpha_t))² + (sqrt(1-alpha_t))² = alpha_t + (1-alpha_t) = 1`, so the total spread stays ~1 the
  whole time instead of blowing up.
- `eps_t` = a fresh random noise number, drawn from the standard bell curve `N(0,1)` (mostly between -2 and 2).
- `sqrt(1 - alpha_t)` = how strongly we mix that noise in.

Let's do **step 1** with `x0 = 2.0`, `alpha_1 = 0.9`, and a drawn noise `eps_1 = -0.5`.
""")
code(r"""
x0_demo = 2.0
alpha_1 = 0.9          # keep fraction (beta_1 = 0.1)
eps_1   = -0.5         # the fresh noise drawn for step 1

signal_part = np.sqrt(alpha_1) * x0_demo       # sqrt(0.9) * 2.0
noise_part  = np.sqrt(1 - alpha_1) * eps_1     # sqrt(0.1) * (-0.5)
x1 = signal_part + noise_part

log("sqrt(alpha_1)", round(float(np.sqrt(alpha_1)), 3))                 # -> 0.949
log("signal_part = sqrt(alpha_1)*x0", round(float(signal_part), 3))     # -> 1.897
log("sqrt(1-alpha_1)", round(float(np.sqrt(1 - alpha_1)), 3))           # -> 0.316
log("noise_part = sqrt(1-alpha_1)*eps_1", round(float(noise_part), 3))  # -> -0.158
log("x1 = signal_part + noise_part", round(float(x1), 3))               # -> 1.739
""")

md(r"""
## Forward process · Step 2 · Keep going: steps 2, 3, 4

Step 2 does the exact same thing, but now the input is `x1` instead of `x0`. Then step 3 uses `x2`, and
step 4 uses `x3`. Each step uses its own fresh noise `eps_t`. We use a tiny 4-step schedule so you can
follow every number:

`alpha = [0.9, 0.8, 0.7, 0.6]`  (so `beta = [0.1, 0.2, 0.3, 0.4]` — a bit more noise each step)
and drawn noises `eps = [-0.5, 1.2, -0.3, 0.8]`.

Watch the "keep fraction" `sqrt(alpha_t)` shrink (0.949 → 0.894 → 0.837 → 0.775) while the noise mix
`sqrt(1-alpha_t)` grows.
""")
code(r"""
x0_demo = 2.0
demo_alpha = np.array([0.9, 0.8, 0.7, 0.6])     # kept fraction each step
eps_chain  = np.array([-0.5, 1.2, -0.3, 0.8])   # fresh noise at steps 1..4

x = x0_demo
history = [x0_demo]
for t in range(4):
    a = demo_alpha[t]; e = eps_chain[t]
    signal_part = np.sqrt(a) * x           # keep sqrt(alpha) of the CURRENT value
    noise_part  = np.sqrt(1 - a) * e       # add sqrt(1-alpha) of fresh noise
    x = signal_part + noise_part
    history.append(float(x))
    log(f"step {t+1}", {
        "sqrt(a)": round(float(np.sqrt(a)), 3),
        "signal=sqrt(a)*prev": round(float(signal_part), 3),
        "sqrt(1-a)": round(float(np.sqrt(1 - a)), 3),
        "noise=sqrt(1-a)*eps": round(float(noise_part), 3),
        f"x{t+1}": round(float(x), 3),
    })

x4_chain = float(x)
log("clean start x0", x0_demo)                          # -> 2.0
log("noisy x4 after 4 hand steps", round(x4_chain, 3))  # -> 1.735

plt.plot(range(5), history, "-o")
plt.axhline(0, color="gray", ls="--", alpha=0.5)
for t, v in enumerate(history):
    plt.text(t + 0.03, v + 0.03, f"x{t}={v:.2f}", fontsize=8)
plt.title("One number pushed from clean (x0=2.0) toward noise over 4 steps")
plt.xlabel("step t"); plt.ylabel("value"); plt.grid(True, alpha=0.25); plt.show()
""")

md(r"""
## Forward process · Step 3 · alpha-bar: the shortcut that skips the loop

Doing 4 steps by hand was already tedious; real models use ~1000. Nobody wants a 1000-step loop just to
make one training example. The shortcut lets us **jump straight to step `t` in one line.**

The trick is **`alpha_bar_t`** ("alpha-bar"), which is just **all the alphas multiplied together** up to
step `t`:

`alpha_bar_1 = 0.9`
`alpha_bar_2 = 0.9 * 0.8 = 0.72`
`alpha_bar_3 = 0.72 * 0.7 = 0.504`
`alpha_bar_4 = 0.504 * 0.6 = 0.3024`

Then the shortcut is: `x_t = sqrt(alpha_bar_t) * x0 + sqrt(1 - alpha_bar_t) * eps`, using **one** noise
`eps` instead of four.

**Careful — a subtle point:** the 4 hand-steps used 4 *different* noises; the shortcut uses 1. So they will
not give the identical value for a *specific* set of draws — but the four small noises always bundle into
exactly one equivalent noise. Below we find that single equivalent noise and confirm it reproduces the
hand-chained `x4` exactly.
""")
code(r"""
# alpha-bar = running product of the kept fractions (one multiply at a time)
ab = 1.0
for t in range(4):
    ab = ab * demo_alpha[t]
    log(f"alpha_bar_{t+1}", round(float(ab), 4))   # -> 0.9, 0.72, 0.504, 0.3024
alpha_bar_4 = float(ab)

signal_weight = np.sqrt(alpha_bar_4)               # sqrt(0.3024)
noise_weight  = np.sqrt(1 - alpha_bar_4)           # sqrt(0.6976)
log("shortcut signal weight sqrt(alpha_bar_4)", round(float(signal_weight), 3))   # -> 0.550
log("shortcut noise  weight sqrt(1-alpha_bar_4)", round(float(noise_weight), 3))  # -> 0.835

# the four noises (-0.5, 1.2, -0.3, 0.8) bundle into ONE equivalent noise:
eps_effective = (x4_chain - signal_weight * x0_demo) / noise_weight
x4_shortcut = signal_weight * x0_demo + noise_weight * eps_effective
log("single equivalent noise", round(float(eps_effective), 3))          # -> 0.760
log("shortcut x4 (one line, one noise)", round(float(x4_shortcut), 3))  # -> 1.735
log("hand-chained x4 (four steps)", round(x4_chain, 3))                 # -> 1.735  (same!)
assert abs(x4_shortcut - x4_chain) < 1e-9

plt.bar(["signal weight\nsqrt(alpha_bar_4)", "noise weight\nsqrt(1-alpha_bar_4)"],
        [signal_weight, noise_weight], color=["tab:green", "tab:red"])
plt.title("By step 4 the noise weight has overtaken the signal weight")
plt.ylabel("weight"); plt.grid(True, axis="y", alpha=0.25); plt.show()
""")

md(r"""
## Forward process · Step 4 · Pseudocode (both ways)

The same idea in plain-English pseudocode. The loop is the honest slow version; the shortcut is what code
actually uses.

```
FORWARD, per-step (the honest slow way):
    x = x0                                   # start clean
    for t = 1, 2, ..., T:
        eps = draw one number from N(0,1)    # fresh noise
        x = sqrt(alpha_t) * x + sqrt(1 - alpha_t) * eps   # shrink signal, add noise
    return x                                 # x_T, almost pure noise

FORWARD, shortcut (one line, no loop):
    alpha_bar_t = alpha_1 * alpha_2 * ... * alpha_t       # multiply kept fractions
    eps = draw one number from N(0,1)
    x_t = sqrt(alpha_bar_t) * x0 + sqrt(1 - alpha_bar_t) * eps
    return x_t                               # jumps straight to step t
```

Both produce a sample with the same statistics; the shortcut just skips the loop. Now here is that shortcut
written as the formal formula.
""")

md(r"""
## Forward process math

Here is the shortcut you just built, written formally (the "closed form"):

$$x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\epsilon,\quad \epsilon \sim \mathcal{N}(0, I).$$

Plain English: noisy point `x_t` is a weighted mix of the original data point `x0` and random
Gaussian noise `eps`. As `alpha_bar_t` shrinks, the original point matters less and the noise matters
more.
""")

md(r"""
## Forward process · Toy example: WHY those noises always bundle into one

In Step 3 the four separate noises collapsed into a single equivalent noise. That is not luck — it always
happens, because of **one fact: the variances of independent Gaussians add.** Add two independent noises with standard
deviations 0.6 and 0.8 and you get a *single* Gaussian with std `sqrt(0.6^2 + 0.8^2) = 1.0`. Two random
kicks merge into one.

Compose two single steps (`x_t = sqrt(alpha_t) x_{t-1} + sqrt(1-alpha_t) eps_t`, and
`alpha_bar_t = alpha_1 * ... * alpha_t`):

`x_2 = sqrt(alpha_1 alpha_2) x_0 + [ sqrt(alpha_2(1-alpha_1)) eps_1 + sqrt(1-alpha_2) eps_2 ]`

The bracket is two independent noises; their variances add to
`alpha_2(1-alpha_1) + (1-alpha_2) = 1 - alpha_1 alpha_2`. So the bracket collapses to
`sqrt(1-alpha_bar_2) eps`, and the signal coefficient is `sqrt(alpha_bar_2)` — exactly the shortcut. Below
we check this both algebraically and with 20000 random draws.
""")
code(r"""
# variances of independent Gaussians ADD -> two noise kicks become one
a1, a2 = 0.9, 0.8                      # alpha_1, alpha_2 (fraction of signal kept each step)
noise1_coef = np.sqrt(a2 * (1 - a1))   # coefficient on eps_1 after step 2
noise2_coef = np.sqrt(1 - a2)          # coefficient on eps_2
combined_std = np.sqrt(noise1_coef**2 + noise2_coef**2)   # variances add

ab2 = a1 * a2                          # alpha_bar_2
shortcut_noise_coef = np.sqrt(1 - ab2)
shortcut_signal_coef = np.sqrt(ab2)

log("noise-1 coef (on eps_1)", round(float(noise1_coef), 3))               # -> 0.283
log("noise-2 coef (on eps_2)", round(float(noise2_coef), 3))               # -> 0.447
log("combined std of the two noises", round(float(combined_std), 3))       # -> 0.529
log("shortcut noise coef sqrt(1-alpha_bar_2)", round(float(shortcut_noise_coef), 3))   # -> 0.529
log("shortcut signal coef sqrt(alpha_bar_2)", round(float(shortcut_signal_coef), 3))   # -> 0.849
assert abs(combined_std - shortcut_noise_coef) < 1e-9

# empirical check: adding noise twice matches the one-shot spread
demo_rng = np.random.RandomState(0)
n_samples_demo = 20000
two_step = noise1_coef * demo_rng.normal(size=n_samples_demo) + noise2_coef * demo_rng.normal(size=n_samples_demo)
one_shot = shortcut_noise_coef * demo_rng.normal(size=n_samples_demo)
log("empirical std two-step", round(float(two_step.std()), 3))   # -> ~0.529
log("empirical std one-shot", round(float(one_shot.std()), 3))   # -> ~0.529
assert abs(two_step.std() - one_shot.std()) < 0.03

plt.hist(two_step, bins=50, alpha=0.6, density=True, label="add noise twice")
plt.hist(one_shot, bins=50, alpha=0.6, density=True, label="one-shot shortcut")
plt.title("Two noise steps merge into one (independent variances add)")
plt.legend(); plt.grid(True, alpha=0.25); plt.show()
""")

code(r"""
T = 60
beta = np.linspace(0.001, 0.12, T)
alpha = 1.0 - beta
alpha_bar = np.cumprod(alpha)

log("T steps", T)
log("beta first/middle/last", np.round([beta[0], beta[T//2], beta[-1]], 4).tolist())
log("alpha_bar first/middle/last", np.round([alpha_bar[0], alpha_bar[T//2], alpha_bar[-1]], 5).tolist())
log("signal left at final step", f"{100*alpha_bar[-1]:.2f}%")
assert np.all(np.diff(alpha_bar) < 0)

fig, ax = plt.subplots(1, 2, figsize=(10, 3.6))
ax[0].plot(beta, "-o", markersize=3); ax[0].set_title("beta_t: fresh noise per step")
ax[0].set_xlabel("t"); ax[0].set_ylabel("beta")
ax[1].plot(alpha_bar, "-o", markersize=3); ax[1].set_title("alpha_bar_t: original signal left")
ax[1].set_xlabel("t"); ax[1].set_ylabel("alpha_bar")
plt.tight_layout(); plt.show()
""")

md(r"""
## Forward process · Toy example: watch points become noise

We apply the closed form to the same data at several times. Early pictures still show two blobs;
late pictures should look like almost standard normal noise.
""")
code(r"""
def q_sample_batch(x0, t, eps=None):
    t = np.asarray(t, dtype=int)
    if eps is None:
        eps = np.random.normal(size=x0.shape)
    ab = alpha_bar[t][:, None]
    return np.sqrt(ab) * x0 + np.sqrt(1.0 - ab) * eps, eps

fixed_eps = np.random.normal(size=X.shape)
times = [None, 5, 20, 40, 59]
names = ["raw data", "t=5", "t=20", "t=40", "t=59"]
fig, ax = plt.subplots(1, len(times), figsize=(15, 3.0))
for j, (name, t) in enumerate(zip(names, times)):
    if t is None:
        pts = X
        log(name, f"mean={np.round(pts.mean(axis=0),3).tolist()} var={pts.var():.3f}")
    else:
        pts, _ = q_sample_batch(X, np.full(len(X), t), fixed_eps)
        log(name, f"alpha_bar={alpha_bar[t]:.5f} mean={np.round(pts.mean(axis=0),3).tolist()} var={pts.var():.3f}")
    ax[j].scatter(pts[:,0], pts[:,1], c=y, cmap="coolwarm", s=10, alpha=0.75)
    ax[j].set_title(name); equal_axes(ax[j])
x_T, _ = q_sample_batch(X, np.full(len(X), T-1), fixed_eps)
log("x_T overall variance", round(float(x_T.var()), 3))
assert abs(float(x_T.var()) - 1.0) < 0.35
plt.tight_layout(); plt.show()
""")

md(r"""
## Forward process · Toy example: one point, one noise vector

For one original point, we reuse one fixed noise vector. This lets you see exactly how the formula
slides from data toward noise as `t` grows.
""")
code(r"""
point = X[[0]]
eps_one = np.array([[1.0, -0.75]])
trace_t = [0, 15, 30, 45, 59]
trace = []
for t in trace_t:
    xt, _ = q_sample_batch(point, np.array([t]), eps_one)
    signal_weight = float(np.sqrt(alpha_bar[t]))
    noise_weight = float(np.sqrt(1 - alpha_bar[t]))
    log(f"t={t}", f"sqrt(alpha_bar)={signal_weight:.3f}, sqrt(1-alpha_bar)={noise_weight:.3f}, x_t={np.round(xt[0],3).tolist()}")
    trace.append(xt[0])
trace = np.array(trace)

plt.plot(trace[:,0], trace[:,1], "-o", label="same point over t")
plt.scatter(point[:,0], point[:,1], c="green", s=120, marker="*", label="original x0")
plt.scatter(eps_one[:,0], eps_one[:,1], c="black", s=90, marker="x", label="noise eps")
for t, p in zip(trace_t, trace):
    plt.text(p[0]+0.04, p[1]+0.04, f"t={t}", fontsize=8)
plt.title("One point moving from data toward noise")
plt.legend(); equal_axes(plt.gca()); plt.show()
""")

# ------------------------------------------------------------------- target
md(r"""
---
# Part C · The training target: predict epsilon (the noise)

## Epsilon prediction · Toy example

The denoiser receives `(x_t, t)` and predicts **epsilon**, the exact noise that was mixed in. This
is called **epsilon prediction**.

Why predict noise? If the model knows the noise, it can subtract it out and recover an estimate of
the clean point.

**Good for:** a stable supervised target: "what noise was added?"

**Watch out for:** the model must know `t`; a tiny amount of noise and a huge amount of noise need
different denoising behavior.
""")

md(r"""
## Epsilon prediction · Step 1 · The denoiser's one job

We can now make noisy points. Time to build the thing that will eventually *generate*: a network whose only
job is, **given a noisy point `x_t` and which step `t` it came from, guess the noise `eps` that was mixed
in.** Call its guess `eps_hat`.

We *always* know the right answer, because we drew `eps` ourselves when we noised the data. So training is
plain supervised learning: show `(x_t, t)`, compare `eps_hat` to the true `eps`, nudge the weights.
""")

md(r"""
## Epsilon prediction · Step 2 · From the noise back to the clean point (by hand)

Why is guessing the noise useful? Because if you know the noise, you can **subtract it out** and recover the
clean point. Rearrange the forward shortcut `x_t = sqrt(ab)*x0 + sqrt(1-ab)*eps` to solve for `x0`:

`x0_hat = (x_t - sqrt(1 - alpha_bar_t) * eps_hat) / sqrt(alpha_bar_t)`

Hand-trace: start from `x0 = 2.0`, noise it to a step where `alpha_bar_t = 0.64` using `eps = -0.5`, then
recover `x0` from the noisy value.
""")
code(r"""
x0_true = 2.0
ab_c = 0.64                 # alpha_bar at this step
eps_true_c = -0.5           # the noise we mixed in

x_t_c = np.sqrt(ab_c) * x0_true + np.sqrt(1 - ab_c) * eps_true_c   # forward: 0.8*2 + 0.6*(-0.5)
log("noised x_t", round(float(x_t_c), 3))                          # -> 1.3

eps_hat_c = -0.5            # pretend the denoiser guessed the noise perfectly
x0_hat_c = (x_t_c - np.sqrt(1 - ab_c) * eps_hat_c) / np.sqrt(ab_c) # (1.3 - 0.6*(-0.5))/0.8
log("recovered x0_hat", round(float(x0_hat_c), 3))                 # -> 2.0  (back to the start!)
assert abs(x0_hat_c - x0_true) < 1e-9
""")

md(r"""
## Epsilon prediction · Step 3 · The loss, by hand (mean squared error)

The denoiser will not be perfect, so we need a score for "how wrong was the guess." We use **mean squared
error (MSE)**: subtract guess from truth, square it (so over- and under-guesses both count as positive),
average over the numbers. Small MSE = good guess. Example: true `eps = [-0.5, 0.4]`, guess `eps_hat =
[-0.3, 0.5]`.
""")
code(r"""
eps_true_vec = np.array([-0.5, 0.4])
eps_hat_vec  = np.array([-0.3, 0.5])
errors = eps_hat_vec - eps_true_vec           # [0.2, 0.1]
squared = errors ** 2                          # [0.04, 0.01]
mse = squared.mean()                           # (0.04 + 0.01)/2
log("errors (guess - truth)", errors.tolist())     # -> [0.2, 0.1]
log("squared errors", squared.tolist())            # -> [0.04, 0.01]
log("MSE (the loss)", round(float(mse), 4))         # -> 0.025
""")

md(r"""
## Epsilon prediction · Step 4 · Training pseudocode

```
TRAIN the denoiser:
    repeat many times:
        x0  = a real data point
        t   = pick a random step 1..T
        eps = draw noise from N(0,1)
        x_t = sqrt(alpha_bar_t)*x0 + sqrt(1-alpha_bar_t)*eps    # forward shortcut
        eps_hat = denoiser(x_t, t)                              # the guess
        loss = mean( (eps_hat - eps)^2 )                        # MSE (Step 3)
        nudge denoiser weights to lower loss                    # gradient step
```

That is the entire training objective. Below we generate thousands of `(x_t, t) -> eps` pairs to fit a tiny
network to.
""")
code(r"""
def time_embed(t):
    u = np.asarray(t, dtype=float).reshape(-1, 1) / (T - 1)
    return np.hstack([u, np.sin(np.pi*u), np.cos(np.pi*u)])

def make_uncond_features(x, t):
    return np.hstack([x, time_embed(t)])

N_train = 3200
idx = np.random.randint(0, len(X), size=N_train)
t_train = np.random.randint(0, T, size=N_train)
eps_train = np.random.normal(size=(N_train, 2))
x_train_noisy, eps_target = q_sample_batch(X[idx], t_train, eps_train)
F_train = make_uncond_features(x_train_noisy, t_train)

log("training input features shape", F_train.shape)
log("training target eps shape", eps_target.shape)
log("one feature row [x_t0,x_t1,t,sin,cos]", np.round(F_train[0], 3).tolist())
log("one target eps row", np.round(eps_target[0], 3).tolist())

take = np.arange(0, N_train, 10)
plt.scatter(x_train_noisy[take,0], x_train_noisy[take,1], c=t_train[take], cmap="viridis", s=12)
plt.colorbar(label="t (later = noisier)")
plt.title("Training pairs: noisy x_t colored by timestep")
plt.xlabel("feature 1"); plt.ylabel("feature 2"); equal_axes(plt.gca()); plt.show()
""")

md(r"""
## Epsilon prediction · Toy example: noise ↔ clean data

The same closed form can be rearranged:

`x0_hat = (x_t - sqrt(1-alpha_bar_t) * eps_hat) / sqrt(alpha_bar_t)`

So predicting `eps` is equivalent to predicting a denoised `x0`.
""")
code(r"""
small = np.arange(8)
x0_small = X[idx[small]]
t_small = t_train[small]
eps_small = eps_train[small]
xt_small, _ = q_sample_batch(x0_small, t_small, eps_small)
ab = alpha_bar[t_small][:, None]
x0_recovered = (xt_small - np.sqrt(1-ab) * eps_small) / np.sqrt(ab)
max_err = float(np.abs(x0_recovered - x0_small).max())

log("timesteps used", t_small.tolist())
log("max recovery error using TRUE eps", f"{max_err:.12f}")
log("first original/noisy/recovered", {
    "x0": np.round(x0_small[0], 3).tolist(),
    "xt": np.round(xt_small[0], 3).tolist(),
    "recovered": np.round(x0_recovered[0], 3).tolist()
})
assert max_err < 1e-10

plt.scatter(x0_small[:,0], x0_small[:,1], c="green", s=90, marker="o", label="original x0")
plt.scatter(xt_small[:,0], xt_small[:,1], c="gray", s=70, marker="x", label="noisy x_t")
plt.scatter(x0_recovered[:,0], x0_recovered[:,1], c="orange", s=40, marker="+", label="recovered with true eps")
plt.title("If epsilon is known, x0 is recovered exactly")
plt.legend(); equal_axes(plt.gca()); plt.show()
""")

md(r"""
## Epsilon prediction · Toy example: predicting noise = pointing back to clean data (the "score")

Why is "predict the noise" the right target? Because the noise direction is (up to a known scale) the
**score** — the direction that increases data likelihood fastest. From the forward formula,
`x_t - sqrt(alpha_bar_t) x_0 = sqrt(1-alpha_bar_t) eps`, calculus gives:

`score = grad_x log p(x_t)  ≈  - eps / sqrt(1 - alpha_bar_t)`.

The noise `eps` points *away* from clean data; `-eps` points back toward it. Denoising is just repeatedly
stepping in the score direction (uphill in likelihood).
""")
code(r"""
eps_hat_demo = np.array([0.5, -0.3])                 # a predicted noise vector
t_score = 40
sig_score = float(np.sqrt(1 - alpha_bar[t_score]))
score_vec = -eps_hat_demo / sig_score                # score = -eps / sqrt(1-alpha_bar_t)
log("predicted eps", eps_hat_demo.tolist())                       # -> [0.5, -0.3]
log("sqrt(1-alpha_bar_t)", round(sig_score, 3))
log("score = -eps/sqrt(1-alpha_bar_t)", np.round(score_vec, 3).tolist())
log("reading", "score points OPPOSITE to eps -> back toward clean data")

plt.quiver(0, 0, eps_hat_demo[0], eps_hat_demo[1], angles="xy", scale_units="xy", scale=1,
           color="tab:red", label="eps (toward noise)")
plt.quiver(0, 0, score_vec[0], score_vec[1], angles="xy", scale_units="xy", scale=1,
           color="tab:green", label="score = -eps/... (toward clean)")
lim = 1.2 * max(np.abs(score_vec).max(), np.abs(eps_hat_demo).max())
plt.xlim(-lim, lim); plt.ylim(-lim, lim)
plt.title("Epsilon and the score point in opposite directions")
plt.legend(); equal_axes(plt.gca()); plt.show()
""")

md(r"""
## Time matters · Toy example

The same coordinate value can mean different things at different timesteps. That is why `t` is part
of the model input.
""")
code(r"""
show_t = np.array([0, 10, 25, 40, 59])
signal = np.sqrt(alpha_bar[show_t])
noise = np.sqrt(1 - alpha_bar[show_t])
for t, s, n in zip(show_t, signal, noise):
    log(f"t={int(t)} weights", f"signal={s:.3f}, noise={n:.3f}")

plt.plot(show_t, signal, "o-", label="signal weight sqrt(alpha_bar)")
plt.plot(show_t, noise, "o-", label="noise weight sqrt(1-alpha_bar)")
plt.title("The timestep tells the denoiser how much signal/noise to expect")
plt.xlabel("t"); plt.ylabel("weight"); plt.legend(); plt.grid(True, alpha=0.25); plt.show()
""")

md(r"""
## Time matters · Toy example: turning the step number into a vector (sinusoidal embedding)

You cannot feed the raw integer `t` (like 700) straight into a network and expect it to mean much. Real
diffusion models expand `t` into a **sinusoidal timestep embedding** — the same positional-encoding trick
transformers use for position (see M17). Each dimension is a sine or cosine at a different frequency:

`emb(t)[2i] = sin(t / 10000^(2i/d))`,  `emb(t)[2i+1] = cos(t / 10000^(2i/d))`.

Low frequencies change slowly across `t` (coarse "how far along am I"); high frequencies change fast (fine
detail). Stacking them lets the network read the noise level at several scales. (Our tiny MLP above used a
simpler 3-number version for speed; the mechanism is identical.)
""")
code(r"""
def sinusoidal_time_embedding(t, d=8):
    t = np.asarray(t, dtype=float).reshape(-1, 1)
    i = np.arange(d // 2)
    freqs = 1.0 / (10000.0 ** (2 * i / d))     # one frequency per sin/cos pair -> [1, 0.1, 0.01, 0.001]
    ang = t * freqs
    return np.concatenate([np.sin(ang), np.cos(ang)], axis=1)

for t in [2, 40, 700]:
    emb = sinusoidal_time_embedding([t], d=8)[0]
    log(f"embed(t={t})", np.round(emb, 3).tolist())   # t=2 -> [0.909,0.199,0.02,0.002, -0.416,0.98,1.0,1.0]

ts = np.arange(0, 1000)
E = sinusoidal_time_embedding(ts, d=8)
plt.figure(figsize=(8, 3.2))
for k in range(E.shape[1]):
    plt.plot(ts, E[:, k], alpha=0.8)
plt.title("Sinusoidal timestep embedding: each curve = one dimension at a different frequency")
plt.xlabel("timestep t"); plt.ylabel("value"); plt.grid(True, alpha=0.25); plt.show()
""")

# ------------------------------------------------------------------- training
md(r"""
---
# Part D · Train a tiny denoiser

## Tiny MLP denoiser · Toy example

We train a small **MLPRegressor** (a multilayer perceptron: a tiny neural network) to map
`[x_t, t features] → epsilon`.

**Good for:** showing the learning problem without GPUs or big libraries.

**Watch out for:** this toy MLP is much smaller than real diffusion denoisers, so samples are
imperfect but should learn the broad two-blob structure.
""")
code(r"""
denoiser = MLPRegressor(hidden_layer_sizes=(64, 64), activation="relu",
                        learning_rate_init=0.003, alpha=1e-4, batch_size=128,
                        max_iter=220, random_state=0, n_iter_no_change=30, tol=1e-5)
denoiser.fit(F_train, eps_target)
losses = np.array(denoiser.loss_curve_)

log("MLP iterations", int(denoiser.n_iter_))
log("initial loss", round(float(losses[0]), 4))
log("final loss", round(float(losses[-1]), 4))
log("loss improvement", round(float(losses[0] - losses[-1]), 4))
assert losses[-1] < losses[0]

plt.plot(losses, "-")
plt.title("Tiny denoiser training loss (lower is better)")
plt.xlabel("iteration"); plt.ylabel("MSE-ish loss"); plt.grid(True, alpha=0.25); plt.show()
""")

md(r"""
## Tiny MLP denoiser · Toy example: denoise a noisy batch

Now we ask the trained model to predict noise at one timestep, convert that prediction into
`x0_hat`, and compare it with the original clean points.
""")
code(r"""
check_idx = np.random.choice(len(X), size=80, replace=False)
t_check = np.full(len(check_idx), 35)
eps_check = np.random.normal(size=(len(check_idx), 2))
x_check, _ = q_sample_batch(X[check_idx], t_check, eps_check)
eps_hat = denoiser.predict(make_uncond_features(x_check, t_check))
ab = alpha_bar[t_check][:, None]
x0_hat = (x_check - np.sqrt(1-ab) * eps_hat) / np.sqrt(ab)

noisy_mse = float(np.mean((x_check - X[check_idx])**2))
denoised_mse = float(np.mean((x0_hat - X[check_idx])**2))
log("noisy vs clean MSE", round(noisy_mse, 4))
log("denoised vs clean MSE", round(denoised_mse, 4))
log("first predicted eps", np.round(eps_hat[0], 3).tolist())
assert denoised_mse < noisy_mse

plt.scatter(X[check_idx,0], X[check_idx,1], c="green", s=55, label="clean x0")
plt.scatter(x_check[:,0], x_check[:,1], c="gray", s=25, alpha=0.45, label="noisy x_t")
plt.scatter(x0_hat[:,0], x0_hat[:,1], c="orange", s=20, label="MLP denoised x0_hat")
plt.title("The learned denoiser moves noisy points back toward data")
plt.legend(); equal_axes(plt.gca()); plt.show()
""")

md(r"""
## Tiny MLP denoiser · Toy example: a denoising vector field

A **vector field** is a picture of arrows. Here each arrow points from a noisy location toward the
model's estimated cleaner location.
""")
code(r"""
t_field = 35
gx, gy = np.meshgrid(np.linspace(-3.2, 3.2, 13), np.linspace(-2.2, 2.2, 9))
grid = np.column_stack([gx.ravel(), gy.ravel()])
eps_grid = denoiser.predict(make_uncond_features(grid, np.full(len(grid), t_field)))
ab = alpha_bar[t_field]
x0_grid = (grid - np.sqrt(1-ab) * eps_grid) / np.sqrt(ab)
arrows = x0_grid - grid

log("field timestep", t_field)
log("first grid point", np.round(grid[0], 3).tolist())
log("first arrow dx,dy", np.round(arrows[0], 3).tolist())
log("median arrow length", round(float(np.median(np.linalg.norm(arrows, axis=1))), 3))

plt.scatter(X[:,0], X[:,1], c="lightgray", s=10, label="training data")
plt.quiver(grid[:,0], grid[:,1], arrows[:,0], arrows[:,1], angles="xy", scale_units="xy", scale=1.8, color="tab:blue")
plt.title("Denoising arrows at one timestep")
plt.legend(); equal_axes(plt.gca()); plt.show()
""")

# ------------------------------------------------------------------- sampling
md(r"""
---
# Part E · Reverse sampling: noise → new data

## Reverse process · Toy example: one DDPM-style step

During sampling, we start at `x_T ~ N(0, I)` and walk backward. A simplified DDPM-style update uses
the predicted noise to compute a mean for the previous step, then adds a tiny bit of fresh noise
unless we are at the final step.

**Good for:** generating new samples, not just cleaning existing ones.

**Watch out for:** each step depends on the previous step, so bad predictions can compound.
""")

md(r"""
## Reverse process · Step 0 · What are we doing now?

Forward destroyed a number into noise. **Reverse walks the other way:** start from a pure-noise value `x_T`
and repeatedly remove a little noise until a clean-looking value appears. The trained denoiser is our tool —
at each step it guesses the noise, and we subtract a bit of it.

We will do **one reverse step by hand**, reusing the forward toy: schedule `alpha = [0.9, 0.8, 0.7, 0.6]` so
`alpha_bar = [0.9, 0.72, 0.504, 0.3024]`, and the noisy value we ended on, `x_4 = 1.735`.
""")

md(r"""
## Reverse process · Step 1 · Guess the noise, estimate the clean point

Feed `x_4` to the denoiser; say it guesses `eps_hat = 0.760` (the equivalent noise from forward Step 3). Use
the same rearranged formula to get an estimate of the clean point:

`x0_hat = (x_t - sqrt(1 - alpha_bar_t) * eps_hat) / sqrt(alpha_bar_t)`
""")
code(r"""
x_4 = 1.735
alpha_bar_4 = 0.3024
eps_hat_r = 0.760

x0_hat_r = (x_4 - np.sqrt(1 - alpha_bar_4) * eps_hat_r) / np.sqrt(alpha_bar_4)
log("sqrt(1-alpha_bar_4)", round(float(np.sqrt(1 - alpha_bar_4)), 3))   # -> 0.835
log("x0_hat (estimated clean point)", round(float(x0_hat_r), 3))        # -> 2.0  (recovers the start!)
""")

md(r"""
## Reverse process · Step 2 · Don't jump all the way — take a small step

`x0_hat` is only a guess; jumping straight to it would trust one noisy prediction completely. Instead we step
**partway** from where we are (`x_4`) toward the clean estimate (`x0_hat`). The DDPM step's mean is a
weighted blend:

`mean = a * x0_hat + b * x_t`,
`a = sqrt(alpha_bar_{t-1}) * beta_t / (1 - alpha_bar_t)`,
`b = sqrt(alpha_t) * (1 - alpha_bar_{t-1}) / (1 - alpha_bar_t)`.

Then add back a little fresh noise of size `sigma_t` (except on the very last step), which keeps generation
varied. Hand-trace the step from `t=4` down to `t=3`:
""")
code(r"""
alpha_4 = 0.6; beta_4 = 0.4
alpha_bar_3 = 0.504

r_a = np.sqrt(alpha_bar_3) * beta_4 / (1 - alpha_bar_4)          # weight on x0_hat
r_b = np.sqrt(alpha_4) * (1 - alpha_bar_3) / (1 - alpha_bar_4)   # weight on x_4
mean_x3 = r_a * x0_hat_r + r_b * x_4
sigma_4 = np.sqrt((1 - alpha_bar_3) / (1 - alpha_bar_4) * beta_4)

log("weight a on x0_hat", round(float(r_a), 3))       # -> 0.407
log("weight b on x_4", round(float(r_b), 3))          # -> 0.551
log("mean for x_3 (partway from 1.735 toward 2.0)", round(float(mean_x3), 3))  # -> 1.77
log("sigma_4 (noise added back this step)", round(float(sigma_4), 3))          # -> 0.533
log("so x_3 = 1.77 + 0.533 * z", "z is fresh N(0,1); z=0 on the final step")
""")

md(r"""
## Reverse process · Step 3 · Repeat down to zero — pseudocode

```
SAMPLE (generate a new point):
    x = draw noise from N(0,1)                 # start at pure static, t = T
    for t = T, T-1, ..., 1:
        eps_hat = denoiser(x, t)               # guess the noise
        x0_hat  = (x - sqrt(1-alpha_bar_t)*eps_hat) / sqrt(alpha_bar_t)   # estimate clean
        mean    = a_t * x0_hat + b_t * x       # step partway toward it
        if t > 1:
            x = mean + sigma_t * draw N(0,1)   # add a little noise back
        else:
            x = mean                           # last step: no noise
    return x                                   # a brand-new generated point
```

Run this loop and static turns into a sample that looks like the training data.
""")

md(r"""
## Reverse process · Step 4 · Why add noise back? (the DDPM vs DDIM knob)

Adding `sigma_t * z` each step keeps the process **random**, so different starting static gives different
outputs (variety). If you instead set the added noise to zero, the process becomes **deterministic** — the
same start always gives the same sample, and you can even skip most steps. That deterministic variant is
**DDIM**, shown a few cells below. More noise back = more diversity; less = faster and more repeatable.
""")
code(r"""
t_demo = 45
x_demo = np.random.normal(size=(6, 2))
eps_demo = denoiser.predict(make_uncond_features(x_demo, np.full(len(x_demo), t_demo)))
a = alpha[t_demo]; b = beta[t_demo]; ab = alpha_bar[t_demo]
mean_demo = (x_demo - (b / np.sqrt(1-ab)) * eps_demo) / np.sqrt(a)
noise_scale = np.sqrt(b)

log("reverse demo timestep", t_demo)
log("alpha, beta, alpha_bar", np.round([a, b, ab], 5).tolist())
log("noise scale for this step", round(float(noise_scale), 4))
log("first x_t", np.round(x_demo[0], 3).tolist())
log("first predicted eps", np.round(eps_demo[0], 3).tolist())
log("first mean for x_(t-1)", np.round(mean_demo[0], 3).tolist())

plt.scatter(x_demo[:,0], x_demo[:,1], c="gray", marker="x", s=80, label="current x_t")
plt.scatter(mean_demo[:,0], mean_demo[:,1], c="tab:blue", s=65, label="mean for previous step")
for p, q in zip(x_demo, mean_demo):
    plt.arrow(p[0], p[1], q[0]-p[0], q[1]-p[1], head_width=0.04, length_includes_head=True, alpha=0.6)
plt.title("One reverse update nudges points toward cleaner locations")
plt.legend(); equal_axes(plt.gca()); plt.show()
""")

md(r"""
## Reverse process · WHERE that update formula comes from (a blend, not magic)

The reverse mean is a **weighted average of two things you already have**: the model's estimate of the
clean point `x0_hat`, and where you currently are, `x_t`:

`mean = a * x0_hat + b * x_t`,
`a = sqrt(alpha_bar_{t-1}) * beta_t / (1 - alpha_bar_t)`,
`b = sqrt(alpha_t) * (1 - alpha_bar_{t-1}) / (1 - alpha_bar_t)`.

The compact DDPM update `mean = (1/sqrt(alpha_t)) (x_t - (beta_t/sqrt(1-alpha_bar_t)) eps_hat)` is *exactly*
this blend once you substitute `x0_hat = (x_t - sqrt(1-alpha_bar_t) eps_hat)/sqrt(alpha_bar_t)`. Each step
also adds a little noise of size `sigma_t = sqrt((1-alpha_bar_{t-1})/(1-alpha_bar_t) * beta_t)` (except the
last step). Intuition: **guess the clean point, move partway there, sprinkle a little noise back.** Below we
compute the mean both ways and confirm they match.
""")
code(r"""
t_blend = 45
x_blend = np.random.normal(size=(4, 2))
eps_blend = denoiser.predict(make_uncond_features(x_blend, np.full(len(x_blend), t_blend)))

a_t = alpha[t_blend]; b_t = beta[t_blend]; ab_t = alpha_bar[t_blend]; ab_prev = alpha_bar[t_blend - 1]
x0_hat_blend = (x_blend - np.sqrt(1 - ab_t) * eps_blend) / np.sqrt(ab_t)   # estimate the clean point

a_blend = np.sqrt(ab_prev) * b_t / (1 - ab_t)          # weight on x0_hat
b_blend = np.sqrt(a_t) * (1 - ab_prev) / (1 - ab_t)    # weight on x_t
mean_blend = a_blend * x0_hat_blend + b_blend * x_blend                    # blend form
mean_compact = (x_blend - (b_t / np.sqrt(1 - ab_t)) * eps_blend) / np.sqrt(a_t)   # compact DDPM form
sigma_t = np.sqrt((1 - ab_prev) / (1 - ab_t) * b_t)    # step noise size

log("blend weights [a on x0_hat, b on x_t]", [round(float(a_blend), 3), round(float(b_blend), 3)])
log("sigma_t (step noise size)", round(float(sigma_t), 4))
log("mean via blend   (first row)", np.round(mean_blend[0], 4).tolist())
log("mean via compact (first row)", np.round(mean_compact[0], 4).tolist())
log("max abs difference between the two forms", float(np.abs(mean_blend - mean_compact).max()))  # -> ~0
assert np.abs(mean_blend - mean_compact).max() < 1e-9
""")

md(r"""
## Reverse process · Toy example: sample step by step

Now we repeat the reverse update from `t=59` down to `t=0`. The pictures show the same generated
points at a few moments in the reverse chain.
""")
code(r"""
def sample_unconditional(model, n=220, seed=1, keep=(59, 45, 30, 15, 0)):
    rng = np.random.RandomState(seed)
    x = rng.normal(size=(n, 2))
    snapshots = {T-1: x.copy()}
    for t in reversed(range(T)):
        t_vec = np.full(n, t)
        eps_pred = model.predict(make_uncond_features(x, t_vec))
        a = alpha[t]; b = beta[t]; ab = alpha_bar[t]
        mean = (x - (b / np.sqrt(1-ab)) * eps_pred) / np.sqrt(a)
        if t > 0:
            x = mean + np.sqrt(b) * rng.normal(size=x.shape)
        else:
            x = mean
        if t in keep:
            snapshots[t] = x.copy()
    return x, snapshots

generated, gen_snaps = sample_unconditional(denoiser, n=240, seed=2)
for t in [59, 45, 30, 15, 0]:
    pts = gen_snaps[t]
    log(f"snapshot t={t}", f"mean={np.round(pts.mean(axis=0),3).tolist()} std={np.round(pts.std(axis=0),3).tolist()}")

fig, ax = plt.subplots(1, 5, figsize=(15, 3.0))
for j, t in enumerate([59, 45, 30, 15, 0]):
    pts = gen_snaps[t]
    ax[j].scatter(pts[:,0], pts[:,1], c="tab:purple", s=10, alpha=0.7)
    ax[j].set_title(f"t={t}"); equal_axes(ax[j])
plt.suptitle("Reverse sampling: noise gradually becomes a sample cloud", y=1.03)
plt.tight_layout(); plt.show()
""")

md(r"""
## Reverse process · Toy example: generated cloud vs original cloud

The generated points should not match the training points exactly, but the cloud should land near
the same overall region and broad shape.
""")
code(r"""
real_mean = X.mean(axis=0)
gen_mean = generated.mean(axis=0)
real_std = X.std(axis=0)
gen_std = generated.std(axis=0)
mean_gap = float(np.linalg.norm(gen_mean - real_mean))
shape_gap = float(np.linalg.norm(gen_std - real_std))

log("real mean", np.round(real_mean, 3).tolist())
log("generated mean", np.round(gen_mean, 3).tolist())
log("mean gap", round(mean_gap, 3))
log("real std", np.round(real_std, 3).tolist())
log("generated std", np.round(gen_std, 3).tolist())
log("shape gap", round(shape_gap, 3))
assert mean_gap < 0.90
assert shape_gap < 1.80

fig, ax = plt.subplots(1, 2, figsize=(10, 4))
ax[0].scatter(X[:,0], X[:,1], c=y, cmap="coolwarm", s=14); ax[0].set_title("original data")
ax[1].scatter(generated[:,0], generated[:,1], c="tab:purple", s=14); ax[1].set_title("generated samples")
for axt in ax:
    equal_axes(axt)
plt.tight_layout(); plt.show()
""")

md(r"""
## Reverse process · Toy example: DDIM-style sampling in FEWER steps

DDPM takes ~T sequential steps (slow — this is diffusion's main weakness). **DDIM** changes only the
sampler (no retraining): it makes the reverse step **deterministic** (no added noise) and lets you **skip**
timesteps. Each step: predict `x0_hat` from `eps_hat`, then re-noise *directly* to the next chosen timestep
with the forward formula. Below we sample in 12 steps instead of T and compare.

**Good for:** fast sampling and reproducible outputs (same start noise -> same sample).

**Watch out for:** fully deterministic sampling reduces variety; too few steps lowers quality.
""")
code(r"""
def sample_ddim(model, n=240, num_steps=12, seed=3):
    rng = np.random.RandomState(seed)
    x = rng.normal(size=(n, 2))
    step_ts = np.linspace(T - 1, 0, num_steps + 1).round().astype(int)   # short, evenly spaced: T-1 -> 0
    for t, t_next in zip(step_ts[:-1], step_ts[1:]):
        eps_pred = model.predict(make_uncond_features(x, np.full(n, t)))
        ab_t = alpha_bar[t]
        x0_hat = (x - np.sqrt(1 - ab_t) * eps_pred) / np.sqrt(ab_t)       # estimate clean
        if t_next == 0:
            x = x0_hat                                                    # final step lands on the estimate
        else:
            ab_next = alpha_bar[t_next]
            x = np.sqrt(ab_next) * x0_hat + np.sqrt(1 - ab_next) * eps_pred   # re-noise to t_next, NO randomness
    return x

ddim_gen = sample_ddim(denoiser, n=240, num_steps=12, seed=3)
log("DDIM steps used", 12)
log("DDPM steps used earlier", T)
log("DDIM generated mean", np.round(ddim_gen.mean(axis=0), 3).tolist())
log("real data mean", np.round(X.mean(axis=0), 3).tolist())
mean_gap_ddim = float(np.linalg.norm(ddim_gen.mean(axis=0) - X.mean(axis=0)))
log("DDIM mean gap vs real", round(mean_gap_ddim, 3))
assert mean_gap_ddim < 1.2

fig, ax = plt.subplots(1, 2, figsize=(10, 4))
ax[0].scatter(generated[:,0], generated[:,1], c="tab:purple", s=12, alpha=0.7); ax[0].set_title(f"DDPM ({T} steps)")
ax[1].scatter(ddim_gen[:,0], ddim_gen[:,1], c="tab:green", s=12, alpha=0.7); ax[1].set_title("DDIM (12 steps)")
for axt in ax:
    equal_axes(axt)
plt.tight_layout(); plt.show()
""")

# ------------------------------------------------------------------- conditioning
md(r"""
---
# Part F · Conditioning: ask for a class

## Conditioning · Toy example

**Conditioning** means giving the denoiser extra information about what you want. In this toy, the
condition is a class label: "make class 0" or "make class 1." In real text-to-image systems, the
condition is often a text prompt.

**Good for:** controllable generation.

**Watch out for:** the model can ignore weak conditions or overfit strong ones.
""")

md(r"""
## Conditioning · Step 1 · What "condition" means (plain English)

So far the denoiser only saw `(x_t, t)` — it generates *some* sample, but we cannot ask for a *specific*
one. **Conditioning** adds one more input `c` describing what we want (here: a class label; in real systems:
a text prompt). The denoiser becomes `eps_hat = denoiser(x_t, t, c)`, so its noise guess — and therefore the
whole generated sample — depends on `c`.
""")

md(r"""
## Conditioning · Step 2 · Same noisy point, two different guesses (by hand)

The key mechanism: for the *same* noisy point, feeding a different condition changes the predicted noise. The
**difference** between the "with label" guess and the "no label" guess is the direction the label pulls
toward. Tiny made-up example:
""")
code(r"""
eps_no_label = np.array([0.40, 0.20])    # guess with NO condition
eps_label_1  = np.array([0.10, -0.10])   # guess when we ask for class 1
label_pull = eps_label_1 - eps_no_label  # the direction the label adds
log("eps with no label", eps_no_label.tolist())       # -> [0.4, 0.2]
log("eps asking for class 1", eps_label_1.tolist())   # -> [0.1, -0.1]
log("label pull = conditional - unconditional", label_pull.tolist())  # -> [-0.3, -0.3]
log("reading", "asking for class 1 pushes the noise guess down-left; that reshapes the sample")
""")
code(r"""
def label_embed(labels):
    labels = np.asarray(labels)
    out = np.zeros((len(labels), 3))
    out[labels == 0, 0] = 1.0
    out[labels == 1, 1] = 1.0
    out[labels < 0, 2] = 1.0
    return out

def make_cond_features(x, t, labels):
    return np.hstack([x, time_embed(t), label_embed(labels)])

centers = np.vstack([X[y == 0].mean(axis=0), X[y == 1].mean(axis=0)])
log("class 0 center", np.round(centers[0], 3).tolist())
log("class 1 center", np.round(centers[1], 3).tolist())
log("label 0 embedding", label_embed([0]).astype(int).tolist()[0])
log("label 1 embedding", label_embed([1]).astype(int).tolist()[0])
log("dropped-label embedding", label_embed([-1]).astype(int).tolist()[0])

plt.scatter(X[:,0], X[:,1], c=y, cmap="coolwarm", s=18)
plt.scatter(centers[:,0], centers[:,1], c="black", marker="X", s=160, label="class centers")
plt.title("Conditioning target: class 0 left, class 1 right")
plt.legend(); equal_axes(plt.gca()); plt.show()
""")

md(r"""
## Conditioning · Toy example: cross-attention (how an image patch "reads" the prompt)

In our toy the condition is a class label glued onto the input. Real text-to-image models inject the prompt
with **cross-attention** (the same attention as in M17), where the **image provides queries** and the
**text provides keys and values**. Q, K, V are not given — they are **learned linear projections** of the
features: `Q = h_img·W_Q`, `K = h_text·W_K`, `V = h_text·W_V`. Scores are scaled by `sqrt(d)` before the
softmax. Below, one image patch attends over two prompt words ("cat", "sky") and ends up listening mostly to
the word it aligns with.
""")
code(r"""
h_img = np.array([1.0, 0.0])                 # one image patch feature
g_cat = np.array([2.0, 0.0])                 # text token "cat"
g_sky = np.array([0.0, 2.0])                 # text token "sky"

W_Q = np.array([[1.0, 0.0], [0.0, 1.0]])     # learned projections (fixed here for a clean hand-trace)
W_K = np.array([[1.0, 1.0], [0.0, 1.0]])
W_V = np.array([[1.0, 0.0], [0.0, 3.0]])
d = 2

q = h_img @ W_Q                              # -> [1, 0]
k_cat, k_sky = g_cat @ W_K, g_sky @ W_K      # -> [2, 2], [0, 2]
v_cat, v_sky = g_cat @ W_V, g_sky @ W_V      # -> [2, 0], [0, 6]
log("query q", q.tolist())
log("keys  [cat, sky]", [k_cat.tolist(), k_sky.tolist()])
log("values[cat, sky]", [v_cat.tolist(), v_sky.tolist()])

scores = np.array([q @ k_cat, q @ k_sky]) / np.sqrt(d)   # -> [1.414, 0]
attn = np.exp(scores) / np.exp(scores).sum()             # softmax -> [0.804, 0.196]
out = attn[0] * v_cat + attn[1] * v_sky                  # -> [1.608, 1.176]
log("scaled scores [cat, sky]", np.round(scores, 3).tolist())
log("attention weights [cat, sky]", np.round(attn, 3).tolist())
log("attention output (info folded into the patch)", np.round(out, 3).tolist())
assert attn[0] > attn[1]

plt.bar(["cat", "sky"], attn, color=["tab:orange", "tab:blue"])
plt.title("Cross-attention: how much this image patch listens to each prompt word")
plt.ylabel("attention weight"); plt.grid(True, axis="y", alpha=0.25); plt.show()
""")

md(r"""
## Conditioning · Toy example: train with labels, sometimes dropped

For **classifier-free guidance**, we train one model that can work two ways:

- Conditional: label is present (`class 0` or `class 1`).
- Unconditional: label is dropped (we use a special "missing label" input).

Dropping labels during training teaches the same model both behaviors.
""")
code(r"""
N_cond = 4800
idx_c = np.random.randint(0, len(X), size=N_cond)
t_cond = np.random.randint(0, T, size=N_cond)
eps_cond = np.random.normal(size=(N_cond, 2))
x_cond_noisy, eps_cond_target = q_sample_batch(X[idx_c], t_cond, eps_cond)
labels_in = y[idx_c].copy()
drop_mask = np.random.rand(N_cond) < 0.18
labels_in[drop_mask] = -1
F_cond = make_cond_features(x_cond_noisy, t_cond, labels_in)

cond_denoiser = MLPRegressor(hidden_layer_sizes=(64, 64), activation="relu",
                             learning_rate_init=0.003, alpha=1e-4, batch_size=128,
                             max_iter=240, random_state=1, n_iter_no_change=35, tol=1e-5)
cond_denoiser.fit(F_cond, eps_cond_target)
cond_losses = np.array(cond_denoiser.loss_curve_)

log("conditional feature shape", F_cond.shape)
log("dropped-label training rows", int(drop_mask.sum()))
log("conditional initial loss", round(float(cond_losses[0]), 4))
log("conditional final loss", round(float(cond_losses[-1]), 4))
assert cond_losses[-1] < cond_losses[0]

plt.plot(cond_losses, color="tab:green")
plt.title("Conditional denoiser training loss")
plt.xlabel("iteration"); plt.ylabel("MSE-ish loss"); plt.grid(True, alpha=0.25); plt.show()
""")

md(r"""
## Conditioning · Toy example: generate class 0 vs class 1

At sampling time we feed the requested label every step. Class 0 samples should land on the left;
class 1 samples should land on the right.
""")
code(r"""
def predict_eps_cfg(model, x, t, label, w):
    t_vec = np.full(len(x), t)
    cond_labels = np.full(len(x), label)
    miss_labels = np.full(len(x), -1)
    eps_uncond = model.predict(make_cond_features(x, t_vec, miss_labels))
    eps_cond = model.predict(make_cond_features(x, t_vec, cond_labels))
    return eps_uncond + w * (eps_cond - eps_uncond)

def sample_conditional(label, n=160, guidance_w=1.0, seed=10):
    rng = np.random.RandomState(seed)
    x = rng.normal(size=(n, 2))
    for t in reversed(range(T)):
        eps_pred = predict_eps_cfg(cond_denoiser, x, t, label, guidance_w)
        a = alpha[t]; b = beta[t]; ab = alpha_bar[t]
        mean = (x - (b / np.sqrt(1-ab)) * eps_pred) / np.sqrt(a)
        if t > 0:
            x = mean + np.sqrt(b) * rng.normal(size=x.shape)
        else:
            x = mean
    return x

gen_c0 = sample_conditional(0, n=170, guidance_w=1.2, seed=30)
gen_c1 = sample_conditional(1, n=170, guidance_w=1.2, seed=31)
log("generated class 0 mean", np.round(gen_c0.mean(axis=0), 3).tolist())
log("generated class 1 mean", np.round(gen_c1.mean(axis=0), 3).tolist())
log("requested-class center distance", {
    "class0": round(float(np.linalg.norm(gen_c0.mean(axis=0) - centers[0])), 3),
    "class1": round(float(np.linalg.norm(gen_c1.mean(axis=0) - centers[1])), 3)
})
assert gen_c0.mean(axis=0)[0] < -0.25
assert gen_c1.mean(axis=0)[0] > 0.25

plt.scatter(gen_c0[:,0], gen_c0[:,1], c="tab:blue", s=16, alpha=0.75, label="requested class 0")
plt.scatter(gen_c1[:,0], gen_c1[:,1], c="tab:red", s=16, alpha=0.75, label="requested class 1")
plt.scatter(centers[:,0], centers[:,1], c="black", marker="X", s=160, label="real class centers")
plt.title("Conditional generation: samples follow the requested class")
plt.legend(); equal_axes(plt.gca()); plt.show()
""")

# ------------------------------------------------------------------- guidance
md(r"""
---
# Part G · Classifier-free guidance: turn up the prompt strength

## Classifier-free guidance · Toy example

**Classifier-free guidance** combines two predictions from the same model:

`guided eps = eps_uncond + w * (eps_cond - eps_uncond)`

- `eps_uncond`: prediction with no label/prompt.
- `eps_cond`: prediction with the label/prompt.
- `w`: guidance weight. Higher `w` pushes harder toward the condition.

**Good for:** stronger prompt following.

**Watch out for:** too much guidance can reduce diversity or overshoot into strange samples.
""")

md(r"""
## Classifier-free guidance · why is it called "classifier-FREE"?

The predecessor was **classifier guidance**: train a *separate* classifier `p(class | x_t)` that works on
noisy images, take its gradient (which points toward "looks more like this class"), and add it to each
denoising step. The problem: you need an extra, noise-robust classifier, and its gradients are fragile.

**Classifier-free** guidance gets the *same* push without any classifier, using Bayes' rule:

`grad log p(c | x) = grad log p(x | c) - grad log p(x)`

Those two terms are exactly the conditional and unconditional noise predictions (recall `eps ≈ -score`).
So `eps_guided = eps_uncond + w (eps_cond - eps_uncond)` reproduces the classifier's steering using **only
the diffusion model itself** — hence "classifier-free." This is *why* we trained the model with the label
sometimes dropped (the unconditional branch): we need `eps_uncond` at every step.
""")

md(r"""
## Classifier-free guidance · Step by step: turn one knob `w`

Read the formula `eps_guided = eps_uncond + w * (eps_cond - eps_uncond)` as: **start at the no-prompt guess,
then step `w` times along the "label pull" toward the prompt.**

- `w = 0`: ignore the prompt entirely (`eps_guided = eps_uncond`).
- `w = 1`: exactly the conditional guess.
- `w > 1`: *overshoot* past the conditional guess — stronger prompt adherence, but risk of artifacts.

Hand-trace with `eps_uncond = [0.4, 0.2]` and `eps_cond = [0.1, -0.1]` (so the pull is `[-0.3, -0.3]`):
""")
code(r"""
eps_uncond_g = np.array([0.4, 0.2])
eps_cond_g   = np.array([0.1, -0.1])
pull = eps_cond_g - eps_uncond_g          # [-0.3, -0.3]
for w in [0, 1, 3, 7]:
    eps_guided = eps_uncond_g + w * pull
    log(f"w={w} guided eps", np.round(eps_guided, 2).tolist())
# w=0 -> [0.4,0.2]; w=1 -> [0.1,-0.1]; w=3 -> [-0.5,-0.7]; w=7 -> [-1.7,-1.9] (big overshoot)
log("takeaway", "higher w = harder prompt push, but w=7 shoots far past the conditional guess")
""")

md(r"""
## Classifier-free guidance · the tradeoff to remember

- **High `w`** (e.g. 8-12): strong prompt adherence, but oversaturation, artifacts, and less variety.
- **Low `w`** (e.g. 2-4): diverse and natural, but the prompt may be only loosely followed.

Below we generate both toy classes across several `w` and watch the classes separate more (fidelity up)
while each cloud tightens (diversity down).
""")
code(r"""
x_guided_demo = np.array([[0.0, 0.0]])
t_guided_demo = 35
eps_un = cond_denoiser.predict(make_cond_features(x_guided_demo, [t_guided_demo], [-1]))[0]
eps_co = cond_denoiser.predict(make_cond_features(x_guided_demo, [t_guided_demo], [1]))[0]
for w in [0, 1, 3]:
    eps_g = eps_un + w * (eps_co - eps_un)
    log(f"w={w} guided eps", np.round(eps_g, 3).tolist())
log("conditional minus unconditional", np.round(eps_co - eps_un, 3).tolist())

origin = np.array([0, 0])
plt.quiver(*origin, *eps_un, angles="xy", scale_units="xy", scale=1, color="gray", label="unconditional eps")
plt.quiver(*origin, *eps_co, angles="xy", scale_units="xy", scale=1, color="tab:red", label="conditional eps")
eps_w3 = eps_un + 3 * (eps_co - eps_un)
plt.quiver(*origin, *eps_w3, angles="xy", scale_units="xy", scale=1, color="black", label="guided eps, w=3")
plt.xlim(-3, 3); plt.ylim(-3, 3); plt.title("Guidance extrapolates from unconditional toward conditional")
plt.legend(); equal_axes(plt.gca()); plt.show()
""")

md(r"""
## Classifier-free guidance · Toy example: compare w = 0, 1, 3

We generate both classes at several guidance weights. Higher guidance should separate the requested
classes more strongly, often making samples tighter and less diverse.
""")
code(r"""
guidance_weights = [0.0, 1.0, 3.0]
guidance_results = {}
for w in guidance_weights:
    a0 = sample_conditional(0, n=150, guidance_w=w, seed=100 + int(10*w))
    a1 = sample_conditional(1, n=150, guidance_w=w, seed=101 + int(10*w))
    sep = float(np.linalg.norm(a1.mean(axis=0) - a0.mean(axis=0)))
    spread0 = float(np.mean(np.linalg.norm(a0 - a0.mean(axis=0), axis=1)))
    spread1 = float(np.mean(np.linalg.norm(a1 - a1.mean(axis=0), axis=1)))
    spread = 0.5 * (spread0 + spread1)
    guidance_results[w] = {"c0": a0, "c1": a1, "sep": sep, "spread": spread}
    log(f"w={w}", f"class separation={sep:.3f}, average spread={spread:.3f}")

assert guidance_results[3.0]["sep"] > guidance_results[0.0]["sep"] + 0.30

fig, ax = plt.subplots(1, 3, figsize=(15, 4))
for j, w in enumerate(guidance_weights):
    a0 = guidance_results[w]["c0"]; a1 = guidance_results[w]["c1"]
    ax[j].scatter(a0[:,0], a0[:,1], c="tab:blue", s=12, alpha=0.7, label="class 0")
    ax[j].scatter(a1[:,0], a1[:,1], c="tab:red", s=12, alpha=0.7, label="class 1")
    ax[j].scatter(centers[:,0], centers[:,1], c="black", marker="X", s=130)
    ax[j].set_title(f"guidance w={w}\nsep={guidance_results[w]['sep']:.2f}, spread={guidance_results[w]['spread']:.2f}")
    equal_axes(ax[j])
ax[0].legend()
plt.tight_layout(); plt.show()
""")

md(r"""
## Guidance tradeoff · Toy example: fidelity vs diversity

**Fidelity** means "matches the requested class/prompt." **Diversity** means "many different-looking
samples." Guidance often improves fidelity but can reduce diversity.
""")
code(r"""
seps = [guidance_results[w]["sep"] for w in guidance_weights]
spreads = [guidance_results[w]["spread"] for w in guidance_weights]
for w, sep, spread in zip(guidance_weights, seps, spreads):
    log(f"w={w} tradeoff row", f"fidelity proxy separation={sep:.3f}; diversity proxy spread={spread:.3f}")

plt.plot(guidance_weights, seps, "o-", label="fidelity proxy: class separation")
plt.plot(guidance_weights, spreads, "o-", label="diversity proxy: within-class spread")
plt.title("Guidance tradeoff in the toy world")
plt.xlabel("guidance weight w"); plt.ylabel("metric value"); plt.legend(); plt.grid(True, alpha=0.25); plt.show()
""")

# ------------------------------------------------------------------- real world
md(r"""
---
# Part H · Real text-to-image / video systems (conceptual map)

## Real-world mapping · Toy example terms

Our toy point is a tiny stand-in for an image. In real systems:

- **Latent diffusion**: diffuse in a compressed **latent space** (a smaller learned representation),
  not directly in huge pixel space. This is faster.
- **U-Net denoiser**: an encoder that **downsamples** the image (grasping whole-scene structure) then a
  decoder that **upsamples** back to full resolution, with **skip connections** that copy fine detail from
  early to late layers — so it predicts noise using both coarse and fine features. Cross-attention layers
  are inserted at several resolutions so the prompt influences both. (Newer systems replace the U-Net with a
  transformer, "DiT", treating latent patches as tokens.)
- **Text encoder / CLIP-style conditioning**: turns a prompt like "a red bicycle" into vectors that
  condition the denoiser.
- **Video diffusion**: adds a time/temporal dimension, so the model must make frames that look good
  and move consistently.

**Good for:** practical high-resolution generation and prompt control.

**Watch out for:** prompts can be ambiguous; video adds temporal consistency problems; these models
can reflect biases in their training data.
""")

md(r"""
## Text-to-image · Step by step (end to end)

Putting every part together, here is how a real prompt becomes a picture. Each numbered step maps to a part
of this notebook:

1. **Encode the prompt.** A text encoder turns "a red bicycle" into vectors `c` (our toy used a class label).
2. **Start from static.** Draw a pure-noise *latent* `x_T` (our toy: a random 2D point).
3. **Denoise in a loop, with guidance.** For `t = T..1`: predict `eps_uncond` and `eps_cond`, combine with
   CFG, take one reverse step (Parts E + G).
4. **Decode.** A VAE decoder turns the finished latent into full-resolution pixels.

```
TEXT-TO-IMAGE:
    c = text_encoder(prompt)
    x = draw noise latent from N(0,1)
    for t = T..1:
        eps_uncond = denoiser(x, t, empty_prompt)
        eps_cond   = denoiser(x, t, c)
        eps        = eps_uncond + w*(eps_cond - eps_uncond)    # CFG (Part G)
        x          = reverse_step(x, eps, t)                   # Part E
    image = vae_decoder(x)                                     # latent -> pixels
    return image
```

**Video** does the same but the latent has an extra time axis (many frames at once), plus attention across
frames so motion stays consistent. Below: the toy-to-real mapping, then the VAE/latent compute win.
""")
code(r"""
log("toy x_t", "2 numbers")
log("real latent x_t", "many compressed image/video features")
log("toy condition", "class label 0 or 1")
log("real condition", "text prompt embedding")

fig, ax = plt.subplots(figsize=(10, 3.2))
ax.axis("off")
items = [
    ("prompt\n'class 1'", 0.10, 0.72),
    ("text encoder\n(CLIP-style)", 0.30, 0.72),
    ("noisy latent\nx_t", 0.10, 0.28),
    ("U-Net denoiser\npredict eps", 0.50, 0.50),
    ("less-noisy latent\nx_{t-1}", 0.78, 0.50),
]
for text, x0, y0 in items:
    ax.text(x0, y0, text, ha="center", va="center",
            bbox=dict(boxstyle="round,pad=0.35", fc="white", ec="black"))
for start, end in [((0.18,0.72),(0.24,0.72)), ((0.38,0.72),(0.45,0.56)),
                   ((0.18,0.28),(0.43,0.44)), ((0.58,0.50),(0.70,0.50))]:
    ax.annotate("", xy=end, xytext=start, arrowprops=dict(arrowstyle="->", lw=2))
ax.text(0.50, 0.08, "Repeat many timesteps; for video, include frame/time information too.", ha="center")
ax.set_title("How the toy diffusion loop maps to real text-to-image/video")
plt.show()
""")

md(r"""
## Real-world mapping · Toy example: latent diffusion & the VAE (the "variational" part)

Denoising raw pixels is expensive, so **latent diffusion** first compresses the image with a **VAE**
(variational autoencoder) and runs the whole diffusion loop in that small **latent space**, then decodes
back to pixels. "Variational" means the encoder outputs not a single point but the **mean and standard
deviation of a Gaussian**; you sample `z = mu + sigma * eps` (the reparameterization trick), and a KL term
keeps latents smooth and roughly standard-normal — exactly the prior diffusion starts from. The 4 "channels"
of a `64x64x4` latent are learned feature maps, not RGB.
""")
code(r"""
# reparameterization trick: encoder outputs (mu, sigma); sample z = mu + sigma*eps
mu, sigma = 1.0, 0.5
eps_vae = 0.4
z = mu + sigma * eps_vae
log("encoder (mu, sigma)", [mu, sigma])
log("sampled latent z = mu + sigma*eps", round(z, 3))     # -> 1.2

# why latent space: compute win for a 512x512 image compressed to a 64x64x4 latent
pixels = 512 * 512 * 3
latent = 64 * 64 * 4
log("values to denoise in PIXEL space", pixels)           # -> 786432
log("values to denoise in LATENT space", latent)          # -> 16384
log("reduction factor", f"{pixels/latent:.0f}x fewer numbers per step")   # -> 48x
assert pixels // latent == 48

plt.bar(["pixel\n512x512x3", "latent\n64x64x4"], [pixels, latent], color=["tab:red", "tab:green"])
plt.title("Latent diffusion denoises ~48x fewer numbers per step")
plt.ylabel("values per denoising step"); plt.grid(True, axis="y", alpha=0.25); plt.show()
""")

md(r"""
## Latent diffusion · Toy example: the VAE round-trip (encode → latent → decode)

The cell above showed one latent *number*. Here is the full **round-trip on a real multi-pixel "image":**
compress it to a few latent numbers (**encode**), then rebuild the pixels (**decode**). Our toy "images" are
`8x8 = 64` pixels that are secretly built from just **3** underlying patterns (a horizontal gradient, a
vertical gradient, and a centered blob). So the honest latent is only **3 numbers** — a ~21x squeeze — and
decoding rebuilds the image exactly.
""")
code(r"""
vae_grid = 8
vae_yy, vae_xx = np.mgrid[0:vae_grid, 0:vae_grid] / (vae_grid - 1)     # pixel coords in 0..1
vae_p1 = (vae_xx - 0.5)                                                # horizontal gradient pattern
vae_p2 = (vae_yy - 0.5)                                                # vertical gradient pattern
vae_p3 = np.exp(-(((vae_xx - 0.5)**2 + (vae_yy - 0.5)**2) / 0.05))     # centered blob pattern
vae_basis_raw = np.stack([vae_p1.ravel(), vae_p2.ravel(), vae_p3.ravel()])   # (3, 64)
vae_Q, _ = np.linalg.qr(vae_basis_raw.T)     # orthonormal columns (64, 3)
vae_B = vae_Q.T                              # (3, 64) orthonormal rows = our latent basis

def vae_encode(img_vec):     # 64 pixels -> 3-number latent
    return vae_B @ img_vec
def vae_decode(latent):      # 3-number latent -> 64 pixels
    return latent @ vae_B

vae_true_latent = np.array([0.8, -0.5, 1.2])
vae_img     = vae_decode(vae_true_latent)    # build a 64-pixel image from a known latent
vae_latent  = vae_encode(vae_img)            # ENCODE: 64 -> 3
vae_img_rec = vae_decode(vae_latent)         # DECODE: 3 -> 64
vae_err = float(np.abs(vae_img - vae_img_rec).max())

log("image size (pixels)", int(vae_img.size))                                   # -> 64
log("latent size (numbers)", int(vae_latent.size))                              # -> 3
log("compression", f"{vae_img.size/vae_latent.size:.0f}x fewer numbers")        # -> 21x
log("recovered latent", np.round(vae_latent, 3).tolist())                       # -> [0.8, -0.5, 1.2]
log("max reconstruction error", round(vae_err, 12))                             # -> ~0
assert vae_err < 1e-9

fig, ax = plt.subplots(1, 3, figsize=(11, 3.2))
ax[0].imshow(vae_img.reshape(vae_grid, vae_grid), cmap="magma"); ax[0].set_title("original image\n(64 pixels)")
ax[1].bar([0, 1, 2], vae_latent, color="tab:blue"); ax[1].set_title("latent\n(3 numbers)"); ax[1].set_xticks([0,1,2])
ax[2].imshow(vae_img_rec.reshape(vae_grid, vae_grid), cmap="magma"); ax[2].set_title("decoded image\n(back to 64 pixels)")
for a in (ax[0], ax[2]):
    a.set_xticks([]); a.set_yticks([])
plt.tight_layout(); plt.show()
""")

md(r"""
## Latent diffusion · Toy example: the "variational" smoothness

"Variational" means the encoder gives a *mean* `mu` and a small *spread* `sigma`, and we sample
`z = mu + sigma*eps`. The KL regularizer makes this latent space **smooth**: latents that sit close together
decode to images that look close together. Below we jiggle the latent by different `eps` and watch the
decoded image change *gradually* rather than jumping — the smoothness that lets diffusion wander through
latent space and always decode to something sensible.
""")
code(r"""
vae_mu = vae_latent
vae_sigma = 0.35
vae_eps_list = [-1.5, -0.5, 0.0, 0.5, 1.5]

fig, ax = plt.subplots(1, len(vae_eps_list), figsize=(13, 2.9))
for j, e in enumerate(vae_eps_list):
    z = vae_mu + vae_sigma * np.array([e, 0.7*e, -0.5*e])   # perturb the 3-number latent
    img_z = vae_decode(z)
    log(f"eps={e}", {"z": np.round(z, 2).tolist()})
    ax[j].imshow(img_z.reshape(vae_grid, vae_grid), cmap="magma")
    ax[j].set_title(f"eps={e}", fontsize=9); ax[j].set_xticks([]); ax[j].set_yticks([])
plt.suptitle("Nearby latents (z = mu + sigma*eps) decode to smoothly-varying images", y=1.06)
plt.tight_layout(); plt.show()
""")

md(r"""
## Latent diffusion · Toy example: diffusion noises the LATENT, not the pixels

The payoff: the whole forward/reverse loop runs on the **3 latent numbers**, and we decode to pixels only
**once** at the very end. Here we apply the same forward shortcut (`sqrt(ab)*latent + sqrt(1-ab)*noise`) to
the 3-number latent and decode the result — so you can see what a "noised latent" looks like in pixel space.
""")
code(r"""
vae_ab = 0.5                                  # alpha_bar for this demo
vae_noise = np.array([0.6, -0.9, 0.4])
vae_noised_latent = np.sqrt(vae_ab) * vae_true_latent + np.sqrt(1 - vae_ab) * vae_noise   # forward shortcut, in latent
vae_noised_img = vae_decode(vae_noised_latent)

log("clean latent", np.round(vae_true_latent, 3).tolist())              # -> [0.8, -0.5, 1.2]
log("noised latent (ab=0.5)", np.round(vae_noised_latent, 3).tolist())
log("work happens on 3 numbers; decode to 64 pixels ONCE", "that is the latent-diffusion compute win")

fig, ax = plt.subplots(1, 2, figsize=(7, 3.4))
ax[0].imshow(vae_img.reshape(vae_grid, vae_grid), cmap="magma"); ax[0].set_title("clean (decoded)")
ax[1].imshow(vae_noised_img.reshape(vae_grid, vae_grid), cmap="magma"); ax[1].set_title("noised latent (decoded)")
for a in ax:
    a.set_xticks([]); a.set_yticks([])
plt.tight_layout(); plt.show()
""")

md(r"""
## Video diffusion · Toy example: frames over time & temporal consistency

A video is just **many frames in a row**. The naive idea — generate each frame on its own — fails: because
each frame draws its own random noise, the object **jumps around and flickers**. The fix is to let each
frame **see its neighbors** (attention across the time axis) so motion stays smooth. Toy: an object should
glide left-to-right across 8 frames. We compare independent frames against a simple temporal-smoothing
stand-in for temporal attention, and measure the frame-to-frame jitter.
""")
code(r"""
n_frames = 8
frame_idx = np.arange(n_frames)
pos_true = np.linspace(-0.8, 0.8, n_frames)                        # object glides smoothly L -> R
vid_rng = np.random.RandomState(5)
pos_indep = pos_true + vid_rng.normal(0, 0.35, size=n_frames)      # each frame generated INDEPENDENTLY -> jitter

pos_temporal = pos_indep.copy()                                    # temporal 'attention' stand-in:
for i in range(n_frames):                                          # each frame = avg of itself + neighbors
    lo, hi = max(0, i - 1), min(n_frames, i + 2)
    pos_temporal[i] = pos_indep[lo:hi].mean()

jitter = lambda p: float(np.mean(np.abs(np.diff(p))))
log("jitter, true smooth motion", round(jitter(pos_true), 3))
log("jitter, independent frames", round(jitter(pos_indep), 3))    # -> largest (flicker)
log("jitter, temporal attention", round(jitter(pos_temporal), 3)) # -> smaller (smoothed)
assert jitter(pos_temporal) < jitter(pos_indep)

plt.plot(frame_idx, pos_true, "o-", label="true (smooth motion)")
plt.plot(frame_idx, pos_indep, "x--", label="independent frames (flicker)")
plt.plot(frame_idx, pos_temporal, "s-", label="temporal attention (smoothed)")
plt.title("Object position across frames: independent flickers, temporal stays smooth")
plt.xlabel("frame"); plt.ylabel("object x-position"); plt.legend(); plt.grid(True, alpha=0.25); plt.show()
""")
code(r"""
# filmstrip: same 8 frames drawn as a dot moving left->right
fig, ax = plt.subplots(2, n_frames, figsize=(14, 3.0))
for i in range(n_frames):
    ax[0, i].scatter(pos_indep[i], 0, s=170, c="tab:red")
    ax[1, i].scatter(pos_temporal[i], 0, s=170, c="tab:green")
    for r in (0, 1):
        ax[r, i].set_xlim(-1.2, 1.2); ax[r, i].set_ylim(-1, 1)
        ax[r, i].set_xticks([]); ax[r, i].set_yticks([])
    ax[0, i].set_title(f"f{i}", fontsize=8)
ax[0, 0].set_ylabel("independent", fontsize=9)
ax[1, 0].set_ylabel("temporal", fontsize=9)
plt.suptitle("Filmstrip: red dot jumps (flicker); green dot glides (consistent)", y=1.04)
plt.tight_layout(); plt.show()
""")

md(r"""
## Video diffusion · how real systems do it (and what to watch out for)

Real video diffusion keeps the *same* denoising loop, but the latent gains a **time axis** — all frames are
denoised together — plus **temporal attention** so frame `i` attends to frames `i-1` and `i+1`:

```
VIDEO DIFFUSION (sketch):
    x = noise latent of shape (frames, H, W, C)      # a whole clip of static at once
    for t = T..1:
        eps = denoiser(x, t, prompt)                 # attends WITHIN each frame AND ACROSS frames
        x   = reverse_step(x, eps, t)
    video = vae_decoder(x)                            # decode every frame to pixels
```

**Watch out for:** (1) **temporal consistency** — without cross-frame attention you get flicker, morphing
objects, and identity drift; (2) **compute** — a clip is `frames x` more data than one image, so cost and
memory dominate. That is why long, coherent video is the hard part.
""")

md(r"""
---
# Recap · The whole module as one chain

1. Start with data: our toy 2D points stand in for images.
2. **Forward / diffusion process:** data → add Gaussian noise with a schedule → nearly pure noise. The
   one-shot shortcut `x_t = sqrt(alpha_bar_t) x_0 + sqrt(1-alpha_bar_t) eps` is valid because independent
   variances add (many small kicks merge into one).
3. **Training target:** train an epsilon predictor, `(x_t, t) → eps`, because knowing eps lets us estimate
   the clean `x0`; predicting eps is (up to scale) predicting the **score**, the direction back to clean
   data. The timestep enters as a **sinusoidal embedding**.
4. **Reverse / denoising process:** start from `x_T ~ N(0,I)` and iteratively denoise back to `t=0`. Each
   step is a **blend** of `x0_hat` and `x_t` plus a little noise `sigma_t` — the compact DDPM formula is
   exactly that blend. **DDIM** makes the step deterministic and skips timesteps for fast sampling.
5. **Conditioning:** add a label/prompt so generation can ask for a class or concept; real systems inject
   text via **cross-attention** (image = queries, text = keys/values, from learned projections).
6. **Classifier-free guidance:** combine unconditional and conditional predictions:
   `eps_uncond + w*(eps_cond - eps_uncond)`. It reproduces a classifier's steering *without* a classifier
   (Bayes rule), trading diversity for stronger prompt following — which is why the unconditional branch is
   trained via label dropout.
7. **Real world:** **latent diffusion** runs the loop in a compressed **VAE latent space** (`z = mu +
   sigma*eps`, ~48x cheaper), with a **U-Net/DiT** denoiser and a text encoder for prompts; video adds a
   time axis and temporal consistency.

Final chain:

`data → (add noise, forward) → noise; train eps-predictor; noise → (iterative denoise, reverse, optionally conditioned + guided) → new sample`
""")

nb = {"cells": cells, "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python"}}, "nbformat": 4, "nbformat_minor": 5}
out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks", "M21-diffusion.ipynb")
with open(out, "w") as f: json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells", f"({sum(c['cell_type']=='code' for c in cells)} code)")
