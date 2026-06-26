/* Paper lesson — "ImageNet: A Large-Scale Hierarchical Image Database",
   Jia Deng, Wei Dong, Richard Socher, Li-Jia Li, Kai Li, Li Fei-Fei
   (Princeton University, CVPR 2009). Self-contained: lesson + CODE + CODEVIZ
   merged by id "paper-imagenet".
   GROUNDED by reading the official PDF directly:
   https://www.image-net.org/static_files/papers/imagenet_cvpr09.pdf
   (no arXiv). Quoted facts: Abstract (5247 synsets, 3.2 million images, 12
   subtrees, average 500-1000 images, "tens of millions"); Section 2 Properties
   ("around 80,000 noun synsets in WordNet"; "synonym set" / "synset"; ~50 million
   target; mammal+vehicle focus; 12 subtree names); Figure 2 (Summary table of
   selected subtrees; "About 20% of the synsets have very few images. Over 50%
   synsets have more than 500 images."); "On average over 600 images are collected
   for each synset"; "147 dog categories"; Figure 4 ("An average of 99.7% precision
   is achieved on average", 80 synsets); avg image size "around 400 x 350"; Section
   3 construction (multiple search engines, WordNet-synonym queries, query
   expansion from parent gloss, translation to Chinese/Spanish/Dutch/Italian,
   "over 10K images on average" candidates, search accuracy "around 10%"); Section
   3.2 cleaning via Amazon Mechanical Turk (AMT).
   Track: read-only (a DATASET paper). No implementation cell. The CODE/CODEVIZ
   below are tiny CONCEPTUAL schematics of the WordNet hierarchy — NOT a training
   run, NOT the paper's numbers. ILSVRC and AlexNet are LATER context (post-2009),
   flagged as such; the 2009 paper does not mention them. */
