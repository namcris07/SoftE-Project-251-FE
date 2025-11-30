import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Footer } from "../../components/layout/Footer";
import {
  Calendar,
  Clock,
  BookOpen,
  User as UserIcon,
  CreditCard,
  Search,
  MapPin,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";

// --- API FETCHING ---
const fetchDashboardData = async () => {
  try {
    const scheduleRes = await axiosClient.get("/sessions/my-schedule");
    const sessions = Array.isArray(scheduleRes)
      ? scheduleRes
      : scheduleRes.data || [];

    // 1. Tính toán mốc thời gian
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 0h sáng hôm nay

    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3); // 0h sáng 3 ngày sau
    threeDaysLater.setHours(23, 59, 59, 999); // Đến hết ngày thứ 3

    // 2. Lọc buổi học trong khoảng [Hôm nay -> 3 ngày tới]
    const upcomingSessions = sessions
      .filter((s) => {
        const sessionDate = new Date(s.date);
        // Lấy những buổi >= hôm nay VÀ <= 3 ngày tới
        return sessionDate >= today && sessionDate <= threeDaysLater;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // 2. Lấy danh sách lớp học đã đăng ký (để hiển thị nhanh)
    const coursesRes = await axiosClient.get("/courses"); // API này cần trả về lớp user đã đăng ký
    const allCourses = Array.isArray(coursesRes)
      ? coursesRes
      : coursesRes.data || [];
    // Lọc ra lớp đã đăng ký (dựa vào flag is_registered từ API getCourses)
    const myCourses = allCourses.filter((c) => c.is_registered);

    // 3. Lấy tài liệu mới nhất (Giả sử API documents hỗ trợ filter, hoặc lấy all rồi lọc)
    // Cần API /documents/my-documents hoặc filter client-side
    const docsRes = await axiosClient.get("/documents", {
      params: { limit: 5 },
    });
    const newMaterials = Array.isArray(docsRes) ? docsRes : docsRes.data || [];

    return {
      upcomingSessions,
      myCourses,
      newMaterials,
    };
  } catch (error) {
    console.error("Lỗi tải Dashboard:", error);
    return { upcomingSessions: [], myCourses: [], newMaterials: [] };
  }
};

export function StudentDashboard({ user }) {
  const navigate = useNavigate();

  // Sử dụng React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentDashboard"],
    queryFn: fetchDashboardData,
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3961c5]"></div>
      </div>
    );

  if (isError)
    return (
      <div className="p-10 text-center text-red-500">
        Không thể tải dữ liệu. Vui lòng thử lại sau.
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Xin chào, {user?.name || "Sinh viên"}!
          </h1>
          <p className="text-gray-500">
            Chào mừng bạn quay trở lại hệ thống học tập.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => navigate("/student/groups")}
            variant="outline"
            className="h-24 border-[#0388B4] text-[#0388B4] hover:bg-[#0388B4] hover:text-white flex flex-col items-center justify-center space-y-2 transition-colors"
          >
            <div className="p-2 bg-blue-50 rounded-full">
              <Search className="h-6 w-6" />
            </div>
            <span className="font-medium">Tìm lớp học</span>
          </Button>

          <Button
            onClick={() => navigate("/student/myschedule")}
            className="h-24 bg-brand-gradient text-white flex flex-col items-center justify-center space-y-2 hover:opacity-90 hover:shadow-lg transition-all"
          >
            <div className="p-2 bg-white/20 rounded-full">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="font-medium">Lịch học của tôi</span>
          </Button>

          <Button
            onClick={() => navigate("/student/profile")}
            variant="outline"
            className="h-24 border-[#0388B4] text-[#0388B4] hover:bg-[#0388B4] hover:text-white flex flex-col items-center justify-center space-y-2 transition-colors"
          >
            <div className="p-2 bg-orange-50 rounded-full">
              <CreditCard className="h-6 w-6 text-orange-500" />
            </div>
            <span className="font-medium">Hồ sơ</span>
          </Button>

          <Button
            onClick={() => navigate("/documents")}
            variant="outline"
            className="h-24 border-[#0388B4] text-[#0388B4] hover:bg-[#0388B4] hover:text-white flex flex-col items-center justify-center space-y-2 transition-colors"
          >
            <div className="p-2 bg-green-50 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <span className="font-medium">Kho tài liệu</span>
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cột Chính: Lịch học & Lớp học */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. LỊCH HỌC SẮP TỚI */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-[#3961c5]" /> Lịch học sắp tới
                </CardTitle>
                <CardDescription>
                  Các buổi học diễn ra trong thời gian tới
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.upcomingSessions?.length > 0 ? (
                    data.upcomingSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-xl hover:bg-blue-50/30 transition-colors bg-white group cursor-pointer"
                        onClick={() =>
                          navigate(`/courses/${session.course_id}`)
                        }
                      >
                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                          {/* Date Box */}
                          <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 text-[#3961c5] rounded-lg border border-blue-100">
                            <span className="text-xs font-bold uppercase">
                              {new Date(session.date).toLocaleDateString(
                                "vi-VN",
                                { month: "short" }
                              )}
                            </span>
                            <span className="text-xl font-bold">
                              {new Date(session.date).getDate()}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-gray-900 text-lg group-hover:text-[#3961c5] transition-colors">
                              {session.title}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />{" "}
                                {session.time}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />{" "}
                                {session.location || "Online"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              GV: {session.tutorName || "Giảng viên"}
                            </p>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="bg-[#3961c5] text-white shadow-md w-full sm:w-auto"
                        >
                          Vào lớp
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                      <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">
                        Bạn không có lịch học nào sắp tới.
                      </p>
                      <Button
                        variant="link"
                        className="text-[#3961c5]"
                        onClick={() => navigate("/student/groups")}
                      >
                        Đăng ký lớp ngay
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 2. LỚP ĐÃ ĐĂNG KÝ */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-[#3961c5]" /> Lớp học của
                  tôi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.myCourses?.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {data.myCourses.map((course) => (
                      <div
                        key={course.id}
                        className="p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer bg-white"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700"
                          >
                            {course.subject}
                          </Badge>
                          <Badge
                            className={
                              course.enrollment_status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }
                          >
                            {course.enrollment_status === "active"
                              ? "Đang học"
                              : "Chờ duyệt"}
                          </Badge>
                        </div>
                        <h4
                          className="font-bold text-gray-900 line-clamp-1"
                          title={course.title}
                        >
                          {course.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 flex items-center">
                          <UserIcon className="w-3 h-3 mr-1" />{" "}
                          {course.tutor_name || "Giảng viên"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-6">
                    Chưa đăng ký lớp học nào.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cột Phải: Tài liệu & Tin tức */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Tài liệu mới cập nhật</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.newMaterials?.length > 0 ? (
                    data.newMaterials.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                        onClick={() => navigate("/documents")}
                      >
                        <div className="w-10 h-10 bg-red-50 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-red-600 uppercase">
                            {doc.type || "PDF"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-medium text-gray-900 truncate"
                            title={doc.title}
                          >
                            {doc.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(
                              doc.created_at || doc.upload_date
                            ).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-4">
                      Không có tài liệu mới.
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 text-xs"
                  onClick={() => navigate("/documents")}
                >
                  Xem tất cả tài liệu
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
