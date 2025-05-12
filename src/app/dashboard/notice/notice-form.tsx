"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Trash2, Upload } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Notice, NoticeFormData } from "@/lib/definitions";
import { createNotice, updateNotice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogFooter } from "@/components/ui/dialog";

// 폼 검증 스키마
const noticeFormSchema = z.object({
  title: z.string().min(2, {
    message: "제목은 최소 2자 이상이어야 합니다.",
  }).max(100, {
    message: "제목은 최대 100자까지 입력 가능합니다.",
  }),
  content: z.string().min(5, {
    message: "내용은 최소 5자 이상이어야 합니다.",
  }),
  status: z.enum(["active", "inactive", "draft", "scheduled"], {
    required_error: "상태를 선택해주세요.",
  }),
  isPinned: z.boolean().default(false),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  target: z.enum(["all", "institution", "user"], {
    required_error: "대상을 선택해주세요.",
  }),
  targetIds: z.array(z.string()).optional(),
});

type NoticeFormValues = z.infer<typeof noticeFormSchema>;

interface NoticeFormProps {
  notice?: Notice | null;
  isEditing?: boolean;
  onSaveComplete: () => void;
}

export function NoticeForm({ notice, isEditing = false, onSaveComplete }: NoticeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Array<{
    id: string;
    name: string;
    size: number;
    url?: string;
  }>>([]);

  // 폼 초기화
  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
      isPinned: false,
      startDate: null,
      endDate: null,
      target: "all",
      targetIds: [],
    },
  });

  // 편집 모드일 경우 폼 데이터 설정
  useEffect(() => {
    if (isEditing && notice) {
      // 날짜 문자열을 Date 객체로 변환
      const startDate = notice.startDate ? new Date(notice.startDate) : null;
      const endDate = notice.endDate ? new Date(notice.endDate) : null;
      
      form.reset({
        title: notice.title,
        content: notice.content,
        status: notice.status,
        isPinned: notice.isPinned,
        startDate,
        endDate,
        target: notice.target,
        targetIds: notice.targetIds || [],
      });

      // 첨부파일 미리보기 설정
      if (notice.attachments && notice.attachments.length > 0) {
        const previews = notice.attachments.map(att => ({
          id: att.id,
          name: att.fileName,
          size: att.fileSize,
          url: att.fileUrl,
        }));
        setAttachmentPreviews(previews);
      }
    }
  }, [isEditing, notice, form]);

  // 폼 제출 처리
  const onSubmit = async (data: NoticeFormValues) => {
    setIsSubmitting(true);
    try {
      // Form 데이터를 API 요청에 맞게 변환
      const noticeData: NoticeFormData = {
        ...data,
        startDate: data.startDate ? data.startDate.toISOString() : undefined,
        endDate: data.endDate ? data.endDate.toISOString() : undefined,
        attachments: attachments,
      };

      if (isEditing && notice) {
        // 공지사항 수정
        await updateNotice(notice.id, noticeData);
      } else {
        // 새 공지사항 등록
        await createNotice(noticeData);
      }

      onSaveComplete();
    } catch (error) {
      console.error("공지사항 저장 중 오류가 발생했습니다:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 파일 업로드 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...fileList]);
      
      // 미리보기 생성
      const newPreviews = fileList.map(file => ({
        id: `temp-${Date.now()}-${file.name}`,
        name: file.name,
        size: file.size,
      }));
      
      setAttachmentPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // 첨부파일 삭제
  const handleRemoveAttachment = (id: string) => {
    setAttachmentPreviews(prev => prev.filter(item => item.id !== id));
    
    // 실제 File 객체도 삭제 (임시 첨부파일인 경우)
    if (id.startsWith('temp-')) {
      const fileName = id.split('-').slice(2).join('-');
      setAttachments(prev => prev.filter(file => file.name !== fileName));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="공지사항 제목을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">게시중</SelectItem>
                    <SelectItem value="inactive">비게시</SelectItem>
                    <SelectItem value="draft">임시저장</SelectItem>
                    <SelectItem value="scheduled">예약게시</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>공지 대상</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="공지 대상 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">전체 사용자</SelectItem>
                    <SelectItem value="institution">특정 기관</SelectItem>
                    <SelectItem value="user">특정 사용자</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>게시 시작일</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ko })
                        ) : (
                          <span>날짜 선택</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value as Date | undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  게시 시작일을 선택하세요. 미지정 시 즉시 게시됩니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>게시 종료일</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ko })
                        ) : (
                          <span>날짜 선택</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value as Date | undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  게시 종료일을 선택하세요. 미지정 시 무기한 게시됩니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isPinned"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">상단 고정</FormLabel>
                <FormDescription>
                  중요 공지사항을 목록 상단에 고정합니다.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>내용</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="공지사항 내용을 입력하세요"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel className="block mb-2">첨부파일</FormLabel>
          <div className="flex items-center gap-2 mb-4">
            <Input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              파일 선택
            </Button>
            <FormDescription>
              최대 10MB까지 업로드 가능합니다.
            </FormDescription>
          </div>

          {attachmentPreviews.length > 0 && (
            <div className="border rounded-md p-4 space-y-2">
              {attachmentPreviews.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <div className="text-sm truncate max-w-[400px]">
                    {file.name}
                    <span className="text-xs text-gray-500 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)}MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAttachment(file.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : isEditing ? "수정하기" : "등록하기"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
