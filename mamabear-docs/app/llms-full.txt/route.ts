import { publicDocsLlms } from '@/lib/public-source';

export const revalidate = false;

export async function GET() {
  return new Response(await publicDocsLlms.full());
}
