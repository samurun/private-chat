import { Metadata } from 'next';
import { Suspense } from 'react';
import LobbyPage from '@/screens/lobby-page';

export const metadata: Metadata = {
  title: 'Private Chat',
  description: 'A private chat, self-destruting room.',
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LobbyPage />
    </Suspense>
  );
}
