/* Apache Spark — "MLlib: machine learning on data too big for one machine".
   Self-contained: lesson + CODE + CODEVIZ merged by id "spark-mllib". */
(function () {
  window.LESSONS.push({
    id: "spark-mllib",
    title: "MLlib: machine learning at cluster scale",
    tagline: "Spark's DataFrame ML API — Transformers, Estimators, and Pipelines — runs the same training across a cluster on data that won't fit on one machine.",
    module: "Apache Spark",
    prereqs: ["dw-big-data", "dw-pipelines", "ml-logistic-regression"],

    whenToUse:
      `<p><b>MLlib (Machine Learning library) earns its keep when the training data is too big for one
       machine, or when the model lives inside an existing Spark job.</b> If the data fits in RAM, a
       single-node library is faster &mdash; reach for MLlib only when it does not.</p>
       <ul>
         <li><b>Data bigger than one machine.</b> Tens of millions to billions of rows, or feature tables
         wider than any single box can hold. MLlib splits the data across the cluster and trains on all of
         it &mdash; no sampling down to "what fits."</li>
         <li><b>ML inside an existing Spark pipeline.</b> Your ETL (Extract, Transform, Load) already runs in
         Spark and the cleaned features live in a Spark DataFrame. Training in MLlib keeps everything in one
         engine &mdash; no export, no second tool, no copy out to a laptop.</li>
         <li><b>Distributed scoring.</b> You need to score billions of rows. A fitted MLlib model's
         <code>transform</code> runs across the cluster, the same way training did.</li>
       </ul>
       <p><b>Do NOT use it when the data fits in memory.</b> For data that fits in RAM, <b>scikit-learn</b>
       or <b>XGBoost</b> on one machine are faster, have more algorithms, and are easier to debug. MLlib pays
       a coordination tax (shuffles, task scheduling, Java Virtual Machine overhead) that only pays off when
       a single machine genuinely cannot hold or process the data. See <code>dw-big-data</code> for the
       cheaper rungs to try first.</p>`,

    application:
      `<p>MLlib shows up wherever the data is already in Spark and large.</p>
       <ul>
         <li><b>Churn / conversion / fraud models on full event logs.</b> The labelled table is hundreds of
         millions of rows of clickstream or transactions &mdash; far past a single machine &mdash; and a
         logistic-regression or gradient-boosted model is trained on all of it.</li>
         <li><b>Feature engineering at scale.</b> <code>StringIndexer</code>, <code>OneHotEncoder</code>, and
         <code>VectorAssembler</code> turn raw categorical and numeric columns into model-ready vectors across
         billions of rows inside the same job that cleaned them.</li>
         <li><b>Recommendation.</b> MLlib's Alternating Least Squares (ALS) factorizes huge user&times;item
         interaction matrices that would never fit on one box.</li>
         <li><b>Batch scoring.</b> A nightly Spark job loads a saved <code>PipelineModel</code> and scores the
         day's full population, writing predictions back to a table &mdash; all distributed.</li>
       </ul>`,

    bigIdea:
      `<p>MLlib is Spark's library for machine learning on data that is too big for one machine. Its modern
       interface, <code>pyspark.ml</code>, is built around <b>Spark DataFrames</b> and looks almost exactly
       like scikit-learn &mdash; the same <code>fit</code>/<code>transform</code> shapes, the same
       <code>Pipeline</code> idea &mdash; except the work runs <b>across a cluster</b> instead of on one
       processor.</p>
       <p>Everything is built from two kinds of objects:</p>
       <ul>
         <li><b>Transformer.</b> An object with a <code>transform(df)</code> method: it takes a DataFrame and
         returns a new DataFrame with extra or changed columns. It has no learning to do &mdash; it just maps
         rows. <code>VectorAssembler</code> (packs several feature columns into one vector column) and a
         <i>fitted</i> model are Transformers.</li>
         <li><b>Estimator.</b> An object with a <code>fit(df)</code> method that <b>learns</b> from data and
         returns a Transformer (a fitted "model"). <code>LogisticRegression</code>,
         <code>RandomForestClassifier</code>, <code>StringIndexer</code>, and <code>StandardScaler</code> are
         Estimators &mdash; each one's <code>fit</code> learns something (coefficients, the category list, the
         column means and standard deviations) and hands back a Transformer that applies it.</li>
       </ul>
       <p>A <b>Pipeline</b> chains these stages so the whole sequence &mdash; assemble features, scale them,
       train the classifier &mdash; is one Estimator. Calling <code>fit</code> on the Pipeline runs every
       stage in order on the cluster and returns one <code>PipelineModel</code> you can <code>transform</code>
       and save. <b>The key idea:</b> the exact same code and the exact same training run on one Colab core or
       on a thousand-machine cluster &mdash; Spark hides the distribution. The price is overhead, so it only
       wins when the data does not fit in memory.</p>`,

    buildup:
      `<p>Build a model the MLlib way, one stage at a time. Each stage is a Transformer or an Estimator, and
       a Pipeline glues them together.</p>
       <p><b>Stage 0 &mdash; one vector column.</b> Unlike scikit-learn, which takes a whole feature matrix,
       MLlib estimators want a <b>single column whose value is a feature vector</b>. So almost every pipeline
       starts with <code>VectorAssembler(inputCols=[...], outputCol="features")</code>, a Transformer that
       packs your separate numeric columns into one <code>features</code> vector column. Forgetting this is the
       most common beginner error.</p>
       <p><b>Stage 1 &mdash; encode categoricals (Estimators).</b> Text categories are not numbers, so you
       index them. <code>StringIndexer</code> is an Estimator: its <code>fit</code> scans the column to learn
       the distinct values, and returns a Transformer that maps each label to an integer code.
       <code>OneHotEncoder</code> then turns those integer codes into sparse one-hot vectors so the model does
       not read "code 3" as bigger than "code 1".</p>
       <p><b>Stage 2 &mdash; scale (an Estimator).</b> <code>StandardScaler</code> is an Estimator: its
       <code>fit</code> computes each feature's mean and standard deviation across the whole distributed
       DataFrame, and returns a Transformer that subtracts the mean and divides by the standard deviation. As
       in scikit-learn, you learn those statistics on the training data only.</p>
       <p><b>Stage 3 &mdash; the model (an Estimator).</b> <code>LogisticRegression</code> or
       <code>RandomForestClassifier</code>: <code>fit</code> trains across the cluster and returns a fitted
       model (a Transformer) whose <code>transform</code> adds <code>prediction</code>,
       <code>probability</code>, and <code>rawPrediction</code> columns.</p>
       <p><b>Glue &mdash; the Pipeline.</b> <code>Pipeline(stages=[assembler, scaler, lr])</code> is itself an
       Estimator. <code>pipeline.fit(train)</code> runs each stage's <code>fit</code>/<code>transform</code> in
       order and returns one <code>PipelineModel</code>. That model's <code>transform(test)</code> reproduces
       the whole sequence on new data &mdash; so the test data is assembled and scaled with the <i>training</i>
       statistics automatically, with no leakage.</p>
       <p><b>Evaluate and tune.</b> A <code>BinaryClassificationEvaluator</code> reads the
       <code>rawPrediction</code> column and returns the area under the Receiver Operating Characteristic curve
       (areaUnderROC). To search hyperparameters, <code>ParamGridBuilder</code> builds a grid and
       <code>CrossValidator</code> wraps the whole Pipeline, fitting it on each fold of a distributed
       cross-validation &mdash; the same idea as scikit-learn's <code>GridSearchCV</code>, run across the
       cluster.</p>`,

    derivation:
      `<p><b>Why "the same training, distributed" is even possible &mdash; and where the tax comes from.</b></p>
       <ul class="steps">
         <li>Fitting a model like logistic regression is, at its core, repeatedly computing a <b>gradient</b>:
         a sum of one contribution per row. A sum over rows is the friendliest thing to distribute &mdash; you
         split the rows across machines, each machine sums its own slice, and you add the slices together.</li>
         <li>So each training iteration is: <b>(1) broadcast</b> the current model weights to every machine,
         <b>(2)</b> each machine computes the partial gradient over its local partition in parallel, <b>(3)</b>
         a <b>shuffle / reduce</b> adds the partials into the full gradient, <b>(4)</b> the driver takes one
         optimization step and updates the weights. Repeat until convergence.</li>
         <li>The math is <b>identical</b> to single-machine training &mdash; same loss, same gradient, same
         answer (up to numerical detail). That is why the same code scales: only <i>where</i> the sum happens
         changes, not <i>what</i> is summed.</li>
         <li><b>The tax:</b> every iteration pays for a broadcast and a reduce across the network, plus task
         scheduling and Java Virtual Machine startup. On small data this coordination dwarfs the actual
         arithmetic &mdash; which is exactly why scikit-learn, doing the whole sum in one tight loop in memory,
         is faster there.</li>
         <li><b>The payoff:</b> when the data is too big for one machine, there <i>is</i> no single-machine
         option &mdash; you would have to sample. MLlib trains on <b>all</b> the rows because the per-row work
         was spread across the cluster, and more data usually beats a cleverer model on a sample. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>A tiny end-to-end pipeline, the MLlib way. Suppose a DataFrame has two numeric columns
       <code>x1</code>, <code>x2</code> and a 0/1 <code>label</code>.</p>
       <ul class="steps">
         <li><b>Assemble:</b> <code>VectorAssembler(inputCols=["x1","x2"], outputCol="raw")</code> adds a
         <code>raw</code> column whose value is the vector <code>[x1, x2]</code> for each row.</li>
         <li><b>Scale:</b> <code>StandardScaler(inputCol="raw", outputCol="features")</code> &mdash; its
         <code>fit</code> learns the mean and standard deviation of each of the two features across the
         training rows, and its <code>transform</code> standardizes them into a <code>features</code> column.</li>
         <li><b>Train:</b> <code>LogisticRegression(featuresCol="features", labelCol="label")</code> &mdash;
         <code>fit</code> learns coefficients across the cluster.</li>
         <li><b>One object:</b> wrap all three in <code>Pipeline(stages=[asm, scaler, lr])</code> and call
         <code>.fit(train)</code> once. You get a <code>PipelineModel</code>; <code>.transform(test)</code>
         adds a <code>prediction</code> column, reusing the training means/standard deviations automatically.</li>
         <li><b>Score:</b> <code>BinaryClassificationEvaluator(labelCol="label")</code> reads the model's
         output and reports areaUnderROC &mdash; one number summarizing ranking quality. On the demo data
         below it lands near 1.0 because the classes are cleanly separable.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Reaching for MLlib on small data.</b> On data that fits in RAM, MLlib is <i>slower</i> than
         scikit-learn or XGBoost &mdash; the distributed coordination (shuffles, task scheduling, Java Virtual
         Machine overhead) costs more than the training itself. Fix: only use MLlib when the data genuinely
         does not fit on one machine; otherwise stay single-node.</li>
         <li><b>Forgetting <code>VectorAssembler</code>.</b> MLlib estimators do not take separate feature
         columns &mdash; they want one column whose value is a feature vector. Skipping the assembler gives a
         confusing type error. Fix: make <code>VectorAssembler(inputCols=[...], outputCol="features")</code>
         the first real stage of every pipeline.</li>
         <li><b>Fewer algorithms, less maturity.</b> MLlib covers the common models but is narrower and less
         polished than scikit-learn, and its gradient-boosting is weaker than XGBoost/LightGBM. Fix: if you
         need a specific algorithm MLlib lacks, train single-node on a sample, or use a distributed XGBoost
         integration.</li>
         <li><b>Not caching the training DataFrame.</b> Iterative trainers and <code>CrossValidator</code> scan
         the data many times. If that DataFrame is recomputed from its source on every pass, training crawls.
         Fix: <code>train.cache()</code> (or <code>persist()</code>) the training DataFrame once before
         <code>fit</code> so the cluster keeps it in memory across iterations.</li>
         <li><b>Ignoring class imbalance.</b> Rare-positive problems (fraud, churn) train a model that predicts
         the majority class and still looks "accurate." Fix: judge with areaUnderROC / areaUnderPR rather than
         accuracy, and use class weights (e.g. <code>LogisticRegression</code>'s <code>weightCol</code>) or
         resampling.</li>
       </ul>`,

    symbols: [],

    practice: [
      {
        q: `A teammate has a 400 GB labelled event table already sitting in Spark and wants a churn classifier. They ask whether to export it and train with scikit-learn, or train in MLlib. What do you advise, and why?`,
        steps: [
          { do: `Note the data size relative to one machine: 400 GB will not fit in a typical box's RAM, and exporting it would mean sampling down.`, why: `scikit-learn is single-node and in-memory, so it could only train on a sample of a 400 GB table.` },
          { do: `Note the data is already in Spark.`, why: `Training in MLlib keeps everything in one engine — no export, no copy out, no second tool.` },
          { do: `Recommend an MLlib Pipeline: VectorAssembler → (encoders/scaler) → classifier, fit across the cluster.`, why: `The same fit runs distributed over all 400 GB, and training on all the rows usually beats a cleverer model on a sample.` }
        ],
        answer: `<p>Train in <b>MLlib</b>. The table is far bigger than one machine, so scikit-learn could only see a sample, and the data is already in Spark, so an MLlib <code>Pipeline</code> (<code>VectorAssembler</code> &rarr; encoders/scaler &rarr; classifier) trains across the cluster on <b>all</b> 400 GB with no export. The general rule is the reverse, though: if the data fit in RAM, you would prefer scikit-learn/XGBoost &mdash; faster and richer single-node. MLlib's distributed overhead only pays off because this data does not fit.</p>`
      },
      {
        q: `Your MLlib code errors when you pass three numeric columns straight into <code>LogisticRegression</code>. What is almost certainly missing, and which kind of object (Transformer or Estimator) fixes it?`,
        steps: [
          { do: `Recall that MLlib estimators read a single feature-vector column, not several separate columns.`, why: `Passing three raw columns gives a type mismatch — the model expects one vector column named, e.g., 'features'.` },
          { do: `Add a VectorAssembler(inputCols=[c1,c2,c3], outputCol="features") as the first stage.`, why: `It packs the three columns into one vector column the model can consume.` },
          { do: `Classify the object: VectorAssembler has only transform(), so it is a Transformer.`, why: `It does no learning — it just maps each row's three values into one vector, deterministically.` }
        ],
        answer: `<p>You are missing a <b><code>VectorAssembler</code></b> &mdash; MLlib models want one column whose value is a feature vector, not several separate columns. Add <code>VectorAssembler(inputCols=[c1,c2,c3], outputCol="features")</code> as the first stage and point the model at <code>featuresCol="features"</code>. <code>VectorAssembler</code> is a <b>Transformer</b>: it has only <code>transform</code> and learns nothing &mdash; it just packs each row's values into one vector. (Contrast an <b>Estimator</b> like <code>StandardScaler</code> or <code>LogisticRegression</code>, whose <code>fit</code> learns something from the data first.)</p>`
      },
      {
        q: `You wrap an MLlib Pipeline in a <code>CrossValidator</code> with a 4&times;3 parameter grid and 5 folds, reading the source table directly each fold. It is far slower than expected. Name two things to check.`,
        steps: [
          { do: `Count the fits: 4×3 grid × 5 folds = 60 full pipeline fits, each scanning the training data many times.`, why: `Iterative training plus cross-validation reads the data over and over, so a slow read is paid repeatedly.` },
          { do: `Check whether the training DataFrame is cached.`, why: `Without cache(), the cluster recomputes the DataFrame from its source on every pass — the dominant cost.` },
          { do: `Reconsider whether the grid/folds are larger than needed, or whether the data even needs a cluster.`, why: `A smaller grid, fewer folds, or single-node training (if it fits in RAM) can be far cheaper.` }
        ],
        answer: `<p>First, <b>cache the training DataFrame</b>: <code>train.cache()</code> before fitting. A 4&times;3 grid over 5 folds is 60 full pipeline fits, and each iterative <code>fit</code> scans the data many times &mdash; without caching, the cluster recomputes the DataFrame from its source on every pass, which dominates the runtime. Second, <b>check that the work needs a cluster at all</b>: if the data fit in memory, the distributed overhead is wasted and a single-node grid search would be faster; and a smaller grid or fewer folds cuts the 60 fits directly.</p>`
      }
    ]
  });

  window.CODE["spark-mllib"] = {
    lib: "PySpark",
    runnable: false,
    explain: `<p>A complete MLlib (Machine Learning library) classification pipeline that runs in Google Colab in
      Spark's local mode after <code>!pip install pyspark</code>. It builds a tiny Spark DataFrame, chains a
      <b>Transformer</b> (<code>VectorAssembler</code>) and two <b>Estimators</b> (<code>StandardScaler</code>,
      <code>LogisticRegression</code>) inside a <code>Pipeline</code>, calls <code>fit</code> to get a
      <code>PipelineModel</code>, <code>transform</code>s the test set to predict, and scores with
      <code>BinaryClassificationEvaluator</code> (areaUnderROC). The <code>CrossValidator</code> /
      <code>ParamGridBuilder</code> block at the end shows distributed hyperparameter tuning &mdash; the same
      pipeline, fit on each fold across the cluster. <code>runnable</code> is off because the in-browser engine
      has no Java Virtual Machine; this is real PySpark meant for Colab. The whole thing is identical in shape to
      scikit-learn &mdash; the difference is that on a real cluster it would run over data too big for one machine.</p>`,
    code: `# Colab: !pip install pyspark
from pyspark.sql import SparkSession
from pyspark.ml import Pipeline
from pyspark.ml.feature import VectorAssembler, StandardScaler
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.evaluation import BinaryClassificationEvaluator

# Local mode: one Colab VM acts as the whole "cluster".
# On a real cluster you change ONLY .master(...) — the rest of the code is the same.
spark = (SparkSession.builder
         .master("local[*]")
         .appName("mllib-demo")
         .getOrCreate())

# --- a tiny Spark DataFrame: two numeric features x1,x2 and a 0/1 label ---
# class 0 sits low-left, class 1 sits high-right -> cleanly separable.
rows = [
    (0.5, 0.7, 0), (0.9, 1.1, 0), (0.2, 0.4, 0), (1.1, 0.9, 0),
    (0.6, 0.3, 0), (0.8, 0.8, 0), (0.3, 1.0, 0), (1.0, 0.5, 0),
    (3.5, 3.7, 1), (3.9, 4.1, 1), (4.2, 3.4, 1), (3.1, 3.9, 1),
    (4.6, 4.3, 1), (3.8, 3.2, 1), (4.0, 4.0, 1), (3.3, 3.6, 1),
]
df = spark.createDataFrame(rows, ["x1", "x2", "label"])
train, test = df.randomSplit([0.7, 0.3], seed=42)
train.cache()   # iterative training scans the data repeatedly -> cache it

# --- STAGE 1: Transformer — pack feature columns into ONE vector column ---
assembler = VectorAssembler(inputCols=["x1", "x2"], outputCol="raw")

# --- STAGE 2: Estimator — fit() learns each feature's mean & std, then standardizes ---
scaler = StandardScaler(inputCol="raw", outputCol="features",
                        withMean=True, withStd=True)

# --- STAGE 3: Estimator — fit() trains the classifier across the cluster ---
lr = LogisticRegression(featuresCol="features", labelCol="label", maxIter=20)

# --- Pipeline chains them; the Pipeline is itself an Estimator ---
pipeline = Pipeline(stages=[assembler, scaler, lr])
model = pipeline.fit(train)          # runs every stage's fit/transform in order
preds = model.transform(test)        # adds prediction / probability / rawPrediction
preds.select("x1", "x2", "label", "prediction", "probability").show(truncate=False)

# --- Evaluate: area under the ROC (Receiver Operating Characteristic) curve ---
evaluator = BinaryClassificationEvaluator(labelCol="label",
                                          rawPredictionCol="rawPrediction",
                                          metricName="areaUnderROC")
auc = evaluator.evaluate(preds)
print("areaUnderROC =", auc)         # ~1.0 here: the classes are cleanly separable

# --- Distributed hyperparameter tuning: same pipeline, fit on each fold ---
from pyspark.ml.tuning import CrossValidator, ParamGridBuilder
grid = (ParamGridBuilder()
        .addGrid(lr.regParam, [0.0, 0.1, 0.5])          # L2 strength
        .addGrid(lr.elasticNetParam, [0.0, 1.0])        # ridge <-> lasso
        .build())
cv = CrossValidator(estimator=pipeline, estimatorParamMaps=grid,
                    evaluator=evaluator, numFolds=3, parallelism=2)
cv_model = cv.fit(train)             # 3 grid points x 2 x 3 folds, all across the cluster
print("best areaUnderROC =", max(cv_model.avgMetrics))

spark.stop()`
  };

  window.CODEVIZ["spark-mllib"] = {
    question: "What accuracy and area-under-ROC does a standardized logistic-regression classifier reach — the same model MLlib would fit, here on a single machine for real numbers?",
    charts: [
      {
        type: "bars",
        title: "Logistic regression on load_breast_cancer (held-out test set, 171 rows)",
        xlabel: "metric",
        ylabel: "score (0–1)",
        labels: ["accuracy", "area under ROC", "majority baseline acc"],
        values: [0.9883, 0.9981, 0.6257],
        valueLabels: ["0.988", "0.998", "0.626"],
        colors: ["#7ee787", "#7ee787", "#8b949e"]
      }
    ],
    caption: "Real numbers from scikit-learn on the bundled load_breast_cancer dataset (569 rows, 30 features, 2 classes), a 70/30 stratified split. A StandardScaler → LogisticRegression model reaches 0.988 accuracy and 0.998 area under the ROC (Receiver Operating Characteristic) curve on the 171 held-out rows, versus 0.626 for always predicting the majority class. This is exactly the pipeline the PySpark CODE builds — VectorAssembler → StandardScaler → LogisticRegression scored with BinaryClassificationEvaluator(areaUnderROC) — and on this dataset MLlib would produce the same result. The difference is only WHERE it runs: single-node here, distributed across a cluster in MLlib, which is what lets it train on data far too big for one machine.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, roc_auc_score

# Bundled real dataset: 569 rows, 30 features, binary target.
X, y = load_breast_cancer(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y)

# Same shape as the MLlib pipeline: standardize, then logistic regression.
sc = StandardScaler().fit(Xtr)
Xtr_s, Xte_s = sc.transform(Xtr), sc.transform(Xte)
clf = LogisticRegression(max_iter=1000).fit(Xtr_s, ytr)

proba = clf.predict_proba(Xte_s)[:, 1]
pred  = clf.predict(Xte_s)
acc = accuracy_score(yte, pred)
auc = roc_auc_score(yte, proba)

# Majority-class baseline for comparison.
maj = np.bincount(ytr).argmax()
base_acc = accuracy_score(yte, np.full_like(yte, maj))

print("test rows      :", len(yte))                 # 171
print("accuracy       :", round(acc, 4))            # 0.9883
print("area under ROC :", round(auc, 4))            # 0.9981
print("baseline acc   :", round(base_acc, 4))       # 0.6257
# MLlib's VectorAssembler -> StandardScaler -> LogisticRegression, scored with
# BinaryClassificationEvaluator(areaUnderROC), gives the same numbers — distributed.`
  };
})();
