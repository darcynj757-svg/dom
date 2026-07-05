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
    const s = maxDim > 0 ? 4.2 / maxDim : 1;
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
    groupRef.current.rotation.y = Math.PI * 0.08;
    groupRef.current.updateMatrixWorld(true);

    // Lift so base sits at Y = 0
    const box0 = new THREE.Box3().setFromObject(groupRef.current);
    groupRef.current.position.setY(-box0.min.y);
    groupRef.current.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(groupRef.current);
    onBounds({ minY: box.min.y, maxY: box.max.y });
  }, [scene, normScale, clipPlane, onBounds]);

  useFrame(() => {
    if (!groupRef.current) return;
    // Gentle rise as the build progresses
    groupRef.current.position.y = 0 + progress * 0.2;
  });

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
    // Camera orbits from front (0°) to ~30° as user scrolls — matches screenshot angle
    const angle = progress * Math.PI * 0.17;
    camera.position.x = Math.sin(angle) * 7;
    camera.position.z = Math.cos(angle) * 7;
    camera.position.y = 3.0 + progress * 0.5;
    camera.lookAt(0, 2.0, 0);

    const buildT = easeOutCubic(Math.min(Math.max(progress, 0), 1));
    const { minY, maxY } = boundsRef.current;
    // 22% buffer ensures the roof ridge is fully revealed at progress=1
    const buffer = (maxY - minY) * 0.22 || 0.4;
    clipPlane.constant = THREE.MathUtils.lerp(minY - buffer, maxY + buffer, buildT);
  });

  return (
    <>
      <hemisphereLight args={["#cfe0ff", "#3a2f22", 0.7]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 12, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={30}
        shadow-camera-near={0.1}
      />
      <directionalLight position={[-8, 6, -4]} intensity={0.45} />
      <Suspense fallback={null}>
        <HouseModel progress={progress} clipPlane={clipPlane} onBounds={onBounds} />
      </Suspense>
      <ContactShadows position={[0, -0.02, 0]} opacity={0.45} scale={12} blur={2.5} far={6} />
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
          camera={{ position: [0, 2, 7], fov: 42 }}
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
