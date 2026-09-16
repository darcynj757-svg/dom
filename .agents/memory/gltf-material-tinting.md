---
name: GLTF material tinting
description: Safe animated color transitions for textured GLTF materials in the Three.js house scene.
---

When an animated paint effect mixes a textured GLTF material toward a solid color, use an `onBeforeCompile` fragment-shader uniform and explicitly declare that uniform in GLSL.

**Why:** Adding a value only to `shader.uniforms` does not declare it in the generated fragment shader; WebGL then rejects the material program at runtime.

**How to apply:** Inject both `uniform float ...;` and the mix expression, preserve roof/window materials when the effect is meant for the facade, and drive the uniform from the same scroll progress that controls the scene.