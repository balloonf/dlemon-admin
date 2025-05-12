import { Institution } from "@/types/institution";

// This is a mock service. In a real application, this would use API calls.
// Mock data for institutions
const mockInstitutions: Institution[] = [
  {
    id: 1,
    name: "서울대학교병원",
    nameEn: "SNU Dermatology Clinic",
    category: "대학병원",
    representative: "김병석",
    representativePosition: "원장",
    businessNumber: "123-45-67890",
    businessCertificate: "business_certificate_1.pdf",
    medicalLicense: "medical_license_1.pdf",
    address: "서울특별시 종로구 대학로 101",
    addressDetail: "정명빌딩 7층",
    addressEn: "7th floor, Jeongmyeong Building, 42 Achasan-ro, Seongdong-gu, Seoul",
    zipCode: "04799",
    contactInfo: "02-2072-2114",
    email: "contact@snuderma.com",
    website: "https://www.snuderma.com",
    registrationDate: "2024-03-15",
    status: "approved",
    licenseStatus: "active",
    licenseType: "정식 라이선스",
    licenseExpiry: "2025-03-14",
    trialExpiry: null,
    usersCount: {
      current: 12,
      limit: 15
    },
    adminId: "admin123",
    adminName: "이관리",
    adminEmail: "admin@snuderma.com",
    adminPhone: "010-1234-5678",
    paymentHistory: 8,
    photoCount: 156,
    reportCount: 143,
    mobileUsers: 10
  },
  {
    id: 2,
    name: "연세대학교 세브란스병원",
    category: "대학병원",
    representative: "이원장",
    contactInfo: "02-2228-0000",
    address: "서울특별시 서대문구 연세로 50-1",
    businessNumber: "234-56-78901",
    businessCertificate: "business_certificate_2.pdf",
    registrationDate: "2024-03-20",
    status: "approved",
    licenseStatus: "trial",
    licenseType: "무료체험",
    licenseExpiry: "2024-06-19",
    usersCount: {
      current: 8,
      limit: 10
    },
    paymentHistory: 0,
    photoCount: 45,
    reportCount: 32,
    mobileUsers: 15
  },
  {
    id: 3,
    name: "강남성형외과의원",
    category: "병의원",
    representative: "박미영",
    contactInfo: "02-555-1234",
    address: "서울특별시 강남구 테헤란로 152",
    businessNumber: "345-67-89012",
    businessCertificate: "business_certificate_3.pdf",
    registrationDate: "2024-04-05",
    status: "pending",
    licenseStatus: "none",
    licenseType: "-",
    licenseExpiry: "-",
    usersCount: {
      current: 0,
      limit: 0
    },
    paymentHistory: 0,
    photoCount: 0,
    reportCount: 0,
    mobileUsers: 0
  },
  {
    id: 4,
    name: "일산헤어클리닉",
    category: "헤어샵",
    representative: "최헤어",
    contactInfo: "031-123-4567",
    address: "경기도 고양시 일산동구 중앙로 1234",
    businessNumber: "456-78-90123",
    businessCertificate: "business_certificate_4.pdf",
    registrationDate: "2024-04-12",
    status: "approved",
    licenseStatus: "active",
    licenseType: "정식 라이선스",
    licenseExpiry: "2025-04-11",
    usersCount: {
      current: 5,
      limit: 5
    },
    paymentHistory: 2,
    photoCount: 78,
    reportCount: 65,
    mobileUsers: 3
  },
  {
    id: 5,
    name: "부산피부과의원",
    category: "병의원",
    representative: "정의사",
    contactInfo: "051-987-6543",
    address: "부산광역시 해운대구 해운대로 187",
    businessNumber: "567-89-01234",
    businessCertificate: "business_certificate_5.pdf",
    registrationDate: "2024-04-18",
    status: "approved",
    licenseStatus: "expired",
    licenseType: "정식 라이선스 (만료)",
    licenseExpiry: "2025-02-17",
    usersCount: {
      current: 3,
      limit: 5
    },
    paymentHistory: 3,
    photoCount: 102,
    reportCount: 95,
    mobileUsers: 8
  },
];

export const InstitutionService = {
  // Get all institutions
  getAll: async (): Promise<Institution[]> => {
    // In real app, this would be a fetch call
    return Promise.resolve(mockInstitutions);
  },

  // Get institution by ID
  getById: async (id: number): Promise<Institution | null> => {
    const institution = mockInstitutions.find(inst => inst.id === id);
    return Promise.resolve(institution || null);
  },

  // Update institution
  update: async (id: number, data: Partial<Institution>): Promise<Institution | null> => {
    // This would be a PUT request in a real application
    const index = mockInstitutions.findIndex(inst => inst.id === id);
    if (index === -1) return Promise.resolve(null);
    
    mockInstitutions[index] = { ...mockInstitutions[index], ...data };
    return Promise.resolve(mockInstitutions[index]);
  },

  // Approve institution
  approve: async (id: number): Promise<Institution | null> => {
    // This would be a specific API call in a real application
    const index = mockInstitutions.findIndex(inst => inst.id === id);
    if (index === -1) return Promise.resolve(null);
    
    mockInstitutions[index].status = "approved";
    return Promise.resolve(mockInstitutions[index]);
  },

  // Delete institution
  delete: async (id: number): Promise<boolean> => {
    // This would be a DELETE request in a real application
    const index = mockInstitutions.findIndex(inst => inst.id === id);
    if (index === -1) return Promise.resolve(false);
    
    mockInstitutions.splice(index, 1);
    return Promise.resolve(true);
  },

  // Set license status
  setLicenseStatus: async (id: number, status: "active" | "trial" | "expired"): Promise<Institution | null> => {
    // This would be a specific API call in a real application
    const index = mockInstitutions.findIndex(inst => inst.id === id);
    if (index === -1) return Promise.resolve(null);
    
    mockInstitutions[index].licenseStatus = status;
    mockInstitutions[index].licenseType = status === "trial" 
      ? "무료체험" 
      : (status === "active" ? "정식 라이선스" : "정식 라이선스 (만료)");
    
    return Promise.resolve(mockInstitutions[index]);
  }
};