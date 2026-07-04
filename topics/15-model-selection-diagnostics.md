# Model Selection & Diagnostics

> **Source:** Machine Learning — Stanford CS 229 &middot; Topic 15/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 4.2 Model selection

- **Vocabulary** — When selecting a model, we distinguish 3 different parts of the data that we have as follows:

| Training set | Validation set | Testing set |
|---|---|---|
| - Model is trained<br>- Usually 80% of the dataset | - Model is assessed<br>- Usually 20% of the dataset<br>- Also called hold-out or development set | - Model gives predictions<br>- Unseen data |

Once the model has been chosen, it is trained on the entire dataset and tested on the unseen test set. These are represented in the figure below:

*[Figure: Dataset split diagram. A horizontal bar labeled Dataset is divided into a large red Train segment and a smaller green Validation segment; a separate blue bar labeled Unseen data is labeled Test, emphasizing that the final test set is held out.]*

- **Cross-validation** — Cross-validation, also noted CV, is a method that is used to select a model that does not rely too much on the initial training set. The different types are summed up in the table below:

| $k$-fold | Leave-$p$-out |
|---|---|
| - Training on $k-1$ folds and assessment on the remaining one<br>- Generally $k=5$ or $10$ | - Training on $n-p$ observations and assessment on the $p$ remaining ones<br>- Case $p=1$ is called leave-one-out |

The most commonly used method is called $k$-fold cross-validation and splits the training data into $k$ folds to validate the model on one fold while training the model on the $k-1$ other folds, all of this $k$ times. The error is then averaged over the $k$ folds and is named cross-validation error.

*[Figure: $k$-fold cross-validation schematic. Rows labeled fold 1, 2, ..., $k$ show a long dataset bar where the green validation block moves across the red training data; validation errors are $\epsilon_1, \epsilon_2, ..., \epsilon_k$, and the cross-validation error is $(\epsilon_1+...+\epsilon_k)/k$.]*

- **Regularization** — The regularization procedure aims at avoiding the model to overfit the data and thus deals with high variance issues. The following table sums up the different types of commonly used regularization techniques:

| LASSO | Ridge | Elastic Net |
|---|---|---|
| - Shrinks coefficients to 0<br>- Good for variable selection | Makes coefficients smaller | Tradeoff between variable selection and small coefficients |
| *Constraint geometry shows red elliptical loss contours touching a blue diamond $\|\theta\|_1 \leq 1$, with solution $\theta^*$ on an axis.* | *Constraint geometry shows red elliptical loss contours touching a blue circle $\|\theta\|_2 \leq 1$, with solution $\theta^*$ on the boundary.* | *Constraint geometry shows red elliptical loss contours touching a blue intermediate elastic-net ball labeled $(1-\alpha)\|\theta\|_1+\alpha\|\theta\|_2^2 \leq 1$, with solution $\theta^*$.* |
| $... + \lambda\|\theta\|_1$<br>$\lambda \in \mathbb{R}$ | $... + \lambda\|\theta\|_2^2$<br>$\lambda \in \mathbb{R}$ | $... + \lambda\left[(1-\alpha)\|\theta\|_1+\alpha\|\theta\|_2^2\right]$<br>$\lambda \in \mathbb{R},\quad \alpha \in [0,1]$ |

- **Model selection** — Train model on training set, then evaluate on the development set, then pick best performance model on the development set, and retrain all of that model on the whole training set.

### 4.3 Diagnostics

- **Bias** — The bias of a model is the difference between the expected prediction and the correct model that we try to predict for given data points.

- **Variance** — The variance of a model is the variability of the model prediction for given data points.

- **Bias/variance tradeoff** — The simpler the model, the higher the bias, and the more complex the model, the higher the variance.

|  | Underfitting | Just right | Overfitting |
|---|---|---|---|
| Symptoms | - High training error<br>- Training error close to test error<br>- High bias | - Training error slightly lower than test error | - Low training error<br>- Training error much lower than test error<br>- High variance |
| Regression | *Scatterplot with U-shaped data and an underfit straight decreasing line, illustrating high bias.* | *Scatterplot with U-shaped data and a smooth quadratic curve fitting the trend well.* | *Scatterplot with U-shaped data and an overly wiggly curve passing through noise, illustrating high variance.* |


|  |  |  |  |
|---|---|---|---|
| Classification | *[Figure: Classification plot with blue and red points separated by an overly simple straight decision boundary, illustrating underfitting/high bias.]* | *[Figure: Classification plot with blue and red points separated by a smooth curved decision boundary, illustrating an appropriate fit.]* | *[Figure: Classification plot with blue and red points separated by a highly jagged decision boundary that follows individual points, illustrating overfitting/high variance.]* |
| Deep learning | *[Figure: Error-versus-epochs plot where training and validation curves both decrease and level off close together, indicating that training longer and increasing complexity may help.]* | *[Figure: Error-versus-epochs plot where training and validation curves both decrease, with validation error higher than training error but still improving, indicating a reasonable training process.]* | *[Figure: Error-versus-epochs plot where training error keeps decreasing while validation error levels off much higher, indicating overfitting and the need for regularization or more data.]* |
| Remedies | - Complexify model<br>- Add more features<br>- Train longer |  | - Regularize<br>- Get more data |

- **Error analysis** — Error analysis is analyzing the root cause of the difference in performance between the current and the perfect models.

- **Ablative analysis** — Ablative analysis is analyzing the root cause of the difference in performance between the current and the baseline models.
