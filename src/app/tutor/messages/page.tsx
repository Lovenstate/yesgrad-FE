"use client";

import { useState, useEffect } from "react";
import { useInbox, useConversation } from "@/hooks/useMessaging";

export default function TutorMessages() {
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId));
    }
  }, []);

  if (!userId) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <>
      <div className="h-screen flex">
        <InboxPanel
          userId={userId}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
          onNewMessage={() => setShowNewMessageModal(true)}
        />
        {selectedUserId ? (
          <ConversationPanel userId={userId} otherUserId={selectedUserId} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
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
    <div className="w-80 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Messages</h2>
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
          <div className="p-4 text-gray-500">Loading...</div>
        ) : inbox.length === 0 ? (
          <div className="p-4 text-gray-500">No messages yet</div>
        ) : (
          inbox.map((conv) => (
            <button
              key={conv.otherUserId}
              onClick={() => onSelectUser(conv.otherUserId)}
              className={`w-full p-4 border-b text-left hover:bg-gray-50 transition-colors ${
                selectedUserId === conv.otherUserId ? "bg-emerald-50" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">User {conv.otherUserId}</span>
                {conv.unreadCount > 0 && (
                  <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate">{conv.lastMessageContent}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(conv.lastMessageAt).toLocaleString()}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function ConversationPanel({
  userId,
  otherUserId,
}: {
  userId: number;
  otherUserId: number;
}) {
  const { messages, loading, sendMessage } = useConversation(userId, otherUserId);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="p-4 border-b bg-white">
        <h3 className="font-semibold">Chat with User {otherUserId}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-4 py-2 rounded-lg ${
                  msg.senderId === userId
                    ? "bg-emerald-600 text-white"
                    : "bg-white border"
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.sentAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
          >
            Send
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
    // TODO: Replace with actual API call to get students with booked sessions
    const fetchStudents = async () => {
      try {
        // const response = await fetch('/api/tutor/students-with-sessions', { credentials: 'include' });
        // const data = await response.json();
        // setStudents(data);
        
        // Mock data
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">New Message</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">Select a student to start a conversation:</p>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No students with booked sessions</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.map((student) => (
                <button
                  key={student.userId}
                  onClick={() => onSelectStudent(student.userId)}
                  className="w-full p-3 border rounded-lg hover:bg-emerald-50 hover:border-emerald-600 transition-colors text-left"
                >
                  <div className="font-semibold">{student.name}</div>
                  <div className="text-sm text-gray-600">{student.email}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
