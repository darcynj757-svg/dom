---
name: First-screen performance
description: Performance boundary for the landing page hero and below-the-fold 3D section.
---

The first screen must be usable independently of hero-video readiness. The splash may signal the brand briefly, but it needs a hard short timeout. The scroll-driven house is an exception to normal below-the-fold loading: prepare its correctly selected mobile/desktop GLB, Draco decoder, and Canvas immediately after the Hero's first paint so the real model is ready before the user reaches the section. When using SSR with a slow client, hydrate the full production markup instead of clearing it with createRoot.

**Why:** The hero poster and heading must render first, but the user values an immediately visible real 3D house more than deferring its network cost. Starting with the wrong desktop GLB on mobile adds an avoidable second load. Dev SSR asset URLs also cannot be left in published HTML; imported assets need production-path rewriting.

**How to apply:** Keep the hero poster as the early visual fallback and use metadata loading and viewport media conditions for the background video. Measure the viewport before mounting the 3D Canvas, preload only the matching GLB plus Draco after the Hero paints, and rewrite `/src` or `/@fs` SSR asset URLs to built asset paths.