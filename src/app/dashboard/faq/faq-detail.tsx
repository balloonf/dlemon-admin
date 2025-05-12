"use client";

import { FileText, Eye, Clock } from "lucide-react";
import { Faq, FaqCategory } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";

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

interface FaqDetailProps {
  faq: Faq;
}

export function FaqDetail({ faq }: FaqDetailProps) {
  // 날짜 포맷 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">FAQ 상세 정보</h2>
        <Badge variant="outline" className="px-2 py-1 text-xs">
          {getCategoryLabel(faq.category)}
        </Badge>
      </div>

      <div className="bg-gray-50 rounded-md p-4">
        <h3 className="text-lg font-medium mb-2">
          <span className="text-gray-500 mr-1">Q.</span>
          {faq.question}
        </h3>
        <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-1">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>등록: {formatDate(faq.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>조회수: {faq.viewCount}</span>
          </div>
          <div>
            <span>순번: {faq.orderNum}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">
          <span className="text-gray-500 mr-1">A.</span>
          답변
        </h3>
        <div className="rounded-md border p-4 bg-white">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, "<br />") }}
          />
        </div>
      </div>

      {faq.attachments && faq.attachments.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-2">첨부파일</h3>
          <div className="rounded-md border p-4 bg-white">
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
        </div>
      )}

      <div className="pt-4 border-t text-sm text-gray-500">
        <div className="flex flex-wrap gap-4">
          <div>
            <strong>최초 등록:</strong> {formatDate(faq.createdAt)}
            {faq.createdBy && ` (${faq.createdBy})`}
          </div>
          <div>
            <strong>최종 수정:</strong> {formatDate(faq.updatedAt)}
            {faq.updatedBy && ` (${faq.updatedBy})`}
          </div>
        </div>
      </div>
    </div>
  );
}
