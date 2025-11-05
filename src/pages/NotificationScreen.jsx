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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Footer } from "../components/layout/Footer";
import {
  Bell,
  Check,
  Trash2,
  Filter,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Star,
  CreditCard,
  Settings,
} from "lucide-react";

export function NotificationScreen({ user, onNavigate }) {
  const [filter, setFilter] = useState("all");

  const notifications = [
    {
      id: "1",
      type: "schedule",
      title: "Lịch học mới được xác nhận",
      message:
        "Buổi học Toán cao cấp với TS. Nguyễn Văn Minh đã được xác nhận vào ngày 8/1/2025 lúc 14:00.",
      timestamp: "2025-01-06T15:30:00",
      read: false,
      priority: "high",
      source: "system",
      icon: Calendar,
      color: "text-[#0388B4]",
    },
    {
      id: "2",
      type: "feedback",
      title: "Phản hồi mới từ học viên",
      message:
        "Nguyễn Văn An đã để lại đánh giá 5 sao cho buổi học Toán cao cấp.",
      timestamp: "2025-01-06T14:20:00",
      read: false,
      priority: "medium",
      source: "student",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      id: "3",
      type: "payment",
      title: "Thanh toán thành công",
      message:
        "Thanh toán cho buổi học Lập trình C++ đã được xử lý thành công. Số tiền: 240,000 VNĐ.",
      timestamp: "2025-01-06T12:15:00",
      read: true,
      priority: "medium",
      source: "system",
      icon: CreditCard,
      color: "text-green-500",
    },
    {
      id: "4",
      type: "system",
      title: "Cập nhật hệ thống",
      message:
        "Hệ thống sẽ bảo trì vào ngày 10/1/2025 từ 2:00-4:00 sáng để cải thiện hiệu suất.",
      timestamp: "2025-01-06T10:00:00",
      read: true,
      priority: "low",
      source: "admin",
      icon: Settings,
      color: "text-blue-500",
    },
    {
      id: "5",
      type: "alert",
      title: "Nhắc nhở thanh toán",
      message:
        "Bạn có 1 khoản thanh toán chưa hoàn tất. Hạn cuối: 10/1/2025.",
      timestamp: "2025-01-06T09:30:00",
      read: false,
      priority: "high",
      source: "system",
      icon: AlertTriangle,
      color: "text-red-500",
    },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    if (filter === "priority") return n.priority === "high";
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const priorityCount = notifications.filter((n) => n.priority === "high").length;

  const markAsRead = (id) => console.log("Mark as read:", id);
  const markAllAsRead = () => console.log("Mark all as read");
  const deleteNotification = (id) => console.log("Delete:", id);

  const getTimeDiff = (time) => {
    const now = new Date();
    const t = new Date(time);
    const diff = Math.floor((now - t) / 60000);
    if (diff < 60) return `${diff} phút trước`;
    if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
    return `${Math.floor(diff / 1440)} ngày trước`;
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityLabel = (p) => {
    switch (p) {
      case "high":
        return "Ưu tiên cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return p;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl space-y-6">
        {/* 🟦 Header */}
        <section>
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Thông báo</h1>
          <p className="text-gray-600">
            Quản lý và theo dõi các thông báo quan trọng
          </p>
        </section>

        {/* 🟨 Summary */}
        <section className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-brand-gradient rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng thông báo</p>
                <p className="font-medium">{notifications.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chưa đọc</p>
                <p className="font-medium text-red-600">{unreadCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ưu tiên cao</p>
                <p className="font-medium text-orange-600">{priorityCount}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 🟩 Tabs and Notification List */}
        <section>
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full max-w-md grid-cols-5">
                {["all", "unread", "priority", "schedule", "system"].map((tab) => (
                  <TabsTrigger key={tab} value={tab} onClick={() => setFilter(tab)}>
                    {tab === "all"
                      ? "Tất cả"
                      : tab === "unread"
                      ? "Chưa đọc"
                      : tab === "priority"
                      ? "Ưu tiên"
                      : tab === "schedule"
                      ? "Lịch học"
                      : "Hệ thống"}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="border-[#0388B4] text-[#0388B4]"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Đánh dấu tất cả đã đọc
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Lọc
                </Button>
              </div>
            </div>

            <TabsContent value={filter} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Danh sách thông báo ({filteredNotifications.length})</span>
                    <Badge className="bg-[#A7C6ED] text-[#0388B4]">
                      {filter === "all"
                        ? "Tất cả"
                        : filter === "unread"
                        ? "Chưa đọc"
                        : filter === "priority"
                        ? "Ưu tiên cao"
                        : filter === "schedule"
                        ? "Lịch học"
                        : "Hệ thống"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-3">
                      {filteredNotifications.map((n) => {
                        const Icon = n.icon;
                        return (
                          <div
                            key={n.id}
                            className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                              !n.read
                                ? "bg-blue-50 border-[#0388B4]"
                                : "bg-white"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  !n.read ? "bg-brand-gradient" : "bg-gray-100"
                                }`}
                              >
                                <Icon
                                  className={`h-5 w-5 ${
                                    !n.read ? "text-white" : n.color
                                  }`}
                                />
                              </div>

                              <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                  <div>
                                    <h3
                                      className={`font-medium ${
                                        !n.read
                                          ? "text-[#0388B4]"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {n.title}
                                    </h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${getPriorityColor(
                                          n.priority
                                        )}`}
                                      >
                                        {getPriorityLabel(n.priority)}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        {n.source === "system"
                                          ? "Hệ thống"
                                          : n.source === "tutor"
                                          ? "Gia sư"
                                          : n.source === "student"
                                          ? "Học viên"
                                          : "Quản trị"}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {getTimeDiff(n.timestamp)}
                                  </span>
                                </div>

                                <p className="text-gray-700 mb-3">{n.message}</p>

                                <div className="flex space-x-2">
                                  {!n.read && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-[#0388B4] border-[#0388B4] text-xs"
                                      onClick={() => markAsRead(n.id)}
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Đánh dấu đã đọc
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 text-xs"
                                    onClick={() => deleteNotification(n.id)}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Xóa
                                  </Button>
                                  {(n.type === "schedule" ||
                                    n.type === "payment") && (
                                    <Button
                                      size="sm"
                                      className="bg-brand-gradient hover:bg-[#2851b4] text-white text-xs"
                                      onClick={() =>
                                        onNavigate(
                                          n.type === "schedule"
                                            ? "scheduling"
                                            : "payment"
                                        )
                                      }
                                    >
                                      Xem chi tiết
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Không có thông báo nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* ⚙️ Notification Settings */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-[#0388B4]" />
                <span>Cài đặt thông báo</span>
              </CardTitle>
              <CardDescription>
                Quản lý các loại thông báo bạn muốn nhận
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {[
                "Thông báo lịch học",
                "Thông báo thanh toán",
                "Phản hồi từ học viên",
                "Thông báo hệ thống",
                "Email thông báo",
                "Thông báo đẩy",
              ].map((label, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <span className="text-sm">{label}</span>
                  <Button variant="outline" size="sm">
                    {label === "Email thông báo" ? "Tắt" : "Bật"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>

      {/* 🔻 Footer */}
      <Footer />
    </div>
  );
}
