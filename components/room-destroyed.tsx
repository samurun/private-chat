export function RoomDestroyed() {
  return (
    <div className='space-y-4 border border-destructive p-4 bg-destructive/10'>
      <p className='text-center text-lg font-medium text-red-500'>
        Room has been destroyed
      </p>
      <p className='text-center text-sm text-muted-foreground'>
        All message and room data has been deleted permanently.
      </p>
    </div>
  );
}
