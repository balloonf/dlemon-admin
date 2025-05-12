"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Institution, LicenseFormData, LicenseStatus, LicenseType } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createLicense } from "@/lib/api";
import { format, addMonths, addYears } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// 폼 스키마 정의
const licenseFormSchema = z.object({
  institutionId: z.string({
    required_error: "기관을 선택해주세요.",
  }),
  type: z.enum(["trial", "standard", "premium"], {
    required_error: "라이선스 유형을 선택해주세요.",
  }),
  status: z.enum(["active", "pending"], {
    required_error: "라이선스 상태를 선택해주세요.",
  }),
  startDate: z.date({
    required_error: "시작일을 선택해주세요.",
  }),
  expiryDate: z.date({
    required_error: "만료일을 선택해주세요.",
  }),
  maxUsers: z.coerce
    .number()
    .min(1, "최소 1명 이상의 사용자를 설정해야 합니다."),
  maxPhotos: z.coerce
    .number()
    .min(1, "최소 1장 이상의 사진을 설정해야 합니다."),
  maxReports: z.coerce
    .number()
    .min(1, "최소 1개 이상의 리포트를 설정해야 합니다."),
}).refine(data => data.expiryDate > data.startDate, {
  message: "만료일은 시작일보다 이후여야 합니다.",
  path: ["expiryDate"],
});

// 라이선스 유형에 따른 기본값 설정
const licenseTypeDefaults = {
  trial: {
    maxUsers: 10,
    maxPhotos: 1000,
    maxReports: 500,
  },
  standard: {
    maxUsers: 30,
    maxPhotos: 5000,
    maxReports: 2500,
  },
  premium: {
    maxUsers: 50,
    maxPhotos: 10000,
    maxReports: 5000,
  },
};

