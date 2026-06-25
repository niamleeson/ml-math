/* PyTorch (a complete course) — "Feeding data: Dataset and DataLoader".
   Self-contained: lesson + CODE + CODEVIZ merged by id "pt-data". Code runs in Google Colab
   (torch / torchvision preinstalled). CODEVIZ numbers computed for real with numpy. */
(function () {
  window.LESSONS.push({
    id: "pt-data",
    title: "Feeding data: Dataset and DataLoader",
    tagline: "Wrap your data in a Dataset, hand it to a DataLoader, and get batched, shuffled, augmented, parallel-loaded tensors that keep the GPU (Graphics Processing Unit) busy.",
    module: "PyTorch (a complete course)",
    template: "pytorch",
    prereqs: ["dl-minibatch", "dl-data-augmentation"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>write a custom map-style <code>Dataset</code> by implementing <code>__len__</code> and <code>__getitem__</code>, returning one <code>(x, y)</code> pair with the right dtypes (<code>float32</code> input, <code>long</code> label);</li>
<li>wrap any dataset in a <code>DataLoader</code> to get batched, shuffled, parallel-loaded tensors, and pull one batch with <code>next(iter(loader))</code> knowing its shape and dtype;</li>
<li>build separate train/eval <code>transforms.Compose</code> pipelines (augment train only) and write a custom <code>collate_fn</code> for variable-length data.</li>
</ul>
<p><b>The API you'll own:</b> <code>Dataset</code>, <code>TensorDataset</code>, <code>DataLoader</code>, <code>transforms.Compose</code> / <code>ToTensor</code> / <code>Normalize</code>, <code>datasets.MNIST</code>, a custom <code>collate_fn</code> with <code>pad_sequence</code>.</p>`,

    concept: `<p>PyTorch splits data feeding into two jobs with a clean seam between them. A <b><code>Dataset</code></b> answers exactly one question — "give me sample number <code>i</code> as an <code>(x, y)</code> pair" — and hides where the data actually lives (a NumPy array, image files on disk, a database). A <b><code>DataLoader</code></b> wraps that <code>Dataset</code> and turns it into an <b>iterator over batches</b>: it batches, shuffles, loads in parallel across worker processes, and hands ready-to-use tensors to your training loop.</p>
<p>A map-style <code>Dataset</code> is the whole contract in two methods: <code>__len__(self)</code> returns how many samples there are, and <code>__getitem__(self, i)</code> returns one <code>(x, y)</code> pair as tensors. Because of this split, the same DataLoader machinery — batching, shuffling, parallel workers, pinned memory — works for images, text, audio, or tabular data without change. You write a tiny Dataset; you get an industrial data pipeline.</p>
<p>When you write <code>for xb, yb in loader:</code>, three things happen under the hood:</p>
<ul>
<li><b>Index generation.</b> A sampler yields the order of indices — a fresh random permutation each epoch when <code>shuffle=True</code> (for the <i>train</i> loader only), or <code>0,1,2,...</code> when <code>shuffle=False</code> — then chops them into lists of <code>batch_size</code>.</li>
<li><b>Fetching.</b> For each index the loader calls your <code>__getitem__</code>, which loads, transforms, and returns one sample. With <code>num_workers &gt; 0</code> this runs in parallel worker processes that prefetch the next batches while the GPU (Graphics Processing Unit) trains on the current one — exactly what keeps a fast GPU fed (see <code>dl-minibatch</code>).</li>
<li><b>Collating.</b> The per-sample pairs are merged into one batch by the <code>collate_fn</code>. The default <code>torch.stack</code> turns <code>batch_size</code> tensors of shape <code>(C, H, W)</code> into one <code>(batch_size, C, H, W)</code>. For variable-length data (sentences of different lengths) <code>torch.stack</code> fails, so you pass a custom <code>collate_fn</code> that pads each sequence to the batch's longest length.</li>
</ul>`,

    apiTable: [
      { sig: "class MyDS(Dataset): __len__, __getitem__", does: "The whole map-style <code>Dataset</code> contract: how many samples, and sample <code>i</code> as one <code>(x, y)</code> pair of tensors.", snippet: "def __getitem__(self, i):\n    return self.X[i], self.y[i]" },
      { sig: "TensorDataset(X, y)", does: "A ready-made <code>Dataset</code> over in-memory tensors — no custom class needed when the data already fits in tensors.", snippet: "ds = TensorDataset(X, y)" },
      { sig: "DataLoader(ds, batch_size, shuffle, ...)", does: "Wraps a <code>Dataset</code> into an iterator over batches: batching, shuffling, parallel loading.", snippet: "DataLoader(ds, batch_size=64, shuffle=True)" },
      { sig: "next(iter(loader))", does: "Pull a single collated batch — the quick way to check shapes and dtypes before training.", snippet: "xb, yb = next(iter(loader))" },
      { sig: "num_workers= / pin_memory= / drop_last=", does: "Parallel worker processes prefetch batches; <code>pin_memory</code> speeds the CPU&rarr;GPU copy; <code>drop_last</code> drops a short final batch.", snippet: "DataLoader(ds, num_workers=2, pin_memory=True, drop_last=True)" },
      { sig: "transforms.Compose([...])", does: "Chain image transforms applied inside <code>__getitem__</code>. Use a separate pipeline per split.", snippet: "Compose([ToTensor(), Normalize(m, s)])" },
      { sig: "ToTensor() / Normalize(mean, std)", does: "<code>ToTensor</code> maps uint8 <code>0..255</code> to float <code>0..1</code> as <code>(C, H, W)</code>; <code>Normalize</code> zero-centers with the dataset's stats.", snippet: "transforms.Normalize((0.1307,), (0.3081,))" },
      { sig: "RandomCrop / RandomHorizontalFlip", does: "Random augmentations — <b>train transform only</b>, never the eval transform.", snippet: "transforms.RandomHorizontalFlip()" },
      { sig: "datasets.MNIST(root, train, transform=)", does: "A built-in torchvision <code>Dataset</code> that downloads MNIST and applies your <code>transform</code> per sample.", snippet: "datasets.MNIST('./data', train=True, download=True, transform=tf)" },
      { sig: "DataLoader(ds, collate_fn=pad_collate)", does: "A custom <code>collate_fn</code> merges variable-length samples — pad with <code>pad_sequence</code> before stacking.", snippet: "pad_sequence(seqs, batch_first=True, padding_value=0)" }
    ],

    codeTour: [
      {
        explain: `<b>A custom Dataset over NumPy arrays.</b> Implement just <code>__len__</code> and <code>__getitem__</code>. Cast inside <code>__getitem__</code> so every sample comes out with the dtype the model and loss expect: <code>float32</code> features, a <code>long</code> class index (<code>nn.CrossEntropyLoss</code> wants indices). This is the most common starting point — a tiny Dataset over arrays.`,
        code: `import numpy as np\nimport torch\nfrom torch.utils.data import Dataset, DataLoader\n\ntorch.manual_seed(0)\ndevice = "cuda" if torch.cuda.is_available() else "cpu"\n\nclass ArrayDataset(Dataset):\n    def __init__(self, X, y):\n        self.X = np.asarray(X, dtype=np.float32)\n        self.y = np.asarray(y, dtype=np.int64)\n    def __len__(self):\n        return len(self.X)\n    def __getitem__(self, i):\n        x = torch.from_numpy(self.X[i])\n        y = torch.tensor(self.y[i], dtype=torch.long)\n        return x, y\n\nX = np.random.randn(500, 3).astype(np.float32)\ny = (X[:, 0] + X[:, 1] > 0).astype(np.int64)\nds = ArrayDataset(X, y)\nprint("dataset size:", len(ds), "| one sample:", ds[0][0].shape, ds[0][1].item())`,
        output: `dataset size: 500 | one sample: torch.Size([3]) 0`
      },
      {
        explain: `<b>Wrap it in a DataLoader and pull one batch.</b> The loader batches, shuffles the <i>train</i> set, prefetches with worker processes, and pins memory for a faster GPU copy. <code>next(iter(loader))</code> grabs one collated batch: the default collate stacks 64 <code>(3,)</code> inputs into <code>(64, 3)</code> and the labels into <code>(64,)</code>.`,
        code: `loader = DataLoader(\n    ds,\n    batch_size=64,\n    shuffle=True,                 # shuffle the TRAIN loader only\n    num_workers=2,                # parallel workers prefetch batches\n    pin_memory=(device == "cuda"),# faster CPU->GPU copy on GPU\n    drop_last=False,              # keep the final short batch\n)\n\nxb, yb = next(iter(loader))\nprint("batch x:", xb.shape, xb.dtype, "| batch y:", yb.shape, yb.dtype)`,
        output: `batch x: torch.Size([64, 3]) torch.float32 | batch y: torch.Size([64]) torch.int64`
      },
      {
        explain: `<b>The torchvision MNIST pipeline with split-specific transforms.</b> The train transform augments (random crop) then normalizes; the eval transform is deterministic — same <code>Normalize</code>, no randomness. Shuffle the train loader, not the eval loader. The image batch comes out channels-first as <code>(N, 1, 28, 28)</code>.`,
        code: `from torchvision import datasets, transforms\n\ntrain_tf = transforms.Compose([\n    transforms.RandomCrop(28, padding=2),       # augmentation: TRAIN ONLY\n    transforms.ToTensor(),                      # uint8 0..255 -> float (1,28,28)\n    transforms.Normalize((0.1307,), (0.3081,)), # zero-center with MNIST stats\n])\neval_tf = transforms.Compose([\n    transforms.ToTensor(),\n    transforms.Normalize((0.1307,), (0.3081,)),\n])\n\ntrain_ds = datasets.MNIST(root="./data", train=True,  download=True, transform=train_tf)\ntest_ds  = datasets.MNIST(root="./data", train=False, download=True, transform=eval_tf)\ntrain_loader = DataLoader(train_ds, batch_size=128, shuffle=True)   # shuffle TRAIN\ntest_loader  = DataLoader(test_ds,  batch_size=256, shuffle=False)  # NOT eval\n\nimgs, labels = next(iter(train_loader))\nprint("MNIST batch:", imgs.shape, imgs.dtype, "| labels:", labels.shape)`,
        output: `MNIST batch: torch.Size([128, 1, 28, 28]) torch.float32 | labels: torch.Size([128])`
      },
      {
        explain: `<b>A custom <code>collate_fn</code> for variable-length data.</b> Different-length sequences break the default <code>torch.stack</code>. Pass a <code>collate_fn</code> that pads each sequence to the batch's longest length with <code>pad_sequence(..., batch_first=True)</code>, returning one rectangular <code>(B, max_len)</code> tensor plus the true lengths.`,
        code: `from torch.nn.utils.rnn import pad_sequence\n\nclass SeqDataset(Dataset):\n    def __init__(self, seqs, labels):\n        self.seqs, self.labels = seqs, labels\n    def __len__(self):  return len(self.seqs)\n    def __getitem__(self, i):\n        return torch.tensor(self.seqs[i], dtype=torch.long), self.labels[i]\n\ndef pad_collate(batch):\n    seqs, labels = zip(*batch)\n    lengths = torch.tensor([len(s) for s in seqs])\n    padded  = pad_sequence(seqs, batch_first=True, padding_value=0)\n    return padded, lengths, torch.tensor(labels)\n\nseq_ds = SeqDataset([[1, 2, 3], [4, 5], [6, 7, 8, 9]], [0, 1, 0])\nseq_loader = DataLoader(seq_ds, batch_size=3, collate_fn=pad_collate)\npadded, lengths, lbls = next(iter(seq_loader))\nprint("padded sequences:", padded.shape, "| true lengths:", lengths.tolist())`,
        output: `padded sequences: torch.Size([3, 4]) | true lengths: [3, 2, 4]`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom in Colab and read each printed line against its note:</p>
<ul>
<li>The Dataset block prints <code>dataset size: 500</code> and a one-sample line whose feature is <code>torch.Size([3])</code> — proof that <code>__getitem__</code> returns a single <code>(x, y)</code> pair, not a batch.</li>
<li>The DataLoader batch reads <code>torch.Size([64, 3]) torch.float32</code> for <code>x</code> and <code>torch.Size([64]) torch.int64</code> for <code>y</code>: the default collate stacked 64 samples and your <code>__getitem__</code> dtypes (<code>float32</code> input, <code>long</code> label) flowed straight through.</li>
<li>The MNIST batch is <code>torch.Size([128, 1, 28, 28])</code> — channels-first <code>(N, C, H, W)</code>, the shape every <code>nn.Conv2d</code> expects — with labels <code>torch.Size([128])</code>.</li>
<li>The padded batch is <code>torch.Size([3, 4])</code> with lengths <code>[3, 2, 4]</code>: every sequence was padded up to the longest (4) so they stack into one rectangle, while the true lengths are kept for masking.</li>
</ul>
<p>The MNIST step downloads ~10&nbsp;MB the first time. On Windows or in some notebooks set <code>num_workers=0</code> (or guard iteration with <code>if __name__ == "__main__":</code>). Set <code>torch.manual_seed(0)</code> first if you want the shuffled order to match a teammate's.</p>`,

    cheatsheet: [
      { code: "class DS(Dataset): __len__, __getitem__", note: "the whole map-style Dataset contract" },
      { code: "ds = TensorDataset(X, y)", note: "instant Dataset over in-memory tensors" },
      { code: "DataLoader(ds, batch_size=64, shuffle=True)", note: "batch + shuffle (TRAIN loader only)" },
      { code: "xb, yb = next(iter(loader))", note: "grab one batch to check shapes/dtypes" },
      { code: "DataLoader(..., num_workers=2, pin_memory=True)", note: "parallel prefetch + fast GPU copy" },
      { code: "transforms.Compose([ToTensor(), Normalize(m, s)])", note: "image pipeline; one per split, augment TRAIN only" },
      { code: "datasets.MNIST('./data', train=True, transform=tf)", note: "built-in torchvision Dataset" },
      { code: "DataLoader(ds, collate_fn=pad_collate)", note: "custom collate for variable-length data" },
      { code: "pad_sequence(seqs, batch_first=True)", note: "pad to the batch's longest length, then stack" }
    ],

    deeper: `<p>The DataLoader is the PyTorch <i>how</i>; the <i>why</i> lives in the concept lessons:</p>
<ul>
<li>why we train on small shuffled <b>batches</b> rather than the whole dataset at once — the variance/throughput trade-off — is in <a onclick="App.open('dl-minibatch')">mini-batch training</a>;</li>
<li>why random crops, flips, and jitter (the <code>RandomCrop</code> / <code>RandomHorizontalFlip</code> transforms here, train-only) make a model generalize better is in <a onclick="App.open('dl-data-augmentation')">data augmentation</a>.</li>
</ul>
<p>Keep the seam clean — a Dataset that returns one correctly-typed sample, a DataLoader that batches and shuffles it — and the same pipeline carries you from a toy NumPy array to ImageNet without rewrites.</p>`,

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
        q: `<b>Type this in Colab.</b> Write a minimal custom <code>Dataset</code> over two numpy arrays. With
            <code>X = np.arange(20).reshape(10, 2).astype("float32")</code> and <code>y = np.arange(10)</code>,
            implement <code>__len__</code> and <code>__getitem__</code> (return <code>x</code> as
            <code>float32</code>, <code>y</code> as a <code>long</code> scalar). Print <code>len(ds)</code> and
            <code>ds[3]</code>.`,
        steps: [
          { do: `Subclass <code>Dataset</code> and implement <code>__len__</code> + <code>__getitem__</code>.`, why: `Those two methods are the entire map-style Dataset contract.` },
          { do: `Cast inside <code>__getitem__</code>: input <code>torch.float32</code>, label <code>torch.long</code>.`, why: `The model wants float32 features; <code>CrossEntropyLoss</code> wants a long class index.` }
        ],
        answer: `<pre><code>import numpy as np, torch
from torch.utils.data import Dataset, DataLoader

class ArrayDS(Dataset):
    def __init__(self, X, y):
        self.X, self.y = X, y
    def __len__(self):
        return len(self.X)
    def __getitem__(self, i):
        x = torch.tensor(self.X[i], dtype=torch.float32)
        t = torch.tensor(self.y[i], dtype=torch.long)
        return x, t

X = np.arange(20).reshape(10, 2).astype("float32")
y = np.arange(10)
ds = ArrayDS(X, y)
print(len(ds))     # 10
print(ds[3])       # (tensor([6., 7.]), tensor(3))</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Wrap the <code>ds</code> from above in a
            <code>DataLoader(ds, batch_size=4, shuffle=False)</code>. Grab one batch with
            <code>next(iter(loader))</code>. Predict the shapes and dtypes of <code>xb</code> and <code>yb</code>
            before running, then verify.`,
        steps: [
          { do: `Build the <code>DataLoader</code> and pull one batch with <code>next(iter(loader))</code>.`, why: `The loader collates 4 samples into one batched tensor.` },
          { do: `Print <code>xb.shape, xb.dtype</code> and <code>yb.shape, yb.dtype</code>.`, why: `The default collate stacks the 4 <code>(2,)</code> inputs into <code>(4, 2)</code> and the 4 labels into <code>(4,)</code>.` }
        ],
        answer: `<pre><code>loader = DataLoader(ds, batch_size=4, shuffle=False)
xb, yb = next(iter(loader))
print(xb.shape, xb.dtype)   # torch.Size([4, 2]) torch.float32
print(yb.shape, yb.dtype)   # torch.Size([4]) torch.int64
print(yb)                   # tensor([0, 1, 2, 3])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show what <code>shuffle</code> does. Build a <code>DataLoader</code> over the
            same <code>ds</code> with <code>batch_size=10, shuffle=False</code> and print the label batch; then with
            <code>shuffle=True</code> after <code>torch.manual_seed(0)</code> and print it again.`,
        steps: [
          { do: `Set <code>shuffle=False</code> for the natural order, <code>shuffle=True</code> for a random permutation.`, why: `<code>shuffle=True</code> uses a fresh random index order each epoch — for the TRAIN loader only.` },
          { do: `Seed with <code>torch.manual_seed(0)</code> before the shuffled loader.`, why: `So the random order is reproducible for grading.` }
        ],
        answer: `<pre><code>print(next(iter(DataLoader(ds, batch_size=10, shuffle=False)))[1])
# tensor([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
torch.manual_seed(0)
print(next(iter(DataLoader(ds, batch_size=10, shuffle=True)))[1])
# tensor([4, 1, 7, 5, 3, 9, 0, 8, 6, 2])  -- a random permutation</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show <code>drop_last</code>. With 10 samples and <code>batch_size=4</code>, iterate
            the loader once with <code>drop_last=False</code> and print each batch size; then with
            <code>drop_last=True</code>. Predict the batch counts before running.`,
        steps: [
          { do: `Iterate the loader and print <code>len(xb)</code> per batch.`, why: `10 / 4 leaves a final short batch of 2.` },
          { do: `Compare <code>drop_last=False</code> (keeps it: 4,4,2) vs <code>drop_last=True</code> (drops it: 4,4).`, why: `<code>drop_last=True</code> guarantees every batch is exactly <code>batch_size</code>.` }
        ],
        answer: `<pre><code>for drop in (False, True):
    dl = DataLoader(ds, batch_size=4, drop_last=drop)
    print(drop, [len(xb) for xb, _ in dl])
# False [4, 4, 2]   <- keeps the short final batch
# True  [4, 4]      <- drops it</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> The dtype pitfall. Make a Dataset whose <code>__getitem__</code> wrongly returns
            <code>(self.X[i], int(self.y[i]))</code> with <code>X</code> a numpy <code>float64</code> array. Feed a
            batch to <code>nn.Linear(2, 3)</code> + <code>nn.CrossEntropyLoss</code> and observe the dtype error. Then
            fix <code>__getitem__</code> to return <code>float32</code> input and a <code>long</code> target.`,
        steps: [
          { do: `Return real tensors: input <code>torch.float32</code>, label <code>torch.long</code> (not a Python <code>int</code> or <code>float64</code>).`, why: `Linear weights are float32 and <code>CrossEntropyLoss</code> needs a long index tensor.` },
          { do: `Run a forward+loss on one batch after the fix.`, why: `It confirms the corrected dtypes flow cleanly through model and loss.` }
        ],
        answer: `<pre><code>import torch.nn as nn
Xf = np.arange(20).reshape(10, 2).astype("float64")   # float64 -> mismatch
class GoodDS(Dataset):
    def __init__(s, X, y): s.X, s.y = X, y
    def __len__(s): return len(s.X)
    def __getitem__(s, i):
        return (torch.tensor(s.X[i], dtype=torch.float32),   # fix: float32
                torch.tensor(s.y[i], dtype=torch.long))      # fix: long index
dl = DataLoader(GoodDS(Xf, np.arange(10) % 3), batch_size=4)
xb, yb = next(iter(dl))
loss = nn.CrossEntropyLoss()(nn.Linear(2, 3)(xb), yb)
print(loss.shape, xb.dtype, yb.dtype)   # torch.Size([]) torch.float32 torch.int64</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Use a built-in dataset split into train and eval loaders with the RIGHT hygiene.
            Build a train transform <code>Compose([RandomHorizontalFlip(), ToTensor(), Normalize((0.5,),(0.5,))])</code>
            and a deterministic eval transform <code>Compose([ToTensor(), Normalize((0.5,),(0.5,))])</code>. Make a
            train <code>DataLoader(shuffle=True)</code> and a test <code>DataLoader(shuffle=False)</code> over MNIST.`,
        steps: [
          { do: `Give train and eval <b>separate</b> transforms — augment train only, deterministic eval.`, why: `Random crops/flips on eval make the metric noisy; eval must be deterministic.` },
          { do: `Shuffle the train loader, not the eval loader.`, why: `Shuffling decorrelates train batches; eval should be a fixed, reproducible pass.` }
        ],
        answer: `<pre><code>from torchvision import datasets, transforms
train_tf = transforms.Compose([
    transforms.RandomHorizontalFlip(),          # augmentation: TRAIN only
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,)),
])
eval_tf = transforms.Compose([                  # deterministic: no randomness
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,)),
])
train_ds = datasets.MNIST("./data", train=True,  download=True, transform=train_tf)
test_ds  = datasets.MNIST("./data", train=False, download=True, transform=eval_tf)
train_dl = DataLoader(train_ds, batch_size=128, shuffle=True)    # shuffle TRAIN
test_dl  = DataLoader(test_ds,  batch_size=256, shuffle=False)   # NOT eval
imgs, labels = next(iter(train_dl))
print(imgs.shape, labels.shape)   # torch.Size([128, 1, 28, 28]) torch.Size([128])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Variable-length data needs a custom <code>collate_fn</code>. Build a Dataset of
            sequences <code>[[1,2,3], [4,5], [6,7,8,9]]</code> with labels <code>[0,1,0]</code> returning each as a
            <code>long</code> tensor. Write <code>pad_collate</code> using
            <code>nn.utils.rnn.pad_sequence(..., batch_first=True)</code> and print the padded batch shape.`,
        steps: [
          { do: `Pass <code>collate_fn=pad_collate</code> to the <code>DataLoader</code>.`, why: `The default collate calls <code>torch.stack</code>, which fails on different-length sequences.` },
          { do: `Pad with <code>pad_sequence(seqs, batch_first=True, padding_value=0)</code>.`, why: `It pads every sequence to the batch's longest length so they stack into one rectangle.` }
        ],
        answer: `<pre><code>from torch.nn.utils.rnn import pad_sequence
class SeqDS(Dataset):
    def __init__(s, seqs, labels): s.seqs, s.labels = seqs, labels
    def __len__(s): return len(s.seqs)
    def __getitem__(s, i):
        return torch.tensor(s.seqs[i], dtype=torch.long), s.labels[i]

def pad_collate(batch):
    seqs, labels = zip(*batch)
    padded = pad_sequence(seqs, batch_first=True, padding_value=0)
    return padded, torch.tensor(labels)

dl = DataLoader(SeqDS([[1,2,3],[4,5],[6,7,8,9]], [0,1,0]),
                batch_size=3, collate_fn=pad_collate)
padded, lbls = next(iter(dl))
print(padded.shape)   # torch.Size([3, 4])  -- padded to the longest (4)
print(padded)
# tensor([[1, 2, 3, 0],
#         [4, 5, 0, 0],
#         [6, 7, 8, 9]])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Tie it together: iterate a full epoch. Build a <code>TensorDataset</code> from
            <code>X = torch.randn(50, 4)</code>, <code>y = torch.randint(0, 2, (50,))</code>, wrap it in a
            <code>DataLoader(batch_size=16, shuffle=True)</code>, loop over it once, and count how many batches you get
            and the total number of samples seen.`,
        steps: [
          { do: `Use <code>TensorDataset</code> as a quick Dataset over in-memory tensors.`, why: `No custom class needed when the data already fits in tensors.` },
          { do: `Loop <code>for xb, yb in loader:</code> and tally <code>len(xb)</code>.`, why: `50 / 16 gives 4 batches (16,16,16,2) totalling 50 samples.` }
        ],
        answer: `<pre><code>from torch.utils.data import TensorDataset
torch.manual_seed(0)
X = torch.randn(50, 4); y = torch.randint(0, 2, (50,))
loader = DataLoader(TensorDataset(X, y), batch_size=16, shuffle=True)
n_batches = total = 0
for xb, yb in loader:
    n_batches += 1
    total += len(xb)
print(n_batches, total)   # 4 50</code></pre>`
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
