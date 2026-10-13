import { source } from '@/lib/source';
import { sectionRoot } from '@/lib/section-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { DocsLogoutButton } from '@/components/docs-logout-button';

export default function Layout({ children }: LayoutProps<'/docs/developer'>) {
  const options = baseOptions();
  return (
    <DocsLayout
      tree={sectionRoot(source.getPageTree(), 'developer')}
      {...options}
      links={[
        ...(options.links ?? []),
        {
          type: 'custom',
          secondary: true,
          children: <DocsLogoutButton variant="badge" />,
        },
      ]}
      sidebar={{
        footer: (
          <div className="flex w-full items-center justify-between gap-2 border-t border-fd-border pt-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-fd-muted-foreground">
              Internal Dev
            </span>
            <DocsLogoutButton />
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
