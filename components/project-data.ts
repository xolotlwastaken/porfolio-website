export type Project = {
  slug: string;
  number: string;
  title: string;
  description: string;
  fullDescription: string;
  tone: "silver" | "graphite" | "lavender" | "paper";
  status: string;
  url: string;
  screenshots: string[];
};

const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

export const projects: Project[] = [
  {
    slug: "aegis-router",
    number: "01",
    title: "Aegis Router",
    description:
      "A high-performance Go reverse proxy that routes AI inference requests across multiple providers to maximize cost efficiency. It uses a Redis-backed context cache to detect cached conversations and route to zero-prefill-cost providers, with automatic fallback on failures.",
    fullDescription:
      "Aegis Router — A high-performance Go reverse proxy that intelligently routes AI inference requests across multiple upstream providers to maximize cost efficiency and reliability. It features a Redis-backed context cache that detects when conversation history is already cached, allowing requests to be routed to a zero-prefill-cost provider instead of paying full token rates. On cache misses or upstream failures, requests automatically fall back to alternative providers. The proxy enforces per-request budgets, detects token loops in real-time via SSE stream inspection, and logs every request for billing and analytics. Built with Go's httputil.ReverseProxy, it exposes a standard OpenAI-compatible API endpoint so downstream AI agents and IDEs can integrate with zero code changes.",
    tone: "silver",
    status: "Live project",
    url: "https://aegisrouter.com/",
    screenshots: [`${base}/project_images/aegisrouter/aegis-1.png`, `${base}/project_images/aegisrouter/aegis-2.png`, `${base}/project_images/aegisrouter/aegis-3.png`],
  },
  {
    slug: "epure",
    number: "02",
    title: "Epure",
    description:
      "A hyper-minimalist React Native app for long-term S&P 500 compounding with a built-in brokerage blocker that makes emotional trading intentionally difficult through multi-step friction protocols.",
    fullDescription:
      'Epure is a hyper-minimalist React Native + Expo mobile app for long-term S&P 500 compounding. It rejects real-time market data and complex dashboards in favor of a single deterministic forecast: a future value projection computed client-side using a fixed 10% annualized return. The core differentiator is the "Brokerage Shield" — a native-level app blocker (iOS FamilyControls / Android UsageStats) that locks brokerage apps like Robinhood, Webull, and Schwab. Requiring temporary access triggers a multi-step friction protocol: a 60-second cooldown, a 6-digit OTP emailed via Supabase Edge Functions, and three explicit confirmations — making emotional trading intentionally difficult. Built with React Native, Expo, Supabase (PostgreSQL + Edge Functions), and native Swift/Java modules.',
    tone: "graphite",
    status: "Live project",
    url: "https://epure-site-one.vercel.app/",
    screenshots: [`${base}/project_images/epure/epure-1.png`, `${base}/project_images/epure/epure-2.png`, `${base}/project_images/epure/epure-3.png`],
  },
  {
    slug: "gymstamp",
    number: "03",
    title: "Gymstamp",
    description:
      "A mobile app that turns gym consistency into a shared commitment — users form private groups, set weekly visit targets, and verify sessions with location and live photos to build accountability through streaks.",
    fullDescription:
      "Gymstamp is a mobile app that turns gym consistency into a shared commitment. Users create or join private groups with friends, set a weekly visit target, and verify each gym session with foreground location and a live photo. Verified check-ins flow into a private group feed where members react, nudges keep everyone accountable, and shared streaks make showing up a group effort. Built with React Native (Expo), Supabase (Auth, PostgreSQL, Storage), and Google Places verification — designed with a premium minimalist aesthetic and privacy-first principles.",
    tone: "lavender",
    status: "Live project",
    url: "https://gymstamp-site.rapiapps.workers.dev/",
    screenshots: [`${base}/project_images/gymstamp/gymstamp-1.png`, `${base}/project_images/gymstamp/gymstamp-2.png`, `${base}/project_images/gymstamp/gymstamp-3.png`],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
