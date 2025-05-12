import { Metadata } from "next";
import { PhotosTable } from "./components/photos-table";
import { PhotosFilter } from "./components/photos-filter";
import { PhotoRetentionSettings } from "./components/photo-retention-settings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsIcon, UploadIcon } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "사진 관리 | 디레몬 안드로겐 탈모진단 관리자",
  description: "환자 사진 관리 및 분석 결과 확인",
};

export default function PhotosPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">사진 관리</h1>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/photos/new">
              <UploadIcon className="h-4 w-4 mr-2" />
              사진 업로드
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="photos">사진 목록</TabsTrigger>
          <TabsTrigger value="settings">보관 및 백업 설정</TabsTrigger>
        </TabsList>
        
        <TabsContent value="photos" className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow">
            <PhotosFilter />
          </div>
          
          <div className="bg-white p-6 rounded-md shadow">
            <PhotosTable />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow">
            <PhotoRetentionSettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
