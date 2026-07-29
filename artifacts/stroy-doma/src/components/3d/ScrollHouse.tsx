import { useRef, useEffect, useState, useMemo, useCallback, Suspense, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Grid } from "@react-three/drei";
import * as THREE from "three";
import { useGltfWithPlugin, hasWebGL, cloneGltfScene } from "./houseLoader";
import { getGltfPromise } from "./houseLoader";

// Stable config objects outside the component so r3f never sees a new reference
// and never recreates the WebGL renderer on re-renders caused by scroll events.
const CAMERA_CONFIG = { position: [0, 5, 12] as [number, number, number], fov: 42 };

const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 768;

const GL_CONFIG = {
  localClippingEnabled: true,
  failIfMajorPerformanceCaveat: false,
  // Disable antialias on mobile — big perf win, barely noticeable on high-DPI screens
  antialias: !isMobileDevice,
  powerPreference: (isMobileDevice ? "high-performance" : "default") as WebGLPowerPreference,
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type Bounds = { minY: number; maxY: number };

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

function HouseModel({
  progress,
  clipPlane,
  onBounds,
  isMobile,
}: {
  progress: number;
  clipPlane: THREE.Plane;
  onBounds: (bounds: Bounds) => void;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const gltf = useGltfWithPlugin();
  // Independent clone — the cached gltf.scene is shared with other
  // simultaneously-mounted canvases (e.g. HeroHouseFlight), and an
  // Object3D can only belong to one parent at a time.
  const scene = useMemo(() => cloneGltfScene(gltf.scene), [gltf.scene]);

  const { normScale, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? 5.5 / maxDim : 1;
    const center = new THREE.Vector3();
    box.getCenter(center);
    return { normScale: s * (isMobile ? 0.95 : 1), centerOffset: center };
  }, [scene, isMobile]);

  // Enable shadows + assign the shared clipping plane to every material once.
  useLayoutEffect(() => {
    if (!groupRef.current) return;

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mat = m as THREE.Material;
          mat.clippingPlanes = [clipPlane];
          mat.clipShadows = true;
          mat.needsUpdate = true;
        });
      }
    });

    groupRef.current.scale.setScalar(normScale);
    groupRef.current.position.set(0, 0, 0);
    // House aligned parallel to the grid (no rotation offset)
    groupRef.current.rotation.y = 0;
    groupRef.current.updateMatrixWorld(true);

    // Lift so base sits at Y = 0, house floats in upper half of view
    const box0 = new THREE.Box3().setFromObject(groupRef.current);
    groupRef.current.position.setY(-box0.min.y);
    groupRef.current.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(groupRef.current);
    onBounds({ minY: box.min.y, maxY: box.max.y });

    // Nudge the mesh up a bit within the frame without moving the camera's
    // focus point (which tracks the bounds captured above).
    groupRef.current.position.y += 0.6;
    groupRef.current.updateMatrixWorld(true);
  }, [scene, normScale, clipPlane, onBounds]);

  // House stays fixed on the ground — clip plane handles the build reveal.
  useFrame(() => { /* no-op: position is set once in useLayoutEffect */ });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}
      />
    </group>
  );
}

