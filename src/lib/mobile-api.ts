import { MobileUser, MobileUserStatus, LicenseType } from "./definitions";
import { SAMPLE_MOBILE_USERS } from "@/app/dashboard/mobile-users/mobile-users-api";

// 샘플 지연 함수 - API 호출 시뮬레이션
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mobile앱 사용자 목록 가져오기
export async function getMobileUsers(params?: {
  search?: string;
  status?: MobileUserStatus;
  institutionId?: string;
  licenseType?: LicenseType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<{ mobileUsers: MobileUser[]; total: number }> {
  await delay(500);
  
  let filteredUsers = [...SAMPLE_MOBILE_USERS];
  
  // 검색어 필터링
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.phoneNumber.includes(searchLower) ||
      user.deviceId.toLowerCase().includes(searchLower)
    );
  }
  
  // 상태 필터링
  if (params?.status) {
    filteredUsers = filteredUsers.filter(user => user.status === params.status);
  }
  
  // 기관 필터링
  if (params?.institutionId) {
    filteredUsers = filteredUsers.filter(user => user.institutionId === params.institutionId);
  }
  
  // 라이선스 유형 필터링
  if (params?.licenseType) {
    filteredUsers = filteredUsers.filter(user => user.licenseType === params.licenseType);
  }
  
  // 등록일 시작일 필터링
  if (params?.startDate) {
    const startDate = new Date(params.startDate);
    filteredUsers = filteredUsers.filter(user => new Date(user.createdAt) >= startDate);
  }
  
  // 등록일 종료일 필터링
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
  
  // 타입 캐스팅을 사용하여 licenseType 문제 해결
  return { mobileUsers: filteredUsers as unknown as MobileUser[], total };
}

// Mobile앱 사용자 상세 정보 가져오기
export async function getMobileUserById(id: string): Promise<MobileUser> {
  await delay(300);
  const user = SAMPLE_MOBILE_USERS.find(user => user.id === id);
  
  if (!user) {
    throw new Error(`Mobile앱 사용자 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 타입 캐스팅을 사용하여 licenseType 문제 해결
  return user as unknown as MobileUser;
}

// Mobile앱 사용자 생성
export async function createMobileUser(userData: Omit<MobileUser, "id" | "createdAt" | "updatedAt" | "lastAccess">): Promise<MobileUser> {
  await delay(800);
  
  // 새 사용자 ID 생성 (실제로는 서버에서 생성)
  const newId = (SAMPLE_MOBILE_USERS.length + 1).toString();
  
  const newUser: MobileUser = {
    id: newId,
    ...userData,
    lastAccess: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 샘플 데이터에 추가 (실제로는 DB에 저장)
  // 타입 캐스팅을 사용하여 licenseType 문제 해결
  SAMPLE_MOBILE_USERS.push(newUser as any);
  
  return newUser;
}

// Mobile앱 사용자 수정
export async function updateMobileUser(id: string, userData: Partial<MobileUser>): Promise<MobileUser> {
  await delay(800);
  
  const userIndex = SAMPLE_MOBILE_USERS.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    throw new Error(`Mobile앱 사용자 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 사용자 정보 업데이트
  const updatedUser = {
    ...SAMPLE_MOBILE_USERS[userIndex],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  // 샘플 데이터 업데이트 (실제로는 DB 업데이트)
  // 타입 캐스팅을 사용하여 licenseType 문제 해결
  SAMPLE_MOBILE_USERS[userIndex] = updatedUser as any;
  
  // 타입 캐스팅을 사용하여 licenseType 문제 해결
  return updatedUser as unknown as MobileUser;
}

// Mobile앱 사용자 상태 변경
export async function updateMobileUserStatus(id: string, status: MobileUserStatus): Promise<MobileUser> {
  return updateMobileUser(id, { status });
}

// Mobile앱 사용자 삭제
export async function deleteMobileUser(id: string): Promise<boolean> {
  await delay(500);
  
  const userIndex = SAMPLE_MOBILE_USERS.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    throw new Error(`Mobile앱 사용자 ID ${id}를 찾을 수 없습니다.`);
  }
  
  // 샘플 데이터에서 삭제 (실제로는 DB에서 삭제)
  SAMPLE_MOBILE_USERS.splice(userIndex, 1);
  
  return true;
}