"use client";

import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // 한 번에 표시할 페이지 번호 개수
  const maxPageButtons = 5;
  
  // 페이지 번호 계산
  const getPageNumbers = () => {
    if (totalPages <= maxPageButtons) {
      // 전체 페이지가 maxPageButtons 이하인 경우 모든 페이지 표시
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // 현재 페이지 주변을 중심으로 표시
      let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
      let endPage = startPage + maxPageButtons - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxPageButtons + 1, 1);
      }
      
      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }
  };

  // 페이지 이동 함수들
  const goToFirstPage = () => onPageChange(1);
  const goToPreviousPage = () => onPageChange(Math.max(currentPage - 1, 1));
  const goToNextPage = () => onPageChange(Math.min(currentPage + 1, totalPages));
  const goToLastPage = () => onPageChange(totalPages);

  // 페이지가 1페이지뿐이면 페이지네이션을 표시하지 않음
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={goToFirstPage}
        disabled={currentPage === 1}
        title="첫 페이지"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        title="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex space-x-1">
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page}
          >
            {page}
          </Button>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        title="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToLastPage}
        disabled={currentPage === totalPages}
        title="마지막 페이지"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
