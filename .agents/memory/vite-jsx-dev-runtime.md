---
name: Vite React JSX dev runtime
description: React 19 JSX dev subpaths need explicit Vite dependency optimization in this workspace.
---

Для React + Vite в этом workspace `react/jsx-runtime` и `react/jsx-dev-runtime` нужно явно включать в `optimizeDeps.include`, иначе dev preview может импортировать только default CJS export и падать с `jsxDEV is not a function`.

**Why:** Автоматический JSX runtime React 19 в preview отдавал несовместимый CJS-обёрнутый модуль, хотя production-сборка продолжала работать.

**How to apply:** При изменениях Vite/React runtime сохранять automatic JSX и проверять web workflow в браузере; не переключать весь проект на classic JSX без добавления `React`-импорта во все JSX-файлы.