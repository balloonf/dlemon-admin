import { notFound } from 'next/navigation';
import { getPhotoById } from '@/lib/api';
import { PhotoDetail } from '../components/photo-detail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhotoAnalysis } from '../components/photo-analysis';

export default async function PhotoDetailPage({ 
  params,
  searchParams
}: { 
  params: { id: string };
  searchParams: { tab?: string };
}) {
  try {
    const photo = await getPhotoById(params.id);
    const activeTab = searchParams.tab || 'detail';
    
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">사진 상세 정보</h1>
        
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList>
            <TabsTrigger value="detail">기본 정보</TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              disabled={photo.status !== 'analyzed'}
            >
              분석 결과
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="detail">
            <PhotoDetail photo={photo} />
          </TabsContent>
          
          <TabsContent value="analysis">
            <PhotoAnalysis photoId={photo.id} />
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
