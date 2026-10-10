import { NextResponse } from 'next/server';

const PROTECTED_PREFIXES = [
  '/docs/developer',
  '/llms.mdx/docs/developer',
  '/og/docs/developer',
];

export function isProtectedDocsPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(`${prefix}/`) ||
      pathname.startsWith(`${prefix}.`),
  );
}

function safeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  const length = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;

  for (let index = 0; index < length; index += 1) {
    mismatch |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }

  return mismatch === 0;
}

export function isDeveloperAuthorized(request: Request) {
  const password = process.env.DOCS_PASSWORD;
  if (!password) return false;

  const expectedUser = process.env.DOCS_USER || 'admin';
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Basic ')) return false;

  let decoded: string;
  try {
    decoded = atob(header.slice('Basic '.length).trim());
  } catch {
    return false;
  }

  const separator = decoded.indexOf(':');
  if (separator < 0) return false;

  const user = decoded.slice(0, separator);
  const pwd = decoded.slice(separator + 1);
  return safeEqual(user, expectedUser) && safeEqual(pwd, password);
}

export function unauthorizedDocsResponse() {
  return new NextResponse('Auth Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="MamaBear Developer Docs", charset="UTF-8"',
    },
  });
}
