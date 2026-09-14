---
name: Static React prerender
description: Constraint for generating route HTML in the Vite static build.
---

Static prerendering must use React's streaming server renderer and await the async route render before injecting it into the HTML template. The replacement marker inside `#root` must have no surrounding whitespace text nodes, and React 19 resource hints emitted during SSR must be hoisted into `<head>` rather than left inside the hydrated root. `renderToString` leaves React.lazy routes as the Suspense fallback, while writing the unresolved Promise produces `[object Promise]`.

**Why:** The app uses route-level `React.lazy` components and is published as static files. Search engines need the resolved page body, not the loading shell; a whitespace node or SSR-only `<link rel="preload">` inside `#root` causes React 19 hydration error 418 even when visible content matches.

**How to apply:** Keep the prerender script as a post-build step, derive its route list from the sitemap, hoist SSR resource hints before writing app HTML, keep the root marker flush with its replacement, and verify generated files for H1 content, absence of Suspense fallback markers, and clean hydration on direct routes.