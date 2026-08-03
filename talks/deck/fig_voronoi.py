import numpy as np, faiss, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
BG="#10131a"; FG="#e8edf5"; GRID="#2b3342"
matplotlib.rcParams.update({"figure.facecolor":BG,"savefig.facecolor":BG,"axes.facecolor":BG,
 "axes.edgecolor":GRID,"text.color":FG,"xtick.color":FG,"ytick.color":FG,
 "axes.titlecolor":FG,"font.size":14,"figure.dpi":170,"savefig.dpi":170,"savefig.bbox":"tight"})

rng=np.random.default_rng(11)
pts=rng.normal(size=(4000,2)).astype(np.float32)
km=faiss.Kmeans(2,10,niter=30,seed=5); km.train(pts)
cen=km.centroids; _,asg=km.index.search(pts,1); asg=asg.ravel()

# Want: query hugging a border, true NN just across it, BOTH cells locally dense.
best=None
for _ in range(60000):
    q=rng.normal(size=(1,2)).astype(np.float32)
    d=((pts-q)**2).sum(axis=1); nn=int(np.argmin(d)); gap=float(np.sqrt(d[nn]))
    _,qc=km.index.search(q,1); qc=int(qc[0,0])
    if asg[nn]==qc or not (0.07 < gap < 0.16): continue
    near=(d<0.40**2)
    if near.sum()<25: continue
    score=near.sum()
    if best is None or score>best[0]: best=(score,q[0],nn,qc,gap)
score,q,nn,qc,gap=best
print(f"gap={gap:.4f} query cell={qc} nn cell={asg[nn]} localdensity_score={score:.0f}")

fig,ax=plt.subplots(figsize=(9,6.0))
R=0.42
xs=np.linspace(q[0]-R*1.5,q[0]+R*1.5,700); ys=np.linspace(q[1]-R,q[1]+R,700)
XX,YY=np.meshgrid(xs,ys)
grid=np.c_[XX.ravel(),YY.ravel()].astype(np.float32)
_,gasg=km.index.search(grid,1); gasg=gasg.reshape(XX.shape)

base=["#1b2740","#2a2036","#16302b","#33261c","#1f2b34","#2d1f27","#243024","#1c2438","#2f2a1d","#221d33"]
ax.pcolormesh(XX,YY,gasg,cmap=ListedColormap(base),shading="auto",vmin=0,vmax=9)
ax.contour(XX,YY,gasg,levels=np.arange(10)+.5,colors="#7b8aa3",linewidths=2.0)

vis=(np.abs(pts[:,0]-q[0])<R*1.6)&(np.abs(pts[:,1]-q[1])<R*1.1)
other=vis&(asg!=qc); mine=vis&(asg==qc)
ax.scatter(pts[other,0],pts[other,1],s=42,color="#5b6678",linewidths=0,label="not scanned")
ax.scatter(pts[mine,0],pts[mine,1],s=60,color="#4da3ff",linewidths=0,
           label="scanned — the one cell we probe")
ax.plot([q[0],pts[nn][0]],[q[1],pts[nn][1]],"--",c="#ffb454",lw=2.4,zorder=4)
ax.scatter(*q,c="#ff2d55",marker="*",s=1400,zorder=6,edgecolors="white",lw=1.6,label="query")
ax.scatter(*pts[nn],c="#4ade80",marker="D",s=330,zorder=6,edgecolors="white",lw=2.0,
           label="TRUE nearest neighbour — MISSED")

ax.set_xlim(xs[0],xs[-1]); ax.set_ylim(ys[0],ys[-1])
ax.set_xticks([]); ax.set_yticks([])
ax.set_title("IVF's failure mode: the answer is one cell over",pad=12,fontsize=18)
leg=ax.legend(loc="lower left",fontsize=11.5,framealpha=.95)
leg.get_frame().set_facecolor("#0d1017"); leg.get_frame().set_edgecolor(GRID)
plt.tight_layout(); plt.savefig("figs/voronoi.png",facecolor=BG); print("saved")
