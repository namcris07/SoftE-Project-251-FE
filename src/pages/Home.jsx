import React from "react";
import { useNavigate } from "react-router-dom"; // Sử dụng hook điều hướng
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Footer } from "../components/layout/Footer";
import { Users, Calendar, Star, TrendingUp } from "lucide-react";

export function Home() {
  // Loại bỏ prop onNavigate
  const navigate = useNavigate(); // Khởi tạo hook

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f6f8fc] to-white">
      {/* Header */}
      <header className="bg-brand-gradient w-full h-16 shadow-sm flex items-center px-8">
        {/* Logo + Title */}
        <div className="flex items-center space-x-2">
          {/* Điều hướng về trang chủ */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <img
              src="/logoBK.png"
              alt="Logo BK"
              className="w-10 h-10 object-contain bg-transparent"
            />
            <h1 className="text-white text-lg font-medium ml-4">
              Tutor Support System
            </h1>
          </button>
        </div>

        {/* Right side (Language + Login) */}
        <div className="ml-auto flex items-center space-x-6">
          <button className="text-white text-sm font-medium hover:underline">
            Vietnamese (vi)
          </button>
          <button
            onClick={() => navigate("/login")} // Sửa: Dùng navigate("/login")
            className="text-white text-sm font-medium hover:underline"
          >
            Đăng nhập
          </button>
        </div>
      </header>
      <main className="flex-1 w-full overflow-y-auto">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center py-17">
          <img src="./logoBK.png" alt="BK Logo" className="w-a h-a" />
          <h1 className="text-5xl md:text-6xl font-bold text-[#1E3B5C] mb-4 leading-tight">
            Kết nối tri thức
            <br />
            <span className="text-[#1E3B5C]">Phát triển tương lai</span>
          </h1>

          <p className="text-[#5C718A] max-w-2xl text-base font-regular md:text-lg mb-8 leading-relaxed">
            Hệ thống quản lý gia sư toàn diện dành cho sinh viên và giảng viên
            HCMUT.
            <br />
            Tìm kiếm gia sư, đặt lịch học và theo dõi tiến trình một cách dễ
            dàng.
          </p>

          <Button
            onClick={() => navigate("/login")} // Sửa: Dùng navigate("/login")
            className="bg-brand-gradient text-white px-8 py-6 rounded-lg text-lg font-semibold hover:bg-[#026d91] transition-all"
          >
            Đăng nhập ngay
          </Button>
        </section>

        {/* Statistics Section */}
        <section className="bg-brand-gradient text-white">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16">
              <div className="flex flex-col items-center justify-center space-y-3 py-8">
                <span className="text-4xl lg:text-5xl font-bold tracking-tight">
                  1,234+
                </span>
                <span className="text-lg opacity-95 font-regular">
                  Học sinh đang hoạt động
                </span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-3 py-8">
                <span className="text-4xl lg:text-5xl font-bold tracking-tight">
                  89+
                </span>
                <span className="text-lg opacity-95 font-regular">
                  Gia sư chuyên nghiệp
                </span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-3 py-8">
                <span className="text-4xl lg:text-5xl font-bold tracking-tight">
                  5,678+
                </span>
                <span className="text-lg opacity-95 font-regular">
                  Buổi học hoàn thành
                </span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-3 py-8">
                <span className="text-4xl lg:text-5xl font-bold tracking-tight">
                  4.8/5
                </span>
                <span className="text-lg opacity-95 font-regular">
                  Đánh giá trung bình
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white flex flex-col justify-center py-16">
          <div className="max-w-6xl mx-auto px-6 text-center w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3B5C] mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-[#5C718A] text-base md:text-lg mb-12">
              Hệ thống cung cấp đầy đủ công cụ để quản lý và tối ưu hóa quá
              trình học tập.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white shadow-sm border hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="bg-brand-gradient/10 rounded-lg w-12 h-12 mb-4 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-[#0388B4]" />
                  </div>
                  <h3 className="text-[#1E3B5C] font-semibold text-lg mb-2">
                    Kết nối học sinh và gia sư
                  </h3>
                  <p className="text-[#5C718A] text-sm leading-relaxed">
                    Tìm kiếm và kết nối với gia sư phù hợp với nhu cầu học tập
                    của bạn
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="bg-brand-gradient/10 rounded-lg w-12 h-12 mb-4 flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6 text-[#0388B4]" />
                  </div>
                  <h3 className="text-[#1E3B5C] font-semibold text-lg mb-2">
                    Quản lý lịch học dễ dàng
                  </h3>
                  <p className="text-[#5C718A] text-sm leading-relaxed">
                    Lên lịch và theo dõi các buổi học một cách hiệu quả
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="bg-brand-gradient/10 rounded-lg w-12 h-12 mb-4 flex items-center justify-center mx-auto">
                    <Star className="w-6 h-6 text-[#0388B4]" />
                  </div>
                  <h3 className="text-[#1E3B5C] font-semibold text-lg mb-2">
                    Đánh giá và phản hồi
                  </h3>
                  <p className="text-[#5C718A] text-sm leading-relaxed">
                    Hệ thống đánh giá minh bạch giúp cải thiện chất lượng giảng
                    dạy
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="bg-brand-gradient/10 rounded-lg w-12 h-12 mb-4 flex items-center justify-center mx-auto">
                    <TrendingUp className="w-6 h-6 text-[#0388B4]" />
                  </div>
                  <h3 className="text-[#1E3B5C] font-semibold text-lg mb-2">
                    Theo dõi tiến trình
                  </h3>
                  <p className="text-[#5C718A] text-sm leading-relaxed">
                    Báo cáo chi tiết về quá trình học tập và giảng dạy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* 🔹 FOOTER */}
      <Footer />
    </div>
  );
}
