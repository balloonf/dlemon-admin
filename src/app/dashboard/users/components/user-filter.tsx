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
import { Institution } from "@/lib/definitions";

interface UserFilterProps {
  institutions: Institution[];
}

export function UserFilter({ institutions }: UserFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 현재 URL 검색 파라미터 가져오기
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "all";
  const role = searchParams.get("role") || "all";
  const institution = searchParams.get("institution") || "all";
  
  // 로컬 상태
  const [searchQuery, setSearchQuery] = useState(query);
  const [statusFilter, setStatusFilter] = useState(status);
  const [roleFilter, setRoleFilter] = useState(role);
  const [institutionFilter, setInstitutionFilter] = useState(institution);
  
  // URL 검색 파라미터가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setSearchQuery(query);
    setStatusFilter(status);
    setRoleFilter(role);
    setInstitutionFilter(institution);
  }, [query, status, role, institution]);
  
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
  
  // 날짜 상태 관리
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // 필터 적용 함수
  const applyFilters = () => {
    router.push(
      `/dashboard/users?${createQueryString({
        query: searchQuery,
        status: statusFilter,
        role: roleFilter,
        institution: institutionFilter,
        startDate: startDate,
        endDate: endDate,
      })}`
    );
  };
  
  // 필터 초기화 함수
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRoleFilter("all");
    setInstitutionFilter("all");
    setStartDate("");
    setEndDate("");
    
    router.push("/dashboard/users");
  };
  
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="font-medium">이용자 검색 필터</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="text-sm font-medium min-w-[80px] pt-2">
            기간 설정
          </label>
          <div className="flex-1 flex flex-col sm:flex-row gap-2 items-center">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-auto"
            />
            <span className="mx-2">~</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="search" className="text-sm font-medium">
              검색어
            </label>
            <Input
              id="search"
              placeholder="이름, 아이디 또는 연락처"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
            <label htmlFor="role" className="text-sm font-medium">
              관리등급
            </label>
            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="전체 등급" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 등급</SelectItem>
                <SelectItem value="admin">기관관리자</SelectItem>
                <SelectItem value="member">기관사용자</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="active">승인됨</SelectItem>
                <SelectItem value="pending">미승인</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
