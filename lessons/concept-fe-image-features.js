/* Feature Engineering (Zheng & Casari) — Chapter 8, "Automating the Featurizer:
   Image Feature Extraction" (the MANUAL part: SIFT & HOG, built from image gradients).
   BEGINNER lesson. Self-contained: lesson + CODE + CODEVIZ merged by id "fe-image-features". */
(function () {
  window.LESSONS.push({
    id: "fe-image-features",
    title: "Hand-designed image features: gradients, HOG, and SIFT",
    tagline: "Before deep nets, vision turned raw pixels into edge-orientation histograms (HOG, SIFT) to get robust shape features.",
    module: "Feature Engineering (Zheng & Casari)",
    prereqs: ["fnd-gradient", "dl-conv", "fe-what-is-a-feature"],

    bigIdea:
      `<p>An image is a grid of pixel brightness values. The obvious "feature" is just the raw
       pixels &mdash; flatten the grid into one long vector and hand it to a model. Chapter 8 of
       Zheng &amp; Casari's <i>Feature Engineering for Machine Learning</i> opens by explaining why that
       is a <b>terrible</b> feature. The very same object photographed a little brighter, shifted a few
       pixels right, or scaled up looks like a completely different vector of numbers, even though it is
       the same thing. Raw pixels are <b>fragile</b>: sensitive to lighting, shift, and scale.</p>
       <p>So for decades &mdash; the whole era <b>before deep learning</b> &mdash; people hand-designed
       smarter image features. The trick they converged on: don't describe an image by its pixel
       <i>brightness</i>, describe it by its <b>gradients</b>. A gradient is how fast brightness changes
       and in which direction. Gradients are large exactly at <b>edges</b> (where one region meets
       another) and they barely move when you make the whole image brighter or darker. Edges are where
       the <b>shape</b> lives.</p>
       <p>This lesson covers the two hand-designed featurizers the book singles out, both built on
       gradients: <b>HOG</b> (Histogram of Oriented Gradients) and <b>SIFT</b> (Scale-Invariant Feature
       Transform). The shared recipe is one sentence: <b>compute gradients, bin their directions into
       histograms, and use those histograms as robust local descriptors of edge and shape structure.</b></p>`,

    buildup:
      `<p><b>Step 1 &mdash; the gradient at a pixel.</b> Take the brightness image and ask, at each pixel,
       how much does brightness change going right ($g_x$) and going down ($g_y$)? Those two numbers form
       a little arrow. Its <b>length</b> (magnitude $m$) says how strong the edge is; its <b>angle</b>
       (orientation $\\theta$) says which way the edge runs. A flat region has tiny gradients; a sharp
       boundary has a long arrow pointing across the boundary.</p>
       <p><b>Step 2 &mdash; pool directions into a histogram (this is HOG).</b> One arrow per pixel is too
       much detail and too fragile. So chop the image into small square <b>cells</b> (say
       $8\\times 8$ pixels). Inside each cell, build a <b>histogram of gradient orientations</b>: split the
       circle of directions into a few bins (8 bins of 45&deg; each, say) and add up the gradient
       <i>magnitude</i> falling into each direction bin. A cell with a strong vertical edge piles its mass
       into the "vertical" bin. Now a whole cell is summarized by just a handful of numbers that say
       <i>which edge directions dominate here</i>. Stack the per-cell histograms and you have the HOG
       feature vector for the image.</p>
       <p><b>Step 3 &mdash; normalize over blocks (robustness to lighting).</b> Brightness and contrast
       vary across a photo. HOG groups neighboring cells into overlapping <b>blocks</b> and divides each
       block's histogram by its own size (a local normalization). This makes the descriptor largely
       invariant to lighting changes, because scaling every pixel's brightness scales every gradient
       equally and the normalization cancels it out.</p>
       <p><b>Step 4 &mdash; do it across scales (this is SIFT).</b> HOG runs on a fixed grid. <b>SIFT</b>
       goes further: it first <i>finds</i> interesting <b>keypoints</b> (corners, blobs) and does so across
       many image <b>scales</b> (by blurring/shrinking the image repeatedly), so the same keypoint is found
       whether the object is near or far. Around each keypoint it builds the very same kind of
       <b>orientation histograms</b>, and it rotates them to a dominant direction first. The result is a
       descriptor that is invariant to <b>scale and rotation</b> &mdash; that is the "Scale-Invariant" in
       the name.</p>`,

    symbols: [
      { sym: "$I(x,y)$", desc: "the image: brightness (intensity) at pixel column $x$, row $y$." },
      { sym: "$g_x,\\ g_y$", desc: "the horizontal and vertical gradients &mdash; how fast brightness changes going right and going down. Computed by differencing neighboring pixels." },
      { sym: "$m$", desc: "gradient magnitude at a pixel, $m=\\sqrt{g_x^2+g_y^2}$: the edge strength (length of the gradient arrow)." },
      { sym: "$\\theta$", desc: "gradient orientation, $\\theta=\\operatorname{atan2}(g_y,g_x)$: the edge direction (angle of the gradient arrow)." },
      { sym: "$\\text{bin}(\\theta)$", desc: "which orientation bin the angle $\\theta$ falls into &mdash; the circle of directions split into a few equal wedges (e.g. 8 or 9 bins)." },
      { sym: "$h_c[k]$", desc: "the HOG histogram of cell $c$: total gradient magnitude $m$ in cell $c$ whose orientation lands in bin $k$. The cell's edge-direction profile." }
    ],

    formula:
      `$$ m=\\sqrt{g_x^2+g_y^2},\\qquad \\theta=\\operatorname{atan2}(g_y,\\,g_x),\\qquad
         h_c[k]=\\!\\!\\sum_{(x,y)\\in c}\\!\\! m(x,y)\\,\\big[\\,\\text{bin}(\\theta(x,y))=k\\,\\big] $$`,

    whatItDoes:
      `<p>The magnitude $m$ and orientation $\\theta$ turn each pixel into an edge arrow. The histogram
       $h_c[k]$ then <b>pools</b> those arrows over a cell by direction: it is the sum of edge
       <i>strengths</i> pointing in each direction bin $k$. Reading $h_c$ tells you the cell's local edge
       story &mdash; "mostly horizontal edges here", "a strong diagonal there".</p>
       <p>Why this is a good feature: pooling into a cell makes it <b>shift-tolerant</b> (an edge can wiggle
       a pixel and land in the same cell and bin); using orientation rather than brightness makes it
       <b>lighting-tolerant</b>; and (in SIFT) doing it across scales and rotating to a reference angle
       makes it <b>scale- and rotation-tolerant</b>. The fragile raw-pixel vector becomes a robust
       descriptor of <b>shape</b>.</p>`,

    derivation:
      `<p><b>Why gradients, and why histograms of their directions, beat raw pixels.</b></p>
       <ul class="steps">
         <li>Add a constant to every pixel (make the photo uniformly brighter). Raw pixel values all shift &mdash; the feature vector changes completely. But a gradient is a <i>difference</i> of neighboring pixels, so a constant offset cancels: $g_x,g_y$ are <b>unchanged</b>. Edges are invariant to additive lighting.</li>
         <li>Multiply every pixel by a constant (change contrast/exposure). Gradients scale by the same constant, so the gradient <i>directions</i> $\\theta$ are unchanged and only the magnitudes $m$ scale uniformly. HOG's block normalization then divides that constant out &mdash; so the descriptor is invariant to multiplicative lighting too.</li>
         <li>Shift the object a couple of pixels. A raw-pixel vector is wildly different (everything moved). But pooling gradients into an $8\\times 8$ cell means a small shift keeps the same edges inside the same cell, hitting the same orientation bins. The histogram barely moves &mdash; <b>local shift invariance</b>.</li>
         <li>Now the key insight from the chapter: an edge's <b>orientation</b> carries the shape information, and a per-cell <i>histogram</i> of orientations is a compact, robust summary of "what edges live here". This is exactly what HOG computes, cell by cell, then concatenates into one feature vector.</li>
         <li>SIFT adds two more invariances on top. It searches a <b>scale-space</b> (the image blurred and shrunk repeatedly) for keypoints that survive across scales, so the same point is detected near or far &mdash; <b>scale invariance</b>. It measures each keypoint's dominant gradient direction and rotates its orientation histograms to that reference &mdash; <b>rotation invariance</b>.</li>
         <li>The payoff: HOG and SIFT were the <b>backbone of pre-deep-learning computer vision</b> &mdash; pedestrian detection, object recognition, image stitching all ran on these hand-built gradient-histogram features. Deep convolutional nets later <i>learned</i> similar (and better) features automatically, which is the next lesson. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Take one tiny cell and build its orientation histogram by hand. Suppose a $2\\times2$ patch has
       these four gradient arrows (magnitude $m$, orientation $\\theta$):</p>
       <ul class="steps">
         <li>Arrow A: $m=10,\\ \\theta=0\\degree$ (points right &mdash; a vertical edge).</li>
         <li>Arrow B: $m=8,\\ \\theta=5\\degree$ (almost right).</li>
         <li>Arrow C: $m=9,\\ \\theta=90\\degree$ (points up &mdash; a horizontal edge).</li>
         <li>Arrow D: $m=1,\\ \\theta=44\\degree$ (a weak diagonal).</li>
       </ul>
       <p>Use 4 orientation bins of 45&deg; each: bin 0 = $[0,45)\\degree$, bin 1 = $[45,90)\\degree$,
       bin 2 = $[90,135)\\degree$, bin 3 = $[135,180)\\degree$. Add each arrow's <b>magnitude</b> into its
       bin:</p>
       <ul class="steps">
         <li>A ($0\\degree$) and B ($5\\degree$) and D ($44\\degree$) fall in bin 0: $10+8+1 = 19$.</li>
         <li>C ($90\\degree$) falls in bin 2: $9$.</li>
         <li>Bins 1 and 3 stay $0$.</li>
       </ul>
       <p>Histogram $h = [\\,19,\\ 0,\\ 9,\\ 0\\,]$. The big value in bin 0 says this cell is dominated by
       <b>vertical edges</b> (gradients pointing right), with a weaker horizontal edge (bin 2). That four-
       number summary &mdash; not the raw pixels &mdash; is what HOG hands to the model for this cell.</p>`,

    whenToUse:
      `<p><b>Reach for hand-designed gradient features when you can't or shouldn't train a deep net.</b></p>
       <ul>
         <li><b>Classic computer vision before / without deep learning.</b> HOG and SIFT are the standard
         featurizers for object detection and recognition when a convolutional neural network is overkill or
         unavailable &mdash; they need no training data of their own.</li>
         <li><b>Small data.</b> A CNN needs many labeled images to learn good filters. With only a few hundred
         images you can't train one well, but HOG/SIFT features (plus a simple classifier like an SVM) work
         out of the box.</li>
         <li><b>Interpretable edge / shape features.</b> A HOG vector is literally "how much edge energy points
         each direction, per cell" &mdash; you can visualize it and reason about it, unlike opaque learned
         features.</li>
         <li><b>Geometry tasks.</b> SIFT's scale- and rotation-invariant keypoints are still used for image
         matching, panorama stitching, and 3D reconstruction, where matching the <i>same</i> physical point
         across photos matters more than classification.</li>
       </ul>`,

    application:
      `<p>Where these gradient featurizers showed up in real pipelines.</p>
       <ul>
         <li><b>The book's Chapter 8 examples.</b> Zheng &amp; Casari walk through computing image gradients,
         then HOG and SIFT, as the manual alternative to learned features &mdash; setting up the contrast with
         the deep-learning featurizers later in the chapter.</li>
         <li><b>Pedestrian and object detection.</b> The classic HOG + linear SVM detector (Dalal &amp; Triggs)
         slid a HOG descriptor across an image to find people &mdash; a workhorse of pre-deep vision.</li>
         <li><b>Image matching and stitching.</b> SIFT descriptors match keypoints between photos taken at
         different scales and angles, powering panorama tools, object recognition, and structure-from-motion.</li>
         <li><b>Bag-of-visual-words.</b> SIFT descriptors from many images were clustered into a "visual
         vocabulary", turning an image into a histogram of visual words &mdash; the image analogue of bag-of-
         words text features.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Hand-tuned and brittle versus learned features.</b> HOG/SIFT encode <i>edges</i> well but a
         human chose what to measure. They miss cues a CNN would learn (color blobs, texture, semantic parts)
         and degrade on tasks their designers didn't anticipate. The fix when you have data: learn the features
         (next lesson).</li>
         <li><b>Many hyperparameters.</b> Cell size, number of orientation bins, block size, normalization
         scheme &mdash; all chosen by hand, and the right values differ by task. Tuning them is fiddly and the
         results don't transfer cleanly between datasets.</li>
         <li><b>Not as powerful as CNN features.</b> On large labeled datasets, learned convolutional features
         consistently beat HOG/SIFT by a wide margin. These hand-built features are a tool for the
         <i>small-data / no-training</i> regime, not the state of the art.</li>
         <li><b>Superseded by deep learning.</b> The whole point of the chapter's arc is that deep nets
         <i>automate</i> this hand-design step. Use HOG/SIFT knowingly &mdash; for interpretability, geometry,
         or scarce data &mdash; not as a default for a big classification problem.</li>
       </ul>`,

    practice: [
      {
        q: `Why is a flattened vector of raw pixel brightnesses a poor image feature, and what single idea fixes most of the problem?`,
        steps: [
          { do: `Brighten the whole image, or shift the object two pixels right.`, why: `Every raw pixel value changes, so the feature vector changes drastically even though it is the same object.` },
          { do: `Switch from brightness to gradients (differences of neighboring pixels).`, why: `A constant brightness offset cancels in a difference, so gradients ignore additive lighting; gradients are large only at edges, which carry the shape.` },
          { do: `Pool gradient orientations into per-cell histograms (HOG).`, why: `A small shift keeps edges in the same cell and bin, so the histogram is stable &mdash; local shift and lighting tolerance.` }
        ],
        answer: `<p>Raw pixels are <b>fragile</b>: lighting, shift, and scale change every value, so the same object yields very different vectors. The fix is to describe the image by its <b>gradients</b> (edge strength and direction) instead of brightness, then pool gradient <b>orientations into histograms</b> over cells &mdash; the core of HOG. Gradients ignore additive lighting and pooling absorbs small shifts.</p>`
      },
      {
        q: `An <code>8&times;8</code> HOG cell uses 8 orientation bins. Most of its gradient magnitude lands in the bin covering <code>80&deg;&ndash;100&deg;</code>. What does that tell you about the cell's content?`,
        steps: [
          { do: `Recall the gradient points across an edge, perpendicular to the edge line.`, why: `A gradient near 90 degrees (pointing up/down) means brightness changes vertically.` },
          { do: `Brightness changing vertically corresponds to a horizontal edge.`, why: `The edge line itself runs left-to-right; the gradient crosses it pointing up or down.` },
          { do: `A large histogram value in that bin means strong, consistent edges of that orientation.`, why: `The histogram sums magnitudes, so a tall bin means lots of edge energy in that direction.` }
        ],
        answer: `<p>The cell is dominated by a <b>strong horizontal edge</b>. The gradient orientation near $90\\degree$ points vertically (brightness changes top-to-bottom), which is exactly what a horizontal boundary produces. A tall bin means lots of edge magnitude in that direction &mdash; HOG has summarized the cell as "mostly horizontal edge here".</p>`
      },
      {
        q: `You photograph the same logo small in one image and large (and slightly rotated) in another. Plain HOG on a fixed grid struggles to match them. What does SIFT add to handle this, and why does it work?`,
        steps: [
          { do: `Note HOG runs on a fixed cell grid at one scale, so a size change moves everything to different cells.`, why: `The descriptor isn't aligned across the two images, so the vectors don't match.` },
          { do: `SIFT detects keypoints across a scale-space (the image repeatedly blurred and shrunk).`, why: `The same physical point is found whether the logo is near or far &mdash; scale invariance.` },
          { do: `SIFT measures each keypoint's dominant gradient direction and rotates its orientation histograms to that reference.`, why: `A rotation of the image just rotates the reference too, so the descriptor is unchanged &mdash; rotation invariance.` }
        ],
        answer: `<p>SIFT adds <b>scale</b> and <b>rotation</b> invariance. It searches a <b>scale-space</b> (image blurred/shrunk repeatedly) for keypoints that persist across scales, so the same point is found at any size; and it rotates each keypoint's orientation histograms to a <b>dominant direction</b> first, so rotation doesn't change the descriptor. Both still rest on the same gradient-orientation-histogram idea as HOG &mdash; SIFT just makes it scale- and rotation-invariant.</p>`
      }
    ]
  });

  window.CODE["fe-image-features"] = {
    lib: "scikit-image + OpenCV (numpy)",
    runnable: false,
    explain: `<p>Chapter 8's manual featurizers. <b>HOG</b> is one call to scikit-image's
      <code>hog(...)</code>: it computes the gradient at every pixel, splits the image into
      <code>pixels_per_cell</code> cells, builds an orientation histogram of <code>orientations</code> bins
      per cell, and block-normalizes over <code>cells_per_block</code>. With <code>visualize=True</code> it
      also returns a <code>hog_image</code> you can <code>imshow</code> to <i>see</i> the dominant edge
      directions. <b>SIFT</b> lives in OpenCV as <code>cv2.SIFT_create()</code>: it detects scale- and
      rotation-invariant keypoints and returns a $128$-dimensional descriptor per keypoint. The book's image
      datasets are on its repo (github.com/alicezheng/feature-engineering-book); <code>runnable</code> is off
      here only because you supply your own image.</p>`,
    code: `import numpy as np
import matplotlib.pyplot as plt
from skimage.feature import hog
from skimage import color, data

# --- A sample image (use any image; the book uses its own image datasets:
#     github.com/alicezheng/feature-engineering-book) ---
image = color.rgb2gray(data.astronaut())   # grayscale: HOG works on intensity

# === HOG: Histogram of Oriented Gradients ===
# - compute the gradient (magnitude & orientation) at each pixel
# - split the image into 16x16-pixel cells
# - build an 8-bin orientation histogram per cell
# - block-normalize over 1x1 blocks of cells
# visualize=True also returns an image showing the dominant edge directions.
features, hog_image = hog(
    image,
    orientations=8,
    pixels_per_cell=(16, 16),
    cells_per_block=(1, 1),
    visualize=True
)

print('HOG feature vector length:', features.shape)   # one long vector of cell histograms

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8, 4))
ax1.imshow(image, cmap='gray');      ax1.set_title('input image')
ax2.imshow(hog_image, cmap='gray');  ax2.set_title('HOG: dominant edge directions')
plt.show()

# === SIFT: Scale-Invariant Feature Transform (OpenCV) ===
import cv2
gray8 = (image * 255).astype(np.uint8)     # OpenCV wants an 8-bit image

sift = cv2.SIFT_create()                   # the SIFT detector/descriptor
keypoints, descriptors = sift.detectAndCompute(gray8, None)
# keypoints: detected across SCALES (scale & rotation invariant)
# descriptors: one 128-d orientation-histogram descriptor per keypoint
print('SIFT keypoints:', len(keypoints), ' descriptor shape:', descriptors.shape)`
  };

  window.CODEVIZ["fe-image-features"] = {
    question: "Take a real 8x8 digit image, compute its pixel gradients, and bin the gradient ORIENTATIONS into an 8-bin histogram (the core of HOG). Which edge directions dominate this digit?",
    charts: [
      {
        type: "bars",
        title: "Orientation histogram of one load_digits image (HOG's core step)",
        xlabel: "gradient orientation bin (degrees)",
        ylabel: "total gradient magnitude in bin",
        labels: ["0–45", "45–90", "90–135", "135–180", "180–225", "225–270", "270–315", "315–360"],
        values: [78.2, 27.1, 35.7, 25.9, 77.8, 41.9, 24.5, 26.0],
        valueLabels: ["78.2", "27.1", "35.7", "25.9", "77.8", "41.9", "24.5", "26.0"],
        colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"]
      }
    ],
    caption: "Real numbers from load_digits: one 8x8 image of the digit 0. We compute the pixel gradients with np.gradient, get each pixel's orientation and magnitude, and sum magnitudes into 8 direction bins. The two near-horizontal bins (0–45° at 78.2 and 180–225° at 77.8) carry by far the most edge energy — the round digit's left/right curving strokes produce strong horizontal-pointing gradients. This per-cell orientation histogram is exactly the core computation inside HOG; the book runs the full HOG/SIFT pipeline on larger images.",
    code: `import numpy as np
from sklearn.datasets import load_digits

d = load_digits()
img = d.images[0]                 # one real 8x8 image (digit '0'), pixel values 0..16

# --- gradients at every pixel (numpy only) ---
gy, gx = np.gradient(img.astype(float))      # change down (gy) and right (gx)
mag = np.sqrt(gx**2 + gy**2)                 # edge strength per pixel
ang = np.arctan2(gy, gx)                     # edge direction, in (-pi, pi]
ang = np.mod(np.degrees(ang), 360.0)         # fold to [0, 360) degrees

# --- bin orientations into 8 wedges, weighted by magnitude (HOG's core) ---
nbins = 8
bin_idx = np.minimum((ang / (360.0 / nbins)).astype(int), nbins - 1)
hist = np.zeros(nbins)
for k in range(nbins):
    hist[k] = mag[bin_idx == k].sum()

print('orientation histogram:', np.round(hist, 1))
# -> [78.2 27.1 35.7 25.9 77.8 41.9 24.5 26. ]
# near-horizontal bins dominate: the round '0' has strong left/right-pointing gradients.`
  };
})();
