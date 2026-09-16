---
name: Sunset final background
description: Final 3D house frame uses a generated open-lot sunset environment behind the model.
---

The finished-house state should transition from the construction grid to a warm open-site sunset environment. Keep the generated sky as the visual backdrop and map the lower site texture onto a real horizontal plane under the GLB, so the ground follows the camera perspective during the orbit. Use a base-aware public asset path so the environment works under the deployed subpath.

**Why:** The background marks the transition from construction process to a completed house while keeping the final 360° camera reveal intact.

**How to apply:** Keep the environment fade limited to the final scroll range and ensure the WebGL canvas remains transparent so the background layer is visible.