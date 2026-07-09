# Vector Math Formulas — a complete, readable cheat sheet

Plain-text formulas (no hard-to-read symbols), each with a tiny worked example you can
trace by hand. These are the vector operations behind embeddings, similarity search,
clustering, and most of ML.

Throughout we reuse two example vectors so the numbers are easy to follow:

```
a = [3, 4]
b = [4, 3]

norm(a) = sqrt(3*3 + 4*4) = sqrt(25) = 5
norm(b) = sqrt(4*4 + 3*3) = sqrt(25) = 5
dot(a, b) = 3*4 + 4*3 = 12 + 12 = 24
```

Notation:
- `norm(v)`  = length of vector v (L2 norm unless said otherwise)
- `dot(a, b)` = dot product of a and b
- `sqrt(x)`  = square root, `^2` = squared, `*` = multiply
- `|x|`      = absolute value
- `v_hat`    = the unit-length version of v (length 1)
- `~`        = "approximately equals"

---

# Part 1 — Building blocks

## 1.1 Vector addition (component-wise)
```
a + b = [a1+b1, a2+b2, ..., an+bn]
```
Example: `a + b = [3+4, 4+3] = [7, 7]`. Geometrically: place b's tail at a's head.

## 1.2 Vector subtraction
```
a - b = [a1-b1, a2-b2, ..., an-bn]
```
Example: `a - b = [-1, 1]`. The arrow that points from b to a.

## 1.3 Scalar multiplication (stretch / shrink / flip)
```
k * v = [k*v1, k*v2, ..., k*vn]
```
Example: `2 * a = [6, 8]` (twice as long, same direction). `-1 * a = [-3, -4]` (flipped).

## 1.4 Zero vector
```
0 = [0, 0, ..., 0]
```
Has length 0 and no direction. You cannot normalize it (division by zero).

## 1.5 Linear combination
```
c1*v1 + c2*v2 + ... + ck*vk
```
Example: `2*[1,0] + 3*[0,1] = [2, 3]`. Every vector is a linear combination of the
standard basis vectors [1,0] and [0,1].

## 1.6 Weighted average (convex combination)
```
w1*v1 + w2*v2 + ... + wk*vk       where the weights w add up to 1
```
Example: `0.25*[0,0] + 0.75*[4,4] = [3, 3]`. Stays "between" the inputs.

---

# Part 2 — Norm (length / size)

## 2.1 L2 norm (Euclidean length) — the default
```
norm(v) = sqrt( v1^2 + v2^2 + ... + vn^2 )
```
Example, v = [8, 6]: `sqrt(64 + 36) = sqrt(100) = 10`. The Pythagorean length of the arrow.

## 2.2 Norm is the dot product with itself
```
norm(v) = sqrt( dot(v, v) )
```
Example: `dot(a, a) = 9 + 16 = 25`, `sqrt(25) = 5`.

## 2.3 Squared L2 norm (skip the square root)
```
norm(v)^2 = dot(v, v) = v1^2 + v2^2 + ...
```
Example: `norm(a)^2 = 25`. Used in k-means and losses to avoid computing sqrt.

## 2.4 Scaling rule
```
norm(k * v) = |k| * norm(v)
```
Example: `norm(10 * [3,4]) = norm([30,40]) = 50 = 10 * 5`. A longer vector = bigger norm.

## 2.5 L1 norm (taxicab / Manhattan length)
```
norm_L1(v) = |v1| + |v2| + ... + |vn|
```
Example, v = [8, 6]: `8 + 6 = 14`. Distance walking along a grid.

## 2.6 L-infinity norm (Chebyshev / max)
```
norm_Linf(v) = max( |v1|, |v2|, ..., |vn| )
```
Example, v = [8, 6]: `max(8, 6) = 8`. The largest single component.

## 2.7 Lp norm (the general family)
```
norm_Lp(v) = ( |v1|^p + |v2|^p + ... )^(1/p)
```
p=1 gives L1, p=2 gives L2, p=infinity gives the max norm.

---

# Part 3 — Dot product

## 3.1 Coordinate form (how you compute it)
```
dot(a, b) = a1*b1 + a2*b2 + ... + an*bn
```
Example: `dot(a, b) = 3*4 + 4*3 = 24`. Multiply matching parts, add.

## 3.2 Geometric form (what it means)
```
dot(a, b) = norm(a) * norm(b) * cos(angle between a and b)
```
Example: `5 * 5 * 0.96 = 24`. "Length times length times how-aligned."

## 3.3 Dot with itself = length squared
```
dot(v, v) = norm(v)^2
```
Example: `dot(a, a) = 25 = 5^2`.

## 3.4 Dot with a unit vector = projection length
```
dot(a, b_hat) = how far a reaches along b's direction
```
Example: `b_hat = [0.8, 0.6]`, `dot(a, b_hat) = 3*0.8 + 4*0.6 = 4.8`.

