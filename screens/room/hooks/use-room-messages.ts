import { useOptimistic, startTransition, useRef, useEffect } from 'react';
import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientApi } from '@/lib/eden';
import { useRealtime } from '@/lib/realtime-client';
import { Message } from '@/lib/realtime';

export const useRoomMessages = (id: string, username: string) => {
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        data,
        refetch,
        isLoading,
    } = useQuery({
        queryKey: ['messages', id],
        queryFn: async () => {
            const res = await clientApi.messages.get({
                query: { roomId: id as string },
            });
            return res.data;
        },
        placeholderData: keepPreviousData,
        enabled: !!id,
    });

    const [optimisticMessages, addOptimisticMessage] = useOptimistic(
        data?.messages ?? [],
        (state: Message[], newMessage: Message & { sending?: boolean }) => {
            const exists = state.some(
                (m) =>
                    m.text === newMessage.text &&
                    m.sender === newMessage.sender &&
                    Math.abs(m.timestamp - newMessage.timestamp) < 5000,
            );

            if (exists) return state;

            return [...state, newMessage];
        },
    );

    const { mutateAsync: sendMessageAsync, isPending } = useMutation({
        mutationFn: async ({ text }: { text: string }) => {
            const res = await clientApi.messages.post(
                {
                    sender: username!,
                    text,
                },
                { query: { roomId: id as string } },
            );
            return res.data;
        },
    });

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isPending) return;

        startTransition(async () => {
            addOptimisticMessage({
                token: Date.now().toString(),
                text,
                sender: username,
                timestamp: Date.now(),
                id: Date.now().toString(),
                roomId: id,
                sending: true,
            });

            try {
                await sendMessageAsync({ text });
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        });
    };

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/nothing.mp3');
    }, []);

    useRealtime({
        channels: [id],
        events: ['chat.message', 'chat.destroy'],
        onData: ({ event, data }) => {
            if (event === 'chat.message') {
                refetch();
                if (data.sender !== username) {
                    audioRef.current?.play().catch(() => {
                        console.debug('Autoplay prevented for notification sound');
                    });
                }
            }

            if (event === 'chat.destroy') {
                router.push('/?destroy=true');
            }
        },
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [optimisticMessages]);

    return {
        messages: optimisticMessages,
        handleSendMessage,
        isLoading,
        isSending: isPending,
        messagesEndRef,
    };
};
