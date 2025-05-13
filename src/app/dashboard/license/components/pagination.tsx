"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export function LicensePagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // 페이지 변경 함수
  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  // 페이지 번호 계산
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    const MAX_VISIBLE_PAGES = 5;
    const leftPad = Math.floor(MAX_VISIBLE_PAGES / 2);
    const rightPad = Math.ceil(MAX_VISIBLE_PAGES / 2) - 1;
    
    let startPage = Math.max(1, currentPage - leftPad);
    let endPage = Math.min(totalPages, currentPage + rightPad);
    
    // 왼쪽 패딩이 부족한 경우 오른쪽으로 확장
    if (startPage === 1) {
      endPage = Math.min(totalPages, 1 + MAX_VISIBLE_PAGES - 1);
    }
    
    // 오른쪽 패딩이 부족한 경우 왼쪽으로 확장
    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - MAX_VISIBLE_PAGES + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  // 표시할 페이지가 없으면 렌더링 안 함
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => changePage(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
        <span className="sr-only">첫 페이지</span>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">이전 페이지</span>
      </Button>
      
      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          onClick={() => changePage(page)}
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">다음 페이지</span>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => changePage(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
        <span className="sr-only">마지막 페이지</span>
      </Button>
    </div>
  );
}
