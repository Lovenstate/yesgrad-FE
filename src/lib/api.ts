import {
  TutorProfileRequest,
  ApiResponse,
  RegisterResponse,
  TutorProfileResponse,
  UserRole,
  SubjectNode,
  TutorCompleteSettings,
  Subject,
  TutorSubjectsRequest,
  TutorEducationsRequest,
  TutorAvailabilityRequest,
  Message,
  SendMessagePayload,
  UnreadCountResponse,
  ConversationSummary,
  AnalyticsResponse,
  TutorDashboardResponse,
  Session,
  BookSessionRequest,
  SubmitLessonRequest,
  TutorStudent,
  StudentProfileRequest,
  StudentProfileResponse,
  StudentDashboardResponse,
  TutorSearchParams,
  TutorSearchResult,
  TutorPublicProfile,
  AvailableSlot,
  StudentSubjectRequest,
  StudentLanguageRequest,
  StudentAvailabilityeRequest,
  StudentSubjectResponse,
  SpeakingLanguages,
  Availability,
  TutorSubject,
} from "@/types/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  if (res.status === 401) {
    localStorage.removeItem('userId');
    localStorage.removeItem('tutorId');
    localStorage.removeItem('emailVerified');
    localStorage.removeItem('onboardingStatus');
    const protectedPaths = ['/student/', '/tutor/'];
    const isProtected = protectedPaths.some(p => window.location.pathname.startsWith(p));
    if (isProtected) window.location.href = '/auth/login';
    return undefined as T;
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error || `Request failed: ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const authAPI = {
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    zipCode: string;
    role: string;
  }): Promise<ApiResponse<RegisterResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ role: UserRole; isFirstLogin: boolean; emailVerified: boolean }>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  async logout(): Promise<ApiResponse<string>> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return response.json();
  },

  async forgotPassword(data: {
    email: string;
    ipAddress: string;
  }): Promise<ApiResponse<string>> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send reset email");
    }

    return response.json();
  },

  async verifyResetToken(token: string): Promise<ApiResponse<boolean>> {
    const response = await fetch(
      `${API_BASE_URL}/auth/verify-reset-token/${token}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to verify token");
    }

    return response.json();
  },

  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<string>> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update password");
    }

    return response.json();
  },

  async verifyEmail(data: { token: string }): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update password");
    }

    return response.json();
  },
};

