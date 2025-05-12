import React from "react";
import { redirect } from "next/navigation";
import { CreateUserForm } from "../components/create-user-form";
import { getInstitutions } from "@/lib/api";

export default async function NewUserPage() {
  // 기관 목록 가져오기
  const institutions = await getInstitutions();
  
  if (!institutions || institutions.length === 0) {
    // 기관이 없는 경우 기관 생성 페이지로 리다이렉트
    redirect("/dashboard/institution");
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">소누피부과의원 &gt; 직원 정보 관리(등록)</h1>
        <p className="text-muted-foreground">
          새로운 직원을 등록하세요. 모든 필수 항목을 입력해야 합니다.
        </p>
      </div>
      
      <div className="rounded-lg border p-6">
        <CreateUserForm institutions={institutions} />
      </div>
    </div>
  );
}
