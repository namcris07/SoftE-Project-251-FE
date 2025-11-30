import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Switch } from "../components/ui/Switch";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  UserPlus,
  Search,
  CheckCircle,
  AlertCircle,
  Trash2,
  MoreVertical,
  Edit,
  Info,
  Star,
  GraduationCap,
  LogIn,
  Filter,
  Wifi,
  BookOpen,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import axiosClient from "../api/axiosClient";

// --- UTILS ---
const generateScheduleDates = (
  startDate,
  daysOfWeek,
  totalSessions,
  timeStr,
  durationMinutes
) => {
  const dates = [];
  let currentDate = new Date(startDate);
  let count = 0;
  const [startHour, startMinute] = timeStr.split(":").map(Number);
  while (count < totalSessions) {
    const day = currentDate.getDay();
    if (daysOfWeek.includes(day)) {
      const startDateTime = new Date(currentDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);
      const endDateTime = new Date(
        startDateTime.getTime() + durationMinutes * 60000
      );
      const endTimeStr = `${endDateTime
        .getHours()
        .toString()
        .padStart(2, "0")}:${endDateTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      dates.push({
        date: currentDate.toISOString().split("T")[0],
        time: `${timeStr} - ${endTimeStr}`,
      });
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const calculateEndTime = (startTime, durationMinutes) => {
  const [h, m] = startTime.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + Number(durationMinutes));
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const fetchCourses = async () => {
  const res = await axiosClient.get("/courses");
  return Array.isArray(res) ? res : res?.data || [];
};

const fetchTutorPublicProfile = async (tutorId) => {
  const res = await axiosClient.get(`/tutor/${tutorId}/view`);
  return res.data || res;
};

export function GroupTutoringSessions({ user: propUser }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = propUser || {
    id: localStorage.getItem("userId"),
    role: localStorage.getItem("role") || "student",
  };

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [viewingTutorId, setViewingTutorId] = useState(null);

  // --- STATE BỘ LỌC (ADVANCED FILTER) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("ALL");
  const [filterDay, setFilterDay] = useState("ALL");
  const [filterMode, setFilterMode] = useState("ALL");

  const [newCourse, setNewCourse] = useState({
    title: "",
    subject: "",
    location: "",
    max_students: 30,
    // price: 500000, // Đã bỏ price
    startDate: "",
    time: "08:00",
    duration: 90,
    requireApproval: false,
  });

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const { data: tutorDetail, isLoading: isLoadingTutor } = useQuery({
    queryKey: ["tutorPublic", viewingTutorId],
    queryFn: () => fetchTutorPublicProfile(viewingTutorId),
    enabled: !!viewingTutorId,
  });

  // --- LOGIC LỌC DỮ LIỆU ---
  // 1. Lấy danh sách môn học duy nhất để tạo Dropdown
  const uniqueSubjects = useMemo(() => {
    const subjects = courses.map((c) => c.subject);
    return [...new Set(subjects)];
  }, [courses]);

  // 2. Filter Logic
  const filteredCourses = courses.filter((c) => {
    // Lọc theo tên
    const matchName = c.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo môn
    const matchSubject = filterSubject === "ALL" || c.subject === filterSubject;

    // Lọc theo hình thức (Online/Offline)
    // Giả định: location == "Online" là online, còn lại là offline
    const isOnline = c.location?.toLowerCase() === "online";
    const matchMode =
      filterMode === "ALL" ||
      (filterMode === "ONLINE" && isOnline) ||
      (filterMode === "OFFLINE" && !isOnline);

    // Lọc theo thứ (Dựa vào schedule_text: "T2, T4...")
    // Nếu schedule_text chứa chuỗi của filterDay (VD: "T2") thì đúng
    const matchDay =
      filterDay === "ALL" ||
      (c.schedule_text && c.schedule_text.includes(filterDay));

    return matchName && matchSubject && matchMode && matchDay;
  });

  // ... (Các hàm handleOpenCreate, Edit, Mutation GIỮ NGUYÊN)
  const handleOpenCreate = () => {
    setEditingCourseId(null);
    setNewCourse({
      title: "",
      subject: "",
      location: "",
      max_students: 30,
      startDate: "",
      time: "08:00",
      duration: 90,
      requireApproval: false,
    });
    setSelectedDays([]);
    setShowCreateDialog(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourseId(course.id);
    setNewCourse({
      title: course.title,
      subject: course.subject,
      location: course.location,
      max_students: course.max_students,
      startDate: new Date().toISOString().split("T")[0],
      time: "08:00",
      duration: 90,
      requireApproval: course.require_approval,
    });
    setSelectedDays([]);
    setShowCreateDialog(true);
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      if (
        !newCourse.title ||
        !newCourse.subject ||
        !newCourse.startDate ||
        selectedDays.length === 0
      )
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      const dayLabels = selectedDays
        .sort()
        .map((d) => (d === 0 ? "CN" : `T${d + 1}`))
        .join(", ");
      const endTime = calculateEndTime(newCourse.time, newCourse.duration);
      const generatedScheduleText = `${dayLabels} (${newCourse.time} - ${endTime})`;
      const sessionDetails = generateScheduleDates(
        newCourse.startDate,
        selectedDays,
        12,
        newCourse.time,
        Number(newCourse.duration)
      );
      const payload = {
        ...newCourse,
        tutor_id: user.id,
        require_approval: newCourse.requireApproval,
        selectedDays: selectedDays,
        schedule_text: generatedScheduleText,
        sessions: sessionDetails.map((s, index) => ({
          title: `${newCourse.title} (Buổi ${index + 1})`,
          date: s.date,
          time: s.time,
          location: newCourse.location || "Online",
          mode:
            newCourse.location && newCourse.location.toLowerCase() !== "online"
              ? "offline"
              : "online",
          status: "upcoming",
        })),
      };
      return await axiosClient.post("/courses", payload);
    },
    onSuccess: () => {
      toast.success("Tạo lớp thành công!");
      setShowCreateDialog(false);
      queryClient.invalidateQueries(["courses"]);
    },
    onError: (err) => toast.error(err.message || "Lỗi tạo lớp"),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      let sessionsPayload = [];
      if (selectedDays.length > 0 && newCourse.startDate) {
        const sessionDetails = generateScheduleDates(
          newCourse.startDate,
          selectedDays,
          12,
          newCourse.time,
          Number(newCourse.duration)
        );
        sessionsPayload = sessionDetails.map((s, index) => ({
          title: `${newCourse.title} (Buổi ${index + 1})`,
          date: s.date,
          time: s.time,
          location: newCourse.location || "Online",
          status: "upcoming",
        }));
      }
      const payload = {
        ...newCourse,
        require_approval: newCourse.requireApproval,
        reset_schedule: sessionsPayload.length > 0,
        sessions: sessionsPayload,
      };
      return await axiosClient.put(`/courses/${editingCourseId}`, payload);
    },
    onSuccess: () => {
      toast.success("Cập nhật lớp thành công!");
      setShowCreateDialog(false);
      queryClient.invalidateQueries(["courses"]);
    },
    onError: (err) => toast.error("Lỗi cập nhật lớp"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (courseId) => axiosClient.delete(`/courses/${courseId}`),
    onSuccess: () => {
      toast.success("Đã xóa lớp học");
      queryClient.invalidateQueries(["courses"]);
    },
    onError: () => toast.error("Lỗi xóa lớp"),
  });

  // Register Mutation - Xử lý cả Waitlist logic (Backend tự check full chỗ)
  const registerMutation = useMutation({
    mutationFn: async (courseId) =>
      axiosClient.post(`/courses/${courseId}/register`),
    onSuccess: (data) => {
      toast.success(data?.data?.message || "Đã gửi yêu cầu!");
      queryClient.invalidateQueries(["courses"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Lỗi đăng ký"),
  });

  const cancelMutation = useMutation({
    mutationFn: async (courseId) =>
      axiosClient.post(`/courses/${courseId}/cancel`),
    onSuccess: () => {
      toast.info("Đã hủy đăng ký.");
      queryClient.invalidateQueries(["courses"]);
    },
    onError: (err) => toast.error("Lỗi hủy"),
  });

  const toggleDay = (val) => {
    setSelectedDays((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val].sort()
    );
  };
  const handleSubmit = () => {
    if (editingCourseId) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };
  const dayOptions = [
    { val: 1, label: "T2" },
    { val: 2, label: "T3" },
    { val: 3, label: "T4" },
    { val: 4, label: "T5" },
    { val: 5, label: "T6" },
    { val: 6, label: "T7" },
    { val: 0, label: "CN" },
  ];

  return (
    <div className="flex flex-col min-h-session bg-[#F9FAFB]">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Danh sách Lớp học
          </h1>
          {user.role === "tutor" && (
            <Button
              onClick={handleOpenCreate}
              className="bg-brand-gradient text-white"
            >
              <UserPlus className="w-5 h-5 mr-2" /> Mở Lớp Mới
            </Button>
          )}
        </div>

        {/* --- KHU VỰC TÌM KIẾM & BỘ LỌC (HORIZONTAL FIX) --- */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex items-center gap-4 overflow-x-auto whitespace-nowrap">
          {/* 1. Tìm kiếm tên */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 shrink-0" />
            <Input
              className="pl-9 h-10 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
              placeholder="     Tìm tên lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 2. Lọc theo môn */}
          <div className="flex items-center gap-2 min-w-[190px]">
            <select
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm
                 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="ALL">Tất cả môn</option>
              {uniqueSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Lọc theo thứ */}
          <div className="flex items-center gap-2 min-w-[170px]">
            <select
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm
                 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
            >
              <option value="ALL">Mọi ngày</option>
              <option value="T2">Thứ 2</option>
              <option value="T3">Thứ 3</option>
              <option value="T4">Thứ 4</option>
              <option value="T5">Thứ 5</option>
              <option value="T6">Thứ 6</option>
              <option value="T7">Thứ 7</option>
              <option value="CN">Chủ nhật</option>
            </select>
          </div>

          {/* 4. Lọc hình thức */}
          <div className="flex items-center gap-2 min-w-[170px]">
            <select
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm
                 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
            >
              <option value="ALL">Hình thức</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>

          {/* Reset filter */}
          {(searchTerm ||
            filterSubject !== "ALL" ||
            filterDay !== "ALL" ||
            filterMode !== "ALL") && (
            <Button
              variant="outline"
              className="h-10 border-red-300 text-red-500 hover:bg-red-50 shrink-0"
              onClick={() => {
                setSearchTerm("");
                setFilterSubject("ALL");
                setFilterDay("ALL");
                setFilterMode("ALL");
              }}
            >
              <XCircle className="w-4 h-4 shrink-0"/>
            </Button>
          )}
        </div>

        {/* --- DANH SÁCH LỚP --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 text-center py-10 text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="col-span-3 text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
              <Filter className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">
                Không tìm thấy lớp học nào phù hợp.
              </p>
            </div>
          ) : (
            filteredCourses.map((course) => {
              // Logic tính toán chỗ trống
              const remainingSpots =
                course.max_students - course.current_students;
              const isFull = remainingSpots <= 0;
              const isAlmostFull = remainingSpots > 0 && remainingSpots <= 3;

              return (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-all border-l-4 border-l-[#3961c5] cursor-pointer flex flex-col group relative"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  {/* Menu Tutor (Giữ nguyên) */}
                  {user.role === "tutor" && (
                    <div
                      className="absolute top-3 right-3 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-white/80 hover:bg-white hover:shadow-sm rounded-full"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(course)}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              if (confirm("Xóa lớp?"))
                                deleteMutation.mutate(course.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  <CardHeader className="pb-3 pr-10">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700"
                      >
                        {course.subject}
                      </Badge>

                      {/* ✅ LOGIC HIỂN THỊ TRẠNG THÁI (ĐÃ SỬA) */}
                      {course.is_registered ? (
                        course.enrollment_status === "pending" ? (
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                            <AlertCircle className="w-3 h-3 mr-1" /> Chờ duyệt
                          </Badge>
                        ) : course.enrollment_status === "waitlist" ? (
                          // 👇 HIỂN THỊ RIÊNG CHO WAITLIST
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200 animate-pulse">
                            <Clock className="w-3 h-3 mr-1" /> Hàng chờ
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" /> Đã tham gia
                          </Badge>
                        )
                      ) : isFull ? (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600 border-gray-200"
                        >
                          Đã đầy
                        </Badge>
                      ) : isAlmostFull ? (
                        <Badge className="bg-red-50 text-red-600 border-red-100">
                          🔥 Còn {remainingSpots} chỗ
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Còn {remainingSpots} chỗ
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="text-lg text-[#3961c5] line-clamp-2 group-hover:underline">
                      {course.title}
                    </CardTitle>

                    {/* Tutor Profile Clickable */}
                    <div
                      className="flex items-center gap-2 mt-1 text-sm text-gray-500 hover:text-[#3961c5] w-fit p-1 -ml-1 rounded-md hover:bg-blue-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingTutorId(course.tutor_id);
                      }}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${course.tutor_name}`}
                        />
                        <AvatarFallback>T</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        GV: {course.tutor_name}
                      </span>
                      <Info className="w-3 h-3" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 flex-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-[#3961c5]" />{" "}
                      {course.duration} phút/buổi
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-[#3961c5]" />{" "}
                      {course.location || "Online"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#3961c5]" />
                      <span
                        className="truncate max-w-[200px]"
                        title={
                          course.schedule_text ||
                          (course.sessions && course.sessions.length > 0
                            ? `${course.sessions[0].time} (${new Date(
                                course.sessions[0].date
                              ).toLocaleDateString("vi-VN")})`
                            : "Chưa cập nhật lịch")
                        }
                      >
                        {course.schedule_text
                          ? course.schedule_text
                          : course.sessions && course.sessions.length > 0
                          ? `${course.sessions[0].time} (${new Date(
                              course.sessions[0].date
                            ).toLocaleDateString("vi-VN", {
                              weekday: "short",
                            })})`
                          : "Chưa cập nhật"}
                      </span>
                    </div>

                    <div className="pt-4 mt-auto">
                      {user.role === "student" &&
                        (course.is_registered ? (
                          <div className="flex gap-2 w-full">
                            {/* Nút Vào lớp chỉ hiện khi Active */}
                            {course.enrollment_status === "active" && (
                              <Button
                                className="flex-1 bg-[#3961c5] text-white hover:bg-blue-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/courses/${course.id}`);
                                }}
                              >
                                <LogIn className="w-4 h-4 mr-2" /> Vào lớp
                              </Button>
                            )}

                            {/* Nút Hủy (Xử lý cả Hủy học và Rời Waitlist) */}
                            <Button
                              variant="outline"
                              className={`text-red-600 border-red-200 hover:bg-red-50 ${
                                course.enrollment_status !== "active"
                                  ? "w-full"
                                  : "px-3"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("Xác nhận hủy?"))
                                  cancelMutation.mutate(course.id);
                              }}
                            >
                              {course.enrollment_status === "waitlist" ? (
                                "Rời hàng chờ"
                              ) : course.enrollment_status === "active" ? (
                                <Trash2 className="w-4 h-4" />
                              ) : (
                                "Hủy yêu cầu"
                              )}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className={`w-full text-white ${
                              isFull ? "bg-brand-gradient" : "bg-brand-gradient"
                            }`}
                            disabled={registerMutation.isPending}
                            onClick={(e) => {
                              e.stopPropagation();
                              registerMutation.mutate(course.id);
                            }}
                          >
                            {course.require_approval
                              ? "Gửi yêu cầu"
                              : isFull
                              ? "Đăng ký Waitlist"
                              : "Đăng ký ngay"}
                          </Button>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* --- DIALOG TẠO/SỬA (Giữ nguyên code cũ) --- */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          {/* ... (Copy lại nội dung Dialog từ code trước của bạn) ... */}
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCourseId ? "Chỉnh sửa lớp học" : "Mở lớp học mới"}
              </DialogTitle>
              <DialogDescription>
                Điền đầy đủ thông tin chi tiết về lớp học.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label>
                    Tên lớp học <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="VD: Toán Cao Cấp"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label>
                    Môn học <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="VD: Toán"
                    value={newCourse.subject}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, subject: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-1">
                  <Label>Sĩ số</Label>
                  <Input
                    type="number"
                    value={newCourse.max_students}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        max_students: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label>Địa điểm</Label>
                  <Input
                    placeholder="Phòng học / Online"
                    value={newCourse.location}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, location: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="border-t pt-4 mt-2">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Ngày bắt đầu</Label>
                    <Input
                      type="date"
                      value={newCourse.startDate}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Giờ học</Label>
                    <Input
                      type="time"
                      value={newCourse.time}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, time: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Thời lượng (phút)</Label>
                    <Input
                      type="number"
                      value={newCourse.duration}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, duration: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <Label>Lịch học trong tuần</Label>
                  <div className="flex gap-2">
                    {dayOptions.map((d) => (
                      <div
                        key={d.val}
                        onClick={() => toggleDay(d.val)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border font-medium transition-all ${
                          selectedDays.includes(d.val)
                            ? "bg-[#3961c5] text-white border-[#3961c5]"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {d.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 mt-2">
                <div>
                  <Label className="text-base font-semibold">
                    Yêu cầu phê duyệt
                  </Label>
                </div>
                <Switch
                  value={newCourse.requireApproval}
                  onChange={(val) =>
                    setNewCourse({ ...newCourse, requireApproval: val })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-brand-gradient text-white"
              >
                {editingCourseId ? "Cập nhật" : "Tạo lớp ngay"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- DIALOG XEM TUTOR PROFILE (Giữ nguyên) --- */}
        <Dialog
          open={!!viewingTutorId}
          onOpenChange={() => setViewingTutorId(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thông tin Giảng viên</DialogTitle>
              <DialogDescription>Xem thông tin chi tiết</DialogDescription>
            </DialogHeader>
            {isLoadingTutor ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : tutorDetail ? (
              <div className="space-y-6 pt-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-blue-100">
                    <AvatarImage src={tutorDetail.profileData?.avatarUrl} />
                    <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                      {tutorDetail.profileData?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {tutorDetail.profileData?.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>
                        {tutorDetail.profileData?.department ||
                          "Chưa cập nhật khoa"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-bold">
                        {tutorDetail.profileData?.rating || 5.0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Giới thiệu
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {tutorDetail.profileData?.bio ||
                      "Giảng viên chưa cập nhật phần giới thiệu."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-red-500 py-4">
                Lỗi tải thông tin.
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setViewingTutorId(null)}
              >
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
