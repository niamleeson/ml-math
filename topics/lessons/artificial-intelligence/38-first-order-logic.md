# First-order Logic
> **Source:** CS 221 · **Category:** Formula/Concept · **Type:** 🧮 Numeric · [↑ Full reference](../../ai-ml-cheatsheets.md)

## 1. Overview

First-order logic extends propositional logic with objects, predicates, variables, and quantifiers, so one compact sentence can describe many individual facts. Instead of writing a separate propositional rule for every pair of people, first-order logic can write one rule such as “for all $x,y$, if $x$ is a parent of $y$, then $x$ is an ancestor of $y$.”

The central intuition is: **variables make logical knowledge reusable, and unification decides how a reusable rule matches a particular fact.**

## 2. Key Idea

### Syntax: objects, terms, predicates, and formulas

- **Constant symbol**: a name such as $alice$, $bob$, or $Math$ intended to denote an object.  
  **Reading:** “$alice$ names one object in the domain.”

- **Variable**: a symbol such as $x,y,z$ that can range over objects.  
  **Reading:** “$x$ can stand for any object of the right domain.”

- **Term**: a constant, a variable, or a function expression such as $f(x)$ built from terms.  
  **Reading:** “a term denotes an object, possibly after variables are substituted.”

- **Predicate symbol**: a relation name such as $Parent$, $Student$, or $Likes$.  
  **Reading:** “a predicate tests whether a tuple of objects has a property or relationship.”

- **Atomic formula**: a predicate applied to terms, such as $Parent(x,y)$ or $Likes(alice,Math)$.  
  **Reading:** “this relation holds of these terms.”

- **Formula**: an expression built from atomic formulas using connectives such as $\neg,\wedge,\vee,\Rightarrow$ and quantifiers $\forall,\exists$.  
  **Reading:** “a statement that can be true or false under a model.”

### Quantifiers

- **Universal quantifier**

$$
\forall x\, f(x)
$$

  **Reading:** “for every object $x$ in the domain, $f(x)$ is true.”

- **Existential quantifier**

$$
\exists x\, f(x)
$$

  **Reading:** “there is at least one object $x$ in the domain for which $f(x)$ is true.”

### Models and truth

- **Model**: A model $w$ in first-order logic maps:
  - constant symbols to objects
  - predicate symbols to tuple of objects

  **Reading:** “a model tells us what names refer to and which predicate facts are true.”

For example, if the domain is $\{AObj,BObj\}$, the model may map $alice\mapsto AObj$, $bob\mapsto BObj$, and $Parent\mapsto\{(AObj,BObj)\}$. Then $Parent(alice,bob)$ is true and $Parent(bob,alice)$ is false.

### Horn clauses

By noting $x_1,\ldots,x_n$ variables and $a_1,\ldots,a_k,b$ atomic formulas, the first-order logic version of a horn clause has the form:

$$
\forall x_1,\ldots,x_n,\quad (a_1 \wedge \cdots \wedge a_k) \to b.
$$

**Reading:** “for every assignment of the variables, if all premises $a_1,\ldots,a_k$ hold, then the conclusion $b$ holds.”

### Substitution

- **Substitution**: A substitution $\theta$ maps variables to terms and $\operatorname{Subst}(\theta,f)$ denotes the result of substitution $\theta$ on $f$.

For example, if

$$
\theta=\{x/alice,\ y/bob\},
$$

then

$$
\operatorname{Subst}(\theta, Parent(x,y))=Parent(alice,bob).
$$

**Reading:** “replace each variable in the domain of $\theta$ by its assigned term.”

### Unification

- **Unification**: Unification takes two formulas $f$ and $g$ and returns the most general substitution $\theta$ that makes them equal:

$$
\operatorname{Unify}[f,g]=\theta
\quad \textrm{s.t.}\quad
\operatorname{Subst}[\theta,f]=\operatorname{Subst}[\theta,g].
$$

If no such $\theta$ exists, then $\operatorname{Unify}[f,g]$ returns Fail.

**Reading:** “find the least-specialized variable replacements that make two formulas identical.”

The **most general unifier** is preferred because it commits to only the equalities forced by the formulas. For example, for $Parent(x,bob)$ and $Parent(alice,y)$, the most general unifier is

