import { useRef, useEffect, useState, useMemo, useCallback, Suspense, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useGltfWithPlugin, hasWebGL, cloneGltfScene } from "./houseLoader";
import { getGltfPromise } from "./houseLoader";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type Bounds = { minY: number; maxY: number };

function HouseModel({
  progress,
  clipPlane,
  onBounds,
}: {
  progress: number;
  clipPlane: THREE.Plane;
  onBounds: (bounds: Bounds) => void;
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
    return { normScale: s, centerOffset: center };
  }, [scene]);

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
    // Slight fixed angle so the house shows its side — "немного боком"
    groupRef.current.rotation.y = Math.PI * 0.08;
    groupRef.current.updateMatrixWorld(true);

    // Lift so base sits at Y = 0, house floats in upper half of view
    const box0 = new THREE.Box3().setFromObject(groupRef.current);
    groupRef.current.position.setY(-box0.min.y);
    groupRef.current.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(groupRef.current);
    onBounds({ minY: box.min.y, maxY: box.max.y });
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
}: {
  progress: number;
  clipPlane: THREE.Plane;
  boundsRef: React.MutableRefObject<Bounds>;
  onBounds: (bounds: Bounds) => void;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const { minY, maxY } = boundsRef.current;
    const midY = (minY + maxY) * 0.5;

    // Camera orbits from front (0°) to ~30° as user scrolls — matches screenshot angle
    const angle = progress * Math.PI * 0.17;
    const dist = 9;
    camera.position.x = Math.sin(angle) * dist;
    camera.position.z = Math.cos(angle) * dist;
    // Keep camera well above house mid-point so the roof is always in frame
    camera.position.y = midY + 2.5 + progress * 0.4;
    camera.lookAt(0, midY, 0);

    const buildT = easeOutCubic(Math.min(Math.max(progress, 0), 1));
    const buffer = (maxY - minY) * 0.18 || 0.3;
    // Start at minY so the foundation slab is visible from the very first frame;
    // end past maxY so the roof is fully revealed without clipping.
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
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={30}
        shadow-camera-near={0.1}
      />
      <directionalLight position={[-8, 6, -4]} intensity={1.0} />
      <directionalLight position={[0, 4, 12]} intensity={0.8} />
      <Suspense fallback={null}>
        <HouseModel progress={progress} clipPlane={clipPlane} onBounds={onBounds} />
      </Suspense>
      {/* Shadow fades in as the house builds: barely-there at start, solid at finish */}
      <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.1 + progress * 0.5}
        scale={10}
        blur={1.4}
        far={5}
      />
    </>
  );
}

export default function ScrollHouse({ progress }: { progress: number }) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
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
    <div className="absolute inset-0 -z-10 pointer-events-none">
      {webglSupported && (
        <Canvas
          shadows
          camera={{ position: [0, 5, 9], fov: 42 }}
          gl={{
            localClippingEnabled: true,
            failIfMajorPerformanceCaveat: false,
            antialias: true,
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
          <Scene
            progress={progress}
            clipPlane={clipPlane}
            boundsRef={boundsRef}
            onBounds={handleBounds}
          />
        </Canvas>
      )}
    </div>
  );
}
