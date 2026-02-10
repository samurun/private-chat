'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { clientApi } from '@/lib/eden';
import { useUsername } from '@/hooks/use-username';
import { format } from 'date-fns';
import { useRealtime } from '@/lib/realtime-client';
import { useRouter } from 'next/navigation';

function formatTimeRemaining(seconds: number | null) {
  if (seconds === null) return '--:--';
  const min = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${min}:${secs.toString().padStart(2, '0')}`;
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const id = params?.id;
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { username } = useUsername();

  const { data: ttl } = useQuery({
    queryKey: ['ttl', id],
    queryFn: async () => {
      const res = await clientApi.room.ttl.get({
        query: { roomId: id as string },
      });

      return res.data;
    },
  });

  useEffect(() => {
    if (ttl?.ttl !== undefined) {
      setTimeRemaining(ttl.ttl);
    }
  }, [ttl]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) return;

    if (timeRemaining === 0) {
      router.push('/?destroyed=true');
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, router]);

  const { data, refetch } = useQuery({
    queryKey: ['messages', id],
    queryFn: async () => {
      const res = await clientApi.messages.get({
        query: { roomId: id as string },
      });
      return res.data;
    },
  });

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      const messages = await clientApi.messages.post(
        {
          sender: username!,
          text,
        },
        { query: { roomId: id as string } },
      );
      setInput('');
      return messages;
    },
  });

  useRealtime({
    channels: [id as string],
    events: ['chat.message', 'chat.destroy'],
    onData: ({ event }) => {
      if (event === 'chat.message') {
        refetch();
      }

      if (event === 'chat.destroy') {
        router.push('/?destroy=true');
      }
    },
  });

  const { mutateAsync: destroyRoom, isPending: isDestroying } = useMutation({
    mutationFn: async () => {
      const res = await clientApi.room.delete(
        {},
        {
          query: { roomId: id as string },
        },
      );
      return res.data;
    },
  });

  const copyToClipboard = () => {
    const id = window.location.href;
    navigator.clipboard.writeText(id!);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='flex flex-col h-screen overflow-hidden'>
        <header className='border-b sticky top-0 z-10'>
          <div className='mx-auto px-4 h-14 flex items-center gap-4'>
            <div className='flex flex-col gap-0 justify-between'>
              <span className='uppercase text-muted-foreground text-xs tracking-tight'>
                Room Id
              </span>
              <div className='flex gap-1'>
                <p className='font-bold text-green-500'>{id}</p>
                <Badge
                  variant={isCopied ? 'default' : 'secondary'}
                  onClick={copyToClipboard}
                  className='text-xs'
                >
                  {isCopied ? 'Copied' : 'Copy'}
                </Badge>
              </div>
            </div>
            <Separator orientation='vertical' />
            <div>
              <span className='uppercase text-muted-foreground text-xs tracking-tight'>
                Selt Destructing
              </span>
              <p
                className={cn(
                  timeRemaining !== null && timeRemaining < 60
                    ? 'text-red-500'
                    : 'text-amber-500',
                )}
              >
                {formatTimeRemaining(timeRemaining)}
              </p>
            </div>
            <div className='ml-auto'>
              <Button
                variant='destructive'
                className='uppercase'
                onClick={() => destroyRoom()}
                disabled={isDestroying}
              >
                {isDestroying ? 'Destroying...' : 'Destroy Now'}
              </Button>
            </div>
          </div>
        </header>
        <div className='flex-1 overflow-auto p-y space-y-4 scrollbar-thin p-4'>
          {data?.messages.length === 0 && (
            <div className='flex items-center justify-center'>
              <p className='text-center text-muted-foreground'>
                No messages yet
              </p>
            </div>
          )}

          {data?.messages.map((msg) => (
            <div key={msg.id} className='flex flex-col items-start'>
              <div className='flex items-center gap-2'>
                <p
                  className={cn(
                    'text-xs text-muted-foreground uppercase',
                    msg.sender === username
                      ? 'text-green-500'
                      : 'text-blue-500',
                  )}
                >
                  {msg.sender === username ? 'You' : msg.sender}
                </p>
                <span className='text-xs text-muted'>
                  {format(msg.timestamp, 'HH:mm')}
                </span>
              </div>
              <p className='text-sm leading-relaxed wrap-break-word'>
                {msg.text}
              </p>
            </div>
          ))}
        </div>
        <div className='border-t p-y'>
          <div className='p-4 flex gap-2'>
            <Input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='w-full'
              placeholder='Type message...'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) {
                  // send message
                  sendMessage({ text: input });
                  inputRef.current?.focus();
                }
              }}
            />
            <Button
              disabled={!input.trim() || isPending}
              className='ml-auto'
              onClick={() => {
                sendMessage({ text: input });
                inputRef.current?.focus();
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
