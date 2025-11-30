import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner"; // Hoặc component Toast bạn đang dùng
import { CourseDetail } from "./pages/CourseDetail";
// --- Import Screens ---
import { LoginScreen } from "../src/pages/LoginScreen";
import { Home } from "../src/pages/Home"; // ✅ THÊM HOME COMPONENT

// Student Screens
import { StudentDashboard } from "../src/pages/student/StudentDashboard";
import { StudentProfile } from "../src/pages/student/StudentProfile";
import { StudentSchedule } from "../src/pages/student/StudentSchedule";
// Tutor Screens
import { TutorDashboard } from "../src/pages/tutor/TutorDashboard";
import { TutorProfile } from "../src/pages/tutor/TutorProfile";
import { TutorAvailability } from "../src/pages/tutor/TutorAvailability";
import { GroupTutoringSessions } from "../src/pages/GroupTutoringSessions";
import { TutorSchedule } from "../src/pages/tutor/TutorSchedule";
// Admin Screens
import { AdminDashboard } from "../src/pages/admin/AdminDashboard";
import { UserManagement } from "../src/pages/admin/UserManagement";
import { ReportsAnalytics } from "../src/pages/admin/ReportsAnalytics";

// Shared Screens
import { DocumentManagement } from "../src/pages/DocumentManagement";
import { MessageScreen } from "../src/pages/MessageScreen";
import { NotificationScreen } from "../src/pages/NotificationScreen";

import { MainLayout } from "./components/layout/MainLayout";
// --- Setup React Query ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Thử lại 1 lần nếu lỗi
      refetchOnWindowFocus: false, // Không tự fetch lại khi click tab khác
    },
  },
});

// --- Private Route Component ---
// Bảo vệ các trang cần đăng nhập và phân quyền
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Nếu role không khớp, đá về dashboard tương ứng hoặc trang 403
    if (userRole === "student") return <Navigate to="/student" replace />;
    if (userRole === "tutor") return <Navigate to="/tutor" replace />;
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  // Clone children để truyền props user vào (để tương thích code cũ)
  const user = {
    id: localStorage.getItem("userId") || "1",
    role: userRole,
    name: localStorage.getItem("userName") || "Người dùng",
  };

  return React.cloneElement(children, { user });
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes - KHÔNG CÓ HEADER */}
          <Route path="/" element={<Home />} /> {/* ✅ SỬA: Hiện Home page */}
          <Route path="/login" element={<LoginScreen />} />
          {/* Protected Routes - CÓ HEADER */}
          {/* Chúng ta dùng MainLayout bọc các route này lại */}
          {/* --- STUDENT --- */}
          <Route
            element={
              <PrivateRoute allowedRoles={["student"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route
              path="/student/myschedule"
              element={<StudentSchedule />}
            />{" "}
            {/* Đặt lịch */}
            <Route path="/student/groups" element={<GroupTutoringSessions />} />
          </Route>
          {/* --- TUTOR --- */}
          <Route
            element={
              <PrivateRoute allowedRoles={["tutor"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/tutor" element={<TutorDashboard />} />
            <Route path="/tutor/profile" element={<TutorProfile />} />
            <Route path="/tutor/schedule" element={<TutorSchedule />} />
            <Route path="/tutor/availability" element={<TutorAvailability />} />

            <Route path="/tutor/groups" element={<GroupTutoringSessions />} />
          </Route>
          {/* --- ADMIN --- */}
          <Route
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/analytics" element={<ReportsAnalytics />} />
          </Route>
          {/* --- SHARED --- */}
          <Route
            element={
              <PrivateRoute allowedRoles={["student", "tutor", "admin"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/documents" element={<DocumentManagement />} />
            <Route path="/messages" element={<MessageScreen />} />
            <Route path="/notifications" element={<NotificationScreen />} />
          </Route>
          <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
