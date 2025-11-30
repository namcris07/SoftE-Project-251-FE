import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge"; // Import Badge từ UI component
import { Progress } from "../../components/ui/progress";
import { Footer } from "../../components/layout/Footer";
import {
  Calendar,
  Clock,
  Upload, // ✅ ĐÃ THÊM IMPORT NÀY (Sửa lỗi ReferenceError)
  Users,
  BookOpen,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import axiosClient from "../../api/axiosClient";

// --- API CALLS THỰC TẾ ---
const fetchDashboardData = async () => {
  try {
    // 1. Lấy danh sách các lớp học của Tutor
    const coursesRes = await axiosClient.get("/courses");
    const courses = Array.isArray(coursesRes)
      ? coursesRes
      : coursesRes?.data || [];

    // 2. Lấy lịch dạy (Sessions)
    const sessionsRes = await axiosClient.get("/sessions");
    const sessions = Array.isArray(sessionsRes)
      ? sessionsRes
      : sessionsRes?.data || [];

    // 3. Tính toán số liệu thống kê
    const activeCourses = courses.length;
    const totalStudents = courses.reduce(
      (sum, c) => sum + (Number(c.current_students) || 0),
      0
    );

    const hoursTaught =
      sessions.filter((s) => s.status === "completed").length * 2;

    // 4. Lọc danh sách sinh viên chờ duyệt
    let pendingEnrollments = [];

    await Promise.all(
      courses.map(async (c) => {
        if (c.require_approval) {
          try {
            const detailRes = await axiosClient.get(`/courses/${c.id}`);
            const courseDetail = detailRes.data || detailRes;

            if (courseDetail && Array.isArray(courseDetail.students)) {
              const pending = courseDetail.students.filter(
                (s) => s.status === "pending"
              );

              pending.forEach((s) => {
                pendingEnrollments.push({
                  id: s.id,
                  enrollmentId: s.id,
                  studentName: s.name,
                  courseId: c.id,
                  courseName: c.title,
                  email: s.email,
                  requestDate: s.enrolledAt
                    ? new Date(s.enrolledAt).toLocaleDateString("vi-VN")
                    : "N/A",
                });
              });
            }
          } catch (err) {
            console.warn(`Không thể lấy chi tiết lớp ${c.id}`, err);
          }
        }
      })
    );

    // 5. Lọc lịch dạy hôm nay
    const today = new Date().toISOString().split("T")[0];
    const todaySessions = sessions.filter((s) => s.date === today);

    return {
      stats: {
        activeCourses,
        totalStudents,
        hoursTaught,
      },
      todaySessions,
      pendingEnrollments,
    };
  } catch (error) {
    console.error("Lỗi tải Dashboard:", error);
    return {
      stats: { activeCourses: 0, totalStudents: 0, hoursTaught: 0 },
      todaySessions: [],
      pendingEnrollments: [],
    };
  }
};

export function TutorDashboard({ user }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Fetch Data
  const { data, isLoading } = useQuery({
    queryKey: ["tutorDashboard"],
    queryFn: fetchDashboardData,
  });

  // 2. Mutation: Duyệt sinh viên
  const approveMutation = useMutation({
    mutationFn: async ({ courseId, studentId, action }) => {
      return await axiosClient.post(`/courses/${courseId}/approve`, {
        studentId,
        action,
      });
    },
    onSuccess: (_, vars) => {
      toast.success(
        vars.action === "approve" ? "Đã duyệt vào lớp" : "Đã từ chối"
      );
      queryClient.invalidateQueries(["tutorDashboard"]);
    },
    onError: (err) => {
      toast.error(
        "Có lỗi xảy ra: " + (err.response?.data?.message || err.message)
      );
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3961c5]"></div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chào, {user?.name || "Giảng viên"}!
            </h1>
            <p className="text-gray-500 mt-1">
              Tổng quan hoạt động giảng dạy của bạn.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/tutor/schedule")}
            >
              <Calendar className="w-4 h-4 mr-2" /> Xem lịch dạy
            </Button>
            <Button
              className="bg-brand-gradient text-white shadow-lg"
              onClick={() => navigate("/tutor/groups")}
            >
              <Plus className="w-4 h-4 mr-2" /> Tạo lớp mới
            </Button>
          </div>
        </div>

        {/* 1. Thống kê (Stats) - Hàng ngang cố định */}
        <div className="flex flex-wrap justify-between gap-6 mb-8">
          <Card className="border-none shadow-sm bg-white flex-1 min-w-[240px]">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Lớp đang mở</p>
                <p className="text-3xl font-bold text-[#3961c5] mt-1">
                  {data?.stats?.activeCourses || 0}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <BookOpen className="h-8 w-8 text-[#3961c5]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white flex-1 min-w-[240px]">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Tổng học viên
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {data?.stats?.totalStudents || 0}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white flex-1 min-w-[240px]">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Giờ đã dạy</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {data?.stats?.hoursTaught || 0}h
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* --- CỘT CHÍNH (Danh sách chờ & Lịch) --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* 2. DANH SÁCH CHỜ DUYỆT (Pending) */}
            {data?.pendingEnrollments?.length > 0 ? (
              <Card className="border-orange-200 bg-orange-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-orange-800 text-lg">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />{" "}
                    Yêu cầu chờ duyệt ({data.pendingEnrollments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.pendingEnrollments.map((req, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">
                            {req.studentName}
                          </span>
                          <span className="text-xs text-gray-400">
                            • {req.requestDate}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Đăng ký lớp:{" "}
                          <span className="text-[#3961c5] font-medium">
                            {req.courseName}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 flex-1 text-white"
                          onClick={() =>
                            approveMutation.mutate({
                              courseId: req.courseId,
                              studentId: req.id,
                              action: "approve",
                            })
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 flex-1"
                          onClick={() =>
                            approveMutation.mutate({
                              courseId: req.courseId,
                              studentId: req.id,
                              action: "reject",
                            })
                          }
                        >
                          Từ chối
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-50 border-dashed border-gray-200 shadow-none">
                <CardContent className="p-8 text-center text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Hiện tại không có yêu cầu nào cần duyệt.</p>
                </CardContent>
              </Card>
            )}

            {/* 3. LỊCH DẠY HÔM NAY */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#3961c5]" /> Lịch dạy hôm
                    nay
                  </CardTitle>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {new Date().toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.todaySessions?.length > 0 ? (
                    data.todaySessions.map((session) => (
                      <div
                        key={session.id}
                        className="group border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all bg-white"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                              >
                                {session.courseName || "Lớp học"}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  session.mode === "online"
                                    ? "text-green-600 border-green-200"
                                    : "text-gray-600 border-gray-200"
                                }
                              >
                                {session.mode?.toUpperCase() || "OFFLINE"}
                              </Badge>
                            </div>

                            <h4 className="font-bold text-lg text-gray-900 group-hover:text-[#3961c5] transition-colors">
                              {session.title}
                            </h4>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {session.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />{" "}
                                {session.location || "Chưa cập nhật"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              className="bg-[#3961c5] text-white shadow-md"
                              onClick={() =>
                                navigate(
                                  `/courses/${
                                    session.course_id || session.courseId
                                  }`
                                )
                              }
                            >
                              Vào lớp
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                      <p className="text-gray-500">
                        Hôm nay bạn không có lịch dạy nào.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- SIDEBAR (Truy cập nhanh & Mục tiêu) --- */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Truy cập nhanh</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:text-[#3961c5] hover:border-blue-200"
                  onClick={() => navigate("/tutor/groups")}
                >
                  <BookOpen className="h-6 w-6 text-blue-500" />
                  <span className="text-xs font-medium">Quản lý Lớp</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:text-[#3961c5] hover:border-blue-200"
                  onClick={() => navigate("/documents")}
                >
                  <Upload className="h-6 w-6 text-purple-500" />
                  <span className="text-xs font-medium">Tài liệu</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:text-[#3961c5] hover:border-blue-200"
                  onClick={() => navigate("/tutor/schedule")}
                >
                  <Calendar className="h-6 w-6 text-green-500" />
                  <span className="text-xs font-medium">Lịch dạy</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:text-[#3961c5] hover:border-blue-200"
                  onClick={() => navigate("/tutor/reports")}
                >
                  <BarChart3 className="h-6 w-6 text-orange-500" />
                  <span className="text-xs font-medium">Báo cáo</span>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tiến độ tháng này</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Giờ dạy thực tế</span>
                    <span className="font-bold text-gray-900">
                      {data?.stats?.hoursTaught || 0}/40 giờ
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      ((data?.stats?.hoursTaught || 0) / 40) * 100,
                      100
                    )}
                    className="h-2 bg-gray-100"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Đánh giá tích cực</span>
                    <span className="font-bold text-gray-900">95%</span>
                  </div>
                  <Progress value={95} className="h-2 bg-gray-100" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
