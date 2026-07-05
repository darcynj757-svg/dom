import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export const MODEL_URL = `${import.meta.env.BASE_URL}house.glb`.replace(
  /([^:])\/\//g,
  "$1/",
);

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
// cached value once resolved. Shared across every component that needs the
// house model so the (large) .glb file is only ever fetched once.
// ---------------------------------------------------------------------------

let _gltf: GLTF | null = null;
let _error: unknown = null;
let _suspendPromise: Promise<void> | null = null;

export function getGltfPromise(): Promise<void> {
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
        (err) => {
          _error = err;
          reject(err);
        },
      );
    });
  }
  return _suspendPromise;
}

/** Suspense-compatible hook — throws while loading, returns when ready. */
export function useGltfWithPlugin(): GLTF {
  if (_error) throw _error;
  if (_gltf) return _gltf;
  throw getGltfPromise(); // Suspend
}

export function hasWebGL() {
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
