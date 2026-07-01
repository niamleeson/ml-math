/* All ML — Part 17 applications (5 each). Loaded after content-part-17.js, before all-ml-register.js. */

/* ---- _apps-part17-A.js ---- */
/* All ML — Part 17 (Learning Paradigms) applications, batch A (17.1–17.7).
   Authored from plans/part-17-learning-paradigms.md. */

window.ALLML_CONTENT["17.1"].applications = [
  { title: "Medical-imaging triage", background: "<p>Labeled scans are scarce and expensive, so hospitals reuse an encoder pretrained on large public image sets and fit only a small head.</p>", numbers: "<p>Fitting the head on 10% of target labels (illustrative) can match training from scratch on 100%, a $10\\times$ labeling saving.</p>" },
  { title: "Industrial defect detection", background: "<p>A vision backbone trained on generic images is frozen, so the target update is a small correction rather than a full retrain.</p>", numbers: "<p>D1 check: logit $z=1.600$ gives $\\sigma(z)=1/(1+e^{-1.6})=0.832$.</p>" },
  { title: "Document classification", background: "<p>Language features transfer across corpora; only the final layer is fine-tuned, with a small learning rate to avoid destroying pretrained weights.</p>", numbers: "<p>A learning rate of $0.1$ on a gradient of $0.34$ moves a weight by only $0.034$ — a deliberately small update.</p>" },
  { title: "Retail product tagging", background: "<p>A catalog encoder is adapted to a new taxonomy by nudging a tiny head.</p>", numbers: "<p>A 2-feature D1 head update moves weights from $(1.2,-0.8)$ to $(1.234,-0.783)$ — the lesson's exact small step.</p>" },
  { title: "Ads creative quality", background: "<p>Asset embeddings are reused so scarce labels are spent only on the head.</p>", numbers: "<p>Accuracy vs label budget across $100\\%, 50\\%, 10\\%, 2\\%, 1\\%$ (illustrative) shows transfer holding up far below full supervision.</p>" }
];

window.ALLML_CONTENT["17.2"].applications = [
  { title: "Fraud models across countries", background: "<p>A model trained in one market is deployed in another; aligning feature means removes a nuisance shift before it hurts.</p>", numbers: "<p>Lesson shift $(1,-0.5)$ has mean discrepancy $1.250$ before alignment and $0.000$ after.</p>" },
  { title: "Hospital models across scanners", background: "<p>Different scanners create a domain signal that must be treated as nuisance, not label evidence, before subtracting it.</p>", numbers: "<p>If domain identity predicted the label, subtracting the domain shift would erase real signal — the lesson's central warning.</p>" },
  { title: "Speech recognition across microphones", background: "<p>Training on several source domains and testing a held-out target measures generalization to unseen conditions.</p>", numbers: "<p>Accuracy is tracked as target shift rises $0.0\\to1.0$ (illustrative); the drop is the adaptation metric.</p>" },
  { title: "Ads prediction across markets", background: "<p>Low source risk is not a certificate of target performance, so target risk is monitored directly.</p>", numbers: "<p>Report accuracy drop vs shift: e.g. source acc $0.95$ but target acc $0.78$ at shift $1.0$ (illustrative).</p>" },
  { title: "Retail demand across seasons", background: "<p>Seasonal drift is a domain shift; mean alignment is compared against no adaptation.</p>", numbers: "<p>The same discrepancy formula gives $1.250\\to0.000$ on D4/D5 after alignment.</p>" }
];

window.ALLML_CONTENT["17.3"].applications = [
  { title: "Image moderation", background: "<p>Abundant unlabeled images are pseudo-labeled, but only confident predictions are kept to avoid feeding back errors.</p>", numbers: "<p>With threshold $0.8$, a $0.9$ prediction is kept and a $0.5$ prediction is rejected.</p>" },
  { title: "Medical coding", background: "<p>Unlabeled records are used only when the model is certain, measured by low entropy.</p>", numbers: "<p>Entropies: a confident $0.9/0.1$ gives $0.325$; a $0.5/0.5$ coin flip gives $0.693$ — only the former is used.</p>" },
  { title: "Product taxonomy expansion", background: "<p>A handful of labeled items are grown with confident unlabeled neighbors while watching for confirmation bias.</p>", numbers: "<p>Start from 10 labeled examples and add only neighbors above $0.8$ confidence (illustrative).</p>" },
  { title: "Search-intent classification", background: "<p>Pseudo-labels are thresholded so ambiguous queries are not force-labeled.</p>", numbers: "<p>A $0.5 \\lt 0.8$ probability is rejected, keeping 50/50 cases out of training.</p>" },
  { title: "Sensor fault detection", background: "<p>Unlabeled readings are plentiful, but semi-supervised gains require the data geometry to align with the labels.</p>", numbers: "<p>When clusters match classes, adding unlabeled points raises accuracy; when they don't, it does not — the lesson's condition.</p>" }
];

