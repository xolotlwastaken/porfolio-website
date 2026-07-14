"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCore } from "./product-core";

type Project = {
  number: string;
  title: string;
  description: string;
  tone: "silver" | "graphite" | "lavender" | "paper";
  status: string;
};

const projects: Project[] = [
  {
    number: "01",
    title: "Aegis Router",
    description: "Project description and final case-study copy are awaiting supplied content.",
    tone: "silver",
    status: "Case study pending",
  },
  {
    number: "02",
    title: "Epure",
    description: "Project description and final case-study copy are awaiting supplied content.",
    tone: "graphite",
    status: "Case study pending",
  },
  {
    number: "03",
    title: "Schedura",
    description: "Project description and final case-study copy are awaiting supplied content.",
    tone: "lavender",
    status: "Case study pending",
  },
  {
    number: "04",
    title: "Fourth project",
    description: "Project title, description, imagery and case-study destination have not been supplied.",
    tone: "paper",
    status: "Project details pending",
  },
];

function LocalTime() {
  const [time, setTime] = useState("—:—");

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-SG", {
          timeZone: "Asia/Singapore",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return <time>{time} SGT</time>;
}

function ProductMockup({ project }: { project: Project }) {
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

function ProjectStage({
  project,
  index,
  onActivate,
  onHover,
}: {
  project: Project;
  index: number;
  onActivate: (project: Project) => void;
  onHover: (project: Project | null) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 75, damping: 22, mass: 0.4 });
  const mediaY = useTransform(smoothProgress, [0.08, 0.5, 0.92], [110, 0, -80]);
  const mediaScale = useTransform(smoothProgress, [0.08, 0.5, 0.92], [0.94, 1, 0.97]);
  const mediaOpacity = useTransform(smoothProgress, [0.04, 0.18, 0.82, 0.96], [0.25, 1, 1, 0.3]);
  const progress = useTransform(smoothProgress, [0.08, 0.92], ["0%", "100%"]);

  return (
    <motion.article
      ref={ref}
      className="project-stage"
      id={`project-${index + 1}`}
      aria-labelledby={`project-title-${index + 1}`}
      data-align={index % 2 === 0 ? "left" : "right"}
    >
      <div className="project-frame">
        <motion.button
          type="button"
          className="project-media"
          style={{ y: mediaY, scale: mediaScale, opacity: mediaOpacity }}
          onPointerEnter={() => onHover(project)}
          onPointerLeave={() => onHover(null)}
          onFocus={() => onHover(project)}
          onBlur={() => onHover(null)}
          onClick={() => onActivate(project)}
          aria-label={`Open ${project.title} project details`}
        >
          <ProductMockup project={project} />
          <span className="preview-action" aria-hidden="true">Open project</span>
        </motion.button>

        <div className="project-mobile-copy">
          <span>({project.number})</span>
          <h2 id={`project-title-${index + 1}`}>{project.title}</h2>
          <p>{project.description}</p>
          <span>{project.status}</span>
        </div>

        <div className="stage-progress" aria-hidden="true">
          <span>{project.number}</span>
          <i><motion.b style={{ width: progress }} /></i>
          <span>04</span>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, project]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="project-detail-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-detail-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.article
            className="project-detail"
            initial={{ y: "8%" }}
            animate={{ y: 0 }}
            exit={{ y: "8%" }}
            transition={{ type: "spring", stiffness: 150, damping: 24 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <span>Selected work / {project.number}</span>
              <button type="button" onClick={onClose} aria-label="Close project details">Close ×</button>
            </header>
            <div className="project-detail-grid">
              <div>
                <h2 id="project-detail-title">{project.title}</h2>
                <p>{project.description}</p>
                <span className="case-link" aria-disabled="true">{project.status}</span>
              </div>
              <div className="project-detail-media"><ProductMockup project={project} /></div>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type TransitionPhase = "cover" | "reveal" | null;

function BarWipe({ phase }: { phase: TransitionPhase }) {
  return (
    <AnimatePresence>
      {phase ? (
        <motion.div className="bar-wipe" aria-hidden="true" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {Array.from({ length: 8 }, (_, index) => (
            <motion.i
              key={index}
              initial={{ scaleX: phase === "cover" ? 0 : 1 }}
              animate={{ scaleX: phase === "cover" ? 1 : 0 }}
              transition={{
                duration: .28,
                delay: (phase === "cover" ? index : 7 - index) * .034,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function PortfolioHome() {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>(null);
  const transitionTimers = useRef<number[]>([]);
  const reducedMotion = useReducedMotion();

  const navigateWithBars = useCallback((action: () => void) => {
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimers.current = [];
    if (reducedMotion) {
      action();
      return;
    }

    setTransitionPhase("cover");
    transitionTimers.current.push(
      window.setTimeout(() => {
        action();
        setTransitionPhase("reveal");
      }, 520),
      window.setTimeout(() => setTransitionPhase(null), 1040),
    );
  }, [reducedMotion]);

  const openProject = useCallback((project: Project) => {
    navigateWithBars(() => setSelectedProject(project));
  }, [navigateWithBars]);

  const closeProject = useCallback(() => {
    navigateWithBars(() => setSelectedProject(null));
  }, [navigateWithBars]);

  useEffect(() => () => {
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <main>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <nav className="hero-nav" aria-label="Primary navigation">
          <a className="wordmark" href="#top">JL<span>.</span></a>
          <div>
            <a href="#work">Work</a>
            <a href="#top">Index</a>
          </div>
        </nav>

        <div className="hero-location">
          <span>Singapore</span>
          <LocalTime />
        </div>

        <header className="hero-heading">
          <p>Independent product designer + builder</p>
          <h1 id="hero-title">Joel Loh</h1>
        </header>

        <div className="hero-object">
          <ProductCore />
        </div>

        <p className="hero-statement">
          I shape useful products across AI, mobile, productivity and infrastructure—<br />
          from first principle to working system.
        </p>

        <a className="work-prompt" href="#work">
          <span>Selected work</span>
          <i>↓</i>
        </a>
      </section>

      <section className="work" id="work" aria-label="Selected work">
        <div className="work-nav" aria-hidden="true">
          <span>JL.</span>
          <span>Selected projects</span>
          <span>01—04</span>
        </div>
        <div className="work-sticky" aria-live="polite">
          <AnimatePresence mode="wait">
            {hoveredProject ? (
              <motion.div
                className={`work-hover-info ${Number(hoveredProject.number) % 2 === 1 ? "info-right" : "info-left"}`}
                key={hoveredProject.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <span>({hoveredProject.number}) / Product design + build</span>
                <h2>{hoveredProject.title}</h2>
                <p>{hoveredProject.description}</p>
                <b>{hoveredProject.status} · Click to open</b>
              </motion.div>
            ) : (
              <motion.header
                className="work-intro"
                key="selected-work"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: .96 }}
              >
                <p>Independent product design + build</p>
                <h2>Selected work</h2>
                <span>Scroll to explore ↓</span>
              </motion.header>
            )}
          </AnimatePresence>
        </div>
        <div className="project-stream">
          {projects.map((project, index) => (
            <ProjectStage
              project={project}
              index={index}
              key={project.number}
              onActivate={openProject}
              onHover={setHoveredProject}
            />
          ))}
        </div>
      </section>
      <ProjectDetail project={selectedProject} onClose={closeProject} />
      <BarWipe phase={transitionPhase} />
    </main>
  );
}
