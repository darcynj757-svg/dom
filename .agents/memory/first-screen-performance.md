---
name: First-screen performance
description: Performance boundary for the landing page hero and below-the-fold 3D section.
---

The first screen must be usable independently of hero-video readiness. The splash may signal the brand briefly, but it needs a hard short timeout; below-the-fold GLB and Draco resources must not be preloaded or fetched on initial mount.

**Why:** The hero poster and heading are the first meaningful content for visitors and search previews. Waiting on video or downloading the 3D scene delays that content, especially on mobile connections.

**How to apply:** Keep the hero poster as the early visual fallback, use metadata loading for the background video, and start the 3D model request only when its section enters the viewport.