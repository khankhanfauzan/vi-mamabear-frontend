import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { delay } from "./chromium.mjs";

const port = Number(process.env.STOREFRONT_SMOKE_PORT || 3012);
const origin = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  [
    path.resolve("node_modules/next/dist/bin/next"),
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    env: {
      ...process.env,
      NEXTAUTH_SECRET: randomBytes(32).toString("hex"),
      NEXTAUTH_URL: origin,
    },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let log = "";
server.stdout.on("data", (chunk) => {
  log += chunk;
});
server.stderr.on("data", (chunk) => {
  log += chunk;
});
server.on("error", (error) => {
  log += error.message;
});
const checks = [];
try {
  let ready = false;
  for (let i = 0; i < 90; i++) {
    try {
      if ((await fetch(origin + "/login")).status === 200) {
        ready = true;
        break;
      }
    } catch {
      /* wait for this server */
    }
    await delay(500);
  }
  assert(ready, "Storefront server failed to start");
  for (const [route, marker] of [
    ["/", "MamaBear"],
    ["/products", "Produk"],
    ["/search?q=asi", "asi"],
    ["/login", "MamaBear"],
  ]) {
    const response = await fetch(origin + route);
    const html = await response.text();
    assert.equal(response.status, 200, route);
    assert(html.includes(marker), `Missing page content: ${route}`);
    checks.push({ route, status: response.status, passed: true });
    console.log(`PASS storefront ${route}`);
  }
  for (const route of ["/account/orders", "/admin/dashboard"]) {
    const response = await fetch(origin + route, { redirect: "manual" });
    assert.equal(response.status, 307);
    assert.equal(
      new URL(response.headers.get("location"), origin).pathname,
      "/login",
    );
    checks.push({ route, status: response.status, passed: true });
    console.log(`PASS storefront anonymous protection ${route}`);
  }
  // Inspect configured mappings directly without hitting remote or production docs.
  process.env.DOCS_APP_URL = "http://127.0.0.1:3011";
  const { default: config } = await import("../../next.config.mjs");
  const rewrites = await config.rewrites();
  for (const source of [
    "/docs",
    "/docs/:path*",
    "/docs-assets/_next/:path*",
    "/api/search",
  ]) {
    assert(
      rewrites.some(
        (rule) =>
          rule.source === source &&
          rule.destination.startsWith(process.env.DOCS_APP_URL),
      ),
    );
  }
  assert(
    rewrites.some(
      (rule) =>
        rule.source === "/api/backend/:path*" &&
        rule.destination ===
          "https://mamabear-backend-dev.up.railway.app/api/:path*",
    ),
  );
  checks.push({
    name: "Docs mappings and existing backend mapping verified from config",
    passed: true,
  });
  console.log("PASS docs rewrite configuration and preserved backend mapping");
} catch (error) {
  checks.push({ name: error.message, passed: false });
  console.error(error.stack);
  process.exitCode = 1;
} finally {
  server.kill();
  await writeFile(
    "docs/evidence/storefront-smoke.json",
    JSON.stringify({ checkedAt: new Date().toISOString(), checks }, null, 2) +
      "\n",
  );
  await writeFile("docs/evidence/storefront-smoke-server.log", log);
}
