import React from "react";
import { MobileUsersTable } from "./components/mobile-users-table";
import { MobileUserFilter } from "./components/mobile-user-filter";
import { MobileUsersPagination } from "./components/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getInstitutions, getLicenses } from "@/lib/api";
import { getMobileUsers } from "@/lib/mobile-api";
import { MobileUserStatus, LicenseType } from "@/lib/definitions";

export default async function MobileUsersPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    status?: string;
    institution?: string;
    licenseType?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const status = searchParams?.status || "";
  const institution = searchParams?.institution || "";
  const licenseType = searchParams?.licenseType || "";
  const currentPage = Number(searchParams?.page) || 1;
  
  // API에서 Mobile앱 사용자 목록 가져오기
  const { mobileUsers, total } = await getMobileUsers({
    search: query,
    status: status !== "all" ? status as MobileUserStatus : undefined,
    institutionId: institution !== "all" ? institution : undefined,
    licenseType: licenseType !== "all" ? licenseType as LicenseType : undefined,
    page: currentPage,
    limit: 10
  });
  
  // 기관 목록 가져오기
  const institutions = await getInstitutions();
  
  // 라이선스 목록 가져오기
  const { licenses } = await getLicenses();
  
  // 총 페이지 수 계산
  const totalPages = Math.ceil(total / 10);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mobile앱 사용자 관리</h1>
        <Link href="/dashboard/mobile-users/new">
          <Button>Mobile앱 사용자 등록</Button>
        </Link>
      </div>
      
      <MobileUserFilter institutions={institutions} licenses={licenses} />
      
      <MobileUsersTable mobileUsers={mobileUsers} />
      
      <div className="mt-4 flex justify-center">
        <MobileUsersPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
