import React from "react";
import { CreateMobileUserForm } from "../components/create-mobile-user-form";
import { getInstitutions, getLicenses } from "@/lib/api";

export default async function NewMobileUserPage() {
  // 기관 목록 가져오기
  const institutions = await getInstitutions();
  
  // 라이선스 목록 가져오기
  const { licenses } = await getLicenses();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mobile앱 사용자 등록</h1>
      <CreateMobileUserForm institutions={institutions} licenses={licenses} />
    </div>
  );
}
