import { Suspense } from 'react';

import RoomChat from '@/screens/room/room-chat';
import { PageSkeleton } from '@/components/page-skeleton';

export const metadata = {
  title: 'Room',
  description: 'A private chat, self-destruting room.',
};

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RoomChat />
    </Suspense>
  );
}
