import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const MODEL_URL = `${import.meta.env.BASE_URL}house.glb`
  .replace(/([^:])\/\//g, "$1/");

// ---------------------------------------------------------------------------
// KHR_materials_pbrSpecularGlossiness plugin
// Removed from Three.js core in r156. This plugin converts specular-glossiness
// materials to MeshStandardMaterial so embedded textures render correctly.
// ---------------------------------------------------------------------------
class GLTFSpecularGlossinessExtension {
  name = "KHR_materials_pbrSpecularGlossiness";
  parser: any;

  constructor(parser: any) {
    this.parser = parser;
  }

  getMaterialType(materialIndex: number) {
    const mat = this.parser.json.materials?.[materialIndex];
    if (!mat?.extensions?.[this.name]) return null;
    return THREE.MeshStandardMaterial;
  }

  extendMaterialParams(
    materialIndex: number,
    materialParams: Record<string, unknown>,
  ) {
    const mat = this.parser.json.materials?.[materialIndex];
    if (!mat?.extensions?.[this.name]) return Promise.resolve();

    const ext = mat.extensions[this.name] as {
      diffuseFactor?: number[];
      diffuseTexture?: { index: number };
      specularFactor?: number[];
      glossinessFactor?: number;
    };

    const pending: Promise<unknown>[] = [];

    // diffuseFactor → color  (GLTF values are in linear; THREE.Color + SRGBColorSpace converts)
    if (ext.diffuseFactor) {
      const [r, g, b, a = 1] = ext.diffuseFactor;
      materialParams.color = new THREE.Color(r, g, b);
      if (a < 1) {
        materialParams.opacity = a;
        materialParams.transparent = true;
      }
    }

    // diffuseTexture → map (sRGB colour texture)
    if (ext.diffuseTexture) {
      pending.push(
        this.parser.assignTexture(
          materialParams,
          "map",
          ext.diffuseTexture,
          THREE.SRGBColorSpace,
        ),
      );
    }

    // glossinessFactor → roughness (inverted)
    materialParams.roughness = 1.0 - (ext.glossinessFactor ?? 1.0);

    // specularFactor → metalness approximation via luminance
    if (ext.specularFactor) {
      const [sr, sg, sb] = ext.specularFactor;
      materialParams.metalness = Math.min(
        0.2126 * sr + 0.7152 * sg + 0.0722 * sb,
        1.0,
      );
    } else {
      materialParams.metalness = 0.0;
    }

    return Promise.all(pending);
  }
}

// ---------------------------------------------------------------------------
// We load directly with GLTFLoader (bypassing useLoader cache) so the plugin
// is guaranteed to be registered before .load() runs.
// Module-level cache so the result lives outside React state — this is the
// correct pattern for Suspense: throw the in-flight promise, return the
// cached value once resolved.
// ---------------------------------------------------------------------------

let _gltf: GLTF | null = null;
let _error: unknown = null;
let _suspendPromise: Promise<void> | null = null;

function getGltfPromise(): Promise<void> {
  if (!_suspendPromise) {
    _suspendPromise = new Promise<void>((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.register((parser) => new GLTFSpecularGlossinessExtension(parser));
      loader.load(
        MODEL_URL,
        (gltf) => {
          _gltf = gltf;
          resolve();
        },
        undefined,
        (err) => { _error = err; reject(err); },
      );
    });
  }
  return _suspendPromise;
}

/** Suspense-compatible hook — throws while loading, returns when ready. */
function useGltfWithPlugin(): GLTF {
  if (_error) throw _error;
  if (_gltf) return _gltf;
  throw getGltfPromise(); // Suspend
}

// ---------------------------------------------------------------------------

function HouseModel({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const gltf = useGltfWithPlugin();

  const { normScale, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? 4 / maxDim : 1;
    const center = new THREE.Vector3();
    box.getCenter(center);
    return { normScale: s, centerOffset: center };
  }, [gltf.scene]);

  // Enable shadows on all meshes once (stable ref, no re-clone needed)
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf.scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    const s = normScale * Math.max(progress, 0.0001);
    groupRef.current.scale.setScalar(s);
    groupRef.current.position.y = -1 + progress;
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={gltf.scene}
        position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}
      />
    </group>
  );
}

function Scene({ progress }: { progress: number }) {
  const { camera } = useThree();

  useFrame(() => {
    const angle = progress * Math.PI * 0.5;
    camera.position.x = Math.sin(angle) * 7;
    camera.position.z = Math.cos(angle) * 7;
    camera.position.y = 2 + progress;
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
