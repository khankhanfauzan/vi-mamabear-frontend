import { isDeveloperAuthorized, unauthorizedDocsResponse } from '@/lib/docs-auth';
import { docsLlms, source } from '@/lib/source';
import { getPageMarkdownUrl } from '@/lib/shared';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(request: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const pageSlugs = slug?.slice(0, -1);
  if (pageSlugs?.[0] === 'developer' && !isDeveloperAuthorized(request)) {
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

export function generateStaticParams() {
  return source
    .getPages()
    .filter((page) => page.slugs[0] !== 'developer')
    .map((page) => ({
      lang: page.locale,
      slug: getPageMarkdownUrl(page).segments,
    }));
}
