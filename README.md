# Technical Documentation Portfolio

A static portfolio built with Astro. It includes a landing page, docs-as-code explanation, interactive ZIP-code weather demo, HTML/CSS sample, jQuery sample, writing sample, and a resume placeholder.

## Requirements

- Git
- Node.js 22 or newer
- A GitHub account

## Run locally

```sh
npm install
npm run dev
```

Open the local URL Astro prints in the terminal. Before publishing, test a production build:

```sh
npm run build
npm run preview
```

## Configure GitHub Pages

### 1. Choose the repository name and URL

For a project repository named `technical-portfolio`, the public URL will be:

`https://YOUR-USERNAME.github.io/technical-portfolio/`

For this project-site URL, edit `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://YOUR-USERNAME.github.io',
  base: '/technical-portfolio',
});
```

Replace `YOUR-USERNAME` with your exact GitHub username. The `base` value must match the repository name, including capitalization. Astro needs this because GitHub Pages project sites are hosted beneath the repository path.

If you instead name the repository `YOUR-USERNAME.github.io`, the site is served from the domain root. In that case, use `base: '/'` (or omit `base`).

### 2. Prepare the project

Replace these placeholders in `src/pages/index.astro`:

- `YOUR-EMAIL@example.com`
- `YOUR-PROFILE`
- `YOUR-USERNAME`

Add your resume PDF at `public/resume.pdf`. Replace the sample writing with your own sanitized and approved work. Do not publish proprietary, export-controlled, customer-confidential, or otherwise restricted content. Clearly label personal demos and starter examples.

### 3. Create the GitHub repository and push

Create a **public** repository named `technical-portfolio` on GitHub. Do not initialize it with a README, license, or `.gitignore` because this project already includes files. From a terminal, change into the extracted `technical-portfolio` folder and run:

```sh
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/technical-portfolio.git
git push -u origin main
```

Replace `YOUR-USERNAME` in the remote URL with your GitHub username. If you chose a different repository name, update both the remote URL and Astro's `base` value accordingly.

### 4. Enable GitHub Actions deployment

On GitHub, open the repository and select **Settings → Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**. The included workflow is `.github/workflows/deploy.yml`.

The workflow runs on every push to `main`, builds the Astro site, uploads the `dist` directory as a Pages artifact, and deploys it. It can also be started manually from **Actions → Build and deploy portfolio → Run workflow**. GitHub creates the `github-pages` environment as needed.

### 5. Verify deployment

Open the **Actions** tab and wait for the workflow to complete successfully. The deployed site URL is shown in the `github-pages` deployment environment and under **Settings → Pages**. For a project repository, it should look like `https://YOUR-USERNAME.github.io/technical-portfolio/`.

Make a small change, commit it, and push it to `main` to confirm that a new deployment runs automatically.

## Workflow behavior

- Trigger: every push to `main` and manual runs.
- Build failure: deployment does not run if `npm run build` fails.
- Concurrency: a newer deployment run cancels an older run in the same group.
- Hosting: static output only; no persistent server is required.

This starter's workflow uses `npm install` and intentionally does not configure npm caching, because the starter archive does not include a generated `package-lock.json`. For reproducible dependency installs, run `npm install` locally, commit the resulting `package-lock.json`, then switch the workflow's install command to `npm ci` and enable npm caching with `cache: npm`.

## Weather demo notes

The demo uses Zippopotam.us to resolve US ZIP codes and Open-Meteo for current weather data. These endpoints do not require a key for this demo. ZIP codes can map to multiple place names; this starter uses the first returned place. The browser makes requests directly to the APIs. If you later use an API requiring a secret key, do not put that key in client-side code.

## Suggested case-study format

For each portfolio item, document:

- **Problem:** What user, business, or engineering need existed?
- **Your role:** What did you personally own?
- **Constraints:** Audience, technical complexity, compliance, schedule, tools.
- **Approach:** Research, information architecture, writing, code, review, and release.
- **Outcome:** Measurable impact where available; otherwise describe the verified improvement without inventing metrics.
- **Artifacts:** Public sample, screenshots, sanitized excerpt, or source code.
