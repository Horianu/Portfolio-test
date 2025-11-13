// lib/projects.ts
export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  description: string;
};

export const projects: Project[] = [
  {
    slug: "portfolio-site",
    title: "Personal Portfolio Site",
    tagline: "Clean one-page portfolio with video background.",
    year: "2025",
    role: "Design & Development",
    description:
      "A minimal portfolio built with Next.js, Tailwind CSS and a scroll-friendly video background.",
  },
  {
    slug: "crypto-dashboard",
    title: "Crypto Dashboard",
    tagline: "Lightweight dashboard for tracking tokens.",
    year: "2024",
    role: "Frontend",
    description:
      "Dashboard UI for monitoring token prices and basic on-chain metrics with a clean, card-based layout.",
  },
  {
    slug: "bpm-tool",
    title: "BPM Tool UI",
    tagline: "Interface for managing business processes.",
    year: "2024",
    role: "UX & Frontend",
    description:
      "Simple, task-focused interface for visualising and editing BPMN diagrams and process steps.",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
