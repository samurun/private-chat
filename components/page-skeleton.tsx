import { TerminalIcon } from 'lucide-react';

export function PageSkeleton() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='flex items-center gap-2'>
        <TerminalIcon />
        <p className='text-xl font-medium '>private_chat</p>
      </div>
    </div>
  );
}
