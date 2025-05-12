import React from "react";
import { LicenseTable } from "./components/license-table";
import { LicenseFilter } from "./components/license-filter";
import { LicensePagination } from "./components/pagination";
import { FreeTrialManager } from "./components/free-trial-manager";
import { LicenseUsageView } from "./components/license-usage-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getLicenses, getInstitutions, getInstitutionById } from "@/lib/api";
import { LicenseStatus, LicenseType } from "@/lib/definitions";

export default async function LicensePage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    status?: string;
    type?: string;
    institution?: string;
    page?: string;
    institutionId?: string;
  };
}) {
  const query = searchParams?.query || "";
  const status = searchParams?.status || "";
  const type = searchParams?.type || "";
  const institution = searchParams?.institution || "";
  const currentPage = Number(searchParams?.page) || 1;
  const selectedInstitutionId = searchParams?.institutionId || "";
  
  // API에서 라이선스 목록 가져오기
  const { licenses, total } = await getLicenses({
    search: query,
    status: status !== "all" ? status as LicenseStatus : undefined,
    type: type !== "all" ? type as LicenseType : undefined,
    institutionId: institution !== "all" ? institution : undefined,
    page: currentPage,
    limit: 10
  });
  
  // 기관 목록 가져오기
  const institutions = await getInstitutions();
  
  // 선택된 기관 정보 가져오기 (있는 경우)
  let selectedInstitution = null;
  if (selectedInstitutionId) {
    try {
      selectedInstitution = await getInstitutionById(selectedInstitutionId);
    } catch (error) {
      console.error("기관 정보 조회 실패:", error);
      // 에러가 발생하면 선택된 기관 없이 계속 진행
    }
  }
  
  // 선택된 기관의 라이선스 필터링 (있는 경우)
  const institutionLicenses = selectedInstitutionId 
    ? licenses.filter(license => license.institutionId === selectedInstitutionId)
    : [];
  
  // 총 페이지 수 계산
  const totalPages = Math.ceil(total / 10);
  
  return (
    <div className="space-y-6">
      {selectedInstitution ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{selectedInstitution.name} &gt; 라이선스 관리</h1>
            <Link href="/dashboard/institution">
              <Button variant="outline" className="mr-2">기관 목록</Button>
            </Link>
          </div>
          
          <FreeTrialManager 
            institution={selectedInstitution} 
            licenses={institutionLicenses}
          />
          
          {institutionLicenses.length > 0 && (
            <div className="space-y-4">
              <LicenseTable licenses={institutionLicenses} />
              
              {/* 라이선스가 있는 경우에만 사용 현황 표시 */}
              {institutionLicenses.some(license => license.status === "active") && (
                <LicenseUsageView 
                  institution={selectedInstitution} 
                  license={institutionLicenses.find(license => license.status === "active")!}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">라이선스 관리</h1>
            <Link href="/dashboard/license/new">
              <Button>라이선스 생성</Button>
            </Link>
          </div>
          
          <LicenseFilter institutions={institutions} />
          
          <LicenseTable licenses={licenses} />
          
          <div className="mt-4 flex justify-center">
            <LicensePagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        </div>
      )}
    </div>
  );
}
