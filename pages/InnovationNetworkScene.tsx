import { Line } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const nodes = [
  { label: "Schools", position: [-1.45, 1.05, 0], color: "#2dd4bf" },
  { label: "Innovators", position: [-1.05, -1.05, 0.25], color: "#d4a017" },
  { label: "Mentors", position: [0.05, 1.15, -0.15], color: "#60a5fa" },
  { label: "Jury", position: [0.65, -1.15, 0.15], color: "#fbbf24" },
  { label: "National Network", position: [1.5, 0.58, -0.2], color: "#38bdf8" },
  { label: "International Pathway", position: [2.15, -0.85, 0.25], color: "#a78bfa" },
] as const;

function FloatingNode({
  color,
  index,
  position,
  radius = 0.13,
}: {
  color: string;
  index: number;
  position: readonly [number, number, number];
  radius?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const base = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.getElapsedTime() + index * 0.7;
    mesh.position.set(base.x, base.y + Math.sin(t * 1.15) * 0.08, base.z);
    const pulse = 1 + Math.sin(t * 1.65) * 0.16;
    mesh.scale.setScalar(pulse);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.95} roughness={0.26} />
    </mesh>
  );
}

function SignalDot({ route, prefersReducedMotion }: { route: THREE.Vector3[]; prefersReducedMotion: boolean | null }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh || route.length < 2) return;
    if (prefersReducedMotion) {
      mesh.position.copy(route[0]);
      return;
    }
    const t = (clock.getElapsedTime() * 0.42) % route.length;
    const i = Math.floor(t);
    const next = (i + 1) % route.length;
    mesh.position.lerpVectors(route[i], route[next], t - i);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.075, 24, 24]} />
      <meshStandardMaterial color="#ffffff" emissive="#fbbf24" emissiveIntensity={1.8} roughness={0.18} />
    </mesh>
  );
}

function NetworkCore({ prefersReducedMotion, mobile }: { prefersReducedMotion: boolean | null; mobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const local = useMemo(() => new THREE.Vector3(-2.15, -0.05, 0), []);
  const route = useMemo(
    () => [
      local,
      new THREE.Vector3(...nodes[0].position),
      new THREE.Vector3(...nodes[2].position),
      new THREE.Vector3(...nodes[4].position),
      new THREE.Vector3(...nodes[5].position),
      new THREE.Vector3(...nodes[3].position),
      new THREE.Vector3(...nodes[1].position),
      local,
    ],
    [local],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current || prefersReducedMotion) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.12;
    groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.045;
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]} scale={mobile ? 0.78 : 1.22}>
      <FloatingNode color="#bff7ee" index={0} position={[-2.15, -0.05, 0]} radius={0.24} />

      {nodes.map((node, index) => {
        const position = new THREE.Vector3(...node.position);
        return (
          <group key={node.label}>
            <Line
              points={[local, position]}
              color={index % 2 ? "#d4a017" : "#2dd4bf"}
              lineWidth={4}
              transparent
              opacity={0.1}
            />
            <Line
              points={[local, position]}
              color={index % 2 ? "#d4a017" : "#2dd4bf"}
              lineWidth={1.45}
              transparent
              opacity={0.62}
            />
            <FloatingNode color={node.color} index={index + 1} position={node.position} />
          </group>
        );
      })}

      <Line
        points={nodes.map((node) => new THREE.Vector3(...node.position))}
        color="#ffffff"
        lineWidth={0.65}
        transparent
        opacity={0.2}
      />
      <SignalDot route={route} prefersReducedMotion={prefersReducedMotion} />
    </group>
  );
}

export default function InnovationNetworkScene({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  // Mobile: shrink the network group ~36% and pull the camera back so the wide nodes
  // (Schools at x≈-2.15, International Pathway at x≈+2.15) sit fully inside the portrait
  // frame instead of clipping at the side edges. Desktop framing unchanged.
  const [mobile, setMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="relative min-h-[520px] overflow-hidden px-4 sm:px-0 md:min-h-[620px]">
      <div className="pointer-events-none absolute -inset-14 bg-[radial-gradient(circle_at_45%_42%,rgba(45,212,191,0.24),transparent_32%),radial-gradient(circle_at_72%_58%,rgba(212,160,23,0.16),transparent_30%)] blur-2xl" />
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, mobile ? 10.5 : 8.5], fov: mobile ? 46 : 42 }}
          dpr={[1, 1.45]}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <ambientLight intensity={0.72} />
          <pointLight position={[-3, 2, 4]} intensity={2.6} color="#2dd4bf" />
          <pointLight position={[3, -2, 3]} intensity={1.8} color="#d4a017" />
          <NetworkCore prefersReducedMotion={prefersReducedMotion} mobile={mobile} />
        </Canvas>
      </div>

      <div className="absolute inset-x-0 bottom-3 z-10 grid grid-cols-2 gap-1.5 p-2 sm:grid-cols-4">
        {["Local Community", ...nodes.map((node) => node.label)].map((label, index) => (
          <div
            key={label}
            className="rounded-full bg-white/[0.065] px-2.5 py-1.5 text-center text-[9px] font-black uppercase tracking-[0.12em] text-white/80 backdrop-blur-sm ring-1 ring-white/[0.08] sm:text-[10px]"
          >
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${index === 0 ? "bg-teal-300" : "bg-[#D4A017]"}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
