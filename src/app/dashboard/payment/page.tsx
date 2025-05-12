import React from "react";
import { PaymentTable } from "./components/payment-table";
import { PaymentFilter } from "./components/payment-filter";
import { PaymentPagination } from "./components/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPayments, getInstitutions } from "@/lib/api";
import { PaymentStatus, PaymentMethod } from "@/lib/definitions";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    status?: string;
    method?: string;
    institution?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const status = searchParams?.status || "";
  const method = searchParams?.method || "";
  const institution = searchParams?.institution || "";
  const startDate = searchParams?.startDate || "";
  const endDate = searchParams?.endDate || "";
  const currentPage = Number(searchParams?.page) || 1;
  
  // API에서 결제 내역 목록 가져오기
  const { payments, total } = await getPayments({
    search: query,
    status: status !== "all" ? status as PaymentStatus : undefined,
    method: method !== "all" ? method as PaymentMethod : undefined,
    institutionId: institution !== "all" ? institution : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page: currentPage,
    limit: 10
  });
  
  // 기관 목록 가져오기
  const institutions = await getInstitutions();
  
  // 총 페이지 수 계산
  const totalPages = Math.ceil(total / 10);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">결제 내역 관리</h1>
        <Link href="/dashboard/payment/new">
          <Button>결제 내역 추가</Button>
        </Link>
      </div>
      
      <PaymentFilter institutions={institutions} />
      
      <PaymentTable payments={payments} />
      
      <div className="mt-4 flex justify-center">
        <PaymentPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
