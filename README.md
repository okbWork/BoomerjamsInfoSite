# Boomerjams Info Site

A static portfolio website for **Boomerjams** that showcases upcoming apps and provides clear legal/info pages and contact options.

## What this site includes

- `index.html` — home page with overview + contact form.
- `apps.html` — app showcase for **Festiv** and **Pairus**.
- `descriptions.html` — plain-language app descriptions.
- `privacy-policy.html` — portfolio/app privacy policy.
- `styles.css` — all styling.
- `script.js` — small helper script (auto-updates footer year).

---

## Prerequisites

You only need one of these to run locally:

- **Python 3** (recommended), or
- **Node.js** (alternative)

You can check installed versions:

```bash
python3 --version
node --version
```

---

## Run locally (development preview)

Because this is a static site, you should open it through a small local web server (instead of double-clicking HTML files).

### Option A (recommended): Python HTTP server

From the project root:

```bash
python3 -m http.server 4173
```

Then open:

- `http://localhost:4173/index.html`

Stop server with `Ctrl + C`.

### Option B: Node.js serve package

From the project root:

```bash
npx serve .
```

The command prints the local URL (usually something like `http://localhost:3000`).

---

## Manual testing checklist

Use this checklist before publishing.

### 1) Navigation and page reachability

- Open homepage (`index.html`).
- In the header, verify links work:
  - **Descriptions**
  - **Privacy Policy**
  - **Apps**
  - **Contact**
- Confirm each page loads with expected content.

### 2) App showcase content

On `apps.html`:

- Verify **Festiv** section exists.
- Verify repo link points to:
  - `https://github.com/LocalPartyAppTeam/LocalPartyApp`
- Verify **Pairus** section exists and is marked unpublished/in progress.

### 3) Contact form behavior

On `index.html`:

- Fill Name, Email, Message.
- Click **Send Email**.
- Confirm your default mail app opens a draft addressed to:
  - `kobbowork@gmail.com`

> Note: this is a `mailto:` form. It depends on the visitor having a local email client configured.

### 4) Privacy + descriptions visibility

- Confirm both **Descriptions** and **Privacy Policy** are visible in the header on all pages.

### 5) Responsive behavior

- Resize browser to mobile width (e.g., 375px wide).
- Confirm nav, cards, and form remain readable and usable.

---

## Quick sanity commands

From project root:

```bash
# Show current files
rg --files

# Search for critical content strings
rg -n "kobbowork@gmail.com|Privacy Policy|Descriptions|LocalPartyAppTeam/LocalPartyApp|contact"
```

---

## Hosting options (static site)

This project requires no backend runtime. Any static hosting service works.

## Option 1: GitHub Pages (easy if repo is on GitHub)

1. Push this project to a GitHub repository.
2. In GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: `main` (or your default), folder `/ (root)`
4. Save and wait for deployment.
5. GitHub provides a URL like:
   - `https://<username>.github.io/<repo>/`

If the site does not open at root, append `/index.html`.

## Option 2: Netlify (drag-and-drop)

1. Go to Netlify and create a new site.
2. Drag this folder (or zip) into Netlify deploy UI.
3. Netlify publishes a URL instantly.
4. Optional: connect your Git repo for automatic redeploy on push.

## Option 3: Vercel

1. Import the Git repository in Vercel.
2. Framework preset: **Other** or static.
3. Build command: leave empty.
4. Output directory: `.` (project root).
5. Deploy.

---

## Recommended post-deploy checks

After deployment, verify:

- Every top-nav link works from each page.
- Festiv GitHub link opens correctly.
- Privacy policy is publicly reachable.
- Contact button/form still opens an email draft.
- Mobile layout remains usable.

---

## Future improvements (optional)

If you want more robust contact handling than `mailto:`:

- Add a backend form endpoint (e.g., serverless function).
- Or use a form provider (Formspree, Basin, etc.).
- Add success/error message UX on submit.

This avoids reliance on a local email client and works better on many mobile/desktop setups.
