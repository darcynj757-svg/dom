import { useRef, useEffect, useState, useMemo, useCallback, Suspense, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Grid } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
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
  alpha: true,
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

function cinematicOrbitProgress(t: number) {
  // Keep the beginning and the final frame calm while allowing the middle
  // section to carry the visual travel. The last 6% is an intentional hold
  // so the finished house can be read instead of stopping mid-motion.
  const active = THREE.MathUtils.clamp(t / 0.94, 0, 1);
  if (active < 0.22) {
    return smootherstep(active / 0.22) * 0.12;
  }
  if (active < 0.78) {
    return 0.12 + smootherstep((active - 0.22) / 0.56) * 0.76;
  }
  return 0.88 + smootherstep((active - 0.78) / 0.22) * 0.12;
}

type Bounds = { minY: number; maxY: number };
type ScrollProgress = number | MotionValue<number>;

function readProgress(progress: ScrollProgress) {
  return typeof progress === "number" ? progress : progress.get();
}

function ProgressiveContactShadows({
  progress,
  isMobile,
}: {
  progress: ScrollProgress;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const opacity = 0.1 + readProgress(progress) * 0.5;
    group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        material.opacity = opacity;
      });
    });
  });

  return (
    <ContactShadows
      ref={groupRef}
      position={[0, 0.6, 0]}
      opacity={0.1}
      scale={12}
      blur={1.2}
      far={3}
      frames={isMobile ? 1 : Infinity}
    />
  );
}

const HOUSE_FINISH_START = 0.70;
const HOUSE_STAIN_START = 0.76;
const VARNISH_START = 0.84;
const VARNISH_ROUGHNESS = 0.22;
const HOUSE_STAIN_COLOR = new THREE.Color("#a5653e");
const HOUSE_STAIN_STRENGTH = 0.52;
const WOOD_MATERIALS = new Set([
  // Facade, timber walls, and warm wood trim. Roof, glass, stone, and brick
  // materials intentionally stay outside this set.
  "Material12",
  "Material19",
  "Material22",
  "Material14",
  "Material6",
]);
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

type ShaderUniform = { value: number };

type VarnishTarget = {
  material: VarnishableMaterial;
  baseColor: THREE.Color;
  baseRoughness?: number;
  baseEnvMapIntensity?: number;
};

type GlassTarget = {
  material: VarnishableMaterial;
  baseRoughness?: number;
  highlightUniform?: ShaderUniform;
  timeUniform?: ShaderUniform;
};

