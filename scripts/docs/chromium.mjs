import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function openChromium() {
  const executable = process.env.DOCS_CHROMIUM_PATH;
  if (!executable)
    throw new Error(
      "Set DOCS_CHROMIUM_PATH to an installed Chromium executable.",
    );
  const profile = await mkdtemp(path.join(tmpdir(), "mamabear-docs-browser-"));
  const browser = spawn(
    executable,
    [
      "--headless=new",
      "--remote-debugging-pipe",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    {
      stdio: ["ignore", "ignore", "ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );
  let nextId = 0;
  let buffer = "";
  const pending = new Map();
  function rejectPending(error) {
    for (const request of pending.values()) {
      clearTimeout(request.timer);
      request.reject(error);
    }
    pending.clear();
  }
  browser.on("error", rejectPending);
  browser.on("exit", () => rejectPending(new Error("Chromium exited")));
  browser.stdio[4].on("data", (chunk) => {
    buffer += chunk.toString();
    let end;
    while ((end = buffer.indexOf("\0")) >= 0) {
      const packet = JSON.parse(buffer.slice(0, end));
      buffer = buffer.slice(end + 1);
      const request = pending.get(packet.id);
      if (!request) continue;
      pending.delete(packet.id);
      clearTimeout(request.timer);
      if (packet.error) request.reject(new Error(JSON.stringify(packet.error)));
      else request.resolve(packet.result);
    }
  });
  function send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, 60000);
      pending.set(id, { resolve, reject, timer });
      browser.stdio[3].write(
        JSON.stringify({
          id,
          method,
          params,
          ...(sessionId ? { sessionId } : {}),
        }) + "\0",
      );
    });
  }
  const { targetId } = await send("Target.createTarget", {
    url: "about:blank",
  });
  const { sessionId } = await send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  const cdp = (method, params) => send(method, params, sessionId);
  const evaluate = async (expression) => {
    const response = await cdp("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (response.exceptionDetails)
      throw new Error(
        response.exceptionDetails.exception?.description ??
          response.exceptionDetails.text,
      );
    return response.result.value;
  };
  await cdp("Page.enable");
  async function navigate(url, width = 1440, height = 1000) {
    await cdp("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 600,
    });
    const result = await cdp("Page.navigate", { url });
    if (result.errorText) throw new Error(`${url}: ${result.errorText}`);
    for (let i = 0; i < 90; i++) {
      await delay(500);
      if (await evaluate('document.readyState === "complete"')) return;
    }
    throw new Error(`Page load timeout: ${url}`);
  }
  return {
    cdp,
    evaluate,
    navigate,
    async close() {
      try {
        await send("Browser.close");
      } catch {
        browser.kill();
      }
    },
  };
}
