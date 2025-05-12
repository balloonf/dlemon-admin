import { Metadata } from "next";
import { ReportDetailClient } from "../components/report-detail-client";

export const metadata: Metadata = {
  title: "리포트 상세 | 디레몬 안드로겐 탈모진단 관리자",
  description: "환자 리포트 상세 정보 확인",
};

// 가상의 리포트 상세 데이터 (실제 구현 시 API 호출로 대체)
const getReportData = (id: string) => {
  return {
    id: parseInt(id),
    institution: "서울대학교병원",
    patientId: "P10001",
    patientName: "김환자",
    gender: "남",
    birthDate: "1985-05-15",
    phone: "010-1234-5678",
    address: "서울시 강남구 테헤란로 123",
    firstVisit: "2024-01-10",
    lastVisit: "2024-05-01",
    diagnosis: {
      date: "2024-05-01",
      result: "안드로겐성 탈모 II-A 단계",
      details: "정수리와 앞머리 부분에 중등도의 탈모 진행이 관찰됨",
      recommendations: "약물 치료와 생활 습관 개선 권장",
    },
    images: [
      { id: 1, url: "/placeholder-image.jpg", type: "전면", date: "2024-05-01" },
      { id: 2, url: "/placeholder-image.jpg", type: "측면", date: "2024-05-01" },
      { id: 3, url: "/placeholder-image.jpg", type: "정수리", date: "2024-05-01" },
    ],
    treatmentHistory: [
      { id: 1, date: "2024-01-10", type: "초진", description: "초기 상담 및 탈모 진단" },
      { id: 2, date: "2024-03-15", type: "재진", description: "약물 처방 및 진행 상태 확인" },
      { id: 3, date: "2024-05-01", type: "재진", description: "탈모 진행도 평가 및 약물 조정" },
    ],
  };
};

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const report = getReportData(params.id);
  return <ReportDetailClient report={report} />;
}
