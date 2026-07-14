"use client";

import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, useCursor } from "@react-three/drei";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useReducedMotion } from "motion/react";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { MathUtils, Plane, Vector3 } from "three";

type Point = [number, number, number];

function CameraRig() {
  const { camera, size } = useThree();

  useEffect(() => {
    const narrow = size.width / size.height < 1;
    camera.position.set(0, narrow ? 1.7 : 1.55, narrow ? 11.6 : 9.2);
    camera.lookAt(0, 0.1, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  return null;
}

function PhysicsBlock({
  id,
  initial,
  rotation = [0, 0, 0],
  children,
}: {
  id: string;
  initial: Point;
  rotation?: Point;
  children: ReactNode;
}) {
  const body = useRef<RapierRigidBody>(null);
  const { rapier } = useRapier();
  const dragPlane = useRef(new Plane(new Vector3(0, 0, 1), 0));
  const hit = useRef(new Vector3());
  const offset = useRef(new Vector3());
  const lastPoint = useRef(new Vector3());
  const lastTime = useRef(0);
  const throwVelocity = useRef(new Vector3());
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  useCursor(hovered || dragging, dragging ? "grabbing" : "grab");

  useFrame(() => {
    const current = body.current;
    if (!current || dragging) return;
    if (current.translation().y < -5) {
      current.setTranslation({ x: initial[0], y: initial[1] + 1.8, z: initial[2] }, true);
      current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  const projectToPlane = (event: ThreeEvent<PointerEvent>) => {
    event.ray.intersectPlane(dragPlane.current, hit.current);
    return hit.current;
  };

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const current = body.current;
    if (!current) return;

    const translation = current.translation();
    dragPlane.current.set(new Vector3(0, 0, 1), -translation.z);
    const point = projectToPlane(event);
    offset.current.set(translation.x - point.x, translation.y - point.y, 0);
    lastPoint.current.copy(point);
    lastTime.current = performance.now();
    throwVelocity.current.set(0, 0, 0);
    current.setBodyType(rapier.RigidBodyType.KinematicPositionBased, true);
    current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    setDragging(true);
    (event.target as Element | null)?.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging || !body.current) return;
    event.stopPropagation();
    const point = projectToPlane(event).add(offset.current);
    const now = performance.now();
    const elapsed = Math.max(16, now - lastTime.current) / 1000;
    throwVelocity.current.set(
      (point.x - lastPoint.current.x) / elapsed,
      (point.y - lastPoint.current.y) / elapsed,
      0,
    );
    const translation = body.current.translation();
    const next = {
      x: MathUtils.clamp(point.x, -4.7, 4.7),
      y: MathUtils.clamp(point.y, -2.6, 3.2),
      z: translation.z,
    };
    body.current.setNextKinematicTranslation(next);
    lastPoint.current.copy(point);
    lastTime.current = now;
  };

  const release = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging || !body.current) return;
    event.stopPropagation();
    body.current.setBodyType(rapier.RigidBodyType.Dynamic, true);
    body.current.setLinvel({
      x: throwVelocity.current.x * 0.16,
      y: throwVelocity.current.y * 0.16,
      z: 0,
    }, true);
    body.current.wakeUp();
    setDragging(false);
    (event.target as Element | null)?.releasePointerCapture(event.pointerId);
  };

  const reset = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!body.current) return;
    body.current.setBodyType(rapier.RigidBodyType.Dynamic, true);
    body.current.setTranslation({ x: initial[0], y: initial[1], z: initial[2] }, true);
    body.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
  };

  return (
    <RigidBody
      ref={body}
      name={id}
      position={initial}
      rotation={rotation}
      colliders={false}
      mass={1.45}
      restitution={0.16}
      friction={0.82}
      linearDamping={0.38}
      angularDamping={0.5}
      ccd
      canSleep
    >
      <CuboidCollider args={[0.49, 0.45, 0.28]} />
      <group
        scale={dragging ? 1.05 : hovered ? 1.025 : 1}
        onPointerEnter={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onDoubleClick={reset}
      >
        {children}
      </group>
    </RigidBody>
  );
}

function LavenderBlock() {
  const dots = [-0.13, 0, 0.13];
  return (
    <group>
      <RoundedBox castShadow args={[0.98, 0.9, 0.56]} radius={0.24} smoothness={8}>
        <meshPhysicalMaterial color="#c4b3eb" roughness={0.12} metalness={0.05} transmission={0.18} thickness={0.9} clearcoat={1} />
      </RoundedBox>
      {dots.flatMap((x) => dots.map((y) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.292]} scale={0.028}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#f4f0ff" emissive="#d4c7f4" emissiveIntensity={0.7} />
        </mesh>
      )))}
    </group>
  );
}

function SilverBlock() {
  return (
    <group>
      <RoundedBox castShadow args={[0.98, 0.9, 0.58]} radius={0.24} smoothness={8}>
        <meshPhysicalMaterial color="#c9c8c3" metalness={0.72} roughness={0.16} clearcoat={1} />
      </RoundedBox>
      <mesh castShadow position={[0.1, 0.03, 0.355]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.13, 64]} />
        <meshPhysicalMaterial color="#d9d8d3" metalness={0.84} roughness={0.13} clearcoat={1} />
      </mesh>
      <mesh position={[0.1, 0.03, 0.425]}>
        <circleGeometry args={[0.18, 64]} />
        <meshStandardMaterial color="#d2d1cc" metalness={0.7} roughness={0.18} />
      </mesh>
    </group>
  );
}

