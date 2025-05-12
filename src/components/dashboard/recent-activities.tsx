"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const activities = [
  {
    id: 1,
    name: "서울피부과",
    action: "라이선스 등록",
    timestamp: "방금 전",
    type: "institution",
  },
  {
    id: 2,
    name: "김민영",
    action: "사용자 계정 생성",
    timestamp: "5분 전",
    type: "user",
  },
  {
    id: 3,
    name: "강남성형외과",
    action: "무료체험 신청",
    timestamp: "32분 전",
    type: "institution",
  },
  {
    id: 4,
    name: "이영호",
    action: "로그인",
    timestamp: "1시간 전",
    type: "admin",
  },
  {
    id: 5,
    name: "강북피부과",
    action: "결제 완료",
    timestamp: "2시간 전",
    type: "institution",
  },
];

export function RecentActivities() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div className="flex items-center" key={activity.id}>
          <Avatar className="h-9 w-9">
            <AvatarFallback className={`bg-${activity.type === 'admin' ? 'red' : activity.type === 'user' ? 'blue' : 'green'}-100`}>
              {activity.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.name}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {activity.timestamp}
          </div>
        </div>
      ))}
    </div>
  );
}
