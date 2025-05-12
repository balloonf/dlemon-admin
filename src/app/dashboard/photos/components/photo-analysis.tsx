"use client";

import { useState, useEffect } from "react";
import { Photo, PhotoAnalysisResult } from "@/lib/definitions";
import { getPhotoById, getPhotoAnalysisResult, analyzePhoto } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "./badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCwIcon } from "lucide-react";

interface PhotoAnalysisProps {
  id: string;
}

export function PhotoAnalysis({ id }: PhotoAnalysisProps) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [analysis, setAnalysis] = useState<PhotoAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  
  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    try {
      // 사진 정보 로드
      const photoData = await getPhotoById(id);
      setPhoto(photoData);
      
      // 분석 결과가 있는 경우에만 로드
      if (photoData.status === "analyzed" && photoData.analysisResult) {
        const analysisData = await getPhotoAnalysisResult(id);
        setAnalysis(analysisData);
      } else {
        setAnalysis(null);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // 분석 요청
  const handleAnalyze = async () => {
    if (!photo) return;
    
    setAnalyzing(true);
    try {
      const updatedPhoto = await analyzePhoto(photo.id);
      setPhoto(updatedPhoto);
      
      // 분석이 성공적으로 완료된 경우 분석 결과 로드
      if (updatedPhoto.status === "analyzed" && updatedPhoto.analysisResult) {
        const analysisData = await getPhotoAnalysisResult(photo.id);
        setAnalysis(analysisData);
      }
    } catch (error) {
      console.error("분석 요청 실패:", error);
    } finally {
      setAnalyzing(false);
    }
  };
  
  // 결과 Badge 스타일
  const getResultBadgeStyle = (result: string | null) => {
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
  
  // 분석 점수에 따른 색상
  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-800";
    
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
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
    loadData();
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

  // 분석 결과가 없는 경우
  if (photo.status !== "analyzed" || !photo.analysisResult) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 mb-4">
          {photo.status === "pending"
            ? "아직 분석되지 않은 사진입니다."
            : photo.status === "failed"
            ? "분석에 실패한 사진입니다."
            : photo.status === "deleted"
            ? "삭제된 사진입니다."
            : "분석 결과가 없습니다."}
        </p>
        
        {photo.status === "pending" && (
          <Button
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? "분석 중..." : "분석 요청"}
          </Button>
        )}
        
        {photo.status === "failed" && (
          <Button
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? "분석 중..." : "다시 분석"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 분석 요약 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">분석 결과</p>
          <Badge className={getResultBadgeStyle(photo.analysisResult)}>
            {photo.analysisResult === "normal" && "정상"}
            {photo.analysisResult === "abnormal" && "비정상"}
            {photo.analysisResult === "indeterminate" && "불확실"}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">분석 점수</p>
          <p className={`font-bold ${getScoreColor(photo.analysisScore)}`}>
            {photo.analysisScore !== null ? `${(photo.analysisScore * 100).toFixed(0)}%` : "-"}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">이미지 품질</p>
          <Badge className={
            photo.quality === "high" ? "bg-green-100 text-green-800" :
            photo.quality === "medium" ? "bg-blue-100 text-blue-800" :
            photo.quality === "low" ? "bg-orange-100 text-orange-800" :
            "bg-red-100 text-red-800"
          }>
            {photo.quality === "high" && "높음"}
            {photo.quality === "medium" && "중간"}
            {photo.quality === "low" && "낮음"}
            {photo.quality === "invalid" && "유효하지 않음"}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">분석일</p>
          <p className="font-medium">{formatDate(photo.analysisDate)}</p>
        </div>
      </div>
      
      {/* 분석 결과 상세 - analysis 객체가 있는 경우에만 표시 */}
      {analysis && (
        <>
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3">상세 분석 데이터</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">모발 밀도</p>
                    <div className="relative flex items-center justify-center">
                      <svg className="w-24 h-24">
                        <circle
                          className="text-gray-200"
                          strokeWidth="6"
                          stroke="currentColor"
                          fill="transparent"
                          r="30"
                          cx="42"
                          cy="42"
                        />
                        <circle
                          className={
                            analysis.metadata.hairDensity > 75 ? "text-green-500" :
                            analysis.metadata.hairDensity > 50 ? "text-yellow-500" : 
                            "text-red-500"
                          }
                          strokeWidth="6"
                          strokeDasharray={188.5}
                          strokeDashoffset={188.5 - (188.5 * analysis.metadata.hairDensity) / 100}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="30"
                          cx="42"
                          cy="42"
                        />
                      </svg>
                      <p className="absolute text-xl font-bold">
                        {analysis.metadata.hairDensity}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">정상 범위: 80-100</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">모발 두께 (mm)</p>
                    <div className="flex items-end justify-center h-16 mb-2">
                      <div 
                        className={`w-16 bg-blue-500 rounded-t-md`}
                        style={{ height: `${analysis.metadata.hairThickness * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xl font-bold">{analysis.metadata.hairThickness}</p>
                    <p className="text-xs text-gray-500 mt-1">정상 범위: 0.06-0.08mm</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">두피 상태</p>
                    <Badge 
                      className={
                        analysis.metadata.scalpCondition === "양호" ? "bg-green-100 text-green-800" :
                        analysis.metadata.scalpCondition === "보통" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }
                    >
                      {analysis.metadata.scalpCondition}
                    </Badge>
                    <div className="mt-3 grid grid-cols-3 gap-1">
                      <div className={`h-2 rounded-full ${analysis.metadata.scalpCondition === "양호" ? "bg-green-500" : "bg-gray-200"}`}></div>
                      <div className={`h-2 rounded-full ${analysis.metadata.scalpCondition === "보통" ? "bg-yellow-500" : "bg-gray-200"}`}></div>
                      <div className={`h-2 rounded-full ${analysis.metadata.scalpCondition === "불량" ? "bg-red-500" : "bg-gray-200"}`}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200">
            <Tabs defaultValue="areas" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="areas">검출 영역</TabsTrigger>
                <TabsTrigger value="visualization">시각화</TabsTrigger>
              </TabsList>
              
              <TabsContent value="areas" className="space-y-3">
                {analysis.areas.map((area, index) => (
                  <Card key={index}>
                    <CardContent className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{area.label}</p>
                          <p className="text-sm text-gray-500">
                            위치: ({area.x}, {area.y}) | 크기: {area.width}x{area.height}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className={area.confidence > 0.8 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            신뢰도: {(area.confidence * 100).toFixed(0)}%
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">ID: A{index + 1}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="visualization" className="min-h-[200px] bg-gray-50 rounded-md p-4">
                <div className="relative w-full h-[300px] bg-white rounded-md overflow-hidden border">
                  {/* 이미지 영역 (실제 구현에서는 이미지 위에 영역 표시) */}
                  {photo.filePath ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={photo.filePath} 
                        alt={photo.fileName} 
                        className="w-full h-full object-contain" 
                      />
                      
                      {/* 검출 영역 SVG 오버레이 (예시) */}
                      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        {analysis.areas.map((area, index) => (
                          <rect
                            key={index}
                            x={`${(area.x / photo.imageWidth) * 100}%`}
                            y={`${(area.y / photo.imageHeight) * 100}%`}
                            width={`${(area.width / photo.imageWidth) * 100}%`}
                            height={`${(area.height / photo.imageHeight) * 100}%`}
                            fill="none"
                            stroke={area.confidence > 0.8 ? "rgba(34, 197, 94, 0.7)" : "rgba(234, 179, 8, 0.7)"}
                            strokeWidth="2"
                            rx="4"
                          />
                        ))}
                      </svg>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">이미지를 불러올 수 없습니다.</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-sm text-gray-500 text-center">
                  <p>영역 ID별 색상: {analysis.areas.map((area, index) => (
                    <Badge key={index} variant="outline" className="mx-1">
                      A{index + 1}
                    </Badge>
                  ))}</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="pt-4 border-t border-gray-200 flex justify-between">
            <p className="text-sm text-gray-500 self-center">
              마지막 분석: {formatDate(photo.analysisDate || "")}
            </p>
            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <RefreshCwIcon className="mr-2 h-4 w-4" />
                  다시 분석
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
