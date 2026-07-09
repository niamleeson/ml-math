#!/usr/bin/env python3
"""Generate vector-math practice drills for every formula in vector-math-formulas.md.

For each formula: 5 basic + 5 easy + 5 advanced hand-solvable questions with
step-by-step solutions (one operation per step), plus a self-checking notebook.

Outputs:
  - vector-math-drills.md                     (all questions + step solutions)
  - afp/notebooks/vector-math-drills.ipynb     (questions + numpy assert checks)

Run: python3 tools/gen-vector-drills.py
"""
import json, os, math
import numpy as np

# --------------------------------------------------------------------- format
def num(x):
    """Clean number: integer when whole, else rounded to 4 dp."""
    if isinstance(x, (int, np.integer)):
        return str(int(x))
    xf = float(x)
    if abs(xf - round(xf)) < 1e-9:
        return str(int(round(xf)))
    return str(round(xf, 4))

def vec(v):
    return "[" + ", ".join(num(x) for x in v) + "]"

def mat(M):
    return "[" + "; ".join("[" + ", ".join(num(x) for x in row) + "]" for row in M) + "]"

def pylit(x):
    """Python literal (for the notebook), lists/numbers."""
    if isinstance(x, (list, tuple)):
        return "[" + ", ".join(pylit(e) for e in x) + "]"
    if isinstance(x, (int, np.integer)):
        return str(int(x))
    xf = float(x)
    if abs(xf - round(xf)) < 1e-9:
        return str(int(round(xf)))
    return repr(round(xf, 6))

# --------------------------------------------------------------------- operands
def cfg(level):
    if level == "basic":
        return dict(dim=2, lo=1, hi=5, neg=False)
    if level == "easy":
        return dict(dim=3, lo=1, hi=7, neg=False)
    return dict(dim=3, lo=2, hi=9, neg=True)  # advanced

def rv(rng, level, dim=None, neg=None):
    c = cfg(level)
    d = dim if dim else c["dim"]
    g = c["neg"] if neg is None else neg
    out = []
    for _ in range(d):
        val = int(rng.integers(c["lo"], c["hi"] + 1))
        if g and rng.random() < 0.5:
            val = -val
        out.append(val)
    return out

# --------------------------------------------------------------------- step utils
def s_dot(a, b, pre=""):
    steps, prods = [], []
    for i, (x, y) in enumerate(zip(a, b), 1):
        p = x * y
        prods.append(p)
        steps.append(f"{pre}Multiply component {i}: {num(x)} * {num(y)} = {num(p)}")
    steps.append(f"{pre}Add the products: " + " + ".join(num(p) for p in prods) +
                 f" = {num(sum(prods))}")
    return steps, sum(prods)

def s_norm(v, pre=""):
    steps, sq = [], []
    for i, x in enumerate(v, 1):
        s = x * x
        sq.append(s)
        steps.append(f"{pre}Square component {i}: ({num(x)})^2 = {num(s)}")
    tot = sum(sq)
    steps.append(f"{pre}Add the squares: " + " + ".join(num(s) for s in sq) + f" = {num(tot)}")
    steps.append(f"{pre}Take the square root: sqrt({num(tot)}) = {num(math.sqrt(tot))}")
    return steps, math.sqrt(tot)

def s_sub(a, b, pre=""):
    steps, diff = [], []
    for i, (x, y) in enumerate(zip(a, b), 1):
        d = x - y
        diff.append(d)
        steps.append(f"{pre}Subtract component {i}: {num(x)} - ({num(y)}) = {num(d)}")
    return steps, diff

# --------------------------------------------------------------------- registry
FORMULAS = []  # (part, idx, name, generator_fn)

def formula(fid, name):
    def deco(fn):
        part, idx = fid.split(".")
        FORMULAS.append((int(part), fid, name, fn))
        return fn
    return deco

def P(q, steps, answer, verify=None, expected=None):
    """A single problem. verify/expected drive the notebook assert."""
    return dict(q=q, steps=steps, answer=answer, verify=verify, expected=expected)

