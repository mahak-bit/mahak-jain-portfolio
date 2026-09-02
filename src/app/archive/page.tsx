import type { Metadata } from 'next';
import { ArchiveList } from '@/components/archive/ArchiveList';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'The Archive',
  description: 'Everything Mahak Jain has built — one unified archive, no categories.',
  alternates: { canonical: '/archive' },
  openGraph: {
    title: `The Archive — ${site.name}`,
    description: 'Everything Mahak Jain has built — one unified archive.',
    url: `${site.url}/archive`,
    type: 'website',
  },
};

export default function ArchivePage() {
  return <ArchiveList />;
}
