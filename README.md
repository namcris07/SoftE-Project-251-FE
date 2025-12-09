# 🎓 Tutor Support System

Hệ thống quản lý gia sư toàn diện dành cho sinh viên và giảng viên HCMUT. Ứng dụng web hỗ trợ kết nối, đặt lịch học, quản lý tài liệu và theo dõi tiến trình học tập. 

![React](https://img.shields.io/badge/React-18.3. 1-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.15-cyan)
![License](https://img.shields.io/badge/License-Private-red)

---

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt và chạy](#-cài-đặt-và-chạy)
- [Các scripts](#-các-scripts)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [API Integration](#-api-integration)
- [Docker Deployment](#-docker-deployment)
- [Liên hệ](#-liên-hệ)

---

## 🌟 Tổng quan

**Tutor Support System** là nền tảng web application được xây dựng để kết nối sinh viên và giảng viên tại Đại học Bách Khoa TPHCM, giúp quá trình học tập và giảng dạy trở nên hiệu quả và dễ dàng hơn.

### Đối tượng sử dụng: 
- **Sinh viên (Student)**: Tìm kiếm gia sư, đặt lịch học, theo dõi tiến trình
- **Giảng viên (Tutor)**: Quản lý lịch dạy, tài liệu, đánh giá học sinh
- **Quản trị viên (Admin)**: Quản lý người dùng, thống kê, phê duyệt

---

## ✨ Tính năng chính

### 🔐 Xác thực & Phân quyền
- Đăng nhập thông thường (Email/Password)
- Đăng nhập SSO (Tích hợp hệ thống Single Sign-On HCMUT)
- Phân quyền theo vai trò: Student, Tutor, Admin
- Bảo vệ route với Private Route Component

### 👨‍🎓 Chức năng Sinh viên
- **Trang chủ**: Xem danh sách khóa học, gia sư
- **Hồ sơ cá nhân**: Cập nhật thông tin, avatar, khoa/ngành
- **Lịch học**: Xem và quản lý lịch học của mình
- **Chi tiết khóa học**:  Xem thông tin buổi học, bài tập, tài liệu
- **Tin nhắn**: Chat trực tiếp với giảng viên
- **Thông báo**: Nhận thông báo về lịch học, bài tập

### 👨‍🏫 Chức năng Giảng viên
- **Dashboard**: Thống kê buổi học, học sinh, đánh giá
- **Quản lý khung giờ**: Thiết lập khung giờ rảnh để nhận lịch dạy
- **Lịch dạy**: Xem và quản lý lịch dạy của mình
- **Hồ sơ cá nhân**: Cập nhật thông tin, avatar, bộ môn, môn dạy
- **Quản lý buổi học**: Đánh dấu hoàn thành, đánh giá học sinh
- **Báo cáo tiến độ**: Xem và tạo báo cáo tiến độ cho từng học sinh

### 🛠️ Chức năng Quản trị viên
- **Dashboard**:  Tổng quan thống kê hệ thống
- **Quản lý người dùng**:  CRUD operations cho Users
- **Báo cáo & Phân tích**: Xem thống kê, biểu đồ hệ thống
- **Phê duyệt**: Duyệt đăng ký gia sư, yêu cầu thanh toán
- **Đồng bộ dữ liệu**: Sync với DataCore HCMUT

### 💬 Chức năng chung
- **Tin nhắn realtime**: Hệ thống chat 1-1
- **Quản lý tài liệu**: Upload/Download tài liệu học tập
- **Thông báo**: Hệ thống thông báo đa loại (lịch, phê duyệt, tài liệu...)
- **Responsive UI**: Giao diện responsive cho mobile/tablet/desktop

---

## 🛠️ Công nghệ sử dụng

### Frontend Framework
- **React 18.3.1** - UI Library
- **Vite 6.3.5** - Build Tool & Dev Server
- **React Router DOM 7.9.6** - Routing

### State Management & Data Fetching
- **TanStack React Query 5.90.10** - Server State Management
- **React Hook Form 7.66.1** - Form Management
- **Zod 4.1.12** - Schema Validation

### UI Components & Styling
- **TailwindCSS 4.1.15** - Utility-first CSS Framework
- **Radix UI** - Accessible Component Primitives
- **Lucide React 0.487.0** - Icon Library
- **Framer Motion 12.23.24** - Animation Library
- **Sonner 2.0.7** - Toast Notifications

### Additional Libraries
- **Axios 1.13.2** - HTTP Client
- **Moment.js 2.30.1** - Date/Time Manipulation
- **React Big Calendar 1.19.4** - Calendar Component
- **Recharts 2.15.2** - Chart Library
- **i18next 25.6.0** - Internationalization

---

## 📁 Cấu trúc dự án

```
SoftE-Project-251-FE/
├── public/                      # Static assets
│   └── logoBK.png              # Logo HCMUT
├── src/
│   ├── api/                    # API integration
│   │   └── axiosClient.js     # Axios configuration
│   ├── components/             # Reusable components
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx # Layout chính với header
│   │   │   └── Footer.jsx     # Footer component
│   │   └── ui/                # UI Components (shadcn-style)
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dialog.jsx
│   │       ├── input.jsx
│   │       ├── tabs.tsx
│   │       ├── avatar.jsx
│   │       ├── badge.jsx
│   │       └── ...  (30+ components)
│   ├── pages/                  # Page components
│   │   ├── Home.jsx           # Landing page
│   │   ├── LoginScreen.jsx    # Login page (SSO + Normal)
│   │   ├── CourseDetail.jsx   # Chi tiết khóa học
│   │   ├── MessageScreen.jsx  # Chat screen
│   │   ├── NotificationScreen.jsx # Thông báo
│   │   ├── DocumentManagement.jsx # Quản lý tài liệu
│   │   ├── student/           # Student pages
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── StudentProfile.jsx
│   │   │   └── StudentSchedule.jsx
│   │   ├── tutor/            # Tutor pages
│   │   │   ├── TutorDashboard.jsx
│   │   │   ├── TutorProfile.jsx
│   │   │   ├── TutorAvailability.jsx
│   │   │   └── TutorSchedule.jsx
│   │   └── admin/            # Admin pages
│   │       ├── AdminDashboard.jsx
│   │       ├── UserManagement.jsx
│   │       └── ReportsAnalytics.jsx
│   ├── utils/                 # Utility functions
│   ├── App.jsx               # Main App component với routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles (TailwindCSS)
├── dockerfile                 # Docker configuration
├── nginx.conf                # Nginx configuration
├── vite.config.ts           # Vite configuration
├── package.json             # Dependencies
└── index.html               # HTML template
```

---

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- **Node.js**:  >= 20.x
- **npm**: >= 10.x (hoặc yarn/pnpm)
- **Git**

### Bước 1: Clone repository

```bash
git clone https://github.com/namcris07/SoftE-Project-251-FE.git
cd SoftE-Project-251-FE
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

Hoặc sử dụng yarn: 
```bash
yarn install
```

### Bước 3: Cấu hình Environment Variables

Tạo file `.env` trong thư mục root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
# Hoặc URL backend production của bạn
```

### Bước 4: Chạy ứng dụng ở chế độ development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại:  **http://localhost:5173**

### Bước 5: Build cho production

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`

### Bước 6: Preview production build

```bash
npm run preview
```

---

## 📜 Các scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy dev server với hot reload |
---

## 📖 Hướng dẫn sử dụng

### 1. Đăng nhập
- Truy cập trang chủ tại `/`
- Click **"Đăng nhập"** trên header
- Chọn phương thức: 
  - **Đăng nhập thường**: Email + Password
  - **Đăng nhập SSO**: Username + Password HCMUT

### 2. Phân quyền & Điều hướng
Sau khi đăng nhập, hệ thống tự động chuyển hướng theo vai trò:
- **Student** → `/student`
- **Tutor** → `/tutor`
- **Admin** → `/admin`

### 3. Sử dụng chức năng
#### Sinh viên: 
1. Xem danh sách khóa học tại Dashboard
2. Đăng ký khóa học → Chờ giảng viên duyệt
3. Xem lịch học tại `/student/schedule`
4. Chat với giảng viên tại `/messages`
5. Xem bài tập và nộp bài tại chi tiết khóa học

#### Giảng viên: 
1. Thiết lập khung giờ rảnh tại `/tutor/availability`
2. Duyệt yêu cầu học của sinh viên
3. Quản lý lịch dạy tại `/tutor/schedule`
4. Đánh dấu hoàn thành buổi học và đánh giá học sinh
5. Tạo báo cáo tiến độ cho từng học sinh

#### Admin:
1. Quản lý người dùng tại `/admin/users`
2. Xem thống kê hệ thống tại `/admin`
3. Phê duyệt đăng ký gia sư mới
4. Đồng bộ dữ liệu với DataCore

---

### Các API Endpoints chính

#### Authentication
- `POST /auth/login` - Đăng nhập thường
- `POST /auth/login-sso` - Đăng nhập SSO

#### Users
- `GET /users` - Lấy danh sách users (Admin)
- `GET /users/:id` - Lấy thông tin user
- `PUT /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

#### Courses
- `GET /courses` - Lấy danh sách khóa học
- `GET /courses/:id` - Chi tiết khóa học
- `POST /courses` - Tạo khóa học mới (Tutor)
- `POST /courses/:id/enroll` - Đăng ký khóa học (Student)

#### Sessions
- `GET /sessions/availability` - Lấy khung giờ rảnh (Tutor)
- `POST /sessions/availability` - Thêm khung giờ rảnh
- `PUT /sessions/:id/complete` - Đánh dấu hoàn thành buổi học

#### Messages
- `GET /messages/conversations/: userId` - Lấy danh sách chat
- `GET /messages/:userId/: partnerId` - Lấy tin nhắn với đối tác
- `POST /messages` - Gửi tin nhắn mới

#### Notifications
- `GET /notifications` - Lấy danh sách thông báo
- `PUT /notifications/:id/read` - Đánh dấu đã đọc
- `DELETE /notifications/:id` - Xóa thông báo

---
**Built with 💙 by SofE-Newbie Team**
