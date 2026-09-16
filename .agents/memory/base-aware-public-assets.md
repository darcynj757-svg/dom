---
name: Base-aware public assets
description: Public image URLs in data modules when the web artifact is mounted below a non-root base path.
---

Public assets referenced from shared data must be built with the Vite base path, not as root-absolute URLs.

**Why:** The site preview and artifact deployment can mount the web app below a path such as `/__stroy-doma/`; `/images/...` then bypasses the mounted app and returns 404 even when the file exists.

**How to apply:** Use the shared asset URL helper for image, video, poster, and similar public asset references. Keep the helper safe when the same data module is imported by Node-based prerender or validation scripts where `import.meta.env` may be undefined.