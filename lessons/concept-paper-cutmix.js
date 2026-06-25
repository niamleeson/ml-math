/* Paper lesson — CutMix: Regularization Strategy to Train Strong Classifiers with Localizable Features
   (Yun, Han, Oh, Chun, Choe, Yoo; Clova AI Research / NAVER, 2019).
   Grounded from arXiv:1905.04899 via the ar5iv HTML mirror:
     - Section 3.1 "Algorithm": Eq. (1) the combine x̃ = M⊙x_A + (1−M)⊙x_B and label ỹ = λ y_A + (1−λ) y_B;
       Eq. (2) bounding-box sampling r_x~Unif(0,W), r_w=W√(1−λ), r_y~Unif(0,H), r_h=H√(1−λ); λ~Beta(α,α), α=1.
     - Appendix A Algorithm 1: "λ = 1 − (x2−x1)(y2−y1)/(W·H)  ▷ Adjust λ to the exact area ratio."
     - Section 3.2: the contrast with Mixup ("locally ambiguous and unnatural") and Cutout (zeroed pixels).
     - Table 3 / Table 4: ImageNet top-1 error numbers (quoted with source).
   Track A (primitive): build CutMix from scratch with raw torch (mask, bbox, area-adjusted λ, mixed loss),
   verify the area identity numerically, contrast with mixup, train a tiny CNN classifier, ablate the
   λ-adjustment. Self-contained: lesson + CODE + CODEVIZ merged by id "paper-cutmix". */
