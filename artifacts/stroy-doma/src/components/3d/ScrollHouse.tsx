import { useRef, useEffect, useState, useMemo, useCallback, Suspense, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Grid } from "@react-three/drei";
import * as THREE from "three";
import {
  useGltfWithPlugin,
  hasWebGL,
  cloneGltfScene,
  preloadDracoDecoder,
  getHouseModelUrl,
} from "./houseLoader";
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
function smootherstep(t: number) {
  const clamped = THREE.MathUtils.clamp(t, 0, 1);
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
}

type Bounds = { minY: number; maxY: number };

const HOUSE_FINISH_START = 0.70;
const VARNISH_START = 0.84;
const VARNISH_ROUGHNESS = 0.22;
const DELAYED_PART_MATERIALS = new Set([
  // Roof structure and dark roofing surface.
  "Material15",
  "Material58",
  "Material60",
  // Window frames, glass and dark opening details.
  "Material5",
  "Material11",
  "Material13",
  "Material23",
]);

type DelayedMaterial = {
  material: THREE.Material;
  baseOpacity: number;
  baseDepthWrite: boolean;
};

type DelayedMesh = {
  mesh: THREE.Mesh;
  materials: DelayedMaterial[];
};

type VarnishableMaterial = THREE.Material & {
  color?: THREE.Color;
  roughness?: number;
  envMapIntensity?: number;
};

type VarnishTarget = {
  material: VarnishableMaterial;
  baseColor: THREE.Color;
  baseRoughness?: number;
  baseEnvMapIntensity?: number;
};

