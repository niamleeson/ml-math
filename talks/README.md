# Vector Search tech talk

A 60-minute internal talk on **kNN · ANN · IVF-PQ · HNSW**.

| File | What it is |
|---|---|
| `vector-search-talk.pptx` | 47-slide deck, 16:9, with speaker notes on every slide |
| `vector-search-transcript.md` | Full word-for-word speaker script with timing map |
| `../notebooks/talk-vector-search.ipynb` | Companion notebook — **produces every number in both** |
| `deck/` | Generators for the deck and its figures |

## Opening the deck in Google Slides

Drive converts `.pptx` into a fully native, editable Slides deck:

1. Upload `vector-search-talk.pptx` to Google Drive.
2. Right-click it → **Open with → Google Slides**.
3. *File → Save as Google Slides* to keep the converted copy.

Speaker notes come across intact. (In PowerPoint or Keynote, just open it directly.)

**After converting, spot-check the code slides** — Slides substitutes fonts, and the
monospace blocks are the only places where a substitution is visible.

## Regenerating

Numbers are not hardcoded anywhere. To refresh after changing the notebook:

```bash
python deck/capture_figs.py   # re-runs the notebook, writes figs/*.png + figs/numbers.json
python deck/fig_voronoi.py    # the one figure drawn purpose-built for projection
python deck/build_deck.py     # reads numbers.json, writes the .pptx
```

`capture_figs.py` takes ~70s and needs `faiss-cpu`, `matplotlib`, `python-pptx`, `pillow`.

**Run the three in that order on a fresh clone.** `deck/figs/*.png` are build artifacts and are
*not* committed — the repo ignores `*.png` — so `build_deck.py` will fail until `capture_figs.py`
and `fig_voronoi.py` have produced them. (The images are already embedded in the committed
`.pptx`, so you only need this to rebuild.) `deck/figs/numbers.json` *is* committed, so you can
read every measured value without re-running anything.

**If you re-run, the transcript's latency figures will drift a few percent** (recalls are
seeded and reproduce exactly). Re-quote from the fresh `figs/numbers.json` so the deck and
transcript stay in agreement.
