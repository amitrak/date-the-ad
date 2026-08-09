# Ad images

Two kinds of image appear in the game.

**Freely licensed** ads are not stored here. They are loaded from Wikimedia
Commons or Wikipedia and link back to their file page, which carries the
licence.

**Still in copyright** ads are stored here, reproduced at reduced resolution
for historical commentary under a fair use rationale. The footer of the site
states that rationale and gives a takedown contact.

## Adding one

```
./build-ad-images.sh avis-1963 ~/Downloads/avis-scan.jpg
```

That writes `avis-1963.jpg` (longest edge 1200px, under ~300KB) and
`avis-1963-thumb.jpg` (400px). Both are re-encoded, so no EXIF from the
original survives.

Then in `index.html`, find the entry with that `slug`, delete its
`status: "draft"` line, and fill in `credit.source` with the URL you took the
scan from.

## Sourcing

Prefer university library digitisations, magazine archive scans, personal
collections, or enthusiast archives. Do not use scans from Getty, Alamy, The
Advertising Archives, or other stock agencies: those carry the agency's own
claim on top of the advertisement's, and watermarked copies make the fair use
posture worse rather than better.

Keep the source URL. It goes in `credit.source` and is what makes the
provenance auditable later.
