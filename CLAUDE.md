# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing/catalog website for **Solenix Solutions** — a solar mounting hardware manufacturer in Jalandhar, Punjab. Vanilla HTML/CSS/JS, no framework, no build step required to develop. Designed to be hosted free on GitHub Pages. There is no backend — every "enquiry"/"quote" action deep-links to WhatsApp.

## Layout of the repo

- `solenix-website/` — **the editable source site** (deploy this folder to GitHub Pages).
  - `index.html` — the entire single-page site (all sections inline).
  - `css/style.css` — all styling; design tokens live in `:root`.
  - `js/products.js` — **the product catalog data** (`CATEGORIES` + `PRODUCTS`). Single source of truth.
  - `js/main.js` — renders catalog/search/filters/nav-dropdown/footer-links/featured-slider from that data; wires the enquiry form and scroll UI. Rarely needs editing. Its `cardHTML()` is mirrored by `tools/gen-seo.js` (see below) — change both together.
  - `images/products/01.jpg…27.jpg` — one photo per product (720×540 studio shots); other images are hero/cta/factory/logo/favicon.
  - `tools/gen-seo.js` — **SEO/AI generator.** Reads `products.js` and (re)writes: the static product cards inside `#grid`, the `Product` `ItemList` JSON-LD, and the "Catalog updated" date — all between `<!-- GEN:NAME:START -->` / `<!-- GEN:NAME:END -->` markers in `index.html` — plus `sitemap.xml` and `llms.txt`. Idempotent. Runs automatically in the deploy Action; also run `node tools/gen-seo.js` locally after editing `products.js`.
  - `robots.txt` (allows all crawlers incl. GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot; links the sitemap), `sitemap.xml` (generated), `llms.txt` (generated plain-language AI brief), `CNAME` (`solenixsolutions.com`), `.nojekyll` — all live in `solenix-website/` so they serve at the domain root.
  - A hand-written `Organization`/`LocalBusiness` JSON-LD block sits before `</body>` in `index.html` (static — edit by hand if NAP/contact changes); the `Product` `ItemList` block right after it is generated.
- `SOLENIX_PROJECT_STATE.md` — detailed running design/build log and company facts. Authoritative for content decisions, but note it can lag the code (it references build v8 while the code is at **v10**).
- `solenix-website-preview.html` / `solenix-website-publish.html` — **generated single-file bundles** (all images inlined as data URIs). `preview` is full quality (~1.8 MB, for phone preview); `publish` is compressed (~447 KB, sized to stay under the ~500 KB limit of Claude's Publish button). These are build outputs — do not hand-edit them; regenerate from source (see below).

## Developing / running

No build or install step. Open `solenix-website/index.html` in a browser, or serve the folder statically:

```sh
cd solenix-website && python3 -m http.server 8000   # then open http://localhost:8000
```

Note: opening `index.html` directly via `file://` on some mobile contexts blocks loading sibling CSS/JS/images — that's the reason the single-file `*-preview.html` bundle exists.

There is no test suite, linter, or package manifest.

## Editing conventions

- **Add/change a product:** edit `js/products.js` only. Append a block to `PRODUCTS` with `{ sku, name, category, image, desc, alt, tags }`; `category` must exactly match a `CATEGORIES` entry; drop the photo in `images/products/`. `alt` is an optional short, descriptive image alt (SEO + a11y); if omitted, both `cardHTML`s and the slider fall back to `name` (`p.alt || p.name`). The grid, search, category chips, nav dropdown, and footer product links all regenerate from this array. Add a new category by adding its name to `CATEGORIES`. **Then run `node tools/gen-seo.js`** (or just push — the deploy Action runs it) so the static `#grid` cards, `Product` JSON-LD, `sitemap.xml` and `llms.txt` regenerate from the new data.
- **Never hand-edit content between `<!-- GEN:NAME:START -->` and `<!-- GEN:NAME:END -->` markers** in `index.html` — `tools/gen-seo.js` overwrites it. Edit `products.js` (or the generator) instead. The pre-rendered `#grid` cards exist so crawlers and no-JS/AI clients see the catalog; `main.js` re-renders the same markup as the interactive (search/filter) layer on load.
- **`main.js` depends on fixed element IDs** in `index.html` (`grid`, `chips`, `nav-cats`, `footer-cats`, `slides`, `sc-dots`/`sc-prev`/`sc-next`, `enquiry-form`, `topbar`, `to-top`, `year`, `search`, `clear-search`, `empty`, `result-count`). Renaming/removing an ID silently breaks that feature.
- **Featured slider** is driven by the hardcoded `FEATURED` SKU list in `main.js` (`["01","05","15","08","22"]`), not by product data.
- **WhatsApp is the only "backend."** The phone number `919417122679` is hardcoded in ~13 places across `index.html` and `js/main.js` (as `https://wa.me/919417122679?text=…`). Change all of them together if it ever changes; email is `solenixsolutions@gmail.com`.
- **Bump the build tag on every meaningful change** — two places in `index.html`: the top comment `<!-- … build vN -->` (line 2) and the footer `<span class="build-tag">vN</span>`. The footer tag is the user's visual version check after re-publishing.
- **Content facts** (address, tagline "— Power That Holds —", Jalandhar-only location, exact copy) are locked in `SOLENIX_PROJECT_STATE.md` — consult it before rewording, and keep it updated when structure changes.

## Design system (`css/style.css`)

Colors via CSS vars: `--navy-700 #16324f`, `--amber-500 #f2a414`, `--paper #f5f7f8`, etc. Fonts (Google): Saira SemiCondensed (display), Inter (body), IBM Plex Mono (kickers/SKUs). Motion (hero kenburns, `.reveal`→`.in-view` IntersectionObserver reveals, hover lifts) is all gated behind `prefers-reduced-motion`. Layout must stay responsive with no horizontal overflow; nav links hide ≤960 px (category chips still filter).

## Regenerating the single-file bundles

The bundles were produced by a `build_site.py` image-inlining/compression script that lived in a separate (Linux) authoring environment and **is not in this repo** — so `python3 build_site.py` will not work here as-is. If asked to refresh `*-publish.html` / `*-preview.html`, you'll need to reconstruct that step (inline `css`/`js`, embed images as data URIs, compress for the publish variant). The `solenix-website/` multi-file folder — with full-quality images — is what actually deploys to GitHub Pages; the bundles are only for previewing and Claude's Publish button.
