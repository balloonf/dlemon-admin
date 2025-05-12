"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";

type DiagnosisType = {
  date: string;
  result: string;
  details: string;
  recommendations: string;
};

type ImageType = {
  id: number;
  url: string;
  type: string;
  date: string;
};

type TreatmentType = {
  id: number;
  date: string;
  type: string;
  description: string;
};

type ReportDetail = {
  id: number;
  institution: string;
  patientId: string;
  patientName: string;
  gender: string;
  birthDate: string;
  phone: string;
  address: string;
  firstVisit: string;
  lastVisit: string;
  diagnosis: DiagnosisType;
  images: ImageType[];
  treatmentHistory: TreatmentType[];
};

interface ReportDetailClientProps {
  report: ReportDetail;
}

export function ReportDetailClient({ report }: ReportDetailClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">리포트 상세</h1>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          리포트 다운로드
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 환자 정보 카드 */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>환자 정보</CardTitle>
            <CardDescription>환자의 기본 정보</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">이름</p>
                <p>{report.patientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">성별</p>
                <p>{report.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">생년월일</p>
                <p>{formatDate(report.birthDate, "yyyy-MM-dd")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">연락처</p>
                <p>{report.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">주소</p>
                <p>{report.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">기관명</p>
                <p>{report.institution}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">환자 고유번호</p>
                <p>{report.patientId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">최초 진료일</p>
                <p>{formatDate(report.firstVisit, "yyyy-MM-dd")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">마지막 진료일</p>
                <p>{formatDate(report.lastVisit, "yyyy-MM-dd")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 진단 결과 및 이미지 카드 */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>진단 결과</CardTitle>
            <CardDescription>AI 진단 결과 및 이미지</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="diagnosis">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="diagnosis">진단 결과</TabsTrigger>
                <TabsTrigger value="images">이미지</TabsTrigger>
              </TabsList>
              <TabsContent value="diagnosis" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">진단일</p>
                    <p>{formatDate(report.diagnosis.date, "yyyy-MM-dd")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">진단 결과</p>
                    <p className="font-medium">{report.diagnosis.result}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">상세 내용</p>
                    <p>{report.diagnosis.details}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">권장 사항</p>
                    <p>{report.diagnosis.recommendations}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="images" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {report.images.map((image) => (
                    <div key={image.id} className="border rounded-md overflow-hidden">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-500">이미지 영역</span>
                      </div>
                      <div className="p-2 text-sm">
                        <p className="font-medium">{image.type}</p>
                        <p className="text-gray-500 text-xs">
                          {formatDate(image.date, "yyyy-MM-dd")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 진료 이력 카드 */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>진료 이력</CardTitle>
            <CardDescription>환자의 진료 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l border-gray-200">
              {report.treatmentHistory.map((treatment, index) => (
                <div key={treatment.id} className="mb-6 last:mb-0 relative">
                  <div className="absolute -left-[25px] mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                  <p className="font-medium">
                    {formatDate(treatment.date, "yyyy-MM-dd")} - {treatment.type}
                  </p>
                  <p className="text-gray-600">{treatment.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
