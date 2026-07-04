import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// A simple procedural house that builds itself based on a progress value (0 to 1)
function BuildingHouse({ progress }: { progress: number }) {
  const foundationRef = useRef<THREE.Mesh>(null!);
  const wallsRef = useRef<THREE.Group>(null!);
  const roofRef = useRef<THREE.Group>(null!);
  const detailsRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    // 0.0 - 0.25: Foundation rises
    const pFoundation = Math.min(Math.max(progress * 4, 0), 1);
    if (foundationRef.current) {
      foundationRef.current.position.y = -0.5 + pFoundation * 0.5;
      foundationRef.current.scale.y = Math.max(pFoundation, 0.01);
    }

    // 0.25 - 0.6: Walls appear and rise
    const pWalls = Math.min(Math.max((progress - 0.25) * (1 / 0.35), 0), 1);
    if (wallsRef.current) {
      wallsRef.current.position.y = -1 + pWalls * 1;
      wallsRef.current.scale.y = Math.max(pWalls, 0.01);
      wallsRef.current.visible = pWalls > 0;
    }

    // 0.6 - 0.85: Roof drops down
    const pRoof = Math.min(Math.max((progress - 0.6) * (1 / 0.25), 0), 1);
    if (roofRef.current) {
      roofRef.current.position.y = 3 - pRoof * 1.5;
      roofRef.current.scale.setScalar(Math.max(pRoof, 0.01));
      roofRef.current.visible = pRoof > 0;
    }

    // 0.85 - 1.0: Windows/Door pop in
    const pDetails = Math.min(Math.max((progress - 0.85) * (1 / 0.15), 0), 1);
    if (detailsRef.current) {
      detailsRef.current.scale.setScalar(Math.max(pDetails, 0.01));
      detailsRef.current.visible = pDetails > 0;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Foundation */}
      <mesh ref={foundationRef} position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.2, 0.2, 3.2]} />
        <meshStandardMaterial color="#888888" roughness={0.9} />
      </mesh>

      {/* Walls */}
      <group ref={wallsRef} position={[0, 0.1, 0]}>
        <mesh position={[0, 0.9, 0]} receiveShadow castShadow>
          <boxGeometry args={[4, 1.8, 3]} />
          <meshStandardMaterial color="#D4C4A8" roughness={0.7} />
        </mesh>
      </group>

      {/* Roof */}
      <group ref={roofRef} position={[0, 2, 0]}>
        <mesh position={[0, 0, 0]} receiveShadow castShadow rotation={[0, 0, 0]}>
          <coneGeometry args={[3, 1.5, 4]} />
          <meshStandardMaterial color="#3A403C" roughness={0.8} />
        </mesh>
      </group>

      {/* Details (Door, Windows) */}
      <group ref={detailsRef} position={[0, 0.1, 0]}>
        {/* Door */}
        <mesh position={[0, 0.6, 1.51]} receiveShadow castShadow>
          <boxGeometry args={[0.8, 1.2, 0.1]} />
          <meshStandardMaterial color="#5C3A21" roughness={0.6} />
        </mesh>
        
        {/* Window 1 */}
        <mesh position={[-1.2, 1, 1.51]} receiveShadow castShadow>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshStandardMaterial color="#A8C9D4" roughness={0.2} metalness={0.8} />
        </mesh>
        
        {/* Window 2 */}
        <mesh position={[1.2, 1, 1.51]} receiveShadow castShadow>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshStandardMaterial color="#A8C9D4" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

function Scene({ scrollY }: { scrollY: number }) {
  const { camera } = useThree();
  
  // Calculate progress based on scroll position (0 to 1 over first 1000px)
  const progress = Math.min(Math.max(scrollY / 800, 0), 1);
  
  useFrame(() => {
    // Slowly rotate the camera around the house as it builds
    camera.position.x = Math.sin(progress * Math.PI * 0.5) * 6;
    camera.position.z = Math.cos(progress * Math.PI * 0.5) * 6;
    camera.lookAt(0, 0.5, 0);
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      <BuildingHouse progress={progress} />
      <ContactShadows position={[0, -0.49, 0]} opacity={0.5} scale={10} blur={2} far={4} />
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

export default function ScrollHouse() {
  const [scrollY, setScrollY] = useState(0);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(hasWebGL());
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (webglSupported === false) {
    return (
      <div className="w-full h-[600px] md:h-[800px] sticky top-[72px] -z-10 pointer-events-none bg-gradient-to-b from-muted/40 to-background" />
    );
  }

  return (
    <div className="w-full h-[600px] md:h-[800px] sticky top-[72px] -z-10 pointer-events-none">
      {webglSupported && (
        <Canvas
          shadows
          camera={{ position: [0, 2, 6], fov: 45 }}
          gl={{ failIfMajorPerformanceCaveat: false, antialias: true, powerPreference: "default" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => e.preventDefault(),
              false,
            );
          }}
        >
          <Scene scrollY={scrollY} />
        </Canvas>
      )}
    </div>
  );
}
