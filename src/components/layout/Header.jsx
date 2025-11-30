import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Bell,
  LogOut,
  Settings,
  User as UserIcon,
  MessageSquare,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../api/axiosClient";

export function Header({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. Lấy số tin nhắn chưa đọc ---
  const { data: msgUnreadCount = 0 } = useQuery({
    queryKey: ["msgUnreadCount", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const res = await axiosClient.get("/messages/unread-count");
      return res.count || 0;
    },
    refetchInterval: 10000, // 10s cập nhật 1 lần
    enabled: !!user,
  });

  // --- 2. Lấy số thông báo chưa đọc ---
  const { data: notifUnreadCount = 0 } = useQuery({
    queryKey: ["notifUnreadCount", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      // Gọi API lấy danh sách rồi đếm, hoặc gọi API đếm riêng
      const res = await axiosClient.get("/notifications");
      const list = Array.isArray(res) ? res : res.data || [];
      return list.filter((n) => !n.is_read).length;
    },
    refetchInterval: 10000,
    enabled: !!user,
  });

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const getNavigationItems = () => {
    if (!user || !user.role) return [];

    if (user.role === "student") {
      return [
        { id: "dashboard", label: "Trang chủ", path: "/student" },
        { id: "profile", label: "Hồ sơ", path: "/student/profile" },
        { id: "schedule", label: "Lịch học", path: "/student/myschedule" },
        { id: "groups", label: "Lớp nhóm", path: "/student/groups" },
        { id: "documents", label: "Tài liệu", path: "/documents" },
      ];
    } else if (user.role === "tutor") {
      return [
        { id: "dashboard", label: "Trang chủ", path: "/tutor" },
        { id: "profile", label: "Hồ sơ", path: "/tutor/profile" },
        { id: "schedule", label: "Lịch dạy", path: "/tutor/schedule" },
        { id: "groups", label: "Lớp nhóm", path: "/tutor/groups" },
        { id: "documents", label: "Tài liệu", path: "/documents" },
      ];
    } else if (user.role === "admin") {
      return [
        { id: "dashboard", label: "Trang chủ", path: "/admin" },
        { id: "users", label: "Người dùng", path: "/admin/users" },
        { id: "analytics", label: "Thống kê", path: "/admin/analytics" },
        { id: "documents", label: "Tài liệu", path: "/documents" },
      ];
    }
    return [];
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-brand-gradient text-white h-16 flex items-center justify-between px-4 md:px-8 shadow-sm fixed top-0 left-0 right-0 z-50">
      {/* 🔹 Khối bên trái: Logo + Navigation */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <button
          onClick={() => navigate(user ? `/${user.role}` : "/login")}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <img
            src="/logoBK.png"
            alt="Logo BK"
            className="w-10 h-10 object-contain bg-transparent"
          />
          <h1 className="text-white text-base md:text-lg font-medium leading-none hidden sm:block">
            Tutor Support System
          </h1>
        </button>

        {user && (
          <nav className="hidden md:flex space-x-1">
            {getNavigationItems().map((item) => (
              <Button
                key={item.id}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                size="sm"
                className={`text-white hover:bg-[#A7C6ED] hover:text-[#0388B4] ${
                  isActive(item.path) ? "bg-white text-[#0388B4]" : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        )}
      </div>

      {/* 🔹 Khối bên phải: Icons + User Menu */}
      <div className="flex items-center space-x-3">
        {" "}
        {/* Tăng khoảng cách nhẹ */}
        {user && (
          <>
            {/* 🔔 NÚT THÔNG BÁO (CÓ BADGE) */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-[#A7C6ED] hover:text-[#0388B4]"
                onClick={() => navigate("/notifications")}
              >
                <Bell className="h-5 w-5" />
              </Button>
              {/* Badge Thông Báo */}
              {notifUnreadCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-brand-gradient shadow-sm animate-pulse">
                  {notifUnreadCount > 99 ? "99+" : notifUnreadCount}
                </span>
              )}
            </div>

            {/* 💬 NÚT TIN NHẮN (CÓ BADGE) */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-[#A7C6ED] hover:text-[#0388B4]"
                onClick={() => navigate("/messages")}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              {/* Badge Tin Nhắn */}
              {msgUnreadCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-brand-gradient shadow-sm">
                  {msgUnreadCount > 99 ? "99+" : msgUnreadCount}
                </span>
              )}
            </div>
          </>
        )}
        {/* User Avatar */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-0 border-2 border-white hover:border-[#A7C6ED] transition ml-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="bg-white text-[#0388B4] font-medium">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    user.role === "tutor"
                      ? "/tutor/profile"
                      : "/student/profile"
                  )
                }
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Hồ sơ cá nhân
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="secondary"
            className="bg-white text-[#0388B4] hover:bg-[#A7C6ED]"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </Button>
        )}
      </div>
    </header>
  );
}
