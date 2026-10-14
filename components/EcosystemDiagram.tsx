import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  prefersReducedMotion: boolean | null;
}

const NODES = [
  { id: "mysuru",      label: "Mysuru Region", sub: "Local base",     color: "#94a3b8", pos: new THREE.Vector3( 0,   -1.8,  0  ) },
  { id: "nmf",         label: "NMF",          sub: "Local bridge",   color: "#10b981", pos: new THREE.Vector3(-1.8,  0,    0.3) },
  { id: "ifia-bharat", label: "IFIA Bharat",  sub: "National",       color: "#06b6d4", pos: new THREE.Vector3( 0,    1.8,  0  ) },
  { id: "ifia-global", label: "IFIA Global",  sub: "International",  color: "#6366f1", pos: new THREE.Vector3( 1.8,  0,    0.3) },
  { id: "abipir",      label: "ABIPIR",       sub: "Brazil partner", color: "#a78bfa", pos: new THREE.Vector3( 2.0, -1.5, -0.4) },
];

const CONNS = [
  { from: "mysuru",      to: "nmf",          color: "#10b981", speed: 0.42, off: 0.00 },
  { from: "nmf",         to: "ifia-bharat",  color: "#06b6d4", speed: 0.33, off: 0.25 },
  { from: "ifia-bharat", to: "ifia-global",  color: "#6366f1", speed: 0.26, off: 0.50 },
  { from: "ifia-global", to: "abipir",       color: "#a78bfa", speed: 0.36, off: 0.75 },
  { from: "nmf",         to: "ifia-global",  color: "#6366f1", speed: 0.29, off: 0.12 },
];

// Thin cylinder drawn between two 3D points — avoids Line2 complexity
function Connection({ start, end, color }: { start: THREE.Vector3; end: THREE.Vector3; color: string }) {
  const { mid, len, quat } = useMemo(() => {
    const dir = end.clone().sub(start);
    const len = dir.length();
    const mid = start.clone().add(dir.clone().multiplyScalar(0.5));
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { mid, len, quat };
  }, [start, end]);

  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.011, 0.011, len, 4]} />
      <meshBasicMaterial color={color} transparent opacity={0.42} />
    </mesh>
  );
}

// Pulse dot traveling from → to node
function PulseDot({ from, to, color, speed, off, paused }: {
  from: THREE.Vector3; to: THREE.Vector3;
  color: string; speed: number; off: number; paused: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(off);

  useFrame((_, d) => {
    if (!ref.current || paused) return;
    t.current = (t.current + d * speed) % 1;
    ref.current.position.lerpVectors(from, to, t.current);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// Breathing ring on each node
function PulseRing({ color, paused }: { color: string; paused: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const t = useRef(Math.random() * Math.PI * 2);

  useFrame((_, d) => {
    if (paused || !meshRef.current || !matRef.current) return;
    t.current += d * 1.5;
    meshRef.current.scale.setScalar(1 + Math.sin(t.current) * 0.17);
    matRef.current.opacity = 0.28 + Math.sin(t.current) * 0.14;
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[0.23, 0.012, 8, 40]} />
      <meshBasicMaterial ref={matRef} color={color} transparent opacity={0.35} />
    </mesh>
  );
}

function Scene({ paused }: { paused: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, d) => {
    if (!groupRef.current || paused) return;
    groupRef.current.rotation.y += d * 0.05;
  });

  const nodeMap = useMemo(
    () => Object.fromEntries(NODES.map((n) => [n.id, n.pos])),
    []
  );

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 4, 4]}   intensity={0.55} color="#10b981" />
      <pointLight position={[-4, -3, -3]} intensity={0.28} color="#6366f1" />

      {/* Connection lines + pulse dots */}
      {CONNS.map((c) => {
        const s = nodeMap[c.from];
        const e = nodeMap[c.to];
        if (!s || !e) return null;
        return (
          <group key={`${c.from}-${c.to}`}>
            <Connection start={s} end={e} color={c.color} />
            <PulseDot from={s} to={e} color={c.color} speed={c.speed} off={c.off} paused={paused} />
          </group>
        );
      })}

      {/* Nodes */}
      {NODES.map((n) => (
        <group key={n.id} position={n.pos}>
          <mesh>
            <sphereGeometry args={[0.14, 18, 18]} />
            <meshBasicMaterial color={n.color} />
          </mesh>
          <PulseRing color={n.color} paused={paused} />
          <Html center distanceFactor={9} style={{ pointerEvents: "none", userSelect: "none" }}>
            <div
              style={{ borderColor: n.color + "55", boxShadow: `0 0 10px ${n.color}20` }}
              className="min-w-[72px] rounded-xl border bg-slate-950/85 px-2 py-1.5 text-center backdrop-blur-sm"
            >
              <div style={{ color: n.color }} className="text-[10px] font-bold leading-tight">{n.label}</div>
              <div className="mt-[2px] text-[8px] leading-tight text-slate-400">{n.sub}</div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

export default function EcosystemDiagram({ prefersReducedMotion }: Props) {
  return (
    <div className="h-[340px] w-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.5, 7.2], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene paused={!!prefersReducedMotion} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI * 0.15}
            maxPolarAngle={Math.PI * 0.85}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