## 3.5 Algebra rules (handy identities)
```
dot(a, b)     = dot(b, a)                 order does not matter
dot(a, b + c) = dot(a, b) + dot(a, c)     distributes over addition
dot(k*a, b)   = k * dot(a, b)             scalars pull out
```

---

# Part 4 — Similarity and angle

## 4.1 Cosine similarity (pure angle, length removed)
```
cosine(a, b) = dot(a, b) / ( norm(a) * norm(b) ) = cos(angle)
```
Example: `24 / (5*5) = 0.96`. Range: -1 (opposite) .. 0 (unrelated) .. +1 (same direction).
The norms cancel (top and bottom), so only the angle survives.

## 4.2 Cosine distance (a "smaller = closer" version)
```
cosine_distance(a, b) = 1 - cosine(a, b)
```
Example: `1 - 0.96 = 0.04`. 0 = identical direction, 2 = opposite.

## 4.3 Angle from cosine
```
angle = arccos( cosine(a, b) )
```
Example: `arccos(0.96) ~ 16 degrees`.

## 4.4 Cauchy-Schwarz inequality (why cosine stays in -1..+1)
```
| dot(a, b) |  <=  norm(a) * norm(b)
```
Example: `|24| = 24 <= 25`. Divide both sides by the norms and cosine is between -1 and 1.

---

# Part 5 — Normalization and standardization

## 5.1 Normalize to unit length
```
v_hat = v / norm(v)
```
Example, v = [8,6], norm 10: `[0.8, 0.6]`, and `norm([0.8,0.6]) = 1`. Keeps direction,
sets length to 1. After this, dot product equals cosine.

## 5.2 Dot of two unit vectors = cosine
```
dot(a_hat, b_hat) = cosine(a, b)
```
Because both lengths are 1: `1 * 1 * cos(angle) = cos(angle)`.

## 5.3 Mean-centering (subtract the average)
```
v_centered = v - mean(v)      (subtract the average of v's own entries)
```
Example, v = [8, 6], mean = 7: `[1, -1]`. Moves the data so its center is at the origin.

## 5.4 Standardization (z-score: center, then scale to unit spread)
```
z = (v - mean) / standard_deviation
```
Puts features on the same scale so no single feature dominates by units alone.

---

# Part 6 — Distance

## 6.1 Euclidean (L2) distance
```
distance(a, b) = norm(a - b) = sqrt( (a1-b1)^2 + (a2-b2)^2 + ... )
```
Example: `a - b = [-1, 1]`, `sqrt(1 + 1) = 1.41`. Straight-line distance.

## 6.2 Squared Euclidean distance (skip sqrt)
```
distance(a, b)^2 = (a1-b1)^2 + (a2-b2)^2 + ...
```
Example: `1 + 1 = 2`. Same ranking as distance, cheaper to compute (k-means uses this).

## 6.3 Manhattan (L1) distance
```
distance_L1(a, b) = |a1-b1| + |a2-b2| + ...
```
Example: `|-1| + |1| = 2`. Grid-walking distance.

## 6.4 Chebyshev (L-infinity) distance
```
distance_Linf(a, b) = max( |a1-b1|, |a2-b2|, ... )
```
Example: `max(1, 1) = 1`. The biggest single-coordinate gap.

## 6.5 Minkowski distance (general Lp)
```
distance_Lp(a, b) = ( |a1-b1|^p + |a2-b2|^p + ... )^(1/p)
```
p=1 gives Manhattan, p=2 gives Euclidean.

## 6.6 Metric properties (what makes a valid distance)
```
distance(a, b) >= 0                              never negative
distance(a, b) = 0  only if  a = b               zero only for the same point
distance(a, b) = distance(b, a)                  symmetric
distance(a, c) <= distance(a, b) + distance(b, c) triangle inequality
```

---

# Part 7 — The bridges (formulas that connect the others)

## 7.1 Law of cosines (distance <-> dot product)
```
distance(a, b)^2 = norm(a)^2 + norm(b)^2 - 2 * dot(a, b)
```
Example: `25 + 25 - 2*24 = 2` (matches distance^2 = 2). Most other formulas fall out of this.

## 7.2 On the unit sphere, distance and cosine agree
If a and b are normalized (length 1):
```
distance^2 = 2 - 2 * cosine
```
Smaller distance = bigger cosine. This is why vector databases normalize, then use fast
distance search to do cosine search.

## 7.3 Polarization identity (dot product from lengths only)
```
dot(a, b) = ( norm(a + b)^2 - norm(a)^2 - norm(b)^2 ) / 2
```
Lets you recover the dot product if you only know lengths.

## 7.4 Parallelogram law
```
norm(a + b)^2 + norm(a - b)^2 = 2*norm(a)^2 + 2*norm(b)^2
```
Example: `norm([7,7])^2 + norm([-1,1])^2 = 98 + 2 = 100 = 2*25 + 2*25`.

---

# Part 8 — Projection and orthogonality

## 8.1 Projection length (scalar: a's shadow on b)
```
projection_length = dot(a, b) / norm(b)
```
Example: `24 / 5 = 4.8`.

