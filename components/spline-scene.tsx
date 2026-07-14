"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

export function SplineScene({
  scene,
  className,
}: {
  scene: string;
  className?: string;
}) {
  return (
    <Suspense fallback={<CoreLoadingState />}>
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}

export function CoreLoadingState() {
  return (
    <div className="core-loading" role="status" aria-label="Loading 3D sculpture">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}
