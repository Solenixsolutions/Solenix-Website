# SOLENIX WEBSITE — PROJECT STATE (build v13)

## Project
Static website for Solenix Solutions (solar mounting hardware manufacturer, Jalandhar, Punjab).
Hosting: **live on GitHub Pages at https://solenixsolutions.com** (custom domain via Cloudflare DNS, DNS-only/grey-cloud, HTTPS enforced). No frameworks; vanilla HTML/CSS/JS. Current build: **v13** (footer build-tag shows version). v13 also added SEO canonical + Open Graph/Twitter social-preview meta tags (og:image = hero-bg.jpg) so shared links render an image+title card.

## Company facts used on site
- Phone/WhatsApp: +91 94171 22679 → links use https://wa.me/919417122679
- Email: solenixsolutions@gmail.com · Instagram: @solenixsolutions
- Address: Adjoining Kosmo Tata showroom, Kapurthala Road, Jalandhar, Punjab (map iframe q=Kapurthala Road, Jalandhar, Punjab, z=13)
- Tagline "— Power That Holds —" lives ONLY in brand lockup (header + footer), not as separate hero text
- Location = Jalandhar only (all Ludhiana mentions removed in v4)
- Logo: navy S-arrow mark → images/logo-mark.png (transparent bg) + favicon.png

## Products (js/products.js — single source of truth)
**v11 replaced the old 23-product PDF catalog with user-supplied photos; v12 completed the range from the user's "Solar products" folder (July 2026, moved into the site and deleted).** Now 27 products.
SKUs: 01 GI Solgrip Clamp · 02 HDG Mid Clamp · 03 GI Spring Nut · 04 GI Strut Base Plate · 05 Wedge Anchor Fastener · 06 Rawl Anchor Fastener · 07 Water Clips · 08 Rafters JSW/Apollo · 09 MC4 Connectors · 10 Alu Mid Clamp · 11 GI Mid Clamp · 12 GI End Clamp · 13 Anti-Theft Clamp · 14 GI B4 Base Plate · 15 GI C Lip Base Plate · 16 GI Degree Angle · 17 GI Strut Jointer · 18 GI Nut Bolt & Washer · 19 GI J Hook (new) · 20 Alu Monorail · 21 Solar Panels (new) · 22 ACDB Box · 23 DCDB Box · 24 AC Wire · 25 DC Wire · 26 Copper Bonded Earthing Rod · 27 Copper Bonded Lightning Arrester. Old ACDB&DCDB / AC&DC-wire combos split into separate products; descriptions otherwise reused from the old catalog where the product matched.
Each: {sku, name, desc (1–2 sentence installer-focused), category, image, tags}.
Categories (6): Clamps (6) · Base Plates & Brackets (4) · Fasteners & Hardware (7) · Rails & Structures (2) · Solar Panels (1, added v12) · Electrical & Earthing (7).
Product images: normalized to 720×540 4:3 — cover-crops for most, white-padded "contain" for tall shots (monorail, ACDB/DCDB, AC wire, lightning arrester), hand-picked crops for Water clips composite + earthing rod.
Adding product #28 = drop photo in images/products/ + append one block to PRODUCTS.

