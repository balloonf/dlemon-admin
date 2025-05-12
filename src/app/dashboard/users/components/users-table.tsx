"use client";

import { useState } from "react";
import { User, UserRole, UserStatus } from "@/lib/definitions";
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
import { deleteUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function UsersTable({ users }: { users: User[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 사용자 상태에 따른 배지 색상 설정
  const getBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "destructive";
      default:
        return "default";
    }
  };

  // 역할에 따른 한글 표시
  const getRoleDisplay = (role: UserRole) => {
    return role === "admin" ? "기관관리자" : "기관사용자";
  };
  
  // 사용자 삭제 대화상자 열기
  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };
  
  // 사용자 삭제 처리
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteUser(userToDelete.id);
      
      toast({
        title: "이용자 삭제 완료",
        description: `${userToDelete.name} 이용자가 삭제되었습니다.`,
      });
      
      // 삭제 후 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("이용자 삭제 오류:", error);
      toast({
        title: "이용자 삭제 실패",
        description: "이용자 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
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
              <TableHead>번호</TableHead>
              <TableHead>기관명</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>아이디</TableHead>
              <TableHead>관리등급</TableHead>
              <TableHead>직업</TableHead>
              <TableHead>휴대폰번호</TableHead>
              <TableHead>등록일시</TableHead>
              <TableHead>등록한사람</TableHead>
              <TableHead>접속여부</TableHead>
              <TableHead className="w-[140px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  등록된 이용자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.institutionName}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{getRoleDisplay(user.role)}</TableCell>
                  <TableCell>{user.jobTitle || "-"}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{user.createdBy || "시스템"}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(user.status) as any}>
                      {user.lastLogin && user.status === "active" ? "로그인" : "미접속"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/users/${user.id}`}>
                        <Button variant="outline" size="sm">
                          보기
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => openDeleteDialog(user)}
                      >
                        삭제
                      </Button>
                    </div>
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
            <DialogTitle>이용자 삭제</DialogTitle>
            <DialogDescription>
              정말로 {userToDelete?.name} 이용자를 삭제하시겠습니까?
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
