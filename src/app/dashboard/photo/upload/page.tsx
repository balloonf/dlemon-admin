import { PhotoUploadForm } from '../components/photo-upload-form';
import { getInstitutions } from '@/lib/api';

export default async function PhotoUploadPage() {
  const institutions = await getInstitutions();
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">사진 업로드</h1>
      <p className="text-sm text-muted-foreground">
        환자 사진을 업로드하여 분석할 수 있습니다.
      </p>
      
      <PhotoUploadForm institutions={institutions} />
    </div>
  );
}
