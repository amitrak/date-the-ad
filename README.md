# Date the Ad

**A Marketing History Game** — [adquiz.marketinghistory.org](https://adquiz.marketinghistory.org)

We show you a historic advertisement. You guess the year it ran.

Ten rounds, 100 points, drawn at random from a pool of 35 campaigns spanning 140 years — from Pears' Soap "Bubbles" (1886) to Volvo's "Epic Split" (2013). A companion to [marketinghistory.org](https://marketinghistory.org).

## How it works

Each round shows one ad and asks for its year. Guess by typing a year or by picking from four options — you can switch modes any round.

Scoring rewards precision, on a curve that widens for older work:

| | Modern (1926–present) | Vintage (pre-1926) |
| --- | --- | --- |
| Exact | 10 | 10 |
| 1 year off | 8 | 8 (within 3) |
| 2–5 years off | 5 | 5 (within 7) |
| 6–10 years off | 3 | 3 (within 20) |
| Beyond that | 0 | 0 |

The vintage window is computed as `currentYear - 100`, so it stays correct as time passes.

After each guess the game reveals the year, why the ad matters, a piece of trivia, and a link to the media's source page. Some ads link to the relevant [A History of Marketing](https://marketinghistory.org) episode.

## Structure

Everything is one file. No build step, no dependencies, no framework.

```
index.html     the whole game — markup, styles, data, logic
og-image.png   1200×630 social preview card
CNAME          custom domain for GitHub Pages
```

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
  listen: { label, url }  // optional: related podcast episode
}
```

Two flags worth knowing. `titleSafe` controls the strip that covers the YouTube title bar — omit it and the game hides the title, since many uploads have the year right in them. `lightBg` puts white behind transparent artwork; without it, dark linework disappears into the dark frame.

## Media

All media is hosted by Wikimedia Commons, Wikipedia, or YouTube and linked back to its source page. Nothing is rehosted here.

## Deploying

See [DEPLOY.md](DEPLOY.md).