(function () {
  window.LESSONS.push({
    id: "paper-imagenet",
    title: "ImageNet — ImageNet: A Large-Scale Hierarchical Image Database (2009)",
    tagline: "A huge image dataset organized by the WordNet word hierarchy, collected from web search and cleaned by crowd workers.",
    module: "Papers · Datasets, Benchmarks & Surveys",
    track: "read-only",
    paper: {
      authors: "Jia Deng, Wei Dong, Richard Socher, Li-Jia Li, Kai Li, Li Fei-Fei",
      org: "Princeton University, Dept. of Computer Science",
      year: 2009,
      venue: "CVPR 2009 (IEEE Conference on Computer Vision and Pattern Recognition)",
      citations: "",
      arxiv: "",
      url: "https://www.image-net.org/static_files/papers/imagenet_cvpr09.pdf",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["ml-hierarchical", "ml-trees", "ml-knn", "met-classification-label", "ml-classification-metrics", "paper-knn"],

    // WHY READ IT
    problem:
      `<p>Before this paper, computer vision had small, clean datasets and a flood of messy internet
       images, but nothing that bridged them. A <b>dataset</b> here means a labeled collection of images:
       each image comes with a tag saying what object it shows. The standard datasets of the day held only
       a few hundred object categories at most, with relatively few images each. Meanwhile the web held
       billions of photos with no reliable labels.</p>
       <p>The paper opens with this scale problem. It quotes the moment plainly: "The latest estimations put
       a number of more than 3 billion photos on Flickr, a similar number of video clips on YouTube and an
       even larger number for images in the Google Image Search database." (Section 1.) So the raw material
       was there. The trouble was organization. The paper states the core question directly: "But exactly
       how such data can be utilized and organized is a problem yet to be solved." (Section 1.)</p>
       <p>Two things were missing. First, <b>scale and coverage</b>: a dataset big enough, and broad enough,
       to cover most everyday objects, not just the dozen categories researchers happened to label. Second,
       <b>structure</b>: a way to organize those categories so they relate to one another (a husky is a dog
       is a mammal), instead of a flat list of unrelated labels. This paper builds exactly that.</p>`,
    contribution:
      `<ul>
        <li><b>A dataset organized by a word hierarchy.</b> ImageNet attaches images to the <b>WordNet</b>
        noun hierarchy. WordNet is a hand-built dictionary that groups words by meaning and links them by
        "is-a" relations. The paper: "ImageNet uses the hierarchical structure of WordNet." (Section 2.)
        Each concept becomes a labeled bucket of images, and the buckets are wired into a tree.</li>
        <li><b>Massive scale, built to grow.</b> The paper reports the 2009 snapshot and the goal. Quoted
        (Abstract): "This paper offers a detailed analysis of ImageNet in its current state: 12 'subtrees'
        with 5247 synsets and 3.2 million images in total." The aim (Section 2): "ImageNet aims to contain
        in the order of 50 million cleanly labeled full resolution images (500-1000 per synset)."</li>
        <li><b>A construction pipeline: web search plus crowdsourcing.</b> Images are pulled from internet
        search engines, then cleaned by humans. The paper: "We describe the data collection scheme with
        Amazon Mechanical Turk." (Abstract.) This recipe — collect cheaply from the web, verify with a
        crowd — is the methodological core.</li>
      </ul>`,
    whyItMattered:
      `<p>ImageNet became the foundation of the modern deep-learning era in computer vision. The dataset
       described here grew, and a yearly competition was later built on a 1000-category slice of it: the
       <b>ImageNet Large Scale Visual Recognition Challenge (ILSVRC)</b> — a benchmark where teams compete
       to classify images into those 1000 categories. (Note: ILSVRC and the results below came <i>after</i>
       this 2009 paper and are not mentioned in it; they are later context.)</p>
       <p>In 2012, a deep <b>convolutional neural network</b> (a CNN — a network with layers that slide small
       filters over an image to detect patterns) called AlexNet won that competition by a large margin. That
       win is widely credited with launching the deep-learning wave in vision. None of it happens without a
       dataset of this scale and quality to train on. The paper's own framing (Section 1) foresaw the role:
       it argues ImageNet "can serve as a useful resource for visual recognition applications such as object
       recognition, image classification and object localization," and notes that "the construction of such
       a large-scale and high-quality database can no longer rely on traditional data collection methods."</p>
       <p>The lasting lesson: <b>data, organized and at scale, was the missing ingredient.</b> A clean,
       hierarchical, web-scale dataset turned out to be as important as any single model. ImageNet showed how
       to build one, and the field has run on large labeled datasets ever since.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>The Abstract</b> &mdash; the whole thesis in one paragraph: what ImageNet is, its scale (12
        subtrees, 5247 synsets, 3.2 million images), and that it is built on WordNet and cleaned with Amazon
        Mechanical Turk.</li>
        <li><b>Section 2 (Properties of ImageNet)</b> &mdash; the four properties the paper claims: <i>Scale,
        Hierarchy, Accuracy, Diversity</i>. This is where the headline numbers and definitions live (synset,
        the 80,000 WordNet noun synsets, the 50-million target).</li>
        <li><b>Figures 1 and 2</b> &mdash; Figure 1 shows two root-to-leaf branches (mammal &rarr; ... &rarr;
        husky; vehicle &rarr; ... &rarr; trimaran) so you can see the hierarchy. Figure 2 is the scale
        summary: a histogram of images-per-synset and a table of selected subtrees.</li>
        <li><b>Section 3 (Constructing ImageNet)</b> &mdash; the two-stage pipeline: 3.1 Collecting Candidate
        Images (web search) and 3.2 Cleaning Candidate Images (Amazon Mechanical Turk). This is the
        methodological heart.</li>
       </ul>
       <p><b>Skim:</b> Section 2.1 (comparisons to TinyImage, ESP, LabelMe, Lotus Hill) and Section 4
       (Applications &mdash; object recognition, tree-based classification, localization). These show the
       dataset is useful, but you do <b>not</b> implement them. This is a read-only, dataset paper: read it
       for <i>how the dataset was built and why its design matters</i>, not for an algorithm to code.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>The paper collects candidate images by querying internet image search engines, then asks humans to
       throw out the wrong ones. Here is the question to guess before reading on: <b>if you type a word like
       "husky" into an image search engine, roughly what fraction of the returned images actually show a
       husky?</b> Is it about 90%, about 50%, or about 10%? Write your guess and one sentence on why raw
       search results would need cleaning at all.</p>
       <p>(Hint: the answer is why the crowdsourcing step exists. If search were already clean, there would
       be nothing to verify.)</p>`,
    attempt:
      `<p>This is a read-only paper, so there is nothing to build from scratch. Instead, before the reveal,
       reason through the dataset's design on paper:</p>
       <ul>
        <li>The paper wants 500&ndash;1000 <i>clean</i> images per concept, but raw web search is noisy.
        Sketch the two-stage pipeline as a flow: <code>web search &rarr; candidate pool &rarr; human
        verification &rarr; clean synset</code>. At which stage does the noise get removed?</li>
        <li>WordNet has "around 80,000 noun synsets" (Section 2). The 2009 snapshot covers 5247 synsets.
        TODO: compute roughly what fraction of WordNet's nouns are covered so far. (The paper's Section 5.1
        states "The current ImageNet constitutes &sim; 10% of the WordNet synsets" &mdash; check your number
        against that.)</li>
        <li>Predict: why organize images by a <i>hierarchy</i> (husky is-a dog is-a mammal) rather than a
        flat list of categories? Name one thing the tree structure lets you do that a flat list cannot.</li>
       </ul>
       <p>The CODE and CODEVIZ panels below draw a tiny schematic of one WordNet branch so you can see the
       "is-a" tree the dataset hangs on &mdash; a conceptual sketch, not the paper's figure or any data.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>ImageNet is not a model. It is a <b>dataset</b> with a particular design. The "how it works" here is
       <i>how the dataset is structured and how it was built</i>. There are two big ideas: the <b>hierarchy</b>
       (the skeleton) and the <b>construction pipeline</b> (how images get hung on it).</p>
       <p><b>The skeleton: WordNet and synsets.</b> <b>WordNet</b> is a large, hand-built lexical database of
       English: it groups words into sets of synonyms and connects those sets by relations. The key relation
       here is "is-a" (the paper calls it the "IS-A relation"). A <b>synset</b> &mdash; short for "synonym
       set" &mdash; is one node: a single concept, named by all the words that mean it. The paper defines it
       directly: "Each meaningful concept in WordNet, possibly described by multiple words or word phrases, is
       called a 'synonym set' or 'synset'. There are around 80,000 noun synsets in WordNet." (Section 2.) So
       "dog", "domestic dog", "Canis familiaris" are one synset. ImageNet's plan: attach a bucket of images to
       each noun synset, and inherit WordNet's tree so the buckets are connected. A husky synset sits under
       dog, under canine, under carnivore, under mammal &mdash; exactly the chain Figure 1 illustrates.</p>
       <p><b>Stage 1 &mdash; collecting candidate images (Section 3.1).</b> For each synset, the authors query
       several internet image search engines. The search terms are the synset's own words: "For each synset,
       the queries are the set of WordNet synonyms." But search engines return only a few hundred to a
       thousand results per query, and many are wrong. To get more and better candidates, the paper does two
       things. (1) <b>Query expansion:</b> it appends words from the parent synset's definition (its "gloss").
       The paper's example: for "whippet", whose gloss is "a small slender dog of greyhound type developed in
       England", it also searches "whippet dog" and "whippet greyhound". (2) <b>Translation:</b> it translates
       the queries into other languages &mdash; "Chinese, Spanish, Dutch and Italian" &mdash; using
       WordNets in those languages, to pull in images from non-English pages. After this, "each synset has over
       10K images on average" as candidates. But these are raw: the paper notes "the accuracy of image search
       results from the Internet is around 10%." So roughly nine in ten candidate images are wrong and must be
       removed.</p>
       <p><b>Stage 2 &mdash; cleaning with Amazon Mechanical Turk (Section 3.2).</b> <b>Crowdsourcing</b> means
       paying many people small amounts to each do a tiny task. <b>Amazon Mechanical Turk (AMT)</b> is an
       online marketplace for exactly that. The paper: "we rely on humans to verify each candidate image ...
       This is achieved by using the service of Amazon Mechanical Turk (AMT), an online platform on which one
       can put up tasks for users to complete and to get paid." For each synset, workers are shown candidate
       images plus the concept's definition (including a Wikipedia link) and asked whether each image really
       contains that object. The catch: people disagree, especially on hard concepts. So no single worker
       decides. The paper: "An image is considered positive only if it gets a convincing majority of the
       votes." And because some concepts are harder than others (a "Burmese cat" needs more agreement than a
       generic "cat"), the paper sets the required number of votes <i>per category</i>, using a confidence
       table, until a target confidence is reached. The result is the headline on quality: "An average of
       99.7% precision is achieved on average" (Figure 4, measured on 80 randomly sampled synsets).</p>
       <p><b>The result: scale plus density.</b> Putting it together, the 2009 snapshot has "12 'subtrees' with
       5247 synsets and 3.2 million images" (Abstract), with "on average over 600 images ... collected for each
       synset" (Section 2). It is not just big but <i>dense</i> &mdash; many images at every node, all along
       the tree. The paper stresses this density: "to our knowledge no existing vision dataset offers images
       of 147 dog categories" (Section 2). That combination &mdash; broad coverage, many images per concept,
       high label accuracy, all organized by a meaningful tree &mdash; is what made ImageNet new.</p>`,
    architecture:
      `<p>ImageNet has no neural network to diagram. Its "architecture" is the <b>construction pipeline</b> &mdash;
       the data-flow that turns the WordNet dictionary plus the open web into a clean, hierarchical image
       database. Trace it stage by stage; each stage's <i>output</i> is the next stage's <i>input</i>.</p>

       <p><b>Stage 0 &mdash; Synset selection (the skeleton).</b> Input: WordNet's &sim;80,000 noun synsets and its
       is-a relation. The authors pick 12 subtrees to populate first (mammal, bird, fish, reptile, amphibian,
       vehicle, furniture, musical instrument, geological formation, tool, flower, fruit; Section 2). Output: a
       target list of synsets to fill, each already wired into the inherited is-a tree (husky &rarr; working dog
       &rarr; dog &rarr; canine &rarr; carnivore &rarr; placental &rarr; mammal, the Figure 1 branch). Every later
       stage runs <i>per synset</i>.</p>

       <p><b>Stage 1 &mdash; Candidate collection (Section 3.1), the recall stage.</b> For one synset, three
       sub-steps fan out search queries to <i>multiple internet image search engines</i> and merge the results
       into a candidate pool:</p>
       <ul>
        <li><b>(1a) Base queries</b> = the synset's own WordNet synonyms (e.g. {dog, domestic dog, Canis
        familiaris}).</li>
        <li><b>(1b) Query expansion</b> = append a word from the <i>parent synset's gloss</i> (definition) when
        that word also appears in the target synset's gloss. The paper's worked example: "whippet", gloss "a
        small slender dog of greyhound type developed in England", expands to "whippet dog" and "whippet
        greyhound".</li>
        <li><b>(1c) Translation</b> = translate the queries into Chinese, Spanish, Dutch and Italian using the
        WordNets in those languages, to pull images from non-English pages.</li>
       </ul>
       <p>After intra-synset duplicate removal, the pool holds "over 10K images on average" per synset &mdash;
       but at only "around 10%" precision (Section 3.1). High recall, low precision: the pool is &sim;90% noise.</p>

       <p><b>Stage 2 &mdash; Crowd verification (Section 3.2), the precision stage.</b> The noisy pool is fed to
       <b>Amazon Mechanical Turk (AMT)</b>. A labeling task shows a worker candidate images plus the synset's
       definition (with a Wikipedia link) and asks, per image, "does this contain the object?" Quality control
       is by <b>redundancy + majority voting</b>: many independent workers vote on the same image, and an image
       is kept only if it wins "a convincing majority of the votes". Because workers agree more on easy concepts
       than hard ones, the number of required votes is set <i>per category</i> via a <b>confidence table</b>
       (Figure 7): votes accumulate until the per-image confidence passes a pre-set threshold &mdash; few votes
       for "cat", many more for "Burmese cat". Output: a verified, &sim;99.7%-precision set of images for that
       synset.</p>

       <p><b>Stage 3 &mdash; Hierarchical assembly.</b> Repeat Stages 1&ndash;2 across every target synset and
       hang each verified image bucket on its WordNet node. Because the nodes were already connected by is-a in
       Stage 0, the result is automatically a <i>tree of buckets</i>, not a flat list: 12 subtrees, 5247 synsets,
       3.2 million images in the 2009 snapshot, with the stated goal of growing toward &sim;50 million images over
       &sim;50K synsets (Sections 3, 5.1).</p>

       <p>So the full data flow is: <code>WordNet synsets + is-a tree &rarr; per-synset multi-engine search +
       query expansion + translation &rarr; &gt;10K noisy candidates &rarr; AMT majority voting with a
       per-category confidence threshold &rarr; &sim;99.7%-clean buckets &rarr; assembled into the WordNet
       hierarchy.</code> Recall comes from search; precision comes from the crowd; structure comes from
       WordNet.</p>`,
    symbols: [
      { sym: "WordNet", desc: "a large, hand-built lexical database of English. It groups words into synonym sets (synsets) and links those sets by relations &mdash; here, mainly the 'is-a' relation (a husky is-a dog). It is the pre-existing structure ImageNet borrows as its skeleton. The paper: 'There are around 80,000 noun synsets in WordNet.' (Section 2.)" },
      { sym: "synset", desc: "short for 'synonym set': one node of WordNet &mdash; a single concept named by all the words that mean it (e.g. {dog, domestic dog, Canis familiaris}). In ImageNet, each noun synset becomes one labeled bucket of images. Defined verbatim in Section 2." },
      { sym: "subtree", desc: "a branch of the WordNet hierarchy rooted at one concept, including all its descendants. The 2009 snapshot covers 12 subtrees: 'mammal, bird, fish, reptile, amphibian, vehicle, furniture, musical instrument, geological formation, tool, flower, fruit' (Section 2)." },
      { sym: "the 'is-a' relation", desc: "the hierarchical link the paper relies on (it writes 'the IS-A relation being the most comprehensive'). It means one concept is a kind of another: husky is-a dog, dog is-a canine, and so on up to mammal. This is what makes the dataset a tree, not a flat list." },
      { sym: "Amazon Mechanical Turk (AMT)", desc: "an online marketplace where requesters post small tasks ('label this image') and many people complete them for small payments. ImageNet uses it for the cleaning stage. The paper: 'an online platform on which one can put up tasks for users to complete and to get paid.' (Section 3.2.)" },
      { sym: "crowdsourcing", desc: "a plain term: getting a large job done by distributing many tiny pieces of it across many people. ImageNet's verification &mdash; checking millions of candidate images &mdash; is crowdsourced through AMT." },
      { sym: "precision", desc: "for a labeled image bucket, the fraction of images in it that are actually correct (truly show the concept). The paper reports 'An average of 99.7% precision' across 80 sampled synsets (Figure 4) &mdash; i.e., about 997 of every 1000 images in a synset are right." },
      { sym: "ILSVRC", desc: "the ImageNet Large Scale Visual Recognition Challenge: a yearly competition (started after this paper) to classify images into 1000 ImageNet categories. NOT mentioned in the 2009 paper &mdash; included here only as later context for why ImageNet mattered." },
      { sym: "$\\#Y,\\ \\#N$", desc: "the number of 'yes' votes and 'no' votes a candidate image receives from Amazon Mechanical Turk workers (Section 3.2, Figure 7). The confidence table maps $(\\#Y, \\#N)$ to a probability the image is a good example of the concept; an image is kept once that confidence clears a per-category threshold." },
      { sym: "$D_C$", desc: "the query-to-class distance used in the Section 4.1 object-recognition demo (Naive-Bayes Nearest-Neighbor). Smaller means the query image looks more like class $C$." },
      { sym: "$d_i$", desc: "the $i$-th local feature descriptor (a SIFT descriptor) extracted from the query image; the image is represented as a bag of these descriptors, $i = 1,\\dots,M$ (Section 4.1)." },
      { sym: "$d_i^{C}$", desc: "the nearest neighbor of descriptor $d_i$ among all the descriptors drawn from images of class $C$ (Section 4.1). The closer each $d_i$ is to its class-$C$ neighbor, the smaller $D_C$." },
      { sym: "$M$", desc: "the number of local descriptors extracted from the query image &mdash; the length of its bag-of-features representation (Section 4.1)." },
      { sym: "$p(x \\mid c)$", desc: "in the Section 4.3 localization demo, the likelihood that image patch $x$ belongs to category $c$; the bounding box is drawn around the region of highest accumulated likelihood." },
      { sym: "$z_i$", desc: "a latent 'topic' in the non-parametric graphical model of the Section 4.3 localization demo; $p(x \\mid c)$ is obtained by marginalizing over these topics, $p(x\\mid c)=\\sum_i p(x\\mid z_i,c)\\,p(z_i\\mid c)$." }
    ],
    formula:
      `<p><b>Be honest up front: this is a dataset paper, and it is light on math.</b> It has no governing
       loss, no training objective, no model equation in its main contribution. The headline content is
       <i>quantitative facts and a construction pipeline</i>, not derivations. So the "formula" here is in
       four honest parts: (1) the structural recipe of the dataset, (2) the few reported numbers, (3) the
       crowd-voting confidence scheme, and (4) the two genuine equations that appear &mdash; both only in the
       small application demos of Section 4, not in the dataset itself.</p>

       <p><b>(1) The structural recipe (the dataset's "definition", not an equation the paper writes).</b>
       Each WordNet noun synset $s$ is a labeled set of images $I(s)$, and the synsets are connected by the
       is-a relation, so the images of a concept are also (loosely) instances of its parents:</p>
       $$ \\text{ImageNet} \\;=\\; \\{\\, (s,\\; I(s)) \\;:\\; s \\in \\text{WordNet noun synsets} \\,\\}, \\qquad
          s \\xrightarrow{\\;\\text{is-a}\\;} \\text{parent}(s). $$
       <p>Read it as: ImageNet is a set of (concept, image-bucket) pairs, wired into WordNet's is-a tree.</p>

       <p><b>(2) The reported numbers (quoted, not derived).</b> The only quantitative claims in the dataset
       part are counts and rates the paper measures: 12 subtrees, 5247 synsets, 3.2 million images, &sim;600
       images per synset (Abstract / Section 2); &sim;80,000 WordNet noun synsets, target &sim;50 million
       images at 500&ndash;1000 per synset (Abstract / Section 2); &gt;10K candidate images per synset at
       &sim;10% raw search accuracy (Section 3.1); distribution &mdash; "About 20% of the synsets have very
       few images. Over 50% synsets have more than 500 images" (Figure 2); average image size &sim;400 &times;
       350 (Section 2.1); and the quality headline "An average of 99.7% precision" over 80 sampled synsets,
       with "&sim; 99% precision" overall (Figure 4 / Section 2.1).</p>

       <p><b>(3) The crowd-verification confidence scheme (Section 3.2, Figure 7).</b> Each candidate image is
       voted on by multiple Amazon Mechanical Turk workers. From the per-image counts of "yes" votes $\\#Y$
       and "no" votes $\\#N$, the paper builds a <b>confidence table</b> giving the probability the image is a
       good example of the concept &mdash; e.g. with $\\#Y\\!=\\!3,\\ \\#N\\!=\\!0$ the table reads confidence
       $0.99$ for "Cat" but only $0.90$ for the harder "Burmese cat" (Figure 7, right). An image is kept once
       its confidence passes a <b>per-category threshold</b>; harder synsets demand more agreeing votes to
       reach the same confidence. (The paper publishes the table, not a closed-form equation for it.)</p>

       <p><b>(4) The two genuine equations &mdash; only in the Section 4 application demos.</b> First, the
       non-parametric object-recognition demo (Section 4.1) scores a query image (with descriptors
       $d_1,\\dots,d_M$) against an object class $C$ by the Naive-Bayes Nearest-Neighbor distance:</p>
       $$ D_C \\;=\\; \\sum_{i=1}^{M} \\lVert\\, d_i - d_i^{C} \\,\\rVert^2, $$
       <p>where $d_i^{C}$ is the nearest neighbor of descriptor $d_i$ among all images of class $C$ (Section 4.1).
       Second, the automatic-localization demo (Section 4.3) scores an image patch $x$ under category $c$ by
       marginalizing over latent topics $z_i$:</p>
       $$ p(x \\mid c) \\;=\\; \\sum_i p(x \\mid z_i, c)\\, p(z_i \\mid c), $$
       <p>and puts a bounding box around the region of highest accumulated likelihood (Section 4.3). The
       tree-based-classification demo (Section 4.2) adds the <b>tree-max classifier</b>: the score of a query at
       a node is the <i>maximum</i> classifier response over that node and all of its subtree's synsets &mdash; a
       max, stated in words rather than as a labelled equation. These three appear only to <i>illustrate</i> that
       the dataset is useful; none is a contribution of the dataset itself.</p>`,
    whatItDoes:
      `<p>The structure above says ImageNet is two things at once: a pile of labeled images, and a tree relating
       the labels. That duality is the whole point. As a <b>pile of labeled images</b> it is training fuel: a
       model that learns "what a husky looks like" needs many correct husky images, and ImageNet supplies them
       at scale (over 600 per synset on average). As a <b>tree</b> it carries meaning between labels: because
       husky is-a dog is-a mammal, you can reason about a concept using its neighbors &mdash; group fine
       categories under coarse ones, share information up and down the branch, or measure how hard a concept is
       by how deep it sits.</p>
       <p>The paper makes the density point sharply with a comparison: it shows the "cat" and "cattle" subtrees
       are far denser in ImageNet than in an earlier dataset (the ESP game's), and notes "to our knowledge no
       existing vision dataset offers images of 147 dog categories" (Section 2). So ImageNet is not just large
       in total &mdash; it is large <i>at every node</i>, all the way down to fine-grained leaves like specific
       dog breeds. Big, clean, and densely organized: that is what the structure delivers.</p>`,
    derivation:
      `<p>There is nothing to derive &mdash; this is an empirical dataset paper, not a theorem. So "why it is
       true" becomes "why the design choices are the right ones", which the paper argues directly. Three
       choices stand out.</p>
       <p><b>Why borrow WordNet instead of inventing categories.</b> Choosing what counts as an object category,
       and how categories relate, is a huge and contentious task. WordNet had already done it: tens of thousands
       of noun concepts, hand-organized by meaning, with is-a links. Reusing it gave ImageNet a principled,
       ready-made label space and tree for free. The paper: "ImageNet organizes the different classes of images
       in a densely populated semantic hierarchy. The main asset of WordNet lies in its semantic structure,
       i.e. its ontology of concepts." (Section 2.)</p>
       <p><b>Why two stages (web then crowd) instead of one.</b> Web search is cheap and gives breadth, but it
       is noisy &mdash; "around 10%" accurate (Section 3.1). Expert hand-labeling is accurate but far too slow
       for millions of images. The two-stage pipeline takes the strength of each: search for cheap recall,
       crowdsourcing for cheap precision. Neither alone reaches both scale and quality; together they do.</p>
       <p><b>Why majority voting with a per-concept threshold.</b> A single crowd worker is unreliable, and
       harder concepts are unreliable in different degrees. Requiring a majority of votes cancels individual
       mistakes; setting the number of required votes per concept (more for "Burmese cat", fewer for "cat")
       spends labeling effort where it is actually needed. That adaptive scheme is what lets the pipeline hit
       "an average of 99.7% precision" (Figure 4) without wasting votes on easy synsets. None of this is proved
       &mdash; it is engineering justified by the measured precision.</p>`,
    example:
      `<p>Work the dataset's headline numbers by hand, using only figures <i>quoted</i> from the paper, to feel
       the scale and the noise. (Every number below is the paper's own; nothing is invented.)</p>
       <ul class="steps">
        <li><b>Average images per synset.</b> The snapshot has "5247 synsets and 3.2 million images" (Abstract).
        Divide: $3{,}200{,}000 / 5247 \\approx 610$ images per synset &mdash; consistent with the paper's
        statement "on average over 600 images are collected for each synset" (Section 2). So a typical concept
        bucket holds roughly 600 images.</li>
        <li><b>How much cleaning the crowd does.</b> Each synset starts with "over 10K images on average" as
        web candidates, but search is "around 10%" accurate (Section 3.1). Ten thousand candidates at 10%
        correct is about $10{,}000 \\times 0.10 = 1{,}000$ truly-correct images hiding in the pool &mdash; in
        the right ballpark for the 500&ndash;1000-per-synset target. The crowd's job is to find those and
        discard the other &sim;9,000. That is why the verification stage exists.</li>
        <li><b>Resulting purity.</b> After cleaning, "an average of 99.7% precision is achieved" (Figure 4).
        In a 600-image synset that means about $600 \\times 0.003 \\approx 2$ wrong images on average &mdash;
        a roughly 1-in-300 error rate. The pile goes from &sim;90% wrong (raw search) to &sim;0.3% wrong
        (after the crowd).</li>
        <li><b>Coverage so far.</b> WordNet has "around 80,000 noun synsets" (Section 2); the snapshot covers
        5247. That is $5247 / 80{,}000 \\approx 6.6\\%$ by this count, and the paper rounds the broader progress
        to "&sim; 10% of the WordNet synsets" (Section 5.1). Either way: a small but substantial slice, with the
        rest the stated future goal of "around 50 million images" (Section 3).</li>
       </ul>
       <p>These four numbers tell the story: roughly 600 clean images per concept, distilled by the crowd from
       a &sim;90%-noisy web pool, at &sim;99.7% precision, over a few thousand of WordNet's tens of thousands of
       concepts &mdash; with a plan to grow far larger.</p>`,
    recipe:
      `<p>This is a read-only paper, so there is no architecture to assemble. Instead, here is the
       <b>construction procedure</b> the paper follows &mdash; the recipe you would run to build a dataset like
       ImageNet:</p>
       <ol>
        <li><b>Choose a label hierarchy.</b> Take WordNet's noun synsets as the categories, and inherit its
        is-a tree as the structure. Each synset will become one labeled image bucket.</li>
        <li><b>Query web image search.</b> For each synset, query several search engines using the synset's
        WordNet synonyms as the search terms.</li>
        <li><b>Expand the queries.</b> Append words from the parent synset's gloss (definition) &mdash; e.g.
        "whippet dog", "whippet greyhound" &mdash; and translate the queries into other languages (Chinese,
        Spanish, Dutch, Italian) to gather more and more-diverse candidates ("over 10K images on average").</li>
        <li><b>Clean with a crowd.</b> Send the candidate images to Amazon Mechanical Turk workers, each shown
        the concept's definition, and ask whether each image truly contains the object.</li>
        <li><b>Vote with a per-concept threshold.</b> Keep an image only if it wins a convincing majority. Set
        the number of required votes per concept higher for confusing synsets (using a confidence table) so the
        target precision is met everywhere.</li>
        <li><b>Repeat across the tree</b> to fill in 500&ndash;1000 clean images per synset, yielding the dense,
        hierarchical, high-precision dataset.</li>
       </ol>`,
    results:
      `<p><b>Scale (quoted, Abstract):</b> "This paper offers a detailed analysis of ImageNet in its current
       state: 12 'subtrees' with 5247 synsets and 3.2 million images in total."</p>
       <p><b>Target scale (quoted, Section 2):</b> "ImageNet aims to contain in the order of 50 million cleanly
       labeled full resolution images (500-1000 per synset)."</p>
       <p><b>Density (quoted, Section 2):</b> "On average over 600 images are collected for each synset."
       Distribution (Figure 2): "About 20% of the synsets have very few images. Over 50% synsets have more than
       500 images." And on fine-grained coverage: "to our knowledge no existing vision dataset offers images of
       147 dog categories."</p>
       <p><b>Accuracy (quoted, Figure 4):</b> "An average of 99.7% precision is achieved on average" &mdash;
       measured on "a total of 80 synsets randomly sampled at every tree depth of the mammal and vehicle
       subtrees."</p>
       <p><b>Image quality (quoted, Section 2.1):</b> ImageNet "contains high quality synsets (&sim; 99%
       precision) and full resolution images with an average size of around 400 x 350."</p>
       <p><i>All of the above are the paper's own statements and figures, transcribed from the Abstract,
       Section 2, Section 2.1, Section 3, and Figure 4. The schematic in the CODE and CODEVIZ panels below is a
       hand-drawn conceptual sketch of one WordNet branch &mdash; it is not the paper's Figure 1, not measured
       data, and contains no dataset statistics.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> This is a <i>dataset</i>, so "working" means a clean, dense,
       correctly-structured collection &mdash; the metric is <b>label precision</b>: the fraction of images in a
       synset bucket that truly show the concept. The paper measures it on "a total of 80 synsets randomly
       sampled at every tree depth of the mammal and vehicle subtrees" (Figure 4). The no-skill baseline is
       <b>raw web search at "around 10%" precision</b> (Section 3.1) &mdash; so &sim;90% wrong is the floor your
       cleaning pipeline must beat. Secondary metrics: <b>density</b> (images per synset, target 500&ndash;1000)
       and <b>coverage</b> (synsets filled vs WordNet's &sim;80,000).</p>
       <ul>
        <li><b>Sanity checks BEFORE the full crowd run.</b> (1) On a handful of synsets, hand-label a small
        sample of the raw candidate pool and confirm precision is in the &sim;10% ballpark &mdash; if it is
        already high, your queries are too narrow; if &sim;0%, the synonym/translation queries are broken. (2)
        Check the is-a tree loads without cycles and every target synset resolves to a WordNet node (the CODE
        panel's mammal&rarr;&hellip;&rarr;husky branch is the shape to verify). (3) On a synset with known
        ground truth, confirm majority-voting with the per-category confidence threshold actually flips a
        &sim;10%-precision pool up toward the target before spending on all synsets.</li>
        <li><b>Expected range.</b> A correct cleaning pipeline should reach the paper's <b>&sim;99.7% precision</b>
        on the sampled synsets (Figure 4), with "&sim;99% precision" overall (Section 2.1) &mdash; i.e. roughly
        $600\\times0.003\\approx2$ wrong images in a 600-image bucket. Density should land near the paper's "on
        average over 600 images ... per synset" (Section 2), consistent with $3{,}200{,}000/5247\\approx610$.
        Precision stuck near 90%+ wrong means the crowd stage is not filtering; precision near 100% but only a
        handful of images per synset means recall (search/expansion) is too weak. (Targets are the paper's;
        any per-batch thresholds you pick are rules of thumb.)</li>
        <li><b>Ablations &mdash; prove the key idea earns its keep.</b> The central component is the <b>crowd
        verification stage</b>: skip Amazon Mechanical Turk (keep raw search results as labels) and precision
        should <b>collapse from &sim;99.7% back to &sim;10%</b> &mdash; proof the precision comes from the crowd,
        not the search (Section 3.1&ndash;3.2). Second ablation: drop <b>majority voting</b> (trust one worker
        per image) and watch precision fall, especially on fine concepts like "Burmese cat". Third (structural):
        strip the WordNet <b>is-a hierarchy</b> to a flat list &mdash; the pile of images is identical but you
        lose multi-level grouping (147 dog breeds rolling up to "dog"&rarr;"mammal") and the Section 4
        tree-exploiting methods, confirming the hierarchy is half the contribution.</li>
        <li><b>Failure signals &amp; what they mean.</b> <i>Precision near 10% after cleaning</i> &rarr; crowd
        votes not applied or threshold too loose. <i>Many synsets with very few images</i> &rarr; query
        expansion/translation missing, so recall is starved (the paper notes "About 20% of the synsets have very
        few images", Figure 2 &mdash; expect some, not most). <i>Same word maps to mixed senses in one bucket</i>
        (riverbank vs financial bank) &rarr; you bypassed WordNet's synset disambiguation. <i>A hard concept
        ("Burmese cat") far below 99% while easy ones are fine</i> &rarr; the per-category confidence threshold
        is flat instead of demanding more votes where workers disagree.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b> paper: a dataset, not a model or algorithm. There is no PyTorch primitive to
       rebuild and no novel module to compose &mdash; so there is nothing to implement and verify here. What you
       <i>do</i> instead is <b>understand the dataset's design</b>: why it borrows WordNet's hierarchy, how the
       web-search-plus-crowdsourcing pipeline trades cheap recall for cheap precision, and what the reported
       scale and accuracy numbers mean. The CODE panel below prints a tiny <b>conceptual schematic</b> of one
       WordNet is-a branch (mammal &rarr; ... &rarr; husky) so the tree structure is concrete. It is a sketch of
       the <i>idea</i>, built from a few hand-typed node names &mdash; it does <b>not</b> download ImageNet,
       reproduce any figure, or compute any statistic.</p>`,
    pitfalls:
      `<ul>
        <li><b>Confusing the 2009 paper with ILSVRC / AlexNet.</b> This paper is the <i>dataset</i>. The famous
        1000-category competition (ILSVRC) and the 2012 AlexNet result came <i>later</i> and are not in this
        paper. <b>Fix:</b> cite the 2009 paper only for the dataset's construction and properties; attribute
        the challenge and the deep-net results to their own later papers.</li>
        <li><b>Reading "synset" as "image category" loosely.</b> A synset is a WordNet <i>concept</i> (a synonym
        set), not an arbitrary label someone invented. The hierarchy and the is-a links come from WordNet, which
        is why the categories relate to one another. <b>Fix:</b> remember the label space is borrowed, not
        designed from scratch.</li>
        <li><b>Assuming web search alone gives a clean dataset.</b> Raw search is "around 10%" accurate (Section
        3.1). Without the crowdsourcing stage, ImageNet would be &sim;90% noise. <b>Fix:</b> the precision comes
        from the human verification step, not the search.</li>
        <li><b>Treating one crowd worker's vote as the label.</b> Workers disagree, especially on fine
        concepts. The label is a <i>majority</i> over multiple workers, with more votes required for harder
        synsets. <b>Fix:</b> the quality control is the voting scheme, not any single annotation.</li>
        <li><b>Reading 3.2 million as the final size.</b> The 3.2-million / 5247-synset figure is the 2009
        <i>snapshot</i>; the stated goal is "around 50 million" images over "&sim; 50K synsets" (Sections 3 and
        5.1). <b>Fix:</b> quote the snapshot and the target as distinct numbers.</li>
      </ul>`,
    recall: [
      "Define 'synset' and state how many noun synsets WordNet has (per the paper).",
      "Name the two stages of the construction pipeline, and which one removes the noise.",
      "Roughly how accurate are raw web-search image results, per the paper? And the cleaned synsets?",
      "State the 2009 snapshot scale (subtrees, synsets, images) from memory.",
      "Why organize the images by WordNet's is-a hierarchy instead of a flat list of labels?"
    ],
    practice: [
      {
        q: `<b>How much does the crowd throw away?</b> The paper says each synset begins with "over 10K
            images on average" as web candidates, that raw search is "around 10%" accurate, and that the aim is
            500&ndash;1000 clean images per synset. (a) About how many truly-correct images are hiding in a
            10,000-candidate pool? (b) Why is a crowdsourcing step unavoidable given those numbers?`,
        steps: [
          { do: `Apply the search accuracy: $10{,}000 \\times 0.10 = 1{,}000$ correct images, so &sim;9,000 are wrong.`, why: `'Around 10%' accuracy means about one in ten candidates truly shows the concept; the rest are noise to be removed.` },
          { do: `Compare to the target: the &sim;1,000 correct images is just enough to fill the 500&ndash;1000-per-synset goal &mdash; but only if the &sim;9,000 wrong ones are removed first.`, why: `The clean target sits inside a pool that is &sim;90% noise, so the pool cannot be used as-is.` },
          { do: `Conclude: something must separate the &sim;1,000 right images from the &sim;9,000 wrong ones, at the scale of every synset. That is the crowdsourcing (AMT) stage.`, why: `Expert labeling would be too slow for millions of images; a paid crowd with majority voting does it cheaply and accurately.` }
        ],
        answer: `<p>(a) About $10{,}000 \\times 0.10 = 1{,}000$ correct images per synset, with roughly 9,000
                 wrong. (b) The clean target (500&ndash;1000 images) is buried in a pool that is &sim;90% noise,
                 so the candidates cannot be used directly. Removing the noise at the scale of every synset is
                 exactly what the Amazon Mechanical Turk verification stage does &mdash; majority voting by paid
                 crowd workers &mdash; lifting precision from &sim;10% to the reported &sim;99.7%.</p>`
      },
      {
        q: `<b>Average images per synset.</b> Using only the Abstract's figures &mdash; "5247 synsets and 3.2
            million images" &mdash; estimate the average number of images per synset, and check it against the
            paper's own statement.`,
        steps: [
          { do: `Divide total images by synsets: $3{,}200{,}000 / 5247$.`, why: `The average per bucket is total images divided by number of buckets (synsets).` },
          { do: `Compute: $3{,}200{,}000 / 5247 \\approx 610$.`, why: `Long division (or $3.2\\times10^6 / 5.247\\times10^3$) gives about 610.` },
          { do: `Compare to the paper: Section 2 says "on average over 600 images are collected for each synset" &mdash; the estimate matches.`, why: `A back-of-envelope average from the headline counts reproduces the paper's stated density, a good consistency check.` }
        ],
        answer: `<p>$3{,}200{,}000 / 5247 \\approx 610$ images per synset, which matches the paper's "on average
                 over 600 images are collected for each synset" (Section 2). The dataset is not only large in
                 total but dense per concept &mdash; roughly 600 images for a typical synset.</p>`
      },
      {
        q: `<b>Why the hierarchy (a structural ablation).</b> Suppose you stripped ImageNet's WordNet tree and
            kept only a flat list of 5247 unrelated labels with their images. The pile of images is identical.
            Name two capabilities you would lose, and tie each to something the paper points out.`,
        steps: [
          { do: `Lose fine-vs-coarse grouping: without is-a links you cannot tell that 147 dog breeds all roll up to "dog", or that "dog" rolls up to "mammal".`, why: `The paper highlights dense fine-grained coverage ("147 dog categories") that is only meaningful because the breeds nest under a common parent.` },
          { do: `Lose information sharing across related labels: you cannot pool or transfer knowledge between a concept and its neighbors in the tree.`, why: `The paper's Section 4 applications (tree-based classification, the 'tree-max classifier') exploit the hierarchy to improve classification "without additional training" &mdash; impossible on a flat list.` },
          { do: `Note the labels themselves get weaker: WordNet's structure is what disambiguates a word ("bank" the riverbank vs. the financial institution); a flat list of bare words loses that.`, why: `The paper argues sense disambiguation comes "by construction" from WordNet (Section 2.1); flattening throws it away.` }
        ],
        answer: `<p>Flattening keeps the images but discards the tree, so you lose: (1) <b>multi-level grouping</b>
                 &mdash; the 147 dog breeds no longer roll up under "dog" or "mammal", erasing the dense
                 fine-grained structure the paper highlights; and (2) <b>cross-label reasoning</b> &mdash; the
                 hierarchy-exploiting methods in Section 4 (e.g. the tree-max classifier that improves accuracy
                 "without additional training") become impossible. You also weaken the labels themselves, since
                 WordNet's structure is what disambiguates word senses "by construction" (Section 2.1). The
                 hierarchy is not decoration; it is half the contribution.</p>`
      }
    ]
  });

  window.CODE["paper-imagenet"] = {
    lib: "Python",
    runnable: false,
    explain:
      `<p>This is a <b>read-only</b> dataset paper, so there is no model to train or verify. The snippet below is
       a tiny <b>conceptual schematic</b> only: it hand-codes one WordNet "is-a" branch &mdash; the same
       mammal &rarr; placental &rarr; carnivore &rarr; canine &rarr; dog &rarr; working dog &rarr; husky chain
       that the paper's Figure 1 illustrates &mdash; and prints it as an indented tree, so the hierarchy
       ImageNet hangs its image buckets on is concrete. The node names are typed by hand to show the
       <i>structure</i>; this code does <b>not</b> download ImageNet, reproduce any figure, or compute any
       statistic. Pure standard-library Python, runs instantly.</p>`,
    code: `# Conceptual schematic ONLY -- a hand-typed WordNet "is-a" branch.
# This is NOT the ImageNet dataset, NOT the paper's figure, NOT any statistic.
# It just shows the TREE STRUCTURE that ImageNet attaches image buckets to:
# each node is a "synset" (a WordNet concept); an edge means "is-a".

# One root-to-leaf branch, mirroring the paper's Figure 1 (mammal subtree).
branch = [
    "mammal",       # the subtree root (one of the paper's 12 subtrees)
    "placental",
    "carnivore",
    "canine",
    "dog",
    "working dog",
    "husky",        # a leaf: a fine-grained synset
]

# Print it as an indented "is-a" tree. Each level is a kind of the level above.
print("WordNet is-a branch (conceptual sketch -- not data):\\n")
for depth, synset in enumerate(branch):
    indent = "    " * depth
    arrow = "" if depth == 0 else "is-a "
    print(f"{indent}{arrow}[{synset}]   <- a synset (image bucket attaches here)")

print()
print("In ImageNet, EVERY node here is a synset with its own bucket of images")
print("(the paper reports on average >600 images per synset). The husky images")
print("are also, by is-a, instances of dog, canine, ... mammal. That inherited")
print("tree is what a FLAT list of labels would throw away.")

# Expected output (structure only; no dataset is touched):
# [mammal]   <- a synset (image bucket attaches here)
#     is-a [placental]   <- a synset (image bucket attaches here)
#         is-a [carnivore]   <- a synset (image bucket attaches here)
#             is-a [canine]   <- a synset (image bucket attaches here)
#                 is-a [dog]   <- a synset (image bucket attaches here)
#                     is-a [working dog]   <- a synset (image bucket attaches here)
#                         is-a [husky]   <- a synset (image bucket attaches here)`
  };

  window.CODEVIZ["paper-imagenet"] = {
    question: "What does the WordNet 'is-a' hierarchy that ImageNet hangs its image buckets on actually look like? (A conceptual sketch of ONE branch -- no dataset, no statistics, not the paper's figure.)",
    charts: [],
    caption: "Conceptual schematic only -- NOT the paper's data or figure. ImageNet attaches a bucket of images to each WordNet synset (concept) and inherits WordNet's 'is-a' tree, so the buckets are connected: husky is-a working dog is-a dog is-a canine is-a carnivore is-a placental is-a mammal. The paper's Figure 1 shows exactly this mammal branch (and a parallel vehicle branch). The text-tree printed by the CODE panel above draws this one branch from a few hand-typed node names; it contains no dataset statistics. The paper's own reported numbers -- 12 subtrees, 5247 synsets, 3.2 million images, ~600 images per synset, ~99.7% precision -- are quoted in the lesson body, not reproduced here.",
    code: `# Same conceptual schematic as the CODE panel: one hand-typed WordNet is-a branch.
# No chart is drawn (this is a read-only dataset paper; there is no curve to plot
# and no run to visualize). We print the tree structure as text instead.
branch = ["mammal", "placental", "carnivore", "canine", "dog", "working dog", "husky"]
for depth, synset in enumerate(branch):
    print("    " * depth + ("" if depth == 0 else "is-a ") + "[" + synset + "]")
# [mammal]
#     is-a [placental]
#         is-a [carnivore]
#             is-a [canine]
#                 is-a [dog]
#                     is-a [working dog]
#                         is-a [husky]
# Structure only -- not the ImageNet dataset, not the paper's Figure 1, no statistics.`
  };
})();
