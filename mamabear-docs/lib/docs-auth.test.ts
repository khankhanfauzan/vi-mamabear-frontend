/**
 * @jest-environment node
 */
import {
  isProtectedDocsPath,
  isPrefetchRequest,
  createSessionToken,
  isDocsSessionValid,
  isDeveloperAuthorized,
  unauthorizedDocsResponse,
  getDocsLoginUrl,
  DOCS_COOKIE_NAME,
} from './docs-auth';

describe('docs-auth', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('isProtectedDocsPath identifies developer docs routes as protected', () => {
    expect(isProtectedDocsPath('/docs/developer')).toBe(true);
    expect(isProtectedDocsPath('/docs/developer/arsitektur')).toBe(true);
    expect(isProtectedDocsPath('/llms.mdx/docs/developer')).toBe(true);
    expect(isProtectedDocsPath('/og/docs/developer')).toBe(true);
  });

  it('isProtectedDocsPath leaves public and landing routes unprotected', () => {
    expect(isProtectedDocsPath('/')).toBe(false);
    expect(isProtectedDocsPath('/docs')).toBe(false);
    expect(isProtectedDocsPath('/docs/user')).toBe(false);
    expect(isProtectedDocsPath('/docs/user/belanja')).toBe(false);
    expect(isProtectedDocsPath('/docs/login')).toBe(false);
    expect(isProtectedDocsPath('/docs/api/login')).toBe(false);
    expect(isProtectedDocsPath('/docs/api/logout')).toBe(false);
    expect(isProtectedDocsPath('/api/search')).toBe(false);
  });

  it('isPrefetchRequest identifies various prefetch headers', () => {
    const nextReq1 = new Request('http://localhost/docs/developer', {
      headers: { 'next-router-prefetch': '1' },
    });
    expect(isPrefetchRequest(nextReq1)).toBe(true);

    const nextReq2 = new Request('http://localhost/docs/developer', {
      headers: { 'next-router-segment-prefetch': '/docs/developer' },
    });
    expect(isPrefetchRequest(nextReq2)).toBe(true);

    const purposeReq = new Request('http://localhost/docs/developer', {
      headers: { purpose: 'prefetch' },
    });
    expect(isPrefetchRequest(purposeReq)).toBe(true);

    const secPurposeReq = new Request('http://localhost/docs/developer', {
      headers: { 'sec-purpose': 'prefetch' },
    });
    expect(isPrefetchRequest(secPurposeReq)).toBe(true);

    const middlewareReq = new Request('http://localhost/docs/developer', {
      headers: { 'x-middleware-prefetch': '1' },
    });
    expect(isPrefetchRequest(middlewareReq)).toBe(true);

    const directReq = new Request('http://localhost/docs/developer');
    expect(isPrefetchRequest(directReq)).toBe(false);
  });

  it('createSessionToken returns consistent sha256 hash', async () => {
    process.env.DOCS_PASSWORD = 'test-password';
    process.env.DOCS_SESSION_SECRET = 'test-salt';

    const token1 = await createSessionToken();
    const token2 = await createSessionToken();
    expect(token1).toBe(token2);
    expect(typeof token1).toBe('string');
    expect(token1.length).toBe(64); // SHA-256 hex string length
  });

  it('isDocsSessionValid validates cookie session', async () => {
    process.env.DOCS_PASSWORD = 'supersecretpass';

    const validToken = await createSessionToken();

    // No cookie
    const reqNoCookie = new Request('http://localhost/docs/developer');
    expect(await isDocsSessionValid(reqNoCookie)).toBe(false);

    // Invalid cookie token
    const reqInvalidCookie = new Request('http://localhost/docs/developer', {
      headers: { cookie: `${DOCS_COOKIE_NAME}=invalid-token` },
    });
    expect(await isDocsSessionValid(reqInvalidCookie)).toBe(false);

    // Valid cookie token
    const reqValidCookie = new Request('http://localhost/docs/developer', {
      headers: { cookie: `${DOCS_COOKIE_NAME}=${validToken}` },
    });
    expect(await isDocsSessionValid(reqValidCookie)).toBe(true);
  });

  it('isDeveloperAuthorized accepts valid cookie session or Basic Auth fallback', async () => {
    process.env.DOCS_USER = 'admin';
    process.env.DOCS_PASSWORD = 'secretpassword';

    const validToken = await createSessionToken();

    // With valid cookie
    const reqCookie = new Request('http://localhost/docs/developer', {
      headers: { cookie: `${DOCS_COOKIE_NAME}=${validToken}` },
    });
    expect(await isDeveloperAuthorized(reqCookie)).toBe(true);

    // With valid Basic Auth
    const reqBasic = new Request('http://localhost/docs/developer', {
      headers: {
        authorization: 'Basic ' + Buffer.from('admin:secretpassword').toString('base64'),
      },
    });
    expect(await isDeveloperAuthorized(reqBasic)).toBe(true);

    // With invalid Basic Auth
    const reqInvalidBasic = new Request('http://localhost/docs/developer', {
      headers: {
        authorization: 'Basic ' + Buffer.from('admin:wrong').toString('base64'),
      },
    });
    expect(await isDeveloperAuthorized(reqInvalidBasic)).toBe(false);

    // Without any credentials
    const reqEmpty = new Request('http://localhost/docs/developer');
    expect(await isDeveloperAuthorized(reqEmpty)).toBe(false);
  });

  it('getDocsLoginUrl preserves original host and adds next query param', () => {
    const req = new Request('http://localhost:3000/docs/developer/arsitektur', {
      headers: {
        'x-forwarded-host': 'vi-mamabear-frontend.vercel.app',
        'x-forwarded-proto': 'https',
      },
    });

    const url = getDocsLoginUrl(req, '/docs/developer/arsitektur');
    expect(url.toString()).toBe('https://vi-mamabear-frontend.vercel.app/docs/login?next=%2Fdocs%2Fdeveloper%2Farsitektur');
  });

  it('unauthorizedDocsResponse redirects page requests to login without WWW-Authenticate popup', () => {
    const req = new Request('http://localhost:3000/docs/developer');
    const redirectRes = unauthorizedDocsResponse(req, '/docs/developer');
    expect(redirectRes.status).toBe(307);
    expect(redirectRes.headers.get('location')).toContain('/docs/login');
    expect(redirectRes.headers.get('WWW-Authenticate')).toBeNull();

    // API / asset request
    const apiRes = unauthorizedDocsResponse();
    expect(apiRes.status).toBe(401);
    expect(apiRes.headers.get('WWW-Authenticate')).toBeNull();
  });
});
