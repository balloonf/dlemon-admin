import React from "react";
import { UsersTable } from "./components/users-table";
import { UserFilter } from "./components/user-filter";
import { UsersPagination } from "./components/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUsers, getInstitutions } from "@/lib/api";
import { UserRole, UserStatus } from "@/lib/definitions";

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    status?: string;
    role?: string;
    institution?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const status = searchParams?.status || "";
  const role = searchParams?.role || "";
  const institution = searchParams?.institution || "";
  const startDate = searchParams?.startDate || "";
  const endDate = searchParams?.endDate || "";
  const currentPage = Number(searchParams?.page) || 1;
  
  // API에서 이용자 목록 가져오기
  const { users, total } = await getUsers({
    search: query,
    status: status !== "all" ? status as UserStatus : undefined,
    role: role !== "all" ? role as UserRole : undefined,
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
        <h1 className="text-2xl font-bold">소누피부과의원 &gt; 직원 정보 관리(목록)</h1>
        <Link href="/dashboard/users/new">
          <Button>직원 등록</Button>
        </Link>
      </div>
      
      <UserFilter institutions={institutions} />
      
      <UsersTable users={users} />
      
      <div className="mt-4 flex justify-center">
        <UsersPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
