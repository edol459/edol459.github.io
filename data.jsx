// Portfolio file tree data. Edit freely — the tree renders from this.

const TREE = [
  {
    id: "readme",
    name: "README.md",
    type: "markdown",
    content: `# Hi, I'm Ethan Dolder.

Computer Science graduate. Data Science. Basketball analytics.

**What you'll find here:**
- \`analytics-tools/\` — interactive basketball analytics tools, college and pro
- \`basketball-platforms/\` — the live websites and iOS app that host my basketball work
- \`academic/\` — senior capstone: an ML model that recognizes emotion from images

**Stack:** Python heavy (pandas, numpy, scikit-learn), SQL, JavaScript/TypeScript, React, Swift.

**Contact:** edolder@purdue.edu`,
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
    id: "analytics-tools",
    name: "analytics-tools",
    type: "folder",
    description: "interactive basketball analytics tools, college and pro",
    children: [
      {
        id: "cbb-lineups",
        name: "cbb lineup tool",
        type: "tool",
        href: "https://cbblineups.up.railway.app/",
        tagline: "For college basketball staff to optimize their 5-man lineups",
        description: `Compare your own 5-man lineups to benchmarks- avg D1 lineup, avg NCAA lineup, opponent starting 5, etc.`,
        stack: ["Python, JavaScript, Pandas"],
      },
      {
        id: "ydk-statsheets",
        name: "interactive NBA player database",
        type: "tool",
        href: "https://ydkball.net/leaderboard",
        tagline: "Every stat, for every player, sortable and filterable.",
        description: `Full player stat sheets across every category — Per Game, Totals, Advanced, and Tracking. Sort by any column, filter by team / position / season, and surface the line you're chasing.

Built on top of an NBA stats pipeline I maintain — fresh after every game.

Live at ydkball.net/leaderboard.`,
        stack: ["React", "Postgres", "Python ETL"],
      },
      {
        id: "ydk-wowy",
        name: "NBA WoWY",
        type: "tool",
        href: "https://ydkball.net/wowy",
        tagline: "With-or-without-you on/off splits.",
        description: `Select 1–5 players. See how their team performs with all of them on the floor vs. when any one is off.

Returns offensive rating, defensive rating, and net rating deltas — the classic on/off framework, but with multi-player lineups and confidence-aware sample sizes.

Live at ydkball.net/wowy.`,
        stack: ["React", "Postgres", "Play-by-play parser"],
      },
      {
        id: "ydk-compare",
        name: "NBA player compare",
        type: "tool",
        href: "https://ydkball.net/compare",
        tagline: "Side-by-side player season comparison.",
        description: `Stack any two seasons across every stat that matters. Career-best shooting vs. career-best shooting. Rookie-year defense vs. rookie-year defense. Any two players, any two seasons, same view.

Useful for scouting analogues, projecting development curves, or settling arguments.

Live at ydkball.net/compare.`,
        stack: ["React", "Postgres"],
      },
      {
        id: "ydk-builder",
        name: "NBA player archetype builder",
        type: "tool",
        href: "https://ydkball.net/builder",
        tagline: "Build a custom player composite. Define the archetype.",
        description: `Pick any combination of stats. The tool finds the players with the highest average percentile across all of them.

You're defining the metric — "two-way guard", "rim protector", "high-usage scorer" — and it surfaces who fits. Functions as a poor-man's RAPM-flavored archetype finder, but tunable on the fly.

Live at ydkball.net/builder.`,
        stack: ["React", "Postgres", "Python (percentile pipeline)"],
      },
    ],
  },
  {
    id: "basketball-platforms",
    name: "basketball-platforms",
    type: "folder",
    description: "The live products that host my basketball work — full-stack websites, an iOS app, and an automated analytics site.",
    children: [
      {
        id: "ydk-site",
        name: "ydkball.net",
        type: "site",
        href: "https://ydkball.net",
        tagline: "Social platform + analytics hub for NBA & WNBA.",
        description: `The main web hub. Houses the four analytics tools above plus a community layer where users rate and review NBA / WNBA games — think Letterboxd for pro basketball.

I built the full stack: data pipeline, backend, frontend, auth, and the analytics surfaces.`,
        stack: ["React", "Node", "Postgres", "Python ETL"],
      },
      {
        id: "ydk-app",
        name: "ydkball iOS",
        type: "app",
        href: "https://apps.apple.com/us/app/ydkball/id6766407610",
        tagline: "Native iOS build of the ydkball platform.",
        description: `Rate games, write reviews, follow other fans, and dig into stats — all from your phone. Native SwiftUI build, talks to the same backend as the web platform.

Available on the App Store.`,
        stack: ["Swift", "SwiftUI"],
      },
      {
        id: "outlier",
        name: "theoutlier.net",
        type: "site",
        href: "https://theoutlier.net",
        tagline: "NBA games, by the numbers that don't fit.",
        description: `An analytics site that surfaces the statistical outliers in every NBA game.

Live data feeds, automated outlier computation, and data visualization triggered when games finish — so the next-morning takes have actual evidence behind them.`,
        stack: ["Python", "Pandas", "Postgres", "Next.js", "D3"],
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
        description: `Video walkthrough of my senior capstone: a machine learning model that classifies emotion from facial images. Covers problem framing, dataset, model architecture, training process, and results.`,
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
