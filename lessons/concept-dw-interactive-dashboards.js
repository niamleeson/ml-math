/* Data Wrangling — "Interactive charts & dashboards".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-interactive-dashboards". */
(function () {
  window.LESSONS.push({
    id: "dw-interactive-dashboards",
    title: "Interactive charts & dashboards",
    tagline: "Let the reader hover, zoom, and filter — and know when a still picture says it better.",
    module: "Data Wrangling",
    prereqs: ["dw-eda-workflow", "skill-monitoring"],

    whenToUse:
      `<p>A static chart shows <b>one</b> view that you chose. An <b>interactive</b> chart lets the reader
       choose their own view: hover to read exact numbers, zoom into a dense region, pan around, switch a
       filter, or <b>brush</b> a selection in one panel and watch a second panel update. Reach for
       interactivity when:</p>
       <ul>
         <li><b>Exploration.</b> You (or an analyst) are still poking at the data and don't yet know which
         slice matters. Hover and zoom let you drill in without re-plotting.</li>
         <li><b>Many dimensions.</b> Color, size, hover text, and a filter dropdown let one chart carry far
         more than the two axes a static figure shows.</li>
         <li><b>Self-serve audiences.</b> A whole team needs to answer slightly different questions from the
         same data. A <b>dashboard</b> &mdash; charts plus filters plus tables in one monitored view &mdash;
         lets each person filter to their own case instead of asking you for a new chart.</li>
         <li><b>Live monitoring.</b> A metric you watch over time (traffic, model accuracy, error rate)
         belongs on a dashboard that refreshes, with date and segment filters built in.</li>
       </ul>
       <p><b>When a clean static chart is better:</b> when there is a <b>single clear message</b> ("revenue
       doubled"), for <b>print or slides</b> (clicks don't work on paper), and for <b>reproducibility</b>
       (a saved figure is the exact same every time; an interactive view depends on what the reader clicked).
       <b>Interactive is not automatically better</b> &mdash; the extra controls can distract from the point
       you actually want to make.</p>`,

    application:
      `<p>Where interactive views and dashboards show up in real data work:</p>
       <ul>
         <li><b>Exploratory Data Analysis (EDA).</b> A <b>Plotly</b> or <b>Altair/Vega</b> scatter with
         hover tooltips lets you read off the exact row behind an outlier instead of guessing from the dot's
         position.</li>
         <li><b>Notebook drill-downs.</b> <b>Bokeh</b> and Plotly embed straight into a Jupyter notebook, so
         a teammate can zoom and pan your figure without re-running anything.</li>
         <li><b>Self-serve dashboards.</b> <b>Streamlit</b>, <b>Plotly Dash</b>, and <b>Panel</b> turn a
         Python script into a small web app: a filter widget on the left, a chart and a table on the right.
         <b>Business Intelligence (BI)</b> tools &mdash; <b>Tableau</b>, <b>Power BI</b>, <b>Looker</b> &mdash;
         do the same for non-coders.</li>
         <li><b>Monitoring.</b> A live dashboard of a model's accuracy by day and by segment is how teams
         catch drift early (see the monitoring lesson).</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Interactivity for its own sake.</b> Adding zoom, pan, and ten tooltips to a chart that has one
         simple message just <b>distracts</b>. The fix: if the figure makes its point at a glance, ship it as
         a static image.</li>
         <li><b>Dashboards no one maintains.</b> A dashboard wired to a query that silently breaks becomes a
         <b>liar</b> &mdash; it keeps showing stale or wrong numbers. The fix: give every dashboard an owner,
         a freshness indicator, and an alert when its data stops updating.</li>
         <li><b>Heavy, slow plots on big data.</b> Dumping a million points into an interactive scatter freezes
         the browser. The fix: <b>aggregate or subsample</b> before plotting (bin to a heatmap, sample a few
         thousand points), or use a tool built for scale.</li>
         <li><b>Non-reproducible and non-printable.</b> What a reader sees depends on what they clicked, and the
         live view won't paste into a slide or a paper. The fix: for the record, export a <b>static snapshot</b>
         of the exact view you mean.</li>
         <li><b>Hiding the key message behind clicks.</b> If the headline only appears after the reader filters
         and zooms, most readers will miss it. The fix: make the <b>default view</b> already tell the main
         story; interactivity is for going deeper, not for finding the point.</li>
         <li><b>Accessibility.</b> Hover-only tooltips fail for keyboard and screen-reader users, and color-only
         encodings fail for color-blind readers. The fix: keep a static, labeled alternative and use
         color-blind-safe palettes with redundant shape or text labels.</li>
       </ul>`,

    bigIdea:
      `<p>Every chart is a <b>function from data to pixels</b>. A <b>static</b> chart applies that function
       once, with choices you fixed: these axes, this zoom, this filter. An <b>interactive</b> chart keeps
       the function live, so the reader can change an input &mdash; the zoom window, a filter value, a hovered
       point &mdash; and the picture redraws.</p>
       <p>That is the whole idea, and it cuts both ways. Live re-rendering is wonderful for <b>exploration</b>
       and for letting many people ask their own questions. It is a liability when you need <b>one</b> fixed,
       reproducible, printable artifact. So the skill here is not "make it interactive" &mdash; it is
       <b>choosing</b> interactive versus static for the job in front of you, and, when you go interactive,
       choosing the right tool and not drowning the message in controls.</p>`,

    buildup:
      `<p>Think of three layers, from a single chart up to a monitored app.</p>
       <ul>
         <li><b>Interactive single chart.</b> Same chart you'd draw statically, but the library ships
         JavaScript so the browser handles <b>hover tooltips</b>, <b>zoom/pan</b>, and toggling series.
         Python options: <b>Plotly</b> (<code>plotly.express</code>), <b>Altair</b> (which compiles to the
         <b>Vega-Lite</b> grammar), and <b>Bokeh</b>.</li>
         <li><b>Linked / brushed charts.</b> Two or more charts that share a selection: drag a box (a
         <b>brush</b>) over points in one panel and the matching points light up in the others. Altair and
         Bokeh make this easy; it's the heart of real exploration across many dimensions.</li>
         <li><b>Dashboard.</b> Charts plus <b>filter widgets</b> plus <b>tables</b> arranged into one page that
         a non-author can use. In Python: <b>Streamlit</b>, <b>Plotly Dash</b>, <b>Panel</b>. For analysts
         without code: <b>BI</b> tools like <b>Tableau</b>, <b>Power BI</b>, and <b>Looker</b>. A monitoring
         dashboard adds a refresh and lives next to alerts.</li>
       </ul>
       <p>There's no heavy math here. The judgment is the lesson: match the layer to the audience and the
       message, and remember that the simplest layer that does the job is usually the right one.</p>`,

    example:
      `<p>You have a table of products with <code>price</code>, <code>rating</code>, <code>category</code>,
       and <code>name</code>, and you want to find the over-priced low-rated items.</p>
       <ul class="steps">
         <li><b>Static.</b> A scatter of <code>price</code> versus <code>rating</code> shows the cloud, but to
         learn <i>which</i> product sits at the bad corner you'd have to label every dot &mdash; unreadable.</li>
         <li><b>Interactive (Plotly).</b> The same scatter with <code>hover_data=["name", "category"]</code>
         and <code>color="category"</code>. Now you hover the lonely dot in the high-price, low-rating corner
         and instantly read its name &mdash; no re-plotting, and category is a third dimension via color.</li>
         <li><b>Dashboard (Streamlit).</b> Add a <code>st.selectbox</code> to pick a category and an
         <code>st.slider</code> for a minimum rating, feeding a <code>st.plotly_chart</code> and a
         <code>st.dataframe</code>. A teammate filters to "Electronics, rating below 3" themselves &mdash;
         self-serve, no new code from you.</li>
       </ul>
       <p>Same data, three layers: the static view states the shape, the interactive view lets you drill to the
       exact row, and the dashboard lets anyone ask their own version of the question.</p>`,

    practice: [
      {
        q: `You found a striking single fact: in your A/B test, the new layout lifted conversion from 4.0% to 4.8%. You need to put it in the launch slide deck and the exec summary. Static chart or interactive dashboard?`,
        steps: [
          { do: `Identify the message: it is a single, clear comparison (one number versus another).`, why: `Interactivity helps when readers must explore many slices; here the point is one fact, so there is nothing to drill into.` },
          { do: `Note the medium: slides and a written summary.`, why: `Clicks, hover, and zoom do not work in a printed deck or a static document.` },
          { do: `Pick a clean static bar chart (two bars, the lift labeled) and export it as an image.`, why: `Reproducible, printable, and the headline lands at a glance.` }
        ],
        answer: `<p>Use a <b>static</b> two-bar chart with the lift labeled. The message is a single clear fact, the medium is print/slides, and you want the exact same artifact every time. An interactive dashboard would add clicks and controls that only <b>distract</b> from the one number that matters.</p>`
      },
      {
        q: `An analytics team keeps pinging you for "the same chart but filtered to my region / my product / last 7 days." You re-run the notebook and re-send a PNG each time. What should you build instead, and what are the two main risks?`,
        steps: [
          { do: `Recognize the pattern: many people want slightly different slices of one dataset, on demand.`, why: `That is exactly the self-serve case where a dashboard beats one-off static charts.` },
          { do: `Build a small dashboard (Streamlit / Dash / Panel, or a BI tool) with region, product, and date filters feeding a chart and a table.`, why: `Each analyst filters to their own case without asking you, freeing you from the re-render loop.` },
          { do: `Plan for maintenance and scale: give it an owner plus a freshness check, and aggregate/subsample before plotting.`, why: `An unmaintained dashboard shows stale or wrong numbers; a heavy plot over the full data freezes the browser.` }
        ],
        answer: `<p>Build a <b>self-serve dashboard</b> with region/product/date filters (Streamlit, Plotly Dash, Panel, or a BI tool like Tableau/Power BI/Looker). The two main risks are <b>nobody maintaining it</b> (so it silently goes stale &mdash; give it an owner and a freshness indicator) and <b>heavy/slow plots on big data</b> (aggregate or subsample before rendering).</p>`
      },
      {
        q: `You build a beautiful Plotly scatter where the key insight — one outlier cluster — only becomes visible after the reader zooms into the bottom-left and hovers. A color-blind teammate also says they can't tell two of your series apart. Name the two pitfalls and the fixes.`,
        steps: [
          { do: `Notice the insight is hidden behind interaction: the default view doesn't show it.`, why: `Most readers never zoom; if the headline needs a click to appear, most readers miss it.` },
          { do: `Make the default view already show the cluster (pre-zoom to it, annotate it, or add a static inset).`, why: `Interactivity should be for going deeper, not for finding the main point.` },
          { do: `Fix the color-only encoding: use a color-blind-safe palette and add redundant shape/text labels.`, why: `Color alone fails for color-blind readers; redundant encodings keep the chart accessible.` }
        ],
        answer: `<p>Two pitfalls: <b>hiding the key message behind clicks</b> (fix: make the default view already tell the story &mdash; pre-zoom or annotate the cluster) and <b>accessibility</b> (fix: a color-blind-safe palette plus redundant shape/text labels, not color alone). Interactivity is for drilling deeper, never for revealing the headline.</p>`
      }
    ]
  });

  window.CODE["dw-interactive-dashboards"] = {
    lib: "pandas + plotly + streamlit",
    runnable: false,
    explain: `<p>Two snippets. First, an <b>interactive single chart</b> with <b>Plotly Express</b>:
       <code>px.scatter</code> with <code>color=</code> (a third dimension) and <code>hover_data=</code>
       (read the exact row on hover). Second, a tiny <b>Streamlit dashboard</b> skeleton: a
       <code>st.selectbox</code> filter and a <code>st.slider</code> feed a <code>st.plotly_chart</code> and a
       <code>st.dataframe</code>, so anyone can filter the data themselves. <code>runnable</code> is off &mdash;
       this needs <code>plotly</code> and <code>streamlit</code> installed (and the Streamlit app is launched
       with <code>streamlit run app.py</code>, not in a notebook).</p>`,
    code: `# pip install plotly streamlit pandas
# A small real-ish products table (price, rating, category, name).
import pandas as pd
import plotly.express as px

df = pd.DataFrame({
    "name":     ["Echo", "Bolt", "Nimbus", "Pixel", "Quartz", "Drift", "Sol", "Vega"],
    "category": ["Audio", "Tools", "Audio", "Phones", "Tools", "Audio", "Phones", "Phones"],
    "price":    [49, 120, 89, 699, 35, 59, 999, 450],
    "rating":   [4.6, 3.1, 4.2, 4.8, 2.7, 3.9, 2.9, 4.4],
})

# === 1) Interactive single chart (Plotly Express) ===
# color= adds a 3rd dimension; hover_data= lets the reader read the exact row.
fig = px.scatter(
    df, x="price", y="rating",
    color="category",                 # third dimension via color
    hover_data=["name", "category"],  # tooltip shows the row on hover
    title="Price vs rating (hover a dot to read its name)",
)
fig.show()   # zoom / pan / hover all work in the browser


# === 2) Tiny dashboard skeleton (Streamlit) ===
# Save as app.py and run:  streamlit run app.py
import streamlit as st

st.title("Product explorer")

# --- filter widgets ---
cat = st.selectbox("Category", ["All"] + sorted(df["category"].unique()))
min_rating = st.slider("Minimum rating", 0.0, 5.0, 0.0, 0.1)

# --- apply filters ---
view = df[df["rating"] >= min_rating]
if cat != "All":
    view = view[view["category"] == cat]

# --- linked chart + table update together as the filters change ---
chart = px.scatter(view, x="price", y="rating",
                   color="category", hover_data=["name"])
st.plotly_chart(chart, use_container_width=True)
st.dataframe(view)`
  };

  window.CODEVIZ["dw-interactive-dashboards"] = {
    question: "An interactive scatter is only as good as the view it opens on. Here's the clean multi-class case you'd hover and filter — plus two views you'll actually meet: one drowned in points, one hiding its headline below the fold.",
    charts: [
      {
        type: "scatter",
        title: "Ideal: clean multi-class scatter — read & filter at a glance",
        xlabel: "alcohol (%)",
        ylabel: "color intensity",
        groups: [
          { name: "cultivar 0", color: "#4ea1ff", points: [[13.05,5.04],[13.05,4.25],[13.24,4.32],[13.39,4.8],[13.5,3.52],[13.56,6.25],[13.56,6.13],[13.64,5.1],[13.73,5.7],[13.74,5.85],[13.76,5.4],[13.83,5.6],[14.06,5.05],[14.19,8.7],[14.2,6.75],[14.21,5.24],[14.22,6.38],[14.3,6.2],[14.83,5.2]] },
          { name: "cultivar 1", color: "#7ee787", points: [[11.41,3.08],[11.56,6.0],[11.62,3.25],[11.76,3.8],[11.96,3.21],[12.0,2.5],[12.04,2.6],[12.08,2.4],[12.16,2.45],[12.25,3.4],[12.29,2.15],[12.33,3.27],[12.37,4.5],[12.37,4.45],[12.43,3.94],[12.51,2.94],[12.52,2.0],[12.6,2.45],[12.64,5.75],[12.69,3.05],[13.05,2.6],[13.11,5.3]] },
          { name: "cultivar 2", color: "#c89bff", points: [[12.25,8.21],[12.36,7.65],[12.6,7.1],[12.79,10.8],[12.88,5.4],[13.36,5.6],[13.4,7.3],[13.49,5.7],[13.58,8.66],[13.69,5.88],[13.78,9.58],[13.88,4.9],[14.34,13.0]] }
        ],
        interpret: "<b>Real numbers from sklearn's load_wine</b> (54 wines): x is alcohol, y is color intensity, colour is cultivar. The three colours separate into legible clouds — blue (cultivar 0) sits high-alcohol/mid-intensity, green (cultivar 1) low/low, purple (cultivar 2) high-intensity. This is the case interactivity rewards: few enough points to read, so in Plotly you'd <b>hover any dot for its full chemistry row</b> and <b>click a legend entry to filter to one cultivar</b>. Conclude: when the cloud is this clean, ship it interactive."
      },
      {
        type: "scatter",
        title: "Overplotted: too many points to read (aggregate or subsample)",
        xlabel: "alcohol (%)",
        ylabel: "color intensity",
        groups: [
          { name: "all rows", color: "#9aa7b4", points: [[11.4,3.0],[11.5,2.9],[11.5,3.1],[11.6,3.0],[11.6,3.3],[11.7,3.6],[11.8,3.8],[11.9,3.2],[12.0,2.5],[12.0,2.7],[12.0,3.0],[12.1,2.4],[12.1,2.9],[12.1,3.4],[12.2,2.4],[12.2,2.5],[12.2,3.4],[12.2,3.6],[12.3,2.1],[12.3,3.3],[12.3,4.5],[12.4,3.9],[12.4,4.4],[12.5,2.0],[12.5,2.9],[12.5,3.5],[12.6,2.4],[12.6,5.7],[12.7,3.0],[12.7,7.1],[12.8,5.4],[12.9,4.6],[13.0,2.6],[13.0,4.2],[13.0,5.0],[13.1,5.3],[13.2,4.3],[13.3,5.6],[13.4,4.8],[13.4,7.3],[13.5,3.5],[13.5,5.7],[13.6,6.1],[13.6,6.2],[13.6,5.1],[13.7,5.7],[13.7,5.9],[13.8,5.6],[13.8,9.6],[13.9,4.9],[14.0,5.0],[14.1,5.2],[14.2,5.2],[14.2,6.4],[14.2,6.8],[14.3,6.2],[14.3,13.0],[14.4,5.2],[14.5,5.0],[14.6,6.0],[14.8,5.2],[12.8,5.0],[13.1,4.0],[13.3,4.5],[12.9,3.8],[12.7,4.1],[13.5,4.9],[13.0,3.6],[12.6,3.2],[12.4,3.0],[12.2,2.8]] }
        ],
        interpret: "<b>Illustrative:</b> same axes, but every row dumped in as one grey colour. The dots pile on top of each other, so you can't see where the data is dense and the cluster structure is gone. On real big data this also <b>freezes an interactive browser</b>. Recognise it by the solid smear with no readable colour groups. Fix: <b>aggregate to a 2-D heatmap or subsample a few thousand points</b> before plotting — interactivity can't rescue a chart with too much ink."
      },
      {
        type: "scatter",
        title: "Headline hidden below the fold: default view misses the outliers",
        xlabel: "alcohol (%)",
        ylabel: "color intensity",
        groups: [
          { name: "bulk (visible by default)", color: "#4ea1ff", points: [[12.0,3.0],[12.2,3.3],[12.4,3.6],[12.6,4.0],[12.8,4.2],[13.0,4.5],[13.2,4.8],[13.4,5.0],[13.6,5.3],[13.8,5.6],[14.0,5.9],[12.3,3.4],[12.7,4.1],[13.1,4.6],[13.5,5.1],[13.9,5.7]] },
          { name: "outlier cluster (only seen after zoom)", color: "#ff7b72", points: [[13.7,12.6],[13.9,13.0],[14.1,12.4],[14.2,13.0],[13.8,12.8]] }
        ],
        interpret: "<b>Illustrative:</b> the real story is the red cluster of high-intensity outliers top-right, but a default auto-zoom centred on the blue bulk leaves them at the very edge — most readers never scroll or zoom to them. Recognise it when the interesting points sit cramped against a chart border. Fix: make the <b>default view already tell the story</b> — pre-zoom to or annotate the cluster. Interactivity is for going deeper, never for revealing the headline."
      }
    ],
    caption: "",
    code: `import numpy as np
from sklearn.datasets import load_wine

d = load_wine(as_frame=True)
df = d.frame

# Subsample 54 wines for a readable scatter (<= 60 plotted points).
sub = df.sample(n=54, random_state=0).sort_values('alcohol')
x   = sub['alcohol'].to_numpy()           # x-axis
y   = sub['color_intensity'].to_numpy()   # y-axis
cls = sub['target'].to_numpy()            # cultivar 0/1/2 -> color

# Group the points by cultivar (what color= does in px.scatter).
for c in [0, 1, 2]:
    pts = [(round(float(a), 3), round(float(b), 3))
           for a, b, k in zip(x, y, cls) if k == c]
    print(f"cultivar {c}: n={len(pts)}")
    print(pts)

# In Plotly this would be one interactive call:
#   import plotly.express as px
#   px.scatter(sub, x='alcohol', y='color_intensity', color='target',
#              hover_data=df.columns)   # hover -> full row; legend click -> filter`
  };
})();
