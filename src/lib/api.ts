import { 
  CreateUserDTO,
  UpdateUserDTO,
  Institution, 
  License, 
  LicenseFormData, 
  LicenseStatus, 
  LicenseType, 
  MobileUser,
  MobileUserStatus,
  Payment, 
  PaymentFormData, 
  PaymentMethod, 
  PaymentStatus, 
  Photo,
  PhotoStatus,
  PhotoQuality,
  AnalysisResult,
  PhotoUploadData,
  PhotoAnalysisResult,
  Report,
  ReportStatus,
  ReportFormData,
  RefundFormData, 
  User, 
  UserRole, 
  UserStatus,
  Notice,
  NoticeStatus,
  NoticeTarget,
  NoticeFormData,
  Faq,
  FaqCategory,
  FaqStatus,
  FaqFormData
} from "./definitions";

// 샘플 데이터 - 실제 구현에서는 API 호출로 대체
const SAMPLE_INSTITUTIONS: Institution[] = [
  {
    id: "1",
    name: "서울대학교병원",
    businessNumber: "123-45-67890",
    address: "서울특별시 종로구 대학로 101",
    contactName: "김의사",
    contactPhone: "010-1234-5678",
    contactEmail: "contact@snuh.org",
    status: "active",
    licenseType: "premium",
    licenseExpiry: "2026-12-31",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-05-01T14:30:00Z"
  },
  {
    id: "2",
    name: "연세세브란스병원",
    businessNumber: "234-56-78901",
    address: "서울특별시 서대문구 연세로 50-1",
    contactName: "박박사",
    contactPhone: "010-2345-6789",
    contactEmail: "contact@yuhs.ac",
    status: "active",
    licenseType: "standard",
    licenseExpiry: "2026-06-30",
    createdAt: "2024-02-10T10:15:00Z",
    updatedAt: "2024-04-15T11:20:00Z"
  },
  {
    id: "3",
    name: "아산병원",
    businessNumber: "345-67-89012",
    address: "서울특별시 송파구 아산병원로 86",
    contactName: "이원장",
    contactPhone: "010-3456-7890",
    contactEmail: "contact@amc.seoul.kr",
    status: "active",
    licenseType: "trial",
    licenseExpiry: "2025-07-31",
    createdAt: "2024-03-20T08:45:00Z",
    updatedAt: "2024-05-05T09:30:00Z"
  }
];

// 샘플 사진 데이터
const SAMPLE_PHOTOS: Photo[] = [
  {
    id: "PHT-2025-001",
    patientId: "PAT001",
    patientCode: "P20250001",
    institutionId: "1",
    institutionName: "서울대학교병원",
    userId: "1",
    userName: "김관리",
    fileName: "scalp_analysis_001.jpg",
    filePath: "/uploads/photos/2025/05/scalp_analysis_001.jpg",
    thumbnailPath: "/uploads/photos/2025/05/thumbnails/scalp_analysis_001_thumb.jpg",
    fileSize: 2458000,
    imageWidth: 3000,
    imageHeight: 2000,
    takenAt: "2025-05-01T09:15:00Z",
    uploadedAt: "2025-05-01T10:30:00Z",
    status: "analyzed",
    quality: "high",
    analysisResult: "normal",
    analysisScore: 0.92,
    analysisDate: "2025-05-01T10:35:00Z",
    reportId: "RPT-2025-001",
    notes: "첫 방문 시 촬영",
    createdAt: "2025-05-01T10:30:00Z",
    updatedAt: "2025-05-01T10:35:00Z"
  },
  {
    id: "PHT-2025-002",
    patientId: "PAT001",
    patientCode: "P20250001",
    institutionId: "1",
    institutionName: "서울대학교병원",
    userId: "1",
    userName: "김관리",
    fileName: "scalp_analysis_002.jpg",
    filePath: "/uploads/photos/2025/05/scalp_analysis_002.jpg",
    thumbnailPath: "/uploads/photos/2025/05/thumbnails/scalp_analysis_002_thumb.jpg",
    fileSize: 2550000,
    imageWidth: 3000,
    imageHeight: 2000,
    takenAt: "2025-05-01T09:18:00Z",
    uploadedAt: "2025-05-01T10:32:00Z",
    status: "analyzed",
    quality: "high",
    analysisResult: "abnormal",
    analysisScore: 0.78,
    analysisDate: "2025-05-01T10:37:00Z",
    reportId: "RPT-2025-001",
    notes: "정수리 부분, 2차 촬영",
    createdAt: "2025-05-01T10:32:00Z",
    updatedAt: "2025-05-01T10:37:00Z"
  },
  {
    id: "PHT-2025-003",
    patientId: "PAT002",
    patientCode: "P20250002",
    institutionId: "1",
    institutionName: "서울대학교병원",
    userId: "2",
    userName: "이사용",
    fileName: "scalp_analysis_003.jpg",
    filePath: "/uploads/photos/2025/05/scalp_analysis_003.jpg",
    thumbnailPath: "/uploads/photos/2025/05/thumbnails/scalp_analysis_003_thumb.jpg",
    fileSize: 2340000,
    imageWidth: 3000,
    imageHeight: 2000,
    takenAt: "2025-05-02T13:45:00Z",
    uploadedAt: "2025-05-02T14:20:00Z",
    status: "analyzed",
    quality: "medium",
    analysisResult: "normal",
    analysisScore: 0.85,
    analysisDate: "2025-05-02T14:25:00Z",
    reportId: "RPT-2025-002",
    notes: null,
    createdAt: "2025-05-02T14:20:00Z",
    updatedAt: "2025-05-02T14:25:00Z"
  },
  {
    id: "PHT-2025-004",
    patientId: "PAT003",
    patientCode: "P20250003",
    institutionId: "2",
    institutionName: "연세세브란스병원",
    userId: "3",
    userName: "박의사",
    fileName: "scalp_analysis_004.jpg",
    filePath: "/uploads/photos/2025/05/scalp_analysis_004.jpg",
    thumbnailPath: "/uploads/photos/2025/05/thumbnails/scalp_analysis_004_thumb.jpg",
    fileSize: 2680000,
    imageWidth: 3000,
    imageHeight: 2000,
    takenAt: "2025-05-03T10:15:00Z",
    uploadedAt: "2025-05-03T11:05:00Z",
    status: "analyzed",
    quality: "high",
    analysisResult: "abnormal",
    analysisScore: 0.65,
    analysisDate: "2025-05-03T11:10:00Z",
    reportId: "RPT-2025-003",
    notes: "탈모 진행 상태 확인",
    createdAt: "2025-05-03T11:05:00Z",
    updatedAt: "2025-05-03T11:10:00Z"
  },
  {
    id: "PHT-2025-005",
    patientId: "PAT004",
    patientCode: "P20250004",
    institutionId: "2",
    institutionName: "연세세브란스병원",
    userId: "4",
    userName: "정간호",
    fileName: "scalp_analysis_005.jpg",
    filePath: "/uploads/photos/2025/05/scalp_analysis_005.jpg",
    thumbnailPath: "/uploads/photos/2025/05/thumbnails/scalp_analysis_005_thumb.jpg",
    fileSize: 2415000,
    imageWidth: 3000,
    imageHeight: 2000,
    takenAt: "2025-05-04T15:30:00Z",
    uploadedAt: "2025-05-04T16:00:00Z",
    status: "pending",
    quality: "medium",
    analysisResult: null,
    analysisScore: null,
    analysisDate: null,
    reportId: null,
    notes: "분석 대기 중",
    createdAt: "2025-05-04T16:00:00Z",
    updatedAt: "2025-05-04T16:00:00Z"
  },
  {
    id: "PHT-2025-006",
    patientId: "PAT005",
    patientCode: "P20250005",
    institutionId: "3",
    institutionName: "아산병원",
    userId: "5",
    userName: "최원장",
    fileName: "scalp_analysis_006.jpg",
    filePath: "/uploads/photos/2025/05/scalp_analysis_006.jpg",
    thumbnailPath: "/uploads/photos/2025/05/thumbnails/scalp_analysis_006_thumb.jpg",
    fileSize: 2530000,
    imageWidth: 3000,
    imageHeight: 2000,
    takenAt: "2025-05-05T09:45:00Z",
    uploadedAt: "2025-05-05T10:30:00Z",
    status: "analyzed",
    quality: "high",
    analysisResult: "indeterminate",
    analysisScore: 0.50,
    analysisDate: "2025-05-05T10:35:00Z",
    reportId: "RPT-2025-004",
    notes: null,
    createdAt: "2025-05-05T10:30:00Z",
    updatedAt: "2025-05-05T10:35:00Z"
  },
  {
    id: "PHT-2025-007",
    patientId: "PAT001",
    patientCode: "P20250001",
    institutionId: "1",
    institutionName: "서울대학교병원",
    userId: "1",
    userName: "김관리",
    fileName: "scalp_analysis_007.jpg",
    filePath: "/uploads/photos/2025/05/scalp_analysis_007.jpg",
    thumbnailPath: "/uploads/photos/2025/05/thumbnails/scalp_analysis_007_thumb.jpg",
    fileSize: 2350000,
    imageWidth: 3000,
    imageHeight: 2000,
    takenAt: "2025-05-08T14:30:00Z",
    uploadedAt: "2025-05-08T15:45:00Z",
    status: "failed",
    quality: "low",
    analysisResult: null,
    analysisScore: null,
    analysisDate: "2025-05-08T15:50:00Z",
    reportId: null,
    notes: "이미지 품질 문제로 분석 실패",
    createdAt: "2025-05-08T15:45:00Z",
    updatedAt: "2025-05-08T15:50:00Z"
  },
  {
    id: "PHT-2025-008",
    patientId: "PAT006",
    patientCode: "P20250006",
    institutionId: "3",
    institutionName: "아산병원",
    userId: "5",
    userName: "최원장",
    fileName: "scalp_analysis_008.jpg",
    filePath: "/uploads/photos/2025/05/scalp_analysis_008.jpg",
    thumbnailPath: "/uploads/photos/2025/05/thumbnails/scalp_analysis_008_thumb.jpg",
    fileSize: 2410000,
    imageWidth: 3000,
    imageHeight: 2000,
    takenAt: "2025-05-09T11:15:00Z",
    uploadedAt: "2025-05-09T13:30:00Z",
    status: "analyzed",
    quality: "high",
    analysisResult: "normal",
    analysisScore: 0.88,
    analysisDate: "2025-05-09T13:35:00Z",
    reportId: null,
    notes: "정기 검진",
    createdAt: "2025-05-09T13:30:00Z",
    updatedAt: "2025-05-09T13:35:00Z"
  }
];

