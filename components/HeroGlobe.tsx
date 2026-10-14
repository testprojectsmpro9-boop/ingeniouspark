import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Phases evenly spaced ~90° apart (0, π/2, π, 3π/2) so the four cards don't bunch up on one side.
// Different r values create slight depth offset so cards don't share the exact same orbit ring.
const ENTITIES = [
  { id: "nmf",     label: "NMF",         sub: "Local bridge",    color: "#10b981", r: 1.70, speed: 0.30, phase: 0,            vy: 0.20, tilt:  0.18 },
  { id: "abipir",  label: "ABIPIR",      sub: "Brazil partner",  color: "#a78bfa", r: 1.80, speed: 0.26, phase: Math.PI * 0.5, vy: 0.22, tilt: -0.14 },
  { id: "ifia-b",  label: "IFIA Bharat", sub: "National",        color: "#06b6d4", r: 1.92, speed: 0.21, phase: Math.PI,       vy: 0.25, tilt: -0.28 },
  { id: "ifia-g",  label: "IFIA Global", sub: "International",   color: "#6366f1", r: 2.10, speed: 0.17, phase: Math.PI * 1.5, vy: 0.18, tilt:  0.38 },
] as const;

type E = typeof ENTITIES[number] & { paused: boolean };

function OrbitNode({ id, label, sub, color, r, speed, phase, vy, tilt, paused }: E) {
  const gRef = useRef<THREE.Group>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const t = useRef(phase);

  useFrame((_, delta) => {
    if (!gRef.current || paused) return;
    t.current += delta * speed;
    const sinT = Math.sin(t.current);
    gRef.current.position.set(
      Math.cos(t.current) * r,
      Math.sin(t.current * vy + tilt) * 0.85,
      sinT * r,
    );
    // Depth-aware card style: sinT in [-1..1]. +1 = front (closest to camera), -1 = behind globe.
    if (cardRef.current) {
      const fade = (sinT + 1) / 2;            // 0..1
      const op = 0.08 + fade * 0.92;          // behind 0.08 → front 1.00
      const sc = 0.78 + fade * 0.22;          // behind 0.78 → front 1.00
      cardRef.current.style.opacity = op.toFixed(3);
      cardRef.current.style.transform = `scale(${sc.toFixed(3)})`;
      cardRef.current.style.zIndex = String(10 + Math.round(fade * 100));
    }
  });

  return (
    <group ref={gRef}>
      <mesh>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Html center distanceFactor={9} style={{ pointerEvents: "none", userSelect: "none" }} zIndexRange={[110, 0]}>
        {id === "nmf" ? (
          <div
            ref={cardRef}
            style={{
              boxShadow: "0 4px 14px rgba(2,11,19,0.18), 0 0 10px rgba(16,185,129,0.18)",
              transformOrigin: "center",
              willChange: "opacity, transform",
            }}
            className="min-w-[64px] rounded-xl border border-slate-200/70 bg-white/90 px-2 py-1 text-center backdrop-blur-xl md:min-w-[68px]"
          >
            <img
              src="/mnf-logo.png"
              alt="NMF"
              className="mx-auto mb-[2px] h-4 w-auto object-contain md:h-5"
            />
            <div className="text-[10px] font-bold leading-tight text-emerald-600">{label}</div>
            <div className="mt-[2px] text-[8px] leading-tight text-slate-600">{sub}</div>
          </div>
        ) : (
          <div
            ref={cardRef}
            style={{
              borderColor: color + "33",
              boxShadow: `0 0 10px ${color}18`,
              transformOrigin: "center",
              willChange: "opacity, transform",
            }}
            className="min-w-[64px] rounded-xl border bg-slate-950/68 px-2 py-1 text-center backdrop-blur-sm md:min-w-[68px]"
          >
            <div style={{ color }} className="text-[10px] font-bold leading-tight">{label}</div>
            <div className="mt-[2px] text-[8px] leading-tight text-slate-500">{sub}</div>
          </div>
        )}
      </Html>
    </group>
  );
}

function ConnectionArc({ p0, p1, p2, color, baseOp, offset }: {
  p0: [number,number,number]; p1: [number,number,number]; p2: [number,number,number];
  color: string; baseOp: number; offset: number;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const geo = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(p0[0], p0[1], p0[2]),
      new THREE.Vector3(p1[0], p1[1], p1[2]),
      new THREE.Vector3(p2[0], p2[1], p2[2]),
    );
    return new THREE.TubeGeometry(curve, 40, 0.005, 5, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useFrame(({ clock }) => {
    if (matRef.current)
      matRef.current.opacity = baseOp * (0.4 + 0.6 * Math.abs(Math.sin(clock.elapsedTime * 0.5 + offset)));
  });
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial ref={matRef} color={color} transparent opacity={baseOp} />
    </mesh>
  );
}