function useIsMobile(initialValue = false) {
  // ScrollHouse mounts client-side after the parent has measured the viewport,
  // so the first render can select the correct GLB without loading desktop first.
  const [isMobile, setIsMobile] = useState(initialValue);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

function HouseModel({
  progress,
  clipPlane,
  onBounds,
  onReady,
  isMobile,
  modelUrl,
}: {
  progress: number;
  clipPlane: THREE.Plane;
  onBounds: (bounds: Bounds) => void;
  onReady: () => void;
  isMobile: boolean;
  modelUrl: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const gltf = useGltfWithPlugin(modelUrl);
  // Independent clone — the cached gltf.scene is shared with other
  // simultaneously-mounted canvases (e.g. HeroHouseFlight), and an
  // Object3D can only belong to one parent at a time.
  const scene = useMemo(() => cloneGltfScene(gltf.scene), [gltf.scene]);
  const delayedParts = useMemo<DelayedMesh[]>(() => {
    const parts: DelayedMesh[] = [];
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materialName = mesh.name.replace(/_\d+$/, "");
      if (!DELAYED_PART_MATERIALS.has(materialName)) return;
      const materials = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map(
        (material) => ({
          material: material as THREE.Material,
          baseOpacity: (material as THREE.Material).opacity,
          baseDepthWrite: (material as THREE.Material).depthWrite,
        }),
      );
      parts.push({ mesh, materials });
    });
    return parts;
  }, [scene]);
  const varnishTargets = useMemo<VarnishTarget[]>(() => {
    const targets: VarnishTarget[] = [];

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      const materialName = mesh.name.replace(/_\d+$/, "");
      if (DELAYED_PART_MATERIALS.has(materialName)) return;

      const materials = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as VarnishableMaterial[];
      materials.forEach((material) => {
        if (!material.color?.isColor) return;

        targets.push({
          material,
          baseColor: material.color.clone(),
          baseRoughness: material.roughness,
          baseEnvMapIntensity: material.envMapIntensity,
        });
      });
    });

    return targets;
  }, [scene]);

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

    delayedParts.forEach(({ mesh, materials }) => {
      mesh.visible = false;
      materials.forEach(({ material }) => {
        material.transparent = true;
        material.opacity = 0;
        material.depthWrite = false;
        material.needsUpdate = true;
      });
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
    onReady();
  }, [scene, normScale, clipPlane, delayedParts, onBounds, onReady]);

  useFrame(() => {
    const finishProgress = THREE.MathUtils.clamp(
      (progress - HOUSE_FINISH_START) / (1 - HOUSE_FINISH_START),
      0,
      1,
    );
    const reveal = easeInOutCubic(finishProgress);
    const varnishProgress = smootherstep(
      THREE.MathUtils.clamp(
        (progress - VARNISH_START) / (1 - VARNISH_START),
        0,
        1,
      ),
    );

    delayedParts.forEach(({ mesh, materials }) => {
      mesh.visible = reveal > 0.001;
      materials.forEach(({ material, baseOpacity, baseDepthWrite }) => {
        material.opacity = baseOpacity * reveal;
        const shouldWriteDepth = reveal >= 0.999 ? baseDepthWrite : false;
        if (material.depthWrite !== shouldWriteDepth) {
          material.depthWrite = shouldWriteDepth;
          material.needsUpdate = true;
        }
      });
    });

    varnishTargets.forEach(({ material, baseColor, baseRoughness, baseEnvMapIntensity }) => {
      material.color?.copy(baseColor);
      if (typeof baseRoughness === "number" && typeof material.roughness === "number") {
        material.roughness = THREE.MathUtils.lerp(
          baseRoughness,
          Math.min(baseRoughness, VARNISH_ROUGHNESS),
          varnishProgress,
        );
      }
      if (
        typeof baseEnvMapIntensity === "number" &&
        typeof material.envMapIntensity === "number"
      ) {
        material.envMapIntensity = THREE.MathUtils.lerp(
          baseEnvMapIntensity,
          Math.max(baseEnvMapIntensity, 1.15),
          varnishProgress,
        );
      }
    });
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
  onModelReady,
  isMobile,
  modelUrl,
  backgroundColor,
  smoothMotion,
  showGrid,
}: {
  progress: number;
  clipPlane: THREE.Plane;
  boundsRef: React.MutableRefObject<Bounds>;
  onBounds: (bounds: Bounds) => void;
  onModelReady: () => void;
  isMobile: boolean;
  modelUrl: string;
  backgroundColor?: string;
  smoothMotion?: boolean;
  showGrid?: boolean;
}) {
  const { camera, scene } = useThree();
  const targetCameraPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const smoothedLookAt = useRef(new THREE.Vector3());
  const targetClipConstant = useRef(0);
  const motionInitialized = useRef(false);

  useEffect(() => {
    scene.background = backgroundColor ? new THREE.Color(backgroundColor) : null;
    return () => {
      scene.background = null;
    };
  }, [backgroundColor, scene]);

  useFrame((_, delta) => {
    const { minY, maxY } = boundsRef.current;
    const midY = (minY + maxY) * 0.5;

    // ── Cinematic camera path ────────────────────────────────────────────────
    // The camera starts moving during construction, so the model does not feel
    // locked to one angle while the first layers appear. Once the house is
    // complete, the remaining scroll becomes a full orbit with a gentle rise,
    // dip, and push-in.
    // Keep the construction story on screen longer before the camera enters
    // the fast reveal orbit.
    const BUILD_END = 0.70;
    // Preferred finished-house frame: front three-quarter view with the
    // entrance/terrace readable on the left and the long wall opening to the
    // right. The 360° orbit starts and ends on this same azimuth.
    const FINISHED_AZIMUTH = Math.PI * 0.20;
    const baseDist = isMobile ? 15 : 12;

    // On mobile the title + stats overlays eat ~35% of the screen,
    // so shift the lookAt target up to keep the house visually centred
    // in the uncovered middle zone.
    const mobileLookAtOffset = isMobile ? 0.2 : 0;

    if (progress <= BUILD_END) {
      // Build phase: front three-quarter view → side three-quarter view.
      const bp = progress / BUILD_END;
      const buildEase = easeInOutCubic(bp);
      const angle = THREE.MathUtils.lerp(-Math.PI * 0.2, FINISHED_AZIMUTH, buildEase);
      const dist = baseDist + 1.8 - Math.sin(bp * Math.PI) * 1.0;
      const height = midY + 2.25 + Math.sin(bp * Math.PI) * 0.9 + bp * 0.3;
      targetCameraPosition.current.set(
        Math.sin(angle) * dist,
        height,
        Math.cos(angle) * dist,
      );
      targetLookAt.current.set(0, midY + mobileLookAtOffset, 0);
    } else {
      // Cinematic orbit — normalise to 0→1 (exactly one 360° turn).
      // Start close to the front facade, rise above the roof for the
      // silhouette reveal, then settle back into the selected final frame.
      const op = (progress - BUILD_END) / (1 - BUILD_END);
      const eop = easeInOutCubic(op);
      const startAngle = FINISHED_AZIMUTH;
      const orbitAngle =
        startAngle + eop * Math.PI * 2 + Math.sin(op * Math.PI * 2) * 0.12;
      const facadePush = easeOutCubic(Math.min(op / 0.24, 1)) * 0.85;
      const roofRise = easeOutCubic(Math.min(op / 0.34, 1)) * 0.9;
      // Move in for the facade, open up around the roof/rear reveal, and
      // finish at the same close final distance as the selected frame.
      const orbitDist =
        baseDist -
        0.35 -
        facadePush -
        eop * 1.9 -
        Math.sin(op * Math.PI) * 0.65 -
        Math.sin(op * Math.PI * 2) * 0.35;
      // Rise early enough to expose the roof while the camera is still
      // travelling across the front and side elevations.
      const heightBob = roofRise + Math.sin(op * Math.PI) * 0.72;
      const secondaryBob = Math.sin(op * Math.PI * 2) * 0.55;
      const endDrop = easeOutCubic(Math.max(0, (op - 0.78) / 0.22)) * 1.0;
      const camY = midY + 2.45 + heightBob + secondaryBob - endDrop;
      const lookAtY = midY + mobileLookAtOffset + Math.sin(op * Math.PI) * 0.22;
      targetCameraPosition.current.set(
        Math.sin(orbitAngle) * orbitDist,
        camY,
        Math.cos(orbitAngle) * orbitDist,
      );
      targetLookAt.current.set(0, lookAtY, 0);
    }

    // ── Clip plane: start with the foundation footprint visible, then build
    // through the same model as the user scrolls. Keeping this reveal small
    // makes the first loaded frame read as the foundation from the reference.
    // The mobile GLB has a different vertical fit than desktop, so its
    // foundation needs a higher initial reveal to remain visible on narrow
    // screens instead of being clipped below the frame.
    const INITIAL_BUILD = isMobile ? 0.26 : 0.22;
    const buildProgress = Math.min(progress / BUILD_END, 1);
    // Ease in and out instead of revealing most of the house in the first
    // scroll beats. The actual GLB foundation remains visible at progress 0.
    const rawT = smoothMotion ? smootherstep(buildProgress) : easeInOutCubic(buildProgress);
    const buildT = INITIAL_BUILD + rawT * (1 - INITIAL_BUILD);
    const buffer = (maxY - minY) * 0.6 || 1.0;
    targetClipConstant.current = THREE.MathUtils.lerp(minY, maxY + buffer, buildT);

    if (smoothMotion) {
      if (!motionInitialized.current) {
        camera.position.copy(targetCameraPosition.current);
        smoothedLookAt.current.copy(targetLookAt.current);
        camera.lookAt(smoothedLookAt.current);
        clipPlane.constant = targetClipConstant.current;
        motionInitialized.current = true;
      } else {
        const damping = 1 - Math.exp(-delta / 0.13);
        camera.position.lerp(targetCameraPosition.current, damping);
        smoothedLookAt.current.lerp(targetLookAt.current, damping);
        camera.lookAt(smoothedLookAt.current);
        clipPlane.constant = THREE.MathUtils.damp(
          clipPlane.constant,
          targetClipConstant.current,
          8,
          delta,
        );
      }
    } else {
      camera.position.copy(targetCameraPosition.current);
      camera.lookAt(targetLookAt.current);
      clipPlane.constant = targetClipConstant.current;
    }
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
        <HouseModel
          progress={progress}
          clipPlane={clipPlane}
          onBounds={onBounds}
          onReady={onModelReady}
          isMobile={isMobile}
          modelUrl={modelUrl}
        />
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
      {showGrid !== false ? (
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
      ) : null}
    </>
  );
}

export function preloadHouseModel(isMobile: boolean) {
  preloadDracoDecoder();
  const modelUrl = getHouseModelUrl(isMobile);
  if (typeof document !== "undefined") {
    const variant = isMobile ? "mobile" : "desktop";
    const existing = document.querySelector(
      `link[data-house-model-preload="${variant}"]`,
    );
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "fetch";
      link.crossOrigin = "anonymous";
      link.href = modelUrl;
      link.dataset.houseModelPreload = variant;
      document.head.appendChild(link);
    }
  }
  void getGltfPromise(modelUrl).catch(() => {
    // The Suspense consumer will surface the cached loader error if rendering
    // is attempted; this catch only prevents an unhandled prefetch rejection.
  });
}

