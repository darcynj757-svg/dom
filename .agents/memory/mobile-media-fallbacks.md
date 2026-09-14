---
name: Mobile media fallbacks
description: Правило для тяжёлых hero-видео и scroll-driven 3D на мобильных устройствах.
---

Для мобильных hero-видео и below-the-fold 3D нужны отдельные облегчённые ассеты, ранний запрос при приближении секции и видимый poster/fallback до готовности декодирования.

**Why:** Большой desktop-ресурс может формально загрузиться, но пользователь успевает увидеть только фон и интерфейсные анимации; пустой Suspense fallback выглядит как сломанный блок.

**How to apply:** Уменьшай mobile video/texture payload, сохраняй poster независимым от видео/GLB, запускай muted video через readiness fallback и проверяй отдельно момент network request и фактическую видимость модели.