import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = `${import.meta.env.BASE_URL}house.glb`.replace(/\/+/g, "/").replace(":/", "://");

// Preload so it's ready when the component mounts
useGLTF.preload(MODEL_URL);

function HouseModel({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(MODEL_URL);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // Compute bounding box once and normalise the model
  const { scale: normScale, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 4; // desired world-unit span
    const s = maxDim > 0 ? targetSize / maxDim : 1;
    const center = new THREE.Vector3();
    box.getCenter(center);
    return { scale: s, centerOffset: center };
  }, [clonedScene]);

  useFrame(() => {
    if (!groupRef.current) return;
    // Ease in: scale from 0 to normScale, rise from below
    const easedProgress = progress < 0.001 ? 0 : progress;
    const s = normScale * easedProgress;
    groupRef.current.scale.setScalar(Math.max(s, 0.0001));
    groupRef.current.position.y = -1 + easedProgress * 1;
  });

  return (
    <group ref={groupRef}>
      {/* Centre the model on its own bounding box */}
      <primitive
        object={clonedScene}
        position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}
      />
    </group>
  );
}

function Scene({ progress }: { progress: number }) {
  const { camera } = useThree();

  useFrame(() => {
    // Orbit the camera as the model builds
    const angle = progress * Math.PI * 0.5;
    camera.position.x = Math.sin(angle) * 7;
    camera.position.z = Math.cos(angle) * 7;
    camera.position.y = 2 + progress * 1;
    camera.lookAt(0, 0.5, 0);
  });

  return (
    <>
      <Environment preset="forest" />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 12, 6]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={30}
        shadow-camera-near={0.1}
      />
      <directionalLight position={[-8, 6, -4]} intensity={0.4} />
      <Suspense fallback={null}>
        <HouseModel progress={progress} />
      </Suspense>
      <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={12} blur={2.5} far={6} />
    </>
  );
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export default function ScrollHouse({ progress }: { progress: number }) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(hasWebGL());
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
            failIfMajorPerformanceCaveat: false,
            antialias: true,
            powerPreference: "default",
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => e.preventDefault(),
              false,
            );
          }}
        >
          <Scene progress={progress} />
        </Canvas>
      )}
    </div>
  );
}
