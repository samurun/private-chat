'use client';

import { useParams } from 'next/navigation';
import { Activity, Suspense, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NoMessagesYet } from '@/components/no-messages-yet';
import { MessageList } from '@/components/message-list';
import { useGenerateUsername } from '@/hooks/use-generate-username';

import { useRoomTtl } from './hooks/use-room-ttl';
import { useRoomMessages } from './hooks/use-room-messages';
import { RoomHeader } from './components/room-header';
import { MessagesSkeleton } from '@/components/messages-skeleton';

export default function RoomChat() {
  const params = useParams();
  const id = params?.id as string;
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { username } = useGenerateUsername();

  const { timeRemaining, destroyRoom, isDestroying } = useRoomTtl(id);
  const { messages, handleSendMessage, isLoading, isSending, messagesEndRef } =
    useRoomMessages(id, username!);

  const onSend = async () => {
    if (!input.trim() || isSending) return;
    const text = input;
    setInput('');
    await handleSendMessage(text);
    inputRef.current?.focus();
  };

  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          Loading Room...
        </div>
      }
    >
      <div className='flex flex-col h-screen overflow-hidden bg-background'>
        <RoomHeader
          id={id}
          timeRemaining={timeRemaining}
          isDestroying={isDestroying}
          onDestroy={() => destroyRoom()}
        />

        <div className='flex-1 overflow-auto space-y-4 scrollbar-thin p-4'>
          <Activity
            mode={isLoading && messages.length === 0 ? 'visible' : 'hidden'}
          >
            <MessagesSkeleton />
          </Activity>
          <NoMessagesYet messages={messages} isLoading={isLoading} />
          <MessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>

        <div className='border-t p-4 bg-black'>
          <div className='max-w-4xl mx-auto flex gap-2'>
            <Input
              ref={inputRef}
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='flex-1'
              placeholder='Type message...'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSend();
                }
              }}
            />
            <Button
              disabled={!input.trim() || isSending}
              onClick={onSend}
              className='px-6'
            >
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
