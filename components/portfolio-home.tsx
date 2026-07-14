"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
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
    <div className={`mockup-world tone-${project.tone}`} aria-label={`${project.title} visual placeholder`}>
      <div className="browser-frame">
        <div className="browser-top">
          <span /><span /><span />
          <b>{project.title}</b>
        </div>
        <div className="browser-content">
          <div className="mock-sidebar">
            <i /><i /><i /><i />
          </div>
          <div className="mock-main">
            <p>{project.number} / SELECTED WORK</p>
            <strong>{project.title}</strong>
            <div className="mock-chart"><i /><i /><i /><i /><i /></div>
            <div className="mock-row"><i /><i /><i /></div>
          </div>
        </div>
      </div>
      <div className="support-screen support-a">
        <span>{project.number}</span>
        <b>{project.title}</b>
        <i /><i /><i />
      </div>
      <div className="support-screen support-b">
        <span>VIEW</span>
        <div className="support-orb" />
        <b>DETAIL</b>
      </div>
    </div>
  );
}

function ProjectStage({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 75, damping: 22, mass: 0.4 });
  const mediaY = useTransform(smoothProgress, [0.12, 0.5, 0.88], [90, 0, -70]);
  const mediaScale = useTransform(smoothProgress, [0.1, 0.5, 0.9], [0.9, 1, 0.94]);
  const textY = useTransform(smoothProgress, [0.15, 0.48, 0.85], [36, 0, -24]);
  const progress = useTransform(smoothProgress, [0.12, 0.88], ["0%", "100%"]);

  return (
    <motion.article
      ref={ref}
      className="project-stage"
      id={`project-${index + 1}`}
      aria-labelledby={`project-title-${index + 1}`}
    >
      <div className="project-sticky">
        <div className="project-frame">
          <motion.header className="project-copy" style={{ y: textY }}>
            <p className="eyebrow">Selected work / {project.number}</p>
            <h2 id={`project-title-${index + 1}`}>{project.title}</h2>
            <p className="project-description">{project.description}</p>
            <span className="case-link" aria-disabled="true">{project.status} <span>↗</span></span>
          </motion.header>

          <motion.div
            className="project-media"
            style={{ y: mediaY, scale: mediaScale }}
          >
            <ProductMockup project={project} />
          </motion.div>

          <span className="project-number" aria-hidden="true">{project.number}</span>
          <div className="stage-progress" aria-hidden="true">
            <span>{project.number}</span>
            <i><motion.b style={{ width: progress }} /></i>
            <span>04</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function PortfolioHome() {
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
        {projects.map((project, index) => (
          <ProjectStage project={project} index={index} key={project.number} />
        ))}
      </section>
    </main>
  );
}
