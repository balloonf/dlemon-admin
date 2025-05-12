import React from "react";
import { getInstitutions, getLicenses } from "@/lib/api";
import { NewPaymentForm } from "../components/new-payment-form";

export default async function NewPaymentPage() {
  // 기관 목록 가져오기
  const institutions = await getInstitutions();
  
  // 라이선스 목록 가져오기 (기관별 필터링은 클라이언트에서 처리)
  const { licenses } = await getLicenses();
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">결제 내역 추가</h1>
      <NewPaymentForm institutions={institutions} licenses={licenses} />
    </div>
  );
}