// 샘플 리포트 데이터
const SAMPLE_REPORTS: Report[] = [
  {
    id: "RPT-2025-001",
    patientId: "PAT001",
    patientCode: "P20250001",
    patientName: "홍길동",
    institutionId: "1",
    institutionName: "서울대학교병원",
    userId: "1",
    userName: "김관리",
    title: "초기 탈모 진단 보고서",
    description: "두피 상태 분석 및 초기 탈모 징후 확인",
    status: "completed",
    photoIds: ["PHT-2025-001", "PHT-2025-002"],
    photoCount: 2,
    createdAt: "2025-05-01T11:00:00Z",
    updatedAt: "2025-05-01T11:30:00Z",
    completedAt: "2025-05-01T11:30:00Z"
  },
  {
    id: "RPT-2025-002",
    patientId: "PAT002",
    patientCode: "P20250002",
    patientName: "김철수",
    institutionId: "1",
    institutionName: "서울대학교병원",
    userId: "2",
    userName: "이사용",
    title: "정기 검진 보고서",
    description: "월간 두피 상태 확인",
    status: "completed",
    photoIds: ["PHT-2025-003"],
    photoCount: 1,
    createdAt: "2025-05-02T14:30:00Z",
    updatedAt: "2025-05-02T15:00:00Z",
    completedAt: "2025-05-02T15:00:00Z"
  },
  {
    id: "RPT-2025-003",
    patientId: "PAT003",
    patientCode: "P20250003",
    patientName: "이영희",
    institutionId: "2",
    institutionName: "연세세브란스병원",
    userId: "3",
    userName: "박의사",
    title: "탈모 진행 상태 보고서",
    description: "탈모 진행 속도 및 패턴 분석",
    status: "completed",
    photoIds: ["PHT-2025-004"],
    photoCount: 1,
    createdAt: "2025-05-03T11:15:00Z",
    updatedAt: "2025-05-03T11:45:00Z",
    completedAt: "2025-05-03T11:45:00Z"
  },
  {
    id: "RPT-2025-004",
    patientId: "PAT005",
    patientCode: "P20250005",
    patientName: "박지민",
    institutionId: "3",
    institutionName: "아산병원",
    userId: "5",
    userName: "최원장",
    title: "치료 효과 분석 보고서",
    description: "치료 3개월 후 상태 확인",
    status: "draft",
    photoIds: ["PHT-2025-006"],
    photoCount: 1,
    createdAt: "2025-05-05T10:40:00Z",
    updatedAt: "2025-05-05T10:40:00Z",
    completedAt: null
  }
];

// 샘플 라이선스 데이터
const SAMPLE_LICENSES: License[] = [
  {
    id: "1",
    institutionId: "1",
    institutionName: "서울대학교병원",
    type: "premium",
    status: "active",
    startDate: "2025-01-01T00:00:00Z",
    expiryDate: "2026-12-31T23:59:59Z",
    maxUsers: 50,
    maxPhotos: 10000,
    maxReports: 5000,
    currentUsers: 15,
    currentPhotos: 2500,
    currentReports: 1200,
    paymentId: "PAY-2025-001",
    createdAt: "2024-12-15T09:00:00Z",
    updatedAt: "2025-01-01T09:00:00Z"
  },
  {
    id: "2",
    institutionId: "2",
    institutionName: "연세세브란스병원",
    type: "standard",
    status: "active",
    startDate: "2025-01-15T00:00:00Z",
    expiryDate: "2026-06-30T23:59:59Z",
    maxUsers: 30,
    maxPhotos: 5000,
    maxReports: 2500,
    currentUsers: 10,
    currentPhotos: 1200,
    currentReports: 600,
    paymentId: "PAY-2025-002",
    createdAt: "2024-12-20T10:15:00Z",
    updatedAt: "2025-01-15T10:15:00Z"
  },
  {
    id: "3",
    institutionId: "3",
    institutionName: "아산병원",
    type: "trial",
    status: "active",
    startDate: "2025-04-01T00:00:00Z",
    expiryDate: "2025-07-31T23:59:59Z",
    maxUsers: 10,
    maxPhotos: 1000,
    maxReports: 500,
    currentUsers: 3,
    currentPhotos: 250,
    currentReports: 100,
    paymentId: null,
    createdAt: "2025-03-25T08:45:00Z",
    updatedAt: "2025-04-01T08:45:00Z"
  },
  {
    id: "4",
    institutionId: "1",
    institutionName: "서울대학교병원",
    type: "trial",
    status: "expired",
    startDate: "2024-10-01T00:00:00Z",
    expiryDate: "2024-12-31T23:59:59Z",
    maxUsers: 10,
    maxPhotos: 1000,
    maxReports: 500,
    currentUsers: 8,
    currentPhotos: 950,
    currentReports: 480,
    paymentId: null,
    createdAt: "2024-09-25T09:30:00Z",
    updatedAt: "2025-01-01T00:00:01Z"
  }
];

// 샘플 결제 데이터
const SAMPLE_PAYMENTS: Payment[] = [
  {
    id: "PAY-2025-001",
    licenseId: "1",
    institutionId: "1",
    institutionName: "서울대학교병원",
    amount: 2000000,
    method: "card",
    status: "paid",
    paymentDate: "2025-01-01T09:00:00Z",
    cancelDate: null,
    refundDate: null,
    refundAmount: null,
    orderId: "ORD-2025-001",
    receiptUrl: "https://example.com/receipts/PAY-2025-001",
    description: "프리미엄 라이선스 구매 (2025-01-01 ~ 2026-12-31)",
    createdAt: "2024-12-15T09:00:00Z",
    updatedAt: "2025-01-01T09:00:00Z"
  },
  {
    id: "PAY-2025-002",
    licenseId: "2",
    institutionId: "2",
    institutionName: "연세세브란스병원",
    amount: 1200000,
    method: "bank",
    status: "paid",
    paymentDate: "2025-01-15T10:15:00Z",
    cancelDate: null,
    refundDate: null,
    refundAmount: null,
    orderId: "ORD-2025-002",
    receiptUrl: "https://example.com/receipts/PAY-2025-002",
    description: "스탠다드 라이선스 구매 (2025-01-15 ~ 2026-06-30)",
    createdAt: "2024-12-20T10:15:00Z",
    updatedAt: "2025-01-15T10:15:00Z"
  },
  {
    id: "PAY-2025-003",
    licenseId: null,
    institutionId: "1",
    institutionName: "서울대학교병원",
    amount: 300000,
    method: "card",
    status: "refunded",
    paymentDate: "2025-02-15T11:30:00Z",
    cancelDate: null,
    refundDate: "2025-02-20T14:45:00Z",
    refundAmount: 300000,
    orderId: "ORD-2025-003",
    receiptUrl: "https://example.com/receipts/PAY-2025-003",
    description: "추가 사용자 라이선스 구매 (10명)",
    createdAt: "2025-02-15T11:30:00Z",
    updatedAt: "2025-02-20T14:45:00Z"
  },
  {
    id: "PAY-2025-004",
    licenseId: null,
    institutionId: "2",
    institutionName: "연세세브란스병원",
    amount: 500000,
    method: "vbank",
    status: "paid",
    paymentDate: "2025-03-10T09:20:00Z",
    cancelDate: null,
    refundDate: null,
    refundAmount: null,
    orderId: "ORD-2025-004",
    receiptUrl: "https://example.com/receipts/PAY-2025-004",
    description: "추가 사진 분석 (1000장)",
    createdAt: "2025-03-08T15:30:00Z",
    updatedAt: "2025-03-10T09:20:00Z"
  },
  {
    id: "PAY-2025-005",
    licenseId: null,
    institutionId: "3",
    institutionName: "아산병원",
    amount: 800000,
    method: "card",
    status: "partial_refunded",
    paymentDate: "2025-04-05T13:15:00Z",
    cancelDate: null,
    refundDate: "2025-04-10T16:40:00Z",
    refundAmount: 300000,
    orderId: "ORD-2025-005",
    receiptUrl: "https://example.com/receipts/PAY-2025-005",
    description: "스탠다드 라이선스 업그레이드 및 추가 기능",
    createdAt: "2025-04-05T13:15:00Z",
    updatedAt: "2025-04-10T16:40:00Z"
  }
];

const SAMPLE_USERS: User[] = [
  {
    id: "1",
    name: "김관리",
    email: "admin@example.com",
    username: "admin1",
    phoneNumber: "010-1234-5678",
    institutionId: "1",
    institutionName: "서울대학교병원",
    role: "admin",
    status: "active",
    lastLogin: "2025-05-09T14:30:00Z",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2025-05-09T14:30:00Z"
  },
  {
    id: "2",
    name: "이사용",
    email: "user1@example.com",
    username: "user1",
    phoneNumber: "010-2345-6789",
    institutionId: "1",
    institutionName: "서울대학교병원",
    role: "member",
    status: "active",
    lastLogin: "2025-05-08T10:20:00Z",
    createdAt: "2024-01-25T11:30:00Z",
    updatedAt: "2025-05-08T10:20:00Z"
  },
  {
    id: "3",
    name: "박의사",
    email: "doctor@example.com",
    username: "doctor1",
    phoneNumber: "010-3456-7890",
    institutionId: "2",
    institutionName: "연세세브란스병원",
    role: "admin",
    status: "active",
    lastLogin: "2025-05-07T16:45:00Z",
    createdAt: "2024-02-15T13:45:00Z",
    updatedAt: "2025-05-07T16:45:00Z"
  },
  {
    id: "4",
    name: "정간호",
    email: "nurse@example.com",
    username: "nurse1",
    phoneNumber: "010-4567-8901",
    institutionId: "2",
    institutionName: "연세세브란스병원",
    role: "member",
    status: "active",
    lastLogin: "2025-05-08T09:10:00Z",
    createdAt: "2024-02-20T14:20:00Z",
    updatedAt: "2025-05-08T09:10:00Z"
  },
  {
    id: "5",
    name: "최원장",
    email: "director@example.com",
    username: "director1",
    phoneNumber: "010-5678-9012",
    institutionId: "3",
    institutionName: "아산병원",
    role: "admin",
    status: "active",
    lastLogin: "2025-05-09T11:30:00Z",
    createdAt: "2024-03-25T10:00:00Z",
    updatedAt: "2025-05-09T11:30:00Z"
  },
  {
    id: "6",
    name: "홍직원",
    email: "staff@example.com",
    username: "staff1",
    phoneNumber: "010-6789-0123",
    institutionId: "3",
    institutionName: "아산병원",
    role: "member",
    status: "pending",
    lastLogin: null,
    createdAt: "2024-05-01T15:30:00Z",
    updatedAt: "2024-05-01T15:30:00Z"
  }
];

