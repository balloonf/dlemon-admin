"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Institution, License, LicenseStatus, LicenseType } from "@/lib/definitions";
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
import { updateLicense } from "@/lib/api";
import { format } from "date-fns";
import { CalendarIcon, CreditCard, Loader2, Users, FileText } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// 폼 스키마 정의
const licenseFormSchema = z.object({
  institutionId: z.string({
    required_error: "기관을 선택해주세요.",
  }),
  type: z.enum(["trial", "standard", "premium"], {
    required_error: "라이선스 유형을 선택해주세요.",
  }),
  status: z.enum(["active", "pending", "expired", "canceled"], {
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

// 폼 컴포넌트
export function EditLicenseForm({ 
  license, 
  institutions 
}: { 
  license: License;
  institutions: Institution[] 
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 활성 기관 필터링 (inactive 상태의 기관은 제외) + 현재 선택된 기관
  const availableInstitutions = institutions.filter(
    (inst) => inst.status === "active" || inst.id === license.institutionId
  );

  // 폼 초기화
  const form = useForm<z.infer<typeof licenseFormSchema>>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: {
      institutionId: license.institutionId,
      type: license.type,
      status: license.status,
      startDate: new Date(license.startDate),
      expiryDate: new Date(license.expiryDate),
      maxUsers: license.maxUsers,
      maxPhotos: license.maxPhotos,
      maxReports: license.maxReports,
    },
  });
  
  // 사용량 퍼센트 계산
  const calculateUsagePercent = (current: number, max: number) => {
    return Math.min(100, Math.round((current / max) * 100));
  };
  
  // 폼 제출 처리
  const onSubmit = async (data: z.infer<typeof licenseFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      const licenseData = {
        institutionId: data.institutionId,
        type: data.type,
        status: data.status,
        startDate: data.startDate.toISOString(),
        expiryDate: data.expiryDate.toISOString(),
        maxUsers: data.maxUsers,
        maxPhotos: data.maxPhotos,
        maxReports: data.maxReports,
      };
      
      await updateLicense(license.id, licenseData);
      
      toast({
        title: "라이선스 수정 완료",
        description: "라이선스 정보가 성공적으로 수정되었습니다.",
      });
      
      // 라이선스 목록 페이지로 이동
      router.push("/dashboard/license");
      router.refresh();
    } catch (error) {
      console.error("라이선스 수정 오류:", error);
      toast({
        title: "라이선스 수정 실패",
        description: "라이선스 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
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
        {/* 현재 사용 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>현재 사용 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">사용자</h3>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{license.currentUsers} 명</span>
                  <span className="text-muted-foreground">{license.maxUsers} 명</span>
                </div>
                <Progress 
                  value={calculateUsagePercent(license.currentUsers, license.maxUsers)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {calculateUsagePercent(license.currentUsers, license.maxUsers)}% 사용 중
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">사진</h3>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{license.currentPhotos} 장</span>
                  <span className="text-muted-foreground">{license.maxPhotos} 장</span>
                </div>
                <Progress 
                  value={calculateUsagePercent(license.currentPhotos, license.maxPhotos)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {calculateUsagePercent(license.currentPhotos, license.maxPhotos)}% 사용 중
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">리포트</h3>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{license.currentReports} 개</span>
                  <span className="text-muted-foreground">{license.maxReports} 개</span>
                </div>
                <Progress 
                  value={calculateUsagePercent(license.currentReports, license.maxReports)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {calculateUsagePercent(license.currentReports, license.maxReports)}% 사용 중
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                          {availableInstitutions.length === 0 ? (
                            <SelectItem value="no-institutions" disabled>
                              활성화된 기관이 없습니다
                            </SelectItem>
                          ) : (
                            availableInstitutions.map((institution) => (
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
                        onValueChange={field.onChange}
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
                        라이선스 유형을 선택합니다.
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
                          <SelectItem value="expired">만료</SelectItem>
                          <SelectItem value="canceled">취소</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        라이선스의 현재 상태를 선택합니다.
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
                
                {/* 라이선스 정보 */}
                <div className="rounded-md border p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">라이선스 정보</h3>
                  <p className="text-sm">
                    <span className="font-medium">라이선스 ID:</span>{" "}
                    {license.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">생성일:</span>{" "}
                    {format(new Date(license.createdAt), "yyyy-MM-dd")}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">마지막 수정일:</span>{" "}
                    {format(new Date(license.updatedAt), "yyyy-MM-dd")}
                  </p>
                  {license.paymentId && (
                    <p className="text-sm">
                      <span className="font-medium">결제 ID:</span>{" "}
                      {license.paymentId}
                    </p>
                  )}
                </div>
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
                        <Input type="number" {...field} min={license.currentUsers} />
                      </FormControl>
                      <FormDescription>
                        라이선스에서 사용 가능한 최대 사용자 수를 설정합니다.
                        현재 사용 중인 수 ({license.currentUsers}명) 이상이어야 합니다.
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
                        <Input type="number" {...field} min={license.currentPhotos} />
                      </FormControl>
                      <FormDescription>
                        라이선스에서 처리 가능한 최대 사진 수를 설정합니다.
                        현재 사용 중인 수 ({license.currentPhotos}장) 이상이어야 합니다.
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
                        <Input type="number" {...field} min={license.currentReports} />
                      </FormControl>
                      <FormDescription>
                        라이선스에서 생성 가능한 최대 리포트 수를 설정합니다.
                        현재 사용 중인 수 ({license.currentReports}개) 이상이어야 합니다.
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
            변경사항 저장
          </Button>
        </div>
      </form>
    </Form>
  );
}
