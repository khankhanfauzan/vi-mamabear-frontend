import { DocsArticle, docsMetadata } from '@/components/docs-article';
import { source } from '@/lib/source';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

function toSlugs(slug?: string[]) {
  return slug?.length ? ['developer', ...slug] : ['developer'];
}

export default async function Page(props: PageProps<'/docs/developer/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(toSlugs(params.slug));
  if (!page) notFound();

  return <DocsArticle page={page} />;
}

export async function generateMetadata(
  props: PageProps<'/docs/developer/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(toSlugs(params.slug));
  if (!page) notFound();

  return {
    ...docsMetadata(page),
    robots: { index: false, follow: false },
  };
}
