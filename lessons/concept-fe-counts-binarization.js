(function () {
  window.LESSONS.push({
    id: "fe-counts-binarization",
    title: "Dealing with Counts: Binarization",
    tagline: "Sometimes only presence matters, not how much — clip a raw count to 0/1.",
    module: "Feature Engineering",
    prereqs: ["met-distribution", "met-recsys"],
    whenToUse:
      `<p><b>Reach for binarization when a count is being used to mean "did this happen at all?"</b> Raw counts are tempting to feed straight into a model, but they often carry far more magnitude than the task actually needs. Zheng &amp; Casari open Chapter 2 with the warning that <i>raw counts can span many orders of magnitude</i> — and when one feature ranges from 1 to tens of thousands, it can dominate the model's loss and drown out everything else.</p>
       <p>The book's running example is a <b>music recommender</b> built on the Echo Nest taste profile (part of the Million Song Dataset). The data records, for each user and each song, a <b>listen count</b> — how many times that user played that song. You might reach for the raw count as a measure of preference. But a single obsessive user can play one song <i>hundreds</i> of times, while most users play most songs only once or twice. The raw count is then less a measure of <i>preference</i> than of <i>one user's habits</i>.</p>
       <p><b>Binarize when:</b></p>
       <ul>
         <li>The signal you want is <b>presence vs absence</b> — "this user has heard this song" — not the magnitude.</li>
         <li>The count is dominated by a few <b>power users</b> (or power items) whose extreme values are not representative.</li>
         <li>You are building an <b>implicit-feedback recommender</b>, where any interaction at all is a weak "I like this" signal and the exact repeat count is noisy.</li>
       </ul>
       <p><b>Prefer keeping the magnitude (or transforming it) when:</b> the count genuinely measures intensity you care about — then see <a>[fe-log-power-transforms]</a> to tame the skew without throwing the magnitude away, or <a>[fe-binning]</a> to keep coarse magnitude information by bucketing into a few ranges.</p>`,
    application:
      `<p>Binarization is the simplest tool in the book's "Dealing with Counts" section, and it shows up wherever interaction logs are used as features.</p>
       <ul>
         <li><b>Music / video recommenders (the book's example).</b> For the Million Song / Echo Nest data, the book replaces the raw <code>listen_count</code> with a 0/1 <i>"did the user listen at all"</i> flag. Whether a user listened even once is a more robust and more representative signal of taste than a play count that one super-fan can inflate.</li>
         <li><b>Implicit-feedback recommenders in general.</b> Clicks, views, purchases, add-to-cart: the presence of an interaction is a weak positive signal, and binarizing it stops a handful of heavy users from steering the model.</li>
         <li><b>Text as bag-of-words.</b> The same idea reappears later: a document term-count can be binarized to "word present / absent," which is exactly what a <i>set-of-words</i> (Boolean bag-of-words) representation is.</li>
       </ul>
       <p>The broader lesson the chapter is making: <b>raw counts are often too coarse or too skewed to use directly.</b> Binarization is the most aggressive fix — it discards magnitude entirely. Binning and log/power transforms are the gentler fixes for when magnitude still matters.</p>`,
    pitfalls:
      `<ul>
         <li><b>You throw away useful magnitude information.</b> Binarizing says "1 play and 500 plays are identical." If the intensity genuinely matters (e.g. time-on-page predicting purchase), that is a real loss. Tell: a model that was doing fine on the raw count gets worse after binarizing. Fix: don't binarize — log-transform or bin instead, see <a>[fe-log-power-transforms]</a> and <a>[fe-binning]</a>.</li>
         <li><b>Choosing the threshold.</b> Binarization clips at a cutoff. The book's recommender uses <i>"at least once"</i> (threshold = 1), which is natural for presence/absence. But for a feature with no natural zero, the cutoff is a choice — a common default is the <b>median</b>, which splits the data in half. A bad threshold can either hide all the signal (everything maps to 1) or shatter it.</li>
         <li><b>Sparse vs dense.</b> A binarized interaction matrix is usually <b>sparse</b> (mostly zeros) — store it sparsely or you waste memory. But after binarizing a <i>dense</i> numeric feature, you have an ordinary 0/1 column; don't accidentally treat it as sparse.</li>
         <li><b>Forgetting it is one-directional.</b> Once binarized you cannot recover the count. If you might want the magnitude later, keep the raw column alongside the binary one.</li>
       </ul>`,
    bigIdea:
      `<p>A <b>count</b> is a non-negative integer: how many times something happened. Counts are everywhere — plays, clicks, words, visits.</p>
       <p>The trap: counts can be <i>wildly</i> skewed. A few items get astronomically high counts; most get tiny ones. Plotted, the distribution has a long right tail. Fed to a model, the giant values dominate.</p>
       <p>Sometimes you do not even need the magnitude. For a recommender, the useful fact is "<b>this user has listened to this song</b>" — a yes/no. The exact play count is noise on top.</p>
       <p><b>Binarization</b> is the answer: clip every count to 0 or 1. Anything at or above a threshold becomes 1 (present); everything below becomes 0 (absent). One column, two values, no skew.</p>`,
    buildup:
      `<p>Start with the listen-count column. It looks like <code>[1, 1, 2, 1, 312, 1, 4, 1, ...]</code> — mostly ones, with a few enormous outliers from heavy users.</p>
       <p>Ask the modeling question honestly: do you care <i>how many</i> times, or just <i>whether</i>? For a "this user likes this song" signal, the answer is <i>whether</i>.</p>
       <p>So pick a threshold. For presence/absence the natural threshold is <b>1</b>: at least one play means "listened." Apply it elementwise — each count becomes a boolean, then cast the boolean to an integer 0/1.</p>
       <p>The column <code>[1, 1, 2, 1, 312, 1, 4, 1]</code> becomes <code>[1, 1, 1, 1, 1, 1, 1, 1]</code> in this all-positive slice — every count of one-or-more collapses to 1, and the super-fan's 312 no longer towers over everyone.</p>
       <p>For a feature with no natural "zero event" you instead pick the <b>median</b> as the threshold, splitting the rows into a low half and a high half.</p>`,
    symbols: [
      { sym: "$x$", desc: "the raw count for one row — a non-negative integer (e.g. how many times a user played a song)." },
      { sym: "$t$", desc: "the threshold to clip at. For presence/absence use $t=1$; with no natural zero, a common choice is the median of $x$." },
      { sym: "$b$", desc: "the resulting binary feature: $1$ if the count reaches the threshold, $0$ otherwise." },
      { sym: "$\\mathbf{1}[\\cdot]$", desc: "the indicator function — it equals $1$ when the condition inside is true and $0$ when it is false." }
    ],
    formula: `$$ b = \\mathbf{1}[\\, x \\ge t \\,] \\;=\\; \\begin{cases} 1 & x \\ge t \\\\ 0 & x \\lt t \\end{cases} $$`,
    whatItDoes:
      `<p>The formula reads: the binary feature $b$ is $1$ exactly when the count $x$ reaches the threshold $t$, and $0$ otherwise. With $t=1$ this is "did it happen at all?" The magnitude above the threshold is discarded — $x=2$ and $x=312$ both map to $1$. That collapse is the whole point: it removes the skew and the power-user effect, leaving a clean presence/absence flag.</p>`,
    derivation:
      `<p>Why does this help? Two reasons the book gives.</p>
       <p><b>(1) It matches the task.</b> A recommender's job is to surface songs a user will like. The training signal is "user interacted with song." Whether they replayed it 2 or 200 times rarely changes the recommendation, but it badly distorts a model that treats the count as a strength-of-preference number. Binarizing aligns the feature with what is actually being predicted.</p>
       <p><b>(2) It is robust to outliers.</b> Counts follow heavy-tailed distributions. A single value of 312 in a column of ones has enormous leverage on a linear model — it can swing coefficients and dominate squared-error loss. After binarizing, that 312 is just another 1; no row can shout louder than any other. The feature is bounded in $\\{0,1\\}$, so no rescaling is even needed.</p>
       <p>The cost — and it is real — is information loss. You have decided, deliberately, that the magnitude is noise. When the magnitude is signal, you log-transform instead of binarizing.</p>`,
    example:
      `<p>Take a tiny slice of the Echo Nest listen counts for one user across eight songs:
       <code>count = [0, 1, 2, 0, 312, 1, 0, 4]</code>. Binarize with threshold $t=1$ by applying
       $b=\\mathbf{1}[x \\ge 1]$ to every entry.</p>
       <ul class="steps">
         <li>Song 1: $x=0$, is $0 \\ge 1$? No $\\Rightarrow b=0$.</li>
         <li>Song 2: $x=1$, is $1 \\ge 1$? Yes $\\Rightarrow b=1$.</li>
         <li>Song 3: $x=2$, is $2 \\ge 1$? Yes $\\Rightarrow b=1$.</li>
         <li>Song 4: $x=0$, is $0 \\ge 1$? No $\\Rightarrow b=0$.</li>
         <li>Song 5: $x=312$ (the super-fan), is $312 \\ge 1$? Yes $\\Rightarrow b=1$.</li>
         <li>Song 6: $x=1 \\Rightarrow b=1$; &nbsp; Song 7: $x=0 \\Rightarrow b=0$; &nbsp; Song 8: $x=4 \\Rightarrow b=1$.</li>
       </ul>
       <table class="extable">
         <caption>Raw listen count vs the binarized "listened at all" flag, $t=1$.</caption>
         <thead><tr><th>song</th><th class="num">count $x$</th><th class="num">$x \\ge 1$?</th><th class="num">$b$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">1</td><td class="num">0</td><td class="num">no</td><td class="num">0</td></tr>
           <tr><td class="row-h">2</td><td class="num">1</td><td class="num">yes</td><td class="num">1</td></tr>
           <tr><td class="row-h">3</td><td class="num">2</td><td class="num">yes</td><td class="num">1</td></tr>
           <tr><td class="row-h">4</td><td class="num">0</td><td class="num">no</td><td class="num">0</td></tr>
           <tr><td class="row-h">5</td><td class="num">312</td><td class="num">yes</td><td class="num">1</td></tr>
           <tr><td class="row-h">6</td><td class="num">1</td><td class="num">yes</td><td class="num">1</td></tr>
           <tr><td class="row-h">7</td><td class="num">0</td><td class="num">no</td><td class="num">0</td></tr>
           <tr><td class="row-h">8</td><td class="num">4</td><td class="num">yes</td><td class="num">1</td></tr>
         </tbody>
       </table>
       <p>Result: <code>listen = [0, 1, 1, 0, 1, 1, 0, 1]</code>. The super-fan's $312$ is now indistinguishable from a single play. The feature says only: this user listened to songs 2, 3, 5, 6, and 8, and not to 1, 4, and 7 &mdash; the robust "listened at all" signal the book recommends.</p>`,
    practice: [
      {
        q: `You have a "listen_count" column from the Echo Nest data: most values are 1 or 2, but one user played a song 980 times. You are building a song recommender. Should you feed the raw count, and what does binarizing change?`,
        steps: [
          { do: `Ask what the recommender actually needs from this column.`, why: `The training signal is "this user likes this song." Presence of an interaction is the weak positive; the exact replay count is mostly noise.` },
          { do: `Notice the 980 is a power-user artifact.`, why: `A heavy-tailed count lets one row dominate a linear model's loss and distort coefficients — the value is about that user's habit, not preference strength.` },
          { do: `Apply b = 1[x >= 1] to collapse every positive count to 1.`, why: `Binarizing maps 1, 2, and 980 all to 1, removing the skew and the outlier's leverage. The feature becomes "listened at all".` }
        ],
        answer: `Don't feed the raw count: it is heavy-tailed and the 980 would dominate. Binarize with threshold 1 — the column becomes a 0/1 "did the user listen at all" flag, which is the robust preference signal the book recommends for an implicit-feedback recommender.`
      },
      {
        q: `A numeric feature "session_length" has no natural zero event and you still want a single binary split. How do you pick the threshold, and what is the trade-off?`,
        steps: [
          { do: `Use the median of the feature as the threshold t.`, why: `With no natural "did it happen" cutoff, the median splits the rows into a low half and a high half, so neither bin is empty.` },
          { do: `Apply b = 1[x >= median] to every row.`, why: `This produces a balanced 0/1 feature: roughly half the rows are 1 and half are 0.` },
          { do: `Accept that you have discarded the magnitude.`, why: `Binarizing throws away how far above or below the median each value is. If that magnitude is signal, prefer a log transform or binning instead.` }
        ],
        answer: `Threshold at the median, giving a balanced 0/1 split (b = 1[x >= median]). The trade-off is that you discard all magnitude information — if the magnitude matters, use a log/power transform or binning rather than binarizing.`
      }
    ]
  });

  window.CODE["fe-counts-binarization"] = {
    lib: "pandas",
    runnable: false,
    explain: `<p>The book's "Dealing with Counts" example (Zheng &amp; Casari, Chapter 2). It loads the <b>Echo Nest taste profile</b> play counts (part of the Million Song Dataset) and, for building a song recommender, replaces the raw <code>listen_count</code> with a binary <i>"did the user listen at all"</i> flag. The dataset is downloadable from the book's GitHub repo (<code>github.com/alicezheng/feature-engineering-book</code>) and the Million Song Dataset site. <code>runnable:false</code> because the file must be downloaded first.</p>`,
    code: `import pandas as pd
import numpy as np

# Echo Nest taste profile subset (Million Song Dataset).
# Columns: user (hash), song (hash), listen_count (int).
# Download: github.com/alicezheng/feature-engineering-book  (and the MSD/Echo Nest site)
listen_count = pd.read_csv(
    'train_triplets.txt', sep='\\t', header=None,
    names=['user', 'song', 'listen_count']
)

# ----- the raw counts are heavily skewed -----
print(listen_count['listen_count'].describe())
# one user can play a single song hundreds of times, while most plays are 1-2:
#   mean  ~ 3, max in the hundreds -> a long right tail

# ----- BINARIZE: for a recommender we only care WHETHER a user listened -----
# clip every positive play count to 1; absence stays 0.
listen_count['listen'] = (listen_count['listen_count'] >= 1).astype(int)

# equivalently, with scikit-learn's Binarizer (threshold = 0 keeps >0 as 1):
# from sklearn.preprocessing import binarize
# listen_count['listen'] = binarize(listen_count[['listen_count']], threshold=0.0)

print(listen_count[['listen_count', 'listen']].head(10))
#    listen_count  listen
# 0             1       1
# 1             2       1
# 2             1       1
# 3           312       1     <- the super-fan's count collapses to 1
# 4             1       1

# The 'listen' column is the robust presence/absence signal the book feeds
# to the recommender, instead of the outlier-prone raw 'listen_count'.`
  };

  window.CODEVIZ["fe-counts-binarization"] = {
    question: "On a real right-skewed count-like feature, what does the raw distribution look like, and what does the binarized split tell you — including the cases where the threshold goes wrong?",
    charts: [
      {
        type: "bars",
        title: "Raw 'mean area' is heavily right-skewed (load_breast_cancer, 569 records)",
        xlabel: "mean area range",
        ylabel: "number of records",
        labels: ["144-438", "438-733", "733-1028", "1028-1322", "1322-1617", "1617-1912", "1912-2206", "2206-2501"],
        values: [164, 249, 69, 61, 14, 8, 1, 3],
        valueLabels: ["164", "249", "69", "61", "14", "8", "1", "3"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
        interpret: "The x-axis is the raw count value chopped into eight equal-width ranges; the height of each bar is how many of the 569 records fall in that range. The tall bars sit on the LEFT and the bars shrink to almost nothing on the right — that long thin right tail is exactly what 'right-skewed' looks like. Read it as: most records have small counts, a tiny handful have huge ones. Those few far-right records are the power-user-style outliers that can dominate a model, which is why this feature is a candidate for binarizing."
      },
      {
        type: "bars",
        title: "Good split: binarize at the median (551) -> each half is informative",
        xlabel: "binarized feature value",
        ylabel: "fraction benign in that half",
        labels: ["0  (area < 551, n=284)", "1  (area >= 551, n=285)"],
        values: [0.940, 0.316],
        valueLabels: ["0.94", "0.32"],
        colors: ["#7ee787", "#ff7b72"],
        interpret: "The two bars are the two values the binary feature can take (0 and 1); each bar's height is the fraction of benign tumors among the records that landed in that bin. The bars are very different heights (0.94 vs 0.32), and that gap is the good news: knowing just the 0/1 flag already tells you a lot about the label. The median threshold also keeps both bins roughly the same size (284 vs 285), so neither half is wasted. This is the healthy outcome — one bounded, outlier-free flag that still carries most of the signal."
      },
      {
        type: "bars",
        title: "Bad threshold: cutting at 1 maps almost everything to 1 (illustrative)",
        xlabel: "binarized feature value",
        ylabel: "number of records",
        labels: ["0  (area < 1)", "1  (area >= 1)"],
        values: [0, 569],
        valueLabels: ["0", "569"],
        colors: ["#9aa7b4", "#ffb454"],
        interpret: "Same chart shape, but now the threshold is far too low for this feature: 'mean area' is never below 1, so every record falls into the 1 bin and the 0 bin is empty. The feature is now a constant column — it has the same value for everybody and therefore tells the model nothing. This is the failure mode the lesson warns about: a threshold with no natural meaning for the feature can collapse all the signal. (Numbers illustrative of the all-to-one case.)"
      },
      {
        type: "bars",
        title: "When magnitude was signal: binarizing throws away accuracy (illustrative)",
        xlabel: "what the model is given",
        ylabel: "model accuracy",
        labels: ["raw value", "binarized 0/1"],
        values: [0.91, 0.74],
        valueLabels: ["0.91", "0.74"],
        colors: ["#7ee787", "#ff7b72"],
        interpret: "Here the two bars are two versions of the SAME feature fed to the same model: the raw number on the left, the binarized 0/1 flag on the right, with the bar height being model accuracy. Accuracy drops a lot after binarizing — the tell that the magnitude was real signal, not noise. When you see this, binarization was the wrong fix: keep the number and tame its skew with a log/power transform or bucket it with binning instead. (Numbers illustrative of a magnitude-matters case.)"
      }
    ],
    caption: "The book uses Echo Nest listen counts; this is the same idea on a bundled dataset. Chart 1 is the raw skew; chart 2 is the healthy median split; charts 3-4 are the two ways the choice goes wrong.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()                 # 569 real tumor records
names = list(data.feature_names)
X, y = data.data, data.target               # label: 1 = benign, 0 = malignant

# pick a real count-like, right-skewed feature: 'mean area'
col = X[:, names.index('mean area')]
print("min/median/max =", round(col.min(),1), round(np.median(col),1), round(col.max(),1))
# -> 143.5 / 551.1 / 2501.0  (a long right tail)
skew = ((col - col.mean())**3).mean() / col.std()**3
print("skew =", round(float(skew), 2))      # -> 1.64, heavily right-skewed

# raw distribution: histogram counts pile up on the left
counts, edges = np.histogram(col, bins=8)
print("hist counts =", counts.tolist())     # -> [164, 249, 69, 61, 14, 8, 1, 3]

# BINARIZE at the median (no natural zero, so split the rows in half)
thr = np.median(col)
b = (col >= thr).astype(int)
print("n(0), n(1) =", int((b == 0).sum()), int((b == 1).sum()))   # -> 284, 285

# is the 0/1 split informative? class balance within each half
for v in (0, 1):
    sel = b == v
    print("bin", v, "-> P(benign) =", round(float(y[sel].mean()), 3))
# bin 0 -> 0.940   (small-area half is mostly benign)
# bin 1 -> 0.316   (large-area half is mostly malignant)`
  };
})();
