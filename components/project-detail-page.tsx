"use client";

import { usePageTransition } from "./page-transition";
import type { Project } from "./project-data";
import { useState, useEffect, useRef, useCallback } from "react";

export function ProjectDetailPage({ project }: { project: Project }) {
  const { navigate } = usePageTransition();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const touchStart = useRef<number | null>(null);
  const total = project.screenshots.length;

  const goTo = useCallback((i: number) => {
    setIndex(i);
  }, []);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo((index + 1) % total);
      else goTo((index - 1 + total) % total);
    }
    touchStart.current = null;
  };

  return (
    <div className="project-detail-backdrop">
      <div className="project-detail" role="dialog" aria-label={`${project.title} project details`}>
        {/* ── Navigation bar ── */}
        <header className="detail-nav">
          <div className="detail-nav-group">
            <button
              type="button"
              className="detail-nav-link"
              onClick={() => navigate("/#work")}
            >
              work
            </button>
            <span className="detail-nav-divider" aria-hidden="true" />
            <button
              type="button"
              className="detail-nav-link"
              onClick={() => navigate("/")}
            >
              index
            </button>
          </div>
          <button
            type="button"
            className="detail-close"
            onClick={() => navigate("/#work")}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        {/* ── Hero section ── */}
        <div className="detail-hero">
          <span className="detail-number">{project.number}</span>
          <h1 className="detail-title">{project.title}</h1>
        </div>

        {/* ── Summary section ── */}
        <div className="detail-summary">
          <p className="detail-brief">{project.description}</p>
          <div className="detail-meta">
            <span className="detail-status">{project.status}</span>
            <span className="detail-divider" aria-hidden="true" />
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-cta"
            >
              Visit →
            </a>
          </div>
        </div>

        {/* ── Expandable full description ── */}
        <div className="detail-full-section">
          <button
            type="button"
            className="detail-expand-btn"
            onClick={() => setShowFull(!showFull)}
          >
            <span className={`detail-expand-icon ${showFull ? "open" : ""}`}>+</span>
            {showFull ? "Hide details" : "Show details"}
          </button>
          <div className={`detail-full-body ${showFull ? "visible" : ""}`}>
            <p dangerouslySetInnerHTML={{ __html: project.fullDescription }} />
          </div>
        </div>

        {/* ── Carousel ── */}
        <div className="detail-carousel-section">
          <div
            className="detail-carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="detail-carousel-viewport">
              <div
                className="detail-carousel-track"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {project.screenshots.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${project.title} — view ${i + 1}`}
                    className="detail-carousel-slide"
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            {total > 1 && (
              <div className="detail-gallery">
                {project.screenshots.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`detail-thumb ${i === index ? "active" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Screenshot ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}

            {/* Arrows */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  className="detail-arrow detail-arrow-prev"
                  onClick={() => goTo((index - 1 + total) % total)}
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="detail-arrow detail-arrow-next"
                  onClick={() => goTo((index + 1) % total)}
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}

            {/* Counter */}
            {total > 1 && (
              <div className="detail-counter">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
