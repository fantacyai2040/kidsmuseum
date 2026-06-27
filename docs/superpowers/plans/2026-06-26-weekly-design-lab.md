# Weekly Design Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a weekly UI/design innovation loop that turns each museum week into a small child-facing design experiment and parent-facing observation guide.

**Architecture:** Keep the static PWA architecture. Add a local `designLabs` data object in `main.js`, render one lab based on the current date, and surface it in the map and parents screens without changing the existing mission flow.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node built-in test runner for script tests and syntax checks.

---

### Task 1: Weekly Design Lab UI

**Files:**
- Modify: `index.html`
- Modify: `main.js`
- Modify: `styles.css`

- [ ] Add child-facing Design Lab placeholders to the map screen after the daily proof panel.
- [ ] Add parent-facing Design Lab placeholders to the parents screen before the existing notes.
- [ ] Add `designLabs`, `currentDesignLab`, and rendering logic in `main.js`.
- [ ] Add multilingual labels for English, simplified Chinese, and French.
- [ ] Style `.design-lab-panel`, `.design-lab-card`, and `.design-lab-steps` to match the existing museum visual system.
- [ ] Verify `node --check main.js` and browser smoke behavior.
