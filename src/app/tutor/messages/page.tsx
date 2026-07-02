"use client";

import { useState, useEffect, useRef } from "react";
import { useInbox, useConversation } from "@/hooks/useMessaging";

export default function TutorMessages() {
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(Number(storedUserId));
    // Hide footer and prevent body scroll on this page
    document.body.style.overflow = 'hidden';
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    return () => {
      document.body.style.overflow = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  if (!userId) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  return (
    <>
      <div className="flex h-[calc(100dvh-64px)] overflow-hidden" style={{ height: 'calc(100dvh - 64px)' }}>
        {/* Inbox — full width on mobile when no convo selected, fixed w-80 on desktop */}
        <div className={`flex flex-col bg-white border-r shrink-0 ${selectedUserId ? 'hidden md:flex md:w-80' : 'flex w-full md:w-80'}`}>
          <InboxPanel
            userId={userId}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
            onNewMessage={() => setShowNewMessageModal(true)}
          />
        </div>

        {/* Conversation — full width on mobile when convo selected, flex-1 on desktop */}
        <div className={`flex-1 flex flex-col min-w-0 ${selectedUserId ? 'flex' : 'hidden md:flex'}`}>
          {selectedUserId ? (
            <ConversationPanel
              userId={userId}
              otherUserId={selectedUserId}
              onBack={() => setSelectedUserId(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Select a conversation</p>
              <p className="text-gray-400 text-sm mt-1">Choose from your inbox to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {showNewMessageModal && (
        <NewMessageModal
          onClose={() => setShowNewMessageModal(false)}
          onSelectStudent={(studentUserId) => {
            setSelectedUserId(studentUserId);
            setShowNewMessageModal(false);
          }}
        />
      )}
    </>
  );
}

function InboxPanel({
  userId,
  selectedUserId,
  onSelectUser,
  onNewMessage,
}: {
  userId: number;
  selectedUserId: number | null;
  onSelectUser: (id: number) => void;
  onNewMessage: () => void;
}) {
  const { inbox, loading } = useInbox(userId);

  return (
    <>
      <div className="p-4 border-b shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <button
            onClick={onNewMessage}
            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            title="New Message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3 p-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : inbox.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="font-medium">No messages yet</p>
            <p className="text-sm mt-1">Start a new conversation</p>
          </div>
        ) : (
          inbox.map((conv) => (
            <button
              key={conv.otherUserId}
              onClick={() => onSelectUser(conv.otherUserId)}
              className={`w-full p-4 border-b text-left hover:bg-gray-50 transition-colors ${
                selectedUserId === conv.otherUserId ? "bg-emerald-50 border-l-4 border-l-emerald-600" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {conv.otherUserId}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-gray-900 text-sm">User {conv.otherUserId}</span>
                    {conv.unreadCount > 0 && (
                      <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessageContent}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(conv.lastMessageAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );
}

function ConversationPanel({
  userId,
  otherUserId,
  onBack,
}: {
  userId: number;
  otherUserId: number;
  onBack: () => void;
}) {
  const { messages, loading, sendMessage } = useConversation(userId, otherUserId);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
          {otherUserId}
        </div>
        <h3 className="font-semibold text-gray-900">User {otherUserId}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-gray-400 text-center py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.senderId === userId
                    ? "bg-emerald-600 text-white rounded-br-sm"
                    : "bg-white border text-gray-800 rounded-bl-sm shadow-sm"
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.senderId === userId ? "opacity-70 text-right" : "text-gray-400"}`}>
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t shrink-0" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function NewMessageModal({
  onClose,
  onSelectStudent,
}: {
  onClose: () => void;
  onSelectStudent: (studentUserId: number) => void;
}) {
  const [students, setStudents] = useState<Array<{ userId: number; name: string; email: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setStudents([
          { userId: 1, name: "John Doe", email: "john@example.com" },
          { userId: 2, name: "Jane Smith", email: "jane@example.com" },
        ]);
      } catch (error) {
        console.error("Failed to load students", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">New Message</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-4">Select a student to start a conversation:</p>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No students with booked sessions</div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {students.map((student) => (
                <button
                  key={student.userId}
                  onClick={() => onSelectStudent(student.userId)}
                  className="w-full p-3 border rounded-xl hover:bg-emerald-50 hover:border-emerald-400 transition-colors text-left flex items-center gap-3"
                >
                  <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{student.name}</div>
                    <div className="text-xs text-gray-500">{student.email}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
