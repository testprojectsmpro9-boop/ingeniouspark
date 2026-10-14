import * as THREE from "three";

const SCENE_COUNT = 8;
const SCENE_NAMES = [
  "scene0Hero",
  "scene1Gateway",
  "scene2Lanes",
  "scene3Journey",
  "scene4Audience",
  "scene5Ecosystem",
  "scene6TwoPaths",
  "scene7FinalCTA",
];

// Phase A — foundation engine only.
// Base WebGL stage: renderer, camera path, starfield, nebula, hero orbit rings,
// and empty placeholder scene groups. Complex per-scene objects are Phase B/C.
export class HomepageWebGL {
  private canvas: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private animId = 0;
  private disposed = false;

  // Camera
  private cameraPath!: THREE.CatmullRomCurve3;
  private cameraTarget = new THREE.Vector3(0, 0.5, 7);
  private mouseX = 0;
  private mouseY = 0;
  private scrollVel = 0;
  private reducedMotion = false;

  // Foundation objects
  private starfield!: THREE.Points;
  private starMat!: THREE.PointsMaterial;
  private nebulae: THREE.Mesh[] = [];
  private heroRings: THREE.Line[] = [];
  private heroRingMats: THREE.LineBasicMaterial[] = [];
  private heroRingBaseOp: number[] = [];

  // Scene 0 — orbit signal particles + atmosphere shell
  private orbitParticles!: THREE.InstancedMesh;
  private orbitMat!: THREE.MeshBasicMaterial;
  private orbitDummy = new THREE.Object3D();
  private orbitParams: { fx: number; fy: number; fz: number; rx: number; ry: number; rz: number; ph: number; pulse: number }[] = [];
  private heroShell!: THREE.Mesh;
  private heroShellMat!: THREE.MeshBasicMaterial;

  // Scene 1 — gateway corridor
  private gatewayArch!: THREE.Mesh;
  private gatewayArchMat!: THREE.MeshBasicMaterial;
  private flowParticles!: THREE.Points;
  private flowMat!: THREE.PointsMaterial;
  private flowCurve!: THREE.CatmullRomCurve3;
  private flowT: number[] = [];
  private stageDots: THREE.Mesh[] = [];
  private stageDotMats: THREE.MeshBasicMaterial[] = [];
  private stageRings: THREE.Mesh[] = [];
  private stageRingMats: THREE.MeshBasicMaterial[] = [];
  private gridMats: THREE.MeshBasicMaterial[] = [];
  private readonly stageThresholds = [0.1, 0.25, 0.45, 0.65, 0.82];

  // Scene 2 — action lanes
  private laneBeams: THREE.Mesh[] = [];
  private laneBeamMats: THREE.MeshBasicMaterial[] = [];
  private laneScan!: THREE.Mesh;
  private laneScanMat!: THREE.MeshBasicMaterial;
  private laneGridMat!: THREE.MeshBasicMaterial;
  private ghostSprites: THREE.Sprite[] = [];
  private ghostMats: THREE.SpriteMaterial[] = [];

  // Scene 3 — idea journey pathway
  private journeyCurve!: THREE.CatmullRomCurve3;
  private journeyTubeMat!: THREE.MeshBasicMaterial;
  private journeyGridMat!: THREE.MeshBasicMaterial;
  private milestones: THREE.Mesh[] = [];
  private milestoneMats: THREE.MeshBasicMaterial[] = [];
  private milestoneRings: THREE.Mesh[] = [];
  private milestoneRingMats: THREE.MeshBasicMaterial[] = [];
  private journeyFlow!: THREE.Points;
  private journeyFlowMat!: THREE.PointsMaterial;
  private journeyFlowT: number[] = [];
  private readonly milestoneThresholds = [0.08, 0.22, 0.38, 0.54, 0.72, 0.88];
  private readonly baseFogDensity = 0.012;

  // Scene 4 — audience constellation
  private aud4Center!: THREE.Mesh;
  private aud4CenterMat!: THREE.MeshBasicMaterial;
  private aud4Nodes: THREE.Mesh[] = [];
  private aud4NodeMats: THREE.MeshBasicMaterial[] = [];
  private aud4Lines: THREE.Line[] = [];
  private aud4LineMats: THREE.LineBasicMaterial[] = [];
  private readonly aud4Thresholds = [0.1, 0.24, 0.38, 0.52, 0.68, 0.82];

  // Scene 5 — ecosystem solar system
  private eco5Star!: THREE.Mesh;
  private eco5StarMat!: THREE.MeshBasicMaterial;
  private eco5RingMats: THREE.LineBasicMaterial[] = [];
  private readonly eco5RingBaseOp = [0.3, 0.24, 0.18];
  private eco5Bodies: THREE.Mesh[] = [];
  private eco5BodyMats: THREE.MeshBasicMaterial[] = [];
  private eco5Orbit: { r: number; speed: number; phase: number; tilt: number }[] = [];
  private eco5Links: THREE.Line[] = [];
  private eco5LinkMats: THREE.LineBasicMaterial[] = [];
  private eco5Dust!: THREE.Points;
  private eco5DustMat!: THREE.PointsMaterial;

  // Scene 6 — two paths
  private tp6LeftCurve!: THREE.CatmullRomCurve3;
  private tp6RightCurve!: THREE.CatmullRomCurve3;
  private tp6LeftTubeMat!: THREE.MeshBasicMaterial;
  private tp6RightTubeMat!: THREE.MeshBasicMaterial;
  private tp6FieldMats: THREE.MeshBasicMaterial[] = [];
  private tp6Octa!: THREE.Mesh;
  private tp6OctaMat!: THREE.MeshBasicMaterial;
  private tp6Icosa!: THREE.Mesh;
  private tp6IcosaMat!: THREE.MeshBasicMaterial;
  private tp6Flow!: THREE.Points;
  private tp6FlowMat!: THREE.PointsMaterial;
  private tp6FlowT: number[] = [];
  private tp6FlowSide: number[] = [];

