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
import { Footer } from "../components/layout/Footer";
import {
  Calendar,
  Clock,
  Star,
  BookOpen,
  User as UserIcon,
  CreditCard,
} from "lucide-react";

export function StudentDashboard({ user, onNavigate }) {
  const upcomingSessions = [
    {
      id: "1",
      subject: "Toán cao cấp",
      tutor: "TS. Nguyễn Văn Minh",
      date: "2025-01-08",
      time: "14:00 - 16:00",
      location: "Phòng H1-201",
      status: "confirmed",
    },
    {
      id: "2",
      subject: "Lập trình C++",
      tutor: "ThS. Trần Thị Lan",
      date: "2025-01-10",
      time: "09:00 - 11:00",
      location: "Lab C4-301",
      status: "pending",
    },
  ];

  const recentFeedback = [
    {
      id: "1",
      tutor: "TS. Nguyễn Văn Minh",
      subject: "Toán cao cấp",
      rating: 5,
      comment: "Giảng viên rất nhiệt tình và kiến thức sâu rộng",
      date: "2025-01-05",
    },
  ];

  const availableMaterials = [
    {
      id: "1",
      title: "Bài giảng Toán cao cấp - Chương 3",
      tutor: "TS. Nguyễn Văn Minh",
      type: "PDF",
      uploadDate: "2025-01-05",
    },
    {
      id: "2",
      title: "Bài tập lập trình C++ cơ bản",
      tutor: "ThS. Trần Thị Lan",
      type: "ZIP",
      uploadDate: "2025-01-03",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {/* 🟦 Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Xin chào, {user.full_name || user.email}!
          </h1>
          <p className="text-gray-600">
            Chào mừng bạn đến với hệ thống gia sư HCMUT
          </p>
        </div>

        {/* 🟩 Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => onNavigate("scheduling")}
            className="h-24 bg-[#0388B4] hover:bg-[#2851b4] text-white flex flex-col items-center justify-center space-y-2"
          >
            <Calendar className="h-6 w-6" />
            <span>Đặt lịch học</span>
          </Button>

          <Button
            onClick={() => onNavigate("feedback")}
            className="h-24 bg-[#A7C6ED] hover:bg-[#8fb3e8] text-[#0388B4] flex flex-col items-center justify-center space-y-2"
          >
            <Star className="h-6 w-6" />
            <span>Đánh giá gia sư</span>
          </Button>

          <Button
            onClick={() => onNavigate("payment")}
            className="h-24 bg-[#0388B4] hover:bg-[#2851b4] text-white flex flex-col items-center justify-center space-y-2"
          >
            <CreditCard className="h-6 w-6" />
            <span>Thanh toán</span>
          </Button>

          <Button
            onClick={() => onNavigate("documents")}
            variant="outline"
            className="h-24 border-[#0388B4] text-[#0388B4] hover:bg-[#0388B4] hover:text-white flex flex-col items-center justify-center space-y-2"
          >
            <BookOpen className="h-6 w-6" />
            <span>Tài liệu học tập</span>
          </Button>
        </div>

        {/* 🟨 Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 🔸 Upcoming Sessions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[#0388B4]" />
                  <span>Lịch học sắp tới</span>
                </CardTitle>
                <CardDescription>
                  Các buổi học đã đăng ký trong tuần này
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {session.subject}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <UserIcon className="h-4 w-4 mr-1" />
                            {session.tutor}
                          </p>
                        </div>
                        <Badge
                          variant={
                            session.status === "confirmed"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            session.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {session.status === "confirmed"
                            ? "Đã xác nhận"
                            : "Chờ xác nhận"}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📅 {session.date}</span>
                        <span>🕐 {session.time}</span>
                        <span>📍 {session.location}</span>
                      </div>
                    </div>
                  ))}

                  {upcomingSessions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Chưa có lịch học nào được đăng ký</p>
                      <Button
                        onClick={() => onNavigate("scheduling")}
                        className="mt-4 bg-[#0388B4] hover:bg-[#2851b4] text-white"
                      >
                        Đặt lịch học ngay
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 🔹 Sidebar (Feedback + Materials) */}
          <div className="space-y-6">
            {/* Recent Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-[#0388B4]" />
                  <span>Đánh giá gần đây</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {recentFeedback.length > 0 ? (
                  <div className="space-y-3">
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
                        <p className="text-sm font-medium">{feedback.tutor}</p>
                        <p className="text-xs text-gray-600">
                          {feedback.subject}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {feedback.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Chưa có đánh giá nào
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Available Materials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-[#0388B4]" />
                  <span>Tài liệu mới</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availableMaterials.length > 0 ? (
                  <div className="space-y-3">
                    {availableMaterials.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-start space-x-3 p-3 border rounded hover:bg-gray-50"
                      >
                        <div className="w-8 h-8 bg-[#A7C6ED] rounded flex items-center justify-center">
                          <span className="text-xs font-medium text-[#0388B4]">
                            {m.type}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {m.title}
                          </p>
                          <p className="text-xs text-gray-600">{m.tutor}</p>
                          <p className="text-xs text-gray-500">
                            {m.uploadDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Chưa có tài liệu nào
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      {/* 🔻 Footer */}
      <Footer />
    </div>
  );
}