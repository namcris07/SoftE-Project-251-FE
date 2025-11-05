import React from "react";
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
import { Footer } from "../components/layout/Footer";
import { Calendar, Clock, Star, Upload, Users, BarChart3 } from "lucide-react";

export function TutorDashboard({ user, onNavigate }) {
  const todaySessions = [
    {
      id: "1",
      subject: "Toán cao cấp",
      student: "Nguyễn Văn An",
      time: "14:00 - 16:00",
      location: "Phòng H1-201",
      status: "upcoming",
    },
    {
      id: "2",
      subject: "Giải tích",
      student: "Trần Thị Bình",
      time: "16:30 - 18:30",
      location: "Phòng H1-203",
      status: "confirmed",
    },
  ];

  const weeklyStats = {
    totalSessions: 12,
    completedSessions: 8,
    avgRating: 4.8,
    totalStudents: 15,
  };

  const recentFeedback = [
    {
      id: "1",
      student: "Nguyễn Văn An",
      subject: "Toán cao cấp",
      rating: 5,
      comment: "Giảng viên rất nhiệt tình, giải thích dễ hiểu",
      date: "2025-01-05",
    },
    {
      id: "2",
      student: "Lê Thị Cẩm",
      subject: "Giải tích",
      rating: 4,
      comment: "Bài giảng hay, cần thêm ví dụ thực tế",
      date: "2025-01-04",
    },
  ];

  const pendingRequests = [
    {
      id: "1",
      student: "Phạm Văn Đức",
      subject: "Lập trình C++",
      preferredTime: "Thứ 3, 9:00 - 11:00",
      requestDate: "2025-01-06",
    },
  ];

  return (
    <>
      <main>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              Chào, {user.full_name || user.email}!
            </h1>
            <p className="text-gray-600">
              Tổng quan hoạt động giảng dạy hôm nay
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Buổi học tuần này
                    </p>
                    <p className="text-2xl font-bold text-[#0388B4]">
                      {weeklyStats.totalSessions}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-[#A7C6ED]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Đã hoàn thành
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {weeklyStats.completedSessions}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-green-300" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Đánh giá trung bình
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {weeklyStats.avgRating}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-300" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Tổng học viên
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {weeklyStats.totalStudents}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-300" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Button
              onClick={() => onNavigate("scheduling")}
              className="h-20 bg-brand-gradient hover:bg-[#2851b4] text-white flex flex-col items-center justify-center space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <span>Quản lý lịch dạy</span>
            </Button>
            <Button
              onClick={() => onNavigate("feedback")}
              className="h-20 bg-[#A7C6ED] hover:bg-[#8fb3e8] text-[#0388B4] flex flex-col items-center justify-center space-y-2"
            >
              <Star className="h-6 w-6" />
              <span>Xem phản hồi</span>
            </Button>
            <Button
              onClick={() => onNavigate("documents")}
              variant="outline"
              className="h-20 border-[#0388B4] text-[#0388B4] hover:bg-brand-gradient hover:text-white flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="h-6 w-6" />
              <span>Tải tài liệu</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 border-[#0388B4] text-[#0388B4] hover:bg-brand-gradient hover:text-white flex flex-col items-center justify-center space-y-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span>Thống kê</span>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-[#0388B4]" />
                    <span>Lịch dạy hôm nay</span>
                  </CardTitle>
                  <CardDescription>
                    Thứ Hai, ngày 6 tháng 1, 2025
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaySessions.map((session) => (
                      <div
                        key={session.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {session.subject}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Học viên: {session.student}
                            </p>
                          </div>
                          <Badge
                            variant={
                              session.status === "upcoming"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              session.status === "upcoming"
                                ? "bg-brand-gradient"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {session.status === "upcoming"
                              ? "Sắp diễn ra"
                              : "Đã xác nhận"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>🕐 {session.time}</span>
                          <span>📍 {session.location}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[#0388B4] border-[#0388B4]"
                          >
                            Chi tiết
                          </Button>
                          <Button
                            size="sm"
                            className="bg-brand-gradient hover:bg-[#2851b4] text-white"
                          >
                            Bắt đầu buổi học
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Requests */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-[#0388B4]" />
                    <span>Yêu cầu đăng ký mới</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{request.student}</h4>
                            <p className="text-sm text-gray-600">
                              {request.subject}
                            </p>
                            <p className="text-sm text-gray-500">
                              Thời gian mong muốn: {request.preferredTime}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {request.requestDate}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Chấp nhận
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600"
                          >
                            Từ chối
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Feedback */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-[#0388B4]" />
                    <span>Phản hồi gần đây</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentFeedback.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="border-l-4 border-[#0388B4] pl-4"
                      >
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.rating
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm font-medium">
                          {feedback.student}
                        </p>
                        <p className="text-xs text-gray-600">
                          {feedback.subject}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {feedback.comment}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {feedback.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ tuần này</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Buổi học hoàn thành</span>
                        <span>
                          {weeklyStats.completedSessions}/
                          {weeklyStats.totalSessions}
                        </span>
                      </div>
                      <Progress
                        value={
                          (weeklyStats.completedSessions /
                            weeklyStats.totalSessions) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Đánh giá trung bình</span>
                        <span>{weeklyStats.avgRating}/5.0</span>
                      </div>
                      <Progress
                        value={(weeklyStats.avgRating / 5) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
