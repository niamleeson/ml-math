/* PyTorch (a complete course) — "Training across many GPUs/machines: DataParallel vs DDP, FSDP".
   Self-contained: lesson + CODE + CODEVIZ merged by id "pt-distributed". */
(function () {
  window.LESSONS.push({
    id: "pt-distributed",
    title: "Distributed training: DataParallel, DistributedDataParallel (DDP), and sharding",
    tagline: "Replicate the model on every GPU, split the batch, and all-reduce the gradients so all copies stay in sync — DDP is the standard way.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["pt-training-loop", "dl-minibatch", "dl-optimizers", "spark-intro"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>explain data parallelism &mdash; replicate the model on every Graphics Processing Unit (GPU), split the batch, average gradients &mdash; and why <code>DistributedDataParallel</code> (DDP) beats the legacy <code>nn.DataParallel</code>;</li>
<li>write a DDP training script: <code>init_process_group</code>, a <code>DistributedSampler</code> with <code>set_epoch</code>, the <code>DDP</code> wrapper, and rank-0 guards for logging/saving;</li>
<li>compute the effective batch size, apply the linear learning-rate scaling rule, and reproduce the same effect on one GPU with gradient accumulation.</li>
</ul>
<p><b>The API you'll own:</b> <code>torch.distributed.init_process_group</code>, <code>DistributedSampler</code>, <code>DistributedDataParallel</code>, <code>dist.all_reduce</code>, <code>torchrun</code>.</p>`,

    concept: `<p><b>Data parallelism</b> is how nearly every large model is trained. Put a full copy of the model on every GPU, give each copy a different slice of the batch, let each compute gradients on its slice, then <b>average the gradients across all copies</b> so every replica stays identical. It is the same &ldquo;map then combine&rdquo; shape as a Spark job (see <code>spark-intro</code>): the workers are GPUs, the shard is a slice of the batch, and the combine step is averaging gradients.</p>
<p>That averaging is an <b>all-reduce</b>: every GPU contributes its gradient tensor, they are summed and divided by N, and the same averaged result goes back to every GPU. Because all copies start equal and apply the same averaged gradient, they take the same optimizer step and remain byte-for-byte identical forever &mdash; only gradients ever need syncing, never the weights themselves.</p>
<p>Two scaling walls send you here:</p>
<ul>
<li><b>The compute wall</b> &mdash; the dataset is huge and one epoch takes hours. Throw 4, 8, or 64 GPUs at it and finish roughly that many times faster. The tool is <b>DDP</b> (data parallelism).</li>
<li><b>The memory wall</b> &mdash; the model itself (weights plus optimizer state and activations) does not fit on one GPU. Plain replication is impossible; you must <b>shard</b> the model with Fully Sharded Data Parallel (FSDP) or DeepSpeed/ZeRO.</li>
</ul>
<p>With N GPUs the <b>effective batch size</b> is N times the per-GPU local batch. A bigger batch has less gradient noise, so the <b>linear scaling rule</b> raises the learning rate by N (with a short warmup). If you only have one GPU, <b>gradient accumulation</b> &mdash; sum gradients over K micro-batches, step once &mdash; gives the same effective batch at 1/K the peak memory.</p>`,

    apiTable: [
      { sig: "dist.init_process_group(backend=\"nccl\")", does: "Join the process group. <code>nccl</code> is the fast GPU backend; <code>gloo</code> runs on CPU. <code>torchrun</code> sets the env vars it reads.", snippet: "import torch.distributed as dist\ndist.init_process_group(backend=\"nccl\")" },
      { sig: "dist.get_rank() / get_world_size()", does: "This process's GPU index (0..N-1) and the total number of processes N. Rank 0 is the lead that logs and saves.", snippet: "rank = dist.get_rank()\nN = dist.get_world_size()" },
      { sig: "DistributedSampler(ds, num_replicas, rank)", does: "Hands each rank a <i>disjoint</i> shard of the dataset. Without it every GPU sees the same batches.", snippet: "sampler = DistributedSampler(ds, num_replicas=N, rank=rank)" },
      { sig: "sampler.set_epoch(epoch)", does: "Mixes the epoch into the shuffle seed. Call it every epoch or the shuffle is identical across epochs.", snippet: "for e in range(epochs):\n    sampler.set_epoch(e)" },
      { sig: "DistributedDataParallel(model, device_ids=[lr])", does: "Wrap the model: broadcasts weights from rank 0, then averages gradients via all-reduce inside <code>backward()</code>.", snippet: "model = DDP(model, device_ids=[local_rank])" },
      { sig: "dist.all_reduce(t, op=ReduceOp.SUM)", does: "The collective DDP uses: sums each rank's tensor and returns the same result to all of them.", snippet: "dist.all_reduce(t, op=dist.ReduceOp.SUM)" },
      { sig: "model.module.state_dict()", does: "Unwraps the DDP/DataParallel wrapper to the plain model's keys so the checkpoint loads into a bare model.", snippet: "torch.save(model.module.state_dict(), \"m.pt\")" },
      { sig: "dist.destroy_process_group()", does: "Clean shutdown of the group at the end of the run.", snippet: "dist.destroy_process_group()" },
      { sig: "nn.DataParallel(model)", does: "Legacy single-process API: GPU-0-bottlenecked and serialized by the GIL. Avoid in new code &mdash; use DDP.", snippet: "dp = nn.DataParallel(model)   # legacy" }
    ],

    codeTour: [
      {
        explain: `<b>Compute the effective batch and the per-rank shard.</b> With a local batch of 32 across 8 GPUs the optimizer steps on 256 examples; the <code>DistributedSampler</code> gives each rank 1/8 of an 80,000-image dataset.`,
        code: `local_batch = 32\nworld_size = 8\nprint("effective batch:", local_batch * world_size)\nprint("images per GPU/epoch:", 80000 // world_size)`,
        output: `effective batch: 256\nimages per GPU/epoch: 10000`
      },
      {
        explain: `<b>The <code>DistributedSampler</code> hands each rank a disjoint shard.</b> No real cluster is needed to see it: build the sampler for two ranks and print the indices each owns. They never overlap &mdash; that is what splits the work instead of repeating it N times.`,
        code: `import torch\nfrom torch.utils.data import TensorDataset\nfrom torch.utils.data.distributed import DistributedSampler\n\nds = TensorDataset(torch.arange(12))\ns0 = DistributedSampler(ds, num_replicas=4, rank=0, shuffle=False)\ns1 = DistributedSampler(ds, num_replicas=4, rank=1, shuffle=False)\nprint("rank 0:", list(s0))\nprint("rank 1:", list(s1))`,
        output: `rank 0: [0, 4, 8]\nrank 1: [1, 5, 9]`
      },
      {
        explain: `<b>The <code>set_epoch</code> gotcha.</b> A shuffling sampler reuses the same seed each epoch unless told otherwise, so the shuffle repeats &mdash; a famous silent bug. <code>set_epoch</code> mixes the epoch into the seed.`,
        code: `s = DistributedSampler(ds, num_replicas=2, rank=0, shuffle=True)\ns.set_epoch(0)\nprint(list(s))\ns.set_epoch(0)\nprint(list(s))      # same -> the bug\ns.set_epoch(1)\nprint(list(s))      # different -> correct`,
        output: `[8, 0, 4, 6, 10]\n[8, 0, 4, 6, 10]\n[2, 6, 0, 10, 8]`
      },
      {
        explain: `<b>The linear scaling rule.</b> With N GPUs the effective batch is N times larger and the gradient is less noisy, so scale the base learning rate by N. <code>param_groups</code> is the source of truth for what the optimizer will use.`,
        code: `import torch.nn as nn\nbase_lr, world_size = 0.1, 8\nscaled_lr = base_lr * world_size\nmodel = nn.Linear(10, 2)\nopt = torch.optim.SGD(model.parameters(), lr=scaled_lr, momentum=0.9)\nprint("scaled lr:", opt.param_groups[0]["lr"])`,
        output: `scaled lr: 0.8`
      },
      {
        explain: `<b>One real <code>all_reduce</code> on the CPU <code>gloo</code> backend.</b> A single-process group is the only DDP-family primitive you can actually run on Colab. With one rank, <code>SUM</code> returns the same tensor &mdash; proof the collective call works. The real DDP wrapper does this for every gradient tensor.`,
        code: `import os, torch\nimport torch.distributed as dist\nos.environ["MASTER_ADDR"] = "127.0.0.1"\nos.environ["MASTER_PORT"] = "29500"\ndist.init_process_group("gloo", rank=0, world_size=1)\nt = torch.tensor([1.0, 2.0, 3.0])\ndist.all_reduce(t, op=dist.ReduceOp.SUM)\nprint(t)\nprint("world size:", dist.get_world_size())\ndist.destroy_process_group()`,
        output: `tensor([1., 2., 3.])\nworld size: 1`
      }
    ],

    expected: `<p>None of these blocks needs more than one device, so they all run on free Colab:</p>
<ul>
<li>The effective batch is <code>256</code> and the per-rank shard is <code>10000</code> &mdash; the two numbers that drive learning-rate scaling and step counts.</li>
<li>Rank 0 owns indices <code>[0, 4, 8]</code> and rank 1 owns <code>[1, 5, 9]</code> &mdash; <b>disjoint</b>, proving the sampler splits the data rather than repeating it.</li>
<li>The first two <code>set_epoch(0)</code> prints are <i>identical</i> (the bug) and the <code>set_epoch(1)</code> print differs (the fix). Exact indices depend on the PyTorch version; the point is same-vs-different.</li>
<li>The scaled learning rate reads <code>0.8</code> = 0.1 &times; 8.</li>
<li>The <code>all_reduce</code> over one rank returns the input unchanged and <code>world size: 1</code> &mdash; the collective ran. On a real N-GPU launch with <code>torchrun</code> this same call averages gradients across all N.</li>
</ul>
<p>The full DDP script in the CODE panel is <code>runnable:false</code>: it needs multiple GPUs, so copy it to a multi-GPU box and launch with <code>torchrun --standalone --nproc_per_node=4 ddp_train.py</code>.</p>`,

    cheatsheet: [
      { code: "dist.init_process_group(backend=\"nccl\")", note: "join the group (gloo on CPU)" },
      { code: "rank, N = dist.get_rank(), dist.get_world_size()", note: "this GPU's index; total GPUs" },
      { code: "DistributedSampler(ds, num_replicas=N, rank=rank)", note: "disjoint shard per rank" },
      { code: "sampler.set_epoch(epoch)", note: "every epoch or the shuffle repeats" },
      { code: "model = DDP(model, device_ids=[local_rank])", note: "wrap: grads all-reduced in backward()" },
      { code: "lr = base_lr * world_size", note: "linear scaling rule" },
      { code: "if rank == 0: torch.save(model.module.state_dict(), ...)", note: "save once, unwrap with .module" },
      { code: "DataLoader(..., drop_last=True)", note: "equal step counts -> no all-reduce deadlock" },
      { code: "torchrun --standalone --nproc_per_node=4 ddp_train.py", note: "one process per GPU" }
    ],

    deeper: `<p>The math under data parallelism is just the gradient of the average loss. The averaged gradient all-reduce produces is exactly the gradient you would compute on the <b>concatenated</b> big batch &mdash; which is why DDP on N GPUs equals one run at the larger effective batch, and why the <a onclick="App.open('dl-minibatch')">mini-batch</a> learning-rate scaling applies. Each replica then runs the ordinary <a onclick="App.open('dl-optimizers')">optimizer</a> step on that shared gradient. The speed trick is overlap: gradients become ready layer by layer during the backward pass (last layer first), and DDP fires each layer's all-reduce the moment it is ready, hiding communication under compute &mdash; something <code>nn.DataParallel</code> cannot do.</p>`,

    whenToUse:
      `<p><b>Reach for distributed training when one Graphics Processing Unit (GPU) is too slow or too small.</b>
       A single GPU works for most teaching and prototyping. You scale out when one of two walls hits:</p>
       <ul>
         <li><b>The data/compute wall:</b> the dataset is huge and one epoch on one GPU takes hours or days. You
         want to throw 4, 8, or 64 GPUs at it and finish roughly that many times faster. This is the common case,
         and the tool is <b>Distributed Data Parallel (DDP)</b> &mdash; data parallelism, covered below.</li>
         <li><b>The memory wall:</b> the <i>model itself</i> (its weights plus the optimizer state and activations)
         does not fit in one GPU's memory at all. Large language models are the usual culprit. Now plain replication
         is impossible &mdash; you must <b>shard</b> the model across GPUs with Fully Sharded Data Parallel (FSDP) or
         DeepSpeed/ZeRO (covered at the end).</li>
       </ul>
       <p>If your model fits on one GPU and training finishes in a reasonable time, <b>do not reach for any of this.</b>
       Distributed training adds real complexity and new failure modes. Use it when the speedup or the memory is
       worth the cost &mdash; multi-GPU servers and multi-node clusters.</p>
       <p>The mental model is the same as a Spark cluster (see <code>spark-intro</code>): split the work across
       many workers, each chews on its <b>shard</b> of the data, then combine the partial results. Here the workers
       are GPUs, the shard is a slice of the batch, and the &ldquo;combine&rdquo; step is averaging gradients.</p>`,

    application:
      `<p>This is how every large model you have heard of was trained.</p>
       <ul>
         <li><b>Big vision models on ImageNet</b> train across 8&ndash;256 GPUs with DDP to cut weeks down to hours.</li>
         <li><b>Large language models</b> (billions of parameters) are too big for one GPU, so they combine data
         parallelism with model sharding (FSDP, DeepSpeed/ZeRO) across hundreds or thousands of GPUs.</li>
         <li><b>Everyday research and production fine-tuning</b> on a single 4-GPU or 8-GPU box uses DDP launched with
         <code>torchrun</code> &mdash; the bread-and-butter case this lesson teaches.</li>
         <li><b>Frameworks built on top of DDP</b> &mdash; PyTorch Lightning, Hugging Face <code>accelerate</code>,
         and others &mdash; hide the boilerplate, but they all run DDP underneath. Knowing the mechanics here makes
         those tools far less mysterious.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Using <code>nn.DataParallel</code> instead of DDP.</b> <code>DataParallel</code> is the old,
         single-process API: one Python process drives all GPUs, scattering the batch and gathering outputs every
         step. GPU 0 does the extra gather/scatter work and holds the master copy, so it becomes a bottleneck and the
         memory is imbalanced &mdash; and Python's Global Interpreter Lock (GIL) serializes the GPUs. It is slower and
         legacy. <b>The fix: always use <code>DistributedDataParallel</code>.</b></li>
         <li><b>Forgetting the <code>DistributedSampler</code>.</b> Without it, every GPU's <code>DataLoader</code>
         iterates the <i>same</i> data, so all replicas see identical batches &mdash; you are just doing the same work
         N times, not splitting it. The <code>DistributedSampler</code> hands each rank a disjoint slice. <b>And call
         <code>sampler.set_epoch(epoch)</code> every epoch</b> or the shuffle is identical across epochs.</li>
         <li><b>Not scaling the learning rate.</b> With N GPUs the <b>effective batch size</b> is N times larger
         (each GPU's local batch, summed). A bigger batch gives a less noisy gradient, so the classic rule is to
         scale the learning rate up by N (the &ldquo;linear scaling rule&rdquo;), usually with a few warmup epochs.
         Forget this and a DDP run can converge worse than the single-GPU baseline.</li>
         <li><b>Logging or saving from every rank.</b> All N processes run the same code, so a naive
         <code>print</code> or <code>torch.save</code> fires N times &mdash; N copies of the checkpoint, garbled logs.
         <b>Guard them with <code>if rank == 0:</code></b> so only the lead process logs and writes the checkpoint.</li>
         <li><b>Deadlocks from uneven batch counts.</b> DDP synchronizes (all-reduce) on every backward pass, so all
         ranks must run the <i>same number</i> of steps. If one rank's data loader runs out a batch early (uneven
         dataset split, or a per-rank <code>break</code>), the others wait forever at the next all-reduce and the job
         hangs. Use <code>drop_last=True</code> or DDP's <code>join()</code> context to keep ranks in lockstep.</li>
         <li><b>Expecting it to run in Colab.</b> Free Colab gives you a <i>single</i> GPU, so a real multi-GPU DDP
         launch has nothing to distribute across. The DDP code in this lesson is therefore illustrative
         (<code>runnable:false</code>) &mdash; copy it to an actual multi-GPU machine and launch it with
         <code>torchrun</code>.</li>
       </ul>`,

    bigIdea:
      `<p><b>Data parallelism in one sentence:</b> put a full copy of the model on every GPU, give each copy a
       different slice of the batch, let each compute gradients on its slice, then <b>average the gradients across all
       copies</b> so every model stays identical.</p>
       <p>That averaging step is an <b>all-reduce</b>: a collective operation where every GPU contributes its gradient
       tensor, they are summed (then divided by N), and the same averaged result is handed back to every GPU. Because
       all copies start equal and apply the same averaged gradient, they take the same optimizer step and remain
       byte-for-byte identical forever. It is exactly the &ldquo;map then combine&rdquo; shape of a Spark job
       (<code>spark-intro</code>), specialized to gradients.</p>`,

    buildup:
      `<p>One DDP training step, blow by blow:</p>
       <ol>
         <li><b>Replicate.</b> Each of the N GPUs holds an identical copy of the model (same initial weights, enforced
         by DDP broadcasting from rank 0 at startup). One process drives each GPU &mdash; that index is its
         <b>rank</b>.</li>
         <li><b>Split the batch.</b> The <code>DistributedSampler</code> gives each rank a disjoint shard of this
         step's data. If each GPU's local batch is 32 and N = 8, the <b>effective batch size</b> is 256.</li>
         <li><b>Forward + backward locally.</b> Each GPU runs its shard through its own model copy and calls
         <code>loss.backward()</code>, producing a <i>local</i> gradient from its slice of the data.</li>
         <li><b>All-reduce the gradients.</b> DDP automatically averages the gradient tensors across all N GPUs, so
         every replica ends up with the same averaged gradient. (DDP overlaps this communication with the backward
         pass for speed &mdash; that is the main reason it beats <code>DataParallel</code>.)</li>
         <li><b>Step.</b> Every replica runs <code>optimizer.step()</code> on the identical averaged gradient, so they
         all update to the same new weights and stay in sync. Repeat.</li>
       </ol>
       <p><b>Gradient accumulation</b> is the poor-soul's batch scaling for when you have few GPUs: run several
       forward/backward passes, summing gradients, and only call <code>optimizer.step()</code> every K steps &mdash;
       giving an effective batch of K times the local batch <i>without</i> needing K times the memory at once.</p>`,

    symbols: [
      { sym: "<code>DistributedDataParallel</code> (DDP)", desc: "the standard data-parallel API: one process per GPU, gradients averaged by all-reduce, communication overlapped with the backward pass." },
      { sym: "<code>nn.DataParallel</code>", desc: "the legacy single-process API; easy to enable but slow and GPU-0-bottlenecked. Avoid in new code." },
      { sym: "rank / world_size", desc: "rank = this process's GPU index (0..N-1); world_size = N, the total number of processes. Rank 0 is the lead (it logs and saves)." },
      { sym: "all-reduce", desc: "the collective that sums every GPU's gradient tensor and returns the same averaged result to all of them." },
      { sym: "effective batch size", desc: "local batch per GPU times the number of GPUs (times accumulation steps). Drives the learning-rate scaling." },
      { sym: "<code>DistributedSampler</code>", desc: "splits the dataset so each rank gets a disjoint shard; call <code>set_epoch(e)</code> each epoch for correct shuffling." },
      { sym: "<code>torchrun</code>", desc: "the launcher that spawns one process per GPU and sets the rank/world-size environment variables DDP reads." },
      { sym: "FSDP / ZeRO", desc: "Fully Sharded Data Parallel / DeepSpeed ZeRO: shard the model weights, gradients, and optimizer state across GPUs for models too big to replicate." }
    ],

    formula: `$$t(N) \\;=\\; t_1\\left(s + \\frac{1-s}{N}\\right) \\;+\\; c\\,(N-1)$$`,
    whatItDoes:
      `<p>A simple Amdahl-style model of wall-clock time per epoch on N GPUs. $t_1$ is the single-GPU time. The
       fraction $s$ is the part that <i>cannot</i> be parallelized (data loading, fixed overhead); the rest,
       $1-s$, is split across N GPUs. The last term $c\\,(N-1)$ is <b>communication overhead</b> &mdash; the cost of
       all-reduce, which grows as you add GPUs and is why speedup goes <b>sub-linear</b> at scale. <b>Speedup</b> is
       $t_1 / t(N)$: near-linear for small N, then bending below the ideal line as the $c\\,(N-1)$ term takes over.
       Every symbol: $N$ = number of GPUs, $t_1$ = one-GPU time, $s$ = serial fraction, $c$ = per-step communication
       cost.</p>`,

    derivation:
      `<p><b>Why all-reduce keeps the replicas identical &mdash; and how DDP makes it fast.</b></p>
       <ul class="steps">
         <li>All replicas start with the <i>same</i> weights (DDP broadcasts rank 0's weights to everyone at
         construction). So before step 1, every model is identical.</li>
         <li>On a step, replica $i$ computes a local gradient $g_i$ from its data shard. All-reduce replaces every
         $g_i$ with the average $\\bar g = \\frac{1}{N}\\sum_i g_i$. Crucially, every replica now holds the
         <i>same</i> $\\bar g$.</li>
         <li>Each replica applies the same optimizer update with the same $\\bar g$ to the same weights, so they all
         land on identical new weights. By induction they stay identical for the whole run &mdash; no drift, no need to
         re-sync the weights themselves, only the gradients.</li>
         <li>The averaged gradient $\\bar g$ is exactly the gradient you would have computed on the <b>concatenated</b>
         big batch (for a mean loss), so DDP on N GPUs is mathematically a single run with the larger effective batch
         &mdash; which is why the learning-rate scaling rule applies.</li>
         <li><b>The speed trick:</b> gradients become ready layer by layer during the backward pass (last layer
         first). DDP fires the all-reduce for each layer's gradient <i>as soon as it is ready</i>, overlapping
         communication with the still-running backward compute. <code>DataParallel</code> cannot do this &mdash; it
         gathers everything on GPU 0 serially &mdash; which is the core reason DDP is faster.</li>
       </ul>`,

    example:
      `<p>Concrete numbers for an 8-GPU DDP run with a local batch of 32:</p>
       <ul class="steps">
         <li><b>Effective batch:</b> $32 \\times 8 = 256$ examples per optimizer step.</li>
         <li><b>Learning rate:</b> if the single-GPU recipe used $\\text{lr} = 0.1$ at batch 32, the linear scaling
         rule suggests $\\text{lr} = 0.1 \\times 8 = 0.8$ at batch 256 (with a short warmup so the big early steps
         do not blow up).</li>
         <li><b>Sampler:</b> the <code>DistributedSampler</code> hands each rank $1/8$ of the dataset; with 80,000
         training images that is 10,000 per GPU per epoch &mdash; the GPUs run the same number of steps and stay in
         lockstep.</li>
         <li><b>If you only have 1 GPU</b> but want the effect of batch 256, use <b>gradient accumulation</b> with
         $K = 8$: do 8 forward/backward passes of batch 32, summing gradients, then one <code>optimizer.step()</code>.
         Same effective batch, $1/8$ the peak memory, but 8&times; slower (no real parallelism).</li>
       </ul>`,

    practice: [
      {
        q: `<b>Type this in Colab.</b> Compute the <b>effective batch size</b> for a DDP run. Set <code>local_batch = 32</code> and <code>world_size = 8</code>, then print <code>local_batch * world_size</code>. Also print the per-GPU shard size of an 80,000-image dataset (<code>80000 // world_size</code>). Predict both numbers before running.`,
        steps: [
          { do: `Multiply the per-GPU batch by the number of GPUs: <code>local_batch * world_size</code>.`, why: `Each GPU processes its own local batch and their gradients are averaged, so the optimizer steps on the concatenated big batch.` },
          { do: `Floor-divide the dataset size by <code>world_size</code> for the per-rank shard.`, why: `The <code>DistributedSampler</code> hands each rank a disjoint slice, so each rank sees <code>1/N</code> of the data per epoch.` }
        ],
        answer: `<pre><code>local_batch = 32
world_size = 8
print(local_batch * world_size)       # 256  -- effective batch size
print(80000 // world_size)            # 10000  -- images per GPU per epoch</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Build a <code>DistributedSampler</code> by hand (no real cluster needed). Make a <code>TensorDataset</code> of 12 items, then create <code>DistributedSampler(ds, num_replicas=4, rank=0, shuffle=False)</code> and print <code>list(sampler)</code> &mdash; the indices rank 0 owns. Then build the same sampler for <code>rank=1</code> and print its indices. Notice they are disjoint.`,
        steps: [
          { do: `Construct a sampler per rank with <code>num_replicas=4</code> and a different <code>rank</code>.`, why: `Each rank gets a disjoint shard; without the sampler every rank would iterate the SAME data and you'd just do the work N times.` },
          { do: `Print <code>list(sampler)</code> for rank 0 and rank 1.`, why: `Seeing the index sets makes the disjoint-shard behavior concrete.` }
        ],
        answer: `<pre><code>import torch
from torch.utils.data import TensorDataset
from torch.utils.data.distributed import DistributedSampler

ds = TensorDataset(torch.arange(12))
s0 = DistributedSampler(ds, num_replicas=4, rank=0, shuffle=False)
s1 = DistributedSampler(ds, num_replicas=4, rank=1, shuffle=False)
print(list(s0))     # [0, 4, 8]
print(list(s1))     # [1, 5, 9]
# disjoint shards -- rank 0 and rank 1 never see the same index</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Demonstrate the <code>set_epoch</code> gotcha. Build a shuffling <code>DistributedSampler(ds, num_replicas=2, rank=0, shuffle=True)</code> over a 10-item dataset. Print <code>list(sampler)</code> twice with NO <code>set_epoch</code> (same order), then call <code>sampler.set_epoch(1)</code> and print again (new order).`,
        steps: [
          { do: `Print the sampler's indices twice without changing the epoch.`, why: `A shuffling sampler reuses the same seed each epoch unless told otherwise, so the shuffle is identical &mdash; the famous bug.` },
          { do: `Call <code>sampler.set_epoch(1)</code> then print again.`, why: `<code>set_epoch</code> mixes the epoch into the seed so each epoch reshuffles differently across ranks.` }
        ],
        answer: `<pre><code>import torch
from torch.utils.data import TensorDataset
from torch.utils.data.distributed import DistributedSampler

ds = TensorDataset(torch.arange(10))
sampler = DistributedSampler(ds, num_replicas=2, rank=0, shuffle=True)

sampler.set_epoch(0)
print(list(sampler))     # e.g. [4, 1, 7, 5, 3]
sampler.set_epoch(0)
print(list(sampler))     # SAME order -- identical shuffle (the bug)
sampler.set_epoch(1)
print(list(sampler))     # different order -- correct reshuffle</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Wrap a tiny model in <code>nn.DataParallel</code> (works on CPU/single GPU, unlike DDP). Build <code>nn.Linear(4, 2)</code>, wrap it as <code>dp = nn.DataParallel(model)</code>, run a <code>(6, 4)</code> input through it, and print the output shape. Then unwrap with <code>dp.module</code> and confirm it is the original <code>Linear</code>.`,
        steps: [
          { do: `Wrap the model with <code>nn.DataParallel(model)</code> and call it on a batch.`, why: `<code>DataParallel</code> is the single-process API; it runs even with one device, so it's the one you can demo in Colab.` },
          { do: `Access <code>dp.module</code> to reach the underlying model.`, why: `Both <code>DataParallel</code> and DDP store the real model under <code>.module</code> &mdash; you need it to save a clean <code>state_dict</code>.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn

model = nn.Linear(4, 2)
dp = nn.DataParallel(model)
x = torch.randn(6, 4)
out = dp(x)
print(out.shape)                 # torch.Size([6, 2])
print(type(dp.module).__name__)  # Linear  -- the unwrapped model
print(dp.module is model)        # True</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show the <code>.module</code> checkpoint gotcha. Wrap <code>nn.Linear(4, 2)</code> in <code>nn.DataParallel</code>, then print the FIRST key of <code>dp.state_dict()</code> (note the <code>module.</code> prefix) versus <code>dp.module.state_dict()</code> (no prefix). Save the clean one with <code>torch.save</code> and confirm it loads back into a plain <code>nn.Linear(4, 2)</code>.`,
        steps: [
          { do: `Compare <code>list(dp.state_dict())[0]</code> with <code>list(dp.module.state_dict())[0]</code>.`, why: `Saving the wrapper's <code>state_dict</code> prepends <code>module.</code> to every key, which then fails to load into the bare model.` },
          { do: `Save <code>dp.module.state_dict()</code> and <code>load_state_dict</code> into a fresh <code>nn.Linear</code>.`, why: `Unwrapping first gives keys that match the plain model exactly.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn

dp = nn.DataParallel(nn.Linear(4, 2))
print(list(dp.state_dict())[0])         # module.weight  -- prefixed!
print(list(dp.module.state_dict())[0])  # weight         -- clean

torch.save(dp.module.state_dict(), "m.pt")
plain = nn.Linear(4, 2)
plain.load_state_dict(torch.load("m.pt"))   # loads cleanly
print("loaded ok")                          # loaded ok</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Initialize a single-process &ldquo;distributed&rdquo; group with the <code>gloo</code> CPU backend and do a real <code>all_reduce</code>. Set the env vars, call <code>dist.init_process_group("gloo", rank=0, world_size=1)</code>, all-reduce a tensor <code>[1.0, 2.0, 3.0]</code> with <code>ReduceOp.SUM</code>, print it, then <code>destroy_process_group()</code>.`,
        steps: [
          { do: `Set <code>MASTER_ADDR</code>/<code>MASTER_PORT</code> and call <code>init_process_group</code> with <code>world_size=1</code>.`, why: `<code>gloo</code> runs on CPU, so a 1-process group is the only DDP-family primitive you can actually execute in Colab.` },
          { do: `Call <code>dist.all_reduce(t, op=ReduceOp.SUM)</code>.`, why: `All-reduce is the collective DDP uses to average gradients; with one rank the sum just returns the same tensor, proving the call works.` }
        ],
        answer: `<pre><code>import os, torch
import torch.distributed as dist

os.environ["MASTER_ADDR"] = "127.0.0.1"
os.environ["MASTER_PORT"] = "29500"
dist.init_process_group("gloo", rank=0, world_size=1)

t = torch.tensor([1.0, 2.0, 3.0])
dist.all_reduce(t, op=dist.ReduceOp.SUM)
print(t)                       # tensor([1., 2., 3.])  (sum over 1 rank)
print(dist.get_world_size())   # 1
dist.destroy_process_group()</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Apply the <b>linear scaling rule</b> in code. Given <code>base_lr = 0.1</code> tuned at a local batch of 32, and a DDP run with <code>world_size = 8</code>, compute the scaled learning rate and the effective batch size, then build an SGD optimizer over <code>nn.Linear(10, 2)</code> with that learning rate and print <code>optimizer.param_groups[0]["lr"]</code>.`,
        steps: [
          { do: `Scale the learning rate: <code>base_lr * world_size</code>.`, why: `A bigger effective batch has less gradient noise, so the linear scaling rule raises the learning rate by N to keep step magnitudes right.` },
          { do: `Pass the scaled value into <code>torch.optim.SGD</code> and read it back from <code>param_groups</code>.`, why: `<code>param_groups</code> is the source of truth for what the optimizer will actually use.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn

base_lr, world_size, local_batch = 0.1, 8, 32
scaled_lr = base_lr * world_size
print(scaled_lr)                       # 0.8
print(local_batch * world_size)        # 256  -- effective batch

model = nn.Linear(10, 2)
optimizer = torch.optim.SGD(model.parameters(), lr=scaled_lr, momentum=0.9)
print(optimizer.param_groups[0]["lr"]) # 0.8</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Demonstrate gradient accumulation (the single-GPU stand-in for a big effective batch). On <code>nn.Linear(4, 1)</code> with <code>K = 4</code> micro-batches of shape <code>(2, 4)</code>, run forward/backward 4 times, dividing each loss by <code>K</code>, and call <code>optimizer.step()</code> and <code>zero_grad()</code> only ONCE after the loop. Print the loss of each micro-step. Use <code>torch.manual_seed(0)</code>.`,
        steps: [
          { do: `Accumulate <code>(loss / K).backward()</code> across K micro-batches without stepping.`, why: `Gradients add up across backward calls, so K micro-batches give the same averaged gradient as one batch of K&times; the size.` },
          { do: `Call <code>optimizer.step()</code> then <code>optimizer.zero_grad()</code> once, after the loop.`, why: `Stepping once per K micro-batches yields an effective batch of K&times; the micro-batch with 1/K the peak memory.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn

torch.manual_seed(0)
model = nn.Linear(4, 1)
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
K = 4
optimizer.zero_grad()
for k in range(K):
    xb = torch.randn(2, 4)
    yb = torch.randn(2, 1)
    loss = ((model(xb) - yb) ** 2).mean() / K   # scale by K
    loss.backward()                             # grads ACCUMULATE
    print(round(loss.item(), 4))
# 0.4961
# 0.2473
# 0.6014
# 0.2105
optimizer.step()        # one step on the accumulated gradient
optimizer.zero_grad()   # clear for the next effective batch</code></pre>`
      }
    ]
  });

  window.CODE["pt-distributed"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A complete <b>DistributedDataParallel (DDP)</b> skeleton &mdash; the standard way to train across
      multiple GPUs. The script runs once <i>per GPU</i>: <code>torchrun</code> spawns one process for each GPU and
      sets the <code>RANK</code>/<code>WORLD_SIZE</code>/<code>LOCAL_RANK</code> environment variables. Each process
      calls <code>init_process_group</code> to join the group, pins itself to its GPU, wraps the model in
      <code>DDP(model, device_ids=[local_rank])</code>, and uses a <code>DistributedSampler</code> so every rank sees
      a <i>disjoint</i> shard of the data. The training loop is ordinary PyTorch &mdash; DDP averages the gradients via
      all-reduce inside <code>loss.backward()</code> automatically. Note the <code>if rank == 0</code> guards on
      logging and checkpoint saving, and <code>sampler.set_epoch(epoch)</code> for correct shuffling.
      <code>runnable</code> is off because this needs <i>multiple</i> GPUs; free Colab has only one, so the launch is
      illustrative &mdash; copy it to a multi-GPU machine and run
      <code>torchrun --standalone --nproc_per_node=4 ddp_train.py</code>.</p>`,
    code: `# ddp_train.py  —  launch with:
#   torchrun --standalone --nproc_per_node=4 ddp_train.py
# (one process per GPU; torchrun sets RANK / WORLD_SIZE / LOCAL_RANK)
import os
import torch
import torch.nn as nn
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.utils.data import DataLoader, TensorDataset
from torch.utils.data.distributed import DistributedSampler
import torch.distributed as dist


def main():
    # --- 1. Join the process group -------------------------------------
    # 'nccl' is the fast GPU backend. torchrun provides the env vars.
    dist.init_process_group(backend="nccl")
    rank        = dist.get_rank()              # global process index (0..N-1)
    world_size  = dist.get_world_size()        # total number of GPUs (N)
    local_rank  = int(os.environ["LOCAL_RANK"])# GPU index on this machine
    torch.cuda.set_device(local_rank)          # pin this process to its GPU
    device = torch.device("cuda", local_rank)

    torch.manual_seed(0)                       # same seed -> identical init

    # --- 2. A tiny synthetic dataset -----------------------------------
    X = torch.randn(8000, 784)
    y = torch.randint(0, 10, (8000,))
    dataset = TensorDataset(X, y)

    # DistributedSampler hands each rank a DISJOINT shard of the data.
    # Without it, every GPU would see the SAME batches (a classic bug).
    sampler = DistributedSampler(dataset, num_replicas=world_size,
                                 rank=rank, shuffle=True)
    local_batch = 32
    loader = DataLoader(dataset, batch_size=local_batch, sampler=sampler,
                        drop_last=True)        # drop_last keeps step counts
                                               # equal -> no all-reduce deadlock
    eff_batch = local_batch * world_size       # effective batch size
    if rank == 0:
        print(f"world_size={world_size}  local_batch={local_batch}  "
              f"effective_batch={eff_batch}")

    # --- 3. Model, wrapped in DDP --------------------------------------
    model = nn.Sequential(
        nn.Linear(784, 256), nn.ReLU(), nn.Linear(256, 10)
    ).to(device)
    model = DDP(model, device_ids=[local_rank])   # broadcasts weights from
                                                  # rank 0; averages grads via
                                                  # all-reduce in backward()

    # Linear scaling rule: scale base lr by the number of GPUs.
    base_lr = 0.05
    optimizer = torch.optim.SGD(model.parameters(),
                                lr=base_lr * world_size, momentum=0.9)
    loss_fn = nn.CrossEntropyLoss()            # expects raw logits + class idx

    # --- 4. The per-rank training loop ---------------------------------
    for epoch in range(5):
        sampler.set_epoch(epoch)               # reshuffle differently each epoch
        model.train()
        running = 0.0
        for xb, yb in loader:
            xb, yb = xb.to(device), yb.to(device)
            optimizer.zero_grad()
            logits = model(xb)                 # forward on this rank's shard
            loss = loss_fn(logits, yb)
            loss.backward()                    # DDP all-reduces grads HERE
            optimizer.step()                   # every rank takes the same step
            running += loss.item()
        # Only rank 0 logs (otherwise N copies of every line).
        if rank == 0:
            print(f"epoch {epoch}  loss {running / len(loader):.4f}")

    # --- 5. Save ONCE, from rank 0 only --------------------------------
    if rank == 0:
        # .module unwraps the DDP wrapper to the plain model's state_dict
        torch.save(model.module.state_dict(), "model.pt")
        print("saved checkpoint from rank 0")

    dist.destroy_process_group()               # clean shutdown


if __name__ == "__main__":
    main()`
  };

  window.CODEVIZ["pt-distributed"] = {
    question: "How much faster does DDP train as you add GPUs? Throughput (images/sec) and speedup vs the number of GPUs under a simple Amdahl-style model with communication overhead — near-linear at first, then sub-linear as all-reduce cost grows.",
    charts: [{
      type: "line",
      title: "DDP throughput vs number of GPUs (Amdahl model with comm overhead)",
      xlabel: "number of GPUs (N)",
      ylabel: "throughput (images/sec)",
      series: [
        { name: "ideal (linear)", color: "#8b949e", points: [[1, 1000], [2, 2000], [4, 4000], [8, 8000], [16, 16000], [32, 32000]] },
        { name: "DDP (modeled)", color: "#4ea1ff", points: [[1, 1000], [2, 1958], [4, 3740], [8, 6752], [16, 10724], [32, 13258]] }
      ]
    }],
    caption: "Real numbers from a per-epoch time model t(N) = t1*(s + (1-s)/N) + c*(N-1) with serial fraction s=0.02 and per-step comm cost c=0.0008*t1; throughput = 1000 * t1/t(N). Speedup is near-linear early (2 GPUs -> 1.96x, 4 -> 3.74x) then falls off as the c*(N-1) all-reduce term dominates (16 -> 10.7x, 32 -> 13.3x of the ideal 32x). Real speedups depend on model size, interconnect, and batch — this is illustrative.",
    code: `import numpy as np

# Amdahl-style per-epoch time model with all-reduce communication overhead.
#   t(N) = t1 * (s + (1-s)/N)  +  c*(N-1)
# s = serial (non-parallelizable) fraction; c = per-step comm cost.
t1 = 1.0          # single-GPU epoch time (normalized)
s  = 0.02         # 2% of work is serial (data loading, fixed overhead)
c  = 0.0008 * t1  # communication grows with the number of GPUs

Ns = np.array([1, 2, 4, 8, 16, 32])
t  = t1 * (s + (1 - s) / Ns) + c * (Ns - 1)

base_throughput = 1000.0                 # images/sec on 1 GPU
throughput = base_throughput * (t1 / t)  # faster epoch -> higher throughput
ideal      = base_throughput * Ns        # perfect linear scaling
speedup    = t1 / t

for n, thr, sp in zip(Ns, throughput, speedup):
    print(f"N={n:>2d}  throughput={thr:8.1f} img/s  speedup={sp:5.2f}x "
          f"(ideal {n}x)")
# N= 1  throughput=  1000.0 img/s  speedup= 1.00x (ideal 1x)
# N= 2  throughput=  1958.0 img/s  speedup= 1.96x (ideal 2x)
# N= 4  throughput=  3740.6 img/s  speedup= 3.74x (ideal 4x)
# N= 8  throughput=  6752.4 img/s  speedup= 6.75x (ideal 8x)
# N=16  throughput= 10724.2 img/s  speedup=10.72x (ideal 16x)
# N=32  throughput= 13257.6 img/s  speedup=13.26x (ideal 32x)

import matplotlib.pyplot as plt
plt.plot(Ns, ideal, "--", color="#8b949e", label="ideal (linear)")
plt.plot(Ns, throughput, "o-", color="#4ea1ff", label="DDP (modeled)")
plt.xlabel("number of GPUs (N)")
plt.ylabel("throughput (images/sec)")
plt.title("DDP throughput vs number of GPUs")
plt.legend()
plt.show()`
  };
})();
