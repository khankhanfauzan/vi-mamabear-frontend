import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import {
  isDeveloperAuthorized,
  isPrefetchRequest,
  isProtectedDocsPath,
  unauthorizedDocsResponse,
} from '@/lib/docs-auth';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

export default async function proxy(request: NextRequest) {
  if (isProtectedDocsPath(request.nextUrl.pathname)) {
    if (isPrefetchRequest(request)) {
      return new NextResponse(null, { status: 204 });
    }

    const authorized = await isDeveloperAuthorized(request);
    if (!authorized) {
      return unauthorizedDocsResponse(request, request.nextUrl.pathname);
    }
  }

  const result = rewriteSuffix(request.nextUrl.pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl), {
        // this URL has two representations, selected by `Accept`
        headers: { Vary: 'Accept' },
      });
    }
  }

  return NextResponse.next();
}
