"use client";

import { useState, useRef, ChangeEvent, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PhotoUploadData } from "@/lib/definitions";
import { uploadPhoto } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadIcon, X, ImageIcon, FolderIcon } from "lucide-react";

interface PhotoFile {
  file: File;
  previewUrl: string;
  type: string;
  progress: number;
  error?: string;
  uploaded?: boolean;
}

export function PhotoUploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  
  const [patientId, setPatientId] = useState("");
  const [patientCode, setPatientCode] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [userId, setUserId] = useState("");
  const [takenAt, setTakenAt] = useState("");
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("single");
  const [selectedFiles, setSelectedFiles] = useState<PhotoFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const processFile = (file: File): Promise<PhotoFile> => {
    return new Promise((resolve, reject) => {
      // 이미지 타입 확인 (jpg, jpeg, png만 허용)
      if (!file.type.match('image/jpeg') && !file.type.match('image/jpg') && !file.type.match('image/png')) {
        reject("JPG 또는 PNG 이미지 파일만 업로드 가능합니다.");
        return;
      }
      
      // 크기 제한 체크 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        reject("파일 크기는 10MB 이하여야 합니다.");
        return;
      }
      
      // 파일 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        // 파일 유형 판단 (파일명 기준)
        let type = "기타";
        const fileName = file.name.toLowerCase();
        
        if (fileName.includes("두정부") || fileName.includes("top")) {
          type = "두정부";
        } else if (fileName.includes("전두부") || fileName.includes("front")) {
          type = "전두부";
        } else if (fileName.includes("후두부") || fileName.includes("back")) {
          type = "후두부";
        } else if (fileName.includes("측두부") || fileName.includes("side")) {
          type = "측두부";
        }
        
        resolve({
          file,
          previewUrl: reader.result as string,
          type,
          progress: 0
        });
      };
      
      reader.onerror = () => {
        reject("파일 미리보기를 생성할 수 없습니다.");
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  // 드래그 앤 드롭 처리
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add("border-blue-400", "bg-blue-50");
    }
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-blue-400", "bg-blue-50");
    }
  }, []);
  
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-blue-400", "bg-blue-50");
    }
    
    if (uploading) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;
    
    try {
      if (activeTab === "single") {
        // 단일 업로드 모드에서는 첫 번째 파일만 처리
        const photoFile = await processFile(droppedFiles[0]);
        setSelectedFiles([photoFile]);
      } else {
        // 다중 업로드 모드
        const newFiles = [...selectedFiles];
        
        for (const file of droppedFiles) {
          try {
            const photoFile = await processFile(file);
            // 중복 방지 (같은 이름의 파일이 이미 있는지 확인)
            if (!newFiles.some(f => f.file.name === file.name)) {
              newFiles.push(photoFile);
            }
          } catch (error) {
            console.error("파일 처리 오류:", error);
          }
        }
        
        setSelectedFiles(newFiles);
      }
      
      setError(null);
    } catch (error) {
      console.error("파일 처리 오류:", error);
      setError(typeof error === 'string' ? error : "파일 처리 중 오류가 발생했습니다.");
    }
  }, [activeTab, selectedFiles, uploading]);
  
  // 파일 선택 처리
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      if (activeTab === "single") {
        // 단일 업로드 모드에서는 첫 번째 파일만 처리
        const photoFile = await processFile(files[0]);
        setSelectedFiles([photoFile]);
      } else {
        // 다중 업로드 모드
        const newFiles = [...selectedFiles];
        
        for (let i = 0; i < files.length; i++) {
          try {
            const photoFile = await processFile(files[i]);
            // 중복 방지 (같은 이름의 파일이 이미 있는지 확인)
            if (!newFiles.some(f => f.file.name === files[i].name)) {
              newFiles.push(photoFile);
            }
          } catch (error) {
            console.error("파일 처리 오류:", error);
          }
        }
        
        setSelectedFiles(newFiles);
      }
      
      // 파일 선택 후 입력 필드 초기화 (같은 파일을 다시 선택할 수 있도록)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      setError(null);
    } catch (error) {
      console.error("파일 처리 오류:", error);
      setError(typeof error === 'string' ? error : "파일 처리 중 오류가 발생했습니다.");
    }
  };
  
  // 파일 삭제
  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };
  
  // 파일 업로드 버튼 클릭
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  // 단일 파일 업로드 시뮬레이션
  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // 업로드 완료 후 처리
        setTimeout(() => {
          setUploading(false);
          router.push("/dashboard/photos");
        }, 500);
      }
    }, 300);
  };
  
  // 다중 파일 업로드 시뮬레이션
  const simulateMultipleUploadProgress = async () => {
    const updatedFiles = [...selectedFiles];
    
    // 각 파일마다 순차적으로 진행
    for (let i = 0; i < updatedFiles.length; i++) {
      // 이미 업로드된 파일은 건너뛰기
      if (updatedFiles[i].uploaded) continue;
      
      let progress = 0;
      
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          progress += 10;
          
          // 선택된 파일의 진행률 업데이트
          updatedFiles[i] = {
            ...updatedFiles[i],
            progress
          };
          
          setSelectedFiles([...updatedFiles]);
          
          if (progress >= 100) {
            clearInterval(interval);
            
            // 파일 업로드 완료 표시
            updatedFiles[i] = {
              ...updatedFiles[i],
              uploaded: true
            };
            
            setSelectedFiles([...updatedFiles]);
            resolve();
          }
        }, 200);
      });
    }
    
    // 모든 파일 업로드 완료 후 처리
    setTimeout(() => {
      setUploading(false);
      router.push("/dashboard/photos");
    }, 500);
  };
  
  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      setError("업로드할 사진을 선택해주세요.");
      return;
    }
    
    if (!patientId || !patientCode || !institutionId || !userId) {
      setError("필수 입력 항목을 모두 입력해주세요.");
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      if (activeTab === "single") {
        // 단일 파일 업로드
        const uploadData: PhotoUploadData = {
          patientId,
          patientCode,
          institutionId,
          userId,
          file: selectedFiles[0].file,
          takenAt: takenAt || undefined,
          notes: notes || undefined,
        };
        
        // 업로드 API 호출
        await uploadPhoto(uploadData);
        
        // 업로드 진행률 시뮬레이션
        simulateUploadProgress();
      } else {
        // 다중 파일 업로드
        // 실제 구현에서는 여러 파일을 병렬 또는 순차적으로 업로드
        for (const photoFile of selectedFiles) {
          const uploadData: PhotoUploadData = {
            patientId,
            patientCode,
            institutionId,
            userId,
            file: photoFile.file,
            takenAt: takenAt || undefined,
            notes: notes || undefined,
          };
          
          // 업로드 API 호출 (실제로는 병렬 처리 또는 큐 사용)
          await uploadPhoto(uploadData);
        }
        
        // 다중 업로드 진행률 시뮬레이션
        simulateMultipleUploadProgress();
      }
    } catch (error) {
      console.error("업로드 실패:", error);
      setError("사진 업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
      setUploading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* 업로드 방식 선택 탭 */}
      <Tabs defaultValue="single" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single" disabled={uploading}>단일 사진 업로드</TabsTrigger>
          <TabsTrigger value="multiple" disabled={uploading}>다중 사진 업로드</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-4 mt-4">
          {/* 단일 사진 업로드 영역 */}
          <div className="space-y-2">
            <Label htmlFor="photo">사진 파일</Label>
            <div 
              ref={dropAreaRef}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
              onClick={handleBrowseClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                id="photo"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
              
              {selectedFiles.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div className="w-64 h-64 overflow-hidden mb-2 bg-gray-100 rounded-md">
                    <img
                      src={selectedFiles[0].previewUrl}
                      alt="미리보기"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{selectedFiles[0].type}</Badge>
                    <p className="text-sm text-gray-600">{selectedFiles[0].file.name}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {`${(selectedFiles[0].file.size / (1024 * 1024)).toFixed(2)} MB`}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleBrowseClick}
                      disabled={uploading}
                    >
                      사진 변경
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedFiles([])}
                      disabled={uploading}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-12">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 font-medium">
                    클릭하여 사진 선택 또는 드래그 앤 드롭
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG (최대 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="multiple" className="space-y-4 mt-4">
          {/* 다중 사진 업로드 영역 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="photos">여러 사진 업로드</Label>
              <p className="text-sm text-gray-500">
                {selectedFiles.length > 0 ? `${selectedFiles.length}개 선택됨` : "최대 10개 파일 업로드 가능"}
              </p>
            </div>
            
            <div 
              ref={dropAreaRef}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition min-h-[200px]"
              onClick={handleBrowseClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                id="photos"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={handleFileChange}
                multiple
                disabled={uploading}
              />
              
              {selectedFiles.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedFiles.map((photoFile, index) => (
                    <div key={index} className="relative">
                      <div className="bg-gray-100 rounded-md overflow-hidden aspect-square">
                        <img
                          src={photoFile.previewUrl}
                          alt={`미리보기 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* 진행률 표시 (업로드 중일 때) */}
                      {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <div className="bg-white rounded-md p-2 w-4/5">
                            <Progress value={photoFile.progress} className="h-2" />
                            <p className="text-xs text-center mt-1">{photoFile.progress}%</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-1">
                        <Badge variant="outline" className="text-xs truncate max-w-[100px]">
                          {photoFile.type}
                        </Badge>
                        
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                          disabled={uploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1" title={photoFile.file.name}>
                        {photoFile.file.name.length > 15 
                          ? `${photoFile.file.name.substring(0, 15)}...` 
                          : photoFile.file.name}
                      </p>
                    </div>
                  ))}
                  
                  {/* 추가 업로드 아이콘 */}
                  {selectedFiles.length < 10 && (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square cursor-pointer hover:bg-gray-50"
                      onClick={handleBrowseClick}
                    >
                      <div className="text-center">
                        <ImageIcon className="h-10 w-10 text-gray-400 mx-auto" />
                        <p className="text-xs mt-2 text-gray-500">추가</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12">
                  <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 font-medium">
                    클릭하여 사진 선택 또는 여러 파일을 드래그 앤 드롭
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG (파일당 최대 10MB, 최대 10개 파일)
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* 업로드 정보 섹션 */}
      <div className="bg-white p-6 rounded-md shadow-sm border">
        <h3 className="text-lg font-medium mb-4">환자 및 기관 정보</h3>
        
        {/* 환자 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="patientId">환자 ID*</Label>
            <Input
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              disabled={uploading}
            />
          </div>
          
          <div>
            <Label htmlFor="patientCode">환자 코드*</Label>
            <Input
              id="patientCode"
              value={patientCode}
              onChange={(e) => setPatientCode(e.target.value)}
              required
              disabled={uploading}
            />
          </div>
          
          <div>
            <Label htmlFor="institutionId">기관*</Label>
            <Select
              value={institutionId}
              onValueChange={setInstitutionId}
              disabled={uploading}
            >
              <SelectTrigger id="institutionId">
                <SelectValue placeholder="기관 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-institution">기관 선택</SelectItem>
                <SelectItem value="1">서울대학교병원</SelectItem>
                <SelectItem value="2">연세세브란스병원</SelectItem>
                <SelectItem value="3">아산병원</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="userId">촬영자*</Label>
            <Select
              value={userId}
              onValueChange={setUserId}
              disabled={uploading}
            >
              <SelectTrigger id="userId">
                <SelectValue placeholder="촬영자 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-photographer">촬영자 선택</SelectItem>
                <SelectItem value="1">김관리</SelectItem>
                <SelectItem value="2">이사용</SelectItem>
                <SelectItem value="3">박의사</SelectItem>
                <SelectItem value="4">정간호</SelectItem>
                <SelectItem value="5">최원장</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 추가 정보 */}
        <h3 className="text-lg font-medium mb-4">추가 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="takenAt">촬영일</Label>
            <Input
              id="takenAt"
              type="datetime-local"
              value={takenAt}
              onChange={(e) => setTakenAt(e.target.value)}
              disabled={uploading}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">메모</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="메모 입력 (선택사항)"
              disabled={uploading}
            />
          </div>
        </div>
      </div>
      
      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm">
          <p className="font-medium">오류</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* 업로드 진행 상태 (단일 업로드) */}
      {uploading && activeTab === "single" && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md space-y-2">
          <div className="flex justify-between text-sm text-blue-700">
            <span className="font-medium">업로드 중...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      {/* 제출 버튼 */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/photos")}
          disabled={uploading}
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={uploading || selectedFiles.length === 0 || !patientId || !patientCode || !institutionId || !userId}
        >
          {uploading ? "업로드 중..." : (
            activeTab === "single" ? "업로드" : `${selectedFiles.length}개 사진 업로드`
          )}
        </Button>
      </div>
    </form>
  );
}
