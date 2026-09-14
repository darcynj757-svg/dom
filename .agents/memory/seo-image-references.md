---
name: SEO image references
description: Non-obvious constraints for validating images in prerendered SEO HTML.
---

Static SEO HTML can contain development-only Vite `/@fs` paths when an imported asset filename includes URL-encoded Unicode characters. A missing-image check must validate the final generated HTML, decode URL path segments before resolving files, and rewrite built asset URLs from their decoded filename.

**Why:** A build can pass while crawlers and social previews receive an image URL that only exists in the local development filesystem. Unicode filenames make a simple byte-for-byte asset-name comparison fail even when the hashed production asset exists.

**How to apply:** Run image-reference validation after prerendering and before publishing. Check local `<img>`, image preload, social metadata, and Schema.org media fields; skip external origins but fail on missing local assets.