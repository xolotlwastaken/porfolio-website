"use client";

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePageTransition } from "./page-transition";
import { projects, type Project } from "./project-data";
import { ProductCore } from "./product-core";
import { ProductMockup } from "./product-mockup";

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
          <span>03</span>
        </div>
      </div>
    </motion.article>
  );
}

export function PortfolioHome() {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const hoverTimeout = useRef<number | null>(null);
  const { navigate } = usePageTransition();

  useEffect(() => () => {
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
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
          <span>01—03</span>
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
              onActivate={(activeProject) => navigate(`/work/${activeProject.slug}`)}
              onHover={(activeProject) => {
                if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
                if (activeProject) {
                  setHoveredProject(activeProject);
                  return;
                }
                hoverTimeout.current = window.setTimeout(() => setHoveredProject(null), 80);
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
