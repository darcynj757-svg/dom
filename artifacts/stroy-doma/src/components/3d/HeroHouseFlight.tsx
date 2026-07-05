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

// Smaller model target size (was 5.5)
const MODEL_SIZE = 4.2;

// Ground level — house base sits here, giving camera headroom above
const GROUND_Y = 2.8;

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

function HouseModel({
  onBounds,
}: {
  onBounds: (bounds: Bounds) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const gltf = useGltfWithPlugin();
  const scene = useMemo(() => cloneGltfScene(gltf.scene), [gltf.scene]);

  const { normScale, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? MODEL_SIZE / maxDim : 1;
    const center = new THREE.Vector3();
    box.getCenter(center);
    return { normScale: s, centerOffset: center };
  }, [scene]);

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

    // First pass — measure where the model sits after scaling
    const box0 = new THREE.Box3().setFromObject(groupRef.current);
    // Lift so the base sits at GROUND_Y
    const liftY = GROUND_Y - box0.min.y;
    groupRef.current.position.setY(liftY);
    groupRef.current.updateMatrixWorld(true);

    // Second pass — report final bounds (post-lift)
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

// Combined rig: camera swoop + clip-plane build + glow light
function GlowAndCameraRig({ boundsRef }: { boundsRef: React.MutableRefObject<Bounds> }) {
  const { camera } = useThree();
  const glowRef = useRef<THREE.PointLight>(null!);

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
    const midY = (minY + maxY) * 0.5;

    // Inner glow: bright amber light as house assembles, fades when done
    if (glowRef.current) {
      glowRef.current.intensity = (1 - buildT) * 3.0 + 0.1;
      glowRef.current.position.set(0, midY, 0);
    }

    // Camera swoop path
    const angleStart = -1.15;
    const angleEnd   = 0.55;
    const distStart  = 22;
    const distEnd    = 13;
    const heightStart = midY + 6.5;
    const heightEnd   = midY + 4.5;

    const drift  = holdT * 0.18;
    const angle  = THREE.MathUtils.lerp(angleStart, angleEnd, cameraEase) + drift;
    const dist   = THREE.MathUtils.lerp(distStart,  distEnd,  cameraEase);
    const height = THREE.MathUtils.lerp(heightStart, heightEnd, cameraEase);

    camera.position.set(Math.sin(angle) * dist, height, Math.cos(angle) * dist);
    camera.lookAt(0, midY, 0);

    // Clip plane: reveal bottom-up with generous buffer so ridge is fully shown
    const buffer = (maxY - minY) * 0.22 || 0.4;
    clipPlane.constant = THREE.MathUtils.lerp(minY - buffer, maxY + buffer, buildT);
  });

  return (
    <pointLight
      ref={glowRef}
      color="#ffd080"
      intensity={3.0}
      distance={14}
      decay={2}
    />
  );
}

export default function HeroHouseFlight() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const boundsRef = useRef<Bounds>({ minY: GROUND_Y, maxY: GROUND_Y + 4 });

  const handleBounds = useCallback((bounds: Bounds) => {
    boundsRef.current = bounds;
  }, []);

  useEffect(() => {
    setWebglSupported(hasWebGL());
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
          camera={{ position: [0, GROUND_Y + 9, 22], fov: 42 }}
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
          <fog attach="fog" args={["#1c1a17", 18, 36]} />
          <hemisphereLight args={["#cfe0ff", "#3a2f22", 0.7]} />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 14, 6]}
            intensity={1.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={40}
            shadow-camera-near={0.1}
          />
          <directionalLight position={[-10, 6, -6]} intensity={0.5} />
          <Suspense fallback={null}>
            <HouseModel onBounds={handleBounds} />
          </Suspense>
          <GlowAndCameraRig boundsRef={boundsRef} />
          {/* Shadow always visible — subtle at start, looks natural when house completes */}
          <ContactShadows
            position={[0, GROUND_Y - 0.02, 0]}
            opacity={0.4}
            scale={14}
            blur={2.5}
            far={8}
          />
        </Canvas>
      )}
    </div>
  );
}
