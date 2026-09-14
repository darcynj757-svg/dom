---
name: Static preview route resolution
description: Local Vite preview behavior for prerendered nested routes.
---

The local Vite preview serves a prerendered nested route reliably when the URL includes its trailing slash; the slashless form can fall back to the homepage even when the nested `index.html` exists.

**Why:** Mobile-route checks can otherwise measure the wrong page and falsely report the homepage H1 and metrics for an internal URL.

**How to apply:** Use the canonical slash form when profiling local static previews, and separately verify slashless direct URLs against the actual publishing handler before treating this local quirk as a production defect.

Static publishing must not use a catch-all rewrite from `/*` to the root `index.html`: the static handler already redirects a slashless directory URL to its trailing-slash form, then serves that directory's `index.html`.

**Why:** A root fallback can override an existing prerendered nested page, causing both direct requests and crawlers to receive the homepage H1.

**How to apply:** Leave nested prerendered directories to the static handler; only add a route-specific fallback when it targets the corresponding nested `index.html`.

Published static deployments can still redirect a slashless nested URL to `/`; route-specific `deployment.rewrites` from the slashless path to its nested `index.html` preserve the canonical URL and avoid that redirect.

**Why:** The site's sitemap and canonical links intentionally omit trailing slashes, while the default static directory handler treats `/path` as a directory request.

**How to apply:** Add exact rewrites for top-level SEO pages and wildcard rewrites for detail collections such as `/projects/*` and `/articles/*`; never use a catch-all rewrite to the homepage.