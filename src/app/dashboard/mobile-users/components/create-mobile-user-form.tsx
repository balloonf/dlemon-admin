"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Institution, License, MobileUserStatus } from "@/lib/definitions";
import { createMobileUser } from "@/lib/mobile-api";
import { useToast } from "@/components/ui/use-toast";

interface CreateMobileUserFormProps {
  institutions: Institution[];
  licenses: License[];
}

// 폼 유효성 검증 스키마
const formSchema = z.object({
  name: z.string().min(2, { message: "이름은 2글자 이상이어야 합니다." }),
  username: z.string().min(4, { message: "아이디는 4글자 이상이어야 합니다." }),
  phoneNumber: z.string().min(10, { message: "유효한 전화번호를 입력해주세요." }),
  institutionId: z.string().min(1, { message: "소속기관을 선택해주세요." }),
  licenseId: z.string().min(1, { message: "라이선스를 선택해주세요." }),
  deviceId: z.string().min(8, { message: "디바이스 ID는 8글자 이상이어야 합니다." }),
  usageCount: z.coerce.number().int().min(0, { message: "사용량은 0 이상이어야 합니다." }),
  totalCount: z.coerce.number().int().min(1, { message: "총 수량은 1 이상이어야 합니다." }),
  status: z.enum(["active", "inactive", "pending", "blocked"]),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateMobileUserForm({ institutions, licenses }: CreateMobileUserFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 기관별 라이선스 필터링
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>("");
  const filteredLicenses = selectedInstitutionId 
    ? licenses.filter(license => license.institutionId === selectedInstitutionId && license.status === "active")
    : [];
  
  // 폼 상태 관리
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      phoneNumber: "",
      institutionId: "",
      licenseId: "",
      deviceId: "",
      usageCount: 0,
      totalCount: 10,
      status: "active" as MobileUserStatus,
    },
  });
  
  // 기관 선택 시 라이선스 필터링
  const handleInstitutionChange = (value: string) => {
    setSelectedInstitutionId(value);
    form.setValue("institutionId", value);
    form.setValue("licenseId", ""); // 라이선스 선택 초기화
  };
  
  // 라이선스 선택 시 총 수량 자동 설정
  const handleLicenseChange = (value: string) => {
    const selectedLicense = licenses.find(license => license.id === value);
    if (selectedLicense) {
      form.setValue("totalCount", selectedLicense.maxUsers);
    }
    form.setValue("licenseId", value);
  };
  
  // 폼 제출 처리
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // 선택된 기관 및 라이선스 정보 가져오기
      const institution = institutions.find(inst => inst.id === data.institutionId);
      const license = licenses.find(lic => lic.id === data.licenseId);
      
      if (!institution || !license) {
        throw new Error("기관 또는 라이선스 정보를 찾을 수 없습니다.");
      }
      
      // 사용자 생성 API 호출
      await createMobileUser({
        name: data.name,
        username: data.username,
        phoneNumber: data.phoneNumber,
        institutionId: data.institutionId,
        institutionName: institution.name,
        licenseId: data.licenseId,
        licenseType: license.type,
        deviceId: data.deviceId,
        status: data.status,
        usageCount: data.usageCount,
        totalCount: data.totalCount,
      });
      
      toast({
        title: "Mobile앱 사용자 등록 완료",
        description: `${data.name} 사용자가 등록되었습니다.`,
      });
      
      // 목록 페이지로 이동
      router.push("/dashboard/mobile-users");
      router.refresh();
      
    } catch (error) {
      console.error("Mobile앱 사용자 등록 오류:", error);
      toast({
        title: "Mobile앱 사용자 등록 실패",
        description: "사용자 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>아이디</FormLabel>
                <FormControl>
                  <Input placeholder="user123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>휴대폰번호</FormLabel>
                <FormControl>
                  <Input placeholder="010-1234-5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="institutionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>소속기관</FormLabel>
                <Select
                  onValueChange={handleInstitutionChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="소속기관 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {institutions.map((institution) => (
                      <SelectItem
                        key={institution.id}
                        value={institution.id}
                      >
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
                <FormLabel>라이선스</FormLabel>
                <Select
                  onValueChange={handleLicenseChange}
                  value={field.value}
                  disabled={!selectedInstitutionId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="라이선스 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredLicenses.length === 0 ? (
                      <SelectItem value="none" disabled>
                        사용 가능한 라이선스가 없습니다
                      </SelectItem>
                    ) : (
                      filteredLicenses.map((license) => (
                        <SelectItem
                          key={license.id}
                          value={license.id}
                        >
                          {license.type === "premium" ? "프리미엄" : 
                           license.type === "standard" ? "스탠다드" : "체험판"} 
                           ({license.maxUsers}명)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  기관을 먼저 선택해야 라이선스를 선택할 수 있습니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="deviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>디바이스번호(UDID)</FormLabel>
                <FormControl>
                  <Input placeholder="디바이스 고유 ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상태</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="inactive">비활성</SelectItem>
                    <SelectItem value="pending">대기중</SelectItem>
                    <SelectItem value="blocked">차단됨</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="usageCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>현재 사용량</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="totalCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>총 수량</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormDescription>
                  라이선스 선택 시 자동으로 설정되며, 필요에 따라 변경 가능합니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/mobile-users")}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "등록 중..." : "등록"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
