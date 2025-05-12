"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InquiryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">온라인 문의 관리</h1>
        <div className="flex w-full max-w-sm items-center space-x-2 ml-auto">
          <Input placeholder="검색어를 입력하세요" />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border p-4 text-center py-20">
        <h2 className="text-lg font-medium mb-2">온라인 문의 관리 기능</h2>
        <p className="text-gray-500">
          온라인 문의 관리 기능은 아직 구현 중입니다. 곧 제공될 예정입니다.
        </p>
      </div>
    </div>
  );
}
