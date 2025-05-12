"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { License } from "@/lib/definitions";
import { updateLicenseStatus } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface LicenseCancelDialogProps {
  license: License;
  children: React.ReactNode;
}

export function LicenseCancelDialog({
  license,
  children,
}: LicenseCancelDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      await updateLicenseStatus(license.id, "canceled");
      
      toast({
        title: "라이선스 취소 완료",
        description: "라이선스가 취소되었습니다. AI medical의 사용이 제한됩니다.",
      });
      
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("라이선스 취소 오류:", error);
      toast({
        title: "라이선스 취소 실패",
        description: "라이선스 취소 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            라이선스 취소
          </DialogTitle>
          <DialogDescription className="pt-3">
            라이선스를 취소 하시겠습니까?
          </DialogDescription>
          <div className="mt-3 rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">
              라이선스가 삭제되면, AI medical의 사용이 제한됩니다.
            </p>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            닫기
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? "취소 처리 중..." : "취소하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
