"use client";

import { usePageTransition } from "./page-transition";
import type { Project } from "./project-data";
import { ProductMockup } from "./product-mockup";

export function ProjectDetailPage({ project }: { project: Project }) {
  const { navigate } = usePageTransition();

  return (
    <main className="project-detail-page">
      <section className="project-detail-shell">
        <nav className="project-detail-nav" aria-label="Project navigation">
          <button type="button" className="detail-link" onClick={() => navigate("/#work")}>
            Back to work
          </button>
          <button type="button" className="detail-link" onClick={() => navigate("/")}>
            Index
          </button>
        </nav>

        <article className="project-detail project-detail-page-panel" aria-labelledby="project-detail-title">
          <header>
            <span>Selected work / {project.number}</span>
            <button type="button" onClick={() => navigate("/#work")} aria-label="Return to selected work">
              Close ×
            </button>
          </header>
          <div className="project-detail-grid">
            <div>
              <h1 id="project-detail-title">{project.title}</h1>
              <p>{project.description}</p>
              <span className="case-link" aria-disabled="true">
                {project.status}
              </span>
            </div>
            <div className="project-detail-media">
              <ProductMockup project={project} />
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
