// Main portfolio app — split-pane file manager view.

const { useState, useEffect, useMemo, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1c7fc7",
  "dark": false,
  "density": "cozy"
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = ["#1c7fc7", "#0a2540", "#e85d2f", "#1f8a5b"];

// ---------- tree helpers ----------
function flatten(nodes, depth = 0) {
  const out = [];
  for (const n of nodes) {
    out.push({ ...n, depth });
    if (n.children) out.push(...flatten(n.children, depth + 1));
  }
  return out;
}

function findNode(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const f = findNode(n.children, id);
      if (f) return f;
    }
  }
  return null;
}

function pathTo(nodes, id, acc = []) {
  for (const n of nodes) {
    const next = [...acc, n];
    if (n.id === id) return next;
    if (n.children) {
      const p = pathTo(n.children, id, next);
      if (p) return p;
    }
  }
  return null;
}

function nameMatch(n, q) {
  if (!q) return true;
  const hay = `${n.name} ${n.tagline || ""} ${n.description || ""}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

function subtreeMatches(node, q) {
  if (!q) return true;
  if (nameMatch(node, q)) return true;
  if (node.children) return node.children.some(c => subtreeMatches(c, q));
  return false;
}

// ---------- markdown helper ----------
function MarkdownView({ text }) {
  const lines = text.split("\n");
  const out = [];
  let listBuf = [];
  const flushList = () => {
    if (listBuf.length) {
      out.push(<ul key={`ul-${out.length}`}>{listBuf.map((l, i) => <li key={i} dangerouslySetInnerHTML={{ __html: inline(l) }} />)}</ul>);
      listBuf = [];
    }
  };
  const inline = s => s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  for (const ln of lines) {
    if (ln.startsWith("# ")) { flushList(); out.push(<h1 key={out.length}>{ln.slice(2)}</h1>); }
    else if (ln.startsWith("## ")) { flushList(); out.push(<h2 key={out.length}>{ln.slice(3)}</h2>); }
    else if (ln.startsWith("- ")) { listBuf.push(ln.slice(2)); }
    else if (ln.trim() === "") { flushList(); }
    else { flushList(); out.push(<p key={out.length} dangerouslySetInnerHTML={{ __html: inline(ln) }} />); }
  }
  flushList();
  return <div className="md">{out}</div>;
}

// ---------- preview body ----------
function PreviewBody({ node }) {
  if (node.type === "markdown") return <MarkdownView text={node.content} />;
  if (node.type === "text") return <pre className="plain">{node.content}</pre>;

  if (node.type === "folder" || node.type === "folder-feature") {
    const kids = node.children || [];
    return (
      <React.Fragment>
        {node.description && <p className="desc">{node.description}</p>}
        <div className="folder-grid">
          {kids.length === 0 && <p className="muted">Empty folder.</p>}
          {kids.map(c => (
            <div className="grid-item" key={c.id}>
              <div className="grid-icon">{iconFor(c, 40)}</div>
              <div className="grid-name">{c.name}</div>
              {c.tagline && <div className="grid-sub">{c.tagline}</div>}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }

  if (node.type === "site" || node.type === "app" || node.type === "tool") {
    return (
      <div className="project">
        <p className="desc">{node.description}</p>
        {node.stack && (
          <div className="stack">
            {node.stack.map(s => <span className="chip" key={s}>{s}</span>)}
          </div>
        )}
        <div className="actions">
          <a className="btn primary" href={node.href} target="_blank" rel="noopener">
            Open {node.type === "app" ? "App Store" : "site"} <ArrowOut size={11} />
          </a>
          <button className="btn ghost" onClick={() => navigator.clipboard?.writeText(node.href)}>Copy link</button>
        </div>
      </div>
    );
  }

  if (node.type === "pdf") {
    const isReal = node.href && node.href !== "#";
    return (
      <div className="doc-preview">
        {node.description && <p className="desc" style={{marginTop:0}}>{node.description}</p>}
        {isReal ? (
          <iframe src={node.href} title={node.name} className="doc-frame" />
        ) : (
          <div className="placeholder">
            <div className="placeholder-stripes" />
            <div className="placeholder-label">pdf preview · drop file in /assets and set href</div>
          </div>
        )}
        <div className="actions">
          <a className="btn primary" href={node.href} download={node.download} target="_blank" rel="noopener">Download PDF</a>
          {isReal && <a className="btn ghost" href={node.href} target="_blank" rel="noopener">Open full <ArrowOut size={11} /></a>}
        </div>
      </div>
    );
  }

  if (node.type === "doc") {
    const isGoogle = node.href && node.href.includes("docs.google");
    return (
      <div className="doc-preview">
        {node.description && <p className="desc">{node.description}</p>}
        {isGoogle ? (
          <iframe src={node.href.replace("/edit", "/preview")} title={node.name} className="doc-frame" />
        ) : (
          <div className="placeholder">
            <div className="placeholder-stripes" />
            <div className="placeholder-label">document preview · paste a google doc link or .docx in data.jsx</div>
          </div>
        )}
        <div className="actions">
          <a className="btn primary" href={node.href} target="_blank" rel="noopener">Open document <ArrowOut size={11} /></a>
        </div>
      </div>
    );
  }

  if (node.type === "video") {
    return (
      <div className="doc-preview">
        {node.description && <p className="desc">{node.description}</p>}
        {node.embed ? (
          <div className="video-wrap"><iframe src={node.embed} title={node.name} allow="autoplay; encrypted-media" allowFullScreen /></div>
        ) : (
          <div className="placeholder video">
            <div className="placeholder-stripes" />
            <div className="placeholder-label">video preview · paste youtube/vimeo embed URL</div>
          </div>
        )}
        {node.href && <div className="actions">
          <a className="btn ghost" href={node.href} target="_blank" rel="noopener">Watch on YouTube <ArrowOut size={11} /></a>
        </div>}
      </div>
    );
  }

  return <p className="muted">No preview.</p>;
}

// ---------- tree row ----------
function TreeRow({ node, depth = 0, expanded, onToggle, onSelect, selected, query, density }) {
  const isFolder = node.type === "folder" || node.type === "folder-feature";
  const isOpen = expanded.has(node.id);
  const isSelected = selected === node.id;
  const indent = depth * 16;

  const visibleChildren = useMemo(() => {
    if (!node.children) return [];
    if (!query) return node.children;
    return node.children.filter(c => subtreeMatches(c, query));
  }, [node.children, query]);

  const padY = density === "compact" ? 4 : 7;

  return (
    <React.Fragment>
      <div
        className="row"
        data-selected={isSelected}
        onClick={() => {
          if (isFolder) onToggle(node.id);
          onSelect(node.id);
        }}
        style={{ paddingLeft: 10 + indent, paddingTop: padY, paddingBottom: padY }}
      >
        <span className="chev" style={{ visibility: isFolder ? "visible" : "hidden" }}>
          <ChevronRight open={isOpen || (!!query && visibleChildren.length > 0)} />
        </span>
        <span className="icon">{iconFor(node, 16)}</span>
        <span className="name">{node.name}</span>
        {(node.type === "site" || node.type === "app" || node.type === "tool") &&
          <span className="ext-link"><ArrowOut /></span>}
      </div>
      {isFolder && (isOpen || !!query) && visibleChildren.map(child => (
        <TreeRow key={child.id} node={child} depth={depth + 1}
          expanded={expanded} onToggle={onToggle} onSelect={onSelect}
          selected={selected} query={query} density={density} />
      ))}
    </React.Fragment>
  );
}

// ---------- header ----------
function TopHeader() {
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <div className="name-block">
          <h1>Ethan Dolder</h1>
          <p className="sub">Computer Science Graduate · Data Science · Basketball Analytics</p>
        </div>
        <nav className="contact">
          <a href="mailto:edolder@purdue.edu" className="c-link">
            <span className="c-label">email</span>
            <span className="c-value">edolder@purdue.edu</span>
          </a>
          <a href="https://www.linkedin.com/in/ethandolder/" target="_blank" rel="noopener" className="c-link">
            <span className="c-label">linkedin</span>
            <span className="c-value">/in/ethandolder</span>
          </a>
          <a href="https://github.com/edol459" target="_blank" rel="noopener" className="c-link">
            <span className="c-label">github</span>
            <span className="c-value">@edol459</span>
          </a>
          <a href="https://x.com/bigpacersguy" target="_blank" rel="noopener" className="c-link">
            <span className="c-label">x / twitter</span>
            <span className="c-value">@bigpacersguy</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

// ---------- main app ----------
function App() {
  const [tweaks, setTweaks] = useTweaks(TWEAK_DEFAULTS);
  const [expanded, setExpanded] = useState(new Set(["basketball", "ydkball"]));
  const [selectedId, setSelectedId] = useState("readme");
  const [query, setQuery] = useState("");

  const tree = window.PORTFOLIO_TREE;
  const selected = useMemo(() => findNode(tree, selectedId), [tree, selectedId]);
  const path = useMemo(() => pathTo(tree, selectedId) || [], [tree, selectedId]);
  const flat = useMemo(() => flatten(tree), [tree]);

  const counts = useMemo(() => {
    let folders = 0, files = 0;
    for (const n of flat) {
      if (n.type === "folder" || n.type === "folder-feature") folders++;
      else files++;
    }
    return { folders, files };
  }, [flat]);

  const toggle = useCallback(id => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", tweaks.accent);
    root.dataset.theme = tweaks.dark ? "dark" : "light";
  }, [tweaks.accent, tweaks.dark]);

  // keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const visible = flat.filter(n => {
          const p = pathTo(tree, n.id);
          if (!p) return false;
          for (let i = 0; i < p.length - 1; i++) {
            if (!expanded.has(p[i].id)) return false;
          }
          return true;
        });
        const idx = visible.findIndex(n => n.id === selectedId);
        const next = e.key === "ArrowDown"
          ? Math.min(visible.length - 1, idx + 1)
          : Math.max(0, idx - 1);
        if (visible[next]) setSelectedId(visible[next].id);
      }
      if (e.key === "ArrowRight" && selected && (selected.type === "folder" || selected.type === "folder-feature")) {
        setExpanded(prev => new Set(prev).add(selectedId));
      }
      if (e.key === "ArrowLeft" && selected) {
        if (expanded.has(selectedId)) {
          setExpanded(prev => { const n = new Set(prev); n.delete(selectedId); return n; });
        } else {
          const p = pathTo(tree, selectedId);
          if (p && p.length > 1) setSelectedId(p[p.length - 2].id);
        }
      }
      if (e.key === "Enter" && selected && selected.href && (selected.type === "site" || selected.type === "app" || selected.type === "tool")) {
        window.open(selected.href, "_blank");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flat, selectedId, selected, expanded, tree]);

  const visibleTree = useMemo(() => {
    if (!query) return tree;
    return tree.filter(n => subtreeMatches(n, query));
  }, [tree, query]);

  return (
    <div className="app" data-density={tweaks.density}>
      <TopHeader />

      <main className="window">
        <div className="window-bar">
          <div className="path-display">
            <span className="path-segment dim">~/ethan-dolder</span>
            {path.map((p, i) => (
              <React.Fragment key={i}>
                <span className="sep">›</span>
                <span className={i === path.length - 1 ? "path-segment active" : "path-segment dim"}>{p.name}</span>
              </React.Fragment>
            ))}
          </div>
          <div className="search-box">
            <Search />
            <input type="text" placeholder="filter…" value={query} onChange={e => setQuery(e.target.value)} />
            {query && <button className="clear" onClick={() => setQuery("")}>×</button>}
          </div>
        </div>

        <div className="window-body">
          <aside className="tree">
            {visibleTree.map(n => (
              <TreeRow key={n.id} node={n} depth={0}
                expanded={expanded} onToggle={toggle} onSelect={setSelectedId}
                selected={selectedId} query={query} density={tweaks.density} />
            ))}
            {visibleTree.length === 0 && <p className="muted small" style={{ padding: 16 }}>No matches for "{query}"</p>}
          </aside>

          <section className="preview">
            {selected ? (
              <React.Fragment>
                <div className="preview-header">
                  <div className="breadcrumb">
                    <span className="root">~/ethan-dolder</span>
                    {path.map((p, i) => (
                      <React.Fragment key={i}>
                        <span className="sep">/</span>
                        <span className={i === path.length - 1 ? "current" : ""}>{p.name}</span>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="preview-title-row">
                    <div className="preview-icon-lg">{iconFor(selected, 44)}</div>
                    <div>
                      <h2 className="preview-title">{selected.name}</h2>
                      {selected.tagline && <p className="preview-tagline">{selected.tagline}</p>}
                    </div>
                  </div>
                </div>
                <div className="preview-body">
                  <PreviewBody node={selected} />
                </div>
              </React.Fragment>
            ) : <p className="muted" style={{padding:24}}>Nothing selected.</p>}
          </section>
        </div>

        <div className="status-bar">
          <span>{counts.folders} folders, {counts.files} files</span>
          <span className="dim">↑↓ navigate · ← → expand · ↵ open</span>
        </div>
      </main>

      <footer className="footnote">
        <span>© Ethan Dolder · {new Date().getFullYear()}</span>
        <span>built as a file system, on purpose</span>
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Look">
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            options={ACCENT_OPTIONS}
            onChange={v => setTweaks("accent", v)}
          />
          <TweakToggle label="Dark mode" value={tweaks.dark} onChange={v => setTweaks("dark", v)} />
        </TweakSection>
        <TweakSection label="Layout">
          <TweakRadio
            label="Tree density"
            value={tweaks.density}
            options={["cozy", "compact"]}
            onChange={v => setTweaks("density", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
