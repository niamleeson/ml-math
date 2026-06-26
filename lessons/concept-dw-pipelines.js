/* Data Wrangling — "Reproducible pipelines".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-pipelines". */
(function () {
  window.LESSONS.push({
    id: "dw-pipelines",
    title: "Reproducible wrangling: script it as a pipeline",
    tagline: "Bundle every cleaning step into one fitted object so train, test, and live serving all get the exact same treatment.",
    module: "Data Wrangling",
    prereqs: ["skill-validation", "skill-leakage"],

    whenToUse:
      `<p><b>Reach for a pipeline the moment your work outlives a single sitting.</b> A throwaway
       exploration in a notebook can be hand-edited. Anything else should be scripted.</p>
       <ul>
         <li><b>Always</b> &mdash; for any project where you will re-run the cleaning more than once, share
         it with a teammate, or evaluate on a held-out test set. Hand-edited cells silently drift.</li>
         <li><b>Mandatory for production.</b> If a model will <b>serve live requests</b>, the cleaning that
         ran at training time must run <i>byte-for-byte identically</i> at serving time. A pipeline is how
         you guarantee that &mdash; you ship one fitted object, not a notebook of manual steps.</li>
         <li><b>Versus hand-editing cells.</b> Manually filling a few nulls or dropping rows in a notebook
         feels faster, but it is <b>not reproducible</b>: you cannot replay the exact same edits on next
         month's data or on the serving path. Script it instead.</li>
       </ul>`,

    application:
      `<p>Reproducible pipelines are the backbone of every real data project.</p>
       <ul>
         <li><b>Train / test split.</b> The same <code>fit</code> on train then <code>transform</code> on
         test &mdash; one object, two calls &mdash; gives you an honest, leakage-free evaluation.</li>
         <li><b>Production serving.</b> The fitted pipeline is saved to disk and loaded by the serving
         service, so a live request is cleaned with the <i>identical</i> imputers, encoders, and scalers
         the model was trained on. This is how you avoid <b>train/serve skew</b>.</li>
         <li><b>Cross-validation &amp; tuning.</b> Wrapping preprocessing in a pipeline lets every
         cross-validation fold refit its transforms on that fold's training portion only &mdash; the only
         way to tune hyper-parameters without leaking.</li>
         <li><b>Handoff &amp; audit.</b> A scripted pipeline <i>is</i> the documentation of how the data was
         cleaned. A reviewer reads the steps; they don't have to trust your memory of which cells you ran.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Fitting a transform on the full dataset (the cardinal sin).</b> Computing a scaler's mean,
         an imputer's fill value, an encoder's category list, or a selector's chosen columns on
         <b>train + test together</b> leaks test information into training. Scores look great, then
         <b>collapse</b> on live data. The fix: fit on <b>train only</b>, then merely
         <code>transform</code> test and serving data.</li>
         <li><b>Train/serve skew from manual cleaning.</b> Cleaning the training data by hand in a notebook
         and re-implementing "the same" cleaning in the serving service is a recipe for subtle mismatches
         &mdash; a different default fill, a category seen in training but not handled live. The fix: one
         scripted pipeline, saved and loaded by both sides.</li>
         <li><b>Forgetting to persist the fitted transformer.</b> If you save only the model and re-run the
         cleaning code at serving time, any data-learned values (means, category maps) are recomputed from
         whatever data is around &mdash; not the training values. The fix: <code>joblib.dump</code> the
         <i>whole fitted pipeline</i> (transforms + model) as one artifact.</li>
         <li><b>Data-dependent steps living outside the pipeline or outside cross-validation.</b> A scaler or
         feature selector run once on all the data <i>before</i> the split or the CV loop leaks &mdash; even
         if the model itself is wrapped properly. Every step that <b>learns from data</b> must sit
         <i>inside</i> the pipeline so it refits per split.</li>
       </ul>`,

    bigIdea:
      `<p>Cleaning data by clicking through notebook cells &mdash; fill this null, drop that row, map these
       categories &mdash; feels productive, but it leaves you with <b>no record of what you did</b> that you
       can replay. Next month's data arrives and you cannot reproduce the exact same cleaning. Worse, when
       the model goes live, the serving code does cleaning <i>its own way</i>, and the live data is now
       subtly different from the training data. The model degrades and nobody knows why.</p>
       <p>The fix is to stop hand-editing and instead <b>script the cleaning as a pipeline</b>: an ordered
       list of named steps that you <code>fit</code> once and can re-run on any data forever. In
       scikit-learn this is a <code>Pipeline</code>, and a <code>ColumnTransformer</code> lets you apply
       different steps to different <b>column types</b> &mdash; impute-then-scale the numeric columns,
       impute-then-one-hot-encode the categorical columns &mdash; all bundled into one object.</p>
       <p>The <b>golden rule</b> sits at the heart of it: any step that <i>learns</i> something from the data
       &mdash; an imputer learning a fill value, a scaler learning a mean and standard deviation, an encoder
       learning the category list, a selector learning which columns to keep &mdash; must be
       <b>fit on the training data only</b>, then used to merely <code>transform</code> test and serving
       data. A pipeline enforces this for you: <code>pipe.fit(X_train)</code> fits every step on train;
       <code>pipe.transform(X_test)</code> applies the already-learned values without re-learning.</p>`,

    buildup:
      `<p>Picture a table with two numeric columns and two categorical columns, plus some missing values.
       The cleaning you want is: for numbers, fill missing with the median then standardize; for categories,
       fill missing with the most frequent value then one-hot encode. Four steps, applied to different
       columns.</p>
       <p><b>Step 1 &mdash; group steps per column type with a <code>ColumnTransformer</code>.</b> You declare
       a numeric branch (<code>SimpleImputer(strategy="median")</code> &rarr;
       <code>StandardScaler</code>) and a categorical branch (<code>SimpleImputer(strategy="most_frequent")</code>
       &rarr; <code>OneHotEncoder</code>), and tell the <code>ColumnTransformer</code> which column names go
       to which branch. It runs each branch on its columns and glues the results back together.</p>
       <p><b>Step 2 &mdash; chain it with the model in a <code>Pipeline</code>.</b> The
       <code>ColumnTransformer</code> becomes the <code>"prep"</code> step and the estimator becomes the
       <code>"model"</code> step. Now the whole thing &mdash; cleaning <i>and</i> prediction &mdash; is a
       single object.</p>
       <p><b>Step 3 &mdash; fit on train, transform on test.</b> <code>pipe.fit(X_train, y_train)</code> learns
       every imputer's fill, every scaler's mean/std, every encoder's category list <i>from the training data
       only</i>, and trains the model. <code>pipe.predict(X_test)</code> applies those same learned values to
       the test data without re-learning. No leakage, by construction.</p>
       <p><b>Step 4 &mdash; persist the one artifact.</b> <code>joblib.dump(pipe, "model.joblib")</code> saves
       the fitted transforms <i>and</i> the model together. The serving service does
       <code>joblib.load(...)</code> and calls <code>.predict</code> on a raw live row &mdash; the exact same
       cleaning runs, so training and production share one source of truth.</p>`,

    derivation:
      `<p><b>Why fitting on the full dataset is leakage, made concrete.</b></p>
       <ul class="steps">
         <li>Take a scaler. It standardizes a column $x$ as $z=\\dfrac{x-\\mu}{\\sigma}$, where $\\mu$ and
         $\\sigma$ are the column's mean and standard deviation. These two numbers are <b>learned from
         data</b> &mdash; they are parameters of the transform, exactly like a model's weights.</li>
         <li>If you compute $\\mu,\\sigma$ over <b>train + test together</b>, then $\\mu$ and $\\sigma$ depend
         on the test rows. Every transformed training value $z$ now carries a whisper of the test set. Your
         model trains on data that has secretly seen the test distribution.</li>
         <li>The measured test score is therefore <b>optimistic</b>: the model had an unfair peek. When the
         model meets <i>genuinely unseen</i> live data &mdash; which was never part of any $\\mu,\\sigma$
         estimate &mdash; the advantage vanishes and performance drops. The good score was a mirage.</li>
         <li>The pipeline fixes this mechanically. <code>pipe.fit(X_train)</code> computes
         $\\mu,\\sigma$ from train only and stores them. <code>pipe.transform(X_test)</code> applies those
         stored numbers to the test column &mdash; it does <b>not</b> recompute them. The test set never
         touches the fitting. Honest by construction.</li>
         <li>The same argument holds for an imputer's fill value, an encoder's category vocabulary, and a
         selector's chosen columns: each is a quantity learned from data, so each must be learned on train
         only. The pipeline applies the rule to <i>every</i> step at once. $\\blacksquare$</li>
       </ul>`,

    symbols: [
      { sym: "$x$", desc: "a raw value in a numeric column, before scaling." },
      { sym: "$\\mu,\\ \\sigma$", desc: "the mean and standard deviation a scaler LEARNS from a column &mdash; must be computed on train only." },
      { sym: "$z=\\frac{x-\\mu}{\\sigma}$", desc: "the standardized value the scaler produces: subtract the learned mean, divide by the learned standard deviation." }
    ],

    example:
      `<p>A tiny table. One numeric column <code>age</code> with a missing value, one categorical column
       <code>city</code>.</p>
       <p>Train rows: <code>age = [30, 50, ?]</code>, <code>city = [NYC, LA, NYC]</code>.
       Test row: <code>age = [40]</code>, <code>city = [SF]</code>.</p>
       <ul class="steps">
         <li><b>Fit on train.</b> The median age of the two known training values is
         $\\text{median}(30,50)=40$, so the imputer's fill value is <b>40</b>. After filling, the training
         ages are $30,50,40$, with mean $\\mu=40$ and standard deviation $\\sigma\\approx 8.16$. The encoder
         learns the category list <code>{NYC, LA}</code> from train.</li>
         <li><b>Transform train.</b> Ages standardize to $z=\\frac{x-40}{8.16}$: roughly
         $-1.22,\\ 1.22,\\ 0$. Cities one-hot encode against <code>{NYC, LA}</code>.</li>
         <li><b>Transform test.</b> The test age <b>40</b> is filled if missing using the <i>training</i>
         median 40, and standardized with the <i>training</i> $\\mu=40,\\sigma=8.16$ &mdash; giving $z=0$.
         The test city <b>SF</b> was never seen in training, so with
         <code>handle_unknown="ignore"</code> it encodes as all-zeros instead of crashing.</li>
       </ul>
       <p>Notice the test row was cleaned entirely with numbers <i>learned from train</i>. Nothing about the
       test set leaked back into the fill value, the mean, the std, or the category list. That is the whole
       point.</p>`,

    practice: [
      {
        q: `A colleague standardizes all the features with <code>StandardScaler().fit_transform(X)</code> on the whole dataset, <i>then</i> splits into train and test and reports a great test accuracy. What is wrong, and how should it be done?`,
        steps: [
          { do: `Identify that the scaler LEARNS the mean and standard deviation from data.`, why: `Those are parameters of the transform, so fitting them is "training" and must respect the train/test boundary.` },
          { do: `Note that fitting on all of <code>X</code> uses the test rows to set the mean and std.`, why: `Test information has bled into the transform applied to the training data &mdash; that is leakage, and it inflates the test score.` },
          { do: `Put the scaler inside a <code>Pipeline</code> with the model and call <code>pipe.fit(X_train)</code>, then <code>pipe.score(X_test)</code>.`, why: `Now the mean/std are learned on train only and merely applied to test &mdash; honest by construction.` }
        ],
        answer: `<p>The <code>StandardScaler</code> was <b>fit on the full dataset</b>, so its mean and standard deviation depend on the test rows &mdash; classic <b>leakage</b> that inflates the reported test accuracy. The fix is to wrap the scaler and model in a <code>Pipeline</code> and call <code>fit</code> on the <b>training set only</b>; the pipeline then <code>transform</code>s the test set with the train-learned statistics. The good score was a mirage that would collapse on live data.</p>`
      },
      {
        q: `You have numeric columns with missing values and categorical columns with missing values. Sketch the scikit-learn object that cleans both correctly in one shot.`,
        steps: [
          { do: `Build a numeric branch: <code>SimpleImputer(strategy="median")</code> then <code>StandardScaler()</code>, chained in a small <code>Pipeline</code>.`, why: `Numbers want a median fill (robust to outliers) and standardization.` },
          { do: `Build a categorical branch: <code>SimpleImputer(strategy="most_frequent")</code> then <code>OneHotEncoder(handle_unknown="ignore")</code>.`, why: `Categories want a most-frequent fill and one-hot encoding; ignoring unknowns prevents crashes on unseen live categories.` },
          { do: `Combine the two branches with a <code>ColumnTransformer</code>, routing numeric column names to the first branch and categorical names to the second.`, why: `The <code>ColumnTransformer</code> applies the right steps to the right columns and concatenates the results.` }
        ],
        answer: `<p>A <code>ColumnTransformer</code> with two branches: numeric columns go through <code>SimpleImputer(strategy="median")</code> &rarr; <code>StandardScaler()</code>, and categorical columns go through <code>SimpleImputer(strategy="most_frequent")</code> &rarr; <code>OneHotEncoder(handle_unknown="ignore")</code>. Drop that <code>ColumnTransformer</code> into a <code>Pipeline</code> as the <code>"prep"</code> step ahead of the model, and the whole cleaning-plus-model fits and transforms as one object.</p>`
      },
      {
        q: `Your training script saves the model with <code>joblib.dump(model, ...)</code> but re-implements the cleaning fresh inside the serving service. Why is this risky, and what should you save instead?`,
        steps: [
          { do: `Recognize that the cleaning includes data-learned values: imputer fills, scaler mean/std, encoder category lists.`, why: `Re-implementing the cleaning recomputes these from whatever data the serving service has &mdash; not the training values.` },
          { do: `See that this creates train/serve skew: the live row is cleaned with different numbers than training used.`, why: `Even a small mismatch (a different fill, an unseen category handled differently) shifts the input distribution the model sees.` },
          { do: `Save the <b>whole fitted pipeline</b> &mdash; transforms and model together &mdash; with <code>joblib.dump(pipe, "model.joblib")</code>, and have serving <code>joblib.load</code> it and call <code>.predict</code> on raw rows.`, why: `One artifact means training and serving share the exact same fitted cleaning.` }
        ],
        answer: `<p>Re-implementing the cleaning at serving time recomputes every data-learned value (fills, mean/std, category maps) from the wrong data, causing <b>train/serve skew</b>. Instead, save the <b>entire fitted <code>Pipeline</code></b> (preprocessing + model) as one <code>joblib</code> artifact, and have the serving service load it and call <code>.predict</code> on raw rows. Training and production then run byte-for-byte identical cleaning.</p>`
      }
    ]
  });

  window.CODE["dw-pipelines"] = {
    lib: "pandas + scikit-learn",
    runnable: false,
    explain: `<p>The full reproducible recipe on a small mixed-type table: a <code>ColumnTransformer</code>
      cleans numeric columns (median impute &rarr; standardize) and categorical columns (most-frequent
      impute &rarr; one-hot encode), wrapped with a classifier in one <code>Pipeline</code>. We
      <code>fit</code> on train, <code>predict</code> on test, then <code>joblib.dump</code> the single
      fitted artifact so the serving service loads the <i>identical</i> cleaning. Swap the inline
      <code>DataFrame</code> for your own table (or any <code>sklearn.datasets.fetch_openml</code> set with
      mixed types, e.g. <code>"titanic"</code>). <code>runnable</code> is off only because it expects your
      data.</p>`,
    code: `import pandas as pd
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# --- A small mixed-type table with missing values (NaN) ---
df = pd.DataFrame({
    "age":     [30, 50, None, 24, 41, 38, None, 55],   # numeric, has a gap
    "income":  [60, 85, 72, None, 90, 64, 51, 120],    # numeric, has a gap
    "city":    ["NYC", "LA", "NYC", "SF", None, "LA", "SF", "NYC"],  # categorical
    "plan":    ["free", "pro", "pro", "free", "pro", None, "free", "pro"],
    "churn":   [0, 1, 0, 0, 1, 0, 1, 1],
})
y = df.pop("churn")
X = df

numeric_cols     = ["age", "income"]
categorical_cols = ["city", "plan"]

# --- Per-column-type cleaning, bundled in a ColumnTransformer ---
numeric_branch = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale",  StandardScaler()),
])
categorical_branch = Pipeline([
    ("impute", SimpleImputer(strategy="most_frequent")),
    ("encode", OneHotEncoder(handle_unknown="ignore")),  # unseen live cats -> all-zeros
])
prep = ColumnTransformer([
    ("num", numeric_branch,     numeric_cols),
    ("cat", categorical_branch, categorical_cols),
])

# --- One Pipeline: cleaning THEN model ---
pipe = Pipeline([
    ("prep",  prep),
    ("model", RandomForestClassifier(n_estimators=200, random_state=0)),
])

# --- THE GOLDEN RULE: fit on TRAIN only; transform/predict on test ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=0)
pipe.fit(X_train, y_train)            # learns fills, mean/std, categories FROM TRAIN
print("test accuracy:", pipe.score(X_test, y_test))
preds = pipe.predict(X_test)          # cleans test with train-learned values, then predicts

# --- Persist ONE artifact: transforms + model together ---
joblib.dump(pipe, "churn_pipeline.joblib")

# --- Serving: load the same artifact, predict on a RAW live row ---
served = joblib.load("churn_pipeline.joblib")
live_row = pd.DataFrame([{"age": 47, "income": None, "city": "BERLIN", "plan": "pro"}])
# income is filled with the TRAIN median; 'BERLIN' is an unseen city -> handled, not a crash.
print("live prediction:", served.predict(live_row)[0])`
  };

  window.CODEVIZ["dw-pipelines"] = {
    question: "Fit a feature selector + scaler on ALL the data (leaked) vs inside a Pipeline that refits on TRAIN only per fold — how do the reported accuracies compare, and how do you SEE the difference on a chart?",
    charts: [
      {
        type: "bars",
        title: "Ideal read: leaked vs honest CV accuracy (true accuracy = 0.5, chance)",
        xlabel: "preprocessing strategy",
        ylabel: "CV accuracy",
        labels: ["Leaked (fit on ALL data)", "Pipeline (fit on TRAIN only)", "Truth (chance)"],
        values: [0.81, 0.425, 0.5],
        valueLabels: ["0.81", "0.42", "0.50"],
        colors: ["#ff7b72", "#7ee787", "#9aa7b4"],
        interpret: "Each bar is one reported accuracy; taller = better-looking. The grey bar is the truth: the labels are random, so the best anyone can do is 0.5 (a coin flip). Read the red bar against grey: it sits far ABOVE truth at 0.81 — that 0.31 gap is pure leakage, accuracy manufactured by letting the selector peek at every label. The green bar (Pipeline, refit on train only) sits right at 0.5. <b>Rule of thumb: when a preprocessing-on-all-data bar towers over a known ceiling, the lift is fake.</b>"
      },
      {
        type: "line",
        title: "Variant — leaked score looks great in test, collapses on live data",
        xlabel: "deployment stage",
        ylabel: "accuracy",
        series: [
          { name: "Leaked pipeline", color: "#ff7b72", points: [[0, 0.81], [1, 0.80], [2, 0.51]] },
          { name: "Honest pipeline", color: "#7ee787", points: [[0, 0.50], [1, 0.50], [2, 0.50]] }
        ],
        interpret: "Illustrative. X goes left-to-right through the model's life: 0 = cross-validation, 1 = held-out test, 2 = live production. The red leaked line stays high through CV and even the test (both were contaminated by the same all-data fit), then <b>falls off a cliff to chance at production</b> — the first truly unseen data. The flat green line was honest all along. <b>The tell-tale shape of leakage is a high-then-crashing curve; honesty is flat and unexciting.</b>"
      },
      {
        type: "bars",
        title: "Variant — mild leakage (few features): gap is small and easy to miss",
        xlabel: "preprocessing strategy",
        ylabel: "CV accuracy",
        labels: ["Leaked (fit on ALL data)", "Pipeline (fit on TRAIN only)", "Truth (chance)"],
        values: [0.54, 0.50, 0.50],
        valueLabels: ["0.54", "0.50", "0.50"],
        colors: ["#ffb454", "#7ee787", "#9aa7b4"],
        interpret: "Illustrative — same setup but only ~20 features instead of 5000, so the selector has little room to cherry-pick. The leaked bar (orange) now beats truth by just 0.04, not 0.31. <b>Leakage shrinks with fewer features, so a small gap does not mean it is safe</b> — the bias is still there, just quieter, and it grows fast as you add features. Don't dismiss a 'few points' of unexplained lift; always wrap preprocessing in the Pipeline regardless of how big the gap looks."
      }
    ],
    caption: "Real numbers for the main chart. Data: 200 rows of pure random noise (5000 features) with RANDOM 0/1 labels, so nothing is learnable and honest accuracy is exactly 0.5. The variants are illustrative shapes showing how leakage reveals itself differently across deployment stages and feature counts.",
    code: `import numpy as np
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

rng = np.random.RandomState(0)
n, p = 200, 5000
X = rng.randn(n, p)          # pure noise features
y = rng.randint(0, 2, n)     # RANDOM labels -> nothing learnable; true acc = 0.5

cv = StratifiedKFold(5, shuffle=True, random_state=0)

# --- LEAKED: select the 20 "best" features using ALL the data (peeks at every label) ---
X_leak = SelectKBest(f_classif, k=20).fit_transform(StandardScaler().fit_transform(X), y)
acc_leak = cross_val_score(LogisticRegression(max_iter=2000), X_leak, y, cv=cv).mean()

# --- HONEST: identical steps inside a Pipeline -> refit per fold on TRAIN only ---
pipe = Pipeline([
    ("scale",  StandardScaler()),
    ("select", SelectKBest(f_classif, k=20)),
    ("model",  LogisticRegression(max_iter=2000)),
])
acc_honest = cross_val_score(pipe, X, y, cv=cv).mean()

print("leaked  CV accuracy:", round(acc_leak, 4))    # -> 0.81   (mirage)
print("honest  CV accuracy:", round(acc_honest, 4))  # -> 0.425  (~chance)
print("true accuracy       :", 0.5)                  # nothing is learnable`
  };
})();