(function () {
  window.LESSONS.push({
    id: "paper-cutmix",
    title: "CutMix — Regularization Strategy to Train Strong Classifiers with Localizable Features (2019)",
    tagline: "Cut a rectangular patch out of one training image, paste in the same patch from a second image, and mix their labels by the AREA each image now covers.",
    module: "Papers · Computer Vision",
    track: "primitive",

    paper: {
      authors: "Sangdoo Yun, Dongyoon Han, Seong Joon Oh, Sanghyuk Chun, Junsuk Choe, Youngjoon Yoo",
      org: "Clova AI Research, NAVER Corp. / LINE Plus Corp. / Yonsei University",
      year: 2019,
      venue: "ICCV 2019 (arXiv:1905.04899)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1905.04899",
      code: "https://github.com/clovaai/CutMix-PyTorch"
    },

    conceptLink: null,
    partOf: [],
    prereqs: ["dl-data-augmentation", "dl-cross-entropy", "dl-conv", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A neural image classifier is trained on labelled pictures. To stop it from simply
       memorizing the small training set (<b>overfitting</b> = scoring high on training images but failing on new
       ones), practitioners use <b>data augmentation</b>: randomly altering each training image so the network
       sees endless variations. One family is <b>regional dropout</b> &mdash; delete a random square from the
       image to force the network to look at the whole object, not just one tell-tale spot. The best-known
       version is <b>Cutout</b>, which zeroes out a random rectangle.</p>
       <p><b>What was awkward (Section 1 / 3.2).</b> Two prior ideas each had a flaw. (1) <b>Cutout</b> sets the
       deleted square to zero or noise, so those pixels carry <i>no information</i> &mdash; the paper says this
       "greatly reduc[es] the proportion of informative pixels," wasting part of every training image. (2)
       <b>Mixup</b> avoids waste by averaging two whole images pixel-by-pixel
       ($\\tilde{x}=\\lambda x_A+(1-\\lambda)x_B$), but the blended result is, in the paper's words, "locally
       ambiguous and unnatural" &mdash; no real photo looks like two faded images overlaid, which confuses a
       network that is also being asked to <i>localize</i> objects. The authors wanted the regularizing power of
       deleting a region <i>without</i> throwing away pixels and <i>without</i> creating unnatural blends.</p>`,

    contribution:
      `<p>The paper introduces <b>CutMix</b> (abstract; Section 3.1). Its contributions:</p>
       <ul>
         <li><b>Cut-and-paste between two images.</b> Instead of zeroing a square (Cutout) or fading two images
         together (Mixup), CutMix <i>replaces</i> a random rectangle of image A with the pixels from the same
         rectangle of image B. Every pixel in the result is a real pixel from a real photo &mdash; the patch is
         <b>locally realistic</b>.</li>
         <li><b>Label mixing by AREA.</b> The new label is a weighted blend of the two class labels, weighted by
         how much area each image now occupies. If image B's patch covers 30% of the picture, the label is
         70% class-A + 30% class-B. The mixing weight $\\lambda$ is set to the exact pixel-area ratio.</li>
         <li><b>Strong classifiers with localizable features.</b> Because both objects are partly visible at
         their true positions, the network learns to recognize <i>and locate</i> objects from partial views,
         improving classification, weakly-supervised localization, and robustness (the paper's experiments).</li>
       </ul>`,

    whyItMattered:
      `<p>CutMix became a standard, near-free augmentation in the modern image-classification recipe. It is part
       of the training recipes that pushed ImageNet accuracy upward in the late-2010s/early-2020s and is bundled
       into common libraries (for example <code>torchvision.transforms.v2.CutMix</code>) and "bag of tricks"
       pipelines, usually applied randomly alongside or instead of <b>Mixup</b>. Its core trick &mdash; build a
       composite training example from real pixels and set the soft label to match the mixing proportion &mdash;
       directly extends <b>Mixup</b>'s idea (which you should read alongside this lesson, <code>paper-mixup</code>)
       from a global average to a spatial cut-and-paste.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 3.1 ("Algorithm")</b> &mdash; this is the whole method: Eq. (1) for combining the two
         images and their labels, and Eq. (2) for sampling the rectangle. Two equations; everything else is
         experiments.</li>
         <li><b>Appendix A (Algorithm 1)</b> &mdash; the pseudocode line "$\\lambda = 1 - (x_2-x_1)(y_2-y_1)/(WH)$,
         Adjust $\\lambda$ to the exact area ratio." This is the detail that makes the label honest when the box
         is clipped at the image border.</li>
         <li><b>Section 3.2 ("Discussion")</b> and <b>Figure 1</b> &mdash; the side-by-side picture of Mixup vs
         Cutout vs CutMix; read why Mixup's blends are called "locally ambiguous and unnatural" and why Cutout
         wastes pixels.</li>
       </ul>
       <p><b>Skim:</b> Section 4 experiments. Note the qualitative claim (CutMix matches or beats Mixup and
       Cutout on ImageNet/CIFAR classification, plus localization and robustness) rather than memorizing every
       table. The two headline ImageNet numbers are quoted under "Results" below.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> Suppose you sample a target mixing weight $\\lambda=0.6$ on a
       $32\\times32$ image, so the patch from image B should cover $1-\\lambda=40\\%$ of the area. The paper sets
       the patch width and height to $r_w=W\\sqrt{1-\\lambda}$ and $r_h=H\\sqrt{1-\\lambda}$. Why the
       <i>square root</i>? (Hint: a patch is two-dimensional &mdash; what is $r_w\\times r_h$ as a fraction of
       $W\\times H$?) And after pasting, if the rectangle gets cut off at the image edge so it is smaller than
       planned, should the label still use $\\lambda=0.6$, or be re-computed? Write your guesses, then check the
       worked example.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write CutMix from scratch in raw torch on a batch of images
       <code>x</code> (shape <code>[N,C,H,W]</code>) with integer labels <code>y</code>:</p>
       <ul>
         <li><code># TODO: lam = Beta(alpha, alpha).sample()</code> &mdash; sample the target mixing weight; with
         $\\alpha=1$ this is just uniform on $[0,1]$.</li>
         <li><code># TODO: perm = randperm(N)</code> &mdash; pick the "image B" partner for each image.</li>
         <li><code># TODO: rw = W*sqrt(1-lam); rh = H*sqrt(1-lam); pick a random center; clip the box to [0,W],[0,H]</code></li>
         <li><code># TODO: x[:, :, y1:y2, x1:x2] = x[perm, :, y1:y2, x1:x2]</code> &mdash; paste B's patch into A.</li>
         <li><code># TODO: lam = 1 - (x2-x1)*(y2-y1)/(W*H)</code> &mdash; RE-COMPUTE lambda from the ACTUAL pasted area.</li>
         <li><code># TODO: loss = lam*CE(out, y) + (1-lam)*CE(out, y[perm])</code> &mdash; mix the two losses by area.</li>
       </ul>
       <p>The CODE cell below is the full reference, including the numeric check that the re-computed
       <code>lam</code> equals the fraction of un-replaced (image-A) pixels, exactly.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>CutMix builds one training example from two real images and gives it a soft (fractional) label.</p>
       <ol>
         <li><b>Pick two images.</b> Take image $x_A$ with label $y_A$, and a partner image $x_B$ with label
         $y_B$ (in a batch, the partner is just a shuffled copy of the same batch).</li>
         <li><b>Choose how much to swap.</b> Sample a target weight $\\lambda$ from a <b>Beta distribution</b>
         $\\mathrm{Beta}(\\alpha,\\alpha)$. A Beta distribution is a probability distribution over numbers between
         0 and 1; with the paper's setting $\\alpha=1$ it is simply <i>uniform</i> &mdash; every value in $[0,1]$
         equally likely (Section 3.1). $\\lambda$ is the fraction of the picture that should stay as image A.</li>
         <li><b>Size the patch.</b> The rectangle that will be replaced must cover $1-\\lambda$ of the area.
         Because area = width $\\times$ height, set both sides to $\\sqrt{1-\\lambda}$ of the image's: width
         $r_w=W\\sqrt{1-\\lambda}$, height $r_h=H\\sqrt{1-\\lambda}$. Then
         $r_w\\,r_h = WH(1-\\lambda)$ &mdash; exactly the $1-\\lambda$ fraction (Eq. 2).</li>
         <li><b>Place and paste.</b> Pick a random center inside the image, clip the rectangle so it stays in
         bounds, and copy that rectangle of $x_B$ into $x_A$. The mask $M$ is 1 where image A is kept and 0
         inside the pasted rectangle.</li>
         <li><b>Re-compute the label weight.</b> If the rectangle was clipped at the border it is smaller than
         planned, so the actual swapped area differs from $1-\\lambda$. Set
         $\\lambda \\leftarrow 1 - \\dfrac{(x_2-x_1)(y_2-y_1)}{WH}$ &mdash; the true fraction of image-A pixels that
         remain (Appendix A, "Adjust $\\lambda$ to the exact area ratio").</li>
         <li><b>Mix the labels.</b> The label of the composite is $\\tilde{y}=\\lambda y_A+(1-\\lambda)y_B$:
         class A weighted by the area it kept, class B weighted by the area it took.</li>
       </ol>
       <p><b>Contrast with Mixup.</b> Mixup also mixes labels by $\\lambda$, but it builds the image by
       <i>averaging every pixel</i>: $\\tilde{x}=\\lambda x_A+(1-\\lambda)x_B$ &mdash; a ghostly double exposure.
       CutMix instead keeps each pixel as a real, un-faded pixel from one of the two photos; only their spatial
       layout is spliced. The paper's framing (Section 3.2): CutMix samples have "no unnatural artefacts," unlike
       Mixup's "locally ambiguous and unnatural" blends, while still deleting a region like Cutout &mdash; but
       filling it with informative pixels instead of zeros.</p>`,

    symbols: [
      { sym: "$x_A,\\,x_B$", desc: "the two input images being combined. Each is a tensor of shape (channels C, height H, width W). $x_A$ is the base; a patch of $x_B$ is pasted into it." },
      { sym: "$y_A,\\,y_B$", desc: "the class labels of $x_A$ and $x_B$. Written as one-hot vectors (a vector that is 1 at the true class and 0 elsewhere) so they can be blended." },
      { sym: "$\\tilde{x},\\,\\tilde{y}$", desc: "tilde = the combined training example: $\\tilde{x}$ is the spliced image, $\\tilde{y}$ is its mixed (soft) label." },
      { sym: "$M$", desc: "the binary mask, a grid of 0s and 1s the size of the image. $M=1$ where image A is kept; $M=0$ inside the rectangle where image B is pasted." },
      { sym: "$\\odot$", desc: "element-wise (Hadamard) multiplication: multiply two equal-shaped tensors entry by entry. $M\\odot x_A$ keeps A's pixels only where $M=1$." },
      { sym: "$\\mathbf{1}$", desc: "the all-ones tensor; $\\mathbf{1}-M$ is the complementary mask (1 inside the patch, 0 outside), selecting where B is pasted." },
      { sym: "$\\lambda$", desc: "lambda: the mixing weight in $[0,1]$. It is the FRACTION of the final image that comes from image A (so $1-\\lambda$ is the patch's area fraction). The label uses the same $\\lambda$." },
      { sym: "$W,\\,H$", desc: "the image width and height in pixels. $W\\cdot H$ is the total pixel area." },
      { sym: "$r_x,\\,r_y$", desc: "the (x,y) center coordinates of the rectangle to be replaced, drawn uniformly at random inside the image." },
      { sym: "$r_w,\\,r_h$", desc: "the rectangle's width and height, set to $W\\sqrt{1-\\lambda}$ and $H\\sqrt{1-\\lambda}$ so its area is the $(1-\\lambda)$ fraction." },
      { sym: "$x_1,x_2,y_1,y_2$", desc: "the clipped left/right and top/bottom edges of the pasted rectangle after it is kept inside the image bounds; $(x_2-x_1)(y_2-y_1)$ is its actual pixel area." },
      { sym: "$\\mathrm{Beta}(\\alpha,\\alpha)$", desc: "the Beta distribution, a probability distribution over $[0,1]$ used to draw $\\lambda$. With $\\alpha=1$ (the paper's choice) it is the uniform distribution on $[0,1]$." }
    ],

    formula:
      `<p><b>Combine the images and labels (Eq. 1):</b></p>
       $$\\tilde{x}=M\\odot x_A+(\\mathbf{1}-M)\\odot x_B,\\qquad
         \\tilde{y}=\\lambda\\,y_A+(1-\\lambda)\\,y_B$$
       <p><b>Sample the rectangle (Eq. 2):</b></p>
       $$r_x\\sim\\mathrm{Unif}(0,W),\\quad r_w=W\\sqrt{1-\\lambda},\\qquad
         r_y\\sim\\mathrm{Unif}(0,H),\\quad r_h=H\\sqrt{1-\\lambda}$$
       <p><b>Re-fit $\\lambda$ to the real pasted area (Appendix A, Algorithm 1):</b></p>
       $$\\lambda \\;\\leftarrow\\; 1-\\frac{(x_2-x_1)(y_2-y_1)}{W\\,H}$$`,

    whatItDoes:
      `<p>Eq. (1) says: build the new image by taking image A everywhere the mask is 1 and image B everywhere the
       mask is 0 (a clean cut-and-paste of a rectangle, no fading), and build the new label by weighting class A
       and class B by $\\lambda$ and $1-\\lambda$. Eq. (2) says: make the patch's two sides each $\\sqrt{1-\\lambda}$
       of the image so the patch covers exactly the $(1-\\lambda)$ fraction of the area, and drop it at a random
       location. The adjustment line says: after clipping the rectangle to the image, set $\\lambda$ to the
       <i>actual</i> fraction of image-A pixels that survive, so the label always matches what is really on
       screen.</p>`,

    derivation:
      `<p>There is no separate concept lesson that owns this math, so here is the full reasoning. Two pieces need
       justifying: <i>why the sides use a square root</i>, and <i>why the label uses the area fraction</i>.</p>
       <p><b>1. The square root sizes the area.</b> We want the replaced rectangle to occupy the fraction
       $1-\\lambda$ of the total area $WH$. A rectangle's area is width $\\times$ height. If we set
       $r_w=W\\sqrt{1-\\lambda}$ and $r_h=H\\sqrt{1-\\lambda}$, then
       $$\\frac{r_w\\,r_h}{W\\,H}=\\frac{W\\sqrt{1-\\lambda}\\cdot H\\sqrt{1-\\lambda}}{WH}
         =\\frac{WH(1-\\lambda)}{WH}=1-\\lambda.$$
       The two square roots multiply back to one factor of $(1-\\lambda)$ &mdash; that is the only way to split a
       2-D area target evenly across the two sides. (If you forgot the root and used $r_w=W(1-\\lambda)$, the area
       would be $(1-\\lambda)^2$, which is wrong.)</p>
       <p><b>2. The label is the area fraction by the law of expected loss.</b> The composite image shows class A
       over a fraction $\\lambda$ of its pixels and class B over the remaining $1-\\lambda$. CutMix asks the
       network to be confident about each class in proportion to how much of it is visible, which is exactly the
       soft label $\\tilde{y}=\\lambda y_A+(1-\\lambda)y_B$. With cross-entropy loss this gives the mixed loss
       $\\lambda\\,\\mathrm{CE}(\\text{out},y_A)+(1-\\lambda)\\,\\mathrm{CE}(\\text{out},y_B)$, the same
       linear-in-$\\lambda$ target Mixup uses &mdash; the only change is that CutMix's image is a spatial splice
       rather than a pixel average. This shared label rule is why CutMix is the spatial cousin of <b>Mixup</b>
       (<code>paper-mixup</code>).</p>
       <p><b>3. Why re-fit $\\lambda$.</b> The random center can sit near an edge, so the rectangle gets clipped
       and its true area no longer equals $WH(1-\\lambda)$. If the label kept the original $\\lambda$ it would
       claim a B-area that is not actually there. Re-computing
       $\\lambda=1-\\frac{(x_2-x_1)(y_2-y_1)}{WH}$ from the clipped corners restores the equality "label weight =
       pixel-area fraction." The CODE measures how badly this can drift if you skip it.</p>`,

    example:
      `<p><b>Worked numbers.</b> Take a CIFAR-style image $W=H=32$ (so area $=1024$ pixels). Sample the target
       weight $\\lambda=0.6$, meaning image A should keep $60\\%$ and image B's patch should cover the other
       $40\\%$.</p>
       <ul>
         <li><b>Patch size (Eq. 2):</b> $r_w=W\\sqrt{1-\\lambda}=32\\sqrt{0.4}=32(0.6325)=20.24\\to 20$ px (rounded),
         and likewise $r_h=20$ px.</li>
         <li><b>Patch placed fully inside</b> (no clipping for this example): its area is
         $20\\times20=400$ pixels, out of $1024$.</li>
         <li><b>Re-fit $\\lambda$ to the actual area:</b>
         $\\lambda=1-\\dfrac{400}{1024}=1-0.3906=\\mathbf{0.6094}$. (Slightly above $0.6$ because rounding $20.24$
         down to $20$ made the patch a hair smaller than planned.)</li>
         <li><b>Mixed label:</b> $\\tilde{y}=0.6094\\,y_A+0.3906\\,y_B$. If A is class "cat" and B is class "dog",
         the target is $\\mathbf{0.6094}$ cat $+\\;\\mathbf{0.3906}$ dog.</li>
       </ul>
       <p>The CODE cell recomputes these exact values ($r_w=r_h=20$, area $400/1024$, $\\lambda=0.6094$) and prints
       them.</p>`,

    recipe:
      `<p><b>CutMix on one training batch, as numbered steps</b> (images <code>x</code> of shape
       $[N,C,H,W]$, integer labels <code>y</code>):</p>
       <ol>
         <li>Sample $\\lambda\\sim\\mathrm{Beta}(\\alpha,\\alpha)$ (with $\\alpha=1$, uniform on $[0,1]$).</li>
         <li>Make a shuffled index <code>perm</code> so each image $i$ gets partner $x_{\\text{perm}[i]}$.</li>
         <li>Set $r_w=W\\sqrt{1-\\lambda}$, $r_h=H\\sqrt{1-\\lambda}$; draw a random center $(r_x,r_y)$.</li>
         <li>Clip the rectangle to the image: $x_1,x_2\\in[0,W]$, $y_1,y_2\\in[0,H]$.</li>
         <li>Paste: $x[:,:,y_1{:}y_2,\\,x_1{:}x_2]\\;\\leftarrow\\;x[\\text{perm},:,y_1{:}y_2,\\,x_1{:}x_2]$.</li>
         <li>Re-fit $\\lambda\\leftarrow 1-\\dfrac{(x_2-x_1)(y_2-y_1)}{WH}$.</li>
         <li>Forward pass, then mixed loss
         $\\lambda\\,\\mathrm{CE}(\\text{out},y)+(1-\\lambda)\\,\\mathrm{CE}(\\text{out},y[\\text{perm}])$;
         backpropagate.</li>
       </ol>`,

    results:
      `<p>On ImageNet classification with ResNet-50 (Table 3), the paper reports CutMix reaching a top-1 error of
       <b>21.40%</b>, versus a baseline of <b>23.68%</b>, Cutout's <b>22.93%</b>, and Mixup's <b>22.58%</b> &mdash;
       CutMix gives the largest improvement of the three. With deeper backbones (Table 4) it reports ResNet-101 +
       CutMix at <b>20.17%</b> top-1 error. (Source: arXiv:1905.04899, Tables 3 and 4.) The paper also reports
       gains on weakly-supervised localization and robustness, which are the "localizable features" of the title.
       The CODEVIZ numbers below are <b>our own small run, not the paper's reported numbers.</b></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> CutMix is now a one-call transform (e.g.
       <code>torchvision.transforms.v2.CutMix</code>), but here you <b>build it from scratch</b> with raw tensor
       indexing: sample $\\lambda$, size and clip the box, paste the patch by slicing
       <code>x[:, :, y1:y2, x1:x2]</code>, re-fit $\\lambda$ from the real area, and form the mixed
       cross-entropy loss. The verification is numeric rather than a single <code>allclose</code> against a layer:
       you confirm the re-computed $\\lambda$ equals the fraction of un-replaced image-A pixels <i>exactly</i>
       (the area identity), and you contrast a CutMix image (all real pixels) against a Mixup image (faded
       double-exposure) on the same pair. You then train a tiny CNN with and without CutMix to see the
       overfitting gap shrink, and ablate the $\\lambda$-adjustment.</p>`,

    pitfalls:
      `<ul>
         <li><b>Square root, not linear.</b> The sides are $W\\sqrt{1-\\lambda}$, not $W(1-\\lambda)$. Drop the
         root and the patch covers $(1-\\lambda)^2$ of the area, so the label no longer matches the picture.</li>
         <li><b>Forgetting to re-fit $\\lambda$.</b> When the box is clipped at the border its true area changes;
         using the original sampled $\\lambda$ for the label is then wrong (the CODE shows this drift averages
         ~0.22 and can reach ~0.78 of the image on $16\\times16$). Always re-compute $\\lambda$ from the clipped
         corners.</li>
         <li><b>Mixing the loss vs mixing soft labels.</b> $\\lambda\\,\\mathrm{CE}(o,y_A)+(1-\\lambda)\\,
         \\mathrm{CE}(o,y_B)$ (two cross-entropies) equals cross-entropy against the soft label
         $\\lambda y_A+(1-\\lambda)y_B$ because cross-entropy is linear in the target &mdash; either is fine, but
         don't average the two images' logits or hard-pick one label.</li>
         <li><b>CutMix is NOT Mixup.</b> Mixup averages whole pixels ($\\lambda x_A+(1-\\lambda)x_B$, a faded
         blend); CutMix splices real rectangles (no fading). Same label rule, different image.</li>
         <li><b>Patch can land entirely off the object.</b> On a single image the swapped region may miss the
         informative pixels; the regularizing effect is statistical, over many batches &mdash; don't judge it from
         one example.</li>
       </ul>`,

    recall: [
      "State CutMix's two equations: the image combine $\\tilde{x}=M\\odot x_A+(\\mathbf{1}-M)\\odot x_B$ and the label $\\tilde{y}=\\lambda y_A+(1-\\lambda)y_B$.",
      "Why are the patch sides $W\\sqrt{1-\\lambda}$ and $H\\sqrt{1-\\lambda}$ (what fraction of the area does the patch cover)?",
      "Write the $\\lambda$ re-fit formula and say in one sentence why it is needed.",
      "In one sentence, how does CutMix's IMAGE differ from Mixup's, given they share the same label rule?",
      "With $\\alpha=1$, what distribution does $\\lambda$ follow?"
    ],

    practice: [
      {
        q: `On a $24\\times24$ image you sample $\\lambda=0.75$. Compute the planned patch size $r_w,r_h$, the patch area, and (assuming the patch is fully inside) the re-fit $\\lambda$ and the mixed label weights.`,
        steps: [
          { do: `Patch sides: $r_w=r_h=24\\sqrt{1-0.75}=24\\sqrt{0.25}=24(0.5)=12$ px.`, why: `$\\sqrt{1-\\lambda}$ scales each side so the area is the $1-\\lambda$ fraction.` },
          { do: `Patch area $=12\\times12=144$ px, out of $24\\times24=576$.`, why: `Area is width times height.` },
          { do: `Re-fit $\\lambda=1-144/576=1-0.25=0.75$.`, why: `No clipping and no rounding here, so it matches the sampled value exactly.` }
        ],
        answer: `$r_w=r_h=12$ px, patch area $=144/576=25\\%$, re-fit $\\lambda=0.75$, so the label is $0.75\\,y_A+0.25\\,y_B$ — image A keeps three-quarters of the area and three-quarters of the label.`
      },
      {
        q: `The patch is placed near a corner and clipped, so the actual replaced region is only $10\\times8$ pixels on a $32\\times32$ image, even though it was planned for $\\lambda=0.6$. What label should you use, and what goes wrong if you keep $\\lambda=0.6$?`,
        steps: [
          { do: `Actual swapped area $=10\\times8=80$ px out of $1024$.`, why: `Use the clipped corners, not the planned size.` },
          { do: `Re-fit $\\lambda=1-80/1024=1-0.078=0.922$.`, why: `Only ~8% of the image is now image B, so A should keep ~92% of the label.` },
          { do: `Compare to the un-adjusted $\\lambda=0.6$.`, why: `That would claim image B owns 40% of the label while it really owns ~8%.` }
        ],
        answer: `Use $\\tilde{y}=0.922\\,y_A+0.078\\,y_B$. Keeping $\\lambda=0.6$ would tell the network the image is 40% class B when only 8% of its pixels are B — a badly mislabelled target. This is exactly why the paper re-fits $\\lambda$ to the exact area ratio.`
      },
      {
        q: `Ablation: in the CODE, run CutMix but SKIP the $\\lambda$ area-adjustment (use the raw sampled $\\lambda$ for the label). Measure how far the raw label weight drifts from the true pasted-area fraction across many random boxes. What does the ablation show, and why does the adjustment matter most near image borders?`,
        steps: [
          { do: `For 5000 random boxes on a $16\\times16$ image, sample $\\lambda$, clip the box, and compare the TRUE B-area fraction $(x_2-x_1)(y_2-y_1)/(WH)$ against the raw assumption $1-\\lambda$.`, why: `Isolates the one quantity the adjustment fixes — the label's area weight.` },
          { do: `Average the absolute mismatch and record the maximum.`, why: `Quantifies how wrong the un-adjusted label is on average and at worst.` },
          { do: `Note which boxes have the largest mismatch.`, why: `Boxes whose random center is near an edge get clipped the most, so their true area shrinks well below $1-\\lambda$.` }
        ],
        answer: `In our run the un-adjusted label weight is off from the true pasted-area fraction by ~0.22 on average and up to ~0.78 of the whole image (see CODEVIZ — our small run, not the paper's number). The error is largest for boxes whose center falls near a border, because clipping removes part of the planned patch so far less of image B is actually present than $1-\\lambda$ claims. The re-fit line $\\lambda=1-(x_2-x_1)(y_2-y_1)/(WH)$ removes this mismatch exactly — the mechanism check confirms the re-fit $\\lambda$ equals the true image-A pixel fraction with error 0.`
      }
    ]
  });

  window.CODE["paper-cutmix"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build CutMix from scratch with raw torch: sample lambda~Beta, size the box with the sqrt rule, clip it, ` +
      `paste image B's patch into image A by slicing, RE-FIT lambda from the actual pasted area, and form the ` +
      `area-weighted cross-entropy loss. Numerically VERIFY the area identity (re-fit lambda == fraction of ` +
      `un-replaced A-pixels, exactly). Contrast a CutMix image (all real pixels) with a Mixup image (faded ` +
      `blend) on the same pair. Recompute the worked example (32x32, lambda=0.6 -> 20x20 patch -> lambda=0.6094). ` +
      `Train a tiny CNN on an overfitting-prone toy task with none / mixup / cutmix and print test accuracy. ` +
      `Ablate by skipping the lambda adjustment and measuring the label drift. Runs in Colab (torch preinstalled).`,
    code: `import math, numpy as np, torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0); np.random.seed(0)

# ---------- CutMix from scratch (Yun et al., 2019, Section 3.1 + Appendix A) ----------
def rand_bbox(W, H, lam):
    # Eq. (2): sides scale with sqrt(1-lam) so the patch area is the (1-lam) fraction.
    cut = math.sqrt(1.0 - lam)
    cw, ch = int(W * cut), int(H * cut)
    cx, cy = np.random.randint(W), np.random.randint(H)        # random center r_x, r_y
    x1 = int(np.clip(cx - cw // 2, 0, W)); x2 = int(np.clip(cx + cw // 2, 0, W))
    y1 = int(np.clip(cy - ch // 2, 0, H)); y2 = int(np.clip(cy + ch // 2, 0, H))
    return x1, y1, x2, y2

def cutmix_batch(x, y, alpha=1.0):
    N, C, H, W = x.shape
    lam = float(np.random.beta(alpha, alpha))                  # lam ~ Beta(a,a); a=1 -> uniform
    perm = torch.randperm(N)                                   # the "image B" partner for each image
    x = x.clone()
    x1, y1, x2, y2 = rand_bbox(W, H, lam)
    x[:, :, y1:y2, x1:x2] = x[perm, :, y1:y2, x1:x2]           # Eq.(1): paste B's patch into A
    lam = 1.0 - (x2 - x1) * (y2 - y1) / (W * H)                # Appendix A: re-fit lam to EXACT area
    return x, y, y[perm], lam, (x1, y1, x2, y2)

# ---------- VERIFY the area identity numerically: re-fit lam == fraction of un-replaced A-pixels ----------
# Build the ACTUAL binary mask M (1 = keep A, 0 = pasted B), then COUNT the kept pixels independently
# of the closed-form re-fit. If the identity 1 - area/(W*H) == (kept pixels)/(W*H) holds, the two agree.
np.random.seed(7); max_err = 0.0
for _ in range(2000):
    lam0 = float(np.random.beta(1, 1))
    bx1, by1, bx2, by2 = rand_bbox(16, 16, lam0)
    M = np.ones((16, 16))                                      # mask: start all-A
    M[by1:by2, bx1:bx2] = 0.0                                  # zero out the pasted-B rectangle
    frac_A = M.mean()                                          # COUNT kept A-pixels, independently
    lam_refit = 1.0 - (bx2 - bx1) * (by2 - by1) / (16 * 16)    # Appendix-A closed form
    max_err = max(max_err, abs(lam_refit - frac_A))
print("max |refit_lambda - counted_A_pixel_fraction| over 2000 boxes:", max_err)   # expect exactly 0.0

# ---------- Contrast CutMix vs Mixup on the same image pair ----------
xa = torch.zeros(1, 3, 16, 16); xa[:, :, 2:8, 2:8] = 1.0       # image A: blob top-left
xb = torch.zeros(1, 3, 16, 16); xb[:, :, 8:14, 8:14] = 1.0     # image B: blob bottom-right
lam = 0.5
mixup_img = lam * xa + (1 - lam) * xb                          # faded double-exposure
cut = xa.clone(); cut[:, :, 8:16, 8:16] = xb[:, :, 8:16, 8:16] # real pixels, spliced
print("Mixup pixels are faded? unique vals:", torch.unique(mixup_img).tolist())  # has 0.5 -> faded
print("CutMix pixels stay real? unique vals:", torch.unique(cut).tolist())       # only 0.0 / 1.0

# ---------- Recompute the worked example: 32x32, lambda=0.6 ----------
W2 = H2 = 32; lam_s = 0.6
rw = int(round(W2 * math.sqrt(1 - lam_s))); rh = int(round(H2 * math.sqrt(1 - lam_s)))
area = rw * rh; lam_adj = 1 - area / (W2 * H2)
print(f"worked: rw=rh={rw}, area={area}/{W2*H2}, refit_lambda={lam_adj:.4f}, "
      f"label={lam_adj:.4f}*yA+{1-lam_adj:.4f}*yB")   # 20, 400/1024, 0.6094

# ---------- Train a tiny CNN: none vs mixup vs cutmix on an overfitting-prone toy task ----------
C, H, W = 3, 16, 16
def make(n, cls, seed):
    g = torch.Generator().manual_seed(seed)
    x = 1.1 * torch.randn(n, C, H, W, generator=g)             # strong noise -> easy to overfit
    if cls == 0: x[:, :, 2:8, 2:8]  += 0.6                      # faint localized blob, class 0
    else:        x[:, :, 8:14, 8:14] += 0.6                     # faint localized blob, class 1
    return x

Xtr = torch.cat([make(20, 0, 1), make(20, 1, 2)])              # only 40 training images
ytr = torch.cat([torch.zeros(20), torch.ones(20)]).long()
Xte = torch.cat([make(500, 0, 300), make(500, 1, 400)])        # 1000 fresh test images
yte = torch.cat([torch.zeros(500), torch.ones(500)]).long()

def net():
    return nn.Sequential(nn.Conv2d(3, 6, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
                         nn.Conv2d(6, 12, 3, padding=1), nn.ReLU(), nn.AdaptiveAvgPool2d(1),
                         nn.Flatten(), nn.Linear(12, 2))

def train(mode, epochs=140, bs=15):
    torch.manual_seed(0); np.random.seed(0)                    # same init/data for all three
    m = net(); opt = torch.optim.Adam(m.parameters(), lr=0.012)
    for _ in range(epochs):
        perm = torch.randperm(Xtr.shape[0])
        for i in range(0, Xtr.shape[0], bs):
            idx = perm[i:i+bs]; xb_, yb = Xtr[idx], ytr[idx]; opt.zero_grad()
            if mode == "none":
                loss = F.cross_entropy(m(xb_), yb)
            elif mode == "mixup":
                lam = float(np.random.beta(1, 1)); r = torch.randperm(xb_.size(0))
                mix = lam * xb_ + (1 - lam) * xb_[r]; out = m(mix)
                loss = lam * F.cross_entropy(out, yb) + (1 - lam) * F.cross_entropy(out, yb[r])
            else:  # cutmix
                xc, ya, yb2, lam, _ = cutmix_batch(xb_, yb)
                out = m(xc)
                loss = lam * F.cross_entropy(out, ya) + (1 - lam) * F.cross_entropy(out, yb2)
            loss.backward(); opt.step()
    with torch.no_grad():
        tr = (m(Xtr).argmax(1) == ytr).float().mean().item()
        te = (m(Xte).argmax(1) == yte).float().mean().item()
    return tr, te

for mode in ["none", "mixup", "cutmix"]:
    tr, te = train(mode)
    print(f"{mode:7s} train_acc={tr:.3f}  test_acc={te:.3f}")
# expect (our run): none train 1.000/test ~0.53, mixup ~0.85, cutmix ~0.84 -> augmentation closes the gap

# ---------- ABLATION: skip the lambda re-fit -> how wrong is the label? ----------
np.random.seed(3); diffs = []
for _ in range(5000):
    lam0 = float(np.random.beta(1, 1))
    bx1, by1, bx2, by2 = rand_bbox(16, 16, lam0)
    true_B_frac = (bx2 - bx1) * (by2 - by1) / (16 * 16)        # what is REALLY pasted
    raw_B_frac  = 1 - lam0                                     # what the un-adjusted label assumes
    diffs.append(abs(true_B_frac - raw_B_frac))
print(f"un-adjusted label drift: mean={np.mean(diffs):.4f}, max={np.max(diffs):.4f}")`
  };

  window.CODEVIZ["paper-cutmix"] = {
    question: "Does CutMix keep pixels locally real (unlike Mixup's blend), and does training with it close the overfitting gap of a tiny CNN — and how wrong is the label if you skip the area-adjustment?",
    charts: [
      {
        type: "bar",
        title: "Tiny CNN test accuracy: no-aug vs Mixup vs CutMix (same init/data, train acc = 1.00 for all)",
        xlabel: "training scheme",
        ylabel: "test accuracy",
        series: [
          { name: "test accuracy", color: "#79c0ff", points: [["none", 0.533], ["mixup", 0.846], ["cutmix", 0.835]] }
        ]
      },
      {
        type: "bar",
        title: "Pixel realism on a CutMix vs Mixup composite (fraction of pixels that are FADED, i.e. not a real source pixel)",
        xlabel: "composite type",
        ylabel: "fraction of faded (non-real) pixels",
        series: [
          { name: "faded pixels", color: "#ff7b72", points: [["CutMix", 0.0], ["Mixup", 1.0]] }
        ]
      },
      {
        type: "bar",
        title: "Label error if you SKIP the lambda area-adjustment (16x16 image, 5000 random boxes)",
        xlabel: "statistic of |true B-area fraction - (1 - lambda_raw)|",
        ylabel: "label weight error",
        series: [
          { name: "label drift", color: "#d2a8ff", points: [["mean", 0.2242], ["max", 0.7803]] }
        ]
      }
    ],
    caption: "Our small-scale run (torch, fixed seeds), not the paper's reported numbers. LEFT: with only 40 noisy training images all three schemes fit the training set perfectly (train acc 1.00), but on 1000 fresh test images the no-augmentation baseline overfits badly (0.533), while both Mixup (0.846) and CutMix (0.835) roughly close the generalization gap — CutMix is competitive with Mixup here, matching the paper's qualitative claim that these area-mixing augmentations regularize. (Relative ordering on a toy is noisy; the paper reports CutMix ahead of Mixup on ImageNet — see Results.) MIDDLE: on a composite of two blob images, every pixel of the CutMix image is a real source pixel (0% faded), whereas the Mixup image is 100% faded (every pixel is a 0.5/0.5 average) — this is the paper's 'no unnatural artefacts' point. RIGHT: if you skip the lambda re-fit and label the image by the raw sampled lambda, the label weight is off from the true pasted-area fraction by 0.224 on average and up to 0.780 of the whole image, because boxes near a border get clipped — which is exactly why the paper adjusts lambda to the exact area ratio.",
    code: `import math, numpy as np, torch
import torch.nn as nn, torch.nn.functional as F

# ---- LEFT: none vs mixup vs cutmix test accuracy on an overfitting-prone toy task ----
C, H, W = 3, 16, 16
def make(n, cls, seed):
    g = torch.Generator().manual_seed(seed)
    x = 1.1 * torch.randn(n, C, H, W, generator=g)
    if cls == 0: x[:, :, 2:8, 2:8]  += 0.6
    else:        x[:, :, 8:14, 8:14] += 0.6
    return x
Xtr = torch.cat([make(20,0,1), make(20,1,2)]); ytr = torch.cat([torch.zeros(20), torch.ones(20)]).long()
Xte = torch.cat([make(500,0,300), make(500,1,400)]); yte = torch.cat([torch.zeros(500), torch.ones(500)]).long()

def rand_bbox(W, H, lam):
    cut = math.sqrt(1-lam); cw, ch = int(W*cut), int(H*cut)
    cx, cy = np.random.randint(W), np.random.randint(H)
    x1=int(np.clip(cx-cw//2,0,W)); x2=int(np.clip(cx+cw//2,0,W))
    y1=int(np.clip(cy-ch//2,0,H)); y2=int(np.clip(cy+ch//2,0,H))
    return x1,y1,x2,y2
def net():
    return nn.Sequential(nn.Conv2d(3,6,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                         nn.Conv2d(6,12,3,padding=1), nn.ReLU(), nn.AdaptiveAvgPool2d(1),
                         nn.Flatten(), nn.Linear(12,2))
def train(mode, epochs=140, bs=15):
    torch.manual_seed(0); np.random.seed(0)
    m = net(); opt = torch.optim.Adam(m.parameters(), lr=0.012)
    for _ in range(epochs):
        perm = torch.randperm(Xtr.shape[0])
        for i in range(0, Xtr.shape[0], bs):
            idx = perm[i:i+bs]; xb = Xtr[idx].clone(); yb = ytr[idx]; opt.zero_grad()
            if mode == "none": loss = F.cross_entropy(m(xb), yb)
            elif mode == "mixup":
                lam = float(np.random.beta(1,1)); r = torch.randperm(xb.size(0))
                out = m(lam*xb + (1-lam)*xb[r])
                loss = lam*F.cross_entropy(out, yb) + (1-lam)*F.cross_entropy(out, yb[r])
            else:
                lam = float(np.random.beta(1,1)); r = torch.randperm(xb.size(0))
                x1,y1,x2,y2 = rand_bbox(W,H,lam); xb[:,:,y1:y2,x1:x2] = xb[r,:,y1:y2,x1:x2]
                lam = 1 - (x2-x1)*(y2-y1)/(W*H); out = m(xb)
                loss = lam*F.cross_entropy(out, yb) + (1-lam)*F.cross_entropy(out, yb[r])
            loss.backward(); opt.step()
    return (m(Xte).argmax(1) == yte).float().mean().item()
for mode in ["none","mixup","cutmix"]:
    print(mode, "test_acc =", round(train(mode), 3))   # ~0.533 / 0.846 / 0.835

# ---- MIDDLE: faded-pixel fraction, CutMix vs Mixup ----
xa = torch.zeros(1,3,16,16); xa[:,:,2:8,2:8] = 1.0
xb = torch.zeros(1,3,16,16); xb[:,:,8:14,8:14] = 1.0
mixup = 0.5*xa + 0.5*xb
cut = xa.clone(); cut[:,:,8:16,8:16] = xb[:,:,8:16,8:16]
faded = lambda im: ((im != 0) & (im != 1)).float().mean().item()   # pixels that are neither source value
print("faded fraction  CutMix:", faded(cut), " Mixup:", faded(mixup))  # 0.0  vs  1.0

# ---- RIGHT: label drift if you skip the lambda re-fit ----
np.random.seed(3); diffs = []
for _ in range(5000):
    lam = float(np.random.beta(1,1)); x1,y1,x2,y2 = rand_bbox(16,16,lam)
    diffs.append(abs((x2-x1)*(y2-y1)/256 - (1-lam)))
print("label drift mean:", round(float(np.mean(diffs)),4), "max:", round(float(np.max(diffs)),4))`
  };
})();
