'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Photo, PhotoStatus } from '@/lib/definitions';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  updatePhotoStatus, 
  analyzePhoto, 
  deletePhoto,
  updatePhotoNotes 
} from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import { 
  BarChart2, 
  RefreshCw, 
  Trash2, 
  Calendar, 
  User, 
  Building, 
  FileImage,
  Sparkles,
  PieChart
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export function PhotoDetail({ photo }: { photo: Photo }) {
  const [currentPhoto, setCurrentPhoto] = useState<Photo>(photo);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notes, setNotes] = useState(photo.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const router = useRouter();
  
  async function handleAnalyze() {
    if (currentPhoto.status !== 'pending') {
      toast({
        title: '분석 요청 실패',
        description: '대기 중인 사진만 분석 요청이 가능합니다.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const updatedPhoto = await analyzePhoto(currentPhoto.id);
      setCurrentPhoto(updatedPhoto);
      toast({
        title: '분석 완료',
        description: '사진 분석이 완료되었습니다.',
      });
    } catch (error) {
      console.error('Failed to analyze photo:', error);
      toast({
        title: '분석 요청 실패',
        description: '사진 분석 중 오류가 발생했습니다. 다시 시도해 주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }
  
  async function handleDelete() {
    setIsDeleting(true);
    
    try {
      await deletePhoto(currentPhoto.id);
      toast({
        title: '삭제 완료',
        description: '사진이 삭제되었습니다.',
      });
      router.push('/dashboard/photo');
    } catch (error) {
      console.error('Failed to delete photo:', error);
      toast({
        title: '삭제 실패',
        description: '사진 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.',
        variant: 'destructive',
      });
      setIsDeleting(false);
    }
  }
  
  async function handleSaveNotes() {
    setIsSavingNotes(true);
    
    try {
      const updatedPhoto = await updatePhotoNotes(currentPhoto.id, notes);
      setCurrentPhoto(updatedPhoto);
      toast({
        title: '저장 완료',
        description: '메모가 저장되었습니다.',
      });
    } catch (error) {
      console.error('Failed to save notes:', error);
      toast({
        title: '저장 실패',
        description: '메모 저장 중 오류가 발생했습니다. 다시 시도해 주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingNotes(false);
    }
  }
  
  function getStatusBadge(status: PhotoStatus) {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">대기중</Badge>;
      case 'analyzed':
        return <Badge className="bg-green-100 text-green-800">분석완료</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">실패</Badge>;
      case 'deleted':
        return <Badge className="bg-gray-100 text-gray-800">삭제됨</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>사진 이미지</CardTitle>
          <CardDescription>
            환자 코드: {currentPhoto.patientCode}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {currentPhoto.filePath ? (
            <div className="relative w-full max-w-2xl aspect-video">
              <Image
                src={currentPhoto.filePath}
                alt={`환자 ${currentPhoto.patientCode}의 사진`}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-full max-w-2xl aspect-video flex items-center justify-center bg-gray-100 text-gray-400">
              이미지를 불러올 수 없습니다.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            <FileImage className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              {currentPhoto.fileName} ({(currentPhoto.fileSize / 1000000).toFixed(2)} MB)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              촬영일: {currentPhoto.takenAt ? formatDate(currentPhoto.takenAt) : '정보 없음'}
            </span>
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <div className="flex space-x-2 mt-2">
            {getStatusBadge(currentPhoto.status)}
            <Badge variant="outline">
              품질: {currentPhoto.quality === 'high' ? '좋음' : 
                    currentPhoto.quality === 'medium' ? '보통' : 
                    currentPhoto.quality === 'low' ? '낮음' : '유효하지 않음'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">환자 코드</span>
            </div>
            <p className="text-sm pl-6">{currentPhoto.patientCode}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">기관</span>
            </div>
            <p className="text-sm pl-6">{currentPhoto.institutionName}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">등록자</span>
            </div>
            <p className="text-sm pl-6">{currentPhoto.userName}</p>
          </div>
          
          {currentPhoto.status === 'analyzed' && currentPhoto.analysisResult && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">분석 결과</span>
              </div>
              <p className="text-sm pl-6">
                {currentPhoto.analysisResult === 'normal' ? '정상' : 
                 currentPhoto.analysisResult === 'abnormal' ? '비정상' : '불명확'}
                {currentPhoto.analysisScore !== null && (
                  <span className="ml-2">
                    (점수: {(currentPhoto.analysisScore * 100).toFixed(0)}%)
                  </span>
                )}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">업로드 일시</span>
            </div>
            <p className="text-sm pl-6">{formatDate(currentPhoto.uploadedAt)}</p>
          </div>
          
          {currentPhoto.analysisDate && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <PieChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">분석 일시</span>
              </div>
              <p className="text-sm pl-6">{formatDate(currentPhoto.analysisDate)}</p>
            </div>
          )}
          
          <div className="space-y-2 pt-2">
            <span className="text-sm font-medium">메모</span>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="이 사진에 대한 메모를 입력하세요."
              className="min-h-[100px]"
            />
            <Button 
              size="sm" 
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="mt-2"
            >
              {isSavingNotes ? '저장 중...' : '메모 저장'}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentPhoto.status === 'pending' && (
            <Button
              variant="outline"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  분석 요청
                </>
              )}
            </Button>
          )}
          
          {currentPhoto.status === 'analyzed' && (
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/photo/${currentPhoto.id}?tab=analysis`)}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              분석 결과 보기
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting || currentPhoto.status === 'deleted'}>
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? '삭제 중...' : '삭제'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>사진 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 이 사진을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
