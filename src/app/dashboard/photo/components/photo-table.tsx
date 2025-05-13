'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPhotos } from '@/lib/api';
import { Photo, PhotoStatus, PhotoQuality, AnalysisResult } from '@/lib/definitions';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import {
  Eye,
  BarChart,
  XCircle
} from 'lucide-react';

export function PhotoTable({ 
  searchParams 
}: { 
  searchParams: Record<string, string> 
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  
  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      try {
        const result = await getPhotos({
          search: searchParams.query,
          institutionId: searchParams.institutionId,
          patientId: searchParams.patientId,
          status: searchParams.status as PhotoStatus,
          quality: searchParams.quality as PhotoQuality,
          analysisResult: searchParams.analysisResult as AnalysisResult,
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
          page,
          limit,
        });
        
        setPhotos(result.photos || []);
        setTotal(result.total || 0);
      } catch (error) {
        console.error('Failed to fetch photos:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPhotos();
  }, [searchParams, page]);
  
  function handleRowClick(id: string) {
    router.push(`/dashboard/photo/${id}`);
  }
  
  function getStatusBadge(status: PhotoStatus) {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">대기중</Badge>;
      case 'analyzed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">분석완료</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">실패</Badge>;
      case 'deleted':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">삭제됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }
  
  function getQualityBadge(quality: PhotoQuality) {
    switch (quality) {
      case 'high':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">좋음</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">보통</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">낮음</Badge>;
      case 'invalid':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">유효하지 않음</Badge>;
      default:
        return <Badge variant="outline">{quality}</Badge>;
    }
  }
  
  function getAnalysisResultText(result: AnalysisResult | null) {
    if (!result) return '-';
    
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">미리보기</TableHead>
            <TableHead>환자 코드</TableHead>
            <TableHead>기관명</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>품질</TableHead>
            <TableHead>분석 결과</TableHead>
            <TableHead>분석 점수</TableHead>
            <TableHead>업로드 일시</TableHead>
            <TableHead className="w-24">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {photos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                등록된 사진이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            photos.map((photo) => (
              <TableRow 
                key={photo.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(photo.id)}
              >
                <TableCell onClick={(e) => e.stopPropagation()} className="p-2">
                  <div className="relative h-12 w-12 overflow-hidden rounded">
                    {photo.thumbnailPath ? (
                      <Image 
                        src={photo.thumbnailPath} 
                        alt={`환자 ${photo.patientCode}의 사진`}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
                        <XCircle size={24} />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{photo.patientCode}</TableCell>
                <TableCell>{photo.institutionName}</TableCell>
                <TableCell>{getStatusBadge(photo.status)}</TableCell>
                <TableCell>{getQualityBadge(photo.quality)}</TableCell>
                <TableCell>{getAnalysisResultText(photo.analysisResult)}</TableCell>
                <TableCell>
                  {photo.analysisScore !== null
                    ? `${(photo.analysisScore * 100).toFixed(0)}%`
                    : '-'}
                </TableCell>
                <TableCell>{formatDate(photo.uploadedAt)}</TableCell>
                <TableCell>
                  <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      title="상세 보기"
                      onClick={() => router.push(`/dashboard/photo/${photo.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {photo.status === 'analyzed' && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="분석 결과 보기"
                        onClick={() => router.push(`/dashboard/photo/${photo.id}?tab=analysis`)}
                      >
                        <BarChart className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {total > limit && (
        <div className="flex justify-center p-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('page', String(page - 1));
                router.push(`?${params.toString()}`);
              }}
            >
              이전
            </Button>
            <div className="flex items-center">
              <span className="text-sm">
                {page} / {Math.ceil(total / limit)} 페이지
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('page', String(page + 1));
                router.push(`?${params.toString()}`);
              }}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
