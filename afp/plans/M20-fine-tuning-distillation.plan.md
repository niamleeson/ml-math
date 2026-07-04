# Module Plan — M20 · Fine-tuning / distillation (classify & generate)

| Field | Value |
|---|---|
| Domain | Domain 4 · Applied LLMs / GenAI |
| Skip if you can already… | choose fine-tune vs distill and run it for a classifier |
| Maps to (projects) | all |
| Primary structure(s) | S6 Applied Engineering / Pitfall + Decision |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 2 |

## Module hub (the "complete list")
Fine-tuning and distillation are adaptation tools: use them when prompting is not enough, but know
which tool matches the bottleneck. This module teaches the decision boundary among prompting,
full/parameter-efficient fine-tuning, and distillation, then grounds it in a classifier pipeline and
multilingual transfer setting.

- M20.1 · Fine-tune vs prompt vs distill + PEFT/LoRA
- M20.2 · Distillation & running a classifier

## Questions this module answers (→ which sub-lesson teaches the answer)
- When should you prompt, fine-tune, or distill instead of doing the others? → M20.1
- What is full fine-tuning vs PEFT/LoRA, and how does low-rank ΔW = BA save parameters? → M20.1
- What is distillation, and how does a student learn from teacher soft labels at temperature T? → M20.2
- How do classification and generation fine-tuning objectives differ? → M20.1, M20.2
- How do you fine-tune a classifier end-to-end? → M20.2
- How does multilingual transfer with XLM-R change the classifier plan? → M20.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Fine-tune vs prompt vs distill; task-specific adaptation vs inference-time instruction
- Full fine-tuning vs PEFT/LoRA; low-rank update ΔW = BA **ƒ**; parameter-count savings **ƒ**
- Classification objective (cross-entropy over labels) **ƒ** vs generation objective (next-token loss) **ƒ**
- Distillation; teacher/student; soft labels; temperature T; KL divergence loss **ƒ**
- End-to-end classifier fine-tuning: dataset, label mapping, splits, tokenization, head, metrics, error analysis
- Multilingual transfer with XLM-R; shared subword space; zero-shot vs translate/train vs language-specific validation

## Sub-lessons

### M20.1 · Fine-tune vs prompt vs distill + PEFT/LoRA  —  [S6 Applied + Decision, ⚑]
- **Makes answerable:** when to prompt vs fine-tune vs distill; full fine-tuning vs PEFT/LoRA and the parameter savings; how classification and generation objectives differ at the adaptation decision point.
- **You'll be able to say:** "Prompting is first when the base model can already do the task and errors are instruction/schema issues; fine-tune when behavior or labels must be learned from examples; distill when a strong teacher is too slow/costly and I need a smaller student. Full fine-tuning updates every weight; LoRA freezes W and learns ΔW = BA with rank r, so a d×k matrix uses r(d+k) trainable parameters instead of dk. Classification fine-tuning predicts a label distribution; generation fine-tuning predicts next tokens."
- **Concepts:** prompt vs fine-tune vs distill; full FT vs PEFT/LoRA; ΔW = BA **ƒ**; parameter savings **ƒ**; classification vs generation objectives **ƒ**.
- **Key Idea focus:** correct adaptation choice + the failure it prevents (over-training a promptable task, or deploying a slow model when distillation is the real need).
- **Worked-example shape:** naive → break → fix → scale. Start with prompting for a stable label taxonomy; show inconsistent outputs; choose classifier fine-tuning or LoRA; compare full vs LoRA trainable parameter counts.
- **Notebook:** Yes — sklearn/numpy LoRA parameter-count savings for a matrix of shape d×k and ranks r; `assert r * (d + k) < d * k` for low r; plot savings vs rank. Break case = rank so high that LoRA no longer saves parameters.
- **Real numbers to cite:** for d=4096, k=4096, full update = 16,777,216 parameters; LoRA rank r=8 trains 65,536 parameters, about 256× fewer (0.39% of full). A rank r=4096 update has no savings.

### M20.2 · Distillation & running a classifier  —  [S6 Applied, ⚑]
- **Makes answerable:** what distillation is; how the temperature/KL step works; how to fine-tune a classifier end-to-end; how multilingual transfer with XLM-R changes data and validation; how classification vs generation objectives appear in training code.
- **You'll be able to say:** "Distillation trains a student to match a teacher's softened probability distribution, often with KL divergence at temperature T, optionally mixed with hard-label cross-entropy. A classifier run needs frozen splits, label IDs, tokenization, a classification head, train/val metrics, calibration/error checks, and a held-out test. For multilingual transfer, XLM-R lets one encoder share subword representations across languages, but I still validate by language and watch low-resource degradation."
- **Concepts:** teacher/student distillation; soft labels; temperature T; KL **ƒ**; classifier pipeline; hard-label CE **ƒ**; XLM-R multilingual transfer.
- **Key Idea focus:** build the adaptation pipeline honestly: define labels, keep splits clean, compare teacher/student, validate per slice/language.
- **Worked-example shape:** naive → break → fix → scale. Train only on hard labels; observe low-confidence or slow teacher deployment; add a soft-label KL distillation step; compare student accuracy/latency and per-language slices.
- **Notebook:** Yes — small classifier + distilled student on synthetic text-like features, or a pure numpy KL step from teacher logits to student logits; `assert` KL drops after one gradient step or student predictions move toward teacher probabilities. Break case = T too high/too low or a teacher that is wrong on a slice.
- **Real numbers to cite:** teacher logits [4, 1, -1] at T=1 give a very peaky target; at T=2 the non-top classes receive more probability mass. Track hard-label accuracy, teacher-student agreement, and per-language accuracy for EN/ES/FR slices.

## Coverage check
All 6 module questions are answered: adaptation choice + PEFT/LoRA + objectives → M20.1; distillation + classifier execution + multilingual transfer → M20.2. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
| Need / constraint | Prompt | Fine-tune / PEFT | Distill |
|---|---|---|---|
| Task works with instruction and examples in context | Best first choice | Usually overkill | Not relevant |
| Stable label taxonomy or style learned from many examples | Brittle | Best choice; prefer PEFT when compute/storage is constrained | Optional after teacher exists |
| Need smaller/faster/cheaper model at serving | Does not reduce model cost | May still be too large | Best choice |
| Need maximum task quality and can afford training/serving | Limited by base model | Full FT or LoRA depending data/infra | Student may lose quality |
| Data is scarce or changing fast | Prompt + retrieval/examples | Risk of overfit | Needs a reliable teacher |

## Resources (from the guide)
- HuggingFace — PEFT / LoRA (parameter-efficient fine-tuning)
- DeepLearning.AI — Finetuning LLMs (when and how to fine-tune)

## SOTA papers (from the guide)
- LoRA (Hu et al., 2021)
- DistilBERT (Sanh et al., 2019)
- XLM-R (Conneau et al., 2020)

## Notes / caveats
- Use formulas only for LoRA parameter counts, cross-entropy, and KL distillation; the prompt/fine-tune/distill choice is an engineering decision, not a math derivation.
- Keep notebooks CPU-first; demonstrate mechanics with small sklearn/numpy examples rather than downloading large LLM checkpoints.
- Tie all classifier examples back to clean splits, label definitions, and per-slice validation.
