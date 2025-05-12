"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, SaveIcon, ArchiveIcon, ClockIcon, RefreshCwIcon } from "lucide-react";

export function PhotoRetentionSettings() {
  const [activeTab, setActiveTab] = useState("retention");
  const [retentionPeriod, setRetentionPeriod] = useState("180");
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(true);
  const [backupEnabled, setBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("weekly");
  const [backupStoragePath, setBackupStoragePath] = useState("/backup/photos");
  const [isSaving, setIsSaving] = useState(false);
  
  // 저장 처리
  const handleSave = async () => {
    setIsSaving(true);
    
    // 저장 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
  };
  
  // 수동 백업 처리
  const handleManualBackup = async () => {
    // 백업 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="retention">보관 기간 설정</TabsTrigger>
          <TabsTrigger value="backup">백업 설정</TabsTrigger>
        </TabsList>
        
        <TabsContent value="retention" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5" />
                  <span>사진 보관 기간 설정</span>
                </CardTitle>
                <CardDescription>
                  사진 데이터의 보관 기간을 설정합니다. 기간이 지난 사진은 자동으로 보관 처리됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retentionPeriod">보관 기간 (일)</Label>
                  <Input
                    id="retentionPeriod"
                    type="number"
                    min="30"
                    value={retentionPeriod}
                    onChange={(e) => setRetentionPeriod(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    {parseInt(retentionPeriod) > 0 ? (
                      <>
                        사진 데이터는 업로드 후 <Badge variant="outline">{retentionPeriod}일</Badge> 동안 보관됩니다.
                      </>
                    ) : (
                      "유효한 보관 기간을 입력해주세요."
                    )}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoDelete"
                    checked={autoDeleteEnabled}
                    onCheckedChange={setAutoDeleteEnabled}
                  />
                  <Label htmlFor="autoDelete">기간 경과 후 자동 삭제</Label>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4 mr-2" />
                      저장
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <InfoIcon className="h-5 w-5" />
                  <span>보관 정책</span>
                </CardTitle>
                <CardDescription>
                  사진 데이터 보관 정책 및 관련 규정 정보
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">현재 보관 상태</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-gray-500">총 사진 수</p>
                      <p className="font-medium">3,542장</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-gray-500">보관 공간 사용</p>
                      <p className="font-medium">14.8 GB / 50 GB</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-gray-500">삭제 예정 사진</p>
                      <p className="font-medium">28장</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-gray-500">마지막 정리 일시</p>
                      <p className="font-medium">2025-05-01</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">보관 정책 안내</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                    <li>사진 데이터는 설정된 보관 기간 동안 유지됩니다.</li>
                    <li>보관 기간이 지난 사진은 자동으로 압축 보관됩니다.</li>
                    <li>자동 삭제 기능 활성화 시 보관 기간 이후 영구 삭제됩니다.</li>
                    <li>환자 진단 리포트와 연결된 사진은 자동 삭제되지 않습니다.</li>
                    <li>삭제된 사진은 백업이 활성화된 경우에만 복구 가능합니다.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="backup" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArchiveIcon className="h-5 w-5" />
                  <span>백업 설정</span>
                </CardTitle>
                <CardDescription>
                  사진 데이터의 자동 백업 설정을 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="backupEnabled"
                    checked={backupEnabled}
                    onCheckedChange={setBackupEnabled}
                  />
                  <Label htmlFor="backupEnabled">자동 백업 활성화</Label>
                </div>
                
                {backupEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">백업 주기</Label>
                      <Select
                        value={backupFrequency}
                        onValueChange={setBackupFrequency}
                      >
                        <SelectTrigger id="backupFrequency">
                          <SelectValue placeholder="백업 주기 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">매일</SelectItem>
                          <SelectItem value="weekly">매주</SelectItem>
                          <SelectItem value="monthly">매월</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backupStoragePath">백업 저장 경로</Label>
                      <Input
                        id="backupStoragePath"
                        value={backupStoragePath}
                        onChange={(e) => setBackupStoragePath(e.target.value)}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" className="w-full" onClick={handleManualBackup}>
                        지금 백업 실행
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4 mr-2" />
                      설정 저장
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>백업 이력</CardTitle>
                <CardDescription>
                  최근 백업 및 복원 이력을 확인합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="mb-1">자동 백업</Badge>
                        <p className="font-medium">주간 백업 (502장)</p>
                      </div>
                      <p className="text-sm text-gray-500">2025-05-07 03:15</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">성공 (1.2 GB)</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="mb-1">수동 백업</Badge>
                        <p className="font-medium">전체 백업 (3,542장)</p>
                      </div>
                      <p className="text-sm text-gray-500">2025-05-01 14:22</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">성공 (14.8 GB)</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="mb-1">자동 백업</Badge>
                        <p className="font-medium">주간 백업 (487장)</p>
                      </div>
                      <p className="text-sm text-gray-500">2025-04-30 03:15</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">성공 (1.1 GB)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