// 샘플 지연 함수 - API 호출 시뮬레이션
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 기관 목록 가져오기
export async function getInstitutions(): Promise<Institution[]> {
  await delay(500);
  return SAMPLE_INSTITUTIONS;
}

// 기관 상세 정보 가져오기
export async function getInstitutionById(id: string): Promise<Institution> {
  await delay(300);
  const institution = SAMPLE_INSTITUTIONS.find(inst => inst.id === id);
  
  if (!institution) {
    throw new Error(`기관 ID ${id}를 찾을 수 없습니다.`);
  }
  
  return institution;
}

// 이용자 목록 가져오기
export async function getUsers(params?: {
  search?: string;
  status?: UserStatus;
  role?: UserRole;
  institutionId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<{ users: User[]; total: number }> {
  await delay(500);
  
  let filteredUsers = [...SAMPLE_USERS];
  
  // 검색어 필터링
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.phoneNumber.includes(searchLower)
    );
  }
  
  // 상태 필터링
  if (params?.status) {
    filteredUsers = filteredUsers.filter(user => user.status === params.status);
  }
  
  // 역할 필터링
  if (params?.role) {
    filteredUsers = filteredUsers.filter(user => user.role === params.role);
  }
  
  // 기관 필터링
  if (params?.institutionId) {
    filteredUsers = filteredUsers.filter(user => user.institutionId === params.institutionId);
  }
  
  // 시작일 필터링
  if (params?.startDate) {
    const startDate = new Date(params.startDate);
    filteredUsers = filteredUsers.filter(user => new Date(user.createdAt) >= startDate);
  }
  
  // 종료일 필터링
  if (params?.endDate) {
    const endDate = new Date(params.endDate);
    endDate.setDate(endDate.getDate() + 1); // 종료일 포함
    filteredUsers = filteredUsers.filter(user => new Date(user.createdAt) < endDate);
  }
  
  // 총 레코드 수
  const total = filteredUsers.length;
  
  // 페이지네이션
  if (params?.page && params?.limit) {
    const startIndex = (params.page - 1) * params.limit;
    filteredUsers = filteredUsers.slice(startIndex, startIndex + params.limit);
  }
  
  return { users: filteredUsers, total };
}

// 이용자 상세 정보 가져오기
export async function getUserById(id: string): Promise<User> {
  await delay(300);
  const user = SAMPLE_USERS.find(user => user.id === id);
  
  if (!user) {
    throw new Error(`이용자 ID ${id}를 찾을 수 없습니다.`);
  }
  
  return user;
}

