import { format } from 'date-fns';
import React from 'react';

import { cn } from '@/lib/utils';
import { useGenerateUsername } from '@/hooks/use-generate-username';

import type { Message } from '@/lib/realtime';

interface MessageListProps {
  messages?: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const { username } = useGenerateUsername();
  return (
    <React.Fragment>
      {messages?.map((msg: Message & { sending?: boolean }) => (
        <div
          key={msg.id}
          className={cn(
            'flex flex-col items-start transition-opacity duration-300',
            msg.sending && 'opacity-60',
          )}
        >
          <div className='flex items-center gap-2'>
            <p
              className={cn(
                'text-xs text-muted-foreground uppercase',
                msg.sender === username ? 'text-green-500' : 'text-blue-500',
              )}
            >
              {msg.sender === username ? 'You' : msg.sender}
            </p>
            <span className='text-xs text-muted'>
              {format(msg.timestamp, 'HH:mm')}
            </span>
            {msg.sending && (
              <span className='text-[10px] text-muted-foreground animate-pulse'>
                Sending...
              </span>
            )}
          </div>
          <p className='text-sm'>{msg.text}</p>
        </div>
      ))}
    </React.Fragment>
  );
}
