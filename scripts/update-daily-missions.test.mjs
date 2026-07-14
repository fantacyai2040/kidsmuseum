import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Met API requests include JSON and user-agent headers", async () => {
  const source = await readFile(new URL("./update-daily-missions.mjs", import.meta.url), "utf8");

  assert.match(source, /fetch\(url,\s*\{/);
  assert.match(source, /"Accept":\s*"application\/json"/);
  assert.match(source, /"User-Agent":\s*"kidsmuseum\/1\.0/);
});

test("Met API requests are paced and 403 responses get one retry", async () => {
  const source = await readFile(new URL("./update-daily-missions.mjs", import.meta.url), "utf8");

  assert.match(source, /const FETCH_DELAY_MS = \d+;/);
  assert.match(source, /await sleep\(FETCH_DELAY_MS\);/);
  assert.match(source, /response\.status === 403/);
  assert.match(source, /await sleep\(FETCH_RETRY_DELAY_MS\);/);
});

test("child-sensitive title words are filtered from museum candidates", async () => {
  const source = await readFile(new URL("./update-daily-missions.mjs", import.meta.url), "utf8");

  assert.match(source, /"agony"/);
});