window.ALLML_CONTENT["17.4"].applications = [
  { title: "Vision pretraining", background: "<p>Labels are created from augmentations (a pretext task), then a small head is fine-tuned, because raw data scales faster than annotation.</p>", numbers: "<p>Fine-tuning with only 10% labels (illustrative) after self-supervised pretraining rivals full supervision.</p>" },
  { title: "Time-series sensors", background: "<p>Masked coordinates are predicted from context to learn representations without labels.</p>", numbers: "<p>Lesson line $y=0.7x+0.2$ predicts $-0.500, 0.200, 0.900$ at $x=-1,0,1$.</p>" },
  { title: "Search embeddings", background: "<p>Query/document co-occurrence is the free signal; downstream labels train only a small head, paralleling transfer learning.</p>", numbers: "<p>Co-occurrence pairs supply millions of self-supervised examples vs a few thousand labeled ones (illustrative).</p>" },
  { title: "Industrial audio", background: "<p>Representations are learned by recovering hidden segments of a signal.</p>", numbers: "<p>D1 check: perfect recovery of the line toy gives zero squared error.</p>" },
  { title: "Medical notes", background: "<p>Masked-token pretraining must avoid shortcuts that leak the answer.</p>", numbers: "<p>Compare clean-pretext vs shortcut-pretext downstream accuracy (illustrative) to detect a leaking task.</p>" }
];

window.ALLML_CONTENT["17.5"].applications = [
  { title: "Face verification", background: "<p>Positive pairs define what should be invariant while negatives preserve identity separation.</p>", numbers: "<p>Lesson positive-pair probability is $0.726$ under the contrastive objective.</p>" },
  { title: "Product image retrieval", background: "<p>Temperature tunes how sharply similarities are compared; absolute similarity alone is not enough.</p>", numbers: "<p>At temperature $0.5$ the positive must beat alternatives; the softmax sharpens the $0.726$ vs alternatives gap.</p>" },
  { title: "Duplicate-ticket search", background: "<p>Metric embeddings place a query near its true match and away from distractors.</p>", numbers: "<p>The query and positive must beat three alternatives — a 4-similarity denominator in the InfoNCE loss.</p>" },
  { title: "Few-shot classification", background: "<p>Prototypes computed from a few examples inherit geometry from contrastive pretraining.</p>", numbers: "<p>Accuracy is tracked at 1, 5, 10 shots (illustrative), rising as support grows.</p>" },
  { title: "Multimodal retrieval", background: "<p>A shared image-text space later supports CLIP-style matching.</p>", numbers: "<p>D1 check: lesson InfoNCE loss is $0.320$.</p>" }
];

window.ALLML_CONTENT["17.6"].applications = [
  { title: "Ads ranking plus calibration", background: "<p>A shared trunk optimizes a weighted sum of task losses so related objectives reinforce each other.</p>", numbers: "<p>Lesson weights give $0.028 + 0.027 = 0.055$ total loss.</p>" },
  { title: "Autonomous-driving perception", background: "<p>Lane and sign heads share visual features, but conflicting gradients can tug the trunk in opposite directions.</p>", numbers: "<p>If per-task gradients point oppositely, their sum shrinks — the gradient tug-of-war the lesson names.</p>" },
  { title: "Healthcare risk prediction", background: "<p>Related risk tasks reduce variance, mirroring the lesson's link between multi-task learning and regularization.</p>", numbers: "<p>Sharing across tasks acts like extra data, lowering held-out error (illustrative).</p>" },
  { title: "Retail forecasting", background: "<p>Many product categories teach common seasonal structure.</p>", numbers: "<p>Compare 1, 2, 4, 8 shared tasks (illustrative); accuracy rises as shared structure accumulates.</p>" },
  { title: "Content moderation", background: "<p>Multiple harmful-content heads share a text representation but each target needs its own validation.</p>", numbers: "<p>A shared trunk with per-head thresholds keeps one task from dominating the loss (illustrative).</p>" }
];

