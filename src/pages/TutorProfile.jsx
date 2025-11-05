import React, { useState ,useEffect} from "react";
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
import { Footer } from "../components/layout/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Calendar } from "../components/ui/calendar";
import {
  Edit,
  Star,
  Upload,
  Clock,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  GraduationCap,
  Award,
} from "lucide-react";

export function TutorProfile({ user, onNavigate, onAvatarUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  // 🌐 Dữ liệu lấy từ backend
  const [profileData, setProfileData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [originalProfile, setOriginalProfile] = useState(null);

  // 🔁 Hàm dùng chung để lấy dữ liệu hồ sơ từ backend
  const fetchTutorProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/tutor/${user?.id}/view`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      
      if (!data.error) {
        setProfileData(data.profileData);
        setSubjects(data.subjects || []);
        setAvailability(
          data.availability?.map((a) => {
            const [day, timesStr] = a.split(": ");
            const times = timesStr ? timesStr.split(", ") : [];
            return { day, times };
          }) || []
        );
        setMaterials(data.materials || []);
        setRecentFeedback(data.recentFeedback || []);
      } else {
        console.error("API error:", data.error);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  // 🔁 Gọi khi component mount hoặc khi user thay đổi
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) await fetchTutorProfile();
    };
    loadProfile();
  }, [user?.id]);

if (!profileData || !profileData.name) {
  return (
    <div className="flex items-center justify-center min-h-screen text-gray-600">
      Đang tải hồ sơ giảng viên...
    </div>
  );
}
  // 🖊️ Lưu chỉnh sửa
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:3000/api/tutor/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Hồ sơ đã được lưu thành công!");

        // 🟢 Giữ lại avatar hiện tại nếu backend không trả avatar mới
        setProfileData((prev) => ({
          ...prev,
          ...data.profileData, // cập nhật thông tin từ backend
          avatarUrl: data.avatarUrl || prev.avatarUrl,
        }));

        if (onAvatarUpdate) {
          onAvatarUpdate(data.avatarUrl || profileData.avatarUrl);
        }

        setIsEditing(false);
      } else {
        alert(`❌ Lỗi: ${data.message || data.error}`);
      }
    } catch (err) {
      console.error("❌ Lỗi khi lưu hồ sơ:", err);
      alert("Không thể kết nối máy chủ!");
    }
  };


  // cuối file StudentSchedule.jsx
  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Hồ sơ cá nhân
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin cá nhân, lịch dạy và tài liệu giảng dạy
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Profile info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-[#0388B4]" />
                    <span>Thông tin cá nhân</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile(); // 👉 Khi đang chỉnh sửa, bấm sẽ lưu
                      } else {
                        setIsEditing(true); // 👉 Khi chưa chỉnh sửa, bấm sẽ bật chế độ chỉnh
                      }
                    }}
                    className={`border-[#0388B4] text-[#0388B4] ${
                      isEditing
                        ? "bg-brand-gradient text-white hover:bg-[#036E90]"
                        : ""
                    }`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Lưu" : "Chỉnh sửa"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-6 mb-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={
                          profileData?.avatarUrl
                            ? profileData.avatarUrl.startsWith("http")
                              ? profileData.avatarUrl
                              : `http://localhost:3000${profileData.avatarUrl}`
                            : "/default-avatar.png"
                        }
                      />

                      <AvatarFallback className="bg-[#A7C6ED] text-[#0388B4] text-xl">
                        {profileData?.name?.split(" ").pop()?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>

                    {isEditing && (
                      <>
                        <input
                          type="file"
                          id="avatarInput"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            const formData = new FormData();
                            formData.append("avatar", file);

                            try {
                              const token = localStorage.getItem("token");
                              const res = await fetch(
                                "http://localhost:3000/api/tutor/upload-avatar",
                                {
                                  method: "POST",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: formData,
                                }
                              );
                              const data = await res.json();
                              if (res.ok) {
                                alert("✅ Ảnh đại diện đã được cập nhật!");
                                setProfileData((prev) => ({
                                  ...prev,
                                  avatarUrl: data.avatarUrl,
                                }));
                                if (onAvatarUpdate) {
                                  onAvatarUpdate(data.avatarUrl); // 🔄 cập nhật Header
                                }
                              } else {
                                alert(`❌ ${data.message}`);
                              }
                            } catch (err) {
                              console.error("Upload error:", err);
                              alert("❌ Lỗi khi tải ảnh lên!");
                            }
                          }}
                        />

                        <Button
                          size="sm"
                          onClick={() =>
                            document.getElementById("avatarInput").click()
                          }
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-brand-gradient hover:bg-[#2851b4]"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="flex-1 grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Họ và tên</Label>
                      <Input
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
                      <Label>Email</Label>
                      <Input
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
                      <Label>Số điện thoại</Label>
                      <Input
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
                    <div>
                      <Label>Khoa/Bộ môn</Label>
                      <Input
                        value={profileData.department}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            department: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Trình độ học vấn</Label>
                    <Input
                      value={profileData.education}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          education: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Kinh nghiệm</Label>
                    <Input
                      value={profileData.experience_years}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          experience_years: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <Label>Chuyên môn</Label>
                <Input
                  className="mb-4"
                  value={profileData.specialization}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      specialization: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                />

                <Label>Giới thiệu bản thân</Label>
                <Textarea
                  className="mb-4"
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                />

                <Label>Học phí (VNĐ/giờ)</Label>
                <Input
                  type="number"
                  value={profileData.hourlyRate}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      hourlyRate: parseInt(e.target.value),
                    })
                  }
                  disabled={!isEditing}
                />

                {isEditing && (
                  <div className="flex space-x-2 mt-6">
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-brand-gradient text-white"
                    >
                      Lưu thay đổi
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-[#0388B4]" />
                  <span>Môn học giảng dạy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="bg-[#A7C6ED] text-[#0388B4]"
                    >
                      {s}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm" className="h-6 text-xs">
                      + Thêm môn học
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[#0388B4]" />
                  <span>Lịch có thể dạy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availability.map((d) => (
                    <div
                      key={d.day}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium w-20">{d.day}</span>
                      <div className="flex flex-wrap gap-2">
                        {d.times.map((t, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-[#0388B4] border-[#0388B4]"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#0388B4]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => onNavigate("tutor-availability")}
                      className="w-full border-[#0388B4] text-[#0388B4]"
                    >
                      Cập nhật lịch dạy
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-[#0388B4]" />
                  <span>Thống kê</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Đánh giá</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{profileData.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng học viên</span>
                    <span>{profileData.totalStudents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Buổi học hoàn thành</span>
                    <span>{profileData.completedSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Học phí/giờ</span>
                    <span className="text-[#0388B4] font-medium">
                      {profileData.hourlyRate
                        ? profileData.hourlyRate.toLocaleString("vi-VN") + " ₫"
                        : "Chưa cập nhật"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Liên hệ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-[#0388B4]" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-[#0388B4]" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    onClick={() => onNavigate("scheduling")}
                    className="w-full bg-brand-gradient text-white"
                  >
                    Quản lý lịch dạy
                  </Button>
                  <Button
                    onClick={() => onNavigate("documents")}
                    variant="outline"
                    className="w-full border-[#0388B4] text-[#0388B4]"
                  >
                    Quản lý tài liệu
                  </Button>
                  <Button
                    onClick={() => onNavigate("feedback")}
                    variant="outline"
                    className="w-full"
                  >
                    Xem phản hồi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Đưa Footer ra ngoài container */}
      <Footer />
    </>
  );
}
