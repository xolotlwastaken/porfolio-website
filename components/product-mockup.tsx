import type { Project } from "./project-data";

export function ProductMockup({ project }: { project: Project }) {
  return (
    <div className={`project-preview tone-${project.tone}`} aria-label={`${project.title} project artwork placeholder`}>
      <div className="preview-browser">
        <div className="preview-bar">
          <span>{project.number}</span>
          <b>{project.title}</b>
          <span>PROJECT</span>
        </div>
        <div className="preview-layout">
          <aside><i /><i /><i /><i /></aside>
          <div className="preview-content">
            <p>SELECTED WORK / {project.number}</p>
            <strong>{project.title}</strong>
            <div className="preview-grid">
              <i /><i /><i /><i /><i /><i />
            </div>
          </div>
        </div>
      </div>
      <div className="preview-card preview-card-a">
        <span>{project.number}</span>
        <b>{project.title}</b>
        <i /><i /><i />
      </div>
      <div className="preview-card preview-card-b">
        <span>JL / PRODUCT</span>
        <div className="preview-orb" />
        <b>DETAIL</b>
      </div>
    </div>
  );
}
