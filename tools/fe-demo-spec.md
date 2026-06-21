# Authoring a Feature-Engineering "problem → fix" Colab demo

You write ONE Python file: `tools/fe-demos/<id>.py`. It becomes a single runnable Colab cell
in that lesson's practice notebook. Its job: make a COMPLETE BEGINNER SEE, with their own eyes,
why the lesson's technique matters — by reproducing the PROBLEM on raw data and the FIX on
engineered data, side by side, with before/after numbers.

## The file MUST do these five steps, in order, with comments labeling each:
1. **Load real data.** Prefer a scikit-learn bundled dataset (load_breast_cancer / load_digits /
   load_wine / load_diabetes) or a small REAL inline corpus (for text lessons). If the concept
   needs a specific structure (e.g. a nonlinear boundary), build it with numpy + a fixed
   `np.random.default_rng(0)` and SAY so in a comment. It must run top-to-bottom in Colab with
   NO downloads and NO missing packages (numpy, pandas, scikit-learn, matplotlib, scipy only).
2. **Visualize the PURE (raw) data** — a matplotlib plot (hist / scatter / bar) of the raw feature(s).
3. **Reproduce the PROBLEM on the raw data** — train the relevant model or compute the relevant
   metric on the RAW features and show it is bad / unstable / dominated. Print the number.
   (Optionally a second plot that shows the failure, e.g. residuals, a bad decision boundary.)
4. **Apply the lesson's technique, then visualize the ENGINEERED data** — a matplotlib plot of the
   transformed feature(s) so the change is visible.
5. **Show the FIX** — the SAME model / metric on the engineered features, now better. Print the number.

End with an explicit one-line summary, e.g.:
`print(f"PROBLEM (raw): {raw:.3f}   →   FIX (engineered): {eng:.3f}")`

## Rules
- Use `matplotlib.pyplot as plt`; call `plt.show()`. Use `plt.subplots(1, 2, ...)` to put raw vs
  engineered side by side where it reads well.
- Be DETERMINISTIC: set `random_state` / a fixed rng so the numbers reproduce.
- The contrast must be REAL and HONEST — actually run it and pick a configuration where the
  technique genuinely helps (engineered clearly beats raw). If the bundled dataset doesn't show
  it, construct a small realistic dataset that does and label it as illustrative.
- Keep it ~40–90 lines. Heavy comments — a beginner reads this top to bottom.
- Pure Python for a notebook (no Jupyter magics except a leading `!pip install -q <pkg>` ONLY if a
  non-Colab package is truly needed — avoid if possible).
- Do NOT print megabytes; subsample plots to be readable.

Report: the lesson id, what raw-data problem you reproduced, what the fix is, and the before/after numbers you actually got by running it.
