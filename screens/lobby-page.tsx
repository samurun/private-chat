'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useMutation } from '@tanstack/react-query';
import { clientApi } from '@/lib/eden';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUsername } from '@/hooks/use-username';

export default function LobbyPage() {
  const { username, setUsername } = useUsername();
  const searchParams = useSearchParams();
  const isDestroy = searchParams?.get('destroy');
  const router = useRouter();

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async () => {
      console.log('Creating room...');
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
        {isDestroy && (
          <div className='space-y-4 border border-destructive p-4 bg-destructive/10'>
            <p className='text-center text-lg font-medium text-red-500'>
              Room has been destroyed
            </p>
            <p className='text-center text-sm text-muted-foreground'>
              All message and room data has been deleted permanently.
            </p>
          </div>
        )}
        <div>
          <p className='text-center text-lg font-medium text-green-500'>
            {'>'}private_chat
          </p>
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
              <Input
                value={username!}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <Button
            className='uppercase w-full'
            disabled={isPending}
            onClick={() => createRoom()}
          >
            Create Secure Room
          </Button>
        </div>
      </div>
    </div>
  );
}
