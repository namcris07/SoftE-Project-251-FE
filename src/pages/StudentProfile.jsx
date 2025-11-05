import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Progress } from "../components/ui/progress";
import {
  Edit,
  Upload,
  Star,
  BookOpen,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import { userAPI, sessionAPI } from "../mock/index.js";
import { toast } from "sonner@2.0.3";

// ✅ import Footer
import { Footer } from "../components/layout/Footer";

export function StudentProfile({ user, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    name: user.full_name,
    email: user.email,
    mssv: "2012345",
    faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
    major: "Khoa học Máy tính",
    phone: "+84 912 345 678",
    address: "TP. Hồ Chí Minh",
    enrollmentYear: "2020",
    status: "active",
    bio: "Sinh viên năm 3, quan tâm đến lập trình và toán ứng dụng.",
    preferredMode: "both",
  });

  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    averageRating: 0,
  });

  const [trainingPoints, setTrainingPoints] = useState({
    totalPoints: 0,
    breakdown: { fromSessions: 0, fromRating: 0, fromMilestones: 0 },
    maxPoints: 10,
    percentage: 0,
  });

  const [workedTutors, setWorkedTutors] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const sessions = await sessionAPI.getUserSessions(user.id, "student");
      const completed = sessions.filter((s) => s.status === "completed");
      const upcoming = sessions.filter(
        (s) => s.status === "approved" && new Date(s.date) > new Date()
      );

      setStats({
        totalSessions: sessions.length,
        completedSessions: completed.length,
        upcomingSessions: upcoming.length,
        averageRating: 4.5,
      });

      setRecentSessions(sessions.slice(0, 5));

      const points = completed.length * 0.5 + 2.5;
      setTrainingPoints({
        totalPoints: points,
        breakdown: {
          fromSessions: completed.length * 0.5,
          fromRating: 1.5,
          fromMilestones: 1.0,
        },
        maxPoints: 10,
        percentage: (points / 10) * 100,
      });

      const tutorMap = new Map();
      for (const session of sessions) {
        if (!tutorMap.has(session.tutorId)) {
          tutorMap.set(session.tutorId, {
            id: session.tutorId,
            name: "TS. Nguyễn Văn Minh",
            sessionsCount: 1,
            subjects: [session.subject],
          });
        } else {
          const tutor = tutorMap.get(session.tutorId);
          tutor.sessionsCount++;
          if (!tutor.subjects.includes(session.subject)) {
            tutor.subjects.push(session.subject);
          }
        }
      }
      setWorkedTutors(Array.from(tutorMap.values()));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await userAPI.updateProfile(user.id, profileData);
      setIsEditing(false);
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Lỗi khi cập nhật hồ sơ");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* MAIN CONTENT */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Hồ sơ cá nhân
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin cá nhân và theo dõi tiến độ học tập
          </p>
        </div>

              <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>Thông tin cá nhân</span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-[#3961c5] text-[#3961c5]"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Hủy" : "Chỉnh sửa"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6 mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-[#A7C6ED] text-[#3961c5] text-xl">
                      {profileData.name
                        ? profileData.name.charAt(0).toUpperCase()
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#3961c5] hover:bg-[#2851b4]"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mssv">MSSV</Label>
                      <Input
                        id="mssv"
                        value={profileData.mssv}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            mssv: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="faculty">Khoa</Label>
                  <Input
                    id="faculty"
                    value={profileData.faculty}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        faculty: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="major">Ngành</Label>
                  <Input
                    id="major"
                    value={profileData.major}
                    onChange={(e) =>
                      setProfileData({ ...profileData, major: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="enrollmentYear">Năm nhập học</Label>
                  <Input
                    id="enrollmentYear"
                    value={profileData.enrollmentYear}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        enrollmentYear: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="bio">Giới thiệu bản thân</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-[#3961c5] hover:bg-[#2851b4]"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Buổi học gần đây</span>
              </CardTitle>
              <CardDescription>
                {stats.totalSessions} buổi học tổng cộng
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có lịch sử buổi học
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-[#3961c5]">
                          {session.subject}
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            session.status === "completed"
                              ? "bg-green-100 text-green-700 border-green-300"
                              : session.status === "approved"
                              ? "bg-blue-100 text-blue-700 border-blue-300"
                              : "bg-yellow-100 text-yellow-700 border-yellow-300"
                          }
                        >
                          {session.status === "completed"
                            ? "Đã hoàn thành"
                            : session.status === "approved"
                            ? "Đã xác nhận"
                            : "Chờ xác nhận"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{session.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => onNavigate("student-schedule")}
              >
                Xem tất cả buổi học
              </Button>
            </CardContent>
          </Card>

          {/* Worked Tutors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Gia sư đã làm việc</span>
              </CardTitle>
              <CardDescription>
                {workedTutors.length} giảng viên đã hỗ trợ bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              {workedTutors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Bạn chưa có buổi học nào
                </div>
              ) : (
                <div className="space-y-3">
                  {workedTutors.map((tutor) => (
                    <div
                      key={tutor.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-[#A7C6ED] text-[#3961c5]">
                            {tutor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {tutor.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {tutor.subjects.join(", ")}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-[#A7C6ED] text-[#3961c5] border-[#3961c5]"
                      >
                        {tutor.sessionsCount} buổi
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Training Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Điểm Rèn Luyện</span>
              </CardTitle>
              <CardDescription>
                Điểm tích lũy từ hoạt động học tập
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-4xl font-medium text-[#3961c5] mb-1">
                  {trainingPoints.totalPoints.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  / {trainingPoints.maxPoints} điểm
                </div>
                <Progress
                  value={trainingPoints.percentage}
                  className="h-2 mb-4"
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Từ buổi học</span>
                  <span className="font-medium text-green-600">
                    +{trainingPoints.breakdown.fromSessions.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Từ đánh giá cao</span>
                  <span className="font-medium text-green-600">
                    +{trainingPoints.breakdown.fromRating.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Từ milestone</span>
                  <span className="font-medium text-green-600">
                    +{trainingPoints.breakdown.fromMilestones.toFixed(1)}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => onNavigate("payment")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Xem học bổng
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate("scheduling")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Đặt lịch học mới
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate("documents")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Tài liệu học tập
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate("feedback")}
              >
                <Star className="h-4 w-4 mr-2" />
                Đánh giá gia sư
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </main>

      {/* ✅ FOOTER (luôn ở cuối trang) */}
      <Footer />
    </div>
  );
}
