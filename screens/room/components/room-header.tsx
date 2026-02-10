import { Button } from '@/components/ui/button';

import { formatTimeRemaining } from '@/utils/format';
import { cn } from '@/lib/utils';

interface RoomHeaderProps {
  id: string;
  timeRemaining: number | null;
  isDestroying?: boolean;
  onDestroy: () => void;
}

export function RoomHeader({
  id,
  timeRemaining,
  isDestroying,
  onDestroy,
}: RoomHeaderProps) {
  return (
    <div className='border-b p-4 bg-black'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground truncate w-20'>
              #{id}
            </span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                const url = `${window.location.origin}/room/${id}`;
                navigator.clipboard.writeText(url);
              }}
            >
              Copy
            </Button>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <p
            className={cn(
              'text-sm text-muted-foreground',
              Number(timeRemaining) < 120 && 'text-amber-500',
              Number(timeRemaining) < 60 && 'text-red-500',
            )}
          >
            {formatTimeRemaining(timeRemaining)}
          </p>
          <Button
            variant='destructive'
            size='sm'
            onClick={onDestroy}
            disabled={isDestroying}
          >
            {isDestroying ? 'Destroying...' : 'Destroy'}
          </Button>
        </div>
      </div>
    </div>
  );
}