function CeramicBlock() {
  return (
    <group>
      <RoundedBox castShadow args={[0.98, 0.9, 0.58]} radius={0.24} smoothness={8}>
        <meshPhysicalMaterial color="#d8d0c3" metalness={0.1} roughness={0.36} clearcoat={0.5} />
      </RoundedBox>
      {[-0.19, 0, 0.19].map((y, index) => (
        <RoundedBox key={y} args={[index === 1 ? 0.5 : 0.42, 0.075, 0.055]} radius={0.035} smoothness={5} position={[-0.08, y, 0.33]}>
          <meshStandardMaterial color="#716e68" metalness={0.42} roughness={0.28} />
        </RoundedBox>
      ))}
    </group>
  );
}

function GlassBlock() {
  return (
    <group>
      <RoundedBox castShadow args={[0.96, 0.88, 0.56]} radius={0.23} smoothness={8}>
        <meshPhysicalMaterial color="#c9c8c3" metalness={0.08} roughness={0.07} transmission={0.72} thickness={0.8} ior={1.45} clearcoat={1} transparent opacity={0.82} />
      </RoundedBox>
      <RoundedBox castShadow args={[0.5, 0.46, 0.31]} radius={0.14} smoothness={7} position={[0, 0, 0.15]}>
        <meshPhysicalMaterial color="#777671" metalness={0.82} roughness={0.16} clearcoat={0.8} />
      </RoundedBox>
      {[-0.12, 0, 0.12].map((y) => (
        <RoundedBox key={y} args={[0.34, 0.045, 0.04]} radius={0.02} smoothness={4} position={[0, y, 0.33]}>
          <meshStandardMaterial color="#cecdc8" metalness={0.85} roughness={0.16} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Table() {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[3.75, 0.16, 1.35]} position={[0, -1.63, 0]} friction={0.9} />
      <mesh receiveShadow position={[0, -1.63, 0]}>
        <boxGeometry args={[7.5, 0.32, 2.7]} />
        <meshPhysicalMaterial color="#b6b2aa" metalness={0.26} roughness={0.3} clearcoat={0.35} />
      </mesh>
      <mesh position={[0, -1.45, 1.31]}>
        <boxGeometry args={[7.5, 0.04, 0.05]} />
        <meshStandardMaterial color="#89867f" metalness={0.44} roughness={0.24} />
      </mesh>
    </RigidBody>
  );
}

function PhysicsScene() {
  return (
    <Suspense fallback={null}>
      <Physics gravity={[0, -8.7, 0]} timeStep="vary" interpolate>
        <Table />
        <PhysicsBlock id="productivity" initial={[2.2, 1.87, 0]} rotation={[0, 0.02, -0.02]}><CeramicBlock /></PhysicsBlock>
        <PhysicsBlock id="ai" initial={[2.2, 0.93, 0.02]} rotation={[0, 0.03, -0.035]}><LavenderBlock /></PhysicsBlock>
        <PhysicsBlock id="mobile" initial={[2.2, -0.01, 0]} rotation={[0, -0.04, 0.025]}><SilverBlock /></PhysicsBlock>
        <PhysicsBlock id="infrastructure" initial={[2.2, -0.95, 0.02]} rotation={[0.02, 0, -0.025]}><GlassBlock /></PhysicsBlock>
      </Physics>
    </Suspense>
  );
}

function StaticCore() {
  return (
    <div className="static-core static-core-table" aria-hidden="true">
      <i className="core-form core-form-productivity" />
      <i className="core-form core-form-ai" />
      <i className="core-form core-form-mobile" />
      <i className="core-form core-form-infra" />
      <b />
    </div>
  );
}

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lowPower = (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) || navigator.hardwareConcurrency <= 2 || nav.connection?.saveData;
    return !lowPower && Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function ProductCore() {
  const reducedMotion = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setWebgl(canUseWebGL());
      setChecked(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="product-core" role="img" aria-label="Four physical product blocks stacked on a table. Drag a block to move it, then release it to gravity.">
      {!checked || reducedMotion || !webgl ? (
        <StaticCore />
      ) : (
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.55, 9.2], fov: 36 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: true }}
          fallback={<StaticCore />}
        >
          <CameraRig />
          <ambientLight intensity={0.75} />
          <directionalLight castShadow position={[4, 7, 6]} intensity={3.2} color="#fffdf7" shadow-mapSize={[1024, 1024]} />
          <Environment resolution={128} frames={1}>
            <Lightformer intensity={2.8} color="white" position={[0, 5, 4]} scale={[6, 3, 1]} />
            <Lightformer intensity={1.2} color="#b8a3ef" position={[-4, 1, 2]} scale={[2, 4, 1]} />
          </Environment>
          <PhysicsScene />
        </Canvas>
      )}
      <span className="core-caption">DRAG A BLOCK / RELEASE TO GRAVITY / DOUBLE-CLICK TO RESET</span>
    </div>
  );
}
