export function RoomFull() {
  return (
    <div className='border border-amber-500 bg-amber-500/10 p-4'>
      <p className='font-medium text-amber-500'>Room is full</p>
      <span className='text-xs text-muted-foreground'>
        Only 2 users can join this room. Please ask the sender to create a new
        room.
      </span>
    </div>
  );
}
