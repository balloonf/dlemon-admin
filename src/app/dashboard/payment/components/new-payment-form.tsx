"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Institution, License, PaymentMethod, PaymentStatus } from "@/lib/definitions";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPayment } from "@/lib/api";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// 폼 유효성 검사 스키마
const formSchema = z.object({
  institutionId: z.string({
    required_error: "기관을 선택해주세요.",
  }),
  licenseId: z.string().optional(),
  amount: z.number({
    required_error: "결제 금액을 입력해주세요.",
    invalid_type_error: "유효한 숫자를 입력해주세요.",
  }).positive({
    message: "결제 금액은 0보다 커야 합니다.",
  }),
  method: z.enum(["card", "bank", "vbank", "phone", "point"], {
    required_error: "결제 방법을 선택해주세요.",
  }),
  status: z.enum(["ready", "paid", "canceled", "failed", "refunded", "partial_refunded"], {
    required_error: "결제 상태를 선택해주세요.",
  }),
  paymentDate: z.date().optional(),
  description: z.string({
    required_error: "설명을 입력해주세요.",
  }).min(2, {
    message: "설명은 최소 2자 이상이어야 합니다.",
  }).max(100, {
    message: "설명은 최대 100자까지 입력 가능합니다.",
  }),
});

// 결제 방법 한글 표시
const methodLabels: Record<PaymentMethod, string> = {
  card: "신용카드",
  bank: "계좌이체",
  vbank: "가상계좌",
  phone: "휴대폰",
  point: "포인트",
};

// 결제 상태 한글 표시
const statusLabels: Record<PaymentStatus, string> = {
  ready: "결제 대기",
  paid: "결제 완료",
  canceled: "취소됨",
  failed: "결제 실패",
  refunded: "환불 완료",
  partial_refunded: "부분 환불",
};

interface NewPaymentFormProps {
  institutions: Institution[];
  licenses: License[];
}

export function NewPaymentForm({ institutions, licenses }: NewPaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>("");
  
  // React Hook Form 설정
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institutionId: "",
      licenseId: "",
      amount: 0,
      method: "card",
      status: "ready",
      description: "",
    },
  });
  
  // 선택된 기관에 따른 라이선스 필터링
  const filteredLicenses = licenses.filter(
    (license) => license.institutionId === selectedInstitutionId && license.status === "active"
  );
  
  // 기관 선택 시 처리
  const handleInstitutionChange = (value: string) => {
    setSelectedInstitutionId(value);
    form.setValue("institutionId", value);
    form.setValue("licenseId", ""); // 라이선스 선택 초기화
  };
  
  // 폼 제출 처리
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      // API 요청 데이터 구성
      const paymentData = {
        institutionId: data.institutionId,
        licenseId: data.licenseId === "" ? undefined : data.licenseId,
        amount: data.amount,
        method: data.method,
        status: data.status,
        paymentDate: data.paymentDate ? data.paymentDate.toISOString() : undefined,
        description: data.description,
      };
      
      // 결제 내역 생성 API 호출
      await createPayment(paymentData);
      
      // 결제 내역 목록 페이지로 이동
      router.push("/dashboard/payment");
      router.refresh();
    } catch (error) {
      console.error("결제 내역 추가 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="institutionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>기관 선택</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => handleInstitutionChange(value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="기관을 선택해주세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {institutions.map((institution) => (
                        <SelectItem key={institution.id} value={institution.id}>
                          {institution.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="licenseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>라이선스 연결 (선택사항)</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedInstitutionId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="라이선스를 선택해주세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no-license">라이선스 연결 안함</SelectItem>
                      {filteredLicenses.map((license) => (
                        <SelectItem key={license.id} value={license.id}>
                          {license.id} - {license.type} ({format(new Date(license.startDate), "yyyy-MM-dd")} ~ {format(new Date(license.expiryDate), "yyyy-MM-dd")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    라이선스와 연결된 결제 내역인 경우 선택하세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>결제 금액</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="결제 금액 입력"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription>
                    원 단위로 입력하세요. (예: 10000)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>결제 방법</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="결제 방법 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(methodLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>결제 상태</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="결제 상태 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>결제일 (선택사항)</FormLabel>
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
                            <span>결제일 선택</span>
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("2020-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    결제 대기 상태인 경우 입력하지 않아도 됩니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="결제 내역에 대한 설명을 입력하세요."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    결제 목적이나 상세 내용을 간단히 기재하세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "처리 중..." : "저장"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
