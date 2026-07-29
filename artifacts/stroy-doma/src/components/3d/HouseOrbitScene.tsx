import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Sky, ContactShadows, Center } from "@react-three/drei";
import { Suspense, useEffect, Component, type ReactNode } from "react";
import * as THREE from "three";

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) {
      return (
        <div className="w-full h-full bg-gradient-to-b from-[#b5c6d8] to-[#e6ecef] flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/30 animate-pulse" />
        </div>
      );
    }
    return this.props.children;
  }
}

function HouseModel() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}house.glb`);
  
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <Center bottom position={[0, 0, 0]}>
      <primitive object={scene} />
    </Center>
  );
}

// Preload the model
useGLTF.preload(`${import.meta.env.BASE_URL}house.glb`);

function CameraRig() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const duration = 12; // 12 seconds loop
    const normalizedTime = (t % duration) / duration;
    
    // Smooth easing for camera rotation and height
    const radius = 22; 
    const angle = normalizedTime * Math.PI * 2;
    
    // Height changes: low -> mid -> high -> low smoothly
    const height = 6 + Math.sin(normalizedTime * Math.PI * 2 - Math.PI / 2) * 4;
    
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    state.camera.position.set(x, height, z);
    state.camera.lookAt(0, 3, 0); // look at the center of the house
  });

  return null;
}

export function HouseOrbitScene() {
  return (
    <section className="w-full h-[60vh] md:h-[70vh] bg-gradient-to-b from-[#b5c6d8] to-[#e6ecef] relative overflow-hidden border-b border-border">
      <WebGLErrorBoundary>
        <Canvas shadows camera={{ fov: 45, position: [0, 10, 25] }}>
          <Suspense fallback={null}>
            <Sky 
              distance={450000} 
              sunPosition={[20, 10, -20]} 
              inclination={0.2} 
              azimuth={0.25} 
              turbidity={1.5} 
              rayleigh={0.8} 
            />
            <Environment preset="sunset" />
            
            <ambientLight intensity={0.6} color="#ffecd1" />
            <directionalLight 
              castShadow 
              position={[20, 15, -20]} 
              intensity={2} 
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-20}
              shadow-camera-right={20}
              shadow-camera-top={20}
              shadow-camera-bottom={-20}
              shadow-bias={-0.001}
              color="#ffecd1"
            />
            <fog attach="fog" args={['#d1dce5', 20, 60]} />

            <HouseModel />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
              <planeGeometry args={[200, 200]} />
              <meshStandardMaterial color="#2d3d25" roughness={0.9} />
            </mesh>

            {/* Contact shadows for more realism */}
            <ContactShadows 
              position={[0, 0, 0]}
              resolution={1024} 
              scale={40} 
              blur={2} 
              opacity={0.6} 
              far={10} 
              color="#000000" 
            />

            <CameraRig />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </section>
  );
}
