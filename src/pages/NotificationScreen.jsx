import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Footer } from "../components/layout/Footer";
import {
  Bell,
  Check,
  Trash2,
  Filter,
  Calendar,
  AlertTriangle,
  CreditCard,
  Settings,
  FileText,
  UserPlus,
  Info,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import axiosClient from "../api/axiosClient";

export function NotificationScreen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  // --- 1. FETCH DATA TỪ BACKEND ---
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosClient.get("/notifications");
      return Array.isArray(res) ? res : res?.data || [];
    },
    refetchInterval: 30000, // Tự động refresh mỗi 30s để check thông báo mới
  });

  // --- 2. MUTATIONS ---

  // Đánh dấu đã đọc (1 cái hoặc tất cả)
  const readMutation = useMutation({
    mutationFn: async (id) => axiosClient.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  // Xóa thông báo
  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosClient.delete(`/notifications/${id}`),
    onSuccess: () => {
      toast.success("Đã xóa thông báo");
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  // --- 3. HELPER FUNCTIONS ---

  const getIcon = (type) => {
    switch (type) {
      case "schedule":
        return Calendar; // Nhắc lịch
      case "approval":
        return CheckCircle; // Duyệt
      case "registration":
        return UserPlus; // Đăng ký mới
      case "document":
        return FileText; // Tài liệu
      case "system":
        return Settings;
      default:
        return Info;
    }
  };

  const getPriorityColor = (type) => {
    // Giả lập độ ưu tiên dựa trên loại thông báo
    switch (type) {
      case "registration": // Cần xử lý ngay
      case "schedule": // Sắp diễn ra
        return "bg-red-100 text-red-800 border-red-200";
      case "approval":
        return "bg-green-100 text-green-800 border-green-200";
      case "document":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTimeDiff = (dateString) => {
    const now = new Date();
    const t = new Date(dateString);
    const diff = Math.floor((now - t) / 60000); // Phút

    if (diff < 1) return "Vừa xong";
    if (diff < 60) return `${diff} phút trước`;
    if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
    return `${Math.floor(diff / 1440)} ngày trước`;
  };

  // Xử lý click vào thông báo
  const handleNotificationClick = (n) => {
    // 1. Đánh dấu đã đọc
    if (!n.is_read) readMutation.mutate(n.id);

    // 2. Điều hướng dựa trên Metadata
    if (n.data?.courseId) {
      navigate(`/courses/${n.data.courseId}`);
    } else if (n.type === "schedule") {
      navigate("/student/myschedule"); // Hoặc /tutor/schedule tùy role
    }
  };

  // --- 4. FILTER LOGIC ---
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.is_read;
    // Map các tab khác vào loại thông báo tương ứng
    if (filter === "schedule") return n.type === "schedule";
    if (filter === "system")
      return n.type === "system" || n.type === "document";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const systemCount = notifications.filter(
    (n) => n.type === "system" || n.type === "document"
  ).length;

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3961c5]"></div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl space-y-6">
        {/* Header */}
        <section className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              Thông báo
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi các cập nhật quan trọng
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => readMutation.mutate("all")}
              className="text-[#0388B4] border-[#0388B4]"
            >
              <Check className="h-4 w-4 mr-2" /> Đánh dấu tất cả đã đọc
            </Button>
          )}
        </section>

        {/* Summary Cards */}
        <section className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-brand-gradient rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng số</p>
                <p className="font-medium text-xl">{notifications.length}</p>
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
                <p className="font-medium text-xl text-red-600">
                  {unreadCount}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hệ thống/Tài liệu</p>
                <p className="font-medium text-xl text-blue-600">
                  {systemCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main List */}
        <section>
          <Tabs
            defaultValue="all"
            className="space-y-6"
            onValueChange={setFilter}
          >
            <div className="flex items-center gap-3 overflow-x-auto">
              <TabsList className="flex flex-row flex-nowrap gap-2 w-max">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                <TabsTrigger value="schedule">Lịch học</TabsTrigger>
                <TabsTrigger value="system">Hệ thống</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={filter} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>Danh sách ({filteredNotifications.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-3">
                      {filteredNotifications.map((n) => {
                        const Icon = getIcon(n.type);
                        return (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-4 border rounded-lg transition-all hover:shadow-md cursor-pointer flex items-start space-x-4
                              ${
                                !n.is_read
                                  ? "bg-blue-50/50 border-blue-200"
                                  : "bg-white border-gray-100"
                              }`}
                          >
                            {/* Icon */}
                            <div
                              className={`p-2.5 rounded-full flex-shrink-0 ${
                                !n.is_read
                                  ? "bg-white shadow-sm text-[#0388B4]"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <h3
                                  className={`text-sm font-bold truncate pr-2 ${
                                    !n.is_read
                                      ? "text-[#0388B4]"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {n.title}
                                </h3>
                                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                  {getTimeDiff(n.createdAt)}
                                </span>
                              </div>

                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {n.message}
                              </p>

                              {/* Footer Actions */}
                              <div className="flex items-center justify-between mt-2">
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-2 py-0.5 ${getPriorityColor(
                                    n.type
                                  )}`}
                                >
                                  {n.type.toUpperCase()}
                                </Badge>

                                <div
                                  className="flex space-x-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {!n.is_read && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 text-blue-600 hover:bg-blue-100 rounded-full"
                                      title="Đã đọc"
                                      onClick={() => readMutation.mutate(n.id)}
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                    title="Xóa"
                                    onClick={() => deleteMutation.mutate(n.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="h-8 w-8 text-gray-300" />
                      </div>
                      <p>Không có thông báo nào trong mục này.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
}
