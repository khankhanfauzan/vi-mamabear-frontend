import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// Resolve tooling through the installed Fumadocs compiler, which owns these dependencies.
const require = createRequire(import.meta.url);
const compilerRequire = createRequire(
  require.resolve("fumadocs-mdx/package.json"),
);
const { createProcessor } = await import(
  pathToFileURL(compilerRequire.resolve("@mdx-js/mdx")).href
);
const { parseDocument } = await import(
  pathToFileURL(compilerRequire.resolve("yaml")).href
);
const { default: GithubSlugger } = await import(
  pathToFileURL(compilerRequire.resolve("github-slugger")).href
);
const root = path.resolve("content/docs");
const publicRoot = path.resolve("public");
const errors = [];
const pages = new Map();
const folders = new Set();
const images = new Set();
const processor = createProcessor();
const allowedComponents = new Set([
  "Card",
  "Cards",
  "Callout",
  "Tabs",
  "Tab",
  "Steps",
  "Step",
]);
const fail = (file, message) =>
  errors.push(`${path.relative(process.cwd(), file)}: ${message}`);
async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(name)));
    else if (entry.name.endsWith(".mdx")) files.push(name);
  }
  return files;
}
function visit(node, callback) {
  callback(node);
  for (const child of node.children ?? []) visit(child, callback);
}
function text(node) {
  return node.value ?? (node.children ?? []).map(text).join("");
}
function attribute(node, name) {
  return node.attributes?.find(
    (item) => item.type === "mdxJsxAttribute" && item.name === name,
  )?.value;
}
for (const file of await walk(root)) {
  folders.add(path.dirname(file));
  const source = await readFile(file, "utf8");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.mdx$/.test(path.basename(file)))
    fail(file, "Filename must be kebab-case.mdx");
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) {
    fail(file, "Missing YAML frontmatter");
    continue;
  }
  const yaml = parseDocument(frontmatter[1]);
  for (const error of yaml.errors) fail(file, `Invalid YAML: ${error.message}`);
  const data = yaml.toJSON();
  for (const key of ["title", "description"]) {
    if (typeof data?.[key] !== "string" || !data[key].trim())
      fail(file, `Missing ${key}`);
  }
  const body = source.slice(frontmatter[0].length);
  try {
    const ast = processor.parse(body);
    const headings = new Set();
    const slugger = new GithubSlugger();
    let previousHeading = 1;
    visit(ast, (node) => {
      if (node.type === "heading") {
        if (node.depth === 1)
          fail(file, "H1 is supplied by frontmatter; body must start at H2");
        if (node.depth > previousHeading + 1)
          fail(file, "Heading level skipped");
        previousHeading = node.depth;
        headings.add(slugger.slug(text(node)));
      }
      if (
        node.type.startsWith("mdxJsx") &&
        /^[A-Z]/.test(node.name ?? "") &&
        !allowedComponents.has(node.name)
      ) {
        fail(file, `Unregistered MDX component: ${node.name}`);
      }
    });
    const relative = path
      .relative(root, file)
      .replaceAll("\\", "/")
      .replace(/\.mdx$/, "")
      .replace(/\/index$/, "");
    pages.set(`/docs/${relative}`, { file, ast, headings });
    await processor.process(body);
  } catch (error) {
    fail(file, `MDX compilation: ${error.message}`);
  }
}
for (const folder of folders) {
  const file = path.join(folder, "meta.json");
  try {
    const meta = JSON.parse(await readFile(file, "utf8"));
    if (!Array.isArray(meta.pages)) {
      fail(file, "pages must be an array");
      continue;
    }
    const entries = new Set(
      meta.pages.filter(
        (value) => typeof value === "string" && !value.startsWith("---"),
      ),
    );
    if (
      entries.size !==
      meta.pages.filter((value) => !value.startsWith("---")).length
    )
      fail(file, "Duplicate sidebar entry");
    if (!(await stat(path.join(folder, "index.mdx"))).isFile())
      fail(file, "Missing index.mdx");
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      if (
        (entry.isDirectory() || entry.name.endsWith(".mdx")) &&
        !entries.has(entry.name.replace(/\.mdx$/, ""))
      )
        fail(file, `Unlisted page/folder: ${entry.name}`);
    }
    for (const entry of entries) {
      const target = path.resolve(folder, entry);
      if (!target.startsWith(root + path.sep)) {
        fail(file, `Sidebar escapes docs root: ${entry}`);
        continue;
      }
      const found = await Promise.allSettled([
        stat(target + ".mdx"),
        stat(path.join(target, "index.mdx")),
      ]);
      if (
        !found.some(
          (result) => result.status === "fulfilled" && result.value.isFile(),
        )
      )
        fail(file, `Missing sidebar target: ${entry}`);
    }
  } catch (error) {
    fail(file, error.message);
  }
}
for (const [route, page] of pages) {
  const targets = [];
  visit(page.ast, (node) => {
    if (node.type === "link") targets.push({ value: node.url, image: false });
    if (node.type === "image") {
      if (!node.alt?.trim())
        fail(page.file, "Image missing descriptive alt text");
      targets.push({ value: node.url, image: true });
    }
    if (node.type.startsWith("mdxJsx")) {
      const href = attribute(node, "href");
      if (typeof href === "string") targets.push({ value: href, image: false });
      if (node.name === "img") {
        if (!attribute(node, "alt")) fail(page.file, "Image missing alt text");
        const src = attribute(node, "src");
        if (typeof src === "string") targets.push({ value: src, image: true });
      }
    }
  });
  for (const target of targets) {
    if (/^(https?:|mailto:|tel:)/.test(target.value)) continue;
    if (target.value.startsWith("file:")) {
      fail(page.file, "Local filesystem link is not portable");
      continue;
    }
    const url = new URL(target.value, `https://docs.local${route}`);
    const pathname = decodeURIComponent(url.pathname).replace(/\/$/, "");
    const linkedPage = pages.get(pathname);
    if (!target.image && linkedPage) {
      if (
        url.hash &&
        !linkedPage.headings.has(decodeURIComponent(url.hash.slice(1)))
      )
        fail(page.file, `Missing anchor ${target.value}`);
      continue;
    }
    const asset = path.resolve(publicRoot, "." + url.pathname);
    if (!asset.startsWith(publicRoot + path.sep)) {
      fail(page.file, `Asset escapes public root: ${target.value}`);
      continue;
    }
    try {
      if (!(await stat(asset)).isFile()) throw new Error();
      if (target.image) images.add(asset);
    } catch {
      fail(page.file, `Missing link/image: ${target.value}`);
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Validated ${pages.size} MDX pages, ${folders.size} sidebar folders, ${images.size} local images; YAML, compilation, headings, navigation, links, anchors, and component registrations passed.`,
  );
