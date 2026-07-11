# Solenix Solutions — Website

A fast, zero-cost static website for the Solenix Solutions product range.
No frameworks, no build step, no server — free to host on GitHub Pages.

## Files

```
index.html            The whole site (one page)
css/style.css         Design and layout
js/products.js        ★ THE PRODUCT CATALOG — edit this to add products
js/main.js            Search, filters, enquiry form (no need to touch)
images/products/      One photo per product (01.jpg … 23.jpg)
images/               Factory, process photos, logo
```

## How to add a new product

1. Add the product photo to `images/products/` (square-ish, white
   background works best — e.g. `24.jpg`).
2. Open `js/products.js` and add a block at the end of the `PRODUCTS` list:

```js
{
  sku: "24",
  name: "New Product Name",
  tagline: "Short one-line benefit",
  category: "Clamps",                // must match a name in CATEGORIES
  image: "images/products/24.jpg",
  tags: ["optional", "search", "keywords"],
},
```

3. Save, commit, push. The product appears in the grid, search, and
   category filters automatically — the footer product links update too.

To add a whole new category, add its name to the `CATEGORIES` list at the
top of the same file.

## Hosting on GitHub Pages (free)

1. Create a GitHub account (if you don't have one) and a new **public**
   repository, e.g. `solenix-website`.
2. Upload all the files in this folder to the repository (drag-and-drop
   on github.com works, or use `git push`).
3. In the repository: **Settings → Pages → Source: Deploy from a branch**,
   pick `main` branch and `/ (root)` folder, then Save.
4. In a minute or two your site is live at
   `https://<your-username>.github.io/solenix-website/`

### Custom domain (optional, ~₹800–1,000/year)

Buy `solenixsolutions.in` (or similar) from any registrar. Then:
1. GitHub: **Settings → Pages → Custom domain** → enter your domain.
2. At the registrar, point a `CNAME` record for `www` to
   `<your-username>.github.io` and add GitHub Pages' `A` records for the
   apex domain (listed in GitHub's Pages documentation).
3. Tick "Enforce HTTPS".

## Updating content

- **Phone / email / locations:** search for them in `index.html` and edit.
- **About Us text & Why Choose Us cards:** the `#about` section.
- **Contact blocks, form, and map:** the `#contact` section. The enquiry
  form opens WhatsApp with the visitor's message pre-filled — no backend
  needed. To use a real email form later, services like Formspree or
  Web3Forms have free tiers that work on GitHub Pages.
