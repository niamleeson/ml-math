/* Paper lesson — "Microsoft COCO: Common Objects in Context", Lin, Maire, Belongie,
   Bourdev, Girshick, Hays, Perona, Ramanan, Zitnick, Dollar (2014).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-mscoco".
   GROUNDED from arXiv:1405.0312 (abstract) and the ar5iv HTML mirror:
   Abstract (2.5M labeled instances in 328k images; 91 object types; per-instance
   segmentation); Section 1 (iconic vs non-iconic; the three problems: detecting
   non-iconic views, contextual reasoning, precise 2D localization; why fully
   segmented instances over boxes); Section 2 (related datasets: PASCAL, ImageNet,
   SUN); Section 4 (the annotation pipeline: 4.1 category labeling, 4.2 instance
   spotting, 4.3 instance segmentation; 91 categories in 11 super-categories);
   Section 5 (statistics: 7.7 instances per image vs PASCAL 2.3; 3.5 categories per
   image; Figures 5b/5c); Section 7 (Deformable Parts Model baseline; IoU-based
   detection/segmentation evaluation, Figure 8).
   Track: read-only (DATASET / benchmark paper). No implementation cell.
   The CODEVIZ is a tiny CONCEPTUAL schematic (a bar comparison of "objects per
   image"); the two numbers shown are QUOTED from the paper (Section 5) with
   attribution, not a run of ours. */
