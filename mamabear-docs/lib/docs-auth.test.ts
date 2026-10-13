/**
 * @jest-environment node
 */
import {
  isProtectedDocsPath,
  isPrefetchRequest,
  isDeveloperAuthorized,
  unauthorizedDocsResponse,
} from './docs-auth';

describe('docs-auth', () => {
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
    expect(isProtectedDocsPath('/api/search')).toBe(false);
  });

  it('isPrefetchRequest identifies various prefetch headers', () => {
    // Next.js router prefetch
    const nextReq1 = new Request('http://localhost/docs/developer', {
      headers: { 'next-router-prefetch': '1' },
    });
    expect(isPrefetchRequest(nextReq1)).toBe(true);

    // Next.js segment prefetch
    const nextReq2 = new Request('http://localhost/docs/developer', {
      headers: { 'next-router-segment-prefetch': '/docs/developer' },
    });
    expect(isPrefetchRequest(nextReq2)).toBe(true);

    // Standard purpose prefetch
    const purposeReq = new Request('http://localhost/docs/developer', {
      headers: { purpose: 'prefetch' },
    });
    expect(isPrefetchRequest(purposeReq)).toBe(true);

    // Sec-Purpose prefetch
    const secPurposeReq = new Request('http://localhost/docs/developer', {
      headers: { 'sec-purpose': 'prefetch' },
    });
    expect(isPrefetchRequest(secPurposeReq)).toBe(true);

    // Next.js middleware prefetch
    const middlewareReq = new Request('http://localhost/docs/developer', {
      headers: { 'x-middleware-prefetch': '1' },
    });
    expect(isPrefetchRequest(middlewareReq)).toBe(true);

    // Direct active user navigation (no prefetch header)
    const directReq = new Request('http://localhost/docs/developer');
    expect(isPrefetchRequest(directReq)).toBe(false);
  });

  it('unauthorizedDocsResponse includes WWW-Authenticate header', () => {
    const res = unauthorizedDocsResponse();
    expect(res.status).toBe(401);
    expect(res.headers.get('WWW-Authenticate')).toBe(
      'Basic realm="MamaBear Developer Docs", charset="UTF-8"',
    );
  });

  it('isDeveloperAuthorized validates HTTP Basic Auth credentials', () => {
    process.env.DOCS_USER = 'admin';
    process.env.DOCS_PASSWORD = 'secretpassword';

    // Missing header
    const reqNoAuth = new Request('http://localhost/docs/developer');
    expect(isDeveloperAuthorized(reqNoAuth)).toBe(false);

    // Invalid credentials
    const reqWrongAuth = new Request('http://localhost/docs/developer', {
      headers: {
        authorization: 'Basic ' + Buffer.from('admin:wrong').toString('base64'),
      },
    });
    expect(isDeveloperAuthorized(reqWrongAuth)).toBe(false);

    // Valid credentials
    const reqValidAuth = new Request('http://localhost/docs/developer', {
      headers: {
        authorization: 'Basic ' + Buffer.from('admin:secretpassword').toString('base64'),
      },
    });
    expect(isDeveloperAuthorized(reqValidAuth)).toBe(true);
  });
});

