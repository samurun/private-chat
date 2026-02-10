import { Metadata } from 'next';
import { Suspense } from 'react';

import LobbyPage from '@/screens/lobby/lobby-page';
import { PageSkeleton } from '@/components/page-skeleton';

export const metadata: Metadata = {
  title: 'Lobby',
  description: 'A private chat, self-destruting room.',
};

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LobbyPage />
    </Suspense>
  );
}
