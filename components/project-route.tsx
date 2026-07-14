import type { Metadata } from "next";
import { ProjectDetailPage } from "./project-detail-page";
import { getProjectBySlug, type Project } from "./project-data";

export function getProjectMetadata(slug: Project["slug"]): Metadata {
  const project = getProjectBySlug(slug);

  return {
    title: `${project?.title ?? "Project"} — Joel Loh`,
    description: project?.description,
  };
}

export function ProjectRoute({ slug }: { slug: Project["slug"] }) {
  const project = getProjectBySlug(slug);

  if (!project) return null;

  return <ProjectDetailPage project={project} />;
}