window.ALLML_CONTENT["17.7"].applications = [
  { title: "Rare-disease classifiers", background: "<p>A brand-new task starts from a few support examples rather than a large training set.</p>", numbers: "<p>Lesson prototypes are $c_0=(-0.900,0.100)$ and $c_1=(0.950,-0.100)$.</p>" },
  { title: "New-product tagging", background: "<p>A classifier is rebuilt from 1–5 shots instead of retraining from scratch.</p>", numbers: "<p>Five labeled examples per class (illustrative) can define usable prototypes.</p>" },
  { title: "Robotics task adaptation", background: "<p>Meta-training episodes are designed to resemble the test tasks so adaptation transfers.</p>", numbers: "<p>Mismatched episodes break few-shot accuracy — the lesson's episode-design warning.</p>" },
  { title: "Fraud pattern onboarding", background: "<p>A query is classified by distance to class prototypes built from a tiny support set.</p>", numbers: "<p>Query $(0.2,0.05)$ has prototype distances $1.2125$ vs $0.5850$, so it joins class 1.</p>" },
  { title: "Personalized recommendations", background: "<p>Each user is adapted from a small support set of interactions.</p>", numbers: "<p>D1 numeric check: class-1 probability is $0.652$.</p>" }
];

/* ---- _apps-part17-B.js ---- */
window.ALLML_CONTENT["17.8"].applications = [
  { title: "Open-vocabulary image tagging", background: "<p>Zero-shot image tagging lets a new label be described in language or attributes instead of collected as a training set. The description vector acts like the classifier weight.</p>", numbers: "<p>With the lesson vector $x=(0.8,0.2)$, $\\|x\\|=0.825$. The cosine to $a_1=(1,0)$ is $0.8/0.825=0.970$, while the cosine to $a_2=(0,1)$ is $0.2/0.825=0.243$, so the first tag wins.</p>" },
  { title: "Retail category launch", background: "<p>A retailer can launch a category before examples exist by embedding the new category description beside existing product features.</p>", numbers: "<p>If an illustrative product has the same lesson scores 0.970 and 0.243, scaling by 3 gives logits 2.910 and 0.729. The top softmax probability is $e^{2.910}/(e^{2.910}+e^{0.729})=0.898$.</p>" },
  { title: "Safety taxonomy expansion", background: "<p>Policy teams often add unseen safety labels faster than examples can be reviewed. Zero-shot scoring helps triage, but seen-class calibration must be checked.</p>", numbers: "<p>An illustrative seen-class bias of 0.35 changes the comparison from 0.970 versus 0.243 to 1.320 versus 0.243. The arithmetic shows why the lesson warns that a healthy score can still be biased by the comparison set.</p>" },
  { title: "Document routing", background: "<p>Text-defined queues can route new document types when the class descriptions and document embeddings share geometry.</p>", numbers: "<p>The lesson scale 3 turns cosine scores 0.970 and 0.243 into a probability 0.898 for the top route, which is a re-derivable confidence rather than a retrained classifier.</p>" },
  { title: "Robotics object recognition", background: "<p>A robot can add a new object by embedding attributes such as shape, handle, and material, avoiding immediate retraining examples.</p>", numbers: "<p>Using the lesson norm $0.825$, an attribute aligned with the input contributes $0.970$, while an orthogonal-ish attribute contributes $0.243$. The gap $0.970-0.243=0.727$ is the recognition margin before calibration.</p>" }
];

