"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalysisResult, PhotoStatus, PhotoQuality } from "@/lib/definitions";
import { getInstitutions } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export function PhotosFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState<PhotoStatus | "">(searchParams.get("status") as PhotoStatus || "");
  const [quality, setQuality] = useState<PhotoQuality | "">(searchParams.get("quality") as PhotoQuality || "");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | "">(searchParams.get("analysisResult") as AnalysisResult || "");
  const [institutionId, setInstitutionId] = useState(searchParams.get("institutionId") || "");
  const [patientId, setPatientId] = useState(searchParams.get("patientId") || "");
  // 날짜 관련 상태
  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined
  );
  
  // 필터 탭
  const [activeTab, setActiveTab] = useState("basic");
  const [photoType, setPhotoType] = useState(searchParams.get("photoType") || "");
  
  // 필터 적용
  const applyFilter = () => {
    const params = new URLSearchParams();
    
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (quality) params.set("quality", quality);
    if (analysisResult) params.set("analysisResult", analysisResult);
    if (institutionId) params.set("institutionId", institutionId);
    if (patientId) params.set("patientId", patientId);
    if (photoType) params.set("photoType", photoType);
    
    if (startDate) {
      params.set("startDate", format(startDate, "yyyy-MM-dd"));
    }
    
    if (endDate) {
      params.set("endDate", format(endDate, "yyyy-MM-dd"));
    }
    
    router.push(`/dashboard/photos?${params.toString()}`);
  };
  
  // 필터 초기화
  const resetFilter = () => {
    setSearch("");
    setStatus("");
    setQuality("");
    setAnalysisResult("");
    setInstitutionId("");
    setPatientId("");
    setPhotoType("");
    setStartDate(undefined);
    setEndDate(undefined);
    
    router.push("/dashboard/photos");
  };
  
  // 환자 ID가 URL에서 전달된 경우 효과적으로 처리
  useEffect(() => {
    const urlPatientId = searchParams.get("patientId");
    if (urlPatientId && urlPatientId !== patientId) {
      setPatientId(urlPatientId);
    }
    
    const urlInstitutionId = searchParams.get("institutionId");
    if (urlInstitutionId && urlInstitutionId !== institutionId) {
      setInstitutionId(urlInstitutionId);
    }
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">필터</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetFilter}>
            초기화
          </Button>
          <Button onClick={applyFilter}>
            필터 적용
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">기본 필터</TabsTrigger>
          <TabsTrigger value="analysis">분석 필터</TabsTrigger>
          <TabsTrigger value="date">날짜 필터</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">검색어</Label>
              <Input
                id="search"
                placeholder="파일명, 환자코드, 메모"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="photoType">사진 유형</Label>
              <Select
                value={photoType}
                onValueChange={setPhotoType}
              >
                <SelectTrigger id="photoType">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="두정부">두정부</SelectItem>
                  <SelectItem value="전두부">전두부</SelectItem>
                  <SelectItem value="후두부">후두부</SelectItem>
                  <SelectItem value="측두부">측두부</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">상태</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as PhotoStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">대기 중</SelectItem>
                  <SelectItem value="analyzed">분석 완료</SelectItem>
                  <SelectItem value="failed">분석 실패</SelectItem>
                  <SelectItem value="deleted">삭제됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="institutionId">기관</Label>
              <Select
                value={institutionId}
                onValueChange={setInstitutionId}
              >
                <SelectTrigger id="institutionId">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="1">서울대학교병원</SelectItem>
                  <SelectItem value="2">연세세브란스병원</SelectItem>
                  <SelectItem value="3">아산병원</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="patientId">환자 ID</Label>
              <Input
                id="patientId"
                placeholder="환자 ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quality">품질</Label>
              <Select
                value={quality}
                onValueChange={(value) => setQuality(value as PhotoQuality)}
              >
                <SelectTrigger id="quality">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="high">높음</SelectItem>
                  <SelectItem value="medium">중간</SelectItem>
                  <SelectItem value="low">낮음</SelectItem>
                  <SelectItem value="invalid">유효하지 않음</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="analysisResult">분석 결과</Label>
              <Select
                value={analysisResult}
                onValueChange={(value) => setAnalysisResult(value as AnalysisResult)}
              >
                <SelectTrigger id="analysisResult">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="normal">정상</SelectItem>
                  <SelectItem value="abnormal">비정상</SelectItem>
                  <SelectItem value="indeterminate">불확실</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="date" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="mb-2 block">촬영 시작일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP", { locale: ko })
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="endDate" className="mb-2 block">촬영 종료일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP", { locale: ko })
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    locale={ko}
                    disabled={date => !startDate || date < startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={resetFilter}>
          초기화
        </Button>
        <Button onClick={applyFilter}>
          필터 적용
        </Button>
      </div>
    </div>
  );
}
