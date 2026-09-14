---
name: Crawler resource headers
description: Runtime response-header rule for crawler-facing static files.
---

`robots.txt` должен отвечать как `text/plain; charset=utf-8`, а `sitemap.xml` — как `application/xml; charset=utf-8` в API-serving layer. Не полагаться только на MIME inference у Express или на заголовки внутреннего preflight server.

**Why:** Preflight-проверка статического артефакта может выставить заголовок сама и поэтому не гарантирует поведение реального API runtime или прокси.

**How to apply:** При изменении раздачи frontend проверять оба метода `GET` и `HEAD` через запущенный API workflow, сохраняя явные заголовки до `sendFile`/static handler.