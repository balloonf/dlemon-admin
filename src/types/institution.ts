export type InstitutionCategory = '병의원' | '대학병원' | '일상연구소' | '헤어샵' | '기타';
export type ApprovalStatus = 'approved' | 'pending';
export type LicenseStatus = 'active' | 'trial' | 'expired' | 'none';

export interface Institution {
  id: number;
  name: string;
  nameEn?: string;
  category: InstitutionCategory;
  representative: string;
  representativePosition?: string;
  businessNumber: string;
  businessCertificate: string;
  medicalLicense?: string;
  address: string;
  addressDetail?: string;
  addressEn?: string;
  zipCode?: string;
  contactInfo: string;
  email?: string;
  website?: string;
  registrationDate: string;
  status: ApprovalStatus;
  licenseStatus: LicenseStatus;
  licenseType: string;
  licenseExpiry: string;
  trialExpiry?: string | null;
  usersCount: {
    current: number;
    limit: number;
  };
  adminId?: string;
  adminName?: string;
  adminEmail?: string;
  adminPhone?: string;
  paymentHistory: number;
  photoCount: number;
  reportCount: number;
  mobileUsers: number;
}