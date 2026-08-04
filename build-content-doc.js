// Pull the live data structures out of index.html and render a content doc.
// Extracting rather than retyping keeps this in sync with what ships.
const fs = require("fs");
const src = fs.readFileSync(require("path").join(__dirname, "index.html"), "utf8");

function block(startMarker, endMarker) {
  const i = src.indexOf(startMarker);
  if (i === -1) throw new Error("not found: " + startMarker);
  const j = src.indexOf(endMarker, i);
  if (j === -1) throw new Error("end not found for: " + startMarker);
  return src.slice(i, j + endMarker.length);
}

const epSrc     = block("var EP = {", "\n  };");
const helperSrc = block("function ep(key, note)", "\n  }");
const adsSrc    = block("var ADS = [", "\n  ];");
const quotesSrc = block("var QUOTES = [", "\n  ];");
const ranksSrc  = block("var RANKS = [", "\n  ];");

const sandbox = {};
const fn = new Function(epSrc + helperSrc + adsSrc + quotesSrc + ranksSrc +
  "return {EP: EP, ADS: ADS, QUOTES: QUOTES, RANKS: RANKS};");
const { EP, ADS, QUOTES, RANKS } = fn();

const CURRENT_YEAR = 2026;
const VINTAGE_CUTOFF = CURRENT_YEAR - 100;
const isVintage = y => y < VINTAGE_CUTOFF;

const out = [];
const p = s => out.push(s);

p("# Date the Ad — Full Content Script");
p("");
p("Every ad, note, episode link, and quote in the game.");
p("");
p("**Generated file — do not edit by hand.** Edit the data in `index.html`, then run");
p("`node build-content-doc.js` to regenerate this.");
p("");
p(`**${ADS.length} ads** in the pool · **${ADS.filter(a => a.listen).length}** link to episodes · ` +
  `**${ADS.filter(a => isVintage(a.year)).length}** score on the vintage curve · ` +
  `**${QUOTES.length}** rotating footer quotes`);
p("");
p(`Span: ${Math.min(...ADS.map(a => a.year))}–${Math.max(...ADS.map(a => a.year))}. ` +
  "Ten are drawn at random per playthrough.");
p("");
p("---");
p("");
p("## The ads");
p("");
p("Listed chronologically. Vintage ads (pre-" + VINTAGE_CUTOFF + ") score on the wider curve.");
p("");

const sorted = ADS.slice().sort((a, b) => a.year - b.year);

for (const ad of sorted) {
  const tags = [];
  tags.push(ad.mediaType === "video" ? "Video" : "Image");
  if (isVintage(ad.year)) tags.push("Vintage scoring");
  if (ad.titleSafe) tags.push("Title shown");
  else if (ad.mediaType === "video") tags.push("Title hidden");
  if (ad.lightBg) tags.push("Light background");

  p(`### ${ad.year} — ${ad.title}`);
  p("");
  p(`*${tags.join(" · ")}*`);
  p("");
  p(`**Why it matters.** ${ad.significance}`);
  p("");
  p(`**Did you know?** ${ad.fact}`);
  p("");
  p(`**Source.** [${ad.sourceUrl.includes("youtube") ? "YouTube"
      : ad.sourceUrl.includes("commons.wikimedia") ? "Wikimedia Commons"
      : ad.sourceUrl.includes("wikipedia") ? "Wikipedia" : "Original"}](${ad.sourceUrl})`);
  p("");
  const eps = ad.listen ? [].concat(ad.listen) : [];
  if (eps.length) {
    p("**Hear more on A History of Marketing.**");
    p("");
    for (const e of eps) {
      p(`- [${e.label}](${e.url})`);
      if (e.note) p(`  <br>${e.note}`);
    }
    p("");
  }
}

p("---");
p("");
p("## Episodes referenced");
p("");
p("| Episode | Ads that link to it |");
p("| --- | --- |");
const byEpisode = {};
for (const ad of sorted) {
  for (const e of (ad.listen ? [].concat(ad.listen) : [])) {
    (byEpisode[e.url] = byEpisode[e.url] || { label: e.label, ads: [] }).ads.push(`${ad.title} (${ad.year})`);
  }
}
for (const url of Object.keys(byEpisode).sort((a, b) => byEpisode[b].ads.length - byEpisode[a].ads.length)) {
  const e = byEpisode[url];
  p(`| [${e.label}](${url}) | ${e.ads.join("; ")} |`);
}
p("");

p("---");
p("");
p("## Footer quotes");
p("");
p("One is chosen at random on load and again at the start of each new game.");
p("");
for (const q of QUOTES) p(`- “${q.t}” — **${q.a}**`);
p("");

p("---");
p("");
p("## Rank badges");
p("");
p("| Score | Rank | Blurb |");
p("| --- | --- | --- |");
for (const r of RANKS) p(`| ${r.min}+ | ${r.medal} ${r.rank} | ${r.blurb} |`);
p("");

p("---");
p("");
p("## Scoring");
p("");
p("| Guess is off by | Modern (" + VINTAGE_CUTOFF + "–present) | Vintage (pre-" + VINTAGE_CUTOFF + ") |");
p("| --- | --- | --- |");
p("| Exact | 10 | 10 |");
p("| 1 year | 8 | 8 (within 3) |");
p("| 2–5 years | 5 | 5 (within 7) |");
p("| 6–10 years | 3 | 3 (within 20) |");
p("| More | 0 | 0 |");
p("");
p("The vintage cutoff is computed as `currentYear - 100`, so it moves with time.");
p("");

p("---");
p("");
p("## Interface copy");
p("");
p("| Where | Text |");
p("| --- | --- |");
p("| Wordmark | DATE THE AD |");
p("| Tagline | A Marketing History Game |");
p("| Headline | Can you guess the year of the *iconic ad*? |");
p("| Subhead | We show you a historic advertisement, from Victorian soap posters to viral Super Bowl spots. You guess the year it ran. |");
p("| Start button | Start the Quiz |");
p("| Round prompt | What year did this ad first run? |");
p("| Input modes | Enter Year / Multiple Choice |");
p("| Submit button | Rotates: Lock It In · That's My Guess · Final Answer · Ship It |");
p("| Video guard | Title hidden |");
p("| Media caption | Television commercial / Print advertisement · Source: … |");
p("| Vintage popover | This ad is over a century old, so it scores on a gentler curve: exact year = 10 pts, within 3 years = 8, within 7 = 5, within 20 = 3. Newer ads use tighter margins. |");
p("| Next button | Next Round → / See Final Score → |");
p("| End screen | Share Your Score · Play Again · Share on X · Facebook · LinkedIn · Download scorecard |");
p("| Footer | Media links to Wikimedia or YouTube source pages · From marketinghistory.org |");
p("");

fs.writeFileSync(require("path").join(__dirname, "CONTENT.md"), out.join("\n"));
console.log("ads:", ADS.length, "| with episodes:", ADS.filter(a => a.listen).length,
            "| quotes:", QUOTES.length, "| unique episodes:", Object.keys(byEpisode).length);
