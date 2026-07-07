#!/usr/bin/env python3
"""Execute a notebook's code cells headless and embed stdout + figures as outputs.

Usage: python3 tools/embed-notebook.py afp/notebooks/M08-calibration-imbalance.ipynb
Runs cells in one shared namespace (like a real kernel top-to-bottom). Captures
stdout as a stream output and every matplotlib figure as a base64 image/png. Fails
loudly if any cell raises.
"""
import sys, io, json, base64, contextlib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def main(path):
    nb = json.load(open(path))
    ns = {}
    n_fig = 0
    for i, cell in enumerate(nb["cells"]):
        if cell["cell_type"] != "code":
            continue
        src = "".join(cell["source"])
        buf = io.StringIO()
        plt.close("all")
        try:
            with contextlib.redirect_stdout(buf):
                exec(compile(src, f"<cell {i}>", "exec"), ns)
        except Exception as e:
            print(f"\n!! cell {i} FAILED: {type(e).__name__}: {e}\n---\n{src}\n---")
            raise
        outputs = []
        text = buf.getvalue()
        if text:
            outputs.append({"output_type": "stream", "name": "stdout", "text": text.splitlines(keepends=True)})
        for num in plt.get_fignums():
            fig = plt.figure(num)
            b = io.BytesIO(); fig.savefig(b, format="png", dpi=85, bbox_inches="tight"); b.seek(0)
            png = base64.b64encode(b.read()).decode()
            outputs.append({"output_type": "display_data", "metadata": {}, "data": {"image/png": png}})
            n_fig += 1
        cell["outputs"] = outputs
        cell["execution_count"] = i
    json.dump(nb, open(path, "w"), indent=1)
    print(f"embedded outputs into {path}: {n_fig} figures")

if __name__ == "__main__":
    main(sys.argv[1])
