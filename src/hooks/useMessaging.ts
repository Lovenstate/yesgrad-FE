"use client";

import { ConversationSummary, Message } from "@/types/api";
import { useState, useRef, useCallback, useEffect } from "react";
import { messagingApi } from "@/lib/api";

export function useConversation(userId: number, otherUserId: number) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const load = useCallback(async () => {
        try {
            const data = await messagingApi.getConversation(userId, otherUserId);
            setMessages(data);
            setError(null);
            
            // Mark unread messages as read
            const unreadMessages = data.filter(msg => !msg.isRead && msg.receiverId === userId);
            for (const msg of unreadMessages) {
                try {
                    await messagingApi.markMessageRead(msg.id, userId);
                } catch {
                    // Silent fail - don't block UI
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [userId, otherUserId]);

    useEffect(() => {
        load();

        pollRef.current = setInterval(() => {
            load();
        }, 3000);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [load]);

    
   const sendMessage = useCallback(
    async (content: string, replyToMessageId?: number | null) => {
      const optimistic: Message = {
        id: Date.now(),          // temp id
        senderId: userId,
        receiverId: otherUserId,
        content,
        replyToMessageId: replyToMessageId ?? null,
        quotedMessage: replyToMessageId
          ? messages.find((m) => m.id === replyToMessageId) ?? null
          : null,
        sentAt: new Date().toISOString(),
        readAt: null,
        isRead: false,
      };

      // Optimistic update
      setMessages((prev) => [...prev, optimistic]);

      try {
        const saved = await messagingApi.sendMessage({
          senderId: userId,
          receiverId: otherUserId,
          content,
          replyToMessageId,
        });
        // Replace optimistic entry with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? saved : m))
        );
      } catch (e: unknown) {
        // Rollback on failure
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        setError(e instanceof Error ? e.message : "Failed to send message");
      }
    },
    [userId, otherUserId, messages]
  );

  const removeMessage = useCallback(
    async (messageId: number) => {
      const snapshot = messages;
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      try {
        await messagingApi.deleteMessage(messageId, userId);
      } catch (e: unknown) {
        setMessages(snapshot);
        setError(e instanceof Error ? e.message : "Failed to delete message");
      }
    },
    [userId, messages]
  );

  return { messages, loading, error, sendMessage, removeMessage, refresh: load };

}

// ── useInbox
// Loads inbox summary list with unread badge counts.
export function useInbox(userId: number) {
  const [inbox, setInbox] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await messagingApi.getInbox(userId);
      setInbox(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load inbox");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  return { inbox, loading, error, refresh: load };
}

// ── useUnreadCount
export function useUnreadCount(userId: number | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (userId === null || userId <= 0) return;

    const fetchCount = async () => {
      try {
        const { unreadCount } = await messagingApi.getUnreadCount(userId);
        setCount(unreadCount);
      } catch {
        // silent
      }
    };
    fetchCount();
    const id = setInterval(fetchCount, 3600000);
    return () => clearInterval(id);
  }, [userId]);

  return count;
}