import React, { useState } from "react";
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
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Footer } from "../components/layout/Footer";
import {
  Award,
  Plus,
  Edit,
  Trash2,
  Search,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export function ScholarshipManagement({ user, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // ===== Mock Data =====
  const scholarships = [
    {
      id: "1",
      name: "Học bổng Khuyến học",
      type: "academic",
      amount: 2000000,
      description: "Học bổng dành cho sinh viên có thành tích học tập xuất sắc",
      criteria: ["GPA >= 3.5", "Không có môn học nào dưới điểm C"],
      duration: "1 học kỳ",
      maxRecipients: 50,
      currentRecipients: 23,
      status: "active",
      applicationDeadline: "2025-02-15",
    },
    {
      id: "2",
      name: "Học bổng Hỗ trợ tài chính",
      type: "financial",
      amount: 1500000,
      description: "Hỗ trợ sinh viên có hoàn cảnh khó khăn",
      criteria: ["Có giấy xác nhận hộ nghèo/cận nghèo", "GPA >= 2.5"],
      duration: "1 học kỳ",
      maxRecipients: 100,
      currentRecipients: 87,
      status: "active",
      applicationDeadline: "2025-02-20",
    },
    {
      id: "3",
      name: "Học bổng Nghiên cứu khoa học",
      type: "research",
      amount: 3000000,
      description: "Khuyến khích sinh viên tham gia nghiên cứu khoa học",
      criteria: [
        "Có đề tài nghiên cứu",
        "GPA >= 3.0",
        "Có giảng viên hướng dẫn",
      ],
      duration: "1 năm",
      maxRecipients: 20,
      currentRecipients: 12,
      status: "active",
      applicationDeadline: "2025-03-01",
    },
    {
      id: "4",
      name: "Học bổng Thể thao",
      type: "sports",
      amount: 1000000,
      description: "Dành cho sinh viên có thành tích thể thao xuất sắc",
      criteria: ["Có thành tích thể thao cấp trường trở lên", "GPA >= 2.0"],
      duration: "1 học kỳ",
      maxRecipients: 30,
      currentRecipients: 15,
      status: "inactive",
      applicationDeadline: "2025-01-31",
    },
  ];

  const applications = [
    {
      id: "1",
      studentName: "Nguyễn Văn An",
      studentEmail: "student1@hcmut.edu.vn",
      scholarshipName: "Học bổng Khuyến học",
      appliedDate: "2025-01-05",
      status: "pending",
      gpa: 3.7,
      documents: ["Bảng điểm", "Giấy xác nhận sinh viên"],
      notes: "Sinh viên có thành tích học tập tốt",
    },
    {
      id: "2",
      studentName: "Trần Thị Bình",
      studentEmail: "student2@hcmut.edu.vn",
      scholarshipName: "Học bổng Hỗ trợ tài chính",
      appliedDate: "2025-01-03",
      status: "approved",
      gpa: 2.8,
      documents: ["Bảng điểm", "Giấy xác nhận hộ nghèo"],
      notes: "Hoàn cảnh khó khăn, cần hỗ trợ",
      approvedAmount: 1500000,
    },
    {
      id: "3",
      studentName: "Lê Văn Cường",
      studentEmail: "student3@hcmut.edu.vn",
      scholarshipName: "Học bổng Khuyến học",
      appliedDate: "2025-01-02",
      status: "rejected",
      gpa: 3.2,
      documents: ["Bảng điểm"],
      notes: "Không đủ điều kiện GPA",
    },
  ];

  const recipients = [
    {
      id: "1",
      studentName: "Trần Thị Bình",
      scholarshipName: "Học bổng Hỗ trợ tài chính",
      amount: 1500000,
      awardedDate: "2025-01-06",
      semester: "HK2 2024-2025",
      status: "active",
      remainingAmount: 1500000,
      usedAmount: 0,
    },
    {
      id: "2",
      studentName: "Phạm Văn Đức",
      scholarshipName: "Học bổng Khuyến học",
      amount: 2000000,
      awardedDate: "2024-12-15",
      semester: "HK1 2024-2025",
      status: "active",
      remainingAmount: 800000,
      usedAmount: 1200000,
    },
  ];

  // ===== Helper functions =====
  const getTypeLabel = (t) =>
    t === "academic"
      ? "Học tập"
      : t === "financial"
      ? "Tài chính"
      : t === "research"
      ? "Nghiên cứu"
      : t === "sports"
      ? "Thể thao"
      : t;

  const getTypeColor = (t) =>
    t === "academic"
      ? "bg-[#A7C6ED] text-[#0388B4]"
      : t === "financial"
      ? "bg-green-100 text-green-800"
      : t === "research"
      ? "bg-purple-100 text-purple-800"
      : t === "sports"
      ? "bg-orange-100 text-orange-800"
      : "bg-gray-100 text-gray-800";

  const getStatusColor = (s) =>
    s === "active"
      ? "bg-green-100 text-green-800"
      : s === "inactive"
      ? "bg-gray-100 text-gray-800"
      : s === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : s === "approved"
      ? "bg-green-100 text-green-800"
      : s === "rejected"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";

  const getStatusLabel = (s) =>
    s === "active"
      ? "Đang mở"
      : s === "inactive"
      ? "Đã đóng"
      : s === "pending"
      ? "Chờ duyệt"
      : s === "approved"
      ? "Đã duyệt"
      : s === "rejected"
      ? "Từ chối"
      : s;

  const filteredScholarships = scholarships.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === "all" || s.status === selectedStatus;
    const matchType = selectedType === "all" || s.type === selectedType;
    return matchSearch && matchStatus && matchType;
  });

const totalApplications = applications.length;
const approvedApplications = applications.filter(
  (a) => a.status === "approved"
).length;
const pendingApplications = applications.filter(
  (a) => a.status === "pending"
).length;
const totalScholarshipAmount = scholarships.reduce(
  (sum, s) => sum + s.amount,
  0
);
  // ===== UI =====
  return (
    <div className="flex flex-col min-h-session bg-white">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Quản lý học bổng
          </h1>
          <p className="text-gray-600">
            Quản lý các chương trình học bổng và hỗ trợ tài chính cho sinh viên
          </p>
        </header>

        {/* 🟩 Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-brand-gradient rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng học bổng</p>
                <p className="font-medium">{scholarships.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng giá trị</p>
                <p className="font-medium">
                  {totalScholarshipAmount.toLocaleString("vi-VN")} ₫
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đơn đăng ký</p>
                <p className="font-medium">{applications.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chờ duyệt</p>
                <p className="font-medium text-yellow-600">
                  {pendingApplications}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🟦 Tabs */}
        <Tabs defaultValue="scholarships" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:grid-cols-4">
            <TabsTrigger value="scholarships">Học bổng</TabsTrigger>
            <TabsTrigger value="applications">Đơn đăng ký</TabsTrigger>
            <TabsTrigger value="recipients">Người nhận</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          {/* 📘 Học bổng */}
          <TabsContent value="scholarships">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-[#0388B4]" />
                    <span>Danh sách học bổng</span>
                  </CardTitle>
                  <Button className="bg-brand-gradient hover:bg-[#2851b4] text-white">
                    <Plus className="h-4 w-4 mr-1" /> Thêm mới
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label>Tìm kiếm</Label>
                    <Input
                      placeholder="Tên học bổng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Loại học bổng</Label>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="academic">Học tập</SelectItem>
                        <SelectItem value="financial">Tài chính</SelectItem>
                        <SelectItem value="research">Nghiên cứu</SelectItem>
                        <SelectItem value="sports">Thể thao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Trạng thái</Label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="active">Đang mở</SelectItem>
                        <SelectItem value="inactive">Đã đóng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-4">
              {filteredScholarships.map((s) => (
                <Card key={s.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-lg">{s.name}</h3>
                        <div className="flex space-x-2 mt-1">
                          <Badge className={getTypeColor(s.type)}>
                            {getTypeLabel(s.type)}
                          </Badge>
                          <Badge className={getStatusColor(s.status)}>
                            {getStatusLabel(s.status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#0388B4] text-lg">
                          {s.amount.toLocaleString("vi-VN")} ₫
                        </p>
                        <p className="text-sm text-gray-500">{s.duration}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{s.description}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#0388B4] border-[#0388B4]"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Chỉnh sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Xóa
                      </Button>
                      <Button size="sm" className="bg-brand-gradient text-white">
                        Chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 📗 Đơn đăng ký */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Đơn đăng ký học bổng</span>
                  <Badge className="bg-brand-gradient">
                    {pendingApplications} chờ duyệt
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applications.map((a) => (
                  <div key={a.id} className="border p-4 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{a.studentName}</h3>
                        <p className="text-sm text-gray-600">
                          {a.studentEmail}
                        </p>
                        <p className="text-sm text-gray-500">
                          Học bổng: {a.scholarshipName}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(a.status)}>
                          {getStatusLabel(a.status)}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          {a.appliedDate}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">{a.notes}</p>
                    <div className="flex space-x-2">
                      {a.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-green-600 text-white">
                            <CheckCircle className="h-4 w-4 mr-1" /> Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600"
                          >
                            <AlertCircle className="h-4 w-4 mr-1" /> Từ chối
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#0388B4] border-[#0388B4]"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 📙 Người nhận */}
          <TabsContent value="recipients">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách người nhận</CardTitle>
              </CardHeader>
              <CardContent>
                {recipients.map((r) => (
                  <div key={r.id} className="border p-4 rounded-lg mb-3">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{r.studentName}</h3>
                        <p className="text-sm text-gray-600">
                          {r.scholarshipName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Học kỳ: {r.semester}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#0388B4]">
                          {r.amount.toLocaleString("vi-VN")} ₫
                        </p>
                        <p className="text-sm text-gray-500">
                          Cấp ngày: {r.awardedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#0388B4] border-[#0388B4]"
                      >
                        Xem lịch sử
                      </Button>
                      <Button size="sm" variant="outline">
                        Gia hạn
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600"
                      >
                        Thu hồi
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ⚙️ Cài đặt (thêm lại từ bản đầy đủ) */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt hệ thống</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Tự động duyệt đơn</p>
                        <p className="text-sm text-gray-600">
                          Duyệt tự động với điều kiện đạt yêu cầu
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Tắt
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email thông báo</p>
                        <p className="text-sm text-gray-600">
                          Gửi email khi có đơn mới
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Bật
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Hạn nộp đơn mặc định</p>
                        <p className="text-sm text-gray-600">
                          Số ngày mặc định cho hạn nộp đơn
                        </p>
                      </div>
                      <Input className="w-20" defaultValue="30" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thống kê nhanh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Học bổng đang mở</span>
                      <span className="font-medium text-green-600">
                        {
                          scholarships.filter((s) => s.status === "active")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đơn chờ duyệt</span>
                      <span className="font-medium text-yellow-600">
                        {pendingApplications}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đơn đã duyệt</span>
                      <span className="font-medium text-green-600">
                        {approvedApplications}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng người nhận</span>
                      <span className="font-medium">{recipients.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tỷ lệ duyệt</span>
                      <span className="font-medium text-blue-600">
                        {(
                          (approvedApplications / totalApplications) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}