export default function ScrollHouse({
  progress,
  backgroundColor,
  smoothMotion,
  showGrid,
  mobileHint,
}: {
  progress: number;
  /** Optional test-only canvas background; omitted in production scenes. */
  backgroundColor?: string;
  /** Test-only temporal damping; production scenes keep their original timing. */
  smoothMotion?: boolean;
  /** Test-only background cleanup; production scenes keep their grid. */
  showGrid?: boolean;
  /** Viewport measured by the parent before this client-only component mounts. */
  mobileHint?: boolean;
}) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [modelReady, setModelReady] = useState(false);
  // Incrementing this key forces the Canvas to fully remount after context loss
  const [canvasKey, setCanvasKey] = useState(0);
  const retryCount = useRef(0);
  const isMobile = useIsMobile(mobileHint);
  const modelUrl = getHouseModelUrl(isMobile);
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
  const handleModelReady = useCallback(() => {
    setModelReady(true);
  }, []);
  useEffect(() => {
    setModelReady(false);
    setWebglSupported(hasWebGL());
    // Load the decoder in parallel with the model, but only after this
    // below-the-fold component has been activated by an actual scroll.
    preloadDracoDecoder();
    // Kick off the GLTF load immediately so it's ready when the canvas mounts
    getGltfPromise(modelUrl);
  }, [modelUrl]);

  if (webglSupported === false) {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        data-house-model-ready="unavailable"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      data-house-model-ready={modelReady ? "true" : "false"}
    >
      {webglSupported && (
        <Canvas
          key={canvasKey}
          shadows
          camera={CAMERA_CONFIG}
          gl={GL_CONFIG}
          style={{ pointerEvents: "none" }}
          data-house-canvas="true"
          // Cap pixel ratio on mobile to 1.5 — halves GPU fill-rate cost on high-DPI phones
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => {
                e.preventDefault();
                // Retry with a fresh renderer. We deliberately do not replace the
                // requested 3D house with an unrelated static image.
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
            onModelReady={handleModelReady}
            isMobile={isMobile}
            modelUrl={modelUrl}
            backgroundColor={backgroundColor}
            smoothMotion={smoothMotion}
            showGrid={showGrid}
          />
        </Canvas>
      )}
    </div>
  );
}
