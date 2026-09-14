---
name: Splash and lazy routes
description: Why lazy-loaded first-screen content must not wait for a transient splash event
---

The first-screen content must have its own visible initial state and must not depend only on a one-time `splash-done` event. A lazy route can mount after that event has already fired, leaving content permanently hidden.

**Why:** The splash and route chunk load independently, so event ordering changes with device speed and network conditions.

**How to apply:** Treat the splash as an overlay/transition only. If route content needs an entrance animation, make the animation optional and ensure its settled state is visible on mount.