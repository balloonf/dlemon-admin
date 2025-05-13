'use client';

import { useEffect, useState } from 'react';
import { getPhotoAnalysisResult, getPhotoById } from '@/lib/api';
import { PhotoAnalysisResult, Photo } from '@/lib/definitions';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { 
  BarChart, 
  Check, 
  X, 
  HelpCircle,
  Calendar
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function PhotoAnalysis({ photoId }: { photoId: string }) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [photoData, resultData] = await Promise.all([
          getPhotoById(photoId),
          getPhotoAnalysisResult(photoId)
        ]);
        
        setPhoto(photoData);
        setAnalysisResult(resultData);
      } catch (error) {
        console.error('Failed to fetch analysis data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [photoId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }
  
  if (!photo || !analysisResult) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground">분석 결과를 찾을 수 없습니다.</p>
      </div>
    );
  }
  
  function getResultIcon(result: string) {
    switch (result) {
      case 'normal':
        return <Check className="h-6 w-6 text-green-500" />;
      case 'abnormal':
        return <X className="h-6 w-6 text-red-500" />;
      case 'indeterminate':
      default:
        return <HelpCircle className="h-6 w-6 text-yellow-500" />;
    }
  }
  
  function getResultColor(result: string) {
    switch (result) {
      case 'normal':
        return 'text-green-500';
      case 'abnormal':
        return 'text-red-500';
      case 'indeterminate':
      default:
        return 'text-yellow-500';
    }
  }
  
  function getResultText(result: string) {
    switch (result) {
      case 'normal':
        return '정상';
      case 'abnormal':
        return '비정상';
      case 'indeterminate':
        return '불명확';
      default:
        return result;
    }
  }
  
  function getScoreColor(score: number) {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>분석 결과</CardTitle>
          <CardDescription>
            분석 일시: {formatDate(analysisResult.processedAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-2">종합 결과</span>
              <div className="flex items-center space-x-2">
                {getResultIcon(analysisResult.result)}
                <span className={cn('text-lg font-semibold', getResultColor(analysisResult.result))}>
                  {getResultText(analysisResult.result)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-2">신뢰도 점수</span>
              <div className="flex items-center space-x-2">
                <span className={cn('text-2xl font-semibold', getScoreColor(analysisResult.score))}>
                  {(analysisResult.score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-2">모발 밀도</span>
              <div className="flex items-center space-x-2">
                <BarChart className="h-5 w-5 text-blue-500" />
                <span className="text-lg font-semibold">
                  {analysisResult.metadata.hairDensity}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-2">두피 상태</span>
              <div className="flex items-center space-x-2">
                <Badge 
                  className={cn(
                    analysisResult.metadata.scalpCondition === '양호' ? 'bg-green-100 text-green-800' :
                    analysisResult.metadata.scalpCondition === '불량' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  )}
                >
                  {analysisResult.metadata.scalpCondition}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t">
            <Tabs defaultValue="detail">
              <TabsList>
                <TabsTrigger value="detail">상세 분석</TabsTrigger>
                <TabsTrigger value="markers">마커 표시</TabsTrigger>
              </TabsList>
              
              <TabsContent value="detail" className="pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">모발 밀도 분석</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${analysisResult.metadata.hairDensity}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{analysisResult.metadata.hairDensity}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.metadata.hairDensity >= 80 
                        ? '모발 밀도가 정상 범위 내에 있습니다.' 
                        : analysisResult.metadata.hairDensity >= 60
                        ? '모발 밀도가 다소 낮습니다. 관찰이 필요합니다.'
                        : '모발 밀도가 크게 감소했습니다. 전문가의 처방이 권장됩니다.'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">모발 두께 분석</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${analysisResult.metadata.hairThickness * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{(analysisResult.metadata.hairThickness * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.metadata.hairThickness >= 0.8 
                        ? '모발 두께가 정상입니다.' 
                        : analysisResult.metadata.hairThickness >= 0.6
                        ? '모발이 다소 가늘어진 상태입니다. 영양 공급이 권장됩니다.'
                        : '모발이 현저히 가늘어졌습니다. 전문 처방이 필요합니다.'}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="markers" className="pt-4">
                <div className="relative w-full max-w-2xl aspect-video mx-auto">
                  <Image
                    src={photo.filePath}
                    alt={`환자 ${photo.patientCode}의 사진`}
                    fill
                    className="object-contain"
                  />
                  
                  {analysisResult.areas.map((area, index) => (
                    <div 
                      key={index}
                      className="absolute border-2 border-red-500 bg-red-500/20 flex items-center justify-center"
                      style={{
                        left: `${(area.x / photo.imageWidth) * 100}%`,
                        top: `${(area.y / photo.imageHeight) * 100}%`,
                        width: `${(area.width / photo.imageWidth) * 100}%`,
                        height: `${(area.height / photo.imageHeight) * 100}%`,
                      }}
                    >
                      <span className="text-xs bg-red-500 text-white px-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">마커 정보</h3>
                  <div className="space-y-2">
                    {analysisResult.areas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-sm">
                          {area.label} (신뢰도: {(area.confidence * 100).toFixed(0)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>요약</CardTitle>
          <div className="flex items-center space-x-2 mt-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formatDate(analysisResult.createdAt)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm">
              {analysisResult.result === 'normal' ? (
                <>
                  현재 <strong>정상적인 모발 상태</strong>를 보이고 있습니다. 모발 밀도와 두께가 양호하며, 
                  두피 상태도 건강합니다. 현재의 관리 방법을 유지하는 것이 좋습니다.
                </>
              ) : analysisResult.result === 'abnormal' ? (
                <>
                  <strong>비정상적인 모발 상태</strong>가 감지되었습니다. 모발 밀도 감소, 가늘어진 모발, 
                  또는 두피 상태 악화 등의 문제가 확인됩니다. 전문의의 상담과 처방이 권장됩니다.
                </>
              ) : (
                <>
                  현재 모발 상태에 대한 <strong>명확한 판단이 어렵습니다</strong>. 일부 지표는 정상 범위에 있으나, 
                  일부는 주의가 필요합니다. 추가 검사 또는 상담을 통한 확인이 권장됩니다.
                </>
              )}
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">권장 사항</h3>
            <ul className="space-y-1 text-sm pl-5 list-disc">
              {analysisResult.result === 'normal' ? (
                <>
                  <li>현재의 모발 관리 방법 유지</li>
                  <li>정기적인 두피 케어 지속</li>
                  <li>6개월 후 재검사 권장</li>
                </>
              ) : analysisResult.result === 'abnormal' ? (
                <>
                  <li>전문의 상담 및 처방 권장</li>
                  <li>두피 케어 제품 사용 고려</li>
                  <li>식이 및 생활 습관 점검</li>
                  <li>3개월 후 재검사 권장</li>
                </>
              ) : (
                <>
                  <li>추가 검사 또는 상담 권장</li>
                  <li>두피 케어 제품 사용 고려</li>
                  <li>모발 건강에 도움이 되는 영양소 섭취</li>
                  <li>3개월 후 재검사 권장</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              본 분석 결과는 AI 시스템에 의해 생성된 것으로, 전문의의 진단을 대체할 수 없습니다. 
              정확한 진단과 처방은 전문의와 상담해 주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
