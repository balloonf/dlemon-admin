"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { License, Payment, PaymentStatus } from "@/lib/definitions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { updatePaymentStatus } from "@/lib/api";
import Link from "next/link";
import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react";

// 결제 상태별 배지 색상 정의
const statusColors = {
  ready: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  paid: "bg-green-100 text-green-800 hover:bg-green-200",
  canceled: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  failed: "bg-red-100 text-red-800 hover:bg-red-200",
  refunded: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  partial_refunded: "bg-purple-100 text-purple-800 hover:bg-purple-200",
};

// 결제 상태 한글 표시
const statusLabels = {
  ready: "결제 대기",
  paid: "결제 완료",
  canceled: "취소됨",
  failed: "결제 실패",
  refunded: "환불 완료",
  partial_refunded: "부분 환불",
};

// 결제 방법 한글 표시
const methodLabels = {
  card: "신용카드",
  bank: "계좌이체",
  vbank: "가상계좌",
  phone: "휴대폰",
  point: "포인트",
};

interface PaymentDetailProps {
  payment: Payment;
  license: License | null;
}

export function PaymentDetail({ payment, license }: PaymentDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>(payment.status);
  const [loading, setLoading] = useState(false);
  
  // 결제 상태를 변경할 수 있는 상태인지 확인
  const canChangeStatus = ["ready", "failed"].includes(payment.status);
  
  // 결제 상태 변경 처리
  const handleStatusChange = async () => {
    if (status === payment.status) return;
    
    try {
      setLoading(true);
      await updatePaymentStatus(payment.id, status);
      router.refresh();
    } catch (error) {
      console.error("결제 상태 변경 중 오류 발생:", error);
      setStatus(payment.status);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">기본 정보</h3>
              <div className="grid grid-cols-1 gap-2 mt-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">결제 ID</span>
                  <span>{payment.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">주문 번호</span>
                  <span>{payment.orderId}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">기관</span>
                  <span>{payment.institutionName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">결제 금액</span>
                  <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">결제 방법</span>
                  <span>{methodLabels[payment.method]}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">결제 상태</span>
                  <Badge
                    variant="outline"
                    className={statusColors[payment.status]}
                  >
                    {statusLabels[payment.status]}
                  </Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">결제일</span>
                  <span>{payment.paymentDate ? formatDate(payment.paymentDate) : "-"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">등록일</span>
                  <span>{formatDate(payment.createdAt)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">설명</span>
                  <span>{payment.description}</span>
                </div>
              </div>
            </div>
            
            {payment.licenseId && license && (
              <div>
                <h3 className="text-lg font-medium">연결된 라이선스</h3>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-500">라이선스 ID</span>
                    <Link
                      href={`/dashboard/license/${license.id}`}
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      {license.id}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-500">유형</span>
                    <span>{license.type}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-500">상태</span>
                    <span>{license.status}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-500">기간</span>
                    <span>
                      {formatDate(license.startDate)} ~ {formatDate(license.expiryDate)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">환불 정보</h3>
              <div className="grid grid-cols-1 gap-2 mt-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">환불 상태</span>
                  <span>
                    {payment.status === "refunded" ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">환불 완료</Badge>
                    ) : payment.status === "partial_refunded" ? (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">부분 환불</Badge>
                    ) : (
                      "환불 내역 없음"
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">환불 금액</span>
                  <span>{payment.refundAmount ? formatCurrency(payment.refundAmount) : "-"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">환불일</span>
                  <span>{payment.refundDate ? formatDate(payment.refundDate) : "-"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-500">취소일</span>
                  <span>{payment.cancelDate ? formatDate(payment.cancelDate) : "-"}</span>
                </div>
              </div>
            </div>
            
            {payment.receiptUrl && (
              <div>
                <h3 className="text-lg font-medium">영수증</h3>
                <div className="mt-2">
                  <a
                    href={payment.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    영수증 보기
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
            
            {canChangeStatus && (
              <div>
                <h3 className="text-lg font-medium">결제 상태 변경</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">새 상태</Label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value as PaymentStatus)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ready">결제 대기</SelectItem>
                        <SelectItem value="paid">결제 완료</SelectItem>
                        <SelectItem value="canceled">취소됨</SelectItem>
                        <SelectItem value="failed">결제 실패</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleStatusChange}
                      disabled={loading || status === payment.status}
                      className="w-full"
                    >
                      {loading ? "처리 중..." : "상태 변경"}
                    </Button>
                  </div>
                </div>
                
                {status === "paid" && payment.status !== "paid" && (
                  <div className="mt-2 flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-yellow-600">
                      '결제 완료'로 변경 시 현재 날짜로 결제일이 기록됩니다.
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {!canChangeStatus && (
              <div className="mt-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">
                  이 결제 내역은 현재 상태에서 변경할 수 없습니다.
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/payment")}
        >
          목록으로
        </Button>
        
        <div className="flex space-x-2">
          {payment.status === "ready" && (
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  setLoading(true);
                  await updatePaymentStatus(payment.id, "canceled");
                  router.refresh();
                } catch (error) {
                  console.error("결제 취소 중 오류 발생:", error);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              결제 취소
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