// 이용자 생성
export async function createUser(userData: CreateUserDTO): Promise<User> {
  await delay(800);
  
  // 새 사용자 ID 생성 (실제로는 서버에서 생성)
  const newId = (SAMPLE_USERS.length + 1).toString();
  
  const newUser: User = {
    id: newId,
    ...userData,
    lastLogin: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 샘플 데이터에 추가 (실제로는 DB에 저장)
  SAMPLE_USERS.push(newUser);
  
  return newUser;
}

// 이용자 수정
export async function updateUser(id: string, userData: UpdateUserDTO): Promise<User> {
  await delay(800);
  
  const userIndex = SAMPLE_USERS.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    throw new Error(`이용자 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 사용자 정보 업데이트
  const updatedUser = {
    ...SAMPLE_USERS[userIndex],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  SAMPLE_USERS[userIndex] = updatedUser;
  
  return updatedUser;
}

// 이용자 상태 변경
export async function updateUserStatus(id: string, status: UserStatus): Promise<User> {
  return updateUser(id, { status });
}

// 이용자 삭제
export async function deleteUser(id: string): Promise<boolean> {
  await delay(500);
  
  const userIndex = SAMPLE_USERS.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    throw new Error(`이용자 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 샘플 데이터에서 삭제 (실제로는 DB에서 삭제)
  SAMPLE_USERS.splice(userIndex, 1);
  
  return true;
}

// 라이선스 목록 가져오기
export async function getLicenses(params?: {
  search?: string;
  status?: LicenseStatus;
  type?: LicenseType;
  institutionId?: string;
  page?: number;
  limit?: number;
}): Promise<{ licenses: License[]; total: number }> {
  await delay(500);
  
  let filteredLicenses = [...SAMPLE_LICENSES];
  
  // 검색어 필터링
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredLicenses = filteredLicenses.filter(license => 
      license.institutionName.toLowerCase().includes(searchLower) ||
      license.id.toLowerCase().includes(searchLower)
    );
  }
  
  // 상태 필터링
  if (params?.status) {
    filteredLicenses = filteredLicenses.filter(license => license.status === params.status);
  }
  
  // 유형 필터링
  if (params?.type) {
    filteredLicenses = filteredLicenses.filter(license => license.type === params.type);
  }
  
  // 기관 필터링
  if (params?.institutionId) {
    filteredLicenses = filteredLicenses.filter(license => license.institutionId === params.institutionId);
  }
  
  // 총 레코드 수
  const total = filteredLicenses.length;
  
  // 페이지네이션
  if (params?.page && params?.limit) {
    const startIndex = (params.page - 1) * params.limit;
    filteredLicenses = filteredLicenses.slice(startIndex, startIndex + params.limit);
  }
  
  return { licenses: filteredLicenses, total };
}

// 라이선스 상세 정보 가져오기
export async function getLicenseById(id: string): Promise<License> {
  await delay(300);
  const license = SAMPLE_LICENSES.find(license => license.id === id);
  
  if (!license) {
    throw new Error(`라이선스 ID ${id}를 찾을 수 없습니다.`);
  }
  
  return license;
}

// 기관별 라이선스 가져오기
export async function getLicensesByInstitution(institutionId: string): Promise<License[]> {
  await delay(300);
  return SAMPLE_LICENSES.filter(license => license.institutionId === institutionId);
}

// 라이선스 생성
export async function createLicense(licenseData: LicenseFormData): Promise<License> {
  await delay(800);
  
  // 기관 정보 가져오기
  const institution = SAMPLE_INSTITUTIONS.find(inst => inst.id === licenseData.institutionId);
  
  if (!institution) {
    throw new Error(`기관 ID ${licenseData.institutionId}를 찾을 수 없습니다.`);
  }
  
  // 새 라이선스 ID 생성 (실제로는 서버에서 생성)
  const newId = (SAMPLE_LICENSES.length + 1).toString();
  
  const newLicense: License = {
    id: newId,
    institutionId: licenseData.institutionId,
    institutionName: institution.name,
    type: licenseData.type,
    status: licenseData.status || "active",
    startDate: licenseData.startDate,
    expiryDate: licenseData.expiryDate,
    maxUsers: licenseData.maxUsers,
    maxPhotos: licenseData.maxPhotos,
    maxReports: licenseData.maxReports,
    currentUsers: 0,
    currentPhotos: 0,
    currentReports: 0,
    paymentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 샘플 데이터에 추가 (실제로는 DB에 저장)
  SAMPLE_LICENSES.push(newLicense);
  
  // 기관의 라이선스 정보 업데이트 (실제로는 별도 API 호출 또는 트랜잭션)
  const institutionIndex = SAMPLE_INSTITUTIONS.findIndex(inst => inst.id === licenseData.institutionId);
  if (institutionIndex !== -1) {
    SAMPLE_INSTITUTIONS[institutionIndex] = {
      ...SAMPLE_INSTITUTIONS[institutionIndex],
      licenseType: licenseData.type,
      licenseExpiry: licenseData.expiryDate,
      updatedAt: new Date().toISOString()
    };
  }
  
  return newLicense;
}

// 라이선스 수정
export async function updateLicense(id: string, licenseData: Partial<LicenseFormData>): Promise<License> {
  await delay(800);
  
  const licenseIndex = SAMPLE_LICENSES.findIndex(license => license.id === id);
  
  if (licenseIndex === -1) {
    throw new Error(`라이선스 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 라이선스 정보 업데이트
  const updatedLicense = {
    ...SAMPLE_LICENSES[licenseIndex],
    ...licenseData,
    updatedAt: new Date().toISOString()
  };
  
  // 기관 이름 업데이트 (기관 ID가 변경된 경우)
  if (licenseData.institutionId && licenseData.institutionId !== SAMPLE_LICENSES[licenseIndex].institutionId) {
    const institution = SAMPLE_INSTITUTIONS.find(inst => inst.id === licenseData.institutionId);
    if (institution) {
      updatedLicense.institutionName = institution.name;
    }
  }
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  SAMPLE_LICENSES[licenseIndex] = updatedLicense as License;
  
  // 기관의 라이선스 정보 업데이트 (실제로는 별도 API 호출 또는 트랜잭션)
  if (licenseData.type || licenseData.expiryDate) {
    const institutionIndex = SAMPLE_INSTITUTIONS.findIndex(inst => inst.id === updatedLicense.institutionId);
    if (institutionIndex !== -1) {
      const updates: Partial<Institution> = {
        updatedAt: new Date().toISOString()
      };
      
      if (licenseData.type) {
        updates.licenseType = licenseData.type;
      }
      
      if (licenseData.expiryDate) {
        updates.licenseExpiry = licenseData.expiryDate;
      }
      
      SAMPLE_INSTITUTIONS[institutionIndex] = {
        ...SAMPLE_INSTITUTIONS[institutionIndex],
        ...updates
      };
    }
  }
  
  return updatedLicense as License;
}

// 라이선스 상태 변경
export async function updateLicenseStatus(id: string, status: LicenseStatus): Promise<License> {
  return updateLicense(id, { status });
}

// 라이선스 삭제
export async function deleteLicense(id: string): Promise<boolean> {
  await delay(500);
  
  const licenseIndex = SAMPLE_LICENSES.findIndex(license => license.id === id);
  
  if (licenseIndex === -1) {
    throw new Error(`라이선스 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 샘플 데이터에서 삭제 (실제로는 DB에서 삭제)
  SAMPLE_LICENSES.splice(licenseIndex, 1);
  
  return true;
}

// 결제 내역 목록 가져오기
export async function getPayments(params?: {
  search?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  institutionId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<{ payments: Payment[]; total: number }> {
  await delay(500);
  
  let filteredPayments = [...SAMPLE_PAYMENTS];
  
  // 검색어 필터링
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredPayments = filteredPayments.filter(payment => 
      payment.institutionName.toLowerCase().includes(searchLower) ||
      payment.id.toLowerCase().includes(searchLower) ||
      payment.orderId.toLowerCase().includes(searchLower) ||
      payment.description.toLowerCase().includes(searchLower)
    );
  }
  
  // 상태 필터링
  if (params?.status) {
    filteredPayments = filteredPayments.filter(payment => payment.status === params.status);
  }
  
  // 결제 방법 필터링
  if (params?.method) {
    filteredPayments = filteredPayments.filter(payment => payment.method === params.method);
  }
  
  // 기관 필터링
  if (params?.institutionId) {
    filteredPayments = filteredPayments.filter(payment => payment.institutionId === params.institutionId);
  }
  
  // 시작일 필터링
  if (params?.startDate) {
    const startDate = new Date(params.startDate);
    filteredPayments = filteredPayments.filter(payment => {
      if (!payment.paymentDate) return false;
      return new Date(payment.paymentDate) >= startDate;
    });
  }
  
  // 종료일 필터링
  if (params?.endDate) {
    const endDate = new Date(params.endDate);
    endDate.setDate(endDate.getDate() + 1); // 종료일 포함
    filteredPayments = filteredPayments.filter(payment => {
      if (!payment.paymentDate) return false;
      return new Date(payment.paymentDate) < endDate;
    });
  }
  
  // 총 레코드 수
  const total = filteredPayments.length;
  
  // 페이지네이션
  if (params?.page && params?.limit) {
    const startIndex = (params.page - 1) * params.limit;
    filteredPayments = filteredPayments.slice(startIndex, startIndex + params.limit);
  }
  
  return { payments: filteredPayments, total };
}

// 결제 내역 상세 정보 가져오기
export async function getPaymentById(id: string): Promise<Payment> {
  await delay(300);
  const payment = SAMPLE_PAYMENTS.find(payment => payment.id === id);
  
  if (!payment) {
    throw new Error(`결제 내역 ID ${id}를 찾을 수 없습니다.`);
  }
  
  return payment;
}

// 기관별 결제 내역 가져오기
export async function getPaymentsByInstitution(institutionId: string): Promise<Payment[]> {
  await delay(300);
  return SAMPLE_PAYMENTS.filter(payment => payment.institutionId === institutionId);
}

// 결제 내역 생성
export async function createPayment(paymentData: PaymentFormData): Promise<Payment> {
  await delay(800);
  
  // 기관 정보 가져오기
  const institution = SAMPLE_INSTITUTIONS.find(inst => inst.id === paymentData.institutionId);
  
  if (!institution) {
    throw new Error(`기관 ID ${paymentData.institutionId}를 찾을 수 없습니다.`);
  }
  
  // 새 결제 ID 생성 (실제로는 서버에서 생성)
  const paymentCount = SAMPLE_PAYMENTS.length + 1;
  const newId = `PAY-${new Date().getFullYear()}-${paymentCount.toString().padStart(3, '0')}`;
  const orderId = `ORD-${new Date().getFullYear()}-${paymentCount.toString().padStart(3, '0')}`;
  
  const newPayment: Payment = {
    id: newId,
    licenseId: paymentData.licenseId || null,
    institutionId: paymentData.institutionId,
    institutionName: institution.name,
    amount: paymentData.amount,
    method: paymentData.method,
    status: paymentData.status || "ready",
    paymentDate: paymentData.paymentDate || null,
    cancelDate: null,
    refundDate: null,
    refundAmount: null,
    orderId: orderId,
    receiptUrl: paymentData.status === "paid" ? `https://example.com/receipts/${newId}` : null,
    description: paymentData.description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 샘플 데이터에 추가 (실제로는 DB에 저장)
  SAMPLE_PAYMENTS.push(newPayment);
  
  // 라이선스와 연결된 경우 라이선스 업데이트
  if (paymentData.licenseId) {
    const licenseIndex = SAMPLE_LICENSES.findIndex(license => license.id === paymentData.licenseId);
    if (licenseIndex !== -1) {
      SAMPLE_LICENSES[licenseIndex] = {
        ...SAMPLE_LICENSES[licenseIndex],
        paymentId: newId,
        updatedAt: new Date().toISOString()
      };
    }
  }
  
  return newPayment;
}

// 결제 내역 상태 변경
export async function updatePaymentStatus(id: string, status: PaymentStatus): Promise<Payment> {
  await delay(800);
  
  const paymentIndex = SAMPLE_PAYMENTS.findIndex(payment => payment.id === id);
  
  if (paymentIndex === -1) {
    throw new Error(`결제 내역 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 결제 상태에 따른 처리
  const now = new Date().toISOString();
  const updateData: Partial<Payment> = {
    status: status,
    updatedAt: now
  };
  
  if (status === "paid" && !SAMPLE_PAYMENTS[paymentIndex].paymentDate) {
    updateData.paymentDate = now;
    updateData.receiptUrl = `https://example.com/receipts/${id}`;
  } else if (status === "canceled") {
    updateData.cancelDate = now;
  }
  
  // 결제 정보 업데이트
  const updatedPayment = {
    ...SAMPLE_PAYMENTS[paymentIndex],
    ...updateData
  };
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  SAMPLE_PAYMENTS[paymentIndex] = updatedPayment;
  
  return updatedPayment;
}

// 환불 처리
export async function processRefund(id: string, refundData: RefundFormData): Promise<Payment> {
  await delay(800);
  
  const paymentIndex = SAMPLE_PAYMENTS.findIndex(payment => payment.id === id);
  
  if (paymentIndex === -1) {
    throw new Error(`결제 내역 ID ${id}를 찾을 수 없습니다.`);
  }
  
  const payment = SAMPLE_PAYMENTS[paymentIndex];
  
  // 결제 상태 확인
  if (payment.status !== "paid") {
    throw new Error(`결제가 완료된 상태가 아닙니다. 현재 상태: ${payment.status}`);
  }
  
  // 환불 금액 확인
  if (refundData.amount > payment.amount) {
    throw new Error(`환불 금액(${refundData.amount})이 결제 금액(${payment.amount})보다 클 수 없습니다.`);
  }
  
  // 환불 상태 설정
  const status: PaymentStatus = refundData.amount === payment.amount ? "refunded" : "partial_refunded";
  
  // 결제 정보 업데이트
  const updatedPayment = {
    ...payment,
    status: status,
    refundDate: new Date().toISOString(),
    refundAmount: refundData.amount,
    updatedAt: new Date().toISOString()
  };
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  SAMPLE_PAYMENTS[paymentIndex] = updatedPayment;
  
  return updatedPayment;
}

// ==================== 사진 관리 API 함수 ====================

// 사진 목록 가져오기
export async function getPhotos(params?: {
  search?: string;
  status?: PhotoStatus;
  quality?: PhotoQuality;
  analysisResult?: AnalysisResult;
  institutionId?: string;
  patientId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<{ photos: Photo[]; total: number }> {
  await delay(500);
  
  let filteredPhotos = [...SAMPLE_PHOTOS];
  
  // 검색어 필터링
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredPhotos = filteredPhotos.filter(photo => 
      photo.fileName.toLowerCase().includes(searchLower) ||
      photo.patientCode.toLowerCase().includes(searchLower) ||
      photo.notes?.toLowerCase().includes(searchLower)
    );
  }
  
  // 상태 필터링
  if (params?.status) {
    filteredPhotos = filteredPhotos.filter(photo => photo.status === params.status);
  }
  
  // 품질 필터링
  if (params?.quality) {
    filteredPhotos = filteredPhotos.filter(photo => photo.quality === params.quality);
  }
  
  // 분석 결과 필터링
  if (params?.analysisResult) {
    filteredPhotos = filteredPhotos.filter(photo => photo.analysisResult === params.analysisResult);
  }
  
  // 기관 필터링
  if (params?.institutionId) {
    filteredPhotos = filteredPhotos.filter(photo => photo.institutionId === params.institutionId);
  }
  
  // 환자 필터링
  if (params?.patientId) {
    filteredPhotos = filteredPhotos.filter(photo => photo.patientId === params.patientId);
  }
  
  // 사용자 필터링
  if (params?.userId) {
    filteredPhotos = filteredPhotos.filter(photo => photo.userId === params.userId);
  }
  
  // 촬영 시작일 필터링
  if (params?.startDate) {
    const startDate = new Date(params.startDate);
    filteredPhotos = filteredPhotos.filter(photo => {
      if (!photo.takenAt) return false;
      return new Date(photo.takenAt) >= startDate;
    });
  }
  
  // 촬영 종료일 필터링
  if (params?.endDate) {
    const endDate = new Date(params.endDate);
    endDate.setDate(endDate.getDate() + 1); // 종료일 포함
    filteredPhotos = filteredPhotos.filter(photo => {
      if (!photo.takenAt) return false;
      return new Date(photo.takenAt) < endDate;
    });
  }
  
  // 총 레코드 수
  const total = filteredPhotos.length;
  
  // 페이지네이션
  if (params?.page && params?.limit) {
    const startIndex = (params.page - 1) * params.limit;
    filteredPhotos = filteredPhotos.slice(startIndex, startIndex + params.limit);
  }
  
  return { photos: filteredPhotos, total };
}

// 사진 상세 정보 가져오기
export async function getPhotoById(id: string): Promise<Photo> {
  await delay(300);
  const photo = SAMPLE_PHOTOS.find(photo => photo.id === id);
  
  if (!photo) {
    throw new Error(`사진 ID ${id}를 찾을 수 없습니다.`);
  }
  
  return photo;
}

// 기관별 사진 가져오기
export async function getPhotosByInstitution(institutionId: string): Promise<Photo[]> {
  await delay(300);
  return SAMPLE_PHOTOS.filter(photo => photo.institutionId === institutionId);
}

// 환자별 사진 가져오기
export async function getPhotosByPatient(patientId: string): Promise<Photo[]> {
  await delay(300);
  return SAMPLE_PHOTOS.filter(photo => photo.patientId === patientId);
}

// 사진 업로드 (실제로는 파일 업로드 처리가 포함됨)
export async function uploadPhoto(photoData: PhotoUploadData): Promise<Photo> {
  await delay(1000);
  
  // 기관 정보 가져오기
  const institution = SAMPLE_INSTITUTIONS.find(inst => inst.id === photoData.institutionId);
  
  if (!institution) {
    throw new Error(`기관 ID ${photoData.institutionId}를 찾을 수 없습니다.`);
  }
  
  // 사용자 정보 가져오기
  const user = SAMPLE_USERS.find(user => user.id === photoData.userId);
  
  if (!user) {
    throw new Error(`사용자 ID ${photoData.userId}를 찾을 수 없습니다.`);
  }
  
  // 새 사진 ID 생성 (실제로는 서버에서 생성)
  const photoCount = SAMPLE_PHOTOS.length + 1;
  const newId = `PHT-${new Date().getFullYear()}-${photoCount.toString().padStart(3, '0')}`;
  
  // 파일 이름 추출 (실제 구현에서는 파일 업로드 처리)
  const fileName = photoData.file.name;
  const fileSize = photoData.file.size;
  
  // 현재 연월 폴더 경로 생성
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const filePath = `/uploads/photos/${year}/${month}/${fileName}`;
  const thumbnailPath = `/uploads/photos/${year}/${month}/thumbnails/${fileName.replace(/\.[^/.]+$/, "")}_thumb.jpg`;
  
  const newPhoto: Photo = {
    id: newId,
    patientId: photoData.patientId,
    patientCode: photoData.patientCode,
    institutionId: photoData.institutionId,
    institutionName: institution.name,
    userId: photoData.userId,
    userName: user.name,
    fileName: fileName,
    filePath: filePath,
    thumbnailPath: thumbnailPath,
    fileSize: fileSize,
    imageWidth: 3000, // 예시 값
    imageHeight: 2000, // 예시 값
    takenAt: photoData.takenAt || new Date().toISOString(),
    uploadedAt: new Date().toISOString(),
    status: "pending", // 초기 상태는 pending으로 설정
    quality: "medium", // 초기 품질은 medium으로 임의 설정
    analysisResult: null,
    analysisScore: null,
    analysisDate: null,
    reportId: null,
    notes: photoData.notes || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 샘플 데이터에 추가 (실제로는 DB에 저장)
  SAMPLE_PHOTOS.push(newPhoto);
  
  return newPhoto;
}

// 사진 분석 요청
export async function analyzePhoto(id: string): Promise<Photo> {
  await delay(1500);
  
  const photoIndex = SAMPLE_PHOTOS.findIndex(photo => photo.id === id);
  
  if (photoIndex === -1) {
    throw new Error(`사진 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 현재 사진 상태 확인
  if (SAMPLE_PHOTOS[photoIndex].status !== "pending") {
    throw new Error(`분석 요청은 대기 중인 사진에만 가능합니다. 현재 상태: ${SAMPLE_PHOTOS[photoIndex].status}`);
  }
  
  // 분석 결과 생성 (실제로는 AI 분석 서비스 호출)
  const analysisResults: AnalysisResult[] = ["normal", "abnormal", "indeterminate"];
  const randomIndex = Math.floor(Math.random() * analysisResults.length);
  const result = analysisResults[randomIndex];
  
  // 품질에 따른 점수 범위 설정
  let scoreRange = { min: 0.7, max: 0.95 }; // 기본 범위
  
  if (result === "abnormal") {
    scoreRange = { min: 0.6, max: 0.8 };
  } else if (result === "indeterminate") {
    scoreRange = { min: 0.4, max: 0.6 };
  }
  
  // 0.01 단위로 랜덤 점수 생성
  const score = Math.round((scoreRange.min + Math.random() * (scoreRange.max - scoreRange.min)) * 100) / 100;
  
  // 사진 정보 업데이트
  const updatedPhoto = {
    ...SAMPLE_PHOTOS[photoIndex],
    status: "analyzed" as PhotoStatus,
    quality: (score > 0.8 ? "high" : score > 0.5 ? "medium" : "low") as PhotoQuality,
    analysisResult: result,
    analysisScore: score,
    analysisDate: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  SAMPLE_PHOTOS[photoIndex] = updatedPhoto as Photo;
  
  return updatedPhoto as Photo;
}

// 사진 분석 결과 상세 가져오기
export async function getPhotoAnalysisResult(photoId: string): Promise<PhotoAnalysisResult | null> {
  await delay(500);
  
  const photo = SAMPLE_PHOTOS.find(photo => photo.id === photoId);
  
  if (!photo) {
    throw new Error(`사진 ID ${photoId}를 찾을 수 없습니다.`);
  }
  
  // 분석 결과가 없는 경우
  if (photo.status !== "analyzed" || !photo.analysisResult) {
    return null;
  }
  
  // 분석 결과 생성 (실제로는 DB에서 가져옴)
  const analysisResult: PhotoAnalysisResult = {
    id: `ANL-${photoId.split('-')[2]}`,
    photoId: photoId,
    result: photo.analysisResult,
    score: photo.analysisScore || 0,
    areas: [
      {
        x: 150,
        y: 200,
        width: 100,
        height: 100,
        confidence: 0.92,
        label: "탈모 영역 1"
      },
      {
        x: 450,
        y: 300,
        width: 120,
        height: 120,
        confidence: 0.85,
        label: "탈모 영역 2"
      }
    ],
    metadata: {
      hairDensity: Math.round((photo.analysisScore || 0.5) * 100),
      hairThickness: Math.round(((photo.analysisScore || 0.5) * 0.8) * 100) / 100,
      scalpCondition: photo.analysisResult === "normal" ? "양호" : photo.analysisResult === "abnormal" ? "불량" : "보통"
    },
    processedAt: photo.analysisDate || photo.updatedAt,
    createdAt: photo.analysisDate || photo.updatedAt
  };
  
  return analysisResult;
}

// 사진 상태 변경
export async function updatePhotoStatus(id: string, status: PhotoStatus): Promise<Photo> {
  await delay(500);
  
  const photoIndex = SAMPLE_PHOTOS.findIndex(photo => photo.id === id);
  
  if (photoIndex === -1) {
    throw new Error(`사진 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 상태 변경이 가능한지 확인
  const currentStatus = SAMPLE_PHOTOS[photoIndex].status;
  
  if (currentStatus === status) {
    return SAMPLE_PHOTOS[photoIndex];
  }
  
  // 삭제된 사진은 상태 변경 불가
  if (currentStatus === "deleted") {
    throw new Error(`삭제된 사진의 상태를 변경할 수 없습니다.`);
  }
  
  // 사진 정보 업데이트
  const updatedPhoto = {
    ...SAMPLE_PHOTOS[photoIndex],
    status: status as PhotoStatus,
    updatedAt: new Date().toISOString()
  };
  
  // 분석 실패 상태로 변경 시 분석 결과 초기화
  if (status === "failed") {
    updatedPhoto.analysisResult = null;
    updatedPhoto.analysisScore = null;
    updatedPhoto.analysisDate = new Date().toISOString();
  }
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  SAMPLE_PHOTOS[photoIndex] = updatedPhoto as Photo;
  
  return updatedPhoto as Photo;
}

// 사진 삭제 (실제 파일 삭제가 아닌 상태 변경)
export async function deletePhoto(id: string): Promise<boolean> {
  await delay(500);
  
  const photoIndex = SAMPLE_PHOTOS.findIndex(photo => photo.id === id);
  
  if (photoIndex === -1) {
    throw new Error(`사진 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 사진 상태를 deleted로 변경
  SAMPLE_PHOTOS[photoIndex] = {
    ...SAMPLE_PHOTOS[photoIndex],
    status: "deleted",
    updatedAt: new Date().toISOString()
  };
  
  // 리포트에서 사진 제거 (실제로는 별도 API 호출 또는 트랜잭션)
  const reportId = SAMPLE_PHOTOS[photoIndex].reportId;
  if (reportId) {
    const reportIndex = SAMPLE_REPORTS.findIndex(report => report.id === reportId);
    if (reportIndex !== -1) {
      // 리포트에서 해당 사진 ID 제거
      const photoIds = SAMPLE_REPORTS[reportIndex].photoIds.filter(photoId => photoId !== id);
      SAMPLE_REPORTS[reportIndex] = {
        ...SAMPLE_REPORTS[reportIndex],
        photoIds: photoIds,
        photoCount: photoIds.length,
        updatedAt: new Date().toISOString()
      };
    }
  }
  
  return true;
}

// 사진 메모 업데이트
export async function updatePhotoNotes(id: string, notes: string | null): Promise<Photo> {
  await delay(300);
  
  const photoIndex = SAMPLE_PHOTOS.findIndex(photo => photo.id === id);
  
  if (photoIndex === -1) {
    throw new Error(`사진 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 사진 메모 업데이트
  const updatedPhoto = {
    ...SAMPLE_PHOTOS[photoIndex],
    notes: notes,
    updatedAt: new Date().toISOString()
  };
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  SAMPLE_PHOTOS[photoIndex] = updatedPhoto as Photo;
  
  return updatedPhoto as Photo;
}

// ==================== 리포트 관리 API 함수 ====================

// 리포트 목록 가져오기
export async function getReports(params?: {
  search?: string;
  status?: ReportStatus;
  institutionId?: string;
  patientId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<{ reports: Report[]; total: number }> {
  await delay(500);
  
  let filteredReports = [...SAMPLE_REPORTS];
  
  // 검색어 필터링
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredReports = filteredReports.filter(report => 
      report.title.toLowerCase().includes(searchLower) ||
      report.patientCode.toLowerCase().includes(searchLower) ||
      report.patientName?.toLowerCase().includes(searchLower) ||
      report.description?.toLowerCase().includes(searchLower)
    );
  }
  
  // 상태 필터링
  if (params?.status) {
    filteredReports = filteredReports.filter(report => report.status === params.status);
  }
  
  // 기관 필터링
  if (params?.institutionId) {
    filteredReports = filteredReports.filter(report => report.institutionId === params.institutionId);
  }
  
  // 환자 필터링
  if (params?.patientId) {
    filteredReports = filteredReports.filter(report => report.patientId === params.patientId);
  }
  
  // 사용자 필터링
  if (params?.userId) {
    filteredReports = filteredReports.filter(report => report.userId === params.userId);
  }
  
  // 시작일 필터링
  if (params?.startDate) {
    const startDate = new Date(params.startDate);
    filteredReports = filteredReports.filter(report => new Date(report.createdAt) >= startDate);
  }
  
  // 종료일 필터링
  if (params?.endDate) {
    const endDate = new Date(params.endDate);
    endDate.setDate(endDate.getDate() + 1); // 종료일 포함
    filteredReports = filteredReports.filter(report => new Date(report.createdAt) < endDate);
  }
  
  // 총 레코드 수
  const total = filteredReports.length;
  
  // 페이지네이션
  if (params?.page && params?.limit) {
    const startIndex = (params.page - 1) * params.limit;
    filteredReports = filteredReports.slice(startIndex, startIndex + params.limit);
  }
  
  return { reports: filteredReports, total };
}

// 리포트 상세 정보 가져오기
export async function getReportById(id: string): Promise<Report> {
  await delay(300);
  const report = SAMPLE_REPORTS.find(report => report.id === id);
  
  if (!report) {
    throw new Error(`리포트 ID ${id}를 찾을 수 없습니다.`);
  }
  
  return report;
}

// 리포트에 포함된 사진 목록 가져오기
export async function getReportPhotos(reportId: string): Promise<Photo[]> {
  await delay(300);
  
  const report = SAMPLE_REPORTS.find(report => report.id === reportId);
  
  if (!report) {
    throw new Error(`리포트 ID ${reportId}를 찾을 수 없습니다.`);
  }
  
  return SAMPLE_PHOTOS.filter(photo => report.photoIds.includes(photo.id));
}

// 리포트 생성
export async function createReport(reportData: ReportFormData): Promise<Report> {
  await delay(800);
  
  // 기관 정보 가져오기
  const institution = SAMPLE_INSTITUTIONS.find(inst => inst.id === reportData.institutionId);
  
  if (!institution) {
    throw new Error(`기관 ID ${reportData.institutionId}를 찾을 수 없습니다.`);
  }
  
  // 사용자 정보 가져오기
  const user = SAMPLE_USERS.find(user => user.id === reportData.userId);
  
  if (!user) {
    throw new Error(`사용자 ID ${reportData.userId}를 찾을 수 없습니다.`);
  }
  
  // 사진 ID 확인
  const validPhotoIds = reportData.photoIds.filter(photoId => 
    SAMPLE_PHOTOS.some(photo => photo.id === photoId && photo.status === "analyzed")
  );
  
  if (validPhotoIds.length === 0) {
    throw new Error(`분석 완료된 사진이 하나 이상 필요합니다.`);
  }
  
  // 새 리포트 ID 생성 (실제로는 서버에서 생성)
  const reportCount = SAMPLE_REPORTS.length + 1;
  const newId = `RPT-${new Date().getFullYear()}-${reportCount.toString().padStart(3, '0')}`;
  
  const now = new Date().toISOString();
  
  const newReport: Report = {
    id: newId,
    patientId: reportData.patientId,
    patientCode: reportData.patientCode,
    patientName: reportData.patientName || null,
    institutionId: reportData.institutionId,
    institutionName: institution.name,
    userId: reportData.userId,
    userName: user.name,
    title: reportData.title,
    description: reportData.description || null,
    status: reportData.status || "draft",
    photoIds: validPhotoIds,
    photoCount: validPhotoIds.length,
    createdAt: now,
    updatedAt: now,
    completedAt: reportData.status === "completed" ? now : null
  };
  
  // 샘플 데이터에 추가 (실제로는 DB에 저장)
  SAMPLE_REPORTS.push(newReport);
  
  // 사진의 reportId 업데이트 (실제로는 별도 API 호출 또는 트랜잭션)
  for (const photoId of validPhotoIds) {
    const photoIndex = SAMPLE_PHOTOS.findIndex(photo => photo.id === photoId);
    if (photoIndex !== -1) {
      SAMPLE_PHOTOS[photoIndex] = {
        ...SAMPLE_PHOTOS[photoIndex],
        reportId: newId,
        updatedAt: now
      };
    }
  }
  
  return newReport;
}

// 리포트 수정
export async function updateReport(id: string, reportData: Partial<ReportFormData>): Promise<Report> {
  await delay(800);
  
  const reportIndex = SAMPLE_REPORTS.findIndex(report => report.id === id);
  
  if (reportIndex === -1) {
    throw new Error(`리포트 ID ${id}를 찾을 수 없습니다.`);
  }
  
  const now = new Date().toISOString();
  const currentReport = SAMPLE_REPORTS[reportIndex];
  let updatedReport = { ...currentReport, updatedAt: now };
  
  // 기본 필드 업데이트
  if (reportData.title) updatedReport.title = reportData.title;
  if (reportData.description !== undefined) updatedReport.description = reportData.description;
  if (reportData.patientName !== undefined) updatedReport.patientName = reportData.patientName;
  
  // 상태 업데이트
  if (reportData.status && reportData.status !== currentReport.status) {
    updatedReport.status = reportData.status;
    
    // 완료 상태로 변경 시 completedAt 설정
    if (reportData.status === "completed" && !currentReport.completedAt) {
      updatedReport.completedAt = now;
    }
  }
  
  // 사진 ID 업데이트
  if (reportData.photoIds) {
    // 이전 사진 연결 해제
    for (const photoId of currentReport.photoIds) {
      if (!reportData.photoIds.includes(photoId)) {
        const photoIndex = SAMPLE_PHOTOS.findIndex(photo => photo.id === photoId);
        if (photoIndex !== -1) {
          SAMPLE_PHOTOS[photoIndex] = {
            ...SAMPLE_PHOTOS[photoIndex],
            reportId: null,
            updatedAt: now
          };
        }
      }
    }
    
    // 새 사진 연결
    for (const photoId of reportData.photoIds) {
      if (!currentReport.photoIds.includes(photoId)) {
        const photoIndex = SAMPLE_PHOTOS.findIndex(photo => photo.id === photoId);
        if (photoIndex !== -1) {
          SAMPLE_PHOTOS[photoIndex] = {
            ...SAMPLE_PHOTOS[photoIndex],
            reportId: id,
            updatedAt: now
          };
        }
      }
    }
    
    updatedReport.photoIds = reportData.photoIds;
    updatedReport.photoCount = reportData.photoIds.length;
  }
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  SAMPLE_REPORTS[reportIndex] = updatedReport;
  
  return updatedReport;
}

// 리포트 상태 변경
export async function updateReportStatus(id: string, status: ReportStatus): Promise<Report> {
  await delay(300);
  
  const reportIndex = SAMPLE_REPORTS.findIndex(report => report.id === id);
  
  if (reportIndex === -1) {
    throw new Error(`리포트 ID ${id}를 찾을 수 없습니다.`);
  }
  
  const now = new Date().toISOString();
  const updatedReport = {
    ...SAMPLE_REPORTS[reportIndex],
    status: status,
    updatedAt: now,
    // 완료 상태로 변경 시 completedAt 설정
    completedAt: status === "completed" ? now : SAMPLE_REPORTS[reportIndex].completedAt
  };
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  SAMPLE_REPORTS[reportIndex] = updatedReport;
  
  return updatedReport;
}

// 리포트 삭제 (아카이브로 변경)
export async function deleteReport(id: string): Promise<boolean> {
  await delay(500);
  
  const reportIndex = SAMPLE_REPORTS.findIndex(report => report.id === id);
  
  if (reportIndex === -1) {
    throw new Error(`리포트 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 리포트 상태를 archived로 변경
  SAMPLE_REPORTS[reportIndex] = {
    ...SAMPLE_REPORTS[reportIndex],
    status: "archived",
    updatedAt: new Date().toISOString()
  };
  
  // 연결된 사진의 reportId 제거 (실제로는 별도 API 호출 또는 트랜잭션)
  const photoIds = SAMPLE_REPORTS[reportIndex].photoIds;
  for (const photoId of photoIds) {
    const photoIndex = SAMPLE_PHOTOS.findIndex(photo => photo.id === photoId);
    if (photoIndex !== -1) {
      SAMPLE_PHOTOS[photoIndex] = {
        ...SAMPLE_PHOTOS[photoIndex],
        reportId: null,
        updatedAt: new Date().toISOString()
      };
    }
  }
  
  return true;
}

// ==================== 공지사항 관리 API 함수 ====================

// 샘플 공지사항 데이터
// Notice 타입과 호환되도록 타입 정의 추가
const SAMPLE_NOTICES: Array<Notice & { startDate: string | null }> = [
  {
    id: "NOTICE-2025-001",
    title: "시스템 정기 점검 안내",
    content: "안녕하세요. 안드로겐 탈모진단 AI의료기기 통합관리자 시스템을 이용해 주셔서 감사합니다.\n\n시스템 안정화를 위한 정기 점검이 진행될 예정입니다.\n\n▶ 점검 일시: 2025년 5월 15일(목) 오전 2시 ~ 오전 5시\n▶ 점검 내용: 서버 안정화 및 성능 개선\n\n점검 시간 동안에는 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.\n\n감사합니다.",
    status: "active",
    isPinned: true,
    startDate: "2025-05-10T00:00:00Z",
    endDate: "2025-05-20T23:59:59Z",
    target: "all",
    targetIds: [],
    viewCount: 245,
    attachments: [],
    createdAt: "2025-05-08T10:30:00Z",
    updatedAt: "2025-05-08T10:30:00Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "NOTICE-2025-002",
    title: "v2.5.0 업데이트 안내",
    content: "안녕하세요. 안드로겐 탈모진단 AI의료기기 통합관리자입니다.\n\n시스템이 v2.5.0으로 업데이트되었습니다.\n\n▶ 업데이트 내용\n1. AI 분석 엔진 성능 개선\n2. 리포트 생성 속도 향상\n3. 사용자 인터페이스 개선\n4. 버그 수정 및 안정성 향상\n\n자세한 내용은 첨부파일을 참고해 주세요.\n\n감사합니다.",
    status: "active",
    isPinned: true,
    startDate: "2025-04-25T00:00:00Z",
    endDate: null,
    target: "all",
    targetIds: [],
    viewCount: 187,
    attachments: [
      {
        id: "ATT-2025-001",
        fileName: "v2.5.0_release_notes.pdf",
        fileSize: 1250000,
        fileUrl: "/uploads/attachments/v2.5.0_release_notes.pdf"
      }
    ],
    createdAt: "2025-04-25T09:15:00Z",
    updatedAt: "2025-04-25T09:15:00Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "NOTICE-2025-003",
    title: "서울대학교병원 기관 점검 안내",
    content: "안녕하세요. 안드로겐 탈모진단 AI의료기기 통합관리자입니다.\n\n서울대학교병원 기관의 시스템 점검이 예정되어 있습니다.\n\n▶ 점검 일시: 2025년 5월 12일(월) 오후 2시 ~ 오후 4시\n▶ 점검 내용: 데이터베이스 최적화 및 성능 개선\n\n점검 시간 동안에는 해당 기관의 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.\n\n감사합니다.",
    status: "active",
    isPinned: false,
    startDate: "2025-05-05T00:00:00Z",
    endDate: "2025-05-15T23:59:59Z",
    target: "institution",
    targetIds: ["1"],
    viewCount: 42,
    attachments: [],
    createdAt: "2025-05-05T14:20:00Z",
    updatedAt: "2025-05-05T14:20:00Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "NOTICE-2025-004",
    title: "개인정보처리방침 개정 안내",
    content: "안녕하세요. 안드로겐 탈모진단 AI의료기기 통합관리자입니다.\n\n개인정보처리방침이 개정되어 안내드립니다.\n\n▶ 시행일: 2025년 6월 1일\n▶ 주요 개정 내용\n1. 개인정보 보유 기간 변경\n2. 개인정보 처리 위탁 업체 변경\n3. 개인정보 보호책임자 변경\n\n자세한 내용은 첨부파일을 참고해 주세요.\n\n감사합니다.",
    status: "scheduled",
    isPinned: false,
    startDate: "2025-05-20T00:00:00Z",
    endDate: "2025-06-30T23:59:59Z",
    target: "all",
    targetIds: [],
    viewCount: 0,
    attachments: [
      {
        id: "ATT-2025-002",
        fileName: "privacy_policy_v3.pdf",
        fileSize: 1850000,
        fileUrl: "/uploads/attachments/privacy_policy_v3.pdf"
      }
    ],
    createdAt: "2025-05-10T16:40:00Z",
    updatedAt: "2025-05-10T16:40:00Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "NOTICE-2025-005",
    title: "Mobile앱 점검 안내",
    content: "안녕하세요. 안드로겐 탈모진단 AI의료기기 통합관리자입니다.\n\nMobile앱 업데이트를 위한 점검이 진행될 예정입니다.\n\n▶ 점검 일시: 2025년 5월 18일(일) 오전 1시 ~ 오전 3시\n▶ 점검 내용: Mobile앱 서버 업데이트 및 성능 개선\n\n점검 시간 동안에는 Mobile앱 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.\n\n감사합니다.",
    status: "draft",
    isPinned: false,
    startDate: null,
    endDate: null,
    target: "all",
    targetIds: [],
    viewCount: 0,
    attachments: [],
    createdAt: "2025-05-11T11:25:00Z",
    updatedAt: "2025-05-11T11:25:00Z",
    createdBy: "admin",
    updatedBy: "admin"
  }
];

// 공지사항 목록 가져오기
export async function getNotices(params?: {
  search?: string;
  status?: string;
  isPinned?: boolean;
  target?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<{ notices: Notice[]; total: number }> {
  await delay(500);
  
  let filteredNotices = [...SAMPLE_NOTICES] as Notice[];
  
  // 검색어 필터링
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredNotices = filteredNotices.filter(notice => 
      notice.title.toLowerCase().includes(searchLower) ||
      notice.content.toLowerCase().includes(searchLower)
    );
  }
  
  // 상태 필터링
  if (params?.status) {
    filteredNotices = filteredNotices.filter(notice => notice.status === params.status);
  }
  
  // 상단 고정 필터링
  if (params?.isPinned !== undefined) {
    filteredNotices = filteredNotices.filter(notice => notice.isPinned === params.isPinned);
  }
  
  // 대상 필터링
  if (params?.target) {
    filteredNotices = filteredNotices.filter(notice => notice.target === params.target);
  }
  
  // 시작일 필터링
  if (params?.startDate) {
    const startDate = new Date(params.startDate);
    filteredNotices = filteredNotices.filter(notice => new Date(notice.createdAt) >= startDate);
  }
  
  // 종료일 필터링
  if (params?.endDate) {
    const endDate = new Date(params.endDate);
    endDate.setDate(endDate.getDate() + 1); // 종료일 포함
    filteredNotices = filteredNotices.filter(notice => new Date(notice.createdAt) < endDate);
  }
  
  // 총 레코드 수
  const total = filteredNotices.length;
  
  // 페이지네이션
  if (params?.page && params?.limit) {
    const startIndex = (params.page - 1) * params.limit;
    filteredNotices = filteredNotices.slice(startIndex, startIndex + params.limit);
  }
  
  return { notices: filteredNotices, total };
}

// 공지사항 상세 정보 가져오기
export async function getNoticeById(id: string): Promise<Notice> {
  await delay(300);
  const notice = SAMPLE_NOTICES.find(notice => notice.id === id);
  
  if (!notice) {
    throw new Error(`공지사항 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 조회수 증가 (실제로는 별도 API 호출)
  const noticeIndex = SAMPLE_NOTICES.findIndex(n => n.id === id);
  if (noticeIndex !== -1) {
    SAMPLE_NOTICES[noticeIndex] = {
      ...SAMPLE_NOTICES[noticeIndex],
      viewCount: SAMPLE_NOTICES[noticeIndex].viewCount + 1,
      updatedAt: new Date().toISOString()
    };
  }
  
  return notice as Notice;
}

// 공지사항 생성
export async function createNotice(noticeData: NoticeFormData): Promise<Notice> {
  await delay(800);
  
  // 새 공지사항 ID 생성
  const noticeCount = SAMPLE_NOTICES.length + 1;
  const newId = `NOTICE-${new Date().getFullYear()}-${noticeCount.toString().padStart(3, '0')}`;
  
  // 첨부파일 처리 (실제로는 파일 업로드 처리 후 URL 반환)
  const attachments = noticeData.attachments ? noticeData.attachments.map((file, index) => ({
    id: `ATT-${new Date().getFullYear()}-${(noticeCount + index).toString().padStart(3, '0')}`,
    fileName: file.name,
    fileSize: file.size,
    fileUrl: `/uploads/attachments/${file.name}`
  })) : [];
  
  const now = new Date().toISOString();
  
  const newNotice: Notice = {
    id: newId,
    title: noticeData.title,
    content: noticeData.content,
    status: noticeData.status,
    isPinned: noticeData.isPinned,
    startDate: noticeData.startDate || null,
    endDate: noticeData.endDate || null,
    target: noticeData.target,
    targetIds: noticeData.targetIds || [],
    viewCount: 0,
    attachments,
    createdAt: now,
    updatedAt: now,
    createdBy: "admin", // 실제로는 로그인 사용자 정보
    updatedBy: "admin"
  };
  
  // 샘플 데이터에 추가 (실제로는 DB에 저장)
  // 여기서 타입 캐스팅을 통해 SAMPLE_NOTICES 배열에 맞는 타입으로 변환
  SAMPLE_NOTICES.push(newNotice as any);
  
  return newNotice;
}

// 공지사항 수정
export async function updateNotice(id: string, noticeData: Partial<NoticeFormData>): Promise<Notice> {
  await delay(800);
  
  const noticeIndex = SAMPLE_NOTICES.findIndex(notice => notice.id === id);
  
  if (noticeIndex === -1) {
    throw new Error(`공지사항 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 첨부파일 처리 (실제로는 파일 업로드 처리 후 URL 반환)
  const existingAttachments = SAMPLE_NOTICES[noticeIndex].attachments || [];
  const newAttachments = noticeData.attachments ? noticeData.attachments.map((file, index) => ({
    id: `ATT-${new Date().getFullYear()}-${(SAMPLE_NOTICES.length + index).toString().padStart(3, '0')}`,
    fileName: file.name,
    fileSize: file.size,
    fileUrl: `/uploads/attachments/${file.name}`
  })) : [];
  
  // 기존 공지사항과 새 데이터 병합
  const updatedNotice = {
    ...SAMPLE_NOTICES[noticeIndex],
    ...noticeData,
    attachments: [...existingAttachments, ...newAttachments],
    updatedAt: new Date().toISOString(),
    updatedBy: "admin" // 실제로는 로그인 사용자 정보
  };
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  SAMPLE_NOTICES[noticeIndex] = updatedNotice as any;
  
  return updatedNotice as Notice;
}

// 공지사항 상태 변경
export async function updateNoticeStatus(id: string, status: NoticeStatus): Promise<Notice> {
  return updateNotice(id, { status });
}

// 공지사항 삭제
export async function deleteNotice(id: string): Promise<boolean> {
  await delay(500);
  
  const noticeIndex = SAMPLE_NOTICES.findIndex(notice => notice.id === id);
  
  if (noticeIndex === -1) {
    throw new Error(`공지사항 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 샘플 데이터에서 삭제 (실제로는 DB에서 삭제 또는 상태 변경)
  SAMPLE_NOTICES.splice(noticeIndex, 1);
  
  return true;
}

// ==================== FAQ 관리 API 함수 ====================

// 샘플 FAQ 데이터
// Faq 타입과 호환되도록 타입 정의 추가
const SAMPLE_FAQS: Array<Faq & { attachments: { id: string; fileName: string; fileSize: number; fileUrl: string; }[] }> = [
  {
    id: "FAQ-2025-001",
    question: "과거 진단 기록을 확인할 수 있나요?",
    answer: "레몬 AI medical에서 진단받으신 기록은 모두 보관하고 있습니다. 단, 개인정보보호정책으로 3년간 보관하게 되어 있으며, 3년 후에는 모두 파기하고 있습니다. 참고 하여 주시기 바랍니다.",
    category: "general",
    orderNum: 10,
    status: "active",
    viewCount: 248,
    attachments: [],
    createdAt: "2024-01-01T09:35:25Z",
    updatedAt: "2024-01-01T09:35:25Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "FAQ-2025-002",
    question: "서비스 이용요금은 어떻게 되나요?",
    answer: "레몬 AI medical 서비스 이용요금은 의료기관 규모와 선택하신 라이선스 유형에 따라 달라집니다. 기본 패키지는 월 15만원부터 시작하며, 프리미엄 패키지는 월 45만원입니다. 자세한 가격 정보는 고객센터로 문의해 주시기 바랍니다.",
    category: "payment",
    orderNum: 20,
    status: "active",
    viewCount: 205,
    attachments: [],
    createdAt: "2024-01-15T14:20:30Z",
    updatedAt: "2024-01-15T14:20:30Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "FAQ-2025-003",
    question: "안드로겐 탈모란 무엇인가요?",
    answer: "안드로겐 탈모증(AGA, Androgenetic Alopecia)은 가장 흔한 탈모 유형으로, 유전적 요인과 호르몬(안드로겐) 영향으로 발생합니다. 남성은 M자 탈모나 정수리 탈모로 나타나며, 여성은 주로 정수리 부분이 전체적으로 가늘어지는 형태로 나타납니다. 레몬 AI medical은 최신 AI 기술을 활용하여 초기 단계에서 안드로겐 탈모를 진단하고 적절한 치료를 제안합니다.",
    category: "service",
    orderNum: 30,
    status: "active",
    viewCount: 187,
    attachments: [],
    createdAt: "2024-01-20T10:45:15Z",
    updatedAt: "2024-01-20T10:45:15Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "FAQ-2025-004",
    question: "진단 정확도는 어느 정도인가요?",
    answer: "레몬 AI medical의 안드로겐 탈모 진단 정확도는 임상 연구 결과 약 92%로 확인되었습니다. 이는 국내 탈모 전문의 평균 진단 정확도인 89%보다 높은 수준입니다. 다만, AI 진단은 전문의의 종합적인 판단을 완전히 대체할 수 없으므로, 최종 진단 및 치료 결정은 반드시 전문의와 상담하시기 바랍니다.",
    category: "technical",
    orderNum: 40,
    status: "active",
    viewCount: 156,
    attachments: [],
    createdAt: "2024-02-05T16:30:00Z",
    updatedAt: "2024-02-05T16:30:00Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "FAQ-2025-005",
    question: "계정 정보를 수정하고 싶어요.",
    answer: "계정 정보 수정은 '설정' > '계정 관리' 메뉴에서 가능합니다. 단, 이메일 주소 및 사업자등록번호 등 일부 정보는 보안상의 이유로 고객센터를 통해서만 변경 가능합니다. 변경이 필요한 경우 1588-1234로 연락주시기 바랍니다.",
    category: "account",
    orderNum: 50,
    status: "active",
    viewCount: 132,
    attachments: [],
    createdAt: "2024-02-10T09:15:45Z",
    updatedAt: "2024-02-10T09:15:45Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "FAQ-2025-006",
    question: "탈모 진단을 위한 최적의 사진은 어떻게 촬영하나요?",
    answer: "최적의 진단을 위해서는 다음 사항을 준수해 주세요:\n\n1. 밝은 조명 환경에서 촬영\n2. 머리를 깨끗하게 감은 상태에서 촬영\n3. 정수리, 앞머리, 옆머리 등 최소 3장 이상의 사진 촬영\n4. 초점이 명확하고 흔들림 없이 촬영\n5. 모발이 젖은 상태보다 마른 상태로 촬영\n\n촬영 가이드 영상은 Mobile앱 '도움말' 메뉴에서 확인하실 수 있습니다.",
    category: "service",
    orderNum: 60,
    status: "active",
    viewCount: 205,
    attachments: [
      {
        id: "ATT-FAQ-2025-001",
        fileName: "photo_guide.pdf",
        fileSize: 2450000,
        fileUrl: "/uploads/faqs/photo_guide.pdf"
      }
    ],
    createdAt: "2024-03-05T13:25:10Z",
    updatedAt: "2024-03-05T13:25:10Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "FAQ-2025-007",
    question: "결제 내역을 확인하고 싶어요.",
    answer: "결제 내역은 '설정' > '결제 관리' 메뉴에서 확인 가능합니다. 최근 12개월 동안의 모든 결제 내역과 상세 정보를 확인하실 수 있으며, 세금계산서 및 영수증 발급도 가능합니다. 그 이전 결제 내역이 필요하신 경우 고객센터로 문의해 주세요.",
    category: "payment",
    orderNum: 70,
    status: "active",
    viewCount: 98,
    attachments: [],
    createdAt: "2024-03-15T11:40:30Z",
    updatedAt: "2024-03-15T11:40:30Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "FAQ-2025-008",
    question: "비밀번호를 잊어버렸어요.",
    answer: "비밀번호를 분실하셨을 경우, 로그인 화면에서 '비밀번호 찾기'를 선택해 주세요. 가입 시 등록한 이메일로 인증 링크가 발송됩니다. 링크를 통해 새 비밀번호를 설정하실 수 있습니다. 이메일에 접근할 수 없는 경우 고객센터(1588-1234)로 연락주시기 바랍니다.",
    category: "account",
    orderNum: 80,
    status: "active",
    viewCount: 142,
    attachments: [],
    createdAt: "2024-03-20T08:55:20Z",
    updatedAt: "2024-03-20T08:55:20Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "FAQ-2025-009",
    question: "Mobile앱에서 오류가 발생했어요.",
    answer: "Mobile앱 오류 발생 시 다음 조치를 취해 보세요:\n\n1. 앱 최신 버전으로 업데이트\n2. 기기 재부팅 후 앱 재실행\n3. 앱 데이터 및 캐시 삭제 후 재로그인\n\n위 방법으로 해결되지 않는 경우, 오류 화면을 캡처하여 '문의하기'를 통해 고객센터로 전송해 주세요. 버전 정보, 기기 모델명도 함께 전달해 주시면 빠른 해결에 도움이 됩니다.",
    category: "technical",
    orderNum: 90,
    status: "active",
    viewCount: 120,
    attachments: [],
    createdAt: "2024-04-05T14:10:45Z",
    updatedAt: "2024-04-05T14:10:45Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "FAQ-2025-010",
    question: "여러 기기에서 동시에 접속할 수 있나요?",
    answer: "라이선스 유형에 따라 동시 접속 가능 기기 수가 다릅니다:\n\n- 스탠다드: 최대 2대 기기 동시 접속\n- 프리미엄: 최대 5대 기기 동시 접속\n- 엔터프라이즈: 협의에 따라 설정\n\n기기 제한을 초과하면 가장 오래된 세션이 자동으로 로그아웃됩니다. 계정 보안을 위해 사용하지 않는 기기에서는 로그아웃해 주시기 바랍니다.",
    category: "account",
    orderNum: 100,
    status: "draft",
    viewCount: 0,
    attachments: [],
    createdAt: "2024-04-10T09:30:15Z",
    updatedAt: "2024-04-10T09:30:15Z",
    createdBy: "admin",
    updatedBy: "admin"
  }
];

// FAQ 목록 가져오기
export async function getFaqs(params?: {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ faqs: Faq[]; total: number }> {
  await delay(500);
  
  let filteredFaqs = [...SAMPLE_FAQS] as Faq[];
  
  // 검색어 필터링
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredFaqs = filteredFaqs.filter(faq => 
      faq.question.toLowerCase().includes(searchLower) ||
      faq.answer.toLowerCase().includes(searchLower)
    );
  }
  
  // 카테고리 필터링
  if (params?.category && params.category !== "all") {
    filteredFaqs = filteredFaqs.filter(faq => faq.category === params.category);
  }
  
  // 상태 필터링
  if (params?.status && params.status !== "all") {
    filteredFaqs = filteredFaqs.filter(faq => faq.status === params.status);
  }
  
  // 정렬: 순서번호 기준 오름차순
  filteredFaqs.sort((a, b) => a.orderNum - b.orderNum);
  
  // 총 레코드 수
  const total = filteredFaqs.length;
  
  // 페이지네이션
  if (params?.page && params?.limit) {
    const startIndex = (params.page - 1) * params.limit;
    filteredFaqs = filteredFaqs.slice(startIndex, startIndex + params.limit);
  }
  
  return { faqs: filteredFaqs, total };
}

// FAQ 상세 정보 가져오기
export async function getFaqById(id: string): Promise<Faq> {
  await delay(300);
  const faq = SAMPLE_FAQS.find(faq => faq.id === id);
  
  if (!faq) {
    throw new Error(`FAQ ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 조회수 증가 (실제로는 별도 API 호출)
  const faqIndex = SAMPLE_FAQS.findIndex(f => f.id === id);
  if (faqIndex !== -1) {
    SAMPLE_FAQS[faqIndex] = {
      ...SAMPLE_FAQS[faqIndex],
      viewCount: SAMPLE_FAQS[faqIndex].viewCount + 1,
      updatedAt: new Date().toISOString()
    };
  }
  
  return faq as Faq;
}

// FAQ 생성
export async function createFaq(faqData: FaqFormData): Promise<Faq> {
  await delay(800);
  
  // 새 FAQ ID 생성
  const faqCount = SAMPLE_FAQS.length + 1;
  const newId = `FAQ-${new Date().getFullYear()}-${faqCount.toString().padStart(3, '0')}`;
  
  // 첨부파일 처리 (실제로는 파일 업로드 처리 후 URL 반환)
  const attachments = faqData.attachments ? faqData.attachments.map((file, index) => ({
    id: `ATT-FAQ-${new Date().getFullYear()}-${(faqCount + index).toString().padStart(3, '0')}`,
    fileName: file.name,
    fileSize: file.size,
    fileUrl: `/uploads/faqs/${file.name}`
  })) : [];
  
  const now = new Date().toISOString();
  
  const newFaq: Faq = {
    id: newId,
    question: faqData.question,
    answer: faqData.answer,
    category: faqData.category,
    orderNum: faqData.orderNum,
    status: faqData.status,
    viewCount: 0,
    attachments,
    createdAt: now,
    updatedAt: now,
    createdBy: "admin", // 실제로는 로그인 사용자 정보
    updatedBy: "admin"
  };
  
  // 샘플 데이터에 추가 (실제로는 DB에 저장)
  // 타입 캐스팅을 통해 타입 불일치 문제 해결
  SAMPLE_FAQS.push(newFaq as any);
  
  return newFaq;
}

// FAQ 수정
export async function updateFaq(id: string, faqData: Partial<FaqFormData>): Promise<Faq> {
  await delay(800);
  
  const faqIndex = SAMPLE_FAQS.findIndex(faq => faq.id === id);
  
  if (faqIndex === -1) {
    throw new Error(`FAQ ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 첨부파일 처리 (실제로는 파일 업로드 처리 후 URL 반환)
  const existingAttachments = SAMPLE_FAQS[faqIndex].attachments || [];
  const newAttachments = faqData.attachments ? faqData.attachments.map((file, index) => ({
    id: `ATT-FAQ-${new Date().getFullYear()}-${(SAMPLE_FAQS.length + index).toString().padStart(3, '0')}`,
    fileName: file.name,
    fileSize: file.size,
    fileUrl: `/uploads/faqs/${file.name}`
  })) : [];
  
  // 기존 FAQ와 새 데이터 병합
  const updatedFaq = {
    ...SAMPLE_FAQS[faqIndex],
    ...faqData,
    attachments: [...existingAttachments, ...newAttachments],
    updatedAt: new Date().toISOString(),
    updatedBy: "admin" // 실제로는 로그인 사용자 정보
  };
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  // 타입 캐스팅을 통해 타입 불일치 문제 해결
  SAMPLE_FAQS[faqIndex] = updatedFaq as any;
  
  return updatedFaq as Faq;
}

// FAQ 상태 변경
export async function updateFaqStatus(id: string, status: FaqStatus): Promise<Faq> {
  return updateFaq(id, { status });
}

// FAQ 삭제
export async function deleteFaq(id: string): Promise<boolean> {
  await delay(500);
  
  const faqIndex = SAMPLE_FAQS.findIndex(faq => faq.id === id);
  
  if (faqIndex === -1) {
    throw new Error(`FAQ ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 샘플 데이터에서 삭제 (실제로는 DB에서 삭제 또는 상태 변경)
  SAMPLE_FAQS.splice(faqIndex, 1);
  
  return true;
}
