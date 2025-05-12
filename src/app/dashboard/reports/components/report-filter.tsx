"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface ReportFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  searchQuery: string;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
}

export function ReportFilter({
  startDate,
  endDate,
  searchQuery,
  setStartDate,
  setEndDate,
  setSearchQuery,
  onSearch,
}: ReportFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="flex flex-col space-y-1 col-span-2">
        <Label htmlFor="date-range" className="mb-1">기간 설정</Label>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "yyyy.MM.dd", { locale: ko }) : "시작일"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
              />
            </PopoverContent>
          </Popover>

          <span className="text-gray-500">~</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "yyyy.MM.dd", { locale: ko }) : "종료일"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-col space-y-1 col-span-2">
        <Label htmlFor="search" className="mb-1">검색</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="search"
            placeholder="이름, 휴대전화, 환자고유번호"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="default" onClick={onSearch}>
            검색
          </Button>
        </div>
      </div>
    </div>
  );
}
