/* PyTorch (a complete course) — "Feeding data: Dataset and DataLoader".
   Self-contained: lesson + CODE + CODEVIZ merged by id "pt-data". Code runs in Google Colab
   (torch / torchvision preinstalled). CODEVIZ numbers computed for real with numpy. */
(function () {
  window.LESSONS.push({
    id: "pt-data",
    title: "Feeding data: Dataset and DataLoader",
    tagline: "Wrap your data in a Dataset, hand it to a DataLoader, and get batched, shuffled, augmented, parallel-loaded tensors that keep the GPU (Graphics Processing Unit) busy.",
    module: "PyTorch (a complete course)",
    prereqs: ["dl-minibatch", "dl-data-augmentation"],

    whenToUse:
      `<p><b>Use <code>torch.utils.data</code> for any real dataset.</b> The moment you train on more than a
       handful of toy tensors, stop slicing arrays by hand and let PyTorch's two data classes do the work:</p>
       <ul>
         <li><b><code>Dataset</code></b> answers one question: "give me sample number <code>i</code> as an
         <code>(x, y)</code> pair." It hides where the data lives (a numpy array, files on disk, a database).</li>
         <li><b><code>DataLoader</code></b> wraps a <code>Dataset</code> and turns it into an
         <b>iterator over batches</b>. It batches, shuffles, loads in parallel across worker processes, and
         hands ready-to-use tensors to your training loop.</li>
       </ul>
       <p>Rule of thumb: <b>always use a <code>DataLoader</code> for batching, shuffling, and augmentation
       &mdash; never a hand-written <code>for i in range(0, n, batch_size)</code> loop.</b> The manual loop
       has no parallel loading, you will forget to shuffle, and you will reinvent augmentation badly. The
       DataLoader is a few lines and gives you all of it for free.</p>
       <p>This is the PyTorch <i>how</i>; for the <i>why</i> of mini-batches see <code>dl-minibatch</code> and
       of augmentation see <code>dl-data-augmentation</code>.</p>`,

    application:
      `<p>The Dataset/DataLoader pair is the front door of essentially every PyTorch training script.</p>
       <ul>
         <li><b>Image models.</b> A <code>torchvision.datasets.ImageFolder</code> or
         <code>MNIST</code>/<code>CIFAR10</code> Dataset, a <code>transforms.Compose</code> pipeline that
         decodes, augments, and normalizes, and a DataLoader feeding a Convolutional Neural Network (CNN).</li>
         <li><b>Text and sequence models.</b> A custom Dataset returning token-id tensors, plus a custom
         <code>collate_fn</code> that pads variable-length sequences into one rectangular batch.</li>
         <li><b>Tabular and scientific data.</b> A tiny Dataset over numpy arrays or a pandas DataFrame &mdash;
         the most common starting point, and exactly the first example below.</li>
         <li><b>Keeping the GPU fed.</b> On a fast GPU, slow data loading becomes the bottleneck. Parallel
         workers (<code>num_workers</code>) and pinned memory (<code>pin_memory</code>) exist precisely so the
         GPU never waits on the CPU &mdash; the point of the CODEVIZ chart below.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Shuffling the validation or test set.</b> Set <code>shuffle=True</code> on the <b>train</b>
         loader only. Shuffling each epoch decorrelates batches and helps training. The val/test loaders must
         use <code>shuffle=False</code> &mdash; you want a fixed, reproducible pass; shuffling them changes
         nothing useful and breaks any per-sample bookkeeping. Fix: two loaders, train shuffled, eval not.</li>
         <li><b>Augmenting the validation or test set.</b> Random crops/flips/color jitter belong to the
         <b>train</b> transform only. The eval transform should be deterministic (resize/center-crop, then
         <code>ToTensor</code> + <code>Normalize</code>). Augmenting eval makes your metric noisy and
         optimistic-or-pessimistic at random. Fix: a separate <code>transforms.Compose</code> per split.</li>
         <li><b>Not normalizing inputs.</b> Raw pixel values <code>0..255</code> (or <code>ToTensor</code>'s
         <code>0..1</code>) train far worse than zero-centered inputs. Add <code>transforms.Normalize(mean,
         std)</code> &mdash; using the channel statistics of <i>this</i> dataset &mdash; after
         <code>ToTensor</code>. Forgetting it is a classic slow-or-stuck-training bug.</li>
         <li><b><code>num_workers</code> too high.</b> More workers means more processes, more inter-process
         copying, and more Random-Access Memory (RAM). Past the point where the GPU is saturated you only add
         overhead (see the plateau in the chart). Fix: start at <code>2</code>&ndash;<code>4</code>, measure,
         and raise only while throughput keeps climbing.</li>
         <li><b><code>num_workers &gt; 0</code> breaking on Windows / notebooks.</b> Worker processes are
         spawned, which re-imports your script; on Windows (and sometimes in bare notebooks) that needs the
         DataLoader iteration guarded by <code>if __name__ == "__main__":</code>. Fix: guard it, or set
         <code>num_workers=0</code> on Windows.</li>
         <li><b>Forgetting <code>pin_memory</code> for GPU training.</b> <code>pin_memory=True</code> stages
         batches in page-locked host memory so the Central Processing Unit (CPU) &rarr; GPU copy is faster and
         can overlap compute (pair it with <code>.to(device, non_blocking=True)</code>). Leave it off and the
         transfer is slower. Fix: set <code>pin_memory=True</code> whenever you train on a GPU.</li>
         <li><b>Wrong dtype from <code>__getitem__</code>.</b> Return real PyTorch tensors with the dtype the
         model and loss expect: inputs usually <code>torch.float32</code>, classification targets
         <code>torch.long</code> (class indices, because <code>nn.CrossEntropyLoss</code> wants indices, not
         one-hot). Returning a Python <code>int</code>, a numpy array, or the wrong dtype throws a confusing
         error deep in the loss. Fix: cast explicitly inside <code>__getitem__</code>.</li>
         <li><b>Data loading bottlenecking the GPU.</b> If GPU utilisation sits low and spiky, the loader can
         not keep up. Fix: raise <code>num_workers</code>, enable <code>pin_memory</code>, move heavy decoding
         off the hot path, and avoid Python-level per-sample work where you can.</li>
       </ul>`,

    bigIdea:
      `<p>Separate <b>what one sample is</b> from <b>how samples become batches</b>. The
       <code>Dataset</code> owns the first; the <code>DataLoader</code> owns the second. Because of that clean
       split, the same DataLoader machinery &mdash; batching, shuffling, parallel workers, pinned memory &mdash;
       works for images, text, audio, or numpy tables without change. You write a tiny Dataset; you get an
       industrial data pipeline.</p>`,

    buildup:
      `<p>Three pieces stack up:</p>
       <ol>
         <li><b>A <code>Dataset</code></b> implements two methods: <code>__len__(self)</code> returns how many
         samples there are, and <code>__getitem__(self, i)</code> returns <i>one</i> <code>(x, y)</code> pair
         as tensors. That is the whole contract (this is a "map-style" dataset).</li>
         <li><b>Transforms</b> (for images) are small callables &mdash; <code>ToTensor</code>,
         <code>Normalize</code>, <code>RandomCrop</code>, <code>RandomHorizontalFlip</code> &mdash; chained with
         <code>transforms.Compose([...])</code> and applied inside <code>__getitem__</code> (built-in
         torchvision datasets take a <code>transform=</code> argument and do this for you).</li>
         <li><b>A <code>DataLoader(dataset, batch_size, shuffle, num_workers, pin_memory, drop_last)</code></b>
         iterates the Dataset, collects <code>batch_size</code> samples, and stacks them into one batched
         tensor &mdash; in shuffled order, across worker processes, ready for the GPU.</li>
       </ol>`,

    symbols: [],

    derivation:
      `<p>What actually happens when you write <code>for xb, yb in loader:</code>?</p>
       <ul>
         <li><b>Index generation.</b> A <code>Sampler</code> produces the order of indices. With
         <code>shuffle=True</code> it is a fresh random permutation of <code>0..len-1</code> each epoch; with
         <code>shuffle=False</code> it is <code>0,1,2,...</code> in order. A <code>BatchSampler</code> chops
         that stream into lists of <code>batch_size</code> indices.</li>
         <li><b>Fetching.</b> For each index in a batch, the loader calls
         <code>dataset[i]</code> &mdash; your <code>__getitem__</code> &mdash; which loads/decodes the sample,
         runs its transform, and returns one <code>(x, y)</code>. With <code>num_workers &gt; 0</code> this work
         is done in <b>parallel worker processes</b> that prefetch the next batches while the GPU trains on the
         current one.</li>
         <li><b>Collating.</b> The list of per-sample <code>(x, y)</code> pairs is merged into a single batch
         by the <code>collate_fn</code>. The default stacks same-shaped tensors with
         <code>torch.stack</code>, turning <code>batch_size</code> tensors of shape <code>(C, H, W)</code> into
         one tensor of shape <code>(batch_size, C, H, W)</code>, and the labels into a <code>(batch_size,)</code>
         vector. <b>For variable-length data</b> (sentences of different lengths) the default
         <code>torch.stack</code> fails, so you pass a custom <code>collate_fn</code> that pads each sequence to
         the batch's longest length (e.g. with <code>nn.utils.rnn.pad_sequence</code>) before stacking.</li>
         <li><b>Pinning + handing off.</b> With <code>pin_memory=True</code> the collated batch is placed in
         page-locked host memory; your loop then copies it to the GPU. <code>drop_last=True</code> discards a
         final short batch so every batch is exactly <code>batch_size</code> (handy for batch-norm and fixed
         shapes). The net result: a steady stream of ready, shuffled, augmented batches. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Five samples, <code>batch_size=2</code>, <code>shuffle=False</code>, <code>drop_last=False</code>.</p>
       <ul class="steps">
         <li><b>The Dataset</b> holds <code>X</code> of shape <code>(5, 3)</code> and labels
         <code>y = [0,1,0,1,0]</code>. <code>len(ds)</code> is 5; <code>ds[2]</code> returns the pair
         <code>(X[2], 0)</code> as tensors.</li>
         <li><b>The Sampler</b> (no shuffle) yields indices <code>0,1,2,3,4</code>; the BatchSampler groups them
         into <code>[0,1]</code>, <code>[2,3]</code>, <code>[4]</code>.</li>
         <li><b>Collate</b> stacks each group: batch 1 is an <code>x</code> of shape <code>(2, 3)</code> and a
         <code>y</code> of shape <code>(2,)</code>; same for batch 2; batch 3 is the leftover single sample,
         shape <code>(1, 3)</code>. With <code>drop_last=True</code> that last short batch would be dropped,
         leaving two full batches.</li>
         <li><b>The loop</b> <code>for xb, yb in loader:</code> runs three times, handing you those batched
         tensors one at a time. Flip to <code>shuffle=True</code> and the index order &mdash; hence the batch
         contents &mdash; changes every epoch.</li>
       </ul>`,

    practice: [
      {
        q: `Your training is slow and <code>nvidia-smi</code> shows GPU utilisation bouncing between 0% and 100% instead of staying high. Your <code>DataLoader</code> uses the defaults: <code>num_workers=0</code>, <code>pin_memory=False</code>. What is happening and how do you fix it?`,
        steps: [
          { do: `Recognize the symptom: spiky/low GPU utilisation means the GPU keeps finishing a batch and then <b>waiting</b> for the next one.`, why: `With <code>num_workers=0</code> the data is loaded in the <i>main</i> process, serially, in between training steps &mdash; so the GPU sits idle while the CPU decodes and augments.` },
          { do: `Raise <code>num_workers</code> to a small number (say 4) so worker processes <b>prefetch</b> the next batches in parallel while the GPU trains on the current one.`, why: `Parallel prefetching overlaps CPU data work with GPU compute, so the next batch is ready the instant the GPU needs it.` },
          { do: `Set <code>pin_memory=True</code> and copy with <code>.to(device, non_blocking=True)</code>.`, why: `Page-locked host memory makes the CPU&rarr;GPU transfer faster and lets it overlap compute.` },
          { do: `Measure throughput (samples/sec) as you raise <code>num_workers</code> and stop at the plateau.`, why: `Past the point where the GPU is saturated, more workers only add overhead &mdash; the plateau in the CODEVIZ chart.` }
        ],
        answer: `<p>The GPU is <b>data-starved</b>: with <code>num_workers=0</code> every batch is loaded serially in the main process, so the GPU finishes a step and then idles while the CPU prepares the next batch &mdash; exactly the 0%&harr;100% sawtooth. Fix it by letting the loader prefetch in parallel: set <code>num_workers</code> to a few (e.g. 4), and add <code>pin_memory=True</code> with <code>.to(device, non_blocking=True)</code> for a faster, overlapping transfer. Raise <code>num_workers</code> while throughput climbs and stop at the plateau, since beyond GPU saturation extra workers just add overhead.</p>`
      },
      {
        q: `You copy your train <code>DataLoader</code> to make the validation one, leaving <code>shuffle=True</code> and the same <code>transforms.Compose([RandomCrop(32, padding=4), RandomHorizontalFlip(), ToTensor(), Normalize(...)])</code>. Your validation accuracy is noisy and looks lower than it should. What two things are wrong?`,
        steps: [
          { do: `Spot <code>shuffle=True</code> on the validation loader.`, why: `Validation should be a fixed, reproducible pass; shuffling it gains nothing and can break any per-sample bookkeeping. Shuffle the train loader only.` },
          { do: `Spot the <b>augmentation</b> (<code>RandomCrop</code>, <code>RandomHorizontalFlip</code>) in the validation transform.`, why: `Random crops/flips on eval make each pass see different, distorted inputs, so the metric is noisy and not measuring true performance.` },
          { do: `Build a separate eval transform: deterministic only &mdash; e.g. <code>ToTensor()</code> + the same <code>Normalize(...)</code> (and resize/center-crop if needed), no randomness.`, why: `Eval must be deterministic and undistorted so the metric is stable and reflects real accuracy.` },
          { do: `Set <code>shuffle=False</code> on the validation loader.`, why: `A fixed order makes evaluation reproducible.` }
        ],
        answer: `<p>Two split-hygiene bugs. (1) <b><code>shuffle=True</code> on validation</b> &mdash; only the <i>train</i> loader should shuffle; eval should be a fixed, reproducible pass (<code>shuffle=False</code>). (2) <b>Augmentation on validation</b> &mdash; <code>RandomCrop</code> and <code>RandomHorizontalFlip</code> distort each eval pass differently, making the metric noisy and unrepresentative. Give validation its own deterministic transform (<code>ToTensor()</code> + the <i>same</i> <code>Normalize(...)</code>, plus resize/center-crop if needed) and keep the random augmentation for training only. Normalization must match across splits; randomness must not.</p>`
      },
      {
        q: `You write a custom <code>Dataset</code> for a classifier. <code>__getitem__</code> returns <code>(self.X[i], int(self.y[i]))</code> where <code>self.X</code> is a numpy float64 array and <code>self.y</code> is a numpy array of class ids. Training crashes inside <code>nn.CrossEntropyLoss</code> / the model. What dtypes should <code>__getitem__</code> return and why?`,
        steps: [
          { do: `Recognize the model expects <code>torch.float32</code> input tensors, not a numpy <code>float64</code> array or Python objects.`, why: `Layer weights are <code>float32</code>; a <code>float64</code> numpy array (or a non-tensor) causes a dtype mismatch error in the forward pass.` },
          { do: `Recognize <code>nn.CrossEntropyLoss</code> wants the target as a <code>torch.long</code> tensor of <b>class indices</b> (not one-hot, not float, not a Python int).`, why: `CrossEntropyLoss indexes into the logits with integer class ids; it requires a <code>long</code> tensor of indices.` },
          { do: `Return <code>(torch.tensor(self.X[i], dtype=torch.float32), torch.tensor(int(self.y[i]), dtype=torch.long))</code>.`, why: `Explicit casts give the input <code>float32</code> and the target a scalar <code>long</code>, exactly what the model and loss expect; the default collate then stacks them into a clean batch.` }
        ],
        answer: `<p><code>__getitem__</code> must return real tensors with the right dtypes: the input as <b><code>torch.float32</code></b> (the model's weights are float32, so a numpy float64 array or a Python object mismatches) and the classification target as a scalar <b><code>torch.long</code></b> class index (because <code>nn.CrossEntropyLoss</code> takes integer class indices, not one-hot vectors, floats, or Python ints). So: <code>return torch.tensor(x, dtype=torch.float32), torch.tensor(int(y), dtype=torch.long)</code>. With the correct dtypes, the default <code>collate_fn</code> stacks them into a <code>(B, ...)</code> float input batch and a <code>(B,)</code> long target batch and the loss is happy.</p>`
      }
    ]
  });

  window.CODE["pt-data"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Two complete, Colab-ready examples (torch and torchvision are preinstalled). <b>First</b>: a tiny
      custom <code>Dataset</code> over numpy arrays &mdash; it implements <code>__len__</code> and
      <code>__getitem__</code> (returning one <code>(x, y)</code> pair with the right dtypes) &mdash; wrapped in a
      <code>DataLoader</code> that batches, shuffles, and parallel-loads; we iterate one batch and print shapes
      and dtypes. <b>Second</b>: the canonical torchvision MNIST pipeline with
      <code>transforms.Compose([ToTensor(), Normalize(...)])</code> (and train-only augmentation), a separate
      deterministic eval transform, and a DataLoader with <code>num_workers</code> / <code>pin_memory</code>.
      <b>Third</b>: a brief custom <code>collate_fn</code> that pads variable-length sequences into one batch.
      <code>runnable</code> is off because the in-browser engine has no torch &mdash; copy this into Colab to run.</p>`,
    code: `import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader

torch.manual_seed(0)          # reproducible shuffling / results
device = "cuda" if torch.cuda.is_available() else "cpu"

# ======================================================================
# 1) A CUSTOM Dataset over numpy arrays  (the most common starting point)
# ======================================================================
class ArrayDataset(Dataset):
    def __init__(self, X, y):
        # keep the raw arrays; convert per-sample in __getitem__
        self.X = np.asarray(X, dtype=np.float32)
        self.y = np.asarray(y, dtype=np.int64)

    def __len__(self):                      # how many samples
        return len(self.X)

    def __getitem__(self, i):               # ONE (x, y) pair, correct dtypes
        x = torch.from_numpy(self.X[i])                      # float32 feature vector
        y = torch.tensor(self.y[i], dtype=torch.long)        # long class index (CrossEntropyLoss wants this)
        return x, y

# synthetic 2-class data: 500 samples, 3 features
X = np.random.randn(500, 3).astype(np.float32)
y = (X[:, 0] + X[:, 1] > 0).astype(np.int64)
ds = ArrayDataset(X, y)
print("dataset size:", len(ds), "| one sample:", ds[0][0].shape, ds[0][1].item())

# The DataLoader: batch + shuffle (TRAIN only) + parallel workers + pinned memory for GPU.
loader = DataLoader(
    ds,
    batch_size=64,
    shuffle=True,                 # shuffle the TRAIN loader only
    num_workers=2,                # parallel worker processes prefetch batches (0 on Windows/notebooks)
    pin_memory=(device == "cuda") # faster CPU->GPU copy when training on GPU
    , drop_last=False             # keep the final short batch
)

xb, yb = next(iter(loader))       # grab ONE batch
print("batch x:", xb.shape, xb.dtype, "| batch y:", yb.shape, yb.dtype)
# batch x: torch.Size([64, 3]) torch.float32 | batch y: torch.Size([64]) torch.int64

# ======================================================================
# 2) TORCHVISION MNIST with transforms.Compose + a DataLoader
# ======================================================================
from torchvision import datasets, transforms

# TRAIN transform: augment, then ToTensor (-> [0,1]), then Normalize (MNIST mean/std).
train_tf = transforms.Compose([
    transforms.RandomCrop(28, padding=2),      # augmentation: TRAIN ONLY
    transforms.ToTensor(),                     # PIL/np uint8 [0,255] -> float tensor [0,1], shape (1,28,28)
    transforms.Normalize((0.1307,), (0.3081,)),# zero-center using THIS dataset's stats
])
# EVAL transform: deterministic only -- no random augmentation, same Normalize.
eval_tf = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,)),
])

