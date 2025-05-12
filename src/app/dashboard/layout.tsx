"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Building2, 
  BookOpen, 
  BadgeDollarSign, 
  Receipt, 
  FileBarChart, 
  FileText, 
  Camera, 
  Smartphone, 
  Menu, 
  LogOut,
  BarChart3,
  ChevronDown,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  children: React.ReactNode;
}

interface SideNavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  submenu?: {
    title: string;
    href: string;
  }[];
  isActive?: boolean;
  isOpen?: boolean;
}

const Sidebar = ({ children }: SidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    "서비스 관리": true,
  });
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // 창 크기 변경 감지 및 사이드바 상태 조절
  const checkScreenSize = useCallback(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    }
  }, []);

  // 초기 로드 및 창 크기 변경 시 체크
  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [checkScreenSize]);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const navItems: SideNavItem[] = [
    {
      title: "서비스 관리",
      href: "#",
      icon: <BookOpen className="h-5 w-5" />,
      submenu: [
        { title: "무료체험 관리", href: "/dashboard/free-trial" },
        { title: "기관 관리", href: "/dashboard/institution" },
        { title: "이용자 관리", href: "/dashboard/users" },
        { title: "라이선스 관리", href: "/dashboard/license" },
        { title: "결제 내역", href: "/dashboard/payment" },
        { title: "사진 관리", href: "/dashboard/photos" },
        { title: "리포트 관리", href: "/dashboard/reports" },
        { title: "Mobile앱 사용자 관리", href: "/dashboard/mobile-users" },
      ],
    },
    {
      title: "게시판 관리",
      href: "#",
      icon: <FileText className="h-5 w-5" />,
      submenu: [
        { title: "공지사항 관리", href: "/dashboard/notice" },
        { title: "FAQ 관리", href: "/dashboard/faq" },
        { title: "온라인 문의 관리", href: "/dashboard/inquiry" },
      ],
    },
    {
      title: "Mobile앱 관리",
      href: "/dashboard/mobile-app",
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      title: "통합관리자 관리",
      href: "/dashboard/administrators",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "통계 관리",
      href: "/dashboard/statistics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-800",
          isSidebarOpen 
            ? "translate-x-0 w-64" 
            : isMobile 
              ? "-translate-x-full w-64" 
              : "w-16 translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
          <div className={cn("text-xl font-bold text-blue-600 dark:text-blue-400", !isSidebarOpen && !isMobile && "text-center w-full")}>
            {isSidebarOpen || isMobile ? "d.LEMON" : "d.L"}
          </div>
          {(isSidebarOpen || isMobile) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.title}>
                {item.submenu && (isSidebarOpen || isMobile) ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                        openSubmenus[item.title] && "bg-gray-100 dark:bg-gray-700"
                      )}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </div>
                      <svg
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openSubmenus[item.title] && "rotate-90"
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    {openSubmenus[item.title] && (
                      <ul className="ml-6 space-y-1">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.title}>
                            <Link
                              href={subItem.href}
                              className={cn(
                                "block rounded-md py-2 pl-4 pr-2 text-sm font-medium",
                                pathname === subItem.href
                                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                              )}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.submenu ? item.submenu[0].href : item.href}
                    className={cn(
                      "flex items-center rounded-md p-2 text-sm font-medium",
                      (pathname === item.href || (item.submenu && item.submenu.some(sub => pathname === sub.href)))
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    )}
                    title={item.title}
                  >
                    <div className={cn("flex items-center", !isSidebarOpen && !isMobile && "justify-center w-full")}>
                      {item.icon}
                      {(isSidebarOpen || isMobile) && <span className="ml-3">{item.title}</span>}
                    </div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <Link href="/login">
            <Button
              variant="ghost"
              className={cn(
                "flex items-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200",
                isSidebarOpen || isMobile 
                  ? "w-full justify-start" 
                  : "w-full justify-center"
              )}
            >
              <LogOut className="h-5 w-5" />
              {(isSidebarOpen || isMobile) && <span className="ml-2">로그아웃</span>}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen 
            ? "ml-64" 
            : isMobile 
              ? "ml-0" 
              : "ml-16"
        )}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-3"
              title={isSidebarOpen ? "사이드바 숨기기" : "사이드바 보이기"}
            >
              {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200 truncate">
              안드로겐 탈모진단 AI의료기기 통합관리자
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              관리자님 안녕하세요
            </span>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-sm">
                  <Settings className="h-4 w-4" />
                  <span>메뉴</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>메뉴 바로가기</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {navItems.map((item) => (
                    item.submenu ? (
                      <DropdownMenu key={item.title}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="flex w-full items-center justify-between px-2 py-1.5 text-sm">
                            <div className="flex items-center">
                              {item.icon}
                              <span className="ml-2">{item.title}</span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" side="right">
                          {item.submenu.map((subItem) => (
                            <DropdownMenuItem key={subItem.title} asChild>
                              <Link href={subItem.href} className={cn(
                                pathname === subItem.href && "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              )}>
                                {subItem.title}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <DropdownMenuItem key={item.title} asChild>
                        <Link href={item.href} className="flex items-center">
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    )
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Sidebar>{children}</Sidebar>;
}