## 8.2 Projection vector (the shadow itself)
```
projection_vector = ( dot(a, b) / dot(b, b) ) * b
```
Example: `(24 / 25) * [4,3] = [3.84, 2.88]`. Used to remove a direction from an embedding.

## 8.3 Orthogonal decomposition (split a into "along b" + "perpendicular to b")
```
a = projection_vector + perpendicular_part
perpendicular_part = a - projection_vector
```

## 8.4 Orthogonality (perpendicular = unrelated)
```
a and b are orthogonal  <=>  dot(a, b) = 0
```
A dot of 0 means a 90-degree angle: independent directions, cosine 0.

---

# Part 9 — Other vector products

## 9.1 Hadamard product (element-wise multiply)
```
a (*) b = [a1*b1, a2*b2, ..., an*bn]
```
Example: `[3,4] (*) [4,3] = [12, 12]`. Common in neural-net gating/masks.

## 9.2 Outer product (makes a matrix)
```
outer(a, b)[i][j] = ai * bj
```
Example, a=[3,4], b=[4,3]:
```
[ 3*4  3*3 ]   [ 12  9  ]
[ 4*4  4*3 ] = [ 16  12 ]
```

## 9.3 Cross product (3D only) — a vector perpendicular to both
```
norm(a x b) = norm(a) * norm(b) * sin(angle) = area of the parallelogram
```
Points perpendicular to the plane of a and b (right-hand rule).

---

# Part 10 — Connection to statistics

## 10.1 Mean / centroid of a set of vectors
```
mean(v1, ..., vk) = (v1 + v2 + ... + vk) / k
```
Example, mean of [2,0], [0,2], [4,4]: `[6,6]/3 = [2,2]`. Cluster centers and averaged
word vectors are just this.

## 10.2 Pearson correlation = cosine of mean-centered vectors
```
correlation(a, b) = cosine( a - mean(a), b - mean(b) )
```
Correlation is literally the cosine similarity after centering. Very cool bridge from
statistics to geometry.

## 10.3 Variance = squared norm of the centered vector / n
```
variance(v) = norm(v - mean(v))^2 / n
```

## 10.4 Covariance = dot product of centered vectors / n
```
covariance(a, b) = dot( a - mean(a), b - mean(b) ) / n
```

---

# Part 11 — Geometry operations

## 11.1 Linear interpolation (blend two vectors)
```
lerp(a, b, t) = (1 - t) * a + t * b        t goes 0 -> 1
```
Example, t = 0.5: `0.5*[3,4] + 0.5*[4,3] = [3.5, 3.5]`. The midpoint at t=0.5.

## 11.2 Spherical interpolation (slerp, for unit vectors)
Blends two directions along the sphere (constant-angle steps) instead of a straight line.
Used to interpolate between normalized embeddings smoothly.

## 11.3 2D rotation by angle t
```
x_new = x*cos(t) - y*sin(t)
y_new = x*sin(t) + y*cos(t)
```
Turns a vector by angle t without changing its length.

## 11.4 Reflection across a unit direction u
```
reflect(v) = 2 * dot(v, u) * u - v
```
Mirror image of v about the line through u.

---

# Part 12 — Inequalities (bounds worth knowing)

## 12.1 Triangle inequality (a detour is never shorter)
```
norm(a + b)  <=  norm(a) + norm(b)
```
Example: `norm([7,7]) = 9.9 <= 5 + 5 = 10`.

## 12.2 Cauchy-Schwarz (dot is bounded by the norms)
```
| dot(a, b) |  <=  norm(a) * norm(b)
```
Example: `24 <= 25`.

---

# Part 13 — Common ML uses (putting it together)

## 13.1 Nearest neighbor search
```
best match = the item with the largest cosine(query, item)
           = the item with the smallest distance(query, item)   (on unit vectors these agree)
```

## 13.2 Analogies (meaning as direction)
```
king - man + woman  ~  queen
Paris - France + Italy  ~  Rome
```
Add and subtract concepts because embeddings store meaning as direction.

## 13.3 Softmax (turn a score vector into probabilities)
```
softmax(v)[i] = exp(vi) / ( exp(v1) + exp(v2) + ... + exp(vn) )
```
Example, v = [2, 0]: `exp(2) / (exp(2)+exp(0)) = 7.39 / 8.39 ~ 0.88`, other ~ 0.12.
Outputs are positive and add up to 1.

## 13.4 Sentence embedding by averaging word vectors
```
sentence_vector = mean( word_vector(w) for each word w )
```
The simplest text encoder — average, then normalize, then compare by cosine.

---

# The through-line

Almost everything here comes from ONE formula:

```
dot(a, b) = norm(a) * norm(b) * cos(angle)
```

plus its self-version `norm(v) = sqrt(dot(v, v))`. From those two you can derive cosine,
distance, the distance-cosine bridge, projection, orthogonality, angles, correlation, and
more. It is really one idea — the dot product — wearing many hats.
