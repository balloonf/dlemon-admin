"use client";

import { useState, useEffect } from "react";
import { Photo, PhotoStatus } from "@/lib/definitions";
import { getPhotoById, updatePhotoStatus, updatePhotoNotes, deletePhoto } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "./badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface PhotoDetailProps {
  id: string;
}

export function PhotoDetail({ id }: PhotoDetailProps) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 사진 데이터 로드
  const loadPhoto = async () => {
    setLoading(true);
    try {
      const data = await getPhotoById(id);
      setPhoto(data);
      setNotes(data.notes || "");
    } catch (error) {
      console.error("사진 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // 메모 저장
  const saveNotes = async () => {
    if (!photo) return;
    
    setIsSaving(true);
    try {
      const updatedPhoto = await updatePhotoNotes(photo.id, notes);
      setPhoto(updatedPhoto);
    } catch (error) {
      console.error("메모 저장 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // 사진 삭제
  const handleDelete = async () => {
    if (!photo || !window.confirm("이 사진을 삭제하시겠습니까?")) return;
    
    setIsDeleting(true);
    try {
      await deletePhoto(photo.id);
      // 삭제 후 상태 업데이트
      setPhoto({
        ...photo,
        status: "deleted"
      });
    } catch (error) {
      console.error("사진 삭제 실패:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " Bytes";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };
  
  // 날짜 포맷
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadPhoto();
  }, [id]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p>데이터를 불러오는 중...</p>
        <Progress className="mt-2" value={undefined} />
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">사진을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
        <div className="w-full max-w-md h-96 bg-gray-200 rounded-md overflow-hidden relative">
          {photo.filePath ? (
            <div className="relative h-full">
              {/* 이미지 확대/축소 버튼 */}
              <div className="absolute top-2 right-2 z-10 flex space-x-1">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100"
                  onClick={() => window.open(photo.filePath, '_blank')}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                    />
                  </svg>
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100"
                  onClick={() => window.open(photo.filePath, '_blank')}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                </Button>
              </div>
              
              {/* 실제 이미지 */}
              <img 
                src={photo.filePath} 
                alt={photo.fileName} 
                className="w-full h-full object-contain" 
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              이미지 미리보기를 로드할 수 없습니다.
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">사진 ID</p>
          <p className="font-medium">{photo.id}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">파일명</p>
          <p className="font-medium">{photo.fileName}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">환자 코드</p>
          <p className="font-medium">{photo.patientCode}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">기관</p>
          <p className="font-medium">{photo.institutionName}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">크기</p>
          <p className="font-medium">{formatFileSize(photo.fileSize)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">해상도</p>
          <p className="font-medium">{`${photo.imageWidth} x ${photo.imageHeight}`}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">촬영일</p>
          <p className="font-medium">{formatDate(photo.takenAt)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">업로드일</p>
          <p className="font-medium">{formatDate(photo.uploadedAt)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">업로더</p>
          <p className="font-medium">{photo.userName}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">상태</p>
          <Badge className={
            photo.status === "pending" ? "bg-yellow-100 text-yellow-800" :
            photo.status === "analyzed" ? "bg-green-100 text-green-800" :
            photo.status === "failed" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          }>
            {photo.status === "pending" && "대기 중"}
            {photo.status === "analyzed" && "분석 완료"}
            {photo.status === "failed" && "분석 실패"}
            {photo.status === "deleted" && "삭제됨"}
          </Badge>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-gray-500 mb-1">메모</p>
        <div className="flex space-x-2">
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="메모 입력"
            disabled={photo.status === "deleted" || isSaving}
          />
          <Button
            onClick={saveNotes}
            disabled={photo.status === "deleted" || isSaving}
          >
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
      
      {photo.status !== "deleted" && (
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "삭제 중..." : "사진 삭제"}
          </Button>
        </div>
      )}
    </div>
  );
}