// 폼 컴포넌트
export function CreateLicenseForm({ 
  institutions, 
  initialInstitutionId = "",
  initialLicenseType = "trial"
}: { 
  institutions: Institution[];
  initialInstitutionId?: string;
  initialLicenseType?: LicenseType | string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 활성 기관 필터링 (inactive 상태의 기관은 제외)
  const activeInstitutions = institutions.filter(
    (inst) => inst.status === "active"
  );

  // 폼 초기화
  const form = useForm<z.infer<typeof licenseFormSchema>>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: {
      institutionId: initialInstitutionId || "",
      type: initialLicenseType as LicenseType || "trial",
      status: "active",
      startDate: new Date(),
      expiryDate: initialLicenseType === "trial" 
        ? addMonths(new Date(), 1) // 무료체험은 1개월
        : addYears(new Date(), 1),  // 다른 라이선스는 1년
      maxUsers: initialLicenseType === "premium" 
        ? licenseTypeDefaults.premium.maxUsers 
        : initialLicenseType === "standard"
          ? licenseTypeDefaults.standard.maxUsers
          : licenseTypeDefaults.trial.maxUsers,
      maxPhotos: initialLicenseType === "premium" 
        ? licenseTypeDefaults.premium.maxPhotos 
        : initialLicenseType === "standard"
          ? licenseTypeDefaults.standard.maxPhotos
          : licenseTypeDefaults.trial.maxPhotos,
      maxReports: initialLicenseType === "premium" 
        ? licenseTypeDefaults.premium.maxReports 
        : initialLicenseType === "standard"
          ? licenseTypeDefaults.standard.maxReports
          : licenseTypeDefaults.trial.maxReports,
    },
  });
  
  // 라이선스 유형 변경 시 기본값 업데이트
  const handleLicenseTypeChange = (type: LicenseType) => {
    const defaults = licenseTypeDefaults[type];
    
    form.setValue("type", type);
    form.setValue("maxUsers", defaults.maxUsers);
    form.setValue("maxPhotos", defaults.maxPhotos);
    form.setValue("maxReports", defaults.maxReports);
    
    // 무료체험인 경우 만료일을 1개월 후로 설정
    if (type === "trial") {
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      form.setValue("expiryDate", oneMonthLater);
    } else {
      // 정식 라이선스인 경우 만료일을 1년 후로 설정
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      form.setValue("expiryDate", oneYearLater);
    }
  };
  
  // 폼 제출 처리
  const onSubmit = async (data: z.infer<typeof licenseFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      const licenseData: LicenseFormData = {
        institutionId: data.institutionId,
        type: data.type,
        status: data.status,
        startDate: data.startDate.toISOString(),
        expiryDate: data.expiryDate.toISOString(),
        maxUsers: data.maxUsers,
        maxPhotos: data.maxPhotos,
        maxReports: data.maxReports,
      };
      
      await createLicense(licenseData);
      
      toast({
        title: "라이선스 생성 완료",
        description: "새로운 라이선스가 성공적으로 생성되었습니다.",
      });
      
      // 라이선스 목록 페이지로 이동
      router.push("/dashboard/license");
      router.refresh();
    } catch (error) {
      console.error("라이선스 생성 오류:", error);
      toast({
        title: "라이선스 생성 실패",
        description: "라이선스 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 선택된 기관의 정보
  const selectedInstitution = form.watch("institutionId")
    ? institutions.find((i) => i.id === form.watch("institutionId"))
    : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 기본 정보 섹션 */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">기본 정보</h2>
                
                {/* 기관 선택 */}
                <FormField
                  control={form.control}
                  name="institutionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>기관 선택</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="기관을 선택해주세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeInstitutions.length === 0 ? (
                            <SelectItem value="no-institutions" disabled>
                              활성화된 기관이 없습니다
                            </SelectItem>
                          ) : (
                            activeInstitutions.map((institution) => (
                              <SelectItem
                                key={institution.id}
                                value={institution.id}
                              >
                                {institution.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        라이선스를 할당할 기관을 선택합니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* 라이선스 유형 */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>라이선스 유형</FormLabel>
                      <Select
                        onValueChange={(value) => 
                          handleLicenseTypeChange(value as LicenseType)
                        }
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="라이선스 유형 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="trial">무료체험</SelectItem>
                          <SelectItem value="standard">표준</SelectItem>
                          <SelectItem value="premium">프리미엄</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        라이선스 유형에 따라 사용자, 사진, 리포트 수가 달라집니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* 라이선스 상태 */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>라이선스 상태</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="라이선스 상태 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">활성</SelectItem>
                          <SelectItem value="pending">대기중</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        라이선스를 바로 활성화할지 대기 상태로 생성할지 선택합니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                {/* 선택된 기관 정보 */}
                {selectedInstitution && (
                  <div className="rounded-md border p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">선택된 기관 정보</h3>
                    <p className="text-sm">
                      <span className="font-medium">이름:</span>{" "}
                      {selectedInstitution.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">사업자등록번호:</span>{" "}
                      {selectedInstitution.businessNumber}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">담당자:</span>{" "}
                      {selectedInstitution.contactName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">연락처:</span>{" "}
                      {selectedInstitution.contactPhone}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">현재 라이선스:</span>{" "}
                      {selectedInstitution.licenseType === "none"
                        ? "없음"
                        : selectedInstitution.licenseType === "trial"
                        ? "무료체험"
                        : selectedInstitution.licenseType === "standard"
                        ? "표준"
                        : "프리미엄"}
                    </p>
                    {selectedInstitution.licenseExpiry && (
                      <p className="text-sm">
                        <span className="font-medium">현재 만료일:</span>{" "}
                        {format(
                          new Date(selectedInstitution.licenseExpiry),
                          "yyyy-MM-dd"
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 기간 및 용량 설정 섹션 */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">기간 설정</h2>
                
                {/* 시작일 */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>시작일</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                              ) : (
                                <span>날짜 선택</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        라이선스 사용 시작일을 선택합니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* 만료일 */}
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>만료일</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                              ) : (
                                <span>날짜 선택</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < form.getValues("startDate")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        라이선스 만료일을 선택합니다. 시작일 이후여야 합니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">용량 설정</h2>
                
                {/* 최대 사용자 수 */}
                <FormField
                  control={form.control}
                  name="maxUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최대 사용자 수</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={1} />
                      </FormControl>
                      <FormDescription>
                        라이선스에서 사용 가능한 최대 사용자 수를 설정합니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* 최대 사진 수 */}
                <FormField
                  control={form.control}
                  name="maxPhotos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최대 사진 수</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={1} />
                      </FormControl>
                      <FormDescription>
                        라이선스에서 처리 가능한 최대 사진 수를 설정합니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* 최대 리포트 수 */}
                <FormField
                  control={form.control}
                  name="maxReports"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최대 리포트 수</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={1} />
                      </FormControl>
                      <FormDescription>
                        라이선스에서 생성 가능한 최대 리포트 수를 설정합니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/license")}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            라이선스 생성
          </Button>
        </div>
      </form>
    </Form>
  );
}
