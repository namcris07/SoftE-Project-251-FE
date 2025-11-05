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
import { Progress } from "../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";
import { Footer } from "../components/layout/Footer";
import {
  Users,
  Calendar,
  AlertTriangle,
  BarChart3,
  Shield,
  Database,
  Settings,
  FileText,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Download,
  RefreshCw,
  Search,
  Eye,
  Award,
  TrendingUp,
  Building2,
  Star,
  Activity,
} from "lucide-react";

export function AdminDashboard({ user, onNavigate }) {
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const systemStats = {
    totalUsers: 1247,
    activeTutors: 89,
    activeStudents: 1158,
    totalSessions: 3456,
    systemUptime: 99.8,
    pendingApprovals: 12,
  };

  const recentAlerts = [
    {
      id: "1",
      type: "warning",
      message: "Hệ thống thanh toán cần bảo trì định kỳ",
      timestamp: "2025-01-06 14:30",
      priority: "medium",
    },
    {
      id: "2",
      type: "info",
      message: "Đã có 5 gia sư mới đăng ký trong tuần",
      timestamp: "2025-01-06 10:15",
      priority: "low",
    },
    {
      id: "3",
      type: "error",
      message: "Kết nối HCMUT_DATACORE gián đoạn 2 phút",
      timestamp: "2025-01-06 09:45",
      priority: "high",
    },
  ];

  const pendingApprovals = [
    {
      id: "1",
      type: "tutor",
      name: "TS. Phạm Văn Thành",
      subject: "Vật lý đại cương",
      submitDate: "2025-01-05",
      status: "pending",
    },
    {
      id: "2",
      type: "program",
      name: "Chương trình gia sư Toán cao cấp nâng cao",
      coordinator: "ThS. Nguyễn Thị Lan",
      submitDate: "2025-01-04",
      status: "pending",
    },
  ];
 const handleSyncDatacore = () => {
   setShowSyncDialog(true);
   // Simulate sync
   setTimeout(() => {
     setShowSyncDialog(false);
     alert("Đồng bộ dữ liệu từ HCMUT_DATACORE thành công!");
   }, 2000);
 };
  const weeklyReports = [
    {
      id: "1",
      title: "Báo cáo hoạt động tuần 1/2025",
      period: "30/12/2024 - 05/01/2025",
      status: "completed",
      downloadUrl: "#",
    },
    {
      id: "2",
      title: "Báo cáo đánh giá gia sư Q4/2024",
      period: "Q4 2024",
      status: "in_progress",
      downloadUrl: "#",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* 🔹 MAIN CONTENT */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Bảng điều khiển quản trị
          </h1>
          <p className="text-gray-600">
            Quản lý và giám sát hệ thống gia sư HCMUT
          </p>
        </div>

        {/* System Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng người dùng
                  </p>
                  <p className="text-2xl font-bold text-[#0388B4]">
                    {systemStats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-[#A7C6ED]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Gia sư hoạt động
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {systemStats.activeTutors}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng buổi học
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {systemStats.totalSessions.toLocaleString()}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Uptime hệ thống
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {systemStats.systemUptime}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => onNavigate("users")}
            className="h-24 bg-brand-gradient text-white flex flex-col items-center justify-center space-y-2"
          >
            <Users className="h-6 w-6" />
            <span>Quản lý người dùng</span>
          </Button>
          <Button
            onClick={handleSyncDatacore}
            className="h-24 bg-[#A7C6ED] hover:bg-[#8fb3e8] text-[#3961c5] flex flex-col items-center justify-center space-y-2"
          >
            <RefreshCw className="h-6 w-6" />
            <span>Đồng bộ DATACORE</span>
          </Button>
          <Button
            onClick={() => onNavigate("reports")}
            className="h-24 bg-[#A7C6ED] hover:bg-[#8fb3e8] text-[#0388B4] flex flex-col items-center justify-center space-y-2"
          >
            <BarChart3 className="h-6 w-6" />
            <span>Báo cáo & Thống kê</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 border-[#0388B4] text-[#0388B4] hover:bg-[#0388B4] hover:text-white flex flex-col items-center justify-center space-y-2"
          >
            <Settings className="h-6 w-6" />
            <span>Cài đặt hệ thống</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* System Alerts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-[#0388B4]" />
                  <span>Cảnh báo hệ thống</span>
                  {recentAlerts.filter((a) => a.priority === "high").length >
                    0 && (
                    <Badge variant="destructive" className="ml-2">
                      {recentAlerts.filter((a) => a.priority === "high").length}{" "}
                      Ưu tiên cao
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Giám sát trạng thái và sự cố hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg"
                    >
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${
                          alert.type === "error"
                            ? "bg-red-500"
                            : alert.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {alert.timestamp}
                        </p>
                      </div>
                      <Badge
                        variant={
                          alert.priority === "high"
                            ? "destructive"
                            : alert.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {alert.priority === "high"
                          ? "Cao"
                          : alert.priority === "medium"
                          ? "Trung bình"
                          : "Thấp"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-[#0388B4]" />
                  <span>Chờ phê duyệt</span>
                  <Badge className="bg-[#0388B4]">
                    {systemStats.pendingApprovals}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.type === "tutor"
                              ? `Môn học: ${item.subject}`
                              : `Điều phối: ${item.coordinator}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            Ngày nộp: {item.submitDate}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[#0388B4] border-[#0388B4]"
                        >
                          {item.type === "tutor" ? "Gia sư" : "Chương trình"}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Phê duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600"
                        >
                          Từ chối
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#0388B4] border-[#0388B4]"
                        >
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health & Reports */}
          <div className="space-y-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-[#0388B4]" />
                  <span>Tình trạng hệ thống</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Server uptime</span>
                      <span className="text-green-600">
                        {systemStats.systemUptime}%
                      </span>
                    </div>
                    <Progress
                      value={systemStats.systemUptime}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>HCMUT_DATACORE</span>
                      <span className="text-green-600">Kết nối</span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Payment Gateway</span>
                      <span className="text-yellow-600">Bảo trì</span>
                    </div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>HCMUT_SSO</span>
                      <span className="text-green-600">Hoạt động</span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Đang đồng bộ HCMUT_DATACORE</DialogTitle>
                  <DialogDescription>
                    Hệ thống đang đồng bộ dữ liệu từ HCMUT DATACORE
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="animate-spin h-8 w-8 border-4 border-[#3961c5] border-t-transparent rounded-full" />
                    <p>Đang đồng bộ dữ liệu...</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Quá trình này có thể mất vài phút. Vui lòng không đóng cửa
                    sổ này.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-[#0388B4]" />
                  <span>Báo cáo gần đây</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {report.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {report.period}
                          </p>
                        </div>
                        <Badge
                          variant={
                            report.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            report.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {report.status === "completed"
                            ? "Hoàn thành"
                            : "Đang xử lý"}
                        </Badge>
                      </div>
                      {report.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#0388B4] border-[#0388B4] text-xs"
                        >
                          Tải xuống
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => onNavigate("reports")}
                  className="w-full mt-4 bg-brand-gradient text-white"
                >
                  Xem tất cả báo cáo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 🔹 FOOTER luôn ở cuối */}
      <Footer />
    </div>
  );
}
