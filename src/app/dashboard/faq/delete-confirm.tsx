"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Faq } from "@/lib/definitions";
import { deleteFaq } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmProps {
  faq: Faq;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteComplete: () => void;
}

export function DeleteConfirm({
  faq,
  open,
  onOpenChange,
  onDeleteComplete,
}: DeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFaq(faq.id);
      onOpenChange(false);
      onDeleteComplete();
    } catch (error) {
      console.error("FAQ 삭제 중 오류가 발생했습니다:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            FAQ 삭제 확인
          </AlertDialogTitle>
          <AlertDialogDescription>
            다음 FAQ를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            <div className="mt-2 p-3 border rounded-md bg-gray-50">
              <p className="font-medium">{faq.question}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
