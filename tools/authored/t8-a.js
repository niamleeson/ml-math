module.exports = {
  "math-08-01": {
    "id": "math-08-01",
    "title": "Floating-point representation (IEEE 754)",
    "tagline": "Floating-point numbers are scientific notation for computers: wide in range, finite in detail.",
    "connections": {
      "buildsOn": [
        "scientific notation",
        "binary place value",
        "rounding"
      ],
      "leadsTo": [
        "Machine epsilon and rounding",
        "Absolute and relative error",
        "Stability of algorithms"
      ],
      "usedWith": [
        "binary arithmetic",
        "significant digits",
        "powers of two",
        "intervals"
      ]
    },
    "motivation": "<p>You already know scientific notation: $6.02\\times10^{23}$ stores a large value with a few important digits and an exponent. IEEE 754 gives computers the same idea in base $2$.</p><p>The gift is range. The cost is that most real numbers land between representable grid points, so the machine stores a nearby value instead of the exact one.</p>",
    "definition": "<p>A normalized binary floating-point number has form $(-1)^s(1.f)_2 2^e$. The bit $s$ stores the sign, $(1.f)_2$ is the significand with a hidden leading $1$, and $e$ is the unbiased exponent. Double precision uses $1$ sign bit, $11$ exponent bits, and $52$ stored fraction bits, giving $53$ significant binary bits.</p><p>The spacing scales with magnitude: near $1$ the double spacing is $2^{-52}$, while near $2^k$ it is $2^k2^{-52}$. The significand grid is the same; the exponent stretches it.</p><p><b>Assumptions that matter:</b> normalized numbers have a hidden leading bit; special bit patterns represent zeros, subnormals, infinities, and NaN; and ordinary operations usually round to nearest, ties to even.</p>",
    "worked": {
      "problem": "Convert $(-1)^0(1.101)_2 2^3$ to decimal.",
      "skills": [
        "binary fractions",
        "normalization",
        "powers of two"
      ],
      "strategy": "Convert the significand, scale by the exponent, then apply the sign.",
      "steps": [
        {
          "do": "Convert the significand",
          "result": "$(1.101)_2=1+\\dfrac12+\\dfrac18$",
          "why": "binary fractional places are halves, fourths, eighths"
        },
        {
          "do": "Add the terms",
          "result": "$1.625$",
          "why": "this is the decimal significand"
        },
        {
          "do": "Compute the scale",
          "result": "$2^3=8$",
          "why": "the exponent multiplies the significand"
        },
        {
          "do": "Multiply",
          "result": "$1.625\\cdot8=13$",
          "why": "scale the normalized value"
        },
        {
          "do": "Apply the sign",
          "result": "$(-1)^0\\cdot13=13$",
          "why": "sign bit zero means positive"
        }
      ],
      "verify": "A value $(1.x)_2 2^3$ lies between $8$ and $16$, and $13$ does.",
      "answer": "The represented value is $13$.",
      "connects": "IEEE floats are base-2 scientific notation with a finite significand."
    },
    "practice": [
      {
        "problem": "Convert $(1.01)_2 2^2$ to decimal.",
        "steps": [
          {
            "do": "Convert the significand",
            "result": "$(1.01)_2=1+\\dfrac14$",
            "why": "the second fractional bit is one fourth"
          },
          {
            "do": "Add",
            "result": "$1.25$",
            "why": "decimal significand"
          },
          {
            "do": "Compute the scale",
            "result": "$2^2=4$",
            "why": "exponent two"
          },
          {
            "do": "Multiply",
            "result": "$1.25\\cdot4=5$",
            "why": "scale the value"
          },
          {
            "do": "State the value",
            "result": "$5$",
            "why": "positive sign is understood"
          }
        ],
        "answer": "The value is $5$."
      },
      {
        "problem": "Write $10$ as a normalized binary number.",
        "steps": [
          {
            "do": "Convert to binary",
            "result": "$10=(1010)_2$",
            "why": "$8+2=10$"
          },
          {
            "do": "Move the point",
            "result": "$(1010)_2=(1.010)_2 2^3$",
            "why": "one nonzero digit remains before the point"
          },
          {
            "do": "Read the significand",
            "result": "$(1.010)_2$",
            "why": "normalized significand"
          },
          {
            "do": "Read the exponent",
            "result": "$e=3$",
            "why": "the point moved three places"
          },
          {
            "do": "Check",
            "result": "$1.25\\cdot8=10$",
            "why": "the conversion is consistent"
          }
        ],
        "answer": "$10=(1.010)_2 2^3$."
      },
      {
        "problem": "A toy format has $p=4$ significant bits. List normalized values in $[1,2)$.",
        "steps": [
          {
            "do": "Set exponent",
            "result": "$e=0$",
            "why": "values in this binade have form $(1.xxx)_2$"
          },
          {
            "do": "Find spacing",
            "result": "$2^{-3}=1/8$",
            "why": "three fraction bits remain"
          },
          {
            "do": "Start at one",
            "result": "$1.000_2=1$",
            "why": "smallest value"
          },
          {
            "do": "Add eighths",
            "result": "$1,1.125,1.25,1.375,1.5,1.625,1.75,1.875$",
            "why": "all eight patterns"
          },
          {
            "do": "Exclude two",
            "result": "$2=(1.000)_2 2^1$",
            "why": "it belongs to the next binade"
          }
        ],
        "answer": "The values are $1$ through $1.875$ in steps of $0.125$."
      },
      {
        "problem": "If double spacing near $1$ is $2^{-52}$, what is spacing near $2^5$?",
        "steps": [
          {
            "do": "Use scaling",
            "result": "$\\Delta=2^e2^{-52}$",
            "why": "spacing scales with exponent"
          },
          {
            "do": "Substitute",
            "result": "$\\Delta=2^5 2^{-52}$",
            "why": "here $e=5$"
          },
          {
            "do": "Combine powers",
            "result": "$2^{-47}$",
            "why": "add exponents"
          },
          {
            "do": "Approximate",
            "result": "$2^{-47}\\approx7.11\\times10^{-15}$",
            "why": "decimal scale"
          },
          {
            "do": "Interpret",
            "result": "$32$ has wider spacing than $1$",
            "why": "larger magnitudes have larger gaps"
          }
        ],
        "answer": "The spacing is $2^{-47}\\approx7.11\\times10^{-15}$."
      },
      {
        "problem": "With $p=3$ and $e=2$, adjacent significands $(1.01)_2$ and $(1.10)_2$ give what values and gap?",
        "steps": [
          {
            "do": "Convert first significand",
            "result": "$(1.01)_2=1.25$",
            "why": "one fourth is present"
          },
          {
            "do": "Scale first",
            "result": "$1.25\\cdot4=5$",
            "why": "use $2^2=4$"
          },
          {
            "do": "Convert second significand",
            "result": "$(1.10)_2=1.5$",
            "why": "one half is present"
          },
          {
            "do": "Scale second",
            "result": "$1.5\\cdot4=6$",
            "why": "use the same exponent"
          },
          {
            "do": "Subtract",
            "result": "$6-5=1$",
            "why": "gap between values"
          }
        ],
        "answer": "The values are $5$ and $6$, with gap $1$."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on floating-point representation because many small floating-point operations accumulate over millions of examples.",
        "numbers": "A weight $0.15625=5/32=(1.01)_2 2^{-3}$ is exact in binary."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use floating-point representation to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "A float32 result near $1$ has spacing about $2^{-23}\\approx1.19\\times10^{-7}."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed floating-point representation for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "Double precision stores magnitudes roughly from $10^{-308}$ to $10^{308}."
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use floating-point representation when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "A $1024\\times1024$ matrix product uses about $2\\cdot1024^3\\approx2.15$ billion floating operations."
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make floating-point representation visible before a model is even trained.",
        "numbers": "A pixel $128$ normalized by $255$ gives $128/255\\approx0.502$, usually approximate."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need floating-point representation because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "Ties-to-even rounds $1+2^{-53}$ to $1$ in double precision."
      }
    ],
    "applicationsClose": "Across weights, pixels, simulations, and hardware kernels, floating point is the same finite grid stretched across many scales.",
    "takeaways": [
      "Floating point stores sign, significand, and exponent.",
      "Double precision has $53$ significant binary bits including the hidden bit.",
      "Spacing grows as magnitude grows.",
      "Special values handle zeros, subnormals, infinities, and NaN."
    ]
  },
  "math-08-02": {
    "id": "math-08-02",
    "title": "Machine epsilon and rounding",
    "tagline": "Machine epsilon is the tiny step from $1$ to the next representable number.",
    "connections": {
      "buildsOn": [
        "Floating-point representation (IEEE 754)",
        "rounding",
        "powers of two"
      ],
      "leadsTo": [
        "Absolute and relative error",
        "Error propagation",
        "Catastrophic cancellation"
      ],
      "usedWith": [
        "significant digits",
        "binary fractions",
        "inequalities",
        "relative error"
      ]
    },
    "motivation": "<p>You already know rounding $3.14159$ to $3.14$ loses information. Floating-point arithmetic rounds constantly, but on a precise grid.</p><p><b>Machine epsilon</b> gives the grid spacing near $1$, so roundoff becomes a number rather than a worry.</p>",
    "definition": "<p>For base $2$ precision $p$, the distance from $1$ to the next larger representable value is $\\epsilon_{\\text{mach}}=2^{1-p}$. In double precision, $p=53$, so $\\epsilon_{\\text{mach}}=2^{-52}\\approx2.22\\times10^{-16}$.</p><p>With round-to-nearest, a normalized rounded result satisfies $\\operatorname{fl}(x)=x(1+\\delta)$ with $|\\delta|\\le u$, where $u=\\epsilon_{\\text{mach}}/2$. The half appears because nearest rounding moves at most half a spacing.</p><p><b>Assumptions that matter:</b> the model assumes normalized results, no overflow or underflow, and round-to-nearest arithmetic; some texts call $u$ machine epsilon, so check convention.</p>",
    "worked": {
      "problem": "A base-$2$ toy format has $p=5$. Find $\\epsilon_{\\text{mach}}$ and $u$.",
      "skills": [
        "machine epsilon",
        "powers of two",
        "rounding bounds"
      ],
      "strategy": "Use the spacing formula, then take half for round-to-nearest.",
      "steps": [
        {
          "do": "Use the formula",
          "result": "$\\epsilon_{\\text{mach}}=2^{1-p}$",
          "why": "spacing from $1$ to the next value"
        },
        {
          "do": "Substitute",
          "result": "$2^{1-5}=2^{-4}$",
          "why": "use $p=5$"
        },
        {
          "do": "Convert",
          "result": "$2^{-4}=0.0625$",
          "why": "decimal spacing"
        },
        {
          "do": "Use unit roundoff",
          "result": "$u=\\epsilon_{\\text{mach}}/2$",
          "why": "nearest rounding errs by at most half a gap"
        },
        {
          "do": "Compute",
          "result": "$u=0.03125$",
          "why": "half of $0.0625$"
        }
      ],
      "verify": "The next value after $1.0000_2$ is $1.0001_2$, separated by $2^{-4}$.",
      "answer": "$\\epsilon_{\\text{mach}}=0.0625$ and $u=0.03125$.",
      "connects": "Machine epsilon is the local ruler for roundoff."
    },
    "practice": [
      {
        "problem": "Find $\\epsilon_{\\text{mach}}$ for $p=4$.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$2^{1-p}$",
            "why": "base-2 spacing"
          },
          {
            "do": "Substitute",
            "result": "$2^{1-4}$",
            "why": "use $p=4$"
          },
          {
            "do": "Simplify",
            "result": "$2^{-3}$",
            "why": "subtract exponents"
          },
          {
            "do": "Convert",
            "result": "$1/8=0.125$",
            "why": "decimal form"
          },
          {
            "do": "Interpret",
            "result": "$1.125$ is next after $1$",
            "why": "gap is $0.125$"
          }
        ],
        "answer": "$\\epsilon_{\\text{mach}}=0.125$."
      },
      {
        "problem": "If $\\epsilon_{\\text{mach}}=2^{-10}$, find $u$.",
        "steps": [
          {
            "do": "Recall relation",
            "result": "$u=\\epsilon_{\\text{mach}}/2$",
            "why": "rounding to nearest"
          },
          {
            "do": "Substitute",
            "result": "$u=2^{-10}/2$",
            "why": "given epsilon"
          },
          {
            "do": "Write divisor",
            "result": "$2=2^1$",
            "why": "combine powers"
          },
          {
            "do": "Simplify",
            "result": "$u=2^{-11}$",
            "why": "one more exponent"
          },
          {
            "do": "Approximate",
            "result": "$2^{-11}\\approx0.000488$",
            "why": "decimal scale"
          }
        ],
        "answer": "$u=2^{-11}\\approx4.88\\times10^{-4}$."
      },
      {
        "problem": "Round $1.01101_2$ to $p=4$ significant bits.",
        "steps": [
          {
            "do": "Keep four bits",
            "result": "$1.011$",
            "why": "stored precision"
          },
          {
            "do": "Inspect next bit",
            "result": "$0$",
            "why": "no round up"
          },
          {
            "do": "Write rounded value",
            "result": "$1.011_2$",
            "why": "nearest retained value"
          },
          {
            "do": "Convert exact",
            "result": "$1.01101_2=1.40625$",
            "why": "check value"
          },
          {
            "do": "Convert rounded",
            "result": "$1.011_2=1.375$",
            "why": "rounded result"
          }
        ],
        "answer": "The rounded value is $1.011_2=1.375$."
      },
      {
        "problem": "If $x=100$ and $u=10^{-6}$, bound absolute rounding error.",
        "steps": [
          {
            "do": "Use relative model",
            "result": "$|\\operatorname{fl}(x)-x|\\le u|x|$",
            "why": "convert relative to absolute"
          },
          {
            "do": "Substitute",
            "result": "$10^{-6}\\cdot100$",
            "why": "given values"
          },
          {
            "do": "Multiply",
            "result": "$10^{-4}$",
            "why": "$100=10^2$"
          },
          {
            "do": "Write decimal",
            "result": "$0.0001$",
            "why": "absolute error"
          },
          {
            "do": "Interpret",
            "result": "$\\operatorname{fl}(100)$ is within $0.0001$",
            "why": "under the model"
          }
        ],
        "answer": "The absolute error is at most $0.0001$."
      },
      {
        "problem": "Using double $u\\approx1.11\\times10^{-16}$, give the one-rounding relative error bound as a percent.",
        "steps": [
          {
            "do": "State model",
            "result": "$|\\delta|\\le u$",
            "why": "relative rounding error"
          },
          {
            "do": "Substitute",
            "result": "$|\\delta|\\le1.11\\times10^{-16}$",
            "why": "double precision"
          },
          {
            "do": "Convert to percent",
            "result": "$100u$",
            "why": "multiply by $100%$"
          },
          {
            "do": "Compute",
            "result": "$1.11\\times10^{-14}\\%$",
            "why": "percent bound"
          },
          {
            "do": "Interpret",
            "result": "about $16$ decimal digits for one rounding",
            "why": "tiny but not zero"
          }
        ],
        "answer": "At most $1.11\\times10^{-16}$ relative error, or $1.11\\times10^{-14}\\%$."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on machine epsilon and rounding because many small floating-point operations accumulate over millions of examples.",
        "numbers": "With double $u\\approx10^{-16}$, useful finite-difference steps are often near $10^{-5}$, not $10^{-16}."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use machine epsilon and rounding to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "For loss near $100$, one rounding scale is about $100u\\approx1.1\\times10^{-14}."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed machine epsilon and rounding for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "Near $1$, $1+10^{-18}$ rounds to $1$ in double because $10^{-18}<2^{-52}."
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use machine epsilon and rounding when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "A feature near $10^6$ has roundoff scale about $10^6u\\approx1.1\\times10^{-10}."
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make machine epsilon and rounding visible before a model is even trained.",
        "numbers": "A million additions can have rough scale $10^6u\\approx10^{-10}."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need machine epsilon and rounding because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "A relative tolerance $10^{-12}$ is thousands of times larger than double unit roundoff."
      }
    ],
    "applicationsClose": "Machine epsilon is the small ruler behind tolerances, stopping rules, and the first-order model of roundoff.",
    "takeaways": [
      "For base $2$ precision $p$, $\\epsilon_{\\text{mach}}=2^{1-p}.",
      "Unit roundoff is $u=\\epsilon_{\\text{mach}}/2$ for round-to-nearest.",
      "A rounded result often satisfies $\\operatorname{fl}(x)=x(1+\\delta)$ with $|\\delta|\\le u$.",
      "Small one-step errors can matter after amplification or many operations."
    ]
  },
  "math-08-03": {
    "id": "math-08-03",
    "title": "Absolute and relative error",
    "tagline": "Absolute error asks how far; relative error asks how large that miss is compared with the truth.",
    "connections": {
      "buildsOn": [
        "Machine epsilon and rounding",
        "distance",
        "percent change"
      ],
      "leadsTo": [
        "Error propagation",
        "Conditioning of problems",
        "Stability of algorithms"
      ],
      "usedWith": [
        "norms",
        "percent error",
        "inequalities",
        "significant digits"
      ]
    },
    "motivation": "<p>A miss of $2$ units can be tiny or enormous depending on the target. Numerical work therefore asks both how far away an approximation is and how large that miss is relative to the exact value.</p><p>These two lenses keep scale in view.</p>",
    "definition": "<p>If $x$ is exact and $\\hat x$ is approximate, absolute error is $|\\hat x-x|$. When $x\\ne0$, relative error is $|\\hat x-x|/|x|$, often reported as a percent.</p><p>The formula is a normalization: divide the miss by the size of the truth. An error $0.01$ is large for truth $0.02$ and tiny for truth $1000$.</p><p><b>Assumptions that matter:</b> relative error needs a nonzero reference; vector errors use norms; and near zero, absolute error may be the more honest measure.</p>",
    "worked": {
      "problem": "For $x=50$ and $\\hat x=49.2$, find absolute and relative error.",
      "skills": [
        "absolute error",
        "relative error",
        "percent"
      ],
      "strategy": "Compute the raw miss, then divide by the exact value.",
      "steps": [
        {
          "do": "Subtract",
          "result": "$49.2-50=-0.8$",
          "why": "signed error"
        },
        {
          "do": "Take absolute value",
          "result": "$0.8$",
          "why": "absolute error"
        },
        {
          "do": "Divide by truth",
          "result": "$0.8/50$",
          "why": "relative error"
        },
        {
          "do": "Simplify",
          "result": "$0.016$",
          "why": "decimal"
        },
        {
          "do": "Convert",
          "result": "$1.6\\%$",
          "why": "percent"
        }
      ],
      "verify": "The miss is less than two percent of $50$, so the scale makes sense.",
      "answer": "Absolute error is $0.8$; relative error is $1.6%$.",
      "connects": "Relative error measures the miss compared with the target size."
    },
    "practice": [
      {
        "problem": "Approximate $\\pi$ by $3.14$ using $\\pi\\approx3.14159$.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$3.14-3.14159=-0.00159$",
            "why": "signed error"
          },
          {
            "do": "Absolute value",
            "result": "$0.00159$",
            "why": "absolute error"
          },
          {
            "do": "Divide",
            "result": "$0.00159/3.14159$",
            "why": "relative error"
          },
          {
            "do": "Approximate",
            "result": "$0.000506$",
            "why": "division"
          },
          {
            "do": "Percent",
            "result": "$0.0506\\%$",
            "why": "multiply by 100"
          }
        ],
        "answer": "Absolute error $0.00159$; relative error about $0.0506\\%$."
      },
      {
        "problem": "A sensor reads $9.8$ when truth is $10.0$.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$9.8-10.0=-0.2$",
            "why": "signed error"
          },
          {
            "do": "Absolute error",
            "result": "$0.2$",
            "why": "distance"
          },
          {
            "do": "Divide",
            "result": "$0.2/10.0$",
            "why": "relative error"
          },
          {
            "do": "Simplify",
            "result": "$0.02$",
            "why": "decimal"
          },
          {
            "do": "Percent",
            "result": "$2\\%$",
            "why": "convert"
          }
        ],
        "answer": "Absolute error is $0.2$; relative error is $2%$."
      },
      {
        "problem": "Compare absolute error $0.01$ for truths $0.1$ and $100$.",
        "steps": [
          {
            "do": "First relative error",
            "result": "$0.01/0.1=0.1$",
            "why": "small truth"
          },
          {
            "do": "First percent",
            "result": "$10\\%$",
            "why": "convert"
          },
          {
            "do": "Second relative error",
            "result": "$0.01/100=0.0001$",
            "why": "large truth"
          },
          {
            "do": "Second percent",
            "result": "$0.01\\%$",
            "why": "convert"
          },
          {
            "do": "Compare",
            "result": "$10\\%$ is much larger",
            "why": "same raw miss, different scale"
          }
        ],
        "answer": "The relative errors are $10%$ and $0.01%$."
      },
      {
        "problem": "For $x=(3,4)$ and $\\hat x=(2.7,4.4)$, use Euclidean norm.",
        "steps": [
          {
            "do": "Error vector",
            "result": "$(-0.3,0.4)$",
            "why": "subtract componentwise"
          },
          {
            "do": "Norm",
            "result": "$\\sqrt{0.09+0.16}$",
            "why": "Euclidean error"
          },
          {
            "do": "Simplify",
            "result": "$0.5$",
            "why": "absolute error"
          },
          {
            "do": "Truth norm",
            "result": "$5$",
            "why": "$3$-$4$-$5$ triangle"
          },
          {
            "do": "Divide",
            "result": "$0.5/5=0.1$",
            "why": "relative error"
          }
        ],
        "answer": "Absolute error is $0.5$; relative error is $10%$."
      },
      {
        "problem": "A probability should be $0.002$ but is stored as $0.0015$.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$-0.0005$",
            "why": "signed miss"
          },
          {
            "do": "Absolute error",
            "result": "$0.0005$",
            "why": "distance"
          },
          {
            "do": "Divide",
            "result": "$0.0005/0.002$",
            "why": "relative error"
          },
          {
            "do": "Simplify",
            "result": "$0.25$",
            "why": "one quarter"
          },
          {
            "do": "Percent",
            "result": "$25\\%$",
            "why": "convert"
          }
        ],
        "answer": "Absolute error is $0.0005$; relative error is $25%$."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on absolute and relative error because many small floating-point operations accumulate over millions of examples.",
        "numbers": "AUC from $0.800$ to $0.804$ is absolute gain $0.004$, about $0.5\\%$ relative."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use absolute and relative error to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "Predicting $0.003$ instead of $0.002$ has relative error $50\\%."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed absolute and relative error for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "A $1$ m GPS error over $1000$ m is $0.1\\%"
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use absolute and relative error when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "If $\\|b\\|=200$ and residual norm is $0.02$, relative residual is $10^{-4}."
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make absolute and relative error visible before a model is even trained.",
        "numbers": "For expected $10^6$, relative tolerance $10^{-9}$ allows $0.001$ absolute difference."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need absolute and relative error because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "Changing pixel $5$ to $7$ is $40\\%$, while $200$ to $202$ is $1\\%."
      }
    ],
    "applicationsClose": "Absolute error tells the miss; relative error tells whether the miss is large for the scale.",
    "takeaways": [
      "Absolute error is $|\\hat x-x|$.",
      "Relative error is $|\\hat x-x|/|x|$ when $x\\ne0$.",
      "Near zero, relative error can be misleadingly huge.",
      "For vectors, use norms."
    ]
  },
  "math-08-04": {
    "id": "math-08-04",
    "title": "Error propagation",
    "tagline": "Errors travel through formulas, sometimes shrinking and sometimes amplifying.",
    "connections": {
      "buildsOn": [
        "Absolute and relative error",
        "derivatives",
        "linear approximation"
      ],
      "leadsTo": [
        "Catastrophic cancellation",
        "Conditioning of problems",
        "Stability of algorithms"
      ],
      "usedWith": [
        "Taylor approximation",
        "partial derivatives",
        "norms",
        "inequalities"
      ]
    },
    "motivation": "<p>A small input error feels harmless until it passes through a steep formula. Error propagation asks how uncertainty in inputs becomes uncertainty in outputs.</p><p>The derivative gives the first honest estimate: locally, it is the multiplier that carries errors forward.</p>",
    "definition": "<p>For $y=f(x)$ and small input error $\\Delta x$, the output error is approximately $\\Delta y\\approx f'(x)\\Delta x$. For several variables, $\\Delta f\\approx\\sum_i \\dfrac{\\partial f}{\\partial x_i}\\Delta x_i$.</p><p>This is Taylor approximation: $f(x+\\Delta x)=f(x)+f'(x)\\Delta x$ plus smaller terms.</p><p><b>Assumptions that matter:</b> first-order propagation works best for small errors and smooth functions; signs can cancel; worst-case bounds use absolute values.</p>",
    "worked": {
      "problem": "For $y=x^2$ at $x=3$ with $\\Delta x=0.01$, estimate $\\Delta y$.",
      "skills": [
        "derivatives",
        "linear approximation",
        "error estimates"
      ],
      "strategy": "Use the core rule of error propagation one careful step at a time.",
      "steps": [
        {
          "do": "Differentiate",
          "result": "$f'(x)=2x$",
          "why": "sensitivity"
        },
        {
          "do": "Evaluate",
          "result": "$f'(3)=6$",
          "why": "local multiplier"
        },
        {
          "do": "Apply propagation",
          "result": "$\\Delta y\\approx6\\Delta x$",
          "why": "first-order rule"
        },
        {
          "do": "Substitute",
          "result": "$6\\cdot0.01$",
          "why": "use input error"
        },
        {
          "do": "Compute",
          "result": "$0.06$",
          "why": "estimated output error"
        }
      ],
      "verify": "The exact change $3.01^2-3^2=0.0601$ is close to $0.06$.",
      "answer": "The output error is approximately $0.06$.",
      "connects": "This is error propagation in its most useful numerical form."
    },
    "practice": [
      {
        "problem": "Compute a basic numerical estimate for error propagation with values $2$ and $5$.",
        "steps": [
          {
            "do": "Name the first value",
            "result": "$2$",
            "why": "given"
          },
          {
            "do": "Name the second value",
            "result": "$5$",
            "why": "given"
          },
          {
            "do": "Find the difference",
            "result": "$5-2=3$",
            "why": "one operation"
          },
          {
            "do": "Scale the result",
            "result": "$3/5=0.6$",
            "why": "relative scale"
          },
          {
            "do": "State the estimate",
            "result": "$0.6$",
            "why": "final numeric quantity"
          }
        ],
        "answer": "The estimate is $0.6$."
      },
      {
        "problem": "Use error propagation to reduce an interval or error from $1$ to $1/8$.",
        "steps": [
          {
            "do": "Start with size",
            "result": "$1$",
            "why": "initial size"
          },
          {
            "do": "Apply first halving",
            "result": "$1/2$",
            "why": "one refinement"
          },
          {
            "do": "Apply second halving",
            "result": "$1/4$",
            "why": "two refinements"
          },
          {
            "do": "Apply third halving",
            "result": "$1/8$",
            "why": "three refinements"
          },
          {
            "do": "Compare",
            "result": "$1/8=0.125$",
            "why": "decimal scale"
          }
        ],
        "answer": "Three halvings give $1/8=0.125$."
      },
      {
        "problem": "Estimate amplification in error propagation when a factor $4$ acts on input error $0.002$.",
        "steps": [
          {
            "do": "Write input error",
            "result": "$0.002$",
            "why": "given"
          },
          {
            "do": "Write amplification",
            "result": "$4$",
            "why": "given factor"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot0.002$",
            "why": "propagate"
          },
          {
            "do": "Compute",
            "result": "$0.008$",
            "why": "output scale"
          },
          {
            "do": "Convert",
            "result": "$0.8\\%$",
            "why": "if interpreted relatively"
          }
        ],
        "answer": "The amplified error is $0.008$."
      },
      {
        "problem": "Check a stopping tolerance for error propagation: current change $3\\times10^{-5}$ and tolerance $10^{-4}$.",
        "steps": [
          {
            "do": "Write change",
            "result": "$3\\times10^{-5}$",
            "why": "given"
          },
          {
            "do": "Write tolerance",
            "result": "$10^{-4}$",
            "why": "given"
          },
          {
            "do": "Compare powers",
            "result": "$3\\times10^{-5}<10^{-4}$",
            "why": "because $0.00003<0.0001$"
          },
          {
            "do": "Apply rule",
            "result": "stop",
            "why": "change is below tolerance"
          },
          {
            "do": "State result",
            "result": "criterion is satisfied",
            "why": "the computation is accurate enough by this test"
          }
        ],
        "answer": "The stopping criterion is satisfied."
      },
      {
        "problem": "Connect error propagation to an ML number: a loss changes from $2.000$ to $1.996$. Find absolute and relative change.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$1.996-2.000=-0.004$",
            "why": "signed change"
          },
          {
            "do": "Absolute change",
            "result": "$0.004$",
            "why": "distance"
          },
          {
            "do": "Divide by old loss",
            "result": "$0.004/2.000$",
            "why": "relative change"
          },
          {
            "do": "Simplify",
            "result": "$0.002$",
            "why": "decimal"
          },
          {
            "do": "Convert",
            "result": "$0.2\\%$",
            "why": "percent"
          }
        ],
        "answer": "The loss decreased by $0.004$, which is $0.2%$ of the old loss."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on error propagation because many small floating-point operations accumulate over millions of examples.",
        "numbers": "A perturbation $10^{-6}$ amplified by $20$ gives $2\\times10^{-5}."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use error propagation to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "A tolerance $10^{-8}$ is stricter than $10^{-6}$ by a factor of $100."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed error propagation for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "Three halvings take width $1$ to $0.125."
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use error propagation when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "A step from loss $5.0$ to $4.9$ changes the value by $0.1"
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make error propagation visible before a model is even trained.",
        "numbers": "Standardizing $x=130$ with mean $100$ and scale $15$ gives $z=2."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need error propagation because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "A production score moving from $0.700$ to $0.707$ changes by $1\\%$ relative."
      }
    ],
    "applicationsClose": "Across these examples, error propagation is one idea wearing several practical uniforms.",
    "takeaways": [
      "Know the defining rule for error propagation.",
      "Track the numerical size of every step.",
      "Use tolerances and checks rather than wishful exactness.",
      "Connect the arithmetic back to algorithm behavior."
    ]
  },
  "math-08-05": {
    "id": "math-08-05",
    "title": "Catastrophic cancellation",
    "tagline": "Subtracting nearly equal rounded numbers can erase the digits you needed most.",
    "connections": {
      "buildsOn": [
        "Floating-point representation (IEEE 754)",
        "Absolute and relative error",
        "Error propagation"
      ],
      "leadsTo": [
        "Conditioning of problems",
        "Stability of algorithms",
        "Newton method"
      ],
      "usedWith": [
        "algebraic rewriting",
        "Taylor approximation",
        "significant digits",
        "quadratic formula"
      ]
    },
    "motivation": "<p>Subtraction is safe when numbers are exact. The danger begins when two rounded quantities agree in many leading digits and their difference is small.</p><p><b>Catastrophic cancellation</b> means the leading reliable digits cancel, leaving a result dominated by earlier rounding errors.</p>",
    "definition": "<p>Cancellation in $a-b$ is dangerous when $a\\approx b$. If each input has absolute error about $\\eta$, the difference may have absolute error about $2\\eta$, but relative error about $2\\eta/|a-b|$.</p><p>Stable rewrites avoid the close subtraction. For example, $\\sqrt{x+1}-\\sqrt{x}=1/(\\sqrt{x+1}+\\sqrt{x})$.</p><p><b>Assumptions that matter:</b> exact symbolic cancellation can be useful; numerical danger comes after rounding; and algebraic rewrites should preserve the exact value.</p>",
    "worked": {
      "problem": "Compute $\\sqrt{101}-10$ stably.",
      "skills": [
        "conjugates",
        "roundoff awareness",
        "algebraic rewriting"
      ],
      "strategy": "Use the core rule of catastrophic cancellation one careful step at a time.",
      "steps": [
        {
          "do": "Start",
          "result": "$\\sqrt{101}-10$",
          "why": "the terms are close"
        },
        {
          "do": "Multiply by conjugate",
          "result": "$(\\sqrt{101}-10)\\dfrac{\\sqrt{101}+10}{\\sqrt{101}+10}$",
          "why": "multiply by one"
        },
        {
          "do": "Use difference of squares",
          "result": "$\\dfrac{101-100}{\\sqrt{101}+10}$",
          "why": "remove close subtraction"
        },
        {
          "do": "Simplify",
          "result": "$\\dfrac{1}{\\sqrt{101}+10}$",
          "why": "stable form"
        },
        {
          "do": "Approximate",
          "result": "$0.0498756$",
          "why": "well-scaled division"
        }
      ],
      "verify": "High-precision direct evaluation gives the same value, but the rationalized form protects digits.",
      "answer": "$\\sqrt{101}-10\\approx0.0498756$.",
      "connects": "This is catastrophic cancellation in its most useful numerical form."
    },
    "practice": [
      {
        "problem": "Compute a basic numerical estimate for catastrophic cancellation with values $2$ and $5$.",
        "steps": [
          {
            "do": "Name the first value",
            "result": "$2$",
            "why": "given"
          },
          {
            "do": "Name the second value",
            "result": "$5$",
            "why": "given"
          },
          {
            "do": "Find the difference",
            "result": "$5-2=3$",
            "why": "one operation"
          },
          {
            "do": "Scale the result",
            "result": "$3/5=0.6$",
            "why": "relative scale"
          },
          {
            "do": "State the estimate",
            "result": "$0.6$",
            "why": "final numeric quantity"
          }
        ],
        "answer": "The estimate is $0.6$."
      },
      {
        "problem": "Use catastrophic cancellation to reduce an interval or error from $1$ to $1/8$.",
        "steps": [
          {
            "do": "Start with size",
            "result": "$1$",
            "why": "initial size"
          },
          {
            "do": "Apply first halving",
            "result": "$1/2$",
            "why": "one refinement"
          },
          {
            "do": "Apply second halving",
            "result": "$1/4$",
            "why": "two refinements"
          },
          {
            "do": "Apply third halving",
            "result": "$1/8$",
            "why": "three refinements"
          },
          {
            "do": "Compare",
            "result": "$1/8=0.125$",
            "why": "decimal scale"
          }
        ],
        "answer": "Three halvings give $1/8=0.125$."
      },
      {
        "problem": "Estimate amplification in catastrophic cancellation when a factor $4$ acts on input error $0.002$.",
        "steps": [
          {
            "do": "Write input error",
            "result": "$0.002$",
            "why": "given"
          },
          {
            "do": "Write amplification",
            "result": "$4$",
            "why": "given factor"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot0.002$",
            "why": "propagate"
          },
          {
            "do": "Compute",
            "result": "$0.008$",
            "why": "output scale"
          },
          {
            "do": "Convert",
            "result": "$0.8\\%$",
            "why": "if interpreted relatively"
          }
        ],
        "answer": "The amplified error is $0.008$."
      },
      {
        "problem": "Check a stopping tolerance for catastrophic cancellation: current change $3\\times10^{-5}$ and tolerance $10^{-4}$.",
        "steps": [
          {
            "do": "Write change",
            "result": "$3\\times10^{-5}$",
            "why": "given"
          },
          {
            "do": "Write tolerance",
            "result": "$10^{-4}$",
            "why": "given"
          },
          {
            "do": "Compare powers",
            "result": "$3\\times10^{-5}<10^{-4}$",
            "why": "because $0.00003<0.0001$"
          },
          {
            "do": "Apply rule",
            "result": "stop",
            "why": "change is below tolerance"
          },
          {
            "do": "State result",
            "result": "criterion is satisfied",
            "why": "the computation is accurate enough by this test"
          }
        ],
        "answer": "The stopping criterion is satisfied."
      },
      {
        "problem": "Connect catastrophic cancellation to an ML number: a loss changes from $2.000$ to $1.996$. Find absolute and relative change.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$1.996-2.000=-0.004$",
            "why": "signed change"
          },
          {
            "do": "Absolute change",
            "result": "$0.004$",
            "why": "distance"
          },
          {
            "do": "Divide by old loss",
            "result": "$0.004/2.000$",
            "why": "relative change"
          },
          {
            "do": "Simplify",
            "result": "$0.002$",
            "why": "decimal"
          },
          {
            "do": "Convert",
            "result": "$0.2\\%$",
            "why": "percent"
          }
        ],
        "answer": "The loss decreased by $0.004$, which is $0.2%$ of the old loss."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on catastrophic cancellation because many small floating-point operations accumulate over millions of examples.",
        "numbers": "A perturbation $10^{-6}$ amplified by $20$ gives $2\\times10^{-5}."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use catastrophic cancellation to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "A tolerance $10^{-8}$ is stricter than $10^{-6}$ by a factor of $100."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed catastrophic cancellation for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "Three halvings take width $1$ to $0.125."
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use catastrophic cancellation when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "A step from loss $5.0$ to $4.9$ changes the value by $0.1"
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make catastrophic cancellation visible before a model is even trained.",
        "numbers": "Standardizing $x=130$ with mean $100$ and scale $15$ gives $z=2."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need catastrophic cancellation because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "A production score moving from $0.700$ to $0.707$ changes by $1\\%$ relative."
      }
    ],
    "applicationsClose": "Across these examples, catastrophic cancellation is one idea wearing several practical uniforms.",
    "takeaways": [
      "Know the defining rule for catastrophic cancellation.",
      "Track the numerical size of every step.",
      "Use tolerances and checks rather than wishful exactness.",
      "Connect the arithmetic back to algorithm behavior."
    ]
  },
  "math-08-06": {
    "id": "math-08-06",
    "title": "Conditioning of problems",
    "tagline": "Conditioning asks whether the problem itself magnifies small input changes.",
    "connections": {
      "buildsOn": [
        "Error propagation",
        "Absolute and relative error",
        "derivatives"
      ],
      "leadsTo": [
        "Stability of algorithms",
        "LU factorization",
        "iterative methods"
      ],
      "usedWith": [
        "norms",
        "matrices",
        "relative error",
        "derivatives"
      ]
    },
    "motivation": "<p>Sometimes a bad answer is not the computer fault. If tiny input changes create large exact answer changes, the problem is delicate before any algorithm starts.</p><p>Conditioning measures that built-in sensitivity.</p>",
    "definition": "<p>A condition number compares relative output change with relative input change. For scalar $y=f(x)$, $\\kappa_f(x)=\\left|\\dfrac{x f'(x)}{f(x)}\\right|$ when defined.</p><p>This follows from $\\Delta y\\approx f'(x)\\Delta x$ after dividing output and input changes by their sizes.</p><p><b>Assumptions that matter:</b> conditioning is about the exact problem, not the code; large condition numbers amplify input error; and matrix conditioning often uses $\\kappa(A)=\\|A\\|\\|A^{-1}\\|$.</p>",
    "worked": {
      "problem": "Find $\\kappa_f(3)$ for $f(x)=x^2$.",
      "skills": [
        "derivatives",
        "relative error",
        "condition number"
      ],
      "strategy": "Use the core rule of conditioning one careful step at a time.",
      "steps": [
        {
          "do": "Differentiate",
          "result": "$f'(x)=2x$",
          "why": "local sensitivity"
        },
        {
          "do": "Write formula",
          "result": "$\\kappa_f(x)=\\left|\\dfrac{x f'(x)}{f(x)}\\right|$",
          "why": "relative sensitivity"
        },
        {
          "do": "Substitute",
          "result": "$\\left|\\dfrac{x(2x)}{x^2}\\right|$",
          "why": "use $f=x^2$"
        },
        {
          "do": "Simplify",
          "result": "$2$",
          "why": "cancel $x^2$"
        },
        {
          "do": "Evaluate",
          "result": "$\\kappa_f(3)=2$",
          "why": "constant for $x\\ne0$"
        }
      ],
      "verify": "A $1\\%$ input change in $x$ gives about a $2\\%$ change in $x^2$.",
      "answer": "$\\kappa_f(3)=2$.",
      "connects": "This is conditioning in its most useful numerical form."
    },
    "practice": [
      {
        "problem": "Compute a basic numerical estimate for conditioning with values $2$ and $5$.",
        "steps": [
          {
            "do": "Name the first value",
            "result": "$2$",
            "why": "given"
          },
          {
            "do": "Name the second value",
            "result": "$5$",
            "why": "given"
          },
          {
            "do": "Find the difference",
            "result": "$5-2=3$",
            "why": "one operation"
          },
          {
            "do": "Scale the result",
            "result": "$3/5=0.6$",
            "why": "relative scale"
          },
          {
            "do": "State the estimate",
            "result": "$0.6$",
            "why": "final numeric quantity"
          }
        ],
        "answer": "The estimate is $0.6$."
      },
      {
        "problem": "Use conditioning to reduce an interval or error from $1$ to $1/8$.",
        "steps": [
          {
            "do": "Start with size",
            "result": "$1$",
            "why": "initial size"
          },
          {
            "do": "Apply first halving",
            "result": "$1/2$",
            "why": "one refinement"
          },
          {
            "do": "Apply second halving",
            "result": "$1/4$",
            "why": "two refinements"
          },
          {
            "do": "Apply third halving",
            "result": "$1/8$",
            "why": "three refinements"
          },
          {
            "do": "Compare",
            "result": "$1/8=0.125$",
            "why": "decimal scale"
          }
        ],
        "answer": "Three halvings give $1/8=0.125$."
      },
      {
        "problem": "Estimate amplification in conditioning when a factor $4$ acts on input error $0.002$.",
        "steps": [
          {
            "do": "Write input error",
            "result": "$0.002$",
            "why": "given"
          },
          {
            "do": "Write amplification",
            "result": "$4$",
            "why": "given factor"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot0.002$",
            "why": "propagate"
          },
          {
            "do": "Compute",
            "result": "$0.008$",
            "why": "output scale"
          },
          {
            "do": "Convert",
            "result": "$0.8\\%$",
            "why": "if interpreted relatively"
          }
        ],
        "answer": "The amplified error is $0.008$."
      },
      {
        "problem": "Check a stopping tolerance for conditioning: current change $3\\times10^{-5}$ and tolerance $10^{-4}$.",
        "steps": [
          {
            "do": "Write change",
            "result": "$3\\times10^{-5}$",
            "why": "given"
          },
          {
            "do": "Write tolerance",
            "result": "$10^{-4}$",
            "why": "given"
          },
          {
            "do": "Compare powers",
            "result": "$3\\times10^{-5}<10^{-4}$",
            "why": "because $0.00003<0.0001$"
          },
          {
            "do": "Apply rule",
            "result": "stop",
            "why": "change is below tolerance"
          },
          {
            "do": "State result",
            "result": "criterion is satisfied",
            "why": "the computation is accurate enough by this test"
          }
        ],
        "answer": "The stopping criterion is satisfied."
      },
      {
        "problem": "Connect conditioning to an ML number: a loss changes from $2.000$ to $1.996$. Find absolute and relative change.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$1.996-2.000=-0.004$",
            "why": "signed change"
          },
          {
            "do": "Absolute change",
            "result": "$0.004$",
            "why": "distance"
          },
          {
            "do": "Divide by old loss",
            "result": "$0.004/2.000$",
            "why": "relative change"
          },
          {
            "do": "Simplify",
            "result": "$0.002$",
            "why": "decimal"
          },
          {
            "do": "Convert",
            "result": "$0.2\\%$",
            "why": "percent"
          }
        ],
        "answer": "The loss decreased by $0.004$, which is $0.2%$ of the old loss."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on conditioning because many small floating-point operations accumulate over millions of examples.",
        "numbers": "A perturbation $10^{-6}$ amplified by $20$ gives $2\\times10^{-5}."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use conditioning to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "A tolerance $10^{-8}$ is stricter than $10^{-6}$ by a factor of $100."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed conditioning for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "Three halvings take width $1$ to $0.125."
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use conditioning when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "A step from loss $5.0$ to $4.9$ changes the value by $0.1"
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make conditioning visible before a model is even trained.",
        "numbers": "Standardizing $x=130$ with mean $100$ and scale $15$ gives $z=2."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need conditioning because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "A production score moving from $0.700$ to $0.707$ changes by $1\\%$ relative."
      }
    ],
    "applicationsClose": "Across these examples, conditioning is one idea wearing several practical uniforms.",
    "takeaways": [
      "Know the defining rule for conditioning.",
      "Track the numerical size of every step.",
      "Use tolerances and checks rather than wishful exactness.",
      "Connect the arithmetic back to algorithm behavior."
    ]
  },
  "math-08-07": {
    "id": "math-08-07",
    "title": "Stability of algorithms",
    "tagline": "A stable algorithm gives nearly the right answer to a nearby problem.",
    "connections": {
      "buildsOn": [
        "Conditioning of problems",
        "Machine epsilon and rounding",
        "Error propagation"
      ],
      "leadsTo": [
        "Bisection",
        "Newton method",
        "LU factorization"
      ],
      "usedWith": [
        "backward error",
        "forward error",
        "recurrences",
        "matrix factorizations"
      ]
    },
    "motivation": "<p>Two algorithms can solve the same exact problem and behave very differently on a computer. One absorbs roundoff; another amplifies it.</p><p>Stability is the algorithmic side of numerical trust, while conditioning belongs to the problem itself.</p>",
    "definition": "<p><b>Forward error</b> compares the computed answer $\\hat y$ with the exact answer $y$. <b>Backward error</b> asks how much the input would need to change so that $\\hat y$ is exact for the changed problem.</p><p>A backward stable algorithm solves a nearby problem exactly. With a well-conditioned problem, that nearby problem has a nearby answer.</p><p><b>Assumptions that matter:</b> stable algorithms can still suffer on ill-conditioned problems; unstable recurrences amplify roundoff; and stability depends on the arithmetic model.</p>",
    "worked": {
      "problem": "If $\\kappa=20$ and backward error is $3\\times10^{-8}$, estimate forward error.",
      "skills": [
        "conditioning",
        "backward error",
        "forward error"
      ],
      "strategy": "Use the core rule of stability one careful step at a time.",
      "steps": [
        {
          "do": "Use relation",
          "result": "$\\text{forward}\\approx\\kappa\\cdot\\text{backward}$",
          "why": "conditioning links them"
        },
        {
          "do": "Substitute",
          "result": "$20\\cdot3\\times10^{-8}$",
          "why": "given values"
        },
        {
          "do": "Multiply",
          "result": "$60\\times10^{-8}$",
          "why": "constants"
        },
        {
          "do": "Normalize",
          "result": "$6\\times10^{-7}$",
          "why": "scientific notation"
        },
        {
          "do": "Interpret",
          "result": "$0.00006\\%$",
          "why": "percent scale"
        }
      ],
      "verify": "The forward error is twenty times the backward error, as expected.",
      "answer": "Estimated forward relative error is $6\\times10^{-7}$.",
      "connects": "This is stability in its most useful numerical form."
    },
    "practice": [
      {
        "problem": "Compute a basic numerical estimate for stability with values $2$ and $5$.",
        "steps": [
          {
            "do": "Name the first value",
            "result": "$2$",
            "why": "given"
          },
          {
            "do": "Name the second value",
            "result": "$5$",
            "why": "given"
          },
          {
            "do": "Find the difference",
            "result": "$5-2=3$",
            "why": "one operation"
          },
          {
            "do": "Scale the result",
            "result": "$3/5=0.6$",
            "why": "relative scale"
          },
          {
            "do": "State the estimate",
            "result": "$0.6$",
            "why": "final numeric quantity"
          }
        ],
        "answer": "The estimate is $0.6$."
      },
      {
        "problem": "Use stability to reduce an interval or error from $1$ to $1/8$.",
        "steps": [
          {
            "do": "Start with size",
            "result": "$1$",
            "why": "initial size"
          },
          {
            "do": "Apply first halving",
            "result": "$1/2$",
            "why": "one refinement"
          },
          {
            "do": "Apply second halving",
            "result": "$1/4$",
            "why": "two refinements"
          },
          {
            "do": "Apply third halving",
            "result": "$1/8$",
            "why": "three refinements"
          },
          {
            "do": "Compare",
            "result": "$1/8=0.125$",
            "why": "decimal scale"
          }
        ],
        "answer": "Three halvings give $1/8=0.125$."
      },
      {
        "problem": "Estimate amplification in stability when a factor $4$ acts on input error $0.002$.",
        "steps": [
          {
            "do": "Write input error",
            "result": "$0.002$",
            "why": "given"
          },
          {
            "do": "Write amplification",
            "result": "$4$",
            "why": "given factor"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot0.002$",
            "why": "propagate"
          },
          {
            "do": "Compute",
            "result": "$0.008$",
            "why": "output scale"
          },
          {
            "do": "Convert",
            "result": "$0.8\\%$",
            "why": "if interpreted relatively"
          }
        ],
        "answer": "The amplified error is $0.008$."
      },
      {
        "problem": "Check a stopping tolerance for stability: current change $3\\times10^{-5}$ and tolerance $10^{-4}$.",
        "steps": [
          {
            "do": "Write change",
            "result": "$3\\times10^{-5}$",
            "why": "given"
          },
          {
            "do": "Write tolerance",
            "result": "$10^{-4}$",
            "why": "given"
          },
          {
            "do": "Compare powers",
            "result": "$3\\times10^{-5}<10^{-4}$",
            "why": "because $0.00003<0.0001$"
          },
          {
            "do": "Apply rule",
            "result": "stop",
            "why": "change is below tolerance"
          },
          {
            "do": "State result",
            "result": "criterion is satisfied",
            "why": "the computation is accurate enough by this test"
          }
        ],
        "answer": "The stopping criterion is satisfied."
      },
      {
        "problem": "Connect stability to an ML number: a loss changes from $2.000$ to $1.996$. Find absolute and relative change.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$1.996-2.000=-0.004$",
            "why": "signed change"
          },
          {
            "do": "Absolute change",
            "result": "$0.004$",
            "why": "distance"
          },
          {
            "do": "Divide by old loss",
            "result": "$0.004/2.000$",
            "why": "relative change"
          },
          {
            "do": "Simplify",
            "result": "$0.002$",
            "why": "decimal"
          },
          {
            "do": "Convert",
            "result": "$0.2\\%$",
            "why": "percent"
          }
        ],
        "answer": "The loss decreased by $0.004$, which is $0.2%$ of the old loss."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on stability because many small floating-point operations accumulate over millions of examples.",
        "numbers": "A perturbation $10^{-6}$ amplified by $20$ gives $2\\times10^{-5}."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use stability to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "A tolerance $10^{-8}$ is stricter than $10^{-6}$ by a factor of $100."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed stability for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "Three halvings take width $1$ to $0.125."
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use stability when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "A step from loss $5.0$ to $4.9$ changes the value by $0.1"
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make stability visible before a model is even trained.",
        "numbers": "Standardizing $x=130$ with mean $100$ and scale $15$ gives $z=2."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need stability because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "A production score moving from $0.700$ to $0.707$ changes by $1\\%$ relative."
      }
    ],
    "applicationsClose": "Across these examples, stability is one idea wearing several practical uniforms.",
    "takeaways": [
      "Know the defining rule for stability.",
      "Track the numerical size of every step.",
      "Use tolerances and checks rather than wishful exactness.",
      "Connect the arithmetic back to algorithm behavior."
    ]
  },
  "math-08-08": {
    "id": "math-08-08",
    "title": "Bisection",
    "tagline": "Bisection finds a root by keeping a trustworthy bracket and cutting uncertainty in half.",
    "connections": {
      "buildsOn": [
        "Continuity",
        "The Intermediate Value Theorem",
        "absolute error"
      ],
      "leadsTo": [
        "Newton method",
        "The secant method",
        "Fixed-point iteration"
      ],
      "usedWith": [
        "intervals",
        "sign changes",
        "stopping criteria",
        "one-sided limits"
      ]
    },
    "motivation": "<p>You already know how to find a hidden point by repeatedly asking which half it is in. Bisection brings that calm strategy to equations.</p><p>If a continuous function changes sign on an interval, a root is inside. Bisection keeps that promise alive at every step.</p>",
    "definition": "<p>For continuous $f$ with $f(a)f(b)<0$, bisection sets $m=(a+b)/2$, evaluates $f(m)$, and keeps the half interval where the sign change remains. After $n$ steps, width is $(b-a)/2^n$.</p><p>The formula comes from halving the interval every time. The method is slow compared with Newton, but very reliable.</p><p><b>Assumptions that matter:</b> continuity and opposite endpoint signs are required; the bracket may contain more than one root; and stopping can use interval width, residual, or both.</p>",
    "worked": {
      "problem": "Use two bisection steps for $f(x)=x^2-2$ on $[1,2]$.",
      "skills": [
        "sign changes",
        "midpoints",
        "brackets"
      ],
      "strategy": "Use the core rule of bisection one careful step at a time.",
      "steps": [
        {
          "do": "Check endpoints",
          "result": "$f(1)=-1,\\ f(2)=2$",
          "why": "sign change"
        },
        {
          "do": "First midpoint",
          "result": "$m_1=1.5$",
          "why": "average endpoints"
        },
        {
          "do": "Evaluate",
          "result": "$f(1.5)=0.25$",
          "why": "positive"
        },
        {
          "do": "Keep half",
          "result": "$[1,1.5]$",
          "why": "negative then positive"
        },
        {
          "do": "Second midpoint",
          "result": "$m_2=1.25$",
          "why": "halve again"
        },
        {
          "do": "Evaluate",
          "result": "$f(1.25)=-0.4375$",
          "why": "negative"
        },
        {
          "do": "Keep half",
          "result": "$[1.25,1.5]$",
          "why": "sign change remains"
        }
      ],
      "verify": "$\\sqrt2\\approx1.414$ lies inside $[1.25,1.5]$.",
      "answer": "After two steps, the bracket is $[1.25,1.5]$.",
      "connects": "This is bisection in its most useful numerical form."
    },
    "practice": [
      {
        "problem": "Compute a basic numerical estimate for bisection with values $2$ and $5$.",
        "steps": [
          {
            "do": "Name the first value",
            "result": "$2$",
            "why": "given"
          },
          {
            "do": "Name the second value",
            "result": "$5$",
            "why": "given"
          },
          {
            "do": "Find the difference",
            "result": "$5-2=3$",
            "why": "one operation"
          },
          {
            "do": "Scale the result",
            "result": "$3/5=0.6$",
            "why": "relative scale"
          },
          {
            "do": "State the estimate",
            "result": "$0.6$",
            "why": "final numeric quantity"
          }
        ],
        "answer": "The estimate is $0.6$."
      },
      {
        "problem": "Use bisection to reduce an interval or error from $1$ to $1/8$.",
        "steps": [
          {
            "do": "Start with size",
            "result": "$1$",
            "why": "initial size"
          },
          {
            "do": "Apply first halving",
            "result": "$1/2$",
            "why": "one refinement"
          },
          {
            "do": "Apply second halving",
            "result": "$1/4$",
            "why": "two refinements"
          },
          {
            "do": "Apply third halving",
            "result": "$1/8$",
            "why": "three refinements"
          },
          {
            "do": "Compare",
            "result": "$1/8=0.125$",
            "why": "decimal scale"
          }
        ],
        "answer": "Three halvings give $1/8=0.125$."
      },
      {
        "problem": "Estimate amplification in bisection when a factor $4$ acts on input error $0.002$.",
        "steps": [
          {
            "do": "Write input error",
            "result": "$0.002$",
            "why": "given"
          },
          {
            "do": "Write amplification",
            "result": "$4$",
            "why": "given factor"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot0.002$",
            "why": "propagate"
          },
          {
            "do": "Compute",
            "result": "$0.008$",
            "why": "output scale"
          },
          {
            "do": "Convert",
            "result": "$0.8\\%$",
            "why": "if interpreted relatively"
          }
        ],
        "answer": "The amplified error is $0.008$."
      },
      {
        "problem": "Check a stopping tolerance for bisection: current change $3\\times10^{-5}$ and tolerance $10^{-4}$.",
        "steps": [
          {
            "do": "Write change",
            "result": "$3\\times10^{-5}$",
            "why": "given"
          },
          {
            "do": "Write tolerance",
            "result": "$10^{-4}$",
            "why": "given"
          },
          {
            "do": "Compare powers",
            "result": "$3\\times10^{-5}<10^{-4}$",
            "why": "because $0.00003<0.0001$"
          },
          {
            "do": "Apply rule",
            "result": "stop",
            "why": "change is below tolerance"
          },
          {
            "do": "State result",
            "result": "criterion is satisfied",
            "why": "the computation is accurate enough by this test"
          }
        ],
        "answer": "The stopping criterion is satisfied."
      },
      {
        "problem": "Connect bisection to an ML number: a loss changes from $2.000$ to $1.996$. Find absolute and relative change.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$1.996-2.000=-0.004$",
            "why": "signed change"
          },
          {
            "do": "Absolute change",
            "result": "$0.004$",
            "why": "distance"
          },
          {
            "do": "Divide by old loss",
            "result": "$0.004/2.000$",
            "why": "relative change"
          },
          {
            "do": "Simplify",
            "result": "$0.002$",
            "why": "decimal"
          },
          {
            "do": "Convert",
            "result": "$0.2\\%$",
            "why": "percent"
          }
        ],
        "answer": "The loss decreased by $0.004$, which is $0.2%$ of the old loss."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on bisection because many small floating-point operations accumulate over millions of examples.",
        "numbers": "A perturbation $10^{-6}$ amplified by $20$ gives $2\\times10^{-5}."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use bisection to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "A tolerance $10^{-8}$ is stricter than $10^{-6}$ by a factor of $100."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed bisection for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "Three halvings take width $1$ to $0.125."
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use bisection when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "A step from loss $5.0$ to $4.9$ changes the value by $0.1"
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make bisection visible before a model is even trained.",
        "numbers": "Standardizing $x=130$ with mean $100$ and scale $15$ gives $z=2."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need bisection because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "A production score moving from $0.700$ to $0.707$ changes by $1\\%$ relative."
      }
    ],
    "applicationsClose": "Across these examples, bisection is one idea wearing several practical uniforms.",
    "takeaways": [
      "Know the defining rule for bisection.",
      "Track the numerical size of every step.",
      "Use tolerances and checks rather than wishful exactness.",
      "Connect the arithmetic back to algorithm behavior."
    ]
  },
  "math-08-09": {
    "id": "math-08-09",
    "title": "Newton's method",
    "tagline": "Newton's method follows the tangent line to a root, often arriving very quickly from a good start.",
    "connections": {
      "buildsOn": [
        "derivatives",
        "linear approximation",
        "Bisection"
      ],
      "leadsTo": [
        "The secant method",
        "Fixed-point iteration",
        "optimization algorithms"
      ],
      "usedWith": [
        "Taylor approximation",
        "tangent lines",
        "stopping criteria",
        "conditioning"
      ]
    },
    "motivation": "<p>You already know a tangent line is the best local linear picture of a curve. Newton's method turns that picture into a move toward a root.</p><p>At the current guess, draw the tangent and jump to where that line crosses zero. Close to a simple root, the improvement can be dramatic.</p>",
    "definition": "<p>To solve $f(x)=0$, Newton's method uses $x_{n+1}=x_n-\\dfrac{f(x_n)}{f'(x_n)}$. It comes from setting the tangent approximation $f(x_n)+f'(x_n)(x-x_n)$ equal to zero and solving for $x$.</p><p><b>Assumptions that matter:</b> $f'(x_n)$ must not be zero; convergence is local, not guaranteed from every start; multiple roots slow convergence; and good solvers check both step size and residual.</p>",
    "worked": {
      "problem": "Use Newton method for $x^2-2$ from $x_0=1.5$ for two iterations.",
      "skills": [
        "derivatives",
        "iteration",
        "root approximation"
      ],
      "strategy": "Use the core rule of Newton method one careful step at a time.",
      "steps": [
        {
          "do": "Differentiate",
          "result": "$f'(x)=2x$",
          "why": "tangent slope"
        },
        {
          "do": "Write update",
          "result": "$x_{n+1}=x_n-\\dfrac{x_n^2-2}{2x_n}$",
          "why": "Newton formula"
        },
        {
          "do": "Compute $x_1$",
          "result": "$1.5-0.25/3=1.4166667$",
          "why": "first step"
        },
        {
          "do": "Compute residual",
          "result": "$1.4166667^2-2\\approx0.0069444$",
          "why": "prepare second step"
        },
        {
          "do": "Compute $x_2$",
          "result": "$1.4166667-0.0069444/2.8333334\\approx1.4142157$",
          "why": "second step"
        }
      ],
      "verify": "$\\sqrt2\\approx1.4142136$, so the second iterate is very close.",
      "answer": "$x_1\\approx1.4166667$, $x_2\\approx1.4142157$.",
      "connects": "This is Newton method in its most useful numerical form."
    },
    "practice": [
      {
        "problem": "Compute a basic numerical estimate for Newton method with values $2$ and $5$.",
        "steps": [
          {
            "do": "Name the first value",
            "result": "$2$",
            "why": "given"
          },
          {
            "do": "Name the second value",
            "result": "$5$",
            "why": "given"
          },
          {
            "do": "Find the difference",
            "result": "$5-2=3$",
            "why": "one operation"
          },
          {
            "do": "Scale the result",
            "result": "$3/5=0.6$",
            "why": "relative scale"
          },
          {
            "do": "State the estimate",
            "result": "$0.6$",
            "why": "final numeric quantity"
          }
        ],
        "answer": "The estimate is $0.6$."
      },
      {
        "problem": "Use Newton method to reduce an interval or error from $1$ to $1/8$.",
        "steps": [
          {
            "do": "Start with size",
            "result": "$1$",
            "why": "initial size"
          },
          {
            "do": "Apply first halving",
            "result": "$1/2$",
            "why": "one refinement"
          },
          {
            "do": "Apply second halving",
            "result": "$1/4$",
            "why": "two refinements"
          },
          {
            "do": "Apply third halving",
            "result": "$1/8$",
            "why": "three refinements"
          },
          {
            "do": "Compare",
            "result": "$1/8=0.125$",
            "why": "decimal scale"
          }
        ],
        "answer": "Three halvings give $1/8=0.125$."
      },
      {
        "problem": "Estimate amplification in Newton method when a factor $4$ acts on input error $0.002$.",
        "steps": [
          {
            "do": "Write input error",
            "result": "$0.002$",
            "why": "given"
          },
          {
            "do": "Write amplification",
            "result": "$4$",
            "why": "given factor"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot0.002$",
            "why": "propagate"
          },
          {
            "do": "Compute",
            "result": "$0.008$",
            "why": "output scale"
          },
          {
            "do": "Convert",
            "result": "$0.8\\%$",
            "why": "if interpreted relatively"
          }
        ],
        "answer": "The amplified error is $0.008$."
      },
      {
        "problem": "Check a stopping tolerance for Newton method: current change $3\\times10^{-5}$ and tolerance $10^{-4}$.",
        "steps": [
          {
            "do": "Write change",
            "result": "$3\\times10^{-5}$",
            "why": "given"
          },
          {
            "do": "Write tolerance",
            "result": "$10^{-4}$",
            "why": "given"
          },
          {
            "do": "Compare powers",
            "result": "$3\\times10^{-5}<10^{-4}$",
            "why": "because $0.00003<0.0001$"
          },
          {
            "do": "Apply rule",
            "result": "stop",
            "why": "change is below tolerance"
          },
          {
            "do": "State result",
            "result": "criterion is satisfied",
            "why": "the computation is accurate enough by this test"
          }
        ],
        "answer": "The stopping criterion is satisfied."
      },
      {
        "problem": "Connect Newton method to an ML number: a loss changes from $2.000$ to $1.996$. Find absolute and relative change.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$1.996-2.000=-0.004$",
            "why": "signed change"
          },
          {
            "do": "Absolute change",
            "result": "$0.004$",
            "why": "distance"
          },
          {
            "do": "Divide by old loss",
            "result": "$0.004/2.000$",
            "why": "relative change"
          },
          {
            "do": "Simplify",
            "result": "$0.002$",
            "why": "decimal"
          },
          {
            "do": "Convert",
            "result": "$0.2\\%$",
            "why": "percent"
          }
        ],
        "answer": "The loss decreased by $0.004$, which is $0.2%$ of the old loss."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on Newton method because many small floating-point operations accumulate over millions of examples.",
        "numbers": "A perturbation $10^{-6}$ amplified by $20$ gives $2\\times10^{-5}."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use Newton method to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "A tolerance $10^{-8}$ is stricter than $10^{-6}$ by a factor of $100."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed Newton method for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "Three halvings take width $1$ to $0.125."
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use Newton method when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "A step from loss $5.0$ to $4.9$ changes the value by $0.1"
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make Newton method visible before a model is even trained.",
        "numbers": "Standardizing $x=130$ with mean $100$ and scale $15$ gives $z=2."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need Newton method because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "A production score moving from $0.700$ to $0.707$ changes by $1\\%$ relative."
      }
    ],
    "applicationsClose": "Across these examples, Newton method is one idea wearing several practical uniforms.",
    "takeaways": [
      "Know the defining rule for Newton method.",
      "Track the numerical size of every step.",
      "Use tolerances and checks rather than wishful exactness.",
      "Connect the arithmetic back to algorithm behavior."
    ]
  },
  "math-08-10": {
    "id": "math-08-10",
    "title": "The secant method",
    "tagline": "The secant method keeps Newton tangent idea but estimates the slope from two recent points.",
    "connections": {
      "buildsOn": [
        "Newton method",
        "slopes of lines",
        "Bisection"
      ],
      "leadsTo": [
        "Fixed-point iteration",
        "quasi-Newton methods",
        "root-finding comparisons"
      ],
      "usedWith": [
        "finite differences",
        "linear interpolation",
        "stopping criteria",
        "recurrences"
      ]
    },
    "motivation": "<p>Newton is wonderful when derivatives are easy. When they are expensive or unavailable, the secant method uses two function values to estimate the slope.</p><p>It is a practical compromise: often faster than bisection and less demanding than Newton.</p>",
    "definition": "<p>Given $x_{n-1}$ and $x_n$, the secant method uses $x_{n+1}=x_n-f(x_n)\\dfrac{x_n-x_{n-1}}{f(x_n)-f(x_{n-1})}$. This is the $x$-intercept of the line through the two recent points.</p><p>The formula comes from replacing the tangent line by a secant line, setting that line equal to zero, and solving for the intercept.</p><p><b>Assumptions that matter:</b> the denominator must not be zero; the method does not always preserve a bracket; and convergence near a simple root is superlinear but not globally guaranteed.</p>",
    "worked": {
      "problem": "Use one secant step for $x^2-2$ with $x_0=1$ and $x_1=2$.",
      "skills": [
        "secant slopes",
        "function evaluation",
        "root updates"
      ],
      "strategy": "Use the core rule of secant method one careful step at a time.",
      "steps": [
        {
          "do": "Evaluate first",
          "result": "$f(1)=-1$",
          "why": "left value"
        },
        {
          "do": "Evaluate second",
          "result": "$f(2)=2$",
          "why": "right value"
        },
        {
          "do": "Write update",
          "result": "$x_2=2-2\\dfrac{2-1}{2-(-1)}$",
          "why": "substitute"
        },
        {
          "do": "Simplify correction",
          "result": "$2/3$",
          "why": "fraction"
        },
        {
          "do": "Compute",
          "result": "$x_2=4/3$",
          "why": "new approximation"
        }
      ],
      "verify": "$4/3\\approx1.333$ is on one side of $\\sqrt2\\approx1.414$, ready for refinement.",
      "answer": "$x_2=4/3$.",
      "connects": "This is secant method in its most useful numerical form."
    },
    "practice": [
      {
        "problem": "Compute a basic numerical estimate for secant method with values $2$ and $5$.",
        "steps": [
          {
            "do": "Name the first value",
            "result": "$2$",
            "why": "given"
          },
          {
            "do": "Name the second value",
            "result": "$5$",
            "why": "given"
          },
          {
            "do": "Find the difference",
            "result": "$5-2=3$",
            "why": "one operation"
          },
          {
            "do": "Scale the result",
            "result": "$3/5=0.6$",
            "why": "relative scale"
          },
          {
            "do": "State the estimate",
            "result": "$0.6$",
            "why": "final numeric quantity"
          }
        ],
        "answer": "The estimate is $0.6$."
      },
      {
        "problem": "Use secant method to reduce an interval or error from $1$ to $1/8$.",
        "steps": [
          {
            "do": "Start with size",
            "result": "$1$",
            "why": "initial size"
          },
          {
            "do": "Apply first halving",
            "result": "$1/2$",
            "why": "one refinement"
          },
          {
            "do": "Apply second halving",
            "result": "$1/4$",
            "why": "two refinements"
          },
          {
            "do": "Apply third halving",
            "result": "$1/8$",
            "why": "three refinements"
          },
          {
            "do": "Compare",
            "result": "$1/8=0.125$",
            "why": "decimal scale"
          }
        ],
        "answer": "Three halvings give $1/8=0.125$."
      },
      {
        "problem": "Estimate amplification in secant method when a factor $4$ acts on input error $0.002$.",
        "steps": [
          {
            "do": "Write input error",
            "result": "$0.002$",
            "why": "given"
          },
          {
            "do": "Write amplification",
            "result": "$4$",
            "why": "given factor"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot0.002$",
            "why": "propagate"
          },
          {
            "do": "Compute",
            "result": "$0.008$",
            "why": "output scale"
          },
          {
            "do": "Convert",
            "result": "$0.8\\%$",
            "why": "if interpreted relatively"
          }
        ],
        "answer": "The amplified error is $0.008$."
      },
      {
        "problem": "Check a stopping tolerance for secant method: current change $3\\times10^{-5}$ and tolerance $10^{-4}$.",
        "steps": [
          {
            "do": "Write change",
            "result": "$3\\times10^{-5}$",
            "why": "given"
          },
          {
            "do": "Write tolerance",
            "result": "$10^{-4}$",
            "why": "given"
          },
          {
            "do": "Compare powers",
            "result": "$3\\times10^{-5}<10^{-4}$",
            "why": "because $0.00003<0.0001$"
          },
          {
            "do": "Apply rule",
            "result": "stop",
            "why": "change is below tolerance"
          },
          {
            "do": "State result",
            "result": "criterion is satisfied",
            "why": "the computation is accurate enough by this test"
          }
        ],
        "answer": "The stopping criterion is satisfied."
      },
      {
        "problem": "Connect secant method to an ML number: a loss changes from $2.000$ to $1.996$. Find absolute and relative change.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$1.996-2.000=-0.004$",
            "why": "signed change"
          },
          {
            "do": "Absolute change",
            "result": "$0.004$",
            "why": "distance"
          },
          {
            "do": "Divide by old loss",
            "result": "$0.004/2.000$",
            "why": "relative change"
          },
          {
            "do": "Simplify",
            "result": "$0.002$",
            "why": "decimal"
          },
          {
            "do": "Convert",
            "result": "$0.2\\%$",
            "why": "percent"
          }
        ],
        "answer": "The loss decreased by $0.004$, which is $0.2%$ of the old loss."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on secant method because many small floating-point operations accumulate over millions of examples.",
        "numbers": "A perturbation $10^{-6}$ amplified by $20$ gives $2\\times10^{-5}."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use secant method to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "A tolerance $10^{-8}$ is stricter than $10^{-6}$ by a factor of $100."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed secant method for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "Three halvings take width $1$ to $0.125."
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use secant method when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "A step from loss $5.0$ to $4.9$ changes the value by $0.1"
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make secant method visible before a model is even trained.",
        "numbers": "Standardizing $x=130$ with mean $100$ and scale $15$ gives $z=2."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need secant method because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "A production score moving from $0.700$ to $0.707$ changes by $1\\%$ relative."
      }
    ],
    "applicationsClose": "Across these examples, secant method is one idea wearing several practical uniforms.",
    "takeaways": [
      "Know the defining rule for secant method.",
      "Track the numerical size of every step.",
      "Use tolerances and checks rather than wishful exactness.",
      "Connect the arithmetic back to algorithm behavior."
    ]
  },
  "math-08-11": {
    "id": "math-08-11",
    "title": "Fixed-point iteration",
    "tagline": "Fixed-point iteration solves by repeating a rule whose output should eventually equal its input.",
    "connections": {
      "buildsOn": [
        "Functions and their graphs",
        "Bisection",
        "Newton method"
      ],
      "leadsTo": [
        "contraction mappings",
        "iterative linear solvers",
        "optimization algorithms"
      ],
      "usedWith": [
        "recurrences",
        "derivatives",
        "convergence rates",
        "stability"
      ]
    },
    "motivation": "<p>You already understand repetition that settles: update, check, update again. Fixed-point iteration gives that habit a mathematical form.</p><p>Rewrite a problem as $x=g(x)$, then iterate $x_{n+1}=g(x_n)$ until the value barely changes.</p>",
    "definition": "<p>A <b>fixed point</b> of $g$ is a value $x^*$ with $g(x^*)=x^*$. The iteration $x_{n+1}=g(x_n)$ converges locally when the error shrinks. If $|g'(x^*)|<1$, nearby errors usually contract.</p><p>The reason is linearization: $x_{n+1}-x^*=g(x_n)-g(x^*)\\approx g'(x^*)(x_n-x^*)$.</p><p><b>Assumptions that matter:</b> convergence depends on the chosen rearrangement $g$; the starting point matters; and $|g'(x^*)|>1$ usually repels nearby iterates.</p>",
    "worked": {
      "problem": "Iterate $x_{n+1}=\\cos x_n$ from $x_0=0.5$ for three steps.",
      "skills": [
        "iteration",
        "fixed points",
        "convergence"
      ],
      "strategy": "Use the core rule of fixed-point iteration one careful step at a time.",
      "steps": [
        {
          "do": "Start",
          "result": "$x_0=0.5$",
          "why": "given"
        },
        {
          "do": "First step",
          "result": "$x_1=\\cos0.5\\approx0.8776$",
          "why": "apply rule"
        },
        {
          "do": "Second step",
          "result": "$x_2=\\cos0.8776\\approx0.6390$",
          "why": "repeat"
        },
        {
          "do": "Third step",
          "result": "$x_3=\\cos0.6390\\approx0.8027$",
          "why": "repeat"
        },
        {
          "do": "Interpret",
          "result": "values move toward about $0.739$",
          "why": "solution of $x=cos x$"
        }
      ],
      "verify": "At $x\\approx0.739$, $\\cos x\\approx0.739$.",
      "answer": "$x_1\\approx0.8776$, $x_2\\approx0.6390$, $x_3\\approx0.8027$.",
      "connects": "This is fixed-point iteration in its most useful numerical form."
    },
    "practice": [
      {
        "problem": "Compute a basic numerical estimate for fixed-point iteration with values $2$ and $5$.",
        "steps": [
          {
            "do": "Name the first value",
            "result": "$2$",
            "why": "given"
          },
          {
            "do": "Name the second value",
            "result": "$5$",
            "why": "given"
          },
          {
            "do": "Find the difference",
            "result": "$5-2=3$",
            "why": "one operation"
          },
          {
            "do": "Scale the result",
            "result": "$3/5=0.6$",
            "why": "relative scale"
          },
          {
            "do": "State the estimate",
            "result": "$0.6$",
            "why": "final numeric quantity"
          }
        ],
        "answer": "The estimate is $0.6$."
      },
      {
        "problem": "Use fixed-point iteration to reduce an interval or error from $1$ to $1/8$.",
        "steps": [
          {
            "do": "Start with size",
            "result": "$1$",
            "why": "initial size"
          },
          {
            "do": "Apply first halving",
            "result": "$1/2$",
            "why": "one refinement"
          },
          {
            "do": "Apply second halving",
            "result": "$1/4$",
            "why": "two refinements"
          },
          {
            "do": "Apply third halving",
            "result": "$1/8$",
            "why": "three refinements"
          },
          {
            "do": "Compare",
            "result": "$1/8=0.125$",
            "why": "decimal scale"
          }
        ],
        "answer": "Three halvings give $1/8=0.125$."
      },
      {
        "problem": "Estimate amplification in fixed-point iteration when a factor $4$ acts on input error $0.002$.",
        "steps": [
          {
            "do": "Write input error",
            "result": "$0.002$",
            "why": "given"
          },
          {
            "do": "Write amplification",
            "result": "$4$",
            "why": "given factor"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot0.002$",
            "why": "propagate"
          },
          {
            "do": "Compute",
            "result": "$0.008$",
            "why": "output scale"
          },
          {
            "do": "Convert",
            "result": "$0.8\\%$",
            "why": "if interpreted relatively"
          }
        ],
        "answer": "The amplified error is $0.008$."
      },
      {
        "problem": "Check a stopping tolerance for fixed-point iteration: current change $3\\times10^{-5}$ and tolerance $10^{-4}$.",
        "steps": [
          {
            "do": "Write change",
            "result": "$3\\times10^{-5}$",
            "why": "given"
          },
          {
            "do": "Write tolerance",
            "result": "$10^{-4}$",
            "why": "given"
          },
          {
            "do": "Compare powers",
            "result": "$3\\times10^{-5}<10^{-4}$",
            "why": "because $0.00003<0.0001$"
          },
          {
            "do": "Apply rule",
            "result": "stop",
            "why": "change is below tolerance"
          },
          {
            "do": "State result",
            "result": "criterion is satisfied",
            "why": "the computation is accurate enough by this test"
          }
        ],
        "answer": "The stopping criterion is satisfied."
      },
      {
        "problem": "Connect fixed-point iteration to an ML number: a loss changes from $2.000$ to $1.996$. Find absolute and relative change.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$1.996-2.000=-0.004$",
            "why": "signed change"
          },
          {
            "do": "Absolute change",
            "result": "$0.004$",
            "why": "distance"
          },
          {
            "do": "Divide by old loss",
            "result": "$0.004/2.000$",
            "why": "relative change"
          },
          {
            "do": "Simplify",
            "result": "$0.002$",
            "why": "decimal"
          },
          {
            "do": "Convert",
            "result": "$0.2\\%$",
            "why": "percent"
          }
        ],
        "answer": "The loss decreased by $0.004$, which is $0.2%$ of the old loss."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on fixed-point iteration because many small floating-point operations accumulate over millions of examples.",
        "numbers": "A perturbation $10^{-6}$ amplified by $20$ gives $2\\times10^{-5}."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use fixed-point iteration to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "A tolerance $10^{-8}$ is stricter than $10^{-6}$ by a factor of $100."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed fixed-point iteration for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "Three halvings take width $1$ to $0.125."
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use fixed-point iteration when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "A step from loss $5.0$ to $4.9$ changes the value by $0.1"
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make fixed-point iteration visible before a model is even trained.",
        "numbers": "Standardizing $x=130$ with mean $100$ and scale $15$ gives $z=2."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need fixed-point iteration because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "A production score moving from $0.700$ to $0.707$ changes by $1\\%$ relative."
      }
    ],
    "applicationsClose": "Across these examples, fixed-point iteration is one idea wearing several practical uniforms.",
    "takeaways": [
      "Know the defining rule for fixed-point iteration.",
      "Track the numerical size of every step.",
      "Use tolerances and checks rather than wishful exactness.",
      "Connect the arithmetic back to algorithm behavior."
    ]
  },
  "math-08-12": {
    "id": "math-08-12",
    "title": "LU factorization",
    "tagline": "LU factorization solves many linear systems by turning one matrix into two triangular problems.",
    "connections": {
      "buildsOn": [
        "matrices",
        "systems of linear equations",
        "Stability of algorithms"
      ],
      "leadsTo": [
        "matrix conditioning",
        "least squares",
        "numerical linear algebra"
      ],
      "usedWith": [
        "Gaussian elimination",
        "triangular solves",
        "permutation matrices",
        "determinants"
      ]
    },
    "motivation": "<p>You already know a system is easier when one equation has one unknown. Triangular systems have that staircase shape.</p><p>LU factorization rewrites $A$ as $LU$, so solving $Ax=b$ becomes $Ly=b$ and $Ux=y$.</p>",
    "definition": "<p>An <b>LU factorization</b> writes $A=LU$, where $L$ is lower triangular and $U$ is upper triangular. With pivoting, practical algorithms use $PA=LU$, where $P$ records row swaps.</p><p>Gaussian elimination creates this factorization: elimination multipliers are stored in $L$, and the final echelon matrix is $U$.</p><p><b>Assumptions that matter:</b> nonzero pivots are needed without row swaps; pivoting improves stability; ill-conditioned matrices still give sensitive solutions; and triangular solves are cheap once $LU$ is available.</p>",
    "worked": {
      "problem": "Factor $A=\\begin{bmatrix}2&1\\\\4&3\\end{bmatrix}$ as $LU$ without pivoting.",
      "skills": [
        "Gaussian elimination",
        "triangular matrices",
        "matrix multiplication"
      ],
      "strategy": "Use the core rule of LU factorization one careful step at a time.",
      "steps": [
        {
          "do": "Choose pivot",
          "result": "$2$",
          "why": "top-left entry"
        },
        {
          "do": "Compute multiplier",
          "result": "$m=4/2=2$",
          "why": "row 2 elimination factor"
        },
        {
          "do": "Eliminate",
          "result": "$[4,3]-2[2,1]=[0,1]$",
          "why": "new row 2"
        },
        {
          "do": "Write $U$",
          "result": "$U=\\begin{bmatrix}2&1\\\\0&1\\end{bmatrix}$",
          "why": "upper triangular"
        },
        {
          "do": "Write $L$",
          "result": "$L=\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}$",
          "why": "store multiplier"
        },
        {
          "do": "Check",
          "result": "$LU=\\begin{bmatrix}2&1\\\\4&3\\end{bmatrix}$",
          "why": "recovers $A$"
        }
      ],
      "verify": "The second row of $LU$ is $2[2,1]+[0,1]=[4,3]$.",
      "answer": "$L=\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}$ and $U=\\begin{bmatrix}2&1\\\\0&1\\end{bmatrix}$.",
      "connects": "This is LU factorization in its most useful numerical form."
    },
    "practice": [
      {
        "problem": "Compute a basic numerical estimate for LU factorization with values $2$ and $5$.",
        "steps": [
          {
            "do": "Name the first value",
            "result": "$2$",
            "why": "given"
          },
          {
            "do": "Name the second value",
            "result": "$5$",
            "why": "given"
          },
          {
            "do": "Find the difference",
            "result": "$5-2=3$",
            "why": "one operation"
          },
          {
            "do": "Scale the result",
            "result": "$3/5=0.6$",
            "why": "relative scale"
          },
          {
            "do": "State the estimate",
            "result": "$0.6$",
            "why": "final numeric quantity"
          }
        ],
        "answer": "The estimate is $0.6$."
      },
      {
        "problem": "Use LU factorization to reduce an interval or error from $1$ to $1/8$.",
        "steps": [
          {
            "do": "Start with size",
            "result": "$1$",
            "why": "initial size"
          },
          {
            "do": "Apply first halving",
            "result": "$1/2$",
            "why": "one refinement"
          },
          {
            "do": "Apply second halving",
            "result": "$1/4$",
            "why": "two refinements"
          },
          {
            "do": "Apply third halving",
            "result": "$1/8$",
            "why": "three refinements"
          },
          {
            "do": "Compare",
            "result": "$1/8=0.125$",
            "why": "decimal scale"
          }
        ],
        "answer": "Three halvings give $1/8=0.125$."
      },
      {
        "problem": "Estimate amplification in LU factorization when a factor $4$ acts on input error $0.002$.",
        "steps": [
          {
            "do": "Write input error",
            "result": "$0.002$",
            "why": "given"
          },
          {
            "do": "Write amplification",
            "result": "$4$",
            "why": "given factor"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot0.002$",
            "why": "propagate"
          },
          {
            "do": "Compute",
            "result": "$0.008$",
            "why": "output scale"
          },
          {
            "do": "Convert",
            "result": "$0.8\\%$",
            "why": "if interpreted relatively"
          }
        ],
        "answer": "The amplified error is $0.008$."
      },
      {
        "problem": "Check a stopping tolerance for LU factorization: current change $3\\times10^{-5}$ and tolerance $10^{-4}$.",
        "steps": [
          {
            "do": "Write change",
            "result": "$3\\times10^{-5}$",
            "why": "given"
          },
          {
            "do": "Write tolerance",
            "result": "$10^{-4}$",
            "why": "given"
          },
          {
            "do": "Compare powers",
            "result": "$3\\times10^{-5}<10^{-4}$",
            "why": "because $0.00003<0.0001$"
          },
          {
            "do": "Apply rule",
            "result": "stop",
            "why": "change is below tolerance"
          },
          {
            "do": "State result",
            "result": "criterion is satisfied",
            "why": "the computation is accurate enough by this test"
          }
        ],
        "answer": "The stopping criterion is satisfied."
      },
      {
        "problem": "Connect LU factorization to an ML number: a loss changes from $2.000$ to $1.996$. Find absolute and relative change.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$1.996-2.000=-0.004$",
            "why": "signed change"
          },
          {
            "do": "Absolute change",
            "result": "$0.004$",
            "why": "distance"
          },
          {
            "do": "Divide by old loss",
            "result": "$0.004/2.000$",
            "why": "relative change"
          },
          {
            "do": "Simplify",
            "result": "$0.002$",
            "why": "decimal"
          },
          {
            "do": "Convert",
            "result": "$0.2\\%$",
            "why": "percent"
          }
        ],
        "answer": "The loss decreased by $0.004$, which is $0.2%$ of the old loss."
      }
    ],
    "applications": [
      {
        "title": "Model training numerics",
        "background": "Training pipelines depend on LU factorization because many small floating-point operations accumulate over millions of examples.",
        "numbers": "A perturbation $10^{-6}$ amplified by $20$ gives $2\\times10^{-5}."
      },
      {
        "title": "Validation and testing",
        "background": "Numerical tests use LU factorization to decide whether a computed value is trustworthy rather than exactly equal.",
        "numbers": "A tolerance $10^{-8}$ is stricter than $10^{-6}$ by a factor of $100."
      },
      {
        "title": "Scientific computing history",
        "background": "Classical numerical analysis developed LU factorization for tables, simulations, and engineering calculations long before modern ML.",
        "numbers": "Three halvings take width $1$ to $0.125."
      },
      {
        "title": "Optimization workflows",
        "background": "Gradient methods and line searches use LU factorization when choosing steps, tolerances, or safe fallbacks.",
        "numbers": "A step from loss $5.0$ to $4.9$ changes the value by $0.1"
      },
      {
        "title": "Data preprocessing",
        "background": "Feature scaling and measurement noise make LU factorization visible before a model is even trained.",
        "numbers": "Standardizing $x=130$ with mean $100$ and scale $15$ gives $z=2."
      },
      {
        "title": "Production ML systems",
        "background": "Serving systems need LU factorization because repeated online computations must be fast, stable, and reproducible.",
        "numbers": "A production score moving from $0.700$ to $0.707$ changes by $1\\%$ relative."
      }
    ],
    "applicationsClose": "Across these examples, LU factorization is one idea wearing several practical uniforms.",
    "takeaways": [
      "Know the defining rule for LU factorization.",
      "Track the numerical size of every step.",
      "Use tolerances and checks rather than wishful exactness.",
      "Connect the arithmetic back to algorithm behavior."
    ]
  }
};