function EarthGlobe({ paused }: { paused: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF("/models/earth.glb");
  const { scene } = gltf;

  // Scale and center — no material work here (KHR_materials_pbrSpecularGlossiness texture needs parser)
  const earthObj = useMemo(() => {
    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const maxDim = Math.max(...box.getSize(new THREE.Vector3()).toArray()) || 1;
    const s = 3.0 / maxDim;
    const center = box.getCenter(new THREE.Vector3());
    scene.scale.setScalar(s);
    scene.position.set(-center.x * s, -center.y * s, -center.z * s);
    return scene;
  }, [scene]);

  // KHR_materials_pbrSpecularGlossiness stores diffuseTexture in the extension, not material.map.
  // Pull texture directly from the GLTF parser (index 0 = the embedded diffuse JPEG) and apply unlit.
  useEffect(() => {
    let alive = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((gltf as any).parser.getDependency("texture", 0) as Promise<THREE.Texture>)
      .then((tex) => {
        if (!alive) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          color: new THREE.Color(0xffffff),
          transparent: false,
          opacity: 1,
          toneMapped: false,
        });
        scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh) mesh.material = mat;
        });
      });
    return () => { alive = false; };
  }, [scene, gltf]);

  useFrame((_, delta) => {
    if (paused || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.07;
  });

  return (
    <group ref={groupRef}>
      <primitive object={earthObj} />
    </group>
  );
}

function GlobeScene({ paused }: { paused: boolean }) {
  const outerRef  = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (paused) return;
    if (outerRef.current)  outerRef.current.rotation.y  += delta * 0.05;
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 3, 5]}  intensity={1.6} color="#ffffff" />
      <directionalLight position={[-4, 1, -2]} intensity={0.4} color="#ffffff" />

      {/* Real Earth GLB model */}
      <EarthGlobe paused={paused} />

      {/* Subtle network wireframe overlay */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1.55, 22, 22]} />
        <meshBasicMaterial wireframe color="#06b6d4" transparent opacity={0.03} />
      </mesh>

      {/* Atmosphere inner glow */}
      <mesh>
        <sphereGeometry args={[1.62, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.045} side={THREE.BackSide} />
      </mesh>

      {/* Atmosphere outer haze */}
      <mesh>
        <sphereGeometry args={[1.78, 32, 32]} />
        <meshBasicMaterial color="#0a2040" transparent opacity={0.18} side={THREE.BackSide} />
      </mesh>

      {/* Local-to-global connection arcs */}
      <ConnectionArc
        p0={[1.2, 0.3, 0.8]}  p1={[1.8, 0.9, 1.6]}  p2={[-0.4, 0.4, 2.0]}
        color="#06b6d4" baseOp={0.32} offset={0} />
      <ConnectionArc
        p0={[1.2, 0.3, 0.8]}  p1={[0.3, 1.9, 0.2]}  p2={[-0.7, 0.6, -1.9]}
        color="#D4A017" baseOp={0.26} offset={1.4} />
      <ConnectionArc
        p0={[0.9, -0.2, 1.1]} p1={[1.6, -0.4, 2.0]} p2={[0.85, 0.1, 2.1]}
        color="#a78bfa" baseOp={0.20} offset={2.7} />

      {/* Mysuru — foundation node */}
      <Html center distanceFactor={9} position={[0, -1.95, 0]} style={{ pointerEvents: "none", userSelect: "none" }}>
        <div className="rounded-full border border-[#D4A017]/50 bg-slate-900/90 px-3 py-1.5 text-center backdrop-blur-sm">
          <div className="text-[11px] font-bold text-[#D4A017]">Mysuru</div>
          <div className="text-[9px] text-slate-400">Local base · India</div>
        </div>
      </Html>

      {ENTITIES.map((e) => (
        <OrbitNode key={e.id} {...e} paused={paused} />
      ))}
    </>
  );
}

useGLTF.preload("/models/earth.glb");

export default function HeroGlobe({ prefersReducedMotion, className }: { prefersReducedMotion: boolean | null; className?: string }) {
  return (
    <div className={className ?? "relative h-[480px] w-full"}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.6, 7.0], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <GlobeScene paused={!!prefersReducedMotion} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI * 0.2}
            maxPolarAngle={Math.PI * 0.8}
          />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white/25">
        Drag to explore
      </p>
    </div>
  );
}
