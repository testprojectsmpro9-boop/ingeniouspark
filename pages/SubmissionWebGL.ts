import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const LID_OPEN = 1.85;
const LID_AXIS: "x" | "y" | "z" = "z";

// ─── GLSL ────────────────────────────────────────────────────────────────────

const PARTICLE_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aOpacity;
  varying float vOpacity;
  uniform float uScrollVel;
  void main() {
    vOpacity = aOpacity;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    float stretch = 1.0 + clamp(abs(uScrollVel) * 6.0, 0.0, 4.0);
    gl_PointSize = aSize * (260.0 / -mvPos.z) * stretch;
    gl_Position = projectionMatrix * mvPos;
  }
`;
const PARTICLE_FRAG = /* glsl */ `
  varying float vOpacity;
  uniform vec3 uColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    // Cubic falloff → crisp star point, not soft fog blob
    float a = pow(max(1.0 - d * 2.0, 0.0), 3.0) * vOpacity;
    gl_FragColor = vec4(uColor, a);
  }
`;

const ICOSA_VERT = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  void main() {
    vec3 p = position * max(uProgress, 0.001);
    p += normal * sin(uTime * 1.4 + position.x * 2.2) * 0.14 * (1.0 - uProgress);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const ICOSA_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uProgress;
  void main() {
    gl_FragColor = vec4(uColor, 0.35 * uProgress);
  }
`;


const ORB_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uGlow;
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec3 p = position;
    p += normal * sin(uTime * 2.2 + position.x * 4.0) * 0.04 * uGlow;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const ORB_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uGlow;
  varying vec3 vNormal;
  void main() {
    float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);
    vec3 gold  = vec3(0.84, 0.63, 0.09);
    vec3 white = vec3(1.0, 0.97, 0.88);
    vec3 col = mix(gold, white, rim * uGlow);
    float pulse = sin(uTime * 2.8) * 0.12 + 0.88;
    gl_FragColor = vec4(col, 0.78 * uGlow * pulse);
  }
