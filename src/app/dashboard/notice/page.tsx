"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Search,
  Filter,
  FileText,
  Trash2,
  Edit,
  Pin,
  EyeIcon,
} from "lucide-react";

import { getNotices } from "@/lib/api";
import { Notice, NoticeStatus } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { NoticeForm } from "./notice-form";
import { NoticeDetail } from "./notice-detail";
import { DeleteConfirm } from "./delete-confirm";

// 상태에 따른 배지 스타일
const getStatusBadge = (status: NoticeStatus) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">게시중</Badge>;
    case "inactive":
      return <Badge className="bg-gray-500">비게시</Badge>;
    case "draft":
      return <Badge variant="outline">임시저장</Badge>;
    case "scheduled":
      return <Badge className="bg-blue-500">예약게시</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function NoticePage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [totalNotices, setTotalNotices] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all_statuses");
  const [targetFilter, setTargetFilter] = useState<string>("all_targets");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const pageSize = 10;

  // 데이터 로드 함수
  const loadNotices = async () => {
    setIsLoading(true);
    try {
      // 필터 값 처리
      const statusParam = statusFilter === "all_statuses" ? "" : statusFilter;
      const targetParam = targetFilter === "all_targets" ? "" : targetFilter;
      
      const { notices, total } = await getNotices({
        search: searchQuery,
        status: statusParam,
        target: targetParam,
        page: currentPage,
        limit: pageSize,
      });
      setNotices(notices);
      setTotalNotices(total);
    } catch (error) {
      console.error("공지사항을 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로드 및 필터 변경 시 재로드
  useEffect(() => {
    loadNotices();
  }, [currentPage, searchQuery, statusFilter, targetFilter]);

  // 공지사항 상세보기
  const handleViewNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsDetailOpen(true);
  };

  // 공지사항 등록 폼 열기
  const handleAddNotice = () => {
    setSelectedNotice(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  // 공지사항 수정 폼 열기
  const handleEditNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  // 공지사항 저장 완료 후 처리
  const handleSaveComplete = () => {
    setIsFormOpen(false);
    loadNotices();
  };

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalNotices / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">공지사항 관리</h1>
        <Button onClick={handleAddNotice}>
          <PlusCircle className="mr-2 h-4 w-4" />
          공지사항 등록
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="제목, 내용으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            onClick={() => loadNotices()}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_statuses">전체</SelectItem>
            <SelectItem value="active">게시중</SelectItem>
            <SelectItem value="inactive">비게시</SelectItem>
            <SelectItem value="draft">임시저장</SelectItem>
            <SelectItem value="scheduled">예약게시</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={targetFilter}
          onValueChange={(value) => setTargetFilter(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="대상 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_targets">전체</SelectItem>
            <SelectItem value="all">전체 사용자</SelectItem>
            <SelectItem value="institution">특정 기관</SelectItem>
            <SelectItem value="user">특정 사용자</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">번호</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-[100px] text-center">상태</TableHead>
              <TableHead className="w-[120px] text-center">게시 기간</TableHead>
              <TableHead className="w-[100px] text-center">대상</TableHead>
              <TableHead className="w-[80px] text-center">조회수</TableHead>
              <TableHead className="w-[120px] text-center">등록일</TableHead>
              <TableHead className="w-[120px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  데이터를 불러오는 중입니다...
                </TableCell>
              </TableRow>
            ) : notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  공지사항이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice, index) => (
                <TableRow key={notice.id}>
                  <TableCell className="text-center">
                    {totalNotices - (currentPage - 1) * pageSize - index}
                  </TableCell>
                  <TableCell>
                    <div 
                      className="flex items-center hover:text-blue-700 hover:underline cursor-pointer"
                      onClick={() => handleViewNotice(notice)}
                    >
                      {notice.isPinned && (
                        <Pin className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      {notice.title}
                      {notice.attachments && notice.attachments.length > 0 && (
                        <FileText className="ml-2 h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(notice.status)}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {notice.startDate && notice.endDate
                      ? `${formatDate(notice.startDate)} ~ ${formatDate(notice.endDate)}`
                      : notice.startDate
                      ? `${formatDate(notice.startDate)}부터`
                      : notice.endDate
                      ? `${formatDate(notice.endDate)}까지`
                      : "상시"}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {notice.target === "all"
                      ? "전체"
                      : notice.target === "institution"
                      ? "기관"
                      : "사용자"}
                  </TableCell>
                  <TableCell className="text-center">{notice.viewCount}</TableCell>
                  <TableCell className="text-center text-sm">
                    {formatDate(notice.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>공지사항 관리</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewNotice(notice)}>
                          <EyeIcon className="mr-2 h-4 w-4" />
                          <span>상세보기</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditNotice(notice)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>수정</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            setSelectedNotice(notice);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>삭제</span>
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

      {totalPages > 1 && (
        <Pagination className="mx-auto">
          <PaginationContent>
            <PaginationItem className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Math.max(1, currentPage - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              
              // 현재 페이지가 3보다 크면 페이지 번호 조정
              if (currentPage > 3 && totalPages > 5) {
                pageNum = currentPage - 3 + i + 1;
                
                // 마지막 페이지 근처에서 조정
                if (pageNum > totalPages) {
                  pageNum = totalPages - 5 + i + 1;
                }
                
                // 페이지 번호가 1보다 작으면 1로 설정
                if (pageNum < 1) {
                  pageNum = i + 1;
                }
              }
              
              // 페이지 번호가 총 페이지 수를 초과하지 않도록
              if (pageNum <= totalPages) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(totalPages);
                    }}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            
            <PaginationItem className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Math.min(totalPages, currentPage + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* 공지사항 상세보기 다이얼로그 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedNotice && <NoticeDetail notice={selectedNotice} />}
        </DialogContent>
      </Dialog>

      {/* 공지사항 등록/수정 다이얼로그 */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "공지사항 수정" : "공지사항 등록"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "공지사항 내용을 수정하세요."
                : "새로운 공지사항을 등록하세요."}
            </DialogDescription>
          </DialogHeader>
          <NoticeForm 
            notice={selectedNotice} 
            isEditing={isEditing} 
            onSaveComplete={handleSaveComplete} 
          />
        </DialogContent>
      </Dialog>

      {/* 공지사항 삭제 확인 다이얼로그 */}
      {selectedNotice && (
        <DeleteConfirm
          notice={selectedNotice}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onDeleteComplete={loadNotices}
        />
      )}
    </div>
  );
}
