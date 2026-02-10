'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

import { clientApi } from '@/lib/eden';
import { useGenerateUsername } from '@/hooks/use-generate-username';
import { Activity } from 'react';
import { RoomFull } from '@/components/room-full';
import { RoomDestroyed } from '@/components/room-destroyed';
import { TerminalIcon } from 'lucide-react';

export default function LobbyPage() {
  const { username } = useGenerateUsername();
  const searchParams = useSearchParams();
  const isDestroy = searchParams?.get('destroy');
  const isFull = searchParams?.get('error') === 'room-full';
  const router = useRouter();

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async () => {
      const response = await clientApi.room.create.post();
      return response;
    },
    onSuccess: (data) => {
      router.push(`/room/${data.data?.roomId}`);
    },
    onError: (error) => {
      console.error('Error creating room:', error);
    },
  });

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='space-y-4'>
        <Activity mode={isDestroy ? 'visible' : 'hidden'}>
          <RoomDestroyed />
        </Activity>
        <Activity mode={isFull ? 'visible' : 'hidden'}>
          <RoomFull />
        </Activity>
        <div className='text-center'>
          <div className='flex items-center justify-center gap-2 text-green-500'>
            <TerminalIcon />
            <p className='text-xl font-medium '>private_chat</p>
          </div>
          <span className='text-sm text-muted-foreground tracking-tighter'>
            A private chat, self-destruting room.
          </span>
        </div>
        <div className='border p-4 space-y-4 min-w-3xs'>
          <FieldGroup>
            <Field>
              <FieldLabel
                htmlFor='form-rhf-demo-title'
                className='text-muted-foreground'
              >
                Your Identity
              </FieldLabel>
              <p className='p-2 py-1 text-muted-foreground border bg-black h-9'>
                {username}
              </p>
            </Field>
          </FieldGroup>
          <Button
            className='uppercase w-full'
            disabled={isPending}
            onClick={() => createRoom()}
          >
            {isPending ? 'Creating...' : 'Create Secure Room'}
          </Button>
        </div>
      </div>
    </div>
  );
}
