import { NextResponse } from 'next/server';

export const DOCS_COOKIE_NAME = 'docs-session';

const PROTECTED_PREFIXES = [
  '/docs/developer',
  '/llms.mdx/docs/developer',
  '/og/docs/developer',
];

export function isProtectedDocsPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(`${prefix}/`) ||
      pathname.startsWith(`${prefix}.`),
  );
}

export function isPrefetchRequest(request: Request): boolean {
  const headers = request.headers;
  return (
    headers.has('next-router-prefetch') ||
    headers.has('next-router-segment-prefetch') ||
    headers.get('x-middleware-prefetch') === '1' ||
    headers.get('purpose')?.toLowerCase().includes('prefetch') === true ||
    headers.get('sec-purpose')?.toLowerCase().includes('prefetch') === true
  );
}

function safeEqual(left: string, right: string): boolean {
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

export async function createSessionToken(): Promise<string> {
  const password = process.env.DOCS_PASSWORD ?? '';
  const salt = process.env.DOCS_SESSION_SECRET ?? 'mamabear-docs-salt-2026';
  const data = new TextEncoder().encode(`${password}:${salt}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function isDocsSessionValid(request: Request): Promise<boolean> {
  const password = process.env.DOCS_PASSWORD;
  if (!password) return false;

  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${DOCS_COOKIE_NAME}=([^;]+)`));
  if (!match) return false;

  const token = decodeURIComponent(match[1]);
  const expectedToken = await createSessionToken();
  return safeEqual(token, expectedToken);
}

export async function isDeveloperAuthorized(request: Request): Promise<boolean> {
  // 1. Check Cookie Session
  if (await isDocsSessionValid(request)) {
    return true;
  }

  // 2. Fallback: Check HTTP Basic Auth (for curl, scripts, etc.)
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

export function getDocsLoginUrl(request: Request, pathname?: string): URL {
  const reqUrl = new URL(request.url);
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || reqUrl.host;
  const proto = request.headers.get('x-forwarded-proto') || (reqUrl.protocol.replace(':', '')) || 'https';
  const loginUrl = new URL('/docs/login', `${proto}://${host}`);
  const nextTarget = pathname || reqUrl.pathname;
  if (nextTarget && nextTarget !== '/docs/login') {
    loginUrl.searchParams.set('next', nextTarget);
  }
  return loginUrl;
}

export function unauthorizedDocsResponse(request?: Request, pathname?: string): NextResponse {
  // If this is a page navigation on developer docs, redirect to custom login page
  if (request && pathname && pathname.startsWith('/docs/developer')) {
    const loginUrl = getDocsLoginUrl(request, pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For API or non-HTML endpoints, return 401 without WWW-Authenticate header
  // so browser does not trigger native popup dialog.
  return new NextResponse('Auth Required', {
    status: 401,
  });
}
