"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  FileText,
  CheckCircle,
  XCircle,
  Calendar, 
  Clock
} from "lucide-react";

import { InstitutionService } from "@/services/institution-service";
import { Institution } from "@/types/institution";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// We'll load the real data from the service

export default function InstitutionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "approve" | "none";
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: "none",
    title: "",
    description: "",
  });

  const [formData, setFormData] = useState<Institution | null>(null);

  // Fetch institution data from service
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const id = Number(params.id);
        const data = await InstitutionService.getById(id);
        
        if (data) {
          setInstitution(data);
          setFormData(data);
        } else {
          alert("기관 정보를 찾을 수 없습니다.");
          router.push("/dashboard/institution");
        }
      } catch (error) {
        console.error("Failed to fetch institution details:", error);
        alert("기관 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    if (!formData) return;
    
    setFormData((prev) => ({
      ...prev!,
      category: value as any, // Type assertion for simplicity
    }));
  };

  const handleCancel = () => {
    if (!institution) return;
    
    setFormData(institution);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData) return;
    
    try {
      const id = Number(params.id);
      const updatedInstitution = await InstitutionService.update(id, formData);
      
      if (updatedInstitution) {
        setInstitution(updatedInstitution);
        setIsEditing(false);
        alert("기관 정보가 수정되었습니다.");
      }
    } catch (error) {
      console.error("Failed to update institution:", error);
      alert("기관 정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleApprove = async () => {
    try {
      const id = Number(params.id);
      const updatedInstitution = await InstitutionService.approve(id);
      
      if (updatedInstitution) {
        setInstitution(updatedInstitution);
        alert("기관이 승인되었습니다.");
      }
    } catch (error) {
      console.error("Failed to approve institution:", error);
      alert("기관 승인 중 오류가 발생했습니다.");
    } finally {
      setConfirmDialog({
        isOpen: false,
        type: "none",
        title: "",
        description: "",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const id = Number(params.id);
      const success = await InstitutionService.delete(id);
      
      if (success) {
        alert("기관이 삭제되었습니다.");
        router.push("/dashboard/institution");
      }
    } catch (error) {
      console.error("Failed to delete institution:", error);
      alert("기관 삭제 중 오류가 발생했습니다.");
    } finally {
      setConfirmDialog({
        isOpen: false,
        type: "none",
        title: "",
        description: "",
      });
    }
  };

  const handleConfirmDialog = (type: "delete" | "approve") => {
    if (type === "delete") {
      setConfirmDialog({
        isOpen: true,
        type: "delete",
        title: "기관 삭제",
        description: "이 기관을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      });
    } else if (type === "approve") {
      setConfirmDialog({
        isOpen: true,
        type: "approve",
        title: "기관 승인",
        description: "이 기관을 승인하시겠습니까?",
      });
    }
  };

  const handleTrialStatusChange = (value: string) => {
    if (!formData) return;
    
    const status = value === "trial" ? "trial" : "active";
    
    // Update the status
    setFormData(prev => ({
      ...prev!,
      licenseStatus: status as any,
      licenseType: value === "trial" ? "무료체험" : "정식 라이선스"
    }));
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4 h-8 w-8 rounded-full border-b-2 border-t-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">기관 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }
  
  if (!institution || !formData) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">기관 정보를 찾을 수 없습니다</p>
          <p className="text-muted-foreground mb-4">요청하신 기관 정보가 존재하지 않거나 접근할 수 없습니다.</p>
          <Button 
            onClick={() => router.push("/dashboard/institution")}
            variant="default"
          >
            기관 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{institution.name} {'>'} 기관 정보 관리(상세)</h2>
          <p className="text-muted-foreground">
            기관 상세 정보를 조회하고 관리합니다.
          </p>
        </div>
        <div className="flex space-x-2">
          {institution.status !== "approved" && (
            <Button 
              onClick={() => handleConfirmDialog("approve")}
              variant="default"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              승인
            </Button>
          )}
          <Button 
            onClick={() => handleConfirmDialog("delete")}
            variant="destructive"
          >
            <XCircle className="mr-2 h-4 w-4" />
            삭제
          </Button>
          <Button 
            onClick={() => router.push("/dashboard/institution")}
            variant="outline"
          >
            목록
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList>
          <TabsTrigger value="basic-info">기본 정보</TabsTrigger>
          <TabsTrigger value="license">라이선스 정보</TabsTrigger>
          <TabsTrigger value="admin">기관 관리자</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>기관 기본 정보</CardTitle>
              <CardDescription>
                기관의 기본 정보를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">기관 카테고리</Label>
                  <Select
                    disabled={!isEditing}
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="병의원">병의원</SelectItem>
                      <SelectItem value="대학병원">대학병원</SelectItem>
                      <SelectItem value="일상연구소">일상연구소</SelectItem>
                      <SelectItem value="헤어샵">헤어샵</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">승인 상태</Label>
                  <div className="h-10 px-3 py-2 border rounded-md flex items-center">
                    {institution.status === "approved" ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        승인됨
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        미승인
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">기관명 (한글)</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="기관명을 입력하세요"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nameEn">기관명 (영문)</Label>
                  <Input
                    id="nameEn"
                    name="nameEn"
                    placeholder="영문 기관명을 입력하세요"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="representative">대표자명</Label>
                  <Input
                    id="representative"
                    name="representative"
                    placeholder="대표자명을 입력하세요"
                    value={formData.representative}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactInfo">기관 연락처</Label>
                  <Input
                    id="contactInfo"
                    name="contactInfo"
                    placeholder="연락처를 입력하세요"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="웹사이트 URL을 입력하세요"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessNumber">사업자 등록번호</Label>
                <Input
                  id="businessNumber"
                  name="businessNumber"
                  placeholder="000-00-00000 형식으로 입력하세요"
                  value={formData.businessNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessCertificate">사업자등록증</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="businessCertificate"
                      name="businessCertificate"
                      value={formData.businessCertificate}
                      disabled={true}
                    />
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      보기
                    </Button>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        업로드
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicalLicense">의료기관 개설 신고증/허가증</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="medicalLicense"
                      name="medicalLicense"
                      value={formData.medicalLicense}
                      disabled={true}
                    />
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      보기
                    </Button>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        업로드
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="우편번호"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-1/3"
                  />
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      우편번호 찾기
                    </Button>
                  )}
                </div>
                <Input
                  id="address"
                  name="address"
                  placeholder="기본 주소"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mb-2"
                />
                <Input
                  id="addressDetail"
                  name="addressDetail"
                  placeholder="상세 주소"
                  value={formData.addressDetail}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mb-2"
                />
                <Input
                  id="addressEn"
                  name="addressEn"
                  placeholder="영문 주소"
                  value={formData.addressEn}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label>등록일</Label>
                <div className="h-10 px-3 py-2 border rounded-md flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{institution.registrationDate}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="default">
                  수정하기
                </Button>
              ) : (
                <>
                  <Button onClick={handleCancel} variant="outline">
                    취소
                  </Button>
                  <Button onClick={handleSave}>
                    저장하기
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="license" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>라이선스 정보</CardTitle>
              <CardDescription>
                기관의 라이선스 상태 및 정보를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseType">라이선스 유형</Label>
                  <div className="h-10 px-3 py-2 border rounded-md flex items-center">
                    {formData.licenseType}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">만료일</Label>
                  <div className="h-10 px-3 py-2 border rounded-md flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formData.licenseExpiry}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label>무료체험 상태 설정</Label>
                <RadioGroup 
                  defaultValue={formData.licenseType === "무료체험" ? "trial" : "licensed"}
                  onValueChange={handleTrialStatusChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="trial" id="trial" />
                    <Label htmlFor="trial">무료체험</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="licensed" id="licensed" />
                    <Label htmlFor="licensed">정식 라이선스 (사용중)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2 pt-4">
                <Button variant="outline" className="w-full">
                  라이선스 상세 관리 페이지로 이동
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>기관 관리자 정보</CardTitle>
              <CardDescription>
                기관 관리자 계정 정보를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminId">관리자 ID</Label>
                  <Input
                    id="adminId"
                    name="adminId"
                    value={formData.adminId}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminName">관리자명</Label>
                  <Input
                    id="adminName"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">관리자 이메일</Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminPhone">관리자 연락처</Label>
                  <Input
                    id="adminPhone"
                    name="adminPhone"
                    value={formData.adminPhone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="pt-4">
                  <Button variant="outline">
                    관리자 계정 선택
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => {
        if (!open) {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>
              {confirmDialog.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
            >
              취소
            </Button>
            <Button 
              variant={confirmDialog.type === "delete" ? "destructive" : "default"} 
              onClick={confirmDialog.type === "delete" ? handleDelete : handleApprove}
            >
              {confirmDialog.type === "delete" ? "삭제" : "승인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}