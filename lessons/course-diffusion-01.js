/* Rigorous Courses · Diffusion Models — Part 01: What It Means to Generate Data.
   Owns the problem statement: images as points, datasets as clouds, distributions informally,
   generation = sampling, why it is hard, and the diffusion idea in words only. */
(function () {
  window.LESSONS.push({
    id: "diff-01-generative-modeling",
    title: "Part 1 — What It Means to Generate Data",
    tagline: "Every image is a point, every dataset is a cloud, and generating means drawing a brand-new point from the cloud's rule",
    module: "Rigorous Courses · Diffusion Models",
    superGroup: "Rigorous Courses",
    template: "course",
    part: 1,
    partTotal: 12,
    prereqs: [],
    goal: `<p>After this part you can:</p>
      <ul>
        <li>Turn any grayscale image into a <b>vector</b> (a flat list of numbers), say what <b>dimension</b> it lives in, and go back the other way without losing anything.</li>
        <li>Read a dataset as a <b>cloud of points</b>, and judge with real numbers which new points are plausible and which are not.</li>
        <li>State, informally but honestly, what a <b>probability distribution</b> is, and write the generation problem in one line: draw $x_{\\text{new}} \\sim p(x)$.</li>
        <li>Give the three concrete reasons generation is hard, including the $256^{784} \\approx 10^{1888}$ counting argument, computed by hand.</li>
        <li>Tell the diffusion story end to end in plain words — and say exactly which later part proves each claim in it.</li>
      </ul>`,
    sections: [
      {
        h: "Where we are",
        body: `<p>This course makes you one promise: by part 10 you will train, from scratch, the exact algorithm that powers the engine inside Stable Diffusion — and you will understand every line of it, because you will have derived every line yourself. Not "roughly how it works". The real thing: the algorithm from the 2020 paper <b>Denoising Diffusion Probabilistic Models</b> (DDPM), the same core that, scaled up and given a text encoder, became the image generators you have seen everywhere. When we are done you will be able to read <a onclick="App.open('paper-ddpm')">the DDPM paper lesson</a> the way its authors intended: as a sequence of moves you already know how to make.</p>
        <p>Here is what we assume you know: basic Python, and high-school algebra. That is the whole list. No probability, no linear algebra, no calculus, no machine learning. Parts 2 through 5 build the entire probability toolkit from a single die roll upward, defining every term before using it. Parts 6 through 9 use that toolkit to build the full theory of diffusion, one derivation at a time, one operation per step. Parts 10 through 12 turn the theory into working code: a trained model, fast sampling, and steering — ending with the assembled picture of Stable Diffusion itself. Here is the whole journey:</p>
        <table class="symbols">
          <tr><td><b>Part</b></td><td><b>The question it answers</b></td><td><b>The formula it owns</b></td></tr>
          <tr><td>1</td><td>What exactly does "generate data" mean?</td><td>$x_{\\text{new}} \\sim p(x)$</td></tr>
          <tr><td>2</td><td>What is a rule of randomness?</td><td>$p(y \\mid x) = \\frac{p(x \\mid y)\\,p(y)}{p(x)}$</td></tr>
          <tr><td>3</td><td>What is the noise we will use?</td><td>$x = \\mu + \\sigma z$</td></tr>
          <tr><td>4</td><td>How do chains of random steps behave?</td><td>$q(x_{1:T} \\mid x_0) = \\prod_{t=1}^{T} q(x_t \\mid x_{t-1})$</td></tr>
          <tr><td>5</td><td>How do we score a guessed rule?</td><td>$\\log p_\\theta(x) = \\mathrm{ELBO} + D_{\\mathrm{KL}}$</td></tr>
          <tr><td>6</td><td>How is an image destroyed on schedule?</td><td>$x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$</td></tr>
          <tr><td>7</td><td>What is the perfect one-step undo?</td><td>$\\tilde\\mu_t(x_t, x_0)$ and $\\tilde\\beta_t$</td></tr>
          <tr><td>8</td><td>What single number do we train on?</td><td>$L_{t-1} = \\mathbb{E}\\, D_{\\mathrm{KL}}(q \\,\\|\\, p_\\theta)$</td></tr>
          <tr><td>9</td><td>Why does "predict the noise" work?</td><td>$\\|\\epsilon - \\epsilon_\\theta(x_t, t)\\|^2$</td></tr>
          <tr><td>10</td><td>How do we build and train the real thing?</td><td>$\\epsilon_\\theta(x_t, t)$, trained by Algorithm 1</td></tr>
          <tr><td>11</td><td>How do we sample in 20 steps, not 1000?</td><td>$\\nabla_x \\log p(x)$</td></tr>
          <tr><td>12</td><td>How do we steer it — and what is Stable Diffusion?</td><td>$\\tilde\\epsilon = \\epsilon_\\varnothing + w\\,(\\epsilon_y - \\epsilon_\\varnothing)$</td></tr>
        </table>
        <p>Do not worry that most of those formulas look like hieroglyphics right now. That is the point: each one gets a full part, and by the time you reach it, it will be the natural next sentence in a story you already know. Each part comes as a lesson (the ideas and the math) plus a notebook (where every claim gets checked with real numbers — nothing in this course is taken on faith).</p>
        <p>This first part answers the question the whole course rests on: <b>what problem is a diffusion model actually solving?</b> By the end of it you will be able to state that problem in one line of math, and you will have felt, with concrete numbers, why it is genuinely hard. No noise, no networks yet — first we need to agree on what "generate an image" even means.</p>`
      },
      {
        h: "A picture is a list of numbers",
        body: `<p>Open a photo on your phone and zoom in until it dissolves into little squares. Each square is a <b>pixel</b>, and in a grayscale image each pixel is nothing more than a single number: how bright that little square is. We will use the convention that 0 means fully black, 1 means fully white, and values in between are shades of gray — 0.5 is a middle gray. That is the entire content of a grayscale image: a grid of brightness numbers. There is nothing else in the file.</p>
        <p>Let's make that concrete with the smallest interesting image: 2 pixels tall and 2 pixels wide. Say the top-left pixel is bright (0.9), the top-right is dark (0.1), the bottom-left is bright (0.8), and the bottom-right is fully black (0.0). Now read the grid the way you read a book — left to right along the top row, then left to right along the bottom row — and write the numbers down in that order. The whole image becomes a flat list of four numbers:</p>
        <div class="formula-box">$$x_0 = (0.9,\\; 0.1,\\; 0.8,\\; 0.0)$$</div>
        <p>The clean image, which we name $x_0$, is the list of four brightness numbers 0.9, 0.1, 0.8, 0.0 — top-left first, then top-right, bottom-left, bottom-right. Nothing was lost in the flattening: because we fixed the reading order once and for all, anyone can take the list and rebuild the exact 2-by-2 grid. Flattening is a change of shape, not a change of content.</p>
        <p>A flat list of numbers has a standard name: a <b>vector</b>. Each number in it is called an entry (or a component). The count of entries is called the <b>dimension</b> of the vector. Our tiny image is a 4-dimensional vector. That is all "dimension" means in this course: how many numbers it takes to write the thing down.</p>
        <p>Now the small leap that powers everything else. A vector with 2 entries can be drawn as a point on a flat map: go 0.9 across, 0.1 up. A vector with 3 entries is a point in the room you are sitting in. A vector with 4 entries is a point in 4-dimensional space — and no, nobody can picture 4-dimensional space, including professional mathematicians. You do not need to picture it. All the arithmetic you can do with 2 numbers (compare them, subtract them, measure distances) works the same way with 4, or 64, or 784. The picture in your head can stay 2-dimensional; the algebra quietly carries the rest.</p>
        <p>Scale it up: the classic handwritten-digit images are $28 \\times 28$ pixels, which is $28 \\times 28 = 784$ numbers, so each image is one point in 784-dimensional space. The smaller digits dataset we use in this part's notebook is $8 \\times 8$, so each of its images is a point in 64-dimensional space. Hold on to this sentence, because the whole course stands on it: <b>an image is a point</b>. One image, one point. A dataset of many images is many points — and that is the next section.</p>`
      },
      {
        h: "Datasets are clouds of points",
        body: `<p>If one image is one point, then a dataset — thousands of images — is thousands of points scattered in the same space. Points, plural, scattered in space: a <b>cloud</b>. This is not a metaphor we will wave at and abandon; it is the literal geometry the math runs on.</p>
        <p>The cloud has structure, and the structure means something: <b>nearby points are similar images</b>. Two images are similar when every pixel's brightness is close, which is exactly the same as saying the two vectors' entries are all close, which is exactly the same as saying the two points sit near each other. For 2-pixel images $a = (a_1, a_2)$ and $b = (b_1, b_2)$ we can even measure it, using the straight-line distance you know from Pythagoras:</p>
        <div class="formula-box">$$\\mathrm{dist}(a, b) = \\sqrt{(a_1 - b_1)^2 + (a_2 - b_2)^2}$$</div>
        <p>The distance between images $a$ and $b$ is: subtract the matching pixels, square each difference, add the squares, and take the square root. Small distance, similar images; large distance, different images. (The same formula with more terms works in any dimension — one squared difference per pixel.)</p>
        <p>Let's build an entire dataset small enough to draw. Our "images" have just 2 pixels — a left brightness and a right brightness — so every image is a point on a flat map: left pixel across, right pixel up. Here are six images:</p>
        <table class="symbols">
          <tr><td><b>Image</b></td><td><b>(left pixel, right pixel)</b></td><td><b>What it looks like</b></td></tr>
          <tr><td>A</td><td>(0.90, 0.10)</td><td>bright left, dark right</td></tr>
          <tr><td>B</td><td>(0.85, 0.15)</td><td>bright left, dark right</td></tr>
          <tr><td>C</td><td>(0.80, 0.10)</td><td>bright left, dark right</td></tr>
          <tr><td>D</td><td>(0.10, 0.90)</td><td>dark left, bright right</td></tr>
          <tr><td>E</td><td>(0.15, 0.85)</td><td>dark left, bright right</td></tr>
          <tr><td>F</td><td>(0.20, 0.90)</td><td>dark left, bright right</td></tr>
        </table>
        <p>Plot these six points in your head (or on paper — it takes a minute and is worth it). A, B, C huddle in the lower-right corner of the map; D, E, F huddle in the upper-left. Two tight clusters, and a wide empty middle. Check the geometry with the distance formula: A to B is $\\sqrt{(0.90-0.85)^2 + (0.10-0.15)^2} = \\sqrt{0.0025 + 0.0025} \\approx 0.07$ — neighbors. A to D is $\\sqrt{(0.80)^2 + (0.80)^2} \\approx 1.13$ — sixteen times farther. "Similar images sit near each other" is now a number, not a slogan.</p>
        <p>Now the question that defines this whole course. Suppose a brand-new 2-pixel image arrives and claims to belong to this dataset. Which claims would you believe? A point like (0.87, 0.13) lands right inside the A-B-C cluster — believable: it looks like a small variation of images we have already seen. A point like (0.50, 0.50) lands in the dead middle of the empty region — not believable: nothing in this dataset ever looked like that. The dataset has taught us, without any equations, which regions of the space are <b>plausible</b> and which are not. The next section gives that intuition a name.</p>`
      },
      {
        h: "The cloud has a shape: distributions",
        body: `<p>Look at the cloud from far away and squint. Some regions are crowded — points pile up there. Most of the space is empty — no point ever lands there. For real images this contrast is extreme: the region of 784-dimensional space where realistic digit images live is a vanishingly thin sliver, and essentially all the rest of the space is meaningless static. (The notebook makes this concrete with real data: some brightness values at some pixels occur constantly, others almost never.)</p>
        <p>Here is the informal definition we will use until part 2 makes it precise. A <b>probability distribution</b> is a rule that says how likely each region of the space is — a way of assigning every region a share of the total likelihood. Two properties make a rule a legitimate distribution: no region's share is negative, and all the shares together total exactly 1 (that is, 100 percent — every point that ever gets drawn must land somewhere). You can picture the rule as spread-out mass: heavy where the cloud is crowded, nearly weightless in the empty vastness.</p>
        <p>We write the rule as $p(x)$, read "$p$ of $x$": for a candidate point $x$, the value $p(x)$ is large where realistic data crowds together and near zero in the empty regions. In our 2-pixel toy, $p$ is heavy on the two corner clusters and almost zero in the middle. A concrete way to hold this: chop the map into cells and write in each cell the fraction of dataset points that land there — a table of shares. That table is a hand-built miniature of $p(x)$, and one of your practice problems has you read one.</p>
        <p>One honesty note, so that nothing said today has to be unsaid later. For continuous quantities like brightness values, "how likely is exactly this point" turns out to be the wrong question (the honest answer is: zero), and the right object is a <b>density</b>, where likelihood lives on regions and is measured by area. That is a real subtlety and it gets its own careful treatment in part 2. Everything in this part survives that upgrade unchanged: crowded regions are exactly where the density is high.</p>
        <p>The key mental shift of this section: the dataset is not the object of interest. The dataset is <b>evidence</b> about the object of interest, which is the rule $p(x)$ that produced it. Six points showed us two clusters; the rule behind them presumably keeps producing bright-left-dark-right and dark-left-bright-right images forever. The cloud is what we see; the rule is what we want.</p>`
      },
      {
        h: "Generating means sampling from the cloud's rule",
        body: `<p>Now we can say precisely what this course is about. To <b>sample</b> from a distribution is to produce a point at random <b>according to its rule</b>: regions with a big share come up often, regions with a tiny share come up rarely, and over many draws the fractions match the shares. Rolling a die is sampling from the six-way even rule. Drawing a card from a shuffled deck is sampling from the 52-way even rule. Nature producing a photograph-worthy scene in front of your camera is — this is the leap — sampling from the distribution of natural images.</p>
        <p>The generation problem, in one line:</p>
        <div class="formula-box">$$x_{\\text{new}} \\sim p(x)$$</div>
        <p>Draw a fresh point $x_{\\text{new}}$ according to the rule $p$ — the wiggly symbol $\\sim$ reads "is drawn from" or "is a sample of". A machine that can do this for the distribution of face photographs produces new, never-before-seen, realistic faces. That single line is what Stable Diffusion does, and building a machine that does it is the entire subject of this course.</p>
        <p>It is worth contrasting this with the kind of ML task you may have heard of first. A <b>discriminative</b> task takes a data point in and puts a judgment out: photo in, "cat or dog" out; email in, "spam or not" out. The output is a label — small, cheap, and about something you were given. A <b>generative</b> task runs the other way: the output IS a new data point. Photo out. Face out. The model must know the shape of the whole cloud well enough to place a brand-new point inside it. Here is the one-line test you can apply to any task: <b>is the output a judgment about given data, or is it new data?</b></p>
        <p>So a <b>generative model</b> is a machine with two jobs: absorb a finite set of samples (the dataset), and then produce new samples as if they came from the same rule. Note the "as if": the machine never gets to see $p(x)$ itself. It sees six points and must behave like the rule behind them. Whether that is even possible — and what could make it hard — is exactly the next section.</p>
        <p>One preview, because you have surely seen it in the wild: when you type "a fox in the snow" into an image generator, you are not asking for a sample from the whole cloud — you are steering the draw toward the fox-in-snow region. That is called conditional generation, and it is the subject of part 12. Everything until then is about the unsteered problem, which contains all the hard parts.</p>`
      },
      {
        h: "Why this is hard",
        body: `<p>Three separate walls stand between us and $x_{\\text{new}} \\sim p(x)$. Let's take them one at a time, with numbers.</p>
        <p><b>Wall 1: nobody hands you the rule.</b> The definition of sampling assumes you know the shares. But in the real problem, nobody gives you $p(x)$ — no formula for it exists anywhere. All you get is a finite bag of samples that the rule produced: 60,000 training images, say. It is like being asked to run a lottery identical to one you have never seen the rules of, given only a list of past winning tickets. Everything must be inferred from the samples.</p>
        <p><b>Wall 2: the space is astronomically large.</b> Let's actually count. Suppose each pixel of a $28 \\times 28$ grayscale image can take one of 256 brightness levels (that is the standard 8-bit format). How many distinct images can exist? Count choice by choice:</p>
        <ol>
          <li>One pixel alone: 256 possible images. (One choice, 256 options.)</li>
          <li>Two pixels: for each of the 256 options for pixel one, pixel two independently offers 256 options, so $256 \\times 256 = 65{,}536$. (Independent choices multiply — this is the multiplication principle.)</li>
          <li>All 784 pixels: multiply 256 by itself 784 times, giving $256^{784}$. (The same principle, applied once per pixel.)</li>
        </ol>
        <p>How big is that? Let's convert it to a power of ten so we can read it. Recall from algebra that $\\log_{10}$ of a number is the power you must raise 10 to in order to get that number, and that logarithms turn powers into products: $\\log_{10}(256^{784}) = 784 \\times \\log_{10} 256$. Since $\\log_{10} 256 \\approx 2.408$, we get $784 \\times 2.408 \\approx 1888$. So:</p>
        <div class="formula-box">$$256^{784} \\approx 10^{1888}$$</div>
        <p><b>Read it out loud:</b> the number of possible tiny grayscale images is about 1 followed by 1,888 zeros. For scale: the number of atoms in the observable universe is estimated around $10^{80}$. If every atom in the universe checked one image every second since the Big Bang (about $4 \\times 10^{17}$ seconds), the group would have checked about $10^{98}$ images — a rounding error of a rounding error of $10^{1888}$. And within this incomprehensible haystack, the realistic images are a vanishing sliver. A generative model must place its new point inside that sliver, in a space it could never enumerate.</p>
        <p><b>Wall 3: memorizing is not generating.</b> There is a cheap trick that seems to solve the problem: store the training set, and when asked to "generate", replay a stored image at random. This fails the assignment in the most fundamental way — it can never produce anything new. Its entire repertoire is the dataset: 60,000 points out of $10^{1888}$ possibilities, and not one fresh sample among them, ever. This trick has a name you will meet across all of machine learning: <b>overfitting</b> — matching your training data so closely that you capture its specific points instead of its rule, and therefore fail on (or in our case, fail to produce) anything unseen. What we want is a model that learns the <b>shape</b> of the cloud — "bright-left-dark-right images are common" — and can then place new points in the crowded regions without copying any stored point.</p>
        <p>Put the three walls together and the assignment reads: from a finite bag of samples, learn the shape of a rule you are never shown, over a space too large to enumerate, well enough to produce genuinely new points from its crowded sliver. Stated like that, it sounds close to impossible. The next section gives the one idea this course is about — the idea that makes it possible.</p>`
      },
      {
        h: "The diffusion idea, in words only",
        body: `<p>Watch a drop of ink fall into a glass of still water. It swirls, stretches into threads, the threads feather into wisps, the wisps fade — and after enough time the glass is a uniform pale gray. Every structure the drop had is gone, and here is the remarkable part: <b>every</b> starting drop, whatever its shape, ends in the same featureless gray. Destruction is easy, gradual, and forgets where it started.</p>
        <p>Now imagine the film of that process, and consider running it backwards: gray water un-mixing into a crisp drop of ink. As one giant leap, that is absurd — it is exactly our impossible problem, structure from nothing. But look at the film frame by frame. Between any two consecutive frames, almost nothing happens: the ink pattern in frame 500 and frame 501 are nearly identical, one just a whisker more mixed than the other. Reversing <b>one frame</b> is not absurd at all. It is a small, local correction: "this wisp was slightly sharper a moment ago".</p>
        <p>That is the entire idea of diffusion models, transplanted from ink to images. Four moves:</p>
        <ol>
          <li><b>Destroy gradually, on purpose.</b> Take a clean image $x_0$ and add a tiny dose of random noise to every pixel. Then add another tiny dose to the result, and another, $T$ times in all (think $T = 1000$). Call the ever-noisier versions $x_1, x_2, \\ldots, x_T$. By the end, $x_T$ is pure static — the featureless gray of the ink glass. This direction needs no learning; it is a fixed recipe anyone can run.</li>
          <li><b>Notice that each step is nearly reversible.</b> One tiny dose of noise barely changes the image — $x_{t-1}$ and $x_t$ look almost identical. So "given $x_t$, estimate $x_{t-1}$" is not an absurd request; it is a small correction, of a kind that can be learned from examples. And examples are free: run the destruction recipe on training images and you can manufacture as many (noisier, less-noisy) pairs as you want.</li>
          <li><b>Learn ONLY the tiny undo step.</b> Train one network whose whole job is: given a noisy image and the step number $t$, estimate one step less noisy. Never ask it for the one giant leap from static to image — only ever the whisker-sized correction.</li>
          <li><b>Chain the undos.</b> To generate: draw pure static $x_T$ (that part is easy — it is mere noise), then apply the learned undo step $T$ times: $x_T \\to x_{T-1} \\to \\cdots \\to x_1 \\to x_0$. A thousand tiny reversals add up to one full reversal, and structure condenses out of noise. Because the starting static is random every time, the output is a genuinely new point from the crowded region of the cloud — not a replayed training image.</li>
        </ol>
        <p>Notice how this answers all three walls at once. We never need the rule $p(x)$ handed to us — the network learns local corrections from manufactured pairs (wall 1). We never enumerate the space — each step only nudges one point (wall 2). And we do not memorize — what the network learns is how noise eats structure, knowledge it reuses on starting static it has never seen (wall 3).</p>
        <p>A story is not a proof, and this course does not run on stories. Every load-bearing claim above gets a full derivation at a promised address:</p>
        <ul>
          <li>"The destruction recipe truly ends in pure, structureless noise, and there is a one-line formula for jumping to any noise level" — <b>proven in part 6</b> (with parts 3 and 4 supplying the tools).</li>
          <li>"The exact one-step undo exists, and we can derive its formula when the clean image is known" — <b>derived in part 7</b>, the mathematical heart of the course.</li>
          <li>"Learning the undo step collapses to an almost embarrassingly simple objective: predict the added noise, squared error" — <b>derived in parts 8 and 9</b>, which is the training loss of Stable Diffusion.</li>
        </ul>
        <p>This part's notebook closes with a teaser of move 1: a real digit image drowning in five rising doses of noise, structure visibly dissolving into static. For now we add noise crudely; by part 6 you will control the destruction with exact formulas.</p>`
      },
      {
        h: "Sanity checks",
        body: `<p>The habit this course drills: after every claim, poke it — check a special case, a limit, or a small number you can verify by hand. Here are this part's pokes.</p>
        <ul>
          <li><b>Flattening loses nothing.</b> The 2-by-2 image became the 4-entry vector $(0.9, 0.1, 0.8, 0.0)$; reading the vector back with the same book order rebuilds the exact grid. Dimension check: a $28 \\times 28$ image should give a 784-entry vector, and $28 \\times 28 = 784$. The notebook asserts the round trip on real data.</li>
          <li><b>The counting formula behaves on tiny cases.</b> The formula "levels to the power of pixels" says a 1-pixel, 256-level screen shows $256^1 = 256$ images — matching the obvious count. Two pixels: $256^2 = 65{,}536$, matching the multiplication principle directly. Only then do we trust it at 784 pixels.</li>
          <li><b>Distribution shares pass their two laws.</b> In any counts table (like practice problem 5), every share is a count divided by the total, so none is negative and they sum to exactly 1. If your shares ever fail either law, an error upstream is guaranteed.</li>
          <li><b>"Near means similar" survives measurement.</b> Within a toy cluster, neighbors sit about 0.07 apart; across clusters, about 1.13 — a factor of sixteen. The geometry agrees with the eye.</li>
          <li><b>The noise teaser has the right endpoints.</b> With a noise dose of zero, the "noisy" image is exactly the original (the notebook asserts the measured difference is 0), and the measured spread of the corruption grows with every increase of the dose (asserted, too). Destruction is gradual and monotone — as the ink story requires.</li>
        </ul>`
      },
      {
        h: "What you can do now",
        body: `<p>You can now state, with no hand-waving, the problem this whole course solves. An image is a point in a high-dimensional space — one number per pixel. A dataset is a cloud of such points, and the cloud is evidence for a hidden rule $p(x)$ that says which regions are crowded with realistic data and which are empty static. To generate is to sample: $x_{\\text{new}} \\sim p(x)$, a fresh point from the crowded sliver. You can also argue why this is hard — the rule is never given, the space holds about $10^{1888}$ candidate images, and memorization produces nothing new — and you can tell the diffusion answer as a story with four moves: destroy gradually, notice each step is nearly reversible, learn only the tiny undo, chain the undos from pure static. You even know the addresses where each claim in the story becomes a theorem: parts 6, 7, and 8-9.</p>
        <p>Here is what you cannot do yet, and it is the honest gap this course closes next: every important phrase above — "the cloud's rule", "how likely each region is", "draw a point according to the rule" — is still informal. You cannot compute with a phrase. To derive what a dose of noise does to a distribution, or what the perfect undo step is, we need a precise language for rules of randomness: what a probability is, how likelihoods over several quantities interact, what an average and a spread mean, and how knowledge flips direction. That language is <b>probability</b>, and part 2 builds all of it from a single die roll — assuming, as always, nothing.</p>`
      }
    ],
    symbols: [
      { sym: "$x_0$", desc: "a clean data point — for us, an image flattened into a list of numbers" },
      { sym: "$x$", desc: "any candidate point in data space — a possible image, realistic or not" },
      { sym: "$d$", desc: "the dimension: how many numbers it takes to write down one data point (784 for a 28 by 28 image; 4 for our 2 by 2 toy)" },
      { sym: "$p(x)$", desc: "the data distribution — the cloud's rule: large where realistic data crowds together, near zero in the empty regions (made precise in part 2)" },
      { sym: "$\\sim$", desc: "reads 'is drawn from': the left side is a random sample produced according to the rule on the right" },
      { sym: "$x_{\\text{new}}$", desc: "a freshly generated data point — the thing a generative model must produce" },
      { sym: "$\\mathrm{dist}(a, b)$", desc: "the straight-line (Pythagoras) distance between points $a$ and $b$: small means the images are similar" },
      { sym: "$x_t$", desc: "the data after $t$ small doses of noise — previewed here, owned by part 6" },
      { sym: "$T$", desc: "the total number of noising steps in the diffusion story (think 1000)" },
      { sym: "$\\epsilon$", desc: "fresh random noise — previewed in the notebook teaser, defined precisely in part 3" }
    ],
    recall: [
      "Why is a $28 \\times 28$ grayscale image a point in 784-dimensional space, and what does each coordinate of that point mean?",
      "In the 2-pixel toy dataset, what does each axis of the plot mean, and what does a tight cluster of points tell you about the images in it?",
      "Give this part's informal definition of a probability distribution, and state the two laws its region-shares must obey.",
      "What does the symbol $\\sim$ mean, and what is the one-line statement of the generation problem?",
      "State the one-line test that separates a generative task from a discriminative one, and give one example of each.",
      "Name the three walls that make generation hard, and say where the number $256^{784} \\approx 10^{1888}$ belongs among them.",
      "What is overfitting, in one line — and why is a model that memorizes its training set useless as a generator?",
      "Retell the ink-drop story in four moves, and name the part of this course that proves each of its load-bearing claims."
    ],
    practice: [
      {
        q: "Plausibility in the 2-pixel toy. Our dataset is the six images from the lesson: A=(0.90, 0.10), B=(0.85, 0.15), C=(0.80, 0.10), D=(0.10, 0.90), E=(0.15, 0.85), F=(0.20, 0.90), each written as (left brightness, right brightness). Three new candidates arrive: G=(0.83, 0.12), H=(0.50, 0.50), K=(0.05, 0.95). For each candidate, decide whether it is a plausible new sample from this dataset's cloud, and back the decision with a distance.",
        steps: [
          { do: "Place the six dataset points on the map (left pixel across, right pixel up): A, B, C form a tight cluster in the lower right; D, E, F form a tight cluster in the upper left.", why: "Plotting turns 'similar images' into 'nearby points', which both the eye and the distance formula can judge." },
          { do: "Locate G=(0.83, 0.12) and measure to its nearest dataset points: to B (and, by symmetry, equally to C), $\\mathrm{dist} = \\sqrt{(0.85-0.83)^2 + (0.15-0.12)^2} = \\sqrt{0.0004 + 0.0009} \\approx 0.036$.", why: "The distance to the nearest known point measures how far a candidate sits from anywhere the data has ever been; 0.036 is even closer than typical within-cluster spacing (about 0.07)." },
          { do: "Locate H=(0.50, 0.50) and measure to its nearest dataset points: to B and to E, $\\mathrm{dist} = \\sqrt{(0.35)^2 + (0.35)^2} \\approx 0.49$ each — H sits in the empty middle, roughly seven times farther out than within-cluster spacing.", why: "A candidate whose nearest neighbor is at cluster-gap scale (not neighbor scale) lies in a region where the dataset has essentially no weight." },
          { do: "Locate K=(0.05, 0.95) and measure to its nearest dataset point: to D, $\\mathrm{dist} = \\sqrt{(0.05)^2 + (0.05)^2} \\approx 0.07$ — right at the edge of the upper-left cluster.", why: "A distance matching the within-cluster spacing means K looks like a small variation of an image we have already seen." },
          { do: "Conclude: G plausible (inside cluster A-B-C), K plausible (touching cluster D-E-F), H not plausible (empty middle).", why: "Plausible new samples come from the crowded regions of the cloud, and this cloud's middle is empty — exactly what $p(x)$ being near zero there means." }
        ],
        answer: "G and K are plausible new samples (nearest-neighbor distances about 0.036 and 0.07, at within-cluster scale); H is not (nearest neighbor about 0.49 away, in the empty region between the clusters)."
      },
      {
        q: "Why memorizing fails: a counting argument. A tiny screen shows images of 4 pixels, and each pixel can take one of 8 brightness levels. (a) How many distinct images can this screen show? (b) A model that memorized its 100 training images can 'generate' at most how many distinct images, and what fraction of all possible images is that?",
        steps: [
          { do: "Count choice by choice: pixel 1 has 8 options, and for each of those, pixel 2 independently has 8, giving $8 \\times 8 = 64$ two-pixel images.", why: "Independent choices multiply: every option for one pixel can be paired with every option for the next (the multiplication principle)." },
          { do: "Bring in pixel 3: $64 \\times 8 = 512$ three-pixel images.", why: "The same principle, applied once more — each existing image branches into 8 versions." },
          { do: "Bring in pixel 4: $512 \\times 8 = 4096$, so the screen shows $8^4 = 4096$ distinct images in all.", why: "Multiplying 8 by itself four times is exactly what the power notation $8^4$ means." },
          { do: "A memorizing model can only replay what it stored, so its repertoire is at most its 100 training images.", why: "Memorization produces no new points by definition — its output set is exactly its input set." },
          { do: "Compute the fraction of image space it can ever reach: $100 / 4096 \\approx 0.024$, about 2.4 percent.", why: "Dividing the repertoire by the total counts how much of the space is reachable — and over 97 percent of even this toy space is permanently out of reach." }
        ],
        answer: "(a) $8^4 = 4096$ distinct images. (b) At most 100, which is about 2.4 percent of the possibilities — and for real images the ratio collapses to roughly $6 \\times 10^4$ (the 60,000 training images) out of $10^{1888}$, which is zero for every practical purpose. Memorization does not scale into generation."
      },
      {
        q: "Generative or discriminative? Apply the one-line test — 'is the output a judgment about given data, or new data?' — to each task: (a) deciding whether a photo shows a cat or a dog; (b) producing a brand-new face photo; (c) flagging an email as spam; (d) filling in the missing right half of a torn photo; (e) naming the genre of a song clip; (f) turning the sentence 'a fox in the snow' into a picture.",
        steps: [
          { do: "(a) Photo in, one of two labels out: discriminative.", why: "The output is a judgment about data you were given, not new data." },
          { do: "(b) Nothing but noise or a request in, an entire new image out: generative.", why: "The output is a fresh point that must land in the crowded region of the face cloud." },
          { do: "(c) Email in, spam-or-not out: discriminative.", why: "Again a label about a given data point." },
          { do: "(d) Half an image in, the missing pixels out: generative.", why: "The output is new image content that must look like it came from the photo cloud; being steered by the visible half makes it conditional generation, not discrimination." },
          { do: "(e) Song clip in, genre label out: discriminative.", why: "The output is a category, a judgment." },
          { do: "(f) Sentence in, image out: generative (conditional).", why: "The output is a new data point; the sentence only steers which region of the cloud to sample from — part 12's topic." }
        ],
        answer: "(a), (c), (e) are discriminative; (b), (d), (f) are generative — with (d) and (f) being conditional generation: new data, steered by given information."
      },
      {
        q: "Flatten and unflatten. A 3-row by 3-column image is flattened row by row (book order) into a vector with positions 0 through 8, and rows and columns are also counted from 0. (a) Which vector position holds the pixel at row 1, column 2? (b) Which (row, column) does vector position 7 come from?",
        steps: [
          { do: "Write the flattening rule: the pixel at row $r$, column $c$ lands at position $3r + c$.", why: "Book order stores each full row in 3 consecutive slots, so rows 0 through $r-1$ fill the first $3r$ slots, and then $c$ counts forward inside row $r$." },
          { do: "(a) Substitute $r = 1$, $c = 2$: position $= 3 \\times 1 + 2 = 5$.", why: "Direct use of the rule with the given row and column." },
          { do: "(b) Recover the row from position 7 by asking how many complete 3-slot rows fit before it: $7 \\div 3 = 2$ remainder $1$, so $r = 2$.", why: "Integer division counts the completed rows that precede the position." },
          { do: "The remainder is the column: $c = 1$, so position 7 holds the pixel at row 2, column 1.", why: "Whatever is left after removing whole rows is the offset inside the current row." },
          { do: "Check the round trip: $3 \\times 2 + 1 = 7$, the position we started from.", why: "Feeding the answer back through the forward rule must reproduce the input — the flatten/unflatten pair loses nothing." }
        ],
        answer: "(a) Position 5. (b) Row 2, column 1. In code: pos = 3*row + col, and back again: row = pos // 3, col = pos % 3."
      },
      {
        q: "Reading a distribution from counts. We chop the 2-pixel map into a 4-by-4 grid of cells and count how many of 100 dataset points land in each cell. Rows are ranges of pixel 1 (left brightness), columns are ranges of pixel 2 (right brightness):<table class=\"symbols\"><tr><td><b>pixel 1 range</b></td><td><b>p2: 0&ndash;0.25</b></td><td><b>0.25&ndash;0.5</b></td><td><b>0.5&ndash;0.75</b></td><td><b>0.75&ndash;1</b></td></tr><tr><td>0&ndash;0.25</td><td>1</td><td>0</td><td>2</td><td>46</td></tr><tr><td>0.25&ndash;0.5</td><td>0</td><td>1</td><td>0</td><td>3</td></tr><tr><td>0.5&ndash;0.75</td><td>2</td><td>0</td><td>1</td><td>0</td></tr><tr><td>0.75&ndash;1</td><td>41</td><td>2</td><td>1</td><td>0</td></tr></table>(a) Which cell is most crowded, and what share of the distribution does it hold? (b) What share does the cell containing the point (0.6, 0.6) hold? (c) Do all 16 shares total 1?",
        steps: [
          { do: "Add all 16 counts, row by row: $49 + 4 + 3 + 44 = 100$ points in total.", why: "A share is a count divided by the total, so the total must come first — and it confirms every dataset point was counted exactly once." },
          { do: "(a) Scan for the largest count: 46, in the cell with pixel 1 in 0&ndash;0.25 and pixel 2 in 0.75&ndash;1; its share is $46/100 = 0.46$.", why: "The most crowded cell is where the rule places the most weight — here, dark-left bright-right images, one of our two clusters (the other, 41, is the opposite corner)." },
          { do: "(b) Locate (0.6, 0.6): pixel 1 falls in the 0.5&ndash;0.75 row and pixel 2 in the 0.5&ndash;0.75 column; that cell's count is 1, so its share is $1/100 = 0.01$.", why: "A point's cell is found by checking which range each coordinate falls into; its share is that cell's count over the total." },
          { do: "(c) The 16 shares are the 16 counts each divided by 100, and the counts sum to 100, so the shares sum to $100/100 = 1$.", why: "Every point lands in exactly one cell, so the shares must account for the whole dataset exactly once — the second law of a distribution." },
          { do: "Interpret the table as a miniature $p(x)$: two heavy corner cells (shares 0.46 and 0.41), a nearly weightless middle.", why: "This hand-built table is exactly what a probability distribution is under this part's informal definition: a rule assigning each region its share." }
        ],
        answer: "(a) The (pixel 1 in 0&ndash;0.25, pixel 2 in 0.75&ndash;1) cell, holding share 0.46. (b) 0.01 — the region around (0.6, 0.6) is nearly empty. (c) Yes: the counts total 100, so the shares total exactly 1."
      },
      {
        q: "Tell the story back. Close the lesson and explain the diffusion idea to a friend using the ink-drop story. Your explanation must cover four things: why destruction is easy, why one step is learnable, what exactly gets learned, and how generation works. Then compare with the model answer in the steps.",
        steps: [
          { do: "Run the film forward: a drop of ink in water spreads a little each moment, and after long enough the glass is a uniform pale gray — and every starting drop, whatever its shape, ends in that same featureless state.", why: "The forward story establishes the two properties everything rests on: destruction is gradual, and it forgets the start — no learning is needed to destroy." },
          { do: "Zoom in on the film: any two consecutive frames look almost identical — one is only a whisker more mixed than the other.", why: "This is the observation that makes the reverse direction approachable: nothing dramatic ever happens in a single step, so a single step is a small, local correction." },
          { do: "Say what is learned: not 'gray water to ink drop' in one leap, but only the tiny undo — given the picture at step $t$, estimate the slightly less mixed picture at step $t-1$; training pairs are manufactured for free by running the destruction recipe on real images.", why: "A small local task with unlimited free examples is learnable; the impossible one-leap task is simply never attempted." },
          { do: "Describe generation: start from pure static (the featureless end state, easy to produce), apply the learned undo step $T$ times, and structure condenses back out — a new image, different for every new starting static.", why: "Chaining many tiny reversals adds up to one full reversal, and randomness in the starting static is what makes each output genuinely new rather than replayed." },
          { do: "Add the honesty footnote: 'ends in pure noise', 'the exact undo exists', and 'learning it reduces to predicting the noise' are claims, not yet proofs — part 6 proves the end state, part 7 derives the exact undo, and parts 8-9 reduce learning it to a squared-error loss.", why: "A rigorous course separates story from theorem and says where each theorem lives — that separation is the difference between an analogy and an algorithm." }
        ],
        answer: "Any retelling with the four elements — gradual destruction is easy and forgets the start; single steps are nearly reversible; only the tiny undo step is learned, from manufactured pairs; generation chains T undos starting from fresh static — matches the model answer. The proofs live in parts 6, 7, and 8-9."
      }
    ]
  });
})();
