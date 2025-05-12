import React from "react";
import { notFound } from "next/navigation";
import { EditUserForm } from "../components/edit-user-form";
import { getUserById, getInstitutions } from "@/lib/api";

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // 이용자 상세 정보 가져오기
    const user = await getUserById(params.id);
    
    // 기관 목록 가져오기
    const institutions = await getInstitutions();
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">소누피부과의원 &gt; 직원 정보 관리(상세)</h1>
          <p className="text-muted-foreground">
            직원 정보를 확인하고 수정할 수 있습니다.
          </p>
        </div>
        
        <div className="rounded-lg border p-6">
          <EditUserForm user={user} institutions={institutions} />
        </div>
      </div>
    );
  } catch (error) {
    // 사용자가 존재하지 않는 경우 404 페이지
    notFound();
  }
}