$$
\theta=\{x/alice,\ y/bob\},
$$

not a substitution that adds irrelevant assignments.

### First-order modus ponens

By noting $x_1,\ldots,x_n$ variables, $a_1,\ldots,a_k$ and $a'_1,\ldots,a'_k$ atomic formulas, and by calling

$$
\theta=\operatorname{Unify}(a'_1\wedge\cdots\wedge a'_k,\ a_1\wedge\cdots\wedge a_k),
$$

the first-order logic version of modus ponens can be written:

$$
\frac{a'_1,\ldots,a'_k\quad \forall x_1,\ldots,x_n\,(a_1\wedge\cdots\wedge a_k)\to b}{\operatorname{Subst}[\theta,b]}.
$$

**Reading:** “if known facts can be unified with a rule’s premises, then substitute the same unifier into the rule’s conclusion.”

### Completeness for Horn clauses

- **Completeness**: Modus ponens is complete for first-order logic with only Horn clauses.

**Reading:** “for Horn-clause knowledge bases, every entailed atomic conclusion can be reached by repeated first-order modus ponens.”

### First-order resolution

By noting $f_1,\ldots,f_n$, $g_1,\ldots,g_m$, $p,q$ formulas and by calling

$$
\theta=\operatorname{Unify}(p,q),
$$

the first-order logic version of the resolution rule can be written:

$$
\frac{f_1\vee\cdots\vee f_n\vee p,\quad \neg q\vee g_1\vee\cdots\vee g_m}{\operatorname{Subst}[\theta,\ f_1\vee\cdots\vee f_n\vee g_1\vee\cdots\vee g_m]}.
$$

**Reading:** “if one clause contains $p$ and another contains a negated formula $\neg q$ that unifies with it, cancel the complementary pair and substitute the unifier into the remaining literals.”

### Semi-decidability

- **Semi-decidability**: First-order logic, even restricted to only Horn clauses, is semi-decidable.
  - if $\textrm{KB}\models f$, forward inference on complete inference rules will prove $f$ in finite time
  - if $\textrm{KB}\not\models f$, no algorithm can show this in finite time

**Reading:** “entailed facts can eventually be found, but non-entailed facts may make proof search run forever.”

## 3. Worked Examples

### 🟡 Easy

#### E1. Interpret a model with constants and predicates

**Problem.** Let the domain be

$$
D=\{AObj,BObj\}.
$$

The model $w$ maps constants and predicates as follows:

| Symbol | Model interpretation |
|---|---|
| $alice$ | $AObj$ |
| $bob$ | $BObj$ |
| $Parent$ | $\{(AObj,BObj)\}$ |

Decide whether $Parent(alice,bob)$ and $Parent(bob,alice)$ are true.

**Solution.**

First read the constant-symbol mapping.

$$
w(alice)=AObj,\qquad w(bob)=BObj.
$$

Now evaluate the first atomic formula.

$$
Parent(alice,bob)
$$

means the tuple

$$
(w(alice),w(bob))=(AObj,BObj)
$$

must belong to the predicate interpretation $w(Parent)$.

Since

$$
w(Parent)=\{(AObj,BObj)\},
$$

we have

$$
(AObj,BObj)\in w(Parent).
$$

Therefore,

$$
Parent(alice,bob)\textrm{ is true.}
$$

Now evaluate the second atomic formula.

$$
Parent(bob,alice)
$$

means the tuple

$$
(w(bob),w(alice))=(BObj,AObj)
$$

must belong to $w(Parent)$.

But

$$
(BObj,AObj)\notin \{(AObj,BObj)\}.
$$

Therefore,

$$
Parent(bob,alice)\textrm{ is false.}
$$

So the final truth values are

$$
\boxed{Parent(alice,bob)=\textrm{true},\qquad Parent(bob,alice)=\textrm{false}.}
$$

#### E2. Evaluate universal and existential statements

**Problem.** The domain is

$$
D=\{alice,bob\}.
$$

The true ground facts are

$$
Student(alice),\qquad Student(bob),\qquad Likes(alice,Math).
$$

Any ground atom not listed is false. Evaluate:

