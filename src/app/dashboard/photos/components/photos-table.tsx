"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnalysisResult, Photo, PhotoQuality, PhotoStatus } from "@/lib/definitions";
import { getPhotos, updatePhotoStatus, analyzePhoto, deletePhoto } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "./badge";
import { Progress } from "@/components/ui/progress";
import { Pagination } from "./pagination";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileIcon, Trash2Icon, FolderIcon, RefreshCwIcon, FileTextIcon } from "lucide-react";

export function PhotosTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processingPhotoId, setProcessingPhotoId] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const limit = 10;
  
  // 상태별 Badge 색상
  const statusBadge = (status: PhotoStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "analyzed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "deleted":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // 품질별 Badge 색상
  const qualityBadge = (quality: PhotoQuality) => {
    switch (quality) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-orange-100 text-orange-800";
      case "invalid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // 분석 결과별 Badge 색상
  const resultBadge = (result: AnalysisResult | null) => {
    if (!result) return "bg-gray-100 text-gray-800";
    
    switch (result) {
      case "normal":
        return "bg-green-100 text-green-800";
      case "abnormal":
        return "bg-red-100 text-red-800";
      case "indeterminate":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // 날짜 포맷
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  
  // 사진 유형 표시
  const getPhotoType = (fileName: string): string => {
    if (fileName.includes("두정부") || fileName.toLowerCase().includes("top")) {
      return "두정부";
    } else if (fileName.includes("전두부") || fileName.toLowerCase().includes("front")) {
      return "전두부";
    } else if (fileName.includes("후두부") || fileName.toLowerCase().includes("back")) {
      return "후두부";
    } else if (fileName.includes("측두부") || fileName.toLowerCase().includes("side")) {
      return "측두부";
    } else {
      return "기타";
    }
  };
  
  // 사진 로드
  const loadPhotos = async () => {
    setLoading(true);
    try {
      // 모든 검색 파라미터 추출
      const search = searchParams.get("search") || undefined;
      const status = searchParams.get("status") as PhotoStatus || undefined;
      const quality = searchParams.get("quality") as PhotoQuality || undefined;
      const analysisResult = searchParams.get("analysisResult") as AnalysisResult || undefined;
      const institutionId = searchParams.get("institutionId") || undefined;
      const patientId = searchParams.get("patientId") || undefined;
      const startDate = searchParams.get("startDate") || undefined;
      const endDate = searchParams.get("endDate") || undefined;
      
      const { photos, total } = await getPhotos({
        search,
        status,
        quality,
        analysisResult,
        institutionId,
        patientId,
        startDate,
        endDate,
        page,
        limit,
      });
      
      setPhotos(photos);
      setTotal(total);
    } catch (error) {
      console.error("사진 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // 선택된 모든 사진 처리
  const handleBatchAnalyze = async () => {
    if (selectedPhotos.length === 0) return;
    
    setBatchProcessing(true);
    try {
      // 선택된 사진 중 대기 중인 사진만 필터링
      const pendingPhotos = photos.filter(
        photo => selectedPhotos.includes(photo.id) && photo.status === "pending"
      );
      
      // 순차적으로 분석 요청
      for (const photo of pendingPhotos) {
        try {
          setProcessingPhotoId(photo.id);
          const updatedPhoto = await analyzePhoto(photo.id);
          
          // 업데이트된 사진 데이터로 목록 갱신
          setPhotos(prevPhotos => 
            prevPhotos.map(p => p.id === photo.id ? updatedPhoto : p)
          );
          
          // 짧은 지연으로 UI에 진행 상황 표시
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`사진 ${photo.id} 분석 실패:`, error);
        }
      }
    } finally {
      setProcessingPhotoId(null);
      setBatchProcessing(false);
      // 분석 완료 후 선택 해제
      setSelectedPhotos([]);
    }
  };
  
  // 선택된 사진 삭제
  const handleBatchDelete = async () => {
    if (selectedPhotos.length === 0) return;
    
    setBatchProcessing(true);
    try {
      // 순차적으로 삭제 요청
      for (const photoId of selectedPhotos) {
        try {
          await deletePhoto(photoId);
          
          // 삭제된 사진 상태 업데이트
          setPhotos(prevPhotos => 
            prevPhotos.map(photo => 
              photo.id === photoId 
                ? { ...photo, status: "deleted" } 
                : photo
            )
          );
          
          // 짧은 지연으로 UI에 진행 상황 표시
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`사진 ${photoId} 삭제 실패:`, error);
        }
      }
    } finally {
      setBatchProcessing(false);
      // 삭제 완료 후 선택 해제
      setSelectedPhotos([]);
      setDeleteDialogOpen(false);
    }
  };
  
  // 리포트 생성 페이지로 이동 (선택된 사진 ID 전달)
  const handleBatchCreateReport = () => {
    if (selectedPhotos.length === 0) return;
    
    // URL 쿼리 파라미터로 선택된 사진 ID 추가
    const queryParams = new URLSearchParams();
    selectedPhotos.forEach(photoId => {
      queryParams.append("photoIds", photoId);
    });
    
    router.push(`/dashboard/reports/new?${queryParams.toString()}`);
  };
  
  // 선택된 항목 관리
  const toggleSelectPhoto = (photoId: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };
  
  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedPhotos.length === photos.length) {
      // 전체 해제
      setSelectedPhotos([]);
    } else {
      // 전체 선택 (현재 표시된 항목만)
      setSelectedPhotos(photos.map(photo => photo.id));
    }
  };
  
  // 선택 상태 감시
  useEffect(() => {
    setShowBatchActions(selectedPhotos.length > 0);
  }, [selectedPhotos]);
  
  // 사진 분석 요청 (단일)
  const handleAnalyze = async (id: string) => {
    setProcessingPhotoId(id);
    try {
      const updatedPhoto = await analyzePhoto(id);
      // 성공적으로 분석 완료 시 데이터 업데이트
      setPhotos(photos.map(photo => 
        photo.id === id ? updatedPhoto : photo
      ));
    } catch (error) {
      console.error("사진 분석 실패:", error);
    } finally {
      setProcessingPhotoId(null);
    }
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 검색 파라미터나 페이지 변경 시 데이터 로드
  useEffect(() => {
    loadPhotos();
  }, [searchParams, page]);

  return (
    <div className="space-y-4">
      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>사진 일괄 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              선택한 {selectedPhotos.length}개의 사진을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={batchProcessing}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchDelete}
              disabled={batchProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {batchProcessing ? (
                <>
                  <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                "삭제"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading ? (
        <div className="py-10 text-center">
          <p>데이터를 불러오는 중...</p>
          <Progress className="mt-2" value={undefined} />
        </div>
      ) : photos.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 배치 작업 도구 모음 */}
          {showBatchActions && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-medium text-blue-700 mr-2">
                  {selectedPhotos.length}개 항목 선택됨
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedPhotos([])}
                  className="text-blue-600"
                  disabled={batchProcessing}
                >
                  선택 해제
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBatchAnalyze}
                  disabled={batchProcessing || !selectedPhotos.some(id => 
                    photos.find(p => p.id === id)?.status === "pending"
                  )}
                  className="bg-white"
                >
                  <RefreshCwIcon className="mr-2 h-4 w-4" />
                  일괄 분석
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBatchCreateReport}
                  disabled={batchProcessing || !selectedPhotos.some(id => 
                    photos.find(p => p.id === id)?.status === "analyzed"
                  )}
                  className="bg-white"
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  리포트 생성
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={batchProcessing}
                  className="bg-white text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  일괄 삭제
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={photos.length > 0 && selectedPhotos.length === photos.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="모든 항목 선택"
                      disabled={batchProcessing}
                    />
                  </TableHead>
                  <TableHead>썸네일</TableHead>
                  <TableHead>파일명</TableHead>
                  <TableHead>사진 유형</TableHead>
                  <TableHead>환자 정보</TableHead>
                  <TableHead>기관</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>품질</TableHead>
                  <TableHead>분석 결과</TableHead>
                  <TableHead>촬영일</TableHead>
                  <TableHead>업로드일</TableHead>
                  <TableHead className="text-right">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {photos.map((photo) => (
                  <TableRow 
                    key={photo.id} 
                    className={`hover:bg-gray-50 ${selectedPhotos.includes(photo.id) ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedPhotos.includes(photo.id)}
                        onCheckedChange={() => toggleSelectPhoto(photo.id)}
                        aria-label={`${photo.fileName} 선택`}
                        disabled={batchProcessing}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative">
                        {photo.thumbnailPath ? (
                          <Link href={`/dashboard/photos/${photo.id}`}>
                            <Image 
                              src={photo.thumbnailPath} 
                              alt={photo.fileName}
                              className="object-cover"
                              fill
                            />
                          </Link>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            <FileIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/dashboard/photos/${photo.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {photo.fileName}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {photo.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant="outline"
                          className={
                            getPhotoType(photo.fileName) === "두정부" ? "border-blue-200 bg-blue-50" :
                            getPhotoType(photo.fileName) === "전두부" ? "border-green-200 bg-green-50" :
                            getPhotoType(photo.fileName) === "후두부" ? "border-yellow-200 bg-yellow-50" :
                            getPhotoType(photo.fileName) === "측두부" ? "border-purple-200 bg-purple-50" :
                            ""
                          }
                        >
                          {getPhotoType(photo.fileName)}
                        </Badge>
                        {photo.takenAt && (
                          <span className="text-xs text-gray-500">
                            {new Date().getFullYear() === new Date(photo.takenAt).getFullYear() 
                              ? new Date(photo.takenAt).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })
                              : new Date(photo.takenAt).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
                            }
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/dashboard/photos?patientId=${photo.patientId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {photo.patientCode}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/dashboard/photos?institutionId=${photo.institutionId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {photo.institutionName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusBadge(photo.status)}>
                        {photo.status === "pending" && "대기 중"}
                        {photo.status === "analyzed" && "분석 완료"}
                        {photo.status === "failed" && "분석 실패"}
                        {photo.status === "deleted" && "삭제됨"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={qualityBadge(photo.quality)}>
                        {photo.quality === "high" && "높음"}
                        {photo.quality === "medium" && "중간"}
                        {photo.quality === "low" && "낮음"}
                        {photo.quality === "invalid" && "유효하지 않음"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {photo.analysisResult ? (
                        <Badge className={resultBadge(photo.analysisResult)}>
                          {photo.analysisResult === "normal" && "정상"}
                          {photo.analysisResult === "abnormal" && "비정상"}
                          {photo.analysisResult === "indeterminate" && "불확실"}
                        </Badge>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(photo.takenAt)}</TableCell>
                    <TableCell>{formatDate(photo.uploadedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {photo.status === "pending" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleAnalyze(photo.id)}
                            disabled={processingPhotoId === photo.id || batchProcessing}
                          >
                            {processingPhotoId === photo.id ? (
                              <>
                                <RefreshCwIcon className="mr-1 h-3 w-3 animate-spin" />
                                분석중
                              </>
                            ) : "분석"}
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                        >
                          <Link href={`/dashboard/photos/${photo.id}`}>상세</Link>
                        </Button>
                        {photo.status === "analyzed" && !photo.reportId && (
                          <Button 
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/dashboard/reports/new?photoId=${photo.id}`}>리포트</Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              총 {total}개 중 {(page - 1) * limit + 1}-{Math.min(page * limit, total)}개 표시
            </div>
            <Pagination 
              currentPage={page}
              totalPages={Math.ceil(total / limit)}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
