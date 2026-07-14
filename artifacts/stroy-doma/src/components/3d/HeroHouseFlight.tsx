import { useRef, useEffect, useMemo, useState, useCallback, Suspense, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useGltfWithPlugin, getGltfPromise, hasWebGL, cloneGltfScene } from "./houseLoader";

// ---------------------------------------------------------------------------
// Autoplaying, looping hero animation: the camera swoops in toward the house
// while it assembles from the foundation up (via a rising clipping plane),
// holds on the finished house, then rewinds quickly before looping.
// ---------------------------------------------------------------------------

const BUILD_MS = 4800;
const HOLD_MS = 2800;
const REWIND_MS = 1200;
const CYCLE_MS = BUILD_MS + HOLD_MS + REWIND_MS;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInCubic(t: number) {
  return t * t * t;
}

// Shared plane instance — its `constant` is mutated every frame to reveal
// the model bottom-up. Starts far below so nothing renders until ready.
const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1000);

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
  onBounds,
  isMobile,
}: {
  onBounds: (bounds: Bounds) => void;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const gltf = useGltfWithPlugin();
  // Independent clone — the cached gltf.scene is shared with other
  // simultaneously-mounted canvases (e.g. ScrollHouse), and an
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
    return { normScale: s * (isMobile ? 1.05 : 1), centerOffset: center };
  }, [scene, isMobile]);

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
    groupRef.current.rotation.y = Math.PI * 0.1;
    groupRef.current.updateMatrixWorld(true);

    // First pass — measure where the house sits
    const box0 = new THREE.Box3().setFromObject(groupRef.current);
    // Lift so the base is at Y = GROUND_Y, giving the camera clear room above and below
    const GROUND_Y = 1.2;
    const liftY = GROUND_Y - box0.min.y;
    groupRef.current.position.setY(liftY);
    groupRef.current.updateMatrixWorld(true);

    // Second pass — report the final bounds (after lift)
    const box = new THREE.Box3().setFromObject(groupRef.current);
    onBounds({ minY: box.min.y, maxY: box.max.y });
  }, [scene, normScale, onBounds]);

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}
      />
    </group>
  );
}

function ClipAndCameraRig({ boundsRef, isMobile }: { boundsRef: React.MutableRefObject<Bounds>; isMobile: boolean }) {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * 1000) % CYCLE_MS;

    let buildT: number;
    let cameraEase: number;
    let holdT = 0;

    if (t < BUILD_MS) {
      const localT = t / BUILD_MS;
      buildT = easeOutCubic(localT);
      cameraEase = buildT;
    } else if (t < BUILD_MS + HOLD_MS) {
      buildT = 1;
      cameraEase = 1;
      holdT = (t - BUILD_MS) / HOLD_MS;
    } else {
      const localT = (t - BUILD_MS - HOLD_MS) / REWIND_MS;
      const eased = easeInCubic(localT);
      buildT = 1 - eased;
      cameraEase = 1 - eased;
    }

    const { minY, maxY } = boundsRef.current;
    // Dynamic house centre — camera always looks at mid-height
    const midY = (minY + maxY) * 0.5;

    // Camera swoop: start high & distant, settle at a comfortable angle that
    // shows the full house (base to ridge) with margin on all sides.
    const angleStart = -1.15;
    const angleEnd   = 0.5;
    const distStart  = isMobile ? 34 : 26;
    const distEnd    = isMobile ? 22 : 16;
    const heightStart = midY + 8;
    const heightEnd   = midY + 4.5;

    const drift  = holdT * 0.18;
    const angle  = THREE.MathUtils.lerp(angleStart, angleEnd, cameraEase) + drift;
    const dist   = THREE.MathUtils.lerp(distStart,  distEnd,  cameraEase);
    const height = THREE.MathUtils.lerp(heightStart, heightEnd, cameraEase);

    camera.position.set(Math.sin(angle) * dist, height, Math.cos(angle) * dist);
    camera.lookAt(0, midY, 0);

    const buffer = (maxY - minY) * 0.18 || 0.3;
    clipPlane.constant = THREE.MathUtils.lerp(minY - buffer, maxY + buffer, buildT);
  });

  return null;
}

export default function HeroHouseFlight() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const isMobile = useIsMobile();
  const boundsRef = useRef<Bounds>({ minY: -0.2, maxY: 3.4 });

  const handleBounds = useCallback((bounds: Bounds) => {
    boundsRef.current = bounds;
  }, []);

  useEffect(() => {
    setWebglSupported(hasWebGL());
    // Kick off the GLTF load immediately so it's ready as soon as possible
    getGltfPromise();
  }, []);

  if (webglSupported === false) {
    return <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 to-neutral-950" />;
  }

  return (
    <div className="absolute inset-0 bg-[#1c1a17]">
      {webglSupported && (
        <Canvas
          shadows
          camera={{ position: [0, 12, 24], fov: 42 }}
          gl={{
            localClippingEnabled: true,
            antialias: true,
            failIfMajorPerformanceCaveat: false,
            powerPreference: "default",
          }}
          onCreated={({ gl }) => {
            gl.localClippingEnabled = true;
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => e.preventDefault(),
              false,
            );
          }}
        >
          <color attach="background" args={["#1c1a17"]} />
          <fog attach="fog" args={["#1c1a17", 15, 34]} />
          <hemisphereLight args={["#e8f4ff", "#5a4a38", 1.2]} />
          <ambientLight intensity={1.0} />
          <directionalLight
            position={[10, 14, 6]}
            intensity={2.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={40}
            shadow-camera-near={0.1}
          />
          <directionalLight position={[-10, 6, -6]} intensity={1.0} />
          <directionalLight position={[0, 4, 12]} intensity={0.8} />
          <pointLight position={[0, 5, 8]} intensity={0.8} color="#ffdcb0" />
          <Suspense fallback={null}>
            <HouseModel onBounds={handleBounds} isMobile={isMobile} />
          </Suspense>
          <ClipAndCameraRig boundsRef={boundsRef} isMobile={isMobile} />
          <ContactShadows position={[0, 1.18, 0]} opacity={0.55} scale={16} blur={2.2} far={7} />
        </Canvas>
      )}
    </div>
  );
}
