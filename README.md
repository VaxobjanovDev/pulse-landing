# Pulse landing

The website for the Pulse app: the landing page, help & support, and the privacy policy. It is a static site with no build step, published with GitHub Pages from the root of `main`.

## Files

| File | What it is |
|---|---|
| `index.html` | The landing page, with its own styles. The phone in the hero is drawn in HTML. |
| `home.js` | The phone screens (Home, Goals, Insights, Debts, Wallet), the tab tour, the bubbles and the other landing effects. |
| `home-i18n.js` | Landing texts in 10 languages (`window.PAGE_T`). |
| `app-strings.js` | The app's own strings. It is generated, so don't edit it by hand. |
| `site.js`, `site.css` | Shared by all pages: language picker, theme, store buttons and app colours. |
| `support.html`, `privacy.html` | Help and privacy pages. `privacy-policy.html` redirects to `privacy.html`. |
| `404.html`, `robots.txt`, `sitemap.xml` | For GitHub Pages and search engines. |

## Updating

- **App strings:** after changing the app's translations, run `node scripts/gen-site-strings.js` in the app repo (`../mobile`). It writes `app-strings.js` here.
- **Store links:** set them in `site.js` (`STORES`). Fill in `ios` before publishing; until then the App Store badge has no link.
- **Site address:** the full URL `https://vaxobjanovdev.github.io/pulse-landing/` appears in several files: the `<head>` of the three pages, `404.html`, `robots.txt` and `sitemap.xml`. If the address changes, replace it everywhere.
- **Preview locally:** `npx http-server -c-1 .`, then open the address it prints.
