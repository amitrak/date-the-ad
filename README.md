# Date the Ad

**A Marketing History Game** — [adquiz.marketinghistory.org](https://adquiz.marketinghistory.org)

We show you a historic advertisement. You guess the year it ran.

Ten rounds, 100 points, drawn at random from a pool of 35 campaigns spanning 140 years — from Pears' Soap "Bubbles" (1886) to Volvo's "Epic Split" (2013). A companion to [marketinghistory.org](https://marketinghistory.org).

## How it works

Each round shows one ad and asks for its year. Guess by typing a year or by picking from four options — you can switch modes any round.

Scoring rewards precision, on a curve that widens for older work:

| Points | Modern (1926–present) | Vintage (pre-1926) |
| --- | --- | --- |
| 10 | exact | exact |
| 9 | 1 year off | 1–2 years off |
| 8 | 2 years off | 3–4 years off |
| 7 | 3 years off | 5–6 years off |
| 6 | 4 years off | 7–8 years off |
| 5 | 5 years off | 9–10 years off |
| 3 | 6–9 years off | 11–13 years off |
| 2 | 10–12 years off | 14–16 years off |
| 1 | 13–15 years off | 17–20 years off |
| 0 | more than 15 | more than 20 |

The vintage window is computed as `currentYear - 100`, so it stays correct as time passes.

Ads carrying a `yearRange` ran as campaigns rather than debuting once. Any year inside the
span scores 10, then 8 one year out, 6 at two to three, 2 at four to five, 0 beyond.

After each guess the game reveals the year, why the ad matters, a piece of trivia, and a link to the media's source page. Some ads link to the relevant [A History of Marketing](https://marketinghistory.org) episode.

## Structure

Everything is one file. No build step, no dependencies, no framework.

```
index.html            the whole game — markup, styles, data, logic
og-image.png          1200×630 social preview card
CNAME                 custom domain for GitHub Pages
CONTENT.md            every ad, note, link, and quote (generated)
build-content-doc.js  regenerates CONTENT.md from index.html
```

`CONTENT.md` is generated — edit copy in `index.html`, then run
`node build-content-doc.js` to refresh it.

Ads live in the `ADS` array near the top of the script. Each entry:

```js
{
  id, title, year,
  mediaType: "image" | "video",
  mediaUrl,        // Commons FilePath, or YouTube embed URL
  sourceUrl,       // public page the media lives on
  significance,    // why this ad matters
  fact,            // trivia shown after the guess
  titleSafe: true, // optional: YouTube title doesn't reveal the year
  lightBg: true,   // optional: artwork is transparent, needs a white frame
  listen: [ep("zyman1", "why this episode is relevant here")]  // optional, any number
}
```

Episodes live in the `EP` map above the ads, keyed by guest (`tungate`, `calkins`,
`bernays`…), so a URL or title is written once and reused. `ep(key, note)` pairs one
with a line explaining its relevance to that specific ad.

Two flags worth knowing. `titleSafe` controls the strip that covers the YouTube title bar — omit it and the game hides the title, since many uploads have the year right in them. `lightBg` puts white behind transparent artwork; without it, dark linework disappears into the dark frame.

## Media

All media is hosted by Wikimedia Commons, Wikipedia, or YouTube and linked back to its source page. Nothing is rehosted here.

## Deploying

See [DEPLOY.md](DEPLOY.md).
