/* Data Wrangling — "Showing uncertainty & telling the story".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-uncertainty-storytelling". */
(function () {
  window.LESSONS.push({
    id: "dw-uncertainty-storytelling",
    title: "Showing uncertainty & telling the story",
    tagline: "Present a finding honestly: show the error bars, and make one clear point per chart.",
    module: "Data Wrangling",
    prereqs: ["met-uncertainty", "met-effect-size"],

    whenToUse:
      `<p><b>Every time you present results</b> &mdash; a report, a slide, a dashboard, a README plot.
       The moment someone is going to <b>make a decision</b> off your numbers, this lesson matters most.</p>
       <ul>
         <li><b>Show uncertainty</b> when you report any estimate from a <b>sample</b>: a mean, a rate, a
         lift, a model score. The sample is not the whole world, so the number is not exact &mdash; say
         how unsure you are.</li>
         <li><b>Tell a story</b> when the audience must leave with <b>one takeaway</b>. Raw plots dump
         numbers; a story arranges them so the conclusion is unmissable.</li>
         <li>Reach for a <b>distribution</b> (or error bars / a confidence band) instead of a single bar
         whenever the spread is part of the message &mdash; which is almost always.</li>
       </ul>`,

    application:
      `<p>This is the last mile of nearly every data project.</p>
       <ul>
         <li><b>A/B test readout.</b> "Variant B lifted sign-ups by 4% (95% CI: 1% to 7%, n = 12k)."
         The interval and the sample size are what let a reader judge whether to ship.</li>
         <li><b>Forecast charts.</b> A revenue projection drawn as a single line lies by omission; the
         honest version is a line plus a shaded <b>confidence band</b> that widens into the future.</li>
         <li><b>Model comparison.</b> Two accuracies of 0.81 and 0.83 mean nothing without their error
         bars &mdash; if the bars overlap heavily, the "winner" may be noise.</li>
         <li><b>Executive slides.</b> The title states the finding ("Sign-ups doubled after launch"),
         one annotation points at the proof, and everything else is greyed-out context.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>A point estimate with no uncertainty.</b> Reporting "the mean is 4.2" as if it were exact
         <b>overclaims</b>. Fix: always attach an interval &mdash; a 95% confidence interval, or at least a
         standard error &mdash; and state the sample size $n$.</li>
         <li><b>Error bars with no label.</b> A bar of "&plusmn;2.3" is meaningless until you say what it
         is. Standard deviation (SD), standard error (SE), and a 95% confidence interval (CI) are three
         different sizes. Fix: caption it &mdash; "error bars = 95% CI".</li>
         <li><b>Cherry-picking the story.</b> Showing only the segment, week, or metric that supports your
         conclusion is dishonest even if every number is real. Fix: report the pre-registered metric and
         the full picture; call out where the story does <i>not</i> hold.</li>
         <li><b>Titles that describe instead of conclude.</b> "Sales by month" makes the reader do the
         work. Fix: state the finding &mdash; "Sales doubled after the May launch".</li>
         <li><b>Too many takeaways per figure.</b> Five trends on one chart means zero land. Fix: one
         chart, one point; split the rest into separate figures.</li>
         <li><b>Ignoring sample size.</b> A 50% conversion rate from 4 users is not the same as from 4,000.
         Fix: annotate $n$ on the chart and let tiny-$n$ bars get wide error bars.</li>
         <li><b>p-hacking the narrative.</b> Trying many cuts and reporting the one that looks
         "significant" inflates false findings. Fix: decide the analysis before looking, and treat
         post-hoc patterns as hypotheses, not conclusions.</li>
       </ul>`,

    bigIdea:
      `<p>You have done the wrangling. The data is clean, the analysis is done, and you have a number:
       group A averages <b>4.2</b>, group B averages <b>3.7</b>. The temptation is to draw two bars and
       declare A the winner. That is where honest communication begins &mdash; and where most reports go
       wrong.</p>
       <p>Two jobs sit on top of every results figure. First, <b>show the uncertainty</b>. Your 4.2 came
       from a <b>sample</b>, not the whole population, so it is fuzzy. How fuzzy? A <b>95% confidence
       interval (CI)</b> answers that: a range that would contain the true mean about 95 times out of 100
       if you repeated the study. Draw it as an <b>error bar</b> on each bar, a <b>shaded band</b> around
       a line, or by showing the whole <b>distribution</b> instead of a lone summary. If A's bar reads
       4.2 &plusmn; 0.1 and B's reads 3.7 &plusmn; 0.1, the gap is real; if both bars are &plusmn; 0.6,
       you cannot tell them apart.</p>
       <p>Second, <b>tell the story</b>. A chart is not a data dump &mdash; it is one sentence drawn in
       ink. Give it the structure of any good message: <b>context</b> (what we are looking at), the
       <b>insight or conflict</b> (the surprising thing), and the <b>resolution</b> (what to do). Put the
       conclusion in the <b>title</b> &mdash; not "Revenue by quarter" but "Revenue doubled after the
       launch". Use one <b>annotation</b> to point at the proof, and <b>grey out</b> everything that is
       merely context so the eye lands on the focus. The goal of both jobs together: the audience leaves
       with the <b>right conclusion, appropriately hedged</b> &mdash; confident where the data is
       confident, and cautious where it is thin.</p>`,

    buildup:
      `<p>The uncertainty side rests on one idea from sampling: a sample mean $\\bar{x}$ wobbles around the
       true mean. The size of that wobble is the <b>standard error</b> (SE).</p>
       <p><b>Standard deviation vs standard error.</b> The standard deviation $s$ measures how spread out
       the <b>individual data points</b> are. The standard error measures how spread out the
       <b>mean estimate</b> is &mdash; and it shrinks as you collect more data:
       $\\mathrm{SE}=s/\\sqrt{n}$. With $n=100$ the SE is one-tenth the SD; with $n=10{,}000$ it is one
       hundredth. This is exactly why sample size matters: more data, tighter error bars.</p>
       <p><b>From SE to a 95% confidence interval.</b> The interval is the estimate plus-or-minus a
       multiplier times the SE: $\\bar{x}\\pm t\\cdot\\mathrm{SE}$. For a roughly normal mean and a decent
       sample the multiplier $t$ is about <b>1.96</b> (often rounded to 2), which is where "&plusmn; 2
       standard errors" comes from. For small samples you use the slightly larger <i>t</i>-distribution
       value, which a library computes for you.</p>
       <p>The storytelling side has no formula &mdash; it is a checklist. <b>Context &rarr; insight &rarr;
       resolution</b> for the arc; <b>one takeaway per chart</b>; a <b>finding-stating title</b>;
       <b>annotate</b> the key point; <b>grey context, highlight focus</b>; and <b>reveal
       progressively</b> so the audience follows one step at a time instead of facing a wall of marks at
       once.</p>`,

    symbols: [
      { sym: "$\\bar{x}$", desc: "the sample mean &mdash; the average of the data points you actually collected. It estimates the unknown true mean." },
      { sym: "$s$", desc: "the sample standard deviation: how spread out the individual data points are around $\\bar{x}$." },
      { sym: "$n$", desc: "the sample size: how many data points went into the estimate. Bigger $n$ means a more trustworthy, tighter estimate." },
      { sym: "$\\mathrm{SE}$", desc: "standard error of the mean, $s/\\sqrt{n}$: how much the sample mean itself would jump around if you repeated the study." },
      { sym: "$t$", desc: "the confidence multiplier (about $1.96$ for 95% on a large sample; a bit larger for small $n$). It scales the SE into the interval half-width." }
    ],

    formula:
      `$$ \\mathrm{SE}=\\frac{s}{\\sqrt{n}}, \\qquad
         \\text{95% CI} = \\bar{x} \\;\\pm\\; t \\cdot \\mathrm{SE}
         \\;\\approx\\; \\bar{x} \\;\\pm\\; 1.96\\,\\frac{s}{\\sqrt{n}} $$`,

    whatItDoes:
      `<p>The first piece turns the spread of the <b>points</b> ($s$) into the spread of the
       <b>estimate</b> by dividing by $\\sqrt{n}$. That is the whole reason a larger sample earns a
       narrower error bar &mdash; the $\\sqrt{n}$ in the denominator shrinks the SE.</p>
       <p>The second piece widens the SE into a <b>95% confidence interval</b> by multiplying by about
       $1.96$. Drawn as an error bar, this interval is the honest version of your number: the bar's
       center is your best guess, and its length says how much you should trust it. Two bars whose
       intervals barely overlap are plausibly different; two whose intervals overlap heavily are not
       distinguishable from this data.</p>`,

    derivation:
      `<p><b>Why dividing by $\\sqrt{n}$ tightens the bar.</b></p>
       <ul class="steps">
         <li>Imagine repeating your whole study many times. Each run gives a slightly different sample
         mean $\\bar{x}$. Those means form their own distribution, centered on the true mean.</li>
         <li>Sampling theory says the spread of that distribution &mdash; the standard error &mdash; is the
         per-point spread $s$ divided by $\\sqrt{n}$. Averaging cancels noise: independent wobbles partly
         offset, and the cancellation grows with $n$.</li>
         <li>So quadrupling the sample size <b>halves</b> the error bar ($\\sqrt{4}=2$). Diminishing
         returns: going from 100 to 400 helps a lot; from 10,000 to 40,000 barely moves the bar.</li>
         <li>To turn the SE into a range you can quote, take a window wide enough to capture the true mean
         95% of the time. For a normal-ish mean that window is $\\pm 1.96$ SE. The result,
         $\\bar{x}\\pm1.96\\,\\mathrm{SE}$, is the 95% confidence interval you draw. $\\blacksquare$</li>
       </ul>
       <p>Storytelling does not derive; it follows from how attention works. The eye lands on the
       <b>brightest, most-labeled</b> thing first, so you spend that attention deliberately: one bright
       series, one annotation, a title that has already told the reader the answer.</p>`,

    example:
      `<p>Two onboarding flows, measuring sign-ups per 100 visitors.</p>
       <ul class="steps">
         <li><b>Flow A:</b> mean 42, $s=10$, $n=100$. So $\\mathrm{SE}=10/\\sqrt{100}=1.0$, and the 95% CI
         is $42\\pm1.96(1.0)$, about <b>40 to 44</b>.</li>
         <li><b>Flow B:</b> mean 37, $s=10$, $n=100$. Same math gives $\\mathrm{SE}=1.0$, CI about
         <b>35 to 39</b>.</li>
         <li>The intervals (40&ndash;44 vs 35&ndash;39) <b>do not overlap</b>, so the 5-point gap is real,
         not sampling noise. <b>Title it the finding:</b> "Flow A converts 5 points higher (95% CIs
         disjoint, n = 100 each)" &mdash; not "Conversion by flow".</li>
         <li>Now suppose B had only $n=4$. Then $\\mathrm{SE}=10/\\sqrt{4}=5.0$ and B's CI is roughly
         <b>27 to 47</b> &mdash; a huge bar that swallows A's. Same point estimate, totally different
         conclusion: with $n=4$ you <b>cannot</b> claim A is better. That is why $n$ goes on the chart.</li>
       </ul>`,

    practice: [
      {
        q: `Your slide shows two bars: model X at 0.84 accuracy and model Y at 0.82, no error bars, titled "Accuracy by model". List three things wrong and fix each.`,
        steps: [
          { do: `Add uncertainty: compute and draw a 95% CI (or SE) on each bar, and state $n$ (the test-set size).`, why: `Bare point estimates overclaim; a 0.02 gap may be inside the noise. The interval lets the reader judge if X truly beats Y.` },
          { do: `Label what the error bars are once they exist: "error bars = 95% CI".`, why: `An unlabeled bar is ambiguous &mdash; SD, SE, and CI are different sizes and imply different things.` },
          { do: `Rewrite the title to state the finding, e.g. "Models X and Y are within noise (overlapping 95% CIs, n = 2k)".`, why: `A descriptive title makes the reader do the work; a finding-stating title delivers the conclusion.` }
        ],
        answer: `<p>(1) <b>No uncertainty</b> &mdash; add 95% CIs and the test-set $n$; a 0.02 gap is likely noise. (2) <b>Unlabeled bars</b> &mdash; caption them ("95% CI"). (3) <b>Descriptive title</b> &mdash; replace "Accuracy by model" with the actual conclusion, e.g. that the two are within noise. Bonus: grey one series if there is a focus, and don't cherry-pick the one test split where X happened to win.</p>`
      },
      {
        q: `A conversion rate of 60% comes from one segment with 5 users and another with 5,000 users. Both get the same fat bar on your chart. What is the problem and the fix?`,
        steps: [
          { do: `Note that the standard error scales as $1/\\sqrt{n}$, so the 5-user estimate is far less certain than the 5,000-user one.`, why: `$\\mathrm{SE}=s/\\sqrt{n}$: with $n=5$ the bar is about $\\sqrt{1000}\\approx32$ times wider than with $n=5{,}000$.` },
          { do: `Draw each bar with its own 95% CI and annotate $n$ on each.`, why: `The 5-user bar should be visibly enormous; the 5,000-user bar tight. Equal-looking bars hide that one number is a guess.` },
          { do: `Resist concluding anything from the 5-user segment.`, why: `Its interval may span most of 0&ndash;100%; calling it "60%" as if exact is overclaiming on a tiny sample.` }
        ],
        answer: `<p>The chart <b>ignores sample size</b>: 60% from $n=5$ and 60% from $n=5{,}000$ carry wildly different certainty, but identical bars imply they're equally trustworthy. Fix: give each bar its real <b>95% CI</b> (the $n=5$ bar will be huge because $\\mathrm{SE}=s/\\sqrt{n}$) and <b>annotate $n$</b>. Don't draw conclusions from the tiny segment.</p>`
      },
      {
        q: `You want to convince leadership that "Sign-ups doubled after the May launch" from a line chart of weekly sign-ups. Sketch the storytelling moves you'd make.`,
        steps: [
          { do: `Put the conclusion in the title: "Sign-ups doubled after the May launch", not "Weekly sign-ups".`, why: `The title is the first thing read; state the finding so the chart confirms it rather than asking the reader to deduce it.` },
          { do: `Structure context &rarr; insight &rarr; resolution: show the flat pre-launch baseline, mark the launch, then the rise.`, why: `A clear arc makes the change feel like a story with a cause, not a random wiggle.` },
          { do: `Annotate the launch week with a vertical marker and a short label; grey the pre-launch line, highlight the post-launch line.`, why: `One annotation and a single bright series direct attention to the exact moment that proves the point.` },
          { do: `Add a confidence band or note the sample size so the claim is hedged, and avoid cherry-picking a flattering window.`, why: `Honesty: show the uncertainty and the full timeline so the doubling isn't an artifact of where you cropped.` }
        ],
        answer: `<p>Finding-stating <b>title</b> ("Sign-ups doubled after the May launch"); a <b>context &rarr; insight &rarr; resolution</b> arc (flat baseline, launch marker, rise); one <b>annotation</b> on the launch week; <b>grey the baseline, highlight the post-launch line</b>; and a <b>confidence band / sample-size note</b> with no cherry-picked window so the claim stays honest. One chart, one takeaway.</p>`
      }
    ]
  });

  window.CODE["dw-uncertainty-storytelling"] = {
    lib: "matplotlib + numpy + pandas",
    runnable: false,
    explain: `<p>An end-to-end "honest results" figure on a small real-ish A/B table. It (1) computes each
      group's mean and <b>95% confidence interval</b> from the sample, (2) plots the means <b>with error
      bars</b> and annotates each bar's <b>sample size $n$</b>, (3) sets a <b>finding-stating title</b>
      instead of a descriptive one, (4) <b>annotates</b> the key point, and (5) <b>greys out the context
      group and highlights the focus group</b> so the eye lands on the takeaway. Drop in your own
      <code>df</code> with columns <code>group</code> and <code>value</code>; <code>runnable</code> is off
      only because the dataframe is a stand-in.</p>`,
    code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats

# --- A small real-ish A/B result: sign-ups per visitor, two onboarding flows ---
rng = np.random.default_rng(0)
df = pd.DataFrame({
    "group": ["A"] * 100 + ["B"] * 100,
    "value": np.r_[rng.normal(0.42, 0.10, 100),   # focus flow
                   rng.normal(0.37, 0.10, 100)],  # context (baseline) flow
})

# === 1. Mean + 95% confidence interval per group (show the uncertainty) ===
def mean_ci(x, conf=0.95):
    x = np.asarray(x); n = len(x)
    m  = x.mean()
    se = x.std(ddof=1) / np.sqrt(n)            # SE = s / sqrt(n)
    h  = se * stats.t.ppf((1 + conf) / 2, n - 1)  # ~1.96 * SE for large n
    return m, h, n

stats_by_group = {g: mean_ci(d["value"]) for g, d in df.groupby("group")}
groups  = list(stats_by_group)                 # ["A", "B"]
means   = [stats_by_group[g][0] for g in groups]
cis     = [stats_by_group[g][1] for g in groups]   # half-widths (the +/- )
ns      = [stats_by_group[g][2] for g in groups]

# === 2-5. Plot means WITH error bars; grey context, highlight focus ===
focus = "A"
colors = ["#1f77b4" if g == focus else "#cccccc" for g in groups]  # grey vs highlight

fig, ax = plt.subplots(figsize=(6, 4))
bars = ax.bar(groups, means, yerr=cis, capsize=8,
              color=colors, edgecolor="none",
              error_kw=dict(ecolor="#444", lw=1.5))

# annotate each bar with its sample size n
for g, m, h, n in zip(groups, means, cis, ns):
    ax.text(g, m + h + 0.005, f"n = {n}", ha="center", va="bottom",
            fontsize=9, color="#444")

# finding-stating title (states the conclusion, not "Conversion by flow")
ax.set_title("Flow A converts ~5 points higher — 95% CIs don't overlap",
             fontsize=12, fontweight="bold", loc="left")
ax.set_ylabel("Sign-ups per visitor")
ax.set_ylim(0, max(m + h for m, h in zip(means, cis)) * 1.25)

# annotate the key point, pointing at the focus bar
fi = groups.index(focus)
ax.annotate("Real gap: intervals are disjoint",
            xy=(fi, means[fi] - cis[fi]), xytext=(fi + 0.15, means[fi] * 0.55),
            fontsize=9, color="#1f77b4",
            arrowprops=dict(arrowstyle="->", color="#1f77b4"))

ax.spines[["top", "right"]].set_visible(False)
fig.text(0.01, 0.01, "Error bars = 95% confidence interval", fontsize=8, color="#777")
plt.tight_layout()
plt.show()`
  };

  window.CODEVIZ["dw-uncertainty-storytelling"] = {
    question: "Real wine chemistry: the mean 'proline' level differs by grape variety — but by how much, and is the gap real? Bare means vs means with 95% confidence intervals.",
    charts: [
      {
        type: "bars",
        title: "Bare means hide how sure we are",
        labels: ["class 0", "class 1", "class 2"],
        values: [1115.7, 519.5, 629.9],
        valueLabels: ["1116", "519", "630"],
        colors: ["#cccccc", "#cccccc", "#cccccc"]
      },
      {
        type: "bars",
        title: "Class 0 is far higher — 95% CIs don't overlap (n labeled)",
        labels: ["class 0 (n=59)", "class 1 (n=71)", "class 2 (n=48)"],
        values: [1115.7, 519.5, 629.9],
        valueLabels: ["1116 ±58", "519 ±37", "630 ±33"],
        colors: ["#1f77b4", "#cccccc", "#cccccc"]
      }
    ],
    caption: "Real numbers from sklearn's load_wine: mean 'proline' per grape-variety class with 95% confidence intervals (half-widths shown as ±). Left: three bare bars — you cannot tell if the gaps are real. Right: the same means with their 95% CIs and sample sizes n. Class 0's interval [1058, 1173] sits far above class 1's [482, 557] and class 2's [597, 663] — they don't overlap, so class 0 really is higher. The focus class is highlighted; the other two are greyed as context. Error bars = 95% CI.",
    code: `import numpy as np
from sklearn.datasets import load_wine
from scipy import stats

d = load_wine(as_frame=True)
df = d.frame                                  # 178 real wines, 13 chemistry features
feat = "proline"                              # strongly variety-dependent

rows = []
for cls in sorted(df["target"].unique()):
    x  = df.loc[df["target"] == cls, feat].values
    n  = len(x)
    m  = x.mean()
    se = x.std(ddof=1) / np.sqrt(n)           # SE = s / sqrt(n)
    h  = se * stats.t.ppf(0.975, n - 1)       # 95% CI half-width (~1.96*SE)
    rows.append((cls, n, m, h, m - h, m + h))

for cls, n, m, h, lo, hi in rows:
    print(f"class {cls}: n={n}  mean={m:7.1f}  95% CI = [{lo:6.1f}, {hi:6.1f}]  (+/- {h:.1f})")

# class 0: n=59  mean=1115.7  95% CI = [1058.0, 1173.4]  (+/- 57.7)
# class 1: n=71  mean= 519.5  95% CI = [ 482.3,  556.7]  (+/- 37.2)
# class 2: n=48  mean= 629.9  95% CI = [ 596.5,  663.3]  (+/- 33.4)
# The intervals don't overlap -> the class differences are real, not sampling noise.`
  };
})();
