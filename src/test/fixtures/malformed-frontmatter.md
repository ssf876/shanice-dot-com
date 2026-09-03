---
title: [unclosed bracket
date: not a date: at all
---

This fixture is intentionally malformed and must never live in src/content/posts/.
It exists so the pipeline test can prove invalid YAML frontmatter throws at suite
time — the failure lands in CI, never in a visitor's browser.
