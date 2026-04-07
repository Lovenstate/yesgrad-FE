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
  emailVerified: boolean
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
  firstLogin: boolean;
  subjects: string[];
  languages: SpeakingLanguages[];
  availability: Availability[];
}

export interface TutorProfileRequest {
  school?: string;
  degree?: string;
  bio?: string;
  headline?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  hourlyRate?: number;
  cancellationPolicy?: string;
  travelPolicy?: string;
  subjects?: string[];
  languages?: SpeakingLanguages[];
  availability?: Availability[];
  onboardingStatus?: OnboardingStatus;
}


export interface SpeakingLanguages {
  id: number;
  studentId?: number;
  language: string;
  proficiency: string;
}

export interface Availability {
  studentId?: number
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
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

export interface TutorSubject {
  id: number;
  tutorId?: number;
  subjectId: number;
  hourlyRate: number;
  subjectName?: string;
  createdAt: string;
}

export interface TutorSubjectsRequest {
  subjects: TutorSubject[];
}

export interface TutorEducation {
  school: string;
  degree: string;
  graduationYear: number;
  fieldOfStudy: string;
}

export interface TutorEducationsRequest {
  educations: TutorEducation[];
}

export interface TutorAvailability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TutorAvailabilityRequest {
  availabilities: TutorAvailability[];
}

/**
 * -------------------- Messaging --------------------
 */

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  replyToMessageId: number | null;
  quotedMessage: Message | null;
  sentAt: string;
  readAt: string | null;
  isRead: boolean;
}

export interface SendMessagePayload {
  senderId: number;
  receiverId: number;
  content: string;
  replyToMessageId?: number | null;
}

export interface ConversationSummary {
  otherUserId: number;
  lastMessageContent: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface AnalyticsResponse {
  averageResponseTimeHours?: number;
  responseRatePercent?: number;
}

/**
 * -------------------- Tutor Dashboard --------------------
 */
export type SessionStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'DECLINED';

export interface Session {
  id: number;
  tutorId: number;
  studentId: number;
  tutorName?: string;
  studentName?: string;
  subjectId?: number;
  subjectName: string;
  sessionDate: string;       // "yyyy-MM-dd"
  startTime: string;         // "HH:mm:ss"
  endTime: string;           // "HH:mm:ss"
  durationMinutes: number;
  hourlyRate?: number;
  amount: number | null;
  lessonFormat?: 'ONLINE' | 'IN_PERSON';
  location?: string;
  status: SessionStatus;
  notes?: string;
  cancellationReason?: string;
  createdAt?: string;
}

export interface TutorDashboardResponse {
  name: string,
  hoursTutored: number,
  rating: number,
  ratingCount: number,
  hasDirectDeposit: boolean,
  responseRate: string,
  responseTime: string,
  totalEarnings: number,
  amountPaid: number,
  amountOwed: number,
  unreadMessages: number,
  upcomingLessons: Session[],
  recentLessons: Session[],
  profileCompletion: number,
  onboardingStatus: string
}

export interface  BookSessionRequest {
  studentId: number;
  subjectId: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  hourlyRate: number;
  amount: number;
  lessonFormat: 'ONLINE' | 'IN_PERSON';
  location?: string;
  notes?: string;
}

export interface SubmitLessonRequest {
  studentId: number;
  subjectId: number;
  sessionDate: string;
  startTime: string;
  durationMinutes: number;
  notes?: string;
}

export interface TutorStudent {
  userId: number;
  name: string;
  email: string;
  totalSessions: number;
  totalHours: number;
  lastSessionAt: string;
  subjectsTaught: string[];
}

/**
 * -------------------- Student --------------------
 */
export interface StudentProfileRequest {
  gradeLevel?: string;
  learningGoals?: string;
  budgetMin?: number;
  budgetMax?: number;
  lessonFormat?: 'ONLINE' | 'IN_PERSON' | 'BOTH';
  subjectIds?: number[];
  onboardingCompleted?: boolean;
}

export interface StudentProfileResponse {
  id: number;
  userId: number;
  gradeLevel: string;
  bio: string;
  school: string;
  timezone: string;
  learningGoals: string;
  learningStyle: string;
  budgetMin: number;
  budgetMax: number;
  lessonFormat: string;
  onboardingStatus: string;
  profileCompletion: number;
  subjects: StudentSubjectResponse[];
  languages: SpeakingLanguages[];
  availability: Availability[];
}

export interface StudentDashboardResponse {
  name: string;
  upcomingLessons: Session[];
  recentLessons: Session[];
  totalHours: number;
  totalSessions: number;
  activeTutors: number;
  unreadMessages: number;
  hasPaymentMethod: boolean;
}

export interface TutorSearchParams {
  search?: string;
  subjectId?: number;
  subject?: string;
  minPrice?: number;
  maxPrice?: number;
  lessonFormat?: string;
  sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'experience';
}

export interface TutorSearchResult {
  tutorId: number;
  userId: number;
  name: string;
  headline: string;
  bio: string;
  profilePhotoUrl: string;
  subjects: string[];
  hourlyRate: number;
  rating: number;
  ratingCount: number;
  totalSessions: number;
  lessonFormats: string[];
  instantBook: boolean;
}

export interface TutorPublicProfile extends TutorSearchResult {
  school: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: number;
  availability: Availability[];
  cancellationPolicy: string;
}

export interface AvailableSlot {
  date: string;       // "yyyy-MM-dd"
  startTime: string;  // "HH:mm"
  endTime: string;    // "HH:mm"
}


export interface StudentSubjectResponse {
 id: number;
 subjectId: number;
 subjectName: string;
 level: string
}

export interface StudentSubjectRequest {
 subjectId: number;
 level: string
}

export interface StudentLanguageRequest {
 language: string;
 proficiency: string
}

export interface StudentAvailabilityeRequest {
 dayOfWeek: string;
 startTime: string;
 endTime: string
}