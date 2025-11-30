import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Footer } from "../../components/layout/Footer";
import {
  Users,
  Calendar,
  AlertTriangle,
  BarChart3,
  Shield,
  Database,
  Settings,
  FileText,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import axiosClient from "../../api/axiosClient";

// Mock API
const fetchAdminDashboard = async () => {
  // return axiosClient.get("/admin/dashboard");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          totalUsers: 1247,
          activeTutors: 89,
          totalSessions: 3456,
          systemUptime: 99.8,
          pendingApprovals: 5,
        },
        alerts: [
          {
            id: 1,
            type: "warning",
            msg: "Payment Gateway phản hồi chậm",
            time: "10:30",
          },
          {
            id: 2,
            type: "error",
            msg: "Server quá tải lúc 09:00",
            time: "09:00",
          },
        ],
        pendingApprovals: [
          {
            id: 1,
            name: "TS. Phạm Văn Thành",
            type: "tutor_registration",
            date: "2025-01-05",
          },
          {
            id: 2,
            name: "Nguyễn Thị Lan",
            type: "payout_request",
            amount: 2000000,
            date: "2025-01-06",
          },
        ],
      });
    }, 600);
  });
};

export function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSyncDialog, setShowSyncDialog] = useState(false);

  // 1. Fetch Data
  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchAdminDashboard,
  });

  // 2. Mutation: Sync Data
  const syncMutation = useMutation({
    mutationFn: async () => {
      // await axiosClient.post("/admin/sync-datacore");
      return new Promise((resolve) => setTimeout(resolve, 2000));
    },
    onMutate: () => setShowSyncDialog(true),
    onSuccess: () => {
      toast.success("Đồng bộ dữ liệu thành công!");
      setTimeout(() => setShowSyncDialog(false), 500);
    },
  });

  // 3. Mutation: Approve/Reject
  const approvalMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      // await axiosClient.post(`/admin/approve/${id}`, { action });
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: (_, vars) => {
      toast.success(
        `Đã ${vars.action === "approve" ? "duyệt" : "từ chối"} yêu cầu.`
      );
      queryClient.invalidateQueries(["adminDashboard"]);
    },
  });

  if (isLoading)
    return <div className="p-10 text-center">Đang tải dữ liệu quản trị...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Dashboard Quản Trị
          </h1>
          <p className="text-gray-600">
            Giám sát toàn bộ hoạt động của hệ thống
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-[#0388B4]">
                  {data?.stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-[#A7C6ED]" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Gia sư hoạt động</p>
                <p className="text-2xl font-bold text-green-600">
                  {data?.stats.activeTutors}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-300" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Tổng buổi học</p>
                <p className="text-2xl font-bold text-purple-600">
                  {data?.stats.totalSessions.toLocaleString()}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-300" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-blue-600">
                  {data?.stats.systemUptime}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-300" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => navigate("/admin/users")}
            className="h-20 bg-brand-gradient text-white flex-col"
          >
            <Users className="h-6 w-6 mb-2" /> Quản lý User
          </Button>
          <Button
            onClick={() => syncMutation.mutate()}
            className="h-20 bg-[#A7C6ED] text-[#0388B4] flex-col hover:bg-[#8fb3e8]"
          >
            <RefreshCw className="h-6 w-6 mb-2" /> Đồng bộ Datacore
          </Button>
          <Button
            onClick={() => navigate("/admin/analytics")}
            className="h-20 bg-[#A7C6ED] text-[#0388B4] flex-col hover:bg-[#8fb3e8]"
          >
            <BarChart3 className="h-6 w-6 mb-2" /> Báo cáo
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col border-[#0388B4] text-[#0388B4]"
          >
            <Settings className="h-6 w-6 mb-2" /> Cấu hình
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Alerts & Health */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" /> Cảnh báo
                  hệ thống
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-center p-3 border-l-4 rounded bg-white ${
                        alert.type === "error"
                          ? "border-red-500"
                          : "border-yellow-500"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.msg}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                      <Badge variant="outline">
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#0388B4]" /> Chờ phê
                    duyệt
                  </div>
                  <Badge className="bg-[#0388B4]">
                    {data?.stats.pendingApprovals}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.pendingApprovals.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 border rounded-lg bg-white"
                    >
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.type === "tutor_registration"
                            ? "Đăng ký gia sư"
                            : `Rút tiền: ${item.amount?.toLocaleString()}đ`}
                        </p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 text-white"
                          onClick={() =>
                            approvalMutation.mutate({
                              id: item.id,
                              action: "approve",
                            })
                          }
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200"
                          onClick={() =>
                            approvalMutation.mutate({
                              id: item.id,
                              action: "reject",
                            })
                          }
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-[#0388B4]" /> Trạng thái
                  dịch vụ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>API Server</span>
                    <span className="text-green-600">99.9%</span>
                  </div>
                  <Progress value={99} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Database</span>
                    <span className="text-green-600">Healthy</span>
                  </div>
                  <div className="w-full h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Payment Gateway</span>
                    <span className="text-yellow-600">Latency High</span>
                  </div>
                  <div className="w-full h-2 bg-yellow-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sync Dialog */}
        <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đang đồng bộ dữ liệu</DialogTitle>
              <DialogDescription>
                Vui lòng không tắt trình duyệt...
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 flex justify-center">
              <RefreshCw className="h-12 w-12 text-[#3961c5] animate-spin" />
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
