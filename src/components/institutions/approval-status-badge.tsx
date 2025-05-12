"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ApprovalStatusBadgeProps {
  status: "approved" | "pending";
  onApprove?: () => void;
}

export function ApprovalStatusBadge({ status, onApprove }: ApprovalStatusBadgeProps) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        승인됨
      </span>
    );
  }
  
  return (
    <Button 
      size="sm" 
      variant="outline"
      className="h-7"
      onClick={onApprove}
    >
      <CheckCircle className="mr-1 h-3.5 w-3.5" />
      승인
    </Button>
  );
}