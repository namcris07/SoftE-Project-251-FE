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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Calendar } from "../components/ui/calendar";
import { Footer } from "../components/layout/Footer";
import {
  Search,
  Star,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  Filter,
  Users,
} from "lucide-react";

export function SessionScheduling({ user, onNavigate }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sessions, setSessions] = useState([]);

  // Mock data cho buổi học
  useEffect(() => {
    setSessions([
      {
        id: 1,
        subject: "Toán cao cấp",
        date: "2025-10-27",
        time: "08:00 - 10:00",
        duration: 120,
        location: "Phòng H1-201",
        type: "offline",
        status: "scheduled",
        student: "Nguyễn Văn An",
      },
      {
        id: 2,
        subject: "Lập trình C++",
        date: "2025-10-27",
        time: "14:00 - 16:00",
        duration: 120,
        location: "Online - Zoom",
        type: "online",
        status: "completed",
        student: "Trần Quốc Bảo",
        rating: 5,
      },
    ]);
  }, []);

  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const selectedDateSessions = sessions.filter(
    (s) => s.date === selectedDateStr
  );
  const todaySessions = sessions.filter(
    (s) => s.date === new Date().toISOString().split("T")[0]
  );

  const getStatusBadge = (status) => {
    const statusMap = {
      scheduled: {
        text: "Đã lên lịch",
        className: "bg-blue-100 text-blue-800",
      },
      pending: {
        text: "Chờ xác nhận",
        className: "bg-yellow-100 text-yellow-800",
      },
      completed: {
        text: "Hoàn thành",
        className: "bg-green-100 text-green-800",
      },
      cancelled: { text: "Đã hủy", className: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[status] || {
        text: status,
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  // ========== Dữ liệu mock tutor ==========
  const availableTutors = [
    {
      id: "1",
      name: "TS. Nguyễn Văn Minh",
      subjects: ["Toán cao cấp", "Giải tích"],
      rating: 4.9,
      experience: "5 năm",
      hourlyRate: 150000,
      availability: ["Thứ 2: 14:00-18:00", "Thứ 4: 09:00-12:00"],
      totalStudents: 45,
      completedSessions: 230,
    },
    {
      id: "2",
      name: "ThS. Trần Thị Lan",
      subjects: ["Lập trình C++", "Cấu trúc dữ liệu"],
      rating: 4.8,
      experience: "3 năm",
      hourlyRate: 120000,
      availability: ["Thứ 3: 09:00-15:00", "Thứ 5: 13:00-17:00"],
      totalStudents: 32,
      completedSessions: 156,
    },
  ];

  const subjects = [
    "Tất cả",
    "Toán cao cấp",
    "Giải tích",
    "Lập trình C++",
    "Cấu trúc dữ liệu",
  ];

  const filteredTutors = availableTutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesSubject =
      !selectedSubject ||
      selectedSubject === "Tất cả" ||
      tutor.subjects.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  // ========== Student view ==========
  const renderStudentView = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-[#0388B4]" />
            <span>Tìm kiếm gia sư</span>
          </CardTitle>
          <CardDescription>
            Tìm gia sư phù hợp với nhu cầu học tập của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <Input
                placeholder="Tên gia sư hoặc môn học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Môn học</Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bộ lọc</Label>
              <Button
                variant="outline"
                className="w-full border-[#0388B4] text-[#0388B4]"
              >
                <Filter className="h-4 w-4 mr-2" />
                Lọc nâng cao
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutor list */}
      <div className="grid gap-4">
        {filteredTutors.map((tutor) => (
          <Card key={tutor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-[#A7C6ED] rounded-full flex items-center justify-center">
                  <span className="text-[#0388B4] font-medium text-xl">
                    {tutor.name.split(" ").pop()?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-lg">{tutor.name}</h3>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{tutor.rating}</span>• {tutor.experience} •{" "}
                        {tutor.totalStudents} học viên
                      </div>
                    </div>
                    <p className="font-medium text-[#0388B4]">
                      {tutor.hourlyRate.toLocaleString("vi-VN")} ₫/giờ
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {tutor.subjects.map((sub) => (
                      <Badge key={sub} className="bg-[#A7C6ED] text-[#0388B4]">
                        {sub}
                      </Badge>
                    ))}
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Lịch có thể dạy:</p>
                    <div className="flex flex-wrap gap-2">
                      {tutor.availability.map((a, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button className="bg-[#0388B4] text-white">
                      Đặt lịch học
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#0388B4] text-[#0388B4]"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ========== Tutor view ==========
  const renderTutorView = () => (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar and sessions */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-[#0388B4]" />
              <span>Lịch dạy của bạn</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Lịch dạy ngày {selectedDate.toLocaleDateString("vi-VN")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateSessions.length === 0 ? (
              <p className="text-center text-gray-500">Không có buổi học nào</p>
            ) : (
              <div className="space-y-3">
                {selectedDateSessions.map((s) => (
                  <div key={s.id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{s.subject}</p>
                        <p className="text-sm text-gray-600">SV: {s.student}</p>
                      </div>
                      <Badge className={getStatusBadge(s.status).className}>
                        {getStatusBadge(s.status).text}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-[#0388B4]" />
                      {s.time} ({s.duration} phút)
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-[#0388B4]" />
                      {s.location}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={() => onNavigate("tutor-availability")}
                className="w-full bg-[#0388B4] text-white"
              >
                Thêm khung giờ rảnh
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("dashboard")}
                className="w-full border-[#0388B4] text-[#0388B4]"
              >
                Xem yêu cầu đăng ký
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buổi học hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            {todaySessions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                Không có buổi học hôm nay
              </p>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((s) => (
                  <div key={s.id} className="border rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-[#0388B4]" />
                      <span className="text-sm font-medium">{s.time}</span>
                      <Badge
                        className={getStatusBadge(s.status).className}
                        variant="secondary"
                      >
                        {getStatusBadge(s.status).text}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{s.subject}</p>
                    <p className="text-xs text-gray-600">{s.student}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );


  // ========== Render main ==========
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              {user.role === "student"
                ? "Đặt lịch học"
                : user.role === "tutor"
                ? "Quản lý lịch dạy":""}
            </h1>
            <p className="text-gray-600">
              {user.role === "student"
                ? "Tìm và đăng ký lịch học với gia sư phù hợp"
                : user.role === "tutor"
                ? "Quản lý thời gian dạy và lịch làm việc"
                : "Giám sát và quản lý các chương trình gia sư"}
            </p>
          </div>

          {user.role === "student" && renderStudentView()}
          {user.role === "tutor" && renderTutorView()}
          {user.role === "admin" && renderAdminView()}
        </div>
      </main>

      <Footer />
    </div>
  );
}
