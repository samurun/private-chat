import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientApi } from '@/lib/eden';

export const useRoomTtl = (id?: string) => {
    const router = useRouter();
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

    const { data: ttl } = useQuery({
        queryKey: ['ttl', id],
        queryFn: async () => {
            const res = await clientApi.room.ttl.get({
                query: { roomId: id as string },
            });

            return res.data;
        },
        enabled: !!id,
    });

    if (ttl?.ttl !== undefined && timeRemaining === null) {
        setTimeRemaining(ttl.ttl);
    }

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

    return {
        timeRemaining,
        destroyRoom,
        isDestroying,
    };
};
