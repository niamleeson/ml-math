"""Run the notebook with a dark theme and capture every figure as a slide-ready PNG."""
import json, os, io, contextlib, time
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

BG = "#10131a"
FG = "#e8edf5"
GRID = "#2b3342"

matplotlib.rcParams.update({
    "figure.facecolor": BG, "savefig.facecolor": BG,
    "axes.facecolor": BG, "axes.edgecolor": GRID, "axes.labelcolor": FG,
    "text.color": FG, "xtick.color": FG, "ytick.color": FG,
    "grid.color": GRID, "legend.facecolor": "#171b24", "legend.edgecolor": GRID,
    "axes.titlecolor": FG, "font.size": 13, "axes.titlesize": 14,
    "axes.prop_cycle": matplotlib.cycler(color=[
        "#4da3ff", "#ffb454", "#4ade80", "#f87171", "#c084fc", "#22d3ee"]),
    "figure.dpi": 160, "savefig.dpi": 160, "savefig.bbox": "tight",
})

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "figs")
os.makedirs(OUT, exist_ok=True)

NAMES = ["spectrum", "ivf_sweep", "voronoi", "pq_scatter", "hnsw_layers",
         "scaling", "recall_qps"]
counter = {"i": 0}
_real_show = plt.show


def capture(*a, **k):
    i = counter["i"]
    name = NAMES[i] if i < len(NAMES) else f"fig{i}"
    path = os.path.join(OUT, f"{name}.png")
    plt.savefig(path, facecolor=BG)
    print(f"    [fig] {name}.png")
    counter["i"] += 1
    plt.close("all")


plt.show = capture

nb = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                 "talk-vector-search.ipynb")))
g = {"__name__": "__main__", "plt": plt}
t0 = time.time()
for idx, c in enumerate(nb["cells"]):
    if c["cell_type"] != "code":
        continue
    src = "".join(c["source"])
    if any(l.strip().startswith("!") for l in src.split("\n")):
        continue
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(compile(src, f"cell{idx}", "exec"), g)

print(f"\ncaptured {counter['i']} figures in {time.time()-t0:.0f}s")

# Stash the measured numbers the deck needs.
export = {
    "EXACT_MS": g["EXACT_MS"],
    "raw_bytes": g["raw_bytes"],
    "pq_bytes": g["pq_bytes"],
    "hnsw_bytes": g["hnsw_bytes"],
    "N_TICKETS": g["N_TICKETS"],
    "N_DIMS": g["N_DIMS"],
    "ivf_sweep": g["ivf_sweep"],
    "pq_sweep": g["pq_sweep"],
    "hnsw_sweep": g["hnsw_sweep"],
    "scaling": g["scaling"],
    "MS_IVFPQ": g["MS_IVFPQ"], "REC_IVFPQ": g["REC_IVFPQ"],
    "MS_RERANK": g["MS_RERANK"], "REC_RERANK": g["REC_RERANK"],
    "HNSW_BUILD_S": g["HNSW_BUILD_S"],
    "levels_hist": [int(x) for x in __import__("numpy").bincount(g["levels"])],
    "kept_mean": float(g["kept"].mean()),
    "kept_zero_pct": float((g["kept"] == 0).mean() * 100),
    "n_priority": int(g["is_priority"].sum()),
    "ivf_valid": float(g["ivf_valid"]), "hnsw_valid": float(g["hnsw_valid"]),
    "n_for_90": int(g["n_for_90"]),
}
with open(os.path.join(OUT, "numbers.json"), "w") as f:
    json.dump(export, f, indent=1, default=float)
print("wrote numbers.json")
