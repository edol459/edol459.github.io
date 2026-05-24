# Deploying your portfolio — step by step

This folder is ready to deploy. Pick one of the options below.

---

## ⭐ Recommended: Netlify drag-and-drop (5 minutes)

The fastest way to get live. No GitHub needed.

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)** (sign up free if needed)
2. **Drag this entire `_deploy` folder** onto the page
3. Netlify gives you a URL like `eloquent-curie-abc123.netlify.app`. Done — your site is live.
4. To rename it: site settings → "Change site name" → pick something like `ethandolder`
5. To use your own domain (e.g. `ethandolder.com`): site settings → "Domain management" → "Add custom domain". Netlify walks you through pointing DNS.

**To update later**: drag the folder again onto the same site (there's a "Deploys" tab where you can drop new versions).

---

## Alternative: Vercel CLI (one command)

If you're already comfortable with the terminal:

```bash
npm i -g vercel
cd _deploy
vercel
```

Follow the prompts. Done.

---

## Alternative: GitHub Pages (free, lives at github.io)

1. Create a new public repo on GitHub, e.g. `portfolio`
2. Push the contents of this `_deploy` folder to it:
   ```bash
   cd _deploy
   git init
   git add .
   git commit -m "first deploy"
   git remote add origin https://github.com/edol459/portfolio.git
   git branch -M main
   git push -u origin main
   ```
3. In the repo on GitHub → Settings → Pages → Source: "Deploy from branch", Branch: `main`, Folder: `/ (root)` → Save
4. Wait ~1 minute. Your site is at `https://edol459.github.io/portfolio/`

---

## Buying a custom domain (optional, ~$10/yr)

A custom domain makes a big difference for a portfolio. Recommended:

- **Namecheap** (easy UI, ~$10/yr for `.com`)
- **Cloudflare Registrar** (at-cost pricing, no markup, slightly more setup)
- **Porkbun** (great prices, clean UI)

Good options: `ethandolder.com`, `ethandolder.dev`, `dolder.basketball`

Once bought, your host (Netlify / Vercel / Cloudflare Pages) has a one-click "Add custom domain" flow that walks you through pointing DNS.

---

## After you deploy: checklist

- [ ] Open the live URL on your phone — verify it looks right
- [ ] Test the resume download
- [ ] Test the capstone video plays
- [ ] Click every external link (theoutlier, ydkball, app, etc) — confirm they open
- [ ] Paste the URL into iMessage / LinkedIn — confirm the OG image preview looks good
- [ ] Add the URL to your LinkedIn profile, resume, email signature

---

## Making it even faster (optional, advanced)

The current setup uses in-browser Babel to compile the JSX files (about 200KB of extra JS). For most visitors on broadband this is fine. To remove it:

```bash
# In the _deploy folder:
npm init -y
npm i -D @babel/cli @babel/preset-react @babel/preset-env
npx babel data.jsx -o data.js --presets=@babel/preset-react,@babel/preset-env
npx babel icons.jsx -o icons.js --presets=@babel/preset-react,@babel/preset-env
npx babel app.jsx -o app.js --presets=@babel/preset-react,@babel/preset-env
npx babel tweaks-panel.jsx -o tweaks-panel.js --presets=@babel/preset-react,@babel/preset-env
```

Then in `index.html`, swap the `<script type="text/babel" src="...jsx">` tags for plain `<script src="...js">` (no `type="text/babel"`), and remove the Babel script tag. Page will be ~200KB lighter and load instantly.

Ask me if you want me to do this with you when you're ready.

---

## Updating content after deploy

Just edit `data.jsx` (and any files in `assets/`), then re-deploy:

- **Netlify**: drag the folder onto your site's Deploys tab
- **Vercel**: `vercel --prod` in the folder
- **GitHub Pages**: `git push` and Pages rebuilds automatically
