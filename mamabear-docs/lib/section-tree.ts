import type { Node, Root } from 'fumadocs-core/page-tree';

function isSectionFolder(node: Node, section: 'user' | 'developer') {
  if (node.type !== 'folder') return false;
  const folder = node.$ref?.folder ?? '';
  return folder === section || folder.endsWith(`/${section}`) || node.$id === section;
}

export function sectionRoot(tree: Root, section: 'user' | 'developer'): Root {
  const folder = tree.children.find((node) => isSectionFolder(node, section));
  const fallbackName = section === 'user' ? 'User Guide' : 'Developer Guide';

  if (!folder || folder.type !== 'folder') {
    return { ...tree, name: fallbackName, children: [] };
  }

  const indexAlreadyListed = folder.children.some(
    (child) => child.type === 'page' && folder.index?.url === child.url,
  );
  const children =
    folder.index && !indexAlreadyListed
      ? [folder.index, ...folder.children]
      : folder.children;

  return {
    type: 'root',
    $id: folder.$id,
    name: folder.name ?? fallbackName,
    description: folder.description,
    children,
  };
}
