import { Suspense } from 'react';
import { PhotoTable } from './components/photo-table';
import { PhotoFilter } from './components/photo-filter';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function PhotosPage({ 
  searchParams 
}: { 
  searchParams: Record<string, string> 
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">사진 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            환자 사진 조회 및 분석 결과 확인
          </p>
        </div>
        <Link href="/dashboard/photo/upload">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            사진 업로드
          </Button>
        </Link>
      </div>
      
      <PhotoFilter />
      
      <Suspense fallback={<div>로딩 중...</div>}>
        <PhotoTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
