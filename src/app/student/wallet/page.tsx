'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StudentWallet() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // TODO: Get from API
  const savedCards = [
    { id: 1, last4: '4242', brand: 'Visa', expiryDate: '12/25', isDefault: true }
  ];

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add card via API
    console.log('Adding card:', cardData);
    setShowAddCard(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/student/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-2">Manage your payment methods and billing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                <button
                  onClick={() => setShowAddCard(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Add Card
                </button>
              </div>
            </div>
            <div className="p-6">
              {savedCards.length > 0 ? (
                <div className="space-y-4">
                  {savedCards.map(card => (
                    <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          {card.brand}
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• {card.last4}</p>
                          <p className="text-sm text-gray-500">Expires {card.expiryDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {card.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Default</span>
                        )}
                        <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No payment methods added</p>
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Add Your First Card
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Math Session - Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Dec 16, 2024</p>
                  </div>
                  <span className="text-red-600 font-medium">-$45.00</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Science Session - Mike Chen</p>
                    <p className="text-sm text-gray-500">Dec 15, 2024</p>
                  </div>
                  <span className="text-red-600 font-medium">-$50.00</span>
                </div>
              </div>
              
              <Link 
                href="/student/transactions" 
                className="block mt-4 text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Transactions
              </Link>
            </div>
          </div>
        </div>

        {showAddCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add Payment Method</h3>
                <button
                  onClick={() => setShowAddCard(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddCard} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardData.cardholderName}
                    onChange={(e) => setCardData({...cardData, cardholderName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={(e) => setCardData({...cardData, expiryDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddCard(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}