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
  MessageSquare,
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";

export function Header({ user, currentScreen, onNavigate, onLogout }) {
  const getNavigationItems = () => {
    if (user.role === "student") {
      return [
        { id: "dashboard", label: "Trang chủ", screen: "dashboard" },
        { id: "profile-student", label: "Hồ sơ", screen: "profile-student" },
        {
          id: "student-schedule",
          label: "Lịch học",
          screen: "student-schedule",
        },
        { id: "scheduling", label: "Đặt lịch học", screen: "scheduling" },
        { id: "feedback", label: "Đánh giá", screen: "feedback" },
        { id: "payment", label: "Thanh toán", screen: "payment" },
        { id: "documents", label: "Tài liệu", screen: "documents" },
      ];
    } else if (user.role === "tutor") {
      return [
        { id: "dashboard", label: "Trang chủ", screen: "dashboard" },
        { id: "profile", label: "Hồ sơ", screen: "profile" },
        { id: "scheduling", label: "Quản lý lịch", screen: "scheduling" },
        { id: "feedback", label: "Phản hồi", screen: "feedback" },
        { id: "documents", label: "Tài liệu", screen: "documents" },
      ];
    } else if (user.role === "admin") {
      return [
        { id: "dashboard", label: "Trang chủ", screen: "dashboard" },
        { id: "users", label: "Quản lý người dùng", screen: "users" },
        { id: "reports", label: "Báo cáo", screen: "reports" },
        { id: "scholarships", label: "Học bổng", screen: "scholarships" },
      ];
    }
    // Không cần 'baseItems' vì đã có điều kiện !currentUser ở dưới
    return [];
  };

  return (
    // 1️⃣ THÊM "justify-between" VÀ GIỮ NGUYÊN "px-8"
    <header className="bg-brand-gradient text-white h-16 flex items-center justify-between px-8 shadow-sm fixed top-0 left-0 right-0 z-50">
      {/* Nội dung header */}
      {/* 2️⃣ LOẠI BỎ 2 DIV LỒNG (div mx-auto và div justify-between) */}

      {/* 🔹 Khối bên trái: Logo + Title + Navigation */}
      <div className="flex items-center space-x-6">
        {/* Logo + Title */}
        <button
          onClick={() => {
            if (currentScreen === "login") onNavigate("home");
            else if (user) onNavigate("dashboard");
          }}
          className="flex items-center space-x-3 focus:outline-none"
        >
          <img
            src="/logoBK.png"
            alt="Logo BK"
            className="w-10 h-10 object-contain bg-transparent"
          />
          <h1 className="text-white text-lg font-medium leading-none">
            Tutor Support System
          </h1>
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-1">
          {getNavigationItems().map((item) => (
            <Button
              key={item.id}
              variant={currentScreen === item.screen ? "secondary" : "ghost"}
              className={`text-white hover:bg-[#A7C6ED] hover:text-[#0388B4] ${
                currentScreen === item.screen ? "bg-white text-[#0388B4]" : ""
              }`}
              onClick={() => onNavigate(item.screen)}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* 🔹 Khối bên phải: Language + Icons + User Menu */}
      <div className="flex items-center space-x-1">
        {/* Language Selector */}
        <Button
          variant="ghost"
          className="text-white hover:bg-[#A7C6ED] hover:text-[#0388B4] text-sm"
        >
          Vietnamese (vi)
        </Button>

        {/* Notifications (ẩn nếu chưa login) */}
        {user && (
          <>
            {/* 🔔 Nút thông báo */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#A7C6ED] hover:text-[#0388B4]"
              onClick={() => onNavigate("notifications")}
            >
              <Bell className="h-5 w-5" />
            </Button>
            {/* 💬 Nút tin nhắn */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#A7C6ED] hover:text-[#0388B4]"
              onClick={() => onNavigate("messages")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-5 w-5 fill-current"
              >
                <path d="M51.9 384.9C19.3 344.6 0 294.4 0 240 0 107.5 114.6 0 256 0S512 107.5 512 240 397.4 480 256 480c-36.5 0-71.2-7.2-102.6-20L37 509.9c-3.7 1.6-7.5 2.1-11.5 2.1-14.1 0-25.5-11.4-25.5-25.5 0-4.3 1.1-8.5 3.1-12.2l48.8-89.4zm37.3-30.2c12.2 15.1 14.1 36.1 4.8 53.2l-18 33.1 58.5-25.1c11.8-5.1 25.2-5.2 37.1-.3 25.7 10.5 54.2 16.4 84.3 16.4 117.8 0 208-88.8 208-192S373.8 48 256 48 48 136.8 48 240c0 42.8 15.1 82.4 41.2 114.7z" />
              </svg>
            </Button>
          </>
        )}

        {/* User Menu (ẩn nếu chưa login) */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-0 border-2 border-white hover:border-[#A7C6ED] transition"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={
                      user?.avatarUrl
                        ? user.avatarUrl.startsWith("http")
                          ? user.avatarUrl
                          : `http://localhost:3000${user.avatarUrl}`
                        : "/default-avatar.png"
                    }
                  />
                  <AvatarFallback className="bg-white text-[#0388B4] font-medium">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              {user?.role === "tutor" && (
                <DropdownMenuItem onClick={() => onNavigate("profile")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Hồ sơ cá nhân
                </DropdownMenuItem>
              )}
              {user?.role === "student" && (
                <DropdownMenuItem
                  onClick={() => onNavigate("profile-student")}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  Hồ sơ cá nhân
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="secondary"
            className="bg-white text-[#0388B4] hover:bg-[#A7C6ED]"
            onClick={() => onNavigate("login")}
          >
            Đăng nhập
          </Button>
        )}
      </div>
    </header>
  );
}
