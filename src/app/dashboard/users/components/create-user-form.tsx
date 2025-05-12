"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Institution } from "@/lib/definitions";

// 사용자 생성 폼 스키마 정의
const userFormSchema = z.object({
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
  username: z.string().min(4, "아이디는 최소 4자 이상이어야 합니다."),
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  phoneNumber: z.string().regex(/^\d{2,3}-\d{3,4}-\d{4}$/, "유효한 전화번호 형식이 아닙니다 (예: 010-1234-5678)."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  confirmPassword: z.string(),
  institutionId: z.string().min(1, "소속기관을 선택해주세요."),
  role: z.enum(["admin", "member"]),
  status: z.enum(["active", "pending", "inactive"]),
  birthDate: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  jobTitle: z.string().optional(),
  licenseNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function CreateUserForm({ institutions }: { institutions: Institution[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 폼 정의
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      institutionId: "",
      role: "member",
      status: "active",
      birthDate: "",
      gender: undefined,
      jobTitle: "",
      licenseNumber: "",
    },
  });
  
  // 폼 제출 핸들러
  async function onSubmit(values: UserFormValues) {
    try {
      setIsSubmitting(true);
      
      // 선택한 기관의 이름 가져오기
      const selectedInstitution = institutions.find(
        (inst) => inst.id === values.institutionId
      );
      
      // 사용자 생성 API 호출
      await createUser({
        name: values.name,
        username: values.username,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        institutionId: values.institutionId,
        institutionName: selectedInstitution?.name || "",
        role: values.role,
        status: values.status,
        birthDate: values.birthDate,
        gender: values.gender,
        jobTitle: values.jobTitle,
        licenseNumber: values.licenseNumber,
      });
      
      toast({
        title: "이용자 생성 성공",
        description: "새로운 이용자가 성공적으로 생성되었습니다.",
      });
      
      // 이용자 목록 페이지로 리다이렉트
      router.push("/dashboard/users");
      router.refresh();
    } catch (error) {
      console.error("이용자 생성 오류:", error);
      toast({
        title: "이용자 생성 실패",
        description: "이용자 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 소속 기관 정보 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">소속 기관</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="institutionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>소속기관명</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="소속기관 선택" />
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>관리권한</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="권한 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">기관관리자</SelectItem>
                      <SelectItem value="member">기관사용자</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* 계정 정보 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">계정 정보</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>아이디</FormLabel>
                  <FormControl>
                    <Input placeholder="아이디" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder="이메일" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input placeholder="비밀번호" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input placeholder="비밀번호 확인" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* 인적 정보 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">인적 정보</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input placeholder="이름" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>생년월일</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>성별</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="성별 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>휴대폰 번호</FormLabel>
                  <FormControl>
                    <Input placeholder="000-0000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 직업 및 면허 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">직업 및 면허</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>직업</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="직업 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="의사">의사</SelectItem>
                      <SelectItem value="간호사">간호사</SelectItem>
                      <SelectItem value="피부관리사">피부관리사</SelectItem>
                      <SelectItem value="행정직원">행정직원</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>면허번호</FormLabel>
                  <FormControl>
                    <Input placeholder="면허번호" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* 계정 상태 정보 */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">계정 상태</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상태</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">승인됨</SelectItem>
                      <SelectItem value="pending">미승인</SelectItem>
                      <SelectItem value="inactive">비활성</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/users")}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "처리중..." : "저장"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