1. $\forall x\, \bigl(Student(x)\Rightarrow Likes(x,Math)\bigr)$
2. $\exists x\, Likes(x,Math)$

**Solution.**

For the universal statement, test every object in the domain.

$$
\forall x\, \bigl(Student(x)\Rightarrow Likes(x,Math)\bigr)
$$

means both substitutions $x/alice$ and $x/bob$ must make the implication true.

| $x$ | $Student(x)$ | $Likes(x,Math)$ | $Student(x)\Rightarrow Likes(x,Math)$ |
|---|---|---|---|
| $alice$ | true | true | true |
| $bob$ | true | false | false |

For $x=alice$,

$$
Student(alice)\Rightarrow Likes(alice,Math)
=\textrm{true}\Rightarrow\textrm{true}
=\textrm{true}.
$$

For $x=bob$,

$$
Student(bob)\Rightarrow Likes(bob,Math)
=\textrm{true}\Rightarrow\textrm{false}
=\textrm{false}.
$$

Because a universal statement must hold for every domain object and it fails for $bob$,

$$
\forall x\, \bigl(Student(x)\Rightarrow Likes(x,Math)\bigr)
\textrm{ is false.}
$$

For the existential statement,

$$
\exists x\, Likes(x,Math)
$$

we need at least one domain object that likes $Math$.

| $x$ | $Likes(x,Math)$ |
|---|---|
| $alice$ | true |
| $bob$ | false |

Since $Likes(alice,Math)$ is true, $alice$ is a witness for the existential statement.

Therefore,

$$
\boxed{
\forall x\, (Student(x)\Rightarrow Likes(x,Math))=\textrm{false},
\qquad
\exists x\, Likes(x,Math)=\textrm{true}.
}
$$

#### E3. Apply a substitution to a formula

**Problem.** Let

$$
\theta=\{x/alice,\ y/bob\}.
$$

Compute

$$
\operatorname{Subst}\bigl(\theta,\ Parent(x,y)\Rightarrow Ancestor(x,y)\bigr).
$$

**Solution.**

Start with the formula:

$$
f=Parent(x,y)\Rightarrow Ancestor(x,y).
$$

The substitution says:

$$
x\mapsto alice,\qquad y\mapsto bob.
$$

Apply $\theta$ to the premise $Parent(x,y)$:

$$
\operatorname{Subst}(\theta,Parent(x,y))=Parent(alice,bob).
$$

Apply $\theta$ to the conclusion $Ancestor(x,y)$:

$$
\operatorname{Subst}(\theta,Ancestor(x,y))=Ancestor(alice,bob).
$$

Now substitute both pieces back into the implication:

$$
\operatorname{Subst}\bigl(\theta,\ Parent(x,y)\Rightarrow Ancestor(x,y)\bigr)
=Parent(alice,bob)\Rightarrow Ancestor(alice,bob).
$$

The before/after table is:

| Part | Before substitution | After applying $\theta=\{x/alice,\ y/bob\}$ |
|---|---|---|
| Premise | $Parent(x,y)$ | $Parent(alice,bob)$ |
| Conclusion | $Ancestor(x,y)$ | $Ancestor(alice,bob)$ |
| Whole formula | $Parent(x,y)\Rightarrow Ancestor(x,y)$ | $Parent(alice,bob)\Rightarrow Ancestor(alice,bob)$ |

Thus,

$$
\boxed{\operatorname{Subst}\bigl(\theta,\ Parent(x,y)\Rightarrow Ancestor(x,y)\bigr)
=Parent(alice,bob)\Rightarrow Ancestor(alice,bob).}
$$

#### E4. Find a most general unifier

**Problem.** Find

$$
\operatorname{Unify}\bigl[Parent(x,bob),\ Parent(alice,y)\bigr].
$$

Show every equality constraint and verify the result.

**Solution.**

The two formulas have the same predicate symbol $Parent$ and the same arity $2$, so unification reduces to matching their corresponding arguments.

Write the argument constraints:

$$
Parent(x,bob)=Parent(alice,y)
$$

requires

$$
x=alice
$$

and

$$
bob=y.
$$

The first constraint gives the substitution piece

$$
x/alice.
$$

The second constraint gives the substitution piece

$$
y/bob.
$$

