'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhotoQuality, PhotoStatus } from '@/lib/definitions';

const filterSchema = z.object({
  query: z.string().optional(),
  institutionId: z.string().optional(),
  patientId: z.string().optional(),
  status: z.string().optional(),
  quality: z.string().optional(),
  analysisResult: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

export function PhotoFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      query: searchParams.get('query') || '',
      institutionId: searchParams.get('institutionId') || '',
      patientId: searchParams.get('patientId') || '',
      status: searchParams.get('status') || '',
      quality: searchParams.get('quality') || '',
      analysisResult: searchParams.get('analysisResult') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
    },
  });
  
  function onSubmit(values: FilterValues) {
    const params = new URLSearchParams(searchParams.toString());
    
    // 기존 페이지 파라미터 제거 (필터 변경 시 1페이지로 리셋)
    params.delete('page');
    
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.push(`${pathname}?${params.toString()}`);
  }
  
  function handleReset() {
    form.reset({
      query: '',
      institutionId: '',
      patientId: '',
      status: '',
      quality: '',
      analysisResult: '',
      startDate: '',
      endDate: '',
    });
    router.push(pathname);
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-md bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>검색어</FormLabel>
                <FormControl>
                  <Input placeholder="환자명, 환자 ID 등" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="institutionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>기관</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 기관" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">모든 기관</SelectItem>
                    <SelectItem value="1">서울대학교병원</SelectItem>
                    <SelectItem value="2">연세세브란스병원</SelectItem>
                    <SelectItem value="3">아산병원</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상태</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 상태" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">모든 상태</SelectItem>
                    <SelectItem value="pending">대기중</SelectItem>
                    <SelectItem value="analyzed">분석완료</SelectItem>
                    <SelectItem value="failed">실패</SelectItem>
                    <SelectItem value="deleted">삭제됨</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="quality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>품질</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 품질" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">모든 품질</SelectItem>
                    <SelectItem value="high">좋음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="low">낮음</SelectItem>
                    <SelectItem value="invalid">유효하지 않음</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="analysisResult"
            render={({ field }) => (
              <FormItem>
                <FormLabel>분석 결과</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 결과" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">모든 결과</SelectItem>
                    <SelectItem value="normal">정상</SelectItem>
                    <SelectItem value="abnormal">비정상</SelectItem>
                    <SelectItem value="indeterminate">불명확</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>시작일</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>종료일</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
          >
            초기화
          </Button>
          <Button type="submit">검색</Button>
        </div>
      </form>
    </Form>
  );
}
