---
name: Mobile GLB compression
description: Safe optimization path for the mobile house model without changing its visual architecture.
---

Для мобильной копии дома используй glTF Transform с Draco и проверяй реальный рендер после замены файла. Повторный запуск старого `gltf-pipeline` на уже Draco-сжатом GLB может завершиться ошибкой `Draco encoding failed`, тогда как glTF Transform сначала декодирует и заново кодирует примитивы.

**Why:** Мобильная модель содержит большой объём геометрии; безопасное повторное Draco-сжатие может существенно сократить холодную загрузку без замены архитектуры или добавления визуального placeholder.

**How to apply:** Сохраняй исходный GLB во временный backup, сжимай только mobile-ассет, проверяй `KHR_draco_mesh_compression`, размер, появление `data-house-model-ready="true"` и мобильный screenshot перед production build.