No other variables or terms are constrained. Therefore the candidate unifier is

$$
\theta=\{x/alice,\ y/bob\}.
$$

Now check both formulas after substitution:

$$
\operatorname{Subst}(\theta,Parent(x,bob))=Parent(alice,bob),
$$

and

$$
\operatorname{Subst}(\theta,Parent(alice,y))=Parent(alice,bob).
$$

The substituted formulas are identical:

$$
Parent(alice,bob)=Parent(alice,bob).
$$

Because the substitution only assigns values forced by the constraints, it is the most general unifier.

Hence,

$$
\boxed{\operatorname{Unify}\bigl[Parent(x,bob),\ Parent(alice,y)\bigr]=\{x/alice,\ y/bob\}.}
$$

#### E5. One first-order modus ponens step

**Problem.** The knowledge base contains the rule

$$
\forall x\, \bigl(Student(x)\Rightarrow Person(x)\bigr)
$$

and the fact

$$
Student(alice).
$$

Use first-order modus ponens to derive a new fact.

**Solution.**

Identify the rule premise and conclusion.

$$
a_1=Student(x),\qquad b=Person(x).
$$

Identify the known fact to match against the premise.

$$
a'_1=Student(alice).
$$

Compute the unifier:

$$
\theta=\operatorname{Unify}\bigl(Student(alice),Student(x)\bigr).
$$

The predicate symbols match, so match their arguments:

$$
alice=x.
$$

Thus,

$$
\theta=\{x/alice\}.
$$

First-order modus ponens says:

$$
\frac{Student(alice)\quad \forall x\,(Student(x)\Rightarrow Person(x))}
{\operatorname{Subst}[\theta,Person(x)]}.
$$

Now apply the substitution to the conclusion:

$$
\operatorname{Subst}(\{x/alice\},Person(x))=Person(alice).
$$

Therefore, the derived fact is

$$
\boxed{Person(alice).}
$$

### 🔴 Advanced

#### A1. Multi-premise Horn inference

**Problem.** The knowledge base contains these universally quantified Horn rules:

$$
\forall x,y\, \bigl(Parent(x,y)\Rightarrow Ancestor(x,y)\bigr)
$$

and

$$
\forall x,y,z\, \bigl(Parent(x,y)\wedge Ancestor(y,z)\Rightarrow Ancestor(x,z)\bigr).
$$

It also contains the facts

$$
Parent(alice,bob),\qquad Parent(bob,cara).
$$

Use repeated first-order modus ponens to derive $Ancestor(alice,cara)$.

**Solution.**

First use the direct-parent rule:

$$
\forall x,y\, \bigl(Parent(x,y)\Rightarrow Ancestor(x,y)\bigr).
$$

Match its premise $Parent(x,y)$ against the fact $Parent(alice,bob)$.

The unification problem is

$$
\operatorname{Unify}\bigl[Parent(alice,bob),Parent(x,y)\bigr].
$$

Matching arguments gives

$$
x=alice,\qquad y=bob.
$$

So

$$
\theta_1=\{x/alice,\ y/bob\}.
$$

Apply $\theta_1$ to the conclusion $Ancestor(x,y)$:

$$
\operatorname{Subst}(\theta_1,Ancestor(x,y))=Ancestor(alice,bob).
$$

Thus we derive

$$
Ancestor(alice,bob).
$$

Now use the same direct-parent rule on $Parent(bob,cara)$.

The unification problem is

$$
\operatorname{Unify}\bigl[Parent(bob,cara),Parent(x,y)\bigr].
$$

Matching arguments gives

$$
x=bob,\qquad y=cara,
$$

so

$$
\theta_2=\{x/bob,\ y/cara\}.
$$

Apply $\theta_2$ to the conclusion:

$$
\operatorname{Subst}(\theta_2,Ancestor(x,y))=Ancestor(bob,cara).
$$

Thus we derive

$$
Ancestor(bob,cara).
$$

Now use the recursive ancestor rule:

$$
\forall x,y,z\, \bigl(Parent(x,y)\wedge Ancestor(y,z)\Rightarrow Ancestor(x,z)\bigr).
$$

Its premises are

$$
a_1=Parent(x,y),\qquad a_2=Ancestor(y,z),
$$

