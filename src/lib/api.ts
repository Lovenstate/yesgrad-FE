import 
{ 
  TutorProfileRequest,
  ApiResponse, 
  RegisterResponse, 
  TutorProfileResponse, 
  UserRole,
  SubjectNode,
  TutorCompleteSettings,
  Subject
} from '@/types/api';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },

  async login(data: { email: string; password: string }): Promise<ApiResponse<{ role: UserRole; isFirstLogin: boolean }>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },

  async logout(): Promise<ApiResponse<string>> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  },

  async forgotPassword(data: { email: string, ipAddress: string }): Promise<ApiResponse<string>> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send reset email');
    }
    
    return response.json();
  },

  async verifyResetToken(token: string): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-reset-token/${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify token');
    }

    return response.json();
  },

  async resetPassword(data: { token: string; newPassword: string }): Promise<ApiResponse<string>> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update password');
    }

    return response.json();
  },

  async verifyEmail(data: {token: string}): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update password');
    }

    return response.json();
  },
}

export const tutorProfileAPI = {
  async getProfile(): Promise<ApiResponse<TutorProfileResponse>> {
    const response = await fetch(`${API_BASE_URL}/tutor/profile`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async updateProfile(data: TutorProfileRequest): Promise<ApiResponse<TutorProfileResponse>> {
    const response = await fetch(`${API_BASE_URL}/tutor/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  async uploadPhoto(file: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/tutor/profile/photo`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload photo');
    return response.json();
  },

  async getTutorCompleteSettings(): Promise<ApiResponse<TutorCompleteSettings>> {
    const response = await fetch(`${API_BASE_URL}/tutor/profile/complete-settings`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async updateTutorCompleteSettings(data: Partial<TutorCompleteSettings>): Promise<ApiResponse<TutorCompleteSettings>> {
    const response = await fetch(`${API_BASE_URL}/tutor/profile/complete-settings`, {
       method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    return response.json();
  },
};

export const subjectAPI = {
  async getAllSubjects(): Promise<ApiResponse<SubjectNode[]>> {
    const response = await fetch(`${API_BASE_URL}/subjects/tree`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch subjects');
    }

    return response.json();
  },

  async getSubjectById(id: string): Promise<ApiResponse<Subject>> {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch subject');
    }

    return response.json();
  },

  async getChildrenSubjectByParentId(parentId: string): Promise<ApiResponse<Subject[]>> {
    const response = await fetch(`${API_BASE_URL}/subjects/${parentId}/children`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch subject');
    }

    return response.json();
  }
}