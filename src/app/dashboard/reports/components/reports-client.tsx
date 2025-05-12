"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn, formatDate } from "@/lib/utils";
import { useState } from "react";
import { ReportStatistics } from "./report-statistics";
import { ReportFilter } from "./report-filter";

type Report = {
  id: number;
  institution: string;
  patientId: string;
  patientName: string;
  gender: string;
  birthDate: string;
  phone: string;
  firstVisit: string;
  lastVisit: string;
};

interface ReportsClientProps {
  initialReports: Report[];
}

export function ReportsClient({ initialReports }: ReportsClientProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  // 검색 필터링 함수
  const filteredReports = initialReports.filter((report) => {
    const matchesSearch =
      searchQuery === "" ||
      report.patientName.includes(searchQuery) ||
      report.patientId.includes(searchQuery) ||
      report.phone.includes(searchQuery);

    // 날짜 범위 필터링
    const reportLastVisit = new Date(report.lastVisit);
    const isAfterStart = !startDate || reportLastVisit >= startDate;
    const isBeforeEnd = !endDate || reportLastVisit <= endDate;

    return matchesSearch && isAfterStart && isBeforeEnd;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">리포트 관리</h1>
      </div>

      <div className="bg-white p-6 rounded-md shadow">
        {/* 기간 필터 및 검색 영역 */}
        <ReportFilter
          startDate={startDate}
          endDate={endDate}
          searchQuery={searchQuery}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setSearchQuery={setSearchQuery}
          onSearch={() => console.log("검색 실행")}
        />

        {/* 리포트 목록 테이블 */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center">번호</TableHead>
                <TableHead>기관명</TableHead>
                <TableHead>고유번호</TableHead>
                <TableHead>환자명</TableHead>
                <TableHead className="w-[60px] text-center">성별</TableHead>
                <TableHead>생년월일</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>최초진료</TableHead>
                <TableHead>마지막진료</TableHead>
                <TableHead className="w-[100px] text-center">상세보기</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="text-center">{report.id}</TableCell>
                  <TableCell>{report.institution}</TableCell>
                  <TableCell>{report.patientId}</TableCell>
                  <TableCell>{report.patientName}</TableCell>
                  <TableCell className="text-center">{report.gender}</TableCell>
                  <TableCell>{formatDate(report.birthDate, "yyyy-MM-dd")}</TableCell>
                  <TableCell>{report.phone}</TableCell>
                  <TableCell>{formatDate(report.firstVisit, "yyyy-MM-dd")}</TableCell>
                  <TableCell>{formatDate(report.lastVisit, "yyyy-MM-dd")}</TableCell>
                  <TableCell className="text-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/reports/${report.id}`}>보기</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 페이지네이션 */}
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* 리포트 통계 */}
      <div className="mt-8">
        <ReportStatistics />
      </div>
    </div>
  );
}
