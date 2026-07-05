import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("parents screen exposes museum resource status", async () => {
  const [html, js, css, serviceWorker] = await Promise.all([
    readSource("index.html"),
    readSource("main.js"),
    readSource("styles.css"),
    readSource("service-worker.js")
  ]);

  assert.match(html, /parents-resource-status/);
  assert.match(html, /parents-resource-updated/);
  assert.match(html, /parents-resource-range/);
  assert.match(html, /parents-resource-source/);
  assert.match(js, /libraryMeta:\s*null/);
  assert.match(js, /renderResourceStatus\(t\)/);
  assert.match(js, /state\.libraryMeta = \{/);
  assert.match(css, /\.resource-status-card/);
  assert.match(serviceWorker, /2026-07-05-resource-status/);
});
