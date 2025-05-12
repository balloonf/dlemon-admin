"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (checked: boolean | "indeterminate") => {
    setFormData((prev) => ({ ...prev, rememberMe: checked === true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demonstration purposes only - in a real app, we would validate against a backend
    if (formData.username === "admin" && formData.password === "password") {
      // Mock successful login
      router.push("/dashboard");
    } else {
      setError("아이디/비밀번호 불일치가 있습니다");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6">
            {/* Replace with actual logo */}
            <div className="text-3xl font-bold text-blue-600">d.LEMON</div>
          </div>
          <h1 className="text-2xl font-bold">안드로겐 탈모진단 AI의료기기 통합관리자</h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="아이디를 입력해 주세요"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력해 주세요"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="text-sm font-medium text-red-500">{error}</div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={handleCheckbox}
              />
              <Label htmlFor="rememberMe">아이디/비밀번호 저장</Label>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            로그인
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          아이디/비밀번호 분실 시 관리자에게 문의하여 주시기 바랍니다.
        </div>
      </div>
    </div>
  );
}