and its conclusion is

$$
b=Ancestor(x,z).
$$

We want to match the two known facts

$$
a'_1=Parent(alice,bob),\qquad a'_2=Ancestor(bob,cara)
$$

against the rule premises:

$$
\operatorname{Unify}\bigl[
Parent(alice,bob)\wedge Ancestor(bob,cara),\ 
Parent(x,y)\wedge Ancestor(y,z)
\bigr].
$$

Match the first pair of atoms:

$$
Parent(alice,bob)=Parent(x,y).
$$

This gives

$$
x=alice,\qquad y=bob.
$$

So far,

$$
\theta=\{x/alice,\ y/bob\}.
$$

Apply this partial substitution to the second rule premise:

$$
Ancestor(y,z)\quad \xrightarrow{\theta}\quad Ancestor(bob,z).
$$

Now match the second known fact:

$$
Ancestor(bob,cara)=Ancestor(bob,z).
$$

The first arguments already match:

$$
bob=bob.
$$

The second arguments give

$$
z=cara.
$$

Therefore the full unifier is

$$
\theta_3=\{x/alice,\ y/bob,\ z/cara\}.
$$

Apply $\theta_3$ to the recursive rule conclusion:

$$
\operatorname{Subst}(\theta_3,Ancestor(x,z))=Ancestor(alice,cara).
$$

The inference chain is:

$$
Parent(alice,bob)\Rightarrow Ancestor(alice,bob),
$$

$$
Parent(bob,cara)\Rightarrow Ancestor(bob,cara),
$$

and

$$
Parent(alice,bob)\wedge Ancestor(bob,cara)\Rightarrow Ancestor(alice,cara).
$$

Thus,

$$
\boxed{Ancestor(alice,cara).}
$$

#### A2. Detect unification failure

**Problem.** For each pair, decide whether unification succeeds or fails.

1. $Parent(x,x)$ and $Parent(alice,bob)$
2. $Knows(x,f(x))$ and $Knows(g(y),y)$

For the second pair, use the occurs-check idea explicitly: a variable cannot be replaced by a term containing that same variable.

**Solution.**

**Pair 1: $Parent(x,x)$ versus $Parent(alice,bob)$.**

The predicate symbols match, so compare arguments:

$$
Parent(x,x)=Parent(alice,bob)
$$

requires

$$
x=alice
$$

and

$$
x=bob.
$$

From the first constraint,

$$
\theta_1=\{x/alice\}.
$$

Apply this substitution to the second constraint $x=bob$:

$$
\operatorname{Subst}(\theta_1,x)=alice.
$$

So the second constraint becomes

$$
alice=bob.
$$

Since $alice$ and $bob$ are distinct constant symbols, this equality fails. Therefore,

$$
\operatorname{Unify}\bigl[Parent(x,x),Parent(alice,bob)\bigr]=Fail.
$$

**Pair 2: $Knows(x,f(x))$ versus $Knows(g(y),y)$.**

The predicate symbols match, so compare arguments:

$$
Knows(x,f(x))=Knows(g(y),y)
$$

requires

$$
x=g(y)
$$

and

$$
f(x)=y.
$$

From the first constraint,

$$
\theta_2=\{x/g(y)\}.
$$

Apply $\theta_2$ to the remaining constraint:

$$
f(x)=y
$$

becomes

$$
f(g(y))=y.
$$

Equivalently, this asks for

$$
y=f(g(y)).
$$

But the term $f(g(y))$ contains $y$ inside itself. The occurs-check rejects a substitution of the form

$$
y/f(g(y)),
$$

because it would define $y$ recursively in terms of a larger term containing $y$:

$$
y=f(g(y))=f(g(f(g(y))))=\cdots.
$$

So the second unification also fails.

Therefore,

$$
\boxed{
\operatorname{Unify}[Parent(x,x),Parent(alice,bob)]=Fail,
\qquad
\operatorname{Unify}[Knows(x,f(x)),Knows(g(y),y)]=Fail.
}
$$

#### A3. First-order resolution proof

**Problem.** Use first-order resolution to prove $Mortal(socrates)$ from the clauses:

$$
Human(socrates),
$$

$$
\neg Human(x)\vee Mortal(x).
$$

