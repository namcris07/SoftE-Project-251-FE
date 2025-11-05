import React, { useState, useEffect } from "react";
import { Header } from "./components/layout/Header.jsx";
import { Home } from "./pages/Home.jsx";
import { LoginScreen } from "./pages/LoginScreen.jsx";
import { StudentDashboard } from "./pages/StudentDashboard.jsx";
import { TutorDashboard } from "./pages/TutorDashboard.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { SessionScheduling } from "./pages/SessionScheduling.jsx";
import { FeedbackSystem } from "./pages/FeedbackSystem.jsx";
import { PaymentScreen } from "./pages/PaymentScreen.jsx";
import { ReportsAnalytics } from "./pages/ReportsAnalytics.jsx";
import { UserManagement } from "./pages/UserManagement.jsx";
import { TutorProfile } from "./pages/TutorProfile.jsx";
import { NotificationScreen } from "./pages/NotificationScreen.jsx";
import { StudentSchedule } from "./pages/StudentSchedule.jsx";
import { DocumentManagement } from "./pages/DocumentManagement.jsx";
import { ScholarshipManagement } from "./pages/ScholarshipManagement.jsx";
import { MessageScreen } from "./pages/MessageScreen.jsx";
import { TutorAvailability } from "./pages/TutorAvailability.jsx";
import {StudentProfile} from "./pages/StudentProfile.jsx";
import { Toaster,toast } from "sonner";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(
    () => localStorage.getItem("currentScreen") 
  );
  // ✅ Khi login thành công
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentScreen("dashboard");
    setTimeout(() => {
      toast.success(`Đăng nhập thành công!`);
    }, 200);
  };
  
  // ✅ Khi reload, đọc lại user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);
  useEffect(() => {
    localStorage.setItem("currentScreen", currentScreen);
  }, [currentScreen]);
  // ✅ Khi logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    setCurrentScreen("home");
  };

  // ✅ Khi tutor cập nhật avatar
  const handleAvatarUpdate = (newAvatarUrl) => {
    setCurrentUser((prev) => {
      const updatedUser = { ...prev, avatarUrl: newAvatarUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // ✅ Khi click logo hoặc avatar
  const handleHeaderImageClick = () => {
    if (currentUser) {
      setCurrentScreen("dashboard");
      return;
    }
  };

  // ✅ Render nội dung chính
  const renderContent = () => {
    // Chưa login
    if (!currentUser) {
      if (currentScreen === "home")
        return <Home onNavigate={setCurrentScreen} />;
      if (currentScreen === "login")
        return <LoginScreen onLogin={handleLogin} />;
      return <Home onNavigate={setCurrentScreen} />;
    }

    // Đã login
    switch (currentScreen) {
      case "dashboard":
        if (currentUser.role === "student")
          return (
            <StudentDashboard
              user={currentUser}
              onNavigate={setCurrentScreen}
            />
          );
        if (currentUser.role === "tutor")
          return (
            <TutorDashboard user={currentUser} onNavigate={setCurrentScreen} />
          );
        if (currentUser.role === "admin")
          return (
            <AdminDashboard user={currentUser} onNavigate={setCurrentScreen} />
          );
        break;
      case "scheduling":
        return (
          <SessionScheduling user={currentUser} onNavigate={setCurrentScreen} />
        );
      case "feedback":
        return (
          <FeedbackSystem user={currentUser} onNavigate={setCurrentScreen} />
        );
      case "payment":
        return (
          <PaymentScreen user={currentUser} onNavigate={setCurrentScreen} />
        );
      case "reports":
        return (
          <ReportsAnalytics user={currentUser} onNavigate={setCurrentScreen} />
        );
      case "users":
        return (
          <UserManagement user={currentUser} onNavigate={setCurrentScreen} />
        );
      case "profile":
        return (
          <TutorProfile
            user={currentUser}
            onNavigate={setCurrentScreen}
            onAvatarUpdate={handleAvatarUpdate}
            setCurrentUser={setCurrentUser}
          />
        );
      case "notifications":
        return (
          <NotificationScreen
            user={currentUser}
            onNavigate={setCurrentScreen}
          />
        );
      case "student-schedule":
        return (
          <StudentSchedule user={currentUser} onNavigate={setCurrentScreen} />
        );
      case "documents":
        return (
          <DocumentManagement
            user={currentUser}
            onNavigate={setCurrentScreen}
          />
        );
      case "scholarships":
        return (
          <ScholarshipManagement
            user={currentUser}
            onNavigate={setCurrentScreen}
          />
        );
      case "messages":
        return (
          <MessageScreen user={currentUser} onNavigate={setCurrentScreen} />
        );
      case "tutor-availability":
        return (
          <TutorAvailability user={currentUser} onNavigate={setCurrentScreen} />
        );
      case "profile-student":
        return (
          <StudentProfile
            user={currentUser}
            onNavigate={setCurrentScreen}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster richColors position="top-right" />

      {currentUser && (
        <Header
          user={currentUser}
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          onLogout={handleLogout}
          onImageClick={handleHeaderImageClick} // ✅ thêm prop này
        />
      )}

      <main className={currentUser ? "pt-16" : ""}>{renderContent()}</main>
    </div>
  );
}
