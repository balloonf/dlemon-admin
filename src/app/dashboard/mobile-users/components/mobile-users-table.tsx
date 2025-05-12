"use client";

import { useState } from "react";
import { MobileUser, MobileUserStatus } from "@/lib/definitions";
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
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { deleteMobileUser } from "@/lib/mobile-api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function MobileUsersTable({ mobileUsers }: { mobileUsers: MobileUser[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<MobileUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 사용자 상태에 따른 배지 색상 설정
  const getBadgeVariant = (status: MobileUserStatus) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "secondary";
      case "blocked":
        return "destructive";
      default:
        return "default";
    }
  };

  // 사용자 상태에 따른 한글 표시
  const getStatusDisplay = (status: MobileUserStatus) => {
    switch (status) {
      case "active":
        return "활성";
      case "pending":
        return "대기중";
      case "inactive":
        return "비활성";
      case "blocked":
        return "차단됨";
      default:
        return status;
    }
  };
  
  // 사용량 표시 형식 (사용/전체)
  const getUsageDisplay = (usage: number, total: number) => {
    const isOverLimit = usage > total;
    return (
      <span className={isOverLimit ? "text-destructive font-semibold" : "text-primary"}>
        {usage} / {total}
      </span>
    );
  };
  
  // 사용자 삭제 대화상자 열기
  const openDeleteDialog = (user: MobileUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };
  
  // 사용자 삭제 처리
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteMobileUser(userToDelete.id);
      
      toast({
        title: "Mobile앱 사용자 삭제 완료",
        description: `${userToDelete.name} 사용자가 삭제되었습니다.`,
      });
      
      // 삭제 후 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("Mobile앱 사용자 삭제 오류:", error);
      toast({
        title: "Mobile앱 사용자 삭제 실패",
        description: "사용자 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>기관명</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>아이디</TableHead>
              <TableHead>휴대폰번호</TableHead>
              <TableHead>라이선스</TableHead>
              <TableHead>디바이스번호(UDID)</TableHead>
              <TableHead>사용현황(사용/전체)</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>마지막 접속</TableHead>
              <TableHead className="w-[80px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mobileUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6">
                  등록된 Mobile앱 사용자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              mobileUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.institutionName}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.licenseType === "premium" ? "프리미엄" : 
                      user.licenseType === "standard" ? "스탠다드" : "체험판"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{user.deviceId}</TableCell>
                  <TableCell>{getUsageDisplay(user.usageCount, user.totalCount)}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(user.status) as any}>
                      {getStatusDisplay(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastAccess ? formatDate(user.lastAccess) : "-"}
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
                        <DropdownMenuLabel>사용자 관리</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/mobile-users/${user.id}`}>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            수정
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => openDeleteDialog(user)}
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
            <DialogTitle>Mobile앱 사용자 삭제</DialogTitle>
            <DialogDescription>
              정말로 {userToDelete?.name} 사용자를 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
