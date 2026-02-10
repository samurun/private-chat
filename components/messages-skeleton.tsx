import { Skeleton } from './ui/skeleton';

export function MessagesSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      {[...Array(10)].map((_, i) => (
        <div key={i} className='flex flex-col gap-2'>
          <div className='flex items-baseline gap-2'>
            <Skeleton className='h-4 w-36 rounded' />
            <Skeleton className='h-3 w-8 rounded' />
          </div>
          <Skeleton className='h-5 w-20 rounded' />
        </div>
      ))}
    </div>
  );
}
