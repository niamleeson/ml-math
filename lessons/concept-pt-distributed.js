/* PyTorch (a complete course) — "Training across many GPUs/machines: DataParallel vs DDP, FSDP".
   Self-contained: lesson + CODE + CODEVIZ merged by id "pt-distributed". */
(function () {
  window.LESSONS.push({
    id: "pt-distributed",
    title: "Distributed training: DataParallel, DistributedDataParallel (DDP), and sharding",
    tagline: "Replicate the model on every GPU, split the batch, and all-reduce the gradients so all copies stay in sync — DDP is the standard way.",
    module: "PyTorch (a complete course)",
    prereqs: ["pt-training-loop", "dl-minibatch", "dl-optimizers", "spark-intro"],

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
        q: `A teammate scales from 1 GPU to 4 GPUs with DDP, but final accuracy drops noticeably versus the single-GPU baseline. They kept everything else the same. What is the most likely cause, and what is the fix?`,
        steps: [
          { do: `Note that 4-GPU DDP makes the effective batch size 4&times; larger (each GPU keeps its local batch, and gradients are averaged across all 4).`, why: `DDP is mathematically one run on the concatenated big batch, so the optimizer is now stepping on a much larger batch than the baseline used.` },
          { do: `Realize a bigger batch gives a less noisy gradient, so the old learning rate is now effectively too small for the new batch.`, why: `The learning rate was tuned for the small-batch gradient noise; at 4&times; the batch it no longer matches.` },
          { do: `Apply the linear scaling rule: multiply the learning rate by 4 (with a short warmup).`, why: `Scaling lr with the effective batch restores the step magnitude the optimizer expects, recovering the baseline accuracy.` }
        ],
        answer: `<p>They forgot to <b>scale the learning rate</b>. With 4 GPUs the effective batch is 4&times; larger, which lowers gradient noise and makes the original learning rate effectively too small. Use the linear scaling rule &mdash; multiply the learning rate by 4 (the number of GPUs), typically with a few warmup epochs so the larger early steps stay stable. This is the single most common reason a correct DDP setup underperforms its single-GPU baseline.</p>`
      },
      {
        q: `A DDP job launched with <code>torchrun --nproc_per_node=4</code> hangs partway through an epoch with no error &mdash; the GPUs sit at 100% then go idle and nothing happens. What class of bug is this, and what causes it?`,
        steps: [
          { do: `Recognize that DDP does an all-reduce on every backward pass, which is a synchronization barrier: all 4 ranks must reach it together.`, why: `If even one rank does not arrive at an all-reduce, the others block waiting for it indefinitely &mdash; a deadlock, which looks like a silent hang.` },
          { do: `Look for a reason one rank runs fewer steps than the others &mdash; an uneven dataset split, <code>drop_last=False</code> leaving a ragged last batch, or a per-rank early <code>break</code>.`, why: `Different step counts mean one rank finishes its loop while the others are still waiting at the next all-reduce.` },
          { do: `Make the step counts equal: set <code>drop_last=True</code> in the DataLoader (or use DDP's <code>join()</code> context for uneven inputs).`, why: `Equal step counts keep every rank hitting each all-reduce together, so no rank is left waiting.` }
        ],
        answer: `<p>It is a <b>deadlock from uneven batch counts</b>. DDP synchronizes via all-reduce on every backward pass, so all ranks must run the same number of steps. When one rank runs out of batches early &mdash; ragged last batch, uneven split, or a per-rank <code>break</code> &mdash; the others block forever at the next all-reduce and the job hangs with no error. Fix it by forcing equal step counts: <code>drop_last=True</code> in the DataLoader, or wrap the loop in DDP's <code>model.join()</code> context to handle uneven inputs.</p>`
      },
      {
        q: `You have one big model and a large dataset. You try DDP and immediately get a CUDA out-of-memory error before training even starts &mdash; the model will not even fit one copy on one GPU. Is DDP the right tool, and what should you use instead?`,
        steps: [
          { do: `Identify which wall you hit: this is the memory wall (the model does not fit), not the compute wall (training too slow).`, why: `DDP is data parallelism &mdash; it puts a full replica on every GPU. If one replica does not fit, DDP cannot help.` },
          { do: `Recognize you need to shard the model itself &mdash; split its weights, gradients, and optimizer state across GPUs rather than replicating them.`, why: `Sharding means no single GPU ever holds the whole model, so a model larger than one GPU's memory becomes trainable.` },
          { do: `Switch to Fully Sharded Data Parallel (FSDP) or DeepSpeed/ZeRO.`, why: `These shard parameters/optimizer state across GPUs (and can offload to CPU), fitting models too big for plain DDP while still scaling across data.` }
        ],
        answer: `<p>DDP is the <i>wrong</i> tool here. DDP replicates a full copy of the model on every GPU, so if one copy will not fit, it cannot run &mdash; this is the <b>memory wall</b>, not the speed problem DDP solves. You need <b>model sharding</b>: <b>Fully Sharded Data Parallel (FSDP)</b> or <b>DeepSpeed/ZeRO</b>, which split the weights, gradients, and optimizer state across GPUs (optionally offloading to Central Processing Unit memory) so no single GPU ever holds the whole model. Reserve plain DDP for when the model fits but training is too slow.</p>`
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
