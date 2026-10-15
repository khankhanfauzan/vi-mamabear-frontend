import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { delay, openChromium } from "./chromium.mjs";

const output = path.resolve("mamabear-docs/public/docs");
const evidence = path.resolve("docs/evidence");
await mkdir(output, { recursive: true });
await mkdir(evidence, { recursive: true });
const apiOnly = process.argv.includes("--api-only");
let previousManifest = { captures: [], attachments: [] };
try {
  previousManifest = JSON.parse(
    await readFile(path.join(evidence, "screenshots.json"), "utf8"),
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const captures = apiOnly
  ? previousManifest.captures.filter((c) => !c.file.includes("/backend/"))
  : [];
const browser = await openChromium();
const { cdp, evaluate } = browser;
try {
  async function navigate(url, width = 1440, height = 1000) {
    await browser.navigate(url, width, height);
    await evaluate("document.fonts.ready.then(() => true)");
    await delay(6000);
    // Dismiss the real newsletter popup through its existing public UI.
    await evaluate(
      'document.querySelector("button[aria-label=Close]")?.click()',
    );
    await delay(300);
  }
  async function capture(
    name,
    sourceUrl,
    width = 1440,
    height = 1000,
    prepare,
  ) {
    await navigate(sourceUrl, width, height);
    if (prepare) await prepare();
    const state =
      await evaluate(`({url:location.href,title:document.title,text:document.body.innerText.slice(0,500),
      viewport:{width:innerWidth,height:innerHeight},scrollWidth:document.documentElement.scrollWidth,
      brokenImages:[...document.images].filter(i=>i.getBoundingClientRect().width>0 && i.complete && i.naturalWidth===0).map(i=>i.getAttribute('src'))})`);
    if (/chrome-error:/.test(state.url))
      throw new Error(`Browser error page: ${sourceUrl}`);
    const { data } = await cdp("Page.captureScreenshot", {
      format: "webp",
      quality: 88,
      captureBeyondViewport: false,
    });
    const section = name.startsWith("mamabear-api-") ? "backend" : "frontend";
    await mkdir(path.join(output, section), { recursive: true });
    await writeFile(
      path.join(output, section, name + ".webp"),
      Buffer.from(data, "base64"),
    );
    captures.push({
      file: `/docs/${section}/${name}.webp`,
      sourceUrl,
      capturedAt: new Date().toISOString(),
      ...state,
    });
    console.log(JSON.stringify({ capture: name, ...state }));
  }
  const frontend = "https://vi-mamabear-frontend.vercel.app";
  if (!apiOnly) {
    await capture("mamabear-homepage", frontend + "/");
    await capture("mamabear-product-catalog", frontend + "/products");
    const detailUrl = await evaluate(
      `[...document.querySelectorAll('a[href]')].map(a=>a.href).find(h=>new URL(h).pathname.startsWith('/products/'))`,
    );
    if (detailUrl) await capture("mamabear-product-detail", detailUrl);
    await capture("mamabear-search", frontend + "/search?q=asi");
    await capture("mamabear-mobile-view", frontend + "/", 390, 844);
  }
  await capture(
    "mamabear-api-documentation",
    "https://vi-mamabear-backend.onrender.com/api",
  );
  await capture(
    "mamabear-api-products",
    "https://vi-mamabear-backend.onrender.com/api",
    1440,
    1000,
    async () => {
      await evaluate(
        `(() => {const el=[...document.querySelectorAll('.opblock-tag')].find(e=>/products/i.test(e.textContent) && !/admin/i.test(e.textContent)); if(!el) throw new Error('Products section missing'); if(!el.closest('.opblock-tag-section').classList.contains('is-open')) el.click();})()`,
      );
      await delay(800);
      await evaluate(
        `document.querySelector('[id="operations-tag-products"]').scrollIntoView({block:'start'})`,
      );
      await delay(300);
    },
  );
  await capture(
    "mamabear-api-response",
    "https://vi-mamabear-backend.onrender.com/api/products/search/suggestions?q=asi&limit=1",
  );
} finally {
  await writeFile(
    path.join(evidence, "screenshots.json"),
    JSON.stringify(
      { captures, attachments: previousManifest.attachments ?? [] },
      null,
      2,
    ) + "\n",
  );
  await browser.close();
}
