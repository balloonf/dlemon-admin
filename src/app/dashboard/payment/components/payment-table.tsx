"use client";

import { Payment, PaymentStatus } from "@/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";

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

interface PaymentTableProps {
  payments: Payment[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table className="border-collapse border-spacing-0">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">결제 ID</TableHead>
              <TableHead>기관명</TableHead>
              <TableHead>결제 금액</TableHead>
              <TableHead>결제 방법</TableHead>
              <TableHead>결제 상태</TableHead>
              <TableHead>결제일</TableHead>
              <TableHead>환불 금액</TableHead>
              <TableHead>설명</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  결제 내역이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/payment/${payment.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {payment.id}
                    </Link>
                  </TableCell>
                  <TableCell>{payment.institutionName}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{methodLabels[payment.method]}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[payment.status]}
                    >
                      {statusLabels[payment.status as PaymentStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.paymentDate ? formatDate(payment.paymentDate) : "-"}
                  </TableCell>
                  <TableCell>
                    {payment.refundAmount 
                      ? formatCurrency(payment.refundAmount)
                      : "-"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={payment.description}>
                    {payment.description}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
