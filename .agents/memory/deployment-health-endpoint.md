---
name: Deployment health endpoint
description: Healthcheck contract for the autoscale API deployment.
---

The API must return a successful JSON health response from both `/api` and `/api/healthz`.

**Why:** The current Replit autoscale runtime probes `/api`; if only `/api/healthz` exists, the deployment is marked unhealthy and the external gateway can return HTTP 500 for every frontend route.

**How to apply:** Preserve both routes when changing API routing or deployment configuration, and check `/api` directly after each production build before testing published sitemap URLs.