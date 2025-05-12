"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Payment } from "@/lib/definitions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { processRefund } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface PaymentRefundFormProps {
  payment: Payment;
}

export function PaymentRefundForm({ payment }: PaymentRefundFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(payment.amount);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 최대 환불 가능 금액 검사
  const isValidAmount = amount > 0 && amount <= payment.amount;
  
  // 폼 유효성 검사
  const isFormValid = isValidAmount && reason.trim().length >= 2;
  
  // 환불 처리
  const handleRefund = async () => {
    if (!isFormValid) return;
    
    try {
      setError(null);
      setLoading(true);
      
      // 환불 처리 API 호출
      await processRefund(payment.id, {
        amount,
        reason,
      });
      
      // 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("환불 처리 중 오류 발생:", error);
      setError(error instanceof Error ? error.message : "환불 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total-amount">결제 금액</Label>
              <Input
                id="total-amount"
                value={formatCurrency(payment.amount)}
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="refund-amount">환불 금액</Label>
              <Input
                id="refund-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                max={payment.amount}
                min={1}
              />
              {!isValidAmount && (
                <p className="text-sm text-red-500">
                  환불 금액은 0보다 크고 결제 금액({formatCurrency(payment.amount)})보다 작거나 같아야 합니다.
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="refund-reason">환불 사유</Label>
            <Textarea
              id="refund-reason"
              placeholder="환불 사유를 입력하세요."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
            {reason.trim().length < 2 && (
              <p className="text-sm text-red-500">
                환불 사유는 최소 2자 이상 입력해야 합니다.
              </p>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="flex justify-end w-full space-x-2">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => {
              setAmount(payment.amount);
              setReason("");
              setError(null);
            }}
          >
            초기화
          </Button>
          <Button
            variant="default"
            onClick={handleRefund}
            disabled={!isFormValid || loading}
          >
            {loading ? "처리 중..." : amount === payment.amount ? "전액 환불 처리" : "부분 환불 처리"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
