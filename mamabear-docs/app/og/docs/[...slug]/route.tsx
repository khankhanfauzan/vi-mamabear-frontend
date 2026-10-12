import { isDeveloperAuthorized, unauthorizedDocsResponse } from '@/lib/docs-auth';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { generateOGImage } from 'fumadocs-ui/og';
import { appName, getPageImageUrl } from '@/lib/shared';

export const revalidate = false;

export async function GET(request: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const pageSlugs = slug.slice(0, -1);
  if (pageSlugs[0] === 'developer' && !isDeveloperAuthorized(request)) {
    return unauthorizedDocsResponse();
  }

  const page = source.getPage(pageSlugs);
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: appName,
  });
}

export function generateStaticParams() {
  return source
    .getPages()
    .filter((page) => page.slugs[0] !== 'developer')
    .map((page) => ({
      lang: page.locale,
      slug: getPageImageUrl(page).segments,
    }));
}
