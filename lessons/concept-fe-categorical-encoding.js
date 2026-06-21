/* Feature Engineering — Chapter 5, "Encoding Categorical Variables".
   BEGINNER lesson. Self-contained: lesson + CODE + CODEVIZ merged by id "fe-categorical-encoding". */
(function () {
  window.LESSONS.push({
    id: "fe-categorical-encoding",
    title: "Encoding categorical variables: one-hot, dummy, and effect coding",
    tagline: "Turn a category like city or browser into numbers a model can use, without inventing a fake order.",
    module: "Feature Engineering",
    prereqs: ["fe-binning", "ml-classification-metrics"],

    bigIdea:
      `<p>A <b>categorical variable</b> is a column whose values are <b>names</b>, not numbers:
       a city (<code>SF</code>, <code>NYC</code>, <code>Seattle</code>), a browser
       (<code>Chrome</code>, <code>Safari</code>), a product category. The categories have <b>no built-in
       order</b> &mdash; <code>NYC</code> is not "bigger than" <code>SF</code>. But almost every model wants
       <b>numbers</b> as input. So we have to turn names into numbers <i>without smuggling in a false
       ordering</i>.</p>
       <p>The naive trick &mdash; just label the cities <code>0, 1, 2</code> &mdash; is exactly the mistake.
       It tells a linear model that <code>Seattle</code> (2) is twice <code>NYC</code> (1) and that the gap
       <code>SF&rarr;NYC</code> equals the gap <code>NYC&rarr;Seattle</code>. None of that is true. Chapter 5
       of Zheng &amp; Casari's <i>Feature Engineering for Machine Learning</i> shows the right way: give each
       category its <b>own column</b>. The chapter's running example is a tiny table of <b>cities and their
       rents</b>.</p>
       <p>The book covers three closely related schemes: <b>one-hot encoding</b> (one binary column per
       category), <b>dummy coding</b> (drop one redundant column), and <b>effect coding</b> (code the
       dropped category as all &minus;1). This lesson is those three and when to pick each.</p>`,

    buildup:
      `<p>Say a column has $k$ distinct categories. We want to represent each value as a short vector of
       numbers so that no two categories sit at a "halfway point" between others.</p>
       <p><b>One-hot encoding.</b> Make <b>$k$ binary columns</b>, one per category. A row's vector has a
       single <b>1</b> in the column for its category and <b>0</b> everywhere else &mdash; exactly one
       column is "hot". For three cities: $\\text{SF}=(1,0,0)$, $\\text{NYC}=(0,1,0)$,
       $\\text{Seattle}=(0,0,1)$. Every category is the same distance from every other, so no fake order
       sneaks in.</p>
       <p><b>Dummy coding.</b> One-hot has a <b>redundancy</b>: the three columns always sum to 1, so any one
       column is determined by the other two. Dummy coding drops one column &mdash; pick a <b>reference
       category</b> and code it as <b>all zeros</b>. Now there are only <b>$k-1$ columns</b>:
       $\\text{SF}=(1,0)$, $\\text{NYC}=(0,1)$, $\\text{Seattle}=(0,0)$ (Seattle is the reference). Same
       information, one fewer column, and the redundancy with an intercept is gone.</p>
       <p><b>Effect coding.</b> Like dummy coding &mdash; still $k-1$ columns &mdash; but the reference
       category is coded as <b>all &minus;1</b> instead of all zeros: $\\text{SF}=(1,0)$,
       $\\text{NYC}=(0,1)$, $\\text{Seattle}=(-1,-1)$. This small change makes the linear-model
       <b>intercept</b> come out as the <b>grand mean</b> (the overall average), which is often the nicest
       thing to read off.</p>`,

    symbols: [
      { sym: "$k$", desc: "the number of distinct categories in the column (e.g. 3 cities)." },
      { sym: "$\\mathbf{e}_i$", desc: "the one-hot vector for category $i$: a length-$k$ vector that is 1 in position $i$ and 0 elsewhere." },
      { sym: "$x_j$", desc: "the value of the $j$-th encoded column (0/1 for one-hot and dummy; 0/1/&minus;1 for effect coding)." },
      { sym: "$\\beta_0$", desc: "the intercept (bias) of a linear model fit on the encoded columns &mdash; what the model predicts when every encoded column is 0." },
      { sym: "$\\beta_j$", desc: "the weight (coefficient) the linear model learns for encoded column $j$ &mdash; the effect of that category." },
      { sym: "$\\bar{y}$", desc: "the grand mean: the overall average of the target across all categories (what $\\beta_0$ equals under effect coding)." }
    ],

    formula:
      `$$ \\text{one-hot: } \\mathbf{e}_i\\in\\{0,1\\}^{k},\\ \\textstyle\\sum_j (\\mathbf{e}_i)_j = 1
         \\qquad
         \\text{dummy / effect: } \\mathbf{x}_i\\in\\mathbb{R}^{\\,k-1} $$
       $$ \\text{reference category} =
         \\begin{cases} (0,\\dots,0) & \\text{dummy coding}\\\\ (-1,\\dots,-1) & \\text{effect coding}\\end{cases} $$`,

    whatItDoes:
      `<p><b>One-hot</b> spends $k$ columns and keeps perfect symmetry: every category is one "hot" bit, all
       categories are equidistant. Simple and the most common, but it carries one redundant column.</p>
       <p><b>Dummy coding</b> spends $k-1$ columns by making one category the <b>baseline</b> (all zeros).
       Fit a linear model and the intercept $\\beta_0$ becomes the baseline category's mean; each
       $\\beta_j$ is how much category $j$ <b>differs from the baseline</b>. This removes the
       collinearity that one-hot has with an intercept.</p>
       <p><b>Effect coding</b> also spends $k-1$ columns but codes the reference as all &minus;1. Now the
       intercept $\\beta_0$ equals the <b>grand mean</b> $\\bar{y}$, and each $\\beta_j$ is how much
       category $j$ differs from that overall average &mdash; a more symmetric, often more interpretable,
       read-out.</p>`,

    derivation:
      `<p><b>Why drop a column, and why &minus;1 gives the grand mean.</b></p>
       <ul class="steps">
         <li>Start from one-hot: $k$ binary columns whose values always add to 1. If your model also has an
         <b>intercept</b> column (a constant 1, which linear and logistic regression include by default),
         then "intercept = sum of the $k$ one-hot columns". That is an exact linear dependence among the
         inputs &mdash; the <b>dummy-variable trap</b>. The design matrix is rank-deficient and the
         coefficients are <b>not unique</b>.</li>
         <li><b>Dummy coding</b> breaks the dependence by deleting one column. The deleted category becomes
         the <b>reference</b>, coded all-zeros. Fit $y=\\beta_0+\\sum_{j}\\beta_j x_j$: a reference row has
         all $x_j=0$, so it predicts $\\beta_0$. Thus $\\beta_0$ = the reference category's mean, and each
         $\\beta_j$ = (category $j$ mean) &minus; (reference mean). Clean, but the reference is "special".</li>
         <li><b>Effect coding</b> deletes the same column but codes the reference as all &minus;1. Now write
         the predicted mean for category $j$ as $\\beta_0+\\beta_j$ (for $j$ among the kept categories) and
         for the reference as $\\beta_0-\\sum_j \\beta_j$. Requiring these group means to average to the
         overall mean forces $\\sum_j \\beta_j$ to balance, and the algebra collapses to
         $\\beta_0=\\bar{y}$, the <b>grand mean</b>. Each $\\beta_j$ is then category $j$'s deviation from
         that grand mean.</li>
         <li>So all three carry the <b>same information</b>; they differ only in <b>what the intercept and
         coefficients mean</b>. One-hot keeps the redundancy (fine if you have <i>no</i> intercept or use
         regularization); dummy makes one category the baseline; effect makes the baseline the grand mean.
         $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>The book's tiny table: three cities, their rents (averaged per city), encoded three ways.</p>
       <p>Group means &mdash; $\\text{SF}=4000$, $\\text{NYC}=3500$, $\\text{Seattle}=2500$; grand mean
       $\\bar{y}=\\tfrac{4000+3500+2500}{3}=3333.3$.</p>
       <ul class="steps">
         <li><b>One-hot (3 columns).</b> $\\text{SF}=(1,0,0)$, $\\text{NYC}=(0,1,0)$,
         $\\text{Seattle}=(0,0,1)$. With <i>no</i> intercept the three weights come out as the three group
         means $4000, 3500, 2500$.</li>
         <li><b>Dummy coding (2 columns, Seattle = reference = all-zeros).</b> $\\text{SF}=(1,0)$,
         $\\text{NYC}=(0,1)$, $\\text{Seattle}=(0,0)$. Fit with an intercept: $\\beta_0=2500$ (Seattle's
         mean), $\\beta_{\\text{SF}}=4000-2500=1500$, $\\beta_{\\text{NYC}}=3500-2500=1000$. Each weight is
         a gap <i>from Seattle</i>.</li>
         <li><b>Effect coding (2 columns, Seattle = reference = all &minus;1).</b> $\\text{SF}=(1,0)$,
         $\\text{NYC}=(0,1)$, $\\text{Seattle}=(-1,-1)$. Now $\\beta_0=\\bar{y}=3333.3$ (the grand mean),
         $\\beta_{\\text{SF}}=4000-3333.3=666.7$, $\\beta_{\\text{NYC}}=3500-3333.3=166.7$. Each weight is a
         deviation <i>from the overall average</i>; Seattle's deviation is recovered as
         $-(\\beta_{\\text{SF}}+\\beta_{\\text{NYC}})=-833.3$.</li>
       </ul>
       <p>Same data, three lenses: one-hot keeps every city symmetric, dummy reads "vs. Seattle", effect
       reads "vs. the average city".</p>`,

    whenToUse:
      `<p><b>Pick the scheme by your model and what you want to read off.</b></p>
       <ul>
         <li><b>One-hot encoding</b> &mdash; the default for <b>low-cardinality</b> categories
         (a handful to a few dozen values) feeding a <b>linear model, logistic regression, or neural net</b>.
         Symmetric, simple, and the redundant column is harmless if you regularize or have no explicit
         intercept. This is what <code>pandas.get_dummies</code> and
         <code>sklearn OneHotEncoder</code> give you.</li>
         <li><b>Dummy coding</b> &mdash; use when your linear model has an <b>intercept</b> and you want
         <b>no collinearity</b> and coefficients read as "difference from a chosen baseline" (e.g. compare
         every treatment to a control). It is <code>get_dummies(..., drop_first=True)</code>.</li>
         <li><b>Effect coding</b> &mdash; same $k-1$ columns, but you want the intercept to be the
         <b>grand mean</b> and each coefficient to be a deviation from the overall average. Favored in
         classical statistics (ANOVA-style) for symmetric, interpretable effects.</li>
         <li><b>Trees and gradient boosting</b> can take a plain <b>label encoding</b> (categories as
         integers): they split on thresholds and don't assume the spacing is meaningful, so they sidestep
         the false-order problem one-hot was protecting against.</li>
       </ul>`,

    application:
      `<p>Categorical encoding is the bread-and-butter of any tabular pipeline.</p>
       <ul>
         <li><b>The book's city &rarr; rent example.</b> Zheng &amp; Casari encode a city column three ways
         (one-hot, dummy, effect) and fit a linear model to show how the <b>intercept and coefficients</b>
         change meaning while predictions stay the same.</li>
         <li><b>Web / ads / recsys features.</b> Browser, device, country, ad category, and product type are
         all categorical and get one-hot encoded before linear or logistic models.</li>
         <li><b>Why it sets up the rest of Chapter 5.</b> One-hot is <b>sparse</b> and <b>explodes</b> with
         <b>high-cardinality</b> categories (millions of user IDs or zip codes &rarr; millions of columns).
         That blow-up is exactly what motivates the chapter's next tools: <b>feature hashing</b> and
         <b>bin-counting</b>, which keep the column count bounded.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>High-cardinality blow-up &amp; sparsity.</b> One-hot makes one column <i>per category</i>.
         A user-ID or zip-code column with millions of values becomes millions of mostly-zero columns &mdash;
         huge memory, slow training. The fix is later in Chapter 5: <b>feature hashing</b> (fix the number
         of columns) or <b>bin-counting</b> (replace the category with target statistics).</li>
         <li><b>The dummy-variable trap (collinearity with an intercept).</b> Full one-hot columns sum to 1,
         which is collinear with a model's intercept column &mdash; coefficients become non-unique. Use
         <b>dummy/effect coding</b> (drop one column) when you have an intercept and no regularization.</li>
         <li><b>Unseen categories at test time.</b> A category that never appeared in training has no column.
         Fix it by setting <code>handle_unknown='ignore'</code> on <code>OneHotEncoder</code> (encode the new
         value as all-zeros) and by fitting the encoder on the <b>training set only</b>.</li>
         <li><b>Never label-encode for a linear model.</b> Mapping categories to $0,1,2,\\dots$ injects a
         <b>fake order and spacing</b>; a linear model will read meaning into it. Label encoding is fine for
         trees, not for linear / distance-based models.</li>
       </ul>`,

    practice: [
      {
        q: `You have a <code>browser</code> column with values Chrome, Safari, Firefox, Edge and you feed it to a logistic regression that includes an intercept. A teammate one-hot encodes it into 4 columns and the fit warns about a singular matrix. What happened and what is the fix?`,
        steps: [
          { do: `Notice the 4 one-hot columns always sum to 1 for every row.`, why: `Exactly one browser is "hot", so the four binary columns add to a constant 1.` },
          { do: `See that the model's intercept is also a constant-1 column.`, why: `Intercept = sum of the four one-hot columns is an exact linear dependence — the dummy-variable trap.` },
          { do: `Drop one column: dummy coding with <code>drop_first=True</code> (or effect coding).`, why: `Removing one category as the reference breaks the dependence; the matrix becomes full rank and coefficients are unique.` }
        ],
        answer: `<p>Full one-hot columns sum to 1, which is collinear with the intercept &mdash; the
         <b>dummy-variable trap</b>, giving a singular (rank-deficient) design matrix. Switch to
         <b>dummy coding</b> (<code>pd.get_dummies(..., drop_first=True)</code>) or <b>effect coding</b>:
         3 columns with one browser as the reference. Alternatively, drop the intercept or add
         regularization, which also resolves the non-uniqueness.</p>`
      },
      {
        q: `Encode three cities (SF, NYC, Seattle, with mean rents 4000, 3500, 2500) using effect coding with Seattle as the reference, then read off what the linear model's intercept and SF coefficient mean.`,
        steps: [
          { do: `Build the codes: SF=(1,0), NYC=(0,1), Seattle=(-1,-1).`, why: `Effect coding uses $k-1=2$ columns and codes the reference category as all &minus;1.` },
          { do: `Recall that under effect coding the intercept equals the grand mean.`, why: `Grand mean $\\bar y=(4000+3500+2500)/3=3333.3$, so $\\beta_0=3333.3$.` },
          { do: `Compute the SF coefficient as SF's deviation from the grand mean.`, why: `$\\beta_{\\text{SF}}=4000-3333.3=666.7$; each coefficient is a deviation from the overall average.` }
        ],
        answer: `<p>Codes: $\\text{SF}=(1,0)$, $\\text{NYC}=(0,1)$, $\\text{Seattle}=(-1,-1)$. The intercept is
         the <b>grand mean</b> $\\beta_0=\\bar{y}=3333.3$. The SF coefficient is SF's deviation from that
         average, $\\beta_{\\text{SF}}=4000-3333.3=666.7$. Seattle's deviation is recovered as
         $-(\\beta_{\\text{SF}}+\\beta_{\\text{NYC}})=-(666.7+166.7)=-833.3$, i.e. Seattle sits 833 below the
         grand mean.</p>`
      },
      {
        q: `You must encode a <code>zip_code</code> column with about 30,000 distinct values for a linear model. Why is plain one-hot encoding a poor choice here, and what does Chapter 5 suggest instead?`,
        steps: [
          { do: `Count the columns one-hot would create: one per zip code.`, why: `30,000 categories &rarr; 30,000 mostly-zero columns &mdash; the high-cardinality blow-up.` },
          { do: `Note the cost: huge sparse matrices, lots of memory, slow training, and many columns seen only a few times.`, why: `Rare categories give unreliable weights and the dimensionality explodes.` },
          { do: `Reach for the chapter's high-cardinality tools.`, why: `Feature hashing caps the column count by hashing categories into a fixed number of buckets; bin-counting replaces the category with target statistics.` }
        ],
        answer: `<p>One-hot makes one column per zip code &mdash; ~30,000 sparse columns &mdash; which is
         memory-hungry, slow, and full of rarely-seen features. This is the <b>high-cardinality blow-up</b>.
         Chapter 5's answer is <b>feature hashing</b> (hash categories into a fixed, small number of columns)
         or <b>bin-counting</b> (replace each category with statistics of the target, e.g. its click-through
         rate), both of which keep the dimensionality bounded.</p>`
      }
    ]
  });

  window.CODE["fe-categorical-encoding"] = {
    lib: "pandas + scikit-learn",
    runnable: false,
    explain: `<p>The chapter's exact approach on a tiny <b>city &rarr; rent</b> table.
       <code>pandas.get_dummies</code> gives plain <b>one-hot</b> (one column per city);
       <code>drop_first=True</code> gives <b>dummy coding</b> (one city becomes the all-zeros reference);
       and a small tweak turns dummy codes into <b>effect codes</b> (the reference row becomes all
       &minus;1). <code>scikit-learn</code>'s <code>OneHotEncoder</code> is the production-grade one-hot that
       also handles unseen categories. Fit a linear model on each and watch the <b>intercept and
       coefficients</b> change meaning while predictions stay identical. The book's data is on its GitHub
       (github.com/alicezheng/feature-engineering-book); set <code>runnable</code> aside.</p>`,
    code: `import numpy as np
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.linear_model import LinearRegression

# --- The book's tiny city -> rent table (Chapter 5) ---
df = pd.DataFrame({
    'city': ['SF', 'SF', 'NYC', 'NYC', 'Seattle', 'Seattle'],
    'rent': [4001, 3999, 3501, 3499, 2501, 2499],   # ~ means 4000 / 3500 / 2500
})

# === One-hot encoding ===  one binary column per city (k columns)
one_hot = pd.get_dummies(df['city'], prefix='city')
print(one_hot)
#    city_NYC  city_SF  city_Seattle
# 0         0        1             0   <- SF
# ...

# scikit-learn's OneHotEncoder (handles unseen categories at test time)
ohe = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
X_ohe = ohe.fit_transform(df[['city']])
print(ohe.categories_)        # [array(['NYC', 'SF', 'Seattle'], ...)]

# === Dummy coding ===  drop one column -> reference category is all-zeros (k-1 cols)
dummy = pd.get_dummies(df['city'], prefix='city', drop_first=True)
# 'NYC' is dropped -> NYC is the reference, coded (0, 0).
lin = LinearRegression().fit(dummy, df['rent'])
print('dummy intercept :', lin.intercept_)   # ~ NYC mean (the reference)
print('dummy coefs     :', lin.coef_)         # each = (city mean) - (NYC mean)

# === Effect coding ===  reference category coded as all -1 (k-1 cols)
effect = dummy.copy().astype(float)
ref_rows = (df['city'] == 'NYC').values       # the reference category
effect.loc[ref_rows, :] = -1.0                # all-zeros row -> all -1
lin2 = LinearRegression().fit(effect, df['rent'])
print('effect intercept:', lin2.intercept_)   # ~ GRAND MEAN of the city means
print('effect coefs    :', lin2.coef_)         # each = (city mean) - (grand mean)`
  };

  window.CODEVIZ["fe-categorical-encoding"] = {
    question: "Bin a real wine feature ('color_intensity' from load_wine) into 3 named categories (pale / medium / deep). What does the one-hot matrix look like, and how many columns does one-hot use versus dummy coding?",
    charts: [
      {
        type: "bars",
        title: "Category frequencies (load_wine 'color_intensity' split at its terciles)",
        labels: ["pale", "medium", "deep"],
        values: [60, 58, 60],
        valueLabels: ["60", "58", "60"],
        colors: ["#7ee787", "#58a6ff", "#ff7b72"]
      },
      {
        type: "heatmap",
        title: "One-hot matrix: 9 sample rows (3 per category) x 3 columns — exactly one 1 per row",
        rows: ["pale #1", "pale #2", "pale #3", "med #1", "med #2", "med #3", "deep #1", "deep #2", "deep #3"],
        cols: ["pale", "medium", "deep"],
        matrix: [
          [1, 0, 0],
          [1, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [0, 1, 0],
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 1],
          [0, 0, 1]
        ],
        showVals: true
      }
    ],
    caption: "Real numbers from load_wine (178 wines). 'color_intensity' is split at its terciles into three named categories — frequencies 60 / 58 / 60, nicely balanced. The one-hot matrix (9 sample rows, 3 per category) has exactly one 1 per row: each category gets its own column and no false ordering is implied. One-hot uses k=3 columns; dummy coding drops one (the reference) for k-1=2. The book uses a city -> rent table; this is the same idea on a bundled dataset.",
    code: `import numpy as np
from sklearn.datasets import load_wine
from sklearn.preprocessing import OneHotEncoder

d = load_wine()                                  # 178 real wine samples
fi = list(d.feature_names).index('color_intensity')
ci = d.data[:, fi]                               # a continuous numeric feature

# --- Bin into 3 NAMED categories at the terciles (33rd / 67th percentile) ---
edges = np.percentile(ci, [0, 100/3, 200/3, 100])
names = np.array(['pale', 'medium', 'deep'])
idx = np.clip(np.digitize(ci, edges[1:-1]), 0, 2)
labels = names[idx]                              # now a CATEGORICAL column

# Category frequencies (the bar chart):
for c in names:
    print(c, int((labels == c).sum()))           # -> pale 60 / medium 58 / deep 60

# --- One-hot encode; take 3 sample rows per category for the heatmap ---
order = ['pale', 'medium', 'deep']
samp = np.concatenate([np.where(labels == c)[0][:3] for c in order])
ohe = OneHotEncoder(sparse_output=False, categories=[order])
M = ohe.fit_transform(labels[samp].reshape(-1, 1)).astype(int)
print(M)                                          # block-diagonal: one 1 per row
print('one-hot columns :', M.shape[1])            # -> 3   (k categories)
print('dummy columns   :', M.shape[1] - 1)        # -> 2   (drop the reference)`
  };
})();
