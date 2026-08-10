# Web CV

Personal CV / résumé site — plain HTML/CSS, no build step, no dependencies.

## Preview locally

Easiest option: just open `index.html` directly in your browser.

If you'd rather serve it over `http://localhost` (closer to how GitHub Pages serves it):

```bash
python -m http.server 8000
```

then visit `http://localhost:8000/`. Any editor live-reload extension (e.g. VS Code's "Live Server") works too.

## Project structure

```
├── index.html         — the CV page
├── projects.html      — the projects page
├── css/
│   └── style.css      — design tokens (incl. dark mode), layout, components
├── js/
│   └── main.js         — progressive enhancement: theme toggle, scroll-reveal,
│                          scrollspy, back-to-top (page works fully without it)
├── assets/
│   ├── photo.jpg       — portrait used in the header
│   └── favicon.svg     — browser tab icon
├── README.md           — this file
└── .gitignore
```

## Customize

1. **Replace the placeholder content.** Every section in `index.html` that needs your real
   details is marked with an `<!-- TODO: ... -->` comment just above it — name, tagline,
   contact info, about summary, experience entries, education, and skills.
2. **Retheme.** Colors, fonts, spacing, and the content width are all defined as CSS custom
   properties at the top of `css/style.css` (inside `:root`). Change values there rather than
   hunting through individual rules.
3. **Swap the photo.** Replace `assets/photo.jpg` with your own image (same filename, or
   update the `<img>` `src` inside `.avatar-wrap` in `index.html`). Keep the `alt` text
   descriptive (e.g. "Portrait of Jane Doe"), not "photo" or empty.
4. **Update the social links.** GitHub/LinkedIn URLs appear in a few places — the nav bar
   and footer of both pages — search for `github.com` / `linkedin.com` to find them all.

## Deploy (GitHub Pages)

This repo is a GitHub Pages **user site** (`<username>.github.io`), which publishes from the
**`main`** branch (root) — not `gh-pages`; that convention is for *project* pages, not user sites.

To go live:

1. Make sure you're on (or create) the `main` branch, then commit and push:
   ```bash
   git checkout -b main   # only if main doesn't exist yet
   git add -A
   git commit -m "Initial commit: CV site scaffold"
   git push -u origin main
   ```
2. On github.com, go to **Settings → Pages** and confirm **Source** is set to
   "Deploy from a branch", **Branch** = `main`, folder = `/ (root)`.
3. Wait a minute or two, then check `https://wuytsw.github.io/`.

## Already included

- Favicon, light/dark mode toggle (persisted, respects OS preference), a
  print/PDF-friendly stylesheet, GitHub/LinkedIn links, and a real photo.

## Ideas for later (not included yet)

- Resume/CV as a downloadable PDF
- Analytics (e.g. a privacy-friendly option like Plausible)
