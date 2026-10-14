import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const STEPS = [
  { label: "Register", color: "#10b981", pos: new THREE.Vector3(-3, 0, 0) },
  { label: "Connect",  color: "#06b6d4", pos: new THREE.Vector3( 0, 0.7, 0) },
  { label: "Grow",     color: "#6366f1", pos: new THREE.Vector3( 3, 0, 0) },
];

function SplineScene({ progressRef }: { progressRef: { current: number }; paused: boolean }) {
  const dotRef  = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  const { curve, tubeGeo } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.8, 0, 0),
      ...STEPS.map((s) => s.pos),
      new THREE.Vector3(3.8, 0, 0),
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 80, 0.075, 8, false);
    return { curve, tubeGeo };
  }, []);

  useFrame(() => {
    const p = Math.min(Math.max(progressRef.current, 0), 1);
    const t = 0.04 + p * 0.92; // map scroll 0→1 to curve t 0.04→0.96

    if (dotRef.current) {
      const pt = curve.getPoint(t);
      dotRef.current.position.copy(pt);
    }
    if (trailRef.current) {
      const pt2 = curve.getPoint(Math.max(0.04, t - 0.04));
      trailRef.current.position.copy(pt2);
      (trailRef.current.material as THREE.MeshBasicMaterial).opacity = 0.45 * p;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 4, 3]} intensity={0.35} color="#10b981" />

      {/* Track tube */}
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial color="#cbd5e1" transparent opacity={0.28} />
      </mesh>

      {/* Step node spheres */}
      {STEPS.map((s, i) => (
        <group key={i} position={s.pos}>
          <mesh>
            <sphereGeometry args={[0.38, 16, 16]} />
            <meshBasicMaterial color={s.color} />
          </mesh>
          <Html center distanceFactor={10} position={[0, -0.6, 0]} style={{ pointerEvents: "none", userSelect: "none" }}>
            <div style={{ color: s.color }} className="text-[11px] font-bold text-center whitespace-nowrap">
              {s.label}
            </div>
          </Html>
        </group>
      ))}

      {/* Leading dot */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.92} />
      </mesh>

      {/* Fading trail dot */}
      <mesh ref={trailRef}>
        <sphereGeometry args={[0.10, 10, 10]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} />
      </mesh>
    </>
  );
}

interface Props {
  progressRef: { current: number };
  prefersReducedMotion: boolean | null;
}

export default function JourneySpline({ progressRef, prefersReducedMotion }: Props) {
  return (
    <div className="h-[130px] w-full">
      <Canvas
        dpr={[1, 1.2]}
        camera={{ position: [0, 1.5, 5], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SplineScene progressRef={progressRef} paused={!!prefersReducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