  // Scene 7 — final convergence
  private fin7Orb!: THREE.Mesh;
  private fin7OrbMat!: THREE.MeshBasicMaterial;
  private fin7Parts!: THREE.Points;
  private fin7PartMat!: THREE.PointsMaterial;
  private fin7Home!: Float32Array;
  private fin7Rays: THREE.Mesh[] = [];
  private fin7RayMats: THREE.MeshBasicMaterial[] = [];
  private fin7Ripples: THREE.Mesh[] = [];
  private fin7RippleMats: THREE.MeshBasicMaterial[] = [];
  private fin7Light!: THREE.PointLight;

  // Shared soft sprite for points (created once)
  private glowTex?: THREE.Texture;

  // Placeholder scene groups (index 0 = hero)
  private sceneGroups: THREE.Group[] = [];
  private sceneProgress: number[] = new Array(SCENE_COUNT).fill(0);
  private sceneReveal: number[] = new Array(SCENE_COUNT).fill(0);

  // Animation clock that respects reduced motion (separate from raw elapsed)
  private animTime = 0;

  // Disposable canvas textures
  private textures: THREE.Texture[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  // ── Init ────────────────────────────────────────────────────────────────
  init(): void {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0); // transparent background

    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.scene.fog = new THREE.FogExp2(0x020b13, 0.012);

    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0.5, 7);

