import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PhotoUploadForm } from "../components/photo-upload-form";

export const metadata: Metadata = {
  title: "사진 업로드 | 디레몬 안드로겐 탈모진단 관리자",
  description: "환자 사진 업로드 및 분석",
};

export default function PhotoUploadPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">대시보드</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/photos">사진 관리</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>사진 업로드</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold mt-2">사진 업로드</h1>
        </div>
        
        <Button variant="outline" asChild>
          <Link href="/dashboard/photos">목록으로</Link>
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-md shadow">
        <PhotoUploadForm />
      </div>
    </div>
  );
}
