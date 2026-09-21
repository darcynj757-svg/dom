import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

// One optimized model for every viewport (~1.36 MB, Draco geometry +
// WebP textures). The old desktop variant was ~23.7 MB and regularly left the
// 3D section blank on a cold start, especially on mobile networks.
export const MODEL_URL = `${import.meta.env.BASE_URL}house-v2.glb`.replace(
  /([^:])\/\//g,
  "$1/",
);
export const MOBILE_MODEL_URL = MODEL_URL;

export function getHouseModelUrl(_isMobile: boolean) {
  return MODEL_URL;
}

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
// Shared DRACOLoader instance — reuse the same decoder across loads
// ---------------------------------------------------------------------------
let _dracoLoader: DRACOLoader | null = null;
function getDracoLoader(): DRACOLoader {
  if (!_dracoLoader) {
    _dracoLoader = new DRACOLoader();
    _dracoLoader.setDecoderPath(
      `${import.meta.env.BASE_URL}draco/`.replace(/([^:])\/\//g, "$1/"),
    );
  }
  return _dracoLoader;
}

/** Start decoder loading when the below-the-fold 3D scene is activated. */
export function preloadDracoDecoder() {
  getDracoLoader().preload();
}

// ---------------------------------------------------------------------------
// We load directly with GLTFLoader (bypassing useLoader cache) so the plugin
// is guaranteed to be registered before .load() runs.
// Module-level cache so the result lives outside React state — this is the
// correct pattern for Suspense: throw the in-flight promise, return the
// cached value once resolved. Shared across every component that needs the
// house model so the (large) .glb file is only ever fetched once.
// ---------------------------------------------------------------------------

type GltfCache = {
  gltf: GLTF | null;
  error: unknown;
  promise: Promise<void> | null;
};

const MAX_LOAD_ATTEMPTS = 3;
const LOAD_TIMEOUT_MS = 25000;

const _cache = new Map<string, GltfCache>();

function getCache(modelUrl: string) {
  let cache = _cache.get(modelUrl);
  if (!cache) {
    cache = { gltf: null, error: null, promise: null };
    _cache.set(modelUrl, cache);
  }
  return cache;
}

function loadGltfOnce(modelUrl: string): Promise<GLTF> {
  return new Promise<GLTF>((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(getDracoLoader());
    loader.register((parser) => new GLTFSpecularGlossinessExtension(parser));

    let settled = false;
    // A stalled mobile connection never fires onError, so the block would wait
    // forever. Fail fast instead and let the retry loop start a fresh request.
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error(`House model request timed out after ${LOAD_TIMEOUT_MS}ms`));
    }, LOAD_TIMEOUT_MS);

    loader.load(
      modelUrl,
      (gltf) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(gltf);
      },
      undefined,
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Loads the house model, retrying with backoff. A cold start on a flaky mobile
 * connection must never leave the 3D block permanently empty, so a failed fetch
 * is retried instead of being cached as a terminal error.
 */
export function getGltfPromise(modelUrl = MODEL_URL): Promise<void> {
  const cache = getCache(modelUrl);
  if (cache.gltf) return Promise.resolve();
  if (!cache.promise) {
    cache.promise = (async () => {
      let lastError: unknown = null;
      for (let attempt = 0; attempt < MAX_LOAD_ATTEMPTS; attempt += 1) {
        try {
          cache.gltf = await loadGltfOnce(modelUrl);
        if (typeof window !== "undefined") {
          (window as unknown as { __houseModelLoaded?: boolean }).__houseModelLoaded = true;
          window.dispatchEvent(new CustomEvent("house-model-loaded"));
        }
          cache.error = null;
          return;
        } catch (err) {
          lastError = err;
          if (attempt < MAX_LOAD_ATTEMPTS - 1) {
            await wait(500 * 2 ** attempt);
          }
        }
      }
      cache.error = lastError;
      throw lastError;
    })();
  }
  return cache.promise;
}

/** Clears a terminal failure so the scene can ask for a fresh download. */
export function resetGltfCache(modelUrl = MODEL_URL) {
  const cache = getCache(modelUrl);
  if (cache.gltf) return;
  cache.error = null;
  cache.promise = null;
}

/** Suspense-compatible hook — throws while loading, returns when ready. */
export function useGltfWithPlugin(modelUrl = MODEL_URL): GLTF {
  const cache = getCache(modelUrl);
  if (cache.error) throw cache.error;
  if (cache.gltf) return cache.gltf;
  throw getGltfPromise(modelUrl); // Suspend
}

/**
 * Deep-clones a GLTF scene graph, including materials, so each consuming
 * component (e.g. HeroHouseFlight and ScrollHouse, mounted simultaneously)
 * gets its own independent Object3D + material instances. THREE.Object3D
 * can only have one parent at a time — sharing the cached `gltf.scene`
 * directly across multiple live Canvases causes each mount to steal the
 * model away from the others, and mutating shared materials' clippingPlanes
 * would cross-contaminate every instance's reveal animation.
 */
export function cloneGltfScene(scene: THREE.Object3D): THREE.Object3D {
  const clone = scene.clone(true);
  clone.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => (m as THREE.Material).clone())
        : (mesh.material as THREE.Material).clone();
    }
  });
  return clone;
}

export function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = (
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    ) as WebGLRenderingContext | WebGL2RenderingContext | null;
    const supported = context !== null;

    // Mobile browsers often enforce a small WebGL-context limit. Release the
    // capability probe immediately so it cannot consume a slot needed by the
    // real Three.js Canvas.
    context?.getExtension("WEBGL_lose_context")?.loseContext();

    return supported;
  } catch {
    return false;
  }
}
