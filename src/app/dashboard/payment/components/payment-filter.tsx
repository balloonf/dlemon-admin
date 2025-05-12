"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Institution } from "@/lib/definitions";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PaymentFilterProps {
  institutions: Institution[];
}

export function PaymentFilter({ institutions }: PaymentFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [institutionId, setInstitutionId] = useState(searchParams.get("institution") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [method, setMethod] = useState(searchParams.get("method") || "all");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [query, setQuery] = useState(searchParams.get("query") || "");
  
  useEffect(() => {
    setInstitutionId(searchParams.get("institution") || "all");
    setStatus(searchParams.get("status") || "all");
    setMethod(searchParams.get("method") || "all");
    setStartDate(searchParams.get("startDate") || "");
    setEndDate(searchParams.get("endDate") || "");
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);
  
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (institutionId !== "all") params.set("institution", institutionId);
    if (status !== "all") params.set("status", status);
    if (method !== "all") params.set("method", method);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleReset = () => {
    setInstitutionId("all");
    setStatus("all");
    setMethod("all");
    setStartDate("");
    setEndDate("");
    setQuery("");
    router.push(pathname);
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="institution">기관</Label>
            <Select
              value={institutionId}
              onValueChange={setInstitutionId}
            >
              <SelectTrigger id="institution">
                <SelectValue placeholder="모든 기관" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 기관</SelectItem>
                {institutions.map((institution) => (
                  <SelectItem key={institution.id} value={institution.id}>
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">결제 상태</Label>
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="모든 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="ready">결제 대기</SelectItem>
                <SelectItem value="paid">결제 완료</SelectItem>
                <SelectItem value="canceled">취소됨</SelectItem>
                <SelectItem value="failed">결제 실패</SelectItem>
                <SelectItem value="refunded">환불 완료</SelectItem>
                <SelectItem value="partial_refunded">부분 환불</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="method">결제 방법</Label>
            <Select
              value={method}
              onValueChange={setMethod}
            >
              <SelectTrigger id="method">
                <SelectValue placeholder="모든 방법" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 방법</SelectItem>
                <SelectItem value="card">신용카드</SelectItem>
                <SelectItem value="bank">계좌이체</SelectItem>
                <SelectItem value="vbank">가상계좌</SelectItem>
                <SelectItem value="phone">휴대폰</SelectItem>
                <SelectItem value="point">포인트</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">시작일</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">종료일</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="search">검색</Label>
            <div className="flex space-x-2">
              <Input
                id="search"
                placeholder="기관명, 결제 ID, 주문 번호, 설명"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                size="icon"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            초기화
          </Button>
          <Button onClick={handleSearch}>
            검색
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
