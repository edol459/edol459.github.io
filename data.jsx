// Portfolio file tree data. Edit freely — the tree renders from this.

const TREE = [
  {
    id: "readme",
    name: "README.md",
    type: "markdown",
    content: `# Hi, I'm Ethan Dolder.

Computer Science graduate. Data Science. Basketball analytics.

**What I'm chasing:** a role as an NBA / WNBA analyst — or any data-heavy job where I get to build, model, and ship.

**What I make:**
- **theoutlier.net** — a site that surfaces the statistically weird moments in NBA games. The numbers that don't fit.
- **ydkball** — a basketball platform: a social layer for rating and reviewing pro games, plus a four-tool stats hub. Also on the App Store as **ydkball.app**.
- Academic writing and video — see the \`academic/\` folder.

**Stack:** Python (pandas, numpy, scikit-learn), SQL, JavaScript/TypeScript, React, Swift. Whatever the data needs.

Click any folder. Every file leads somewhere real.`,
  },
  {
    id: "resume",
    name: "resume.pdf",
    type: "pdf",
    href: "assets/resume.pdf",
    download: "EthanDolder-Resume.pdf",
    tagline: "One-pager. CS grad, data + basketball analytics.",
  },
  {
    id: "basketball",
    name: "basketball",
    type: "folder",
    children: [
      {
        id: "outlier",
        name: "theoutlier.net",
        type: "site",
        href: "https://theoutlier.net",
        tagline: "NBA games, by the numbers that don't fit.",
        description: `An analytics site that surfaces the statistical outliers in every NBA game — the lines that broke a player's career average, the runs that defied the model, the box-score corners nobody else is looking at.

Built for fans who want the "why is this weird" alongside the box score.`,
        stack: ["Python", "Postgres", "Next.js", "D3"],
      },
      {
        id: "ydkball",
        name: "ydkball",
        type: "folder",
        children: [
          {
            id: "ydk-site",
            name: "ydkball.net",
            type: "site",
            href: "https://ydkball.net",
            tagline: "The home base — social + stats for NBA & WNBA.",
            description: `The main web hub. From here you can browse game reviews from the community or dive into the four-tool stats hub.

Below this folder, each surface is broken out as its own item so you can see them individually.`,
            stack: ["React", "Node", "Postgres"],
          },
          {
            id: "ydk-app",
            name: "ydkball.app",
            type: "app",
            href: "https://apps.apple.com/us/app/ydkball/",
            tagline: "iOS app — the platform in your pocket.",
            description: `Native iOS build of the ydkball platform. Rate games, write reviews, follow other fans, and dig into stats — all from your phone.

Available on the App Store.`,
            stack: ["Swift", "SwiftUI"],
          },
          {
            id: "ydk-reviews",
            name: "reviews",
            type: "folder-feature",
            href: "https://ydkball.net",
            tagline: "Letterboxd, but for NBA and WNBA games.",
            description: `The social half of ydkball. Users rate each NBA and WNBA game on a 0–10 scale, write a short review, and follow other fans whose taste they trust.

A game ages — a 50-point night looks different a year later. Reviews capture how it felt to watch live.`,
            stack: ["React", "Postgres"],
          },
          {
            id: "ydk-stats",
            name: "stats-dash",
            type: "folder",
            children: [
              {
                id: "ydk-statsheets",
                name: "stat-sheets.app",
                type: "tool",
                href: "https://ydkball.net",
                tagline: "Per Game · Totals · Advanced · Tracking. Sort, filter, dig.",
                description: `Full player stat sheets across every category — Per Game, Totals, Advanced, Tracking. Sort by anything, filter by anything, and surface the line you're chasing.`,
              },
              {
                id: "ydk-wowy",
                name: "wowy.app",
                type: "tool",
                href: "https://ydkball.net",
                tagline: "With-or-without-you on/off splits.",
                description: `See how a team performs with any player on the floor vs. on the bench. Drop a name, get the deltas across offensive rating, defensive rating, pace, and the rest.`,
              },
              {
                id: "ydk-compare",
                name: "compare.app",
                type: "tool",
                href: "https://ydkball.net",
                tagline: "Side-by-side player comparison.",
                description: `Stack any two seasons across every stat that matters. Career-best vs. career-best, rookie-year vs. rookie-year, today vs. last week — same view, every time.`,
              },
              {
                id: "ydk-builder",
                name: "builder.app",
                type: "tool",
                href: "https://ydkball.net",
                tagline: "Build a custom player composite. (Beta)",
                description: `Pick any stats. Weight them by impact. Rank the league.

You're defining the metric — "two-way guard", "rim protector", "high-usage scorer" — and the tool surfaces who fits.`,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "academic",
    name: "academic",
    type: "folder",
    children: [
      {
        id: "capstone-video",
        name: "capstone-demo.mp4",
        type: "video",
        href: "https://youtu.be/nSGjruA_SYA",
        embed: "https://www.youtube.com/embed/nSGjruA_SYA",
        tagline: "Senior capstone — ML model that recognizes emotion from images.",
        description: `Video walkthrough of my senior capstone: a machine learning model that classifies emotion from facial images. Includes the problem framing, dataset, model architecture, training process, and results.`,
      },
      {
        id: "capstone-report",
        name: "capstone-report.pdf",
        type: "pdf",
        href: "assets/capstone-report.pdf",
        download: "EthanDolder-Capstone-Report.pdf",
        tagline: "Final report — emotion-recognition capstone.",
        description: `Written companion to the capstone demo. Full report covering methodology, model design, evaluation, and findings.`,
      },
    ],
  },
];

window.PORTFOLIO_TREE = TREE;
