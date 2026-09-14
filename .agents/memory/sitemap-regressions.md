---
name: Sitemap canonical deduplication
description: Rule for keeping SEO route aliases out of generated sitemap URLs.
---

When multiple SEO registry entries resolve to the same canonical path, sitemap generation must retain the entry whose `path` is already canonical rather than the alias entry.

**Why:** An alias can emit the same canonical `<loc>` while still being selected internally, hiding route-order regressions and making later sitemap metadata changes depend on the wrong route.

**How to apply:** Keep sitemap regression tests tied to the project and article source registries, assert unique canonical URLs, and verify aliases never become sitemap entries.

Published SEO checks must also compare every sitemap location with the canonical link in the generated HTML page. Registry-level equality alone cannot catch a build-time metadata mismatch.

**Why:** Sitemap generation and static HTML generation can drift independently even when both use the same route registry.

**How to apply:** Run the cross-artifact comparison after static pages are written, and keep a regression fixture that changes only the page canonical.