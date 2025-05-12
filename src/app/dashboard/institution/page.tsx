"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Search, 
  CheckCircle,
  XCircle
} from "lucide-react";

// UI Components
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
import { Badge } from "@/components/ui/badge";

// Import data service
import { InstitutionService } from "@/services/institution-service";
import { Institution } from "@/types/institution";

export default function InstitutionPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(2024, 0, 1)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    institutionId: 0,
    action: "approve" as const
  });

  // Fetch institutions on component mount
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(true);
        const data = await InstitutionService.getAll();
        setInstitutions(data);
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const filteredInstitutions = institutions.filter((inst) => {
    // Date filter
    const regDate = new Date(inst.registrationDate);
    const isAfterStart = startDate ? regDate >= startDate : true;
    const isBeforeEnd = endDate ? regDate <= endDate : true;
    const dateMatch = isAfterStart && isBeforeEnd;

    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const searchMatch =
      searchQuery === "" ||
      inst.name.toLowerCase().includes(searchLower) ||
      inst.category.toLowerCase().includes(searchLower) ||
      inst.representative.toLowerCase().includes(searchLower) ||
      inst.contactInfo.includes(searchQuery) ||
      inst.businessNumber.includes(searchQuery);

    return dateMatch && searchMatch;
  });

  const handleViewDetails = (id: number) => {
    router.push(`/dashboard/institution/${id}`);
  };

  const handleApprove = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      institutionId: id,
      action: "approve"
    });
  };

  const confirmApprove = async () => {
    try {
      const updatedInstitution = await InstitutionService.approve(confirmDialog.institutionId);
      
      if (updatedInstitution) {
        // Update the local state with the new data
        setInstitutions(institutions.map(inst => 
          inst.id === confirmDialog.institutionId ? updatedInstitution : inst
        ));
        
        alert(`기관 ID ${confirmDialog.institutionId}의 승인이 완료되었습니다.`);
      }
    } catch (error) {
      console.error("Failed to approve institution:", error);
      alert("기관 승인 처리 중 오류가 발생했습니다.");
    } finally {
      setConfirmDialog({
        isOpen: false,
        institutionId: 0,
        action: "approve"
      });
    }
  };

  const getLicenseStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            사용중
          </Badge>
        );
      case "trial":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            무료체험
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            만료됨
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            미설정
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">기관 관리</h2>
        <p className="text-muted-foreground">
          등록된 기관 정보를 관리하고 서비스 이용 현황을 확인할 수 있습니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기관 목록</CardTitle>
          <CardDescription>
            등록된 기관 목록을 조회하고 관리합니다.
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
                      {startDate ? format(startDate, "yyyy.MM.dd") : "시작일"}
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
                      {endDate ? format(endDate, "yyyy.MM.dd") : "종료일"}
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
                  placeholder="기관명, 카테고리, 대표자, 연락처, 사업자번호 검색"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-[60px] text-center">번호</TableHead>
                  <TableHead>기관명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>기관정보</TableHead>
                  <TableHead>기관연락처</TableHead>
                  <TableHead>기관승인여부</TableHead>
                  <TableHead>라이선스 상태</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin mr-2 h-4 w-4 rounded-full border-b-2 border-t-2 border-primary"></div>
                        <span>데이터를 불러오는 중입니다...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredInstitutions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInstitutions.map((institution, index) => (
                    <TableRow key={institution.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium"
                          onClick={() => handleViewDetails(institution.id)}
                        >
                          {institution.name}
                        </Button>
                      </TableCell>
                      <TableCell>{institution.category}</TableCell>
                      <TableCell>{institution.representative}</TableCell>
                      <TableCell>{institution.contactInfo}</TableCell>
                      <TableCell>
                        {institution.status === "approved" ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            승인됨
                          </span>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7"
                            onClick={() => handleApprove(institution.id)}
                          >
                            <CheckCircle className="mr-1 h-3.5 w-3.5" />
                            승인
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        {getLicenseStatusBadge(institution.licenseStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            onClick={() => handleViewDetails(institution.id)}
                          >
                            상세 관리
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            onClick={() => router.push(`/dashboard/license?institutionId=${institution.id}`)}
                          >
                            라이선스 관리
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog({
              isOpen: false,
              institutionId: 0,
              action: "approve"
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>기관 승인</DialogTitle>
            <DialogDescription>
              이 기관을 승인하시겠습니까? 승인 후 기관은 서비스를 이용할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setConfirmDialog({
                  isOpen: false,
                  institutionId: 0,
                  action: "approve"
                });
              }}
            >
              취소
            </Button>
            <Button onClick={confirmApprove}>
              승인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}