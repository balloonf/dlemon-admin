"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { License, User } from "@/lib/definitions";
import { Institution } from "@/lib/definitions";

interface UsageData {
  id: string;
  name: string;
  username: string;
  phoneNumber: string;
  institutionType: string;
  processedPhotos: number;
  analysisScore: number;
  totalPhotos: number;
  diagnosedPhotos: number;
}

// 샘플 데이터
const SAMPLE_USAGE_DATA: UsageData[] = [
  {
    id: "1",
    name: "김관리",
    username: "admin1",
    phoneNumber: "010-1234-5678",
    institutionType: "병원",
    processedPhotos: 42,
    analysisScore: 87,
    totalPhotos: 50,
    diagnosedPhotos: 45
  },
  {
    id: "2",
    name: "이사용",
    username: "user1",
    phoneNumber: "010-2345-6789",
    institutionType: "피부과",
    processedPhotos: 31,
    analysisScore: 92,
    totalPhotos: 38,
    diagnosedPhotos: 35
  },
  {
    id: "3",
    name: "박의사",
    username: "doctor1",
    phoneNumber: "010-3456-7890",
    institutionType: "피부과",
    processedPhotos: 27,
    analysisScore: 78,
    totalPhotos: 30,
    diagnosedPhotos: 28
  },
  {
    id: "4",
    name: "정간호",
    username: "nurse1",
    phoneNumber: "010-4567-8901",
    institutionType: "병원",
    processedPhotos: 15,
    analysisScore: 85,
    totalPhotos: 20,
    diagnosedPhotos: 18
  }
];

export function LicenseUsageView({ institution, license }: { institution: Institution, license: License }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false);
  const [newPhotoLimit, setNewPhotoLimit] = useState("100");
  
  // 검색 필터링
  const filteredData = SAMPLE_USAGE_DATA.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.username.toLowerCase().includes(query) ||
      item.phoneNumber.includes(query) ||
      item.institutionType.toLowerCase().includes(query)
    );
  });
  
  // 전체 합계 계산
  const totals = {
    processedPhotos: filteredData.reduce((sum, item) => sum + item.processedPhotos, 0),
    analysisScore: Math.round(
      filteredData.reduce((sum, item) => sum + item.analysisScore, 0) / 
      (filteredData.length || 1)
    ),
    totalPhotos: filteredData.reduce((sum, item) => sum + item.totalPhotos, 0),
    diagnosedPhotos: filteredData.reduce((sum, item) => sum + item.diagnosedPhotos, 0)
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          '{institution.name}' 라이선스 사용 현황 ({new Date().toLocaleDateString()})
        </h2>
        <Button onClick={() => setIsSettingDialogOpen(true)}>
          사분석 사용량 설정
        </Button>
      </div>
      
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="검색어 입력"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">번호</TableHead>
              <TableHead>기관명</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>아이디</TableHead>
              <TableHead>휴대폰번호</TableHead>
              <TableHead>기관구분</TableHead>
              <TableHead className="text-right">진행 사진수(장)</TableHead>
              <TableHead className="text-right">진단 시분석 점수(점)</TableHead>
              <TableHead className="text-right">실제 사진수 등록 수(장)</TableHead>
              <TableHead className="text-right">진단 사진수 등록 수(장)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6">
                  등록된 데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {filteredData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{institution.name}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.phoneNumber}</TableCell>
                    <TableCell>{item.institutionType}</TableCell>
                    <TableCell className="text-right">{item.processedPhotos}</TableCell>
                    <TableCell className="text-right">{item.analysisScore}</TableCell>
                    <TableCell className="text-right">{item.totalPhotos}</TableCell>
                    <TableCell className="text-right">{item.diagnosedPhotos}</TableCell>
                  </TableRow>
                ))}
                
                {/* 합계 행 */}
                <TableRow className="bg-muted/50 font-medium">
                  <TableCell colSpan={6} className="text-right">합계:</TableCell>
                  <TableCell className="text-right">{totals.processedPhotos}</TableCell>
                  <TableCell className="text-right">{totals.analysisScore}</TableCell>
                  <TableCell className="text-right">{totals.totalPhotos}</TableCell>
                  <TableCell className="text-right">{totals.diagnosedPhotos}</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* 사분석 사용량 설정 대화상자 */}
      <Dialog open={isSettingDialogOpen} onOpenChange={setIsSettingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사분석 사용량 설정</DialogTitle>
            <DialogDescription>
              '{institution.name}'의 사진 분석 사용량을 설정합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">현재 최대 사진 수</div>
              <div>{license.maxPhotos} 장</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">현재 사용 사진 수</div>
              <div>{license.currentPhotos} 장 ({Math.round((license.currentPhotos / license.maxPhotos) * 100)}%)</div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="photo-limit" className="text-sm font-medium">
                새 최대 사진 수 설정
              </label>
              <Input
                id="photo-limit"
                type="number"
                value={newPhotoLimit}
                min={license.currentPhotos}
                onChange={e => setNewPhotoLimit(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSettingDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={() => {
                // 실제 구현에서는 API 호출로 업데이트
                alert(`최대 사진 수가 ${newPhotoLimit}장으로 설정되었습니다.`);
                setIsSettingDialogOpen(false);
              }}
            >
              설정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
