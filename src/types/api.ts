// Common response wrapper from backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  error: {
    code: string;
    message: string;
    details: any;
  } | null;
}

// User roles
export type UserRole = 'STUDENT' | 'TUTOR';

// Auth responses
export interface LoginResponse {
  role: UserRole;
}

export interface RegisterResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// User profile
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  zipCode?: string;
}

export interface TutorProfileResponse {
  id: number;
  userId: number;
  profilePhotoUrl: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: number;
  hourlyRate: number;
  cancellationPolicy: string;
  travelPolicy: string;
  createdAt: string;
  updatedAt: string;
  subjects: string[];
  languages: SpeakingLanguages[];
  availability: Availability[];
}

export interface TutorProfileRequest {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  hourlyRate?: number;
  cancellationPolicy?: string;
  travelPolicy?: string;
  subjects?: string[];
  languages?: SpeakingLanguages[];
  availability?: Availability[];
}


export interface SpeakingLanguages {
  language: string;
  proficiency: string;
}

export interface Availability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TutorCompleteSettings {
  email?: string
  phone?: string
  bio?: string
  instantBook?: boolean
  responseTime?: number
  emailNotifications?: boolean
  smsNotifications?: boolean
  lessonReminders?: boolean
  paymentMethod?: string
  payoutFrequency?: string
  passwordChanged?: boolean
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}