    // 8-point camera path, one anchor per scene
    this.cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,    0.5,  7.0),  // 0 Hero
      new THREE.Vector3(-0.5, 0.2,  6.0),  // 1 Gateway
      new THREE.Vector3(0.5, -0.2,  6.5),  // 2 Lanes
      new THREE.Vector3(-0.3, 0.4,  5.5),  // 3 Journey
      new THREE.Vector3(0.2, -0.1,  6.0),  // 4 Audience
      new THREE.Vector3(0,    0.3,  5.0),  // 5 Ecosystem
      new THREE.Vector3(0.4,  0.0,  6.5),  // 6 TwoPaths
      new THREE.Vector3(0,    0.0,  5.5),  // 7 FinalCTA
    ]);

    this.buildLights();
    this.buildStarfield();
    this.buildNebulae();
    this.buildSceneGroups();
    this.buildHeroRings();
    this.buildOrbitParticles();
    this.buildHeroShell();
    this.buildGateway();
    this.buildActionLanes();
    this.buildIdeaJourney();
    this.buildAudience();
    this.buildEcosystem();
    this.buildTwoPaths();
    this.buildFinalCTA();

    this.applySceneVisibility(0, 0); // hero visible before first scroll event

    this.loop();
  }

  // ── Build helpers ─────────────────────────────────────────────────────────
  private buildLights(): void {
    this.scene.add(new THREE.AmbientLight(0x0a1628, 0.6));

    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(4, 6, 5);
    this.scene.add(dir);

    const gold = new THREE.PointLight(0xd4a017, 0.8, 20);
    gold.position.set(-3, 1, 4);
    this.scene.add(gold);

    const cyan = new THREE.PointLight(0x06b6d4, 0.5, 15);
    cyan.position.set(3, -1, 3);
    this.scene.add(cyan);
  }

  private buildStarfield(): void {
    const N = 1000;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    this.starMat = new THREE.PointsMaterial({
      color: 0xd0dcf0,
      size: 0.065,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.starfield = new THREE.Points(geo, this.starMat);
    this.scene.add(this.starfield);
  }

  private buildNebulae(): void {
    const defs = [
      { color: 0x06b6d4, x: -6, y: 2,  z: -8,  r: 7, op: 0.018 },
      { color: 0xd4a017, x: 7,  y: -1, z: -10, r: 8, op: 0.014 },
      { color: 0x6366f1, x: 0,  y: 3,  z: -12, r: 9, op: 0.012 },
    ];
    for (const d of defs) {
      const mat = new THREE.MeshBasicMaterial({
        color: d.color,
        transparent: true,
        opacity: d.op,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.r, 24, 24), mat);
      mesh.position.set(d.x, d.y, d.z);
      this.nebulae.push(mesh);
      this.scene.add(mesh);
    }
  }

  private buildSceneGroups(): void {
    for (let i = 0; i < SCENE_COUNT; i++) {
      const g = new THREE.Group();
      g.name = SCENE_NAMES[i];
      this.sceneGroups.push(g);
      this.scene.add(g);
    }
  }

  // Hero orbit atmosphere — 3 thin elliptical rings around the globe area.
  // Lives in scene0Hero. Supports HeroGlobe (separate R3F canvas); does not replace it.
  private buildHeroRings(): void {
    const hero = this.sceneGroups[0];
    const defs = [
      { rx: 2.9, ry: 2.5, color: 0x06b6d4, op: 0.42 },
      { rx: 3.7, ry: 3.2, color: 0xd4a017, op: 0.34 },
      { rx: 4.6, ry: 4.0, color: 0x6366f1, op: 0.27 },
    ];
    for (const d of defs) {
      const curve = new THREE.EllipseCurve(0, 0, d.rx, d.ry, 0, Math.PI * 2, false, 0);
      const pts = curve.getPoints(96).map((p) => new THREE.Vector3(p.x, p.y, 0));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: d.color, transparent: true, opacity: d.op });
      const line = new THREE.Line(geo, mat);
      line.rotation.x = Math.PI * 0.42; // tilt so rings read as orbits
      this.heroRings.push(line);
      this.heroRingMats.push(mat);
      this.heroRingBaseOp.push(d.op);
      hero.add(line);
    }
  }

  // Soft round sprite for glowing points
  private makeGlowTexture(): THREE.Texture {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.5)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    this.textures.push(tex);
    return tex;
  }

  // Faint line grid for corridor depth planes
  private makeGridTexture(): THREE.Texture {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, 256, 256);
    ctx.strokeStyle = "rgba(120,180,220,0.85)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      const p = (i / 8) * 256;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, 256); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(256, p); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    this.textures.push(tex);
    return tex;
  }

  // Scene 0 — 50 signal particles orbiting the globe area (single InstancedMesh draw call)
  private buildOrbitParticles(): void {
    const N = 50;
    const geo = new THREE.IcosahedronGeometry(0.03, 0);
    this.orbitMat = new THREE.MeshBasicMaterial({
      transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.orbitParticles = new THREE.InstancedMesh(geo, this.orbitMat, N);
    this.orbitParticles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const gold = new THREE.Color(0xffcf6a);
    const cyan = new THREE.Color(0x5fd0e6);
    for (let i = 0; i < N; i++) {
      this.orbitParams.push({
        fx: 0.3 + Math.random() * 0.5,
        fy: 0.3 + Math.random() * 0.5,
        fz: 0.2 + Math.random() * 0.4,
        rx: 1.6 + Math.random() * 1.5,
        ry: 1.2 + Math.random() * 1.2,
        rz: 0.8 + Math.random() * 1.2,
        ph: Math.random() * Math.PI * 2,
        pulse: 0.6 + Math.random() * 0.9,
      });
      this.orbitParticles.setColorAt(i, Math.random() > 0.5 ? gold : cyan);
    }
    this.orbitParticles.instanceColor!.needsUpdate = true;
    this.sceneGroups[0].add(this.orbitParticles);
  }

  // Scene 0 — soft cyan atmosphere shell (sits behind the HeroGlobe Earth)
  private buildHeroShell(): void {
    this.heroShellMat = new THREE.MeshBasicMaterial({
      color: 0x22c3d6, transparent: true, opacity: 0,
      side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.heroShell = new THREE.Mesh(new THREE.SphereGeometry(2.0, 32, 32), this.heroShellMat);
    this.sceneGroups[0].add(this.heroShell);
  }

  // Scene 1 — gateway corridor: arch + energy flow + 5 stage dots + depth grid
  private buildGateway(): void {
    const grp = this.sceneGroups[1];
    const sprite = this.makeGlowTexture();

    // 1. Gateway arch (doorway)
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.3, -1.6, 0),
      new THREE.Vector3(-1.35, 0.2, 0),
      new THREE.Vector3(-0.9, 1.25, 0),
      new THREE.Vector3(0, 1.55, 0),
      new THREE.Vector3(0.9, 1.25, 0),
      new THREE.Vector3(1.35, 0.2, 0),
      new THREE.Vector3(1.3, -1.6, 0),
    ]);
    this.gatewayArchMat = new THREE.MeshBasicMaterial({
      color: 0xd4a017, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.gatewayArch = new THREE.Mesh(new THREE.TubeGeometry(archCurve, 120, 0.022, 8, false), this.gatewayArchMat);
    grp.add(this.gatewayArch);

    // 2. Energy flow path through the gateway, receding into depth
    this.flowCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.4, 2.2),
      new THREE.Vector3(0, -0.4, 0.6),
      new THREE.Vector3(0, 0.2, -0.8),
      new THREE.Vector3(0, 0.5, -2.6),
      new THREE.Vector3(0, 0.7, -4.5),
    ]);
    const FN = 14;
    const fpos = new Float32Array(FN * 3);
    const fcol = new Float32Array(FN * 3);
    const cyan = new THREE.Color(0x06b6d4);
    const gold = new THREE.Color(0xf0c040);
    for (let i = 0; i < FN; i++) {
      this.flowT.push(i / FN);
      const col = cyan.clone().lerp(gold, i / FN);
      fcol[i * 3] = col.r; fcol[i * 3 + 1] = col.g; fcol[i * 3 + 2] = col.b;
    }
    const fgeo = new THREE.BufferGeometry();
    fgeo.setAttribute("position", new THREE.BufferAttribute(fpos, 3));
    fgeo.setAttribute("color", new THREE.BufferAttribute(fcol, 3));
    this.flowMat = new THREE.PointsMaterial({
      size: 0.13, map: sprite, vertexColors: true, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    this.flowParticles = new THREE.Points(fgeo, this.flowMat);
    grp.add(this.flowParticles);

    // 3. Five stage dots along the path (Submit→Review→Mentor→Exhibit→Impact)
    const tPos = [0.1, 0.3, 0.5, 0.7, 0.9];
    const stageColors = [0xd4a017, 0x06b6d4, 0x6366f1, 0xd4a017, 0x06b6d4];
    for (let i = 0; i < 5; i++) {
      const p = this.flowCurve.getPoint(tPos[i]);
      const dotMat = new THREE.MeshBasicMaterial({
        color: stageColors[i], transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), dotMat);
      dot.position.copy(p);
      dot.scale.setScalar(0.2);
      this.stageDots.push(dot);
      this.stageDotMats.push(dotMat);
      grp.add(dot);

      const ringMat = new THREE.MeshBasicMaterial({
        color: stageColors[i], transparent: true, opacity: 0, side: THREE.DoubleSide,
        depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.012, 8, 32), ringMat);
      ring.position.copy(p);
      this.stageRings.push(ring);
      this.stageRingMats.push(ringMat);
      grp.add(ring);
    }

    // 4. Depth grid planes behind the arch
    const gridTex = this.makeGridTexture();
    for (const z of [-2.5, -4.5, -6.5]) {
      const m = new THREE.MeshBasicMaterial({
        map: gridTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 7), m);
      plane.position.set(0, 0, z);
      this.gridMats.push(m);
      grp.add(plane);
    }
  }

  // Ghost number sprite (01–04) — canvas, not TextGeometry
  private makeNumberTexture(text: string): THREE.Texture {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, 128, 128);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 84px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 64, 70);
    const tex = new THREE.CanvasTexture(c);
    this.textures.push(tex);
    return tex;
  }

  // Scene 2 — action lanes: 4 beams + scan line + perspective grid + ghost numbers
  private buildActionLanes(): void {
    const grp = this.sceneGroups[2];
    const xs = [-2.1, -0.7, 0.7, 2.1];
    const colors = [0xd4a017, 0x06b6d4, 0x10b981, 0x6366f1];

    for (let i = 0; i < 4; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i], transparent: true, opacity: 0, side: THREE.DoubleSide,
        depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const beam = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 6), mat);
      beam.position.set(xs[i], 0, -0.5);
      this.laneBeams.push(beam);
      this.laneBeamMats.push(mat);
      grp.add(beam);
    }

    this.laneScanMat = new THREE.MeshBasicMaterial({
      color: 0xd4a017, transparent: true, opacity: 0, side: THREE.DoubleSide,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.laneScan = new THREE.Mesh(new THREE.PlaneGeometry(6, 0.02), this.laneScanMat);
    this.laneScan.position.z = -0.4;
    grp.add(this.laneScan);

    this.laneGridMat = new THREE.MeshBasicMaterial({
      map: this.makeGridTexture(), transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(12, 8), this.laneGridMat);
    grid.position.set(0, 0, -4);
    grp.add(grid);

    for (let i = 0; i < 4; i++) {
      const mat = new THREE.SpriteMaterial({
        map: this.makeNumberTexture(`0${i + 1}`), transparent: true, opacity: 0,
        depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const sp = new THREE.Sprite(mat);
      sp.scale.set(1.4, 1.4, 1);
      sp.position.set(xs[i], 1.6, -2);
      this.ghostSprites.push(sp);
      this.ghostMats.push(mat);
      grp.add(sp);
    }
  }

  // Scene 3 — idea journey: S-curve tube + 6 milestones + rings + flow particles
  private buildIdeaJourney(): void {
    const grp = this.sceneGroups[3];
    const gold = new THREE.Color(0xf0c040);
    const cyan = new THREE.Color(0x06b6d4);

    // Premium progression map — horizontal route sweeping slightly upward (left → right)
    this.journeyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.6, -0.7, -0.2),
      new THREE.Vector3(-2.0, -0.45, 0.15),
      new THREE.Vector3(-0.4, -0.1, 0.35),
      new THREE.Vector3(1.2, 0.35, 0.2),
      new THREE.Vector3(2.6, 0.7, -0.05),
      new THREE.Vector3(3.6, 0.95, -0.25),
    ]);

    const tubular = 200;
    const radial = 8;
    const tubeGeo = new THREE.TubeGeometry(this.journeyCurve, tubular, 0.028, radial, false);
    const posCount = tubeGeo.getAttribute("position").count;
    const colArr = new Float32Array(posCount * 3);
    const perRing = radial + 1;
    for (let v = 0; v < posCount; v++) {
      const f = Math.min(Math.floor(v / perRing) / tubular, 1);
      const c = gold.clone().lerp(cyan, f);
      colArr[v * 3] = c.r; colArr[v * 3 + 1] = c.g; colArr[v * 3 + 2] = c.b;
    }
    tubeGeo.setAttribute("color", new THREE.BufferAttribute(colArr, 3));
    this.journeyTubeMat = new THREE.MeshBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    grp.add(new THREE.Mesh(tubeGeo, this.journeyTubeMat));

    // Structured depth grid — premium progression-map field behind the route
    const gridPlaneMat = new THREE.MeshBasicMaterial({
      map: this.makeGridTexture(), transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const gridPlane = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), gridPlaneMat);
    gridPlane.position.set(0, 0.2, -2.6);
    this.journeyGridMat = gridPlaneMat;
    grp.add(gridPlane);

    const tPos = [0.05, 0.24, 0.42, 0.6, 0.78, 0.95];
    const mColors = [0xd4a017, 0x06b6d4, 0x6366f1, 0xd4a017, 0x10b981, 0xf0c040];
    for (let i = 0; i < 6; i++) {
      const p = this.journeyCurve.getPoint(tPos[i]);
      const mMat = new THREE.MeshBasicMaterial({
        color: mColors[i], transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), mMat);
      m.position.copy(p);
      m.scale.setScalar(0.8);
      this.milestones.push(m);
      this.milestoneMats.push(mMat);
      grp.add(m);

      const rMat = new THREE.MeshBasicMaterial({
        color: mColors[i], transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.01, 8, 32), rMat);
      r.position.copy(p);
      this.milestoneRings.push(r);
      this.milestoneRingMats.push(rMat);
      grp.add(r);
    }

    const FN = 100;
    const fpos = new Float32Array(FN * 3);
    const fcol = new Float32Array(FN * 3);
    const white = new THREE.Color(0xffffff);
    for (let i = 0; i < FN; i++) {
      this.journeyFlowT.push(Math.random());
      const pick = Math.random();
      const c = pick < 0.4 ? gold.clone() : pick < 0.8 ? cyan.clone() : white.clone();
      fcol[i * 3] = c.r; fcol[i * 3 + 1] = c.g; fcol[i * 3 + 2] = c.b;
    }
    const fgeo = new THREE.BufferGeometry();
    fgeo.setAttribute("position", new THREE.BufferAttribute(fpos, 3));
    fgeo.setAttribute("color", new THREE.BufferAttribute(fcol, 3));
    this.journeyFlowMat = new THREE.PointsMaterial({
      size: 0.07, map: this.makeGlowTexture(), vertexColors: true, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    this.journeyFlow = new THREE.Points(fgeo, this.journeyFlowMat);
    grp.add(this.journeyFlow);
  }

  private getGlow(): THREE.Texture {
    if (!this.glowTex) this.glowTex = this.makeGlowTexture();
    return this.glowTex;
  }

  // Scene 4 — audience constellation: center node + 6 audience nodes + links
  private buildAudience(): void {
    const grp = this.sceneGroups[4];
    this.aud4CenterMat = new THREE.MeshBasicMaterial({
      color: 0xfff0c0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.aud4Center = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), this.aud4CenterMat);
    grp.add(this.aud4Center);

    const colors = [0x06b6d4, 0xd4a017, 0xf8fbff, 0x10b981, 0x6366f1, 0xfacc15];
    const pts = [
      new THREE.Vector3(1.8, 0.6, 0.3),
      new THREE.Vector3(-1.6, 0.9, -0.4),
      new THREE.Vector3(0.4, 1.7, 0.6),
      new THREE.Vector3(-1.2, -1.3, 0.5),
      new THREE.Vector3(1.5, -1.0, -0.5),
      new THREE.Vector3(0.0, -1.8, -0.3),
    ];
    for (let i = 0; i < 6; i++) {
      const nMat = new THREE.MeshBasicMaterial({
        color: colors[i], transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), nMat);
      node.position.copy(pts[i]);
      node.scale.setScalar(0.4);
      this.aud4Nodes.push(node);
      this.aud4NodeMats.push(nMat);
      grp.add(node);

      const lMat = new THREE.LineBasicMaterial({ color: colors[i], transparent: true, opacity: 0 });
      const lGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pts[i]]);
      const line = new THREE.Line(lGeo, lMat);
      this.aud4Lines.push(line);
      this.aud4LineMats.push(lMat);
      grp.add(line);
    }
  }

  // Scene 5 — ecosystem solar system: central star + 3 orbit rings + 7 bodies + dust
  private buildEcosystem(): void {
    const grp = this.sceneGroups[5];
    this.eco5StarMat = new THREE.MeshBasicMaterial({
      color: 0xfff0c0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.eco5Star = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), this.eco5StarMat);
    grp.add(this.eco5Star);

    const ringR = [1.5, 2.3, 3.1];
    const ringC = [0x10b981, 0xd4a017, 0x6366f1];
    const ringTilt = [0.5, 0.9, 0.3];
    for (let i = 0; i < 3; i++) {
      const curve = new THREE.EllipseCurve(0, 0, ringR[i], ringR[i], 0, Math.PI * 2, false, 0);
      const p = curve.getPoints(80).map((v) => new THREE.Vector3(v.x, v.y, 0));
      const geo = new THREE.BufferGeometry().setFromPoints(p);
      const mat = new THREE.LineBasicMaterial({ color: ringC[i], transparent: true, opacity: 0 });
      const ring = new THREE.Line(geo, mat);
      ring.rotation.x = Math.PI / 2 - ringTilt[i];
      this.eco5RingMats.push(mat);
      grp.add(ring);
    }

    const bodies = [
      { r: 1.5, speed: 0.5,  phase: 0.0, tilt: 0.5, size: 0.1,  color: 0x10b981 }, // NMF
      { r: 2.3, speed: 0.32, phase: 1.2, tilt: 0.9, size: 0.1,  color: 0xd4a017 }, // IFIA Bharat
      { r: 3.1, speed: 0.22, phase: 2.5, tilt: 0.3, size: 0.1,  color: 0x6366f1 }, // IFIA Global
      { r: 2.3, speed: 0.32, phase: 4.0, tilt: 0.9, size: 0.09, color: 0x06b6d4 }, // ABIPIR
      { r: 1.5, speed: 0.5,  phase: 3.3, tilt: 0.5, size: 0.05, color: 0x06b6d4 }, // Mentors
      { r: 3.1, speed: 0.22, phase: 5.0, tilt: 0.3, size: 0.05, color: 0xf8fbff }, // Experts
      { r: 2.3, speed: 0.32, phase: 2.0, tilt: 0.9, size: 0.05, color: 0xfacc15 }, // Partners
    ];
    for (const b of bodies) {
      const mat = new THREE.MeshBasicMaterial({
        color: b.color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(b.size, 14, 14), mat);
      mesh.scale.setScalar(0.3);
      this.eco5Bodies.push(mesh);
      this.eco5BodyMats.push(mat);
      this.eco5Orbit.push({ r: b.r, speed: b.speed, phase: b.phase, tilt: b.tilt });
      grp.add(mesh);

      const lMat = new THREE.LineBasicMaterial({ color: b.color, transparent: true, opacity: 0 });
      const lGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
      const line = new THREE.Line(lGeo, lMat);
      this.eco5Links.push(line);
      this.eco5LinkMats.push(lMat);
      grp.add(line);
    }

    const DN = 80;
    const dpos = new Float32Array(DN * 3);
    for (let i = 0; i < DN; i++) {
      const a = Math.random() * Math.PI * 2;
      const rr = 1.2 + Math.random() * 2.2;
      dpos[i * 3] = Math.cos(a) * rr;
      dpos[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      dpos[i * 3 + 2] = Math.sin(a) * rr;
    }
    const dgeo = new THREE.BufferGeometry();
    dgeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
    this.eco5DustMat = new THREE.PointsMaterial({
      color: 0x9fc6e0, size: 0.04, map: this.getGlow(), transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    this.eco5Dust = new THREE.Points(dgeo, this.eco5DustMat);
    grp.add(this.eco5Dust);
  }

  // Scene 6 — two paths: forked tubes + energy fields + wireframe shapes + flow
  private buildTwoPaths(): void {
    const grp = this.sceneGroups[6];
    this.tp6LeftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.8, 0),
      new THREE.Vector3(-0.8, -0.6, 0.2),
      new THREE.Vector3(-1.6, 0.6, -0.2),
      new THREE.Vector3(-2.2, 1.7, 0.1),
    ]);
    this.tp6RightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.8, 0),
      new THREE.Vector3(0.8, -0.6, 0.2),
      new THREE.Vector3(1.6, 0.6, -0.2),
      new THREE.Vector3(2.2, 1.7, 0.1),
    ]);
    this.tp6LeftTubeMat = new THREE.MeshBasicMaterial({
      color: 0xd4a017, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.tp6RightTubeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    grp.add(new THREE.Mesh(new THREE.TubeGeometry(this.tp6LeftCurve, 80, 0.02, 8, false), this.tp6LeftTubeMat));
    grp.add(new THREE.Mesh(new THREE.TubeGeometry(this.tp6RightCurve, 80, 0.02, 8, false), this.tp6RightTubeMat));

    const lf = new THREE.MeshBasicMaterial({
      color: 0xd4a017, transparent: true, opacity: 0, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const lfMesh = new THREE.Mesh(new THREE.SphereGeometry(1.2, 24, 24), lf);
    lfMesh.position.set(-1.8, 0.8, -0.5);
    grp.add(lfMesh);
    this.tp6FieldMats.push(lf);

    const rf = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, transparent: true, opacity: 0, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const rfMesh = new THREE.Mesh(new THREE.SphereGeometry(1.2, 24, 24), rf);
    rfMesh.position.set(1.8, 0.8, -0.5);
    grp.add(rfMesh);
    this.tp6FieldMats.push(rf);

    this.tp6OctaMat = new THREE.MeshBasicMaterial({
      color: 0xd4a017, wireframe: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.tp6Octa = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), this.tp6OctaMat);
    this.tp6Octa.position.set(-1.8, 0.8, 0);
    grp.add(this.tp6Octa);

    this.tp6IcosaMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.tp6Icosa = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), this.tp6IcosaMat);
    this.tp6Icosa.position.set(1.8, 0.8, 0);
    grp.add(this.tp6Icosa);

    const FN = 80;
    const fpos = new Float32Array(FN * 3);
    const fcol = new Float32Array(FN * 3);
    const gold = new THREE.Color(0xf0c040);
    const cyan = new THREE.Color(0x06b6d4);
    for (let i = 0; i < FN; i++) {
      const side = i < 40 ? 0 : 1;
      this.tp6FlowSide.push(side);
      this.tp6FlowT.push(Math.random());
      const c = side === 0 ? gold : cyan;
      fcol[i * 3] = c.r; fcol[i * 3 + 1] = c.g; fcol[i * 3 + 2] = c.b;
    }
    const fgeo = new THREE.BufferGeometry();
    fgeo.setAttribute("position", new THREE.BufferAttribute(fpos, 3));
    fgeo.setAttribute("color", new THREE.BufferAttribute(fcol, 3));
    this.tp6FlowMat = new THREE.PointsMaterial({
      size: 0.07, map: this.getGlow(), vertexColors: true, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    this.tp6Flow = new THREE.Points(fgeo, this.tp6FlowMat);
    grp.add(this.tp6Flow);
  }

  // Scene 7 — final convergence: orb + converging particles + rays + ripples + warm light
  private buildFinalCTA(): void {
    const grp = this.sceneGroups[7];
    this.fin7OrbMat = new THREE.MeshBasicMaterial({
      color: 0xffe9b0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.fin7Orb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 28, 28), this.fin7OrbMat);
    grp.add(this.fin7Orb);

    const PN = 120;
    const pos = new Float32Array(PN * 3);
    this.fin7Home = new Float32Array(PN * 3);
    const col = new Float32Array(PN * 3);
    const gold = new THREE.Color(0xf0c040);
    const white = new THREE.Color(0xffffff);
    for (let i = 0; i < PN; i++) {
      const a = Math.random() * Math.PI * 2;
      const rr = 2.5 + Math.random() * 1.2;
      const hx = Math.cos(a) * rr;
      const hy = (Math.random() - 0.5) * 2.2;
      const hz = Math.sin(a) * rr;
      this.fin7Home[i * 3] = hx; this.fin7Home[i * 3 + 1] = hy; this.fin7Home[i * 3 + 2] = hz;
      pos[i * 3] = hx; pos[i * 3 + 1] = hy; pos[i * 3 + 2] = hz;
      const c = Math.random() < 0.6 ? gold : white;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pgeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    this.fin7PartMat = new THREE.PointsMaterial({
      size: 0.08, map: this.getGlow(), vertexColors: true, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    this.fin7Parts = new THREE.Points(pgeo, this.fin7PartMat);
    grp.add(this.fin7Parts);

    for (let i = 0; i < 10; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xf0c040, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const ray = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 1.4), mat);
      ray.position.set(0, 0, -0.2);
      ray.rotation.z = (i / 10) * Math.PI * 2;
      this.fin7Rays.push(ray);
      this.fin7RayMats.push(mat);
      grp.add(ray);
    }

    for (let i = 0; i < 3; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xf0c040 : 0x06b6d4, transparent: true, opacity: 0, side: THREE.DoubleSide,
        depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.012, 8, 48), mat);
      this.fin7Ripples.push(ring);
      this.fin7RippleMats.push(mat);
      grp.add(ring);
    }

    this.fin7Light = new THREE.PointLight(0xffcf7a, 0, 14);
    this.fin7Light.position.set(0, 0, 3);
    grp.add(this.fin7Light);
  }

  private smoothstep(a: number, b: number, x: number): number {
    const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
    return t * t * (3 - 2 * t);
  }

  // Per-scene reveal gating. Each section's own ScrollTrigger drives one scene
  // independently, so each call updates only that scene. Starfield/nebula persist.
  private applySceneVisibility(scene: number, progress: number): void {
    let reveal: number;
    if (scene === 0) {
      // Hero: full at top of page, fades out as it scrolls away
      reveal = 1 - this.smoothstep(0.55, 1.0, progress);
    } else {
      // Mid-page section: bell curve — fade in, hold, fade out by section exit
      reveal = this.smoothstep(0.0, 0.18, progress) * (1 - this.smoothstep(0.82, 1.0, progress));
    }
    this.sceneReveal[scene] = reveal;
    this.sceneGroups[scene].visible = reveal > 0.002;
  }

  // ── Public API ──────────────────────────────────────────────────────────
  setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
  }

  setCameraProgress(progress: number): void {
    const p = Math.min(Math.max(progress, 0), 1);
    this.cameraTarget.copy(this.cameraPath.getPoint(p));
  }

  setSceneProgress(scene: number, progress: number): void {
    if (scene < 0 || scene >= SCENE_COUNT) return;
    const p = Math.min(Math.max(progress, 0), 1);
    this.sceneProgress[scene] = p;
    this.applySceneVisibility(scene, p);
  }

  setScrollVelocity(velocity: number): void {
    this.scrollVel = velocity;
  }

  setMousePosition(x: number, y: number): void {
    this.mouseX = Math.min(Math.max(x, -1), 1);
    this.mouseY = Math.min(Math.max(y, -1), 1);
  }

  resize(): void {
    if (this.disposed) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ── Animation loop ────────────────────────────────────────────────────────
  private loop = (): void => {
    if (this.disposed) return;
    this.animId = requestAnimationFrame(this.loop);

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const motion = this.reducedMotion ? 0.25 : 1;
    this.animTime += dt * motion;
    const at = this.animTime;

    // Scroll velocity decays each frame; disabled streaks under reduced motion
    this.scrollVel *= 0.9;
    const vel = this.reducedMotion ? 0 : this.scrollVel;

    // Camera glide toward path target + mouse parallax (±0.25)
    const px = this.mouseX * 0.25;
    const py = this.mouseY * 0.25;
    this.camera.position.x += (this.cameraTarget.x + px - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.cameraTarget.y - py - this.camera.position.y) * 0.05;
    this.camera.position.z += (this.cameraTarget.z - this.camera.position.z) * 0.05;
    this.camera.lookAt(0, 0, 0);

    // Starfield slow rotation; scroll velocity slightly lifts size + opacity
    this.starfield.rotation.y += dt * 0.01 * motion;
    this.starfield.rotation.x += dt * 0.004 * motion;
    const velBoost = Math.min(Math.abs(vel) * 4, 1);
    this.starMat.size = 0.065 + velBoost * 0.03;
    this.starMat.opacity = 0.45 + velBoost * 0.25;

    // Nebula slow drift
    for (let i = 0; i < this.nebulae.length; i++) {
      const n = this.nebulae[i];
      n.position.x += Math.sin(at * 0.05 + i) * 0.002;
      n.position.y += Math.cos(at * 0.04 + i * 1.7) * 0.0015;
    }

    const r0 = this.sceneReveal[0];
    const r1 = this.sceneReveal[1];

    // ── Scene 0 — hero atmosphere ──
    for (let i = 0; i < this.heroRings.length; i++) {
      this.heroRings[i].rotation.z += dt * (0.02 + i * 0.01) * motion * (i % 2 === 0 ? 1 : -1);
      this.heroRingMats[i].opacity = this.heroRingBaseOp[i] * r0;
    }
    if (this.sceneGroups[0].visible) {
      this.orbitMat.opacity = 0.9 * r0;
      for (let i = 0; i < this.orbitParams.length; i++) {
        const o = this.orbitParams[i];
        this.orbitDummy.position.set(
          Math.cos(at * o.fx + o.ph) * o.rx,
          Math.sin(at * o.fy + o.ph * 1.3) * o.ry,
          Math.sin(at * o.fz + o.ph * 0.7) * o.rz,
        );
        this.orbitDummy.scale.setScalar(0.7 + 0.3 * Math.sin(at * 2.0 * o.pulse + o.ph));
        this.orbitDummy.updateMatrix();
        this.orbitParticles.setMatrixAt(i, this.orbitDummy.matrix);
      }
      this.orbitParticles.instanceMatrix.needsUpdate = true;
      this.heroShellMat.opacity = (0.1 + 0.03 * Math.sin(at * 0.8)) * r0;
    }

    // ── Scene 1 — gateway corridor ──
    if (this.sceneGroups[1].visible) {
      const local1 = this.sceneProgress[1];
      this.gatewayArchMat.opacity = (0.5 + 0.25 * Math.sin(at * 1.4)) * r1;

      // Energy flow particles travel along the path
      this.flowMat.opacity = 0.9 * r1;
      const fpos = this.flowParticles.geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < this.flowT.length; i++) {
        const tt = (this.flowT[i] + at * 0.08) % 1;
        const p = this.flowCurve.getPoint(tt);
        fpos.setXYZ(i, p.x, p.y, p.z);
      }
      fpos.needsUpdate = true;

      // Stage dots activate one-by-one as scene 1 progresses
      for (let i = 0; i < this.stageDots.length; i++) {
        const a = Math.min(Math.max((local1 - this.stageThresholds[i]) / 0.08, 0), 1);
        this.stageDots[i].scale.setScalar(0.2 + a * 0.8);
        this.stageDotMats[i].opacity = a * r1;
        const ringPulse = 1 + 0.25 * Math.sin(at * 3 + i);
        this.stageRings[i].scale.setScalar((0.6 + a * 0.6) * ringPulse);
        this.stageRingMats[i].opacity = a * 0.6 * r1;
      }

      // Depth grid faint shimmer
      for (let i = 0; i < this.gridMats.length; i++) {
        this.gridMats[i].opacity = (0.02 + 0.012 * Math.sin(at * 0.6 + i)) * r1;
      }
    }

    // ── Scene 2 — action lanes ──
    const r2 = this.sceneReveal[2];
    if (this.sceneGroups[2].visible) {
      const local2 = this.sceneProgress[2];
      for (let i = 0; i < this.laneBeams.length; i++) {
        const a = Math.min(Math.max((local2 - i * 0.08) / 0.2, 0), 1); // staggered rise
        this.laneBeamMats[i].opacity = a * 0.55 * r2;
        this.laneBeams[i].scale.y = 0.6 + a * 0.4;
      }
      // Horizontal scan line loops top → bottom
      this.laneScan.position.y = 3 - ((at * 0.6) % 1) * 6;
      this.laneScanMat.opacity = 0.25 * r2;
      this.laneGridMat.opacity = 0.03 * r2;
      for (let i = 0; i < this.ghostSprites.length; i++) {
        this.ghostSprites[i].position.y = 1.6 + Math.sin(at * 0.5 + i) * 0.15;
        this.ghostMats[i].opacity = 0.06 * r2;
      }
    }

    // ── Scene 3 — idea journey ──
    const r3 = this.sceneReveal[3];
    if (this.sceneGroups[3].visible) {
      const local3 = this.sceneProgress[3];
      this.journeyTubeMat.opacity = 0.88 * r3;
      this.journeyGridMat.opacity = 0.07 * r3;
      for (let i = 0; i < this.milestones.length; i++) {
        const a = Math.min(Math.max((local3 - this.milestoneThresholds[i]) / 0.06, 0), 1);
        this.milestones[i].scale.setScalar(0.8 + a * 0.35);
        this.milestoneMats[i].opacity = (0.2 + a * 0.8) * r3;
        this.milestoneRings[i].rotation.z += dt * (0.3 + i * 0.05) * motion;
        this.milestoneRingMats[i].opacity = (0.15 + a * 0.6) * r3;
      }
      this.journeyFlowMat.opacity = 0.85 * r3;
      const jpos = this.journeyFlow.geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < this.journeyFlowT.length; i++) {
        const tt = (this.journeyFlowT[i] + at * 0.05) % 1;
        const p = this.journeyCurve.getPoint(tt);
        jpos.setXYZ(i, p.x, p.y, p.z);
      }
      jpos.needsUpdate = true;
    }

    // ── Scene 4 — audience constellation ──
    const r4 = this.sceneReveal[4];
    if (this.sceneGroups[4].visible) {
      const local4 = this.sceneProgress[4];
      this.aud4Center.scale.setScalar(1 + 0.06 * Math.sin(at * 1.5));
      this.aud4CenterMat.opacity = 0.9 * r4;
      for (let i = 0; i < this.aud4Nodes.length; i++) {
        const a = Math.min(Math.max((local4 - this.aud4Thresholds[i]) / 0.06, 0), 1);
        this.aud4Nodes[i].scale.setScalar(0.4 + a * 0.7 + 0.05 * a * Math.sin(at * 3 + i));
        this.aud4NodeMats[i].opacity = a * r4;
        this.aud4LineMats[i].opacity = a * 0.25 * r4;
      }
    }

    // ── Scene 5 — ecosystem solar system ──
    const r5 = this.sceneReveal[5];
    if (this.sceneGroups[5].visible) {
      const local5 = this.sceneProgress[5];
      this.eco5Star.scale.setScalar(1 + 0.07 * Math.sin(at * 1.3));
      this.eco5StarMat.opacity = 0.95 * r5;
      for (let i = 0; i < this.eco5RingMats.length; i++) {
        this.eco5RingMats[i].opacity = this.eco5RingBaseOp[i] * r5;
      }
      for (let i = 0; i < this.eco5Bodies.length; i++) {
        const o = this.eco5Orbit[i];
        const ang = at * o.speed + o.phase;
        const x = Math.cos(ang) * o.r;
        const y = Math.sin(ang) * o.r * Math.sin(o.tilt);
        const z = Math.sin(ang) * o.r * Math.cos(o.tilt);
        this.eco5Bodies[i].position.set(x, y, z);
        const a = Math.min(Math.max((local5 - i * 0.04) / 0.2, 0), 1);
        this.eco5Bodies[i].scale.setScalar(0.3 + a * 0.7);
        this.eco5BodyMats[i].opacity = a * r5;
        const lpos = this.eco5Links[i].geometry.getAttribute("position") as THREE.BufferAttribute;
        lpos.setXYZ(1, x, y, z);
        lpos.needsUpdate = true;
        this.eco5LinkMats[i].opacity = a * 0.16 * r5;
      }
      this.eco5Dust.rotation.y += dt * 0.02 * motion;
      this.eco5DustMat.opacity = 0.06 * r5;
    }

    // ── Scene 6 — two paths ──
    const r6 = this.sceneReveal[6];
    if (this.sceneGroups[6].visible) {
      const local6 = this.sceneProgress[6];
      this.tp6LeftTubeMat.opacity = this.smoothstep(0.0, 0.4, local6) * 0.7 * r6;
      this.tp6RightTubeMat.opacity = this.smoothstep(0.1, 0.5, local6) * 0.7 * r6;
      this.tp6FieldMats[0].opacity = 0.1 * r6;
      this.tp6FieldMats[1].opacity = 0.1 * r6;
      this.tp6Octa.rotation.x += dt * 0.3 * motion;
      this.tp6Octa.rotation.y += dt * 0.2 * motion;
      this.tp6Icosa.rotation.x -= dt * 0.25 * motion;
      this.tp6Icosa.rotation.y += dt * 0.22 * motion;
      this.tp6OctaMat.opacity = 0.18 * r6;
      this.tp6IcosaMat.opacity = 0.18 * r6;
      this.tp6FlowMat.opacity = 0.85 * r6;
      const tpos = this.tp6Flow.geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < this.tp6FlowT.length; i++) {
        const tt = (this.tp6FlowT[i] + at * 0.08) % 1;
        const p = (this.tp6FlowSide[i] === 0 ? this.tp6LeftCurve : this.tp6RightCurve).getPoint(tt);
        tpos.setXYZ(i, p.x, p.y, p.z);
      }
      tpos.needsUpdate = true;
    }

    // ── Scene 7 — final convergence ──
    const r7 = this.sceneReveal[7];
    if (this.sceneGroups[7].visible) {
      const local7 = this.sceneProgress[7];
      const grow = this.smoothstep(0, 1, local7);
      this.fin7Orb.scale.setScalar((0.6 + grow * 1.0) * (1 + 0.05 * Math.sin(at * 2.2)));
      this.fin7OrbMat.opacity = 0.9 * r7;

      const k = this.smoothstep(0.0, 0.9, local7);
      const ppos = this.fin7Parts.geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < ppos.count; i++) {
        ppos.setXYZ(i, this.fin7Home[i * 3] * (1 - k), this.fin7Home[i * 3 + 1] * (1 - k), this.fin7Home[i * 3 + 2] * (1 - k));
      }
      ppos.needsUpdate = true;
      this.fin7PartMat.opacity = 0.8 * r7;

      const burst = this.smoothstep(0.45, 0.75, local7);
      for (let i = 0; i < this.fin7Rays.length; i++) {
        this.fin7Rays[i].scale.y = 0.2 + burst * 1.3;
        this.fin7RayMats[i].opacity = burst * 0.28 * r7;
      }
      for (let i = 0; i < this.fin7Ripples.length; i++) {
        const f = (at * 0.3 + i / 3) % 1;
        this.fin7Ripples[i].scale.setScalar(0.4 + f * 2.6);
        this.fin7RippleMats[i].opacity = (1 - f) * 0.3 * r7;
      }
      this.fin7Light.intensity = 1.2 * r7;
    }

    // Subtle fog deepening while scene 3 is active (eased, restores otherwise)
    const fog = this.scene.fog as THREE.FogExp2;
    fog.density += (this.baseFogDensity + 0.004 * r3 - fog.density) * 0.05;

    this.renderer.render(this.scene, this.camera);
  };

  // ── Cleanup ────────────────────────────────────────────────────────────────
  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.animId);
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
        obj.geometry.dispose();
        const mat = obj.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
      if (obj instanceof THREE.InstancedMesh) obj.dispose();
      if (obj instanceof THREE.Sprite) obj.material.dispose();
    });
    for (const tex of this.textures) tex.dispose();
    this.renderer.dispose();
  }
}
