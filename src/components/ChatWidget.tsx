'use client';

import { useState } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg border w-80 h-96 mb-4">
          <div className="bg-amber-600 text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Chat with us!</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            <div className="bg-gray-100 p-3 rounded-lg mb-3">
              <p className="text-sm">Hi! How can we help you find the perfect tutor today?</p>
            </div>
          </div>
          <div className="p-4 border-t">
            <input 
              type="text" 
              placeholder="Type your message..."
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.456-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
        </svg>
      </button>
    </div>
  );
}