(function () {
  window.LESSONS.push({
    id: "paper-mscoco",
    title: "COCO — Microsoft COCO: Common Objects in Context (2014)",
    tagline: "A large dataset of everyday scenes where common objects are labeled with per-instance segmentation masks, not just boxes.",
    module: "Papers · Datasets, Benchmarks & Surveys",
    track: "read-only",
    paper: {
      authors: "Tsung-Yi Lin, Michael Maire, Serge Belongie, Lubomir Bourdev, Ross Girshick, James Hays, Pietro Perona, Deva Ramanan, C. Lawrence Zitnick, Piotr Dollar",
      org: "Microsoft, Cornell, Caltech, Facebook AI Research, Brown, UC Irvine",
      year: 2014,
      venue: "ECCV 2014 (arXiv:1405.0312)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1405.0312",
      code: "https://cocodataset.org"
    },
    conceptLink: null,
    partOf: [],
    prereqs: [],

    // WHY READ IT
    problem:
      `<p>By 2014, computer vision had a powerful dataset for <b>classification</b> &mdash; ImageNet, which asks
       "what single object is in this picture?" But real images are not one clean object on a clean background.
       A kitchen photo has a person, a bowl, a spoon, a microwave, and a chair, all at once, some half-hidden
       behind others. The hard problems of <b>scene understanding</b> were barely tested: finding <i>every</i>
       object, saying exactly <i>where</i> each one is, and reasoning about how objects relate.</p>
       <p>A few terms first. <b>Object detection</b> means finding each object and drawing a box around it (a
       <b>bounding box</b> &mdash; the smallest rectangle that covers the object). <b>An iconic image</b> is a
       clean, posed, centered shot of one object &mdash; the kind a stock photo or a dictionary uses. A
       <b>non-iconic image</b> is a normal everyday photo: the object is off-center, small, partly blocked, or
       buried in clutter. The paper's worry, quoted: "current recognition systems perform fairly well on iconic
       views, but struggle to recognize objects otherwise &ndash; in the background, partially occluded, amid
       clutter." (&sect;1.)</p>
       <p>Existing detection benchmarks were too small or too iconic to push on this. PASCAL VOC had few objects
       per image. ImageNet was built for classification, one dominant object per picture. So the paper asks: can
       we build a dataset of <b>complex everyday scenes</b>, with <b>many common objects</b> shown in their
       <b>natural context</b>, each one outlined precisely &mdash; at a scale large enough to train and fairly
       measure modern detectors?</p>`,
    contribution:
      `<ul>
        <li><b>A new kind of dataset: common objects in context.</b> Photographs of everyday scenes, chosen so
        that objects appear in their natural surroundings rather than posed alone. The abstract describes "images
        depicting complex everyday scenes containing common objects in their natural context," with "photos of 91
        objects types that would be easily recognizable by a 4 year old." (Abstract.)</li>
        <li><b>Per-instance segmentation, not just boxes.</b> Every object instance is outlined with a
        <b>segmentation mask</b> &mdash; the exact set of pixels belonging to that one object &mdash; rather than a
        coarse rectangle. The paper argues boxes are too crude: "The use of bounding boxes also limits the accuracy
        for which detection algorithms may be evaluated. We propose the use of fully segmented instances to enable
        more accurate detector evaluation." (&sect;1.)</li>
        <li><b>Large scale, many objects per image.</b> The headline, quoted: "a total of 2.5 million labeled
        instances in 328k images." (Abstract.) Crucially, images are crowded &mdash; on average 7.7 object
        instances per image (&sect;5), far more than earlier detection sets.</li>
        <li><b>A scalable crowdsourcing pipeline.</b> A three-stage annotation process (category labeling, instance
        spotting, instance segmentation) with custom interfaces, run on crowd workers (&sect;4).</li>
      </ul>`,
    whyItMattered:
      `<p>COCO became <b>the</b> standard benchmark for object detection, instance segmentation, and (with a later
       caption-annotation release) image captioning. For most of the decade after 2014, a new detection or
       segmentation model was expected to report its score on COCO; if it did not, people asked why. The
       <b>per-instance masks</b> made the dataset usable for tasks bounding boxes cannot support &mdash;
       <b>instance segmentation</b>, where a model must output the exact pixels of each separate object (so it can
       tell two overlapping people apart), which became a flagship task in its own right.</p>
       <p>COCO also gave the field a shared scorecard: the <b>COCO detection metric</b>. Its headline number,
       usually written <b>mAP</b> (mean Average Precision &mdash; the detection accuracy averaged across object
       categories, and in COCO's evaluation also averaged across several strictness levels of overlap), turned
       "how good is my detector?" into a single comparable figure. Reporting "COCO mAP" became routine. The paper
       itself (&sect;7) establishes the IoU-overlap-based evaluation of detections against the masks; the now-famous
       convention of averaging mAP over many overlap thresholds was formalized by the accompanying COCO evaluation
       server and is the standard people cite today. The lasting idea: <b>measure detection on crowded, realistic
       scenes with precise masks, and average the score so it rewards accurate localization.</b></p>`,

    // READING GUIDE
    readingGuide:
      `<p>This is a <b>dataset paper</b>: read it for design choices and the annotation pipeline, not for a model.</p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the motivation: iconic vs. non-iconic images, the three problems
        the dataset targets ("detecting non-iconic views of objects, contextual reasoning between objects and the
        precise 2D localization of objects"), and the argument for segmentation masks over boxes. This is the heart
        of the "why."</li>
        <li><b>&sect;2 (Related datasets)</b> &mdash; how COCO compares to PASCAL VOC, ImageNet, and SUN. Skim for
        the framing: COCO trades breadth of categories for depth of instances per category.</li>
        <li><b>&sect;3 (Image Collection)</b> &mdash; how images were gathered to be non-iconic, including searching
        for object <i>pairs</i> to find cluttered scenes (&sect;3.2).</li>
        <li><b>&sect;4 (Image Annotation)</b> &mdash; <b>read closely.</b> The three-stage pipeline and Figure 3:
        &sect;4.1 category labeling, &sect;4.2 instance spotting, &sect;4.3 instance segmentation. This is the
        engineering contribution.</li>
        <li><b>&sect;5 (Dataset Statistics)</b> and its figures &mdash; the numbers you will quote: instances per
        image (Figure 5c), categories per image (Figure 5b), comparisons to PASCAL.</li>
        <li><b>&sect;7 (Algorithmic Analysis)</b> &mdash; the Deformable Parts Model baseline and the IoU-based
        evaluation of boxes and masks (Figure 8); skim for how hard COCO is versus PASCAL.</li>
       </ul>
       <p>You do <b>not</b> implement this paper. There is no model to build. Read it for the dataset's design and
       why that design reshaped how detection is measured.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>The paper reports that an average COCO image contains <b>7.7</b> labeled object instances (&sect;5), while
       the average PASCAL VOC image contains <b>2.3</b> (&sect;5). Before reading on, guess: when researchers ran an
       existing detector (a Deformable Parts Model, the strong 2014 baseline) on COCO instead of PASCAL, did its
       average detection accuracy go <b>up</b>, stay <b>about the same</b>, or go <b>down</b> &mdash; and by roughly
       how much? Write one sentence on why crowded, non-iconic scenes would change the score.</p>
       <p>(Hint: more objects per image, smaller and more occluded, on harder non-iconic views. The paper's answer
       is in &sect;7 and is quoted later in this lesson.)</p>`,
    attempt:
      `<p>This is a read-only dataset paper, so there is nothing to build from scratch. Instead, before the reveal,
       reason about the dataset's design on paper:</p>
       <ul>
        <li>Write down the difference between a <b>bounding box</b> (a rectangle) and a <b>segmentation mask</b>
        (the exact pixels of one object). For two people standing so their rectangles overlap heavily, which
        representation can still separate them, and why?</li>
        <li>The annotation pipeline has three stages: <i>category labeling</i> (which object types are present),
        <i>instance spotting</i> (mark every separate instance), <i>instance segmentation</i> (outline each one).
        TODO: explain why this order matters &mdash; why is it cheaper to first ask "is there a dog at all?" before
        asking a worker to trace the dog's outline?</li>
        <li>TODO: COCO has "fewer categories but more instances per category" than ImageNet (&sect;2). Argue, in one
        sentence, why <i>more instances per category</i> (rather than more categories) is the right trade for
        learning to <b>detect and localize</b> objects in cluttered scenes.</li>
       </ul>
       <p>The CODEVIZ panel below is a tiny schematic comparing the paper's own "objects per image" numbers for
       COCO and PASCAL &mdash; both figures quoted from &sect;5, not produced by us.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>There is no equation to derive here &mdash; COCO is a dataset. "How it works" means <b>how the dataset is
       designed and how it was built.</b> Three design choices and a three-stage pipeline.</p>
       <p><b>Design choice 1 &mdash; non-iconic images of objects in context.</b> The authors deliberately avoided
       clean, posed photos. An <b>iconic</b> image shows one object, centered and unobstructed; a <b>non-iconic</b>
       image is a messy real scene. To find messy scenes, &sect;3.2 describes searching for <i>pairs</i> of object
       types together (for example "dog + frisbee"), which "found many more non-iconic images" than searching for a
       single object. The payoff: detectors trained and tested here must handle small, occluded, off-center objects
       &mdash; the realistic case.</p>
       <p><b>Design choice 2 &mdash; per-instance segmentation masks.</b> Each object instance is outlined at the
       pixel level. A <b>segmentation mask</b> is the set of pixels that belong to exactly one object; this is
       <b>instance segmentation</b> (separating each individual object), distinct from <b>semantic segmentation</b>
       (which only labels pixels by class and would merge two overlapping people into one "person" blob). Masks are
       chosen over boxes for precision: the paper argues boxes "limit the accuracy for which detection algorithms
       may be evaluated" and proposes "fully segmented instances to enable more accurate detector evaluation."
       (&sect;1.)</p>
       <p><b>Design choice 3 &mdash; many common objects, large scale.</b> The categories are 91 common object types
       (the abstract's "91 objects types that would be easily recognizable by a 4 year old"), grouped into 11
       <b>super-categories</b> (broad groups like "animal" or "vehicle"). The scale, quoted: "2.5 million labeled
       instances in 328k images." (Abstract.) Compared to ImageNet, the paper notes COCO "has fewer categories but
       more instances per category" (&sect;2) &mdash; depth over breadth, which is what detection needs.</p>
       <p><b>The annotation pipeline (&sect;4, Figure 3).</b> Outlining 2.5 million objects by hand is impossible to
       do in one pass, so the work is split into three cheaper stages, each run by separate crowd workers:</p>
       <ol>
        <li><b>Category labeling (&sect;4.1).</b> For each image, workers mark which of the 91 categories are
        present. To keep it fast, "only a single instance of each category needs to be annotated in this stage" and
        the 91 categories are presented through the 11 super-categories so a worker can skip whole groups at a
        glance. This answers "<i>what</i> is here?"</li>
        <li><b>Instance spotting (&sect;4.2).</b> Now that the present categories are known, workers place a marker
        (a cross) on <b>every separate instance</b> of each labeled category &mdash; all twelve people, all three
        cups. This answers "<i>how many</i>, and roughly where?" It is much cheaper than tracing outlines, and it
        guarantees no instance is missed before the expensive step.</li>
        <li><b>Instance segmentation (&sect;4.3).</b> Finally, workers trace the precise pixel outline of each
        spotted instance using a segmentation interface. This is the costly, skilled step, so it is done last and
        only on instances already confirmed and located. Quality is enforced by training workers and by having
        several workers verify each segmentation.</li>
       </ol>
       <p>The order is the whole trick: <b>cheap, coarse questions first; expensive, precise work last, and only
       where it is needed.</b> Each stage hands a smaller, cleaner job to the next.</p>`,
    architecture:
      `<p>COCO has no neural network, so its "architecture" is the <b>annotation pipeline</b> (&sect;4, Figure 3) and
       the <b>design principles</b> that shape what gets annotated. Think of it as a data-flow diagram: a raw image
       enters, three stages of human labeling transform it, and a fully-annotated image &mdash; every instance of
       every present category traced as a pixel mask &mdash; comes out. Every stage runs on <b>Amazon Mechanical
       Turk</b> (AMT) crowd workers.</p>
       <p><b>The three-stage annotation pipeline (data flow, left to right).</b></p>
       <ol>
        <li><b>Stage 1 &mdash; Category labeling (&sect;4.1).</b>
        <i>Input:</i> a raw image. <i>Task:</i> a worker marks which of the 91 categories are <i>present</i>,
        navigating via the 11 super-categories (e.g. "animal", "vehicle") so whole groups can be dismissed at a
        glance; only one instance of each present category must be flagged. <i>Output:</i> the set of present
        categories. <i>Cost:</i> the paper uses 8 annotators per image (the most worker-hours of any stage,
        because every image must be scanned for all categories). This answers "<b>what is here?</b>"</li>
        <li><b>Stage 2 &mdash; Instance spotting (&sect;4.2).</b>
        <i>Input:</i> the image plus its present-category list. <i>Task:</i> a worker places a marker (a cross) on
        <b>every separate instance</b> of each present category &mdash; all the people, all the cups. <i>Output:</i>
        one marker per object instance (counts and rough locations). <i>Cost:</i> 8 workers per image, but each is
        cheap. This answers "<b>how many, and roughly where?</b>" and guarantees no instance is missed before the
        expensive step.</li>
        <li><b>Stage 3 &mdash; Instance segmentation (&sect;4.3).</b>
        <i>Input:</i> the image plus every instance marker. <i>Task:</i> a trained worker traces the precise pixel
        outline of each marked instance with a custom segmentation interface. <i>Output:</i> one per-instance
        segmentation mask per object. <i>Cost:</i> the skilled, slow step, so it runs last and only on
        already-confirmed, already-located instances; a separate pass of 3&ndash;5 workers verifies each mask's
        quality. This answers "<b>exactly which pixels?</b>"</li>
       </ol>
       <p>The connections matter: each stage's output is the next stage's input, narrowing the work. Stage 1 filters
       <i>which categories</i>, stage 2 enumerates <i>which instances</i>, stage 3 traces <i>which pixels</i> &mdash;
       a coarse-to-fine cascade so the costly tracing only ever touches pre-filtered, pre-located targets.</p>
       <p><b>The three design principles the pipeline serves.</b></p>
       <ul>
        <li><b>Non-iconic images.</b> Collect messy, real, everyday photos rather than clean posed shots, so the
        benchmark contains the hard case (small, occluded, off-center objects) it claims to measure (&sect;1, &sect;3.2).</li>
        <li><b>Objects in context.</b> Keep objects in their natural surroundings, with many object types co-occurring
        per image (3.5 categories and 7.7 instances per image on average, &sect;5), to test contextual reasoning
        &mdash; the dataset's name, "Common Objects in Context."</li>
        <li><b>Per-instance segmentation.</b> Label every instance with a precise pixel mask, not a bounding box, so
        localization can be measured tightly and overlapping instances kept apart &mdash; "to measure either kind of
        localization performance it is essential for the dataset to have every instance of every object category
        labeled and fully segmented" (&sect;1).</li>
       </ul>
       <p>(<b>Evaluation, &sect;7,</b> sits downstream of all this: detections are scored against the masks/boxes by
       IoU, the one formula above. It is how the annotated dataset becomes a benchmark, not part of the annotation
       pipeline itself.)</p>`,
    symbols: [
      { sym: "“iconic image”", desc: "a plain term, not a symbol: a clean, posed photo of a single object, centered and unobstructed (like a stock photo). The paper says systems do &ldquo;fairly well&rdquo; on these (&sect;1)." },
      { sym: "“non-iconic image”", desc: "the realistic opposite: an everyday photo where the object is small, off-center, partially occluded (blocked by another object), or amid clutter. COCO deliberately favors these (&sect;3.2)." },
      { sym: "“in context”", desc: "objects shown together in their natural surroundings &mdash; a fork next to a plate on a table &mdash; rather than each object isolated. The dataset's name, &ldquo;Common Objects in Context,&rdquo; is this idea." },
      { sym: "“bounding box”", desc: "the smallest rectangle that fully encloses an object. The standard, coarse way to mark an object's location before COCO." },
      { sym: "“segmentation mask”", desc: "the exact set of pixels that belong to one object &mdash; a precise outline rather than a rectangle. COCO labels every instance this way." },
      { sym: "“instance segmentation”", desc: "labeling each pixel with <i>which individual object</i> it belongs to, so two overlapping people are kept separate. Distinct from <b>semantic segmentation</b>, which only labels each pixel's class and would merge them." },
      { sym: "“instance”", desc: "one individual object (one specific dog), as opposed to a category (the class &ldquo;dog&rdquo;). COCO reports 2.5 million labeled <i>instances</i>." },
      { sym: "“category” / “super-category”", desc: "a category is an object type (e.g. &ldquo;cat&rdquo;); a super-category is a broad group of categories (e.g. &ldquo;animal&rdquo;). COCO uses 91 categories in 11 super-categories (&sect;4)." },
      { sym: "“IoU” (Intersection over Union)", desc: "an overlap score between a predicted region and the true region: the area of their intersection divided by the area of their union. 1 means perfect overlap, 0 means none. COCO evaluates detections by IoU against the masks/boxes (&sect;7)." },
      { sym: "“mAP” (mean Average Precision)", desc: "the standard detection score. <b>AP</b> (Average Precision) summarizes how well a detector ranks correct detections for one category; <b>mAP</b> averages AP across all categories. COCO's evaluation also averages over several IoU strictness levels, so a high COCO mAP demands accurate localization, not just rough hits." },
      { sym: "“crowdsourcing”", desc: "splitting a large labeling job across many online workers. COCO's annotations were produced by crowd workers through the three-stage pipeline (&sect;4)." }
    ],
    formula: `<p><b>COCO is a dataset paper, so it is light on math.</b> It introduces no learning objective and proves no
       theorem. Its one real equation is the <b>scoring rule</b> for a detection; the rest of its "key numbers" are
       <i>reported dataset statistics</i>, which we state as quoted facts. Here are both.</p>
       $$ \\text{IoU}(A, B) \\;=\\; \\frac{\\text{area}(A \\cap B)}{\\text{area}(A \\cup B)} $$
       <p>The one equation (&sect;7): <b>Intersection over Union</b> of a predicted region $A$ and the true region
       $B$ &mdash; the area where they overlap divided by the area they jointly cover. A detection counts as correct
       when this clears a threshold; the paper "impose[s] the standard requirement that intersection over union
       between predicted and ground truth boxes is at least $0.5$," then "measure[s] the intersection over union of
       the predicted and ground truth segmentation masks" (&sect;7).</p>
       $$ \\text{(scale, Abstract)}\\quad 2.5\\text{M labeled instances},\\;\\; 328\\text{k images},\\;\\; 91\\text{ object categories} $$
       <p>Quoted from the Abstract: "a total of 2.5 million labeled instances in 328k images," over "91 objects
       types that would be easily recognizable by a 4 year old" (organized into 11 super-categories, &sect;4).</p>
       $$ \\text{(crowding, §5)}\\quad \\overline{\\text{instances/image}}:\\;\\; \\text{COCO }7.7 \\;\\gt\\; \\text{ImageNet }3.0 \\;\\gt\\; \\text{PASCAL }2.3, \\qquad \\overline{\\text{categories/image}} \\approx 3.5 $$
       <p>Quoted from &sect;5: "MS COCO contains considerably more object instances per image (7.7) as compared to
       ImageNet (3.0) and PASCAL (2.3)"; "on average our dataset contains 3.5 categories and 7.7 instances per
       image." These are the paper's reported figures, not a computation of ours.</p>`,
    whatItDoes:
      `<p>A dataset paper has no learning equation, but it does fix how a detection is <b>scored</b>, and that one
       formula is worth stating. <b>Intersection over Union (IoU)</b> compares a predicted region $A$ (a box or a
       mask the model output) against the true region $B$ (the human-annotated box or mask). It takes the area
       where they <b>overlap</b> ($A \\cap B$, the intersection) and divides by the area they <b>cover together</b>
       ($A \\cup B$, the union).</p>
       <p>If the prediction lands exactly on the object, intersection equals union and IoU $= 1$. If they do not
       touch, the intersection is $0$ and IoU $= 0$. A detection is counted as correct only if its IoU clears a
       threshold (say $0.5$). Because COCO outlines objects with precise masks and (in the standard evaluation)
       averages the score over <b>several</b> IoU thresholds, a good COCO score requires the prediction to hug the
       object tightly &mdash; rough boxes are not enough. That strictness is the point: it rewards <b>accurate
       localization</b> in crowded scenes, which is exactly what the dataset was built to test.</p>`,
    derivation:
      `<p>This is a <b>dataset paper</b>: there is nothing to derive from first principles. The "why it is true"
       here is "why these design decisions follow from the goal," which is the reasoning to check.</p>
       <p><b>Why non-iconic, in-context images?</b> The stated goal is scene understanding &mdash; "detecting
       non-iconic views of objects, contextual reasoning between objects and the precise 2D localization of
       objects" (&sect;1). You cannot measure progress on non-iconic detection with a test set of iconic photos:
       the test must contain the hard case to score it. So the dataset is built to be hard on purpose, by
       collecting cluttered everyday scenes (and, &sect;3.2, by searching for object pairs to surface them).</p>
       <p><b>Why per-instance masks instead of boxes?</b> The argument is about <i>measurement granularity</i>. A
       box can only say "the object is somewhere in this rectangle." For overlapping or oddly-shaped objects, two
       very different predictions can score the same against a box. A pixel mask removes that slack &mdash; it lets
       the benchmark tell a tight, correct outline from a loose, wrong one. The paper makes exactly this point:
       boxes "limit the accuracy for which detection algorithms may be evaluated," so it proposes "fully segmented
       instances to enable more accurate detector evaluation" (&sect;1).</p>
       <p><b>Why fewer categories but more instances each?</b> Detection and localization need many <i>examples of
       each object type in varied poses and contexts</i> to learn from and to test on. Spreading the same labeling
       effort across thousands of categories (ImageNet's choice) gives few instances each; concentrating it on 91
       common categories gives the depth that detection needs. The paper frames the contrast directly: COCO "has
       fewer categories but more instances per category" (&sect;2).</p>
       <p><b>Why a three-stage pipeline?</b> Each stage is ordered by cost. Asking "which categories are present?"
       is fast; "mark every instance" is medium; "trace each outline" is slow and skilled. Doing the cheap
       filtering first means the expensive tracing only ever runs on objects already confirmed and located &mdash;
       the minimum expensive work. That is the same logic as a coarse-to-fine search.</p>`,
    example:
      `<p>There is no formula to plug numbers into, so the worked example walks the <b>annotation pipeline</b>
       through one image, using the paper's design (&sect;4), and then computes one IoU by hand. Take a park scene
       with two people, one dog, and one frisbee. The three stages narrow the work from "what types?" to "which
       pixels?":</p>
       <table class="extable">
        <caption>The three-stage annotation pipeline (&sect;4) run on one park image. Each stage hands a smaller, more precise job to the next.</caption>
        <thead>
         <tr><th>stage</th><th>question it answers</th><th>output on this image</th><th class="num">items produced</th></tr>
        </thead>
        <tbody>
         <tr><td class="row-h">1 &mdash; category labeling (&sect;4.1)</td><td>what is here?</td><td>{person, dog, frisbee} present</td><td class="num">3 categories</td></tr>
         <tr><td class="row-h">2 &mdash; instance spotting (&sect;4.2)</td><td>how many, roughly where?</td><td>a cross on each: 2 people, 1 dog, 1 frisbee</td><td class="num">4 markers</td></tr>
         <tr><td class="row-h">3 &mdash; instance segmentation (&sect;4.3)</td><td>exactly which pixels?</td><td>a traced pixel mask per spotted instance</td><td class="num">4 masks</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Stage 1</b> marks only that each type is <i>present</i> &mdash; "only a single instance of each
        category needs to be annotated in this stage" &mdash; scanning via the 11 super-categories.</li>
        <li><b>Stage 2</b> places a cross on <b>every</b> separate instance, so counts and rough locations are
        complete and nothing is missed before the expensive step.</li>
        <li><b>Stage 3</b> traces the precise outline of each of the 4 spotted instances; several workers verify
        each mask. This crowded little image contributes 4 of COCO's 2.5 million labeled instances &mdash; close
        to the dataset average of <b>7.7 instances per image</b> (&sect;5).</li>
       </ul>
       <p><b>Scoring one detection with IoU.</b> A detector predicts a mask of area $A = 100$ pixels for the dog,
       the true mask has area $B = 120$ pixels, and they overlap on $80$ pixels:</p>
       <ul class="steps">
        <li><b>Intersection</b> $= \\text{overlap} = 80$ pixels.</li>
        <li><b>Union</b> $= \\text{area}(A) + \\text{area}(B) - \\text{overlap} = 100 + 120 - 80 = 140$ pixels.</li>
        <li><b>IoU</b> $= 80 / 140 = \\mathbf{0.571}$.</li>
        <li><b>Threshold test:</b> $0.571 \\ge 0.5$, so this counts as correct at the $0.5$ threshold; but
        $0.571 \\lt 0.75$, so it fails the stricter $0.75$ threshold.</li>
       </ul>
       <p>COCO's standard score averages across such thresholds, so this "okay but not tight" prediction is
       rewarded at the lenient end and penalized at the strict end &mdash; exactly the localization pressure the
       masks make possible. The CODEVIZ recomputes that IoU and shows the paper's quoted "objects per image"
       comparison &mdash; COCO 7.7 vs. PASCAL 2.3 (&sect;5).</p>`,
    recipe:
      `<p>This is a read-only paper, so there is no architecture to assemble. Instead, here is the procedure the
       paper uses to <b>build</b> the dataset &mdash; the recipe you would follow to construct a detection benchmark
       like COCO:</p>
       <ol>
        <li><b>Choose categories for depth, not breadth.</b> Pick a modest set of common object types (COCO: 91
        categories in 11 super-categories) so each gets many instances, instead of thousands of rare categories.</li>
        <li><b>Collect non-iconic, in-context images.</b> Gather everyday scenes, not posed shots; surface cluttered
        ones by searching for <i>pairs</i> of object types together (&sect;3.2).</li>
        <li><b>Stage 1 &mdash; label present categories.</b> Crowd workers tick which categories appear, navigating
        by super-category; mark presence only, not every instance (&sect;4.1).</li>
        <li><b>Stage 2 &mdash; spot every instance.</b> Workers place a marker on each separate object of the
        labeled categories, so counts and rough positions are complete before any tracing (&sect;4.2).</li>
        <li><b>Stage 3 &mdash; segment each instance.</b> Trained workers trace a precise pixel mask per spotted
        instance; verify each with several workers (&sect;4.3).</li>
        <li><b>Define the evaluation.</b> Score detections by IoU overlap against the masks/boxes; average to a mAP
        so the benchmark rewards accurate localization (&sect;7, and the COCO evaluation server).</li>
       </ol>`,
    results:
      `<p><b>Scale (quoted, Abstract):</b> "a total of 2.5 million labeled instances in 328k images," covering "91
       objects types that would be easily recognizable by a 4 year old."</p>
       <p><b>Crowding (quoted/transcribed, &sect;5):</b> COCO contains considerably more object instances per image
       &mdash; an average of <b>7.7</b> instances per image (Figure 5c) versus <b>2.3</b> for PASCAL VOC &mdash; and
       about <b>3.5</b> categories per image on average (Figure 5b).</p>
       <p><b>Depth over breadth (quoted, &sect;2):</b> "In contrast to the popular ImageNet dataset, COCO has fewer
       categories but more instances per category."</p>
       <p><b>Difficulty (transcribed, &sect;7):</b> the paper runs a Deformable Parts Model baseline and reports
       that average detection performance drops by nearly a factor of two on COCO compared to PASCAL, which it reads
       as evidence that COCO contains "more difficult (non-iconic) images." Detection and segmentation are evaluated
       by IoU overlap against the masks and boxes (Figure 8).</p>
       <p><i>These are the paper's own statements and numbers, transcribed from the abstract, &sect;2, &sect;5, and
       &sect;7. The one comparison redrawn in the CODEVIZ below (7.7 vs. 2.3 objects per image) is quoted from
       &sect;5, not a computation of ours.</i></p>`,
    evaluation:
      `<p>There is no model to train here, so "is it working?" has two readings: (a) is your <b>IoU / detection
        scoring</b> implemented right, and (b) did you <b>load and read the dataset</b> correctly. Both are
        checkable.</p>
       <p><b>1. The metric &amp; benchmark.</b> The scoring rule is <b>IoU</b> $=\\text{area}(A\\cap B)/\\text{area}(A\\cup B)$,
        and a detector is summarized by <b>mAP</b> &mdash; AP averaged over the categories and, in COCO's standard
        eval, over IoU thresholds $0.5,0.55,\\dots,0.95$ (&sect;7 + the eval server). The "no-skill" floor is a
        <b>random / blank detector</b> (AP&nbsp;$\\to 0$); the meaningful reference the paper reports is the
        <b>Deformable Parts Model baseline</b>, whose average detection performance <b>drops by nearly a factor of
        two on COCO vs. PASCAL</b> (&sect;7) &mdash; that gap is the signal COCO is harder, not that your code is
        broken.</p>
       <p><b>2. Sanity checks before any full evaluation.</b> (i) <b>IoU known-answer test:</b> reproduce the worked
        example &mdash; pred area $100$, true area $120$, overlap $80$ &rarr; IoU $=80/140\\approx0.571$; correct at
        $0.5$, not at $0.75$. (ii) <b>IoU bounds:</b> identical regions give IoU $=1$, disjoint regions give $0$, and
        $0\\le\\text{IoU}\\le1$ always &mdash; if you ever get $\\gt 1$, you forgot to subtract the overlap in the
        union ($\\text{union}=\\text{area}(A)+\\text{area}(B)-\\text{overlap}$). (iii) <b>Loader sanity:</b> every
        annotation has both a mask and a category in one of the 11 super-categories; instance masks for the same
        image do not all collapse to one blob (that would be semantic, not <b>instance</b>, segmentation).</p>
       <p><b>3. Expected range.</b> Anchor to the paper's <i>dataset</i> statistics, not invented scores: average
        <b>7.7</b> instances per image, <b>3.5</b> categories per image (&sect;5), "<b>2.5 million</b> labeled
        instances in <b>328k</b> images," 91 categories (abstract, &sect;4). If your loader reports ~2.3
        instances/image you are accidentally reading PASCAL-style data; ~1 instance/image means you collapsed
        instances. These are the paper's reported figures &mdash; use them as the target, do not fabricate an mAP for
        this 2014 paper (it predates the headline mAP convention).</p>
       <p><b>4. Ablation &mdash; prove the central idea earns its keep.</b> COCO's thesis is that <b>per-instance
        masks + crowded non-iconic scenes</b> measure localization that boxes cannot. To show it: score the same
        predictions with <b>box-IoU</b> vs <b>mask-IoU</b> &mdash; the mask metric is <i>stricter</i> and separates
        a tight outline from a loose one; if your two scores are identical you are treating masks as boxes. Second
        ablation: evaluate <b>only at IoU $0.5$</b> vs <b>averaged over $0.5$&ndash;$0.95$</b> &mdash; a loose
        detector that looks fine at $0.5$ should drop sharply under the averaged metric, confirming the averaging is
        what rewards accurate localization.</p>
       <p><b>5. Failure signals &amp; what they mean.</b> <b>IoU $\\gt 1$ or negative</b> &rarr; union computed wrong
        (double-counted or omitted the overlap). <b>Box and mask scores identical</b> &rarr; masks are being read as
        their bounding boxes, losing the dataset's whole point. <b>Two overlapping people merged into one detection</b>
        &rarr; semantic-vs-instance confusion; each mask must belong to one object. <b>Category count $80$ where you
        expected $91$</b> &rarr; not a bug: the 2014/2017 detection <i>release</i> annotates 80 of the paper's 91
        design categories. <b>Suspiciously high mAP vs the DPM baseline</b> &rarr; likely an evaluation leak (testing
        on train, or matching predictions to ground truth too loosely), since COCO is meant to be ~2&times; harder
        than PASCAL (&sect;7).</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b> dataset paper: there is no model to build from scratch and no novel module to
       compose. What you <i>do</i> instead is <b>understand and use</b> the dataset's design &mdash; why non-iconic
       in-context images, why per-instance masks over boxes, why depth over breadth of categories, and how the
       three-stage annotation pipeline turns an impossible labeling job into three cheap ones. The optional code
       below is a tiny <b>conceptual schematic</b>: it recomputes the worked IoU and prints the paper's quoted
       "objects per image" comparison. It is an illustration of the dataset's design choices, not a training run or
       a reproduction of any COCO model.</p>`,
    pitfalls:
      `<ul>
        <li><b>Confusing instance segmentation with semantic segmentation.</b> Semantic segmentation labels each
        pixel by <i>class</i> only, merging two overlapping people into one "person" region. COCO's <b>instance</b>
        segmentation keeps each object separate. The whole point of per-instance masks is lost if you treat them as
        a class map. <b>Fix:</b> remember each mask belongs to one specific object instance.</li>
        <li><b>Mixing up the 91 and 80.</b> The paper describes <b>91</b> object categories in its design (Abstract,
        &sect;4); the widely-used 2014/2017 detection releases annotate <b>80</b> of them. If you compare numbers
        across sources, check which count is meant. <b>Fix:</b> state 91 categories (11 super-categories) when
        describing the paper; note the 80-category detection subset separately.</li>
        <li><b>Reading "fewer categories" as "smaller."</b> COCO has fewer <i>categories</i> than ImageNet but far
        more <i>instances</i> per category and many instances per image (7.7, &sect;5). It is dense, not small.
        <b>Fix:</b> separate "how many object types" from "how many labeled objects."</li>
        <li><b>Inventing a COCO mAP number from memory.</b> The 2014 paper establishes IoU-based evaluation and a
        Deformable Parts Model baseline (&sect;7); the averaged-over-thresholds "COCO mAP" convention is the
        evaluation server's standard. Do not attribute a specific headline mAP to this paper unless you quote it.
        <b>Fix:</b> describe the metric's definition; quote any number with its source or omit it.</li>
        <li><b>Assuming boxes and masks are interchangeable.</b> A bounding box cannot separate two heavily
        overlapping objects the way a pixel mask can, and box-IoU is more forgiving than mask-IoU. The dataset's
        contribution rests on this difference. <b>Fix:</b> use masks when the task is instance segmentation; know
        which IoU (box vs. mask) a score refers to.</li>
      </ul>`,
    recall: [
      "Define <i>iconic</i> vs <i>non-iconic</i> images, and state why COCO deliberately collects non-iconic ones.",
      "What does a per-instance <i>segmentation mask</i> give you that a <i>bounding box</i> does not? Why did the paper argue for masks (§1)?",
      "Name the three stages of the annotation pipeline in order (§4), and say why that order saves work.",
      "Quote the dataset scale from the abstract (instances and images), and give the average instances per image (§5).",
      "Write the IoU formula and explain why averaging mAP over IoU thresholds rewards accurate localization."
    ],
    practice: [
      {
        q: `<b>Why boxes are not enough.</b> Two people stand side by side and overlap so heavily that the smallest
            rectangle around person A almost entirely contains person B as well. (a) Why can a single bounding box
            fail to distinguish a detector that found person A from one that found person B? (b) How does a
            per-instance segmentation mask resolve this? (c) Which sentence in the paper motivates masks over boxes?`,
        steps: [
          { do: `Picture both people inside nearly the same rectangle. A box only specifies a region, not which pixels are which person.`, why: `A bounding box throws away shape; two different true objects can share almost the same enclosing rectangle.` },
          { do: `A mask names the exact pixels of one instance, so person A's mask and person B's mask differ even when their boxes coincide.`, why: `Pixel-level outlines separate overlapping instances that boxes cannot.` },
          { do: `Cite §1: boxes "limit the accuracy for which detection algorithms may be evaluated," and the paper proposes "fully segmented instances to enable more accurate detector evaluation."`, why: `The paper's stated reason for choosing masks is precisely this evaluation precision.` }
        ],
        answer: `<p>(a) A box only marks a rectangle; when A and B share almost the same rectangle, scoring against
                 the box cannot tell which person was actually found &mdash; two different correct/incorrect
                 predictions look the same. (b) A per-instance mask labels the exact pixels of one object, so A's
                 mask and B's mask differ even when their boxes overlap, and the benchmark can score each instance
                 separately. (c) §1: bounding boxes "limit the accuracy for which detection algorithms may be
                 evaluated," motivating "fully segmented instances to enable more accurate detector evaluation."</p>`
      },
      {
        q: `<b>Compute an IoU.</b> A detector predicts a mask of area 90 pixels for a cat. The human-annotated mask
            has area 150 pixels. They overlap on 75 pixels. (a) Compute the IoU. (b) Is this detection counted as
            correct at an IoU threshold of 0.5? At 0.75? (c) What does this tell you about why COCO averages mAP
            over multiple thresholds?`,
        steps: [
          { do: `Intersection is the overlap: 75 pixels.`, why: `IoU's numerator is the area shared by prediction and ground truth.` },
          { do: `Union = 90 + 150 − 75 = 165 pixels.`, why: `Union is both areas minus the double-counted overlap.` },
          { do: `IoU = 75 / 165 ≈ 0.4545. Below 0.5, so it fails even the lenient threshold here.`, why: `A detection counts as correct only when IoU clears the threshold.` }
        ],
        answer: `<p>(a) Intersection = 75, union = 90 + 150 − 75 = 165, so IoU = 75/165 ≈ <b>0.45</b>. (b) At a 0.5
                 threshold it is <b>not</b> correct (0.45 &lt; 0.5); at 0.75 it is also not correct. (c) Because a
                 single threshold gives a coarse pass/fail, COCO averages mAP over a range of IoU thresholds: a
                 loose prediction can pass a lenient threshold but fails strict ones, so the averaged score rewards
                 detectors that localize <i>tightly</i>, not just roughly &mdash; the precision the per-instance
                 masks make measurable.</p>`
      },
      {
        q: `<b>Ablation &mdash; collapse the pipeline.</b> Imagine COCO had skipped stages 1 and 2 and asked crowd
            workers to directly segment every object in each image in one pass (no category labeling, no instance
            spotting first). Predict two concrete ways annotation quality or cost would degrade, and tie each to the
            stage you removed.`,
        steps: [
          { do: `Remove stage 1 (category labeling): workers no longer have a checklist of which of the 91 categories are present.`, why: `Stage 1 cheaply establishes "what is here" so later stages know what to look for; without it, rare or small categories get overlooked.` },
          { do: `Remove stage 2 (instance spotting): nobody has marked every separate instance before tracing begins.`, why: `Stage 2 guarantees completeness — all instances located — before the expensive tracing; without it, instances in clutter are missed and never segmented.` },
          { do: `Note the cost effect: the expensive tracing now runs blind on full images instead of on confirmed, located instances.`, why: `The pipeline's ordering exists so the costly step does the minimum work on pre-filtered targets.` }
        ],
        answer: `<p>Removing <b>stage 1</b> (category labeling) means workers segment without a list of present
                 categories, so small or uncommon objects are more likely missed entirely &mdash; recall drops.
                 Removing <b>stage 2</b> (instance spotting) means no one has confirmed every instance before
                 tracing, so in crowded, non-iconic scenes some instances are never outlined &mdash; completeness
                 drops &mdash; while the expensive segmentation step now scans entire images blind, raising cost.
                 The three-stage order exists precisely so the cheap stages filter and locate, and the costly
                 tracing runs only on confirmed, spotted instances (§4).</p>`
      }
    ]
  });

  window.CODE["paper-mscoco"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `<p>This is a <b>read-only</b> dataset paper, so there is no model to train or verify. The snippet below is a
       tiny <b>conceptual illustration</b> of two of the paper's design facts. It (1) recomputes the worked-example
       <b>IoU</b> (Intersection over Union) by hand &mdash; the overlap score COCO uses to judge a detection
       (&sect;7) &mdash; and (2) prints the paper's quoted "objects per image" comparison, COCO 7.7 vs. PASCAL 2.3
       (&sect;5). The two dataset numbers are <b>quoted from the paper</b>, not produced by us. Pure NumPy, CPU,
       runs instantly.</p>`,
    code: `import numpy as np

# ---------------------------------------------------------------------------
# (1) IoU (Intersection over Union): the overlap score COCO uses to judge a
#     detection (Section 7). IoU = area(overlap) / area(union).
#     Worked example from the lesson: predicted mask area 100, true mask area
#     120, overlap 80 pixels.
# ---------------------------------------------------------------------------
def iou(area_pred, area_true, overlap):
    union = area_pred + area_true - overlap
    return overlap / union

val = iou(100, 120, 80)
print("IoU(pred=100, true=120, overlap=80) = %.3f" % val)
print("  correct at threshold 0.50? ", val >= 0.50)
print("  correct at threshold 0.75? ", val >= 0.75)
# IoU(pred=100, true=120, overlap=80) = 0.571
#   correct at threshold 0.50?  True
#   correct at threshold 0.75?  False

# ---------------------------------------------------------------------------
# (2) The paper's QUOTED "objects per image" comparison (Section 5). These two
#     numbers are transcribed from the paper, NOT computed by us.
# ---------------------------------------------------------------------------
objects_per_image = {"COCO": 7.7, "PASCAL VOC": 2.3}   # Section 5, Fig 5c
for name, n in objects_per_image.items():
    print("%-11s avg instances/image = %.1f  (quoted, Section 5)" % (name, n))
ratio = objects_per_image["COCO"] / objects_per_image["PASCAL VOC"]
print("COCO is %.1fx more crowded per image than PASCAL (from quoted numbers)." % ratio)
# COCO        avg instances/image = 7.7  (quoted, Section 5)
# PASCAL VOC  avg instances/image = 2.3  (quoted, Section 5)
# COCO is 3.3x more crowded per image than PASCAL (from quoted numbers).`
  };

  window.CODEVIZ["paper-mscoco"] = {
    question: "COCO was built to be crowded and realistic. How many object instances does an average COCO image carry, versus an average PASCAL VOC image? (Both numbers are QUOTED from the paper, Section 5 — this is a schematic, not a run of ours.)",
    charts: [
      {
        type: "bar",
        title: "Average labeled object instances per image — COCO vs PASCAL VOC (paper's quoted numbers, §5)",
        xlabel: "dataset",
        ylabel: "avg instances per image",
        series: [
          { name: "avg instances per image (quoted, §5)", color: "#7ee787",
            points: [["COCO", 7.7], ["PASCAL VOC", 2.3]] }
        ]
      }
    ],
    caption: "Schematic of one design fact, NOT a computation of ours: both bars are numbers QUOTED from the paper. COCO averages 7.7 labeled object instances per image (Section 5, Figure 5c); PASCAL VOC averages 2.3 (Section 5). That is roughly 3.3x more objects per image — the 'crowded, in-context' design that makes COCO harder and more realistic for detection. The paper also reports about 3.5 categories per image on average (Figure 5b) and, in total, '2.5 million labeled instances in 328k images' (Abstract). These are the paper's figures, transcribed; nothing here is generated by us.",
    code: `# The bar chart shows two numbers QUOTED from the paper (Section 5) — it is a
# schematic of a design fact, not a run of ours.
objects_per_image = {"COCO": 7.7, "PASCAL VOC": 2.3}   # Section 5, Figure 5c
for name, n in objects_per_image.items():
    print("%-11s avg instances/image = %.1f  (quoted from the paper, Section 5)" % (name, n))
print("ratio COCO/PASCAL = %.1fx more crowded per image" % (7.7 / 2.3))
# COCO        avg instances/image = 7.7  (quoted from the paper, Section 5)
# PASCAL VOC  avg instances/image = 2.3  (quoted from the paper, Section 5)
# ratio COCO/PASCAL = 3.3x more crowded per image
# Numbers transcribed from the paper; not generated here.`
  };
})();
