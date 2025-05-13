// 이용자 관련 타입 정의
export type UserRole = "admin" | "member";

export type UserStatus = "active" | "inactive" | "pending";

// 사용자 생성을 위한 인터페이스
export interface CreateUserDTO {
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
  institutionId: string;
  institutionName: string;
  role: UserRole;
  status: UserStatus;
  birthDate?: string;
  gender?: 'male' | 'female';
  jobTitle?: string;
  licenseNumber?: string;
}

// 사용자 수정을 위한 인터페이스
export interface UpdateUserDTO extends Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "lastLogin">> {
  password?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  institutionId: string;
  institutionName: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  jobTitle?: string;
  licenseNumber?: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  createdBy?: string;
}

// Mobile앱 사용자 관련 타입 정의
export type MobileUserStatus = "active" | "inactive" | "pending" | "blocked";

export interface MobileUser {
  id: string;
  name: string;
  username: string;
  phoneNumber: string;
  institutionId: string;
  institutionName: string;
  licenseId: string;
  licenseType: LicenseType;
  deviceId: string;
  status: MobileUserStatus;
  usageCount: number;
  totalCount: number;
  lastAccess: string | null;
  createdAt: string;
  updatedAt: string;
}

// 기관 관련 타입 정의
export interface Institution {
  id: string;
  name: string;
  businessNumber: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: "active" | "inactive" | "pending";
  licenseType: "trial" | "standard" | "premium" | "none";
  licenseExpiry: string | null;
  createdAt: string;
  updatedAt: string;
}

// 라이선스 관련 타입 정의
export type LicenseType = "trial" | "standard" | "premium";
export type LicenseStatus = "active" | "expired" | "pending" | "canceled";

export interface License {
  id: string;
  institutionId: string;
  institutionName: string;
  type: LicenseType;
  status: LicenseStatus;
  startDate: string;
  expiryDate: string;
  maxUsers: number;
  maxPhotos: number;
  maxReports: number;
  currentUsers: number;
  currentPhotos: number;
  currentReports: number;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
}

// 라이선스 생성을 위한 인터페이스
export interface LicenseFormData {
  institutionId: string;
  type: LicenseType;
  startDate: string;
  expiryDate: string;
  maxUsers: number;
  maxPhotos: number;
  maxReports: number;
  status: LicenseStatus;
}

// 결제 내역 관련 타입 정의
export type PaymentMethod = "card" | "bank" | "vbank" | "phone" | "point";
export type PaymentStatus = "ready" | "paid" | "canceled" | "failed" | "refunded" | "partial_refunded";

export interface Payment {
  id: string;
  licenseId: string | null;
  institutionId: string;
  institutionName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paymentDate: string | null;
  cancelDate: string | null;
  refundDate: string | null;
  refundAmount: number | null;
  orderId: string;
  receiptUrl: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// 결제 생성을 위한 인터페이스
export interface PaymentFormData {
  institutionId: string;
  licenseId?: string;
  amount: number;
  method: PaymentMethod;
  description: string;
  status?: PaymentStatus;
  paymentDate?: string;
}

// 환불 처리를 위한 인터페이스
export interface RefundFormData {
  amount: number;
  reason: string;
}

// 사진 관련 타입 정의
export type PhotoStatus = "pending" | "analyzed" | "failed" | "deleted";
export type PhotoQuality = "high" | "medium" | "low" | "invalid";
export type AnalysisResult = "normal" | "abnormal" | "indeterminate";

export interface Photo {
  id: string;
  patientId: string;
  patientCode: string;
  institutionId: string;
  institutionName: string;
  userId: string;
  userName: string;
  fileName: string;
  filePath: string;
  thumbnailPath: string;
  fileSize: number;
  imageWidth: number;
  imageHeight: number;
  takenAt: string | null;
  uploadedAt: string;
  status: PhotoStatus;
  quality: PhotoQuality;
  analysisResult: AnalysisResult | null;
  analysisScore: number | null;
  analysisDate: string | null;
  reportId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// 사진 업로드를 위한 인터페이스
export interface PhotoUploadData {
  patientId: string;
  patientCode: string;
  institutionId: string;
  userId: string;
  file: File;
  takenAt?: string;
  notes?: string;
}

// 사진 분석 결과 인터페이스
export interface PhotoAnalysisResult {
  id: string;
  photoId: string;
  result: AnalysisResult;
  score: number;
  areas: {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    label: string;
  }[];
  metadata: Record<string, any>;
  processedAt: string;
  createdAt: string;
}

// 리포트 관련 타입 정의
export type ReportStatus = "draft" | "completed" | "archived";

export interface Report {
  id: string;
  patientId: string;
  patientCode: string;
  patientName: string | null;
  institutionId: string;
  institutionName: string;
  userId: string;
  userName: string;
  title: string;
  description: string | null;
  status: ReportStatus;
  photoIds: string[];
  photoCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

// 리포트 생성을 위한 인터페이스
export interface ReportFormData {
  patientId: string;
  patientCode: string;
  patientName?: string;
  institutionId: string;
  userId: string;
  title: string;
  description?: string;
  photoIds: string[];
  status?: ReportStatus;
}

// 공지사항 관련 타입 정의
export type NoticeStatus = "active" | "inactive" | "draft" | "scheduled";
export type NoticeTarget = "all" | "institution" | "user";

export interface Notice {
  id: string;
  title: string;
  content: string;
  status: NoticeStatus;
  isPinned: boolean;
  startDate: string | null;
  endDate: string | null;
  target: NoticeTarget;
  targetIds?: string[];
  viewCount: number;
  attachments?: {
    id: string;
    fileName: string;
    fileSize: number;
    fileUrl: string;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// 공지사항 생성을 위한 인터페이스
export interface NoticeFormData {
  title: string;
  content: string;
  status: NoticeStatus;
  isPinned: boolean;
  startDate?: string;
  endDate?: string;
  target: NoticeTarget;
  targetIds?: string[];
  attachments?: File[];
}

// FAQ 관련 타입 정의
export type FaqCategory = "general" | "account" | "service" | "payment" | "technical" | "etc";
export type FaqStatus = "active" | "inactive" | "draft";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  orderNum: number;
  status: FaqStatus;
  viewCount: number;
  attachments?: {
    id: string;
    fileName: string;
    fileSize: number;
    fileUrl: string;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// FAQ 생성을 위한 인터페이스
export interface FaqFormData {
  question: string;
  answer: string;
  category: FaqCategory;
  orderNum: number;
  status: FaqStatus;
  attachments?: File[];
}
