// File-type icons. Folder is the blue mac-inspired one.

const Folder = ({ size = 20, open = false }) => (
  <svg width={size} height={size * (52 / 64)} viewBox="0 0 64 52" style={{ flexShrink: 0 }}>
    {/* back tab */}
    <path
      d="M4 8 Q4 4 8 4 L22 4 L26 8 L56 8 Q60 8 60 12 L60 18 L4 18 Z"
      fill="var(--folder-tab, #1c7fc7)"
    />
    {/* front body */}
    <path
      d={open
        ? "M4 14 L60 14 L56 46 Q55.5 50 51.5 50 L8.5 50 Q4.5 50 4 46 Z"
        : "M4 14 Q4 10 8 10 L56 10 Q60 10 60 14 L60 46 Q60 50 56 50 L8 50 Q4 50 4 46 Z"}
      fill="var(--folder-body, #4ab8f0)"
    />
  </svg>
);

const FileBase = ({ size = 18, children, tint = "var(--ink-3)" }) => (
  <svg width={size} height={size * (22 / 18)} viewBox="0 0 36 44" style={{ flexShrink: 0 }}>
    <path
      d="M4 4 Q4 1 7 1 L24 1 L32 9 L32 40 Q32 43 29 43 L7 43 Q4 43 4 40 Z"
      fill="var(--paper)"
      stroke={tint}
      strokeWidth="1.5"
    />
    <path d="M24 1 L24 9 L32 9" fill="none" stroke={tint} strokeWidth="1.5" strokeLinejoin="round" />
    {children}
  </svg>
);

const MarkdownIcon = ({ size }) => (
  <FileBase size={size}>
    <text x="18" y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--ink-2)" fontFamily="ui-monospace, monospace">md</text>
  </FileBase>
);

const TextIcon = ({ size }) => (
  <FileBase size={size}>
    <line x1="9" y1="20" x2="27" y2="20" stroke="var(--ink-3)" strokeWidth="1.5" />
    <line x1="9" y1="26" x2="27" y2="26" stroke="var(--ink-3)" strokeWidth="1.5" />
    <line x1="9" y1="32" x2="22" y2="32" stroke="var(--ink-3)" strokeWidth="1.5" />
  </FileBase>
);

const PdfIcon = ({ size }) => (
  <FileBase size={size} tint="#c44">
    <text x="18" y="33" textAnchor="middle" fontSize="9" fontWeight="700" fill="#c44" fontFamily="ui-monospace, monospace">PDF</text>
  </FileBase>
);

const DocIcon = ({ size }) => (
  <FileBase size={size} tint="#2a6fdb">
    <text x="18" y="33" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2a6fdb" fontFamily="ui-monospace, monospace">W</text>
  </FileBase>
);

const VideoIcon = ({ size }) => (
  <FileBase size={size}>
    <polygon points="14,22 14,34 26,28" fill="var(--accent)" />
  </FileBase>
);

// Browser-window for live sites — small chrome bar with three dots
const SiteIcon = ({ size = 20 }) => (
  <svg width={size} height={size * (22 / 20)} viewBox="0 0 40 44" style={{ flexShrink: 0 }}>
    <rect x="2" y="6" width="36" height="32" rx="3" fill="var(--paper)" stroke="var(--ink-3)" strokeWidth="1.5" />
    <rect x="2" y="6" width="36" height="8" rx="3" fill="var(--ink-4)" />
    <circle cx="7" cy="10" r="1.3" fill="var(--paper)" />
    <circle cx="11" cy="10" r="1.3" fill="var(--paper)" />
    <circle cx="15" cy="10" r="1.3" fill="var(--paper)" />
    <line x1="8" y1="22" x2="32" y2="22" stroke="var(--ink-3)" strokeWidth="1.2" />
    <line x1="8" y1="27" x2="28" y2="27" stroke="var(--ink-3)" strokeWidth="1.2" />
    <line x1="8" y1="32" x2="24" y2="32" stroke="var(--ink-3)" strokeWidth="1.2" />
  </svg>
);

// Squircle app icon
const AppIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
    <rect x="3" y="3" width="34" height="34" rx="9" fill="var(--accent)" />
    <path d="M14 14 L20 26 L26 14" stroke="var(--paper)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Tool icon — a small gear-ish glyph (no fake brand)
const ToolIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
    <rect x="3" y="3" width="34" height="34" rx="7" fill="var(--ink-1)" />
    <rect x="10" y="22" width="4" height="10" fill="var(--accent)" />
    <rect x="18" y="14" width="4" height="18" fill="var(--paper)" />
    <rect x="26" y="9" width="4" height="23" fill="var(--paper)" opacity="0.7" />
  </svg>
);

// Folder-with-badge — for "feature" surfaces inside a project (reviews, etc)
const FeatureIcon = ({ size = 20 }) => (
  <svg width={size} height={size * (52 / 64)} viewBox="0 0 64 52" style={{ flexShrink: 0 }}>
    <path d="M4 8 Q4 4 8 4 L22 4 L26 8 L56 8 Q60 8 60 12 L60 18 L4 18 Z" fill="#0a3d6b" />
    <path d="M4 14 Q4 10 8 10 L56 10 Q60 10 60 14 L60 46 Q60 50 56 50 L8 50 Q4 50 4 46 Z" fill="var(--accent)" />
    <text x="32" y="40" textAnchor="middle" fontSize="18" fontWeight="800" fill="var(--paper)" fontFamily="ui-monospace, monospace">★</text>
  </svg>
);

const ChevronRight = ({ size = 10, open = false }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={{
    flexShrink: 0,
    transform: open ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 140ms ease",
  }}>
    <path d="M3 2 L7 5 L3 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowOut = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
    <path d="M4 8 L8 4 M5 4 L8 4 L8 7" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Search = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
    <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <line x1="9" y1="9" x2="12" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

function iconFor(node, size = 18) {
  switch (node.type) {
    case "folder": return <Folder size={size + 4} />;
    case "folder-feature": return <FeatureIcon size={size + 4} />;
    case "markdown": return <MarkdownIcon size={size} />;
    case "text": return <TextIcon size={size} />;
    case "pdf": return <PdfIcon size={size} />;
    case "doc": return <DocIcon size={size} />;
    case "video": return <VideoIcon size={size} />;
    case "site": return <SiteIcon size={size + 2} />;
    case "app": return <AppIcon size={size + 2} />;
    case "tool": return <ToolIcon size={size + 2} />;
    default: return <FileBase size={size} />;
  }
}

Object.assign(window, {
  Folder, FileBase, MarkdownIcon, TextIcon, PdfIcon, DocIcon, VideoIcon,
  SiteIcon, AppIcon, ToolIcon, FeatureIcon, ChevronRight, ArrowOut, Search,
  iconFor,
});
