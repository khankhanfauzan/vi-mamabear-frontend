import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { delay, openChromium } from "./chromium.mjs";

const port = Number(process.env.DOCS_SMOKE_PORT || 3011);
const origin = `http://127.0.0.1:${port}`;
const password = randomBytes(24).toString("hex");
const output = path.resolve("docs/evidence");
const next = path.resolve("mamabear-docs/node_modules/next/dist/bin/next");
const server = spawn(
  process.execPath,
  [next, "start", "--hostname", "127.0.0.1", "--port", String(port)],
  {
    cwd: path.resolve("mamabear-docs"),
    env: {
      ...process.env,
      NODE_ENV: "production",
      DOCS_PASSWORD: password,
      DOCS_SESSION_SECRET: randomBytes(32).toString("hex"),
    },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let serverLog = "";
server.stdout.on("data", (chunk) => {
  serverLog += chunk;
});
server.stderr.on("data", (chunk) => {
  serverLog += chunk;
});
server.on("error", (error) => {
  serverLog += error.message;
});
const checks = [];
const record = (name, details = {}) => {
  checks.push({ name, passed: true, ...details });
  console.log(`PASS ${name}`);
};
const request = (route, options) =>
  fetch(origin + route, { redirect: "manual", ...options });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 90; i++) {
    try {
      if ((await request("/docs/login")).status === 200) {
        ready = true;
        break;
      }
    } catch {
      /* wait for this test server */
    }
    await delay(500);
  }
  assert(ready, "Local docs production server did not start");
  const unauthorized = await request("/docs/developer");
  assert.equal(unauthorized.status, 307);
  assert(
    new URL(unauthorized.headers.get("location"), origin).pathname ===
      "/docs/login",
  );
  record("Anonymous developer HTML redirects to login");
  for (const route of [
    "/llms.mdx/docs/developer/content.md",
    "/og/docs/developer/image.png",
  ]) {
    assert.equal((await request(route)).status, 401);
  }
  const negotiated = await request("/docs/developer", {
    headers: { Accept: "text/markdown" },
  });
  assert.equal(negotiated.status, 307);
  record("Anonymous markdown, OG, and Accept negotiation remain protected");
  const publicGuide = await request("/docs/user");
  assert.equal(publicGuide.status, 200);
  for (const route of [
    "/llms.mdx/docs/user/content.md",
    "/og/docs/user/image.png",
  ]) {
    assert.equal((await request(route)).status, 200, route);
  }
  record("Public User Guide markdown and OG remain available");
  for (const route of ["/llms.txt", "/llms-full.txt"]) {
    const response = await request(route);
    assert.equal(response.status, 200);
    assert(
      !(await response.text()).includes("API_BASE_URL"),
      `Private content leaked in ${route}`,
    );
  }
  const publicSearch = await request("/api/search?query=API_BASE_URL");
  assert.equal(publicSearch.status, 200);
  assert(!(await publicSearch.text()).includes("/docs/developer"));
  record(
    "User Guide and public LLM/search endpoints exclude developer content",
  );
  const wrong = await request("/docs/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "invalid-local-test" }),
  });
  assert.equal(wrong.status, 401);
  record("Invalid local docs login rejected");
  const login = await request("/docs/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie").split(";")[0];
  assert(login.headers.get("set-cookie").includes("HttpOnly"));
  const headers = { cookie };
  record("Local docs login succeeds and issues HttpOnly cookie");
  const basic = {
    authorization:
      "Basic " +
      Buffer.from(`${process.env.DOCS_USER || "admin"}:${password}`).toString(
        "base64",
      ),
  };
  assert.equal(
    (await request("/docs/developer", { headers: basic })).status,
    200,
  );
  record("Existing HTTP Basic Auth fallback works");
  async function pages(directory) {
    const result = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isDirectory())
        result.push(...(await pages(path.join(directory, entry.name))));
      else if (entry.name.endsWith(".mdx"))
        result.push(path.join(directory, entry.name));
    }
    return result;
  }
  const contentRoot = path.resolve("mamabear-docs/content/docs");
  for (const file of await pages(path.join(contentRoot, "developer"))) {
    const route =
      "/docs/" +
      path
        .relative(contentRoot, file)
        .replaceAll("\\", "/")
        .replace(/\.mdx$/, "")
        .replace(/\/index$/, "");
    const response = await request(route, { headers });
    const html = await response.text();
    assert.equal(response.status, 200, route);
    assert(html.includes("<h1"), `Missing document title: ${route}`);
    assert(
      !html.includes("Expected component") &&
        !html.includes("Application error"),
      `Rendering failed: ${route}`,
    );
    record(`Authenticated render ${route}`);
  }
  assert.equal(
    (await request("/llms.mdx/docs/developer/content.md", { headers })).status,
    200,
  );
  assert.equal(
    (await request("/og/docs/developer/image.png", { headers })).status,
    200,
  );
  const privateSearch = await request("/api/search?query=API_BASE_URL", {
    headers,
  });
  assert.equal(privateSearch.status, 200);
  assert((await privateSearch.text()).includes("/docs/developer"));
  record("Authorized markdown, OG, and private search work");
  const manifest = JSON.parse(
    await readFile(path.join(output, "screenshots.json"), "utf8"),
  );
  const screenshots = [...manifest.captures, ...(manifest.attachments ?? [])];
  for (const item of screenshots) {
    const asset = await request(item.file);
    assert.equal(asset.status, 200, item.file);
    assert(asset.headers.get("content-type").includes("image/webp"));
  }
  record(`All ${screenshots.length} screenshot URLs serve WebP successfully`);
  browser = await openChromium();
  await browser.navigate(origin + "/docs/login");
  const loginStatus = await browser.evaluate(
    `fetch('/docs/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:${JSON.stringify(password)}})}).then(r=>r.status)`,
  );
  assert.equal(loginStatus, 200);
  for (const [route, width, height] of [
    ["/docs/developer/screenshots", 1440, 1000],
    ["/docs/developer/frontend/komponen-ui", 390, 844],
    ["/docs/developer/backend/api-reference", 1440, 1000],
  ]) {
    await browser.navigate(origin + route, width, height);
    // Trigger native lazy image loading through normal scrolling, then return to top.
    await browser.evaluate(
      `new Promise(async resolve=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}window.scrollTo(0,0);resolve(true)})`,
    );
    await delay(1500);
    const state = await browser.evaluate(
      `({pathname:location.pathname,title:document.querySelector('h1')?.textContent, brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')), imageCount:document.images.length, tabs:document.querySelectorAll('[role=tab]').length, width:innerWidth,scrollWidth:document.documentElement.scrollWidth,error:document.body.innerText.includes('Application error')})`,
    );
    assert.equal(state.pathname, route);
    assert(state.title && !state.error, `Browser render failed: ${route}`);
    assert.equal(state.brokenImages.length, 0, `Broken images: ${route}`);
    if (route.endsWith("screenshots"))
      assert.equal(state.imageCount, screenshots.length);
    if (width === 390)
      assert(state.scrollWidth <= width, "Mobile docs overflow horizontally");
    if (route.endsWith("api-reference")) {
      assert(state.tabs >= 2);
      await browser.evaluate(
        `document.querySelectorAll('[role=tab]')[1].click()`,
      );
      await delay(100);
      assert.equal(
        await browser.evaluate(
          `document.querySelectorAll('[role=tab]')[1].getAttribute('aria-selected')`,
        ),
        "true",
      );
    }
    record(`Browser render ${route} (${width}px)`, state);
  }
  const logout = await request("/docs/api/logout", { method: "POST", headers });
  assert.equal(logout.status, 200);
  assert(
    /Max-Age=0|expires=Thu, 01 Jan 1970/i.test(
      logout.headers.get("set-cookie"),
    ),
  );
  record("Logout clears local docs session cookie");
  assert(
    !/unhandledRejection|TypeError:|ReferenceError:/.test(serverLog),
    "Server reported a runtime error; inspect docs-smoke-server.log",
  );
} catch (error) {
  checks.push({ name: error.message, passed: false });
  console.error(error.stack);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.kill();
  await writeFile(
    path.join(output, "docs-smoke.json"),
    JSON.stringify({ checkedAt: new Date().toISOString(), checks }, null, 2) +
      "\n",
  );
  // Do not persist credentials, cookies, or HTML. Limit server logs to error diagnostics.
  await writeFile(
    path.join(output, "docs-smoke-server.log"),
    serverLog.split(password).join("[redacted]"),
  );
}
