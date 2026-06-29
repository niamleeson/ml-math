/* Data Wrangling — "Working with datetimes".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dw-dates-times". */
(function () {
  window.LESSONS.push({
    id: "dw-dates-times",
    title: "Working with datetimes: parse, extract, zones, resample",
    tagline: "Turn messy date strings into real timestamps you can sort, slice, and aggregate by time.",
    module: "Data Wrangling",
    prereqs: ["skill-data-audit", "met-forecasting"],

    whenToUse:
      `<p>Reach for this <b>any time a column holds a moment in time</b> &mdash; an event log, an order
       timestamp, a sign-up date, a sensor reading. Raw data almost always delivers these as <b>strings</b>
       like <code>"2023-03-01"</code> or <code>"01/03/23 14:05"</code>, and a string is the wrong type: it
       sorts alphabetically, you cannot subtract two of them, and you cannot ask "which day of the week was
       this?". The first job is to <b>parse</b> the strings into real timestamps.</p>
       <p>Datetime work is also a hard prerequisite for two later steps:</p>
       <ul>
         <li><b>Time-aware splits.</b> Before any honest evaluation of time-ordered data you must split
         <i>by time</i> (train on the past, test on the future). That requires real, sortable timestamps.</li>
         <li><b>Time-series EDA (Exploratory Data Analysis).</b> Counting events per day, averaging per
         month, smoothing with a rolling window &mdash; all of these need a proper datetime index first.</li>
       </ul>
       <p>Treat this as the gateway to the <b>met-forecasting</b> lesson: you cannot forecast a series you
       have not first parsed, sorted, and aggregated to a regular cadence.</p>`,

    application:
      `<p>Datetimes show up in nearly every real dataset.</p>
       <ul>
         <li><b>Logs and clickstreams.</b> Each row is an event with a timestamp; you bucket them by hour or
         day to see traffic patterns and to detect bot bursts.</li>
         <li><b>Transactions.</b> Order or payment times feed daily/weekly revenue roll-ups and time-aware
         train/test splits for churn or fraud models.</li>
         <li><b>Sensors and operations.</b> Readings arrive at a fixed cadence; you resample to a common
         frequency and smooth with rolling means before modeling.</li>
         <li><b>Global products.</b> Users in many time zones means every timestamp must agree on a single
         reference (almost always Coordinated Universal Time, UTC) or your daily counts are wrong.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Ambiguous DD/MM vs MM/DD.</b> <code>"03/04/2023"</code> is March 4th to an American and
         April 3rd to most of the world. Pandas guesses, and a wrong guess corrupts data <b>silently</b>.
         The fix: pass an explicit <code>format=</code>, or <code>dayfirst=True</code> when you know the
         day comes first.</li>
         <li><b>String dates sort wrong.</b> As text, <code>"2023-12-01" &lt; "2023-2-01"</code> is true
         because <code>'1' &lt; '2'</code> character-by-character. Always parse to a real timestamp before
         sorting, slicing, or comparing.</li>
         <li><b>Mixing naive and tz-aware datetimes.</b> A timestamp with no zone ("naive") cannot be
         compared to or subtracted from one with a zone ("aware") &mdash; pandas raises, or worse, lines up
         the wrong instants. Decide early and keep the whole column on one convention.</li>
         <li><b>Ignoring time zones and Daylight Saving Time (DST).</b> Local wall-clock time skips or
         repeats an hour twice a year. The discipline that avoids it: <b>localize at the edge, convert to
         UTC, do all arithmetic in UTC</b>, and only convert back to local for display.</li>
         <li><b>Resampling without a DatetimeIndex.</b> <code>.resample('M')</code> needs the index (or a
         named column via <code>on=</code>) to be datetime; otherwise it errors or buckets nothing.</li>
         <li><b>Leaking the future in time splits.</b> A random split lets future rows train a model that is
         then "tested" on the past. Split on a <b>cutoff date</b>, train strictly before it, test after.</li>
       </ul>`,

    bigIdea:
      `<p>A datetime is not a string and not just a number &mdash; it is a <b>point on a timeline</b> with a
       calendar (years, months, leap days) and, optionally, a <b>time zone</b>. Pandas gives you a dedicated
       type, <code>datetime64[ns]</code>, plus a <code>Timestamp</code> for a single instant and a
       <code>Timedelta</code> for a duration. Once a column is this type, four powerful things open up.</p>
       <p><b>(1) Parse.</b> <code>pd.to_datetime</code> reads varied string formats into real timestamps.
       <b>(2) Extract.</b> The <code>.dt</code> accessor pulls out calendar pieces &mdash; year, month, day,
       hour, and <code>dayofweek</code> (Monday = 0 ... Sunday = 6). <b>(3) Localize / convert.</b>
       <code>tz_localize</code> stamps a naive time with a zone; <code>tz_convert</code> moves an aware time
       to another zone. <b>(4) Index and aggregate.</b> Put the timestamps on the index (a
       <b>DatetimeIndex</b>) and you can slice by date range, <code>.resample()</code> to a coarser cadence,
       and take <code>.rolling()</code> windows.</p>
       <p>The reason datetimes are a famous source of bugs is that all four steps have a quiet failure mode:
       the wrong parse format, the missing zone, the string that sorts wrong. Get the type right early and
       the rest of time-series work becomes ordinary indexing.</p>`,

    buildup:
      `<p><b>Parsing.</b> <code>pd.to_datetime(series)</code> infers the format. When the format is fixed,
       pass it explicitly: <code>format="%d/%m/%Y"</code> is both faster and safe against the DD/MM ambiguity.
       <code>dayfirst=True</code> is the shortcut when day precedes month. Rows it cannot parse become
       <code>NaT</code> ("Not a Time", the datetime version of <code>NaN</code>) when you pass
       <code>errors="coerce"</code>.</p>
       <p><b>Components.</b> Given a datetime column <code>df["ts"]</code>, the accessor
       <code>df["ts"].dt</code> exposes <code>.year</code>, <code>.month</code>, <code>.day</code>,
       <code>.hour</code>, and <code>.dayofweek</code>. These are ordinary integer columns you can group by
       &mdash; e.g. average sales per <code>.dt.dayofweek</code> to see the weekly shape.</p>
       <p><b>Time zones.</b> A naive timestamp has no zone. <code>ts.tz_localize("America/New_York")</code>
       attaches one (interpreting the wall-clock reading as New York time). <code>ts.tz_convert("UTC")</code>
       then re-expresses the <i>same instant</i> in UTC. The professional habit: localize once at ingestion,
       convert to UTC, compute in UTC.</p>
       <p><b>Arithmetic.</b> Subtract two timestamps and you get a <code>Timedelta</code> (a duration). Add a
       <code>Timedelta</code> to a timestamp to shift it. Durations support <code>.days</code>,
       <code>.total_seconds()</code>, and comparison.</p>
       <p><b>Index, resample, roll.</b> With a DatetimeIndex, <code>.resample("D").sum()</code> buckets to
       daily totals, <code>.resample("M").mean()</code> to monthly averages (the bucket-then-aggregate
       cousin of <code>groupby</code>). <code>.rolling("7D").mean()</code> or <code>.rolling(7).mean()</code>
       slides a window to smooth out daily noise.</p>`,

    symbols: [
      { sym: "$t$", desc: "a single timestamp &mdash; a point on the timeline (pandas <code>Timestamp</code>, dtype <code>datetime64[ns]</code>)." },
      { sym: "$\\Delta t$", desc: "a duration between two timestamps (pandas <code>Timedelta</code>): $\\Delta t = t_2 - t_1$." },
      { sym: "$\\text{dow}(t)$", desc: "day of week extracted from $t$ via <code>.dt.dayofweek</code>: Monday $=0$ through Sunday $=6$." },
      { sym: "$\\bar{x}_m$", desc: "the resampled value for period $m$ &mdash; e.g. the mean of every daily value whose timestamp falls in month $m$." },
      { sym: "$w$", desc: "the rolling-window length (number of consecutive points, e.g. $w=7$ for a 7-day moving average)." }
    ],

    formula:
      `$$ \\bar{x}_m=\\frac{1}{|B_m|}\\sum_{t\\in B_m} x_t,\\qquad
         r_t=\\frac{1}{w}\\sum_{k=0}^{w-1} x_{t-k} $$`,

    whatItDoes:
      `<p>The left expression is <b>resampling to the mean</b>: $B_m$ is the set of timestamps that land in
       period $m$ (say a calendar month), and $\\bar{x}_m$ averages every value in that bucket. Swap the
       average for a sum or a count and you get <code>.resample("M").sum()</code> or <code>.count()</code>.
       This is exactly a <code>groupby</code> whose key is "which period does this timestamp fall in".</p>
       <p>The right expression is the <b>rolling (moving) average</b>: $r_t$ averages the current point and
       the previous $w-1$ points. It smooths short-term noise so a trend or weekly pattern becomes visible.
       Because it only looks <i>backward</i> (no future points), it is safe to use without leaking the
       future.</p>`,

    derivation:
      `<p><b>Why a real datetime type beats a string.</b></p>
       <ul class="steps">
         <li>A string compares <b>character by character</b>. So <code>"2023-12-01"</code> sorts
         <i>before</i> <code>"2023-2-01"</code> because the third character <code>'1'</code> is less than
         <code>'2'</code>. Any sort, min/max, or range slice on string dates is therefore unreliable.</li>
         <li>A parsed <code>datetime64</code> is stored as an integer count of nanoseconds from a fixed
         epoch. Now ordering is numeric and correct, and the gap between two timestamps is just a
         subtraction &mdash; that gap is the <code>Timedelta</code> $\\Delta t$.</li>
         <li>The calendar fields are <b>derived</b> from that integer: dividing and modding by the lengths of
         days, hours, and so on recovers year, month, day, hour, and day-of-week. That is what
         <code>.dt</code> exposes, so you never parse the string yourself.</li>
         <li>A time zone is an <b>offset rule</b> layered on top: the same integer instant can be displayed
         as 14:00 in London or 09:00 in New York. <code>tz_convert</code> changes only the display, not the
         instant &mdash; which is why doing arithmetic in UTC and converting for display is always
         consistent, even across Daylight Saving Time jumps.</li>
         <li>Finally, with timestamps on the index, "all rows in March" is a contiguous numeric range, so
         <code>.resample</code> and date-range slicing are fast index operations rather than per-row string
         parsing. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Five raw strings arrive in mixed, day-first format with a stray bad value, each carrying a value
       $x$. Parse with <code>pd.to_datetime(s, dayfirst=True, errors="coerce")</code>:</p>
       <table class="extable">
         <caption>Parse, then extract calendar pieces with <code>.dt</code> (Mon$=0$ ... Sun$=6$).</caption>
         <thead>
           <tr><th>raw string</th><th>parsed $t$</th><th class="num">.dt.month</th><th class="num">.dt.dayofweek</th><th class="num">value $x$</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">"01/03/2023"</td><td>2023-03-01</td><td class="num">3</td><td class="num">2 (Wed)</td><td class="num">10</td></tr>
           <tr><td class="row-h">"15/03/2023"</td><td>2023-03-15</td><td class="num">3</td><td class="num">2 (Wed)</td><td class="num">20</td></tr>
           <tr><td class="row-h">"31/03/2023"</td><td>2023-03-31</td><td class="num">3</td><td class="num">4 (Fri)</td><td class="num">30</td></tr>
           <tr><td class="row-h">"10/04/2023"</td><td>2023-04-10</td><td class="num">4</td><td class="num">0 (Mon)</td><td class="num">60</td></tr>
           <tr><td class="row-h">"not a date"</td><td><code>NaT</code></td><td class="num">NaN</td><td class="num">NaN</td><td class="num">&mdash;</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Parse.</b> The first four become real timestamps; the junk becomes <code>NaT</code>. Without
         <code>dayfirst=True</code>, <code>"31/03/2023"</code> fails (no month 31) &mdash; a signal the format
         is day-first.</li>
         <li><b>Duration ($\\Delta t$).</b> First to fourth valid date:
         $\\Delta t=\\text{2023-04-10}-\\text{2023-03-01}=\\mathbf{40}$ <b>days</b>.</li>
         <li><b>Resample to monthly mean ($\\bar{x}_m=\\frac{1}{|B_m|}\\sum_{t\\in B_m}x_t$).</b> March bucket
         $B_{\\text{Mar}}=\\{10,20,30\\}$: $\\bar{x}_{\\text{Mar}}=(10+20+30)/3=60/3=\\mathbf{20}$. April bucket
         $B_{\\text{Apr}}=\\{60\\}$: $\\bar{x}_{\\text{Apr}}=60/1=\\mathbf{60}$.</li>
         <li><b>Rolling mean ($r_t=\\frac{1}{w}\\sum_{k=0}^{w-1}x_{t-k}$, $w=3$).</b> The first full window
         (first three values) is $r=(10+20+30)/3=\\mathbf{20}$; slide it forward one step and
         $r=(20+30+60)/3=110/3\\approx\\mathbf{36.7}$ &mdash; each window looks only backward, never at the
         future.</li>
       </ul>`,

    practice: [
      {
        q: `A column of order dates looks like <code>["03/04/2023", "05/06/2023", "11/12/2023"]</code> and your European colleague says all three are day-first (DD/MM/YYYY). You run <code>pd.to_datetime(col)</code> with no extra arguments. What can go wrong and how do you fix it?`,
        steps: [
          { do: `Notice every value is ambiguous: each part is &le; 12, so pandas cannot tell day from month.`, why: `<code>"03/04/2023"</code> parses as March 4th (MM/DD) by pandas' default, but the intended value is April 3rd (DD/MM).` },
          { do: `Recognize the failure is silent &mdash; no error, just wrong dates.`, why: `Silent corruption is the worst kind: downstream months, weekdays, and sorts are all off, but nothing warns you.` },
          { do: `Re-parse with the day-first convention.`, why: `<code>pd.to_datetime(col, dayfirst=True)</code> (or an explicit <code>format="%d/%m/%Y"</code>) pins the order so the parse matches the source.` }
        ],
        answer: `<p>With no arguments pandas uses month-first, so <b>April 3rd silently becomes March 4th</b> and every interpretation downstream is wrong. Fix it by stating the order: <code>pd.to_datetime(col, dayfirst=True)</code>, or best, an explicit <code>format="%d/%m/%Y"</code>, which is faster and refuses anything that does not match.</p>`
      },
      {
        q: `You have event timestamps from users in New York and London, all stored as naive wall-clock strings. You want correct counts of events per UTC day. Outline the steps.`,
        steps: [
          { do: `Parse the strings to datetimes, then <b>localize</b> each to the user's own zone.`, why: `A naive timestamp has no zone; <code>tz_localize("America/New_York")</code> / <code>tz_localize("Europe/London")</code> says which wall clock the reading came from.` },
          { do: `<b>Convert</b> every localized timestamp to UTC with <code>tz_convert("UTC")</code>.`, why: `Now all events share one reference instant, so 23:30 New York and 23:30 London no longer collide on the wrong day.` },
          { do: `Set the UTC column as the index and <code>.resample("D").count()</code>.`, why: `Resampling needs a DatetimeIndex; counting per UTC day gives consistent buckets across both regions.` }
        ],
        answer: `<p><b>Localize, then convert, then resample.</b> Localize each naive timestamp to its source zone (<code>tz_localize</code>), convert all to UTC (<code>tz_convert("UTC")</code>) so every event agrees on the instant, then set the UTC column as the index and <code>.resample("D").count()</code>. Doing the math in UTC sidesteps Daylight Saving Time gaps and the naive-vs-aware mixing error.</p>`
      },
      {
        q: `A daily sales series is very noisy and you also need an honest train/test split for a forecast. What two datetime techniques apply, and what is the one rule the split must obey?`,
        steps: [
          { do: `Smooth the noise with a backward rolling mean: <code>s.rolling(7).mean()</code>.`, why: `A 7-day moving average averages each day with the prior six, revealing the trend and weekly shape without using any future points.` },
          { do: `Optionally resample to a coarser cadence for a higher-level view: <code>s.resample("M").mean()</code>.`, why: `Monthly means strip out day-to-day jitter entirely when you only care about the slow trend.` },
          { do: `Split on a cutoff date, not at random.`, why: `Train strictly on dates before the cutoff and test on dates after it, so the model never sees the future during training.` }
        ],
        answer: `<p>Use a <b>rolling mean</b> (<code>.rolling(7).mean()</code>) to smooth and, optionally, <b>resampling</b> (<code>.resample("M").mean()</code>) for a coarser view. The split rule: <b>cut on a date, train before it, test after it</b> &mdash; a random split leaks the future and inflates your measured accuracy. Both the rolling mean and the split look only backward, which is what keeps them honest.</p>`
      }
    ]
  });

  window.CODE["dw-dates-times"] = {
    lib: "pandas + numpy",
    runnable: false,
    explain: `<p>One end-to-end pass over a tiny event table: <b>parse</b> mixed/day-first date strings with
       <code>pd.to_datetime</code> (using <code>format=</code> and <code>dayfirst=</code>), <b>extract</b>
       calendar pieces with <code>.dt</code>, <b>localize and convert</b> a time zone, compute a
       <b>duration</b> with <code>Timedelta</code>, then build a <b>DatetimeIndex</b> and run
       <code>.resample("M").mean()</code> plus a <b>rolling 7-day mean</b>. Everything here is self-contained
       &mdash; the daily series is generated with numpy, so the file runs as-is.</p>`,
    code: `import numpy as np
import pandas as pd

# === 1) PARSE varied / ambiguous date strings ===========================
raw = pd.Series(["01/03/2023", "15/03/2023", "31/03/2023",
                 "10/04/2023", "not a date"])

# dayfirst=True -> DD/MM/YYYY; errors='coerce' turns junk into NaT.
parsed = pd.to_datetime(raw, dayfirst=True, errors="coerce")
# An explicit format is faster and rejects anything that doesn't match:
parsed = pd.to_datetime(raw, format="%d/%m/%Y", errors="coerce")
print(parsed.tolist())
# [Timestamp('2023-03-01'), ..., Timestamp('2023-04-10'), NaT]

# === 2) EXTRACT components via the .dt accessor =========================
comp = pd.DataFrame({"ts": parsed})
comp["year"]      = comp["ts"].dt.year
comp["month"]     = comp["ts"].dt.month
comp["day"]       = comp["ts"].dt.day
comp["dayofweek"] = comp["ts"].dt.dayofweek      # Mon=0 ... Sun=6
print(comp)

# === 3) TIME ZONES: localize at the edge, then work in UTC ==============
t = pd.Timestamp("2023-03-01 09:30:00")          # naive wall-clock reading
t_ny  = t.tz_localize("America/New_York")        # attach the source zone
t_utc = t_ny.tz_convert("UTC")                   # same instant, expressed in UTC
print(t_ny, "->", t_utc)                         # ...-05:00 -> 14:30:00+00:00

# === 4) DATE ARITHMETIC / durations (Timedelta) =========================
span = pd.Timestamp("2023-04-10") - pd.Timestamp("2023-03-01")
print(span, span.days)                           # 40 days 00:00:00   40
deadline = pd.Timestamp("2023-03-01") + pd.Timedelta(days=14)
print(deadline)                                  # 2023-03-15 00:00:00

# === 5) DatetimeIndex -> RESAMPLE and ROLLING window ====================
rng_ = np.random.RandomState(7)
idx = pd.date_range("2023-01-01", periods=365, freq="D")   # a DatetimeIndex
t_ = np.arange(365)
daily = (100 + 0.15 * t_                                    # upward trend
         + 20 * np.sin(2 * np.pi * t_ / 365)               # yearly season
         + 5 * (idx.dayofweek < 5)                         # weekday bump
         + rng_.normal(0, 4, 365))                         # noise
s = pd.Series(daily, index=idx)

monthly = s.resample("M").mean()        # bucket daily -> monthly means
roll7   = s.rolling(7).mean()           # 7-day backward moving average
print(monthly.round(1).head())
print(roll7.dropna().round(1).head())`
  };

  window.CODEVIZ["dw-dates-times"] = {
    question: "On a noisy daily series, what does a 7-day rolling mean reveal — and how do you read the time plots you'll actually meet?",
    charts: [
      {
        type: "line",
        title: "Ideal: raw daily series vs its 7-day rolling mean (days 7–66)",
        xlabel: "day of year",
        ylabel: "value",
        series: [
          { name: "raw daily (noisy)", color: "#ff7b72", points: [[7,103.0],[8,96.4],[9,113.0],[10,111.8],[11,107.4],[12,109.7],[13,112.9],[14,105.3],[15,105.9],[16,106.5],[17,115.1],[18,113.8],[19,114.9],[20,108.2],[21,116.4],[22,110.8],[23,114.1],[24,124.3],[25,116.4],[26,111.3],[27,115.9],[28,103.9],[29,117.7],[30,117.3],[31,116.4],[32,124.1],[33,113.7],[34,122.9],[35,107.9],[36,113.9],[37,117.2],[38,128.3],[39,129.9],[40,122.0],[41,127.1],[42,118.4],[43,121.8],[44,121.9],[45,118.5],[46,118.5],[47,127.7],[48,135.5],[49,123.0],[50,120.2],[51,135.3],[52,129.0],[53,128.8],[54,129.8],[55,128.6],[56,123.2],[57,119.1],[58,132.2],[59,130.1],[60,135.6],[61,129.7],[62,123.9],[63,126.4],[64,133.9],[65,130.9],[66,129.2]] },
          { name: "7-day rolling mean", color: "#4ea1ff", points: [[7,105.6],[8,104.1],[9,105.4],[10,106.2],[11,106.1],[12,107.0],[13,107.8],[14,108.1],[15,109.5],[16,108.5],[17,109.0],[18,109.9],[19,110.6],[20,110.0],[21,111.5],[22,112.2],[23,113.3],[24,114.6],[25,115.0],[26,114.5],[27,115.6],[28,113.8],[29,114.8],[30,115.2],[31,114.1],[32,115.2],[33,115.6],[34,116.5],[35,117.1],[36,116.6],[37,116.6],[38,118.3],[39,119.1],[40,120.3],[41,120.9],[42,122.4],[43,123.5],[44,124.2],[45,122.8],[46,121.2],[47,122.0],[48,123.2],[49,123.8],[50,123.6],[51,125.5],[52,127.0],[53,128.5],[54,128.8],[55,127.8],[56,127.8],[57,127.7],[58,127.2],[59,127.4],[60,128.4],[61,128.4],[62,127.7],[63,128.1],[64,130.3],[65,130.1],[66,129.9]] }
        ],
        interpret: "X is the day of year, Y is the measured value. The red line is the raw daily reading: it jitters up and down every single day, so the trend is hard to see by eye. The blue line is <b>s.rolling(7).mean()</b> — each blue point averages that day and the six days before it. The blue line is smooth and climbs steadily, exposing the real upward trend the noise was hiding. Because each average uses only past days, the blue line never peeks at the future."
      },
      {
        type: "line",
        title: "Window too long: a 60-day rolling mean erases the real wiggles (illustrative)",
        xlabel: "day of year",
        ylabel: "value",
        series: [
          { name: "raw daily (noisy)", color: "#ff7b72", points: [[7,103],[12,110],[17,115],[22,111],[27,116],[32,124],[37,117],[42,118],[47,128],[52,129],[57,119],[62,124],[67,140],[72,118],[77,135],[82,121],[87,138],[92,125],[97,142],[102,128]] },
          { name: "60-day rolling mean", color: "#ffb454", points: [[7,118],[12,119],[17,120],[22,121],[27,122],[32,123],[37,124],[42,125],[47,126],[52,127],[57,128],[62,129],[67,130],[72,131],[77,132],[82,133],[87,134],[92,135],[97,136],[102,137]] }
        ],
        interpret: "Illustrative. Same noisy red series, but the orange line uses a <b>60-day</b> window instead of 7. A window that long averages over so many days that it flattens into an almost-straight line — every bump, dip, and weekly pattern is smoothed away. The lesson: the window length <b>w</b> is a knob. Too small and you keep the noise; too large and you erase the very structure you wanted to see. Pick w to match the cycle you care about (7 for weekly, ~30 for monthly)."
      },
      {
        type: "line",
        title: "Wrong parse: string-sorted dates jumble the timeline (illustrative)",
        xlabel: "row order (as plotted)",
        ylabel: "value",
        series: [
          { name: "plotted in string order", color: "#c89bff", points: [[1,102],[2,150],[3,118],[4,108],[5,168],[6,121],[7,134],[8,99],[9,160],[10,112]] },
          { name: "correct time order", color: "#7ee787", points: [[1,99],[2,102],[3,108],[4,112],[5,118],[6,121],[7,134],[8,150],[9,160],[10,168]] }
        ],
        interpret: "Illustrative. This is what a forgotten parse looks like. The purple line plots rows sorted as <b>text</b> — \"2023-12-01\" lands before \"2023-2-01\" because the character '1' beats '2' — so the timeline is scrambled into a meaningless zig-zag. The green line is the same points after <b>pd.to_datetime</b> + sort, rising smoothly as a real trend. If your time plot looks like random spikes with no shape, suspect string dates, not bad data."
      }
    ],
    caption: "Ideal plus two failure modes. The first chart uses real numbers from a numpy-built daily series (trend + yearly season + weekday bump + noise) on a pandas DatetimeIndex; resampling it to monthly means gave 110.5, 123.9, 134.0, 139.0, 136.9, 134.4, 127.7, 124.4, 123.5, 127.1, 136.8, 149.9 for Jan–Dec. The other two are illustrative shapes showing an over-long rolling window and string-sorted (unparsed) dates.",
    code: `import numpy as np
import pandas as pd

rng = np.random.RandomState(7)
idx = pd.date_range("2023-01-01", periods=365, freq="D")   # DatetimeIndex
t = np.arange(365)
daily = (100 + 0.15 * t                      # upward trend
         + 20 * np.sin(2 * np.pi * t / 365)  # yearly seasonality
         + 5 * (idx.dayofweek < 5)           # weekday bump via .dt-style dayofweek
         + rng.normal(0, 4, 365))            # daily noise
s = pd.Series(daily, index=idx)

roll7 = s.rolling(7).mean()                  # 7-day backward moving average
sub = slice(6, 66)                           # 60 plotted days, rolling defined
print("raw :", np.round(s.values[sub], 1))
print("roll:", np.round(roll7.values[sub], 1))

monthly = s.resample("M").mean()             # bucket -> monthly means
print("monthly:", np.round(monthly.values, 1))
# monthly -> [110.5 123.9 134.  139.  136.9 134.4 127.7 124.4 123.5 127.1 136.8 149.9]`
  };
})();
