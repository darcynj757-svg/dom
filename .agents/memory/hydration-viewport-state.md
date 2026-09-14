---
name: Hydration-safe viewport state
description: SSR and hydration requirements for responsive React branches.
---

Viewport-dependent hooks must render a stable server/client initial value and read `matchMedia` or `innerWidth` only in an effect.

**Why:** Reading the mobile viewport during the first client render changes responsive branches before hydration completes and triggers React hydration error 418.

**How to apply:** Initialize responsive booleans to the SSR-safe default, then set the actual media-query result in the effect; apply the same rule to 3D renderer configuration consumers.