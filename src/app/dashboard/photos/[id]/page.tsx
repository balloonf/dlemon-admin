import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PhotoDetail } from "../components/photo-detail";
import { PhotoAnalysis } from "../components/photo-analysis";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "사진 상세 | 디레몬 안드로겐 탈모진단 관리자",
  description: "사진 상세 정보 및 분석 결과 확인",
};

interface PhotoDetailPageProps {
  params: {
    id: string;
  };
}

export default function PhotoDetailPage({ params }: PhotoDetailPageProps) {
  const photoId = params.id;

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
                <BreadcrumbPage>{`사진 상세 (${photoId})`}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold mt-2">사진 상세</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/photos">목록으로</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/reports/new">리포트 생성</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">사진 정보</h2>
          <PhotoDetail id={photoId} />
        </div>
        
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">분석 결과</h2>
          <PhotoAnalysis id={photoId} />
        </div>
      </div>
    </div>
  );
}
