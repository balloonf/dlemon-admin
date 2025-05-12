"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { deleteNotice } from "@/lib/api";
import { Notice } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
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
  notice: Notice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteComplete: () => void;
}

export function DeleteConfirm({
  notice,
  open,
  onOpenChange,
  onDeleteComplete,
}: DeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteNotice(notice.id);
      onDeleteComplete();
    } catch (error) {
      console.error("공지사항 삭제 중 오류가 발생했습니다:", error);
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
          <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            "{notice.title}" 공지사항을 삭제하시겠습니까?
            <br />
            삭제된 공지사항은 복구할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
