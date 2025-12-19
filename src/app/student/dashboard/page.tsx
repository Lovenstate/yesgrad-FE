'use client';

import Link from 'next/link';

export default function StudentDashboard() {
  // TODO: Get from API
  const user = { firstName: 'John', hasPaymentMethod: false };
  const upcomingSessions = [
    { id: 1, tutor: 'Sarah Johnson', subject: 'Math', date: 'Today', time: '3:00 PM - 4:00 PM', status: 'confirmed' },
    { id: 2, tutor: 'Mike Chen', subject: 'Science', date: 'Tomorrow', time: '2:00 PM - 3:00 PM', status: 'confirmed' }
  ];
  const myTutors = [
    { id: 1, name: 'Sarah Johnson', subject: 'Math', rating: 4.9, sessions: 12 },
    { id: 2, name: 'Mike Chen', subject: 'Science', rating: 4.8, sessions: 8 },
    { id: 3, name: 'Emma Davis', subject: 'English', rating: 5.0, sessions: 5 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-600 mt-2">Manage your tutoring sessions and progress</p>
        </div>

        {!user.hasPaymentMethod && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-amber-800">
                  Add a payment method to book sessions with your tutors.
                </p>
              </div>
              <div className="ml-4">
                <Link href="/student/wallet" className="bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-700">
                  Add Payment Method
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Sessions</h3>
            <p className="text-3xl font-bold text-blue-600">2</p>
            <p className="text-sm text-gray-500">Next: Today 3:00 PM</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Hours</h3>
            <p className="text-3xl font-bold text-green-600">24</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Tutors</h3>
            <p className="text-3xl font-bold text-purple-600">3</p>
            <p className="text-sm text-gray-500">Math, Science, English</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
            </div>
            <div className="p-6">
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <p className="font-medium">{session.subject} with {session.tutor}</p>
                        <p className="text-sm text-gray-600">{session.date}, {session.time}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">{session.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No upcoming sessions</p>
                  <Link href="/find-tutor" className="text-blue-600 hover:text-blue-700 font-medium">
                    Book a Session
                  </Link>
                </div>
              )}
              
              <Link 
                href="/student/sessions" 
                className="block mt-4 text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Sessions
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">My Tutors</h2>
            </div>
            <div className="p-6">
              {myTutors.length > 0 ? (
                <div className="space-y-4">
                  {myTutors.map(tutor => (
                    <div key={tutor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {tutor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{tutor.name}</p>
                          <p className="text-sm text-gray-600">{tutor.subject} • {tutor.sessions} sessions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium">{tutor.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No tutors yet</p>
                  <Link href="/find-tutor" className="text-blue-600 hover:text-blue-700 font-medium">
                    Find a Tutor
                  </Link>
                </div>
              )}
              
              <Link 
                href="/student/tutors" 
                className="block mt-4 text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Manage Tutors
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Math with Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Yesterday, 2:00 PM - 3:00 PM</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Completed</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Science with Mike Chen</p>
                  <p className="text-sm text-gray-500">Dec 15, 4:00 PM - 5:00 PM</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Completed</span>
              </div>
            </div>
          </div>
        </div>



        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link 
            href="/find-tutor" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
          >
            Find New Tutor
          </Link>
          <Link 
            href="/student/wallet" 
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
          >
            Manage Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}