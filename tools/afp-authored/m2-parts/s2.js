/* M2.2 · Point-in-time (leak-free) feature/label joins.
   Exports ONE sub-lesson object. Validate in isolation with:
     node tools/afp-check-part.js tools/afp-authored/m2-parts/s2.js
   LaTeX: double every backslash in JS strings; balance $…$; money is \\$.
   No <i>/<em>, no emoji. */
"use strict";

module.exports = {
  sub: "02",
  subtitle: "Point-in-time feature/label joins",
  tagline: "Freeze features at prediction time, then let the label window unfold after that moment.",
  skipIf: "define a feature-freeze time, build an as-of join with strictly prior events, handle delayed labels, and choose temporal validation that avoids leakage.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["target leakage", "logged events with timestamps", "supervised examples built from features and labels"],
    leadsTo: ["training-serving consistency", "feature stores", "honest backtests for ads models"],
    usedWith: ["as-of joins", "attribution windows", "temporal validation", "grouped splits"]
  },
  motivation:
    "<p>You already know the leakage question: could this feature have existed when the prediction was made? Point-in-time joins are the database answer to that question. Every training row gets a feature-freeze time $t_i$, and the feature builder must behave as if the world stopped exactly there. Clicks, RSVPs, conversions, profile edits, and campaign changes after $t_i$ are not bad data; they are just the future, so they belong to labels or later rows, not to features for this row.</p>" +
    "<p>This matters most in ads because the label is often defined after a waiting period. An impression at noon may be labeled positive if a click arrives before 12:30, an Event Ad may be labeled positive if the member attends days later, and a pacing model may need to decide now using only delivery observed so far. The mental model is a sealed envelope: put features in the envelope at $t_i$, seal it, then open the outcome window from $t_i$ to $t_i+\\Delta$ to write the label.</p>",
  definition:
    "<p><b>Definition.</b> A <b>point-in-time feature/label join</b> builds each supervised row around a feature-freeze time $t_i$. Features are computed from the history strictly before $t_i$, while the label is computed from an attribution window after $t_i$.</p>" +
    "<p>For a click-count feature on row $i$, the leak-free as-of rule is:</p>" +
    "$$c_i=\\sum_j \\mathbf{1}\\big[\\text{campaign}(e_j)=\\text{campaign}(i)\\big]\\,\\mathbf{1}\\big[\\text{timestamp}(e_j)<t_i\\big].$$" +
    "<p>A binary label with horizon $\\Delta$ is defined separately:</p>" +
    "$$y_i=\\mathbf{1}\\big[\\exists\\, a_k:\ \\text{entity}(a_k)=\\text{entity}(i), t_i \\le \\text{timestamp}(a_k) < t_i+\\Delta\\big].$$" +
    "<p>The strict inequality on features prevents same-row and future events from leaking backward. The label window may include events after $t_i$ because the label is supposed to be observed later; rows whose windows have not fully elapsed are <b>delayed</b> or <b>censored</b> and should not be treated as negatives. Validation should respect time, and when the same member, campaign, event, or creator can appear many times, it should also respect groups.</p>",
  symbols: [
    { sym: "$t_i$", desc: "the feature-freeze time for row $i$, usually the impression, request, or decision time." },
    { sym: "$\\Delta$", desc: "the outcome or attribution horizon, such as 30 minutes for a click or 7 days for attendance." },
    { sym: "$e_j$", desc: "a historical event that may be eligible to build a feature." },
    { sym: "$a_k$", desc: "an outcome event that may make the label positive." },
    { sym: "$c_i$", desc: "an as-of aggregate feature computed only from events with timestamp strictly less than $t_i$." },
    { sym: "$y_i$", desc: "the label observed after the attribution window closes." }
  ],
  derivation: [
    { do: "Choose the prediction moment", result: "row $i$ freezes at $t_i$", why: "the model must score before the outcome window is known" },
    { do: "Restrict the feature event set", result: "$H_i=\\{e_j:\\text{timestamp}(e_j)<t_i\\}$", why: "strictly prior events are the only events knowable at freeze time" },
    { do: "Aggregate over that set", result: "$c_i=\\sum_{e_j\\in H_i}\\mathbf{1}[\\text{campaign}(e_j)=\\text{campaign}(i)]$", why: "the aggregate is now an as-of feature, not a current-state snapshot" },
    { do: "Define the label window", result: "$[t_i,t_i+\\Delta)$", why: "the business question decides how long attribution is allowed to arrive" },
    { do: "Drop unfinished windows", result: "keep row $i$ only if observation time $T\\ge t_i+\\Delta$", why: "otherwise a future positive has not had a chance to appear, so the label is censored" }
  ],
  worked: {
    problem: "An ads table has impressions and click events. Impressions are `I1: A at 10:00`, `I2: A at 10:05`, `I3: B at 10:06`, `I4: A at 10:10`, and `I5: B at 10:12`. Click events are `A at 10:03`, `B at 10:07`, and `A at 10:11`. Build the leak-free feature `prior_campaign_clicks` for each impression, define a 5-minute click label, and identify the naive join that leaks.",
    skills: ["as-of joins", "label windows", "leakage debugging"],
    strategy: "Separate the two clocks: count only clicks strictly before the impression for the feature, then look forward 5 minutes for the label.",
    steps: [
      { do: "Set the freeze times", result: "$t=(10{:}00,10{:}05,10{:}06,10{:}10,10{:}12)$", why: "each row freezes at its own impression time" },
      { do: "Count A clicks before I1", result: "$0$", why: "A's first click is at 10:03, which is after 10:00" },
      { do: "Count A clicks before I2", result: "$1$", why: "the 10:03 A click is strictly before 10:05" },
      { do: "Count B clicks before I3", result: "$0$", why: "the 10:07 B click is after 10:06" },
      { do: "Count A clicks before I4", result: "$1$", why: "10:03 is before 10:10, but 10:11 is not" },
      { do: "Count B clicks before I5", result: "$1$", why: "the 10:07 B click is strictly before 10:12" },
      { do: "Apply the 5-minute label window", result: "$y=(1,0,1,1,0)$", why: "clicks in $[t_i,t_i+5\\text{ minutes})$ are positives for I1, I3, and I4" },
      { do: "Compute the naive through-window count", result: "$(1,1,1,2,1)$", why: "counting clicks up to $t_i+5$ includes the outcome window and therefore leaks" }
    ],
    verify: "The leak-free feature for I1 is 0 even though its label is 1, because the click at 10:03 is future information at 10:00. That is exactly the separation we need.",
    answer: "The correct `prior_campaign_clicks` vector is $(0,1,0,1,1)$; the 5-minute label is $(1,0,1,1,0)$; the naive through-window count $(1,1,1,2,1)$ leaks because it includes clicks used to define labels.",
    connects: "the as-of rule — features use $\\text{timestamp}(e_j)<t_i$, labels use the later attribution window."
  },
  practice: [
    {
      problem: "A Palette pCTR row freezes at 14:00 with $\\Delta=30$ minutes. The same campaign has clicks at 13:10, 13:59, 14:05, and 14:31. What is the leak-free prior click count, and is the label positive?",
      steps: [
        { do: "Filter feature events", result: "13:10 and 13:59 remain", why: "features require timestamps strictly before 14:00" },
        { do: "Count the remaining clicks", result: "$c_i=2$", why: "two campaign clicks are knowable at the freeze time" },
        { do: "Open the label window", result: "$[14{:}00,14{:}30)$", why: "a 30-minute horizon includes times at or after 14:00 and before 14:30" },
        { do: "Check outcome clicks", result: "$y_i=1$", why: "14:05 falls in the label window, while 14:31 does not" }
      ],
      answer: "The prior feature is 2, and the 30-minute click label is positive."
    },
    {
      problem: "An Event Ads pAttend dataset is extracted on July 10. One event impression froze on July 8 at 09:00 with a 7-day attendance window. Should this row be labeled negative if no attendance is logged yet?",
      steps: [
        { do: "Compute the window close", result: "July 15 at 09:00", why: "the label cannot be final until $t_i+\\Delta$" },
        { do: "Compare to extraction time", result: "July 10 is before July 15", why: "the full outcome window has not elapsed" },
        { do: "Classify the row", result: "censored", why: "a later attendance event could still arrive inside the allowed window" }
      ],
      answer: "No. The row is delayed/censored, not a true negative, until July 15 at 09:00 or later."
    },
    {
      problem: "A feature table stores `campaign_total_clicks_current=120` today. At an impression time last Monday, the campaign had only 70 prior clicks. Which number belongs in a historical training row, and what leakage occurs if you use 120?",
      steps: [
        { do: "Locate the row time", result: "last Monday", why: "historical rows must be reconstructed as of their own freeze time" },
        { do: "Choose the as-of value", result: "$70$", why: "only 70 clicks were known then" },
        { do: "Name the bug", result: "backfill leakage", why: "the current-state value 120 moves 50 future clicks backward into the past" }
      ],
      answer: "Use 70. Using 120 leaks 50 future clicks into the historical feature."
    },
    {
      problem: "You train on impressions from Monday through Sunday, then randomly split rows 80/20. A campaign launches a promotion on Friday. Why can the random split be too optimistic, and what split should you use?",
      steps: [
        { do: "Inspect the split", result: "train and validation both contain before-Friday and after-Friday rows", why: "random splitting mixes future campaign behavior into training" },
        { do: "Identify the leakage", result: "temporal leakage", why: "the validation set no longer imitates forecasting into a later period" },
        { do: "Choose the fix", result: "train on earlier days and validate on later days", why: "a time-based split preserves the direction of time" }
      ],
      answer: "Use a temporal split, such as train Monday-Thursday and validate Friday-Sunday, rather than a random row split."
    },
    {
      problem: "A Creator Marketplace model has 10 impressions for the same creator. Six are in train and four are in validation after a random split. What leakage risk remains even if every timestamp join is correct?",
      steps: [
        { do: "Find the repeated entity", result: "the same creator appears in both splits", why: "the model can learn creator-specific behavior from train" },
        { do: "Name the leakage", result: "group leakage", why: "validation is not independent when an entity crosses the boundary" },
        { do: "Choose the fix", result: "group by creator, or by creator plus campaign when needed", why: "all rows for an entity should land on one side of the split" }
      ],
      answer: "The remaining risk is group leakage; use a grouped split so the creator does not appear in both train and validation."
    }
  ],
  applications: [
    { title: "Palette pCTR as-of click aggregates", background: "A pCTR model often wants campaign momentum: recent clicks suggest that the creative and audience are working. The aggregate is useful only if it is reconstructed as of the impression, not read from a current campaign summary.", numbers: "For an impression at 10:00 with campaign clicks at 09:10, 09:40, 10:04, and 10:20, the 1-hour prior feature is 2 because 09:10 and 09:40 are in $[09{:}00,10{:}00)$; the 30-minute label is positive because 10:04 is in $[10{:}00,10{:}30)$." },
    { title: "Instream Ads video completion model", background: "Video ads need request-time features, but playback outcomes unfold over seconds. A join that includes watch time accumulated after the ad starts is a label proxy, not a feature.", numbers: "At $t=12{:}00{:}00$, prior member video completions before noon are 8. A 30-second completion label uses $[12{:}00{:}00,12{:}00{:}30)$; a completion at 12:00:24 makes $y=1$, while a feature value of 9 that includes that completion leaks exactly 1 future event." },
    { title: "Event Ads pAttend with delayed feedback", background: "Attendance and RSVP outcomes arrive late, especially when an event happens days after an impression. Treating unfinished windows as negatives teaches the model that pending positives are failures.", numbers: "A row frozen on March 1 with $\\Delta=14$ days closes on March 15. If the data pull is March 8, the row has only 7 of 14 days observed, so its observed fraction is $7/14=0.5$ and it should be censored, not labeled 0." },
    { title: "Event Ads pacing features", background: "Pacing decisions compare delivered budget so far to the plan so far. If a backfill uses end-of-day spend for morning decisions, it makes the controller look wiser than it was.", numbers: "At 10:00 a campaign planned \\$600 over 24 hours, so the planned spend so far is $600\\cdot10/24=\\$250$. If actual spend known by 10:00 is \\$230, the as-of pacing ratio is $230/250=0.92$; using the final daily spend \\$660 gives $660/250=2.64$, a backward leak." },
    { title: "Creator Marketplace AI match scoring", background: "Creator and brand histories are rich, but historical examples must not use collaborations or ratings that happened after the match opportunity. The feature store needs a true as-of read.", numbers: "For a brief sent on June 10, the creator had accepted 12 brand deals before June 10 and 3 more by July 1. The training feature is 12, not 15; using 15 leaks $3/12=25\\%$ extra post-opportunity history." },
    { title: "Search Ads query relevance validation", background: "Search traffic changes quickly, so random validation can put later query patterns into training. A time split asks the honest question: can Monday-through-Thursday behavior predict Friday?", numbers: "With 1,000,000 impressions, a temporal split might train on the first 800,000 chronological rows and validate on the last 200,000. A random 80/20 split has the same counts, but it lets Friday rows appear in both train and validation, hiding drift." },
    { title: "Event Organic and Feed SPR group leakage", background: "Feed-side prediction can contain many rows for the same event, organizer, or member. Even perfect timestamp filters do not prevent memorization if an entity crosses the split.", numbers: "If one event contributes 500 impressions and a random 80/20 split is used, about 400 rows land in train and 100 in validation for that same event. A grouped split moves all 500 together, so validation measures generalization to unseen events instead of memorization." }
  ],
  applicationsClose:
    "<p>Across pCTR, Instream Ads, Event Ads, Creator Marketplace, Search Ads, and Feed prediction, the same discipline carries the lesson: freeze the feature world at $t_i$, wait until $t_i+\\Delta$ for the label, and validate in the same temporal direction that production will face.</p>",
  takeaways: [
    "A point-in-time row has two clocks: features freeze at $t_i$, while labels are observed over $[t_i,t_i+\\Delta)$.",
    "As-of joins use only events with timestamps strictly less than the row's freeze time; current-state backfills leak future information backward.",
    "Rows with unfinished attribution windows are delayed or censored, not safe negatives.",
    "Temporal validation checks forecasting honestly, and grouped validation prevents repeated entities from leaking across the split."
  ],
  resources: [
    { label: "Feast — point-in-time joins", note: "feature-store documentation for as-of retrieval and historical feature generation" },
    { label: "Tecton — preventing training-serving skew", note: "production framing of historical features, online features, and backfills" }
  ],
  papers: [
    "Delayed Feedback in Display Advertising (Chapelle, 2014)",
    "Feast: Bridging ML Models and Data (feature store documentation and design notes)"
  ],
  notebook: [
    { t: "md", src:
      "# M2.2 · Point-in-time feature/label joins\n\n" +
      "_Curriculum · Domain 0 · ML Foundations · Feature engineering & leakage_\n\n" +
      "**Freeze features at prediction time, then let the label window unfold after that moment.**\n\n" +
      "We will build a tiny ads event log, create a correct as-of feature with $\\text{timestamp}(e_j)<t_i$, and compare it with a leaky feature that counts clicks inside the label window. _Save a copy to your Drive (File -> Save a copy in Drive) to keep your edits._" },
    { t: "code", src:
      "import numpy as np\n" +
      "import pandas as pd\n" +
      "import matplotlib.pyplot as plt\n\n" +
      "rng = np.random.default_rng(7)" },
    { t: "md", src:
      "## Build impressions and delayed click outcomes\n\n" +
      "Each row is an impression at freeze time $t_i$. The label asks whether a click arrives in $[t_i,t_i+\\Delta)$, with $\\Delta=10$ minutes." },
    { t: "code", src:
      "n = 240\n" +
      "campaigns = np.array([\"A\", \"B\", \"C\"])\n" +
      "impression_times = pd.date_range(\"2026-01-01 09:00\", periods=n, freq=\"min\")\n" +
      "campaign = rng.choice(campaigns, size=n, p=[0.45, 0.35, 0.20])\n" +
      "label = (rng.random(n) < 0.24).astype(int)\n\n" +
      "impressions = pd.DataFrame({\"impression_id\": np.arange(n), \"campaign\": campaign, \"t\": impression_times, \"label\": label})\n\n" +
      "print(impressions.head())" },
    { t: "md", src:
      "## Create the click event log\n\n" +
      "Positive labels create a future click inside the 10-minute window. We also add background clicks before and between impressions so the as-of feature has real history." },
    { t: "code", src:
      "positive_rows = impressions[impressions[\"label\"] == 1].copy()\n" +
      "delays = rng.integers(1, 10, size=len(positive_rows))\n" +
      "positive_clicks = pd.DataFrame({\"campaign\": positive_rows[\"campaign\"].to_numpy(), \"click_time\": positive_rows[\"t\"].to_numpy() + pd.to_timedelta(delays, unit=\"min\"), \"source\": \"label_window\"})\n\n" +
      "background_n = 90\n" +
      "background_offsets = rng.integers(-80, n, size=background_n)\n" +
      "background_clicks = pd.DataFrame({\"campaign\": rng.choice(campaigns, size=background_n), \"click_time\": pd.Timestamp(\"2026-01-01 09:00\") + pd.to_timedelta(background_offsets, unit=\"min\"), \"source\": \"background\"})\n\n" +
      "clicks = pd.concat([positive_clicks, background_clicks], ignore_index=True)\n" +
      "clicks = clicks.sort_values(\"click_time\").reset_index(drop=True)\n\n" +
      "print(clicks.head())\n" +
      "print(clicks[\"source\"].value_counts())" },
    { t: "md", src:
      "## Correct as-of feature\n\n" +
      "For each campaign, compute a running click count and use `merge_asof` with `allow_exact_matches=False`. That enforces the strict rule $\\text{click\\_time}<t_i$." },
    { t: "code", src:
      "click_counts = clicks.sort_values([\"campaign\", \"click_time\"]).copy()\n" +
      "click_counts[\"prior_clicks_after_event\"] = click_counts.groupby(\"campaign\").cumcount() + 1\n\n" +
      "pieces = []\n" +
      "for name in campaigns:\n" +
      "    left = impressions[impressions[\"campaign\"] == name].sort_values(\"t\")\n" +
      "    right = click_counts[click_counts[\"campaign\"] == name].sort_values(\"click_time\")\n" +
      "    joined = pd.merge_asof(left, right[[\"click_time\", \"prior_clicks_after_event\"]], left_on=\"t\", right_on=\"click_time\", direction=\"backward\", allow_exact_matches=False)\n" +
      "    pieces.append(joined)\n\n" +
      "asof = pd.concat(pieces, ignore_index=True)\n" +
      "asof[\"prior_clicks\"] = asof[\"prior_clicks_after_event\"].fillna(0).astype(int)\n" +
      "asof = asof.sort_values(\"impression_id\").reset_index(drop=True)\n\n" +
      "print(asof[[\"impression_id\", \"campaign\", \"t\", \"prior_clicks\", \"label\"]].head())" },
    { t: "md", src:
      "## A naive feature that leaks\n\n" +
      "Now count clicks from the same campaign through $t_i+10$ minutes. This feature includes the exact outcome window used to define the label." },
    { t: "code", src:
      "def count_through_window(row):\n" +
      "    same_campaign = clicks[\"campaign\"] == row[\"campaign\"]\n" +
      "    before_window_end = clicks[\"click_time\"] < row[\"t\"] + pd.Timedelta(minutes=10)\n" +
      "    return int((same_campaign & before_window_end).sum())\n\n" +
      "asof[\"leaky_clicks_through_window\"] = asof.apply(count_through_window, axis=1)\n" +
      "asof[\"leaky_increment\"] = asof[\"leaky_clicks_through_window\"] - asof[\"prior_clicks\"]\n\n" +
      "print(asof[[\"impression_id\", \"prior_clicks\", \"leaky_clicks_through_window\", \"leaky_increment\", \"label\"]].head(10))" },
    { t: "md", src:
      "## Measure the leakage signal\n\n" +
      "A correct historical count can be useful, but it should not contain the label window itself. The leaky increment should correlate much more strongly with $y_i$ because it includes future clicks." },
    { t: "code", src:
      "corr_prior = asof[\"prior_clicks\"].corr(asof[\"label\"])\n" +
      "corr_leaky_increment = asof[\"leaky_increment\"].corr(asof[\"label\"])\n\n" +
      "print(\"corr(prior_clicks, label):\", round(float(corr_prior), 3))\n" +
      "print(\"corr(leaky_increment, label):\", round(float(corr_leaky_increment), 3))\n\n" +
      "assert corr_leaky_increment > 0.35\n" +
      "assert abs(corr_prior) < 0.25\n" +
      "assert corr_leaky_increment > corr_prior + 0.35" },
    { t: "md", src:
      "## Delayed labels and censored rows\n\n" +
      "If the data extract time is before $t_i+\\Delta$, the row is not a safe negative. It is censored because a positive click could still arrive." },
    { t: "code", src:
      "extract_time = impressions[\"t\"].max() + pd.Timedelta(minutes=5)\n" +
      "asof[\"window_closed\"] = asof[\"t\"] + pd.Timedelta(minutes=10) <= extract_time\n" +
      "closed_count = int(asof[\"window_closed\"].sum())\n" +
      "censored_count = int((~asof[\"window_closed\"]).sum())\n\n" +
      "print(\"closed rows:\", closed_count)\n" +
      "print(\"censored rows:\", censored_count)\n\n" +
      "assert censored_count == 5" },
    { t: "md", src:
      "## Practice\n\n" +
      "Try each in the empty cell below.\n\n" +
      "1. Change $\\Delta$ from 10 minutes to 5 minutes and rebuild the leaky count.\n" +
      "2. Add a same-time click and confirm that `allow_exact_matches=False` excludes it from the feature.\n" +
      "3. Replace the final random split you would normally use with a chronological split, then compare the feature distributions." },
    { t: "code", src:
      "# Your turn:\n" }
  ]
};
