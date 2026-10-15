import { isDeveloperAuthorized, unauthorizedDocsResponse } from '@/lib/docs-auth';
import { docsLlms, source } from '@/lib/source';
import { notFound } from 'next/navigation';

// Authorization reads request headers; developer content must never use a static fallback.
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const pageSlugs = slug?.slice(0, -1);
  if (pageSlugs?.[0] === 'developer' && !(await isDeveloperAuthorized(request))) {
    return unauthorizedDocsResponse();
  }

  const page = source.getPage(pageSlugs);
  if (!page) notFound();

  return new Response(await docsLlms.page(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