Use proof by contradiction by adding the negated query

$$
\neg Mortal(socrates).
$$

Derive the empty clause.

**Solution.**

List the clauses:

$$
C_1=Human(socrates),
$$

$$
C_2=\neg Human(x)\vee Mortal(x),
$$

$$
C_3=\neg Mortal(socrates).
$$

Resolve $C_1$ with $C_2$.

The complementary literals are

$$
p=Human(socrates)
$$

and

$$
q=Human(x),
$$

because $C_2$ contains $\neg Human(x)$.

Compute the unifier:

$$
\theta_1=\operatorname{Unify}\bigl[Human(socrates),Human(x)\bigr].
$$

The predicate symbols match, so match arguments:

$$
socrates=x.
$$

Thus,

$$
\theta_1=\{x/socrates\}.
$$

The resolution rule cancels $Human(socrates)$ with $\neg Human(x)$ and keeps the remaining literal from $C_2$:

$$
\operatorname{Subst}(\theta_1,Mortal(x))=Mortal(socrates).
$$

So the first resolvent is

$$
C_4=Mortal(socrates).
$$

Now resolve $C_4$ with $C_3$.

The complementary literals are

$$
p=Mortal(socrates)
$$

and

$$
q=Mortal(socrates).
$$

The unifier is the empty substitution:

$$
\theta_2=\operatorname{Unify}\bigl[Mortal(socrates),Mortal(socrates)\bigr]=\{\}.
$$

There are no remaining literals after canceling $Mortal(socrates)$ with $\neg Mortal(socrates)$. Therefore the resolvent is the empty clause:

$$
\Box.
$$

The resolution chain is

$$
Human(socrates),\quad \neg Human(x)\vee Mortal(x)
\quad \Longrightarrow_{\{x/socrates\}}\quad
Mortal(socrates),
$$

and

$$
Mortal(socrates),\quad \neg Mortal(socrates)
\quad \Longrightarrow_{\{\}}\quad
\Box.
$$

Because adding the negated query produces a contradiction, the original knowledge base entails the query:

$$
\boxed{Mortal(socrates).}
$$

#### A4. Standardize variables apart before inference

**Problem.** Consider these two rules, both written with the variable name $x$:

$$
R_1:\ \forall x\, \bigl(Cat(x)\Rightarrow Mammal(x)\bigr),
$$

$$
R_2:\ \forall x\, \bigl(Mammal(x)\Rightarrow Animal(x)\bigr).
$$

The knowledge base also contains

$$
Cat(luna).
$$

Derive $Animal(luna)$, first standardizing variables apart so the two rules do not accidentally share the same variable.

**Solution.**

The two occurrences of $x$ are bound by different quantifiers. They are not the same variable, even though they use the same printed name.

Standardize variables apart:

$$
R_1':\ \forall u\, \bigl(Cat(u)\Rightarrow Mammal(u)\bigr),
$$

$$
R_2':\ \forall v\, \bigl(Mammal(v)\Rightarrow Animal(v)\bigr).
$$

Now use $R_1'$ with the fact $Cat(luna)$.

The premise of $R_1'$ is

$$
Cat(u).
$$

Compute the unifier:

$$
\theta_1=\operatorname{Unify}\bigl[Cat(luna),Cat(u)\bigr].
$$

Matching arguments gives

$$
luna=u,
$$

so

$$
\theta_1=\{u/luna\}.
$$

Apply $\theta_1$ to the conclusion of $R_1'$:

$$
\operatorname{Subst}(\theta_1,Mammal(u))=Mammal(luna).
$$

Thus we derive

$$
Mammal(luna).
$$

Now use $R_2'$ with the newly derived fact $Mammal(luna)$.

The premise of $R_2'$ is

$$
Mammal(v).
$$

Compute the unifier:

$$
\theta_2=\operatorname{Unify}\bigl[Mammal(luna),Mammal(v)\bigr].
$$

Matching arguments gives

$$
luna=v,
$$

so

$$
\theta_2=\{v/luna\}.
$$

Apply $\theta_2$ to the conclusion of $R_2'$:

$$
\operatorname{Subst}(\theta_2,Animal(v))=Animal(luna).
$$

The full derivation is:

