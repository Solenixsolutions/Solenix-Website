#!/usr/bin/env node
/* ============================================================
   SOLENIX SOLUTIONS — SEO / AI-visibility generator
   ------------------------------------------------------------
   Single source of truth is js/products.js. This script reads it
   and (re)generates, so nothing can drift from the catalog:

     • index.html  <#grid>            → static product cards (crawlers + no-JS)
     • index.html  Product JSON-LD    → schema.org ItemList of every product
     • index.html  "Catalog updated"  → freshness date
     • sitemap.xml                    → URL list (homepage today; pages later)
     • llms.txt                       → plain-language brief for AI assistants

   All index.html edits happen strictly between <!-- GEN:NAME:START -->
   and <!-- GEN:NAME:END --> marker comments, so the script is idempotent
   and safe to run on every deploy.

   Run:  node tools/gen-seo.js   (from anywhere; paths are resolved to the
   solenix-website/ folder). Wired into .github/workflows/deploy-pages.yml
   so a push to main always deploys freshly-generated output.
   ============================================================ */

'use strict';
const fs = require('fs');
const path = require('path');

const SITE = path.resolve(__dirname, '..');            // solenix-website/
const ORIGIN = 'https://solenixsolutions.com';
const BRAND = 'Solenix Solutions';

/* ---- load the catalog from products.js without a module system ---- */
const productsSrc = fs.readFileSync(path.join(SITE, 'js', 'products.js'), 'utf8');
const { CATEGORIES, PRODUCTS } = new Function(
  productsSrc + '\n;return { CATEGORIES: CATEGORIES, PRODUCTS: PRODUCTS };'
)();

/* ---- build date (drives freshness signals) ---- */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const now = new Date();
const ISO_DATE = now.toISOString().slice(0, 10);
const MONTH_YEAR = MONTHS[now.getMonth()] + ' ' + now.getFullYear();

/* ---- helpers ---- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');
const waFor = (p) => 'https://wa.me/919417122679?text=' +
  encodeURIComponent("Hi Solenix Solutions, I'd like a quote for: " + p.name + ' (item ' + p.sku + ').');

/* Replace the text between <!-- GEN:NAME:START ... --> and <!-- GEN:NAME:END -->
   without depending on the start marker's description text. */
function splice(html, name, inner) {
  const startTok = '<!-- GEN:' + name + ':START';
  const si = html.indexOf(startTok);
  if (si < 0) throw new Error('Missing start marker in index.html: ' + name);
  const startEnd = html.indexOf('-->', si);
  if (startEnd < 0) throw new Error('Unterminated start marker: ' + name);
  const afterStart = startEnd + 3;
  const endTok = '<!-- GEN:' + name + ':END -->';
  const ei = html.indexOf(endTok, afterStart);
  if (ei < 0) throw new Error('Missing end marker in index.html: ' + name);
  return html.slice(0, afterStart) + inner + html.slice(ei);
}

/* ---- 1. static product cards (mirror of main.js cardHTML) ---- */
function cardHTML(p) {
  return `      <article class="card reveal">
        <div class="card-media">
          <img src="${p.image}" alt="${escAttr(p.alt || p.name)}" loading="lazy" width="720" height="540" />
        </div>
        <div class="card-body">
          <span class="card-cat">${esc(p.category)}</span>
          <h3>${esc(p.name)}</h3>
          <p class="card-desc">${esc(p.desc)}</p>
          <div class="card-foot">
            <span class="card-sku">SLX-${p.sku}</span>
            <a class="card-enquire" href="${waFor(p)}" target="_blank" rel="noopener">Get a quote
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6z"/></svg>
            </a>
          </div>
        </div>
      </article>`;
}
const cardsBlock = PRODUCTS.map(cardHTML).join('\n');

/* ---- 2. Product ItemList JSON-LD ---- */
const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: BRAND + ' — Product Catalog',
  numberOfItems: PRODUCTS.length,
  itemListElement: PRODUCTS.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: p.name,
      description: p.desc,
      sku: 'SLX-' + p.sku,
      category: p.category,
      image: ORIGIN + '/' + p.image,
      brand: { '@type': 'Brand', name: BRAND },
      manufacturer: { '@id': ORIGIN + '/#organization' }
    }
  }))
};
const productLd = '<script type="application/ld+json">\n' +
  JSON.stringify(itemList, null, 2) + '\n</script>';

/* ---- write index.html (three regions, one write) ---- */
const htmlPath = path.join(SITE, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const NL = html.includes('\r\n') ? '\r\n' : '\n';
const nl = (s) => (NL === '\n' ? s : s.replace(/\n/g, NL));

html = splice(html, 'GRID', NL + nl(cardsBlock) + NL + '    ');
html = splice(html, 'PRODUCTS-LD', NL + nl(productLd) + NL);
html = splice(html, 'UPDATED', 'Catalog updated ' + MONTH_YEAR);
fs.writeFileSync(htmlPath, html);

/* ---- 3. sitemap.xml ---- */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${ORIGIN}/</loc>
    <lastmod>${ISO_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
fs.writeFileSync(path.join(SITE, 'sitemap.xml'), sitemap);

/* ---- 4. llms.txt (plain-language brief for AI assistants) ---- */
const byCat = CATEGORIES.map((cat) => {
  const items = PRODUCTS.filter((p) => p.category === cat)
    .map((p) => `- ${p.name} — ${p.desc}`).join('\n');
  return `### ${cat}\n${items}`;
}).join('\n\n');

const llms = `# ${BRAND}

> ${BRAND} is a manufacturer of solar mounting systems and accessories based in Jalandhar, Punjab, India, supplying EPC companies, distributors and solar professionals across India.

Tagline: Power That Holds.

## Contact
- Website: ${ORIGIN}/
- Phone / WhatsApp: +91 94171 22679
- Email: solenixsolutions@gmail.com
- Address: Adjoining Kosmo Tata showroom, Kapurthala Road, Jalandhar, Punjab, India
- Instagram: https://www.instagram.com/solenixsolutions

## About
${BRAND} manufactures and supplies solar mounting hardware — clamps, base plates and brackets, fasteners, rails and structures, plus solar electrical and earthing components. Products serve rooftop and ground-mount solar projects and are trusted by installers and EPC contractors. Bulk manufacturing, fast delivery, PAN-India dispatch. Every enquiry and quote is handled over WhatsApp, phone or email above.

## Product range (${PRODUCTS.length} products across ${CATEGORIES.length} categories)

${byCat}

## Notes
- Catalog last updated: ${MONTH_YEAR}.
- No online checkout: all pricing and orders are quoted directly via WhatsApp / phone / email.
- Preferred entity name everywhere: "${BRAND}".
`;
fs.writeFileSync(path.join(SITE, 'llms.txt'), llms);

/* ---- summary ---- */
console.log('gen-seo: ' + PRODUCTS.length + ' products, ' + CATEGORIES.length + ' categories');
console.log('  index.html   grid cards + Product ItemList JSON-LD + "Catalog updated ' + MONTH_YEAR + '"');
console.log('  sitemap.xml  lastmod ' + ISO_DATE);
console.log('  llms.txt     ' + PRODUCTS.length + ' products listed');