window.ALLML_CONTENT["17.9"].applications = [
  { title: "Personalization over time", background: "<p>A personal model should learn a new preference without erasing older preferences that still matter.</p>", numbers: "<p>For $\\theta_A=(1,0)$ and candidate $(0,1)$, movement is $(-1,1)$. With $F=(5,0.2)$, the weighted square is $5(-1)^2+0.2(1)^2=5.200$, so the EWC penalty is $0.5\\cdot5.200=2.600$.</p>" },
  { title: "Fraud model refreshes", background: "<p>Fraud patterns drift, but old high-sensitivity patterns should not be overwritten by the newest scam examples.</p>", numbers: "<p>The lesson's weighted square 5.200 is the protection signal: a movement of one unit in the high-Fisher coordinate costs 5, while one unit in the low-Fisher coordinate costs only 0.2.</p>" },
  { title: "Robotics skills", background: "<p>A robot learning skills sequentially may not be able to store all old trajectories, so stability-plasticity control matters.</p>", numbers: "<p>Candidate $(0.5,0.8)$ moves $(-0.5,0.8)$ from $\\theta_A$. Its penalty is $0.5(5\\cdot0.25+0.2\\cdot0.64)=0.689$, much smaller than 2.600 for $(0,1)$.</p>" },
  { title: "Medical model updates", background: "<p>Medical models may need to absorb new site data while preserving parameters that older validation cohorts found important.</p>", numbers: "<p>The ratio $2.600/0.689=3.774$ shows that the lesson's first candidate is almost four times more disruptive under the old-task sensitivity weights.</p>" },
  { title: "Recommender drift", background: "<p>Recommendations face sequential task drift as interests change across days, seasons, or product surfaces.</p>", numbers: "<p>In an illustrative 2, 3, and 5 task comparison, average forgetting is computed as old accuracy after learning minus old accuracy before learning; the notebook reports that number next to average seen-task accuracy.</p>" }
];

window.ALLML_CONTENT["17.10"].applications = [
  { title: "Medical annotation", background: "<p>When expert labels are expensive, active learning asks for the image or case whose label is expected to change the model most.</p>", numbers: "<p>The lesson entropies are $H(0.9,0.1)=0.325$, $H(0.6,0.4)=0.673$, and $H(0.5,0.5)=0.693$, so the near-tie should be queried first.</p>" },
  { title: "Legal discovery", background: "<p>Review teams can query boundary-changing documents instead of spending the label budget randomly.</p>", numbers: "<p>With illustrative budgets 1, 5, and 10, the same accuracy-vs-budget curve used in the notebook shows whether uncertainty labels beat random labels at each budget.</p>" },
  { title: "Image moderation", background: "<p>Moderation queues often contain ambiguous items where two classes are nearly tied.</p>", numbers: "<p>For the lesson vector $(0.34,0.33,0.33)$, the top-two margin is $0.34-0.33=0.010$, so a single review can resolve an especially uncertain decision.</p>" },
  { title: "Customer-support routing", background: "<p>Support tickets can be labeled actively, but uncertainty alone may pick many duplicate tickets from the same cluster.</p>", numbers: "<p>If two tickets have the same illustrative entropy 0.693, adding a diversity bonus of 0.15 times nearest-labeled distance makes a ticket 2 units away score $0.693+0.300=0.993$.</p>" },
  { title: "Sensor labeling", background: "<p>Sensor data often has outliers that are uncertain because they are strange, not because they are useful for the decision boundary.</p>", numbers: "<p>The notebook compares uncertainty-only accuracy with uncertainty-plus-diversity at the same tiny label budget, matching the lesson warning that numeric uncertainty must be validated on the target setting.</p>" }
];

window.ALLML_CONTENT["17.11"].applications = [
  { title: "OCR training", background: "<p>OCR systems can begin with clean, high-margin characters before adding messy handwriting and scan artifacts.</p>", numbers: "<p>The lesson logistic losses are $\\log(1+e^{-2})=0.127$, $\\log(1+e^{-1})=0.313$, $\\log(1+e^{-0.2})=0.598$, and $\\log(1+e^{0.5})=0.974$, so easy examples have smaller early gradients.</p>" },
  { title: "Fraud detection", background: "<p>Fraud training can introduce hard and noisy exceptions gradually so early updates learn stable structure first.</p>", numbers: "<p>The hard margin $m=-0.5$ has loss 0.974, while $m=2$ has loss 0.127. The difference $0.974-0.127=0.847$ explains why hard cases dominate if admitted too early.</p>" },
  { title: "Language tutoring", background: "<p>Tutoring platforms order examples by difficulty, neither jumping to every hard case immediately nor hiding them forever.</p>", numbers: "<p>An illustrative medium pace can expose 25% then 50% then 100% of examples, while a too-slow pace ending at 55% never trains on 45% of the hard set.</p>" },
  { title: "Robotics control", background: "<p>Robotics curricula often start with low perturbation states and increase disturbance after the controller stabilizes.</p>", numbers: "<p>Comparing illustrative paces 25%, 50%, and 100% per epoch is the same schedule knob as the notebook's accuracy-vs-pace curve.</p>" },
  { title: "Medical imaging", background: "<p>Clean-then-noisy medical imaging curricula can lower early gradient variance when labels or scans are unreliable.</p>", numbers: "<p>Using the lesson losses, the average easy loss for margins 2 and 1 is $(0.127+0.313)/2=0.220$, while including margins 0.2 and -0.5 raises the four-example average to 0.503.</p>" }
];

