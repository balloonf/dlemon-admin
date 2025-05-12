import React from "react";
import { getPaymentById, getLicenseById } from "@/lib/api";
import { PaymentDetail } from "../components/payment-detail";
import { PaymentRefundForm } from "../components/payment-refund-form";
import { notFound } from "next/navigation";

export default async function PaymentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // 결제 내역 상세 정보 가져오기
    const payment = await getPaymentById(params.id);
    
    // 라이선스 정보 가져오기 (연결된 경우만)
    let license = null;
    if (payment.licenseId) {
      try {
        license = await getLicenseById(payment.licenseId);
      } catch (error) {
        console.error("라이선스 정보 조회 실패:", error);
      }
    }
    
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">결제 내역 상세</h1>
        
        <PaymentDetail payment={payment} license={license} />
        
        {/* 결제 완료 상태일 때만 환불 폼 표시 */}
        {payment.status === "paid" && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">환불 처리</h2>
            <PaymentRefundForm payment={payment} />
          </div>
        )}
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
