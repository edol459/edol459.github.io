# How to use & maintain this portfolio

## File structure (only 4 files matter)

```
index.html        ← page shell + all CSS
data.jsx          ← YOUR CONTENT — edit this to add/remove files & folders
app.jsx           ← the app logic (don't usually need to touch)
icons.jsx         ← file-type icons (touch only if adding a new file type)
tweaks-panel.jsx  ← tweaks UI (don't touch)
assets/           ← drop PDFs, images, etc here
```

**99% of your edits will be in `data.jsx`.**

---

## Adding a new file or folder

Open `data.jsx`. The whole site is one big array called `TREE`. Each entry is one item in the file tree.

### A new top-level folder

Add an object to the top-level `TREE` array:

```js
{
  id: "writing",                 // must be unique, used internally
  name: "writing",               // display name in the tree
  type: "folder",
  description: "Short posts on basketball analytics.",
  children: [
    // ...files inside
  ],
}
```

### A markdown post (writing, notes, longer bios)

```js
{
  id: "post-shot-quality",
  name: "shot-quality.md",
  type: "markdown",
  tagline: "Why shot quality lies.",
  content: `# Why shot quality lies

Paragraph one...

## A heading

- A bullet
- **Bold** and \`code\` work too.`,
}
```

Markdown supports: `#` and `##` headings, `- ` bullets, `**bold**`, `` `code` ``, and paragraphs.

### A link to a live site / app / tool

```js
{
  id: "my-new-project",
  name: "myproject.net",
  type: "site",                  // or "app" (App Store) or "tool" (sub-tool)
  href: "https://myproject.net",
  tagline: "One-line pitch.",
  description: "A longer paragraph about what it does, why it exists, and what's interesting.",
  stack: ["Python", "Next.js"],  // optional — shows as chips
}
```

### A PDF (resume, paper, report)

1. Drop the file in `assets/`, e.g. `assets/my-paper.pdf`
2. Add to the tree:

```js
{
  id: "my-paper",
  name: "my-paper.pdf",
  type: "pdf",
  href: "assets/my-paper.pdf",
  download: "EthanDolder-MyPaper.pdf",
  tagline: "Brief description.",
  description: "Longer explanation shown above the inline preview.",
}
```

The PDF will render inline with a Download button.

### A Word doc / Google Doc

```js
{
  id: "my-essay",
  name: "essay.docx",
  type: "doc",
  href: "https://docs.google.com/document/d/XXXXX/edit",
  tagline: "...",
  description: "...",
}
```

For Google Docs, paste the share link — it'll render inline as a preview.
For .docx, drop in `assets/` and link to it. (Word files can't preview inline, but the "Open document" button works.)

### A video (YouTube / Vimeo)

```js
{
  id: "my-video",
  name: "video.mp4",
  type: "video",
  href: "https://youtu.be/SHORTCODE",       // canonical share link
  embed: "https://www.youtube.com/embed/SHORTCODE",  // embed URL
  tagline: "...",
  description: "...",
}
```

### Nesting folders deeper

Just put `children: [...]` on any folder. It nests as far as you want.

---

## Removing something

Delete its object from `data.jsx`. That's it.

---

## Updating contact info, name, or tagline

Open `app.jsx`. Search for `TopHeader` (around line 220). Edit the email / linkedin / github / x links there, and the `<h1>` and `<p className="sub">` for your name and tagline.

---

## Running it locally to preview changes

Because the JSX files load via Babel, you need to serve the folder over HTTP — opening `index.html` directly won't work.

**Easiest options:**

```bash
# Python 3 (built-in on Mac/Linux)
cd /path/to/portfolio
python3 -m http.server 8000
# then open http://localhost:8000
```

```bash
# Or with Node
npx serve .
```

```bash
# Or with VSCode: install the "Live Server" extension, right-click index.html → "Open with Live Server"
```

---

## Deploying it for real

This is a fully static site — drop it anywhere that hosts files.

### Easiest (free): Netlify or Vercel

1. Push the folder to a GitHub repo (or just drag-and-drop the folder)
2. Connect the repo at [netlify.com](https://netlify.com) or [vercel.com](https://vercel.com)
3. They give you a URL like `ethandolder.netlify.app` — done. Custom domain takes 5 minutes more.

### Cloudflare Pages

Same flow as above, also free, often fastest globally.

### GitHub Pages

Push to a repo, enable Pages from the repo settings. Free, no signup. Your URL will be `edol459.github.io/portfolio` or similar.

**Recommendation:** Netlify or Cloudflare Pages. Both are free, both let you connect a custom domain like `ethandolder.com`.

---

## Buying a domain (optional but worth it)

`ethandolder.com` or `ethandolder.dev` look way more professional than `netlify.app`. Buy from:
- Namecheap (~$10/yr, easy)
- Cloudflare (at-cost pricing, slightly more setup)

Then point it at your Netlify/Vercel site — both have one-click custom domain wizards.

---

## Production note: switch from dev-mode React

Right now `index.html` loads `react.development.js` (verbose, with warnings). For your live site, swap to production builds — about 3x smaller and faster:

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin></script>
```

Also: in-browser Babel works fine but adds ~200KB and slows first paint. If you want max polish, you can pre-compile the `.jsx` files once with a one-liner — ask me when you're ready to deploy and I'll set it up.

---

## Adding new file *types* (advanced)

If you want a new file type (say, an "audio" type for podcast appearances), you'd need to:

1. Add an icon in `icons.jsx` (copy an existing one as a template)
2. Add the type to the `iconFor` switch at the bottom of `icons.jsx`
3. Add a handler in `PreviewBody` in `app.jsx`

Or just ask me to add it.
