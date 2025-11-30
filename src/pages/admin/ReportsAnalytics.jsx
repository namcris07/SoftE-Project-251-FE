import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Footer } from "../../components/layout/Footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Filter,
  TrendingUp,
  Users,
  BookOpen,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react";

export function ReportsAnalytics({ user, onNavigate }) {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  const sessionData = [
    { month: "T1", sessions: 45, completed: 42, cancelled: 3 },
    { month: "T2", sessions: 52, completed: 48, cancelled: 4 },
    { month: "T3", sessions: 38, completed: 36, cancelled: 2 },
    { month: "T4", sessions: 61, completed: 58, cancelled: 3 },
    { month: "T5", sessions: 55, completed: 52, cancelled: 3 },
    { month: "T6", sessions: 67, completed: 64, cancelled: 3 },
  ];

  const subjectDistribution = [
    { name: "Toán cao cấp", value: 35, color: "#3961c5" },
    { name: "Lập trình", value: 25, color: "#A7C6ED" },
    { name: "Vật lý", value: 20, color: "#2851b4" },
    { name: "Hóa học", value: 12, color: "#6b8dd6" },
    { name: "Khác", value: 8, color: "#d1dfed" },
  ];

  const performanceData = [
    { week: "T1", rating: 4.2, sessions: 12 },
    { week: "T2", rating: 4.5, sessions: 15 },
    { week: "T3", rating: 4.3, sessions: 10 },
    { week: "T4", rating: 4.7, sessions: 18 },
    { week: "T5", rating: 4.8, sessions: 16 },
    { week: "T6", rating: 4.6, sessions: 14 },
  ];

  const topTutors = [
    { name: "TS. Nguyễn Văn Minh", rating: 4.9, sessions: 45, students: 23 },
    { name: "PGS. Lê Hoàng Nam", rating: 4.8, sessions: 38, students: 19 },
    { name: "ThS. Trần Thị Lan", rating: 4.7, sessions: 42, students: 21 },
    { name: "TS. Phạm Văn Thành", rating: 4.6, sessions: 35, students: 18 },
  ];

  const systemMetrics = {
    totalUsers: 1247,
    activeTutors: 89,
    totalSessions: 3456,
    avgRating: 4.7,
    completionRate: 94.2,
    userGrowth: 12.3,
  };

  // --- OVERVIEW ---
  const renderOverviewReport = () => (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Thống kê tổng quan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-[#3961c5] rounded-lg text-white">
              <div className="text-2xl font-bold">
                {systemMetrics.totalSessions.toLocaleString()}
              </div>
              <div className="text-sm opacity-90">Tổng buổi học</div>
            </div>
            <div className="text-center p-4 bg-green-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {systemMetrics.avgRating}
              </div>
              <div className="text-sm opacity-90">Đánh giá TB</div>
            </div>
            <div className="text-center p-4 bg-blue-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {systemMetrics.activeTutors}
              </div>
              <div className="text-sm opacity-90">Gia sư hoạt động</div>
            </div>
            <div className="text-center p-4 bg-purple-500 rounded-lg text-white">
              <div className="text-2xl font-bold">
                {systemMetrics.completionRate}%
              </div>
              <div className="text-sm opacity-90">Tỷ lệ hoàn thành</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Xu hướng buổi học</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#3961c5" />
              <Bar dataKey="cancelled" fill="#ff6b6b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phân bố môn học</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={subjectDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {subjectDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {subjectDistribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span>{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gia sư xuất sắc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topTutors.map((t, i) => (
              <div
                key={t.name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#3961c5] text-white rounded-full flex items-center justify-center font-medium">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <div className="text-sm text-gray-600 flex space-x-2">
                      <span>⭐ {t.rating}</span>
                      <span>• {t.sessions} buổi</span>
                      <span>• {t.students} HV</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // --- PERFORMANCE ---
  const renderPerformanceReport = () => (
    <Card>
      <CardHeader>
        <CardTitle>Hiệu suất theo thời gian</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis yAxisId="left" domain={[3.5, 5]} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="rating"
              stroke="#3961c5"
              strokeWidth={2}
              name="Đánh giá"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="sessions"
              stroke="#A7C6ED"
              strokeWidth={2}
              name="Buổi học"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  // --- FINANCIAL ---
  const renderFinancialReport = () => (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          {[
            { month: "Tháng 1", revenue: 45000000, growth: 12.5 },
            { month: "Tháng 2", revenue: 52000000, growth: 15.6 },
            { month: "Tháng 3", revenue: 48000000, growth: -7.7 },
            { month: "Tháng 4", revenue: 61000000, growth: 27.1 },
            { month: "Tháng 5", revenue: 58000000, growth: -4.9 },
            { month: "Tháng 6", revenue: 65000000, growth: 12.1 },
          ].map((item) => (
            <div
              key={item.month}
              className="flex items-center justify-between p-3 border rounded"
            >
              <span className="font-medium">{item.month}</span>
              <div className="text-right">
                <div className="font-medium">
                  {item.revenue.toLocaleString("vi-VN")} ₫
                </div>
                <div
                  className={`text-sm ${
                    item.growth >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.growth >= 0 ? "+" : ""}
                  {item.growth}%
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 text-center bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">94.2%</div>
              <div className="text-sm text-green-700">Thanh toán đúng hạn</div>
            </div>
            <div className="p-4 text-center bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-yellow-600">5.8%</div>
              <div className="text-sm text-yellow-700">Thanh toán trễ</div>
            </div>
          </div>
          <p className="text-sm font-medium mb-2">
            Phương thức thanh toán phổ biến
          </p>
          {["VNPay", "MoMo", "Chuyển khoản"].map((method, i) => (
            <div
              key={method}
              className="flex justify-between items-center mb-2 text-sm"
            >
              <span>{method}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-[#3961c5] rounded-full"
                    style={{ width: `${45 - i * 10}%` }}
                  ></div>
                </div>
                <span>{45 - i * 10}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Báo cáo & Thống kê
          </h1>
          <p className="text-gray-600">
            Phân tích dữ liệu và hiệu suất hệ thống gia sư HCMUT
          </p>
        </header>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn loại báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Tổng quan</SelectItem>
                <SelectItem value="performance">Hiệu suất</SelectItem>
                <SelectItem value="financial">Tài chính</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="quarter">Quý này</SelectItem>
                <SelectItem value="year">Năm này</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="border-[#3961c5] text-[#3961c5]"
            >
              <Filter className="h-4 w-4 mr-2" /> Bộ lọc
            </Button>
            <Button className="bg-[#3961c5] hover:bg-[#2851b4] text-white">
              <Download className="h-4 w-4 mr-2" /> Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Report content */}
        {selectedReport === "overview" && renderOverviewReport()}
        {selectedReport === "performance" && renderPerformanceReport()}
        {selectedReport === "financial" && renderFinancialReport()}

        {/* Quick Stats */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-[#3961c5] rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Người dùng mới</p>
                <p className="font-medium">+{systemMetrics.userGrowth}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
                <p className="font-medium">{systemMetrics.completionRate}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đánh giá TB</p>
                <p className="font-medium">{systemMetrics.avgRating}/5.0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tăng trưởng</p>
                <p className="font-medium text-green-600">+15.2%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
