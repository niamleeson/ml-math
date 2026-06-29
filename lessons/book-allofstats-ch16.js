/* All of Statistics (Larry Wasserman) — Chapter 16: Causal Inference.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — The Counterfactual Model
  B({
    id: "aos-ch16-counterfactual-model",
    chapter: "Chapter 16",
    title: "The Counterfactual Model",
    tagline: "Split each subject's response into two hidden potential outcomes, then define the causal effect as the difference between their averages.",
    sections: [
      { h: "Causation versus association", body:
        "<p>Roughly, saying \"$X$ causes $Y$\" means that changing the value of $X$ would change the distribution of $Y$. Here $X$ is a treatment and $Y$ is an outcome. When $X$ causes $Y$, the two will be associated, but the reverse is not generally true: <strong>association does not imply causation</strong>. To separate the two ideas precisely we need a richer vocabulary, which the chapter builds with <strong>counterfactual</strong> random variables.</p>" +
        "<p>Set the stage. $X$ is a binary treatment: $X=1$ means \"treated\" and $X=0$ means \"not treated.\" \"Treatment\" is meant broadly — it could be a medication, or something like smoking (\"exposed / not exposed\"). $Y$ is some outcome, such as the presence or absence of disease.</p>" },
      { h: "Potential outcomes and the consistency relationship", body:
        "<p>Introduce two new random variables $(C_0, C_1)$, called the <strong>potential outcomes</strong>. The reading is: $C_0$ is the outcome the subject would have if not treated ($X=0$), and $C_1$ is the outcome the subject would have if treated ($X=1$). The observed outcome is whichever one matches the treatment actually received:</p>" +
        "<p>$Y = C_0$ if $X=0$, and $Y = C_1$ if $X=1$. More compactly, $Y = C_X$.</p>" +
        "<p>This last equation, $Y = C_X$, is the <strong>consistency relationship</strong>. The potential outcomes $(C_0, C_1)$ act like hidden variables holding everything relevant about the subject; for each person we only ever get to see one of them.</p>" },
      { h: "A toy dataset: the asterisks are counterfactual", body:
        "<p>The book's toy dataset makes the idea concrete. Each row is a subject; an asterisk marks an unobserved value. When $X=0$ we observe $C_0$ but not $C_1$ (so $C_1$ is the counterfactual — what would have happened, counter to fact, had the subject been treated). When $X=1$ it is the other way around.</p>" +
        "<table class=\"extable\"><thead><tr><th>X</th><th>Y</th><th>C0</th><th>C1</th></tr></thead><tbody>" +
        "<tr><td class=\"num\">0</td><td class=\"num\">4</td><td class=\"num\">4</td><td class=\"num\">*</td></tr>" +
        "<tr><td class=\"num\">0</td><td class=\"num\">7</td><td class=\"num\">7</td><td class=\"num\">*</td></tr>" +
        "<tr><td class=\"num\">0</td><td class=\"num\">2</td><td class=\"num\">2</td><td class=\"num\">*</td></tr>" +
        "<tr><td class=\"num\">0</td><td class=\"num\">8</td><td class=\"num\">8</td><td class=\"num\">*</td></tr>" +
        "<tr><td class=\"num\">1</td><td class=\"num\">3</td><td class=\"num\">*</td><td class=\"num\">3</td></tr>" +
        "<tr><td class=\"num\">1</td><td class=\"num\">5</td><td class=\"num\">*</td><td class=\"num\">5</td></tr>" +
        "<tr><td class=\"num\">1</td><td class=\"num\">8</td><td class=\"num\">*</td><td class=\"num\">8</td></tr>" +
        "<tr><td class=\"num\">1</td><td class=\"num\">9</td><td class=\"num\">*</td><td class=\"num\">9</td></tr>" +
        "</tbody></table>" },
      { h: "Four types of subject", body:
        "<p>If the outcome is binary, the pair $(C_0,C_1)$ sorts every subject into one of four types, named by how they respond to treatment:</p>" +
        "<table class=\"extable\"><thead><tr><th class=\"row-h\">Type</th><th>C0</th><th>C1</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">Survivors</td><td class=\"num\">1</td><td class=\"num\">1</td></tr>" +
        "<tr><td class=\"row-h\">Responders</td><td class=\"num\">0</td><td class=\"num\">1</td></tr>" +
        "<tr><td class=\"row-h\">Anti-responders</td><td class=\"num\">1</td><td class=\"num\">0</td></tr>" +
        "<tr><td class=\"row-h\">Doomed</td><td class=\"num\">0</td><td class=\"num\">0</td></tr>" +
        "</tbody></table>" },
      { h: "The average causal effect and the association", body:
        "<p>The <strong>average causal effect</strong> (or average treatment effect) is</p>" +
        "<p>$\\theta = \\mathbb{E}(C_1) - \\mathbb{E}(C_0).$</p>" +
        "<p>Reading: $\\theta$ is the mean outcome if <em>everyone</em> were treated minus the mean outcome if <em>everyone</em> were untreated. (Other summaries exist; for binary outcomes the book also names the causal odds ratio $\\tfrac{\\mathbb{P}(C_1=1)}{\\mathbb{P}(C_1=0)} \\div \\tfrac{\\mathbb{P}(C_0=1)}{\\mathbb{P}(C_0=0)}$ and the causal relative risk $\\tfrac{\\mathbb{P}(C_1=1)}{\\mathbb{P}(C_0=1)}$. The ideas are the same, so the chapter uses $\\theta$.)</p>" +
        "<p>In contrast, the <strong>association</strong> uses only what we observe:</p>" +
        "<p>$\\alpha = \\mathbb{E}(Y\\mid X=1) - \\mathbb{E}(Y\\mid X=0).$</p>" +
        "<p>The causal effect $\\theta$ compares two whole-population averages; the association $\\alpha$ compares the treated group against the untreated group as they happen to fall out.</p>" },
      { h: "Random assignment rescues us", body:
        "<p><strong>Theorem 16.1 (Association Is Not Causation).</strong> In general, $\\theta \\neq \\alpha$. So we generally cannot use the association to estimate the causal effect.</p>" +
        "<p><strong>Theorem 16.3.</strong> But if subjects are <em>randomly assigned</em> to treatment (with $\\mathbb{P}(X=0)\\gt 0$ and $\\mathbb{P}(X=1)\\gt 0$), then $\\alpha = \\theta$. Randomization makes $(C_0,C_1)$ independent of $X$, which lets the conditional expectations stand in for the unconditional ones. A consistent estimator is then $\\hat\\theta = \\widehat{\\mathbb{E}}(Y\\mid X=1) - \\widehat{\\mathbb{E}}(Y\\mid X=0) = \\overline{Y}_1 - \\overline{Y}_0$, the difference of the treated and untreated sample means.</p>" }
    ],
    takeaways: [
      "Each subject has two potential outcomes $(C_0,C_1)$; we observe only $Y = C_X$.",
      "Causal effect $\\theta = \\mathbb{E}(C_1)-\\mathbb{E}(C_0)$ vs association $\\alpha = \\mathbb{E}(Y\\mid X=1)-\\mathbb{E}(Y\\mid X=0)$.",
      "In general $\\theta \\neq \\alpha$ — association is not causation.",
      "Random assignment makes $(C_0,C_1)$ independent of $X$, so $\\alpha = \\theta$ and $\\theta$ becomes estimable."
    ]
  });

  // 2 — Association Is Not Causation: the vitamin C example
  B({
    id: "aos-ch16-association-not-causation",
    chapter: "Chapter 16",
    title: "Why Association Is Not Causation",
    tagline: "A worked population where the treatment does nothing yet the observed data scream that it works.",
    sections: [
      { h: "A population where treatment has no effect", body:
        "<p>Example 16.2 builds an eight-person population in which $C_0 = C_1$ for every subject — so by construction the treatment changes nothing. Asterisks again mark unobserved values.</p>" +
        "<table class=\"extable\"><thead><tr><th>X</th><th>Y</th><th>C0</th><th>C1</th></tr></thead><tbody>" +
        "<tr><td class=\"num\">0</td><td class=\"num\">0</td><td class=\"num\">0</td><td class=\"num\">0*</td></tr>" +
        "<tr><td class=\"num\">0</td><td class=\"num\">0</td><td class=\"num\">0</td><td class=\"num\">0*</td></tr>" +
        "<tr><td class=\"num\">0</td><td class=\"num\">0</td><td class=\"num\">0</td><td class=\"num\">0*</td></tr>" +
        "<tr><td class=\"num\">0</td><td class=\"num\">0</td><td class=\"num\">0</td><td class=\"num\">0*</td></tr>" +
        "<tr><td class=\"num\">1</td><td class=\"num\">1</td><td class=\"num\">1*</td><td class=\"num\">1</td></tr>" +
        "<tr><td class=\"num\">1</td><td class=\"num\">1</td><td class=\"num\">1*</td><td class=\"num\">1</td></tr>" +
        "<tr><td class=\"num\">1</td><td class=\"num\">1</td><td class=\"num\">1*</td><td class=\"num\">1</td></tr>" +
        "<tr><td class=\"num\">1</td><td class=\"num\">1</td><td class=\"num\">1*</td><td class=\"num\">1</td></tr>" +
        "</tbody></table>" },
      { h: "The causal effect is zero, the association is one", body:
        "<p>Compute both numbers from the full table.</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\mathbb{E}(C_1) = \\tfrac{0+0+0+0+1+1+1+1}{8} = \\tfrac{4}{8} = 0.5$ and $\\mathbb{E}(C_0) = \\tfrac{0+0+0+0+1+1+1+1}{8} = 0.5$, so $\\theta = 0.5 - 0.5 = 0$.</li>" +
        "<li>From the observed data only: $\\mathbb{E}(Y\\mid X=1) = \\tfrac{1+1+1+1}{4} = 1$ and $\\mathbb{E}(Y\\mid X=0) = \\tfrac{0+0+0+0}{4} = 0$, so $\\alpha = 1 - 0 = 1$.</li>" +
        "<li>Hence $\\theta = 0$ but $\\alpha = 1$: $\\theta \\neq \\alpha$.</li>" +
        "</ul>" },
      { h: "The story: vitamin C", body:
        "<p>To add intuition, let $Y=1$ mean \"healthy\" and $Y=0$ mean \"sick,\" with $X=1$ meaning the subject takes vitamin C. Vitamin C has no causal effect here because $C_0 = C_1$ for everyone. There are two kinds of people: healthy people with $(C_0,C_1)=(1,1)$ and unhealthy people with $(C_0,C_1)=(0,0)$. Healthy people happen to take vitamin C; unhealthy people do not. That link between subject type $(C_0,C_1)$ and treatment $X$ is what manufactures an association between $X$ and $Y$.</p>" +
        "<p>A naive observer with only $X$ and $Y$ sees them associated, wrongly concludes vitamin C prevents illness, and urges everyone to take it.</p>" },
      { h: "Acting on the false conclusion makes it look worse", body:
        "<p>Suppose most people now comply and start taking vitamin C. The population might shift to a table where $\\alpha = \\tfrac{4}{7} - \\tfrac{0}{1} = \\tfrac{4}{7} \\approx 0.571$. The association has <em>fallen</em> from $1$ to $4/7$. The true causal effect never changed (it is still $0$), but the naive observer — who does not distinguish association from causation — is now confused, because the advice seems to have made things worse.</p>" +
        "<p>The root cause: $\\theta \\neq \\alpha$ exactly because $(C_0,C_1)$ was <em>not</em> independent of $X$ — treatment assignment was tangled up with person type. The chapter notes you can even build examples where $\\alpha \\gt 0$ while $\\theta \\lt 0$, so association and causation can have opposite signs.</p>" }
    ],
    takeaways: [
      "A treatment with zero causal effect ($\\theta=0$) can show a strong association ($\\alpha=1$).",
      "The culprit is dependence between subject type $(C_0,C_1)$ and treatment $X$.",
      "Association and causal effect can even point in opposite directions.",
      "Acting on a confounded association can make the association shift without changing the true effect."
    ]
  });

  // 3 — Beyond Binary Treatments
  B({
    id: "aos-ch16-beyond-binary",
    chapter: "Chapter 16",
    title: "Beyond Binary Treatments",
    tagline: "Generalize the two potential outcomes into a whole counterfactual curve, and compare its average to the ordinary regression curve.",
    sections: [
      { h: "From a pair of outcomes to a function", body:
        "<p>The binary setup carried two potential outcomes. Now let the treatment take many values, $X \\in \\mathcal{X}$ — for instance $X$ could be the dose of a drug, so $X \\in \\mathbb{R}$. The pair $(C_0,C_1)$ becomes a <strong>counterfactual function</strong> $C(x)$: the outcome a subject would have if given dose $x$. The observed response is still tied to the dose actually received, through the consistency relation $Y \\equiv C(X)$.</p>" +
        "<p>Figure 16.1 pictures this for one subject: the curve is $C(x)$, and the observed $Y$ is the height of that curve at the subject's actual dose $X$ — e.g. at $X=6$ the dotted lines read off $Y = C(X) = 4$.</p>" },
      { h: "Causal regression function versus regression function", body:
        "<p>Two curves now matter. The <strong>causal regression function</strong> averages the counterfactual curve across subjects,</p>" +
        "<p>$\\theta(x) = \\mathbb{E}(C(x)),$</p>" +
        "<p>and tells you what the mean outcome would be if everyone got dose $x$. The ordinary <strong>regression function</strong>, which measures association, is $r(x) = \\mathbb{E}(Y\\mid X=x)$.</p>" +
        "<p><strong>Theorem 16.4.</strong> In general $\\theta(x) \\neq r(x)$. But when $X$ is randomly assigned, $\\theta(x) = r(x)$ — the same lesson as the binary case, now for curves.</p>" },
      { h: "Conditional causal effect", body:
        "<p>If $Z$ is a covariate, the <strong>conditional causal effect</strong> is $\\theta_z = \\mathbb{E}(C_1\\mid Z=z) - \\mathbb{E}(C_0\\mid Z=z)$. For example, with $Z=0$ for women and $Z=1$ for men, $\\theta_0$ is the causal effect among women and $\\theta_1$ the causal effect among men. In a randomized experiment $\\theta_z = \\mathbb{E}(Y\\mid X=1,Z=z) - \\mathbb{E}(Y\\mid X=0,Z=z)$, estimable from the appropriate sample averages.</p>" },
      { h: "An example: flat causal curve, sloped regression curve", body:
        "<p>Example 16.5 (Figure 16.2) gives four subjects whose counterfactual functions $C_1(x),\\dots,C_4(x)$ are each <em>constant</em> in $x$ — flat lines at heights $4, 3, 2, 1$. Since changing the dose changes no one's outcome, there is no causal effect, and the causal regression function is the flat average</p>" +
        "<p>$\\theta(x) = \\tfrac{C_1(x)+C_2(x)+C_3(x)+C_4(x)}{4} = \\tfrac{4+3+2+1}{4} = 2.5.$</p>" +
        "<p>Yet each subject was observed at a different dose. The book's four observed points are the dots $Y_1 = C_1(X_1),\\dots,Y_4=C_4(X_4)$: subjects 1 and 2 happen to sit at larger $X$ with larger $Y$, subjects 3 and 4 at smaller $X$ with smaller $Y$. The regression $r(x) = \\mathbb{E}(Y\\mid X=x)$ through those dots therefore <em>slopes upward</em>, even though $\\theta(x)$ is flat. No causal effect, but a real association.</p>" }
    ],
    takeaways: [
      "With non-binary treatments the potential outcomes become a counterfactual function $C(x)$, with $Y \\equiv C(X)$.",
      "Causal regression $\\theta(x)=\\mathbb{E}(C(x))$ vs association regression $r(x)=\\mathbb{E}(Y\\mid X=x)$.",
      "In general $\\theta(x) \\neq r(x)$; randomization forces $\\theta(x)=r(x)$.",
      "Flat counterfactual curves (no causal effect) can still yield a sloped regression curve (an association)."
    ]
  });
  window.CODEVIZ["aos-ch16-beyond-binary"] = { charts: [ {
    type: "line",
    title: "Example 16.5: flat causal effect, sloped association",
    interpret: "Each subject's counterfactual curve is flat (no causal effect), so the causal regression theta(x) is the flat line at 2.5. But the four observed dots Y_i = C_i(X_i) sit at different doses, and the regression r(x) fitted through them slopes upward — an association with no causation.",
    xlabel: "dose x",
    ylabel: "outcome",
    series: [
      { name: "theta(x): causal regression", color: "#7ee787", points: [[0,2.5],[5,2.5]] },
      { name: "r(x): association regression", color: "#ffb454", points: [[1,1],[4,4]] },
      { name: "observed Y_i = C_i(X_i)", color: "#4ea1ff", points: [[4,4],[4,3],[1,2],[1,1]] }
    ]
  } ] };

  // 4 — Observational Studies and Confounding
  B({
    id: "aos-ch16-observational-confounding",
    chapter: "Chapter 16",
    title: "Observational Studies and Confounding",
    tagline: "When subjects choose their own treatment, group on the right variables to recover the causal effect — and stay skeptical.",
    sections: [
      { h: "What an observational study is", body:
        "<p>An <strong>observational study</strong> is one in which treatment (or exposure) is <em>not</em> randomly assigned; subjects pick their own value of $X$. Many health stories in the newspaper are like this. Here association and causation can differ, precisely because in a non-randomized study the potential outcome $C$ is not independent of the treatment $X$.</p>" },
      { h: "Adjusting for confounders", body:
        "<p>There may still be hope. Suppose we can find <em>groupings</em> of subjects so that, within a group, $X$ and the counterfactuals $\\{C(x): x\\in\\mathcal{X}\\}$ are independent. This happens when subjects within a group are very alike — say similar in age, gender, education, and ethnic background — so that within such a group the choice of $X$ is essentially random. Those grouping variables are the <strong>confounding variables</strong>, written collectively as $Z$. The condition is</p>" +
        "<p>$\\{C(x): x\\in\\mathcal{X}\\} \\amalg X \\mid Z,$</p>" +
        "<p>meaning: within levels of $Z$, the treatment does not depend on subject type. When this holds and we observe $Z$, there is <strong>no unmeasured confounding</strong>.</p>" },
      { h: "The adjusted treatment effect", body:
        "<p><strong>Theorem 16.6.</strong> Under that condition the causal regression function can be recovered by averaging the conditional mean over the distribution of $Z$:</p>" +
        "<p>$\\theta(x) = \\int \\mathbb{E}(Y\\mid X=x, Z=z)\\, dF_Z(z).$</p>" +
        "<p>If $\\hat r(x,z)$ consistently estimates $\\mathbb{E}(Y\\mid X=x,Z=z)$, then a consistent estimate is $\\hat\\theta(x) = \\tfrac{1}{n}\\sum_{i=1}^{n} \\hat r(x, Z_i)$. If the regression is linear, $r(x,z)=\\beta_0+\\beta_1 x+\\beta_2 z$, this becomes $\\hat\\theta(x) = \\hat\\beta_0 + \\hat\\beta_1 x + \\hat\\beta_2 \\overline{Z}_n$ using the least-squares estimators.</p>" +
        "<p>Epidemiologists call this the <strong>adjusted treatment effect</strong>, and the procedure is <strong>adjusting (or controlling) for confounding</strong>. Note the contrast (Remark 16.7): the plain regression averages with the <em>conditional</em> distribution, $\\mathbb{E}(Y\\mid X=x) = \\int \\mathbb{E}(Y\\mid X=x, Z=z)\\, dF_{Z\\mid X}(z\\mid x)$, while the causal version averages with the <em>marginal</em> distribution of $Z$.</p>" },
      { h: "Stay skeptical", body:
        "<p>Choosing which confounders $Z$ to measure and control for takes scientific judgment, and even after adjusting we can never be sure no other confounder was missed. So observational studies deserve healthy skepticism. Their results become believable when (i) many studies replicate them, (ii) each controlled for plausible confounders, and (iii) there is a plausible scientific mechanism. The book's example is smoking and cancer: many studies show the link after adjusting for confounders, lab studies show smoking damages lung cells, and randomized animal studies confirm a causal link. It is this accumulation of evidence, not any single observational study, that makes the case convincing.</p>" }
    ],
    takeaways: [
      "In observational studies subjects choose their own $X$, so $C$ need not be independent of $X$.",
      "Find confounders $Z$ such that $\\{C(x)\\} \\amalg X \\mid Z$ holds — then there is no unmeasured confounding.",
      "Adjusted treatment effect: $\\theta(x)=\\int \\mathbb{E}(Y\\mid X=x,Z=z)\\,dF_Z(z)$ — average over the marginal of $Z$.",
      "A single observational study is weak evidence; conviction comes from replication, controls, and mechanism."
    ]
  });

  // 5 — Simpson's Paradox
  B({
    id: "aos-ch16-simpsons-paradox",
    chapter: "Chapter 16",
    title: "Simpson's Paradox",
    tagline: "A treatment that looks good for men and good for women yet bad overall — the paradox lives in sloppy English, not the math.",
    sections: [
      { h: "The setup", body:
        "<p>Let $X$ be a binary treatment, $Y$ a binary outcome, and $Z$ a third binary variable such as gender. The book gives the joint distribution of $(X,Y,Z)$ split by gender ($Z=1$ men, $Z=0$ women):</p>" +
        "<table class=\"extable\"><thead><tr><th class=\"row-h\"></th><th>Y=1, men</th><th>Y=0, men</th><th>Y=1, women</th><th>Y=0, women</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">X=1</td><td class=\"num\">.1500</td><td class=\"num\">.2250</td><td class=\"num\">.1000</td><td class=\"num\">.0250</td></tr>" +
        "<tr><td class=\"row-h\">X=0</td><td class=\"num\">.0375</td><td class=\"num\">.0875</td><td class=\"num\">.2625</td><td class=\"num\">.1125</td></tr>" +
        "</tbody></table>" +
        "<p>Collapsing over gender gives the marginal distribution of $(X,Y)$:</p>" +
        "<table class=\"extable\"><thead><tr><th class=\"row-h\"></th><th>Y=1</th><th>Y=0</th><th>total</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">X=1</td><td class=\"num\">.25</td><td class=\"num\">.25</td><td class=\"num\">.50</td></tr>" +
        "<tr><td class=\"row-h\">X=0</td><td class=\"num\">.30</td><td class=\"num\">.20</td><td class=\"num\">.50</td></tr>" +
        "</tbody></table>" },
      { h: "The seemingly contradictory numbers", body:
        "<p>Read three differences off the tables (each is $\\mathbb{P}(Y=1\\mid X=1,\\dots) - \\mathbb{P}(Y=1\\mid X=0,\\dots)$):</p>" +
        "<ul class=\"steps\">" +
        "<li>Overall: $\\mathbb{P}(Y=1\\mid X=1) - \\mathbb{P}(Y=1\\mid X=0) = \\tfrac{.25}{.50} - \\tfrac{.30}{.50} = 0.5 - 0.6 = -0.1.$</li>" +
        "<li>Among men ($Z=1$): $\\tfrac{.1500}{.1500+.2250} - \\tfrac{.0375}{.0375+.0875} = \\tfrac{.15}{.375} - \\tfrac{.0375}{.125} = 0.4 - 0.3 = 0.1.$</li>" +
        "<li>Among women ($Z=0$): $\\tfrac{.1000}{.1000+.0250} - \\tfrac{.2625}{.2625+.1125} = \\tfrac{.10}{.125} - \\tfrac{.2625}{.375} = 0.8 - 0.7 = 0.1.$</li>" +
        "</ul>" +
        "<p>So we <em>seem</em> to learn the following:</p>" +
        "<table class=\"extable\"><thead><tr><th class=\"row-h\">Mathematical statement</th><th class=\"row-h\">English \"translation\"</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">$\\mathbb{P}(Y=1\\mid X=1) \\lt \\mathbb{P}(Y=1\\mid X=0)$</td><td class=\"row-h\">treatment is harmful</td></tr>" +
        "<tr><td class=\"row-h\">$\\mathbb{P}(Y=1\\mid X=1,Z=1) \\gt \\mathbb{P}(Y=1\\mid X=0,Z=1)$</td><td class=\"row-h\">treatment is beneficial to men</td></tr>" +
        "<tr><td class=\"row-h\">$\\mathbb{P}(Y=1\\mid X=1,Z=0) \\gt \\mathbb{P}(Y=1\\mid X=0,Z=0)$</td><td class=\"row-h\">treatment is beneficial to women</td></tr>" +
        "</tbody></table>" },
      { h: "The resolution: the English is wrong, not the math", body:
        "<p>Something is clearly amiss — a treatment can't be good for men, good for women, and bad overall; that is nonsense. The fault is in the <em>English</em>, not the numbers. The translation is specious. In particular, the inequality $\\mathbb{P}(Y=1\\mid X=1) \\lt \\mathbb{P}(Y=1\\mid X=0)$ does <strong>not</strong> mean the treatment is harmful.</p>" +
        "<p>\"Treatment is harmful\" should be written causally as $\\mathbb{P}(C_1=1) \\lt \\mathbb{P}(C_0=1)$, and \"harmful for men\" as $\\mathbb{P}(C_1=1\\mid Z=1) \\lt \\mathbb{P}(C_0=1\\mid Z=1)$. Written in counterfactual terms, the three statements in the table are not contradictory at all — only the loose English is.</p>" },
      { h: "A real paradox cannot happen", body:
        "<p>The chapter then proves a genuine Simpson's paradox is impossible: a treatment beneficial for men and for women cannot be harmful overall. Suppose treatment is beneficial within each level: $\\mathbb{P}(C_1=1\\mid Z=z) \\gt \\mathbb{P}(C_0=1\\mid Z=z)$ for all $z$. Averaging over $Z$,</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\mathbb{P}(C_1=1) = \\sum_z \\mathbb{P}(C_1=1\\mid Z=z)\\,\\mathbb{P}(Z=z)$</li>" +
        "<li>$\\gt \\sum_z \\mathbb{P}(C_0=1\\mid Z=z)\\,\\mathbb{P}(Z=z) = \\mathbb{P}(C_0=1).$</li>" +
        "</ul>" +
        "<p>Hence $\\mathbb{P}(C_1=1) \\gt \\mathbb{P}(C_0=1)$: treatment is beneficial overall. No paradox. The whole confusion came from reading conditional-association inequalities as causal statements.</p>" }
    ],
    takeaways: [
      "On the book's numbers the treatment seems harmful overall ($-0.1$) but beneficial within each gender ($+0.1$).",
      "The paradox is an error of translation: a conditional-probability inequality is not a causal claim.",
      "\"Harmful\" means $\\mathbb{P}(C_1=1)\\lt\\mathbb{P}(C_0=1)$ in counterfactual terms, not $\\mathbb{P}(Y=1\\mid X=1)\\lt\\mathbb{P}(Y=1\\mid X=0)$.",
      "Stated causally, beneficial-within-each-group implies beneficial-overall, so a true paradox cannot occur."
    ]
  });
})();