type WoodTarget = VarnishTarget & {
  tintUniform?: { value: THREE.Color };
  tintStrengthUniform?: ShaderUniform;
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
  progress: ScrollProgress;
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
  const varnishTargets = useMemo<WoodTarget[]>(() => {
    const targets: WoodTarget[] = [];

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      const materialName = mesh.name.replace(/_\d+$/, "");
      if (DELAYED_PART_MATERIALS.has(materialName) || !WOOD_MATERIALS.has(materialName)) {
        return;
      }

      const materials = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as VarnishableMaterial[];
      materials.forEach((material) => {
        if (!material.color?.isColor) return;

        const target: WoodTarget = {
          material,
          baseColor: material.color.clone(),
          baseRoughness: material.roughness,
          baseEnvMapIntensity: material.envMapIntensity,
        };

        const baseOnBeforeCompile = material.onBeforeCompile;
        material.onBeforeCompile = (shader, renderer) => {
          baseOnBeforeCompile(shader, renderer);
          shader.uniforms.woodTint = { value: HOUSE_STAIN_COLOR.clone() };
          shader.uniforms.woodTintStrength = { value: 0 };
          shader.fragmentShader = [
            "uniform vec3 woodTint;",
            "uniform float woodTintStrength;",
            shader.fragmentShader.replace(
              "#include <map_fragment>",
              [
                "#include <map_fragment>",
                "diffuseColor.rgb *= mix(vec3(1.0), woodTint, woodTintStrength);",
              ].join("\n"),
            ),
          ].join("\n");
          target.tintUniform = shader.uniforms.woodTint;
          target.tintStrengthUniform = shader.uniforms.woodTintStrength;
        };
        material.needsUpdate = true;
        targets.push(target);
      });
    });

    return targets;
  }, [scene]);
  const glassTargets = useMemo<GlassTarget[]>(() => {
    const targets: GlassTarget[] = [];

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materialName = mesh.name.replace(/_\d+$/, "");
      if (materialName !== "Material23") return;

      const materials = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as VarnishableMaterial[];
      materials.forEach((material) => {
        const target: GlassTarget = {
          material,
          baseRoughness: material.roughness,
        };
        const baseOnBeforeCompile = material.onBeforeCompile;
        material.onBeforeCompile = (shader, renderer) => {
          baseOnBeforeCompile(shader, renderer);
          shader.uniforms.glassHighlight = { value: 0 };
          shader.uniforms.glassTime = { value: 0 };
          shader.fragmentShader = [
            "uniform float glassHighlight;",
            "uniform float glassTime;",
            shader.fragmentShader.replace(
              "#include <emissivemap_fragment>",
              [
                "#include <emissivemap_fragment>",
                "float glassWave = 0.5 + 0.5 * sin(gl_FragCoord.x * 0.018 + gl_FragCoord.y * 0.004 + glassTime * 1.4);",
                "float glassSweep = smoothstep(0.94, 0.995, glassWave) * glassHighlight;",
                "totalEmissiveRadiance += vec3(0.48, 0.72, 1.0) * (0.08 * glassHighlight + 0.62 * glassSweep);",
              ].join("\n"),
            ),
          ].join("\n");
          target.highlightUniform = shader.uniforms.glassHighlight;
          target.timeUniform = shader.uniforms.glassTime;
        };
        material.needsUpdate = true;
        targets.push(target);
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

  useFrame((state) => {
    const currentProgress = THREE.MathUtils.clamp(readProgress(progress), 0, 1);
    const finishProgress = THREE.MathUtils.clamp(
      (currentProgress - HOUSE_FINISH_START) / (1 - HOUSE_FINISH_START),
      0,
      1,
    );
    const reveal = easeInOutCubic(finishProgress);
    const varnishProgress = smootherstep(
      THREE.MathUtils.clamp(
        (currentProgress - VARNISH_START) / (1 - VARNISH_START),
        0,
        1,
      ),
    );
    const stainProgress = smootherstep(
      THREE.MathUtils.clamp(
        (currentProgress - HOUSE_STAIN_START) / (1 - HOUSE_STAIN_START),
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

    varnishTargets.forEach(({ tintUniform, tintStrengthUniform }) => {
      if (tintUniform) tintUniform.value.copy(HOUSE_STAIN_COLOR);
      if (tintStrengthUniform) {
        tintStrengthUniform.value = stainProgress * HOUSE_STAIN_STRENGTH;
      }
    });

    glassTargets.forEach(({ material, baseRoughness, highlightUniform, timeUniform }) => {
      if (typeof baseRoughness === "number" && typeof material.roughness === "number") {
        material.roughness = THREE.MathUtils.lerp(baseRoughness, 0.08, varnishProgress);
      }
      if (highlightUniform) highlightUniform.value = varnishProgress;
      if (timeUniform) timeUniform.value = state.clock.elapsedTime;
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
  progress: ScrollProgress;
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
  const finishLightRef = useRef<THREE.PointLight>(null);
  const pointerTarget = useRef(new THREE.Vector2());
  const pointerOffset = useRef(new THREE.Vector2());

  useEffect(() => {
    if (isMobile) return;

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.current.set(
        (event.clientX / window.innerWidth - 0.5) * 2,
        (event.clientY / window.innerHeight - 0.5) * 2,
      );
    };
    const resetPointer = () => pointerTarget.current.set(0, 0);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", resetPointer);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", resetPointer);
    };
  }, [isMobile]);

  useEffect(() => {
    scene.background = backgroundColor ? new THREE.Color(backgroundColor) : null;
    return () => {
      scene.background = null;
    };
  }, [backgroundColor, scene]);

  useFrame((state, delta) => {
    const currentProgress = THREE.MathUtils.clamp(readProgress(progress), 0, 1);
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
    // Preferred finished-house frame: a more front-facing three-quarter view
    // with the entrance/terrace readable without looking down from above. The
    // 360° orbit starts and ends on this same azimuth.
    const FINISHED_AZIMUTH = Math.PI * 0.14;
    // Give the mobile overlays more breathing room while keeping the desktop
    // house large enough to read the facade and terrace details.
    const baseDist = isMobile ? 16.5 : 10.8;

    // On mobile the title + stats overlays eat ~35% of the screen,
    // so shift the lookAt target up to keep the house visually centred
    // in the uncovered middle zone.
    // Reserve the upper mobile band for the active construction card so its
    // detailed text never sits over the roof or upper walls.
    const mobileLookAtOffset = isMobile ? 0.9 : 0;
    // Keep the house centred in both the full browser and the narrower Replit
    // preview iframe. Looking a little to the right moves the model left on
    // screen. Replit's tablet-sized preview still has the desktop nav width,
    // but needs the preview correction because the stage panel uses the right
    // side of the frame.
    const frameOffsetX = isMobile
      ? 0.35
      : state.size.width < 1200
        ? 1.15
        : -1.6;

    if (currentProgress <= BUILD_END) {
      // Build phase: front three-quarter view → side three-quarter view.
      const bp = currentProgress / BUILD_END;
      const buildEase = easeInOutCubic(bp);
      const angle = THREE.MathUtils.lerp(-Math.PI * 0.2, FINISHED_AZIMUTH, buildEase);
      const dist = baseDist + 1.8 - Math.sin(bp * Math.PI) * 1.0;
      const height = midY + 2.25 + Math.sin(bp * Math.PI) * 0.9 + bp * 0.3;
      targetCameraPosition.current.set(
        Math.sin(angle) * dist,
        height,
        Math.cos(angle) * dist,
      );
      targetLookAt.current.set(frameOffsetX, midY + mobileLookAtOffset, 0);
    } else {
      // Cinematic orbit — normalise to 0→1 (exactly one 360° turn).
      // Start close to the front facade, rise above the roof for the
      // silhouette reveal, then settle back into the selected final frame.
      const op = (currentProgress - BUILD_END) / (1 - BUILD_END);
      // Slow in, faster architectural reveal, slow out, then hold the final
      // frame. This keeps the one full revolution but avoids a constant-speed
      // mechanical spin.
      const eop = cinematicOrbitProgress(op);
      const startAngle = FINISHED_AZIMUTH;
      const orbitAngle =
        startAngle + eop * Math.PI * 2 + Math.sin(eop * Math.PI * 2) * 0.06;
      const facadePush = easeOutCubic(Math.min(op / 0.24, 1)) * 0.85;
      const roofRise = easeOutCubic(Math.min(op / 0.34, 1)) * 0.65;
      // Move in for the facade, open up around the roof/rear reveal, and
      // finish at the same close final distance as the selected frame.
      const orbitDist =
        baseDist -
        0.35 -
        facadePush -
        eop * 1.9 -
        Math.sin(eop * Math.PI) * 0.65 -
        Math.sin(eop * Math.PI * 2) * 0.18;
      // Rise early enough to expose the roof while the camera is still
      // travelling across the front and side elevations.
      const heightBob = roofRise + Math.sin(eop * Math.PI) * 0.42;
      const secondaryBob = Math.sin(eop * Math.PI * 2) * 0.12;
      // Lower the final frame a little so the house reads from the facade
      // rather than from a high, roof-dominant angle.
      const endDrop = easeOutCubic(Math.max(0, (eop - 0.78) / 0.22)) * 1.55;
      const camY = midY + 2.45 + heightBob + secondaryBob - endDrop;
      const lookAtY = midY + mobileLookAtOffset + Math.sin(eop * Math.PI) * 0.22;
      targetCameraPosition.current.set(
        Math.sin(orbitAngle) * orbitDist,
        camY,
        Math.cos(orbitAngle) * orbitDist,
      );
      targetLookAt.current.set(frameOffsetX, lookAtY, 0);
    }

    if (!isMobile) {
      pointerOffset.current.lerp(pointerTarget.current, 1 - Math.exp(-delta / 0.24));
      targetCameraPosition.current.x += pointerOffset.current.x * 0.24;
      targetCameraPosition.current.y -= pointerOffset.current.y * 0.14;
      targetLookAt.current.x += pointerOffset.current.x * 0.08;
      targetLookAt.current.y -= pointerOffset.current.y * 0.05;
    }

    const finishLight = finishLightRef.current;
    if (finishLight) {
      const lightProgress = smootherstep(
        THREE.MathUtils.clamp((currentProgress - 0.82) / 0.16, 0, 1),
      );
      const sweep = smootherstep(
        THREE.MathUtils.clamp((currentProgress - 0.84) / 0.12, 0, 1),
      );
      finishLight.position.set(-5.5 + sweep * 11, 4.2 + Math.sin(sweep * Math.PI) * 1.2, 4.5);
      finishLight.intensity = lightProgress * 0.7;
    }

    // ── Clip plane: start with the foundation footprint visible, then build
    // through the same model as the user scrolls. Keeping this reveal small
    // makes the first loaded frame read as the foundation from the reference.
    // The mobile GLB has a different vertical fit than desktop, so its
    // foundation needs a higher initial reveal to remain visible on narrow
    // screens instead of being clipped below the frame.
    const INITIAL_BUILD = isMobile ? 0.26 : 0.22;
    const buildProgress = Math.min(currentProgress / BUILD_END, 1);
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
        const damping = 1 - Math.exp(-delta / (isMobile ? 0.20 : 0.16));
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
      <pointLight
        ref={finishLightRef}
        color="#ffd4a3"
        intensity={0}
        distance={14}
        decay={2}
      />
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
      <ProgressiveContactShadows progress={progress} isMobile={isMobile} />
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
  onReady,
}: {
  progress: ScrollProgress;
  /** Optional test-only canvas background; omitted in production scenes. */
  backgroundColor?: string;
  /** Test-only temporal damping; production scenes keep their original timing. */
  smoothMotion?: boolean;
  /** Test-only background cleanup; production scenes keep their grid. */
  showGrid?: boolean;
  /** Viewport measured by the parent before this client-only component mounts. */
  mobileHint?: boolean;
  /** Signals that the real GLB has mounted so the immediate foundation can hide. */
  onReady?: () => void;
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
    onReady?.();
  }, [onReady]);
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
            gl.setClearColor(0x000000, 0);
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
