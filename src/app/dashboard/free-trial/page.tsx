"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, FileText, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for free trial requests
const freeTrialRequests = [
  {
    id: 1,
    institutionName: "서울대학교병원",
    category: "대학병원",
    contactInfo: "02-2072-2114",
    businessNumber: "123-45-67890",
    businessCertificate: "business_certificate_1.pdf",
    specialistCertificate: "specialist_certificate_1.pdf",
    requestDate: "2024-05-01",
    approved: false,
  },
  {
    id: 2,
    institutionName: "연세대학교 세브란스병원",
    category: "대학병원",
    contactInfo: "02-2228-0000",
    businessNumber: "234-56-78901",
    businessCertificate: "business_certificate_2.pdf",
    specialistCertificate: "specialist_certificate_2.pdf",
    requestDate: "2024-05-03",
    approved: true,
    approvedDate: "2024-05-05",
    trialStartDate: "2024-05-06",
    trialEndDate: "2024-06-06",
  },
  {
    id: 3,
    institutionName: "강남성형외과의원",
    category: "병의원",
    contactInfo: "02-555-1234",
    businessNumber: "345-67-89012",
    businessCertificate: "business_certificate_3.pdf",
    specialistCertificate: "specialist_certificate_3.pdf",
    requestDate: "2024-05-07",
    approved: false,
  },
  {
    id: 4,
    institutionName: "일산헤어클리닉",
    category: "헤어샵",
    contactInfo: "031-123-4567",
    businessNumber: "456-78-90123",
    businessCertificate: "business_certificate_4.pdf",
    specialistCertificate: "specialist_certificate_4.pdf",
    requestDate: "2024-05-08",
    approved: false,
  },
  {
    id: 5,
    institutionName: "부산피부과의원",
    category: "병의원",
    contactInfo: "051-987-6543",
    businessNumber: "567-89-01234",
    businessCertificate: "business_certificate_5.pdf",
    specialistCertificate: "specialist_certificate_5.pdf",
    requestDate: "2024-05-10",
    approved: true,
    approvedDate: "2024-05-12",
    trialStartDate: "2024-05-15",
    trialEndDate: "2024-06-15",
  },
];

export default function FreeTrialPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(2024, 0, 1)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [selectedTrialRequest, setSelectedTrialRequest] = useState<any>(null);
  const [trialPeriod, setTrialPeriod] = useState("1");
  const [periodUnit, setPeriodUnit] = useState("month");

  const filteredRequests = freeTrialRequests.filter((req) => {
    // Date filter
    const reqDate = new Date(req.requestDate);
    const isAfterStart = startDate ? reqDate >= startDate : true;
    const isBeforeEnd = endDate ? reqDate <= endDate : true;
    const dateMatch = isAfterStart && isBeforeEnd;

    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const searchMatch =
      searchQuery === "" ||
      req.institutionName.toLowerCase().includes(searchLower) ||
      req.category.toLowerCase().includes(searchLower) ||
      req.contactInfo.includes(searchQuery) ||
      req.businessNumber.includes(searchQuery);

    return dateMatch && searchMatch;
  });

  const handleApprovalClick = (request: any) => {
    setSelectedTrialRequest(request);
    setApprovalDialog(true);
  };

  const handleApproval = () => {
    // In a real app, here you would send an API request to approve the free trial
    console.log("Approving free trial with period:", trialPeriod, periodUnit);
    console.log("Request data:", selectedTrialRequest);
    
    // Close the dialog
    setApprovalDialog(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">무료체험 관리</h2>
        <p className="text-muted-foreground">
          기관의 무료체험 신청 목록을 조회하고 승인할 수 있습니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>무료체험 신청 목록</CardTitle>
          <CardDescription>
            등록된 무료체험 신청 내역을 조회하고 관리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="date-range">기간 선택</Label>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal md:w-[200px]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "yyyy-MM-dd") : "시작일"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-muted-foreground">~</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal md:w-[200px]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "yyyy-MM-dd") : "종료일"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid flex-1 gap-2">
              <Label htmlFor="search">검색</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="기관명, 카테고리, 연락처, 사업자번호 검색"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>기관명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>기관정보(연락처)</TableHead>
                  <TableHead>사업자번호</TableHead>
                  <TableHead>사업자등록증</TableHead>
                  <TableHead>피부과 전문의자격증</TableHead>
                  <TableHead>승인 요청일</TableHead>
                  <TableHead>승인 상태</TableHead>
                  <TableHead>무료체험 기간</TableHead>
                  <TableHead className="text-right">승인</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.institutionName}
                      </TableCell>
                      <TableCell>{request.category}</TableCell>
                      <TableCell>{request.contactInfo}</TableCell>
                      <TableCell>{request.businessNumber}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">
                            View business certificate
                          </span>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">
                            View specialist certificate
                          </span>
                        </Button>
                      </TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        {request.approved ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <Check className="mr-1 h-3 w-3" />
                            승인됨
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            대기중
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.approved
                          ? `${request.trialStartDate} ~ ${request.trialEndDate}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {!request.approved && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprovalClick(request)}
                          >
                            승인
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>무료체험 승인</DialogTitle>
            <DialogDescription>
              {selectedTrialRequest?.institutionName}의 무료체험 신청을 승인합니다.
              사용 기간을 설정해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="trial-period">무료체험 기간</Label>
                <Input
                  id="trial-period"
                  type="number"
                  min="1"
                  value={trialPeriod}
                  onChange={(e) => setTrialPeriod(e.target.value)}
                />
              </div>
              <div className="grid flex-1 gap-2">
                <Label htmlFor="period-unit">단위</Label>
                <Select
                  value={periodUnit}
                  onValueChange={setPeriodUnit}
                >
                  <SelectTrigger id="period-unit">
                    <SelectValue placeholder="단위 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">주</SelectItem>
                    <SelectItem value="month">개월</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialog(false)}>
              취소
            </Button>
            <Button onClick={handleApproval}>승인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
