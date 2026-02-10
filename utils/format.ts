export function formatTimeRemaining(seconds: number | null) {
    if (seconds === null) return '--:--';
    const min = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${min}:${secs.toString().padStart(2, '0')}`;
}