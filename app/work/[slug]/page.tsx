import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProjectDetailPage } from "@/components/project-detail-page";
import { getProjectBySlug } from "@/components/project-data";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const project = getProjectBySlug(slug);
    if (!project) {
      return { title: "Project not found — Joel Loh" };
    }

    return {
      title: `${project.title} — Joel Loh`,
      description: project.description,
    };
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return <ProjectDetailPage project={project} />;
}
