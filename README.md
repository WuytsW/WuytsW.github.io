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
├── index.html       — the page itself (single-page CV)
├── css/
│   └── style.css     — all styling: colors, type scale, layout, responsive rules
├── README.md         — this file
└── .gitignore
```

## Customize

1. **Replace the placeholder content.** Every section in `index.html` that needs your real
   details is marked with an `<!-- TODO: ... -->` comment just above it — name, tagline,
   contact info, about summary, experience entries, education, and skills.
2. **Retheme.** Colors, fonts, spacing, and the content width are all defined as CSS custom
   properties at the top of `css/style.css` (inside `:root`). Change values there rather than
   hunting through individual rules.
3. **Add a photo (optional).** Create an `assets/` folder, drop your image in (e.g.
   `assets/photo.jpg`), then add near the top of the `<header>` in `index.html`:
   ```html
   <img src="assets/photo.jpg" alt="Portrait of Your Name" width="120" height="120">
   ```
   Use a descriptive `alt` value (e.g. "Portrait of Jane Doe"), not "photo" or an empty string.

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

## Ideas for later (not included yet)

- Favicon
- Light/dark mode toggle
- Print/PDF-friendly stylesheet
- Social links (GitHub, LinkedIn, etc.)
- A real photo in `assets/`
