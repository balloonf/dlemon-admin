import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

// 클래스 결합 유틸리티
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 날짜 포맷 유틸리티
export function formatDate(dateString: string, formatStr: string = "yyyy-MM-dd") {
  return format(new Date(dateString), formatStr, { locale: ko });
}

// 전화번호 포맷 유틸리티
export function formatPhoneNumber(phoneNumber: string): string {
  // 숫자만 추출
  const numbers = phoneNumber.replace(/\D/g, "");
  
  // 전화번호 길이에 따라 적절한 포맷 적용
  if (numbers.length === 11) {
    // 휴대폰 번호: 010-1234-5678
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    // 일반 전화번호: 02-123-4567 또는 010-123-4567
    if (numbers.startsWith("02")) {
      // 서울 지역번호
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      // 기타 지역번호 또는 휴대폰
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    }
  } else if (numbers.length === 9) {
    // 일반 전화번호: 02-123-4567
    if (numbers.startsWith("02")) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
    }
  }
  
  // 포맷팅 할 수 없는 경우 원래 값 반환
  return phoneNumber;
}

// 금액 포맷 유틸리티
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(amount);
}