## Page structure (top→bottom, v10)
1. Topstrip (trust line + phone/email)
2. Header: logo lockup w/ tagline · nav Home / About Us / **Products ▾ dropdown (5 categories → filters catalog)** / Contact Us · "Request a Quote" WhatsApp pill · shadow on scroll
3. Hero: bg = user's sunset-rooftop photo (mirrored so sun glows right), kenburns + staggered load-in. H1: "Build on **Strength**.<br>Trusted for Performance." (user's copy verbatim; may want "Built"). Sub: "Premium solar mounting systems and accessories crafted for EPC companies, distributors and solar professionals." Buttons: Explore products / Contact us. (Kicker, chips, installers photo-card all REMOVED in v8.)
4. Amber ticker marquee (bulk mfg ✦ fast delivery ✦ PAN India ✦ …)
5. Featured slider (replaced stats band): SKUs 01, 04, 08, 07, 09 (hardcoded `FEATURED` list in main.js); photo left + navy info panel right; auto 4.5 s, arrows + dots, pause on hover/touch, stacks on mobile
6. About: branded Solenix factory collage (user's "About us.jpeg", v11 — replaced old collage at images/factory.jpg) + "Made in Jalandhar" badge; lede "Building Confidence. Supporting Clean Energy." + 4 paragraphs (user's copy)
7. Mission/Vision cards (navy card + amber-gradient card, user's copy)
8. Our Values: 5 cards (Quality Without Compromise / Precision in Every Detail / Customer Partnership / Innovation / Integrity)
9. Why Choose Solenix: 8-item ✓ checklist grid (user's list)
10. Catalog: search box + category chips + result count + 27 cards (category pill, name, desc, SKU, WhatsApp "Get a quote")
11. CTA band: bg = user's turbines+panels photo. "Let's Build the Future of Solar Infrastructure" + user's line. Buttons: Request a Quote Today / Talk to our team
12. Contact: Address/Phone/E-mail/Follow/Delivery blocks + "Send us a message" form (opens WhatsApp with composed message; no backend) + Google Map iframe
13. Footer: 4 cols — brand+blurb / Quick links (incl. **Apply for Distributor** → WhatsApp prefilled) / Our products (auto from CATEGORIES) / Get in touch. Base line: © … · v10 · gold tagline
14. Floating WhatsApp FAB + back-to-top button

## Design system (css/style.css)
Colors: --ink-950 #0a1622 · --navy-900 #0f2438 · --navy-700 #16324f · --amber-500 #f2a414 · --amber-600 #d18a06 · --paper #f5f7f8 · --line #dbe2e8.
Fonts (Google): Saira SemiCondensed (display 700/800) · Inter (body) · IBM Plex Mono (kickers, SKUs).
Motion: hero kenburns + .load-1/2/3 stagger; .reveal→.in-view scroll reveals (IntersectionObserver, JS in main.js); card hover lift + img zoom; all behind prefers-reduced-motion. Mobile: nav links hidden ≤960 px (chips still filter), slider stacks, no horizontal overflow.

## Files & build
Repo root: `C:\Users\aayus\Solenix-Website\` (not a git repo yet). Layout:
- `solenix-website/` — **editable multi-file source** (this is what deploys to GitHub Pages, with HIGH-quality images):
  index.html · css/style.css · js/products.js · js/main.js · images/ (products/01–27.jpg, hero-bg.jpg, cta-bg.jpg, factory.jpg, logo-mark.png, favicon.png, solar-banner.jpg[unused], README.md)
- `solenix-website-publish.html` — single-file bundle, images compressed (≈447 KB). For Claude's Publish button (≤~500 KB is the safe limit; 1.3 MB failed once). **STALE — still v10 with the old 23-product catalog.**
- `solenix-website-preview.html` — single-file bundle, full-quality images (~1.8 MB) for phone preview. **STALE — still v10 with the old 23-product catalog.**
- No build script lives in this repo. The two single-file bundles were produced by a `build_site.py` image-inlining/compression step that ran in a separate (Linux) authoring environment — to refresh them you must reconstruct that step (inline css/js, embed images as data URIs, compress the publish variant). Develop by opening/serving `solenix-website/` directly; no build needed for the deployable site.
- After edits: bump the build tag in TWO places in index.html — the top comment `<!-- … build vN -->` (line 2) and the footer `<span class="build-tag">vN</span>`. Then regenerate the bundles if the user needs to re-publish.

## Workflow learnings
- User publishes via Claude's Publish button; every new build ⇒ they re-publish new file + unpublish old link. Footer build-tag = version check.
- Raw index.html opened from Android Downloads (content://) can't load sibling files ⇒ single-file previews exist for that.
- Content facts and exact copy are locked here — consult before rewording; keep this doc updated when structure changes.

## Open items
- Confirm headline wording: "Build on Strength" (current, verbatim) vs "Built on Strength".
- ✅ Deployed & live: https://solenixsolutions.com (apex primary; www → apex). Domain bought on Cloudflare (registrar + DNS). DNS records are **DNS-only / grey-cloud**: apex A → GitHub Pages 185.199.108–111.153, www CNAME → solenixsolutions.github.io. GitHub Pages custom domain set via Pages API (`cname`), HTTPS cert approved + `https_enforced:true`. Deploy = push to main → deploy-pages.yml.
