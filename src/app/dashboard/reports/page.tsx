import { Metadata } from "next";
import { ReportsClient } from "./components/reports-client";

export const metadata: Metadata = {
  title: "리포트 관리 | 디레몬 안드로겐 탈모진단 관리자",
  description: "환자 리포트 관리 및 확인",
};

// 가상의 리포트 데이터 (실제 구현 시 API 호출로 대체)
const reportsData = [
  {
    id: 1,
    institution: "서울대학교병원",
    patientId: "P10001",
    patientName: "김환자",
    gender: "남",
    birthDate: "1985-05-15",
    phone: "010-1234-5678",
    firstVisit: "2024-01-10",
    lastVisit: "2024-05-01",
  },
  {
    id: 2,
    institution: "연세세브란스병원",
    patientId: "P10002",
    patientName: "이진료",
    gender: "여",
    birthDate: "1990-10-20",
    phone: "010-2345-6789",
    firstVisit: "2024-02-15",
    lastVisit: "2024-05-05",
  },
  {
    id: 3,
    institution: "가톨릭대학교병원",
    patientId: "P10003",
    patientName: "박대상",
    gender: "남",
    birthDate: "1978-03-25",
    phone: "010-3456-7890",
    firstVisit: "2024-03-01",
    lastVisit: "2024-04-28",
  },
  {
    id: 4,
    institution: "건국대학교병원",
    patientId: "P10004",
    patientName: "최검사",
    gender: "여",
    birthDate: "1982-12-10",
    phone: "010-4567-8901",
    firstVisit: "2024-01-20",
    lastVisit: "2024-04-15",
  },
  {
    id: 5,
    institution: "고려대학교안암병원",
    patientId: "P10005",
    patientName: "정의뢰",
    gender: "남",
    birthDate: "1995-08-30",
    phone: "010-5678-9012",
    firstVisit: "2024-02-28",
    lastVisit: "2024-05-10",
  },
];

export default function ReportsPage() {
  return <ReportsClient initialReports={reportsData} />;
}