function Scene({
  progress,
  clipPlane,
  boundsRef,
  onBounds,
  isMobile,
}: {
  progress: number;
  clipPlane: THREE.Plane;
  boundsRef: React.MutableRefObject<Bounds>;
  onBounds: (bounds: Bounds) => void;
  isMobile: boolean;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const { minY, maxY } = boundsRef.current;
    const midY = (minY + maxY) * 0.5;

    // ── Two phases ─────────────────────────────────────────────────────────
    // 0 → BUILD_END : house assembles, camera moves slightly (original feel)
    // BUILD_END → 1 : house fully built, camera orbits ~330° around it
    const BUILD_END = 0.50;
    const baseDist = isMobile ? 15 : 12;

    if (progress <= BUILD_END) {
      // Build phase — normalise to 0→1
      const bp = progress / BUILD_END;
      const angle = bp * Math.PI * 0.17;
      const zoomT = easeOutCubic(Math.max(0, (bp - 0.85) / 0.15));
      const dist = baseDist - zoomT * 2.0;
      camera.position.x = Math.sin(angle) * dist;
      camera.position.z = Math.cos(angle) * dist;
      camera.position.y = midY + 2.5 + bp * 0.4;
      camera.lookAt(0, midY, 0);
    } else {
      // Orbit phase — normalise to 0→1 (occupies 50% of total scroll = slower)
      const op = (progress - BUILD_END) / (1 - BUILD_END);
      const eop = easeInOutCubic(op);
      // Start angle where build phase left off (~30°) and sweep ~300° around
      const startAngle = Math.PI * 0.17;
      const orbitAngle = startAngle + eop * Math.PI * 1.67;
      // Zoom in toward the end: gets closer as orbit finishes
      const orbitDist = baseDist - 2.0 - eop * 2.5;
      // Height: rises slightly mid-orbit, then drops low at the end
      const heightBob = Math.sin(op * Math.PI) * 1.2;
      const dropAtEnd = easeOutCubic(Math.max(0, (op - 0.7) / 0.3)) * 2.4;
      const camY = midY + 2.9 + heightBob - dropAtEnd;
      camera.position.x = Math.sin(orbitAngle) * orbitDist;
      camera.position.z = Math.cos(orbitAngle) * orbitDist;
      camera.position.y = camY;
      // LookAt target also rises as camera drops — creates upward tilt at the end
      const lookAtY = midY + easeOutCubic(Math.max(0, (op - 0.7) / 0.3)) * (maxY - midY) * 0.8;
      camera.lookAt(0, lookAtY, 0);
    }

    // ── Clip plane: build completes by BUILD_END, stays fully open after ──
    const INITIAL_BUILD = 0.15;
    const buildProgress = Math.min(progress / BUILD_END, 1);
    const rawT = easeOutCubic(buildProgress);
    const buildT = INITIAL_BUILD + rawT * (1 - INITIAL_BUILD);
    const buffer = (maxY - minY) * 0.6 || 1.0;
    clipPlane.constant = THREE.MathUtils.lerp(minY, maxY + buffer, buildT);
  });

  return (
    <>
      <hemisphereLight args={["#e8f4ff", "#5a4a38", 1.2]} />
      <ambientLight intensity={1.0} />
      <directionalLight
        position={[10, 12, 6]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={isMobile ? 512 : 1024}
        shadow-mapSize-height={isMobile ? 512 : 1024}
        shadow-camera-far={30}
        shadow-camera-near={0.1}
      />
      <directionalLight position={[-8, 6, -4]} intensity={1.0} />
      <directionalLight position={[0, 4, 12]} intensity={0.8} />
      <Suspense fallback={null}>
        <HouseModel progress={progress} clipPlane={clipPlane} onBounds={onBounds} isMobile={isMobile} />
      </Suspense>
      {/* Shadow fades in as the house builds: barely-there at start, solid at finish.
          Position y=0.6 matches the house-base nudge so the shadow sits under the walls. */}
      <ContactShadows
        position={[0, 0.6, 0]}
        opacity={0.1 + progress * 0.5}
        scale={12}
        blur={1.2}
        far={3}
      />
      {/* Perspective grid for depth — fades in with build progress */}
      <Grid
        position={[0, 0.58, 0]}
        args={[100, 100]}
        cellSize={0.6}
        cellThickness={0.5}
        cellColor="#8a7a68"
        sectionSize={3}
        sectionThickness={0.8}
        sectionColor="#6b5a48"
        fadeDistance={22}
        fadeStrength={2.0}
        followCamera={false}
        infiniteGrid
        renderOrder={-1}
      />
    </>
  );
}

export default function ScrollHouse({ progress }: { progress: number }) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  // Incrementing this key forces the Canvas to fully remount after context loss
  const [canvasKey, setCanvasKey] = useState(0);
  const retryCount = useRef(0);
  const isMobile = useIsMobile();
  const boundsRef = useRef<Bounds>({ minY: -0.2, maxY: 3.4 });
  // Local plane instance (not shared with the hero canvas) so each Canvas
  // controls its own reveal independently.
  const clipPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, -1, 0), -1000),
    [],
  );

  const handleBounds = useCallback((bounds: Bounds) => {
    boundsRef.current = bounds;
  }, []);

  useEffect(() => {
    setWebglSupported(hasWebGL());
    // Kick off the GLTF load immediately so it's ready when the canvas mounts
    getGltfPromise();
  }, []);

  if (webglSupported === false) {
    return (
      <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b from-muted/40 to-background" />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {webglSupported && (
        <Canvas
          key={canvasKey}
          shadows
          camera={CAMERA_CONFIG}
          gl={GL_CONFIG}
          style={{ pointerEvents: "none" }}
          // Cap pixel ratio on mobile to 1.5 — halves GPU fill-rate cost on high-DPI phones
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => {
                e.preventDefault(); // allow browser to attempt restore
                // If the context is not restored within 300 ms, force a remount
                // so Three.js creates a brand-new WebGL context (max 3 retries)
                if (retryCount.current < 3) {
                  retryCount.current += 1;
                  setTimeout(() => setCanvasKey((k) => k + 1), 300);
                }
              },
              false,
            );
          }}
        >
          <Scene
            progress={progress}
            clipPlane={clipPlane}
            boundsRef={boundsRef}
            onBounds={handleBounds}
            isMobile={isMobile}
          />
        </Canvas>
      )}
    </div>
  );
}
