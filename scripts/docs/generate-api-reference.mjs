import { readFile, writeFile } from "node:fs/promises";

const evidence = JSON.parse(
  await readFile("docs/evidence/api-contract.json", "utf8"),
);
const observations = JSON.parse(
  await readFile("docs/evidence/api-observations.json", "utf8"),
);
const spec = evidence.document;
const output = "mamabear-docs/content/docs/developer/backend/";
const methods = new Set(["get", "post", "put", "patch", "delete"]);
const cell = (value) =>
  String(value ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("{", "&#123;")
    .replaceAll("}", "&#125;");
const code = (language, title, value) =>
  `\n\`\`\`${language} title="${title}"\n${value}\n\`\`\`\n`;
const resolve = (schema) =>
  schema?.$ref
    ? spec.components.schemas[schema.$ref.split("/").at(-1)]
    : schema;
const type = (schema) =>
  schema?.$ref?.split("/").at(-1) ??
  (schema?.type === "array"
    ? `array<${type(schema.items)}>`
    : (schema?.type ?? "Tidak dijelaskan"));
const authOverrides = {
  "/api/auth/login":
    "Tidak memasang JwtAuthGuard pada method source; login menerbitkan token. Swagger tetap beranotasi bearer.",
  "/api/auth/register":
    "Tidak memasang JwtAuthGuard pada method source. Swagger beranotasi bearer.",
  "/api/auth/refresh":
    "RefreshGuard dan bearer refresh token pada source, bukan access token biasa.",
  "/api/cart":
    "Source cart memakai optional JWT untuk GET; guest cart tersedia. Anotasi Swagger memakai bearer.",
  "/api/cart/items":
    "Source cart memakai optional JWT untuk POST; cookie guest atau bearer mengikuti konteks.",
};
const selected = new Map([
  [
    "get /api/products/filter",
    "Mencari katalog dengan filter, sorting, dan cursor.",
  ],
  ["get /api/products/{slug}", "Mengambil detail produk berdasarkan slug."],
  [
    "get /api/products/{slug}/related",
    "Mengambil produk terkait untuk detail produk.",
  ],
  ["get /api/products/{slug}/variants", "Mengambil varian produk."],
  ["get /api/products/search", "Mencari produk menggunakan query q."],
  ["get /api/products/search/suggestions", "Mengambil saran pencarian."],
  ["get /api/categories", "Mengambil daftar kategori."],
  ["post /api/auth/login", "Login credentials untuk menerbitkan token."],
  ["post /api/auth/register", "Mendaftarkan pengguna."],
  [
    "post /api/auth/refresh",
    "Memperbarui access token dan merotasi refresh token.",
  ],
  ["get /api/cart", "Mengambil cart untuk konteks pengguna atau guest."],
  ["post /api/cart/items", "Menambahkan item produk dan varian ke cart."],
  ["patch /api/cart/items/{id}", "Memperbarui jumlah item cart."],
  ["post /api/shipping/cost", "Menghitung pilihan ongkir."],
  ["post /api/order", "Membuat pesanan dari cart dan alamat."],
  ["get /api/order/{id}", "Mengambil detail pesanan pengguna."],
  ["post /api/payment/create", "Membuat sesi transaksi pembayaran."],
  ["post /api/ai/chat", "Mengirim pesan ke AI Assistant."],
  ["get /api/ai/conversations", "Mengambil daftar percakapan pengguna."],
]);

let inventory = `---\ntitle: Inventaris Endpoint\ndescription: Seluruh operasi dari OpenAPI publik MamaBear dengan parameter dan anotasi keamanan yang tersedia.\n---\n
## Asal dan Cara Membaca

Snapshot dibaca dari [OpenAPI resmi](${evidence.source}) pada 15 Oktober 2026 (Asia/Jakarta). Inventaris ini dihasilkan ulang dengan \`node scripts/docs/generate-api-reference.mjs\` dari root repository. Bukti tersimpan di \`docs/evidence/api-contract.json\`; contoh Swagger dihapus dari snapshot agar tidak menyalin contoh kredensial.

Anotasi bearer adalah metadata OpenAPI. Tidak adanya anotasi bukan bukti endpoint publik; adanya anotasi juga tidak selalu sama dengan guard runtime. Controller auth/cart/payment menunjukkan perbedaan tersebut. Tidak dilakukan pemanggilan endpoint admin atau mutasi untuk menguji akses.

| Method | Path lengkap | Tag / operasi | Parameter | Anotasi keamanan |
| --- | --- | --- | --- | --- |
`;
let count = 0;
for (const [endpoint, operations] of Object.entries(spec.paths)) {
  for (const [method, operation] of Object.entries(operations)) {
    if (!methods.has(method)) continue;
    count++;
    const security = operation.security ?? spec.security ?? [];
    const auth = security.length
      ? security.map((item) => Object.keys(item).join(", ")).join(" / ")
      : "Tidak dicantumkan";
    inventory += `| ${method.toUpperCase()} | \`${endpoint}\` | ${cell(operation.summary || operation.operationId)} | ${cell((operation.parameters ?? []).map((p) => `${p.in}: ${p.name}`).join("; ") || "Tidak dicantumkan")} | ${cell(auth)} |\n`;
  }
}
inventory += `\nJumlah operasi pada snapshot: **${count}**. Request body/response utama dijelaskan pada [Referensi API](/docs/developer/backend/api-reference).\n`;

let reference = `---\ntitle: Standar & Referensi API\ndescription: Kontrak endpoint utama, request schema, respons publik aktual, dan batas informasi Swagger MamaBear.\n---\n
## Dasar Kontrak

Host API: \`https://vi-mamabear-backend.onrender.com\`; seluruh path di bawah sudah termasuk prefix \`/api\`. Frontend memakai API_BASE_URL yang biasanya sudah berakhiran /api, sehingga service hanya menambahkan /products, /order, dan seterusnya.

[Swagger resmi](https://vi-mamabear-backend.onrender.com/api) dan [OpenAPI JSON](${evidence.source}) diverifikasi pada 15 Oktober 2026. Source backend commit \`8118516\` dipakai untuk menjelaskan guard, bukan untuk mengasumsikan revision deployment. [Inventaris lengkap](/docs/developer/backend/endpoint-inventory) mencakup semua operasi snapshot.

<Callout type="warn">
  Banyak response Swagger tidak memiliki schema/contoh, dan banyak error status tidak dicantumkan. Bagian ini menyatakan keterbatasan tersebut. Contoh aktual hanya berasal dari GET publik katalog/error; tidak ada response login, transaksi, pembayaran, admin, atau AI yang direkayasa.
</Callout>

## Envelope yang Diamati

Response publik memakai success, statusCode, message berupa array, data, serta timestamp. Source TransformInterceptor dan AllExceptionsFilter mengonfirmasi pola ini. Tipe frontend message masih string dan perlu ditinjau terpisah. Token/secret tidak dicetak di sini.
`;
for (const [key, purpose] of selected) {
  const space = key.indexOf(" ");
  const method = key.slice(0, space);
  const endpoint = key.slice(space + 1);
  const operation = spec.paths[endpoint]?.[method];
  if (!operation) throw new Error(`Missing verified operation: ${key}`);
  const security = operation.security ?? spec.security ?? [];
  reference += `\n## ${method.toUpperCase()} ${endpoint.replaceAll("{", "").replaceAll("}", "")}\n\n**Path:** \`${endpoint}\`. **Tujuan:** ${purpose}\n\n**Autentikasi:** ${authOverrides[endpoint] ?? (security.length ? "OpenAPI mencantumkan bearer JwtAuthGuard; kebutuhan role/detail guard harus mengikuti source controller." : "OpenAPI tidak mencantumkan security. Ini bukan jaminan akses publik untuk semua konteks.")}\n\n<Tabs items={['Request', 'Response dan Error']}>\n  <Tab value="Request">\n`;
  if (operation.parameters?.length) {
    reference +=
      "\n| Parameter | Lokasi | Wajib | Tipe | Keterangan |\n| --- | --- | --- | --- | --- |\n";
    for (const parameter of operation.parameters) {
      reference += `| ${cell(parameter.name)} | ${cell(parameter.in)} | ${parameter.required ? "Ya" : "Tidak"} | ${cell(type(parameter.schema))} | ${cell(parameter.description || "Tidak dijelaskan OpenAPI")} |\n`;
    }
  } else reference += "\nParameter path/query: tidak dicantumkan OpenAPI.\n";
  const content = operation.requestBody?.content;
  if (content) {
    for (const [mime, body] of Object.entries(content)) {
      reference += `\nBody: \`${mime}\`; requestBody.required: ${operation.requestBody.required ? "ya" : "tidak ditetapkan/false"}. Berikut schema dari kontrak, bukan contoh payload yang telah dikirim.\n`;
      reference += code(
        "json",
        "Schema request dari OpenAPI",
        JSON.stringify(resolve(body.schema), null, 2),
      );
    }
  } else reference += "\nRequest body: tidak didefinisikan pada OpenAPI.\n";
  reference +=
    '\n  </Tab>\n  <Tab value="Response dan Error">\n\nStatus yang didokumentasikan OpenAPI:\n\n| HTTP | Deskripsi | Schema |\n| --- | --- | --- |\n';
  for (const [status, response] of Object.entries(operation.responses ?? {})) {
    reference += `| ${status} | ${cell(response.description || "Tidak dijelaskan")} | ${response.content ? cell(JSON.stringify(response.content)) : "Tidak disediakan"} |\n`;
  }
  const observed = observations.filter((item) => {
    const pathname = new URL(item.url).pathname;
    return (
      pathname === endpoint ||
      (endpoint === "/api/products/{slug}" && item.status === 404)
    );
  });
  if (observed.length) {
    for (const observation of observed) {
      let body = observation.body;
      let note = "";
      if (body?.data?.data && Array.isArray(body.data.data)) {
        body = {
          ...body,
          data: {
            ...body.data,
            data: body.data.data.map((product) =>
              Object.fromEntries(
                [
                  "id",
                  "name",
                  "slug",
                  "currentPrice",
                  "originalPrice",
                  "discountPercent",
                ]
                  .filter((k) => k in product)
                  .map((k) => [k, product[k]]),
              ),
            ),
          },
        };
        note =
          " Cuplikan aktual: properti produk lain dihilangkan; nilai yang ditampilkan tidak diganti.";
      }
      reference += `\nGET publik aktual: \`${observation.url}\`, HTTP ${observation.status}.${note}\n`;
      reference += code(
        "json",
        "Response aktual pada waktu audit",
        JSON.stringify(body, null, 2),
      );
    }
  } else
    reference +=
      "\nContoh response runtime: tidak diambil untuk operasi ini. Schema atau body response yang tidak tersedia tidak diisi dengan data buatan.\n";
  reference +=
    "\nError khusus operasi ini hanya diklaim bila ada observasi di atas. Source global memakai envelope error dengan data null; daftar error/status per endpoint belum lengkap pada OpenAPI. Tidak diasumsikan bahwa status sukses Swagger adalah satu-satunya hasil runtime.\n\n  </Tab>\n</Tabs>\n";
}
await writeFile(output + "endpoint-inventory.mdx", inventory);
await writeFile(output + "api-reference.mdx", reference);
console.log(
  `Generated inventory: ${count} operations; detailed reference: ${selected.size} operations.`,
);
