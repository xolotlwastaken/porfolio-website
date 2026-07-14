export type Project = {
  slug: string;
  number: string;
  title: string;
  description: string;
  tone: "silver" | "graphite" | "lavender" | "paper";
  status: string;
};

export const projects: Project[] = [
  {
    slug: "aegis-router",
    number: "01",
    title: "Aegis Router",
    description: "Project description and final case-study copy are awaiting supplied content.",
    tone: "silver",
    status: "Case study pending",
  },
  {
    slug: "epure",
    number: "02",
    title: "Epure",
    description: "Project description and final case-study copy are awaiting supplied content.",
    tone: "graphite",
    status: "Case study pending",
  },
  {
    slug: "schedura",
    number: "03",
    title: "Schedura",
    description: "Project description and final case-study copy are awaiting supplied content.",
    tone: "lavender",
    status: "Case study pending",
  },
  {
    slug: "fourth-project",
    number: "04",
    title: "Fourth project",
    description: "Project title, description, imagery and case-study destination have not been supplied.",
    tone: "paper",
    status: "Project details pending",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
