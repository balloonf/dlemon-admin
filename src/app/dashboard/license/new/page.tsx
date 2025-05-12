import React from "react";
import { getInstitutions } from "@/lib/api";
import { CreateLicenseForm } from "../components/create-license-form";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export default async function CreateLicensePage({
  searchParams
}: {
  searchParams?: {
    institution?: string;
    type?: string;
  }
}) {
  // 기관 목록 가져오기
  const institutions = await getInstitutions();
  
  // URL 파라미터에서 기관 ID와 라이선스 유형 추출
  const institutionId = searchParams?.institution || "";
  const licenseType = searchParams?.type || "trial";
  
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">대시보드</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/license">라이선스 관리</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>라이선스 생성</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div>
        <h1 className="text-2xl font-bold">라이선스 생성</h1>
        <p className="text-muted-foreground mt-1">
          새로운 라이선스를 생성하고 기관에 할당합니다.
        </p>
      </div>
      
      <CreateLicenseForm 
        institutions={institutions}
        initialInstitutionId={institutionId} 
        initialLicenseType={licenseType}
      />
    </div>
  );
}
