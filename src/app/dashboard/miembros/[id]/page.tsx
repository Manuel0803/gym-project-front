import { MemberDetailClient } from '@/features/members/components/MemberDetailClient';

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <MemberDetailClient id={id} />;
}
