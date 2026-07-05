# Resource Status Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the museum resource library from 2026-07-05 and add a parent-facing resource status card.

**Architecture:** Keep the static PWA architecture. Load `museum-library.json` in the existing startup path, store a tiny `libraryMeta` object in local state, and render it into a new parents screen card.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node built-in test runner, existing museum update script.

---

### Task 1: Parent Resource Status

**Files:**
- Create: `scripts/app-source.test.mjs`
- Modify: `index.html`
- Modify: `main.js`
- Modify: `styles.css`
- Modify: `service-worker.js`
- Update generated data: `daily-missions.json`, `museum-library.json`

- [ ] Write a failing source test requiring the parent resource status DOM, copy, state, and render function.
- [ ] Add a parents page card with `#parents-resource-updated`, `#parents-resource-range`, and `#parents-resource-source`.
- [ ] Add multilingual copy for the resource status labels.
- [ ] Store `libraryMeta` after loading `museum-library.json`.
- [ ] Render update time, coverage date range, and source into the parent card.
- [ ] Style the resource card consistently with the parents panel.
- [ ] Refresh asset versions and service worker cache name.
- [ ] Run `DAILY_MISSION_DATE=2026-07-05 node scripts/update-daily-missions.mjs`.
- [ ] Verify JS syntax, tests, JSON dates, and git diff before commit.
