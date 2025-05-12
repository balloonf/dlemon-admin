"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 가상의 통계 데이터 (실제 구현 시 API 호출로 대체)
const institutionStats = [
  { institution: "서울대학교병원", count: 156 },
  { institution: "연세세브란스병원", count: 124 },
  { institution: "가톨릭대학교병원", count: 98 },
  { institution: "건국대학교병원", count: 87 },
  { institution: "고려대학교안암병원", count: 75 },
];

const monthlyStats = [
  { month: "2024-01", count: 68 },
  { month: "2024-02", count: 83 },
  { month: "2024-03", count: 92 },
  { month: "2024-04", count: 105 },
  { month: "2024-05", count: 112 },
];

const diagnosisStats = [
  { type: "정상", count: 84 },
  { type: "경증 탈모", count: 187 },
  { type: "중등도 탈모", count: 156 },
  { type: "중증 탈모", count: 93 },
];

export function ReportStatistics() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>리포트 통계</CardTitle>
        <CardDescription>기관별, 기간별, 진단 유형별 리포트 생성 통계</CardDescription>
      </CardHeader>
      <CardContent>
        {/* 기간 필터 */}
        <div className="mb-6">
          <Label htmlFor="date-range" className="mb-2 block">기간 설정</Label>
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

            <Button variant="default" onClick={() => console.log("필터 적용")}>
              적용
            </Button>
          </div>
        </div>

        {/* 통계 탭 */}
        <Tabs defaultValue="institution" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="institution">기관별</TabsTrigger>
            <TabsTrigger value="period">기간별</TabsTrigger>
            <TabsTrigger value="diagnosis">진단 유형별</TabsTrigger>
          </TabsList>

          {/* 기관별 통계 */}
          <TabsContent value="institution" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 rounded-md border p-4">
                <h3 className="text-lg font-semibold mb-4">기관별 리포트 생성 건수</h3>
                <div className="space-y-4">
                  {institutionStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{stat.institution}</span>
                      <div className="flex items-center space-x-2">
                        <div className="relative w-40 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-primary"
                            style={{ width: `${(stat.count / Math.max(...institutionStats.map(s => s.count))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stat.count}건</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 기간별 통계 */}
          <TabsContent value="period" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 rounded-md border p-4">
                <h3 className="text-lg font-semibold mb-4">월별 리포트 생성 건수</h3>
                <div className="space-y-4">
                  {monthlyStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{stat.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="relative w-40 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-primary"
                            style={{ width: `${(stat.count / Math.max(...monthlyStats.map(s => s.count))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stat.count}건</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 진단 유형별 통계 */}
          <TabsContent value="diagnosis" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 rounded-md border p-4">
                <h3 className="text-lg font-semibold mb-4">진단 유형별 리포트 건수</h3>
                <div className="space-y-4">
                  {diagnosisStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{stat.type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="relative w-40 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-primary"
                            style={{ width: `${(stat.count / Math.max(...diagnosisStats.map(s => s.count))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stat.count}건</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
