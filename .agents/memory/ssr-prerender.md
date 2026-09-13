---
name: Static React prerender
description: Constraint for generating route HTML in the Vite static build.
---

Static prerendering must use React's streaming server renderer and await the async route render before injecting it into the HTML template. `renderToString` leaves React.lazy routes as the Suspense fallback, while writing the unresolved Promise produces `[object Promise]`.

**Why:** The app uses route-level `React.lazy` components and is published as static files. Search engines need the resolved page body, not the loading shell.

**How to apply:** Keep the prerender script as a post-build step, derive its route list from the sitemap, and verify generated files for H1 content and absence of Suspense fallback markers.