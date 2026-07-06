// src/app/c/[slug]/page.tsx
import { CreatorDashboard } from '@/client/features/creator';

export const metadata = {
  title: 'Blendtune | Creator',
  description: 'Manage your workspace catalog.',
};

/** /c/:slug — the creator workspace dashboard. */
export default async function CreatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CreatorDashboard slug={slug} />;
}
