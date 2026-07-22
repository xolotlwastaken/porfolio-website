import type { Project } from "./project-data";

export function ProductMockup({ project, mode = "preview" }: { project: Project; mode?: "preview" | "detail" }) {
  const mainImage = project.screenshots[0];

  if (mode === "detail") {
    return (
      <div className={`project-preview tone-${project.tone}`} aria-label={`${project.title} project artwork`}>
        <div className="preview-browser">
          <div className="preview-bar">
            <span>{project.number}</span>
            <b>{project.title}</b>
            <span>PROJECT</span>
          </div>
          {mainImage ? (
            <img src={mainImage} alt={`${project.title} screenshot`} className="preview-main-image" />
          ) : (
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
          )}
        </div>
        {project.screenshots.length > 1 && (
          <div className="preview-gallery">
            {project.screenshots.map((screenshot, i) => (
              <img key={i} src={screenshot} alt={`${project.title} screenshot ${i + 1}`} className="preview-gallery-image" />
            ))}
          </div>
        )}
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

  return (
    <div className={`project-preview tone-${project.tone}`} aria-label={`${project.title} project artwork placeholder`}>
      <div className="preview-browser">
        <div className="preview-bar">
          <span>{project.number}</span>
          <b>{project.title}</b>
          <span>PROJECT</span>
        </div>
        {mainImage ? (
          <img src={mainImage} alt={`${project.title} screenshot`} className="preview-main-image" />
        ) : (
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
        )}
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
