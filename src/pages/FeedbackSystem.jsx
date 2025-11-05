import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import PendingFeedbackCard from "@/components/feedback/PendingFeedbackCard";
import FeedbackHistoryItem from "@/components/feedback/FeedbackHistoryItem";
import TutorFeedbackStats from "@/components/feedback/TutorFeedbackStats";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Footer } from "../components/layout/Footer";
import { Star, MessageSquare, TrendingUp, Award } from "lucide-react";

export function FeedbackSystem({ user, onNavigate }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const recentSessions = [
    {
      id: "1",
      tutor: "TS. Nguyễn Văn Minh",
      subject: "Toán cao cấp",
      date: "2025-01-05",
      duration: "2 giờ",
      status: "completed",
      rated: false,
    },
    {
      id: "2",
      tutor: "ThS. Trần Thị Lan",
      subject: "Lập trình C++",
      date: "2025-01-03",
      duration: "2 giờ",
      status: "completed",
      rated: true,
      rating: 5,
      comment: "Buổi học rất hay, giảng viên nhiệt tình",
    },
  ];

  const feedbackReceived = [
    {
      id: "1",
      student: "Nguyễn Văn An",
      subject: "Toán cao cấp",
      rating: 5,
      comment:
        "Giảng viên rất nhiệt tình, giải thích dễ hiểu. Tôi đã hiểu rõ hơn về các khái niệm toán học.",
      date: "2025-01-05",
      session: "Buổi 5",
    },
    {
      id: "2",
      student: "Trần Thị Bình",
      subject: "Toán cao cấp",
      rating: 4,
      comment: "Bài giảng hay, tuy nhiên cần thêm thời gian để thực hành.",
      date: "2025-01-04",
      session: "Buổi 4",
    },
  ];

  const overallStats = {
    averageRating: 4.8,
    totalFeedback: 45,
    fiveStarCount: 32,
    fourStarCount: 10,
    threeStarCount: 2,
    twoStarCount: 1,
    oneStarCount: 0,
  };

  const handleSubmitFeedback = (sessionId) => {
    console.log("Submitting feedback:", sessionId, { rating, comment });
    setRating(0);
    setComment("");
  };

  // ---------- Student View ----------
  const renderStudentView = () => (
    <section className="space-y-6">
      {/* 🔹 Pending Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-[#0388B4]" />
            <span>Buổi học cần đánh giá</span>
          </CardTitle>
          <CardDescription>
            Hãy đánh giá các buổi học đã hoàn thành để cải thiện chất lượng
            giảng dạy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentSessions
            .filter((s) => !s.rated)
            .map((session) => (
              <div key={session.id} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-medium">{session.subject}</h3>
                    <p className="text-sm text-gray-600">
                      Gia sư: {session.tutor}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.date} • {session.duration}
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Chờ đánh giá
                  </Badge>
                </div>

                {/* Rating form */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Đánh giá chất lượng buổi học
                    </Label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="comment"
                      className="text-sm font-medium mb-2 block"
                    >
                      Nhận xét chi tiết (tùy chọn)
                    </Label>
                    <Textarea
                      id="comment"
                      placeholder="Chia sẻ trải nghiệm của bạn..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={() => handleSubmitFeedback(session.id)}
                    className="bg-brand-gradient text-white"
                    disabled={rating === 0}
                  >
                    Gửi đánh giá
                  </Button>
                </div>
              </div>
            ))}

          {recentSessions.filter((s) => !s.rated).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Không có buổi học nào cần đánh giá</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🔹 Feedback History */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử đánh giá</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions
            .filter((s) => s.rated)
            .map((session) => (
              <div key={session.id} className="border rounded-lg p-4 mb-3">
                <div className="flex justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{session.subject}</h3>
                    <p className="text-sm text-gray-600">
                      Gia sư: {session.tutor}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (session.rating || 0)
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{session.comment}</p>
                <p className="text-xs text-gray-500 mt-2">{session.date}</p>
              </div>
            ))}
        </CardContent>
      </Card>
    </section>
  );

  // ---------- Tutor View ----------
  const renderTutorView = () => (
    <section className="grid lg:grid-cols-3 gap-6">
      {/* Stats */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-[#0388B4]" />
              <span>Thống kê đánh giá</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-[#0388B4] mb-2">
              {overallStats.averageRating}
            </div>
            <div className="flex justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(overallStats.averageRating)
                      ? "text-yellow-500 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Từ {overallStats.totalFeedback} đánh giá
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-[#0388B4]" />
              <span>Xu hướng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tuần này</span>
                <span className="font-medium text-green-600">+0.2</span>
              </div>
              <div className="flex justify-between">
                <span>Tháng này</span>
                <span className="font-medium text-green-600">+0.1</span>
              </div>
              <div className="flex justify-between">
                <span>3 tháng qua</span>
                <span className="font-medium text-blue-600">+0.3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Received */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-[#0388B4]" />
              <span>Phản hồi gần đây</span>
            </CardTitle>
            <CardDescription>
              Xem và phản hồi các đánh giá từ học viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedbackReceived.map((f) => (
              <div key={f.id} className="border rounded-lg p-4 mb-3">
                <div className="flex justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{f.student}</h4>
                    <p className="text-sm text-gray-600">
                      {f.subject} • {f.session}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < f.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{f.comment}</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[#0388B4] border-[#0388B4]"
                  >
                    Phản hồi
                  </Button>
                  <Button size="sm" variant="ghost">
                    Chia sẻ
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );

  // ---------- Admin View ----------
  const renderAdminView = () => (
    <section className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        {[
          {
            value: "4.7",
            label: "Đánh giá TB hệ thống",
            color: "text-[#0388B4]",
          },
          { value: "1,234", label: "Tổng phản hồi", color: "text-green-600" },
          { value: "15", label: "Cần xử lý", color: "text-yellow-600" },
          { value: "89%", label: "Hài lòng", color: "text-purple-600" },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="p-6 text-center">
              <div className={`text-2xl font-bold mb-1 ${item.color}`}>
                {item.value}
              </div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quản lý phản hồi và đánh giá</CardTitle>
          <CardDescription>
            Giám sát và quản lý phản hồi toàn hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Button className="h-20 bg-brand-gradient text-white flex flex-col justify-center">
            <MessageSquare className="h-6 w-6 mb-1" />
            Xem báo cáo phản hồi
          </Button>
          <Button
            variant="outline"
            className="h-20 border-[#0388B4] text-[#0388B4] flex flex-col justify-center"
          >
            <TrendingUp className="h-6 w-6 mb-1" />
            Phân tích xu hướng
          </Button>
        </CardContent>
      </Card>
    </section>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {user.role === "student" && (
          <section className="space-y-6">
            {/* 🟦 Buổi học chờ đánh giá */}
            {recentSessions
              .filter((s) => !s.rated)
              .map((session) => (
                <PendingFeedbackCard
                  key={session.id}
                  session={session}
                  rating={rating}
                  onRate={setRating}
                  comment={comment}
                  onComment={setComment}
                  onSubmit={() => handleSubmitFeedback(session.id)}
                />
              ))}

            {/* 🟩 Lịch sử phản hồi */}
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử đánh giá</CardTitle>
              </CardHeader>
              <CardContent>
                {recentSessions.filter((s) => s.rated).length > 0 ? (
                  recentSessions
                    .filter((s) => s.rated)
                    .map((session) => (
                      <FeedbackHistoryItem
                        key={session.id}
                        feedback={session}
                      />
                    ))
                ) : (
                  <p className="text-gray-500">Chưa có đánh giá nào.</p>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* 🟨 Nếu là tutor */}
        {user.role === "tutor" && renderTutorView()}
        {/* 🟥 Nếu là admin thì vẫn giữ nguyên */}
        {user.role === "admin" && renderAdminView()}
      </main>

      {/* 🔹 Footer */}
      <Footer />
    </div>
  );
}
