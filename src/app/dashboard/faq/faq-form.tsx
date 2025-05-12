"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Upload } from "lucide-react";

import { Faq, FaqFormData } from "@/lib/definitions";
import { createFaq, updateFaq } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
import { DialogFooter } from "@/components/ui/dialog";

// 폼 검증 스키마
const faqFormSchema = z.object({
  question: z.string().min(2, {
    message: "질문은 최소 2자 이상이어야 합니다.",
  }).max(200, {
    message: "질문은 최대 200자까지 입력 가능합니다.",
  }),
  answer: z.string().min(5, {
    message: "답변은 최소 5자 이상이어야 합니다.",
  }),
  category: z.enum(["general", "account", "service", "payment", "technical", "etc"], {
    required_error: "카테고리를 선택해주세요.",
  }),
  orderNum: z.coerce.number().int().min(1, {
    message: "순번은 1 이상이어야 합니다.",
  }).max(9999, {
    message: "순번은 9999 이하여야 합니다.",
  }),
  status: z.enum(["active", "inactive", "draft"], {
    required_error: "상태를 선택해주세요.",
  }),
});

type FaqFormValues = z.infer<typeof faqFormSchema>;

interface FaqFormProps {
  faq?: Faq | null;
  isEditing?: boolean;
  onSaveComplete: () => void;
}

export function FaqForm({ faq, isEditing = false, onSaveComplete }: FaqFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Array<{
    id: string;
    name: string;
    size: number;
    url?: string;
  }>>([]);

  // 폼 초기화
  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "general",
      orderNum: 1,
      status: "draft",
    },
  });

  // 편집 모드일 경우 폼 데이터 설정
  useEffect(() => {
    if (isEditing && faq) {
      form.reset({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        orderNum: faq.orderNum,
        status: faq.status,
      });

      // 첨부파일 미리보기 설정
      if (faq.attachments && faq.attachments.length > 0) {
        const previews = faq.attachments.map(att => ({
          id: att.id,
          name: att.fileName,
          size: att.fileSize,
          url: att.fileUrl,
        }));
        setAttachmentPreviews(previews);
      }
    }
  }, [isEditing, faq, form]);

  // 폼 제출 처리
  const onSubmit = async (data: FaqFormValues) => {
    setIsSubmitting(true);
    try {
      // Form 데이터를 API 요청에 맞게 변환
      const faqData: FaqFormData = {
        ...data,
        attachments: attachments,
      };

      if (isEditing && faq) {
        // FAQ 수정
        await updateFaq(faq.id, faqData);
      } else {
        // 새 FAQ 등록
        await createFaq(faqData);
      }

      onSaveComplete();
    } catch (error) {
      console.error("FAQ 저장 중 오류가 발생했습니다:", error);
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
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="orderNum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>순번</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={9999}
                    placeholder="1-9999"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  낮은 순번이 상단에 표시됩니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">일반</SelectItem>
                    <SelectItem value="account">계정</SelectItem>
                    <SelectItem value="service">서비스</SelectItem>
                    <SelectItem value="payment">결제</SelectItem>
                    <SelectItem value="technical">기술</SelectItem>
                    <SelectItem value="etc">기타</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
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
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">게시중</SelectItem>
                    <SelectItem value="inactive">비게시</SelectItem>
                    <SelectItem value="draft">임시저장</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>질문</FormLabel>
              <FormControl>
                <Input placeholder="FAQ 질문을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>답변</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="FAQ 답변을 입력하세요"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                줄바꿈을 포함한 텍스트를 입력할 수 있습니다.
              </FormDescription>
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