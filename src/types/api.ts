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
  isFirstLogin: boolean;
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

export type OnboardingStatus = 'STARTED' | 'SKIPPED' | 'FINISHED';

export interface TutorProfileResponse {
  id: number;
  userId: number;
  profilePhotoUrl: string;
  school: string;
  degree: string;
  bio: string;
  headLine: string;
  onboardingStatus: OnboardingStatus;
  profileCompletion: number;
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
  bio?: string;
  headLine?: string;
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

export interface SubjectNode {
  id: number;
  name: string;
  children: SubjectNode[];
};

export interface Subject {
  id: number;
  slug: string;
  name: string;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}