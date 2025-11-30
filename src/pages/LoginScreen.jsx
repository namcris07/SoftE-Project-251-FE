import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import các component từ dự án của bạn
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Footer } from "../components/layout/Footer";
import axiosClient from "../api/axiosClient";

// 1. Định nghĩa luật validation cho đăng nhập thường
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export function LoginScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State để chuyển đổi giữa Login thường và SSO
  const [isSSO, setIsSSO] = useState(false);

  // 2. Setup Form cho Login thường
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Hàm xử lý chung sau khi có response thành công
  const handleLoginSuccess = (res) => {
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("userId", res.user.id);
      localStorage.setItem("userName", res.user.full_name);

      toast.success(`Xin chào, ${res.user.full_name}!`);

      switch (res.role) {
        case "admin":
          navigate("/admin");
          break;
        case "tutor":
          navigate("/tutor");
          break;
        case "student":
          navigate("/student");
          break;
        default:
          navigate("/");
      }
    }
  };

  // 3. Xử lý Đăng nhập thường
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axiosClient.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      handleLoginSuccess(res);
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Đăng nhập thất bại! Kiểm tra lại thông tin.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 4. Xử lý Đăng nhập SSO
  const onSSOLogin = async (e) => {
    e.preventDefault(); // Ngăn reload form mặc định

    // Lấy giá trị trực tiếp từ form
    const username = e.target.sso_username.value;
    const password = e.target.sso_password.value;

    if (!username || !password) {
      return toast.warning("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu SSO");
    }

    setLoading(true);
    try {
      const res = await axiosClient.post("/auth/login-sso", {
        username,
        password,
      });
      handleLoginSuccess(res);
    } catch (err) {
      console.error("SSO Login Error:", err);
      const errorMessage =
        err.response?.data?.message || "Lỗi đăng nhập SSO/CAS";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F5] flex flex-col">
      {/* HEADER */}
      <header className="bg-brand-gradient w-full h-16 shadow-sm flex items-center px-8">
        <div className="flex items-center space-x-2">
          <img
            src="/logoBK.png"
            alt="Logo BK"
            className="w-10 h-10 object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h1 className="text-white text-lg font-medium ml-4">
            Tutor Support System
          </h1>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex justify-center py-8 flex-1">
        <div className="w-full max-w-lg">
          <Card className="shadow-lg border-0 rounded-[14px] overflow-hidden">
            <CardContent className="p-6 pt-8">
              {/* Logo Center */}
              <div className="flex justify-center -mt-10 mb-4">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm p-2">
                  <img
                    src="/logoBK.png"
                    alt="Logo BK"
                    className="w-full h-full object-contain"
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/100x100?text=BK")
                    }
                  />
                </div>
              </div>

              <h2 className="text-[#044CC8] text-xl font-medium text-center mb-6">
                {isSSO ? "Đăng nhập SSO (HCMUT)" : "Đăng nhập hệ thống"}
              </h2>

              {/* Nút chuyển đổi chế độ */}
              <Button
                variant="outline"
                className={`w-full mb-4 border-[#0388B4] hover:bg-brand-gradient hover:text-white transition-colors ${
                  isSSO ? "bg-gray-100 text-gray-700" : "text-[#044CC8]"
                }`}
                onClick={() => {
                  setIsSSO(!isSSO);
                  setLoading(false);
                }}
                type="button"
              >
                {isSSO
                  ? "⬅ Quay lại đăng nhập thường"
                  : "🏠 Tài khoản HCMUT (SSO)"}
              </Button>

              {/* Chỉ hiển thị Divider khi ở chế độ thường */}
              {!isSSO && (
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Hoặc đăng nhập thường
                    </span>
                  </div>
                </div>
              )}

              {/* LOGIC HIỂN THỊ FORM */}
              {isSSO ? (
                /* --- FORM SSO --- */
                <form onSubmit={onSSOLogin} className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 mb-2 flex items-center">
                    ℹ️ Sử dụng tài khoản BKNetID (không bao gồm @hcmut.edu.vn)
                  </div>

                  <div>
                    <Label htmlFor="sso_username">Tên đăng nhập</Label>
                    <Input
                      id="sso_username"
                      name="sso_username"
                      placeholder="Ví dụ: tuan.nguyen"
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <Label htmlFor="sso_password">Mật khẩu SSO</Label>
                    <Input
                      id="sso_password"
                      name="sso_password"
                      type="password"
                      placeholder="••••••"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#0388B4] hover:bg-[#026a8d] text-white mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Đang xác thực CAS...
                      </span>
                    ) : (
                      "Đăng nhập qua SSO"
                    )}
                  </Button>
                </form>
              ) : (
                /* --- FORM THƯỜNG --- */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="student@hcmut.edu.vn"
                      autoComplete="username"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••"
                      autoComplete="current-password"
                      {...register("password")}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.password.message}
                      </span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-brand-gradient text-white mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Đang xử lý...
                      </span>
                    ) : (
                      "Đăng nhập"
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-[#3961C5] hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
