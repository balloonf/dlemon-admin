import React from "react";
import { getInstitutions, getLicenseById } from "@/lib/api";
import { EditLicenseForm } from "../components/edit-license-form";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditLicensePage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // 라이선스 정보 가져오기
    const license = await getLicenseById(params.id);
    // 기관 목록 가져오기
    const institutions = await getInstitutions();
    
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
              <BreadcrumbPage>라이선스 수정</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div>
          <h1 className="text-2xl font-bold">라이선스 수정</h1>
          <p className="text-muted-foreground mt-1">
            기존 라이선스 정보를 수정합니다.
          </p>
        </div>
        
        <EditLicenseForm license={license} institutions={institutions} />
      </div>
    );
  } catch (error) {
    // 라이선스가 없는 경우 404 페이지로 이동
    return notFound();
  }
}
