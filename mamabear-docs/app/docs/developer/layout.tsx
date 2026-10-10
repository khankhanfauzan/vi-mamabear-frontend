import { source } from '@/lib/source';
import { sectionRoot } from '@/lib/section-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs/developer'>) {
  return (
    <DocsLayout
      tree={sectionRoot(source.getPageTree(), 'developer')}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
