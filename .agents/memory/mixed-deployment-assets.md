---
name: Mixed deployment frontend assets
description: Packaging rule for serving a prerendered web artifact through the API runtime.
---

When the static web handler is disabled in a mixed artifact deployment, the API build must run the frontend build in production mode and copy the resulting `dist/public` into the API runtime package.

**Why:** The runnable API artifact may otherwise be published without the frontend files, causing every web request to return a server error; running the frontend build as development also injects tooling and can exceed the first-screen HTML budget.

**How to apply:** Keep the frontend build before the API bundle, force `NODE_ENV=production`, copy the generated public directory into the runnable artifact, and verify direct HTML, 404, API, robots, and sitemap responses locally before publishing.