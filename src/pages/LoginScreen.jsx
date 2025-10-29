import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Footer } from "../components/layout/Footer";
import { toast } from "sonner";
export function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: username,
          password,
        }),
      });

      const data = await res.json();
      console.log("🔌 Backend response:", data);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        onLogin({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          role: data.role,
        });
      } else {
        toast.warning("Sai tài khoản hoặc mật khẩu!");
      }
    } catch (err) {
      console.error("❌ Không kết nối được backend:", err);
      toast.error("❌ Không thể kết nối đến backend!");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen bg-[#F3F3F5] flex flex-col">
      {/* 🔹 HEADER (Navbar) */}
      <header className="bg-[#0388B4] w-full h-16 shadow-sm flex items-center px-8">
        {/* Logo + Title */}
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center">
            <img
              src="/logoBK.png"
              alt="Logo BK"
              className="w-10 h-10 object-contain bg-transparent"
            />
            <span className="text-white text-lg font-semibold leading-none"></span>
          </a>
          <h1 className="text-white text-lg font-medium ml-4">
            Tutor Support System
          </h1>
        </div>

        {/* Right side (Language + Login) */}
        <div className="ml-auto flex items-center space-x-6">
          <button className="text-white text-sm font-medium hover:underline">
            Vietnamese (vi)
          </button>
          <button className="text-white text-sm font-medium hover:underline">
            Đăng nhập
          </button>
        </div>
      </header>

      {/* 🔹 MAIN CONTENT */}
      <main className="flex justify-center py-8">
        <div className="w-full max-w-lg">
          <Card className="shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border-0 rounded-[14px] overflow-hidden">
            <CardContent className="p-4 pt-8">
              {/* Logo */}
              <div className="flex justify-center -mt-10 mb-4">
                <div className="w-48 h-48 bg-transparent rounded-full flex items-center justify-center shadow-none overflow-hidden">
                  <img
                    src="/logoBK.png"
                    alt="Logo BK"
                    className="w-[200px] h-[191px] object-contain bg-transparent"
                  />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-[#044CC8] text-xl font-medium text-center mb-2">
                Tutor Support System
              </h2>

              {/* SSO Info */}
              <p className="text-[#044CC8] text-lg text-center mb-2">
                Đăng nhập bằng tài khoản của bạn trên:
              </p>

              {/* SSO Button */}
              <Button
                variant="outline"
                className="w-full mb-2 border-[#0388B4] text-[#044CC8] hover:bg-[#0388B4] hover:text-white text-sm font-medium h-9 rounded-lg"
              >
                🏠 Tài khoản HCMUT (HCMUT account)
              </Button>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-[#0A0A0A]"
                >
                  Tên đăng nhập
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-[#F3F3F5] border-0 rounded-lg h-9"
                />

                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-[#0A0A0A]"
                >
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#F3F3F5] border-0 rounded-lg h-9"
                />

                <Button
                  type="submit"
                  className="w-full bg-[#044CC8] hover:bg-[#033aa0] text-white text-sm font-medium h-9 rounded-lg mt-2"
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>

              <div className="mt-2 text-center">
                <a href="#" className="text-sm text-[#3961C5] hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* 🔹 FOOTER (Component riêng) */}
      <Footer />
    </div>
  );
}
