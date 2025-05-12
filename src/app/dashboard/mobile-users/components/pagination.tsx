"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MobileUsersPaginationProps {
  totalPages: number;
  currentPage: number;
}

export function MobileUsersPagination({ totalPages, currentPage }: MobileUsersPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL 검색 파라미터 업데이트 함수
  const createPageQueryString = useCallback(
    (pageNumber: number) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("page", pageNumber.toString());
      return newSearchParams.toString();
    },
    [searchParams]
  );
  
  // 페이지 번호 목록 생성
  const getPageNumbers = () => {
    const pageNumbers: (number | null)[] = [];
    
    // 처음 페이지
    pageNumbers.push(1);
    
    // 현재 페이지 근처 페이지들
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (pageNumbers[pageNumbers.length - 1] !== i - 1) {
        pageNumbers.push(null); // 생략 부호 표시를 위한 null
      }
      pageNumbers.push(i);
    }
    
    // 마지막 페이지
    if (totalPages > 1) {
      if (pageNumbers[pageNumbers.length - 1] !== totalPages - 1) {
        pageNumbers.push(null); // 생략 부호 표시를 위한 null
      }
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  // 페이지 변경 함수
  const changePage = (page: number) => {
    router.push(`/dashboard/mobile-users?${createPageQueryString(page)}`);
  };
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && changePage(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>
        
        {getPageNumbers().map((pageNumber, index) => (
          pageNumber === null ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() => changePage(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        ))}
        
        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages && changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