window.ALLML_CONTENT["17.12"].applications = [
  { title: "Mobile keyboard prediction", background: "<p>Federated keyboard models keep typed data on devices and send only local model updates to the server.</p>", numbers: "<p>The lesson client counts 10, 30, and 60 sum to 100, so their FedAvg weights are 0.10, 0.30, and 0.60.</p>" },
  { title: "Hospital collaboration", background: "<p>Hospitals can collaborate without pooling raw patient data, but volume weighting changes the shared model.</p>", numbers: "<p>For updates $(1,0)$, $(0,1)$, and $(2,2)$ with counts 10, 30, 60, the weighted aggregate is $((10\\cdot1+30\\cdot0+60\\cdot2)/100,(10\\cdot0+30\\cdot1+60\\cdot2)/100)=(1.300,1.500)$.</p>" },
  { title: "Finance fraud", background: "<p>Financial institutions may choose weights by data volume, fairness, or reliability depending on the objective.</p>", numbers: "<p>The unweighted average of the lesson updates is $((1+0+2)/3,(0+1+2)/3)=(1.000,1.000)$, proving it is a different objective from volume FedAvg.</p>" },
  { title: "IoT maintenance", background: "<p>IoT clients can have different sensors, fault rates, and data volumes, creating non-IID updates across rounds.</p>", numbers: "<p>An illustrative heterogeneity sweep from IID to mild non-IID to strong non-IID tracks both global accuracy and worst-client accuracy, the two metrics used in the notebook.</p>" },
  { title: "Retail personalization", background: "<p>Store-level models can adapt locally while the server learns a shared model, but small stores should not disappear in aggregate metrics.</p>", numbers: "<p>If the smallest client has weight 0.10 under volume averaging, a uniform client objective would raise that client to $1/3=0.333$, a 3.33 times larger influence.</p>" }
];

window.ALLML_CONTENT["17.13"].applications = [
  { title: "Image-text search", background: "<p>Multimodal retrieval aligns image and text embeddings so a query in either modality can retrieve the paired item.</p>", numbers: "<p>The lesson cosines 0.994 and 0.110 become scaled scores 4.970 and 0.550 at scale 5, giving matched probability $e^{4.970}/(e^{4.970}+e^{0.550})=0.988$.</p>" },
  { title: "Product catalog retrieval", background: "<p>Catalog systems align product photos and titles so either a title or a photo can find the same item.</p>", numbers: "<p>With the lesson vectors, the matched cosine is $0.9/\\sqrt{0.82}=0.994$, while the mismatch is $0.1/\\sqrt{0.82}=0.110$.</p>" },
  { title: "Medical image reporting", background: "<p>Medical image-report alignment supports image-to-report and report-to-image lookup, rather than only late-fusion classification.</p>", numbers: "<p>The retrieval margin in the lesson is $0.994-0.110=0.884$ before scaling, which becomes $4.970-0.550=4.420$ after scale 5.</p>" },
  { title: "Brand-safety creative review", background: "<p>Creative review can combine image features with text-defined policy descriptions, connecting multimodal learning to zero-shot transfer.</p>", numbers: "<p>Using the zero-shot lesson scale 3, a cosine gap 0.727 yields a logit gap $3\\cdot0.727=2.181$, while the multimodal lesson uses scale 5 for a gap 4.420.</p>" },
  { title: "Accessibility alt-text matching", background: "<p>Alt-text systems can score whether an image and caption describe the same content in shared embedding space.</p>", numbers: "<p>The lesson's matched probability 0.988 means the mismatch probability is $1-0.988=0.012$ in the two-caption example.</p>" }
];

