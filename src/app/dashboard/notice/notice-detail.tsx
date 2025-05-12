"use client";

import { FileDown, ExternalLink, Pin } from "lucide-react";
import { Notice } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface NoticeDetailProps {
  notice: Notice;
}

// 상태에 따른 배지 스타일
const getStatusBadge = (status: string) => {
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

// 대상 텍스트 변환
const getTargetText = (target: string) => {
  switch (target) {
    case "all":
      return "전체 사용자";
    case "institution":
      return "특정 기관";
    case "user":
      return "특정 사용자";
    default:
      return target;
  }
};

// 날짜 형식 변환
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function NoticeDetail({ notice }: NoticeDetailProps) {
  return (
    <div>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <DialogTitle className="text-xl">{notice.title}</DialogTitle>
          {notice.isPinned && (
            <Pin className="h-4 w-4 text-red-500" />
          )}
        </div>
        <DialogDescription>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
            <div>등록일: {formatDate(notice.createdAt)}</div>
            <div>상태: {getStatusBadge(notice.status)}</div>
            <div>
              게시 기간:{" "}
              {notice.startDate && notice.endDate
                ? `${formatDate(notice.startDate)} ~ ${formatDate(notice.endDate)}`
                : notice.startDate
                ? `${formatDate(notice.startDate)}부터`
                : notice.endDate
                ? `${formatDate(notice.endDate)}까지`
                : "상시"}
            </div>
            <div>대상: {getTargetText(notice.target)}</div>
            <div>조회수: {notice.viewCount}</div>
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="my-6">
        <div className="border rounded-md p-4 bg-gray-50 min-h-[200px] whitespace-pre-line">
          {notice.content}
        </div>
      </div>

      {notice.attachments && notice.attachments.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-medium mb-2">첨부파일</h3>
          <div className="space-y-2">
            {notice.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between border rounded-md p-2 bg-gray-50"
              >
                <div className="flex items-center">
                  <FileDown className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">{attachment.fileName}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({(attachment.fileSize / 1024 / 1024).toFixed(2)}MB)
                  </span>
                </div>
                <a
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <DialogFooter className="mt-6">
        <div className="text-xs text-gray-500 mr-auto">
          최종 수정: {formatDate(notice.updatedAt)} (by {notice.updatedBy})
        </div>
      </DialogFooter>
    </div>
  );
}
