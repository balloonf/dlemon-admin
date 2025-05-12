"use client";

import { Badge } from "@/components/ui/badge";

interface LicenseStatusBadgeProps {
  status: "active" | "trial" | "expired" | "none";
}

export function LicenseStatusBadge({ status }: LicenseStatusBadgeProps) {
  switch (status) {
    case "active":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          사용중
        </Badge>
      );
    case "trial":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          무료체험
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          만료됨
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          미설정
        </Badge>
      );
  }
}