---
name: Static preview route resolution
description: Local Vite preview behavior for prerendered nested routes.
---

The local Vite preview serves a prerendered nested route reliably when the URL includes its trailing slash; the slashless form can fall back to the homepage even when the nested `index.html` exists.

**Why:** Mobile-route checks can otherwise measure the wrong page and falsely report the homepage H1 and metrics for an internal URL.

**How to apply:** Use the canonical slash form when profiling local static previews, and separately verify slashless direct URLs against the actual publishing handler before treating this local quirk as a production defect.