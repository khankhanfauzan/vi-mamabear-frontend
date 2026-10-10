import { DocsArticle, docsMetadata } from '@/components/docs-article';
import { source } from '@/lib/source';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

function toSlugs(slug?: string[]) {
  return slug?.length ? ['user', ...slug] : ['user'];
}

export default async function Page(props: PageProps<'/docs/user/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(toSlugs(params.slug));
  if (!page) notFound();

  return <DocsArticle page={page} />;
}

export function generateStaticParams() {
  return source
    .getPages()
    .filter((page) => page.slugs[0] === 'user')
    .map((page) => ({ slug: page.slugs.slice(1) }));
}

export async function generateMetadata(
  props: PageProps<'/docs/user/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(toSlugs(params.slug));
  if (!page) notFound();

  return docsMetadata(page);
}
