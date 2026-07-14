"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { SplineScene } from "./spline-scene";

const splineScene = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL;

function ProductCoreMesh({ hovered }: { hovered: boolean }) {
  const group = useRef<Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      target.current = {
        x: (event.clientY / window.innerHeight - 0.5) * 0.28,
        y: (event.clientX / window.innerWidth - 0.5) * 0.42,
      };
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.x += (target.current.x - group.current.rotation.x) * 0.035;
    group.current.rotation.y += delta * 0.12 + (target.current.y - group.current.rotation.y) * 0.025;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.055;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.045;
  });

  const separation = hovered ? 1.12 : 1;

  return (
    <group ref={group} scale={1.05}>
      <RoundedBox args={[1.25, 0.5, 0.54]} radius={0.24} smoothness={6} position={[-0.56 * separation, 0.42 * separation, 0]} rotation={[0.18, 0.1, -0.42]}>
        <meshPhysicalMaterial color="#d8d8d3" metalness={0.92} roughness={0.17} clearcoat={1} />
      </RoundedBox>
      <RoundedBox args={[0.52, 1.28, 0.46]} radius={0.23} smoothness={6} position={[0.5 * separation, 0.43 * separation, 0.08]} rotation={[0.1, -0.1, 0.38]}>
        <meshPhysicalMaterial color="#b7a8dd" metalness={0.18} roughness={0.2} transmission={0.28} transparent opacity={0.9} />
      </RoundedBox>
      <mesh position={[-0.42 * separation, -0.5 * separation, 0.02]} rotation={[0.18, 0.2, 0.18]}>
        <torusGeometry args={[0.43, 0.18, 32, 80]} />
        <meshPhysicalMaterial color="#202022" metalness={0.75} roughness={0.22} clearcoat={0.8} />
      </mesh>
      <RoundedBox args={[0.92, 0.78, 0.5]} radius={0.28} smoothness={6} position={[0.48 * separation, -0.48 * separation, -0.04]} rotation={[-0.15, -0.16, -0.15]}>
        <meshPhysicalMaterial color="#f0eee8" metalness={0.52} roughness={0.18} transmission={0.1} />
      </RoundedBox>
    </group>
  );
}

function StaticCore() {
  return (
    <div className="static-core" aria-hidden="true">
      <i className="core-form core-form-ai" />
      <i className="core-form core-form-mobile" />
      <i className="core-form core-form-productivity" />
      <i className="core-form core-form-infra" />
    </div>
  );
}

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowPower = (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) ||
      navigator.hardwareConcurrency <= 2 || nav.connection?.saveData;
    return !lowPower && Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function ProductCore() {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [checked, setChecked] = useState(false);
  const label = useMemo(() => "Interactive product core. Activate to view selected work.", []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setWebgl(canUseWebGL());
      setChecked(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const goToWork = () => {
    document.querySelector("#work")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      className="product-core"
      aria-label={label}
      onClick={goToWork}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {!checked || reducedMotion || !webgl ? (
        <StaticCore />
      ) : splineScene ? (
        <SplineScene scene={splineScene} className="spline-canvas" />
      ) : (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 4.5], fov: 40 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
          }}
          fallback={<StaticCore />}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[3, 5, 4]} intensity={4.5} color="#ffffff" />
          <pointLight position={[-4, -2, 3]} intensity={2.8} color="#b8a3ef" />
          <ProductCoreMesh hovered={hovered} />
        </Canvas>
      )}
      <span className="core-caption">AI / MOBILE / PRODUCTIVITY / INFRASTRUCTURE</span>
    </button>
  );
}
