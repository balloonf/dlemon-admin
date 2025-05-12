"use client";

import { useState } from "react";
import { format, addWeeks, addMonths } from "date-fns";
import { CalendarIcon, CalendarPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Institution, License, LicenseType } from "@/lib/definitions";
import { createLicense, updateLicense } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface FreeTrialManagerProps {
  institution: Institution;
  licenses: License[];
}

export function FreeTrialManager({ institution, licenses }: FreeTrialManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  // Find active trial license if exists
  const trialLicense = licenses.find(
    (license) => license.type === "trial" && license.status === "active"
  );
  
  // State for the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddLicenseDialogOpen, setIsAddLicenseDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addMonths(new Date(), 1));
  const [periodAmount, setPeriodAmount] = useState<string>("1");
  const [periodUnit, setPeriodUnit] = useState<string>("month");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate end date based on period amount and unit
  const updateEndDate = (amount: string, unit: string) => {
    const newAmount = parseInt(amount, 10);
    
    if (isNaN(newAmount) || newAmount <= 0) {
      return;
    }
    
    const newStartDate = startDate || new Date();
    let newEndDate;
    
    if (unit === "week") {
      newEndDate = addWeeks(newStartDate, newAmount);
    } else {
      newEndDate = addMonths(newStartDate, newAmount);
    }
    
    setEndDate(newEndDate);
  };
  
  // Handle period amount change
  const handlePeriodAmountChange = (value: string) => {
    setPeriodAmount(value);
    updateEndDate(value, periodUnit);
  };
  
  // Handle period unit change
  const handlePeriodUnitChange = (value: string) => {
    setPeriodUnit(value);
    updateEndDate(periodAmount, value);
  };
  
  // Handle submit for creating or updating trial license
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const licenseData = {
        institutionId: institution.id,
        type: "trial" as LicenseType,
        status: "active",
        startDate: startDate.toISOString(),
        expiryDate: endDate.toISOString(),
        maxUsers: 10,
        maxPhotos: 1000,
        maxReports: 500,
      };
      
      if (trialLicense) {
        // Update existing license
        await updateLicense(trialLicense.id, licenseData);
        toast({
          title: "무료체험 기간 변경 완료",
          description: "무료체험 기간이 성공적으로 변경되었습니다.",
        });
      } else {
        // Create new license
        await createLicense(licenseData);
        toast({
          title: "무료체험 라이선스 생성 완료",
          description: "무료체험 라이선스가 성공적으로 생성되었습니다.",
        });
      }
      
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("무료체험 라이선스 처리 오류:", error);
      toast({
        title: "무료체험 라이선스 처리 실패",
        description: "무료체험 라이선스 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Open add license dialog
  const handleAddLicense = () => {
    setIsAddLicenseDialogOpen(true);
  };
  
  // The license add handler would redirect to the license creation page
  const handleLicenseTypeSelect = (type: string) => {
    router.push(`/dashboard/license/new?institution=${institution.id}&type=${type}`);
  };
  
  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        {!trialLicense ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">라이선스 상태</h2>
                <p className="text-base text-muted-foreground mt-1">
                  {institution.name}은 보유한 라이선스가 없습니다.
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(true)}
                >
                  무료체험 기간설정
                </Button>
                <Button onClick={handleAddLicense}>
                  라이선스추가
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">무료체험 기간 설정</h3>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(startDate, "yyyy.MM.dd")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          if (date) {
                            setStartDate(date);
                            updateEndDate(periodAmount, periodUnit);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <span>~</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(endDate, "yyyy.MM.dd")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        disabled={(date) => date < startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">기간 단위 선택</h3>
                <div className="flex items-center gap-2">
                  <Select
                    value={periodAmount}
                    onValueChange={handlePeriodAmountChange}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="기간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={periodUnit}
                    onValueChange={handlePeriodUnitChange}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="단위 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">주</SelectItem>
                      <SelectItem value="month">개월</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">라이선스 상태</h2>
                <p className="text-base text-muted-foreground mt-1">
                  {institution.name}은 '무료체험 라이선스'를 사용하고 있습니다.
                </p>
                <p className="text-sm mt-1">
                  무료체험 기간: {format(new Date(trialLicense.startDate), "yyyy.MM.dd")} ~ {format(new Date(trialLicense.expiryDate), "yyyy.MM.dd")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(true)}
                >
                  무료체험 기간설정
                </Button>
                <Button onClick={handleAddLicense}>
                  라이선스추가
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">무료체험 기간 설정</h3>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(startDate, "yyyy.MM.dd")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          if (date) {
                            setStartDate(date);
                            updateEndDate(periodAmount, periodUnit);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <span>~</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(endDate, "yyyy.MM.dd")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        disabled={(date) => date < startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">기간 단위 선택</h3>
                <div className="flex items-center gap-2">
                  <Select
                    value={periodAmount}
                    onValueChange={handlePeriodAmountChange}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="기간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={periodUnit}
                    onValueChange={handlePeriodUnitChange}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="단위 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">주</SelectItem>
                      <SelectItem value="month">개월</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* 무료체험 기간 설정 대화상자 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>무료체험 기간 설정</DialogTitle>
            <DialogDescription>
              {institution.name}의 무료체험 기간을 설정합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">시작일</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      {startDate ? (
                        format(startDate, "yyyy-MM-dd")
                      ) : (
                        <span>날짜 선택</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date);
                          updateEndDate(periodAmount, periodUnit);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">종료일</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      {endDate ? (
                        format(endDate, "yyyy-MM-dd")
                      ) : (
                        <span>날짜 선택</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      disabled={(date) => date < startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">기간</h3>
                <Select
                  value={periodAmount}
                  onValueChange={handlePeriodAmountChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="기간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">단위</h3>
                <Select
                  value={periodUnit}
                  onValueChange={handlePeriodUnitChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="단위 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">주</SelectItem>
                    <SelectItem value="month">개월</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              닫기
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "처리중..." : trialLicense ? "기간 변경" : "기간 설정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 라이선스 추가 대화상자 */}
      <Dialog open={isAddLicenseDialogOpen} onOpenChange={setIsAddLicenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>라이선스 추가</DialogTitle>
            <DialogDescription>
              라이선스 연장 추가 기간을 선택하시면, 금액이 표시 됩니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">라이선스 유형</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex flex-col h-auto py-4 justify-center items-center"
                    onClick={() => handleLicenseTypeSelect("standard")}
                  >
                    <CalendarPlus className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">표준</span>
                    <span className="text-xs text-muted-foreground mt-1">1년: 120,000원</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex flex-col h-auto py-4 justify-center items-center"
                    onClick={() => handleLicenseTypeSelect("premium")}
                  >
                    <CalendarPlus className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">프리미엄</span>
                    <span className="text-xs text-muted-foreground mt-1">1년: 240,000원</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-medium">라이선스 기간</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="flex justify-between items-center"
                  onClick={() => handleLicenseTypeSelect("standard")}
                >
                  <span>12개월</span>
                  <span className="text-sm text-muted-foreground">181,500원 (VAT포함)</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex justify-between items-center"
                  onClick={() => handleLicenseTypeSelect("premium")}
                >
                  <span>24개월</span>
                  <span className="text-sm text-muted-foreground">363,000원 (VAT포함)</span>
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddLicenseDialogOpen(false)}
            >
              닫기
            </Button>
            <Button
              type="submit"
              onClick={() => router.push(`/dashboard/license/new?institution=${institution.id}`)}
            >
              결제처리
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
