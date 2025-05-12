"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Filter,
  FileText,
} from "lucide-react";

import { getFaqs } from "@/lib/api";
import { Faq, FaqCategory, FaqStatus } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { FaqForm } from "./faq-form";
import { FaqDetail } from "./faq-detail";
import { DeleteConfirm } from "./delete-confirm";

// 카테고리 표시 함수
const getCategoryLabel = (category: FaqCategory) => {
  switch (category) {
    case "general":
      return "일반";
    case "account":
      return "계정";
    case "service":
      return "서비스";
    case "payment":
      return "결제";
    case "technical":
      return "기술";
    case "etc":
      return "기타";
    default:
      return category;
  }
};

// 상태에 따른 배지 스타일
const getStatusBadge = (status: FaqStatus) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">게시중</Badge>;
    case "inactive":
      return <Badge className="bg-gray-500">비게시</Badge>;
    case "draft":
      return <Badge variant="outline">임시저장</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function FaqPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [totalFaqs, setTotalFaqs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const pageSize = 10;

  // 데이터 로드 함수
  const loadFaqs = async () => {
    setIsLoading(true);
    try {
      const { faqs, total } = await getFaqs({
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter,
        page: currentPage,
        limit: pageSize,
      });
      
      setFaqs(faqs);
      setTotalFaqs(total);
      
      // 첫번째 FAQ는 기본적으로 펼쳐서 보여줌
      if (faqs.length > 0 && !expandedFaqId) {
        setExpandedFaqId(faqs[0].id);
      }
    } catch (error) {
      console.error("FAQ를 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로드 및 필터 변경 시 재로드
  useEffect(() => {
    loadFaqs();
  }, [currentPage, categoryFilter, statusFilter]);

  // 검색 실행
  const handleSearch = () => {
    setCurrentPage(1);
    loadFaqs();
  };

  // FAQ 등록 폼 열기
  const handleAddFaq = () => {
    setSelectedFaq(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  // FAQ 수정 폼 열기
  const handleEditFaq = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  // FAQ 저장 완료 후 처리
  const handleSaveComplete = () => {
    setIsFormOpen(false);
    loadFaqs();
  };

  // FAQ 상세보기
  const handleViewFaq = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsDetailOpen(true);
  };

  // FAQ 토글 (아코디언)
  const toggleFaq = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
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
  const totalPages = Math.ceil(totalFaqs / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">FAQ 관리</h1>
        <Button onClick={handleAddFaq}>
          <PlusCircle className="mr-2 h-4 w-4" />
          FAQ 등록
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="질문, 답변으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button type="button" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 카테고리</SelectItem>
            <SelectItem value="general">일반</SelectItem>
            <SelectItem value="account">계정</SelectItem>
            <SelectItem value="service">서비스</SelectItem>
            <SelectItem value="payment">결제</SelectItem>
            <SelectItem value="technical">기술</SelectItem>
            <SelectItem value="etc">기타</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="active">게시중</SelectItem>
            <SelectItem value="inactive">비게시</SelectItem>
            <SelectItem value="draft">임시저장</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-md border p-4 text-center py-20">
            <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="rounded-md border p-4 text-center py-20">
            <p className="text-gray-500">등록된 FAQ가 없습니다.</p>
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-md border overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Badge variant="outline" className="shrink-0">
                    {getCategoryLabel(faq.category)}
                  </Badge>
                  <span className="font-medium">{faq.question}</span>
                  {faq.attachments && faq.attachments.length > 0 && (
                    <FileText className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block">
                    {getStatusBadge(faq.status)}
                  </div>
                  <span className="text-sm text-gray-500 hidden md:block">
                    {formatDate(faq.createdAt)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditFaq(faq);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFaq(faq);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    {expandedFaqId === faq.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>
              {expandedFaqId === faq.id && (
                <div className="p-4 bg-white">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, "<br />") }}
                  />
                  {faq.attachments && faq.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">첨부파일</h4>
                      <div className="space-y-2">
                        {faq.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center space-x-2"
                          >
                            <FileText className="h-4 w-4 text-gray-500" />
                            <a
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {attachment.fileName}{" "}
                              <span className="text-gray-500">
                                ({(attachment.fileSize / 1024 / 1024).toFixed(2)}MB)
                              </span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mx-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
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
                      onClick={() => handlePageChange(pageNum)}
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
                    onClick={() => handlePageChange(totalPages)}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* FAQ 상세보기 다이얼로그 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedFaq && <FaqDetail faq={selectedFaq} />}
        </DialogContent>
      </Dialog>

      {/* FAQ 등록/수정 다이얼로그 */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "FAQ 수정" : "FAQ 등록"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "FAQ 내용을 수정하세요."
                : "새로운 FAQ를 등록하세요."}
            </DialogDescription>
          </DialogHeader>
          <FaqForm 
            faq={selectedFaq} 
            isEditing={isEditing} 
            onSaveComplete={handleSaveComplete} 
          />
        </DialogContent>
      </Dialog>

      {/* FAQ 삭제 확인 다이얼로그 */}
      {selectedFaq && (
        <DeleteConfirm
          faq={selectedFaq}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onDeleteComplete={loadFaqs}
        />
      )}
    </div>
  );
}
