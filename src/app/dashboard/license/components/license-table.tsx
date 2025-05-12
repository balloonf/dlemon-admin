"use client";

import { useState } from "react";
import { License, LicenseStatus, LicenseType } from "@/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, PlayCircle, PauseCircle, RotateCcw, AlertOctagon } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { deleteLicense, updateLicenseStatus } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { LicenseCancelDialog } from "./license-cancel-dialog";

export function LicenseTable({ licenses }: { licenses: License[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [licenseToUpdateStatus, setLicenseToUpdateStatus] = useState<License | null>(null);
  const [newStatus, setNewStatus] = useState<LicenseStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 라이선스 상태에 따른 배지 색상 설정
  const getBadgeVariant = (status: LicenseStatus) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "expired":
        return "destructive";
      case "canceled":
        return "outline";
      default:
        return "default";
    }
  };

  // 라이선스 유형에 따른 한글 표시
  const getTypeDisplay = (type: LicenseType) => {
    switch (type) {
      case "trial":
        return "무료체험";
      case "standard":
        return "표준";
      case "premium":
        return "프리미엄";
      default:
        return type;
    }
  };
  
  // 라이선스 상태에 따른 한글 표시
  const getStatusDisplay = (status: LicenseStatus) => {
    switch (status) {
      case "active":
        return "활성";
      case "pending":
        return "대기중";
      case "expired":
        return "만료";
      case "canceled":
        return "취소";
      default:
        return status;
    }
  };
  
  // 사용량 퍼센트 계산
  const calculateUsagePercent = (current: number, max: number) => {
    return Math.min(100, Math.round((current / max) * 100));
  };
  
  // 라이선스 삭제 대화상자 열기
  const openDeleteDialog = (license: License) => {
    setLicenseToDelete(license);
    setIsDeleteDialogOpen(true);
  };
  
  // 라이선스 상태 변경 대화상자 열기
  const openStatusDialog = (license: License, status: LicenseStatus) => {
    setLicenseToUpdateStatus(license);
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };
  
  // 라이선스 삭제 처리
  const handleDeleteLicense = async () => {
    if (!licenseToDelete) return;
    
    try {
      setIsProcessing(true);
      await deleteLicense(licenseToDelete.id);
      
      toast({
        title: "라이선스 삭제 완료",
        description: `${licenseToDelete.institutionName}의 라이선스가 삭제되었습니다.`,
      });
      
      // 삭제 후 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("라이선스 삭제 오류:", error);
      toast({
        title: "라이선스 삭제 실패",
        description: "라이선스 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
      setLicenseToDelete(null);
    }
  };
  
  // 라이선스 상태 변경 처리
  const handleUpdateStatus = async () => {
    if (!licenseToUpdateStatus || !newStatus) return;
    
    try {
      setIsProcessing(true);
      await updateLicenseStatus(licenseToUpdateStatus.id, newStatus);
      
      toast({
        title: "라이선스 상태 변경 완료",
        description: `${licenseToUpdateStatus.institutionName}의 라이선스 상태가 ${getStatusDisplay(newStatus)}(으)로 변경되었습니다.`,
      });
      
      // 상태 변경 후 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("라이선스 상태 변경 오류:", error);
      toast({
        title: "라이선스 상태 변경 실패",
        description: "라이선스 상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsStatusDialogOpen(false);
      setLicenseToUpdateStatus(null);
      setNewStatus(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>기관명</TableHead>
              <TableHead>라이선스 유형</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>시작일</TableHead>
              <TableHead>만료일</TableHead>
              <TableHead>사용자 사용량</TableHead>
              <TableHead>사진 사용량</TableHead>
              <TableHead>리포트 사용량</TableHead>
              <TableHead className="w-[80px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  등록된 라이선스가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              licenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell>{license.institutionName}</TableCell>
                  <TableCell>{getTypeDisplay(license.type)}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(license.status) as any}>
                      {getStatusDisplay(license.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(license.startDate)}</TableCell>
                  <TableCell>{formatDate(license.expiryDate)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{license.currentUsers}</span>
                        <span>{license.maxUsers}</span>
                      </div>
                      <Progress value={calculateUsagePercent(license.currentUsers, license.maxUsers)} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{license.currentPhotos}</span>
                        <span>{license.maxPhotos}</span>
                      </div>
                      <Progress value={calculateUsagePercent(license.currentPhotos, license.maxPhotos)} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{license.currentReports}</span>
                        <span>{license.maxReports}</span>
                      </div>
                      <Progress value={calculateUsagePercent(license.currentReports, license.maxReports)} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">메뉴 열기</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>라이선스 관리</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/license/${license.id}`}>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            수정
                          </DropdownMenuItem>
                        </Link>
                        
                        {license.status !== "active" && (
                          <DropdownMenuItem
                            onClick={() => openStatusDialog(license, "active")}
                          >
                            <PlayCircle className="mr-2 h-4 w-4" />
                            활성화
                          </DropdownMenuItem>
                        )}
                        
                        {license.status === "active" && (
                          <DropdownMenuItem
                            onClick={() => openStatusDialog(license, "inactive")}
                          >
                            <PauseCircle className="mr-2 h-4 w-4" />
                            일시중지
                          </DropdownMenuItem>
                        )}
                        
                        {license.status === "expired" && (
                          <DropdownMenuItem
                            onClick={() => openStatusDialog(license, "active")}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            갱신
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        <LicenseCancelDialog license={license}>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <AlertOctagon className="mr-2 h-4 w-4" />
                            라이선스 취소
                          </DropdownMenuItem>
                        </LicenseCancelDialog>
                        
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => openDeleteDialog(license)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* 삭제 확인 대화상자 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>라이선스 삭제</DialogTitle>
            <DialogDescription>
              정말로 {licenseToDelete?.institutionName}의 라이선스를 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteLicense}
              disabled={isProcessing}
            >
              {isProcessing ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 상태 변경 확인 대화상자 */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>라이선스 상태 변경</DialogTitle>
            <DialogDescription>
              {licenseToUpdateStatus?.institutionName}의 라이선스 상태를 
              {newStatus && ` '${getStatusDisplay(newStatus)}'(으)로 `}
              변경하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              variant="default"
              onClick={handleUpdateStatus}
              disabled={isProcessing}
            >
              {isProcessing ? "처리 중..." : "확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
