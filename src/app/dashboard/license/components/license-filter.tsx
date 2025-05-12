"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Institution, LicenseStatus, LicenseType } from "@/lib/definitions";
import { Search, X } from "lucide-react";

export function LicenseFilter({
  institutions,
}: {
  institutions: Institution[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [institution, setInstitution] = useState(searchParams.get("institution") || "all");

  // URL 파라미터 업데이트 함수
  const createQueryString = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    // 페이지 파라미터 초기화
    newParams.delete("page");
    
    return newParams.toString();
  };

  // 필터 적용
  const applyFilter = () => {
    const queryString = createQueryString({
      query: search,
      status,
      type,
      institution,
    });
    
    replace(`${pathname}?${queryString}`);
  };

  // 필터 초기화
  const resetFilter = () => {
    setSearch("");
    setStatus("all");
    setType("all");
    setInstitution("all");
    
    replace(pathname);
  };

  // 상태 변경 시 필터 자동 적용
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      applyFilter();
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [status, type, institution]);

  return (
    <div className="rounded-md border p-4 bg-background shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="라이선스 또는 기관명 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyFilter();
                }
              }}
            />
          </div>
          <Button variant="outline" size="icon" onClick={applyFilter}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="active">활성</SelectItem>
            <SelectItem value="expired">만료</SelectItem>
            <SelectItem value="pending">대기중</SelectItem>
            <SelectItem value="canceled">취소</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={type}
          onValueChange={setType}
        >
          <SelectTrigger>
            <SelectValue placeholder="유형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 유형</SelectItem>
            <SelectItem value="trial">무료체험</SelectItem>
            <SelectItem value="standard">표준</SelectItem>
            <SelectItem value="premium">프리미엄</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={institution}
          onValueChange={setInstitution}
        >
          <SelectTrigger>
            <SelectValue placeholder="기관 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 기관</SelectItem>
            {institutions.map((inst) => (
              <SelectItem key={inst.id} value={inst.id}>
                {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={resetFilter}
        >
          <X className="mr-2 h-4 w-4" />
          필터 초기화
        </Button>
      </div>
    </div>
  );
}
