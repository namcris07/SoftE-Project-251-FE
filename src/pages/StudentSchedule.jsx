import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User as UserIcon,
  Plus,
  Edit,
  Trash2,
  Video,
  BookOpen,
} from "lucide-react";
import { Footer } from "../components/layout/Footer";

export function StudentSchedule({ user, onNavigate }) {
  const [viewMode, setViewMode] = useState("week");
  const [selectedWeek, setSelectedWeek] = useState("current");

  // ✅ Mock data đồng bộ UI gốc
  const schedule = [
    {
      id: "1",
      subject: "Toán cao cấp",
      tutor: "TS. Nguyễn Văn Minh",
      date: "2025-10-29",
      time: "14:00 - 16:00",
      location: "Phòng H1-201",
      mode: "offline",
      status: "approved",
      notes: "Chương 4: Đạo hàm và ứng dụng",
      sessionNumber: 6,
      totalSessions: 10,
    },
    {
      id: "2",
      subject: "Lập trình C++",
      tutor: "ThS. Trần Thị Lan",
      date: "2025-10-30",
      time: "09:00 - 11:00",
      location: "Online - Zoom",
      mode: "online",
      status: "pending",
      notes: "Project: Quản lý thư viện",
      sessionNumber: 4,
      totalSessions: 8,
    },
    {
      id: "3",
      subject: "Vật lý đại cương",
      tutor: "PGS. Lê Hoàng Nam",
      date: "2025-11-01",
      time: "08:00 - 10:00",
      location: "Phòng A2-305",
      mode: "offline",
      status: "completed",
      notes: "Ôn tập chương 2: Cơ học chất điểm",
      sessionNumber: 6,
      totalSessions: 6,
    },
    {
      id: "4",
      subject: "Cấu trúc dữ liệu & Giải thuật",
      tutor: "TS. Phạm Quốc Bảo",
      date: "2025-11-02",
      time: "13:30 - 15:30",
      location: "Online - Google Meet",
      mode: "online",
      status: "confirmed",
      notes: "Thực hành: Hash table và cây nhị phân",
      sessionNumber: 2,
      totalSessions: 10,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    const currentWeekStart = new Date(
      today.setDate(today.getDate() - today.getDay() + 1)
    );
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const dayNames = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  const getSessionsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return schedule.filter((s) => s.date === dateString);
  };

  const upcomingSession = schedule
    .filter((s) => new Date(s.date + "T" + s.time.split(" - ")[0]) > new Date())
    .sort(
      (a, b) =>
        new Date(a.date + "T" + a.time.split(" - ")[0]) -
        new Date(b.date + "T" + b.time.split(" - ")[0])
    )[0];

  // 📅 Week view (copy chuẩn UI code 1)
  const renderWeekView = () => (
    <div className="grid grid-cols-7 gap-2">
      {weekDates.map((date, index) => {
        const sessionsForDay = getSessionsForDate(date);
        const isToday = date.toDateString() === new Date().toDateString();

        return (
          <div
            key={index}
            className={`border rounded-lg p-3 min-h-[200px] ${
              isToday ? "bg-blue-50 border-[#0388B4]" : "bg-white"
            }`}
          >
            <div className="text-center mb-3">
              <div className="text-sm font-medium text-gray-600">
                {dayNames[index]}
              </div>
              <div
                className={`text-lg font-bold ${
                  isToday ? "text-[#0388B4]" : "text-gray-900"
                }`}
              >
                {date.getDate()}
              </div>
            </div>

            <div className="space-y-2">
              {sessionsForDay.map((s) => (
                <div
                  key={s.id}
                  className="p-2 bg-white border border-[#A7C6ED] rounded text-xs hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#0388B4] truncate">
                      {s.subject}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(s.status)}`}
                    >
                      {getStatusLabel(s.status)}
                    </Badge>
                  </div>
                  <div className="text-gray-600">
                    <div className="flex items-center space-x-1 mb-1">
                      <Clock className="h-3 w-3" />
                      <span>{s.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {s.mode === "online" ? (
                        <Video className="h-3 w-3" />
                      ) : (
                        <MapPin className="h-3 w-3" />
                      )}
                      <span className="truncate">{s.location}</span>
                    </div>
                  </div>
                </div>
              ))}

              {sessionsForDay.length === 0 && (
                <div className="text-center text-gray-400 text-xs py-4">
                  Không có lịch học
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // 📜 List view (month view)
  const renderMonthView = () => (
    <div className="grid gap-4">
      {schedule.map((s) => (
        <Card key={s.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-lg">{s.subject}</h3>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {s.tutor}
                </p>
              </div>
              <Badge className={getStatusColor(s.status)}>
                {getStatusLabel(s.status)}
              </Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{s.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{s.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                {s.mode === "online" ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                <span>{s.location}</span>
              </div>
            </div>

            {s.notes && (
              <p className="text-sm text-gray-700 mb-3">
                <BookOpen className="h-4 w-4 inline mr-1" />
                {s.notes}
              </p>
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Buổi {s.sessionNumber}/{s.totalSessions}
              </p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-[#0388B4] border-[#0388B4]"
                >
                  <Edit className="h-4 w-4 mr-1" /> Sửa
                </Button>
                {s.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Hủy
                  </Button>
                )}
                <Button
                  size="sm"
                  className="bg-[#0388B4] hover:bg-[#2851b4] text-white"
                >
                  Chi tiết
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              Lịch học của tôi
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi lịch học cá nhân
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#0388B4] mb-1">
                  {schedule.length}
                </div>
                <div className="text-sm text-gray-600">Tổng buổi học</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {
                    schedule.filter(
                      (s) => s.status === "approved" || s.status === "confirmed"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Đã xác nhận</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {schedule.filter((s) => s.status === "pending").length}
                </div>
                <div className="text-sm text-gray-600">Chờ xác nhận</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {schedule.filter((s) => s.mode === "online").length}
                </div>
                <div className="text-sm text-gray-600">Học online</div>
              </CardContent>
            </Card>
          </div>

          {/* Next session */}
          {upcomingSession && (
            <Card className="mb-6 border-[#0388B4] bg-blue-50">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-[#0388B4] mb-1">
                    Buổi học tiếp theo
                  </h3>
                  <p className="text-sm text-gray-700">
                    {upcomingSession.subject} với {upcomingSession.tutor}
                  </p>
                  <p className="text-sm text-gray-600">
                    {upcomingSession.date} • {upcomingSession.time} •{" "}
                    {upcomingSession.location}
                  </p>
                </div>
                <Button className="bg-[#0388B4] hover:bg-[#2851b4] text-white">
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Chế độ xem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Xem theo tuần</SelectItem>
                  <SelectItem value="month">Xem theo danh sách</SelectItem>
                </SelectContent>
              </Select>

              {viewMode === "week" && (
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Chọn tuần" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="previous">Tuần trước</SelectItem>
                    <SelectItem value="current">Tuần này</SelectItem>
                    <SelectItem value="next">Tuần sau</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => onNavigate("scheduling")}
                className="bg-[#0388B4] hover:bg-[#2851b4] text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Đặt lịch học mới
              </Button>
            </div>
          </div>

          {/* Schedule view */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-[#0388B4]" />
                <span>
                  {viewMode === "week" ? "Lịch tuần" : "Danh sách lịch học"}
                </span>
              </CardTitle>
              <CardDescription>
                {viewMode === "week"
                  ? "Xem lịch học theo từng ngày trong tuần"
                  : "Danh sách tất cả các buổi học đã đăng ký"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "week" ? renderWeekView() : renderMonthView()}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