export const tutorProfileAPI = {
  async getProfile(): Promise<ApiResponse<TutorProfileResponse>> {
    const response = await fetch(`${API_BASE_URL}/tutor/profile`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
  },

  async updateProfile(
    data: TutorProfileRequest,
  ): Promise<ApiResponse<TutorProfileResponse>> {
    const response = await fetch(`${API_BASE_URL}/tutor/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return response.json();
  },

  async uploadPhoto(file: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/tutor/profile/photo`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload photo");
    return response.json();
  },

  async getTutorCompleteSettings(): Promise<ApiResponse<TutorCompleteSettings>> {
    const response = await fetch(
      `${API_BASE_URL}/tutor/profile/complete-settings`,
      {
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
  },

  async updateTutorCompleteSettings(
    data: Partial<TutorCompleteSettings>,
  ): Promise<ApiResponse<TutorCompleteSettings>> {
    const response = await fetch(
      `${API_BASE_URL}/tutor/profile/complete-settings`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    return response.json();
  },

  async createTutorSubject(data: TutorSubjectsRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tutor/profile/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch subject");
    }
  },

  async createTutorEducation(
    data: TutorEducationsRequest,
    tutorId: number,
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/tutor/profile/${tutorId}/education`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch subject");
    }
  },

  async createTutorAvailability(
    data: TutorAvailabilityRequest,
    tutorId: number,
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/tutor/profile/${tutorId}/availabilities`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch subject");
    }
  },

  async getTutorDashboard(): Promise<ApiResponse<TutorDashboardResponse>> {
    return request(`/tutor/dashboard`);
  },
};

export const sessionAPI = {
  async getTutorSessions(status?: string): Promise<ApiResponse<Session[]>> {
    const query = status ? `?status=${status}` : '';
    return request(`/sessions/tutor${query}`);
  },

  async getStudentSessions(status?: string): Promise<ApiResponse<Session[]>> {
    const query = status ? `?status=${status}` : '';
    return request(`/sessions/student${query}`);
  },

  async bookSession(data: BookSessionRequest): Promise<ApiResponse<Session>> {
    return request('/sessions', { method: 'POST', body: JSON.stringify(data) });
  },

  async submitLesson(data: SubmitLessonRequest): Promise<ApiResponse<Session>> {
    return request('/sessions/submit', { method: 'POST', body: JSON.stringify(data) });
  },

  async confirmSession(sessionId: number): Promise<ApiResponse<Session>> {
    return request(`/sessions/${sessionId}/confirm`, { method: 'PUT' });
  },

  async declineSession(sessionId: number, reason?: string): Promise<ApiResponse<Session>> {
    return request(`/sessions/${sessionId}/decline`, { method: 'PUT', body: JSON.stringify({ reason }) });
  },

  async completeSession(sessionId: number): Promise<ApiResponse<Session>> {
    return request(`/sessions/${sessionId}/complete`, { method: 'PUT' });
  },

  async cancelSession(sessionId: number, reason?: string): Promise<ApiResponse<Session>> {
    return request(`/sessions/${sessionId}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) });
  },

  async getTutorStudents(): Promise<ApiResponse<TutorStudent[]>> {
    return request('/tutor/profile/students');
  },

  async getTutorSubjetcs(): Promise<ApiResponse<TutorSubject[]>> {
    return request('/tutor/profile/tutorSubjects');
  },

  async getTutorAvailability(): Promise<ApiResponse<TutorAvailabilityRequest>> {
    return request('/tutor/profile/availability');
  },

  async updateTutorAvailability(data: TutorAvailabilityRequest): Promise<ApiResponse<TutorAvailabilityRequest>> {
    return request('/tutor/profile/availability', { method: 'PUT', body: JSON.stringify(data) });
  },
};

export const studentAPI = {
  async getProfile(): Promise<ApiResponse<StudentProfileResponse>> {
    return request('/student/profile/full');
  },

  async updateProfile(data: StudentProfileRequest): Promise<ApiResponse<StudentProfileResponse>> {
    return request('/student/profile', { method: 'PUT', body: JSON.stringify(data) });
  },

  async getDashboard(): Promise<ApiResponse<StudentDashboardResponse>> {
    return request('/student/dashboard');
  },

  async saveBasicProfileInfo(data: StudentProfileRequest): Promise<ApiResponse<StudentProfileResponse>> {
    return request('/student/onboarding/basic-info', { method: 'PUT', body: JSON.stringify(data) });
  },

  async saveSubjects(subjects: StudentSubjectRequest[]): Promise<ApiResponse<StudentSubjectResponse[]>> {
    return request('/student/onboarding/subjects', { method: 'PUT', body: JSON.stringify(subjects) });
  },

  async saveLanguages(data: StudentLanguageRequest[]): Promise<ApiResponse<SpeakingLanguages[]>> {
    return request('/student/onboarding/languages', { method: 'PUT', body: JSON.stringify(data) });
  },

  async saveAvailability(data: StudentAvailabilityeRequest[]): Promise<ApiResponse<Availability[]>> {
    return request('/student/onboarding/availability', { method: 'PUT', body: JSON.stringify(data) });
  },

  async searchTutors(params: TutorSearchParams): Promise<ApiResponse<TutorSearchResult[]>> {
    const query = new URLSearchParams();
    if (params.subject) query.set('subject', params.subject);
    if (params.subjectId) query.set('subjectId', String(params.subjectId));
    if (params.minPrice) query.set('minPrice', String(params.minPrice));
    if (params.maxPrice) query.set('maxPrice', String(params.maxPrice));
    if (params.lessonFormat) query.set('lessonFormat', params.lessonFormat);
    if (params.search) query.set('search', params.search);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    return request(`/tutor/profile/search?${query.toString()}`);
  },

  async getTutorProfile(tutorId: number): Promise<ApiResponse<TutorPublicProfile>> {
    return request(`/tutors/${tutorId}/public`);
  },

  async getTutorAvailability(tutorId: number, date: string): Promise<ApiResponse<AvailableSlot[]>> {
    return request(`/tutor/profile/slot${tutorId}/availability?date=${date}`);
  },
};

export const subjectAPI = {
  async getAllSubjects(): Promise<ApiResponse<SubjectNode[]>> {
    const response = await fetch(`${API_BASE_URL}/subjects/tree`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch subjects");
    }

    return response.json();
  },

  async getSubjectById(id: string): Promise<ApiResponse<Subject>> {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch subject");
    }

    return response.json();
  },

  async getChildrenSubjectByParentId(
    parentId: string,
  ): Promise<ApiResponse<Subject[]>> {
    const response = await fetch(
      `${API_BASE_URL}/subjects/${parentId}/children`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch subject");
    }

    return response.json();
  },
};

export const messagingApi = {
  async sendMessage(payload: SendMessagePayload): Promise<Message> {
    return request("/messages", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getConversation(
    userId: number,
    otherUserId: number,
  ): Promise<Message[]> {
    return request(`/messages/conversation/${otherUserId}?userId=${userId}`);
  },

  async markMessageRead(messageId: number, userId: number): Promise<Message> {
    return request(`/messages/${messageId}/read?userId=${userId}`, {
      method: "PATCH",
    });
  },

  // Unread
  async getUnreadMessages(userId: number): Promise<Message[]> {
    return request(`/messages/unread?userId=${userId}`);
  },

  async getUnreadCount(userId: number): Promise<UnreadCountResponse> {
    return request(`/messages/unread/count?userId=${userId}`);
  },

  // Inbox
  async getInbox(userId: number): Promise<ConversationSummary[]> {
    return request(`/messages/inbox?userId=${userId}`);
  },

  // analytics
  async getAverageResponseTime(
    userId: number,
    since: string,
  ): Promise<AnalyticsResponse> {
    return request(
      `/messages/analytics/response-time?userId=${userId}&since=${encodeURIComponent(since)}`,
    );
  },

  async getResponseRate(
    userId: number,
    since: string,
  ): Promise<AnalyticsResponse> {
    return request(
      `/messages/analytics/response-rate?userId=${userId}&since=${encodeURIComponent(since)}`,
    );
  },

  // Delete
  async deleteMessage(messageId: number, requesterId: number): Promise<void> {
    return request(`/messages/${messageId}?requesterId=${requesterId}`, {
      method: "DELETE",
    });
  },

};