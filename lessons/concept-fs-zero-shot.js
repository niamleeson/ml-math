/* =====================================================================
   STANDALONE LESSON — Zero-shot learning.
   Same beginner style as the rest of the app:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - HTML teaching fields; math in $...$ / $$...$$ with DOUBLED backslashes
     - a worked example with real numbers and a real-data CODEVIZ
   Pushed into window.LESSONS; its codeviz merged into window.CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "fs-zero-shot",
    title: "Zero-shot learning",
    tagline: "Recognize a class you have ZERO training examples of, by matching the input to a written description of the class.",
    module: "Few-shot & Transfer Learning",
    prereqs: ["fs-few-shot", "dl-word-embeddings"],

    bigIdea:
      `<p><b>Zero-shot learning</b> means classifying into classes you have <b>zero</b> training examples for.</p>
       <p>The trick: instead of showing the model labeled pictures of the new class, you give it a <b>description</b> of the class.</p>
       <p>You turn the input and every class description into vectors in one shared space. Then you pick the class whose description vector is closest to the input. No example needed.</p>`,

    buildup:
      `<p>In the previous lesson, <b>few-shot learning</b> classified a new class from just a few support examples (say $K=5$ pictures).</p>
       <p>Zero-shot pushes that to the limit: $K=0$. There are no support examples at all.</p>
       <p>So what stands in for the missing examples? A <b>semantic description</b> of the class. This description can be:</p>
       <ul class="steps">
         <li>A hand-coded <b>attribute vector</b> (has-stripes = 1, has-wings = 0, number-of-loops = 2, ...).</li>
         <li>The <b>word embedding</b> of the class name (the vector for the word "zebra").</li>
         <li>The output of a <b>CLIP</b> (Contrastive Language-Image Pretraining) text encoder fed a sentence like "a photo of a zebra".</li>
       </ul>
       <p>Whatever the source, the description becomes a point in the same space as the input. Then classification is just "find the nearest description".</p>`,

    symbols: [
      { sym: "$x$", desc: "the input we want to classify (an image, a row of pixels, etc.)." },
      { sym: "$g(x)$", desc: "the input embedding: a function $g$ that turns the input $x$ into a vector (a list of numbers) in the shared space." },
      { sym: "$s_k$", desc: "the description embedding of class $k$: the class's attribute vector, name embedding, or CLIP (Contrastive Language-Image Pretraining) text vector, placed in the same shared space." },
      { sym: "$\\text{sim}(a, b)$", desc: "a similarity score between two vectors $a$ and $b$. Higher means more alike. Here it is cosine similarity (defined below)." },
      { sym: "$\\hat{y}$", desc: "the predicted class (the little hat means 'predicted'). It is the class whose description is most similar to the input." },
      { sym: "$\\arg\\max_k$", desc: "'the $k$ that makes the thing after it largest'. We scan every class $k$ and keep the best one." }
    ],

    formula: `$$ \\hat{y} = \\arg\\max_k \\; \\text{sim}\\big(g(x),\\, s_k\\big) $$`,

    whatItDoes:
      `<p>Read it as: "embed the input with $g$, compare it to every class description $s_k$, and pick the closest class."</p>
       <p>The similarity here is <b>cosine similarity</b>. In plain English: it measures the <i>angle</i> between two vectors, ignoring their length. Two vectors pointing the same way score $+1$; at a right angle they score $0$; pointing opposite they score $-1$. So a high cosine means "these point in the same direction in meaning-space".</p>
       <p>The formula for cosine similarity is $\\text{sim}(a, b) = \\dfrac{a \\cdot b}{\\lVert a \\rVert\\, \\lVert b \\rVert}$, where $a \\cdot b$ is the dot product and $\\lVert a \\rVert$ is the length of $a$. Dividing by the lengths is what removes the size and keeps only the direction.</p>`,

    derivation:
      `<p><b>Where it comes from.</b> Zero-shot learning is what few-shot learning becomes when the number of support examples drops to zero.</p>
       <ul class="steps">
         <li>In few-shot learning, you describe a new class by averaging its support examples into a <b>prototype</b> vector $c_k = \\frac{1}{K}\\sum_{i} g(x_i)$, then classify by nearest prototype: $\\hat{y} = \\arg\\max_k \\text{sim}\\big(g(x), c_k\\big)$.</li>
         <li>Now set $K = 0$. The average $\\frac{1}{K}\\sum_i g(x_i)$ is undefined: there are no support examples to average. The prototype vanishes.</li>
         <li>Zero-shot fills that hole by <b>replacing the missing prototype with a description embedding</b>: set $c_k = s_k$, the class's attribute or word vector.</li>
         <li>Substituting gives exactly the zero-shot rule: $\\hat{y} = \\arg\\max_k \\text{sim}\\big(g(x), s_k\\big)$. ∎</li>
       </ul>
       <p>So the only change from few-shot is the source of the class vector: an <i>average of examples</i> becomes a <i>written description</i>. Everything else (embed, compare, take the nearest) is identical.</p>
       <p>The one requirement that makes this work: $g(x)$ and $s_k$ must live in the <b>same</b> space, so that comparing them is meaningful. CLIP (Contrastive Language-Image Pretraining) achieves this by training an image encoder and a text encoder together so that matching image-text pairs land near each other.</p>`,

    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // Drag the INPUT embedding around; watch which class description it is nearest (by cosine).
      // Three fixed class descriptions s_k (2-D for drawing). The input g(x) is draggable.
      var classes = [
        { name: "zebra", v: [0.9, 0.5], col: null },
        { name: "horse", v: [0.8, -0.4], col: null },
        { name: "panda", v: [-0.7, 0.3], col: null }
      ];
      var gx = { x: 0.4, y: 0.6 };       // the input embedding g(x), draggable
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 340; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var CX = 320, CY = 180, R = 130;   // origin and unit-vector radius in pixels
      function toPix(p) { return { x: CX + p[0] / 1.2 * R, y: CY - p[1] / 1.2 * R }; }
      function cos(a, b) {
        var dot = a[0] * b[0] + a[1] * b[1];
        var na = Math.sqrt(a[0] * a[0] + a[1] * a[1]) || 1e-9;
        var nb = Math.sqrt(b[0] * b[0] + b[1] * b[1]) || 1e-9;
        return dot / (na * nb);
      }
      function draw() {
        var c = C();
        classes[0].col = c.accent; classes[1].col = c.warn; classes[2].col = c.accent2;
        ctx.clearRect(0, 0, cv.width, cv.height);
        // axes
        ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.beginPath();
        ctx.moveTo(CX - R - 20, CY); ctx.lineTo(CX + R + 20, CY);
        ctx.moveTo(CX, CY - R - 20); ctx.lineTo(CX, CY + R + 20); ctx.stroke();
        // find nearest class to the input (highest cosine)
        var gv = [gx.x, gx.y], best = 0, bestc = -2;
        for (var i = 0; i < classes.length; i++) { var s = cos(gv, classes[i].v); if (s > bestc) { bestc = s; best = i; } }
        // draw class description vectors as arrows from origin
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "13px sans-serif";
        for (var k = 0; k < classes.length; k++) {
          var p = toPix(classes[k].v), o = toPix([0, 0]);
          ctx.strokeStyle = classes[k].col; ctx.lineWidth = (k === best) ? 4 : 2;
          ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(p.x, p.y); ctx.stroke();
          ctx.fillStyle = classes[k].col;
          ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 7); ctx.fill();
          ctx.fillText('"' + classes[k].name + '"', p.x, p.y - 16);
          ctx.fillStyle = c.dim; ctx.font = "11px sans-serif";
          ctx.fillText("cos=" + cos(gv, classes[k].v).toFixed(2), p.x, p.y + 16);
          ctx.font = "13px sans-serif";
        }
        // draw input g(x) as a draggable dot + arrow
        var gp = toPix(gv), op = toPix([0, 0]);
        ctx.strokeStyle = c.purple; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(op.x, op.y); ctx.lineTo(gp.x, gp.y); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = c.purple; ctx.beginPath(); ctx.arc(gp.x, gp.y, 8, 0, 7); ctx.fill();
        ctx.fillStyle = c.ink; ctx.fillText("g(x)", gp.x, gp.y - 18);
        // header
        ctx.fillStyle = c.dim; ctx.textAlign = "left"; ctx.font = "12px sans-serif";
        ctx.fillText("Drag g(x). The thick arrow is the nearest class description (highest cosine).", 12, 18);
        ctx.textAlign = "center";
        rd.innerHTML = "input g(x) is nearest to <b style='color:" + classes[best].col + "'>" +
          classes[best].name + "</b> &nbsp; (cosine " + bestc.toFixed(3) + "). " +
          "Prediction ŷ = <b>" + classes[best].name + "</b> — a class chosen with zero training examples, just its description.";
      }
      // dragging
      var dragging = false;
      function evtPos(e) {
        var r = cv.getBoundingClientRect();
        var cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
        var cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
        return { mx: cx * cv.width / r.width, my: cy * cv.height / r.height };
      }
      function setFromPix(mx, my) { gx.x = (mx - CX) / R * 1.2; gx.y = -(my - CY) / R * 1.2; draw(); }
      cv.addEventListener("mousedown", function (e) { dragging = true; var p = evtPos(e); setFromPix(p.mx, p.my); });
      window.addEventListener("mousemove", function (e) { if (dragging) { var p = evtPos(e); setFromPix(p.mx, p.my); } });
      window.addEventListener("mouseup", function () { dragging = false; });
      cv.addEventListener("touchstart", function (e) { dragging = true; var p = evtPos(e); setFromPix(p.mx, p.my); e.preventDefault(); }, { passive: false });
      cv.addEventListener("touchmove", function (e) { if (dragging) { var p = evtPos(e); setFromPix(p.mx, p.my); e.preventDefault(); } }, { passive: false });
      cv.addEventListener("touchend", function () { dragging = false; });
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      draw();
    },

    example:
      `<p>Suppose we want to recognize a <b>zebra</b>, but we trained only on horses, pandas, and tigers — never a zebra.</p>
       <p>We describe each class by two attributes: <b>has-stripes</b> and <b>is-horse-shaped</b>, written as a vector $[\\text{stripes},\\ \\text{horse-shaped}]$.</p>
       <ul class="steps">
         <li>Class descriptions: $s_{\\text{horse}} = [0, 1]$, &nbsp; $s_{\\text{tiger}} = [1, 0]$, &nbsp; $s_{\\text{zebra}} = [1, 1]$ (striped <i>and</i> horse-shaped).</li>
         <li>A new image is embedded into the same attribute space: $g(x) = [0.9, 0.8]$ (looks striped and horse-shaped).</li>
         <li>Cosine to horse: $\\frac{0.9\\cdot0 + 0.8\\cdot1}{\\sqrt{0.9^2+0.8^2}\\,\\cdot 1} = \\frac{0.8}{1.20} \\approx 0.66$.</li>
         <li>Cosine to tiger: $\\frac{0.9\\cdot1 + 0.8\\cdot0}{1.20 \\cdot 1} = \\frac{0.9}{1.20} \\approx 0.75$.</li>
         <li>Cosine to zebra: $\\frac{0.9\\cdot1 + 0.8\\cdot1}{1.20 \\cdot \\sqrt{2}} = \\frac{1.7}{1.70} \\approx 1.00$.</li>
       </ul>
       <p>Zebra wins with cosine $\\approx 1.00$. We classified a zebra correctly with <b>zero</b> zebra training images — only its attribute description.</p>`,

    application:
      `<p>Zero-shot learning is everywhere in modern AI. <b>CLIP</b> (Contrastive Language-Image Pretraining) classifies an image into any list of labels you type, with no fine-tuning: it embeds the image and each label-sentence, then picks the nearest sentence. Large language models do zero-shot text classification the same way. And attribute-based zero-shot lets vision systems flag rare or never-photographed categories (new animal species, rare defects) from a written description alone.</p>`,

    whenToUse:
      `<p><b>Reach for zero-shot when you have a label or description but no labeled training examples at all for that class</b> — a brand-new product category, a rare defect, an ad-hoc set of tags a user types at run time. A model pretrained to align inputs with text lets you classify by comparing the input's embedding to each label's embedding.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Collecting and labeling data</b> — when no examples exist yet, or the label set changes per request, so training a classifier is impossible.</li>
         <li><b>Few-shot learning</b> — when you have <i>zero</i> examples rather than a handful; if even one or two examples exist, <a onclick="App.open('fs-few-shot')">few-shot</a> usually beats pure zero-shot.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>You do have labeled data for the classes — a trained classifier or fine-tuned model will be more accurate.</li>
         <li>The classes are subtle or fine-grained (bird subspecies) where a text description can't separate them — gather a few examples and go few-shot.</li>
       </ul>
       <p><b>Which library:</b> <code>open_clip</code> or Hugging Face <code>transformers</code> for CLIP-style image / text alignment and zero-shot pipelines.</p>`,
    pitfalls:
      `<ul>
         <li><b>Prompt sensitivity.</b> "a photo of a cat" versus "cat" can swing accuracy by many points. Test several prompt templates and ensemble them, or use prompt tuning.</li>
         <li><b>Calibration across labels.</b> Raw similarity scores are not comparable probabilities across classes, so a temperature-scaled softmax over labels is needed before thresholding. Calibrate on a small validation set.</li>
         <li><b>Label set wording matters.</b> Ambiguous, overlapping, or jargon labels confuse the text encoder. Use clear, mutually distinct descriptions and expand abbreviations.</li>
         <li><b>Pretraining bias and blind spots.</b> The model only knows concepts seen during pretraining; truly novel or culturally specific classes fail silently. Validate on real examples before trusting it.</li>
         <li><b>Evaluation leakage.</b> If your "zero-shot" test classes actually appeared in the pretraining corpus, scores are inflated and not really zero-shot. Check overlap honestly.</li>
         <li><b>Fine-grained failure.</b> Zero-shot struggles to separate look-alike classes a sentence cannot distinguish. Fall back to few-shot when distinctions are visual and subtle.</li>
       </ul>`,

    practice: [
      {
        q: `Three class descriptions: $s_{\\text{cat}} = [1, 0]$, $s_{\\text{dog}} = [0, 1]$, $s_{\\text{wolf}} = [0, 1]$ (a wolf is described like a dog). A new image embeds to $g(x) = [0.1, 0.9]$. Which class wins, and why might cat lose badly?`,
        steps: [
          { do: `Cosine to cat $[1,0]$: $\\frac{0.1\\cdot1 + 0.9\\cdot0}{\\sqrt{0.1^2+0.9^2}\\cdot 1} = \\frac{0.1}{0.906} \\approx 0.11$.`, why: `Only the first attribute overlaps, and the input is tiny there.` },
          { do: `Cosine to dog $[0,1]$: $\\frac{0.1\\cdot0 + 0.9\\cdot1}{0.906\\cdot 1} = \\frac{0.9}{0.906} \\approx 0.99$.`, why: `The input points almost entirely along the second attribute, same as dog.` },
          { do: `Cosine to wolf $[0,1]$: same as dog, $\\approx 0.99$.`, why: `Wolf and dog share the same description, so they tie.` },
          { do: `Take the $\\arg\\max$: dog (and wolf) at $0.99$ beat cat at $0.11$.`, why: `The prediction is the class whose description vector points most like the input.` }
        ],
        answer: `Dog and wolf tie at cosine $\\approx 0.99$; cat loses with $\\approx 0.11$ because the input barely points along cat's attribute. Identical descriptions (dog vs wolf) cannot be told apart — zero-shot needs <i>distinct</i> descriptions.`
      },
      {
        q: `Explain in one or two sentences how zero-shot learning is the $K=0$ case of few-shot learning.`,
        steps: [
          { do: `Few-shot builds a class prototype by averaging $K$ support examples: $c_k = \\frac{1}{K}\\sum_i g(x_i)$.`, why: `That average is the class's stand-in vector.` },
          { do: `At $K=0$ there are no examples to average, so replace the prototype with a description embedding $s_k$.`, why: `The written description fills the role the examples would have played.` }
        ],
        answer: `Few-shot classifies by nearest prototype (an average of $K$ examples). Zero-shot sets $K=0$ and swaps the unavailable prototype for a class description $s_k$, then classifies by nearest description — same rule, different source for the class vector.`
      }
    ]
  });

  window.CODEVIZ["fs-zero-shot"] = {
    question: "Can a model classify handwritten 8s and 9s it NEVER saw as labels, just by matching them to a written description of each digit?",
    charts: [{
      type: "scatter",
      title: "Held-out digits 8 and 9 land nearest their own attribute description (zero-shot)",
      xlabel: "cosine similarity to the 8-description",
      ylabel: "cosine similarity to the 9-description",
      groups: [
        { name: "true 8 (never trained)", color: "#4ea1ff", points: [[0.472, 0.004], [0.311, 0.065], [0.575, -0.018], [0.235, -0.382], [0.339, 0.218], [0.529, 0.541], [0.917, 0.643], [0.572, 0.364], [-0.061, -0.07], [-0.264, 0.253], [0.666, 0.345], [0.268, -0.606], [0.16, -0.468], [0.964, 0.223], [0.479, -0.041], [0.66, 0.363], [-0.457, -0.624], [-0.087, 0.188], [0.054, -0.417], [0.56, 0.051], [0.764, 0.754], [0.418, 0.901]] },
        { name: "true 9 (never trained)", color: "#7ee787", points: [[0.071, 0.736], [0.233, 0.961], [-0.287, 0.345], [0.604, 0.776], [0.177, 0.653], [0.457, 0.57], [0.656, 0.677], [-0.063, 0.689], [0.329, 0.937], [-0.032, 0.863], [0.038, 0.802], [0.495, 0.85], [0.439, 0.909], [-0.206, 0.748], [0.338, 0.853], [0.16, 0.81], [-0.053, 0.654], [0.117, 0.76], [0.515, 0.902], [0.181, 0.893], [0.096, 0.814], [0.44, 0.991]] }
      ],
      lines: [{ color: "#9aa7b4", dash: true, points: [[-0.5, -0.5], [1.0, 1.0]] }]
    }],
    caption: "Approach B (fully reproducible, sklearn): a Ridge regressor trained ONLY on digit classes 0-7 maps each image into a 6-D attribute space (number of enclosed holes, top/bottom ink balance, left/right balance, central stroke, total ink, vertical center-of-mass). The held-out classes 8 and 9 are then classified by nearest class-description via cosine similarity — never having seen 8 or 9 as labels. Most true-8 images (blue) sit below the dashed diagonal (more similar to the 8-description) and most true-9 images (green) sit above it, giving 81.4% zero-shot accuracy on these two unseen classes.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from scipy.ndimage import label

digits = load_digits()                       # 1797 real 8x8 handwritten digits
X = digits.data / 16.0
y = digits.target
imgs = digits.images / 16.0

def holes(im):                               # real count of enclosed background regions
    bg = (im < 0.25).astype(int)
    lab, n = label(bg)
    border = set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])
    return sum(1 for c in range(1, n + 1) if c not in border)

def stats(im):                               # interpretable shape statistics
    top, bot = im[:4, :].sum(), im[4:, :].sum()
    left, right = im[:, :4].sum(), im[:, 4:].sum()
    total = im.sum() + 1e-9
    center = im[:, 3:5].sum()                 # central vertical stroke
    com = (im.sum(1) * np.arange(8)).sum() / total   # vertical center of mass
    return np.array([(top - bot) / total, (left - right) / total,
                     center / total, total / 64.0, com / 7.0])

# 6-D attribute vector per image: [holes, top/bottom, left/right, center, ink, com]
feat = np.array([np.concatenate([[holes(imgs[i])], stats(imgs[i])])
                 for i in range(len(imgs))])

# each CLASS description s_k = the mean attribute vector for that class
A = np.array([feat[y == d].mean(0) for d in range(10)])

SEEN, HELD = [0, 1, 2, 3, 4, 5, 6, 7], [8, 9]   # 8 and 9 are NEVER seen as labels
mask = np.isin(y, SEEN)

xsc = StandardScaler().fit(X[mask])              # standardize pixels
asc = StandardScaler().fit(feat[mask])           # standardize attribute space
# g(x): a regressor mapping image -> attribute space, trained ONLY on classes 0-7
reg = Ridge(alpha=1.0).fit(xsc.transform(X[mask]), asc.transform(feat[mask]))

held = np.isin(y, HELD)
emb = reg.predict(xsc.transform(X[held]))        # embed held-out images
yte = y[held]
S = asc.transform(A)                             # class descriptions in same space

def cos(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-12)

# zero-shot rule: y_hat = argmax_k cos(g(x), s_k) over the unseen classes {8, 9}
pred = np.array([HELD[int(np.argmax([cos(v, S[c]) for c in HELD]))] for v in emb])
acc = (pred == yte).mean()                       # 0.814 -> 81.4% on unseen 8 vs 9

# plot each held-out image by (similarity to 8-desc, similarity to 9-desc)
import matplotlib.pyplot as plt
x8 = [cos(v, S[8]) for v in emb]
x9 = [cos(v, S[9]) for v in emb]
plt.scatter(np.array(x8)[yte == 8], np.array(x9)[yte == 8], color="#4ea1ff", label="true 8")
plt.scatter(np.array(x8)[yte == 9], np.array(x9)[yte == 9], color="#7ee787", label="true 9")
plt.plot([-0.5, 1], [-0.5, 1], "--", color="gray")
plt.xlabel("cosine similarity to the 8-description")
plt.ylabel("cosine similarity to the 9-description")
plt.title("Held-out digits 8 and 9 land nearest their own attribute description (zero-shot)")
plt.legend()
plt.show()`
  };
})();
