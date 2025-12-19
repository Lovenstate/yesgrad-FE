import 
{ 
  TutorProfileRequest,
  ApiResponse,
  LoginResponse, 
  RegisterResponse, 
  TutorProfileResponse, 
  UserRole 
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

  async login(data: { email: string; password: string }): Promise<ApiResponse<UserRole>> {
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
  }
};

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
  }
};