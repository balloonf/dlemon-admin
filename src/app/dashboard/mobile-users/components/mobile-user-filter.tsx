"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Institution, License } from "@/lib/definitions";

interface MobileUserFilterProps {
  institutions: Institution[];
  licenses: License[];
}

export function MobileUserFilter({ institutions, licenses }: MobileUserFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 현재 URL 검색 파라미터 가져오기
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "all";
  const institution = searchParams.get("institution") || "all";
  const licenseType = searchParams.get("licenseType") || "all";
  
  // 로컬 상태
  const [searchQuery, setSearchQuery] = useState(query);
  const [statusFilter, setStatusFilter] = useState(status);
  const [institutionFilter, setInstitutionFilter] = useState(institution);
  const [licenseFilter, setLicenseFilter] = useState(licenseType);
  
  // URL 검색 파라미터가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setSearchQuery(query);
    setStatusFilter(status);
    setInstitutionFilter(institution);
    setLicenseFilter(licenseType);
  }, [query, status, institution, licenseType]);
  
  // URL 검색 파라미터 업데이트 함수
  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      
      // 새 파라미터로 업데이트
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });
      
      // 페이지가 변경되면 페이지 번호 초기화
      if (Object.keys(params).some(key => key !== "page")) {
        newSearchParams.delete("page");
      }
      
      return newSearchParams.toString();
    },
    [searchParams]
  );
  
  // 필터 적용 함수
  const applyFilters = () => {
    router.push(
      `/dashboard/mobile-users?${createQueryString({
        query: searchQuery,
        status: statusFilter,
        institution: institutionFilter,
        licenseType: licenseFilter,
      })}`
    );
  };
  
  // 필터 초기화 함수
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setInstitutionFilter("all");
    setLicenseFilter("all");
    
    router.push("/dashboard/mobile-users");
  };
  
  // 라이선스 유형 목록 (중복 제거)
  const licenseTypes = Array.from(new Set(licenses.map(license => license.type)));
  
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="font-medium">Mobile앱 사용자 검색 필터</h2>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="search" className="text-sm font-medium">
            검색어
          </label>
          <Input
            id="search"
            placeholder="이름, 아이디, 디바이스 ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="text-sm font-medium">
            상태
          </label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="전체 상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
              <SelectItem value="pending">대기중</SelectItem>
              <SelectItem value="blocked">차단됨</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="institution" className="text-sm font-medium">
            소속기관
          </label>
          <Select
            value={institutionFilter}
            onValueChange={(value) => setInstitutionFilter(value)}
          >
            <SelectTrigger id="institution">
              <SelectValue placeholder="전체 기관" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 기관</SelectItem>
              {institutions.map((inst) => (
                <SelectItem key={inst.id} value={inst.id}>
                  {inst.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="licenseType" className="text-sm font-medium">
            라이선스 유형
          </label>
          <Select
            value={licenseFilter}
            onValueChange={(value) => setLicenseFilter(value)}
          >
            <SelectTrigger id="licenseType">
              <SelectValue placeholder="전체 라이선스" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 라이선스</SelectItem>
              <SelectItem value="premium">프리미엄</SelectItem>
              <SelectItem value="standard">스탠다드</SelectItem>
              <SelectItem value="trial">체험판</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={resetFilters}>
          초기화
        </Button>
        <Button onClick={applyFilters}>
          적용
        </Button>
      </div>
    </div>
  );
}
