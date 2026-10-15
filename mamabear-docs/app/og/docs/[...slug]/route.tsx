import { isDeveloperAuthorized, unauthorizedDocsResponse } from '@/lib/docs-auth';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { generateOGImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';

// Authorization reads request headers; render these images per request.
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const pageSlugs = slug.slice(0, -1);
  if (pageSlugs[0] === 'developer' && !(await isDeveloperAuthorized(request))) {
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