`;

const OUTCOME_VERT = /* glsl */ `
  attribute float aOpacity;
  varying float vOpacity;
  uniform float uTime;
  void main() {
    vOpacity = aOpacity;
    vec3 p = position;
    p.y = mod(p.y + uTime * 1.6, 14.0) - 7.0;
    gl_PointSize = 5.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const OUTCOME_FRAG = /* glsl */ `
  varying float vOpacity;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    vec3 col = mix(vec3(0.84, 0.63, 0.09), vec3(1.0, 0.98, 0.94), vOpacity);
    gl_FragColor = vec4(col, smoothstep(0.5, 0.0, d) * vOpacity * 0.95);
  }
`;

// ─── Engine ──────────────────────────────────────────────────────────────────

export class SubmissionWebGL {
  // Core
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private animId = 0;
  private disposed = false;

  // Camera
  private cameraPath!: THREE.CatmullRomCurve3;
  private cameraTarget = new THREE.Vector3(0, 0, 8);
  private mouseX = 0;
  private mouseY = 0;
  private scrollVel = 0;

  // Particles (global)
  private particles!: THREE.Points;
  private particleVels!: Float32Array;
  private particleMat!: THREE.ShaderMaterial;

  // Lights
  private ambientGlow!: THREE.PointLight;

  // CH0
  private ch0Icosa!: THREE.Mesh;
  private ch0Uni!: { uProgress: { value: number }; uTime: { value: number } };

  // CH1
  private ch1Objs: THREE.Object3D[] = [];
  private ch1Mats: THREE.LineBasicMaterial[] = [];
  private ch1Idx = 0;

  // CH2
  private ch2Chest = new THREE.Group();
  private ch2LidObj: THREE.Object3D | null = null;
  private ch2GoldLight!: THREE.PointLight;
  private ch2FillLight!: THREE.PointLight;
  private ch2Papers: THREE.Mesh[] = [];
  private ch2PaperMats: THREE.MeshBasicMaterial[] = [];
  private ch2Quads: THREE.Mesh[] = [];
  private ch2QuadMats: THREE.MeshStandardMaterial[] = [];
  private ch2QuadEdgeMats: THREE.LineBasicMaterial[] = [];
  private ch2Curves: THREE.CatmullRomCurve3[] = [];
  private ch2T: number[] = [];

  // CH3
  private ch3Doc!: THREE.Mesh;
  private ch3DocMat!: THREE.MeshStandardMaterial;
  private ch3StampRing!: THREE.Mesh;
  private ch3StampMat!: THREE.MeshStandardMaterial;
  private ch3StampDisc!: THREE.Mesh;
  private ch3StampDiscMat!: THREE.MeshStandardMaterial;
  private ch3Scan!: THREE.Mesh;
  private ch3ScanMat!: THREE.MeshBasicMaterial;
  private ch3DocLight!: THREE.SpotLight;
  private ch3Confetti: THREE.Mesh[] = [];
  private ch3ConfettiVels: { vx: number; vy: number; vz: number; g: number }[] = [];
  private ch3ConfettiActive = false;
  private ch3Stamped = false;
  private ch3StampFireTime = 0;

  // CH4
  private ch4DocStack: THREE.Mesh[] = [];
  private ch4DocMats: THREE.MeshStandardMaterial[] = [];
  private ch4Laser!: THREE.Mesh;
  private ch4LaserMat!: THREE.MeshBasicMaterial;
  private ch4Torus!: THREE.Mesh;
  private ch4TorusMat!: THREE.MeshStandardMaterial;
  private ch4OutParts!: THREE.Points;
  private ch4OutMat!: THREE.ShaderMaterial;
  private ch4Spot!: THREE.SpotLight;

  // CH5
  private ch5Orb!: THREE.Mesh;
  private ch5Uni!: { uTime: { value: number }; uGlow: { value: number } };

  // Chapter state
  private curChapter = -1;

  // ── Init ─────────────────────────────────────────────────────────────────

  init(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    // Portrait/mobile: cap pixel ratio at 1.5 for perf; desktop keeps up to 2.
    const portrait = window.innerHeight > window.innerWidth;
    const dprCap = portrait ? 1.5 : 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.6;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    // No fog — it hides MeshStandardMaterial objects at distance

    // Portrait widens fov so cinematic objects (chest, seal, orb) stay framed inside narrow viewport.
    const fov = portrait ? 75 : 60;
    this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 80);
    this.camera.position.set(0, 0, 6);

    this.cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,     0,     6.0),  // CH0
      new THREE.Vector3(0.18,  0,     5.2),  // CH1
      new THREE.Vector3(-0.12, 0.15,  4.2),  // CH2
      new THREE.Vector3(0.08,  0,     5.0),  // CH3
      new THREE.Vector3(0,    -0.12,  5.0),  // CH4
      new THREE.Vector3(0,     0,     4.2),  // CH5
    ]);

    this.buildParticles();
    this.buildLights();
    this.buildCH0();
    this.buildCH1();
    this.buildCH2();
    this.buildCH3();
    this.buildCH4();
    this.buildCH5();

    // Portrait/mobile: shrink ONLY the white background line/silhouette objects (ch1Objs)
    // and bump chest scale so it stays prominent at the wider portrait fov.
    // - 35% reduction on ch1 wireframes so they stop overshooting the narrow viewport.
    // - +20% scale on chest so it doesn't feel small after fov 75° widens the framing.
    // Yellow/gold glow, prism, seal, outcome lattice, particles, CTA scene — UNTOUCHED.
    if (portrait) {
      for (const obj of this.ch1Objs) {
        obj.scale.setScalar(0.52);
      }
      this.ch2Chest.scale.setScalar(1.0);
    }

    this.applyChapterVisibility(-1);

    window.addEventListener("resize", this.onResize);
    this.loop();
  }

  // ── Build helpers ─────────────────────────────────────────────────────────

  private buildParticles(): void {
    const N = 600;
    const pos = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const ops = new Float32Array(N);
    this.particleVels = new Float32Array(N * 3);

    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      sizes[i] = Math.random() * 0.6 + 1.2;   // 1.2–1.8: reduced max size
      ops[i]   = Math.random() * 0.04 + 0.10; // 0.10–0.14: reduced max opacity
      this.particleVels[i * 3]     = (Math.random() - 0.5) * 0.0015;
      this.particleVels[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSize",    new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aOpacity", new THREE.BufferAttribute(ops, 1));

    this.particleMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0xe2f0ff) }, uScrollVel: { value: 0 } },
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geo, this.particleMat);
    this.scene.add(this.particles);
  }

  private buildLights(): void {
    this.scene.add(new THREE.AmbientLight(0x203055, 0.35));
    this.ambientGlow = new THREE.PointLight(0xd4a017, 0.20, 12);
    this.ambientGlow.position.set(0, 0, 4);
    this.scene.add(this.ambientGlow);
  }

  private buildCH0(): void {
    const geo = new THREE.IcosahedronGeometry(4, 1);
    this.ch0Uni = { uProgress: { value: 0 }, uTime: { value: 0 } };
    const mat = new THREE.ShaderMaterial({
      uniforms: { ...this.ch0Uni, uColor: { value: new THREE.Color(0xd4a017) } },
      vertexShader: ICOSA_VERT,
      fragmentShader: ICOSA_FRAG,
      wireframe: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.ch0Icosa = new THREE.Mesh(geo, mat);
    this.scene.add(this.ch0Icosa);
  }

  private buildCH1(): void {
    // Helper: make LineSegments from flat [x1,y1,z1, x2,y2,z2, ...] pairs
    const lseg = (pts: number[], m: THREE.LineBasicMaterial): THREE.LineSegments => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
      return new THREE.LineSegments(geo, m);
    };
    const lmat = (color: number) =>
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 });

    // 0 — Online Form: landscape box + form-field lines (cool blue)
    {
      const m = lmat(0xb8d4ff); this.ch1Mats.push(m);
      const grp = new THREE.Group();
      grp.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(8.5, 5.8, 0.05)), m));
      grp.add(lseg([
        -3.5, 1.4, 0.06,  3.5, 1.4, 0.06,   // field line 1
        -3.5, 0.1, 0.06,  3.5, 0.1, 0.06,   // field line 2
        -3.5,-1.2, 0.06,  3.5,-1.2, 0.06,   // field line 3
        -1.5,-2.3, 0.06,  1.5,-2.3, 0.06,   // submit button line
      ], m));
      grp.position.z = 0; this.ch1Objs.push(grp); this.scene.add(grp);
    }

    // 1 — PDF: tall portrait + title + body lines + dogear corner (warm cream)
    {
      const m = lmat(0xf5e6c8); this.ch1Mats.push(m);
      const grp = new THREE.Group();
      grp.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5.5, 8.0, 0.05)), m));
      grp.add(lseg([
        -2.0, 3.0, 0.06,  2.0, 3.0, 0.06,   // title
        -2.2, 1.8, 0.06,  2.2, 1.8, 0.06,   // body
        -2.2, 1.0, 0.06,  2.2, 1.0, 0.06,
        -2.2, 0.2, 0.06,  2.2, 0.2, 0.06,
        -2.2,-0.6, 0.06,  2.2,-0.6, 0.06,
         1.8, 3.9, 0.06,  2.75,3.0, 0.06,   // dogear fold line
      ], m));
      grp.position.z = 0; grp.rotation.z = 0.04;
      this.ch1Objs.push(grp); this.scene.add(grp);
    }

    // 2 — Letter: paper sheet + ruled lines (neutral white)
    {
      const m = lmat(0xe8e8e8); this.ch1Mats.push(m);
      const grp = new THREE.Group();
      grp.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(6.5, 8.5, 0.05)), m));
      grp.add(lseg([
        -2.5, 2.8, 0.06,  2.5, 2.8, 0.06,
        -2.5, 1.8, 0.06,  2.5, 1.8, 0.06,
        -2.5, 0.8, 0.06,  2.5, 0.8, 0.06,
        -2.5,-0.2, 0.06,  2.5,-0.2, 0.06,
        -2.5,-1.2, 0.06,  2.5,-1.2, 0.06,
        -2.5,-2.2, 0.06,  2.5,-2.2, 0.06,
      ], m));
      grp.position.z = 0; grp.rotation.z = -0.03;
      this.ch1Objs.push(grp); this.scene.add(grp);
    }

    // 3 — Sketch: icosahedron wireframe + gestural strokes (warm amber)
    {
      const m = lmat(0xc9a84c); this.ch1Mats.push(m);
      const grp = new THREE.Group();
      grp.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(4.0, 0)), m));
      grp.add(lseg([
        -2.2, 0.4, 0.06, -0.8,-0.9, 0.06,
        -0.8,-0.9, 0.06,  0.6, 1.0, 0.06,
         0.6, 1.0, 0.06,  2.0,-0.4, 0.06,
      ], m));
      grp.position.z = 0; this.ch1Objs.push(grp); this.scene.add(grp);
    }

    // 4 — Photo: square outer frame + polaroid inner border (soft silver, tilted)
    {
      const m = lmat(0xd0cfc8); this.ch1Mats.push(m);
      const grp = new THREE.Group();
      grp.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(7.2, 7.2, 0.05)), m));
      grp.add(lseg([
        -2.9, 2.7, 0.06,  2.9, 2.7, 0.06,   // inner top
         2.9, 2.7, 0.06,  2.9,-2.0, 0.06,   // inner right
         2.9,-2.0, 0.06, -2.9,-2.0, 0.06,   // inner bottom
        -2.9,-2.0, 0.06, -2.9, 2.7, 0.06,   // inner left
        -2.9,-2.0, 0.06,  2.9,-2.0, 0.06,   // polaroid strip divider
        -2.9,-3.1, 0.06,  2.9,-3.1, 0.06,
      ], m));
      grp.position.z = 0; grp.rotation.z = 0.08;
      this.ch1Objs.push(grp); this.scene.add(grp);
    }

    // 5 — Film/Audio: widescreen frame + waveform bars (cyan-teal)
    {
      const m = lmat(0x5dc9c0); this.ch1Mats.push(m);
      const grp = new THREE.Group();
      grp.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(8.5, 4.8, 0.05)), m));
      const wavePts: number[] = [];
      for (let j = 0; j < 10; j++) {
        const x = -4.0 + j * 0.88;
        const amp = Math.sin(j * 1.1) * 0.85;
        wavePts.push(x, -3.2, 0.06, x + 0.6, -3.2 + amp, 0.06);
      }
      grp.add(lseg(wavePts, m));
      grp.position.z = 0; this.ch1Objs.push(grp); this.scene.add(grp);
    }

    // 6 — Admin intake: wide flat tray + tray dividers (clinical blue)
    {
      const m = lmat(0x7ab8e8); this.ch1Mats.push(m);
      const grp = new THREE.Group();
      grp.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(10.0, 2.5, 4.5)), m));
      grp.add(lseg([
        -2.5, 1.25, 0.06, -2.5,-1.25, 0.06,  // divider 1
         2.5, 1.25, 0.06,  2.5,-1.25, 0.06,  // divider 2
      ], m));
      grp.position.z = 0; this.ch1Objs.push(grp); this.scene.add(grp);
    }
  }

  private buildCH2(): void {
    // Warm key light from above/front — controlled by lid opening
    this.ch2GoldLight = new THREE.PointLight(0xffd38a, 0.45, 10);
    this.ch2GoldLight.position.set(0.6, 2.8, 3.0);
    this.scene.add(this.ch2GoldLight);

    // Soft front fill so the chest body is visible at low brightness
    this.ch2FillLight = new THREE.PointLight(0xe8f0ff, 1.15, 8);
    this.ch2FillLight.position.set(-1.8, 0.9, 3.8);
    this.scene.add(this.ch2FillLight);

    // Paper texture: warm cream + ruled lines + red margin
    const paperCanvas = document.createElement('canvas');
    paperCanvas.width = 128; paperCanvas.height = 170;
    const ctx = paperCanvas.getContext('2d')!;
    ctx.fillStyle = '#fffcf0';
    ctx.fillRect(0, 0, 128, 170);
    ctx.strokeStyle = 'rgba(180,160,120,0.4)';
    ctx.lineWidth = 1;
    for (let y = 20; y < 170; y += 14) {
      ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(128, y); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(200,150,100,0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(18, 170); ctx.stroke();
    const paperTex = new THREE.CanvasTexture(paperCanvas);

    // 5 doc quads orbit from outside and converge toward chest mouth
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const r = 1.9 + Math.random() * 0.6;
      const qGeo = new THREE.PlaneGeometry(0.28, 0.38);
      const mat = new THREE.MeshStandardMaterial({
        map: paperTex, color: 0xfffef0,
        emissive: new THREE.Color(0xfffef0), emissiveIntensity: 0.12,
        transparent: true, opacity: 0, side: THREE.DoubleSide,
      });
      const q = new THREE.Mesh(qGeo, mat);
      this.ch2Quads.push(q);
      this.ch2QuadMats.push(mat);
      this.ch2T.push(0);
      this.ch2Curves.push(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, Math.random() * 2 + 1),
          new THREE.Vector3(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, 0.5),
          new THREE.Vector3((Math.random() - 0.5) * 0.3, -0.2, 0),
        ])
      );
      this.scene.add(q);
      const edgesMat = new THREE.LineBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0 });
      q.add(new THREE.LineSegments(new THREE.EdgesGeometry(qGeo), edgesMat));
      this.ch2QuadEdgeMats.push(edgesMat);
    }

    // Chest group — added to scene, GLB loaded into it async.
    // Load on ALL viewports including mobile so the chest is visible during Chapter 2 intake
    // on phones too. Mobile dpr is capped at 1.5 inside init() to keep this affordable.
    this.scene.add(this.ch2Chest);

    {
      const loader = new GLTFLoader();
      loader.load(
        '/models/wooden_chest_rigged.glb',
        (gltf) => {
          if (this.disposed) return;
          // Scale to 2.6 units tall — full chest visible in isometric view
          const rawBox = new THREE.Box3().setFromObject(gltf.scene);
          const rawH = rawBox.max.y - rawBox.min.y;
          const scale = 2.6 / Math.max(rawH, 0.001);
          gltf.scene.scale.setScalar(scale);
          // Center and seat near origin — pull down slightly so full chest in frame
          const center = new THREE.Vector3();
          new THREE.Box3().setFromObject(gltf.scene).getCenter(center);
          gltf.scene.position.sub(center);
          gltf.scene.position.y -= 0.4;
          // Preserve original texture with a controlled visibility boost.
          gltf.scene.traverse((obj: any) => {
            if (obj.isMesh && obj.material) {
              const materials = Array.isArray(obj.material) ? obj.material : [obj.material];

              for (const material of materials) {
                // Preserve the original GLB texture atlas.
                // The model already contains wood + metal colors inside one texture.
                material.color = new THREE.Color(0xffffff);

                // Very small warm lift only for low-brightness visibility.
                // Do not make the whole chest glow gold/orange.
                material.emissive = new THREE.Color(0x120804);
                material.emissiveIntensity = 0.08;

                // Keep surface readable without killing the original texture.
                material.roughness = 0.62;
                material.metalness = 0.22;

                material.needsUpdate = true;
              }
            }
          });
          // Wire exact lid bone by name
          gltf.scene.traverse((obj: any) => {
            if (obj.name === 'Lid_Armature_WoodenChest') {
              this.ch2LidObj = obj;
            }
          });
          this.ch2Chest.add(gltf.scene);

          // Use the real GLB bone directly — no fake geometry overlay
        },
        undefined,
        // Silent failure in production; surface to console in dev only.
        (err) => { if (import.meta.env.DEV) console.error('[CH2] GLB load error:', err); },
      );
    }
  }

  private buildCH3(): void {
    // A4 document canvas texture
    const docCanvas = document.createElement('canvas');
    docCanvas.width = 420; docCanvas.height = 594;
    const dctx = docCanvas.getContext('2d')!;
    dctx.fillStyle = '#f5efe0';
    dctx.fillRect(0, 0, 420, 594);
    dctx.fillStyle = '#1a2040';
    dctx.fillRect(0, 0, 420, 60);
    dctx.fillStyle = '#d4a017';
    dctx.font = 'bold 18px monospace';
    dctx.fillText('NMF × IFIA', 20, 36);
    dctx.fillStyle = '#ffffff';
    dctx.font = '9px monospace';
    dctx.fillText('INNOVATION FUND  |  APPLICATION INTAKE', 20, 52);
    dctx.strokeStyle = '#cc4444';
    dctx.lineWidth = 1.5;
    dctx.beginPath(); dctx.moveTo(20, 60); dctx.lineTo(20, 594); dctx.stroke();
    const fieldLabels = ['APPLICANT NAME','IDEA TITLE','CATEGORY','DESCRIPTION','CONTACT','CONSENT','SIGNATURE','DATE','REFERENCE','STATUS'];
    dctx.strokeStyle = '#c8b090';
    dctx.lineWidth = 1;
    for (let fi = 0; fi < fieldLabels.length; fi++) {
      const fy = 100 + fi * 46;
      dctx.beginPath(); dctx.moveTo(30, fy); dctx.lineTo(396, fy); dctx.stroke();
      dctx.fillStyle = '#8a7a60';
      dctx.font = '7px monospace';
      dctx.fillText(fieldLabels[fi], 30, fy - 7);
    }
    dctx.fillStyle = '#1a2040';
    dctx.font = 'bold 11px monospace';
    dctx.fillText('APPLICATION ID: NMF-2025-XXXXXX', 30, 568);
    const docTex = new THREE.CanvasTexture(docCanvas);

    // Main A4 plane
    this.ch3DocMat = new THREE.MeshStandardMaterial({
      map: docTex, color: 0xffffff, emissiveIntensity: 0,
      transparent: true, opacity: 0, side: THREE.DoubleSide,
    });
    this.ch3Doc = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.97), this.ch3DocMat);
    this.ch3Doc.position.y = 6;
    this.scene.add(this.ch3Doc);

    // Folded corner highlight (bottom-right)
    const cornerGeo = new THREE.BufferGeometry();
    const cv = new Float32Array([
      1.05 - 0.26, -1.485,        0.002,
      1.05,        -1.485 + 0.26, 0.002,
      1.05,        -1.485,        0.002,
    ]);
    cornerGeo.setAttribute('position', new THREE.BufferAttribute(cv, 3));
    const cornerMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    this.ch3Doc.add(new THREE.Mesh(cornerGeo, cornerMat));

    // Gold stamp ring — child of doc, elastic 3.5→1.0 on stamp
    this.ch3StampMat = new THREE.MeshStandardMaterial({
      color: 0xd4a017, emissive: 0xd4a017, emissiveIntensity: 0.6,
      transparent: true, opacity: 0,
    });
    this.ch3StampRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.03, 8, 64), this.ch3StampMat);
    this.ch3StampRing.scale.setScalar(3.5);
    this.ch3Doc.add(this.ch3StampRing);

    // Stamp disc with "RECEIVED" text
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 256; sCanvas.height = 256;
    const sctx = sCanvas.getContext('2d')!;
    sctx.clearRect(0, 0, 256, 256);
    sctx.strokeStyle = '#d4a017';
    sctx.lineWidth = 3;
    sctx.beginPath(); sctx.arc(128, 128, 110, 0, Math.PI * 2); sctx.stroke();
    sctx.fillStyle = '#d4a017';
    sctx.font = 'bold 26px monospace';
    sctx.textAlign = 'center';
    sctx.fillText('RECEIVED', 128, 132);
    sctx.font = '10px monospace';
    sctx.fillText('NMF INNOVATION FUND', 128, 158);
    const stampTex = new THREE.CanvasTexture(sCanvas);
    this.ch3StampDiscMat = new THREE.MeshStandardMaterial({
      map: stampTex, color: 0xffffff, emissiveIntensity: 0,
      transparent: true, opacity: 0, side: THREE.DoubleSide,
    });
    this.ch3StampDisc = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), this.ch3StampDiscMat);
    this.ch3Doc.add(this.ch3StampDisc);

    // Scan sweep line
    const scanGeo = new THREE.PlaneGeometry(4.2, 0.022);
    this.ch3ScanMat = new THREE.MeshBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0 });
    this.ch3Scan = new THREE.Mesh(scanGeo, this.ch3ScanMat);
    this.ch3Scan.position.y = 1.8;
    this.scene.add(this.ch3Scan);

    // Spotlight from above
    this.ch3DocLight = new THREE.SpotLight(0xfff5d0, 0, 14, Math.PI / 5, 0.4, 1);
    this.ch3DocLight.position.set(0, 6, 2);
    this.scene.add(this.ch3DocLight);
    this.scene.add(this.ch3DocLight.target);

    // Confetti (200 particles)
    for (let i = 0; i < 200; i++) {
      const cGeo = new THREE.PlaneGeometry(0.07, 0.07);
      const cMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.78 + Math.random() * 0.22, 0.55 + Math.random() * 0.3, Math.random() * 0.15),
        transparent: true, opacity: 0, side: THREE.DoubleSide,
      });
      const c = new THREE.Mesh(cGeo, cMat);
      c.position.set((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3);
      this.ch3Confetti.push(c);
      this.ch3ConfettiVels.push({
        vx: (Math.random() - 0.5) * 0.07,
        vy: Math.random() * 0.09 + 0.025,
        vz: (Math.random() - 0.5) * 0.04,
        g: 0.003 + Math.random() * 0.002,
      });
      this.scene.add(c);
    }
  }

  private buildCH4(): void {
    // Document stack — INTAKE (10 planes)
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xe0b030, emissive: 0xd4a017, emissiveIntensity: 0.48,
        transparent: true, opacity: 0, side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.85), mat);
      mesh.position.set((i - 5) * 0.11, -7 + i * 0.1, -i * 0.07);
      mesh.rotation.z = (i - 5) * 0.035;
      this.ch4DocStack.push(mesh);
      this.ch4DocMats.push(mat);
      this.scene.add(mesh);
    }

    // Red/amber laser scan
    this.ch4LaserMat = new THREE.MeshBasicMaterial({ color: 0xff4422, transparent: true, opacity: 0 });
    this.ch4Laser = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 0.028), this.ch4LaserMat);
    this.scene.add(this.ch4Laser);

    // REVIEW thin torus ring
    this.ch4TorusMat = new THREE.MeshStandardMaterial({
      color: 0x4488ff, emissive: 0x2244cc, emissiveIntensity: 0.6,
      transparent: true, opacity: 0,
    });
    this.ch4Torus = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.038, 8, 80), this.ch4TorusMat);
    this.scene.add(this.ch4Torus);

    // OUTCOME rising particles (500)
    const N = 500;
    const pos = new Float32Array(N * 3);
    const ops = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = Math.random() * -14 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      ops[i] = Math.random() * 0.19 + 0.10;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("aOpacity", new THREE.BufferAttribute(ops, 1));
    this.ch4OutMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: OUTCOME_VERT,
      fragmentShader: OUTCOME_FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.ch4OutParts = new THREE.Points(pGeo, this.ch4OutMat);
    this.scene.add(this.ch4OutParts);

    // OUTCOME spotlight from above
    this.ch4Spot = new THREE.SpotLight(0xfff8e0, 0, 18, Math.PI / 6, 0.5, 1);
    this.ch4Spot.position.set(0, 9, 2);
    this.scene.add(this.ch4Spot);
    this.scene.add(this.ch4Spot.target);
  }

  private buildCH5(): void {
    this.ch5Uni = { uTime: { value: 0 }, uGlow: { value: 0 } };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.ch5Uni,
      vertexShader: ORB_VERT,
      fragmentShader: ORB_FRAG,
      transparent: true, depthWrite: false,
    });
    this.ch5Orb = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), mat);
    this.scene.add(this.ch5Orb);
  }

  // ── Chapter visibility ────────────────────────────────────────────────────

  private applyChapterVisibility(ch: number): void {
    this.ch0Icosa.visible = ch === 0;

    for (const o of this.ch1Objs) o.visible = ch === 1;

    this.ch2Chest.visible = ch === 2;
    this.ch2GoldLight.visible = ch === 2;
    this.ch2FillLight.visible = ch === 2;
    for (const q of this.ch2Quads) q.visible = ch === 2;
    if (ch !== 2) {
      for (const p of this.ch2Papers) { p.visible = false; }
      const rotObj = this.ch2LidObj;
      if (rotObj) {
        rotObj.rotation[LID_AXIS] = 0;
        rotObj.matrixWorldNeedsUpdate = true;
      }
      for (const m of this.ch2PaperMats) m.opacity = 0;
    }

    this.ch3Doc.visible = ch === 3;
    this.ch3Scan.visible = ch === 3;
    this.ch3DocLight.visible = ch === 3;
    for (const c of this.ch3Confetti) c.visible = ch === 3;
    if (ch !== 3) {
      this.ch3StampMat.opacity = 0;
      this.ch3StampDiscMat.opacity = 0;
      this.ch3StampRing.scale.setScalar(3.5);
    }

    for (const d of this.ch4DocStack) d.visible = ch === 4;
    this.ch4Laser.visible   = ch === 4;
    this.ch4Torus.visible   = ch === 4;
    this.ch4OutParts.visible = ch === 4;
    this.ch4Spot.visible    = ch === 4;

    this.ch5Orb.visible = ch === 5;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  setChapter(ch: number): void {
    this.curChapter = ch;
    this.applyChapterVisibility(ch);

    // Give icosahedron a minimum initial visibility when entering CH0
    if (ch === 0 && this.ch0Uni.uProgress.value < 0.1) {
      this.ch0Uni.uProgress.value = 0.1;
    }

    if (ch === 3 && !this.ch3Stamped) {
      this.ch3DocMat.opacity = 0;
      this.ch3Doc.position.y = 6;
      this.ch3Stamped = false;
    }
    if (ch !== 3) { this.ch3Stamped = false; this.ch3ConfettiActive = false; }

    // Glow color per chapter
    // CH0=gold(idea), CH1=cool-lavender(formats), CH2=deep-blue(one door), CH3=bright-gold(stamp), CH4=blue(process), CH5=warm-gold(done)
    const glowColors = [0xd4a017, 0x8899cc, 0x223388, 0xe0b030, 0x2244aa, 0xffcc44];
    if (ch >= 0 && ch < glowColors.length) this.ambientGlow.color.setHex(glowColors[ch]);

    // Camera target via path
    const t = ch >= 0 ? ch / 5 : 0;
    this.cameraTarget.copy(this.cameraPath.getPoint(Math.min(t, 1)));
    // Ch2: isometric angle — see lid top + front + left side
    if (ch === 2) this.cameraTarget.set(-1.2, 2.8, 7.5);
  }

  setChapterProgress(ch: number, progress: number): void {
    if (ch === 0) {
      this.ch0Uni.uProgress.value = Math.min(progress * 2.2, 1.0);
    }

    if (ch === 1) {
      const idx = Math.min(Math.floor(progress * 7.5), 6);
      if (idx !== this.ch1Idx) {
        if (this.ch1Mats[this.ch1Idx]) this.ch1Mats[this.ch1Idx].opacity = 0;
        this.ch1Idx = idx;
      }
      if (this.ch1Mats[this.ch1Idx]) this.ch1Mats[this.ch1Idx].opacity = 0.65;
    }

    if (ch === 2) {
      // Lid rotation: hinge opens upward on the configured local axis.
      let targetAngle = 0;
      if (progress >= 0.88) {
        targetAngle = 0; // fully closed
      } else if (progress >= 0.72) {
        targetAngle = (1 - (progress - 0.72) / 0.16) * LID_OPEN; // closing
      } else if (progress >= 0.10) {
        targetAngle = LID_OPEN; // fully open
      } else {
        targetAngle = (progress / 0.10) * LID_OPEN; // opening
      }
      const rotObj = this.ch2LidObj;
      if (rotObj) {
        rotObj.rotation[LID_AXIS] = targetAngle;
        rotObj.matrixWorldNeedsUpdate = true;
      }

      // Gold light brightens as lid opens
      const lidPct = progress < 0.12 ? 0 : Math.min(progress / 0.12, 1.0);
      this.ch2GoldLight.intensity = 0.55 + lidPct * 2.0;

      // Doc quads orbit toward chest mouth
      for (let i = 0; i < this.ch2Quads.length; i++) {
        const t = Math.min(progress * 1.4 + i * 0.07, 1.0);
        this.ch2T[i] = t;
        const pt = this.ch2Curves[i].getPoint(t);
        this.ch2Quads[i].position.copy(pt);
        const qOp = t > 0.88 ? (1 - t) * 8 : 1;
        this.ch2QuadMats[i].opacity = qOp;
        if (this.ch2QuadEdgeMats[i]) this.ch2QuadEdgeMats[i].opacity = qOp * 0.65;
      }
    }

    if (ch === 3) {
      // Fade document in
      this.ch3DocMat.opacity = Math.min(progress * 5, 1.0);
      // Fly-in: descend from y=6 to y=0.2 before stamp fires
      if (!this.ch3Stamped) {
        const flyProg = Math.min(progress / 0.18, 1.0);
        this.ch3Doc.position.y = 6 - flyProg * 5.8;
      }
      // Stamp triggers once early in the scene
      if (progress > 0.18 && !this.ch3Stamped) {
        this.ch3Stamped = true;
        this.triggerStamp();
      }
      // Scan sweeps through document vertically
      this.ch3Scan.position.y = 1.8 - progress * 4.5;
      this.ch3ScanMat.opacity = progress > 0.22 && progress < 0.72 ? 0.7 : 0;
    }

    if (ch === 4) {
      // Shift ambient glow color per phase for distinct moods
      if (progress < 0.33)       this.ambientGlow.color.setHex(0xc08820); // INTAKE — warm amber/document
      else if (progress < 0.66)  this.ambientGlow.color.setHex(0x1144aa); // REVIEW — cool blue scan
      else                       this.ambientGlow.color.setHex(0xd4a017); // OUTCOME — warm gold

      if (progress < 0.33) {
        // INTAKE phase
        const p = progress / 0.33;
        for (let i = 0; i < this.ch4DocStack.length; i++) {
          this.ch4DocMats[i].opacity = Math.min(p * 2.5, 0.28);
          this.ch4DocStack[i].position.y = -7 + i * 0.1 + p * 5;
        }
        this.ch4Laser.position.y = -2.5 + p * 5;
        this.ch4LaserMat.opacity = Math.min(p * 1.8, 0.58);
        this.ch4TorusMat.opacity = 0;
        this.ch4OutParts.visible = false;
        this.ch4Spot.intensity = 0;
      } else if (progress < 0.66) {
        // REVIEW phase
        const p = (progress - 0.33) / 0.33;
        for (const m of this.ch4DocMats) m.opacity = (1 - p) * 0.28;
        this.ch4LaserMat.opacity = (1 - p) * 0.58;
        this.ch4TorusMat.opacity = Math.min(p * 2.2, 0.78);
        this.ch4Torus.rotation.z = p * Math.PI * 1.5;
        this.ch4OutParts.visible = false;
        this.ch4Spot.intensity = 0;
      } else {
        // OUTCOME phase
        const p = (progress - 0.66) / 0.34;
        this.ch4TorusMat.opacity = Math.max(0, (1 - p * 2.2) * 0.78);
        this.ch4LaserMat.opacity = 0;
        this.ch4OutParts.visible = true;
        this.ch4Spot.intensity = Math.min(p * 3.2, 3.2);
      }
    }

    if (ch === 5) {
      this.ch5Uni.uGlow.value = Math.min(progress * 3.0, 1.0);
    }
  }

  setCameraProgress(p: number): void {
    const pt = this.cameraPath.getPoint(Math.min(p, 1));
    this.cameraTarget.copy(pt);
  }

  setMouse(nx: number, ny: number): void {
    this.mouseX = nx; // −1..1
    this.mouseY = ny;
  }

  setScrollVelocity(v: number): void {
    this.scrollVel = v;
  }

  triggerStamp(): void {
    this.ch3StampFireTime = this.clock.getElapsedTime();
    this.ch3StampMat.opacity = 1;
    this.ch3StampDiscMat.opacity = 1;
    // Camera shake
    this.shakeCamera(0.07, 320);
    // Confetti burst
    this.ch3ConfettiActive = true;
    for (let i = 0; i < this.ch3Confetti.length; i++) {
      const v = this.ch3ConfettiVels[i];
      this.ch3Confetti[i].position.set(
        (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 0.25,
      );
      v.vy = Math.random() * 0.09 + 0.025;
      (this.ch3Confetti[i].material as THREE.MeshBasicMaterial).opacity = 1;
    }
    // Brief gold burst — contained
    this.ambientGlow.intensity = 1.5;
  }

  private shakeCamera(strength: number, duration: number): void {
    const base = this.camera.position.clone();
    const end = Date.now() + duration;
    const tick = () => {
      const now = Date.now();
      if (now >= end || this.disposed) {
        this.camera.position.copy(base);
        return;
      }
      const decay = (end - now) / duration;
      this.camera.position.x = base.x + (Math.random() - 0.5) * strength * decay;
      this.camera.position.y = base.y + (Math.random() - 0.5) * strength * decay;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ── Animation loop ────────────────────────────────────────────────────────

  private loop = (): void => {
    if (this.disposed) return;
    this.animId = requestAnimationFrame(this.loop);

    const dt    = Math.min(this.clock.getDelta(), 0.025);
    const elapsed = this.clock.getElapsedTime();

    // Smooth camera toward target + mouse parallax
    this.camera.position.x += (this.cameraTarget.x + this.mouseX * 0.28 - this.camera.position.x) * 0.04;
    this.camera.position.y += (this.cameraTarget.y - this.mouseY * 0.18 - this.camera.position.y) * 0.04;
    this.camera.position.z += (this.cameraTarget.z - this.camera.position.z) * 0.04;

    // Scroll velocity → particle mat
    this.particleMat.uniforms.uScrollVel.value += (this.scrollVel - this.particleMat.uniforms.uScrollVel.value) * 0.12;
    this.scrollVel *= 0.88;

    // Drift particles
    const pos = this.particles.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i) + this.particleVels[i * 3]     + this.mouseX * 0.0003;
      let y = pos.getY(i) + this.particleVels[i * 3 + 1] - this.scrollVel * 0.008;
      const z = pos.getZ(i);
      if (x >  11) x = -11; else if (x < -11) x = 11;
      if (y >   9) y = -9;  else if (y <  -9) y =  9;
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;

    // Ambient glow breathe — restrained
    const base = this.curChapter === 3 ? 1.0 : 0.30;
    this.ambientGlow.intensity += (base - this.ambientGlow.intensity) * 0.04;
    this.ambientGlow.intensity += Math.sin(elapsed * 0.9) * 0.08;

    // Per-chapter updates
    if (this.curChapter === 0 && this.ch0Icosa.visible) {
      this.ch0Icosa.rotation.y += dt * 0.11;
      this.ch0Icosa.rotation.x += dt * 0.065;
      this.ch0Uni.uTime.value = elapsed;
    }

    if (this.curChapter === 1) {
      const obj = this.ch1Objs[this.ch1Idx];
      if (obj) {
        obj.rotation.y = Math.sin(elapsed * 0.45) * 0.28;
        obj.rotation.x = Math.sin(elapsed * 0.28) * 0.14;
        obj.position.y = Math.sin(elapsed * 0.72) * 0.12;
      }
    }

    if (this.curChapter === 2) {
      if (this.ch2Chest.visible) {
        this.ch2Chest.rotation.y = Math.sin(elapsed * 0.22) * 0.04;
      }
      this.camera.lookAt(0, 0.5, 0);
    }

    if (this.curChapter === 3 && this.ch3Doc.visible) {
      // Float after stamp lands
      if (this.ch3Stamped) {
        this.ch3Doc.position.y = 0.2 + Math.sin(elapsed * 0.7) * 0.06;
        this.ch3Doc.rotation.z = Math.sin(elapsed * 0.45) * 0.015;
      }

      // Elastic stamp scale animation
      if (this.ch3Stamped && this.ch3StampFireTime > 0) {
        const t = elapsed - this.ch3StampFireTime;
        if (t < 2.5) {
          const s = 1.0 + 2.5 * Math.exp(-4.5 * t) * Math.abs(Math.cos(10 * t));
          this.ch3StampRing.scale.setScalar(s);
          this.ch3StampMat.emissiveIntensity = Math.max(0.6, 2.5 - t * 3.8);
        } else {
          this.ch3StampRing.scale.setScalar(1.0);
          this.ch3StampMat.emissiveIntensity = 0.6;
        }
        this.ch3DocLight.intensity = Math.min((elapsed - this.ch3StampFireTime) / 0.4, 1.0) * 1.5;
      }

      if (this.ch3ConfettiActive) {
        for (let i = 0; i < this.ch3Confetti.length; i++) {
          const c = this.ch3Confetti[i];
          const v = this.ch3ConfettiVels[i];
          c.position.x += v.vx;
          c.position.y += v.vy;
          c.position.z += v.vz;
          v.vy -= v.g;
          c.rotation.x += 0.06;
          c.rotation.z += 0.04;
          const mat = c.material as THREE.MeshBasicMaterial;
          if (c.position.y < -2.5) mat.opacity = Math.max(0, mat.opacity - 0.018);
        }
      }
    }

    if (this.curChapter === 4) {
      if (this.ch4OutParts.visible) this.ch4OutMat.uniforms.uTime.value += dt;
      if (this.ch4Torus.visible) this.ch4Torus.rotation.z += dt * 0.28;
    }

    if (this.curChapter === 5 && this.ch5Orb.visible) {
      this.ch5Uni.uTime.value = elapsed;
    }

    this.renderer.render(this.scene, this.camera);
  };

  // ── Cleanup ───────────────────────────────────────────────────────────────

  private onResize = (): void => {
    const portrait = window.innerHeight > window.innerWidth;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    // Re-apply portrait-aware fov so an orientation flip reframes the scene correctly.
    this.camera.fov = portrait ? 75 : 60;
    this.camera.updateProjectionMatrix();
    const dprCap = portrait ? 1.5 : 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Re-apply portrait-only ch1 line-object scale + chest bump on orientation flip.
    const target = portrait ? 0.52 : 1;
    for (const obj of this.ch1Objs) {
      obj.scale.setScalar(target);
    }
    this.ch2Chest.scale.setScalar(portrait ? 1.05 : 1);
  };

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.animId);
    window.removeEventListener("resize", this.onResize);
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
    this.renderer.dispose();
  }
}
