import { Message } from '@/lib/realtime';
import React from 'react';

interface NoMessagesYetProps {
  messages?: Message[];
  isLoading?: boolean;
}

export function NoMessagesYet({ messages, isLoading }: NoMessagesYetProps) {
  if (isLoading) return null;

  return (
    <React.Fragment>
      {messages?.length === 0 && (
        <div className='flex flex-col items-center justify-center m-auto h-full'>
          <p className='text-center text-muted-foreground'>No messages yet</p>
          <span className='text-xs text-muted-foreground'>
            Be the first to send a message
          </span>
        </div>
      )}
    </React.Fragment>
  );
}
