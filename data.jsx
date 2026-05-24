// Portfolio file tree data. Edit freely — the tree renders from this.

const TREE = [
  {
    id: "readme",
    name: "README.md",
    type: "markdown",
    content: `# Hi, I'm Ethan Dolder.

Computer Science graduate. Data Science. Basketball analytics.

**Featured Projects:**
- **ydkball** : a basketball platform: a social layer for rating and reviewing pro games, plus an analytics hub. Also on the App Store as **ydkball.app**.
- **theoutlier.net** : a site that finds and ranks outlier stats in NBA games.
- **academic** : academic writing and video for my senior capstone project. See the \`academic/\` folder.

**Stack:** Python heavy, SQL, JavaScript/TypeScript, React, Swift.

  **Contact:** edolder@purdue.edu `
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
        description: `An analytics site that surfaces the statistical outliers in every NBA game. 
        
        Live data feeds, automated outlier computation and  data visualization when games finish.`,
        stack: ["Python", "Pandas", "Postgres", "Next.js", "D3"],
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
            tagline: "social platform + stats for NBA & WNBA.",
            description: `The main web hub. From here you can browse game reviews from the community or dive into the four-tool stats hub.

Below this folder, each surface is broken out as its own item so you can see them individually.`,
            stack: ["React", "Node", "Postgres"],
          },
          {
            id: "ydk-app",
            name: "ydkball iOS",
            type: "app",
            href: "https://apps.apple.com/us/app/ydkball/id6766407610",
            tagline: "iOS app",
            description: `Native iOS build of the ydkball platform. Rate games, write reviews, follow other fans, and dig into stats — all from your phone.

Available on the App Store.`,
            stack: ["Swift", "SwiftUI"],
          },
          {
            id: "ydk-stats",
            name: "analytics tools",
            type: "folder",
            children: [
              {
                id: "ydk-statsheets",
                name: "interactive player database",
                type: "tool",
                href: "https://ydkball.net/leaderboard",
                tagline: "Every stat, for every player, sortable and filterable.",
                description: `Full player stat sheets across every category — Per Game, Totals, Advanced, Tracking.`,
              },
              {
                id: "ydk-wowy",
                name: "WoWY",
                type: "tool",
                href: "https://ydkball.net/wowy",
                tagline: "With-or-without-you on/off splits.",
                description: `See how a team performs with any player on the floor vs. on the bench. Select 1-5 players, get the offensive, defensive, and net rating on/off deltas.`,
              },
              {
                id: "ydk-compare",
                name: "compare",
                type: "tool",
                href: "https://ydkball.net/compare",
                tagline: "Side-by-side player comparison.",
                description: `Stack any two seasons across every stat that matters. Career-best shooting stats vs. career-best shooting stats, rookie-year defensive stats vs. rookie-year defensive stats, or any two seasons you want to compare.`,
              },
              {
                id: "ydk-builder",
                name: "player archetype builder",
                type: "tool",
                href: "https://ydkball.net/builder",
                tagline: "Build a custom player composite.",
                description: `Select any combination of stats, find the players that are in the highest average percentile in them all.

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
        tagline: "Senior capstone project — ML model that recognizes emotion from images.",
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