# ===================================================================== PART 1
@formula("1.1", "Vector addition")
def f_1_1(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    steps, res = [], []
    for i, (x, y) in enumerate(zip(a, b), 1):
        s = x + y
        res.append(s)
        steps.append(f"Add component {i}: {num(x)} + ({num(y)}) = {num(s)}")
    return P(f"Compute {vec(a)} + {vec(b)}.", steps, vec(res),
             f"np.array({a}) + np.array({b})", res)

@formula("1.2", "Vector subtraction")
def f_1_2(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    steps, res = s_sub(a, b)
    return P(f"Compute {vec(a)} - {vec(b)}.", steps, vec(res),
             f"np.array({a}) - np.array({b})", res)

@formula("1.3", "Scalar multiplication")
def f_1_3(level, rng):
    a = rv(rng, level)
    k = int(rng.integers(2, 6)) * (-1 if level == "advanced" and rng.random() < 0.5 else 1)
    steps, res = [], []
    for i, x in enumerate(a, 1):
        p = k * x
        res.append(p)
        steps.append(f"Multiply component {i} by {num(k)}: {num(k)} * {num(x)} = {num(p)}")
    return P(f"Compute {num(k)} * {vec(a)}.", steps, vec(res),
             f"{k} * np.array({a})", res)

@formula("1.4", "Zero vector")
def f_1_4(level, rng):
    a = rv(rng, level)
    z = [0] * len(a)
    steps, res = [], []
    for i, x in enumerate(a, 1):
        res.append(x)
        steps.append(f"Add component {i}: {num(x)} + 0 = {num(x)}")
    return P(f"Compute {vec(a)} + {vec(z)} (adding the zero vector).", steps, vec(res),
             f"np.array({a}) + np.array({z})", res)

@formula("1.5", "Linear combination")
def f_1_5(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    c1 = int(rng.integers(2, 5))
    c2 = int(rng.integers(2, 5)) * (-1 if level == "advanced" and rng.random() < 0.5 else 1)
    steps = []
    sa = [c1 * x for x in a]
    steps.append(f"Scale the first vector by {num(c1)}: {num(c1)} * {vec(a)} = {vec(sa)}")
    sb = [c2 * x for x in b]
    steps.append(f"Scale the second vector by {num(c2)}: {num(c2)} * {vec(b)} = {vec(sb)}")
    res = []
    for i, (x, y) in enumerate(zip(sa, sb), 1):
        s = x + y
        res.append(s)
        steps.append(f"Add component {i}: {num(x)} + ({num(y)}) = {num(s)}")
    return P(f"Compute {num(c1)} * {vec(a)} + {num(c2)} * {vec(b)}.", steps, vec(res),
             f"{c1}*np.array({a}) + {c2}*np.array({b})", res)

@formula("1.6", "Weighted average")
def f_1_6(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    w = rng.choice([0.25, 0.5, 0.75])
    w = float(w)
    steps = []
    sa = [w * x for x in a]
    steps.append(f"Scale the first vector by {num(w)}: {num(w)} * {vec(a)} = {vec(sa)}")
    sb = [(1 - w) * x for x in b]
    steps.append(f"Scale the second vector by {num(1 - w)}: {num(1 - w)} * {vec(b)} = {vec(sb)}")
    res = []
    for i, (x, y) in enumerate(zip(sa, sb), 1):
        s = x + y
        res.append(s)
        steps.append(f"Add component {i}: {num(x)} + {num(y)} = {num(s)}")
    return P(f"Compute the weighted average {num(w)} * {vec(a)} + {num(1 - w)} * {vec(b)}.",
             steps, vec(res), f"{w}*np.array({a}) + {1 - w}*np.array({b})", res)

# ===================================================================== PART 2
@formula("2.1", "L2 norm")
def f_2_1(level, rng):
    v = rv(rng, level)
    steps, r = s_norm(v)
    return P(f"Compute the L2 norm (length) of {vec(v)}.", steps, num(r),
             f"np.linalg.norm(np.array({v}))", r)

@formula("2.2", "Norm from dot with itself")
def f_2_2(level, rng):
    v = rv(rng, level)
    steps, d = s_dot(v, v, pre="")
    steps.append(f"Take the square root: sqrt({num(d)}) = {num(math.sqrt(d))}")
    return P(f"Compute norm({vec(v)}) using norm = sqrt(dot(v, v)).", steps, num(math.sqrt(d)),
             f"np.sqrt(np.dot(np.array({v}), np.array({v})))", math.sqrt(d))

@formula("2.3", "Squared L2 norm")
def f_2_3(level, rng):
    v = rv(rng, level)
    steps, sq = [], []
    for i, x in enumerate(v, 1):
        s = x * x
        sq.append(s)
        steps.append(f"Square component {i}: ({num(x)})^2 = {num(s)}")
    tot = sum(sq)
    steps.append(f"Add the squares: " + " + ".join(num(s) for s in sq) + f" = {num(tot)}")
    return P(f"Compute the squared L2 norm of {vec(v)} (no square root).", steps, num(tot),
             f"np.dot(np.array({v}), np.array({v}))", tot)

@formula("2.4", "Scaling rule for norms")
def f_2_4(level, rng):
    v = rv(rng, level)
    k = int(rng.integers(2, 6))
    steps, nv = s_norm(v)
    r = k * nv
    steps.append(f"Multiply the norm by |{num(k)}|: {num(k)} * {num(nv)} = {num(r)}")
    return P(f"Compute norm({num(k)} * {vec(v)}) using norm(k*v) = |k| * norm(v).",
             steps, num(r), f"np.linalg.norm({k}*np.array({v}))", r)

@formula("2.5", "L1 norm")
def f_2_5(level, rng):
    v = rv(rng, level, neg=True)
    steps, ab = [], []
    for i, x in enumerate(v, 1):
        a = abs(x)
        ab.append(a)
        steps.append(f"Absolute value of component {i}: |{num(x)}| = {num(a)}")
    tot = sum(ab)
    steps.append("Add them: " + " + ".join(num(a) for a in ab) + f" = {num(tot)}")
    return P(f"Compute the L1 (taxicab) norm of {vec(v)}.", steps, num(tot),
             f"np.linalg.norm(np.array({v}), 1)", tot)

@formula("2.6", "L-infinity norm")
def f_2_6(level, rng):
    v = rv(rng, level, neg=True)
    steps, ab = [], []
    for i, x in enumerate(v, 1):
        a = abs(x)
        ab.append(a)
        steps.append(f"Absolute value of component {i}: |{num(x)}| = {num(a)}")
    m = max(ab)
    steps.append("Take the maximum: max(" + ", ".join(num(a) for a in ab) + f") = {num(m)}")
    return P(f"Compute the L-infinity (max) norm of {vec(v)}.", steps, num(m),
             f"np.linalg.norm(np.array({v}), np.inf)", m)

@formula("2.7", "Lp norm")
def f_2_7(level, rng):
    v = rv(rng, level if level != "advanced" else "easy", neg=True)
    p = 3
    steps, cubes = [], []
    for i, x in enumerate(v, 1):
        c = abs(x) ** p
        cubes.append(c)
        steps.append(f"Raise |component {i}| to the power {p}: |{num(x)}|^{p} = {num(c)}")
    tot = sum(cubes)
    steps.append("Add them: " + " + ".join(num(c) for c in cubes) + f" = {num(tot)}")
    r = tot ** (1 / p)
    steps.append(f"Take the {p}rd root: ({num(tot)})^(1/{p}) = {num(r)}")
    return P(f"Compute the L{p} norm of {vec(v)} (raise-add-root with p={p}).", steps, num(r),
             f"np.linalg.norm(np.array({v}), {p})", r)

# ===================================================================== PART 3
@formula("3.1", "Dot product (coordinate form)")
def f_3_1(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    steps, d = s_dot(a, b)
    return P(f"Compute the dot product {vec(a)} . {vec(b)}.", steps, num(d),
             f"np.dot(np.array({a}), np.array({b}))", d)

@formula("3.2", "Dot product (geometric form)")
def f_3_2(level, rng):
    na = int(rng.integers(2, 9))
    nb = int(rng.integers(2, 9))
    ang = int(rng.choice([0, 30, 45, 60, 90, 180]))
    cosv = {0: 1.0, 30: math.sqrt(3) / 2, 45: math.sqrt(2) / 2, 60: 0.5, 90: 0.0, 180: -1.0}[ang]
    steps = [f"Write the formula: dot = norm(a) * norm(b) * cos(angle).",
             f"Insert norm(a) = {num(na)}.",
             f"Insert norm(b) = {num(nb)}.",
             f"Insert cos({ang} deg) = {num(cosv)}.",
             f"Multiply norms: {num(na)} * {num(nb)} = {num(na * nb)}.",
             f"Multiply by the cosine: {num(na * nb)} * {num(cosv)} = {num(na * nb * cosv)}."]
    r = na * nb * cosv
    return P(f"Two vectors have norm(a) = {num(na)}, norm(b) = {num(nb)}, and the angle "
             f"between them is {ang} degrees. Compute their dot product.", steps, num(r),
             f"{na}*{nb}*np.cos(np.radians({ang}))", r)

@formula("3.3", "Dot with itself = norm squared")
def f_3_3(level, rng):
    v = rv(rng, level)
    steps, d = s_dot(v, v)
    return P(f"Compute dot({vec(v)}, {vec(v)}) (equals the squared norm).", steps, num(d),
             f"np.dot(np.array({v}), np.array({v}))", d)

@formula("3.4", "Dot with a unit vector = projection length")
def f_3_4(level, rng):
    a = rv(rng, level)
    # pick a clean unit vector like [0.8,0.6] or axis
    units = {2: [[0.8, 0.6], [0.6, 0.8], [1, 0], [0, 1]],
             3: [[0, 1, 0], [1, 0, 0], [0, 0, 1]]}
    u = list(rng.choice(units[len(a)]))
    u = [float(x) for x in u]
    steps, d = s_dot(a, u)
    return P(f"Compute how far {vec(a)} reaches along the unit direction {vec(u)} "
             f"(dot with the unit vector).", steps, num(d),
             f"np.dot(np.array({a}), np.array({u}))", d)

@formula("3.5", "Dot product is commutative")
def f_3_5(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    s1, d1 = s_dot(a, b, pre="dot(a,b): ")
    s2, d2 = s_dot(b, a, pre="dot(b,a): ")
    steps = s1 + s2 + [f"Both equal {num(d1)}, so order does not matter."]
    return P(f"Verify dot(a,b) = dot(b,a) for a = {vec(a)}, b = {vec(b)}.", steps,
             f"both = {num(d1)}", f"np.dot(np.array({a}),np.array({b})) - "
             f"np.dot(np.array({b}),np.array({a}))", 0)

def rmat(rng, r, c, lo=1, hi=5, neg=False):
    M = []
    for _ in range(r):
        row = []
        for _ in range(c):
            val = int(rng.integers(lo, hi + 1))
            if neg and rng.random() < 0.5:
                val = -val
            row.append(val)
        M.append(row)
    return M

# ===================================================================== PART 4
@formula("4.1", "Cosine similarity")
def f_4_1(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    s1, d = s_dot(a, b, pre="dot: ")
    s2, na = s_norm(a, pre="norm(a): ")
    s3, nb = s_norm(b, pre="norm(b): ")
    r = d / (na * nb)
    steps = s1 + s2 + s3 + [
        f"Multiply the norms: {num(na)} * {num(nb)} = {num(na * nb)}.",
        f"Divide dot by that: {num(d)} / {num(na * nb)} = {num(r)}."]
    return P(f"Compute the cosine similarity of {vec(a)} and {vec(b)}.", steps, num(r),
             f"np.dot(np.array({a}),np.array({b}))/(np.linalg.norm(np.array({a}))*np.linalg.norm(np.array({b})))", r)

@formula("4.2", "Cosine distance")
def f_4_2(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    s1, d = s_dot(a, b, pre="dot: ")
    s2, na = s_norm(a, pre="norm(a): ")
    s3, nb = s_norm(b, pre="norm(b): ")
    cs = d / (na * nb)
    r = 1 - cs
    steps = s1 + s2 + s3 + [
        f"Multiply the norms: {num(na)} * {num(nb)} = {num(na * nb)}.",
        f"Cosine similarity: {num(d)} / {num(na * nb)} = {num(cs)}.",
        f"Cosine distance: 1 - {num(cs)} = {num(r)}."]
    return P(f"Compute the cosine distance (1 - cosine) of {vec(a)} and {vec(b)}.", steps, num(r),
             f"1 - np.dot(np.array({a}),np.array({b}))/(np.linalg.norm(np.array({a}))*np.linalg.norm(np.array({b})))", r)

@formula("4.3", "Angle from cosine")
def f_4_3(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    s1, d = s_dot(a, b, pre="dot: ")
    s2, na = s_norm(a, pre="norm(a): ")
    s3, nb = s_norm(b, pre="norm(b): ")
    cs = d / (na * nb)
    ang = math.degrees(math.acos(max(-1, min(1, cs))))
    steps = s1 + s2 + s3 + [
        f"Cosine similarity: {num(d)} / ({num(na)} * {num(nb)}) = {num(cs)}.",
        f"Take the inverse cosine: arccos({num(cs)}) = {num(ang)} degrees."]
    return P(f"Find the angle (in degrees) between {vec(a)} and {vec(b)}.", steps, num(ang),
             f"np.degrees(np.arccos(np.dot(np.array({a}),np.array({b}))/(np.linalg.norm(np.array({a}))*np.linalg.norm(np.array({b})))))", ang)

@formula("4.4", "Cauchy-Schwarz inequality")
def f_4_4(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    s1, d = s_dot(a, b, pre="dot: ")
    s2, na = s_norm(a, pre="norm(a): ")
    s3, nb = s_norm(b, pre="norm(b): ")
    lhs = abs(d)
    rhs = na * nb
    steps = s1 + [f"Absolute value of the dot product: |{num(d)}| = {num(lhs)}."] + s2 + s3 + [
        f"Multiply the norms: {num(na)} * {num(nb)} = {num(rhs)}.",
        f"Check: {num(lhs)} <= {num(rhs)} is {lhs <= rhs + 1e-9}."]
    return P(f"Verify the Cauchy-Schwarz inequality |dot| <= norm*norm for a = {vec(a)}, "
             f"b = {vec(b)}.", steps, f"{num(lhs)} <= {num(rhs)} (true)",
             f"float(np.linalg.norm(np.array({a}))*np.linalg.norm(np.array({b})) - abs(np.dot(np.array({a}),np.array({b})))) >= -1e-9", True)

# ===================================================================== PART 5
@formula("5.1", "Normalize to unit length")
def f_5_1(level, rng):
    # pick vectors with clean norms when possible
    banks = {2: [[3, 4], [6, 8], [5, 12], [8, 6], [4, 3]], 3: [[2, 3, 6], [1, 2, 2], [2, 6, 3]]}
    v = list(rng.choice(banks[cfg(level)["dim"] if cfg(level)["dim"] in banks else 2]))
    v = [int(x) for x in v]
    if level == "advanced" and rng.random() < 0.5:
        v = [-x if rng.random() < 0.5 else x for x in v]
    s, n = s_norm(v)
    res = [x / n for x in v]
    steps = s + [f"Divide each component by the norm {num(n)}:"]
    for i, x in enumerate(v, 1):
        steps.append(f"  Component {i}: {num(x)} / {num(n)} = {num(x / n)}")
    return P(f"Normalize {vec(v)} to unit length.", steps, vec(res),
             f"np.array({v})/np.linalg.norm(np.array({v}))", res)

@formula("5.2", "Dot of two unit vectors = cosine")
def f_5_2(level, rng):
    banks = [[3, 4], [4, 3], [6, 8], [5, 12], [8, 6]]
    a = [int(x) for x in rng.choice(banks)]
    b = [int(x) for x in rng.choice(banks)]
    s1, na = s_norm(a, pre="norm(a): ")
    s2, nb = s_norm(b, pre="norm(b): ")
    ah = [x / na for x in a]
    bh = [x / nb for x in b]
    s3, d = s_dot(ah, bh, pre="dot of unit vectors: ")
    steps = s1 + [f"Unit vector a_hat = {vec(ah)}."] + s2 + [f"Unit vector b_hat = {vec(bh)}."] + s3
    return P(f"Normalize a = {vec(a)} and b = {vec(b)}, then take their dot product "
             f"(this equals the cosine).", steps, num(d),
             f"np.dot(np.array({a})/np.linalg.norm(np.array({a})), np.array({b})/np.linalg.norm(np.array({b})))", d)

@formula("5.3", "Mean-centering")
def f_5_3(level, rng):
    v = rv(rng, level, neg=(level == "advanced"))
    m = sum(v) / len(v)
    steps = [f"Add the entries: " + " + ".join(num(x) for x in v) + f" = {num(sum(v))}.",
             f"Divide by the count {len(v)}: {num(sum(v))} / {len(v)} = {num(m)}."]
    res = []
    for i, x in enumerate(v, 1):
        r = x - m
        res.append(r)
        steps.append(f"Subtract the mean from component {i}: {num(x)} - {num(m)} = {num(r)}")
    return P(f"Mean-center the vector {vec(v)} (subtract its average from each entry).",
             steps, vec(res), f"np.array({v}) - np.mean(np.array({v}))", res)

@formula("5.4", "Standardization (z-score)")
def f_5_4(level, rng):
    while True:
        v = rv(rng, level, neg=(level == "advanced"))
        if len(set(v)) > 1:
            break
    m = sum(v) / len(v)
    var = sum((x - m) ** 2 for x in v) / len(v)
    sd = math.sqrt(var)
    steps = [f"Mean: (" + " + ".join(num(x) for x in v) + f") / {len(v)} = {num(m)}.",
             f"Squared deviations: " + ", ".join(f"({num(x)}-{num(m)})^2={num((x-m)**2)}" for x in v) + ".",
             f"Variance: average of those = {num(var)}.",
             f"Standard deviation: sqrt({num(var)}) = {num(sd)}."]
    res = []
    for i, x in enumerate(v, 1):
        r = (x - m) / sd
        res.append(r)
        steps.append(f"z of component {i}: ({num(x)} - {num(m)}) / {num(sd)} = {num(r)}")
    return P(f"Standardize {vec(v)} (subtract mean, divide by standard deviation).",
             steps, vec(res), f"(np.array({v})-np.mean(np.array({v})))/np.std(np.array({v}))", res)

# ===================================================================== PART 6
@formula("6.1", "Euclidean distance")
def f_6_1(level, rng):
    a, b = rv(rng, level, neg=(level == "advanced")), rv(rng, level, neg=(level == "advanced"))
    sd, diff = s_sub(a, b)
    sn, n = s_norm(diff, pre="")
    steps = sd + [f"Now take the norm of the difference {vec(diff)}:"] + sn
    return P(f"Compute the Euclidean distance between {vec(a)} and {vec(b)}.", steps, num(n),
             f"np.linalg.norm(np.array({a})-np.array({b}))", n)

@formula("6.2", "Squared Euclidean distance")
def f_6_2(level, rng):
    a, b = rv(rng, level, neg=(level == "advanced")), rv(rng, level, neg=(level == "advanced"))
    sd, diff = s_sub(a, b)
    sq = [d * d for d in diff]
    steps = sd
    for i, d in enumerate(diff, 1):
        steps.append(f"Square difference {i}: ({num(d)})^2 = {num(d * d)}")
    tot = sum(sq)
    steps.append("Add the squares: " + " + ".join(num(s) for s in sq) + f" = {num(tot)}")
    return P(f"Compute the squared Euclidean distance between {vec(a)} and {vec(b)}.",
             steps, num(tot), f"np.sum((np.array({a})-np.array({b}))**2)", tot)

@formula("6.3", "Manhattan (L1) distance")
def f_6_3(level, rng):
    a, b = rv(rng, level, neg=(level == "advanced")), rv(rng, level, neg=(level == "advanced"))
    sd, diff = s_sub(a, b)
    ab = [abs(d) for d in diff]
    steps = sd
    for i, d in enumerate(diff, 1):
        steps.append(f"Absolute value of difference {i}: |{num(d)}| = {num(abs(d))}")
    tot = sum(ab)
    steps.append("Add them: " + " + ".join(num(x) for x in ab) + f" = {num(tot)}")
    return P(f"Compute the Manhattan (L1) distance between {vec(a)} and {vec(b)}.",
             steps, num(tot), f"np.sum(np.abs(np.array({a})-np.array({b})))", tot)

@formula("6.4", "Chebyshev (L-infinity) distance")
def f_6_4(level, rng):
    a, b = rv(rng, level, neg=(level == "advanced")), rv(rng, level, neg=(level == "advanced"))
    sd, diff = s_sub(a, b)
    ab = [abs(d) for d in diff]
    steps = sd
    for i, d in enumerate(diff, 1):
        steps.append(f"Absolute value of difference {i}: |{num(d)}| = {num(abs(d))}")
    m = max(ab)
    steps.append("Take the maximum: max(" + ", ".join(num(x) for x in ab) + f") = {num(m)}")
    return P(f"Compute the Chebyshev (max) distance between {vec(a)} and {vec(b)}.",
             steps, num(m), f"np.max(np.abs(np.array({a})-np.array({b})))", m)

@formula("6.5", "Minkowski distance (p=3)")
def f_6_5(level, rng):
    a, b = rv(rng, "basic" if level == "basic" else "easy"), rv(rng, "basic" if level == "basic" else "easy")
    sd, diff = s_sub(a, b)
    p = 3
    cubes = [abs(d) ** p for d in diff]
    steps = sd
    for i, d in enumerate(diff, 1):
        steps.append(f"Raise |difference {i}| to power {p}: |{num(d)}|^{p} = {num(abs(d) ** p)}")
    tot = sum(cubes)
    steps.append("Add them: " + " + ".join(num(c) for c in cubes) + f" = {num(tot)}")
    r = tot ** (1 / p)
    steps.append(f"Take the {p}rd root: ({num(tot)})^(1/{p}) = {num(r)}")
    return P(f"Compute the Minkowski distance (p={p}) between {vec(a)} and {vec(b)}.",
             steps, num(r), f"np.linalg.norm(np.array({a})-np.array({b}), {p})", r)

@formula("6.6", "Distance is symmetric")
def f_6_6(level, rng):
    a, b = rv(rng, level, neg=(level == "advanced")), rv(rng, level, neg=(level == "advanced"))
    _, d1 = s_norm([x - y for x, y in zip(a, b)])
    steps = [f"Distance(a,b) = norm({vec([x - y for x, y in zip(a, b)])}) = {num(d1)}.",
             f"Distance(b,a) = norm({vec([y - x for x, y in zip(a, b)])}) = {num(d1)}.",
             f"They are equal, so distance is symmetric."]
    return P(f"Verify distance(a,b) = distance(b,a) for a = {vec(a)}, b = {vec(b)}.",
             steps, f"both = {num(d1)}",
             f"np.linalg.norm(np.array({a})-np.array({b})) - np.linalg.norm(np.array({b})-np.array({a}))", 0)

# ===================================================================== PART 7
@formula("7.1", "Law of cosines (distance <-> dot)")
def f_7_1(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    _, na2 = s_dot(a, a)
    _, nb2 = s_dot(b, b)
    _, d = s_dot(a, b)
    r = na2 + nb2 - 2 * d
    steps = [f"norm(a)^2 = dot(a,a) = {num(na2)}.",
             f"norm(b)^2 = dot(b,b) = {num(nb2)}.",
             f"dot(a,b) = {num(d)}.",
             f"Apply distance^2 = norm(a)^2 + norm(b)^2 - 2*dot(a,b):",
             f"  = {num(na2)} + {num(nb2)} - 2*{num(d)} = {num(r)}."]
    return P(f"Use the law of cosines to find the squared distance between a = {vec(a)} and "
             f"b = {vec(b)}.", steps, num(r),
             f"np.dot(np.array({a}),np.array({a}))+np.dot(np.array({b}),np.array({b}))-2*np.dot(np.array({a}),np.array({b}))", r)

@formula("7.2", "Unit-sphere distance from cosine")
def f_7_2(level, rng):
    cs = float(rng.choice([1.0, 0.8, 0.5, 0.0, -0.5, -1.0]))
    r = 2 - 2 * cs
    steps = [f"On unit vectors, distance^2 = 2 - 2*cosine.",
             f"Insert cosine = {num(cs)}: 2 - 2*{num(cs)} = {num(r)}.",
             f"(Distance itself = sqrt({num(r)}) = {num(math.sqrt(r))}.)"]
    return P(f"Two unit vectors have cosine similarity {num(cs)}. Find the squared distance "
             f"between them.", steps, num(r), f"2 - 2*{cs}", r)

@formula("7.3", "Polarization identity")
def f_7_3(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    apb = [x + y for x, y in zip(a, b)]
    _, n_apb = s_dot(apb, apb)
    _, na2 = s_dot(a, a)
    _, nb2 = s_dot(b, b)
    r = (n_apb - na2 - nb2) / 2
    steps = [f"a + b = {vec(apb)}.",
             f"norm(a+b)^2 = {num(n_apb)}.",
             f"norm(a)^2 = {num(na2)}.",
             f"norm(b)^2 = {num(nb2)}.",
             f"Apply (norm(a+b)^2 - norm(a)^2 - norm(b)^2)/2:",
             f"  = ({num(n_apb)} - {num(na2)} - {num(nb2)}) / 2 = {num(r)}."]
    return P(f"Use the polarization identity to recover dot(a,b) from lengths only, for "
             f"a = {vec(a)}, b = {vec(b)}.", steps, num(r),
             f"(np.dot(np.array({apb}),np.array({apb}))-np.dot(np.array({a}),np.array({a}))-np.dot(np.array({b}),np.array({b})))/2", r)

@formula("7.4", "Parallelogram law")
def f_7_4(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    apb = [x + y for x, y in zip(a, b)]
    amb = [x - y for x, y in zip(a, b)]
    _, n1 = s_dot(apb, apb)
    _, n2 = s_dot(amb, amb)
    lhs = n1 + n2
    _, na2 = s_dot(a, a)
    _, nb2 = s_dot(b, b)
    rhs = 2 * na2 + 2 * nb2
    steps = [f"a + b = {vec(apb)}, norm(a+b)^2 = {num(n1)}.",
             f"a - b = {vec(amb)}, norm(a-b)^2 = {num(n2)}.",
             f"Left side: {num(n1)} + {num(n2)} = {num(lhs)}.",
             f"Right side: 2*{num(na2)} + 2*{num(nb2)} = {num(rhs)}.",
             f"Both equal {num(lhs)}."]
    return P(f"Verify the parallelogram law for a = {vec(a)}, b = {vec(b)}.", steps,
             f"both = {num(lhs)}", f"{lhs} - {rhs}", 0)

# ===================================================================== PART 8
@formula("8.1", "Projection length")
def f_8_1(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    s1, d = s_dot(a, b, pre="dot(a,b): ")
    s2, nb = s_norm(b, pre="norm(b): ")
    r = d / nb
    steps = s1 + s2 + [f"Divide: {num(d)} / {num(nb)} = {num(r)}."]
    return P(f"Compute the projection length of a = {vec(a)} onto b = {vec(b)} "
             f"(dot(a,b) / norm(b)).", steps, num(r),
             f"np.dot(np.array({a}),np.array({b}))/np.linalg.norm(np.array({b}))", r)

@formula("8.2", "Projection vector")
def f_8_2(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    s1, d = s_dot(a, b, pre="dot(a,b): ")
    s2, dbb = s_dot(b, b, pre="dot(b,b): ")
    k = d / dbb
    res = [k * x for x in b]
    steps = s1 + s2 + [f"Ratio dot(a,b)/dot(b,b) = {num(d)} / {num(dbb)} = {num(k)}.",
                       f"Scale b by {num(k)}:"]
    for i, x in enumerate(b, 1):
        steps.append(f"  Component {i}: {num(k)} * {num(x)} = {num(k * x)}")
    return P(f"Compute the projection vector of a = {vec(a)} onto b = {vec(b)}.", steps, vec(res),
             f"(np.dot(np.array({a}),np.array({b}))/np.dot(np.array({b}),np.array({b})))*np.array({b})", res)

@formula("8.3", "Orthogonal decomposition")
def f_8_3(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    _, d = s_dot(a, b)
    _, dbb = s_dot(b, b)
    k = d / dbb
    proj = [k * x for x in b]
    perp = [x - p for x, p in zip(a, proj)]
    steps = [f"dot(a,b) = {num(d)}, dot(b,b) = {num(dbb)}.",
             f"Projection vector = ({num(d)}/{num(dbb)}) * b = {vec(proj)}.",
             f"Perpendicular part = a - projection:"]
    for i, (x, p) in enumerate(zip(a, proj), 1):
        steps.append(f"  Component {i}: {num(x)} - {num(p)} = {num(x - p)}")
    return P(f"Split a = {vec(a)} into its part along b = {vec(b)} plus a perpendicular part; "
             f"give the perpendicular part.", steps, vec(perp),
             f"np.array({a}) - (np.dot(np.array({a}),np.array({b}))/np.dot(np.array({b}),np.array({b})))*np.array({b})", perp)

@formula("8.4", "Orthogonality check")
def f_8_4(level, rng):
    # construct orthogonal or not
    if rng.random() < 0.5:
        base = rv(rng, level)
        if len(base) == 2:
            b = [-base[1], base[0]]  # perpendicular in 2D
        else:
            b = [base[1], -base[0]] + [0] * (len(base) - 2)
        a = base
    else:
        a, b = rv(rng, level), rv(rng, level)
    s, d = s_dot(a, b)
    verdict = "orthogonal (perpendicular)" if abs(d) < 1e-9 else "NOT orthogonal"
    steps = s + [f"The dot product is {num(d)}, so the vectors are {verdict}."]
    return P(f"Are a = {vec(a)} and b = {vec(b)} orthogonal? (check if dot = 0)", steps,
             verdict, f"np.dot(np.array({a}),np.array({b}))", d)

# ===================================================================== PART 9
@formula("9.1", "Hadamard (element-wise) product")
def f_9_1(level, rng):
    a, b = rv(rng, level, neg=(level == "advanced")), rv(rng, level, neg=(level == "advanced"))
    steps, res = [], []
    for i, (x, y) in enumerate(zip(a, b), 1):
        p = x * y
        res.append(p)
        steps.append(f"Multiply component {i}: {num(x)} * {num(y)} = {num(p)}")
    return P(f"Compute the element-wise (Hadamard) product {vec(a)} (*) {vec(b)}.", steps,
             vec(res), f"np.array({a})*np.array({b})", res)

@formula("9.2", "Outer product")
def f_9_2(level, rng):
    a = rv(rng, "basic" if level == "basic" else "easy")
    b = rv(rng, "basic" if level == "basic" else "easy")
    steps, M = [], []
    for i, x in enumerate(a, 1):
        row = []
        for j, y in enumerate(b, 1):
            row.append(x * y)
            steps.append(f"Entry ({i},{j}): {num(x)} * {num(y)} = {num(x * y)}")
        M.append(row)
    return P(f"Compute the outer product of a = {vec(a)} and b = {vec(b)} "
             f"(entry[i][j] = a[i]*b[j]).", steps, mat(M),
             f"np.outer(np.array({a}),np.array({b}))", M)

@formula("9.3", "Cross product (3D)")
def f_9_3(level, rng):
    a = rv(rng, "easy", dim=3, neg=(level == "advanced"))
    b = rv(rng, "easy", dim=3, neg=(level == "advanced"))
    cx = a[1] * b[2] - a[2] * b[1]
    cy = a[2] * b[0] - a[0] * b[2]
    cz = a[0] * b[1] - a[1] * b[0]
    steps = [f"x-component: a2*b3 - a3*b2 = {num(a[1])}*{num(b[2])} - {num(a[2])}*{num(b[1])} = {num(cx)}",
             f"y-component: a3*b1 - a1*b3 = {num(a[2])}*{num(b[0])} - {num(a[0])}*{num(b[2])} = {num(cy)}",
             f"z-component: a1*b2 - a2*b1 = {num(a[0])}*{num(b[1])} - {num(a[1])}*{num(b[0])} = {num(cz)}"]
    return P(f"Compute the cross product {vec(a)} x {vec(b)}.", steps, vec([cx, cy, cz]),
             f"np.cross(np.array({a}),np.array({b}))", [cx, cy, cz])

# ===================================================================== PART 10
@formula("10.1", "Mean / centroid of vectors")
def f_10_1(level, rng):
    k = 2 if level == "basic" else 3
    dim = 2 if level != "advanced" else 3
    vs = [rv(rng, "easy", dim=dim) for _ in range(k)]
    steps = []
    res = []
    for j in range(dim):
        col = [vs[i][j] for i in range(k)]
        s = sum(col)
        steps.append(f"Add component {j + 1} across vectors: " + " + ".join(num(c) for c in col) +
                     f" = {num(s)}; divide by {k}: {num(s / k)}")
        res.append(s / k)
    return P(f"Compute the mean (centroid) of the vectors " + ", ".join(vec(v) for v in vs) + ".",
             steps, vec(res), f"np.mean(np.array({vs}), axis=0)", res)

@formula("10.2", "Correlation = cosine of centered vectors")
def f_10_2(level, rng):
    while True:
        a = rv(rng, "easy", neg=(level == "advanced"))
        b = rv(rng, "easy", neg=(level == "advanced"))
        if len(set(a)) > 1 and len(set(b)) > 1:
            break
    ma, mb = sum(a) / len(a), sum(b) / len(b)
    ac = [x - ma for x in a]
    bc = [x - mb for x in b]
    _, d = s_dot(ac, bc)
    _, na = s_norm(ac)
    _, nb = s_norm(bc)
    r = d / (na * nb)
    steps = [f"Mean of a = {num(ma)}; centered a = {vec(ac)}.",
             f"Mean of b = {num(mb)}; centered b = {vec(bc)}.",
             f"dot(centered a, centered b) = {num(d)}.",
             f"norm(centered a) = {num(na)}, norm(centered b) = {num(nb)}.",
             f"Correlation = {num(d)} / ({num(na)} * {num(nb)}) = {num(r)}."]
    return P(f"Compute the Pearson correlation of a = {vec(a)} and b = {vec(b)} (cosine of the "
             f"centered vectors).", steps, num(r),
             f"np.corrcoef(np.array({a}),np.array({b}))[0,1]", r)

@formula("10.3", "Variance")
def f_10_3(level, rng):
    v = rv(rng, level, neg=(level == "advanced"))
    m = sum(v) / len(v)
    dev = [(x - m) ** 2 for x in v]
    var = sum(dev) / len(v)
    steps = [f"Mean: (" + " + ".join(num(x) for x in v) + f") / {len(v)} = {num(m)}."]
    for i, x in enumerate(v, 1):
        steps.append(f"Squared deviation {i}: ({num(x)} - {num(m)})^2 = {num((x - m) ** 2)}")
    steps.append("Average the squared deviations: (" + " + ".join(num(d) for d in dev) +
                 f") / {len(v)} = {num(var)}")
    return P(f"Compute the variance of {vec(v)}.", steps, num(var),
             f"np.var(np.array({v}))", var)

@formula("10.4", "Covariance")
def f_10_4(level, rng):
    a = rv(rng, "easy", neg=(level == "advanced"))
    b = rv(rng, "easy", neg=(level == "advanced"))
    ma, mb = sum(a) / len(a), sum(b) / len(b)
    prods = [(x - ma) * (y - mb) for x, y in zip(a, b)]
    cov = sum(prods) / len(a)
    steps = [f"Mean of a = {num(ma)}, mean of b = {num(mb)}."]
    for i, (x, y) in enumerate(zip(a, b), 1):
        steps.append(f"Product {i}: ({num(x)} - {num(ma)}) * ({num(y)} - {num(mb)}) = {num((x - ma) * (y - mb))}")
    steps.append("Average the products: (" + " + ".join(num(p) for p in prods) +
                 f") / {len(a)} = {num(cov)}")
    return P(f"Compute the covariance of a = {vec(a)} and b = {vec(b)}.", steps, num(cov),
             f"np.mean((np.array({a})-np.mean(np.array({a})))*(np.array({b})-np.mean(np.array({b}))))", cov)

# ===================================================================== PART 11
@formula("11.1", "Linear interpolation (lerp)")
def f_11_1(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    t = float(rng.choice([0.25, 0.5, 0.75]))
    steps = [f"Formula: (1 - t)*a + t*b with t = {num(t)}.",
             f"1 - t = {num(1 - t)}."]
    res = []
    for i, (x, y) in enumerate(zip(a, b), 1):
        r = (1 - t) * x + t * y
        res.append(r)
        steps.append(f"Component {i}: {num(1 - t)}*{num(x)} + {num(t)}*{num(y)} = {num(r)}")
    return P(f"Interpolate between a = {vec(a)} and b = {vec(b)} at t = {num(t)}.",
             steps, vec(res), f"(1-{t})*np.array({a}) + {t}*np.array({b})", res)

@formula("11.2", "Normalized interpolation (nlerp direction)")
def f_11_2(level, rng):
    banks = [[3, 4], [4, 3], [6, 8], [8, 6]]
    a = [int(x) for x in rng.choice(banks)]
    b = [int(x) for x in rng.choice(banks)]
    mid = [(x + y) / 2 for x, y in zip(a, b)]
    _, n = s_norm(mid)
    res = [x / n for x in mid]
    steps = [f"Average the two vectors: midpoint = {vec(mid)}.",
             f"Norm of the midpoint = {num(n)}.",
             f"Divide each component by {num(n)} to get a unit direction:"]
    for i, x in enumerate(mid, 1):
        steps.append(f"  Component {i}: {num(x)} / {num(n)} = {num(x / n)}")
    return P(f"Find the halfway direction between a = {vec(a)} and b = {vec(b)} "
             f"(average, then normalize).", steps, vec(res),
             f"(m:=(np.array({a})+np.array({b}))/2)/np.linalg.norm(m)", res)

@formula("11.3", "2D rotation")
def f_11_3(level, rng):
    v = rv(rng, "easy", dim=2)
    ang = int(rng.choice([90, 180, 270]))
    rad = math.radians(ang)
    c, s = math.cos(rad), math.sin(rad)
    xn = v[0] * c - v[1] * s
    yn = v[0] * s + v[1] * c
    steps = [f"cos({ang}) = {num(c)}, sin({ang}) = {num(s)}.",
             f"x_new = x*cos - y*sin = {num(v[0])}*{num(c)} - {num(v[1])}*{num(s)} = {num(xn)}",
             f"y_new = x*sin + y*cos = {num(v[0])}*{num(s)} + {num(v[1])}*{num(c)} = {num(yn)}"]
    return P(f"Rotate the vector {vec(v)} by {ang} degrees.", steps, vec([xn, yn]),
             f"(lambda r=np.radians({ang}): np.array([np.cos(r),-np.sin(r),np.sin(r),np.cos(r)]).reshape(2,2)@np.array({v}))()", [xn, yn])

@formula("11.4", "Reflection across a unit direction")
def f_11_4(level, rng):
    v = rv(rng, "easy", dim=2)
    u = list(rng.choice([[1, 0], [0, 1]]))
    u = [int(x) for x in u]
    _, d = s_dot(v, u)
    res = [2 * d * ui - vi for ui, vi in zip(u, v)]
    steps = [f"dot(v, u) = {num(d)}.",
             f"Formula: 2*dot(v,u)*u - v.",
             f"2*{num(d)}*u = {vec([2 * d * ui for ui in u])}.",
             f"Subtract v: {vec([2 * d * ui for ui in u])} - {vec(v)} = {vec(res)}."]
    return P(f"Reflect the vector {vec(v)} across the unit direction {vec(u)}.", steps, vec(res),
             f"2*np.dot(np.array({v}),np.array({u}))*np.array({u}) - np.array({v})", res)

# ===================================================================== PART 12
@formula("12.1", "Triangle inequality")
def f_12_1(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    apb = [x + y for x, y in zip(a, b)]
    _, n_apb = s_norm(apb)
    _, na = s_norm(a)
    _, nb = s_norm(b)
    steps = [f"a + b = {vec(apb)}; norm(a+b) = {num(n_apb)}.",
             f"norm(a) = {num(na)}, norm(b) = {num(nb)}; sum = {num(na + nb)}.",
             f"Check: {num(n_apb)} <= {num(na + nb)} is {n_apb <= na + nb + 1e-9}."]
    return P(f"Verify the triangle inequality norm(a+b) <= norm(a) + norm(b) for a = {vec(a)}, "
             f"b = {vec(b)}.", steps, f"{num(n_apb)} <= {num(na + nb)} (true)",
             f"float(np.linalg.norm(np.array({a}))+np.linalg.norm(np.array({b})) - np.linalg.norm(np.array({apb}))) >= -1e-9", True)

@formula("12.2", "Cauchy-Schwarz inequality")
def f_12_2(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    _, d = s_dot(a, b)
    _, na = s_norm(a)
    _, nb = s_norm(b)
    steps = [f"dot(a,b) = {num(d)}; |dot| = {num(abs(d))}.",
             f"norm(a)*norm(b) = {num(na)} * {num(nb)} = {num(na * nb)}.",
             f"Check: {num(abs(d))} <= {num(na * nb)} is {abs(d) <= na * nb + 1e-9}."]
    return P(f"Verify Cauchy-Schwarz |dot(a,b)| <= norm(a)*norm(b) for a = {vec(a)}, b = {vec(b)}.",
             steps, f"{num(abs(d))} <= {num(na * nb)} (true)",
             f"float(np.linalg.norm(np.array({a}))*np.linalg.norm(np.array({b})) - abs(np.dot(np.array({a}),np.array({b})))) >= -1e-9", True)

# ===================================================================== PART 13
@formula("13.1", "Nearest neighbor")
def f_13_1(level, rng):
    dim = 2 if level != "advanced" else 3
    q = rv(rng, "easy", dim=dim)
    items = [rv(rng, "easy", dim=dim) for _ in range(3)]
    dists = []
    steps = []
    for i, it in enumerate(items, 1):
        diff = [x - y for x, y in zip(it, q)]
        _, dd = s_norm(diff)
        dists.append(dd)
        steps.append(f"Distance to item {i} {vec(it)}: norm({vec(diff)}) = {num(dd)}")
    best = int(np.argmin(dists)) + 1
    steps.append(f"Smallest distance is to item {best}.")
    return P(f"Query {vec(q)}. Which of these items is the nearest neighbor by Euclidean "
             f"distance? " + ", ".join(f"item {i}={vec(it)}" for i, it in enumerate(items, 1)),
             steps, f"item {best}",
             f"int(np.argmin([np.linalg.norm(np.array(x)-np.array({q})) for x in {items}]))+1", best)

@formula("13.2", "Analogy (vector arithmetic)")
def f_13_2(level, rng):
    a = rv(rng, level)
    b = rv(rng, level)
    c = rv(rng, level)
    res = [x - y + z for x, y, z in zip(a, b, c)]
    steps = []
    for i, (x, y, z) in enumerate(zip(a, b, c), 1):
        steps.append(f"Component {i}: {num(x)} - {num(y)} + {num(z)} = {num(x - y + z)}")
    return P(f"Compute the analogy vector a - b + c for a = {vec(a)}, b = {vec(b)}, c = {vec(c)}.",
             steps, vec(res), f"np.array({a})-np.array({b})+np.array({c})", res)

@formula("13.3", "Softmax")
def f_13_3(level, rng):
    n = 2 if level == "basic" else (2 if level == "easy" else 3)
    v = [int(rng.integers(0, 3)) for _ in range(n)]
    exps = [math.exp(x) for x in v]
    tot = sum(exps)
    res = [e / tot for e in exps]
    steps = []
    for i, x in enumerate(v, 1):
        steps.append(f"Exponentiate component {i}: exp({num(x)}) = {num(exps[i - 1])}")
    steps.append("Sum the exponentials: " + " + ".join(num(e) for e in exps) + f" = {num(tot)}")
    for i, e in enumerate(exps, 1):
        steps.append(f"Divide term {i} by the sum: {num(e)} / {num(tot)} = {num(res[i - 1])}")
    return P(f"Compute the softmax of {vec(v)}.", steps, vec(res),
             f"np.exp(np.array({v}))/np.sum(np.exp(np.array({v})))", res)

@formula("13.4", "Sentence embedding by averaging")
def f_13_4(level, rng):
    k = 2 if level == "basic" else 3
    dim = 2 if level != "advanced" else 3
    ws = [rv(rng, "easy", dim=dim) for _ in range(k)]
    res = []
    steps = []
    for j in range(dim):
        col = [ws[i][j] for i in range(k)]
        s = sum(col)
        res.append(s / k)
        steps.append(f"Average dimension {j + 1}: (" + " + ".join(num(c) for c in col) +
                     f") / {k} = {num(s / k)}")
    return P(f"Embed a sentence by averaging its word vectors " + ", ".join(vec(w) for w in ws) + ".",
             steps, vec(res), f"np.mean(np.array({ws}), axis=0)", res)

# ===================================================================== PART 14
@formula("14.1", "Matrix times vector")
def f_14_1(level, rng):
    n = 2 if level != "advanced" else 3
    M = rmat(rng, n, n, neg=(level == "advanced"))
    v = rv(rng, "easy", dim=n, neg=(level == "advanced"))
    res = []
    steps = []
    for i in range(n):
        terms = [M[i][j] * v[j] for j in range(n)]
        s = sum(terms)
        res.append(s)
        steps.append(f"Row {i + 1} dot v: " + " + ".join(f"{num(M[i][j])}*{num(v[j])}" for j in range(n)) +
                     f" = {num(s)}")
    return P(f"Compute M v for M = {mat(M)} and v = {vec(v)}.", steps, vec(res),
             f"np.array({M})@np.array({v})", res)

@formula("14.2", "Matrix times matrix")
def f_14_2(level, rng):
    n = 2
    A = rmat(rng, n, n, neg=(level == "advanced"))
    B = rmat(rng, n, n, neg=(level == "advanced"))
    C = [[0] * n for _ in range(n)]
    steps = []
    for i in range(n):
        for j in range(n):
            terms = [A[i][k] * B[k][j] for k in range(n)]
            C[i][j] = sum(terms)
            steps.append(f"Entry ({i + 1},{j + 1}): " +
                         " + ".join(f"{num(A[i][k])}*{num(B[k][j])}" for k in range(n)) +
                         f" = {num(C[i][j])}")
    return P(f"Compute A B for A = {mat(A)} and B = {mat(B)}.", steps, mat(C),
             f"np.array({A})@np.array({B})", C)

@formula("14.3", "Transpose")
def f_14_3(level, rng):
    r, c = 2, (2 if level == "basic" else 3)
    M = rmat(rng, r, c, neg=(level == "advanced"))
    T = [[M[i][j] for i in range(r)] for j in range(c)]
    steps = [f"Row {i + 1} of M becomes column {i + 1} of the transpose." for i in range(r)]
    steps.append(f"Result: {mat(T)}")
    return P(f"Transpose the matrix {mat(M)}.", steps, mat(T),
             f"np.array({M}).T", T)

@formula("14.4", "Identity matrix action")
def f_14_4(level, rng):
    n = 2 if level != "advanced" else 3
    v = rv(rng, "easy", dim=n, neg=(level == "advanced"))
    steps = [f"The identity matrix leaves every component unchanged."]
    for i, x in enumerate(v, 1):
        steps.append(f"Component {i}: stays {num(x)}")
    return P(f"Compute I v where I is the identity and v = {vec(v)}.", steps, vec(v),
             f"np.eye({n})@np.array({v})", v)

@formula("14.5", "Determinant of a 2x2")
def f_14_5(level, rng):
    M = rmat(rng, 2, 2, neg=(level == "advanced"))
    (a, b), (c, d) = M
    det = a * d - b * c
    steps = [f"Multiply the main diagonal: {num(a)} * {num(d)} = {num(a * d)}.",
             f"Multiply the other diagonal: {num(b)} * {num(c)} = {num(b * c)}.",
             f"Subtract: {num(a * d)} - {num(b * c)} = {num(det)}."]
    return P(f"Compute the determinant of {mat(M)}.", steps, num(det),
             f"np.linalg.det(np.array({M}))", det)

@formula("14.6", "Inverse of a 2x2")
def f_14_6(level, rng):
    while True:
        M = rmat(rng, 2, 2, neg=(level == "advanced"))
        (a, b), (c, d) = M
        det = a * d - b * c
        if det != 0:
            break
    inv = [[d / det, -b / det], [-c / det, a / det]]
    steps = [f"Determinant: {num(a)}*{num(d)} - {num(b)}*{num(c)} = {num(det)}.",
             f"Swap a and d, negate b and c: [[{num(d)}, {num(-b)}], [{num(-c)}, {num(a)}]].",
             f"Divide every entry by the determinant {num(det)}:",
             f"  [[{num(d)}/{num(det)}, {num(-b)}/{num(det)}], [{num(-c)}/{num(det)}, {num(a)}/{num(det)}]] = {mat(inv)}."]
    return P(f"Compute the inverse of {mat(M)}.", steps, mat(inv),
             f"np.linalg.inv(np.array({M}))", inv)

@formula("14.7", "Dot product as matrix multiply")
def f_14_7(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    steps, d = s_dot(a, b)
    steps.insert(0, "Writing a as a row and b as a column, a^T b is the dot product:")
    return P(f"Compute a^T b (dot as matrix multiply) for a = {vec(a)}, b = {vec(b)}.",
             steps, num(d), f"np.array({a})@np.array({b})", d)

@formula("14.8", "Trace")
def f_14_8(level, rng):
    n = 2 if level != "advanced" else 3
    M = rmat(rng, n, n, neg=(level == "advanced"))
    diag = [M[i][i] for i in range(n)]
    tr = sum(diag)
    steps = [f"Read the diagonal entries: " + ", ".join(num(x) for x in diag) + ".",
             f"Add them: " + " + ".join(num(x) for x in diag) + f" = {num(tr)}."]
    return P(f"Compute the trace of {mat(M)}.", steps, num(tr),
             f"np.trace(np.array({M}))", tr)

@formula("14.9", "Rank of a 2x2")
def f_14_9(level, rng):
    if rng.random() < 0.5:
        r1 = rv(rng, "easy", dim=2)
        k = int(rng.integers(2, 4))
        M = [r1, [k * r1[0], k * r1[1]]]
    else:
        M = rmat(rng, 2, 2, neg=(level == "advanced"))
    (a, b), (c, d) = M
    det = a * d - b * c
    rank = int(np.linalg.matrix_rank(np.array(M)))
    steps = [f"Determinant: {num(a)}*{num(d)} - {num(b)}*{num(c)} = {num(det)}.",
             (f"Determinant is not zero, so the rows are independent: rank 2." if det != 0
              else f"Determinant is zero, so one row is a multiple of the other: rank {rank}.")]
    return P(f"Find the rank of {mat(M)}.", steps, num(rank),
             f"np.linalg.matrix_rank(np.array({M}))", rank)

@formula("14.10", "Eigenvector / eigenvalue check")
def f_14_10(level, rng):
    lam = int(rng.integers(2, 6))
    other = int(rng.integers(2, 6))
    # diagonal matrix so [1,0] and [0,1] are eigenvectors
    M = [[lam, 0], [0, other]]
    v = [1, 0]
    Mv = [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]]
    steps = [f"Compute M v: row 1 = {num(M[0][0])}*{num(v[0])} + {num(M[0][1])}*{num(v[1])} = {num(Mv[0])}.",
             f"row 2 = {num(M[1][0])}*{num(v[0])} + {num(M[1][1])}*{num(v[1])} = {num(Mv[1])}.",
             f"M v = {vec(Mv)} = {num(lam)} * {vec(v)}.",
             f"So v is an eigenvector with eigenvalue {num(lam)}."]
    return P(f"Show that v = {vec(v)} is an eigenvector of M = {mat(M)}, and give its eigenvalue.",
             steps, num(lam), f"(np.array({M})@np.array({v}))[0]/np.array({v})[0]", lam)

@formula("14.11", "Reconstruct a matrix from SVD factors")
def f_14_11(level, rng):
    U = rmat(rng, 2, 2, lo=0, hi=2)
    S = [[int(rng.integers(1, 4)), 0], [0, int(rng.integers(1, 4))]]
    Vt = rmat(rng, 2, 2, lo=0, hi=2)
    US = [[sum(U[i][k] * S[k][j] for k in range(2)) for j in range(2)] for i in range(2)]
    M = [[sum(US[i][k] * Vt[k][j] for k in range(2)) for j in range(2)] for i in range(2)]
    steps = [f"First multiply U by S: {mat(U)} times {mat(S)} = {mat(US)}.",
             f"Then multiply that by V^T: {mat(US)} times {mat(Vt)} = {mat(M)}."]
    return P(f"Reconstruct M = U S V^T for U = {mat(U)}, S = {mat(S)}, V^T = {mat(Vt)}.",
             steps, mat(M), f"np.array({U})@np.array({S})@np.array({Vt})", M)

@formula("14.12", "Covariance matrix (PCA step)")
def f_14_12(level, rng):
    # two points in 2D chosen so means are clean
    pts = [rv(rng, "easy", dim=2) for _ in range(2)]
    data = np.array(pts, dtype=float)
    m = data.mean(axis=0)
    cen = data - m
    C = (cen.T @ cen) / len(pts)
    Cl = C.tolist()
    steps = [f"Data points: {vec(pts[0])}, {vec(pts[1])}.",
             f"Column means: {vec(list(m))}.",
             f"Centered data: {vec(list(cen[0]))}, {vec(list(cen[1]))}.",
             f"Covariance = centered^T times centered, divided by {len(pts)}: {mat(Cl)}."]
    return P(f"Compute the 2x2 covariance matrix (the PCA step) of the points {vec(pts[0])} and "
             f"{vec(pts[1])}.", steps, mat(Cl),
             f"np.cov(np.array({pts}).T, bias=True)", Cl)

@formula("14.13", "Orthogonal matrix check")
def f_14_13(level, rng):
    # rotation-like or permutation matrices are orthogonal; test columns
    choices = [[[0, 1], [1, 0]], [[1, 0], [0, 1]], [[0, -1], [1, 0]]]
    M = [list(map(int, row)) for row in rng.choice(choices)]
    col1 = [M[0][0], M[1][0]]
    col2 = [M[0][1], M[1][1]]
    _, d = s_dot(col1, col2)
    _, n1 = s_norm(col1)
    _, n2 = s_norm(col2)
    ok = abs(d) < 1e-9 and abs(n1 - 1) < 1e-9 and abs(n2 - 1) < 1e-9
    steps = [f"Column 1 = {vec(col1)}, column 2 = {vec(col2)}.",
             f"Dot of the columns = {num(d)} (want 0).",
             f"Norm of column 1 = {num(n1)}, norm of column 2 = {num(n2)} (want 1).",
             f"Orthogonal matrix: {ok}."]
    return P(f"Is {mat(M)} an orthogonal matrix? (columns unit-length and perpendicular)",
             steps, str(ok), f"bool(np.allclose(np.array({M}).T@np.array({M}), np.eye(2)))", ok)

@formula("14.14", "Gram-Schmidt (one step)")
def f_14_14(level, rng):
    u = rv(rng, "easy", dim=2)
    v = rv(rng, "easy", dim=2, neg=(level == "advanced"))
    _, duv = s_dot(u, v)
    _, duu = s_dot(u, u)
    k = duv / duu
    proj = [k * x for x in u]
    w = [x - p for x, p in zip(v, proj)]
    steps = [f"dot(u,v) = {num(duv)}, dot(u,u) = {num(duu)}.",
             f"Projection of v onto u = ({num(duv)}/{num(duu)}) * u = {vec(proj)}.",
             f"Subtract to make it perpendicular to u: v - projection = {vec(w)}."]
    return P(f"Gram-Schmidt: make v = {vec(v)} orthogonal to u = {vec(u)}.", steps, vec(w),
             f"np.array({v}) - (np.dot(np.array({u}),np.array({v}))/np.dot(np.array({u}),np.array({u})))*np.array({u})", w)

@formula("14.15", "Frobenius norm")
def f_14_15(level, rng):
    n = 2
    M = rmat(rng, n, n, neg=(level == "advanced"))
    sq = [M[i][j] ** 2 for i in range(n) for j in range(n)]
    tot = sum(sq)
    r = math.sqrt(tot)
    steps = ["Square every entry: " + ", ".join(num(x) for x in sq) + ".",
             "Add them: " + " + ".join(num(x) for x in sq) + f" = {num(tot)}.",
             f"Take the square root: sqrt({num(tot)}) = {num(r)}."]
    return P(f"Compute the Frobenius norm of {mat(M)}.", steps, num(r),
             f"np.linalg.norm(np.array({M}))", r)

@formula("14.16", "Gram matrix")
def f_14_16(level, rng):
    a = rv(rng, "easy", dim=2)
    b = rv(rng, "easy", dim=2, neg=(level == "advanced"))
    _, daa = s_dot(a, a)
    _, dab = s_dot(a, b)
    _, dbb = s_dot(b, b)
    G = [[daa, dab], [dab, dbb]]
    steps = [f"Entry (1,1) = dot(a,a) = {num(daa)}.",
             f"Entry (1,2) = entry (2,1) = dot(a,b) = {num(dab)}.",
             f"Entry (2,2) = dot(b,b) = {num(dbb)}.",
             f"Gram matrix = {mat(G)}."]
    return P(f"Compute the 2x2 Gram matrix of a = {vec(a)} and b = {vec(b)} "
             f"(all pairwise dot products).", steps, mat(G),
             f"(lambda X=np.array([{a},{b}]): X@X.T)()", G)

# ===================================================================== PART 15
@formula("15.1", "Gradient of a simple function")
def f_15_1(level, rng):
    # f(x,y) = a*x^2 + b*y^2 ; gradient = [2a x, 2b y]
    a = int(rng.integers(1, 4))
    b = int(rng.integers(1, 4))
    x = int(rng.integers(1, 5)) * (-1 if level == "advanced" and rng.random() < 0.5 else 1)
    y = int(rng.integers(1, 5)) * (-1 if level == "advanced" and rng.random() < 0.5 else 1)
    gx, gy = 2 * a * x, 2 * b * y
    steps = [f"Partial with respect to x: d/dx of {a}x^2 = {2 * a}x; at x={num(x)} that is {num(gx)}.",
             f"Partial with respect to y: d/dy of {b}y^2 = {2 * b}y; at y={num(y)} that is {num(gy)}.",
             f"Gradient = [{num(gx)}, {num(gy)}]."]
    return P(f"Find the gradient of f(x,y) = {a}x^2 + {b}y^2 at the point ({num(x)}, {num(y)}).",
             steps, vec([gx, gy]), f"[2*{a}*{x}, 2*{b}*{y}]", [gx, gy])

@formula("15.2", "Gradient of a dot product")
def f_15_2(level, rng):
    x = rv(rng, level, neg=(level == "advanced"))
    steps = ["The gradient of dot(w, x) with respect to w is just x.",
             f"So the gradient is {vec(x)}."]
    return P(f"Find the gradient of f(w) = dot(w, x) with respect to w, where x = {vec(x)}.",
             steps, vec(x), f"np.array({x})", x)

@formula("15.3", "Gradient of the squared norm")
def f_15_3(level, rng):
    v = rv(rng, level, neg=(level == "advanced"))
    res = [2 * x for x in v]
    steps = ["The gradient of norm(v)^2 is 2*v."]
    for i, x in enumerate(v, 1):
        steps.append(f"Component {i}: 2 * {num(x)} = {num(2 * x)}")
    return P(f"Find the gradient of f(v) = norm(v)^2 at v = {vec(v)}.", steps, vec(res),
             f"2*np.array({v})", res)

@formula("15.4", "Gradient of the norm")
def f_15_4(level, rng):
    banks = [[3, 4], [6, 8], [5, 12], [8, 6]]
    v = [int(x) for x in rng.choice(banks)]
    _, n = s_norm(v)
    res = [x / n for x in v]
    steps = [f"The gradient of norm(v) is v / norm(v) (the unit vector).",
             f"norm(v) = {num(n)}."]
    for i, x in enumerate(v, 1):
        steps.append(f"Component {i}: {num(x)} / {num(n)} = {num(x / n)}")
    return P(f"Find the gradient of f(v) = norm(v) at v = {vec(v)}.", steps, vec(res),
             f"np.array({v})/np.linalg.norm(np.array({v}))", res)

@formula("15.5", "Directional derivative")
def f_15_5(level, rng):
    g = rv(rng, "easy", neg=(level == "advanced"))
    u = list(rng.choice([[1, 0], [0, 1]])) if len(g) == 2 else [1, 0, 0]
    u = [int(x) for x in u][:len(g)]
    steps, d = s_dot(g, u)
    steps.insert(0, "Directional derivative = dot(gradient, direction).")
    return P(f"The gradient of f is {vec(g)}. Find the directional derivative along the unit "
             f"direction {vec(u)}.", steps, num(d),
             f"np.dot(np.array({g}),np.array({u}))", d)

@formula("15.6", "Jacobian")
def f_15_6(level, rng):
    # f(x,y) = [x^2 + y, x*y]; Jacobian = [[2x, 1],[y, x]]
    x = int(rng.integers(1, 5)) * (-1 if level == "advanced" and rng.random() < 0.5 else 1)
    y = int(rng.integers(1, 5)) * (-1 if level == "advanced" and rng.random() < 0.5 else 1)
    J = [[2 * x, 1], [y, x]]
    steps = [f"f1 = x^2 + y. d f1/dx = 2x = {num(2 * x)}; d f1/dy = 1.",
             f"f2 = x*y. d f2/dx = y = {num(y)}; d f2/dy = x = {num(x)}.",
             f"Jacobian = {mat(J)}."]
    return P(f"Find the Jacobian of f(x,y) = [x^2 + y, x*y] at ({num(x)}, {num(y)}).",
             steps, mat(J), f"[[2*{x}, 1], [{y}, {x}]]", J)

@formula("15.7", "Chain rule")
def f_15_7(level, rng):
    a = int(rng.integers(2, 5))
    b = int(rng.integers(1, 5)) * (-1 if level == "advanced" and rng.random() < 0.5 else 1)
    x = int(rng.integers(1, 5))
    u = a * x + b
    deriv = 2 * u * a
    steps = [f"Inner function: u = g(x) = {a}x + {num(b)}; at x={num(x)}, u = {num(u)}.",
             f"Outer derivative: f(u) = u^2, so f'(u) = 2u = {num(2 * u)}.",
             f"Inner derivative: g'(x) = {num(a)}.",
             f"Multiply: {num(2 * u)} * {num(a)} = {num(deriv)}."]
    return P(f"Use the chain rule to differentiate f(x) = ({a}x + {num(b)})^2 at x = {num(x)}.",
             steps, num(deriv), f"2*({a}*{x}+{b})*{a}", deriv)

@formula("15.8", "Gradient descent step")
def f_15_8(level, rng):
    w = rv(rng, "easy", neg=(level == "advanced"))
    g = rv(rng, "easy", neg=(level == "advanced"))
    lr = float(rng.choice([0.1, 0.5]))
    res = [wi - lr * gi for wi, gi in zip(w, g)]
    steps = [f"Update rule: w_new = w - learning_rate * gradient, learning_rate = {num(lr)}."]
    for i, (wi, gi) in enumerate(zip(w, g), 1):
        steps.append(f"Component {i}: {num(wi)} - {num(lr)}*{num(gi)} = {num(wi - lr * gi)}")
    return P(f"Take one gradient-descent step from w = {vec(w)} with gradient {vec(g)} and "
             f"learning rate {num(lr)}.", steps, vec(res),
             f"np.array({w}) - {lr}*np.array({g})", res)

# ===================================================================== PART 16
@formula("16.1", "Mahalanobis distance (diagonal covariance)")
def f_16_1(level, rng):
    dim = 2
    a = rv(rng, "easy", dim=dim)
    b = rv(rng, "easy", dim=dim)
    var = [int(rng.choice([1, 4, 9])) for _ in range(dim)]
    terms = [((a[i] - b[i]) ** 2) / var[i] for i in range(dim)]
    tot = sum(terms)
    r = math.sqrt(tot)
    steps = [f"Differences: " + ", ".join(f"{num(a[i])}-{num(b[i])}={num(a[i] - b[i])}" for i in range(dim)) + ".",
             f"Variances (diagonal covariance): {vec(var)}."]
    for i in range(dim):
        steps.append(f"Term {i + 1}: ({num(a[i] - b[i])})^2 / {num(var[i])} = {num(terms[i])}")
    steps.append("Add the terms: " + " + ".join(num(t) for t in terms) + f" = {num(tot)}")
    steps.append(f"Take the square root: sqrt({num(tot)}) = {num(r)}")
    return P(f"Compute the Mahalanobis distance between a = {vec(a)} and b = {vec(b)} with "
             f"diagonal variances {vec(var)}.", steps, num(r),
             f"np.sqrt(np.sum((np.array({a})-np.array({b}))**2/np.array({var})))", r)

@formula("16.2", "Jaccard similarity")
def f_16_2(level, rng):
    universe = list(range(1, 7))
    ka = int(rng.integers(2, 4))
    kb = int(rng.integers(2, 4))
    A = sorted(set(int(x) for x in rng.choice(universe, ka, replace=False)))
    B = sorted(set(int(x) for x in rng.choice(universe, kb, replace=False)))
    inter = sorted(set(A) & set(B))
    union = sorted(set(A) | set(B))
    r = len(inter) / len(union)
    steps = [f"Intersection (in both): {inter}, size {len(inter)}.",
             f"Union (in either): {union}, size {len(union)}.",
             f"Divide: {len(inter)} / {len(union)} = {num(r)}."]
    return P(f"Compute the Jaccard similarity of sets A = {A} and B = {B}.", steps, num(r),
             f"len(set({A})&set({B}))/len(set({A})|set({B}))", r)

@formula("16.3", "Hamming distance")
def f_16_3(level, rng):
    n = 4 if level != "advanced" else 6
    a = [int(rng.integers(0, 2)) for _ in range(n)]
    b = [int(rng.integers(0, 2)) for _ in range(n)]
    diffs = [i + 1 for i in range(n) if a[i] != b[i]]
    r = len(diffs)
    steps = [f"Compare position by position:"]
    for i in range(n):
        steps.append(f"  Position {i + 1}: {a[i]} vs {b[i]} -> {'differ' if a[i] != b[i] else 'same'}")
    steps.append(f"Count the positions that differ: {r}.")
    return P(f"Compute the Hamming distance between {vec(a)} and {vec(b)}.", steps, num(r),
             f"int(np.sum(np.array({a})!=np.array({b})))", r)

@formula("16.4", "Edit (Levenshtein) distance")
def f_16_4(level, rng):
    bank_basic = [("cat", "cut", 1), ("dog", "dot", 1), ("car", "cart", 1),
                  ("book", "back", 2), ("sun", "son", 1)]
    bank_easy = [("kitten", "sitten", 1), ("flaw", "lawn", 2), ("hello", "help", 2),
                 ("table", "cable", 1), ("night", "light", 1)]
    bank_adv = [("kitten", "sitting", 3), ("sunday", "saturday", 3), ("intention", "execution", 5),
                ("gumbo", "gambol", 2), ("abcdef", "azced", 3)]
    bank = {"basic": bank_basic, "easy": bank_easy, "advanced": bank_adv}[level]
    s, t, dist = [tuple(x) if not isinstance(x, tuple) else x for x in [bank[int(rng.integers(0, len(bank)))]]][0]
    steps = [f"Turn '{s}' into '{t}' using the fewest insert/delete/substitute edits.",
             f"The minimum number of edits is {dist}."]
    return P(f"Compute the edit (Levenshtein) distance between '{s}' and '{t}'.", steps, num(dist),
             f"edit_distance('{s}','{t}')", dist)

@formula("16.5", "Linear kernel")
def f_16_5(level, rng):
    a, b = rv(rng, level), rv(rng, level)
    steps, d = s_dot(a, b)
    steps.insert(0, "The linear kernel is just the dot product.")
    return P(f"Compute the linear kernel K(a,b) = dot(a,b) for a = {vec(a)}, b = {vec(b)}.",
             steps, num(d), f"np.dot(np.array({a}),np.array({b}))", d)

@formula("16.6", "Polynomial kernel")
def f_16_6(level, rng):
    a, b = rv(rng, "basic" if level == "basic" else "easy"), rv(rng, "basic" if level == "basic" else "easy")
    c = int(rng.integers(0, 3))
    deg = 2
    s1, d = s_dot(a, b)
    inner = d + c
    r = inner ** deg
    steps = s1 + [f"Add the constant c = {num(c)}: {num(d)} + {num(c)} = {num(inner)}.",
                  f"Raise to the power {deg}: ({num(inner)})^{deg} = {num(r)}."]
    return P(f"Compute the polynomial kernel (dot + {num(c)})^{deg} for a = {vec(a)}, b = {vec(b)}.",
             steps, num(r), f"(np.dot(np.array({a}),np.array({b}))+{c})**{deg}", r)

@formula("16.7", "RBF / Gaussian kernel")
def f_16_7(level, rng):
    a, b = rv(rng, "basic" if level == "basic" else "easy"), rv(rng, "basic" if level == "basic" else "easy")
    sig = float(rng.choice([1.0, 2.0]))
    diff = [x - y for x, y in zip(a, b)]
    d2 = sum(x * x for x in diff)
    r = math.exp(-d2 / (2 * sig * sig))
    steps = [f"Difference: {vec(diff)}.",
             f"Squared distance: " + " + ".join(f"({num(x)})^2" for x in diff) + f" = {num(d2)}.",
             f"Divide by 2*sigma^2 = {num(2 * sig * sig)}: {num(d2)} / {num(2 * sig * sig)} = {num(d2 / (2 * sig * sig))}.",
             f"Take exp of the negative: exp(-{num(d2 / (2 * sig * sig))}) = {num(r)}."]
    return P(f"Compute the RBF kernel with sigma = {num(sig)} for a = {vec(a)}, b = {vec(b)}.",
             steps, num(r), f"np.exp(-np.sum((np.array({a})-np.array({b}))**2)/(2*{sig}**2))", r)

# ===================================================================== PART 17
@formula("17.1", "Softmax")
def f_17_1(level, rng):
    return f_13_3(level, rng)

@formula("17.2", "Entropy")
def f_17_2(level, rng):
    dists = [[0.5, 0.5], [0.25, 0.75], [1.0, 0.0], [0.2, 0.8], [1 / 3, 2 / 3],
             [0.25, 0.25, 0.5], [0.5, 0.25, 0.25]]
    p = list(rng.choice([d for d in dists if (len(d) == 2 or level == "advanced")], ) ) if False else \
        dists[int(rng.integers(0, 5 if level != "advanced" else len(dists)))]
    terms = []
    steps = []
    for i, pi in enumerate(p, 1):
        if pi == 0:
            steps.append(f"Term {i}: p = 0 contributes 0.")
            terms.append(0.0)
        else:
            t = pi * math.log(pi)
            terms.append(t)
            steps.append(f"Term {i}: {num(pi)} * ln({num(pi)}) = {num(t)}")
    H = -sum(terms)
    steps.append("Add the terms and negate: -(" + " + ".join(num(t) for t in terms) + f") = {num(H)}")
    return P(f"Compute the entropy (natural log) of the distribution {vec(p)}.", steps, num(H),
             f"-np.sum([pi*np.log(pi) for pi in {p} if pi>0])", H)

@formula("17.3", "Cross-entropy")
def f_17_3(level, rng):
    pairs = [([1, 0], [0.8, 0.2]), ([0, 1], [0.3, 0.7]), ([1, 0], [0.6, 0.4]),
             ([0, 1], [0.25, 0.75]), ([1, 0], [0.9, 0.1])]
    p, q = pairs[int(rng.integers(0, len(pairs)))]
    terms = []
    steps = []
    for i, (pi, qi) in enumerate(zip(p, q), 1):
        if pi == 0:
            steps.append(f"Term {i}: p = 0 contributes 0.")
            terms.append(0.0)
        else:
            t = pi * math.log(qi)
            terms.append(t)
            steps.append(f"Term {i}: {num(pi)} * ln({num(qi)}) = {num(t)}")
    H = -sum(terms)
    steps.append("Add and negate: -(" + " + ".join(num(t) for t in terms) + f") = {num(H)}")
    return P(f"Compute the cross-entropy between true labels p = {vec(p)} and predictions "
             f"q = {vec(q)}.", steps, num(H),
             f"-np.sum([pi*np.log(qi) for pi,qi in zip({p},{q}) if pi>0])", H)

@formula("17.4", "KL divergence")
def f_17_4(level, rng):
    pairs = [([0.5, 0.5], [0.25, 0.75]), ([0.8, 0.2], [0.5, 0.5]), ([0.5, 0.5], [0.5, 0.5]),
             ([0.9, 0.1], [0.8, 0.2]), ([0.4, 0.6], [0.5, 0.5])]
    p, q = pairs[int(rng.integers(0, len(pairs)))]
    terms = []
    steps = []
    for i, (pi, qi) in enumerate(zip(p, q), 1):
        t = pi * math.log(pi / qi)
        terms.append(t)
        steps.append(f"Term {i}: {num(pi)} * ln({num(pi)}/{num(qi)}) = {num(pi)} * ln({num(pi / qi)}) = {num(t)}")
    kl = sum(terms)
    steps.append("Add the terms: " + " + ".join(num(t) for t in terms) + f" = {num(kl)}")
    return P(f"Compute the KL divergence KL(p || q) for p = {vec(p)}, q = {vec(q)}.", steps, num(kl),
             f"np.sum([pi*np.log(pi/qi) for pi,qi in zip({p},{q})])", kl)

@formula("17.5", "Dot product as expected value")
def f_17_5(level, rng):
    dists = [[0.5, 0.5], [0.25, 0.75], [0.2, 0.8], [1 / 3, 2 / 3]]
    p = dists[int(rng.integers(0, len(dists)))]
    vals = rv(rng, "easy", dim=len(p))
    terms = [pi * vi for pi, vi in zip(p, vals)]
    r = sum(terms)
    steps = []
    for i, (pi, vi) in enumerate(zip(p, vals), 1):
        steps.append(f"Term {i}: {num(pi)} * {num(vi)} = {num(terms[i - 1])}")
    steps.append("Add the terms: " + " + ".join(num(t) for t in terms) + f" = {num(r)}")
    return P(f"Compute the expected value: dot of probabilities {vec(p)} with values {vec(vals)}.",
             steps, num(r), f"np.dot(np.array({p}),np.array({vals}))", r)

# ===================================================================== EMIT
LEVELS = ["basic", "easy", "advanced"]
NB_HELPERS = '''import numpy as np, math

def edit_distance(s, t):
    m, n = len(s), len(t)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0] = i
    for j in range(n+1): dp[0][j] = j
    for i in range(1, m+1):
        for j in range(1, n+1):
            c = 0 if s[i-1]==t[j-1] else 1
            dp[i][j] = min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+c)
    return dp[m][n]

print("helpers ready")'''


def gen_all():
    """Generate {fid: {name, level: [problems]}} deterministically."""
    out = []
    for part, fid, name, fn in sorted(FORMULAS, key=lambda x: (x[0], [int(t) for t in x[1].split(".")])):
        seed = int("".join(fid.split("."))) + part * 1000
        rng = np.random.default_rng(seed)
        bylevel = {}
        for lvl in LEVELS:
            probs = []
            for _ in range(5):
                probs.append(fn(lvl, rng))
            bylevel[lvl] = probs
        out.append((part, fid, name, bylevel))
    return out


def verify(all_data):
    """Eval every problem's verify expr and compare to expected. Return list of failures."""
    ns = {"np": np, "math": math}
    exec(NB_HELPERS.replace('print("helpers ready")', ''), ns)
    fails = []
    for part, fid, name, bylevel in all_data:
        for lvl in LEVELS:
            for i, p in enumerate(bylevel[lvl], 1):
                if p["verify"] is None:
                    continue
                try:
                    got = eval(p["verify"], ns)
                    exp = p["expected"]
                    if not np.allclose(np.array(got, dtype=float), np.array(exp, dtype=float), atol=1e-6):
                        fails.append((fid, lvl, i, "mismatch", got, exp))
                except Exception as e:
                    fails.append((fid, lvl, i, f"error: {e}", None, None))
    return fails


def render_md(all_data):
    L = ["# Vector Math Drills — 1,395 hand-solved questions",
         "",
         "For every formula in `vector-math-formulas.md`: 5 basic, 5 easy, and 5 advanced "
         "questions, each solved one step at a time. Companion notebook: "
         "`afp/notebooks/vector-math-drills.ipynb` (checks every answer with numpy).",
         ""]
    labels = {"basic": "Basic", "easy": "Easy", "advanced": "Advanced"}
    for part, fid, name, bylevel in all_data:
        L.append(f"## Formula {fid} — {name}")
        L.append("")
        for lvl in LEVELS:
            for i, p in enumerate(bylevel[lvl], 1):
                L.append(f"**{labels[lvl]} {i}.** {p['q']}")
                L.append("")
                L.append("Solution:")
                for k, s in enumerate(p["steps"], 1):
                    L.append(f"- Step {k}: {s}")
                L.append("")
                L.append(f"**Answer:** {p['answer']}")
                L.append("")
    return "\n".join(L)


def render_nb(all_data):
    cells = []

    def md(t):
        cells.append({"cell_type": "markdown", "metadata": {}, "source": t.splitlines(keepends=True)})

    def code(s):
        cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [],
                      "source": s.splitlines(keepends=True)})

    md("# Vector Math Drills — self-checking notebook\n\n"
       "Every formula from `vector-math-formulas.md` with 5 basic, 5 easy, and 5 advanced "
       "questions. Each formula has a markdown cell with the questions and step-by-step "
       "solutions, followed by a code cell that recomputes and **asserts** every answer.\n\n"
       "Run all cells: each formula prints `Formula X.Y: N checks passed`.")
    code(NB_HELPERS)

    labels = {"basic": "Basic", "easy": "Easy", "advanced": "Advanced"}
    for part, fid, name, bylevel in all_data:
        lines = [f"## Formula {fid} — {name}", ""]
        for lvl in LEVELS:
            for i, p in enumerate(bylevel[lvl], 1):
                lines.append(f"**{labels[lvl]} {i}.** {p['q']}")
                lines.append("")
                lines.append("Solution:")
                for k, s in enumerate(p["steps"], 1):
                    lines.append(f"- Step {k}: {s}")
                lines.append("")
                lines.append(f"**Answer:** {p['answer']}")
                lines.append("")
        md("\n".join(lines))
        # code cell asserting each answer
        clines = [f"# Formula {fid} checks", "n = 0"]
        for lvl in LEVELS:
            for i, p in enumerate(bylevel[lvl], 1):
                if p["verify"] is None:
                    continue
                clines.append(f"assert np.allclose(np.array({p['verify']}, dtype=float), "
                              f"np.array({pylit(p['expected'])}, dtype=float), atol=1e-6), "
                              f"'{fid} {lvl} {i}'")
                clines.append("n += 1")
        clines.append(f"print('Formula {fid}: ' + str(n) + ' checks passed')")
        code("\n".join(clines))

    nb = {"cells": cells,
          "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
                       "language_info": {"name": "python"}},
          "nbformat": 4, "nbformat_minor": 5}
    return nb


def render_app_json(all_data):
    """Compact per-formula data for the app: {fid: {name, basic|easy|advanced: [{q, steps, answer}]}}."""
    out = {}
    for part, fid, name, bylevel in all_data:
        entry = {"name": name}
        for lvl in LEVELS:
            entry[lvl] = [{"q": p["q"], "steps": p["steps"], "answer": str(p["answer"])}
                          for p in bylevel[lvl]]
        out[fid] = entry
    return out


if __name__ == "__main__":
    data = gen_all()
    n_formulas = len(data)
    n_q = sum(len(bl[l]) for _, _, _, bl in data for l in LEVELS)
    print(f"formulas: {n_formulas}, questions: {n_q}")

    fails = verify(data)
    if fails:
        print(f"\n{len(fails)} VERIFICATION FAILURES (showing up to 30):")
        for f in fails[:30]:
            print("  ", f)
    else:
        print("all answers verified against numpy ✓")

    here = os.path.dirname(__file__)
    md_path = os.path.join(here, "..", "vector-math-drills.md")
    nb_path = os.path.join(here, "..", "afp", "notebooks", "vector-math-drills.ipynb")
    json_path = os.path.join(here, "..", "lessons", "vector-drills-data.json")
    with open(md_path, "w") as f:
        f.write(render_md(data))
    with open(nb_path, "w") as f:
        json.dump(render_nb(data), f, indent=1)
    with open(json_path, "w") as f:
        json.dump(render_app_json(data), f, ensure_ascii=False)
    print(f"wrote {md_path}")
    print(f"wrote {nb_path}")
    print(f"wrote {json_path}")
