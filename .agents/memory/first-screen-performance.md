---
name: First-screen performance
description: Performance boundary for the landing page hero and below-the-fold 3D section.
---

The first screen must be usable independently of hero-video readiness. The splash may signal the brand briefly, but it needs a hard short timeout; below-the-fold GLB and Draco resources must not be preloaded or fetched on initial mount. An IntersectionObserver can report a section at the viewport boundary during the initial layout, so its callback must also be gated by actual user scroll. When using SSR with a slow client, hydrate the full production markup instead of clearing it with createRoot.

**Why:** The hero poster and heading are the first meaningful content for visitors and search previews. Waiting on video or downloading the 3D scene delays that content, especially on mobile connections. Dev SSR asset URLs also cannot be left in published HTML; imported assets need production-path rewriting.

**How to apply:** Keep the hero poster as the early visual fallback, use metadata loading and viewport media conditions for the background video, start the 3D model request only after the user has scrolled into the 3D section, and rewrite `/src` or `/@fs` SSR asset URLs to built asset paths.