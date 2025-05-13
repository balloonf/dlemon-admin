'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Institution } from '@/lib/definitions';
import { uploadPhoto, getUsers } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Upload, XCircle, FileImage, Calendar } from 'lucide-react';
import Image from 'next/image';

// 파일 크기 제한: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// 허용된 파일 형식
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const photoUploadSchema = z.object({
  patientId: z.string().min(1, '환자 ID를 입력해주세요'),
  patientCode: z.string().min(1, '환자 코드를 입력해주세요'),
  institutionId: z.string().min(1, '기관을 선택해주세요'),
  userId: z.string().min(1, '사용자를 선택해주세요'),
  takenAt: z.string().optional(),
  notes: z.string().optional(),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `파일 크기는 10MB 이하여야 합니다.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      '지원되는 형식: .jpg, .jpeg, .png, .webp'
    ),
});

type PhotoUploadFormValues = z.infer<typeof photoUploadSchema>;

export function PhotoUploadForm({ institutions }: { institutions: Institution[] }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const router = useRouter();
  
  const form = useForm<PhotoUploadFormValues>({
    resolver: zodResolver(photoUploadSchema),
    defaultValues: {
      patientId: '',
      patientCode: '',
      institutionId: '',
      userId: '',
      takenAt: new Date().toISOString().slice(0, 16),
      notes: '',
    },
  });
  
  async function handleInstitutionChange(value: string) {
    if (!value) {
      setUsers([]);
      return;
    }
    
    setSelectedInstitution(value);
    
    try {
      const result = await getUsers({ institutionId: value });
      setUsers(result.users.map(user => ({ id: user.id, name: user.name })));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: '사용자 목록 조회 실패',
        description: '기관의 사용자 목록을 가져오는데 실패했습니다.',
        variant: 'destructive',
      });
    }
  }
  
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    
    if (!file) {
      setPreview(null);
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: '파일 크기 초과',
        description: '파일 크기는 10MB 이하여야 합니다.',
        variant: 'destructive',
      });
      e.target.value = '';
      setPreview(null);
      return;
    }
    
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: '지원되지 않는 파일 형식',
        description: '지원되는 형식: .jpg, .jpeg, .png, .webp',
        variant: 'destructive',
      });
      e.target.value = '';
      setPreview(null);
      return;
    }
    
    // 파일 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    // 폼 값 설정
    form.setValue('file', file, { shouldValidate: true });
  }
  
  function clearFile() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    form.setValue('file', undefined as any, { shouldValidate: true });
  }
  
  async function onSubmit(values: PhotoUploadFormValues) {
    setIsLoading(true);
    
    try {
      const result = await uploadPhoto({
        patientId: values.patientId,
        patientCode: values.patientCode,
        institutionId: values.institutionId,
        userId: values.userId,
        file: values.file,
        takenAt: values.takenAt,
        notes: values.notes,
      });
      
      toast({
        title: '업로드 성공',
        description: '사진이 성공적으로 업로드되었습니다.',
      });
      
      // 업로드 성공 후 상세 페이지로 이동
      router.push(`/dashboard/photo/${result.id}`);
    } catch (error) {
      console.error('Failed to upload photo:', error);
      toast({
        title: '업로드 실패',
        description: '사진 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>새 사진 업로드</CardTitle>
        <CardDescription>
          사진 업로드 후 AI 분석을 진행할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="institutionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>기관</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleInstitutionChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="기관 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {institutions.map((institution) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사용자</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedInstitution || users.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="사용자 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>환자 ID</FormLabel>
                    <FormControl>
                      <Input placeholder="환자 ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="patientCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>환자 코드</FormLabel>
                    <FormControl>
                      <Input placeholder="환자 코드" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="takenAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>촬영 일시</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Input type="datetime-local" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>메모</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="사진에 대한 메모 입력"
                        className="h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>사진 파일</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed rounded-md p-4">
                        {!preview ? (
                          <div className="flex flex-col items-center justify-center py-4">
                            <FileImage className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                              JPG, PNG, WebP 형식만 지원 (최대 10MB)
                            </p>
                            <Button type="button" variant="outline" asChild>
                              <label className="cursor-pointer">
                                <Input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.webp"
                                  className="hidden"
                                  onChange={handleFileChange}
                                />
                                <Upload className="h-4 w-4 mr-2" />
                                파일 선택
                              </label>
                            </Button>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="flex justify-end mb-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={clearFile}
                              >
                                <XCircle className="h-5 w-5" />
                              </Button>
                            </div>
                            <div className="relative w-full aspect-video">
                              <Image
                                src={preview}
                                alt="선택한 이미지 미리보기"
                                fill
                                className="object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/photo')}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '업로드 중...' : '업로드'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