train_ds = datasets.MNIST(root="./data", train=True,  download=True, transform=train_tf)
test_ds  = datasets.MNIST(root="./data", train=False, download=True, transform=eval_tf)

train_loader = DataLoader(train_ds, batch_size=128, shuffle=True,
                          num_workers=2, pin_memory=(device == "cuda"))
test_loader  = DataLoader(test_ds,  batch_size=256, shuffle=False,   # eval: no shuffle
                          num_workers=2, pin_memory=(device == "cuda"))

imgs, labels = next(iter(train_loader))
print("MNIST batch:", imgs.shape, imgs.dtype, "| labels:", labels.shape)
# MNIST batch: torch.Size([128, 1, 28, 28]) torch.float32 | labels: torch.Size([128])

# ======================================================================
# 3) A CUSTOM collate_fn for VARIABLE-LENGTH data (e.g. sentences)
# ======================================================================
from torch.nn.utils.rnn import pad_sequence

class SeqDataset(Dataset):
    def __init__(self, seqs, labels):
        self.seqs, self.labels = seqs, labels
    def __len__(self):  return len(self.seqs)
    def __getitem__(self, i):
        return torch.tensor(self.seqs[i], dtype=torch.long), self.labels[i]

def pad_collate(batch):
    seqs, labels = zip(*batch)                 # lists of (seq_tensor, label)
    lengths = torch.tensor([len(s) for s in seqs])
    padded  = pad_sequence(seqs, batch_first=True, padding_value=0)  # (B, max_len)
    return padded, lengths, torch.tensor(labels)

