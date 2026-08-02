# Deploying Date the Ad

Target: **https://date-the-ad.marketinghistory.org**

Same stack as cmogame.com — GitHub Pages, custom domain, DNS at Cloudflare.

## What ships

| File | Purpose |
| --- | --- |
| `index.html` | The entire game. No build step, no dependencies. |
| `og-image.png` | 1200×630 social preview card, referenced by the meta tags. |
| `CNAME` | Tells GitHub Pages which custom domain to serve. |

`DEPLOY.md` and `.claude/` are not needed by the site and can stay out of the repo.

## 1. Push to GitHub

```bash
cd /Users/andrew/advertisingquiz && git init -b main && git add index.html og-image.png CNAME && git commit -m "Date the Ad: a marketing history game"
```

Create an empty repo named `date-the-ad` on GitHub, then:

```bash
git remote add origin git@github.com:amitrak/date-the-ad.git && git push -u origin main
```

## 2. Turn on Pages

Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch `main`, folder `/ (root)` → Save.

The `CNAME` file makes GitHub pick up the custom domain automatically. Leave **Enforce HTTPS** checked once it becomes available (it greys out until the certificate is issued).

## 3. Add the DNS record in Cloudflare

In the `marketinghistory.org` zone:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `date-the-ad` | `amitrak.github.io` | **DNS only (grey cloud)** |

Grey cloud matters. Your cmogame.com records resolve straight to GitHub's IPs (185.199.108–111.153), so that zone is already set to DNS-only — match it. Leaving the orange cloud on blocks GitHub from issuing the TLS certificate and can cause redirect loops under Cloudflare's Flexible SSL mode.

This record only adds a subdomain. The apex `marketinghistory.org` keeps pointing at Substack, untouched.

## 4. Verify

Certificate issuance usually takes 10–30 minutes.

```bash
curl -sI https://date-the-ad.marketinghistory.org/ | head -3
```

Then check the social card renders before you announce it:

- X: https://cards-dev.twitter.com/validator
- Facebook: https://developers.facebook.com/tools/debug/
- LinkedIn: https://www.linkedin.com/post-inspector/

## Updating later

Edit `index.html`, commit, push. Pages redeploys in about a minute.

## If you move the domain

Three things carry the URL and must change together:
1. `CNAME`
2. The `canonical`, `og:url`, `og:image`, and `twitter:image` tags in `index.html` (lines 9–23)
3. The Cloudflare DNS record

The in-game share buttons read `location.href` at runtime, so those need no edit.
