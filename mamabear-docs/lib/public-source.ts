import { llms } from 'fumadocs-core/source';
import { sectionRoot } from '@/lib/section-tree';
import { source } from '@/lib/source';

function isPublicUrl(url: string) {
  return url === '/docs/user' || url.startsWith('/docs/user/');
}

export const publicSource: typeof source = Object.create(source);

publicSource.getPages = (language) =>
  source.getPages(language).filter((page) => isPublicUrl(page.url));

publicSource.getPage = (slugs, language) => {
  if (slugs?.[0] === 'developer') return undefined;
  const page = source.getPage(slugs, language);
  if (page && !isPublicUrl(page.url)) return undefined;
  return page;
};

publicSource.getPageTree = (language) => sectionRoot(source.getPageTree(language), 'user');

export const publicDocsLlms = llms(publicSource, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