$$
Cat(luna)
\xRightarrow{R_1',\ \{u/luna\}}
Mammal(luna)
\xRightarrow{R_2',\ \{v/luna\}}
Animal(luna).
$$

The standardization table is:

| Original rule | Standardized rule | Substitution used |
|---|---|---|
| $\forall x\,(Cat(x)\Rightarrow Mammal(x))$ | $\forall u\,(Cat(u)\Rightarrow Mammal(u))$ | $\{u/luna\}$ |
| $\forall x\,(Mammal(x)\Rightarrow Animal(x))$ | $\forall v\,(Mammal(v)\Rightarrow Animal(v))$ | $\{v/luna\}$ |

Therefore,

$$
\boxed{Animal(luna).}
$$

#### A5. Semi-decidability in a recursive rule set

**Problem.** Let the knowledge base contain the fact

$$
Next(a)
$$

and the universally quantified Horn rule

$$
\forall x\, \bigl(Next(x)\Rightarrow Next(f(x))\bigr).
$$

Consider the two queries:

$$
Q_1=Next(f(f(a)))
$$

and

$$
Q_2=Other(a).
$$

Use forward inference to explain why $Q_1$ is found in finite time, but a proof search for $Q_2$ may not halt.

**Solution.**

Start with the known fact:

$$
Next(a).
$$

The rule is

$$
\forall x\, \bigl(Next(x)\Rightarrow Next(f(x))\bigr).
$$

First apply the rule to $Next(a)$.

Unify the known fact with the rule premise:

$$
\theta_1=\operatorname{Unify}\bigl[Next(a),Next(x)\bigr].
$$

Matching arguments gives

$$
a=x,
$$

so

$$
\theta_1=\{x/a\}.
$$

Apply $\theta_1$ to the rule conclusion:

$$
\operatorname{Subst}(\theta_1,Next(f(x)))=Next(f(a)).
$$

Thus forward inference derives

$$
Next(f(a)).
$$

Apply the rule again to $Next(f(a))$.

Compute the unifier:

$$
\theta_2=\operatorname{Unify}\bigl[Next(f(a)),Next(x)\bigr].
$$

Matching arguments gives

$$
f(a)=x,
$$

so

$$
\theta_2=\{x/f(a)\}.
$$

Apply $\theta_2$ to the conclusion:

$$
\operatorname{Subst}(\theta_2,Next(f(x)))=Next(f(f(a))).
$$

Therefore,

$$
Q_1=Next(f(f(a)))
$$

is derived after two rule applications.

The proof frontier begins:

| Step | Fact used as $Next(x)$ | Substitution | New fact |
|---:|---|---|---|
| $0$ | given | — | $Next(a)$ |
| $1$ | $Next(a)$ | $\{x/a\}$ | $Next(f(a))$ |
| $2$ | $Next(f(a))$ | $\{x/f(a)\}$ | $Next(f(f(a)))$ |
| $3$ | $Next(f(f(a)))$ | $\{x/f(f(a))\}$ | $Next(f(f(f(a))))$ |
| $\cdots$ | $\cdots$ | $\cdots$ | $\cdots$ |

So for $Q_1$, forward inference eventually reaches the query:

$$
\boxed{Next(f(f(a)))\textrm{ is proved in finite time.}}
$$

Now consider

$$
Q_2=Other(a).
$$

No fact in the knowledge base has predicate symbol $Other$, and no rule concludes an atom with predicate symbol $Other$. Forward inference can still keep generating infinitely many $Next$ facts:

$$
Next(a),\ Next(f(a)),\ Next(f(f(a))),\ Next(f(f(f(a)))),\ldots
$$

At every finite stage, the search has not derived $Other(a)$. But if the proof procedure only searches by generating consequences, it may continue expanding the infinite chain of $Next$ facts forever rather than halting with a definitive “not entailed” answer.

This illustrates semi-decidability:

- If $\textrm{KB}\models f$, complete forward inference will prove $f$ in finite time.
- If $\textrm{KB}\not\models f$, no algorithm can show this in finite time in general.

For this knowledge base,

$$
\boxed{
Q_1\textrm{ is found in finite time, while proof search for }Q_2\textrm{ may not halt.}
}
$$
