import React from "react";
import { EditMobileUserForm } from "../components/edit-mobile-user-form";
import { getMobileUserById } from "@/lib/mobile-api";
import { getInstitutions, getLicenses } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function EditMobileUserPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // 기관 목록 가져오기
    const institutions = await getInstitutions();
    
    // 라이선스 목록 가져오기
    const { licenses } = await getLicenses();
    
    // 사용자 정보 가져오기
    const mobileUser = await getMobileUserById(params.id);
    
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Mobile앱 사용자 수정</h1>
        <EditMobileUserForm 
          mobileUser={mobileUser} 
          institutions={institutions} 
          licenses={licenses} 
        />
      </div>
    );
  } catch (error) {
    // 사용자를 찾을 수 없는 경우 404 페이지 표시
    console.error("Mobile앱 사용자 정보 조회 오류:", error);
    notFound();
  }
}
