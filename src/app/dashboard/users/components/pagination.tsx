"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function UsersPagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 페이지 변경 함수
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    
    return `${pathname}?${params.toString()}`;
  };
  
  // 표시할 페이지 버튼 생성
  const renderPageButtons = () => {
    const pageButtons = [];
    
    // 시작 페이지와 끝 페이지 계산
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // 표시할 페이지 버튼이 5개 미만인 경우 시작 페이지 조정
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    // 첫 페이지 버튼
    if (startPage > 1) {
      pageButtons.push(
        <PaginationItem key="first">
          <PaginationLink href={createPageURL(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      // 생략 표시
      if (startPage > 2) {
        pageButtons.push(
          <PaginationItem key="ellipsis-start">
            <span className="px-4 py-2">...</span>
          </PaginationItem>
        );
      }
    }
    
    // 페이지 숫자 버튼
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={createPageURL(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // 마지막 페이지 버튼
    if (endPage < totalPages) {
      // 생략 표시
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <PaginationItem key="ellipsis-end">
            <span className="px-4 py-2">...</span>
          </PaginationItem>
        );
      }
      
      pageButtons.push(
        <PaginationItem key="last">
          <PaginationLink href={createPageURL(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pageButtons;
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {renderPageButtons()}
        
        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
