import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function MainLayout({ user }) {
  // Vì chúng ta dùng Outlet, component con sẽ được render vào vị trí <Outlet />
  // Header sẽ luôn nằm cố định ở trên
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header user={user} />
      {/* Thêm padding-top để nội dung không bị Header che mất (vì Header fixed) */}
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}
