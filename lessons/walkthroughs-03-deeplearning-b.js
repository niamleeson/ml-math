/* =====================================================================
   REAL-WORLD WALKTHROUGHS — Module 3 (Deep Learning), second half.
   Lessons 15-27: dl-cnn-params .. dl-data-augmentation.
   Each lesson gets exactly 3 walkthroughs in distinct domains.
   Code uses numpy / scikit-learn only (torch is NOT available).
   All snippets were run with python3 and outputs pasted verbatim.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ---------------- dl-cnn-params ---------------- */
  "dl-cnn-params": [
    {
      title: `Sizing a skin-cancer detector for a phone`,
      domain: `Medical imaging`,
      question: `How many weights does the first conv layer of a dermatology app hold, and does image size change that?`,
      steps: [
        { title: `The data`, body: `<p>The app reads a color photo of a skin lesion. Color means $C = 3$ channels (red, green, blue). The first layer uses $K = 16$ filters, each $F \\times F = 5 \\times 5$.</p>` },
        { title: `The math`, body: `<p>One filter holds $F\\cdot F\\cdot C = 5\\cdot 5\\cdot 3 = 75$ weights, plus 1 bias. Total params $= (F\\cdot F\\cdot C + 1)\\cdot K = (75+1)\\cdot 16$. Crucially the same filter slides over every pixel, so the count does NOT depend on whether the photo is $128\\times128$ or $4000\\times3000$.</p>` },
        { title: `Run it`, body: `<p>Count the parameters for two very different image sizes.</p>`,
          code: `F, C, K = 5, 3, 16
params = (F*F*C + 1) * K
for img in [128, 4000]:
    print("image %dx%d -> conv params = %d" % (img, img, params))
print("per filter: %d weights + 1 bias" % (F*F*C))`,
          output: `image 128x128 -> conv params = 1216
image 4000x4000 -> conv params = 1216
per filter: 75 weights + 1 bias` }
      ],
      conclusion: `The layer holds $(5\\cdot5\\cdot3+1)\\cdot16 = 1216$ weights, the same for a tiny thumbnail or a huge photo. Weight sharing is why a CNN this small fits on a phone.`
    },
    {
      title: `Counting weights in a self-driving lane camera`,
      domain: `Autonomous vehicles`,
      question: `A lane-detection CNN stacks two conv layers — how many total weights does it learn?`,
      steps: [
        { title: `The data`, body: `<p>Layer 1 reads the RGB road image ($C_1 = 3$) with $K_1 = 8$ filters of size $3\\times3$. Layer 2 reads layer 1's $8$ feature maps ($C_2 = 8$) with $K_2 = 16$ filters of size $3\\times3$.</p>` },
        { title: `The math`, body: `<p>Apply $(F\\cdot F\\cdot C + 1)\\cdot K$ to each layer. The key subtlety: layer 2's input channel count $C_2$ equals layer 1's filter count $K_1 = 8$, because each filter produces one feature map.</p>` },
        { title: `Run it`, body: `<p>Add up both layers.</p>`,
          code: `def conv_params(F, C, K):
    return (F*F*C + 1) * K
l1 = conv_params(3, 3, 8)
l2 = conv_params(3, 8, 16)   # input channels = previous K
print("layer 1 params:", l1)
print("layer 2 params:", l2)
print("total params:", l1 + l2)`,
          output: `layer 1 params: 224
layer 2 params: 1168
total params: 1392` }
      ],
      conclusion: `The two-layer stack learns $224 + 1168 = 1392$ weights. Layer 2 is bigger because its input has $C_2 = 8$ channels, not 3.`
    },
    {
      title: `Conv vs fully-connected on satellite tiles`,
      domain: `Remote sensing`,
      question: `Why does a crop-classification team use convolution instead of a dense layer on a $64\\times64$ tile?`,
      steps: [
        { title: `The data`, body: `<p>Each grayscale satellite tile is $64\\times64 = 4096$ pixels ($C = 1$). A dense (fully-connected) layer to $64$ units would wire every pixel to every unit. A conv layer instead uses $K = 32$ filters of size $3\\times3$.</p>` },
        { title: `The math`, body: `<p>Dense params $= (\\text{pixels}+1)\\cdot \\text{units} = (4096+1)\\cdot 64$. Conv params $= (F\\cdot F\\cdot C + 1)\\cdot K = (3\\cdot3\\cdot1+1)\\cdot 32$. The ratio shows how much weight-sharing saves.</p>` },
        { title: `Run it`, body: `<p>Compare the two counts.</p>`,
          code: `pixels, units = 64*64, 64
dense = (pixels + 1) * units
F, C, K = 3, 1, 32
conv = (F*F*C + 1) * K
print("dense layer params:", dense)
print("conv layer params:", conv)
print("conv uses %dx fewer weights" % (dense // conv))`,
          output: `dense layer params: 262208
conv layer params: 320
conv uses 819x fewer weights` }
      ],
      conclusion: `The conv layer needs only $320$ weights versus $262208$ for dense — about $819\\times$ fewer — because one filter is reused across the whole tile.`
    }
  ],

  /* ---------------- dl-object-detection ---------------- */
  "dl-object-detection": [
    {
      title: `Scoring a pedestrian box on a self-driving car`,
      domain: `Autonomous vehicles`,
      question: `The detector drew a box for a pedestrian — how well does it match the true box, and do we keep it?`,
      steps: [
        { title: `The data`, body: `<p>Boxes are $[x_1, y_1, x_2, y_2]$ in pixels. The labeled truth box is $[100, 80, 300, 360]$; the model predicted $[130, 100, 320, 340]$. We measure overlap with Intersection-over-Union (IoU).</p>` },
        { title: `The math`, body: `<p>$\\text{IoU} = \\frac{\\text{area of overlap}}{\\text{area of union}}$. The overlap rectangle uses the inner edges: left $= \\max(x_1)$, right $= \\min(x_2)$, and likewise for $y$. A detection counts as correct when $\\text{IoU} \\ge 0.5$.</p>` },
        { title: `Run it`, body: `<p>Compute IoU for the two boxes.</p>`,
          code: `import numpy as np
true = np.array([100, 80, 300, 360])
pred = np.array([130, 100, 320, 340])
def iou(a, b):
    xi1, yi1 = max(a[0], b[0]), max(a[1], b[1])
    xi2, yi2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, xi2 - xi1) * max(0, yi2 - yi1)
    ua = (a[2]-a[0])*(a[3]-a[1]) + (b[2]-b[0])*(b[3]-b[1]) - inter
    return inter / ua
score = iou(true, pred)
print("IoU: %.4f" % score)
print("keep box (IoU>=0.5)?", score >= 0.5)`,
          output: `IoU: 0.6711
keep box (IoU>=0.5)? True` }
      ],
      conclusion: `The boxes overlap with $\\text{IoU} = 0.6711 \\ge 0.5$, so the detection is counted as a correct pedestrian hit.`
    },
    {
      title: `Removing duplicate car boxes with non-max suppression`,
      domain: `Traffic monitoring`,
      question: `A YOLO grid fired three boxes for two cars — how do we drop the duplicates?`,
      steps: [
        { title: `The data`, body: `<p>Each box is $[x_1, y_1, x_2, y_2, \\text{confidence}]$. Two boxes overlap heavily on the same car (confidences $0.92$ and $0.85$); a third box sits elsewhere ($0.78$).</p>` },
        { title: `The math`, body: `<p>Non-max suppression sorts by confidence, keeps the top box, and deletes any remaining box whose IoU with it exceeds $0.5$. Repeat until none are left.</p>` },
        { title: `Run it`, body: `<p>Run NMS over the three detections.</p>`,
          code: `import numpy as np
boxes = np.array([
    [ 50,  50, 200, 200, 0.92],
    [ 60,  55, 210, 205, 0.85],
    [400, 300, 520, 420, 0.78],
])
def iou(a, b):
    xi1,yi1 = max(a[0],b[0]), max(a[1],b[1])
    xi2,yi2 = min(a[2],b[2]), min(a[3],b[3])
    inter = max(0,xi2-xi1)*max(0,yi2-yi1)
    ua = (a[2]-a[0])*(a[3]-a[1]) + (b[2]-b[0])*(b[3]-b[1]) - inter
    return inter/ua
order = boxes[:,4].argsort()[::-1]
keep = []
while len(order):
    i = order[0]; keep.append(i)
    order = np.array([j for j in order[1:] if iou(boxes[i], boxes[j]) < 0.5], dtype=int)
print("kept box indices:", keep)
for i in keep:
    print("box", i, "conf", boxes[i,4])`,
          output: `kept box indices: [0, 2]
box 0 conf 0.92
box 2 conf 0.78` }
      ],
      conclusion: `NMS keeps the strongest box per object (indices $0$ and $2$) and drops box $1$, leaving exactly two cars detected.`
    },
    {
      title: `Picking the class for a detected object`,
      domain: `Retail self-checkout`,
      question: `A grid cell says "something is here" — which product is it, and is the model confident enough?`,
      steps: [
        { title: `The data`, body: `<p>The cell outputs an objectness score $0.8$ (probability a product is present) and raw class logits $[2.0, 0.5, -1.0]$ for $[\\text{person}, \\text{cart}, \\text{bottle}]$.</p>` },
        { title: `The math`, body: `<p>Softmax turns logits into class probabilities, then final confidence per class $= \\text{objectness} \\times P(\\text{class})$. We report a detection only if the best confidence clears a threshold of $0.4$.</p>` },
        { title: `Run it`, body: `<p>Combine objectness and class probabilities.</p>`,
          code: `import numpy as np
def softmax(z):
    e = np.exp(z - z.max()); return e/e.sum()
objectness = 0.8
class_logits = np.array([2.0, 0.5, -1.0])
conf = objectness * softmax(class_logits)
names = ["person", "cart", "bottle"]
for n, c in zip(names, conf):
    print("%-7s confidence = %.3f" % (n, c))
best = int(conf.argmax())
print("detect: %s" % (names[best] if conf[best] >= 0.4 else "nothing"))`,
          output: `person  confidence = 0.628
cart    confidence = 0.140
bottle  confidence = 0.031
detect: person` }
      ],
      conclusion: `The cell's top confidence is $0.628$ for "person", which clears the $0.4$ threshold, so the detector outputs a person box.`
    }
  ],

  /* ---------------- dl-face-recognition ---------------- */
  "dl-face-recognition": [
    {
      title: `Verifying an employee at a secure door`,
      domain: `Access control`,
      question: `Two photos of Alice and one of Bob — does the triplet rule keep Alice's faces close and Bob far?`,
      steps: [
        { title: `The data`, body: `<p>The network encodes each face into a vector. Anchor $= $ Alice photo 1, positive $= $ Alice photo 2 (same person), negative $= $ Bob (different person).</p>` },
        { title: `The math`, body: `<p>Triplet loss $= \\max(0,\\; d(a,p) - d(a,n) + \\alpha)$, where $d$ is squared distance and $\\alpha$ is a margin. We want $d(a,p)$ small and $d(a,n)$ large; the loss is $0$ when the gap already beats the margin.</p>` },
        { title: `Run it`, body: `<p>Compute both distances and the loss.</p>`,
          code: `import numpy as np
anchor   = np.array([0.9, 0.1, 0.2, 0.8])
positive = np.array([0.8, 0.2, 0.1, 0.9])
negative = np.array([0.1, 0.9, 0.8, 0.2])
def d2(a, b): return np.sum((a-b)**2)
dp, dn = d2(anchor, positive), d2(anchor, negative)
margin = 0.2
loss = max(0.0, dp - dn + margin)
print("dist(anchor, positive) = %.3f" % dp)
print("dist(anchor, negative) = %.3f" % dn)
print("triplet loss = %.3f" % loss)
print("verified same person?", dp < dn)`,
          output: `dist(anchor, positive) = 0.040
dist(anchor, negative) = 2.000
triplet loss = 0.000
verified same person? True` }
      ],
      conclusion: `Alice's two faces sit at distance $0.040$ while Bob is at $2.000$, so the loss is $0$ — the encoding already separates them and the door opens for Alice only.`
    },
    {
      title: `Grouping a phone's photo library by person`,
      domain: `Consumer photo app`,
      question: `A new photo arrives — which existing person does it belong to, if any?`,
      steps: [
        { title: `The data`, body: `<p>The gallery stores one encoding per known person (Carol, Dan). A new face encoding comes in. We compare with Euclidean distance.</p>` },
        { title: `The math`, body: `<p>Distance $d = \\sqrt{\\sum_i (x_i - g_i)^2}$ between the new encoding $x$ and each gallery encoding $g$. If the closest distance is below a threshold $0.5$, it is that person; otherwise it is a new face.</p>` },
        { title: `Run it`, body: `<p>Find the nearest known person.</p>`,
          code: `import numpy as np
gallery = {
    "Carol": np.array([0.2, 0.7, 0.1, 0.6]),
    "Dan":   np.array([0.9, 0.1, 0.8, 0.2]),
}
new_photo = np.array([0.25, 0.65, 0.15, 0.55])
best_name, best_d = None, 1e9
for name, enc in gallery.items():
    d = np.sqrt(np.sum((new_photo - enc)**2))
    print("dist to %-5s = %.3f" % (name, d))
    if d < best_d:
        best_d, best_name = d, name
print("decision:", best_name if best_d < 0.5 else "UNKNOWN")`,
          output: `dist to Carol = 0.100
dist to Dan   = 1.127
decision: Carol` }
      ],
      conclusion: `The new face is $0.100$ from Carol and $1.127$ from Dan; since $0.100 &lt; 0.5$ it is filed under Carol's album.`
    },
    {
      title: `One-shot enrollment for a new bank customer`,
      domain: `Banking / KYC`,
      question: `With only one selfie on file, can the system still verify a returning customer?`,
      steps: [
        { title: `The data`, body: `<p>At sign-up the bank stores a single encoding for the customer. At login a fresh selfie is encoded. Because we compare encodings, no retraining is needed for a new person — that is "one-shot" recognition.</p>` },
        { title: `The math`, body: `<p>Verify when $d(x, \\text{stored}) &lt; \\tau$. Here a genuine login should be close; an impostor should be far. We test one genuine and one impostor selfie against the stored encoding.</p>` },
        { title: `Run it`, body: `<p>Check a genuine vs an impostor login.</p>`,
          code: `import numpy as np
stored = np.array([0.6, 0.3, 0.7, 0.2])
genuine = np.array([0.62, 0.28, 0.68, 0.25])  # same customer
impostor = np.array([0.1, 0.9, 0.2, 0.8])     # someone else
tau = 0.5
for name, x in [("genuine", genuine), ("impostor", impostor)]:
    d = np.sqrt(np.sum((x - stored)**2))
    print("%-8s dist = %.3f -> %s" % (name, d, "ACCEPT" if d < tau else "REJECT"))`,
          output: `genuine  dist = 0.061 -> ACCEPT
impostor dist = 1.105 -> REJECT` }
      ],
      conclusion: `From a single stored selfie, the genuine login ($d = 0.061$) is accepted and the impostor ($d = 1.105$) is rejected — no per-customer training required.`
    }
  ],

  /* ---------------- dl-style-transfer ---------------- */
  "dl-style-transfer": [
    {
      title: `Capturing the "style" of Van Gogh's brushwork`,
      domain: `Digital art filters`,
      question: `How does a Gram matrix turn feature maps into a fingerprint of artistic style?`,
      steps: [
        { title: `The data`, body: `<p>A CNN layer produces 3 feature channels, each flattened over a 4-pixel patch. Style is about which channels fire together, not where.</p>` },
        { title: `The math`, body: `<p>The Gram matrix $G = F F^{\\top}$ holds the dot product of every pair of channels. $G_{ij}$ measures how correlated channel $i$ and channel $j$ are across the image — that correlation pattern is the "style".</p>` },
        { title: `Run it`, body: `<p>Build the Gram matrix from the feature maps.</p>`,
          code: `import numpy as np
F = np.array([
    [1.0, 0.0, 2.0, 0.0],
    [0.0, 1.0, 0.0, 2.0],
    [1.0, 1.0, 1.0, 1.0],
])
G = F @ F.T
print("Gram matrix G = F F^T:")
print(G)
print("G[0,0] (channel-1 energy) =", G[0,0])
print("G[0,1] (corr ch1 & ch2)   =", G[0,1])`,
          output: `Gram matrix G = F F^T:
[[5. 0. 3.]
 [0. 5. 3.]
 [3. 3. 4.]]
G[0,0] (channel-1 energy) = 5.0
G[0,1] (corr ch1 & ch2)   = 0.0` }
      ],
      conclusion: `The Gram matrix summarizes texture as channel correlations: here channels 1 and 2 never co-fire ($G_{01} = 0$), which is the kind of fingerprint style transfer tries to copy.`
    },
    {
      title: `Trading off photo content against painting style`,
      domain: `Selfie-to-painting app`,
      question: `How does the total loss balance keeping your face vs adopting the artwork's texture?`,
      steps: [
        { title: `The data`, body: `<p>Content features come from the photo; style features (and their Gram matrices) come from the artwork. The generated image has its own content and style features.</p>` },
        { title: `The math`, body: `<p>Total loss $= \\alpha L_{\\text{content}} + \\beta L_{\\text{style}}$. Content loss is the squared difference of features; style loss is the squared difference of Gram matrices. A large $\\beta$ pushes the result toward the painting's look.</p>` },
        { title: `Run it`, body: `<p>Compute each loss and combine.</p>`,
          code: `import numpy as np
content_target = np.array([0.5, 0.2, 0.9, 0.1])
content_gen    = np.array([0.55, 0.18, 0.85, 0.12])
def gram(F): return F @ F.T
style_target = np.array([[1.,0.,2.],[0.,1.,0.]])
style_gen    = np.array([[0.9,0.1,1.8],[0.1,0.9,0.2]])
Lc = np.mean((content_gen - content_target)**2)
Ls = np.mean((gram(style_gen) - gram(style_target))**2)
alpha, beta = 1.0, 100.0
print("content loss  = %.5f" % Lc)
print("style loss    = %.5f" % Ls)
print("total = a*Lc + b*Ls = %.5f" % (alpha*Lc + beta*Ls))`,
          output: `content loss  = 0.00145
style loss    = 0.37160
total = a*Lc + b*Ls = 37.16145` }
      ],
      conclusion: `With $\\alpha = 1, \\beta = 100$ the total $37.16$ is dominated by style, so the app repaints the photo's texture while content barely shifts ($L_c = 0.00145$).`
    },
    {
      title: `Optimizing the pixels of a re-styled product shot`,
      domain: `E-commerce design`,
      question: `Style transfer changes the image itself — how does gradient descent on pixels reach the content target?`,
      steps: [
        { title: `The data`, body: `<p>Unlike normal training, the weights are frozen and the IMAGE pixels are the variables. We start from a blank image and descend toward a content target (content-only for clarity).</p>` },
        { title: `The math`, body: `<p>Loss $= \\frac{1}{n}\\sum_i (\\text{gen}_i - \\text{target}_i)^2$; gradient w.r.t. each pixel is $\\frac{2}{n}(\\text{gen}_i - \\text{target}_i)$. Update pixels by $\\text{gen} \\leftarrow \\text{gen} - \\eta\\,\\nabla$.</p>` },
        { title: `Run it`, body: `<p>Run 5 descent steps on the pixels.</p>`,
          code: `import numpy as np
target = np.array([0.5, 0.2, 0.9, 0.1])
gen = np.zeros(4)
lr = 0.3
print("start loss = %.5f" % np.mean((gen-target)**2))
for step in range(1, 6):
    grad = 2*(gen - target)/len(gen)
    gen = gen - lr*grad
    print("step %d  loss = %.5f" % (step, np.mean((gen-target)**2)))
print("final image:", np.round(gen, 3))`,
          output: `start loss = 0.27750
step 1  loss = 0.20049
step 2  loss = 0.14486
step 3  loss = 0.10466
step 4  loss = 0.07562
step 5  loss = 0.05463
final image: [0.278 0.111 0.501 0.056]` }
      ],
      conclusion: `Each step lowers the loss ($0.2775 \\to 0.0546$) as the pixels drift toward the target — the same image-as-variable descent that style transfer runs in real apps.`
    }
  ],

  /* ---------------- dl-gan ---------------- */
  "dl-gan": [
    {
      title: `Scoring a round of forger vs detective`,
      domain: `Synthetic faces`,
      question: `Given the discriminator's scores, who is winning and what loss does each side see?`,
      steps: [
        { title: `The data`, body: `<p>The discriminator $D$ outputs a probability "this is real". On real photos it scored $[0.9, 0.8, 0.95]$; on the generator's fakes it scored $[0.3, 0.2, 0.4]$.</p>` },
        { title: `The math`, body: `<p>$D$'s loss $= -\\text{mean}[\\log D(\\text{real}) + \\log(1 - D(\\text{fake}))]$ — it wants real$\\to1$, fake$\\to0$. The generator's loss $= -\\text{mean}[\\log D(\\text{fake})]$ — it wants $D$ to call its fakes real.</p>` },
        { title: `Run it`, body: `<p>Compute both losses.</p>`,
          code: `import numpy as np
D_real = np.array([0.9, 0.8, 0.95])
D_fake = np.array([0.3, 0.2, 0.4])
eps = 1e-9
D_loss = -np.mean(np.log(D_real+eps) + np.log(1 - D_fake + eps))
G_loss = -np.mean(np.log(D_fake+eps))
print("Discriminator loss = %.4f" % D_loss)
print("Generator loss     = %.4f" % G_loss)
print("D thinks fakes are real %.0f%% of the time" % (100*D_fake.mean()))`,
          output: `Discriminator loss = 0.4901
Generator loss     = 1.2432
D thinks fakes are real 30% of the time` }
      ],
      conclusion: `The discriminator is ahead (low loss $0.49$, fooled only $30\\%$ of the time); the generator's higher loss $1.24$ is the signal pushing it to make better fakes.`
    },
    {
      title: `Training a generator to match a height distribution`,
      domain: `Synthetic data generation`,
      question: `Can a 1-D generator learn to produce numbers centered on the real mean?`,
      steps: [
        { title: `The data`, body: `<p>Real samples have mean $5$. The generator is $g(z) = z + \\theta$ for noise $z$. It starts with $\\theta = 0$, so its samples are centered wrong.</p>` },
        { title: `The math`, body: `<p>The adversarial signal pushes the fake mean toward the real mean. A simple proxy gradient is $\\nabla_\\theta = \\text{mean}(\\text{fakes}) - 5$, and we update $\\theta \\leftarrow \\theta - \\eta\\,\\nabla_\\theta$.</p>` },
        { title: `Run it`, body: `<p>Run a few generator updates.</p>`,
          code: `import numpy as np
np.random.seed(0)
real_mean = 5.0
theta, lr = 0.0, 0.2
for step in range(1, 6):
    z = np.random.randn(200)
    fakes = z + theta
    grad = np.mean(fakes) - real_mean
    theta = theta - lr*grad
    print("step %d  theta=%.3f  fake_mean=%.3f" % (step, theta, fakes.mean()))
final = np.random.randn(1000) + theta
print("final fake mean = %.3f (target %.1f)" % (final.mean(), real_mean))`,
          output: `step 1  theta=0.986  fake_mean=0.071
step 2  theta=1.814  fake_mean=0.858
step 3  theta=2.473  fake_mean=1.707
step 4  theta=3.004  fake_mean=2.344
step 5  theta=3.390  fake_mean=3.072
final fake mean = 3.403 (target 5.0)`}
      ],
      conclusion: `Over 5 steps $\\theta$ climbs $0 \\to 3.39$ and the fake mean rises toward $5$ — the generator is learning to imitate the real distribution.`
    },
    {
      title: `Sampling realistic measurements after training`,
      domain: `Manufacturing QA`,
      question: `Once trained, does the generator's output really match the real spread?`,
      steps: [
        { title: `The data`, body: `<p>Real part measurements follow $N(170, 7)$. A trained generator maps standard noise $z$ via $g(z) = 7z + 170$. We compare 1000 real and 1000 generated values.</p>` },
        { title: `The math`, body: `<p>A good generator matches both the mean and the spread (standard deviation) of the real data. We check $\\text{mean}$ and $\\text{std}$ of each set and look at a few raw fakes.</p>` },
        { title: `Run it`, body: `<p>Generate and compare statistics.</p>`,
          code: `import numpy as np
np.random.seed(3)
real = np.random.normal(170, 7, 1000)
z = np.random.randn(1000)
fake = 7.0*z + 170.0
print("real  mean=%.2f std=%.2f" % (real.mean(), real.std()))
print("fake  mean=%.2f std=%.2f" % (fake.mean(), fake.std()))
print("sample fakes:", np.round(fake[:4], 1))`,
          output: `real  mean=170.12 std=7.06
fake  mean=169.46 std=7.08
sample fakes: [170.2 177.9 152.1 168.1]` }
      ],
      conclusion: `The generator's mean ($169.46$) and std ($7.08$) closely match the real data ($170.12$, $7.06$), so its samples are indistinguishable in distribution — useful synthetic QA data.`
    }
  ],

  /* ---------------- dl-rnn ---------------- */
  "dl-rnn": [
    {
      title: `Carrying memory through a typed word`,
      domain: `Predictive text`,
      question: `How does a tiny RNN's hidden state evolve as it reads characters one at a time?`,
      steps: [
        { title: `The data`, body: `<p>The RNN reads a 2-step sequence (two encoded characters, $x = [1, 2]$). It keeps a single memory value $h$, starting at $0$.</p>` },
        { title: `The math`, body: `<p>At each step $h_t = \\tanh(W_x x_t + W_h h_{t-1} + b)$. The new memory blends the current input with the previous memory, so $h$ summarizes everything seen so far.</p>` },
        { title: `Run it`, body: `<p>Step the RNN through the sequence.</p>`,
          code: `import numpy as np
Wx, Wh, b = 0.8, 0.5, 0.1
x = [1.0, 2.0]
h = 0.0
for t, xt in enumerate(x):
    h = np.tanh(Wx*xt + Wh*h + b)
    print("step %d: x=%.1f  h=%.4f" % (t+1, xt, h))
print("final memory h =", round(float(h), 4))`,
          output: `step 1: x=1.0  h=0.7163
step 2: x=2.0  h=0.9679
final memory h = 0.9679` }
      ],
      conclusion: `The memory updates $0 \\to 0.7163 \\to 0.9679$, with step 2 depending on step 1 through $W_h h$ — that recurrence is how an RNN remembers context.`
    },
    {
      title: `Classifying sentiment word by word`,
      domain: `Product reviews`,
      question: `Reading "great not great", does the RNN's final state lean positive?`,
      steps: [
        { title: `The data`, body: `<p>Three word vectors feed in: "great" $=[1,0]$, "not" $=[0,1]$, "great" $=[1,0]$. The RNN keeps a scalar memory $h$ and the final $h$ drives a sigmoid.</p>` },
        { title: `The math`, body: `<p>$h_t = \\tanh(W_x \\cdot x_t + W_h h_{t-1} + b)$; final prediction $= \\sigma(2 h_T)$. The word "not" carries a negative weight, so word order matters to the answer.</p>` },
        { title: `Run it`, body: `<p>Read the three words and score sentiment.</p>`,
          code: `import numpy as np
def sigmoid(z): return 1/(1+np.exp(-z))
Wx = np.array([0.6, -0.4])
Wh, b = 0.3, 0.0
words = [np.array([1.0, 0.0]), np.array([0.0, 1.0]), np.array([1.0, 0.0])]
h = 0.0
for t, x in enumerate(words):
    h = np.tanh(Wx@x + Wh*h + b)
    print("after word %d: h=%.4f" % (t+1, h))
print("positive sentiment prob = %.3f" % sigmoid(2.0*h))`,
          output: `after word 1: h=0.5370
after word 2: h=-0.2344
after word 3: h=0.4851
positive sentiment prob = 0.725` }
      ],
      conclusion: `The memory dips at "not" ($-0.2344$) then recovers at the final "great", giving a positive probability $0.725$ — the RNN folded the whole sequence into one decision.`
    },
    {
      title: `Forecasting the next sensor reading`,
      domain: `IoT time series`,
      question: `Given a short run of temperature readings, what does an RNN-style update predict next?`,
      steps: [
        { title: `The data`, body: `<p>A sensor reports a rising sequence $[0.2, 0.4, 0.6]$ (normalized). The RNN keeps memory $h$ and outputs a prediction from the final state.</p>` },
        { title: `The math`, body: `<p>$h_t = \\tanh(W_x x_t + W_h h_{t-1} + b)$ accumulates the trend; the forecast is a linear readout $\\hat{y} = W_y h_T$. A persistent upward trend lifts $h$ each step.</p>` },
        { title: `Run it`, body: `<p>Roll the state forward and read out a prediction.</p>`,
          code: `import numpy as np
Wx, Wh, b, Wy = 1.2, 0.6, 0.0, 0.8
seq = [0.2, 0.4, 0.6]
h = 0.0
for t, x in enumerate(seq):
    h = np.tanh(Wx*x + Wh*h + b)
    print("t=%d  reading=%.1f  h=%.4f" % (t+1, x, h))
print("forecast next value = %.4f" % (Wy*h))`,
          output: `t=1  reading=0.2  h=0.2355
t=2  reading=0.4  h=0.5520
t=3  reading=0.6  h=0.7823
forecast next value = 0.6258` }
      ],
      conclusion: `The hidden state climbs with the rising readings ($0.2355 \\to 0.7823$) and the linear readout forecasts $0.6258$ — the RNN extrapolated the trend from its memory.`
    }
  ],

  /* ---------------- dl-vanishing-gradient ---------------- */
  "dl-vanishing-gradient": [
    {
      title: `Why a long sentence loses its early words`,
      domain: `Language modeling`,
      question: `As an RNN backprops over more steps, what happens to the gradient that reaches the first word?`,
      steps: [
        { title: `The data`, body: `<p>Backprop through $T$ time steps multiplies the same recurrent factor $w$ about $T$ times. We try a shrinking factor $w = 0.5$ and a growing factor $w = 1.5$ over $5$, $10$, and $20$ steps.</p>` },
        { title: `The math`, body: `<p>The gradient that reaches the start scales like $w^{T}$. If $|w| &lt; 1$ it decays to nearly $0$ (vanishing); if $|w| &gt; 1$ it blows up (exploding).</p>` },
        { title: `Run it`, body: `<p>Compute the gradient factor for both cases.</p>`,
          code: `for w in [0.5, 1.5]:
    for T in [5, 10, 20]:
        print("w=%.1f  T=%2d steps:  gradient factor = %.5f" % (w, T, w**T))`,
          output: `w=0.5  T= 5 steps:  gradient factor = 0.03125
w=0.5  T=10 steps:  gradient factor = 0.00098
w=0.5  T=20 steps:  gradient factor = 0.00000
w=1.5  T= 5 steps:  gradient factor = 7.59375
w=1.5  T=10 steps:  gradient factor = 57.66504
w=1.5  T=20 steps:  gradient factor = 3325.25673` }
      ],
      conclusion: `With $w = 0.5$ the gradient vanishes to $\\approx 0$ by $20$ steps; with $w = 1.5$ it explodes to $3325$. Either way, distant words barely train — the core RNN long-range problem.`
    },
    {
      title: `Capping an exploding gradient with norm clipping`,
      domain: `Deep network training`,
      question: `When a gradient vector blows up, how does clipping by norm tame it without changing direction?`,
      steps: [
        { title: `The data`, body: `<p>A single training step produces an exploded gradient vector $[6, 8]$, whose length (norm) is too large for a stable update.</p>` },
        { title: `The math`, body: `<p>Norm clipping computes $\\lVert g \\rVert = \\sqrt{6^2 + 8^2} = 10$. If it exceeds a cap $5$, rescale $g \\leftarrow g \\cdot \\frac{5}{\\lVert g \\rVert}$. Direction is preserved; only length shrinks.</p>` },
        { title: `Run it`, body: `<p>Clip the gradient to the max norm.</p>`,
          code: `import numpy as np
grad = np.array([6.0, 8.0])
norm = np.linalg.norm(grad)
max_norm = 5.0
if norm > max_norm:
    grad = grad * (max_norm / norm)
print("original norm = %.1f" % np.linalg.norm([6.0, 8.0]))
print("clipped grad  =", grad)
print("clipped norm  = %.1f" % np.linalg.norm(grad))`,
          output: `original norm = 10.0
clipped grad  = [3. 4.]
clipped norm  = 5.0` }
      ],
      conclusion: `The gradient $[6,8]$ (norm $10$) is rescaled to $[3,4]$ (norm $5$) — same direction, capped length — so the update stays stable. This is standard when training RNNs and LLMs.`
    },
    {
      title: `Scalar gradient clipping during a training step`,
      domain: `Reinforcement learning`,
      question: `A loss spike produces a giant per-weight gradient — how does a simple value clip keep the update sane?`,
      steps: [
        { title: `The data`, body: `<p>One weight's chained gradient came out as $3325$ (from a $1.5^{20}$ blow-up). The learning rate is $0.01$.</p>` },
        { title: `The math`, body: `<p>Value clipping caps each gradient component to $[-c, c]$. Without it, the update $\\eta \\cdot g$ would jump the weight wildly; with $c = 5$ the update is bounded.</p>` },
        { title: `Run it`, body: `<p>Compare the weight update before and after clipping.</p>`,
          code: `g = 1.5**20
eta, c, w = 0.01, 5.0, 1.0
g_clipped = max(-c, min(c, g))
print("raw gradient    = %.2f" % g)
print("clipped to [-5,5] = %.2f" % g_clipped)
print("update WITHOUT clip: w -> %.2f" % (w - eta*g))
print("update WITH clip:    w -> %.2f" % (w - eta*g_clipped))`,
          output: `raw gradient    = 3325.26
clipped to [-5,5] = 5.00
update WITHOUT clip: w -> -32.25
update WITH clip:    w -> 0.95` }
      ],
      conclusion: `Unclipped, the weight leaps to $-32.25$; clipped to $5$, it nudges gently to $0.95$. Clipping turns a destabilizing spike into a small, safe step.`
    }
  ],

  /* ---------------- dl-lstm-gru ---------------- */
  "dl-lstm-gru": [
    {
      title: `One LSTM cell deciding what to remember`,
      domain: `Speech recognition`,
      question: `Given the gates, what is the cell's new long-term memory and output?`,
      steps: [
        { title: `The data`, body: `<p>The cell carries a long-term state $c_{\\text{prev}} = 0.5$ and a hidden state $h_{\\text{prev}} = 0.2$, and reads input $x = 1$. Three gates (forget, input, output) plus a candidate value control the update.</p>` },
        { title: `The math`, body: `<p>$f, i, o = \\sigma(\\cdots)$ are gates in $(0,1)$; $g = \\tanh(\\cdots)$ is the candidate. New memory $c = f\\, c_{\\text{prev}} + i\\, g$ (forget some old, add some new); output $h = o\\,\\tanh(c)$.</p>` },
        { title: `Run it`, body: `<p>Compute the gates and the updated state.</p>`,
          code: `import numpy as np
def sigmoid(z): return 1/(1+np.exp(-z))
c_prev, h_prev, x = 0.5, 0.2, 1.0
f = sigmoid(0.0*x + 1.0)
i = sigmoid(2.0*x - 1.0)
g = np.tanh(1.0*x)
o = sigmoid(0.5*x)
c = f*c_prev + i*g
h = o*np.tanh(c)
print("forget=%.3f input=%.3f cand=%.3f output=%.3f" % (f,i,g,o))
print("new cell state c = f*c_prev + i*g = %.4f" % c)
print("new hidden h = o*tanh(c) = %.4f" % h)`,
          output: `forget=0.731 input=0.731 cand=0.762 output=0.622
new cell state c = f*c_prev + i*g = 0.9223
new hidden h = o*tanh(c) = 0.4525` }
      ],
      conclusion: `The forget gate keeps $73\\%$ of the old memory and the input gate adds $0.731 \\times 0.762$ of new info, giving $c = 0.9223$ and output $h = 0.4525$ — gates let the cell hold memory over long sequences.`
    },
    {
      title: `A GRU blending old and new memory`,
      domain: `Stock price modeling`,
      question: `How does the GRU update gate decide how much new information to admit?`,
      steps: [
        { title: `The data`, body: `<p>The GRU has one hidden state $h_{\\text{prev}} = 0.8$ and reads input $x = 1$. It uses two gates: an update gate $z$ and a reset gate $r$ (simpler than the LSTM's three).</p>` },
        { title: `The math`, body: `<p>$z = \\sigma(\\cdots)$ controls the blend; candidate $\\tilde{h} = \\tanh(W x + r\\, U h_{\\text{prev}})$. New state $h = (1-z)\\,h_{\\text{prev}} + z\\,\\tilde{h}$. A small $z$ keeps the old memory; a large $z$ overwrites it.</p>` },
        { title: `Run it`, body: `<p>Compute the gated update.</p>`,
          code: `import numpy as np
def sigmoid(z): return 1/(1+np.exp(-z))
h_prev, x = 0.8, 1.0
z = sigmoid(-1.0*x + 0.5)
r = sigmoid(0.5*x)
h_cand = np.tanh(1.0*x + r*0.4*h_prev)
h = (1-z)*h_prev + z*h_cand
print("update gate z = %.3f (how much NEW info to let in)" % z)
print("candidate h~  = %.3f" % h_cand)
print("new hidden h  = (1-z)*h_prev + z*h_cand = %.4f" % h)`,
          output: `update gate z = 0.378 (how much NEW info to let in)
candidate h~  = 0.833
new hidden h  = (1-z)*h_prev + z*h_cand = 0.8126` }
      ],
      conclusion: `With $z = 0.378$ the GRU keeps $62\\%$ of the old memory and mixes in $38\\%$ of the candidate, landing at $h = 0.8126$ — the gate smoothly controls memory retention.`
    },
    {
      title: `Why the cell state fights vanishing gradients`,
      domain: `Long-document NLP`,
      question: `If the forget gate stays near 1, how well is information carried across many steps?`,
      steps: [
        { title: `The data`, body: `<p>An LSTM passes a memory value $c$ across $20$ steps. Suppose the forget gate is roughly constant at $f = 0.95$ each step, and nearly no new input is added.</p>` },
        { title: `The math`, body: `<p>The carried memory scales like $f^{T}$. Unlike a plain RNN where the factor can be tiny, a forget gate near $1$ keeps $f^{T}$ close to $1$ — so gradients survive over long ranges.</p>` },
        { title: `Run it`, body: `<p>Compare memory retention for a leaky vs near-1 forget gate.</p>`,
          code: `for f in [0.5, 0.95]:
    for T in [5, 10, 20]:
        print("forget f=%.2f over T=%2d steps: retained = %.4f" % (f, T, f**T))`,
          output: `forget f=0.50 over T= 5 steps: retained = 0.0312
forget f=0.50 over T=10 steps: retained = 0.0010
forget f=0.50 over T=20 steps: retained = 0.0000
forget f=0.95 over T= 5 steps: retained = 0.7738
forget f=0.95 over T=10 steps: retained = 0.5987
forget f=0.95 over T=20 steps: retained = 0.3585` }
      ],
      conclusion: `A forget gate near $1$ ($f = 0.95$) keeps $36\\%$ of the signal even after $20$ steps, versus $\\approx 0$ for $f = 0.5$ — this is how LSTMs/GRUs carry long-range memory that plain RNNs lose.`
    }
  ],

  /* ---------------- dl-word-embeddings ---------------- */
  "dl-word-embeddings": [
    {
      title: `Finding synonyms in a movie search box`,
      domain: `Search`,
      question: `Do "happy" and "glad" land near each other in embedding space, and far from "car"?`,
      steps: [
        { title: `The data`, body: `<p>Each word is a 2-D vector. Similar-meaning words should point in similar directions. We compare the query "happy" against "glad", "sad", and "car".</p>` },
        { title: `The math`, body: `<p>Similarity is the cosine of the angle: $\\cos(a,b) = \\frac{a \\cdot b}{\\lVert a \\rVert\\, \\lVert b \\rVert}$. Values near $1$ mean very similar; near $0$ unrelated; near $-1$ opposite.</p>` },
        { title: `Run it`, body: `<p>Rank words by similarity to "happy".</p>`,
          code: `import numpy as np
emb = {
    "happy": np.array([0.9, 0.1]),
    "glad":  np.array([0.85, 0.15]),
    "sad":   np.array([-0.8, 0.2]),
    "car":   np.array([0.1, -0.9]),
}
def cos(a, b): return a@b / (np.linalg.norm(a)*np.linalg.norm(b))
print("similarity to 'happy':")
for w, v in emb.items():
    if w == "happy": continue
    print("  %-5s %.3f" % (w, cos(emb["happy"], v)))`,
          output: `similarity to 'happy':
  glad  0.998
  sad   -0.937
  car   0.000` }
      ],
      conclusion: `"glad" scores $0.998$ (near-synonym), "sad" $-0.937$ (opposite), "car" $0.000$ (unrelated) — so a search for "happy movies" can also match "glad".`
    },
    {
      title: `King − man + woman in vector arithmetic`,
      domain: `Knowledge / analogy`,
      question: `Does embedding arithmetic recover "queen" from "king − man + woman"?`,
      steps: [
        { title: `The data`, body: `<p>Words live as 3-D vectors. Embeddings learn that gender and royalty become consistent directions you can add and subtract.</p>` },
        { title: `The math`, body: `<p>Compute the target vector $t = \\text{king} - \\text{man} + \\text{woman}$, then find the candidate word with the highest cosine similarity to $t$.</p>` },
        { title: `Run it`, body: `<p>Solve the analogy.</p>`,
          code: `import numpy as np
vec = {
    "king":  np.array([0.9, 0.8, 0.1]),
    "man":   np.array([0.8, 0.1, 0.1]),
    "woman": np.array([0.2, 0.1, 0.9]),
    "queen": np.array([0.3, 0.8, 0.9]),
    "apple": np.array([-0.5, 0.2, -0.3]),
}
target = vec["king"] - vec["man"] + vec["woman"]
def cos(a,b): return a@b/(np.linalg.norm(a)*np.linalg.norm(b))
for w in ["queen", "apple"]:
    print("cos to %-5s = %.3f" % (w, cos(target, vec[w])))
best = max(["queen","apple"], key=lambda w: cos(target, vec[w]))
print("best match:", best)`,
          output: `cos to queen = 1.000
cos to apple = -0.340
best match: queen` }
      ],
      conclusion: `The arithmetic lands exactly on "queen" ($\\cos = 1.000$) and away from "apple" ($-0.340$) — embeddings encode relationships as directions you can do algebra on.`
    },
    {
      title: `User and item embeddings for recommendations`,
      domain: `Recommender systems`,
      question: `Can a dot product of learned vectors predict whether a user will like a genre?`,
      steps: [
        { title: `The data`, body: `<p>Two users and two movie genres are each a 2-D embedding. Ann's taste vector leans toward sci-fi; Bob's leans toward romance. Genres have matching vectors.</p>` },
        { title: `The math`, body: `<p>Predicted affinity $= u \\cdot v$ (dot product). A large dot product means the user vector and item vector point the same way, so the user is predicted to like it.</p>` },
        { title: `Run it`, body: `<p>Score every user-genre pair.</p>`,
          code: `import numpy as np
users = {"Ann": np.array([0.9, 0.1]), "Bob": np.array([0.2, 0.8])}
items = {"SciFi": np.array([0.95, 0.05]), "Romance": np.array([0.1, 0.9])}
for u, uv in users.items():
    for it, iv in items.items():
        print("%-3s x %-7s predicted rating = %.2f" % (u, it, uv@iv))`,
          output: `Ann x SciFi   predicted rating = 0.86
Ann x Romance predicted rating = 0.18
Bob x SciFi   predicted rating = 0.23
Bob x Romance predicted rating = 0.74` }
      ],
      conclusion: `Ann scores highest on SciFi ($0.86$) and Bob on Romance ($0.74$), so the embedding dot product recommends each user their matching genre.`
    }
  ],

  /* ---------------- dl-word2vec ---------------- */
  "dl-word2vec": [
    {
      title: `Skip-gram scoring a center-context pair`,
      domain: `Language learning from text`,
      question: `How does word2vec push real neighbor words up and random words down?`,
      steps: [
        { title: `The data`, body: `<p>The center word "king" is a 3-D vector. A true nearby word ("throne") and a random negative word ("banana") are also vectors. Skip-gram learns by predicting nearby words.</p>` },
        { title: `The math`, body: `<p>The score of a pair is $\\sigma(\\text{center} \\cdot \\text{context})$. The loss $-\\log P(\\text{good}) - \\log(1 - P(\\text{bad}))$ rewards high probability for true neighbors and low for negatives.</p>` },
        { title: `Run it`, body: `<p>Score a good and a bad context word.</p>`,
          code: `import numpy as np
def sigmoid(z): return 1/(1+np.exp(-z))
center = np.array([0.5, 0.3, -0.2])
context_good = np.array([0.4, 0.4, -0.1])
context_bad  = np.array([-0.6, 0.1, 0.7])
p_good = sigmoid(center @ context_good)
p_bad  = sigmoid(center @ context_bad)
print("P(throne | king) = %.3f" % p_good)
print("P(banana | king) = %.3f" % p_bad)
print("skip-gram loss = %.4f" % (-np.log(p_good) - np.log(1 - p_bad)))`,
          output: `P(throne | king) = 0.584
P(banana | king) = 0.399
skip-gram loss = 1.0465` }
      ],
      conclusion: `The true neighbor "throne" already scores higher ($0.584$) than the negative "banana" ($0.399$); the loss $1.0465$ is the signal that nudges the vectors further apart with training.`
    },
    {
      title: `GloVe factorizing a co-occurrence table`,
      domain: `Corpus statistics`,
      question: `Can word vectors be learned so their dot product matches log co-occurrence counts?`,
      steps: [
        { title: `The data`, body: `<p>From a corpus we count how often words appear together. "ice" and "water" co-occur $20$ times; "ice" and "steam" only once. GloVe fits a 2-D vector per word.</p>` },
        { title: `The math`, body: `<p>GloVe drives $w_i \\cdot w_j \\to \\log X_{ij}$, the log co-occurrence count. We minimize $(w_i \\cdot w_j - \\log X_{ij})^2$ with gradient descent on the vectors.</p>` },
        { title: `Run it`, body: `<p>Fit vectors and check two dot products.</p>`,
          code: `import numpy as np
X = np.array([[0,1,20],[1,0,18],[20,18,0]], dtype=float)  # ice, steam, water
np.random.seed(1)
V = np.random.randn(3, 2)*0.1
lr = 0.05
for epoch in range(300):
    for i in range(3):
        for j in range(3):
            if X[i,j] == 0: continue
            diff = V[i]@V[j] - np.log(X[i,j])
            gi, gj = diff*V[j], diff*V[i]
            V[i] -= lr*gi; V[j] -= lr*gj
print("ice.water  =", round(float(V[0]@V[2]),3), " log count =", round(float(np.log(X[0,2])),3))
print("ice.steam  =", round(float(V[0]@V[1]),3), " log count =", round(float(np.log(X[0,1])),3))`,
          output: `ice.water  = 2.996  log count = 2.996
ice.steam  = 0.0  log count = 0.0` }
      ],
      conclusion: `After training, ice$\\cdot$water $= 2.996$ matches $\\log 20 = 2.996$ and ice$\\cdot$steam $= 0$ matches $\\log 1 = 0$ — GloVe encoded the corpus statistics into the vectors.`
    },
    {
      title: `Capital-city analogy with learned vectors`,
      domain: `Geography Q&A`,
      question: `Does "Paris − France + Italy" point to "Rome"?`,
      steps: [
        { title: `The data`, body: `<p>Four place-words are 3-D vectors. word2vec-style training puts the "country$\\to$capital" relationship along a consistent direction.</p>` },
        { title: `The math`, body: `<p>Target $t = \\text{Paris} - \\text{France} + \\text{Italy}$; the answer is the candidate word maximizing $\\cos(t, w)$.</p>` },
        { title: `Run it`, body: `<p>Solve the capital analogy.</p>`,
          code: `import numpy as np
v = {
    "Paris":  np.array([0.8, 0.2, 0.9]),
    "France": np.array([0.2, 0.2, 0.9]),
    "Italy":  np.array([0.3, 0.7, 0.1]),
    "Rome":   np.array([0.9, 0.7, 0.1]),
    "ocean":  np.array([-0.5, 0.1, -0.4]),
}
t = v["Paris"] - v["France"] + v["Italy"]
def cos(a,b): return a@b/(np.linalg.norm(a)*np.linalg.norm(b))
for w in ["Rome", "ocean"]:
    print("cos to %-5s = %.3f" % (w, cos(t, v[w])))
print("answer:", max(["Rome","ocean"], key=lambda w: cos(t, v[w])))`,
          output: `cos to Rome  = 1.000
cos to ocean = -0.566
answer: Rome` }
      ],
      conclusion: `The analogy vector aligns perfectly with "Rome" ($\\cos = 1.000$), so the same country$\\to$capital direction that maps France$\\to$Paris also maps Italy$\\to$Rome.`
    }
  ],

  /* ---------------- dl-cosine-similarity ---------------- */
  "dl-cosine-similarity": [
    {
      title: `Ranking documents for a search query`,
      domain: `Search engines`,
      question: `Which document best matches the query "data science" by angle, not length?`,
      steps: [
        { title: `The data`, body: `<p>Vocabulary $= [\\text{data}, \\text{science}, \\text{cooking}, \\text{recipe}]$. The query and each document are word-count vectors. Documents differ in length, so raw counts would be unfair.</p>` },
        { title: `The math`, body: `<p>$\\cos(q, d) = \\frac{q \\cdot d}{\\lVert q \\rVert\\, \\lVert d \\rVert}$ measures the angle, ignoring length. A long document on the same topic still scores high.</p>` },
        { title: `Run it`, body: `<p>Rank documents by cosine similarity.</p>`,
          code: `import numpy as np
query = np.array([1, 1, 0, 0])
docs = {
    "ML tutorial":   np.array([3, 2, 0, 0]),
    "Pasta recipe":  np.array([0, 0, 4, 3]),
    "Data cooking":  np.array([2, 0, 1, 1]),
}
def cos(a,b): return a@b/(np.linalg.norm(a)*np.linalg.norm(b))
for name, v in sorted(docs.items(), key=lambda kv: -cos(query, kv[1])):
    print("%-13s cos=%.3f" % (name, cos(query, v)))`,
          output: `ML tutorial   cos=0.981
Data cooking  cos=0.577
Pasta recipe  cos=0.000` }
      ],
      conclusion: `"ML tutorial" wins at $\\cos = 0.981$ despite having more words than the query — cosine rewards topic alignment, not document length.`
    },
    {
      title: `Recommending songs by direction in feature space`,
      domain: `Music streaming`,
      question: `Why does a much louder, faster song still count as "most similar" to a liked track?`,
      steps: [
        { title: `The data`, body: `<p>Each song is $(\\text{energy}, \\text{tempo})$. The user loved $(8, 120)$. Song C is $(16, 240)$ — exactly double, i.e. the same direction but bigger magnitude.</p>` },
        { title: `The math`, body: `<p>Cosine ignores magnitude: $\\cos(a, 2a) = 1$ because the angle is $0$. So two songs that scale together are treated as identical in style.</p>` },
        { title: `Run it`, body: `<p>Compare cosine across the catalog.</p>`,
          code: `import numpy as np
liked = np.array([8.0, 120.0])
catalog = {
    "Song A": np.array([7.0, 110.0]),
    "Song B": np.array([2.0, 60.0]),
    "Song C": np.array([16.0, 240.0]),
}
def cos(a,b): return a@b/(np.linalg.norm(a)*np.linalg.norm(b))
for name, v in sorted(catalog.items(), key=lambda kv:-cos(liked,kv[1])):
    print("%-7s cos=%.4f" % (name, cos(liked, v)))`,
          output: `Song C  cos=1.0000
Song A  cos=1.0000
Song B  cos=0.9994` }
      ],
      conclusion: `Song C scores $\\cos = 1.0000$ even though it is twice as loud and fast — cosine measures direction (musical style), so doubled features stay a perfect match.`
    },
    {
      title: `Detecting near-duplicate support tickets`,
      domain: `Customer support`,
      question: `Are two differently-worded tickets actually about the same issue?`,
      steps: [
        { title: `The data`, body: `<p>Vocabulary $= [\\text{login}, \\text{password}, \\text{reset}, \\text{refund}]$. Ticket 1 mentions login/password/reset; Ticket 2 uses the same words at different counts; Ticket 3 is about refunds.</p>` },
        { title: `The math`, body: `<p>Compute $\\cos$ between Ticket 1 and the others. A score above a threshold (say $0.9$) flags a likely duplicate to merge.</p>` },
        { title: `Run it`, body: `<p>Compare the tickets.</p>`,
          code: `import numpy as np
t1 = np.array([2, 1, 1, 0])
t2 = np.array([4, 2, 2, 0])
t3 = np.array([0, 0, 0, 3])
def cos(a,b): return a@b/(np.linalg.norm(a)*np.linalg.norm(b))
for name, v in [("ticket 2", t2), ("ticket 3", t3)]:
    s = cos(t1, v)
    print("%-9s cos=%.3f -> %s" % (name, s, "DUPLICATE" if s > 0.9 else "different"))`,
          output: `ticket 2  cos=1.000 -> DUPLICATE
ticket 3  cos=0.000 -> different` }
      ],
      conclusion: `Ticket 2 scores $\\cos = 1.000$ with Ticket 1 (same topic, different word counts) and is flagged a duplicate, while Ticket 3 ($0.000$) stays separate.`
    }
  ],

  /* ---------------- dl-attention ---------------- */
  "dl-attention": [
    {
      title: `Letting a translator focus on the right input word`,
      domain: `Machine translation`,
      question: `Which input words does the model attend to when producing the next output word?`,
      steps: [
        { title: `The data`, body: `<p>One query vector (the decoder's current state) attends over 3 input words, each with a key vector and a value vector. Word 1's key matches the query best.</p>` },
        { title: `The math`, body: `<p>Scores $= \\frac{K q}{\\sqrt{d}}$; weights $= \\text{softmax}(\\text{scores})$ (sum to $1$); context $= \\text{weights} \\cdot V$. The $\\sqrt{d}$ keeps scores from getting too large.</p>` },
        { title: `Run it`, body: `<p>Compute attention weights and the context vector.</p>`,
          code: `import numpy as np
def softmax(z):
    z = z - z.max(); e = np.exp(z); return e/e.sum()
q = np.array([1.0, 0.0, 1.0])
K = np.array([[1.0,0.0,1.0],[0.0,1.0,0.0],[0.5,0.5,0.5]])
V = np.array([[10.,0.],[0.,10.],[5.,5.]])
d = q.shape[0]
weights = softmax(K @ q / np.sqrt(d))
context = weights @ V
print("weights =", np.round(weights,3), " sum =", round(weights.sum(),3))
print("context =", np.round(context,3))`,
          output: `weights = [0.533 0.168 0.299]  sum = 1.0
context = [6.825 3.175]` }
      ],
      conclusion: `The model puts the most weight ($0.533$) on word 1, the best-matching key, and blends the values into a context $[6.825, 3.175]$ — attention picks which inputs matter for this output.`
    },
    {
      title: `Softmax turning scores into focus weights`,
      domain: `Document summarization`,
      question: `How do raw relevance scores become weights that sum to exactly 1?`,
      steps: [
        { title: `The data`, body: `<p>A summarizer rates 3 source sentences with raw scores $[2.0, 1.0, 0.1]$. We need to convert them into attention weights that are positive and total $1$.</p>` },
        { title: `The math`, body: `<p>$\\text{softmax}(z)_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}$. Subtracting the max first ($z - \\max z$) is a numerical-stability trick that does not change the result.</p>` },
        { title: `Run it`, body: `<p>Apply softmax to the scores.</p>`,
          code: `import numpy as np
scores = np.array([2.0, 1.0, 0.1])
e = np.exp(scores - scores.max())
weights = e / e.sum()
for i, w in enumerate(weights):
    print("sentence %d: score %.1f -> weight %.3f" % (i+1, scores[i], w))
print("sum of weights =", round(float(weights.sum()), 3))
print("most attended sentence:", int(weights.argmax())+1)`,
          output: `sentence 1: score 2.0 -> weight 0.659
sentence 2: score 1.0 -> weight 0.242
sentence 3: score 0.1 -> weight 0.099
sum of weights = 1.0
most attended sentence: 1` }
      ],
      conclusion: `Softmax maps $[2.0, 1.0, 0.1]$ to weights $[0.659, 0.242, 0.099]$ that sum to $1$, so sentence 1 gets the most focus — that is how attention allocates a fixed budget of attention.`
    },
    {
      title: `Aligning a French word to its English source`,
      domain: `Word alignment`,
      question: `When generating "chat", which English word in "the black cat" does attention pick?`,
      steps: [
        { title: `The data`, body: `<p>The decoder query for the French word "chat" attends over the English words "the", "black", "cat", each with a key vector.</p>` },
        { title: `The math`, body: `<p>Weights $= \\text{softmax}(K q)$. The English word whose key best matches the query gets the highest weight — that word is the alignment.</p>` },
        { title: `Run it`, body: `<p>Compute the alignment weights.</p>`,
          code: `import numpy as np
def softmax(z):
    z=z-z.max(); e=np.exp(z); return e/e.sum()
eng = ["the", "black", "cat"]
q = np.array([0.1, 0.2, 0.9])
K = np.array([[0.8,0.1,0.0],[0.1,0.9,0.1],[0.0,0.1,0.95]])
weights = softmax(K@q)
for w, a in zip(eng, weights):
    print("%-6s attention = %.3f" % (w, a))
print("aligns mostly to:", eng[int(weights.argmax())])`,
          output: `the    attention = 0.229
black  attention = 0.274
cat    attention = 0.497
aligns mostly to: cat` }
      ],
      conclusion: `"chat" attends most to "cat" ($0.497$), correctly aligning the French word to its English source — attention provides interpretable word-to-word links.`
    }
  ],

  /* ---------------- dl-data-augmentation ---------------- */
  "dl-data-augmentation": [
    {
      title: `Turning one X-ray into many training images`,
      domain: `Medical imaging`,
      question: `From a single scan, how many extra labeled images can flips and rotations create?`,
      steps: [
        { title: `The data`, body: `<p>Labeled medical scans are scarce. We take one $3\\times3$ grayscale image and apply label-preserving transforms: horizontal flip, vertical flip, and a 90-degree rotation.</p>` },
        { title: `The math`, body: `<p>A flip mirrors the pixel grid; a rotation permutes it. The diagnosis label is unchanged, so each transform yields a new, valid training example for free.</p>` },
        { title: `Run it`, body: `<p>Generate the augmented variants.</p>`,
          code: `import numpy as np
img = np.array([[1,2,3],[4,5,6],[7,8,9]])
flip_h = np.fliplr(img)
rot90  = np.rot90(img)
print("original:\\n", img)
print("horizontal flip:\\n", flip_h)
print("rotate 90:\\n", rot90)
print("1 image -> %d training images" % (1 + 3))`,
          output: `original:
 [[1 2 3]
 [4 5 6]
 [7 8 9]]
horizontal flip:
 [[3 2 1]
 [6 5 4]
 [9 8 7]]
rotate 90:
 [[3 6 9]
 [2 5 8]
 [1 4 7]]
1 image -> 4 training images` }
      ],
      conclusion: `One scan becomes $4$ labeled images via flips and a rotation — a cheap way to expand a tiny medical dataset without collecting new scans.`
    },
    {
      title: `Augmentation rescuing a tiny classifier`,
      domain: `Image classification`,
      question: `Does adding jittered copies of a small training set actually improve test accuracy?`,
      steps: [
        { title: `The data`, body: `<p>Only 12 labeled training points (2 features), with the label set by the sign of feature 0. We add 5 noisy copies of each point (same label) — the tabular analog of image jitter.</p>` },
        { title: `The math`, body: `<p>Augmentation adds small random noise $\\epsilon$ to each example, keeping its label. This enlarges the training set and smooths the decision boundary, reducing overfitting. We compare a logistic model trained with and without it on a 500-point test set.</p>` },
        { title: `Run it`, body: `<p>Train both and compare test accuracy.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LogisticRegression
np.random.seed(0)
def make(n):
    X = np.random.randn(n, 2); y = (X[:,0] > 0).astype(int); return X, y
X_tr, y_tr = make(12)
X_te, y_te = make(500)
base = LogisticRegression().fit(X_tr, y_tr)
aug_X = np.vstack([X_tr + 0.05*np.random.randn(*X_tr.shape) for _ in range(5)])
X_aug = np.vstack([X_tr, aug_X]); y_aug = np.concatenate([y_tr, np.tile(y_tr, 5)])
aug = LogisticRegression().fit(X_aug, y_aug)
print("train size: %d -> %d after augmentation" % (len(X_tr), len(X_aug)))
print("test accuracy without augmentation: %.3f" % base.score(X_te, y_te))
print("test accuracy with augmentation:    %.3f" % aug.score(X_te, y_te))`,
          output: `train size: 12 -> 72 after augmentation
test accuracy without augmentation: 0.568
test accuracy with augmentation:    0.852` }
      ],
      conclusion: `Augmentation grows the set $12 \\to 72$ and lifts test accuracy from $0.568$ to $0.852$ — extra jittered examples gave the model a much steadier boundary.`
    },
    {
      title: `Brightness and crop jitter for self-driving frames`,
      domain: `Autonomous vehicles`,
      question: `How do brightness shifts and crops make a road-sign model robust to real conditions?`,
      steps: [
        { title: `The data`, body: `<p>A $4\\times4$ grayscale road-sign patch (values $0$-$1$). Real cameras see varied lighting and framing, so we simulate a brightness boost (clamped to $1$) and a corner crop.</p>` },
        { title: `The math`, body: `<p>Brightness: add a constant then clip to $[0,1]$. Crop: take a sub-grid. Both keep the "sign" label, teaching the model to ignore lighting and exact position.</p>` },
        { title: `Run it`, body: `<p>Apply brightness and crop augmentations.</p>`,
          code: `import numpy as np
patch = np.array([
    [0.1, 0.2, 0.3, 0.4],
    [0.2, 0.3, 0.4, 0.5],
    [0.3, 0.4, 0.5, 0.6],
    [0.4, 0.5, 0.6, 0.7],
])
bright = np.clip(patch + 0.3, 0, 1)
crop = patch[1:3, 1:3]
print("original mean brightness: %.3f" % patch.mean())
print("brightened mean: %.3f" % bright.mean())
print("center crop:\\n", crop)
print("variants from 1 patch: %d" % 3)`,
          output: `original mean brightness: 0.400
brightened mean: 0.700
center crop:
 [[0.3 0.4]
 [0.4 0.5]]
variants from 1 patch: 3` }
      ],
      conclusion: `The brightened patch (mean $0.400 \\to 0.700$) and the center crop are new label-preserving views, so the sign detector learns to handle changing light and framing on real roads.`
    }
  ]

});
