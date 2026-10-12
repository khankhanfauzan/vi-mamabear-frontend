import { isDeveloperAuthorized } from '@/lib/docs-auth';
import { publicSource } from '@/lib/public-source';
import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

const publicSearch = createFromSource(publicSource);
const fullSearch = createFromSource(source);

export function GET(request: Request) {
  if (isDeveloperAuthorized(request)) return fullSearch.GET(request);
  return publicSearch.GET(request);
}