seq_ds = SeqDataset([[1, 2, 3], [4, 5], [6, 7, 8, 9]], [0, 1, 0])
seq_loader = DataLoader(seq_ds, batch_size=3, collate_fn=pad_collate)
padded, lengths, lbls = next(iter(seq_loader))
print("padded sequences:", padded.shape, "| true lengths:", lengths.tolist())
# padded sequences: torch.Size([3, 4]) | true lengths: [3, 2, 4]`
  };

  window.CODEVIZ["pt-data"] = {
    question: "Why does DataLoader parallelism matter? As we add worker processes, how does training throughput (samples/sec) change? Modelled on a small 2-conv-layer CNN (Convolutional Neural Network) whose GPU step takes ~20 ms per batch of 64, while one CPU loader needs ~115 ms of decode+augment per batch.",
    charts: [
      {
        type: "line",
        title: "Training throughput vs num_workers (small 2-conv-layer CNN, batch_size=64)",
        xlabel: "num_workers",
        ylabel: "throughput (samples / sec)",
        series: [
          {
            name: "throughput",
            color: "#4ea1ff",
            points: [[0, 557], [1, 557], [2, 1096], [3, 1595], [4, 2035], [6, 2704], [8, 3096], [12, 3200]]
          },
          {
            name: "GPU-bound ceiling (3200)",
            color: "#ffb454",
            points: [[0, 3200], [12, 3200]]
          }
        ]
      }
    ],
    caption: "With 0 or 1 worker the CPU loads batches serially (~115 ms each), so throughput is stuck near 557 samples/sec and the GPU mostly idles. Each extra worker prefetches batches in parallel, and throughput climbs steeply (1096 at 2 workers, 2035 at 4). It then bends over and plateaus near 3200 samples/sec — the GPU-bound ceiling (a 20 ms GPU step on 64 samples = 3200/sec). Past that point the loader is no longer the bottleneck, so more workers add inter-process overhead, not speed. This is exactly why you set num_workers > 0 (and pin_memory) — to keep a fast GPU fed — and why you stop at the plateau rather than maxing it out.",
    code: `import numpy as np

# Small illustrative model: a 2-conv-layer CNN. Per BATCH of 64 samples,
# the GPU forward+backward step takes ~20 ms (GPU-bound floor), while ONE
# CPU loader needs ~115 ms to decode+augment that batch. Extra workers split
# the CPU work; a small per-worker IPC overhead is added.
batch_size = 64
t_gpu      = 0.020     # 20 ms GPU step per batch  -> ceiling = 64/0.020 = 3200 samples/s
t_cpu_one  = 0.115     # 115 ms CPU decode+augment per batch with a single loader
overhead   = 0.0009    # ~0.9 ms extra per additional worker (process / IPC cost)

workers = [0, 1, 2, 3, 4, 6, 8, 12]
print(" w  throughput(samples/s)  per-batch(ms)")
for w in workers:
    eff = max(w, 1)                               # 0 workers == main process == 1 loader
    t_cpu  = t_cpu_one / eff + overhead * max(w - 1, 0)
    t_batch = max(t_gpu, t_cpu)                   # GPU and prefetch overlap -> the slower one wins
    thpt = batch_size / t_batch
    print(f"{w:2d}  {thpt:18.0f}  {t_batch*1000:12.1f}")
# w  throughput(samples/s)  per-batch(ms)
#  0                 557          115.0
#  1                 557          115.0
#  2                1096           58.4
#  3                1595           40.1
#  4                2035           31.4
#  6                2704           23.7
#  8                3096           20.7
# 12                3200           20.0   <- plateau at the 3200/s GPU ceiling`
  };
})();
